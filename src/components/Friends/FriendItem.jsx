import React, { useCallback, useEffect, useState } from "react";
import { getUser } from "../../services/authService";
import styled from "styled-components";
import Button from "../Button/Button";
import { removeFriendFromFirebase } from "../../services/userService";

function FriendItem({ id, user }) {
  const [friend, setFriend] = useState(null);
  const getFriend = useCallback(async () => {
    await getUser(id).then(setFriend);
  }, [id]);
  const removeFriend = async () => {
    await removeFriendFromFirebase(user.uid, id);
  };
  useEffect(() => {
    getFriend();
  }, [id, getFriend]);
  return (
    <Wrapper>
      <Container>
        <RowOne>
          <ColumnOne>
            <FriendName>{friend?.displayName}</FriendName>
            <FriendUserName>@{friend?.username}</FriendUserName>
          </ColumnOne>
          <ColumnTwo>
            <Button text="Remove" onClick={removeFriend} />
          </ColumnTwo>
        </RowOne>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  background-image: linear-gradient(
    90deg,
    hsla(312, 66%, 76%, 1) 0%,
    hsla(234, 93%, 67%, 1) 100%
  );
  border-radius: 15px;
  padding: 1px;
  width: 100%;
  max-width: 700px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 10px 20px;
  background-color: #272727;
  color: white;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
  width: 100%;
  border-radius: 15px;
`;

const ColumnOne = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnTwo = styled.div``;

const RowOne = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const FriendName = styled.span`
  font-weight: 600;
  font-size: 20px;
  @media screen and (max-width: 455px) {
    font-size: 15px;
  }
  @media screen and (max-width: 400px) {
    font-size: 12px;
  }
  @media screen and (max-width: 370px) {
    font-size: 10px;
  }
`;
const FriendUserName = styled.span`
  color: gray;
  font-size: 16px;
  @media screen and (max-width: 455px) {
    font-size: 12px;
  }
`;

export default FriendItem;
