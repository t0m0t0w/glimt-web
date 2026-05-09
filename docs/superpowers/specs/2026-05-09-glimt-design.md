# Project Spec: Glimt (Nedre Glomma Recreation Map)

**Date:** 2026-05-09
**Status:** Approved
**Tech Stack:** SvelteKit, Vanilla CSS, Mapbox (Initial Provider)

## 1. Overview
Glimt is a mobile-focused web application for discovering local parks, recreation areas, cafes, and culture spots in the Nedre Glomma region (Fredrikstad and Sarpsborg). It prioritizes a smooth user experience, modularity, and easy design iteration.

## 2. Core Features
- **Interactive Map**: Centered on Nedre Glomma, showing filtered markers for recreational spaces.
- **Provider-Agnostic Map Layer**: A decoupled architecture allowing easy transition from Mapbox to other providers (Leaflet, Google Maps) to manage future scaling costs.
- **Mobile-First Design**: Custom styling based on Figma, optimized for touch interaction.
- **Modular Pages**: Dedicated routes for:
  - **Home**: Main map interface.
  - **Stats**: User/Area statistics.
  - **Minigames**: Location-based games or interactive features.
  - **Search**: Extensible search interface.

## 3. Architecture & Technical Design

### Frontend
- **Framework**: SvelteKit for routing and fluid page transitions.
- **Styling**: Vanilla CSS. No Tailwind or heavy UI libraries. Focus on custom implementation of Figma design.
- **Transitions**: Svelte's built-in `fly`, `fade`, and `crossfade` for a native app feel.

### Map Layer (Modular)
- **Map.svelte**: The top-level component that consumers use.
- **MapProvider Interface**: A TypeScript interface defining methods like `setCenter`, `addMarker`, `clearMarkers`.
- **MapboxProvider.ts**: The concrete implementation using Mapbox GL JS.
- **Marker Layer**: Use Svelte components for markers to allow easy animation and custom SVG/HTML rendering.

### State Management
- **Park Store**: Svelte stores to manage currently visible parks, selected locations, and user preferences.

## 4. Directory Structure
```text
src/
├── lib/
│   ├── components/  # Shared UI (Button.svelte, BottomSheet.svelte)
│   ├── map/         # Map engine, providers, and types
│   │   ├── Map.svelte
│   │   ├── types.ts
│   │   └── providers/
│   │       └── MapboxProvider.ts
│   └── stores/      # State management (parkStore.ts)
├── routes/
│   ├── +layout.svelte # Global styles & navigation
│   ├── stats/       # Stats route
│   ├── games/       # Minigames route
│   └── +page.svelte  # Main map view
└── app.css          # Global variables & base styles
```

## 5. Scope Constraints
- **Bounds**: Hard-coded or default bounds for Nedre Glomma (Approx: `[10.8, 59.1]` to `[11.2, 59.3]`).
- **Initial Provider**: Mapbox GL JS (Key: `pk.eyJ1IjoiYmVlcHRjIiwiYSI6ImNpaDZzeTl6czA3cm11MWtpcmZjODhsMHAifQ.oZ9PBLwvwcMX7fBaHGDnAg`).
- **Data**: Initial data served from local GeoJSON or mock stores.

## 6. Future Considerations
- AI-powered search/recommendations.
- Expanded provider support.
- User accounts and saved spots.
