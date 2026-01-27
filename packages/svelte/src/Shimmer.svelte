<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { extractElementInfo, type ElementInfo } from '@shimmer-from-structure/core';
  import { getShimmerConfig } from './ShimmerContext';

  export let loading: boolean = true;
  export let shimmerColor: string | undefined = undefined;
  export let backgroundColor: string | undefined = undefined;
  export let duration: number | undefined = undefined;
  export let fallbackBorderRadius: number | undefined = undefined;
  export let templateProps: Record<string, any> | undefined = undefined;

  let measureRef: HTMLDivElement;
  let elements: ElementInfo[] = [];

  const contextConfig = getShimmerConfig();

  $: resolvedShimmerColor = shimmerColor ?? contextConfig.shimmerColor;
  $: resolvedBackgroundColor = backgroundColor ?? contextConfig.backgroundColor;
  $: resolvedDuration = duration ?? contextConfig.duration;
  $: resolvedFallbackBorderRadius = fallbackBorderRadius ?? contextConfig.fallbackBorderRadius;

  async function measureElements() {
    if (!loading || !measureRef) return;

    // Temporarily stop observing to avoid recursion from DOM-modifying measurements
    // (e.g. extractElementInfo temporarily wrapping text in spans)
    observer?.disconnect();

    // Wait for DOM update
    await tick();

    const container = measureRef;
    const containerRect = container.getBoundingClientRect();
    const extractedElements: ElementInfo[] = [];

    Array.from(container.children).forEach((child) => {
      extractedElements.push(...extractElementInfo(child, containerRect));
    });

    elements = extractedElements;

    // Restart observation session
    if (measureRef && observer) {
      observer.observe(measureRef, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false,
      });
    }
  }

  // Re-measure when loading state changes
  $: if (loading && measureRef) {
    measureElements();
  }

  let observer: MutationObserver | undefined;

  onMount(() => {
    measureElements();

    if (measureRef) {
      observer = new MutationObserver(() => {
        // Only observe changes in the measure container (slot content changes)
        // Don't trigger when we're not loading
        if (loading) {
          measureElements();
        }
      });

      // Only observe the slot content changes, NOT the shimmer overlay
      observer.observe(measureRef, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false, // Don't observe attribute changes (style updates)
      });
    }

    return () => {
      observer?.disconnect();
    };
  });

  // Helper to signal content change from parent (optional)
  export function remeasure() {
    measureElements();
  }
</script>

{#if !loading}
  <slot></slot>
{:else}
  <div style="position: relative;">
    <!-- Measure container with transparent text -->
    <div
      bind:this={measureRef}
      class="shimmer-measure-container"
      style="pointer-events: none;"
      aria-hidden="true"
    >
      {#if templateProps}
        <!-- Slot with template props injected via context -->
        <slot shimmerTemplateProps={templateProps}></slot>
      {:else}
        <slot></slot>
      {/if}
    </div>

    <!-- Shimmer overlay - isolated from mutation observer -->
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
      "
    >
      {#each elements as element, index (index)}
        <div
          style="
            position: absolute;
            left: {element.x}px;
            top: {element.y}px;
            width: {element.width}px;
            height: {element.height}px;
            background-color: {resolvedBackgroundColor};
            border-radius: {element.borderRadius === '0px'
            ? resolvedFallbackBorderRadius + 'px'
            : element.borderRadius};
            overflow: hidden;
          "
        >
          <div
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, {resolvedShimmerColor}, transparent);
              animation: shimmer-animation {resolvedDuration}s infinite;
            "
          ></div>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .shimmer-measure-container :global(*) {
    color: transparent !important;
  }
  .shimmer-measure-container :global(img),
  .shimmer-measure-container :global(svg),
  .shimmer-measure-container :global(video) {
    opacity: 0;
  }
  @keyframes shimmer-animation {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
