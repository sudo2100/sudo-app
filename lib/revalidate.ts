import { revalidatePath } from "next/cache";

// 대표강사 일정은 홈 팝업(/, /en)과 공지사항 게시판(/notices, /en/notices)에 정적으로 노출된다 —
// 관리자가 일정을 변경하면 이 페이지들을 즉시 재검증해야 다음 방문자에게 바로 반영된다.
export function revalidateSchedulePages() {
  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/notices");
  revalidatePath("/en/notices");
}
