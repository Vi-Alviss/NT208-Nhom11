import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/home";
import ChangePassword from "./pages/settings/change-password";
import ChangeProfile from "./pages/settings/change-profile";
import ChangeCV from "./pages/settings/change-cv";
import PostJob from "./pages/jobs/post";
import JobPage from "./pages/jobs/page";
import SearchJob from "./pages/jobs/search"; 
import SignUp from "./pages/signup"; 
import Login from "./pages/login"; 
import DashBoard from "./pages/dashboard";  
import Message from "./pages/messages";
import Spinner from "./components/Spinner";
import IntroPage from "./pages/user/intro";
import ChatBot from "./components/ChatBot";
import { ToastProvider } from "./contexts/ToastContext";
import { SocketProvider } from "./contexts/SocketContext";
import MessageHandler from "./components/MessageHandler";
import useAuth from './hooks/useAuth';
import AdminDashboard from './pages/admin/adminDashboard';
import ForgotPassword from "./pages/forgot_password";
import ResetPassword from "./pages/reset_password";

const AppContent = () => {
  const { user, role } = useAuth();
  const [authenticated, setAuthenticated] = useState(null);
  const location = useLocation();
  const isMessagePage = location.pathname.startsWith("/messages");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setAuthenticated(!!token);
    };
    
    checkAuth();
    // Thêm event listener để lắng nghe thay đổi trong localStorage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data_cache");
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return <Spinner />;
  }

  return (
    <>
      <MessageHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={!authenticated ? <ForgotPassword /> : <Navigate to="/dashboard" replace />} />
        <Route path="/reset-password/:token" element={!authenticated ? <ResetPassword /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={!authenticated ? <Login setAuthenticated={setAuthenticated} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!authenticated ? <SignUp /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          authenticated ? (
            role === 'admin' ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <DashBoard onLogout={handleLogout} />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="/settings/change-password" element={authenticated ? <ChangePassword onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/settings/change-profile" element={authenticated ? <ChangeProfile onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/settings/change-cv" element={authenticated ? <ChangeCV onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/jobs/post" element={authenticated ? <PostJob onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/jobs/:id" element={authenticated ? <JobPage onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/jobs/search" element={authenticated ? <SearchJob onLogout={handleLogout} /> : <Navigate to="/login" replace />} />

        <Route path="/messages" element={authenticated ? <Message onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/messages/:id" element={authenticated ? <Message onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/users/:id" element={authenticated ? <IntroPage onLogout={handleLogout}  /> : <Navigate to="/login" replace />} />

      </Routes>
      {!isMessagePage && <ChatBot />}
    </>
  );
};

function App() {
  return (
    <Router>
      <SocketProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </SocketProvider>
    </Router>
  );
}

export default App;
