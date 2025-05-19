import React from "react";
import Community from "../../components/Community";
// import "../../styles/pages/_qna.scss";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
function Faq(props) {
  return (
    <div className="">
      <div>
        <h1 className="font-semibold text-3xl">FAQ</h1>
      </div>
      <div>
        <Search />
      </div>
      <div></div>
      <div>
        {" "}
        <Pagination />
      </div>
    </div>
  );
}

export default Faq;
