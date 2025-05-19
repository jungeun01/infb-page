import React from "react";
import "../../../styles/components/admin/forms/_solutionForm.scss";

const SolutionForm = ({ editData, setEditData }) => {
  if (!editData?.company?.business) {
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          si: { areas: [] },
          consulting: { areas: [] },
        },
      },
    });
    return null;
  }

  const handleAddSiArea = () => {
    const newArea = {
      title: "",
      items: [],
    };

    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          si: {
            ...editData.company.business.si,
            areas: [newArea, ...editData.company.business.si.areas],
          },
        },
      },
    });
  };

  const handleAddConsultingArea = () => {
    const newArea = {
      title: "",
      items: [],
    };

    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          consulting: {
            ...editData.company.business.consulting,
            areas: [newArea, ...editData.company.business.consulting.areas],
          },
        },
      },
    });
  };

  const handleUpdateSiArea = (index, field, value) => {
    const newAreas = [...editData.company.business.si.areas];
    if (field === "title") {
      newAreas[index] = {
        ...newAreas[index],
        title: value,
      };
    }
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          si: {
            ...editData.company.business.si,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleUpdateConsultingArea = (index, field, value) => {
    const newAreas = [...editData.company.business.consulting.areas];
    if (field === "title") {
      newAreas[index] = {
        ...newAreas[index],
        title: value,
      };
    }
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          consulting: {
            ...editData.company.business.consulting,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleDeleteSiArea = (index) => {
    const newAreas = editData.company.business.si.areas.filter(
      (_, i) => i !== index
    );
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          si: {
            ...editData.company.business.si,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleDeleteConsultingArea = (index) => {
    const newAreas = editData.company.business.consulting.areas.filter(
      (_, i) => i !== index
    );
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          consulting: {
            ...editData.company.business.consulting,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleAddSiItem = (areaIndex) => {
    const newAreas = [...editData.company.business.si.areas];
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      items: ["", ...newAreas[areaIndex].items],
    };
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          si: {
            ...editData.company.business.si,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleAddConsultingItem = (areaIndex) => {
    const newAreas = [...editData.company.business.consulting.areas];
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      items: ["", ...newAreas[areaIndex].items],
    };
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          consulting: {
            ...editData.company.business.consulting,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleUpdateSiItem = (areaIndex, itemIndex, value) => {
    const newAreas = [...editData.company.business.si.areas];
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      items: newAreas[areaIndex].items.map((item, idx) =>
        idx === itemIndex ? value : item
      ),
    };
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          si: {
            ...editData.company.business.si,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleUpdateConsultingItem = (areaIndex, itemIndex, value) => {
    const newAreas = [...editData.company.business.consulting.areas];
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      items: newAreas[areaIndex].items.map((item, idx) =>
        idx === itemIndex ? value : item
      ),
    };
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          consulting: {
            ...editData.company.business.consulting,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleDeleteSiItem = (areaIndex, itemIndex) => {
    const newAreas = [...editData.company.business.si.areas];
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      items: newAreas[areaIndex].items.filter((_, idx) => idx !== itemIndex),
    };
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          si: {
            ...editData.company.business.si,
            areas: newAreas,
          },
        },
      },
    });
  };

  const handleDeleteConsultingItem = (areaIndex, itemIndex) => {
    const newAreas = [...editData.company.business.consulting.areas];
    newAreas[areaIndex] = {
      ...newAreas[areaIndex],
      items: newAreas[areaIndex].items.filter((_, idx) => idx !== itemIndex),
    };
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        business: {
          ...editData.company.business,
          consulting: {
            ...editData.company.business.consulting,
            areas: newAreas,
          },
        },
      },
    });
  };

  return (
    <div className="solution-form">
      <div className="form-group">
        <div className="header">
          <label>SI 솔루션 관리</label>
          <button
            type="button"
            className="add-button"
            onClick={handleAddSiArea}
          >
            새 SI 영역 추가
          </button>
        </div>
        <div className="solutions-list">
          {editData.company.business.si.areas.map((area, areaIndex) => (
            <div key={areaIndex} className="solution-item">
              <div className="input-group">
                <div className="area-header">
                  <input
                    type="text"
                    value={area.title || ""}
                    onChange={(e) =>
                      handleUpdateSiArea(areaIndex, "title", e.target.value)
                    }
                    placeholder="영역명"
                  />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteSiArea(areaIndex)}
                  >
                    영역 삭제
                  </button>
                </div>
                <div className="items-list">
                  {area.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="item-input">
                      <input
                        type="text"
                        value={item || ""}
                        onChange={(e) =>
                          handleUpdateSiItem(
                            areaIndex,
                            itemIndex,
                            e.target.value
                          )
                        }
                        placeholder="항목 내용"
                      />
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDeleteSiItem(areaIndex, itemIndex)}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-button"
                    onClick={() => handleAddSiItem(areaIndex)}
                  >
                    항목 추가
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <div className="header">
          <label>컨설팅 솔루션 관리</label>
          <button
            type="button"
            className="add-button"
            onClick={handleAddConsultingArea}
          >
            새 컨설팅 영역 추가
          </button>
        </div>
        <div className="solutions-list">
          {editData.company.business.consulting.areas.map((area, areaIndex) => (
            <div key={areaIndex} className="solution-item">
              <div className="input-group">
                <div className="area-header">
                  <input
                    type="text"
                    value={area.title || ""}
                    onChange={(e) =>
                      handleUpdateConsultingArea(
                        areaIndex,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="영역명"
                  />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteConsultingArea(areaIndex)}
                  >
                    영역 삭제
                  </button>
                </div>
                <div className="items-list">
                  {area.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="item-input">
                      <input
                        type="text"
                        value={item || ""}
                        onChange={(e) =>
                          handleUpdateConsultingItem(
                            areaIndex,
                            itemIndex,
                            e.target.value
                          )
                        }
                        placeholder="항목 내용"
                      />
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDeleteConsultingItem(areaIndex, itemIndex)
                        }
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-button"
                    onClick={() => handleAddConsultingItem(areaIndex)}
                  >
                    항목 추가
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionForm;
