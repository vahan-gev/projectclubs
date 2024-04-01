import React, { useCallback, useEffect, useState } from "react";
import {
  getUserWithUsername,
  useAuthentication,
} from "../../services/authService";
import styled from "styled-components";
import Header from "../Header/Header";
import Club from "./Club";
import Button from "../Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import UserInfo from "../UserInfo/UserInfo";
import FriendList from "../Friends/FriendList";
import FriendsInfo from "../Friends/FriendsInfo";
import Loader from "../Loader/Loader";

function ClubsPage() {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const currentUser = useAuthentication();
  const navigate = useNavigate();
  const goToCreate = () => {
    navigate(`/clubs/create`);
  };
  const getUser = useCallback(async () => {
    await getUserWithUsername(username).then(setUser);
  }, [username]);
  useEffect(() => {
    getUser();
  }, [username, getUser]);
  if (!user) return <Loader />;
  return (
    <Container>
      <Wrapper>
        <Header />
        <Content>
          <Sidebar>
            {currentUser?.uid === user?.uid && (
              <>
                <UserInfo user={user} />
                <FriendList user={user} />
              </>
            )}
          </Sidebar>
          <Middle>
            <TitleContainer>
              <Title>
                {user?.username}'s Clubs: {user?.clubs?.length}
              </Title>
            </TitleContainer>
            <ButtonContainer>
              <Button text="Create a Club" onClick={goToCreate} />
            </ButtonContainer>
            <Divider />
            {user?.clubs?.length !== 0 ? (
              user?.clubs?.map((club) => (
                <Club key={club} user={user} clubID={club} full={true} />
              ))
            ) : (
              <NoClubsContainer>
                <TextContainer>
                  <NoClubs>This user is not a member of any club</NoClubs>
                </TextContainer>
              </NoClubsContainer>
            )}
          </Middle>
          <RightBar>
            {currentUser?.uid === user?.uid && <FriendsInfo user={user} />}
          </RightBar>
        </Content>
      </Wrapper>
    </Container>
  );
}

const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1255px;
  @media screen and (max-width: 1255px) {
    width: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;
const NoClubs = styled.span`
  color: white;
  font-size: 20px;
  font-weight: 600;
  @media screen and (max-width: 440px) {
    font-size: 15px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
`;

const Divider = styled.hr`
  width: 90%;
  border: 1px solid #272727;
  margin: 10px 0;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const NoClubsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 500px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media screen and (max-width: 1255px) {
    display: none;
  }
`;
const RightBar = styled.div`
  display: flex;
  @media screen and (max-width: 1255px) {
    display: none;
  }
`;
const Middle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow-y: auto;
  height: 88vh;
  width: 100%;
  max-width: 700px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
`;

const Title = styled.div`
  color: white;
  font-size: 30px;
  font-weight: 600;
`;

export default ClubsPage;
