import React, { useState } from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import Button from "../Button/Button";
import { useAuthentication } from "../../services/authService";
import { createClub } from "../../services/clubService";
import { useNavigate } from "react-router-dom";
import { makeid } from "../../helpers/misc";
import Swal from "sweetalert2";

function CreateClub() {
  const user = useAuthentication();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const makeClub = async () => {
    if (!name.trim() || !description.trim() || !image) return;
    setLoading(true);
    const id = makeid(name.length + 10);
    createClub(id, name, description, image, user?.uid).then(() => {
      setLoading(false);
      setName("");
      setDescription("");
      setImage(null);
      Swal.fire({
        title: "Congratulations!",
        text: "Your club is now live!",
        icon: "success",
        buttons: false,
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        navigate(`/club/${id}`);
      });
    });
  };
  return (
    <Container>
      <Header />
      <Content>
        <TitleContainer>
          <Title>Create a club</Title>
        </TitleContainer>
        <FormContainer>
          <Form id="createClubForm">
            <InputContainer>
              <Label>Club name:</Label>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="createClubNameInput"
              />
            </InputContainer>
            <InputContainer>
              <Label>Club description:</Label>
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="createClubDescriptionInput"
              />
            </InputContainer>
            <InputContainer>
              <Label>Club image:</Label>
              <Input
                type="file"
                onChange={handleImageChange}
                id="createClubImageInput"
              />
            </InputContainer>
            <ButtonContainer>
              <Button
                onClick={!loading ? makeClub : null}
                text={loading ? "Creating..." : "Create"}
              />
            </ButtonContainer>
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
  color: white;
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
const TitleContainer = styled.div`
  width: 100%;
`;
const Title = styled.span`
  color: white;
  font-size: 40px;
  font-weight: 600;
  @media screen and (max-width: 335px) {
    font-size: 30px;
  }
`;
const ButtonContainer = styled.div``;
export default CreateClub;
