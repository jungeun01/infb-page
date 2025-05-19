import React, { useState } from "react";
import "../../styles/pages/_post.scss";
// import { FaSearch } from "react-icons/fa";
import Community from "../../components/Community";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";

function Post() {
  const [search, setSearch] = useState("");

  const handleSearchClick = (searchTerm) => {
    setSearch(searchTerm);
  };
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/community/inquiry");
  };
  return (
    <div className="xl:max-w-7xl m-auto p-auto">
      <div>
        <h1 className="mt-10 xl:text-3xl font-semibold mt-20">게시판</h1>
        <p className=" text-sm xl:text-xl">인포비정보기술 게시판입니다.</p>
      </div>
      <div>
        <Search onClick={handleSearchClick} />
      </div>
      <div>
        <Community search={search} />
      </div>
      <div className="flex justify-end">
        <button
          className="bg-[#f6f6f6] py-2 px-4 rounded-md hover:bg-gray-200"
          onClick={handleClick}
        >
          문의하기
        </button>
      </div>
      <div>
        {/* <div>
          <Pagination />
        </div> */}
      </div>
    </div>
  );
}

export default Post;
