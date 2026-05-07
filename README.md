# 한국 디지털 묘지 (Korean Digital Graveyard)

추억의 인터넷 서비스(싸이월드, 네이트온, 미투데이…)를 윈도우 98 감성의 디지털 묘비로 아카이빙하는 커뮤니티 사이트.

## 기술 스택
- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 (CSS-first 토큰 시스템)
- Supabase (DB + RPC, 인증 없음)
- FingerprintJS OSS (투표 중복방지)
- Vercel 배포

## 로컬 개발 시작

```bash
pnpm install
cp .env.local.example .env.local   # 그리고 실제 Supabase URL/키로 채우기
pnpm dev
```

http://localhost:3000 에서 확인.

## Supabase 셋업

1. [supabase.com/dashboard](https://supabase.com/dashboard) 에서 새 프로젝트 생성 (region: Northeast Asia / Seoul 권장)
2. **Project Settings → API** 에서 `URL` 과 `Publishable key` 복사 → `.env.local` 에 붙여넣기
3. **SQL Editor → New query** 에서 다음 마이그레이션 파일들을 순서대로 실행
   - [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) — 테이블, RPC, RLS
   - [`supabase/migrations/002_fix_vote_rpc_ambiguity.sql`](./supabase/migrations/002_fix_vote_rpc_ambiguity.sql) — RPC 컬럼명 충돌 핫픽스
   - [`supabase/migrations/003_seed_services.sql`](./supabase/migrations/003_seed_services.sql) — 11개 시드 + 멱등 upsert
4. **Table Editor** 에서 `services` / `memories` / `votes` 3개 테이블 + 11개 시드 row 확인

### 스키마 요약
- `services` — 묘비. `slug` unique, `vote_count` 캐시, `category`는 6종 enum check
- `memories` — 추억 댓글. 닉네임 + 본문, 로그인 없음
- `votes` — 투표 기록. `(service_id, fingerprint)` unique
- `vote_for_service(slug, fingerprint)` RPC — 멱등 투표 (중복이면 false 반환)

### RLS 정책
- `services`: SELECT 공개, INSERT 공개(`vote_count = 0` 강제), UPDATE/DELETE 차단
- `memories`: SELECT/INSERT 공개
- `votes`: SELECT 공개, INSERT 차단 → `vote_for_service` RPC 경유 강제

## Vercel 배포

### 1. Git 저장소 준비
프로젝트가 아직 git 저장소가 아니라면:
```bash
git init
git add -A
git commit -m "feat: 한국 디지털 묘지 v0.1"
```
GitHub에 새 repo를 만들고 push:
```bash
git branch -M main
git remote add origin git@github.com:YOUR_USER/korean-digital-graveyard.git
git push -u origin main
```

### 2. Vercel에서 import
1. [vercel.com/new](https://vercel.com/new) → GitHub 연결 → 위 저장소 선택
2. **Framework**: Next.js (자동 감지)
3. **Build / Output**: 그대로 (Vercel 기본값)
4. **Root Directory**: `.` (변경 없음)

### 3. Environment Variables 등록
**Settings → Environment Variables** 에서 (Production / Preview / Development 모두 적용):

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR-PROJECT-REF.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_xxxxxxxx...` |

`Publishable key`는 클라이언트에 노출되어도 안전합니다 (RLS로 보호됨). `Secret key`는 절대 등록하지 마세요.

### 4. Deploy
"Deploy" 버튼 클릭 → 1–2분 후 `https://YOUR-PROJECT.vercel.app` 에서 확인.

이후 `git push origin main` 만 해도 자동 배포됩니다.

### 빌드 검증 (선택)
배포 전에 로컬에서 production 빌드를 확인하고 싶다면:
```bash
pnpm build && pnpm start
```

## 디렉토리

```
src/
  app/
    page.tsx                  # /  (홈 + 카드 그리드 + 필터/정렬)
    services/[slug]/page.tsx  # /services/:slug (상세 + 투표 + 추억)
    submit/page.tsx           # /submit (제출 폼)
    about/page.tsx            # /about (사이트 소개)
    layout.tsx                # 글로벌 레이아웃
    globals.css               # Tailwind v4 + 디자인 토큰
  components/
    ui/                       # Window, TitleBar, Button, Input, … (디자인 시스템)
    home/                     # ServiceCard, FilterSidebar, MobileFilterBar, SortBar
    service/                  # VoteButton, MemoryList, MemoryForm
    submit/                   # SubmitForm
  lib/
    cn.ts                     # className 합성 유틸
    supabase.ts               # 지연 초기화 클라이언트
    database.types.ts         # Supabase 스키마 타입
    fingerprint.ts            # 핑거프린트 + 투표 로컬 캐시
    format.ts                 # 카테고리 이모지, 연대, 시간 포맷
    slug.ts                   # 슬러그 생성/충돌 회피
supabase/
  migrations/
    001_initial_schema.sql
    002_fix_vote_rpc_ambiguity.sql
    003_seed_services.sql
docs/
  mockup.html                 # 참고 목업
```
