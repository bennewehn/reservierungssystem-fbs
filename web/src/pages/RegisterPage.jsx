import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import axios from "axios";
import { Alert, AlertTitle, Button, Modal } from "@mui/material";

export default function RegsiterPage() {
  const [registerLoading, setRegisterLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const body = {
      data: {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        password: data.get("password"),
      },
    };

    setRegisterLoading(true);

    axios
      .post("/users/", body)
      .then((response) => {
        setErrors([]);
        setRegisterLoading(false);
        setOpen(true);
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
        if (error.response.status === 409) {
          setErrors([{ path: "data.email", msg: "Benutzer existiert bereits." }]);
        }
        console.error("Error:", error);
        console.log(errors);
        setRegisterLoading(false);
      });
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
          Registrieren
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                error={!!errors.find((e) => e.path === "data.firstName")}
                helperText={
                  errors.find((e) => e.path === "data.firstName")?.msg
                }
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Vorname"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={!!errors.find((e) => e.path === "data.lastName")}
                helperText={errors.find((e) => e.path === "data.lastName")?.msg}
                required
                fullWidth
                id="lastName"
                label="Nachname"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!!errors.find((e) => e.path === "data.email")}
                helperText={errors.find((e) => e.path === "data.email")?.msg}
                required
                fullWidth
                id="email"
                label="Email Adresse"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!!errors.find((e) => e.path === "data.password")}
                helperText={errors.find((e) => e.path === "data.password")?.msg}
                required
                fullWidth
                name="password"
                label="Passwort"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <LoadingButton
            loading={registerLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrieren
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ fontSize: 14 }}>
                Schon einen Account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          <p>User successfully created. You can log in now.</p>
          <div>
            <Button variant="outlined" onClick={handleLogin}>Login</Button>
          </div>
        </Alert>
      </Modal>
    </Container>
  );
}
