(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Lib_VoxModelEdit"] = factory();
	else
		root["Lib_VoxModelEdit"] = factory();
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

/***/ "0148":
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

const SphereRayTester_1 = __webpack_require__("832f");

const DashedLineRayTester_1 = __webpack_require__("b633");

const MoveCtr_1 = __webpack_require__("aae9");
/**
 * 在直线上拖动
 */


class DragLine extends MoveCtr_1.MoveCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_cone = null;
    this.tv = CoMath.createVec3(1.0, 0.0, 0.0);
    this.coneTransMat4 = CoMath.createMat4();
    this.innerSphereRadius = 30.0;
    this.coneScale = 1.0;
    this.m_line_pv = CoMath.createVec3();
    this.m_initPos = CoMath.createVec3();
    this.m_pos = CoMath.createVec3();
    this.m_dv = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_initV = CoMath.createVec3();
    this.m_mat4 = CoMath.createMat4();
    this.m_invMat4 = CoMath.createMat4();
    this.m_rpv = CoMath.createVec3();
    this.m_rtv = CoMath.createVec3();
  }

  initialize(size = 100.0, innerSize = 0) {
    if (this.m_entity == null) {
      let r = this.pickTestRadius;
      CoMesh.line.dynColorEnabled = true; // console.log("DragLine::initialize(), mesh.bounds: ", mesh.bounds);

      let material = CoMaterial.createLineMaterial(true);
      CoMesh.line.setBufSortFormat(material.getBufSortFormat());
      let minV = this.tv.clone().scaleBy(innerSize);
      let maxV = this.tv.clone().scaleBy(size);
      let mesh = CoMesh.line.createLine(minV, maxV, r);
      this.m_entity = CoEntity.createDisplayEntity();
      this.m_entity.setMaterial(material);
      this.m_entity.setMesh(mesh);

      if (mesh) {
        let lineTester = new DashedLineRayTester_1.DashedLineRayTester(mesh.getVS(), 1, r);
        lineTester.setPrevTester(new SphereRayTester_1.SphereRayTester(this.innerSphereRadius));
        mesh.setRayTester(lineTester);
      }

      this.applyEvent(this.m_entity);
      const coneB = CoMesh.cone;
      material = CoMaterial.createDefaultMaterial();
      material.initializeByCodeBuf(false);
      coneB.setBufSortFormat(material.getBufSortFormat());
      coneB.transMatrix = this.coneTransMat4;
      mesh = coneB.create(this.coneScale * 0.5 * r, this.coneScale * 1.5 * r, 10, 0.0);
      this.m_cone = CoEntity.createDisplayEntity();
      this.m_cone.setMaterial(material);
      this.m_cone.setMesh(mesh);
      this.applyEvent(this.m_cone);
    }
  }

  getCone() {
    return this.m_cone;
  }

  getEntity() {
    return this.m_entity;
  }

  setVisible(visible) {
    this.m_entity.setVisible(visible);
    this.m_cone.setVisible(visible);
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  showOverColor() {
    this.setEntityColor(this.m_entity, this.overColor);
    this.setEntityColor(this.m_cone, this.overColor);
  }

  showOutColor() {
    this.setEntityColor(this.m_entity, this.outColor);
    this.setEntityColor(this.m_cone, this.outColor);
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
    this.m_cone.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
    this.m_cone.mouseEnabled = false;
  }

  destroy() {
    super.destroy();

    if (this.m_entity) {
      this.m_entity.destroy();
      this.m_entity = null;
    }

    if (this.m_cone) {
      this.m_cone.destroy();
      this.m_cone = null;
    }
  }

  calcClosePos(rpv, rtv) {
    if (this.isSelected()) {
      let mat4 = this.m_invMat4; // world to local

      mat4.transformVector3Self(rpv);
      mat4.deltaTransformVectorSelf(rtv);
      const outV = this.m_outV;
      CoAGeom.Line.CalcTwoSLCloseV2(rpv, rtv, this.m_line_pv, this.tv, outV);
      mat4 = this.m_mat4; // to world pos

      mat4.transformVector3Self(outV);
    }
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        this.m_rpv.copyFrom(rpv);
        this.m_rtv.copyFrom(rtv);
        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.m_dv.copyFrom(this.m_outV);
        this.m_dv.subtractBy(this.m_initV);
        this.m_pos.copyFrom(this.m_initPos);
        this.m_pos.addBy(this.m_dv);

        if (this.m_target) {
          this.m_target.setPosition(this.m_pos);
          this.m_target.update();
        }
      }
    }
  }

  mouseDownListener(evt) {
    console.log("DragLine::mouseDownListener() ...");

    if (this.isEnabled()) {
      this.editBegin();
      this.setThisVisible(true);
      this.m_target.select(this);
      const trans = this.m_entity.getTransform();
      this.m_mat4.copyFrom(trans.getMatrix());
      this.m_invMat4.copyFrom(trans.getInvMatrix());
      this.m_rpv.copyFrom(evt.raypv);
      this.m_rtv.copyFrom(evt.raytv);
      this.calcClosePos(this.m_rpv, this.m_rtv);
      this.m_initV.copyFrom(this.m_outV);
      this.m_target.getPosition(this.m_initPos);
    }
  }

}

exports.DragLine = DragLine;

/***/ }),

/***/ "0b69":
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

const ScaleCtr_1 = __webpack_require__("abf9");
/**
 * 支持在一个平面上拖动缩放
 */


class ScaleDragPlane extends ScaleCtr_1.ScaleCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_frameEntity = null;
    this.offsetV = CoMath.createVec3(30, 30, 30);
    this.m_planeAxisType = 0;
    this.m_planeNV = CoMath.createVec3(0.0, 1.0, 0.0);
    this.m_planePos = CoMath.createVec3();
    this.m_planeDis = 0.0;
    this.m_pos = CoMath.createVec3();
    this.m_dv = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_rpv = CoMath.createVec3();
    this.m_rtv = CoMath.createVec3();
    this.m_sv = CoMath.createVec3();
    this.m_dis = 1.0;
    this.m_initNV = CoMath.createVec3();
  }

  initialize(rs, container, planeAxisType, size) {
    if (this.m_entity == null) {
      this.m_editRS = rs;
      this.m_container = container;
      const V3 = CoMath.Vector3D;
      let material = CoRScene.createDefaultMaterial();
      material.initializeByCodeBuf(false);
      this.m_entity = CoRScene.createDisplayEntity();
      this.m_frameEntity = CoRScene.createDisplayEntity();
      let ml = CoMesh.line;
      ml.dynColorEnabled = true;
      let line_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
      line_material.initializeByCodeBuf(false);
      ml.setBufSortFormat(material.getBufSortFormat());
      let etL = this.m_frameEntity;
      etL.setMaterial(line_material);
      let et = this.m_entity;
      et.setMaterial(material);
      let mp = CoMesh.plane;
      mp.setBufSortFormat(material.getBufSortFormat());
      let ov = this.offsetV;
      this.m_planeAxisType = planeAxisType;

      switch (planeAxisType) {
        case 0:
          // xoz
          et.setMesh(mp.createXOZ(ov.x, ov.z, size, size));
          etL.setMesh(ml.createRectXOZ(ov.x, ov.z, size, size));
          this.setPlaneNormal(V3.Y_AXIS);
          break;

        case 1:
          // xoy
          et.setMesh(mp.createXOY(ov.x, ov.y, size, size));
          etL.setMesh(ml.createRectXOY(ov.x, ov.y, size, size));
          this.setPlaneNormal(V3.Z_AXIS);
          break;

        case 2:
          // yoz
          et.setMesh(mp.createYOZ(ov.y, ov.z, size, size));
          etL.setMesh(ml.createRectYOZ(ov.y, ov.z, size, size));
          this.setPlaneNormal(CoMath.Vector3D.X_AXIS);
          break;

        default:
          throw Error("Error type !!!");
          break;
      }

      et.setRenderState(CoRScene.RendererState.NONE_TRANSPARENT_STATE);
      this.m_container.addEntity(et);
      this.m_container.addEntity(etL);
      this.showOutColor();
      this.applyEvent(this.m_entity);
    }
  }

  mouseOverListener(evt) {
    // console.log("ScaleDragPlane::mouseOverListener() ...");
    this.showOverColor();
  }

  mouseOutListener(evt) {
    // console.log("ScaleDragPlane::mouseOutListener() ...");
    this.showOutColor();
  }

  showOverColor() {
    this.setEntityColor(this.m_entity, this.overColor);
    this.setEntityColor(this.m_frameEntity, this.overColor, 0.7);
  }

  showOutColor() {
    this.setEntityColor(this.m_entity, this.outColor);
    this.setEntityColor(this.m_frameEntity, this.outColor, 0.7);
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
  }

  setRenderState(state) {
    this.m_entity.setRenderState(state);
  }

  setVisible(visible) {
    this.m_entity.setVisible(visible);
    this.m_frameEntity.setVisible(visible);
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  destroy() {
    super.destroy();

    if (this.m_container) {
      this.m_container.removeEntity(this.m_entity);
      this.m_container.removeEntity(this.m_frameEntity);
    }

    if (this.m_entity) {
      this.m_entity.destroy();
    }

    if (this.m_frameEntity) {
      this.m_frameEntity.destroy();
    }

    this.m_entity = null;
    this.m_frameEntity = null;
    this.m_editRS = null;
    this.m_container = null;
  }

  calcClosePos(rpv, rtv) {
    CoAGeom.PlaneUtils.IntersectLinePos2(this.m_planeNV, this.m_planeDis, rpv, rtv, this.m_outV);
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        this.m_rpv.copyFrom(rpv);
        this.m_rtv.copyFrom(rtv);
        this.calcClosePos(this.m_rpv, this.m_rtv);
        let V3 = CoMath.Vector3D;
        let dis = V3.Distance(this.m_pos, this.m_outV);
        if (dis < 1.0) dis = 1.0;
        const sv = this.m_sv;
        let sx = 1.0;
        let sy = 1.0;
        let sz = 1.0;
        let scale = dis / this.m_dis;
        let type = this.m_planeAxisType;

        if (type == 0) {
          // xoz
          sx = scale;
          sz = scale;
        } else if (type == 1) {
          // xoy
          sx = scale;
          sy = scale;
        } else {
          // yoz
          sy = scale;
          sz = scale;
        }

        if (this.m_target != null) {
          this.m_target.setScaleXYZ(sv.x * sx, sv.y * sy, sv.z * sz);
          this.m_target.update();
        }
      }
    }
  }
  /**
   * set plane world onrmal vactor3
   * @param nv
   */


  setPlaneNormal(nv) {
    this.m_planeNV.copyFrom(nv);
    this.m_planeNV.normalize();
    this.m_initNV.copyFrom(this.m_planeNV);
  }

  selectByParam(raypv, raytv, wpos) {
    this.m_rpv.copyFrom(raypv);
    this.m_rtv.copyFrom(raytv);
    this.m_planePos.copyFrom(wpos);
    this.m_planeNV.copyFrom(this.m_initNV);
    let invMat = this.m_entity.getMatrix();
    invMat.deltaTransformVectorSelf(this.m_planeNV);
    this.m_planeNV.normalize();
    this.m_planeDis = this.m_planePos.dot(this.m_planeNV);
    this.calcClosePos(this.m_rpv, this.m_rtv);
    this.m_target.getPosition(this.m_dv);
    this.m_dv.subtractBy(this.m_outV);
  }

  mouseDownListener(evt) {
    if (this.isEnabled()) {
      this.editBegin();
      this.setThisVisible(true);
      console.log("ScaleDragPlane::mouseDownListener() ...");
      this.m_target.select();
      this.selectByParam(evt.raypv, evt.raytv, evt.wpos);
      this.m_target.getScaleXYZ(this.m_sv);
      this.m_target.getPosition(this.m_pos);
      let V3 = CoMath.Vector3D;
      this.m_dis = V3.Distance(this.m_pos, this.m_outV);
      if (this.m_dis < 1.0) this.m_dis = 1.0;
    }
  }

}

exports.default = ScaleDragPlane;

/***/ }),

/***/ "141a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class CtrlTargetBase {
  constructor() {
    this.m_controllers = [];
    this.m_tars = null;
    this.m_vs = [];
    this.m_flags = [];
    this.m_changed = false;
    this.m_v3 = CoMath.createVec3();
    this.valueFilter = null;
    this.type = -1;
    this.rotation = CoMath.createVec3();
    this.container = null;
    this.position = CoMath.createVec3();
    this.version = 0;
  }

  select(controller = null) {}

  deselect() {
    this.m_tars = null;
  }

  addCtrlEntity(entity) {
    if (entity) {
      this.m_controllers.push(entity);
      this.m_flags.push(true);
    }
  }

  setTargets(targets) {}

  getTargets() {
    return this.m_tars;
  }

  setCtrlScaleXYZ(sx, sy, sz) {
    this.container.setScaleXYZ(sx, sy, sz);
    const ls = this.m_controllers;

    for (let i = 0; i < ls.length; ++i) {
      if (ls[i].transFlag && ls[i].transFlag > 0) {
        ls[i].setScaleXYZ(sx, sy, sz);
      }
    }
  }

  setXYZ(px, py, pz) {
    return this;
  }

  setPosition(pv) {
    return this;
  }

  getPosition(pv) {
    return this.container.getPosition(pv);
  }

  setRotation3(r) {
    return this;
  }

  setRotationXYZ(rx, ry, rz) {
    return this;
  }

  setScaleXYZ(sx, sy, sz) {
    return this;
  }

  getRotationXYZ(rv) {
    return null;
  }

  getScaleXYZ(sv) {
    return null;
  }

  getGlobalBounds() {
    return null;
  }

  getLocalBounds() {
    return null;
  }

  localToGlobal(pv) {}

  globalToLocal(pv) {}

  update() {
    if (this.m_changed) {
      let tars = this.m_tars;

      if (tars) {
        for (let i = 0; i < tars.length; ++i) {
          tars[i].update();
        }
      }
    }

    this.container.update();
  }

  updateCtrl() {
    this.container.update();
  }

  destroy() {
    this.m_tars = null;
    this.m_controllers = null;
    this.container = null;
  }

}

exports.CtrlTargetBase = CtrlTargetBase;

/***/ }),

/***/ "15a7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class RectFrameQuery {
  constructor() {
    this.m_entities = null;
    this.m_rect = CoMath.createAABB2D();
  }

  query(entities, total) {
    this.m_entities = [];

    if (total > 0) {
      let list = this.m_entities;
      const rect = this.m_rect;
      let pv = CoMath.createVec3();
      let cam = this.m_rscene.getCamera();
      let st = this.m_rscene.getStage3D();

      for (let i = 0; i < total; ++i) {
        if (entities[i].mouseEnabled) {
          let bounds = entities[i].getGlobalBounds();
          pv.copyFrom(bounds.center);
          cam.worldPosToScreen(pv);
          pv.x += st.stageHalfWidth;
          pv.y += st.stageHalfHeight;

          if (rect.containsXY(pv.x, pv.y)) {
            list.push(entities[i]);
          }
        }
      }
    }
  }

  initialize(rscene) {
    if (this.m_rscene == null) {
      this.m_rscene = rscene;
    }
  }

  getEntities(min, max) {
    const rect = this.m_rect;
    rect.setTo(min.x, min.y, max.x - min.x, max.y - min.y);

    if (rect.width * rect.height > 0) {
      let rscene = this.m_rscene;
      rscene.getSpace().renderingEntitySet.query(this);
      return this.m_entities;
    }

    return null;
  }

}

exports.RectFrameQuery = RectFrameQuery;

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

/***/ "1f30":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class FloorLineGrid {
  constructor() {
    this.m_entity = null;
  }

  initialize(rscene, rpi, minV, maxV, stepsTotal = 10, color = null) {
    if (this.m_entity == null) {
      if (rpi < 0) rpi = 0;
      if (stepsTotal < 1) stepsTotal = 1;
      if (color == null) color = CoMaterial.createColor4(0.3, 0.3, 0.3, 1.0);
      this.m_rscene = rscene;
      this.m_entity = CoEntity.createDisplayEntity(); // xoz

      let type = 1;
      let dv = CoMath.createVec3().subVecsTo(maxV, minV);

      if (dv.z < 0.1) {
        // xoy
        type = 0;
      } else if (dv.x < 0.1) {
        // yoz
        type = 2;
      }

      dv.scaleBy(1.0 / stepsTotal);
      let rn = stepsTotal + 1;
      let cn = stepsTotal + 1;
      let pv0 = minV.clone();
      let pv1 = maxV.clone();
      let pv2 = maxV.clone();
      let pvs = new Array(rn * 2);
      let j = 0; // xoz

      if (type == 1) {
        for (let i = 0; i < rn; ++i) {
          pv0.x = minV.x + dv.x * i;
          pv0.z = minV.z;
          pv1.copyFrom(pv0);
          pv1.z = maxV.z;
          pvs[j++] = pv0.clone();
          pvs[j++] = pv1.clone();
          pv2.copyFrom(pv0);
          pv0.x = pv1.z;
          pv0.z = pv1.x;
          pv1.x = pv2.z;
          pv1.z = pv2.x;
          pvs[j++] = pv0.clone();
          pvs[j++] = pv1.clone();
        }
      } else if (type == 2) {
        // yoz
        for (let i = 0; i < rn; ++i) {
          pv0.y = minV.y + dv.y * i;
          pv0.z = minV.z;
          pv1.copyFrom(pv0);
          pv1.z = maxV.z;
          pvs[j++] = pv0.clone();
          pvs[j++] = pv1.clone();
          pv2.copyFrom(pv0);
          pv0.y = pv1.z;
          pv0.z = pv1.y;
          pv1.y = pv2.z;
          pv1.z = pv2.y;
          pvs[j++] = pv0.clone();
          pvs[j++] = pv1.clone();
        }
      } else {
        // xoy
        for (let i = 0; i < rn; ++i) {
          pv0.x = minV.x + dv.x * i;
          pv0.y = minV.y;
          pv1.copyFrom(pv0);
          pv1.y = maxV.y;
          pvs[j++] = pv0.clone();
          pvs[j++] = pv1.clone();
          pv2.copyFrom(pv0);
          pv0.x = pv1.y;
          pv0.y = pv1.x;
          pv1.x = pv2.y;
          pv1.y = pv2.x;
          pvs[j++] = pv0.clone();
          pvs[j++] = pv1.clone();
        }
      }

      CoMesh.line.dynColorEnabled = true;
      let material = CoMaterial.createLineMaterial(CoMesh.line.dynColorEnabled);
      material.setColor(color);
      material.initializeByCodeBuf(false);
      CoMesh.line.setBufSortFormat(material.getBufSortFormat());
      let mesh = CoMesh.line.createLines(pvs);
      this.m_entity.setMaterial(material);
      this.m_entity.setMesh(mesh); // this.m_entity.setXYZ(80, 80, 0);

      rscene.addEntity(this.m_entity, rpi);
    }
  }

  setVisible(v) {
    if (this.m_entity != null) {
      this.m_entity.setVisible(v);
    }
  }

}

exports.FloorLineGrid = FloorLineGrid;

/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CtrlTargetBase_1 = __webpack_require__("141a");

class MovedTarget extends CtrlTargetBase_1.CtrlTargetBase {
  constructor() {
    super();
  }

  select(controller = null) {
    let tars = this.m_tars;

    if (tars) {
      let vs = this.m_vs;

      if (this.container == null) {
        if (controller == null) controller = this.m_controllers[0];
        controller.getPosition(this.m_v3);
      } else {
        this.container.getPosition(this.m_v3);
      }

      for (let i = 0; i < tars.length; ++i) {
        vs[i].copyFrom(tars[i].getGlobalBounds().center);
        vs[i].subtractBy(this.m_v3);
      }
    }
  }

  setTargets(targets) {
    this.m_tars = targets;

    if (targets) {
      if (this.m_vs == null || this.m_vs.length < targets.length) {
        this.m_vs = new Array(targets.length);

        for (let i = 0; i < targets.length; ++i) {
          this.m_vs[i] = CoMath.createVec3();
        }
      }
    } else {
      this.m_vs = [];
    }
  }

  setPosition(pv) {
    if (this.valueFilter) {
      this.valueFilter.ctrlValueFilter(this.type, pv);
    }

    this.version++;
    const tars = this.m_tars;

    if (tars) {
      const vs = this.m_vs;
      const v3 = this.m_v3;
      let dv = CoMath.createVec3();
      let pos = CoMath.createVec3();

      for (let i = 0; i < tars.length; ++i) {
        v3.addVecsTo(pv, vs[i]);
        tars[i].getPosition(pos);
        dv.subVecsTo(tars[i].getGlobalBounds().center, pos);
        v3.subtractBy(dv);
        tars[i].setPosition(v3);
      }
    }

    this.container.setPosition(pv);
    this.position.copyFrom(pv);
    this.m_changed = true;
    return this;
  }

}

exports.MovedTarget = MovedTarget;

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

/***/ "2b49":
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

const UserEditCtr_1 = __webpack_require__("df9f");
/**
 * 旋转编辑控制
 */


class RotationCtr extends UserEditCtr_1.UserEditCtr {
  constructor() {
    super();
    this.m_container = null;
    this.outColor = CoMaterial.createColor4(0.9, 0.9, 0.9, 1.0);
    this.overColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0);
    this.pickTestRadius = 20;
    this.m_ctrList = RotationCtr.s_list;
    this.m_ctrList.push(this);
  }

}

RotationCtr.s_list = [];
exports.RotationCtr = RotationCtr;

/***/ }),

/***/ "2b63":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class UIRectLine {
  constructor() {
    this.m_entity = null;
    this.m_pz = 0.0;
    this.m_flag = false;
    this.m_prePos = CoMath.createVec3();
    this.m_currPos = CoMath.createVec3();
    this.m_enabled = false;
    this.bounds = CoMath.createAABB();
  }

  initialize(rscene) {
    if (this.m_entity == null) {
      this.m_rscene = rscene;
      this.m_entity = CoEntity.createDisplayEntity();
      CoMesh.line.dynColorEnabled = true;
      let material = CoMaterial.createLineMaterial(CoMesh.line.dynColorEnabled);
      CoMesh.line.setBufSortFormat(material.getBufSortFormat());
      let mesh = CoMesh.line.createRectXOY(0, 0, 1, 1);
      this.m_entity.setMaterial(material);
      this.m_entity.setMesh(mesh);
      rscene.addEntity(this.m_entity);
      this.disable();
    }
  }

  reset() {
    this.m_enabled = false;
    this.bounds.reset();
    this.m_prePos.copyFrom(this.m_currPos.setXYZ(0, 0, 0));
  }

  enable() {
    this.m_enabled = true;
  }

  disable() {
    this.m_enabled = false;
    this.setVisible(false);
  }

  isEnabled() {
    return this.m_enabled;
  }

  isSelectEnabled() {
    return this.m_flag && this.m_enabled && CoMath.Vector3D.Distance(this.m_prePos, this.m_currPos) > 0.98;
  }

  setVisible(v) {
    if (this.m_entity) {
      this.m_entity.setVisible(v);
    }
  }

  isVisible() {
    if (this.m_entity) {
      return this.m_entity.getVisible();
    }

    return false;
  }

  setZ(pz) {
    this.m_pz = pz;
  }

  begin(px, py) {
    this.m_flag = true;
    this.bounds.reset();
    this.m_currPos.copyFrom(this.m_prePos);

    if (this.m_enabled) {
      this.m_prePos.setXYZ(px, py, this.m_pz);
      this.m_currPos.copyFrom(this.m_prePos);
      this.move(px, py);
    }
  }

  end(px, py) {
    if (this.m_enabled) {
      this.setVisible(false);
    }

    this.m_flag = false;
  }

  move(px, py) {
    const v = this.m_prePos;

    if (this.m_enabled && this.m_flag && CoMath.Vector3D.DistanceXYZ(v.x, v.y, 0, px, py, 0) > 1.0) {
      if (this.m_entity != null) {
        this.m_currPos.setXYZ(px, py, 0);
        this.setVisible(true);
        let b = this.bounds;
        b.reset();
        b.addPosition(this.m_prePos);
        b.addXYZ(px, py, 0);
        b.updateFast();
        let et = this.m_entity;
        et.setScaleXYZ(b.getWidth(), b.getHeight(), 1.0);
        et.setPosition(b.min);
        et.update();
      }
    }
  }

}

exports.UIRectLine = UIRectLine;

/***/ }),

/***/ "30db":
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

const CircleRayTester_1 = __webpack_require__("3477");

const RotationCtr_1 = __webpack_require__("2b49");

const RotationRing_1 = __webpack_require__("e50b");
/**
 * 在camera view z axis 上 拖动旋转
 */


class RotationCamZCircle extends RotationCtr_1.RotationCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_cv = CoMath.createVec3();
    this.m_planeNV = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_rotV = CoMath.createVec3();
    this.m_scaleV = CoMath.createVec3();
    this.m_posV = CoMath.createVec3();
    this.m_srcDV = CoMath.createVec3();
    this.m_dstDV = CoMath.createVec3();
    this.m_camPos = CoMath.createVec3();
    this.m_mat0 = CoMath.createMat4();
    this.m_initDegree = 0;
    this.m_planeDis = 0;
    this.m_material = null;
    this.m_editRS = null;
    this.m_ring = null;
    this.m_camVer = -7;
  }
  /**
   * init the circle mouse event display entity
   * @param radius circle radius
   * @param segsTotal segments total
   * @param type 0 is xoy, 1 is xoz, 2 is yoz
   * @param color IColor4 instance
   */


  initialize(rs, container, radius, segsTotal) {
    if (this.m_entity == null) {
      this.m_editRS = rs;
      this.m_container = container;
      this.m_ring = new RotationRing_1.RotationRing();
      this.m_entity = CoEntity.createDisplayEntity();
      let ml = CoMesh.line;
      let mesh;
      ml.dynColorEnabled = true;
      let pnv = this.m_planeNV; // yoz

      mesh = ml.createCircleYOZ(radius, segsTotal);
      pnv.setXYZ(1, 0, 0);
      mesh.setRayTester(new CircleRayTester_1.CircleRayTester(radius, this.m_cv, null, pnv, this.m_planeDis, this.pickTestRadius));
      this.m_entity.setMesh(mesh);
      this.m_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
      this.m_material.setColor(this.outColor);
      this.m_entity.setMaterial(this.m_material);
      this.m_entity.update();
      this.applyEvent(this.m_entity);
      this.m_container.addEntity(this.m_entity);
      this.m_ring.initialize(rs, container, radius, 120, 2);
      this.m_ring.setVisible(false);
    }
  }

  run(camera, rtv, force = false) {
    if (this.m_camVer != camera.version || force) {
      this.m_camVer = camera.version; // 圆面朝向摄像机

      const sv = this.m_scaleV;
      let et = this.m_entity;
      et.getPosition(this.m_posV);
      et.getScaleXYZ(sv);
      this.m_camPos.copyFrom(camera.getPosition());
      let container = this.m_target.container;
      container.globalToLocal(this.m_camPos);
      this.m_srcDV.setXYZ(1, 0, 0);
      this.m_dstDV.subVecsTo(this.m_camPos, this.m_posV);
      let rad = CoMath.Vector3D.RadianBetween(this.m_srcDV, this.m_dstDV);
      let axis = this.m_rotV;
      CoMath.Vector3D.Cross(this.m_srcDV, this.m_dstDV, axis);
      axis.normalize();
      let mat = this.m_mat0;
      mat.identity();
      mat.appendRotation(rad, axis);
      let rv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
      et.setRotation3(rv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));
      et.update();
      this.m_ring.setPosition(this.m_posV);
      this.m_ring.setRotation3(rv);
      this.m_ring.setScale3(sv);
    }
  }

  setVisible(visible) {
    // console.log("RotationCamZCircle::setVisible() ..., visible: ", visible);
    this.m_entity.setVisible(visible);
    if (!visible) this.m_ring.setVisible(visible);
    this.m_camVer = -7;
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
  }

  showOverColor() {
    this.m_entity.getMaterial().setColor(this.overColor);
  }

  showOutColor() {
    this.m_entity.getMaterial().setColor(this.outColor);
    this.m_ring.setColor(this.outColor);
  }

  deselect() {
    console.log("RotationCamZCircle::deselect() ...");

    if (this.isSelected()) {
      this.editEnd();
      this.setAllVisible(true);
      this.m_ring.setVisible(false);
    }
  }

  destroy() {
    super.destroy();

    if (this.m_entity != null) {
      this.m_container.removeEntity(this.m_entity);
      this.m_entity.destroy();
      this.m_entity = null;
    }

    if (this.m_ring != null) {
      this.m_ring.destroy();
      this.m_ring = null;
    }

    this.m_container = null;
    this.m_editRS = null;
    this.m_mat0 = null;
    this.m_cv = null;
    this.m_planeNV = null;
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        let degree = this.getDegree(rpv, rtv);
        degree -= this.m_initDegree;
        if (degree > 360) degree -= 360.0;else if (degree < 0) degree += 360.0;
        this.m_ring.setProgress(degree / 360.0);
        let et = this.m_target;

        if (et) {
          let mat = this.m_mat0;
          let axis = this.m_dstDV;
          axis.subVecsTo(this.m_camPos, this.m_posV);
          axis.normalize();
          mat.identity();
          mat.appendRotation(CoMath.MathConst.DegreeToRadian(degree), axis);
          let rv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
          et.setRotation3(rv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));
          et.update();
        }
      }
    }
  }

  mouseDownListener(evt) {
    console.log("RotationCamZCircle::mouseDownListener() ..., evt: ", evt);

    if (this.isEnabled()) {
      this.editBegin();
      this.m_target.select();
      this.setThisVisible(true);
      this.m_initDegree = this.getDegree(evt.raypv, evt.raytv);
      this.m_ring.setVisible(true);
      this.m_ring.setRingRotation(this.m_initDegree);
      this.m_ring.setProgress(0.0);
    }
  }

  getDegree(rpv, rtv) {
    let degree = 0;

    if (this.isSelected()) {
      let u = CoAGeom.PlaneUtils;
      let pnv = this.m_srcDV.copyFrom(rtv).scaleBy(-1.0);
      let pos = this.m_posV;
      this.m_entity.getPosition(pos);
      let hitFlag = u.IntersectRayLinePos2(pnv, pos.dot(pnv), rpv, rtv, this.m_outV); // if(this.m_axisEntity == null) {
      //     this.m_axisEntity = CoEntity.createCrossAxis3DEntity(20);
      //     this.m_editRS.addEntity(this.m_axisEntity, 1);
      // }
      // this.m_axisEntity.setPosition(this.m_outV);
      // this.m_axisEntity.update();

      let v = this.m_outV;
      this.m_entity.globalToLocal(v);

      if (hitFlag) {
        hitFlag = u.Intersection == CoAGeom.Intersection.Hit;
        let V3 = CoMath.Vector3D;

        if (hitFlag && V3.Distance(v, this.m_cv) > 2.0) {
          v.subtractBy(this.m_cv);
          let et = this.m_target;

          if (et != null) {
            // YOZ, X-Axis
            degree = CoMath.MathConst.GetDegreeByXY(v.y, v.z);
            if (degree > 360) degree -= 360.0;else if (degree < 0) degree += 360.0;
          }
        }
      }
    }

    return degree;
  }

}

exports.RotationCamZCircle = RotationCamZCircle;

/***/ }),

/***/ "3477":
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

class CircleRayTester {
  constructor(radius, center, direcV, pnv, pdis, rayTestRadius) {
    this.isHit = false;
    this.m_pv0 = CoMath.createVec3();
    this.m_outV0 = CoMath.createVec3();
    this.m_radius = radius;
    this.m_center = center;
    this.m_direcV = direcV;
    this.m_planeNV = pnv;
    this.m_planeDis = pdis;
    this.m_rayTestRadius = rayTestRadius;
  }

  setPrevTester(tester) {}

  testRay(rlpv, rltv, outV, boundsHit) {
    const rv = this.m_outV0;
    const u = CoAGeom.PlaneUtils;
    this.isHit = u.IntersectRayLinePos2(this.m_planeNV, this.m_planeDis, rlpv, rltv, rv);

    if (this.isHit) {
      this.isHit = u.Intersection == CoAGeom.Intersection.Hit;

      if (this.isHit) {
        // 计算出center -> rv 这个 line 与 圆心的交点
        let pv0 = this.m_pv0;
        pv0.subVecsTo(rv, this.m_center);

        if (pv0.getLengthSquared() > 0.1) {
          pv0.normalize();
          pv0.scaleBy(this.m_radius);
          let dis = CoAGeom.Line.CalcPVDis(rltv, rlpv, pv0);
          this.isHit = dis < this.m_rayTestRadius;

          if (this.isHit) {
            if (this.m_direcV == null || this.m_direcV.dot(rv) > 0) {
              outV.copyFrom(pv0);
              return 1;
            } // console.log("hit the plane circle, its nv: ", this.m_planeNV, ", this.m_radius: ", this.m_radius);

          }
        } // let dis = CoMath.Vector3D.Distance(rv, this.m_center);
        // this.isHit = Math.abs(dis - this.m_radius) < this.m_rayTestRadius;
        // // console.log("value: ", dis - this.m_radius, this.m_rayTestRadius, this.isHit);
        // // console.log("hit the plane, its nv: ", this.m_planeNV, this.isHit);
        // // 应该是计算 和 圆弧 形状的 管道 体 相交测试，上面的计算是错误的不准确的
        // if( this.isHit ) {
        //     if(this.m_direcV == null || this.m_direcV.dot(rv) > 0) {
        //         outV.copyFrom(rv);
        //         return 1;
        //     }
        //     // console.log("hit the plane circle, its nv: ", this.m_planeNV, ", this.m_radius: ", this.m_radius);
        // }

      }
    }

    this.isHit = false;
    return 0;
  }

  destroy() {
    this.m_center = null;
    this.m_planeNV = null;
  }

}

exports.CircleRayTester = CircleRayTester;

/***/ }),

/***/ "35d4":
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
 * transform 编辑控制器基类
 */

class DragTransController {
  constructor() {
    this.m_controllers = [];
    this.m_rpv = CoMath.createVec3();
    this.m_rtv = CoMath.createVec3();
    this.m_tempPos = CoMath.createVec3();
    this.m_mv0 = CoMath.createVec3(-100000, -100000, 0);
    this.m_mv1 = CoMath.createVec3();
    this.m_visible = true;
    this.m_enabled = true;
    this.m_container = null;
    this.m_bodyContainer = null;
    this.m_editRS = null;
    this.m_editRSPI = 0;
    this.m_target = null;
    /**
     * example: the value is 0.05
     */

    this.fixSize = 0.0;
    this.runningVisible = true;
    this.uuid = "DragTransController";
  }
  /**
   * initialize the DragTransController instance.
   * Don't overide this function
   * @param editRendererScene a IRendererScene instance.
   * @param processid this destination renderer process id in the editRendererScene.
   */


  initialize(rc, container, bodyContainer) {
    if (this.m_editRS == null) {
      this.m_editRS = rc;
      this.m_container = container;
      this.m_bodyContainer = bodyContainer;
      this.init();
      this.applyEvt();
    }
  }
  /**
   * 需要被子类覆盖，以便实现具体的功能
   */


  init() {}

  applyEvt() {
    for (let i = 0; i < this.m_controllers.length; ++i) {
      this.m_controllers[i].addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.dragMouseDownListener);
    }
  }

  dragMouseDownListener(evt) {
    this.m_editRS.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.dragMouseUpListener, true, true);
  }

  dragMouseUpListener(evt) {
    this.m_editRS.removeEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.dragMouseUpListener);
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    for (let i = 0; i < this.m_controllers.length; ++i) {
      this.m_controllers[i].addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
  }

  removeEventListener(type, listener, func) {
    for (let i = 0; i < this.m_controllers.length; ++i) {
      this.m_controllers[i].removeEventListener(type, listener, func);
    }
  }

  getCtrlTarget() {
    return this.m_target;
  }

  enable() {
    this.m_enabled = true;

    for (let i = 0; i < this.m_controllers.length; ++i) {
      this.m_controllers[i].enable();
    }
  }

  disable() {
    this.m_enabled = false;

    for (let i = 0; i < this.m_controllers.length; ++i) {
      this.m_controllers[i].disable();
    }

    this.m_target.setTargets(null);
  }

  isEnabled() {
    return this.m_enabled;
  }

  run(force = true) {
    if (this.m_enabled) {
      let ls = this.m_controllers;
      this.m_tempPos.copyFrom(this.m_target.position);
      let cam = this.m_editRS.getCamera();
      let stage = this.m_editRS.getStage3D();

      for (let i = 0; i < ls.length; ++i) {
        if (ls[i].getVisible()) {
          ls[i].run(cam, this.m_rtv, force);
        }
      }

      this.m_mv1.setXYZ(stage.mouseX, stage.mouseY, 0);

      if (CoMath.Vector3D.DistanceSquared(this.m_mv0, this.m_mv1) > 0.001) {
        this.m_mv0.copyFrom(this.m_mv1);
        this.m_editRS.getMouseXYWorldRay(this.m_rpv, this.m_rtv);

        for (let i = 0; i < ls.length; ++i) {
          if (ls[i].isSelected()) {
            ls[i].moveByRay(this.m_rpv, this.m_rtv);
          }
        }
      }
    }
  }

  isSelected() {
    let flag = false;
    let ls = this.m_controllers;

    for (let i = 0; i < ls.length; ++i) {
      flag = flag || ls[i].isSelected();
    }

    return flag;
  }

  select(targets) {
    this.m_target.setTargets(targets);
    this.m_target.select(null);
    this.setVisible(targets != null);
  }

  deselect() {
    console.log("DragTransController::deselect() ..., this.m_controllers.length: ", this.m_controllers.length);
    this.m_target.deselect();

    for (let i = 0; i < this.m_controllers.length; ++i) {
      this.m_controllers[i].deselect();
    }
  }

  decontrol() {
    for (let i = 0; i < this.m_controllers.length; ++i) {
      this.m_controllers[i].deselect();
    }
  }

  getTargets() {
    return this.m_target.getTargets();
  }

  getVersion() {
    return this.m_target.version;
  }

  setVisible(visible) {
    this.m_visible = visible;

    for (let i = 0; i < this.m_controllers.length; ++i) {
      this.m_controllers[i].setVisible(visible);
    }

    return this;
  }

  moveByRay(rpv, rtv) {}

  getVisible() {
    return this.m_visible;
  }

  setXYZ(px, py, pz) {
    return this;
  }

  setPosition(pv) {
    this.m_target.setPosition(pv);
    this.m_target.update();
    return this;
  }

  getPosition(pv) {
    this.m_controllers[0].getPosition(pv);
    return pv;
  }

  setRotation3(r) {
    this.m_target.setRotation3(r);
    return this;
  }

  setRotationXYZ(rx, ry, rz) {
    return this;
  }

  setScaleXYZ(sx, sy, sz) {
    this.m_target.setScaleXYZ(sx, sy, sz);
    return this;
  }

  setCtrlScaleXYZ(sx, sy, sz) {
    this.m_target.setCtrlScaleXYZ(sx, sy, sz);
  }

  getRotationXYZ(pv) {
    return null;
  }

  getScaleXYZ(pv) {
    return null;
  }

  getGlobalBounds() {
    return null;
  }

  getLocalBounds() {
    return null;
  }

  localToGlobal(pv) {}

  globalToLocal(pv) {}

  update() {}

  updateCtrl() {
    if (this.m_enabled) {
      this.m_target.updateCtrl();
    }
  }

  destroy() {
    if (this.m_controllers.length > 0) {
      for (let i = 0; i < this.m_controllers.length; ++i) {
        this.m_controllers[i].destroy();
      }

      this.m_controllers = [];
    }

    this.m_editRS = null;
    this.m_container = null;
    this.m_bodyContainer = null;
  }

}

exports.DragTransController = DragTransController;

/***/ }),

/***/ "36b4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const FloorLineGrid_1 = __webpack_require__("1f30");

const UserEditEvent_1 = __webpack_require__("7d28");

exports.UserEditEvent = UserEditEvent_1.UserEditEvent;

const CoTransformRecorder_1 = __webpack_require__("4703");

const TransformController_1 = __webpack_require__("c16d");

;

const UIRectLine_1 = __webpack_require__("2b63");

const RectFrameQuery_1 = __webpack_require__("15a7");

function createTransformRecorder() {
  return new CoTransformRecorder_1.CoTransformRecorder();
}

exports.createTransformRecorder = createTransformRecorder;

function createTransformController() {
  return new TransformController_1.TransformController();
}

exports.createTransformController = createTransformController;

function createFloorLineGrid() {
  return new FloorLineGrid_1.FloorLineGrid();
}

exports.createFloorLineGrid = createFloorLineGrid;

function createUIRectLine() {
  return new UIRectLine_1.UIRectLine();
}

exports.createUIRectLine = createUIRectLine;

function createRectFrameQuery() {
  return new RectFrameQuery_1.RectFrameQuery();
}

exports.createRectFrameQuery = createRectFrameQuery;

/***/ }),

/***/ "4362":
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

const DragTransController_1 = __webpack_require__("35d4");

const RotationCircle_1 = __webpack_require__("cdd5");

const RotationCamZCircle_1 = __webpack_require__("30db");

const RotatedTarget_1 = __webpack_require__("5f45");

const RotationCamXYCircle_1 = __webpack_require__("eaa4");
/**
 * 在三个坐标轴上拖动旋转
 */


class DragRotationController extends DragTransController_1.DragTransController {
  constructor() {
    super();
    this.radius = 100.0;
    this.pickTestAxisRadius = 20;
    this.camZCircleRadius = 120;
    this.camYXCircleRadius = 80;
  }

  createCircle(type, color, radius = 100.0, segsTotal = 20) {
    let circle = new RotationCircle_1.RotationCircle();
    circle.pickTestRadius = this.pickTestAxisRadius;
    circle.outColor.copyFrom(color);
    circle.overColor.copyFrom(color);
    circle.overColor.scaleBy(2.0);
    circle.initialize(this.m_editRS, this.m_container, radius, segsTotal, type);
    circle.showOutColor();
    circle.setTarget(this.m_target);
    this.m_target.addCtrlEntity(circle);
    this.m_controllers.push(circle);
    return circle;
  }

  init() {
    this.m_target = new RotatedTarget_1.RotatedTarget();
    this.m_target.container = this.m_bodyContainer; // 粉色 240,55,80, 绿色 135 205 55,  蓝色:  80, 145, 240

    let n = Math.floor(this.radius / 2.0);

    if (n < 30) {
      n = 30;
    } // xoz


    let color = CoMaterial.createColor4(); // xoy

    this.createCircle(0, color.setRGB3Bytes(240, 55, 80), this.radius, n); // xoz

    this.createCircle(1, color.setRGB3Bytes(135, 205, 55), this.radius, n); // yoz

    this.createCircle(2, color.setRGB3Bytes(80, 145, 240), this.radius, n);
    n = Math.floor(this.camZCircleRadius / 2.0);
    let camZCtrl = new RotationCamZCircle_1.RotationCamZCircle();
    camZCtrl.pickTestRadius = this.pickTestAxisRadius;
    camZCtrl.initialize(this.m_editRS, this.m_container, this.camZCircleRadius, n);
    camZCtrl.setTarget(this.m_target);
    this.m_target.addCtrlEntity(camZCtrl);
    this.m_controllers.push(camZCtrl);
    let camYXCtrl = new RotationCamXYCircle_1.RotationCamXYCircle();
    camYXCtrl.pickTestRadius = this.pickTestAxisRadius;
    camYXCtrl.initialize(this.m_editRS, this.m_container, this.camYXCircleRadius);
    camYXCtrl.showOutColor();
    camYXCtrl.setTarget(this.m_target);
    this.m_target.addCtrlEntity(camYXCtrl);
    this.m_controllers.push(camYXCtrl);
  }

}

exports.DragRotationController = DragRotationController;

/***/ }),

/***/ "4703":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class TransNode {
  constructor() {
    this.position = CoMath.createVec3();
    this.scale = CoMath.createVec3();
    this.rotation = CoMath.createVec3();
  }

}

let s_saveTimes_save = 0;
let s_usedTimes_save = 0;

class TransNodeGroup {
  constructor() {
    this.list = [];
  }

  add(tar) {
    let node = new TransNode();
    tar.getPosition(node.position);
    tar.getScaleXYZ(node.scale);
    tar.getRotationXYZ(node.rotation);
    node.target = tar;
    this.list.push(node);
  }

  use() {
    let ls = this.list;
    s_saveTimes_save--;
    let list = []; // let tars_uids: number[] = [];

    for (let i = 0; i < ls.length; ++i) {
      const d = ls[i];
      const tar = d.target;
      tar.setScale3(d.scale);
      tar.setRotation3(d.rotation);
      tar.setPosition(d.position);
      tar.update();
      list.push(tar); // tars_uids.push(tar.getUid());
    } // console.log("XXXX$$$$ TransNodeGroup::use(), s_saveTimes_save: ", s_saveTimes_save);
    // console.log("XXXX$$$$ TransNodeGroup::use(), list: ", list, tars_uids);


    return list;
  }

  destroy() {
    this.list = [];
  }

}
/**
 * renderable space transforming history recorder
 */


class CoTransformRecorder {
  constructor() {
    this.m_undoList = [];
    this.m_redoList = [];
    this.m_currList = null;
    this.m_beginGroup = null;
  }

  createGroup(tars) {
    if (tars != null) {
      let group = new TransNodeGroup();

      for (let i = 0; i < tars.length; ++i) {
        group.add(tars[i]);
      }

      return group;
    }
  }
  /**
   * 单步存放当前状态，所以初始化target的时候就应该存放进来
   * @param tars IRenderEntity instance list
   */


  save(tars) {
    this.m_currList = null;
    if (this.m_redoList.length > 0) this.m_redoList = [];
    let group = this.createGroup(tars);

    if (group != null) {
      s_saveTimes_save++;
      this.m_undoList.push(group);
    }
  }
  /**
   * 与saveEnd 协作存放当前状态，所以初始化target的时候就应该存放进来
   * @param tars IRenderEntity instance list
   */


  saveBegin(tars) {
    this.m_currList = null;
    this.m_beginGroup = this.createGroup(tars);
  }
  /**
   * 与saveBegin 协作存放当前状态，所以初始化target的时候就应该存放进来
   * @param tars IRenderEntity instance list
   */


  saveEnd(tars) {
    this.m_currList = null;
    let begin = this.m_beginGroup;
    this.m_beginGroup = null;

    if (begin != null) {
      let group = this.createGroup(tars);

      if (group != null) {
        this.m_undoList.push(begin);
        this.m_undoList.push(group);
        s_saveTimes_save++;
        begin = null;
      }
    }

    if (begin != null) {
      begin.destroy();
    }
  } // Ctrl + Z


  undo() {
    this.m_currList = null;
    let ls = this.m_undoList;
    let len = ls.length;

    if (len > 1) {
      // console.log("XXXX$$$$ CoTransformRecorder::undo().");
      let node0 = ls.pop();
      let node1 = ls.pop();
      this.m_redoList.push(node1);
      this.m_redoList.push(node0);
      this.m_currList = node1.use();
    }
  } // Ctrl + Y


  redo() {
    this.m_currList = null;
    let ls = this.m_redoList;
    let len = ls.length;

    if (len > 1) {
      // console.log("XXX redo().");
      let node0 = ls.pop();
      let node1 = ls.pop();
      this.m_currList = node0.use();
      this.m_undoList.push(node1);
      this.m_undoList.push(node0);
    }
  }

  getCurrList() {
    let list = this.m_currList;
    this.m_currList = null;
    return list;
  }

}

exports.CoTransformRecorder = CoTransformRecorder;

/***/ }),

/***/ "5205":
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

const SphereRayTester_1 = __webpack_require__("832f");

const MoveCtr_1 = __webpack_require__("aae9");
/**
 * 支持在一个和鼠标射线垂直的平面上拖动
 */


class DragRayCrossPlane extends MoveCtr_1.MoveCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_rscene = null;
    this.m_container = null;
    this.m_billPos = null;
    this.m_circle = null;
    this.m_planeNV = CoMath.createVec3(0.0, 1.0, 0.0);
    this.m_planePos = CoMath.createVec3();
    this.m_planeDis = 0.0;
    this.m_pos = CoMath.createVec3();
    this.m_dv = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_rpv = CoMath.createVec3();
    this.m_rtv = CoMath.createVec3();
  }

  initialize(rscene, container, size = 30) {
    if (this.m_entity == null) {
      this.transFlag = 1;
      this.m_rscene = rscene;
      this.m_container = container;
      let bounds = CoEntity.createBoundsEntity();
      let radius = size * 0.5;
      let minV = CoMath.createVec3(radius, radius, radius).scaleBy(-1.0);
      let maxV = CoMath.createVec3(radius, radius, radius);
      bounds.setBounds(minV, maxV);
      bounds.setRayTester(new SphereRayTester_1.SphereRayTester(radius));
      this.applyEvent(bounds);
      bounds.mouseEnabled = false;
      container.addChild(bounds);
      this.m_entity = bounds;
      let par = CoParticle.createBillboard();
      par.initializeSquare(radius * 0.2, [this.createTexByUrl("static/assets/circle01.png")]);
      container.addChild(par.entity);
      let RST = CoRScene.RendererState;
      par.entity.setRenderState(RST.NONE_TRANSPARENT_ALWAYS_STATE);
      this.m_billPos = par;
      let segsTotal = Math.floor(radius * 0.5);
      let bl = CoParticle.createBillboardLine();
      bl.initializeCircleXOY(radius, segsTotal < 50 ? 50 : segsTotal);
      container.addChild(bl.entity);
      bl.entity.setRenderState(RST.NONE_TRANSPARENT_ALWAYS_STATE);
      this.m_circle = bl;
      this.showOutColor();
    }
  }

  createTexByUrl(url = "") {
    let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);
    let img = new Image();

    img.onload = evt => {
      tex.setDataFromImage(img, 0, 0, 0, false);
    };

    img.src = url != "" ? url : "static/assets/box.jpg";
    return tex;
  }

  getEntity() {
    return this.m_entity;
  }

  showOverColor() {
    let c = this.overColor;
    this.m_circle.setRGB3f(c.r, c.g, c.b);
  }

  showOutColor() {
    let c = this.outColor;
    this.m_circle.setRGB3f(c.r, c.g, c.b);
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
  }

  setRenderState(state) {
    this.m_entity.setRenderState(state);
  }

  setVisible(visible) {
    this.m_entity.setVisible(visible);
    this.m_circle.entity.setVisible(visible);
    this.m_billPos.entity.setVisible(visible);
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  setScaleXYZ(sx, sy, sz) {
    this.m_entity.setScaleXYZ(sx, sy, sz);
    this.m_circle.setScaleXY(sx, sy);
    this.m_billPos.setScaleXY(sx, sy);
    this.m_entity.update();
    this.m_circle.update();
    this.m_billPos.update();
    return this;
  }

  destroy() {
    super.destroy();

    if (this.m_entity) {
      this.m_container.removeEntity(this.m_entity);
      this.m_entity.destroy();
    }

    if (this.m_circle) {
      this.m_container.removeEntity(this.m_circle.entity);
      this.m_circle.destroy();
    }

    if (this.m_billPos) {
      this.m_container.removeEntity(this.m_billPos.entity);
      this.m_billPos.destroy();
    }

    this.m_rscene = null;
    this.m_container = null;
  }

  calcClosePos(rpv, rtv) {
    CoAGeom.PlaneUtils.IntersectLinePos2(this.m_planeNV, this.m_planeDis, rpv, rtv, this.m_outV);
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        this.m_rpv.copyFrom(rpv);
        this.m_rtv.copyFrom(rtv);
        const pv = this.m_pos;
        this.calcClosePos(this.m_rpv, this.m_rtv);
        pv.copyFrom(this.m_outV);
        pv.addBy(this.m_dv);

        if (this.m_target) {
          this.m_target.setPosition(pv);
          this.m_target.update();
        }
      }
    }
  }
  /**
   * set plane world onrmal vactor3
   * @param nv
   */


  setPlaneNormal(nv) {
    this.m_planeNV.copyFrom(nv);
    this.m_planeNV.normalize();
  }

  selectByParam(raypv, raytv, wpos) {
    this.m_rpv.copyFrom(raypv);
    this.m_rtv.copyFrom(raytv);
    this.m_planePos.copyFrom(wpos);
    this.m_planeNV.copyFrom(this.m_rtv);
    this.m_planeNV.normalize();
    this.m_planeDis = this.m_planePos.dot(this.m_planeNV);
    this.calcClosePos(this.m_rpv, this.m_rtv);
    this.m_target.getPosition(this.m_dv);
    this.m_dv.subtractBy(this.m_outV);
  }

  mouseDownListener(evt) {
    console.log("DragRayCrossPlane::mouseDownListener() this.isEnabled(): ", this.isEnabled());

    if (this.isEnabled()) {
      console.log("DragRayCrossPlane::mouseDownListener() ...");
      this.editBegin();
      this.setThisVisible(true);
      this.m_target.select(this);
      this.selectByParam(evt.raypv, evt.raytv, evt.wpos);
    }
  }

}

exports.default = DragRayCrossPlane;

/***/ }),

/***/ "5e48":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CtrlTargetBase_1 = __webpack_require__("141a");

class ScaleTarget extends CtrlTargetBase_1.CtrlTargetBase {
  constructor() {
    super();
    this.m_svs = [];
    this.m_sv = CoMath.createVec3();
    this.m_pv = CoMath.createVec3();
  }

  select(controller = null) {
    let tars = this.m_tars;

    if (tars != null) {
      const vs = this.m_vs;
      const svs = this.m_svs;
      let cv = this.position;
      cv.setXYZ(0.0, 0.0, 0.0);

      for (let i = 0; i < tars.length; ++i) {
        vs[i].copyFrom(tars[i].getGlobalBounds().center);
        cv.addBy(vs[i]);
      }

      cv.scaleBy(1.0 / tars.length);

      for (let i = 0; i < tars.length; ++i) {
        vs[i].copyFrom(tars[i].getGlobalBounds().center);
        vs[i].subtractBy(cv);
        tars[i].getScaleXYZ(svs[i]);
      }
    }
  }

  setTargets(targets) {
    this.m_tars = targets;

    if (targets != null) {
      if (this.m_vs == null || this.m_vs.length < targets.length) {
        this.m_vs = new Array(targets.length);
        this.m_svs = new Array(targets.length);

        for (let i = 0; i < targets.length; ++i) {
          this.m_vs[i] = CoMath.createVec3();
          this.m_svs[i] = CoMath.createVec3();
        }
      }
    } else {
      this.m_vs = [];
      this.m_svs = [];
    }
  }

  setPosition(pv) {
    this.container.setPosition(pv);
    return this;
  }

  setScaleXYZ(sx, sy, sz) {
    if (this.m_tars) {
      this.version++;
      this.m_sv.setXYZ(sx, sy, sz);

      if (this.valueFilter) {
        this.valueFilter.ctrlValueFilter(this.type, this.m_sv);
        sx = this.m_sv.x;
        sy = this.m_sv.y;
        sz = this.m_sv.z;
      }

      const vs = this.m_vs;
      const svs = this.m_svs;
      const cv = this.position;
      let pv = this.m_pv;
      let dv = CoMath.createVec3();
      let pos = CoMath.createVec3();
      let tars = this.m_tars;

      for (let i = 0; i < tars.length; ++i) {
        const sv = svs[i];
        tars[i].setScaleXYZ(sv.x * sx, sv.y * sy, sv.z * sz);
      }

      for (let i = 0; i < tars.length; ++i) {
        pv.copyFrom(vs[i]).multBy(this.m_sv).addBy(cv); // calc new bounds center position

        tars[i].update();
        dv.subVecsTo(tars[i].getGlobalBounds().center, pv);
        tars[i].getPosition(pos);
        pos.subtractBy(dv);
        tars[i].setPosition(pos);
      }

      this.m_changed = true;
    }

    return this;
  }

  getScaleXYZ(sv) {
    sv.setXYZ(1.0, 1.0, 1.0);
    return sv;
  }

}

exports.ScaleTarget = ScaleTarget;

/***/ }),

/***/ "5f45":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CtrlTargetBase_1 = __webpack_require__("141a");

class RotatedTarget extends CtrlTargetBase_1.CtrlTargetBase {
  constructor() {
    super();
    this.m_rvs = [];
    this.m_rv = CoMath.createVec3();
    this.m_pv = CoMath.createVec3();
    this.m_rotv = CoMath.createVec3();
    this.m_mat0 = CoMath.createMat4();
    this.m_mat1 = CoMath.createMat4();
  }

  select(controller = null) {
    let tars = this.m_tars;

    if (tars) {
      const vs = this.m_vs;
      const rvs = this.m_rvs;
      let piOver180 = Math.PI / 180.0;
      let cv = this.position;
      cv.setXYZ(0.0, 0.0, 0.0);

      for (let i = 0; i < tars.length; ++i) {
        vs[i].copyFrom(tars[i].getGlobalBounds().center);
        cv.addBy(vs[i]);
      }

      cv.scaleBy(1.0 / tars.length);

      for (let i = 0; i < tars.length; ++i) {
        vs[i].copyFrom(tars[i].getGlobalBounds().center);
        vs[i].subtractBy(cv);
        tars[i].getRotationXYZ(rvs[i]);
        rvs[i].scaleBy(piOver180);
      }
    }
  }

  setTargets(targets) {
    this.m_tars = targets;

    if (targets) {
      if (this.m_vs == null || this.m_vs.length < targets.length) {
        this.m_vs = new Array(targets.length);
        this.m_rvs = new Array(targets.length);

        for (let i = 0; i < targets.length; ++i) {
          this.m_vs[i] = CoMath.createVec3();
          this.m_rvs[i] = CoMath.createVec3();
        }
      }

      this.m_rotv.setXYZ(0, 0, 0);
      this.rotation.setXYZ(0, 0, 0);
      console.log("Rotation Reset ...");
    } else {
      this.m_vs = [];
      this.m_rvs = [];
    }
  }

  setPosition(pv) {
    this.container.setPosition(pv);
    return this;
  }

  getPosition(pv) {
    pv.copyFrom(this.position);
    return pv;
  }

  setRotation3(pr) {
    // console.log("setRotationXYZ(), rx, ry, rz: ", rx, ry, rz);
    if (this.m_tars) {
      this.version++;
      let tars = this.m_tars; // console.log("setRotation3(), pr: ", pr);

      let piOver180 = Math.PI / 180.0;
      let k180overPI = 180.0 / Math.PI;
      let ir = this.m_rv;

      if (this.valueFilter) {
        this.valueFilter.ctrlValueFilter(this.type, pr);
      }

      ir.copyFrom(pr).scaleBy(piOver180);
      let mt0 = this.m_mat0;
      let mt1 = this.m_mat1;
      const vs = this.m_vs;
      const rvs = this.m_rvs;
      const cv = this.position;
      let pv = this.m_pv;
      pv.setXYZ(0, 0, 0);
      let dv = CoMath.createVec3();
      let pos = CoMath.createVec3();
      let rv = this.m_rotv;
      let eulerType = CoMath.OrientationType.EULER_ANGLES;
      mt0.identity();
      mt0.setRotationEulerAngle(rv.x, rv.y, rv.z);
      mt1.identity();
      mt1.setRotationEulerAngle(ir.x, ir.y, ir.z);
      mt0.append(mt1);
      let prv = mt0.decompose(eulerType)[1];
      prv.scaleBy(k180overPI); // if(this.valueFilter) {
      // 	this.valueFilter.ctrlValueFilter(this.type, prv);
      // }

      this.rotation.copyFrom(prv);

      for (let i = 0; i < tars.length; ++i) {
        rv = rvs[i];
        mt0.identity();
        mt0.setRotationEulerAngle(rv.x, rv.y, rv.z);
        mt1.identity();
        mt1.setRotationEulerAngle(ir.x, ir.y, ir.z);
        mt0.append(mt1);
        prv = mt0.decompose(eulerType)[1];
        prv.scaleBy(k180overPI);
        tars[i].setRotation3(prv);
        tars[i].update();
        prv = tars[i].getMatrix().decompose(eulerType)[1].scaleBy(k180overPI); // if(this.valueFilter) {
        // 	this.valueFilter.ctrlValueFilter(this.type, prv);
        // 	tars[i].setRotation3(prv);
        // 	tars[i].update();
        // }
      }

      if (tars.length == 1) {
        this.rotation.copyFrom(prv);
      } // console.log("this.rotation: ", this.rotation);
      // console.log("prv: ", prv);


      for (let i = 0; i < tars.length; ++i) {
        mt0.identity();
        mt0.setRotationEulerAngle(ir.x, ir.y, ir.z);
        pv.copyFrom(vs[i]);
        mt0.transformVector3Self(pv);
        pv.addBy(cv); // calc new bounds center position

        tars[i].update();
        dv.subVecsTo(tars[i].getGlobalBounds().center, pv);
        tars[i].getPosition(pos);
        pos.subtractBy(dv);
        tars[i].setPosition(pos);
      }

      this.m_changed = true;
    }

    return this;
  }

  getRotationXYZ(rv) {
    rv.setXYZ(0.0, 0.0, 0.0);
    return rv;
  }

}

exports.RotatedTarget = RotatedTarget;

/***/ }),

/***/ "7281":
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

const ScaleDragPlane_1 = __importDefault(__webpack_require__("0b69"));

const DragScaleRayCrossPlane_1 = __importDefault(__webpack_require__("d51f"));

const ScaleCamZCircle_1 = __webpack_require__("91df");

const ScaleDragLine_1 = __webpack_require__("8441");

const ScaleTarget_1 = __webpack_require__("5e48");

const DragTransController_1 = __webpack_require__("35d4");
/**
 * 在三个坐标轴上拖拽缩放
 */


class DragScaleController extends DragTransController_1.DragTransController {
  constructor() {
    super();
    this.circleSize = 60.0;
    this.axisSize = 100.0;
    this.planeSize = 30.0;
    this.planeAlpha = 0.6;
    this.pickTestAxisRadius = 20;
    this.camZCircleRadius = 120;
  }

  createDragPlane(type, alpha, outColor) {
    let movePlane = new ScaleDragPlane_1.default();
    movePlane.moveSelfEnabled = false;
    movePlane.initialize(this.m_editRS, this.m_container, type, this.planeSize);
    outColor.a = alpha;
    movePlane.outColor.copyFrom(outColor);
    outColor.scaleBy(1.5);
    outColor.a = 1.3 * alpha;
    movePlane.overColor.copyFrom(outColor);
    movePlane.setTarget(this.m_target);
    this.m_target.addCtrlEntity(movePlane);
    this.m_controllers.push(movePlane);
    movePlane.showOutColor();
    return movePlane;
  }

  createDragLine(tv, outColor, mat4) {
    let trans = tv.clone().scaleBy(this.axisSize);
    mat4.setTranslation(trans);
    let line = new ScaleDragLine_1.ScaleDragLine();
    line.boxScale = 0.4;
    line.coneTransMat4 = mat4;
    line.tv.copyFrom(tv);
    line.innerSphereRadius = this.circleSize * 0.5;
    line.moveSelfEnabled = false;
    line.pickTestRadius = this.pickTestAxisRadius;
    line.initialize(this.m_container, this.axisSize, line.innerSphereRadius);
    line.outColor.copyFrom(outColor);
    outColor.scaleBy(1.5);
    line.overColor.copyFrom(outColor);
    line.showOutColor();
    line.setTarget(this.m_target);
    this.m_target.addCtrlEntity(line.getEntity());
    this.m_target.addCtrlEntity(line.getBox());
    this.m_controllers.push(line);
  }

  init() {
    this.m_target = new ScaleTarget_1.ScaleTarget();
    this.m_target.container = this.m_bodyContainer;
    let alpha = this.planeAlpha;
    let color4 = CoMaterial.createColor4;
    let outColor = color4();
    const V3 = CoMath.Vector3D;
    let mat4 = CoMath.createMat4();
    outColor.setRGB3Bytes(240, 55, 80);
    mat4.identity();
    this.createDragLine(V3.X_AXIS, outColor, mat4);
    outColor.setRGB3Bytes(135, 205, 55);
    mat4.identity();
    this.createDragLine(V3.Y_AXIS, outColor, mat4);
    outColor.setRGB3Bytes(80, 145, 240);
    mat4.identity();
    this.createDragLine(V3.Z_AXIS, outColor, mat4); // return;
    // xoz

    outColor.setRGB3Bytes(240, 55, 80);
    this.createDragPlane(0, alpha, outColor); // return;
    // xoy

    outColor.setRGB3Bytes(135, 205, 55);
    this.createDragPlane(1, alpha, outColor); // yoz

    outColor.setRGB3Bytes(80, 145, 240);
    this.createDragPlane(2, alpha, outColor); // return;

    let crossPlane = new DragScaleRayCrossPlane_1.default();
    crossPlane.moveSelfEnabled = false;
    crossPlane.initialize(this.m_editRS, this.m_container, this.circleSize);
    crossPlane.setTarget(this.m_target);
    this.m_target.addCtrlEntity(crossPlane);
    this.m_controllers.push(crossPlane);
    let n = Math.floor(this.camZCircleRadius / 2.0);
    let camZCtrl = new ScaleCamZCircle_1.ScaleCamZCircle();
    camZCtrl.pickTestRadius = this.pickTestAxisRadius;
    camZCtrl.initialize(this.m_editRS, this.m_container, this.camZCircleRadius, n);
    camZCtrl.setTarget(this.m_target);
    this.m_target.addCtrlEntity(camZCtrl);
    this.m_controllers.push(camZCtrl);
  }

}

exports.DragScaleController = DragScaleController;

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

/***/ "832f":
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

class SphereRayTester {
  constructor(radius, center = null) {
    this.isHit = false;

    if (center == null) {
      center = CoMath.createVec3();
    }

    this.m_radius = radius;
    this.m_center = center;
  }

  setPrevTester(tester) {}

  testRay(rlpv, rltv, outV, boundsHit) {
    this.isHit = CoAGeom.RayLine.IntersectSphereNearPos(rlpv, rltv, this.m_center, this.m_radius, outV);
    return this.isHit ? 1 : 0;
  }

  destroy() {
    this.m_center = null;
  }

}

exports.SphereRayTester = SphereRayTester;

/***/ }),

/***/ "8441":
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

const SphereRayTester_1 = __webpack_require__("832f");

const DashedLineRayTester_1 = __webpack_require__("b633");

const ScaleCtr_1 = __webpack_require__("abf9");
/**
 * 在直线上拖动缩放
 */


class ScaleDragLine extends ScaleCtr_1.ScaleCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_box = null;
    this.innerSphereRadius = 30.0;
    this.type = 0;
    this.tv = CoMath.createVec3(1.0, 0.0, 0.0);
    this.coneTransMat4 = CoMath.createMat4();
    this.boxScale = 1.0;
    this.m_line_pv = CoMath.createVec3();
    this.m_initPos = CoMath.createVec3();
    this.m_dv = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_initV = CoMath.createVec3();
    this.m_mat4 = CoMath.createMat4();
    this.m_invMat4 = CoMath.createMat4();
    this.m_rpv = CoMath.createVec3();
    this.m_rtv = CoMath.createVec3();
    this.m_sv = CoMath.createVec3();
  }

  initialize(container, size = 100.0, innerSize = 0) {
    this.m_container = container;

    if (this.m_entity == null) {
      let r = this.pickTestRadius;
      CoMesh.line.dynColorEnabled = true;
      let material = CoMaterial.createLineMaterial(true);
      CoMesh.line.setBufSortFormat(material.getBufSortFormat());
      let minV = this.tv.clone().scaleBy(innerSize);
      let maxV = this.tv.clone().scaleBy(size);
      let mesh = CoMesh.line.createLine(minV, maxV, r);
      this.m_entity = CoEntity.createDisplayEntity();
      this.m_entity.setMaterial(material);
      this.m_entity.setMesh(mesh);

      if (mesh != null) {
        let lineTester = new DashedLineRayTester_1.DashedLineRayTester(mesh.getVS(), 1, r);
        lineTester.setPrevTester(new SphereRayTester_1.SphereRayTester(this.innerSphereRadius));
        mesh.setRayTester(lineTester);
      }

      this.applyEvent(this.m_entity);
      material = CoMaterial.createDefaultMaterial();
      material.initializeByCodeBuf(false);
      CoMesh.box.setBufSortFormat(material.getBufSortFormat());
      CoMesh.box.transMatrix = this.coneTransMat4;
      mesh = CoMesh.box.createCube(this.boxScale * r * 2.0);
      this.m_box = CoEntity.createDisplayEntity();
      this.m_box.setMaterial(material);
      this.m_box.setMesh(mesh);
      this.m_container.addChild(this.m_entity);
      this.m_container.addChild(this.m_box);
      this.applyEvent(this.m_box);
    }
  }

  getBox() {
    return this.m_box;
  }

  getEntity() {
    return this.m_entity;
  }

  setVisible(visible) {
    this.m_entity.setVisible(visible);
    this.m_box.setVisible(visible);
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  showOverColor() {
    this.setEntityColor(this.m_entity, this.overColor);
    this.setEntityColor(this.m_box, this.overColor);
  }

  showOutColor() {
    this.setEntityColor(this.m_entity, this.outColor);
    this.setEntityColor(this.m_box, this.outColor);
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
    this.m_box.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
    this.m_box.mouseEnabled = false;
  }

  destroy() {
    super.destroy();

    if (this.m_entity) {
      this.m_container.removeChild(this.m_entity);
      this.m_entity.destroy();
      this.m_entity = null;
    }

    if (this.m_box) {
      this.m_container.removeChild(this.m_box);
      this.m_box.destroy();
      this.m_box = null;
    }

    this.m_container = null;
  }

  calcClosePos(rpv, rtv) {
    if (this.isSelected()) {
      let mat4 = this.m_invMat4;
      mat4.transformVector3Self(rpv);
      mat4.deltaTransformVectorSelf(rtv);
      let outV = this.m_outV;
      CoAGeom.Line.CalcTwoSLCloseV2(rpv, rtv, this.m_line_pv, this.tv, outV);
      mat4 = this.m_mat4;
      mat4.transformVector3Self(outV);
      let container = this.m_target.container;
      container.globalToLocal(outV);
    }
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        this.m_rpv.copyFrom(rpv);
        this.m_rtv.copyFrom(rtv);
        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.m_dv.copyFrom(this.m_outV);
        this.m_dv.subtractBy(this.m_initV); // console.log("this.m_dv: ", this.m_dv);

        const dv = this.m_dv;
        const sv = this.m_sv;
        let scale = 1.0;
        let sx = 1.0;
        let sy = 1.0;
        let sz = 1.0;
        let tv = this.tv;
        let dis = 100.0;

        if (tv.x > 0.1) {
          dis += dv.x;
          if (dis < 1) dis = 1.0;
          scale = dis / 100.0;
          sx = scale;
        } else if (tv.y > 0.1) {
          dis += dv.y;
          if (dis < 1) dis = 1.0;
          scale = dis / 100.0;
          sy = scale;
        } else if (tv.z > 0.1) {
          dis += dv.z;
          if (dis < 1) dis = 1.0;
          scale = dis / 100.0;
          sz = scale;
        } // console.log("scale: ",scale, sv);


        if (this.m_target != null) {
          this.m_target.setScaleXYZ(sv.x * sx, sv.y * sy, sv.z * sz);
          this.m_target.update();
        }
      }
    }
  }

  mouseDownListener(evt) {
    // console.log("ScaleDragLine::mouseDownListener() ...");
    if (this.isEnabled()) {
      this.editBegin();
      this.setThisVisible(true);
      this.m_target.select(); // this.m_flag = 1;
      //console.log("AxisCtrlObj::mouseDownListener(). this.m_flag: "+this.m_flag);

      let trans = this.m_entity.getTransform();
      this.m_mat4.copyFrom(trans.getMatrix());
      this.m_invMat4.copyFrom(trans.getInvMatrix());
      this.m_rpv.copyFrom(evt.raypv);
      this.m_rtv.copyFrom(evt.raytv);
      this.calcClosePos(this.m_rpv, this.m_rtv);
      this.m_initV.copyFrom(this.m_outV);
      this.m_target.getPosition(this.m_initPos);
      this.m_target.getScaleXYZ(this.m_sv);
    }
  }

}

exports.ScaleDragLine = ScaleDragLine;

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

/***/ "91df":
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

const CircleRayTester_1 = __webpack_require__("3477");

const ScaleCtr_1 = __webpack_require__("abf9");
/**
 * 在camera view z axis 上 拖动旋转
 */


class ScaleCamZCircle extends ScaleCtr_1.ScaleCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_cv = CoMath.createVec3();
    this.m_planeNV = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_rotV = CoMath.createVec3();
    this.m_scaleV = CoMath.createVec3();
    this.m_posV = CoMath.createVec3();
    this.m_srcDV = CoMath.createVec3();
    this.m_dstDV = CoMath.createVec3();
    this.m_camPos = CoMath.createVec3();
    this.m_mat0 = CoMath.createMat4();
    this.m_initDegree = 0;
    this.m_planeDis = 0;
    this.m_material = null;
    this.m_camVer = -7;
    this.m_sv = CoMath.createVec3();
    this.m_dis = 0;
  }
  /**
   * init the circle mouse event display entity
   * @param radius circle radius
   * @param segsTotal segments total
   * @param type 0 is xoy, 1 is xoz, 2 is yoz
   * @param color IColor4 instance
   */


  initialize(rs, container, radius, segsTotal) {
    if (this.m_entity == null) {
      this.m_editRS = rs;
      this.m_container = container;
      this.m_entity = CoEntity.createDisplayEntity();
      let ml = CoMesh.line;
      let mesh;
      ml.dynColorEnabled = true;
      let pnv = this.m_planeNV; // yoz

      mesh = ml.createCircleYOZ(radius, segsTotal);
      pnv.setXYZ(1, 0, 0);
      mesh.setRayTester(new CircleRayTester_1.CircleRayTester(radius, this.m_cv, null, pnv, this.m_planeDis, this.pickTestRadius));
      this.m_entity.setMesh(mesh);
      this.m_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
      this.m_material.setColor(this.outColor);
      this.m_entity.setMaterial(this.m_material);
      this.m_entity.update();
      this.applyEvent(this.m_entity);
      container.addEntity(this.m_entity);
    }
  }

  run(camera, rtv, force = false) {
    if (this.m_camVer != camera.version || force) {
      this.m_camVer = camera.version; // 圆面朝向摄像机

      let et = this.m_entity;
      this.m_target.getPosition(this.m_posV);
      this.m_camPos.copyFrom(camera.getPosition());
      let container = this.m_target.container;
      container.globalToLocal(this.m_camPos);
      this.m_srcDV.setXYZ(1, 0, 0);
      this.m_dstDV.subVecsTo(this.m_camPos, this.m_posV);
      let rad = CoMath.Vector3D.RadianBetween(this.m_srcDV, this.m_dstDV);
      let axis = this.m_rotV;
      CoMath.Vector3D.Cross(this.m_srcDV, this.m_dstDV, axis);
      axis.normalize();
      let mat = this.m_mat0;
      mat.identity();
      mat.appendRotation(rad, axis);
      let rv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
      et.setRotation3(rv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));
      et.update();
    }
  }

  setVisible(visible) {
    // console.log("ScaleCamZCircle::setVisible() ..., visible: ", visible);
    this.m_entity.setVisible(visible);
    this.m_camVer = -7;
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
  }

  showOverColor() {
    this.setEntityColor(this.m_entity, this.overColor);
  }

  showOutColor() {
    this.setEntityColor(this.m_entity, this.outColor);
  }

  deselect() {
    console.log("ScaleCamZCircle::deselect() ...");

    if (this.isSelected()) {
      this.editEnd();
      this.setAllVisible(true);
    }
  }

  destroy() {
    super.destroy();

    if (this.m_entity) {
      this.m_container.removeEntity(this.m_entity);
      this.m_entity.destroy();
      this.m_entity = null;
    }

    this.m_container = null;
    this.m_editRS = null;
    this.m_mat0 = null;
    this.m_cv = null;
    this.m_planeNV = null;
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        let dis = this.getDis(rpv, rtv);
        let et = this.m_target;

        if (et != null && dis > 0.001) {
          let s = dis / this.m_dis;
          const sv = this.m_sv; // console.log(s, dis);

          et.setScaleXYZ(sv.x * s, sv.y * s, sv.z * s);
          et.update();
        }
      }
    }
  }

  mouseDownListener(evt) {
    console.log("ScaleCamZCircle::mouseDownListener() ..., evt: ", evt);

    if (this.isEnabled()) {
      this.editBegin();
      this.m_target.select();
      this.setThisVisible(true);
      this.m_target.getScaleXYZ(this.m_sv);
      this.m_dis = this.getDis(evt.raypv, evt.raytv); // console.log("dis: ", this.m_dis);
    }
  }

  getDis(rpv, rtv) {
    let degree = 0.0;

    if (this.isSelected()) {
      let u = CoAGeom.PlaneUtils;
      let pnv = this.m_srcDV.copyFrom(rtv).scaleBy(-1.0);
      let pos = this.m_posV;
      this.m_target.getPosition(pos);
      let hitFlag = u.IntersectRayLinePos2(pnv, pos.dot(pnv), rpv, rtv, this.m_outV);
      let v = this.m_outV;
      this.m_entity.globalToLocal(v);

      if (hitFlag) {
        hitFlag = u.Intersection == CoAGeom.Intersection.Hit;
        let V3 = CoMath.Vector3D;

        if (hitFlag && V3.Distance(v, this.m_cv) > 2.0) {
          v.subtractBy(this.m_cv);
          let et = this.m_target;

          if (et != null) {
            return v.getLength();
          }
        }
      }
    }

    return degree;
  }

}

exports.ScaleCamZCircle = ScaleCamZCircle;

/***/ }),

/***/ "956f":
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

const DragPlane_1 = __importDefault(__webpack_require__("ec63"));

const DragRayCrossPlane_1 = __importDefault(__webpack_require__("5205"));

const MovedTarget_1 = __webpack_require__("1fa8");

const DragLine_1 = __webpack_require__("0148");

const DragTransController_1 = __webpack_require__("35d4");
/**
 * 在三个坐标轴上拖拽移动
 */


class DragMoveController extends DragTransController_1.DragTransController {
  constructor() {
    super();
    this.circleSize = 60.0;
    this.axisSize = 100.0;
    this.planeSize = 30.0;
    this.planeAlpha = 0.6;
    this.pickTestAxisRadius = 20;
  }

  createDragPlane(type, alpha, outColor) {
    let movePlane = new DragPlane_1.default();
    movePlane.moveSelfEnabled = false;
    movePlane.initialize(this.m_editRS, this.m_container, type, this.planeSize);
    outColor.a = alpha;
    movePlane.outColor.copyFrom(outColor);
    outColor.scaleBy(1.5);
    outColor.a = alpha * 1.3;
    movePlane.overColor.copyFrom(outColor);
    movePlane.showOutColor();
    movePlane.setTarget(this.m_target);
    this.m_target.addCtrlEntity(movePlane);
    this.m_controllers.push(movePlane);
    return movePlane;
  }

  createDragLine(tv, outColor, mat4) {
    let trans = tv.clone().scaleBy(this.axisSize);
    mat4.setTranslation(trans);
    let line = new DragLine_1.DragLine();
    line.coneScale = 0.8;
    line.coneTransMat4.copyFrom(mat4);
    line.tv.copyFrom(tv);
    line.innerSphereRadius = this.circleSize * 0.5;
    line.moveSelfEnabled = true;
    line.pickTestRadius = this.pickTestAxisRadius;
    line.initialize(this.axisSize, line.innerSphereRadius);
    line.outColor.copyFrom(outColor);
    outColor.scaleBy(1.5);
    line.overColor.copyFrom(outColor);
    line.showOutColor();
    line.setTarget(this.m_target);
    this.m_container.addChild(line.getEntity());
    this.m_container.addChild(line.getCone());
    this.m_target.addCtrlEntity(line.getEntity());
    this.m_target.addCtrlEntity(line.getCone());
    this.m_controllers.push(line);
  }

  init() {
    this.m_target = new MovedTarget_1.MovedTarget();
    this.m_target.container = this.m_bodyContainer;
    let alpha = this.planeAlpha;
    let color4 = CoMaterial.createColor4;
    let outColor = color4();
    const V3 = CoMath.Vector3D;
    let mat4 = CoMath.createMat4();
    mat4.identity();
    mat4.rotationZ(-0.5 * Math.PI);
    outColor.setRGB3Bytes(240, 55, 80);
    this.createDragLine(V3.X_AXIS, outColor, mat4);
    mat4.identity();
    mat4.rotationX(0.5 * Math.PI);
    mat4.rotationY(0.5 * Math.PI);
    outColor.setRGB3Bytes(135, 205, 55);
    this.createDragLine(V3.Y_AXIS, outColor, mat4);
    mat4.identity();
    mat4.rotationY(0.5 * Math.PI);
    mat4.rotationX(0.5 * Math.PI);
    outColor.setRGB3Bytes(80, 145, 240);
    this.createDragLine(V3.Z_AXIS, outColor, mat4); // xoz

    outColor.setRGB3Bytes(240, 55, 80);
    this.createDragPlane(0, alpha, outColor); // xoy

    outColor.setRGB3Bytes(135, 205, 55);
    this.createDragPlane(1, alpha, outColor); // yoz

    outColor.setRGB3Bytes(80, 145, 240);
    this.createDragPlane(2, alpha, outColor);
    let crossPlane = new DragRayCrossPlane_1.default();
    crossPlane.moveSelfEnabled = false;
    crossPlane.initialize(this.m_editRS, this.m_container, this.circleSize);
    crossPlane.setTarget(this.m_target);
    this.m_target.addCtrlEntity(crossPlane);
    this.m_controllers.push(crossPlane);
  }

}

exports.DragMoveController = DragMoveController;

/***/ }),

/***/ "aae9":
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

const UserEditCtr_1 = __webpack_require__("df9f");
/**
 * 移动编辑控制
 */


class MoveCtr extends UserEditCtr_1.UserEditCtr {
  constructor() {
    super();
    this.m_editRS = null;
    this.m_editRSPI = 0;
    this.outColor = CoMaterial.createColor4(0.9, 0.9, 0.9, 1.0);
    this.overColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0);
    this.pickTestRadius = 10;
    this.m_ctrList = MoveCtr.s_list;
    this.m_ctrList.push(this);
  }

}

MoveCtr.s_list = [];
exports.MoveCtr = MoveCtr;

/***/ }),

/***/ "abf9":
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

const UserEditCtr_1 = __webpack_require__("df9f");
/**
 * 缩放编辑控制
 */


class ScaleCtr extends UserEditCtr_1.UserEditCtr {
  constructor() {
    super();
    this.m_editRS = null;
    this.m_container = null;
    this.outColor = CoMaterial.createColor4(0.9, 0.9, 0.9, 1.0);
    this.overColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0);
    this.pickTestRadius = 10;
    this.m_ctrList = ScaleCtr.s_list;
    this.m_ctrList.push(this);
  }

}

ScaleCtr.s_list = [];
exports.ScaleCtr = ScaleCtr;

/***/ }),

/***/ "b633":
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

class DashedLineRayTester {
  constructor(vs, lsTotal, rayTestRadius) {
    this.m_pv0 = CoMath.createVec3();
    this.m_pv1 = CoMath.createVec3();
    this.m_tester = null;
    this.m_vs = vs;
    this.m_rayTestRadius = rayTestRadius;
    this.m_lsTotal = lsTotal;
  }

  setPrevTester(tester) {
    if (tester != this) {
      this.m_tester = tester;
    }
  }

  testRay(rlpv, rltv, outV, boundsHit) {
    if (this.m_tester != null) {
      if (this.m_tester.testRay(rlpv, rltv, outV, boundsHit) > 0) {
        return 0;
      }
    }

    let j = 0;
    let vs = this.m_vs;
    let flag = false;
    let radius = this.m_rayTestRadius;
    let pv0 = this.m_pv0;
    let pv1 = this.m_pv1;
    const RL = CoAGeom.RayLine;

    for (let i = 0; i < this.m_lsTotal; ++i) {
      pv0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
      pv1.setXYZ(vs[j + 3], vs[j + 4], vs[j + 5]);
      flag = RL.IntersectSegmentLine(rlpv, rltv, pv0, pv1, outV, radius);

      if (flag) {
        return 1;
      }

      j += 6;
    }

    return 0;
  }

  destroy() {
    this.m_vs = null;
  }

}

exports.DashedLineRayTester = DashedLineRayTester;

/***/ }),

/***/ "c16d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DragMoveController_1 = __webpack_require__("956f");

const DragScaleController_1 = __webpack_require__("7281");

const DragRotationController_1 = __webpack_require__("4362");

const VoxRScene_1 = __webpack_require__("d1de");

const VoxMath_1 = __webpack_require__("f042");
/**
 * renderable entity transform 编辑控制器
 */


class TransformController {
  constructor() {
    this.m_rsc = null;
    this.m_enabled = false;
    this.m_controllers = [null, null, null];
    this.m_camVer = -7;
    this.m_ctrVer = -7;
    this.m_scale = 0.015;
    this.m_targets = null;
    this.m_valueFilter = null;
    this.m_movedCtr = null;
    this.m_scaleCtr = null;
    this.m_rotatedCtr = null;
    this.m_bodyContainer = null;
    this.m_type = -1;
    this.m_local = false;
    this.m_global = true;
    /**
     * the type vaule is 0
     */

    this.TRANSLATION = 0;
    /**
     * the type vaule is 1
     */

    this.SCALE = 1;
    /**
     * the type vaule is 2
     */

    this.ROTATION = 2;
  }

  setCtrlValueFilter(filter) {
    this.m_valueFilter = filter;

    if (filter) {
      let ls = this.m_controllers;

      for (let i = 0; i < ls.length; ++i) {
        if (ls[i]) {
          ls[i].getCtrlTarget().valueFilter = filter;
        }
      }
    }
  }

  isLocal() {
    return this.m_local;
  }

  isGlobal() {
    return this.m_global;
  }

  toLocal() {
    this.m_local = true;
    this.m_global = false;
    let container = this.m_bodyContainer;
    container.setRotation3(this.getTargetRotation());
    container.update();
    this.run(true);
  }

  toGlobal() {
    this.m_local = false;
    this.m_global = true;
    let container = this.m_bodyContainer;
    container.setRotation3(VoxMath_1.VoxMath.createVec3());
    container.update();
    this.run(true);
  }

  getContainer() {
    return this.m_bodyContainer;
  }

  setScale(s) {
    this.m_scale = s;
  }

  getScale() {
    return this.m_scale;
  }

  initialize(rsc, processid = 0) {
    if (this.m_rsc == null) {
      let bodyContainer = VoxRScene_1.VoxRScene.createDisplayEntityContainer();
      bodyContainer.uuid = "bodyContainer";
      let move_container = VoxRScene_1.VoxRScene.createDisplayEntityContainer();
      let rotate_container = VoxRScene_1.VoxRScene.createDisplayEntityContainer();
      let scale_container = VoxRScene_1.VoxRScene.createDisplayEntityContainer();
      bodyContainer.addChild(move_container);
      bodyContainer.addChild(rotate_container);
      bodyContainer.addChild(scale_container);
      this.m_bodyContainer = bodyContainer;
      rsc.addContainer(bodyContainer, processid);
      this.m_rsc = rsc;
      this.m_pv = CoMath.createVec3();
      this.m_wpos = CoMath.createVec3();
      let ls = this.m_controllers;
      let ctr0 = this.m_movedCtr = new DragMoveController_1.DragMoveController();
      ctr0.axisSize = 100;
      ctr0.planeSize = 30;
      ctr0.pickTestAxisRadius = 10;
      ctr0.runningVisible = true;
      ctr0.initialize(rsc, move_container, bodyContainer);
      ctr0.getCtrlTarget().type = this.TRANSLATION;
      ctr0.disable();
      ctr0.setVisible(false);
      ls[0] = ctr0;
      let ctr1 = this.m_scaleCtr = new DragScaleController_1.DragScaleController();
      ctr1.axisSize = 100;
      ctr1.planeSize = 30;
      ctr1.pickTestAxisRadius = 10;
      ctr1.initialize(rsc, scale_container, bodyContainer);
      ctr1.getCtrlTarget().type = this.SCALE;
      ctr1.disable();
      ctr1.setVisible(false);
      ls[1] = ctr1;
      let ctr2 = this.m_rotatedCtr = new DragRotationController_1.DragRotationController();
      ctr2.pickTestAxisRadius = 10;
      ctr2.runningVisible = true;
      ctr2.initialize(rsc, rotate_container, bodyContainer);
      ctr2.getCtrlTarget().type = this.ROTATION;
      ctr2.disable();
      ctr2.setVisible(false);
      ls[2] = ctr2;
      this.setCtrlValueFilter(this.m_valueFilter);
      this.toTranslation();
      this.disable();
    }
  }

  getTargetRotation() {
    return this.m_rotatedCtr.getCtrlTarget().rotation;
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    let ls = this.m_controllers;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
  }

  removeEventListener(type, listener, func) {
    let ls = this.m_controllers;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].removeEventListener(type, listener, func);
    }
  }
  /**
   * to translation controller
   */


  toTranslation() {
    this.enable(this.TRANSLATION);
  }
  /**
   * to scale controller
   */


  toScale() {
    this.enable(this.SCALE);
  }
  /**
   * to rotation controller
   */


  toRotation() {
    this.enable(this.ROTATION);
  }
  /**
   * get the current controller type
   * @returns the legal value is 0, 1, or 2, -1 or other value is illegal.
   */


  getCurrType() {
    return this.m_type;
  }
  /**
   * @param type the correct value is 0, 1, or 2, the default value is -1.
   */


  enable(type = -1) {
    let ls = this.m_controllers;
    let t = this.m_type;
    this.m_enabled = true;

    if (type >= 0 && type <= 2) {
      if (t != type) {
        let targets = this.m_targets;

        if (t >= 0) {
          if (targets == null) {
            targets = ls[t].getTargets();
          }

          this.m_bodyContainer.getPosition(this.m_wpos);
          ls[t].decontrol();
          ls[t].disable();
          ls[t].setVisible(false);
        }

        this.m_camVer = -7;
        this.m_type = type; // ls[type].enable();
        // if (targets) {
        // 	this.select(targets, this.m_wpos, false);
        // }
        // if (this.m_local) {
        // 	this.toLocal();
        // } else {
        // 	this.toGlobal();
        // }

        this.applyCtrl(type, targets);
      }
    } else {
      // if (t >= 0) {
      // 	// ls[t].enable();
      // 	// if(this.m_local) {
      // 	// 	this.toLocal();
      // 	// }else {
      // 	// 	this.toGlobal();
      // 	// }
      // }
      this.applyCtrl(t);
    }
  }

  applyCtrl(t, targets = null) {
    if (t >= 0) {
      this.m_controllers[t].enable();

      if (targets) {
        this.select(targets, this.m_wpos, false);
      }

      if (this.m_local) {
        this.toLocal();
      } else {
        this.toGlobal();
      }
    }
  }

  disable(force = false) {
    this.m_enabled = false;
    this.m_targets = null;
    let ls = this.m_controllers;
    let t = this.m_type;

    if (t >= 0) {
      ls[t].decontrol();
      ls[t].disable();
      ls[t].setVisible(false);
    }

    if (force) {
      this.m_type = -1;
    }
  }

  decontrol() {
    if (this.m_rsc != null) {
      if (this.m_enabled && this.m_type >= 0) {
        this.m_controllers[this.m_type].decontrol();
      }
    }
  }

  destroy() {
    if (this.m_rsc != null) {
      this.decontrol();
      this.m_rsc = null;
    }
  }

  select(targets, wpos = null, autoEnabled = true) {
    if (targets) {
      if (this.m_type >= 0) {
        if (wpos == null) {
          let pos = this.m_wpos;
          let pv = CoMath.createVec3();
          pos.setXYZ(0, 0, 0);

          for (let i = 0; i < targets.length; ++i) {
            pos.addBy(targets[i].getPosition(pv));
          }

          pos.scaleBy(1.0 / targets.length);
        } else {
          this.m_wpos.copyFrom(wpos);
        }

        this.m_camVer = -7;
        const ctr = this.m_controllers[this.m_type];

        if (autoEnabled && !ctr.isEnabled()) {
          this.m_enabled = true;
          ctr.enable();
        }

        ctr.deselect();
        ctr.setPosition(this.m_wpos);
        ctr.update();
        ctr.select(targets);
        ctr.setVisible(true);
        this.updateSize(this.m_rsc, ctr);
      } else {
        this.m_targets = targets;
        this.m_wpos.copyFrom(wpos);
      }
    } else {
      console.error("targets == null");
    }
  }

  updateSize(sc, ct, force = false) {
    sc.updateCamera();
    let cam = sc.getCamera();

    if (this.m_camVer != cam.version || this.m_ctrVer != ct.getVersion() || force) {
      const pv = this.m_pv;
      this.m_bodyContainer.getPosition(pv);
      let vm = cam.getViewMatrix();
      vm.transformVector3Self(pv);
      let s = -this.m_scale * pv.z / cam.getZNear();
      ct.setCtrlScaleXYZ(s, s, s);
      ct.updateCtrl();
      this.m_camVer = cam.version;
      this.m_ctrVer = ct.getVersion();
    }
  }

  run(force = false) {
    let sc = this.m_rsc;

    if (sc) {
      if (this.m_enabled && this.m_type >= 0) {
        let ct = this.m_controllers[this.m_type];
        this.updateSize(sc, ct, force);
        ct.run(force);
      }
    }
  }

}

exports.TransformController = TransformController;

/***/ }),

/***/ "cdd5":
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

const CircleRayTester_1 = __webpack_require__("3477");

const RotationCtr_1 = __webpack_require__("2b49");

const RotationRing_1 = __webpack_require__("e50b");
/**
 * 在三个坐标轴上旋转
 */


class RotationCircle extends RotationCtr_1.RotationCtr {
  constructor() {
    super();
    this.m_cv = CoMath.createVec3();
    this.m_planeNV = CoMath.createVec3();
    this.m_initNV = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_preRotV = CoMath.createVec3();
    this.m_rotV = CoMath.createVec3();
    this.m_camPos = CoMath.createVec3();
    this.m_initDegree = 0;
    this.m_planeDis = 0;
    this.m_type = 0;
    this.m_material = null;
    this.m_ring = null;
    this.m_entity = null;
    this.m_circle = null;
    this.m_editRS = null;
  }
  /**
   * init the circle mouse event display entity
   * @param radius circle radius
   * @param segsTotal segments total
   * @param type 0 is xoy, 1 is xoz, 2 is yoz
   * @param color IColor4 instance
   */


  initialize(rs, container, radius, segsTotal, type) {
    if (this.m_entity == null) {
      this.m_editRS = rs;
      this.m_container = container;
      this.m_ring = new RotationRing_1.RotationRing();
      this.m_entity = CoEntity.createDisplayEntity();
      this.m_circle = CoEntity.createDisplayEntity();
      let ml = CoMesh.line;
      let mesh;
      let mesh2;
      ml.dynColorEnabled = true;
      this.m_type = type;
      let direcV = CoMath.createVec3();
      let pnv = this.m_planeNV;

      switch (type) {
        case 1:
          // xoz
          mesh = ml.createCircleXOZ(radius, Math.round(segsTotal * 0.5), null, 0, Math.PI);
          mesh2 = ml.createCircleXOZ(radius, segsTotal);
          pnv.setXYZ(0, 1, 0);
          direcV.setXYZ(0, 0, 1);
          break;

        case 2:
          // yoz
          mesh = ml.createCircleYOZ(radius, Math.round(segsTotal * 0.5), null, 0, Math.PI);
          mesh2 = ml.createCircleYOZ(radius, segsTotal);
          pnv.setXYZ(1, 0, 0);
          direcV.setXYZ(0, 0, 1);
          break;

        default:
          // xoy
          mesh = ml.createCircleXOY(radius, Math.round(segsTotal * 0.5), null, 0, Math.PI);
          mesh2 = ml.createCircleXOY(radius, segsTotal);
          pnv.setXYZ(0, 0, 1);
          direcV.setXYZ(0, 1, 0);
          type = 0;
          break;
      }

      this.m_initNV.copyFrom(pnv);
      mesh.setRayTester(new CircleRayTester_1.CircleRayTester(radius, this.m_cv, direcV, pnv, this.m_planeDis, this.pickTestRadius));
      this.m_entity.setMesh(mesh);
      this.m_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
      this.m_material.setColor(this.outColor);
      this.m_entity.setMaterial(this.m_material);
      this.m_entity.update();
      this.m_circle.setMesh(mesh2);
      this.m_circle.setMaterial(this.m_material);
      this.m_circle.update();
      this.m_circle.setVisible(false);
      this.applyEvent(this.m_entity);
      container.addEntity(this.m_entity);
      container.addEntity(this.m_circle);
      this.m_ring.initialize(rs, container, radius, 120, type);
      this.m_ring.setVisible(false);
    }
  }

  run(camera, rtv, force) {
    let pv = this.m_outV;
    let camPV = this.m_camPos.copyFrom(camera.getPosition());
    let container = this.m_target.container;
    container.globalToLocal(this.m_camPos);
    this.m_planeNV.copyFrom(this.m_initNV); // this.m_target.container.getMatrix().deltaTransformVectorSelf(this.m_planeNV);

    pv.copyFrom(this.m_camPos);
    let dis = pv.dot(this.m_planeNV);
    pv.copyFrom(this.m_planeNV);
    pv.scaleBy(-dis);
    pv.addBy(camPV);
    let mc = CoMath.MathConst;
    const entity = this.m_entity;
    let ang = 0;

    switch (this.m_type) {
      case 0:
        // xoy
        ang = -mc.GetDegreeByXY(pv.x, pv.y);
        entity.setRotationXYZ(0, 0, 270 - ang);
        entity.update();
        break;

      case 1:
        // xoz
        ang = -mc.GetDegreeByXY(pv.x, pv.z);
        entity.setRotationXYZ(0, 90 + ang, 0);
        entity.update();
        break;

      case 2:
        // yoz
        ang = -mc.GetDegreeByXY(pv.z, pv.y);
        entity.setRotationXYZ(ang, 0, 0);
        entity.update();
        break;

      default:
        break;
    }
  }

  setVisible(visible) {
    this.m_entity.setVisible(visible);
    if (!visible) this.m_ring.setVisible(visible);
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
  }

  showOverColor() {
    this.m_entity.getMaterial().setColor(this.overColor);
  }

  showOutColor() {
    this.m_entity.getMaterial().setColor(this.outColor);
    this.m_ring.setColor(this.outColor);
  }

  deselect() {
    console.log("RotationCircle::deselect() ...");

    if (this.isSelected()) {
      super.deselect();

      if (this.m_circle.getVisible()) {
        this.m_entity.setVisible(true);
        this.m_circle.setVisible(false);
      }

      this.m_ring.setVisible(false);
    }
  }

  destroy() {
    super.destroy();

    if (this.m_entity) {
      this.m_container.removeEntity(this.m_entity);
      this.m_entity.destroy();
      this.m_entity = null;
    }

    if (this.m_circle) {
      this.m_container.removeEntity(this.m_circle);
      this.m_circle.destroy();
      this.m_circle = null;
    }

    if (this.m_ring) {
      this.m_ring.destroy();
      this.m_ring = null;
    }

    this.m_container = null;
    this.m_editRS = null;
    this.m_cv = null;
    this.m_planeNV = null;
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        let degree = this.getDegree(rpv, rtv);
        degree -= this.m_initDegree;
        this.m_ring.setProgress(degree / 360.0);
        let et = this.m_target;

        if (et) {
          let rv = this.m_rotV;
          let prv = this.m_preRotV;
          et.getRotationXYZ(rv);

          switch (this.m_type) {
            case 1:
              // XOZ, Y-Axis
              rv.y = prv.y + degree;
              break;

            case 2:
              // YOZ, X-Axis
              rv.x = prv.x + degree;
              break;

            default:
              // XOY, Z-Axis
              rv.z = prv.z + degree;
              break;
          }

          et.setRotation3(rv);
          et.update();
        }
      }
    }
  }

  mouseDownListener(evt) {
    console.log("RotationCircle::mouseDownListener() ..., evt: ", evt);

    if (this.isEnabled()) {
      this.editBegin();
      this.m_target.select();
      this.m_entity.setVisible(false);
      this.m_circle.setVisible(true);
      this.setThisVisible(true);
      this.m_initDegree = this.getDegree(evt.raypv, evt.raytv);
      console.log("this.m_initDegree: ", this.m_initDegree);
      this.m_ring.setVisible(true);
      this.m_ring.setRingRotation(this.m_initDegree);
      this.m_ring.setProgress(0.0);
      this.m_preRotV.setXYZ(0, 0, 0);

      if (this.m_target) {
        this.m_target.getRotationXYZ(this.m_preRotV);
      }
    }
  }

  getDegree(rpv, rtv) {
    let degree = 0;

    if (this.isSelected()) {
      this.m_planeNV.copyFrom(this.m_initNV);
      this.m_target.container.getMatrix().deltaTransformVectorSelf(this.m_planeNV);
      let u = CoAGeom.PlaneUtils;
      this.m_target.getPosition(this.m_outV);
      let pids = this.m_planeNV.dot(this.m_outV);
      let hitFlag = u.IntersectRayLinePos2(this.m_planeNV, pids, rpv, rtv, this.m_outV); // for test
      // if(this.m_axisEntity == null) {
      //     this.m_axisEntity = CoEntity.createCrossAxis3DEntity(20);
      //     this.m_editRS.addEntity(this.m_axisEntity, 1);
      // }
      // this.m_axisEntity.setPosition(this.m_outV);
      // this.m_axisEntity.update();

      let v = this.m_outV;
      this.m_circle.globalToLocal(v);

      if (hitFlag) {
        hitFlag = u.Intersection == CoAGeom.Intersection.Hit;
        let V3 = CoMath.Vector3D;

        if (hitFlag && V3.Distance(v, this.m_cv) > 2.0) {
          v.subtractBy(this.m_cv);
          let et = this.m_target;

          if (et != null) {
            switch (this.m_type) {
              case 1:
                // XOZ, Y-Axis
                degree = CoMath.MathConst.GetDegreeByXY(v.x, v.z);
                degree = -degree; //rv.y = pv.y - degree;

                break;

              case 2:
                // YOZ, X-Axis
                degree = CoMath.MathConst.GetDegreeByXY(v.y, v.z); //rv.x = pv.x + degree;

                break;

              default:
                // XOY, Z-Axis
                degree = CoMath.MathConst.GetDegreeByXY(v.x, v.y); //rv.z = pv.z + degree;

                break;
            }

            if (degree > 360) degree -= 360.0;else if (degree < 0) degree += 360.0; // console.log("RotationCircle::getDegree() ..., degree: ", degree);
          }
        }
      }
    }

    return degree;
  }

}

exports.RotationCircle = RotationCircle;

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

/***/ "d51f":
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

const SphereRayTester_1 = __webpack_require__("832f");

const ScaleCtr_1 = __webpack_require__("abf9");
/**
 * 支持在一个和鼠标射线垂直的平面上拖动
 */


class DragScaleRayCrossPlane extends ScaleCtr_1.ScaleCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_rscene = null;
    this.m_billPos = null;
    this.m_circle = null;
    this.m_planeNV = CoMath.createVec3(0.0, 1.0, 0.0);
    this.m_planePos = CoMath.createVec3();
    this.m_planeDis = 0.0;
    this.m_pos = CoMath.createVec3();
    this.m_dv = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_rpv = CoMath.createVec3();
    this.m_rtv = CoMath.createVec3();
    this.m_sv = CoMath.createVec3();
    this.m_dis = 1.0;
  }

  initialize(rscene, container, size = 30) {
    if (this.m_entity == null) {
      this.transFlag = 1;
      this.m_rscene = rscene;
      this.m_container = container;
      let bounds = CoEntity.createBoundsEntity();
      let radius = size * 0.5;
      let minV = CoMath.createVec3(radius, radius, radius).scaleBy(-1.0);
      let maxV = CoMath.createVec3(radius, radius, radius);
      bounds.setBounds(minV, maxV);
      bounds.setRayTester(new SphereRayTester_1.SphereRayTester(radius));
      this.applyEvent(bounds); // this.m_rscene.addEntity(bounds, processidIndex);

      container.addChild(bounds);
      this.m_entity = bounds;
      let par = CoParticle.createBillboard();
      par.initializeSquare(radius * 0.2, [this.createTexByUrl("static/assets/circle01.png")]); // this.m_rscene.addEntity(par.entity, processidIndex + 1);

      container.addEntity(par.entity);
      let RST = CoRScene.RendererState;
      par.entity.setRenderState(RST.NONE_TRANSPARENT_ALWAYS_STATE);
      this.m_billPos = par;
      let segsTotal = Math.floor(radius * 0.5);
      let bl = CoParticle.createBillboardLine();
      bl.initializeCircleXOY(radius, segsTotal < 50 ? 50 : segsTotal); // this.m_rscene.addEntity(bl.entity, processidIndex + 1);

      container.addEntity(bl.entity);
      bl.entity.setRenderState(RST.NONE_TRANSPARENT_ALWAYS_STATE);
      this.m_circle = bl;
      this.showOutColor();
    }
  }

  createTexByUrl(url = "") {
    let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);
    let img = new Image();

    img.onload = evt => {
      tex.setDataFromImage(img, 0, 0, 0, false);
    };

    img.src = url != "" ? url : "static/assets/box.jpg";
    return tex;
  }

  getEntity() {
    return this.m_entity;
  }

  showOverColor() {
    let c = this.overColor;
    this.m_circle.setRGB3f(c.r, c.g, c.b);
  }

  showOutColor() {
    let c = this.outColor;
    this.m_circle.setRGB3f(c.r, c.g, c.b);
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
  }

  setRenderState(state) {
    this.m_entity.setRenderState(state);
  }

  setVisible(visible) {
    this.m_entity.setVisible(visible);
    this.m_circle.entity.setVisible(visible);
    this.m_billPos.entity.setVisible(visible);
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  setScaleXYZ(sx, sy, sz) {
    this.m_entity.setScaleXYZ(sx, sy, sz);
    this.m_circle.setScaleXY(sx, sy);
    this.m_billPos.setScaleXY(sx, sy);
    this.m_entity.update();
    this.m_circle.update();
    this.m_billPos.update();
    return this;
  }

  destroy() {
    super.destroy(); // this.m_target = null;

    if (this.m_entity) {
      this.m_container.removeEntity(this.m_entity);
      this.m_entity.destroy();
    }

    if (this.m_circle) {
      this.m_container.removeEntity(this.m_circle.entity);
      this.m_circle.destroy();
    }

    if (this.m_billPos) {
      this.m_container.removeEntity(this.m_billPos.entity);
      this.m_billPos.destroy();
    }

    this.m_entity = null;
    this.m_circle = null;
    this.m_billPos = null;
    this.m_container = null;
    this.m_rscene = null;
  }

  calcClosePos(rpv, rtv) {
    CoAGeom.PlaneUtils.IntersectLinePos2(this.m_planeNV, this.m_planeDis, rpv, rtv, this.m_outV);
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        this.m_rpv.copyFrom(rpv);
        this.m_rtv.copyFrom(rtv);
        this.calcClosePos(this.m_rpv, this.m_rtv);
        let V3 = CoMath.Vector3D;
        let dis = V3.Distance(this.m_pos, this.m_outV);
        if (dis < 1.0) dis = 1.0;
        const sv = this.m_sv;
        let s = dis / this.m_dis;

        if (this.m_target) {
          this.m_target.setScaleXYZ(sv.x * s, sv.y * s, sv.z * s);
          this.m_target.update();
        }
      }
    }
  }
  /**
   * set plane world onrmal vactor3
   * @param nv
   */


  setPlaneNormal(nv) {
    this.m_planeNV.copyFrom(nv);
    this.m_planeNV.normalize();
  }

  selectByParam(raypv, raytv, wpos) {
    this.m_rpv.copyFrom(raypv);
    this.m_rtv.copyFrom(raytv);
    this.m_planePos.copyFrom(wpos);
    this.m_planeNV.copyFrom(this.m_rtv);
    this.m_planeNV.normalize();
    this.m_planeDis = this.m_planePos.dot(this.m_planeNV);
    this.calcClosePos(this.m_rpv, this.m_rtv);
    this.m_target.getPosition(this.m_dv);
    this.m_dv.subtractBy(this.m_outV);
  }

  mouseDownListener(evt) {
    if (this.isEnabled()) {
      console.log("DragScaleRayCrossPlane::mouseDownListener() ...");
      this.editBegin();
      this.setThisVisible(true);
      this.m_target.select();
      this.selectByParam(evt.raypv, evt.raytv, evt.wpos);
      this.m_target.getScaleXYZ(this.m_sv);
      this.m_target.getPosition(this.m_pos);
      let V3 = CoMath.Vector3D;
      this.m_dis = V3.Distance(this.m_pos, this.m_outV);
      if (this.m_dis < 1.0) this.m_dis = 1.0;
    }
  }

}

exports.default = DragScaleRayCrossPlane;

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

/***/ "df9f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const UserEditEvent_1 = __webpack_require__("7d28");

class UserEditCtr {
  constructor() {
    this.m_enabled = false;
    this.m_flag = -1;
    this.m_dispatcher = null;
    this.m_target = null;
    this.m_ctrList = null;
    this.editType = "";
    this.runningVisible = true;
    this.uuid = "editCtrl";
    this.moveSelfEnabled = true;
    this.transFlag = 0;
    let m = new Map();
    const UE = UserEditEvent_1.UserEditEvent;
    let node = CoRScene.createEvtNode();
    node.type = UE.EDIT_BEGIN;
    m.set(node.type, node);
    node = CoRScene.createEvtNode();
    node.type = UE.EDIT_END;
    m.set(node.type, node);
    this.m_evtMap = m;
  }

  editBegin() {
    console.log("UserEditCtr::editBegin()");
    this.m_flag = 1;
    let node = this.m_evtMap.get(UserEditEvent_1.UserEditEvent.EDIT_BEGIN);
    let evt = node.createEvent(this, this);
    node.dispatch(evt);
    evt.target = null;
    evt.currentTarget = null;
  }

  editEnd() {
    console.log("UserEditCtr::editEnd()");
    this.m_flag = -1;
    let node = this.m_evtMap.get(UserEditEvent_1.UserEditEvent.EDIT_END);
    let evt = node.createEvent(this, this);
    node.dispatch(evt);
    evt.target = null;
    evt.currentTarget = null;
  }

  enable() {
    this.m_enabled = true;
  }

  disable() {
    this.m_enabled = false;
  }

  isEnabled() {
    return this.m_enabled;
  }

  isSelected() {
    return this.m_flag > -1;
  }

  select() {}

  deselect() {
    if (this.isSelected()) {
      this.editEnd();
      this.setAllVisible(true);
    }
  }

  setVisible(visible) {
    return this;
  }

  getVisible() {
    return false;
  }

  getGlobalBounds() {
    return null;
  }

  getLocalBounds() {
    return null;
  }

  addEventListener(type, listener, func, captureEnabled = true, bubbleEnabled = false) {
    if (this.m_evtMap.has(type)) {
      let node = this.m_evtMap.get(type);
      node.addListener(listener, func);
    } else {
      this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
  }

  removeEventListener(type, listener, func) {
    if (this.m_evtMap.has(type)) {
      let node = this.m_evtMap.get(type);
      node.removeListener(listener, func);
    } else {
      this.m_dispatcher.removeEventListener(type, listener, func);
    }
  }

  setTarget(target) {
    this.m_target = target;
  }

  getTargetEntities() {
    if (this.m_target) {
      return this.m_target.getTargets();
    }
  }

  applyEvent(entity) {
    if (this.m_dispatcher == null) {
      const me = CoRScene.MouseEvent;
      let dispatcher = CoRScene.createMouseEvt3DDispatcher();
      dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
      dispatcher.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
      dispatcher.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
      this.m_dispatcher = dispatcher;
    }

    entity.setEvtDispatcher(this.m_dispatcher);
    entity.mouseEnabled = true;
  }

  mouseOverListener(evt) {
    // console.log("DragLine::mouseOverListener() ...");
    this.showOverColor();
  }

  mouseOutListener(evt) {
    // console.log("DragLine::mouseOutListener() ...");
    this.showOutColor();
  }

  mouseDownListener(evt) {}

  setMaterialColor(m, c, brn = 1.0) {
    m.setRGBA4f(c.r * brn, c.g * brn, c.b * brn, c.a);
  }

  setEntityColor(et, c, brn = 1.0) {
    et.getMaterial().setRGBA4f(c.r * brn, c.g * brn, c.b * brn, c.a);
  }

  showOverColor() {}

  showOutColor() {}

  run(camera, rtv, force) {}

  destroy() {
    this.m_target = null;
    this.m_ctrList = null;

    if (this.m_dispatcher != null) {
      for (var [k, v] of this.m_evtMap.entries()) {
        v.destroy();
      }

      this.m_dispatcher.destroy();
      this.m_dispatcher = null;
    }
  }
  /**
   * 设置所有旋转控制器对象可见性
   * @param v true 表示可见, false表示隐藏
   */


  setAllVisible(v) {
    let ls = this.m_ctrList;

    for (let i = 0; i < ls.length; ++i) {
      ls[i].setVisible(v);
    }
  }
  /**
   * 仅仅隐藏自身， 或者仅仅显示自身
   * @param v v true 表示仅自身可见其他不可见, false表示仅自身隐藏其他可见
   */


  setThisVisible(v) {
    let ls = this.m_ctrList;

    if (v) {
      for (let i = 0; i < ls.length; ++i) {
        ls[i].setVisible(ls[i] == this);
      }
    } else {
      for (let i = 0; i < ls.length; ++i) {
        ls[i].setVisible(ls[i] != this);
      }
    }
  }

  setXYZ(px, py, pz) {
    throw Error("illegal operations !!!");
    return null;
  }

  setPosition(pv) {
    throw Error("illegal operations !!!");
    return null;
  }

  getScaleXYZ(pv) {
    throw Error("illegal operations !!!");
    return pv;
  }

  setRotation3(r) {
    throw Error("illegal operations !!!");
    return null;
  }

  setRotationXYZ(rx, ry, rz) {
    throw Error("illegal operations !!!");
    return null;
  }

  getRotationXYZ(pv) {
    throw Error("illegal operations !!!");
    return null;
  }

  getPosition(pv) {
    throw Error("illegal operations !!!");
    return pv;
  }

  setScaleXYZ(sx, sy, sz) {
    throw Error("illegal operations !!!");
    return null;
  }

  localToGlobal(pv) {
    throw Error("illegal operations !!!");
  }

  globalToLocal(pv) {
    throw Error("illegal operations !!!");
  }

  update() {
    throw Error("illegal operations !!!");
  }

}

exports.UserEditCtr = UserEditCtr;

/***/ }),

/***/ "e50b":
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

class RotationRing {
  constructor() {
    this.m_container = null;
    this.m_ring = null;
    this.m_material = null;
    this.m_type = 0;
    this.m_total = 0;
    this.m_parentContainer = null;
  }
  /**
   * init the circle mouse event display entity
   * @param radius circle radius
   * @param segsTotal segments total
   * @param type 0 is xoy, 1 is xoz, 2 is yoz
   * @param color IColor4 instance
   */


  initialize(rs, container, radius, segsTotal, type) {
    if (this.m_container == null) {
      this.m_parentContainer = container;
      let ring = CoEntity.createDisplayEntity();
      this.m_container = CoEntity.createDisplayEntityContainer();
      let ml = CoMesh.line;
      let mesh;
      ml.dynColorEnabled = true;
      this.m_type = type;
      let rad = 0;
      let posList = null;
      let j = 0;
      const s = 0.95;
      let range = Math.PI * 2;
      posList = new Array(segsTotal * 2);
      this.m_total = segsTotal;

      switch (type) {
        case 1:
          // xoz
          for (let i = segsTotal - 1; i >= 0; --i) {
            rad = range * i / segsTotal;
            const x = radius * Math.cos(rad);
            const z = radius * Math.sin(rad);
            posList[j++] = CoMath.createVec3(x, 0, z);
            posList[j++] = CoMath.createVec3(x * s, 0, z * s);
          }

          break;

        case 2:
          // yoz
          for (let i = 0; i < segsTotal; ++i) {
            rad = range * i / segsTotal;
            const x = radius * Math.cos(rad);
            const y = radius * Math.sin(rad);
            posList[j++] = CoMath.createVec3(0, x, y);
            posList[j++] = CoMath.createVec3(0, x * s, y * s);
          }

          break;

        default:
          // xoy
          for (let i = 0; i < segsTotal; ++i) {
            rad = range * i / segsTotal;
            const x = radius * Math.cos(rad);
            const y = radius * Math.sin(rad);
            posList[j++] = CoMath.createVec3(x, y, 0);
            posList[j++] = CoMath.createVec3(x * s, y * s, 0);
          }

          break;
      }

      mesh = ml.createLines(posList);
      ring.setMesh(mesh);
      this.m_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
      this.m_material.vtxInfo = CoRScene.createVtxDrawingInfo();
      ring.setMaterial(this.m_material);
      ring.update();
      this.m_ring = ring;
      this.m_container.addEntity(ring);
      this.m_parentContainer.addChild(this.m_container);
    }
  }

  getContainer() {
    return this.m_container;
  }

  setProgress(p) {
    // console.log("setProgress(), p: ", p);
    if (this.m_ring != null) {
      if (p < 0.0) {
        p += Math.round(p) * 2.0;
      }

      p -= Math.floor(p);
      let tot = this.m_total * 2;
      let n = Math.round(tot * p) + 2;

      if (n > tot) {
        n = tot;
      } // console.log("setProgress(), n: ", n);
      // this.m_ring.setIvsParam(0, n);


      this.m_ring.getMaterial().vtxInfo.setIvsParam(0, n);
    }
  }

  setRingRotation(degree) {
    if (this.m_ring != null) {
      switch (this.m_type) {
        case 1:
          this.m_ring.setRotationXYZ(0, degree, 0);
          break;

        case 2:
          this.m_ring.setRotationXYZ(degree, 0, 0);
          break;

        default:
          this.m_ring.setRotationXYZ(0, 0, degree);
          break;
      }

      this.m_ring.update();
    }
  } // setDirection(rv: Vector3D): void {
  // }


  setVisible(visible) {
    // console.log("RotationRing::setVisible() ..., visible: ", visible);
    this.m_container.setVisible(visible);
  }

  getVisible() {
    return this.m_container.getVisible();
  }

  setRotation3(r) {
    this.m_container.setRotation3(r);
  }

  setScale3(s) {
    this.m_container.setScale3(s);
  }

  setColor(color) {
    this.m_ring.getMaterial().setColor(color);
  }

  setPosition(pos) {
    this.m_container.setPosition(pos);
  }

  destroy() {
    if (this.m_container) {
      this.m_parentContainer.removeChild(this.m_container);
      this.m_container.destroy();
      this.m_container = null;
    }

    this.m_parentContainer = null;
  }

}

exports.RotationRing = RotationRing;

/***/ }),

/***/ "eaa4":
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

const RotationCtr_1 = __webpack_require__("2b49");

const SphereRayTester_1 = __webpack_require__("832f");
/**
 * 在camera view x/y axis 上 拖动旋转
 */


class RotationCamXYCircle extends RotationCtr_1.RotationCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_rotV = CoMath.createVec3();
    this.m_scaleV = CoMath.createVec3();
    this.m_posV = CoMath.createVec3();
    this.m_srcDV = CoMath.createVec3();
    this.m_dstDV = CoMath.createVec3();
    this.m_camPos = CoMath.createVec3();
    this.m_mat0 = CoMath.createMat4();
    this.m_stage = null;
    this.m_stagePos = CoMath.createVec3();
    this.m_circle = null;
    this.m_editRS = null;
    this.m_camVer = -7;
  }
  /**
   * init the circle mouse event display entity
   * @param radius circle radius
   * @param segsTotal segments total
   * @param type 0 is xoy, 1 is xoz, 2 is yoz
   * @param color IColor4 instance
   */


  initialize(rs, container, radius) {
    if (this.m_entity == null) {
      this.m_editRS = rs;
      this.m_container = container;
      this.m_stage = rs.getStage3D();
      let bounds = CoEntity.createBoundsEntity();
      let minV = CoMath.createVec3(radius, radius, radius).scaleBy(-1.0);
      let maxV = CoMath.createVec3(radius, radius, radius);
      bounds.setBounds(minV, maxV);
      bounds.setRayTester(new SphereRayTester_1.SphereRayTester(radius));
      this.applyEvent(bounds);
      this.m_entity = bounds;
      let n = Math.floor(radius / 2.0);

      if (n < 30) {
        n = 30;
      }

      let RST = CoRScene.RendererState;
      let cirMat = CoMath.createMat4();
      cirMat.setRotationEulerAngle(Math.PI * 0.5, 0.0, Math.PI * 0.5);
      let plb = CoMesh.plane;
      ;
      plb.transMatrix = cirMat;
      let cirPlMaterial = CoMaterial.createDefaultMaterial(false);
      cirPlMaterial.initializeByCodeBuf(false);
      plb.setBufSortFormat(cirPlMaterial.getBufSortFormat());
      let cirPlaneMesh = plb.createCircle(radius, n);
      let cirEntity = CoEntity.createDisplayEntity();
      cirEntity.setMaterial(cirPlMaterial);
      cirEntity.setMesh(cirPlaneMesh); // cirEntity.setRenderState(RST.NONE_CULLFACE_NORMAL_STATE);

      cirEntity.setRenderState(RST.NONE_TRANSPARENT_ALWAYS_STATE);
      this.m_container.addEntity(cirEntity);
      this.m_circle = cirEntity;
      this.applyEvent(bounds);
      this.m_container.addEntity(this.m_entity);
    }
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
  }

  run(camera, rtv, force = false) {
    if (this.m_camVer != camera.version || force) {
      this.m_camVer = camera.version; // 圆面朝向摄像机

      const sv = this.m_scaleV;
      let et = this.m_circle;
      et.getPosition(this.m_posV);
      et.getScaleXYZ(sv);
      this.m_camPos.copyFrom(camera.getPosition());
      let container = this.m_target.container;
      container.globalToLocal(this.m_camPos);
      this.m_srcDV.setXYZ(1, 0, 0);
      this.m_dstDV.subVecsTo(this.m_camPos, this.m_posV);
      let rad = CoMath.Vector3D.RadianBetween(this.m_srcDV, this.m_dstDV);
      let axis = this.m_rotV;
      CoMath.Vector3D.Cross(this.m_srcDV, this.m_dstDV, axis);
      axis.normalize();
      let mat = this.m_mat0;
      mat.identity();
      mat.appendRotation(rad, axis);
      let rv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
      et.setPosition(this.m_posV);
      et.setScale3(sv);
      et.setRotation3(rv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI)); // et.update();
    }
  }

  setVisible(visible) {
    this.m_entity.setVisible(visible);
    this.m_circle.setVisible(visible);
    this.m_camVer = -7;
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  showOverColor() {
    this.overColor.a = 0.1;
    this.m_circle.getMaterial().setColor(this.overColor);
  }

  showOutColor() {
    this.outColor.a = 0.05;
    this.m_circle.getMaterial().setColor(this.outColor);
  }

  destroy() {
    super.destroy();

    if (this.m_entity != null) {
      this.m_container.removeEntity(this.m_entity);
      this.m_entity.destroy();
      this.m_entity = null;
    }

    this.m_container = null;
    this.m_editRS = null;
    this.m_stage = null;
    this.m_mat0 = null;
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        let et = this.m_target;

        if (et != null) {
          const f = 0.02;
          let cam = this.m_editRS.getCamera();
          let uv = cam.getUV();
          let rv = cam.getRV();
          let pv = this.m_stagePos;
          let st = this.m_stage;
          let mat = this.m_mat0;
          let dx = st.mouseX - pv.x;
          let dy = pv.y - st.mouseY;
          let rotv = this.m_rotV;
          mat.identity();
          mat.appendRotation(dx * f, uv);
          mat.appendRotation(dy * f, rv);
          rotv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
          et.setRotation3(rotv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));
          et.update();
        }
      }
    }
  }

  mouseDownListener(evt) {
    console.log("RotationCamXYCircle::mouseDownListener() ..., evt: ", evt);

    if (this.isEnabled()) {
      this.editBegin();
      this.m_target.select();
      this.setThisVisible(true);
      let st = this.m_stage;
      this.m_stagePos.setXYZ(st.mouseX, st.mouseY, 0.0);
    }
  }

}

exports.RotationCamXYCircle = RotationCamXYCircle;

/***/ }),

/***/ "ec63":
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

const MoveCtr_1 = __webpack_require__("aae9");
/**
 * 支持在一个平面上拖动
 */


class DragPlane extends MoveCtr_1.MoveCtr {
  constructor() {
    super();
    this.m_entity = null;
    this.m_frameEntity = null;
    this.m_container = null;
    this.offsetV = CoMath.createVec3(30, 30, 30);
    this.crossRay = false;
    this.m_planeNV = CoMath.createVec3(0.0, 1.0, 0.0);
    this.m_planePos = CoMath.createVec3();
    this.m_planeDis = 0.0;
    this.m_pos = CoMath.createVec3();
    this.m_dv = CoMath.createVec3();
    this.m_outV = CoMath.createVec3();
    this.m_rpv = CoMath.createVec3();
    this.m_rtv = CoMath.createVec3();
    this.m_initNV = CoMath.createVec3();
  }

  initialize(rs, container, planeAxisType, size) {
    if (this.m_entity == null) {
      this.m_editRS = rs;
      this.m_container = container;
      const V3 = CoMath.Vector3D;
      let rscene = CoRScene.getRendererScene();
      let eb = rscene.entityBlock;
      let material = CoRScene.createDefaultMaterial();
      material.initializeByCodeBuf(false);
      this.m_entity = CoRScene.createDisplayEntity();
      this.m_frameEntity = CoRScene.createDisplayEntity();
      let ml = CoMesh.line;
      ml.dynColorEnabled = true;
      let line_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
      line_material.initializeByCodeBuf(false);
      ml.setBufSortFormat(material.getBufSortFormat());
      let etL = this.m_frameEntity;
      etL.setMaterial(line_material);
      let et = this.m_entity;
      et.setMaterial(material);
      let mp = CoMesh.plane;
      mp.setBufSortFormat(material.getBufSortFormat());
      let ov = this.offsetV;

      switch (planeAxisType) {
        case 0:
          et.setMesh(mp.createXOZ(ov.x, ov.z, size, size));
          etL.setMesh(ml.createRectXOZ(ov.x, ov.z, size, size));
          this.setPlaneNormal(V3.Y_AXIS);
          break;

        case 1:
          et.setMesh(mp.createXOY(ov.x, ov.y, size, size));
          etL.setMesh(ml.createRectXOY(ov.x, ov.y, size, size));
          this.setPlaneNormal(V3.Z_AXIS);
          break;
        // yoz

        case 2:
          et.setMesh(mp.createYOZ(ov.y, ov.z, size, size));
          etL.setMesh(ml.createRectYOZ(ov.y, ov.z, size, size));
          this.setPlaneNormal(CoMath.Vector3D.X_AXIS);
          break;

        default:
          throw Error("Error type !!!");
          break;
      }

      et.setRenderState(CoRScene.RendererState.NONE_TRANSPARENT_STATE);
      container.addChild(et);
      container.addChild(etL);
      this.showOutColor();
      this.applyEvent(this.m_entity);
    }
  }

  showOverColor() {
    this.setEntityColor(this.m_entity, this.overColor);
    this.setEntityColor(this.m_frameEntity, this.overColor, 0.7);
  }

  showOutColor() {
    this.setEntityColor(this.m_entity, this.outColor);
    this.setEntityColor(this.m_frameEntity, this.outColor, 0.7);
  }

  enable() {
    super.enable();
    this.m_entity.mouseEnabled = true;
  }

  disable() {
    super.disable();
    this.m_entity.mouseEnabled = false;
  }

  setRenderState(state) {
    this.m_entity.setRenderState(state);
  }

  setVisible(visible) {
    this.m_entity.setVisible(visible);
    this.m_frameEntity.setVisible(visible);
    return this;
  }

  getVisible() {
    return this.m_entity.getVisible();
  }

  destroy() {
    super.destroy();

    if (this.m_container) {
      this.m_container.removeEntity(this.m_entity);
      this.m_container.removeEntity(this.m_frameEntity);
    }

    this.m_editRS = null;
    this.m_container = null;

    if (this.m_entity != null) {
      this.m_entity.destroy();
    }

    if (this.m_frameEntity != null) {
      this.m_frameEntity.destroy();
    }
  }

  calcClosePos(rpv, rtv) {
    CoAGeom.PlaneUtils.IntersectLinePos2(this.m_planeNV, this.m_planeDis, rpv, rtv, this.m_outV);
  }

  moveByRay(rpv, rtv, force = false) {
    if (this.isEnabled()) {
      if (this.isSelected()) {
        this.m_rpv.copyFrom(rpv);
        this.m_rtv.copyFrom(rtv);
        const pv = this.m_pos;
        this.calcClosePos(this.m_rpv, this.m_rtv);
        pv.copyFrom(this.m_outV);
        pv.addBy(this.m_dv);

        if (this.m_target) {
          this.m_target.setPosition(pv);
          this.m_target.update();
        }
      }
    }
  }

  mouseDownListener(evt) {
    console.log("move opt in model DragPlane::mouseDownListener() ..., this.isEnabled(): ", this.isEnabled());

    if (this.isEnabled()) {
      this.editBegin();
      this.setThisVisible(true);
      this.m_target.select(this);
      this.selectByParam(evt.raypv, evt.raytv, evt.wpos);
    }
  }
  /**
   * set plane world onrmal vactor3
   * @param nv
   */


  setPlaneNormal(nv) {
    this.m_planeNV.copyFrom(nv);
    this.m_planeNV.normalize();
    this.m_initNV.copyFrom(this.m_planeNV);
  }

  selectByParam(raypv, raytv, wpos) {
    this.m_rpv.copyFrom(raypv);
    this.m_rtv.copyFrom(raytv);
    this.m_planePos.copyFrom(wpos);
    this.m_planeNV.copyFrom(this.m_initNV);

    if (this.crossRay) {
      this.m_planeNV.copyFrom(this.m_rtv);
    }

    let invMat = this.m_entity.getMatrix();
    invMat.deltaTransformVectorSelf(this.m_planeNV);
    this.m_planeNV.normalize();
    this.m_planeDis = this.m_planePos.dot(this.m_planeNV);
    this.calcClosePos(this.m_rpv, this.m_rtv);
    this.m_target.getPosition(this.m_dv);
    this.m_dv.subtractBy(this.m_outV);
  }

}

exports.default = DragPlane;

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

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("36b4");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });
});