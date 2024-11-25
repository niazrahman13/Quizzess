import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUser] = useState({});
    const [quizData, setQuizData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Check login status

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        // Fetch quiz questions from API
        fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Authorization header
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Please login to access this resource");
                }
                return response.json();
            })
            .then((data) => {
                setQuizData(data);
                const shuffledQuestions = data.data.questions.map((question) => ({
                    ...question,
                    options: shuffleArray(question.options),
                }));
                setQuestions(shuffledQuestions);
            })
            .catch((error) => {
                console.error("Error fetching quiz data:", error);
                setIsLoggedIn(false);
            });
    }, [quizId]);

    // Shuffle options for random rotation
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleAnswerSelect = (answer) => {
        setUser((prevAnswers) => ({
            ...prevAnswers,
            [questions[currentQuestionIndex].id]: answer, // Save answer for the current question using question ID
        }));
    };

    const handleNextQuestion = () => {
        // Check if an answer is selected for the current question
        if (!userAnswers[questions[currentQuestionIndex].id]) {
            alert("Please select an answer before proceeding.");
            return; // Exit the function if no answer is selected
        }

        // Proceed to the next question or submit the quiz
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            handleSubmitQuiz();
        }
    };

    const handleSubmitQuiz = () => {
        const token = localStorage.getItem("accessToken");
        const payload = { answers: userAnswers };

        fetch(`http://localhost:5000/api/quizzes/${quizId}/attempt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                console.log(response);  // Log the response status code
                if (!response.ok) {
                    throw new Error("Error submitting quiz");
                }
                return response.json();
            })
            .then((result) => {
                console.log("Submission Result:", result);
                if (result && result.attempt_id) {
                    navigate(`/result/${result.attempt_id}`);
                } else {
                    console.error("Invalid response format", result);
                }
            })
            .catch((error) => {
                console.error("Error submitting quiz:", error);
                if (error.response) {
                    console.error("Response data:", error.response.data);
                }
                alert("Something went wrong. Please try again.");
            });
    };

    if (!isLoggedIn) {
        return (
            <div className="bg-[#F5F3FF] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Please Login to Access This Page</h1>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-800"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!quizData) return <div>Loading...</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="bg-[#F5F3FF] min-h-screen">
            <div className="container mx-auto py-3">
                <header className="flex justify-between items-center mb-8">
                    <img src="./assets/logo.svg" className="h-7" alt="Logo" />
                    <button
                        className="px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors"
                        onClick={() => navigate("/logout")}
                    >
                        Logout
                    </button>
                </header>

                <main className="max-w-8xl mx-auto h-[calc(100vh-10rem)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-full">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 bg-white rounded-md p-6 h-full flex flex-col">
                            <div>
                                <h2 className="text-4xl font-bold mb-4">{quizData.title}</h2>
                                <p className="text-gray-600 mb-4">{quizData.description}</p>

                                <div className="flex flex-col">
                                    <div className="w-fit bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                                        Total number of questions: {questions.length}
                                    </div>
                                    <div className="w-fit bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                                        Answered: {Object.keys(userAnswers).length}
                                    </div>
                                    <div className="w-fit bg-gray-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                                        Remaining: {questions.length - Object.keys(userAnswers).length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Quiz Section */}
                        <div className="lg:col-span-2 bg-white">
                            <div className="bg-white p-6 rounded-md">
                                <h3 className="text-2xl font-semibold mb-4">
                                    {currentQuestionIndex + 1}. {currentQuestion.question}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {currentQuestion.options.map((option, index) => (
                                        <label
                                            key={index}
                                            className="flex items-center space-x-3 py-3 px-4 bg-primary/5 rounded-md text-lg"
                                        >
                                            <input
                                                type="radio"
                                                name="answer"
                                                className="form-radio"
                                                onChange={() => handleAnswerSelect(option)}
                                                checked={userAnswers[currentQuestion.id] === option}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                                <button
                                    onClick={handleNextQuestion}
                                    className="w-1/2 text-center ml-auto block bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-800 my-6"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}