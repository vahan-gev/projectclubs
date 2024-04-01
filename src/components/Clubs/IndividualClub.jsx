import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header/Header";
import { getClubWithID } from "../../services/clubService";
import { useAuthentication } from "../../services/authService";
import ClubMembers from "./ClubMembers";
import ClubInformation from "./ClubInformation";
import CreateClubPost from "./CreateClubPost";
import Post from "../Post/Post";
import Loader from "../Loader/Loader";
import ClubsInformationMobile from "./ClubsInformationMobile";

function IndividualClub() {
  const user = useAuthentication();
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const getClubInfo = useCallback(async () => {
    await getClubWithID(id).then(setClub);
  }, [id]);
  useEffect(() => {
    getClubInfo();
  }, [id, getClubInfo]);
  if (!club) {
    return <Loader />;
  }
  return (
    <Container>
      <Wrapper>
        <Header />
        <Content>
          <Sidebar>
            <ClubInformation
              club={club}
              user={user}
              getClubInfo={getClubInfo}
            />
          </Sidebar>
          <Middle>
            <ClubsInformationMobile
              club={club}
              user={user}
              getClubInfo={getClubInfo}
            />
            {club?.members?.includes(user?.uid) ? (
              <>
                <CreateClubPost
                  club={club}
                  user={user}
                  getClubInfo={getClubInfo}
                />
                <Divider />
              </>
            ) : (
              <TitleContainer>
                <Title>Join the club to post</Title>
              </TitleContainer>
            )}

            {!club?.banned?.includes(user?.uid) && club?.posts?.length > 0 ? (
              club?.posts
                ?.reverse()
                .map((post) => (
                  <Post
                    key={post}
                    postId={post}
                    user={user}
                    getClubInfo={getClubInfo}
                    canBeDeleted={club?.members?.includes(user?.uid)}
                  />
                ))
            ) : (
              <TitleContainer>
                <Title>This club doesn't have any posts yet!</Title>
              </TitleContainer>
            )}
          </Middle>
          <RightBar>
            <ClubMembers club={club} />
          </RightBar>
        </Content>
      </Wrapper>
    </Container>
  );
}

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

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media screen and (max-width: 1355px) {
    display: none;
  }
`;
const RightBar = styled.div`
  display: flex;
  @media screen and (max-width: 1355px) {
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
const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 1355px) {
    width: 100%;
  }
`;
const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 30px;
  font-weight: 600;
`;
const Divider = styled.hr`
  width: 90%;
  border: 1px solid #272727;
  margin: 10px 0;
`;
export default IndividualClub;
