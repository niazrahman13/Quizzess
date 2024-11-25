/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();

    const handleLoginClick = () => navigate("/login");
    const handleRegisterClick = () => navigate("/register");

    return (
        <div>

            {!isLoggedIn ? (
                <>
                    <button
                        className="px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors font-family: Jaro"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>

                    <button
                        className="px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors font-family: Jaro"
                        onClick={handleRegisterClick}
                    >
                        Register
                    </button>
                </>
            ) : (

                <button
                    className="px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors font-family: Jaro"
                    onClick={onLogout}
                >
                    Logout
                </button>
            )}
        </div>
    );
}
