export const DEFAULT_PDF_BRAND_COLOR = '#141414';

export type PdfBranding = {
  /** Organisation name: wordmark when there is no logo, and the sender line. */
  businessName: string;
  /** Hex, from `brandingColors.primary`. */
  primaryColor: string;
  /** Logo image bytes (PNG), from `brandingLogo`. */
  logo: Uint8Array | null;
  /** `brandingCompanyDetails`, shown in the footer. */
  companyDetails: string | null;
  /** Branding is switched on: the organisation speaks as itself, never as the account holder. */
  isBranded: boolean;
};

export const DEFAULT_PDF_BRANDING: PdfBranding = {
  businessName: '',
  primaryColor: DEFAULT_PDF_BRAND_COLOR,
  logo: null,
  companyDetails: null,
  isBranded: false,
};
