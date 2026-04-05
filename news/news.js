// 📢 STARS お知らせ一覧制御スクリプト
document.addEventListener("DOMContentLoaded", () => {
  console.log("📰 STARS News ページ読み込み完了");

  const newsList = [
    {
      title: "講師ログイン機能を追加しました",
      date: "2025-10-16",
      content: "講師専用ページを新設し、提出状況や出席管理を行えるようになりました。"
    },
    {
      title: "生徒ページにセッション切れ機能を導入",
      date: "2025-10-10",
      content: "一定時間操作がない場合、自動的にログアウトされるようになりました。"
    },
    {
      title: "秋季イベント『STARSフェス2025』開催決定！",
      date: "2025-11-01",
      content: "塾内発表会・作品展示などの特別イベントを開催予定です。"
    },
    {
      title: "新教材アップロードシステムを追加",
      date: "2025-09-25",
      content: "講師が教材をアップロードすると生徒が即座に閲覧できるようになりました。"
    }
  ];

  const container = document.getElementById("news-list");

  // 一覧を生成
  newsList.forEach(item => {
    const article = document.createElement("article");
    article.classList.add("news-item");
    article.innerHTML = `
      <h3>${item.title}</h3>
      <span class="date">${item.date}</span>
      <p>${item.content}</p>
    `;
    container.appendChild(article);
  });
});
