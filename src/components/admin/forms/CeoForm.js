import React from "react";
import "../../../styles/components/admin/forms/_ceoForm.scss";

const CeoForm = ({ editData, setEditData }) => {
  return (
    <div className="ceo-form">
      <div className="form-group">
        <label>제목</label>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>내용</label>
        {editData.content.map((text, index) => (
          <div key={index} className="content-item">
            <textarea
              value={text}
              onChange={(e) => {
                const newContent = [...editData.content];
                newContent[index] = e.target.value;
                setEditData({ ...editData, content: newContent });
              }}
            />
            <button
              type="button"
              className="delete-button"
              onClick={() => {
                const newContent = editData.content.filter(
                  (_, i) => i !== index
                );
                setEditData({ ...editData, content: newContent });
              }}
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-button"
          onClick={() => {
            setEditData({
              ...editData,
              content: [...editData.content, ""],
            });
          }}
        >
          문단 추가
        </button>
      </div>
      <div className="form-group">
        <label>대표이사 이름</label>
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>직책</label>
        <input
          type="text"
          value={editData.position}
          onChange={(e) =>
            setEditData({ ...editData, position: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default CeoForm;
