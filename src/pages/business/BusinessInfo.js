import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusiness } from "../../store/slices/businessSlice";
import "../../styles/pages/_businessInfo.scss";
import "../../styles/_typography.scss";
import {
  FaChartLine,
  FaServer,
  FaUserCog,
  FaHeadset,
  FaShieldAlt,
  FaBriefcase,
  FaLightbulb,
  FaCubes,
} from "react-icons/fa";

const icons = {
  "SI Consulting": <FaChartLine />,
  "SW/HW 판매 관리": <FaServer />,
  "System 구축": <FaUserCog />,
  "기술 지원": <FaHeadset />,
  "Solution Consulting": <FaLightbulb />,
  "Specialization Consulting": <FaShieldAlt />,
  "Business Consulting": <FaBriefcase />,
  default: <FaCubes />,
};

const getIcon = (title) => {
  return icons[title] || icons.default;
};

const BusinessInfo = () => {
  const [activeTab, setActiveTab] = useState("SI");
  const dispatch = useDispatch();
  const { business, status } = useSelector((state) => state.business);

  useEffect(() => {
    dispatch(fetchBusiness({ collectionName: "business", queryOptions: {} }));
  }, [dispatch]);

  if (status === "loading") {
    return <div className="content-text">데이터를 불러오는 중입니다...</div>;
  }

  if (!business || !Array.isArray(business) || business.length === 0) {
    return <div className="content-text">사업 정보를 찾을 수 없습니다.</div>;
  }

  const businessData = business[0];
  if (
    !businessData?.company?.business?.si ||
    !businessData?.company?.business?.consulting
  ) {
    return (
      <div className="content-text">사업 데이터 구조가 올바르지 않습니다.</div>
    );
  }

  const { si, consulting } = businessData.company.business;

  return (
    <div className="business-info">
      <div className="business-info__intro">
        <div className="business-info__intro-content">
          <div className="business-info__intro-title">
            <h1 className="page-title">
              {/* <span className="highlight-text">사업분야</span> */}
              <span className="main-text">Consulting, SI</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="business-info__tabs">
        <button
          className={`tab-button ${activeTab === "SI" ? "active" : ""}`}
          onClick={() => setActiveTab("SI")}
        >
          SI
        </button>
        <button
          className={`tab-button ${activeTab === "Consulting" ? "active" : ""}`}
          onClick={() => setActiveTab("Consulting")}
        >
          Consulting
        </button>
      </div>

      <div className="business-info__cards">
        {activeTab === "SI" ? (
          <div className="business-info__card-grid si-grid">
            {si.areas.map((area) => (
              <div key={area.title} className="business-info__card">
                <div className="card-icon">{getIcon(area.title)}</div>
                <h3 className="sub-title">{area.title}</h3>
                <ul>
                  {area.items.map((item, itemIndex) => (
                    <li
                      key={`${area.title}-${itemIndex}`}
                      className="content-text"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="business-info__card-grid consulting-grid">
            {consulting.areas.map((area) => (
              <div key={area.title} className="business-info__card">
                <div className="card-icon">{getIcon(area.title)}</div>
                <h3 className="sub-title">{area.title}</h3>
                <ul>
                  {area.items.map((item, itemIndex) => (
                    <li
                      key={`${area.title}-${itemIndex}`}
                      className="content-text"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInfo;
