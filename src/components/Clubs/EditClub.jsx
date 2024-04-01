import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuthentication } from "../../services/authService";
import { useParams } from "react-router-dom";
import {
  banMember,
  editClubSettings,
  getClubWithID,
  kickMember,
  unbanMember,
} from "../../services/clubService";
import Loader from "../Loader/Loader";
import styled from "styled-components";
import Header from "../Header/Header";
import Button from "../Button/Button";
import { FaRegUser } from "react-icons/fa6";
import Swal from "sweetalert2";
import SweetAlert2 from "../Alert/SweetAlert2";
import {
  capitalize,
  validateClubName,
  validateClubDescription,
} from "../../helpers/misc";

function EditClub() {
  const user = useAuthentication();
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [shown, setShown] = useState(false);
  const [action, setAction] = useState("kick");
  const handleClick = useCallback(function handleClick() {
    setShown(true);
  }, []);

  const handleClose = useCallback(function handleClose() {
    setShown(false);
  }, []);
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const getClubInfo = useCallback(async () => {
    await getClubWithID(id).then(setClub);
  }, [id]);
  const ActionPopup = () => {
    const valueRef = useRef(null);
    useEffect(() => {
      const input = valueRef.current;
      if (input) {
        const length = input.value.length;
        input.focus();
        input.setSelectionRange(length, length);
      }
    }, []);
    const handleActionClick = () => {
      if (action === "kick") {
        kick();
      } else if (action === "ban") {
        ban();
      } else if (action === "unban") {
        unban();
      }
    };
    return (
      <>
        <PopupText>
          Enter the username of the member you want to {action}
        </PopupText>
        <Input
          ref={valueRef}
          placeholder="Enter username..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button text={capitalize(action)} onClick={handleActionClick} />
      </>
    );
  };
  const kick = async () => {
    if (value === null) {
      return;
    }
    if (value === "") {
      Swal.fire({
        title: "Something went wrong!",
        text: "You didn't enter a username!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    if (value === user?.username) {
      Swal.fire({
        title: "Something went wrong!",
        text: "You can't kick yourself!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    await kickMember(club?.uid, value).then(() => {
      Swal.fire({
        title: "Congratulations!",
        text: "This user has been kicked from the club!",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        getClubInfo();
      });
    });
  };

  const ban = async () => {
    if (value === null) {
      return;
    }
    if (value === "") {
      Swal.fire({
        title: "Something went wrong!",
        text: "You didn't enter a username!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    if (value === user?.username) {
      Swal.fire({
        title: "Something went wrong!",
        text: "You can't ban yourself!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    await banMember(club?.uid, value).then(() => {
      Swal.fire({
        title: "Congratulations!",
        text: "This user has been banned from the club!",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        getClubInfo();
      });
    });
  };

  const unban = async () => {
    if (value === null) {
      return;
    }
    if (value === "") {
      Swal.fire({
        title: "Something went wrong!",
        text: "You didn't enter a username!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    if (value === user?.username) {
      Swal.fire({
        title: "Something went wrong!",
        text: "You can't unban yourself!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    await unbanMember(club?.uid, value).then(() => {
      Swal.fire({
        title: "Congratulations!",
        text: "This user has been unbanned from the club!",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        getClubInfo();
      });
    });
  };

  const makeChanges = async () => {
    if (!validateClubName(name)) {
      Swal.fire({
        title: "Something went wrong!",
        text: "This name is too long. Try something under 20 characters!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    } else if (!validateClubDescription(description)) {
      Swal.fire({
        title: "Something went wrong!",
        text: "This description is too long. Try something under 100 characters!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    const updatedFields = {};
    if (!name.trim()) {
      updatedFields.name = club?.displayName;
    } else {
      updatedFields.name = name;
    }
    if (!description.trim()) {
      updatedFields.description = club?.description;
    } else {
      updatedFields.description = description;
    }
    setLoading(true);
    editClubSettings(
      club?.uid,
      updatedFields?.name,
      updatedFields?.description,
      image
    ).then(() => {
      setLoading(false);
      setName("");
      setDescription("");
      setImage(null);
      Swal.fire({
        title: "Congratulations!",
        text: "Club settings have been updated!",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        getClubInfo();
      });
    });
  };
  useEffect(() => {
    getClubInfo();
  }, [id, getClubInfo]);
  if (!club) {
    return <Loader />;
  }
  if (club?.admin !== user?.uid) {
    return (
      <Container>
        <Header />
        <NotAdminContainer>
          <NotAdmin>You are not the admin of this club</NotAdmin>
        </NotAdminContainer>
      </Container>
    );
  }
  return (
    <Container>
      <Header />
      <Content>
        <TextContainer>
          <Text>Edit Club</Text>
        </TextContainer>
        <ImageContainer>
          <ColumnOne>
            <ProfilePicture src={club?.profilePicture} />
          </ColumnOne>
          <ColumnTwo>
            <Name>{club?.displayName}</Name>
            <MembersContainer>
              <FaRegUser color="white" size={13} />
              <MembersCount>{club?.members?.length} members</MembersCount>
            </MembersContainer>
          </ColumnTwo>
        </ImageContainer>
        <ButtonsContainer>
          <Button
            text={"Kick Member"}
            onClick={() => {
              setAction("kick");
              handleClick();
            }}
          />
          <Button
            text={"Ban Member"}
            onClick={() => {
              setAction("ban");
              handleClick();
            }}
          />
          <Button
            text={"Unban Member"}
            onClick={() => {
              setAction("unban");
              handleClick();
            }}
          />
        </ButtonsContainer>
        <FormContainer>
          <Form id="editClubForm">
            <InputContainer>
              <Label>Name:</Label>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="editClubName"
              />
            </InputContainer>
            <InputContainer>
              <Label>Description:</Label>
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="editClubDescription"
              />
            </InputContainer>
            <InputContainer>
              <Label>Profile picture:</Label>
              <Input
                type="file"
                onChange={handleImageChange}
                id="editClubImage"
              />
            </InputContainer>

            <Button
              text={loading ? "Making changes..." : "Save Changes"}
              onClick={makeChanges}
            />
          </Form>
        </FormContainer>
      </Content>
      <SweetAlert2
        show={shown}
        onClose={handleClose}
        title={capitalize(action)}
      >
        <ActionPopup />
      </SweetAlert2>
    </Container>
  );
}

const PopupText = styled.p`
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100dvh;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  max-width: 700px;
  width: 100%;
  gap: 10px;
  padding: 20px;
`;
const TextContainer = styled.div``;
const Text = styled.span`
  color: white;
  font-size: 40px;
  font-weight: 600;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Input = styled.input`
  padding: 8px 16px;
  margin: 8px 0;
  background: #161616;
  border-radius: 10px;
  outline: none;
  color: white;
  width: 100%;
  height: 50px;

  border: 1px solid transparent;
  &:focus {
    border: 1px solid #3e3f3f;
  }
`;
const Label = styled.span`
  color: gray;
  font-size: 20px;
  font-weight: 600;
`;
const FormContainer = styled.div`
  width: 100%;
`;

const Form = styled.form`
  background-color: #272727;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  align-items: center;
`;
const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  @media screen and (max-width: 480px) {
    width: 70px;
    height: 70px;
  }
`;
const ColumnOne = styled.div`
  display: flex;
  align-items: center;
`;
const ColumnTwo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  @media screen and (max-width: 590px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const Name = styled.span`
  color: white;
  font-size: 30px;
  font-weight: 600;
  @media screen and (max-width: 480px) {
    font-size: 20px;
  }
`;

const MembersContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  color: white;
`;

const MembersCount = styled.span`
  font-size: 20px;
  font-weight: 400;
`;

const NotAdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
`;

const NotAdmin = styled.h1`
  font-size: 50px;
  font-weight: 700;
  color: white;
`;

export default EditClub;
