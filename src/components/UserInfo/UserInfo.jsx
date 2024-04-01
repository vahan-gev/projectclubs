import React from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
function UserInfo({ user }) {
  const navigate = useNavigate();
  const goToFriends = () => {
    navigate(`/friends`);
  };
  return (
    <Container>
      <UserInformation>
        <UserImage src={user?.profilePicture} />
        <NameContainer>
          <UserName>
            {user?.displayName.length >= 20
              ? `${user?.displayName.slice(0, 15)}...`
              : user?.displayName}
          </UserName>
          {user?.verified && (
            <VerificationContainer>
              <VscVerifiedFilled color="#0395F6" size={17} />
            </VerificationContainer>
          )}
        </NameContainer>
        <UserTag>@{user?.username}</UserTag>
        <UserBio>{user?.bio}</UserBio>
        <UserMisc>
          <UserMiscItem onClick={goToFriends}>
            <UserMiscItemText>{user?.friends?.length}</UserMiscItemText>
            <UserMiscItemText>Friends</UserMiscItemText>
          </UserMiscItem>
          <UserMiscItem>
            <UserMiscItemText>{user?.posts?.length}</UserMiscItemText>
            <UserMiscItemText>Posts</UserMiscItemText>
          </UserMiscItem>
        </UserMisc>
        <ProfileButton
          onClick={() => {
            navigate(`/user/${user?.username}`);
          }}
        >
          <ProfileButtonText>View Profile</ProfileButtonText>
        </ProfileButton>
      </UserInformation>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const VerificationContainer = styled.div``;

const UserInformation = styled.div`
  display: flex;
  background-color: #272727;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  width: 100%;
  border-radius: 35px;
`;

const UserImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserName = styled.span`
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const UserTag = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 400;
  color: #8e8e8e;
`;

const UserBio = styled.span`
  color: white;
  font-weight: 500;
`;

const UserMisc = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const UserMiscItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  gap: 5px;
  background-color: #161616;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
`;

const UserMiscItemText = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;
const ProfileButton = styled.div`
  background-color: #161616;
  padding: 10px 20px;
  border-radius: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover {
    background-color: #3e3f3f;
  }
`;

const ProfileButtonText = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;
export default UserInfo;
