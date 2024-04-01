import styled from "styled-components";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import {
  validateDisplayName,
  validateEmail,
  validateUsername,
} from "../../helpers/misc";
import {
  checkIfEmailExists,
  checkIfUsernameExists,
  createUser,
} from "../../services/authService";
import Swal from "sweetalert2";
import background from "../../assets/background.png";

function Register() {
  const [step, setStep] = useState(1);
  const [buttonText, setButtonText] = useState("Next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (!email.trim() || !password.trim()) {
        Swal.fire.fire({
          title: "Something went wrong!",
          text: "Both the email and the password must be suplied!",
          icon: "error",
          showConfirmButton: false,
          timer: 5000,
        });
      } else {
        if (validateEmail(email)) {
          await checkIfEmailExists(email).then((exists) => {
            if (exists) {
              Swal.fire({
                title: "Something went wrong!",
                text: "This email is already registered!",
                icon: "error",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              setStep(2);
              setButtonText("Sign Up");
            }
          });
        } else {
          Swal.fire({
            title: "Something went wrong!",
            text: "You should only use your university email to register!",
            icon: "error",
            showConfirmButton: false,
            timer: 3000,
          });
          return;
        }
      }
    } else if (step === 2) {
      if (!username.trim() || !fullName.trim()) {
        Swal.fire({
          title: "Something went wrong!",
          text: "Both the username and the full name must be supplied!",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        checkIfUsernameExists(username).then(async (exists) => {
          if (
            exists ||
            !validateUsername(username) ||
            !validateDisplayName(fullName)
          ) {
            Swal.fire({
              title: "Something went wrong!",
              text: "This username is already taken or contains restricted words!",
              icon: "error",
              showConfirmButton: false,
              timer: 3000,
            });
          } else {
            setButtonText("Loading...");
            try {
              await createUserWithEmailAndPassword(auth, email, password).then(
                async (userCredential) => {
                  const user = userCredential.user;
                  localStorage.setItem("token", user.accessToken);
                  localStorage.setItem("uid", user.uid);
                  await createUser(
                    username,
                    auth?.currentUser?.uid,
                    fullName,
                    email
                  );
                  sendEmailVerification(auth.currentUser).then(() => {
                    Swal.fire({
                      title: "Welcome!",
                      text: "Welcome to our family of Lions! Email with verification link was sent to your email address!",
                      icon: "info",
                      showConfirmButton: false,
                      timer: 3000,
                    }).then(() => {
                      navigate("/");
                    });
                  });
                }
              );
            } catch (error) {
              console.error(`(Register) [ERROR] ${error}`);
            }
          }
        });
      }
    } else {
      Swal.fire({
        title: "Something went wrong!",
        text: "You should only use your university email to register!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <Container>
      <Title>
        Sign Up to <GradientText>Clubs</GradientText>
      </Title>
      <SignUpForm onSubmit={handleSubmit}>
        {step === 1 ? (
          <>
            <Input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              value={email}
              className="formInput"
              autoComplete="on"
            />
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              id="password"
              value={password}
              className="formInput"
              autoComplete="on"
            />
          </>
        ) : step === 2 ? (
          <>
            <Input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              name="fullName"
              id="fullName"
              value={fullName}
              className="formInput"
            />
            <Input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              id="username"
              value={username}
              className="formInput"
            />
          </>
        ) : null}

        <Button type="submit">{buttonText}</Button>
      </SignUpForm>
      {step === 2 && (
        <Paragraph
          onClick={() => {
            setStep(1);
            setButtonText("Next");
          }}
        >
          Back
        </Paragraph>
      )}
      <Paragraph>
        Already have an account? <CustomLink to="/login">Log in</CustomLink>
      </Paragraph>
    </Container>
  );
}

const GradientText = styled.span`
  /* background: linear-gradient(
    90deg,
    hsla(53, 84%, 74%, 1) 0%,
    hsla(336, 87%, 61%, 1) 50%,
    hsla(262, 81%, 71%, 1) 100%
  ); */
  background: linear-gradient(
    90deg,
    hsla(312, 66%, 76%, 1) 0%,
    hsla(234, 93%, 67%, 1) 100%
  );

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font-weight: 600;
`;

const CustomLink = styled(Link)`
  text-decoration: underline;
`;

const Paragraph = styled.p`
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  background-image: url(${background});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  /* background-color: #101010;
  opacity: 0.8;
  background-image: linear-gradient(#3e3f3f 1px, transparent 1px),
    linear-gradient(to right, #3e3f3f 1px, #101010 1px);
  background-size: 20px 20px; */
`;

const Title = styled.h1`
  font-size: 1.9em;
  color: white;
  margin: 0.5em 0;
`;

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 8px 16px;
  margin: 8px 0;
  background: #1e1e1e;
  border-radius: 10px;
  outline: none;
  color: white;
  width: 350px;
  height: 55px;
  border: 1.5px solid transparent;
  &:focus {
    border: 1.5px solid #3e3f3f;
  }
`;

const Button = styled.button`
  background-color: white;
  color: black;
  font-size: 1.2em;
  margin: 8px 0;
  padding: 8px 16px;
  border-radius: 10px;
  width: 350px;
  height: 55px;
  opacity: 0.9;
  transition: 0.2s;
  &:hover {
    background-color: #acacac;
    color: white;
  }
`;

export default Register;
