// ---------------------------------------------------------------------------
// Comete — logo of the Comète ERP software (thin wrapper around LogoFrame).
//
// No product suffix and, by default, no tagline: the software logo is the
// bare wordmark + comet. The company logo (wordmark + tagline) is
// `CometeCompany` (`entity="comete-company"`). `taglineAlign="column"`
// still renders the tagline here for backward compatibility.

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function Comete(props: LogoProps): ReactElement {
  return <LogoFrame entity="comete-software" {...props} />;
}

Comete.displayName = "Comete";
