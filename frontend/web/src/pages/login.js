import StartNavbar from "../components/StartNavbar";
import PrimaryButton from "../components/PrimaryButton";
import TextInput from "../components/TextInput";
import ChatIcon from "../components/ChatIcon";
import { FaFacebook, FaGoogle, FaLinkedin } from "react-icons/fa";
import Footer from "../components/Footer";
import SecondaryButton from "../components/SecondaryButton";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-100 mt-30 pt-20 ">
      <StartNavbar />

      <div className="flex flex-col items-center justify-center flex-grow ">
        <div className="rounded-md border shadow-lg p-11 bg-white max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center font-Roboto_Mono">
            Login
          </h2>

          {/*Username/pw  */}
          <div className="pt-6 space-y-6 w-full max-w-lg">
            <TextInput
              type="text"
              placeholder="Enter your username or email"
              label="Username"
            />
            <TextInput
              type="password"
              placeholder="Enter your password"
              label="Password"
            />
          </div>
          {/* "Forgot password?" */}
          <div className="text-right text-sm text-blue-400 mt-2 cursor-pointer hover:underline">
            Forgot your password?
          </div>

          <div className="flex justify-center mt-6">
            <PrimaryButton className="w-60 flex justify-center px-3 py-1 text-lg">
              Login
            </PrimaryButton>
          </div>

          {/*line Don't have acc*/}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">
              Don't have an account ?{" "}
            </span>
            <div className="flex-grow border-t border-gray-300"> </div>
          </div>

          {/*sign up with other*/}
          <div className="flex items-center justify-center space-x-6 my-4">
            <FaFacebook className="text-blue-600 text-4xl cursor-pointer" />
            <FaGoogle className="text-red-500 text-4xl cursor-pointer" />
            <FaLinkedin className="text-blue-700 text-4xl cursor-pointer" />
          </div>
          {/*line or*/}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"> </div>
          </div>

          <div className="flex justify-center mt-6">
            <SecondaryButton className="w-60 flex justify-center px-3 py-1 text-lg">
              {" "}
              Sign Up{" "}
            </SecondaryButton>
          </div>
        </div>
      </div>

      <ChatIcon />
      <Footer></Footer>
    </div>
  );
};

export default Login;
