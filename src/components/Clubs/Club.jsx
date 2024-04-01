import React, { useCallback, useEffect, useState } from "react";
import { getClubWithID } from "../../services/clubService";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { formatNumber } from "../../helpers/misc";

function Club({ clubID, full = false, user }) {
  const [club, setClub] = useState(null);
  const navigate = useNavigate();
  const getClubInfo = useCallback(async () => {
    await getClubWithID(clubID).then((club) => {
      setClub(club);
    });
  }, [clubID]);

  const goToClub = () => {
    navigate(`/club/${clubID}`);
  };

  useEffect(() => {
    getClubInfo();
  }, [clubID, getClubInfo]);
  return (
    <Container onClick={goToClub} isFull={full}>
      <Wrapper>
        <ColumnOne>
          {club ? (
            <ClubImage src={club?.profilePicture} />
          ) : (
            <ImagePlaceholder />
          )}
        </ColumnOne>
        <ColumnTwo>
          <ClubName>
            {club?.displayName?.length > 10
              ? `${club?.displayName.slice(0, 10)}...`
              : club?.displayName}
          </ClubName>
        </ColumnTwo>
      </Wrapper>
      <ColumnThree>
        {club?.admin === user?.uid && full && (
          <AdminContainer>
            <AdminText>Admin</AdminText>
          </AdminContainer>
        )}
        {!full && (
          <>
            <MemberCount>{formatNumber(club?.members?.length)}</MemberCount>
            <FaRegUser size={14} />
          </>
        )}
      </ColumnThree>
    </Container>
  );
}

const Container = styled(({ isFull, ...rest }) => <div {...rest} />)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: ${(props) => (props.isFull ? "20px" : "10px 20px")};
  border-radius: ${(props) => (props.isFull ? "15px" : "35px")};
  background-color: ${(props) =>
    props.isFull ? "#272727" : "rgba(22, 22, 22, 1)"};
  color: white;
  justify-content: space-between;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.isFull ? "#3e3e3e" : "rgba(22, 22, 22, 0.7)"};
  }
`;

const AdminContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #161616;
  padding: 8px 15px;
  border-radius: 30px;
`;

const AdminText = styled.span`
  color: white;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const ColumnOne = styled.div`
  display: flex;
  align-items: center;
`;

const ClubImage = styled.img`
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

const ColumnTwo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnThree = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
`;

const MemberCount = styled.span`
  color: white;
  font-size: 18px;
`;

const ClubName = styled.span`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

export default Club;
