import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveTab,
  setSelectedImage,
  addItem,
  deleteItem,
  updateItem,
  setImageForItem,
  setInitialData,
} from "../../../store/slices/clientsSlice";
import { uploadImageFile } from "../../../store/slices/imagesSlice";
import "../../../styles/components/admin/_clientsForm.scss";

const ClientsForm = ({ editData, setEditData }) => {
  const dispatch = useDispatch();
  const { urls: imageUrls } = useSelector((state) => state.images);
  const { activeTab, selectedImage, data } = useSelector(
    (state) => state.clients
  );

  useEffect(() => {
    dispatch(setInitialData(editData));
  }, [dispatch, editData]);

  useEffect(() => {
    setEditData(data);
  }, [data, setEditData]);

  const handleAddItem = (type) => {
    dispatch(addItem({ type }));
  };

  const handleDeleteItem = (type, index) => {
    dispatch(deleteItem({ type, index }));
  };

  const handleChange = (type, index, field, value) => {
    dispatch(updateItem({ type, index, field, value }));
  };

  const handleImageSelect = (type, index, imageName) => {
    dispatch(setImageForItem({ type, index, imageName }));
  };

  const handleImageUpload = async (e, type, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await dispatch(
        uploadImageFile({ file, folder: "clients" })
      ).unwrap();

      dispatch(
        setImageForItem({
          type,
          index,
          imageName: result.fileName,
        })
      );
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const renderItemList = (type, label) => (
    <div className="clients-section">
      <div className="section-header">
        <h3>{label}</h3>
        <button className="add-button" onClick={() => handleAddItem(type)}>
          추가하기
        </button>
      </div>
      <div className="items-grid">
        {(data[type] || []).map((item, index) => (
          <div key={item.id} className="item-card">
            <div className="item-content">
              <div className="image-container">
                {item.img ? (
                  <img
                    src={imageUrls?.clients?.[`clients/${item.img}`]}
                    alt={item.name}
                  />
                ) : (
                  <div className="no-image">이미지 없음</div>
                )}
                <button
                  className="select-image-button"
                  onClick={() => dispatch(setSelectedImage({ type, index }))}
                >
                  이미지 선택
                </button>
              </div>
              <div className="item-fields">
                <input
                  type="text"
                  placeholder="이름"
                  value={item.name || ""}
                  onChange={(e) =>
                    handleChange(type, index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="링크"
                  value={item.href || ""}
                  onChange={(e) =>
                    handleChange(type, index, "href", e.target.value)
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, type, index)}
                  style={{ marginTop: "10px" }}
                />
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteItem(type, index)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="clients-form">
      <div className="form-tabs">
        <button
          className={`tab-button ${activeTab === "business" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("business"))}
        >
          공공분야 고객사
        </button>
        <button
          className={`tab-button ${activeTab === "private" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("private"))}
        >
          민간분야 고객사
        </button>
        <button
          className={`tab-button ${activeTab === "partner" ? "active" : ""}`}
          onClick={() => dispatch(setActiveTab("partner"))}
        >
          파트너
        </button>
      </div>

      <div className="form-content">
        {activeTab === "business" &&
          renderItemList("business", "공공분야 고객사")}
        {activeTab === "private" &&
          renderItemList("private", "민간분야 고객사")}
        {activeTab === "partner" && renderItemList("partner", "파트너")}
      </div>

      {selectedImage && (
        <div className="image-modal">
          <div className="modal-content">
            <h3>이미지 선택</h3>
            <div className="image-grid">
              {Object.entries(imageUrls?.clients || {}).map(([path, url]) => (
                <div
                  key={path}
                  className="image-item"
                  onClick={() =>
                    handleImageSelect(
                      selectedImage.type,
                      selectedImage.index,
                      path.split("/").pop()
                    )
                  }
                >
                  <img src={url} alt={path} />
                </div>
              ))}
            </div>
            <div className="upload-section">
              <label className="upload-button">
                새 이미지 업로드
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(
                      e,
                      selectedImage.type,
                      selectedImage.index
                    )
                  }
                />
              </label>
              <p className="upload-text">또는 이미지를 드래그하여 업로드</p>
            </div>
            <button
              className="close-button"
              onClick={() => dispatch(setSelectedImage(null))}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsForm;
