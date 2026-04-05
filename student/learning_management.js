document.addEventListener("DOMContentLoaded", () => {
  // DOM要素の取得
  const label = document.getElementById("week-range-label");
  const currentUserLabel = document.getElementById("current-user");
  const submissionStatus = document.getElementById("submission-status");
  const totalMinutesLabel = document.getElementById("total-minutes");
  const deadlineLabel = document.getElementById("deadline-label");
  const remainingTimeLabel = document.getElementById("remaining-time");
  const submitTargetWeekLabel = document.getElementById("submit-target-week");
  const goalTargetWeekLabel = document.getElementById("goal-target-week");

  // 日付計算
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=日曜, 1=月曜, ..., 6=土曜
  const monday = new Date(today);
  // 日曜日(0)の場合は6日前、それ以外は(1-dayOfWeek)日前
  const daysFromMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + daysFromMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); // 日曜日

  // ヘルパー関数の定義
  function formatDate(d) {
    return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
  }

  function getISODate(d) {
    return d.toISOString().split("T")[0];
  }

  // ユーザー情報取得（最初に取得）
  const username = localStorage.getItem("username");
  if (!username) {
    alert("ログインしてください");
    location.href = 'student_login.html';
    return;
  }
  currentUserLabel.textContent = username;

  // 週の開始日を設定
  const weekStart = getISODate(monday);
  const weekRangeText = `${formatDate(monday)} 〜 ${formatDate(sunday)}`;
  label.textContent = weekRangeText;
  deadlineLabel.textContent = `${formatDate(sunday)} 23:59`;
  if (submitTargetWeekLabel) submitTargetWeekLabel.textContent = weekRangeText;
  if (goalTargetWeekLabel) goalTargetWeekLabel.textContent = weekRangeText;

  // データキーとallData
  const key = `${username}_${weekStart}`;
  const allData = JSON.parse(localStorage.getItem("allSubmissions") || "{}");
  const weekData = allData[key];
  
  let isEditMode = false;

  // 残り時間更新関数
  function updateRemainingTime() {
    const now = new Date();
    const deadline = new Date(sunday);
    deadline.setHours(23, 59, 59);
    const diff = deadline - now;

    if (diff < 0) {
      remainingTimeLabel.innerHTML = '<span style="color: #ff6384;">⚠️ 提出期限を過ぎています</span>';
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      remainingTimeLabel.innerHTML = `<span style="color: #4bc080;">⏰ 残り: ${days}日 ${hours}時間 ${minutes}分</span>`;
    }
  }

  // 合計時間更新関数
  function updateTotal() {
    const form = document.getElementById("weekly-total-form");
    const data = Object.fromEntries(new FormData(form));
    const total = Object.values(data).reduce((sum, val) => sum + (Number(val) || 0), 0);
    totalMinutesLabel.textContent = `${total}分`;
  }

  // 進捗状況更新関数
  function updateProgress() {
    const goalKey = `${username}_goals_${weekStart}`;
    const savedGoal = JSON.parse(localStorage.getItem(goalKey) || "null");
    
    if (!savedGoal) {
      return; // 目標未設定の場合は何もしない
    }

    // 現在の入力値を取得
    const form = document.getElementById("weekly-total-form");
    const currentData = Object.fromEntries(new FormData(form));
    const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
    
    let totalGoal = 0;
    let totalActual = 0;
    
    subjects.forEach(subject => {
      const goal = Number(savedGoal[subject]) || 0;
      const actual = Number(currentData[subject]) || 0;
      totalGoal += goal;
      totalActual += actual;
    });

    // 全体の進捗を更新
    const progressPercent = totalGoal > 0 ? Math.min((totalActual / totalGoal) * 100, 100) : 0;
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");
    
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`;
    }
    
    if (progressText) {
      const remaining = Math.max(totalGoal - totalActual, 0);
      progressText.textContent = `達成率: ${progressPercent.toFixed(1)}% (目標まで残り: ${remaining}分)`;
    }

    // 科目別詳細を更新
    const goalDetails = document.getElementById("goal-details");
    if (goalDetails) {
      let html = '<table class="goal-detail-table"><thead><tr><th>教科</th><th>目標</th><th>実績</th><th>達成</th></tr></thead><tbody>';
      subjects.forEach(subject => {
        const goal = Number(savedGoal[subject]) || 0;
        const actual = Number(currentData[subject]) || 0;
        const achieved = actual >= goal ? '✅' : '❌';
        html += `<tr><td>${subject}</td><td>${goal}分</td><td>${actual}分</td><td>${achieved}</td></tr>`;
      });
      html += '</tbody></table>';
      goalDetails.innerHTML = html;
    }
  }

  // 先週のデータチェックと目標セクション表示
  function checkLastWeekAndShowGoals() {
    const lastMonday = new Date(monday);
    lastMonday.setDate(monday.getDate() - 7);
    const lastWeekStart = getISODate(lastMonday);
    const lastWeekKey = `${username}_${lastWeekStart}`;
    const lastWeekData = allData[lastWeekKey];

    if (lastWeekData && lastWeekData.data) {
      // 先週のデータがある場合、目標セクションを表示
      const goalSection = document.getElementById("current-week-goal-section");
      if (goalSection) {
        goalSection.style.display = "block";
        
        // セクションタイトルを今週用に設定
        const goalNotice = document.getElementById('goal-notice-text');
        if (goalNotice) {
          goalNotice.textContent = `✅ 提出対象週の前週（${formatDate(lastMonday)}〜）データを確認しました。目標対象週（${formatDate(monday)}〜${formatDate(sunday)}）の目標を設定しましょう。`;
        }
        
        // 保存された目標を読み込み
        loadGoal();
        
        // 目標入力フィールドにイベントリスナーを追加
        const goalInputs = ['国語', '数学', '英語', '理科', '社会', '課題'];
        goalInputs.forEach(subject => {
          const input = document.getElementById(`goal-${subject}`);
          if (input) {
            input.addEventListener('input', updateGoalTotal);
          }
        });

        // 目標設定ボタン
        const setGoalBtn = document.getElementById("set-goal-btn");
        if (setGoalBtn) {
          setGoalBtn.addEventListener("click", saveGoal);
        }
      }
    }
  }

  // 次週の目標セクションを表示（提出後）
  function showNextWeekGoalSection() {
    const goalSection = document.getElementById("current-week-goal-section");
    if (!goalSection) return;
    
    // 提出したのは先週のデータなので、目標を設定するのは今週（現在のmonday）
    const nextMonday = new Date(monday);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    const nextWeekStart = getISODate(nextMonday);
    
    // セクションを表示
    goalSection.style.display = "block";
    
    // タイトルを今週用に更新
    const goalHeader = goalSection.querySelector('.goal-header h2');
    if (goalHeader) {
      goalHeader.textContent = `🎯 目標対象週の学習目標`;
    }
    
    const goalNotice = document.getElementById('goal-notice-text');
    if (goalNotice) {
      goalNotice.textContent = `✅ 提出対象週の提出が完了しました。目標対象週（${formatDate(nextMonday)}〜${formatDate(nextSunday)}）の目標を設定できます。`;
    }
    
    // 次週の保存された目標を読み込み
    const nextGoalKey = `${username}_goals_${nextWeekStart}`;
    const savedNextGoal = JSON.parse(localStorage.getItem(nextGoalKey) || "null");
    
    const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
    subjects.forEach(subject => {
      const input = document.getElementById(`goal-${subject}`);
      if (input) {
        input.value = savedNextGoal && savedNextGoal[subject] !== undefined ? savedNextGoal[subject] : 0;
        // イベントリスナーが重複しないようにremoveしてから追加
        input.removeEventListener('input', updateGoalTotal);
        input.addEventListener('input', updateGoalTotal);
      }
    });
    
    updateGoalTotal();
    
    // 目標設定ボタンのイベントを再設定
    const setGoalBtn = document.getElementById("set-goal-btn");
    if (setGoalBtn) {
      // 古いリスナーをクローンで削除
      const newBtn = setGoalBtn.cloneNode(true);
      setGoalBtn.parentNode.replaceChild(newBtn, setGoalBtn);
      
      newBtn.addEventListener("click", () => {
        const goalData = {};
        let hasInvalidValue = false;

        subjects.forEach(subject => {
          const input = document.getElementById(`goal-${subject}`);
          if (input) {
            const val = Number(input.value) || 0;
            if (val < 0 || val > 1000) {
              hasInvalidValue = true;
            }
            goalData[subject] = val;
          }
        });

        if (hasInvalidValue) {
          alert("❌ 入力値が不正です。\n0〜1000分の範囲で入力してください。");
          return;
        }

        localStorage.setItem(nextGoalKey, JSON.stringify(goalData));
        alert(`✅ 今週（${formatDate(nextMonday)}〜${formatDate(nextSunday)}）の目標を設定しました！`);
      });
    }
    
    // 進捗表示は非表示（来週のデータがないため）
    const goalDisplay = goalSection.querySelector('.goal-display');
    if (goalDisplay) {
      goalDisplay.style.display = 'none';
    }
  }

  // 目標の合計を更新
  function updateGoalTotal() {
    const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
    let total = 0;
    subjects.forEach(subject => {
      const input = document.getElementById(`goal-${subject}`);
      if (input) {
        total += Number(input.value) || 0;
      }
    });
    const goalTotalLabel = document.getElementById("goal-total");
    if (goalTotalLabel) {
      goalTotalLabel.textContent = `${total}分`;
    }
  }

  // 目標を保存
  function saveGoal() {
    const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
    const goalData = {};
    let hasInvalidValue = false;

    subjects.forEach(subject => {
      const input = document.getElementById(`goal-${subject}`);
      if (input) {
        const val = Number(input.value) || 0;
        if (val < 0 || val > 1000) {
          hasInvalidValue = true;
        }
        goalData[subject] = val;
      }
    });

    if (hasInvalidValue) {
      alert("❌ 入力値が不正です。\n0〜1000分の範囲で入力してください。");
      return;
    }

    const goalKey = `${username}_goals_${weekStart}`;
    localStorage.setItem(goalKey, JSON.stringify(goalData));
    alert("✅ 目標を設定しました！");
    
    // 進捗を更新
    updateProgress();
  }

  // 目標を読み込み
  function loadGoal() {
    const goalKey = `${username}_goals_${weekStart}`;
    const savedGoal = JSON.parse(localStorage.getItem(goalKey) || "null");
    
    if (savedGoal) {
      const subjects = ['国語', '数学', '英語', '理科', '社会', '課題'];
      subjects.forEach(subject => {
        const input = document.getElementById(`goal-${subject}`);
        if (input && savedGoal[subject] !== undefined) {
          input.value = savedGoal[subject];
        }
      });
      updateGoalTotal();
      updateProgress();
    }
  }

  // 既存データを読み込む
  if (weekData && weekData.data) {
    isEditMode = true;
    submissionStatus.textContent = "✅ 提出済み（編集モード）";
    submissionStatus.className = "submission-status submitted";
    
    const form = document.getElementById("weekly-total-form");
    Object.keys(weekData.data).forEach(subject => {
      const input = form.querySelector(`input[name="${subject}"]`);
      if (input) {
        input.value = weekData.data[subject];
      }
    });
    updateTotal();
    
    // 最終提出時刻を表示
    if (weekData.submittedAt) {
      const submitDate = new Date(weekData.submittedAt);
      document.getElementById("last-submit-time").textContent = `最終提出: ${submitDate.getMonth()+1}/${submitDate.getDate()} ${submitDate.getHours()}:${String(submitDate.getMinutes()).padStart(2, '0')}`;
    }
  } else {
    submissionStatus.textContent = "❌ 未提出";
    submissionStatus.className = "submission-status not-submitted";
    document.getElementById("last-submit-time").textContent = "最終提出: なし";
  }

  // 入力時に合計を更新
  const inputs = document.querySelectorAll('#subject-inputs input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      updateTotal();
      updateProgress();
    });
  });

  // クリアボタン
  document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("入力内容をすべてクリアしますか？")) {
      inputs.forEach(input => input.value = 0);
      updateTotal();
      updateProgress();
    }
  });

  // 保存ボタン
  document.getElementById("save-btn").addEventListener("click", () => {
    const form = document.getElementById("weekly-total-form");
    const data = Object.fromEntries(new FormData(form));
    
    // バリデーション
    let hasInvalidValue = false;
    Object.values(data).forEach(val => {
      const num = Number(val);
      if (num < 0 || num > 1000) hasInvalidValue = true;
    });

    if (hasInvalidValue) {
      alert("❌ 入力値が不正です。\n0〜1000分の範囲で入力してください。");
      return;
    }

    // 編集モードの場合は確認
    let confirmMessage = "この内容で提出しますか？";
    if (isEditMode) {
      confirmMessage = "⚠️ 既に提出済みのデータを上書きします。\nよろしいですか？";
    }

    if (!confirm(confirmMessage)) {
      return;
    }

    // データを整形
    Object.keys(data).forEach(k => data[k] = Number(data[k]) || 0);

    // 保存
    const submissionData = {
      username: username,
      week: weekStart,
      data: data,
      submittedAt: new Date().toISOString()
    };
    
    allData[key] = submissionData;
    localStorage.setItem("allSubmissions", JSON.stringify(allData));

    // サーバーに自動保存
    saveStudyDataToServer(username, weekStart, data);

    // 統計データを更新（ダッシュボード用）
    const totalMinutes = Object.values(data).reduce((sum, val) => sum + val, 0);
    localStorage.setItem(`${username}_totalStudyHours`, totalMinutes);
    
    // 状態を更新
    isEditMode = true;
    submissionStatus.textContent = "✅ 提出済み（編集モード）";
    submissionStatus.className = "submission-status submitted";
    
    const submitDate = new Date();
    document.getElementById("last-submit-time").textContent = `最終提出: ${submitDate.getMonth()+1}/${submitDate.getDate()} ${submitDate.getHours()}:${String(submitDate.getMinutes()).padStart(2, '0')}`;
    
    // 提出後、次週の目標セクションを表示
    showNextWeekGoalSection();
  });

  // 初期化処理
  updateRemainingTime();
  setInterval(updateRemainingTime, 60000); // 1分ごとに更新
  updateTotal();
  checkLastWeekAndShowGoals();
  updateProgress();
});

// ファイル保存関数（複数週のデータを1ファイルに蓄積）
function saveStudyDataToFile(username, weekStart, data) {
  /サーバーにデータを送信して保存
async function saveStudyDataToServer(username, weekStart, data) {
  try {
    const response = await fetch(`http://localhost:3000/api/study-data/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        weekStart: weekStart,
        data: data
      })
    });

    const result = await response.json();

    if (result.success) {
      alert(`✅ 学習時間を提出しました！\nサーバーに保存されました（全${result.totalWeeks}週分）\nダッシュボードのグラフに反映されます。`);
      console.log(`📁 保存先: management_dataFile/${username}_study_data.json`);
      console.log(`📊 総週数: ${result.totalWeeks}週分`);
      location.reload();
    } else {
      throw new Error(result.error || '保存に失敗しました');
    }
  } catch (error) {
    console.error('サーバー保存エラー:', error);
    alert(`❌ サーバーへの保存に失敗しました。\n\nエラー: ${error.message}\n\n確認事項:\n1. サーバーが起動していますか？\n2. ターミナルで「npm start」を実行してください`);
  }