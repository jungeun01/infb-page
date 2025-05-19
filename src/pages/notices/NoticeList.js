import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotices, updateNotice } from "../../store/slices/noticesSlice";
// import "../../styles/components/_noticeList.scss";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination"; // Pagination 컴포넌트 추가
import "../../styles/_typography.scss";

const itemsPerPage = 10; // 한 페이지에 보여줄 공지사항 수
const NoticeList = ({ searchTerm }) => {
  const dispatch = useDispatch();
  const notices = useSelector((state) => state.notices.notices);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [filteredNotices, setFilteredNotices] = useState(notices);
  useEffect(() => {
    dispatch(fetchNotices({ collectionName: "notices", queryOptions: {} }));
  }, [dispatch]);

  // 검색어가 변경될 때마다 공지사항 필터링
  useEffect(() => {
    const filtered = notices.filter(
      (notice) =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotices(filtered);
  }, [notices, searchTerm]);
  // 공개된 공지사항만 필터링
  const publicNotices = filteredNotices.filter(
    (notice) => notice.check === true
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    try {
      let date;
      if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        return "-";
      }

      if (isNaN(date.getTime())) return "-";

      return date.toLocaleDateString();
    } catch (error) {
      console.error("Date formatting error:", error);
      return "-";
    }
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = publicNotices.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에 해당하는 데이터

  const pageCount = Math.ceil(publicNotices.length / itemsPerPage); // 총 페이지 수
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage); // 페이지 변경
  };
  const handleNoticeClick = async (noticeId) => {
    try {
      const clickedNotice = notices.find((notice) => notice.docId === noticeId);
      if (!clickedNotice) return;

      const currentViews = clickedNotice.views || 0;

      // 조회수 업데이트를 Redux 액션으로 변경
      await dispatch(
        updateNotice({
          collectionName: "notices",
          docId: noticeId,
          data: { views: currentViews + 1 },
        })
      ).unwrap();

      // 상세 페이지로 이동
      navigate(`/notice/detail/${noticeId}`);
    } catch (error) {
      console.error("조회수 업데이트 실패:", error);
    }
  };

  return (
    <div className="notice-list">
      {/* 게시글 리스트 헤더 */}
      <div className="flex border border-[#f9f9f9] py-4 bg-gray-100 justify-center items-center">
        <div className="w-1/12 xl:w-1/12">
          <p className="table-header border-r border-gray-300 m-0">번호</p>
        </div>
        <div className="w-4/12 xl:w-6/12">
          <p className="table-header border-r border-gray-300 m-0">제목</p>
        </div>
        <div className="w-2/12 xl:w-2/12">
          <p className="table-header border-r border-gray-300 m-0">등록자명</p>
        </div>
        <div className="w-3/12 xl:w-2/12">
          <p className="table-header border-r border-gray-300 m-0">등록일</p>
        </div>
        <div className="w-2/12 xl:w-1/12">
          <p className="table-header m-0">조회수</p>
        </div>
      </div>

      {/* 게시글이 없을 경우 */}
      {publicNotices.length === 0 ? (
        <div className="description-text text-center py-8">
          등록된 게시글이 없습니다.
        </div>
      ) : (
        // 공지사항 목록 렌더링
        publicNotices.map((notice, index) => (
          <div
            key={notice.docId}
            className="flex border-gray-300 border-b py-3"
          >
            <div className="w-1/12 xl:w-1/12 table-cell">{index + 1}</div>
            <div className="w-4/12 flex flex-col xl:w-6/12 gap-2 pl-3">
              <button
                onClick={() => handleNoticeClick(notice.docId)}
                className="block truncate text-left max-w-full content-text hover:text-primary-teal transition-colors"
              >
                {notice.title}
              </button>
            </div>
            <div className="w-2/12 xl:w-2/12 table-cell">
              {notice.authorName || "관리자"}
            </div>
            <div className="w-3/12 xl:w-2/12 table-cell">
              {formatDate(notice.createdAt)}
            </div>
            <div className="w-2/12 xl:w-1/12 table-cell">
              {notice.views || 0}
            </div>
          </div>
        ))
      )}
      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
    </div>
  );
};

export default NoticeList;
