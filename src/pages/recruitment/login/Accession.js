import React, { useEffect, useState } from "react";
import { checkAuth } from "./../../../store/slices/authSlice";
import { MdCheckBox } from "react-icons/md";
import History from "./../../company/History";
import { useNavigate } from "react-router-dom";
import {
  addDatas,
  checkEmailExists,
  signUp,
  updateDatas,
} from "../../API/firebase";
import { sendVerificationEmail } from "./email";

function Accession(props) {
  const [form, setForm] = useState({
    uid: "",
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
    birth: "",
    gender: "",
    phone: "",
    department: "",
    position: "",
    project: "",
    address: {
      zonecode: "",
      address: "",
      extraAddress: "",
      detailAddress: "",
    },
  });
  const [emailChecked, setEmailChecked] = useState(null); // true, false, null
  const [emailMessage, setEmailMessage] = useState("");
  // const [verificationCode, setVerificationCode] = useState("");
  // const [userInputCode, setUserInputCode] = useState("");
  // const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailStep, setEmailStep] = useState("check");
  const [passwordError, setPasswordError] = useState(false); //비밀번호 확인
  const [isPasswordCheckTouched, setIsPasswordCheckTouched] = useState(false);
  const [uidError, setUidError] = useState("");
  const [passwordValidError, setPasswordValidError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  // 유효성 검사
  const validateUid = (uid) => {
    const regex = /^[a-z0-9_-]{5,20}$/;
    return regex.test(uid);
  };
  const validatePassword = (pw) => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>?\\|`~\-=/]).{8,16}$/;
    return regex.test(pw);
  };

  // 📌 주소 팝업 열기
  const sample6_execDaumPostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 스크립트가 아직 로드되지 않았습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = ""; // 주소 변수
        let extraAddr = ""; // 참고항목 변수

        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
        }

        // form state 직접 업데이트
        setForm((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            zonecode: data.zonecode,
            address: addr,
            extraAddress: extraAddr,
            detailAddress: prev.address.detailAddress,
          },
        }));
      },
    }).open();
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "passwordCheck") {
      setIsPasswordCheckTouched(true);
      setPasswordError(form.password !== value);
    }

    if (name === "password") {
      // 비밀번호 변경 시에도 일치 여부 다시 확인 (확인 필드를 이미 건드렸을 경우)
      if (isPasswordCheckTouched) {
        setPasswordError(value !== form.passwordCheck);
      }
    }
  }; // 비밀번호를 수정했을 때도 같이 검사
  const handleAddressChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [id.replace("sample6_", "")]: value,
      },
    }));
  };
  const handleSignUp = async () => {
    if (form.password !== form.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    const exists = await checkEmailExists(form.email);
    if (exists) {
      setEmailChecked(true);
      setEmailMessage("이미 사용 중인 이메일입니다.");
      return;
    }

    try {
      // 1. 먼저 Authentication 생성 (이 과정에서 Firestore 문서도 생성됨)
      const user = await signUp(form.email, form.password, form.name);

      // 2. 생성된 문서에 추가 정보 업데이트
      await updateDatas("users", user.uid, {
        username: form.uid,
        birth: form.birth,
        gender: form.gender,
        phone: form.phone,
        department: form.department,
        position: form.position,
        project: form.project,
        address: form.address,
        createdAt: new Date(),
      });

      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };

  const handleEmailCheck = async () => {
    if (!form.email) {
      setEmailMessage("이메일을 입력해주세요.");
      setEmailChecked(null);
      return;
    }

    try {
      const exists = await checkEmailExists(form.email); // 🔍 여기가 핵심 연결
      if (exists) {
        setEmailChecked(true);
        setEmailMessage("이미 사용 중인 이메일입니다.");
      } else {
        setEmailChecked(false);
        setEmailMessage("사용 가능한 이메일입니다.");
        setEmailStep("send"); // 👉 인증번호 전송 가능 상태
      }
    } catch (error) {
      console.error("이메일 중복 검사 실패:", error);
      setEmailMessage("오류가 발생했습니다.");
      setEmailChecked(null);
    }
  };
  console.log(form);
  return (
    <div className="mx-52">
      <div className="mt-10">
        <h1 className="text-3xl font-bold text-start">회원가입</h1>
      </div>
      <div className="flex  justify-center flex-col gap-2 mt-10 py-4 mx-40 border-t border-gray-300 ">
        <div className="flex gap-2 ">
          <div className="font-bold w-1/5">아이디</div>
          <div className="w-4/5 pr-2">
            <input
              type="text"
              name="uid"
              value={form.uid}
              onChange={handleChange}
              onBlur={() => {
                if (!validateUid(form.uid)) {
                  setUidError(
                    "아이디는 5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다."
                  );
                } else {
                  setUidError("사용 가능합니다");
                }
              }}
              className="border border-gray-300 py-2 px-2 rounded-md w-full"
            />
            {uidError && (
              <p
                className={`text-sm mt-1 flex ${
                  uidError === "사용 가능합니다"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {uidError}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">비밀번호</div>
          <div className="w-4/5 pr-2">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => {
                if (!validatePassword(form.password)) {
                  setPasswordValidError(
                    "비밀번호는 8~16자 영문 대소문자, 숫자, 특수문자를 사용하세요."
                  );
                } else {
                  setPasswordValidError("사용 가능합니다");
                }
              }}
              className="border border-gray-300 py-2 px-2 rounded-md w-full"
            />
            {passwordValidError && (
              <p
                className={`text-sm mt-1 flex ${
                  passwordValidError === "사용 가능합니다"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordValidError}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">비밀번호 확인</div>
          <div className="w-4/5 pr-2">
            <input
              type="password"
              name="passwordCheck"
              value={form.passwordCheck}
              onChange={handleChange}
              className="border border-gray-300 py-2 px-2 rounded-md w-full"
            />
            {isPasswordCheckTouched && (
              <p
                className={`text-sm flex ${
                  passwordError ? "text-red-500" : "text-green-600"
                }`}
              >
                {passwordError
                  ? "비밀번호가 일치하지 않습니다."
                  : "비밀번호가 일치합니다."}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">이름</div>
          <div className="w-4/5 pr-2">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 py-2 px-2 rounded-md w-full"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">생년월일</div>
          <div className="w-4/5 pr-2">
            <input
              type="date"
              name="birth"
              value={form.birth}
              onChange={handleChange}
              className="border border-gray-300 py-2 px-2 rounded-md w-full"
            />
            <p className="text-start">
              생년월일 8자리를 입력해 주세요. ex)19670716
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">성별</div>
          <div className="w-4/5 flex gap-2">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
            />{" "}
            남자
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
            />{" "}
            여자
            <input
              type="radio"
              name="gender"
              value="no"
              checked={form.gender === "no"}
              onChange={handleChange}
            />{" "}
            선택안함
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">전화번호</div>
          <div className="w-4/5 pr-2">
            <input
              type="tell"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 py-2 px-2 rounded-md w-full"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">이메일</div>
          <div className="flex flex-col gap-2 w-4/5">
            {/* 👉 이메일 입력 & 버튼 */}
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => {
                  handleChange(e);
                  setEmailChecked(null);
                  setEmailMessage("");
                  setEmailStep("check");
                }}
                className="border border-gray-300 py-2 px-2 rounded-md "
              />
              {emailStep === "check" && (
                <button
                  onClick={handleEmailCheck}
                  className="bg-blue-500 text-white rounded-md px-4 "
                >
                  중복검사
                </button>
              )}
            </div>
            {/* 👉 중복검사 결과 메시지 */}
            {emailMessage && (
              <p
                className={`text-sm flex ${
                  emailChecked === false
                    ? "text-green-600"
                    : emailChecked === true
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {emailMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5 ">부서</div>
          <div className="w-4/5 pr-2">
            <select
              className="border border-gray-300 w-full py-2 pl-2"
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <option value="부서선택">부서를 선택해주세요</option>
              <option value="기업부설연구소">기업부설연구소</option>
              <option value="사업관리부">사업관리부</option>
              <option value="경영지원팀">경영지원팀</option>
              <option value="ICT사업부">ICT사업부</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">직급</div>
          <div className="w-4/5 pr-2">
            <select
              className="border border-gray-300 w-full py-2 pl-2"
              value={form.position}
              name="position"
              onChange={handleChange}
            >
              <option value="직급">직급을 선택해주세요</option>
              <option value="사장">사장</option>
              <option value="이사">이사</option>
              <option value="부장">부장</option>
              <option value="차장">차장</option>
              <option value="과장">과장</option>
              <option value="대리">대리</option>
              <option value="주임">주임</option>
              <option value="사원">사원</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">프로젝트</div>
          <div className="w-4/5 pr-2">
            <select
              className="border border-gray-300 w-full py-2 pl-2"
              value={form.project}
              name="project"
              onChange={handleChange}
            >
              <option value="프로젝트">프로젝트를 선택해주세요</option>
              <option value="본사">본사</option>
              <option value="프로젝트_1">프로젝트_1</option>
              <option value="프로젝트_2">프로젝트_2</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 w-full">
          <div className="font-bold w-1/5">자택주소</div>
          <div className="w-4/5 flex flex-col gap-1">
            <div className="flex gap-1">
              <input
                type="text"
                id="sample6_postcode"
                className="border border-gray-300 py-2 px-2 rounded-md"
                placeholder="우편주소"
                value={form.address.zonecode}
                onChange={handleAddressChange}
              />
              <button
                type="button"
                onClick={sample6_execDaumPostcode}
                className="border-gray-300 border rounded-md px-2 hover:bg-gray-300"
              >
                우편번호 찾기
              </button>
            </div>
            <div>
              <input
                type="text"
                id="sample6_address"
                placeholder="주소"
                className="border border-gray-300 py-2 px-2 w-full"
                value={form.address.address}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <input
                type="text"
                id="sample6_extraAddress"
                placeholder="참고항목"
                className="border border-gray-300 w-full py-2 px-2"
                value={form.address.extraAddress}
                onChange={handleAddressChange}
              />
            </div>
            <div>
              <input
                type="text"
                id="sample6_detailAddress"
                placeholder="상세주소"
                className="border border-gray-300 w-full py-2 px-2"
                value={form.address.detailAddress}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-300 ">
          <button
            className="bg-red-700 text-white py-2 px-4 rounded-md my-5"
            onClick={handleBack}
          >
            취소
          </button>
          <button
            className="bg-[#404040] text-white py-2 px-4 rounded-md my-5"
            onClick={handleSignUp}
          >
            가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default Accession;
