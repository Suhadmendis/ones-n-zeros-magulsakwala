// Single source of truth for breakpoints — must match the pixel values
// hardcoded in every @media rule across the project (CSS can't consume
// custom properties inside a media query condition, so the numbers are
// duplicated by necessity; keep them in sync with src/theme/tokens.css).
export const BREAKPOINTS = {
  sm: 480, // large phones
  md: 768, // tablets
  lg: 1024, // small desktops / nav breakpoint
  xl: 1280, // desktop
}
