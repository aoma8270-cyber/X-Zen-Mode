# X Zen Mode

🧘 **X（旧Twitter）で集中力を高めるChrome拡張機能**

## 概要

X Zen Modeは、X（旧Twitter）の「おすすめ」タブやサイドバー、DMポップアップを非表示にし、タイムラインへの没入と生産性向上をサポートします。
Apple風のミニマルなUIで、ON/OFFを簡単に切り替えられます。

## 主な機能

- 「おすすめ」タブの非表示（ホーム画面のみ）
- サイドバー（トレンド・おすすめユーザー等）の非表示
- DMポップアップの非表示
- 各機能のON/OFFをpopupから切り替え可能
- 設定はchrome.storage.syncで自動同期

## インストール方法

1. このリポジトリをダウンロードまたはクローン
2. Chromeで `chrome://extensions/` を開く
3. 「デベロッパーモード」をON
4. 「パッケージ化されていない拡張機能を読み込む」で本フォルダを選択

## 使い方

1. Chromeツールバーの「X Zen Mode」アイコンをクリック
2. ポップアップで各機能のトグルスイッチをON/OFF
3. 変更は即座に反映され、すべてのデバイスで同期

## 技術仕様

- Manifest V3
- 状態管理：chrome.storage.sync
- DOM監視：MutationObserver
- セレクタ：data-testid優先
- UI：Apple風ミニマルデザイン（popup.html, styles.css）

## サポート・寄付

☕ [Support the Creator](https://www.buymeacoffee.com/yourid)

## ライセンス

MIT License

---

# X Zen Mode (English)

🧘 **A Chrome extension to boost your focus on X (formerly Twitter)**

## Overview

X Zen Mode helps you concentrate by hiding the "For You" tab, sidebar (trends, suggestions), and DM popups on X (formerly Twitter). 
Enjoy a minimal, Apple-inspired UI with easy ON/OFF toggles.

## Features

- Hide "For You" tab (only on Home)
- Hide sidebar (trends, suggestions, etc.)
- Hide DM popups
- Toggle each feature from the popup
- Settings are synced via chrome.storage.sync

## Installation

1. Download or clone this repository
2. Open `chrome://extensions/` in Chrome
3. Enable "Developer mode"
4. Click "Load unpacked" and select this folder

## Usage

1. Click the "X Zen Mode" icon in the Chrome toolbar
2. Use the popup to toggle each feature ON/OFF
3. Changes are applied instantly and synced across devices

## Technical Details

- Manifest V3
- State management: chrome.storage.sync
- DOM monitoring: MutationObserver
- Selectors: Prefer data-testid for robustness
- UI: Minimal, Apple-like design (popup.html, styles.css)

## Support & Donation

☕ [Support the Creator](https://www.buymeacoffee.com/aoma04)

## License

MIT License
