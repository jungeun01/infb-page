import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBasicInfo } from "../../store/slices/basicInfoSlice";
import "../../styles/pages/_location.scss";
import "../../styles/_typography.scss";
import KakaoMap from "../../components/KaKaoMap";

function Location() {
  const dispatch = useDispatch();
  const { basicInfo, status } = useSelector((state) => state.basicInfo);

  useEffect(() => {
    dispatch(fetchBasicInfo({ collectionName: "basicInfo", queryOptions: {} }));
  }, [dispatch]);

  if (status === "loading") {
    return <div className="content-text">데이터를 불러오는 중입니다...</div>;
  }

  if (!basicInfo || !Array.isArray(basicInfo) || basicInfo.length === 0) {
    return <div className="content-text">위치 정보를 찾을 수 없습니다.</div>;
  }

  const basicData = basicInfo[0];
  if (!basicData?.company?.address || !basicData?.company?.contact) {
    return (
      <div className="content-text">주소 또는 연락처 정보가 없습니다.</div>
    );
  }

  const { address, contact } = basicData.company;

  return (
    <div className="location-page">
      <div className="page-header">
        <h1 className="page-title">오시는 길</h1>
        <p className="sub-title">INFOB을 방문해주셔서 감사합니다</p>
      </div>

      <div className="map-container">
        <KakaoMap />
      </div>

      <div className="location-info">
        <div className="address">
          <h3 className="sub-title">주소</h3>
          <p className="content-text">{address.main}</p>
          {/* {address.old && (
            <p className="old-address">
              <small>(구주소: {address.old})</small>
            </p>
          )} */}
        </div>
        <div className="contact">
          <h3 className="sub-title">연락처</h3>
          <p className="content-text">
            Tel : {contact.tel} | Fax : {contact.fax}
          </p>
        </div>
        <div className="copyright">
          <p className="meta-text">
            © {new Date().getFullYear()} INFOB. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Location;
