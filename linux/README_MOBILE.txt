Parrot OS Linux基盤ラボ — Mobile PWA版

■ スマホ対応
- Lab01〜20をモバイル幅に最適化
- 画面上部にスマホ専用Labナビ
- Homeで進捗表示 / 続きから再開
- iPhoneのSafe Area対応
- Terminalや横長Flowは横スクロール/縦スクロール対応
- ボタンはタッチしやすい44px以上

■ PWA
HTTPSで公開するとホーム画面からアプリのように起動できます。
Service Workerにより主要HTMLをキャッシュします。

iPhone:
Safari → 共有 → ホーム画面に追加

Android:
Chrome → メニュー → アプリをインストール / ホーム画面に追加

■ 注意
file://でHTMLを直接開くだけでも各Labは利用できますが、
Service Worker/PWAインストールはHTTPSまたはlocalhostが必要です。
