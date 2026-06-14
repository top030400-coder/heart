-- =============================================
-- 하츠 팬페이지 Supabase 테이블 생성 SQL
-- Supabase → SQL Editor에 전체 복붙 후 Run!
-- =============================================

-- 1) 프로필 (메인 페이지 전체를 JSONB 한 칸에 저장)
CREATE TABLE IF NOT EXISTS profile (
  id         BIGINT PRIMARY KEY,
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) 공지
CREATE TABLE IF NOT EXISTS notice (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT,
  pinned     BOOLEAN DEFAULT FALSE,
  image_url  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) 일정
CREATE TABLE IF NOT EXISTS schedule (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  date       DATE NOT NULL,
  time       TEXT,
  type       TEXT DEFAULT '일반',
  note       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) 업보
CREATE TABLE IF NOT EXISTS work (
  id          BIGSERIAL PRIMARY KEY,
  nickname    TEXT,
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  event_date  DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 5) 일기
CREATE TABLE IF NOT EXISTS diary (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT,
  mood       TEXT,
  diary_date DATE,
  image_url  TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS (공개 읽기 + anon 쓰기) ──
ALTER TABLE profile  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice   ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE work     ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read profile"  ON profile  FOR SELECT USING (true);
CREATE POLICY "ins profile"   ON profile  FOR INSERT WITH CHECK (true);
CREATE POLICY "upd profile"   ON profile  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "read notice"   ON notice   FOR SELECT USING (true);
CREATE POLICY "ins notice"    ON notice   FOR INSERT WITH CHECK (true);
CREATE POLICY "del notice"    ON notice   FOR DELETE USING (true);

CREATE POLICY "read schedule" ON schedule FOR SELECT USING (true);
CREATE POLICY "ins schedule"  ON schedule FOR INSERT WITH CHECK (true);
CREATE POLICY "del schedule"  ON schedule FOR DELETE USING (true);

CREATE POLICY "read work"     ON work     FOR SELECT USING (true);
CREATE POLICY "ins work"      ON work     FOR INSERT WITH CHECK (true);
CREATE POLICY "del work"      ON work     FOR DELETE USING (true);

CREATE POLICY "read diary"    ON diary    FOR SELECT USING (true);
CREATE POLICY "ins diary"     ON diary    FOR INSERT WITH CHECK (true);
CREATE POLICY "del diary"     ON diary    FOR DELETE USING (true);

-- ── Storage 버킷 ──
-- 위 SQL 실행 후, Supabase → Storage 에서
-- 'hatz' 라는 이름의 버킷을 Public 으로 새로 만들어주세요.
