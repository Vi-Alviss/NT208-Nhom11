import CircularProgress from "./CircularProgress";
import { MatchingTag, MissingTag } from "./Tag";
import SecondaryButton from "./SecondaryButton"

const CheckCVResult = ({ className, percentage, feedback, detailFeedback, matchingTags, missingTags, onClick }) => {
    
    return (
        <div className={className}>
            <div className="shadow-lg shadow-lightPrimary rounded-e-lg p-4">

                {/* CV Feedback */}
                <div className="flex w-full border-2 border-darkPrimary rounded-2xl p-4 m-4">
                    <div className="flex-1 flex justify-center">
                        <CircularProgress percentage={percentage} className="flex-1 w-1/2"/>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-xl font-semibold">{feedback}</p>
                        <p className="text-base">{detailFeedback}</p>
                    </div>
                </div>
                {/* Matching Tag */}
                <div className="flex w-full border-2 border-darkPrimary rounded-2xl p-4 m-4">
                    {matchingTags && matchingTags.map((tag, index) =>(
                        <MatchingTag key={index} text={tag} />
                    ))}
                </div>

                {/* Missing Tag */}
                <div className="flex w-full border-2 border-darkPrimary rounded-2xl p-4 m-4">
                    {missingTags && missingTags.map((tag, index) => (
                        <MissingTag key={index} text={tag} />
                    ))}
                </div>

                <div className="flex justify-center">
                    <SecondaryButton onClick={onClick} >Close</SecondaryButton>
                </div>
            </div>
        </div>
    );
};


export default CheckCVResult;