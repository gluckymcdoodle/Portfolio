import { Container } from "@mui/material";
import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SingUpInterface() {
  // attributes
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const errors = [
    "Invalid Password: Must be at least 8 characters long, contain 1 uppercase letter, and 1 number",
    "Invalid Email: Must follow the format xxx@yyy.com",
    "Invalid Username: Username cannot be empty",
  ];

  const navigate = useNavigate();

  // error helpers
  const [signUpError, setSignUpError] = useState(false);
  const [signUpErrorText, setSignUpErrorText] = useState("");
  const displayError = () => {
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // format for emails
    const passwordReg = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // 8+ characters, 1 uppercase letter, 1 number

    if (!passwordReg.test(password)) {
      // password fails criteria
      setSignUpError(true);
      setSignUpErrorText(errors[0]);
      return false;
    }
    if (!emailReg.test(email)) {
      // email fails format
      setSignUpError(true);
      setSignUpErrorText(errors[1]);
      return false;
    }
    if (!username.trim()) {
      // username is empty
      setSignUpError(true);
      setSignUpErrorText(errors[2]);
      return false;
    }
    setSignUpError(true);
    setSignUpError("");
    return true;
  };

  const signUpUser = async (event) => {
    event.preventDefault();
    if (!displayError()) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/user/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/login");
      }
    } catch (error) {
      console.error("", error);
    }
  };

  return (
    <>
      <Container className="flex flex-col justify-center items-center h-[80vh]">
        <form onSubmit={signUpUser} className="space-y-4">
          <h1 className="text-3xl font-bold" style={{ marginBottom: "25px" }}>
            Sign Up
          </h1>

          <div className="input-box">
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              error={signUpError}
              sx={{ width: "300px" }}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box space-y-4">
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              error={signUpError}
              sx={{ width: "300px" }}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="input-box">
              <TextField
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                error={signUpError}
                helperText={signUpErrorText}
                sx={{ width: "300px" }}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              style={{ marginTop: "50px" }}
            >
              Sign up
            </Button>

            <Link to="/login">
              <Button variant="outlined" className="border-2 px-6 py-3 mt-3" style={{ marginTop: "50px", marginLeft: "100px" }}>
                Login
              </Button>
            </Link>
          </div>
        </form>


      </Container>
    </>
  );
}
