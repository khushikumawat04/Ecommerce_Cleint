import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function GoogleSuccess() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      const user = JSON.parse(atob(token.split(".")[1]));

      login({ token, user });
      navigate("/");
    }
  }, []);

  return <h2>Logging you in...</h2>;
}

export default GoogleSuccess;