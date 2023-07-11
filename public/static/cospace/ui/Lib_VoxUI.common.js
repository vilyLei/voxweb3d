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

/***/ "0241":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIPanel_1 = __webpack_require__("d632");

const CtrlItemObj_1 = __webpack_require__("7dab");

exports.CtrlInfo = CtrlItemObj_1.CtrlInfo;

const VoxRScene_1 = __webpack_require__("d1de");

const VoxMath_1 = __webpack_require__("f042");

const VoxMaterial_1 = __webpack_require__("0efa");

const SelectionEntity_1 = __webpack_require__("1dcc");

const ProgressEntity_1 = __webpack_require__("822b");

const ColorLabel_1 = __webpack_require__("9ba1");

class ParamCtrlPanel extends UIPanel_1.UIPanel {
  constructor() {
    super();
    /**
     * 边距留白尺寸
     */

    this.m_marginWidth = 10;
    this.m_colorPanel = null;
    this.m_selectedPlane = null;
    this.m_btnMap = new Map();
    this.m_contentW = 0;
    this.m_contentH = 0;
    this.m_initing = true;
    this.m_fontSize = 30;
    this.m_btnPX = 122.0;
    this.m_visiBtns = [];
    this.m_btns = [];
    this.m_menuBtn = null;
    this.m_currUUID = "";
  }

  initialize(scene, rpi, panelW = 300, panelH = 350, marginWidth = 3) {
    if (this.isIniting()) {
      this.init();
      this.m_marginWidth = marginWidth;
      this.m_scene = scene;
      this.m_rpi = rpi;
      this.m_panelW = panelW;
      this.m_panelH = panelH;
      this.buildItems();
    }
  }

  destroy() {
    super.destroy();
  }

  buildPanel(pw, ph) {}

  buildItems() {
    if (this.m_initing) {
      this.m_initing = false;

      if (VoxRScene_1.RendererDevice.IsMobileWeb()) {
        this.m_fontSize = 64;
        this.m_btnPX = 300;
      }

      if (VoxRScene_1.RendererDevice.IsWebGL1()) {
        this.m_btnPX += 32;
        this.m_fontSize = VoxMath_1.MathConst.CalcCeilPowerOfTwo(this.m_fontSize);
      }

      this.m_menuBtn = this.createSelectBtn("", "menuCtrl", "Menu Open", "Menu Close", false, true);
    }
  }

  createSelectBtn(ns, uuid, selectNS, deselectNS, flag, visibleAlways = false) {
    let sc = this.m_scene;
    let selectBar = new SelectionEntity_1.SelectionEntity();
    selectBar.uuid = uuid;
    selectBar.initialize(sc, ns, selectNS, deselectNS, this.m_fontSize);
    selectBar.addEventListener(VoxRScene_1.SelectionEvent.SELECT, this, this.selectChange);

    if (flag) {
      selectBar.select(false);
    } else {
      selectBar.deselect(false);
    }

    this.m_btns.push(selectBar);
    this.addEntity(selectBar);
    return selectBar;
  }

  createProgressBtn(ns, uuid, progress, visibleAlways = false) {
    let sc = this.m_scene;
    let proBar = new ProgressEntity_1.ProgressEntity();
    proBar.uuid = uuid;
    proBar.initialize(sc, ns, this.m_fontSize);
    proBar.setProgress(progress, false);
    proBar.addEventListener(VoxRScene_1.ProgressDataEvent.PROGRESS, this, this.valueChange);
    this.m_btns.push(proBar);
    this.addEntity(proBar);
    return proBar;
  }

  createValueBtn(ns, uuid, value, minValue, maxValue, visibleAlways = false) {
    let sc = this.m_scene;
    let proBar = new ProgressEntity_1.ProgressEntity();
    proBar.uuid = uuid;
    proBar.initialize(sc, ns, this.m_fontSize);
    proBar.setRange(minValue, maxValue);
    proBar.setValue(value, false);
    proBar.addEventListener(VoxRScene_1.ProgressDataEvent.PROGRESS, this, this.valueChange);
    this.m_btns.push(proBar);
    this.addEntity(proBar);
    return proBar;
  }

  openThis() {
    // let sc = this.getScene();
    if (this.m_menuBtn != null) {
      this.menuCtrl(true);
      this.m_menuBtn.deselect(true);
      this.layoutItem();
    }
  }

  closeThis() {
    if (this.m_menuBtn != null) {
      this.menuCtrl(false);
      this.m_menuBtn.select(false);
      if (this.m_selectedPlane != null) this.m_selectedPlane.setVisible(false);
    }
  }

  layout() {}

  layoutPickColorPanel(tar) {
    let panel = this.m_colorPanel;

    if (panel != null && panel.isOpen()) {
      let bounds = tar.getGlobalBounds();
      panel.setXY(bounds.max.x - panel.getWidth(), bounds.max.y + 2);
      panel.setZ(tar.getZ() + 0.3);
      panel.update();
    }
  }

  colorSelectListener(uuid, tar, color) {
    console.log("color select..., tar: ", tar);
    console.log("color select..., this.getScene(): ", this.getScene());
    let panel = this.m_colorPanel;

    if (panel != null && panel.isOpen()) {
      panel.close();
      this.m_colorPanel = null;
    } else {
      let panel = this.getScene().panel.getPanel("colorPickPanel");

      if (panel != null) {
        if (panel.isOpen()) {
          panel.close();
        } else {
          this.m_colorPanel = panel;
          panel.open();
          panel.setPickXY(-1, -1);
          panel.setColor(color);
          this.layoutPickColorPanel(tar);
          panel.setSelectColorCallback((color, pickX, pickY) => {
            console.log("pick color: ", color, pickX, pickY); // this.setColor(color, true);

            this.selectColor(uuid, color);
          });
        }
      }
    }
  }

  moveSelectToBtn(btn) {
    // let bounds = btn.getGlobalBounds();
    this.createSelectPlane(); // let pv = bounds.min;

    let pv = VoxMath_1.VoxMath.createVec3(btn.getX(), btn.getY());
    this.m_selectedPlane.setXY(pv.x, pv.y);
    this.m_selectedPlane.setScaleXY(btn.getWidth(), 3.0);
    this.m_selectedPlane.update();
    this.m_selectedPlane.setVisible(true);
  }

  createSelectPlane() {
    if (this.m_selectedPlane == null) {
      this.m_selectedPlane = new ColorLabel_1.ColorLabel();
      this.m_selectedPlane.initialize(1.0, 1.0); // this.m_selectedPlane.setZ(-1.0 );

      this.m_selectedPlane.depthTest = true;
      this.addEntity(this.m_selectedPlane);
      this.m_selectedPlane.setColor(VoxMaterial_1.VoxMaterial.createColor4(0.05, 0.1, 0.05)); // this.m_selectedPlane.setVisible(false);
    }
  } // "number_value"(数值调节按钮),"progress"(百分比调节按钮),"status_select"(状态选择按钮)


  addItem(param) {
    let map = this.m_btnMap;

    if (!map.has(param.uuid)) {
      let obj = new CtrlItemObj_1.CtrlItemObj();
      obj.param = param;
      obj.type = param.type;
      obj.uuid = param.uuid;
      let t = param;
      let visibleAlways = t.visibleAlways ? t.visibleAlways : false;
      t.colorPick = t.colorPick ? t.colorPick : false;

      switch (param.type) {
        case "number_value":
        case "number":
          t.value = t.value ? t.value : 0.0;
          t.minValue = t.minValue ? t.minValue : 0.0;
          t.maxValue = t.maxValue ? t.maxValue : 10.0;
          obj.btn = this.createValueBtn(t.name, t.uuid, t.value, t.minValue, t.maxValue);
          map.set(obj.uuid, obj);

          if (!t.colorPick) {
            obj.info = {
              type: param.type,
              uuid: param.uuid,
              values: [t.value],
              flag: t.flag
            };
            param.callback(obj.info);
          }

          break;

        case "progress":
          t.progress = t.progress ? t.progress : 0.0;
          obj.btn = this.createProgressBtn(t.name, t.uuid, t.progress, visibleAlways);
          map.set(obj.uuid, obj);

          if (!t.colorPick) {
            obj.info = {
              type: param.type,
              uuid: param.uuid,
              values: [t.progress],
              flag: t.flag
            };
            param.callback(obj.info);
          }

          break;

        case "status":
        case "status_select":
          t.flag = t.flag ? t.flag : false;
          obj.btn = this.createSelectBtn(t.name, t.uuid, t.selectNS, t.deselectNS, t.flag, visibleAlways);
          map.set(obj.uuid, obj);
          obj.info = {
            type: param.type,
            uuid: param.uuid,
            values: [],
            flag: t.flag
          };
          param.callback(obj.info);
          break;

        default:
          break;
      }
    }
  }

  addItems(params) {
    for (let i = 0; i < params.length; ++i) {
      this.addItem(params[i]);
    }
  }

  getItemByUUID(uuid) {
    if (this.m_btnMap.has(uuid)) {
      return this.m_btnMap.get(uuid);
    }

    return null;
  }

  menuCtrl(flag) {
    let ls = this.m_visiBtns;

    if (ls.length > 0) {
      if (flag && !ls[0].isOpen()) {
        for (let i = 0; i < ls.length; ++i) {
          ls[i].open();
        }

        this.m_menuBtn.getPosition(this.m_pos);
        this.m_pos.x = this.m_btnPX;
        this.m_menuBtn.setPosition(this.m_pos);
      } else if (ls[0].isOpen()) {
        for (let i = 0; i < ls.length; ++i) {
          ls[i].close();
        }

        this.m_menuBtn.getPosition(this.m_pos);
        this.m_pos.x = 0;
        this.m_menuBtn.setPosition(this.m_pos);
        if (this.m_selectedPlane != null) this.m_selectedPlane.setVisible(false);
      }
    }

    if (this.m_colorPanel != null) this.m_colorPanel.close();
  }

  layoutItem() {
    if (this.m_menuBtn != null) {
      let disX = 2.0;
      let disY = 2.0;
      let offset = this.m_marginWidth;
      let begin = VoxMath_1.VoxMath.createVec3(offset + disX, offset);
      let pos = begin.clone();
      let maxNameW = 0;
      let btns = this.m_btns;

      for (let i = 0; i < btns.length; ++i) {
        btns[i].update(); // console.log("vw: ", btns[i].getNameWidth());

        if (btns[i].getNameWidth() > maxNameW) {
          maxNameW = btns[i].getNameWidth();
        }
      }

      begin.x += maxNameW;
      let pw = 0.0;
      let py = pos.y;

      for (let i = 0; i < btns.length; ++i) {
        let v = btns[i].getNameWidth(); // console.log("v: ", v);

        v = v > 0 ? v + disX : 0;
        pos.x = begin.x - v;
        btns[i].setPosition(pos);
        btns[i].update();

        if (btns[i].getWidth() > pw) {
          pw = btns[i].getWidth();
        }

        pos.y += btns[i].getHeight() + disY;
      }

      this.m_contentW = pw + offset * 2.0;
      this.m_contentH = pos.y - py + offset * 3.0;
      this.updateBgSize();
    }
  }

  updateBgSize() {
    let pw = this.m_contentW;
    let ph = this.m_contentH;
    let flag = Math.abs(pw - this.m_panelW) > 0.0001;
    flag = flag || Math.abs(ph - this.m_panelH) > 0.0001;

    if (this.m_bgLabel != null && flag) {
      let sx = pw / this.m_panelW;
      let sy = ph / this.m_panelH;
      this.m_bgLabel.setScaleXY(sx, sy);
      this.m_bgLabel.update();
      this.update();
    }
  }

  selectChange(evt) {
    let flag = evt.flag;
    let uuid = evt.uuid;
    let map = this.m_btnMap;

    if (map.has(uuid)) {
      let obj = map.get(uuid);
      obj.sendFlagOut(flag);
      this.moveSelectToBtn(evt.target);
    }

    if (this.m_colorPanel != null) this.m_colorPanel.close();
  }

  selectColor(uuid, color) {
    let map = this.m_btnMap;

    if (map.has(uuid)) {
      let obj = map.get(uuid);
      let param = obj.param;

      if (param.colorPick) {
        obj.sendColorOut(color);
      }
    }
  }

  valueChange(evt) {
    console.log("valueChange(), evt.target: ", evt.target);
    let value = evt.value;
    let uuid = evt.uuid;
    let map = this.m_btnMap;
    let changeFlag = this.m_currUUID != uuid;
    this.m_currUUID = uuid;

    if (map.has(uuid)) {
      let obj = map.get(uuid);
      let param = obj.param;

      if (evt.status == 2) {
        obj.sendValueOut(value);
        if (this.m_colorPanel != null && changeFlag) this.m_colorPanel.close();
      } else if (evt.status == 0) {
        console.log("only select the btn");

        if (param.colorPick) {
          // if (this.m_colorPanel != null && this.m_colorPanel.isClosed()) {
          //     this.m_colorPanel.open();
          // }
          // if (obj.colorId >= 0) this.m_colorPanel.selectColorById(obj.colorId);
          let color = VoxMaterial_1.VoxMaterial.createColor4();
          color.fromArray3(obj.color);
          this.colorSelectListener(evt.uuid, evt.target, color);
        } else {
          if (this.m_colorPanel != null) this.m_colorPanel.close();
        }
      }

      this.moveSelectToBtn(evt.target);
    }
  } // private mouseBgDown(evt: any): void {
  // 	if (this.m_colorPanel != null) this.m_colorPanel.close();
  // }


  addStatusItem(name, uuid, selectNS, deselectNS, flag, callback, visibleAlways = true) {
    let param = {
      type: "status_select",
      name: name,
      uuid: uuid,
      selectNS: selectNS,
      deselectNS: deselectNS,
      flag: flag,
      visibleAlways: visibleAlways,
      callback: callback
    };
    this.addItem(param);
  }

  addProgressItem(name, uuid, progress, callback, colorPick, visibleAlways = true) {
    let param = {
      type: "progress",
      name: name,
      uuid: uuid,
      progress: progress,
      visibleAlways: visibleAlways,
      colorPick: colorPick,
      callback: callback
    };
    this.addItem(param);
  }

  addValueItem(name, uuid, value, minValue, maxValue, callback, colorPick, visibleAlways = true, values) {
    let param = {
      type: "number_value",
      name: name,
      uuid: uuid,
      value: value,
      minValue: minValue,
      maxValue: maxValue,
      visibleAlways: visibleAlways,
      colorPick: colorPick,
      values: values,
      callback: callback
    };
    this.addItem(param);
  }

}

exports.ParamCtrlPanel = ParamCtrlPanel;

/***/ }),

/***/ "05f0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabelBase_1 = __webpack_require__("c21f");

const VoxEntity_1 = __webpack_require__("9b53");

const VoxMesh_1 = __webpack_require__("228b");

const VoxMaterial_1 = __webpack_require__("0efa");

class ClipColorLabel extends ClipLabelBase_1.ClipLabelBase {
  constructor() {
    super(...arguments);
    this.m_colors = null;
    this.m_material = null;
    this.m_fixSize = true;
    this.m_hasTex = false;
  }

  createMesh(atlas, idns) {
    let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
    let vs = new Float32Array(this.createVS(0, 0, this.m_width, this.m_height));
    let mesh = VoxMesh_1.VoxMesh.createRawMesh();
    mesh.reset();
    mesh.setIVS(ivs);
    mesh.addFloat32Data(vs, 3);

    if (idns != "" && atlas != null) {
      let obj = atlas.getTexObjFromAtlas(idns);
      let uvs = new Float32Array(obj.uvs);
      mesh.addFloat32Data(uvs, 2);
    }

    mesh.initialize();
    return mesh;
  }

  hasTexture() {
    return this.m_hasTex;
  }

  initialize(atlas, idns, colorsTotal) {
    if (this.isIniting() && colorsTotal > 0) {
      this.init();
      this.m_hasTex = false;
      let tex = null;

      if (idns != "" && atlas != null) {
        let obj = atlas.getTexObjFromAtlas(idns);

        if (this.m_fixSize) {
          this.m_width = obj.getWidth();
          this.m_height = obj.getHeight();
        }

        this.m_hasTex = true;
        tex = obj.texture;
      }

      let material = this.createMaterial(tex);
      let mesh = this.createMesh(atlas, idns);
      let et = VoxEntity_1.VoxEntity.createDisplayEntity();
      et.setMaterial(material);
      et.setMesh(mesh);
      this.m_entities.push(et);
      this.m_material = material;
      let colors = new Array(colorsTotal);

      for (let i = 0; i < colorsTotal; ++i) {
        colors[i] = VoxMaterial_1.VoxMaterial.createColor4();
      }

      this.m_colors = colors;
      this.m_total = colorsTotal;
      this.setClipIndex(0);
    }
  }

  initializeWithoutTex(width, height, colorsTotal) {
    this.m_width = width;
    this.m_height = height;
    this.m_fixSize = false;
    this.initialize(null, "", colorsTotal);
  }

  initializeWithSize(width, height, atlas, idns, colorsTotal) {
    if (width > 0 && height > 0) {
      this.m_width = width;
      this.m_height = height;
      this.m_fixSize = false;
      this.initialize(atlas, idns, colorsTotal);
    }
  }

  initializeWithLable(srcLable) {
    if (this.isIniting() && srcLable != null && srcLable != this) {
      if (srcLable.getClipsTotal() < 1) {
        throw Error("Error: srcLable.getClipsTotal() < 1");
      }

      let ls = srcLable.getREntities();

      for (let i = 0; i < ls.length; ++i) {
        let entity = ls[i];
        let mesh = entity.getMesh();
        let tex = entity.getMaterial().getTextureAt(0);
        let n = this.m_total = srcLable.getClipsTotal();
        let src = srcLable.getColors();
        let colors = new Array(n);

        for (let i = 0; i < n; ++i) {
          colors[i] = VoxMaterial_1.VoxMaterial.createColor4();
          colors[i].copyFrom(src[i]);
        }

        this.m_colors = colors;
        this.m_width = srcLable.getWidth();
        this.m_height = srcLable.getHeight();
        let material = this.createMaterial(tex);
        let et = VoxEntity_1.VoxEntity.createDisplayEntity();
        et.setMaterial(material);
        et.setMesh(mesh);
        this.m_entities.push(et);
        if (this.m_material == null) this.m_material = material;
      }

      this.setClipIndex(0);
    }
  }

  displaceFromLable(srcLable) {
    if (srcLable != null && srcLable != this) {
      if (srcLable.getClipsTotal() < 1) {
        throw Error("Error: srcLable.getClipsTotal() < 1");
      } // if (this.m_entities == null) {
      // 	this.initializeWithLable(srcLable);
      // } else if (this.m_entities[0].isRFree()) {
      // }

    }
  }

  getColorAt(i) {
    if (i >= 0 && i < this.m_total) {
      return this.m_colors[i];
    }
  }

  setColorAt(i, color4) {
    if (i >= 0 && i < this.m_total && color4 != null) {
      this.m_colors[i].copyFrom(color4);
    }
  }

  setColors(colors) {
    if (colors != null) {
      let ls = this.m_colors;
      let len = colors.length;

      if (len > ls.length) {
        len = ls.length;
      }

      for (let i = 0; i < len; ++i) {
        ls[i].copyFrom(colors[i]);
      }

      if (len == 3 && ls.length == 4) {
        ls[3].copyFrom(colors[1]);
      }

      this.setClipIndex(this.m_index);
    }
  }

  setColorsWithHex(colors) {
    if (colors != null) {
      let ls = this.m_colors;
      let len = colors.length;

      if (len > ls.length) {
        len = ls.length;
      }

      for (let i = 0; i < len; ++i) {
        ls[i].setRGBUint24(colors[i]);
      }

      if (len == 3 && ls.length == 4) {
        ls[3].setRGBUint24(colors[1]);
      }

      this.setClipIndex(this.m_index);
    }
  }

  setClipIndex(i) {
    if (i >= 0 && i < this.m_total) {
      this.m_index = i;
      this.m_material.setColor(this.m_colors[i]);
    }
  }

  getColors() {
    return this.m_colors;
  }

}

exports.ClipColorLabel = ClipColorLabel;

/***/ }),

/***/ "0aa4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 光标移入的信息提示系统
 */

class TipsSystem {
  constructor() {
    this.m_tipEntity = null;
  }

  initialize(uiscene, rpi = 2) {
    if (this.m_tipEntity == null) {
      this.m_uiscene = uiscene;
      let tip = Lib_VoxUI.createRectTextTip();
      tip.initialize(uiscene, rpi);
      this.m_tipEntity = tip;
    }
  }
  /**
   * get tip entity
   * @param type the default value is 0
   * @returns IRectTextTip instance
   */


  getTipEntity(type) {
    return this.m_tipEntity;
  }
  /**
   * @param entity IMouseEvtUIEntity instance
   * @param type the default value is 0
   */


  addTipsTarget(entity, type) {
    this.m_tipEntity.addEntity(entity);
  }
  /**
   * @param entity IMouseEvtUIEntity instance
   * @param type the default value is 0
   */


  removeTipsTarget(entity, type) {
    this.m_tipEntity.removeEntity(entity);
  }

  destroy() {}

}

exports.TipsSystem = TipsSystem;

/***/ }),

/***/ "0b77":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class UIEntityBase {
  constructor() {
    this.m_sc = null;
    this.m_parent = null;
    this.m_rotation = 0;
    this.m_visible = true;
    this.m_entities = [];
    this.m_width = 0;
    this.m_height = 0;
    this.m_v0 = null;
    this.m_bounds = null;
    this.m_rcontainer = null;
    this.premultiplyAlpha = false;
    this.transparent = false;
    this.info = null;
    this.depthTest = false;
  }

  init() {
    if (this.isIniting()) {
      this.m_pos = CoMath.createVec3();
      this.m_scaleV = CoMath.createVec3(1.0, 1.0, 1.0);
      this.m_v0 = CoMath.createVec3();
      this.m_bounds = CoMath.createAABB();
    }
  }

  isIniting() {
    return this.m_bounds == null;
  }

  createMaterial(tex = null) {
    let material = CoMaterial.createDefaultMaterial();
    material.premultiplyAlpha = this.premultiplyAlpha;

    if (tex != null) {
      material.setTextureList([tex]);
    }

    material.initializeByCodeBuf(tex != null);
    return material;
  }

  applyRST(entity) {
    const RST = CoRScene.RendererState;

    if (this.transparent) {
      if (this.premultiplyAlpha) {
        // entity.setRenderState(RST.BACK_ALPHA_ADD_BLENDSORT_STATE);
        entity.setRenderState(RST.BACK_ALPHA_ADD_ALWAYS_STATE);
      } else {
        if (this.depthTest) {
          entity.setRenderState(RST.BACK_TRANSPARENT_STATE);
        } else {
          entity.setRenderState(RST.BACK_TRANSPARENT_ALWAYS_STATE);
        }
      }
    } else {
      if (this.depthTest) {
        entity.setRenderState(RST.NORMAL_STATE);
      } else {
        entity.setRenderState(RST.BACK_NORMAL_ALWAYS_STATE);
      }
    }
  }

  createVS(startX, startY, pwidth, pheight) {
    let minX = startX;
    let minY = startY;
    let maxX = startX + pwidth;
    let maxY = startY + pheight;
    let pz = 0.0;
    return [minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz];
  }

  updateScene() {}

  updateParent() {}

  __$setScene(sc) {
    if (this.m_sc != sc) {
      this.m_sc = sc;
      this.updateScene();
    }
  }

  getScene() {
    return this.m_sc;
  }

  setParent(parent) {
    if (parent != this) {
      this.m_parent = parent;
      this.updateParent();
    }

    return this;
  }

  getParent() {
    return this.m_parent;
  }

  getGlobalBounds() {
    return this.m_bounds;
  }

  setVisible(v) {
    this.m_visible = v;
    let ls = this.m_entities;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].setVisible(v);
    }

    if (this.m_rcontainer != null) {
      this.m_rcontainer.setVisible(v);
    }
  }

  isVisible() {
    return this.m_visible;
  }

  getWidth() {
    return this.m_bounds.getWidth();
  }

  getHeight() {
    return this.m_bounds.getHeight();
  }

  setPosition(pv) {
    this.m_pos.copyFrom(pv);
  }

  setX(x) {
    this.m_pos.x = x;
  }

  setY(y) {
    this.m_pos.y = y;
  }

  setZ(z) {
    this.m_pos.z = z;
  }

  getX() {
    return this.m_pos.x;
  }

  getY() {
    return this.m_pos.y;
  }

  getZ() {
    return this.m_pos.z;
  }

  setXY(px, py) {
    this.m_pos.x = px;
    this.m_pos.y = py;
  }

  setXYZ(px, py, pz) {
    this.m_pos.setXYZ(px, py, pz);
  }

  getPosition(pv) {
    pv.copyFrom(this.m_pos);
    return pv;
  }

  setRotation(r) {
    this.m_rotation = r;
  }

  getRotation() {
    return this.m_rotation;
  }

  setScaleXYZ(sx, sy, sz) {
    this.m_scaleV.setXYZ(sx, sy, sz);
  }

  setScaleXY(sx, sy) {
    this.setScaleXYZ(sx, sy, 1.0);
  }

  setScaleX(sx) {
    this.m_scaleV.x = sx;
  }

  setScaleY(sy) {
    this.m_scaleV.y = sy;
  }

  getScaleX() {
    return this.m_scaleV.x;
  }

  getScaleY() {
    return this.m_scaleV.y;
  }

  copyTransformFrom(src) {
    if (src != null) {
      let sx = src.getScaleX();
      let sy = src.getScaleY();
      let r = src.getRotation();
      this.setScaleXY(sx, sy);
      this.setRotation(r);
      src.getPosition(this.m_v0);
      this.setPosition(this.m_v0);
    }
  }
  /**
   * get renderable entities for renderer scene
   * @returns ITransformEntity instance list
   */


  getREntities() {
    return this.m_entities.slice(0);
  }

  getRContainer() {
    return this.m_rcontainer;
  }

  updateEntity(e) {
    // console.log("XXXXX UIEntiyBase::this.m_pos: ", this.m_pos, e);
    e.setPosition(this.m_pos);
    e.setScale3(this.m_scaleV);
    e.setRotationXYZ(0.0, 0.0, this.m_rotation);
    e.update();
    this.m_bounds.union(e.getGlobalBounds());
  }

  update() {
    let ls = this.m_entities;
    let bs = this.m_bounds;
    this.m_bounds.reset();

    for (let i = 0; i < ls.length; ++i) {
      // let e = ls[i];
      // e.setPosition(this.m_pos);
      // e.setScale3(this.m_scaleV);
      // e.setRotationXYZ(0.0, 0.0, this.m_rotation);
      // e.update();
      // bs.union(e.getGlobalBounds());
      this.updateEntity(ls[i]);
    }

    if (this.m_rcontainer != null) {
      this.updateEntity(this.m_rcontainer);
    }

    bs.updateFast();
  }

  destroy() {
    let sc = this.m_sc;

    if (sc != null) {
      sc.removeEntity(this);
    }

    this.m_rcontainer = null;
    this.m_sc = null;
    this.m_parent = null;
    this.m_bounds = null;
    let ls = this.m_entities;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].destroy();
    }

    ls = [];
  }

}

exports.UIEntityBase = UIEntityBase;

/***/ }),

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

/***/ "189a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const LayouterBase_1 = __webpack_require__("5470");

class RightTopLayouter extends LayouterBase_1.LayouterBase {
  constructor() {
    super();
    this.m_offsetvs = [];
  }

  update(rect) {
    const ls = this.m_entities;
    const len = ls.length;
    let pv = CoMath.createVec3();

    for (let i = 0; i < len; ++i) {
      pv.copyFrom(this.m_offsetvs[i]);
      pv.x = rect.width - pv.x;
      pv.y = rect.height - pv.y;
      pv.addBy(this.m_offsetV);
      ls[i].setPosition(pv);
      ls[i].update();
    }
  }

  initEntityLayout(entity, initRect) {
    let pv = CoMath.createVec3();
    entity.getPosition(pv);
    pv.x = initRect.width - pv.x;
    pv.y = initRect.height - pv.y;
    this.m_offsetvs.push(pv);
  }

  destroy() {
    this.m_offsetvs = null;
    super.destroy();
  }

}

exports.RightTopLayouter = RightTopLayouter;

/***/ }),

/***/ "1dcc":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const VoxRScene_1 = __webpack_require__("d1de");

const CompEntityBase_1 = __webpack_require__("5ea3");

class SelectionEntity extends CompEntityBase_1.CompEntityBase {
  constructor() {
    super();
    this.m_currEvent = null;
    this.m_nameItem = null;
    this.m_flagItem = null;
    this.m_flag = true;
    this.m_nameWidth = 0.0;
    this.uuid = "SelectionEntity";
  }
  /**
   * 选中
   * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
   */


  select(sendEvtEnabled = false) {
    if (!this.m_flag) {
      this.m_flag = true;
      this.updateState();
      if (sendEvtEnabled) this.sendEvt();
    }
  }
  /**
   * 取消选中
   * @param sendEvtEnabled 是否发送取消选中的事件。 如果不发送事件，则只会改变状态。
   */


  deselect(sendEvtEnabled = false) {
    if (this.m_flag) {
      this.m_flag = false;
      this.updateState();
      if (sendEvtEnabled) this.sendEvt();
    }
  }

  setFlag(flag, sendEvtEnabled = false) {
    if (flag) {
      this.select(sendEvtEnabled);
    } else {
      this.deselect(sendEvtEnabled);
    }
  }

  isSelected() {
    return this.m_flag;
  }

  nameBtnMouseDown(evt) {
    if (this.m_enabled) {
      this.m_flag = !this.m_flag;
      this.updateState();
      this.sendEvt();
    }
  }

  sendEvt() {
    let t = this.m_currEvent;
    t.target = this;
    t.type = VoxRScene_1.SelectionEvent.SELECT;
    t.flag = this.m_flag;
    t.phase = 1;
    t.uuid = this.uuid;
    this.m_dispatcher.dispatchEvt(t);
    t.target = null;
  }

  updateState() {
    this.m_flagItem.label.setClipIndex(this.m_flag ? 0 : 1);
  }

  btnMouseUp(evt) {
    if (this.m_enabled) {
      this.m_flag = !this.m_flag;
      this.updateState();
      this.sendEvt();
    }
  }

  destroy() {
    super.destroy();

    if (this.m_flagItem != null) {
      this.m_nameItem.destroy();
      this.m_nameItem = null;
      this.m_flagItem.destroy();
      this.m_flagItem = null;
      this.m_dispatcher.destroy();
      this.m_dispatcher = null;
    }
  }

  getNameWidth() {
    return this.m_nameWidth;
  }
  /**
   * @param uisc IVoxUIScene instance
   * @param btnName btn name, the default value is "select"
   * @param select_name btn selecting status name, the default value is "Yes"
   * @param deselect_name btn deselecting status name, the default value is "No"
   * @param fontSize font size, the default value is 30
   * @param nameWidth btn name part width, the default value is 70
   * @param statusWidth btn status part width, the default value is 50
   * @param height btn height, the default value is 40
   */


  initialize(uisc, btnName = "select", select_name = "Yes", deselect_name = "No", fontSize = 30.0, nameWidth = 70, statusWidth = 50, height = 40) {
    if (this.isIniting()) {
      this.init();
      let dis = 2.0;
      this.m_dispatcher = VoxRScene_1.VoxRScene.createEventBaseDispatcher();
      this.m_currEvent = VoxRScene_1.VoxRScene.createSelectionEvent();

      if (btnName != "") {
        let nameItem = this.createBtn("name", uisc, [btnName], fontSize, nameWidth, height);
        this.addEntity(nameItem.button);
        this.m_nameWidth = nameItem.button.getWidth();
        this.m_nameItem = nameItem;
        nameItem.button.addEventListener(VoxRScene_1.MouseEvent.MOUSE_DOWN, this, this.nameBtnMouseDown);
      }

      let flagItem = this.createBtn("flag", uisc, [select_name, deselect_name], fontSize, statusWidth, height);

      if (btnName != "") {
        flagItem.button.setX(this.m_nameWidth + dis);
      }

      this.addEntity(flagItem.button);
      this.m_flagItem = flagItem;
      flagItem.button.addEventListener(VoxRScene_1.MouseEvent.MOUSE_UP, this, this.btnMouseUp);
    }
  }

}

exports.SelectionEntity = SelectionEntity;

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

/***/ "228b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ModuleLoader_1 = __webpack_require__("75f5");

class T_CoMesh {
  constructor() {
    this.m_init = true;
  }

  initialize(callback = null, url = "") {
    this.m_init = !this.isEnabled();

    if (this.m_init) {
      this.m_init = false;

      if (url == "" || url === undefined) {
        url = "static/cospace/comesh/CoMesh.umd.min.js";
      }

      new ModuleLoader_1.ModuleLoader(1, () => {
        if (callback != null && this.isEnabled()) callback([url]);
      }).load(url);
      return true;
    }

    return false;
  }

  isEnabled() {
    return typeof CoMesh !== "undefined";
  }
  /**
   * plane mesh builder
   */


  get plane() {
    return CoMesh.plane;
  }
  /**
   * line mesh builder
   */


  get line() {
    return CoMesh.line;
  }
  /**
   * cone mesh builder
   */


  get cone() {
    return CoMesh.cone;
  }
  /**
   * box mesh builder
   */


  get box() {
    return CoMesh.box;
  }
  /**
   * box mesh builder
   */


  get sphere() {
    return CoMesh.sphere;
  }

  createDataMesh() {
    return CoMesh.createDataMesh();
  }

  createRawMesh() {
    return CoMesh.createRawMesh();
  }

  createBoundsMesh() {
    return CoMesh.createBoundsMesh();
  }

}

const VoxMesh = new T_CoMesh();
exports.VoxMesh = VoxMesh;

/***/ }),

/***/ "23ac":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("0b77");

class UIEntityContainer extends UIEntityBase_1.UIEntityBase {
  constructor(init = false) {
    super();
    this.m_uientities = [];

    if (init) {
      this.init();
    }
  }

  init() {
    if (this.isIniting()) {
      super.init();
      this.m_rcontainer = CoRScene.createDisplayEntityContainer();
    }
  }

  addedEntity(entity) {}

  removedEntity(entity) {}

  update() {
    for (let i = 0; i < this.m_uientities.length; ++i) {
      this.m_uientities[i].update();
    }

    if (this.m_rcontainer != null) {
      this.m_rcontainer.update();
    }

    super.update();
  }

  addEntity(entity) {
    if (entity != null) {
      let i = 0;

      for (; i < this.m_uientities.length; ++i) {
        if (this.m_uientities[i] == entity) break;
      }

      if (i >= this.m_uientities.length) {
        this.m_uientities.push(entity);
        entity.update();
        let container = entity.getRContainer();

        if (container != null) {
          this.m_rcontainer.addChild(container);
        }

        let ls = entity.getREntities();

        for (let k = 0; k < ls.length; ++k) {
          this.m_rcontainer.addEntity(ls[k]);
        }

        this.addedEntity(entity);
      }
    }
  }

  removeEntity(entity) {
    if (entity != null) {
      let i = 0;

      for (; i < this.m_uientities.length; ++i) {
        if (this.m_uientities[i] == entity) {
          this.m_uientities.splice(i, 1);
          let container = entity.getRContainer();

          if (container != null) {
            this.m_rcontainer.removeChild(container);
          }

          let ls = entity.getREntities();

          for (let k = 0; k < ls.length; ++k) {
            this.m_rcontainer.removeEntity(ls[k]);
          }

          this.removedEntity(entity);
          break;
        }
      }
    }
  }

  globalToLocal(pv) {
    this.m_rcontainer.globalToLocal(pv);
  }

  localToGlobal(pv) {
    this.m_rcontainer.localToGlobal(pv);
  }

  getEneitysTotal() {
    return this.m_uientities.length;
  }

}

exports.UIEntityContainer = UIEntityContainer;

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

/***/ "2b5a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CtrlInfo_1 = __webpack_require__("4041");

exports.CtrlInfo = CtrlInfo_1.CtrlInfo;
exports.ItemCallback = CtrlInfo_1.ItemCallback;

/***/ }),

/***/ "36f3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const LayouterBase_1 = __webpack_require__("5470");

class FreeLayouter extends LayouterBase_1.LayouterBase {
  constructor() {
    super();
    this.m_offsetvs = [];
  }

  update(rect) {
    const ls = this.m_entities;
    const len = ls.length;

    for (let i = 0; i < len; ++i) {
      ls[i].update();
    }
  }

  initEntityLayout(entity, initRect) {
    let pv = CoMath.createVec3();
    entity.getPosition(pv);
    pv.y = initRect.height - pv.y;
    this.m_offsetvs.push(pv);
  }

  destroy() {
    this.m_offsetvs = null;
    super.destroy();
  }

}

exports.FreeLayouter = FreeLayouter;

/***/ }),

/***/ "38b3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("0b77");

class TextLabel extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_pw = 10;
    this.m_ph = 10;
    this.m_sx = 1.0;
    this.m_sy = 1.0; // private m_rpi = 0;

    this.m_material = null;
    this.m_tex = null;
    this.m_fontSize = 24;
    this.m_text = "";
  }

  initialize(text, uiScene, fontSize = 24) {
    if (text != "" && this.isIniting()) {
      if (fontSize < 8) fontSize = 8;
      this.m_fontSize = fontSize;
      this.init(); // this.transparent = true;
      // this.premultiplyAlpha = true;

      this.m_text = text;
      this.m_uiScene = uiScene;
      let entity = CoEntity.createDisplayEntity();
      this.m_fontColor = CoMaterial.createColor4();
      this.m_bgColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0);
      let img = this.m_uiScene.texAtlas.createCharsImage(this.m_text, this.m_fontSize, this.m_fontColor, this.m_bgColor);
      this.m_tex = uiScene.rscene.textureBlock.createImageTex2D(img.width, img.height);
      this.m_tex.setDataFromImage(img);
      this.m_tex.flipY = true;
      this.m_tex.premultiplyAlpha = true; //this.premultiplyAlpha;

      this.m_tex.minFilter = CoRScene.TextureConst.LINEAR;
      this.m_tex.magFilter = CoRScene.TextureConst.NEAREST;
      let material = this.createMaterial(this.m_tex);
      this.m_material = material;
      CoMesh.plane.setBufSortFormat(material.getBufSortFormat());
      let mesh = CoMesh.plane.createXOY(0, 0, 1.0, 1.0);
      this.m_pw = img.width;
      this.m_ph = img.height;
      entity.setMaterial(material);
      entity.setMesh(mesh);
      this.m_entities.push(entity);
      this.applyRST(entity);
      super.setScaleXY(this.m_sx * this.m_pw, this.m_sy * this.m_ph);
      this.update();
    }
  }

  setScaleXY(sx, sy) {
    this.m_sx = sx;
    this.m_sy = sy;
    super.setScaleXY(sx * this.m_pw, sy * this.m_ph);
  }

  setScaleX(sx) {
    this.m_sx = sx;
    super.setScaleX(sx * this.m_pw);
  }

  setScaleY(sy) {
    this.m_sy = sy;
    super.setScaleX(sy * this.m_ph);
  }

  getScaleX() {
    return this.m_sx;
  }

  getScaleY() {
    return this.m_sy;
  }

  setText(text) {
    if (this.m_tex != null && text != "" && this.m_text != text) {
      this.m_text = text;
      let img = this.m_uiScene.texAtlas.createCharsImage(text, this.m_fontSize, this.m_fontColor, this.m_bgColor);
      this.m_tex.setDataFromImage(img, 0, 0, 0, true);
      this.m_tex.updateDataToGpu();
      this.m_pw = img.width;
      this.m_ph = img.height;
      super.setScaleXY(this.m_sx * this.m_pw, this.m_sy * this.m_ph);
      this.update();
    }
  }

  getText() {
    return this.m_text;
  }

  setColor(c) {
    this.m_fontColor.copyFrom(c);

    if (this.m_material != null) {
      this.m_material.setColor(c);
    }

    return this;
  }

  getColor() {
    return this.m_fontColor;
  }

  destroy() {
    super.destroy();
    this.m_material = null;
    this.m_uiScene = null;
    this.m_tex = null;
  }

}

exports.TextLabel = TextLabel;

/***/ }),

/***/ "4041":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/***/ }),

/***/ "5470":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class LayouterBase {
  constructor() {
    this.m_entities = [];
    this.m_opvs = [];
    this.m_initRect = null;
    this.m_offsetV = CoMath.createVec3();
  }

  setOffset(offsetV) {
    this.m_offsetV.copyFrom(offsetV);
  }

  addUIEntity(entity) {
    if (entity != null) {
      let i = 0;

      for (; i < this.m_entities.length; ++i) {
        if (this.m_entities[i] == entity) break;
      }

      if (i >= this.m_entities.length) {
        let pv = CoMath.createVec3();
        entity.getPosition(pv);
        this.m_opvs.push(pv);
        this.m_entities.push(entity);

        if (this.m_initRect != null) {
          this.initEntityLayout(entity, this.m_initRect);
        }
      }
    }
  }

  removeUIEntity(entity) {
    if (entity != null) {
      let i = 0;

      for (; i < this.m_entities.length; ++i) {
        if (this.m_entities[i] == entity) {
          this.m_entities.splice(i, 1);
          this.m_opvs.splice(i, 1);
          break;
        }
      }
    }
  }

  initLayout(rect) {
    if (rect != null) {
      if (this.m_initRect != null) {
        this.m_initRect.copyFrom(rect);
      } else {
        this.m_initRect = rect.clone();
      }

      let ls = this.m_entities;

      for (let i = 0; i < ls.length; ++i) {
        this.initEntityLayout(ls[i], this.m_initRect);
      }
    }
  }

  initEntityLayout(entity, initRect) {}

  applyLayout(entity) {}

  update(rect) {}

  destroy() {}

}

exports.LayouterBase = LayouterBase;

/***/ }),

/***/ "5ea3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const VoxMaterial_1 = __webpack_require__("0efa");

const Button_1 = __webpack_require__("88b9");

const ClipColorLabel_1 = __webpack_require__("05f0");

const ClipLabel_1 = __webpack_require__("f35d");

const UIEntityContainer_1 = __webpack_require__("23ac");

const VoxRScene_1 = __webpack_require__("d1de");

class ButtonItem {
  constructor(pbutton, plabel, pBgLabel) {
    this.button = pbutton;
    this.label = plabel;
    this.bgLabel = pBgLabel;
  }

  destroy() {
    if (this.button != null) {
      this.button.destroy();
      this.button = null;
    }

    if (this.bgLabel != null) {
      this.bgLabel.destroy();
      this.bgLabel = null;
    }

    if (this.label != null) {
      this.label.destroy();
      this.label = null;
    }
  }

}

exports.ButtonItem = ButtonItem;

class CompEntityBase extends UIEntityContainer_1.UIEntityContainer {
  constructor() {
    super();
    this.m_enabled = true;
    this.m_dispatcher = null;
    this.m_fontColor = null;
    this.m_fontBgColor = null;
    this.m_bgColors = null;
    this.uuid = "CompEntityBase";
  }

  enable() {
    this.m_enabled = true;
  }

  disable() {
    this.m_enabled = false;
  }

  open() {
    this.setVisible(true);
  }

  close() {
    this.setVisible(false);
  }

  isOpen() {
    return this.isVisible();
  }

  isClosed() {
    return !this.isVisible();
  }

  getNameWidth() {
    return 0.0;
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
  }

  removeEventListener(type, listener, func) {
    this.m_dispatcher.removeEventListener(type, listener, func);
  }

  setFontColor(fontColor, bgColor) {
    this.m_fontColor = fontColor;
    this.m_fontBgColor = bgColor;
  }

  setBGColors(colors) {
    if (colors == null) {
      throw Error("colors == null !!!");
    }

    if (colors.length < 4) {
      throw Error("colors.length < 4 !!!");
    }

    this.m_bgColors = colors;
  }

  setFontColorWithARGBUint32(fontColor, bgColor) {
    this.m_fontColor = VoxRScene_1.VoxRScene.createColor4().setARGBUint32(fontColor);
    this.m_fontBgColor = VoxRScene_1.VoxRScene.createColor4().setARGBUint32(bgColor);
  }

  setBGColorsWithARGBUint32(colors) {
    if (colors == null) {
      throw Error("colors == null !!!");
    }

    if (colors.length < 4) {
      throw Error("colors.length < 4 !!!");
    }

    this.m_bgColors = [];

    for (let i = 0; i < colors.length; ++i) {
      this.m_bgColors.push(VoxRScene_1.VoxRScene.createColor4().setARGBUint32(colors[i]));
    }
  }

  destroy() {
    super.destroy();
    this.m_fontColor = null;
    this.m_fontBgColor = null;
    this.m_bgColors = null;
  }

  createBgLabel(pw, ph, intensity = 1.0) {
    let bgLabel = new ClipColorLabel_1.ClipColorLabel();
    bgLabel.initializeWithoutTex(pw, ph, 4);
    let sls = this.m_bgColors;
    let dcls = bgLabel.getColors();

    if (sls == null) {
      bgLabel.getColorAt(0).setRGB3f(0.2, 0.2, 0.2);
      bgLabel.getColorAt(1).setRGB3f(0.3, 0.3, 0.3);
      bgLabel.getColorAt(2).setRGB3f(0.2, 0.6, 1.0);
      bgLabel.getColorAt(3).setRGB3f(0.3, 0.3, 0.3);
    } else {
      for (let i = 0; i < dcls.length; ++i) {
        dcls[i].copyFrom(sls[i]);
      }
    }

    for (let i = 0; i < dcls.length; ++i) {
      const c = dcls[i];
      c.r *= intensity;
      c.g *= intensity;
      c.b *= intensity;
    }

    bgLabel.setClipIndex(0);
    return bgLabel;
  }

  createBtn(uuid, uisc, urls, fontSize, pw, ph, intensity = 1.0) {
    let img;
    let tta = uisc.transparentTexAtlas;
    let nameLabel = null;
    let fontColor = this.m_fontColor != null ? this.m_fontColor : VoxMaterial_1.VoxMaterial.createColor4(1, 1, 1, 1);
    let bgColor = this.m_fontBgColor != null ? this.m_fontBgColor : VoxMaterial_1.VoxMaterial.createColor4(1, 1, 1, 0);

    if (urls != null && urls.length > 0) {
      for (let i = 0; i < urls.length; ++i) {
        // img = tta.createCharsCanvasFixSize(pw, ph, urls[i], fontSize, fontColor, bgColor);
        img = tta.createCharsCanvasWithSize(pw, ph, 6, 4, urls[i], fontSize, fontColor, bgColor);
        tta.addImageToAtlas(urls[i], img);
      }

      nameLabel = new ClipLabel_1.ClipLabel();
      nameLabel.transparent = true;
      nameLabel.premultiplyAlpha = true;
      nameLabel.initialize(tta, urls);
      nameLabel.update();
      pw = nameLabel.getWidth();
    }

    let bgLabel = this.createBgLabel(pw, ph, intensity);
    let btn = new Button_1.Button();
    if (uuid != "") btn.uuid = uuid;

    if (urls != null && urls.length > 0) {
      btn.syncLabelClip = false;
      btn.addLabel(nameLabel);
    }

    btn.initializeWithLable(bgLabel);
    btn.update();
    return new ButtonItem(btn, nameLabel, bgLabel);
  }

}

exports.CompEntityBase = CompEntityBase;

/***/ }),

/***/ "677d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class AxisAlignCalc {
  constructor() {}

  calcRange(size, factor = 0.7, centerPercent = 0.5) {
    if (centerPercent < 0.0) centerPercent = 0.0;else if (centerPercent > 1.0) centerPercent = 1.0;
    if (factor < 0.0) factor = 0.0;else if (factor > 1.0) factor = 1.0;
    let content = size * (1.0 - factor);
    let p = centerPercent * size;
    let max = p + content * 0.5;
    if (max > size) max = size;
    let min = max - content;
    return [min, max];
  }

  avgLayout(sizes, min, max, minGap = -1) {
    if (sizes != null && sizes.length > 0) {
      let len = sizes.length;

      switch (len) {
        case 1:
          let px = 0.5 * (max - min) + min;
          return [px - 0.5 * sizes[0]];
          break;

        default:
          return this.calcAvgMulti(sizes, min, max, minGap);
          break;
      }
    }

    return null;
  }

  calcAvgLayout(itemSizes, bgSize, marginFactor = 0.7, centerPercent = 0.5) {
    let range = this.calcRange(bgSize, marginFactor, centerPercent);
    return this.avgLayout(itemSizes, range[0], range[1]);
  }

  calcAvgFixLayout(itemSizes, bgSize, minGap = 10.0, marginFactor = 0.7, centerPercent = 0.5) {
    let range = this.calcRange(bgSize, marginFactor, centerPercent);
    return this.avgLayout(itemSizes, range[0], range[1], minGap);
  }

  calcAvgMulti(sizes, min, max, minGap = -1) {
    let dis = max - min;
    let len = sizes.length;
    let size = 0.0;

    for (let i = 0; i < len; i++) {
      size += sizes[i];

      if (minGap > 0.0 && i > 0) {
        size += minGap;
      }
    }

    let list = new Array(len);
    list[0] = min;
    list[len - 1] = max - sizes[len - 1];

    if (len > 2) {
      if (size < dis) {
        let dl = (dis - size) / (len - 1);
        len--;

        for (let i = 1; i < len; i++) {
          list[i] = list[i - 1] + sizes[i - 1] + dl;
        }
      } else {
        if (minGap <= 0.0) {
          let p0 = list[0] + 0.5 * sizes[0];
          dis = list[len - 1] + 0.5 * sizes[len - 1] - p0;
          let dl = dis / (len - 1);
          p0 += dl;
          len--;

          for (let i = 1; i < len; i++) {
            list[i] = p0;
            p0 += dl;
          }
        }
      }
    }

    if (size >= dis) {
      if (minGap > 0.0) {
        let p0 = dis * 0.5 + min - (size + (len - 1) * minGap) * 0.5;

        for (let i = 0; i < len; i++) {
          list[i] = p0;
          p0 += sizes[i] + minGap;
        }
      }
    }

    return list;
  }

}

exports.AxisAlignCalc = AxisAlignCalc;

/***/ }),

/***/ "7020":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class SelectButtonGroup {
  constructor(mouseUpSelect = true) {
    this.m_map = new Map();
    this.m_selectFunc = null;
    this.m_deselectFunc = null;
    this.m_mouseUpSelect = true;
    this.m_btn = null;
    this.m_selectColorHexList = [0x4caf50, 0xaaac6a, 0x6ccf70];
    this.m_deselectColorHexList = [0x5dbea3, 0x33b249, 0x5adbb5];
    this.m_mouseUpSelect = mouseUpSelect;
  }

  addButton(btn) {
    if (btn != null) {
      if (this.m_map == null) {
        this.m_map = new Map();
      }

      this.m_map.set(btn.uuid, btn);
      const ME = CoRScene.MouseEvent;

      if (this.m_mouseUpSelect) {
        btn.addEventListener(ME.MOUSE_UP, this, this.mouseEvtFunc);
      } else {
        btn.addEventListener(ME.MOUSE_DOWN, this, this.mouseEvtFunc);
      }

      if (this.m_deselectFunc) {
        this.m_deselectFunc(btn);
      } else {
        this.applyDeselectColors(btn);
      }
    }
  }

  mouseEvtFunc(evt) {
    this.select(evt.currentTarget.uuid);
  }

  setSelectedFunction(selectFunc, deselectFunc) {
    this.m_selectFunc = selectFunc;
    this.m_deselectFunc = deselectFunc;
  }

  selectButton(btn) {
    if (btn) {
      this.select(btn.uuid);
    }
  }

  select(uuid) {
    if (this.m_map != null && this.m_map.has(uuid)) {
      let btn = this.m_map.get(uuid);

      if (this.m_btn != btn) {
        if (this.m_btn) {
          if (this.m_deselectFunc) {
            this.m_deselectFunc(this.m_btn);
          } else {
            this.applyDeselectColors(this.m_btn);
          }
        }

        this.m_btn = btn;

        if (this.m_selectFunc) {
          this.m_selectFunc(btn);
        } else {
          this.applySelectColors(btn);
        }
      }
    }
  }
  /**
   * @param colorHexList for example: [0x4caf50, 0xaaac6a, 0x6ccf70]
   */


  setSelectColors(colorHexList) {
    if (colorHexList) {
      let ls = this.m_selectColorHexList;
      let len = Math.min(colorHexList.length, ls.length);

      for (let i = 0; i < len; ++i) {
        ls[i] = colorHexList[i];
      }
    }
  }
  /**
   * @param colorHexList for example: [0x4caf50, 0xaaac6a, 0x6ccf70]
   */


  setDeselectColors(colorHexList) {
    if (colorHexList) {
      let ls = this.m_deselectColorHexList;
      let len = Math.min(colorHexList.length, ls.length);

      for (let i = 0; i < len; ++i) {
        ls[i] = colorHexList[i];
      }
    }
  }

  setBtnColors(btn, colorHexList) {
    let label = btn.getLable();

    if (label.setColorsWithHex) {
      label.setColorsWithHex(colorHexList);
    }
  }

  applySelectColors(btn) {
    this.setBtnColors(btn, this.m_selectColorHexList);
  }

  applyDeselectColors(btn) {
    this.setBtnColors(btn, this.m_deselectColorHexList);
  }

  destroy() {
    this.m_btn = null;
    this.m_map = null;
    this.m_selectFunc = null;
    this.m_deselectFunc = null;
  }

}

exports.SelectButtonGroup = SelectButtonGroup;

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

/***/ "7908":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const LeftTopLayouter_1 = __webpack_require__("efac");

const RightTopLayouter_1 = __webpack_require__("189a");

const RightBottomLayouter_1 = __webpack_require__("9686");

const FreeLayouter_1 = __webpack_require__("36f3");

class UILayout {
  constructor() {
    this.m_layouters = []; // private m_uirsc: IRendererScene = null;
    // private m_stage: IRenderStage3D = null;

    this.m_rect = null;
  }

  createFreeLayouter() {
    let l = new FreeLayouter_1.FreeLayouter();
    this.addLayouter(l);
    return l;
  }

  createLeftTopLayouter() {
    let l = new LeftTopLayouter_1.LeftTopLayouter();
    this.addLayouter(l);
    return l;
  }

  createRightTopLayouter() {
    let l = new RightTopLayouter_1.RightTopLayouter();
    this.addLayouter(l);
    return l;
  }

  createRightBottomLayouter() {
    let l = new RightBottomLayouter_1.RightBottomLayouter();
    this.addLayouter(l);
    return l;
  } // initialize(uirsc: IRendererScene): void {
  // 	if (this.m_uirsc == null && uirsc != null) {
  // 		this.m_uirsc = uirsc;
  // 		this.m_stage = uirsc.getStage3D();
  // 		let st = this.m_stage;
  // 		this.m_rect = CoMath.createAABB2D(0, 0, st.stageWidth, st.stageHeight);
  // 	}
  // }


  initialize(rect) {
    if (rect != null && this.m_rect == null) {
      rect.update();
      this.m_rect = CoMath.createAABB2D(rect.x, rect.y, rect.width, rect.height);
    }
  }

  getAreaRect() {
    return this.m_rect;
  }

  addLayouter(layouter) {
    if (layouter != null) {
      let i = 0;
      let ls = this.m_layouters;

      for (; i < ls.length; ++i) {
        if (ls[i] == layouter) break;
      }

      if (i >= ls.length) {
        ls.push(layouter);
        layouter.initLayout(this.m_rect);
      }
    }
  }

  removeLayouter(layouter) {
    if (layouter != null) {
      let i = 0;
      let ls = this.m_layouters;

      for (; i < ls.length; ++i) {
        if (ls[i] == layouter) {
          ls.splice(i, 1);
          break;
        }
      }
    }
  }
  /**
   * 每次更新都将重新计算
   */


  update(rect) {
    this.m_rect.copyFrom(rect);

    for (let i = 0; i < this.m_layouters.length; ++i) {
      this.m_layouters[i].update(rect);
    }
  }

  destroy() {}

}

exports.UILayout = UILayout;

/***/ }),

/***/ "7913":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const TextLabel_1 = __webpack_require__("38b3");

const UIPanel_1 = __webpack_require__("d632");

const ButtonBuilder_1 = __webpack_require__("cdda");

const AxisAlignCalc_1 = __webpack_require__("677d");

class PromptPanel extends UIPanel_1.UIPanel {
  constructor() {
    super();
    this.m_promptLabel = null;
    this.m_prompt = "Hi,Prompt Panel.";
    this.m_btnW = 90;
    this.m_btnH = 50;
    this.m_confirmFunc = null;
    this.m_cancelFunc = null;
    this.m_cancelBtnVis = true;
    /**
     * 边距留白尺寸
     */

    this.marginWidth = 70;
    /**
     * x轴留白比例
     */

    this.marginXFactor = 0.5;
    /**
     * y轴留白比例
     */

    this.marginYFactor = 0.6;
    this.m_alignCalc = new AxisAlignCalc_1.AxisAlignCalc();
  }

  initialize(scene, rpi, panelW, panelH, btnW, btnH, confirmNS = "Confirm", cancelNS = "Cancel") {
    if (this.isIniting()) {
      this.init();
      this.m_scene = scene;
      this.m_rpi = rpi;
      this.m_panelW = panelW;
      this.m_panelH = panelH;
      this.m_btnW = btnW;
      this.m_btnH = btnH;
      this.m_confirmNS = confirmNS;
      this.m_cancelNS = cancelNS;
      if (this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
    }
  }

  applyConfirmButton() {
    this.m_cancelBtnVis = false;
    let btn = this.m_cancelBtn;

    if (btn != null && !btn.isVisible()) {
      this.m_cancelBtn.setVisible(false);

      if (this.m_confirmBtn != null && this.isOpen()) {
        this.layoutItems();
        this.layout();
      }
    }
  }

  applyAllButtons() {
    this.m_cancelBtnVis = true;

    if (this.m_cancelBtn != null) {
      this.m_cancelBtn.setVisible(true);
    }
  }

  setPrompt(text) {
    if (text != "" && this.m_prompt != text) {
      this.m_prompt = text;
      let pl = this.m_promptLabel;

      if (pl != null) {
        pl.setText(text);
        let px = (this.m_panelW - pl.getWidth()) * 0.5;
        pl.setX(px);
        pl.update();

        if (this.m_confirmBtn != null && this.isOpen()) {
          this.layoutItems();
          this.layout();
        }
      }
    }
  }

  setPromptTextColor(color) {
    let pl = this.m_promptLabel;

    if (pl != null) {
      pl.setColor(color);
    }
  }

  setListener(confirmFunc, cancelFunc) {
    this.m_confirmFunc = confirmFunc;
    this.m_cancelFunc = cancelFunc;
  }

  destroy() {
    super.destroy();
    this.m_confirmFunc = null;
    this.m_cancelFunc = null;

    if (this.m_confirmBtn != null) {
      this.m_confirmBtn.destroy();
      this.m_cancelBtn.destroy();
      this.m_confirmBtn = null;
      this.m_cancelBtn = null;
    }
  }

  buildPanel(pw, ph) {
    this.buildItems();
  }

  buildItems() {
    if (this.m_confirmBtn == null) {
      let sc = this.getScene();
      let tta = sc.transparentTexAtlas;
      let fc4 = CoMaterial.createColor4;
      let cfg = this.m_scene.uiConfig;
      let gColor = cfg.getUIGlobalColor();
      let uiCfg = cfg.getUIPanelCfgByName("promptPanel");
      let keys = uiCfg.btnKeys;
      let btf = uiCfg.btnTextFontFormat;
      let ltf = uiCfg.textFontFormat;
      let textLabel = new TextLabel_1.TextLabel();
      textLabel.depthTest = true;
      textLabel.transparent = true;
      textLabel.premultiplyAlpha = true;
      textLabel.initialize(this.m_prompt, sc, ltf.fontSize);
      let color = fc4();
      color.fromBytesArray3(ltf.fontColor);
      textLabel.setColor(color);
      this.m_promptLabel = textLabel; // console.log("textLabel.getHeight(): ", textLabel.getHeight());

      let ME = CoRScene.MouseEvent;
      let textParam = {
        text: this.m_confirmNS,
        textColor: fc4(),
        fontSize: btf.fontSize,
        font: ""
      };
      textParam.textColor.fromBytesArray3(btf.fontColor);
      let colors = [fc4(), fc4(), fc4(), fc4() //.setRGB3Bytes(80, 80, 80)
      ];
      cfg.applyButtonColor(colors, gColor.button.light);
      let builder = ButtonBuilder_1.ButtonBuilder;
      let confirmBtn = builder.createTextButton(this.m_btnW, this.m_btnH, keys[0], tta, textParam, colors);
      this.m_confirmBtn = confirmBtn;
      textParam.text = this.m_cancelNS;
      let cancelBtn = builder.createTextButton(this.m_btnW, this.m_btnH, keys[1], tta, textParam, colors); // cancelBtn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);

      this.m_cancelBtn = cancelBtn;
      this.addEntity(cancelBtn);
      this.addEntity(confirmBtn);
      this.addEntity(textLabel);
    }
  }

  updateBgSize() {
    let pw = this.m_panelW;
    let textLabel = this.m_promptLabel;
    textLabel.update();
    let confirmBtn = this.m_confirmBtn;
    confirmBtn.update();
    let cancelBtn = this.m_cancelBtn;
    cancelBtn.update();
    let bw = cancelBtn.isVisible() ? cancelBtn.getWidth() : 0;
    let btw2 = confirmBtn.getWidth() + bw;
    bw = btw2 + Math.round(0.2 * btw2) + this.marginWidth;
    let tw = textLabel.getWidth() + this.marginWidth;
    tw = bw > tw ? bw : tw;
    pw = this.m_panelW = tw;
    let bgLabel = this.m_bgLabel;

    if (Math.abs(bgLabel.getWidth() - pw) > 0.01) {
      bgLabel.setScaleX(1.0);
      bgLabel.update();
      tw = bgLabel.getWidth();
      bgLabel.setScaleX(pw / tw);
      bgLabel.update();
    }
  }

  layoutItems() {
    this.m_cancelBtn.setVisible(this.m_cancelBtnVis);
    this.updateBgSize();
    let pw = this.m_panelW;
    let textLabel = this.m_promptLabel;
    let sizes = [this.m_btnH, textLabel.getHeight()];
    let pyList = this.m_alignCalc.calcAvgFixLayout(sizes, this.m_panelH, 15, this.marginYFactor, 0.5);
    let px = (pw - textLabel.getWidth()) * 0.5;
    textLabel.setXY(px, pyList[1]);
    textLabel.update();

    if (this.m_cancelBtn.isVisible()) {
      this.layoutButtons(px, pyList[0]);
    } else {
      this.layoutOnlyConfirm(px, pyList[0]);
    }
  }

  layoutButtons(px, py) {
    let sizes = [this.m_btnW, this.m_btnW];
    let pxList = this.m_alignCalc.calcAvgFixLayout(sizes, this.m_panelW, 10, this.marginXFactor, 0.5);
    let confirmBtn = this.m_confirmBtn;
    let cancelBtn = this.m_cancelBtn;
    confirmBtn.setXY(pxList[0], py);
    confirmBtn.update();
    cancelBtn.setXY(pxList[1], py);
    cancelBtn.update();
  }

  layoutOnlyConfirm(px, py) {
    let sizes = [this.m_btnW];
    let pxList = this.m_alignCalc.calcAvgFixLayout(sizes, this.m_panelW, 10, this.marginXFactor, 0.5);
    let confirmBtn = this.m_confirmBtn;
    confirmBtn.setXY(pxList[0], py);
    confirmBtn.update();
  }

  openThis() {
    let ME = CoRScene.MouseEvent;

    if (this.m_scene != null) {
      this.m_scene.addEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);
      this.m_confirmBtn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
      this.m_cancelBtn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
      this.layoutItems();
    }
  }

  closeThis() {
    this.m_cancelBtnVis = true;
    let ME = CoRScene.MouseEvent;

    if (this.m_scene != null) {
      this.m_scene.removeEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);
      this.m_confirmBtn.removeEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
      this.m_cancelBtn.removeEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
    }
  }

  stMouseDownListener(evt) {
    console.log("Prompt stMouseDownListener...");
    let px = evt.mouseX;
    let py = evt.mouseY;
    let pv = this.m_v0;
    pv.setXYZ(px, py, 0);
    this.globalToLocal(pv);

    if (pv.x < 0 || pv.x > this.m_panelW || pv.y < 0 || pv.y > this.m_panelH) {
      this.close();
    }
  }

  btnMouseUpListener(evt) {
    console.log("PromptPanel::btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
    let uuid = evt.uuid;

    switch (uuid) {
      case "confirm":
        this.close();

        if (this.m_confirmFunc != null) {
          this.m_confirmFunc();
        }

        break;

      case "cancel":
        this.close();

        if (this.m_cancelFunc != null) {
          this.m_cancelFunc();
        }

        break;

      default:
        break;
    }
  }

}

exports.PromptPanel = PromptPanel;

/***/ }),

/***/ "7dab":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CtrlItemParam_1 = __webpack_require__("2b5a");

exports.CtrlInfo = CtrlItemParam_1.CtrlInfo;
exports.ItemCallback = CtrlItemParam_1.ItemCallback;
exports.CtrlItemParam = CtrlItemParam_1.CtrlItemParam;

class CtrlItemObj {
  constructor() {
    this.type = "";
    this.uuid = "";
    this.btn = null;
    this.param = null;
    this.color = [1.0, 1.0, 1.0];
    this.colorId = -1;
    this.info = null;
    this.syncEnabled = false;
  }

  setValueToParam(value) {
    let param = this.param;

    if (param.type == "progress") {
      param.progress = value;
    } else {
      param.value = value;
    }
  }
  /**
   * 将 flag 值由ui发送到外面
   */


  sendFlagOut(flag, force = false) {
    let param = this.param;

    if (param.callback != null && param.flag != flag || force) {
      param.flag = flag;
      this.info = {
        type: param.type,
        uuid: this.uuid,
        values: [],
        flag: flag
      };
      param.callback(this.info);
    }
  }
  /**
   * 将 颜色 值由ui发送到外面
   */


  sendColorOut(color, force = false) {
    let param = this.param;
    let vs = this.color;
    color.toArray3(vs);

    if (param.callback != null) {
      let f = param.type == "progress" ? param.progress : param.value; // console.log("sendColorOut f: ", f);

      let cvs = vs.slice();
      cvs[0] *= f;
      cvs[1] *= f;
      cvs[2] *= f;
      this.info = {
        type: param.type,
        uuid: this.uuid,
        values: cvs,
        flag: true,
        colorPick: true
      };
      param.callback(this.info);
    }
  }
  /**
   * 将 数值 由ui发送到外面
   */


  sendValueOut(value, force = false) {
    let param = this.param;
    let fp = param.type == "progress";
    let f = fp ? param.progress : param.value;

    if (param.callback != null && Math.abs(f - value) > 0.00001 || force) {
      if (fp) {
        param.progress = value;
      } else {
        param.value = value;
      }

      if (param.colorPick) {
        let cvs = this.color.slice();
        cvs[0] *= value;
        cvs[1] *= value;
        cvs[2] *= value;
        this.info = {
          type: param.type,
          uuid: this.uuid,
          values: cvs,
          flag: true,
          colorPick: true
        };
      } else {
        this.info = {
          type: param.type,
          uuid: this.uuid,
          values: [value],
          flag: true
        };
      }

      param.callback(this.info);
    }
  }
  /**
   * 将(用户已经修改的)参数同步到ui
   */


  updateParamToUI() {
    let param = this.param;
    let t = param; // let visibleAlways = t.visibleAlways ? t.visibleAlways : false;

    t.colorPick = t.colorPick ? t.colorPick : false;

    switch (param.type) {
      case "number_value":
      case "number":
        t.value = t.value ? t.value : 0.0;
        t.minValue = t.minValue ? t.minValue : 0.0;
        t.maxValue = t.maxValue ? t.maxValue : 10.0;
        const b0 = this.btn;
        b0.setRange(t.minValue, t.maxValue);
        b0.setValue(t.value, false);
        console.log("t.value: ", t.value);

        if (this.syncEnabled) {
          this.sendValueOut(t.value, true);
        }

        break;

      case "progress":
        t.progress = t.progress ? t.progress : 0.0;
        const b1 = this.btn;
        b1.setProgress(t.progress, false);

        if (this.syncEnabled) {
          this.sendValueOut(t.progress, true);
        }

        break;

      case "status":
      case "status_select":
        t.flag = t.flag ? t.flag : false;
        const b2 = this.btn;

        if (t.flag) {
          b2.select(false);
        } else {
          b2.deselect(false);
        }

        if (this.syncEnabled) {
          this.sendFlagOut(t.flag, true);
        }

        break;

      default:
        break;
    }
  }

}

exports.CtrlItemObj = CtrlItemObj;

/***/ }),

/***/ "7dc1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabel_1 = __webpack_require__("f35d");

const ClipColorLabel_1 = __webpack_require__("05f0");

const ColorClipLabel_1 = __webpack_require__("ddfa");

const ColorLabel_1 = __webpack_require__("9ba1");

const TextLabel_1 = __webpack_require__("38b3");

const Button_1 = __webpack_require__("88b9");

const FlagButton_1 = __webpack_require__("e8f9");

const ButtonBuilder_1 = __webpack_require__("cdda");

const SelectButtonGroup_1 = __webpack_require__("7020");

const VoxUIScene_1 = __webpack_require__("8698");

const RectTextTip_1 = __webpack_require__("9f6b");

const TipInfo_1 = __webpack_require__("9043");

const UILayout_1 = __webpack_require__("7908");

const PromptPanel_1 = __webpack_require__("7913");

const UIPanel_1 = __webpack_require__("d632");

const PromptSystem_1 = __webpack_require__("f280");

const TipsSystem_1 = __webpack_require__("0aa4");

const PanelSystem_1 = __webpack_require__("b6c0");

const ParamCtrlPanel_1 = __webpack_require__("0241");

const VoxRScene_1 = __webpack_require__("d1de");

const VoxMath_1 = __webpack_require__("f042");

const VoxMaterial_1 = __webpack_require__("0efa");

const VoxEntity_1 = __webpack_require__("9b53");

const VoxMesh_1 = __webpack_require__("228b");

const UIEntityContainer_1 = __webpack_require__("23ac");

const SelectionEntity_1 = __webpack_require__("1dcc");

const ProgressEntity_1 = __webpack_require__("822b");

let __$$__init = true;

function initialize() {
  if (__$$__init) {
    __$$__init = false;

    if (VoxRScene_1.VoxRScene.isEnabled()) {
      VoxRScene_1.VoxRScene.initialize();
      if (VoxMesh_1.VoxMesh.isEnabled()) VoxMesh_1.VoxMesh.initialize();
      if (VoxMath_1.VoxMath.isEnabled()) VoxMath_1.VoxMath.initialize();
      if (VoxMaterial_1.VoxMaterial.isEnabled()) VoxMaterial_1.VoxMaterial.initialize();
      if (VoxEntity_1.VoxEntity.isEnabled()) VoxEntity_1.VoxEntity.initialize();
    }
  }
}

exports.initialize = initialize;

function createColorLabel() {
  return new ColorLabel_1.ColorLabel();
}

exports.createColorLabel = createColorLabel;

function createRectTextTip() {
  return new RectTextTip_1.RectTextTip();
}

exports.createRectTextTip = createRectTextTip;

function createClipLabel() {
  return new ClipLabel_1.ClipLabel();
}

exports.createClipLabel = createClipLabel;

function createClipColorLabel() {
  return new ClipColorLabel_1.ClipColorLabel();
}

exports.createClipColorLabel = createClipColorLabel;

function createColorClipLabel() {
  return new ColorClipLabel_1.ColorClipLabel();
}

exports.createColorClipLabel = createColorClipLabel;

function createTextLabel() {
  return new TextLabel_1.TextLabel();
}

exports.createTextLabel = createTextLabel;

function createButton() {
  return new Button_1.Button();
}

exports.createButton = createButton;

function createFlagButton() {
  return new FlagButton_1.FlagButton();
}

exports.createFlagButton = createFlagButton;

function createSelectButtonGroup() {
  return new SelectButtonGroup_1.SelectButtonGroup();
}

exports.createSelectButtonGroup = createSelectButtonGroup;

function createTextButton(width, height, idns, texAtlas, textParam, colors) {
  return ButtonBuilder_1.ButtonBuilder.createTextButton(width, height, idns, texAtlas, textParam, colors);
}

exports.createTextButton = createTextButton;

function createUIContainer() {
  return new UIEntityContainer_1.UIEntityContainer(true);
}

exports.createUIContainer = createUIContainer;

function createUIPanel() {
  return new UIPanel_1.UIPanel();
}

exports.createUIPanel = createUIPanel;

function createPromptPanel() {
  return new PromptPanel_1.PromptPanel();
}

exports.createPromptPanel = createPromptPanel;

function createParamCtrlPanel() {
  return new ParamCtrlPanel_1.ParamCtrlPanel();
}

exports.createParamCtrlPanel = createParamCtrlPanel;
let __$$$currUISCene = null;

function createUIScene(graph, uiConfig = null, atlasSize = 512, renderProcessesTotal = 3) {
  initialize();
  let uisc = new VoxUIScene_1.VoxUIScene();
  __$$$currUISCene = uisc;

  if (graph) {
    uisc.initialize(graph, atlasSize, renderProcessesTotal);
  }

  uisc.uiConfig = uiConfig;

  if (uiConfig) {
    let promptSys = new PromptSystem_1.PromptSystem();
    promptSys.initialize(uisc);
    uisc.prompt = promptSys;
    let tipsSys = new TipsSystem_1.TipsSystem();
    tipsSys.initialize(uisc);
    uisc.tips = tipsSys;
  }

  let panelSys = new PanelSystem_1.PanelSystem();
  panelSys.initialize(uisc);
  uisc.panel = panelSys;
  return uisc;
}

exports.createUIScene = createUIScene;

function createTipInfo() {
  return new TipInfo_1.TipInfo();
}

exports.createTipInfo = createTipInfo;

function createUILayout() {
  return new UILayout_1.UILayout();
}

exports.createUILayout = createUILayout;

function createTextLabelButton(uuid, text, width = 90, height = 50, textColor = null, fontSize = 30, fontName = "") {
  if (text == "" || __$$$currUISCene == null) return null;
  let uisc = __$$$currUISCene;
  let tta = uisc.transparentTexAtlas;
  return ButtonBuilder_1.ButtonBuilder.createTextLabelButton(tta, uuid, text, width, height, textColor, fontSize, fontName); // let uisc = __$$$currUISCene;
  // let tta = uisc.transparentTexAtlas;
  // let fontColor = textColor != null ? textColor : VoxMaterial.createColor4(0, 0, 0, 1.0);
  // let bgColor = VoxMaterial.createColor4(1, 1, 1, 0.0);
  // if(fontName != "") {
  // 	tta.setFontName( fontName );
  // }
  // let img = tta.createCharsCanvasFixSize(width, height, text, fontSize, fontColor, bgColor);
  // tta.addImageToAtlas(text, img);
  // let colorLabel = new ClipColorLabel();
  // colorLabel.initializeWithoutTex(width, height, 4);
  // colorLabel.getColorAt(0).setRGB3f(0.5, 0.5, 0.5);
  // colorLabel.getColorAt(1).setRGB3f(0.7, 0.7, 0.7);
  // colorLabel.getColorAt(2).setRGB3f(0.6, 0.6, 0.6);
  // colorLabel.getColorAt(3).copyFrom(colorLabel.getColorAt(1));
  // let iconLable = new ClipLabel();
  // iconLable.transparent = true;
  // iconLable.premultiplyAlpha = true;
  // iconLable.initialize(tta, [text]);
  // let btn = new Button();
  // btn.uuid = uuid;
  // btn.addLabel(iconLable);
  // btn.initializeWithLable(colorLabel);
  // this.m_uiScene.addEntity(btn);
  // return btn;
}

exports.createTextLabelButton = createTextLabelButton;

function createSelectionEntity() {
  return new SelectionEntity_1.SelectionEntity();
}

exports.createSelectionEntity = createSelectionEntity;

function createProgressEntity() {
  return new ProgressEntity_1.ProgressEntity();
}

exports.createProgressEntity = createProgressEntity;

/***/ }),

/***/ "822b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const VoxMath_1 = __webpack_require__("f042");

const VoxRScene_1 = __webpack_require__("d1de");

const CompEntityBase_1 = __webpack_require__("5ea3");

class ProgressEntity extends CompEntityBase_1.CompEntityBase {
  constructor() {
    super();
    this.m_currEvent = null;
    this.m_nameItem = null;
    this.m_addItem = null;
    this.m_subItem = null;
    this.m_bgBarItem = null;
    this.m_barPlane = null;
    this.m_ruisc = null;
    this.m_barInitLength = 1.0;
    this.m_barLength = 1.0;
    this.m_preProgress = -1.0;
    this.m_progress = 0.0;
    this.m_nameWidth = 0.0;
    this.m_value = 0.0;
    this.m_minValue = 0.0;
    this.m_maxValue = 1.0;
    this.step = 0.1;
    this.m_moveMin = 0;
    this.m_autoDelay = 0;
    this.m_changeStep = 0;
    this.uuid = "ProgressEntity";
  }

  destroy() {
    super.destroy();

    if (this.m_barPlane != null) {
      this.m_dispatcher.destroy();
      this.m_dispatcher = null;
      this.m_nameItem.destroy();
      this.m_nameItem = null;
      this.m_subItem.destroy();
      this.m_subItem = null;
      this.m_addItem.destroy();
      this.m_addItem = null;
      this.m_bgBarItem.destroy();
      this.m_bgBarItem = null;
      this.m_barPlane.destroy();
      this.m_barPlane = null;
      this.m_ruisc = null;
    }
  }

  getNameWidth() {
    return this.m_nameWidth;
  }
  /**
   * @param uisc IVoxUIScene instance
   * @param btnName btn name, the default value is "prog"
   * @param fontSize font size, the default value 30
   * @param nameWidth name part width, the default value 30
   * @param progLength progress bar length, the default value is 200
   * @param height btn height, the default value is 40
   */


  initialize(uisc, btnName = "prog", fontSize = 30.0, nameWidth = 30, progLength = 200, height = 40) {
    if (this.isIniting()) {
      this.init();
      this.m_ruisc = uisc;
      this.m_barInitLength = progLength;
      this.m_dispatcher = VoxRScene_1.VoxRScene.createEventBaseDispatcher();
      this.m_currEvent = VoxRScene_1.VoxRScene.createProgressDataEvent();
      let dis = 2.0;
      let px = 0;

      if (btnName != "") {
        let nameItem = this.createBtn("name", uisc, [btnName], fontSize, nameWidth, height);
        this.addEntity(nameItem.button);
        this.m_nameWidth = nameWidth = nameItem.button.getWidth();
        height = nameItem.button.getHeight(); // console.log(btnName, ", nameWidth: ", nameWidth, "height: ",height);

        this.m_nameItem = nameItem;
        nameItem.button.addEventListener(VoxRScene_1.MouseEvent.MOUSE_DOWN, this, this.nameBtnMouseDown);
        px += dis + this.m_nameWidth;
      }

      let subItem = this.createBtn("subProg", uisc, ["-"], fontSize, height, height);
      let addItem = this.createBtn("addProg", uisc, ["+"], fontSize, height, height);
      subItem.button.setX(px);
      this.addEntity(subItem.button);
      px += subItem.button.getWidth();
      addItem.button.setX(this.m_barInitLength + px);
      this.addEntity(addItem.button);
      subItem.button.addEventListener(VoxRScene_1.MouseEvent.MOUSE_DOWN, this, this.btnMouseDown);
      addItem.button.addEventListener(VoxRScene_1.MouseEvent.MOUSE_DOWN, this, this.btnMouseDown);
      this.m_subItem = subItem;
      this.m_addItem = addItem;
      this.initProg(uisc, px, this.m_barInitLength, height);
      this.setProgressV(this.m_progress);
    }
  }

  initProg(uisc, posX, barLength, height) {
    let bgItem = this.createBtn("progBarBg", uisc, [], 0, barLength, height, 0.8);
    this.m_bgBarItem = bgItem;
    let bgButon = bgItem.button;
    bgButon.setX(posX);
    this.addEntity(bgButon);
    let bgLabel = bgItem.bgLabel;
    bgLabel.getColorAt(2).copyFrom(bgLabel.getColorAt(1));
    bgButon.addEventListener(VoxRScene_1.MouseEvent.MOUSE_DOWN, this, this.barMouseDown);
    this.m_ruisc.addEventListener(VoxRScene_1.MouseEvent.MOUSE_UP, this, this.barMouseUp, true, false);
    bgButon.addEventListener(VoxRScene_1.MouseEvent.MOUSE_OVER, this, this.barMouseOver);
    bgButon.addEventListener(VoxRScene_1.MouseEvent.MOUSE_OUT, this, this.barMouseOut);
    let barBgLabel = this.createBgLabel(1, height, 1.2);
    barBgLabel.setX(posX);
    barBgLabel.setZ(0.05);
    this.addEntity(barBgLabel);
    this.m_barPlane = barBgLabel;
  }

  setRange(min, max) {
    this.m_preProgress = -1;
    this.m_minValue = min;
    this.m_maxValue = max;
  }

  setValue(value, sendEvtEnabled = true) {
    this.m_preProgress = -1;
    value = VoxMath_1.MathConst.Clamp(value, this.m_minValue, this.m_maxValue);
    this.m_progress = (value - this.m_minValue) / (this.m_maxValue - this.m_minValue);
    this.setProgressV(this.m_progress, sendEvtEnabled);
  }

  getValue() {
    return this.m_value;
  }

  setProgress(barProgress, sendEvtEnabled = true) {
    this.m_preProgress = -1;
    this.setProgressV(barProgress, sendEvtEnabled);
  }

  setProgressV(barProgress, sendEvtEnabled = true) {
    this.m_progress = VoxMath_1.MathConst.Clamp(barProgress, 0.0, 1.0);
    this.m_barLength = this.m_barInitLength * this.m_progress;
    this.sendValue(sendEvtEnabled);
  }

  sendValue(sendEvtEnabled) {
    this.m_barPlane.setScaleX(this.m_barLength);
    this.m_barPlane.update();
    this.m_value = this.m_minValue + (this.m_maxValue - this.m_minValue) * this.m_progress;

    if (sendEvtEnabled) {
      let d = Math.abs(this.m_preProgress - this.m_progress);

      if (d > VoxMath_1.MathConst.MATH_MIN_POSITIVE) {
        this.m_preProgress = this.m_progress;
        this.sendEvt(2);
      }
    }
  }

  getProgress() {
    return this.m_progress;
  }

  sendEvt(status) {
    let t = this.m_currEvent;
    t.target = this;
    t.status = status;
    t.type = VoxRScene_1.ProgressDataEvent.PROGRESS;
    t.minValue = this.m_minValue;
    t.maxValue = this.m_maxValue;
    t.value = this.m_value;
    t.progress = this.m_progress;
    t.phase = 1;
    t.uuid = this.uuid;
    this.m_dispatcher.dispatchEvt(t);
    t.target = null;
  }

  setProgressLength(length, sendEvtEnabled = true) {
    this.m_barLength = VoxMath_1.MathConst.Clamp(length, 0.0, this.m_barInitLength);
    this.m_progress = this.m_barLength / this.m_barInitLength;
    this.sendValue(sendEvtEnabled);
  }

  nameBtnMouseDown(evt) {
    this.sendEvt(0);
  }

  barMouseDown(evt) {
    this.m_preProgress = -1;
    this.m_moveMin = evt.mouseX - this.m_progress * this.m_barInitLength;
    this.setProgressV(this.m_progress);
    this.m_ruisc.addEventListener(VoxRScene_1.MouseEvent.MOUSE_MOVE, this, this.barMouseMove, true, false);
  }

  barMouseMove(evt) {
    this.setProgressV((evt.mouseX - this.m_moveMin) / this.m_barInitLength);
  }

  barMouseUp(evt) {
    this.m_ruisc.removeEventListener(VoxRScene_1.MouseEvent.MOUSE_MOVE, this, this.barMouseMove);
    this.m_ruisc.removeEventListener(VoxRScene_1.EventBase.ENTER_FRAME, this, this.barEnterFrame);
  }

  barEnterFrame(evt) {
    if (this.m_autoDelay > 20) {
      if (this.m_autoDelay % 7 == 0) {
        this.setProgressLength(this.m_barLength + this.m_changeStep);
      }
    }

    this.m_autoDelay++;
  }

  barMouseOver(evt) {
    this.m_barPlane.setClipIndex(1);
  }

  barMouseOut(evt) {
    this.m_barPlane.setClipIndex(0);
  }

  btnMouseDown(evt) {
    this.m_autoDelay = 0;

    if (evt.uuid == "subProg") {
      this.m_changeStep = -this.step;
      this.setProgressLength(this.m_barLength - this.step);
      this.m_ruisc.addEventListener(VoxRScene_1.EventBase.ENTER_FRAME, this, this.barEnterFrame, true, false);
    } else if (evt.uuid == "addProg") {
      this.m_changeStep = this.step;
      this.setProgressLength(this.m_barLength + this.step);
      this.m_ruisc.addEventListener(VoxRScene_1.EventBase.ENTER_FRAME, this, this.barEnterFrame, true, false);
    }
  }

}

exports.ProgressEntity = ProgressEntity;

/***/ }),

/***/ "8698":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UILayout_1 = __webpack_require__("7908");

class VoxUIScene {
  constructor() {
    this.m_graph = null;
    this.texAtlas = null;
    this.transparentTexAtlas = null;
    this.layout = new UILayout_1.UILayout();
    this.prompt = null;
    this.tips = null;
    this.panel = null;
    this.uiConfig = null;
    this.keyboardInteraction = null;
    this.texAtlasNearestFilter = true;
  }

  resizeHandle(evt) {
    this.resize();
  }
  /**
   * @param graph the value is a IRendererSceneGraph instance
   * @param atlasSize the default value is 1024
   * @param renderProcessesTotal the default value is 3
   */


  initialize(graph, atlasSize = 1024, renderProcessesTotal = 3) {
    if (this.m_graph == null) {
      this.m_graph = graph;
      let crscene = graph.getSceneAt(0);
      let stage = crscene.getStage3D();
      crscene.addEventListener(CoRScene.EventBase.RESIZE, this, this.resizeHandle);
      let rparam = graph.createRendererSceneParam();
      rparam.cameraPerspectiveEnabled = false;
      rparam.setAttriAlpha(false);
      rparam.setCamProject(45.0, 0.1, 3000.0);
      rparam.setCamPosition(0.0, 0.0, 1500.0);
      let subScene = graph.createSubScene(rparam, renderProcessesTotal, true);
      subScene.enableMouseEvent(true);
      let t = this;
      t.rscene = subScene;
      let t0 = t.texAtlas = CoTexture.createCanvasTexAtlas();
      let t1 = t.transparentTexAtlas = CoTexture.createCanvasTexAtlas();
      t0.initialize(crscene, atlasSize, atlasSize, CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0), false, this.texAtlasNearestFilter);
      t0.getTexture().premultiplyAlpha = false;
      t1.initialize(crscene, atlasSize, atlasSize, CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0), true, this.texAtlasNearestFilter);
      t1.getTexture().premultiplyAlpha = true;
      this.m_rstage = stage;
      let uicamera = this.rscene.getCamera();
      uicamera.translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
      uicamera.update();
      let st = this.getStage();
      this.m_stageRect = CoMath.createAABB2D(0, 0, st.stageWidth, st.stageHeight);
      this.layout.initialize(this.m_stageRect);
    }
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    this.m_rstage.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    return this;
  }

  removeEventListener(type, listener, func) {
    this.m_rstage.removeEventListener(type, listener, func);
    return this;
  }

  getStage() {
    return this.rscene.getStage3D();
  }

  addEntity(entity, processid = 0) {
    if (entity != null) {
      entity.__$setScene(this);

      entity.update();
      let container = entity.getRContainer();

      if (container != null) {
        this.rscene.addContainer(container, processid);
      }

      let ls = entity.getREntities();

      for (let i = 0; i < ls.length; ++i) {
        this.rscene.addEntity(ls[i], processid, true);
      }
    }
  }

  removeEntity(entity) {
    if (entity != null) {
      let sc = this.rscene;
      let container = entity.getRContainer();

      if (container != null) {
        sc.removeContainer(container);
      }

      let ls = entity.getREntities();

      for (let i = 0; i < ls.length; ++i) {
        sc.removeEntity(ls[i]);
      }

      entity.__$setScene(null);
    }
  }

  getRect() {
    return this.m_stageRect;
  }

  resize() {
    let st = this.m_rstage;
    let uicamera = this.rscene.getCamera();
    uicamera.translationXYZ(st.stageHalfWidth, st.stageHalfHeight, 1500.0);
    uicamera.update();
    this.m_stageRect.setTo(0, 0, st.stageWidth, st.stageHeight);
    this.updateLayout();
  }

  updateLayout() {
    this.layout.update(this.m_stageRect);
  }

  run() {
    const sc = this.rscene;

    if (sc != null) {
      sc.run();
    }
  }

}

exports.VoxUIScene = VoxUIScene;

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

/***/ "88b9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabel_1 = __webpack_require__("f35d");

const UIEntityBase_1 = __webpack_require__("0b77");

class Button extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_enabled = true;
    this.m_lb = null;
    this.m_lbs = [];
    this.uuid = "btn";
    this.syncLabelClip = true;
  }

  addLabel(label) {
    this.m_lbs.push(label);
  }

  enable() {
    if (this.m_dp != null) {
      this.m_dp.enabled = true;
    }

    this.m_enabled = true;
    return this;
  }

  disable() {
    if (this.m_dp != null) {
      this.m_dp.enabled = false;
    }

    this.m_enabled = false;
    return this;
  }

  isEnabled() {
    return this.m_enabled;
  }

  setMouseEnabled(enabled) {
    if (this.m_entities != null) {
      this.m_entities[0].mouseEnabled = enabled;
    }
  }

  isMouseEnabled() {
    return this.m_entities != null && this.m_entities[0].mouseEnabled;
  }

  initialize(atlas, idnsList = null) {
    if (this.isIniting() && atlas != null && idnsList != null) {
      this.init();

      if (idnsList.length != 4) {
        throw Error("Error: idnsList.length != 4");
      }

      let lb = new ClipLabel_1.ClipLabel();
      lb.initialize(atlas, idnsList);
      this.m_lb = lb;
      this.initializeEvent();
      this.m_lb.setClipIndex(0);
    }

    return this;
  }

  initializeWithLable(lable) {
    if (this.isIniting()) {
      this.init();

      if (lable.getClipsTotal() < 1) {
        throw Error("Error: lable.getClipsTotal() < 1");
      }

      this.m_lb = lable;
      this.initializeEvent();
      this.m_lb.setClipIndex(0);
    }

    return this;
  }

  getLable() {
    return this.m_lb;
  }

  initializeEvent() {
    if (this.m_dp == null) {
      const me = CoRScene.MouseEvent;
      let dpc = CoRScene.createMouseEvt3DDispatcher();
      dpc.currentTarget = this;
      dpc.uuid = this.uuid;
      dpc.enabled = this.m_enabled;
      dpc.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
      dpc.addEventListener(me.MOUSE_UP, this, this.mouseUpListener);
      dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
      dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
      this.m_lb.getREntities()[0].setEvtDispatcher(dpc);
      this.m_dp = dpc;
    }

    this.m_entities = this.m_lb.getREntities().slice(0);
    this.m_entities[0].mouseEnabled = true;
  }

  setVisible(v) {
    super.setVisible(v);
    let ls = this.m_lbs;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].setVisible(v);
    }
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    this.m_dp.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    return this;
  }

  removeEventListener(type, listener, func) {
    this.m_dp.removeEventListener(type, listener, func);
    return this;
  }

  setLabelsClipAt(index) {
    if (this.syncLabelClip) {
      let ls = this.m_lbs;

      if (ls.length > 0) {
        for (let i = 0; i < ls.length; ++i) {
          ls[i].setClipIndex(index);
        }
      }
    }
  }

  mouseOverListener(evt) {
    // console.log("Button::mouseOverListener() ...");
    if (this.m_enabled) {
      this.m_lb.setClipIndex(1);
      this.setLabelsClipAt(1);
    }
  }

  mouseOutListener(evt) {
    // console.log("Button::mouseOutListener() ...");
    if (this.m_enabled) {
      this.m_lb.setClipIndex(0);
      this.setLabelsClipAt(0);
    }
  }

  mouseDownListener(evt) {
    // console.log("Button::mouseDownListener() ...");
    if (this.m_enabled) {
      this.m_lb.setClipIndex(2);
      this.setLabelsClipAt(2);
    }
  }

  mouseUpListener(evt) {
    if (this.m_enabled) {
      this.m_lb.setClipIndex(3);
      this.setLabelsClipAt(3);
    }
  }

  setClipIndex(i) {
    this.m_lb.setClipIndex(i);
    return this;
  }

  copyTransformFrom(src) {
    if (src != null) {
      let sx = src.getScaleX();
      let sy = src.getScaleY();
      let r = src.getRotation();
      this.setScaleXY(sx, sy);
      this.setRotation(r);
      src.getPosition(this.m_v0);
      this.setPosition(this.m_v0);
    }
  }
  /**
   * get renderable entity for renderer scene
   * @returns ITransformEntity instance
   */


  getREntities() {
    let es = this.m_lb.getREntities();
    let ls = this.m_lbs;

    if (ls.length > 0) {
      for (let i = 0; i < ls.length; ++i) {
        es = es.concat(ls[i].getREntities());
      }

      return es;
    }

    return es;
  }

  getRContainer() {
    return null;
  }

  update() {
    this.m_bounds.reset();
    let sv = this.m_scaleV;
    let b = this.m_lb;
    b.setRotation(this.m_rotation);
    b.setScaleXY(sv.x, sv.y);
    b.setPosition(this.m_pos);
    b.update();
    this.m_bounds.union(b.getGlobalBounds());
    let ls = this.m_lbs;

    if (ls.length > 0) {
      for (let i = 0; i < ls.length; ++i) {
        ls[i].copyTransformFrom(this.m_lb);
        ls[i].update();
        this.m_bounds.union(ls[i].getGlobalBounds());
      }
    }

    this.m_bounds.updateFast();
  }

  destroy() {
    let b = this.m_lb;

    if (b != null) {
      b.destroy();
      b = null;
    }

    let ls = this.m_lbs;

    if (ls.length > 0) {
      for (let i = 0; i < ls.length; ++i) {
        ls[i].destroy();
      }

      this.m_lbs = [];
    }

    if (this.m_dp != null) {
      this.m_dp.destroy();
      this.m_dp = null;
    }

    super.destroy();
  }

}

exports.Button = Button;

/***/ }),

/***/ "9043":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class LeftAligner {
  constructor() {
    this.m_pv = null;
  }

  getPos(mx, my, bounds, tipBounds, area) {
    if (this.m_pv == null) {
      this.m_pv = CoMath.createVec3();
    }

    let pv = this.m_pv;
    let ph = tipBounds.getHeight();
    let pw = tipBounds.getWidth();
    let minV = bounds.min;
    pv.x = minV.x - 2 - pw;
    pv.y = my + 2 - ph;

    if (pv.y + ph > area.getTop()) {
      pv.y = area.getTop() - 2 - ph;
    }

    return pv;
  }

}

class RightAligner {
  constructor() {
    this.m_pv = null;
  }

  getPos(mx, my, bounds, tipBounds, area) {
    if (this.m_pv == null) {
      this.m_pv = CoMath.createVec3();
    }

    let pv = this.m_pv;
    let ph = tipBounds.getHeight();
    let maxV = bounds.max;
    pv.x = maxV.x + 2;
    pv.y = my + 2 - ph;

    if (pv.y + ph > area.getTop()) {
      pv.y = area.getTop() - 2 - ph;
    }

    return pv;
  }

}

class TopAligner {
  constructor() {
    this.m_pv = null;
  }

  getPos(mx, my, bounds, tipBounds, area) {
    if (this.m_pv == null) {
      this.m_pv = CoMath.createVec3();
    }

    let pv = this.m_pv;
    let maxV = bounds.max;
    let pw = tipBounds.getWidth();
    pv.x = mx + 2;
    pv.y = maxV.y + 2;

    if (pv.x + pw > area.getRight()) {
      pv.x = area.getRight() - 2 - pw;
    }

    return pv;
  }

}

class BottomAligner {
  constructor() {
    this.m_pv = null;
  }

  getPos(mx, my, bounds, tipBounds, area) {
    if (this.m_pv == null) {
      this.m_pv = CoMath.createVec3();
    }

    let pv = this.m_pv;
    let ph = tipBounds.getHeight();
    let pw = tipBounds.getWidth();
    let minV = bounds.min;
    pv.x = mx + 2;
    pv.y = minV.y - 2 - ph;

    if (pv.x + pw > area.getRight()) {
      pv.x = area.getRight() - 2 - pw;
    }

    return pv;
  }

}

const __$leftAligner = new LeftAligner();

const __$rightAligner = new RightAligner();

const __$topAligner = new TopAligner();

const __$bottomAligner = new BottomAligner();

class TipInfo {
  // follow = true;
  constructor() {
    this.m_content = "ui entity tip info";
    this.m_aligner = null;
  }

  setContent(c) {
    this.m_content = c;
    return this;
  }

  getCotent() {
    return this.m_content;
  }

  alignLeft() {
    this.m_aligner = __$leftAligner;
    return this;
  }

  alignRight() {
    this.m_aligner = __$rightAligner;
    return this;
  }

  alignTop() {
    this.m_aligner = __$topAligner;
    return this;
  }

  alignBottom() {
    this.m_aligner = __$bottomAligner;
    return this;
  }

  getPos(mx, my, bounds, tipBounds, area = null) {
    if (this.m_aligner == null) {
      this.m_aligner = new LeftAligner();
    }

    return this.m_aligner.getPos(mx, my, bounds, tipBounds, area);
  }

  destroy() {
    this.m_aligner = null;
  }

}

exports.TipInfo = TipInfo;

/***/ }),

/***/ "9686":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const LayouterBase_1 = __webpack_require__("5470");

class RightBottomLayouter extends LayouterBase_1.LayouterBase {
  constructor() {
    super();
    this.m_offsetvs = [];
  }

  update(rect) {
    const ls = this.m_entities;
    const len = ls.length;
    let pv = CoMath.createVec3();

    for (let i = 0; i < len; ++i) {
      pv.copyFrom(this.m_offsetvs[i]);
      pv.x = rect.width - pv.x;
      pv.addBy(this.m_offsetV);
      ls[i].setPosition(pv);
      ls[i].update();
    }
  }

  initEntityLayout(entity, initRect) {
    entity.update();
    let pv = CoMath.createVec3();
    entity.getPosition(pv);
    pv.x = initRect.width - pv.x;
    this.m_offsetvs.push(pv);
  }

  destroy() {
    this.m_offsetvs = null;
    super.destroy();
  }

}

exports.RightBottomLayouter = RightBottomLayouter;

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

/***/ "9ba1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("0b77");

const VoxEntity_1 = __webpack_require__("9b53");

const VoxMesh_1 = __webpack_require__("228b");

const VoxMaterial_1 = __webpack_require__("0efa");

class ColorLabel extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_color = null;
    this.m_material = null;
  }

  createMesh(material) {
    let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
    let vs = new Float32Array(this.createVS(0, 0, this.m_width, this.m_height));
    let mesh = VoxMesh_1.VoxMesh.createRawMesh();
    mesh.reset();
    mesh.setBufSortFormat(material.getBufSortFormat());
    mesh.setIVS(ivs);
    mesh.addFloat32Data(vs, 3);
    mesh.initialize();
    return mesh;
  }

  initialize(width, height) {
    if (this.isIniting()) {
      this.init();
      this.m_width = width;
      this.m_height = height;
      let material = VoxMaterial_1.VoxMaterial.createDefaultMaterial();
      material.initializeByCodeBuf(false);
      this.m_color = VoxMaterial_1.VoxMaterial.createColor4();
      let mesh = this.createMesh(material);
      let et = VoxEntity_1.VoxEntity.createDisplayEntity();
      et.setMaterial(material);
      et.setMesh(mesh);
      this.applyRST(et);
      this.m_entities.push(et);
      this.m_material = material;
    }
  }

  setColor(c) {
    this.m_color.copyFrom(c);

    if (this.m_material != null) {
      this.m_material.setColor(c);
    }

    return c;
  }

  getColor() {
    return this.m_color;
  }

  destroy() {
    super.destroy();
    this.m_material = null;
  }

}

exports.ColorLabel = ColorLabel;

/***/ }),

/***/ "9d95":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("0b77");

class TextureLabel extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_pw = 10;
    this.m_ph = 10;
    this.m_sx = 1.0;
    this.m_sy = 1.0;
    this.m_material = null;
    this.m_tex = null;
  }

  initialize(uiScene, tex, width = 128, height = 128) {
    if (tex != null && this.isIniting()) {
      this.init();
      this.m_tex = tex;
      this.m_uiScene = uiScene;
      this.m_color = CoMaterial.createColor4();
      this.m_tex.flipY = true;
      this.m_tex.premultiplyAlpha = true;
      this.m_tex.minFilter = CoRScene.TextureConst.LINEAR;
      this.m_tex.magFilter = CoRScene.TextureConst.NEAREST;
      let material = this.createMaterial(this.m_tex);
      this.m_material = material;
      CoMesh.plane.applyMaterial(material, true);
      let mesh = CoMesh.plane.createXOY(0, 0, 1.0, 1.0);
      this.m_pw = width;
      this.m_ph = height;
      let entity = CoEntity.createDisplayEntity();
      entity.setMaterial(material);
      entity.setMesh(mesh);
      this.m_entities.push(entity);
      this.applyRST(entity);
      super.setScaleXY(this.m_sx * this.m_pw, this.m_sy * this.m_ph);
      this.update();
    }
  }

  setScaleXY(sx, sy) {
    this.m_sx = sx;
    this.m_sy = sy;
    super.setScaleXY(sx * this.m_pw, sy * this.m_ph);
  }

  setScaleX(sx) {
    this.m_sx = sx;
    super.setScaleX(sx * this.m_pw);
  }

  setScaleY(sy) {
    this.m_sy = sy;
    super.setScaleX(sy * this.m_ph);
  }

  getScaleX() {
    return this.m_sx;
  }

  getScaleY() {
    return this.m_sy;
  }

  setColor(c) {
    this.m_color.copyFrom(c);

    if (this.m_material != null) {
      this.m_material.setColor(c);
    }

    return this;
  }

  getColor() {
    return this.m_color;
  }

  destroy() {
    super.destroy();
    this.m_material = null;
    this.m_uiScene = null;
    this.m_tex = null;
  }

}

exports.TextureLabel = TextureLabel;

/***/ }),

/***/ "9f6b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("0b77");

class RectTextTip extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_pw = 10;
    this.m_ph = 10;
    this.m_rpi = 0;
    this.m_texAtlas = null;
    this.m_tex = null;
    this.m_fontSize = 24;
    this.m_text = "tipsInfo";
    this.premultiplyAlpha = true;
  }

  initialize(uiScene, rpi = 0, fontSize = 24, fontColor = null, bgColor = null) {
    if (this.isIniting()) {
      if (rpi < 0) rpi = 0;
      if (fontSize < 12) fontSize = 12;
      this.m_texAtlas = uiScene.texAtlas;
      this.init();
      this.m_uiScene = uiScene;
      this.m_rpi = rpi;
      let entity = CoEntity.createDisplayEntity();
      let cfg = uiScene.uiConfig;
      let tipsText = cfg.getUIGlobalText().fontFormat.tips;
      this.m_fontSize = tipsText.fontSize; // this.m_fontColor = fontColor == null ? CoMaterial.createColor4().setRGB3Bytes(170, 170, 170) : fontColor;

      this.m_fontColor = fontColor == null ? cfg.createColorByData(tipsText.fontColor) : fontColor;
      this.m_bgColor = bgColor == null ? CoMaterial.createColor4(0.1, 0.1, 0.1, 0.5) : bgColor;
      let img = this.m_texAtlas.createCharsImage(this.m_text, this.m_fontSize, this.m_fontColor, this.m_bgColor);
      this.m_tex = uiScene.rscene.textureBlock.createImageTex2D(img.width, img.height);
      this.m_tex.setDataFromImage(img);
      this.m_tex.flipY = true;
      this.m_tex.premultiplyAlpha = true;
      this.m_tex.minFilter = CoRScene.TextureConst.LINEAR;
      this.m_tex.magFilter = CoRScene.TextureConst.NEAREST;
      let material = this.createMaterial(this.m_tex);
      CoMesh.plane.setBufSortFormat(material.getBufSortFormat());
      let mesh = CoMesh.plane.createXOY(0, 0, 1.0, 1.0);
      this.m_pw = img.width;
      this.m_ph = img.height;
      entity.setMaterial(material);
      entity.setMesh(mesh);
      this.m_entities.push(entity);
      this.applyRST(entity);
      this.setScaleXY(img.width, img.height); // this.m_uiScene.addEntity(this, this.m_rpi);
      // this.setVisible(false);
    }
  }

  addEntity(entity) {
    if (entity != null) {
      const ME = CoRScene.MouseEvent;
      entity.addEventListener(ME.MOUSE_OUT, this, this.targetMouseOut);
      entity.addEventListener(ME.MOUSE_OVER, this, this.targetMouseOver);
      entity.addEventListener(ME.MOUSE_MOVE, this, this.targetMouseMove);
    }
  }

  removeEntity(entity) {
    if (entity != null) {
      const ME = CoRScene.MouseEvent;
      entity.removeEventListener(ME.MOUSE_OUT, this, this.targetMouseOut);
      entity.removeEventListener(ME.MOUSE_OVER, this, this.targetMouseOver);
      entity.removeEventListener(ME.MOUSE_MOVE, this, this.targetMouseMove);
    }
  }

  moveTar(tar, mx, my) {
    let bounds = tar.getGlobalBounds();
    let info = tar.info;
    let pv = info.getPos(mx, my, bounds, this.getGlobalBounds(), this.m_uiScene.getRect());
    this.setXY(pv.x, pv.y);
    this.update();
  }

  targetMouseOver(evt) {
    if (this.getScene() == null) {
      this.m_uiScene.addEntity(this, this.m_rpi);
    }

    this.setVisible(true);
    let tar = evt.currentTarget;
    this.setText(tar.info.getCotent());
    this.moveTar(tar, evt.mouseX, evt.mouseY);
  }

  targetMouseMove(evt) {
    let tar = evt.currentTarget;
    this.moveTar(tar, evt.mouseX, evt.mouseY);
  }

  targetMouseOut(evt) {
    this.setVisible(false); // this.m_uiScene.removeEntity(this);
  }

  setText(text) {
    if (this.m_tex != null && text != "" && this.m_text != text) {
      this.m_text = text;
      let img = this.m_texAtlas.createCharsImage(text, this.m_fontSize, this.m_fontColor, this.m_bgColor);
      this.m_tex.setDataFromImage(img, 0, 0, 0, true);
      this.m_tex.updateDataToGpu();
      this.m_pw = img.width;
      this.m_ph = img.height;
      this.setScaleXY(img.width, img.height);
    }
  }

  getText() {
    return this.m_text;
  }

  destroy() {
    super.destroy();
    this.m_uiScene = null;

    if (this.m_tex != null) {
      // this.m_tex.__$detachThis();
      this.m_tex = null;
    }

    this.m_texAtlas = null;
  }

}

exports.RectTextTip = RectTextTip;

/***/ }),

/***/ "b6c0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ColorPickPanel_1 = __webpack_require__("d1ef");

class PanelSystem {
  constructor() {
    this.m_colorPickPanel = new ColorPickPanel_1.ColorPickPanel();
    this.m_curPanel = null;
  }

  initialize(uiscene, rpi = 1) {
    if (this.m_uiscene == null) {
      this.m_uiscene = uiscene;
      this.m_colorPickPanel.setBGColor(CoMaterial.createColor4(0.4, 0.4, 0.4));
      this.m_colorPickPanel.initialize(uiscene, rpi, 260, 260, 3);
    }
  }

  getPanelByName(panelName) {
    switch (panelName) {
      case "colorPickPanel":
        return this.m_colorPickPanel;
        break;

      default:
        return null;
        break;
    }
  }

  setXY(panelName, px, py, type = 0) {
    let panel = this.getPanelByName(panelName);

    if (panel != null) {
      panel.setXY(px, py);
    }
  }

  openPanel(panelName, type = 0) {
    let panel = this.getPanelByName(panelName);

    if (panel != null) {
      panel.open();
    }
  }

  closePanel(panelName, type = 0) {
    let panel = this.getPanelByName(panelName);

    if (panel != null) {
      panel.close();
    }
  }

  getPanel(panelName, type = 0) {
    return this.getPanelByName(panelName);
  }

}

exports.PanelSystem = PanelSystem;

/***/ }),

/***/ "c21f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("0b77");

class ClipLabelBase extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_index = 0;
    this.m_total = 0;
    this.m_step = 6;
    this.m_vtCount = 0;
    this.m_sizes = null;
    this.uuid = "label";
  }

  createVS(startX, startY, pwidth, pheight) {
    let minX = startX;
    let minY = startY;
    let maxX = startX + pwidth;
    let maxY = startY + pheight;
    let pz = 0.0;
    return [minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz];
  }

  setClipIndex(i) {}

  setCircleClipIndex(i) {
    i %= this.m_total;
    i += this.m_total;
    i %= this.m_total;
    this.setClipIndex(i);
  }

  getClipIndex() {
    return this.m_index;
  }

  getClipsTotal() {
    return this.m_total;
  }

  getClipWidthAt(i) {
    if (this.m_sizes != null) {
      if (i >= 0 && i < this.m_total) {
        i = i << 1;
        return this.m_sizes[i];
      }
    } else {
      return this.m_width;
    }
  }

  getClipHeightAt(i) {
    if (this.m_sizes != null) {
      if (i >= 0 && i < this.m_total) {
        i = i << 1;
        return this.m_sizes[i + 1];
      }
    } else {
      return this.m_height;
    }
  }

  getClipWidth() {
    return this.m_width;
  }

  getClipHeight() {
    return this.m_height;
  }

  destroy() {
    this.m_sizes = null;
    this.m_total = 0;
    super.destroy();
  }

}

exports.ClipLabelBase = ClipLabelBase;

/***/ }),

/***/ "cdda":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabel_1 = __webpack_require__("f35d");

const ClipColorLabel_1 = __webpack_require__("05f0");

const Button_1 = __webpack_require__("88b9");

const VoxMaterial_1 = __webpack_require__("0efa");

class ButtonBuilder {
  static createCurrTextBtn(pw, ph, idns, texAtlas, textParam, colors = null) {
    if (textParam.text !== null && textParam.text != "") {
      let colorClipLabel = new ClipColorLabel_1.ClipColorLabel();
      colorClipLabel.initializeWithoutTex(pw, ph, 4);
      colorClipLabel.setColors(colors);
      let iconLable = new ClipLabel_1.ClipLabel();
      iconLable.depthTest = true;
      iconLable.transparent = true;
      iconLable.premultiplyAlpha = true;
      iconLable.initialize(texAtlas, [textParam.text]);
      iconLable.setColor(textParam.textColor);
      let btn = new Button_1.Button();
      btn.uuid = idns;
      btn.addLabel(iconLable);
      btn.initializeWithLable(colorClipLabel);
      return btn;
    }

    return null;
  }

  static createTextLabelButton(texAtlas, uuid, text, width = 90, height = 50, textColor = null, fontSize = 30, fontName = "") {
    if (text == "" || texAtlas == null) return null; // let uisc = __$$$currUISCene;

    let tta = texAtlas;
    let fontColor = textColor != null ? textColor : VoxMaterial_1.VoxMaterial.createColor4(0, 0, 0, 1.0);
    let bgColor = VoxMaterial_1.VoxMaterial.createColor4(1, 1, 1, 0.0);

    if (fontName != "") {
      tta.setFontName(fontName);
    }

    let img = tta.createCharsCanvasFixSize(width, height, text, fontSize, fontColor, bgColor);
    tta.addImageToAtlas(text, img);
    let colorLabel = new ClipColorLabel_1.ClipColorLabel();
    colorLabel.initializeWithoutTex(width, height, 4);
    colorLabel.getColorAt(0).setRGB3f(0.5, 0.5, 0.5);
    colorLabel.getColorAt(1).setRGB3f(0.7, 0.7, 0.7);
    colorLabel.getColorAt(2).setRGB3f(0.6, 0.6, 0.6);
    colorLabel.getColorAt(3).copyFrom(colorLabel.getColorAt(1));
    let iconLable = new ClipLabel_1.ClipLabel();
    iconLable.transparent = true;
    iconLable.premultiplyAlpha = true;
    iconLable.initialize(tta, [text]);
    let btn = new Button_1.Button();
    btn.uuid = uuid;
    btn.addLabel(iconLable);
    btn.initializeWithLable(colorLabel);
    return btn;
  }

  static createTextButton(width, height, idns, texAtlas, textParam, colors) {
    let tp = textParam;
    let img = texAtlas.createCharsCanvasFixSize(width, height, tp.text, tp.fontSize, VoxMaterial_1.VoxMaterial.createColor4(), VoxMaterial_1.VoxMaterial.createColor4(1.0, 1.0, 1.0, 0.0));
    texAtlas.addImageToAtlas(tp.text, img);
    return ButtonBuilder.createCurrTextBtn(width, height, idns, texAtlas, textParam, colors);
  }

  static createPanelBtnWithCfg(couiScene, px, py, btnIndex, uiConfig) {
    let tta = couiScene.transparentTexAtlas;
    let cfg = couiScene.uiConfig;
    let btnSize = uiConfig.btnSize;
    let pw = btnSize[0];
    let ph = btnSize[1];
    let names = uiConfig.btnNames;
    let keys = uiConfig.btnKeys;
    let tips = uiConfig.btnTips;
    let fontFormat = uiConfig.btnTextFontFormat;
    tta.setFontName(fontFormat.font);
    let fontColor = VoxMaterial_1.VoxMaterial.createColor4();
    fontColor.fromBytesArray3(cfg.getUIGlobalColor().text);
    let bgColor = VoxMaterial_1.VoxMaterial.createColor4(1, 1, 1, 0);
    let img = tta.createCharsCanvasFixSize(pw, ph, names[btnIndex], fontFormat.fontSize, fontColor, bgColor);
    tta.addImageToAtlas(names[btnIndex], img);
    let label = Lib_VoxUI.createClipColorLabel();
    label.initializeWithoutTex(pw, ph, 4);
    let iconLable = Lib_VoxUI.createClipLabel();
    iconLable.transparent = true;
    iconLable.premultiplyAlpha = true;
    iconLable.initialize(tta, [names[btnIndex]]);
    let btn = Lib_VoxUI.createButton();
    btn.uuid = keys[btnIndex];
    btn.addLabel(iconLable);
    btn.initializeWithLable(label);
    let tipsAlign = "right";
    let btnStyle = uiConfig.buttonStyle;

    if (btnStyle != undefined) {
      if (btnStyle.globalColor != undefined) {
        tipsAlign = btnStyle.tipsAlign;
        cfg.applyButtonGlobalColor(btn, btnStyle.globalColor);
      }
    }

    if (tips.length > btnIndex) {
      couiScene.tips.addTipsTarget(btn);
      let tipInfo = Lib_VoxUI.createTipInfo().setContent(tips[btnIndex]);

      switch (tipsAlign) {
        case "top":
          btn.info = tipInfo.alignTop();
          break;

        case "bottom":
          btn.info = tipInfo.alignBottom();
          break;

        default:
          btn.info = tipInfo.alignRight();
          break;
      }
    }

    btn.setXY(px, py);
    return btn;
  }

}

exports.ButtonBuilder = ButtonBuilder;

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
    return CoRScene.createDefaultMaterial();
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

/***/ "d1ef":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIPanel_1 = __webpack_require__("d632");

const TextureLabel_1 = __webpack_require__("9d95");

const ColorLabel_1 = __webpack_require__("9ba1");

const VoxRScene_1 = __webpack_require__("d1de");

const VoxMaterial_1 = __webpack_require__("0efa");

class ColorPickPanel extends UIPanel_1.UIPanel {
  constructor() {
    super();
    /**
     * 边距留白尺寸
     */

    this.m_marginWidth = 15;
    this.m_colorLabel = null;
    this.m_callback = null;
    this.m_initing = true;
    this.m_pixelsW = 256;
    this.m_pixelsH = 256;
    this.m_prePickX = -1;
    this.m_prePickY = -1;
    this.m_autoDelay = 0;
  }

  initialize(scene, rpi, panelW = 260, panelH = 260, marginWidth = 3) {
    if (this.isIniting()) {
      this.init();
      this.m_marginWidth = marginWidth;
      this.m_scene = scene;
      this.m_rpi = rpi;
      this.m_panelW = panelW;
      this.m_panelH = panelH;
    }
  }

  destroy() {
    super.destroy();
  }

  setColor(color) {
    if (this.isOpen() && color != null) {
      if (this.m_colorLabel == null) {
        this.m_colorLabel = new ColorLabel_1.ColorLabel();
        this.m_colorLabel.initialize(32, 32);
        this.m_colorLabel.setXY(2, this.m_panelH);
        this.addEntity(this.m_colorLabel);
      }

      this.m_colorLabel.setColor(color);
      this.m_colorLabel.setVisible(true);
    }
  }

  setPickXY(px, py) {
    this.m_prePickX = px;
    this.m_prePickY = py;
  }

  setSelectColorCallback(callback) {
    this.m_callback = callback;
  }

  buildPanel(pw, ph) {
    this.buildItems();
  }

  buildItems() {
    if (this.m_initing) {
      this.m_initing = false;
      let sc = this.getScene();
      let cplUrl = "static/assets/colors.png";
      let dis = this.m_marginWidth;
      let pw = this.m_panelW - 2.0 * dis;
      let ph = this.m_panelH - 2.0 * dis;
      let tex = this.createTexByUrl(cplUrl);
      let texLabel = new TextureLabel_1.TextureLabel();
      texLabel.initialize(sc, tex, pw, ph);
      texLabel.setXY(dis, dis);
      this.addEntity(texLabel);
    }
  }

  getRGBAByXY(px, py) {
    px = px | 0;
    py = py | 0; // if(px < 0 || px > 255 || py < 0 || py > 255) {
    // 	return null;
    // }

    if (px < 0) px = 0;
    if (py < 0) py = 0;
    if (px > 255) px = 255;
    if (py > 255) py = 255;
    py = 255 - py;

    if (this.m_color == null) {
      this.m_color = VoxMaterial_1.VoxMaterial.createColor4();
    }

    let ls = this.m_pixels;

    if (this.m_pixels != null) {
      let i = (py * this.m_pixelsW + px) * 4;
      let r = ls[i];
      let g = ls[i + 1];
      let b = ls[i + 2];
      this.m_color.setRGB3Bytes(r, g, b);
    }

    return this.m_color;
  }

  createColorData(img) {
    let canvas = document.createElement("canvas");
    canvas.style.display = "bolck";
    canvas.style.overflow = "hidden";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.position = "absolute";
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx2D = canvas.getContext("2d");
    ctx2D.drawImage(img, 0, 0);
    let imgData = ctx2D.getImageData(0, 0, img.width, img.height);
    this.m_pixels = imgData.data;
  }

  createTexByUrl(url = "") {
    let sc = this.getScene();
    let tex = sc.rscene.textureBlock.createImageTex2D(64, 64, false);
    let img = new Image();

    img.onload = evt => {
      this.createColorData(img);
      tex.setDataFromImage(img, 0, 0, 0, false);
    };

    img.src = url;
    return tex;
  }

  openThis() {
    if (this.m_scene != null) {
      this.m_scene.addEventListener(VoxRScene_1.MouseEvent.MOUSE_DOWN, this, this.stMouseDownListener);
    }
  }

  closeThis() {
    if (this.m_scene != null) {
      this.m_scene.removeEventListener(VoxRScene_1.MouseEvent.MOUSE_DOWN, this, this.stMouseDownListener);
    }

    this.m_callback = null;
    if (this.m_colorLabel != null) this.m_colorLabel.setVisible(false);
    this.stMouseUp(null);
  }

  pickColorByXY(px, py) {
    if (this.m_prePickX != px || this.m_prePickY != py) {
      this.m_prePickX = px;
      this.m_prePickY = py;

      if (px >= 0 || px <= this.m_panelW || py >= 0 || py <= this.m_panelH) {
        let d = this.m_marginWidth;
        px -= d;
        py -= d;
        let color = this.getRGBAByXY(px, py);

        if (this.m_callback != null) {
          this.setColor(color);
          this.m_callback(color, px, py);
        }
      }
    }
  }

  stMouseDownListener(evt) {
    let px = evt.mouseX;
    let py = evt.mouseY;
    let pv = this.m_v0;
    pv.setXYZ(px, py, 0);
    this.globalToLocal(pv);

    if (pv.x < 0 || pv.x > this.m_panelW || pv.y < 0 || pv.y > this.m_panelH) {
      this.close();
    } else {
      this.pickColorByXY(pv.x, pv.y);
      this.m_scene.addEventListener(VoxRScene_1.EventBase.ENTER_FRAME, this, this.enterFrame, true, false);
      this.m_scene.addEventListener(VoxRScene_1.MouseEvent.MOUSE_UP, this, this.stMouseUp, true, false);
    }
  }

  enterFrame(evt) {
    // console.log("enterFrame");
    if (this.m_autoDelay > 20) {
      if (this.m_autoDelay % 7 == 0) {
        let st = this.getScene().getStage();
        let pv = this.m_v0;
        pv.setXYZ(st.mouseX, st.mouseY, 0);
        this.globalToLocal(pv);
        this.pickColorByXY(pv.x, pv.y);
      }
    }

    this.m_autoDelay++;
  }

  stMouseUp(evt) {
    if (this.m_scene != null) {
      this.m_scene.removeEventListener(VoxRScene_1.EventBase.ENTER_FRAME, this, this.enterFrame);
      this.m_scene.removeEventListener(VoxRScene_1.MouseEvent.MOUSE_UP, this, this.stMouseUp);
    }
  }

  layout() {}

}

exports.ColorPickPanel = ColorPickPanel;

/***/ }),

/***/ "d632":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityContainer_1 = __webpack_require__("23ac");

const ColorLabel_1 = __webpack_require__("9ba1");

class UIPanel extends UIEntityContainer_1.UIEntityContainer {
  constructor() {
    super();
    this.m_panelW = 100;
    this.m_panelH = 150;
    this.m_isOpen = false;
    this.autoLayout = true;
    this.m_openListener = null;
    this.m_closeListener = null;
    this.m_panelBuilding = true;
  }

  setSize(pw, ph) {
    this.m_panelW = pw;
    this.m_panelH = ph;
  }

  setBGColor(c) {
    if (this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
    this.m_bgColor.copyFrom(c);

    if (this.m_bgLabel != null) {
      this.m_bgLabel.setColor(c);
    }

    return this;
  } // initialize(scene: IVoxUIScene, rpi: number, panelW: number, panelH: number): void {
  // 	if (this.isIniting()) {
  // 		this.init();
  // 		this.m_scene = scene;
  // 		this.m_rpi = rpi;
  // 		this.m_panelW = panelW;
  // 		this.m_panelH = panelH;
  // 		this.m_bgColor = CoMaterial.createColor4();
  // 	}
  // }


  init() {
    if (this.isIniting()) {
      if (this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
      super.init();
    }
  }

  setUIscene(scene, rpi = -1) {
    if (this.m_scene == null && scene != null) {
      this.m_scene = scene;
      if (rpi >= 0) this.m_rpi = rpi;
      this.init();
    }
  }

  openThis() {}

  closeThis() {}

  setOpenAndLoseListener(openListener, closeListener) {
    this.m_openListener = openListener;
    this.m_closeListener = closeListener;
  }

  open(uiscene = null, rpi = -1) {
    if (!this.m_isOpen) {
      if (this.isIniting()) {
        this.init();
      }

      if (uiscene != null) this.m_scene = uiscene;
      if (rpi >= 0) this.m_rpi = rpi;
      this.m_scene.addEntity(this, this.m_rpi);
      this.m_isOpen = true;
      this.setVisible(true);
      this.openThis();

      if (this.autoLayout) {
        this.addLayoutEvt();
        this.layout();
      }

      if (this.m_openListener != null) {
        this.m_openListener();
      }
    }
  }

  isOpen() {
    return this.m_isOpen;
  }

  isClosed() {
    return !this.m_isOpen;
  }

  close() {
    if (this.m_isOpen) {
      this.m_scene.removeEntity(this);
      this.m_isOpen = false;
      this.setVisible(false);
      this.removeLayoutEvt();
      this.closeThis();

      if (this.m_closeListener != null) {
        this.m_closeListener();
      }
    }
  }

  destroy() {
    super.destroy();
    this.m_panelBuilding = true;

    if (this.m_bgLabel != null) {
      this.m_bgLabel.destroy();
      this.m_bgLabel = null;
    }

    this.m_openListener = null;
    this.m_closeListener = null;
  }

  buildPanel(pw, ph) {}

  updateScene() {
    let sc = this.getScene();

    if (sc != null && this.m_panelBuilding && this.m_bgLabel == null) {
      this.m_panelBuilding = false;
      let pw = this.m_panelW;
      let ph = this.m_panelH;
      let bgLabel = this.createBG(pw, ph);
      this.buildPanel(pw, ph);
      this.addEntity(bgLabel);
      this.setVisible(this.m_isOpen);

      if (this.m_isOpen) {
        this.addLayoutEvt();
        this.layout();
      }
    }
  }

  addLayoutEvt() {
    if (this.autoLayout) {
      let sc = this.getScene();

      if (sc != null) {
        let EB = CoRScene.EventBase;
        sc.addEventListener(EB.RESIZE, this, this.resize);
      }
    }
  }

  removeLayoutEvt() {
    if (this.autoLayout) {
      let sc = this.getScene();

      if (sc != null) {
        let EB = CoRScene.EventBase;
        sc.removeEventListener(EB.RESIZE, this, this.resize);
      }
    }
  }

  createBG(pw, ph) {
    let bgLabel = new ColorLabel_1.ColorLabel();
    bgLabel.depthTest = true;
    bgLabel.initialize(pw, ph);
    bgLabel.setZ(-0.2);
    bgLabel.setColor(this.m_bgColor);
    this.m_bgLabel = bgLabel;
    this.initializeEvent(bgLabel.getREntities()[0]);
    return bgLabel;
  }

  initializeEvent(entity, uuid = "uiPlane") {
    const me = CoRScene.MouseEvent;
    let dpc = CoRScene.createMouseEvt3DDispatcher();
    dpc.currentTarget = this;
    dpc.uuid = uuid;
    dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
    dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
    entity.setEvtDispatcher(dpc);
    entity.mouseEnabled = true;
  }

  mouseOverListener(evt) {// console.log("mouseOverListener() ...");
  }

  mouseOutListener(evt) {// console.log("mouseOutListener() ...");
  }

  resize(evt) {
    this.layout();
  }

  layout() {
    let sc = this.getScene();

    if (sc != null) {
      this.update();
      let rect = sc.getRect();
      let px = Math.round(rect.x + (rect.width - this.getWidth()) * 0.5);
      let py = Math.round(rect.y + (rect.height - this.getHeight()) * 0.5);
      this.setXY(px, py);
      this.update();
    }
  }

}

exports.UIPanel = UIPanel;

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

/***/ "ddfa":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UIEntityBase_1 = __webpack_require__("0b77");

class ColorClipLabel extends UIEntityBase_1.UIEntityBase {
  constructor() {
    super();
    this.m_index = 0;
    this.m_total = 0;
    this.m_colors = null;
    this.m_hasTex = true;
    this.m_lb = null;
    this.m_ilb = null;
    this.uuid = "colorClipLabel";
  }

  hasTexture() {
    return this.m_hasTex;
  }

  setIconLabel(label) {
    this.m_ilb = label;
  }

  getIconLabel() {
    return this.m_ilb;
  }

  initialize(label, colorsTotal) {
    if (this.isIniting() && colorsTotal > 0) {
      this.init();
      this.m_lb = label;
      let colors = new Array(colorsTotal);

      for (let i = 0; i < colorsTotal; ++i) {
        colors[i] = CoMaterial.createColor4();
      }

      this.m_colors = colors;
      this.m_total = colorsTotal;
      this.setClipIndex(0);
    }
  }

  getColorAt(i) {
    if (i >= 0 && i < this.m_total) {
      return this.m_colors[i];
    }
  }

  setColorAt(i, color4) {
    if (i >= 0 && i < this.m_total && color4 != null) {
      this.m_colors[i].copyFrom(color4);
    }
  }

  setClipIndex(i) {
    if (i >= 0 && i < this.m_total) {
      this.m_index = i;
      this.m_lb.setColor(this.m_colors[i]);
    }
  }

  setColors(colors) {
    if (colors != null) {
      let ls = this.m_colors;
      let len = colors.length;

      if (len > ls.length) {
        len = ls.length;
      }

      for (let i = 0; i < len; ++i) {
        ls[i].copyFrom(colors[i]);
      }

      if (len == 3 && ls.length == 4) {
        ls[3].copyFrom(colors[1]);
      }

      this.setClipIndex(this.m_index);
    }
  }

  setColorsWithHex(colors) {
    if (colors != null) {
      let ls = this.m_colors;
      let len = colors.length;

      if (len > ls.length) {
        len = ls.length;
      }

      for (let i = 0; i < len; ++i) {
        ls[i].setRGBUint24(colors[i]);
      }

      if (len == 3 && ls.length == 4) {
        ls[3].setRGBUint24(colors[1]);
      }

      this.setClipIndex(this.m_index);
    }
  }

  setCircleClipIndex(i) {
    i %= this.m_total;
    i += this.m_total;
    i %= this.m_total;
    this.setClipIndex(i);
  }

  getClipIndex() {
    return this.m_index;
  }

  getClipsTotal() {
    return this.m_total;
  }

  setLabelClipIndex(i) {
    this.m_lb.setClipIndex(i);
  }

  getLabelClipIndex() {
    return this.m_lb.getClipIndex();
  }

  setLabelCircleClipIndex(i) {
    this.m_lb.setCircleClipIndex(i);
  }

  getLabelClipsTotal() {
    return this.m_lb.getClipsTotal();
  }

  getColors() {
    return this.m_colors;
  }

  getClipWidth() {
    return this.m_lb.getClipHeight();
  }

  getClipHeight() {
    return this.m_lb.getClipWidth();
  }

  copyTransformFrom(src) {
    if (src != null) {
      let sx = src.getScaleX();
      let sy = src.getScaleY();
      let r = src.getRotation();
      this.setScaleXY(sx, sy);
      this.setRotation(r);
      src.getPosition(this.m_v0);
      this.setPosition(this.m_v0);
    }
  }
  /**
   * get renderable entities for renderer scene
   * @returns ITransformEntity instance list
   */


  getREntities() {
    if (this.m_ilb != null) {
      let ls = this.m_lb.getREntities();
      return ls.concat(this.m_ilb.getREntities());
    }

    return this.m_lb.getREntities();
  }

  getRContainer() {
    return null;
  }

  update() {
    this.m_bounds.reset();
    let sv = this.m_scaleV;
    let b = this.m_lb;
    b.setRotation(this.m_rotation);
    b.setScaleXY(sv.x, sv.y);
    b.setPosition(this.m_pos);
    b.update();
    this.m_bounds.union(b.getGlobalBounds());
    b = this.m_ilb;

    if (b != null) {
      b.copyTransformFrom(this.m_lb);
      b.update();
      this.m_bounds.union(b.getGlobalBounds());
    }

    this.m_bounds.updateFast();
  }

  destroy() {
    this.m_colors = null;
    this.m_total = 0;
    let b = this.m_lb;

    if (b != null) {
      b.destroy();
      b = null;
    }

    b = this.m_ilb;

    if (b != null) {
      b.destroy();
      b = null;
    }

    super.destroy();
  }

}

exports.ColorClipLabel = ColorClipLabel;

/***/ }),

/***/ "e8f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const Button_1 = __webpack_require__("88b9");

const ClipLabel_1 = __webpack_require__("f35d");

const ColorClipLabel_1 = __webpack_require__("ddfa");

class FlagButton extends Button_1.Button {
  constructor() {
    super();
    this.m_flagLb = null;
    this.m_pw = 32;
    this.m_ph = 32;
    this.m_borderWidth = 4;
    this.m_dis = 4;
    this.uuid = "flagBtn";
  }

  initializeWithSize(atlas, pw = 32, ph = 32, borderWidth = 4, dis = 4) {
    if (this.isIniting() && atlas != null) {
      this.m_pw = pw;
      this.m_ph = ph;
      this.m_borderWidth = borderWidth;
      this.m_dis = dis;
      this.m_selectDispatcher = CoRScene.createEventBaseDispatcher();
      this.m_currEvent = CoRScene.createSelectionEvent();
      this.createFlagBtn(atlas);
    }

    return this;
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    if (type == CoRScene.SelectionEvent.SELECT) {
      this.m_selectDispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    } else {
      super.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }

    return this;
  }

  removeEventListener(type, listener, func) {
    if (type == CoRScene.SelectionEvent.SELECT) {
      this.m_selectDispatcher.removeEventListener(type, listener, func);
    } else {
      super.removeEventListener(type, listener, func);
    }

    return this;
  }

  createFlagBtn(atlas) {
    let texAtlas = atlas;
    let borderColor = CoMaterial.createColor4(0.7, 0.7, 0.7);
    let bgColor = CoMaterial.createColor4(0.3, 0.3, 0.3);
    let canvas = this.createFlagImg(texAtlas, borderColor, bgColor);
    texAtlas.addImageToAtlas("flagBtn_01", canvas);
    borderColor = CoMaterial.createColor4(0.7, 0.7, 0.7);
    bgColor = CoMaterial.createColor4(0.3, 0.3, 0.3);
    let flagColor = CoMaterial.createColor4(1.0, 1.0, 1.0);
    canvas = this.createFlagImg(texAtlas, borderColor, bgColor, flagColor, this.m_dis);
    texAtlas.addImageToAtlas("flagBtn_02", canvas);
    let urls = ["flagBtn_01", "flagBtn_02"];
    let csLable = new ClipLabel_1.ClipLabel();
    csLable.initialize(texAtlas, urls);
    let clb = new ColorClipLabel_1.ColorClipLabel();
    clb.initialize(csLable, 4);
    clb.getColorAt(0).setRGB3f(0.8, 0.8, 0.8);
    clb.getColorAt(1).setRGB3f(0.0, 1.0, 0.2);
    clb.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
    clb.setLabelClipIndex(0);
    this.m_flagLb = csLable;
    this.initializeWithLable(clb);
  }

  sendSelectionEvt() {
    this.m_selectDispatcher.uuid = this.uuid;
    this.m_currEvent.target = this;
    this.m_currEvent.type = CoRScene.SelectionEvent.SELECT;
    this.m_currEvent.flag = this.getFlag();
    this.m_currEvent.phase = 1;
    this.m_selectDispatcher.dispatchEvt(this.m_currEvent);
    this.m_currEvent.target = null;
  }

  mouseUpListener(evt) {
    if (this.isEnabled()) {
      super.mouseUpListener(evt);
      this.selectListener();
    }
  }

  setFlag(flag, sendEvent = false) {
    this.m_flagLb.setClipIndex(flag ? 1 : 0);

    if (sendEvent) {
      this.sendSelectionEvt();
    }
  }

  getFlag() {
    return this.m_flagLb.getClipIndex() == 1;
  }

  selectListener() {
    if (this.m_flagLb.getClipIndex() == 1) {
      this.m_flagLb.setClipIndex(0);
    } else {
      this.m_flagLb.setClipIndex(1);
    }

    console.log("cccccccc selectListener ccccccc, this.m_flagLb.getClipIndex(): ", this.m_flagLb.getClipIndex());
    this.sendSelectionEvt();
  }

  createFlagImg(texAtlas, borderColor, bgColor, flagColor = null, dis = 2) {
    let pw = this.m_pw;
    let ph = this.m_ph;
    let borderWidth = this.m_borderWidth;
    let canvas = texAtlas.createCanvas(pw, ph, borderColor, false);
    let ctx2D = canvas.getContext("2d");
    ctx2D.fillStyle = bgColor.getCSSDecRGBAColor();
    ctx2D.fillRect(borderWidth, borderWidth, pw - 2 * borderWidth, ph - 2 * borderWidth - 1);

    if (flagColor != null) {
      ctx2D.fillStyle = flagColor.getCSSDecRGBAColor();
      ctx2D.fillRect(borderWidth + dis, borderWidth + dis, pw - 2 * (borderWidth + dis), ph - 2 * (borderWidth + dis) - 1);
    }

    return canvas;
  }

  destroy() {
    this.m_flagLb = null;
    super.destroy();
  }

}

exports.FlagButton = FlagButton;

/***/ }),

/***/ "efac":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const LayouterBase_1 = __webpack_require__("5470");

class LeftTopLayouter extends LayouterBase_1.LayouterBase {
  constructor() {
    super();
    this.m_offsetvs = [];
  }

  update(rect) {
    const ls = this.m_entities;
    const len = ls.length;
    let pv = CoMath.createVec3();

    for (let i = 0; i < len; ++i) {
      pv.copyFrom(this.m_offsetvs[i]);
      pv.y = rect.height - pv.y;
      pv.addBy(this.m_offsetV);
      ls[i].setPosition(pv);
      ls[i].update();
    }
  }

  initEntityLayout(entity, initRect) {
    let pv = CoMath.createVec3();
    entity.getPosition(pv);
    pv.y = initRect.height - pv.y;
    this.m_offsetvs.push(pv);
  }

  destroy() {
    this.m_offsetvs = null;
    super.destroy();
  }

}

exports.LeftTopLayouter = LeftTopLayouter;

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

/***/ "f280":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const PromptPanel_1 = __webpack_require__("7913");

class PromptSystem {
  constructor() {
    this.m_promptPanel = null;
  }

  initialize(uiscene, rpi = 3) {
    if (this.m_promptPanel == null) {
      this.m_uiscene = uiscene;
      let cfg = uiscene.uiConfig;
      let uimodule = cfg.getUIPanelCfgByName("promptPanel");
      let plSize = uimodule.panelSize;
      let btnSize = uimodule.btnSize;
      let names = uimodule.btnNames;
      let pl = new PromptPanel_1.PromptPanel(); // pl.initialize(this.m_uiscene, rpi, 300, 200, 120, 50);

      pl.initialize(this.m_uiscene, rpi, plSize[0], plSize[1], btnSize[0], btnSize[1], names[0], names[1]);
      pl.setZ(3.0);
      let color = CoMaterial.createColor4();
      color.fromBytesArray3(uimodule.bgColor); // pl.setBGColor(CoMaterial.createColor4(0.2, 0.2, 0.2));

      pl.setBGColor(color);
      this.m_promptPanel = pl;
    }
  }

  setPromptListener(confirmFunc, cancelFunc, type = 0) {
    if (this.m_promptPanel != null) {
      this.m_promptPanel.setListener(confirmFunc, cancelFunc);
    }
  }

  showPrompt(promptInfo, type = 0) {
    if (this.m_promptPanel != null) {
      this.m_promptPanel.setPrompt(promptInfo);
      this.m_promptPanel.open();
    }
  }

  setPromptTextColor(color, type = 0) {
    if (this.m_promptPanel != null) {
      this.m_promptPanel.setPromptTextColor(color);
    }
  }

  setPromptBGColor(color, type = 0) {
    if (this.m_promptPanel != null) {
      this.m_promptPanel.setBGColor(color);
    }
  }

  getPromptPanel(type = 0) {
    return this.m_promptPanel;
  }

}

exports.PromptSystem = PromptSystem;

/***/ }),

/***/ "f35d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const ClipLabelBase_1 = __webpack_require__("c21f");

class ClipLabel extends ClipLabelBase_1.ClipLabelBase {
  constructor() {
    super();
    this.m_material = null;
  }

  createMesh(atlas, idnsList) {
    let partVtxTotal = 4;
    let pivs = [0, 1, 2, 0, 2, 3];
    const n = this.m_total;
    let ivs = new Uint16Array(n * 6);
    let vs = new Float32Array(n * 12);
    let uvs = new Float32Array(n * 8);
    this.m_sizes = new Array(n * 2);
    let k = 0;

    for (let i = 0; i < n; ++i) {
      const obj = atlas.getTexObjFromAtlas(idnsList[i]);
      ivs.set(pivs, i * pivs.length);
      vs.set(this.createVS(0, 0, obj.getWidth(), obj.getHeight()), i * 12);
      uvs.set(obj.uvs, i * 8);

      for (let j = 0; j < pivs.length; ++j) {
        pivs[j] += partVtxTotal;
      }

      this.m_sizes[k++] = obj.getWidth();
      this.m_sizes[k++] = obj.getHeight();
    }

    let mesh = CoMesh.createRawMesh();
    mesh.reset();
    mesh.setIVS(ivs);
    mesh.addFloat32Data(vs, 3);
    mesh.addFloat32Data(uvs, 2);
    mesh.initialize();
    return mesh;
  }

  hasTexture() {
    return true;
  }

  initialize(atlas, idnsList) {
    if (this.isIniting() && atlas != null && idnsList != null && idnsList.length > 0) {
      this.init();
      this.m_pos = CoMath.createVec3();
      this.m_total = idnsList.length;
      let obj = atlas.getTexObjFromAtlas(idnsList[0]);
      let mesh = this.createMesh(atlas, idnsList);
      this.m_vtCount = mesh.vtCount;
      this.m_material = this.createMaterial(obj.texture);
      this.m_material.vtxInfo = CoRScene.createVtxDrawingInfo();
      let et = CoEntity.createDisplayEntity();
      et.setMaterial(this.m_material);
      et.setMesh(mesh);
      this.m_material.vtxInfo.setIvsParam(0, this.m_step);
      this.m_entities.push(et);
      this.applyRST(et);
      this.setClipIndex(0);
    }
  }

  initializeWithLable(srcLable) {
    if (this.isIniting() && srcLable != null && srcLable != this) {
      if (srcLable.getClipsTotal() < 1) {
        throw Error("Error: srcLable.getClipsTotal() < 1");
      }

      this.init();
      let ls = srcLable.getREntities();

      for (let i = 0; i < ls.length; ++i) {
        let entity = ls[i]; //srcLable.getREntity();

        let mesh = entity.getMesh();
        this.m_pos = CoMath.createVec3();
        let tex = entity.getMaterial().getTextureAt(0);
        let n = this.m_total = srcLable.getClipsTotal();
        this.m_sizes = new Array(n * 2);
        let k = 0;

        for (let i = 0; i < n; ++i) {
          this.m_sizes[k++] = srcLable.getClipWidthAt(i);
          this.m_sizes[k++] = srcLable.getClipHeightAt(i);
        }

        this.m_vtCount = mesh.vtCount;
        this.m_material = this.createMaterial(tex);
        this.m_material.vtxInfo = CoRScene.createVtxDrawingInfo();
        let et = CoEntity.createDisplayEntity();
        et.setMaterial(this.m_material);
        et.setMesh(mesh);
        this.m_material.vtxInfo.setIvsParam(0, this.m_step);
        this.m_entities.push(et);
        this.applyRST(et);
      }

      this.setClipIndex(0);
    }
  }

  displaceFromLable(srcLable) {
    if (srcLable != null && srcLable != this) {
      if (srcLable.getClipsTotal() < 1) {
        throw Error("Error: srcLable.getClipsTotal() < 1");
      } // if (this.m_entities == null) {
      // 	this.initializeWithLable(srcLable);
      // } else if (this.m_entities[0].isRFree()) {
      // }

    }
  }

  setColor(color) {
    if (this.m_material != null) {
      this.m_material.setColor(color);
    }
  }

  getColor(color) {
    if (this.m_material != null) {
      this.m_material.getColor(color);
    }
  }

  setClipIndex(i) {
    if (i >= 0 && i < this.m_total) {
      this.m_index = i; // console.log("setClipIndex(), i: ", i);

      let ls = this.m_entities;

      for (let k = 0; k < ls.length; ++k) {
        // ls[k].setIvsParam(i * this.m_step, this.m_step);
        ls[k].getMaterial().vtxInfo.setIvsParam(i * this.m_step, this.m_step);
      }

      i = i << 1;
      this.m_width = this.m_sizes[i];
      this.m_height = this.m_sizes[i + 1];
    }
  }

}

exports.ClipLabel = ClipLabel;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("7dc1");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });