# 兔子的窗邊手記

`emu-rabbit.github.io` 是一個輕量靜態個人入口網站。第一版使用 Vite + TypeScript，不引入 Vue 或其他 UI framework，讓首屏內容直接由 HTML 呈現，TypeScript 只負責語言切換等漸進增強互動。

目前品牌方向偏向溫柔、自由、舒適、親人與生活感；頁面應像可以靠近的一扇窗，而不是商業履歷、SaaS 首頁或冷調資料儀表板。

## 技術方向

- Vite 作為最小建置與 dev server。
- TypeScript 負責少量互動邏輯。
- Semantic HTML 承載核心內容，避免 first view 依賴 JavaScript。
- CSS custom properties 建立視覺 token，不導入 UI library。
- 自訂中文字體採用 `jf open 粉圓` / `open-huninn` 作為全站主字型，subset 後以 `Emu Huninn Subset` 命名，並透過 build 前腳本自動掃描站內文案與 safelist 產生，避免未來文案變動時漏字。
- 字體 safelist 需保留常用繁體中文、英文、標點、數字、UI 符號，以及常駐暱稱 `絵夢羽さ沂`。
- 首屏背景使用壓縮後的 WebP 資產，桌機與手機各自載入不同構圖：
  - `public/assets/ambient-desktop.webp`
  - `public/assets/ambient-mobile.webp`
- 首屏或大型人物照片需先處理成 responsive image，不直接只放單一原圖：
  - 輸出至少桌機寬版、一般螢幕版、手機版與一張極小 placeholder。
  - HTML 使用 `srcset` / `sizes` 讓瀏覽器依 viewport 選擇合適尺寸。
  - 圖片容器需先有穩定尺寸或明確版面空間，慢網路時不可造成內容跳躍。
  - tiny placeholder 只作為載入前的柔和底，不可長時間霧化或遮蔽主照片。
  - 載入完成後以克制淡入呈現；不要為了特效讓首屏停在模糊預覽。
- `public/brand-mark.svg` 是主要兔子品牌 icon，應避免加入圖表式長條、數字或儀表板語彙。
- 背景整體採窗邊手記式分層：首屏與少數關鍵段落可使用具象圖片場景，中後段優先用 CSS 色溫、紙感、相簿感、細線與既有圖片形成章節差異，不為每段新增大型 AI 背景圖。
- 關係／愛的道路段落作為後半頁情緒高潮，使用壓縮後的生成式氛圍背景，並以 CSS 深色遮罩確保文字可讀與整體不突兀；桌機與手機需各自使用專門構圖，不可用桌面圖裁切代替手機設計：
  - `public/assets/love-road-atmosphere.jpg`
  - `public/assets/love-road-atmosphere-mobile.jpg`
- 職業技能區塊移植自 GitHub profile repo `emu-rabbit/emu-rabbit`：
  - `public/assets/professional-rabbit-sound.png`
  - `public/assets/professional-skill-icons.svg`
- 興趣區塊使用 FF14 遊戲截圖作為個人興趣視覺：
  - `public/assets/ff14-frozen-rabbit.jpg`
- 字體檔案、命名、授權文件與散布方式必須遵守上游授權；若需求與授權衝突，需先調整做法。
- GitHub Actions 在 push 到 `main` 後 build `dist` 並部署到 GitHub Pages。

## 待處理事項

- [x] header 的「兔子的窗邊筆記」在中英切換時，已正確切成英文版本。
- [x] 手機版圖片輪播從第 10 張按下一張回到第 1 張時，會停在奇怪的第 N 張，而不是回到第一張。

## 開發指令

```powershell
npm install
npm run fonts
npm run dev
npm run build
```

`npm run build` 會透過 `prebuild` 自動執行 `npm run fonts`。本機需要 Python + `fonttools` / `brotli`；GitHub Actions 會在部署前安裝這兩個工具。若在 Codex sandbox 中讀取 Python 套件快取遇到權限問題，依 `AGENTS.md` 的 Windows sandbox note 以 escalated 方式重跑字體或 build 指令。

## 部署

部署流程位於 `.github/workflows/deploy.yml`。每次 push 到 `main` 時，workflow 會：

1. 安裝 Node.js 22。
2. 執行 `npm ci`。
3. 執行 `npm run build`。
4. 將 `dist` 上傳並部署到 GitHub Pages。

GitHub repository settings 需要啟用 Pages，並將來源設定為 GitHub Actions。
