// 👥 STARS メンバーページ

// ===== サンプルデータ（実際はサーバーから取得）=====
const membersData = [
  // ── 講師 ──
  { id: 101, name: '大野 誠一',   grade: '講師', role: '講師', birthday: '4月12日', subjects: ['数学', '物理'],   favoriteSubjects: ['数学', '天文学', 'パズル'],       message: '諦めなければ必ず伸びます！一緒に頑張ろう。', color: '#ffaa33', avatar: '' },
  { id: 102, name: '田中 鷹併',   grade: '講師', role: '講師', birthday: '6月18日',  subjects: ['英語', '数学', '情報'], favoriteSubjects: ['英語', '数学', '情報'],     message: 'この塾において一番の努力家になります。塾生よ、ついてこい！',         color: '#ff7755', avatar: '' },
  { id: 103, name: '前田 拓海',   grade: '講師', role: '講師', birthday: '1月27日', subjects: ['数学', '理科'],   favoriteSubjects: ['数学', '化学', 'ドライブ'],       message: '基礎をしっかり固めれば応用は自然とついてくる。', color: '#ff9922', avatar: '' },
  // ── 生徒 ──
  { id: 1,  name: '田中 太郎',   grade: '高3', role: '生徒', birthday: '5月18日', classInfo: '高3 Aクラス', club: '野球部',     monthHours: 120, streak: 28, subjects: ['数学', '英語', '物理'],       message: '東大を目指して毎日頑張ります！',           color: '#4ec5ff', avatar: '' },
  { id: 2,  name: '佐藤 花子',   grade: '高3', role: '生徒', birthday: '7月2日',  classInfo: '高3 Bクラス', club: '吹奏楽部',   monthHours: 115, streak: 25, subjects: ['英語', '国語', '世界史'],     message: '英語が得意です。一緒に頑張りましょう！',   color: '#ff8c66', avatar: '' },
  { id: 3,  name: '鈴木 一郎',   grade: '高2', role: '生徒', birthday: '11月14日', classInfo: '高2 Aクラス', club: 'サッカー部', monthHours: 110, streak: 22, subjects: ['数学', '理科'],               message: '毎日コツコツ積み上げる！',                 color: '#66ffb3', avatar: '' },
  { id: 4,  name: '高橋 美咲',   grade: '高2', role: '生徒', birthday: '3月9日',  classInfo: '高2 Cクラス', club: '茶道部',     monthHours: 105, streak: 20, subjects: ['英語', '数学', '化学'],       message: '志望校合格まで諦めない。',                 color: '#ff66cc', avatar: '' },
  { id: 5,  name: '渡辺 健太',   grade: '高1', role: '生徒', birthday: '8月21日', classInfo: '高1 Bクラス', club: '陸上部',     monthHours: 98,  streak: 18, subjects: ['英語', '社会'],               message: '受験まで長いけど今から準備！',             color: '#ffcc44', avatar: '' },
  { id: 6,  name: '伊藤 さくら', grade: '中3', role: '生徒', birthday: '12月5日', classInfo: '中3 Aクラス', club: '美術部',     monthHours: 95,  streak: 17, subjects: ['数学', '理科', '英語'],       message: '高校受験に向けて全力投球！',               color: '#aa88ff', avatar: '' },
  { id: 7,  name: '山本 大輔',   grade: '中3', role: '生徒', birthday: '2月11日', classInfo: '中3 Bクラス', club: 'バスケ部',   monthHours: 92,  streak: 16, subjects: ['英語', '国語'],               message: '志望校に絶対受かる！',                     color: '#44ddff', avatar: '' },
  { id: 8,  name: '中村 愛',     grade: '高3', role: '生徒', birthday: '6月30日', classInfo: '高3 Aクラス', club: '生物部',     monthHours: 88,  streak: 15, subjects: ['生物', '英語', '国語'],       message: '医学部を目指して努力中。',                 color: '#ff9966', avatar: '' },
  { id: 9,  name: '小林 翔太',   grade: '高1', role: '生徒', birthday: '10月8日', classInfo: '高1 Aクラス', club: '物理研究会', monthHours: 85,  streak: 14, subjects: ['数学', '物理'],               message: '理系を目指して勉強中！',                   color: '#66ff88', avatar: '' },
  { id: 10, name: '加藤 結衣',   grade: '高2', role: '生徒', birthday: '1月16日', classInfo: '高2 Bクラス', club: '文芸部',     monthHours: 82,  streak: 12, subjects: ['英語', '現代文'],             message: '文系志望。語学が好きです。',               color: '#ff66aa', avatar: '' },
  { id: 11, name: '松本 悠斗',   grade: '中2', role: '生徒', birthday: '4月25日', classInfo: '中2 Aクラス', club: '卓球部',     monthHours: 75,  streak: 10, subjects: ['数学', '理科'],               message: 'まだまだこれから頑張ります！',             color: '#88ccff', avatar: '' },
  { id: 12, name: '井上 千夏',   grade: '中1', role: '生徒', birthday: '9月19日', classInfo: '中1 Bクラス', club: 'バレー部',   monthHours: 68,  streak: 8,  subjects: ['英語', '算数'],               message: '中学生になって勉強が楽しくなった！',       color: '#ffaa66', avatar: '' },
  { id: 13, name: '木村 奏太',   grade: '浪人', role: '生徒', birthday: '7月27日', classInfo: '浪人クラス',  club: '－',         monthHours: 132, streak: 30, subjects: ['数学', '英語', '物理', '化学'], message: '今年こそ！全力で臨みます。',             color: '#ff4488', avatar: '' },
  { id: 14, name: '林 ひかり',   grade: '高3', role: '生徒', birthday: '12月22日', classInfo: '高3 Cクラス', club: '演劇部',     monthHours: 78,  streak: 11, subjects: ['英語', '数学', '日本史'],     message: '私大志望。文武両道を目指す。',             color: '#66eecc', avatar: '' },
  { id: 15, name: '清水 蓮',     grade: '中2', role: '生徒', birthday: '3月1日',  classInfo: '中2 Bクラス', club: '水泳部',     monthHours: 62,  streak: 9,  subjects: ['英語', '国語'],               message: 'テストで満点を取りたい！',                 color: '#bb88ff', avatar: '' },
  { id: 16, name: '山田 葵',     grade: '高1', role: '生徒', birthday: '11月7日', classInfo: '高1 Aクラス', club: '科学部',     monthHours: 70,  streak: 13, subjects: ['数学', '生物'],               message: '理系の道を歩んでいきます。',               color: '#44ffcc', avatar: '' },
];

// 表示はしないが、名前順ソートの精度を上げるために保持
const furiganaById = {
  101: 'おおの せいいち',
  102: 'たなか たかなみ',
  103: 'まえだ たくみ',
  1: 'たなか たろう',
  2: 'さとう はなこ',
  3: 'すずき いちろう',
  4: 'たかはし みさき',
  5: 'わたなべ けんた',
  6: 'いとう さくら',
  7: 'やまもと だいすけ',
  8: 'なかむら あい',
  9: 'こばやし しょうた',
  10: 'かとう ゆい',
  11: 'まつもと ゆうと',
  12: 'いのうえ ちなつ',
  13: 'きむら そうた',
  14: 'はやし ひかり',
  15: 'しみず れん',
  16: 'やまだ あおい'
};

// ===== 状態 =====
let currentGrade  = 'all';
let currentSort   = 'grade';
let currentSearch = '';
let myName = '';

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  myName = localStorage.getItem('fullname') || '';

  setupNavHoverClass();

  updateStats();
  renderMembers();

  // 学年フィルター
  document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGrade = btn.dataset.grade;
      renderMembers();
    });
  });

  // ソート
  document.getElementById('memberSort').addEventListener('change', e => {
    currentSort = e.target.value;
    renderMembers();
  });

  // 検索（リアルタイム）
  document.getElementById('memberSearch').addEventListener('input', e => {
    currentSearch = e.target.value.trim();
    renderMembers();
  });

  // モーダルを閉じる
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});

// ===== 統計バーを更新 =====
function updateStats() {
  const studentMembers = membersData.filter(member => member.role !== '講師');
  const active = studentMembers.filter(member => Number(member.monthHours) > 0).length;
  const totalHours = studentMembers.reduce((sum, member) => sum + Number(member.monthHours || 0), 0);
  const avg = studentMembers.length ? Math.round(totalHours / studentMembers.length) : 0;

  document.getElementById('total-count').textContent  = `${membersData.length}人`;
  document.getElementById('active-count').textContent = `${active}人`;
  document.getElementById('avg-hours').textContent    = `${avg}時間`;
}

// ===== フィルター＆ソート適用 =====
function getFilteredSorted() {
  const gradeOrder = { '講師': 0, '高3': 1, '高2': 2, '高1': 3, '中3': 4, '中2': 5, '中1': 6, '浪人': 7 };

  // ランキングは「生徒のみ」で計算
  const studentRankMap = new Map(
    [...membersData]
      .filter(member => member.role !== '講師')
      .sort((a, b) => Number(b.monthHours || 0) - Number(a.monthHours || 0))
      .map((member, index) => [member.id, index + 1])
  );

  let result = membersData.map(member => ({
    ...member,
    rank: member.role === '講師' ? null : studentRankMap.get(member.id)
  }));

  if (currentGrade !== 'all') {
    result = result.filter(member => member.grade === currentGrade);
  }

  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    result = result.filter(member => member.name.toLowerCase().includes(q));
  }

  const teacherFirst = (a, b) => {
    if (a.role === '講師' && b.role !== '講師') return -1;
    if (a.role !== '講師' && b.role === '講師') return 1;
    return 0;
  };

  const compareByGrade = (a, b) => {
    const teacherDiff = teacherFirst(a, b);
    if (teacherDiff !== 0) return teacherDiff;
    const gradeDiff = (gradeOrder[a.grade] ?? 99) - (gradeOrder[b.grade] ?? 99);
    if (gradeDiff !== 0) return gradeDiff;
    return sortNameKey(a).localeCompare(sortNameKey(b), 'ja');
  };

  switch (currentSort) {
    case 'name':
      result.sort((a, b) => {
        return sortNameKey(a).localeCompare(sortNameKey(b), 'ja');
      });
      break;
    case 'hours':
      result.sort((a, b) => {
        const teacherDiff = teacherFirst(a, b);
        if (teacherDiff !== 0) return teacherDiff;
        return Number(b.monthHours || 0) - Number(a.monthHours || 0);
      });
      break;
    case 'streak':
      result.sort((a, b) => {
        const teacherDiff = teacherFirst(a, b);
        if (teacherDiff !== 0) return teacherDiff;
        return Number(b.streak || 0) - Number(a.streak || 0);
      });
      break;
    case 'birthday':
      result.sort((a, b) => {
        const birthdayDiff = birthdaySortKey(a) - birthdaySortKey(b);
        if (birthdayDiff !== 0) return birthdayDiff;
        return sortNameKey(a).localeCompare(sortNameKey(b), 'ja');
      });
      break;
    case 'rank':
      result.sort((a, b) => {
        const teacherDiff = teacherFirst(a, b);
        if (teacherDiff !== 0) return teacherDiff;
        return Number(a.rank || 999) - Number(b.rank || 999);
      });
      break;
    default:
      result.sort(compareByGrade);
      break;
  }

  return result;
}

// ===== アバター背景色を薄く =====
function avatarStyle(color) {
  return `background: linear-gradient(135deg, ${color}cc, ${color}88);`;
}

// ===== ランクバッジクラス =====
function rankClass(rank) {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return 'rank-normal';
}

function cardAvatarMarkup(member, initial) {
  if (member.avatar) {
    return `<div class="member-avatar member-avatar-photo" style="${avatarStyle(member.color)}"><img src="${member.avatar}" alt="${member.name}の写真" class="member-avatar-image" loading="lazy"></div>`;
  }
  return `<div class="member-avatar" style="${avatarStyle(member.color)}">${initial(member.name)}</div>`;
}

function displayName(member) {
  if (member.role !== '講師') return member.name;
  const familyName = (member.name || '').trim().split(/[ 　]+/)[0] || member.name;
  return `${familyName}先生`;
}

function birthdaySortKey(member) {
  const matched = String(member.birthday || '').match(/(\d+)月(\d+)日/);
  if (!matched) return 9999;
  return Number(matched[1]) * 100 + Number(matched[2]);
}

function sortNameKey(member) {
  return furiganaById[member.id] || member.name;
}

function setupNavHoverClass() {
  document.querySelectorAll('.header-nav .nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => link.classList.add('js-hovered'));
    link.addEventListener('mouseleave', () => link.classList.remove('js-hovered'));
    link.addEventListener('focus', () => link.classList.add('js-hovered'));
    link.addEventListener('blur', () => link.classList.remove('js-hovered'));
  });
}

function setHoveredCard(grid, targetCard) {
  grid.querySelectorAll('.member-card').forEach(card => {
    card.classList.toggle('js-hovered', card === targetCard);
  });
}

function clearHoveredCard(grid) {
  grid.querySelectorAll('.member-card').forEach(card => {
    card.classList.remove('js-hovered');
  });
}

// ===== メンバーグリッドをレンダリング =====
function renderMembers() {
  const grid       = document.getElementById('members-grid');
  const emptyState = document.getElementById('empty-state');
  const data       = getFilteredSorted();

  grid.innerHTML = '';

  if (data.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  const initial = name => name.charAt(0);
  const showGroupIndex = currentSort === 'grade';
  let previousGrade = null;
  let groupIndex = 0;

  data.forEach((member, idx) => {
    if (showGroupIndex && member.grade !== previousGrade) {
      groupIndex += 1;
      const divider = document.createElement('div');
      divider.className = 'grade-separator';
      divider.innerHTML = `<span class="grade-separator-index">INDEX ${String(groupIndex).padStart(2, '0')}</span><span class="grade-separator-label">${member.grade}</span>`;
      grid.appendChild(divider);
      previousGrade = member.grade;
    }

    const isMe = myName && member.name === myName;
    const isTeacher = member.role === '講師';
    const shownName = displayName(member);
    const card = document.createElement('div');
    card.className = `member-card${isMe ? ' me' : ''}${isTeacher ? ' teacher' : ''}`;
    card.style.animationDelay = `${idx * 0.04}s`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${shownName}のプロフィールを見る`);

    card.innerHTML = `
      ${isMe ? '<span class="me-badge">あなた</span>' : ''}
      <span class="member-grade-chip">${member.grade}</span>
      ${cardAvatarMarkup(member, initial)}
      <div class="member-name">${shownName}</div>
      <div class="member-grade">${member.grade}</div>
      ${!isTeacher ? `<div class="member-rank-badge ${rankClass(member.rank)}">${member.rank}位</div>` : '<div class="member-rank-badge rank-teacher">担当講師</div>'}
      <div class="card-hint">👁 クリックでプロフィール</div>
    `;

    card.addEventListener('click', () => openModal(member));
    card.addEventListener('mouseenter', () => setHoveredCard(grid, card));
    card.addEventListener('mouseleave', () => clearHoveredCard(grid));
    card.addEventListener('focus', () => setHoveredCard(grid, card));
    card.addEventListener('blur', () => clearHoveredCard(grid));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(member); }
    });

    grid.appendChild(card);
  });
}

// ===== モーダルを開く =====
function openModal(member) {
  const overlay = document.getElementById('modal-overlay');

  const isTeacher = member.role === '講師';
  const shownName = displayName(member);
  const modalAvatar = document.getElementById('modal-avatar');
  modalAvatar.style = avatarStyle(member.color);
  if (member.avatar) {
    modalAvatar.innerHTML = `<img src="${member.avatar}" alt="${member.name}の写真" class="modal-avatar-image" loading="lazy">`;
  } else {
    modalAvatar.innerHTML = '';
    modalAvatar.textContent = shownName.charAt(0);
  }
  document.getElementById('modal-name').textContent    = shownName;
  document.getElementById('modal-grade').textContent   = member.grade;
  document.getElementById('modal-birthday').textContent = member.birthday || '－';

  // クラス・部活行：生徒のみ表示
  const infoRow = document.getElementById('modal-info-row');
  if (isTeacher) {
    infoRow.hidden = true;
  } else {
    infoRow.hidden = false;
    document.getElementById('modal-classinfo').textContent = member.classInfo || '－';
    document.getElementById('modal-club').textContent      = member.club || '－';
  }

  const tagsEl = document.getElementById('modal-subjects');
  const subjectsWrap = document.getElementById('modal-subjects-wrap');
  if (isTeacher) {
    subjectsWrap.hidden = true;
    tagsEl.innerHTML = '';
  } else {
    subjectsWrap.hidden = false;
    document.getElementById('modal-subjects-label').textContent = '得意科目';
    tagsEl.innerHTML = member.subjects
      .map(s => `<span class="subject-tag">${s}</span>`)
      .join('');
  }

  // 好きな科目（講師のみ）
  const favWrap = document.getElementById('modal-favorite-wrap');
  if (isTeacher && member.favoriteSubjects && member.favoriteSubjects.length) {
    favWrap.hidden = false;
    document.getElementById('modal-favorite-subjects').innerHTML = member.favoriteSubjects
      .map(s => `<span class="subject-tag fav-tag">${s}</span>`)
      .join('');
  } else {
    favWrap.hidden = true;
    document.getElementById('modal-favorite-subjects').innerHTML = '';
  }

  document.getElementById('modal-message').textContent = member.message ? `"${member.message}"` : '';

  overlay.hidden = false;
  document.getElementById('modal-close').focus();
}

// ===== モーダルを閉じる =====
function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
}
