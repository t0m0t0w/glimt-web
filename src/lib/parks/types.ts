export interface Park {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tags: Record<string, string>;
  color: string;
  index: number;
}

export interface OSMElement {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}
