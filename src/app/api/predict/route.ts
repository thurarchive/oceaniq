import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

// Helper to run ONNX model inference using onnxruntime-node
async function runOnnxInference(body: any) {
  const ort = await import('onnxruntime-node');

  const onnxPath = path.join(process.cwd(), 'public', 'xgboost_model.onnx');
  const siteLagsPath = path.join(process.cwd(), 'src', 'data', 'site_lags.json');

  if (!fs.existsSync(onnxPath)) {
    throw new Error(`ONNX model file not found at ${onnxPath}`);
  }

  let siteLags: Array<{
    site_id: number;
    site_name: string;
    lat: number;
    lng: number;
    lags: {
      lag_1: number;
      lag_2: number;
      lag_7: number;
      roll_mean_3: number;
      roll_mean_7: number;
    };
  }> = [];

  if (fs.existsSync(siteLagsPath)) {
    siteLags = JSON.parse(fs.readFileSync(siteLagsPath, 'utf8'));
  }

  const lat = Number(body.lat ?? -6.1);
  const lng = Number(body.lng ?? 106.8);
  const msl = Number(body.msl ?? 1.0);
  const tidesInNumber = Number(body.tides_in_number ?? 1.0);
  const weather = body.weather ?? 'Clear';
  const tides = body.tides ?? 'High';
  const dayOfYear = Number(body.day_of_year ?? 178);
  const dayOfWeek = Number(body.day_of_week ?? 2);
  const month = Number(body.month ?? 6);

  const weatherMap: Record<string, number> = { Clear: 0, Overcast: 1, Rain: 2 };
  const tidesMap: Record<string, number> = { Ebb: 0, Flood: 1, High: 2, Low: 3 };

  const weatherEncoded = weatherMap[weather] ?? 0;
  const tidesEncoded = tidesMap[tides] ?? 2;

  // Find closest station
  let closestStation = siteLags[0] ?? null;
  let minDistance = Infinity;

  for (const site of siteLags) {
    const dist = Math.sqrt(Math.pow(site.lat - lat, 2) + Math.pow(site.lng - lng, 2));
    if (dist < minDistance) {
      minDistance = dist;
      closestStation = site;
    }
  }

  const lags = closestStation ? closestStation.lags : {
    lag_1: 50.0,
    lag_2: 50.0,
    lag_7: 50.0,
    roll_mean_3: 50.0,
    roll_mean_7: 50.0
  };

  const floatInputs = new Float32Array([
    lat, lng, msl, tidesInNumber, weatherEncoded, tidesEncoded,
    dayOfYear, dayOfWeek, month,
    lags.lag_1, lags.lag_2, lags.lag_7, lags.roll_mean_3, lags.roll_mean_7
  ]);

  const tensor = new ort.Tensor('float32', floatInputs, [1, 14]);
  const session = await ort.InferenceSession.create(onnxPath);

  const feeds: Record<string, ort.Tensor> = {};
  feeds[session.inputNames[0]] = tensor;

  const results = await session.run(feeds);
  const outputTensor = results[session.outputNames[0]];
  const rawPred = (outputTensor.data as Float32Array)[0];
  const pred = Math.max(0.0, rawPred);

  return {
    predicted_density: Math.round(pred * 100) / 100,
    closest_station: closestStation ? {
      id: closestStation.site_id,
      name: closestStation.site_name,
      distance_degrees: Math.round(minDistance * 100000) / 100000
    } : { id: 1, name: 'Station 1', distance_degrees: 0 },
    lags_used: lags
  };
}

function runLocalPythonSubprocess(body: any): Promise<Response> {
  const isWindows = process.platform === 'win32';
  const venvPythonPath = isWindows
    ? path.join(process.cwd(), '.venv', 'Scripts', 'python.exe')
    : path.join(process.cwd(), '.venv', 'bin', 'python');

  const scriptPath = path.join(process.cwd(), 'scratch', 'predict_single.py');

  return new Promise<Response>((resolve) => {
    const args = [scriptPath, JSON.stringify(body)];
    const child = spawn(venvPythonPath, args);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`Subprocess exited with code ${code}. Stderr: ${stderr}`);
        resolve(NextResponse.json({ error: stderr || `Python process failed with code ${code}` }, { status: 500 }));
      } else {
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error) {
            resolve(NextResponse.json({ error: result.error }, { status: 400 }));
          } else {
            resolve(NextResponse.json(result));
          }
        } catch (err) {
          console.error('Failed to parse Python stdout:', stdout);
          resolve(NextResponse.json({ error: 'Invalid response from model pipeline' }, { status: 500 }));
        }
      }
    });
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Primary Strategy: Fast, zero-dependency ONNX runtime (Vercel & Local ready)
    try {
      const onnxResult = await runOnnxInference(body);
      return NextResponse.json(onnxResult);
    } catch (onnxErr: any) {
      console.warn('ONNX inference not available or failed:', onnxErr?.message);
    }

    // 2. External Service Proxy (if MODEL_SERVICE_URL is set)
    const modelServiceUrl = process.env.MODEL_SERVICE_URL;
    if (modelServiceUrl) {
      try {
        const response = await fetch(`${modelServiceUrl}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          return NextResponse.json(await response.json());
        }
      } catch (externalErr) {
        console.warn('External model service unreachable:', externalErr);
      }
    }

    // 3. Fallback: Local Python Virtual Environment Subprocess
    return await runLocalPythonSubprocess(body);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
