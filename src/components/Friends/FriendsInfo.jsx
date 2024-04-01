import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FriendsInfoItem from "./FriendsInfoItem";
import Button from "../Button/Button";

function FriendsInfo({ user }) {
  const navigate = useNavigate();
  const goToFriends = () => {
    navigate(`/friends`);
  };
  return (
    <Container>
      <FriendsContainer>
        <TitleContainer>
          <Title>Friends</Title>
        </TitleContainer>
        {user?.friends?.length > 0 ? (
          user?.friends
            ?.slice(0, 5)
            .map((friend) => (
              <FriendsInfoItem key={friend} user={user} friendID={friend} />
            ))
        ) : (
          <NoFriends>No friends</NoFriends>
        )}
        <ButtonContainer>
          <Button text="All Friends" onClick={goToFriends} />
        </ButtonContainer>
      </FriendsContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FriendsContainer = styled.div`
  display: flex;
  background-color: #272727;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  width: 100%;
  min-width: 300px;
  border-radius: 35px;
  gap: 10px;
`;

const TitleContainer = styled.div``;
const Title = styled.span`
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const NoFriends = styled.span`
  color: gray;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  width: 100%;
`;

export default FriendsInfo;
