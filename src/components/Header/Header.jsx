import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { auth } from "../../firebaseConfig";
import { IoLogOut } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../../services/authService";
import { getUserFriendRequests } from "../../services/userService";
import Button from "../Button/Button";
import FriendRequest from "../FriendRequest/FriendRequest";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SweetAlert2 from "../Alert/SweetAlert2";
import { GoHome } from "react-icons/go";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  IoNotificationsOutline,
  IoPaperPlaneOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { PiGearFine } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { AnimatePresence, motion } from "framer-motion";
function Header({ active = "home" }) {
  const navigate = useNavigate();
  const user = useAuthentication();
  const [userFriendRequests, setUserFriendRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [shown, setShown] = useState(false);
  const [searchShown, setSearchShown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const MySwal = withReactContent(Swal);
  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Messages", href: "/messages" },
    { title: "Clubs", href: "/clubs/list/" + user?.username },
    { title: "Profile", href: "/user/" + user?.username },
    { title: "Settings", href: "/settings" },
  ];
  const menuVars = {
    initial: {
      scaleY: 0,
    },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.5,
        ease: [0.12, 0, 0.39, 0],
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVars = {
    initial: {
      transition: {
        staggerChildren: 0.09,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      },
    },
  };
  const handleClick = useCallback(function handleClick() {
    setShown(true);
  }, []);

  const handleClose = useCallback(function handleClose() {
    setShown(false);
  }, []);

  const handleSearchClick = useCallback(function handleSearchClick() {
    setSearchShown(true);
  }, []);

  const handleSearchClose = useCallback(function handleSearchClose() {
    setSearchShown(false);
  }, []);

  async function getFriendRequests(user) {
    await getUserFriendRequests(user).then((requests) => {
      setUserFriendRequests(requests);
    });
  }
  useEffect(() => {
    if (user) {
      if (!auth.currentUser.emailVerified) {
        navigate("/emailnotverified");
      }
      getFriendRequests(user);
    }
  }, [setUserFriendRequests, user, navigate]);
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/user/" + user?.username);
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  const Popup = () => {
    return (
      <PopupContainer>
        <FriendRequestsContainer>
          {userFriendRequests.length > 0 ? (
            userFriendRequests.map((request) => (
              <FriendRequest key={request?.by?.username} request={request} />
            ))
          ) : (
            <NoRequest>No notifications</NoRequest>
          )}
        </FriendRequestsContainer>
        <ButtonContainer>
          <Button
            text="Close"
            onClick={() => {
              MySwal.close();
            }}
          />
        </ButtonContainer>
      </PopupContainer>
    );
  };

  const SearchPopup = () => {
    const [searchPopupText, setSearchPopupText] = useState("");
    const searchRef = useRef(null);

    useEffect(() => {
      const searchInput = searchRef.current;
      if (searchInput) {
        const length = searchInput.value.length;
        searchInput.focus();
        searchInput.setSelectionRange(length, length);
      }
    });
    return (
      <PopupContainer>
        <Input
          type="text"
          ref={searchRef}
          placeholder="Search..."
          value={searchPopupText}
          onChange={(e) => setSearchPopupText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchPopupText.trim().length > 0) {
              MySwal.close();
              navigate(`/user/${searchPopupText}`);
            }
          }}
          id="searchPopupInput"
        />

        <ButtonContainer>
          <Button
            text="Search"
            onClick={() => {
              if (searchPopupText.trim().length > 0) {
                MySwal.close();
                navigate(`/user/${searchPopupText}`);
              }
            }}
          />
        </ButtonContainer>
      </PopupContainer>
    );
  };

  return (
    <Container>
      <LeftContainer>
        <TitleContainer>
          <Title
            onClick={() => {
              navigate("/");
            }}
          >
            <GradientText>Clubs</GradientText>
          </Title>
        </TitleContainer>
        <SearchContainer>
          <SearchBar
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && search.trim().length > 0) {
                navigate(`/user/${search}`);
              }
            }}
            id="searchBarInput"
          />
          <SearchButton onClick={handleSearchClick}>
            <IconContainer>
              <IoSearchOutline size={22} />
            </IconContainer>
          </SearchButton>
        </SearchContainer>
      </LeftContainer>
      <MiddleContainer>
        <HeaderButton onClick={goToHome}>
          <IconContainer>
            <GoHome size={22} />
          </IconContainer>
          {active === "home" && <Active />}
        </HeaderButton>
        <HeaderButton>
          <IconContainer>
            <IoPaperPlaneOutline size={22} />
          </IconContainer>
          {active === "messages" && <Active />}
        </HeaderButton>
        <HeaderButton onClick={goToProfile}>
          <IconContainer>
            <LuUser2 size={22} />
          </IconContainer>
          {active === "profile" && <Active />}
        </HeaderButton>
        <HeaderButton onClick={goToSettings}>
          <IconContainer>
            <PiGearFine size={22} />
          </IconContainer>
          {active === "settings" && <Active />}
        </HeaderButton>
        <HeaderButton
          onClick={() => {
            handleClick();
          }}
        >
          {userFriendRequests.length > 0 && (
            <NotificationBadge>{userFriendRequests.length}</NotificationBadge>
          )}
          <IconContainer>
            <IoNotificationsOutline size={22} />
          </IconContainer>
        </HeaderButton>
      </MiddleContainer>
      <RightContainer>
        <LogoutContainer>
          <HeaderButton onClick={handleLogout}>
            <IconContainer>
              <IoLogOut size={22} />
            </IconContainer>
          </HeaderButton>
        </LogoutContainer>
        <MenuContainer>
          <HeaderButton
            onClick={() => {
              handleClick();
            }}
          >
            {userFriendRequests.length > 0 && (
              <NotificationBadge>{userFriendRequests.length}</NotificationBadge>
            )}
            <IconContainer>
              <IoNotificationsOutline size={22} />
            </IconContainer>
          </HeaderButton>
          <HeaderButton onClick={toggleMenu}>
            <IconContainer>
              <HiMenuAlt3 size={22} />
            </IconContainer>
          </HeaderButton>
        </MenuContainer>
      </RightContainer>
      <SweetAlert2 show={shown} onClose={handleClose} title="Notifications">
        <Popup />
      </SweetAlert2>
      <SweetAlert2
        show={searchShown}
        onClose={handleSearchClose}
        title="Search"
      >
        <SearchPopup />
      </SweetAlert2>
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <MenuRowOne>
              <GradientText>Clubs</GradientText>
              <HeaderButton onClick={toggleMenu}>
                <IconContainer>
                  <RxCross2 size={22} />
                </IconContainer>
              </HeaderButton>
            </MenuRowOne>
            <MenuRowTwo
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
            >
              {navLinks.map((link) => (
                <MenuItemWrapper>
                  <MenuItem
                    key={link.title}
                    title={link.title}
                    href={link.href}
                  />
                </MenuItemWrapper>
              ))}
            </MenuRowTwo>
          </MobileMenu>
        )}
      </AnimatePresence>
    </Container>
  );
}
const menuItemVars = {
  initial: {
    y: "30vh",
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    },
  },
  open: {
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0, 0.55, 0.45, 1],
    },
  },
};
const MenuItem = ({ title, href }) => {
  return (
    <MenuItemContainer variants={menuItemVars}>
      <Link to={href}>{title}</Link>
    </MenuItemContainer>
  );
};

const MenuItemWrapper = styled.div`
  overflow: hidden;
`;

const MenuItemContainer = styled(motion.div)`
  font-size: 48px;
  text-transform: uppercase;
  color: white;
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100dvh;
  background-color: rgba(22, 22, 22, 1);
  z-index: 100;
  padding: 5px 20px;
  display: flex;
  flex-direction: column;
  transform-origin: top;
`;

const MenuRowOne = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MenuRowTwo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100svh;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const LogoutContainer = styled.div`
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const MenuContainer = styled.div`
  display: none;
  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
`;
const PopupContainer = styled.div``;
const NoRequest = styled.span`
  font-size: 18px;
  color: white;
  font-weight: 800;
`;
const FriendRequestsContainer = styled.div`
  margin: 10px 0;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SearchBar = styled.input`
  padding: 8px 16px;
  margin: 8px 0;
  background: #272727;
  border-radius: 10px;
  outline: none;
  color: white;
  width: 200px;
  border: 1px solid transparent;
  &:focus {
    border: 1px solid #3e3f3f;
  }
  @media screen and (max-width: 1255px) {
    display: none;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
const SearchContainer = styled.div``;

const NotificationBadge = styled.div`
  position: absolute;
  top: 2px;
  right: 0px;
  background: linear-gradient(
    90deg,
    hsla(312, 66%, 76%, 1) 0%,
    hsla(234, 93%, 67%, 1) 100%
  );
  color: white;
  width: 15px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  border-radius: 50%;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;

  flex: 0.3;

  @media screen and (max-width: 1255px) {
    gap: 10px;
  }
`;
const MiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex: 0.3;
  transition: 0.2s;
  @media screen and (max-width: 1255px) {
    gap: 10px;
  }
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  flex: 0.3;
  justify-content: flex-end;
`;
const Title = styled.div`
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
  height: 60px;
`;

const GradientText = styled.span`
  background: linear-gradient(
    90deg,
    hsla(312, 66%, 76%, 1) 0%,
    hsla(234, 93%, 67%, 1) 100%
  );
  font-size: 32px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const Active = styled.div`
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: linear-gradient(
    90deg,
    hsla(312, 66%, 76%, 1) 0%,
    hsla(234, 93%, 67%, 1) 100%
  );
  border-radius: 50%;
`;

const IconContainer = styled.div``;

const HeaderButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  transition: 0.2s;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: relative;
  border: 1px solid transparent;
  color: gray;
`;

const SearchButton = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  transition: 0.2s;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: relative;
  border: 1px solid transparent;
  color: gray;

  @media screen and (max-width: 1255px) {
    display: flex;
  }
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
export default Header;
