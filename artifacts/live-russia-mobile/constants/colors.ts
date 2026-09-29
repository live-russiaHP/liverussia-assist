/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#f4f8ff',
    tint: '#37d4ff',

    // Core surfaces
    background: '#07111f',
    foreground: '#f4f8ff',

    // Cards / elevated surfaces
    card: '#102138',
    cardForeground: '#f4f8ff',

    // Primary action color (buttons, links, active states)
    primary: '#37d4ff',
    primaryForeground: '#07111f',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#1b3049',
    secondaryForeground: '#dcecff',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#19304a',
    mutedForeground: '#8fa4bd',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#ff7b6b',
    accentForeground: '#07111f',

    // Destructive actions (delete, error states)
    destructive: '#ff6574',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#25415e',
    input: '#294764',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
