import { ThemeProvider } from "@emotion/react";
import "./App.css";
import AuthProvider from "./provider/AuthProvider";
import Routes from "./routes";
import axios from "axios";
import theme from "./theme";

function App() {
  axios.defaults.baseURL = 'http://localhost:3001';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.withCredentials = true; // for cors cookies

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
