import { useEffect, useMemo, useState } from "react";
import { css } from "styled-components";

const MOBILE = 700;
const MEDIUM_SCREEN = 950;
const SMALL_SCREEN = 768;

const mobile = (...args) => css`
  @media screen 
  and (max-width: ${MOBILE}px) {
    ${css(...args)};
  }
`;

const mediumScreen = (...args) => css`
  @media screen and (max-width: ${MEDIUM_SCREEN}px)  {
    ${css(...args)};
  }
`;

const smallScreen = (...args) => css`
  @media screen and (max-width: ${SMALL_SCREEN}px)  {
    ${css(...args)};
  }
`;

const useBreakpoint = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useMemo(() => {
    if (width < MOBILE) {
      return 'mobile';
    } else if (width < MEDIUM_SCREEN) {
      return 'mediumScreen';
    } else if (width < SMALL_SCREEN) {
      return 'smallScreen';
    }
  }, [width]);
}

const breakpoints = {
  mobile,
  mediumScreen,
  smallScreen,
  useBreakpoint,
};

export default breakpoints;