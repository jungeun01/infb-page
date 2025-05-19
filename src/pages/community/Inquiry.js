import React, { useState, useRef } from "react";
import MyEditor from "./MyEditor";
import { FaStar } from "react-icons/fa";
import Captcha from "./Captcha";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPost } from "../../store/slices/postsSlice";
import Swal from "sweetalert2"; // Import SweetAlert2
import { signInWithPopup } from "firebase/auth";

function Inquiry({ mode = "create" }) {
  const [visibility] = useState("private"); // 항상 비공개
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [companyName, setCompanyName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState({
    first: "",
    second: "",
    third: "",
  });
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // MyEditor 컴포넌트와 연결되는 content 상태
  const [isCaptchaValid, setIsCaptchaValid] = useState(false); //
  const captchaRef = useRef(null); //

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePhoneChange = (e, part) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 남기기
    setPhoneNumber((prev) => ({ ...prev, [part]: value }));
  };

  const handleSubmit = async () => {
    const fullPhone = `${phoneNumber.first}-${phoneNumber.second}-${phoneNumber.third}`;
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 빈 칸 검사
    if (
      !companyName ||
      !authorName ||
      !phoneNumber.first ||
      !phoneNumber.second ||
      !phoneNumber.third ||
      !email ||
      !title ||
      !content
    ) {
      Swal.fire({
        title: "빈칸을 입력해주세요.",
        text: "모든 필드를 채워주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    // 전화번호 유효성 검사
    if (!phoneRegex.test(fullPhone)) {
      Swal.fire({
        title: "전화번호 형식 오류",
        text: "전화번호는 010-XXXX-XXXX 형식으로 입력해주세요.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    // 이메일 유효성 검사
    if (!emailRegex.test(email)) {
      Swal.fire({
        title: "이메일 형식 오류",
        text: "올바른 이메일 주소를 입력해주세요.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
    if (!isCaptchaValid) {
      Swal.fire({
        title: "자동등록방지 실패",
        text: "이미지에 나온 문자를 정확히 입력해주세요.",
        icon: "error",
        confirmButtonText: "확인",
      }).then(() => {
        // 경고창 닫힌 후 캡차 새로고침
        if (captchaRef.current) {
          captchaRef.current.refreshCaptcha();
        }
      });
      return;
    }

    // 유효성 통과 후 작성된 내용 등록
    const newPost = {
      companyName,
      authorName,
      phoneNumber: fullPhone,
      email,
      title,
      content,
      visibility: "private", // 고정값
      password, // 필수
      createdAt: new Date(),
      check: false,
    };

    try {
      const result = await Swal.fire({
        title: "문의하시겠습니까?",
        text: "게시글이 등록됩니다.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await dispatch(
          createPost({
            collectionName: "posts",
            data: newPost,
          })
        ).unwrap();
        Swal.fire({
          title: "게시글이 등록되었습니다.",
          text: "게시글 등록이 완료되었습니다!",
          icon: "success",
          confirmButtonText: "확인",
        });
        navigate("/community/post");
      } else {
        Swal.fire({
          title: "취소됨",
          text: "게시글 문의가 취소되었습니다.",
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "게시글 등록 실패",
        text: "게시글 등록에 실패했습니다. 다시 시도해주세요.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // 비밀번호 입력 값 업데이트
  };

  const handleClick = () => {
    navigate("/community/post"); // 취소 버튼 클릭 시 게시글 목록으로 이동
  };

  return (
    <div className="mx-4 my-20 md:mx-12 lg:mx-48">
      <div>
        <h1 className="text-3xl font-semibold">1:1 문의</h1>
      </div>
      <div className="flex flex-col py-5 ">
        {/* 회사명 입력 */}
        <div className="flex flex-col md:flex-row w-full">
          <div className=" flex w-full">
            <div className="flex w-1/3 md:w-2/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
              회사명
            </div>

            <div className="w-11/12 md:w-10/12 border-gray-300 border p-2 flex justify-center">
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                type="text"
                className="text-[14px] border-gray-400 border w-full pl-2 rounded-sm"
                placeholder="회사명"
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex w-1/3 md:w-2/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
              작성자명
              <span className="text-[#ff0000] text-[8px] mb-3">
                <FaStar />
              </span>
            </div>
            <div className="w-11/12 md:w-10/12 border-gray-300 border p-2 flex justify-center">
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                type="text"
                className="text-[14px] border-gray-400 border w-full pl-2 rounded-sm py-1"
                placeholder="작성자명"
              />
            </div>
          </div>
        </div>
        {/* 연락처 입력 */}
        <div className="flex flex-col md:flex-row">
          <div className="flex w-full">
            <div className="flex w-1/3 md:w-2/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
              연락처
              <span className="text-[#ff0000] text-[8px] mb-3">
                <FaStar />
              </span>
            </div>
            <div className="w-11/12  md:w-10/12 border-gray-300 border p-2 flex ">
              <input
                value={phoneNumber.first}
                onChange={(e) => handlePhoneChange(e, "first")}
                type="text"
                className="w-2/6 md:border-gray-400 border pl-2 md:rounded-sm md:w-2/12"
                placeholder="010"
              />
              _
              <input
                value={phoneNumber.second}
                onChange={(e) => handlePhoneChange(e, "second")}
                type="text"
                className="w-2/6 md:border-gray-400 border pl-2 md:rounded-sm md:w-2/12"
                placeholder="xxxx"
              />
              _
              <input
                value={phoneNumber.third}
                onChange={(e) => handlePhoneChange(e, "third")}
                type="text"
                className="w-2/6 md:border-gray-400 border pl-2 md:rounded-sm md:w-2/12"
                placeholder="xxxx"
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="flex w-1/3 md:w-2/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
              이메일
              <span className="text-[#ff0000] text-[8px] mb-3">
                <FaStar />
              </span>
            </div>
            <div className="w-11/12 md:w-10/12 border-gray-300 border p-2 ">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                className="text-[14px] border-gray-400 border w-full pl-2 rounded-sm py-1"
                placeholder="help@infob.co.kr"
              />
            </div>
          </div>
        </div>
        {/* 제목 입력 */}
        <div className="flex">
          <div className="flex w-1/3 md:w-1/12 justify-end items-center text-xs md:text-sm font-semibold bg-[#f6f6f6] border-gray-300 border px-2 py-2 text-right">
            제목
            <span className="text-[#ff0000] text-[8px] mb-3">
              <FaStar />
            </span>
          </div>
          <div className="w-11/12 border-gray-300 border p-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="text-[14px] border-gray-400 border w-full pl-2 rounded-sm py-1"
              placeholder="문의제목"
            />
          </div>
        </div>
        {/* 내용 입력 */}
        <div className="flex flex-col  md:flex-row">
          <div className="py-2 flex justify-start pl-2 text-xs md:text-[14px] font-semibold md:w-1/12 bg-[#f6f6f6] border-gray-300 border md:py-3 pr-2  md:justify-end items-center">
            내용
            <span className="text-[#ff0000] text-[8px]">
              <FaStar />
            </span>
          </div>
          <div className="w-full md:w-11/12 border-gray-300 border p-2 h-[480px]">
            <MyEditor
              content={content} // content 상태를 MyEditor에 전달
              // setFormDate={setContent} // MyEditor에서 변경된 내용 반영
              setContent={setContent}
              isEditing={true}
            />
          </div>
        </div>
        {/* 자동등록방지 입력 */}
        <div className="flex flex-col md:flex-row">
          <div className="w-full text-xs flex justify-start pl-2 md:text-[14px] font-semibold md:w-1/12 bg-[#f6f6f6] border-gray-300 border py-3 md:justify-end pr-1">
            자동등록방지
            <span className="text-[#ff0000] text-[8px]">
              <FaStar />
            </span>
          </div>
          <div className="w-full md:w-11/12 border-gray-300 border">
            <Captcha onValidate={setIsCaptchaValid} ref={captchaRef} />
          </div>
        </div>

        {/* 공개/비공개 설정 */}
        <div className="flex mt-5 items-center gap-2">
          <div className="flex">
            <div className="text-[14px] font-semibold py-3 flex justify-end pr-2">
              비밀번호
              <span className="text-[#ff0000] text-[8px]">
                <FaStar />
              </span>
            </div>
            <div className="p-2">
              <input
                value={password}
                onChange={handlePasswordChange}
                className="text-[14px] pl-1 py-1 border-b border-gray-300"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-between mt-6">
          <div>
            <button
              className="bg-[#ff0000] text-white py-2 md:py-3 px-4 rounded-md hover:bg-red-600"
              onClick={handleClick}
            >
              취소
            </button>
          </div>
          <div>
            <button
              className="bg-gray-700 text-white py-2 md:py-3 px-4 rounded-md hover:bg-gray-600"
              onClick={handleSubmit}
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inquiry;
