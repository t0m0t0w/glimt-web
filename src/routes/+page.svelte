<script lang="ts">
  import Map from '$lib/map/Map.svelte';
  import { MapboxProvider } from '$lib/map/providers/MapboxProvider';

  const MAPBOX_KEY = 'pk.eyJ1IjoiYmVlcHRjIiwiYSI6ImNpaDZzeTl6czA3cm11MWtpcmZjODhsMHAifQ.oZ9PBLwvwcMX7fBaHGDnAg';
  const provider = new MapboxProvider(MAPBOX_KEY);
</script>

<main>
  <Map {provider} />
  
  <div class="overlay">
    <h1>Glimt</h1>
  </div>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  .overlay {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    background: white;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  h1 { margin: 0; font-size: 1.2rem; }
</style>
