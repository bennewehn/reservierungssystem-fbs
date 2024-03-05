import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";
import { useLogin } from "../context/LoginContext";

export default function LoginPage() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { rememberLogin, setRememberLogin } = useLogin();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const body = {
      data: {
        email: data.get("email"),
        password: data.get("password"),
      },
    };

    setLoginLoading(true);

    axios
      .post("/users/login", body)
      .then((response) => {
        setErrors([]);
        setLoginLoading(false);
        const token = response.headers["authorization"];
        localStorage.setItem("token", token);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          setErrors(error.response.data.errors);
        } else {
          setErrors([]);
        }
        console.error("Error:", error);
        setLoginLoading(false);
      });
  };

  const handleRememberLoginChange = (event) => {
    setRememberLogin(event.target.checked);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            error={!!errors.find((e) => e.path === "data.email")}
            helperText={errors.find((e) => e.path === "data.email")?.msg}
            required
            fullWidth
            id="email"
            label="Email Adresse"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            error={!!errors.find((e) => e.path === "data.password")}
            helperText={errors.find((e) => e.path === "data.password")?.msg}
            name="password"
            label="Passwort"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox checked={rememberLogin} onChange={handleRememberLoginChange} value="remember" color="primary" />}
            label="Erinnere mich"
          />
          <LoadingButton
            loading={loginLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </LoadingButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "end",
            }}
          >
            <Link to="/register" style={{ fontSize: 14 }}>
              {"Noch kein Account? Registrieren"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
