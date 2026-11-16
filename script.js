/* =========================================================
   Lộ trình 3 tuần JLPT N5 – dữ liệu + logic
   ========================================================= */

// ---- Cấu hình ----
const START_DATE = "2026-11-16"; // Ngày 1 (Thứ Hai)
const EXAM_DATE = "2026-12-06";  // JLPT tháng 12: Chủ nhật đầu tiên – kiểm tra lại trên phiếu dự thi
const STORAGE_KEY = "jlpt-n5-plan-2026";

// ---- Kết quả bài test ----
const SKILLS = [
  { jp: "文字・語彙", vi: "Từ vựng & Kanji", now: 22.5, target: 55, grade: "C" },
  { jp: "文法", vi: "Ngữ pháp", now: 41.67, target: 65, grade: "B" },
  { jp: "読解", vi: "Đọc hiểu", now: 0, target: 60, grade: "C" },
  { jp: "聴解", vi: "Nghe", now: (22 / 60) * 100, target: 55, grade: "B" },
];

const PRIORITIES = [
  {
    title: "読解 (Đọc hiểu) 0% → ưu tiên số 1 về chiến thuật",
    desc: "0% thường là do hết giờ hoặc bỏ trống. Phần 文法・読解 có 40 phút: làm ngữ pháp ≤ 18 phút, dành ≥ 20 phút cho đọc. Đọc câu hỏi trước rồi mới đọc bài. Đây là phần tăng điểm nhanh nhất.",
  },
  {
    title: "文字・語彙 (Từ vựng/Kanji) 22.5% → học Anki mỗi ngày",
    desc: "Từ vựng là nền cho cả đọc và nghe. Mục tiêu: ~100 kanji N5 + ~800 từ. Mỗi ngày 30–40 từ mới, ôn bằng flashcard (Anki/Quizlet) 20 phút buổi sáng.",
  },
  {
    title: "文法 (Ngữ pháp) 41.67% → hoàn thiện mẫu câu N5 + luyện câu ★",
    desc: "Trợ từ, các thể ます/て/ない/た/辞書形, so sánh, mong muốn… Học theo nhóm, mỗi mẫu tự đặt 1–2 câu. Luyện dạng sắp xếp câu (★) vì hay mất điểm.",
  },
  {
    title: "聴解 (Nghe) 22/60 → giữ nhịp 15 phút/ngày",
    desc: "Đã qua điểm liệt (19) nhưng còn sát. Shadowing + luyện đủ 4 dạng 問題1–4. Học thuộc các câu chào hỏi cố định cho 問題3.",
  },
];

const ROUTINE = [
  { when: "🌅 Sáng", dur: "20 phút", text: "Flashcard từ vựng + kanji (Anki). Làm lúc ăn sáng / trên đường đi làm." },
  { when: "🍱 Trưa", dur: "15 phút", text: "Nghe: shadowing 1 đoạn hội thoại ngắn hoặc nghe lại bài hôm trước." },
  { when: "🌙 Tối", dur: "80–90 phút", text: "Bài học chính của ngày (xem kế hoạch bên dưới)." },
  { when: "🛏️ Trước khi ngủ", dur: "10 phút", text: "Đọc lại sổ lỗi + từ mới trong ngày. Thứ 7, CN học 3–4 tiếng." },
];

const CATS = {
  kanji:     { label: "漢字 Kanji",    color: "var(--c-kanji)" },
  vocab:     { label: "語彙 Từ vựng",  color: "var(--c-vocab)" },
  grammar:   { label: "文法 Ngữ pháp", color: "var(--c-grammar)" },
  reading:   { label: "読解 Đọc",      color: "var(--c-reading)" },
  listening: { label: "聴解 Nghe",     color: "var(--c-listening)" },
  test:      { label: "模試 Thi thử",  color: "var(--c-test)" },
  review:    { label: "復習 Ôn tập",   color: "var(--c-review)" },
  rest:      { label: "休み Nghỉ/Chuẩn bị", color: "var(--c-rest)" },
};

const RESOURCES = [
  ["Đề thi thật các kỳ trước", "trên trang bạn vừa làm (2024年7月, 2024年12月, 2025年7月…) – dùng cho Mock test."],
  ["Đề mẫu chính thức", "jlpt.jp → 問題例 / 公式問題集 N5 (có file nghe)."],
  ["Từ vựng", "Mimikara Oboeru N5 hoặc deck Anki “JLPT N5 Vocabulary”."],
  ["Kanji", "Soumatome N5 Kanji / deck Anki “JLPT N5 Kanji”."],
  ["Ngữ pháp", "Minna no Nihongo bài 1–25 (tổng hợp), Shin Kanzen Master / Soumatome N5 Bunpou."],
  ["Đọc & Nghe", "Shin Kanzen Master N5 Dokkai & Choukai, NHK Easy Japanese (nghe ngắn mỗi ngày)."],
];

// ---- Kế hoạch 21 ngày ----
const WEEKS = [
  {
    name: "Tuần 1 — Xây nền",
    goal: "100 kanji N5, ~250 từ, toàn bộ trợ từ & các thể động từ cơ bản",
    days: [
      {
        title: "Khởi động & trợ từ cơ bản",
        tasks: [
          ["review", "Xem lại đề 2025年12月: chép mọi câu sai vào “sổ lỗi” (câu – đáp án đúng – vì sao sai)", 30],
          ["kanji", "Kanji 1–15: 一 二 三 四 五 六 七 八 九 十 百 千 万 円 年 (âm on/kun + 1 từ ví dụ)", 20],
          ["vocab", "Cài Anki/Quizlet deck N5; học 30 từ: số đếm, tiền, giờ", 20],
          ["grammar", "Trợ từ は・が・を・に・で – mỗi trợ từ chép 3 câu ví dụ", 30],
          ["listening", "Nghe lại phần 聴解 vừa thi, đọc script các câu sai", 15],
        ],
        tip: "Đọc hiểu 0% gần như chắc chắn do thiếu giờ hoặc bỏ trống. Từ hôm nay tập thói quen: KHÔNG BAO GIỜ để trống – đoán vẫn có 25% cơ hội đúng.",
      },
      {
        title: "Trợ từ (2) + kanji thiên nhiên, cơ thể",
        tasks: [
          ["kanji", "Kanji 16–30: 日 月 火 水 木 金 土 人 口 目 耳 手 足 山 川", 20],
          ["vocab", "30 từ: gia đình (ちち/はは/おとうさん…), cơ thể", 20],
          ["grammar", "Trợ từ へ・と・も・の・から・まで・や・か; phân biệt に/へ và で/に (nơi chốn)", 35],
          ["reading", "2 bài 問題4 (đoản văn) – chưa bấm giờ. Cách đọc: đọc câu hỏi trước → gạch từ khóa → tìm trong bài", 25],
          ["listening", "Shadowing 1 đoạn hội thoại ngắn", 10],
        ],
        tip: "Trong đọc hiểu N5, đáp án gần như luôn được diễn đạt lại (言い換え) chứ không chép y nguyên câu trong bài.",
      },
      {
        title: "Thời gian, số đếm + thể ます",
        tasks: [
          ["kanji", "Kanji 31–45: 上 下 左 右 中 外 前 後 東 西 南 北 名 今 時", 20],
          ["vocab", "Ngày tháng (ついたち〜とおか, はつか), phút (ふん/ぷん), trợ số từ つ・人・本・枚・台・回・階", 30],
          ["grammar", "Thể ます: ます/ません/ました/ませんでした; 〜ませんか・〜ましょう・〜ましょうか", 30],
          ["listening", "問題2 (ポイント理解) ×3 bài – nghe kỹ câu hỏi đầu, ghi chú số/giờ/ngày", 20],
          ["review", "Anki: ôn thẻ ngày 1–2", 15],
        ],
        tip: "Cách đọc ngày tháng (よっか, ようか, ここのか, はつか) và trợ số từ (いっぽん/にほん/さんぼん) là bẫy kinh điển của 問題1.",
      },
      {
        title: "Động từ cơ bản + thể て",
        tasks: [
          ["kanji", "Kanji 46–60: 行 来 出 入 見 聞 読 書 話 言 食 飲 買 休 会", 20],
          ["vocab", "40 động từ N5 (nhóm 1/2/3); cặp tự/tha động từ: あく/あける, しまる/しめる, つく/つける", 30],
          ["grammar", "Chia thể て + 〜てください・〜ています・〜てもいいです・〜てはいけません", 35],
          ["reading", "2 bài 問題4 – mục tiêu ≤ 4 phút/bài", 15],
          ["listening", "Shadowing 10 phút", 10],
        ],
        tip: "Học thuộc bài “thể て” theo vần: う・つ・る → って / む・ぶ・ぬ → んで / く → いて / ぐ → いで / す → して (ngoại lệ: いく → いって).",
      },
      {
        title: "Tính từ + câu chào hỏi cố định",
        tasks: [
          ["kanji", "Kanji 61–75: 大 小 高 安 長 新 古 多 少 白 学 校 先 生 友", 20],
          ["vocab", "40 tính từ い/な + cặp trái nghĩa (たかい↔やすい/ひくい, ひろい↔せまい, おもい↔かるい…)", 30],
          ["grammar", "Chia tính từ (hiện tại/quá khứ/phủ định), nối câu 〜くて / 〜で", 30],
          ["listening", "問題3 (発話表現): học thuộc 20 câu cố định – いただきます, しつれいします, いってきます, おねがいします…", 20],
          ["review", "Anki + sổ lỗi", 15],
        ],
        tip: "いい → よくない / よかった (không phải いくない). きれい・ゆうめい・きらい là tính từ な dù kết thúc bằng い.",
      },
      {
        title: "Kanji cuối + thể ない/た + mini test",
        weekend: true,
        tasks: [
          ["kanji", "Kanji 76–100: 男 女 子 父 母 国 語 本 半 分 午 毎 週 何 電 車 駅 道 店 社 天 気 雨 花 空", 40],
          ["vocab", "40 từ: địa điểm, phương tiện, đồ vật trong nhà", 30],
          ["grammar", "Thể ない: 〜ないでください・〜なければなりません; thể た: 〜たことがあります・〜たり〜たりします・〜たあとで", 45],
          ["test", "Mini test: phần 文字・語彙 của 1 đề cũ, bấm đúng 20 phút → ghi % đúng", 25],
          ["review", "Chép câu sai vào sổ lỗi, tra lại từ", 30],
        ],
        tip: "So sánh % 文字・語彙 với lần đầu (22.5%). Chỉ sau 6 ngày học kanji bạn sẽ thấy 問題1 dễ hơn hẳn.",
      },
      {
        title: "Tổng ôn tuần 1",
        weekend: true,
        tasks: [
          ["kanji", "Tự kiểm tra 100 kanji: che nghĩa, đọc to → đánh dấu chữ sai và học lại", 40],
          ["grammar", "30 câu trắc nghiệm dạng 問題1 (trợ từ + chia động từ)", 30],
          ["vocab", "Anki: ôn toàn bộ thẻ đến hạn", 30],
          ["review", "Sổ lỗi: đọc lại, gom lỗi theo nhóm (trợ từ / trường âm / âm đục / chia động từ)", 30],
          ["rest", "Tối nghỉ: xem 1 tập phim/anime có phụ đề tiếng Nhật", 0],
        ],
        tip: "Nghỉ là một phần của kế hoạch. Não cần thời gian để ghi nhớ dài hạn.",
      },
    ],
  },
  {
    name: "Tuần 2 — Tăng tốc",
    goal: "Ngữ pháp mở rộng, chiến thuật đọc hiểu, luyện đủ 4 dạng nghe, Mock test 1",
    days: [
      {
        title: "So sánh, mong muốn + Katakana",
        tasks: [
          ["grammar", "〜より〜のほうが・〜の中で〜がいちばん・〜たい・〜がほしい・〜に行きます (mục đích)", 35],
          ["vocab", "40 từ katakana hay ra: テーブル, エレベーター, コピー, シャワー, ポケット, ハンカチ, ボールペン…", 25],
          ["reading", "3 bài 問題4 bấm giờ – 3 phút/bài", 20],
          ["listening", "Shadowing 10 phút", 10],
        ],
        tip: "〜たい dùng cho hành động của BẢN THÂN; 〜がほしい dùng cho đồ vật muốn có.",
      },
      {
        title: "Liên kết hành động + sắp xếp câu ★",
        tasks: [
          ["grammar", "〜まえに・〜てから・〜とき・〜ながら・〜つもりです", 30],
          ["grammar", "Chiến thuật 問題2 (★): ghép cụm cố định trước (danh từ+trợ từ, tính từ+danh từ), động từ thường đứng cuối → 10 câu", 25],
          ["reading", "1 bài 問題5 (đoạn văn trung bình) – ~6 phút", 15],
          ["listening", "問題1 (課題理解) ×4: chú ý まず / それから / あとで để biết việc làm TRƯỚC", 20],
        ],
        tip: "Câu ★: viết 4 lựa chọn ra nháp, xếp đủ cả câu rồi mới chọn vị trí ★. Đừng đoán vị trí ★ khi chưa xếp xong.",
      },
      {
        title: "Từ để hỏi + 言い換え",
        tasks: [
          ["grammar", "Từ để hỏi + か/も (だれか/だれも, なにか/なにも); もう〜ました / まだ〜ていません; 〜でしょう", 30],
          ["vocab", "問題4 (言い換え) 20 câu + học cặp tương đương (おととい = 2日前, せんたくする = ふくをあらう…)", 25],
          ["vocab", "問題3 (文脈規定) 15 câu", 15],
          ["listening", "問題4 (即時応答) ×10 – phản xạ nhanh, chọn ngay, không quay lại", 15],
        ],
        tip: "問題4 言い換え: đọc cả câu gốc rồi tìm câu có NGHĨA giống, không phải câu có TỪ giống.",
      },
      {
        title: "Đọc tìm thông tin + ngữ pháp đoạn văn",
        tasks: [
          ["reading", "問題6 (情報検索) ×2: đọc câu hỏi + điều kiện trước → quét bảng/thông báo, KHÔNG đọc hết", 25],
          ["grammar", "問題3 (文章の文法) ×2 bài: chú ý từ nối それから・でも・だから・では", 25],
          ["kanji", "30 câu 問題1 (đọc kanji) + 問題2 (chọn chữ viết đúng)", 25],
          ["vocab", "Anki", 15],
        ],
        tip: "問題6 thường hỏi: giá tiền, ngày giờ, điều kiện. Khoanh tròn các con số/điều kiện trong câu hỏi trước khi nhìn bảng.",
      },
      {
        title: "Ngày Nghe",
        tasks: [
          ["listening", "1 phần 聴解 hoàn chỉnh (30 phút) bấm giờ, ghi điểm", 30],
          ["listening", "Đọc script câu sai, nghe lại 2 lần, shadowing các câu sai", 35],
          ["vocab", "Thêm từ mới nghe được vào Anki", 15],
        ],
        tip: "問題1 & 問題2: tranh/lựa chọn có sẵn trong đề – nhìn trước khi audio bắt đầu để đoán nội dung.",
      },
      {
        title: "MOCK TEST 1 – đề full",
        weekend: true,
        tasks: [
          ["test", "Đề full chưa làm: 文字・語彙 20' → 文法・読解 40' → 聴解 30', làm liên tục như thi thật", 90],
          ["test", "Phần 40': 文法 ≤ 18 phút, 読解 ≥ 20 phút, 2 phút cuối tô/đoán hết câu còn trống", 0],
          ["review", "Chấm điểm và nhập vào “Bảng theo dõi điểm” bên dưới", 15],
          ["review", "Phân tích từng câu sai: không biết từ / không biết ngữ pháp / hết giờ / bất cẩn", 60],
        ],
        tip: "Mục tiêu Mock 1: 言語知識・読解 ≥ 45/120 (vượt điểm liệt 38).",
      },
      {
        title: "Vá lỗ hổng sau Mock 1",
        weekend: true,
        tasks: [
          ["review", "90 phút cho mảng yếu nhất theo kết quả Mock 1", 90],
          ["grammar", "Ôn toàn bộ mẫu ngữ pháp tuần 1–2, tự đặt 1 câu/mẫu", 40],
          ["vocab", "Anki ôn", 20],
          ["rest", "Tối nghỉ ngơi", 0],
        ],
        tip: "Nếu lỗi chủ yếu là “hết giờ” → tuần 3 tập trung bấm giờ, không cần học thêm kiến thức mới.",
      },
    ],
  },
  {
    name: "Tuần 3 — Luyện đề & về đích",
    goal: "2 Mock test nữa, luyện tốc độ, sửa lỗi, giữ sức cho ngày thi",
    days: [
      {
        title: "Tốc độ đọc + ngữ pháp",
        tasks: [
          ["reading", "1 set đọc hiểu đầy đủ (問題4 + 5 + 6) trong 20 phút", 25],
          ["grammar", "20 câu dạng 問題1 trong 10 phút (~30 giây/câu)", 20],
          ["kanji", "Anki + 30 câu đọc kanji", 25],
          ["listening", "Shadowing 10 phút", 10],
        ],
        tip: "Câu ngữ pháp nghĩ quá 45 giây → chọn đáp án tốt nhất, đánh dấu, đi tiếp.",
      },
      {
        title: "Từ vựng tốc độ + bẫy kanji",
        tasks: [
          ["vocab", "1 phần 文字・語彙 đầy đủ (đề mới) bấm 20 phút – cố xong trong 15 phút", 25],
          ["kanji", "Bẫy đọc: trường âm (おばさん/おばあさん), âm ngắt (がっこう, きって), âm đục (びょういん/びよういん)", 25],
          ["listening", "問題1 ×3 + 問題2 ×3", 25],
        ],
        tip: "Phần từ vựng chỉ 20 phút – không ngồi nghĩ lâu. Không nhớ thì loại trừ rồi chọn.",
      },
      {
        title: "MOCK TEST 2 – đề full",
        tasks: [
          ["test", "Đề full mới: 20' + 40' + 30', như thi thật", 90],
          ["review", "Chấm, nhập điểm, so sánh với Mock 1", 20],
        ],
        tip: "Mục tiêu Mock 2: tổng ≥ 85/180.",
      },
      {
        title: "Sửa lỗi Mock 2",
        tasks: [
          ["review", "Phân tích lỗi Mock 2, học lại 100% từ & ngữ pháp sai", 45],
          ["listening", "問題3 ×10 + 問題4 ×10", 25],
          ["kanji", "Kiểm tra lại nhóm kanji đã đánh dấu sai ở ngày 7", 20],
        ],
        tip: "Đừng học thêm tài liệu mới từ đây – chỉ củng cố những gì đã học.",
      },
      {
        title: "MOCK TEST 3 (đề mẫu chính thức)",
        tasks: [
          ["test", "Mock 3: đề mẫu/公式問題集 JLPT N5 hoặc 1 đề cũ còn lại", 90],
          ["review", "Chấm, nhập điểm; chỉ xem lại câu sai, không học kiến thức mới", 30],
        ],
        tip: "Mục tiêu Mock 3: tổng ≥ 95/180. Nếu đạt, bạn đã sẵn sàng.",
      },
      {
        title: "Ôn nhẹ & chuẩn bị đồ",
        weekend: true,
        tasks: [
          ["review", "Lướt sổ lỗi + danh sách ngữ pháp", 60],
          ["vocab", "Anki nhẹ", 20],
          ["rest", "Chuẩn bị: phiếu dự thi (受験票), CCCD/hộ chiếu, bút chì HB/2B, gôm, đồng hồ kim (không smartwatch), nước", 15],
          ["rest", "Xem lại địa điểm & giờ có mặt; ngủ trước 23h", 0],
        ],
        tip: "Hôm nay không làm đề. Ngủ đủ giấc quan trọng hơn 1 giờ học thêm.",
      },
      {
        title: "NGÀY THI 🎯",
        exam: true,
        tasks: [
          ["listening", "Sáng: nghe tiếng Nhật 15 phút để “làm nóng tai”", 15],
          ["kanji", "Lướt flashcard kanji dễ nhầm", 10],
          ["test", "Trong phòng thi: không bỏ trống câu nào – câu khó thì đoán, đánh dấu, đi tiếp", 0],
          ["test", "文法・読解: đến phút 18 phải chuyển sang đọc hiểu", 0],
        ],
        tip: "Làm xong phần nào, quên phần đó – tập trung hoàn toàn vào phần tiếp theo. がんばって！",
      },
    ],
  },
];

/* =========================================================
   State
   ========================================================= */
const state = loadState();
let currentTab = "all";

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (s && typeof s === "object") return { done: s.done || {}, scores: s.scores || {}, open: s.open || {} };
  } catch (e) { /* ignore */ }
  return { done: {}, scores: {}, open: {} };
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* =========================================================
   Helpers
   ========================================================= */
const WEEKDAYS = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const $ = (sel) => document.querySelector(sel);

function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function todayMidnight() {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Gắn số thứ tự & ngày cho từng ngày học
const ALL_DAYS = [];
(function indexDays() {
  const start = parseDate(START_DATE);
  let n = 0;
  WEEKS.forEach((w, wi) => {
    w.days.forEach((d) => {
      d.no = n + 1;
      d.week = wi;
      d.date = addDays(start, n);
      d.id = "d" + d.no;
      ALL_DAYS.push(d);
      n++;
    });
  });
})();

function taskKey(day, i) { return day.id + "-" + i; }
function dayProgress(day) {
  const total = day.tasks.length;
  const done = day.tasks.filter((_, i) => state.done[taskKey(day, i)]).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/* =========================================================
   Render: phân tích
   ========================================================= */
function renderSkills() {
  $("#skill-bars").innerHTML = SKILLS.map((s) => {
    const now = Math.round(s.now * 10) / 10;
    return `
      <div class="skill-row" title="${s.vi}: hiện tại ${now}% · mục tiêu ${s.target}%">
        <div class="skill-name jp">${s.jp}<small>${s.vi}</small></div>
        <div class="skill-track">
          <div class="skill-fill" style="width:${s.now}%"></div>
          <div class="skill-target" style="left:${s.target}%"></div>
        </div>
        <div class="skill-val">${now}%<small>→ ${s.target}%</small></div>
      </div>`;
  }).join("");

  $("#priority-list").innerHTML = PRIORITIES.map((p, i) => `
    <li><span class="num">${i + 1}</span><div><strong>${p.title}</strong><span class="desc">${p.desc}</span></div></li>
  `).join("");

  $("#routine").innerHTML = ROUTINE.map((r) => `
    <div class="routine-item"><div class="when">${r.when}</div><div class="dur">${r.dur}</div><p>${r.text}</p></div>
  `).join("");

  $("#resources").innerHTML = RESOURCES.map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("");

  $("#cat-legend").innerHTML = Object.values(CATS)
    .map((c) => `<span><i class="dot" style="background:${c.color}"></i>${c.label}</span>`).join("");
}

/* =========================================================
   Render: kế hoạch
   ========================================================= */
function renderTabs() {
  const tabs = [{ id: "all", label: "Tất cả" }].concat(WEEKS.map((w, i) => ({ id: String(i), label: "Tuần " + (i + 1) })));
  $("#tabs").innerHTML = tabs.map((t) =>
    `<button class="tab" role="tab" data-tab="${t.id}" aria-selected="${t.id === currentTab}">${t.label}</button>`
  ).join("");
}

function ringSvg(pct) {
  const r = 15, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 38 38" aria-label="${pct}% hoàn thành">
    <circle class="bg" cx="19" cy="19" r="${r}"></circle>
    <circle class="fg" cx="19" cy="19" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"></circle>
    <text x="19" y="22.5" text-anchor="middle">${pct}%</text>
  </svg>`;
}

function renderDay(day) {
  const today = todayMidnight();
  const isToday = sameDay(day.date, today);
  const prog = dayProgress(day);
  const minutes = day.tasks.reduce((s, t) => s + (t[2] || 0), 0);
  const open = state.open[day.id] !== undefined ? state.open[day.id] : (isToday || (prog.pct < 100 && day.date >= today && day.no <= todayIndex() + 2));
  const cls = ["day", isToday && "is-today", prog.pct === 100 && "is-done", day.exam && "is-exam"].filter(Boolean).join(" ");

  const tasks = day.tasks.map(([cat, text, min], i) => {
    const key = taskKey(day, i);
    const checked = !!state.done[key];
    const c = CATS[cat];
    return `
      <li class="task ${checked ? "done" : ""}">
        <label>
          <input type="checkbox" data-key="${key}" ${checked ? "checked" : ""} />
          <span class="tag" style="color:${c.color}">${c.label}</span>
          <span class="t-text">${escapeHtml(text)}</span>
          <span class="t-min">${min ? min + "'" : ""}</span>
        </label>
      </li>`;
  }).join("");

  return `
    <details class="${cls}" id="${day.id}" data-day="${day.id}" ${open ? "open" : ""}>
      <summary class="day-summary">
        <div class="day-date">
          <div class="d">${day.date.getDate()}/${day.date.getMonth() + 1}</div>
          <div class="w">${WEEKDAYS[day.date.getDay()]}</div>
        </div>
        <div>
          <div class="day-no">Ngày ${day.no}${day.weekend ? " · cuối tuần" : ""}</div>
          <div class="day-title">${escapeHtml(day.title)}${isToday ? '<span class="badge-today">HÔM NAY</span>' : ""}${day.exam ? '<span class="badge-exam">THI</span>' : ""}</div>
        </div>
        <div class="day-meta">${minutes ? "⏱ " + (minutes >= 60 ? Math.floor(minutes / 60) + "h" + (minutes % 60 ? String(minutes % 60).padStart(2, "0") : "") : minutes + "'") : ""}${ringSvg(prog.pct)}</div>
      </summary>
      <div class="day-body">
        <ul class="tasks">${tasks}</ul>
        ${day.tip ? `<div class="tip">💡 ${escapeHtml(day.tip)}</div>` : ""}
      </div>
    </details>`;
}

function renderWeeks() {
  $("#weeks").innerHTML = WEEKS.map((w, wi) => {
    if (currentTab !== "all" && currentTab !== String(wi)) return "";
    const done = w.days.reduce((s, d) => s + dayProgress(d).done, 0);
    const total = w.days.reduce((s, d) => s + d.tasks.length, 0);
    const first = w.days[0].date, last = w.days[w.days.length - 1].date;
    return `
      <div class="week">
        <div class="week-head">
          <div>
            <h3>${w.name} <span class="week-progress">(${first.getDate()}/${first.getMonth() + 1} – ${last.getDate()}/${last.getMonth() + 1})</span></h3>
            <div class="goal">🎯 ${w.goal}</div>
          </div>
          <div class="week-progress">${done}/${total} việc · ${total ? Math.round((done / total) * 100) : 0}%</div>
        </div>
        <div class="days">${w.days.map(renderDay).join("")}</div>
      </div>`;
  }).join("");
}

function todayIndex() {
  const diff = Math.round((todayMidnight() - parseDate(START_DATE)) / 86400000);
  return diff; // 0-based
}

/* =========================================================
   Render: header & tracker
   ========================================================= */
function renderHeader() {
  const days = Math.round((parseDate(EXAM_DATE) - todayMidnight()) / 86400000);
  if (days > 0) {
    $("#countdown").textContent = days;
    $("#countdown-label").textContent = "ngày đến kỳ thi (" + EXAM_DATE.split("-").reverse().join("/") + ")";
  } else if (days === 0) {
    $("#countdown").textContent = "🎯";
    $("#countdown-label").textContent = "Hôm nay thi – がんばって！";
  } else {
    $("#countdown").textContent = "✓";
    $("#countdown-label").textContent = "Đã thi xong";
  }

  let done = 0, total = 0;
  ALL_DAYS.forEach((d) => { const p = dayProgress(d); done += p.done; total += p.total; });
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("#overall-pct").textContent = pct + "%";
  $("#overall-bar").style.width = pct + "%";
}

const SCORE_ROWS = [
  { id: "base", label: "Bài test đầu (2025年12月)", fixed: { lang: 24, listen: 22 } },
  { id: "m1", label: "Mock 1 (ngày 13 – 28/11)" },
  { id: "m2", label: "Mock 2 (ngày 17 – 2/12)" },
  { id: "m3", label: "Mock 3 (ngày 19 – 4/12)" },
];

function judge(lang, listen) {
  if (lang === "" || listen === "" || lang == null || listen == null || isNaN(lang) || isNaN(listen)) {
    return { total: "–", html: '<span class="pill none">Chưa có</span>' };
  }
  const total = lang + listen;
  const fails = [];
  if (lang < 38) fails.push("言語知識・読解 < 38");
  if (listen < 19) fails.push("聴解 < 19");
  if (total < 80) fails.push("Tổng < 80");
  const html = fails.length
    ? `<span class="pill fail">✗ Trượt <small>(${fails.join(", ")})</small></span>`
    : `<span class="pill pass">✓ Đỗ <small>(dư ${total - 80} điểm)</small></span>`;
  return { total, html };
}

function renderScores() {
  $("#score-body").innerHTML = SCORE_ROWS.map((r) => {
    const s = r.fixed || state.scores[r.id] || {};
    const lang = s.lang ?? "";
    const listen = s.listen ?? "";
    const j = judge(lang === "" ? "" : Number(lang), listen === "" ? "" : Number(listen));
    const input = (field, max, val) => r.fixed
      ? `<strong>${val}</strong>`
      : `<input type="number" min="0" max="${max}" data-row="${r.id}" data-field="${field}" value="${val}" placeholder="0–${max}" />`;
    return `<tr>
      <td>${r.label}</td>
      <td>${input("lang", 120, lang)}</td>
      <td>${input("listen", 60, listen)}</td>
      <td class="total" data-total="${r.id}">${j.total}</td>
      <td data-result="${r.id}">${j.html}</td>
    </tr>`;
  }).join("");
}

function renderAll() {
  renderHeader();
  renderTabs();
  renderWeeks();
}

/* =========================================================
   Events
   ========================================================= */
document.addEventListener("change", (e) => {
  const el = e.target;
  if (el.matches('input[type="checkbox"][data-key]')) {
    if (el.checked) state.done[el.dataset.key] = true;
    else delete state.done[el.dataset.key];
    saveState();
    renderHeader();
    renderWeeks();
  }
});

document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.matches("input[data-row]")) {
    const max = Number(el.max);
    let v = el.value === "" ? "" : Math.max(0, Math.min(max, Number(el.value)));
    const row = (state.scores[el.dataset.row] = state.scores[el.dataset.row] || {});
    row[el.dataset.field] = v;
    saveState();
    const lang = row.lang ?? "", listen = row.listen ?? "";
    const j = judge(lang === "" ? "" : Number(lang), listen === "" ? "" : Number(listen));
    document.querySelector(`[data-total="${el.dataset.row}"]`).textContent = j.total;
    document.querySelector(`[data-result="${el.dataset.row}"]`).innerHTML = j.html;
  }
});

// Ghi nhớ trạng thái mở/đóng của từng ngày
document.addEventListener("click", (e) => {
  const summary = e.target.closest("summary.day-summary");
  if (!summary) return;
  const details = summary.parentElement;
  state.open[details.dataset.day] = !details.open; // trạng thái sau khi click
  saveState();
});

$("#tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  currentTab = btn.dataset.tab;
  renderTabs();
  renderWeeks();
});

$("#btn-today").addEventListener("click", () => {
  let idx = todayIndex();
  if (idx < 0) idx = 0;
  if (idx >= ALL_DAYS.length) idx = ALL_DAYS.length - 1;
  const day = ALL_DAYS[idx];
  if (currentTab !== "all" && currentTab !== String(day.week)) {
    currentTab = String(day.week);
    renderTabs();
    renderWeeks();
  }
  const el = document.getElementById(day.id);
  el.open = true;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#btn-reset").addEventListener("click", () => {
  if (!confirm("Xoá toàn bộ tiến độ và điểm thi thử đã nhập?")) return;
  state.done = {}; state.scores = {}; state.open = {};
  saveState();
  renderAll();
  renderScores();
});

/* =========================================================
   Init
   ========================================================= */
renderSkills();
renderScores();
renderAll();
