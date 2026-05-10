import type { Map } from 'mapbox-gl';
import type { Park } from '../../parks/types';

export class ParkLayer {
  static LAYER_ID = 'parks-layer';
  static SOURCE_ID = 'parks-source';

  static async addSquircleImage(map: Map) {
    if (map.hasImage('squircle')) return;

    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Draw a squircle (rounded square)
    const r = 16; // border radius
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();

    // We'll fill with white and use 'icon-color' paint property to tint it
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Convert to ImageData
    const imageData = ctx.getImageData(0, 0, size, size);
    map.addImage('squircle', imageData, { sdf: true }); // sdf: true allows icon-color tinting
  }

  static async setup(map: Map, parks: Park[]) {
    await this.addSquircleImage(map);
    const geojson = this.toGeoJSON(parks);

    if (map.getSource(this.SOURCE_ID)) {
      (map.getSource(this.SOURCE_ID) as any).setData(geojson);
      return;
    }

    map.addSource(this.SOURCE_ID, {
      type: 'geojson',
      data: geojson
    });

    map.addLayer({
      id: this.LAYER_ID,
      type: 'symbol',
      source: this.SOURCE_ID,
      layout: {
        'icon-image': 'squircle',
        'icon-size': 0.5,
        'text-field': ['get', 'index'],
        'text-size': 12,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-allow-overlap': true,
        'icon-allow-overlap': true
      },
      paint: {
        'icon-color': ['get', 'color'],
        'text-color': '#000000'
      }
    });
  }

  private static toGeoJSON(parks: Park[]): any {
    return {
      type: 'FeatureCollection',
      features: parks.map(p => ({
        type: 'Feature',
        id: parseInt(p.id) || 0, // Mapbox feature IDs should be numbers if possible
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: { ...p }
      }))
    };
  }
}
