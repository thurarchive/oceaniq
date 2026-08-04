import { NextResponse } from 'next/server';
import { loadXGBoostModel, xgboostPredict } from '@/lib/xgboost-inference';
import siteLagsData from '@/data/site_lags.json';

interface SiteLagItem {
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
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ── 1. Parse inputs ────────────────────────────────────────────────────────
    const lat = Number(body.lat ?? -6.1);
    const lng = Number(body.lng ?? 106.8);
    const msl = Number(body.msl ?? 1.0);
    const tidesInNumber = Number(body.tides_in_number ?? 1.0);
    const weather: string = body.weather ?? 'Clear';
    const tides: string = body.tides ?? 'High';
    const dayOfYear = Number(body.day_of_year ?? 178);
    const dayOfWeek = Number(body.day_of_week ?? 2);
    const month = Number(body.month ?? 6);

    // Encoding maps matching the Python LabelEncoder alphabetical sort
    const weatherMap: Record<string, number> = { Clear: 0, Overcast: 1, Rain: 2 };
    const tidesMap: Record<string, number> = { Ebb: 0, Flood: 1, High: 2, Low: 3 };

    const weatherEncoded = weatherMap[weather] ?? 0;
    const tidesEncoded = tidesMap[tides] ?? 2;

    // ── 2. Find closest monitoring station for lag features ────────────────────
    const siteLags = siteLagsData as SiteLagItem[];

    let closestStation = siteLags[0]!;
    let minDistance = Infinity;

    for (const site of siteLags) {
      const dist = Math.sqrt(
        Math.pow(site.lat - lat, 2) + Math.pow(site.lng - lng, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestStation = site;
      }
    }

    const lags = closestStation.lags ?? {
      lag_1: 50.0,
      lag_2: 50.0,
      lag_7: 50.0,
      roll_mean_3: 50.0,
      roll_mean_7: 50.0,
    };

    // ── 3. Build feature vector (must match training order exactly) ────────────
    const input: Record<string, number> = {
      lat,
      lng,
      msl,
      tides_in_number: tidesInNumber,
      weather_encoded: weatherEncoded,
      tides_encoded: tidesEncoded,
      day_of_year: dayOfYear,
      day_of_week: dayOfWeek,
      month,
      debris_quantity_lag_1: lags.lag_1,
      debris_quantity_lag_2: lags.lag_2,
      debris_quantity_lag_7: lags.lag_7,
      debris_quantity_roll_mean_3: lags.roll_mean_3,
      debris_quantity_roll_mean_7: lags.roll_mean_7,
    };

    // ── 4. Load model (cached after first call) & run inference ───────────────
    const model = await loadXGBoostModel();
    const rawPred = xgboostPredict(model, input);
    const predicted_density = Math.max(0.0, Math.round(rawPred * 100) / 100);

    return NextResponse.json({
      predicted_density,
      closest_station: {
        id: closestStation.site_id,
        name: closestStation.site_name,
        distance_degrees: Math.round(minDistance * 100000) / 100000,
      },
      lags_used: lags,
      inference_method: 'pure-js-xgboost',
    });
  } catch (err: any) {
    console.error('[predict] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
