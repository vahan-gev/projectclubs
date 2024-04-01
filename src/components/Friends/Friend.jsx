import React, { useCallback, useEffect, useState } from "react";
import { getUser } from "../../services/authService";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  acceptRequest,
  addFriendRequest,
  checkFriendRequestSent,
  removeFriendRequest,
} from "../../services/userService";
import { FaUserPlus, FaUserCheck, FaUserSlash } from "react-icons/fa6";

function Friend({ friendID, user }) {
  const [friend, setFriend] = useState(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequestGot, setFriendRequestGot] = useState(false);
  const navigate = useNavigate();
  const getFriend = useCallback(async () => {
    await getUser(friendID).then(setFriend);
  }, [friendID]);
  const addFriend = async () => {
    await addFriendRequest(user?.uid, friend?.uid);
    setFriendRequestSent(true);
    await checkRequest();
  };
  const removeFriend = async () => {
    await removeFriendRequest(user?.uid, friend?.uid);
    setFriendRequestSent(false);
    await checkRequest();
  };
  const acceptFriend = async () => {
    await acceptRequest(user?.uid, friend?.uid);
  };
  const checkRequest = useCallback(async () => {
    const [sentRes, gotRes] = await Promise.all([
      checkFriendRequestSent(user?.uid, friend?.uid),
      checkFriendRequestSent(friend?.uid, user?.uid),
    ]);
    setFriendRequestSent(sentRes);
    setFriendRequestGot(gotRes);
  }, [user, friend]);

  const RequestIcon = () => {
    if (friendRequestSent && !friendRequestGot) {
      return <FaUserSlash color="#F49097" />;
    } else if (!friendRequestSent && friendRequestGot) {
      return <FaUserCheck color="#53DD6C" />;
    } else {
      return <FaUserPlus color="white" />;
    }
  };

  const requestClick = () => {
    if (friendRequestSent && !friendRequestGot) {
      removeFriend();
    } else if (!friendRequestSent && friendRequestGot) {
      acceptFriend();
    } else {
      addFriend();
    }
  };

  useEffect(() => {
    getFriend();
  }, [friendID, getFriend]);
  useEffect(() => {
    if (friend) {
      checkRequest();
    }
  }, [friend, user, checkRequest]);
  return (
    <Container>
      <Wrapper>
        <ColumnOne
          onClick={() => {
            navigate(`/user/${friend?.username}`);
          }}
        >
          {friend ? (
            <FriendImage src={friend?.profilePicture} />
          ) : (
            <ImagePlaceholder />
          )}
        </ColumnOne>
        <ColumnTwo>
          <FriendName>
            {friend?.displayName.length > 15
              ? `${friend?.displayName.slice(0, 15)}...`
              : friend?.displayName}
          </FriendName>
          <FriendUserName>@{friend?.username}</FriendUserName>
        </ColumnTwo>
      </Wrapper>
      <ColumnThree>
        <FriendRequestButton onClick={requestClick}>
          <IconContainer>
            <RequestIcon />
          </IconContainer>
        </FriendRequestButton>
      </ColumnThree>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 35px;
  color: white;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
  justify-content: space-between;
`;

const ColumnOne = styled.div`
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const FriendImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #272727;
`;

const IconContainer = styled.div``;

const FriendRequestButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  border: 2px solid #27272a;
  border-radius: 5px;
  transition: 0.2s;
  background-color: #101010;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: relative;
  &:hover {
    background: #27272a;
  }
`;

const ColumnTwo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnThree = styled.div``;

const FriendName = styled.span`
  color: white;
  font-size: 13px;
  font-weight: 600;
`;

const FriendUserName = styled.span`
  color: gray;
  font-size: 12px;
  font-weight: 400;
`;

export default Friend;
