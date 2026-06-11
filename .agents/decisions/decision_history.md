# emu-rabbit.github.io 決策歷史

## 文件目的
本文件記錄 `emu-rabbit.github.io` 中會影響未來工作、且後續 Agent 需要理解「為什麼如此決定」的重要決策。

它不是聊天紀錄、待辦清單或修訂流水帳。若規則能直接寫在 mission、skill、workflow、architecture 或 README 中並清楚約束 Agent，通常不需要額外寫入本文件。

後續 Agent 在規劃或執行任務前，必須依 `.agents/skills/core/decision_traceability.md` 搜尋本文件，確認是否已有相關決策。

## 使用規則
- 新決策放在「決策紀錄」最上方，方便後續 Agent 先看到最新脈絡。
- 每筆決策必須有穩定 ID，格式建議為 `D-YYYY-MM-DD-序號`。
- 若新決策覆蓋舊決策，不要刪除舊紀錄；應新增一筆修訂決策，並在舊紀錄的狀態或備註中標示已被哪一筆決策修訂。
- 若只是任務待辦、一次性修正、一般規則同步、文件調整過程或尚未確認的討論，不應寫入本文件。
- 每筆決策都必須說明保留理由；若說不出後續 Agent 為何需要查閱它，就不應新增。

## 決策紀錄

### D-2026-06-11-003 - 品牌氛圍採溫柔親近路線，背景資產需桌機與手機分開設計

- **日期**：2026-06-11
- **狀態**：已確認
- **觸發來源**：使用者提供平常自介與貼文截圖作為語氣參考，要求網站呈現溫柔、自由、舒適、親人的氛圍，不要商業或冷冰冰專業感；同時指出原本黑底兔子 icon 下方橘藍長條會聯想到圖表與數字，缺少情感，並要求手機版也輸出同意圖背景圖與約束雙版面品質。
- **決策內容**：
  - 品牌方向以溫柔、自由、舒適、親人、坦白、帶一點兔子可愛感為主。
  - 避免通用商業履歷、SaaS landing page、冷調 dashboard、資料圖表、橘藍長條、數字刻度與資訊圖表語彙。
  - 首屏氛圍背景採生成式柔焦大圖，但必須壓縮成輕量靜態資產。
  - 背景與首屏構圖需同時照顧桌機與手機；預設準備桌機橫式與手機直式版本，不把手機當作桌機裁切副產品。
  - 品牌 icon 保留黑夜底白兔辨識度，但底部語彙改為柔和光暈、花粉或手作筆觸，而非長條資料感。
- **理由**：本網站的核心價值是讓訪客理解專案擁有者的個人聲音。如果只用專業履歷語氣或資料圖表式裝飾，會把使用者想呈現的親密、柔軟與自由感削弱。桌機與手機的首屏構圖差異也會直接影響第一印象，因此需要被明確列為長期設計約束。
- **影響範圍**：
  - `index.html`
  - `src/styles/main.css`
  - `src/main.ts`
  - `public/brand-mark.svg`
  - `public/assets/ambient-desktop.webp`
  - `public/assets/ambient-mobile.webp`
  - `AGENTS.md`
  - `README.md`
  - `.agents/mission/project_mission.md`
  - `.agents/mission/product_experience.md`
  - `.agents/architecture/technical_architecture.md`
- **後續 Agent 行動**：
  - 做 UI、文案、背景、icon 或資產時，先檢查是否符合溫柔親近而非商業冷感的品牌方向。
  - 修改首屏或背景時，必須同時檢查桌機與手機 viewport，並確保兩者各自有合理構圖、可讀性與載入大小。
  - 不要重新加入圖表式長條、數字化裝飾或 dashboard 視覺語彙，除非使用者明確要求呈現資料。

### D-2026-06-11-002 - 第一版採用 Vite + TypeScript，暫不導入 Vue

- **日期**：2026-06-11
- **狀態**：已確認
- **觸發來源**：使用者原先指定 Vite + Vue；後續確認本專案是靜態 landing page，沒有需要資料響應驅動畫面改變的需求，頂多需要語言切換，因此要求改往更輕量、更快的 Vite + TypeScript 方向。
- **決策內容**：
  - 第一版技術棧採用 Vite + TypeScript。
  - 不導入 Vue、client router、狀態管理或 UI framework。
  - 首屏核心內容需直接存在於 HTML，TypeScript 只負責語言切換與少量漸進增強互動。
  - 未來技術選型以 first view 快速呈現、靜態輸出簡單、依賴少為主要判斷依據。
- **理由**：本網站目前是個人靜態 landing page，不需要 reactive component runtime 才能成立。避免 Vue runtime 與框架心智成本，可以讓 first view 更直接、部署更單純，也讓後續 Agent 在新增功能時先評估是否真的需要資料驅動畫面。
- **影響範圍**：
  - `AGENTS.md`
  - `README.md`
  - `package.json`
  - `vite.config.ts`
  - `src/main.ts`
  - `.agents/architecture/technical_architecture.md`
  - `.github/workflows/deploy.yml`
- **後續 Agent 行動**：
  - 若需求只是語言切換、簡單動效、連結狀態或小型互動，維持 TypeScript 漸進增強。
  - 若要加入 Vue 或其他 framework，需先確認有資料驅動 UI、複雜狀態或大量互動元件需求，並同步更新 architecture 與決策歷史。

### D-2026-06-11-001 - 建立輕量靜態個人檔案網站作為專案核心方向

- **日期**：2026-06-11
- **狀態**：已確認
- **觸發來源**：使用者要求初始化本專案，說明本專案會是非常輕量化的靜態網頁，用來展示個人檔案；它像個人自我介紹頁面，但要直接用網頁製作高度客製化、具有獨特設計感，而非模板感覺。
- **決策內容**：
  - 本專案定位為輕量靜態個人檔案與自我介紹網站。
  - 技術與內容應優先保持靜態、簡潔、GitHub Pages 友善。
  - UI/UX 應高度客製並具有個人識別，不應採用通用履歷模板或卡片堆疊 portfolio clone。
  - 從 sibling `freezer_space` 移植 Agent skill 時，只保留可共用的核心想法、價值、工作流程與專業技能；不移植 Freezer Space 的產品目標、關係脈絡、Flutter/Firebase 架構、登入權限或領域功能。
- **理由**：這個 repo 的第一個可維護資產是 Agent 工作脈絡。先把專案定位與移植邊界寫清楚，可以避免後續 Agent 用錯模板、過度導入框架，或把 `freezer_space` 的私密生活工具脈絡誤帶入本專案。
- **影響範圍**：
  - `AGENTS.md`
  - `.agents/mission/project_mission.md`
  - `.agents/mission/feature_domains.md`
  - `.agents/mission/product_experience.md`
  - `.agents/architecture/technical_architecture.md`
  - `.agents/skills/professional/development_standards.md`
  - `.agents/skills/professional/ui_ux_standards.md`
- **後續 Agent 行動**：
  - 新增技術棧、設計方向或內容架構前，先檢查是否符合輕量靜態與高客製個人展示目標。
  - 若要導入 framework、CMS、後端、資料庫或重型動畫，需先確認它確實服務本專案目標。
  - 不得把 Freezer Space 專屬產品脈絡搬入本 repo，除非使用者明確要求。
