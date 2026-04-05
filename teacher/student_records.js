let allRecords = [];
let filteredRecords = [];
let currentPage = 1;
const recordsPerPage = 20;

document.addEventListener('DOMContentLoaded', () => {
  loadAllRecords();
  setupEventListeners();
  updateDisplay();
});

function loadAllRecords() {
  const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '{}');
  
  allRecords = Object.entries(allSubmissions).map(([key, value]) => {
    const [username, weekStart] = key.split('_');
    
    // 目標データを取得
    const goalKey = `${username}_goals_${weekStart}`;
    const goalData = JSON.parse(localStorage.getItem(goalKey) || 'null');
    
    // 合計を計算
    const actualTotal = Object.values(value.data).reduce((sum, val) => sum + (Number(val) || 0), 0);
    const goalTotal = goalData ? Object.values(goalData).reduce((sum, val) => sum + (Number(val) || 0), 0) : 0;
    
    return {
      username,
      weekStart,
      actual: value.data,
      goal: goalData || {},
      actualTotal,
      goalTotal,
      submittedAt: value.submittedAt || '-'
    };
  }).sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
  
  filteredRecords = [...allRecords];
  
  // 生徒フィルターのオプションを更新
  updateStudentFilter();
}

function updateStudentFilter() {
  const studentFilter = document.getElementById('student-filter');
  const students = [...new Set(allRecords.map(r => r.username))].sort();
  
  studentFilter.innerHTML = '<option value="all">全生徒</option>';
  students.forEach(student => {
    const option = document.createElement('option');
    option.value = student;
    option.textContent = student;
    studentFilter.appendChild(option);
  });
}

function setupEventListeners() {
  document.getElementById('student-filter').addEventListener('change', applyFilters);
  document.getElementById('period-filter').addEventListener('change', applyFilters);
  document.getElementById('view-mode').addEventListener('change', updateViewMode);
  document.getElementById('sort-by').addEventListener('change', applySorting);
  document.getElementById('search-box').addEventListener('input', applySearch);
  document.getElementById('export-csv').addEventListener('click', exportToCSV);
}

function applyFilters() {
  const studentFilter = document.getElementById('student-filter').value;
  const periodFilter = document.getElementById('period-filter').value;
  
  filteredRecords = [...allRecords];
  
  // 生徒フィルター
  if (studentFilter !== 'all') {
    filteredRecords = filteredRecords.filter(r => r.username === studentFilter);
  }
  
  // 期間フィルター
  if (periodFilter !== 'all') {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (periodFilter) {
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
    
    filteredRecords = filteredRecords.filter(r => new Date(r.weekStart) >= cutoffDate);
  }
  
  currentPage = 1;
  updateDisplay();
}

function applySorting() {
  const sortBy = document.getElementById('sort-by').value;
  
  switch (sortBy) {
    case 'date-desc':
      filteredRecords.sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
      break;
    case 'date-asc':
      filteredRecords.sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
      break;
    case 'student-asc':
      filteredRecords.sort((a, b) => a.username.localeCompare(b.username));
      break;
    case 'total-desc':
      filteredRecords.sort((a, b) => b.actualTotal - a.actualTotal);
      break;
    case 'total-asc':
      filteredRecords.sort((a, b) => a.actualTotal - b.actualTotal);
      break;
  }
  
  updateDisplay();
}

function applySearch() {
  const searchText = document.getElementById('search-box').value.toLowerCase();
  
  if (!searchText) {
    applyFilters();
    return;
  }
  
  filteredRecords = allRecords.filter(r => r.username.toLowerCase().includes(searchText));
  currentPage = 1;
  updateDisplay();
}

function updateViewMode() {
  const viewMode = document.getElementById('view-mode').value;
  const chartSection = document.getElementById('chart-section');
  const tableSection = document.getElementById('table-section');
  
  switch (viewMode) {
    case 'table':
      chartSection.style.display = 'none';
      tableSection.style.display = 'block';
      break;
    case 'chart':
      chartSection.style.display = 'grid';
      tableSection.style.display = 'none';
      renderCharts();
      break;
    case 'both':
      chartSection.style.display = 'grid';
      tableSection.style.display = 'block';
      renderCharts();
      break;
  }
}

function updateDisplay() {
  updateSummary();
  renderTable();
  
  const viewMode = document.getElementById('view-mode').value;
  if (viewMode === 'chart' || viewMode === 'both') {
    renderCharts();
  }
}

function updateSummary() {
  const students = new Set(filteredRecords.map(r => r.username));
  const totalMinutes = filteredRecords.reduce((sum, r) => sum + r.actualTotal, 0);
  const avgMinutes = filteredRecords.length > 0 ? Math.round(totalMinutes / filteredRecords.length) : 0;
  
  document.getElementById('total-students').textContent = students.size;
  document.getElementById('total-submissions').textContent = filteredRecords.length;
  document.getElementById('total-hours').textContent = totalMinutes + '分';
  document.getElementById('avg-hours').textContent = avgMinutes + '分';
}

function renderTable() {
  const tbody = document.querySelector('#records-table tbody');
  tbody.innerHTML = '';
  
  if (filteredRecords.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2em;">データがありません</td></tr>';
    return;
  }
  
  const start = (currentPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  const pageRecords = filteredRecords.slice(start, end);
  
  const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
  
  pageRecords.forEach(record => {
    const row = document.createElement('tr');
    
    let html = `
      <td class="student-name">${record.username}</td>
      <td>${record.weekStart}</td>
    `;
    
    subjects.forEach(subject => {
      const actual = parseInt(record.actual[subject]) || 0;
      const goal = parseInt(record.goal[subject]) || 0;
      const comparison = goal > 0 ? (actual >= goal ? 'achieved' : 'below') : 'no-goal';
      
      html += `
        <td class="subject-cell ${comparison}">
          <div class="actual">${actual}分</div>
          <div class="goal">${goal > 0 ? goal + '分' : '-'}</div>
        </td>
      `;
    });
    
    const totalComparison = record.goalTotal > 0 ? (record.actualTotal >= record.goalTotal ? 'achieved' : 'below') : 'no-goal';
    
    html += `
      <td class="total-cell ${totalComparison}">
        <div class="actual"><strong>${record.actualTotal}分</strong></div>
        <div class="goal">${record.goalTotal > 0 ? record.goalTotal + '分' : '-'}</div>
      </td>
      <td class="submitted-at">${record.submittedAt}</td>
    `;
    
    row.innerHTML = html;
    tbody.appendChild(row);
  });
  
  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '<div class="pagination-controls">';
  
  // 前へボタン
  html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">« 前へ</button>`;
  
  // ページ番号
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += '<span>...</span>';
    }
  }
  
  // 次へボタン
  html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">次へ »</button>`;
  html += '</div>';
  
  pagination.innerHTML = html;
}

function changePage(page) {
  currentPage = page;
  renderTable();
  document.querySelector('.table-section').scrollIntoView({ behavior: 'smooth' });
}

function renderCharts() {
  renderStudentTrendChart();
  renderSubjectComparisonChart();
}

function renderStudentTrendChart() {
  const canvas = document.getElementById('studentTrendChart');
  const ctx = canvas.getContext('2d');
  
  // 既存のチャートを破棄
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  // 生徒ごとにデータを集計
  const studentData = {};
  filteredRecords.forEach(record => {
    if (!studentData[record.username]) {
      studentData[record.username] = [];
    }
    studentData[record.username].push({
      week: record.weekStart,
      total: record.actualTotal
    });
  });
  
  // 週でソート
  Object.keys(studentData).forEach(student => {
    studentData[student].sort((a, b) => new Date(a.week) - new Date(b.week));
  });
  
  // 全ての週を取得
  const allWeeks = [...new Set(filteredRecords.map(r => r.weekStart))].sort();
  
  // データセットを作成
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'
  ];
  
  const datasets = Object.keys(studentData).slice(0, 10).map((student, index) => {
    const data = allWeeks.map(week => {
      const record = studentData[student].find(r => r.week === week);
      return record ? record.total : 0;
    });
    
    return {
      label: student,
      data: data,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '33',
      tension: 0.3,
      fill: false
    };
  });
  
  canvas.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: allWeeks.map(w => {
        const d = new Date(w);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#e0e0e0', font: { size: 12 } }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#e0e0e0' },
          grid: { color: 'rgba(102, 179, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#e0e0e0', maxRotation: 45, minRotation: 45 },
          grid: { color: 'rgba(102, 179, 255, 0.1)' }
        }
      }
    }
  });
}

function renderSubjectComparisonChart() {
  const canvas = document.getElementById('subjectComparisonChart');
  const ctx = canvas.getContext('2d');
  
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
  const subjectTotals = {};
  const subjectGoals = {};
  
  subjects.forEach(subject => {
    subjectTotals[subject] = 0;
    subjectGoals[subject] = 0;
  });
  
  filteredRecords.forEach(record => {
    subjects.forEach(subject => {
      subjectTotals[subject] += parseInt(record.actual[subject]) || 0;
      subjectGoals[subject] += parseInt(record.goal[subject]) || 0;
    });
  });
  
  canvas.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: subjects,
      datasets: [
        {
          label: '実績',
          data: subjects.map(s => subjectTotals[s]),
          backgroundColor: 'rgba(102, 179, 255, 0.6)',
          borderColor: 'rgba(102, 179, 255, 1)',
          borderWidth: 2
        },
        {
          label: '目標',
          data: subjects.map(s => subjectGoals[s]),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 2
        }
      ]
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
          ticks: { color: '#e0e0e0' },
          grid: { color: 'rgba(102, 179, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#e0e0e0', font: { size: 13, weight: 'bold' } },
          grid: { color: 'rgba(102, 179, 255, 0.1)' }
        }
      }
    }
  });
}

function exportToCSV() {
  const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
  
  let csv = '生徒名,週,';
  subjects.forEach(s => {
    csv += `${s}(実績),${s}(目標),`;
  });
  csv += '合計(実績),合計(目標),提出日時\n';
  
  filteredRecords.forEach(record => {
    csv += `${record.username},${record.weekStart},`;
    subjects.forEach(subject => {
      csv += `${record.actual[subject] || 0},${record.goal[subject] || 0},`;
    });
    csv += `${record.actualTotal},${record.goalTotal},${record.submittedAt}\n`;
  });
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `生徒学習記録_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
