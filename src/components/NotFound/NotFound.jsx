import React from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function NotFound() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate(`/`);
  };
  return (
    <Container>
      <Title>Not Found :(</Title>
      <Button text="Go Home" onClick={goHome} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 60px;
  font-weight: 600;
  color: white;

  @media screen and (max-width: 400px) {
    font-size: 40px;
  }
`;

export default NotFound;
