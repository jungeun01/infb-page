// src/pages/admin/NoticeManagement.js
import React, { useEffect, useState } from "react";
import "../../styles/pages/_noticeManagement.scss";
import {
  deleteNotice,
  fetchNotices,
  addNotice,
  updateNotice,
} from "../../store/slices/noticesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NoticeForm from "../../components/NoticeForm";
import { useCallback } from "react";

const NoticeManagement = () => {
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showNoticeDetail, setShowNoticeDetail] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const notices = useSelector((state) => state.notices?.notices);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // fetchNoticesData 함수를 useCallback으로 메모이제이션
  const fetchNoticesData = useCallback(async () => {
    try {
      await dispatch(
        fetchNotices({ collectionName: "notices", queryOptions: {} })
      ).unwrap();
    } catch (error) {
      console.error("공지사항 로딩 실패:", error);
    }
  }, [dispatch]);

  // useEffect에서 사용
  useEffect(() => {
    fetchNoticesData();
  }, [fetchNoticesData]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";

    try {
      let date;
      if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        return "-";
      }

      if (isNaN(date.getTime())) return "-";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "-";
    }
  };

  const handleEdit = (notice) => {
    navigate(`/admin/editNotice/${notice.docId}`);
  };

  const handleDelete = async (docId) => {
    if (window.confirm("공지사항을 삭제하시겠습니까?")) {
      try {
        await dispatch(
          deleteNotice({ collectionName: "notices", docId })
        ).unwrap();
        alert("공지사항이 삭제되었습니다.");
        // 삭제 후 목록 새로고침
        fetchNoticesData();
      } catch (error) {
        console.error("공지사항 삭제 실패:", error);
        alert("공지사항 삭제에 실패했습니다.");
      }
    }
  };

  const handleNewNotice = () => {
    setShowNoticeForm(true);
  };

  const handleSaveNotice = async (formData) => {
    try {
      const newNotice = {
        ...formData,
        createdAt: new Date().toISOString(),
        check: false, // 기본적으로 '비공개' 상태로 시작
      };

      await dispatch(
        addNotice({ collectionName: "notices", data: newNotice })
      ).unwrap();
      setShowNoticeForm(false);
      alert("공지사항이 등록되었습니다.");
      // 등록 후 목록 새로고침
      fetchNoticesData();
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("공지사항 등록에 실패했습니다.");
    }
  };

  // 게시 상태 토글 함수
  const handleTogglePublish = async (notice) => {
    try {
      const updatedNotice = {
        ...notice,
        check: !notice.check,
        updatedAt: new Date().toISOString(),
      };

      await dispatch(
        updateNotice({
          collectionName: "notices",
          docId: notice.docId,
          data: updatedNotice,
        })
      ).unwrap();
      // 상태 변경 후 목록 새로고침
      alert("상태 변경에 성공했습니다.");
      fetchNoticesData();
    } catch (error) {
      console.error("공지사항 상태 변경 실패:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowNoticeDetail(true);
  };

  const handleCloseDetail = () => {
    setShowNoticeDetail(false);
    setSelectedNotice(null);
  };

  return (
    <div className="notice-management">
      <div className="notice-header">
        <h2>공지사항 관리</h2>
      </div>
      <button className="notice-create-button" onClick={handleNewNotice}>
        새 공지사항 작성
      </button>

      {showNoticeForm ? (
        <div className="notice-form-container">
          <NoticeForm
            onSave={handleSaveNotice}
            onClose={() => setShowNoticeForm(false)}
          />
        </div>
      ) : showNoticeDetail ? (
        <div className="notice-detail-container">
          <div className="notice-detail">
            <h3>{selectedNotice.title}</h3>
            <div className="notice-info">
              <span>작성자: {selectedNotice.authorName || "관리자"}</span>
              <span>작성일: {formatDate(selectedNotice.createdAt)}</span>
            </div>
            <div
              className="notice-content"
              dangerouslySetInnerHTML={{ __html: selectedNotice.content }}
            />
            <div className="notice-actions">
              <button
                className="notice-edit-btn"
                onClick={() => handleEdit(selectedNotice)}
              >
                수정
              </button>
              <button
                className="notice-delete-btn"
                onClick={() => handleDelete(selectedNotice.docId)}
              >
                삭제
              </button>
              <button className="notice-close-btn" onClick={handleCloseDetail}>
                닫기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="notice-list">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {notices && notices.length > 0 ? (
                notices.map((notice, index) => (
                  <tr key={notice.docId}>
                    <td>{index + 1}</td>
                    <td>
                      <span
                        className="notice-title"
                        onClick={() => handleNoticeClick(notice)}
                        style={{ cursor: "pointer" }}
                      >
                        {notice.title}
                      </span>
                    </td>
                    <td>{notice.authorName || "관리자"}</td>
                    <td>{formatDate(notice.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(notice)}
                        className={`notice-status-toggle ${
                          notice.check ? "active" : "pending"
                        }`}
                      >
                        {notice.check ? "게시중" : "비공개"}
                      </button>
                    </td>
                    <td className="notice-actions">
                      <button
                        className="notice-edit-btn"
                        onClick={() => handleEdit(notice)}
                      >
                        수정
                      </button>
                      <button
                        className="notice-delete-btn"
                        onClick={() => handleDelete(notice.docId)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="notice-no-data">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NoticeManagement;
