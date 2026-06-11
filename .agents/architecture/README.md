# emu-rabbit.github.io 架構文件入口

## 文件目的
本資料夾保存 `emu-rabbit.github.io` 的技術架構、靜態網站邊界、資產策略、部署假設、模組切分與後續 Agent 需要理解的長期設計脈絡。

它不是一般任務筆記，也不是臨時討論區。只有會影響未來實作、維護、部署、效能、可及性、資產或模組邊界的資訊，才應整理到這裡。

## 必讀順序
處理技術選型、靜態站結構、建置流程、部署、資產、效能、可及性、互動模組或頁面模組相關工作時，Agent 應依序讀取：

1. `.agents/architecture/README.md`
2. `.agents/architecture/technical_architecture.md`
3. 與任務相關的 `.agents/architecture/modules/*.md`
4. `.agents/decisions/decision_history.md`
5. `.agents/mission/project_mission.md`
6. `.agents/mission/feature_domains.md`
7. `.agents/mission/product_experience.md`

若任務涉及 UI、互動、CSS、文案、測試或實作，仍需依 `AGENTS.md` 讀取對應 skill。

## 文件分類

### 核心架構
- `technical_architecture.md`：專案整體技術藍圖，包含靜態優先、依賴策略、檔案結構、資產、效能、可及性與部署原則。

### 模組架構
- `modules/README.md`：模組架構文件的維護規則。
- `modules/_module_architecture_template.md`：新增模組架構文件時的模板。
- `modules/*.md`：每個重要頁面區塊或互動模組的內容責任、UI 邊界、資產、互動與驗證策略。

## 維護規則
- 重要架構決策應優先更新最貼近的架構文件；只有需要保留取捨理由時，才同步新增到 `.agents/decisions/decision_history.md`。
- 新增複雜 section、互動、動畫系統、資產策略或建置流程前，應先確認是否需要對應模組架構文件。
- 架構文件可以記錄「待決策事項」，但不可把未確認內容寫成已定案。
- 若待決策事項會阻塞目前設計或實作，Agent 必須先詢問使用者。
- 不要把一次性任務紀錄、聊天摘要或短期 TODO 放進本資料夾。
