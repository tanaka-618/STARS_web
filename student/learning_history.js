let currentPeriod = 'all';
let allUserSubmissions = [];
let chartInstances = { weekly: null, subject: null };

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const label = document.getElementById("user-label");

  if (!username) {
    alert('ログインしてください');
    location.href = 'student_login.html';
    return;
  }

  label.textContent = `${username}さんの学習履歴`;

  const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '{}');

  allUserSubmissions = Object.entries(allSubmissions)
    .filter(([key]) => key.startsWith(`${username}_`))
    .map(([key, value]) => {
      const weekStart = key.replace(`${username}_`, '');
      return { weekStart, ...value };
    })
    .sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));

  setupPeriodFilters();
  updateDisplay();
  renderCurrentWeekActual();
  renderCurrentWeekGoal();
  renderRanking();
});

function setupPeriodFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      updateDisplay();
    });
  });
}

function filterSubmissionsByPeriod(submissions) {
  if (currentPeriod === 'all') return submissions;

  const now = new Date();
  const cutoffDate = new Date();

  switch (currentPeriod) {
    case 'year':
      cutoffDate.setFullYear(now.getFullYear(), 0, 1);
      break;
    case '6months':
      cutoffDate.setMonth(now.getMonth() - 6);
      break;
    case '3months':
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    case '1month':
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
  }

  return submissions.filter(sub => new Date(sub.weekStart) >= cutoffDate);
}

function updateDisplay() {
  const filteredData = filterSubmissionsByPeriod(allUserSubmissions);
  renderStatistics(filteredData);
  renderCharts(filteredData);
  renderTable(filteredData);
}

function renderCurrentWeekActual() {
  const container = document.getElementById('current-week-container');
  const username = localStorage.getItem("username");
  const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '{}');

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + daysFromMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const weekStart = monday.toISOString().split("T")[0];

  const titleElement = document.getElementById('current-week-title');
  if (titleElement) {
    const formatDate = (d) => `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
    titleElement.textContent = `📝 今週の学習実績（${formatDate(monday)}〜${formatDate(sunday)}）`;
  }

  const weekKey = `${username}_${weekStart}`;
  const weekData = allSubmissions[weekKey];

  if (!weekData || !weekData.data) {
    container.innerHTML = '<p class="no-data">❌ 今週のデータがまだ提出されていません</p>';
    return;
  }

  const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
  let totalActual = 0;

  let html = '<div class="data-grid">';
  subjects.forEach(subject => {
    const actual = Number(weekData.data[subject]) || 0;
    totalActual += actual;
    html += `<div class="data-card actual-card">`;
    html += `<div class="card-subject">${subject}</div>`;
    html += `<div class="card-value">${actual}<span class="unit">分</span></div>`;
    html += `</div>`;
  });
  html += '</div>';
  html += `<div class="total-display actual-total">合計: <strong>${totalActual}分</strong></div>`;

  container.innerHTML = html;
}

function renderCurrentWeekGoal() {
  const container = document.getElementById('goal-container');
  const username = localStorage.getItem("username");

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + daysFromMonday);
  const weekStart = monday.toISOString().split("T")[0];

  const goalKey = `${username}_goals_${weekStart}`;
  const goalData = JSON.parse(localStorage.getItem(goalKey) || 'null');

  if (!goalData) {
    container.innerHTML = '<p class="no-data">⚠️ 今週の目標が設定されていません</p>';
    return;
  }

  const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
  let totalGoal = 0;

  let html = '<div class="data-grid">';
  subjects.forEach(subject => {
    const goal = Number(goalData[subject]) || 0;
    totalGoal += goal;
    html += `<div class="data-card goal-card">`;
    html += `<div class="card-subject">${subject}</div>`;
    html += `<div class="card-value">${goal}<span class="unit">分</span></div>`;
    html += `</div>`;
  });
  html += '</div>';
  html += `<div class="total-display goal-total">合計: <strong>${totalGoal}分</strong></div>`;

  container.innerHTML = html;
}

function renderRanking() {
  const rankingContainer = document.getElementById('ranking-container');
  const username = localStorage.getItem("username");
  const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '{}');

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + daysFromMonday);
  const weekStart = monday.toISOString().split("T")[0];

  const weeklyData = [];
  Object.entries(allSubmissions).forEach(([key, value]) => {
    if (key.includes(`_${weekStart}`)) {
      const total = Object.values(value.data).reduce((sum, val) => sum + (Number(val) || 0), 0);
      weeklyData.push({
        username: value.username,
        totalMinutes: total,
        isCurrentUser: value.username === username
      });
    }
  });

  if (weeklyData.length === 0) {
    rankingContainer.innerHTML = '<p class="no-data">まだ誰も提出していません</p>';
    return;
  }

  weeklyData.sort((a, b) => b.totalMinutes - a.totalMinutes);

  let rankingHTML = '<div class="ranking-list">';
  weeklyData.forEach((user, index) => {
    const rank = index + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
    const highlight = user.isCurrentUser ? 'current-user' : '';
    
    // 自分以外は匿名表示
    const displayName = user.isCurrentUser ? user.username : '****';
    const suffix = user.isCurrentUser ? ' (あなた)' : '';

    rankingHTML += `
      <div class="rank-item ${highlight}">
        <span class="rank-number">${medal || rank + '位'}</span>
        <span class="rank-user">${displayName}${suffix}</span>
        <span class="rank-time">${user.totalMinutes}分</span>
      </div>
    `;
  });
  rankingHTML += '</div>';

  const myRank = weeklyData.findIndex(u => u.isCurrentUser) + 1;
  if (myRank > 0) {
    rankingHTML += `<p class="my-rank">🎯 あなたの順位: <strong>${myRank}位</strong> / ${weeklyData.length}人</p>`;
  }

  rankingContainer.innerHTML = rankingHTML;
}

function renderStatistics(submissions) {
  if (submissions.length === 0) {
    document.getElementById('total-time').textContent = '0分';
    document.getElementById('week-count').textContent = '0週';
    document.getElementById('avg-time').textContent = '0分/週';
    document.getElementById('top-subject').textContent = '-';
    return;
  }

  const subjectTotals = {
    国語: 0,
    数学: 0,
    英語: 0,
    理科: 0,
    社会: 0,
    課題: 0
  };

  let totalMinutes = 0;

  submissions.forEach(sub => {
    Object.entries(sub.data).forEach(([subject, minutes]) => {
      const mins = parseInt(minutes) || 0;
      subjectTotals[subject] = (subjectTotals[subject] || 0) + mins;
      totalMinutes += mins;
    });
  });

  totalMinutes = Math.round(totalMinutes);
  const avgMinutes = Math.round(totalMinutes / submissions.length);

  const topSubject = Object.entries(subjectTotals)
    .sort((a, b) => b[1] - a[1])[0];

  document.getElementById('total-time').textContent = `${totalMinutes}分`;
  document.getElementById('week-count').textContent = `${submissions.length}週`;
  document.getElementById('avg-time').textContent = `${avgMinutes}分/週`;
  document.getElementById('top-subject').textContent = `${topSubject[0]} (${topSubject[1]}分)`;
}

function renderCharts(submissions) {
  if (chartInstances.weekly) {
    chartInstances.weekly.destroy();
  }
  if (chartInstances.subject) {
    chartInstances.subject.destroy();
  }

  if (submissions.length === 0) {
    const ctx1 = document.getElementById('weeklyTrendChart');
    const ctx2 = document.getElementById('subjectTotalChart');
    if (ctx1) ctx1.getContext('2d').clearRect(0, 0, ctx1.width, ctx1.height);
    if (ctx2) ctx2.getContext('2d').clearRect(0, 0, ctx2.width, ctx2.height);
    return;
  }

  const weekLabels = submissions.slice().reverse().map(sub => {
    const date = new Date(sub.weekStart);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const weekTotals = submissions.slice().reverse().map(sub => {
    return Object.values(sub.data).reduce((sum, mins) => sum + (parseInt(mins) || 0), 0);
  });

  const ctx1 = document.getElementById('weeklyTrendChart');
  if (ctx1) {
    chartInstances.weekly = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: weekLabels,
        datasets: [{
          label: '週間学習時間 (分)',
          data: weekTotals,
          borderColor: '#66b3ff',
          backgroundColor: 'rgba(102, 179, 255, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#66b3ff',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: '#e0e0e0', font: { size: 14 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              color: '#e0e0e0',
              font: { size: 12 }
            },
            grid: { color: 'rgba(102, 179, 255, 0.1)' }
          },
          x: {
            ticks: { 
              color: '#e0e0e0',
              font: { size: 12 },
              maxRotation: 45,
              minRotation: 45,
              autoSkip: false
            },
            grid: { color: 'rgba(102, 179, 255, 0.1)' }
          }
        }
      }
    });
  }

  const subjectTotals = {
    国語: 0,
    数学: 0,
    英語: 0,
    理科: 0,
    社会: 0,
    課題: 0
  };

  submissions.forEach(sub => {
    Object.entries(sub.data).forEach(([subject, minutes]) => {
      subjectTotals[subject] = (subjectTotals[subject] || 0) + (parseInt(minutes) || 0);
    });
  });

  const subjectLabels = Object.keys(subjectTotals);
  const subjectData = Object.values(subjectTotals);

  const ctx2 = document.getElementById('subjectTotalChart');
  if (ctx2) {
    chartInstances.subject = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: subjectLabels,
        datasets: [{
          label: '総学習時間 (分)',
          data: subjectData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: '#e0e0e0', font: { size: 14 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              color: '#e0e0e0',
              font: { size: 12 }
            },
            grid: { color: 'rgba(102, 179, 255, 0.1)' }
          },
          x: {
            ticks: { 
              color: '#e0e0e0',
              font: { size: 13, weight: 'bold' },
              autoSkip: false
            },
            grid: { color: 'rgba(102, 179, 255, 0.1)' }
          }
        }
      }
    });
  }
}

function renderTable(submissions) {
  const tbody = document.querySelector('#history-table tbody');
  tbody.innerHTML = '';

  if (submissions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2em;">データがありません</td></tr>';
    return;
  }

  submissions.forEach(sub => {
    const row = document.createElement('tr');
    const total = Object.values(sub.data).reduce((sum, mins) => sum + (parseInt(mins) || 0), 0);

    const goalKey = `${localStorage.getItem('username')}_goals_${sub.weekStart}`;
    const goalData = JSON.parse(localStorage.getItem(goalKey) || 'null');
    let goalTotal = 0;
    if (goalData) {
      goalTotal = Object.values(goalData).reduce((sum, val) => sum + (Number(val) || 0), 0);
    }

    row.innerHTML = `
      <td>${sub.weekStart}</td>
      <td>${parseInt(sub.data.国語) || 0}分</td>
      <td>${parseInt(sub.data.数学) || 0}分</td>
      <td>${parseInt(sub.data.英語) || 0}分</td>
      <td>${parseInt(sub.data.理科) || 0}分</td>
      <td>${parseInt(sub.data.社会) || 0}分</td>
      <td>${parseInt(sub.data.課題) || 0}分</td>
      <td>${total}分</td>
      <td>${goalTotal > 0 ? goalTotal + '分' : '-'}</td>
    `;
    tbody.appendChild(row);
  });
}
