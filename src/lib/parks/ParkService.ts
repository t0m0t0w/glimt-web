import type { Park, OSMElement } from './types';

const PASTEL_COLORS = [
  '#FFD1DC', '#FFB7B2', '#FFDAC1', '#E2F0CB', 
  '#B5EAD7', '#C7CEEA', '#F3D1F4', '#D0F0C0'
];

export class ParkService {
  private static OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

  static async fetchParks(bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number }): Promise<Park[]> {
    const query = `
      [out:json][timeout:25];
      (
        node["leisure"="park"](${bounds.minLat},${bounds.minLng},${bounds.maxLat},${bounds.maxLng});
        way["leisure"="park"](${bounds.minLat},${bounds.minLng},${bounds.maxLat},${bounds.maxLng});
        relation["leisure"="park"](${bounds.minLat},${bounds.minLng},${bounds.maxLat},${bounds.maxLng});
      );
      out center;
    `;

    const response = await fetch(this.OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!response.ok) throw new Error('OSM Fetch Failed');
    const data = await response.json();
    
    return (data.elements as OSMElement[])
      .filter(el => el.tags?.name)
      .map((el, i) => ({
        id: el.id.toString(),
        name: el.tags!.name,
        lat: el.lat ?? el.center?.lat ?? 0,
        lng: el.lon ?? el.center?.lon ?? 0,
        tags: el.tags!,
        index: i + 1,
        color: PASTEL_COLORS[el.id % PASTEL_COLORS.length]
      }));
  }
}
