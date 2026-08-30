import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { WeatherSnapshot } from '../weather.js';
import { SingaporeWeatherClient } from '../weather.js';

const weather: WeatherSnapshot = {
  condition: 'Cloudy',
  observed_at: '2026-05-04T00:00:00Z',
  source: 'test',
  area: 'Bishan',
  valid_period_text: 'Now',
  temperature_c: 29,
  humidity_percent: 80,
  rainfall_mm: 0,
  wind_speed_knots: 4,
  wind_direction_degrees: 180,
  forecast_low_c: 25,
  forecast_high_c: 32,
  uv_index: 7,
  psi_twenty_four_hourly: 42,
  pm25_one_hourly: 9,
  air_quality_region: 'central',
  forecast_periods: [{ label: 'Now', forecast: 'Cloudy' }],
  daily_forecast: [{ date: '2026-05-04', forecast: 'Cloudy', temperature_low_c: 25, temperature_high_c: 32 }],
};

const twoHourForecastPayload = {
  code: 0,
  data: {
    area_metadata: [
      { name: 'Bishan', label_location: { latitude: 1.350772, longitude: 103.839 } },
    ],
    items: [
      {
        update_timestamp: '2026-08-28T15:36:24+08:00',
        valid_period: { text: '3.30 pm to 5.30 pm' },
        forecasts: [{ area: 'Bishan', forecast: 'Windy' }],
      },
    ],
  },
};

describe('locations API', () => {
  let tempDir: string;
  let app: Awaited<ReturnType<typeof import('../server.js').createApp>>;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'weather-starter-test-'));
    process.env.DATABASE_PATH = join(tempDir, 'weather.db');
    process.env.LOG_LEVEL = 'silent';

    const { createApp } = await import('../server.js');
    app = await createApp({
      serveFrontend: false,
      enableRequestLogging: false,
      weatherClient: {
        async getCurrentWeather() {
          return weather;
        },
      },
    });
  });

  afterAll(async () => {
    const { closeDatabase } = await import('../db.js');
    closeDatabase();
    await rm(tempDir, { recursive: true, force: true });
  });

  it('refreshes weather when a location is created', async () => {
    const response = await request(app)
      .post('/api/locations')
      .send({ latitude: 1.35, longitude: 103.85 })
      .expect(201);

    expect(response.body).toMatchObject({
      id: 1,
      latitude: 1.35,
      longitude: 103.85,
      weather: {
        condition: 'Cloudy',
        area: 'Bishan',
        temperature_c: 29,
      },
    });

    const listResponse = await request(app).get('/api/locations').expect(200);
    expect(listResponse.body.locations).toHaveLength(1);
    expect(listResponse.body.locations[0].weather.condition).toBe('Cloudy');
  });

  it('deletes an existing location', async () => {
    const createResponse = await request(app)
      .post('/api/locations')
      .send({ latitude: 1.4, longitude: 103.9 })
      .expect(201);

    await request(app).delete(`/api/locations/${createResponse.body.id}`).expect(204);
    expect((await request(app).get('/api/locations').expect(200)).body.locations).toHaveLength(1);
    await request(app).get(`/api/locations/${createResponse.body.id}`).expect(404);
  });

  it('returns not found when deleting an unknown location', async () => {
    await request(app).delete('/api/locations/999').expect(404);
  });
});

describe('two-hour forecast mapping', () => {
  it('maps the nearest area forecast into a condition snapshot', () => {
    const client = new SingaporeWeatherClient();
    const snapshot = client.snapshotFromPayload(twoHourForecastPayload, 1.35, 103.84);

    expect(snapshot).toMatchObject({
      condition: 'Windy',
      area: 'Bishan',
      valid_period_text: '3.30 pm to 5.30 pm',
      source: 'api-open.data.gov.sg',
    });
  });
});
