import React, { useEffect } from "react";
import "../../styles/pages/_adminDashboard.scss";
import { fetchPosts } from "./../../store/slices/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNotices } from "./../../store/slices/noticesSlice";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const AdminDashboard = () => {
  const posts = useSelector((state) => state.posts.posts);
  const notices = useSelector((state) => state.notices.notices);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPosts({ collectionName: "posts", queryOptions: {} }));
    dispatch(fetchNotices({ collectionName: "notices", queryOptions: {} }));
  }, [dispatch]);

  const handleCardClick = (path, activeTab = "notice") => {
    navigate(path, { state: { activeTab } });
  };

  const getLatestUpdateTime = (items) => {
    if (!items || items.length === 0) return "없음";

    const latestDate = items.reduce((latest, item) => {
      let itemDate;
      if (item.updatedAt) {
        if (typeof item.updatedAt === "string") {
          itemDate = new Date(item.updatedAt);
        } else if (item.updatedAt.seconds) {
          itemDate = new Date(item.updatedAt.seconds * 1000);
        }
      } else if (item.createdAt) {
        if (typeof item.createdAt === "string") {
          itemDate = new Date(item.createdAt);
        } else if (item.createdAt.seconds) {
          itemDate = new Date(item.createdAt.seconds * 1000);
        }
      }

      if (!itemDate || isNaN(itemDate.getTime())) return latest;
      return !latest || itemDate > latest ? itemDate : latest;
    }, null);

    if (!latestDate) return "없음";

    try {
      return formatDistanceToNow(latestDate, { addSuffix: true, locale: ko });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "날짜 계산 오류";
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>대시보드</h2>
      <div className="dashboard-grid">
        <div
          className="dashboard-card notice-card"
          onClick={() => handleCardClick("/admin/notices")}
        >
          <div className="card-icon">
            <i className="fas fa-bullhorn"></i>
          </div>
          <h3>공지사항</h3>
          <div className="card-content">
            <div className="stat-item">
              <span className="stat-label">총 게시글</span>
              <span className="stat-value">{notices.length}개</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">최근 게시</span>
              <span className="stat-value">{getLatestUpdateTime(notices)}</span>
            </div>
          </div>
        </div>

        <div
          className="dashboard-card post-card"
          onClick={() => handleCardClick("/admin/posts")}
        >
          <div className="card-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <h3>게시판</h3>
          <div className="card-content">
            <div className="stat-item">
              <span className="stat-label">총 게시글</span>
              <span className="stat-value">{posts.length}개</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">최근 게시</span>
              <span className="stat-value">{getLatestUpdateTime(posts)}</span>
            </div>
          </div>
        </div>

        <div
          className="dashboard-card collection-card"
          onClick={() => navigate("/admin/collection")}
        >
          <div className="card-icon">
            <i className="fas fa-database"></i>
          </div>
          <h3>컬렉션 데이터 관리</h3>
          <div className="card-content">
            <div className="stat-item">
              <span className="stat-label">데이터 관리</span>
              <span className="stat-value">페이지 콘텐츠 수정</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">관리 항목</span>
              <span className="stat-value">회사 소개, 사업 소개 등</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
