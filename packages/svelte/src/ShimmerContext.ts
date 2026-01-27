import { getContext, setContext } from 'svelte';
import type { ShimmerConfig, ShimmerContextValue } from '@shimmer-from-structure/core';
import { shimmerDefaults } from '@shimmer-from-structure/core';

// Symbol key for context
const SHIMMER_CONFIG_KEY = Symbol('SHIMMER_CONFIG');

/**
 * Access the current shimmer configuration from context.
 * Returns default values if no configuration has been provided.
 * All returned values are guaranteed to be defined.
 */
export function getShimmerConfig(): ShimmerContextValue {
  const config = getContext<ShimmerContextValue>(SHIMMER_CONFIG_KEY);
  return config || shimmerDefaults;
}

/**
 * Provide shimmer configuration to child components.
 * Wrap your app or a section of your component tree to apply default shimmer settings.
 *
 * @param config Configuration object
 *
 * @example
 * ```svelte
 * <script>
 *   import { setShimmerConfig } from '@shimmer-from-structure/svelte';
 *   setShimmerConfig({ shimmerColor: '#fff', duration: 2 });
 * </script>
 * ```
 */
export function setShimmerConfig(config: ShimmerConfig = {}) {
  const parentConfig = getShimmerConfig();

  const mergedConfig: ShimmerContextValue = {
    shimmerColor: config.shimmerColor ?? parentConfig.shimmerColor,
    backgroundColor: config.backgroundColor ?? parentConfig.backgroundColor,
    duration: config.duration ?? parentConfig.duration,
    fallbackBorderRadius: config.fallbackBorderRadius ?? parentConfig.fallbackBorderRadius,
  };

  setContext(SHIMMER_CONFIG_KEY, mergedConfig);
}

// Re-export defaults for testing and reference
export { shimmerDefaults };
