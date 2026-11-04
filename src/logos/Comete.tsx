// ---------------------------------------------------------------------------
// Comete — logo of the Comète ERP software (thin wrapper around LogoFrame).
//
// No suffix and never a tagline: the software logo is the bare wordmark +
// comet, whatever `taglineAlign` says. The company logo (wordmark + tagline)
// is `CometeCompany` (`entity="comete-company"`).

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function Comete(props: LogoProps): ReactElement {
  return <LogoFrame entity="comete-software" {...props} />;
}

Comete.displayName = "Comete";
