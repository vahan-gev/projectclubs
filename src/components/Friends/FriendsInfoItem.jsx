import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUser } from "../../services/authService";

function FriendsInfoItem({ friendID }) {
  const [friend, setFriend] = useState(null);
  const navigate = useNavigate();
  const getFriend = useCallback(async () => {
    await getUser(friendID).then(setFriend);
  }, [friendID]);
  const goToFriend = () => {
    navigate(`/user/${friend?.username}`);
  };

  useEffect(() => {
    getFriend();
  }, [friendID, getFriend]);
  return (
    <Container onClick={goToFriend}>
      <ColumnOne>
        {friend ? (
          <FriendImage src={friend?.profilePicture} />
        ) : (
          <ImagePlaceholder />
        )}
      </ColumnOne>
      <ColumnTwo>
        <FriendName>{friend?.displayName}</FriendName>
        <FriendUserName>@{friend?.username}</FriendUserName>
      </ColumnTwo>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  border-radius: 35px;
  background-color: #161616;
  color: white;
  cursor: pointer;
  transition: 0.2s;
  gap: 10px;
  &:hover {
    background-color: #3e3e3e;
  }
`;

const ColumnOne = styled.div``;
const ColumnTwo = styled.div`
  display: flex;
  flex-direction: column;
`;
const FriendImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  background-color: #272727;
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const FriendName = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const FriendUserName = styled.span`
  color: gray;
  font-size: 14px;
`;

export default FriendsInfoItem;
