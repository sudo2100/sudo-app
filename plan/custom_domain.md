# Cafe24 도메인 → Vercel 연결 가이드 (sudo-app.kr)

| | |
|---|---|
| **문서명** | Cafe24 도메인(`sudo-app.kr`) → Vercel 배포 연결 가이드 |
| **작성일** | 2026년 08월 20일 |
| **대상 도메인** | `sudo-app.kr` (Cafe24 구매·관리) |
| **관련 문서** | [plan/PRD_sudo-soft3_초기기획_v0.2.md](PRD_sudo-soft3_초기기획_v0.2.md) §2.2, §10 |

---

## 1. 배경

`sudo-soft2`는 Render에서 운영 중이며, 도메인 `sudo-app.kr`은 Cafe24에서 구매·관리하고 있다. `sudo-soft3`는 Vercel로 배포 플랫폼을 전환하므로, **Cafe24는 도메인 등록/DNS 관리 역할만 유지**하고 실제 트래픽 라우팅 대상만 Render → Vercel로 바꾼다. Cafe24에서 Vercel로 도메인 자체를 이전(migration)할 필요는 없다 — Cafe24 네임서버를 그대로 두고 DNS 레코드만 Vercel을 가리키도록 수정하면 된다.

> **다운타임 없이 전환하는 것이 목표**다. DNS 전파 특성상 A/CNAME 레코드를 스위치해도 구 레코드를 캐시하고 있는 리졸버가 있을 수 있으므로, 아래 순서(TTL 사전 인하 → Vercel 준비 완료 후 스위치)를 따른다.

---

## 2. 사전 준비

1. **Vercel 프로젝트가 이미 배포되어 있어야 한다.** (`*.vercel.app` 기본 도메인으로 접속 가능한 상태)
2. **Cafe24 도메인 관리 콘솔 접근 권한** 확보: [Cafe24 통합회원 로그인](https://www.cafe24.com) → **마이도메인** → 대상 도메인 선택 → **DNS 관리**(또는 "네임서버/호스트 관리").
3. 전환 최소 24~48시간 전, Cafe24 DNS 관리 화면에서 **기존 A/CNAME 레코드의 TTL을 낮춰둔다** (예: 3600초 → 300초). TTL이 낮을수록 리졸버가 새 레코드를 더 빨리 반영한다.
4. 관리자 페이지(`/admin`), 상담 폼(`/api/contact`) 등 도메인에 의존하는 기능이 Vercel 배포본에서 정상 동작하는지 `*.vercel.app` 주소로 먼저 검증한다 (환경변수, DB 연결 포함).

---

## 3. Vercel 프로젝트에 도메인 추가

1. Vercel 대시보드 → 대상 프로젝트 → **Settings → Environments → Domains → Add Domain**.
   > **UI 개편 주의(2026-02)**: 대시보드 리디자인 이후 Domains가 Settings 최상위가 아니라 **Settings → Environments** 하위로 이동했다. `Settings`에 들어갔는데 `Domains`가 바로 안 보인다면 `Environments` 항목부터 클릭한다.
2. 입력창에 `sudo-app.kr` 입력 후 **Add**.
3. `www.sudo-app.kr`도 함께 추가할지 결정한다. 일반적으로 다음 중 하나를 선택:
   - **apex(`sudo-app.kr`)를 메인으로, `www`는 apex로 리다이렉트** (권장 — `sudo-soft2`가 apex 기준이었다면 그대로 승계)
   - 반대로 `www`를 메인으로, apex를 `www`로 리다이렉트
4. 추가 직후 목록에는 도메인과 상태 배지(예: Invalid Configuration/Pending)만 보이고 A/CNAME 값 텍스트는 바로 안 보일 수 있다 — **도메인 행(row)을 클릭해서 "Show/Hide DNS configuration"을 펼쳐야** 필요한 DNS 레코드 값이 표시된다. 일반적으로:
   - **apex 도메인(`sudo-app.kr`)** → **A 레코드**. 값은 **Vercel 계정/도메인마다 다르게 할당**될 수 있다 (예: `76.76.21.21` 또는 `216.150.1.1` 등) — 반드시 **화면에 표시된 값을 그대로** 사용하고, 이 문서나 다른 예시의 IP를 임의로 재사용하지 않는다.
   - **서브도메인(`www.sudo-app.kr`)** → **CNAME 레코드**, 값은 **프로젝트마다 고유**하다 (예: `xxxxxxxxxxxxxxxx.vercel-dns-017.com` 형태). 예전에는 공용 값 `cname.vercel-dns.com`이 쓰였으나, 지금은 Vercel이 도메인 카드에 표시해주는 값을 그대로 복사해서 써야 한다 — 임의로 `cname.vercel-dns.com`을 입력하지 않는다.
   - Vercel은 대안으로 apex에도 CNAME 유사 방식(ALIAS/ANAME)을 지원하는 경우가 있으나, Cafe24는 apex CNAME을 지원하지 않으므로 **apex는 A 레코드**로 등록하는 것이 안전하다.
5. **"Verification Required" + "linked to another Vercel account" 경고가 뜨는 경우** (도메인을 과거에 다른 Vercel 계정/팀에 한 번이라도 등록해본 적이 있으면 발생 — 도메인 탈취 방지를 위한 정상 절차이지 에러가 아니다): 안내된 **TXT 레코드**(호스트 `_vercel`, 값 예: `vc-domain-verify=sudo-app.kr,78ab39113648d46fde5c`)를 A 레코드와 **함께** Cafe24에 등록해야 한다. 검증 통과 후에는 TXT 레코드를 삭제해도 무방하다 (A 레코드는 유지).

---

## 4. Cafe24 DNS 레코드 설정

Cafe24 DNS 관리 화면(**마이도메인 → DNS 관리 → 레코드 관리**)에서:

1. **기존에 Render를 가리키던 A/CNAME 레코드가 있다면 삭제하거나 수정 대상으로 확인**해둔다 (삭제는 새 레코드 등록 직전에).
2. **A 레코드 추가**
   - 호스트: `@` (또는 공란 — apex를 의미)
   - 값(IP): **Vercel 대시보드의 도메인 카드에 표시된 IP를 그대로** 입력 (계정마다 다름 — 예: `216.150.1.1`)
   - TTL: 300 (전환 완료 후 3600 등으로 다시 올려도 무방)
3. **CNAME 레코드 추가** (`www` 사용 시)
   - 호스트: `www`
   - 값: **Vercel 대시보드에 표시된 고유 CNAME 값**을 그대로 입력
   - TTL: 300
4. **TXT 레코드 추가** ("Verification Required" 경고가 뜬 경우에만)
   - 호스트: `_vercel`
   - 값: Vercel이 안내한 값을 **쉼표 포함 그대로** 입력 (예: `vc-domain-verify=sudo-app.kr,78ab39113648d46fde5c`)
   - Vercel 대시보드에서 **Refresh**를 눌러 검증 통과 확인 후, 이 레코드는 삭제해도 된다.
5. **Cafe24 특이사항**
   - Cafe24는 도메인을 "Cafe24 자체 DNS"로 관리할 수도 있고, "타사 네임서버(예: Vercel 네임서버)로 위임"할 수도 있다. 본 가이드는 **Cafe24 DNS를 그대로 유지하면서 개별 레코드만 Vercel로 향하게 하는 방식**을 기준으로 한다 — 네임서버 자체를 Vercel로 옮기는 방식(Vercel이 DNS 전체를 관리)보다 변경 범위가 작고 되돌리기 쉽다.
   - Cafe24 콘솔에서 A 레코드와 CNAME 레코드가 **같은 호스트(`@`)에 동시에 존재할 수 없다**는 제약이 있을 수 있으니, apex는 A, `www`는 CNAME으로 역할을 분리한다.
   - 기존에 이메일(MX) 레코드가 설정되어 있다면 **절대 건드리지 않는다** — 도메인 전환과 메일 수신은 무관하다.

---

## 5. 검증

1. Cafe24 저장 후 DNS 전파를 확인한다: `nslookup sudo-app.kr`, `nslookup www.sudo-app.kr` 또는 [dnschecker.org](https://dnschecker.org) 등에서 여러 리전 리졸버 결과 확인.
2. Vercel 대시보드 **Settings → Environments → Domains**에서 해당 도메인 상태가 **Valid Configuration**(초록색 체크)으로 바뀌는지 확인한다. 보통 A/CNAME 반영 후 수 분~수십 분 소요. TXT 검증이 필요했던 경우 "Verification Required" 배지가 사라지는지도 함께 확인한다.
3. Vercel이 **Let's Encrypt 기반 SSL 인증서를 자동 발급**한다 — 별도 인증서 구매/업로드 불필요. 발급 완료 후 `https://sudo-app.kr` 접속 시 인증서가 Vercel 발급분인지 확인한다.
4. 실제 브라우저에서 다음을 점검한다:
   - `https://sudo-app.kr` 정상 접속 (SSG 정적 페이지)
   - `/en` 정상 접속
   - `/admin` 로그인 동작
   - 상담 폼(`/api/contact`) 제출 → DB 저장 + 이메일 발송 확인
   - `www.sudo-app.kr` → apex(또는 반대) 리다이렉트 동작

---

## 6. 전환(Cutover) 순서 요약

1. Vercel 배포본을 `*.vercel.app`에서 충분히 검증 (§2-4단계).
2. Cafe24에서 기존 레코드 TTL을 미리 낮춤 (최소 24시간 전).
3. Vercel에 도메인 추가 → 안내된 A/CNAME 값 확인.
4. Cafe24 DNS에서 레코드를 Vercel 값으로 교체.
5. 전파 완료 및 Vercel SSL 발급 확인.
6. 신규 도메인 기준으로 전체 기능(정적 페이지·ISR 뉴스·상담 폼·관리자) 재검증.
7. 문제 없음을 확인한 뒤에만 Render 쪽 리소스를 정리(§9 "레거시 정리" 참고, [PRD §9](PRD_sudo-soft3_초기기획_v0.2.md#9-개발-진행-방식-마이그레이션-단계-제안)).
8. TTL을 정상 값(예: 3600)으로 되돌린다.

---

## 7. 트러블슈팅

| 증상 | 원인/조치 |
|---|---|
| Vercel에서 "Invalid Configuration"이 계속 표시됨 | DNS 전파 지연(TTL) — 시간을 두고 재확인. Cafe24 레코드 값에 오타(호스트를 `@` 대신 `sudo-app.kr`로 잘못 입력 등)가 없는지 재확인 |
| SSL 인증서가 발급되지 않음 | A/CNAME이 정확히 Vercel을 가리키기 전에는 인증서 발급이 시작되지 않음 — DNS 검증 통과 후 자동 재시도됨. 즉시 필요하면 Vercel 대시보드에서 수동 Refresh |
| `www`와 apex 중 한쪽만 동작 | 두 호스트 모두 Vercel Domains에 등록되어 있는지, 그리고 리다이렉트 방향(apex↔www)이 의도대로 설정되어 있는지 확인 |
| 메일이 갑자기 안 옴 | DNS 레코드 수정 중 MX 레코드가 실수로 변경/삭제된 경우 — 즉시 원복 |
| 국내 사용자에게 여전히 느림 | PRD §2.2의 함수 리전(`icn1`) 미지정 여부 확인 — 정적/ISR 페이지는 CDN 엣지로 자동 서빙되지만, 상담 폼 등 동적 함수는 리전을 명시해야 국내 지연이 최소화됨 |
| "Verification Required" + "linked to another Vercel account" | 과거 다른 Vercel 계정/팀에 같은 도메인을 등록한 이력이 있으면 발생 — 에러 아님. 안내된 `_vercel` TXT 레코드를 Cafe24에 추가하고 Vercel에서 Refresh하면 해결됨 (§3-5, §4-4) |
| Cafe24 CNAME 등록 시 "도메인 형식 오류" | Vercel이 보여주는 CNAME 값 끝에 붙은 마침표(`.`, FQDN 표기)를 그대로 복사한 경우 — Cafe24 입력폼에서는 **끝 점을 빼고** 입력해야 한다 |
| TXT 등록해도 apex가 계속 "Verification Required" | Cafe24 TXT 관리에서 **호스트명을 `_vercel`이 아니라 `www.sudo-app.kr` 등으로 잘못 지정**한 경우 흔히 발생 — 실제 등록된 TXT 레코드의 호스트명이 정확히 `_vercel`(→ `_vercel.sudo-app.kr`)인지 재확인 |
| Vercel 도메인을 제거 후 재등록했더니 다시 "Verification Required"로 초기화됨 | 도메인을 Remove→Add하면 **TXT 검증 코드가 새로 발급**된다. Cafe24에 등록된 옛 TXT 값을 최신 값으로 교체해야 한다 |

---

## 8. 체크리스트

- [ ] Vercel 배포본이 `*.vercel.app`에서 정상 동작 확인
- [ ] Cafe24 기존 레코드 TTL 사전 인하
- [ ] Vercel Settings → Environments → Domains에 `sudo-app.kr`, `www.sudo-app.kr` 추가
- [ ] Cafe24 DNS에 A(`@`) / CNAME(`www`) 레코드 등록
- [ ] "Verification Required" 뜬 경우 `_vercel` TXT 레코드 등록 및 Refresh로 검증 완료
- [ ] MX 등 기존 메일 레코드 유지 확인
- [ ] DNS 전파 확인 (`nslookup` / dnschecker)
- [ ] Vercel SSL 자동 발급 확인
- [ ] 전체 기능(정적/ISR/상담폼/관리자) 신규 도메인 기준 재검증
- [ ] TTL 정상값 복원
- [ ] Render 레거시 리소스 정리 계획 착수 (PRD §9)
