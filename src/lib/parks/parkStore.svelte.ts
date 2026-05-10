import { ParkService } from './ParkService';
import type { Park } from './types';

class ParkStore {
  parks = $state<Park[]>([]);
  selectedId = $state<string | null>(null);
  isLoading = $state(false);

  async searchArea(bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number }) {
    this.isLoading = true;
    try {
      this.parks = await ParkService.fetchParks(bounds);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

  selectPark(id: string | null) {
    this.selectedId = id;
  }

  get selectedPark() {
    return this.parks.find(p => p.id === this.selectedId) ?? null;
  }
}

export const parkStore = new ParkStore();
