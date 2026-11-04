// ---------------------------------------------------------------------------
// OnTime — Comète "on time" logo
// ---------------------------------------------------------------------------
//
// Thin wrapper around `LogoFrame`, which composes the three primitive parts
// (`ProductIcon`, `ProductRootName`, `ProductSuffix`) into the full logo.
// All styling (appearance + theme) is handled by `styles/logos.css` via
// the CSS custom properties consumed by each primitive.

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function OnTime(props: LogoProps): ReactElement {
  return <LogoFrame entity="ontime" {...props} />;
}

OnTime.displayName = "OnTime";
