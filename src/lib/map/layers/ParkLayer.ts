import type { Map } from 'mapbox-gl';
import type { Park } from '../../parks/types';

export class ParkLayer {
  static LAYER_ID = 'parks-layer';
  static SOURCE_ID = 'parks-source';

  static async setup(map: Map, parks: Park[]) {
    const geojson = this.toGeoJSON(parks);

    if (map.getSource(this.SOURCE_ID)) {
      (map.getSource(this.SOURCE_ID) as any).setData(geojson);
      return;
    }

    map.addSource(this.SOURCE_ID, {
      type: 'geojson',
      data: geojson
    });

    // We'll use a basic circle for now, upgrading to squircle in Task 5
    map.addLayer({
      id: this.LAYER_ID,
      type: 'symbol',
      source: this.SOURCE_ID,
      layout: {
        'text-field': ['get', 'index'],
        'text-size': 12,
        'text-allow-overlap': true,
        // icon-image will be added in task 5
      },
      paint: {
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
