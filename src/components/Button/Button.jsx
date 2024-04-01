import React from "react";
import styled from "styled-components";

function Button({ text, onClick = null }) {
  return <Container onClick={onClick}>{text}</Container>;
}

const Container = styled.div`
  background-color: #101010;
  color: white;
  font-size: 18px;
  font-weight: 500;
  border: 2px solid #101010;
  border-radius: 20px;

  padding: 0 20px;
  transition: 0.2s;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  &:hover {
    background-color: #202020;
    border: 2px solid #161616;
  }
`;

export default Button;
