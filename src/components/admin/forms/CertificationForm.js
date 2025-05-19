import React, { useState, useEffect } from "react";
import "../../../styles/components/admin/forms/_certificationForm.scss";
import { fetchImage, auth } from "../../../pages/API/firebase";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadImageFile,
  deleteImageFile,
  fetchFolderImages,
} from "../../../store/slices/imagesSlice";

const CertificationForm = ({ editData, setEditData }) => {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const { urls: imageUrls } = useSelector((state) => state.images);

  useEffect(() => {
    if (!editData?.items) return;

    const loadImages = async () => {
      const urls = {};
      for (const item of editData.items) {
        if (item.image) {
          try {
            const folder =
              item.type === "certification" ? "certificate" : "patent";
            const url = await fetchImage(`${folder}/${item.image}`);
            urls[item.image] = url;
          } catch (error) {
            console.error(`이미지 로드 실패: ${item.image}`, error);
          }
        }
      }
    };

    loadImages();
  }, [editData?.items]);

  useEffect(() => {
    // 현재 로그인된 사용자 정보 확인
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Current user:", {
          email: user.email,
          uid: user.uid,
          emailVerified: user.emailVerified,
        });
      } else {
        console.log("No user is currently signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  // 폴더별 이미지 미리 불러오기
  useEffect(() => {
    dispatch(fetchFolderImages("certificate"));
    dispatch(fetchFolderImages("patent"));
  }, [dispatch]);

  if (!editData?.items) {
    setEditData({
      ...editData,
      title: "",
      subtitle: "",
      items: [],
    });
    return null;
  }

  const handleAddItem = () => {
    const maxId = Math.max(...editData.items.map((item) => item.id || 0), 0);
    const newItem = {
      id: maxId + 1,
      type: "certification",
      title: "",
      image: "",
      description: [""],
    };
    setEditData({
      ...editData,
      items: [newItem, ...editData.items],
    });
  };

  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const folder =
        editData.items[index].type === "certification"
          ? "certificate"
          : "patent";

      console.log("Uploading image...", {
        fileName: file.name,
        folder,
        currentUser: auth.currentUser?.email,
      });

      const result = await dispatch(uploadImageFile({ file, folder })).unwrap();
      console.log("Upload result:", result);

      const newItems = [...editData.items];
      newItems[index] = {
        ...newItems[index],
        image: file.name,
      };
      setEditData({ ...editData, items: newItems });

      Swal.fire({
        title: "업로드 성공",
        text: "이미지가 성공적으로 업로드되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      Swal.fire({
        title: "업로드 실패",
        text: error.message || "이미지 업로드 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (index) => {
    const item = editData.items[index];
    if (!item.image) return;

    try {
      const folder = item.type === "certification" ? "certificate" : "patent";
      await dispatch(
        deleteImageFile({ folder, fileName: item.image })
      ).unwrap();

      const newItems = [...editData.items];
      newItems[index] = {
        ...newItems[index],
        image: "",
      };
      setEditData({ ...editData, items: newItems });

      Swal.fire({
        title: "삭제 성공",
        text: "이미지가 성공적으로 삭제되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } catch (error) {
      Swal.fire({
        title: "삭제 실패",
        text: "이미지 삭제 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className="certification-form">
      <div className="form-group">
        <div className="header">
          <label>인증 및 특허 관리</label>
          <button type="button" className="add-button" onClick={handleAddItem}>
            새 인증/특허 추가
          </button>
        </div>
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            value={editData.title || ""}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            placeholder="인증 및 특허"
          />
        </div>
        <div className="form-group">
          <label>부제목</label>
          <input
            type="text"
            value={editData.subtitle || ""}
            onChange={(e) =>
              setEditData({ ...editData, subtitle: e.target.value })
            }
            placeholder="INFOB의 기술력과 신뢰성을 인정받은 다양한 인증서와 특허입니다"
          />
        </div>

        {editData.items.map((cert, index) => (
          <div key={cert.id || index} className="certification-item">
            <div className="cert-input-group">
              <div className="input-row">
                <select
                  value={cert.type || "certification"}
                  onChange={(e) => {
                    const newItems = [...editData.items];
                    newItems[index] = {
                      ...newItems[index],
                      type: e.target.value,
                    };
                    setEditData({ ...editData, items: newItems });
                  }}
                  className="type-select"
                >
                  <option value="certification">인증서</option>
                  <option value="patent">특허</option>
                </select>
              </div>
              <div className="input-row">
                <input
                  type="text"
                  value={cert.title || ""}
                  onChange={(e) => {
                    const newItems = [...editData.items];
                    newItems[index] = {
                      ...newItems[index],
                      title: e.target.value,
                    };
                    setEditData({ ...editData, items: newItems });
                  }}
                  placeholder="인증/특허명"
                />
              </div>
              <div className="input-row image-upload">
                <label>이미지</label>
                <div className="image-controls">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    disabled={uploading}
                  />
                  {cert.image && (
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleImageDelete(index)}
                    >
                      이미지 삭제
                    </button>
                  )}
                </div>
                {cert.image && (
                  <div className="image-preview">
                    <div className="preview-container">
                      <img
                        src={
                          imageUrls?.[
                            cert.type === "certification"
                              ? "certificate"
                              : "patent"
                          ]?.[
                            `${
                              cert.type === "certification"
                                ? "certificate"
                                : "patent"
                            }/${cert.image}`
                          ] || ""
                        }
                        alt={cert.title}
                      />
                      <span>현재 이미지: {cert.image}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="description-list">
              {cert.description?.map((desc, descIndex) => (
                <div key={descIndex} className="description-item">
                  <input
                    type="text"
                    value={desc || ""}
                    onChange={(e) => {
                      const newItems = [...editData.items];
                      newItems[index] = {
                        ...newItems[index],
                        description: newItems[index].description.map((d, i) =>
                          i === descIndex ? e.target.value : d
                        ),
                      };
                      setEditData({ ...editData, items: newItems });
                    }}
                    placeholder="설명을 입력하세요"
                  />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => {
                      const newItems = [...editData.items];
                      newItems[index] = {
                        ...newItems[index],
                        description: newItems[index].description.filter(
                          (_, i) => i !== descIndex
                        ),
                      };
                      setEditData({ ...editData, items: newItems });
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))}
              <div className="btnBox">
                <button
                  type="button"
                  className="add-button"
                  onClick={() => {
                    const newItems = [...editData.items];
                    if (!newItems[index].description) {
                      newItems[index].description = [];
                    }
                    newItems[index].description.push("");
                    setEditData({ ...editData, items: newItems });
                  }}
                >
                  설명 추가
                </button>
                <button
                  type="button"
                  className="delete-all-button"
                  onClick={() => {
                    const newItems = editData.items.filter(
                      (_, i) => i !== index
                    );
                    setEditData({ ...editData, items: newItems });
                  }}
                >
                  전체 삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationForm;
