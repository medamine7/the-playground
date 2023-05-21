/* eslint-disable react/prop-types */
import { styled } from "styled-components";
import Container from "./Container"
import Header from "./Header"
import { Loading } from "@geist-ui/core";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.7);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingWrapper = styled.div`
  background-color: white;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid var(--theplayground-black-color);
  width: 200px;
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const Loader = () => {
  return (
    <Overlay>
      <LoadingWrapper>
        <span>Loading Articles</span>
        <Loading color="var(--theplayground-black-color)"></Loading>
      </LoadingWrapper>
    </Overlay>
  )
};

const Layout = ({ children }) => {
  const isLoading = useSelector(state => state.app.isLoading);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isLoading]);

  return (
    <Container>
      {isLoading && <Loader />}
      <Header />
      { children }
    </Container>
  )
}

export default Layout;