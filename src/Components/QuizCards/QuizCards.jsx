/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export default function QuizCards({ data }) {
    const navigate = useNavigate();

    const handleQuizClick = (quizId, isAttempted) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            if (isAttempted) {

                navigate(`/result/${quizId}`);
            } else {

                navigate(`quizpage/${quizId}`);
            }
        } else {

            navigate("/login");
        }
    };

    return (
        <div className="bg-white p-6 rounded-md h-full">
            <section>
                <h3 className="text-2xl font-bold mb-6">Participate In Quizzes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.map((quiz) => (
                        <div
                            key={quiz.id}
                            onClick={() => handleQuizClick(quiz.id, quiz.is_attempted)} // Handle click
                            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow max-h-[450px] relative group cursor-pointer flex flex-col"
                        >
                            <div className="relative flex-grow">
                                <img
                                    src={quiz.thumbnail}
                                    alt={quiz.title}
                                    className="w-full h-40 object-cover rounded mb-4"
                                />

                                {quiz.is_attempted && (
                                    <div className="absolute transition-all bg-black/80 w-full h-full left-0 top-0 text-white grid place-items-center">
                                        <div>
                                            <h1 className="text-3xl font-bold">Already Participated</h1>
                                            <p className="text-center">Click to view your leaderboard</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 mt-4">
                                <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
                                <p className="text-gray-600 text-sm">{quiz.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
