// 🏆 STARS ランキング制御スクリプト
let currentPeriod = 'month';

// サンプルデータ（実際はサーバーから取得）
const rankingData = {
  month: [
    { name: '田中 太郎', hours: 120 },
    { name: '佐藤 花子', hours: 115 },
    { name: '鈴木 一郎', hours: 110 },
    { name: '高橋 美咲', hours: 105 },
    { name: '渡辺 健太', hours: 98 },
    { name: '伊藤 さくら', hours: 95 },
    { name: '山本 大輔', hours: 92 },
    { name: '中村 愛', hours: 88 },
    { name: '小林 翔太', hours: 85 },
    { name: '加藤 結衣', hours: 82 }
  ],
  week: [
    { name: '佐藤 花子', hours: 28 },
    { name: '田中 太郎', hours: 27 },
    { name: '鈴木 一郎', hours: 26 },
    { name: '渡辺 健太', hours: 24 },
    { name: '高橋 美咲', hours: 23 },
    { name: '伊藤 さくら', hours: 22 },
    { name: '中村 愛', hours: 21 },
    { name: '山本 大輔', hours: 20 },
    { name: '小林 翔太', hours: 19 },
    { name: '加藤 結衣', hours: 18 }
  ],
  all: [
    { name: '田中 太郎', hours: 450 },
    { name: '鈴木 一郎', hours: 425 },
    { name: '佐藤 花子', hours: 410 },
    { name: '高橋 美咲', hours: 395 },
    { name: '渡辺 健太', hours: 380 },
    { name: '伊藤 さくら', hours: 365 },
    { name: '山本 大輔', hours: 350 },
    { name: '中村 愛', hours: 335 },
    { name: '小林 翔太', hours: 320 },
    { name: '加藤 結衣', hours: 305 }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ ランキングページ読み込み完了');

  renderRanking();
  updateMyRank();

  // フィルターボタン
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      renderRanking();
      updateMyRank();
    });
  });
});

function renderRanking() {
  const rankingList = document.getElementById('ranking-list');
  const data = rankingData[currentPeriod];

  rankingList.innerHTML = '';

  data.forEach((student, index) => {
    const rank = index + 1;
    const isTop3 = rank <= 3;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

    const rankItem = document.createElement('div');
    rankItem.className = `rank-item ${isTop3 ? 'top3' : ''}`;
    rankItem.style.animationDelay = `${index * 0.05}s`;

    rankItem.innerHTML = `
      <div class="rank-number">${rank}位</div>
      <div class="rank-info">
        <div class="rank-student-name">${student.name}</div>
        <div class="rank-study-hours">⏱️ ${student.hours}時間</div>
      </div>
      ${medal ? `<div class="rank-medal">${medal}</div>` : ''}
    `;

    rankingList.appendChild(rankItem);
  });
}

function updateMyRank() {
  const username = localStorage.getItem('fullname') || '未登録ユーザー';
  const data = rankingData[currentPeriod];
  
  // 自分の順位を計算（サンプルとして5位に設定）
  const myRank = 5;
  const myHours = data[myRank - 1].hours;

  document.getElementById('my-rank').textContent = `${myRank}位`;
  document.getElementById('my-name').textContent = username;
  document.getElementById('my-hours').textContent = `⏱️ ${myHours}時間`;
}
