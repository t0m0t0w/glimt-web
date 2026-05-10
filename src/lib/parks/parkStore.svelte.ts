import { ParkService } from './ParkService';
import type { Park } from './types';

class ParkStore {
  #parks = $state<Park[]>([]);
  #selectedId = $state<string | null>(null);
  #isLoading = $state(false);
  #error = $state<string | null>(null);

  get parks() { return this.#parks; }
  get selectedId() { return this.#selectedId; }
  get isLoading() { return this.#isLoading; }
  get error() { return this.#error; }

  selectedPark = $derived(this.#parks.find((p) => p.id === this.#selectedId) ?? null);

  async searchArea(bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number }) {
    this.#isLoading = true;
    this.#error = null;
    try {
      this.#parks = await ParkService.fetchParks(bounds);
    } catch (e) {
      this.#error = e instanceof Error ? e.message : 'An unknown error occurred';
      console.error('ParkStore.searchArea failed:', e);
    } finally {
      this.#isLoading = false;
    }
  }

  selectPark(id: string | null) {
    this.#selectedId = id;
  }
}

export const parkStore = new ParkStore();
