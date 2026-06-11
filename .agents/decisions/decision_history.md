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

### D-2026-06-11-006 - 自動化視覺驗證需先確認工具可信度

- **日期**：2026-06-11
- **狀態**：已確認
- **觸發來源**：首屏 UI 實作時，in-app Browser / `node_repl` 在 Windows sandbox 中無法啟動；改用 Edge headless 截圖後，又因重用截圖檔名、browser profile、cache 狀態與 headless viewport 差異，導致 Agent 一度把可疑舊截圖或裁切截圖當成真實畫面，使用者後續指出自己瀏覽器看到的是正常畫面。
- **決策內容**：
  - 重大 UI 變更仍需瀏覽器驗證，但自動化截圖本身也必須被驗證可信度。
  - 若 in-app Browser / `node_repl` 在本機 Windows sandbox 中連續啟動失敗，不要反覆卡住；改用 served HTML/CSS 檢查、使用者手動瀏覽器回報，或其他可用的本機瀏覽器驗證方式。
  - 使用 Edge/Chromium headless 截圖時，需使用全新截圖檔名、乾淨 `user-data-dir` 與 cache-busting URL；不可反覆覆寫同一張圖後假設檢視器顯示的是最新畫面。
  - Headless `--window-size` 不必然代表真實手機 viewport；若截圖呈現的裁切或 layout 與 served CSS/DOM 或使用者實際瀏覽器互相矛盾，需先停止依截圖猜測修正。
  - 自動化截圖、DOM/CSS 檢查與使用者手動瀏覽器結果衝突時，應明確回報工具限制，並以使用者實際畫面與可檢查的 served CSS/DOM 作為下一步依據。
- **理由**：本網站重視桌機與手機首屏品質，但錯誤或過期的自動截圖會引導 Agent 做出不必要甚至破壞性的 UI 修正。把工具可信度納入驗證流程，可以保留瀏覽器驗證價值，同時避免後續 Agent 在同一組 Windows/Codex 工具限制上重複踩坑。
- **影響範圍**：
  - `.agents/skills/professional/development_standards.md`
  - `.agents/architecture/technical_architecture.md`
  - 所有後續 UI、responsive layout 與視覺驗證任務
- **後續 Agent 行動**：
  - UI 驗證前先確認工具輸出是否新鮮、viewport 是否可信、server 是否提供最新 CSS/HTML。
  - 若使用者指出自動截圖與實際瀏覽器不一致，先相信這是驗證工具問題的可能性，而不是立即改 UI。
  - 最終回報中應區分「已由 build/DOM/CSS 驗證」與「受工具限制的截圖驗證」。

### D-2026-06-11-005 - 首屏人物照片採多尺寸漸進載入與柔和融合構圖

- **日期**：2026-06-11
- **狀態**：已確認
- **觸發來源**：使用者提供首屏本人照片，要求照片必須作為主視覺出現；後續明確指出稍大的圖片仍需處理大小、慢網路時要有淡入小特效並先撐夠版面避免內容跳躍，同時否定過度霧化照片與硬切相框式分割構圖。
- **決策內容**：
  - 首屏或大型人物照片不得只提交單一原圖，需輸出多尺寸版本與極小 placeholder。
  - HTML 使用 `srcset` / `sizes`，首屏主圖可搭配 `fetchpriority="high"` 與穩定 `width` / `height` 或明確容器尺寸。
  - 慢網路時可先顯示 tiny placeholder、底色或低成本淡入，但 placeholder 不可長時間霧化、暗化或遮蔽主照片。
  - 載入完成後主照片需清楚可見；若照片與氛圍背景共存，優先用柔和遮罩、漸層融合與構圖留白整合，不採硬切相框、過重暗罩或讓照片吃掉既有背景氛圍。
  - 首屏文案需以語意短行安排，避免長句在視覺重心處造成閱讀負擔。
- **理由**：這個網站的首屏要同時讓訪客感受到本人、窗邊故事與既有柔和背景。單一大圖會增加載入風險，硬切分相框會讓畫面變成普通 hero split layout，過度霧化則會讓本人照片失去主視覺意義。多尺寸漸進載入與柔和融合能兼顧效能、穩定版面與個人氛圍。
- **影響範圍**：
  - `index.html`
  - `src/styles/main.css`
  - `src/main.ts`
  - `public/assets/window-portrait*.jpg`
  - `README.md`
  - `.agents/architecture/technical_architecture.md`
- **後續 Agent 行動**：
  - 新增或替換大型照片時，先輸出 responsive image 與 tiny placeholder，再更新 HTML `srcset` / `sizes`。
  - 驗證桌機與手機首屏時，需檢查照片是否清楚、文字是否不壓主體、慢載入狀態是否不跳版。
  - 若使用者要求更改照片風格，仍需保留圖片大小處理與穩定載入策略，除非使用者明確要求放棄這些效能與版面保護。

### D-2026-06-11-004 - 自訂字體採授權合規的自動化 subset 策略

- **日期**：2026-06-11
- **狀態**：已確認
- **觸發來源**：使用者評估採用開源免費、可愛圓潤舒適的字型，並確認目前專案仍在調整大方向，未來會持續新增繁體中文、英文與少數日文文案；使用者也指定 `open-huninn` subset 後使用 `Emu Huninn Subset` 命名，且若未來指示與授權要求衝突，Agent 必須主動提醒。
- **決策內容**：
  - 自訂中文字體以 `jf open 粉圓` / `open-huninn` 作為優先候選，但部署資產需維持輕量。
  - 若建立 `open-huninn` 子集 webfont，輸出的 CSS font-family 與檔名需使用 `Emu Huninn Subset`，不可直接沿用上游 Reserved Font Name。
  - 字體 subset 不採一次性手動字元清單；應以 build 前或部署前自動化掃描 `index.html`、`src/**/*.ts`、未來內容資料檔與 CSS 可見文字，再合併 safelist。
  - safelist 需納入繁體中文、英文、常用標點、數字、UI 符號，以及會頻繁出現的日文暱稱 `絵夢羽さ沂`。
  - 若使用者未來要求的字體命名、散布、授權文件處理或 subset 做法與上游授權衝突，Agent 必須先提醒並提出合規替代方案。
- **理由**：本網站需要保留溫柔、可愛、親近的字體氣質，但仍以快速、輕量、靜態友善為技術核心。由於文案仍會大量變動，手動維護 subset 字元很容易漏字；同時 OFL 字體的 Reserved Font Name 與 Modified Version 規則會影響輸出命名，需讓後續 Agent 在實作前就知道授權邊界。
- **影響範圍**：
  - `index.html`
  - `src/styles/main.css`
  - `src/main.ts`
  - `package.json`
  - `README.md`
  - `.agents/architecture/technical_architecture.md`
- **後續 Agent 行動**：
  - 實作字體時，優先建立可重跑的自動化 subset 腳本，不要只提交手工裁切成果。
  - 修改文案、語言資料或 CSS 可見文字後，需確認字體 subset 流程會重新納入新字元。
  - 保留授權文件與來源說明，並在命名與散布方式上遵守上游授權。
  - 2026-06-11 預覽後，使用者要求暫時移除 `Emu Iansui Subset`，全站改回單一 `Emu Huninn Subset`；未來若重新評估標題字型，仍需保持低成本可回退。

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
