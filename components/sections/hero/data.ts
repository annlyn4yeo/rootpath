/** The three statements the hero walks through, in scroll order. */
export const statements = [
  {
    text: "Small team.",
    caption:
      "The people on your first call are the people who design and build your product.",
  },
  {
    text: "Direct access.",
    caption:
      "No account layer in between. You talk to the engineers writing the code.",
  },
  {
    text: "Faster decisions.",
    caption:
      "Fewer hand-offs between a question and the person who can answer it, so the work keeps moving.",
  },
] as const;

/** Screens of scrolling the stage stays pinned for. The section is one screen taller than this. */
export const PIN_SCREENS = 1.3;

/**
 * Height of the Services band's top that shows under the hero, in svh. The pinned stage draws
 * that strip itself, and the real band overlaps the hero by the same amount, so when the pin lets
 * go the real band lands exactly on the strip and carries on rising.
 */
export const PEEK_SVH = 9;

/** Depth into the pin, in screens, where statements two and three take over. */
const SWITCH_AT = [0.4, 0.9] as const;

/** Where scrolling comes to rest, one stop per statement, each clear of the switch points. */
export const STOPS = [0, 0.65, 1.2] as const;

export function statementAt(screens: number) {
  return SWITCH_AT.filter((at) => screens >= at).length;
}
