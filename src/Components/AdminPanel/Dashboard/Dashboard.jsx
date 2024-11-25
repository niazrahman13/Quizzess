/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [quizzes, setQuizzes] = useState([]);
    const [userName, setUser] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        fetch("http://localhost:5000/api/admin/quizzes", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch quizzes");
                }
                return response.json();
            })
            .then((data) => {

                setQuizzes(data);
            })
            .catch((error) => {
                console.error("Error fetching quizzes:", error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("fullName");
        if (token && storedUser) {
            setIsLoggedIn(true);
            setUser(storedUser);
        } else {
            setIsLoggedIn(false);
            navigate("/login");
        }
    }, [navigate]);

    // Function to delete a quiz
    const handleDeleteQuiz = (quizId) => {
        const token = localStorage.getItem("accessToken");
        fetch(`http://localhost:5000/api/admin/quizzes/${quizId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete quiz");
                }
                // Remove the deleted quiz from state
                setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId));
            })
            .catch((error) => {
                console.error("Error deleting quiz:", error);
            });
    };

    // Function to handle edit navigation
    const handleEditQuiz = (quizId) => {
        navigate(`/editQuiz/${quizId}`); // Navigate to the edit page with quiz ID
    };

    return (
        <div className="bg-gray-100 min-h-screen flex">
            <aside className="w-80 bg-primary p-12 flex flex-col">
                <div className="mb-10">
                    <img src="public/assets/logo-white.svg" className="h-7" alt="Logo" />
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-4 rounded-lg bg-white text-primary font-bold"
                            >
                                Quizzes
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary"
                            >
                                Settings
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary"
                            >
                                Manage Users
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary"
                            >
                                Manage Roles
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover :primary"
                            >
                                Logout
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto flex items-center">
                    <img
                        src="public/assets/avater.webp"
                        alt="Avatar"
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <span className="text-white font-semibold">{userName}</span>
                </div>
            </aside>

            <main className="flex-grow p-10">
                <header className="mb-8">
                    <h2 className="text-2xl font-semibold">Hey There 👋!</h2>
                    <h1 className="text-4xl font-bold">Welcome Back To Your Quiz Hub!</h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {quizzes.length > 0 ? (
                        quizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 group cursor-pointer text-center"
                            >
                                <div className="mb-4">
                                    <img
                                        src={quiz.thumbnail}
                                        alt={quiz.title}
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    {quiz.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {quiz.description}
                                </p>
                                <div className="flex space-x-4 mt-4">

                                    <button
                                        onClick={() => handleDeleteQuiz(quiz.id)}
                                        className="bg-red-500 text-black py-2 px-4 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-full text-center">
                            <p className="text-lg font-semibold">
                                No quiz created yet
                            </p>
                            <p className="text-gray-600 text-sm">
                                Looks like you haven't created any quizzes. Click
                                below to start creating one!
                            </p>
                        </div>
                    )}

                    <div
                        onClick={() => navigate("/makeQuizes")} // Correct navigation
                        className="group cursor-pointer"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="text-buzzr-purple mb-4 group-hover:scale-105 transition-all">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg mb-2 group-hover:scale-105 transition-all">
                                Create a new quiz
                            </h3>
                            <p className="text-gray-600 text-sm group-hover:scale-105 transition-all">
                                Build from the ground up
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}