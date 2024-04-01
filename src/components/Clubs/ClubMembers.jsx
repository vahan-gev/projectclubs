import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { getUser } from "../../services/authService";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

function ClubMember({ memberId }) {
  const [member, setMember] = useState(null);
  const navigate = useNavigate();
  const getMemberInfo = useCallback(async () => {
    await getUser(memberId).then(setMember);
  }, [memberId]);

  const goToMember = () => {
    navigate(`/user/${member?.username}`);
  };

  useEffect(() => {
    getMemberInfo();
  }, [getMemberInfo]);
  return (
    <MemberContainer onClick={goToMember}>
      <MemberImage src={member?.profilePicture} />
      <MemberName>
        {member?.displayName.length >= 20
          ? `${member?.displayName.slice(0, 15)}...`
          : member?.displayName}
      </MemberName>
    </MemberContainer>
  );
}
const MemberContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  border-radius: 35px;
  background-color: rgba(22, 22, 22, 1);
  color: white;
  cursor: pointer;
  gap: 10px;
  transition: 0.2s;
  &:hover {
    background-color: rgba(22, 22, 22, 0.7);
  }
`;

const MemberName = styled.span`
  color: white;
  font-size: 15px;
`;

const MemberImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

function ClubMembers({ club }) {
  return (
    <Container>
      <MembersInformation>
        <TitleContainer>
          <Title>Members</Title>
        </TitleContainer>
        {club?.members?.length !== 0 ? (
          club?.members
            ?.slice(0, 5)
            .map((member) => <ClubMember key={member} memberId={member} />)
        ) : (
          <NoMembers>No members</NoMembers>
        )}
        <ButtonContainer>
          <Button text="All Members" />
        </ButtonContainer>
      </MembersInformation>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MembersInformation = styled.div`
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

const NoMembers = styled.span`
  color: gray;
  font-size: 16px;
`;

const ButtonContainer = styled.div`
  width: 100%;
`;

export default ClubMembers;
