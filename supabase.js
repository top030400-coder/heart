/* =============================================
   supabase.js — 하츠 팬페이지 Supabase 연동
   ✅ 아래 두 값을 본인 Supabase 프로젝트 값으로 교체!
      (Supabase → Project Settings → API 에서 확인)
   ✅ Storage 버킷 이름은 'hatz' 로 만들어 주세요 (Public)
   ============================================= */

const SUPABASE_URL  = 'https://여기에-본인-프로젝트.supabase.co';
const SUPABASE_ANON = '여기에-본인-anon-public-키';

const STORAGE_BUCKET = 'hatz';

// ── 클라이언트 초기화 ──
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

/* =============================================
   CRUD 헬퍼
   ============================================= */
async function fetchAll(table, options = {}) {
  let query = db.from(table).select('*');
  if (options.order)  query = query.order(options.order, { ascending: options.asc ?? false });
  if (options.limit)  query = query.limit(options.limit);
  if (options.filter) query = query.eq(options.filter.col, options.filter.val);
  const { data, error } = await query;
  if (error) { console.error(`fetchAll(${table}) 오류:`, error); return []; }
  return data;
}
async function insertRow(table, row) {
  const { error } = await db.from(table).insert(row);
  if (error) { console.error(`insertRow(${table}) 오류:`, error); return false; }
  return true;
}
async function deleteRow(table, id) {
  const { error } = await db.from(table).delete().eq('id', id);
  if (error) { console.error(`deleteRow(${table}) 오류:`, error); return false; }
  return true;
}
async function updateRow(table, id, updates) {
  const { error } = await db.from(table).update(updates).eq('id', id);
  if (error) { console.error(`updateRow(${table}) 오류:`, error); return false; }
  return true;
}

/* =============================================
   이미지 압축 & 업로드
   ============================================= */

/** 이미지를 가로 maxW px 이하로 줄이고 JPEG로 압축 → Blob 반환
 *  10MB 원본도 보통 0.3~0.8MB로 줄어듦 */
async function compressImage(file, maxW = 1200, quality = 0.8) {
  if (file.type === 'image/gif') return file; // 움짤은 원본 유지
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });
    const scale = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(img.src);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
    return blob || file;
  } catch (e) {
    console.error('compressImage 오류:', e);
    return file;
  }
}

/** 압축 후 버킷에 업로드 → 공개 URL 반환 (실패 시 null) */
async function uploadImage(file, folder = 'uploads') {
  try {
    const blob = await compressImage(file);
    const rand = Math.random().toString(36).slice(2, 8);
    const path = `${folder}/${Date.now()}_${rand}.jpg`;
    const { error } = await db.storage.from(STORAGE_BUCKET).upload(path, blob, {
      upsert: true, contentType: 'image/jpeg'
    });
    if (error) { console.error('uploadImage 오류:', error); return null; }
    const { data } = db.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (e) {
    console.error('uploadImage 예외:', e);
    return null;
  }
}

/* ─ 토스트 ─ */
function showToast(msg, duration = 2500) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ─ iframe(SOOP 등) 자동 높이 전송 ─ */
function initIframeResize() {
  const send = () => window.parent.postMessage({ type: 'resize', height: document.body.scrollHeight }, '*');
  send();
  try { new ResizeObserver(send).observe(document.body); } catch (e) {}
}
/** iframe 안에 삽입됐을 때만 높이 전송 켜기 */
function enableIframeAutoHeight() {
  if (window.parent !== window) {
    window.addEventListener('load', initIframeResize);
    setTimeout(initIframeResize, 800);
    setTimeout(initIframeResize, 2000);
  }
}
