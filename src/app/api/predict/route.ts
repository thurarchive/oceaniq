import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Virtual environment Python path
    const pythonPath = path.join(process.cwd(), '.venv', 'Scripts', 'python.exe');
    const scriptPath = path.join(process.cwd(), 'scratch', 'predict_single.py');
    
    return new Promise<Response>((resolve) => {
      const args = [scriptPath, JSON.stringify(body)];
      const child = spawn(pythonPath, args);
      
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
