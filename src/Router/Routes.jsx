/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../Components/AdminPanel/Dashboard/Dashboard";
import MakeQuizes from "../Components/AdminPanel/MakeQuizes/MakeQuizes";
import SetQuizes from "../Components/AdminPanel/SetQuizes/SetQuizes";
import Login from "../Components/Authentication/Login/Login";
import Register from "../Components/Authentication/Register/Register";
import Leaderboard from "../Components/Leaderboard/Leaderboard";
import QuizPage from "../Components/QuizPage/QuizPage";
import Result from "../Components/Result/Result";

// Protected Admin Route
const ProtectedAdminRoute = ({ element }) => {
  const role = localStorage.getItem("role");
  return role === "admin" ? element : <Navigate to="/login" replace />;
};

export default function RoutesComponent() {
  const role = localStorage.getItem("role");

  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quizpage/:quizId" element={<QuizPage />} />
      <Route path="/leaderboard/:quizId" element={<Leaderboard />} />
      <Route path="/result/:quizId" element={<Result />} />


      <Route
        path="/adminDashboard"
        element={<ProtectedAdminRoute element={<Dashboard />} />}
      />
      <Route
        path="/setQuizes"
        element={<ProtectedAdminRoute element={<SetQuizes />} />}
      />
      <Route
        path="/makeQuizes"
        element={<ProtectedAdminRoute element={<MakeQuizes />} />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
