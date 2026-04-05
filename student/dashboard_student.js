// 🎓 STARS 生徒ダッシュボード制御スクリプト
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ STARSダッシュボード読み込み完了");

  // --- サイドメニューの制御 ---
  initializeSideMenu();

  // --- ログインユーザー名表示 ---
  const fullName = localStorage.getItem("fullname") || "未登録ユーザー";
  const nameDisplay = document.getElementById("student-name");
  if (nameDisplay) nameDisplay.textContent = `👤 ${fullName} さん、ようこそ！`;

  // --- 統計データの初期化と表示 ---
  initializeStats();

  // --- 今日のタスク機能 ---
  initializeTasks();

  // --- 今週の目標と学習実績グラフ ---
  initializeWeeklyCharts();

  // --- アニメーション ---
  const cards = document.querySelectorAll(".reveal-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });
  cards.forEach(card => observer.observe(card));

  // --- セッションタイマー（30分操作なしで自動ログアウト） ---
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  let timer;
  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      alert("⏰ 一定時間操作がなかったため、ログアウトしました。");
      window.location.href = "../index.html";
    }, SESSION_TIMEOUT);
  };
  ["click", "mousemove", "keydown", "scroll"].forEach(ev =>
    window.addEventListener(ev, resetTimer)
  );
  resetTimer();

  // --- ログアウト確認 ---
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const confirmLogout = confirm("🔓 ログアウトしますか？");
      if (confirmLogout) {
        document.body.style.transition = "opacity 0.6s ease";
        document.body.style.opacity = "0";
        setTimeout(() => {
          alert("ログアウトしました。");
          window.location.href = "../index.html";
        }, 600);
      }
    });
  }
});

// --- 統計データの初期化 ---
function initializeStats() {
  const username = localStorage.getItem('username') || 'guest';
  const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions') || '{}');
  
  // 今月の学習時間を計算（全ての週のデータを合算）
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  let monthlyTotalMinutes = 0;
  
  Object.entries(allSubmissions).forEach(([key, value]) => {
    if (key.startsWith(`${username}_`)) {
      const weekDate = new Date(value.week);
      if (weekDate.getMonth() === currentMonth && weekDate.getFullYear() === currentYear) {
        const weekTotal = Object.values(value.data).reduce((sum, val) => sum + (Number(val) || 0), 0);
        monthlyTotalMinutes += weekTotal;
      }
    }
  });
  
  // localStorageからユーザー専用の統計データを取得（なければデフォルト値）
  const stats = {
    totalMinutes: monthlyTotalMinutes,
    streakDays: parseInt(localStorage.getItem(`${username}_streakDays`)) || 0,
    completedTasks: parseInt(localStorage.getItem(`${username}_completedTasks`)) || 0
  };

  document.getElementById('total-study-hours').textContent = stats.totalMinutes + '分';
  document.getElementById('streak-days').textContent = stats.streakDays + '日';
  document.getElementById('completed-tasks').textContent = stats.completedTasks + '個';
}

// --- タスク機能の初期化 ---
function initializeTasks() {
  const username = localStorage.getItem('username') || 'guest';
  const taskList = document.getElementById('task-list');
  const addTaskBtn = document.getElementById('add-task-btn');

  // localStorageからユーザー専用のタスクを取得
  let tasks = JSON.parse(localStorage.getItem(`${username}_dailyTasks`)) || [
    { id: 1, text: '数学の課題を完了する', completed: false },
    { id: 2, text: '英単語30個を覚える', completed: false },
    { id: 3, text: '理科の予習をする', completed: true }
  ];

  function renderTasks() {
    taskList.innerHTML = '';
    updateTaskProgressInsight(tasks);
    if (tasks.length === 0) {
      taskList.innerHTML = '<p style="text-align: center; color: #99ccff; padding: 20px;">タスクがありません。新しいタスクを追加しましょう！</p>';
      return;
    }

    tasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = 'task-item' + (task.completed ? ' completed' : '');
      taskItem.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
        <span class="task-text">${task.text}</span>
        <button class="task-delete" data-id="${task.id}">削除</button>
      `;
      taskList.appendChild(taskItem);
    });

    // チェックボックスのイベント
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        const task = tasks.find(t => t.id === id);
        if (task) {
          task.completed = !task.completed;
          saveTasks();
          renderTasks();
          updateCompletedCount();
        }
      });
    });

    // 削除ボタンのイベント
    document.querySelectorAll('.task-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateCompletedCount();
      });
    });
  }

  function saveTasks() {
    const username = localStorage.getItem('username') || 'guest';
    localStorage.setItem(`${username}_dailyTasks`, JSON.stringify(tasks));
  }

  function updateCompletedCount() {
    const username = localStorage.getItem('username') || 'guest';
    const completed = tasks.filter(t => t.completed).length;
    localStorage.setItem(`${username}_completedTasks`, completed);
    document.getElementById('completed-tasks').textContent = completed + '個';
  }

  // タスク追加ボタン
  addTaskBtn.addEventListener('click', () => {
    const taskText = prompt('新しいタスクを入力してください：');
    if (taskText && taskText.trim()) {
      const newTask = {
        id: Date.now(),
        text: taskText.trim(),
        completed: false
      };
      tasks.push(newTask);
      saveTasks();
      renderTasks();
    }
  });

  renderTasks();
}

// --- 週次グラフの初期化（目標と実績を分けて表示） ---
function initializeWeeklyCharts() {
  const username = localStorage.getItem('username') || 'guest';

  // 今週の月曜日を取得（日曜日の場合は前週の月曜日）
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=日曜, 1=月曜, ..., 6=土曜
  const monday = new Date(today);
  // 日曜日(0)の場合は6日前、それ以外は(1-dayOfWeek)日前
  const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + daysFromMonday);
  const weekStart = monday.toISOString().split("T")[0];
  
  const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
  
  console.log('📅 ダッシュボード: 週開始日 =', weekStart);
  console.log('👤 ユーザー名 =', username);
  
  // 1. 今週の目標時間グラフ
  const goalKey = `${username}_goals_${weekStart}`;
  console.log('🎯 目標データキー =', goalKey);
  const savedGoal = JSON.parse(localStorage.getItem(goalKey) || "null");
  console.log('📊 取得した目標データ =', savedGoal);
  const goalCtx = document.getElementById('goalChart');
  const goalNote = document.getElementById('goal-note');
  
  // 2. 先週の学習実績グラフ用のデータ取得
  const key = `${username}_${weekStart}`;
  console.log('📝 学習データキー（先週扱い） =', key);
  const allData = JSON.parse(localStorage.getItem("allSubmissions") || "{}");
  const weekData = allData[key];
  console.log('📚 取得した学習データ（先週扱い） =', weekData);
  const actualCtx = document.getElementById('actualChart');
  const actualNote = document.getElementById('actual-note');
  
  // Y軸の最大値を統一するため、両方のデータから最大値を取得
  let goalData = [0, 0, 0, 0, 0, 0];
  let actualData = [0, 0, 0, 0, 0, 0];
  
  if (savedGoal) {
    goalData = subjects.map(subject => savedGoal[subject] || 0);
  }
  
  if (weekData && weekData.data) {
    actualData = subjects.map(subject => weekData.data[subject] || 0);
  }
  
  const maxValue = Math.max(...goalData, ...actualData, 10); // 最小値10を設定
  const yAxisMax = Math.ceil(maxValue * 1.1); // 最大値の1.1倍を上限に設定
  const hasGoal = !!savedGoal;
  const goalTotal = goalData.reduce((sum, value) => sum + value, 0);
  const actualTotal = actualData.reduce((sum, value) => sum + value, 0);
  updateGoalProgressInsight(goalTotal, actualTotal, hasGoal);
  
  if (goalCtx) {
    if (savedGoal) {
      if (goalNote) goalNote.textContent = `合計: ${subjects.reduce((sum, s) => sum + (savedGoal[s] || 0), 0)}分`;
    } else {
      if (goalNote) goalNote.textContent = '目標未設定';
    }

    new Chart(goalCtx, {
      type: 'bar',
      data: {
        labels: subjects,
        datasets: [{
          label: '目標時間（分）',
          data: goalData,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2,
          borderRadius: 8
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
            max: yAxisMax,
            ticks: { color: '#99ccff' },
            grid: { color: 'rgba(102, 179, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#99ccff' },
            grid: { color: 'rgba(102, 179, 255, 0.1)' }
          }
        }
      }
    });
  }

  if (actualCtx) {
    if (weekData && weekData.data) {
      const totalMinutes = subjects.reduce((sum, s) => sum + (weekData.data[s] || 0), 0);
      if (actualNote) actualNote.textContent = `合計: ${totalMinutes}分`;
    } else {
      if (actualNote) actualNote.textContent = '未提出';
    }

    new Chart(actualCtx, {
      type: 'bar',
      data: {
        labels: subjects,
        datasets: [{
          label: '学習時間（分）',
          data: actualData,
          backgroundColor: 'rgba(0, 191, 255, 0.6)',
          borderColor: 'rgba(0, 191, 255, 1)',
          borderWidth: 2,
          borderRadius: 8
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
            max: yAxisMax,
            ticks: { color: '#99ccff' },
            grid: { color: 'rgba(102, 179, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#99ccff' },
            grid: { color: 'rgba(102, 179, 255, 0.1)' }
          }
        }
      }
    });
  }
}

function updateGoalProgressInsight(goalTotal, actualTotal, hasGoal) {
  const goalProgressElement = document.getElementById('goal-progress-text');
  if (!goalProgressElement) return;

  if (!hasGoal || goalTotal <= 0) {
    goalProgressElement.textContent = '今週の目標を設定すると進捗を確認できます';
    return;
  }

  const percent = Math.min(999, Math.round((actualTotal / goalTotal) * 100));
  const remaining = Math.max(0, goalTotal - actualTotal);
  if (actualTotal >= goalTotal) {
    goalProgressElement.textContent = `達成率 ${percent}% (${actualTotal}分 / ${goalTotal}分) 目標達成`; 
  } else {
    goalProgressElement.textContent = `達成率 ${percent}% (${actualTotal}分 / ${goalTotal}分) あと${remaining}分`; 
  }
}

function updateTaskProgressInsight(tasks) {
  const taskProgressElement = document.getElementById('task-progress-text');
  if (!taskProgressElement) return;

  const totalTasks = tasks.length;
  if (totalTasks === 0) {
    taskProgressElement.textContent = 'タスクを追加すると達成率が表示されます';
    return;
  }

  const completedTasks = tasks.filter((task) => task.completed).length;
  const percent = Math.round((completedTasks / totalTasks) * 100);
  taskProgressElement.textContent = `${completedTasks}/${totalTasks}件 完了 (${percent}%)`;
}

// --- サイドメニューの初期化 ---
function initializeSideMenu() {
  const sideMenu = document.getElementById('side-menu');
  const menuToggle = document.getElementById('menu-toggle');
  
  if (!menuToggle || !sideMenu) {
    console.log('⚠️ メニュー要素が見つかりません');
    return;
  }
  
  console.log('✅ サイドメニュー初期化完了');
  
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sideMenu.classList.toggle('active');
    console.log('メニュートグル:', sideMenu.classList.contains('active'));
  });
  
  // メニュー外をクリックしたら閉じる
  document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      sideMenu.classList.remove('active');
    }
  });
}
