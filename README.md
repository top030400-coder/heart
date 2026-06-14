# 하츠 팬페이지 ✦

화이트 + 아이스블루 테마의 하츠 팬페이지예요.
구조: 프로필 / 공지 / 일정 / 업보 / 일기 + 관리자(admin) + Supabase 연동.

## 처음 세팅 (4단계)

### 1. Supabase 프로젝트 만들기
- supabase.com 에서 새 프로젝트 생성
- `Project Settings → API` 에서 **Project URL** 과 **anon public 키** 복사

### 2. `supabase.js` 상단 두 값 교체
```
const SUPABASE_URL  = 'https://본인프로젝트.supabase.co';
const SUPABASE_ANON = '본인 anon public 키';
```

### 3. 테이블 만들기
- Supabase → `SQL Editor` 에 `supabase_tables.sql` 전체를 붙여넣고 Run
- 그다음 `Storage` 에서 **`hatz`** 라는 버킷을 **Public** 으로 생성

### 4. 배포
- 이 폴더를 GitHub 레포에 올리고 Cloudflare Pages로 연결
- 끝!

## 관리자 사용법
- `/admin/` 접속 → 비밀번호 입력 (기본 `1234`, `admin/index.html` 상단에서 변경 가능)
- 프로필 수정 / 공지·일정·업보·일기 추가 / 사진 업로드(자동 압축)

## 참고
- 이미지는 업로드 시 가로 1200px·JPEG 80%로 자동 압축됨 (10MB → 보통 0.3~0.8MB)
- SOOP 글에 삽입: 글쓰기 HTML 모드에서
  `<p><iframe frameborder="0" height="2400" id="hatzFrame" scrolling="no" src="배포주소" style="width:100%;border:0;display:block;" width="100%"></iframe></p>`
  (페이지가 높이를 자동 전송하지만, SOOP가 script를 막으면 height 숫자를 직접 조절)
