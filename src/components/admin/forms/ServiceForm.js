import React from "react";
import "../../../styles/components/admin/forms/_serviceForm.scss";

const ServiceForm = ({ editData, setEditData }) => {
  if (!editData?.company?.about?.services) {
    setEditData({
      ...editData,
      company: {
        ...editData.company,
        about: {
          ...editData.company?.about,
          services: [],
        },
      },
    });
    return null;
  }

  const handleAddService = () => {
    const newService = {
      title: "",
      description: "",
      imageClass: "",
    };

    setEditData({
      ...editData,
      company: {
        ...editData.company,
        about: {
          ...editData.company.about,
          services: [...editData.company.about.services, newService],
        },
      },
    });
  };

  return (
    <div className="service-form">
      <div className="form-group">
        <div className="header">
          <label>서비스 관리</label>
          <button
            type="button"
            className="add-button"
            onClick={handleAddService}
          >
            새 서비스 추가
          </button>
        </div>
        <div className="services-list">
          {editData.company.about.services.map((service, index) => (
            <div key={index} className="service-item">
              <div className="input-group">
                <input
                  type="text"
                  value={service.title || ""}
                  onChange={(e) => {
                    const newServices = [...editData.company.about.services];
                    newServices[index] = {
                      ...newServices[index],
                      title: e.target.value,
                    };
                    setEditData({
                      ...editData,
                      company: {
                        ...editData.company,
                        about: {
                          ...editData.company.about,
                          services: newServices,
                        },
                      },
                    });
                  }}
                  placeholder="서비스명"
                />
                <textarea
                  value={service.description || ""}
                  onChange={(e) => {
                    const newServices = [...editData.company.about.services];
                    newServices[index] = {
                      ...newServices[index],
                      description: e.target.value,
                    };
                    setEditData({
                      ...editData,
                      company: {
                        ...editData.company,
                        about: {
                          ...editData.company.about,
                          services: newServices,
                        },
                      },
                    });
                  }}
                  placeholder="서비스 설명"
                />
                <input
                  type="text"
                  value={service.imageClass || ""}
                  onChange={(e) => {
                    const newServices = [...editData.company.about.services];
                    newServices[index] = {
                      ...newServices[index],
                      imageClass: e.target.value,
                    };
                    setEditData({
                      ...editData,
                      company: {
                        ...editData.company,
                        about: {
                          ...editData.company.about,
                          services: newServices,
                        },
                      },
                    });
                  }}
                  placeholder="이미지 클래스 (예: box1)"
                />
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => {
                    const newServices = editData.company.about.services.filter(
                      (_, i) => i !== index
                    );
                    setEditData({
                      ...editData,
                      company: {
                        ...editData.company,
                        about: {
                          ...editData.company.about,
                          services: newServices,
                        },
                      },
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

export default ServiceForm;
