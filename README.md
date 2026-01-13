# X Zen Mode

🧘 Xの利用を制限して集中力を高めるChrome拡張機能

## 機能

- **おすすめタブの非表示**: 「おすすめ（For You）」タブを隠し、フォロー中のタイムラインに集中
- **サイドバーの非表示**: トレンドやおすすめユーザーのカラムを非表示に
- **DMポップアップの非表示**: 画面右下のメッセージボックスを隠す

## インストール方法

### 開発者モードでインストール

1. このリポジトリをクローンまたはダウンロード
2. Chromeで `chrome://extensions/` を開く
3. 右上の「デベロッパーモード」をONにする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. このフォルダを選択

### アイコンの準備

`icons/` フォルダに以下のサイズのPNGアイコンを配置してください：
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

## 使い方

1. Chromeツールバーの拡張機能アイコンをクリック
2. 各機能のトグルスイッチでON/OFFを切り替え
3. 設定は自動的に保存され、すべてのデバイスで同期されます

## 技術仕様

- **Manifest Version**: V3
- **状態管理**: `chrome.storage.sync`
- **DOM監視**: `MutationObserver` でSPAの動的な変更に対応
- **セレクタ**: `data-testid` を優先使用（Xの仕様変更に強い）

## ファイル構成

```
X-zen-mode/
├── manifest.json    # 拡張機能の設定
├── popup.html       # ポップアップUI
├── popup.js         # ポップアップのロジック
├── content.js       # コンテンツスクリプト
├── styles.css       # 非表示用スタイル
├── icons/           # アイコン画像
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md        # このファイル
```

## ライセンス

MIT License

## サポート

☕ [Buy Me a Coffee](https://www.buymeacoffee.com/yourid)
