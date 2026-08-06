import { Pool } from "pg";
import type { SavedContact, ScheduleItem } from "@/lib/types";

declare global {
  var __sudoPgPool: Pool | undefined;
}

// 로컬 개발: SSL 비활성화 / 프로덕션 배포: SSL 활성화 (Neon 등 클라우드 Postgres 대응)
export const pool = process.env.DATABASE_URL
  ? (global.__sudoPgPool ??= new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    }))
  : null;

let ensureContactsPromise: Promise<void> | null = null;
export function ensureContactsTable(): Promise<void> {
  if (!pool) return Promise.resolve();
  if (!ensureContactsPromise) {
    ensureContactsPromise = pool
      .query(
        `
        CREATE TABLE IF NOT EXISTS contacts (
          id          TEXT        PRIMARY KEY,
          name        TEXT        NOT NULL,
          email       TEXT        NOT NULL,
          phone       TEXT        NOT NULL DEFAULT '미기재',
          course      TEXT        NOT NULL DEFAULT '일반 문의/자문',
          message     TEXT        NOT NULL,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `,
      )
      .then(() => undefined);
  }
  return ensureContactsPromise;
}

// DATABASE_URL 미설정 시 메모리 저장 (서버 재시작/재배포 시 초기화됨 — 로컬 폴백 전용)
export const contactsMemoryStore: SavedContact[] = [];

export async function listContacts(): Promise<SavedContact[]> {
  if (pool) {
    await ensureContactsTable();
    const result = await pool.query(
      `SELECT id, name, email, phone, course, message,
              to_char(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD"T"HH24:MI:SS"+09:00"') AS "createdAt"
       FROM contacts ORDER BY created_at DESC`,
    );
    return result.rows;
  }
  return [...contactsMemoryStore].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

interface ScheduleRow {
  id: string;
  dateLabel: string;
  description: string;
  createdAt: string;
}

// DATABASE_URL 미설정 시 메모리 저장 — 배포 전 기존 하드코딩 일정을 기본값으로 유지
export const schedulesMemoryStore: ScheduleRow[] = [
  { id: "sch_seed_1", dateLabel: "7.7 ~ 7.14", description: "인천재능고 AI로봇과 : IOT 실무(아두이노 프로젝트) 특강", createdAt: new Date().toISOString() },
  { id: "sch_seed_2", dateLabel: "7.18", description: "더조은컴퓨터 종로점: 프런트엔드 개발 실무 (리액트 + TypeScript)", createdAt: new Date().toISOString() },
  { id: "sch_seed_3", dateLabel: "7.27 ~ 9.9", description: "더조은컴퓨터 종로점: GPT&Python(파이썬) 기초 프로그래밍 입문", createdAt: new Date().toISOString() },
];

let ensureSchedulesPromise: Promise<void> | null = null;
export function ensureSchedulesTable(): Promise<void> {
  if (!pool) return Promise.resolve();
  if (!ensureSchedulesPromise) {
    ensureSchedulesPromise = (async () => {
      await pool!.query(`
        CREATE TABLE IF NOT EXISTS schedules (
          id          TEXT        PRIMARY KEY,
          date_label  TEXT        NOT NULL,
          description TEXT        NOT NULL,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      const { rows } = await pool!.query(`SELECT COUNT(*)::int AS count FROM schedules`);
      if (rows[0].count === 0) {
        for (const item of schedulesMemoryStore) {
          await pool!.query(
            `INSERT INTO schedules (id, date_label, description, created_at) VALUES ($1, $2, $3, $4)`,
            [item.id, item.dateLabel, item.description, item.createdAt],
          );
        }
      }
    })();
  }
  return ensureSchedulesPromise;
}

export async function listSchedules(): Promise<ScheduleItem[]> {
  if (pool) {
    await ensureSchedulesTable();
    const result = await pool.query(
      `SELECT id, date_label AS "dateLabel", description FROM schedules ORDER BY created_at ASC`,
    );
    return result.rows;
  }
  return schedulesMemoryStore.map(({ id, dateLabel, description }) => ({ id, dateLabel, description }));
}

export async function createSchedule(dateLabel: string, description: string): Promise<ScheduleItem> {
  const newItem: ScheduleRow = {
    id: `sch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    dateLabel,
    description,
    createdAt: new Date().toISOString(),
  };

  if (pool) {
    await ensureSchedulesTable();
    await pool.query(
      `INSERT INTO schedules (id, date_label, description, created_at) VALUES ($1, $2, $3, $4)`,
      [newItem.id, newItem.dateLabel, newItem.description, newItem.createdAt],
    );
  } else {
    schedulesMemoryStore.push(newItem);
  }

  return { id: newItem.id, dateLabel: newItem.dateLabel, description: newItem.description };
}

export async function updateSchedule(
  id: string,
  dateLabel: string,
  description: string,
): Promise<ScheduleItem | null> {
  if (pool) {
    await ensureSchedulesTable();
    const result = await pool.query(`UPDATE schedules SET date_label = $1, description = $2 WHERE id = $3`, [
      dateLabel,
      description,
      id,
    ]);
    if (result.rowCount === 0) return null;
  } else {
    const item = schedulesMemoryStore.find((entry) => entry.id === id);
    if (!item) return null;
    item.dateLabel = dateLabel;
    item.description = description;
  }

  return { id, dateLabel, description };
}

export async function deleteSchedule(id: string): Promise<boolean> {
  if (pool) {
    await ensureSchedulesTable();
    const result = await pool.query(`DELETE FROM schedules WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  const idx = schedulesMemoryStore.findIndex((item) => item.id === id);
  if (idx === -1) return false;
  schedulesMemoryStore.splice(idx, 1);
  return true;
}
