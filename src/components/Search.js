import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../styles/components/_search.scss";

function Search({ onClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchClick = () => {
    if (onClick) {
      onClick(searchTerm); // 전달받은 onClick 함수 호출
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (onClick) {
        onClick(searchTerm); // onClick을 제대로 호출하도록 수정
      }
    }
  };
  return (
    <div className="search-main">
      <div className="search">
        <input
          placeholder="검색어를 입력해주세요."
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearchClick}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

export default Search;
