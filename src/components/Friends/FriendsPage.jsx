import React from "react";
import { useAuthentication } from "../../services/authService";
import styled from "styled-components";
import Header from "../Header/Header";
import UserInfo from "../UserInfo/UserInfo";
import Loader from "../Loader/Loader";
import ClubsInfo from "../Clubs/ClubsInfo";
import FriendItem from "./FriendItem";

function FriendsPage() {
  const user = useAuthentication();
  if (!user) {
    return <Loader />;
  }
  return (
    <Container>
      <MainWrapper>
        <Header />
        <Content>
          <Sidebar>
            <UserInfo user={user} />
          </Sidebar>
          <Middle>
            <TitleContainer>
              <Title>Friends</Title>
            </TitleContainer>
            {user?.friends?.length > 0 ? (
              user?.friends?.map((friend) => (
                <FriendItem key={friend} id={friend} user={user} />
              ))
            ) : (
              <Wrapper>
                <NoFriend>You have no friends</NoFriend>
              </Wrapper>
            )}
          </Middle>
          <RightBar>
            <ClubsInfo user={user} />
          </RightBar>
        </Content>
      </MainWrapper>
    </Container>
  );
}

const Wrapper = styled.div`
  display: flex;
  background-image: linear-gradient(
    90deg,
    hsla(312, 66%, 76%, 1) 0%,
    hsla(234, 93%, 67%, 1) 100%
  );
  border-radius: 15px;
  padding: 1px;
`;

const NoFriend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 10px 20px;
  background-color: #272727;
  color: white;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
  width: 500px;
  border-radius: 15px;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const MainWrapper = styled.div`
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

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  gap: 20px;
  width: 100%;
  justify-content: center;
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

export default FriendsPage;
