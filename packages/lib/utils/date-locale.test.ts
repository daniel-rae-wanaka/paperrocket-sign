import { describe, expect, it } from 'vitest';

import { getFormattingLocales } from './date-locale';

describe('getFormattingLocales', () => {
  it('uses the default date locale for English', () => {
    expect(getFormattingLocales('en', 'en-NZ')).toEqual(['en-NZ']);
  });

  it('formats a date day first for en-NZ', () => {
    const [locale] = getFormattingLocales('en', 'en-NZ') ?? [];

    expect(new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(new Date('2026-11-17T12:00:00Z'))).toBe(
      '17/11/2026',
    );
  });

  it('leaves other languages alone', () => {
    expect(getFormattingLocales('de', 'en-NZ')).toBeUndefined();
  });

  it('does nothing when unset, blank or invalid', () => {
    expect(getFormattingLocales('en', undefined)).toBeUndefined();
    expect(getFormattingLocales('en', '  ')).toBeUndefined();
    expect(getFormattingLocales('en', 'not a locale!!')).toBeUndefined();
  });
});
