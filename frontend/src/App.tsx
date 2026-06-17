import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import OnboardingPage from "./pages/OnboardingPage";
import AITeacherPage from "./pages/AITeacherPage";
import RealtimeTeacherPage from "./pages/RealtimeTeacherPage";
import LessonsPage from "./pages/LessonsPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";
import LessonDetailsPage from "./pages/LessonDetailsPage";
import AvatarTeacherPage from "./pages/AvatarTeacherPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import WordsPracticePage from "./pages/WordsPracticePage";
import StoriesPage from "./pages/StoriesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MistakesPage from "./pages/MistakesPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/words" element={<WordsPracticePage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/teacher" element={<AITeacherPage />} />
          <Route path="/realtime-teacher" element={<RealtimeTeacherPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:lessonId" element={<LessonDetailsPage />} />
          <Route path="/avatar-teacher" element={<AvatarTeacherPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/mistakes" element={<MistakesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;