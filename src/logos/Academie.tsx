// ---------------------------------------------------------------------------
// Academie — Comète "académie" logo (thin wrapper around LogoFrame).

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function Academie(props: LogoProps): ReactElement {
  return <LogoFrame entity="academie" {...props} />;
}

Academie.displayName = "Academie";
