import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import { useAuthentication } from "../../services/authService";
import CreatePost from "../CreatePost/CreatePost";
import Loader from "../Loader/Loader";
import UserInfo from "../UserInfo/UserInfo";
import { getRecommendedPosts } from "../../services/userService";
import Post from "../Post/Post";
import FriendList from "../Friends/FriendList";
import ClubsInfo from "../Clubs/ClubsInfo";
function Home() {
  const user = useAuthentication();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedPosts, setFetchedPosts] = useState([]);
  async function getPosts(user) {
    getRecommendedPosts(user).then((posts) => {
      setFetchedPosts(posts);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    if (!user) return;
    getPosts(user);
  }, [user]);
  if (!user || isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      <Wrapper>
        <Header />
        <Content>
          <Sidebar>
            <UserInfo user={user} />
            <FriendList user={user} />
          </Sidebar>
          <Middle>
            <CreatePost user={user} />
            <Divider />
            <Feed>
              {fetchedPosts.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  user={user}
                  getClubInfo={getPosts}
                />
              ))}
            </Feed>
          </Middle>
          <RightBar>
            <ClubsInfo user={user} />
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

const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 1255px) {
    width: 100%;
  }
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

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const Divider = styled.hr`
  width: 90%;
  border: 1px solid #272727;
  margin: 10px 0;
`;

export default Home;
