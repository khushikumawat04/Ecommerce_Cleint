import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../componenets/Navbar";
import Footer from "../componenets/Footer";
import Loading from "../componenets/Loading";

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

      window.location.href = "/";

      } catch (err) {
        console.error("Google login parsing error", err);
        navigate("/login");
      }
    }

  }, [location, login, navigate]);
return(
     <div className="main-bg">
      <Navbar />

      <Loading text="Logging you in with Google..." />

      <Footer />
    </div>
)
}

export default GoogleSuccess;