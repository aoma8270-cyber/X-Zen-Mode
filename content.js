/**
 * X Zen Mode - Content Script
 * XのDOMを監視し、設定に基づいて要素を非表示にする
 */

(function() {
  'use strict';

  // 設定のデフォルト値
  const DEFAULT_SETTINGS = {
    hideForYou: true,
    hideSidebar: true,
    hideDM: true
  };

  // 現在の設定
  let currentSettings = { ...DEFAULT_SETTINGS };

  // MutationObserverのインスタンス
  let observer = null;

  // デバウンス用のタイマー
  let debounceTimer = null;

  /**
   * セレクタの定義
   * data-testidを優先的に使用（Xの仕様変更に強い）
   */
  const SELECTORS = {
    // おすすめタブ関連
    forYouTab: [
      '[data-testid="ScrollSnap-List"]',
      'nav[role="navigation"] a[href="/home"]',
      '[role="tablist"]'
    ],
    
    // サイドバー関連
    sidebar: [
      '[data-testid="sidebarColumn"]'
    ],
    
    // DMポップアップ関連
    dmPopup: [
      '[data-testid="DMDrawer"]',
      '[data-testid="DmDrawer"]',
      '[data-testid="DMActivity"]'
    ]
  };

  /**
   * CSSクラス名の定義
   */
  const CSS_CLASSES = {
    hideForYou: 'xzen-hide-foryou',
    hideSidebar: 'xzen-hide-sidebar',
    hideDM: 'xzen-hide-dm'
  };

  /**
   * 設定を読み込む
   */
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(DEFAULT_SETTINGS);
      currentSettings = { ...DEFAULT_SETTINGS, ...result };
      applyAllSettings();
    } catch (error) {
      console.error('X Zen Mode: Failed to load settings', error);
    }
  }

  /**
   * body要素にCSSクラスを適用/削除
   */
  function applyAllSettings() {
    if (!document.body) return;

    // hideForYou
    document.body.classList.toggle(CSS_CLASSES.hideForYou, currentSettings.hideForYou);
    
    // hideSidebar
    document.body.classList.toggle(CSS_CLASSES.hideSidebar, currentSettings.hideSidebar);
    
    // hideDM
    document.body.classList.toggle(CSS_CLASSES.hideDM, currentSettings.hideDM);

    // 直接的なDOM操作も行う（より確実な非表示のため）
    hideElements();
  }

  /**
   * 要素を直接非表示にする
   */
  function hideElements() {
    // おすすめタブの非表示
    if (currentSettings.hideForYou) {
      hideForYouTab();
    }

    // サイドバーの非表示
    if (currentSettings.hideSidebar) {
      hideSidebarElements();
    }

    // DMポップアップの非表示
    if (currentSettings.hideDM) {
      hideDMPopup();
    }
  }

  /**
   * おすすめタブを非表示にする
   */
  function hideForYouTab() {
    // ホーム画面以外では実行しない（プロフィールの投稿タブなどを消さないため）
    if (window.location.pathname !== '/home' && window.location.pathname !== '/') {
      return;
    }

    // タブリストを探す
    const tabLists = document.querySelectorAll('[role="tablist"], [data-testid="ScrollSnap-List"]');
    
    tabLists.forEach(tabList => {
      const tabs = tabList.querySelectorAll('[role="tab"], a[role="tab"], [role="presentation"] > a');
      
      tabs.forEach(tab => {
        const text = tab.textContent?.trim() || '';
        const href = tab.getAttribute('href') || '';
        
        // 「おすすめ」「For you」タブを正確に検出
        // Xの仕様変更に対応するため、複数のキーワードと条件でチェック
        const isForYou = 
          text === 'おすすめ' || 
          text === 'For you' || 
          text === 'For You' ||
          (href === '/home' && text.length > 0);

        if (isForYou) {
          const parent = tab.closest('[role="presentation"]') || tab;
          parent.setAttribute('data-xzen-target', 'foryou-tab');
        }
      });
    });

    // タイムラインの強制切り替えロジック
    autoSwitchToFollowing();
  }

  /**
   * 「おすすめ」から「フォロー中」へ自動的に切り替える
   */
  function autoSwitchToFollowing() {
    if (window.location.pathname !== '/home' && window.location.pathname !== '/') {
      return;
    }

    const followingTab = document.querySelector('a[href="/home/following"], a[href="/following"]');
    if (followingTab) {
      const isActive = followingTab.getAttribute('aria-selected') === 'true' ||
                       followingTab.closest('[aria-selected="true"]');
      
      if (!isActive && !sessionStorage.getItem('xzen-auto-switched')) {
        sessionStorage.setItem('xzen-auto-switched', 'true');
        setTimeout(() => {
          followingTab.click();
        }, 300); // 読み込み待ちを考慮して少し長めに
      }
    }
  }

  /**
   * サイドバー要素を非表示にする
   */
  function hideSidebarElements() {
    SELECTORS.sidebar.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // メインカラムは絶対に非表示にしない安全策
        if (el.getAttribute('data-testid') === 'primaryColumn') return;
        
        el.setAttribute('data-xzen-hidden', 'true');
      });
    });
  }

  /**
   * DMポップアップを非表示にする
   */
  function hideDMPopup() {
    // data-testidを使用した検索
    SELECTORS.dmPopup.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          // メインカラムは対象外
          if (el.getAttribute('data-testid') === 'primaryColumn') return;
          el.setAttribute('data-xzen-hidden', 'true');
        });
      } catch (e) {
        // セレクタが無効な場合はスキップ
      }
    });

    // 画面右下のDMドロワーを隠すための追加ロジック
    // aria-labelを使用してより確実に、かつ安全に特定
    const dmSelectors = [
      '[aria-label="Direct Messages"]',
      '[aria-label="ダイレクトメッセージ"]',
      '[data-testid="DMDrawer"]'
    ];

    dmSelectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el && !el.closest('[data-testid="primaryColumn"]')) {
        el.setAttribute('data-xzen-hidden', 'true');
      }
    });
  }

  /**
   * デバウンスされたDOM変更ハンドラ
   */
  function handleDOMChanges() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
      applyAllSettings();
    }, 100);
  }

  /**
   * MutationObserverを設定
   */
  function setupObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldUpdate = true;
          break;
        }
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          shouldUpdate = true;
          break;
        }
      }

      if (shouldUpdate) {
        handleDOMChanges();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  /**
   * メッセージリスナーを設定（ポップアップからの設定変更を受信）
   */
  function setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'SETTING_CHANGED') {
        currentSettings[message.key] = message.value;
        applyAllSettings();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  /**
   * ストレージの変更を監視
   */
  function setupStorageListener() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        Object.keys(changes).forEach(key => {
          if (key in currentSettings) {
            currentSettings[key] = changes[key].newValue;
          }
        });
        applyAllSettings();
      }
    });
  }

  /**
   * URL変更を監視（SPAのナビゲーション対応）
   */
  function setupURLChangeListener() {
    let lastURL = window.location.href;

    // popstateイベント
    window.addEventListener('popstate', () => {
      if (window.location.href !== lastURL) {
        lastURL = window.location.href;
        sessionStorage.removeItem('xzen-auto-switched');
        handleDOMChanges();
      }
    });

    // pushState/replaceStateのオーバーライド
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      if (window.location.href !== lastURL) {
        lastURL = window.location.href;
        sessionStorage.removeItem('xzen-auto-switched');
        handleDOMChanges();
      }
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      if (window.location.href !== lastURL) {
        lastURL = window.location.href;
        sessionStorage.removeItem('xzen-auto-switched');
        handleDOMChanges();
      }
    };
  }

  /**
   * 初期化
   */
  function init() {
    // body要素が存在するまで待機
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    loadSettings();
    setupObserver();
    setupMessageListener();
    setupStorageListener();
    setupURLChangeListener();

    // 初回実行
    applyAllSettings();

    console.log('X Zen Mode: Initialized');
  }

  // 初期化を実行
  init();

})();
