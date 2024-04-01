import React, { useCallback, useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { getUser } from "../../services/authService";
import {
  FaRegComment,
  FaRegHeart,
  FaRegEye,
  FaHeart,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FaShare } from "react-icons/fa6";

import {
  deleteUserPost,
  getPostWithID,
  incrementPostViews,
  likePost,
  unlikePost,
} from "../../services/postService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { VscVerifiedFilled } from "react-icons/vsc";
import { formatNumber } from "../../helpers/misc";
import { deleteClubPost } from "../../services/clubService";

function Post({
  postId,
  user,
  full = false,
  getClubInfo,
  canBeDeleted = false,
}) {
  const [author, setAuthor] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [animateLike, setAnimateLike] = useState(false);
  const navigate = useNavigate();
  const [content, setContent] = useState(null);

  const getAuthor = useCallback(async () => {
    if (content?.author) {
      await getUser(content.author).then(setAuthor);
    }
  }, [content]);

  const setPost = (content) => {
    setContent(content);
  };
  const addLikeToPost = () => {
    if (content?.likes?.includes(user?.uid)) {
      const index = content?.likes?.indexOf(user?.uid);
      content?.likes?.splice(index, 1);
      setUserLiked(false);
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 500);
      unlikePost(user?.uid, content?.id);
    } else {
      content?.likes?.push(user?.uid);
      setUserLiked(true);
      setAnimateLike(true);
      setTimeout(() => setAnimateLike(false), 500);
      likePost(user?.uid, content?.id);
    }
  };

  const goToPost = () => {
    incrementPostViews(content?.id);
    navigate(`/post/${content?.id}`);
  };

  const goToAuthor = () => {
    navigate(`/user/${author?.username}`);
  };

  const handlePostDeletion = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#161616",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (content?.type === "clubpost") {
          await deleteClubPost(content?.id, content?.clubID);
        } else {
          await deleteUserPost(content?.id, user?.uid);
        }
        getClubInfo();
        Swal.fire({
          title: "Deleted!",
          text: "Your post has been deleted.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
  };

  useEffect(() => {
    let unsubscribe;

    if (postId) {
      unsubscribe = getPostWithID(postId, setPost);
    }
    return () => unsubscribe && unsubscribe();
  }, [postId]);

  useEffect(() => {
    getAuthor();
    setUserLiked(content?.likes?.includes(user?.uid));
  }, [content, user?.uid, getAuthor]);
  return (
    <Container>
      <RowOne>
        <Wrapper>
          <ColumnOne>
            {author ? (
              <AuthorImage src={author?.profilePicture} />
            ) : (
              <ImagePlaceholder />
            )}
          </ColumnOne>
          <ColumnTwo>
            <AuthorLine>
              <Nameline>
                <AuthorName onClick={goToAuthor}>
                  {author?.displayName}
                </AuthorName>
                {author?.verified && (
                  <VscVerifiedFilled color="#0395F6" size={15} />
                )}
              </Nameline>
              <PostDot>•</PostDot>
              <PostDate>
                {content?.createdAt?.toDate().toString().slice(0, 21)}
              </PostDate>
            </AuthorLine>
            <AuthorUsername onClick={goToAuthor}>
              @{author?.username}
            </AuthorUsername>
          </ColumnTwo>
        </Wrapper>
        <ColumnThree>
          {content?.author === user?.uid || canBeDeleted ? (
            <RoundButton onClick={handlePostDeletion}>
              <FaRegTrashAlt size={15} color={"#F49097"} />
            </RoundButton>
          ) : null}
        </ColumnThree>
      </RowOne>
      <RowTwo onClick={!full ? goToPost : null}>
        <PostContent>
          {full || content?.data.length < 100
            ? content?.data
            : `${content?.data.slice(0, 100)}...`}
        </PostContent>
      </RowTwo>
      <RowThree>
        <InfoSection>
          <FirstColumn>
            <InfoButton onClick={addLikeToPost} animate={animateLike}>
              <InfoText>
                <InfoTextIcon>
                  {userLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                </InfoTextIcon>
                {content?.likes?.length}
              </InfoText>
            </InfoButton>
            <InfoButton onClick={!full ? goToPost : null}>
              <InfoText>
                <InfoTextIcon>
                  <FaRegComment size={20} />
                </InfoTextIcon>
                {content?.comments?.length}
              </InfoText>
            </InfoButton>

            <InfoButton
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.href}post/${content?.id}`
                );
                Swal.fire({
                  title: "Link copied!",
                  icon: "info",
                  text: "The link to this post has been copied to your clipboard.",
                  timer: 3000,
                  showConfirmButton: false,
                });
              }}
            >
              <InfoText>
                <InfoTextIcon>
                  <FaShare size={20} />
                </InfoTextIcon>
              </InfoText>
            </InfoButton>
          </FirstColumn>
          <SecondColumn>
            <InfoButton>
              <InfoText>
                <InfoTextIcon>
                  <FaRegEye size={20} />
                </InfoTextIcon>
                {formatNumber(content?.views)}
              </InfoText>
            </InfoButton>
          </SecondColumn>
        </InfoSection>
      </RowThree>
    </Container>
  );
}

const bounceZoomAnimation = keyframes`
    0% { transform: scale(1); } 
    50% { transform: scale(0.7); }
    75% { transform: scale(1.2); }
    100% { transform: scale(1); }
    
`;

const Container = styled.div`
  border: 2px solid #27272a;
  width: 100%;
  padding: 20px;
  color: white;
  border-radius: 35px;
  background-color: rgba(39, 39, 39, 1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: 0.2s;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover {
    background-color: rgba(39, 39, 39, 0.7);
  }
`;

const ColumnOne = styled.div`
  display: flex;
  flex-direction: column;
`;
const ColumnTwo = styled.div``;
const ColumnThree = styled.div``;
const RoundButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #161616;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: #27272a;
  }
  padding: 5px;
`;
const AuthorName = styled.span`
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  @media screen and (max-width: 603px) {
    font-size: 14px;
  }
  @media screen and (max-width: 375px) {
    font-size: 12px;
  }
`;
const AuthorUsername = styled.span`
  color: gray;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  @media screen and (max-width: 515px) {
    font-size: 12px;
  }
`;
const AuthorImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  @media screen and (max-width: 400px) {
    width: 40px;
    height: 40px;
  }
  @media screen and (max-width: 350px) {
    display: none;
  }
`;

const ImagePlaceholder = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #161616;
`;

const Nameline = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const PostContent = styled.p`
  color: white;
  font-size: 18px;
`;

const AuthorLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const PostDate = styled.span`
  color: gray;
  font-size: 16px;
  font-weight: 400;
  @media screen and (max-width: 556px) {
    font-size: 13px;
  }
  @media screen and (max-width: 530px) {
    display: none;
  }
`;

const PostDot = styled.div`
  @media screen and (max-width: 530px) {
    display: none;
  }
`;

const InfoText = styled.span`
  color: gray;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: 0.2s;
  @media screen and (max-width: 420px) {
    font-size: 15px;
  }
`;

const InfoButton = styled(({ animate, ...rest }) => <div {...rest} />)`
  background-color: #161616;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  cursor: pointer;
  ${(props) =>
    props.animate &&
    css`
      animation: ${bounceZoomAnimation} 0.5s ease;
    `}
  &:hover {
    ${InfoText} {
      color: white;
    }
  }
  @media screen and (max-width: 420px) {
    padding: 5px 10px;
  }
`;
const InfoTextIcon = styled.div``;
const InfoSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`;

const FirstColumn = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const SecondColumn = styled.div``;

const RowOne = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const RowTwo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RowThree = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default Post;
