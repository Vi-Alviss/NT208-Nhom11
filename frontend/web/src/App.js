import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ChangePassword from "./pages/settings/change-password";
import ChangeProfile from "./pages/settings/change-profile";
import ChangeCV from "./pages/settings/change-cv";
import PostJob from "./pages/jobs/post";
import Test from "./pages/test"
import SignUp from "./pages/signup"; 
import Login from "./pages/login"; 
import ForgotPass from "./pages/ForgotPass";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/settings/change-profile" element={<ChangeProfile />} />
        <Route path="/settings/change-cv" element={<ChangeCV />} />
        <Route path="/test" element={<Test />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/jobs/post" element={<PostJob />} />
        <Route path="/forgotPass" element={<ForgotPass />} />
      </Routes>
    </Router>
  );
}

export default App;
