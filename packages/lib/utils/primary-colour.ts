import { colord } from 'colord';

// paperrocket-sign: the app's primary colour. Stock Documenso is a light green with dark text, so a brand colour needs
// its own text colour: white or near-black, whichever reads better (WCAG contrast ratio from relative luminance).
const NEAR_BLACK = { r: 17, g: 24, b: 39 };

const channel = (value: number) => {
  const c = value / 255;

  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = ({ r, g, b }: { r: number; g: number; b: number }) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const toHslVar = (colour: ReturnType<typeof colord>) => {
  const { h, s, l } = colour.toHsl();

  return `${h} ${s}% ${l}%`;
};

/**
 * CSS variable values (`h s% l%`, as theme.css expects) for a primary colour and its text colour, or null when the
 * input is empty or not a colour. Only computed numbers are returned, so nothing from the input reaches the CSS.
 */
export const getPrimaryColourVars = (
  input: string | null | undefined,
): { primary: string; primaryForeground: string } | null => {
  const trimmed = input?.trim();

  if (!trimmed) {
    return null;
  }

  const colour = colord(trimmed);

  if (!colour.isValid()) {
    return null;
  }

  const background = luminance(colour.toRgb());

  const useWhite = contrast(background, 1) >= contrast(background, luminance(NEAR_BLACK));

  return {
    primary: toHslVar(colour),
    primaryForeground: toHslVar(colord(useWhite ? '#ffffff' : '#111827')),
  };
};

/** CSS rule that sets the primary variables in light and dark themes. */
export const getPrimaryColourCss = (input: string | null | undefined): string | null => {
  const vars = getPrimaryColourVars(input);

  if (!vars) {
    return null;
  }

  return `html:root, html.dark:root, html[data-theme='dark']:root { --primary: ${vars.primary}; --primary-foreground: ${vars.primaryForeground}; }`;
};
