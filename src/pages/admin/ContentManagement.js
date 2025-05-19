import React, { useState, useEffect } from "react";
import "../../styles/pages/_contentManagement.scss";
import NoticeManagement from "./NoticeManagement";
import PostManagement from "./PostManagement";
import { useLocation } from "react-router-dom";

const ContentManagement = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "notice"
  );

  // location.state가 변경될 때마다 activeTab 업데이트
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activeTab) {
      case "notice":
        return <NoticeManagement />;
      case "inquiry":
        return <PostManagement />;
      case "faq":
        return <div>FAQ 관리 (준비중)</div>;
      default:
        return <NoticeManagement />;
    }
  };

  return (
    <div className="content-management">
      <h2>콘텐츠 관리</h2>
      <div className="content-tabs">
        <button
          className={`tab-button ${activeTab === "notice" ? "active" : ""}`}
          onClick={() => setActiveTab("notice")}
        >
          공지사항
        </button>
        <button
          className={`tab-button ${activeTab === "inquiry" ? "active" : ""}`}
          onClick={() => setActiveTab("inquiry")}
        >
          게시판
        </button>
        <button
          className={`tab-button ${activeTab === "faq" ? "active" : ""}`}
          onClick={() => setActiveTab("faq")}
        >
          FAQ
        </button>
      </div>
      <div className="content-body">{renderContent()}</div>
    </div>
  );
};

export default ContentManagement;
