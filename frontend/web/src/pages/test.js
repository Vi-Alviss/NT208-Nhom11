import CheckCVResult from "../components/CheckCVResult";


const Test = () => {
    const percentage = 15;
    const feedback = "Your profile partially matches our requirements, but some key skills are missing."
    const detailFeedback = "Lorem ipsum dolor sit amet consectetur. Sit platea pharetra malesuada leo arcu vestibulum enim blandit. Quis dui dictumst sed velit augue senectus. Amet rutrum leo nunc adipiscing. Nunc aliquam eget nulla lacus risus fringilla viverra mattis sit. Felis volutpat lorem mi enim. Sit bibendum mi laoreet est. Aliquet morbi sed et vulputate. ";
    const matchingTags = ["React", "Javascript"];
    const missingTags = ["ABC", "XYZ", "123456789"];
    return (
        <div className="w-1/2 h-screen flex justify-center">
            <div className="flex justify-center items-center h-screen w-screen">
                <CheckCVResult 
                    percentage={percentage}
                    feedback={feedback}
                    detailFeedback={detailFeedback}
                    matchingTags={matchingTags}
                    missingTags={missingTags}
                    />
            </div>
        </div>
    );

};

export default Test;