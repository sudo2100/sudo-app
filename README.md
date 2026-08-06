# sudo-soft3

`sudo-soft2`(React CSR + Express)를 Next.js(App Router) SSG/ISR 구조로 재구축한 프로젝트. 기획 배경은 [plan/PRD_sudo-soft3_초기기획_v0.2.md](plan/PRD_sudo-soft3_초기기획_v0.2.md) 참고.

## 아키텍처 요약

- `/` (한국어), `/en` (영어) — 각각 독립된 루트 레이아웃(`app/(ko)/layout.tsx`, `app/en/layout.tsx`)을 가진 완전한 정적(SSG) 페이지. 언어 전환은 `next/link`를 통한 실제 경로 이동으로 처리한다 (localStorage 기반 클라이언트 전환 대신).
- AI 뉴스(`/api/ai-news`) — `unstable_cache`로 `"ai-news"` 태그를 걸어 24시간 주기 ISR + 온디맨드 재검증(`/api/revalidate`, Vercel Cron `/api/cron/ai-news`)을 지원한다.
- 상담 신청(`/api/contact`) — Route Handler에서 PostgreSQL 저장 + 네이버 SMTP 메일 발송을 처리한다 (`force-dynamic`, 캐싱 제외).
- 관리자(`/admin`) — 세션 쿠키 기반 인증, `force-dynamic`으로 정적 캐싱에서 명시적으로 제외.
- 대표강사 일정 — 홈 진입 팝업(`/api/schedules`) + 관리자 대시보드 내 CRUD(`/api/admin/schedules`), `sudo-soft2`에 있던 기존 기능이라 패리티 유지 대상에 포함했다 (PRD API 목록에는 없음).
- `/api/chat`(Gemini 챗봇)은 `sudo-soft2`에서도 노출 UI가 없는 미사용 기능이라 이번 이관에서 제외했다.

## 로컬 개발

```bash
npm install
npm run dev
```

`.env.local`을 만들고 `.env.example`을 참고해 필요한 값만 채운다. DB/이메일 관련 값을 비워두면 각각 메모리 저장·메일 미발송으로 우아하게 폴백한다 (로컬 개발 중 실제 운영 DB/메일 계정을 건드리지 않아도 됨).

```bash
npm run build   # 정적 생성 결과 확인 (/,/en은 ●Static, /admin은 λ Dynamic이어야 함)
npm run start   # 프로덕션 빌드 실행
```

## 환경 변수

`.env.example` 참고. 특히 배포 시 주의할 점:

- **`ADMIN_SESSION_SECRET`은 Vercel 등 서버리스 환경에서 사실상 필수.** 비워두면 서버리스 인스턴스마다 랜덤 시크릿이 생성되어, 요청이 다른 인스턴스로 라우팅될 때 로그인 세션이 예기치 않게 끊길 수 있다 (단일 장수 프로세스였던 `sudo-soft2`/Render에서는 문제되지 않았던 부분).
- `REVALIDATE_SECRET`, `CRON_SECRET`은 각각 온디맨드 재검증 엔드포인트와 Vercel Cron 호출을 보호한다.

## 배포 (참고 — 이번 작업 범위 밖)

이 저장소는 로컬에서 완전히 동작하는 코드베이스와 배포 준비 파일(`vercel.json`)까지만 포함한다. 실제 Vercel 프로젝트 연결, 환경 변수 등록, `sudo-app.kr` 도메인 DNS 전환은 Vercel/Cafe24 계정 접근이 필요한 작업이라 사용자가 직접 진행해야 한다.

1. Vercel에 이 저장소를 연결한다.
2. `.env.example`의 값들을 Vercel 프로젝트 환경 변수로 등록한다 (`ADMIN_SESSION_SECRET` 필수 설정 권장).
3. Vercel 대시보드에서 함수 리전이 서울(`icn1`)로 적용되는지 확인한다 (플랜에 따라 리전 지정 가능 여부가 다를 수 있음 — PRD §10).
4. `vercel.json`의 Cron이 등록되면 Vercel이 `CRON_SECRET`을 자동 주입한다. 동일한 값을 환경 변수에도 설정해 검증에 사용한다.
5. 도메인 절체는 `sudo-soft2/plan/custom_domain.md`의 Cafe24 DNS 설정을 Vercel 커스텀 도메인 안내에 맞게 조정해 진행한다.
