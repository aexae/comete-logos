// ---------------------------------------------------------------------------
// CafeComete — Comète "café" logo
// ---------------------------------------------------------------------------

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function CafeComete(props: LogoProps): ReactElement {
  return <LogoFrame entity="cafe" {...props} />;
}

CafeComete.displayName = "CafeComete";
