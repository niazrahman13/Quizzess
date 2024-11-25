import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Leaderboard() {
    const { quizId } = useParams();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [userScore, setScore] = useState(null);
    const [userName, setUser] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    console.log(userScore);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                try {
                    const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}/attempts`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const attempts = data.data.attempts;

                        // Process attempts to calculate scores
                        const scores = attempts.map(attempt => {
                            const correctAnswers = attempt.correct_answers.length;
                            const submittedAnswers = attempt.submitted_answers.length;
                            const wrongAnswers = submittedAnswers - correctAnswers;

                            // Set userName and userScore if this attempt belongs to the current user
                            if (attempt.user.full_name === localStorage.getItem("fullName")) {
                                setUser(attempt.user.full_name);
                                setScore({
                                    name: attempt.user.full_name,
                                    correct: correctAnswers,
                                    wrong: wrongAnswers,
                                    total: correctAnswers + wrongAnswers,
                                    score: (correctAnswers * 100) / (correctAnswers + wrongAnswers || 1),
                                });
                            }

                            return {
                                name: attempt.user.full_name,
                                correct: correctAnswers,
                                wrong: wrongAnswers,
                                total: correctAnswers + wrongAnswers,
                                score: (correctAnswers * 100) / (correctAnswers + wrongAnswers || 1),
                            };
                        });

                        // Sort scores in descending order
                        scores.sort((a, b) => b.score - a.score);
                        setLeaderboardData(scores);
                    } else {
                        console.error('Failed to fetch leaderboard data:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching leaderboard data:', error);
                } finally {
                    setLoading(false); // Set loading to false when done
                }
            } else {
                console.log('No token found. Please log in or sign in.');
                setLoading(false); // Set loading to false when no token is found
            }
        };

        fetchLeaderboardData();
    }, [quizId]);

    return (
        <div className="bg-[#F5F3FF] p-4">
            <main className="min-h-[calc(100vh-50px)] flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center">
                            <h2 className="text-lg font-semibold">Loading leaderboard...</h2>
                            <p>Please log in or sign in to view the leaderboard.</p>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-primary rounded-lg p-6 text-white">
                                <div className="flex flex-col items-center mb-6">
                                    <img src="./assets/avatar.webp" alt="Profile Pic"
                                        className="w-20 h-20 rounded-full border-4 border-white mb-4 object-cover" />
                                    <h2 className="text-2xl font-bold">{userName}</h2>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center">
                                        <p className=" text-sm opacity-75">Mark</p>
                                        <p className="text-2xl font-bold">{userScore ? userScore.score.toFixed(2) : 'Loading...'}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm opacity-75">Correct</p>
                                        <p className="text-2xl font-bold">{userScore ? userScore.correct : 'Loading...'}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm opacity-75">Wrong</p>
                                        <p className="text-2xl font-bold">{userScore ? userScore.wrong : 'Loading...'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
                                <ul className="space-y-2">
                                    {leaderboardData.map((participant, index) => (
                                        <li key={participant.name} className={`flex justify-between p-2 rounded ${index < 5 && participant.name === userName ? 'bg-yellow-200' : ''}`}>
                                            <span>{index + 1}. {participant.name}</span>
                                            <span>{participant.score.toFixed(2)}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}