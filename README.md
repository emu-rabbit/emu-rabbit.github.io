# Emu Rabbit

`emu-rabbit.github.io` 是一個輕量靜態個人入口網站。第一版使用 Vite + TypeScript，不引入 Vue 或其他 UI framework，讓首屏內容直接由 HTML 呈現，TypeScript 只負責語言切換等漸進增強互動。

## 技術方向

- Vite 作為最小建置與 dev server。
- TypeScript 負責少量互動邏輯。
- Semantic HTML 承載核心內容，避免 first view 依賴 JavaScript。
- CSS custom properties 建立視覺 token，不導入 UI library。
- GitHub Actions 在 push 到 `main` 後 build `dist` 並部署到 GitHub Pages。

## 開發指令

```powershell
npm install
npm run dev
npm run build
```

## 部署

部署流程位於 `.github/workflows/deploy.yml`。每次 push 到 `main` 時，workflow 會：

1. 安裝 Node.js 22。
2. 執行 `npm ci`。
3. 執行 `npm run build`。
4. 將 `dist` 上傳並部署到 GitHub Pages。

GitHub repository settings 需要啟用 Pages，並將來源設定為 GitHub Actions。
