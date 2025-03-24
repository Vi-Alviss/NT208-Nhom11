import ChatIcon from "../components/ChatIcon";
import DefaultNavbar from "../components/DefaultNavbar";
import { PiReadCvLogoLight } from "react-icons/pi";
import { useState } from "react";
import TextInput from "../components/TextInput";
import PrimaryButton from "../components/PrimaryButton";

const CheckCV = () => {
    const [fileName, setFileName] = useState("Không có tệp nào được chọn");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName("No file chosen");
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <DefaultNavbar />

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="rounded-md border-divideColor shadow-lg shadow-lightPrimary p-11 bg-white sm:w-auto lg:w-1/2">
                    <h2 className="flex text-5xl font-bold justify-center items-start mb-10">Check your CV</h2>
                    <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex gap-2">
                            <div className="flex-1 grow-0">
                                <div class="w-20 h-20 bg-Primary rounded-full flex items-center justify-center text-white font-bold text-3xl ">
                                    1
                                </div>
                            </div>

                            <div className="flex-2 flex-grow">
                                <p className="text-xl text-PrimaryText pb-4">Upload your cv</p>
                                <div className="flex justify-center items-center border-dashed border-divideColor border-2 rounded-lg w-full h-64">
                                    <label className="cursor-pointer">
                                        <PiReadCvLogoLight className="text-6xl" />
                                        <input
                                            type="file"
                                            id="fileInput"
                                            className="hidden"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    {fileName && <p className="text-sm text-gray-700">{fileName}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-2">
                            <div className="flex-1 grow-0">
                                <div class="w-20 h-20 bg-Primary rounded-full flex items-center justify-center text-white font-bold text-3xl ">
                                    2
                                </div>
                            </div>

                            <div className="flex-2 flex-grow">
                                <p className="text-xl text-PrimaryText pb-4">Enter job description</p>

                                <textarea 
                                className="w-full p-2 border border-darkPrimary rounded-md focus:outline-none focus:ring-2 focus:ring-darkPrimary resize-none"
                                rows="10"
                                />
                            </div>
                        </div>    
                        <div className="flex justify-center mt-10">
                            <PrimaryButton className="w-auto flex justify-center px-3 py-1 text-lg"> CHECK </PrimaryButton>
                        </div>


                    </div>

                </div>
            </div>
            <ChatIcon></ChatIcon>
        </div>
    );
}

export default CheckCV;