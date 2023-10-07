export const breakpointTablet = 712; // px
export const breakpointDesktop = 1025; // px
export const breakpointDesktopLarge = 1280; // px

const customMediaQuery = (minWidth: number) =>
  `@media (min-width: ${minWidth}px)`;

export const media = {
  custom: customMediaQuery,
  tablet: customMediaQuery(breakpointTablet),
  desktop: customMediaQuery(breakpointDesktop),
  desktopLarge: customMediaQuery(breakpointDesktopLarge),
};
