import nodemailer from "nodemailer";

declare global {
  var __sudoMailTransporter: nodemailer.Transporter | undefined;
}

// 네이버 SMTP 이메일 트랜스포터 (EMAIL_USER/EMAIL_PASS 설정 시에만 활성화)
export const emailTransporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? (global.__sudoMailTransporter ??= nodemailer.createTransport({
        host: "smtp.naver.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false },
      }))
    : null;

interface ContactMailPayload {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  createdAt: string;
}

// 응답을 반환하기 전에 반드시 await 해야 한다 — 서버리스 함수는 응답 직후 실행 컨텍스트가
// 정지될 수 있어, await 없이 발사(fire-and-forget)하면 발송 도중 잘려나갈 수 있다.
export function sendContactNotification(contact: ContactMailPayload): Promise<void> {
  if (!emailTransporter) return Promise.resolve();

  return emailTransporter
    .sendMail({
      from: `"SUDO 소프트 홈페이지" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `[코칭 문의] ${contact.name}님 - ${contact.course}`,
      html: `
        <h2>새 코칭 문의가 접수되었습니다</h2>
        <table border="1" cellpadding="8" style="border-collapse:collapse;font-size:14px;">
          <tr><th>이름</th><td>${contact.name}</td></tr>
          <tr><th>이메일</th><td>${contact.email}</td></tr>
          <tr><th>연락처</th><td>${contact.phone}</td></tr>
          <tr><th>관심 코스</th><td>${contact.course}</td></tr>
          <tr><th>접수 시각</th><td>${contact.createdAt}</td></tr>
          <tr><th>문의 내용</th><td style="white-space:pre-wrap;">${contact.message}</td></tr>
        </table>
      `,
    })
    .then(() => undefined)
    .catch((err: Error) => {
      console.error("이메일 발송 오류:", err.message);
    });
}
