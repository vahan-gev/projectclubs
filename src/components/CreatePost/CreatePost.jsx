import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FaImage, FaListUl, FaClapperboard, FaCalendar } from "react-icons/fa6";
import Button from "../Button/Button";
import { createPost } from "../../services/postService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SweetAlert2 from "../Alert/SweetAlert2";

function CreatePost({ user }) {
  const [post, setPost] = useState("");
  const MySwal = withReactContent(Swal);
  const [shown, setShown] = useState(false);
  const handleClick = useCallback(function handleClick() {
    setShown(true);
  }, []);

  const handleClose = useCallback(function handleClose() {
    setShown(false);
  }, []);
  const Popup = () => {
    const postInputRef = useRef(null);

    useEffect(() => {
      const textArea = postInputRef.current;
      if (textArea) {
        const length = textArea.value.length;
        textArea.focus();
        textArea.setSelectionRange(length, length);
      }
    }, []);
    return (
      <PopupContainer>
        <PopupInfoContainer>
          <UserImage src={user?.profilePicture} />
          <UserName>{user?.displayName}</UserName>
        </PopupInfoContainer>
        <PostInput
          ref={postInputRef}
          placeholder="What's on your mind?"
          value={post}
          onChange={(e) => setPost(e.target.value)}
          id="userPostInput"
        />
        <PopupButtonsContainer>
          <PopupButton>
            <IconContainer>
              <FaImage color="white" size={13} />
            </IconContainer>
            <PopupTextContainer>Image</PopupTextContainer>
          </PopupButton>
          <PopupButton>
            <IconContainer>
              <FaClapperboard color="white" size={13} />
            </IconContainer>
            <PopupTextContainer>Video</PopupTextContainer>
          </PopupButton>
          <PopupButton>
            <IconContainer>
              <FaCalendar color="white" size={13} />
            </IconContainer>
            <PopupTextContainer>Event</PopupTextContainer>
          </PopupButton>
          <PopupButton>
            <IconContainer>
              <FaListUl color="white" size={13} />
            </IconContainer>
            <PopupTextContainer>More</PopupTextContainer>
          </PopupButton>
        </PopupButtonsContainer>
        <Button text="Post" onClick={makePost} />
      </PopupContainer>
    );
  };
  const makePost = async () => {
    if (!post.trim()) return;
    MySwal.close();
    await createPost(user?.uid, post, "post")
      .then(() => {
        setPost("");
      })
      .then(() => {
        Swal.fire({
          title: "Congratulations!",
          text: "Your post is now live!",
          icon: "success",
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };
  return (
    <Container>
      <RowZero>
        <Title>Hey, {user?.displayName} 🦁</Title>
      </RowZero>
      <RowOne>
        <UserImage src={user?.profilePicture} />
        <InputContainer>
          <Input
            onClick={() => {
              setPost("");
              handleClick();
            }}
            type="text"
            placeholder="What's on your mind?"
            readOnly
            id="createUserPostReadOnly"
          />
        </InputContainer>
      </RowOne>
      <RowTwo>
        <PostButton
          onClick={() => {
            setPost("");
            handleClick();
          }}
        >
          <IconContainer>
            <FaImage color="white" size={15} />
          </IconContainer>
          <TextContainer>Image</TextContainer>
        </PostButton>
        <PostButton
          onClick={() => {
            setPost("");
            handleClick();
          }}
        >
          <IconContainer>
            <FaClapperboard color="white" size={15} />
          </IconContainer>
          <TextContainer>Video</TextContainer>
        </PostButton>
        <PostButton
          onClick={() => {
            setPost("");
            handleClick();
          }}
        >
          <IconContainer>
            <FaCalendar color="white" size={15} />
          </IconContainer>
          <TextContainer>Event</TextContainer>
        </PostButton>
        <PostButton
          onClick={() => {
            setPost("");
            handleClick();
          }}
        >
          <IconContainer>
            <FaListUl color="white" size={15} />
          </IconContainer>
          <TextContainer>More</TextContainer>
        </PostButton>
      </RowTwo>
      <SweetAlert2 show={shown} onClose={handleClose} title="Create a post">
        <Popup />
      </SweetAlert2>
    </Container>
  );
}

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PopupInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 10px;
`;

const PostInput = styled.textarea`
  border: none;
  background-color: #161616;
  padding: 20px;
  outline: none;
  color: white;
  width: 100%;
  min-height: 150px;
  font-size: 20px;
  border-radius: 10px;
  resize: none;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 60px;
  border-radius: 35px;
  background-color: #272727;
  gap: 5px;
  width: 100%;
  transition: 0.2s;
  @media screen and (max-width: 482px) {
    padding: 30px;
  }
`;

const UserImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  @media screen and (max-width: 630px) {
    width: 45px;
    height: 45px;
  }
`;

const UserName = styled.span`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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

const RowOne = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
`;
const RowTwo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 20px;
  justify-content: space-between;
  transition: 0.2s;
  @media screen and (max-width: 630px) {
    gap: 10px;
    justify-content: flex-start;
  }
  @media screen and (max-width: 360px) {
    gap: 15px;
    justify-content: flex-start;
  }
`;

const RowZero = styled.div`
  width: 100%;
  display: flex;
`;
const Title = styled.p`
  color: white;
  font-weight: 500;
`;

const PostButton = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  background-color: #161616;
  padding: 10px 20px;
  transition: 0.3s;
  cursor: pointer;
  font-weight: 500;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover {
    background-color: #3e3f3f;
  }

  @media screen and (max-width: 360px) {
    padding: 0;
    background-color: transparent;
  }
`;

const PopupButton = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  background-color: #161616;
  padding: 10px 20px;
  transition: 0.3s;
  cursor: pointer;
  font-weight: 500;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover {
    background-color: #3e3f3f;
  }

  @media screen and (max-width: 360px) {
    padding: 0;
    background-color: transparent;
  }
`;

const PopupButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 20px;
  justify-content: space-between;
  transition: 0.2s;
  @media screen and (max-width: 630px) {
    gap: 10px;
    justify-content: flex-start;
  }
  @media screen and (max-width: 360px) {
    gap: 15px;
    justify-content: flex-start;
  }
`;

const IconContainer = styled.div``;
const TextContainer = styled.div`
  color: white;
  @media screen and (max-width: 630px) {
    display: none;
  }
`;

const PopupTextContainer = styled.div`
  color: white;
  font-size: 13px;
  @media screen and (max-width: 630px) {
    display: none;
  }
`;

export default CreatePost;
