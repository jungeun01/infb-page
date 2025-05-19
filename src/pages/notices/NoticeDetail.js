import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotices } from "../../store/slices/noticesSlice";
import "../../styles/_typography.scss";

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.notices?.notices);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        await dispatch(
          fetchNotices({ collectionName: "notices", queryOptions: {} })
        ).unwrap();
      } catch (error) {
        console.error("공지사항 로딩 실패:", error);
      }
    };

    fetchNoticeDetail();
  }, [dispatch]);

  useEffect(() => {
    if (notices && id) {
      const selectedNotice = notices.find((notice) => notice.docId === id);
      setNotice(selectedNotice);
    }
  }, [notices, id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!notice) {
    return <div className="description-text text-center py-8">로딩 중...</div>;
  }

  return (
    <div className="notice-detail">
      <div className="detail-header">
        <h2 className="page-title">{notice.title}</h2>
        <div className="info meta-text flex gap-4">
          <span>작성자: {notice.authorName || "관리자"}</span>
          <span>등록일: {formatDate(notice.createdAt)}</span>
          <span>수정일: {formatDate(notice.updatedAt)}</span>
          <span>조회수: {notice.views || 0}</span>
        </div>
      </div>
      <div className="detail-content content-text">
        <div dangerouslySetInnerHTML={{ __html: notice.content }} />
      </div>
      <div className="detail-footer">
        <button onClick={handleGoBack} className="button-text back-button">
          목록으로
        </button>
      </div>
    </div>
  );
};

export default NoticeDetail;
