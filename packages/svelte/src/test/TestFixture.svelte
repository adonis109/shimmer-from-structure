<script lang="ts">
  import Shimmer from '../Shimmer.svelte';
  import { setShimmerConfig } from '../ShimmerContext';
  import type { ShimmerConfig } from '@shimmer-from-structure/core';

  export let loading: boolean = true;
  export let shimmerColor: string | undefined = undefined;
  export let backgroundColor: string | undefined = undefined;
  export let duration: number | undefined = undefined;
  export let fallbackBorderRadius: number | undefined = undefined;

  // Optional config for context testing
  export let config: ShimmerConfig | undefined = undefined;

  if (config) {
    setShimmerConfig(config);
  }
</script>

<Shimmer {loading} {shimmerColor} {backgroundColor} {duration} {fallbackBorderRadius}>
  <div class="content">Content</div>
  <div class="nested">Nested</div>
</Shimmer>
