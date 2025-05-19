import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  findUserByNameAndEmail,
  sendResetPasswordEmail,
} from "../../API/firebase";
import { sendFindEmail } from "./email";
import { generateTempPassword } from "./generateTempPassword";

function Find() {
  const navigate = useNavigate();

  // ID 찾기용
  const [idName, setIdName] = useState("");
  const [idEmail, setIdEmail] = useState("");

  // 비밀번호 찾기용
  const [pwName, setPwName] = useState("");
  const [pwEmail, setPwEmail] = useState("");

  const handleBack = () => {
    navigate("/login/login");
  };

  const handleFindId = async () => {
    try {
      const trimmedName = idName.trim(); // 공백 제거
      const trimmedEmail = idEmail.trim(); // 공백 제거

      const user = await findUserByNameAndEmail(trimmedName, trimmedEmail); // idName, idEmail 사용
      if (user) {
        await sendFindEmail({
          email: trimmedEmail, // idEmail 사용
          name: trimmedName, // idName 사용
          type: "아이디 찾기",
          message: `회원님의 아이디는 ${user.username} 입니다.`,
        });
        alert("아이디가 이메일로 전송되었습니다.");
      } else {
        alert("일치하는 사용자를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  const handleFindPassword = async () => {
    try {
      const trimmedName = pwName.trim(); // 공백 제거
      const trimmedEmail = pwEmail.trim(); // 공백 제거

      // 사용자 정보 조회: idName과 idEmail 사용
      const user = await findUserByNameAndEmail(trimmedName, trimmedEmail); // idName, idEmail 사용
      if (user) {
        // 임시 비밀번호 생성
        const tempPassword = generateTempPassword();

        // 임시 비밀번호를 사용자가 사용할 수 있도록 이메일로 전송
        await sendFindEmail({
          email: trimmedEmail, // idEmail로 임시 비밀번호 전송
          name: trimmedName, // idName 사용
          type: "비밀번호 재설정",
          message: `회원님의 임시 비밀번호는 ${tempPassword} 입니다. 임시 비밀번호로 로그인 후 비밀번호를 변경하세요.`,
        });

        // 임시 비밀번호를 데이터베이스에 저장하거나 사용자가 로그인할 수 있도록 처리
        // 예: await updateUserPassword(user.id, tempPassword); (firebase 함수)

        alert("임시 비밀번호가 이메일로 전송되었습니다.");
      } else {
        alert("일치하는 사용자를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("오류 발생");
    }
  };

  return (
    <div className="mx-52">
      <div className="text-3xl font-bold text-start">아이디/비밀번호 찾기</div>
      <div className="flex flex-col gap-10 mt-10 mx-40">
        {/* ID 찾기 */}
        <div>
          <h1 className="text-start font-bold text-lg mb-2">ID 찾기</h1>
          <div className="border-gray-300 border-y flex items-center py-2">
            <div className="text-base font-bold mr-2 w-2/6">사용자명</div>
            <div className="w-4/6">
              <input
                type="text"
                value={idName}
                onChange={(e) => setIdName(e.target.value)}
                className="border border-gray-400 py-2 px-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="border-gray-300 border-b flex items-center py-2">
            <div className="text-base font-bold mr-2 w-2/6">
              가입시 입력한 이메일
            </div>
            <div className="w-4/6">
              <input
                type="email"
                value={idEmail}
                onChange={(e) => setIdEmail(e.target.value)}
                className="border border-gray-400 py-2 px-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleFindId}
              className="bg-[#404040] text-white px-4 py-2 rounded-md hover:bg-black"
            >
              아이디 찾기
            </button>
          </div>
        </div>

        {/* 비밀번호 찾기 */}
        <div>
          <h1 className="text-start font-bold text-lg mb-2">비밀번호 찾기</h1>
          <div className="border-gray-300 border-y flex items-center py-2">
            <div className="text-base font-bold mr-2 w-2/6">사용자명</div>
            <div className="w-4/6">
              <input
                type="text"
                value={pwName}
                onChange={(e) => setPwName(e.target.value)}
                className="border border-gray-400 py-2 px-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="border-gray-300 border-b flex items-center py-2">
            <div className="text-base font-bold mr-2 w-2/6">
              가입시 입력한 이메일
            </div>
            <div className="w-4/6">
              <input
                type="email"
                value={pwEmail}
                onChange={(e) => setPwEmail(e.target.value)}
                className="border border-gray-400 py-2 px-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleFindPassword}
              className="bg-[#404040] text-white px-4 py-2 rounded-md hover:bg-black"
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-start mt-6">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md"
          onClick={handleBack}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default Find;
