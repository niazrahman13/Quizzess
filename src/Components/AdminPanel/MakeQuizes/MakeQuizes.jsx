import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation (if using React Router)

export default function MakeQuizes() {

    const [quizTitle, setQuizTitle] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Function to refresh access token
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            console.log("No refresh token found. Please log in again.");
            return null;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/refresh-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("accessToken", data.accessToken);
                return data.accessToken;
            } else {
                console.error("Failed to refresh token:", data.message);
                return null;
            }
        } catch (error) {
            console.error("Error refreshing token:", error.message);
            return null;
        }
    };

    // Wrapper function to handle API calls with token refresh
    const apiCall = async (url, options = {}) => {
        let accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                throw new Error("Session expired. Please log in again.");
            }
        }

        const response = await fetch(url, {
            ...options,
            headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 401) {
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                throw new Error("Session expired. Please log in again.");
            }

            return fetch(url, {
                ...options,
                headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
            });
        }

        return response;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        if (!quizTitle) {
            alert("Please provide a title for the quiz.");
            return;
        }

        setIsLoading(true); // Set loading to true
        setError(null); // Reset error

        // Prepare API request payload
        const payload = {
            title: quizTitle,
            description: quizDescription,
        };

        try {
            let accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                accessToken = await refreshAccessToken();
                if (!accessToken) {
                    alert("Session expired. Please log in again.");
                    return;
                }
            }

            const response = await apiCall("http://localhost:5000/api/admin/quizzes/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create quiz set.");
            }
            if (response.ok) {

                localStorage.setItem("_id", data.data.id);
                localStorage.setItem("status", data.data.status);
                localStorage.setItem("title", data.data.title);
                localStorage.setItem("description", data.data.description);


            }
            // Navigate to the next page with data
            navigate("/setQuizes", {
                state: { title: quizTitle, description: quizDescription, id: data.data.id },
            });
        } catch (err) {
            console.error("Error:", err.message);
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false); // Set loading to false
        }
    };

    return (
        <div className="bg-[#ebebed] min-h-screen flex">
            <aside className="hidden md:w-64 bg-primary p-6 md:flex flex-col">
                <div className="mb-10">
                    <img src="public/assets/logo-white.svg" className="h-7" alt="Logo" />
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="block py-2 px-4 rounded-lg bg-buzzr-purple bg-white text-primary font-bold">
                                Quizzes
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary">
                                Settings
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary">
                                Manage Users
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary">
                                Manage Roles
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary">
                                Logout
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto flex items-center">
                    <img
                        src="../assets/avater.webp"
                        alt="Mr Hasan"
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <span className="text-white font-semibold">Saad Hasan</span>
                </div>
            </aside>

            <main className="md:flex-grow px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <Link
                            to={"/adminDashboard"}
                            className="inline-flex items-center text-sm text-gray-600 mb-6 hover:text-buzzr-purple"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                ></path>
                            </svg>
                            Back to home
                        </Link>

                        <h2 className="text-3xl font-bold mb-6">Give your quiz title and description</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="quiz-title"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Quiz title
                                </label>
                                <input
                                    type="text"
                                    id="quiz-title"
                                    name="quiz-title"
                                    value={quizTitle}
                                    onChange={(e) => setQuizTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-buzzr-purple focus:border-buzzr-purple"
                                    placeholder="Quiz"
                                />
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="quiz-description"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="quiz-description"
                                    name="quiz-description"
                                    rows="4"
                                    value={quizDescription}
                                    onChange={(e) => setQuizDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-buzzr-purple focus:border-buzzr-purple"
                                    placeholder="Description"
                                ></textarea>
                            </div>

                            {error && <p className="text-red-500 mb-4">{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full block text-center ${isLoading ? "bg-gray-400" : "bg-primary"
                                    } text-white py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                            >
                                {isLoading ? "Creating..." : "Next"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
