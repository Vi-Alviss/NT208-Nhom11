import { FaSearch, FaBell, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import TertiaryButton from "./TertiaryButton";
import UserOptions from "./UserOptions";

const DefaultNavbar = () => {
    const navigate = useNavigate();
    const [showOption, setShowOption] = useState(false);

    const toggleOption = () => setShowOption(!showOption);

    return (
        <div>
            <nav className="bg-lightPrimary shadow-md py-2
                sm:px-2 lg:px-10 flex justify-between 
                items-center rounded-lg fixed top-0 left-0 w-full z-50">
        
                {/* Logo */}
                <div className="text-2xl text-darkPrimary lobster  font-lobster 
                cursor-pointer" onClick={() => navigate("/")}>SkillLink</div>

                {/* Thanh tìm kiếm */}
                <div className="flex-1 lg:mx-6 sm:mx-2 hidden sm:block md:block lg:block">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="SEARCH"
                            className="w-full px-4 py-2 rounded-full shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Menu */}
                <div className="hidden md:flex justify-center space-x-6 text-darkPrimary font-semibold">
                    <a href="/dashboard"><TertiaryButton>Home</TertiaryButton></a>
                    <a href="/check-cv"><SecondaryButton>Check CV</SecondaryButton></a>
                    <a href="/jobs/post"><PrimaryButton>Post</PrimaryButton></a>
                
                        {/* Nút icon */}
                        <div className="flex space-x-3 items-center">
                            <FaPaperPlane className=" text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary" />
                            <FaBell className=" text-2xl cursor-pointer text-darkPrimary hover:text-lightPrimary" />
                            <FaUserCircle onClick={toggleOption} className=" text-2xl text-darkPrimary cursor-pointer hover:text-lightPrimary" />
                        </div>
                
                </div>
            </nav>

            {/* Option */}
            {showOption && (
                <div className="absolute right-[75px] mt-6 bg-white p-4 w-48 z-40">
                    <UserOptions />
                </div>
            )}

        </div>
    );
};

export default DefaultNavbar;
