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

/***/ "0efa":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5");

class T_CoMaterial {
  constructor() {
    this.m_init = true;
  }

  initialize(callback = null, url = "") {
    this.m_init = !this.isEnabled();

    if (this.m_init) {
      this.m_init = false;

      if (url == "" || url === undefined) {
        url = "static/cospace/coMaterial/CoMaterial.umd.min.js";
      }

      new ModuleLoader_1.ModuleLoader(1, () => {
        if (callback != null && this.isEnabled()) callback([url]);
      }).load(url);
      return true;
    }

    return false;
  }

  isEnabled() {
    return typeof CoMaterial !== "undefined";
  }
  /**
   * create a Color4 instance
   * @param pr the default vaue is 1.0
   * @param pg the default vaue is 1.0
   * @param pb the default vaue is 1.0
   * @param pa the default vaue is 1.0
   */


  createColor4(pr, pg, pb, pa) {
    return CoMaterial.createColor4(pr, pg, pb, pa);
  }
  /**
   * build default 3d entity rendering material
   * @param normalEnabled the default value is false
   */


  createDefaultMaterial(normalEnabled) {
    return CoMaterial.createDefaultMaterial(normalEnabled);
  }
  /**
   * build 3d line entity rendering material
   * @param dynColorEnabled the default value is true
   */


  createLineMaterial(dynColorEnabled) {
    return CoMaterial.createLineMaterial(dynColorEnabled);
  }
  /**
   * build 3d quad line entity rendering material
   * @param dynColorEnabled the default value is false
   */


  createQuadLineMaterial(dynColorEnabled) {
    return CoMaterial.createQuadLineMaterial(dynColorEnabled);
  }

  createShaderMaterial(shd_uniqueName) {
    return CoMaterial.createShaderMaterial(shd_uniqueName);
  }

  createMaterial(dcr) {
    return CoMaterial.createMaterial(dcr);
  }

  creatMaterialContextParam() {
    return CoMaterial.creatMaterialContextParam();
  }

  createMaterialContext() {
    return CoMaterial.createMaterialContext();
  }

}

const VoxMaterial = new T_CoMaterial();
exports.VoxMaterial = VoxMaterial;

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

/***/ "2564":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 将加载逻辑打包的loader
 */

class PackedLoader {
  /**
   * @param times 记录总共需要的完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
   * @param callback 完成所有响应的之后的回调
   */
  constructor(times, callback = null, urlChecker = null) {
    this.m_uid = PackedLoader.s_uid++;
    this.m_urlChecker = null;
    this.m_oneTimes = true;
    this.m_loaderMap = null;
    this.m_callback = callback;
    this.m_times = times;
    this.m_urlChecker = urlChecker;
  }

  setUrlChecker(urlChecker = null) {
    this.m_urlChecker = urlChecker;
    return this;
  }

  getUrlChecker() {
    return this.m_urlChecker;
  }

  getUid() {
    return this.m_uid;
  }

  setCallback(callback) {
    this.m_callback = callback;
    return this;
  }

  addLoader(m) {
    if (m != null && m != this) {
      if (this.isFinished()) {
        m.use();
      } else {
        if (this.m_loaderMap == null) {
          this.m_loaderMap = new Map();
        }

        let map = this.m_loaderMap;

        if (!map.has(m.getUid())) {
          map.set(m.getUid(), m);
        }
      }
    }

    return this;
  }

  isFinished() {
    return this.m_times == 0;
  }

  useOnce() {
    if (this.m_oneTimes) {
      this.m_oneTimes = false;
      this.use();
    }
  }

  use() {
    if (this.m_times > 0) {
      this.m_times--;

      if (this.isFinished()) {
        if (this.m_callback != null) {
          this.m_callback();
          this.m_callback = null;

          if (this.m_loaderMap != null) {
            for (let [key, value] of this.m_loaderMap) {
              value.use();
            }

            this.m_loaderMap = null;
          }
        }
      }
    }
  }

  hasModuleByUrl(url) {
    return PackedLoader.loadedMap.has(url);
  }

  load(url) {
    if (url == "") {
      return this;
    }

    if (this.m_urlChecker != null) {
      url = this.m_urlChecker(url);
    }

    let loadedMap = PackedLoader.loadedMap;

    if (loadedMap.has(url)) {
      this.use();
      return;
    }

    let loadingMap = PackedLoader.loadingMap;

    if (loadingMap.has(url)) {
      let list = loadingMap.get(url);

      for (let i = 0; i < list.length; ++i) {
        if (list[i] == this) {
          return;
        }
      }

      list.push(this);
      return;
    }

    loadingMap.set(url, [this]);
    this.loadData(url);
    return this;
  }
  /**
   * subclass need override this function
   * @param url data url
   */


  loadData(url) {
    let codeLoader = new XMLHttpRequest();
    codeLoader.open("GET", url, true);

    codeLoader.onerror = function (err) {
      console.error("load error: ", err);
    }; // codeLoader.onprogress = e => { };


    codeLoader.onload = evt => {
      // this.loadedData(codeLoader.response, url);
      this.loadedUrl(url);
    };

    codeLoader.send(null);
  }
  /**
   * subclass need override this function
   * @param data loaded data
   * @param url data url
   */


  loadedData(data, url) {
    console.log("module js file loaded, url: ", url); // let scriptEle: HTMLScriptElement = document.createElement("script");
    // scriptEle.onerror = evt => {
    // 	console.error("module script onerror, e: ", evt);
    // };
    // scriptEle.type = "text/javascript";
    // scriptEle.innerHTML = data;
    // document.head.appendChild(scriptEle);
  }
  /**
   * does not override this function
   * @param url http req url
   */


  loadedUrl(url) {
    let loadedMap = PackedLoader.loadedMap;
    let loadingMap = PackedLoader.loadingMap;
    loadedMap.set(url, 1);
    let list = loadingMap.get(url);

    for (let i = 0; i < list.length; ++i) {
      list[i].use();
    }

    loadingMap.delete(url);
  }

  getDataByUrl(url) {
    return null;
  }

  clearAllData() {}

  destroy() {
    this.m_urlChecker = null;
  }

}

PackedLoader.s_uid = 0;
PackedLoader.loadedMap = new Map();
PackedLoader.loadingMap = new Map();
exports.PackedLoader = PackedLoader;

/***/ }),

/***/ "2a2b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const URLFilter_1 = __importDefault(__webpack_require__("7aa4"));

const ModuleLoader_1 = __webpack_require__("75f5");

class CoModuleVersion {
  constructor(infoObj) {
    this.m_infoObj = null;
    this.m_verMap = new Map();
    this.forceFiltering = false;

    if (infoObj != null) {
      this.m_infoObj = infoObj;
      const versionInfo = this.m_infoObj;
      const versionInfoMap = this.m_verMap;
      let items = versionInfo.items;

      for (let i = 0; i < items.length; ++i) {
        const ia = items[i];
        versionInfoMap.set(ia.name, ia);

        if (ia.type) {
          if (ia.type == "dir") {
            let ls = ia.items;

            for (let i = 0; i < ls.length; ++i) {
              const ib = ls[i];
              versionInfoMap.set(ib.name, ib);
            }
          }
        }
      }
    }
  }

  filterUrl(url) {
    let isDL = url.indexOf("/dracoLib/") > 0;

    if (isDL) {
      let name = URLFilter_1.default.getFileNameAndSuffixName(url, true);

      if (this.m_verMap.has(name)) {
        let item = this.m_verMap.get(name);
        url += "?ver=" + item.ver;
      }
    } else {
      let name = URLFilter_1.default.getFileName(url, true);

      if (this.m_verMap.has(name)) {
        let item = this.m_verMap.get(name);
        url += "?ver=" + item.ver;
      }
    }

    return url;
  }

}

exports.CoModuleVersion = CoModuleVersion;

function toReleaseUrl(url, host) {
  let i = url.lastIndexOf("/");
  let j = url.indexOf(".", i);
  let fileName = url.slice(i, j);

  if (url.indexOf(".umd.") > 0) {
    fileName = fileName.toLocaleLowerCase();
    url = host + url.slice(0, i) + fileName + ".js";
  } else {
    url = host + url;
  }

  if (fileName == "") {
    console.error("err: ", url);
    console.error("i, j: ", i, j);
  }

  console.log("toReleaseUrl(), fileName:-" + fileName + "-");
  console.log("toReleaseUrl(), new url: ", url);
  return url;
}

class CoModuleLoader extends ModuleLoader_1.ModuleLoader {
  /**
   * @param times 记录总共需要的加载完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
   * @param callback 完成所有响应的之后的回调
   */
  constructor(times, callback = null, versionFilter = null) {
    super(times, callback, null);
    this.forceFiltering = false;

    let urlChecker = url => {
      console.log("XX MMMM XXXX init url: ", url);

      if (url.indexOf(".artvily.") > 0) {
        return url;
      }

      let hostUrl = window.location.href;
      url = url.trim();

      if (hostUrl.indexOf(".artvily.") > 0 || this.forceFiltering) {
        console.log(">>>>> NNNN 1 >>>>>>>>>>>>>>>>"); // hostUrl = "http://localhost:9000/test/";

        if (CoModuleLoader.urlHostFilterEnabled) {
          if (!this.forceFiltering) {
            hostUrl = "http://www.artvily.com:9090/";
          } else {
            hostUrl = URLFilter_1.default.getHostUrl("9090");
          }
        } // let i = url.lastIndexOf("/");
        // let j = url.indexOf(".", i);
        // let fileName = url.slice(i, j);
        // if (url.indexOf(".umd.") > 0) {
        // 	fileName = fileName.toLocaleLowerCase();
        // 	url = hostUrl + url.slice(0, i) + fileName + ".js";
        // } else {
        // 	url = hostUrl + url;
        // }


        url = toReleaseUrl(url, hostUrl);

        if (versionFilter) {
          url = versionFilter.filterUrl(url);
        }

        return url;
      } else {
        if (CoModuleLoader.forceReleaseEnabled) {
          url = toReleaseUrl(url, "");
        }
      }

      if (versionFilter) {
        url = versionFilter.filterUrl(url);
      }

      return url;
    };

    this.setUrlChecker(urlChecker);
  }

}

CoModuleLoader.urlHostFilterEnabled = true;
CoModuleLoader.forceReleaseEnabled = false;
exports.CoModuleLoader = CoModuleLoader;

/***/ }),

/***/ "2e41":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ICoTransformRecorder_1 = __webpack_require__("4427");

exports.ICoTransformRecorder = ICoTransformRecorder_1.ICoTransformRecorder;

const ITransformController_1 = __webpack_require__("8ccd");

exports.ITransformController = ITransformController_1.ITransformController;

const IFloorLineGrid_1 = __webpack_require__("c333");

exports.IFloorLineGrid = IFloorLineGrid_1.IFloorLineGrid;

const IUIRectLine_1 = __webpack_require__("5b9f");

exports.IUIRectLine = IUIRectLine_1.IUIRectLine;

const IRectFrameQuery_1 = __webpack_require__("d07b");

exports.IRectFrameQuery = IRectFrameQuery_1.IRectFrameQuery;

const ModuleLoader_1 = __webpack_require__("75f5");

var UserEditEvent = null;
exports.UserEditEvent = UserEditEvent;

class T_Lib_VoxModelEdit {
  constructor() {
    this.m_init = true;
  }

  initialize(callback = null, url = "") {
    console.log("T_Lib_VoxModelEdit::initialize(), ", this.isEnabled());

    if (this.isEnabled()) {
      exports.UserEditEvent = UserEditEvent = Lib_VoxModelEdit.UserEditEvent;
    }

    this.m_init = !this.isEnabled();

    if (this.m_init) {
      this.m_init = false;

      if (url == "" || url === undefined) {
        url = "static/cospace/modelEdit/Lib_VoxModelEdit.umd.min.js";
      }

      if (callback) {
        new ModuleLoader_1.ModuleLoader(1, () => {
          if (this.isEnabled()) callback([url]);
        }).load(url);
      }

      return true;
    }

    return false;
  }

  isEnabled() {
    return typeof Lib_VoxModelEdit !== "undefined";
  }

  get UserEditEvent() {
    return Lib_VoxModelEdit.UserEditEvent;
  }

  createTransformRecorder() {
    return Lib_VoxModelEdit.createTransformRecorder();
  }

  createTransformController() {
    return Lib_VoxModelEdit.createTransformController();
  }

  createFloorLineGrid() {
    return Lib_VoxModelEdit.createFloorLineGrid();
  }

  createUIRectLine() {
    return Lib_VoxModelEdit.createUIRectLine();
  }

  createRectFrameQuery() {
    return Lib_VoxModelEdit.createRectFrameQuery();
  }

}

const VoxModelEdit = new T_Lib_VoxModelEdit();
exports.VoxModelEdit = VoxModelEdit;

/***/ }),

/***/ "3347":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var CoModuleNS;

(function (CoModuleNS) {
  CoModuleNS["ctmParser"] = "ctmGeomParser";
  CoModuleNS["objParser"] = "objGeomParser";
  CoModuleNS["dracoParser"] = "dracoGeomParser";
  CoModuleNS["pngParser"] = "pngParser";
  CoModuleNS["fbxFastParser"] = "fbxFastParser";
  CoModuleNS["threadCore"] = "threadCore";
  CoModuleNS["coSpaceApp"] = "coSpaceApp";
})(CoModuleNS || (CoModuleNS = {}));

exports.CoModuleNS = CoModuleNS;
/**
 * 数据文件类型，例如 ctm, draco
 */

var CoDataFormat;

(function (CoDataFormat) {
  CoDataFormat["Undefined"] = "undefined-format";
  CoDataFormat["CTM"] = "ctm";
  CoDataFormat["Draco"] = "draco";
  CoDataFormat["OBJ"] = "obj";
  CoDataFormat["FBX"] = "fbx";
  CoDataFormat["GLB"] = "glb";
  CoDataFormat["Jpg"] = "jpg";
  CoDataFormat["Png"] = "png";
  CoDataFormat["Gif"] = "gif";
})(CoDataFormat || (CoDataFormat = {}));

exports.CoDataFormat = CoDataFormat;
var CoModuleFileType;

(function (CoModuleFileType) {
  CoModuleFileType["JS"] = "js-text";
  CoModuleFileType["Binasy"] = "binary";
})(CoModuleFileType || (CoModuleFileType = {}));

exports.CoModuleFileType = CoModuleFileType;

/***/ }),

/***/ "36c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class SceneAccessor {
  constructor() {}

  renderBegin(rendererScene) {
    let p = rendererScene.getRenderProxy();
    p.clearDepth(1.0);
  }

  renderEnd(rendererScene) {}

}

exports.SceneAccessor = SceneAccessor;

/***/ }),

/***/ "39ed":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const CoModuleLoader_1 = __webpack_require__("2a2b");

const UserEditEvent_1 = __webpack_require__("7d28");

const VoxRScene_1 = __webpack_require__("d1de");

const VoxUIInteraction_1 = __webpack_require__("634f");

const VoxUI_1 = __webpack_require__("3edd");

const VoxMaterial_1 = __webpack_require__("0efa");

const VoxMath_1 = __webpack_require__("f042");

const VoxModelEdit_1 = __webpack_require__("2e41");

const CoModelTeamLoader_1 = __webpack_require__("fd42");

const URLFilter_1 = __importDefault(__webpack_require__("7aa4"));

const HttpFileLoader_1 = __webpack_require__("5b39");

const VecValueFilter_1 = __webpack_require__("4a3f");

const EntityLayouter_1 = __webpack_require__("77da");
/**
 * cospace renderer
 */


class DsrdViewerBase {
  constructor() {
    this.m_verTool = null;
    this.m_teamLoader = new CoModelTeamLoader_1.CoModelTeamLoader();
    this.m_edit3DUIRScene = null;
    this.m_graph = null;
    this.m_rscene = null;
    this.m_uiScene = null;
    this.m_transCtr = null;
    this.m_selectFrame = null;
    this.m_valueFilter = new VecValueFilter_1.VecValueFilter();
    this.m_map = new Map();
    this.m_layouter = new EntityLayouter_1.EntityLayouter();
    this.m_entityQuery = null;
    this.m_entities = [];
    this.m_modelTexUrl = "";
  }

  loadInfo() {
    let url = "static/cospace/info.json";
    url = URLFilter_1.default.filterUrl(url);
    let httpLoader = new HttpFileLoader_1.HttpFileLoader();
    httpLoader.load(url, (data, url) => {
      console.log("loadInfo loaded data: ", data);
      this.m_verTool = new CoModuleLoader_1.CoModuleVersion(data);
      this.initEngineModule();
    }, null, null, "json");
  }

  initEngineModule() {
    let url = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
    let uiInteractML = new CoModuleLoader_1.CoModuleLoader(2, () => {}, this.m_verTool);
    let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
    let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
    let url2 = "static/cospace/math/CoMath.umd.js";
    let url3 = "static/cospace/ageom/CoAGeom.umd.js";
    let url5 = "static/cospace/comesh/CoMesh.umd.js";
    let url6 = "static/cospace/coentity/CoEntity.umd.js";
    let url7 = "static/cospace/particle/CoParticle.umd.js";
    let url8 = "static/cospace/coMaterial/CoMaterial.umd.js";
    let url9 = " static/cospace/cotexture/CoTexture.umd.js";
    let url10 = "static/cospace/ui/Lib_VoxUI.umd.js";
    let url11 = "static/cospace/modelEdit/Lib_VoxModelEdit.umd.js";
    new CoModuleLoader_1.CoModuleLoader(2, () => {
      if (VoxRScene_1.VoxRScene.isEnabled()) {
        new CoModuleLoader_1.CoModuleLoader(3, () => {
          new CoModuleLoader_1.CoModuleLoader(6, () => {
            console.log("modules loaded ...");
            VoxRScene_1.VoxRScene.initialize();
            VoxMath_1.VoxMath.initialize();
            VoxModelEdit_1.VoxModelEdit.initialize();
            this.initRenderer();
            this.initMouseInteract();
            this.createEditEntity();
            this.initUIScene();
          }, this.m_verTool).load(url3).load(url6).load(url7).load(url9).load(url10).load(url11);
        }, this.m_verTool).load(url2).load(url5).load(url8);
      }
    }, this.m_verTool).addLoader(uiInteractML).load(url0).load(url1);
    uiInteractML.load(url);
  }

  initMouseInteract() {
    const mi = VoxUIInteraction_1.VoxUIInteraction.createMouseInteraction();
    mi.initialize(this.m_rscene, 2).setAutoRunning(true, 1);
  }

  createDiv(px, py, pw, ph) {
    let div = document.createElement("div");
    div.style.width = pw + "px";
    div.style.height = ph + "px";
    document.body.appendChild(div);
    div.style.display = "bolck";
    div.style.left = px + "px";
    div.style.top = py + "px";
    div.style.position = "absolute";
    div.style.display = "bolck";
    div.style.position = "absolute";
    return div;
  }

  initRenderer() {}

  initUIScene() {
    let uisc = this.m_uiScene = VoxUI_1.VoxUI.createUIScene(this.m_graph);
    uisc.texAtlasNearestFilter = true;
    uisc.rscene.addEventListener(VoxRScene_1.MouseEvent.MOUSE_BG_DOWN, this, this.uiMouseDownListener);
    uisc.rscene.addEventListener(VoxRScene_1.MouseEvent.MOUSE_UP, this, this.uiMouseUpListener);
    uisc.rscene.addEventListener(VoxRScene_1.MouseEvent.MOUSE_MOVE, this, this.uiMouseMoveListener);
    this.initUIEntities();
    this.m_entityQuery = VoxModelEdit_1.VoxModelEdit.createRectFrameQuery();
    this.m_entityQuery.initialize(this.m_rscene);

    if (this.m_selectFrame == null) {
      this.m_selectFrame = VoxModelEdit_1.VoxModelEdit.createUIRectLine();
      this.m_selectFrame.initialize(uisc.rscene);
      this.m_selectFrame.enable();
    }

    let rscene = this.m_rscene; // rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);

    rscene.addEventListener(VoxRScene_1.KeyboardEvent.KEY_DOWN, this, this.keyDown);
    rscene.addEventListener(VoxRScene_1.MouseEvent.MOUSE_BG_CLICK, this, this.mouseBGClickListener);
    rscene.addEventListener(VoxRScene_1.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
  }

  createBtn(uuid, text, px, py, group) {
    let textColor = VoxMaterial_1.VoxMaterial.createColor4(1, 1, 1, 1);
    let btn = VoxUI_1.VoxUI.createTextLabelButton(uuid, text, 100, 50, textColor);
    btn.setXY(px, py);
    this.m_uiScene.addEntity(btn);
    btn.addEventListener(VoxRScene_1.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);
    group.addButton(btn);
    return btn;
  }

  createSelectBtn(px, py, ns, uuid, selectNS, deselectNS, flag) {
    let selectBar = VoxUI_1.VoxUI.createSelectionEntity();
    selectBar.uuid = uuid;
    let colors = [0xff5dbea3, 0xff33b249, 0xff5adbb5, 0xff33b249];
    selectBar.setBGColorsWithARGBUint32(colors);
    selectBar.initialize(this.m_uiScene, ns, selectNS, deselectNS, 30);
    selectBar.addEventListener(VoxRScene_1.SelectionEvent.SELECT, this, this.selectChange);

    if (flag) {
      selectBar.select(false);
    } else {
      selectBar.deselect(false);
    }

    selectBar.setXY(px, py);
    this.m_uiScene.addEntity(selectBar);
    return selectBar;
  }

  selectChange(evt) {
    console.log("selectChange(), evt.flag: ", evt.flag);
    this.m_valueFilter.setAbsorbing(evt.flag);
  }

  initUIEntities() {
    this.m_btnGroup0 = VoxUI_1.VoxUI.createSelectButtonGroup();
    this.m_btnGroup1 = VoxUI_1.VoxUI.createSelectButtonGroup();
    this.m_btnGroup2 = VoxUI_1.VoxUI.createSelectButtonGroup();
    let tx = 10;
    let ty = 10; // let absorbBtn = this.createSelectBtn(tx, ty + 30 + 520, "吸附", "absorb", "ON", "OFF", false);
    // let localBtn = this.createBtn("local", "局部坐标", tx, ty + 30 + 450, this.m_btnGroup0);
    // let globalBtn = this.createBtn("global", "全局坐标", tx, ty + 30 + 380, this.m_btnGroup0);
    // ty += 50;
    // let moveBtn = this.createBtn("move", "移动", tx, ty + 120, this.m_btnGroup1);
    // let rotateBtn = this.createBtn("rotate", "旋转", tx, ty + 60, this.m_btnGroup1);
    // let scaleBtn = this.createBtn("scale", "缩放", tx, ty, this.m_btnGroup1);
    // ty -= 50;
    // // let redoBtn = this.createBtn("redo", "重做", tx, ty + 30, this.m_btnGroup2);
    // // let undoBtn = this.createBtn("undo", "撤销", tx, ty - 40, this.m_btnGroup2);
    // // this.m_btnGroup0.selectButton(globalBtn);
    // this.m_btnGroup1.selectButton(moveBtn);
    // // this.m_btnGroup2.selectButton(moveBtn);
  }

  createEditEntity() {
    let edit3dsc = this.m_edit3DUIRScene;
    this.m_transCtr = VoxModelEdit_1.VoxModelEdit.createTransformController();
    const tc = this.m_transCtr;
    tc.initialize(edit3dsc);
    tc.addEventListener(UserEditEvent_1.UserEditEvent.EDIT_BEGIN, this, this.trans3DEditBegin);
    tc.addEventListener(UserEditEvent_1.UserEditEvent.EDIT_END, this, this.trans3DEditEnd);
    this.m_transCtr.setCtrlValueFilter(this.m_valueFilter);
    this.m_prevPos = VoxMath_1.VoxMath.createVec3();
    this.m_currPos = VoxMath_1.VoxMath.createVec3();
    this.m_keyInterac = VoxUIInteraction_1.VoxUIInteraction.createKeyboardInteraction();
    const ki = this.m_keyInterac;
    ki.initialize(this.m_rscene);
    let Key = VoxRScene_1.Keyboard;
    let type = ki.createKeysEventType([Key.CTRL, Key.Y]);
    ki.addKeysDownListener(type, this, this.keyCtrlYDown);
    type = ki.createKeysEventType([Key.CTRL, Key.Z]);
    ki.addKeysDownListener(type, this, this.keyCtrlZDown);
    this.m_recoder = VoxModelEdit_1.VoxModelEdit.createTransformRecorder();
  }

  keyCtrlZDown(evt) {
    this.m_recoder.undo();
    let list = this.m_recoder.getCurrList();
    this.selectEntities(list);
  }

  keyCtrlYDown(evt) {
    this.m_recoder.redo();
    let list = this.m_recoder.getCurrList();
    this.selectEntities(list);
  }

  trans3DEditBegin(evt) {
    console.log("XXXXXXXX Edit begin...");
    let list = evt.currentTarget.getTargetEntities();
    let st = this.m_rscene.getStage3D();
    this.m_prevPos.setXYZ(st.mouseX, st.mouseY, 0);
    this.m_recoder.saveBegin(list);
    this.m_selectFrame.disable();
  }

  trans3DEditEnd(evt) {
    console.log("XXXXXXXX Edit end...", this.m_prevPos, this.m_currPos);
    let st = this.m_rscene.getStage3D();
    this.m_currPos.setXYZ(st.mouseX, st.mouseY, 0);

    if (VoxMath_1.Vector3D.Distance(this.m_prevPos, this.m_currPos) > 0.5) {
      console.log("XXXXXXXX Edit transforming success ...");
      let list = evt.currentTarget.getTargetEntities();
      console.log("XXXXXXXX Edit transforming entity list: ", list);
      this.m_recoder.saveEnd(list);
    } else {
      this.m_recoder.saveEnd(null);
    }

    this.m_selectFrame.enable();
  }

  uiMouseDownListener(evt) {
    console.log("DsrdViewer::uiMouseDownListener(), evt: ", evt);
    this.m_selectFrame.begin(evt.mouseX, evt.mouseY);
  }

  uiMouseUpListener(evt) {
    console.log("DsrdViewer::uiMouseUpListener(), evt: ", evt);

    if (this.m_selectFrame.isSelectEnabled()) {
      let b = this.m_selectFrame.bounds;
      console.log("DsrdViewer::uiMouseUpListener(), b: ", b);
      let list = this.m_entityQuery.getEntities(b.min, b.max);
      console.log("list: ", list);
      this.selectEntities(list);
    }

    this.m_selectFrame.end(evt.mouseX, evt.mouseY);
  }

  uiMouseMoveListener(evt) {
    // console.log("DsrdViewer::uiMouseMoveListener(), evt: ", evt);
    // console.log("ui move (x, y): ", evt.mouseX, evt.mouseY);
    this.m_selectFrame.move(evt.mouseX, evt.mouseY);
  }

  btnMouseUpListener(evt) {
    console.log("btnMouseUpListener(), evt.uuid: ", evt.uuid);
    let uuid = evt.uuid;

    switch (uuid) {
      case "local":
        this.m_transCtr.toLocal();
        break;

      case "global":
        this.m_transCtr.toGlobal();
        break;

      case "move":
        this.m_transCtr.toTranslation();
        break;

      case "scale":
        this.m_transCtr.toScale();
        break;

      case "rotate":
        this.m_transCtr.toRotation();
        this;
        break;

      case "redo":
        this.keyCtrlYDown(null);
        break;

      case "undo":
        this.keyCtrlZDown(null);
        break;

      default:
        break;
    }
  }

  createTexByUrl(url = "", saving = true) {
    let map = this.m_map;
    url = url != "" ? url : "static/assets/box.jpg";
    url = URLFilter_1.default.filterUrl(url);

    if (map.has(url)) {
      return map.get(url);
    }

    let tex = this.m_rscene.textureBlock.createImageTex2D();

    if (saving) {
      map.set(url, tex);
    }

    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "blob";

    request.onload = e => {
      let img = new Image();

      img.onload = evt => {
        tex.setDataFromImage(img, 0, 0, 0, false);
      };

      let pwin = window;
      var imageUrl = (pwin.URL || pwin.webkitURL).createObjectURL(request.response);
      img.src = imageUrl;
    };

    request.onerror = e => {
      console.error("load error binary image buffer request.status: ", request.status, "url:", url);
    };

    request.send(null);
    return tex;
  }

  keyDown(evt) {
    console.log("DsrdViewer::keyDown() ..., evt.keyCode: ", evt.keyCode);
    let KEY = VoxRScene_1.Keyboard;

    switch (evt.keyCode) {
      case KEY.W:
        this.m_transCtr.toTranslation();
        break;

      case KEY.E:
        this.m_transCtr.toScale();
        break;

      case KEY.R:
        this.m_transCtr.toRotation();
        break;

      default:
        break;
    }
  }

  loadModels() {
    let baseUrl = "static/private/";
    let url = baseUrl + "obj/base.obj";
    url = baseUrl + "fbx/base4.fbx";
    url = "static/assets/fbx/base4.fbx";
    console.log("loadModels() init...");
    url = URLFilter_1.default.filterUrl(url);
    let loader = this.m_teamLoader;
    loader.verTool = this.m_verTool;
    loader.load([url], (models, transforms) => {
      this.m_layouter.layoutReset();

      for (let i = 0; i < models.length; ++i) {
        this.createEntity(models[i], transforms != null ? transforms[i] : null, 1.0);
      }

      this.m_layouter.layoutUpdate(200, VoxMath_1.VoxMath.createVec3(0, 0, 0));
    });
  }

  createEntity(model, transform = null, index = 1.0, url = "") {
    let material = VoxRScene_1.VoxRScene.createDefaultMaterial(true);
    material.setRGB3f(0.85, 0.85, 0.85);
    material.setTextureList([this.createTexByUrl(this.m_modelTexUrl)]);
    material.initializeByCodeBuf(true);
    let mesh = VoxRScene_1.VoxRScene.createDataMeshFromModel(model, material);
    let entity = VoxRScene_1.VoxRScene.createMouseEventEntity();

    if (url != "") {
      entity.uuid = url;
    }

    entity.setMaterial(material);
    entity.setMesh(mesh); // entity.setPosition(cv);
    // entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);

    entity.update();

    if (this.m_entityContainer == null) {
      this.m_rscene.addEntity(entity);
    } else {
      this.m_entityContainer.addEntity(entity);
    }

    entity.addEventListener(VoxRScene_1.MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
    entity.addEventListener(VoxRScene_1.MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
    entity.addEventListener(VoxRScene_1.MouseEvent.MOUSE_DOWN, this, this.mouseDownTargetListener);
    entity.addEventListener(VoxRScene_1.MouseEvent.MOUSE_UP, this, this.mouseUpTargetListener);
    this.m_entities.push(entity);
    this.m_layouter.layoutAppendItem(entity, VoxRScene_1.VoxRScene.createMat4(transform));
    return entity;
  }

  mouseOverTargetListener(evt) {// console.log("mouseOverTargetListener()..., evt.target: ", evt.target);
  }

  mouseOutTargetListener(evt) {// console.log("mouseOutTargetListener()..., evt.target: ", evt.target);
  }

  mouseDownTargetListener(evt) {
    console.log("mouseDownTargetListener()..., evt: ", evt);
  }

  selectEntities(list, hitPV = null) {
    if (list && list.length > 0) {
      let transCtr = this.m_transCtr;
      let pos = VoxMath_1.VoxMath.createVec3();

      for (let i = 0; i < list.length; ++i) {
        pos.addBy(list[i].getGlobalBounds().center);
      }

      pos.scaleBy(1.0 / list.length);

      if (transCtr && list.length > 0) {
        // 暂时注释掉，后续功能完善了再启用
        // transCtr.select(list as ITransformEntity[], pos);
        this.m_outline.select(list);
      }
    }
  }

  setMouseUpListener(mouseUpCall) {
    this.m_mouseUpCall = mouseUpCall;
  }

  mouseUpTargetListener(evt) {
    console.log("mouseUpTargetListener() mouse up...");

    if (this.m_mouseUpCall) {
      this.m_mouseUpCall(evt);
    }

    let entity = evt.target;
    this.selectEntities([entity], evt.wpos);
  }

  mouseUpListener(evt) {
    if (this.m_transCtr) {
      this.m_transCtr.decontrol();
    }
  }

  mouseBGClickListener(evt) {
    if (this.m_transCtr) {
      this.m_transCtr.disable();
    }

    this.m_outline.deselect();

    if (this.m_mouseUpCall) {
      this.m_mouseUpCall(evt);
    }
  }

  run() {
    if (this.m_graph) {
      if (this.m_transCtr) {
        this.m_transCtr.run();
      }

      this.m_graph.run();
    }
  }

}

exports.DsrdViewerBase = DsrdViewerBase;

/***/ }),

/***/ "3edd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5");

class T_Lib_VoxUI {
  constructor() {
    this.m_init = true;
  }

  initialize(callback = null, url = "") {
    console.log("T_Lib_VoxUI::initialize(), ", this.isEnabled());

    if (this.isEnabled()) {
      Lib_VoxUI.initialize();
    }

    this.m_init = !this.isEnabled();

    if (this.m_init) {
      this.m_init = false;

      if (url == "" || url === undefined) {
        url = "static/cospace/ui/Lib_VoxUI.umd.min.js";
      }

      if (callback != null) {
        new ModuleLoader_1.ModuleLoader(1, () => {
          if (this.isEnabled()) callback([url]);
        }).load(url);
      }

      return true;
    }

    return false;
  }

  isEnabled() {
    return typeof Lib_VoxUI !== "undefined";
  }

  createColorLabel() {
    return Lib_VoxUI.createColorLabel();
  }

  createUILayout() {
    return Lib_VoxUI.createUILayout();
  }

  createTipInfo() {
    return Lib_VoxUI.createTipInfo();
  }

  createRectTextTip() {
    return Lib_VoxUI.createRectTextTip();
  }

  createClipLabel() {
    return Lib_VoxUI.createClipLabel();
  }

  createClipColorLabel() {
    return Lib_VoxUI.createClipColorLabel();
  }

  createColorClipLabel() {
    return Lib_VoxUI.createColorClipLabel();
  }

  createTextLabel() {
    return Lib_VoxUI.createTextLabel();
  }

  createButton() {
    return Lib_VoxUI.createButton();
  }

  createFlagButton() {
    return Lib_VoxUI.createFlagButton();
  }

  createSelectButtonGroup() {
    return Lib_VoxUI.createSelectButtonGroup();
  }

  createTextButton(width, height, uuid, texAtlas, textParam, colors) {
    return Lib_VoxUI.createTextButton(width, height, uuid, texAtlas, textParam, colors);
  }
  /**
   * @param uuid button event uuid
   * @param text button text content
   * @param width button width, the defaule value is 90
   * @param height button height, the defaule value is 50
   * @param textColor button text color, the defaule value is null
   * @param fontSize button text font size, the defaule value is 30
   * @param fontName button text font name, the defaule value is ""
   */


  createTextLabelButton(uuid, text, width, height, textColor, fontSize, fontName) {
    return Lib_VoxUI.createTextLabelButton(uuid, text, width, height, textColor, fontSize, fontName);
  }

  createUIPanel() {
    return Lib_VoxUI.createUIPanel();
  }

  createPromptPanel() {
    return Lib_VoxUI.createPromptPanel();
  }

  createParamCtrlPanel() {
    return Lib_VoxUI.createParamCtrlPanel();
  }
  /**
   * @param graph IRendererSceneGraph instance
   * @param uiConfig IUIConfig instance, its default value is null
   * @param atlasSize the default value is 512
   * @param renderProcessesTotal the default value is 3
   */


  createUIScene(graph, uiConfig, atlasSize, renderProcessesTotal) {
    return Lib_VoxUI.createUIScene(graph, uiConfig, atlasSize, renderProcessesTotal);
  }

  createSelectionEntity() {
    return Lib_VoxUI.createSelectionEntity();
  }

  createProgressEntity() {
    return Lib_VoxUI.createProgressEntity();
  }

}

const VoxUI = new T_Lib_VoxUI();
exports.VoxUI = VoxUI;

/***/ }),

/***/ "4427":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "4620":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2023 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const URLFilter_1 = __importDefault(__webpack_require__("7aa4"));

class ImgUint {
  constructor() {
    this.m_listeners = [];
    this.url = "";
    this.img = null;
    this.loaded = false;
  }

  addListener(listener) {
    let ls = this.m_listeners;
    let i = 0;

    for (; i < ls.length; ++i) {
      if (ls[i] == listener) {
        break;
      }
    }

    if (i >= ls.length) {
      ls.push(listener);
    }
  }

  removeListener(listener) {
    let ls = this.m_listeners;

    for (let i = 0; i < ls.length; ++i) {
      if (ls[i] == listener) {
        ls.splice(i, 1);
        break;
      }
    }
  }

  dispatch() {
    if (this.loaded) {
      let ls = this.m_listeners;
      this.m_listeners = [];

      for (let i = 0; i < ls.length; ++i) {
        ls[i](this.img, this.url);
      }
    }
  }

}

class ImageResLoader {
  constructor() {
    this.m_map = new Map();
  }

  load(url, onload) {
    if (url != "") {
      let initUrl = url;
      let map = this.m_map;
      url = url != "" ? url : "static/assets/box.jpg";
      url = URLFilter_1.default.filterUrl(url);

      if (map.has(initUrl)) {
        let punit = map.get(url);

        if (punit.loaded) {
          onload(punit.img, punit.url);
        } else {
          punit.addListener(onload);
        }
      }

      let img = new Image();
      let unit = new ImgUint();
      unit.img = img;
      unit.url = initUrl;
      unit.addListener(onload);
      map.set(initUrl, unit);
      const request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.responseType = "blob";

      request.onload = e => {
        img.onload = evt => {
          unit.loaded = true;
          unit.dispatch();
        };

        let pwin = window;
        img.src = (pwin.URL || pwin.webkitURL).createObjectURL(request.response);
      };

      request.onerror = e => {
        console.error("load error binary image buffer request.status: ", request.status, "url:", url);
      };

      request.send(null);
    }
  }

}

exports.default = ImageResLoader;

/***/ }),

/***/ "4a3f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class VecValueFilter {
  constructor() {
    this.m_absorb = false;
  }

  filterScale(s) {
    if (Math.abs(s) < 1.0) {
      if (s < 0) {
        s = -1;
      } else if (s > 0) {
        s = 1;
      }
    } else {
      console.log(s.toFixed(2), "Math.floor(s): ", Math.floor(s));
      s = Math.floor(s);
    }

    return s;
  }

  setAbsorbing(absorb) {
    this.m_absorb = absorb;
  }

  ctrlValueFilter(type, pv) {
    console.log("VecValueFilter, A pv: ", pv);

    if (this.m_absorb) {
      switch (type) {
        case 0:
          pv.x = Math.round(pv.x / 10.0) * 10.0;
          pv.y = Math.round(pv.y / 10.0) * 10.0;
          pv.z = Math.round(pv.z / 10.0) * 10.0;
          break;

        case 1:
          pv.x = this.filterScale(pv.x);
          pv.y = this.filterScale(pv.y);
          pv.z = this.filterScale(pv.z);
          break;

        case 2:
          pv.x = Math.round(pv.x / 5.0) * 5.0;
          pv.y = Math.round(pv.y / 5.0) * 5.0;
          pv.z = Math.round(pv.z / 5.0) * 5.0;
          break;

        default:
          break;
      }
    }

    console.log("VecValueFilter, B pv: ", pv);
  }

}

exports.VecValueFilter = VecValueFilter;

/***/ }),

/***/ "5b39":
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

class HttpFileLoader {
  constructor() {
    this.crossOrigin = 'anonymous';
  }

  setCrossOrigin(crossOrigin) {
    this.crossOrigin = crossOrigin;
  }

  async load(url, onLoad,
  /**
   * @param progress its value is 0.0 -> 1.0
   */
  onProgress = null, onError = null, responseType = "blob", headRange = "") {
    // console.log("HttpFileLoader::load(), A url: ", url);
    // console.log("loadBinBuffer, headRange != '': ", headRange != "");
    if (onLoad == null) {
      throw Error("onload == null !!!");
    }

    const reader = new FileReader();

    reader.onload = e => {
      if (onLoad) onLoad(reader.result, url);
    };

    const request = new XMLHttpRequest();
    request.open("GET", url, true);

    if (headRange != "") {
      request.setRequestHeader("Range", headRange);
    }

    request.responseType = responseType;

    request.onload = e => {
      // console.log("loaded binary buffer request.status: ", request.status, e);
      // console.log("HttpFileLoader::load(), B url: ", url);
      if (request.status <= 206) {
        switch (responseType) {
          case "arraybuffer":
          case "blob":
            reader.readAsArrayBuffer(request.response);
            break;

          case "json":
            if (onLoad) onLoad(request.response, url);
            break;

          case "text":
            if (onLoad) onLoad(request.response, url);
            break;

          default:
            if (onLoad) onLoad(request.response, url);
            break;
        } // if(responseType == "blob" || responseType == "arraybuffer") {
        // 	reader.readAsArrayBuffer(request.response);
        // }else {
        // 	if(onLoad) onLoad(<string>request.response, url);
        // }

      } else if (onError) {
        onError(request.status, url);
      }
    };

    if (onProgress != null) {
      request.onprogress = evt => {
        // console.log("progress evt: ", evt);
        // console.log("progress total: ", evt.total, ", loaded: ", evt.loaded);
        let k = 0.0;

        if (evt.total > 0 || evt.lengthComputable) {
          k = Math.min(1.0, evt.loaded / evt.total);
        } else {
          let content_length = parseInt(request.getResponseHeader("content-length")); // var encoding = req.getResponseHeader("content-encoding");
          // if (total && encoding && encoding.indexOf("gzip") > -1) {

          if (content_length > 0) {
            // assuming average gzip compression ratio to be 25%
            content_length *= 4; // original size / compressed size

            k = Math.min(1.0, evt.loaded / content_length);
          } else {
            console.warn("lengthComputable failed");
          }
        } //let progressInfo = k + "%";
        //console.log("progress progressInfo: ", progressInfo);


        onProgress(k, url);
      };
    }

    if (onError != null) {
      request.onerror = e => {
        console.error("load error, request.status: ", request.status, ", url: ", url);
        onError(request.status, url);
      };
    }

    request.send(null);
  }

}

exports.HttpFileLoader = HttpFileLoader;

/***/ }),

/***/ "5b9f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "634f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5");

class T_CoUIInteraction {
  constructor() {
    this.m_init = true;
  }

  initialize(callback = null, url = "") {
    if (this.m_init) {
      this.m_init = false;

      if (url == "" || url === undefined) {
        url = "static/cospace/engine/uiInteract/CoUIInteraction.umd.min.js";
      }

      new ModuleLoader_1.ModuleLoader(1, () => {
        if (callback != null && this.isEnabled()) callback([url]);
      }).load(url);
      return true;
    }

    return false;
  }

  createMouseInteraction() {
    return CoUIInteraction.createMouseInteraction();
  }

  createKeyboardInteraction() {
    return CoUIInteraction.createKeyboardInteraction();
  }

  isEnabled() {
    return typeof CoUIInteraction !== "undefined";
  }

}

const VoxUIInteraction = new T_CoUIInteraction();
exports.VoxUIInteraction = VoxUIInteraction;

/***/ }),

/***/ "75f5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const PackedLoader_1 = __webpack_require__("2564");

class ModuleLoader extends PackedLoader_1.PackedLoader {
  /**
   * @param times 记录总共需要的加载完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
   * @param callback 完成所有响应的之后的回调
   * @param urlChecker url 转换与检查
   */
  constructor(times, callback = null, urlChecker = null) {
    super(times, callback, urlChecker);
  }

  loadData(url) {
    let req = new XMLHttpRequest();
    req.open("GET", url, true);

    req.onerror = function (err) {
      console.error("load error: ", err);
    }; // req.onprogress = e => { };


    req.onload = evt => {
      this.loadedData(req.response, url);
      this.loadedUrl(url);
    };

    req.send(null);
  }

  loadedData(data, url) {
    console.log("ModuleLoader::loadedData(), module js file loaded, url: ", url);
    let scriptEle = document.createElement("script");

    scriptEle.onerror = evt => {
      console.error("module script onerror, e: ", evt);
    };

    scriptEle.type = "text/javascript";

    try {
      scriptEle.innerHTML = data;
      document.head.appendChild(scriptEle);
    } catch (e) {
      console.error("ModuleLoader::loadedData() apply script ele error.");
      throw e;
    }
  }

}

exports.ModuleLoader = ModuleLoader;

/***/ }),

/***/ "77da":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class EntityLayouter {
  constructor() {
    this.m_scaleV = null;
    this.m_tempMat = null;
    this.m_currMat = null;
    this.m_aabb = null;
    this.m_sizeScale = 1.0;
    this.m_entities = [];
    this.m_transforms = [];
    this.locationEnabled = true;
    this.rotationEnabled = false;
  }

  initialize() {
    if (this.m_scaleV == null) {
      this.m_scaleV = CoMath.createVec3();
      this.m_tempMat = CoMath.createMat4();
      this.m_currMat = CoMath.createMat4();
      this.m_aabb = CoMath.createAABB();
    }
  }

  getAABB() {
    return this.m_aabb;
  }

  layoutReset() {
    this.m_sizeScale = 1.0;
    this.m_scaleV = null;
    this.initialize();
    this.m_entities = [];
    this.m_transforms = [];
  }

  getEntities() {
    return this.m_entities;
  }

  layoutAppendItem(entity, transform) {
    this.m_entities.push(entity);
    this.m_transforms.push(transform); // console.log("layoutAppendItem(), entity: ", entity);
  }

  layoutUpdate(fixSize = 300.0, pivot = null, rotationEnabled = false) {
    this.rotationEnabled = rotationEnabled;

    for (let k = 0; k < this.m_entities.length; ++k) {
      let et = this.m_entities[k];
      et.setXYZ(0.0, 0.0, 0.0);
      et.setScaleXYZ(1.0, 1.0, 1.0);
      et.setRotationXYZ(0.0, 0.0, 0.0);
    }

    if (pivot == null) pivot = CoMath.createVec3();
    this.fixToPosition(this.m_entities, this.m_transforms, pivot, fixSize);
  }

  calcAABB(entities, transforms) {
    this.initialize();
    let aabb = this.m_aabb;

    for (let k = 0; k < entities.length; ++k) {
      entities[k].update();
      if (k > 0) aabb.union(entities[k].getGlobalBounds());else aabb.copyFrom(entities[k].getGlobalBounds());
    }

    aabb.update();
    return aabb;
  }

  fixToPosition(entities, transforms, fixV3, baseSize = 300.0) {
    this.initialize();
    let mat = this.m_tempMat;
    let transform;
    let currMat = this.m_currMat;
    let aabb = this.m_aabb;

    for (let k = 0; k < entities.length; ++k) {
      transform = transforms[k];
      mat.identity();

      if (this.rotationEnabled) {
        mat.setRotationEulerAngle(0.5 * Math.PI, 0.0, 0.0);
      }

      if (transform != null) {
        currMat.copyFrom(transform);
        currMat.append(mat);
        entities[k].getTransform().setParentMatrix(currMat);
      } else {
        currMat.copyFrom(mat);
        entities[k].getTransform().setParentMatrix(currMat);
      }

      entities[k].update();
      if (k > 0) aabb.union(entities[k].getGlobalBounds());else aabb.copyFrom(entities[k].getGlobalBounds());
    }

    aabb.update();
    let sx = baseSize / aabb.getWidth();
    let sy = baseSize / aabb.getHeight();
    let sz = baseSize / aabb.getLong();
    sx = Math.min(sx, sy, sz);
    this.m_sizeScale = sx;
    this.m_scaleV.setXYZ(sx, sx, sx);
    aabb.reset();

    for (let k = 0; k < entities.length; ++k) {
      transform = transforms[k];
      mat.identity();
      mat.setScale(this.m_scaleV);

      if (this.rotationEnabled) {
        mat.setRotationEulerAngle(0.5 * Math.PI, 0.0, 0.0);
      }

      if (transform != null) {
        currMat.copyFrom(transform);
        currMat.append(mat);
      } else {
        currMat.copyFrom(mat);
      }

      let params = currMat.decompose(CoMath.OrientationType.EULER_ANGLES);
      entities[k].setScale3(params[2]);
      entities[k].setRotation3(params[1]);
      entities[k].setPosition(params[0]);
      entities[k].getTransform().setParentMatrix(null);
      entities[k].update();
      if (k > 0) aabb.union(entities[k].getGlobalBounds());else aabb.copyFrom(entities[k].getGlobalBounds());
    }

    aabb.update();

    if (this.locationEnabled) {
      let pdv = CoMath.createVec3();
      pdv.subVecsTo(fixV3, aabb.center);
      aabb.reset();

      for (let k = 0; k < entities.length; ++k) {
        let pv = entities[k].getPosition();
        pv.addBy(pdv);
        entities[k].setPosition(pv);
        entities[k].update();
        if (k > 0) aabb.union(entities[k].getGlobalBounds());else aabb.copyFrom(entities[k].getGlobalBounds());
      }

      aabb.update();
    }
  }

  getSizeScale() {
    return this.m_sizeScale;
  }

}

exports.EntityLayouter = EntityLayouter;

/***/ }),

/***/ "79da":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const VoxRScene_1 = __webpack_require__("d1de");

const VoxEntity_1 = __webpack_require__("9b53");

const ImageResLoader_1 = __importDefault(__webpack_require__("4620"));

const VoxMaterial_1 = __webpack_require__("0efa"); // declare var CoMath: ICoMath;

/**
 * cospace renderer
 */


class DsrdImageViewer {
  constructor() {
    this.m_rscene = null;
    this.m_imgViewEntity = null;
    this.m_imageAlpha = 1.0;
    this.m_imageFakeAlpha = 0.2;
    this.m_imageVisible = true;
    this.m_viewImageUrl = "static/assets/modules/apple_01/mini.jpg";
    this.m_imgResLoader = new ImageResLoader_1.default();
    this.m_imgLoaded = true;
    this.m_imgUrls = [];
    this.m_imgTex = null;
    this.m_imgTexDelay = 0;
    this.m_rsceneCamVer = -10;
    this.m_material = null;
    this.debugDev = true;
  }

  initialize(rscene) {
    rscene.updateCamera();
    this.m_rscene = rscene;
    this.m_rsceneCamVer = this.m_rscene.getCamera().version;
    let delay = 30;
    this.m_rscene.addEventListener(VoxRScene_1.MouseEvent.MOUSE_DOUBLE_CLICK, this, evt => {
      if (this.m_imageAlpha > this.m_imageFakeAlpha) {
        this.setViewImageAlpha(this.m_imageFakeAlpha);
      } else {
        this.setViewImageAlpha(1.0);
      }
    });
    this.m_rscene.addEventListener(VoxRScene_1.EventBase.ENTER_FRAME, this, evt => {
      // console.log("...");
      const cam = this.m_rscene.getCamera();

      if (this.m_rsceneCamVer != cam.version) {
        this.m_rsceneCamVer = cam.version;
        this.setViewImageAlpha(this.m_imageFakeAlpha);
      }

      if (delay > 0) {
        delay--;

        if (delay < 1) {
          delay = 30; // console.log("this.m_imgLoaded: ", this.m_imgLoaded, this.m_imgUrls.length);

          if (this.m_imgLoaded) {
            if (this.m_imgUrls.length > 0) {
              this.setViewImageUrl(this.m_imgUrls.shift());
            }
          }
        }
      }

      if (this.m_imgTex != null) {
        console.log("deferred tex res AAA !!!");

        if (this.m_imgTex.isGpuEnabled()) {
          if (this.m_imgTexDelay > 0) {
            this.m_imgTexDelay--;

            if (this.m_imgTexDelay < 1) {
              console.log("deferred tex alpha changed !!!");
              this.setViewImageAlpha(this.m_imageAlpha);
              this.m_imgTex = null;
            }
          }
        }
      }
    });
  } // run(): void {}


  filterUrl(purl) {
    // let host = URLFilter.getHostUrl("9090");
    // if (this.debugDev) {
    // 	host = "";
    // }
    // if (purl.indexOf("http:") < 0 && purl.indexOf("https:") < 0) {
    // 	purl = host + purl;
    // }
    return purl;
  }

  setViewImageUrls(urls) {
    if (urls === null || urls === undefined) {
      urls = [];
    }

    this.m_imgUrls = urls;
  }

  setViewImageUrl(url, show = false, imgAlpha = 1.0) {
    console.log("this.setViewImageUrl(), url: ", url);

    if (url != "") {
      this.m_imageAlpha = imgAlpha;
      console.log("this.setViewImageUrl(), ready load a new img B.");

      if (this.m_imgViewEntity != null) {
        console.log("this.setViewImageUrl(), ready load a new img C.");
        console.log("url A: ", this.m_viewImageUrl);
        console.log("url B: ", url);

        if (this.m_viewImageUrl != url) {
          console.log("this.setViewImageUrl(), ready load a new img.");

          if (this.m_imgLoaded) {
            this.m_viewImageUrl = url;
            this.m_imgLoaded = false;
            this.m_imgResLoader.load(this.filterUrl(url), (img, imgUrl) => {
              let tex = this.m_rscene.textureBlock.createImageTex2D();
              tex.flipY = true;
              tex.setDataFromImage(img);
              console.log("load a new tex res from an image.test01."); // this.m_imgViewEntity.setAlpha(this.m_imageAlpha);

              this.m_imgViewEntity.setTextureList([tex]);
              this.m_imgViewEntity.updateMaterialToGpu();
              this.m_imgLoaded = true;
              this.m_imgTex = tex;
              this.m_imgTexDelay = 5;
            });
          } else {
            this.m_imgUrls.push(url);
          }
        }
      } else {
        this.m_viewImageUrl = url;
        this.initImgViewer();
      }
    }
  }

  setViewImageFakeAlpha(alpha) {
    this.m_imageFakeAlpha = alpha;
  }

  setViewImageAlpha(alpha) {
    this.m_imageAlpha = alpha;

    if (this.m_material != null) {
      this.m_material.setAlpha(this.m_imageAlpha);
    }
  }

  getViewImageAlpha() {
    return this.m_imageAlpha;
  }

  setViewImageVisible(v) {
    this.m_imageVisible = v;

    if (this.m_imgViewEntity != null) {
      this.m_imgViewEntity.setVisible(v);
    }
  }

  getViewImageVisible() {
    return this.m_imageVisible;
  }

  initImgViewer() {
    if (this.m_imgViewEntity == null) {
      console.log("this.initImgViewer(), this.m_viewImageUrl: ", this.m_viewImageUrl);
      this.m_imgResLoader.load(this.filterUrl(this.m_viewImageUrl), (img, imgUrl) => {
        let tex = this.m_rscene.textureBlock.createImageTex2D();
        tex.flipY = true;
        tex.setDataFromImage(img);
        let material = VoxMaterial_1.VoxMaterial.createDefaultMaterial(false);
        material.fixAlignScreen = true;
        material.setAlpha(this.m_imageAlpha);
        material.setTextureList([tex]);
        material.initializeByCodeBuf(true);
        this.m_material = material;
        this.m_imgViewEntity = VoxEntity_1.VoxEntity.createFixScreenPlane(-1, -1, 2.0, 2.0, material, true);
        this.m_imgViewEntity.setRenderState(VoxRScene_1.RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        this.m_imgViewEntity.setVisible(this.m_imageVisible);
        this.m_rscene.addEntity(this.m_imgViewEntity, 1);
      });
    }
  }

}

exports.DsrdImageViewer = DsrdImageViewer;

/***/ }),

/***/ "7aa4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class URLFilter {
  static getDomain(url) {
    var urlReg = /http:\/\/([^\/]+)/i;
    let domain = url.match(urlReg);
    return domain != null && domain.length > 0 ? domain[0] : "";
  }

  static getHostUrl(port, end = "/") {
    let host = location.href;
    let domain = URLFilter.getDomain(host);
    let nsList = domain.split(":");
    host = nsList[0] + ":" + nsList[1];
    return port ? host + ":" + port + "/" : domain + end;
  }

  static isEnabled() {
    let hostUrl = window.location.href;
    return hostUrl.indexOf(".artvily.com") > 0;
  }

  static filterUrl(url) {
    if (url.indexOf("blob:") < 0) {
      let hostUrl = window.location.href;

      if (hostUrl.indexOf(".artvily.") > 0) {
        hostUrl = "http://www.artvily.com:9090/";
        url = hostUrl + url;
      }
    }

    return url;
  }

  static getFileName(url, lowerCase = false, force = false) {
    if (url.indexOf("blob:") < 0 || force) {
      let i = url.lastIndexOf("/");

      if (i < 0) {
        return "";
      }

      let j = url.indexOf(".", i);

      if (j < 0) {
        return "";
      }

      if (i + 2 < j) {
        let str = url.slice(i + 1, j);

        if (lowerCase) {
          return str.toLocaleLowerCase();
        }

        return str;
      }
    }

    return "";
  }

  static getFileNameAndSuffixName(url, lowerCase = false, force = false) {
    if (url.indexOf("blob:") < 0 || force) {
      let i = url.lastIndexOf("/");
      let j = url.indexOf(".", i);

      if (j < 0) {
        return "";
      }

      let str = url.slice(i + 1);

      if (lowerCase) {
        return str.toLocaleLowerCase();
      }

      return str;
    }

    return "";
  }

  static getFileSuffixName(url, lowerCase = false, force = false) {
    if (url.indexOf("blob:") < 0 || force) {
      let i = url.lastIndexOf("/");
      let j = url.indexOf(".", i);

      if (j < 0) {
        return "";
      }

      let str = url.slice(j + 1);

      if (lowerCase) {
        return str.toLocaleLowerCase();
      }

      return str;
    }

    return "";
  }

}

exports.default = URLFilter;

/***/ }),

/***/ "7c62":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CoSpaceAppData_1 = __webpack_require__("3347");

const CoModuleLoader_1 = __webpack_require__("2a2b");

class CoDataModule {
  constructor() {
    this.m_init = true;
    this.m_sysIniting = true;
    this.m_initInsFlag = true;
    this.verTool = null;
    this.m_initCalls = [];
  }
  /**
   * 初始化
   * @param sysInitCallback the default value is null
   * @param urlChecker the default value is null
   * @param deferredInit the default value is false
   */


  initialize(sysInitCallback = null, deferredInit = false) {
    if (this.m_init) {
      this.m_init = false;
      this.m_sysInitCallback = sysInitCallback;
      this.m_deferredInit = deferredInit; // let dracoModuleParam = new TaskCodeModuleParam("static/cospace/modules/draco/ModuleDracoGeomParser.umd.js", ModuleNS.dracoParser, ModuleFileType.JS);
      // dracoModuleParam.params = ["static/cospace/modules/dracoLib/"];

      let modules = [{
        url: "static/cospace/core/coapp/CoSpaceApp.umd.js",
        name: CoSpaceAppData_1.CoModuleNS.coSpaceApp,
        type: CoSpaceAppData_1.CoModuleFileType.JS
      }, {
        url: "static/cospace/core/code/ThreadCore.umd.js",
        name: CoSpaceAppData_1.CoModuleNS.threadCore,
        type: CoSpaceAppData_1.CoModuleFileType.JS
      }, {
        url: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js",
        name: CoSpaceAppData_1.CoModuleNS.ctmParser,
        type: CoSpaceAppData_1.CoModuleFileType.JS
      }, {
        url: "static/cospace/modules/obj/ModuleOBJGeomParser.umd.js",
        name: CoSpaceAppData_1.CoModuleNS.objParser,
        type: CoSpaceAppData_1.CoModuleFileType.JS
      }, {
        url: "static/cospace/modules/png/ModulePNGParser.umd.js",
        name: CoSpaceAppData_1.CoModuleNS.pngParser,
        type: CoSpaceAppData_1.CoModuleFileType.JS
      }, {
        url: "static/cospace/modules/fbxFast/ModuleFBXGeomFastParser.umd.js",
        name: CoSpaceAppData_1.CoModuleNS.fbxFastParser,
        type: CoSpaceAppData_1.CoModuleFileType.JS
      }, {
        url: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js",
        name: CoSpaceAppData_1.CoModuleNS.dracoParser,
        type: CoSpaceAppData_1.CoModuleFileType.JS,
        params: ["static/cospace/modules/dracoLib/"]
      }];
      this.m_modules = modules; // 初始化数据协同中心

      let dependencyGraphObj = {
        nodes: [{
          uniqueName: "dracoGeomParser",
          path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.js"
        }, {
          uniqueName: "dracoWasmWrapper",
          path: "static/cospace/modules/dracoLib/w2.js"
        }, {
          uniqueName: "ctmGeomParser",
          path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js"
        }],
        maps: [{
          uniqueName: "dracoGeomParser",
          includes: [1]
        } // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
        ]
      };
      this.m_dependencyGraphObj = dependencyGraphObj;
      let loader = new CoModuleLoader_1.CoModuleLoader(1, null, this.verTool);

      if (this.verTool) {
        loader.forceFiltering = this.verTool.forceFiltering;
        console.log("this.verTool.forceFiltering: ", this.verTool.forceFiltering);
      }

      let urlChecker = loader.getUrlChecker();

      if (urlChecker) {
        for (let i = 0; i < modules.length; ++i) {
          modules[i].url = urlChecker(modules[i].url);
        }

        let nodes = dependencyGraphObj.nodes;

        for (let i = 0; i < nodes.length; ++i) {
          nodes[i].path = urlChecker(nodes[i].path);
        }
      } // if (this.verTool) {
      // 	for (let i = 0; i < modules.length; ++i) {
      // 		modules[i].url = this.verTool.filterUrl(modules[i].url);
      // 		console.log("VVVVVVV PP0 VVVVVV modules[i].url: ", modules[i].url);
      // 	}
      // 	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      // 	let nodes = (dependencyGraphObj as any).nodes;
      // 	for (let i = 0; i < nodes.length; ++i) {
      // 		nodes[i].path = this.verTool.filterUrl(nodes[i].path);
      // 		console.log("VVVVVVV PP1 VVVVVV nodes[i].path: ", nodes[i].path);
      // 	}
      // }


      if (!deferredInit) {
        this.loadSys();
      }
    }
  }

  loadSys() {
    if (this.m_sysIniting) {
      new CoModuleLoader_1.CoModuleLoader(1, () => {
        this.initCoSpaceSys();
      }).load(this.m_modules[0].url);
      this.m_sysIniting = false;
    }
  }
  /**
   * 注意: 不建议过多使用这个函数,因为回调函数不安全如果是lambda表达式则由性能问题。
   * 立即获得CPU侧的数据单元实例, 但是数据单元中的数据可能是空的, 因为数据获取的操作实际是异步的。
   * 需要通过 isCpuPhase() 或者 isGpuPhase() 等函数来判定具体数据情况
   * @param url 数据资源url
   * @param dataFormat 数据资源类型
   * @param callback 数据资源接收回调函数, 其值建议为lambda函数表达式
   * @param immediate 是否立即返回数据, 默认是false
   * @returns 数据单元实例，用户只能访问不能更改这个实例内部的数据状态，如果必要则可以申请复制一份
   */


  getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate) {
    if (this.coappIns != null) {
      let unit = this.coappIns.getCPUDataByUrlAndCallback(url, dataFormat, callback, immediate);

      if (this.m_deferredInit) {
        if (this.m_initInsFlag) {
          this.m_initInsFlag = false;
          let modules = this.m_modules;
          this.coappIns.initialize(3, modules[1].url, true);
        }
      }

      return unit;
    }

    return null;
  }

  deferredInit(callback) {
    if (this.coappIns == null) {
      this.m_initCalls.push(callback);
      this.loadSys();
    } else if (callback != null) {
      callback();
    }
  }

  initCoSpaceSys() {
    if (this.coappIns == null && typeof CoSpaceApp !== "undefined") {
      let coappIns = CoSpaceApp.createInstance();
      let modules = this.m_modules;
      let jsonStr = JSON.stringify(this.m_dependencyGraphObj);
      coappIns.setThreadDependencyGraphJsonString(jsonStr);
      coappIns.setTaskModuleParams(modules);

      if (!this.m_deferredInit) {
        coappIns.initialize(3, modules[1].url, true);
      }

      let t = this;
      t.coappIns = coappIns;

      for (let i = 0; i < this.m_initCalls.length; ++i) {
        if (this.m_initCalls[i] != null) {
          this.m_initCalls[i]();
        }
      }

      this.m_initCalls = [];
    }

    if (this.m_sysInitCallback != null) {
      this.m_sysInitCallback();
    }

    this.m_sysInitCallback = null;
  }

  destroy() {}

}

exports.CoDataModule = CoDataModule;
exports.default = CoDataModule;

/***/ }),

/***/ "7d28":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class UserEditEvent {}

UserEditEvent.EDIT_BEGIN = 20001;
UserEditEvent.EDIT_END = 20002;
exports.UserEditEvent = UserEditEvent;

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

/***/ "8ccd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "9b53":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5");

class T_CoEntity {
  constructor() {
    this.m_init = true;
  }

  initialize(callback = null, url = "") {
    this.m_init = !this.isEnabled();

    if (this.m_init) {
      this.m_init = false;

      if (url == "" || url === undefined) {
        url = "static/cospace/coentity/CoEntity.umd.min.js";
      }

      new ModuleLoader_1.ModuleLoader(1, () => {
        if (callback != null && this.isEnabled()) callback([url]);
      }).load(url);
      return true;
    }

    return false;
  }

  isEnabled() {
    return typeof CoEntity !== "undefined" && typeof CoRScene !== "undefined";
  }
  /**
   * @param model geometry model data
   * @param material IRenderMaterial instance, the default value is null.
   * @param vbWhole vtx buffer is whole data, or not, the default is false.
   */


  createDataMeshFromModel(model, material, vbWhole) {
    return CoEntity.createDataMeshFromModel(model, material, vbWhole);
  }
  /**
   * @param model geometry model data
   * @param pmaterial IRenderMaterial instance, the default is null.
   * @param texEnabled texture enabled in the material, the default value is true.
   */


  createDisplayEntityFromModel(model, pmaterial, texEnabled) {
    return CoEntity.createDisplayEntityFromModel(model, pmaterial, texEnabled);
  }
  /**
   * @param beginV line begin position
   * @param endV line begin position
   * @param color line color, the default value is null
   */


  createLine(beginV, endV, color = null) {
    return CoEntity.createLine(beginV, endV, color);
  }

  createFreeAxis3DEntity(minV, maxV) {
    return CoEntity.createFreeAxis3DEntity(minV, maxV);
  }
  /**
   * @param size th default value is 100.0
   */


  createAxis3DEntity(size) {
    return CoEntity.createAxis3DEntity(size);
  }
  /**
   * @param model IDataMesh instance
   * @param material IRenderMaterial instance
   * @param texEnabled use texture yes or no, the default value is false
   */


  createDisplayEntityWithDataMesh(mesh, material, texEnabled) {
    return CoEntity.createDisplayEntityWithDataMesh(mesh, material, texEnabled);
  }

  createDisplayEntity() {
    return CoEntity.createDisplayEntity();
  }

  createMouseEventEntity() {
    return CoEntity.createMouseEventEntity();
  }

  createBoundsEntity() {
    return CoEntity.createBoundsEntity();
  }
  /**
   * create a cross axis randerable entity
   * @param size the default value is 100
   */


  createCrossAxis3DEntity(size) {
    return CoEntity.createCrossAxis3DEntity(size);
  }

  createDisplayEntityContainer() {
    return CoEntity.createDisplayEntityContainer();
  }
  /**
   * @param minX the default value is -1.0
   * @param minY the default value is -1.0
   * @param width the default value is 2.0
   * @param height the default value is 2.0
   * @returns a plane entity, it is fixed the screen, it is parallel with xoy plane
   */


  createFixScreenPlane(minX = -1.0, minY = -1.0, width = 2.0, height = 2.0, material = null, texEnabled = false) {
    return CoEntity.createFixScreenPlane(minX, minY, width, height, material, texEnabled);
  }

  createXOYPlane(minX, minY, width, height, material = null, texEnabled = false) {
    return CoEntity.createXOYPlane(minX, minY, width, height, material, texEnabled);
  }

  createXOZPlane(minX, minZ, width, long, material = null, texEnabled = false) {
    return CoEntity.createXOZPlane(minX, minZ, width, long, material, texEnabled);
  }

  createYOZPlane(minY, minZ, height, long, material = null, texEnabled = false) {
    return CoEntity.createYOZPlane(minY, minZ, height, long, material, texEnabled);
  }

  createCube(size, material = null, texEnabled = false) {
    return CoEntity.createCube(size, material, texEnabled);
  }

  createBox(minV, maxV, material = null, texEnabled = false) {
    return CoEntity.createBox(minV, maxV, material, texEnabled);
  }

  createSphere(radius, longitudeNumSegments = 20, latitudeNumSegments = 20, material = null, texEnabled = false, doubleTriFaceEnabled = false) {
    return CoEntity.createSphere(radius, longitudeNumSegments, latitudeNumSegments, material, texEnabled, doubleTriFaceEnabled);
  }
  /**
   * @param radius cone radius
   * @param height cone height
   * @param longitudeNumSegments the default value is 20
   * @param material the default value is null
   * @param texEnabled the default value is false
   * @param alignYRatio the default value is -0.5
   * @returns a cone entity
   */


  createCone(radius, height, longitudeNumSegments = 20, material = null, texEnabled = false, alignYRatio = -0.5) {
    return CoEntity.createCone(radius, height, longitudeNumSegments, material, texEnabled, alignYRatio);
  }
  /**
   * @param radius cylinder radius
   * @param height cylinder height
   * @param longitudeNumSegments the default value is 20
   * @param material the default value is null
   * @param texEnabled the default value is false
   * @param uvType the default value is 1
   * @param alignYRatio the default value is -0.5
   * @returns a cylinder entity
   */


  createCylinder(radius, height, longitudeNumSegments = 20, material = null, texEnabled = false, uvType = 1, alignYRatio = -0.5) {
    return CoEntity.createCylinder(radius, height, longitudeNumSegments, material, texEnabled, uvType, alignYRatio);
  }
  /**
   * @param radius tube radius
   * @param long tube long
   * @param longitudeNumSegments the default value is 20
   * @param latitudeNumSegments the default value is 1
   * @param axisType 0: vertical to x-axis, 1: vertical to y-axis, 2: vertical to z-axis, the default value is 0
   * @param material the default value is null
   * @param texEnabled the default value is false
   * @param uvType the default value is 1
   * @param alignYRatio the default value is -0.5
   * @returns a tube entity
   */


  createTube(radius, long, longitudeNumSegments = 20, latitudeNumSegments = 1, axisType = 0, material = null, texEnabled = false, uvType = 1, alignRatio = -0.5) {
    return CoEntity.createTube(radius, long, longitudeNumSegments, latitudeNumSegments, axisType, material, texEnabled, uvType, alignRatio);
  }
  /**
   * @param ringRadius the default value is 200
   * @param axisRadius the default value is 50
   * @param longitudeNumSegments the default value is 30
   * @param latitudeNumSegments the default value is 20
   * @param axisType 0: vertical to x-axis, 1: vertical to y-axis, 2: vertical to z-axis, the default value is 0
   * @param material the default value is null
   * @param texEnabled the default value is false
   * @param uvType the default value is 1
   * @param alignYRatio the default value is -0.5
   * @returns a torus entity
   */


  createTorus(radius, axisRadius, longitudeNumSegments = 20, latitudeNumSegments = 1, axisType = 0, material = null, texEnabled = false, uvType = 1, alignRatio = -0.5) {
    return CoEntity.createTorus(radius, axisRadius, longitudeNumSegments, latitudeNumSegments, axisType, material, texEnabled, uvType, alignRatio);
  }

}

const VoxEntity = new T_CoEntity();
exports.VoxEntity = VoxEntity;

/***/ }),

/***/ "c333":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "c75a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CoModuleLoader_1 = __webpack_require__("2a2b");

class PostOutline {
  constructor(rscene, verTool = null) {
    this.m_rscene = rscene;
    let url = "static/cospace/renderEffect/occPostOutline/OccPostOutlineModule.umd.js";
    new CoModuleLoader_1.CoModuleLoader(1, null, verTool).setCallback(() => {
      this.m_postOutline = OccPostOutlineModule.create();
      this.initOutline();
      this.m_rscene.appendRenderNode(this);
    }).load(url);
  }

  initOutline() {
    this.m_postOutline.initialize(this.m_rscene, 0, [0]);
    this.m_postOutline.setFBOSizeScaleRatio(0.5);
    this.m_postOutline.setRGB3f(0.0, 1.0, 0.0);
    this.m_postOutline.setOutlineDensity(2.0);
    this.m_postOutline.setOcclusionDensity(0.2);
  }

  select(targets) {
    if (this.m_postOutline != null) {
      this.m_postOutline.setTargetList(targets);
    }
  }

  deselect() {
    if (this.m_postOutline != null) {
      this.m_postOutline.setTargetList(null);
    }

    console.log("post outline deselect() ...");
  }

  render() {
    if (this.m_postOutline != null) {
      // console.log("post outline getTargetList(): ",this.m_postOutline.getTargetList());
      this.m_postOutline.drawBegin();
      this.m_postOutline.draw();
      this.m_postOutline.drawEnd();
    }
  }

}

exports.PostOutline = PostOutline;

/***/ }),

/***/ "d07b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "d1de":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5");

const VoxRenderer_1 = __webpack_require__("dab7");

var RendererDevice = null;
exports.RendererDevice = RendererDevice;
var SelectionEvent = null;
exports.SelectionEvent = SelectionEvent;
var ProgressDataEvent = null;
exports.ProgressDataEvent = ProgressDataEvent;
var MouseEvent = null;
exports.MouseEvent = MouseEvent;
var EventBase = null;
exports.EventBase = EventBase;
var RendererState = null;
exports.RendererState = RendererState;
var TextureConst = null;
exports.TextureConst = TextureConst;
var Keyboard = null;
exports.Keyboard = Keyboard;
var KeyboardEvent = null;
exports.KeyboardEvent = KeyboardEvent;
var RenderDrawMode = null;
exports.RenderDrawMode = RenderDrawMode;
var CullFaceMode = null;
exports.CullFaceMode = CullFaceMode;
var DepthTestMode = null;
exports.DepthTestMode = DepthTestMode;
var RenderBlendMode = null;
exports.RenderBlendMode = RenderBlendMode;
var GLStencilFunc = null;
exports.GLStencilFunc = GLStencilFunc;
var GLStencilOp = null;
exports.GLStencilOp = GLStencilOp;
var GLBlendMode = null;
exports.GLBlendMode = GLBlendMode;
var GLBlendEquation = null;
exports.GLBlendEquation = GLBlendEquation;

class T_CoRScene {
  constructor() {
    this.m_init = true;
  }

  init() {
    const RC = CoRScene;
    const RD = CoRenderer;

    if (typeof RC !== "undefined") {
      exports.RendererDevice = RendererDevice = RC.RendererDevice;
      exports.SelectionEvent = SelectionEvent = RC.SelectionEvent;
      exports.ProgressDataEvent = ProgressDataEvent = RC.ProgressDataEvent;
      exports.EventBase = EventBase = RC.EventBase;
      exports.MouseEvent = MouseEvent = RC.MouseEvent;
      exports.RendererState = RendererState = RC.RendererState;
      exports.TextureConst = TextureConst = RC.TextureConst;
      exports.Keyboard = Keyboard = RC.Keyboard;
      exports.KeyboardEvent = KeyboardEvent = RC.KeyboardEvent;
      exports.RenderDrawMode = RenderDrawMode = RD.RenderDrawMode;
      exports.CullFaceMode = CullFaceMode = RD.CullFaceMode;
      exports.DepthTestMode = DepthTestMode = RD.DepthTestMode;
      exports.RenderBlendMode = RenderBlendMode = RD.RenderBlendMode;
      exports.GLStencilFunc = GLStencilFunc = RD.GLStencilFunc;
      exports.GLStencilOp = GLStencilOp = RD.GLStencilOp;
      exports.GLBlendMode = GLBlendMode = RD.GLBlendMode;
      exports.GLBlendEquation = GLBlendEquation = RD.GLBlendEquation;
    }
  }

  initialize(callback = null, url = "") {
    this.m_init = !this.isEnabled();

    if (!this.m_init) {
      VoxRenderer_1.VoxRenderer.initialize();
      this.init();
    }

    if (this.m_init) {
      this.m_init = false;
      let flag = false;
      let total = 0;
      let urlRenderer = "";
      flag = VoxRenderer_1.VoxRenderer.initialize(urls => {
        urlRenderer = urls[0];
        total++;

        if (total > 1) {
          if (callback != null && this.isEnabled()) callback([urlRenderer, url]);
        }
      });

      if (url == "" || url === undefined) {
        url = "static/cospace/engine/rscene/CoRScene.umd.min.js";
      }

      new ModuleLoader_1.ModuleLoader(1, () => {
        VoxRenderer_1.VoxRenderer.initialize();
        this.init();

        if (flag) {
          total++;

          if (total > 1) {
            if (callback != null && this.isEnabled()) callback([urlRenderer, url]);
          }
        } else {
          if (callback != null && typeof CoRScene !== "undefined") callback([url]);
        }
      }).load(url);
      return true;
    }

    return false;
  }

  get RendererDevice() {
    return CoRScene.RendererDevice;
  }

  get RendererState() {
    return CoRScene.RendererState;
  }

  get RenderDrawMode() {
    return CoRScene.RenderDrawMode;
  }

  get VtxBufConst() {
    return CoRScene.VtxBufConst;
  }

  get TextureConst() {
    return CoRScene.TextureConst;
  }

  get Vector3D() {
    return CoRScene.Vector3D;
  }

  get MouseEvent() {
    return CoRScene.MouseEvent;
  }

  get EventBase() {
    return CoRScene.EventBase;
  }

  get SelectionEvent() {
    return CoRScene.SelectionEvent;
  }

  get ProgressDataEvent() {
    return CoRScene.ProgressDataEvent;
  }

  get KeyboardEvent() {
    return CoRScene.KeyboardEvent;
  }

  get Keyboard() {
    return CoRScene.Keyboard;
  }

  get ShaderCodeUUID() {
    return CoRScene.ShaderCodeUUID;
  }

  get MaterialContextParam() {
    return CoRScene.MaterialContextParam;
  }

  get MaterialPipeType() {
    return CoRScene.MaterialPipeType;
  }

  createSelectionEvent() {
    return CoRScene.createSelectionEvent();
  }

  createProgressDataEvent() {
    return CoRScene.createProgressDataEvent();
  }
  /**
   * create a Vector3D instance
   * @param px the default vaue is 0.0
   * @param py the default vaue is 0.0
   * @param pz the default vaue is 0.0
   * @param pw the default vaue is 1.0
   */


  createVec3(px, py, pz, pw) {
    return CoRScene.createVec3(px, py, pz, pw);
  }
  /**
   * create a Mattrix4 instance
     * @param pfs32 the default value is null
     * @param index the default value is 0
     */


  createMat4(pfs32, index) {
    return CoRScene.createMat4(pfs32, index);
  }
  /**
   * set Color4 instance
   * @param pr the default vaue is 1.0
   * @param pg the default vaue is 1.0
   * @param pb the default vaue is 1.0
   * @param pa the default vaue is 1.0
   */


  createColor4(pr, pg, pb, pa) {
    return CoRScene.createColor4(pr, pg, pb, pa);
  }

  createAABB() {
    return CoRScene.createAABB();
  }

  applySceneBlock(rsecne) {
    return CoRScene.applySceneBlock(rsecne);
  }
  /**
   * @param div HTMLDivElement instance, the default value is null.
   */


  createRendererSceneParam(div) {
    return CoRScene.createRendererSceneParam(div);
  }
  /**
   * @param rparam IRendererParam instance, the default value is null.
   * @param renderProcessesTotal the default value is 3.
   * @param sceneBlockEnabled the default value is true.
   */


  createRendererScene(rparam, renderProcessesTotal, sceneBlockEnabled) {
    return CoRScene.createRendererScene(rparam, renderProcessesTotal, sceneBlockEnabled);
  }

  setRendererScene(rs) {
    return CoRScene.setRendererScene(rs);
  }

  getRendererScene() {
    return CoRScene.getRendererScene();
  }

  createMouseEvt3DDispatcher() {
    return CoRScene.createMouseEvt3DDispatcher();
  }

  createEventBaseDispatcher() {
    return CoRScene.createEventBaseDispatcher();
  }

  createVtxDrawingInfo() {
    return CoRScene.createVtxDrawingInfo();
  }
  /**
   * build default 3d entity rendering material
   * @param normalEnabled the default value is false
   */


  createDefaultMaterial(normalEnabled) {
    return CoRScene.createDefaultMaterial(normalEnabled);
  }
  /**
   * build 3d line entity rendering material
   * @param dynColorEnabled the default value is false
   */


  createLineMaterial(dynColorEnabled) {
    return CoRScene.createLineMaterial(dynColorEnabled);
  }
  /**
   * build 3d quad line entity rendering material
   * @param dynColorEnabled the default value is false
   */


  createQuadLineMaterial(dynColorEnabled) {
    return CoRScene.createQuadLineMaterial(dynColorEnabled);
  }

  createShaderMaterial(shd_uniqueName) {
    return CoRScene.createShaderMaterial(shd_uniqueName);
  }
  /**
   * @param dcr the value is a IMaterialDecorator instance
   * @returns a Material instance
   */


  createMaterial(dcr) {
    return CoRScene.createMaterial(dcr);
  }

  createDataMesh() {
    return CoRScene.createDataMesh();
  }

  createRawMesh() {
    return CoRScene.createRawMesh();
  }

  createBoundsMesh() {
    return CoRScene.createBoundsMesh();
  }
  /**
   * @param model geometry model data
   * @param material IRenderMaterial instance, the default value is null.
   * @param texEnabled the default value is false;
   */


  createDataMeshFromModel(model, material, texEnabled) {
    return CoRScene.createDataMeshFromModel(model, material, texEnabled);
  }
  /**
   * @param model geometry model data
   * @param pmaterial IRenderMaterial instance, the default is null.
   * @param texEnabled texture enabled in the material, the default is false.
   */


  createDisplayEntityFromModel(model, pmaterial, texEnabled) {
    return CoRScene.createDisplayEntityFromModel(model, pmaterial, texEnabled);
  }
  /**
   * @param minV min position value
   * @param maxV max position value
   * @param transform IROTransform instance, its default is null
   */


  createFreeAxis3DEntity(minV, maxV, transform) {
    return CoRScene.createFreeAxis3DEntity(minV, maxV, transform);
  }
  /**
   * @param size th default value is 100.0
   * @param transform IROTransform instance, its default is null
   */


  createAxis3DEntity(size, transform) {
    return CoRScene.createAxis3DEntity(size, transform);
  }
  /**
   * @param size th default value is 100.0
   * @param transform IROTransform instance, its default is null
   */


  createCrossAxis3DEntity(size, transform) {
    return CoRScene.createCrossAxis3DEntity(size, transform);
  }
  /**
   * @param model IDataMesh instance
   * @param material IRenderMaterial instance.
   * @param texEnabled use texture yes or no, the default is false.
   */


  createDisplayEntityWithDataMesh(mesh, material, texEnabled) {
    return CoRScene.createDisplayEntityWithDataMesh(mesh, material, texEnabled);
  }
  /**
   * @param transform the default value is false
   */


  createDisplayEntity(transform) {
    return CoRScene.createDisplayEntity(transform);
  }
  /**
   * @param transform the default value is false
   */


  createMouseEventEntity(transform) {
    return CoRScene.createMouseEventEntity(transform);
  }
  /**
   * @param transform the default value is false
   */


  createBoundsEntity(transform) {
    return CoRScene.createBoundsEntity(transform);
  }

  createDisplayEntityContainer() {
    return CoRScene.createDisplayEntityContainer();
  }

  creatMaterialContextParam() {
    return CoRScene.creatMaterialContextParam();
  }

  createMaterialContext() {
    return CoRScene.createMaterialContext();
  }
  /**
   * 逆时针转到垂直
   */


  VerticalCCWOnXOY(v) {
    return CoRScene.VerticalCCWOnXOY(v);
  }
  /**
   * 顺时针转到垂直
   */


  VerticalCWOnXOY(v) {
    return CoRScene.VerticalCWOnXOY(v);
  }

  createRendererSceneGraph() {
    return CoRScene.createRendererSceneGraph();
  }

  createEvtNode() {
    return CoRScene.createEvtNode();
  }

  isEnabled() {
    return VoxRenderer_1.VoxRenderer.isEnabled() && typeof CoRScene !== "undefined";
  }

}

const VoxRScene = new T_CoRScene();
exports.VoxRScene = VoxRScene;

/***/ }),

/***/ "d82c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CoSpaceAppData_1 = __webpack_require__("3347");

exports.CoGeomDataType = CoSpaceAppData_1.CoGeomDataType;
exports.CoDataFormat = CoSpaceAppData_1.CoDataFormat;

const CoDataModule_1 = __webpack_require__("7c62");

class CoGeomModelLoader {
  constructor() {
    this.m_loadedCall = null;
    this.m_loadedAllCall = null;
    this.m_loadTotal = 0;
    this.m_loadedTotal = 0;
    this.verTool = null;
  }

  setListener(loadedCallback, loadedAllCallback) {
    this.m_loadedCall = loadedCallback;
    this.m_loadedAllCall = loadedAllCallback;
  }

  load(urls, typeNS = "") {
    CoGeomModelLoader.s_coapp.verTool = this.verTool;

    if (urls != null && urls.length > 0) {
      CoGeomModelLoader.s_coapp.initialize(null, true);
      let purls = urls.slice(0);
      CoGeomModelLoader.s_coapp.deferredInit(() => {
        for (let i = 0; i < purls.length; ++i) {
          this.loadModel(purls[i], typeNS);
        }
      });
    }
  }

  loadWithType(urls, types) {
    CoGeomModelLoader.s_coapp.verTool = this.verTool;

    if (urls != null && urls.length > 0) {
      CoGeomModelLoader.s_coapp.initialize(null, true);
      let purls = urls.slice(0);
      CoGeomModelLoader.s_coapp.deferredInit(() => {
        for (let i = 0; i < purls.length; ++i) {
          this.loadModel(purls[i], types[i]);
        }
      });
    }
  }

  reset() {
    this.m_loadedTotal = 0;
    this.m_loadTotal = 0;
  }

  loadModel(url, typeNS = "") {
    console.log("CoGeomModelLoader::loadModel(), url: ", url);
    let ns = typeNS;

    if (typeNS == "") {
      let k0 = url.lastIndexOf(".") + 1;
      let k1 = url.lastIndexOf("?");
      ns = k1 < 0 ? url.slice(k0) : url.slice(k0, k1);
    }

    ns = ns.toLocaleLowerCase();
    let type = CoSpaceAppData_1.CoDataFormat.Undefined;

    switch (ns) {
      case "obj":
        type = CoSpaceAppData_1.CoDataFormat.OBJ;
        break;

      case "fbx":
        type = CoSpaceAppData_1.CoDataFormat.FBX;
        break;

      case "drc":
        type = CoSpaceAppData_1.CoDataFormat.Draco;
        break;

      case "ctm":
        type = CoSpaceAppData_1.CoDataFormat.CTM;
        break;

      default:
        break;
    }

    if (type != CoSpaceAppData_1.CoDataFormat.Undefined) {
      this.loadGeomModel(url, type);
    } else {
      console.error("Can't support this model data format, url: ", url);
    }
  }

  loadGeomModel(url, format) {
    let ins = CoGeomModelLoader.s_coapp;

    if (ins != null) {
      let unit = ins.getCPUDataByUrlAndCallback(url, format, (unit, status) => {
        if (format != CoSpaceAppData_1.CoDataFormat.FBX) {
          this.loadedModels(unit.data.models, unit.data.transforms, format, unit.url);
          this.m_loadTotal++;
          this.loadedModelFromUnit(unit, status);
        }
      }, true);

      if (format == CoSpaceAppData_1.CoDataFormat.FBX) {
        unit.data.modelReceiver = (models, transforms, index, total) => {
          // console.log("Loaded a fbx model XXX: ", index, ",", total);
          if (index == 0) {
            this.m_loadTotal++;
          }

          this.loadedModels(models, transforms, format, unit.url);
          this.loadedModelFromUnit(unit, 0, index + 1 == total);
        };
      }
    }
  }

  loadedModels(models, transforms, format, url) {
    if (this.m_loadedCall != null) {
      this.m_loadedCall(models, transforms, format, url);
    }
  }

  loadedModelFromUnit(unit, status = 0, flag = true) {
    if (flag) this.m_loadedTotal++;

    if (this.m_loadedTotal >= this.m_loadTotal) {
      let total = this.m_loadedTotal;
      this.reset();
      this.m_loadedAllCall(total, unit.url);
    }
  }

  destroy() {
    this.m_loadedCall = null;
  }

}

CoGeomModelLoader.s_coapp = new CoDataModule_1.CoDataModule();
exports.CoGeomModelLoader = CoGeomModelLoader;

/***/ }),

/***/ "dab7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5");

var RenderDrawMode;
exports.RenderDrawMode = RenderDrawMode;
var CullFaceMode;
exports.CullFaceMode = CullFaceMode;
var DepthTestMode;
exports.DepthTestMode = DepthTestMode;
var RenderBlendMode;
exports.RenderBlendMode = RenderBlendMode;
var GLStencilFunc;
exports.GLStencilFunc = GLStencilFunc;
var GLStencilOp;
exports.GLStencilOp = GLStencilOp;
var GLBlendMode;
exports.GLBlendMode = GLBlendMode;
var GLBlendEquation;
exports.GLBlendEquation = GLBlendEquation;

class T_CoRenderer {
  constructor() {
    this.m_init = true;
  }

  init() {
    if (typeof CoRenderer !== "undefined") {
      exports.RenderDrawMode = RenderDrawMode = CoRenderer.RenderDrawMode;
      exports.CullFaceMode = CullFaceMode = CoRenderer.CullFaceMode;
      exports.DepthTestMode = DepthTestMode = CoRenderer.DepthTestMode;
      exports.RenderBlendMode = RenderBlendMode = CoRenderer.RenderBlendMode;
      exports.GLStencilFunc = GLStencilFunc = CoRenderer.GLStencilFunc;
      exports.GLStencilOp = GLStencilOp = CoRenderer.GLStencilOp;
      exports.GLBlendMode = GLBlendMode = CoRenderer.GLBlendMode;
      exports.GLBlendEquation = GLBlendEquation = CoRenderer.GLBlendEquation;
    }
  }

  initialize(callback = null, url = "") {
    this.init();
    this.m_init = !this.isEnabled();

    if (this.m_init) {
      this.m_init = false;

      if (url == "" || url === undefined) {
        url = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
      }

      new ModuleLoader_1.ModuleLoader(1, () => {
        this.init();
        if (callback != null && this.isEnabled()) callback([url]);
      }).load(url);
      return true;
    }

    return false;
  }

  get RenderDrawMode() {
    return CoRenderer.RenderDrawMode;
  }

  get CullFaceMode() {
    return CoRenderer.CullFaceMode;
  }

  get DepthTestMode() {
    return CoRenderer.DepthTestMode;
  }

  get RenderBlendMode() {
    return CoRenderer.RenderBlendMode;
  }

  get GLStencilFunc() {
    return CoRenderer.GLStencilFunc;
  }

  get GLStencilOp() {
    return CoRenderer.GLStencilOp;
  }

  get GLBlendMode() {
    return CoRenderer.GLBlendMode;
  }

  get GLBlendEquation() {
    return CoRenderer.GLBlendEquation;
  }

  get RendererDevice() {
    return CoRenderer.RendererDevice;
  }

  get RendererState() {
    return CoRenderer.RendererState;
  }

  createRendererInstance() {
    return CoRenderer.createRendererInstance();
  }

  isEnabled() {
    return typeof CoRenderer !== "undefined";
  }

}

const VoxRenderer = new T_CoRenderer();
exports.VoxRenderer = VoxRenderer;

/***/ }),

/***/ "f042":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5");

var OrientationType;
exports.OrientationType = OrientationType;
var MathConst;
exports.MathConst = MathConst;
var Vector3D;
exports.Vector3D = Vector3D;

class T_CoMath {
  constructor() {
    this.m_init = true;
  }

  init() {
    if (this.isEnabled()) {
      exports.OrientationType = OrientationType = CoMath.OrientationType;
      exports.MathConst = MathConst = CoMath.MathConst;
      exports.Vector3D = Vector3D = CoMath.Vector3D;
    }
  }

  initialize(callback = null, url = "") {
    this.init();
    this.m_init = !this.isEnabled();

    if (this.m_init) {
      this.m_init = false;

      if (url == "" || url === undefined) {
        url = "static/cospace/math/CoMath.umd.min.js";
      }

      new ModuleLoader_1.ModuleLoader(1, () => {
        this.init();
        if (callback != null && this.isEnabled()) callback([url]);
      }).load(url);
      return true;
    }

    return false;
  }

  isEnabled() {
    return typeof CoMath !== "undefined";
  }

  get Vector3D() {
    return CoMath.Vector3D;
  }

  get MathConst() {
    return CoMath.MathConst;
  }

  get OrientationType() {
    return CoMath.OrientationType;
  }
  /**
   * create a Vector3D instance
   * @param px the default vaue is 0.0
   * @param py the default vaue is 0.0
   * @param pz the default vaue is 0.0
   * @param pw the default vaue is 1.0
   */


  createVec3(px, py, pz, pw) {
    return CoMath.createVec3(px, py, pz, pw);
  }
  /**
   *
   * @param pfs32 the default value is null
   * @param index the default value is 0
   * @returns IMatrix4 instance
   */


  createMat4(pfs32, index) {
    return CoMath.createMat4(pfs32, index);
  }

  createAABB() {
    return CoMath.createAABB();
  }

  createAABB2D(px, py, pwidth, pheight) {
    return CoMath.createAABB2D(px, py, pwidth, pheight);
  }

  isZero(v) {
    return CoMath.isZero(v);
  }

  isNotZero(v) {
    return CoMath.isNotZero(v);
  }
  /**
   * example:
   *     isGreaterPositiveZero(0.1) is true
   *     isGreaterPositiveZero(0.000000001) is false
   *     isGreaterPositiveZero(-0.1) is false
   * @param v number value
   * @returns a positive number value and its value is greater zero, return true, otherwize false
   */


  isGreaterPositiveZero(v) {
    return CoMath.isGreaterPositiveZero(v);
  }
  /**
   * example:
   *      isLessNegativeZero(-0.1) is true
   *      isLessNegativeZero(-000000001) is false
   *      isLessNegativeZero(0.1) is false
   * @param v number value
   * @returns a negative number value and its value is less zero, return true, otherwise false
   */


  isLessNegativeZero(v) {
    return CoMath.isLessNegativeZero(v);
  }
  /**
   * example:
   * 	isLessPositiveZero(+0.00000001) is true
   *  isLessPositiveZero(-1.3) is true
   *  isLessPositiveZero(1.3) is false
   * @param v number value
   * @returns true or false
   */


  isLessPositiveZero(v) {
    return CoMath.isLessPositiveZero(v);
  }
  /**
   * example:
   * 	isGreaterNegativeZero(-0.00000001) is true
   *  isGreaterNegativeZero(+1.3) is true
   *  isGreaterNegativeZero(-1.3) is false
   * @param v number value
   * @returns true or false
   */


  isGreaterNegativeZero(v) {
    return CoMath.isGreaterNegativeZero(v);
  }

  isPostiveZero(v) {
    return CoMath.isPostiveZero(v);
  }

  isNegativeZero(v) {
    return CoMath.isNegativeZero(v);
  }

  isGreaterRealZero(v) {
    return CoMath.isGreaterRealZero(v);
  }

  isLessRealZero(v) {
    return CoMath.isLessRealZero(v);
  }

}

const VoxMath = new T_CoMath();
exports.VoxMath = VoxMath;

/***/ }),

/***/ "f046":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const PostOutline_1 = __webpack_require__("c75a");

const VoxRScene_1 = __webpack_require__("d1de");

const VoxMath_1 = __webpack_require__("f042");

const VoxEntity_1 = __webpack_require__("9b53");

const CoModelTeamLoader_1 = __webpack_require__("fd42");

const URLFilter_1 = __importDefault(__webpack_require__("7aa4"));

const SceneAccessor_1 = __webpack_require__("36c5");

const DsrdViewerBase_1 = __webpack_require__("39ed");

const DsrdImageViewer_1 = __webpack_require__("79da");

const CoModuleLoader_1 = __webpack_require__("2a2b"); // declare var CoMath: ICoMath;

/**
 * cospace renderer
 */


class DsrdViewer extends DsrdViewerBase_1.DsrdViewerBase {
  constructor() {
    super();
    this.m_viewDiv = null;
    this.m_initCallback = null;
    this.m_zAxisUp = false;
    this.m_debugDev = false;
    this.m_loadingCallback = null;
    this.m_modelDataUrl = "";
    this.m_baseSize = 200.0;
    this.m_forceRot90 = false;
  }

  initialize(div = null, initCallback = null, zAxisUp = false, debugDev = false, forceReleaseEnabled = false) {
    document.oncontextmenu = function (e) {
      e.preventDefault();
    };

    console.log("DsrdViewer::initialize(), forceReleaseEnabled: ", forceReleaseEnabled);
    CoModuleLoader_1.CoModuleLoader.forceReleaseEnabled = forceReleaseEnabled;
    this.m_viewDiv = div;
    this.m_initCallback = initCallback;
    this.m_zAxisUp = zAxisUp;
    this.m_debugDev = debugDev;
    this.loadInfo();
  }
  /**
   * @param fov_angle_degree the default value is 45.0
   * @param near the default value is 10.0
   * @param far the default value is 5000.0
   */


  setCamProjectParam(fov_angle_degree, near, far) {
    if (this.m_rscene) {
      let cam = this.m_rscene.getCamera();
      cam.perspectiveRH(Math.PI * fov_angle_degree / 180.0, cam.getAspect(), near, far);
    }
  }

  updateCamera() {
    if (this.m_rscene) {
      this.m_rscene.updateCamera();
    }
  }

  updateCameraWithF32Arr16(fs32Arr16, updateCamera = true) {
    if (fs32Arr16.length == 16) {
      this.applyCamvs(fs32Arr16, updateCamera);
    }
  }

  getCameraData(posScale, transpose = false) {
    if (this.m_rscene) {
      let cam = this.m_rscene.getCamera();
      let mat = cam.getViewMatrix().clone();
      mat.invert();

      if (transpose) {
        mat.transpose();
      }

      let vs = mat.getLocalFS32().slice(0);
      vs[3] *= posScale;
      vs[7] *= posScale;
      vs[11] *= posScale;
      return vs;
    }

    return null;
  }

  initRenderer() {
    // document.body.style.overflow = "hidden";
    let RD = VoxRScene_1.RendererDevice;
    /**
     * 开启打印输出shader构建的相关信息
     */

    RD.SHADERCODE_TRACE_ENABLED = false;
    RD.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
    let graph = this.m_graph = VoxRScene_1.VoxRScene.createRendererSceneGraph();
    let sizeW = 512;
    let sizeH = 512;
    let zAxisUp = this.m_zAxisUp; // let debugDev: boolean = this.m_debugDev;

    let div = this.m_viewDiv;
    let dpr = window.devicePixelRatio;
    let rparam = graph.createRendererSceneParam(div ? div : this.createDiv(0, 0, sizeW / dpr, sizeH / dpr));
    rparam.autoSyncRenderBufferAndWindowSize = false;
    rparam.syncBgColor = false;
    rparam.setCamProject(45, 10.0, 2000.0);
    rparam.setCamPosition(239.0, -239.0, 239.0);

    if (zAxisUp || div == null) {
      rparam.setCamUpDirect(0.0, 0.0, 1.0);
    } else {
      rparam.setCamUpDirect(0.0, 1.0, 0.0);
    }

    rparam.setAttriAntialias(true);
    this.m_rscene = graph.createScene(rparam);
    this.m_rscene.enableMouseEvent(true);
    VoxRScene_1.VoxRScene.setRendererScene(this.m_rscene);
    let subScene = this.m_rscene.createSubScene(rparam, 3, false);
    subScene.enableMouseEvent(true);
    subScene.setAccessor(new SceneAccessor_1.SceneAccessor());
    this.m_edit3DUIRScene = subScene;
    graph.addScene(this.m_edit3DUIRScene);
    this.m_outline = new PostOutline_1.PostOutline(this.m_rscene, this.m_verTool);
    this.imgViewer = new DsrdImageViewer_1.DsrdImageViewer();
    this.imgViewer.initialize(this.m_rscene);
    this.init3DScene();

    if (this.m_initCallback) {
      this.m_initCallback();
    }
  }

  init3DScene() {
    this.m_modelTexUrl = "static/assets/white.jpg";

    if (this.m_entityContainer == null) {
      this.m_entityContainer = VoxEntity_1.VoxEntity.createDisplayEntityContainer();
      this.m_rscene.addEntity(this.m_entityContainer);
    }

    let debugDev = this.m_debugDev;
    let div = this.m_viewDiv;
    this.m_layouter.locationEnabled = false;
    this.m_debugDev = debugDev;

    if (div && !debugDev) {} else {
      this.m_debugDev = true;
      this.m_teamLoader = new CoModelTeamLoader_1.CoModelTeamLoader();
      this.initModels();
      let imgUrls = ["static/assets/modules/apple_01/mini.jpg", "static/assets/box.jpg"]; // this.imgViewer.setViewImageUrls(imgUrls);

      this.imgViewer.setViewImageUrl(imgUrls[0], true); // this.imgViewer.setViewImageAlpha(0.1);
    } // this.loadModels();

  }

  initModels() {
    this.m_forceRot90 = true;
    let urls = [];
    let types = [];

    for (let i = 0; i < 2; ++i) {
      let purl = "static/assets/modules/apple_01/export_" + i + ".drc";
      urls.push(purl);
      types.push("drc");
    }

    this.initSceneByUrls(urls, types, prog => {
      console.log("models loaded ...");
    }, 200);
  }

  initSceneByUrls(urls, types, loadingCallback, size = 200) {
    this.m_baseSize = size;
    this.m_loadingCallback = loadingCallback;
    let loader = this.m_teamLoader;
    loader.loadWithTypes(urls, types, (models, transforms) => {
      this.m_layouter.layoutReset();

      for (let i = 0; i < models.length; ++i) {
        console.log("VVVVVV models[", i, "].url: ", models[i].url);
        this.createEntity(models[i], transforms != null ? transforms[i] : null, 2.0, models[i].url);
      }

      this.m_modelDataUrl = urls[0] + "." + types[0];
      console.log("XXXXXX initSceneByUrls() this.m_modelDataUrl: ", this.m_modelDataUrl);
      this.fitEntitiesSize();

      if (this.m_loadingCallback) {
        this.m_loadingCallback(1.0);
      }
    });
  }

  setForceRotate90(force) {
    this.m_forceRot90 = force;
  }

  fitEntitiesSize(forceRot90 = false) {
    forceRot90 = forceRot90 || this.m_forceRot90;
    this.m_layouter.layoutUpdate(this.m_baseSize, VoxMath_1.VoxMath.createVec3());
    let container = this.m_entityContainer;
    let format = URLFilter_1.default.getFileSuffixName(this.m_modelDataUrl, true, true);
    console.log("XXXXXX fitEntitiesSize() this.m_modelDataUrl: ", this.m_modelDataUrl);
    console.log("format: ", format);

    switch (format) {
      case "obj":
        container.setRotationXYZ(90, 0, 0);
        break;

      default:
        if (forceRot90) {
          container.setRotationXYZ(90, 0, 0);
        }

        break;
    }

    container.update();
  }

  applyCamvs(cdvs, updateCamera) {
    if (cdvs == null) {
      cdvs = [0.7071067690849304, -0.40824827551841736, 0.5773502588272095, 2.390000104904175, 0.7071067690849304, 0.40824827551841736, -0.5773502588272095, -2.390000104904175, 0.0, 0.8164965510368347, 0.5773502588272095, 2.390000104904175, 0, 0, 0, 1];
    }

    let mat4 = VoxMath_1.VoxMath.createMat4(new Float32Array(cdvs));
    mat4.transpose();
    let camvs = mat4.getLocalFS32();
    let i = 0; // let vx = new Vector3D(camvs[i], camvs[i+1], camvs[i+2], camvs[i+3]);

    i = 4;
    let vy = VoxMath_1.VoxMath.createVec3(camvs[i], camvs[i + 1], camvs[i + 2], camvs[i + 3]); // i = 8;
    // let vz = new Vector3D(camvs[i], camvs[i+1], camvs[i+2], camvs[i+3]);

    i = 12;
    let pos = VoxMath_1.VoxMath.createVec3(camvs[i], camvs[i + 1], camvs[i + 2]); // console.log("		  vy: ", vy);

    let cam = this.m_rscene.getCamera(); // console.log("cam.getUV(): ", cam.getUV());
    // console.log("");
    // console.log("cam.getNV(): ", cam.getNV());
    // vz.negate();
    // console.log("		  vz: ", vz);
    // console.log("		 pos: ", pos);

    if (pos.getLength() > 0.001) {
      let camPos = pos.clone().scaleBy(100.0);
      cam.lookAtRH(camPos, VoxMath_1.VoxMath.createVec3(), vy);

      if (updateCamera) {
        cam.update();
      }
    }
  }

}

exports.DsrdViewer = DsrdViewer;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("f046");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ }),

/***/ "fd42":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CoModuleLoader_1 = __webpack_require__("2a2b");

exports.CoModuleVersion = CoModuleLoader_1.CoModuleVersion;

const CoGeomModelLoader_1 = __webpack_require__("d82c");

exports.CoGeomDataType = CoGeomModelLoader_1.CoGeomDataType;

class LoadingTeam {
  constructor(urls) {
    this.m_map = new Map();
    this.m_total = 0;
    this.m_loadedTotal = 0;
    this.types = null;
    this.models = [];
    this.transforms = [];
    this.init(urls);
  }

  init(urls) {
    this.urls = urls;
    this.m_total = urls.length;

    for (let i = 0; i < this.m_total; ++i) {
      this.m_map.set(urls[i], 0);
    }
  }

  testWithUrl(url) {
    let flag = false;

    if (this.m_map.has(url) && this.m_map.get(url) < 1) {
      this.m_map.set(url, 1);
      this.m_loadedTotal++;
      flag = this.m_loadedTotal >= this.m_total;

      if (flag) {
        let callback = this.callback;
        callback(this.models, this.transforms);
        this.callback = null;
      }
    }

    return flag;
  }

}

class CoModelTeamLoader {
  constructor() {
    this.m_modelLoader = new CoGeomModelLoader_1.CoGeomModelLoader();
    this.m_team = null;
    this.m_teams = [];
    this.m_enabled = true;
    this.verTool = null;
    this.initialize();
  }

  initialize() {
    this.m_modelLoader.setListener((models, transforms, format, url) => {
      // console.log("CoModelTeamLoader, loaded model.");
      if (this.m_team != null) {
        for (let i = 0; i < models.length; ++i) {
          if (models[i] != null) {
            models[i].url = url;

            if (models[i].vertices != null) {
              if (transforms) {
                this.m_team.transforms.push(transforms[i]);
              } else {
                this.m_team.transforms.push(null);
              }

              this.m_team.models.push(models[i]);
            }
          }
        }
      }
    }, (total, url) => {
      console.log("CoModelTeamLoader, loaded model all, url: ", url);
      let flag = this.m_team.testWithUrl(url);

      if (flag) {
        this.m_enabled = true;
        this.loadNext();
      }
    });
  }

  loadNext() {
    if (this.m_enabled && this.m_teams.length > 0) {
      let team = this.m_teams.shift();
      this.m_team = team;
      this.m_enabled = false;
      console.log("CoModelTeamLoader, begin load urls: ", team.urls, ", team.types: ", team.types);

      if (team.types) {
        this.m_modelLoader.loadWithType(team.urls, team.types);
      } else {
        this.m_modelLoader.load(team.urls);
      }
    }
  }

  load(urls, callback) {
    this.m_modelLoader.verTool = this.verTool;
    let team = new LoadingTeam(urls);
    team.callback = callback;
    this.m_teams.push(team);
    this.loadNext();
  }

  loadWithTypes(urls, types, callback) {
    this.m_modelLoader.verTool = this.verTool;
    let team = new LoadingTeam(urls);
    team.types = types;
    team.callback = callback;
    this.m_teams.push(team);
    this.loadNext();
  }

}

exports.CoModelTeamLoader = CoModelTeamLoader;

/***/ })

/******/ });