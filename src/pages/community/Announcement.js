import React, { useState } from "react";
import "../../styles/pages/_announcement.scss";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import NoticeList from "../notices/NoticeList";

function Announcement() {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm); // 검색어 상태 업데이트
  };
  return (
    <div className="recruitment-announcement">
      <div>
        <h1 className="text-3xl font-semibold">공지사항</h1>
        <p>인포비정보기술 공지사항입니다.</p>
      </div>
      <div>
        <Search onClick={handleSearch} />
      </div>
      <div>
        <NoticeList searchTerm={searchTerm} />
      </div>
      {/* <div>
        <Pagination />
      </div> */}
    </div>
  );
}

export default Announcement;
