import React, { createContext, useContext, ReactNode, useMemo } from 'react';

/**
 * Configuration options for shimmer appearance and behavior.
 * All properties are optional when providing config to ShimmerProvider.
 */
export interface ShimmerConfig {
    /** Color of the shimmer wave animation */
    shimmerColor?: string;
    /** Background color of shimmer placeholders */
    backgroundColor?: string;
    /** Duration of one shimmer animation cycle in seconds */
    duration?: number;
    /** Fallback border radius (px) for elements without explicit border-radius */
    fallbackBorderRadius?: number;
}

/**
 * Internal context value type with all required properties.
 * Ensures consuming components always receive valid values.
 */
interface ShimmerContextValue {
    shimmerColor: string;
    backgroundColor: string;
    duration: number;
    fallbackBorderRadius: number;
}

/** Default configuration values */
const defaultConfig: ShimmerContextValue = {
    shimmerColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    duration: 1.5,
    fallbackBorderRadius: 4,
};

const ShimmerContext = createContext<ShimmerContextValue>(defaultConfig);

export interface ShimmerProviderProps {
    /** Shimmer configuration to apply to all child Shimmer components */
    config?: ShimmerConfig;
    children: ReactNode;
}

/**
 * Provider component for global shimmer configuration.
 * Wrap your app or a section of your component tree to apply default shimmer settings.
 *
 * @example
 * ```tsx
 * <ShimmerProvider config={{ shimmerColor: '#fff', duration: 2 }}>
 *   <App />
 * </ShimmerProvider>
 * ```
 */
export const ShimmerProvider: React.FC<ShimmerProviderProps> = ({
    config = {},
    children,
}) => {
    const mergedConfig: ShimmerContextValue = useMemo(() => ({
        shimmerColor: config.shimmerColor ?? defaultConfig.shimmerColor,
        backgroundColor: config.backgroundColor ?? defaultConfig.backgroundColor,
        duration: config.duration ?? defaultConfig.duration,
        fallbackBorderRadius: config.fallbackBorderRadius ?? defaultConfig.fallbackBorderRadius,
    }), [config.shimmerColor, config.backgroundColor, config.duration, config.fallbackBorderRadius]);

    return (
        <ShimmerContext.Provider value={mergedConfig}>
            {children}
        </ShimmerContext.Provider>
    );
};

/**
 * Hook to access the current shimmer configuration from context.
 * Returns default values if no ShimmerProvider is present.
 * All returned values are guaranteed to be defined.
 */
export const useShimmerConfig = (): ShimmerContextValue => {
    return useContext(ShimmerContext);
};

// Export defaults for testing and reference
export { defaultConfig as shimmerDefaults };