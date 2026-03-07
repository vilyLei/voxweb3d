# 抖音小游戏接入笔记

## 项目背景

本目录用于验证将 voxweb3d 引擎（TypeScript/WebGL）适配到抖音小游戏平台的可行性。

- `game.js` — 当前集成版本（由 `yarn build:ttgame` 自动生成并复制）
- `game_origin.js` — 抖音开发者工具创建项目时默认生成的 game.js 原始内容

---

## 构建与部署工作流

### 一键构建 + 部署

```bash
yarn build:ttgame
```

该命令做两件事：
1. 使用 Vue CLI 将 `src/ttgame/TTGameApp.ts` 编译为 UMD 库（输出到 `dist/ttgame/`）
2. 自动将 `dist/ttgame/TTGameApp.umd.js` 复制到 `ttproj/game.js`

之后直接在抖音开发者工具中刷新/预览即可，无需手动复制。

### 相关源文件

| 文件 | 说明 |
|------|------|
| `src/ttgame/TTGameApp.ts` | 小游戏验证主体，不依赖引擎任何模块 |
| `vue.config.js` | 构建时移除 `set-public-path` 插件（小游戏环境无 DOM） |
| `package.json` → `build:ttgame` | 完整构建脚本 |

---

## TTGameApp 功能说明

`TTGameApp` 是一个零引擎依赖的 WebGL1 绘制验证类，用于确认以下抖音小游戏 API 全部可用：

| 验证点 | API |
|--------|-----|
| ① Canvas 创建 | `tt.createCanvas()` |
| ② WebGL1 上下文 | `canvas.getContext("webgl", ...)` |
| ③ Shader 编译 | `gl.compileShader()` / `gl.linkProgram()` |
| ④ 顶点数据上传 | `gl.bufferData()` |
| ⑤ 绘制调用 | `gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)` |
| ⑥ 帧循环 | `requestAnimationFrame`（全局函数） |

绘制结果：深蓝色背景 + 居中红色矩形。

---

## 关键平台差异（坑点记录）

### 1. `requestAnimationFrame` 是全局函数，不在 `tt` 上

```js
// ❌ 错误写法
tt.requestAnimationFrame(cb);

// ✅ 正确写法（globalThis 上）
globalThis.requestAnimationFrame(cb);
```

源码中的兼容写法：
```typescript
const raf =
    typeof (globalThis as any).requestAnimationFrame === 'function'
        ? (cb) => (globalThis as any).requestAnimationFrame(cb)
        : (cb) => tt.requestAnimationFrame(cb);   // fallback
```

### 2. UMD 全局绑定在小游戏中无效

标准 UMD 模板会执行 `root["TTGameApp"] = factory()`，其中 `root` 是 `self` 或 `this`。
在抖音小游戏沙箱中，`self`/`this` 并不指向全局对象，导致绑定静默失败，调用方拿到 `undefined`。

**解决方案**：在源码末尾直接写自动启动逻辑，此代码运行在 webpack 闭包内部，可以直接访问 `TTGameApp` 类，无需全局绑定：

```typescript
// src/ttgame/TTGameApp.ts 末尾
if (typeof (globalThis as any).tt !== "undefined") {
    const _app = new TTGameApp();
    _app.initialize();
}
```

### 3. 小游戏环境无 DOM

- 不存在 `document`、`window` 等 Web API
- Canvas 必须通过 `tt.createCanvas()` 创建
- Vue CLI 默认会注入 `set-public-path` polyfill（访问 `document.currentScript`），打包时必须删除：

```javascript
// vue.config.js
if (lifecycleEvent.startsWith('build:ttgame')) {
    config.plugins.delete('set-public-path');
}
```

### 4. 浏览器调试时自动安装 tt mock

`TTGameApp.initialize()` 内部检测 `tt` 是否存在：
- **浏览器**（无 `tt`）：自动安装内联 mock，用 DOM canvas + `window.requestAnimationFrame` 模拟
- **真机 / 开发者工具**（`tt` 已存在）：跳过 mock，直接使用原生 API

无需改动代码即可在两个环境下运行。

---

## 多入口构建扩展

如果将来有多个小游戏模块，可以用命名前缀扩展构建脚本：

```jsonc
// package.json
"build:ttgame": "vue-cli-service build --target lib --name TTGameApp ...",
"build:ttgame:level2": "vue-cli-service build --target lib --name TTLevel2 ..."
```

`vue.config.js` 中使用 `startsWith('build:ttgame')` 匹配所有 ttgame 系列构建，
统一应用"删除 `set-public-path`"等小游戏专用配置。

---

## 常见错误速查

| 错误信息 | 原因 | 解决 |
|----------|------|------|
| `TTGameApp is not defined` | UMD 全局绑定失败 | 使用源码内自动启动，无需全局变量 |
| `tt.requestAnimationFrame is not a function` | API 在全局作用域，不在 `tt` 上 | 改用 `globalThis.requestAnimationFrame` |
| `Cannot read properties of undefined (reading 'TTGameApp')` | 同第一条 | 同第一条 |
| `set-public-path` 打包报错 | Vue CLI 注入了 DOM polyfill | `config.plugins.delete('set-public-path')` |
| 画面全黑 | Canvas 注入路径优先级低于 DOM 路径 | `RAdapterContext` 中先判断 `getInjectedCanvas()` |
