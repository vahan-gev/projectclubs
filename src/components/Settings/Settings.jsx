import React, { useState } from "react";
import {
  checkIfUsernameExists,
  useAuthentication,
} from "../../services/authService";
import styled from "styled-components";
import Header from "../Header/Header";
import Button from "../Button/Button";
import Loader from "../Loader/Loader";
import { editUserSettings } from "../../services/userService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  validateBio,
  validateDisplayName,
  validateUsername,
} from "../../helpers/misc";

function Settings() {
  const user = useAuthentication();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const makeChanges = async () => {
    await checkIfUsernameExists(username).then((exists) => {
      if (exists || !validateUsername(username)) {
        Swal.fire({
          title: "Something went wrong!",
          text: "This username is already taken or contains restricted words!",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      } else if (!validateDisplayName(name)) {
        Swal.fire({
          title: "Something went wrong!",
          text: "This name is too long. Try something under 20 characters!",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      } else if (!validateBio(bio)) {
        Swal.fire({
          title: "Something went wrong!",
          text: "This bio is too long. Try something under 30 characters!",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      } else {
        const updatedFields = {};
        if (!name.trim()) {
          updatedFields.name = user?.displayName;
        } else {
          updatedFields.name = name;
        }
        if (!username.trim()) {
          updatedFields.username = user?.username;
        } else {
          updatedFields.username = username;
        }
        if (!bio.trim()) {
          updatedFields.bio = user?.bio;
        } else {
          updatedFields.bio = bio;
        }
        setLoading(true);
        editUserSettings(
          user?.uid,
          updatedFields?.name,
          updatedFields?.username,
          updatedFields?.bio,
          image
        ).then(() => {
          setLoading(false);
          setName("");
          setUsername("");
          setBio("");
          setImage(null);
          Swal.fire({
            title: "Congratulations!",
            text: "Your settings have been updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            navigate(`/`);
          });
        });
      }
    });
  };
  if (!user) return <Loader />;
  return (
    <Container>
      <Header active="settings" />
      <Content>
        <TextContainer>
          <Text>Settings</Text>
        </TextContainer>
        <ImageContainer>
          <ColumnOne>
            <ProfilePicture src={user?.profilePicture} />
          </ColumnOne>
          <ColumnTwo>
            <Name>{user?.displayName}</Name>
            <Username>@{user?.username}</Username>
          </ColumnTwo>
        </ImageContainer>
        <FormContainer>
          <Form id="editUserSettingsForm">
            <InputContainer>
              <Label>Name:</Label>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="editUserName"
              />
            </InputContainer>
            <InputContainer>
              <Label>Username:</Label>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="editUserUsername"
              />
            </InputContainer>
            <InputContainer>
              <Label>Bio:</Label>
              <Input
                type="text"
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                id="editUserBio"
              />
            </InputContainer>
            <InputContainer>
              <Label>Profile picture:</Label>
              <Input
                type="file"
                onChange={handleImageChange}
                id="editUserImage"
              />
            </InputContainer>

            <Button
              text={loading ? "Making changes..." : "Save Changes"}
              onClick={makeChanges}
            />
          </Form>
        </FormContainer>
      </Content>
    </Container>
  );
}

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
  gap: 5px;
  padding: 0 20px;
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
  @media screen and (max-width: 540px) {
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

const Name = styled.span`
  color: white;
  font-size: 30px;
  font-weight: 600;
  @media screen and (max-width: 540px) {
    font-size: 20px;
  }
  @media screen and (max-width: 390px) {
    font-size: 15px;
  }
`;

const Username = styled.span`
  color: gray;
  font-size: 20px;
  font-weight: 400;
  @media screen and (max-width: 540px) {
    font-size: 15px;
  }
  @media screen and (max-width: 390px) {
    font-size: 12px;
  }
`;

export default Settings;
