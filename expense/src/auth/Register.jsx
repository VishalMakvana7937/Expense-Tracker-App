import React, { useState } from "react";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // You can set your primary color here
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "15px",
  marginTop: theme.spacing(6),
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Register = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userType === "Admin" && secretKey !== "AdarshT") {
      alert("Invalid Admin Secret Key");
    } else {
      fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          email,
          lname,
          password,
          userType,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            alert("Registration Successful");
          } else {
            alert("Something went wrong");
          }
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <StyledPaper elevation={6}>
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
            <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
              Register
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
              <FormLabel component="legend" sx={{ fontSize: "1.2rem" }}>
                Register As
              </FormLabel>
              <RadioGroup
                row
                aria-label="userType"
                name="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                sx={{ justifyContent: "center" }}
              >
                <FormControlLabel value="User" control={<Radio />} label="User" />
                <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </FormControl>

            {userType === "Admin" && (
              <TextField
                margin="normal"
                fullWidth
                id="secretKey"
                label="Secret Key"
                name="secretKey"
                autoComplete="secretKey"
                onChange={(e) => setSecretKey(e.target.value)}
                sx={{ mb: 3 }}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="fname"
              label="First Name"
              name="fname"
              autoComplete="given-name"
              onChange={(e) => setFname(e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="lname"
              label="Last Name"
              name="lname"
              autoComplete="family-name"
              onChange={(e) => setLname(e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </StyledButton>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography variant="body2">
                  Already registered?{" "}
                  <a href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
                    Login
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
