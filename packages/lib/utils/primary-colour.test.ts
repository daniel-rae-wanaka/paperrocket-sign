import { describe, expect, it } from 'vitest';

import { getButtonColours, getPrimaryColourCss, getPrimaryColourVars } from './primary-colour';

describe('getPrimaryColourVars', () => {
  it('uses white text on a dark colour', () => {
    expect(getPrimaryColourVars('#1d4ed8')?.primaryForeground).toBe('0 0% 100%');
    expect(getPrimaryColourVars('#000000')?.primaryForeground).toBe('0 0% 100%');
  });

  it('uses near-black text on a light colour', () => {
    expect(getPrimaryColourVars('#a2e771')?.primaryForeground).not.toBe('0 0% 100%');
    expect(getPrimaryColourVars('#ffffff')?.primaryForeground).not.toBe('0 0% 100%');
    expect(getPrimaryColourVars('#fde047')?.primaryForeground).not.toBe('0 0% 100%');
  });

  it('returns the colour as h s% l%', () => {
    expect(getPrimaryColourVars('#ff0000')?.primary).toBe('0 100% 50%');
  });

  it('returns null for empty or invalid input', () => {
    expect(getPrimaryColourVars(undefined)).toBeNull();
    expect(getPrimaryColourVars('  ')).toBeNull();
    expect(getPrimaryColourVars('not a colour; }')).toBeNull();
  });
});

describe('getPrimaryColourCss', () => {
  it('sets both variables and nothing from the input', () => {
    const css = getPrimaryColourCss('#1d4ed8');

    expect(css).toContain('--primary:');
    expect(css).toContain('--primary-foreground:');
    expect(css).not.toContain('1d4ed8');
  });

  it('is null for an invalid colour', () => {
    expect(getPrimaryColourCss('}</style><script>')).toBeNull();
  });
});

describe('getButtonColours', () => {
  it('uses white text on a dark blue', () => {
    expect(getButtonColours('#3066BB')).toEqual({ background: '#3066bb', foreground: '#ffffff' });
  });

  it('uses near-black text on a light colour', () => {
    expect(getButtonColours('#fde047')?.foreground).toBe('#111827');
  });

  it('returns null for empty or invalid input', () => {
    expect(getButtonColours(undefined)).toBeNull();
    expect(getButtonColours('  ')).toBeNull();
    expect(getButtonColours('red; } body { display: none')).toBeNull();
  });
});
