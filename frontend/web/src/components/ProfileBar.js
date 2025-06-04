import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useUserProfile from "../hooks/useUserProfile";
import PDFViewer from "../components/PDFViewer";
import { getMyProject } from "../api/projectAPI";
import JobSummary from "./JobSummary";

const ProfileBar = () => {
    const { id } = useParams();
    const { userData, loading, error } = useUserProfile(id);
    const [activeTab, setActiveTab] = useState('introduce');
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState(null);

    // Pagination states
    const [currentPagePosted, setCurrentPagePosted] = useState(1);
    const [currentPageFinished, setCurrentPageFinished] = useState(1);
    const projectsPerPage = 9;

    console.log(projects)

    useEffect(() => {
        const fetchProjects = async () => {
            if (activeTab === 'jobPosted') {
                setProjectsLoading(true);
                try {
                    const data = await getMyProject(id);
                    setProjects(data);
                    setProjectsError(null);
                } catch (err) {
                    setProjectsError('Không thể tải danh sách dự án');
                    console.error(err);
                } finally {
                    setProjectsLoading(false);
                }
            }
// chua them cho jobfinished       
        };

        fetchProjects();
    }, [activeTab]);

    // Paginate the projects for both tabs
    const paginateProjects = (projects, currentPage) => {
        const startIndex = (currentPage - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;
        return projects.slice(startIndex, endIndex);
    };

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="mt-4 p-4 bg-white rounded-lg shadow animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/4"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="mt-4 p-4 bg-red-50 rounded-lg shadow">
                    <p className="text-red-600">{error}</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'introduce':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
                        <p className="text-gray-600">{userData?.introduce || 'Chưa có thông tin giới thiệu.'}</p>
                    </div>
                );
            case 'skill':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Kỹ năng</h3>
                        {userData.skills && userData.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {userData.skills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa có kỹ năng nào.</p>
                        )}
                    </div>
                );
            case 'jobPosted':
                if (projectsLoading) {
                    return (
                        <div className="mt-4 p-4 bg-white rounded-lg shadow animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-48 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    );
                }

                if (projectsError) {
                    return (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg shadow">
                            <p className="text-red-600">{projectsError}</p>
                        </div>
                    );
                }

                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-4">Dự án đã đăng</h3>
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {paginateProjects(projects, currentPagePosted).map(project => (
                                    <JobSummary key={project.projectid} job={project} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa có dự án nào.</p>
                        )}
                        
                        {/* Pagination */}
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setCurrentPagePosted(prev => Math.max(prev - 1, 1))}
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                disabled={currentPagePosted === 1}
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2">{`${currentPagePosted} / ${Math.ceil(projects.length / projectsPerPage)}`}</span>
                            <button
                                onClick={() => setCurrentPagePosted(prev => Math.min(prev + 1, Math.ceil(projects.length / projectsPerPage)))}
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                disabled={currentPagePosted === Math.ceil(projects.length / projectsPerPage)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 'jobFinished':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Dự án đã hoàn thành</h3>
                        {userData.completedJobs && userData.completedJobs.length > 0 ? (
                            <div className="space-y-4">
                                {userData.completedJobs.map((job) => (
                                    <div key={job.id} className="border-b pb-4 last:border-b-0">
                                        <h4 className="font-medium">{job.title}</h4>
                                        <p className="text-sm text-gray-600">{job.description}</p>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Completed: {new Date(job.completedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa có dự án nào.</p>
                        )}
                    </div>
                );
            case 'cv':
                return (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow">
                        {userData.cv_url ? (
                            <div>
                                <PDFViewer fileUrl={userData.cv_url} />
                                <a href={userData.cv} target="_blank" rel="noopener noreferrer" className="...">
                                    📄 Xem hoặc tải PDF
                                </a>
                            </div>
                        ) : (
                            <p className="text-gray-600">Chưa tải CV lên.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="flex items-center gap-8">
                    <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 rounded-lg shadow">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    const displayUsername = userData?.username || '';
    const displayEmail = userData?.email || '';
    const displayAvatar = userData?.avatarurl || '/images/avatar.png';
    const displayRating = userData?.rating || 0;

    return (
        <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {/* Avatar */}
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 transition-transform hover:scale-105">
                        <img
                            src={displayAvatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Rating stars */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, index) => (
                                index < displayRating ? (
                                    <FaStar key={index} className="text-yellow-400 text-sm" />
                                ) : (
                                    <FaRegStar key={index} className="text-gray-300 text-sm" />
                                )
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                    {/* Tên và chức danh */}
                    <div className="mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{displayUsername}</h1>
                        <p className="text-lg text-gray-600">{userData?.title || 'Freelancer'}</p>
                    </div>

                    {/* Các tab */}
                    <div className="w-full">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-2 md:gap-4">
                            <button 
                                onClick={() => setActiveTab('introduce')}
                                className={`px-3 py-2 font-medium rounded-lg transition-all text-center ${
                                    activeTab === 'introduce' 
                                    ? 'bg-darkPrimary text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Giới thiệu
                            </button>
                            <button 
                                onClick={() => setActiveTab('skill')}
                                className={`px-3 py-2 font-medium rounded-lg transition-all text-center ${
                                    activeTab === 'skill' 
                                    ? 'bg-darkPrimary text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Kỹ năng
                            </button>
                            <button 
                                onClick={() => setActiveTab('jobPosted')}
                                className={`px-3 py-2 font-medium rounded-lg transition-all text-center ${
                                    activeTab === 'jobPosted' 
                                    ? 'bg-darkPrimary text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Dự án đã đăng
                            </button>
                            <button 
                                onClick={() => setActiveTab('jobFinished')}
                                className={`px-3 py-2 font-medium rounded-lg transition-all text-center ${
                                    activeTab === 'jobFinished' 
                                    ? 'bg-darkPrimary text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                Dự án đã hoàn thành
                            </button>
                            <button 
                                onClick={() => setActiveTab('cv')}
                                className={`px-3 py-2 font-medium rounded-lg transition-all text-center ${
                                    activeTab === 'cv' 
                                    ? 'bg-darkPrimary text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                CV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Tab content */}
            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ProfileBar;
