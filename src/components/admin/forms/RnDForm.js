import React, { useState, useEffect } from "react";
import "../../../styles/components/admin/forms/_rndForm.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadImageFile,
  deleteImageFile,
  fetchFolderImages,
} from "../../../store/slices/imagesSlice";
import Swal from "sweetalert2";

const RnDForm = ({ editData, setEditData }) => {
  const dispatch = useDispatch();
  const { urls: imageUrls } = useSelector((state) => state.images);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    type: "leakDetection",
    name: "",
    id: "",
    releaseDate: "",
    features: {
      description: "",
    },
    images: [],
  });

  useEffect(() => {
    dispatch(fetchFolderImages("rnd"));
  }, [dispatch]);

  useEffect(() => {
    if (editData && editData.boardProducts) {
      const fixed = editData.boardProducts.map((item) => ({
        ...item,
        images: Array.isArray(item.images)
          ? item.images
          : item.image
          ? [item.image]
          : [],
      }));
      if (JSON.stringify(fixed) !== JSON.stringify(editData.boardProducts)) {
        setEditData({
          ...editData,
          boardProducts: fixed,
        });
      }
    }
  }, [editData, setEditData]);

  const handleUpdateLeakDetection = (index, field, value) => {
    const newLeakDetection = [...editData.leakDetection];
    if (field === "description") {
      newLeakDetection[index] = {
        ...newLeakDetection[index],
        features: {
          ...newLeakDetection[index].features,
          description: value.split("\n"),
        },
      };
    } else {
      newLeakDetection[index] = {
        ...newLeakDetection[index],
        [field]: value,
      };
    }
    setEditData({
      ...editData,
      leakDetection: newLeakDetection,
    });
  };

  const handleUpdateBoardProduct = (index, field, value) => {
    const newBoardProducts = [...editData.boardProducts];
    if (field === "description") {
      newBoardProducts[index] = {
        ...newBoardProducts[index],
        features: {
          ...newBoardProducts[index].features,
          description: value,
        },
      };
    } else {
      newBoardProducts[index] = {
        ...newBoardProducts[index],
        [field]: value,
      };
    }
    setEditData({
      ...editData,
      boardProducts: newBoardProducts,
    });
  };

  const handleAddProduct = () => {
    if (newProduct.type === "leakDetection") {
      setEditData({
        ...editData,
        leakDetection: [
          {
            name: newProduct.name,
            id: newProduct.id,
            releaseDate: newProduct.releaseDate,
            features: {
              description: newProduct.features.description.split("\n"),
            },
            images: newProduct.images || [],
          },
          ...editData.leakDetection,
        ],
      });
    } else {
      setEditData({
        ...editData,
        boardProducts: [
          {
            name: newProduct.name,
            id: newProduct.id,
            releaseDate: newProduct.releaseDate,
            features: {
              description: newProduct.features.description,
            },
            image: "",
          },
          ...editData.boardProducts,
        ],
      });
    }
    setShowNewForm(false);
    setNewProduct({
      type: "leakDetection",
      name: "",
      id: "",
      releaseDate: "",
      features: {
        description: "",
      },
      images: [],
    });
  };

  const handleDeleteLeakDetection = (index) => {
    const newLeakDetection = editData.leakDetection.filter(
      (_, i) => i !== index
    );
    setEditData({
      ...editData,
      leakDetection: newLeakDetection,
    });
  };

  const handleDeleteBoardProduct = (index) => {
    const newBoardProducts = editData.boardProducts.filter(
      (_, i) => i !== index
    );
    setEditData({
      ...editData,
      boardProducts: newBoardProducts,
    });
  };

  const handleUpdateNewProduct = (field, value) => {
    if (field === "description") {
      setNewProduct({
        ...newProduct,
        features: {
          ...newProduct.features,
          description: value,
        },
      });
    } else {
      setNewProduct({
        ...newProduct,
        [field]: value,
      });
    }
  };

  // 여러 이미지 업로드 지원
  const handleImageUpload = async (event, productType, index = null) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    let uploadedFileNames = [];
    for (const file of files) {
      try {
        const result = await dispatch(
          uploadImageFile({
            file,
            folder: "rnd",
          })
        ).unwrap();
        uploadedFileNames.push(result.fileName);
      } catch (error) {
        await Swal.fire({
          title: "오류",
          text: `이미지 업로드에 실패했습니다: ${error.message}`,
          icon: "error",
        });
      }
    }

    if (index !== null) {
      // 기존 제품 이미지 배열에 추가
      if (productType === "leakDetection") {
        const newLeakDetection = [...editData.leakDetection];
        newLeakDetection[index] = {
          ...newLeakDetection[index],
          images: [
            ...(newLeakDetection[index].images || []),
            ...uploadedFileNames,
          ],
        };
        setEditData({
          ...editData,
          leakDetection: newLeakDetection,
        });
        // 누출탐지센서 업로드 후 콘솔
        // console.log(
        //   "[누출탐지센서] 업로드 후 images:",
        //   newLeakDetection[index].images
        // );
      } else {
        const newBoardProducts = [...editData.boardProducts];
        newBoardProducts[index] = {
          ...newBoardProducts[index],
          images: [
            ...(newBoardProducts[index].images || []),
            ...uploadedFileNames,
          ],
        };
        setEditData({
          ...editData,
          boardProducts: newBoardProducts,
        });
        // 보드제품 업로드 후 콘솔
        // console.log(
        //   "[보드제품] 업로드 후 images:",
        //   newBoardProducts[index].images
        // );
      }
    } else {
      // 새 제품 이미지 배열에 추가
      setNewProduct({
        ...newProduct,
        images: [...(newProduct.images || []), ...uploadedFileNames],
      });
    }

    // imageUrls.rnd의 키 전체 출력
    const state = window.store?.getState ? window.store.getState() : null;
    if (state && state.images && state.images.urls && state.images.urls.rnd) {
      // console.log(
      //   "[imageUrls.rnd의 모든 키]",
      //   Object.keys(state.images.urls.rnd)
      // );
    }
    // 전체 editData.boardProducts, editData.leakDetection의 images 배열 출력
    // console.log(
    //   "[전체 boardProducts images]",
    //   editData.boardProducts.map((b) => b.images)
    // );
    // console.log(
    //   "[전체 leakDetection images]",
    //   editData.leakDetection.map((l) => l.images)
    // );

    await Swal.fire({
      title: "성공",
      text: "이미지가 업로드되었습니다.",
      icon: "success",
    });
  };

  // 이미지 배열에서 개별 삭제
  const handleImageDelete = async (
    productType,
    index,
    fileName,
    imageIdx = null
  ) => {
    if (!fileName) return;

    try {
      const result = await Swal.fire({
        title: "이미지 삭제",
        text: "이미지를 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      });

      if (result.isConfirmed) {
        await dispatch(
          deleteImageFile({
            folder: "rnd",
            fileName: fileName,
          })
        ).unwrap();

        if (index !== null) {
          if (productType === "leakDetection") {
            const newLeakDetection = [...editData.leakDetection];
            const newImages = [...(newLeakDetection[index].images || [])];
            if (imageIdx !== null) newImages.splice(imageIdx, 1);
            newLeakDetection[index] = {
              ...newLeakDetection[index],
              images: newImages,
            };
            setEditData({
              ...editData,
              leakDetection: newLeakDetection,
            });
          } else {
            const newBoardProducts = [...editData.boardProducts];
            const newImages = [...(newBoardProducts[index].images || [])];
            if (imageIdx !== null) newImages.splice(imageIdx, 1);
            newBoardProducts[index] = {
              ...newBoardProducts[index],
              images: newImages,
            };
            setEditData({
              ...editData,
              boardProducts: newBoardProducts,
            });
          }
        } else {
          // 새 제품 폼에서 삭제 (leakDetection만 해당)
          const newImages = [...(newProduct.images || [])];
          if (imageIdx !== null) newImages.splice(imageIdx, 1);
          setNewProduct({
            ...newProduct,
            images: newImages,
          });
        }

        await Swal.fire({
          title: "성공",
          text: "이미지가 삭제되었습니다.",
          icon: "success",
        });
      }
    } catch (error) {
      await Swal.fire({
        title: "오류",
        text: "이미지 삭제에 실패했습니다: " + error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="rnd-form">
      <button className="add-button" onClick={() => setShowNewForm(true)}>
        새 제품 추가
      </button>

      {showNewForm && (
        <div className="form-section new-product">
          <div className="item-header">
            <h4>새 제품</h4>
            <button
              className="delete-button"
              onClick={() => setShowNewForm(false)}
            >
              취소
            </button>
          </div>
          <div className="input-group">
            <label>제품 종류</label>
            <select
              value={newProduct.type}
              onChange={(e) => handleUpdateNewProduct("type", e.target.value)}
            >
              <option value="leakDetection">누출탐지센서</option>
              <option value="boardProduct">보드제품</option>
            </select>
          </div>
          <div className="input-group">
            <label>제품명</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => handleUpdateNewProduct("name", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>제품 ID</label>
            <input
              type="text"
              value={newProduct.id}
              onChange={(e) => handleUpdateNewProduct("id", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>출시예정</label>
            <input
              type="text"
              value={newProduct.releaseDate}
              onChange={(e) =>
                handleUpdateNewProduct("releaseDate", e.target.value)
              }
            />
          </div>
          <div className="input-group">
            <label>제품 설명</label>
            <textarea
              value={newProduct.features.description}
              onChange={(e) =>
                handleUpdateNewProduct("description", e.target.value)
              }
            />
          </div>
          <div className="input-group">
            <label>제품 이미지</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, newProduct.type)}
            />
            {Array.isArray(newProduct.images) &&
              newProduct.images.length > 0 && (
                <div className="image-preview-multi">
                  {newProduct.images.map((img, idx) => (
                    <div key={idx} className="image-preview-item">
                      <img
                        src={imageUrls?.rnd?.[`rnd/${img}`]}
                        alt="제품 이미지"
                      />
                      <button
                        className="delete-button"
                        onClick={() =>
                          handleImageDelete(newProduct.type, null, img, idx)
                        }
                      >
                        이미지 삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </div>
          <button className="submit-button" onClick={handleAddProduct}>
            추가하기
          </button>
        </div>
      )}

      <div className="form-section">
        <h3>누출탐지센서</h3>
        {editData.leakDetection.map((item, index) => (
          <div key={index} className="form-item">
            <div className="item-header">
              <h4>{item.name || "새 제품"}</h4>
              <button
                className="delete-button"
                onClick={() => handleDeleteLeakDetection(index)}
              >
                "{item.name || "이 제품"}" 삭제
              </button>
            </div>
            <div className="input-group">
              <label>제품명</label>
              <input
                type="text"
                value={item.name || ""}
                onChange={(e) =>
                  handleUpdateLeakDetection(index, "name", e.target.value)
                }
              />
            </div>
            <div className="input-group">
              <label>제품 ID</label>
              <input
                type="text"
                value={item.id || ""}
                onChange={(e) =>
                  handleUpdateLeakDetection(index, "id", e.target.value)
                }
              />
            </div>
            <div className="input-group">
              <label>출시예정</label>
              <input
                type="text"
                value={item.releaseDate || ""}
                onChange={(e) =>
                  handleUpdateLeakDetection(
                    index,
                    "releaseDate",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="input-group">
              <label>제품 설명</label>
              <textarea
                value={item.features?.description?.join("\n") || ""}
                onChange={(e) =>
                  handleUpdateLeakDetection(
                    index,
                    "description",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="input-group">
              <label>제품 이미지</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, "leakDetection", index)}
              />
              {Array.isArray(item.images) && item.images.length > 0 && (
                <div className="image-preview-multi">
                  {item.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="image-preview-item">
                      <img
                        src={imageUrls?.rnd?.[`rnd/${img}`]}
                        alt="제품 이미지"
                      />
                      <button
                        className="delete-button"
                        onClick={() =>
                          handleImageDelete("leakDetection", index, img, imgIdx)
                        }
                      >
                        이미지 삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>보드제품</h3>
        {editData.boardProducts.map((item, index) => (
          <div key={index} className="form-item">
            <div className="item-header">
              <h4>{item.name || "새 제품"}</h4>
              <button
                className="delete-button"
                onClick={() => handleDeleteBoardProduct(index)}
              >
                "{item.name || "이 제품"}" 삭제
              </button>
            </div>
            <div className="input-group">
              <label>제품명</label>
              <input
                type="text"
                value={item.name || ""}
                onChange={(e) =>
                  handleUpdateBoardProduct(index, "name", e.target.value)
                }
              />
            </div>
            <div className="input-group">
              <label>제품 ID</label>
              <input
                type="text"
                value={item.id || ""}
                onChange={(e) =>
                  handleUpdateBoardProduct(index, "id", e.target.value)
                }
              />
            </div>
            <div className="input-group">
              <label>출시예정</label>
              <input
                type="text"
                value={item.releaseDate || ""}
                onChange={(e) =>
                  handleUpdateBoardProduct(index, "releaseDate", e.target.value)
                }
              />
            </div>
            <div className="input-group">
              <label>제품 설명</label>
              <textarea
                value={item.features?.description || ""}
                onChange={(e) =>
                  handleUpdateBoardProduct(index, "description", e.target.value)
                }
              />
            </div>
            <div className="input-group">
              <label>제품 이미지</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, "boardProduct", index)}
              />
              {Array.isArray(item.images) && item.images.length > 0 && (
                <div className="image-preview-multi">
                  {item.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="image-preview-item">
                      <img
                        src={imageUrls?.rnd?.[`rnd/${img}`]}
                        alt="제품 이미지"
                      />
                      <button
                        className="delete-button"
                        onClick={() =>
                          handleImageDelete("boardProduct", index, img, imgIdx)
                        }
                      >
                        이미지 삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RnDForm;
