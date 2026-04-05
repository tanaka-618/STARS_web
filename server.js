// サーバサイド: Expressでテスト結果を保存・取得するAPI
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, '../data');

app.use(bodyParser.json());

// dataディレクトリがなければ作成
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// テスト結果を保存（POST）
app.post('/api/test-results', (req, res) => {
  const { username, results } = req.body;
  if (!username || !results) {
    return res.status(400).json({ error: 'usernameとresultsが必要です' });
  }
  const filePath = path.join(DATA_DIR, `${username}_testResults.json`);
  fs.writeFile(filePath, JSON.stringify(results, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: '保存に失敗しました' });
    }
    res.json({ message: '保存しました' });
  });
});

// テスト結果を取得（GET）
app.get('/api/test-results', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'usernameが必要です' });
  }
  const filePath = path.join(DATA_DIR, `${username}_testResults.json`);
  if (!fs.existsSync(filePath)) {
    return res.json({ results: [] });
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: '読み込みに失敗しました' });
    }
    res.json({ results: JSON.parse(data) });
  });
});

app.listen(PORT, () => {
  console.log(`サーバ起動: http://localhost:${PORT}`);
});
