module.exports =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "0e2f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});

const ThreadCMD_1 = __webpack_require__("1e86");

const ThreadCodeSrcType_1 = __webpack_require__("d2d9");

const DependenceGraph_1 = __webpack_require__("9899");

let TCMD = ThreadCMD_1.ThreadCMD;
let TCST = ThreadCodeSrcType_1.ThreadCodeSrcType;
let taskSlot = [];
let stList = [];

class TaskHost {
  static Init(tot) {
    TaskHost.slot = new Array(tot);
    TaskHost.stList = new Array(tot);
    TaskHost.slot.fill(null);
    TaskHost.stList.fill(0);
    taskSlot = TaskHost.slot;
    stList = TaskHost.stList;
  }

}

let dpGraph = new DependenceGraph_1.DependenceGraph();

function getCurrTaskClass() {
  return dpGraph.currTaskClass;
}

exports.getCurrTaskClass = getCurrTaskClass;

function setCurrTaskClass(taskClass) {
  dpGraph.currTaskClass = taskClass;
}

exports.setCurrTaskClass = setCurrTaskClass;

function resetCurrTaskClass() {
  dpGraph.currTaskClass = -1;
}

exports.resetCurrTaskClass = resetCurrTaskClass;

function postMessageToThread(obj, transfers) {
  postMessage(obj, transfers);
}

exports.postMessageToThread = postMessageToThread;

function registerDependency(dependencyNSList) {
  console.log("ThreadCore::registerDependency(), dependencyNSList: ", dependencyNSList);
  dpGraph.registerDependency(dependencyNSList);
}

exports.registerDependency = registerDependency;

function useDependency(tm) {
  console.log("ThreadCore::useDependency(), tm: ", tm);
  dpGraph.useDependency(tm);
}

exports.useDependency = useDependency;

function bindExternModule(tm) {
  if (tm != null) {
    const id = dpGraph.currTaskClass;

    if (id >= 0) {
      TaskHost.slot[id] = tm;
    } else {
      throw Error("bind extern module error task class value!!!!");
    }
  }
}

function initializeExternModule(tm) {
  if (tm != null) {
    console.log("initializeExternModule apply dpGraph.currTaskClass: ", dpGraph.currTaskClass);
    const id = dpGraph.currTaskClass;

    if (id >= 0) {
      // TaskHost.slot[tm.getTaskClass()] = tm;
      // postMessage({ cmd: TCMD.INIT_TASK, taskclass: tm.getTaskClass() });
      TaskHost.slot[id] = tm;
      postMessage({
        cmd: TCMD.INIT_TASK,
        taskclass: id
      });
    } else {
      throw Error("initialize extern module error task class value!!!!");
    }

    dpGraph.currTaskClass = -1;
  }
}

exports.initializeExternModule = initializeExternModule;

function acquireData(moduleInstance, pdata, ptaskCmd) {
  bindExternModule(moduleInstance);
  console.log("acquireData dpGraph.currTaskClass: ", dpGraph.currTaskClass);
  let sendData = {
    cmd: TCMD.THREAD_ACQUIRE_DATA,
    taskCmd: ptaskCmd,
    taskclass: dpGraph.currTaskClass,
    data: pdata
  };
  postMessage(sendData);
}

exports.acquireData = acquireData;

function transmitData(moduleInstance, pdata, ptaskCmd, transfers) {
  let sendData = {
    cmd: TCMD.THREAD_TRANSMIT_DATA,
    taskCmd: ptaskCmd,
    taskclass: dpGraph.currTaskClass,
    data: pdata
  };

  if (transfers != undefined && transfers != null) {
    postMessage(sendData, transfers);
  } else {
    postMessage(sendData);
  }
}

exports.transmitData = transmitData;
/**
 * 作为多线程主程序核心代码
 */

class ThreadCore {
  constructor() {
    this.m_inited = true;
    this.m_threadIndex = 0;
  }

  receiveData(evt) {
    let ins = null; /////////////////////////////////////////////////// receive data from Main Worker ///////////////////////////////////

    let data = evt.data; // console.log("Sub Worker(" + data.threadIndex + ") receive main data in worker, cmd: " + data.cmd + ", data: ", evt.data);

    switch (data.cmd) {
      case TCMD.DATA_PARSE:
        data.threadIndex = this.m_threadIndex;
        ins = taskSlot[data.taskclass]; // console.log("Sub Thread(), data.taskclass: ",data.taskclass, ins);

        if (ins != null) {
          ins.receiveData(data);
        }

        break;

      case TCMD.THREAD_ACQUIRE_DATA:
        ins = taskSlot[data.taskclass]; //console.log("Sub Worker("+data.threadIndex+") receive main data in worker,THREAD_ACQUIRE_DATA, data.taskclass: ", data.taskclass, ins);

        if (ins != null) {
          ins.receiveData(data);
        }

        break;

      case TCMD.INIT_TASK:
        let param = data.param;
        let taskClass = data.info.taskClass;
        console.log("Sub Worker(" + data.threadIndex + ") INIT_TASK param.type: ", param.type, "taskClass: ", taskClass);
        console.log("Sub Worker(" + data.threadIndex + ") INIT_TASK data: ", data);

        switch (param.type) {
          case TCST.JS_FILE_CODE:
            if (stList[taskClass] < 1) {
              stList[taskClass] = 1;
              dpGraph.loadProgramByModuleUrl(param.src, data.info);
            }

            break;

          case TCST.DEPENDENCY:
            if (stList[taskClass] < 1) {
              stList[taskClass] = 1;
              dpGraph.loadProgramByDependency(param.src, data.info);
            }

            break;

          case TCST.BLOB_CODE:
            if (stList[taskClass] < 1) {
              stList[taskClass] = 1; // build code from block
            }

            break;

          case TCST.STRING_CODE:
            if (stList[taskClass] < 1) {
              stList[taskClass] = 1; // build code from string
              // console.log("param.srccode: ",param.srccode);
              // console.log("param.src: ",param.src);

              dpGraph.currTaskClass = data.info.taskClass;

              if (param.moduleName != undefined && param.moduleName != "") {
                var mins = "workerIns_" + param.moduleName;
                var tmcodeStr = "var " + mins + " = new " + param.moduleName + "();";
                tmcodeStr += "\ninitializeExternModule(" + mins + ");"; // console.log("tmcodeStr: ",tmcodeStr);

                param.src += "\n" + tmcodeStr;
                eval(param.src);
              } else {
                eval(param.src);
              }
            }

            break;

          default:
            break;
        }

        if (data.type < 1) {
          if (stList[taskClass] < 1) {
            stList[taskClass] = 1;
            dpGraph.loadProgramByModuleUrl(param.taskName);
          }
        } else {
          if (stList[taskClass] < 1) {
            stList[taskClass] = 1;
          }
        }

        break;

      case TCMD.INIT_PARAM:
        if (this.m_inited) {
          this.m_threadIndex = data.threadIndex;
          this.m_inited = false;
          console.log("TCMD.INIT_PARAM, data.total: ", data.total);
          TaskHost.Init(data.total);
          dpGraph.graphData.initFromJsonString(data.graphJsonStr);
          postMessage({
            cmd: TCMD.INIT_PARAM,
            threadIndex: this.m_threadIndex
          });
        }

        break;

      case TCMD.INIT_COMMON_MODULE:
        //   console.log("#### data.type: ",data.type);
        switch (data.type) {
          case TCST.JS_FILE_CODE:
            let modules = data.modules;

            for (let i = 0; i < modules.length; ++i) {
              dpGraph.loadProgramByModuleUrl(modules[i]);
            }

            break;

          case TCST.STRING_CODE:
            let blob = new Blob([data.src]);
            dpGraph.currTaskClass = data.info.taskClass;
            DependenceGraph_1.importJSModuleCode(URL.createObjectURL(blob), data.info.keyuns);
            break;

          default:
            break;
        }

        break;

      default:
        break;
    }
  }

  initialize() {
    if (typeof postMessage !== "undefined") {
      console.log("Sub Worker Main::initialize()...");
      self.addEventListener("message", this.receiveData.bind(this), false);
      postMessage({
        cmd: TCMD.THREAD_INIT,
        threadIndex: -1
      });
    }
  }

}

exports.ThreadCore = ThreadCore;
let ins = new ThreadCore();
ins.initialize();

/***/ }),

/***/ "1e86":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 这些定义都是内部使用的，实现任务功能的使用者不必关心，当然也不能修改
 */

class ThreadCMD {}
/**
 * 单个数据处理任务
 */


ThreadCMD.DATA_PARSE = 3501;
/**
 * (3502)多个数据处理任务组成的队列
 */

ThreadCMD.DATA_QUEUE_PARSE = 3502;
/**
 * (3601)
 */

ThreadCMD.THREAD_INIT = 3601;
/**
 * (3621)
 */

ThreadCMD.INIT_COMMON_MODULE = 3621;
/**
 * (3631)线程中的任务程序初始化的时候主动从任务对象获取需要的数据
 */

ThreadCMD.THREAD_ACQUIRE_DATA = 3631;
/**
 * (3632)
 */

ThreadCMD.THREAD_TRANSMIT_DATA = 3632;
/**
 * (3701)
 */

ThreadCMD.INIT_TASK = 3701;
/**
 * (3801)
 */

ThreadCMD.INIT_PARAM = 3801;
exports.ThreadCMD = ThreadCMD;

/***/ }),

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

/***/ "9899":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});
let scriptDir = "";
let ENV_IS_WORKER = typeof importScripts === "function";

if (ENV_IS_WORKER) {
  scriptDir = self.location.href;
  var importJSScripts = importScripts;
} else if (typeof document !== 'undefined') {
  scriptDir = document.location.href;

  var importJSScripts = js_file_url => {
    console.log("importJSScripts(), js_file_url: ", js_file_url);
  };
}

function importJSModuleCode(codeUrl, srcUrl) {
  try {
    importJSScripts(codeUrl);
  } catch (e) {
    console.error("importJSScripts() error, e: ", e);
    console.error("importJSScripts() error, url: ", srcUrl);
  }
}

exports.importJSModuleCode = importJSModuleCode;
let baseUrl = scriptDir.slice(0, scriptDir.lastIndexOf("/") + 1);
let k = baseUrl.indexOf("http://");
if (k < 0) k = baseUrl.indexOf("https://");
if (k < 0) k = 0;
baseUrl = baseUrl.slice(k);

function getJSFileUrl(url) {
  if (url == "") {
    throw Error("js file url is empty !!!");
  }

  let k = url.indexOf("://");
  if (k > 0) return url;
  return baseUrl + url;
}

class DependencyNode {
  constructor(uniqueName, index, path) {
    /**
     * 包含当前代码块所有依赖的序号
     */
    this.includes = null;
    this.uniqueName = uniqueName;
    this.index = index;
    this.path = path;
  }

}

class GraphData {
  constructor() {
    // 此数据由外部传入的json数据生成
    this.m_nodes = [];
    this.m_map = new Map();
  }

  initFromJsonString(jsonString) {
    if (jsonString != undefined && jsonString != "") {
      let obj = JSON.parse(jsonString);
      console.log("GraphData(::initFromJsonString(), obj: ", obj);
      this.m_nodes = [];
      let node;

      for (let i = 0; i < obj.nodes.length; ++i) {
        const dp = obj.nodes[i];
        node = new DependencyNode(dp.uniqueName, i, dp.path);
        this.m_nodes.push(node);
        this.m_map.set(dp.uniqueName, node);
      }

      let maps = obj.maps;

      for (let i = 0; i < maps.length; ++i) {
        const item = maps[i];
        node = this.m_map.get(item.uniqueName);
        node.includes = item.includes.slice(0);
      }
    }
  }

  getNodeUniqueName(dns) {
    return this.m_map.get(dns);
  }

  getNodeAt(i) {
    if (i >= 0 && i < this.m_nodes.length) return this.m_nodes[i];
  }
  /**
   * 通过依赖的唯一名称获取相对 path
   * @param dns 依赖的唯一名称
   * @returns 对应唯一依赖名称的相对 path
   */


  getPathByUniqueName(dns) {
    if (this.m_map.has(dns)) {
      let dp = this.m_map.get(dns);
      return dp.path;
    }

    return "";
  }

}

let graphData = new GraphData();
let registerMap = new Map();
let dpstMap = new Map();
let dpnsWaitList = [];

function testDependencyByIns(tm) {
  let node = graphData.getNodeUniqueName(tm.getUniqueName());

  if (node != null && node.includes != null) {
    let list = node.includes;
    let len = list.length;
    let i = 0;

    for (; i < len; ++i) {
      const t = graphData.getNodeAt(list[i]);

      if (!registerMap.has(t.index)) {
        break;
      }
    }

    return i >= len;
  }

  return true;
}

let timeoutId = -1;

function ddcUpdate() {
  if (timeoutId > -1) {
    clearTimeout(timeoutId);
  } // console.log("ddcUpdate(), A dpnsWaitList.length: ",dpnsWaitList.length);


  if (dpnsWaitList.length > 0) {
    let list = dpnsWaitList;
    let i = 0;
    let len = list.length;
    let tm = null;

    for (; i < len; ++i) {
      tm = list[i];

      if (testDependencyByIns(tm)) {
        list.splice(i, 1);
        i--;
        len--;
        dpstMap.delete(tm.getUniqueName());
        tm.dependencyFinish();
      }
    } // console.log("ddcUpdate(), B dpnsWaitList.length: ",dpnsWaitList.length);


    if (list.length > 0) {
      timeoutId = setTimeout(ddcUpdate, 105); // 10 fps
    }
  }
}

class DependenceGraph {
  constructor() {
    this.m_programMap = new Map();
    this.m_taskInfoMap = new Map();
    this.graphData = graphData;
    this.currTaskClass = -1;
  }

  useDependency(tm) {
    if (testDependencyByIns(tm)) {
      if (dpstMap.has(tm.getUniqueName())) {
        for (let i = 0; i < dpnsWaitList.length; ++i) {
          if (tm == dpnsWaitList[i]) {
            dpnsWaitList.splice(i, 1);
            break;
          }
        }

        dpstMap.delete(tm.getUniqueName());
        console.log("useDependency(), remove tm in dpstMap.");
      }

      console.log("useDependency(), get it.");
      tm.dependencyFinish();
    } else if (!dpstMap.has(tm.getUniqueName())) {
      // 用 uniqueName 而不用taskClass是因为有些模块并不一定有有效的taskClass 但是它依旧会去获取自身的依赖
      // 而且有些模块代码并不是由我们自身构建的，而是源自于其他第三方
      console.log("useDependency(), can not find it, ready load it."); // 尝试加载，不过这里有可能正在加载中

      let node = graphData.getNodeUniqueName(tm.getUniqueName());

      if (node != null && node.includes != null) {
        dpstMap.set(tm.getUniqueName(), 1);
        let list = node.includes;
        let len = list.length;
        let i = 0;
        let flag = false;

        for (; i < len; ++i) {
          const t = graphData.getNodeAt(list[i]); // 判断是否已经存在

          if (!registerMap.has(t.index)) {
            // 如果不存在则加载
            flag = true;
            this.loadProgramByDependency(t.uniqueName);
          }
        }

        if (flag) {
          // 不要更改这里的代码顺序
          let total = dpnsWaitList.length;
          dpnsWaitList.push(tm); // 防止额外的重复调用

          if (total < 1) {
            ddcUpdate();
          }
        }
      }
    }
  }
  /**
   * 直接通过唯一标识名来注册
   * @param uniqueName 模块的唯一标识名
   */


  registerDependency(uniqueNames) {
    if (uniqueNames != null) {
      console.log("registerDependency(), uniqueNames: ", uniqueNames);

      for (let i = 0; i < uniqueNames.length; ++i) {
        const node = graphData.getNodeUniqueName(uniqueNames[i]);
        registerMap.set(node.index, 1);
      }
    }
  }

  loadProgramByDependency(denpendency, info = null) {
    if (denpendency != "") {
      this.loadProgramByModuleUrl(graphData.getPathByUniqueName(denpendency), info);
    }
  }

  loadProgram(programUrl, info) {
    if (programUrl != "") {
      if (!this.m_programMap.has(programUrl)) {
        this.m_programMap.set(programUrl, 1);

        if (info != null && info.taskClass > -1 && !this.m_taskInfoMap.has(programUrl)) {
          this.m_taskInfoMap.set(programUrl, info);
        } // importJSScripts(programUrl);
        // let bolb: Blob = baseCodeStr == "" ? new Blob([request.responseText]) : new Blob([baseCodeStr + request.responseText]);
        // URL.createObjectURL(blob)


        let request = new XMLHttpRequest();
        request.open('GET', programUrl, true);
        console.log("programUrl: ", programUrl);

        request.onload = () => {
          if (request.status <= 206) {
            console.log("load js model file"); // eval(request.responseText);

            let blob = new Blob([request.responseText], {
              type: "text/javascript"
            });
            let info = this.m_taskInfoMap.has(programUrl) ? this.m_taskInfoMap.get(programUrl) : null;
            this.currTaskClass = info != null ? info.taskClass : -1;
            importJSModuleCode(URL.createObjectURL(blob), programUrl);
          } else {
            console.error("load thread js module error, url: ", programUrl);
          }
        };

        request.onerror = e => {
          console.error("load thread js module error, url: ", programUrl);
        };

        request.send(null);
      }
    }
  }

  loadProgramByModuleUrl(moduleUrl, info = null) {
    moduleUrl = getJSFileUrl(moduleUrl);
    console.log("XXX moduleUrl: ", moduleUrl);
    this.loadProgram(moduleUrl, info);
  }

  destroy() {}

}

exports.DependenceGraph = DependenceGraph;

/***/ }),

/***/ "d2d9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var ThreadCodeSrcType;

(function (ThreadCodeSrcType) {
  /**
   * 线程中的js代码模块通过代码字符串构建
   */
  ThreadCodeSrcType[ThreadCodeSrcType["STRING_CODE"] = 0] = "STRING_CODE";
  /**
   * 线程中的js代码模块通过代码blob构建
   */

  ThreadCodeSrcType[ThreadCodeSrcType["BLOB_CODE"] = 1] = "BLOB_CODE";
  /**
   * 线程中的js代码模块通过外部js文件构建
   */

  ThreadCodeSrcType[ThreadCodeSrcType["JS_FILE_CODE"] = 2] = "JS_FILE_CODE";
  /**
   * 线程中的js代码模块通过代码模块唯一依赖名构建
   */

  ThreadCodeSrcType[ThreadCodeSrcType["DEPENDENCY"] = 3] = "DEPENDENCY";
})(ThreadCodeSrcType || (ThreadCodeSrcType = {}));

exports.ThreadCodeSrcType = ThreadCodeSrcType;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0e2f");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });