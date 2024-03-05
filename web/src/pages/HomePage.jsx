import { useNavigate } from "react-router-dom";
import Sidenav from "../Sidenav";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post("/users/logout")
      .then((response) => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return <Sidenav handleLogout={handleLogout} />;
}
