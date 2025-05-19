import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/components/_footer.scss";
import logo from "../resources/images/main/logo_t.png";
import { fetchBasicInfo } from "../store/slices/basicInfoSlice";
import { useDispatch, useSelector } from "react-redux";

function Footer() {
  const { basicInfo, status } = useSelector((state) => state.basicInfo);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBasicInfo({ collectionName: "basicInfo", queryOptions: {} }));
  }, [dispatch]);

  if (status === "loading") {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (!basicInfo || !Array.isArray(basicInfo) || basicInfo.length === 0) {
    return <div>주소 또는 연락처 정보가 없습니다.</div>;
  }

  const basicData = basicInfo[0];
  if (!basicData?.company?.address || !basicData?.company?.contact) {
    return <div>주소 또는 연락처 정보가 없습니다.</div>;
  }
  const { address, contact } = basicData.company;
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__logo">
          <img src={logo} alt="INFOB" />
        </div>
        <div className="footer__info">
          <div className="flex  flex-col">
            <div className="flex">
              <p>{address.old && <span>{address.old}</span>}</p>
              <p className="px-2">|</p>
              <p>
                Tel : {contact.tel} | Fax : {contact.fax}
              </p>
            </div>
            <div className="flex justify-center mt-2">
              <p>Copyright © 2024 INFOB Company. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
