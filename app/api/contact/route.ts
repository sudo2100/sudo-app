import { NextRequest, NextResponse } from "next/server";
import { pool, ensureContactsTable, contactsMemoryStore } from "@/lib/db";
import { sendContactNotification } from "@/lib/mail";
import type { SavedContact } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { name, email, phone, course, message } = await req.json().catch(() => ({}));

  if (!name || !email || !message) {
    return NextResponse.json({ error: "필수 입력 항목(이름, 이메일, 내용)이 누락되었습니다." }, { status: 400 });
  }

  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const newContact: SavedContact = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    email,
    phone: phone || "미기재",
    course: course || "일반 문의/자문",
    message,
    createdAt: kstNow.toISOString().replace("Z", "+09:00"),
  };

  if (pool) {
    try {
      await ensureContactsTable();
      await pool.query(
        `INSERT INTO contacts (id, name, email, phone, course, message, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [newContact.id, newContact.name, newContact.email, newContact.phone, newContact.course, newContact.message, newContact.createdAt],
      );
    } catch (dbError) {
      const err = dbError as Error;
      console.error("DB 저장 오류:", err.message);
      return NextResponse.json({ error: "DB 저장에 실패했습니다.", details: err.message }, { status: 500 });
    }
  } else {
    contactsMemoryStore.push(newContact);
    console.warn("DATABASE_URL 미설정 — 메모리에만 저장됨");
  }

  await sendContactNotification(newContact);

  return NextResponse.json(
    {
      success: true,
      message: "상담 신청이 완료되었습니다! 김기용 강사가 확인 후 메일로 신속히 답변 드리겠습니다.",
      data: newContact,
    },
    { status: 201 },
  );
}
