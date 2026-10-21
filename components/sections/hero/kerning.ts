import type { CSSProperties } from "react";

/** Kerning adjustments in em, keyed by letter pair ("Fa"). */
export type Kerning = Record<string, number>;

/**
 * Splitting a word into one element per letter drops the font's kerning, which shows at display
 * sizes ("Fa", "Pa"). Measuring each pair on a canvas in the element's own font gives the
 * adjustment back, to apply as a margin after the first letter.
 */
export function measureKerning(
  element: HTMLElement,
  words: readonly string[],
): Kerning {
  const kerning: Kerning = {};
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return kerning;

  const style = getComputedStyle(element);
  context.font = `${style.fontStyle} ${style.fontWeight} 100px ${style.fontFamily}`;
  const width = (text: string) => context.measureText(text).width;

  for (const word of words) {
    for (let index = 0; index < word.length - 1; index += 1) {
      const pair = word.slice(index, index + 2);
      if (pair in kerning) continue;
      const adjustment = width(pair) - width(pair[0]) - width(pair[1]);
      if (Math.abs(adjustment) > 0.05) kerning[pair] = adjustment / 100;
    }
  }
  return kerning;
}

/** Inline margin that restores the kerning between `letter` and the one after it. */
export function kernAfter(
  kerning: Kerning | null,
  letter: string,
  next: string | undefined,
): CSSProperties | undefined {
  const adjustment = next ? kerning?.[letter + next] : undefined;
  return adjustment ? { marginRight: `${adjustment.toFixed(4)}em` } : undefined;
}
