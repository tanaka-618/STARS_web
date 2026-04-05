// 📆 STARS カレンダー制御スクリプト
let currentYear = 2025;
let currentMonth = 0; // 0 = 1月
let events = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ カレンダー読み込み完了');

  const username = localStorage.getItem('username') || 'guest';
  const userType = localStorage.getItem('userType') || 'student'; // 'student' or 'teacher'
  
  // ユーザータイプ表示
  const userTypeLabel = document.getElementById('user-type-label');
  if (userTypeLabel) {
    userTypeLabel.textContent = userType === 'teacher' ? '[講師モード]' : '[閲覧専用]';
    userTypeLabel.style.color = userType === 'teacher' ? '#ffd700' : '#99ccff';
  }
  
  // 戻るボタン
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (userType === 'teacher') {
        window.location.href = '../teacher/dashboard_teacher.html';
      } else {
        window.location.href = 'dashboard_student.html';
      }
    });
  }
  
  // 生徒の場合はイベント追加フォームを非表示に
  const addEventCard = document.getElementById('add-event-card');
  if (userType === 'teacher' && addEventCard) {
    addEventCard.style.display = 'block';
  } else if (addEventCard) {
    addEventCard.style.display = 'none';
  }
  
  // localStorageからユーザー専用のイベントを読み込み
  const savedEvents = localStorage.getItem(`${username}_calendarEvents`);
  if (savedEvents) {
    events = JSON.parse(savedEvents);
  } else {
    // サンプルイベント
    events = [
      { date: '2025-01-15', type: 'test', title: '数学テスト' },
      { date: '2025-01-20', type: 'homework', title: '英語課題提出' },
      { date: '2025-01-25', type: 'event', title: '保護者面談' }
    ];
    saveEvents();
  }

  // 現在の日付を設定
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();

  renderCalendar();
  renderEventList();

  // 月移動ボタン
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // イベント追加フォーム（講師のみ）
  const eventForm = document.getElementById('event-form');
  if (eventForm && userType === 'teacher') {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const date = document.getElementById('event-date').value;
      const type = document.getElementById('event-type').value;
      const title = document.getElementById('event-title').value;

      if (date && type && title) {
        events.push({ date, type, title });
        saveEvents();
        renderCalendar();
        renderEventList();
        
        // フォームをリセット
        eventForm.reset();
        alert('✅ イベントを追加しました');
      }
    });
  }
});

function renderCalendar() {
  const calendarGrid = document.getElementById('calendar-grid');
  const monthDisplay = document.getElementById('current-month');

  // 月表示を更新
  monthDisplay.textContent = `${currentYear}年${currentMonth + 1}月`;

  // グリッドをクリア
  calendarGrid.innerHTML = '';

  // 曜日ヘッダー
  const dayHeaders = ['日', '月', '火', '水', '木', '金', '土'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-day-header';
    header.textContent = day;
    calendarGrid.appendChild(header);
  });

  // 月の最初の日と最後の日
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // 今日の日付
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;
  const todayDate = today.getDate();

  // 前月の日付を埋める
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayDiv = createDayElement(prevMonthLastDay - i, true, false);
    calendarGrid.appendChild(dayDiv);
  }

  // 今月の日付
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === todayDate;
    const dayDiv = createDayElement(day, false, isToday);
    calendarGrid.appendChild(dayDiv);
  }

  // 次月の日付を埋める
  const remainingDays = 42 - (startDayOfWeek + daysInMonth); // 6週分
  for (let day = 1; day <= remainingDays; day++) {
    const dayDiv = createDayElement(day, true, false);
    calendarGrid.appendChild(dayDiv);
  }
}

function createDayElement(dayNumber, isOtherMonth, isToday) {
  const dayDiv = document.createElement('div');
  dayDiv.className = 'calendar-day';
  if (isOtherMonth) dayDiv.classList.add('other-month');
  if (isToday) dayDiv.classList.add('today');

  const dayNumSpan = document.createElement('div');
  dayNumSpan.className = 'day-number';
  dayNumSpan.textContent = dayNumber;
  dayDiv.appendChild(dayNumSpan);

  // この日のイベントを表示
  if (!isOtherMonth) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);

    if (dayEvents.length > 0) {
      const eventsContainer = document.createElement('div');
      eventsContainer.className = 'day-events';
      
      dayEvents.forEach(event => {
        const dot = document.createElement('div');
        dot.className = `event-dot ${event.type}`;
        dot.title = event.title;
        eventsContainer.appendChild(dot);
      });

      dayDiv.appendChild(eventsContainer);
    }
  }

  return dayDiv;
}

function renderEventList() {
  const eventList = document.getElementById('event-list');
  const userType = localStorage.getItem('userType') || 'student';
  eventList.innerHTML = '';

  if (events.length === 0) {
    eventList.innerHTML = '<p style="text-align: center; color: #99ccff; padding: 20px;">イベントがありません</p>';
    return;
  }

  // 日付順にソート
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  sortedEvents.forEach((event, index) => {
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${event.type}`;

    const eventDate = new Date(event.date);
    const dateStr = `${eventDate.getFullYear()}年${eventDate.getMonth() + 1}月${eventDate.getDate()}日`;

    const typeLabel = {
      test: '📝 テスト',
      homework: '📚 課題',
      event: '📌 イベント'
    }[event.type] || '📌 イベント';

    // 講師のみ削除ボタンを表示
    const deleteButton = userType === 'teacher' 
      ? `<button class="event-delete" data-index="${index}">削除</button>`
      : '';

    eventItem.innerHTML = `
      <div class="event-info">
        <div class="event-date">${dateStr}</div>
        <div class="event-title">${typeLabel}: ${event.title}</div>
      </div>
      ${deleteButton}
    `;

    eventList.appendChild(eventItem);
  });

  // 削除ボタンのイベント（講師のみ）
  if (userType === 'teacher') {
    document.querySelectorAll('.event-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (confirm('このイベントを削除しますか？')) {
          events.splice(index, 1);
          saveEvents();
          renderCalendar();
          renderEventList();
        }
      });
    });
  }
}

function saveEvents() {
  const username = localStorage.getItem('username') || 'guest';
  localStorage.setItem(`${username}_calendarEvents`, JSON.stringify(events));
}
