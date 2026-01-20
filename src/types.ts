export interface ElementInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  tag: string;
}

export interface ShimmerProps {
  children: React.ReactNode;
  loading?: boolean;
  shimmerColor?: string;
  backgroundColor?: string;
  duration?: number;
  borderRadius?: number;
  /** 
   * Object mapping prop names to their mock/template values.
   * These props will be injected into the first child when loading.
   * Example: { user: { name: "Lorem" }, settings: { theme: "dark" } }
   */
  templateProps?: Record<string, unknown>;
}
