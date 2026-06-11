---
description: 依變更性質分類所有待提交內容，分批暫存並以 Pascal-case 規範建立多個 git commit。描述部分必須使用繁體中文。
---

# Git 分類提交工作流 (Git Commit Workflow)

## 概述
本工作流用於處理使用者要求 `add and commit all`、`commit all`、`全部提交` 或類似指令時的提交流程。此要求不代表把所有變更壓成單一 commit；Agent 必須依據變更內容與性質，自行分類、撰寫對應 commit message，並分別建立清楚、可追蹤的 commit。

## 觸發條件
- 使用者要求 `add and commit all`、`commit all`、`全部提交`、`全部加進去並提交` 或等價指令時。
- 使用者要求提交目前所有變更，但沒有明確指定 commit 分組時。

## 核心規則
- **自行分類提交**：Agent 必須依變更性質分組，例如文件、功能、修正、重構、測試、工具設定、版本資訊等，並為每組建立獨立 commit。
- **拒絕一包到底**：不得因為使用者說 `all` 就直接 `git add .` 後建立單一籠統 commit。只有在所有變更確實屬於同一個清楚目的時，才可以建立單一 commit。
- **保留使用者變更邊界**：若工作樹中存在看似無關或無法判斷來源的變更，必須先摘要並確認 scope，不可把它們偷偷混入 commit。
- **精準暫存**：每次 commit 前只暫存該分類所需檔案或變更。優先使用精準路徑；若同一檔案混有不同分類且無法安全切分，需向使用者說明並詢問。
- **Pascal-case Header**：Commit message header 使用 Pascal-case，例如 `Feat:`、`Fix:`、`Docs:`、`Refactor:`、`Test:`、`Chore:`。
- **繁體中文描述**：Commit message 描述必須使用繁體中文，並遵守 `.agents/skills/core/language_policy.md`。
- **精準摘要**：Commit message 必須反映該組變更的實際內容，避免 `update files`、`misc changes`、`全部更新` 等模糊描述。
- **提交前驗證**：每個 commit 前至少檢查 `git diff --cached --name-only`、`git diff --cached --stat` 與 `git diff --cached --check`。
- **提交後巡檢**：每次 commit 後重新執行 `git status --short`，確認剩餘變更是否符合下一組分類。

## 執行步驟
1. **讀取規範**：先讀取 `.agents/skills/core/language_policy.md`、`.agents/skills/core/global_standards.md` 與本工作流。
2. **檢查工作樹**：執行 `git status --short`，列出所有 modified、deleted、untracked 檔案。
3. **分析變更內容**：用 `git diff --stat`、`git diff -- <path>` 或必要的檔案讀取，理解每個檔案的實際變更。
4. **建立提交分組**：依變更目的與性質建立 commit 分組，並確認沒有無關變更被混入。
5. **逐組暫存**：針對第一組變更執行精準 `git add <path>`，必要時使用更細緻的暫存方式。
6. **檢查已暫存內容**：執行 `git diff --cached --name-only`、`git diff --cached --stat`、`git diff --cached --check`。
7. **建立 commit**：使用符合規範的繁體中文 commit message 提交該組變更。
8. **重複處理**：重複步驟 5 至 7，直到所有已確認 scope 內的變更都提交完成。
9. **最終確認**：執行 `git status --short`，向使用者回報建立了哪些 commit，以及是否仍有未提交變更。

## 建議命令
以下命令是工作流骨架，實際路徑與 commit message 必須依分類後的結果調整：

```powershell
git status --short
git diff --stat
git diff -- <path>

git add <path-for-group-a>
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
git commit -m "Docs: 更新 Agent 提交流程規範"

git status --short
git add <path-for-group-b>
git diff --cached --name-only
git diff --cached --stat
git diff --cached --check
git commit -m "Feat: 新增個人檔案首屏"

git status --short
```

## 分類範例
- `Docs:`：README、AGENTS、skills、architecture、mission、規格文件、說明文件。
- `Feat:`：新增使用者可見功能、頁面區塊、互動或內容能力。
- `Fix:`：修正錯誤、回歸、資料不一致或使用者可見問題。
- `Refactor:`：重構既有邏輯且不預期改變行為。
- `Test:`：新增或調整測試、驗證工具或測試資料。
- `Chore:`：建置設定、依賴、工具設定、格式化或維護性調整。

## 注意事項
- `all` 代表處理所有已確認 scope 內的變更，不代表忽略分類或 commit 品質。
- 若使用者明確要求單一 commit，但變更內容明顯跨多個性質，Agent 應先說明風險並確認是否仍要合併。
- 若分類過程發現目標衝突或 scope 不明，依 `.agents/skills/core/goal_oriented_design.md` 停下來詢問使用者。
- 任務結束前，依 `.agents/skills/core/documentation_sync.md` 檢查相關文件是否需要同步更新。
