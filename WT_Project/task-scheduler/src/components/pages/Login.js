import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import {
  auth,
  provider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "./firebase";
import { Google } from "@mui/icons-material";
import { ArrowBack } from "@mui/icons-material";
const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  // Effect to handle page change and fade-in effect
  useEffect(() => {
    setVisible(false); // Set visible to false before fade-out
    const timer = setTimeout(() => {
      setVisible(true); // Fade in after a short delay
    }, 100); // Adjust the delay as needed

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []); // Run this effect when currentPage changes
  const handleLogin = async () => {
    if (!email || !password) {
      setError(" ");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // console.log('User logged in:', user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", true);
      setCurrentPage("Dashboard"); // Redirect to dashboard after login
    } catch (error) {
      setError("Invalid Credentials");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // console.log('Google Login:', user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", true);
      setCurrentPage("Dashboard"); // Redirect to dashboard after Google login
    } catch (error) {
      setError("Invalid Credentials");
    }
  };

  return (
    <div id={`sheet ${visible ? "visible" : ""}`}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: "100%",
            backgroundColor: "var(--primary)",
          }}
        >
          <CardContent>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setCurrentPage("Landing")}
              sx={{ mb: 2, color: "var(--secondary)" }}
            ></Button>
            <Typography
              variant="h4"
              align="center"
              fontFamily="Oxanium"
              color="var(--text-color)"
              gutterBottom
            >
              Welcome Back
            </Typography>

            <TextField
              fullWidth
              type="email"
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error message on input change
              }}
              required
              error={!email && Boolean(error)} // Show error state if empty and error exists
              helperText={
                !email && Boolean(error) ? "Please fill this field." : ""
              }
              sx={{ 
                "& .MuiInputLabel-root": {
                  color: "var(--text-color)", // Default label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "var(--link-color)", // Label color when focused
                },
                "& .MuiInputLabel-root:hover": {
                  color: "var(--link-color)", // Label color when hovered
                }, // Label color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--text-color)", // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--link-color)", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--link-color)", // Border color when focused
                  },
                  "& input": { color: "var(--text-color)" }, // Text inside the box
                },
                "& .MuiFormHelperText-root": { color: "white" }, // Helper text color
              }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(""); // Clear error message on input change
              }}
              required
              error={!password && Boolean(error)} // Show error state if empty and error exists
              helperText={
                !password && Boolean(error) ? "Please fill this field." : ""
              }
              sx={{
                "& .MuiInputLabel-root": {
                  color: "var(--text-color)", // Default label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "var(--link-color)", // Label color when focused
                },
                "& .MuiInputLabel-root:hover": {
                  color: "var(--link-color)", // Label color when hovered
                }, // Label color
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "var(--text-color)", // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--link-color)", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--link-color)", // Border color when focused
                  },
                  "& input": { color: "var(--text-color)" }, // Text inside the box
                },
                "& .MuiFormHelperText-root": { color: "white" }, // Helper text color
              }}
            />

            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogin}
              sx={{
                mt: 2,
                backgroundColor: "var(--secondary)",
                color: "var(--text-color)",
              }}
            >
              Log In
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              sx={{
                mt: 2,
                backgroundColor: "var(--secondary)",
                color: "var(--text-color)",
              }}
            >
              Log In with Google
            </Button>

            <Button
              fullWidth
              color="primary"
              onClick={() => setCurrentPage("Signup")}
              sx={{ mt: 2, color: "var(--link-color)" }}
            >
              Don't have an account? Sign Up
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};

export default Login;
