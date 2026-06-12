# 開發實作規範 (Development Standards)

## 概述
本技能定義本專案的開發基準：維持靜態網站的輕量、可讀、可部署、可維護，同時讓視覺與互動有足夠客製化空間。

## 觸發條件
- 撰寫、修改或重構 HTML、CSS、JavaScript、建置設定或靜態資產流程時。
- 選擇是否導入 framework、bundler、套件或第三方服務時。
- 進行 code review、效能檢查或部署前驗證時。

## 核心規則

### 技術選型
- **靜態優先**：預設使用靜態 HTML、CSS、少量原生 JavaScript 與靜態資產即可完成。
- **輕量優先**：不得為了簡單互動導入沉重 framework、runtime 或大型 UI kit。
- **漸進增強**：互動效果應在內容可讀、連結可用、版面清楚的基礎上增強，不應讓 JavaScript 成為基本內容可見的唯一入口。
- **GitHub Pages 友善**：技術選型與輸出應能自然部署到 GitHub Pages 或等價靜態 hosting。
- **依賴需有理由**：新增套件前，先確認它解決的問題是否值得增加維護、效能與供應鏈成本。

### 程式碼撰寫
- **語意化 HTML**：使用正確 heading、section、nav、main、footer、list、button、link 等語意元素。
- **CSS 系統化**：建立清楚的 CSS 變數、排版尺度、色彩 token 與 spacing 規則，避免隨機一次性樣式堆疊。
- **小型模組**：JavaScript 應拆成清楚的小函式或小模組，避免把互動、資料與 DOM 操作混成一團。
- **命名一致性**：JavaScript 使用 `camelCase`，class 名稱需表達語意或元件用途。
- **錯誤處理**：對外部資源、動態載入、使用者互動與瀏覽器 API 要有合理 fallback。
- **避免過度抽象**：只有當重複或複雜度真實存在時才新增抽象。

### 效能與相容性
- **首屏優先**：首頁第一屏的 HTML、CSS、字體與圖片需控制大小，避免過重載入。
- **資產最佳化**：圖片、字體、影片與音效需壓縮、延遲載入或提供合適尺寸。
- **無障礙基線**：鍵盤操作、可讀對比、焦點狀態、替代文字與 reduced motion 需納入驗證。
- **跨裝置驗證**：手機直向、手機橫向、平板與桌面都需檢查文字不重疊、版面不跳動、互動目標可用。

### 測試與驗證
- **靜態驗證**：若有 build、lint、format 或 typecheck，變更後應執行。
- **視覺驗證邊界**：本專案的視覺檢查由使用者進行。Agent 不主動啟動自動截圖、headless browser、in-app Browser 或其他瀏覽器視覺 QA 來替代使用者。
- **機械驗證責任**：Agent 應完成 build、typecheck、資產路徑、served HTML/CSS、DOM 結構、圖片尺寸屬性、lazy/fetch priority 設定、可及性屬性與明顯 overflow/CLS 風險等可機械檢查，並把可預覽狀態交給使用者做視覺檢查。
- **使用者回饋優先**：若使用者提供截圖或文字回饋，以使用者實際瀏覽器看到的畫面為準；Agent 不用自動截圖反向驗證或推翻使用者回饋。
- **無工具時手動檢查**：若專案尚未有測試工具，至少檢查檔案結構、HTML 合法性、連結、圖片屬性與 responsive 規則的機械風險。

## 執行步驟
1. 實作前先讀取 `AGENTS.md`、mission、architecture 與本技能。
2. 判斷是否真的需要建置工具、套件或框架；沒有明確理由時維持靜態簡單。
3. 建立或修改程式碼時，同時考慮語意、效能、可維護性、無障礙與部署輸出。
4. 完成後執行可用的 build/lint/test 與機械檢查，並交由使用者檢查主要 viewport 的視覺結果。
5. 任務結束前依 `documentation_sync.md` 檢查文件是否需要同步。

## 範例
- **正確**：用 semantic HTML 與 CSS Grid/Flex 完成版面，再用少量 JavaScript 加入細緻互動。
- **正確**：為個人視覺效果手寫小型 canvas/animation，但提供 reduced motion 與靜態 fallback。
- **錯誤**：為一頁個人介紹導入大型 component library，導致頁面像模板且 bundle 過重。
- **錯誤**：把所有樣式寫成一次性 class，沒有 token、沒有 responsive 規則，也無法維護。

## 注意事項
- 如果使用者明確要求特定框架，可採用，但仍需保持輕量、可部署與視覺獨特。
- 既有程式碼若不符合本規範，先完成當前工作；非必要重構需另外確認。
