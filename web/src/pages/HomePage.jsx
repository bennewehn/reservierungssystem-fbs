import Sidenav from "../Sidenav";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";

export default function HomePage() {
  const { setToken } = useAuth();

  const handleLogout = () => {
    axios
      .post("/users/logout")
      .then((response) => {
        console.log(response)
        setToken("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return <Sidenav handleLogout={handleLogout} />;
}
