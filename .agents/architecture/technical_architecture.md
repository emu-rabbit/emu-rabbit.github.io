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
Static HTML
  -> CSS design system
  -> Progressive JavaScript
  -> Optimized static assets
  -> GitHub Pages / static hosting
```

核心內容應能以靜態 HTML 呈現；CSS 建立視覺系統；JavaScript 只負責必要互動與漸進增強；所有圖片、字體與媒體都應作為可部署的靜態資產管理。

## 建議檔案結構

以下是後續實作可參考的輕量結構，實際採用前仍需依任務確認：

```text
.
  index.html
  assets/
    images/
    icons/
    fonts/
  src/
    styles/
      tokens.css
      base.css
      layout.css
      components.css
    scripts/
      main.js
      interactions/
  README.md
```

若第一版完全不需要 build，可以直接使用 `index.html`、`assets/` 與少量 `src/`。若未來需要編譯 CSS、壓縮資產或模組化 JavaScript，可再引入最小建置工具。

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

### JavaScript
- 預設只使用少量原生 JavaScript。
- 用於互動、scroll 效果、漸進式動畫、主題切換或作品 preview 時，必須可退化。
- 若使用瀏覽器 API，需檢查支援與 fallback。
- 不為簡單互動導入大型 runtime。

### Assets
- 圖片需提供合適尺寸與格式，避免首屏過重。
- 字體需控制字重與子集，避免載入過多。
- 影片、canvas、WebGL 或大量動畫需有明確理由與低效能 fallback。
- 所有非裝飾圖片需有替代文字或可理解的上下文。

## 部署架構

第一版應以 GitHub Pages 或等價靜態 hosting 為自然目標。

部署前最低檢查：

- 根路徑與相對路徑正確。
- 直接開啟 `index.html` 或部署後 URL 時資產可載入。
- 外部連結正確。
- 手機、平板、桌面主要 viewport 無文字重疊或橫向溢出。
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

若有建置工具：

- 執行 build。
- 執行 lint、format 或 typecheck。
- 檢查輸出資產與路徑。

若尚無建置工具：

- 檢查 HTML/CSS/JS 結構。
- 用瀏覽器開啟本機頁面或 dev server。
- 驗證主要 viewport。
- 檢查 keyboard、focus、reduced motion 與外部連結。

## 待決策事項
- [ ] 第一版是否完全不使用 build tool。
- [ ] 是否使用自訂字體、使用哪些字體，以及授權與載入策略。
- [ ] 是否需要多語系內容。
- [ ] 是否需要作品資料抽成 JSON 或 Markdown。
- [ ] 是否需要動態主題、canvas、WebGL 或其他高客製互動。
- [ ] 正式公開的聯絡方式、外部連結與作品清單。

## 後續 Agent 行動
- 技術選型、建置流程或部署任務開始前，先讀本文件。
- 新增 framework、CMS、後端或大型套件前，先確認是否符合輕量靜態目標。
- 新增複雜互動或模組前，先判斷是否需要模組架構文件。
- 若新需求改變靜態優先、部署方式或視覺定位，需同步更新本文件與必要的 decision history。
