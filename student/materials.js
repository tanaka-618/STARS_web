// 教材データを取得
let materialsData = generateMaterialsData();

// フラット化されたデータ（検索用）
let flatMaterialsData = [];

// 現在のフィルター設定
let currentFilters = {
    search: '',
    type: '',
    sortBy: 'newest'
};

// 現在選択されている教科タブ・フォルダ
let currentSubjectTab = '';
let currentFolder = '';
let currentPreviewMaterialId = null;

const GRADE_ORDER = ['中1', '中2', '中3', '高1', '高2', '高3', '全学年共通'];

const SUBJECT_TABS = [
    { key: '英語',   label: '英語',   icon: '🔤' },
    { key: '数学',   label: '数学',   icon: '📐' },
    { key: '国語',   label: '国語',   icon: '📖' },
    { key: '社会',   label: '社会',   icon: '🌏' },
    { key: '理科',   label: '理科',   icon: '🔬' },
    { key: '副教科', label: '副教科', icon: '📚' },
    { key: '過去問', label: '過去問', icon: '📝' },
    { key: '問題集', label: '問題集', icon: '📒' },
    { key: '全学年共通', label: '全学年共通', icon: '📂' },
    { key: 'その他', label: 'その他', icon: '📄' },
];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    flattenMaterialsData();
    loadFromStorage();
    updateStats();
    renderSubjectTabs();
    displayMaterials(flatMaterialsData);
    attachEventListeners();
});

// データをフラット化（問題集・過去問はサブフォルダ名をm.folderに記録）
function flattenMaterialsData() {
    flatMaterialsData = [];
    for (const grade in materialsData) {
        for (const subject in materialsData[grade]) {
            if (Array.isArray(materialsData[grade][subject])) {
                materialsData[grade][subject].forEach(m => {
                    m.folder = (grade === '問題集' || grade === '過去問') ? subject : null;
                    flatMaterialsData.push(m);
                });
            }
        }
    }
}

// 教科タブの描画
function renderSubjectTabs() {
    const filterSection = document.querySelector('.filter-section');
    const html = `<div class="grade-tabs">${
        SUBJECT_TABS.map(t =>
            `<button class="grade-tab${currentSubjectTab === t.key ? ' active' : ''}" onclick="selectSubjectTab('${t.key}')">${t.label}</button>`
        ).join('')
    }</div>`;
    filterSection.insertAdjacentHTML('afterbegin', html);
}

// 教科タブを選択
function selectSubjectTab(tabKey) {
    currentSubjectTab = tabKey;
    currentFolder = '';
    document.querySelectorAll('.grade-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    showFolderView();
}

// 教科タブに対応した素材マッチング判定
function matchesSubjectTab(material, tabKey) {
    if (!tabKey) return true;
    if (material.grade === '問題集') return tabKey === '問題集';
    if (material.grade === '過去問') return tabKey === '過去問';
    if (material.grade === '全学年共通') return tabKey === '全学年共通';
    if (tabKey === '英語')   return material.subject.includes('英語');
    if (tabKey === '数学')   return material.subject.includes('数学');
    if (tabKey === '国語')   return material.subject.includes('国語');
    if (tabKey === '社会')   return material.subject.includes('社会');
    if (tabKey === '理科')   return material.subject.includes('理科');
    if (tabKey === '副教科') return false;
    if (tabKey === 'その他') {
        return !['\u82f1\u8a9e','\u6570\u5b66','\u56fd\u8a9e','\u793e\u4f1a','\u7406\u79d1'].some(s => material.subject.includes(s));
    }
    return false;
}

// タブに対応するフォルダ一覧を取得
function getFoldersForTab(tabKey) {
    const filtered = flatMaterialsData.filter(m => matchesSubjectTab(m, tabKey));
    if (tabKey === '問題集' || tabKey === '過去問') {
        const map = {};
        filtered.forEach(m => { const f = m.folder || m.subject; map[f] = (map[f] || 0) + 1; });
        return Object.entries(map).map(([name, count]) => ({ name, count }));
    } else {
        const map = {};
        filtered.forEach(m => { map[m.grade] = (map[m.grade] || 0) + 1; });
        return GRADE_ORDER.filter(g => map[g]).map(g => ({ name: g, count: map[g] }));
    }
}

// フォルダ内の資料を取得
function getMaterialsInFolder(tabKey, folderName) {
    return flatMaterialsData.filter(m => {
        if (!matchesSubjectTab(m, tabKey)) return false;
        if (tabKey === '問題集' || tabKey === '過去問') {
            return (m.folder || m.subject) === folderName;
        }
        return m.grade === folderName;
    });
}

// フォルダビューを表示
function showFolderView() {
    updateBreadcrumb();
    const grid = document.getElementById('materialsGrid');
    const noMaterials = document.getElementById('noMaterials');

    if (!currentSubjectTab) {
        applyFilters();
        return;
    }

    const folders = getFoldersForTab(currentSubjectTab);

    if (folders.length === 0) {
        grid.style.display = 'none';
        noMaterials.style.display = 'block';
        return;
    }

    noMaterials.style.display = 'none';
    grid.className = 'folders-grid';
    grid.style.display = 'grid';
    grid.innerHTML = folders.map(({ name, count }) => {
        const safe = name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        return `<div class="folder-card" onclick="enterFolder('${safe}')">
            <div class="folder-icon">📁</div>
            <div class="folder-info">
                <h3 class="folder-name">${name}</h3>
                <p class="folder-count">${count}件の資料</p>
            </div>
            <span class="folder-arrow">›</span>
        </div>`;
    }).join('');
}

// フォルダに入る
function enterFolder(folderName) {
    currentFolder = folderName;
    document.getElementById('materialsGrid').className = 'materials-grid';
    updateBreadcrumb();
    applyFilters();
}

// パンくずナビの更新
function updateBreadcrumb() {
    const el = document.getElementById('breadcrumb');
    if (!el) return;
    if (!currentSubjectTab && !currentFolder) { el.innerHTML = ''; return; }

    let html = '<ol class="breadcrumb-list">';
    html += '<li><button class="breadcrumb-link" onclick="clearSubjectSel()">全て</button></li>';
    if (currentSubjectTab) {
        html += '<li><span class="breadcrumb-sep">›</span></li>';
        if (currentFolder) {
            html += `<li><button class="breadcrumb-link" onclick="backToFolder()">${currentSubjectTab}</button></li>`;
            html += '<li><span class="breadcrumb-sep">›</span></li>';
            html += `<li><span class="breadcrumb-current">${currentFolder}</span></li>`;
        } else {
            html += `<li><span class="breadcrumb-current">${currentSubjectTab}</span></li>`;
        }
    }
    html += '</ol>';
    el.innerHTML = html;
}

// 教科フォルダ一覧に戻る
function backToFolder() {
    currentFolder = '';
    showFolderView();
}

// 全体表示に戻る
function clearSubjectSel() {
    currentSubjectTab = '';
    currentFolder = '';
    document.querySelectorAll('.grade-tab').forEach(tab => tab.classList.remove('active'));
    updateBreadcrumb();
    applyFilters();
}

// 教科フィルター（タブなし時のみ使用）
function updateSubjectFilter() {
    // タブベースのナビゲーションに切り替えたため、ドロップダウンは型フィルター専用
}

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
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
}

// 統計情報の更新
function updateStats() {
    const total = flatMaterialsData.length;
    const viewed = flatMaterialsData.filter(m => m.viewed).length;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newMaterials = flatMaterialsData.filter(m => new Date(m.uploadDate) > oneWeekAgo).length;

    document.getElementById('totalMaterials').textContent = total;
    document.getElementById('downloadedMaterials').textContent = viewed;
    document.getElementById('newMaterials').textContent = newMaterials;
}

// 資料の表示
function displayMaterials(materials) {
    const grid = document.getElementById('materialsGrid');
    const noMaterials = document.getElementById('noMaterials');

    if (materials.length === 0) {
        grid.style.display = 'none';
        noMaterials.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noMaterials.style.display = 'none';
    grid.className = 'materials-grid';

    grid.innerHTML = materials.map(material => `
        <div class="material-card" data-id="${material.id}">
            <div class="material-main">
                <div class="material-icon" aria-hidden="true">${material.icon}</div>
                <div class="material-info">
                    <h3 class="material-title">${material.title}</h3>
                    <div class="material-meta">
                        <span class="material-meta-item">${material.grade}</span>
                        <span class="material-meta-item">${material.subject}</span>
                        <span class="material-meta-item">${material.type}</span>
                        ${material.isNew ? '<span class="material-badge new">NEW</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="material-actions">
                <button class="btn-secondary" onclick="previewMaterial(${material.id})">情報</button>
                <button class="btn-primary" onclick="openMaterialInNewTab(${material.id})">開く</button>
            </div>
        </div>
    `).join('');
}

// フィルターの適用
function applyFilters() {
    currentFilters.search = document.getElementById('searchInput').value.toLowerCase();
    currentFilters.type = document.getElementById('typeFilter').value;
    currentFilters.sortBy = document.getElementById('sortBy').value;

    let filtered;
    if (currentSubjectTab && currentFolder) {
        filtered = getMaterialsInFolder(currentSubjectTab, currentFolder);
    } else if (currentSubjectTab && !currentFolder) {
        showFolderView();
        return;
    } else {
        filtered = [...flatMaterialsData];
    }

    filtered = filtered.filter(material => {
        const matchesSearch = !currentFilters.search ||
            material.title.toLowerCase().includes(currentFilters.search) ||
            material.description.toLowerCase().includes(currentFilters.search);
        const matchesType = !currentFilters.type || material.type === currentFilters.type;
        return matchesSearch && matchesType;
    });

    // ソート
    filtered.sort((a, b) => {
        switch(currentFilters.sortBy) {
            case 'newest':
                return new Date(b.uploadDate) - new Date(a.uploadDate);
            case 'oldest':
                return new Date(a.uploadDate) - new Date(b.uploadDate);
            case 'name':
                return a.title.localeCompare(b.title, 'ja');
            default:
                return 0;
        }
    });

    displayMaterials(filtered);
}

// 資料のプレビュー
function previewMaterial(id) {
    const material = flatMaterialsData.find(m => m.id === id);
    if (!material) return;
    currentPreviewMaterialId = id;

    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewTitle');
    const content = document.getElementById('previewContent');
    
    title.textContent = material.title;
    
    // プレビューコンテンツの生成
    content.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">${material.icon}</div>
            <h3>${material.title}</h3>
            <p style="color: #666; margin: 1rem 0;">${material.description}</p>
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                <p><strong>学年:</strong> ${material.grade}</p>
                <p><strong>科目:</strong> ${material.subject}</p>
                <p><strong>種類:</strong> ${material.type}</p>
                <p><strong>ファイルサイズ:</strong> ${material.fileSize}</p>
                <p><strong>形式:</strong> ${material.fileType}</p>
                <p><strong>アップロード日:</strong> ${formatDate(material.uploadDate)}</p>
            </div>
            ${material.fileType === 'PDF' ? 
                '<p style="color: #666; margin-top: 1rem;">※ PDFは新しいタブで閲覧できます</p>' : 
                material.fileType === 'MP4' ? 
                '<p style="color: #666; margin-top: 1rem;">※ 動画は新しいタブで再生できます</p>' : 
                ''
            }
        </div>
    `;

    const openInNewTabBtn = document.getElementById('openInNewTabFromPreview');
    if (openInNewTabBtn) {
        if (material.path) {
            openInNewTabBtn.disabled = false;
            openInNewTabBtn.textContent = '開く';
        } else {
            openInNewTabBtn.disabled = true;
            openInNewTabBtn.textContent = '開けない';
        }
    }

    markAsViewed(material);
    updateStats();

    modal.classList.add('show');
}

// モーダルを閉じる
function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('show');
}

// モーダルの外側をクリックしたら閉じる
document.getElementById('previewModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePreview();
    }
});

function openMaterialInNewTab(id) {
    const material = flatMaterialsData.find(m => m.id === id);
    if (!material) return;

    if (material.path) {
        const fileUrl = '../' + encodeURI(material.path);
        const opened = window.open(fileUrl, '_blank', 'noopener,noreferrer');
        // 新規タブ生成に失敗した場合のみ同一タブへフォールバック
        if (!opened) {
            window.location.href = fileUrl;
        }
        markAsViewed(material);
        updateStats();
        return;
    }

    alert('この教材はブラウザ表示に対応していません。');
}

const openInNewTabFromPreviewBtn = document.getElementById('openInNewTabFromPreview');
if (openInNewTabFromPreviewBtn) {
    openInNewTabFromPreviewBtn.addEventListener('click', () => {
        if (!currentPreviewMaterialId) return;
        openMaterialInNewTab(currentPreviewMaterialId);
    });
}

// 日付のフォーマット
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
}

function markAsViewed(material) {
    material.viewed = true;
    saveToStorage();
}

// ローカルストレージからデータを読み込む（オプション）
function loadFromStorage() {
    const saved = localStorage.getItem('materialsViewedStatus');
    if (saved) {
        const viewedStatus = JSON.parse(saved);
        flatMaterialsData.forEach(material => {
            if (viewedStatus[material.id]) {
                material.viewed = true;
            }
        });
    }
}

// ローカルストレージにデータを保存（オプション）
function saveToStorage() {
    const viewedStatus = {};
    flatMaterialsData.forEach(material => {
        if (material.viewed) {
            viewedStatus[material.id] = true;
        }
    });
    localStorage.setItem('materialsViewedStatus', JSON.stringify(viewedStatus));
}
