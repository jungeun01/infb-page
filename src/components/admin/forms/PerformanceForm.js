import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadImageFile } from "../../../store/slices/imagesSlice";
import "../../../styles/components/admin/forms/_performanceForm.scss";

const PerformanceForm = ({ editData, setEditData }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      performanceCases: {
        ...prev.performanceCases,
        [name]: value,
      },
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await dispatch(
        uploadImageFile({ file, folder: "clients" })
      ).unwrap();
      setEditData((prev) => ({
        ...prev,
        performanceCases: {
          ...prev.performanceCases,
          logo: result.url,
        },
      }));
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="performance-form">
      <div className="form-group">
        <label htmlFor="year">연도</label>
        <input
          type="text"
          id="year"
          name="year"
          value={editData.performanceCases.year || ""}
          onChange={handleInputChange}
          placeholder="예: 2024"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">카테고리</label>
        <input
          type="text"
          id="category"
          name="category"
          value={editData.performanceCases.category || ""}
          onChange={handleInputChange}
          placeholder="예: 공공기관"
        />
      </div>

      <div className="form-group">
        <label htmlFor="title">프로젝트 제목</label>
        <input
          type="text"
          id="title"
          name="title"
          value={editData.performanceCases.title || ""}
          onChange={handleInputChange}
          placeholder="프로젝트 제목을 입력하세요"
        />
      </div>

      <div className="form-group">
        <label>기관 로고 이미지</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        {/* 미리보기 */}
        {editData.performanceCases.logo && (
          <img
            src={editData.performanceCases.logo}
            alt="기관 로고 미리보기"
            style={{ width: 100, marginTop: 8 }}
          />
        )}
      </div>
    </div>
  );
};

export default PerformanceForm;
