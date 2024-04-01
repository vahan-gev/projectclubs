import React from "react";
import { FaPen, FaRegUser } from "react-icons/fa6";
import styled from "styled-components";
import { TbArticle } from "react-icons/tb";
import { joinClubWithID, leaveClubWithID } from "../../services/clubService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUserCheck, FaUserSlash } from "react-icons/fa6";

function ClubsInformationMobile({ club, user, getClubInfo }) {
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
      <ColumnOne>
        <ImageContainer>
          <ClubImage src={club?.profilePicture} />
        </ImageContainer>
        <InfoContainer>
          <ClubName>{club?.displayName}</ClubName>
          <ClubDescription>
            {club?.description?.length > 30
              ? `${club?.description.slice(0, 30)}...`
              : club?.description}
          </ClubDescription>
          <MoreInfo>
            <ClubMembers>
              {club?.members?.length}
              <FaRegUser color="gray" size={11} />
            </ClubMembers>
            <ClubPosts>
              {club?.posts?.length}
              <TbArticle color="gray" size={11} />
            </ClubPosts>
          </MoreInfo>
        </InfoContainer>
      </ColumnOne>
      <ColumnTwo>
        {club?.admin === user?.uid && (
          <RoundButton onClick={goToEdit}>
            <FaPen color="white" />
          </RoundButton>
        )}
        <RoundButton>
          {club?.members?.includes(user?.uid) ? (
            <FaUserSlash color="#F49097" onClick={leaveClub} />
          ) : (
            <FaUserCheck color="#53DD6C" onClick={joinClub} />
          )}
        </RoundButton>
      </ColumnTwo>
    </Container>
  );
}

const Container = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  @media screen and (max-width: 1355px) {
    display: flex;
  }
`;

const ColumnOne = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;
const ColumnTwo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;
const ImageContainer = styled.div``;
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const ClubImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  @media screen and (max-width: 350px) {
    display: none;
  }
`;
const ClubName = styled.span`
  color: white;
  font-size: 15px;
  font-weight: 600;
`;
const ClubDescription = styled.span`
  color: gray;
  font-size: 13px;
  font-weight: 500;
`;

const MoreInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const ClubMembers = styled.div`
  color: gray;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;
const ClubPosts = styled.div`
  color: gray;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RoundButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272727;
  padding: 5px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #3e3f3f;
  }
`;

export default ClubsInformationMobile;
