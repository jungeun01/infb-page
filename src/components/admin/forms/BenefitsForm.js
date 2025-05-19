import React from "react";
import "../../../styles/components/admin/forms/_benefitsForm.scss";

const BenefitsForm = ({ editData, setEditData }) => {
  if (!editData?.benefits) {
    setEditData({
      ...editData,
      benefits: [],
    });
    return null;
  }

  const handleAddBenefit = () => {
    setEditData({
      ...editData,
      benefits: [...editData.benefits, { title: "", description: "" }],
    });
  };

  return (
    <div className="benefits-form">
      <div className="form-group">
        <div className="header">
          <label>복리후생 관리</label>
          <button
            type="button"
            className="add-button"
            onClick={handleAddBenefit}
          >
            새 복리후생 추가
          </button>
        </div>
        <div className="benefits-list">
          {editData.benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <div className="input-group">
                <input
                  type="text"
                  value={benefit.title || ""}
                  onChange={(e) => {
                    const newBenefits = [...editData.benefits];
                    newBenefits[index] = {
                      ...newBenefits[index],
                      title: e.target.value,
                    };
                    setEditData({
                      ...editData,
                      benefits: newBenefits,
                    });
                  }}
                  placeholder="복리후생 제목"
                />
                <textarea
                  value={benefit.description || ""}
                  onChange={(e) => {
                    const newBenefits = [...editData.benefits];
                    newBenefits[index] = {
                      ...newBenefits[index],
                      description: e.target.value,
                    };
                    setEditData({
                      ...editData,
                      benefits: newBenefits,
                    });
                  }}
                  placeholder="복리후생 설명"
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => {
                    const newBenefits = editData.benefits.filter(
                      (_, i) => i !== index
                    );
                    setEditData({
                      ...editData,
                      benefits: newBenefits,
                    });
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsForm;
