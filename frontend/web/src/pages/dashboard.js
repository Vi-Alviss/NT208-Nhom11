import { useEffect, useState } from "react";
import DefaultNavbar from "../components/DefaultNavbar";
import ChatIcon from "../components/ChatIcon";
import Banner from "../components/Banner";
import ProfileBar from "../components/ProfileBar";
import JobSummary from "../components/JobSummary";
import JobFilterTab from "../components/JobFilterTab";
import { getProjects } from "../api/projectAPI.js";
import useAuth from "../hooks/useAuth";
import { getCurrentUser } from "../api/userAPI";
import UserInfo from "../components/UserInfo.js"

const DashBoard = ({ onLogout }) => {
  const [selectedFilter, setSelectedFilter] = useState("Phù hợp nhất");
  const { userID, isLoading } = useAuth();
  const [userData, setUserData] = useState();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const TIMEOUT_DURATION = 10000; // 10 seconds

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12; // Show 12 projects per page

  const fetchWithTimeout = async (promise, timeoutMs) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi tất cả API cùng lúc
      const [userResponse, projectsResponse] = await Promise.all([
        fetchWithTimeout(getCurrentUser(), TIMEOUT_DURATION),
        fetchWithTimeout(getProjects(), TIMEOUT_DURATION)
      ]);

      // Cập nhật state với dữ liệu mới
      if (userResponse) setUserData(userResponse);
      if (projectsResponse) setProjects(projectsResponse);

      setRetryCount(0);
    } catch (error) {
      console.error("Error fetching data:", error);
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        setTimeout(fetchData, delay);
      } else {
        setError(error.message || 'Failed to fetch data after multiple attempts');
      }
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Debug log để kiểm tra dữ liệu
  useEffect(() => {
    console.log('Projects:', projects);
    console.log('Selected Filter:', selectedFilter);
  }, [projects, selectedFilter]);

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hàm lọc projects theo filter
  const getFilteredProjects = () => {
    if (!projects || !userData?.skills) return [];

    const userSkills = userData.skills.map(s => s.toLowerCase());
    
    switch (selectedFilter) {
      case "Phù hợp nhất":
        return projects
          .filter(p => p.status === "open")
          .map(p => {
            const projectSkills = p.skills || [];
            const matchCount = projectSkills.filter(skill =>
              userSkills.includes(skill.toLowerCase())
            ).length;
            return { ...p, matchScore: matchCount };
          })
          .sort((a, b) => {
            if (a.matchScore > 0 && b.matchScore > 0) {
              return b.matchScore - a.matchScore;
            } else if (a.matchScore > 0) {
              return -1;
            } else if (b.matchScore > 0) {
              return 1;
            } else {
              return 0;
            }
          });
      case "Mới nhất":
        return projects
          .filter(project => project.status === "open")
          .sort((a, b) => new Date(b.uploadeddate) - new Date(a.uploadeddate));
      case "Đã lưu":
        return projects
          .filter(project => project.status === "open")
          .sort((a, b) => parseFloat(b.budget) - parseFloat(a.budget));
      default:
        return projects.filter(project => project.status === "open");
    }
  };

  // Paginated Projects
  const paginateProjects = (projects) => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = currentPage * projectsPerPage;
    return projects.slice(startIndex, endIndex);
  };

  // Hàm xử lý dữ liệu project trước khi hiển thị
  const processProjectData = (project) => {
    return {
      ...project,
      formattedUploadDate: formatDate(project.uploadeddate),
      formattedExpireDate: formatDate(project.expireddate),
      formattedBudget: formatCurrency(project.budget),
      workingTypeText: project.workingtype === "onsite" ? "Tại văn phòng" : "Làm việc từ xa",
      daysLeft: Math.ceil((new Date(project.expireddate) - new Date()) / (1000 * 60 * 60 * 24))
    };
  };

  const totalPages = Math.ceil(getFilteredProjects().length / projectsPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 mb-4">
      <DefaultNavbar onLogout={onLogout} />

      <div className="relative w-full min-h-[488px] flex flex-col items-center">
        <Banner />

        <div className="relative flex flex-col lg:flex-row justify-between w-full px-4 lg:px-16 mt-5 gap-4">
          {/* Cột chính - Danh sách công việc */}
          <div className="w-full lg:w-3/4">
            <JobFilterTab onSelect={setSelectedFilter} />

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Không có dự án nào</p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {paginateProjects(getFilteredProjects()).map((project) => (
                  <JobSummary
                    key={project.projectid}
                    filter={selectedFilter}
                    job={processProjectData(project)}
                    className="w-full"
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-500 text-white rounded"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-gray-500 text-white rounded"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          {/* Cột bên - Thông tin người dùng */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <UserInfo
                username={userData?.username}
                email={userData?.email}
                avatar={userData?.avatarurl}
                rating="0"
                userID={userID}
              />
            </div>
          </div>
        </div>
      </div>

      <ChatIcon />
    </div>

  );
};

export default DashBoard;
