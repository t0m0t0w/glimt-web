export interface MapOptions {
  container: HTMLElement;
  center: [number, number]; // [lng, lat]
  zoom: number;
}

export interface MarkerOptions {
  lng: number;
  lat: number;
  color?: string;
  popupHtml?: string;
}

export interface MapProvider {
  initialize(options: MapOptions): Promise<void>;
  setCenter(lng: number, lat: number): void;
  addMarker(options: MarkerOptions): void;
  destroy(): void;
}
