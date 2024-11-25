import { useEffect, useState } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Components/Authentication/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import CardsData from "./Components/QuizCards/CardsData";
import Welcome from "./Components/Welcome/Welcome";
import RoutesComponent from "./Router/Routes";

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("accessToken"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  // Pages where CardsData should NOT be displayed
  const isOnRestrictedPage = ["/login", "/register", "/result", "/leaderboard"].some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("role");

    if (token && userRole) {
      setIsLoggedIn(true);
      setRole(userRole);

      if (userRole === "admin" && location.pathname === "/") {
        navigate("/makeQuizes");
      }
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  const handleLogin = (token, userRole) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", userRole);
    setIsLoggedIn(true);
    setRole(userRole);
    if (userRole === "admin") {
      navigate("/makeQuizes");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto py-3">
      <header className="flex justify-between items-center mb-12">
        <img
          src="public/assets/logo.svg"
          className="h-7 cursor-pointer"
          onClick={() => {
            if (role === "admin") {
              navigate("/adminDashboard");
            } else {
              navigate("/");
            }
          }}
          alt="Logo"
        />
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} onLogin={handleLogin} />
      </header>

      {/* Render Welcome and CardsData only if NOT on restricted pages */}
      {!isOnRestrictedPage && (
        <>
          {isLoggedIn && <Welcome />}
          {role !== "admin" && <CardsData />}
        </>
      )}

      {/* Render Routes */}
      <RoutesComponent />

      <Footer />
    </div>
  );
}



export default App;
