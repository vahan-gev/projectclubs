import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Friend from "./Friend";
import { getRecommendedFriends } from "../../services/userService";
function FriendList({ user }) {
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [friendStart, setFriendStart] = useState(0);
  const [friendEnd, setFriendEnd] = useState(3);
  const getFriends = useCallback(async () => {
    await getRecommendedFriends(user).then((friends) => {
      setRecommendedFriends(friends);
    });
  }, [user]);
  const nextPage = () => {
    if (friendEnd >= recommendedFriends.length) return;
    setFriendStart(friendStart + 3);
    setFriendEnd(friendEnd + 3);
  };
  const prevPage = () => {
    if (friendStart < 3) return;
    setFriendStart(friendStart - 3);
    setFriendEnd(friendEnd - 3);
  };
  useEffect(() => {
    getFriends();
  }, [user, getFriends]);
  return (
    <Container>
      <FriendsContainer>
        <TitleContainer>
          <Title>People you might now</Title>
        </TitleContainer>
        {recommendedFriends?.length !== 0 ? (
          recommendedFriends
            ?.slice(friendStart, friendEnd)
            .map((friend) => (
              <Friend key={friend} user={user} friendID={friend} />
            ))
        ) : (
          <NoFriendsContainer>
            <NoFriends>No friend suggestions</NoFriends>
          </NoFriendsContainer>
        )}
        <ButtonContainer>
          <CustomButton onClick={prevPage}>Previous</CustomButton>
          <CustomButton onClick={nextPage}>Next</CustomButton>
        </ButtonContainer>
      </FriendsContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
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
  border-radius: 35px;
  gap: 10px;
`;
const NoFriendsContainer = styled.div`
  width: 100%;
`;
const TitleContainer = styled.div`
  width: 100%;
`;
const Title = styled.span`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const NoFriends = styled.span`
  color: gray;
  font-size: 16px;
`;

const CustomButton = styled.div`
  color: white;
  font-size: 16px;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export default FriendList;
