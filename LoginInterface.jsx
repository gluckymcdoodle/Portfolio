import { Box, Container } from "@mui/material";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { alignProperty } from "@mui/material/styles/cssUtils";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginInterface() {
  // attributes
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const errors = ["Invalid username or password"];

  const navigate = useNavigate();

  // error helpers

  const [loginError, setLoginError] = useState(false);
  const [loginErrorText, setLoginErrorText] = useState("");
  const displayError = () => {
    // Login error validation
    setLoginError(true);
    setLoginErrorText(errors[0]);
  };

  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST", // Use POST for sending credentials
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Successful login
        const data = await response.json();
        if (data.user == null) displayError();
        else {
          // store user data in local storage to allow access to other services
          localStorage.setItem("username", data.user.username);
          localStorage.setItem("email", data.user.email);
          localStorage.setItem("password", data.user.password);
          localStorage.setItem("biography", data.user.biography);
          localStorage.setItem("picture", data.user.picture);
          localStorage.setItem("mimetype", data.user.mimetype);
          localStorage.setItem(
            "following",
            JSON.stringify(data.user.following)
          );
          localStorage.setItem(
            "followers",
            JSON.stringify(data.user.followers)
          );
          navigate("/"); // redirect to main feed interface
        }
      }
    } catch (err) {
      console.error("", err);
    }
  };

  return (
    <>
      <Container className="flex flex-col justify-center items-center h-[80vh]">
        <Box>
          <h1 className="text-3xl font-bold" style={{ marginBottom: "25px" }}>
            Login
          </h1>
          <div className="input-box space-y-4">
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              error={loginError}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="input-box">
              <TextField
                id="password"
                label="Password"
                error={loginError}
                helperText={loginErrorText}
                variant="outlined"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              style={{ marginTop: "50px" }}
              onClick={() => loginUser(username, password)}
            >
              Login
            </Button>
            <Link to="/sign-up">
              <Button variant="outlined" className="border-2 px-6 py-3 mt-3" style={{ marginTop: "50px", marginLeft: "40px" }}>
                Sign up
              </Button>
            </Link>
          </div>
        </Box>
      </Container>
    </>
  );
}
