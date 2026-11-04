// ---------------------------------------------------------------------------
// CometeCompany — logo of the company Comète (thin wrapper around LogoFrame).
//
// Same artwork as `Comete` (the ERP logo) but with the tagline below the
// wordmark by default (`LogoFrame` resolves `taglineAlign` to "column" for
// this product). Use it for the company
// (brand) contexts: sponsoring, corporate documents, signatures. Use
// `Comete` for the software itself.

import type { ReactElement } from "react";
import { LogoFrame } from "../components/LogoFrame";
import type { LogoProps } from "../types";

export function CometeCompany(props: LogoProps): ReactElement {
  return <LogoFrame entity="comete-company" {...props} />;
}

CometeCompany.displayName = "CometeCompany";
