import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addComment, getPostWithID } from "../../services/postService";
import { useAuthentication } from "../../services/authService";
import styled from "styled-components";
import Post from "../Post/Post";
import Swal from "sweetalert2";
import Header from "../Header/Header";
import { FaRegComment } from "react-icons/fa";

function PostPage() {
  const { id } = useParams();
  const user = useAuthentication();
  const [post, setPost] = useState(null);

  const setContent = (content) => {
    setPost(content);
  };
  const newComment = async () => {
    const container = document.createElement("div");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Enter your comment...");
    input.setAttribute("class", "swal-input");
    const button = document.createElement("button");
    button.setAttribute("type", "submit");
    button.innerHTML = "Comment";
    button.setAttribute("class", "swal-load-button");
    button.addEventListener("click", async () => {
      if (input.value.length > 1) {
        button.innerHTML = "Commenting...";
        await addComment(post.id, input.value, {
          displayName: user?.displayName,
          username: user?.username,
        }).then(() => {
          Swal.close();
          Swal.fire({
            title: "Comment added!",
            icon: "success",
            text: "Your comment has been added to the post.",
            timer: 3000,
            showConfirmButton: false,
          });
        });
      } else {
        Swal.fire({
          title: "Comment is too short!",
          text: "Please enter a longer comment.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
    container.appendChild(input);
    container.appendChild(button);
    Swal.fire({
      title: "Add a comment",
      showConfirmButton: false,
      html: container,
    });
  };
  useEffect(() => {
    let unsubscribe;

    if (id) {
      unsubscribe = getPostWithID(id, setContent);
    }

    return () => unsubscribe && unsubscribe();
  }, [id]);
  return (
    <>
      <Header />
      <Container>
        <PostContainer>
          <Post
            postId={post?.id}
            user={user}
            full={true}
            clubpost={post?.type === "clubpost" ? true : false}
          />
          <CommentInputSection>
            <Title>Comment:</Title>
            <CommentInput
              placeholder="Write a comment..."
              onClick={newComment}
              readOnly
            />
          </CommentInputSection>
          <Divider />
          <CommentSection>
            {post?.comments?.map((comment, index) => (
              <Comment key={index}>
                <svg width="0" height="0" style={{ position: "absolute" }}>
                  <linearGradient
                    id="enhanced-blue-gradient"
                    x1="100%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
                    <stop stopColor="#7a6ded" offset="0%" />
                    <stop stopColor="#a18cd1" offset="50%" stopOpacity="0.8" />
                    <stop stopColor="#591885" offset="100%" />
                  </linearGradient>
                </svg>
                <LineOne>
                  <ColumnOne>
                    <FaRegComment
                      size={30}
                      style={{ fill: "url(#enhanced-blue-gradient)" }}
                    />
                  </ColumnOne>
                  <ColumnTwo>
                    <CommentAuthorName>
                      {comment?.author?.displayName}
                    </CommentAuthorName>
                    <CommentAuthorUserName>
                      @{comment?.author?.username}
                    </CommentAuthorUserName>
                  </ColumnTwo>
                </LineOne>
                <CommentDivider />
                <LineTwo>
                  <CommentContent>{comment?.comment}</CommentContent>
                </LineTwo>
              </Comment>
            ))}
          </CommentSection>
        </PostContainer>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  padding: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  align-items: center;
  gap: 20px;
`;

const Divider = styled.hr`
  width: 90%;
  border: 1px solid #272727;
`;

const CommentInputSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #272727;
  border-radius: 30px;
  padding: 20px;
  gap: 5px;
`;

const Title = styled.span`
  color: white;
  font-size: 20px;
`;

const CommentInput = styled.input`
  padding: 8px 16px;
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

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 20px;
`;

const Comment = styled.div`
  background: #272727;
  border-radius: 30px;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LineOne = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const ColumnOne = styled.div`
  display: flex;
`;
const ColumnTwo = styled.div`
  display: flex;
  flex-direction: column;
`;
const LineTwo = styled.div``;

const CommentAuthorName = styled.span`
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

const CommentAuthorUserName = styled.span`
  color: gray;
  font-size: 14px;
`;

const CommentContent = styled.span`
  color: white;
`;

const CommentDivider = styled.hr`
  border: none;
  height: 1px;
  background-image: linear-gradient(
    90deg,
    hsla(312, 66%, 76%, 1) 0%,
    hsla(234, 93%, 67%, 1) 100%
  );
`;

export default PostPage;
