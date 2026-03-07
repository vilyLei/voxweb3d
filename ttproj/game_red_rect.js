(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TTGameApp"] = factory();
	else
		root["TTGameApp"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "1eb2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* unused harmony default export */ var _unused_webpack_default_export = (null);


/***/ }),

/***/ "2541":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * TTGameApp
 *
 * 抖音小游戏平台最基础绘制验证。
 * 不依赖引擎任何模块，使用原生 WebGL1 API 绘制一个红色矩形。
 *
 * 在浏览器中运行时，TTMock 会自动模拟 tt 全局对象；
 * 在真机抖音小游戏环境中，tt 原生存在，代码无需改动。
 *
 * 验证目标：
 *   ① tt.createCanvas()          — canvas 创建
 *   ② canvas.getContext("webgl") — WebGL1 上下文获取
 *   ③ 编译 vertex / fragment shader
 *   ④ 上传顶点数据（矩形两个三角形）
 *   ⑤ drawArrays 绘制红色矩形
 *   ⑥ tt.requestAnimationFrame   — 帧循环
 */

Object.defineProperty(exports, "__esModule", {
  value: true
}); // ─── Shader 源码 ─────────────────────────────────────────────────────────────

const VERT_SRC = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
const FRAG_SRC = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`; // ─── 工具函数 ─────────────────────────────────────────────────────────────────

function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("[TTGameApp] shader compile error: " + info);
  }

  return shader;
}

function createProgram(gl, vertSrc, fragSrc) {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw new Error("[TTGameApp] program link error: " + info);
  }

  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return program;
} // ─── 主类 ─────────────────────────────────────────────────────────────────────


class TTGameApp {
  constructor() {
    this.m_gl = null;
    this.m_program = null;
    this.m_vbo = null;
    this.m_running = false;
  }

  initialize() {
    console.log("[TTGameApp] initialize() start"); // 浏览器测试时安装 tt mock；真机上 tt 已存在会自动跳过

    this.installMockIfNeeded();
    const tt = globalThis.tt;

    if (!tt) {
      console.error("[TTGameApp] tt is not available!");
      return;
    } // ① 创建 canvas


    const canvas = tt.createCanvas();
    console.log("[TTGameApp] canvas:", canvas.width, "x", canvas.height); // ② 获取 WebGL1 上下文

    const gl = canvas.getContext("webgl", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: true
    });

    if (!gl) {
      console.error("[TTGameApp] WebGL1 context creation failed!");
      return;
    }

    console.log("[TTGameApp] WebGL1 context OK");
    this.m_gl = gl; // ③ 编译 shader / 链接 program

    this.m_program = createProgram(gl, VERT_SRC, FRAG_SRC);
    console.log("[TTGameApp] shader program OK"); // ④ 上传顶点数据：NDC 坐标，矩形覆盖中央 [-0.5, 0.5] 区域
    //    两个三角形（triangle-strip 顺序）
    //    (-0.5, 0.5) --- (0.5, 0.5)
    //        |       \       |
    //    (-0.5,-0.5) --- (0.5,-0.5)

    const vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]);
    this.m_vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // ⑥ 启动帧循环
    // 抖音小游戏：requestAnimationFrame 是全局函数，不在 tt 上
    // 浏览器 mock：tt.requestAnimationFrame 代理 window.requestAnimationFrame

    const raf = typeof globalThis.requestAnimationFrame === 'function' ? cb => globalThis.requestAnimationFrame(cb) : cb => tt.requestAnimationFrame(cb);
    this.m_running = true;

    const loop = () => {
      if (!this.m_running) return;
      this.render();
      raf(loop);
    };

    raf(loop);
    console.log("[TTGameApp] initialize() done, render loop started");
  }

  render() {
    const gl = this.m_gl;
    if (!gl) return; // 清屏（深蓝背景，方便看出红色矩形）

    gl.clearColor(0.05, 0.05, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT); // ⑤ 绘制红色矩形

    gl.useProgram(this.m_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.m_vbo);
    const loc = gl.getAttribLocation(this.m_program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  run() {// 渲染循环由内部 tt.requestAnimationFrame 驱动
  }

  destroy() {
    this.m_running = false;
    const gl = this.m_gl;

    if (gl) {
      if (this.m_vbo) gl.deleteBuffer(this.m_vbo);
      if (this.m_program) gl.deleteProgram(this.m_program);
    }

    this.m_gl = null;
    this.m_program = null;
    this.m_vbo = null;
  } // ─── 浏览器下安装 tt mock ──────────────────────────────────────────────────


  installMockIfNeeded() {
    if (typeof globalThis.tt !== "undefined") {
      console.log("[TTGameApp] tt already exists, skip mock.");
      return;
    } // 最小化内联 mock，无需依赖 TTMock.ts


    const mock = {
      createCanvas() {
        const c = document.createElement("canvas");
        c.width = window.screen.width;
        c.height = window.screen.height;
        c.style.position = "fixed";
        c.style.left = "0";
        c.style.top = "0";
        c.style.width = "100%";
        c.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.background = "#000";
        document.body.appendChild(c);
        console.log("[TTGameApp mock] createCanvas:", c.width, "x", c.height);
        return c;
      },

      getSystemInfoSync() {
        return {
          windowWidth: window.screen.width,
          windowHeight: window.screen.height,
          pixelRatio: window.devicePixelRatio || 1
        };
      },

      requestAnimationFrame(cb) {
        window.requestAnimationFrame(cb);
      }

    };
    globalThis.tt = mock;
    console.log("[TTGameApp] tt mock installed for browser testing.");
  }

}

exports.TTGameApp = TTGameApp;
exports.default = TTGameApp; // 自动启动 — 直接内联到小游戏 game.js 时无需额外调用
// 浏览器 dev 模式下由 main.ts 调用 initialize()，此处不重复执行

if (typeof globalThis.tt !== "undefined") {
  // 真机：tt 已存在，直接启动
  const _app = new TTGameApp();

  _app.initialize();
}

/***/ }),

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("2541");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/* harmony default export */ __webpack_exports__["default"] = (_entry__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ })

/******/ });
});