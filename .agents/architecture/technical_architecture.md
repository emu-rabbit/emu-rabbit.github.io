# emu-rabbit.github.io 技術架構藍圖

## 文件狀態
- 建立日期：2026-06-11
- 狀態：第一版架構藍圖
- 適用範圍：輕量靜態個人檔案網站、GitHub Pages 或等價靜態 hosting、未來可延伸的視覺與內容模組
- 本文件不建立程式碼，不代表所有細節都已可直接實作；「待決策事項」在進入相關實作前需由使用者確認。

## 已確認架構決策
- 第一版核心方向是非常輕量化的靜態網頁。
- 網站用途是展示專案擁有者的個人檔案、自我介紹、專業能力、作品與可辨識的個人風格。
- 預設不需要登入、後端、資料庫、CMS 或私密權限模型。
- 技術選型應保持 GitHub Pages 友善。
- 第一版技術棧採用 Vite + TypeScript，不導入 Vue；若未來沒有資料驅動畫面或複雜狀態需求，仍應維持此輕量方向。
- 首屏速度是長期技術判斷依據：核心 landing page 內容應直接存在於 HTML，不依賴 JavaScript runtime 才能顯示。
- 視覺與互動可以高度客製，但不得犧牲載入速度、可讀性、無障礙與跨裝置品質。
- 從 `freezer_space` 只移植共用 Agent 工作制度與專業技能，不移植其 Flutter/Firebase 或產品領域架構。

## 架構目標

### 當下目標
建立一個後續 Agent 能依循的靜態個人網站架構：輕量、清楚、可維護、可部署，並能支援高度客製化的視覺與內容敘事。

### 長期目標
架構應支援未來新增作品、調整個人敘事、替換視覺資產、加入少量互動、延伸多頁內容或建立簡單建置流程，而不需要重寫整站。

### 非目標
- 不建立通用 SaaS、dashboard 或企業 landing page 架構。
- 不預設登入、資料庫、會員權限或後台管理。
- 不為未確認需求導入重型 framework、CMS、SSR、API server 或複雜 CI/CD。
- 不把模板 UI kit 當成主要設計來源。

## 高階架構

```text
Vite
  -> semantic HTML first view
  -> CSS design system
  -> small TypeScript progressive enhancements
  -> optimized static assets
  -> GitHub Pages / static hosting
```

核心內容應能以靜態 HTML 呈現；CSS 建立視覺系統；TypeScript 只負責語言切換、少量互動與漸進增強；所有圖片、字體與媒體都應作為可部署的靜態資產管理。

## 建議檔案結構

以下是後續實作可參考的輕量結構，實際採用前仍需依任務確認：

```text
.
  index.html
  public/
    brand-mark.svg
  src/
    styles/
      main.css
    main.ts
  vite.config.ts
  tsconfig.json
  .github/
    workflows/
      deploy.yml
  README.md
```

第一版已採用 Vite 作為最小建置工具，主要價值是快速 dev server、TypeScript 驗證與 GitHub Pages 輸出；不得因此把頁面改成 runtime-first app。若未來要導入 Vue、router、狀態管理或大型 UI 套件，需先確認它確實服務資料驅動或複雜互動需求。

## 技術選型原則

### HTML
- 使用 semantic HTML 作為內容骨架。
- 重要內容不依賴 JavaScript 才能出現。
- heading 層級需反映敘事結構。
- 導覽、外部連結、作品列表與聯絡方式需可被鍵盤與讀屏理解。

### CSS
- 建立 CSS custom properties 作為色彩、字體、間距、radius、陰影與動效 token。
- 使用現代 CSS，例如 Grid、Flexbox、container queries 或 `clamp()`，但需注意瀏覽器支援與 fallback。
- 字體大小不可只依賴 viewport 寬度任意縮放；需確保長字與中英文混排不溢出。
- 動效需尊重 `prefers-reduced-motion`。

### TypeScript
- 預設只使用少量 TypeScript，編譯後作為瀏覽器端漸進增強。
- 用於語言切換、互動、scroll 效果、漸進式動畫、主題切換或作品 preview 時，必須可退化。
- 若使用瀏覽器 API，需檢查支援與 fallback。
- 不為簡單互動導入大型 runtime；Vue 只有在畫面真的需要資料響應、複雜狀態或大量互動元件時才重新評估。

### Assets
- 圖片需提供合適尺寸與格式，避免首屏過重。
- 首屏或大型人物照片不得只提交單一原圖。應依實際構圖輸出多尺寸版本，例如桌機寬版、一般螢幕版、手機版，並額外輸出極小 placeholder 作為慢網路載入前的柔和底。
- 大型圖片 HTML 應使用 `srcset` / `sizes`，讓瀏覽器按 viewport 與 DPR 選擇合適資產；若圖片位於首屏，可用 `fetchpriority="high"`，但仍需控制檔案大小。
- 圖片容器需用固定版面空間、`width` / `height`、`aspect-ratio`、明確 `min-height` 或等價方式避免載入後內容跳躍。
- 慢網路時可使用 tiny placeholder、柔和底色或低成本淡入，但 placeholder 不可長時間霧化、暗化或遮蔽主照片；載入完成後主照片應清楚可見。
- 人物主視覺照片若與氛圍背景並存，優先使用柔和遮罩、漸層融合或構圖留白整合，不用硬切分相框、過重霧化或大面積暗罩壓掉原本品牌背景，除非使用者明確要求相框式設計。
- 字體需控制字重與子集，避免載入過多。
- 自訂中文字體採用 `jf open 粉圓` / `open-huninn` 作為全站主字型；其 subset webfont 的 CSS font-family 與輸出檔名使用 `Emu Huninn Subset`，避免把經過裁切的 Modified Version 直接命名為上游 Reserved Font Name。
- 字體 subset 流程必須考慮本網站仍在調整大方向，未來會持續新增與修改文案；不可只依單次人工字元清單維護。
- 字體字元來源應由部署前或 build 前自動化腳本掃描 `index.html`、`src/**/*.ts`、未來內容資料檔與 CSS 中的可見文字，再合併 safelist。
- safelist 至少需保留繁體中文、英文、常用標點、數字、目前 UI 符號，以及會頻繁出現的日文暱稱 `絵夢羽さ沂`。
- 若使用者未來對字體命名、散布方式、授權文件或 subset 行為的指示與上游授權條款衝突，Agent 必須主動提醒並改採符合授權的做法，不能為了完成版面直接忽略授權。
- 字體產生流程由 `npm run fonts` 執行，`npm run build` 透過 `prebuild` 自動重跑；GitHub Actions 部署前需安裝 Python `fonttools` 與 `brotli`。
- 影片、canvas、WebGL 或大量動畫需有明確理由與低效能 fallback。
- 所有非裝飾圖片需有替代文字或可理解的上下文。
- 首屏氛圍背景若使用生成圖或大圖，需提供桌機橫式與手機直式資產，並以 CSS media query 或等價方式按 viewport 載入；手機版不得只依賴桌機圖裁切。
- 背景圖應先壓縮成適合靜態站的格式與尺寸，例如 WebP；若需要柔焦氛圍，優先在資產處理階段完成，避免以昂貴的即時濾鏡拖慢首屏。

## 部署架構

第一版應以 GitHub Pages 或等價靜態 hosting 為自然目標。

目前部署流程使用 GitHub Actions，在 push 到 `main` 後執行 `npm ci`、`npm run build`，再透過 GitHub Pages Actions 部署 `dist`。

部署前最低檢查：

- 根路徑與相對路徑正確。
- 直接開啟 `index.html` 或部署後 URL 時資產可載入。
- 外部連結正確。
- 手機、平板、桌面主要 viewport 無文字重疊或橫向溢出，且各自載入合適的背景與版面構圖。
- 沒有 repo-local npm cache、臨時輸出或不必要建置產物被提交。

## 效能與可及性策略

### 效能
- 控制首屏資產大小。
- 圖片與媒體延遲載入或提供尺寸屬性。
- 避免阻塞渲染的沉重 script。
- 動畫與互動需避免造成 layout thrashing。

### 可及性
- 互動元素需有可見 focus。
- 色彩對比需可讀。
- 導覽與主要內容需有清楚語意。
- 純裝飾元素不應干擾讀屏。
- 支援 keyboard-only 使用者。

## 模組邊界

可將網站視為幾個內容與體驗模組：

- 首屏身份展示
- 自我介紹與價值觀
- 專業技能與領域
- 作品與專案展示
- 聯絡與外部連結
- 視覺系統與靜態資產
- 可選互動或動畫模組

若某個模組變得複雜，例如作品資料結構、互動實驗、動態主題或多頁內容，應在 `.agents/architecture/modules/` 建立對應架構文件。

## 測試與驗證策略

- 執行 `npm run build`，其中包含 `tsc --noEmit` 與 Vite build。
- 檢查輸出資產與相對路徑。
- 本專案的視覺檢查由使用者進行；Agent 不主動啟動瀏覽器截圖、headless browser、in-app Browser 或其他自動視覺 QA 來替代使用者。
- 視覺品質、主要 viewport 與細節氛圍以使用者手動瀏覽器檢驗與回饋為準。
- 檢查 keyboard、focus、reduced motion 與外部連結。
- Agent 可執行 served HTML/CSS、資產 200、DOM 結構、圖片尺寸屬性、lazy/fetch priority 設定與明顯 overflow/CLS 風險等機械檢查；若需要視覺判斷，交由使用者手動預覽並依回饋修正。
- 只有在使用者明確要求使用特定瀏覽器工具時，Agent 才應啟動該工具；工具結果不得覆蓋使用者實際瀏覽器回饋。

## 待決策事項
- [x] 預覽後暫時移除 `Emu Iansui Subset`，全站改回單一粉圓字型。
- [ ] 是否需要多語系內容。
- [ ] 是否需要作品資料抽成 JSON 或 Markdown。
- [ ] 是否需要動態主題、canvas、WebGL 或其他高客製互動。
- [x] 第一版正式公開的聯絡方式與外部連結。
- [ ] 正式公開的作品清單。

## 後續 Agent 行動
- 技術選型、建置流程或部署任務開始前，先讀本文件。
- 新增 framework、CMS、後端或大型套件前，先確認是否符合輕量靜態目標。
- 新增複雜互動或模組前，先判斷是否需要模組架構文件。
- 若新需求改變靜態優先、部署方式或視覺定位，需同步更新本文件與必要的 decision history。
