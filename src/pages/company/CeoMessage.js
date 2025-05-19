import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBasicInfo } from "../../store/slices/basicInfoSlice";
import "../../styles/pages/_ceoMessage.scss";

import "../../styles/_typography.scss";
import ceoImage from "../../resources/images/main/CEO-removebg-preview.png";

const CeoMessage = () => {
  const dispatch = useDispatch();
  const { basicInfo, status } = useSelector((state) => state.basicInfo);

  useEffect(() => {
    dispatch(fetchBasicInfo({ collectionName: "basicInfo", queryOptions: {} }));
  }, [dispatch]);

  if (status === "loading") {
    return <div className="description-text text-center py-8">Loading...</div>;
  }

  if (!basicInfo || !Array.isArray(basicInfo) || basicInfo.length === 0) {
    return (
      <div className="description-text text-center py-8">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  const basicData = basicInfo[0];
  if (!basicData?.company?.ceo) {
    return (
      <div className="description-text text-center py-8">
        CEO 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const { message, name, position, title } = basicData.company.ceo;

  return (
    <div className="ceo-message">
      <div className="ceo-message__container">
        <div className="ceo-message__content">
          <h1 className="page-title">CEO 인사말</h1>
          <div className="message content-text">
            {message?.content?.map((text, index) => (
              <p key={index} className="mb-4">
                {text}
              </p>
            ))}
          </div>
          <div className="signature mt-8">
            <div className="position sub-title">{position || "대표이사"}</div>
            <div className="name highlight-text text-xl font-bold">
              {name || "유 종 욱"}
            </div>
          </div>
        </div>
        <div className="ceo-message__image">
          <img src={ceoImage} alt="CEO" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default CeoMessage;
