import { ThemeProvider } from "@emotion/react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from "axios";
import theme from "./theme";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import RegsiterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";

function App() {

  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true; // for cors cookies

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.post("/users/refresh");
          
          const token = response.headers["authorization"];

          localStorage.setItem("token", token);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (error) {
          // Handle refresh token error or redirect to login
        }
      }

      return Promise.reject(error);
    }
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegsiterPage/>} />
          <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<HomePage/>} />
          </Route>
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
