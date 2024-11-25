import { useEffect, useState } from 'react';
import QuizCards from "./QuizCards";

export default function CardsData() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch("http://localhost:5000/api/quizzes", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch quizzes");
                }
                const data = await response.json();
                setQuizzes(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <QuizCards data={quizzes} />
    );
}