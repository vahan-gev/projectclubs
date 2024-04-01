import React from "react";
import styled from "styled-components";
import { acceptRequest, removeFriendRequest } from "../../services/userService";
import { FaUserCheck, FaUserSlash } from "react-icons/fa6";

function FriendRequest({ request }) {
  const acceptFriendRequest = async () => {
    await acceptRequest(request.to?.uid, request?.by?.uid);
  };

  const declineFriendRequest = async () => {
    await removeFriendRequest(request?.by?.uid, request.to?.uid);
  };

  return (
    <Container>
      <InfoSection>
        <ColumnOne>
          <UserImage src={request?.by?.profilePicture} />
        </ColumnOne>
        <ColumnTwo>
          <UserDisplayName>{request?.by?.displayName}</UserDisplayName>
          <UserUsername>@{request?.by?.username}</UserUsername>
        </ColumnTwo>
      </InfoSection>
      <ColumnThree>
        <FriendRequestButton onClick={acceptFriendRequest}>
          <IconContainer>
            <FaUserCheck color="#53DD6C" />
          </IconContainer>
        </FriendRequestButton>
        <FriendRequestButton onClick={declineFriendRequest}>
          <IconContainer>
            <FaUserSlash color="#F49097" />
          </IconContainer>
        </FriendRequestButton>
      </ColumnThree>
    </Container>
  );
}

const InfoSection = styled.div`
  display: flex;
  align-items: center;

  flex-direction: row;
  gap: 10px;
`;
const Container = styled.div`
  border: 2px solid #27272a;
  padding: 20px;
  color: white;
  border-radius: 10px;
  background-color: #101010;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 400px) {
    padding: 20px 10px;
  }
`;

const UserDisplayName = styled.span`
  font-size: 15px;
  font-weight: 800;
  @media screen and (max-width: 495px) {
    font-size: 12px;
  }
`;
const UserUsername = styled.span`
  font-size: 12px;
  @media screen and (max-width: 495px) {
    font-size: 10px;
  }
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  @media screen and (max-width: 455px) {
    display: none;
  }
`;
const ColumnOne = styled.div`
  display: flex;
  flex-direction: column;
`;
const ColumnTwo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;
const ColumnThree = styled.div`
  display: flex;
  gap: 10px;
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
  @media screen and (max-width: 390px) {
    padding: 0;
    background-color: transparent;
    border: none;
    width: 20px;
    height: 20px;
  }
`;
export default FriendRequest;
