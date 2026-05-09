# Glimt Initial Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffolding the SvelteKit project, setting up the modular map architecture, and implementing a basic Mapbox provider.

**Architecture:** SvelteKit for routing, Vanilla CSS for styling, and a decoupled MapProvider interface to ensure modularity.

**Tech Stack:** SvelteKit, TypeScript, Mapbox GL JS, Vanilla CSS.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`
- Create: `src/app.html`, `src/app.d.ts`

- [ ] **Step 1: Initialize SvelteKit project**

Run: `npm create svelte@latest .`
Select:
- Skeleton project
- Using TypeScript
- No ESLint/Prettier/Playwright/Vitest (we will add manually if needed, or stick to basics for now)

- [ ] **Step 2: Install dependencies**

Run: `npm install && npm install -D mapbox-gl @types/mapbox-gl`

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "chore: scaffold sveltekit project"
```

---

### Task 2: Base Layout & Global Styles

**Files:**
- Create: `src/routes/+layout.svelte`
- Create: `src/app.css`

- [ ] **Step 1: Create global CSS with variables**

```css
/* src/app.css */
:root {
  --primary: #ff3e00;
  --bg: #ffffff;
  --text: #333333;
  --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-main);
  background: var(--bg);
  color: var(--text);
  overflow: hidden; /* Prevent bounce on mobile */
}
```

- [ ] **Step 2: Set up root layout**

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css';
</script>

<slot />
```

- [ ] **Step 3: Commit**

```bash
git add src/app.css src/routes/+layout.svelte
git commit -m "style: add global layout and css variables"
```

---

### Task 3: Map Provider Interface

**Files:**
- Create: `src/lib/map/types.ts`

- [ ] **Step 1: Define the MapProvider interface**

```typescript
// src/lib/map/types.ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/map/types.ts
git commit -m "feat(map): define MapProvider interface"
```

---

### Task 4: Mapbox Implementation

**Files:**
- Create: `src/lib/map/providers/MapboxProvider.ts`

- [ ] **Step 1: Implement MapboxProvider**

```typescript
// src/lib/map/providers/MapboxProvider.ts
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
      style: 'mapbox://styles/mapbox/light-v11',
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

  destroy(): void {
    this.map?.remove();
    this.map = null;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/map/providers/MapboxProvider.ts
git commit -m "feat(map): implement MapboxProvider"
```

---

### Task 5: The Map Component

**Files:**
- Create: `src/lib/map/Map.svelte`

- [ ] **Step 1: Create the generic Map component**

```svelte
<!-- src/lib/map/Map.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { MapProvider } from './types';

  export let provider: MapProvider;
  export let center: [number, number] = [10.93, 59.21]; // Fredrikstad
  export let zoom = 12;

  let container: HTMLElement;

  onMount(async () => {
    await provider.initialize({
      container,
      center,
      zoom
    });
  });

  onDestroy(() => {
    provider.destroy();
  });
</script>

<div bind:this={container} class="map-container" />

<style>
  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/map/Map.svelte
git commit -m "feat(map): add generic Map component"
```

---

### Task 6: Initial Map View (Home)

**Files:**
- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Set up the main page with Mapbox**

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Map from '$lib/map/Map.svelte';
  import { MapboxProvider } from '$lib/map/providers/MapboxProvider';

  const MAPBOX_KEY = 'pk.eyJ1IjoiYmVlcHRjIiwiYSI6ImNpaDZzeTl6czA3cm11MWtpcmZjODhsMHAifQ.oZ9PBLwvwcMX7fBaHGDnAg';
  const provider = new MapboxProvider(MAPBOX_KEY);

  // Example marker data
  const spots = [
    { name: 'Kirkeparken', lng: 10.935, lat: 59.210 },
    { name: 'Kulåsparken', lng: 11.108, lat: 59.284 }
  ];
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
```

- [ ] **Step 2: Verify locally**

Run: `npm run dev`
Expected: Map centers on Nedre Glomma with Mapbox tiles loading.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: show initial map on home page"
```
