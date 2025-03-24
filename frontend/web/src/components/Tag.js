const Tag = ({text, className}) => {
    return (
        <span className={className}>
            <span className="bg-darkPrimary text-white text-sm font-semibold px-4 py-2 rounded-full mx-1">
                {text}
            </span>
        </span>
    )
}
const MatchingTag = ({ text, className }) => {
    return (
        <span className={className}>
            <span className="bg-green-300 text-white text-sm font-semibold px-4 py-2 rounded-full mx-1">
                {text}
            </span>
        </span>
    );
};

const MissingTag = ({ text}) => {
    return (
        <span
        className={`px-4 py-2 text-Primary text-sm font-semibold rounded-full mx-1 border-2 border-dashed border-Primary}`}
        >
        {text}
        </span>
    );
};

export default Tag;
export { MatchingTag, MissingTag };