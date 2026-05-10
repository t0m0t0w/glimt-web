import mapboxgl from 'mapbox-gl';
import type { MapProvider, MapOptions, MarkerOptions } from '../types';

export class MapboxProvider implements MapProvider {
  private map: mapboxgl.Map | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initialize(options: MapOptions): Promise<void> {
    mapboxgl.accessToken = this.apiKey;
    this.map = new mapboxgl.Map({
      container: options.container,
      style: 'mapbox://styles/mapbox/standard',
      center: options.center,
      zoom: options.zoom
    });
  }

  setCenter(lng: number, lat: number): void {
    this.map?.setCenter([lng, lat]);
  }

  addMarker(options: MarkerOptions): void {
    if (!this.map) return;
    const marker = new mapboxgl.Marker({ color: options.color })
      .setLngLat([options.lng, options.lat]);
    
    if (options.popupHtml) {
      marker.setPopup(new mapboxgl.Popup().setHTML(options.popupHtml));
    }
    
    marker.addTo(this.map);
  }

  getMap(): mapboxgl.Map | null {
    return this.map;
  }

  destroy(): void {
    this.map?.remove();
    this.map = null;
  }
}
