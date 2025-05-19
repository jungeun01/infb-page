import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import "../styles/components/_pagination.scss"; // 스타일 적용 (선택)
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
// const itemsPerPage = 10; // 한 페이지당 보여줄 아이템 수

const Pagination = ({ pageCount, onPageChange }) => {
  const handlePageClick = ({ selected }) => {
    onPageChange(selected);
  };

  return (
    <div>
      <ReactPaginate
        previousLabel={<MdOutlineKeyboardArrowLeft />}
        nextLabel={<MdKeyboardArrowRight />}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={6}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        pageClassName={"page-item"}
        previousClassName={"prev"}
        nextClassName={"next"}
      />
    </div>
  );
};

export default Pagination;
