// paperrocket-sign: the language "en" formats dates as US (11/17/2026). NEXT_PUBLIC_DEFAULT_DATE_LOCALE (for example
// en-NZ) swaps the formatting locale for English only. Other languages keep their own formatting.
export const getFormattingLocales = (language: string, defaultDateLocale: string | undefined): string[] | undefined => {
  const candidate = defaultDateLocale?.trim();

  if (!candidate || language.split('-')[0] !== 'en') {
    return undefined;
  }

  try {
    return Intl.getCanonicalLocales(candidate).length > 0 ? [candidate] : undefined;
  } catch {
    return undefined;
  }
};
