// ---------------------------------------------------------------------------
// Club — Comète "club" logo (thin wrapper around LogoFrame).

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function Club(props: LogoProps): ReactElement {
  return <LogoFrame entity="club" {...props} />;
}

Club.displayName = "Club";
