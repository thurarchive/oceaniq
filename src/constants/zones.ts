export interface Zone {
  name: string;
  center: [number, number]; // [longitude, latitude]
  zoom: number;
}

export const ZONES: Zone[] = [
  {
    name: "All Zones",
    center: [117.5400, -2.5000],
    zoom: 4.5,
  },
  {
    name: "North Jakarta Bay",
    center: [106.8232, -6.0847],
    zoom: 10.5,
  },
  {
    name: "Bekasi Coastal",
    center: [107.0345, -5.9438],
    zoom: 11.5,
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
    zoom: 12.0,
  },
];
