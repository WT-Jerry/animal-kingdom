# 動物王國語音導覽 · 子頁定版規範

後續每一個子頁都以 **`guides/preface.html`（前言）** 為唯一定版。  
共用樣式與播放器：**`guides/tour.css`**、**`guides/tour-player.js`**，不要各頁自寫一套。

定版頁：https://wt-jerry.github.io/animal-kingdom/guides/preface.html

---

## 1. 怎麼開新頁

1. 複製 `guides/preface.html` 成 `guides/<slug>.html`（slug 見第 10 節，不要自創新檔名）。
2. 仍引用 `tour.css`、`tour-player.js`、`../gate.js`。
3. 只改「這一頁才會變」的欄位（第 3 節）。播放器 HTML（含 ±15 SVG）整段原樣帶走。
4. 封面與語音放到 `guides/media/`，檔名用 ASCII。
5. 視覺改完用 SSH 推 `main`（`git@github.com:WT-Jerry/animal-kingdom.git`）。

現況：除前言外，其餘 25 頁仍是 stub，之後一律換成這套版面，不要沿用 stub 的 `styles.css`。

---

## 2. 頁面結構（由上到下，順序固定）

1. 頂欄：`首頁` / `清單 26` / `導覽`；右上地球＝語言。
2. 正方形封面。
3. 標題（只有名稱，**不要** `#001` 這類編號）。
4. 播放器：速度、進度條、上一則 / 倒退 15 秒 / 播放 / 快轉 15 秒 / 下一則。
5. 分頁：`介紹` / `逐字稿`（預設停在逐字稿）。
6. 內容區塊。

直欄寬度 `max-width: 430px`，背景 `#141414`，字色 `#f2f2f2`，強調色 `#c9a46a`。字型 Noto Sans TC。

---

## 3. 每一頁要改的欄位

| 項目 | 規則 |
| --- | --- |
| `<title>` | `{標題} · 動物王國語音導覽` |
| 頂欄「導覽」連結 | `href` 指這一頁自己，加 `aria-current="page"` |
| 封面 | `media/<slug>-cover.jpg`，正方形，`alt` 用繁中描述畫面 |
| `<h1 class="title">` | 標題文字，**不要**編號、不要 `#00N` |
| `<audio>` | `src` 與 `data-src-zh`＝`media/<slug>-sal.mp3`；`data-src-en`＝`media/<slug>-sal-en.mp3` |
| 上一則 / 下一則 | 依第 10 節清單串起來 |
| 介紹（zh / en） | 短文，不要編造數據或指標 |
| 逐字稿（zh / en） | **與語音逐字相同**（他怎麼寫就怎麼放，含「沈浸」） |

頂欄「首頁／清單／導覽」**不要**做中英切換，除非另外交待。

---

## 4. 封面

- 檔案：`guides/media/<slug>-cover.jpg`（正方形）。
- CSS 已定：`aspect-ratio: 1 / 1; object-fit: contain;`　**等比縮小，不裁切**。
- 換圖時在 URL 加 `?v=N` 避免快取。
- 他若附正方形定稿，直接覆蓋檔案，維持 `contain`。

---

## 5. 語音

- 男聲 **Sal**。繁中 `language: zh`，英文 `language: en`。
- 繁中：`guides/media/<slug>-sal.mp3`
- 英文：`guides/media/<slug>-sal-en.mp3`
- 英文稿在 HTML 裡用直引號 `Earth's`，不要用彎引號 `’`。
- 切換語言時，**逐字稿與語音一起換**，進度比例跟上。記住 `localStorage` 鍵 `ak-guide-lang`（`zh` / `en`）。
- 地球選單文案固定：`繁中`＋`繁體中文` / `English`。

---

## 6. 播放器（整段從前言複製）

### 6.1 行為

- 播放／暫停；結束後圖示回到播放。
- 速度循環：`1x` → `1.25x` → `1.5x` → `0.75x` → `1x`。
- 進度：左為目前時間，右為剩餘（`-m:ss`）。
- **倒退 15 秒**：`currentTime - 15`，最小 `0`。
- **快轉 15 秒**：`currentTime + 15`，不可超過總長。
- `aria-label`：`倒退 15 秒`、`快轉 15 秒`、`播放`／`暫停`。

### 6.2 按鈕排列與尺寸

同一條水平中線，由左到右：

`上一則(40px)` → `倒退15(64px)` → **間距 28px** → `播放(72px，最大)` → **間距 28px** → `快轉15(64px)` → `下一則(40px)`

- ±15 圖示本身 56×56，點擊區 64×64。
- 背景透明、沒有方框、沒有黃色／白色底。
- Hover：只加亮度（`filter: brightness(1.18)`），不要方形背景。
- Active：縮到約 `0.94`。
- Focus：圓形金環，不要預設方形 outline。

### 6.3 上一則／下一則

- 沒有上一則：`<button class="ctrl" disabled>`。
- 沒有下一則：同樣 disabled button。
- 有鄰則：`<a class="ctrl" href="{slug}.html" aria-label="上一則：…">` 或 `下一則：…`。
- 串接順序＝第 10 節 1→26，**不是**主頁卡片的視覺排法。

### 6.4 ±15 圖示（定版 SVG，不要改路徑、不要鏡射整組）

不要用 emoji、Unicode 箭頭、截圖當圖示，不要 `transform="scale(-1,1)"`，不要把 `15` 用 HTML 疊在 SVG 上。

**倒退（左上 1/4 缺口，缺口右側接向左帶線箭頭；箭頭不超出圓弧最左側；15 在圓心）：**

```html
<button class="skip15" id="back15" type="button" aria-label="倒退 15 秒">
  <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
    <path d="M11 30 A 17 17 0 1 0 28 13" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M28 13 H18" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M21.6 9.2 L15 13 L21.6 16.8" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="28" y="31.5" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="700" fill="currentColor" stroke="none" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif">15</text>
  </svg>
</button>
```

**快轉（右上 1/4 缺口，缺口左側接向右帶線箭頭；箭頭不超出圓弧最右側；15 在圓心）：**

```html
<button class="skip15" id="fwd15" type="button" aria-label="快轉 15 秒">
  <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
    <path d="M45 30 A 17 17 0 1 1 28 13" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M28 13 H38" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M34.4 9.2 L41 13 L34.4 16.8" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="28" y="31.5" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="700" fill="currentColor" stroke="none" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif">15</text>
  </svg>
</button>
```

若要改 ±15 外觀：先截圖給他看，**他說 OK 再推 GitHub**。

---

## 7. 介紹／逐字稿

- 兩個 tab：`介紹`、`逐字稿`。預設 `aria-selected="true"` 在逐字稿，底線金條在右側。
- 各 tab 內兩個 `data-lang-copy="zh"` / `"en"` 區塊，語言切換只顯示其中一個。
- **逐字稿＝語音逐字**，不要改寫、不要摘要。
- **介紹不要編造**體長、數量、保育等級等數字，除非他有給。

---

## 8. 文案語氣

- 博物館／園區導覽口吻。
- 公開頁不要寫「子頁」「連到獨立子頁」「二十六個類別」這類網站結構說明。
- 標題列只放名稱（例如 `前言`、`駱駝`），不要 `1. 前言`、不要 `#001`。

---

## 9. 完成前檢查

- [ ] 引用的是 `tour.css` + `tour-player.js`，不是 stub 那套
- [ ] 有 `../gate.js`
- [ ] 沒有 `#001` 或任何 `#00N`
- [ ] 封面正方形且 `contain`、沒被裁切
- [ ] 繁中／英文語音檔都在，地球切換會連動稿與聲音
- [ ] ±15 SVG 與前言相同，沒有方框
- [ ] 倒退不會小於 0，快轉不會超過總長
- [ ] 上一則／下一則依第 10 節串好；首則上一則 disabled、末則下一則 disabled
- [ ] 預設看到逐字稿
- [ ] 手機寬（約 390）與桌面（直欄仍 430）圖示不被裁切

---

## 10. 二十六則順序與檔名（播放器上一則／下一則用這張表）

| # | 標題 | 檔名 | 上一則 | 下一則 |
| --- | --- | --- | --- | --- |
| 1 | 前言 | `preface.html` | （無） | `desert.html` |
| 2 | 沙漠生態分區導覽 | `desert.html` | `preface.html` | `camel.html` |
| 3 | 駱駝 | `camel.html` | `desert.html` | `fennec.html` |
| 4 | 耳廓狐 | `fennec.html` | `camel.html` | `forest.html` |
| 5 | 森林生態分區導覽 | `forest.html` | `fennec.html` | `gorilla.html` |
| 6 | 大猩猩 | `gorilla.html` | `forest.html` | `panda.html` |
| 7 | 大貓熊 | `panda.html` | `gorilla.html` | `heron.html` |
| 8 | 蒼鷺 | `heron.html` | `panda.html` | `panther.html` |
| 9 | 黑豹 | `panther.html` | `heron.html` | `brown-bear.html` |
| 10 | 棕熊 | `brown-bear.html` | `panther.html` | `ocean.html` |
| 11 | 海洋生態分區導覽 | `ocean.html` | `brown-bear.html` | `grassland.html` |
| 12 | 草原生態分區導覽 | `grassland.html` | `ocean.html` | `hyena.html` |
| 13 | 斑鬣狗 | `hyena.html` | `grassland.html` | `elephant.html` |
| 14 | 大象 | `elephant.html` | `hyena.html` | `giraffe.html` |
| 15 | 長頸鹿 | `giraffe.html` | `elephant.html` | `lion.html` |
| 16 | 獅子 | `lion.html` | `giraffe.html` | `prehistoric.html` |
| 17 | 史前生命分區導覽 | `prehistoric.html` | `lion.html` | `trex.html` |
| 18 | 暴龍 | `trex.html` | `prehistoric.html` | `herbivore.html` |
| 19 | 植食性恐龍 | `herbivore.html` | `trex.html` | `raptor.html` |
| 20 | 迅猛龍 | `raptor.html` | `herbivore.html` | `pterosaur.html` |
| 21 | 翼龍 | `pterosaur.html` | `raptor.html` | `polar.html` |
| 22 | 極地生態分區導覽 | `polar.html` | `pterosaur.html` | `seal.html` |
| 23 | 海豹 | `seal.html` | `polar.html` | `musk-ox.html` |
| 24 | 麝牛 | `musk-ox.html` | `seal.html` | `polar-bear.html` |
| 25 | 北極熊 | `polar-bear.html` | `musk-ox.html` | `penguin.html` |
| 26 | 企鵝 | `penguin.html` | `polar-bear.html` | （無） |

媒體檔對應：

- 封面 `media/<slug>-cover.jpg`
- 繁中語音 `media/<slug>-sal.mp3`
- 英文語音 `media/<slug>-sal-en.mp3`

例：駱駝 → `camel-cover.jpg`、`camel-sal.mp3`、`camel-sal-en.mp3`。

---

## 11. 不要做的事

- 不要改 `tour.css` / `tour-player.js` 的播放器幾何，除非他點名要改。
- 不要把封面改成 `object-fit: cover`。
- 不要在公開 README 或本檔寫通行密碼。
- 不要用 GitHub HTTPS PAT；推送走 SSH。
- 不要各頁複製一份 CSS。
- 不要把主頁叢林風格（深綠螢光）套進子頁；子頁是博物館深灰播放器。
