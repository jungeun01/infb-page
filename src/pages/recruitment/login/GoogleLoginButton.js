import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // ✅ 이름 수정
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth, getUserRole } from "../../API/firebase";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const clientId =
    "331678925348-p2v5ess5tgl0fngk4gupic2ddc4ucnt6.apps.googleusercontent.com"; // ← 여기도 실제 클라이언트 ID 넣어주세요!

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const credential = GoogleAuthProvider.credential(
              credentialResponse.credential
            );

            // Firebase로 로그인
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;

            console.log("✅ 구글 로그인 성공:", user);

            // 역할 확인
            const role = await getUserRole(user.uid);
            if (role === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/");
            }
          } catch (error) {
            console.error("❌ 구글 로그인 오류:", error);
            alert("구글 로그인에 실패했습니다.");
          }
        }}
        onError={() => {
          console.log("❌ Google 로그인 실패");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
