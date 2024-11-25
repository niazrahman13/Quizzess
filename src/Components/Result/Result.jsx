import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar'; // Import the circular progress bar library
import 'react-circular-progressbar/dist/styles.css';
import { Link, useParams } from "react-router-dom";

export default function Result() {
    const [attempt, setAttempt] = useState(null);
    const { quizId } = useParams();

    useEffect(() => {
        const fetchAttemptData = async () => {
            const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage

            if (token) {
                try {
                    const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/attempts`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();

                        setAttempt(data.data); // Update the state with the fetched data
                    } else {
                        console.error('Failed to fetch data:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching attempt data:', error);
                }
            } else {
                console.log('No token found. Redirecting to login...');
            }
        };

        fetchAttemptData();
    }, [quizId]);

    if (!attempt) {
        return <div>Loading...</div>;
    }

    const currentAttempt = attempt.attempts[0];
    const { correct_answers, submitted_answers } = currentAttempt;
    const { quiz } = attempt;

    // Calculate the number of correct and wrong answers
    const totalQuestions = correct_answers.length;

    // Calculate correct answers
    const correctCount = correct_answers.filter((item) => {
        const userAnswer = submitted_answers.find(answer => answer.question_id === item.question_id);
        return userAnswer && userAnswer.answer === item.answer;
    }).length;

    const wrongCount = totalQuestions - correctCount;

    // Calculate the percentage of correct answers
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    return (
        <div className="bg-background text-foreground min-h-screen">
            <div className="flex min-h-screen overflow-hidden">
                <img src="./assets/logo-white.svg" className="max-h-11 fixed left-6 top-6 z-50" />

                <div className="max-h-screen overflow-hidden hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center p-12 relative">
                    <div>
                        <div className="text-white">
                            <div>
                                <h2 className="text-4xl font-bold mb-2">{quiz.title}</h2>
                                <p>Quiz Results</p>
                            </div>

                            <div className="my-6 flex items-center">
                                <div className="w-1/2">
                                    <div className="flex gap-6 my-6">
                                        <div>
                                            <p className="font-semibold text-2xl my-0">{totalQuestions}</p>
                                            <p className="text-gray-300">Questions</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-2xl my-0">{correctCount}</p>
                                            <p className="text-gray-300">Correct</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-2xl my-0">{wrongCount}</p>
                                            <p className="text-gray-300">Wrong</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-1/2 bg-primary/80 rounded-md border border-white/20 flex items-center p-4">
                                    <div className="flex-1">
                                        <p className="text-2xl font-bold">{correctCount}/{totalQuestions}</p>
                                        <p>Your Mark</p>
                                    </div>
                                    <div style={{ width: 100, height: 100 }}>
                                        <CircularProgressbar
                                            value={percentage} // Use the calculated percentage here
                                            text={`${percentage.toFixed(2)}%`} // Display percentage with two decimal points
                                        />
                                    </div>
                                </div>
                            </div>
                            <Link to={`/leaderboard/${quizId}`} className="text-blue-500 underline mt-4">
                                View Leaderboard
                            </Link>
                        </ div>
                    </div>
                </div>

                <div className="max-h-screen md:w-1/2 flex items-center justify-center h-full p-8">
                    <div className="h-[calc(100vh-50px)] overflow-y-scroll">
                        <div className="px-4">
                            {correct_answers.map((item, index) => {
                                const userAnswer = submitted_answers.find(answer => answer.question_id === item.question_id);
                                const isCorrect = userAnswer && userAnswer.answer === item.answer;
                                return (
                                    <div key={item.question_id} className={`rounded-lg overflow-hidden shadow-sm mb-4 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <div className="bg-white p-6 !pb-2">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-semibold">
                                                    {index + 1}. {item.question}
                                                </h3>
                                            </div>
                                            <div className="space-y-2">
                                                <p>Your Answer: {userAnswer ? userAnswer.answer : 'No answer'}</p>
                                                <p>Correct Answer: {item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}