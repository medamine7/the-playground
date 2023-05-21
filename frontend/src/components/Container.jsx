import { styled } from "styled-components";
import breakpoints from "../style/breakpoints";

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px 0;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${breakpoints.smallScreen`
    padding: 0 32px;
  `}

  ${breakpoints.mobile`
    padding: 0 22px;
  `}

  &:after {
    content: "";
    height: 50px;
    width: 100%;
    flex-shrink: 0;
  }
`;

export default Container;