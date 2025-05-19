import React, { useState } from "react";
import "../../styles/pages/_settings.scss";

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: "회사명",
    siteDescription: "회사 설명",
    contactEmail: "contact@company.com",
    contactPhone: "02-1234-5678",
    address: "서울시 강남구",
    backupFrequency: "daily",
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 설정 저장 API 호출
    console.log("Settings saved:", settings);
  };

  return (
    <div className="settings">
      <h2>설정</h2>
      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <h3>기본 설정</h3>
          <div className="form-group">
            <label htmlFor="siteName">사이트 이름</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="siteDescription">사이트 설명</label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>연락처 정보</h3>
          <div className="form-group">
            <label htmlFor="contactEmail">이메일</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactPhone">전화번호</label>
            <input
              type="text"
              id="contactPhone"
              name="contactPhone"
              value={settings.contactPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">주소</label>
            <input
              type="text"
              id="address"
              name="address"
              value={settings.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>시스템 설정</h3>
          <div className="form-group">
            <label htmlFor="backupFrequency">백업 주기</label>
            <select
              id="backupFrequency"
              name="backupFrequency"
              value={settings.backupFrequency}
              onChange={handleChange}
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
            </select>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
              />
              유지보수 모드
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">
            설정 저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
