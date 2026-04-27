import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function GoogleSuccess() {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {

      try {
        const parsedUser = JSON.parse(
          decodeURIComponent(user)
        );

        login({
          token,
          user: parsedUser
        });

        navigate("/");

      } catch (err) {
        console.error("Google login parsing error", err);
        navigate("/login");
      }
    }

  }, [location, login, navigate]);

  return <h2>Logging you in...</h2>;
}

export default GoogleSuccess;