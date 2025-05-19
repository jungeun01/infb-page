import React, { useEffect, useState } from "react";
import MyEditor from "../pages/community/MyEditor";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PiListDashesBold } from "react-icons/pi";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  addComment,
  deleteDatas,
  getComments,
  getCurrentUser,
  getDatas,
  updateDatas,
  uploadPostImage,
} from "../pages/API/firebase";

function Board() {
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState({
    first: "",
    second: "",
    third: "",
  });
  const [comments, setComments] = useState([]);

  const [formData, setFormData] = useState({
    companyName: "",
    authorName: "",
    contact: "",
    email: "",
    title: "",
    content: "",
    phoneNumber: "",
    replyContent: "",
    images: [],
  });
  const [isEditing, setIsEditing] = useState(false); //수정상태관리

  const { id } = useParams(); //URL에서 post ID 가져오기
  const [post, setPost] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // 댓글 입력창 확장 여부
  const [currentUser, setCurrentUser] = useState({
    name: "사용자 이름", // 로그인한 사용자 이름 예시
  });
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editContent, setEditContent] = useState(""); // 수정 중인 댓글 내용
  const [adminAnswer, setAdminAnswer] = useState(null);

  const canComment = currentUser && currentUser.email === formData.email;
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getDatas("posts", {
          condition: [["docId", "==", id]],
        });
        const post = data.find((item) => item.docId == id);
        setFormData(post);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };

    const fetchAdminAnswer = async () => {
      try {
        const answerData = await getDatas(`posts/${id}/answers`, {});
        if (answerData.length > 0) {
          setAdminAnswer(answerData[0]); // 첫 번째 답변만 보여줄게
        } else {
          setAdminAnswer(null);
        }
      } catch (err) {
        console.error("관리자 답변 불러오기 실패:", err);
      }
    };

    if (id) {
      fetchPost();
      fetchUser();
      fetchAdminAnswer(); // ✅ 답변 불러오기
    }
  }, [id]);

  //수정 가능 여부설정
  const handleEditClick = () => {
    setIsEditing((prevState) => !prevState); // 수정 시작
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhonePartChange = (e, part) => {
    setPhoneNumber((prev) => ({ ...prev, [part]: e.target.value }));
    const fullNumber = [
      phoneNumber.first,
      phoneNumber.second,
      phoneNumber.third,
    ]
      .map((val, idx) =>
        part === ["first", "second", "third"][idx] ? e.target.value : val
      )
      .join("-");
    setFormData({ ...formData, phoneNumber: fullNumber });
  };

  const handleUpdate = async () => {
    try {
      const isNotice = location.pathname.includes("/admin");

      const updatedPost = {
        ...(isNotice ? {} : { companyName: formData.companyName }),
        authorName: formData.authorName || "관리자",
        title: formData.title || "",
        content: formData.content || "",
        images: formData.images || [],
        updatedAt: new Date(),
        ...(isNotice
          ? {}
          : {
              contact: formData.phoneNumber || "",
              email: formData.email || "",
              phoneNumber: formData.phoneNumber || "",
            }),
      };

      const collection = isNotice ? "notices" : "posts";
      await updateDatas(collection, id, updatedPost);
      Swal.fire({
        title: "Success!",
        text: "게시글이 수정되었습니다.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // 수정 후 적절한 페이지로 이동
      navigate(isNotice ? `/admin/contents` : `/community/post`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      Swal.fire({
        title: "Error!",
        text: "게시글 수정에 실패했습니다.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "삭제하시겠습니까?",
        text: "게시글이 삭제됩니다. 이 작업은 취소할 수 없습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // 공지사항인지 일반 게시글인지 확인
        const isNotice = location.pathname.includes("/admin");
        const collection = isNotice ? "notices" : "posts";

        await deleteDatas(collection, id);
        Swal.fire({
          title: "삭제 완료",
          text: "게시글이 삭제되었습니다.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // 삭제 후 적절한 페이지로 이동
        navigate(isNotice ? `/admin/contents` : `/community/post`);
      } else {
        Swal.fire({
          title: "취소됨",
          text: "게시글 삭제가 취소되었습니다.",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      Swal.fire({
        title: "오류",
        text: "게시글 삭제에 실패했습니다.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSaveReply = async () => {
    if (!formData.replyContent.trim()) {
      Swal.fire({
        title: "Error",
        text: "댓글 내용을 입력해주세요.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const reply = {
        content: formData.replyContent,
        author: currentUser ? currentUser.email : "Unknown User",
        createdAt: new Date(),
      };

      // 댓글 추가 API 호출
      await addComment(id, reply);

      // 댓글 내용 초기화
      setFormData({ ...formData, replyContent: "" });

      // 댓글 추가 후 댓글 목록을 다시 가져오는 로직 추가
      const { data } = await getComments(id); // 댓글 가져오기
      setComments(data);

      Swal.fire({
        title: "Success",
        text: "댓글이 등록되었습니다.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("댓글 저장 실패:", error);
      Swal.fire({
        title: "Error",
        text: "댓글 저장에 실패했습니다.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  // 댓글 수정삭제
  const updateComment = async (commentId) => {
    try {
      await updateDatas("comments", commentId, {
        content: editContent,
        updatedAt: new Date(),
      });

      Swal.fire("수정 완료", "댓글이 수정되었습니다.", "success");

      setEditingCommentId(null);
      setEditContent("");

      const { data } = await getComments(id);
      setComments(data);
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      Swal.fire("오류", "댓글 수정 중 문제가 발생했습니다.", "error");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const result = await Swal.fire({
        title: "삭제하시겠습니까?",
        text: "댓글은 복구되지 않습니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      });

      if (result.isConfirmed) {
        await deleteDatas("comments", commentId);
        Swal.fire("삭제 완료", "댓글이 삭제되었습니다.", "success");

        const { data } = await getComments(id);
        setComments(data);
      }
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      Swal.fire("오류", "댓글 삭제 중 문제가 발생했습니다.", "error");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await getComments(id); // 댓글 가져오기
        setComments(data);
      } catch (error) {
        console.error("댓글 목록 조회 실패:", error);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  const navigate = useNavigate();
  const handleClick = () => {
    // 목록 버튼 클릭 시에도 적절한 페이지로 이동
    const isNotice = location.pathname.includes("/admin");
    navigate(isNotice ? `/admin/contents` : `/community/post`);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 게시글 ID가 없으면 임시 ID 생성
      const uploadId = id || "temp_" + Date.now();

      // Firebase Storage에 이미지 업로드
      const downloadURL = await uploadPostImage(file, uploadId);

      // 이미지 URL을 배열에 추가
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), downloadURL],
      }));
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="mx-4 my-20 md:mx-12 lg:mx-48">
      <div className="mb-14">
        <h1 className="text-3xl font-semibold">
          {isEditing ? "수정글" : "상세보기"}
        </h1>
      </div>
      <div className="flex flex-col  py-5">
        {/* 공지사항이 아닐 때만 회사명과 작성자명 표시 */}
        {!location.pathname.includes("/admin") && (
          <div className="flex flex-col md:flex-row w-full">
            <div className=" flex w-full">
              <div className="flex w-1/3 md:w-2/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
                회사명
              </div>
              <div className="w-11/12 md:w-10/12 border-gray-300 border p-2 flex justify-center">
                <input
                  type="text"
                  className="text-[14px] border-gray-400 border w-full pl-2  rounded-sm "
                  placeholder="회사명"
                  name="companyName"
                  value={formData.companyName || ""}
                  onChange={isEditing ? handleChange : null}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex w-1/3 md:w-2/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
                작성자명
                <span className="text-[#ff0000] text-[8px] mb-3"></span>
              </div>
              <div className="w-11/12 md:w-10/12 border-gray-300 border p-2 flex justify-center">
                <input
                  type="text"
                  name="authorName"
                  className="text-[14px] border-gray-400 border w-full pl-2 rounded-sm py-1"
                  value={formData.authorName || ""}
                  onChange={isEditing ? handleChange : null}
                  readOnly={!isEditing}
                  placeholder="작성자명"
                />
              </div>
            </div>
          </div>
        )}

        {/* 공지사항이 아닐 때만 연락처와 이메일 표시 */}
        {!location.pathname.includes("/admin") && (
          <div className="flex flex-col md:flex-row">
            <div className="flex w-full">
              <div className="flex w-1/3 md:w-2/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
                연락처
                <span className="text-[#ff0000] text-[8px] mb-3"></span>
              </div>
              <div className="w-11/12  md:w-10/12 border-gray-300 border p-2 flex ">
                <input
                  type="text"
                  name="contact"
                  className="w-2/6 md:border-gray-400 border pl-2 md:rounded-sm md:w-2/12"
                  onChange={isEditing ? handlePhonePartChange : null}
                  value={(formData.phoneNumber || "").split("-")[0] || ""}
                  readOnly={!isEditing}
                />
                _
                <input
                  type="text"
                  name="contact"
                  className="w-2/6 md:border-gray-400 border pl-2 md:rounded-sm md:w-2/12"
                  onChange={isEditing ? handlePhonePartChange : null}
                  value={(formData.phoneNumber || "").split("-")[1] || ""}
                  placeholder="xxxx"
                  readOnly={!isEditing}
                />
                _
                <input
                  type="text"
                  name="contact"
                  className="w-2/6 md:border-gray-400 border pl-2 md:rounded-sm md:w-2/12"
                  onChange={isEditing ? handlePhonePartChange : null}
                  value={(formData.phoneNumber || "").split("-")[2] || ""}
                  placeholder="xxxx"
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex w-1/3 md:w-2/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
                이메일
                <span className="text-[#ff0000] text-[8px] mb-3"></span>
              </div>
              <div className="w-11/12  md:w-10/12 border-gray-300 border p-2 flex ">
                <input
                  type="text"
                  name="email"
                  className="text-[14px] border-gray-400 border w-full pl-2 rounded-sm py-1"
                  value={formData.email || ""}
                  onChange={isEditing ? handleChange : null}
                  placeholder="help@infob.co.kr"
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex">
          <div className="flex w-1/3 md:w-1/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
            제목
            <span className="text-[#ff0000] text-[8px] mb-3"></span>
          </div>
          <div className="w-11/12  border-gray-300 border p-2">
            <input
              type="text"
              name="title"
              className="text-[14px] border-gray-400 border w-full pl-2 rounded-sm py-1"
              placeholder="문의제목"
              value={formData.title || ""}
              onChange={isEditing ? handleChange : null}
              readOnly={!isEditing}
            />
          </div>
        </div>
        <div className="flex flex-col  md:flex-row">
          <div className="py-2  flex justify-start pl-2 text-xs md:text-[14px] font-semibold md:w-1/12  bg-[#f6f6f6] border-gray-300 border md:py-3 pr-2  md:justify-end items-center">
            내용
            <span className="text-[#ff0000] text-[8px]"></span>
          </div>
          <div className="w-full md:w-11/12 border-gray-300 border p-2 h-[480px]">
            {isEditing ? (
              <>
                <MyEditor
                  content={formData.content}
                  isEditing={isEditing}
                  setContent={(value) =>
                    setFormData((prev) => ({ ...prev, content: value }))
                  }
                />
                {/* 업로드된 이미지 미리보기 */}
                {formData.images && formData.images.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-sm font-semibold mb-2">
                      업로드된 이미지
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`첨부 이미지 ${index + 1}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full text-start overflow-y-auto leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                {/* 이미지 표시 */}
                {formData.images && formData.images.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`첨부 이미지 ${index + 1}`}
                          className="max-w-full h-auto rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* 자동등록방지 입력 */}
        <div className="flex flex-col  md:flex-row">
          <div className="py-2 flex justify-start pl-2 text-xs md:text-[14px] font-semibold md:w-1/12 bg-[#f6f6f6] border-gray-300 border md:py-3 pr-2  md:justify-end items-center">
            첨부파일
          </div>
          <div className="w-full md:w-11/12 py-4 border-gray-300 border">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <div>
            {isEditing ? (
              <>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-2"
                  onClick={() => {
                    // 취소 시 원래 데이터로 리셋하고 상세보기 모드로 돌아가기
                    setIsEditing(false);
                  }}
                >
                  취소
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={handleUpdate}
                >
                  수정완료
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 mr-2"
                  onClick={handleDelete}
                >
                  삭제
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={handleEditClick}
                >
                  수정
                </button>
              </>
            )}
          </div>
        </div>

        {/* 댓글 목록 출력 */}
        {/* 댓글 목록 */}
        <div className="my-10">
          <h2 className="text-2xl font-bold text-start mb-2">📌 관리자 답변</h2>
          {adminAnswer ? (
            <div className="border p-4 rounded-md bg-gray-50">
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: adminAnswer.content }}
              />
              <div className="text-right text-xs text-gray-400 mt-2">
                답변일:{" "}
                {new Date(
                  adminAnswer.createdAt?.seconds * 1000
                ).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">답변 없음</div>
          )}
        </div>
        <div className="">
          <button
            className="flex items-center gap-1 bg-[#f6f6f6] px-4 py-2 rounded-md hover:bg-gray-300"
            onClick={handleClick}
          >
            <PiListDashesBold /> <div>목록</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Board;
