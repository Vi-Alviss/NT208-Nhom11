
const CircularProgress = ({ percentage }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="w-24 h-24 flex items-center justify-center relative">
        <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#ddd"
            strokeWidth="8"
            />
            {/* Progress Circle */}
            <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#2f3b9a"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            />
        </svg>
        {/* Text Percentage */}
        <span className="absolute text-Primary text-lg font-bold">{percentage}%</span>
        </div>
    );
};

export default CircularProgress;