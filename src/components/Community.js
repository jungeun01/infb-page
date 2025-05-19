import React, { useEffect, useState } from "react";
import { getDatas, updateDatas } from "../pages/API/firebase";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

function Community({ search }) {
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩
  const [selectedPostId, setSelectedPostId] = useState(null); // 선택된 게시글 ID
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const itemsPerPage = 10; // 한 페이지당 게시글 수
  const navigate = useNavigate(); // navigate 변수 선언
  // 게시글 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const queryOptions = {
          condition: [],
          orderBys: [{ field: "createdAt", direction: "desc" }],
          // limits: 10, // 예시로 10개의 게시글만 가져옴
        };
        const data = await getDatas("posts", queryOptions);
        setPosts(data);
      } catch (error) {
        console.error("게시글 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 게시글 클릭 시 조회수 업데이트 후 상세보기로 이동
  const handlePostClick = async (postId, visibility) => {
    try {
      // 비공개 글일 경우 비밀번호 확인
      if (visibility === "private") {
        setSelectedPostId(postId); // 선택된 게시글 ID 설정
        return; // 비밀번호 입력을 위해 클릭 후 아무 동작도 하지 않음
      }

      // 비공개가 아닐 경우 바로 상세 페이지로 이동
      navigate(`/community/inquiry/${postId}`);
    } catch (error) {
      console.error("조회수 업데이트 실패:", error);
    }
  };

  // 비밀번호 확인 후 상세 페이지로 이동
  const handlePasswordSubmit = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    const clickedPost = posts.find((post) => post.docId === selectedPostId);
    if (!clickedPost) return;

    // 비밀번호 검증
    if (clickedPost.password !== password) {
      alert("비밀번호가 틀렸습니다.");
      return;
    }

    // 조회수 업데이트
    const currentViews = clickedPost.views || 0;
    await updateDatas("posts", selectedPostId, {
      views: currentViews + 1,
    });

    // 비밀번호 초기화 후 이동
    setPassword("");
    setSelectedPostId(null);
    navigate(`/community/inquiry/${selectedPostId}`);
  };

  // 검색된 게시글 필터링
  const filteredPosts = posts.filter((post) =>
    (post.title || "").toLowerCase().includes((search || "").toLowerCase())
  );
  const offset = currentPage * itemsPerPage;
  const currentPagePosts = filteredPosts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredPosts.length / itemsPerPage);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="community">
      <div className="my-0 xl:my-6">
        {/* 게시글 리스트 헤더 */}
        <div className="flex text-sm  sm:text-sm md:text-xl xl:text-[18px] border border-[#f9f9f9] py-4 bg-gray-100 justify-center items-center">
          <div className="w-1/12 xl:w-1/12">
            <p className="border-r border-gray-300 m-0">번호</p>
          </div>
          <div className="w-4/12 xl:w-6/12">
            <p className="border-r border-gray-300 m-0">제목</p>
          </div>
          <div className="w-2/12 xl:w-2/12">
            <p className="border-r border-gray-300 m-0">등록자명</p>
          </div>
          <div className="w-3/12 xl:w-2/12">
            <p className="border-r border-gray-300 m-0 ">등록일</p>
          </div>
          <div className="w-2/12 xl:w-1/12">
            <p className="m-0">조회수</p>
          </div>
        </div>

        {/* 게시글이 없을 경우 */}
        {currentPagePosts.length === 0 ? (
          <div className=" flex border-b justify-center text-xl border-gray-200 py-4">
            No data.
          </div>
        ) : (
          // 필터링된 게시글 렌더링
          currentPagePosts.map((post, index) => (
            <div key={post.docId} className="border-b border-gray-200 ">
              {/* 게시글 정보 행 */}
              <div className=" flex  text-xs    sm:text-xs md:text-xl xl:text-[18px]  py-4 ">
                <div className="w-1/12 xl:w-1/12">
                  {filteredPosts.length - (currentPage * itemsPerPage + index)}
                </div>
                <div className="w-4/12 flex flex-col xl:w-6/12  gap-2 pl-3">
                  <div className="flex items-center">
                    <button
                      className="hover:text-blue-600 text-left "
                      onClick={() =>
                        handlePostClick(post.docId, post.visibility)
                      }
                    >
                      {post.title}
                    </button>
                  </div>

                  {/* 비밀번호 입력창 - 제목 아래 표시 */}
                  {selectedPostId === post.docId &&
                    post.visibility === "private" && (
                      <form
                        action=""
                        onSubmit={(e) => {
                          e.preventDefault(); // 폼 제출 시 새로고침 방지
                        }}
                      >
                        <div className="flex  xl:mt-2 ">
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            className="w-3/4  xl:border-b p-2  "
                          />
                          <button
                            onClick={handlePasswordSubmit}
                            className="w-1/4 text-[10px] ml xl:bg-blue-500 p-2 ml-2 rounded border hover:text-red-400"
                          >
                            확인
                          </button>
                        </div>
                      </form>
                    )}
                </div>
                <div className="w-2/12 xl:w-2/12">{post.authorName}</div>
                <div className="w-3/12 xl:w-2/12">
                  {new Date(post.createdAt?.toDate()).toLocaleDateString()}
                </div>
                <div className="w-2/12 xl:w-1/12">{post.views || 0}</div>
              </div>
            </div>
          ))
        )}
        {/* 페이지네이션 렌더링 */}
        <div className="flex justify-center mt-4">
          <Pagination pageCount={pageCount} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

export default Community;
