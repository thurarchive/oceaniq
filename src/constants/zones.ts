export interface Zone {
  name: string;
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  offset?: number;
}

export const ZONES: Zone[] = [
  {
    name: "All Zones",
    center: [117.5400, -2.5000],
    zoom: 4.5,
  },
  {
    name: "North Jakarta Bay",
    center: [106.8400, -6.1000],
    zoom: 10.0,
    offset: 0.10,
  },
  {
    name: "Bekasi Coastal",
    center: [107.0100, -6.0200],
    zoom: 11.0,
    offset: 0.08,
  },
  {
    name: "Citarum Mouth",
    center: [107.1234, -6.1789],
    zoom: 12.0,
  },
  {
    name: "Karawang Zone",
    center: [107.2891, -6.2341],
    zoom: 11.5,
  },
  {
    name: "Cisadane River",
    center: [106.6780, -6.0120],
    zoom: 11.5,
    offset: 0.08,
  },
];
