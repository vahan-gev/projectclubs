import React from "react";
import { FaPen, FaRegUser } from "react-icons/fa6";
import styled from "styled-components";
import { TbArticle } from "react-icons/tb";
import { joinClubWithID, leaveClubWithID } from "../../services/clubService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function ClubInformation({ club, user, getClubInfo }) {
  const navigate = useNavigate();
  const joinClub = async () => {
    if (club?.banned?.includes(user?.uid)) {
      Swal.fire({
        title: "Something went wrong!",
        text: "You are banned from this club!",
        icon: "error",
        buttons: false,
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    await joinClubWithID(club?.uid, user?.uid).then(() => {
      getClubInfo();
    });
  };
  const leaveClub = async () => {
    await leaveClubWithID(club?.uid, user?.uid).then(() => {
      getClubInfo();
    });
  };

  const goToEdit = () => {
    navigate(`/clubs/edit/${club?.uid}`);
  };
  return (
    <Container>
      <ClubInfo>
        <ClubImage src={club?.profilePicture} />
        <NameContainer>
          <ClubName>{club?.displayName}</ClubName>
          {club?.admin === user?.uid && (
            <EditContainer onClick={goToEdit}>
              <FaPen color="white" size={10} />
            </EditContainer>
          )}
        </NameContainer>
        <ClubDescription>
          {club?.description?.length > 30
            ? `${club?.description.slice(0, 30)}...`
            : club?.description}
        </ClubDescription>
        <ClubMisc>
          <ClubMiscItem>
            <FaRegUser color="white" size={13} />
            <ClubMiscItemText>{club?.members?.length}</ClubMiscItemText>
            <ClubMiscItemText>Members</ClubMiscItemText>
          </ClubMiscItem>
          <ClubMiscItem>
            <TbArticle color="white" size={16} />
            <ClubMiscItemText>{club?.posts?.length}</ClubMiscItemText>
            <ClubMiscItemText>Posts</ClubMiscItemText>
          </ClubMiscItem>
        </ClubMisc>
        {club?.members?.includes(user?.uid) ? (
          <ClubButton onClick={leaveClub}>
            <ClubButtonText>Leave Club</ClubButtonText>
          </ClubButton>
        ) : (
          <ClubButton onClick={joinClub}>
            <ClubButtonText>Join Club</ClubButtonText>
          </ClubButton>
        )}
      </ClubInfo>
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

const EditContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #161616;
  padding: 5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #3e3f3f;
  }
`;

const ClubInfo = styled.div`
  display: flex;
  background-color: #272727;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  width: 100%;
  border-radius: 35px;
`;

const ClubImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const ClubName = styled.span`
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const ClubDescription = styled.span`
  color: gray;
  font-weight: 500;
`;

const ClubMisc = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const ClubMiscItem = styled.div`
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

const ClubMiscItemText = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;
const ClubButton = styled.div`
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

const ClubButtonText = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;
export default ClubInformation;
