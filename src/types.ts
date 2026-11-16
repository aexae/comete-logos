import type { ComponentType, SVGAttributes } from "react";

/** Appearance variant for logos. */
export type LogoAppearance = "brand" | "neutral" | "inverted";

/**
 * Display format: icon only, full logo (icon + wordmark), or wordmark only
 * (the standalone Figma wordmark drawing, letters with a ring "o", no icon).
 */
export type LogoFormat = "icon" | "logo" | "wordmark";

/** @deprecated Use LogoFormat instead. */
export type LogoType = LogoFormat;

/** TaglineAlign display mode for product logos. @default "inline" */
export type LogoTaglineAlign = "none" | "inline" | "column";

/** @deprecated Use LogoTaglineAlign instead. */
export type LogoSuffix = LogoTaglineAlign;

/**
 * Who or what the logo stands for: the company, the ERP software, or one of
 * the product lines. "Entity" rather than "product" because the company
 * itself is not a product, yet it has a logo.
 */
export type LogoEntity =
  | "academie"
  | "bi"
  | "cafe"
  | "club"
  /** Comète, the company (wordmark + tagline). */
  | "comete-company"
  /** Comète, the ERP software — never shows the tagline. */
  | "comete-software"
  | "link"
  | "mce"
  | "ontime"
  /**
   * Orca — marque autonome, et le seul membre de cette union qui ne soit pas
   * une sous-marque Comète : son logo ne porte ni le wordmark « comète », ni
   * la comète, ni de suffixe produit. `LogoFrame` le court-circuite donc
   * avant toute composition, et `format="wordmark"` y est traité comme
   * `format="logo"` faute de wordmark Comète à isoler.
   */
  | "orca";

/** @deprecated Use LogoEntity instead. */
export type LogoProduct = LogoEntity;

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
  /**
   * Fill color for the product suffix and the Comète tagline. Optional: when
   * omitted, the hardcoded fallback for the logo's appearance is used.
   */
  subtle?: string;
}

/** Props accepted by all logo components. */
export interface LogoProps extends Omit<SVGAttributes<SVGSVGElement>, "color"> {
  /** Visual appearance. @default "brand" */
  appearance?: LogoAppearance;
  /** Display format: icon only or full logo. @default "logo" */
  format?: LogoFormat;
  /** TaglineAlign display mode for product logos. @default "inline" ("column" for comete-company) */
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

/** Registry mapping entities to their logo components. */
export type LogoRegistry = Record<LogoEntity, ComponentType<LogoProps>>;
