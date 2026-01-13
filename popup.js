/**
 * X Zen Mode - Popup Script
 * ポップアップUIの状態管理とストレージ同期を担当
 */

// 設定のデフォルト値
const DEFAULT_SETTINGS = {
  hideForYou: true,
  hideSidebar: true,
  hideDM: true
};

// DOM要素の参照を取得
const toggles = {
  hideForYou: document.getElementById('hideForYou'),
  hideSidebar: document.getElementById('hideSidebar'),
  hideDM: document.getElementById('hideDM')
};

/**
 * 保存された設定を読み込んでUIに反映
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    
    Object.keys(toggles).forEach(key => {
      if (toggles[key]) {
        toggles[key].checked = result[key];
      }
    });
  } catch (error) {
    console.error('Failed to load settings:', error);
    // エラー時はデフォルト値を使用
    Object.keys(toggles).forEach(key => {
      if (toggles[key]) {
        toggles[key].checked = DEFAULT_SETTINGS[key];
      }
    });
  }
}

/**
 * 設定を保存してコンテンツスクリプトに通知
 * @param {string} key - 設定キー
 * @param {boolean} value - 設定値
 */
async function saveSetting(key, value) {
  try {
    // ストレージに保存
    await chrome.storage.sync.set({ [key]: value });
    
    // アクティブなタブのコンテンツスクリプトに変更を通知
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && (tab.url?.includes('twitter.com') || tab.url?.includes('x.com'))) {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'SETTING_CHANGED',
        key: key,
        value: value
      });
    }
  } catch (error) {
    console.error('Failed to save setting:', error);
  }
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
  Object.keys(toggles).forEach(key => {
    if (toggles[key]) {
      toggles[key].addEventListener('change', (event) => {
        saveSetting(key, event.target.checked);
        
        // トグル時に視覚的フィードバックを追加
        const settingItem = event.target.closest('.setting-item');
        if (settingItem) {
          settingItem.style.transition = 'background-color 0.3s ease';
          settingItem.style.backgroundColor = event.target.checked 
            ? 'rgba(0, 122, 255, 0.05)' 
            : 'transparent';
          
          setTimeout(() => {
            settingItem.style.backgroundColor = '';
          }, 300);
        }
      });
    }
  });
}

/**
 * 初期化
 */
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
});
