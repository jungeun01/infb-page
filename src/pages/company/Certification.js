import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCertifications } from "../../store/slices/certificationsSlice";
import "../../styles/pages/_certification.scss";
import "../../styles/_typography.scss";
import icon_search from "../../resources/images/main/icon_search.png";
import { fetchImage } from "../API/firebase";

// 인증서 이미지 import
// import Corporate_Research_Institute_Certificate from "../../resources/images/certificate/Corporate_Research_Institute_Certificate.png";
// import Venture_Business_Certificate from "../../resources/images/certificate/Venture_Business_Certificate.png";
// import Software_Business_Registration_Certificate from "../../resources/images/certificate/Software_Business_Registration_Certificate.png";
// import SME_Confirmation_Certificate from "../../resources/images/certificate/SME_Confirmation_Certificate.png";
// import Direct_Production_Certification from "../../resources/images/certificate/Direct_Production_Certification.png";
// import Affiliated_Factory_Establishment_Certificate from "../../resources/images/certificate/Affiliated_Factory_Establishment_Certificate.png";
// import Promising_SME_Certificate from "../../resources/images/certificate/Promising_SME_Certificate.jpg";
// import Information_Communication_Construction_Registration from "../../resources/images/certificate/Information_Communication_Construction_Registration.jpg";
// import Innovative_Product_Designation_Certificate from "../../resources/images/certificate/Innovative_Product_Designation_Certificate.png";
// import testImage from "../../resources/images/certificate/testImage.jpg";

// 특허 이미지 import
// import patent001 from "../../resources/images/patent/patent-001.png";
// import patent002 from "../../resources/images/patent/patent-002.png";
// import patent003 from "../../resources/images/patent/patent-003.png";
// import patent004 from "../../resources/images/patent/patent-004.png";
// import patent005 from "../../resources/images/patent/patent-005.jpg";
// import patent006 from "../../resources/images/patent/patent-006.jpg";

// const certificationImages = {
//   "Corporate_Research_Institute_Certificate.png":
//     Corporate_Research_Institute_Certificate, // 기업부설연구소
//   "Venture_Business_Certificate.png": Venture_Business_Certificate, // 벤처기업확인서
//   "Software_Business_Registration_Certificate.png":
//     Software_Business_Registration_Certificate, // 소프트웨어사업자 신고확인서
//   "SME_Confirmation_Certificate.png": SME_Confirmation_Certificate, // 중소기업확인서
//   "Direct_Production_Certification.png": Direct_Production_Certification, // 직접생산확인증명서
//   "Affiliated_Factory_Establishment_Certificate.png":
//     Affiliated_Factory_Establishment_Certificate, //부설공장인증설립
//   "Promising_SME_Certificate.jpg": Promising_SME_Certificate, // 유망중소기업인증서
//   "Information_Communication_Construction_Registration.jpg":
//     Information_Communication_Construction_Registration, // 정보통신공사업등록증
//   "Innovative_Product_Designation_Certificate.png":
//     Innovative_Product_Designation_Certificate, //혁신제품 지정 인증서
//   // "testImage.jpg": testImage,
// };

// const patentImages = {
//   "patent-001.png": patent001,
//   "patent-002.png": patent002,
//   "patent-003.png": patent003,
//   "patent-004.png": patent004,
//   "patent-005.jpg": patent005,
//   "patent-006.jpg": patent006,
// };

const Certification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("certification");
  const [imageUrls, setImageUrls] = useState({});

  const dispatch = useDispatch();
  const { certifications: certData, status } = useSelector(
    (state) => state.certifications
  );

  useEffect(() => {
    dispatch(
      fetchCertifications({
        collectionName: "certifications",
        queryOptions: {},
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (!certData || !Array.isArray(certData) || certData.length === 0) return;
    const certificationData = certData[0];
    if (!certificationData?.company?.certifications?.items) return;

    const items = certificationData.company.certifications.items || [];
    const allImages = items.map((item) => ({
      type: item.type,
      filename: item.image,
    }));

    // 중복 제거
    const uniqueImages = Array.from(
      new Set(allImages.map((img) => img.type + "/" + img.filename))
    ).map((key) => {
      const [type, filename] = key.split("/");
      return { type, filename };
    });

    Promise.all(
      uniqueImages.map(async ({ type, filename }) => {
        if (!filename) return [filename, ""];
        let path = "";
        if (type === "certification") path = `certificate/${filename}`;
        else if (type === "patent") path = `patent/${filename}`;
        else return [filename, ""];
        try {
          const url = await fetchImage(path);
          return [filename, url];
        } catch (e) {
          return [filename, ""];
        }
      })
    ).then((entries) => {
      setImageUrls(Object.fromEntries(entries));
    });
  }, [certData]);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
    document.body.style.overflow = "unset";
  };

  if (status === "loading") {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (!certData || !Array.isArray(certData) || certData.length === 0) {
    return <div>인증서 및 특허 정보를 찾을 수 없습니다.</div>;
  }

  const certificationData = certData[0];
  if (!certificationData?.company?.certifications?.items) {
    return <div>데이터 구조가 올바르지 않습니다.</div>;
  }

  const items = certificationData.company.certifications.items || [];
  const certifications =
    items.filter((item) => item.type === "certification") || [];
  const patents = items.filter((item) => item.type === "patent") || [];

  return (
    <div className="certification">
      <div className="certification__container">
        <div className="certification__header">
          <h1 className="page-title">
            {certificationData?.company?.certifications?.title ||
              "인증 및 특허"}
          </h1>
          <p className="sub-title">
            {certificationData?.company?.certifications?.subtitle ||
              "INFOB의 기술력과 신뢰성을 인정받은 다양한 인증서와 특허입니다"}
          </p>
          <div className="intro">
            {certificationData?.company?.certifications?.intro?.map(
              (item, index) => (
                <p key={index} className="content-text">
                  {item}
                </p>
              )
            ) || []}
          </div>
        </div>

        <div className="certification__tabs">
          <button
            className={`certification__tab ${
              activeTab === "certification" ? "active" : ""
            }`}
            onClick={() => setActiveTab("certification")}
          >
            인증서
          </button>
          <button
            className={`certification__tab ${
              activeTab === "patent" ? "active" : ""
            }`}
            onClick={() => setActiveTab("patent")}
          >
            특허
          </button>
        </div>

        {activeTab === "certification" && (
          <section className="certification__section">
            <div className="certification__grid">
              {certifications.map((cert) => (
                <div key={cert.id} className="certification__card">
                  <div
                    className="certification__image"
                    onClick={() => openModal(imageUrls[cert.image])}
                  >
                    <img src={imageUrls[cert.image] || ""} alt={cert.title} />
                    <div className="certification__overlay">
                      <div className="certification__zoom">
                        <img
                          src={icon_search}
                          alt="확대보기"
                          className="certification__zoom-icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="certification__content">
                    <h3 className="sub-title">{cert.title}</h3>
                    <ul className="certification__description">
                      {cert.description?.map((item, index) => (
                        <li key={index} className="content-text">
                          {item}
                        </li>
                      )) || []}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "patent" && (
          <section className="certification__section">
            <div className="certification__grid">
              {patents.map((patent) => (
                <div key={patent.id} className="certification__card">
                  <div
                    className="certification__image"
                    onClick={() => openModal(imageUrls[patent.image])}
                  >
                    <img
                      src={imageUrls[patent.image] || ""}
                      alt={patent.title}
                    />
                    <div className="certification__overlay">
                      <div className="certification__zoom">
                        <img
                          src={icon_search}
                          alt="확대보기"
                          className="certification__zoom-icon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="certification__content">
                    <h3 className="sub-title">{patent.title}</h3>
                    <ul className="certification__description">
                      {patent.description?.map((item, index) => (
                        <li key={index} className="content-text">
                          {item}
                        </li>
                      )) || []}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {modalOpen && (
        <div className="certification__modal" onClick={closeModal}>
          <div className="certification__modal-content">
            <img src={selectedImage} alt="확대된 이미지" />
            <button className="certification__modal-close" onClick={closeModal}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certification;
