# Sort Viz

ソートアルゴリズムの**比較・交換・確定**を、棒グラフと色・キャプションで追いながら学べる Web アプリです。

## できること

- **アルゴリズム**: バブルソート / 選択ソート / 挿入ソート / クイックソート
- **可視化**: 比較中・交換・ピボット・整列済みを色分けし、ステップごとに説明文を表示
- **操作**: 再生・1 ステップ送り/戻し・先頭/末尾へジャンプ・速度スライダー・シャッフル・やり直し
- **UI**: [Lucide](https://lucide.dev/) アイコン、ダークテーマ

## 必要環境

- [Node.js](https://nodejs.org/)（LTS 推奨）

## セットアップと実行

```bash
npm install
npm run dev
```

ブラウザで表示された URL（通常は `http://localhost:5173`）を開きます。

### 本番ビルド

```bash
npm run build
npm run preview   # ビルド結果のローカル確認
```

## 技術スタック

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [lucide-react](https://lucide.dev/guide/packages/lucide-react)

## ライセンス

このリポジトリのライセンスは未指定です。利用・配布の条件が必要な場合は `LICENSE` を追加してください。
