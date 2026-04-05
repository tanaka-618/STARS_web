// 📊 STARS テスト結果集計スクリプト
let testResults = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ テスト結果ページ読み込み完了');

  const username = localStorage.getItem('username') || 'guest';
  
  // localStorageからユーザー専用のテスト結果を読み込み
  const savedResults = localStorage.getItem(`${username}_testResults`);
  if (savedResults) {
    testResults = JSON.parse(savedResults);
  } else {
    // サンプルデータ
    testResults = [
      { date: '2025-01-10', testName: '2024年3学期期末試験', subject: '数学', score: 85 },
      { date: '2025-01-12', testName: '2024年3学期期末試験', subject: '英語', score: 78 },
      { date: '2025-01-15', testName: '2024年3学期期末試験', subject: '国語', score: 92 },
      { date: '2025-01-18', testName: '2024年3学期期末試験', subject: '理科', score: 88 },
      { date: '2025-01-20', testName: '2024年3学期期末試験', subject: '社会', score: 75 },
      { date: '2025-01-22', testName: '2025年1学期中間試験', subject: '数学', score: 90 },
      { date: '2025-01-25', testName: '2025年1学期中間試験', subject: '英語', score: 82 }
    ];
    saveResults();
  }

  updateStats();
  renderCharts();
  renderTestList();
  renderFilterButtons();

  // テスト追加フォーム
  document.getElementById('test-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const date = document.getElementById('test-date').value;
    const testName = document.getElementById('test-name').value;
    const subject = document.getElementById('test-subject').value;
    const score = parseInt(document.getElementById('test-score').value);

    if (date && testName && subject && score >= 0 && score <= 100) {
      testResults.push({ date, testName, subject, score });
      saveResults();
      updateStats();
      renderCharts();
      renderTestList();
      renderFilterButtons();

      // フォームをリセット
      document.getElementById('test-form').reset();
      alert('✅ テスト結果を追加しました');
    }
  });

  // 検索機能
  document.getElementById('search-test').addEventListener('input', (e) => {
    renderTestList();
  });

});

function updateStats() {
  if (testResults.length === 0) {
    document.getElementById('total-tests').textContent = '0回';
    document.getElementById('average-score').textContent = '0点';
    document.getElementById('highest-score').textContent = '0点';
    document.getElementById('improvement').textContent = '+0点';
    return;
  }

  const totalTests = testResults.length;
  const avgScore = Math.round(testResults.reduce((sum, t) => sum + t.score, 0) / totalTests);
  const highestScore = Math.max(...testResults.map(t => t.score));

  // 前回比計算（最後の2つのテストを比較）
  let improvement = 0;
  if (testResults.length >= 2) {
    const latest = testResults[testResults.length - 1].score;
    const previous = testResults[testResults.length - 2].score;
    improvement = latest - previous;
  }

  document.getElementById('total-tests').textContent = totalTests + '回';
  document.getElementById('average-score').textContent = avgScore + '点';
  document.getElementById('highest-score').textContent = highestScore + '点';
  document.getElementById('improvement').textContent = (improvement >= 0 ? '+' : '') + improvement + '点';

  // 前回比の色変更
  const improvementEl = document.getElementById('improvement');
  if (improvement > 0) {
    improvementEl.style.color = '#6bcf7f';
  } else if (improvement < 0) {
    improvementEl.style.color = '#ff6b6b';
  } else {
    improvementEl.style.color = '#66b3ff';
  }
}

function renderCharts() {
  // データから科目を抽出（重複排除）
  const allSubjects = [...new Set(testResults.map(t => t.subject))];
  const displaySubjects = allSubjects.slice(0, 8); // 最大8科目まで表示

  const subjectAvg = displaySubjects.map(subject => {
    const subjectTests = testResults.filter(t => t.subject === subject);
    if (subjectTests.length === 0) return 0;
    return Math.round(subjectTests.reduce((sum, t) => sum + t.score, 0) / subjectTests.length);
  });

  const ctxSubject = document.getElementById('subjectChart');
  new Chart(ctxSubject, {
    type: 'radar',
    data: {
      labels: displaySubjects,
      datasets: [{
        label: '平均点',
        data: subjectAvg,
        backgroundColor: 'rgba(0, 191, 255, 0.2)',
        borderColor: 'rgba(0, 191, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 191, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(0, 191, 255, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: '#b3d9ff',
            font: { size: 14 }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { 
            color: '#99ccff',
            stepSize: 20
          },
          grid: { color: 'rgba(102, 179, 255, 0.2)' },
          pointLabels: { color: '#b3d9ff', font: { size: 12 } }
        }
      }
    }
  });

  // 点数推移グラフ（最近10件）
  const recentTests = testResults.slice(-10);
  const trendLabels = recentTests.map(t => {
    const date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()} ${t.subject}`;
  });
  const trendData = recentTests.map(t => t.score);

  const ctxTrend = document.getElementById('trendChart');
  new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: trendLabels,
      datasets: [{
        label: '点数',
        data: trendData,
        backgroundColor: 'rgba(102, 179, 255, 0.2)',
        borderColor: 'rgba(102, 179, 255, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(102, 179, 255, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: '#b3d9ff',
            font: { size: 14 }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: '#99ccff' },
          grid: { color: 'rgba(102, 179, 255, 0.1)' }
        },
        x: {
          ticks: { 
            color: '#99ccff',
            maxRotation: 45,
            minRotation: 45
          },
          grid: { color: 'rgba(102, 179, 255, 0.1)' }
        }
      }
    }
  });
}

function renderFilterButtons() {
  const filterButtons = document.getElementById('filter-buttons');
  
  // データから科目を抽出（重複排除、ソート）
  const allSubjects = [...new Set(testResults.map(t => t.subject))].sort();
  
  // ボタンを生成
  filterButtons.innerHTML = '<button class="filter-btn active" data-subject="all">すべて</button>';
  
  allSubjects.forEach(subject => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.subject = subject;
    btn.textContent = subject;
    filterButtons.appendChild(btn);
  });
  
  // イベントリスナーを追加
  filterButtons.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.subject;
      renderTestList();
    });
  });
}

function renderTestList() {
  const testList = document.getElementById('test-list');
  testList.innerHTML = '';

  // 検索キーワード取得
  const searchKeyword = document.getElementById('search-test').value.toLowerCase();

  // フィルター適用
  let filtered = currentFilter === 'all' 
    ? testResults 
    : testResults.filter(t => t.subject === currentFilter);
  
  // 検索フィルター適用
  if (searchKeyword) {
    filtered = filtered.filter(t => 
      t.testName.toLowerCase().includes(searchKeyword) ||
      t.subject.toLowerCase().includes(searchKeyword)
    );
  }

  if (filtered.length === 0) {
    testList.innerHTML = '<p style="text-align: center; color: #99ccff; padding: 30px;">テスト結果がありません</p>';
    return;
  }

  // 日付順にソート（新しい順）
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.forEach((test, index) => {
    const testItem = document.createElement('div');
    testItem.className = 'test-item';

    const testDate = new Date(test.date);
    const dateStr = `${testDate.getFullYear()}年${testDate.getMonth() + 1}月${testDate.getDate()}日`;

    // スコアバッジ
    let badgeClass = '';
    let badgeText = '';
    if (test.score >= 90) {
      badgeClass = 'excellent';
      badgeText = '優秀';
    } else if (test.score >= 75) {
      badgeClass = 'good';
      badgeText = '良好';
    } else if (test.score >= 60) {
      badgeClass = 'average';
      badgeText = '普通';
    } else {
      badgeClass = 'needs-work';
      badgeText = '要努力';
    }

    testItem.innerHTML = `
      <div class="test-header">
        <div class="test-name">${test.testName || 'テスト名なし'}</div>
        <div class="test-date">${dateStr}</div>
      </div>
      <div class="test-details">
        <div class="test-subject">${test.subject}</div>
        <div class="test-score">${test.score}点</div>
        <div class="test-badge ${badgeClass}">${badgeText}</div>
        <button class="test-delete" data-index="${testResults.indexOf(test)}">削除</button>
      </div>
    `;

    testList.appendChild(testItem);
  });

  // 削除ボタンのイベント
  document.querySelectorAll('.test-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      if (confirm('このテスト結果を削除しますか？')) {
        testResults.splice(index, 1);
        saveResults();
        updateStats();
        renderCharts();
        renderTestList();
      }
    });
  });
}

function saveResults() {
  const username = localStorage.getItem('username') || 'guest';
  localStorage.setItem(`${username}_testResults`, JSON.stringify(testResults));
}
