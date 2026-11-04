// ---------------------------------------------------------------------------
// Bi — Comète "bi" logo (thin wrapper around LogoFrame).

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function Bi(props: LogoProps): ReactElement {
  return <LogoFrame entity="bi" {...props} />;
}

Bi.displayName = "Bi";
