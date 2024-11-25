import { useEffect, useState } from "react";

export default function Welcome() {
    const [userName, setUserName] = useState(""); // State to store the username
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const storedUserName = localStorage.getItem("fullName");
        if (token && storedUserName) {
            setIsLoggedIn(true);
            setUserName(storedUserName);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <div className="text-center mb-12">
            <img
                src="/public/assets/avater.webp"
                alt="Profile Picture"
                className="w-32 h-32 rounded-full border-4 border-primary mx-auto mb-4 object-cover"
            />
            <p className="text-xl text-gray-600">Welcome</p>

            <h2 className="text-4xl font-bold text-gray-700 font-family: Jaro">
                {isLoggedIn ? userName : "Guest"}
            </h2>
        </div>
    );
}
