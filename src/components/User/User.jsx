import React, { useEffect, useState, useCallback } from "react";
import {
  getUserWithUsername,
  useAuthentication,
} from "../../services/authService";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import styled from "styled-components";
import { VscVerifiedFilled } from "react-icons/vsc";
import {
  acceptRequest,
  addFriendRequest,
  checkFriendRequestSent,
  checkIfFriend,
  removeFriendFromFirebase,
  removeFriendRequest,
} from "../../services/userService";
import Button from "../Button/Button";
import Post from "../Post/Post";
import Loader from "../Loader/Loader";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Swal from "sweetalert2";

function Content({ user, setIsLoading, isLoading }) {
  const { username } = useParams();
  const [fetchedUser, setFetchedUser] = useState("loading");
  const [isFriend, setIsFriend] = useState(false);
  const [friendButtonText, setFriendButtonText] = useState("Add friend");
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();
  const goToFriends = () => {
    navigate(`/friends`);
  };
  const goToClubs = () => {
    navigate(`/clubs/list/${fetchedUser?.username}`);
  };
  const goToSettings = () => {
    navigate(`/settings`);
  };
  const shareAccount = () => {
    Swal.fire({
      title: "Share your account",
      text: `Share this link to your friends to let them follow you`,
      html: `<div class="qr_container"><img src="https://qrtag.net/api/qr_transparent_6.svg?url=${window.location.href}" alt="profile" class="profile_qr" /></div>`,
      confirmButtonColor: "#161616",
      confirmButtonText: "Done",
    });
  };
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    navigate("/login");
  };
  const handleFriendRequest = async () => {
    setIsLoading(true);
    try {
      if (friendButtonText === "Add friend" && !isLoading) {
        await addFriendRequest(user.uid, fetchedUser.uid);
        setFriendButtonText("Request sent");
      } else if (friendButtonText === "Accept request" && !isLoading) {
        acceptRequest(user.uid, fetchedUser.uid);
        setFriendButtonText("Remove friend");
      } else if (friendButtonText === "Remove friend" && !isLoading) {
        await removeFriendFromFirebase(user.uid, fetchedUser.uid);
        setFriendButtonText("Add friend");
      } else if (friendButtonText === "Request sent" && !isLoading) {
        await removeFriendRequest(user.uid, fetchedUser.uid);
        setFriendButtonText("Add friend");
      }
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
    setIsLoading(false);
  };
  const checkFriendStatus = useCallback(
    async (fetchedUser) => {
      try {
        const friendStatus = await checkIfFriend(fetchedUser?.uid, user?.uid);
        if (friendStatus) {
          setIsFriend(true);
          setFriendButtonText("Remove friend");
        } else {
          const requestSent = await checkFriendRequestSent(
            user?.uid,
            fetchedUser?.uid
          );
          const haveRequestFromUser = await checkFriendRequestSent(
            fetchedUser?.uid,
            user?.uid
          );
          if (requestSent) {
            setFriendButtonText("Request sent");
          } else if (haveRequestFromUser) {
            setFriendButtonText("Accept request");
          } else {
            setFriendButtonText("Add friend");
          }
          setIsFriend(false);
        }
      } catch (error) {
        console.error("Error checking friend status:", error);
      }
    },
    [user?.uid]
  );

  const fetchUserDetails = useCallback(async () => {
    try {
      const fetchedUserData = await getUserWithUsername(username);
      if (fetchedUserData) {
        setFetchedUser(fetchedUserData);
        setUserPosts(fetchedUserData?.posts.reverse());
        checkFriendStatus(fetchedUserData);
        setIsLoading(false);
      } else {
        setFetchedUser(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setFetchedUser(null);
    }
  }, [username, setIsLoading, checkFriendStatus]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  if (fetchedUser === "loading") return <Loader />;
  else if (!fetchedUser) {
    return <div className="text-white">No user found</div>;
  } else {
    return (
      <UserContainer>
        <UserInfoSection>
          <LineOne>
            <ColumnOne>
              <ColumnOneLineOne>
                <UserDetails>
                  <UserDisplayName>{fetchedUser?.displayName}</UserDisplayName>
                  {fetchedUser?.verified && (
                    <VerificationContainer>
                      <VscVerifiedFilled color="#0395F6" size={22} />
                    </VerificationContainer>
                  )}
                </UserDetails>
                <UserDetails>
                  <UserUsername>@{fetchedUser?.username}</UserUsername>
                  {fetchedUser?.username !== user?.username ? (
                    isFriend ? (
                      <Badge>Friends</Badge>
                    ) : null
                  ) : (
                    <Badge onClick={shareAccount}>Share Account</Badge>
                  )}
                </UserDetails>
                <UserDetails>
                  <UserBio>{fetchedUser?.bio}</UserBio>
                </UserDetails>
              </ColumnOneLineOne>
            </ColumnOne>
            <ColumnTwo>
              <UserImage src={fetchedUser?.profilePicture} alt="profile" />
            </ColumnTwo>
          </LineOne>

          <LineTwo>
            <UserDataContainer>
              <UserDataText
                onClick={
                  fetchedUser?.username === user?.username ? goToFriends : null
                }
              >
                {fetchedUser?.friends?.length} friends
              </UserDataText>
              |<UserDataText>{fetchedUser?.posts?.length} posts</UserDataText>|
              <UserDataText onClick={goToClubs}>
                {fetchedUser?.clubs?.length} clubs
              </UserDataText>
            </UserDataContainer>
          </LineTwo>
        </UserInfoSection>
        <UserActionSection>
          {fetchedUser?.username !== user?.username && (
            <Button text={friendButtonText} onClick={handleFriendRequest} />
          )}
          {fetchedUser?.username !== user?.username ? (
            <Button text="Message" />
          ) : (
            <>
              <Button text="Edit Profile" onClick={goToSettings} />
              <Button text="Log out" onClick={handleLogout} />
            </>
          )}
        </UserActionSection>
        <Divider />
        <PostsSection>
          {userPosts?.length > 0 ? (
            userPosts?.map((postID) => (
              <Post
                key={postID}
                postId={postID}
                user={user}
                getClubInfo={fetchUserDetails}
              />
            ))
          ) : (
            <NoPost>No posts found</NoPost>
          )}
        </PostsSection>
      </UserContainer>
    );
  }
}

function User() {
  const user = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (value) => {
    setIsLoading(value);
  };

  return (
    <Container>
      {isLoading && <Loader />}
      {user && <Header active="profile" />}
      <Content isLoading={isLoading} setIsLoading={setLoading} user={user} />
    </Container>
  );
}

const Divider = styled.hr`
  border: 1px solid #27272a;
  margin: 30px 0;
`;

const UserActionSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  gap: 10px;

  @media screen and (max-width: 360px) {
    flex-direction: column;
  }
`;

const VerificationContainer = styled.div`
  margin: 0 10px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Badge = styled.span`
  background-color: #363636;
  color: white;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 25px;
  font-size: 14px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const PostsSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const NoPost = styled.span`
  color: white;
  font-weight: 500;
  font-size: 20px;
`;
const UserInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ColumnOne = styled.div`
  display: flex;
  flex-direction: column;
`;
const ColumnTwo = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
`;

const LineOne = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;
const ColumnOneLineOne = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const LineTwo = styled.div``;
const UserDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  color: white;
  margin-top: 10px;
`;
const UserDataText = styled.span`
  color: white;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
`;
const UserContainer = styled.div`
  padding: 0 20px;
  width: 100%;
  max-width: 700px;
  margin-top: 40px;
`;

const UserDisplayName = styled.h1`
  color: white;
  font-size: 30px;
  font-weight: 600;
  @media screen and (max-width: 570px) {
    font-size: 20px;
  }
  @media screen and (max-width: 410px) {
    font-size: 15px;
  }
`;

const UserUsername = styled.span`
  color: white;
  @media screen and (max-width: 410px) {
    font-size: 12px;
  }
`;

const UserImage = styled.img`
  border-radius: 50%;
  width: 110px;
  height: 110px;
  object-fit: cover;
  @media screen and (max-width: 570px) {
    width: 70px;
    height: 70px;
  }
`;

const UserBio = styled.span`
  color: gray;
  font-size: 18px;
  font-weight: 400;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

export default User;
