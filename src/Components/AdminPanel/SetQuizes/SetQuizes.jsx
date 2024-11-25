import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function SetQuizes() {
    const [userName, setUser] = useState("");
    const [_id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [quiz, SetQuiz] = useState([]);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editingQuestionText, setEditingQuestionText] = useState("");
    const [quizPublished, setQuizPublished] = useState(false);
    const [quizTitle, setQuizTitle] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const id = localStorage.getItem("_id");
        const storedUser = localStorage.getItem("fullName");
        const storedtitle = localStorage.getItem("title");
        const storedDescription = localStorage.getItem("description");

        if (token) {
            setIsLoggedIn(true);
            setUser(storedUser);
            setDescription(storedDescription);
            setTitle(storedtitle);
            setId(id);
        } else {
            setIsLoggedIn(false);
            navigate("/login");
        }
    }, [navigate]);

    const handleQuizTitleChange = (e) => {
        setQuizTitle(e.target.value);
    };

    const handleOptionChange = (index, text) => {
        const updatedOptions = options.map((option, idx) => ({
            text: idx === index ? text : option.text,
            isCorrect: idx === index
        }));
        setOptions(updatedOptions);
    };

    const togglePublishStatus = async () => {
        try {

            const newStatus = quizPublished ? "unpublished" : "published";

            const response = await fetch(`http://localhost:5000/api/admin/quizzes/${_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ status: newStatus }), // Backend expects "status"
            });

            if (response.ok) {
                const result = await response.json();


                setQuizPublished(result.status === "published");

                // Notify the user of the successful operation
                alert(`Quiz set to ${result.status} successfully!`);
            } else {
                const errorData = await response.json();
                alert(`Failed to update quiz publish status: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error updating quiz publish status:", error);
            alert("An error occurred while updating the publish status.");
        }
    };


    const handleSaveQuiz = async () => {
        if (!quizTitle || options.some(option => !option.text)) {
            alert("Please fill in all fields.");
            return;
        }

        const correctAnswer = options.find(option => option.isCorrect)?.text;

        if (!correctAnswer) {
            alert("Please mark one option as the correct answer.");
            return;
        }

        const quizData = {
            question: quizTitle,
            options: options.map(option => option.text),
            correctAnswer: correctAnswer,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/admin/quizzes/${_id}/questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(quizData),
            });

            if (!response.ok) {
                throw new Error("Failed to save the quiz.");
            }

            const result = await response.json();
            SetQuiz((prevQuiz) => [...prevQuiz, result.data]);

            alert("Quiz saved successfully!");

            setQuizTitle("");
            setOptions([
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ]);
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("Error saving quiz. Please try again.");
        }
    };

    const handleDelete = async (questionId) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/questions/${questionId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            alert('Question deleted successfully');
            SetQuiz((prevQuiz) => prevQuiz.filter((q) => q.id !== questionId));
        } catch (error) {
            console.error('Error deleting question:', error.response?.data || error.message);
            alert('Failed to delete question');
        }
    };

    const handleEditQuestion = async (questionId) => {
        if (!editingQuestionText) {
            alert("Please enter a question text.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/admin/questions/${questionId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ question: editingQuestionText }),
            });

            if (!response.ok) {
                throw new Error("Failed to update the question.");
            }

            const result = await response.json();
            SetQuiz((prevQuiz) =>
                prevQuiz.map((q) => (q.id === questionId ? { ...q, question: result.data.question } : q))
            );
            alert("Question updated successfully!");
            setEditingQuestionId(null);
            setEditingQuestionText("");
        } catch (error) {
            console.error("Error updating question:", error);
            alert("Error updating question. Please try again.");
        }
    };

    return (
        <div className="bg-[#ebebed] min-h-screen flex">
            <aside className="hidden md:w-64 bg-primary p-6 md:flex flex-col">
                <div className="mb-10">
                    <img src="public/assets/logo-white.svg" className="h-7" />
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="block py-2 px-4 rounded-lg bg-buzzr-purple bg-white text-primary font-bold">Quizzes</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary">Settings</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-4 rounded-lg text-gray-100 hover:bg-gray-100 hover:text-primary">Logout</a>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto flex items-center">
                    <img src="public/assets/avater.webp" alt="Mr Hasan" className="w-10 h-10 rounded-full mr-3 object-cover" />
                    <span className="text-white font-semibold">{userName}</span>
                </div>
            </aside>

            <main className="md:flex-grow px-4 sm:px-6 lg:px-8 py-8">
                <div>
                    <nav className="text-sm mb-4" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">
                                <Link to="/adminDashboard" clLinkstoe="text-gray-600 hover:text-buzzr-purple">Home</Link>
                                <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22 ```javascript
                                    .667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                                </svg>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-buzzr-purple" aria-current="page">Quizzes</a>
                            </li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-8 lg:gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">{title}</h2>
                            <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block mb-4">
                                Total number of questions: {quiz.length}
                            </div>
                            <p className="text-gray-600 mb-4">{description}</p>

                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-foreground">Create Quiz</h2>

                                <div>
                                    <label htmlFor="quizTitle" className="block text-sm font-medium text-foreground mb-1">Question Title</label>
                                    <input
                                        type="text"
                                        id="quizTitle"
                                        value={quizTitle}
                                        onChange={handleQuizTitleChange}
                                        className="w-full mt-2 p-2 border border-input rounded-md bg-background text-foreground"
                                        placeholder="Enter quiz title"
                                    />
                                </div>

                                <p className="text-sm text-gray-600 mt-4">Add Options</p>

                                <div id="optionsContainer" className="space-y-2 mt-4">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2 px-4 py-1 rounded-md group focus-within:ring focus-within:ring-primary/80 bg-white">
                                            <input
                                                type="radio"
                                                name="correctAnswer" // Ensure all options belong to the same group
                                                checked={option.isCorrect}
                                                onChange={() => handleOptionChange(index, option.text)} // Pass only the text of the option
                                                className="text-primary focus:ring-0 w-4 h-4"
                                            />
                                            <label htmlFor={`optionText${index}`} className="sr-only">Option {index + 1}</label>
                                            <input
                                                type="text"
                                                id={`optionText${index}`}
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(index, e.target.value)} // Update the text of the option
                                                className="w-full p-2 bg-transparent rounded-md text-foreground outline-none focus:ring-0"
                                                placeholder={`Option ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSaveQuiz}
                                    className="w-full bg-primary text-white text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
                                    Save Quiz
                                </button>
                            </div>
                        </div>
                        <div className="quiz-container">
                            {quiz.map((data) => (
                                <div key={data.id} className="quiz-item mb-6 bg-white shadow rounded-lg overflow-hidden">
                                    <div className="p-6 !pb-2">
                                        <div className="flex justify-between items-center mb-4">
                                            {editingQuestionId === data.id ? (
                                                <input
                                                    type="text"
                                                    value={editingQuestionText}
                                                    onChange={(e) => setEditingQuestionText(e.target.value)}
                                                    className="border border-gray-300 rounded-md p-2 w-full"
                                                />
                                            ) : (
                                                <h3 className="text-lg font-semibold">{data.question}</h3>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {data.options.map((option, index) => (
                                                <label key={index} className="flex items-center space-x-3">
                                                    <input
                                                        type="radio"
                                                        name={`answer${data.id}`}
                                                        className="form-radio text-buzzr-purple"
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 bg-gray-100 px-6 py-2">
                                        <button
                                            onClick={() => handleDelete(data.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Delete
                                        </button>
                                        {editingQuestionId === data.id ? (
                                            <button
                                                onClick={() => handleEditQuestion(data.id)}
                                                className="text-green-600 hover:text-green-800 font-medium"
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingQuestionId(data.id);
                                                    setEditingQuestionText(data.question);
                                                }}
                                                className="text-primary hover:text-primary/80 font-medium"
                                            >
                                                Edit Question
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className={`mt-4 px-6 py-2 ${quizPublished ? "bg-green-500" : "bg-yellow-500"} text-blac`}
                            onClick={togglePublishStatus}>
                            {quizPublished ? "Unpublish" : "Publish"} Quiz Set
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}