import React from "react";
import "../../../styles/components/admin/forms/_recruitmentForm.scss";

const RecruitmentForm = ({ editData, setEditData }) => {
  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        talent: {
          ...prev.company?.talent,
          [field]: value,
        },
      },
    }));
  };

  const handleBenefitsChange = (index, field, value) => {
    const updatedBenefits = [
      ...(editData.company?.talent?.benefits?.items || []),
    ];
    updatedBenefits[index] = {
      ...updatedBenefits[index],
      [field]: value,
    };

    setEditData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        talent: {
          ...prev.company?.talent,
          benefits: {
            ...prev.company?.talent?.benefits,
            items: updatedBenefits,
          },
        },
      },
    }));
  };

  const handleDetailsChange = (benefitIndex, detailIndex, value) => {
    const updatedBenefits = [
      ...(editData.company?.talent?.benefits?.items || []),
    ];
    const updatedDetails = [...updatedBenefits[benefitIndex].details];
    updatedDetails[detailIndex] = value;

    updatedBenefits[benefitIndex] = {
      ...updatedBenefits[benefitIndex],
      details: updatedDetails,
    };

    setEditData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        talent: {
          ...prev.company?.talent,
          benefits: {
            ...prev.company?.talent?.benefits,
            items: updatedBenefits,
          },
        },
      },
    }));
  };

  const addBenefit = () => {
    setEditData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        talent: {
          ...prev.company?.talent,
          benefits: {
            ...prev.company?.talent?.benefits,
            items: [
              ...(prev.company?.talent?.benefits?.items || []),
              { name: "", icon: "", details: [""] },
            ],
          },
        },
      },
    }));
  };

  const removeBenefit = (index) => {
    const updatedBenefits = [
      ...(editData.company?.talent?.benefits?.items || []),
    ];
    updatedBenefits.splice(index, 1);

    setEditData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        talent: {
          ...prev.company?.talent,
          benefits: {
            ...prev.company?.talent?.benefits,
            items: updatedBenefits,
          },
        },
      },
    }));
  };

  const addDetail = (benefitIndex) => {
    const updatedBenefits = [
      ...(editData.company?.talent?.benefits?.items || []),
    ];
    updatedBenefits[benefitIndex].details.push("");

    setEditData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        talent: {
          ...prev.company?.talent,
          benefits: {
            ...prev.company?.talent?.benefits,
            items: updatedBenefits,
          },
        },
      },
    }));
  };

  const removeDetail = (benefitIndex, detailIndex) => {
    const updatedBenefits = [
      ...(editData.company?.talent?.benefits?.items || []),
    ];
    updatedBenefits[benefitIndex].details.splice(detailIndex, 1);

    setEditData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        talent: {
          ...prev.company?.talent,
          benefits: {
            ...prev.company?.talent?.benefits,
            items: updatedBenefits,
          },
        },
      },
    }));
  };

  return (
    <div className="recruitment-form">
      <div className="form-section">
        <div className="input-group">
          <label htmlFor="title">인재상 제목</label>
          <input
            id="title"
            type="text"
            value={editData.company?.talent?.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="인재상 제목을 입력하세요"
          />
        </div>

        <div className="input-group">
          <label htmlFor="subtitle">부제목</label>
          <input
            id="subtitle"
            type="text"
            value={editData.company?.talent?.subtitle || ""}
            onChange={(e) => handleInputChange("subtitle", e.target.value)}
            placeholder="부제목을 입력하세요"
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            value={editData.company?.talent?.description?.join("\n") || ""}
            onChange={(e) =>
              handleInputChange(
                "description",
                e.target.value.split("\n").filter((line) => line.trim())
              )
            }
            placeholder="설명을 입력하세요 (여러 줄 입력 가능)"
            rows={5}
          />
        </div>

        <div className="input-group">
          <label htmlFor="recruitmentUrl">채용공고 URL</label>
          <input
            id="recruitmentUrl"
            type="text"
            value={editData.company?.talent?.recruitmentUrl || ""}
            onChange={(e) =>
              handleInputChange("recruitmentUrl", e.target.value)
            }
            placeholder="채용공고 URL을 입력하세요"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>복리후생</h3>
        <button type="button" className="add-button" onClick={addBenefit}>
          복리후생 항목 추가
        </button>

        {editData.company?.talent?.benefits?.items?.map(
          (benefit, benefitIndex) => (
            <div key={benefitIndex} className="benefit-item">
              <div className="benefit-header">
                <div className="input-group">
                  <label htmlFor={`benefit-name-${benefitIndex}`}>
                    복리후생 이름
                  </label>
                  <input
                    id={`benefit-name-${benefitIndex}`}
                    type="text"
                    value={benefit.name}
                    onChange={(e) =>
                      handleBenefitsChange(benefitIndex, "name", e.target.value)
                    }
                    placeholder="복리후생 이름을 입력하세요"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor={`benefit-icon-${benefitIndex}`}>
                    아이콘 파일명
                  </label>
                  <input
                    id={`benefit-icon-${benefitIndex}`}
                    type="text"
                    value={benefit.icon}
                    onChange={(e) =>
                      handleBenefitsChange(benefitIndex, "icon", e.target.value)
                    }
                    placeholder="아이콘 파일명을 입력하세요 (예: time.png)"
                  />
                </div>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeBenefit(benefitIndex)}
                >
                  삭제
                </button>
              </div>

              <div className="details-section">
                <label>상세 내용</label>
                {benefit.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="detail-item">
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) =>
                        handleDetailsChange(
                          benefitIndex,
                          detailIndex,
                          e.target.value
                        )
                      }
                      placeholder="상세 내용을 입력하세요"
                    />
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeDetail(benefitIndex, detailIndex)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-button"
                  onClick={() => addDetail(benefitIndex)}
                >
                  상세 내용 추가
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RecruitmentForm;
