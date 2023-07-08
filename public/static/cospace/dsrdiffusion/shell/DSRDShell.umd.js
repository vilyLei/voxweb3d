(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DSRDShell"] = factory();
	else
		root["DSRDShell"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "06e0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class RTaskData {
  constructor() {
    this.taskid = 0;
    this.version = -1;
    this.phase = "new";
    this.filepath = "";
    this.taskname = "";
    this.success = false;
    this.drcsTotal = 0;
    this.fileName = "";
    this.time = 0;
    this.bgTransparent = false;
    this.miniImgUrl = "";
    this.bigImgUrl = "";
    this.modelLoadStatus = 0;
  }

  reset() {}

  isModelDataLoaded() {
    return this.modelLoadStatus == 2;
  }

  copyFromJson(d) {
    let t = this;
    t.taskid = d.taskid;
    t.version = d.version;
    t.filepath = d.filepath;
    t.taskname = d.taskname;
    t.success = d.success;
    t.drcsTotal = d.drcsTotal;
    t.fileName = d.fileName;
    t.taskid = d.taskid;
    t.taskid = d.taskid;
    this.updateUrl();
  }

  updateUrl() {
    let filepath = this.filepath;
    let suffix = this.bgTransparent ? "png" : "jpg";
    let i = filepath.lastIndexOf("/"); // let imgDirUrl = HTTPUrl.host + filepath.slice(3, i + 1);

    let imgDirUrl = filepath.slice(2, i + 1);
    this.miniImgUrl = imgDirUrl + "bld_rendering_mini." + suffix + "?ver=" + Math.random() + "-" + Math.random() * Date.now();
    this.bigImgUrl = imgDirUrl + "bld_rendering." + suffix + "?ver=" + Math.random() + "-" + Math.random() * Date.now();
    console.log("this.miniImgUrl: ", this.miniImgUrl);
    console.log("this.bigImgUrl: ", this.bigImgUrl);
  }

}

exports.RTaskData = RTaskData;

/***/ }),

/***/ "195d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const SettingDataPanel_1 = __webpack_require__("a7c5");

const DataItemComponent_1 = __webpack_require__("9bbe");

class OutputDataPanel extends SettingDataPanel_1.SettingDataPanel {
  constructor() {
    super();
  }

  getJsonStr(beginStr = "{", endStr = "}") {
    let paramW = this.getItemCompByKeyName("image_width").getParam();
    let paramH = this.getItemCompByKeyName("image_height").getParam();
    let sizes = [paramW.numberValue, paramH.numberValue];
    let jsonStr = `${beginStr}"path":"", "resolution":[${sizes}]`;
    return super.getJsonStr(jsonStr, endStr);
  }

  init(viewerLayer) {
    let params = [];
    let param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "image_width";
    param.name = "图像宽";
    param.numberValue = 512;
    param.inputType = "number";
    param.numberMinValue = 1;
    param.numberMaxValue = 4096;
    param.editEnabled = true;
    param.autoEncoding = false;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "image_height";
    param.name = "图像高";
    param.numberValue = 512;
    param.inputType = "number";
    param.numberMinValue = 1;
    param.numberMaxValue = 4096;
    param.editEnabled = true;
    param.autoEncoding = false;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "bgTransparent";
    param.name = "背景透明";
    param.toBoolean();
    param.booleanValue = false; // param.editEnabled = true;

    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "outputType";
    param.name = "出图类型";
    param.textValue = "single_image";
    param.textContent = "单张图";
    param.toText();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "bgColor";
    param.name = "背景色";
    param.numberValue = 0x1668a;
    param.editEnabled = true;
    param.toColor();
    params.push(param);
    this.m_params = params;
    let container = this.m_container;
    let startX = 45;
    let startY = 60;
    let disY = 60;
    let py = 0;

    for (let i = 0; i < params.length; ++i) {
      let itemComp = new DataItemComponent_1.DataItemComponent();
      itemComp.x = startX;
      itemComp.y = startY + py;
      itemComp.initialize(container, params[i]);
      this.addItemComp(itemComp);
      py += disY;
    }
  }

}

exports.OutputDataPanel = OutputDataPanel;

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

/***/ "22b3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class RenderingSettingItem {
  constructor() {
    this.m_viewerLayer = null;
    this.m_panel = null;
    this.m_areaWidth = 512;
    this.m_areaHeight = 512;
    this.m_selected = false;
    this.m_deselectColors = [0xbdd9e1, 0xaed4df, 0x83c4d7];
    this.m_selectColors = [0x7aacda, 0x4a93d5, 0x3b7bb5];
    this.group = null;
  }

  initialize(viewerLayer, areaWidth, areaHeight, panel) {
    console.log("RenderingSettingItem::initialize()......");
    this.m_viewerLayer = viewerLayer;
    this.m_areaWidth = areaWidth;
    this.m_areaHeight = areaHeight;
    this.m_panel = panel;
    viewerLayer.innerHTML = panel.getName();
    this.initEvent(viewerLayer);
  }

  getPanel() {
    return this.m_panel;
  }

  getName() {
    return this.m_panel.getName();
  }

  getKeyName() {
    return this.m_panel.getKeyName();
  }

  getType() {
    return this.m_panel.getType();
  }

  applyColorAt(i) {
    // console.log("applyColorAt(), this.m_selected: ", this.m_selected);
    let colors = this.m_selected ? this.m_selectColors : this.m_deselectColors;
    this.m_viewerLayer.style.backgroundColor = "#" + colors[i].toString(16);
  }

  initEvent(viewerLayer) {
    viewerLayer.onmouseover = evt => {
      // console.log("mouse over, name: ", this.m_itemData.name);
      this.applyColorAt(1);
    };

    viewerLayer.onmouseout = evt => {
      // console.log("mouse out, name: ", this.m_itemData.name);
      this.applyColorAt(0);
    };

    viewerLayer.onmouseup = evt => {
      // console.log("mouse up, name: ", this.m_itemData.name);
      this.select();
      this.applyColorAt(1);
    };

    viewerLayer.onmousedown = evt => {
      // console.log("mouse down, name: ", this.m_itemData.name);
      this.applyColorAt(2);
    };
  }

  isSelected() {
    return this.m_selected;
  }

  select() {
    let ls = this.group;
    let len = ls.length;

    for (let i = 0; i < len; ++i) {
      if (ls[i].isSelected()) {
        ls[i].deselect();
        break;
      }
    }

    this.m_selected = true;
    this.applyColorAt(0);
    this.m_panel.setVisible(true);
  }

  deselect() {
    this.m_selected = false;
    this.applyColorAt(0);
    this.m_panel.setVisible(false);
  }

}

exports.RenderingSettingItem = RenderingSettingItem;

/***/ }),

/***/ "23ff":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class RTaskInfoViewer {
  constructor() {
    this.taskStatus = 0;
    this.startTime = 0;
    this.rt_phase_times = 0;
    this.rt_phase = "";
  }

  initialize() {}

  reset() {
    this.rt_phase_times = 0;
    this.taskStatus = 0;
    this.startTime = Date.now();
    this.infoDiv = null;
  }

  taskSuccess() {}

  taskFailure() {}

  showSpecInfo(keyStr, times = -1) {
    var div = this.infoDiv;

    if (div != null) {
      if (times >= 0) {
        let flag = times % 3;

        switch (flag) {
          case 0:
            div.innerHTML = keyStr + "&nbsp;.&nbsp;&nbsp;";
            break;

          case 1:
            div.innerHTML = keyStr + "&nbsp;..&nbsp;";
            break;

          default:
            div.innerHTML = keyStr + "&nbsp;...";
            break;
        }
      } else {
        div.innerHTML = keyStr;
      }
    }
  }

  parseSyncRStatuReqInfo(sdo) {// this.parseRenderingReqInfo(sdo)
  }

  parseModelReqInfo(sdo) {
    if (sdo.drcsTotal !== undefined) {
      this.data.drcsTotal = sdo.drcsTotal;
      this.process.updateModel(this.data.drcsTotal);
    }

    this.process.running = true;
  }

  parseRenderingReqInfo(sdo) {
    console.log("parseRenderingReqInfo(), sdo: ", sdo);
    let status = sdo.status;
    var div = this.infoDiv;
    let phase = sdo.phase;

    if (this.rt_phase != phase) {
      this.rt_phase = phase;
      this.rt_phase_times = 0;
    }

    let keyStr = "";
    let flag = false;

    if (sdo.drcsTotal !== undefined) {
      this.data.drcsTotal = sdo.drcsTotal;
      this.process.updateModel(this.data.drcsTotal);
    }

    this.data.phase = phase;
    this.process.renderingPhase = phase; // very important code sentence

    this.process.running = true; ///*

    switch (phase) {
      case "running":
        if (sdo.progress < 6) {
          this.showSpecInfo("正在解析模型数据", this.rt_phase_times);
        } else {
          this.showSpecInfo(`正在进行渲染: <b><font color="#008800">` + sdo.progress + `%</font></b>`);
        }

        flag = true;
        break;

      case "new":
        keyStr = `排队<b><font color="#880000">(` + sdo.teamIndex + "/" + sdo.teamLength + `)</font></b>等待可用的空闲渲染器`;
        this.showSpecInfo(keyStr, this.rt_phase_times);
        break;

      case "task_rendering_enter":
        if (this.rt_phase_times > 2) {
          this.showSpecInfo("配置渲染任务", this.rt_phase_times);
        } else {
          this.showSpecInfo("启动渲染任务", this.rt_phase_times);
        }

        break;

      case "task_rendering_load_res":
        // showSpecInfo("同步模型资源", rt_phase_times)
        this.showSpecInfo(`同步模型资源: <b><font color="#008800">` + sdo.progress + `%</font></b>`);
        break;

      case "task_rendering_begin":
        this.showSpecInfo("准备渲染数据", this.rt_phase_times);
        break;

      case "finish":
        if (this.taskStatus < 1) {
          this.data.version = sdo.version;
          this.taskStatus = 1;
          let sizes = sdo.sizes;
          let time_ms = Date.now() - this.startTime;
          let time_s = Math.round(time_ms / 1000.0);
          console.log("task finish, loss time: ", time_s + "s(" + time_ms + "ms), sdo.version: ", sdo.version);
          this.showSpecInfo(`<b><font color="#008800">` + sizes[0] + "x" + sizes[1] + `</font></b>效果图渲染完成<br/><b>(总耗时` + time_s + `s)</b>`);
          this.data.bgTransparent = sdo.bgTransparent == 1;
          this.taskSuccess();
        }

        break;

      case "rtaskerror":
        if (this.taskStatus < 2) {
          this.taskStatus = 2;
          div.innerHTML = "渲染失败(模型数据不能正确解析)";
          this.taskFailure();
          return;
        }

      case "query-re-rendering-task":
        console.log("query-re-rendering-task, status: ", status);

        if (status == 22) {// restartReqstUpdate();
        }

        break;

      default:
        break;
    } // loadDrcModels(sdo.drcsTotal);


    this.rt_phase_times++; //*/
  }

}

exports.RTaskInfoViewer = RTaskInfoViewer;

/***/ }),

/***/ "2403":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const HtmlDivUtils_1 = __webpack_require__("7191");

class HTMLViewerLayer {
  constructor(viewer = null) {
    // protected m_rect = new AABB2D();
    this.unit = "px";
    this.m_viewer = viewer;

    if (viewer) {
      this.m_style = viewer.style;
    }
  }

  getDiv() {
    return this.m_viewer;
  }

  setViewer(viewer) {
    this.m_viewer = viewer;

    if (viewer) {
      this.m_style = viewer.style;
    }
  }

  setInnerHTML(html) {
    this.m_viewer.innerHTML = html;
  }

  clearInnerHTML() {
    this.m_viewer.innerHTML = "";
  }

  setDisplayMode(display = "block") {
    if (display != "") {
      this.m_style.display = display;
    }
  }

  setPositionMode(position = "relative") {
    if (position != "") {
      this.m_style.position = position;
    }
  }

  setTextAlign(align) {
    this.m_style.textAlign = align;
  }

  contentAlignToCenter() {
    let s = this.m_style;
    s.textAlign = "center";
    s.alignItems = "center";
    s.justifyContent = "center";
  }

  layoutToCenter(offsetX = 0, offsetY = 0) {
    let rect = this.m_viewer.getBoundingClientRect();
    let parent_rect = this.m_viewer.parentElement.getBoundingClientRect();
    console.log("layoutToCenter(), rect: ", rect);
    console.log("layoutToCenter(), parent_rect: ", parent_rect);
    let px = (parent_rect.width - rect.width) * 0.5 + offsetX;
    let py = (parent_rect.height - rect.height) * 0.5 + offsetY;
    this.setXY(px, py);
  }

  setXY(px, py) {
    // this.m_rect.x = px;
    // this.m_rect.y = py;
    this.m_style.left = px + this.unit;
    this.m_style.top = py + this.unit;
  }

  setX(px) {
    // this.m_rect.x = px;
    this.m_style.left = px + this.unit;
  }

  setY(py) {
    // this.m_rect.y = py;
    this.m_style.top = py + this.unit;
  }

  setSize(pw, ph) {
    if (pw > 0 && ph > 0) {
      // this.m_rect.width = pw;
      // this.m_rect.height = ph;
      this.m_style.width = pw + this.unit;
      this.m_style.height = ph + this.unit;
    }
  }

  setWidth(pw) {
    if (pw > 0) {
      // this.m_rect.width = pw;
      this.m_style.width = pw + this.unit;
    }
  }

  setHeight(ph) {
    if (ph > 0) {
      // this.m_rect.height = ph;
      this.m_style.height = ph + this.unit;
    }
  }

  setTextColor(uint24, alpha = 1.0) {
    this.m_style.color = "#" + uint24.toString(16);
  }

  setBackgroundColor(uint24, alpha = 1.0) {
    this.m_style.backgroundColor = "#" + uint24.toString(16);
  }

  setVisible(v) {
    HtmlDivUtils_1.DivTool.setVisible(this.m_viewer, v);
  }

  isVisible() {
    return HtmlDivUtils_1.DivTool.isVisible(this.m_viewer);
  }

  show() {
    this.setVisible(true);
  }

  hide() {
    this.setVisible(false);
  }

  clearDivAllEles() {
    HtmlDivUtils_1.DivTool.clearDivAllEles(this.m_viewer);
  }

  getRect() {
    return this.m_viewer.getBoundingClientRect();
  }

}

exports.HTMLViewerLayer = HTMLViewerLayer;

/***/ }),

/***/ "24cc":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const SettingDataPanel_1 = __webpack_require__("a7c5");

const OutputDataPanel_1 = __webpack_require__("195d");

const EnvDataPanel_1 = __webpack_require__("faa5");

const CameraDataPanel_1 = __webpack_require__("4f1d");

const MaterialDataPanel_1 = __webpack_require__("2eea");

const RenderingSettingItem_1 = __webpack_require__("22b3");

const LightDataPanel_1 = __webpack_require__("538b");

const ButtonDivItem_1 = __webpack_require__("47c8");

const menuDataList = [{
  name: "出图设置",
  id: 0,
  type: "output"
}, {
  name: "环境设置",
  id: 1,
  type: "env"
}, {
  name: "摄像机",
  id: 2,
  type: "camera"
}, {
  name: "材质",
  id: 3,
  type: "material"
}, {
  name: "灯光",
  id: 4,
  type: "light"
}];

class DsrdUI {
  constructor() {
    this.m_viewerLayer = null;
    this.m_areaWidth = 512;
    this.m_areaHeight = 512;
    this.m_items = [];
    this.m_itemMap = new Map();
    this.m_rscViewer = null;
  }

  initialize(viewerLayer, areaWidth, areaHeight) {
    console.log("DsrdUI::initialize()......");
    this.m_viewerLayer = viewerLayer;
    this.m_areaWidth = areaWidth;
    this.m_areaHeight = areaHeight; // let url = "static/cospace/dsrdiffusion/scViewer/SceneViewer.umd.js";
    // this.loadModule(url);

    this.initUIScene(viewerLayer, areaWidth, areaHeight);
  }

  setRSCViewer(rscViewer) {
    this.m_rscViewer = rscViewer;

    for (let i = 0; i < this.m_items.length; i++) {
      this.m_items[i].getPanel().rscViewer = rscViewer;
    }

    console.log("DsrdUI::setRSCViewer(), rscViewer: ", rscViewer);
  }

  initUIScene(layer, areaWidth, areaHeight) {
    let total = 5;
    let height = 400;
    let subH = height / total;
    let subW = 110;
    let startY = 0;
    let colors = [0x334455, 0x335555, 0x335566, 0x445555, 0x445566, 0x446666];
    let menuBtnBGDiv = this.createDiv(0, 0, subW, height, "absolute");
    let style = menuBtnBGDiv.style;
    style.backgroundColor = "#668fb6";
    layer.appendChild(menuBtnBGDiv);
    let bottomBtnBGDiv = this.createDiv(0, height, areaWidth, areaHeight - height, "absolute", false);
    style = bottomBtnBGDiv.style;
    style.backgroundColor = "#bdd9e1";
    layer.appendChild(bottomBtnBGDiv);
    this.buildBtns(bottomBtnBGDiv);
    let ctrlAreaDiv = this.createDiv(subW, 0, areaWidth - subW, height, "absolute", false);
    style = ctrlAreaDiv.style; // style.backgroundColor = "#555555";

    layer.appendChild(ctrlAreaDiv); // 2c71b0

    let dls = menuDataList;
    let items = this.m_items;
    let pw = subW;
    let ph = subH - 2;

    for (let i = 0; i < total; ++i) {
      // let data = dls[i];
      // let colorStr = "#" + colors[i].toString(16);
      let colorStr = "#bdd9e1"; // console.log("colorStr: ", colorStr);

      let div = this.createDiv(0, startY + i * subH, pw, ph, "absolute");
      style = div.style;
      style.backgroundColor = colorStr;
      style.cursor = "pointer";
      style.userSelect = "none";
      layer.appendChild(div); // let settingPanel = new SettingDataPanel();

      let settingPanel = this.createSettingPanel(ctrlAreaDiv, areaWidth - subW, height, dls[i]); // settingPanel.initialize(ctrlAreaDiv, areaWidth - subW, height, dls[i])

      const item = new RenderingSettingItem_1.RenderingSettingItem();
      item.group = items;
      item.initialize(div, pw, ph, settingPanel);
      items.push(item);
      this.m_itemMap.set(item.getType(), item);
    }

    items[0].select();
  }

  getItemByKeyName(keyName) {
    return this.m_itemMap.get(keyName);
  }

  getPanelByKeyName(keyName) {
    return this.m_itemMap.get(keyName).getPanel();
  }

  buildBtns(container) {
    let pw = 100;
    let ph = 60;
    let div = this.createDiv(130, 30, pw, ph, "absolute", true);
    let style = div.style;
    container.appendChild(div);
    let btn_rendering = new ButtonDivItem_1.ButtonDivItem();
    btn_rendering.initialize(div, "新建渲染", "new_rendering");

    btn_rendering.onmouseup = evt => {
      let currEvt = evt;
      console.log("button_idns: ", currEvt.button_idns);
    };

    div = this.createDiv(270, 30, pw, ph, "absolute", true);
    style = div.style; // style.cursor = "pointer";
    // style.userSelect = "none";

    container.appendChild(div);
    btn_rendering = new ButtonDivItem_1.ButtonDivItem();
    btn_rendering.initialize(div, "发起渲染", "send_rendering");

    btn_rendering.onmouseup = evt => {
      let currEvt = evt;
      console.log("button_idns: ", currEvt.button_idns);
      this.getRSettingJsonStr();
    };
  }

  getRSettingJsonStr() {
    // let items = this.m_items;
    let panel = this.getPanelByKeyName("output");
    console.log("panel: ", panel);
    let jsonBody = "";
    let jsonStr = panel.getJsonStr();
    jsonBody = jsonStr; // console.log("output jsonStr: ", jsonStr);

    panel = this.getPanelByKeyName("env");
    jsonStr = panel.getJsonStr();
    jsonBody += "," + jsonStr; // console.log("env jsonStr: ", jsonStr);

    panel = this.getPanelByKeyName("camera");
    jsonStr = panel.getJsonStr();
    jsonBody += "," + jsonStr; // console.log("camera jsonStr: ", jsonStr);

    panel = this.getPanelByKeyName("material");
    jsonStr = panel.getJsonStr();
    jsonBody += "," + jsonStr; // console.log("material jsonStr: ", jsonStr);

    panel = this.getPanelByKeyName("light");
    jsonStr = panel.getJsonStr();
    jsonBody += "," + jsonStr; // console.log("light jsonStr: ", jsonStr);

    console.log("-----------------------	----------------------------	-------------------");
    jsonStr = `"rnode":{"name":"rnode","unit":"m",${jsonBody}}`;
    console.log(jsonStr);
    return jsonStr;
  }

  createSettingPanel(viewerLayer, areaWidth, areaHeight, data) {
    let settingPanel = null;

    switch (data.type) {
      case "output":
        settingPanel = new OutputDataPanel_1.OutputDataPanel();
        break;

      case "env":
        settingPanel = new EnvDataPanel_1.EnvDataPanel();
        break;

      case "camera":
        settingPanel = new CameraDataPanel_1.CameraDataPanel();
        break;

      case "material":
        settingPanel = new MaterialDataPanel_1.MaterialDataPanel();
        break;

      case "light":
        settingPanel = new LightDataPanel_1.LightDataPanel();
        break;

      default:
        settingPanel = new SettingDataPanel_1.SettingDataPanel();
    }

    settingPanel.initialize(viewerLayer, areaWidth, areaHeight, data);
    return settingPanel;
  }

  createDiv(px, py, pw, ph, position = "", center = true) {
    const div = document.createElement("div");
    let style = div.style;
    style.left = px + "px";
    style.top = py + "px";
    style.width = pw + "px";
    style.height = ph + "px";
    style.display = "flex";

    if (center) {
      style.alignItems = "center";
      style.justifyContent = "center";
    }

    style.position = "relative";

    if (position != "") {
      style.position = position;
    }

    return div;
  }

}

exports.DsrdUI = DsrdUI;

/***/ }),

/***/ "2eea":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const SettingDataPanel_1 = __webpack_require__("a7c5");

const DataItemComponent_1 = __webpack_require__("9bbe");

class MaterialDataPanel extends SettingDataPanel_1.SettingDataPanel {
  constructor() {
    super();
    this.modelName = "apple_body_model";
    this.uvScales = [1.0, 1.0];
  }

  getJsonStr(beginStr = "{", endStr = "}") {
    let uvSX = this.getItemCompByKeyName("uvScale_x").getParam();
    let uvSY = this.getItemCompByKeyName("uvScale_y").getParam();
    let uvScales = [uvSX.numberValue, uvSY.numberValue];
    let jsonStr = `${beginStr}"modelName":"${this.modelName}", "uvScales":[${uvScales}]`; // return super.getJsonStr(jsonStr,endStr);

    let jsonBody = this.getJsonBodyStr(jsonStr, endStr);
    return `"materials":[${jsonBody}]`;
  }

  init(viewerLayer) {
    let params = [];
    let param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "type";
    param.name = "材质类型";
    param.textContent = "BSDF";
    param.textValue = "bsdf";
    param.toText();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "color";
    param.name = "颜色";
    param.numberValue = 0xffffff;
    param.editEnabled = true;
    param.toColor();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "specular";
    param.name = "反射率";
    param.numberValue = 0.5;
    param.inputType = "number";
    param.floatNumberEnabled = true;
    param.numberMinValue = 0.0;
    param.numberMaxValue = 3.0;
    param.editEnabled = true;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "metallic";
    param.name = "金属度";
    param.numberValue = 0.5;
    param.inputType = "number";
    param.floatNumberEnabled = true;
    param.numberMinValue = 0.0;
    param.numberMaxValue = 3.0;
    param.editEnabled = true;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "roughness";
    param.name = "粗糙度";
    param.numberValue = 0.5;
    param.inputType = "number";
    param.floatNumberEnabled = true;
    param.numberMinValue = 0.0;
    param.numberMaxValue = 3.0;
    param.editEnabled = true;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "normalStrength";
    param.name = "凹凸强度";
    param.numberValue = 1.0;
    param.inputType = "number";
    param.floatNumberEnabled = true;
    param.numberMinValue = 0.0;
    param.numberMaxValue = 3.0;
    param.editEnabled = true;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "uvScale_x";
    param.name = "X轴UV缩放";
    param.numberValue = 1.0;
    param.inputType = "number";
    param.floatNumberEnabled = true;
    param.numberMinValue = 0.0;
    param.numberMaxValue = 30.0;
    param.editEnabled = true;
    param.autoEncoding = false;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "uvScale_y";
    param.name = "Y轴UV缩放";
    param.numberValue = 1.0;
    param.inputType = "number";
    param.floatNumberEnabled = true;
    param.numberMinValue = 0.0;
    param.numberMaxValue = 30.0;
    param.editEnabled = true;
    param.autoEncoding = false;
    param.toNumber();
    params.push(param);
    this.m_params = params;
    let container = this.m_container;
    let startX = 45;
    let startY = 45;
    let disY = 41;
    let py = 0;

    for (let i = 0; i < params.length; ++i) {
      let itemComp = new DataItemComponent_1.DataItemComponent();
      itemComp.x = startX;
      itemComp.y = startY + py;
      itemComp.initialize(container, params[i]);
      this.addItemComp(itemComp);
      py += disY;
    }
  }

}

exports.MaterialDataPanel = MaterialDataPanel;

/***/ }),

/***/ "3a06":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const HTMLViewerLayer_1 = __webpack_require__("2403");

const ButtonDivItem_1 = __webpack_require__("47c8");

const HTTPUtils_1 = __webpack_require__("438a");

const HtmlDivUtils_1 = __webpack_require__("7191");

class RModelUploadingUI {
  constructor() {
    this.m_viewerLayer = null;
    this.m_areaWidth = 512;
    this.m_areaHeight = 512;
    this.m_time = 0;
    this.m_resLoaded = 0; // private m_infoDiv: HTMLDivElement = null;

    this.m_textViewer = null;
    this.onaction = null;
    this.rtaskSys = null;
    this.m_backBtn = null;
  }

  initialize(viewerLayer, areaWidth, areaHeight) {
    console.log("RModelUploadingUI::initialize()......");
    this.m_viewerLayer = viewerLayer;
    this.m_areaWidth = areaWidth;
    this.m_areaHeight = areaHeight;
  }

  uploadFile(file) {
    this.m_time = new Date().getTime() - 100;
    this.m_resLoaded = 0;
    this.initUI();
    this.uploadAndSendRendering(file);
  }

  open() {}

  close() {}

  initUI() {
    this.open();

    if (this.m_textViewer == null) {
      let pw = 320;
      let ph = 300;
      let div = HtmlDivUtils_1.DivTool.createDiv(320, 300);
      this.m_viewerLayer.appendChild(div);
      let v = new HTMLViewerLayer_1.HTMLViewerLayer(div);
      v.setTextAlign("center");
      v.layoutToCenter(); // v.setDisplayMode("block");
      // v.setPositionMode("absolute");

      this.m_textViewer = v;
    } else {
      this.m_textViewer.show();
    }

    this.m_textViewer.setInnerHTML("uploading...");
    this.progressCall({
      lengthComputable: true,
      loaded: 100,
      total: 50000
    }); // this.toUploadFailure("...");
  }

  getRenderingParams(otherParams) {
    let rtBGTransparent = false;
    let rimgSizes = [512, 512];
    let params = "&sizes=" + rimgSizes; // params += getCameraDataParam();

    params += "&rtBGTransparent=" + (rtBGTransparent ? "1" : "0");

    if (otherParams != "") {
      params += otherParams;
    }

    return params;
  }

  completeCall(evt) {
    let str = evt.target.responseText + "";
    console.log("evt.target.responseText: ", str);
    let data = null;

    try {
      data = JSON.parse(str);
      console.log("josn obj data: ", data);
    } catch (e) {
      data = {
        success: false
      };
      console.error("josn parsing error: ", e);
    }

    let type = "upload_success";

    if (data.success) {
      // setTaskJsonData(data);
      console.log("上传成功！");
      this.rtaskSys.process.toFirstRendering();
      this.rtaskSys.data.copyFromJson(data);
      this.rtaskSys.infoViewer.reset();
      this.rtaskSys.infoViewer.infoDiv = this.m_textViewer.getDiv();
      this.rtaskSys.startup(); // 立即发起一次渲染，获取缩略图和模型数据
      // alert("上传成功！");
      // this.reqstUpdate();

      if (this.onaction) {
        this.onaction("uploading_success", type);
      }
    } else {
      // alert("上传失败！");
      console.log("上传失败！");
      type = "upload_svr_failed";
      this.toUploadFailure(type);
    }
  }

  toUploadFailure(type) {
    // alert("上传失败！");
    this.m_textViewer.setInnerHTML("上传失败...");
    let pw = 80;
    let ph = 50;
    let px = (this.m_areaWidth - pw) * 0.5;
    let py = (this.m_areaHeight - ph) * 0.5 + 20;
    let btn = this.m_backBtn;

    if (btn == null) {
      let btnDiv = HtmlDivUtils_1.DivTool.createDivT1(px, py, pw, ph, "flex", "absolute", true);
      let colors = [0x157c73, 0x156a85, 0x15648b];
      this.m_viewerLayer.appendChild(btnDiv);
      btn = new ButtonDivItem_1.ButtonDivItem();
      btn.setDeselectColors(colors);
      btn.initialize(btnDiv, "返回", "upload_back");

      btn.onmouseup = evt => {
        let currEvt = evt;
        console.log("button_idns: ", currEvt.button_idns);
        btn.hide();
        this.m_textViewer.clearInnerHTML();
        this.m_textViewer.hide();

        if (this.onaction) {
          this.onaction(currEvt.button_idns, type);
        }
      };

      btn.setTextColor(0xeeeeee);
      this.m_backBtn = btn;
    }

    btn.show(); // if (this.onaction) {
    // 	this.onaction("uploading_failed", type);
    // }
  }

  progressCall(evt) {
    let proStr = "0%";

    if (evt.lengthComputable) {
      console.log("evt.loaded / evt.total: ", evt.loaded / evt.total);
      proStr = Math.round(evt.loaded / evt.total * 100) + "%";
    }

    var t = new Date().getTime();
    var pertime = (t - this.m_time) / 1000;
    this.m_time = new Date().getTime();
    var perload = evt.loaded - this.m_resLoaded;
    this.m_resLoaded = evt.loaded;
    var speed = perload / pertime;
    var bspeed = speed;
    var unit = "B/s";

    if (speed / 1024 > 1) {
      speed = speed / 1024;
      unit = "K/s";
    }

    if (speed / 1024 > 1) {
      speed = speed / 1024;
      unit = "M/s";
    }

    let speedStr = speed.toFixed(1) + unit;
    let restTime = ((evt.total - evt.loaded) / bspeed).toFixed(1); // this.m_infoDiv.innerHTML = "uploading " + proStr + "<br/>" + speedStr + "<br/>rest time: " + restTime + "s";

    let html = "uploading " + proStr + "<br/>" + speedStr + "<br/>rest time: " + restTime + "s";
    this.m_textViewer.setInnerHTML(html);
  }

  uploadAndSendRendering(fileObj) {
    if (fileObj == null) {
      return;
    }

    let hostUrl = HTTPUtils_1.HTTPUrl.host; // let camdvs: number[] = [];
    // let camParam = "&camdvs=[" + camdvs + "]";
    // console.log("camParam: ", camParam);
    // let url = hostUrl + "uploadRTData?srcType=viewer&phase=newrtask" + this.getRenderingParams(camParam);

    let url = hostUrl + "uploadRTData?srcType=viewer&phase=newrtask" + this.getRenderingParams("");

    if (!fileObj) {
      alert("the file dosen't exist !!!");
      this.updatePage();
      return;
    }

    let fileSize = Math.floor(fileObj.size / (1024 * 1024));
    let maxSize = 30;

    if (fileSize > maxSize) {
      alert("模型文件超过" + maxSize + "M, 带宽太小暂时不支持 !!!");
      this.updatePage();
      return;
    }

    let form = new FormData();
    form.append("file", fileObj);
    let xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    console.log("uploadAndSendRendering(), form url: ", url);
    console.log("uploadAndSendRendering(), form fileObj: ", fileObj);

    xhr.onload = evt => {
      this.completeCall(evt);
    };

    xhr.onerror = evt => {
      // this.failedCall(evt);
      this.toUploadFailure("upload_net_failed");
    };

    xhr.upload.onprogress = evt => {
      this.progressCall(evt);
    };

    xhr.upload.onloadstart = evt => {
      this.m_time = new Date().getTime();
      this.m_resLoaded = 0;
    };

    xhr.send(form);
    fileObj = null;
  }

  updatePage() {
    HTTPUtils_1.HTTPTool.updatePage();
  }

}

exports.RModelUploadingUI = RModelUploadingUI;

/***/ }),

/***/ "438a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class HTTPUrl {}

HTTPUrl.host = "/";
exports.HTTPUrl = HTTPUrl;

class HTTPTool {
  static updatePage() {
    location.reload();
  }

}

exports.HTTPTool = HTTPTool;

/***/ }),

/***/ "47c8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const HTMLViewerLayer_1 = __webpack_require__("2403");

class ButtonDivItem extends HTMLViewerLayer_1.HTMLViewerLayer {
  constructor() {
    super();
    this.m_btn_name = "";
    this.m_btn_idns = "";
    this.m_selected = false;
    this.m_selectColors = [0xbdd9e1, 0xaed4df, 0x83c4d7];
    this.m_deselectColors = [0x7aacda, 0x4a93d5, 0x3b7bb5];
    this.group = null;
    this.onmousedown = null;
    this.onmouseup = null;
  }

  initialize(viewerLayer, btn_name, btn_idns) {
    console.log("ButtonDivItem::initialize()......");
    let style = viewerLayer.style;
    style.cursor = "pointer";
    style.userSelect = "none"; // style.color = "#eeeeee";

    this.setViewer(viewerLayer);
    this.m_btn_name = btn_name;
    this.m_btn_idns = btn_idns;
    viewerLayer.innerHTML = btn_name;
    this.initEvent(viewerLayer);
    this.applyColorAt(0);
  }

  setSelectColors(colors) {
    this.m_selectColors = colors;
  }

  setDeselectColors(colors) {
    this.m_deselectColors = colors;
  }

  getName() {
    return this.m_btn_name;
  }

  getIdns() {
    return this.m_btn_idns;
  }

  applyColorAt(i) {
    let colors = this.m_selected ? this.m_selectColors : this.m_deselectColors; // this.m_viewerLayer.style.backgroundColor = "#" + colors[i].toString(16);

    this.setBackgroundColor(colors[i]);
  }

  initEvent(viewerLayer) {
    viewerLayer.onmouseover = evt => {
      // console.log("mouse over, name: ", this.m_itemData.name);
      this.applyColorAt(1);
    };

    viewerLayer.onmouseout = evt => {
      // console.log("mouse out, name: ", this.m_itemData.name);
      this.applyColorAt(0);
    };

    viewerLayer.onmouseup = evt => {
      // console.log("mouse up, name: ", this.m_itemData.name);
      this.select();
      this.applyColorAt(1);

      if (this.onmouseup) {
        evt.buttonTarget = this;
        evt.button_idns = this.m_btn_idns;
        this.onmouseup(evt);
      }
    };

    viewerLayer.onmousedown = evt => {
      // console.log("mouse down, name: ", this.m_itemData.name);
      this.applyColorAt(2);

      if (this.onmousedown) {
        evt.buttonTarget = this;
        evt.button_idns = this.m_btn_idns;
        this.onmousedown(evt);
      }
    };
  }

  isSelected() {
    return this.m_selected;
  }

  select() {
    if (this.group != null) {
      let ls = this.group;
      let len = ls.length;

      for (let i = 0; i < len; ++i) {
        if (ls[i].isSelected()) {
          ls[i].deselect();
          break;
        }
      }

      this.m_selected = true;
      this.applyColorAt(0);
    } else {// this.m_selected = true;
    }
  }

  deselect() {
    if (this.group != null) {
      this.m_selected = false;
      this.applyColorAt(0);
    } else {// this.m_selected = false;
    }
  }

}

exports.ButtonDivItem = ButtonDivItem;

/***/ }),

/***/ "4f1d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const SettingDataPanel_1 = __webpack_require__("a7c5");

const DataItemComponent_1 = __webpack_require__("9bbe");

class CameraDataPanel extends SettingDataPanel_1.SettingDataPanel {
  constructor() {
    super();
  }

  getCamMatrixData() {
    return this.rscViewer.getCameraData(0.01, true); // return [];
  }

  getJsonStr(beginStr = "{", endStr = "}") {
    let jsonStr = `${beginStr}"matrix":[${this.getCamMatrixData()}]`;
    return super.getJsonStr(jsonStr, endStr);
  }

  init(viewerLayer) {
    let params = [];
    let param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "type";
    param.name = "类型";
    param.textValue = "perspective";
    param.toText();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "viewAngle";
    param.name = "视角";
    param.numberValue = 45;
    param.inputType = "number";
    param.numberMinValue = 0;
    param.numberMaxValue = 180;
    param.unit = "度";
    param.editEnabled = true;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "near";
    param.name = "近平面";
    param.numberValue = 0.1;
    param.inputType = "number";
    param.floatNumberEnabled = true;
    param.numberMinValue = 0.0;
    param.numberMaxValue = 10.0;
    param.editEnabled = true;
    param.unit = "m";
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "far";
    param.name = "远平面";
    param.numberValue = 20;
    param.inputType = "number";
    param.floatNumberEnabled = true;
    param.numberMinValue = 0.0;
    param.numberMaxValue = 100.0;
    param.editEnabled = true;
    param.unit = "m";
    param.toNumber();
    params.push(param);
    this.m_params = params;
    let container = this.m_container;
    let startX = 45;
    let startY = 95;
    let disY = 60;
    let py = 0;

    for (let i = 0; i < params.length; ++i) {
      let itemComp = new DataItemComponent_1.DataItemComponent();
      itemComp.x = startX;
      itemComp.y = startY + py;
      itemComp.initialize(container, params[i]);
      this.addItemComp(itemComp);
      py += disY;
    }
  }

}

exports.CameraDataPanel = CameraDataPanel;

/***/ }),

/***/ "538b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const SettingDataPanel_1 = __webpack_require__("a7c5");

const DataItemComponent_1 = __webpack_require__("9bbe");

class LightDataPanel extends SettingDataPanel_1.SettingDataPanel {
  constructor() {
    super();
  }

  getJsonStr(beginStr = "{", endStr = "}") {
    // let uvSX = this.getItemCompByKeyName("uvScale_x").getParam();
    // let uvSY = this.getItemCompByKeyName("uvScale_y").getParam();
    // let uvScales = [uvSX.numberValue, uvSY.numberValue];
    // let jsonStr = `${beginStr}"modelName":"${this.modelName}", "uvScales":[${uvScales}]`;
    // return super.getJsonStr(jsonStr,endStr);
    let jsonBody = this.getJsonBodyStr(beginStr, endStr);
    return `"lights":[${jsonBody}]`;
  }

  init(viewerLayer) {
    let params = [];
    let param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "type";
    param.name = "类型";
    param.textValue = "point";
    param.toText();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "color";
    param.name = "灯光颜色";
    param.numberValue = 0xaaeebb;
    param.editEnabled = true;
    param.toColor();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "power";
    param.name = "灯光功率";
    param.numberValue = 500;
    param.inputType = "number";
    param.numberMinValue = 0;
    param.numberMaxValue = 50000;
    param.editEnabled = true;
    param.unit = "W";
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "new_light";
    param.name = "新建光源";
    param.textValue = "...";
    param.toText();
    param.autoEncoding = false;
    params.push(param);
    this.m_params = params;
    let container = this.m_container;
    let startX = 45;
    let startY = 95;
    let disY = 60;
    let py = 0;

    for (let i = 0; i < params.length; ++i) {
      let itemComp = new DataItemComponent_1.DataItemComponent();
      itemComp.x = startX;
      itemComp.y = startY + py;
      itemComp.initialize(container, params[i]);
      this.addItemComp(itemComp);
      py += disY;
    }
  }

}

exports.LightDataPanel = LightDataPanel;

/***/ }),

/***/ "7191":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class DivTool {
  static createDiv(pw, ph, display = "", position = "", center = false) {
    const div = document.createElement("div");
    let style = div.style;

    if (pw > 0 && ph > 0) {
      style.width = pw + "px";
      style.height = ph + "px";
    }

    style.display = "block";

    if (display != "") {
      style.display = display;
    }

    style.position = "relative";

    if (position != "") {
      style.position = position;
    }

    if (center) {
      style.alignItems = "center";
      style.justifyContent = "center";
    }

    return div;
  }

  static createDivT1(px, py, pw, ph, display = "", position = "", center = true) {
    const div = document.createElement("div");
    let style = div.style;

    if (px > 0 && py > 0) {
      style.left = px + "px";
      style.top = py + "px";
    }

    if (pw > 0 && ph > 0) {
      style.width = pw + "px";
      style.height = ph + "px";
    }

    style.display = "block";

    if (display != "") {
      style.display = display;
    }

    style.position = "relative";

    if (position != "") {
      style.position = position;
    }

    if (center) {
      style.alignItems = "center";
      style.justifyContent = "center";
    }

    return div;
  }

  static clearDivAllEles(div) {
    div.replaceChildren();
  }

  static setVisible(div, visible) {
    let style = div.style;

    if (visible) {
      style.visibility = "visible";
    } else {
      style.visibility = "hidden";
    }
  }

  static isVisible(div) {
    return div.style.visibility == "visible";
  }

  static setTextColor(div, uint24) {
    div.style.color = "#" + uint24.toString(16);
  }

}

exports.DivTool = DivTool;

/***/ }),

/***/ "79c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const HTTPUtils_1 = __webpack_require__("438a");

class RTaskRquest {
  constructor() {
    this.taskReqSvrUrl = "";
    this.taskInfoGettingUrl = "";
  }

  getDomain(url) {
    var urlReg = /http:\/\/([^\/]+)/i;
    let domain = url.match(urlReg);
    return domain != null && domain.length > 0 ? domain[0] : "";
  }

  getHostUrl(port) {
    let host = location.href;
    let domain = this.getDomain(host);
    let nsList = domain.split(":");
    host = nsList[0] + ":" + nsList[1];
    return port ? host + ":" + port + "/" : domain + "/";
  }

  initialize() {
    this.taskReqSvrUrl = HTTPUtils_1.HTTPUrl.host + "renderingTask";
    this.taskInfoGettingUrl = HTTPUtils_1.HTTPUrl.host + "getRTInfo";
  }

  reset() {}

  createReqUrlStr(svrUrl, phase, progress, taskId, taskName, otherInfo = "") {
    let url = svrUrl + "?srcType=viewer&&phase=" + phase + "&progress=" + progress + otherInfo;

    if (taskId > 0) {
      url += "&taskid=" + taskId + "&taskname=" + taskName;
    }

    return url;
  }

  sendACommonGetReq(purl, onload) {
    let req = new XMLHttpRequest();
    req.open("GET", purl, true);

    req.onerror = function (err) {
      console.error("sendACommonGetReq(), load error: ", err);
    }; // req.onprogress = e => { };


    req.onload = evt => {
      if (onload) {
        onload(purl, req.response);
      }
    };

    req.send(null);
  }

  notifyRenderingInfoToSvr(taskId, taskName, otherInfo = "") {
    let url = this.createReqUrlStr(this.taskReqSvrUrl, "queryataskrst", 0, taskId, taskName, otherInfo);
    this.sendnotifyTaskInfoReq(url);
  }

  notifyModelInfoToSvr(taskId, taskName, otherInfo = "") {
    let url = this.createReqUrlStr(this.taskReqSvrUrl, "queryataskrst", 0, taskId, taskName, otherInfo);
    this.sendACommonGetReq(url, (purl, content) => {
      console.log("### ###### notifyModelInfoToSvr() loaded, content: ", content);
      let sdo = JSON.parse(content);
      this.taskInfoViewer.parseRenderingReqInfo(sdo);
    });
  }

  notifySyncRStatusToSvr(taskId, taskName, otherInfo = "") {
    let url = this.createReqUrlStr(this.taskInfoGettingUrl, "syncAnAliveTask", 0, taskId, taskName, otherInfo);
    this.sendACommonGetReq(url, (purl, content) => {
      console.log("### ###### notifySyncRStatusToSvr() loaded, content: ", content);
      let sdo = JSON.parse(content);
      this.taskInfoViewer.parseSyncRStatuReqInfo(sdo);
    });
  }

  sendnotifyTaskInfoReq(purl) {
    let req = new XMLHttpRequest();
    req.open("GET", purl, true);

    req.onerror = function (err) {
      console.error("load error: ", err);
      console.error("服务器无法正常访问 !!!");
      return;
    };

    req.onprogress = e => {};

    req.onload = evt => {
      let sdo = JSON.parse(req.response);
      this.taskInfoViewer.parseRenderingReqInfo(sdo);
    };

    req.send(null);
  }

}

exports.RTaskRquest = RTaskRquest;

/***/ }),

/***/ "7d31":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class DsrdScene {
  constructor() {
    this.m_viewerLayer = null;
    this.ui = null;
    this.taskSys = null;
    this.rscViewer = null;
  }

  initialize(viewerLayer) {
    console.log("DsrdScene::initialize()......");
    this.m_viewerLayer = viewerLayer;
    let url = "static/cospace/dsrdiffusion/scViewer/SceneViewer.umd.js";
    this.loadModule(url);
  }

  init3DScene() {
    let rscViewer = new SceneViewer.SceneViewer();
    this.rscViewer = rscViewer;
    console.log("rscViewer: ", rscViewer);
    let debugDev = true;
    let host = location.href;
    host = host.toLowerCase();

    if (host.indexOf("diffusion") > 0) {
      debugDev = false;
    }

    rscViewer.initialize(this.m_viewerLayer, () => {}, true, debugDev); // 增加三角面数量的信息显示

    rscViewer.setForceRotate90(true);
    this.ui.setRSCViewer(rscViewer);
    this.taskSys.setRSCViewer(rscViewer);
  }

  loadModule(purl) {
    let codeLoader = new XMLHttpRequest();
    codeLoader.open("GET", purl, true);

    codeLoader.onerror = function (err) {
      console.error("loadModule error: ", err);
    };

    codeLoader.onprogress = e => {// this.showLoadInfo(e, codeLoader);
    };

    codeLoader.onload = () => {
      let scriptEle = document.createElement("script");

      scriptEle.onerror = e => {
        console.error("module script onerror, e: ", e);
      };

      scriptEle.innerHTML = codeLoader.response;
      document.head.appendChild(scriptEle); // this.loadFinish();

      this.init3DScene();
    };

    codeLoader.send(null);
  }

}

exports.DsrdScene = DsrdScene;

/***/ }),

/***/ "8448":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function numberToCSSHeXRGBColorStr(v) {
  let str = v.toString(16);
  let tstr = "000000";
  let dis = tstr.length - str.length;

  if (dis > 0) {
    str = tstr.slice(0, dis) + str;
  }

  return str;
}

function checkCSSHexRGBColorStr(value) {
  let str = value.replace(/[^\a,b,c,e,f\0-9]/g, '');

  if (str.length < 1) {
    str = "0";
  } else if (str.length > 6) {
    let dis = str.length - 6;
    str = str.slice(dis);
  }

  return str;
}

function checkIntegerNumberStr(value, min, max) {
  let str = value.replace(/[^\.\0-9]/g, '');
  let nv = parseFloat(str);

  if (isNaN(nv)) {
    nv = 0;
  }

  nv = Math.round(nv);
  nv = clamp(nv, min, max);
  str = nv + '';
  return str;
}

function checkFloatNumberStr(value, min, max) {
  let str = value.replace(/[^\.\0-9]/g, '');
  let nv = parseFloat(str);

  if (isNaN(nv)) {
    nv = 0.0;
  }

  nv = clamp(nv, min, max);
  console.log("checkFloatNumberStr(), nv: ", nv, str);
  str = nv.toFixed(4);
  nv = parseFloat(str);
  str = nv + '';

  if (str.indexOf(".") < 1) {
    str += ".0";
  }

  return str;
}

class DataItemComponentParam {
  constructor() {
    this.keyName = "";
    this.name = "";
    this.unit = "";
    this.compType = "number";
    this.editEnabled = false;
    this.inputType = "text";
    this.numberMinValue = 0;
    this.numberMaxValue = 1;
    this.floatNumberEnabled = false;
    this.autoEncoding = true;
  }

  getJsonStr() {
    let valueStr = this.getCurrValueString(false);
    valueStr = this.compType == "text" ? `"${valueStr}"` : valueStr;
    return `"${this.keyName}":${valueStr}`;
  }

  toNumber() {
    this.compType = "number";
  }

  toBoolean() {
    this.compType = "boolean";
  }

  toText() {
    this.compType = "text";
  }

  toColor() {
    this.compType = "color";
  }

  initEvents() {
    if (this.editEnabled) {
      let input = this.body_viewer;
      input.type = "text";

      switch (this.compType) {
        case "color":
          if (this.inputType == "text") {
            // input.onkeyup = evt => {
            input.onkeyup = evt => {
              let str = checkCSSHexRGBColorStr(input.value);
              input.value = str + this.unit;
              this.numberValue = parseInt("0x" + str);
            };
          }

          break;

        default:
          if (this.inputType == "number") {
            if (this.floatNumberEnabled) {
              input.onkeyup = evt => {
                let str = checkFloatNumberStr(input.value, this.numberMinValue, this.numberMaxValue);
                input.value = str + this.unit;
                this.numberValue = parseFloat(str);
              };
            } else {
              input.onkeyup = evt => {
                let str = checkIntegerNumberStr(input.value, this.numberMinValue, this.numberMaxValue);
                input.value = str + this.unit;
                this.numberValue = parseInt(str);
              };
            }
          }

      }
    } else {
      let div = this.body_viewer;

      switch (this.compType) {
        case "boolean":
          div.onmouseup = evt => {
            this.booleanValue = !this.booleanValue;
            this.displayToViewer();
          };

          break;
      }
    }
  }

  getCurrValueString(viewing = true) {
    let valueStr = "";
    let unitStr = "";

    switch (this.compType) {
      case "number":
      case "text":
        if (viewing) {
          unitStr = this.unit;

          if (this.numberValue !== undefined) {
            valueStr = this.numberValue + "";
          } else if (this.textContent !== undefined) {
            valueStr = this.textContent;
          } else if (this.textValue !== undefined) {
            valueStr = this.textValue;
          }
        } else {
          if (this.numberValue !== undefined) {
            valueStr = this.numberValue + "";
          } else if (this.textValue !== undefined) {
            valueStr = this.textValue;
          } else if (this.textContent !== undefined) {
            valueStr = this.textContent;
          }
        }

        break;

      case "boolean":
        if (viewing) {
          valueStr = this.booleanValue ? "是" : "否";
        } else {
          valueStr = this.booleanValue ? "1" : "0";
        }

        break;

      case "color":
        if (viewing) {
          valueStr = numberToCSSHeXRGBColorStr(this.numberValue);
        } else {
          valueStr = this.numberValue + "";
        }

        break;
    }

    return viewing ? valueStr + unitStr : valueStr;
  }

  displayToViewer() {
    let head_viewer = this.head_viewer;
    let body_viewer = this.body_viewer;
    head_viewer.innerHTML = this.name;
    let valueStr = this.getCurrValueString(true);

    if (valueStr != "") {
      if (this.editEnabled) {
        body_viewer.value = valueStr;
      } else {
        body_viewer.innerHTML = valueStr;
      }
    }
  }

}

exports.DataItemComponentParam = DataItemComponentParam;

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

/***/ "8900":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ButtonDivItem_1 = __webpack_require__("47c8");

const DropFileController_1 = __webpack_require__("bb2b");

const RModelUploadingUI_1 = __webpack_require__("3a06");

const HtmlDivUtils_1 = __webpack_require__("7191");

class RTaskBeginUI {
  constructor() {
    this.m_viewerLayer = null;
    this.m_areaWidth = 512;
    this.m_areaHeight = 512;
    this.m_uploadModelBtn = null;
    this.m_openTasksListBtn = null;
    this.m_dropController = new DropFileController_1.DropFileController();
    this.m_uploadUI = new RModelUploadingUI_1.RModelUploadingUI();
    this.onaction = null;
    this.rtaskSys = null;
    this.m_dropEnabled = true;
    this.m_tasksListDiv = null;
    this.m_backFromTaskListBtn = null;
  }

  initialize(viewerLayer, areaWidth, areaHeight) {
    console.log("RTaskBeginUI::initialize()......");
    this.m_viewerLayer = viewerLayer;
    this.m_areaWidth = areaWidth;
    this.m_areaHeight = areaHeight;
    this.buildBtns(this.m_viewerLayer);
    this.m_dropController.geomModelKeys.push("glb", "usdz", "usdc", "blend", "bld");
    this.m_dropController.createObjectURLEnabled = false;
    this.m_dropController.initialize(viewerLayer, this);
    this.m_uploadUI.rtaskSys = this.rtaskSys;
    this.m_uploadUI.initialize(this.m_viewerLayer, areaWidth, areaHeight); // this.m_uploadUI.onaction = this.onaction;

    this.m_uploadUI.onaction = (idns, type) => {
      switch (idns) {
        case "upload_back":
          this.m_uploadModelBtn.setVisible(true);
          this.m_openTasksListBtn.setVisible(true);
          break;
      }
    };
  }

  initFileLoad(files) {
    console.log("initFileLoad(), files: ", files);
    this.m_uploadModelBtn.setVisible(false);
    this.m_openTasksListBtn.setVisible(false);
    this.m_uploadUI.uploadFile(files[0].file);
  }

  isDropEnabled() {
    return this.m_dropEnabled;
  }

  openDir() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".glb,.fbx,.obj,.usdz,.usdc,.blend,.bld";
    input.addEventListener("change", () => {
      let files = Array.from(input.files);
      this.m_dropController.initFilesLoad(files);
    });
    input.click();
  }

  showTasksList() {
    this.m_uploadModelBtn.setVisible(false);
    this.m_openTasksListBtn.setVisible(false);
    this.buildTasksList();
  }

  gotoAliveTaskAt(index) {}

  backFromTasksList() {
    this.m_tasksListDiv.style.visibility = "hidden";
    this.m_backFromTaskListBtn.setVisible(false);
    this.m_uploadModelBtn.setVisible(true);
    this.m_openTasksListBtn.setVisible(true);
  }

  buildTasksList() {
    let div = this.m_tasksListDiv;

    if (div == null) {
      let pw = 320;
      let ph = 300;
      let px = (this.m_areaWidth - pw) * 0.5;
      let py = 50;
      this.m_tasksListDiv = HtmlDivUtils_1.DivTool.createDivT1(px, py, pw, 300, "flex", "absolute", false);
      div = this.m_tasksListDiv;
      let style = div.style;
      style.textAlign = "center";
      style.display = "block";
      this.m_viewerLayer.appendChild(div);
      pw = 80;
      ph = 50;
      px = (this.m_areaWidth - pw) * 0.5;
      py = this.m_areaHeight - ph - 20;
      let btnDiv = HtmlDivUtils_1.DivTool.createDivT1(px, py, pw, ph, "flex", "absolute", true);
      let colors = [0x157c73, 0x156a85, 0x15648b];
      this.m_viewerLayer.appendChild(btnDiv);
      let btn = new ButtonDivItem_1.ButtonDivItem();
      btn.setDeselectColors(colors);
      btn.initialize(btnDiv, "返回", "back_from_tasks_list");

      btn.onmouseup = evt => {
        let currEvt = evt;
        console.log("button_idns: ", currEvt.button_idns);
        this.backFromTasksList();
      };

      this.m_backFromTaskListBtn = btn;
      btn.setTextColor(0xeeeeee);
    }

    this.m_tasksListDiv.style.visibility = "visible";
    this.m_backFromTaskListBtn.setVisible(true);
    HtmlDivUtils_1.DivTool.clearDivAllEles(div);
    let total = 8;

    for (let i = 0; i < total; ++i) {
      let br = document.createElement("br");
      div.appendChild(br);
      let link = document.createElement("a");
      link.innerHTML = "选择第<" + (i + 1) + ">个渲染任务: " + "vkTask-" + i;
      link.href = "#";
      link.addEventListener("click", () => {
        this.gotoAliveTaskAt(i);
      });
      div.appendChild(link);
      br = document.createElement("br");
      div.appendChild(br);
    }

    let br = document.createElement("br");
    div.appendChild(br);
    br = document.createElement("br");
    div.appendChild(br);
  }

  buildBtns(container) {
    let colors = [0x157c73, 0x156a85, 0x15648b];
    let pw = 150;
    let ph = 60;
    let disX = 50;
    let px = (this.m_areaWidth - (2 * pw + disX)) * 0.5;
    let py = (this.m_areaHeight - 2 * ph) * 0.5 + 30;
    let div = HtmlDivUtils_1.DivTool.createDivT1(px, py, pw, ph, "flex", "absolute", true);
    container.appendChild(div);
    let btn = new ButtonDivItem_1.ButtonDivItem();
    btn.setDeselectColors(colors);
    btn.initialize(div, "上传渲染模型", "upload_model");
    btn.applyColorAt(0);

    btn.onmouseup = evt => {
      let currEvt = evt;
      console.log("button_idns: ", currEvt.button_idns);
      this.openDir(); // // for test
      // if(this.onaction) {
      // 	this.onaction("toWorkSpace", "finish");
      // }
    };

    btn.setTextColor(0xeeeeee);
    this.m_uploadModelBtn = btn;
    div = HtmlDivUtils_1.DivTool.createDivT1(px + disX + pw, py, pw, ph, "flex", "absolute", true);
    container.appendChild(div);
    btn = new ButtonDivItem_1.ButtonDivItem();
    btn.setDeselectColors(colors);
    btn.initialize(div, "打开任务列表", "open_task_list");
    btn.applyColorAt(0);

    btn.onmouseup = evt => {
      let currEvt = evt;
      console.log("button_idns: ", currEvt.button_idns);
      this.showTasksList();
    };

    btn.setTextColor(0xeeeeee);
    this.m_openTasksListBtn = btn;
  }

  open() {
    this.m_viewerLayer.style.visibility = "visible";
  }

  close() {
    this.m_viewerLayer.style.visibility = "hidden";
  }

}

exports.RTaskBeginUI = RTaskBeginUI;

/***/ }),

/***/ "9bbe":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DataItemComponentParam_1 = __webpack_require__("8448");

exports.DataItemComponentParam = DataItemComponentParam_1.DataItemComponentParam;

class DataItemComponent {
  constructor() {
    this.x = 45;
    this.y = 50;
  }

  initialize(viewerLayer, param) {
    this.m_viewerLayer = viewerLayer;
    this.m_param = param;
    this.init(viewerLayer, param);
  }

  getKeyName() {
    return this.m_param.keyName;
  }

  getParam() {
    return this.m_param;
  }

  init(viewerLayer, param) {
    // 286dab
    let height = 23;
    let width = 159;
    let container = this.createDiv(this.x, this.y, 320, height, "", "", "absolute");
    let style = container.style;
    let headDiv = this.createDiv(0, 0, width, height, "", "", "absolute");
    let bodyDiv = this.createDiv(161, 0, width, height, "", "", "absolute");
    style = headDiv.style;
    style.background = "#286dab";
    style.color = "#eeeeee";
    style = bodyDiv.style;
    style.background = "#286dab";
    style.color = "#eeeeee"; // let style = container.style;
    // style.background = "#286dab";

    viewerLayer.appendChild(container);
    this.m_containerDiv = container;
    this.m_headDiv = headDiv;
    this.m_bodyDiv = bodyDiv;
    param.head_viewer = headDiv;
    param.body_viewer = bodyDiv;
    this.createInput(bodyDiv, param, width, height);
    container.appendChild(headDiv);
    container.appendChild(bodyDiv);
    param.displayToViewer();
    param.initEvents();
  }

  createInput(bodyDiv, param, width, height) {
    if (param.editEnabled) {
      var input = document.createElement("input"); // input.type = param.inputType;

      let style = input.style;
      style.position = "absolute";
      style.left = 0 + "px";
      style.top = 0 + "px";
      style.width = width + "px";
      style.height = height + "px";
      style.background = "transparent";
      style.borderWidth = "0px";
      style.outline = "none";
      style.color = "#eeeeee";
      style.fontSize = "17px";
      style.textAlign = "center"; // style.alignItems = "center";
      // style.justifyContent = "center";

      bodyDiv.append(input);
      this.m_input = input;
      param.body_viewer = input;
    }
  }

  createDiv(px, py, pw, ph, display = "block", align = "", position = "") {
    const div = document.createElement("div");
    let style = div.style;
    style.left = px + "px";
    style.top = py + "px";
    style.width = pw + "px";
    style.height = ph + "px";

    if (display != "") {
      style.display = display;
    }

    if (align != "") {
      switch (align) {
        case "center":
          style.alignItems = "center";
          style.justifyContent = "center";
          break;
      }
    } // style.userSelect = "none";
    // style.position = "relative";


    if (position != "") {
      style.position = position;
    }

    return div;
  }

}

exports.DataItemComponent = DataItemComponent;

/***/ }),

/***/ "a7c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class SettingDataPanel {
  constructor() {
    this.m_viewerLayer = null;
    this.m_container = null;
    this.m_itemData = null;
    this.m_areaWidth = 512;
    this.m_areaHeight = 512;
    this.m_itemCompDict = new Map();
  }

  initialize(viewerLayer, areaWidth, areaHeight, data) {
    console.log("SettingDataController::initialize()......");
    this.m_viewerLayer = viewerLayer;
    this.m_areaWidth = areaWidth;
    this.m_areaHeight = areaHeight;
    this.m_itemData = data; // viewerLayer.innerHTML = data.name;

    this.m_container = this.createDiv(0, 0, areaWidth, areaWidth, "", "", "absolute");
    viewerLayer.appendChild(this.m_container);
    this.init(viewerLayer);
    this.setVisible(false);
  }

  getName() {
    return this.m_itemData.name;
  }

  getKeyName() {
    return this.m_itemData.type;
  }

  getType() {
    return this.m_itemData.type;
  }

  getJsonBodyStr(beginStr = "{", endStr = "}") {
    let params = this.m_params;
    let jsonStr = beginStr;
    let symble = beginStr.length > 1 ? "," : "";

    for (let i = 0; i < params.length; i++) {
      const p = params[i];

      if (p.autoEncoding) {
        jsonStr += symble + p.getJsonStr();
        symble = ",";
      }
    }

    jsonStr += endStr;
    return jsonStr;
  }

  getJsonStr(beginStr = "{", endStr = "}") {
    // let params = this.m_params;
    // let jsonStr = beginStr;
    // let symble = beginStr.length > 1 ? ",":"";
    // for (let i = 0; i < params.length; i++) {
    // 	const p = params[i];
    // 	if(p.autoEncoding) {
    // 		jsonStr += symble + p.getJsonStr();
    // 		symble = ",";
    // 	}
    // }
    // jsonStr += endStr;
    // return `"${this.getKeyName()}":${jsonStr}`;
    return `"${this.getKeyName()}":${this.getJsonBodyStr(beginStr, endStr)}`;
  }

  addItemComp(comp) {
    this.m_itemCompDict.set(comp.getKeyName(), comp);
  }

  getItemCompByKeyName(keyName) {
    return this.m_itemCompDict.get(keyName);
  }

  init(viewerLayer) {}

  setVisible(v) {
    let c = this.m_container;
    let style = c.style;

    if (v) {
      style.visibility = "visible";
    } else {
      style.visibility = "hidden";
    }
  }

  isVisible() {
    return this.m_container.style.visibility == "visible";
  }

  createDiv(px, py, pw, ph, display = "block", align = "", position = "") {
    const div = document.createElement("div");
    let style = div.style;
    style.left = px + "px";
    style.top = py + "px";
    style.width = pw + "px";
    style.height = ph + "px";

    if (display != "") {
      style.display = display;
    }

    if (align != "") {
      switch (align) {
        case "center":
          style.alignItems = "center";
          style.justifyContent = "center";
          break;
      }
    } // style.userSelect = "none";
    // style.position = "relative";


    if (position != "") {
      style.position = position;
    }

    return div;
  }

}

exports.SettingDataPanel = SettingDataPanel;

/***/ }),

/***/ "b66b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const RTaskData_1 = __webpack_require__("06e0");

exports.IRTaskDataParam = RTaskData_1.IRTaskDataParam;
exports.RTaskData = RTaskData_1.RTaskData;

const RTaskInfoViewer_1 = __webpack_require__("23ff");

const RTaskRequest_1 = __webpack_require__("79c5");

const RTaskProcess_1 = __webpack_require__("c758");

class RTaskSystem {
  constructor() {
    this.m_startup = true;
    this.process = new RTaskProcess_1.RTaskProcess();
    this.data = new RTaskData_1.RTaskData();
    this.request = new RTaskRequest_1.RTaskRquest();
    this.infoViewer = new RTaskInfoViewer_1.RTaskInfoViewer();
    this.onaction = null;
    this.m_timerId = -1;
    this.m_workSpaceStatus = 0;
    this.m_rscViewer = null;
  }

  initialize() {
    this.infoViewer.data = this.data;
    this.infoViewer.process = this.process;
    this.infoViewer.initialize();
    this.request.taskInfoViewer = this.infoViewer;
    this.request.initialize();
  }

  startup() {
    if (this.m_startup) {
      this.m_startup = false;
      this.timerUpdate();
    }
  }

  setProcess(p) {}

  setTimerDelay(delay) {
    this.process.timerDelay = delay;
  }

  timerUpdate() {
    if (this.m_timerId > -1) {
      clearTimeout(this.m_timerId);
    }

    this.m_timerId = setTimeout(this.timerUpdate.bind(this), this.process.timerDelay);
    const data = this.data;
    const process = this.process;

    if (process.running && !process.isError()) {
      switch (this.process.type) {
        case RTaskProcess_1.RTPType.SyncRStatus:
          this.request.notifySyncRStatusToSvr(data.taskid, data.taskname);
          break;

        case RTaskProcess_1.RTPType.CurrRendering:
          if (process.isAllFinish()) {
            console.log("CurrRendering, all finish.");
            process.toSyncRStatus();
          } else {
            process.running = false;
            this.request.notifyRenderingInfoToSvr(data.taskid, data.taskname);
          }

          break;

        case RTaskProcess_1.RTPType.FirstRendering:
          if (process.isRunning()) {
            if (process.isModelFinish()) {
              this.loadModel();
            }

            if (process.isRenderingFinish()) {
              if (!process.isModelFinish()) {
                process.toSyncModelStatus();
              }
            } else {
              process.running = false;
              this.request.notifyRenderingInfoToSvr(data.taskid, data.taskname);
            }
          } else if (process.isAllFinish()) {
            console.log("FirstRendering, all finish.");
            process.toSyncRStatus();
          }

          break;

        case RTaskProcess_1.RTPType.SyncModelStatus:
          if (process.isModelFinish()) {
            this.loadModel();
          } else {
            process.running = false;
            this.request.notifyModelInfoToSvr(data.taskid, data.taskname);
          }

          break;

        default:
          break;
      }

      if (this.isRTDataFinish()) {
        this.toWorkSpace();
      }
    }
  }

  toWorkSpace() {
    if (this.m_workSpaceStatus == 0) {
      this.m_workSpaceStatus = 1;

      if (this.onaction) {
        this.onaction("toWorkSpace", "finish");
      }
    }
  }

  setRSCViewer(rscViewer) {
    this.m_rscViewer = rscViewer;
  }

  isRTDataFinish() {
    return this.data.isModelDataLoaded() && this.process.isAllFinish();
  }

  loadModel() {
    let data = this.data;

    if (data.modelLoadStatus == 0) {
      data.modelLoadStatus = 1;
      let req = this.request;
      let params = "";
      let url = req.createReqUrlStr(req.taskInfoGettingUrl, "modelToDrc", 0, data.taskid, data.taskname, params);
      console.log("### ######02 loadModel(), url: ", url);
      req.sendACommonGetReq(url, (purl, content) => {
        console.log("### ###### loadDrcModels() loaded, content: ", content);
        var infoObj = JSON.parse(content);
        console.log("loadDrcModels() loaded, infoObj: ", infoObj);
        let resBaseUrl = req.getHostUrl(9090) + infoObj.filepath.slice(2);
        let statusUrl = resBaseUrl + "status.json";
        req.sendACommonGetReq(statusUrl, (pstatusUrl, content) => {
          let statusObj = JSON.parse(content);
          console.log("statusObj: ", statusObj);
          let list = statusObj.list;
          let drcsTotal = list.length;
          let drcUrls = [];
          let types = [];

          for (let i = 0; i < drcsTotal; i++) {
            let drcUrl = resBaseUrl + list[i];
            drcUrls.push(drcUrl);
            types.push("drc");
          }

          console.log("drcUrls: ", drcUrls);

          if (this.m_rscViewer != null) {
            this.m_rscViewer.initSceneByUrls(drcUrls, types, prog => {
              console.log("3d viewer drc model loading prog: ", prog);

              if (prog >= 1.0) {// viewerInfoDiv.innerHTML = "";
                // loadedModel = true;
              }
            }, 200);
            this.m_rscViewer.setViewImageUrl(data.miniImgUrl);
          }

          data.modelLoadStatus = 2;
        });
      });
    }
  }

}

exports.RTaskSystem = RTaskSystem;

/***/ }),

/***/ "bb2b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class DropFileController {
  constructor() {
    this.m_htmlObj = null;
    this.m_listener = null;
    this.m_files = null;
    this.imgKeys = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "jfif", "ico", "avif"];
    this.geomModelKeys = ["obj", "ctm", "draco", "drc", "fbx"];
    this.createObjectURLEnabled = true;
  }

  initialize(htmlObj, listener) {
    if (this.m_htmlObj == null) {
      this.m_htmlObj = htmlObj;
      this.m_listener = listener;
      this.initDrop(this.m_htmlObj);
    }
  }

  initDrop(htmlObj) {
    // --------------------------------------------- 阻止必要的行为 begin
    htmlObj.addEventListener("dragenter", e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
    htmlObj.addEventListener("dragover", e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
    htmlObj.addEventListener("dragleave", e => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
    htmlObj.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      this.receiveDropFile(e);
    }, false);
  }

  receiveDropFile(e) {
    this.m_files = null;

    if (this.m_listener.isDropEnabled()) {
      let dt = e.dataTransfer; // 只能拽如一个文件或者一个文件夹里面的所有文件。如果文件夹里面有子文件夹则子文件夹中的文件不会载入

      let files = [];
      let filesTotal = 0;
      let filesCurrTotal = 0;

      if (dt.items !== undefined) {
        let items = dt.items; // Chrome有items属性，对Chrome的单独处理

        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let entity = item.webkitGetAsEntry();

          if (entity != null) {
            if (entity.isFile) {
              let file = item.getAsFile(); // console.log("drop a file: ", file);

              files.push(file);
              this.initFilesLoad(files, "drop");
              filesTotal = 1;
            } else if (entity.isDirectory) {
              // let file = item.getAsFile();
              let dr = entity.createReader(); // console.log("drop a dir, dr: ", dr);

              dr.readEntries(entries => {
                filesTotal = entries.length;

                if (filesTotal > 0) {
                  // 循环目录内容
                  entries.forEach(entity => {
                    if (entity.isFile) {
                      entity.file(file => {
                        files.push(file);
                        filesCurrTotal++;

                        if (filesTotal == filesCurrTotal) {
                          this.initFilesLoad(files, "drop");
                        }
                      });
                    }
                  });
                } else {
                  this.alertShow(31);
                }
              });
              break;
            }
          }

          if (filesTotal > 0) {
            break;
          }
        }

        this.m_files = files;
      }
    }
  }

  alertShow(flag) {
    switch (flag) {
      case 31:
        alert("无法找到或无法识别对应的文件");
        break;

      default:
        break;
    }
  }

  initFilesLoad(files, type = "undefine") {
    this.m_files = null;

    if (this.m_listener) {
      this.m_files = files;
      this.m_listener.initFileLoad(this.getFiles(), type);
    }
  }

  testFile(name) {
    let pns = name.toLocaleLowerCase();
    let suffixNS = "";

    if (pns.lastIndexOf(".") > 0) {
      suffixNS = pns.slice(pns.lastIndexOf(".") + 1);
      console.log("suffixNS: ", suffixNS);
    }

    if (this.imgKeys.includes(suffixNS)) {
      return {
        name: name,
        type: suffixNS,
        resType: DropFileController.Image_File,
        url: ""
      };
    } else if (this.geomModelKeys.includes(suffixNS)) {
      return {
        name: name,
        type: suffixNS,
        resType: DropFileController.Geometry_Model_File,
        url: ""
      };
    }

    return null;
  }

  getFiles() {
    let flag = 1;
    let files = this.m_files;

    if (files) {
      if (files.length > 0) {
        let urls = [];

        for (let i = 0; i < files.length; i++) {
          let obj = this.testFile(files[i].name);

          if (obj) {
            if (this.createObjectURLEnabled) {
              obj.url = window.URL.createObjectURL(files[i]);
            } else {
              obj.file = files[i];
            }

            urls.push(obj);
          }
        }

        return urls;
      } else {
        flag = 31;
      }
    }

    this.alertShow(flag);
    return null;
  }

}

DropFileController.Image_File = "image";
DropFileController.Geometry_Model_File = "geometryModel";
exports.DropFileController = DropFileController;

/***/ }),

/***/ "c758":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var RTPType;

(function (RTPType) {
  RTPType[RTPType["FirstRendering"] = 0] = "FirstRendering";
  RTPType[RTPType["CurrRendering"] = 1] = "CurrRendering";
  RTPType[RTPType["SyncRStatus"] = 2] = "SyncRStatus";
  RTPType[RTPType["SyncModelStatus"] = 3] = "SyncModelStatus";
})(RTPType || (RTPType = {}));

exports.RTPType = RTPType;

class RTaskProcess {
  constructor() {
    this.timerDelay = 800;
    this.type = RTPType.FirstRendering;
    this.renderingPhase = "new";
    this.modelPhase = "new";
    this.running = true;
  }

  updateModel(total) {
    if (total > 0) {
      if (this.modelPhase != "finish") {
        this.modelPhase = "finish";
      }
    }
  }

  isAllFinish() {
    return this.isModelFinish() && this.isRenderingFinish();
  }

  isRenderingFinish() {
    let flag = this.renderingPhase == "finish";
    return flag;
  }

  isModelFinish() {
    let flag = this.modelPhase == "finish";
    return flag;
  }

  isRunning() {
    let flag = !this.isModelFinish() || !this.isRenderingFinish();
    return flag;
  }

  isError() {
    let flag = this.renderingPhase == "error" || this.renderingPhase == "rtaskerror";
    flag = flag || this.modelPhase == "error" || this.modelPhase == "rtaskerror";
    return flag;
  }

  toFirstRendering() {
    this.renderingPhase = "new";
    this.modelPhase = "new";
    this.type = RTPType.FirstRendering;
    console.log("RTaskProcess::toFirstRendering() ...");
  }

  isFirstRendering() {
    return this.type == RTPType.FirstRendering;
  }

  toCurrRendering() {
    this.renderingPhase = "new";
    this.timerDelay = 800;
    this.type = RTPType.CurrRendering;
    console.log("RTaskProcess::toCurrRendering() ...");
  }

  isCurrRendering() {
    return this.type == RTPType.CurrRendering;
  }

  toSyncRStatus() {
    this.timerDelay = 2500;
    this.type = RTPType.SyncRStatus;
    console.log("RTaskProcess::toSyncRStatus() ...");
  }

  isSyncRStatus() {
    return this.type == RTPType.SyncRStatus;
  }

  toSyncModelStatus() {
    this.modelPhase = "new";
    this.timerDelay = 1500;
    this.type = RTPType.SyncModelStatus;
    console.log("RTaskProcess::toSyncModelStatus() ...");
  }

  isSyncModelStatus() {
    return this.type == RTPType.SyncModelStatus;
  }

}

exports.RTaskProcess = RTaskProcess;

/***/ }),

/***/ "edb0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DsrdScene_1 = __webpack_require__("7d31");

const DsrdUI_1 = __webpack_require__("24cc");

const RTaskBeginUI_1 = __webpack_require__("8900");

const RTaskSystem_1 = __webpack_require__("b66b");

const HtmlDivUtils_1 = __webpack_require__("7191");

class DsrdShell {
  constructor() {
    this.m_init = true;
    this.m_rscene = new DsrdScene_1.DsrdScene();
    this.m_ui = new DsrdUI_1.DsrdUI();
    this.m_rtaskBeginUI = new RTaskBeginUI_1.RTaskBeginUI();
    this.m_taskSys = new RTaskSystem_1.RTaskSystem();
    this.m_viewerLayer = null; // private m_infoLayer: HTMLDivElement = null;

    this.mIDV = null;
    this.m_workSpaceStatus = 0;
  }

  initialize() {
    console.log("DsrdShell::initialize()......");

    if (this.m_init) {
      this.m_init = false;
      this.m_rscene.ui = this.m_ui;
      this.m_rscene.taskSys = this.m_taskSys;
      this.initWorkSpace();
    }
  }

  initViewLayer() {
    let body = document.body;
    body.style.background = "#121212"; // <link rel="prefetch" href="./page_data/data.json">
    // <link rel="preload" href="./important_data/data.json">

    let b = this.m_viewerLayer;
    b = document.createElement("div");
    let style = b.style;
    style.width = "100vw";
    style.height = "100vh"; // style.backgroundImage = `linear-gradient(to right,#85e085 50%,#ff9999 50%)`;
    // style.backgroundImage = `linear-gradient(to right, #e66465, #9198e0)`;
    // style.backgroundImage = `linear-gradient(to bottom right, #555555, #122233)`;
    // style.backgroundImage = `linear-gradient(to right, #1fa2ff, #12d8fa, #a6ffcb)`;

    style.backgroundImage = `linear-gradient(to right bottom, #159957, #155799)`;
    this.elementCenter(b);
    body.appendChild(b);
    body.style.margin = "0";
    this.m_viewerLayer = b;
  }

  initWorkSpace() {
    this.initViewLayer(); // this.showInfo("init...");

    this.initDSRDUI();
  }

  initDSRDUI() {
    let width = 512;
    let height = 512;
    let borderWidth = 2;
    let borderHeight = 2;
    let container = HtmlDivUtils_1.DivTool.createDivT1(0, 0, width * 2 + borderWidth * 2, height + borderHeight * 2, "block");
    let style = container.style; // style.backgroundColor = "#2b65cb";
    // style.backgroundImage = `linear-gradient(to right bottom, #8ba6d5, #12d8fa, #79a3ef)`;

    style.backgroundImage = `linear-gradient(to right bottom, #5b6f93, #1d91a5, #375283)`;
    let layerLeft = HtmlDivUtils_1.DivTool.createDivT1(borderWidth, borderHeight, width, height, "block");
    style = layerLeft.style;
    style.backgroundColor = "#335533";
    container.appendChild(layerLeft);
    let layerRight = HtmlDivUtils_1.DivTool.createDivT1(width + borderWidth, borderHeight, width, height, "block", "absolute");
    style = layerRight.style;
    style.backgroundColor = "#5b9bd5";
    container.appendChild(layerRight);
    let beginUILayer = HtmlDivUtils_1.DivTool.createDivT1(borderWidth, borderHeight, width * 2, height, "block", "absolute");
    style = beginUILayer.style;
    style.backgroundImage = `linear-gradient(to right bottom, #c0e1d1, #aec7dd)`;
    style.visibility = "hidden";
    container.appendChild(beginUILayer);
    this.m_viewerLayer.appendChild(container);
    this.m_taskSys.initialize();

    this.m_taskSys.onaction = (idns, type) => {
      switch (idns) {
        case "toWorkSpace":
          this.toWorkSpace();
          break;
      }
    };

    this.m_rtaskBeginUI.rtaskSys = this.m_taskSys;

    this.m_rtaskBeginUI.onaction = (idns, type) => {
      switch (idns) {
        case "toWorkSpace":
          this.toWorkSpace();
          break;
      }
    };

    this.m_rtaskBeginUI.initialize(beginUILayer, width * 2, height);
    this.m_rtaskBeginUI.open();
    this.initDSRDSys(layerLeft, layerRight, width, height);
  }

  toWorkSpace() {
    if (this.m_workSpaceStatus == 0) {
      this.m_workSpaceStatus = 1;
      console.log("DsrdShell::toWorkSpace().");
      this.m_rtaskBeginUI.close();
    }
  }

  initDSRDSys(layerLeft, layerRight, width, height) {
    this.m_rscene.initialize(layerLeft);
    this.m_ui.initialize(layerRight, width, height);
  }

  showInfo(str) {
    let div = this.mIDV;

    if (div == null) {
      div = document.createElement("div");
      let style = div.style;
      style.backgroundColor = "rgba(255,255,255,0.1)";
      style.color = "#00ee00";
      style.zIndex = "9100";
      style.position = "absolute";
      this.elementCenter(div); // this.m_infoLayer.appendChild(div);
    }

    div.innerHTML = str;
    this.mIDV = div;
  }

  elementCenter(ele, top = "50%", left = "50%", position = "absolute") {
    const s = ele.style;
    s.textAlign = "center";
    s.display = "flex";
    s.flexDirection = "column";
    s.justifyContent = "center";
    s.alignItems = "center";
  }

}

exports.DsrdShell = DsrdShell;

/***/ }),

/***/ "faa5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const SettingDataPanel_1 = __webpack_require__("a7c5");

const DataItemComponent_1 = __webpack_require__("9bbe");

class EnvDataPanel extends SettingDataPanel_1.SettingDataPanel {
  constructor() {
    super();
  }

  getJsonStr(beginStr = "{", endStr = "}") {
    let jsonStr = `${beginStr}"path":""`;
    return super.getJsonStr(jsonStr, endStr);
  }

  init(viewerLayer) {
    let params = [];
    let param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "type";
    param.name = "环境选择";
    param.textValue = "inner_room";
    param.textContent = "室内";
    param.toText();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "brightness";
    param.name = "环境亮度";
    param.numberValue = 0.7;
    param.inputType = "number";
    param.numberMinValue = 0.0;
    param.numberMaxValue = 3.0;
    param.floatNumberEnabled = true;
    param.editEnabled = true;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "ao";
    param.name = "AO";
    param.numberValue = 0.0;
    param.inputType = "number";
    param.numberMinValue = 0.0;
    param.numberMaxValue = 10.0;
    param.floatNumberEnabled = true;
    param.editEnabled = true;
    param.toNumber();
    params.push(param);
    param = new DataItemComponent_1.DataItemComponentParam();
    param.keyName = "rotation";
    param.name = "旋转角度";
    param.numberValue = 0; // param.unit = "度";

    param.toNumber(); // param.autoEncoding = false;

    params.push(param);
    this.m_params = params;
    let container = this.m_container;
    let startX = 45;
    let startY = 95;
    let disY = 60;
    let py = 0;

    for (let i = 0; i < params.length; ++i) {
      let itemComp = new DataItemComponent_1.DataItemComponent();
      itemComp.x = startX;
      itemComp.y = startY + py;
      itemComp.initialize(container, params[i]);
      this.addItemComp(itemComp);
      py += disY;
    }
  }

}

exports.EnvDataPanel = EnvDataPanel;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("edb0");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });
});