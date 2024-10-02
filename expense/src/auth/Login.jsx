import React, { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Container, Typography, Box, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:5000/login", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          alert("Login successful");
          // Access the token directly from the correct property
          window.localStorage.setItem("token", data.token); // Changed from data.data to data.token
          window.localStorage.setItem("userType", data.userType);
          window.localStorage.setItem("loggedIn", true);

          if (data.userType === "Admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/userDetails");
          }
        } else {
          // Handle other statuses if needed
          alert(data.error); // Display error message
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("An error occurred during login. Please try again.");
      });
}


  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ p: 4, borderRadius: 2, mt: 8 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
            Sign In
          </Typography>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, backgroundColor: "#1976d2", fontSize: "1rem", padding: "10px 0" }}
          >
            Sign In
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2">
                <a href="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                  Don't have an account? Sign Up
                </a>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
