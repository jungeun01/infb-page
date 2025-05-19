// src/pages/admin/EditNotice.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotices, updateNotice } from "../../store/slices/noticesSlice";
import Board from "../../components/Board";
import "../../styles/pages/_contentManagement.scss";
import NoticeForm from "../../components/NoticeForm";

const EditNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.notices.notices);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchNotices({ collectionName: "notices", queryOptions: {} }));
  }, [dispatch]);

  useEffect(() => {
    if (notices && notices.length > 0) {
      const foundNotice = notices.find((n) => n.docId === id);
      if (foundNotice) {
        setNotice(foundNotice);
      } else {
        alert("공지사항을 찾을 수 없습니다.");
        navigate("/admin/notices");
      }
    }
    setLoading(false);
  }, [notices, id, navigate]);

  const handleSave = async (formData) => {
    try {
      await dispatch(
        updateNotice({
          collectionName: "notices",
          docId: id,
          data: {
            ...formData,
            updatedAt: new Date(),
          },
        })
      );
      alert("공지사항이 수정되었습니다.");
      navigate("/admin/notices");
    } catch (error) {
      console.error("공지사항 수정 실패:", error);
      alert("공지사항 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/notices");
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!notice) {
    return <div>공지사항을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="edit-notice">
      <h2>공지사항 수정</h2>
      <NoticeForm
        mode="edit"
        initialData={notice}
        onSave={handleSave}
        onClose={handleCancel}
      />
    </div>
  );
};

export default EditNotice;
