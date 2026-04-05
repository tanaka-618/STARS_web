// 教材データ（実際のアプリケーションではAPIから取得）
let materialsData = [
    {
        id: 1,
        title: '微分積分学 第1章',
        subject: '数学',
        type: '講義資料',
        description: '微分の基礎概念と導関数の定義について学びます。',
        uploadDate: '2025-12-20',
        fileSize: '2.5 MB',
        fileType: 'PDF',
        downloads: 45,
        status: '公開中'
    },
    {
        id: 2,
        title: '英文法演習問題集',
        subject: '英語',
        type: '演習問題',
        description: '時制、助動詞、関係詞の演習問題です。',
        uploadDate: '2025-12-18',
        fileSize: '1.8 MB',
        fileType: 'PDF',
        downloads: 38,
        status: '公開中'
    },
    {
        id: 3,
        title: '有機化学実験 動画解説',
        subject: '理科',
        type: '動画',
        description: 'エステル合成の実験手順を動画で詳しく解説します。',
        uploadDate: '2025-12-27',
        fileSize: '125 MB',
        fileType: 'MP4',
        downloads: 12,
        status: '公開中'
    },
    {
        id: 4,
        title: '古文読解のポイント',
        subject: '国語',
        type: '参考資料',
        description: '助動詞の識別と敬語表現のまとめです。',
        uploadDate: '2025-12-15',
        fileSize: '1.2 MB',
        fileType: 'PDF',
        downloads: 52,
        status: '公開中'
    },
    {
        id: 5,
        title: '世界史 産業革命まとめ',
        subject: '社会',
        type: '講義資料',
        description: 'イギリスの産業革命とその影響について解説します。',
        uploadDate: '2025-12-22',
        fileSize: '3.2 MB',
        fileType: 'PDF',
        downloads: 29,
        status: '公開中'
    },
    {
        id: 6,
        title: 'Python基礎プログラミング',
        subject: '情報',
        type: '講義資料',
        description: '変数、条件分岐、繰り返し処理の基礎を学びます。',
        uploadDate: '2025-12-10',
        fileSize: '2.1 MB',
        fileType: 'PDF',
        downloads: 67,
        status: '公開中'
    },
    {
        id: 7,
        title: '三角関数 練習問題（作成中）',
        subject: '数学',
        type: '演習問題',
        description: 'sin、cos、tanの基本問題と応用問題です。',
        uploadDate: '2025-12-25',
        fileSize: '1.5 MB',
        fileType: 'PDF',
        downloads: 0,
        status: '非公開'
    }
];

// 現在のフィルター設定
let currentFilters = {
    search: '',
    subject: '',
    type: '',
    status: ''
};

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    displayMaterials(materialsData);
    attachEventListeners();
    setupFileInput();
});

// イベントリスナーの設定
function attachEventListeners() {
    // 検索ボタン
    document.getElementById('searchBtn').addEventListener('click', applyFilters);
    
    // Enterキーで検索
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });

    // フィルター変更時
    document.getElementById('subjectFilter').addEventListener('change', applyFilters);
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);

    // モーダルの外側クリックで閉じる
    ['uploadModal', 'editModal', 'deleteModal'].forEach(modalId => {
        document.getElementById(modalId).addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(modalId);
            }
        });
    });
}

// ファイル入力の設定
function setupFileInput() {
    const fileInput = document.getElementById('materialFile');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = 'ファイルを選択';
        }
    });
}

// 統計情報の更新
function updateStats() {
    const total = materialsData.length;
    const totalDownloads = materialsData.reduce((sum, m) => sum + m.downloads, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthUploads = materialsData.filter(m => new Date(m.uploadDate) >= thisMonth).length;
    
    // アクティブな学生数（ダミーデータ）
    const activeStudents = 124;

    document.getElementById('totalMaterials').textContent = total;
    document.getElementById('thisMonthUploads').textContent = thisMonthUploads;
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('activeStudents').textContent = activeStudents;
}

// 教材の表示
function displayMaterials(materials) {
    const tbody = document.getElementById('materialsTableBody');
    const noMaterials = document.getElementById('noMaterials');

    if (materials.length === 0) {
        tbody.parentElement.parentElement.style.display = 'none';
        noMaterials.style.display = 'block';
        return;
    }

    tbody.parentElement.parentElement.style.display = 'block';
    noMaterials.style.display = 'none';
    
    tbody.innerHTML = materials.map(material => `
        <tr>
            <td><strong>${material.title}</strong></td>
            <td>${material.subject}</td>
            <td>${material.type}</td>
            <td>${formatDate(material.uploadDate)}</td>
            <td>${material.fileSize}</td>
            <td>${material.downloads}</td>
            <td>
                <span class="status-badge ${material.status === '公開中' ? 'public' : 'private'}">
                    ${material.status}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="openEditModal(${material.id})">編集</button>
                    <button class="btn-delete" onclick="openDeleteModal(${material.id})">削除</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// フィルターの適用
function applyFilters() {
    currentFilters.search = document.getElementById('searchInput').value.toLowerCase();
    currentFilters.subject = document.getElementById('subjectFilter').value;
    currentFilters.type = document.getElementById('typeFilter').value;
    currentFilters.status = document.getElementById('statusFilter').value;

    let filtered = materialsData.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(currentFilters.search) ||
                            material.description.toLowerCase().includes(currentFilters.search);
        const matchesSubject = !currentFilters.subject || material.subject === currentFilters.subject;
        const matchesType = !currentFilters.type || material.type === currentFilters.type;
        const matchesStatus = !currentFilters.status || material.status === currentFilters.status;
        
        return matchesSearch && matchesSubject && matchesType && matchesStatus;
    });

    displayMaterials(filtered);
}

// アップロードモーダルを開く
function openUploadModal() {
    const modal = document.getElementById('uploadModal');
    document.getElementById('uploadForm').reset();
    document.getElementById('fileNameDisplay').textContent = 'ファイルを選択';
    modal.classList.add('show');
}

// アップロードモーダルを閉じる
function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.classList.remove('show');
}

// 教材をアップロード
function uploadMaterial() {
    const title = document.getElementById('materialTitle').value;
    const subject = document.getElementById('materialSubject').value;
    const type = document.getElementById('materialType').value;
    const description = document.getElementById('materialDescription').value;
    const file = document.getElementById('materialFile').files[0];
    const isPublic = document.getElementById('materialPublic').checked;

    // バリデーション
    if (!title || !subject || !type || !file) {
        alert('必須項目を入力してください');
        return;
    }

    // 新しい教材オブジェクトを作成
    const newMaterial = {
        id: materialsData.length > 0 ? Math.max(...materialsData.map(m => m.id)) + 1 : 1,
        title: title,
        subject: subject,
        type: type,
        description: description,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: formatFileSize(file.size),
        fileType: file.name.split('.').pop().toUpperCase(),
        downloads: 0,
        status: isPublic ? '公開中' : '非公開'
    };

    // データに追加
    materialsData.unshift(newMaterial);

    // UIを更新
    updateStats();
    applyFilters();
    closeUploadModal();

    alert(`「${title}」をアップロードしました！`);
}

// 編集モーダルを開く
function openEditModal(id) {
    const material = materialsData.find(m => m.id === id);
    if (!material) return;

    document.getElementById('editMaterialId').value = material.id;
    document.getElementById('editTitle').value = material.title;
    document.getElementById('editSubject').value = material.subject;
    document.getElementById('editType').value = material.type;
    document.getElementById('editDescription').value = material.description;
    document.getElementById('editStatus').value = material.status;

    const modal = document.getElementById('editModal');
    modal.classList.add('show');
}

// 編集モーダルを閉じる
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
}

// 編集を保存
function saveEdit() {
    const id = parseInt(document.getElementById('editMaterialId').value);
    const material = materialsData.find(m => m.id === id);
    if (!material) return;

    material.title = document.getElementById('editTitle').value;
    material.subject = document.getElementById('editSubject').value;
    material.type = document.getElementById('editType').value;
    material.description = document.getElementById('editDescription').value;
    material.status = document.getElementById('editStatus').value;

    updateStats();
    applyFilters();
    closeEditModal();

    alert('教材を更新しました！');
}

// 削除モーダルを開く
function openDeleteModal(id) {
    const material = materialsData.find(m => m.id === id);
    if (!material) return;

    document.getElementById('deleteMaterialId').value = material.id;
    document.getElementById('deleteTitle').textContent = material.title;

    const modal = document.getElementById('deleteModal');
    modal.classList.add('show');
}

// 削除モーダルを閉じる
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('show');
}

// 削除を確認
function confirmDelete() {
    const id = parseInt(document.getElementById('deleteMaterialId').value);
    const index = materialsData.findIndex(m => m.id === id);
    
    if (index !== -1) {
        const title = materialsData[index].title;
        materialsData.splice(index, 1);
        
        updateStats();
        applyFilters();
        closeDeleteModal();
        
        alert(`「${title}」を削除しました`);
    }
}

// モーダルを閉じるヘルパー関数
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// 日付のフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}/${month}/${day}`;
}

// ファイルサイズのフォーマット
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
}

// ローカルストレージからデータを読み込む（オプション）
function loadFromStorage() {
    const saved = localStorage.getItem('teacherMaterialsData');
    if (saved) {
        materialsData = JSON.parse(saved);
    }
}

// ローカルストレージにデータを保存（オプション）
function saveToStorage() {
    localStorage.setItem('teacherMaterialsData', JSON.stringify(materialsData));
}
