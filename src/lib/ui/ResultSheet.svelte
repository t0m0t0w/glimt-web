<script lang="ts">
  import { parkStore } from '$lib/parks/parkStore.svelte';
  import { fly } from 'svelte/transition';
</script>

{#if parkStore.selectedPark}
  <div class="sheet" transition:fly={{ y: 200, duration: 300 }}>
    <header>
      <div class="header-content">
        <span class="index-badge" style="background: {parkStore.selectedPark.color}">
          {parkStore.selectedPark.index}
        </span>
        <h2>{parkStore.selectedPark.name}</h2>
      </div>
      <button class="close-btn" onclick={() => parkStore.selectPark(null)} aria-label="Close">
        ✕
      </button>
    </header>
    <div class="content">
      <div class="image-placeholder">
        <p>No image available</p>
      </div>
      <div class="details">
        <div class="tags">
          {#each Object.entries(parkStore.selectedPark.tags).slice(0, 3) as [key, value]}
            <span class="tag">{key}: {value}</span>
          {/each}
        </div>
        <p class="description">
          Beautiful park located at coordinates {parkStore.selectedPark.lat.toFixed(4)}, {parkStore.selectedPark.lng.toFixed(4)}.
        </p>
      </div>
      <div class="actions">
        <button class="primary-btn">Get Directions</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .sheet {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: white;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 500px;
    margin: 0 auto;
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .index-badge {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.9rem;
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .close-btn {
    background: #f0f0f0;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }

  .image-placeholder {
    background: #f7f7f7;
    height: 180px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    margin-bottom: 20px;
    border: 1px dashed #ddd;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .tag {
    background: #f0f2f5;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    color: #555;
  }

  .description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 24px;
  }

  .primary-btn {
    width: 100%;
    background: #222;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .primary-btn:active {
    transform: scale(0.98);
  }

  @media (max-width: 600px) {
    .sheet {
      bottom: 10px;
      left: 10px;
      right: 10px;
    }
  }
</style>
