import React from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

function EmailNotVerified() {
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    navigate("/login");
  };
  const check = () => {
    window.location.replace(window.location.href.slice(0, -16));
  };
  return (
    <Container>
      <Title>Not Verified :(</Title>
      <Subtitle>
        You email is not verified, please verify it to have access to Clubs
      </Subtitle>
      <ButtonsContainer>
        <Button text="Check" onClick={check} />
        <Button text="Log out" onClick={logout} />
      </ButtonsContainer>
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

  @media screen and (max-width: 460px) {
    font-size: 40px;
  }
`;

const Subtitle = styled.span`
  font-size: 20px;
  color: gray;
  margin-bottom: 20px;
  text-align: center;
  max-width: 500px;
  @media screen and (max-width: 460px) {
    font-size: 16px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  @media screen and (max-width: 400px) {
    flex-direction: column;
  }
`;

export default EmailNotVerified;
