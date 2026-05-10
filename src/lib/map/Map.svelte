<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { MapProvider } from './types';
  import type { MapMouseEvent, MapboxGeoJSONFeature } from 'mapbox-gl';
  import { parkStore } from '../parks/parkStore.svelte';
  import { ParkLayer } from './layers/ParkLayer';

  interface Props {
    provider: MapProvider;
    center?: [number, number];
    zoom?: number;
  }

  let { 
    provider, 
    center = [10.93, 59.21], 
    zoom = 12 
  }: Props = $props();

  let container: HTMLElement | undefined = $state();

  $effect(() => {
    if (center) {
      provider.setCenter(center[0], center[1]);
    }
  });

  $effect(() => {
    const map = provider.getMap();
    if (map && map.isStyleLoaded()) {
      ParkLayer.setup(map, parkStore.parks);
    }
  });

  onMount(async () => {
    if (container) {
      await provider.initialize({
        container,
        center,
        zoom
      });

      const map = provider.getMap();
      if (map) {
        map.on('load', () => {
          ParkLayer.setup(map, parkStore.parks);
        });

        map.on('click', ParkLayer.LAYER_ID, (e: MapMouseEvent & { features?: MapboxGeoJSONFeature[] }) => {
          if (e.features && e.features.length > 0) {
            const id = e.features[0].id;
            parkStore.selectPark(id?.toString() ?? null);
          }
        });

        map.on('mouseenter', ParkLayer.LAYER_ID, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', ParkLayer.LAYER_ID, () => {
          map.getCanvas().style.cursor = '';
        });
      }
    }
  });

  onDestroy(() => {
    provider.destroy();
  });
</script>

<div bind:this={container} class="map-container"></div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
