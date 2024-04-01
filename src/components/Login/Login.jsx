import styled from "styled-components";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import background from "../../assets/background.png";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Both the email and the password must be supplied!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("uid", user.uid);
        navigate("/");
      } catch (error) {
        Swal.fire({
          title: "Something went wrong!",
          text: "The email or password is incorrect!",
          icon: "error",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };

  return (
    <Container>
      <Title>
        Log in to <GradientText>Clubs</GradientText>
      </Title>
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          id="email"
          className="formInput"
          autoComplete="on"
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          id="password"
          className="formInput"
          autoComplete="on"
        />
        <Button type="submit">Login</Button>
      </LoginForm>
      <Paragraph>
        Don't have an account? <CustomLink to="/signup">Sign up</CustomLink>
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
  font-size: 32px;
  color: white;
  margin: 0.5em 0;
`;

const LoginForm = styled.form`
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

export default Login;
