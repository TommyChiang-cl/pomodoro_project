# instruction.md


# LLM 行為規範與 React Coding Style 整合

本文件分為兩部分：
1. **一般 LLM 行為規範**（Behavioral guidelines for LLM coding）
2. **React Coding Style & Structure Guide**（專案 React 程式風格與結構規範）

---

## Part 1. 一般 LLM 行為規範

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Part 2. React Coding Style & Structure Guide

通用的 React 專案 coding style 與檔案組織規範。

---

（以下內容原文來自 coding_style.md，完整保留，供專案 React 程式撰寫時遵循）

# React Coding Style & Structure Guide

## 一、檔案結構

```
src/
├── App.js                  ← 主控組件（state、handlers、組合子組件）
├── App.css                 ← App 層級樣式（外層 layout 與跨組件元素）
├── index.js                ← React 入口
├── index.css               ← 全域樣式
├── components/             ← 可重用的子組件，一個組件對應一份 .js + .css
│   ├── ComponentA.js
│   ├── ComponentA.css
│   ├── ComponentB.js
│   └── ComponentB.css
└── utils/                  ← 純函式工具（不依賴 React state/props）
		└── xxxUtils.js
```

### 拆分原則

- **每個 component 一份獨立檔案**（不要把多個組件擠在同個檔案）。
- **每個 component 對應自己的 `.css` 檔**，樣式跟著組件走。
- **純函式（pure function）放 `utils/`**：不依賴 state/props、輸入相同就回傳相同結果的工具函式。
- **App 層級的樣式留在 `App.css`**：例如外層 layout、跨組件共用的元素樣式。

### State 集中管理

State 一律集中在最上層的 `App`（或對應的容器組件），子組件透過 props 接收資料與 callback，保持子組件「無狀態 + 可重用」。

---

## 二、組件內部的 Section 順序

每個組件內部按以下固定順序排列，section 標號要寫在註解裡：

```javascript
// ── 檔案最頂部：import 區塊 ──
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ComponentName.css';
import ChildComponent from './ChildComponent';
import { someUtil } from '../utils/xxxUtils';

// 0. constants
const SOME_CONSTANT = 'value';
const INITIAL_VALUE = { ... };

const ComponentName = (props) => {
	// 1. Props
	const { prop1, prop2, prop3 } = props;

	// 2. Redux / Context
	const dispatch = useDispatch();
	const data = useSelector((state) => state.data);

	// 3. State
	const [list, setList] = useState([]);

	// 4. Ref
	const someRef = useRef(null);

	// 5. useEffect
	useEffect(() => {
		dispatch(fetchData());
	}, []);

	// 6. Logic and Utils
	const processedData = someUtil(data);

	// 7. Event Handlers
	const handleClick = () => {
		setList([]);
	};

	// Render Function（選用，複雜的 list/區塊渲染）
	const renderList = () => list.map((item) => (
		<li key={item.id}>{item.title}</li>
	));

	// (main)
	return (
		<div>
			<ul>{renderList()}</ul>
			<button onClick={handleClick}>Clear</button>
		</div>
	);
};

export default ComponentName;
```

### 重要細節

#### A. `import` 區塊不算 section
- 所有 `import`（含 CSS）放在**檔案最頂部**，跟 section 0～7 分開。

#### B. `0. constants` 放什麼
- 模組層級的常數：初始值、固定字串、顏色 map、enum 等。
- **不要把 CSS 樣式內容塞進來**，CSS 透過 `import './X.css'` 載入。

#### C. Section 5 vs Section 6 的順序
- **預設順序**：section 5（useEffect）→ section 6（Logic and Utils）。
- **例外**：若 `useEffect` 內呼叫的函式（如 `getXxx()`）依賴 section 6 裡定義的變數，可以把 section 6 放在 useEffect 之前，避免「使用前未宣告」的問題。

#### D. Section 6「Logic and Utils」放什麼
- 從 state/props **推導**出來的值（derived values）。
- 範例：
	```javascript
	const filteredList = list.filter(item => item.active);
	const total = items.reduce((sum, x) => sum + x.price, 0);
	const formattedDate = formatDate(timestamp);
	```
- **不包含** module-level 的純函式（那些放 `utils/` 或檔案底部）。

#### E. 組件內部的 helper function
- 若邏輯較長、JSX 不適合直接判斷，封裝成函式（例如 `getStatus()`、`getLabel()`）。
- 可以放在 section 6 下方（屬於組件內部的 helper）。

---

## 三、JSX 區的規範

### 原則：JSX 裡不做運算，只放變數

```javascript
// ❌ 不好：在 JSX 內直接 call 函式做運算
<div>{formatDate(timestamp)}</div>

// ✅ 好：在 section 6 算好，JSX 只負責顯示
const formattedDate = formatDate(timestamp);
// ...
<div>{formattedDate}</div>
```

### Render Function 模式

複雜的 list/區塊渲染抽成 `renderXxx` 函式：

```javascript
// Render Function
const renderList = () => list.map((item) => (
	<li key={item.id}>{item.title}</li>
));

// (main)
return (
	<ul>{renderList()}</ul>
);
```

---

## 四、函式宣告風格

### 使用 arrow function + `const`

```javascript
// ✅ 主流寫法
const ComponentName = () => { ... };
const handleClick = () => { ... };

// ❌ 不用 function declaration
function ComponentName() { ... }
function handleClick() { ... }
```

**理由**：
1. 風格一致（變數、組件、handler 都用 `const`）。
2. `const` 防止意外覆寫。
3. 在 React 組件上，兩種寫法行為完全相同，純風格選擇。

---

## 五、Event Handler 命名

- 一律以 `handle` 開頭。
- 範例：`handleClick`、`handleSubmit`、`handleReset`、`handleItemSelect`。
- 傳給子組件當 props 時，命名以 `on` 開頭：`onClick`、`onSubmit`、`onItemSelect`。

```javascript
// Parent.js
const handleItemSelect = (id) => { ... };

<Child onItemSelect={handleItemSelect} />

// Child.js
const { onItemSelect } = props;
<button onClick={() => onItemSelect(item.id)}>...</button>
```

---

## 六、State 設計準則

### Immutability：永遠用「建立新陣列/物件」取代「修改原資料」

```javascript
// ❌ 不可以（直接修改原陣列/物件）
list.push(newItem);
setList(list);

obj.key = newValue;
setObj(obj);

// ✅ 用 spread 建立新的
setList([...list, newItem]);
setObj({ ...obj, key: newValue });
```

### 陣列操作參考

```javascript
arr.slice()                     // 複製陣列
arr.slice(0, n)                 // 取前 n 個（不含 index n）
[...arr, newItem]               // append
[newItem, ...arr]               // prepend
arr.filter(x => x.id !== id)    // 移除
arr.map(x => x.id === id ? { ...x, ...updates } : x)  // 更新指定項
```

### 推導值優先於額外的 state

若一個值可以從現有 state 計算出來，就放 section 6 推導，不要另外存一份 state（避免兩份資料不同步）。

```javascript
// ❌ 額外存 state，容易不同步
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);  // 跟 items.length 重複

// ✅ 從 state 推導
const [items, setItems] = useState([]);
const count = items.length;
```

> **例外**：若計算昂貴（含迴圈、巢狀遍歷等），可改用 useState + useEffect 快取結果。見第七節。

---

## 七、useEffect 設計準則

### 一個 useEffect 只負責一件事

把不同副作用拆成多個 useEffect，相依性陣列才能精準：

```javascript
useEffect(() => { /* 處理副作用 A */ }, [depA]);
useEffect(() => { /* 處理副作用 B */ }, [depB]);
useEffect(() => { /* 處理副作用 C */ }, [depC]);
```

### 避免在每次渲染都跑昂貴的計算

像有 for 迴圈或巢狀遍歷的函式，不要直接寫在組件 body 裡：

```javascript
// ❌ 每次渲染都跑（即使輸入沒變）
const result = expensiveCompute(data);

// ✅ 改用 state + useEffect，只在 data 改變時才跑
const [result, setResult] = useState(null);
useEffect(() => {
	setResult(expensiveCompute(data));
}, [data]);
```

> 註：簡單的純計算用 `useMemo` 也是選項，但本規範統一用 state + useEffect 的寫法，便於除錯與閱讀。

### Cleanup function 的時機

```javascript
useEffect(() => {
	const id = setInterval(...);
	return () => clearInterval(id);   // ← 兩種時機會執行
}, [deps]);
```

1. **相依性改變、effect 要重新跑前**：先執行上次的 cleanup。
2. **組件 unmount 時**：執行最後一次 cleanup。

凡是建立**訂閱、計時器、event listener** 的 effect，**一定**要在 cleanup 裡解除。

### 區分「當前查看狀態」與「實際資料狀態」

當 UI 支援「查看歷史/快照」之類的功能時，要區分兩種狀態：

- **當前查看狀態**：使用者目前看到的內容（可能是過去某個快照）。
- **實際資料狀態**：資料的最新狀態（決定行為，例如是否繼續輪詢、計時等）。

兩者用不同變數命名，避免邏輯混淆。

---

## 八、CSS 命名規範

### Class 命名

- 使用 **kebab-case**：`.user-list`、`.submit-btn`、`.modal-overlay`。
- 一個組件對應一個主要 class，class 名與組件名一致或精簡版。

### 避免「內容變動造成 layout 跳動」

- 內容可能變長的容器，**設定固定 `width` 而非 `min-width`**：

	```css
	/* ❌ 寬度會隨內容增長 */
	.panel { min-width: 200px; }

	/* ✅ 寬度固定，layout 穩定 */
	.panel { width: 240px; }
	```

- 滾動條造成 layout 跳動，用 `scrollbar-gutter`：

	```css
	html { scrollbar-gutter: stable; }
	```

---

## 九、工具函式（utils/）

### 放什麼
- **純函式**：不依賴 React、輸入相同就回傳相同結果。
- 範例：日期格式化、數字計算、字串處理、資料轉換等。

### 不要放
- 依賴 state/props 的函式（那是組件內部的事）。
- Event handler（那是組件內部的事）。
- 任何呼叫 React Hook 的函式（那是 custom hook，應放 `hooks/`）。

### 範例

```javascript
// utils/dateUtils.js
export const formatDate = (timestamp) => { ... };

// utils/numberUtils.js
export const formatCurrency = (n) => { ... };
```

---

## 十、小細節整理

| 細節 | 做法 |
|------|------|
| 強制轉 boolean | 用 `!!value`，確保型別一致 |
| 陣列 append | `[...arr, newItem]`，不用 `push` |
| 陣列複製 | `arr.slice()` 或 `[...arr]` |
| 物件複製/更新 | `{ ...obj, key: value }` |
| Event handler 命名 | 組件內 `handleXxx`；傳給子組件 props 用 `onXxx` |
| 動態 className | 用 `${baseClass}${condition ? ' active' : ''}` 或 `classnames` 套件 |
| 條件渲染 | `{condition && <Component />}` 或三元運算子 |
| 列表渲染 | 必須有穩定的 `key`，避免用 array index |

---

## 附錄：範本檔案

### 子組件範本

```javascript
import './ComponentName.css';

const ComponentName = (props) => {
	// 1. Props
	const { value, onClick } = props;

	// (main)
	return (
		<button className="component-name" onClick={onClick}>
			{value}
		</button>
	);
};

export default ComponentName;
```

### 容器組件範本（含完整 sections）

```javascript
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Container.css';
import ChildComponent from './ChildComponent';
import { someUtil } from '../utils/xxxUtils';

// 0. constants
const INITIAL_STATE = { /* ... */ };

const Container = (props) => {
	// 1. Props
	const { propA } = props;

	// 2. Redux / Context
	const dispatch = useDispatch();
	const data = useSelector((state) => state.data);

	// 3. State
	const [list, setList] = useState([]);

	// 4. Ref
	const containerRef = useRef(null);

	// 5. useEffect
	useEffect(() => {
		dispatch(fetchData());
	}, []);

	// 6. Logic and Utils
	const filteredList = list.filter((item) => item.active);

	// 7. Event Handlers
	const handleClear = () => setList([]);

	// (main)
	return (
		<div ref={containerRef} className="container">
			<ChildComponent items={filteredList} onClear={handleClear} />
		</div>
	);
};

export default Container;
```