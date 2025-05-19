// src/pages/admin/PostManagement.js
import React, { useEffect, useState } from "react";
import "../../styles/pages/_postManagement.scss";
import {
  deletePost,
  fetchPosts,
  fetchAnswers,
  createAnswer,
  updateAnswerThunk,
} from "../../store/slices/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import MyEditor from "../community/MyEditor";
import Pagination from "../../components/Pagination";

const PostManagement = () => {
  const posts = useSelector((state) => state.posts.posts);
  const answers = useSelector((state) => state.posts.answers);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [selectedPost, setSelectedPost] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const itemsPerPage = 10; // 한 페이지당 게시글 수

  // 페이지네이션을 위한 게시글 필터링
  const offset = currentPage * itemsPerPage;
  const currentPagePosts = posts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(posts.length / itemsPerPage);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    const queryOptions = {
      condition: [],
      orderBys: [{ field: "createdAt", direction: "desc" }],
    };
    dispatch(fetchPosts({ collectionName: "posts", queryOptions }));
  }, [dispatch]);

  // 게시글 목록이 로드되면 각 게시글의 답변 상태를 가져옴
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        dispatch(fetchAnswers(post.docId));
      });
    }
  }, [posts, dispatch]);

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

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "-";
    }
  };

  const handleReply = async (post) => {
    setSelectedPost(post);
    if (answers[post.docId]?.exists) {
      const existingAnswer = answers[post.docId].data[0];
      setReplyContent(existingAnswer.content);
    } else {
      setReplyContent("");
    }
    setShowReplyForm(true);
  };

  // HTML 태그 제거 함수 추가

  const handleSaveReply = async () => {
    try {
      const answerData = {
        content: replyContent, // HTML 형식 유지
        adminName: "관리자",
        contentType: "html", // 컨텐츠 타입 표시
      };

      const postAnswers = answers[selectedPost.docId];
      if (postAnswers?.exists) {
        const existingAnswer = postAnswers.data[0];
        await dispatch(
          updateAnswerThunk({
            postId: selectedPost.docId,
            answerId: existingAnswer.id,
            answerData,
          })
        ).unwrap();
      } else {
        await dispatch(
          createAnswer({
            postId: selectedPost.docId,
            answerData,
          })
        ).unwrap();
      }

      Swal.fire({
        title: "답변이 등록되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });

      setShowReplyForm(false);
      setSelectedPost(null);
      setReplyContent("");
    } catch (error) {
      console.error("답변 등록 실패:", error);
      Swal.fire({
        title: "답변 등록 실패",
        text: "답변 등록 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  const handleDelete = async (docId) => {
    try {
      const result = await Swal.fire({
        title: "게시글을 삭제하시겠습니까?",
        text: "삭제된 게시글은 복구할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      });

      if (result.isConfirmed) {
        await dispatch(deletePost({ collectionName: "posts", docId })).unwrap();
        Swal.fire({
          title: "삭제되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "삭제 실패",
        text: "게시글 삭제 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className="post-management">
      <div className="post-header">
        <h2>게시판 관리</h2>
      </div>
      {showReplyForm ? (
        <div className="post-reply-form">
          <h3>답변 작성</h3>
          <div className="post-info">
            <p>
              <strong>제목</strong>
              <span>{selectedPost.title}</span>
            </p>
            <p>
              <strong>작성자</strong>
              <span>
                {selectedPost.authorName} ({selectedPost.companyName})
              </span>
            </p>
            <p>
              <strong>연락처</strong>
              <span>{selectedPost.phoneNumber}</span>
            </p>
            <p>
              <strong>이메일</strong>
              <span>{selectedPost.email}</span>
            </p>
            <p>
              <strong>작성일</strong>
              <span>{formatDate(selectedPost.createdAt)}</span>
            </p>
            <p>
              <strong>내용</strong>
              <div
                className="post-content-html"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedPost.contentType === "html"
                      ? selectedPost.content
                      : `<p>${selectedPost.content}</p>`,
                }}
              />
            </p>
          </div>
          <div className="post-reply-editor">
            <MyEditor
              content={replyContent}
              setContent={setReplyContent}
              isEditing={true}
            />
          </div>
          <div className="post-button-group">
            <button
              className="post-cancel-btn"
              onClick={() => setShowReplyForm(false)}
            >
              취소
            </button>
            <button className="post-save-btn" onClick={handleSaveReply}>
              답변 등록
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="post-list">
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자/회사</th>
                  <th>연락처</th>
                  <th>작성일</th>
                  <th>답변상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {currentPagePosts && currentPagePosts.length > 0 ? (
                  currentPagePosts.map((post, index) => (
                    <tr key={post.docId}>
                      <td>
                        {posts.length - (currentPage * itemsPerPage + index)}
                      </td>
                      <td>{post.title}</td>
                      <td>
                        {post.authorName}
                        <br />
                        <small>{post.companyName}</small>
                      </td>
                      <td>
                        {post.phoneNumber}
                        <br />
                        <small>{post.email}</small>
                      </td>
                      <td>{formatDate(post.createdAt)}</td>
                      <td className="post-status-cell">
                        <span
                          className={`post-status ${
                            answers[post.docId]?.exists ? "answered" : "waiting"
                          }`}
                        >
                          {answers[post.docId]?.exists
                            ? "답변완료"
                            : "답변대기"}
                        </span>
                      </td>
                      <td className="post-actions">
                        <button
                          className="post-reply-btn"
                          onClick={() => handleReply(post)}
                        >
                          {answers[post.docId]?.exists
                            ? "답변수정"
                            : "답변작성"}
                        </button>
                        <button
                          className="post-delete-btn"
                          onClick={() => handleDelete(post.docId)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="post-no-data">
                      등록된 게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
        </>
      )}
    </div>
  );
};

export default PostManagement;
