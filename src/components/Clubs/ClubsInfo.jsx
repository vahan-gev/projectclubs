import React from "react";
import styled from "styled-components";
import Button from "../Button/Button";
import Club from "./Club";
import { useNavigate } from "react-router-dom";

function ClubsInfo({ user }) {
  const navigate = useNavigate();
  const goToClubs = () => {
    navigate(`/clubs/list/${user?.username}`);
  };
  const goToCreate = () => {
    navigate(`/clubs/create`);
  };
  return (
    <Container>
      <ClubsInformation>
        <TitleContainer>
          <Title>Clubs</Title>
        </TitleContainer>
        {user?.clubs?.length !== 0 ? (
          user?.clubs
            ?.slice(0, 5)
            .map((club) => <Club key={club} user={user} clubID={club} />)
        ) : (
          <NoClubs>No clubs</NoClubs>
        )}
        <ButtonContainer>
          {user?.clubs?.length === 0 ? (
            <Button text="Create a club" onClick={goToCreate} />
          ) : (
            <Button text="All Clubs" onClick={goToClubs} />
          )}
        </ButtonContainer>
      </ClubsInformation>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ClubsInformation = styled.div`
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

const NoClubs = styled.span`
  color: gray;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  width: 100%;
`;

export default ClubsInfo;
