// src/API/email.js
import emailjs from "emailjs-com";

export const sendVerificationEmail = async (email, code, name) => {
  const serviceId = "service_mhm24c9";
  const templateId = "template_hurhutu";
  const publicKey = "Dccj21DIUGdrF_GcO";

  const templateParams = {
    to_email: email,
    verification_code: code,
    name: name,
  };

  return await emailjs.send(serviceId, templateId, templateParams, publicKey);
};
export const sendFindEmail = async ({ email, name, type, message }) => {
  const serviceId = "service_mhm24c9";
  const templateId = "template_404dlza"; // 새로 만든 템플릿 ID
  const publicKey = "Dccj21DIUGdrF_GcO";

  const templateParams = {
    to_email: email,
    to_name: name,
    type, // ex: "아이디 찾기", "비밀번호 찾기"
    message, // 보낼 메시지 내용
  };

  return await emailjs.send(serviceId, templateId, templateParams, publicKey);
};
