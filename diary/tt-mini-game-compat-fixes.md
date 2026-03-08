# VoxTTGame 开发问题汇总

涵盖从模拟器调试到真机运行期间发现并修复的所有问题，按时间顺序排列。

---

## 一、模拟器无法获取触摸事件

### 问题描述
`tt.onTouchStart` 注册后在模拟器中完全无响应，无任何日志输出。

### 根本原因
`tt.onTouchStart` 必须在 `tt.onShow` 回调内部注册，在外部注册时模拟器不会触发。

### 修复文件
`src/demo/VoxTTGame.ts`

### 方案
```ts
tt.onShow(() => {
    tt.onTouchStart((res) => {
        // 处理触摸事件
    });
});
```

---

## 二、射线拾取无法命中实体（坐标错误）

### 问题描述
点击格子时 scene 能收到 `MOUSE_DOWN`，但实体 click 事件从未触发。
日志输出：`mouseX/Y: 852 -433`，Y 轴为负数。

### 根本原因
`stageH` 计算错误导致坐标空间不匹配：

| 尝试 | 问题 |
|---|---|
| `canvas.height / dpr` | 返回 ~295，远小于实际屏幕高度 887 |
| `sysInfo.windowHeight / dpr` | 模拟器 `windowHeight == screenHeight`，再除以 dpr 导致偏小 |
| `sysInfo.windowHeight` | touch clientY 用的是物理像素，stageH 用 CSS 像素 → 不匹配 |

**结论**：模拟器的 `windowHeight == screenHeight == 物理像素高度`，`clientX/Y` 也是物理像素，需要全程统一使用物理像素。

### 修复文件
`src/demo/VoxTTGame.ts`

### 方案
```ts
const isMock = (tt._isMock === true);   // 区分浏览器 mock 与真实 tt
rparam.divW = sysInfo.screenWidth;       // 物理像素
rparam.divH = sysInfo.screenHeight;      // 物理像素
const stageH = sysInfo.screenHeight;

// touch 坐标转换
const px = isMock ? (0 | (dpr * t.clientX)) : (0 | t.clientX);
const py = isMock ? (0 | (dpr * t.clientY)) : (0 | t.clientY);
stage.mouseX = px;
stage.mouseY = stageH - py;   // 引擎 Y 轴从下往上
```

同时在 `TTMockImpl` 中加标记：
```ts
// src/app/platform/TTMock.ts
class TTMockImpl implements TTEnv {
    readonly _isMock = true;
    // ...
}
```

---

## 三、修复模拟器坐标后 Web 端点击失效

### 问题描述
修复模拟器坐标后，Web 端点击完全没有响应。

### 根本原因
`rparam.divW = sysInfo.windowWidth`（CSS px），但 touch 用 `px = dpr * clientX`（物理 px）——两者不在同一坐标空间。

### 修复文件
`src/demo/VoxTTGame.ts`

### 方案
统一所有环境都使用物理像素：
- `rparam.divW/divH = screenWidth/screenHeight`（物理像素）
- TTMock（浏览器）：`clientX/Y` 是 CSS 像素，需乘以 `dpr`
- 模拟器（真机）：`clientX/Y` 已是物理像素，直接使用
- 用 `isMock` 标志区分两种路径

---

## 四、点击格子无消除（单格闪烁后无反应）

### 问题描述
格子可以正确命中，但消除逻辑未触发，日志显示 "single cell, no elimination"。

### 根本原因
坐标问题修复后遗留的交互逻辑：当 flood-fill 结果 < 2 时正确地不消除（单格不可消），不是 bug，属于正常行为，需配合后续的 Flash 动画反馈。

---

## 五、点击闪烁动画速度过快

### 问题描述
点击格子后的闪烁效果太快，视觉反馈不明显。

### 修复文件
`src/demo/VoxTTGame.ts`

### 方案
经过两轮调整后的最终参数：

| 场景 | duration（帧） | sin 周期 |
|---|---|---|
| 单格（无法消除） | 45 帧 | 3 × π |
| 多格（可消除） | 75 帧 | 3 × π |
| Game Over 全板 | 90 帧 | — |

```ts
// 单格
this.m_flash = { cells: connected, timer: 0, duration: 45, eliminate: false };
// 多格
this.m_flash = { cells: connected, timer: 0, duration: 75, eliminate: true };
```

---

## 六、消除后立即补充（补充逻辑设计错误）

### 问题描述
原始设计是每次消除后立即补充新格子，用户反馈：应该是"消完所有能消的之后，再补充"。

### 修复文件
`src/demo/VoxTTGame.ts`

### 方案
改为：每次消除后调用 `checkMovesOrRefill()`，只有当盘面上**没有任何可消除的连通组**时才触发补充动画：

```ts
private checkMovesOrRefill(): void {
    if (this.hasAnyMove()) return;   // 还有可消的，继续玩
    this.startRefill(true);           // 无路可走，补充全盘
}

private hasAnyMove(): boolean {
    for (let i = 0; i < COLS * ROWS; i++) {
        const cell = this.m_grid[i];
        if (!cell.alive) continue;
        if (this.floodFill(i, cell.colorIdx).length >= 2) return true;
    }
    return false;
}
```

---

## 七、补充动画（由小变大）

### 问题描述
补充新格子时希望有过渡动画（由小变大），而不是瞬间出现。

### 修复文件
`src/demo/VoxTTGame.ts`

### 方案
使用 `entity.setScaleXYZ(s, s, s)`，通过 `sin` ease-out 在 40 帧内从 0 缩放到 1：

```ts
private tickRefill(): void {
    const r = this.m_refill;
    r.timer++;
    const t = r.timer / r.duration;                        // 0 → 1
    const s = t < 1 ? (1.1 * Math.sin(t * Math.PI * 0.5)) : 1.0;  // 轻微超调
    const scale = Math.min(s, 1.0);
    for (const c of r.cells) {
        this.m_grid[c.idx].entity.setScaleXYZ(scale, scale, scale);
    }
    // 动画结束后检查是否 Game Over
}
```

---

## 八、Game Over 判定

### 问题描述
补充全盘后如果仍然无路可走，需要判定游戏结束并给出反馈。

### 修复文件
`src/demo/VoxTTGame.ts`

### 方案
补充动画结束后再次调用 `hasAnyMove()`：

```ts
// tickRefill 结束时
if (r.afterGameOverCheck && !this.hasAnyMove()) {
    this.m_phase = GamePhase.GameOver;
    console.log("[VoxTTGame] GAME OVER! Final score:", this.m_score);
    const all = this.m_grid.map((_, i) => i).filter(i => this.m_grid[i].alive);
    this.m_flash = { cells: all, timer: 0, duration: 90, eliminate: false };
}
```

游戏状态机：
```
Playing → (无路可走) → Refilling → (仍无路可走) → GameOver
                                  ↘ (有路可走)  → Playing
```

---

## 九、真机 `window is not defined`

**报错**：`TTMock.install()` → `game_vox.js:34297`

**修复文件**：`src/app/platform/TTMock.ts`

```ts
static install(): void {
    if (typeof window === "undefined") return;   // 真机直接跳过
    if (typeof (globalThis as any).tt === "undefined") {
        (globalThis as any).tt = new TTMockImpl();
    }
}
```

---

## 十、真机 `document is not defined`

**报错**：`SysEvtMana.init()` → `game_vox.js:2637`

**修复文件**：`src/vox/render/ContextMouseEvtDispatcher.ts`

```ts
// 原来
if (document) { ... }
// 修复后
if (typeof document !== "undefined" && document) { ... }
```

---

## 十一、真机 `location is not defined`

**报错**：`RendererDevice.TestMobileWeb()` → `game_vox.js:12924`

**修复文件**：`src/vox/render/RendererDevice.ts`

```ts
if (typeof location === "undefined" || typeof navigator === "undefined") {
    RendererDevice.s_mobileFlag = 2;   // 真机必然是移动设备
    return true;
}
```

---

## 十二、真机 `navigator is not defined`

**报错**：`RendererDevice.Initialize()` → `game_vox.js:12803`

**修复文件**：`src/vox/render/RendererDevice.ts`

| 方法 | 真机降级 |
|---|---|
| `GetLanguage()` / `Initialize()` | 语言设为 `"zh-CN"` |
| `TestSafariWeb()` | 返回 `false` |
| `IsIOS()` / `IsIpadOS()` | 返回 `false` |
| `IsAndroidOS()` | 走 `TestMobileWeb()` 路径（返回 `true`） |

---

## 兼容性总结

所有修改均遵循同一原则：**在原逻辑前插入环境检测短路分支**，浏览器路径完全不变。

| 全局变量 | 浏览器 | 抖音真机 |
|---|---|---|
| `window` | ✅ 存在 | ❌ 不存在 |
| `document` | ✅ 存在 | ❌ 不存在 |
| `location` | ✅ 存在 | ❌ 不存在 |
| `navigator` | ✅ 存在 | ❌ 不存在 |
| `tt` | ✅ TTMock 注入 | ✅ 原生提供 |
