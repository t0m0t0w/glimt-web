<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { MapProvider } from './types';

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

  onMount(async () => {
    if (container) {
      await provider.initialize({
        container,
        center,
        zoom
      });
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
