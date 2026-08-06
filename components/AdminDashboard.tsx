"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { RefreshCw, LogOut, Mail, Phone, Calendar, Lock, Users, TrendingUp, Layers, Inbox, Plus, X, Pencil, Check } from "lucide-react";
import type { SavedContact, ScheduleItem } from "@/lib/types";

type AuthState = "checking" | "unauthenticated" | "authenticated";

interface Stats {
  total: number;
  today: number;
  last7Days: number;
  byCourse: { course: string; count: number }[];
}

// 상담 신청 폼(ContactForm)의 courseOptions와 동일한 순서 — 코스별 색상을 항목(entity)에
// 고정시켜, 신청 건수 순위가 바뀌어도 같은 코스는 항상 같은 색을 유지하도록 한다.
const KNOWN_COURSES = [
  "AI 코칭 과정 (생성형 AI & 프롬프트)",
  "업무/실무 자동화 비즈니스 코칭",
  "SQL 자격 및 빅데이터 특화 특강",
  "개발 기업 협업 / 생성형 AI 및 웹 자문",
];
const CATEGORY_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100"];
const FALLBACK_COLOR = "#a8a29e";

function colorForCourse(course: string): string {
  const idx = KNOWN_COURSES.indexOf(course);
  return idx === -1 ? FALLBACK_COLOR : CATEGORY_COLORS[idx];
}

export default function AdminDashboard() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [contacts, setContacts] = useState<SavedContact[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [newDateLabel, setNewDateLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [editDateLabel, setEditDateLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    setDataError(null);
    try {
      const [contactsRes, statsRes, schedulesRes] = await Promise.all([
        fetch("/api/contacts", { credentials: "same-origin" }),
        fetch("/api/admin/stats", { credentials: "same-origin" }),
        fetch("/api/schedules", { credentials: "same-origin" }),
      ]);

      if (contactsRes.status === 401 || statsRes.status === 401) {
        setAuthState("unauthenticated");
        return;
      }
      if (!contactsRes.ok || !statsRes.ok) {
        throw new Error("데이터를 불러오지 못했습니다.");
      }

      const contactsData = await contactsRes.json();
      const statsData: Stats = await statsRes.json();
      setContacts(contactsData.contacts || []);
      setStats(statsData);

      if (schedulesRes.ok) {
        const schedulesData = await schedulesRes.json();
        setSchedules(schedulesData.schedules || []);
      }
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSchedule = async (e: FormEvent) => {
    e.preventDefault();
    if (!newDateLabel.trim() || !newDescription.trim()) return;

    setIsAddingSchedule(true);
    setScheduleError(null);
    try {
      const res = await fetch("/api/admin/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ dateLabel: newDateLabel.trim(), description: newDescription.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "일정 추가에 실패했습니다.");
      }
      setSchedules((prev) => [...prev, data.schedule]);
      setNewDateLabel("");
      setNewDescription("");
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsAddingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    setDeletingScheduleId(id);
    setScheduleError(null);
    try {
      const res = await fetch(`/api/admin/schedules/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "일정 삭제에 실패했습니다.");
      }
      setSchedules((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setDeletingScheduleId(null);
    }
  };

  const startEditSchedule = (item: ScheduleItem) => {
    setEditingScheduleId(item.id);
    setEditDateLabel(item.dateLabel);
    setEditDescription(item.description);
    setScheduleError(null);
  };

  const cancelEditSchedule = () => {
    setEditingScheduleId(null);
    setEditDateLabel("");
    setEditDescription("");
  };

  const handleSaveSchedule = async (id: string) => {
    if (!editDateLabel.trim() || !editDescription.trim()) return;

    setIsSavingSchedule(true);
    setScheduleError(null);
    try {
      const res = await fetch(`/api/admin/schedules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ dateLabel: editDateLabel.trim(), description: editDescription.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "일정 수정에 실패했습니다.");
      }
      setSchedules((prev) => prev.map((item) => (item.id === id ? data.schedule : item)));
      cancelEditSchedule();
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSavingSchedule(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "same-origin" });
        const data = await res.json();
        setAuthState(data.authenticated ? "authenticated" : "unauthenticated");
      } catch {
        setAuthState("unauthenticated");
      }
    })();
  }, []);

  useEffect(() => {
    if (authState === "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 로그인 확인 직후 1회 대시보드 데이터 로드
      loadDashboard();
    }
  }, [authState]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "로그인에 실패했습니다.");
      }
      setPassword("");
      setAuthState("authenticated");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
    setContacts([]);
    setStats(null);
    setAuthState("unauthenticated");
  };

  if (authState === "checking") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">확인 중...</p>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-xl p-8 space-y-5"
        >
          <div className="flex items-center space-x-2 text-indigo-600">
            <Lock className="w-5 h-5" />
            <h1 className="text-lg font-extrabold text-slate-900">관리자 로그인</h1>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            상담 신청 대시보드를 보려면 로그인하세요.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디"
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-slate-800 transition"
            />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-slate-800 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/10 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoggingIn ? "로그인 중..." : "로그인"}
          </button>
          {loginError && <p className="text-xs text-rose-600">{loginError}</p>}
        </form>
      </div>
    );
  }

  const maxCourseCount = stats?.byCourse.reduce((max, c) => Math.max(max, c.count), 0) ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-slate-900">상담 신청 관리자 대시보드</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadDashboard}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
              aria-label="새로고침"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
              aria-label="로그아웃"
            >
              <LogOut className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        {dataError && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl p-4">
            {dataError}
          </div>
        )}

        {/* Stat tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile icon={<Inbox className="w-4 h-4" />} label="총 접수" value={stats?.total ?? 0} />
          <StatTile icon={<Calendar className="w-4 h-4" />} label="오늘 접수" value={stats?.today ?? 0} />
          <StatTile icon={<TrendingUp className="w-4 h-4" />} label="최근 7일" value={stats?.last7Days ?? 0} />
          <StatTile icon={<Layers className="w-4 h-4" />} label="코스 종류" value={stats?.byCourse.length ?? 0} />
        </div>

        {/* Schedule management */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>대표강사 일정 관리 ({schedules.length}건)</span>
          </h2>

          {scheduleError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl p-3">
              {scheduleError}
            </div>
          )}

          <div className="space-y-2">
            {schedules.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">등록된 일정이 없습니다.</p>
            ) : (
              schedules.map((item) =>
                editingScheduleId === item.id ? (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl bg-indigo-50/60 border border-indigo-100 p-3"
                  >
                    <input
                      type="text"
                      value={editDateLabel}
                      onChange={(e) => setEditDateLabel(e.target.value)}
                      className="w-full sm:w-40 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-800 transition"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full flex-1 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-800 transition"
                    />
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => handleSaveSchedule(item.id)}
                        disabled={isSavingSchedule || !editDateLabel.trim() || !editDescription.trim()}
                        className="p-1.5 rounded-full text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition disabled:opacity-50 cursor-pointer"
                        aria-label="일정 저장"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditSchedule}
                        disabled={isSavingSchedule}
                        className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition disabled:opacity-50 cursor-pointer"
                        aria-label="수정 취소"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-indigo-700">{item.dateLabel}</p>
                      <p className="text-sm font-semibold text-slate-800 break-words">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEditSchedule(item)}
                        className="p-1.5 rounded-full text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                        aria-label="일정 수정"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(item.id)}
                        disabled={deletingScheduleId === item.id}
                        className="p-1.5 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50 cursor-pointer"
                        aria-label="일정 삭제"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ),
              )
            )}
          </div>

          <form onSubmit={handleAddSchedule} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={newDateLabel}
              onChange={(e) => setNewDateLabel(e.target.value)}
              placeholder="날짜 (예: 8.10 ~ 8.14)"
              className="w-full sm:w-40 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-800 transition"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="일정 내용"
              className="w-full flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-800 transition"
            />
            <button
              type="submit"
              disabled={isAddingSchedule || !newDateLabel.trim() || !newDescription.trim()}
              className="shrink-0 inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {isAddingSchedule ? "추가 중..." : "추가"}
            </button>
          </form>
        </div>

        {/* Category breakdown */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">코스별 신청 분포</h2>
          {!stats || stats.byCourse.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">데이터가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {stats.byCourse.map((row) => (
                <div key={row.course} className="space-y-1">
                  <div className="flex items-center justify-between text-xs gap-4">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: colorForCourse(row.course) }}
                      />
                      <span className="truncate">{row.course}</span>
                    </span>
                    <span className="text-slate-500 font-bold shrink-0">{row.count}건</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${maxCourseCount ? (row.count / maxCourseCount) * 100 : 0}%`,
                        backgroundColor: colorForCourse(row.course),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submissions table */}
        <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>접수 내역 ({contacts.length}건)</span>
          </h2>

          {isLoading && contacts.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">불러오는 중...</p>
          ) : contacts.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">접수된 상담 신청이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-100">
                    <th className="py-2 pr-4 font-semibold">신청자</th>
                    <th className="py-2 pr-4 font-semibold">연락처</th>
                    <th className="py-2 pr-4 font-semibold">코스</th>
                    <th className="py-2 pr-4 font-semibold">문의 내용</th>
                    <th className="py-2 pr-4 font-semibold whitespace-nowrap">접수 시각</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 last:border-0 align-top">
                      <td className="py-3 pr-4">
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="flex items-center space-x-1 text-slate-500 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{item.email}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{item.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold whitespace-nowrap">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: colorForCourse(item.course) }}
                          />
                          <span>{item.course}</span>
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-600 max-w-xs">
                        <p className="line-clamp-2">{item.message}</p>
                      </td>
                      <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-4 space-y-2">
      <div className="flex items-center space-x-1.5 text-slate-400">
        {icon}
        <span className="text-[10px] font-semibold">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value.toLocaleString()}</p>
    </div>
  );
}
