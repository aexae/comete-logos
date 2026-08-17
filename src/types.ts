import type { ComponentType, SVGAttributes } from "react";

/** Appearance variant for logos. */
export type LogoAppearance = "brand" | "neutral" | "inverse";

/** Display format: icon only or full logo (icon + wordmark). */
export type LogoFormat = "icon" | "logo";

/** @deprecated Use LogoFormat instead. */
export type LogoType = LogoFormat;

/** TaglineAlign display mode for product logos. @default "inline" */
export type LogoTaglineAlign = "none" | "inline" | "column";

/** @deprecated Use LogoTaglineAlign instead. */
export type LogoSuffix = LogoTaglineAlign;

/** Available product names. */
export type LogoProduct =
  | "comete"
  | "ontime"
  | "link"
  | "bi"
  | "academie"
  | "club"
  | "mce"
  | "cafe"
  | "mycomete";

/**
 * Color overrides for logo rendering.
 *
 * Use this only when CSS design tokens are not available (e.g. emails,
 * static exports). In normal usage the component resolves colours from
 * the `.comete-logo--{appearance}` CSS classes which map to Comète
 * design-token custom properties.
 */
export interface LogoColors {
  /** Fill color for text/wordmark paths. */
  text: string;
  /** Fill color for the icon when not using gradient. */
  icon: string;
  /** Gradient start color (light yellow). */
  gradientLight: string;
  /** Gradient stop color (dark yellow/gold). */
  gradientDark: string;
}

/** Props accepted by all logo components. */
export interface LogoProps extends Omit<SVGAttributes<SVGSVGElement>, "color"> {
  /** Visual appearance. @default "brand" */
  appearance?: LogoAppearance;
  /** Display format: icon only or full logo. @default "logo" */
  format?: LogoFormat;
  /** TaglineAlign display mode for product logos. @default "inline" */
  taglineAlign?: LogoTaglineAlign;
  /** Rendered height in pixels. Width scales proportionally. @default 32 */
  size?: number;
  /**
   * Color overrides — **fallback only**.
   *
   * When provided, these colors are used as inline styles instead of
   * the CSS custom-property–based classes. Useful for contexts where
   * `@aexae/comete-design-tokens` CSS is not loaded (static exports,
   * emails, etc.).
   */
  colors?: LogoColors;
  /** Additional CSS class name. */
  className?: string;
}

/** Registry mapping product names to their logo components. */
export type LogoRegistry = Record<LogoProduct, ComponentType<LogoProps>>;
