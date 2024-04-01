import React from "react";
import styled, { keyframes } from "styled-components";
function Loader() {
  return (
    <LoaderContainer>
      <LoaderBody />
    </LoaderContainer>
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100dvh;
  width: 100%;
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.4);
`;

const LoaderBody = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid #161616;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: ${rotate} 2s linear infinite;
`;

export default Loader;
