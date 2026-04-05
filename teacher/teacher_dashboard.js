document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#dashboard-table tbody");
  const searchInput = document.getElementById("table-search-user");
  const weekFilter = document.getElementById("table-filter-week");
  const resetFilterBtn = document.getElementById("table-filter-reset");
  const visibleCount = document.getElementById("table-visible-count");
  const allData = JSON.parse(localStorage.getItem("allSubmissions") || "{}");
  const subjectTotals = { "国語": 0, "数学": 0, "英語": 0, "理科": 0, "社会": 0, "課題": 0 };
  const csvRows = [["ユーザー", "週", "国語", "数学", "英語", "理科", "社会", "課題", "合計"]];

  updateKpiCards(allData);

  const sortedEntries = Object.values(allData).sort((a, b) => {
    const nameA = a.username + a.week;
    const nameB = b.username + b.week;
    return nameA.localeCompare(nameB);
  });

  sortedEntries.forEach(entry => {
    const total = Object.values(entry.data).reduce((sum, val) => sum + (Number(val) || 0), 0);
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.username}</td>
      <td>${entry.week}</td>
      <td>${entry.data["国語"]}分</td>
      <td>${entry.data["数学"]}分</td>
      <td>${entry.data["英語"]}分</td>
      <td>${entry.data["理科"]}分</td>
      <td>${entry.data["社会"]}分</td>
      <td>${entry.data["課題"]}分</td>
      <td>${total}分</td>
    `;
    row.dataset.username = String(entry.username || "").toLowerCase();
    row.dataset.week = String(entry.week || "");
    tbody.appendChild(row);

    csvRows.push([
      entry.username,
      entry.week,
      entry.data["国語"],
      entry.data["数学"],
      entry.data["英語"],
      entry.data["理科"],
      entry.data["社会"],
      entry.data["課題"],
      total
    ]);

    for (const subject in subjectTotals) {
      subjectTotals[subject] += Number(entry.data[subject]) || 0;
    }
  });

  // 生徒ごとの合計集計テーブルを作成
  renderStudentSummaryTable(allData);

  setupTableFilters();

  // 棒グラフの描画
  const ctx = document.getElementById("subjectChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(subjectTotals),
      datasets: [{
        label: "教科別 合計学習時間（分）",
        data: Object.values(subjectTotals),
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

  // CSV出力処理
  document.getElementById("export-csv").addEventListener("click", () => {
    let csv = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all_students_summary.csv";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  function setupTableFilters() {
    if (!searchInput || !weekFilter || !resetFilterBtn) return;

    const weeks = [...new Set(sortedEntries.map((entry) => entry.week).filter(Boolean))]
      .sort((a, b) => String(b).localeCompare(String(a)));

    weeks.forEach((week) => {
      const option = document.createElement("option");
      option.value = week;
      option.textContent = week;
      weekFilter.appendChild(option);
    });

    const applyFilters = () => {
      const keyword = String(searchInput.value || "").trim().toLowerCase();
      const selectedWeek = weekFilter.value;
      let count = 0;

      tbody.querySelectorAll("tr").forEach((row) => {
        const hitUser = !keyword || row.dataset.username.includes(keyword);
        const hitWeek = !selectedWeek || row.dataset.week === selectedWeek;
        const show = hitUser && hitWeek;
        row.style.display = show ? "" : "none";
        if (show) count += 1;
      });

      if (visibleCount) {
        visibleCount.textContent = `${count}件表示`;
      }
    };

    searchInput.addEventListener("input", applyFilters);
    weekFilter.addEventListener("change", applyFilters);
    resetFilterBtn.addEventListener("click", () => {
      searchInput.value = "";
      weekFilter.value = "";
      applyFilters();
    });

    applyFilters();
  }
});

function updateKpiCards(allData) {
  const entries = Object.values(allData);
  const students = new Set(entries.map(entry => entry.username));
  const totalMinutes = entries.reduce((sum, entry) => {
    const weekTotal = Object.values(entry.data || {}).reduce((acc, val) => acc + (Number(val) || 0), 0);
    return sum + weekTotal;
  }, 0);

  let latestWeek = "-";
  if (entries.length > 0) {
    latestWeek = entries
      .map(entry => entry.week)
      .filter(Boolean)
      .sort((a, b) => String(b).localeCompare(String(a)))[0] || "-";
  }

  const studentsEl = document.getElementById("kpi-students");
  const recordsEl = document.getElementById("kpi-records");
  const totalEl = document.getElementById("kpi-total-minutes");
  const latestEl = document.getElementById("kpi-latest-week");

  if (studentsEl) studentsEl.textContent = `${students.size}名`;
  if (recordsEl) recordsEl.textContent = `${entries.length}件`;
  if (totalEl) totalEl.textContent = `${totalMinutes}分`;
  if (latestEl) latestEl.textContent = latestWeek;
}

// 生徒ごとの合計集計テーブルを描画
function renderStudentSummaryTable(allData) {
  const tbody = document.querySelector("#student-summary-table tbody");
  const studentStats = {};

  // 生徒ごとにデータを集計
  Object.values(allData).forEach(entry => {
    const username = entry.username;
    
    if (!studentStats[username]) {
      studentStats[username] = {
        username: username,
        weekCount: 0,
        国語: 0,
        数学: 0,
        英語: 0,
        理科: 0,
        社会: 0,
        課題: 0,
        total: 0
      };
    }
    
    studentStats[username].weekCount++;
    studentStats[username].国語 += Number(entry.data["国語"]) || 0;
    studentStats[username].数学 += Number(entry.data["数学"]) || 0;
    studentStats[username].英語 += Number(entry.data["英語"]) || 0;
    studentStats[username].理科 += Number(entry.data["理科"]) || 0;
    studentStats[username].社会 += Number(entry.data["社会"]) || 0;
    studentStats[username].課題 += Number(entry.data["課題"]) || 0;
  });

  // 総合計を計算
  Object.values(studentStats).forEach(stats => {
    stats.total = stats.国語 + stats.数学 + stats.英語 + stats.理科 + stats.社会 + stats.課題;
  });

  // 総合計でソート（多い順）
  const sortedStudents = Object.values(studentStats).sort((a, b) => b.total - a.total);

  // テーブルに表示
  sortedStudents.forEach(stats => {
    const avgPerWeek = Math.round(stats.total / stats.weekCount);
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${stats.username}</td>
      <td>${stats.weekCount}週</td>
      <td>${stats.国語}分</td>
      <td>${stats.数学}分</td>
      <td>${stats.英語}分</td>
      <td>${stats.理科}分</td>
      <td>${stats.社会}分</td>
      <td>${stats.課題}分</td>
      <td>${stats.total}分</td>
      <td>${avgPerWeek}分</td>
    `;
    tbody.appendChild(row);
  });
}
