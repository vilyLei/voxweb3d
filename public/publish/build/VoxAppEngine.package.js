(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VoxAppEngine"] = factory();
	else
		root["VoxAppEngine"] = factory();
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

/***/ "0236":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const EventBase_1 = __importDefault(__webpack_require__("a996"));

const MouseEvent_1 = __importDefault(__webpack_require__("1710"));

const KeyboardEvent_1 = __importDefault(__webpack_require__("7045"));

const MouseEvt3DDispatcher_1 = __importDefault(__webpack_require__("badb"));

class SubStage3D {
  constructor(rcuid, pdocument) {
    this.m_rcuid = 0;
    this.pixelRatio = 1.0;
    this.stageWidth = 800;
    this.stageHeight = 600; // 实际宽高, 和gpu端对齐

    this.stageHalfWidth = 400;
    this.stageHalfHeight = 300;
    this.mouseX = 0;
    this.mouseY = 0; // sdiv页面实际占据的像素宽高

    this.viewWidth = 800;
    this.viewHeight = 600;
    this.mouseViewX = 0;
    this.mouseViewY = 0;
    this.m_viewX = 0.0;
    this.m_viewY = 0.0;
    this.m_viewW = 1.0;
    this.m_viewH = 1.0; // mouse event dispatcher

    this.m_mouseEvtDispatcher = new MouseEvt3DDispatcher_1.default();
    this.m_resize_listener = [];
    this.m_resize_ers = [];
    this.m_enterFrame_listener = [];
    this.m_enterFrame_ers = [];
    this.m_keyDown_listener = [];
    this.m_keyDown_ers = [];
    this.m_keyUp_listener = [];
    this.m_keyUp_ers = [];
    this.m_preStageWidth = 0;
    this.m_preStageHeight = 0;
    this.m_mouseEvt = new MouseEvent_1.default(); // 是否舞台尺寸和view自动同步一致

    this.m_autoSynViewAndStageSize = true;
    this.uProbe = null;
    this.m_enterFrameEvt = new EventBase_1.default();
    this.m_rcuid = rcuid;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }

  getViewX() {
    return this.m_viewX;
  }

  getViewY() {
    return this.m_viewY;
  }

  getViewWidth() {
    return this.m_viewW;
  }

  getViewHeight() {
    return this.m_viewH;
  }

  setViewPort(px, py, pw, ph) {
    this.m_autoSynViewAndStageSize = false;
    this.m_viewX = px;
    this.m_viewY = py;

    if (pw != this.m_viewW || ph != this.m_viewH) {
      this.m_viewW = pw;
      this.m_viewH = ph;
      this.updateViewUData();
    }
  }

  updateViewUData() {
    this.uProbe.setVec4Data(2.0 / (this.m_viewW * this.pixelRatio), 2.0 / (this.m_viewH * this.pixelRatio), this.m_viewW * this.pixelRatio, this.m_viewH * this.pixelRatio);
    this.uProbe.update();
    this.m_preStageWidth = this.m_viewW;
    this.m_preStageHeight = this.m_viewH;
  }

  update() {
    if (this.m_preStageWidth != this.stageWidth || this.m_preStageHeight != this.stageHeight) {
      if (this.m_autoSynViewAndStageSize) {
        this.m_viewW = this.stageWidth;
        this.m_viewH = this.stageHeight;
        this.updateViewUData();
      }

      this.stageHalfWidth = 0.5 * this.stageWidth;
      this.stageHalfHeight = 0.5 * this.stageHeight;
    }
  }

  mouseDown(phase = 1) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_DOWN;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = phase;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseUp(phase = 1) {
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_UP;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = phase;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseClick() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_CLICK;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseDoubleClick() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_DOUBLE_CLICK;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseRightDown(phase = 1) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_RIGHT_DOWN;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseRightUp(phase = 1) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_RIGHT_UP;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseBgDown() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_BG_DOWN;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseBgUp() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_BG_UP;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseBgClick() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_BG_CLICK;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseRightClick() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_RIGHT_CLICK;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseMove() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_MOVE;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseWheel(evt) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_WHEEL;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.wheelDeltaY = evt.wheelDeltaY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  } // 等同于 touchCancle


  mouseCancel() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_CANCEL;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  } //param [{x,y},{x,y},...]


  mouseMultiDown(posArray) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_MULTI_DOWN;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvt.posArray = posArray;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  } //param [{x,y},{x,y},...]


  mouseMultiUp(posArray) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_MULTI_UP;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvt.posArray = posArray;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  } //param [{x,y},{x,y},...]


  mouseMultiMove(posArray) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_MULTI_MOVE;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvt.posArray = posArray;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseWindowUp(phase = 1) {}

  mouseWindowRightUp(phase = 1) {}

  enterFrame() {
    this.m_enterFrameEvt.type = EventBase_1.default.ENTER_FRAME;
    let len = this.m_enterFrame_listener.length;

    for (var i = 0; i < len; ++i) {
      this.m_enterFrame_listener[i].call(this.m_enterFrame_ers[i], this.m_enterFrameEvt);
    }
  }

  addEventListener(type, target, func, captureEnabled = true, bubbleEnabled = true) {
    if (func != null && target != null) {
      let i = 0;

      switch (type) {
        case EventBase_1.default.RESIZE:
          console.warn("addEventListener EventBase.RESIZE invalid operation.");
          break;

        case EventBase_1.default.ENTER_FRAME:
          for (i = this.m_enterFrame_listener.length - 1; i >= 0; --i) {
            if (target === this.m_enterFrame_ers[i]) {
              break;
            }
          }

          if (i < 0) {
            this.m_enterFrame_ers.push(target);
            this.m_enterFrame_listener.push(func);
          }

          break;

        case KeyboardEvent_1.default.KEY_DOWN:
          console.warn("addEventListener KeyboardEvent.KEY_DOWN invalid operation.");
          break;

        case KeyboardEvent_1.default.KEY_UP:
          console.warn("addEventListener KeyboardEvent.KEY_UP invalid operation.");
          break;

        default:
          this.m_mouseEvtDispatcher.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
          break;
      }
    }
  }

  removeEventListener(type, target, func) {
    if (func != null && target != null) {
      let i = 0;

      switch (type) {
        case EventBase_1.default.RESIZE:
          for (i = this.m_resize_listener.length - 1; i >= 0; --i) {
            if (target === this.m_resize_ers[i]) {
              this.m_resize_ers.splice(i, 1);
              this.m_resize_listener.splice(i, 1);
              break;
            }
          }

          break;

        case EventBase_1.default.ENTER_FRAME:
          for (i = this.m_enterFrame_listener.length - 1; i >= 0; --i) {
            if (target === this.m_enterFrame_ers[i]) {
              this.m_enterFrame_ers.splice(i, 1);
              this.m_enterFrame_listener.splice(i, 1);
              break;
            }
          }

          break;

        case KeyboardEvent_1.default.KEY_DOWN:
          for (i = this.m_keyDown_listener.length - 1; i >= 0; --i) {
            if (target === this.m_keyDown_ers[i]) {
              this.m_keyDown_ers.splice(i, 1);
              this.m_keyDown_listener.splice(i, 1);
              break;
            }
          }

          break;

        case KeyboardEvent_1.default.KEY_UP:
          for (i = this.m_keyUp_listener.length - 1; i >= 0; --i) {
            if (target === this.m_keyUp_ers[i]) {
              this.m_keyUp_ers.splice(i, 1);
              this.m_keyUp_listener.splice(i, 1);
              break;
            }
          }

          break;

        default:
          this.m_mouseEvtDispatcher.removeEventListener(type, target, func);
          break;
      }
    }
  }

}

exports.default = SubStage3D;

/***/ }),

/***/ "030e":
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
// renderer context Extensions

class RCExtension {
  static Initialize(webVer, gl) {
    let selfT = this;

    if (webVer == 1) {
      //#extension OES_standard_derivatives : enable
      selfT.OES_standard_derivatives = gl.getExtension('OES_standard_derivatives');
      if (selfT.OES_standard_derivatives != null) console.log("Use OES_standard_derivatives Extension success!");else console.log("OES_standard_derivatives Extension can not support!"); //#extension GL_EXT_shader_texture_lod : enable, for example: textureCubeLodEXT(envMap, dir, mipLv)
      // vec4 texture2DLodEXT(sampler2D sampler, vec2 coord, float lod)
      // vec4 texture2DProjLodEXT(sampler2D sampler, vec3 coord, float lod)
      // vec4 texture2DProjLodEXT(sampler2D sampler, vec4 coord, float lod)
      // vec4 textureCubeLodEXT(samplerCube sampler, vec3 coord, float lod)
      // vec4 texture2DGradEXT(sampler2D sampler, vec2 P, vec2 dPdx, vec2 dPdy)
      // vec4 texture2DProjGradEXT(sampler2D sampler, vec3 P, vec2 dPdx, vec2 dPdy)
      // vec4 texture2DProjGradEXT(sampler2D sampler, vec4 P, vec2 dPdx, vec2 dPdy)
      // vec4 textureCubeGradEXT(samplerCube sampler, vec3 P, vec3 dPdx, vec3 dPdy)

      selfT.EXT_shader_texture_lod = gl.getExtension('EXT_shader_texture_lod');
      if (selfT.EXT_shader_texture_lod != null) console.log("Use EXT_shader_texture_lod Extension success!");else console.log("EXT_shader_texture_lod Extension can not support!");
      /*
      <script type="x-shader/x-fragment">
      #extension GL_EXT_shader_texture_lod : enable
      #extension GL_OES_standard_derivatives : enable
      
      uniform sampler2D myTexture;
      varying vec2 texcoord;
      
      void main(){
        gl_FragColor = texture2DGradEXT(myTexture, mod(texcoord, vec2(0.1, 0.5)),
                                        dFdx(texcoord), dFdy(texcoord));
      }
      </script>
      */

      selfT.WEBGL_draw_buffers = gl.getExtension('WEBGL_draw_buffers');
      if (selfT.WEBGL_draw_buffers != null) console.log("Use WEBGL_draw_buffers Extension success!");else console.log("WEBGL_draw_buffers Extension can not support!"); //DivLog.ShowLog("selfT.WEBGL_draw_buffers != null: "+(selfT.WEBGL_draw_buffers != null));

      selfT.OES_vertex_array_object = gl.getExtension('OES_vertex_array_object');
      if (selfT.OES_vertex_array_object != null) console.log("Use OES_vertex_array_object Extension success!");else console.log("OES_vertex_array_object Extension can not support!");
      selfT.ANGLE_instanced_arrays = gl.getExtension('ANGLE_instanced_arrays');
      if (selfT.ANGLE_instanced_arrays != null) console.log("Use ANGLE_instanced_arrays Extension success!");else console.log("ANGLE_instanced_arrays Extension can not support!");
      selfT.EXT_color_buffer_float = gl.getExtension('EXT_color_buffer_float');
      if (selfT.EXT_color_buffer_float != null) console.log("Use EXT_color_buffer_float Extension success!");else console.log("EXT_color_buffer_float Extension can not support!");
      selfT.EXT_color_buffer_half_float = gl.getExtension('EXT_color_buffer_half_float');
      if (selfT.EXT_color_buffer_half_float != null) console.log("Use EXT_color_buffer_half_float Extension success!");else console.log("EXT_color_buffer_half_float Extension can not support!");
      selfT.OES_texture_half_float = gl.getExtension('OES_texture_half_float');
      if (selfT.OES_texture_half_float != null) console.log("Use OES_texture_half_float Extension success!");else console.log("OES_texture_half_float Extension can not support!");
      selfT.OES_texture_half_float_linear = gl.getExtension('OES_texture_half_float_linear');
      if (selfT.OES_texture_half_float_linear != null) console.log("Use OES_texture_half_float_linear Extension success!");else console.log("OES_texture_half_float_linear Extension can not support!");
      selfT.OES_texture_float = gl.getExtension('OES_texture_float');
      if (selfT.OES_texture_float != null) console.log("Use OES_texture_float Extension success!");else console.log("OES_texture_float Extension can not support!"); //

      selfT.OES_element_index_uint = gl.getExtension('OES_element_index_uint');
      if (selfT.OES_element_index_uint != null) console.log("Use OES_element_index_uint Extension success!");else console.log("OES_element_index_uint Extension can not support!"); //EXT_blend_minmax

      selfT.EXT_blend_minmax = gl.getExtension('EXT_blend_minmax');
      if (selfT.EXT_blend_minmax != null) console.log("Use EXT_blend_minmax Extension success!");else console.log("EXT_blend_minmax Extension can not support!");
    } else {
      //  selfT.OES_standard_derivatives = gl.getExtension('OES_standard_derivatives');
      //  if(selfT.OES_standard_derivatives != null)
      //  console.log("Use OES_standard_derivatives Extension success!");
      //  else
      //  console.log("OES_standard_derivatives Extension can not support!");
      selfT.EXT_shader_texture_lod = gl.getExtension('EXT_shader_texture_lod');
      if (selfT.EXT_shader_texture_lod != null) console.log("Use EXT_shader_texture_lod Extension success!");else console.log("EXT_shader_texture_lod Extension can not support!");
      selfT.EXT_color_buffer_half_float = gl.getExtension('EXT_color_buffer_half_float');
      if (selfT.EXT_color_buffer_half_float != null) console.log("Use EXT_color_buffer_half_float Extension success!");else console.log("EXT_color_buffer_half_float Extension can not support!");
      selfT.OES_texture_half_float_linear = gl.getExtension('OES_texture_half_float_linear');
      if (selfT.OES_texture_half_float_linear != null) console.log("Use OES_texture_half_float_linear Extension success!");else console.log("OES_texture_half_float_linear Extension can not support!");
      selfT.EXT_color_buffer_float = gl.getExtension('EXT_color_buffer_float');
      if (selfT.EXT_color_buffer_float != null) console.log("Use EXT_color_buffer_float Extension success!");else console.log("EXT_color_buffer_float Extension can not support!");
    }

    selfT.OES_texture_float_linear = gl.getExtension('OES_texture_float_linear');
    if (selfT.OES_texture_float_linear != null) console.log("Use OES_texture_float_linear Extension success!");else console.log("OES_texture_float_linear Extension can not support!");
    selfT.WEBGL_depth_texture = gl.getExtension('WEBGL_depth_texture');
    if (selfT.WEBGL_depth_texture != null) console.log("Use WEBGL_depth_texture Extension success!");else console.log("WEBGL_depth_texture Extension can not support!");
    selfT.WEBGL_debug_renderer_info = gl.getExtension('WEBGL_debug_renderer_info');
    if (selfT.WEBGL_debug_renderer_info != null) console.log("Use WEBGL_debug_renderer_info Extension success!");else console.log("WEBGL_debug_renderer_info Extension can not support!"); //
    //console.log("RCExtension.WEBGL_depth_texture: ",RCExtension.WEBGL_depth_texture);
  }

}

RCExtension.OES_standard_derivatives = null;
RCExtension.EXT_shader_texture_lod = null;
RCExtension.WEBGL_draw_buffers = null;
RCExtension.OES_vertex_array_object = null;
RCExtension.ANGLE_instanced_arrays = null;
RCExtension.EXT_color_buffer_float = null;
RCExtension.EXT_color_buffer_half_float = null;
RCExtension.OES_texture_float_linear = null;
RCExtension.OES_texture_half_float_linear = null;
RCExtension.OES_texture_half_float = null;
RCExtension.OES_texture_float = null;
RCExtension.OES_element_index_uint = null;
RCExtension.EXT_blend_minmax = null;
RCExtension.WEBGL_depth_texture = null;
RCExtension.WEBGL_debug_renderer_info = null;
exports.default = RCExtension;

/***/ }),

/***/ "070b":
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

class RenderColorMask {
  //private m_state: number = 0;
  constructor(rBoo, gBoo, bBoo, aBoo) {
    this.m_uid = -1;
    this.m_rBoo = true;
    this.m_gBoo = true;
    this.m_bBoo = true;
    this.m_aBoo = true;
    this.m_uid = RenderColorMask.s_uid++;
    this.m_rBoo = rBoo;
    this.m_gBoo = gBoo;
    this.m_bBoo = bBoo;
    this.m_aBoo = aBoo;
  }

  getUid() {
    return this.m_uid;
  }

  getR() {
    return this.m_rBoo;
  }

  getG() {
    return this.m_gBoo;
  }

  getB() {
    return this.m_bBoo;
  }

  getA() {
    return this.m_aBoo;
  }

  use() {
    if (RenderColorMask.s_state != this.m_uid) {
      RenderColorMask.Rstate.setColorMask(this.m_rBoo, this.m_gBoo, this.m_bBoo, this.m_aBoo);
      RenderColorMask.s_state = this.m_uid;
    }
  }

  static Create(objName, rBoo, gBoo, bBoo, aBoo) {
    if (RenderColorMask.s_stsNameMap.has(objName)) {
      let po = RenderColorMask.s_stsNameMap.get(objName);
      return po.getUid();
    }

    let key = (rBoo ? 1 << 6 : 1 << 5) | (gBoo ? 1 << 4 : 1 << 3) | (bBoo ? 1 << 2 : 1 << 1) | (aBoo ? 1 : 0);

    if (RenderColorMask.s_stsMap.has(key)) {
      let po = RenderColorMask.s_stsMap.get(key);
      key = po.getUid();
    } else {
      let po = new RenderColorMask(rBoo, gBoo, bBoo, aBoo);
      key = po.getUid();
      RenderColorMask.s_stsMap.set(key, po);
      RenderColorMask.s_stsNameMap.set(objName, po);
      RenderColorMask.s_states.push(po);
      ++RenderColorMask.s_statesLen;
    }

    return key;
  }

  static GetColorMaskByName(objName) {
    if (RenderColorMask.s_stsNameMap.has(objName)) {
      let po = RenderColorMask.s_stsNameMap.get(objName);
      return po.getUid();
    }

    return -1;
  } // @param           state come from RODisp::renderState


  static UseRenderState(state) {
    if (RenderColorMask.s_unlocked && RenderColorMask.Rstate.roColorMask != state) {
      if (state > -1 && state < RenderColorMask.s_statesLen) {
        RenderColorMask.s_states[state].use();
      }
    }
  }

  static UseColorMaskByName(stateName) {
    let state = RenderColorMask.GetColorMaskByName(stateName); //trace("state: "+state+", stateName: "+stateName);

    if (RenderColorMask.s_unlocked && RenderColorMask.Rstate.roColorMask != state) {
      if (state > -1 && state < RenderColorMask.s_statesLen) {
        RenderColorMask.s_states[state].use();
      }
    }
  }

  static Lock() {
    RenderColorMask.s_unlocked = false;
  }

  static Unlock() {
    RenderColorMask.s_unlocked = true;
  }

  static Reset() {
    RenderColorMask.s_state = -1;
  }

}

RenderColorMask.s_uid = 0;
RenderColorMask.s_state = -1;
RenderColorMask.s_states = [];
RenderColorMask.s_statesLen = 1;
RenderColorMask.s_stsMap = new Map();
RenderColorMask.s_stsNameMap = new Map();
RenderColorMask.s_unlocked = true;
RenderColorMask.ALL_TRUE_COLOR_MASK = 0;
RenderColorMask.ALL_FALSE_COLOR_MASK = 1;
RenderColorMask.Rstate = null;
exports.RenderColorMask = RenderColorMask;

/***/ }),

/***/ "0851":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const TextureResSlot_1 = __importDefault(__webpack_require__("da6a"));
/**
 * Texture cpu memory data object
 */


class TextureProxy {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    this.m_uid = -1; // 自身的引用计数器

    this.m_attachCount = 0;
    this.m_renderProxy = null;
    this.m_slot = null;
    this.m_miplevel = -1;
    this.m_texWidth = 128;
    this.m_texHeight = 128;
    this.m_texBufW = 128;
    this.m_texBufH = 128;
    this.m_texTarget = TextureConst_1.TextureTarget.TEXTURE_2D; // The fragment processor texture sampler type.

    this.m_sampler = -1; // have render useable data

    this.m_haveRData = false;
    this.m_type = TextureProxyType_1.TextureProxyType.Default;
    this.m_generateMipmap = true;
    this.name = "TextureProxy";
    this.internalFormat = TextureConst_1.TextureFormat.RGBA;
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_BYTE;
    this.wrap_s = TextureConst_1.TextureConst.WRAP_CLAMP_TO_EDGE;
    this.wrap_t = TextureConst_1.TextureConst.WRAP_CLAMP_TO_EDGE;
    this.wrap_r = TextureConst_1.TextureConst.WRAP_CLAMP_TO_EDGE;
    this.mipmapEnabled = false;
    this.flipY = false;
    this.premultiplyAlpha = false;
    /**
     * the value contains (1,2,4,8)
     */

    this.unpackAlignment = 4;
    this.minFilter = TextureConst_1.TextureConst.LINEAR_MIPMAP_LINEAR; // webgl1环境下,这个参数值为LINEAR会报错:
    // [.WebGL-0BC70EE8]RENDER WARNING: texture bound to texture unit 1 is not renderable. It maybe non-power-of-2 and have incompatible texture filtering.

    this.magFilter = TextureConst_1.TextureConst.LINEAR; // 用于记录自身变换的版本号，例如数据变换

    this.version = 0;
    this.m_slot = TextureResSlot_1.default.GetInstance();
    this.m_uid = this.m_slot.getFreeUid();
    if (texWidth < 1) texWidth = 128;
    if (texHeight < 1) texHeight = 128;

    if (powerof2Boo) {
      this.m_texWidth = MathConst_1.default.CalcNearestCeilPow2(texWidth);
      this.m_texHeight = MathConst_1.default.CalcNearestCeilPow2(texHeight);
    } else {
      this.m_texWidth = texWidth;
      this.m_texHeight = texHeight;
    }

    this.m_slot.__$$addTexture(this);
  }
  /**
   * This function only be be called by the renderer inner system.
   */


  __$$use(resTex) {
    resTex.bindToGpu(this.getResUid());
  }

  __$setRenderProxy(rc) {
    if (this.m_slot != null) {
      this.m_renderProxy = rc;
    } else {
      // 这样处理可能有错误
      this.m_slot = TextureResSlot_1.default.GetInstance();
      this.m_uid = this.m_slot.getFreeUid();

      this.m_slot.__$$addTexture(this);

      this.m_renderProxy = rc;
    }
  }
  /**
   * 被引用计数加一
   */


  __$attachThis() {
    if (this.m_attachCount == -1) {
      this.m_slot.removeFreeUid(this.getUid());
      this.m_attachCount = 0;
    }

    ++this.m_attachCount; //console.log("TextureProxy::__$attachThis() this(uid="+this.getUid()+").attachCount: "+this.m_attachCount);
  }
  /**
   * 被引用计数减一
   */


  __$detachThis() {
    if (this.m_attachCount > 0) {
      --this.m_attachCount; //console.log("TextureProxy::__$detachThis() this(uid="+this.getUid()+").attachCount: "+this.m_attachCount);

      if (this.m_attachCount < 1) {
        this.m_attachCount = -1;
        this.m_slot.addFreeUid(this.getUid()); //console.log("TextureProxy::__$detachThis() this.m_attachCount value is 0.");
      }
    }
  }
  /**
   * @returns 获得引用计数值
   */


  getAttachCount() {
    return this.m_attachCount;
  }
  /**
   * @returns 返回true, 表示当前纹理对象是渲染直接使用其对应的显存资源的对象
   *          返回false, 表示不能直接使用对应的显存资源
   */


  isDirect() {
    return true;
  }
  /**
   * @returns 返回自己的纹理类型(value: TextureProxyType)
   */


  getType() {
    return this.m_type;
  }
  /**
   * @returns 返回自己的 纹理资源 unique id, 这个id会被对应的资源管理器使用, 此方法子类可以依据需求覆盖
   */


  getResUid() {
    return this.m_uid;
  }
  /**
   * @returns 返回自己的 unique id, 此方法不允许子类覆盖
   */


  getUid() {
    return this.m_uid;
  }

  setWrap(wrap) {
    this.wrap_s = this.wrap_t = this.wrap_r = wrap;
  }
  /**
   * 注意，这个返回值在多 renderer instance的时候，如果renderer instance 共享了这个texture，则此返回值和TextureSlot相关
   * @returns the texture gpu resource is enabled or not.
   */


  isGpuEnabled() {
    return this.m_renderProxy != null && this.m_renderProxy.Texture.hasResUid(this.getResUid());
  }
  /**
   * @returns The fragment processor texture sampler type.
   */


  getSampler() {
    return this.m_sampler;
  }
  /**
   * @returns return value is TextureConst.TEXTURE_2D or TextureConst.TEXTURE_CUBE or TextureConst.TEXTURE_3D
   */


  getTargetType() {
    return this.m_texTarget;
  } // gpu texture buf size


  getBufWidth() {
    return this.m_texBufW;
  }

  getBufHeight() {
    return this.m_texBufH;
  } // logic texture size


  getWidth() {
    return this.m_texWidth;
  }

  getHeight() {
    return this.m_texHeight;
  }
  /**
   * @returns the texture data is enough or not.
   */


  isDataEnough() {
    return this.m_haveRData;
  }

  uploadFromFbo(texResource, fboWidth, fboHeight) {
    throw Error("Illegal operation !!!");
  }

  __$buildParam(gl) {
    this.m_texBufW = this.m_texWidth;
    this.m_texBufH = this.m_texHeight; // texture wrap

    gl.texParameteri(this.m_sampler, gl.TEXTURE_WRAP_S, TextureConst_1.TextureConst.GetConst(gl, this.wrap_s));
    gl.texParameteri(this.m_sampler, gl.TEXTURE_WRAP_T, TextureConst_1.TextureConst.GetConst(gl, this.wrap_t)); // texture filter

    gl.texParameteri(this.m_sampler, gl.TEXTURE_MIN_FILTER, TextureConst_1.TextureConst.GetConst(gl, this.minFilter));
    gl.texParameteri(this.m_sampler, gl.TEXTURE_MAG_FILTER, TextureConst_1.TextureConst.GetConst(gl, this.magFilter)); //      //gl.DONT_CARE
    //      //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
    //      //gl.hint(gl.GENERATE_MIPMAP_HINT, gl.FASTEST);

    if (this.m_texTarget == TextureConst_1.TextureTarget.TEXTURE_3D) {
      gl.texParameteri(this.m_sampler, gl.TEXTURE_WRAP_R, TextureConst_1.TextureConst.GetConst(gl, this.wrap_r));
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(this.m_texWidth));
    }

    if (this.mipmapEnabled && this.m_generateMipmap) {
      gl.generateMipmap(this.m_sampler);
    }
  }

  enableMipmap() {}

  disableMipmap() {}

  generateMipmap(texRes) {
    if (this.mipmapEnabled && this.m_generateMipmap) {
      let gl = texRes.getRC();
      texRes.bindToGpu(this.getResUid()); //gl.generateMipmap(this.m_sampler);

      this.__$buildParam(gl);
    }
  } // sub class override


  uploadData(texRes) {} // sub class override


  __$updateToGpu(texRes) {}
  /**
   * 准备将数据更新到当前的 Gpu context,这是一个异步过程，在渲染运行时才会真正的提交给gpu
   * 这个函数由用户主动调用
   * 这个函数不能被子类覆盖
   */


  updateDataToGpu(rc = null, deferred = true) {
    if (rc != null) this.m_renderProxy = rc;

    if (this.m_renderProxy != null) {
      this.m_renderProxy.MaterialUpdater.updateTextureData(this, deferred);
    }
  }

  createTexBuf(texResource) {
    if (!texResource.hasResUid(this.getResUid())) {
      this.m_sampler = TextureConst_1.TextureTarget.GetValue(texResource.getRC(), this.m_texTarget);
      texResource.createResByParams3(this.getResUid(), this.getWidth(), this.getHeight(), this.m_sampler);
      return true;
    }

    return false;
  }
  /**
   * This function only be be called by the renderer inner system.
   * if sub class override this function, it must does call this function.
   */


  __$$upload(texRes) {
    if (this.m_haveRData && this.m_slot != null) {
      let buildStatus = this.createTexBuf(texRes); //console.log("Tex __$$upload buildStatus: ",buildStatus, ",resUid: ", this.getResUid());

      if (buildStatus) {
        this.__$updateToGpuBegin(texRes);

        this.uploadData(texRes);

        this.__$buildParam(texRes.getRC());

        this.m_generateMipmap = true;
      }
    }
  }
  /**
   * sub class can not override!!!!
   */


  dataUploadToGpu(gl, texData, texDatas, force = false) {
    this.version = 0;
    let interType = TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat);
    let format = TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat);
    let type = TextureConst_1.TextureDataType.ToGL(gl, this.dataType);
    let d = texData;

    if (texDatas == null) {
      if (d.status > -1 || force) d.updateToGpu(gl, this.m_sampler, interType, format, type, force);
    } else {
      let ds = texDatas;

      for (let i = 0, len = ds.length; i < len; ++i) {
        d = ds[i];

        if (d != null) {
          if (d.status > -1 || force) d.updateToGpu(gl, this.m_sampler, interType, format, type, force);
        }
      }

      this.m_generateMipmap = false;
    }
  }

  __$updateToGpuBegin(texRes) {
    let gl = texRes.getRC();
    texRes.bindToGpu(this.getResUid());
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.unpackAlignment);
  }

  __$updateToGpuEnd(gl) {}
  /**
   * @returns This textureProxy instance has been destroyed.
   */


  isDestroyed() {
    return this.m_attachCount < -1;
  }

  __$destroy() {
    if (this.getAttachCount() < 1) {
      this.m_attachCount = -2;
      this.m_haveRData = false;
      this.m_texWidth = 1;
      this.m_texHeight = 1;
      this.m_renderProxy = null; //console.log("TextureProxy::destroy(), destroy a textureProxy instance(uid="+this.getUid()+")...");
    }
  }
  /**
   * 移除之后则不能再正常使用了
   */


  __$$removeFromSlot() {
    if (this.m_slot != null && this.getAttachCount() == -2) {
      // this.m_slot.__$$removeTexture(this);
      // this.m_slot 不能随便等于null,因为当前textureProxy实例还会通过this.m_slot来重复使用
      // 如果 this.m_slot 要等于 null, 则这个textureProxy实例及其uid需要回收
      console.log("TextureProxy::RemoveFromSlot(), destroy a textureProxy instance(uid=" + this.getUid() + ")...");
      this.m_slot = null;
      this.m_renderProxy = null;
      this.m_uid = -1;
    }
  }

  toString() {
    return "[TextureProxy(name:" + this.name + ",uid=" + this.getUid() + ",width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

}

exports.TextureProxy = TextureProxy;
exports.default = TextureProxy;

/***/ }),

/***/ "090c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RCExtension_1 = __importDefault(__webpack_require__("030e"));

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const RViewElement_1 = __importDefault(__webpack_require__("b0ef"));

const ContextMouseEvtDispatcher_1 = __importDefault(__webpack_require__("0c85"));

const RenderConst_1 = __webpack_require__("e08e");

const AABB2D_1 = __importDefault(__webpack_require__("e2fe"));

class RAdapterContext {
  constructor() {
    this.m_mouseEvtDisplather = new ContextMouseEvtDispatcher_1.default();
    this.m_div = null;
    this.m_canvas = null;
    this.m_scissorEnabled = false;
    this.m_depthTestEnabled = true;
    this.m_stencilTestEnabled = true;
    this.m_offcanvas = null;
    this.m_gl = null;
    this.m_stage = null;
    this.m_viewPortRect = new AABB2D_1.default(0, 0, 800, 600);
    this.m_maxWebGLVersion = 2;
    this.m_webGLVersion = 2;
    this.m_devicePixelRatio = 1.0;
    this.m_viewEle = new RViewElement_1.default(); // display 3d view buf size auto sync window size

    this.autoSyncRenderBufferAndWindowSize = true;
    this.offscreenRenderEnabled = false;
    this.m_WEBGL_lose_context = null;
    this.m_displayWidth = 0;
    this.m_displayHeight = 0;
    this.m_rcanvasWidth = 0;
    this.m_rcanvasHeight = 0;
    this.m_resizeCallback = null;
    this.m_resizeCallbackTarget = null;
  }

  contextrestoredHandler(evt) {
    console.log("webglcontextrestored...!!!");
    console.log(evt);
  }

  contextlostHandler(evt) {
    console.log("webglcontextlost...!!!");
    console.log(evt);
  }

  setWebGLMaxVersion(webgl_ver) {
    if (webgl_ver == 1 || webgl_ver == 2) {
      this.m_maxWebGLVersion = webgl_ver;
    }
  }

  getWebGLVersion() {
    return this.m_webGLVersion;
  }

  getDiv() {
    return this.m_div;
  }

  setDivStyleLeftAndTop(px, py) {
    this.m_viewEle.setDivStyleLeftAndTop(px, py);
  }

  setDivStyleSize(pw, ph) {
    this.m_viewEle.setDivStyleSize(pw, ph);
  }

  getCanvas() {
    return this.m_canvas;
  }

  isDepthTestEnabled() {
    return this.m_depthTestEnabled;
  }

  isStencilTestEnabled() {
    return this.m_stencilTestEnabled;
  }

  initialize(rcuid, stage, div, rattr = null) {
    this.m_stage = stage;
    var pdocument = null;
    var pwindow = null;

    try {
      if (document != undefined) {
        pdocument = document;
        pwindow = window;
      }
    } catch (err) {
      console.log("RAdapterContext::initialize(), document is undefined.");
    }

    if (pdocument != null) {
      this.m_viewEle.setDiv(div);
      this.m_viewEle.createViewEle(pdocument, this.autoSyncRenderBufferAndWindowSize);
      this.m_div = div = this.m_viewEle.getDiv();
      let canvas = this.m_canvas = this.m_viewEle.getCanvas();
      this.m_devicePixelRatio = window.devicePixelRatio;
      this.m_mouseEvtDisplather.dpr = this.m_devicePixelRatio;
      let attr = rattr;

      if (rattr == null) {
        attr = {
          depth: this.m_depthTestEnabled,
          premultipliedAlpha: false,
          alpha: true,
          antialias: false,
          stencil: this.m_stencilTestEnabled,
          preserveDrawingBuffer: true,
          powerPreference: "default"
        };
      } else {
        this.m_depthTestEnabled = attr.depth;
        this.m_stencilTestEnabled = attr.stencil;
      }

      console.log("this.m_devicePixelRatio: " + this.m_devicePixelRatio + ",rattr == null: " + (rattr == null));
      console.log("depthTestEnabled: " + attr.depth);
      console.log("stencilTestEnabled: " + attr.stencil);
      console.log("antialiasEnabled: " + attr.antialias);
      console.log("alphaEnabled: " + attr.alpha);
      let offscreen = null;

      if (this.offscreenRenderEnabled) {
        offscreen = canvas.transferControlToOffscreen();
      }

      this.m_offcanvas = offscreen;

      if (this.m_maxWebGLVersion == 2) {
        this.m_gl = offscreen == null ? canvas.getContext('webgl2', attr) : offscreen.getContext('webgl2', attr);

        if (this.m_gl != null) {
          console.log("Use WebGL2 success!");
          this.m_webGLVersion = 2;
        } else {
          console.log("WebGL2 can not support!");
        }
      }

      if (this.m_gl == null) {
        if (offscreen == null) {
          this.m_gl = canvas.getContext('webgl', attr) || canvas.getContext("experimental-webgl", attr);
        } else {
          this.m_gl = offscreen.getContext('webgl', attr) || offscreen.getContext("experimental-webgl", attr);
        }

        if (this.m_gl != null) {
          console.log("Use WebGL1 success!");
          this.m_webGLVersion = 1;
        } else {
          console.log("WebGL1 can not support!");
        }
      }

      if (!this.m_gl) {
        this.m_webGLVersion = -1;
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        throw Error("WebGL initialization failure.");
        return;
      }

      let gl = this.m_gl;
      gl.rcuid = rcuid;
      let glStencilFunc = RenderConst_1.GLStencilFunc;
      glStencilFunc.NEVER = gl.NEVER;
      glStencilFunc.LESS = gl.LESS;
      glStencilFunc.EQUAL = gl.EQUAL;
      glStencilFunc.GREATER = gl.GREATER;
      glStencilFunc.NOTEQUAL = gl.NOTEQUAL;
      glStencilFunc.GEQUAL = gl.GEQUAL;
      glStencilFunc.ALWAYS = gl.ALWAYS;
      let stendilOp = RenderConst_1.GLStencilOp;
      stendilOp.KEEP = gl.KEEP;
      stendilOp.ZERO = gl.ZERO;
      stendilOp.REPLACE = gl.REPLACE;
      stendilOp.INCR = gl.INCR;
      stendilOp.INCR_WRAP = gl.INCR_WRAP;
      stendilOp.DECR = gl.DECR;
      stendilOp.DECR_WRAP = gl.DECR_WRAP;
      stendilOp.INVERT = gl.INVERT;
      let glBlendMode = RenderConst_1.GLBlendMode;
      glBlendMode.ZERO = gl.ZERO;
      glBlendMode.ONE = gl.ONE;
      glBlendMode.SRC_COLOR = gl.SRC_COLOR;
      glBlendMode.DST_COLOR = gl.DST_COLOR;
      glBlendMode.SRC_ALPHA = gl.SRC_ALPHA;
      glBlendMode.DST_ALPHA = gl.DST_ALPHA;
      glBlendMode.ONE_MINUS_SRC_ALPHA = gl.ONE_MINUS_SRC_ALPHA;
      let glBlendEq = RenderConst_1.GLBlendEquation;
      glBlendEq.FUNC_ADD = gl.FUNC_ADD;
      glBlendEq.FUNC_SUBTRACT = gl.FUNC_SUBTRACT;
      glBlendEq.FUNC_REVERSE_SUBTRACT = gl.FUNC_REVERSE_SUBTRACT;
      glBlendEq.MIN_EXT = gl.MIN_EXT;
      glBlendEq.MAX_EXT = gl.MAX_EXT;
      glBlendEq.MIN = gl.MIN;
      glBlendEq.MAX = gl.MAX;
      let glFaceCull = RenderConst_1.CullFaceMode;
      glFaceCull.BACK = gl.BACK;
      glFaceCull.FRONT = gl.FRONT;
      glFaceCull.FRONT_AND_BACK = gl.FRONT_AND_BACK;
      let device = RendererDevice_1.default; //MAX_RENDERBUFFER_SIZE

      device.MAX_TEXTURE_SIZE = this.m_gl.getParameter(this.m_gl.MAX_TEXTURE_SIZE);
      device.MAX_RENDERBUFFER_SIZE = this.m_gl.getParameter(this.m_gl.MAX_RENDERBUFFER_SIZE);
      let viewPortIMS = this.m_gl.getParameter(this.m_gl.MAX_VIEWPORT_DIMS);
      device.MAX_VIEWPORT_WIDTH = viewPortIMS[0];
      device.MAX_VIEWPORT_HEIGHT = viewPortIMS[1];
      RCExtension_1.default.Initialize(this.m_webGLVersion, this.m_gl);
      RendererDevice_1.default.Initialize([this.m_webGLVersion]);
      console.log("RadapterContext stage: ", stage);
      if (stage != null) this.m_mouseEvtDisplather.initialize(canvas, div, stage); //  console.log("viewPortIMS: ",viewPortIMS);

      console.log("MAX_TEXTURE_SIZE: ", RendererDevice_1.default.MAX_TEXTURE_SIZE);
      console.log("IsMobileWeb: ", RendererDevice_1.default.IsMobileWeb());
      console.log("IsAndroidOS: ", RendererDevice_1.default.IsAndroidOS());
      console.log("IsIOS: ", RendererDevice_1.default.IsIOS()); //  console.log("MAX_RENDERBUFFER_SIZE: ",RendererDevice.MAX_RENDERBUFFER_SIZE);
      //  console.log("MAX_VIEWPORT_WIDTH: ",RendererDevice.MAX_VIEWPORT_WIDTH);
      //  console.log("MAX_VIEWPORT_HEIGHT: ",RendererDevice.MAX_VIEWPORT_HEIGHT);
      //  DivLog.ShowLogOnce("MAX_TEXTURE_SIZE: "+RendererDevice.MAX_TEXTURE_SIZE);
      //  DivLog.ShowLog("MAX_RENDERBUFFER_SIZE: "+RendererDevice.MAX_RENDERBUFFER_SIZE);
      //  DivLog.ShowLog("MAX_VIEWPORT_WIDTH: "+RendererDevice.MAX_VIEWPORT_WIDTH);
      //  DivLog.ShowLog("MAX_VIEWPORT_HEIGHT: "+RendererDevice.MAX_VIEWPORT_HEIGHT);
      //  let rc_vendor:any = this.m_gl.getParameter(this.m_gl.VENDOR);
      //  let rc_renderer:any = this.m_gl.getParameter(this.m_gl.RENDERER);
      //  console.log("rc_vendor: ",rc_vendor);
      //  console.log("rc_renderer: ",rc_renderer);

      let debugInfo = RCExtension_1.default.WEBGL_debug_renderer_info;

      if (debugInfo != null) {
        let webgl_vendor = this.m_gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        let webgl_renderer = this.m_gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        device.GPU_VENDOR = webgl_vendor;
        device.GPU_RENDERER = webgl_renderer;
        console.log("webgl_vendor: ", webgl_vendor);
        console.log("webgl_renderer: ", webgl_renderer);

        if (!RendererDevice_1.default.IsWinExternalVideoCard()) {
          console.warn("当前浏览器没有使用独立显卡");
        } // DivLog.ShowLog("webgl_vendor: " + webgl_vendor);
        // DivLog.ShowLog("webgl_renderer: " + webgl_renderer);

      }

      var selfT = this;

      pwindow.onresize = function (evt) {
        if (selfT.autoSyncRenderBufferAndWindowSize) {
          selfT.updateRenderBufferSize();
        }
      };

      canvas.addEventListener('webglcontextrestored', this.contextrestoredHandler, false);
      canvas.addEventListener('webglcontextlost', this.contextlostHandler, false); //if(this.autoSyncRenderBufferAndWindowSize)
      //{

      this.updateRenderBufferSize(); //}
    } else {
      console.log("initialize WebGL failure!");
    }
  }

  loseContext() {
    if (this.m_WEBGL_lose_context == null) {
      this.m_WEBGL_lose_context = this.m_gl.getExtension('WEBGL_lose_context');
    }

    if (this.m_WEBGL_lose_context == null) {
      this.m_WEBGL_lose_context.loseContext();
    }
  }
  /**
   * @returns return gpu context lost status
   */


  isContextLost() {
    return this.m_gl.isContextLost();
  }
  /**
   * @returns return system gpu context
   */


  getRC() {
    return this.m_gl;
  } //getRenderState(): RODrawState { return this.m_rState; }


  setScissorEnabled(boo) {
    if (boo) {
      if (!this.m_scissorEnabled) {
        this.m_scissorEnabled = true;
        this.m_gl.enable(this.m_gl.SCISSOR_TEST);
      }
    } else {
      if (this.m_scissorEnabled) {
        this.m_scissorEnabled = false;
        this.m_gl.disable(this.m_gl.SCISSOR_TEST);
      }
    }
  }

  setScissorRect(px, py, pw, ph) {
    //this.m_gl.scissor(Math.floor(px*this.m_devicePixelRatio),Math.floor(py*this.m_devicePixelRatio), pw,ph);
    this.m_gl.scissor(px, py, pw, ph);
  }

  setResizeCallback(resizeCallbackTarget, resizeCallback) {
    this.m_resizeCallbackTarget = resizeCallbackTarget;
    this.m_resizeCallback = resizeCallback;
  }

  getDevicePixelRatio() {
    return this.m_devicePixelRatio;
  }

  resizeBufferSize(pw, ph) {
    pw = Math.floor(pw);
    ph = Math.floor(ph);
    let k = window.devicePixelRatio;
    let dprChanged = Math.abs(k - this.m_devicePixelRatio) > 0.02;
    this.m_devicePixelRatio = k;
    this.m_mouseEvtDisplather.dpr = k;
    RendererDevice_1.default.SetDevicePixelRatio(this.m_devicePixelRatio); // console.log("this.m_devicePixelRatio: "+this.m_devicePixelRatio);

    if (this.m_displayWidth != pw || this.m_displayHeight != ph || dprChanged) {
      this.m_displayWidth = pw;
      this.m_displayHeight = ph;
      this.m_rcanvasWidth = Math.floor(pw * k);
      this.m_rcanvasHeight = Math.floor(ph * k);

      if (this.m_offcanvas == null) {
        this.m_canvas.width = this.m_rcanvasWidth;
        this.m_canvas.height = this.m_rcanvasHeight;
      } else {
        this.m_offcanvas.width = this.m_rcanvasWidth;
        this.m_offcanvas.height = this.m_rcanvasHeight;
      }

      this.m_canvas.style.width = this.m_displayWidth + 'px';
      this.m_canvas.style.height = this.m_displayHeight + 'px';

      if (this.m_stage != null) {
        this.m_stage.stageWidth = this.m_rcanvasWidth;
        this.m_stage.stageHeight = this.m_rcanvasHeight;
        this.m_stage.viewWidth = this.m_displayWidth;
        this.m_stage.viewHeight = this.m_displayHeight;
        this.m_stage.pixelRatio = k;
        console.log("size to stage size: ", this.m_stage.stageWidth, this.m_stage.stageHeight);
        console.log("size to view size: ", this.m_stage.viewWidth, this.m_stage.viewHeight); //  DivLog.ShowLogOnce("stageSize: "+this.m_stage.stageWidth+","+this.m_stage.stageHeight);
        //  DivLog.ShowLog("canvasSize: "+this.m_canvas.width+","+this.m_canvas.height);
        //  DivLog.ShowLog("dispSize: "+this.m_displayWidth+","+this.m_displayHeight);
        //  DivLog.ShowLog("pixelRatio:"+this.m_devicePixelRatio);
        //  console.log("display size: "+this.m_displayWidth+","+this.m_displayHeight);
        //  console.log("RAdapterContext::resize(), canvas.width:"+this.m_canvas.width+", canvas.height:"+this.m_canvas.height);
        //  console.log("RAdapterContext::resize(), stageWidth:"+this.m_stage.stageWidth+", stageHeight:"+this.m_stage.stageHeight);
        //  console.log("RAdapterContext::resize(), m_rcanvasWidth:"+this.m_rcanvasWidth+", m_rcanvasHeight:"+this.m_rcanvasHeight);
        //  console.log("RAdapterContext::resize(), stw:"+this.m_stage.stageWidth+", sth:"+this.m_stage.stageHeight);

        this.m_stage.update();
      }

      if (this.m_resizeCallback != null) {
        this.m_resizeCallback.call(this.m_resizeCallbackTarget);
      }
    }
  }

  getStage() {
    return this.m_stage;
  }

  getStageWidth() {
    return this.m_stage.stageWidth;
  }

  getStageHeight() {
    return this.m_stage.stageHeight;
  }

  getDisplayWidth() {
    return this.m_displayWidth;
  }

  getDisplayHeight() {
    return this.m_displayHeight;
  }

  setViewport(px, py, pw, ph) {
    this.m_viewPortRect.setTo(px, py, pw, ph);
  }

  setViewportSize(pw, ph) {
    this.m_viewPortRect.setSize(pw, ph);
  }

  testViewPortChanged(px, py, pw, ph) {
    return this.m_viewPortRect.testEqualWithParams(px, py, pw, ph);
  }

  getViewportX() {
    return this.m_viewPortRect.x;
  }

  getViewportY() {
    return this.m_viewPortRect.y;
  }

  getViewportWidth() {
    return this.m_viewPortRect.width;
  }

  getViewportHeight() {
    return this.m_viewPortRect.height;
  }

  getViewPortSize() {
    return this.m_viewPortRect;
  }

  getFBOWidth() {
    return this.m_viewPortRect.width < RendererDevice_1.default.MAX_RENDERBUFFER_SIZE ? this.m_viewPortRect.width : RendererDevice_1.default.MAX_RENDERBUFFER_SIZE;
  }

  getFBOHeight() {
    return this.m_viewPortRect.height < RendererDevice_1.default.MAX_RENDERBUFFER_SIZE ? this.m_viewPortRect.height : RendererDevice_1.default.MAX_RENDERBUFFER_SIZE;
  }

  getRCanvasWidth() {
    return this.m_rcanvasWidth;
  }

  getRCanvasHeight() {
    return this.m_rcanvasHeight;
  }

  updateRenderBufferSize() {
    let rect = this.m_div.getBoundingClientRect();
    this.resizeBufferSize(rect.width, rect.height);
  }

}

exports.default = RAdapterContext;

/***/ }),

/***/ "0c85":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

class ContextMouseEvtDispatcher {
  constructor() {
    this.m_singleDown = false;
    this.m_mouseX = 0;
    this.m_mouseY = 0;
    this.m_mouseClickTime = 0;
    this.dpr = 1.0;
  }

  initMobile(canvas, div, stage) {
    var pdocument = null;

    try {
      if (document != undefined) {
        pdocument = document;
      }
    } catch (err) {
      console.log("ContextMouseEvtDispatcher::initMobile(), document is undefined.");
    }

    if (pdocument != null) {
      let selfT = this;
      div.addEventListener('touchstart', evt => {
        /*
        e.touches：当前位于屏幕上的所有手指的列表
        e.targetTouches：位于当前DOM元素上手指的列表
        e.changedTouches：涉及当前事件手指的列表
        */
        //获取手指的位置
        let list = evt.targetTouches;
        let px = 0;
        let py = 0;

        if (list.length < 2) {
          px = 0 | this.dpr * evt.targetTouches[0].pageX;
          py = 0 | this.dpr * evt.targetTouches[0].pageY;
          stage.mouseX = px;
          stage.mouseY = stage.stageHeight - py;
          stage.mouseViewX = px;
          stage.mouseViewY = py;
          this.m_singleDown = true;
          this.m_mouseX = stage.mouseX;
          this.m_mouseY = stage.mouseY;
          this.m_mouseClickTime = Date.now();
          stage.mouseDown(1);
        } else {
          let posArray = [];

          for (let i = 0; i < list.length; ++i) {
            px = 0 | this.dpr * evt.targetTouches[i].pageX;
            py = 0 | this.dpr * evt.targetTouches[i].pageY;
            posArray.push({
              x: px,
              y: py
            });
          }

          stage.mouseMultiDown(posArray);
          this.m_singleDown = false;
        }

        evt.preventDefault();
        evt.stopPropagation();
      }, false);
      div.addEventListener('touchend', evt => {
        //获取手指的位置
        this.m_singleDown = false;
        let list = evt.targetTouches;
        let px = 0;
        let py = 0;

        if (list.length < 1) {
          stage.mouseUp(1);
          this.m_mouseClickTime = Date.now() - this.m_mouseClickTime;

          if (Math.abs(this.m_mouseX - stage.mouseX) < 3 && Math.abs(this.m_mouseY - stage.mouseY) < 3 && this.m_mouseClickTime < 900) {
            this.m_mouseX = stage.mouseX;
            this.m_mouseY = stage.mouseY;
            stage.mouseClick();
          }
        } else {
          let posArray = [];

          for (let i = 0; i < list.length; ++i) {
            px = 0 | this.dpr * evt.targetTouches[i].pageX;
            py = 0 | this.dpr * evt.targetTouches[i].pageY;
            posArray.push({
              x: px,
              y: py
            });
          }

          stage.mouseMultiUp(posArray);
        }

        evt.preventDefault();
      }, false);
      div.addEventListener('touchcancel', e => {
        //获取手指的位置
        selfT.m_singleDown = false;
        let list = e.targetTouches;
        stage.mouseCancel();
        e.preventDefault();
      }, false);
      div.addEventListener('touchmove', evt => {
        evt.preventDefault(); //阻止屏幕滚动的默认行为

        let list = evt.targetTouches;
        let px = 0;
        let py = 0;

        if (this.m_singleDown) {
          px = 0 | this.dpr * list[0].pageX;
          py = 0 | this.dpr * list[0].pageY;
          stage.mouseViewX = px;
          stage.mouseViewY = py;
          stage.mouseX = px;
          stage.mouseY = stage.stageHeight - py;
          stage.mouseMove();
        }

        if (list.length > 1) {
          let posArray = [];

          for (let i = 0; i < list.length; ++i) {
            px = 0 | this.dpr * evt.targetTouches[i].pageX;
            py = 0 | this.dpr * evt.targetTouches[i].pageY;
            posArray.push({
              x: px,
              y: py
            });
          }

          stage.mouseMultiMove(posArray);
        } //DivLog.ShowLog("touchmove "+list.length+", px,py: "+(px|0)+","+(0|py));

      }, {
        passive: false
      }, false);

      if (RendererDevice_1.default.IsIpadOS()) {
        let meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width,initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no";
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    }
  }

  initialize(canvas, div, stage) {
    if (RendererDevice_1.default.IsMobileWeb() || RendererDevice_1.default.IsIpadOS()) {
      this.initMobile(canvas, div, stage);
    } else {
      this.initPC(canvas, div, stage);
      this.initMobile(canvas, div, stage);
    }
  }

  initPC(canvas, div, stage) {
    var pdocument = null;

    try {
      if (document != undefined) {
        pdocument = document;
      }
    } catch (err) {
      console.log("ContextMouseEvtDispatcher::initPC(), document is undefined.");
    }

    if (pdocument != null) {
      if (canvas.onmousewheel == undefined && canvas.addEventListener != undefined) {
        //use firefox browser mousewheel evt
        let func = function (evt) {
          evt.wheelDeltaY = -evt.detail;
          stage.mouseWheel(evt);
        };

        canvas.addEventListener('DOMMouseScroll', func, false);
      }

      canvas.onmousewheel = evt => {
        evt.preventDefault();
        evt.stopPropagation();
        stage.mouseWheel(evt);
      };

      canvas.onmousedown = evt => {
        let rect = div.getBoundingClientRect();
        let px = 0 | this.dpr * (evt.clientX - rect.left);
        let py = 0 | this.dpr * (evt.clientY - rect.top);
        stage.mouseX = px;
        stage.mouseY = stage.stageHeight - py;
        stage.mouseViewX = px;
        stage.mouseViewY = py;
        this.m_mouseX = stage.mouseX;
        this.m_mouseY = stage.mouseY;
        this.m_mouseClickTime = Date.now();

        if (evt.button == 0) {
          stage.mouseDown(1);
        } else if (evt.button == 2) {
          stage.mouseRightDown(1);
        }
      };

      canvas.onmouseup = evt => {
        let rect = div.getBoundingClientRect();
        let px = 0 | this.dpr * (evt.clientX - rect.left);
        let py = 0 | this.dpr * (evt.clientY - rect.top);
        stage.mouseX = px;
        stage.mouseY = stage.stageHeight - py; // console.log("ContextMouseEvtDispatcher::onmouseup(),"+stage.mouseViewX+","+stage.mouseViewY);

        if (evt.button == 0) {
          stage.mouseUp(1);
        } else if (evt.button == 2) {
          stage.mouseRightUp(1);
        }
      };

      document.onmouseup = evt => {
        if (evt.button == 0) {
          stage.mouseWindowUp(1);
        } else if (evt.button == 2) {
          stage.mouseWindowRightUp(1);
        }
      };

      canvas.onmousemove = evt => {
        // console.log("ContextMouseEvtDispatcher::onmouseMove"+evt.pageX+","+evt.pageY);
        let rect = div.getBoundingClientRect();
        let px = 0 | this.dpr * (evt.clientX - rect.left);
        let py = 0 | this.dpr * (evt.clientY - rect.top);
        stage.mouseX = px;
        stage.mouseY = stage.stageHeight - py;
        stage.mouseViewX = px;
        stage.mouseViewY = py;
        stage.mouseMove();
      };

      canvas.onclick = evt => {
        let rect = div.getBoundingClientRect();
        let px = 0 | this.dpr * (evt.clientX - rect.left);
        let py = 0 | this.dpr * (evt.clientY - rect.top);
        stage.mouseX = px;
        stage.mouseY = stage.stageHeight - py;
        stage.mouseViewX = px;
        stage.mouseViewY = py;
        this.m_mouseClickTime = Date.now() - this.m_mouseClickTime;

        if (Math.abs(this.m_mouseX - stage.mouseX) < 3 && Math.abs(this.m_mouseY - stage.mouseY) < 3 && this.m_mouseClickTime < 900) {
          this.m_mouseX = stage.mouseX;
          this.m_mouseY = stage.mouseY; //console.log("ContextMouseEvtDispatcher::onclick()," + stage.mouseViewX + "," + stage.mouseViewY + ",evt.button: " + evt.button);

          if (evt.button == 0) {
            stage.mouseClick();
          } else if (evt.button == 2) {
            stage.mouseRightClick();
          }
        }
      };

      canvas.ondblclick = evt => {
        let rect = div.getBoundingClientRect();
        let px = 0 | this.dpr * (evt.clientX - rect.left);
        let py = 0 | this.dpr * (evt.clientY - rect.top);
        stage.mouseX = px;
        stage.mouseY = stage.stageHeight - py;
        stage.mouseViewX = px;
        stage.mouseViewY = py; // console.log("ContextMouseEvtDispatcher::ondoubleclick()," + stage.mouseViewX + "," + stage.mouseViewY + ",evt.button: " + evt.button);

        if (evt.button == 0) {
          stage.mouseDoubleClick();
        } else if (evt.button == 2) {//stage.mouseRightDoubleClick();
        }
      };
    }
  }

}

exports.default = ContextMouseEvtDispatcher;

/***/ }),

/***/ "0e01":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const FrameBufferType_1 = __importDefault(__webpack_require__("baae"));

const RendererState_1 = __importDefault(__webpack_require__("29ef"));

const RenderMaterialProxy_1 = __importDefault(__webpack_require__("7499"));

const RenderProxy_1 = __webpack_require__("de9d");

class RendererInstanceContextParam {
  constructor() {
    this.camera = null;
    this.stage = null;
    this.builder = null;
    this.vtxBuilder = null;
    this.uniformContext = null;
    this.shaderProgramBuilder = null;
  }

}

exports.RendererInstanceContextParam = RendererInstanceContextParam;
/**
 * 渲染器实例上下文
 */

class RendererInstanceContext {
  constructor(rcuid) {
    this.m_adapter = null;
    this.m_renderProxy = null;
    this.m_materialProxy = null;
    this.m_cameraNear = 0.1;
    this.m_cameraFar = 5000.0;
    this.m_cameraFov = 45.0;
    this.m_rcuid = 0;
    this.m_rcuid = rcuid;
    this.m_renderProxy = new RenderProxy_1.RenderProxy(rcuid);
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

  getDiv() {
    return this.m_adapter.getDiv();
  }

  getCanvas() {
    return this.m_adapter.getCanvas();
  }

  getRenderAdapter() {
    return this.m_adapter;
  }

  getRenderMaterialProxy() {
    return this.m_materialProxy;
  }

  getRenderProxy() {
    return this.m_renderProxy;
  }

  getTextureResTotal() {
    return this.m_renderProxy.Texture.getTextureResTotal();
  }

  getTextureAttachTotal() {
    return this.m_renderProxy.Texture.getAttachTotal();
  }

  getDevicePixelRatio() {
    return this.m_adapter.getDevicePixelRatio();
  }

  getStage3D() {
    return this.m_renderProxy.getStage3D();
  }

  getCamera() {
    if (this.m_renderProxy != null) {
      return this.m_renderProxy.getCamera();
    }

    return null;
  }

  cameraLock() {
    this.m_renderProxy.cameraLock();
  }

  cameraUnlock() {
    this.m_renderProxy.cameraUnlock();
  }

  updateCamera() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.updateCamera();
    }
  }

  updateCameraDataFromCamera(cam) {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.updateCameraDataFromCamera(cam);
    }
  }

  lockRenderColorMask() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.lockRenderColorMask();
    }
  }

  unlockRendererColorMask() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.unlockRenderState();
    }
  }

  useGlobalRenderColorMask(colorMask) {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.unlockRenderColorMask();
      this.m_renderProxy.useRenderColorMask(colorMask);
      this.m_renderProxy.lockRenderColorMask();
    }
  }

  useGlobalRenderColorMaskByName(colorMaskNS) {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.unlockRenderColorMask();
      this.m_renderProxy.useRenderColorMask(RendererState_1.default.GetRenderColorMaskByName(colorMaskNS));
      this.m_renderProxy.lockRenderColorMask();
    }
  }

  getRenderColorMaskByName(scolorMaskNS) {
    return RendererState_1.default.GetRenderColorMaskByName(scolorMaskNS);
  }

  lockRenderState() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.lockRenderState();
    }
  }

  unlockRenderState() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.unlockRenderState();
    }
  }

  useGlobalRenderState(state) {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.unlockRenderState();
      this.m_renderProxy.useRenderState(state);
      this.m_renderProxy.lockRenderState();
    }
  }

  useGlobalRenderStateByName(stateNS) {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.unlockRenderState();
      this.m_renderProxy.useRenderState(RendererState_1.default.GetRenderStateByName(stateNS));
      this.m_renderProxy.lockRenderState();
    }
  }

  getRenderStateByName(stateNS) {
    return RendererState_1.default.GetRenderStateByName(stateNS);
  }

  lockMaterial() {
    if (this.m_materialProxy != null) {
      this.m_materialProxy.lockMaterial();
    }
  }

  unlockMaterial() {
    if (this.m_materialProxy != null) {
      this.m_materialProxy.unlockMaterial();
    }
  }

  isUnlockMaterial() {
    return this.m_materialProxy.isUnlockMatrial();
  }

  useGlobalMaterial(material, texUnlock = false, materialUniformUpdate = false) {
    if (this.m_materialProxy != null) {
      this.m_materialProxy.unlockMaterial();

      if (texUnlock) {
        this.m_materialProxy.unlockTexture();
      } else {
        this.m_materialProxy.lockTexture();
      }

      this.m_materialProxy.useGlobalMaterial(material, materialUniformUpdate);
      this.m_materialProxy.lockMaterial();
    }
  }

  updateMaterialUniform(material) {
    this.m_materialProxy.updateMaterialUniform(material);
  }

  clearBackBuffer() {
    this.m_renderProxy.clearBackBuffer();
  }

  setScissorRect(px, py, pw, ph) {
    this.m_adapter.setScissorRect(px, py, pw, ph);
  }

  setScissorEnabled(enabled) {
    this.m_adapter.setScissorEnabled(enabled);
  }

  setViewPort(px, py, pw, ph) {
    this.m_renderProxy.setViewPort(px, py, pw, ph);
  }

  synFBOSizeWithViewport() {
    this.m_adapter.synFBOSizeWithViewport();
  }

  asynFBOSizeWithViewport() {
    this.m_adapter.asynFBOSizeWithViewport();
  } // if synFBOSizeWithViewport is true, fbo size = factor * view port size;


  setFBOSizeFactorWithViewPort(factor) {
    this.m_adapter.setFBOSizeFactorWithViewPort(factor);
  }

  createFBOAt(index, fboType, pw, ph, enableDepth = false, enableStencil = false, multisampleLevel = 0) {
    this.m_adapter.createFBOAt(index, fboType, pw, ph, enableDepth, enableStencil, multisampleLevel);
  }

  bindFBOAt(index, fboType) {
    this.m_adapter.bindFBOAt(index, fboType);
  }
  /**
   * bind a texture to fbo attachment by attachment index
   * @param texProxy  RTTTextureProxy instance
   * @param enableDepth  enable depth buffer yes or no
   * @param enableStencil  enable stencil buffer yes or no
   * @param attachmentIndex  fbo attachment index
   */


  setRenderToTexture(texProxy, enableDepth = false, enableStencil = false, attachmentIndex = 0) {
    this.m_adapter.setRenderToTexture(texProxy, enableDepth, enableStencil, attachmentIndex);
  }

  useFBO(clearColorBoo = false, clearDepthBoo = false, clearStencilBoo = false) {
    this.m_adapter.useFBO(clearColorBoo, clearDepthBoo, clearStencilBoo);
  }

  resetFBOAttachmentMask(boo) {
    this.m_adapter.resetFBOAttachmentMask(boo);
  }

  setFBOAttachmentMaskAt(index, boo) {
    this.m_adapter.setFBOAttachmentMaskAt(index, boo);
  }

  setRenderToBackBuffer() {
    if (this.m_adapter != null) {
      this.m_adapter.setRenderToBackBuffer(FrameBufferType_1.default.FRAMEBUFFER);
      this.m_materialProxy.renderBegin();
    }
  }

  lockViewport() {
    this.m_adapter.lockViewport();
  }

  unlockViewport() {
    this.m_adapter.unlockViewport();
  }

  setClearDepth(depth) {
    this.m_adapter.setClearDepth(depth);
  }

  getClearDepth() {
    return this.m_adapter.getClearDepth();
  }

  getViewportX() {
    return this.m_adapter.getViewportX();
  }

  getViewportY() {
    return this.m_adapter.getViewportY();
  }

  getViewportWidth() {
    return this.m_adapter.getViewportWidth();
  }

  getViewportHeight() {
    return this.m_adapter.getViewportHeight();
  }
  /**
   * 设置用于3D绘制的canvas的宽高尺寸,如果调用了此函数，则不会自动匹配窗口尺寸改变，默认是自动匹配窗口尺寸改变的
   * @param       pw 像素宽度
   * @param       ph 像素高度
  */


  setContextViewSize(pw, ph) {
    this.m_adapter.setContextViewSize(pw, ph);
  }

  setCameraParam(fov, near, far) {
    this.m_cameraFov = fov;
    this.m_cameraNear = near;
    this.m_cameraFar = far;

    if (this.m_renderProxy != null) {
      this.m_renderProxy.setCameraParam(fov, near, far);
    }
  }

  initialize(param, camera, contextParam) {
    if (this.m_adapter == null) {
      this.m_renderProxy.setCameraParam(this.m_cameraFov, this.m_cameraNear, this.m_cameraFar);
      this.m_renderProxy.setWebGLMaxVersion(param.maxWebGLVersion);
      let proxyParam = new RenderProxy_1.RenderProxyParam();
      proxyParam.uniformContext = contextParam.uniformContext;
      proxyParam.vtxBufUpdater = contextParam.builder;
      proxyParam.materialUpdater = contextParam.builder;
      proxyParam.vtxBuilder = contextParam.vtxBuilder;
      this.m_renderProxy.initialize(param, camera, contextParam.stage, proxyParam);
      this.m_rcuid = this.m_renderProxy.getRCUid();
      contextParam.vtxBuilder.initialize(this.m_rcuid, this.m_renderProxy.getRC(), this.m_renderProxy.getGLVersion());
      this.m_adapter = this.m_renderProxy.getRenderAdapter();
      this.m_adapter.bgColor.setRGBA4f(0.0, 0.0, 0.0, 1.0);
      let context = this.m_renderProxy.getContext();
      context.setViewport(0, 0, context.getRCanvasWidth(), context.getRCanvasHeight());
    }
  }

  initManager(builder) {
    if (this.m_materialProxy == null) {
      this.m_materialProxy = new RenderMaterialProxy_1.default();
      this.m_materialProxy.setDispBuilder(builder);
    }
  }

  setClearRGBColor3f(pr, pg, pb) {
    this.m_renderProxy.setClearRGBColor3f(pr, pg, pb);
  }

  setClearRGBAColor4f(pr, pg, pb, pa) {
    this.m_renderProxy.setClearRGBAColor4f(pr, pg, pb, pa);
  }

  getClearRGBAColor4f(color4) {
    color4.copyFrom(this.m_adapter.bgColor);
  }

  updateRenderBufferSize() {
    this.m_adapter.updateRenderBufferSize();
  }

  vertexRenderBegin() {
    this.m_renderProxy.Vertex.renderBegin();
  }
  /**
   * the function resets the renderer instance rendering status.
   * you should use it on the frame starting time.
   */


  renderBegin(cameraDataUpdate = true) {
    if (this.m_adapter != null) {
      this.m_adapter.unlockViewport(); //this.m_adapter.resetPolygonOffset();

      this.m_adapter.setClearDepth(1.0);
      this.m_renderProxy.Vertex.renderBegin();
      this.m_materialProxy.renderBegin();
      this.m_adapter.update();
      this.m_adapter.setClearMaskClearAll();
      this.m_adapter.renderBegin();
      RendererState_1.default.ResetInfo();
      RendererState_1.default.Reset(this.m_renderProxy.getRenderContext());

      if (cameraDataUpdate) {
        this.m_renderProxy.useCameraData();
        this.m_renderProxy.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
      }
    }
  }

  resetState() {
    RendererState_1.default.ResetState();
    this.m_materialProxy.renderBegin();
  }

  resetmaterial() {
    this.m_materialProxy.renderBegin();
  }

  resetUniform() {
    this.m_materialProxy.resetUniform();
  }

  runEnd() {}

}

exports.RendererInstanceContext = RendererInstanceContext;
exports.default = RendererInstanceContext;

/***/ }),

/***/ "0fc4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MaterialResource_1 = __importDefault(__webpack_require__("9666"));

const ShaderCodeBuffer_1 = __importDefault(__webpack_require__("faa5"));

class MaterialBase {
  constructor() {
    //private static s_codeBuffer: ShaderCodeBuffer = null;
    this.m_shduns = "";
    this.m_shdData = null;
    this.m_polygonOffset = null;
    this.m_sharedUniforms = null;
    this.m_shaderUniformData = null;
    this.m_pipeLine = null;
    this.m_uniqueShaderName = ""; // tex list unique hash value

    this.__$troMid = -1;
    this.__$uniform = null;
    /**
     * pipes type list for material pipeline
     */

    this.pipeTypes = null;
    this.m_texList = null;
    this.m_texListLen = 0;
    this.m_texDataEnabled = false;
    this.m_attachCount = 0;
  }
  /*
   * specifies the scale factors and units to calculate depth values.
   * @param factor the value is a GLfloat which sets the scale factor for the variable depth offset for each polygon. The default value is 0.
   * @param units the value is a which sets the multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. The default value is 0.
   */


  setPolygonOffset(factor, units = 0.0) {
    if (this.m_polygonOffset == null) {
      this.m_polygonOffset = [factor, units];
    } else {
      this.m_polygonOffset[0] = factor;
      this.m_polygonOffset[1] = units;
    }
  }

  getPolygonOffset() {
    return this.m_polygonOffset;
  }
  /**
   * 设置深度偏移量
   * @param offset the value range: [-2.0 -> 2.0]
   */


  setDepthOffset(offset) {}

  setMaterialPipeline(pipeline) {
    this.m_pipeLine = pipeline;
  }

  getMaterialPipeline() {
    return this.m_pipeLine;
  }

  getShdUniqueName() {
    return this.m_shduns;
  } // initializeByUniqueName(shdCode_uniqueName: string) {
  //     if (this.getShaderData() == null) {
  //         let shdData: ShaderData = MaterialResource.FindData(shdCode_uniqueName);
  //         if (shdData != null) this.m_shdData = shdData;
  //     }
  //     return this.getShaderData() != null;
  // }
  // get a shader code buf instance, for sub class override


  getCodeBuf() {
    // if (MaterialBase.s_codeBuffer != null) {
    //     return MaterialBase.s_codeBuffer;
    // }
    // MaterialBase.s_codeBuffer = new ShaderCodeBuffer();
    // return MaterialBase.s_codeBuffer;
    throw Error("Illgel operation !!!");
    return null;
  }

  hasShaderData() {
    if (this.m_shdData != null) {
      if (this.m_shdData.haveTexture()) {
        return this.texDataEnabled();
      } else {
        return true;
      }
    }

    return false;
  }

  initializeByRenderer(texEnabled = false) {
    this.initializeByCodeBuf(true);
  }

  initializeByCodeBuf(texEnabled = false) {
    if (this.m_shdData == null) {
      let buf = this.getCodeBuf();

      if (buf != null) {
        buf.reset();
        buf.pipeline = this.m_pipeLine;
        buf.pipeTypes = this.pipeTypes;
        if (buf.pipeline != null) buf.pipeline.reset();
        this.buildBuf();
        let shdData;
        let shdCode_uniqueName = this.m_uniqueShaderName;

        if (shdCode_uniqueName != "") {
          shdData = MaterialResource_1.default.FindData(shdCode_uniqueName);
          this.m_shduns = shdCode_uniqueName;
        }

        if (shdData == null) {
          // if (MaterialBase.s_codeBuffer == null) {
          //     MaterialBase.s_codeBuffer = new ShaderCodeBuffer();
          // }
          // ShaderCodeBuffer.UseShaderBuffer(buf);
          texEnabled = texEnabled || this.getTextureTotal() > 0;
          buf.initialize(texEnabled);
          shdCode_uniqueName = buf.getUniqueShaderName() + buf.keysString + buf.getShaderCodeBuilder().getUniqueNSKeyString();
          this.m_shduns = shdCode_uniqueName;

          this.__$initShd(this.m_shduns);

          shdData = MaterialResource_1.default.FindData(shdCode_uniqueName);
          this.m_uniqueShaderName = this.m_shduns;
        } else {
          // ShaderCodeBuffer.UseShaderBuffer(buf);
          texEnabled = texEnabled || this.getTextureTotal() > 0;
          buf.initialize(texEnabled);
        }

        if (shdData == null) {
          buf.buildShader();
          buf.buildDefine();

          if (buf.pipeline != null) {
            if (buf.getShaderCodeObject() != null) {
              buf.pipeline.addShaderCode(buf.getShaderCodeObject(), false);
            } else {
              buf.pipeline.addShaderCodeWithUUID(buf.getShaderCodeObjectUUID(), false);
            }

            buf.pipeline.build(buf.getShaderCodeBuilder());
          }

          let fshdCode = buf.getFragShaderCode();
          let vshdCode = buf.getVertShaderCode();
          shdData = MaterialResource_1.default.CreateShdData(shdCode_uniqueName, vshdCode, fshdCode, buf.adaptationShaderVersion, ShaderCodeBuffer_1.default.GetPreCompileInfo());
        }

        if (this.m_pipeLine != null) {
          this.m_sharedUniforms = this.m_pipeLine.getSharedUniforms();
        } // ShaderCodeBuffer.UseShaderBuffer(null);


        this.m_shdData = shdData;
      }
    }
  }

  buildBuf() {}

  __$initShd(pshduns) {}

  getShaderData() {
    return this.m_shdData;
  }
  /**
   * set TextuerProxy instances
   * @param texList [tex0,tex1,...]
   */


  setTextureList(texList) {
    if (this.m_texList != texList) {
      this.m_texDataEnabled = false;

      if (texList != null) {
        this.m_texListLen = texList.length;
      } else {
        this.m_texListLen = 0;
      }

      let i = 0;

      if (this.m_texList != null) {
        for (; i < this.m_texList.length; ++i) {
          this.m_texList[i].__$detachThis();
        }
      }

      this.m_texDataEnabled = true;
      this.m_texList = texList;

      if (this.m_texList != null) {
        let key = 31;

        for (i = 0; i < this.m_texList.length; ++i) {
          key = key * 131 + this.m_texList[i].getUid();

          this.m_texList[i].__$attachThis();

          if (!this.m_texList[i].isDataEnough()) {
            this.m_texDataEnabled = false;
          }
        }

        this.__$troMid = key;
      }
    }
  }

  setTextureAt(index, tex) {
    if (index >= 0 && tex != null) {
      let texList = this.m_texList;
      let len = texList.length;

      if (texList != null && texList[index] != tex && index < len && len > 0) {
        texList = texList.slice(0);

        texList[index].__$detachThis();

        texList[index] = tex;
        this.m_texDataEnabled = tex.isDataEnough();

        tex.__$attachThis();

        let key = 31;

        for (let i = 0; i < len; ++i) {
          key = key * 131 + texList[i].getUid();
        }

        this.__$troMid = key;
        this.m_texList = texList;
      }
    }
  }

  getTextureList() {
    return this.m_texList;
  }

  getTextureAt(index) {
    return this.m_texList[index];
  }

  getTextureTotal() {
    return this.m_texListLen;
  }

  getShdTexTotal() {
    if (this.m_shdData != null) {
      return this.m_shdData.getTexTotal();
    }

    return 0;
  }

  texDataEnabled() {
    if (this.m_texList != null) {
      if (this.m_texDataEnabled) {
        return true;
      }

      let boo = true;
      let texList = this.m_texList;

      for (let i = 0; i < this.m_texListLen; ++i) {
        if (!texList[i].isDataEnough()) {
          boo = false;
          break;
        }
      }

      this.m_texDataEnabled = boo;
      return boo;
    } else {
      if (this.m_shdData != null && this.m_shdData.getTexTotal() > 0) {
        console.warn("this material(" + this.m_shdData.getUniqueShaderName() + ") texList is null, need " + this.m_shdData.getTexTotal() + " textures.");
      }
    }

    return false;
  }

  createSharedUniforms() {
    return this.m_sharedUniforms;
  }

  createSharedUniformsData() {
    return null;
  }

  createSelfUniformData() {
    return this.m_shaderUniformData;
  } //synchronism ubo data or other displayEntity data


  updateSelfData(ro) {}

  hasTexture() {
    return this.m_shdData.haveTexture();
  }

  getBufSortFormat() {
    //trace("null != m_shdData: "+(null != m_shdData));
    return this.m_shdData != null ? this.m_shdData.getLayoutBit() : 0x0;
  }

  getBufTypeList() {
    return this.m_shdData != null ? this.m_shdData.getLocationTypes() : null;
  }

  getBufSizeList() {
    return this.m_shdData != null ? this.m_shdData.getAttriSizeList() : null;
  }

  __$attachThis() {
    ++this.m_attachCount; //console.log("MaterialBase::__$attachThis() this.m_attachCount: "+this.m_attachCount);
  }

  __$detachThis() {
    --this.m_attachCount; //console.log("MaterialBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);

    if (this.m_attachCount < 1) {
      this.m_attachCount = 0;
    }
  }

  getAttachCount() {
    return this.m_attachCount;
  }

  destroy() {
    this.m_sharedUniforms = null;
    this.m_shaderUniformData = null;
    this.pipeTypes = null;

    if (this.getAttachCount() < 1) {
      if (this.m_texList != null) {
        for (let i = 0; i < this.m_texList.length; ++i) {
          this.m_texList[i].__$detachThis();
        }
      }

      this.m_shdData = null;
      this.m_texList = null;
      this.m_texDataEnabled = false;
      this.__$troMid = 0;

      if (this.__$uniform != null) {
        this.__$uniform.destroy();

        this.__$uniform = null;
      }
    }
  }

  toString() {
    return "[MaterialBase()]";
  }

}

exports.default = MaterialBase;

/***/ }),

/***/ "11e6":
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

class RSEntityFlag {
  static AddContainerFlag(flag) {
    //return flag | RSEntityFlag.CONTAINER_FLAG;
    return flag | 0x80000000;
  }

  static RemoveContainerFlag(flag) {
    //return flag & RSEntityFlag.CONTAINER_NOT_FLAG;
    return flag & -0x80000001;
  }

  static AddSpaceUid(flag, rawUid) {
    return flag & -0x100000 | rawUid;
  }

  static RemoveSpaceUid(flag) {
    //return flag & RSEntityFlag.SPACE_NOT_FLAG;
    return flag & -0x100000;
  }

  static GetSpaceUid(flag) {
    //return flag & RSEntityFlag.SPACE_FLAG;
    return flag & 0xFFFFF;
  }

  static AddRendererUid(flag, rawUid) {
    return flag & -0x7f00001 | rawUid << 20;
  }

  static RemoveRendererUid(flag) {
    //return flag | RSEntityFlag.RENDERER_UID_FLAG;
    return flag | 0x7F00000;
  }

  static GetRendererUid(flag) {
    //return (flag & RSEntityFlag.RENDERER_UID_FLAG)>>20;
    flag = (flag & 0x7F00000) >> 20;
    return flag < 127 ? flag : -1;
  }

  static TestRendererUid(flag) {
    //return (flag & RSEntityFlag.RENDERER_UID_FLAG)>>20;
    flag = (flag & 0x7F00000) >> 20;
    return flag < 127;
  }

  static AddSortEnabled(flag) {
    //return flag | RSEntityFlag.SORT_FLAG;
    return flag | 0x40000000;
  }

  static RemoveSortEnabled(flag) {
    //return flag & RSEntityFlag.SORT_NOT_FLAG;
    return flag & -0x40000001;
  }

  static TestSortEnabled(flag) {
    //return (flag & RSEntityFlag.SORT_FLAG) == RSEntityFlag.SORT_FLAG;
    return (flag & 0x40000000) == 0x40000000;
  }

  static AddRendererLoad(flag) {
    //return flag | RSEntityFlag.RENDERER_LOAD_FLAG;
    return flag | 0x30000000;
  }

  static RemoveRendererLoad(flag) {
    //return flag & RSEntityFlag.RENDERER_LOAD_NOT_FLAG;
    return flag & -0x30000001;
  }

  static TestSpaceContains(flag) {
    return (0xFFFFF & flag) > 0;
  }

  static TestSpaceEnabled(flag) {
    return (0xFFFFF & flag) < 1;
  }

  static TestSpaceEnabled2(flag) {
    return (0xFFFFF & flag) < 1 && (0x80000000 & flag) != 0x80000000;
  }

  static TestContainerEnabled(flag) {
    //return (RSEntityFlag.RENDERER_UID_FLAG & flag) == RSEntityFlag.RENDERER_UID_FLAG && (RSEntityFlag.CONTAINER_FLAG & flag) != RSEntityFlag.CONTAINER_FLAG;
    return (0x7F00000 & flag) == 0x7F00000 && (0x80000000 & flag) != 0x80000000;
  }

  static TestRendererEnabled(flag) {
    //return (RSEntityFlag.RENDERER_ADN_LOAD_FLAG & flag) == RSEntityFlag.RENDERER_UID_FLAG && (RSEntityFlag.CONTAINER_FLAG & flag) != RSEntityFlag.CONTAINER_FLAG;
    return (0x37F00000 & flag) == 0x7F00000 && (0x80000000 & flag) != 0x80000000;
  }

}

RSEntityFlag.DEFAULT = 0x7f00000; // 第27位存放是否在container里面
// 在 container 内

RSEntityFlag.CONTAINER_FLAG = 0x80000000; // (1<<27)
// 没在 container 内

RSEntityFlag.CONTAINER_NOT_FLAG = -0x80000001; //~(0x80000000), ~(1<<27)
// 第0位到第19位总共20位存放自身在space中的 index id(1 到 1048575(0xFFFFF), 但是不会包含0xFFFFF)

RSEntityFlag.SPACE_FLAG = 0xFFFFF;
RSEntityFlag.SPACE_NOT_FLAG = -0x100000; // ~0xFFFFF;
// 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others),
// 最多可以支持同时构建64个renderer instance

RSEntityFlag.RENDERER_UID_FLAG = 0x7F00000; // (1<<20 | 1<<21 | 1<<22 | 1<<23 | 1<<24 | 1<<25 | 1<<26);

RSEntityFlag.RENDERER_UID_NOT_FLAG = -0x7f00001; // ~0x7F00000;

RSEntityFlag.RENDERER_UID_INVALID = 127; // ~0x7F00000;
//0x40000000
// 第30位存放 是否渲染运行时排序(rendering sort enabled) 的相关信息

RSEntityFlag.SORT_FLAG = 0x40000000; // (1<<30);

RSEntityFlag.SORT_NOT_FLAG = -0x40000001; // ~0x40000000;
// 第28位开始到29位总共2位存放renderer 载入状态 的相关信息

RSEntityFlag.RENDERER_LOAD_FLAG = 0x30000000; // (1<<28 | 1<<29);

RSEntityFlag.RENDERER_LOAD_NOT_FLAG = -0x30000001; // ~0x30000000;

RSEntityFlag.RENDERER_ADN_LOAD_FLAG = 0x37F00000; // 0x7f00000 | 0x30000000;

exports.default = RSEntityFlag;

/***/ }),

/***/ "1216":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const Color4_1 = __importDefault(__webpack_require__("3930"));

const FrameBufferType_1 = __importDefault(__webpack_require__("baae"));

const RenderFilter_1 = __importDefault(__webpack_require__("722e"));

const RenderMaskBitfield_1 = __importDefault(__webpack_require__("8333"));

const FrameBufferObject_1 = __importDefault(__webpack_require__("6d49"));

const RenderConst_1 = __webpack_require__("e08e");

const TextureConst_1 = __webpack_require__("8d98");

const RenderColorMask_1 = __webpack_require__("070b");

const RenderStateObject_1 = __webpack_require__("a5ba");

const RendererState_1 = __importDefault(__webpack_require__("29ef"));

const AABB2D_1 = __importDefault(__webpack_require__("e2fe"));

class RenderAdapter {
  constructor(rcuid, texResource) {
    // renderer context uid
    this.m_rcuid = 0;
    this.m_texResource = null;
    this.m_gl = null;
    this.m_fontFaceFlipped = false; // default ccw

    this.m_colorMask = {
      mr: true,
      mg: true,
      mb: true,
      ma: true
    };
    this.m_rcontext = null;
    this.m_clearMask = 0x0;
    this.m_fboBuf = null;
    this.m_fboIndex = 0;
    this.m_fboType = FrameBufferType_1.default.FRAMEBUFFER;
    this.m_fboBufList = [null, null, null, null, null, null, null, null];
    this.m_fboClearBoo = true;
    this.m_fboViewportRectBoo = false;
    this.m_polygonOffsetFlag = false;
    this.m_polygonOffset = false;
    this.m_clearDepth = 1.0;
    this.m_preDepth = 0.0;
    this.m_viewPortRect = new AABB2D_1.default(0, 0, 800, 600);
    this.m_fboViewportRect = new AABB2D_1.default(0, 0, 800, 600);
    this.m_fboSizeFactor = 1.0;
    this.m_clearStencil = 0x0;
    this.m_fboBiltRectData = new Uint16Array(8);
    this.m_fboViewportRectData = new Uint16Array(4);
    this.m_activeAttachmentTotal = 1;
    this.m_scissorEnabled = false;
    this.m_rState = null;
    this.m_webglVer = 2;
    this.bgColor = new Color4_1.default();
    this.uViewProbe = null;
    this.m_devPRatio = 1.0;
    this.m_viewportUnlock = true;
    this.m_synFBOSizeWithViewport = false;
    this.m_texResource = texResource;
    this.m_rcuid = rcuid;
  }

  initialize(context, param, rState, uViewProbe) {
    if (this.m_rcontext == null) {
      this.m_webglVer = context.getWebGLVersion();
      this.m_rState = rState;
      this.m_rcontext = context;
      this.m_gl = context.getRC();
      this.m_gl.disable(this.m_gl.SCISSOR_TEST);
      if (context.isDepthTestEnabled()) this.m_gl.enable(this.m_gl.DEPTH_TEST);else this.m_gl.disable(this.m_gl.DEPTH_TEST);

      if (context.isStencilTestEnabled()) {
        this.m_gl.enable(this.m_gl.STENCIL_TEST);
      } else {
        console.warn("STENCIL_TEST disable !!!");
        this.m_gl.disable(this.m_gl.STENCIL_TEST);
      }

      if (param.getPolygonOffsetEanbled()) this.enabledPolygonOffset();else this.disabledPolygonOffset();
      this.m_gl.enable(this.m_gl.CULL_FACE);
      this.m_gl.cullFace(this.m_gl.BACK);
      this.m_gl.enable(this.m_gl.BLEND);
      if (param.getDitherEanbled()) this.m_gl.enable(this.m_gl.DITHER);else this.m_gl.disable(this.m_gl.DITHER);
      this.m_gl.frontFace(this.m_gl.CCW); //m_gl.hint(m_gl.PERSPECTIVE_CORRECTION_HINT, m_gl.NICEST);	// Really Nice Perspective Calculations

      this.m_clearMask = this.m_gl.COLOR_BUFFER_BIT | this.m_gl.DEPTH_BUFFER_BIT | this.m_gl.STENCIL_BUFFER_BIT; //
      //this.m_rState = context.getRenderState();
      //console.log("RenderAdapter::initialize() finish...");

      if (this.uViewProbe == null) {
        let size = this.m_viewPortRect;
        let self = this;
        self.uViewProbe = uViewProbe;
        this.uViewProbe.setVec4DataWithArr4([size.x, size.y, size.width, size.height]);
      }
    }
  }
  /**
   * @param faceFlipped the value is true, frontFace is CW. the value is false, frontFace is CCW.
   */


  setFrontFaceFlipped(faceFlipped) {
    if (this.m_fontFaceFlipped != faceFlipped) {
      if (faceFlipped) {
        this.m_gl.frontFace(this.m_gl.CW);
      } else {
        this.m_gl.frontFace(this.m_gl.CCW);
      }

      this.m_fontFaceFlipped = faceFlipped;
    }
  }

  enabledPolygonOffset() {
    if (!this.m_polygonOffset) {
      this.m_polygonOffset = true;
      console.warn("POLYGON_OFFSET_FILL enable !!!");
      this.m_gl.enable(this.m_gl.POLYGON_OFFSET_FILL);
    }
  }

  disabledPolygonOffset() {
    if (this.m_polygonOffset) {
      this.m_polygonOffset = false;
      console.warn("POLYGON_OFFSET_FILL disable !!!");
      this.m_gl.disable(this.m_gl.POLYGON_OFFSET_FILL);
    }
  }
  /*
   * specifies the scale factors and units to calculate depth values.
   * @param factor the value is a GLfloat which sets the scale factor for the variable depth offset for each polygon. The default value is 0.
   * @param units the value is a which sets the multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. The default value is 0.
   */


  setPolygonOffset(factor, units = 0.0) {
    this.m_gl.polygonOffset(factor, units);
    this.m_polygonOffsetFlag = true;
  }
  /*
   * reset the scale factors and units value is default value(0.0).
   */


  resetPolygonOffset() {
    if (this.m_polygonOffsetFlag) {
      this.m_gl.polygonOffset(0.0, 0.0);
      this.m_polygonOffsetFlag = false;
    }
  }

  getDiv() {
    return this.m_rcontext.getDiv();
  }

  getCanvas() {
    return this.m_rcontext.getCanvas();
  }

  setClearDepth(depth) {
    this.m_clearDepth = depth;
  }

  getClearDepth() {
    return this.m_clearDepth;
  }

  setContextViewSize(pw, ph) {
    this.m_rcontext.autoSyncRenderBufferAndWindowSize = false;
    this.m_rcontext.resizeBufferSize(pw, ph);
  }

  getViewportX() {
    return this.m_rcontext.getViewportX();
  }

  getViewportY() {
    return this.m_rcontext.getViewportY();
  }

  getViewportWidth() {
    return this.m_rcontext.getViewportWidth();
  }

  getViewportHeight() {
    return this.m_rcontext.getViewportHeight();
  }

  getFBOFitWidth() {
    return this.m_rcontext.getFBOWidth();
  }

  getFBOFitHeight() {
    return this.m_rcontext.getFBOHeight();
  }

  getRCanvasWidth() {
    return this.m_rcontext.getRCanvasWidth();
  }

  getRCanvasHeight() {
    return this.m_rcontext.getRCanvasHeight();
  }

  setColorMask(mr, mg, mb, ma) {
    this.m_colorMask.mr = mr;
    this.m_colorMask.mg = mg;
    this.m_colorMask.mb = mb;
    this.m_colorMask.ma = ma;
  }

  setClearMaskClearAll() {
    this.m_clearMask = this.m_gl.COLOR_BUFFER_BIT | this.m_gl.DEPTH_BUFFER_BIT | this.m_gl.STENCIL_BUFFER_BIT;
  }

  setClearMaskClearOnlyColor() {
    this.m_clearMask = this.m_gl.COLOR_BUFFER_BIT;
  }

  setClearMaskClearOnlyDepthAndStencil() {
    this.m_clearMask = this.m_gl.DEPTH_BUFFER_BIT | this.m_gl.STENCIL_BUFFER_BIT;
  }

  setScissorRect(px, py, pw, ph) {
    if (this.m_scissorEnabled) {
      this.m_gl.scissor(px, py, pw, ph);
    }
  }

  setScissorEnabled(enabled) {
    if (enabled) {
      if (!this.m_scissorEnabled) {
        this.m_scissorEnabled = true;
        this.m_gl.enable(this.m_gl.SCISSOR_TEST);
      }
    } else if (this.m_scissorEnabled) {
      this.m_scissorEnabled = false;
      this.m_gl.disable(this.m_gl.SCISSOR_TEST);
    }
  }
  /**
   * only clear up depth buffer
   * @param depth depth buffer depth value
   */


  clearDepth(depth = 1.0) {
    this.m_clearDepth = depth;

    if (this.m_preDepth !== this.m_clearDepth) {
      this.m_preDepth = this.m_clearDepth;
      this.m_gl.clearDepth(this.m_clearDepth);
    }

    this.m_gl.clear(this.m_gl.DEPTH_BUFFER_BIT);
  }
  /**
   * only clear up color buffer
   * @param color color data
   */


  clearColor(color) {
    this.m_gl.clearColor(color.r, color.g, color.b, color.a);
    this.m_gl.clear(this.m_gl.COLOR_BUFFER_BIT);
  }

  clear() {
    // console.log("clear back buffer.");
    if (this.m_preDepth !== this.m_clearDepth) {
      this.m_preDepth = this.m_clearDepth;
      this.m_gl.clearDepth(this.m_clearDepth);
    }

    if (this.m_rcontext.isStencilTestEnabled()) {
      this.m_gl.clearStencil(this.m_clearStencil);
    }

    this.m_gl.clearColor(this.bgColor.r, this.bgColor.g, this.bgColor.b, this.bgColor.a);
    this.m_gl.clear(this.m_clearMask); //	if (this.m_rcontext.isStencilTestEnabled()) {
    //		this.m_gl.stencilMask(0x0);
    //	}
  }

  reset() {
    this.m_rState.setCullFaceMode(RenderConst_1.CullFaceMode.BACK);
    this.m_rState.setDepthTestMode(RenderConst_1.DepthTestMode.OPAQUE);
    RendererState_1.default.Reset(this.m_gl);
  }

  getRenderContext() {
    return this.m_rcontext;
  }

  renderBegin() {
    if (this.m_rcontext != null) {
      this.m_fboSizeFactor = 1.0;
      this.reseizeViewPort();
      RenderStateObject_1.RenderStateObject.Unlock();
      RenderStateObject_1.RenderStateObject.UseRenderState(RendererState_1.default.NORMAL_STATE);
      RenderColorMask_1.RenderColorMask.Unlock();
      RenderColorMask_1.RenderColorMask.UseRenderState(RenderColorMask_1.RenderColorMask.ALL_TRUE_COLOR_MASK); // for back buffer
      //this.m_gl.clearDepth(1.0);

      this.clear();
    }
  }

  updateViewPort() {
    let size = this.m_viewPortRect;
    this.uViewProbe.setVec4Data(size.x, size.y, size.width, size.height);
    this.uViewProbe.update(); //DivLog.ShowLog("reseizeFBOViewPort: " + this.m_viewX + "," + this.m_viewY + "," + this.m_viewWidth + "," + this.m_viewHeight);
    //console.log("reseizeFBOViewPort: "+this.m_viewX+","+this.m_viewY+","+this.m_viewWidth+","+this.m_viewHeight);

    this.m_gl.viewport(size.x, size.y, size.width, size.height);
  }

  checkViewPort(dstSize) {
    let srcSize = this.m_viewPortRect;
    let k = this.m_rcontext.getDevicePixelRatio();
    let boo = srcSize.testEqual(dstSize);
    boo = boo || Math.abs(this.m_devPRatio - k) > 0.01;

    if (boo) {
      this.m_devPRatio = k;
      srcSize.copyFrom(dstSize);
      this.updateViewPort();
    }
  }

  reseizeViewPort() {
    if (this.m_viewportUnlock) {
      this.checkViewPort(this.m_rcontext.getViewPortSize());
    }
  }

  reseizeFBOViewPort() {
    if (this.m_viewportUnlock) {
      this.checkViewPort(this.m_fboViewportRect);
    }
  }

  setViewProbeValue(x, y, width, height) {
    this.uViewProbe.setVec4Data(x, y, width, height);
    this.uViewProbe.update();
  }

  lockViewport() {
    this.m_viewportUnlock = false;
  }

  unlockViewport() {
    this.m_viewportUnlock = true;
  }

  renderEnd() {}

  update() {}

  updateRenderBufferSize() {
    this.m_rcontext.updateRenderBufferSize();
  }

  destroy() {
    this.m_rcontext = null;
    this.m_rState = null;
  }

  getDevicePixelRatio() {
    return this.m_rcontext.getDevicePixelRatio();
  }

  loseContext() {
    this.m_rcontext.loseContext();
  }
  /**
   * @returns return gpu context lost status
   */


  isContextLost() {
    return this.m_rcontext.isContextLost();
  } // read data format include float or unsigned byte ,etc.


  readPixels(px, py, width, height, format, dataType, pixels) {
    this.m_gl.readPixels(px, py, width, height, TextureConst_1.TextureFormat.ToGL(this.m_gl, format), TextureConst_1.TextureDataType.ToGL(this.m_gl, dataType), pixels);
  }

  setFBOViewportRect(px, py, pw, ph) {
    this.m_fboViewportRectData[0] = px;
    this.m_fboViewportRectData[1] = py;
    this.m_fboViewportRectData[2] = pw;
    this.m_fboViewportRectData[3] = ph;
    this.m_fboViewportRectBoo = true;
  }

  createFBOAt(index, fboType, pw, ph, enableDepth = false, enableStencil = false, multisampleLevel = 0) {
    if (this.m_fboBufList[index] == null) {
      if (index > 7) {
        index = 7;
      }

      this.m_fboType = fboType;
      this.m_fboBuf = new FrameBufferObject_1.default(this.m_rcuid, this.m_texResource, this.m_fboType);
      this.m_fboBuf.multisampleEnabled = multisampleLevel > 0;
      this.m_fboBuf.multisampleLevel = multisampleLevel;
      this.m_fboBuf.writeDepthEnabled = enableDepth;
      this.m_fboBuf.writeStencilEnabled = enableStencil;
      this.m_fboBuf.initialize(this.m_gl, pw, ph);
      this.m_fboBufList[index] = this.m_fboBuf;
      this.m_fboBuf.sizeFixed = true;
    }
  }

  resizeFBOAt(index, pw, ph) {
    if (index > 7) {
      index = 7;
    } else if (index < 0) {
      index = 0;
    }

    if (this.m_fboBufList[index] != null) {
      this.m_fboBufList[index].resize(pw, ph);
    }
  }

  getFBOWidthAt(index) {
    if (this.m_fboBufList[index] != null) {
      return this.m_fboBufList[index].getWidth();
    }

    return 0;
  }

  getFBOHeightAt(index) {
    if (this.m_fboBufList[index] != null) {
      return this.m_fboBufList[index].getHeight();
    }

    return 0;
  }

  synFBOSizeWithViewport() {
    this.m_synFBOSizeWithViewport = true;
  }

  asynFBOSizeWithViewport() {
    this.m_synFBOSizeWithViewport = false;
  } // 

  /**
   * if synFBOSizeWithViewport is true, fbo size = factor * view port size;
   * @param factor exmple: the value of factor is 0.5
   */


  setFBOSizeFactorWithViewPort(factor) {
    this.m_fboSizeFactor = factor;
  }

  bindFBOAt(index, fboType) {
    if (index > 7) {
      index = 7;
    } else if (index < 0) {
      index = 0;
    }

    this.m_fboBuf = this.m_fboBufList[index];

    if (this.m_fboBuf != null) {
      this.m_fboIndex = index;
      this.m_fboType = fboType;
      this.m_fboBuf.bind(fboType);
      this.m_fboClearBoo = true;
    } else {
      throw Error("Fatal Error!!! this.m_fboBuf == null.");
    }
  }

  clearFBODepthAt(index, clearDepth = 1.0) {
    let fboBuf = this.m_fboBufList[index];

    if (fboBuf != null) {
      fboBuf.clearOnlyDepth(clearDepth);
    }
  }

  resetFBOAttachmentMask(boo) {
    if (this.m_fboBuf != null) {
      this.m_fboBuf.resetAttachmentMask(boo);
    }
  }

  setFBOAttachmentMaskAt(index, boo) {
    if (this.m_fboBuf != null) {
      this.m_fboBuf.setAttachmentMaskAt(index, boo);
    }
  }

  getFBOAttachmentTotal() {
    if (this.m_fboBuf != null) {
      return this.m_fboBuf.getAttachmentTotal();
    }

    return 0;
  }
  /**
   * bind a texture to fbo attachment by attachment index
   * @param texProxy  IRenderTexture instance
   * @param enableDepth  enable depth buffer yes or no
   * @param enableStencil  enable stencil buffer yes or no
   * @param attachmentIndex  fbo attachment index
   */


  setRenderToTexture(texProxy, enableDepth = false, enableStencil = false, attachmentIndex = 0) {
    if (attachmentIndex < 0 || attachmentIndex >= 8) {
      attachmentIndex = 0;
    } //console.log("attachmentIndex: ",attachmentIndex);


    if (texProxy == null && attachmentIndex == 0) {
      this.setRenderToBackBuffer(FrameBufferType_1.default.FRAMEBUFFER);
    } else {
      if (attachmentIndex == 0) {
        if (this.m_fboBuf != null) {
          if (this.m_synFBOSizeWithViewport) {
            this.m_fboBuf.initialize(this.m_gl, Math.floor(this.m_rcontext.getFBOWidth() * this.m_fboSizeFactor), Math.floor(this.m_rcontext.getFBOHeight() * this.m_fboSizeFactor));
          } else {
            if (this.m_fboViewportRectBoo) {
              this.m_fboBuf.initialize(this.m_gl, this.m_fboViewportRectData[2], this.m_fboViewportRectData[3]);
            } else if (!this.m_fboBuf.sizeFixed) {
              this.m_fboBuf.initialize(this.m_gl, texProxy.getWidth(), texProxy.getHeight());
            }
          }
        }

        if (this.m_fboIndex >= 0) {
          if (this.m_fboBuf == null) {
            this.m_fboBuf = new FrameBufferObject_1.default(this.m_rcuid, this.m_texResource, this.m_fboType);
            this.m_fboBufList[this.m_fboIndex] = this.m_fboBuf;
            this.m_fboBuf.writeDepthEnabled = enableDepth;
            this.m_fboBuf.writeStencilEnabled = enableStencil;

            if (this.m_synFBOSizeWithViewport) {
              this.m_fboBuf.initialize(this.m_gl, Math.floor(this.m_rcontext.getFBOWidth() * this.m_fboSizeFactor), Math.floor(this.m_rcontext.getFBOHeight() * this.m_fboSizeFactor));
            } else {
              if (this.m_fboViewportRectBoo) {
                this.m_fboBuf.initialize(this.m_gl, this.m_fboViewportRectData[2], this.m_fboViewportRectData[3]);
              } else {
                this.m_fboBuf.initialize(this.m_gl, texProxy.getWidth(), texProxy.getHeight());
              }
            }
          }
        }
      }

      if (this.m_fboBuf != null) {
        this.m_fboBuf.renderToTexAt(this.m_gl, texProxy, attachmentIndex); //console.log("RenderProxy::setRenderToTexture(), fbo: ",this.m_fboBuf.getFBO());
      }

      this.m_fboClearBoo = true;
    }
  }

  getActiveAttachmentTotal() {
    return this.m_activeAttachmentTotal;
  }

  getAttachmentTotal() {
    return this.m_activeAttachmentTotal;
  }

  useFBO(clearColorBoo = false, clearDepthBoo = false, clearStencilBoo = false) {
    if (this.m_fboBuf != null) {
      if (this.m_fboClearBoo) {
        this.m_fboClearBoo = false;
        this.m_fboBuf.use(this.m_gl);
        this.m_activeAttachmentTotal = this.m_fboBuf.getActiveAttachmentTotal();

        if (clearColorBoo) {
          this.m_fboBuf.clearOnlyColor(this.bgColor);
        }

        if (this.m_fboBuf.writeDepthEnabled) {
          if (this.m_fboBuf.writeStencilEnabled) {
            if (clearDepthBoo && clearStencilBoo) {
              this.m_fboBuf.clearOnlyDepthAndStencil(this.m_clearDepth, 0xffffffff);
            } else if (clearDepthBoo) {
              this.m_fboBuf.clearOnlyDepth(this.m_clearDepth);
            } else if (clearStencilBoo) {
              this.m_fboBuf.clearOnlyStencil(0xff);
            }
          } else if (clearDepthBoo) {
            this.m_fboBuf.clearOnlyDepth(this.m_clearDepth);
          }
        } else if (clearStencilBoo && this.m_fboBuf.writeStencilEnabled) {
          this.m_fboBuf.clearOnlyStencil(0xff);
        }

        if (this.m_webglVer == 1) {
          // m_gl.colorMask(m_colorMask.mr,m_colorMask.mg,m_colorMask.mb,m_colorMask.ma);
          this.m_gl.clear(this.m_clearMask);
        }

        let size = this.m_viewPortRect;
        this.m_fboBiltRectData[4] = this.m_fboBiltRectData[0] = size.x;
        this.m_fboBiltRectData[5] = this.m_fboBiltRectData[1] = size.y;
        this.m_fboBiltRectData[6] = this.m_fboBiltRectData[2] = size.getRight();
        this.m_fboBiltRectData[7] = this.m_fboBiltRectData[3] = size.getTop();

        if (this.m_fboViewportRectBoo) {
          this.m_fboViewportRectBoo = false;
          this.m_fboViewportRect.setTo(this.m_fboViewportRectData[0], this.m_fboViewportRectData[1], this.m_fboViewportRectData[2], this.m_fboViewportRectData[3]);
          this.reseizeFBOViewPort();
        } else {
          if (this.m_synFBOSizeWithViewport) {
            //console.log("this.m_fboSizeFactor: "+this.m_fboSizeFactor);
            this.m_fboViewportRect.setTo(0, 0, Math.floor(this.m_rcontext.getFBOWidth() * this.m_fboSizeFactor), Math.floor(this.m_rcontext.getFBOHeight() * this.m_fboSizeFactor));
          } else {
            if (this.m_fboBuf.isSizeChanged()) {
              this.m_fboBuf.initialize(this.m_gl, this.m_fboBuf.getWidth(), this.m_fboBuf.getHeight());
            }

            this.m_fboViewportRect.setTo(0, 0, this.m_fboBuf.getWidth(), this.m_fboBuf.getHeight());
          }

          this.reseizeFBOViewPort();
        }
      }
    }
  }

  setRenderToBackBuffer(frameBufferType = FrameBufferType_1.default.FRAMEBUFFER) {
    this.m_activeAttachmentTotal = 1;
    FrameBufferObject_1.default.BindToBackbuffer(this.m_gl, frameBufferType);
    this.reseizeViewPort();
  }

  bindFBOToDraw() {
    if (this.m_fboBuf != null) {
      this.m_fboBuf.bind(FrameBufferType_1.default.DRAW_FRAMEBUFFER);
    }
  }

  bindFBOToWrite() {
    if (this.m_fboBuf != null) {
      this.m_fboBuf.bind(FrameBufferType_1.default.READ_FRAMEBUFFER);
    }
  }

  setBlitFboSrcRect(px, py, pw, ph) {
    this.m_fboBiltRectData[0] = px;
    this.m_fboBiltRectData[1] = py;
    this.m_fboBiltRectData[2] = px + pw;
    this.m_fboBiltRectData[3] = py + ph;
  }

  setBlitFboDstRect(px, py, pw, ph) {
    this.m_fboBiltRectData[4] = px;
    this.m_fboBiltRectData[5] = py;
    this.m_fboBiltRectData[6] = px + pw;
    this.m_fboBiltRectData[7] = py + ph;
  }
  /**
   * @oaram			clearType, it is RenderProxy.COLOR or RenderProxy.DEPTH or RenderProxy.STENCIL or RenderProxy.DEPTH_STENCIL
  */


  blitFBO(readFBOIndex = 0, writeFBOIndex = 0, mask_bitfiled = RenderMaskBitfield_1.default.COLOR_BUFFER_BIT, filter = RenderFilter_1.default.NEAREST, clearType = 0, clearIndex = 0, dataArr = null) {
    if (readFBOIndex > 7) {
      readFBOIndex = 7;
    }

    if (writeFBOIndex > 7) {
      writeFBOIndex = 7;
    }

    if (readFBOIndex >= 0 && this.m_fboBufList[readFBOIndex] != null) {
      this.m_fboBufList[readFBOIndex].bind(FrameBufferType_1.default.READ_FRAMEBUFFER);
    } else {
      FrameBufferObject_1.default.BindToBackbuffer(this.m_gl, FrameBufferType_1.default.READ_FRAMEBUFFER);
    }

    if (writeFBOIndex >= 0 && this.m_fboBufList[writeFBOIndex] != null) {
      this.m_fboBufList[writeFBOIndex].bind(FrameBufferType_1.default.DRAW_FRAMEBUFFER);
    } else {
      FrameBufferObject_1.default.BindToBackbuffer(this.m_gl, FrameBufferType_1.default.DRAW_FRAMEBUFFER);
    }

    if (clearType > 0) {
      if (clearIndex < 0) {
        clearIndex = 0;
      } // clearType 默认是 gl.COLOR
      // clearIndex 默认是0
      // dataArr 默认值是 [0.0, 0.0, 0.0, 1.0]


      if (dataArr == null) {
        dataArr = [0.0, 0.0, 0.0, 1.0];
      }

      this.m_gl.clearBufferfv(clearType, clearIndex, dataArr);
    }

    let fs = this.m_fboBiltRectData; //copyTexSubImage2D 可以在gles2中代替下面的函数

    this.m_gl.blitFramebuffer(fs[0], fs[1], fs[2], fs[3], fs[4], fs[5], fs[6], fs[7], mask_bitfiled, filter);
  }

}

exports.default = RenderAdapter;

/***/ }),

/***/ "1264":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RSEntityFlag_1 = __importDefault(__webpack_require__("11e6"));

const RenderConst_1 = __webpack_require__("e08e");

const RPOUnitBuilder_1 = __webpack_require__("eca0");

class DispEntity3DManager {
  constructor(rendererUid, RODataBuilder, rpoUnitBuilder, processBuider) {
    this.m_rpoUnitBuilder = null;
    this.m_dataBuilder = null;
    this.m_processBuider = null;
    this.m_waitList = [];
    this.m_processUidList = [];
    this.m_rendererUid = -1;
    this.m_existencetotal = 0;
    this.m_rprocess = null;
    this.m_entityManaListener = null;
    this.version = 0;
    this.m_rendererUid = rendererUid;
    this.m_dataBuilder = RODataBuilder;
    this.m_rpoUnitBuilder = rpoUnitBuilder;
    this.m_processBuider = processBuider;
  }

  setListener(entityManaListener) {
    this.m_entityManaListener = entityManaListener;
  }

  isEmpty() {
    return this.m_existencetotal < 1;
  }

  isHaveEntity() {
    return this.m_existencetotal > 0;
  }

  removeEntity(entity) {
    this.m_existencetotal--; // 从所有相关process中移除这个display

    let display = entity.getDisplay();

    if (display != null && display.__$$runit != null) {
      let puid = display.__$ruid;
      let po = this.m_rpoUnitBuilder.getRCRPObj(puid);

      if (po != null) {
        if (po.count > 0) {
          if (po.count < 2) {
            if (po.rprocessUid > -1) {
              this.m_rprocess = this.m_processBuider.getNodeByUid(po.rprocessUid);
              this.m_rprocess.removeDisp(display);
              po.rprocessUid = -1;
            }
          } else {
            let len = RPOUnitBuilder_1.RCRPObj.RenerProcessMaxTotal;

            for (let i = 0; i < len; ++i) {
              if ((po.idsFlag & 1 << i) > 0) {
                // the value of list[i] is the uid of a node;
                this.m_rprocess = this.m_processBuider.getNodeByUid(i);
                this.m_rprocess.removeDisp(display);
              }
            }
          }
        }
      } else {
        this.m_rprocess = this.m_processBuider.getNodeByUid(display.__$$runit.getRPROUid());
        this.m_rprocess.removeDisp(display);
      }

      if (po.count == 0) {
        //console.log("DispEntity3DManager::removeEntity(), remove a entity from all processes.");
        if (display.__$$rsign != RenderConst_1.DisplayRenderSign.LIVE_IN_RENDERER) {
          // error!!!
          console.error("DispEntity3DManager::removeEntity(), Error: display.__$$rsign != RODisplay.LIVE_IN_RENDERER.");
        }

        display.__$$rsign = RenderConst_1.DisplayRenderSign.NOT_IN_RENDERER; // 准备移除和当前 display 对应的 RPOUnit

        this.m_rpoUnitBuilder.restoreByUid(puid);
      } else {
        console.warn("Error: DispEntity3DManager::removeEntity(), remove a entity from all processes failed.");
      }

      this.version++;
    }

    entity.__$rseFlag = RSEntityFlag_1.default.RemoveRendererUid(entity.__$rseFlag);
    entity.__$rseFlag = RSEntityFlag_1.default.RemoveRendererLoad(entity.__$rseFlag);
    entity.__$rseFlag = RSEntityFlag_1.default.RemoveSortEnabled(entity.__$rseFlag);

    if (this.m_entityManaListener != null) {
      this.m_entityManaListener.removeFromRenderer(entity, this.m_rendererUid, -1);
    }
  }

  addEntity(entity, processUid, deferred = false) {
    if (entity != null) {
      //console.log("add entity into entity 3d manager.");
      let disp = entity.getDisplay();

      if (disp != null) {
        if (disp.__$$rsign == RenderConst_1.DisplayRenderSign.LIVE_IN_RENDERER) {
          if (!this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid, processUid)) {
            //console.log("DispEntity3DManager::addEntity(), A, this display("+disp.__$ruid+") has existed in processid("+processUid+").");
            return;
          }
        }

        this.m_rprocess = this.m_processBuider.getNodeByUid(processUid);
        entity.__$rseFlag = this.m_rprocess.getSortEnabled() ? RSEntityFlag_1.default.AddSortEnabled(entity.__$rseFlag) : RSEntityFlag_1.default.RemoveSortEnabled(entity.__$rseFlag);

        if (deferred) {
          if (disp.__$$rsign == RenderConst_1.DisplayRenderSign.NOT_IN_RENDERER) {
            disp.__$$rsign = RenderConst_1.DisplayRenderSign.GO_TO_RENDERER;
          }

          entity.__$rseFlag = RSEntityFlag_1.default.AddRendererLoad(entity.__$rseFlag);
          entity.__$rseFlag = RSEntityFlag_1.default.AddRendererUid(entity.__$rseFlag, this.m_rendererUid);
          this.m_waitList.push(entity);
          this.m_processUidList.push(processUid); //console.log("DispEntity3DManager::addEntity(), B, this display("+disp+") has existed in processid("+processUid+").");
        } else {
          // 检查数据完整性
          if (this.testValidData(entity)) {
            this.ensureAdd(entity, disp, processUid);
          } else {
            //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
            if (disp.__$$rsign == RenderConst_1.DisplayRenderSign.NOT_IN_RENDERER) {
              disp.__$$rsign = RenderConst_1.DisplayRenderSign.GO_TO_RENDERER;
            }

            entity.__$rseFlag = RSEntityFlag_1.default.AddRendererLoad(entity.__$rseFlag);
            this.m_waitList.push(entity);
            this.m_processUidList.push(processUid);
          }
        }
      } else {
        entity.__$rseFlag = RSEntityFlag_1.default.AddRendererUid(entity.__$rseFlag, this.m_rendererUid);
      }
    }

    return false;
  }

  testValidData(entity) {
    if (entity.getMaterial() != null && entity.hasMesh()) {
      if (entity.getMaterial().hasShaderData()) {
        return true;
      } else if (entity.getMaterial().getCodeBuf() != null) {
        entity.activeDisplay();
      }
    }

    return false;
  }

  ensureAdd(entity, disp, processUid) {
    entity.update();
    entity.__$rseFlag = RSEntityFlag_1.default.AddRendererUid(entity.__$rseFlag, this.m_rendererUid);
    entity.__$rseFlag = RSEntityFlag_1.default.RemoveRendererLoad(entity.__$rseFlag);

    entity.__$setRenderProxy(this.m_dataBuilder.getRenderProxy());

    this.m_existencetotal++;

    if (disp.__$$rsign == RenderConst_1.DisplayRenderSign.NOT_IN_RENDERER) {
      disp.__$$rsign = RenderConst_1.DisplayRenderSign.GO_TO_RENDERER;
    }

    this.m_rprocess = this.m_processBuider.getNodeByUid(processUid); //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");

    if (disp.__$ruid > -1) {
      this.m_rprocess.addDisp(disp);
    } else {
      if (this.m_dataBuilder.buildGpuDisp(disp)) {
        this.m_rprocess.addDisp(disp);
      }
    }

    if (this.m_entityManaListener != null) {
      this.m_entityManaListener.addToRenderer(entity, this.m_rendererUid, processUid);
    }

    if (entity.getGlobalBounds() != null) {
      disp.__$$runit.bounds = entity.getGlobalBounds();
      disp.__$$runit.pos = disp.__$$runit.bounds.center;
    }

    this.version++;
  }

  updateWaitList() {
    let len = this.m_waitList.length;
    let entity = null;
    let disp = null;

    for (let i = 0; i < len; ++i) {
      entity = this.m_waitList[i];

      if ((RSEntityFlag_1.default.RENDERER_LOAD_FLAG & entity.__$rseFlag) == RSEntityFlag_1.default.RENDERER_LOAD_FLAG) {
        if (this.testValidData(entity)) {
          disp = entity.getDisplay();

          if (disp.__$$rsign == RenderConst_1.DisplayRenderSign.LIVE_IN_RENDERER) {
            if (!this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid, this.m_processUidList[i])) {
              //console.log("DispEntity3DManager::update(), this display("+disp.__$ruid+") has existed in processid("+m_processUidList[i]+").");
              this.m_waitList.splice(i, 1);
              this.m_processUidList.splice(i, 1);
              --len;
              --i;
              continue;
            }
          }

          this.ensureAdd(entity, disp, this.m_processUidList[i]);
          this.m_waitList.splice(i, 1);
          this.m_processUidList.splice(i, 1);
          --len;
          --i;
        }
      } else {
        disp = entity.getDisplay();

        if (disp != null && disp.__$$rsign == RenderConst_1.DisplayRenderSign.GO_TO_RENDERER) {
          disp.__$$rsign = RenderConst_1.DisplayRenderSign.NOT_IN_RENDERER;
        } //console.log("DispEntity3DManager::update(), remove a ready entity.");


        entity.__$rseFlag = RSEntityFlag_1.default.RemoveRendererLoad(entity.__$rseFlag);
        entity.__$rseFlag = RSEntityFlag_1.default.RemoveRendererUid(entity.__$rseFlag);
        entity.__$rseFlag = RSEntityFlag_1.default.RemoveSortEnabled(entity.__$rseFlag);
        this.m_waitList.splice(i, 1);
        this.m_processUidList.splice(i, 1);
        --len;
        --i;

        if (this.m_entityManaListener != null) {
          this.m_entityManaListener.removeFromRenderer(entity, this.m_rendererUid, -1);
        }
      }
    }
  }

  update() {
    if (this.m_waitList.length > 0) {
      this.updateWaitList();
    }

    this.m_dataBuilder.update();
  }

}

exports.default = DispEntity3DManager;

/***/ }),

/***/ "1710":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// mouse or touch event

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const EventBase_1 = __importDefault(__webpack_require__("a996"));

class MouseEvent extends EventBase_1.default {
  constructor() {
    super(); // // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)
    // phase: number = 0;
    // // 事件类型
    // type: number = 0;//MouseEvent.MOUSE_DOWN;
    // // 事件发送者
    // target: any = null;
    // 物体空间坐标

    this.lpos = new Vector3D_1.default(); // 世界坐标

    this.wpos = new Vector3D_1.default();
    /**
     * the direction on a ray line in the world space
     */

    this.raytv = new Vector3D_1.default(1.0, 0.0, 0.0);
    /**
     * the point on a ray line in the world space
     */

    this.raypv = new Vector3D_1.default(0.0, 0.0, 0.0); // 屏幕空间鼠标坐标,和gpu空间对齐

    this.mouseX = 0.0;
    this.mouseY = 0.0; // 屏幕空间页面鼠标坐标

    this.mouseViewX = 0.0;
    this.mouseViewY = 0.0; // 例如多点触摸的时候就会有这个数据

    this.posArray = null; // 鼠标滚轮速度

    this.wheelDeltaY = 0;
  }

  static GetMouseEvtTypeValueBase() {
    return 5001;
  }

  static GetMouseEvtTypeValuesTotal() {
    return 18;
  }

  getClassType() {
    return MouseEvent.EventClassType;
  }

  toString() {
    return "[MouseEvent]";
  }

}

MouseEvent.EventClassType = 1002;
MouseEvent.MOUSE_DOWN = 5001;
MouseEvent.MOUSE_UP = 5002;
MouseEvent.MOUSE_RIGHT_UP = 5003;
MouseEvent.MOUSE_RIGHT_DOWN = 5004;
MouseEvent.MOUSE_MOVE = 5005;
MouseEvent.MOUSE_WHEEL = 5006;
MouseEvent.MOUSE_OVER = 5007;
MouseEvent.MOUSE_OUT = 5008;
MouseEvent.MOUSE_CLICK = 5009;
MouseEvent.MOUSE_RIGHT_CLICK = 5010;
MouseEvent.MOUSE_DOUBLE_CLICK = 5011;
MouseEvent.MOUSE_CANCEL = 5012;
MouseEvent.MOUSE_MULTI_DOWN = 5013;
MouseEvent.MOUSE_MULTI_UP = 5014;
MouseEvent.MOUSE_MULTI_MOVE = 5015;
MouseEvent.MOUSE_BG_DOWN = 5016; //  mouse down do not hit any 3d object, only in stage

MouseEvent.MOUSE_BG_UP = 5017; //  mouse up do not hit any 3d object, only in stage

MouseEvent.MOUSE_BG_CLICK = 5018; //  mouse up do not hit any 3d object, only in stage

exports.default = MouseEvent;

/***/ }),

/***/ "18c7":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17")); // import Float32Data from "../../vox/base/Float32Data";


const OrientationType_1 = __importDefault(__webpack_require__("abdb"));

class Matrix4 {
  constructor(pfs32 = null, index = 0) {
    this.m_uid = -1;
    this.m_index = 0;
    this.m_fs32 = null;
    this.m_localFS32 = null;
    this.m_index = index;

    if (pfs32 != null) {
      this.m_uid = Matrix4.s_uid++;
      this.m_fs32 = pfs32;
      this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
    } else {
      this.m_uid = Matrix4.s_isolatedUid++;
      this.m_fs32 = new Float32Array(16);
      this.m_fs32.set(Matrix4.s_InitData, 0);
      this.m_localFS32 = this.m_fs32;
    }
  }

  setData(data) {
    if (data.length == 16) {
      this.m_localFS32.set(data);
    }
  }

  getCapacity() {
    return 16;
  }

  GetMaxUid() {
    return Matrix4.s_uid;
  }

  getUid() {
    return this.m_uid;
  }

  getLocalFS32() {
    return this.m_localFS32;
  }

  getFS32() {
    return this.m_fs32;
  }

  getFSIndex() {
    return this.m_index;
  }

  identity() {
    this.m_localFS32.set(Matrix4.s_InitData, 0);
  }

  determinant() {
    return (this.m_localFS32[0] * this.m_localFS32[5] - this.m_localFS32[4] * this.m_localFS32[1]) * (this.m_localFS32[10] * this.m_localFS32[15] - this.m_localFS32[14] * this.m_localFS32[11]) - (this.m_localFS32[0] * this.m_localFS32[9] - this.m_localFS32[8] * this.m_localFS32[1]) * (this.m_localFS32[6] * this.m_localFS32[15] - this.m_localFS32[14] * this.m_localFS32[7]) + (this.m_localFS32[0] * this.m_localFS32[13] - this.m_localFS32[12] * this.m_localFS32[1]) * (this.m_localFS32[6] * this.m_localFS32[11] - this.m_localFS32[10] * this.m_localFS32[7]) + (this.m_localFS32[4] * this.m_localFS32[9] - this.m_localFS32[8] * this.m_localFS32[5]) * (this.m_localFS32[2] * this.m_localFS32[15] - this.m_localFS32[14] * this.m_localFS32[3]) - (this.m_localFS32[4] * this.m_localFS32[13] - this.m_localFS32[12] * this.m_localFS32[5]) * (this.m_localFS32[2] * this.m_localFS32[11] - this.m_localFS32[10] * this.m_localFS32[3]) + (this.m_localFS32[8] * this.m_localFS32[13] - this.m_localFS32[12] * this.m_localFS32[9]) * (this.m_localFS32[2] * this.m_localFS32[7] - this.m_localFS32[6] * this.m_localFS32[3]);
  }

  append(lhs) {
    let lfs32 = lhs.getLocalFS32();
    let sfs32 = this.m_localFS32;
    let m111 = sfs32[0];
    let m121 = sfs32[4];
    let m131 = sfs32[8];
    let m141 = sfs32[12];
    let m112 = sfs32[1];
    let m122 = sfs32[5];
    let m132 = sfs32[9];
    let m142 = sfs32[13];
    let m113 = sfs32[2];
    let m123 = sfs32[6];
    let m133 = sfs32[10];
    let m143 = sfs32[14];
    let m114 = sfs32[3];
    let m124 = sfs32[7];
    let m134 = sfs32[11];
    let m144 = sfs32[15];
    let m211 = lfs32[0];
    let m221 = lfs32[4];
    let m231 = lfs32[8];
    let m241 = lfs32[12];
    let m212 = lfs32[1];
    let m222 = lfs32[5];
    let m232 = lfs32[9];
    let m242 = lfs32[13];
    let m213 = lfs32[2];
    let m223 = lfs32[6];
    let m233 = lfs32[10];
    let m243 = lfs32[14];
    let m214 = lfs32[3];
    let m224 = lfs32[7];
    let m234 = lfs32[11];
    let m244 = lfs32[15];
    sfs32[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
    sfs32[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
    sfs32[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
    sfs32[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
    sfs32[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
    sfs32[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
    sfs32[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
    sfs32[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
    sfs32[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
    sfs32[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
    sfs32[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
    sfs32[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
    sfs32[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
    sfs32[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
    sfs32[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
    sfs32[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
  }

  append3x3(lhs) {
    let lfs32 = lhs.getLocalFS32();
    let sfs32 = this.m_localFS32;
    let m111 = sfs32[0];
    let m121 = sfs32[4];
    let m131 = sfs32[8];
    let m112 = sfs32[1];
    let m122 = sfs32[5];
    let m132 = sfs32[9];
    let m113 = sfs32[2];
    let m123 = sfs32[6];
    let m133 = sfs32[10];
    let m211 = lfs32[0];
    let m221 = lfs32[4];
    let m231 = lfs32[8];
    let m212 = lfs32[1];
    let m222 = lfs32[5];
    let m232 = lfs32[9];
    let m213 = lfs32[2];
    let m223 = lfs32[6];
    let m233 = lfs32[10];
    sfs32[0] = m111 * m211 + m112 * m221 + m113 * m231;
    sfs32[1] = m111 * m212 + m112 * m222 + m113 * m232;
    sfs32[2] = m111 * m213 + m112 * m223 + m113 * m233;
    sfs32[4] = m121 * m211 + m122 * m221 + m123 * m231;
    sfs32[5] = m121 * m212 + m122 * m222 + m123 * m232;
    sfs32[6] = m121 * m213 + m122 * m223 + m123 * m233;
    sfs32[8] = m131 * m211 + m132 * m221 + m133 * m231;
    sfs32[9] = m131 * m212 + m132 * m222 + m133 * m232;
    sfs32[10] = m131 * m213 + m132 * m223 + m133 * m233;
  }

  appendRotationPivot(radian, axis, pivotPoint = null) {
    if (pivotPoint == null) {
      pivotPoint = Vector3D_1.default.Z_AXIS;
    }

    Matrix4.s_tMat4.identity();
    Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    Matrix4.s_tMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
    this.append(Matrix4.s_tMat4);
  }

  appendRotation(radian, axis) {
    Matrix4.s_tMat4.identity();
    Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    this.append(Matrix4.s_tMat4);
  }

  appendRotationX(radian) {
    Matrix4.s_tMat4.rotationX(radian);
    this.append3x3(Matrix4.s_tMat4);
  }

  appendRotationY(radian) {
    Matrix4.s_tMat4.rotationY(radian);
    this.append3x3(Matrix4.s_tMat4);
  }

  appendRotationZ(radian) {
    Matrix4.s_tMat4.rotationZ(radian);
    this.append3x3(Matrix4.s_tMat4);
  } // 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)


  appendRotationEulerAngle(radianX, radianY, radianZ) {
    Matrix4.s_tMat4.rotationY(radianY);
    this.append3x3(Matrix4.s_tMat4);
    Matrix4.s_tMat4.rotationX(radianX);
    this.append3x3(Matrix4.s_tMat4);
    Matrix4.s_tMat4.rotationZ(radianZ);
    this.append3x3(Matrix4.s_tMat4);
  }

  setScaleXYZ(xScale, yScale, zScale) {
    let sfs32 = this.m_localFS32;
    sfs32[0] = xScale;
    sfs32[5] = yScale;
    sfs32[10] = zScale;
  }

  setRotationEulerAngle(radianX, radianY, radianZ) {
    let sfs32 = this.m_localFS32; //let sx:number = sfs32[0];
    //let sy:number = sfs32[5];
    //let sz:number = sfs32[10];

    let cosX = Math.cos(radianX);
    let sinX = Math.sin(radianX);
    let cosY = Math.cos(radianY);
    let sinY = Math.sin(radianY);
    let cosZ = Math.cos(radianZ);
    let sinZ = Math.sin(radianZ);
    let cosZsinY = cosZ * sinY;
    let sinZsinY = sinZ * sinY;
    let cosYscaleX = cosY * sfs32[0];
    let sinXscaleY = sinX * sfs32[5];
    let cosXscaleY = cosX * sfs32[5];
    let cosXscaleZ = cosX * sfs32[10];
    let sinXscaleZ = sinX * sfs32[10];
    sfs32[1] = sinZ * cosYscaleX;
    sfs32[2] = -sinY * sfs32[0];
    sfs32[0] = cosZ * cosYscaleX;
    sfs32[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
    sfs32[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
    sfs32[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
    sfs32[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
    sfs32[6] = cosY * sinXscaleY;
    sfs32[10] = cosY * cosXscaleZ;
  }

  setRotationEulerAngle2(cosX, sinX, cosY, sinY, cosZ, sinZ) {
    let sfs32 = this.m_localFS32; //let sx:number = sfs32[0];
    //let sy:number = sfs32[5];
    //let sz:number = sfs32[10];
    //	let cosX: number = Math.cos(radianX);
    //	let sinX:number = Math.sin(radianX);
    //	let cosY:number = Math.cos(radianY);
    //	let sinY:number = Math.sin(radianY);
    //	let cosZ:number = Math.cos(radianZ);
    //	let sinZ:number = Math.sin(radianZ);

    let cosZsinY = cosZ * sinY;
    let sinZsinY = sinZ * sinY;
    let cosYscaleX = cosY * sfs32[0];
    let sinXscaleY = sinX * sfs32[5];
    let cosXscaleY = cosX * sfs32[5];
    let cosXscaleZ = cosX * sfs32[10];
    let sinXscaleZ = sinX * sfs32[10];
    sfs32[1] = sinZ * cosYscaleX;
    sfs32[2] = -sinY * sfs32[0];
    sfs32[0] = cosZ * cosYscaleX;
    sfs32[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
    sfs32[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
    sfs32[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
    sfs32[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
    sfs32[6] = cosY * sinXscaleY;
    sfs32[10] = cosY * cosXscaleZ;
  }

  setTranslationXYZ(px, py, pz) {
    this.m_localFS32[12] = px;
    this.m_localFS32[13] = py;
    this.m_localFS32[14] = pz;
  }

  setTranslation(v3) {
    this.m_localFS32[12] = v3.x;
    this.m_localFS32[13] = v3.y;
    this.m_localFS32[14] = v3.z;
  }

  appendScaleXYZ(xScale, yScale, zScale) {
    let sfs32 = this.m_localFS32;
    sfs32[0] *= xScale;
    sfs32[1] *= xScale;
    sfs32[2] *= xScale;
    sfs32[3] *= xScale;
    sfs32[4] *= yScale;
    sfs32[5] *= yScale;
    sfs32[6] *= yScale;
    sfs32[7] *= yScale;
    sfs32[8] *= zScale;
    sfs32[9] *= zScale;
    sfs32[10] *= zScale;
    sfs32[11] *= zScale;
  }

  appendScaleXY(xScale, yScale) {
    this.m_localFS32[0] *= xScale;
    this.m_localFS32[1] *= xScale;
    this.m_localFS32[2] *= xScale;
    this.m_localFS32[3] *= xScale;
    this.m_localFS32[4] *= yScale;
    this.m_localFS32[5] *= yScale;
    this.m_localFS32[6] *= yScale;
    this.m_localFS32[7] *= yScale;
  }

  appendTranslationXYZ(px, py, pz) {
    this.m_localFS32[12] += px;
    this.m_localFS32[13] += py;
    this.m_localFS32[14] += pz;
  }

  appendTranslation(v3) {
    this.m_localFS32[12] += v3.x;
    this.m_localFS32[13] += v3.y;
    this.m_localFS32[14] += v3.z;
  }

  copyColumnFrom(column_index, v3) {
    switch (column_index) {
      case 0:
        {
          this.m_localFS32[0] = v3.x;
          this.m_localFS32[1] = v3.y;
          this.m_localFS32[2] = v3.z;
          this.m_localFS32[3] = v3.w;
        }
        break;

      case 1:
        {
          this.m_localFS32[4] = v3.x;
          this.m_localFS32[5] = v3.y;
          this.m_localFS32[6] = v3.z;
          this.m_localFS32[7] = v3.w;
        }
        break;

      case 2:
        {
          this.m_localFS32[8] = v3.x;
          this.m_localFS32[9] = v3.y;
          this.m_localFS32[10] = v3.z;
          this.m_localFS32[11] = v3.w;
        }
        break;

      case 3:
        {
          this.m_localFS32[12] = v3.x;
          this.m_localFS32[13] = v3.y;
          this.m_localFS32[14] = v3.z;
          this.m_localFS32[15] = v3.w;
        }
        break;

      default:
        break;
    }
  }

  copyColumnTo(column_index, v3) {
    column_index <<= 2;
    v3.x = this.m_localFS32[column_index];
    v3.y = this.m_localFS32[1 + column_index];
    v3.z = this.m_localFS32[2 + column_index];
    v3.w = this.m_localFS32[3 + column_index];
  }

  setF32ArrAndIndex(fs32Arr, index = 0) {
    if (fs32Arr != null && index >= 0) {
      this.m_fs32 = fs32Arr;
      this.m_index = index;
      this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
    }
  }

  setF32ArrIndex(index = 0) {
    if (index >= 0) {
      this.m_index = index;
      this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
    }
  }

  setF32Arr(fs32Arr) {
    if (fs32Arr != null) {
      this.m_fs32 = fs32Arr;
    }
  }

  copyFromF32Arr(fs32Arr, index = 0) {
    //let subArr:Float32Array = fs32Arr.subarray(index, index + 16);
    //this.m_localFS32.set(fs32Arr.subarray(index, index + 16), 0);
    let i = 0;

    for (let end = index + 16; index < end; index++) {
      this.m_localFS32[i] = fs32Arr[index];
      ++i;
    }
  }

  copyToF32Arr(fs32Arr, index = 0) {
    fs32Arr.set(this.m_localFS32, index);
  }

  copyFrom(smat) {
    this.m_localFS32.set(smat.m_localFS32, 0);
  }

  copyTo(dmat) {
    //dmat.copyFrom(this);
    dmat.m_localFS32.set(this.m_localFS32, 0);
  }

  copyRawDataFrom(float_rawDataArr, rawDataLength = 16, index = 0, bool_tp = false) {
    if (bool_tp) this.transpose();
    rawDataLength = rawDataLength - index;
    let c = 0;

    while (c < rawDataLength) {
      this.m_fs32[this.m_index + c] = float_rawDataArr[c + index];
      ++c;
    }

    if (bool_tp) this.transpose();
  }

  copyRawDataTo(float_rawDataArr, rawDataLength = 16, index = 0, bool_tp = false) {
    if (bool_tp) this.transpose();
    let c = 0;

    while (c < rawDataLength) {
      float_rawDataArr[c + index] = this.m_fs32[this.m_index + c];
      ++c;
    }

    if (bool_tp) this.transpose();
  }

  copyRowFrom(row_index, v3) {
    switch (row_index) {
      case 0:
        {
          this.m_localFS32[0] = v3.x;
          this.m_localFS32[4] = v3.y;
          this.m_localFS32[8] = v3.z;
          this.m_localFS32[12] = v3.w;
        }
        break;

      case 1:
        {
          this.m_localFS32[1] = v3.x;
          this.m_localFS32[5] = v3.y;
          this.m_localFS32[9] = v3.z;
          this.m_localFS32[13] = v3.w;
        }
        break;

      case 2:
        {
          this.m_localFS32[2] = v3.x;
          this.m_localFS32[6] = v3.y;
          this.m_localFS32[10] = v3.z;
          this.m_localFS32[14] = v3.w;
        }
        break;

      case 3:
        {
          this.m_localFS32[3] = v3.x;
          this.m_localFS32[7] = v3.y;
          this.m_localFS32[11] = v3.z;
          this.m_localFS32[15] = v3.w;
        }
        break;

      default:
        break;
    }
  }

  copyRowTo(row_index, v3) {
    v3.x = this.m_localFS32[row_index];
    v3.y = this.m_localFS32[4 + row_index];
    v3.z = this.m_localFS32[8 + row_index];
    v3.w = this.m_localFS32[12 + row_index];
  }

  decompose(orientationStyle) {
    // TODO: optimize after 4 lines
    let vec = [];
    let mr = Matrix4.s_tMat4;
    let mrfs32 = mr.getFS32(); //let mrfsI = mr.getFSIndex();
    //std::memcpy(&mr, m_rawData, m_rawDataSize);

    mr.copyFrom(this); ///*

    let pos = new Vector3D_1.default(mrfs32[12], mrfs32[13], mrfs32[14]);
    let scale = new Vector3D_1.default();
    scale.x = Math.sqrt(mrfs32[0] * mrfs32[0] + mrfs32[1] * mrfs32[1] + mrfs32[2] * mrfs32[2]);
    scale.y = Math.sqrt(mrfs32[4] * mrfs32[4] + mrfs32[5] * mrfs32[5] + mrfs32[6] * mrfs32[6]);
    scale.z = Math.sqrt(mrfs32[8] * mrfs32[8] + mrfs32[9] * mrfs32[9] + mrfs32[10] * mrfs32[10]);
    if (mrfs32[0] * (mrfs32[5] * mrfs32[10] - mrfs32[6] * mrfs32[9]) - mrfs32[1] * (mrfs32[4] * mrfs32[10] - mrfs32[6] * mrfs32[8]) + mrfs32[2] * (mrfs32[4] * mrfs32[9] - mrfs32[5] * mrfs32[8]) < 0) scale.z = -scale.z;
    mrfs32[0] /= scale.x;
    mrfs32[1] /= scale.x;
    mrfs32[2] /= scale.x;
    mrfs32[4] /= scale.y;
    mrfs32[5] /= scale.y;
    mrfs32[6] /= scale.y;
    mrfs32[8] /= scale.z;
    mrfs32[9] /= scale.z;
    mrfs32[10] /= scale.z;
    let rot = new Vector3D_1.default();

    switch (orientationStyle) {
      case OrientationType_1.default.AXIS_ANGLE:
        {
          rot.w = MathConst_1.default.SafeACos((mrfs32[0] + mrfs32[5] + mrfs32[10] - 1) / 2);
          let len = Math.sqrt((mrfs32[6] - mrfs32[9]) * (mrfs32[6] - mrfs32[9]) + (mrfs32[8] - mrfs32[2]) * (mrfs32[8] - mrfs32[2]) + (mrfs32[1] - mrfs32[4]) * (mrfs32[1] - mrfs32[4]));

          if (len > MathConst_1.default.MATH_MIN_POSITIVE) {
            rot.x = (mrfs32[6] - mrfs32[9]) / len;
            rot.y = (mrfs32[8] - mrfs32[2]) / len;
            rot.z = (mrfs32[1] - mrfs32[4]) / len;
          } else rot.x = rot.y = rot.z = 0;
        }
        break;

      case OrientationType_1.default.QUATERNION:
        {
          let tr = mrfs32[0] + mrfs32[5] + mrfs32[10];

          if (tr > 0) {
            rot.w = Math.sqrt(1 + tr) / 2;
            rot.x = (mrfs32[6] - mrfs32[9]) / (4 * rot.w);
            rot.y = (mrfs32[8] - mrfs32[2]) / (4 * rot.w);
            rot.z = (mrfs32[1] - mrfs32[4]) / (4 * rot.w);
          } else if (mrfs32[0] > mrfs32[5] && mrfs32[0] > mrfs32[10]) {
            rot.x = Math.sqrt(1 + mrfs32[0] - mrfs32[5] - mrfs32[10]) / 2;
            rot.w = (mrfs32[6] - mrfs32[9]) / (4 * rot.x);
            rot.y = (mrfs32[1] + mrfs32[4]) / (4 * rot.x);
            rot.z = (mrfs32[8] + mrfs32[2]) / (4 * rot.x);
          } else if (mrfs32[5] > mrfs32[10]) {
            rot.y = Math.sqrt(1 + mrfs32[5] - mrfs32[0] - mrfs32[10]) / 2;
            rot.x = (mrfs32[1] + mrfs32[4]) / (4 * rot.y);
            rot.w = (mrfs32[8] - mrfs32[2]) / (4 * rot.y);
            rot.z = (mrfs32[6] + mrfs32[9]) / (4 * rot.y);
          } else {
            rot.z = Math.sqrt(1 + mrfs32[10] - mrfs32[0] - mrfs32[5]) / 2;
            rot.x = (mrfs32[8] + mrfs32[2]) / (4 * rot.z);
            rot.y = (mrfs32[6] + mrfs32[9]) / (4 * rot.z);
            rot.w = (mrfs32[1] - mrfs32[4]) / (4 * rot.z);
          }
        }
        break;

      case OrientationType_1.default.EULER_ANGLES:
        {
          rot.y = Math.asin(-mrfs32[2]);

          if (mrfs32[2] != 1 && mrfs32[2] != -1) {
            rot.x = Math.atan2(mrfs32[6], mrfs32[10]);
            rot.z = Math.atan2(mrfs32[1], mrfs32[0]);
          } else {
            rot.z = 0;
            rot.x = Math.atan2(mrfs32[4], mrfs32[5]);
          }
        }
        break;

      default:
        break;
    }

    ;
    vec.push(pos);
    vec.push(rot);
    vec.push(scale);
    mr = null;
    return vec;
  }

  invert() {
    let d = this.determinant();
    let invertable = Math.abs(d) > MathConst_1.default.MATH_MIN_POSITIVE;

    if (invertable) {
      let sfs32 = this.m_localFS32;
      d = 1.0 / d;
      let m11 = sfs32[0];
      let m21 = sfs32[4];
      let m31 = sfs32[8];
      let m41 = sfs32[12];
      let m12 = sfs32[1];
      let m22 = sfs32[5];
      let m32 = sfs32[9];
      let m42 = sfs32[13];
      let m13 = sfs32[2];
      let m23 = sfs32[6];
      let m33 = sfs32[10];
      let m43 = sfs32[14];
      let m14 = sfs32[3];
      let m24 = sfs32[7];
      let m34 = sfs32[11];
      let m44 = sfs32[15];
      sfs32[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
      sfs32[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
      sfs32[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
      sfs32[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
      sfs32[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
      sfs32[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
      sfs32[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
      sfs32[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
      sfs32[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
      sfs32[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
      sfs32[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
      sfs32[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
      sfs32[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
      sfs32[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
      sfs32[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
      sfs32[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
    }

    ;
    return invertable;
  }

  pointAt(pos, at, up) {
    //TODO: need optimize
    if (at == null || at == undefined) at = new Vector3D_1.default(0.0, 0.0, -1.0);
    if (up == null || up == undefined) up = new Vector3D_1.default(0.0, -1.0, 0.0);
    let dir = at.subtract(pos);
    let vup = new Vector3D_1.default(up.x, up.y, up.z); //up->clone();
    //Vector3D right;

    dir.normalize();
    vup.normalize();
    let dir2 = new Vector3D_1.default(dir.x, dir.y, dir.z);
    dir2.scaleBy(vup.dot(dir)); //

    vup.subtractBy(dir2);
    if (vup.getLength() > MathConst_1.default.MATH_MIN_POSITIVE) vup.normalize();else if (dir.x != 0) vup.setTo(-dir.y, dir.x, 0); // vup = Vector3D(-dir.y, dir.x, 0);
    else vup.setTo(1, 0, 0); // vup = Vector3D(1, 0, 0);

    let right = vup.crossProduct(dir);
    right.normalize();
    let sfs32 = this.m_localFS32;
    sfs32[0] = right.x;
    sfs32[4] = right.y;
    sfs32[8] = right.z;
    sfs32[12] = 0.0;
    sfs32[1] = vup.x;
    sfs32[5] = vup.y;
    sfs32[9] = vup.z;
    sfs32[13] = 0.0;
    sfs32[2] = dir.x;
    sfs32[6] = dir.y;
    sfs32[10] = dir.z;
    sfs32[14] = 0.0;
    sfs32[3] = pos.x;
    sfs32[7] = pos.y;
    sfs32[11] = pos.z;
    sfs32[15] = 1.0;
  }

  prepend(rhs) {
    let rfs32 = rhs.getLocalFS32();
    let sfs32 = this.m_localFS32;
    let m111 = rfs32[0];
    let m121 = rfs32[4];
    let m131 = rfs32[8];
    let m141 = rfs32[12];
    let m112 = rfs32[1];
    let m122 = rfs32[5];
    let m132 = rfs32[9];
    let m142 = rfs32[13];
    let m113 = rfs32[2];
    let m123 = rfs32[6];
    let m133 = rfs32[10];
    let m143 = rfs32[14];
    let m114 = rfs32[3];
    let m124 = rfs32[7];
    let m134 = rfs32[11];
    let m144 = rfs32[15];
    let m211 = sfs32[0];
    let m221 = sfs32[4];
    let m231 = sfs32[8];
    let m241 = sfs32[12];
    let m212 = sfs32[1];
    let m222 = sfs32[5];
    let m232 = sfs32[9];
    let m242 = sfs32[13];
    let m213 = sfs32[2];
    let m223 = sfs32[6];
    let m233 = sfs32[10];
    let m243 = sfs32[14];
    let m214 = sfs32[3];
    let m224 = sfs32[7];
    let m234 = sfs32[11];
    let m244 = sfs32[15];
    sfs32[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
    sfs32[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
    sfs32[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
    sfs32[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
    sfs32[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
    sfs32[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
    sfs32[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
    sfs32[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
    sfs32[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
    sfs32[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
    sfs32[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
    sfs32[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
    sfs32[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
    sfs32[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
    sfs32[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
    sfs32[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
  }

  prepend3x3(rhs) {
    let rfs32 = rhs.getLocalFS32();
    let sfs32 = this.m_localFS32;
    let m111 = rfs32[0];
    let m121 = rfs32[4];
    let m131 = rfs32[8];
    let m112 = rfs32[1];
    let m122 = rfs32[5];
    let m132 = rfs32[9];
    let m113 = rfs32[2];
    let m123 = rfs32[6];
    let m133 = rfs32[10];
    let m211 = sfs32[0];
    let m221 = sfs32[4];
    let m231 = sfs32[8];
    let m212 = sfs32[1];
    let m222 = sfs32[5];
    let m232 = sfs32[9];
    let m213 = sfs32[2];
    let m223 = sfs32[6];
    let m233 = sfs32[10];
    sfs32[0] = m111 * m211 + m112 * m221 + m113 * m231;
    sfs32[1] = m111 * m212 + m112 * m222 + m113 * m232;
    sfs32[2] = m111 * m213 + m112 * m223 + m113 * m233;
    sfs32[4] = m121 * m211 + m122 * m221 + m123 * m231;
    sfs32[5] = m121 * m212 + m122 * m222 + m123 * m232;
    sfs32[6] = m121 * m213 + m122 * m223 + m123 * m233;
    sfs32[8] = m131 * m211 + m132 * m221 + m133 * m231;
    sfs32[9] = m131 * m212 + m132 * m222 + m133 * m232;
    sfs32[10] = m131 * m213 + m132 * m223 + m133 * m233;
  }

  prependRotationPivot(radian, axis, pivotPoint) {
    Matrix4.s_tMat4.identity();
    Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    Matrix4.s_tMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
    this.prepend(Matrix4.s_tMat4);
  }

  prependRotation(radian, axis) {
    Matrix4.s_tMat4.identity();
    Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
    this.prepend(Matrix4.s_tMat4);
  }

  prependRotationX(radian) {
    //s_tempMat.identity();
    Matrix4.s_tMat4.rotationX(radian);
    this.prepend3x3(Matrix4.s_tMat4);
  }

  prependRotationY(radian) {
    //s_tempMat.identity();
    Matrix4.s_tMat4.rotationY(radian);
    this.prepend3x3(Matrix4.s_tMat4);
  }

  prependRotationZ(radian) {
    //s_tempMat.identity();
    Matrix4.s_tMat4.rotationZ(radian);
    this.prepend3x3(Matrix4.s_tMat4);
  } // 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)


  prependRotationEulerAngle(radianX, radianY, radianZ) {
    //s_tempMat.identity();
    Matrix4.s_tMat4.rotationY(radianY);
    this.prepend3x3(Matrix4.s_tMat4); //s_tempMat.identity();

    Matrix4.s_tMat4.rotationX(radianX);
    this.prepend3x3(Matrix4.s_tMat4); //s_tempMat.identity();

    Matrix4.s_tMat4.rotationZ(radianZ);
    this.prepend3x3(Matrix4.s_tMat4);
  }

  prependScale(xScale, yScale, zScale) {
    let sfs32 = this.m_localFS32;
    sfs32[0] *= xScale;
    sfs32[1] *= yScale;
    sfs32[2] *= zScale;
    sfs32[4] *= xScale;
    sfs32[5] *= yScale;
    sfs32[6] *= zScale;
    sfs32[8] *= xScale;
    sfs32[9] *= yScale;
    sfs32[10] *= zScale;
    sfs32[12] *= xScale;
    sfs32[13] *= yScale;
    sfs32[14] *= zScale;
  }

  prependScaleXY(xScale, yScale) {
    this.m_localFS32[0] *= xScale;
    this.m_localFS32[1] *= yScale;
    this.m_localFS32[4] *= xScale;
    this.m_localFS32[5] *= yScale;
    this.m_localFS32[8] *= xScale;
    this.m_localFS32[9] *= yScale;
    this.m_localFS32[12] *= xScale;
    this.m_localFS32[13] *= yScale;
  }

  prependTranslationXYZ(px, py, pz) {
    Matrix4.s_tMat4.identity(); //Matrix4.s_tMat4.setPositionXYZ(px, py, pz);

    this.prepend(Matrix4.s_tMat4);
  }

  prependTranslation(v3) {
    Matrix4.s_tMat4.identity(); //Matrix4.s_tMat4.setPositionXYZ(v3.x, v3.y, v3.z);

    this.prepend(Matrix4.s_tMat4);
  }

  recompose(components, orientationStyle) {
    if (components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
    this.identity();
    let scale = Matrix4.s_tMat4.getFS32();
    scale[0] = scale[1] = scale[2] = components[2].x;
    scale[4] = scale[5] = scale[6] = components[2].y;
    scale[8] = scale[9] = scale[10] = components[2].z;
    let sfs32 = this.m_localFS32;

    switch (orientationStyle) {
      case OrientationType_1.default.EULER_ANGLES:
        {
          let cx = Math.cos(components[1].x);
          let cy = Math.cos(components[1].y);
          let cz = Math.cos(components[1].z);
          let sx = Math.sin(components[1].x);
          let sy = Math.sin(components[1].y);
          let sz = Math.sin(components[1].z);
          sfs32[0] = cy * cz * scale[0];
          sfs32[1] = cy * sz * scale[1];
          sfs32[2] = -sy * scale[2];
          sfs32[3] = 0;
          sfs32[4] = (sx * sy * cz - cx * sz) * scale[4];
          sfs32[5] = (sx * sy * sz + cx * cz) * scale[5];
          sfs32[6] = sx * cy * scale[6];
          sfs32[7] = 0;
          sfs32[8] = (cx * sy * cz + sx * sz) * scale[8];
          sfs32[9] = (cx * sy * sz - sx * cz) * scale[9];
          sfs32[10] = cx * cy * scale[10];
          sfs32[11] = 0;
          sfs32[12] = components[0].x;
          sfs32[13] = components[0].y;
          sfs32[14] = components[0].z;
          sfs32[15] = 1;
        }
        break;

      default:
        {
          let x = components[1].x;
          let y = components[1].y;
          let z = components[1].z;
          let w = components[1].w;

          if (orientationStyle == OrientationType_1.default.AXIS_ANGLE) {
            let halfW = 0.5 * w;
            x *= Math.sin(halfW);
            y *= Math.sin(halfW);
            z *= Math.sin(halfW);
            w = Math.cos(halfW);
          }

          ;
          sfs32[0] = (1 - 2 * y * y - 2 * z * z) * scale[0];
          sfs32[1] = (2 * x * y + 2 * w * z) * scale[1];
          sfs32[2] = (2 * x * z - 2 * w * y) * scale[2];
          sfs32[3] = 0;
          sfs32[4] = (2 * x * y - 2 * w * z) * scale[4];
          sfs32[5] = (1 - 2 * x * x - 2 * z * z) * scale[5];
          sfs32[6] = (2 * y * z + 2 * w * x) * scale[6];
          sfs32[7] = 0;
          sfs32[8] = (2 * x * z + 2 * w * y) * scale[8];
          sfs32[9] = (2 * y * z - 2 * w * x) * scale[9];
          sfs32[10] = (1 - 2 * x * x - 2 * y * y) * scale[10];
          sfs32[11] = 0;
          sfs32[12] = components[0].x;
          sfs32[13] = components[0].y;
          sfs32[14] = components[0].z;
          sfs32[15] = 1;
        }
        break;
    }

    ; //TODO: need thinking

    if (components[2].x == 0) this.m_localFS32[0] = 0; // 1e-15;

    if (components[2].y == 0) this.m_localFS32[5] = 0; // 1e-15;

    if (components[2].z == 0) this.m_localFS32[10] = 0; // 1e-15;

    scale = null;
    return true;
  }

  setThreeAxes(x_axis, y_axis, z_axis) {
    let vs = this.m_localFS32;
    vs[0] = x_axis.x;
    vs[1] = x_axis.y;
    vs[2] = x_axis.z;
    vs[4] = y_axis.x;
    vs[5] = y_axis.y;
    vs[6] = y_axis.z;
    vs[8] = z_axis.x;
    vs[9] = z_axis.y;
    vs[10] = z_axis.z;
  }

  deltaTransformVector(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    return new Vector3D_1.default(x * this.m_localFS32[0] + y * this.m_localFS32[4] + z * this.m_localFS32[8], x * this.m_localFS32[1] + y * this.m_localFS32[5] + z * this.m_localFS32[9], x * this.m_localFS32[2] + y * this.m_localFS32[6] + z * this.m_localFS32[10], 0.0);
  }

  deltaTransformVectorSelf(v3) {
    let sfs32 = this.m_localFS32;
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    v3.x = x * sfs32[0] + y * sfs32[4] + z * sfs32[8];
    v3.y = x * sfs32[1] + y * sfs32[5] + z * sfs32[9];
    v3.z = x * sfs32[2] + y * sfs32[6] + z * sfs32[10];
  }

  deltaTransformOutVector(v3, out_v3) {
    let sfs32 = this.m_localFS32;
    out_v3.x = v3.x * sfs32[0] + v3.y * sfs32[4] + v3.z * sfs32[8];
    out_v3.y = v3.x * sfs32[1] + v3.y * sfs32[5] + v3.z * sfs32[9];
    out_v3.z = v3.x * sfs32[2] + v3.y * sfs32[6] + v3.z * sfs32[10];
  }

  transformVector(v3) {
    let sfs32 = this.m_localFS32;
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    return new Vector3D_1.default(x * sfs32[0] + y * sfs32[4] + z * sfs32[8] + sfs32[12], x * sfs32[1] + y * sfs32[5] + z * sfs32[9] + sfs32[13], x * sfs32[2] + y * sfs32[6] + z * sfs32[10] + sfs32[14], x * sfs32[3] + y * sfs32[7] + z * sfs32[11] + sfs32[15]);
  }

  transformOutVector(v3, out_v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let sfs32 = this.m_localFS32;
    out_v3.setTo(x * sfs32[0] + y * sfs32[4] + z * sfs32[8] + sfs32[12], x * sfs32[1] + y * sfs32[5] + z * sfs32[9] + sfs32[13], x * sfs32[2] + y * sfs32[6] + z * sfs32[10] + sfs32[14], x * sfs32[3] + y * sfs32[7] + z * sfs32[11] + sfs32[15]);
  }

  transformOutVector3(v3, out_v3) {
    let sfs32 = this.m_localFS32;
    out_v3.x = v3.x * sfs32[0] + v3.y * sfs32[4] + v3.z * sfs32[8] + sfs32[12];
    out_v3.y = v3.x * sfs32[1] + v3.y * sfs32[5] + v3.z * sfs32[9] + sfs32[13];
    out_v3.z = v3.x * sfs32[2] + v3.y * sfs32[6] + v3.z * sfs32[10] + sfs32[14];
  }

  transformVector3Self(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let sfs32 = this.m_localFS32;
    v3.x = x * sfs32[0] + y * sfs32[4] + z * sfs32[8] + sfs32[12];
    v3.y = x * sfs32[1] + y * sfs32[5] + z * sfs32[9] + sfs32[13];
    v3.z = x * sfs32[2] + y * sfs32[6] + z * sfs32[10] + sfs32[14];
  }

  transformVectorSelf(v3) {
    let x = v3.x;
    let y = v3.y;
    let z = v3.z;
    let sfs32 = this.m_localFS32;
    v3.setTo(x * sfs32[0] + y * sfs32[4] + z * sfs32[8] + sfs32[12], x * sfs32[1] + y * sfs32[5] + z * sfs32[9] + sfs32[13], x * sfs32[2] + y * sfs32[6] + z * sfs32[10] + sfs32[14], x * sfs32[3] + y * sfs32[7] + z * sfs32[11] + sfs32[15]);
  }

  transformVectors(float_vinArr, vinLength, float_voutArr) {
    let i = 0;
    let x, y, z;
    let pfs = this.m_localFS32;
    vinLength -= 3;

    while (i <= vinLength) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_voutArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_voutArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_voutArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transformVectorsSelf(float_vinArr, vinLength) {
    let i = 0;
    let x, y, z;
    let pfs = this.m_localFS32;
    vinLength -= 3;

    while (i <= vinLength) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transformVectorsRangeSelf(float_vinArr, begin, end) {
    let i = begin;
    let x, y, z;
    let pfs = this.m_localFS32;
    end -= 3;

    while (i <= end) {
      x = float_vinArr[i];
      y = float_vinArr[i + 1];
      z = float_vinArr[i + 2];
      float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
      float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
      float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
      i += 3;
    }
  }

  transpose() {
    Matrix4.s_tMat4.copyFrom(this);
    let fs32 = Matrix4.s_tMat4.getFS32();
    let sfs32 = this.m_localFS32;
    sfs32[1] = fs32[4];
    sfs32[2] = fs32[8];
    sfs32[3] = fs32[12];
    sfs32[4] = fs32[1];
    sfs32[6] = fs32[9];
    sfs32[7] = fs32[13];
    sfs32[8] = fs32[2];
    sfs32[9] = fs32[6];
    sfs32[11] = fs32[14];
    sfs32[12] = fs32[3];
    sfs32[13] = fs32[7];
    sfs32[14] = fs32[11];
  }

  interpolateTo(toMat, float_percent) {
    let fs32 = toMat.getFS32();
    let fsI = toMat.getFSIndex();
    let _g = 0;
    let i = this.m_index;

    while (_g < 16) {
      this.m_fs32[i] += (fs32[fsI + _g] - this.m_fs32[i]) * float_percent;
      ++i;
      ++_g;
    }
  }

  getAxisRotation(x, y, z, radian) {
    radian = -radian;
    let sfs32 = this.m_localFS32;
    let s = Math.sin(radian),
        c = Math.cos(radian);
    let t = 1.0 - c;
    sfs32[0] = c + x * x * t;
    sfs32[5] = c + y * y * t;
    sfs32[10] = c + z * z * t;
    let tmp1 = x * y * t;
    let tmp2 = z * s;
    sfs32[4] = tmp1 + tmp2;
    sfs32[1] = tmp1 - tmp2;
    tmp1 = x * z * t;
    tmp2 = y * s;
    sfs32[8] = tmp1 - tmp2;
    sfs32[2] = tmp1 + tmp2;
    tmp1 = y * z * t;
    tmp2 = x * s;
    sfs32[9] = tmp1 + tmp2;
    sfs32[6] = tmp1 - tmp2;
  }

  rotationX(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.m_localFS32[0] = 1.0;
    this.m_localFS32[1] = 0.0;
    this.m_localFS32[2] = 0.0;
    this.m_localFS32[4] = 0.0;
    this.m_localFS32[5] = c;
    this.m_localFS32[6] = s;
    this.m_localFS32[8] = 0.0;
    this.m_localFS32[9] = -s;
    this.m_localFS32[10] = c;
  }

  rotationY(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.m_localFS32[0] = c;
    this.m_localFS32[1] = 0.0;
    this.m_localFS32[2] = -s;
    this.m_localFS32[4] = 0.0;
    this.m_localFS32[5] = 1.0;
    this.m_localFS32[6] = 0.0;
    this.m_localFS32[8] = s;
    this.m_localFS32[9] = 0.0;
    this.m_localFS32[10] = c;
  }

  rotationZ(radian) {
    let s = Math.sin(radian),
        c = Math.cos(radian);
    this.m_localFS32[0] = c;
    this.m_localFS32[1] = s;
    this.m_localFS32[2] = 0.0;
    this.m_localFS32[4] = -s;
    this.m_localFS32[5] = c;
    this.m_localFS32[6] = 0.0;
    this.m_localFS32[8] = 0.0;
    this.m_localFS32[9] = 0.0;
    this.m_localFS32[10] = 1.0;
  } /////////////////////////////////////////////////////////////


  toString() {
    let str = "\n" + this.m_localFS32[0] + "," + this.m_localFS32[1] + "," + this.m_localFS32[2] + "," + this.m_localFS32[3] + "\n";
    str += this.m_localFS32[4] + "," + this.m_localFS32[5] + "," + this.m_localFS32[6] + "," + this.m_localFS32[7] + "\n";
    str += this.m_localFS32[8] + "," + this.m_localFS32[9] + "," + this.m_localFS32[10] + "," + this.m_localFS32[11] + "\n";
    str += this.m_localFS32[12] + "," + this.m_localFS32[13] + "," + this.m_localFS32[14] + "," + this.m_localFS32[15] + "\n";
    return str;
  }

  transformPerspV4Self(v4) {
    v4.w = v4.z;
    v4.x *= this.m_localFS32[0];
    v4.y *= this.m_localFS32[5];
    v4.z *= this.m_localFS32[10];
    v4.z += this.m_localFS32[14];
    v4.w *= this.m_localFS32[11];
    v4.w += this.m_localFS32[15];
  } ///////
  // view etc..
  ///////////////////////////////////////////


  perspectiveRH(fovy, aspect, zNear, zFar) {
    //assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
    let tanHalfFovy = Math.tan(fovy * 0.5);
    this.identity();
    this.m_localFS32[0] = 1.0 / (aspect * tanHalfFovy);
    this.m_localFS32[5] = 1.0 / tanHalfFovy;
    this.m_localFS32[10] = -(zFar + zNear) / (zFar - zNear);
    this.m_localFS32[11] = -1.0;
    this.m_localFS32[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
  }

  perspectiveRH2(fovy, pw, ph, zNear, zFar) {
    let focalLength = pw / Math.tan(fovy * 0.5);
    let m0 = focalLength / pw;
    let m5 = focalLength / ph;
    let m10 = -zFar / (zFar - zNear);
    let m14 = -zNear * m10;
    this.identity();
    this.m_localFS32[0] = m0;
    this.m_localFS32[5] = m5;
    this.m_localFS32[10] = m10;
    this.m_localFS32[11] = -1.0;
    this.m_localFS32[14] = m14;
  }

  orthoRH(b, t, l, r, zNear, zFar) {
    this.identity();
    this.m_localFS32[0] = 2.0 / (r - l);
    this.m_localFS32[5] = 2.0 / (t - b);
    this.m_localFS32[10] = -2.0 / (zFar - zNear);
    this.m_localFS32[12] = -(r + l) / (r - l);
    this.m_localFS32[13] = -(t + b) / (t - b);
    this.m_localFS32[14] = -(zFar + zNear) / (zFar - zNear);
    this.m_localFS32[15] = 1.0;
  }

  perspectiveLH(fovy, aspect, zNear, zFar) {
    //assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
    let tanHalfFovy = Math.tan(fovy * 0.5);
    this.identity();
    this.m_localFS32[0] = 1.0 / (aspect * tanHalfFovy);
    this.m_localFS32[5] = 1.0 / tanHalfFovy;
    this.m_localFS32[10] = (zFar + zNear) / (zFar - zNear);
    this.m_localFS32[11] = 1.0;
    this.m_localFS32[14] = 2.0 * zFar * zNear / (zFar - zNear);
  }

  orthoLH(b, t, l, r, zNear, zFar) {
    this.identity();
    this.m_localFS32[0] = 2.0 / (r - l); // / (aspect * tanHalfFovy);

    this.m_localFS32[5] = 2.0 / (t - b); // / tanHalfFovy;

    this.m_localFS32[10] = 2.0 / (zFar - zNear);
    this.m_localFS32[12] = -(r + l) / (r - l);
    this.m_localFS32[13] = -(t + b) / (t - b);
    this.m_localFS32[14] = -(zFar + zNear) / (zFar - zNear);
    this.m_localFS32[15] = 1.0;
  }

  lookAtRH(eye, center, up) {
    this.identity();
    let f = center.subtract(eye);
    f.normalize();
    let s = f.crossProduct(up);
    s.normalize();
    let u = s.crossProduct(f);
    s.w = -s.dot(eye);
    u.w = -u.dot(eye);
    f.w = f.dot(eye);
    f.negate();
    this.copyRowFrom(0, s);
    this.copyRowFrom(1, u);
    this.copyRowFrom(2, f);
  }

  lookAtLH(eye, center, up) {
    this.identity();
    let f = center.subtract(eye);
    f.normalize();
    let s = f.crossProduct(up);
    s.normalize();
    let u = s.crossProduct(f);
    s.w = -s.dot(eye);
    u.w = -u.dot(eye);
    f.w = -f.dot(eye);
    this.copyRowFrom(0, s);
    this.copyRowFrom(1, u);
    this.copyRowFrom(2, f);
  }

  destroy() {
    this.m_localFS32 = null;
    this.m_fs32 = null;
    this.m_index = -1;
  }

}

Matrix4.s_InitData = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
Matrix4.s_uid = 0;
Matrix4.s_isolatedUid = 0x4ffff;
Matrix4.s_tMat4 = new Matrix4();
exports.default = Matrix4;

/***/ }),

/***/ "1e15":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const VtxBufConst_1 = __importDefault(__webpack_require__("8a0a"));

const RCExtension_1 = __importDefault(__webpack_require__("030e"));

class ROVtxBuilder {
  constructor() {
    this.m_rcuid = 0;
    this.m_glVer = 2;
    this.m_rc = null;
    this.RGBA = 0;
    this.UNSIGNED_BYTE = 0;
    this.TRIANGLE_STRIP = 0;
    this.TRIANGLE_FAN = 0;
    this.TRIANGLES = 0;
    this.LINES = 0;
    this.LINE_STRIP = 0;
    this.UNSIGNED_SHORT = 0;
    this.UNSIGNED_INT = 0;
    this.COLOR = 0;
    this.DEPTH = 0;
    this.STENCIL = 0;
    this.DEPTH_STENCIL = 0;
    this.MAX = 0;
    this.MIN = 0;
    this.RContext = null;
    this.vroUid = 0;
    this.rioUid = 0;
  }
  /**
   * @returns return system gpu context
   */


  getRC() {
    return this.m_rc;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

  createBuf() {
    return this.m_rc.createBuffer();
  }

  deleteBuf(buf) {
    this.m_rc.deleteBuffer(buf);
  }

  bindArrBuf(buf) {
    this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, buf);
  }

  bindEleBuf(buf) {
    this.m_rc.bindBuffer(this.m_rc.ELEMENT_ARRAY_BUFFER, buf);
  }

  arrBufSubData(float32Arr, offset) {
    this.m_rc.bufferSubData(this.m_rc.ARRAY_BUFFER, offset, float32Arr);
  }

  arrBufData(float32Arr, usage) {
    this.m_rc.bufferData(this.m_rc.ARRAY_BUFFER, float32Arr, VtxBufConst_1.default.ToGL(this.m_rc, usage));
  }

  eleBufSubData(uintDataArr, offset) {
    this.m_rc.bufferSubData(this.m_rc.ELEMENT_ARRAY_BUFFER, offset, uintDataArr);
  }

  eleBufData(uintDataArr, usage) {
    this.m_rc.bufferData(this.m_rc.ELEMENT_ARRAY_BUFFER, uintDataArr, VtxBufConst_1.default.ToGL(this.m_rc, usage));
  }

  arrBufDataMem(bytesSize, usage) {
    this.m_rc.bufferData(this.m_rc.ARRAY_BUFFER, bytesSize, VtxBufConst_1.default.ToGL(this.m_rc, usage));
  }

  eleBufDataMem(bytesSize, usage) {
    this.m_rc.bufferData(this.m_rc.ELEMENT_ARRAY_BUFFER, bytesSize, VtxBufConst_1.default.ToGL(this.m_rc, usage));
  }

  useVtxAttribsPtrTypeFloat(shdp, buf, attribTypes, attribTypesLen, wholeOffsetList, wholeStride) {
    this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, buf);

    for (let i = 0; i < attribTypesLen; ++i) {
      shdp.vertexAttribPointerTypeFloat(attribTypes[i], wholeStride, wholeOffsetList[i]);
    }
  }

  useVtxAttribsPtrTypeFloatMulti(shdp, bufs, attribTypes, attribTypesLen, wholeOffsetList, wholeStride) {
    for (let i = 0; i < attribTypesLen; ++i) {
      this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, bufs[i]);
      shdp.vertexAttribPointerTypeFloat(attribTypes[i], wholeStride, wholeOffsetList[i]);
    }
  }

  createVertexArray() {
    let vao = null;

    if (this.m_glVer == 2) {
      vao = this.m_rc.createVertexArray();
    } else {
      vao = RCExtension_1.default.OES_vertex_array_object.createVertexArrayOES();
    }

    return vao;
  }

  bindVertexArray(vao) {
    if (this.m_glVer == 2) {
      this.m_rc.bindVertexArray(vao);
    } else {
      RCExtension_1.default.OES_vertex_array_object.bindVertexArrayOES(vao);
    }

    return vao;
  }

  deleteVertexArray(vao) {
    if (this.m_glVer == 2) {
      this.m_rc.deleteVertexArray(vao);
    } else {
      RCExtension_1.default.OES_vertex_array_object.deleteVertexArrayOES(vao);
    }
  }

  testVROUid(vroUid) {
    if (this.vroUid != vroUid) {
      this.vroUid = vroUid;
      return true;
    }

    return false;
  }

  testRIOUid(rioUid) {
    if (this.rioUid != rioUid) {
      this.rioUid = rioUid;
      return true;
    }

    return false;
  }

  initialize(rcuid, gl, glVer) {
    this.m_rc = gl;
    this.m_rcuid = rcuid;
    this.m_glVer = glVer;
    let selfT = this;
    selfT.RGBA = gl.RGBA;
    selfT.UNSIGNED_BYTE = gl.UNSIGNED_BYTE;
    selfT.TRIANGLE_STRIP = gl.TRIANGLE_STRIP;
    selfT.TRIANGLE_FAN = gl.TRIANGLE_FAN;
    selfT.TRIANGLES = gl.TRIANGLES;
    selfT.LINES = this.m_rc.LINES;
    selfT.LINE_STRIP = gl.LINE_STRIP;
    selfT.UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
    selfT.UNSIGNED_INT = gl.UNSIGNED_INT;
    selfT.COLOR = gl.COLOR;
    selfT.DEPTH = gl.DEPTH;
    selfT.STENCIL = gl.STENCIL;
    selfT.DEPTH_STENCIL = gl.DEPTH_STENCIL;

    if (this.m_glVer > 1) {
      selfT.MIN = gl.MIN;
      selfT.MAX = gl.MAX;
    } else {
      selfT.MIN = RCExtension_1.default.EXT_blend_minmax.MIN_EXT;
      selfT.MAX = RCExtension_1.default.EXT_blend_minmax.MAX_EXT;
    }

    selfT.RContext = gl;
  }

  renderBegin() {
    this.vroUid = -2;
    this.rioUid = -3;
  }

}

exports.default = ROVtxBuilder;

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

/***/ "20ef":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const VtxBufConst_1 = __importDefault(__webpack_require__("8a0a"));

class ShdProgram {
  constructor(uid) {
    this.m_shdData = null;
    this.m_uid = -1;
    this.m_program = null;
    this.m_rcuid = -1;
    this.m_gl = null;
    this.m_shdUniqueName = "";
    this.m_texTotal = 0; // recorde uniform GLUniformLocation id

    this.m_aLocations = null;
    this.m_aLocationTypes = null;
    this.m_aLocationSizes = null;
    this.m_uLocations = null;
    this.m_texLocations = null;
    this.m_attribLIndexList = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    this.m_attribTypeSizeList = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    this.m_attriSizeList = null;
    this.m_uniformDict = new Map();
    this.m_uLocationDict = new Map();
    this.m_vertShader = null;
    this.m_fragShader = null; // recode shader uniform including status

    this.dataUniformEnabled = false;
    this.m_attrid = 0;
    this.m_attridIndex = 0;
    this.m_uLc = null;
    this.m_uIndex = 0;
    this.m_uid = uid;
  }

  setShdData(shdData) {
    this.m_shdData = shdData;
    this.m_shdUniqueName = shdData.getUniqueShaderName();
  }

  getUid() {
    return this.m_uid;
  }

  getTexTotal() {
    return this.m_shdData.getTexTotal();
  }

  useTexLocation() {
    for (let i = 0; i < this.m_texTotal; i++) {
      this.m_gl.uniform1i(this.m_texLocations[i], i);
    }
  } // use texture true or false


  haveTexture() {
    return this.m_shdData.haveTexture();
  }

  createLocations() {
    let i = 0;
    let len = 0;
    let attriNSList = this.m_shdData.getAttriNSList();

    if (attriNSList != null && attriNSList.length > 0) {
      if (this.m_aLocations == null) {
        this.dataUniformEnabled = false;
        let attriSizeList = this.m_shdData.getAttriSizeList();
        this.m_aLocations = [];
        this.m_aLocationTypes = [];
        this.m_aLocationSizes = [];
        len = attriNSList.length;
        let type = 0;
        let altI = 0;

        while (i < len) {
          altI = this.m_gl.getAttribLocation(this.m_program, attriNSList[i]);
          this.m_aLocations.push(altI);
          type = VtxBufConst_1.default.GetVBufAttributeTypeByNS(attriNSList[i]);
          this.m_aLocationTypes.push(type);
          this.m_aLocationSizes.push(attriSizeList[i]);
          this.m_attribLIndexList[type] = altI;
          this.m_attribTypeSizeList[type] = attriSizeList[i];
          this.dataUniformEnabled = true;
          ++i;
        }

        this.m_attriSizeList = [];

        for (i = 0; i < this.m_attribTypeSizeList.length; ++i) {
          if (this.m_attribTypeSizeList[i] > 0) {
            this.m_attriSizeList.push(this.m_attribTypeSizeList[i]);
          }
        }

        if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
          console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attri aLocationTypes: " + this.m_aLocationTypes);
          console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attri m_aLocations: " + this.m_aLocations);
          console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attriNSList: " + attriNSList);
          console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attribLIndexList: " + this.m_attribLIndexList);
          console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attribTypeSizeList: " + this.m_attribTypeSizeList);
          console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attriSizeList: " + this.m_attriSizeList);
        }
      }
    }

    if (this.m_shdData.haveCommonUniform()) {
      if (this.m_uLocations == null) {
        let uninforms = this.m_shdData.getUniforms();
        this.m_uLocations = [];
        len = uninforms.length;
        i = 0;
        let ul = null;
        let uns = "";

        while (i < len) {
          if (!uninforms[i].isTex) {
            uns = uninforms[i].name;
            ul = this.m_gl.getUniformLocation(this.m_program, uns);

            if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
              console.log("ShdProgram::createLocations() uniform, ul " + ul + ", uninforms[" + i + "].name: " + uns);
            }

            if (ul != null) {
              ul.uniformName = uns;
              ul.uniqueName = this.m_shdUniqueName;
              uninforms[i].location = ul;
              this.m_uniformDict.set(uns, uninforms[i]);
              this.m_uLocationDict.set(uns, ul);
              this.m_uLocations.push(ul);
              this.dataUniformEnabled = true;
            } else {
              if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
                console.warn("uniform ", uns, " was not used!");
              }
            }
          }

          ++i;
        }
      }
    }

    this.m_texTotal = this.m_shdData.getTexTotal();

    if (this.m_texTotal > 0) {
      this.m_texLocations = new Array(this.m_texTotal);
      let texnsList = this.m_shdData.getTexUniformNames();

      for (i = 0; i < this.m_texTotal; ++i) {
        texnsList[i] = "u_sampler" + i;
        this.m_texLocations[i] = this.m_gl.getUniformLocation(this.m_program, texnsList[i]);
      }
    }
  }

  getLayoutBit() {
    return this.m_shdData.getLayoutBit();
  }

  getMid() {
    return this.m_shdData.getMid();
  }

  getFragOutputTotal() {
    return this.m_shdData.getFragOutputTotal();
  }

  getLocationsTotal() {
    return this.m_aLocationTypes.length;
  }

  getLocationTypeByIndex(index) {
    return this.m_aLocationTypes[index];
  }

  getLocationSizeByIndex(index) {
    return this.m_aLocationSizes[index];
  }

  testVertexAttribPointerOffset(offsetList) {
    let flag = false;

    if (offsetList != null && this.m_attriSizeList != null) {
      // 使用大于等于，例如绘制深度图的时候不需要法线和uv而只需要顶点数据即可
      if (offsetList.length >= this.m_attriSizeList.length) {
        let offset = 0;
        let i = 0;

        for (; i < this.m_attriSizeList.length; ++i) {
          if (offset != offsetList[i]) {
            break;
          }

          offset += this.m_attriSizeList[i] * 4;
        }

        flag = i >= this.m_attriSizeList.length;
      }
    }

    if (!flag) {
      console.error("顶点数据layout和顶点着色器中的layout(" + this.m_attriSizeList + ")不匹配");
      throw Error("Shader program vertx attributes layout can not match float attribute vertex data !!!");
    }

    return flag;
  }

  vertexAttribPointerType(attribType, size, type, normalized, stride, offset) {
    this.m_attrid = this.m_attribLIndexList[attribType];

    if (this.m_attrid > -1) {
      this.m_gl.enableVertexAttribArray(this.m_attrid);
      this.m_gl.vertexAttribPointer(this.m_attrid, this.m_attribTypeSizeList[attribType], type, normalized, stride, offset);
    }
  }

  vertexAttribPointerTypeFloat(attribType, stride, offset) {
    this.m_attrid = this.m_attribLIndexList[attribType];

    if (this.m_attrid > -1) {
      this.m_gl.enableVertexAttribArray(this.m_attrid);
      this.m_gl.vertexAttribPointer(this.m_attrid, this.m_attribTypeSizeList[attribType], this.m_gl.FLOAT, false, stride, offset);
    }
  }

  testVertexAttribPointerType(attribType) {
    return this.m_attribLIndexList[attribType] > -1;
  }

  getVertexAttribByTpye(attribType) {
    return this.m_attribLIndexList[attribType];
  }

  vertexAttribPointerAt(i, size, type, normalized, stride, offset) {
    this.m_attridIndex = i;
    this.m_attrid = this.m_aLocations[i];

    if (this.m_attrid > -1) {
      this.m_gl.enableVertexAttribArray(this.m_attrid);
      this.m_gl.vertexAttribPointer(this.m_attrid, size, type, normalized, stride, offset);
    }
  }

  vertexAttribPointerNext(size, type, normalized, stride, offset) {
    this.m_attrid = this.m_aLocations[this.m_attridIndex];

    if (this.m_attrid > -1) {
      this.m_gl.enableVertexAttribArray(this.m_attrid);
      this.m_gl.vertexAttribPointer(this.m_attrid, size, type, normalized, stride, offset);
    }

    this.m_attridIndex++;
  }

  vertexAttribPointerFirst(size, type, normalized, stride, offset) {
    this.m_attridIndex = 1;
    this.m_attrid = this.m_aLocations[0];

    if (this.m_attrid > -1) {
      this.m_gl.enableVertexAttribArray(this.m_attrid);
      this.m_gl.vertexAttribPointer(this.m_attrid, size, type, normalized, stride, offset);
    }
  }

  getUniformLocationAt(i) {
    this.m_uIndex = i + 1;
    return this.m_uLocations[i];
  }

  getUniformLocationNext() {
    this.m_uLc = this.m_uLocations[this.m_uIndex++];
    return this.m_uLc;
  }

  getUniformLocationFirst() {
    this.m_uIndex = 1;
    return this.m_uLocations[0];
  }

  getUniformLocationByNS(ns) {
    return this.m_uLocationDict.get(ns);
  }

  getUniformTypeNameByNS(ns) {
    if (this.m_uniformDict.has(ns)) {
      return this.m_uniformDict.get(ns).typeName;
    }

    return "";
  }

  getUniformTypeByNS(ns) {
    if (this.m_uniformDict.has(ns)) {
      return this.m_uniformDict.get(ns).type;
    }

    return 0;
  }

  hasUniformByName(ns) {
    return this.m_uniformDict.has(ns);
  }

  getUniformLengthByNS(ns) {
    if (this.m_uniformDict.has(ns)) {
      return this.m_uniformDict.get(ns).arrLength;
    }

    return 0;
  }

  initShdProgram() {
    let vshd_str = this.m_shdData.getVSCodeStr();
    let fshd_str = this.m_shdData.getFSCodeStr(); //console.log("ShdProgram::initShdProgram(), this: ",this);

    let pr;

    if (this.m_shdData.preCompileInfo == null) {
      if (RendererDevice_1.default.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
        if (vshd_str.indexOf(" mediump ") >= 0) {
          pr = new RegExp(" mediump ", "g");
          vshd_str = vshd_str.replace(pr, " highp ");
        }

        if (vshd_str.indexOf(" lowp ") >= 0) {
          pr = new RegExp(" lowp ", "g");
          vshd_str = vshd_str.replace(pr, " highp ");
        }
      }
    }

    if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
      console.log("vert shader code: \n" + vshd_str);
    }

    let vertShader = this.loadShader(this.m_gl.VERTEX_SHADER, vshd_str);

    if (this.m_shdData.preCompileInfo == null) {
      if (RendererDevice_1.default.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
        if (fshd_str.indexOf(" mediump ") >= 0) {
          pr = new RegExp(" mediump ", "g");
          fshd_str = fshd_str.replace(pr, " highp ");
        }

        if (fshd_str.indexOf(" lowp ") >= 0) {
          pr = new RegExp(" lowp ", "g");
          fshd_str = fshd_str.replace(pr, " highp ");
        }
      }
    }

    if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
      console.log("frag shader code: \n" + fshd_str);
    }

    let fragShader = this.loadShader(this.m_gl.FRAGMENT_SHADER, fshd_str); // Create the shader program      

    let shdProgram = this.m_gl.createProgram();
    this.m_gl.attachShader(shdProgram, fragShader);
    this.m_gl.attachShader(shdProgram, vertShader);
    this.m_gl.linkProgram(shdProgram);

    if (!this.m_gl.getProgramParameter(shdProgram, this.m_gl.LINK_STATUS)) {
      if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
        console.log('Unable to initialize the shader program: ' + this.m_gl.getProgramInfoLog(shdProgram));
      }

      return null;
    }

    this.m_vertShader = vertShader;
    this.m_fragShader = fragShader;
    return shdProgram;
  }

  loadShader(type, source) {
    let shader = this.m_gl.createShader(type);
    this.m_gl.shaderSource(shader, source);
    this.m_gl.compileShader(shader);

    if (!this.m_gl.getShaderParameter(shader, this.m_gl.COMPILE_STATUS)) {
      if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
        console.log('An error occurred compiling the shaders: ' + this.m_gl.getShaderInfoLog(shader));
      }

      this.m_gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  getUniqueShaderName() {
    return this.m_shdUniqueName;
  }

  enabled() {
    return this.m_program != null;
  }

  upload(gl, rcuid) {
    if (this.m_program == null) {
      this.m_rcuid = rcuid;
      this.m_gl = gl;
      this.m_program = this.initShdProgram();
      this.m_program.uniqueName = this.m_shdUniqueName;
      if (null != this.m_program) this.createLocations();
    }
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

  uniformBlockBinding(uniform_block_ns, bindingIndex) {
    this.m_gl.uniformBlockBinding(this.m_program, this.m_gl.getUniformBlockIndex(this.m_program, uniform_block_ns), bindingIndex);
  }

  toString() {
    return "[ShdProgram(uniqueName = " + this.m_shdUniqueName + ")]";
  }
  /**
   * @returns return current gpu shader  program
   */


  getGPUProgram() {
    return this.m_program;
  }

  destroy() {
    this.m_aLocations = null;
    this.m_attriSizeList = null;

    if (this.m_texTotal > 0) {
      this.m_texLocations.fill(null);
      this.m_texTotal = 0;
    }

    if (this.m_program != null) {
      this.m_gl.deleteShader(this.m_vertShader);
      this.m_gl.deleteShader(this.m_fragShader);
      this.m_vertShader = null;
      this.m_fragShader = null;
      this.m_gl.deleteProgram(this.m_program);
      this.m_program = null;
    }

    this.m_gl = null;
    this.m_shdData = null;
  }

}

exports.default = ShdProgram;

/***/ }),

/***/ "2139":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const Matrix4_1 = __importDefault(__webpack_require__("18c7"));

class Matrix4Pool {
  static GetMatTotal() {
    return Matrix4Pool.s_mtotal;
  }

  static GetFS32Arr() {
    return Matrix4Pool.s_mfs32Arr;
  }

  static SetFS32Arr(fs32) {
    Matrix4Pool.s_mfs32Arr = fs32;
    let total = Matrix4Pool.s_mtotal;
    let list = Matrix4Pool.s_matList;

    for (let i = 0; i < total; ++i) {
      list[i].setF32Arr(fs32);
    }
  }

  static GetFreeId() {
    if (Matrix4Pool.m_freeIdList.length > 0) {
      return Matrix4Pool.m_freeIdList.pop();
    }

    return -1;
  }

  static Allocate(total) {
    if (total < 1024) {
      total = 1024;
    }

    if (Matrix4Pool.s_mtotal < 1) {
      //console.log("Matrix4Pool::Allocate(), Matrix total: "+total);
      Matrix4Pool.s_mtotal = total;
      Matrix4Pool.s_mfs32Arr = new Float32Array(total * 16);
      let i = 0;
      let mat = new Matrix4_1.default(Matrix4Pool.s_mfs32Arr, i * 16);
      let uid = mat.getUid();
      Matrix4Pool.s_baseUid = uid;
      Matrix4Pool.s_maxUid = uid + total;

      for (; i < uid; ++i) {
        Matrix4Pool.s_matList.push(null);
        Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
      }

      Matrix4Pool.s_matList.push(mat);
      Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
      Matrix4Pool.m_freeIdList.push(mat.getUid());

      for (i = 1; i < total; ++i) {
        mat = new Matrix4_1.default(Matrix4Pool.s_mfs32Arr, i * 16);
        Matrix4Pool.s_matList.push(mat);
        Matrix4Pool.s_matFlagList.push(Matrix4Pool.s_FLAG_FREE);
        Matrix4Pool.m_freeIdList.push(mat.getUid());
      }
    }
  }

  static GetMatrix() {
    let mat = null;
    let index = Matrix4Pool.GetFreeId() - Matrix4Pool.s_baseUid;

    if (index >= 0) {
      mat = Matrix4Pool.s_matList[index];
      mat.identity();
      Matrix4Pool.s_matFlagList[index] = Matrix4Pool.s_FLAG_BUSY; //console.log("Get a free Matrix !!!");
    } else {
      //console.error("Matrix4Pool::GetMatrix(), Error Matrix4Pool is empty !!!");
      mat = new Matrix4_1.default();
    }

    return mat;
  }

  static RetrieveMatrix(mat) {
    if (mat != null) {
      let uid = mat.getUid();

      if (uid >= Matrix4Pool.s_baseUid && uid < Matrix4Pool.s_maxUid) {
        if (Matrix4Pool.s_matFlagList[uid - Matrix4Pool.s_baseUid] == Matrix4Pool.s_FLAG_BUSY) {
          Matrix4Pool.m_freeIdList.push(uid);
          Matrix4Pool.s_matFlagList[uid - Matrix4Pool.s_baseUid] = Matrix4Pool.s_FLAG_FREE;
        }
      }
    }
  }

}

Matrix4Pool.s_FLAG_BUSY = 1;
Matrix4Pool.s_FLAG_FREE = 0;
Matrix4Pool.s_matList = [];
Matrix4Pool.s_matFlagList = [];
Matrix4Pool.m_freeIdList = [];
Matrix4Pool.s_mfs32Arr = null;
Matrix4Pool.s_baseUid = 0;
Matrix4Pool.s_maxUid = 0;
Matrix4Pool.s_mtotal = 0;
exports.default = Matrix4Pool;

/***/ }),

/***/ "2560":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const UniformConst_1 = __importDefault(__webpack_require__("ab73"));

class CameraUniformBuilder {
  create(rc, shdp) {
    let cam = rc.getCamera();

    if (shdp.hasUniformByName(UniformConst_1.default.CameraViewMatUNS) && shdp.hasUniformByName(UniformConst_1.default.CameraProjectiveMatUNS)) {
      return rc.uniformContext.createShaderGlobalUniformFromProbe(cam.matUProbe, "u_viewAndProjMat", [UniformConst_1.default.CameraViewMatUNS, UniformConst_1.default.CameraProjectiveMatUNS]);
    } else if (shdp.hasUniformByName(UniformConst_1.default.CameraViewMatUNS)) {
      return rc.uniformContext.createShaderGlobalUniformFromProbeAt(cam.matUProbe, "u_viewMat", [UniformConst_1.default.CameraViewMatUNS], 0);
    } else if (shdp.hasUniformByName(UniformConst_1.default.CameraProjectiveMatUNS)) {
      return rc.uniformContext.createShaderGlobalUniformFromProbeAt(cam.matUProbe, "u_projMat", [UniformConst_1.default.CameraProjectiveMatUNS], 1);
    }

    return null;
  }

  getIDNS() {
    return "CameraUniformBuilder";
  }

}

exports.default = CameraUniformBuilder;

/***/ }),

/***/ "264c":
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

class RenderSortBlock {
  constructor(shader) {
    this.m_begin = null;
    this.m_end = null;
    this.m_next = null;
    this.m_node = null;
    this.m_nodes = [];
    this.m_nodesTotal = 0;
    this.m_shader = null;
    this.m_renderTotal = 0;
    this.m_sorter = null;
    this.sortEnabled = true;
    this.m_shader = shader;
  }

  setSorter(sorter) {
    this.m_sorter = sorter;
  }

  showInfo() {
    let info = "";
    let next = this.m_begin;

    while (next != null) {
      //info += "("+next.unit.value+","+next.uid+"),";
      info += next.unit.value + ",";
      next = next.next;
    }

    console.log("RenderSortBlock info: \n", info);
  }

  clear() {
    if (this.m_shader != null) {
      if (this.m_nodes.length > 0) this.m_nodes = [];
      let next = this.m_begin;
      let curr = null;

      while (next != null) {
        curr = next;
        next = next.next;
        curr.prev = null;
        curr.next = null;
      }

      this.m_begin = this.m_end = null;
      this.m_nodesTotal = 0;
      this.m_renderTotal = 0;
      this.sortEnabled = true;
      this.m_shader = null;
    }

    this.m_sorter = null;
  }

  update() {
    if (this.sortEnabled) {
      this.sort();
    }
  }

  run(rc) {
    this.m_shader.resetUniform();
    let unit = null;
    let nodes = this.m_nodes; //let info:string = "";

    for (let i = 0; i < this.m_renderTotal; ++i) {
      unit = nodes[i];
      this.m_shader.bindToGpu(unit.shdUid);
      unit.run(rc);

      if (unit.partTotal < 1) {
        unit.drawThis(rc);
      } else {
        unit.drawPart(rc);
      } //info += unit.value+",";

    } //console.log(info);

  }

  runLockMaterial(rc) {
    this.m_shader.resetUniform();
    let unit = null;
    let nodes = this.m_nodes;

    for (let i = 0; i < this.m_renderTotal; ++i) {
      unit = nodes[i];
      this.m_shader.bindToGpu(unit.shdUid);
      unit.vro.run();
      unit.runLockMaterial2(null);

      if (unit.partTotal < 1) {
        unit.drawThis(rc);
      } else {
        unit.drawPart(rc);
      }
    }
  }

  sort() {
    if (this.m_nodesTotal > 0) {
      //console.log("this.m_nodesTotal: ",this.m_nodesTotal);
      // 整个sort执行过程放在渲染运行时渲染执行阶段是不妥的,但是目前还没有好办法
      // 理想的情况是运行时不会被复杂计算打断，复杂计算应该再渲染执行之前完成
      let next = this.m_begin;

      if (this.m_nodes.length < this.m_nodesTotal) {
        this.m_nodes = new Array(Math.round(this.m_nodesTotal * 1.1) + 1);
      }

      let i = 0;

      while (next != null) {
        if (next.drawEnabled && next.unit.drawEnabled) {
          this.m_nodes[i] = next.unit;
          ++i;
        }

        next = next.next;
      }

      this.m_renderTotal = i;
      let flat = 0;

      if (this.m_sorter != null) {
        flat = this.m_sorter.sortRODisplay(this.m_nodes, i);
      }

      if (flat < 1) {
        this.snsort(0, i - 1);
      }
    }
  }

  sorting(low, high) {
    let arr = this.m_nodes;
    this.m_node = arr[low];
    let pvalue = this.m_node.value;

    while (low < high) {
      while (low < high && arr[high].value >= pvalue) {
        --high;
      }

      arr[low] = arr[high];

      while (low < high && arr[low].value <= pvalue) {
        ++low;
      }

      arr[high] = arr[low];
    }

    arr[low] = this.m_node;
    return low;
  }

  snsort(low, high) {
    if (low < high) {
      let pos = this.sorting(low, high);
      this.snsort(low, pos - 1);
      this.snsort(pos + 1, high);
    }
  }

  getNodesTotal() {
    return this.m_nodesTotal;
  }

  getBegin() {
    this.m_next = this.m_begin;
    return this.m_begin;
  }

  getNext() {
    if (this.m_next != null) {
      this.m_next = this.m_next.next;
    }

    return this.m_next;
  }

  isEmpty() {
    return this.m_nodesTotal < 1; // return this.m_begin == null;
  }

  addNode(node) {
    //console.log("sort add node: ",node);
    if (node.prev == null && node.next == null) {
      if (this.m_begin == null) {
        this.m_end = this.m_begin = node;
      } else {
        if (this.m_end.prev != null) {
          this.m_end.next = node;
          node.prev = this.m_end;
          this.m_end = node;
        } else {
          this.m_begin.next = node;
          node.prev = this.m_end;
          this.m_end = node;
        }
      }

      this.m_end.next = null;
      this.m_nodesTotal++; //console.log("sort add node,this.m_nodesTotal: ",this.m_nodesTotal);
    }
  }

  removeNode(node) {
    //console.log("sort remove node: ",node);
    if (node.prev != null || node.next != null || node == this.m_begin) {
      if (node == this.m_begin) {
        if (node == this.m_end) {
          this.m_begin = this.m_end = null;
        } else {
          this.m_begin = node.next;
          this.m_begin.prev = null;
        }
      } else if (node == this.m_end) {
        this.m_end = node.prev;
        this.m_end.next = null;
      } else {
        node.next.prev = node.prev;
        node.prev.next = node.next;
      }

      node.prev = null;
      node.next = null;
      this.m_nodesTotal--; //console.log("sort remove node,this.m_nodesTotal: ",this.m_nodesTotal);
    }
  }

}

exports.default = RenderSortBlock;

/***/ }),

/***/ "265e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2019-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 真正被高频运行的渲染管线中的被执行对象

Object.defineProperty(exports, "__esModule", {
  value: true
}); // 为了渲染循环执行中持有RPOUnit和对应的Disp

class RPONode {
  constructor() {
    this.__$ruid = -1;
    this.drawEnabled = true;
    this.uid = -1;
    this.index = -1; // only for show info

    this.drawMode = 0;
    this.ivsIndex = 0;
    this.ivsCount = 0;
    this.insCount = 0;
    this.shdUid = -1;
    this.vtxUid = -1;
    this.texMid = -1;
    this.rtokey = -1;
    this.prev = null;
    this.next = null;
    this.unit = null;
    this.vro = null;
    this.tro = null;
    this.rvroI = -1;
    this.rtroI = -1;
  }

  setValue(value) {
    this.unit.value = value;
  }

  isVsible() {
    return this.unit == null || this.unit.drawEnabled;
  }

  updateData() {
    let p = this.unit;
    this.drawMode = p.drawMode;
    this.ivsIndex = p.ivsIndex;
    this.ivsCount = p.ivsCount;
    this.insCount = p.insCount;
    p.drawOffset = p.ivsIndex * p.ibufStep;
    this.vtxUid = p.vtxUid;
    this.vro = p.vro; // material info etc.

    this.shdUid = p.shdUid;
    this.texMid = p.texMid;
    this.tro = p.tro;
  }

  reset() {
    this.drawEnabled = true;
    this.uid = -1;
    this.index = -1;
    this.drawMode = 0;
    this.ivsIndex = 0;
    this.ivsCount = 0;
    this.insCount = 0;
    this.shdUid = -1;
    this.vtxUid = -1;
    this.texMid = -1;
    this.rtokey = -1;
    this.unit = null;
    this.vro = null;
    this.tro = null;
    this.prev = null;
    this.next = null;
  }

  toString() {
    return "[Object RPONode(uid = " + this.uid + ", index = " + this.index + ", shdUid = " + this.shdUid + ", vtxUid = " + this.vtxUid + ")]";
  }

}

exports.default = RPONode;

/***/ }),

/***/ "278e":
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

class CameraDragSlide {
  constructor() {
    this.m_stage3D = null;
    this.m_camera = null;
    this.slideSpeed = 2.0;
    this.m_mouseX = 0.0;
    this.m_mouseY = 0.0;
    this.m_enabled = false;
  }

  initialize(stage3D, camera) {
    if (this.m_stage3D == null) {
      this.m_stage3D = stage3D;
      this.m_camera = camera;
    }
  }

  attach() {
    this.m_mouseX = this.m_stage3D.mouseX;
    this.m_mouseY = this.m_stage3D.mouseY;
    this.m_enabled = true;
  }

  detach() {
    this.m_enabled = false;
  }

  run() {
    if (this.m_enabled) {
      let dx = (this.m_mouseX - this.m_stage3D.mouseX) * this.slideSpeed;
      let dy = (this.m_mouseY - this.m_stage3D.mouseY) * this.slideSpeed;
      this.m_camera.slideViewOffsetXY(dx, dy);
      this.m_mouseX = this.m_stage3D.mouseX;
      this.m_mouseY = this.m_stage3D.mouseY;
    }
  }

}

exports.CameraDragSlide = CameraDragSlide;

/***/ }),

/***/ "29ef":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const RenderColorMask_1 = __webpack_require__("070b");

const RenderStateObject_1 = __webpack_require__("a5ba");

const RenderConst_1 = __webpack_require__("e08e");

class RendererState {
  static Initialize(rstate, vro) {
    if (RendererState.s_initBoo) {
      RendererState.s_initBoo = false;
      let state = RendererState;
      state.Rstate = rstate;
      state.VRO = vro;
      RenderColorMask_1.RenderColorMask.Rstate = rstate;
      RenderStateObject_1.RenderStateObject.Rstate = rstate;
      state.COLOR_MASK_ALL_TRUE = RenderColorMask_1.RenderColorMask.Create("all_true", true, true, true, true);
      state.COLOR_MASK_ALL_FALSE = RenderColorMask_1.RenderColorMask.Create("all_false", false, false, false, false);
      state.COLOR_MASK_RED_TRUE = RenderColorMask_1.RenderColorMask.Create("red_true", true, false, false, false);
      state.COLOR_MASK_GREEN_TRUE = RenderColorMask_1.RenderColorMask.Create("green_true", false, true, false, false);
      state.COLOR_MASK_BLUE_TRUE = RenderColorMask_1.RenderColorMask.Create("blue_true", false, false, true, false);
      state.COLOR_MASK_ALPHA_TRUE = RenderColorMask_1.RenderColorMask.Create("alpha_true", false, false, false, true);
      state.COLOR_MASK_RED_FALSE = RenderColorMask_1.RenderColorMask.Create("red_false", false, true, true, true);
      state.COLOR_MASK_GREEN_FALSE = RenderColorMask_1.RenderColorMask.Create("green_false", true, false, true, true);
      state.COLOR_MASK_BLUE_FALSE = RenderColorMask_1.RenderColorMask.Create("blue_false", true, true, false, true);
      state.COLOR_MASK_ALPHA_FALSE = RenderColorMask_1.RenderColorMask.Create("alpha_false", true, true, true, false);
      let rso = RenderStateObject_1.RenderStateObject;
      let rBlendMode = RenderConst_1.RenderBlendMode;
      rBlendMode.NORMAL = rso.CreateBlendMode("NORMAL", RenderConst_1.GLBlendMode.ONE, RenderConst_1.GLBlendMode.ZERO, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.OPAQUE = rso.CreateBlendMode("OPAQUE", RenderConst_1.GLBlendMode.ONE, RenderConst_1.GLBlendMode.ZERO, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.TRANSPARENT = rso.CreateBlendMode("TRANSPARENT", RenderConst_1.GLBlendMode.SRC_ALPHA, RenderConst_1.GLBlendMode.ONE_MINUS_SRC_ALPHA, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.ALPHA_ADD = rso.CreateBlendMode("ALPHA_ADD", RenderConst_1.GLBlendMode.ONE, RenderConst_1.GLBlendMode.ONE_MINUS_SRC_ALPHA, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.ADD = rso.CreateBlendMode("ADD", RenderConst_1.GLBlendMode.SRC_ALPHA, RenderConst_1.GLBlendMode.ONE, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.ADD_LINEAR = rso.CreateBlendMode("ADD_LINEAR", RenderConst_1.GLBlendMode.ONE, RenderConst_1.GLBlendMode.ONE, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.INVERSE_ALPHA = rso.CreateBlendMode("INVERSE_ALPHA", RenderConst_1.GLBlendMode.ONE, RenderConst_1.GLBlendMode.SRC_ALPHA, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.BLAZE = rso.CreateBlendMode("BLAZE", RenderConst_1.GLBlendMode.SRC_COLOR, RenderConst_1.GLBlendMode.ONE, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.OVERLAY = rso.CreateBlendMode("OVERLAY", RenderConst_1.GLBlendMode.DST_COLOR, RenderConst_1.GLBlendMode.DST_ALPHA, RenderConst_1.GLBlendEquation.FUNC_ADD);
      rBlendMode.OVERLAY2 = rso.CreateBlendMode("OVERLAY2", RenderConst_1.GLBlendMode.DST_COLOR, RenderConst_1.GLBlendMode.SRC_ALPHA, RenderConst_1.GLBlendEquation.FUNC_ADD);
      state.NORMAL_STATE = rso.Create("normal", RenderConst_1.CullFaceMode.BACK, RenderConst_1.RenderBlendMode.NORMAL, RenderConst_1.DepthTestMode.OPAQUE);
      state.BACK_CULLFACE_NORMAL_STATE = state.NORMAL_STATE;
      state.FRONT_CULLFACE_NORMAL_STATE = rso.Create("front_normal", RenderConst_1.CullFaceMode.FRONT, RenderConst_1.RenderBlendMode.NORMAL, RenderConst_1.DepthTestMode.OPAQUE);
      state.NONE_CULLFACE_NORMAL_STATE = rso.Create("none_normal", RenderConst_1.CullFaceMode.NONE, RenderConst_1.RenderBlendMode.NORMAL, RenderConst_1.DepthTestMode.OPAQUE);
      state.ALL_CULLFACE_NORMAL_STATE = rso.Create("all_cull_normal", RenderConst_1.CullFaceMode.FRONT_AND_BACK, RenderConst_1.RenderBlendMode.NORMAL, RenderConst_1.DepthTestMode.OPAQUE);
      state.BACK_NORMAL_ALWAYS_STATE = rso.Create("back_normal_always", RenderConst_1.CullFaceMode.BACK, RenderConst_1.RenderBlendMode.NORMAL, RenderConst_1.DepthTestMode.ALWAYS);
      state.BACK_TRANSPARENT_STATE = rso.Create("back_transparent", RenderConst_1.CullFaceMode.BACK, RenderConst_1.RenderBlendMode.TRANSPARENT, RenderConst_1.DepthTestMode.TRANSPARENT_SORT);
      state.BACK_TRANSPARENT_ALWAYS_STATE = rso.Create("back_transparent_always", RenderConst_1.CullFaceMode.BACK, RenderConst_1.RenderBlendMode.TRANSPARENT, RenderConst_1.DepthTestMode.ALWAYS);
      state.NONE_TRANSPARENT_STATE = rso.Create("none_transparent", RenderConst_1.CullFaceMode.NONE, RenderConst_1.RenderBlendMode.TRANSPARENT, RenderConst_1.DepthTestMode.TRANSPARENT_SORT);
      state.NONE_TRANSPARENT_ALWAYS_STATE = rso.Create("none_transparent_always", RenderConst_1.CullFaceMode.NONE, RenderConst_1.RenderBlendMode.TRANSPARENT, RenderConst_1.DepthTestMode.ALWAYS);
      state.FRONT_CULLFACE_GREATER_STATE = rso.Create("front_greater", RenderConst_1.CullFaceMode.FRONT, RenderConst_1.RenderBlendMode.NORMAL, RenderConst_1.DepthTestMode.TRUE_GREATER);
      state.BACK_ADD_BLENDSORT_STATE = rso.Create("back_add_blendSort", RenderConst_1.CullFaceMode.BACK, RenderConst_1.RenderBlendMode.ADD, RenderConst_1.DepthTestMode.TRANSPARENT_SORT);
      state.BACK_ADD_ALWAYS_STATE = rso.Create("back_add_always", RenderConst_1.CullFaceMode.BACK, RenderConst_1.RenderBlendMode.ADD, RenderConst_1.DepthTestMode.ALWAYS);
      state.BACK_ALPHA_ADD_ALWAYS_STATE = rso.Create("back_alpha_add_always", RenderConst_1.CullFaceMode.BACK, RenderConst_1.RenderBlendMode.ALPHA_ADD, RenderConst_1.DepthTestMode.ALWAYS);
      state.NONE_ADD_ALWAYS_STATE = rso.Create("none_add_always", RenderConst_1.CullFaceMode.NONE, RenderConst_1.RenderBlendMode.ADD, RenderConst_1.DepthTestMode.ALWAYS);
      state.NONE_ADD_BLENDSORT_STATE = rso.Create("none_add_blendSort", RenderConst_1.CullFaceMode.NONE, RenderConst_1.RenderBlendMode.ADD, RenderConst_1.DepthTestMode.TRANSPARENT_SORT);
      state.NONE_ALPHA_ADD_ALWAYS_STATE = rso.Create("none_alpha_add_always", RenderConst_1.CullFaceMode.NONE, RenderConst_1.RenderBlendMode.ALPHA_ADD, RenderConst_1.DepthTestMode.ALWAYS);
      state.FRONT_ADD_ALWAYS_STATE = rso.Create("front_add_always", RenderConst_1.CullFaceMode.FRONT, RenderConst_1.RenderBlendMode.ADD, RenderConst_1.DepthTestMode.ALWAYS);
      state.FRONT_TRANSPARENT_STATE = rso.Create("front_transparent", RenderConst_1.CullFaceMode.FRONT, RenderConst_1.RenderBlendMode.TRANSPARENT, RenderConst_1.DepthTestMode.TRANSPARENT_SORT);
      state.FRONT_TRANSPARENT_ALWAYS_STATE = rso.Create("front_transparent_always", RenderConst_1.CullFaceMode.FRONT, RenderConst_1.RenderBlendMode.TRANSPARENT, RenderConst_1.DepthTestMode.ALWAYS);
      state.NONE_CULLFACE_NORMAL_ALWAYS_STATE = rso.Create("none_normal_always", RenderConst_1.CullFaceMode.NONE, RenderConst_1.RenderBlendMode.NORMAL, RenderConst_1.DepthTestMode.ALWAYS);
      state.BACK_ALPHA_ADD_BLENDSORT_STATE = rso.Create("back_alpha_add_blendSort", RenderConst_1.CullFaceMode.BACK, RenderConst_1.RenderBlendMode.ALPHA_ADD, RenderConst_1.DepthTestMode.TRANSPARENT_SORT);
    }
  }

  static CreateBlendMode(name, srcColor, dstColor, blendEquation = 0) {
    return RenderStateObject_1.RenderStateObject.CreateBlendMode(name, srcColor, dstColor, blendEquation);
  }

  static CreateBlendModeSeparate(name, srcColor, dstColor, srcAlpha = 0, dstAlpha = 0, blendEquation = 0) {
    return RenderStateObject_1.RenderStateObject.CreateBlendModeSeparate(name, srcColor, dstColor, srcAlpha, dstAlpha, blendEquation);
  }

  static CreateRenderState(objName, cullFaceMode, blendMode, depthTestMode) {
    return RenderStateObject_1.RenderStateObject.Create(objName, cullFaceMode, blendMode, depthTestMode);
  }

  static CreateRenderColorMask(objName, rBoo, gBoo, bBoo, aBoo) {
    return RenderColorMask_1.RenderColorMask.Create(objName, rBoo, gBoo, bBoo, aBoo);
  }

  static GetRenderStateByName(objName) {
    return RenderStateObject_1.RenderStateObject.GetRenderStateByName(objName);
  }

  static GetRenderColorMaskByName(objName) {
    return RenderColorMask_1.RenderColorMask.GetColorMaskByName(objName);
  }

  static UnlockBlendMode() {
    RenderStateObject_1.RenderStateObject.UnlockBlendMode();
  }

  static LockBlendMode(cullFaceMode) {
    RenderStateObject_1.RenderStateObject.LockBlendMode(cullFaceMode);
  }

  static UnlockDepthTestMode() {
    RenderStateObject_1.RenderStateObject.UnlockDepthTestMode();
  }

  static LockDepthTestMode(depthTestMode) {
    RenderStateObject_1.RenderStateObject.LockDepthTestMode(depthTestMode);
  }

  static ResetState() {
    RenderColorMask_1.RenderColorMask.Reset();
    RenderStateObject_1.RenderStateObject.Reset();
    RendererState.Rstate.reset();

    RendererState.VRO.__$resetVRO(); // VROBase.Reset();

  }

  static Reset(context) {
    RenderColorMask_1.RenderColorMask.Reset();
    RenderStateObject_1.RenderStateObject.Reset();
    RendererState.Rstate.setRenderContext(context);
    RendererState.Rstate.reset();
  }

  static ResetInfo() {
    RendererState.DrawCallTimes = 0;
    RendererState.DrawTrisNumber = 0;
    RendererState.POVNumber = 0;
  }

  static SetDepthTestEnable(enable) {
    RendererState.Rstate.setDepthTestEnable(enable);
  }

  static SetBlendEnable(enable) {
    RendererState.Rstate.setBlendEnable(enable);
  }

}

RendererState.s_initBoo = true;
RendererState.VRO = null;
RendererState.Rstate = null;
RendererState.DrawCallTimes = 0;
RendererState.DrawTrisNumber = 0;
RendererState.POVNumber = 0;
RendererState.COLOR_MASK_ALL_TRUE = 0;
RendererState.COLOR_MASK_ALL_FALSE = 1;
RendererState.COLOR_MASK_RED_TRUE = 2;
RendererState.COLOR_MASK_GREEN_TRUE = 3;
RendererState.COLOR_MASK_BLUE_TRUE = 4;
RendererState.COLOR_MASK_ALPHA_TRUE = 5;
RendererState.COLOR_MASK_RED_FALSE = 6;
RendererState.COLOR_MASK_GREEN_FALSE = 7;
RendererState.COLOR_MASK_BLUE_FALSE = 8;
RendererState.COLOR_MASK_ALPHA_FALSE = 9;
RendererState.NORMAL_STATE = 0;
RendererState.BACK_CULLFACE_NORMAL_STATE = 0;
RendererState.FRONT_CULLFACE_NORMAL_STATE = 1;
RendererState.NONE_CULLFACE_NORMAL_STATE = 2;
RendererState.ALL_CULLFACE_NORMAL_STATE = 3;
RendererState.BACK_NORMAL_ALWAYS_STATE = 4;
RendererState.BACK_TRANSPARENT_STATE = 5;
RendererState.BACK_TRANSPARENT_ALWAYS_STATE = 6;
RendererState.NONE_TRANSPARENT_STATE = 7;
RendererState.NONE_TRANSPARENT_ALWAYS_STATE = 8;
RendererState.FRONT_CULLFACE_GREATER_STATE = 9;
RendererState.BACK_ADD_BLENDSORT_STATE = 10;
RendererState.BACK_ADD_ALWAYS_STATE = 11;
RendererState.BACK_ALPHA_ADD_ALWAYS_STATE = 12;
RendererState.NONE_ADD_ALWAYS_STATE = 13;
RendererState.NONE_ADD_BLENDSORT_STATE = 14;
RendererState.NONE_ALPHA_ADD_ALWAYS_STATE = 15;
RendererState.FRONT_ADD_ALWAYS_STATE = 16;
RendererState.FRONT_TRANSPARENT_STATE = 17;
RendererState.FRONT_TRANSPARENT_ALWAYS_STATE = 18;
RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE = 19;
RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE = 20;
exports.default = RendererState;

/***/ }),

/***/ "2be1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2019-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});

class PoolNodeBuilder {
  constructor() {
    this.m_nodesTotal = 0;
    this.m_nodes = [];
    this.m_flags = [];
    this.m_freeIdList = [];
  }
  /**
   * the sub class override this function, for real implement.
   */


  createNode() {
    return null;
  }
  /**
   * the sub class override this function, for real implement.
   */


  restoreUid(uid) {}

  getFreeId() {
    if (this.m_freeIdList.length > 0) {
      return this.m_freeIdList.pop();
    }

    return -1;
  }

  getNodeByUid(uid) {
    return this.m_nodes[uid];
  }

  create() {
    let node = null;
    let index = this.getFreeId();

    if (index >= 0) {
      node = this.m_nodes[index];
      node.uid = index;
      this.m_flags[index] = PoolNodeBuilder.S_BUSY;
    } else {
      // create a new nodeIndex
      node = this.createNode();
      this.m_nodes.push(node);
      this.m_flags.push(PoolNodeBuilder.S_BUSY);
      node.uid = this.m_nodesTotal;
      this.m_nodesTotal++;
    }

    return node;
  }

  restore(pnode) {
    if (pnode != null && pnode.uid >= 0 && this.m_flags[pnode.uid] == PoolNodeBuilder.S_BUSY) {
      this.restoreUid(pnode.uid);
      this.m_freeIdList.push(pnode.uid);
      this.m_flags[pnode.uid] = PoolNodeBuilder.S_FREE;
      pnode.reset();
      return true;
    }

    return false;
  }

  restoreByUid(uid) {
    if (uid >= 0 && uid < this.m_nodesTotal && this.m_flags[uid] == PoolNodeBuilder.S_BUSY) {
      this.restoreUid(uid);
      this.m_freeIdList.push(uid);
      this.m_flags[uid] = PoolNodeBuilder.S_FREE;
      this.m_nodes[uid].reset();
      return true;
    }

    return false;
  }

}

PoolNodeBuilder.S_BUSY = 1;
PoolNodeBuilder.S_FREE = 0;
exports.default = PoolNodeBuilder;

/***/ }),

/***/ "2e8a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const VtxBufConst_1 = __importDefault(__webpack_require__("8a0a"));

const MaterialConst_1 = __importDefault(__webpack_require__("644c"));

class AttributeLine {
  constructor() {
    this.type = -1;
    this.attriType = -1;
    this.typeSize = 3;
    this.typeName = "";
    this.name = "";
    this.layoutEnabled = true;
  }

  parseCode(codeStr) {
    const SEMICOLON = ";";
    const SPACE = " "; // 去掉两头的空格

    codeStr = codeStr.replace(/^\s*|\s*$/g, "");
    let i = codeStr.indexOf(SEMICOLON);
    if (i > 0) codeStr = codeStr.slice(0, i);
    let arr = codeStr.split(SPACE);
    this.typeName = arr[arr.length - 2];
    this.name = arr[arr.length - 1];
    this.type = MaterialConst_1.default.GetTypeByTypeNS(this.typeName);
    this.typeSize = parseInt(this.typeName.slice(this.typeName.length - 1));
    this.attriType = VtxBufConst_1.default.GetVBufAttributeTypeByNS(this.name); //trace("Attribute: >"+this.typeName+"<,>"+this.name+"<,>"+this.type+"<,typeSize: >"+this.typeSize+",attriType: "+this.attriType);
  }

}

exports.default = AttributeLine;

/***/ }),

/***/ "3024":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const ShaderUniformProbe_1 = __importDefault(__webpack_require__("3077"));

class UniformVec4Probe extends ShaderUniformProbe_1.default {
  constructor(slot, vec4Total) {
    super(slot);
    this.m_datafs = null;
    this.m_vec4Total = 1;
    if (vec4Total < 1) vec4Total = 1;
    this.m_vec4Total = vec4Total;
    this.m_datafs = new Float32Array(4 * vec4Total);
    this.addVec4Data(this.m_datafs, this.m_vec4Total);
  } // bindSlotAt(i: number): void {
  //     super.bindSlotAt(i);
  //     this.addVec4Data(this.m_datafs, this.m_vec4Total);
  // }


  destroy() {
    super.destroy();
    this.m_datafs = null;
  }

}

exports.default = UniformVec4Probe;

/***/ }),

/***/ "3077":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MaterialConst_1 = __importDefault(__webpack_require__("644c"));

class ShaderUniformProbe {
  constructor(slot) {
    this.m_uid = ShaderUniformProbe.s_uid++;
    this.m_slot = null;
    this.m_fsList = null; // 当前probe中的数据在slot中的结束位置序号

    this.m_fsIndex = 0; // 当前probe在slot中的起始位置序号

    this.m_slotBeginIndex = -1;
    this.rst = -1;
    this.uniformsTotal = 0;
    this.uniformNames = null; // array -> [SHADER_MAT4, SHADER_VEC3]

    this.uniformTypes = null; // array -> [1, 3], the "3" is uniform Array,length is 3

    this.dataSizeList = null;
    this.bindSlot(slot);
  }

  bindSlot(slot) {
    if (this.rst >= 0) {
      this.reset();
    }

    if (this.m_fsList == null) {
      this.m_fsList = [];
      this.uniformTypes = [];
      this.dataSizeList = [];
    }

    this.m_slot = slot;
    this.rst = 1;
    this.m_slotBeginIndex = slot.index;
    this.m_fsIndex = slot.index;
  }

  getUid() {
    return this.m_uid;
  }
  /**
   * @return 获取当前probe在slot中的起始位置序号
   */


  getSlotBeginIndex() {
    return this.m_slotBeginIndex;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_slot.getRCUid();
  }

  getFS32At(i) {
    return this.m_fsList[i];
  }

  setFS32At(fs32, i) {
    this.m_fsList[i] = fs32;
  }

  setVec4DataAt(index, f0, f1, f2, f3) {
    let fs = this.m_fsList[index];
    fs[0] = f0;
    fs[1] = f1;
    fs[2] = f2;
    fs[3] = f3;
  }

  setVec4Data(f0, f1, f2, f3) {
    let fs = this.m_fsList[0];
    fs[0] = f0;
    fs[1] = f1;
    fs[2] = f2;
    fs[3] = f3;
  }

  setVec4DataAtWithArr4(index, arr4) {
    this.m_fsList[index].set(arr4, 0);
  }

  setVec4DataWithArr4(arr4) {
    this.m_fsList[0].set(arr4, 0);
  }

  addVec4Data(f32, vec4Total) {
    //console.log("addVec4Data() slot("+this.m_slot.getUid()+")");
    if (vec4Total < f32.length / 4) {
      console.warn("vec4 uniform array total are not equal to the vec4Total value.");
    }

    this.m_fsList.push(f32);
    this.uniformTypes.push(MaterialConst_1.default.SHADER_VEC4);
    this.dataSizeList.push(vec4Total);
    this.m_slot.dataList[this.m_fsIndex] = f32;
    this.m_fsIndex++;
    this.uniformsTotal++;
    this.m_slot.index++;
  }

  addMat4Data(f32, mat4Total) {
    //console.log("addMat4Data() slot("+this.m_slot.getUid()+")");
    this.m_fsList.push(f32);
    this.uniformTypes.push(MaterialConst_1.default.SHADER_MAT4);
    this.dataSizeList.push(mat4Total);
    this.m_slot.dataList[this.m_fsIndex] = f32;
    this.m_fsIndex++;
    this.uniformsTotal++;
    this.m_slot.index++;
  }

  isEnabled() {
    return this.rst >= 0;
  }

  update() {
    //如果溢出，可能有问题
    //if(this.rst > 0xffffff) this.rst = Math.round(Math.random() * 1000) + 100;
    this.rst++;

    if (this.uniformsTotal < 2) {
      this.m_slot.flagList[this.m_slotBeginIndex] = this.rst;
    } else {
      for (let i = this.m_slotBeginIndex; i <= this.m_fsIndex; ++i) {
        this.m_slot.flagList[i] = this.rst;
      }
    } // if (this.m_uid == 5) {
    //     console.log("this.m_slot.dataList: ", this.m_slot.dataList);
    //     console.log("this.m_fsList: ", this.m_fsList);
    // }
    //console.log("this.m_slot.dataList");

  }

  reset() {
    this.rst = -1;
    this.m_slotBeginIndex = -1;
    this.uniformsTotal = 0;
    this.m_fsIndex = 0;

    if (this.m_fsList != null) {
      this.m_fsList = null;
      this.uniformTypes = null;
      this.dataSizeList = null;
    }

    this.m_slot = null;
  }

  destroy() {
    this.reset();
  }

}

ShaderUniformProbe.s_uid = 0;
exports.default = ShaderUniformProbe;

/***/ }),

/***/ "3113":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const SpecularMode_1 = __webpack_require__("839a");

const ShadowMode_1 = __webpack_require__("a9f4");

const UniformConst_1 = __importDefault(__webpack_require__("ab73"));

class ShaderCodeUniform {
  constructor() {
    this.m_codeBuilder = null;
    this.m_uniqueNSKeyString = "";
    this.m_uniqueNSKeys = new Uint16Array(128);
    this.m_uniqueNSKeysTotal = 16;
    this.m_uniqueNSKeyFlag = false;
  }

  __$setCodeBuilder(codeBuilder) {
    this.m_codeBuilder = codeBuilder;
  }

  getUniqueNSKeyID() {
    if (this.m_uniqueNSKeyFlag) {
      let id = 31;

      for (let i = 0; i < this.m_uniqueNSKeysTotal; ++i) {
        id = id * 131 + this.m_uniqueNSKeys[i];
      }

      return id;
    }

    return 0;
  }

  getUniqueNSKeyString() {
    if (this.m_uniqueNSKeyFlag) {
      this.m_uniqueNSKeyString = "[" + this.m_uniqueNSKeys[0];

      for (let i = 1; i < this.m_uniqueNSKeysTotal; ++i) {
        //this.m_uniqueNSKeyString += "-"+this.m_uniqueNSKeys[i];
        this.m_uniqueNSKeyString += "" + this.m_uniqueNSKeys[i];
      }

      this.m_uniqueNSKeyString += "]";
      return this.m_uniqueNSKeyString;
    }

    return "";
  }

  reset() {
    if (this.m_uniqueNSKeyFlag) {
      for (let i = 0; i < this.m_uniqueNSKeysTotal; ++i) {
        this.m_uniqueNSKeys[i] = 0;
      }

      this.m_uniqueNSKeyFlag = false;
    }
  }
  /**
   * apply camera position uniform in the shader,the uniform vec4 data: [x, y, z, w]
   * @param vertEnabled whether apply camera position uniform in the vertex shader, the default value is false
   * @param fragEnabled whether apply camera position uniform in the fragment shader, the default value is true
   */


  useCameraPosition(vertEnabled = false, fragEnabled = true) {
    if (vertEnabled) {
      this.m_codeBuilder.addVertUniformParam(UniformConst_1.default.CameraPosParam);
    }

    if (fragEnabled) {
      this.m_codeBuilder.addFragUniformParam(UniformConst_1.default.CameraPosParam);
    }
  }
  /**
   * apply view parameters uniform in the shader,the uniform vec4 data: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
   * @param vertEnabled whether apply view parameters uniform in the vertex shader, the default value is false
   * @param fragEnabled whether apply view parameters uniform in the fragment shader, the default value is true
   */


  useViewPort(vertEnabled = false, fragEnabled = true) {
    if (vertEnabled) {
      this.m_codeBuilder.addVertUniformParam(UniformConst_1.default.ViewportParam);
    }

    if (fragEnabled) {
      this.m_codeBuilder.addFragUniformParam(UniformConst_1.default.ViewportParam);
    }
  }
  /**
   * apply frustum parameters uniform in the shader,the uniform vec4 data: [camera zNear,camera zFar, camera nearPlaneHalfWidth, camera nearPlaneHalfHeight]
   * @param vertEnabled whether apply frustum parameters uniform in the vertex shader, the default value is false
   * @param fragEnabled whether apply frustum parameters uniform in the fragment shader, the default value is true
   */


  useFrustum(vertEnabled = false, fragEnabled = true) {
    if (vertEnabled) {
      this.m_codeBuilder.addVertUniformParam(UniformConst_1.default.FrustumParam);
    }

    if (fragEnabled) {
      this.m_codeBuilder.addFragUniformParam(UniformConst_1.default.FrustumParam);
    }
  }
  /**
   * apply stage parameters uniform in the shader,the uniform vec4 data: [2.0/stageWidth,2.0/stageHeight, stageWidth,stageHeight]
   * @param vertEnabled whether apply stage parameters uniform in the vertex shader, the default value is false
   * @param fragEnabled whether apply stage parameters uniform in the fragment shader, the default value is true
   */


  useStage(vertEnabled, fragEnabled) {
    if (vertEnabled) {
      this.m_codeBuilder.addVertUniformParam(UniformConst_1.default.StageParam);
    }

    if (fragEnabled) {
      this.m_codeBuilder.addFragUniformParam(UniformConst_1.default.StageParam);
    }
  }
  /**
   * add diffuse map uniform code
   */


  addDiffuseMap() {
    this.m_codeBuilder.addTextureSample2D("VOX_DIFFUSE_MAP", true, true, false);
    this.m_uniqueNSKeys[0] = 1;
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add normal map uniform code
   */


  addNormalMap() {
    this.m_codeBuilder.addTextureSample2D("VOX_NORMAL_MAP", true, true, false);
    this.m_codeBuilder.normalMapEnabled = true;
    this.m_uniqueNSKeys[1] = 1;
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add parallax map uniform code
   * @param parallaxParamIndex parallax map parameter uniform data array index
   */


  addParallaxMap(parallaxParamIndex) {
    this.m_codeBuilder.addTextureSample2D("VOX_PARALLAX_MAP", true, true, false);

    if (parallaxParamIndex >= 0) {
      this.m_codeBuilder.addDefine("VOX_PARALLAX_PARAMS_INDEX", "" + parallaxParamIndex);
      this.m_uniqueNSKeys[2] = 1 + (parallaxParamIndex << 1);
    } else {
      this.m_uniqueNSKeys[2] = 1;
    }

    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add displacement map uniform code
   * @param parallaxParamIndex vec4 param array index in the vertex shader
   */


  addDisplacementMap(displacementParamIndex) {
    this.m_codeBuilder.addTextureSample2D("VOX_DISPLACEMENT_MAP", true, false, true);

    if (displacementParamIndex >= 0) {
      this.m_codeBuilder.addDefine("VOX_DISPLACEMENT_PARAMS_INDEX", "" + displacementParamIndex);
      this.m_uniqueNSKeys[3] = 1 + (displacementParamIndex << 1);
    } else {
      this.m_uniqueNSKeys[3] = 1;
    }

    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add specular map uniform code
   * @param specularMode is SpecularMode type value, the default is SpecularMode.Default
   */


  addSpecularMap(specularMode = SpecularMode_1.SpecularMode.Default) {
    this.m_codeBuilder.addTextureSample2D("VOX_SPECULAR_MAP", true, true, false);
    this.m_codeBuilder.addDefine("VOX_SPECULAR_MODE", "" + specularMode);
    this.m_uniqueNSKeys[5] = 1 + (specularMode << 1);
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add shadow map uniform code
   * @param shadowMode is shadowMode type value, the default is ShadowMode.VSM
   */


  addShadowMap(shadowMode = ShadowMode_1.ShadowMode.VSM) {
    this.m_codeBuilder.addTextureSample2D("VOX_VSM_SHADOW_MAP", false, true, false);
    this.m_uniqueNSKeys[6] = 1 + (shadowMode << 1);
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add fog color map uniform code
   */


  addFogColorMap() {
    this.m_codeBuilder.addTextureSample2D("VOX_FOG_COLOR_MAP", true, true, false);
    this.m_uniqueNSKeys[7] = 1;
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add env specular cube map uniform code
   * @param cubeMap yes or no, the default is true
   */


  addSpecularEnvMap(cubeMap = true) {
    if (cubeMap) {
      this.m_codeBuilder.addTextureSampleCube("VOX_ENV_MAP", true, false);
    } else {
      this.m_codeBuilder.addTextureSample2D("VOX_ENV_MAP", true, true, false);
    }

    this.m_uniqueNSKeys[8] = 1;
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add ambient occlusion map uniform code
   */


  addAOMap() {
    this.m_codeBuilder.addTextureSample2D("VOX_AO_MAP", true, true, false);
    this.m_uniqueNSKeys[4] = 1;
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add roughness map uniform code
   */


  addRoughnessMap() {
    this.m_codeBuilder.addTextureSample2D("VOX_ROUGHNESS_MAP", true, true, false);
    this.m_uniqueNSKeys[9] = 1;
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add metalness map uniform code
   */


  addMetalnessMap() {
    this.m_codeBuilder.addTextureSample2D("VOX_METALNESS_MAP", true, true, false);
    this.m_uniqueNSKeys[10] = 1;
    this.m_uniqueNSKeyFlag = true;
  }
  /**
   * add ao, roughness, metalness map uniform code
   */


  addARMMap() {
    this.m_codeBuilder.addTextureSample2D("VOX_ARM_MAP", true, true, false);
    this.m_uniqueNSKeys[11] = 1;
    this.m_uniqueNSKeyFlag = true;
  }

  add2DMap(macroName = "", map2DEnabled = true, fragEnabled = true, vertEnabled = false) {
    this.m_codeBuilder.addTextureSample2D(macroName, map2DEnabled, fragEnabled, vertEnabled);
  }

  addCubeMap(macroName = "", fragEnabled = true, vertEnabled = false) {
    this.m_codeBuilder.addTextureSampleCube(macroName, fragEnabled, vertEnabled);
  }

  add3DMap(macroName = "", fragEnabled = true, vertEnabled = false) {
    this.m_codeBuilder.addTextureSample3D(macroName, fragEnabled, vertEnabled);
  }

}

exports.ShaderCodeUniform = ShaderCodeUniform;

/***/ }),

/***/ "36cb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RenderConst_1 = __webpack_require__("e08e");

const UniformConst_1 = __importDefault(__webpack_require__("ab73"));

const TextureRenderObj_1 = __webpack_require__("b02c");

const ShdUniformTool_1 = __importDefault(__webpack_require__("4f27"));

const RenderShader_1 = __importDefault(__webpack_require__("b30a"));

const ROTransPool_1 = __importDefault(__webpack_require__("9156"));

const GpuVtxObject_1 = __webpack_require__("670e");
/**
 * 本类实现了将 系统内存数据 合成为 渲染运行时系统所需的数据资源(包括: 渲染运行时管理数据和显存数据)
 */


class RODataBuilder {
  constructor(shdProgramBuilder) {
    this.m_emptyTRO = null;
    this.m_shader = null;
    this.m_rpoUnitBuilder = null;
    this.m_processBuider = null;
    this.m_roVtxBuild = null;
    this.m_rc = null;
    this.m_vtxRes = null;
    this.m_texRes = null;
    this.m_deferredVbufs = [];
    this.m_deferredTROs = [];
    this.m_deferredTextures = [];
    this.m_haveDeferredUpdate = false;
    this.m_shdpBuilder = null;
    this.m_shdpBuilder = shdProgramBuilder;
  }

  initialize(rc, rpoUnitBuilder, processBuider, roVtxBuild) {
    if (this.m_shader == null) {
      this.m_rc = rc;
      this.m_vtxRes = rc.Vertex;
      this.m_texRes = rc.Texture;
      this.m_shader = new RenderShader_1.default(rc.getRCUid(), rc.getRC(), rc.getRenderAdapter(), this.m_shdpBuilder);
      this.m_rpoUnitBuilder = rpoUnitBuilder;
      this.m_processBuider = processBuider;
      this.m_roVtxBuild = roVtxBuild;
      this.m_emptyTRO = new TextureRenderObj_1.EmptyTexRenderObj(this.m_texRes);
      this.m_shdUniformTool = new ShdUniformTool_1.default();
      this.m_shdUniformTool.initialize();
    }
  }

  getRenderProxy() {
    return this.m_rc;
  }

  getRenderShader() {
    return this.m_shader;
  }

  getTextureResource() {
    return this.m_texRes;
  }
  /**
   * update single texture self system memory data to gpu memory data
   */


  updateTextureData(textureProxy, deferred) {
    if (this.m_texRes.hasResUid(textureProxy.getResUid())) {
      if (deferred) {
        this.m_deferredTextures.push(textureProxy);
        this.m_haveDeferredUpdate = true;
      } else {
        textureProxy.__$updateToGpu(this.m_texRes);
      }
    }
  }
  /**
   * update display entity texture list  system memory data to gpu memory data
   */


  updateDispTRO(disp, deferred) {
    if (disp.__$ruid > -1) {
      if (deferred) {
        this.m_deferredTROs.push(disp);
        this.m_haveDeferredUpdate = true;
      } else {
        this.updateTextureTRO(disp);
      }
    }
  }

  createTRO(texList, texTotal) {
    if (texList != null) {
      for (let i = 0; i < texList.length; ++i) {
        if (texList[i] != null) {
          texList[i].__$setRenderProxy(this.m_rc);
        }
      }

      return TextureRenderObj_1.TextureRenderObj.Create(this.m_texRes, texList, texTotal);
    }

    return null;
  }

  updateTextureTRO(disp) {
    if (disp.__$$runit != null) {
      let material = disp.getMaterial();

      if (material != null) {
        let texRes = this.m_texRes;
        let runit = disp.__$$runit;
        let tro = TextureRenderObj_1.TextureRenderObj.GetByMid(texRes.getRCUid(), material.__$troMid);

        if (runit.tro != null && (tro == null || runit.tro.getMid() != tro.getMid())) {
          let shdp = this.m_shdpBuilder.findShdProgramByShdData(material.getShaderData());

          if (shdp != null) {
            if (shdp.getTexTotal() > 0) {
              if (tro == null) {
                tro = this.createTRO(material.getTextureList(), shdp.getTexTotal()); //tro = TextureRenderObj.Create(texRes, material.getTextureList(), shdp.getTexTotal());
              }

              if (runit.tro != tro) {
                if (runit.tro != null) {
                  runit.tro.__$detachThis();
                }

                runit.tro = tro;

                tro.__$attachThis();

                runit.texMid = runit.tro.getMid();
                this.m_processBuider.rejoinRunitForTro(runit);
                material.__$troMid = runit.tro.getMid();
              }
            } else {
              if (runit.tro != this.m_emptyTRO) {
                if (runit.tro != null) {
                  runit.tro.__$detachThis();
                }

                runit.tro = this.m_emptyTRO;
                runit.texMid = runit.tro.getMid();
                this.m_processBuider.rejoinRunitForTro(runit);
                material.__$troMid = runit.texMid;
              }
            }
          }
        }
      }
    }
  }

  updateDispMaterial(runit, disp) {
    let shdp = null;

    if (disp.__$ruid >= 0) {
      let rc = this.m_rc;
      let material = disp.getMaterial();

      if (material != null) {
        if (material.getShaderData() == null) {
          let texList = material.getTextureList();
          let texEnabled = texList != null && texList != null && texList.length > 0;
          material.initializeByCodeBuf(texEnabled);
        } // shdp = this.m_shader.create(material.getShaderData());


        shdp = this.m_shdpBuilder.create(material.getShaderData());
        shdp.upload(rc.RContext, rc.getUid());
        runit.shdUid = shdp.getUid();
        let tro = null;

        if (shdp.getTexTotal() > 0) {
          tro = this.createTRO(material.getTextureList(), shdp.getTexTotal()); //tro = TextureRenderObj.Create(this.m_texRes, material.getTextureList(), shdp.getTexTotal());

          if (runit.tro != tro) {
            if (runit.tro != null) {
              runit.tro.__$detachThis();
            }

            runit.tro = tro;

            tro.__$attachThis();

            runit.texMid = runit.tro.getMid();
            if (runit.__$rprouid >= 0) this.m_processBuider.rejoinRunitForTro(runit);
            material.__$troMid = runit.tro.getMid();
          }
        } else {
          if (runit.tro != this.m_emptyTRO) {
            if (runit.tro != null) {
              runit.tro.__$detachThis();
            }

            runit.tro = this.m_emptyTRO;
            runit.texMid = runit.tro.getMid();
            if (runit.__$rprouid >= 0) this.m_processBuider.rejoinRunitForTro(runit);
            material.__$troMid = runit.texMid;
          }
        }

        if (this.m_shader.getSharedUniformByShd(shdp) == null) {
          let sharedMList = this.createsharedMList(material, shdp);

          if (sharedMList != null) {
            for (let i = 0; i < sharedMList.length; ++i) {
              sharedMList[i].program = shdp.getGPUProgram();
            }
          }

          this.m_shader.setSharedUniformByShd(shdp, this.m_shdUniformTool.buildShared(sharedMList, rc, shdp));
        }

        let hasTrans = shdp.hasUniformByName(UniformConst_1.default.LocalTransformMatUNS);

        if (material.__$uniform == null) {
          material.__$uniform = this.m_shdUniformTool.buildLocalFromData(material.createSelfUniformData(), shdp);
        }

        if (hasTrans) {
          if (disp.getTransform() != null) {
            //console.log("disp.getTransform().getUid(): "+disp.getTransform().getUid());
            runit.transUniform = ROTransPool_1.default.GetTransUniform(disp.getTransform()); //console.log("RODataBuilder::updateDispMaterial(), get runit.transUniform: ",runit.transUniform);
          }
        } // console.log("RODataBuilder::updateDispMaterial(), runit: ",runit);
        // console.log("RODataBuilder::updateDispMaterial(), runit.uid: ",runit.getUid());
        //  console.log("RODataBuilder::updateDispMaterial(), runit.transUniform == null: ",runit.transUniform == null);


        if (runit.transUniform == null) {
          runit.transUniform = this.m_shdUniformTool.buildLocalFromTransformV(hasTrans ? disp.getMatrixFS32() : null, shdp);
          ROTransPool_1.default.SetTransUniform(disp.getTransform(), runit.transUniform);
        } else {
          runit.transUniform = this.m_shdUniformTool.updateLocalFromTransformV(runit.transUniform, hasTrans ? disp.getMatrixFS32() : null, shdp);
        }

        runit.polygonOffset = material.getPolygonOffset();
        runit.uniform = material.__$uniform;
      } else {
        console.log("Error RODataBuilder::updateDispMaterial(), material is null !!!");
      }
    }

    return shdp;
  }

  updateVtxDataToGpuByUid(vtxUid, deferred) {
    this.m_vtxRes.updateDataToGpu(vtxUid, deferred);
  }
  /**
   * update vertex system memory data to gpu memory data
   */


  updateDispVbuf(disp, deferred) {
    if (disp.__$ruid > -1) {
      if (deferred) {
        this.m_deferredVbufs.push(disp);
        this.m_haveDeferredUpdate = true;
      } else {
        let runit = disp.__$$runit;

        if (runit != null && runit.vtxUid != disp.vbuf.getUid()) {
          let oldResUid = runit.vtxUid;
          let vtxRes = this.m_vtxRes;

          if (vtxRes.hasResUid(oldResUid)) {
            vtxRes.__$detachRes(oldResUid);
          }

          runit.vro.__$detachThis(); // build vtx gpu data


          this.buildVtxRes(disp, runit, this.m_shdpBuilder.findShdProgramByUid(runit.shdUid));
          if (runit.__$rprouid >= 0) this.m_processBuider.rejoinRunitForVro(runit);
        }
      }
    }
  } // build vtx gpu data


  buildVtxRes(disp, runit, shdp) {
    if (disp.vbuf != null) {
      let vtxRes = this.m_vtxRes;
      runit.ivsIndex = disp.ivsIndex;
      runit.ivsCount = disp.ivsCount;
      runit.insCount = disp.insCount;
      runit.visible = disp.visible;
      runit.setVisible(disp.visible);
      runit.drawMode = disp.drawMode;
      runit.renderState = disp.renderState;
      runit.rcolorMask = disp.rcolorMask;
      runit.trisNumber = disp.trisNumber; // build vertex gpu resoure 

      let resUid = disp.vbuf.getUid();
      let vtx;
      let needBuild = true;

      if (vtxRes.hasResUid(resUid)) {
        vtx = vtxRes.getVertexRes(resUid);
        needBuild = vtx.version != disp.vbuf.version; //console.log("GpuVtxObject instance repeat to be used,needBuild: "+needBuild,vtx.getAttachCount());

        if (needBuild) {
          vtxRes.destroyRes(resUid);
          vtx.rcuid = vtxRes.getRCUid();
          vtx.resUid = resUid;
        }
      } else {
        vtx = new GpuVtxObject_1.GpuVtxObject();
        vtx.rcuid = vtxRes.getRCUid();
        vtx.resUid = resUid;
        vtxRes.addVertexRes(vtx); //console.log("GpuVtxObject instance create new: ",vtx.resUid);
      }

      if (needBuild) {
        vtx.indices.ibufStep = disp.vbuf.getIBufStep();
        vtx.indices.initialize(this.m_roVtxBuild, disp.vbuf);
        vtx.vertex.initialize(this.m_roVtxBuild, shdp, disp.vbuf);
        vtx.version = disp.vbuf.version;
      }

      vtxRes.__$attachRes(resUid);

      runit.vro = vtx.createVRO(this.m_roVtxBuild, shdp, true);
      runit.indicesRes = runit.vro.indicesRes;

      runit.vro.__$attachThis();

      runit.vtxUid = disp.vbuf.getUid();
      runit.ibufStep = runit.vro.ibufStep;
      runit.ibufType = runit.ibufStep != 4 ? this.m_rc.UNSIGNED_SHORT : this.m_rc.UNSIGNED_INT;
    }
  }

  buildGpuDisp(disp) {
    if (disp.__$ruid < 0) {
      if (disp.getMaterial() != null) {
        disp.__$$rsign = RenderConst_1.DisplayRenderSign.LIVE_IN_RENDERER;
        let runit = this.m_rpoUnitBuilder.create();
        disp.__$ruid = runit.uid;
        disp.__$$runit = runit;

        if (disp.getPartGroup() != null) {
          runit.partGroup = disp.getPartGroup().slice(0);
          runit.partTotal = runit.partGroup.length;
          let fs = runit.partGroup;

          for (let i = 0, len = runit.partTotal; i < len;) {
            i++;
            fs[i++] *= runit.ibufStep;
          }
        }

        runit.setDrawFlag(disp.renderState, disp.rcolorMask);
        this.buildVtxRes(disp, runit, this.updateDispMaterial(runit, disp));
        return true;
      } else {
        console.log("Error RODataBuilder::buildGpuDisp(), material is null !!!");
      }
    }

    return false;
  }

  update() {
    //this.updateDispToProcess();
    if (this.m_haveDeferredUpdate) {
      this.m_haveDeferredUpdate = false;
      let len = this.m_deferredVbufs.length;
      let i = 0;

      if (len > 0) {
        // deferred update vtx to gpu
        for (; i < len; ++i) {
          this.updateDispVbuf(this.m_deferredVbufs[i], false);
        }

        this.m_deferredVbufs = [];
      }

      len = this.m_deferredTROs.length;

      if (len > 0) {
        // deferred update texture list to gpu
        i = 0;

        for (; i < len; ++i) {
          this.updateTextureTRO(this.m_deferredTROs[i]);
        }

        this.m_deferredTROs = [];
      }

      len = this.m_deferredTextures.length;

      if (len > 0) {
        // deferred update single texture self system memory data to gpu memory data
        i = 0;

        for (; i < len; ++i) {
          this.m_deferredTextures[i].__$updateToGpu(this.m_texRes);
        }

        this.m_deferredTextures = [];
      }
    }
  }

  createsharedMList(material, shdp) {
    let sharedMList = material.createSharedUniforms();

    if (sharedMList == null) {
      // 通过shader uniform data 创建 shared uniform
      let dataList = material.createSharedUniformsData();

      if (dataList != null && dataList.length > 0) {
        sharedMList = [];

        for (let i = 0; i < dataList.length; ++i) {
          if (dataList[i] != null) {
            let uniform = this.m_shdUniformTool.buildLocalFromData(dataList[i], shdp);
            sharedMList.push(uniform);
          }
        }

        if (sharedMList.length < 1) {
          sharedMList = null;
        }
      }
    }

    return sharedMList;
  }

  updateGlobalMaterial(material, materialUniformUpdate = false) {
    if (material != null) {
      let rc = this.m_rc;
      let tro = null;
      let shdp = null;
      let texList = null;
      let texEnabled = false;

      if (material.getShaderData() == null) {
        texList = material.getTextureList();
        texEnabled = texList != null && texList.length > 0;
        material.initializeByCodeBuf(texEnabled);
      } else {
        texList = material.getTextureList();
      } // shdp = this.m_shader.create(material.getShaderData());


      shdp = this.m_shdpBuilder.create(material.getShaderData());
      shdp.upload(rc.RContext, rc.getUid());
      let texTotal = shdp.getTexTotal();

      if (texTotal > 0) {
        tro = this.createTRO(texList, texTotal); //tro = TextureRenderObj.Create(this.m_texRes, texList, texTotal);
      }

      if (this.m_shader.getSharedUniformByShd(shdp) == null) {
        let sharedMList = this.createsharedMList(material, shdp);

        if (sharedMList != null) {
          for (let i = 0; i < sharedMList.length; ++i) {
            sharedMList[i].program = shdp.getGPUProgram();
          }
        }

        this.m_shader.setSharedUniformByShd(shdp, this.m_shdUniformTool.buildShared(sharedMList, rc, shdp));
      }

      if (material.__$uniform == null) {
        material.__$uniform = this.m_shdUniformTool.buildLocalFromData(material.createSelfUniformData(), shdp);
      }

      this.m_shader.__$globalUniform = material.__$uniform;
      this.m_shader.bindToGpu(shdp.getUid());

      if (materialUniformUpdate && material.__$uniform != null) {
        this.m_shader.useUniform(material.__$uniform);
      }

      if (tro != null) {
        tro.run();
      }
    }
  }

  reset() {
    this.m_deferredVbufs = [];
    this.m_deferredTROs = [];
  }

}

exports.default = RODataBuilder;

/***/ }),

/***/ "3806":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const EventBase_1 = __importDefault(__webpack_require__("a996"));

const MouseEvent_1 = __importDefault(__webpack_require__("1710"));

const KeyboardEvent_1 = __importDefault(__webpack_require__("7045"));

const Keyboard_1 = __importDefault(__webpack_require__("9260"));

const MouseEvt3DDispatcher_1 = __importDefault(__webpack_require__("badb"));

class Stage3D {
  constructor(rcuid, pdocument) {
    this.m_rcuid = 0;
    this.uProbe = null;
    this.pixelRatio = 1.0;
    this.stageWidth = 800;
    this.stageHeight = 600; // 实际宽高, 和gpu端对齐

    this.stageHalfWidth = 400;
    this.stageHalfHeight = 300;
    this.mouseX = 0;
    this.mouseY = 0; // sdiv页面实际占据的像素宽高

    this.viewWidth = 800;
    this.viewHeight = 600;
    this.mouseViewX = 0;
    this.mouseViewY = 0;
    this.m_viewX = 0.0;
    this.m_viewY = 0.0;
    this.m_viewW = 1.0;
    this.m_viewH = 1.0; // mouse event dispatcher

    this.m_mouseEvtDispatcher = new MouseEvt3DDispatcher_1.default();
    this.m_resize_listener = [];
    this.m_resize_ers = [];
    this.m_enterFrame_listener = [];
    this.m_enterFrame_ers = [];
    this.m_keyEvt = new KeyboardEvent_1.default();
    this.m_keyDown_listener = [];
    this.m_keyDown_ers = [];
    this.m_keyUp_listener = [];
    this.m_keyUp_ers = [];
    this.m_preStageWidth = 0;
    this.m_preStageHeight = 0;
    this.m_mouseEvt = new MouseEvent_1.default();
    this.m_baseEvt = new EventBase_1.default(); // 是否舞台尺寸和view自动同步一致

    this.m_autoSynViewAndStageSize = true;
    this.m_enterFrameEvt = new EventBase_1.default();
    this.m_rcuid = rcuid;

    if (Stage3D.s_document == null) {
      Stage3D.s_document = pdocument;

      pdocument.onkeydown = function (evt) {
        Keyboard_1.default.KeyDown(evt);
      };

      pdocument.onkeyup = function (evt) {
        Keyboard_1.default.KeyUp(evt);
      };
    }

    Keyboard_1.default.AddEventListener(KeyboardEvent_1.default.KEY_DOWN, this, this.keyDown);
    Keyboard_1.default.AddEventListener(KeyboardEvent_1.default.KEY_UP, this, this.keyUp);
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }

  getViewX() {
    return this.m_viewX;
  }

  getViewY() {
    return this.m_viewY;
  }

  getViewWidth() {
    return this.m_viewW;
  }

  getViewHeight() {
    return this.m_viewH;
  }

  setViewPort(px, py, pw, ph) {
    this.m_autoSynViewAndStageSize = false;
    this.m_viewX = px;
    this.m_viewY = py;

    if (pw != this.m_viewW || ph != this.m_viewH) {
      this.m_viewW = pw;
      this.m_viewH = ph;
      this.updateViewUData();
    }
  }

  updateViewUData() {
    this.uProbe.setVec4Data(2.0 / this.stageWidth, 2.0 / this.stageHeight, this.stageWidth, this.stageHeight);
    this.uProbe.update();
    this.m_preStageWidth = this.m_viewW;
    this.m_preStageHeight = this.m_viewH;
  }

  update() {
    if (this.m_preStageWidth != this.stageWidth || this.m_preStageHeight != this.stageHeight) {
      if (this.m_autoSynViewAndStageSize) {
        this.m_viewW = this.stageWidth;
        this.m_viewH = this.stageHeight;
        this.updateViewUData();
      }

      this.stageHalfWidth = 0.5 * this.stageWidth;
      this.stageHalfHeight = 0.5 * this.stageHeight;
      this.m_baseEvt.target = this;
      this.m_baseEvt.type = EventBase_1.default.RESIZE;
      this.m_baseEvt.phase = 1;
      this.sendResizeEvt(this.m_baseEvt);
    }
  }

  keyDown(evt) {
    this.m_keyEvt.phase = 1;
    this.m_keyEvt.type = KeyboardEvent_1.default.KEY_DOWN;
    this.m_keyEvt.altKey = evt.altKey;
    this.m_keyEvt.ctrlKey = evt.ctrlKey;
    this.m_keyEvt.shiftKey = evt.shiftKey;
    this.m_keyEvt.repeat = evt.repeat;
    this.m_keyEvt.key = evt.key;
    this.m_keyEvt.keyCode = evt.keyCode;
    this.m_keyEvt.location = evt.location;
    let len = this.m_keyDown_listener.length;

    for (var i = 0; i < len; ++i) {
      this.m_keyDown_listener[i].call(this.m_keyDown_ers[i], this.m_keyEvt);
    }
  }

  keyUp(evt) {
    this.m_keyEvt.phase = 1;
    this.m_keyEvt.type = KeyboardEvent_1.default.KEY_UP;
    this.m_keyEvt.altKey = evt.altKey;
    this.m_keyEvt.ctrlKey = evt.ctrlKey;
    this.m_keyEvt.shiftKey = evt.shiftKey;
    this.m_keyEvt.repeat = evt.repeat;
    this.m_keyEvt.key = evt.key;
    this.m_keyEvt.keyCode = evt.keyCode;
    this.m_keyEvt.location = evt.location;
    this.m_keyEvt.target = this;
    let len = this.m_keyUp_listener.length;

    for (var i = 0; i < len; ++i) {
      this.m_keyUp_listener[i].call(this.m_keyUp_ers[i], this.m_keyEvt);
    }
  }

  sendResizeEvt(evt) {
    let len = this.m_resize_listener.length; //console.log("Stage3D::sendResizeEvt(), m_resize_listener.length: ",this.m_resize_listener.length);

    for (var i = 0; i < len; ++i) {
      this.m_resize_listener[i].call(this.m_resize_ers[i], evt);
    }
  }

  mouseDown(phase = 1) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_DOWN;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = phase;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseUp(phase = 1) {
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_UP;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = phase;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseClick() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_CLICK;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseDoubleClick() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_DOUBLE_CLICK;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseRightDown(phase = 1) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_RIGHT_DOWN;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseRightUp(phase = 1) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_RIGHT_UP;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseBgDown() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_BG_DOWN;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseBgUp() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_BG_UP;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseBgClick() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_BG_CLICK;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseRightClick() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_RIGHT_CLICK;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseMove() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_MOVE;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseWheel(evt) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_WHEEL;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.wheelDeltaY = evt.wheelDeltaY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  } // 等同于 touchCancle


  mouseCancel() {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_CANCEL;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  } //param [{x,y},{x,y},...]


  mouseMultiDown(posArray) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_MULTI_DOWN;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvt.posArray = posArray;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  } //param [{x,y},{x,y},...]


  mouseMultiUp(posArray) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_MULTI_UP;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvt.posArray = posArray;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  } //param [{x,y},{x,y},...]


  mouseMultiMove(posArray) {
    this.m_mouseEvt.type = MouseEvent_1.default.MOUSE_MULTI_MOVE;
    this.m_mouseEvt.mouseX = this.mouseX;
    this.m_mouseEvt.mouseY = this.mouseY;
    this.m_mouseEvt.target = this;
    this.m_mouseEvt.phase = 1;
    this.m_mouseEvt.posArray = posArray;
    this.m_mouseEvtDispatcher.dispatchEvt(this.m_mouseEvt);
  }

  mouseWindowUp(phase = 1) {}

  mouseWindowRightUp(phase = 1) {}

  enterFrame() {
    this.m_enterFrameEvt.type = EventBase_1.default.ENTER_FRAME;
    let len = this.m_enterFrame_listener.length;

    for (var i = 0; i < len; ++i) {
      this.m_enterFrame_listener[i].call(this.m_enterFrame_ers[i], this.m_enterFrameEvt);
    }
  }

  addEventListener(type, target, func, captureEnabled = true, bubbleEnabled = true) {
    if (func != null && target != null) {
      let i = 0;

      switch (type) {
        case EventBase_1.default.RESIZE:
          for (i = this.m_resize_listener.length - 1; i >= 0; --i) {
            if (target === this.m_resize_ers[i]) {
              break;
            }
          }

          if (i < 0) {
            this.m_resize_ers.push(target);
            this.m_resize_listener.push(func);
          }

          break;

        case EventBase_1.default.ENTER_FRAME:
          for (i = this.m_enterFrame_listener.length - 1; i >= 0; --i) {
            if (target === this.m_enterFrame_ers[i]) {
              break;
            }
          }

          if (i < 0) {
            this.m_enterFrame_ers.push(target);
            this.m_enterFrame_listener.push(func);
          }

          break;

        case KeyboardEvent_1.default.KEY_DOWN:
          for (i = this.m_keyDown_listener.length - 1; i >= 0; --i) {
            if (target === this.m_keyDown_ers[i]) {
              break;
            }
          }

          if (i < 0) {
            this.m_keyDown_ers.push(target);
            this.m_keyDown_listener.push(func);
          }

          break;

        case KeyboardEvent_1.default.KEY_UP:
          for (i = this.m_keyUp_listener.length - 1; i >= 0; --i) {
            if (target === this.m_keyUp_ers[i]) {
              break;
            }
          }

          if (i < 0) {
            this.m_keyUp_ers.push(target);
            this.m_keyUp_listener.push(func);
          }

          break;

        default:
          this.m_mouseEvtDispatcher.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
          break;
      }
    }
  }

  removeEventListener(type, target, func) {
    if (func != null && target != null) {
      let i = 0;

      switch (type) {
        case EventBase_1.default.RESIZE:
          for (i = this.m_resize_listener.length - 1; i >= 0; --i) {
            if (target === this.m_resize_ers[i]) {
              this.m_resize_ers.splice(i, 1);
              this.m_resize_listener.splice(i, 1);
              break;
            }
          }

          break;

        case EventBase_1.default.ENTER_FRAME:
          for (i = this.m_enterFrame_listener.length - 1; i >= 0; --i) {
            if (target === this.m_enterFrame_ers[i]) {
              this.m_enterFrame_ers.splice(i, 1);
              this.m_enterFrame_listener.splice(i, 1);
              break;
            }
          }

          break;

        case KeyboardEvent_1.default.KEY_DOWN:
          for (i = this.m_keyDown_listener.length - 1; i >= 0; --i) {
            if (target === this.m_keyDown_ers[i]) {
              this.m_keyDown_ers.splice(i, 1);
              this.m_keyDown_listener.splice(i, 1);
              break;
            }
          }

          break;

        case KeyboardEvent_1.default.KEY_UP:
          for (i = this.m_keyUp_listener.length - 1; i >= 0; --i) {
            if (target === this.m_keyUp_ers[i]) {
              this.m_keyUp_ers.splice(i, 1);
              this.m_keyUp_listener.splice(i, 1);
              break;
            }
          }

          break;

        default:
          this.m_mouseEvtDispatcher.removeEventListener(type, target, func);
          break;
      }
    }
  }

}

Stage3D.s_document = null;
exports.default = Stage3D;

/***/ }),

/***/ "3930":
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
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

class Color4 {
  constructor(pr = 1.0, pg = 1.0, pb = 1.0, pa = 1.0) {
    this.r = 1.0;
    this.g = 1.0;
    this.b = 1.0;
    this.a = 1.0;
    this.r = pr;
    this.g = pg;
    this.b = pb;
    this.a = pa;
  }

  setRGB3Bytes(r, g, b) {
    this.r = r / 255.0;
    this.g = g / 255.0;
    this.b = b / 255.0;
  }

  setRGB3f(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  setRGBUint24(rgbUint24) {
    this.r = (rgbUint24 >> 16 & 0x0000ff) / 255.0;
    this.g = (rgbUint24 >> 8 & 0x0000ff) / 255.0;
    this.b = (rgbUint24 & 0x0000ff) / 255.0;
  }

  setRGBA4f(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  copyFrom(c) {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    this.a = c.a;
  }

  copyFromRGB(c) {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
  }

  scaleBy(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;
  }

  inverseRGB() {
    this.r = 1.0 - this.r;
    this.g = 1.0 - this.g;
    this.b = 1.0 - this.b;
  }

  randomRGB(density = 1.0, bias = 0.0) {
    this.r = Math.random() * density;
    this.g = Math.random() * density;
    this.b = Math.random() * density;
    this.r += bias;
    this.g += bias;
    this.b += bias;
  }

  normalizeRandom(density = 1.0, bias = 0.0) {
    this.r = Math.random();
    this.g = Math.random();
    this.b = Math.random();
    let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);

    if (d > MathConst_1.default.MATH_MIN_POSITIVE) {
      this.r = density * this.r / d;
      this.g = density * this.g / d;
      this.b = density * this.b / d;
    }

    this.r += bias;
    this.g += bias;
    this.b += bias;
  }

  normalize(density) {
    if (density == undefined) density = 1.0;
    let d = Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);

    if (d > MathConst_1.default.MATH_MIN_POSITIVE) {
      this.r = density * this.r / d;
      this.g = density * this.g / d;
      this.b = density * this.b / d;
    }
  }
  /**
   * @returns for example: rgba(255,255,255,1.0)
   */


  getCSSDecRGBAColor() {
    let pr = Math.floor(this.r * 255.0);
    let pg = Math.floor(this.g * 255.0);
    let pb = Math.floor(this.b * 255.0);
    let pa = this.a; // pr = MathConst.Clamp(pr, 0, 255);
    // pg = MathConst.Clamp(pg, 0, 255);
    // pb = MathConst.Clamp(pb, 0, 255);
    // let pa = MathConst.Clamp(this.a, 0.0, 1.0);

    return "rgba(" + pr + "," + pg + "," + pb + "," + pa + ")";
  }
  /**
   * @returns for example: #350b7e
   */


  getCSSHeXRGBColor() {
    let str = "#";
    let t = Math.floor(this.r * 255.0);

    if (t < 0xf) {
      str += "0" + t.toString(16);
    } else {
      str += "" + t.toString(16);
    }

    t = Math.floor(this.g * 255.0);

    if (t < 0xf) {
      str += "0" + t.toString(16);
    } else {
      str += "" + t.toString(16);
    }

    t = Math.floor(this.b * 255.0);

    if (t < 0xf) {
      str += "0" + t.toString(16);
    } else {
      str += "" + t.toString(16);
    }

    return str;
  }

  toString() {
    return "[Color4(r=" + this.r + ", g=" + this.g + ",b=" + this.b + ",a=" + this.a + ")]";
  }

}

exports.default = Color4;

/***/ }),

/***/ "3b73":
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

class RendererDevice {
  /**
   * set web html body background color
   * @param color a color string, the default value is "white"
   */
  static SetWebBodyColor(color = "white") {
    const body = document.body;
    body.style.background = color;
  }

  static SetLanguage(language) {
    RendererDevice.s_language = language;
  }

  static GetLanguage() {
    if (RendererDevice.s_language != "") {
      return RendererDevice.s_language;
    }

    RendererDevice.s_language = navigator.language;
    return RendererDevice.s_language;
  }

  static SetThreadEnabled(boo) {
    RendererDevice.s_threadEnabled = boo;
  }

  static GetThreadEnabled() {
    return RendererDevice.s_threadEnabled;
  }

  static GetDebugEnabled() {
    return RendererDevice.s_debugEnabled;
  }

  static SetDebugEnabled(boo) {
    RendererDevice.s_debugEnabled = boo;
  }

  static SetDevicePixelRatio(dpr) {
    RendererDevice.s_devicePixelRatio = dpr;
  }

  static GetDevicePixelRatio() {
    return RendererDevice.s_devicePixelRatio;
  }

  static Initialize(infoArr) {
    if (RendererDevice.s_inited) {
      RendererDevice.s_inited = false;
      RendererDevice.s_WEBGL_VER = infoArr[0];
      RendererDevice.TestMobileWeb();
      RendererDevice.s_language = navigator.language + "";
    }
  }
  /**
   * 返回当前是不是window操作系统 PC端
   */


  static IsWindowsPCOS() {
    return !(RendererDevice.IsSafariWeb() || RendererDevice.IsMobileWeb());
  }
  /**
   * 得到windows系统环境下当前浏览器是否使用独立显卡。集显 integrated video card, 独显 external video card
   * get whether the gpu is external video card in window os
   * @returns get whether the gpu is external video card in window os
   */


  static IsWinExternalVideoCard() {
    if (RendererDevice.s_winExternalVideoCardFlag > 0) {
      return RendererDevice.s_winExternalVideoCardFlag == 2;
    }

    let flag = RendererDevice.IsSafariWeb() || RendererDevice.IsMobileWeb();

    if (!flag) {
      flag = RendererDevice.GPU_RENDERER.indexOf("Intel(R)") < 0;
    }

    RendererDevice.s_winExternalVideoCardFlag = flag ? 2 : 1;
    /**
     * webgl_renderer:  ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11-25.20.100.6617)
     */

    return RendererDevice.s_winExternalVideoCardFlag == 2;
  }

  static TestSafariWeb() {
    //return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    return /Safari/.test(navigator.userAgent) && /Mac OS/.test(navigator.userAgent);
  }

  static IsWebGL1() {
    return RendererDevice.s_WEBGL_VER == 1;
  }

  static IsWebGL2() {
    return RendererDevice.s_WEBGL_VER == 2;
  }

  static IsMobileWeb() {
    if (RendererDevice.s_mobileFlag > 0) {
      return RendererDevice.s_mobileFlag == 2;
    }

    return RendererDevice.TestMobileWeb();
  }

  static IsSafariWeb() {
    if (RendererDevice.s_safariFlag > 0) {
      return RendererDevice.s_safariFlag == 2;
    }

    RendererDevice.s_safariFlag = RendererDevice.TestSafariWeb() ? 2 : 1;
    return RendererDevice.s_safariFlag == 2;
  }

  static IsIOS() {
    if (RendererDevice.s_IOS_Flag > 0) {
      return RendererDevice.s_IOS_Flag == 2;
    }

    let boo = false;

    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
      boo = true;
    } else {
      boo = navigator.maxTouchPoints != undefined && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
    }

    RendererDevice.s_IOS_Flag = boo ? 2 : 1;
    return boo;
  }

  static IsIpadOS() {
    if (RendererDevice.s_IPad_Flag > 0) {
      return RendererDevice.s_IPad_Flag == 2;
    }

    let boo = navigator.maxTouchPoints > 0 && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);

    if (!boo && /iPod|iPad|iPadPro|iPodPro/i.test(navigator.userAgent)) {
      boo = true;
    }

    RendererDevice.s_IPad_Flag = boo ? 2 : 1;
    return boo;
  }

  static IsAndroidOS() {
    if (RendererDevice.s_Android_Flag > 0) {
      return RendererDevice.s_Android_Flag == 2;
    }

    let boo = RendererDevice.TestMobileWeb();

    if (boo && /Android|Linux/i.test(navigator.userAgent)) {
      boo = true;
    } else {
      boo = false;
    }

    RendererDevice.s_Android_Flag = boo ? 2 : 1;
    return boo;
  }

  static TestMobileWeb() {
    if (RendererDevice.s_mobileFlag > 0) {
      return RendererDevice.s_mobileFlag == 2;
    }

    if (/mobile/.test(location.href)) {
      RendererDevice.s_mobileFlag = 2;
      return RendererDevice.s_mobileFlag == 2;
    }

    if (/Android/i.test(navigator.userAgent)) {
      if (/Mobile/i.test(navigator.userAgent)) {
        RendererDevice.s_mobileFlag = 2;
        return RendererDevice.s_mobileFlag == 2;
      } else {
        RendererDevice.s_mobileFlag = 1;
        return RendererDevice.s_mobileFlag == 2;
      }
    } else if (/webOS|iPhone|iPod|iPad|iPodPro|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      RendererDevice.s_mobileFlag = 2;
      return RendererDevice.s_mobileFlag == 2;
    }

    RendererDevice.s_mobileFlag = 1;
    return RendererDevice.s_mobileFlag == 2;
  }

}

RendererDevice.s_inited = true;
RendererDevice.s_WEBGL_VER = 2;
RendererDevice.s_devicePixelRatio = 1.0;
RendererDevice.s_mobileFlag = 0;
RendererDevice.s_safariFlag = 0;
RendererDevice.s_Android_Flag = 0;
RendererDevice.s_IOS_Flag = 0;
RendererDevice.s_IPad_Flag = 0;
RendererDevice.s_winExternalVideoCardFlag = 0;
/**
 * zh-CN, en-US, ect....
 */

RendererDevice.s_language = "";
RendererDevice.s_debugEnabled = true;
RendererDevice.GPU_VENDOR = "unknown";
RendererDevice.GPU_RENDERER = "unknown";
RendererDevice.MAX_TEXTURE_SIZE = 4096;
RendererDevice.MAX_RENDERBUFFER_SIZE = 4096;
RendererDevice.MAX_VIEWPORT_WIDTH = 4096;
RendererDevice.MAX_VIEWPORT_HEIGHT = 4096; // for debug

RendererDevice.SHOWLOG_ENABLED = false;
RendererDevice.SHADERCODE_TRACE_ENABLED = false; // true: force vertex shader precision to highp

RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true; // true: force fragment shader precision to highp

RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true; // worker multi threads enabled yes or no

RendererDevice.s_threadEnabled = true; //import RendererDevice from
//import RendererDevice from

exports.default = RendererDevice;

/***/ }),

/***/ "3c81":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const PoolNodeBuilder_1 = __importDefault(__webpack_require__("2be1"));

const RenderProcess_1 = __importDefault(__webpack_require__("7696"));

class RenderProcessBuider extends PoolNodeBuilder_1.default {
  setCreateParams(shader, rpoNodeBuilder, rpoUnitBuilder, vtxResource, batchEnabled, fixedState) {
    this.m_shader = shader;
    this.m_rpoNodeBuilder = rpoNodeBuilder;
    this.m_rpoUnitBuilder = rpoUnitBuilder;
    this.m_vtxResource = vtxResource;
    this.m_batchEnabled = batchEnabled;
    this.m_fixedState = fixedState;
  }

  createNode() {
    return new RenderProcess_1.default(this.m_shader, this.m_rpoNodeBuilder, this.m_rpoUnitBuilder, this.m_vtxResource, this.m_batchEnabled, this.m_fixedState);
  }

  rejoinRunitForTro(runit) {
    this.getNodeByUid(runit.__$rprouid).rejoinRunitForTro(runit);
  }

  rejoinRunitForVro(runit) {
    this.getNodeByUid(runit.__$rprouid).rejoinRunitForVro(runit);
  }

}

exports.default = RenderProcessBuider;

/***/ }),

/***/ "442e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2019-2022 by                                                 */

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

const PoolNodeBuilder_1 = __importDefault(__webpack_require__("2be1"));

const RPONode_1 = __importDefault(__webpack_require__("265e"));
/*
 * render process object node pool management
 */


class RPONodeBuilder extends PoolNodeBuilder_1.default {
  createNode() {
    return new RPONode_1.default();
  }

}

exports.default = RPONodeBuilder;

/***/ }),

/***/ "45db":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const VertexRenderObj_1 = __importDefault(__webpack_require__("8def"));

const VaoVertexRenderObj_1 = __importDefault(__webpack_require__("fa60"));

class ROVertexRes {
  constructor() {
    this.m_vtx = null;
    this.m_vtxUid = -1;
    this.m_gpuBufs = [];
    this.m_gpuBufsTotal = 0;
    this.m_type = 0;
    this.m_attribsTotal = 0;
    this.m_wholeStride = 0;
    this.m_typeList = null;
    this.m_offsetList = null;
    this.m_sizeList = null;
    this.m_vroList = [];
    this.m_vroListLen = 0;
  }

  updateToGpu(rc) {
    let len = this.m_gpuBufs.length;

    if (len > 0) {
      let vtx = this.m_vtx;

      if (this.version != vtx.vertexVer) {
        let usage = vtx.getBufDataUsage();
        let fvs;
        let sizeList = this.m_sizeList;

        for (let i = 0; i < len; ++i) {
          fvs = vtx.getF32DataAt(i);

          if (sizeList[i] >= fvs.length) {
            rc.bindArrBuf(this.m_gpuBufs[i]);
            rc.arrBufSubData(fvs, 0);
          } else {
            rc.bindArrBuf(this.m_gpuBufs[i]);
            rc.arrBufData(fvs, usage);
            sizeList[i] = fvs.length;
          }
        }

        this.version = vtx.vertexVer;
      }
    }
  } //private m_preCombinedSize: number = 0;


  uploadCombined(rc, shdp) {
    let vtx = this.m_vtx;
    let fvs = vtx.getF32DataAt(0); //console.log("uploadCombined combSize: ",this.m_preCombinedSize, fvs.length);
    //this.m_preCombinedSize = fvs.length;

    this.m_gpuBufs.push(rc.createBuf());
    rc.bindArrBuf(this.m_gpuBufs[0]); // console.log("uploadCombined, this.m_gpuBufs: "+this.m_gpuBufs);

    rc.arrBufData(fvs, vtx.getBufDataUsage());
    this.m_gpuBufsTotal = 1;
    this.m_sizeList = [fvs.length];

    if (this.m_typeList == null) {
      this.m_wholeStride = 0;
      this.m_typeList = new Array(this.m_attribsTotal);
      this.m_offsetList = new Array(this.m_attribsTotal);
      let typeList = vtx.getBufTypeList();
      let sizeList = vtx.getBufSizeList();

      if (typeList != null) {
        for (let i = 0; i < this.m_attribsTotal; ++i) {
          this.m_offsetList[i] = this.m_wholeStride;
          this.m_wholeStride += sizeList[i] * 4;
          this.m_typeList[i] = typeList[i];
        }
      } else {
        for (let i = 0; i < this.m_attribsTotal; ++i) {
          this.m_offsetList[i] = this.m_wholeStride;
          this.m_wholeStride += shdp.getLocationSizeByIndex(i) * 4;
          this.m_typeList[i] = shdp.getLocationTypeByIndex(i);
        }
      }
    }
  }

  uploadSeparated(rc, shdp) {
    let vtx = this.m_vtx;
    let i = 0;
    let buf = null;
    let dataUsage = vtx.getBufDataUsage();
    this.m_gpuBufsTotal = this.m_vtx.getBuffersTotal();
    this.m_sizeList = new Array(this.m_attribsTotal); // console.log("uploadSeparated, this.m_gpuBufs: "+this.m_gpuBufs);

    if (vtx.bufData == null) {
      for (; i < this.m_attribsTotal; ++i) {
        buf = rc.createBuf();
        this.m_gpuBufs.push(buf);
        rc.bindArrBuf(buf);
        rc.arrBufData(vtx.getF32DataAt(i), dataUsage);
        this.m_sizeList[i] = vtx.getF32DataAt(i).length;
      }
    } else {
      //console.log(">>>>>>>>vtxSepbuf use (this.bufData == null) : "+(this.bufData == null));
      let fs32 = null;
      let j = 0;
      let tot = 0;
      let offset = 0;
      let dataSize = 0;

      for (; i < this.m_attribsTotal; ++i) {
        buf = rc.createBuf(); //console.log("this.bufData.getAttributeDataTotalBytesAt("+i+"): "+this.bufData.getAttributeDataTotalBytesAt(i));

        this.m_gpuBufs.push(buf);
        rc.bindArrBuf(buf);
        rc.arrBufDataMem(vtx.bufData.getAttributeDataTotalBytesAt(i), dataUsage);
        offset = 0;
        dataSize = 0;
        tot = vtx.bufData.getAttributeDataTotalAt(i);

        for (j = 0; j < tot; ++j) {
          fs32 = vtx.bufData.getAttributeDataAt(i, j);
          dataSize += fs32.length;
          rc.arrBufSubData(fs32, offset);
          offset += fs32.byteLength;
        }

        this.m_sizeList[i] = dataSize;
      }
    }

    if (this.m_typeList == null) {
      this.m_typeList = new Array(this.m_attribsTotal);
      this.m_offsetList = new Array(this.m_attribsTotal);
      let typeList = vtx.getBufTypeList();
      let sizeList = vtx.getBufSizeList();

      if (typeList != null) {
        for (let i = 0; i < this.m_attribsTotal; ++i) {
          this.m_offsetList[i] = this.m_wholeStride;
          this.m_wholeStride += sizeList[i] * 4;
          this.m_typeList[i] = typeList[i];
        }
      } else {
        for (let i = 0; i < this.m_attribsTotal; ++i) {
          this.m_offsetList[i] = this.m_wholeStride;
          this.m_wholeStride += shdp.getLocationSizeByIndex(i) * 4;
          this.m_typeList[i] = shdp.getLocationTypeByIndex(i);
        }
      }

      this.m_wholeStride = 0;
    }
  }

  initialize(rc, shdp, vtx) {
    if (this.m_gpuBufs.length < 1 && vtx != null) {
      this.version = vtx.vertexVer;
      this.m_vtx = vtx;
      this.m_vtxUid = vtx.getUid();
      this.m_type = vtx.getType();
      let typeList = vtx.getBufTypeList(); //let sizeList: number[] = vtx.getBufSizeList();

      this.m_attribsTotal = typeList != null ? typeList.length : shdp.getLocationsTotal();

      if (shdp.getLocationsTotal() != vtx.getAttribsTotal()) {
        console.warn("shdp.getLocationsTotal() is " + shdp.getLocationsTotal() + " != vtx.getAttribsTotal() is " + vtx.getAttribsTotal() + "/" + (typeList != null ? typeList.length : 0));
      }

      if (this.m_type < 1) {
        // combined buf
        this.uploadCombined(rc, shdp);
      } else {
        // separated buf
        this.uploadSeparated(rc, shdp);
      }
    }
  }
  /**
   * get vro object attribute mix id
   */


  getVROMid(rc, shdp, vaoEnabled, ibufId) {
    let mid = (131 + rc.getRCUid()) * this.m_vtxUid;
    if (vaoEnabled) mid = mid * 131 + 1;
    mid = mid * 131 + shdp.getMid();
    mid = mid * 131 + ibufId;
    return mid;
  } // 创建被 RPOUnit 使用的 vro 实例


  createVRO(rc, shdp, vaoEnabled, ibufRes, ibufId) {
    let attribsTotal = shdp.getLocationsTotal();

    if (this.m_attribsTotal * attribsTotal > 0 && attribsTotal <= this.m_attribsTotal) {
      let mid = this.getVROMid(rc, shdp, vaoEnabled, ibufId);
      let i = 0;
      let pvro = VaoVertexRenderObj_1.default.GetByMid(mid);

      if (pvro != null) {
        return pvro;
      } // console.log("VtxCombinedBuf::createVROBegin(), this.m_type: ",this.m_type, "mid: ",mid);
      // TODO(vilyLei): 暂时注释掉下面这行代码
      // let flag: boolean = shdp.testVertexAttribPointerOffset(this.m_offsetList);
      // console.log("createVRO testVertexAttribPointerOffset flag: ",flag, this.m_typeList);
      // DivLog.ShowLog("createVRO testVertexAttribPointerOffset flag: "+flag);


      if (vaoEnabled) {
        // vao 的生成要记录标记,防止重复生成, 因为同一组数据在不同的shader使用中可能组合方式不同，导致了vao可能是多样的
        // console.log("VtxCombinedBuf::createVROBegin(), "+this.m_typeList+" /// "+this.m_wholeStride+" /// "+this.m_offsetList);
        // console.log("VtxCombinedBuf::createVROBegin(), "+this.m_type);
        let vro = VaoVertexRenderObj_1.default.Create(rc, mid, this.m_vtx.getUid());
        vro.indicesRes = ibufRes;
        vro.vao = rc.createVertexArray();
        rc.bindVertexArray(vro.vao);

        if (this.m_type < 1) {
          // combined buf vro
          rc.bindArrBuf(this.m_gpuBufs[0]);

          for (i = 0; i < attribsTotal; ++i) {
            shdp.vertexAttribPointerTypeFloat(this.m_typeList[i], this.m_wholeStride, this.m_offsetList[i]);
          }
        } else {
          for (i = 0; i < attribsTotal; ++i) {
            rc.bindArrBuf(this.m_gpuBufs[i]);
            shdp.vertexAttribPointerTypeFloat(this.m_typeList[i], 0, 0);
          }
        }

        pvro = vro;
        vro.ibuf = ibufRes.getGpuBuf(); // rc.bindEleBuf(vro.ibuf);

        rc.bindVertexArray(null);
      } else {
        let vro = VertexRenderObj_1.default.Create(rc, mid, this.m_vtx.getUid());
        vro.indicesRes = ibufRes;
        vro.shdp = shdp;
        vro.attribTypes = [];
        vro.wholeOffsetList = [];
        vro.wholeStride = this.m_wholeStride;

        if (this.m_type < 1) {
          vro.vbuf = this.m_gpuBufs[0];
        } else {
          vro.vbufs = this.m_gpuBufs;
        }

        for (i = 0; i < attribsTotal; ++i) {
          if (shdp.testVertexAttribPointerType(this.m_typeList[i])) {
            vro.attribTypes.push(this.m_typeList[i]); //vro.wholeOffsetList.push( this.m_offsetList[i] );

            vro.wholeOffsetList.push(0);
          }
        }

        vro.attribTypesLen = vro.attribTypes.length;
        vro.ibuf = ibufRes.getGpuBuf();
        pvro = vro;
      }

      this.m_vroList.push(pvro);
      ++this.m_vroListLen;
      return pvro;
    }

    return null;
  }

  destroy(rc) {
    if (this.m_gpuBufs.length > 0) {
      console.log("ROVertexRes::destroy(), type: " + this.m_type);
      this.m_type = -1;
      let i = 0;
      let vro = null;

      for (; i < this.m_vroListLen; ++i) {
        vro = this.m_vroList.pop();
        vro.restoreThis();
        this.m_vroList[i] = null;
      }

      this.m_vroListLen = 0;

      for (i = 0; i < this.m_attribsTotal; ++i) {
        rc.deleteBuf(this.m_gpuBufs[i]);
        this.m_gpuBufs[i] = null;
      }

      this.m_attribsTotal = 0;
      this.m_gpuBufs = [];
    }
  }

}

exports.ROVertexRes = ROVertexRes;

/***/ }),

/***/ "4a54":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const GLSLConverter_1 = __importDefault(__webpack_require__("81ce"));

const ShaderCompileInfo_1 = __importDefault(__webpack_require__("f208"));

const ShaderCode_1 = __webpack_require__("c164");

class ShaderCodeBuilder {
  constructor(uniform) {
    this.m_versionDeclare = `#version 300 es
`;
    this.m_preciousCode = `precision mediump float;
`;
    this.m_fragExt = [];
    this.m_vertExt = [];
    this.m_defineNames = [];
    this.m_defineValues = [];
    this.m_vertLayoutNames = [];
    this.m_vertLayoutTypes = [];
    this.m_fragOutputPrecises = [];
    this.m_fragOutputNames = [];
    this.m_fragOutputTypes = [];
    this.m_vertUniformNames = [];
    this.m_vertUniformTypes = [];
    this.m_fragUniformNames = [];
    this.m_fragUniformTypes = [];
    this.m_varyingNames = [];
    this.m_varyingTypes = [];
    this.m_fragFunctionBlocks = [];
    this.m_vertFunctionBlocks = [];
    this.m_textureSampleTypes = [];
    this.m_texturePrecises = [];
    this.m_textureMacroNames = [];
    this.m_texturePrecise = "";
    this.m_textureFlags = [];
    this.m_vertObjMat = false;
    this.m_vertViewMat = false;
    this.m_vertProjMat = false;
    this.m_fragObjMat = false;
    this.m_fragViewMat = false;
    this.m_fragProjMat = false;
    this.m_vertHeadCode = "";
    this.m_vertMainCode = "";
    this.m_fragHeadCode = "";
    this.m_fragMainCode = "";
    this.m_uniqueNSKeyString = "";
    this.m_uniqueNSKeysTotal = 10;
    this.m_use2DMap = false;
    /**
     * 记录 shader 预编译信息
     */

    this.m_preCompileInfo = null;
    this.fragHeadCodeUnlock = true;
    this.fragMainCodeUnlock = true;
    this.vertHeadCodeUnlock = true;
    this.vertMainCodeUnlock = true;
    this.autoBuildHeadCodeEnabled = true;
    this.mathDefineEanbled = true;
    this.normalEnabled = false;
    this.normalMapEnabled = false;
    this.mapLodEnabled = false;
    this.derivatives = false;
    this.vertMatrixInverseEnabled = false;
    this.vtxUVTransfromEnabled = false;
    this.fragMatrixInverseEnabled = false;
    let self = this;
    self.uniform = uniform;
  }

  getUniqueNSKeyID() {
    throw Error("can not use this function !!!");
    return this.uniform.getUniqueNSKeyID();
  }

  getUniqueNSKeyString() {
    let ns = this.m_uniqueNSKeyString;
    if (this.vtxUVTransfromEnabled) ns += "VtxUVT";
    if (this.normalEnabled) ns += "Nor";
    return this.uniform.getUniqueNSKeyString() + ns;
  }

  reset() {
    this.m_vertObjMat = true;
    this.m_vertViewMat = true;
    this.m_vertProjMat = true;
    this.m_fragObjMat = false;
    this.m_fragViewMat = false;
    this.m_fragProjMat = false;
    this.fragHeadCodeUnlock = true;
    this.fragMainCodeUnlock = true;
    this.vertHeadCodeUnlock = true;
    this.vertMainCodeUnlock = true;
    this.autoBuildHeadCodeEnabled = true;
    this.m_use2DMap = false;
    this.m_vertHeadCode = "";
    this.m_vertMainCode = "";
    this.m_fragHeadCode = "";
    this.m_fragMainCode = "";
    this.m_uniqueNSKeyString = "";
    this.m_vertExt = [];
    this.m_fragExt = [];
    this.m_vertLayoutNames = [];
    this.m_vertLayoutTypes = [];
    this.m_fragOutputPrecises = [];
    this.m_fragOutputNames = [];
    this.m_fragOutputTypes = [];
    this.m_varyingNames = [];
    this.m_varyingTypes = [];
    this.m_vertUniformNames = [];
    this.m_vertUniformTypes = [];
    this.m_fragUniformNames = [];
    this.m_fragUniformTypes = [];
    this.m_fragFunctionBlocks = [];
    this.m_vertFunctionBlocks = [];
    this.m_defineNames = [];
    this.m_defineValues = [];
    this.m_textureSampleTypes = [];
    this.m_texturePrecises = [];
    this.m_textureMacroNames = [];
    this.m_textureFlags = [];
    this.m_texturePrecise = "";
    this.mathDefineEanbled = true;
    this.normalEnabled = false;
    this.normalMapEnabled = false;
    this.mapLodEnabled = false;
    this.vertMatrixInverseEnabled = false;
    this.fragMatrixInverseEnabled = false;
    this.vtxUVTransfromEnabled = false;
    this.m_preCompileInfo = null;
    this.uniform.reset();
  }

  addUniqueNSKeyString(key) {
    this.m_uniqueNSKeyString += key;
  }
  /**
   * 预编译信息
   * @returns 返回预编译信息
   */


  getPreCompileInfo() {
    let info = this.m_preCompileInfo;
    this.m_preCompileInfo = null;
    return info;
  }

  useHighPrecious() {
    this.m_preciousCode = "precision highp float;";
  }

  useMediumPrecious() {
    this.m_preciousCode = "precision mediump float;";
  }

  useLowPrecious() {
    this.m_preciousCode = "precision lowp float;";
  }

  addDefine(name, value = "1") {
    if (!this.m_defineNames.includes(name)) {
      this.m_defineNames.push(name);
      this.m_defineValues.push(value);
      return true;
    }

    return false;
  }

  addVertLayout(type, name) {
    if (!this.m_vertLayoutNames.includes(name)) {
      this.m_vertLayoutNames.push(name);
      this.m_vertLayoutTypes.push(type);
    }
  }

  addFragOutputHighp(type, name) {
    if (!this.m_fragOutputNames.includes(name)) {
      this.m_fragOutputPrecises.push("highp");
      this.m_fragOutputNames.push(name);
      this.m_fragOutputTypes.push(type);
    }
  }

  addFragOutput(type, name) {
    if (!this.m_fragOutputNames.includes(name)) {
      this.m_fragOutputPrecises.push("");
      this.m_fragOutputNames.push(name);
      this.m_fragOutputTypes.push(type);
    }
  }

  addVarying(type, name) {
    if (!this.m_varyingNames.includes(name)) {
      this.m_varyingNames.push(name);
      this.m_varyingTypes.push(type);
    }
  }

  addVertUniform(type, name, arrayLength = 0) {
    if (!this.m_vertUniformNames.includes(name)) {
      if (arrayLength > 0) {
        this.m_vertUniformNames.push(name + "[" + arrayLength + "]");
      } else {
        this.m_vertUniformNames.push(name);
      }

      this.m_vertUniformTypes.push(type);
    }
  }

  addVertUniformParam(unifromParam) {
    this.addVertUniform(unifromParam.type, unifromParam.name, unifromParam.arrayLength);
  }

  addFragUniform(type, name, arrayLength = 0) {
    if (!this.m_fragUniformNames.includes(name)) {
      if (arrayLength > 0) {
        this.m_fragUniformNames.push(name + "[" + arrayLength + "]");
      } else {
        this.m_fragUniformNames.push(name);
      }

      this.m_fragUniformTypes.push(type);
    }
  }

  addFragUniformParam(unifromParam) {
    this.addFragUniform(unifromParam.type, unifromParam.name, unifromParam.arrayLength);
  }

  addVertAndFragUniform(type, name, arrayLength = 0) {
    this.addVertUniform(type, name, arrayLength);
    this.addFragUniform(type, name, arrayLength);
  }

  addFragFunction(codeBlock) {
    this.m_fragFunctionBlocks.push(codeBlock);
  }

  addVertFunction(codeBlock) {
    this.m_vertFunctionBlocks.push(codeBlock);
  }

  useTexturePreciseHighp() {
    this.m_texturePrecise = "highp";
  }

  addTextureSample2D(macroName = "", map2DEnabled = true, fragEnabled = true, vertEnabled = false) {
    if (macroName == "" || !this.m_textureMacroNames.includes(macroName)) {
      this.m_textureSampleTypes.push("sampler2D");
      this.m_textureMacroNames.push(macroName);
      this.m_texturePrecises.push(this.m_texturePrecise);
      let flag = 0;
      if (fragEnabled) flag |= 2;
      if (vertEnabled) flag |= 4;
      this.m_textureFlags.push(flag);
      this.m_texturePrecise = "";

      if (map2DEnabled) {
        this.m_use2DMap = true;
      }
    }
  }

  addTextureSampleCube(macroName = "", fragEnabled = true, vertEnabled = false) {
    if (macroName == "" || !this.m_textureMacroNames.includes(macroName)) {
      this.m_textureSampleTypes.push("samplerCube");
      this.m_textureMacroNames.push(macroName);
      this.m_texturePrecises.push(this.m_texturePrecise);
      let flag = 0;
      if (fragEnabled) flag |= 2;
      if (vertEnabled) flag |= 4;
      this.m_textureFlags.push(flag);
      this.m_texturePrecise = "";
    }
  }

  addTextureSample3D(macroName = "", fragEnabled = true, vertEnabled = false) {
    if (macroName == "" || !this.m_textureMacroNames.includes(macroName)) {
      this.m_textureSampleTypes.push("sampler3D");
      this.m_textureMacroNames.push(macroName);
      this.m_texturePrecises.push(this.m_texturePrecise);
      let flag = 0;
      if (fragEnabled) flag |= 2;
      if (vertEnabled) flag |= 4;
      this.m_textureFlags.push(flag);
      this.m_texturePrecise = "";
    }
  }

  isHaveTexture() {
    return this.m_textureSampleTypes.length > 0;
  }

  isHaveTexture2D() {
    return this.m_use2DMap;
  }
  /**
   * vertex shader 使用 空间变换矩阵
   * @param objMatEnabled object space(local space) to wrold space matrix4
   * @param viewMatEnabled world space to view space matrix4
   * @param projMatEnabled view space to projective space matrix4
   */


  useVertSpaceMats(objMatEnabled = true, viewMatEnabled = true, projMatEnabled = true) {
    this.m_vertObjMat = objMatEnabled;
    this.m_vertViewMat = viewMatEnabled;
    this.m_vertProjMat = projMatEnabled;
  }
  /**
   * fragment shader 使用 空间变换矩阵
   * @param objMatEnabled object space(local space) to wrold space matrix4
   * @param viewMatEnabled world space to view space matrix4
   * @param projMatEnabled view space to projective space matrix4
   */


  useFragSpaceMats(objMatEnabled = true, viewMatEnabled = true, projMatEnabled = true) {
    this.m_fragObjMat = objMatEnabled;
    this.m_fragViewMat = viewMatEnabled;
    this.m_fragProjMat = projMatEnabled;
  }

  addVertExtend(code) {
    this.m_vertExt.push(code);
  }

  addFragExtend(code) {
    this.m_fragExt.push(code);
  }

  addVertHeadCode(code) {
    if (code != "") this.m_vertHeadCode += "\n" + code;
  }

  addVertMainCode(code) {
    if (code != "") this.m_vertMainCode += "\n" + code;
  }

  addFragHeadCode(code) {
    if (code != "") this.m_fragHeadCode += "\n" + code;
  }

  addFragMainCode(code) {
    if (code != "") this.m_fragMainCode += "\n" + code;
  }

  addShaderObject(shaderObj) {
    if (this.fragHeadCodeUnlock) this.addFragHeadCode(shaderObj.frag_head);
    if (this.fragMainCodeUnlock) this.addFragMainCode(shaderObj.frag_body);
    if (this.vertHeadCodeUnlock) this.addVertHeadCode(shaderObj.vert_head);
    if (this.vertMainCodeUnlock) this.addVertMainCode(shaderObj.vert_body);
  }

  addShaderObjectHead(shaderObj) {
    if (this.fragHeadCodeUnlock) this.addFragHeadCode(shaderObj.frag_head);
    if (this.vertHeadCodeUnlock) this.addVertMainCode(shaderObj.vert_head);
  }

  autoBuildHeadCode() {
    this.addVertLayout("vec3", "a_vs");

    if (this.m_use2DMap || this.m_vertLayoutNames.includes("a_uvs")) {
      this.addVertLayout("vec2", "a_uvs");
      this.addVarying("vec2", "v_uv");
    }

    if (this.normalEnabled || this.normalMapEnabled || this.m_vertLayoutNames.includes("a_nvs")) {
      this.addVertLayout("vec3", "a_nvs");
      this.addVarying("vec3", "v_worldNormal");
      this.addVarying("vec3", "v_worldPosition");
      this.addDefine("VOX_USE_NORMAL");
    } // 保证 顶点shader 中 vtx数据的顺序 a_vs -> a_uvs -> a_nvs


    let words = ["a_vs", "a_uvs", "a_nvs"];
    let nameList = [];
    let typeList = [];

    for (; words.length > 0;) {
      let i = this.m_vertLayoutNames.indexOf(words[0]);

      if (i >= 0) {
        nameList.push(this.m_vertLayoutNames[i]);
        typeList.push(this.m_vertLayoutTypes[i]);
        this.m_vertLayoutNames.splice(i, 1);
        this.m_vertLayoutTypes.splice(i, 1);
      }

      words.shift();
    }

    this.m_vertLayoutNames = nameList.concat(this.m_vertLayoutNames);
    this.m_vertLayoutTypes = typeList.concat(this.m_vertLayoutTypes);

    if (this.vtxUVTransfromEnabled) {
      this.addDefine("VOX_VTX_TRANSFORM_PARAM_INDEX", "0");
    }
  }

  buildFragCode() {
    if (this.autoBuildHeadCodeEnabled) {
      this.autoBuildHeadCode();
    }

    if (this.m_fragOutputNames.length < 1) {
      this.addFragOutput("vec4", "FragColor0");
    }

    let i = 0;
    let len = 0;
    let code = "";

    if (RendererDevice_1.default.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED || RendererDevice_1.default.IsMobileWeb()) {
      this.useHighPrecious();
    }

    if (RendererDevice_1.default.IsWebGL2()) {
      code += this.m_versionDeclare;
    }

    this.m_preCompileInfo = new ShaderCompileInfo_1.default();
    this.m_preCompileInfo.info = "\n//##COMPILE_INFO_BEGIN"; // complie info, for example: uniform info

    this.m_preCompileInfo.info += "\n//##COMPILE_INFO_END";
    i = 0;
    len = this.m_fragExt.length;

    for (; i < len; i++) {
      code += "\n" + this.m_fragExt[i];
    }

    if (RendererDevice_1.default.IsWebGL1()) {
      if (this.m_fragOutputNames.length > 1) {
        code += "\n#extension GL_EXT_draw_buffers: require";
      }

      if (this.normalMapEnabled || this.derivatives) {
        code += "\n#extension GL_OES_standard_derivatives : enable";
      }

      if (this.mapLodEnabled) {
        code += "\n#extension GL_EXT_shader_texture_lod : enable";
      }
    }

    if (RendererDevice_1.default.IsMobileWeb()) {
      code += "\nprecision highp float;";
    } else {
      code += "\n" + this.m_preciousCode;
    }

    if (RendererDevice_1.default.IsWebGL2()) {
      code += "\n#define VOX_GLSL_ES3 1";
      code += "\n#define VOX_IN in";

      if (this.mapLodEnabled) {
        code += "\n#define VOX_TextureCubeLod textureLod";
        code += "\n#define VOX_Texture2DLod textureLod";
      }

      code += "\n#define VOX_Texture2D texture";
      code += "\n#define VOX_TextureCube texture";
    } else {
      code += "\n#define VOX_GLSL_ES2 1";
      code += "\n#define VOX_IN varying";

      if (this.mapLodEnabled) {
        code += "\n#define VOX_TextureCubeLod textureCubeLodEXT";
        code += "\n#define VOX_Texture2DLod texture2DLodEXT";
      }

      code += "\n#define VOX_TextureCube textureCube";
      code += "\n#define VOX_Texture2D texture2D";
    }

    if (this.mathDefineEanbled) {
      code += ShaderCode_1.MathShaderCode.BasePredefined;
    }

    len = this.m_defineNames.length;

    for (i = 0; i < len; i++) {
      if (this.m_defineValues[i] != "") {
        code += "\n#define " + this.m_defineNames[i] + " " + this.m_defineValues[i];
      } else {
        code += "\n#define " + this.m_defineNames[i] + " 1";
      }
    }

    i = 0;
    len = this.m_textureMacroNames.length;

    for (; i < len; i++) {
      if (this.m_textureMacroNames[i] != "" && (this.m_textureFlags[i] & 2) != 0) {
        code += "\n#define " + this.m_textureMacroNames[i] + " u_sampler" + i + "";
      }
    }

    if (this.m_use2DMap) {
      code += "\n#define VOX_USE_2D_MAP 1";
    }

    i = 0;
    len = this.m_textureSampleTypes.length;

    for (; i < len; i++) {
      if ((this.m_textureFlags[i] & 2) != 0) {
        if (this.m_texturePrecises[i] == "") {
          code += "\nuniform " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
        } else {
          code += "\nuniform " + this.m_texturePrecises[i] + " " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
        }
      }
    }

    i = 0;
    len = this.m_fragUniformTypes.length;

    for (; i < len; i++) {
      code += "\nuniform " + this.m_fragUniformTypes[i] + " " + this.m_fragUniformNames[i] + ";";
    }

    if (this.m_fragObjMat) code += "\nuniform mat4 u_objMat;";
    if (this.m_fragViewMat) code += "\nuniform mat4 u_viewMat;";
    if (this.m_fragProjMat) code += "\nuniform mat4 u_projMat;";
    len = this.m_varyingNames.length;

    if (RendererDevice_1.default.IsWebGL2()) {
      for (i = 0; i < len; i++) {
        code += "\nin " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
      }
    } else {
      for (i = 0; i < len; i++) {
        code += "\nvarying " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
      }
    }

    code += ShaderCode_1.ShaderCode.BasePredefined;

    if (this.fragMatrixInverseEnabled && RendererDevice_1.default.IsWebGL1()) {
      this.addVertFunction(GLSLConverter_1.default.__glslInverseMat3);
      this.addVertFunction(GLSLConverter_1.default.__glslInverseMat4);
    }

    code += this.m_fragHeadCode;
    i = 0;
    len = this.m_fragFunctionBlocks.length;

    for (; i < len; i++) {
      code += "\n" + this.m_fragFunctionBlocks[i];
    }

    i = 0;
    len = this.m_fragOutputNames.length;

    if (RendererDevice_1.default.IsWebGL2()) {
      for (; i < len; i++) {
        if (this.m_fragOutputPrecises[i] != "") {
          code += "\nlayout(location = " + i + ") out " + this.m_fragOutputPrecises[i] + " " + this.m_fragOutputTypes[i] + " " + this.m_fragOutputNames[i] + ";";
        } else {
          code += "\nlayout(location = " + i + ") out " + this.m_fragOutputTypes[i] + " " + this.m_fragOutputNames[i] + ";";
        }
      }
    } else {
      if (len == 1) {
        code += "\n#define " + this.m_fragOutputNames[i] + " gl_FragColor";
      }
    } // 检测是否有 main函数


    let haveMainName = false;
    let index = this.m_fragMainCode.indexOf("{");

    if (index > 0) {
      let subStr = this.m_fragMainCode.slice(0, index);
      haveMainName = subStr.indexOf(" main") > 0;

      if (!haveMainName) {
        haveMainName = this.m_fragMainCode.indexOf(" main") > 0;
      }
    }

    if (haveMainName) {
      code += this.m_fragMainCode;
    } else {
      code += "\nvoid main() {\n";
      code += this.m_fragMainCode;
      code += "\n}\n";
    }

    len = this.m_fragOutputNames.length;

    if (RendererDevice_1.default.IsWebGL1()) {
      if (len > 1) {
        for (i = 0; i < len; i++) {
          let tempReg = new RegExp(this.m_fragOutputNames[i], "g");
          code = code.replace(tempReg, "gl_FragData[" + i + "]");
        }
      }
    }

    return code;
  }

  buildVertCode() {
    let i = 0;
    let len = 0;
    let code = "";

    if (RendererDevice_1.default.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
      this.useHighPrecious();
    }

    if (RendererDevice_1.default.IsWebGL2()) {
      code += this.m_versionDeclare;
    }

    i = 0;
    len = this.m_vertExt.length;

    for (; i < len; i++) {
      code += "\n" + this.m_vertExt[i];
    }

    if (RendererDevice_1.default.IsMobileWeb()) {
      code += "\nprecision highp float;";
    } else {
      code += "\n" + this.m_preciousCode;
    }

    if (RendererDevice_1.default.IsWebGL2()) {
      code += "\n#define VOX_GLSL_ES3 1";
      code += "\n#define VOX_IN in";

      if (this.mapLodEnabled) {
        code += "\n#define VOX_TextureCubeLod textureLod";
        code += "\n#define VOX_Texture2DLod textureLod";
      }

      code += "\n#define VOX_Texture2D texture";
      code += "\n#define VOX_TextureCube texture";
    } else {
      code += "\n#define VOX_GLSL_ES2 1";
      code += "\n#define VOX_IN varying";

      if (this.mapLodEnabled) {
        code += "\n#define VOX_TextureCubeLod textureCubeLodEXT";
        code += "\n#define VOX_Texture2DLod texture2DLodEXT";
      }

      code += "\n#define VOX_TextureCube textureCube";
      code += "\n#define VOX_Texture2D texture2D";
    }

    if (RendererDevice_1.default.IsWebGL2()) {
      code += "\n#define VOX_OUT out";
    } else {
      code += "\n#define VOX_OUT varying";
    }

    if (this.mathDefineEanbled) {
      code += ShaderCode_1.MathShaderCode.BasePredefined;
    }

    len = this.m_defineNames.length;

    for (i = 0; i < len; i++) {
      if (this.m_defineValues[i] != "") {
        code += "\n#define " + this.m_defineNames[i] + " " + this.m_defineValues[i];
      } else {
        code += "\n#define " + this.m_defineNames[i];
      }
    } //if (this.m_use2DMap) {
    //    code += "\n#define VOX_USE_2D_MAP 1";
    //}


    i = 0;
    len = this.m_textureMacroNames.length;

    for (; i < len; i++) {
      if (this.m_textureMacroNames[i] != "" && (this.m_textureFlags[i] & 4) != 0) {
        code += "\n#define " + this.m_textureMacroNames[i] + " u_sampler" + i + "";
      }
    }

    if (this.m_use2DMap) {
      code += "\n#define VOX_USE_2D_MAP 1";
    }

    i = 0;
    len = this.m_textureSampleTypes.length;

    for (; i < len; i++) {
      if ((this.m_textureFlags[i] & 4) != 0) {
        if (this.m_texturePrecises[i] == "") {
          code += "\nuniform " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
        } else {
          code += "\nuniform " + this.m_texturePrecises[i] + " " + this.m_textureSampleTypes[i] + " u_sampler" + i + ";";
        }
      }
    }

    len = this.m_vertLayoutNames.length;

    if (RendererDevice_1.default.IsWebGL2()) {
      for (i = 0; i < len; i++) {
        code += "\nlayout(location = " + i + ") in " + this.m_vertLayoutTypes[i] + " " + this.m_vertLayoutNames[i] + ";";
      }
    } else {
      for (i = 0; i < len; i++) {
        code += "\nattribute " + this.m_vertLayoutTypes[i] + " " + this.m_vertLayoutNames[i] + ";";
      }
    }

    len = this.m_vertUniformTypes.length;

    for (i = 0; i < len; i++) {
      code += "\nuniform " + this.m_vertUniformTypes[i] + " " + this.m_vertUniformNames[i] + ";";
    }

    if (this.m_vertObjMat) code += "\nuniform mat4 u_objMat;";
    if (this.m_vertViewMat) code += "\nuniform mat4 u_viewMat;";
    if (this.m_vertProjMat) code += "\nuniform mat4 u_projMat;";
    len = this.m_varyingNames.length;

    if (RendererDevice_1.default.IsWebGL2()) {
      for (i = 0; i < len; i++) {
        code += "\nout " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
      }
    } else {
      for (i = 0; i < len; i++) {
        code += "\nvarying " + this.m_varyingTypes[i] + " " + this.m_varyingNames[i] + ";";
      }
    }

    code += ShaderCode_1.ShaderCode.BasePredefined;
    code += ShaderCode_1.ShaderCode.VertPredefined;

    if (this.vertMatrixInverseEnabled && RendererDevice_1.default.IsWebGL1()) {
      this.addVertFunction(GLSLConverter_1.default.__glslInverseMat3);
      this.addVertFunction(GLSLConverter_1.default.__glslInverseMat4);
    }

    code += this.m_vertHeadCode;
    i = 0;
    len = this.m_vertFunctionBlocks.length;

    for (; i < len; i++) {
      code += "\n" + this.m_vertFunctionBlocks[i];
    } // 检测是否有 main函数


    let haveMainName = false;
    let index = this.m_vertMainCode.indexOf("{");

    if (index > 0) {
      let subStr = this.m_vertMainCode.slice(0, index);
      haveMainName = subStr.indexOf(" main") > 0;

      if (!haveMainName) {
        haveMainName = this.m_vertMainCode.indexOf(" main") > 0;
      }
    }

    if (haveMainName) {
      code += this.m_vertMainCode;
    } else {
      code += "\nvoid main() {\n";
      code += this.m_vertMainCode;
      code += "\n}\n";
    }

    return code;
  }

}

exports.default = ShaderCodeBuilder;

/***/ }),

/***/ "4cf7":
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

const TextureProxyType_1 = __webpack_require__("7918");
/**
 * 本类作基础纹理对象的对象池
 */


class TexturePool {
  constructor() {
    this.m_imgTexList = [];
    this.m_bytesTexList = [];
    this.m_floatTexList = [];
    this.m_wrapperTexList = [];
  }

  addTexture(texture) {
    switch (texture.getType()) {
      case TextureProxyType_1.TextureProxyType.Image:
        this.m_imgTexList.push(texture);
        break;

      case TextureProxyType_1.TextureProxyType.Bytes:
        this.m_bytesTexList.push(texture);
        break;

      case TextureProxyType_1.TextureProxyType.Float:
        this.m_floatTexList.push(texture);
        break;

      case TextureProxyType_1.TextureProxyType.Wrapper:
        this.m_wrapperTexList.push(texture);
        break;

      default:
        break;
    }
  }

  getTexture(type) {
    switch (type) {
      case TextureProxyType_1.TextureProxyType.Image:
        if (this.m_imgTexList.length > 0) {
          return this.m_imgTexList.pop();
        }

        break;

      case TextureProxyType_1.TextureProxyType.Bytes:
        if (this.m_bytesTexList.length > 0) {
          return this.m_bytesTexList.pop();
        }

        break;

      case TextureProxyType_1.TextureProxyType.Float:
        if (this.m_floatTexList.length > 0) return this.m_floatTexList.pop();
        break;

      case TextureProxyType_1.TextureProxyType.Wrapper:
        if (this.m_wrapperTexList.length > 0) return this.m_wrapperTexList.pop();
        break;

      default:
        break;
    }

    return null;
  }

}

exports.TexturePool = TexturePool;
exports.default = TexturePool;

/***/ }),

/***/ "4efa":
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

const SpecularMode_1 = __webpack_require__("839a");

const ShadowMode_1 = __webpack_require__("a9f4");

class ShaderTextureBuilder {
  constructor(uniform) {
    this.m_uniform = null;
    this.m_texList = [];
    this.m_uniform = uniform;
  }

  reset() {
    this.m_texList = [];
  }

  getTextures() {
    return this.m_texList;
  }

  getTexturesTotal() {
    return this.m_texList.length;
  }
  /**
   * add diffuse map uniform code
   */


  addDiffuseMap(tex) {
    if (tex != null) {
      this.m_uniform.addDiffuseMap();
      this.m_texList.push(tex);
    }
  }
  /**
   * add normal map uniform code
   */


  addNormalMap(tex) {
    if (tex != null) {
      this.m_uniform.addNormalMap();
      this.m_texList.push(tex);
    }
  }
  /**
   * add parallax map uniform code
   * @param parallaxParamIndex parallax map parameter uniform data array index
   */


  addParallaxMap(tex, parallaxParamIndex) {
    if (tex != null) {
      this.m_uniform.addParallaxMap(parallaxParamIndex);
      this.m_texList.push(tex);
    }
  }
  /**
   * add displacement map uniform code
   * @param parallaxParamIndex vec4 param array index in the vertex shader
   */


  addDisplacementMap(tex, displacementParamIndex) {
    if (tex != null) {
      this.m_uniform.addDisplacementMap(displacementParamIndex);
      this.m_texList.push(tex);
    }
  }
  /**
   * add specular map uniform code
   * @param specularMode is SpecularMode type value, the default is SpecularMode.Default
   */


  addSpecularMap(tex, specularMode = SpecularMode_1.SpecularMode.Default) {
    if (tex != null) {
      this.m_uniform.addSpecularMap(specularMode);
      this.m_texList.push(tex);
    }
  }
  /**
   * add shadow map uniform code
   * @param shadowMode is shadowMode type value, the default is ShadowMode.VSM
   */


  addShadowMap(tex, shadowMode = ShadowMode_1.ShadowMode.VSM) {
    if (tex != null) {
      this.m_uniform.addShadowMap(shadowMode);
      this.m_texList.push(tex);
    }
  }
  /**
   * add env specular cube map uniform code
   * @param cubeMap yes or no, the default is true
   */


  addSpecularEnvMap(tex, cubeMap = true) {
    if (tex != null) {
      this.m_uniform.addSpecularEnvMap(cubeMap);
      this.m_texList.push(tex);
    }
  }
  /**
   * add ambient occlusion map uniform code
   */


  addAOMap(tex) {
    if (tex != null) {
      this.m_uniform.addAOMap();
      this.m_texList.push(tex);
    }
  }
  /**
   * add roughness map uniform code
   */


  addRoughnessMap(tex) {
    if (tex != null) {
      this.m_uniform.addRoughnessMap();
      this.m_texList.push(tex);
    }
  }
  /**
   * add metalness map uniform code
   */


  addMetalnessMap(tex) {
    if (tex != null) {
      this.m_uniform.addMetalnessMap();
      this.m_texList.push(tex);
    }
  }
  /**
   * add ao, roughness, metalness map uniform code
   */


  addARMMap(tex) {
    if (tex != null) {
      this.m_uniform.addARMMap();
      this.m_texList.push(tex);
    }
  }
  /**
   * add sampler2d texture uniform code
   * @param tex 2d IRenderTexture instance
   * @param macroName shader code macro define name, the default vaule is empty string
   * @param map2DEnabled texture 2d enabled, the default vaule is true
   * @param fragEnabled fragment shader applying enabled, the default vaule is true
   * @param vertEnabled vertex shader applying enabled, the default vaule is false
   */


  add2DMap(tex, macroName = "", map2DEnabled = true, fragEnabled = true, vertEnabled = false) {
    if (tex != null) {
      this.m_uniform.add2DMap(macroName, map2DEnabled, fragEnabled, vertEnabled);
      this.m_texList.push(tex);
    }
  }
  /**
   * add sampleCube texture uniform code
   * @param tex cube IRenderTexture instance
   * @param macroName shader code macro define name, the default vaule is empty string
   * @param fragEnabled fragment shader applying enabled, the default vaule is true
   * @param vertEnabled vertex shader applying enabled, the default vaule is false
   */


  addCubeMap(tex, macroName = "", fragEnabled = true, vertEnabled = false) {
    if (tex != null) {
      this.m_uniform.addCubeMap(macroName, fragEnabled, vertEnabled);
      this.m_texList.push(tex);
    }
  }
  /**
   * add sample3D texture uniform code
   * @param tex 3d IRenderTexture instance
   * @param macroName shader code macro define name, the default vaule is empty string
   * @param fragEnabled fragment shader applying enabled, the default vaule is true
   * @param vertEnabled vertex shader applying enabled, the default vaule is false
   */


  add3DMap(tex, macroName = "", fragEnabled = true, vertEnabled = false) {
    if (tex != null) {
      this.m_uniform.add3DMap(macroName, fragEnabled, vertEnabled);
      this.m_texList.push(tex);
    }
  }

}

exports.ShaderTextureBuilder = ShaderTextureBuilder;

/***/ }),

/***/ "4f27":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const ShaderUniform_1 = __webpack_require__("d53d");

const CameraUniformBuilder_1 = __importDefault(__webpack_require__("2560"));

const StageParamUniformBuilder_1 = __importDefault(__webpack_require__("83d1"));

const FrustumUniformBuilder_1 = __importDefault(__webpack_require__("a7ed"));

const CameraPosUniformBuilder_1 = __importDefault(__webpack_require__("857b"));

const ViewParamUniformBuilder_1 = __importDefault(__webpack_require__("e87b"));

class EmptyShdUniform extends ShaderUniform_1.ShaderUniform {
  use(rc) {}

  useByLocation(rc, type, location, i) {}

  useByShd(rc, shd) {}

  updateData() {}

  destroy() {}

}

EmptyShdUniform.EmptyUniform = new EmptyShdUniform();

class ShdUniformTool {
  constructor() {
    this.m_initFlag = true;
    this.m_uniformDict = new Map();
    this.m_builders = [];
    this.m_buildersTot = 0;
    this.m_emptyUniform = new ShaderUniform_1.ShaderUniform();
  }

  appendUniformBuilder(builder) {
    if (!this.m_uniformDict.has(builder.getIDNS())) {
      this.m_builders.push(builder);
      this.m_uniformDict.set(builder.getIDNS(), builder);
      this.m_buildersTot = this.m_builders.length;
    }
  }

  initialize() {
    if (this.m_initFlag) {
      this.m_initFlag = false;
      this.appendUniformBuilder(new CameraUniformBuilder_1.default());
      this.appendUniformBuilder(new FrustumUniformBuilder_1.default());
      this.appendUniformBuilder(new CameraPosUniformBuilder_1.default());
      this.appendUniformBuilder(new StageParamUniformBuilder_1.default());
      this.appendUniformBuilder(new ViewParamUniformBuilder_1.default());
    }
  }

  addSharedUniformBuilder(builder) {
    if (builder != null && !this.m_uniformDict.has(builder.getIDNS())) {
      this.m_builders.push(builder);
      this.m_uniformDict.set(builder.getIDNS(), builder);
      ++this.m_buildersTot;
    }
  }

  removeSharedUniformBuilder(builder) {
    if (builder != null && this.m_uniformDict.has(builder.getIDNS())) {
      for (let i = 0; i < this.m_buildersTot; ++i) {
        if (builder == this.m_builders[i]) {
          this.m_builders.splice(i, 1);
          --this.m_buildersTot;
          break;
        }
      }

      this.m_uniformDict.delete(builder.getIDNS());
    }
  }

  removeSharedUniformBuilderByName(builderNS) {
    if (this.m_uniformDict.has(builderNS)) {
      let builder = this.m_uniformDict.get(builderNS);

      for (let i = 0; i < this.m_buildersTot; ++i) {
        if (builder == this.m_builders[i]) {
          this.m_builders.splice(i, 1);
          --this.m_buildersTot;
          break;
        }
      }

      this.m_uniformDict.delete(builderNS);
    }
  }

  buildShared(guniforms, rc, shdp) {
    let guniform;
    let headU = null;
    let prevU = null;
    let builders = this.m_builders;
    let i = 0;
    let len = this.m_buildersTot;
    let puo = null;

    for (; i < len; ++i) {
      puo = builders[i].create(rc, shdp);

      if (puo != null) {
        if (prevU != null) {
          prevU.next = puo;
        } else if (headU == null) {
          headU = puo;
        }

        prevU = puo;
      }
    }

    if (guniforms == null) {
      guniform = headU;
    } else if (headU != null) {
      for (let i = 0; i < guniforms.length; ++i) {
        prevU.next = guniforms[i];
        prevU = prevU.next;
      }

      guniform = headU;
    }

    if (guniform == null) {
      guniform = EmptyShdUniform.EmptyUniform;
    } else {
      // normalize uniform
      let pdata = guniform; //  let boo: boolean = false;
      //  if(pdata.uns == "u_projMat") {
      //      boo = true;
      //      console.log("u_projMat global build begin pdata.uns: ",pdata.uns);
      //  }

      let i = 0;

      while (pdata != null) {
        //  if(boo) {
        //      console.log("### u_projMat global build...pdata.uns: ",pdata.uns);
        //  }
        if (pdata.uniformNameList != null && pdata.locations == null) {
          pdata.types = [];
          pdata.locations = [];
          pdata.uniformSize = pdata.uniformNameList.length;

          for (i = 0; i < pdata.uniformSize; ++i) {
            pdata.types.push(shdp.getUniformTypeByNS(pdata.uniformNameList[i]));
            pdata.locations.push(shdp.getUniformLocationByNS(pdata.uniformNameList[i]));
          } //console.log("global uniform names: "+pdata.uniformNameList);
          //console.log("global uniform types: "+pdata.types);
          //console.log("global uniform locations: "+pdata.locations);

        }

        pdata = pdata.next;
      } //  if(boo) {
      //      console.log("u_projMat global build end pdata.uns: u_projMat.");
      //  }

    }

    return guniform;
  }

  buildLocalFromTransformV(transformData, shdp) {
    if (transformData != null) {
      let shdUniform;
      shdUniform = new ShaderUniform_1.ShaderMat4Uniform();
      shdUniform.uniformSize = 0;
      shdUniform.uniformNameList = [];
      shdUniform.types = [];
      shdUniform.locations = [];
      shdUniform.dataList = [];
      shdUniform.dataSizeList = [];
      shdUniform.uniformSize += 1;
      shdUniform.uniformNameList.push("u_objMat");
      shdUniform.types.push(shdp.getUniformTypeByNS("u_objMat"));
      shdUniform.locations.push(shdp.getUniformLocationByNS("u_objMat"));
      shdUniform.dataList.push(transformData);
      shdUniform.dataSizeList.push(1);
      return shdUniform;
    }

    return this.m_emptyUniform;
  }

  updateLocalFromTransformV(dstUniform, transformData, shdp) {
    if (transformData != null) {
      let shdUniform;
      let srcUniform = dstUniform;

      if (srcUniform == null) {
        srcUniform = new ShaderUniform_1.ShaderMat4Uniform();
        shdUniform = srcUniform;
        shdUniform.uniformSize = 0;
        shdUniform.uniformNameList = [];
        shdUniform.types = [];
        shdUniform.locations = [];
        shdUniform.dataList = [];
        shdUniform.dataSizeList = [];
        shdUniform.uniformSize += 1;
        shdUniform.uniformNameList.push("u_objMat");
        shdUniform.types.push(shdp.getUniformTypeByNS("u_objMat"));
        shdUniform.locations.push(shdp.getUniformLocationByNS("u_objMat"));
        shdUniform.dataList.push(transformData);
        shdUniform.dataSizeList.push(1);
      } else {
        shdUniform = srcUniform;
        shdUniform.locations = [];
        shdUniform.locations.push(shdp.getUniformLocationByNS("u_objMat"));
      }

      return shdUniform;
    }

    return this.m_emptyUniform;
  }

  buildLocalFromData(uniformData, shdp) {
    if (uniformData != null) {
      // collect all uniform data,create a new runned uniform
      let shdUniform;

      if (RendererDevice_1.default.IsWebGL1()) {
        shdUniform = new ShaderUniform_1.ShaderUniformV1();
      } else {
        shdUniform = new ShaderUniform_1.ShaderUniformV2();
      }

      shdUniform.uns = uniformData.uns;
      shdUniform.uniformNameList = [];
      shdUniform.types = [];
      shdUniform.locations = [];
      shdUniform.dataList = [];
      shdUniform.dataSizeList = [];
      shdUniform.uniformSize = 0;
      let pdata = uniformData;
      let i = 0;

      while (pdata != null) {
        if (pdata.uniformNameList != null && pdata.locations == null) {
          shdUniform.uniformSize += pdata.uniformNameList.length;

          for (i = 0; i < shdUniform.uniformSize; ++i) {
            shdUniform.uniformNameList.push(pdata.uniformNameList[i]);
            shdUniform.types.push(shdp.getUniformTypeByNS(pdata.uniformNameList[i]));
            shdUniform.locations.push(shdp.getUniformLocationByNS(pdata.uniformNameList[i]));
            shdUniform.dataList.push(pdata.dataList[i]);
            shdUniform.dataSizeList.push(shdp.getUniformLengthByNS(pdata.uniformNameList[i]));
          } // console.log("local uniform frome data names: ",shdUniform.uniformNameList);
          // console.log("local uniform frome data types: ",shdUniform.types);
          // console.log("local uniform frome data locations: ",shdUniform.locations);
          // console.log("local uniform frome data dataSizeList: ",shdUniform.dataSizeList);

        }

        pdata = pdata.next;
      }

      return shdUniform;
    }

    return EmptyShdUniform.EmptyUniform;
  }

}

exports.default = ShdUniformTool;

/***/ }),

/***/ "50e8":
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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

exports.RendererDevice = RendererDevice_1.default;

const RendererParam_1 = __importDefault(__webpack_require__("c497"));

exports.RendererParam = RendererParam_1.default;

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

exports.Vector3D = Vector3D_1.default;

const RenderStatusDisplay_1 = __importDefault(__webpack_require__("5336"));

const RendererScene_1 = __importDefault(__webpack_require__("b161"));

exports.RendererScene = RendererScene_1.default;

const ImageTextureLoader_1 = __importDefault(__webpack_require__("f63b"));

const UserInteraction_1 = __webpack_require__("da82");

const Matrix4_1 = __importDefault(__webpack_require__("18c7"));

exports.Matrix4 = Matrix4_1.default; //

/*
class Instance {
    constructor() {
    }
    createEnvLightModule(rsecne: IRendererScene): IEnvLightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new EnvLightModule(ctx);
    }
}
export { EnvLightModule, Instance };
//*/

/*
class Instance {
    constructor() {
    }
    createLightModule(rsecne: IRendererScene): ILightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new LightModule(ctx);
    }
}
export { LightModule, Instance };
//*/

/*
class VoxAppShadow {
    constructor() {

    }
    createVSMShadow(vsmFboIndex: number): IShadowVSMModule {
        return new ShadowVSMModule(vsmFboIndex);
    }
}
export { ShadowVSMModule, VoxAppShadow };
//*/

/*
class Instance implements IVoxAppBase {
    constructor() {

    }
    initialize(rsecne: IRendererScene): void {

        let rscene = rsecne;
        let materialBlock = new RenderableMaterialBlock();
        materialBlock.initialize();
        rscene.materialBlock = materialBlock;
        let entityBlock = new RenderableEntityBlock();
        entityBlock.initialize();
        rscene.entityBlock = entityBlock;
    }
    createDefaultMaterial(): IRenderMaterial {
        return new Default3DMaterial();
    }

}
// var pwin: any = window;
// pwin["VoxAppBase"] = Instance;
// export {VoxAppBase, Axis3DEntity, Box3DEntity, Sphere3DEntity};
export { Instance }
//*/
// /*

class Instance {
  constructor() {
    this.m_rscene = null;
    this.m_statusDisp = null;
    this.m_timeoutId = -1;
    this.m_timeDelay = 50;
    this.m_texLoader = null;
    this.interaction = new UserInteraction_1.UserInteraction();
  }

  getImageTexByUrl(purl, wrapRepeat = true, mipmapEnabled = true) {
    if (this.m_texLoader != null) {
      return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
    }

    return null;
  }

  addEntity(entity, processIndex = 0) {
    if (this.m_rscene != null) {
      this.m_rscene.addEntity(entity, processIndex, true);
    }
  }

  getRendererScene() {
    return this.m_rscene;
  }

  createRendererScene() {
    return new RendererScene_1.default();
  }

  initialize(debug = false, rparam = null, timeerDelay = 50, renderStatus = true) {
    console.log("VoxAppInstance::initialize()......");

    if (this.m_rscene == null) {
      this.m_timeDelay = timeerDelay;
      RendererDevice_1.default.SHADERCODE_TRACE_ENABLED = debug;
      RendererDevice_1.default.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
      RendererDevice_1.default.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
      console.log("XXX RendererDevice.SHADERCODE_TRACE_ENABLED: ", RendererDevice_1.default.SHADERCODE_TRACE_ENABLED);

      if (rparam == null) {
        rparam = new RendererParam_1.default(); // rparam.maxWebGLVersion = 1;

        rparam.setPolygonOffsetEanbled(false);
        rparam.setAttriAlpha(false);
        rparam.setAttriAntialias(!RendererDevice_1.default.IsMobileWeb());
        rparam.setCamProject(45.0, 30.0, 9000.0);
        rparam.setCamPosition(1800.0, 1800.0, 1800.0);
      }

      let rscene = new RendererScene_1.default();
      rscene.initialize(rparam, 7);
      this.m_rscene = rscene;
      this.interaction.initialize(this.m_rscene);
      this.m_texLoader = new ImageTextureLoader_1.default(this.m_rscene.textureBlock);

      if (renderStatus) {
        this.m_statusDisp = new RenderStatusDisplay_1.default();
        this.m_statusDisp.initialize();
      }

      this.update();
    }
  }

  update() {
    if (this.m_timeoutId > -1) {
      clearTimeout(this.m_timeoutId);
    }

    this.m_timeoutId = setTimeout(this.update.bind(this), this.m_timeDelay);
    if (this.m_statusDisp != null) this.m_statusDisp.render();
  }

  run() {
    if (this.m_statusDisp != null) this.m_statusDisp.update(false);

    if (this.m_rscene != null) {
      this.interaction.run();
      this.m_rscene.run(true);
    }
  }

}

exports.Instance = Instance; //*/

/*
// export class VoxAppInstance {
class VoxAppInstance {

    private m_rscene: RendererScene = null;
    private m_engine: EngineBase = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_timeoutId: any = -1;
    private m_timeDelay: number = 50;
    private m_texLoader: ImageTextureLoader = null;
    constructor() { }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        if(this.m_texLoader != null) {
            let ptex: IRenderTexture = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        return null;
    }
    addEntity(entity: IRenderEntity, processIndex: number = 0): void {
        if (this.m_rscene != null) {
            this.m_rscene.addEntity(entity, processIndex);
        }
    }
    getRendererScene(): RendererScene {
        return this.m_rscene;
    }
    createRendererScene(): RendererScene {
        return new RendererScene();
    }
    getEngine(): EngineBase {
        return this.m_engine;
    }
    initialize(rparam: RendererParam = null, timeerDelay: number = 50, renderStatus: boolean = true): void {
        console.log("VoxAppInstance::initialize()......");
        if (this.m_rscene == null) {

            this.m_timeDelay = timeerDelay;
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            if(rparam == null) rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setPolygonOffsetEanbled(false);
            rparam.setAttriAlpha(false);
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamProject(45.0, 30.0, 9000.0);
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);

            // this.m_rscene = new RendererScene();
            // this.m_rscene.initialize(rparam, 7);

            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam, 7);
            this.m_engine.setProcessIdListAt(0, [0,1,2,4,5,6]);
            this.m_rscene = this.m_engine.rscene;

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            if(renderStatus) {
                this.m_statusDisp = new RenderStatusDisplay();
                this.m_statusDisp.initialize();
            }

            this.update();
        }
    }
    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), this.m_timeDelay);
        if(this.m_statusDisp != null) this.m_statusDisp.update(true);
    }
    run(): void {
        if (this.m_engine != null) {
            if(this.m_statusDisp != null) this.m_statusDisp.update(false);
            this.m_engine.run();
        }
        // if(this.m_rscene != null) {
        //     this.m_rscene.run();
        // }
    }
}

// export default VoxAppInstance;
// export {RendererDevice, VoxAppInstance, Vector3D, Axis3DEntity, Box3DEntity, Sphere3DEntity, RendererParam, RendererScene}
export {RendererDevice, VoxAppInstance, Vector3D, Matrix4, RendererParam, RendererScene}
//*/

/***/ }),

/***/ "5216":
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
var MaterialPipeType;

(function (MaterialPipeType) {
  MaterialPipeType[MaterialPipeType["ENV_LIGHT_PARAM"] = 0] = "ENV_LIGHT_PARAM";
  MaterialPipeType[MaterialPipeType["ENV_AMBIENT_LIGHT"] = 1] = "ENV_AMBIENT_LIGHT";
  MaterialPipeType[MaterialPipeType["FOG"] = 2] = "FOG";
  MaterialPipeType[MaterialPipeType["FOG_EXP2"] = 3] = "FOG_EXP2";
  MaterialPipeType[MaterialPipeType["VSM_SHADOW"] = 4] = "VSM_SHADOW";
  MaterialPipeType[MaterialPipeType["GLOBAL_LIGHT"] = 5] = "GLOBAL_LIGHT";
})(MaterialPipeType || (MaterialPipeType = {}));

exports.MaterialPipeType = MaterialPipeType;

/***/ }),

/***/ "52e0":
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
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const TextureProxy_1 = __importDefault(__webpack_require__("0851"));

class BytesCubeTextureProxy extends TextureProxy_1.default {
  constructor(texWidth, texHeight) {
    super(texWidth, texHeight, false);
    this.m_imgDataList = null;
    this.m_texTarget = TextureConst_1.TextureTarget.TEXTURE_CUBE;
    this.mipmapEnabled = true;
    this.m_type = TextureProxyType_1.TextureProxyType.BytesCube;
  }

  toAlphaFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.ALPHA;
    this.internalFormat = TextureConst_1.TextureFormat.ALPHA;
    this.unpackAlignment = 1;
  }

  toRedFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RED;
    this.internalFormat = TextureConst_1.TextureFormat.RED;
    this.unpackAlignment = 1;
  }

  toRGBFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RGB;
    this.internalFormat = TextureConst_1.TextureFormat.RGB;
    this.unpackAlignment = 1;
  }

  toRGBAFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA;
    this.unpackAlignment = 4;
  }

  setDataFromBytesToFaceAt(index, bytes, pw, ph, miplevel = 0) {
    if (this.m_imgDataList == null) {
      this.m_imgDataList = [null, null, null, null, null, null];
    }

    if (pw > 0 && ph > 0) {
      if (index == 0 && miplevel < 1) {
        this.m_texWidth = pw;
        this.m_texHeight = ph;
        this.m_miplevel = miplevel;
      }

      if (this.m_imgDataList[index] == null) {
        this.m_imgDataList[index] = new Array(16);
      }

      let arr = this.m_imgDataList[index];
      arr[miplevel] = {
        width: pw,
        height: ph,
        imgData: bytes,
        miplevel: miplevel
      };
      this.m_haveRData = arr[miplevel].imgData != null;
    }
  }

  uploadData(texRes) {
    let gl = texRes.getRC();
    let imo = null;
    let width = this.getWidth();
    let height = this.getHeight();
    let pw;
    let ph;

    for (let i = 0; i < 6; ++i) {
      let arr = this.m_imgDataList[i];

      if (this.mipmapEnabled && this.m_generateMipmap) {
        imo = arr[0];
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat), width, height, 0, TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat), TextureConst_1.TextureDataType.ToGL(gl, this.dataType), imo.imgData);
      } else {
        pw = width;
        ph = height;
        let j = 0;

        for (; pw > 0 || ph > 0;) {
          if (arr[j] != null) {
            imo = arr[j];
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat), pw, ph, 0, TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat), TextureConst_1.TextureDataType.ToGL(gl, this.dataType), imo.imgData);
          }

          if (pw > 0) pw >>= 1;
          if (ph > 0) ph >>= 1;
          ++j;
        }
      }
    }

    this.version = 0;
  }

  toString() {
    return "[BytesCubeTextureProxy(name:" + this.name + ",uid=" + this.getUid() + ",width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

  __$destroy() {
    if (this.getAttachCount() < 1) {
      this.version = 0;

      if (this.m_imgDataList != null) {
        for (let i = 0; i < 6; ++i) {
          if (this.m_imgDataList[i] != null) {
            this.m_imgDataList[i].imgData = null;
          }
        }
      }

      console.log("BytesCubeTextureProxy::destroy(), destroy a BytesCubeTextureProxy instance...");

      super.__$destroy();
    }
  }

}

exports.default = BytesCubeTextureProxy;

/***/ }),

/***/ "5326":
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
 * 本类作为当前 renderer instance 的共享 uniform 数据管理类
 */

class UniformDataSlot {
  constructor(rcuid, total = 256) {
    this.m_total = 256;
    this.m_rcuid = 0;
    /**
     * 记录当前的数据序号，不可随意更改
     */

    this.index = 0;
    this.dataList = null;
    this.flagList = null;
    this.m_rcuid = rcuid;
    this.m_total = total;
    this.flagList = new Uint16Array(this.m_total);
    this.dataList = new Array(this.m_total);

    for (let i = 0; i < this.m_total; ++i) {
      this.dataList[i] = null;
      this.flagList[i] = 0;
    }
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

}

exports.UniformDataSlot = UniformDataSlot;

/***/ }),

/***/ "5336":
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

class RenderStatusDisplay {
  constructor() {
    this.m_lastTime = 0;
    this.m_fps = 60;
    this.m_canvas2D = null;
    this.m_ctx2D = null;
    this.m_delayTime = 10;
    this.m_preWidth = 128;
    this.m_width = 128;
    this.m_height = 70;
    this.delayTime = 40;
    this.statusInfo = "";
    this.statusEnbled = true;
  }

  initialize() {
    var pdocument = null;

    try {
      if (document != undefined) {
        pdocument = document;
      }
    } catch (err) {
      console.log("RenderStatusDisplay::initialize(), document is undefined.");
    }

    if (pdocument != null) {
      this.m_preWidth = window.innerWidth;
      let pwith = this.m_preWidth - 20;
      this.createCanvas(pwith);
    }
  }

  createCanvas(width) {
    if (this.m_canvas2D == null) {
      this.m_canvas2D = document.createElement('canvas');
      document.body.appendChild(this.m_canvas2D);
      this.m_canvas2D.style.display = 'bolck';
      this.m_canvas2D.style.left = '0px';
      this.m_canvas2D.style.top = '0px';
      this.m_canvas2D.style.position = 'absolute';
      this.m_canvas2D.style.backgroundColor = 'transparent';
      this.m_canvas2D.style.pointerEvents = 'none';
      this.m_canvas2D.height = this.m_height;
    }

    width = width < 10 ? 10 : width;
    this.m_canvas2D.width = width;
    this.m_ctx2D = this.m_canvas2D.getContext("2d");
    this.m_ctx2D.font = "50px Verdana";
    this.m_ctx2D.fillStyle = "red";
    this.m_ctx2D.textAlign = "left";
    this.m_width = this.m_canvas2D.width;
  }

  getFPS() {
    return this.m_fps;
  }

  getFPSStr() {
    //return this.m_fps;
    if (this.m_fps > 60) {
      return "FPS: 60";
    } else if (this.m_fps < 10) {
      return "FPS: 0" + this.m_fps;
    }

    return "FPS: " + this.m_fps;
  }

  render() {
    if (this.m_preWidth != window.innerWidth) {
      this.m_preWidth = window.innerWidth;
      let pwith = this.m_preWidth - 20;
      this.createCanvas(pwith);
    }

    if (this.statusEnbled) {
      this.m_ctx2D.clearRect(0, 0, this.m_width, this.m_height);
      this.m_ctx2D.fillText("FPS:" + this.m_fps + this.statusInfo, 5, 50); //  this.m_ctx2D.fillRect(0, 0, this.m_width, this.m_height);
    }
  }

  update(immediaterender = true) {
    if (this.m_delayTime > 0) {
      --this.m_delayTime;
      this.m_lastTime = Date.now();
    } else {
      if (this.m_ctx2D != null) {
        let t = Date.now();

        if (this.m_lastTime > 0) {
          this.m_lastTime = t - this.m_lastTime;
          if (this.m_lastTime < 1) this.m_lastTime = 1;
          this.m_fps = Math.round(1000.0 / this.m_lastTime);

          if (immediaterender) {
            this.render();
          }
        }

        this.m_lastTime = t;
      }

      this.m_delayTime = this.delayTime;
    }
  }

}

exports.default = RenderStatusDisplay;

/***/ }),

/***/ "53d3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererState_1 = __importDefault(__webpack_require__("29ef"));

class RenderingState {
  constructor() {
    this.NORMAL_STATE = 0;
    this.BACK_CULLFACE_NORMAL_STATE = 0;
    this.FRONT_CULLFACE_NORMAL_STATE = 1;
    this.NONE_CULLFACE_NORMAL_STATE = 2;
    this.ALL_CULLFACE_NORMAL_STATE = 3;
    this.BACK_NORMAL_ALWAYS_STATE = 4;
    this.BACK_TRANSPARENT_STATE = 5;
    this.BACK_TRANSPARENT_ALWAYS_STATE = 6;
    this.NONE_TRANSPARENT_STATE = 7;
    this.NONE_TRANSPARENT_ALWAYS_STATE = 8;
    this.FRONT_CULLFACE_GREATER_STATE = 9;
    this.BACK_ADD_BLENDSORT_STATE = 10;
    this.BACK_ADD_ALWAYS_STATE = 11;
    this.BACK_ALPHA_ADD_ALWAYS_STATE = 12;
    this.NONE_ADD_ALWAYS_STATE = 13;
    this.NONE_ADD_BLENDSORT_STATE = 14;
    this.NONE_ALPHA_ADD_ALWAYS_STATE = 15;
    this.FRONT_ADD_ALWAYS_STATE = 16;
    this.FRONT_TRANSPARENT_STATE = 17;
    this.FRONT_TRANSPARENT_ALWAYS_STATE = 18;
    this.NONE_CULLFACE_NORMAL_ALWAYS_STATE = 19;
    this.BACK_ALPHA_ADD_BLENDSORT_STATE = 20;
    let state = RendererState_1.default;
    let selfT = this;
    selfT.NORMAL_STATE = state.NORMAL_STATE;
    selfT.BACK_CULLFACE_NORMAL_STATE = state.BACK_CULLFACE_NORMAL_STATE;
    selfT.FRONT_CULLFACE_NORMAL_STATE = state.FRONT_CULLFACE_NORMAL_STATE;
    selfT.NONE_CULLFACE_NORMAL_STATE = state.NONE_CULLFACE_NORMAL_STATE;
    selfT.ALL_CULLFACE_NORMAL_STATE = state.ALL_CULLFACE_NORMAL_STATE;
    selfT.BACK_NORMAL_ALWAYS_STATE = state.BACK_NORMAL_ALWAYS_STATE;
    selfT.BACK_TRANSPARENT_STATE = state.BACK_TRANSPARENT_STATE;
    selfT.BACK_TRANSPARENT_ALWAYS_STATE = state.BACK_TRANSPARENT_ALWAYS_STATE;
    selfT.NONE_TRANSPARENT_STATE = state.NONE_TRANSPARENT_STATE;
    selfT.NONE_TRANSPARENT_ALWAYS_STATE = state.NONE_TRANSPARENT_ALWAYS_STATE;
    selfT.FRONT_CULLFACE_GREATER_STATE = state.FRONT_CULLFACE_GREATER_STATE;
    selfT.BACK_ADD_BLENDSORT_STATE = state.BACK_ADD_BLENDSORT_STATE;
    selfT.BACK_ADD_ALWAYS_STATE = state.BACK_ADD_ALWAYS_STATE;
    selfT.BACK_ALPHA_ADD_ALWAYS_STATE = state.BACK_ALPHA_ADD_ALWAYS_STATE;
    selfT.NONE_ADD_ALWAYS_STATE = state.NONE_ADD_ALWAYS_STATE;
    selfT.NONE_ADD_BLENDSORT_STATE = state.NONE_ADD_BLENDSORT_STATE;
    selfT.NONE_ALPHA_ADD_ALWAYS_STATE = state.NONE_ALPHA_ADD_ALWAYS_STATE;
    selfT.FRONT_ADD_ALWAYS_STATE = state.FRONT_ADD_ALWAYS_STATE;
    selfT.FRONT_TRANSPARENT_STATE = state.FRONT_TRANSPARENT_STATE;
    selfT.FRONT_TRANSPARENT_ALWAYS_STATE = state.FRONT_TRANSPARENT_ALWAYS_STATE;
    selfT.NONE_CULLFACE_NORMAL_ALWAYS_STATE = state.NONE_CULLFACE_NORMAL_ALWAYS_STATE;
    selfT.BACK_ALPHA_ADD_BLENDSORT_STATE = state.BACK_ALPHA_ADD_BLENDSORT_STATE;
  }

}

exports.RenderingState = RenderingState;

/***/ }),

/***/ "53ea":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const Plane_1 = __importDefault(__webpack_require__("e214"));

class CameraViewRay {
  constructor() {
    this.m_camera = null;
    this.m_stage = null;
    this.m_rlpv = new Vector3D_1.default();
    this.m_rltv = new Vector3D_1.default();
    this.m_pnv = new Vector3D_1.default(0.0, 1.0, 0.0);
    this.m_pdis = 0.0;
    /**
     * the intersection point in world space
     */

    this.position = new Vector3D_1.default();
  }

  bindCameraAndStage(camera, stage) {
    this.m_camera = camera;
    this.m_stage = stage;
  }

  setPlaneParam(plane_nv, plane_dis) {
    this.m_pnv.copyFrom(plane_nv);
    this.m_pnv.normalize();
    this.m_pdis = plane_dis;
  }
  /**
   * calculate the intersection point in world space
   */


  intersectPlane() {
    if (this.m_camera != null && this.m_stage != null) {
      this.m_camera.update();
      this.m_camera.getWorldPickingRayByScreenXY(this.m_stage.mouseX, this.m_stage.mouseY, this.m_rlpv, this.m_rltv);
      Plane_1.default.IntersectionSLV2(this.m_pnv, this.m_pdis, this.m_rlpv, this.m_rltv, this.position);
    }
  }

  destroy() {
    this.m_camera = null;
    this.m_stage = null;
  }

}

exports.default = CameraViewRay;

/***/ }),

/***/ "557f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const TextureProxy_1 = __importDefault(__webpack_require__("0851"));

class Texture3DProxy extends TextureProxy_1.default {
  constructor(texWidth, texHeight, tex3DDepth = 1, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.m_bytes = null;
    this.m_tex3DDepth = 1;
    this.internalFormat = TextureConst_1.TextureFormat.R8;
    this.srcFormat = TextureConst_1.TextureFormat.RED;
    this.m_tex3DDepth = tex3DDepth;
    this.m_texTarget = TextureConst_1.TextureTarget.TEXTURE_3D;
    this.m_type = TextureProxyType_1.TextureProxyType.Texture3D;
    this.unpackAlignment = 1;
  }

  getDepth() {
    return this.m_tex3DDepth;
  }

  uploadFromTypedArray(bytesData, miplevel = 0) {
    if (!this.isGpuEnabled()) {
      this.m_bytes = bytesData;
      this.m_miplevel = miplevel;
      this.m_haveRData = true;
    }
  }

  uploadData(texRes) {
    if (this.m_bytes != null) {
      let gl = texRes.getRC();
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage3D(gl.TEXTURE_3D, // target
      0, // level
      TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat), // internalformat,DEFAULT: gl.R8
      this.m_texWidth, // width
      this.m_texHeight, // height
      this.m_tex3DDepth, // depth
      0, // border
      TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat), // format,DEFAULT: gl.RED
      gl.UNSIGNED_BYTE, // type
      this.m_bytes // pixels
      );
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    }
  }

  __$destroy() {
    if (this.getAttachCount() < 1) {
      this.m_bytes = null;
      console.log("Texture3DProxy::destroy(), destroy a Texture3DProxy instance...");

      super.__$destroy();
    }
  }

  toString() {
    return "[Texture3DProxy(width=" + this.getWidth() + ",height=" + this.getHeight() + ",depth=" + this.getDepth() + ")]";
  }

}

exports.default = Texture3DProxy;

/***/ }),

/***/ "56c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RCExtension_1 = __importDefault(__webpack_require__("030e")); //import RCExtension = RCExtensionT.vox.render.RCExtension;
//import RAdapterContext = RAdapterContextT.vox.render.RAdapterContext;


class RenderFBOProxy {
  static SetRenderer(pr) {
    RenderFBOProxy.m_rc = pr.getRC();
    RenderFBOProxy.m_webGLVer = pr.getWebGLVersion();
    let thisT = RenderFBOProxy;

    if (RenderFBOProxy.m_webGLVer == 1) {
      if (RCExtension_1.default.WEBGL_draw_buffers != null) {
        thisT.COLOR_ATTACHMENT0 = RCExtension_1.default.WEBGL_draw_buffers.COLOR_ATTACHMENT0_WEBGL;
      } else {
        thisT.COLOR_ATTACHMENT0 = RenderFBOProxy.m_rc.COLOR_ATTACHMENT0;
      }
    } else {
      thisT.COLOR_ATTACHMENT0 = RenderFBOProxy.m_rc.COLOR_ATTACHMENT0;
    }
  }

  static DrawBuffers(attachments) {
    if (RenderFBOProxy.m_webGLVer == 2) {
      RenderFBOProxy.m_rc.drawBuffers(attachments);
    } else if (RCExtension_1.default.WEBGL_draw_buffers != null) {
      RCExtension_1.default.WEBGL_draw_buffers.drawBuffersWEBGL(attachments);
    }
  }

}

RenderFBOProxy.m_rc = null;
RenderFBOProxy.m_webGLVer = 2;
RenderFBOProxy.COLOR_ATTACHMENT0 = 0x0;
exports.default = RenderFBOProxy;

/***/ }),

/***/ "5d04":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const TexturePool_1 = __importDefault(__webpack_require__("4cf7"));

const ImageTextureProxy_1 = __importDefault(__webpack_require__("5e78"));

const BytesTextureProxy_1 = __importDefault(__webpack_require__("fe7f"));

const Uint16TextureProxy_1 = __importDefault(__webpack_require__("9f3e"));

const FloatTextureProxy_1 = __importDefault(__webpack_require__("f928"));

const FloatCubeTextureProxy_1 = __importDefault(__webpack_require__("eaee"));

const BytesCubeTextureProxy_1 = __importDefault(__webpack_require__("52e0"));

const ImageCubeTextureProxy_1 = __importDefault(__webpack_require__("d314"));

const Texture3DProxy_1 = __importDefault(__webpack_require__("557f"));

const TextureResSlot_1 = __importDefault(__webpack_require__("da6a"));

const RTTTextureStore_1 = __webpack_require__("ccdf");
/**
 * 本类作为所有基础纹理对象的管理类,只允许在RendererInstance之上的类中使用
 */


class TextureBlock {
  constructor() {
    this.m_texPool = new TexturePool_1.default();
    this.m_rttStore = null;
    this.m_renderProxy = null;
    this.m_texLoaders = [];
    this.m_clearDelay = 128;
  }

  addTexLoader(texLoader) {
    if (texLoader != null) {
      let i = 0;
      let il = this.m_texLoaders.length;

      for (; i < il; ++i) {
        if (texLoader == this.m_texLoaders[i]) {
          break;
        }
      }

      if (i >= il) {
        this.m_texLoaders.push(texLoader);
      }
    }
  }

  removeTexLoader(texLoader) {
    if (texLoader != null) {
      let i = 0;
      let il = this.m_texLoaders.length;

      for (; i < il; ++i) {
        if (texLoader == this.m_texLoaders[i]) {
          this.m_texLoaders.slice(i, 1);
          break;
        }
      }
    }
  }
  /**
   * 设置当前的渲染器
   * @param renderProxy 当前的渲染器
   */


  setRenderer(renderProxy) {
    this.m_renderProxy = renderProxy;
    TextureResSlot_1.default.GetInstance().setRenderProxy(renderProxy);

    if (this.m_rttStore == null && renderProxy != null) {
      this.m_rttStore = new RTTTextureStore_1.RTTTextureStore(renderProxy);
    }
  }

  getRTTStrore() {
    return this.m_rttStore;
  }

  createWrapperTex(pw, ph, powerof2Boo = false) {
    return this.m_rttStore.createWrapperTex(pw, ph, powerof2Boo);
  }

  createRTTTex2D(pw, ph, powerof2Boo = false) {
    let tex = this.m_rttStore.createRTTTex2D(pw, ph, powerof2Boo);

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

  createImageTex2D(pw, ph, powerof2Boo = false) {
    let tex = this.m_texPool.getTexture(TextureProxyType_1.TextureProxyType.Image);

    if (tex == null) {
      tex = new ImageTextureProxy_1.default(pw, ph, powerof2Boo);
    }

    tex.__$setRenderProxy(this.m_renderProxy);

    tex.mipmapEnabled = true;
    tex.setWrap(TextureConst_1.TextureConst.WRAP_REPEAT);
    return tex;
  }

  createHalfFloatTex2D(pw, ph, powerof2Boo = false) {
    let tex = this.m_texPool.getTexture(TextureProxyType_1.TextureProxyType.Float);

    if (tex == null) {
      tex = new FloatTextureProxy_1.default(pw, ph, powerof2Boo);
    }

    tex.__$setRenderProxy(this.m_renderProxy);

    tex.srcFormat = TextureConst_1.TextureFormat.RGBA;
    tex.dataType = TextureConst_1.TextureDataType.HALF_FLOAT_OES; //tex.srcFormat = TextureFormat.RGBA16F;
    //tex.dataType = TextureDataType.FLOAT;

    return tex;
  }

  createFloatTex2D(pw, ph, powerof2Boo = false) {
    let tex = this.m_texPool.getTexture(TextureProxyType_1.TextureProxyType.Float);

    if (tex == null) {
      tex = new FloatTextureProxy_1.default(pw, ph, powerof2Boo);
    }

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

  createUint16Tex2D(pw, ph, powerof2Boo = false) {
    return new Uint16TextureProxy_1.default(pw, ph, powerof2Boo);
  }

  createFloatCubeTex(pw, ph, powerof2Boo = false) {
    return new FloatCubeTextureProxy_1.default(pw, ph);
  }

  createBytesTex(texW, texH) {
    let tex = this.m_texPool.getTexture(TextureProxyType_1.TextureProxyType.Bytes);

    if (tex == null) {
      tex = new BytesTextureProxy_1.default(texW, texH);
    }

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

  createBytesCubeTex(texW, texH) {
    let tex = new BytesCubeTextureProxy_1.default(texW, texH);

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

  createImageCubeTex(texW, texH) {
    let tex = new ImageCubeTextureProxy_1.default(texW, texH);

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

  createTex3D(texW, texH, depth = 1) {
    if (depth < 1) {
      depth = 1;
    }

    let tex = new Texture3DProxy_1.default(texW, texH, depth);

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

  createRGBATex2D(pw, ph, color) {
    pw = pw > 1 ? pw : 1;
    ph = ph > 1 ? ph : 1;
    let tot = pw * ph;
    let tex = this.createBytesTex(pw, ph);
    let bytes = new Uint8Array(tot * 4);
    let pr = Math.round(color.r * 255.0);
    let pg = Math.round(color.g * 255.0);
    let pb = Math.round(color.b * 255.0);
    let pa = Math.round(color.a * 255.0);
    let k = 0;
    let fs = [pr, pg, pb, pa];

    for (let i = 0; i < tot; ++i) {
      bytes.set(fs, k);
      k += 4;
    }

    tex.setDataFromBytes(bytes, 0, pw, ph, 0, 0, false);

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
    return tex;
  }

  createAlphaTex2D(pw, ph, alpha) {
    pw = pw > 1 ? pw : 1;
    ph = ph > 1 ? ph : 1;
    let size = pw * ph;
    let tex = this.createBytesTex(pw, ph);
    tex.toAlphaFormat();
    let bytes = new Uint8Array(size);
    let value = Math.round(alpha * 255.0);
    bytes.fill(value, 0, size);
    tex.setDataFromBytes(bytes, 0, pw, ph, 0, 0, false);

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

  createAlphaTexBytes2D(pw, ph, bytes) {
    let tex = this.createBytesTex(pw, ph);
    tex.setDataFromBytes(bytes, 0, pw, ph, 0, 0, false);
    tex.toAlphaFormat();

    tex.__$setRenderProxy(this.m_renderProxy);

    return tex;
  }
  /**
   * get a system cube rtt texture
   * @param i rtt texture index in the system
   */


  getCubeRTTTextureAt(i) {
    return this.m_rttStore.getCubeRTTTextureAt(i);
  }

  createCubeRTTTextureAt(i, pw, ph) {
    return this.m_rttStore.createCubeRTTTextureAt(i, pw, ph);
  }

  getRTTTextureAt(i) {
    return this.m_rttStore.getRTTTextureAt(i);
  }

  createRTTTextureAt(i, pw, ph) {
    return this.m_rttStore.createRTTTextureAt(i, pw, ph);
  }

  getDepthTextureAt(i) {
    return this.m_rttStore.getDepthTextureAt(i);
  }

  createDepthTextureAt(i, pw, ph) {
    return this.m_rttStore.createDepthTextureAt(i, pw, ph);
  }

  getRTTFloatTextureAt(i) {
    return this.m_rttStore.getRTTFloatTextureAt(i);
  }

  createRTTFloatTextureAt(i, pw, ph) {
    return this.m_rttStore.createRTTFloatTextureAt(i, pw, ph);
  }

  run() {
    let i = 0;
    let il = this.m_texLoaders.length;

    for (; i < il; ++i) {
      this.m_texLoaders[i].run();
    }

    if (this.m_clearDelay < 1) {
      /**
       * 准备释放回收 texture resource.
       */
      let tex;
      this.m_clearDelay = 128;
      let freeMap = TextureResSlot_1.default.GetInstance().getFreeResUidMap();
      let total = 32;

      for (const [key, value] of freeMap) {
        if (total < 1) {
          break;
        }

        total--;

        if (value > 2) {
          freeMap.delete(key);
          tex = TextureResSlot_1.default.GetInstance().removeTextureByUid(key);

          if (tex != null) {
            this.m_texPool.addTexture(tex);
          } else {
            console.warn("TextureBlock remove a texture(uid=" + key + ") error.");
          }

          console.log("TextureBlock remove a texture: ", tex);
        } else {
          freeMap.set(key, value + 1);
        }
      }
    }

    this.m_clearDelay--;
  }

}

exports.TextureBlock = TextureBlock;

/***/ }),

/***/ "5e78":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const ImgTexData_1 = __importDefault(__webpack_require__("7181"));

const TextureProxy_1 = __importDefault(__webpack_require__("0851"));

class ImageTextureProxy extends TextureProxy_1.default {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.m_texData = null;
    this.m_texDatas = null;
    this.m_texDatasLen = 0;
    this.mipmapEnabled = true;
    this.minFilter = TextureConst_1.TextureConst.LINEAR_MIPMAP_LINEAR;
    this.m_type = TextureProxyType_1.TextureProxyType.Image;
  }

  getTexData() {
    return this.m_texData;
  }
  /**
   * 设置纹理原始数据，可以对纹理局部或者整体(rebuild = true)更新
   * @param img value from: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap
   * @param miplevel mipmaps level
  */


  setDataFromImage(img, miplevel = 0, offsetx = 0, offsety = 0, rebuild = false) {
    if (img != null && img.width > 0 && img.height > 0) {
      this.m_haveRData = true;
      if (miplevel < 0) miplevel = 0;
      if (miplevel > 15) miplevel = 15;

      if (miplevel >= this.m_texDatasLen) {
        this.m_texDatasLen = miplevel + 1;
      }

      let td = this.m_texData;

      if (td != null) {
        if (this.m_texData.miplevel != miplevel) {
          if (this.m_texDatas == null) {
            this.m_texDatas = [this.m_texData, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
          }

          td = this.m_texDatas[miplevel];

          if (td == null) {
            td = ImgTexData_1.default.Create();
            td.miplevel = miplevel;
            rebuild = true;
            this.m_texDatas[miplevel] = td;
          }
        } else if (this.isGpuEnabled()) {
          td.status = 0;
        }
      } else {
        td = this.m_texData = ImgTexData_1.default.Create();
        td.miplevel = miplevel;
        rebuild = true;
        this.m_texWidth = img.width;
        this.m_texHeight = img.height;
      }

      if (td.data != img || td.offsetx != offsetx || td.offsety != offsety) {
        if (miplevel == 0) {
          this.m_texWidth = img.width;
          this.m_texHeight = img.height;
        }

        td.data = img;
        td.status = 0; // 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新

        if (td.width < img.width || td.height < img.height || rebuild) {
          td.width = img.width;
          td.height = img.height;
          td.status = 1;
        }

        td.offsetx = offsetx;
        td.offsety = offsety;
      }

      this.version++;
    }
  }

  uploadData(texRes) {
    if (this.m_texData != null) {
      this.dataUploadToGpu(texRes.getRC(), this.m_texData, this.m_texDatas, true);
    }

    this.version = 0;
  }

  __$updateToGpu(texRes) {
    // 这里之所以用这种方式判断，是为了运行时支持多 gpu context
    if (this.version > 0 && texRes.hasResUid(this.getResUid())) {
      if (this.m_texData != null) {
        let gl = texRes.getRC();

        this.__$updateToGpuBegin(texRes);

        this.dataUploadToGpu(gl, this.m_texData, this.m_texDatas);

        this.__$buildParam(gl);

        this.m_generateMipmap = true;
      }
    }
  }

  __$destroy() {
    if (this.getAttachCount() < 1) {
      this.version = 0;

      if (this.m_texDatas != null) {
        for (let i = 0; i < this.m_texDatasLen; ++i) {
          ImgTexData_1.default.Restore(this.m_texDatas[i]);
        }

        this.m_texDatasLen = 0;
        this.m_texDatas = null;
        this.m_texData = null;
      }

      if (this.m_texData != null) {
        ImgTexData_1.default.Restore(this.m_texData);
        this.m_texData = null;
      }

      super.__$destroy();
    }
  }

  toString() {
    return "[ImageTextureProxy(name:" + this.name + ",uid=" + this.getUid() + ",width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

}

exports.default = ImageTextureProxy;

/***/ }),

/***/ "5f3c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 用于对 RPOBlock 进行必要的组织, 例如 合批或者按照 shader不同来分类, 以及依据其他机制分类等等
// 目前一个block内的所有node 所使用的shader program 是相同的

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const RPONodeLinker_1 = __importDefault(__webpack_require__("df9d"));

const RenderColorMask_1 = __webpack_require__("070b");

const RenderStateObject_1 = __webpack_require__("a5ba"); //import DebugFlag from "../debug/DebugFlag";


class RPOBlock {
  constructor(shader) {
    this.m_uid = -1; // 用于唯一记录运行时的自己(RPOBlock实例)唯一id

    this.m_nodeLinker = new RPONodeLinker_1.default();
    this.m_shader = null;
    this.index = -1; // 记录自身在 RenderProcess blocks数组中的序号

    this.shdUid = -1; // 记录 material 对应的 shader program uid

    this.procuid = -1;
    this.batchEnabled = true;
    this.fixedState = true;
    this.runMode = 0;
    this.rpoNodeBuilder = null;
    this.rpoUnitBuilder = null;
    this.vtxResource = null;
    this.m_shader = shader;
    this.m_uid = RPOBlock.s_uid++;
  }

  showInfo() {
    this.m_nodeLinker.showInfo();
  }

  addNode(node) {
    this.m_nodeLinker.addNodeAndSort(node);
  }

  rejoinNode(node) {
    if (this.m_nodeLinker.containsNode(node)) {
      this.m_nodeLinker.removeNodeAndSort(node);
      this.m_nodeLinker.addNodeAndSort(node);
    }
  }

  removeNode(node) {
    this.m_nodeLinker.removeNodeAndSort(node);
  }

  isEmpty() {
    return this.m_nodeLinker.getBegin() == null;
  }

  run(rc) {
    switch (this.runMode) {
      case 2:
        this.run2(rc);
        break;

      case 1:
        this.run1(rc);
        break;

      case 0:
        this.run0(rc);
        break;

      default:
        break;
    }
  }

  run0(rc) {
    let nextNode = this.m_nodeLinker.getBegin();

    if (nextNode != null) {
      this.m_shader.bindToGpu(this.shdUid);
      this.m_shader.resetUniform();
      let unit = null;

      while (nextNode != null) {
        if (nextNode.drawEnabled) {
          unit = nextNode.unit;

          if (unit.drawEnabled) {
            unit.run(rc);

            if (unit.partTotal < 1) {
              unit.drawThis(rc);
            } else {
              unit.drawPart(rc);
            }
          }
        }

        nextNode = nextNode.next;
      }
    }
  }

  run1(rc) {
    let nextNode = this.m_nodeLinker.getBegin();

    if (nextNode != null) {
      this.m_shader.bindToGpu(this.shdUid);
      this.m_shader.resetUniform();
      let unit = null;
      let vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
      let texTotal = this.m_nodeLinker.getTexTotalAt(nextNode.rtroI);
      let vtxFlag = vtxTotal > 0;
      let texFlag = texTotal > 0; //console.log("run1",vtxFlag,texFlag);

      while (nextNode != null) {
        if (vtxTotal < 1) {
          vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
          vtxFlag = true;
        }

        vtxTotal--;

        if (texTotal < 1) {
          texTotal = this.m_nodeLinker.getTexTotalAt(nextNode.rtroI);
          texFlag = true;
        }

        texTotal--; // if(DebugFlag.Flag_0 > 0) console.log("nextNode.drawEnabled: ",nextNode.drawEnabled);

        if (nextNode.drawEnabled) {
          unit = nextNode.unit; // if(DebugFlag.Flag_0 > 0) console.log("unit.drawEnabled: ",unit.drawEnabled);

          if (unit.drawEnabled) {
            if (vtxFlag) {
              nextNode.vro.run();
              vtxFlag = false;
            }

            if (texFlag) {
              nextNode.tro.run();
              texFlag = false;
            }

            unit.run2(rc);

            if (unit.partTotal < 1) {
              unit.drawThis(rc);
            } else {
              unit.drawPart(rc);
            }
          }
        }

        nextNode = nextNode.next;
      }
    }
  }

  run2(rc) {
    let nextNode = this.m_nodeLinker.getBegin();

    if (nextNode != null) {
      this.m_shader.bindToGpu(this.shdUid);
      this.m_shader.resetUniform();
      let unit = null;
      RenderStateObject_1.RenderStateObject.UseRenderState(nextNode.unit.renderState);
      RenderColorMask_1.RenderColorMask.UseRenderState(nextNode.unit.rcolorMask);
      let vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
      let texTotal = this.m_nodeLinker.getTexTotalAt(nextNode.rtroI);
      let vtxFlag = vtxTotal > 0;
      let texFlag = texTotal > 0;

      while (nextNode != null) {
        if (vtxTotal < 0) {
          vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
          vtxFlag = true;
        }

        vtxTotal--;

        if (texTotal < 0) {
          texTotal = this.m_nodeLinker.getTexTotalAt(nextNode.rtroI);
          texFlag = true;
        }

        texTotal--;

        if (nextNode.drawEnabled) {
          unit = nextNode.unit;

          if (unit.drawEnabled) {
            if (vtxFlag) {
              nextNode.vro.run();
              vtxFlag = false;
            }

            if (texFlag) {
              nextNode.tro.run();
              texFlag = false;
            }

            if (unit.ubo != null) {
              unit.ubo.run(rc);
            }

            this.m_shader.useTransUniform(unit.transUniform);
            this.m_shader.useUniform(unit.uniform);

            if (unit.partTotal < 1) {
              unit.drawThis(rc);
            } else {
              unit.drawPart(rc);
            }
          }
        }

        nextNode = nextNode.next;
      }
    }
  }

  runLockMaterial(rc) {
    let nextNode = this.m_nodeLinker.getBegin();

    if (nextNode != null) {
      this.m_shader.bindToGpu(this.shdUid);
      this.m_shader.resetUniform();
      let texUnlock = this.m_shader.isTextureUnLocked();
      rc.Texture.unlocked = texUnlock;
      let unit = null;

      if (this.batchEnabled) {
        let vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
        let vtxFlag = vtxTotal > 0;

        while (nextNode != null) {
          if (vtxTotal < 1) {
            vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
            vtxFlag = true;
          }

          vtxTotal--;
          unit = nextNode.unit;

          if (nextNode.drawEnabled && unit.drawEnabled) {
            if (vtxFlag) {
              nextNode.vro.run();
              vtxFlag = false;
            }

            if (texUnlock) {
              nextNode.tro.run();
            }

            unit.runLockMaterial2(null);

            if (unit.partTotal < 1) {
              unit.drawThis(rc);
            } else {
              unit.drawPart(rc);
            }
          }

          nextNode = nextNode.next;
        }
      } else {
        while (nextNode != null) {
          unit = nextNode.unit;

          if (nextNode.drawEnabled && unit.drawEnabled) {
            unit.runLockMaterial();

            if (texUnlock) {
              nextNode.tro.run();
            }

            if (unit.partTotal < 1) {
              unit.drawThis(rc);
            } else {
              unit.drawPart(rc);
            }
          }

          nextNode = nextNode.next;
        }
      }

      rc.Texture.unlocked = false;
    }
  } // 在锁定material的时候,直接绘制单个unit


  drawUnit(rc, unit, disp) {
    if (unit.drawEnabled) {
      this.m_shader.bindToGpu(unit.shdUid);
      unit.run(rc);

      if (unit.partTotal < 1) {
        unit.drawThis(rc);
      } else {
        unit.drawPart(rc);
      }
    }
  } // 在锁定material的时候,直接绘制单个unit


  drawLockMaterialByUnit(rc, unit, disp, useGlobalUniform, forceUpdateUniform) {
    if (unit.drawEnabled) {
      if (forceUpdateUniform) {
        this.m_shader.resetUniform();
      } // console.log("***8** drawLockMaterialByUnit(), unit: ",unit);


      if (RendererDevice_1.default.IsMobileWeb()) {
        // 如果不这么做，vro和shader attributes没有完全匹配的时候可能在某些设备上会有问题(例如ip6s上无法正常绘制)
        // 注意临时产生的 vro 对象的回收问题
        let vro = this.vtxResource.getVROByResUid(disp.vbuf.getUid(), this.m_shader.getCurrentShd(), true);
        vro.run();
      } else {
        unit.vro.run();
      }

      unit.runLockMaterial2(useGlobalUniform ? this.m_shader.__$globalUniform : null);

      if (unit.partTotal < 1) {
        unit.drawThis(rc);
      } else {
        unit.drawPart(rc);
      }
    }
  }

  reset() {
    let nextNode = this.m_nodeLinker.getBegin();
    let node = null;

    if (nextNode != null) {
      let runit;

      while (nextNode != null) {
        node = nextNode;
        nextNode = nextNode.next;
        this.rpoUnitBuilder.setRPNodeParam(node.__$ruid, this.procuid, -1);
        node.reset();
        runit = node.unit;

        if (this.rpoNodeBuilder.restore(node)) {
          this.rpoUnitBuilder.restore(runit);
        }
      }
    }

    this.index = -1;
    this.shdUid = -1;
    this.procuid = -1;
    this.m_nodeLinker.clear();
    this.rpoNodeBuilder = null;
    this.rpoUnitBuilder = null;
    this.vtxResource = null;
  }

  destroy() {
    this.reset();
  }

  getUid() {
    return this.m_uid;
  }

  toString() {
    return "[RPOBlock(uid = " + this.m_uid + ", index = " + this.index + ", shdUid = " + this.shdUid + ")]";
  }

}

RPOBlock.s_uid = 0;
exports.default = RPOBlock;

/***/ }),

/***/ "644c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class MaterialConst {
  constructor() {}

  static GetTypeByTypeNS(tns) {
    switch (tns) {
      case "mat4":
        return MaterialConst.SHADER_MAT4;
        break;

      case "mat3":
        return MaterialConst.SHADER_MAT3;
        break;

      case "mat2":
        return MaterialConst.SHADER_MAT2;
        break;

      case "float":
        return MaterialConst.SHADER_FLOAT;
        break;

      case "int":
        return MaterialConst.SHADER_INT;
        break;

      case "vec4":
        return MaterialConst.SHADER_VEC4;
        break;

      case "vec3":
        return MaterialConst.SHADER_VEC3;
        break;

      case "vec2":
        return MaterialConst.SHADER_VEC2;
        break;

      case "vec4[]":
        return MaterialConst.SHADER_VEC4FV;
        break;

      case "vec3[]":
        return MaterialConst.SHADER_VEC3FV;
        break;

      case "vec2[]":
        return MaterialConst.SHADER_VEC2FV;
        break;

      case "sampler2D":
        return MaterialConst.SHADER_SAMPLER2D;
        break;

      case "sampler3D":
        return MaterialConst.SHADER_SAMPLER3D;
        break;

      case "samplerCube":
        return MaterialConst.SHADER_SAMPLERCUBE;
        break;

      default:
        break;
    }

    return MaterialConst.SHADER_UNDEFINED;
  }

  static GetTypeNSByType(type) {
    switch (type) {
      case MaterialConst.SHADER_MAT4:
        return "mat4";
        break;

      case MaterialConst.SHADER_MAT3:
        return "mat3";
        break;

      case MaterialConst.SHADER_MAT2:
        return "mat2";
        break;

      case MaterialConst.SHADER_FLOAT:
        return "float";
        break;

      case MaterialConst.SHADER_VEC4:
        return "vec4";

      case MaterialConst.SHADER_VEC3:
        return "vec3";
        break;

      case MaterialConst.SHADER_VEC2:
        return "vec2";
        break;

      case MaterialConst.SHADER_SAMPLER2D:
        return "sampler2D";
        break;

      case MaterialConst.SHADER_SAMPLER3D:
        return "sampler3D";
        break;

      case MaterialConst.SHADER_SAMPLERCUBE:
        return "samplerCube";
        break;

      case MaterialConst.SHADER_UNDEFINED:
        return "undefined";
        break;

      default:
        break;
    }

    return "";
  }

} // for glsl shader auto build


MaterialConst.ATTRINS_VTX_VS = "a_vs";
MaterialConst.ATTRINS_VTX_UVS = "a_uvs";
MaterialConst.ATTRINS_VTX_NVS = "a_nvs";
MaterialConst.ATTRINS_VTX_CVS = "a_cvs"; //

MaterialConst.UNIFORMNS_OBJ_MAT_NS = "u_objMat";
MaterialConst.UNIFORMNS_VIEW_MAT_NS = "u_viewMat";
MaterialConst.UNIFORMNS_PROJ_MAT_NS = "u_projMat"; // 取值范围3001(包括3001) 到 3255(包括3255)

MaterialConst.SHADER_UNDEFINED = 3010;
MaterialConst.SHADER_VEC2 = 3011;
MaterialConst.SHADER_VEC3 = 3012;
MaterialConst.SHADER_VEC4 = 3013;
MaterialConst.SHADER_VEC2FV = 3014;
MaterialConst.SHADER_VEC3FV = 3015;
MaterialConst.SHADER_VEC4FV = 3016;
MaterialConst.SHADER_MAT2 = 3017;
MaterialConst.SHADER_MAT3 = 3018;
MaterialConst.SHADER_MAT4 = 3019;
MaterialConst.SHADER_FLOAT = 3020;
MaterialConst.SHADER_INT = 3021;
MaterialConst.SHADER_MAT2FV = 3022;
MaterialConst.SHADER_MAT3FV = 3023;
MaterialConst.SHADER_MAT4FV = 3024;
MaterialConst.SHADER_SAMPLER2D = 3031;
MaterialConst.SHADER_SAMPLERCUBE = 3032;
MaterialConst.SHADER_SAMPLER3D = 3033;
MaterialConst.SHADER_PRECISION_LOWP = 3101;
MaterialConst.SHADER_PRECISION_MEDIUMP = 3111;
MaterialConst.SHADER_PRECISION_HIGHP = 3121; // texture uniform name define

MaterialConst.UNIFORM_TEX_SAMPLER2D = "sampler2D";
MaterialConst.UNIFORM_TEX_SAMPLERCUBE = "samplerCube";
MaterialConst.UNIFORM_TEX_SAMPLER3D = "sampler3D"; //

MaterialConst.UNIFORMNS_TEX_SAMPLER_0 = "u_sampler0";
MaterialConst.UNIFORMNS_TEX_SAMPLER_1 = "u_sampler1";
MaterialConst.UNIFORMNS_TEX_SAMPLER_2 = "u_sampler2";
MaterialConst.UNIFORMNS_TEX_SAMPLER_3 = "u_sampler3";
MaterialConst.UNIFORMNS_TEX_SAMPLER_4 = "u_sampler4";
MaterialConst.UNIFORMNS_TEX_SAMPLER_5 = "u_sampler5";
MaterialConst.UNIFORMNS_TEX_SAMPLER_6 = "u_sampler6";
MaterialConst.UNIFORMNS_TEX_SAMPLER_7 = "u_sampler7";
MaterialConst.UNIFORMNS_TEX_SAMPLER_LIST = [MaterialConst.UNIFORMNS_TEX_SAMPLER_0, MaterialConst.UNIFORMNS_TEX_SAMPLER_1, MaterialConst.UNIFORMNS_TEX_SAMPLER_2, MaterialConst.UNIFORMNS_TEX_SAMPLER_3, MaterialConst.UNIFORMNS_TEX_SAMPLER_4, MaterialConst.UNIFORMNS_TEX_SAMPLER_5, MaterialConst.UNIFORMNS_TEX_SAMPLER_6, MaterialConst.UNIFORMNS_TEX_SAMPLER_7];
exports.default = MaterialConst;

/***/ }),

/***/ "670e":
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

const ROVertexRes_1 = __webpack_require__("45db");

const ROIndicesRes_1 = __webpack_require__("8ae4");

class GpuVtxObject {
  constructor() {
    this.version = -1; // wait del times

    this.waitDelTimes = 0; // renderer context unique id

    this.rcuid = 0; // texture resource unique id

    this.resUid = 0;
    this.vertex = new ROVertexRes_1.ROVertexRes();
    this.indices = new ROIndicesRes_1.ROIndicesRes();
    this.m_attachCount = 0;
  }

  __$attachThis() {
    ++this.m_attachCount; //console.log("GpuVtxObject::__$attachThis() this.m_attachCount: "+this.m_attachCount);
  }

  __$detachThis() {
    --this.m_attachCount; //console.log("GpuVtxObject::__$detachThis() this.m_attachCount: "+this.m_attachCount);

    if (this.m_attachCount < 1) {
      this.m_attachCount = 0;
      console.log("GpuVtxObject::__$detachThis() this.m_attachCount value is 0."); // do something
    }
  }

  getAttachCount() {
    return this.m_attachCount;
  }

  createVRO(rc, shdp, vaoEnabled) {
    let vro = this.vertex.createVRO(rc, shdp, vaoEnabled, this.indices, this.indices.getUid()); //vro.ibuf = this.indices.getGpuBuf();

    vro.ibufStep = this.indices.ibufStep;
    return vro;
  }

  updateToGpu(rc) {
    this.indices.updateToGpu(rc);
    this.vertex.updateToGpu(rc);
  }

  destroy(rc) {
    if (this.getAttachCount() < 1 && this.resUid >= 0) {
      this.vertex.destroy(rc);
      this.indices.destroy(rc);
      this.resUid = -1;
    }
  }

}

exports.GpuVtxObject = GpuVtxObject;

/***/ }),

/***/ "68aa":
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

class RawTexData {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.data = null;
    this.miplevel = 0; // 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新

    this.status = 1;
    this.offsetx = 0;
    this.offsety = 0;
  }

  updateToGpu(gl, samplerTarget, interType, format, type, force) {
    if (this.status == 1 || force) {
      gl.texImage2D(samplerTarget, this.miplevel, interType, this.width, this.height, 0, format, type, this.data);
    } else if (this.status == 0) {
      gl.texSubImage2D(samplerTarget, this.miplevel, this.offsetx, this.offsety, this.width, this.height, format, type, this.data);
    }

    this.status = -1;
  }

  static Create() {
    if (RawTexData.s_list.length > 0) {
      return RawTexData.s_list.pop();
    }

    return new RawTexData();
  }

  static Restore(tsd) {
    if (tsd != null) {
      tsd.data = null;
      RawTexData.s_list.push(tsd);
    }
  }

}

RawTexData.s_list = [];
exports.default = RawTexData;

/***/ }),

/***/ "6d49":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const FrameBufferType_1 = __importDefault(__webpack_require__("baae"));

const TextureConst_1 = __webpack_require__("8d98");

const RenderFBOProxy_1 = __importDefault(__webpack_require__("56c5"));

class FrameBufferObject {
  constructor(rcuid, texResource, frameBufType) {
    this.m_uid = -1; // renderer context unique id

    this.m_rcuid = 0;
    this.m_COLOR_ATTACHMENT0 = 0x0;
    this.m_fbo = null;
    this.m_depthStencilRBO = null;
    this.m_depthRBO = null;
    this.m_colorRBO = null;
    this.m_width = 512;
    this.m_height = 512;
    this.m_bufferLType = 0;
    this.m_gl = null;
    this.m_fboTarget = 0;
    this.m_texTargetTypes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.m_attachmentMaskList = [true, true, true, true, true, true, true, true];
    this.m_preAttachTotal = 0;
    this.m_preAttachIndex = 0;
    this.m_activeAttachmentTotal = 0;
    this.m_attachmentIndex = 0;
    this.m_clearDepthArr = new Float32Array(1);
    this.m_clearColorArr = new Float32Array(4);
    this.m_stencilValueArr = new Int16Array(4);
    this.m_fboSizeChanged = false;
    this.textureLevel = 0;
    this.sizeFixed = false;
    this.writeDepthEnabled = true;
    this.writeStencilEnabled = false;
    this.multisampleEnabled = false;
    this.multisampleLevel = 0;
    this.m_preAttachments = new Uint32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.m_preTragets = new Uint32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.m_preFTIndex = 0;
    this.m_haveDepthTex = false; //invalidateFramebuffer(target, attachments)

    this.m_resizeW = 2;
    this.m_resizeH = 2;
    this.m_rcuid = rcuid;
    this.m_texRes = texResource;
    this.m_bufferLType = frameBufType;
    this.m_uid = FrameBufferObject.s_uid++;
  }

  getUid() {
    return this.m_uid;
  }

  resetAttachmentMask(boo) {
    let i = this.m_attachmentMaskList.length - 1;

    while (i >= 0) {
      this.m_attachmentMaskList[i] = boo;
      --i;
    } //console.log("resetAttachmentMask, this.m_attachmentMaskList: ",this.m_attachmentMaskList);

  }

  setAttachmentMaskAt(index, boo) {
    this.m_attachmentMaskList[index] = boo;
  }

  getActiveAttachmentTotal() {
    return this.m_haveDepthTex ? this.m_activeAttachmentTotal - 1 : this.m_activeAttachmentTotal;
  }

  getAttachmentTotal() {
    return this.m_attachmentMaskList.length;
  }

  bindToBackbuffer(frameBufferType) {
    switch (frameBufferType) {
      case FrameBufferType_1.default.DRAW_FRAMEBUFFER:
        this.m_gl.bindFramebuffer(this.m_gl.DRAW_FRAMEBUFFER, null);
        break;

      case FrameBufferType_1.default.READ_FRAMEBUFFER:
        this.m_gl.indFramebuffer(this.m_gl.READ_FRAMEBUFFER, null);
        break;

      default:
        this.m_gl.bindFramebuffer(this.m_gl.FRAMEBUFFER, null);
    }
  }

  bind(frameBufferType) {
    if (this.m_fbo != null) {
      switch (frameBufferType) {
        case FrameBufferType_1.default.DRAW_FRAMEBUFFER:
          this.m_gl.bindFramebuffer(this.m_gl.DRAW_FRAMEBUFFER, this.m_fbo);
          break;

        case FrameBufferType_1.default.READ_FRAMEBUFFER:
          this.m_gl.bindFramebuffer(this.m_gl.READ_FRAMEBUFFER, this.m_fbo);
          break;

        default:
          this.m_gl.bindFramebuffer(this.m_gl.FRAMEBUFFER, this.m_fbo);
      }
    }
  }

  getFBO() {
    return this.m_fbo;
  }

  getDepthStencilRBO() {
    return this.m_depthStencilRBO;
  }

  getDepthRBO() {
    return this.m_depthRBO;
  }

  getWidth() {
    return this.m_width;
  }

  getHeight() {
    return this.m_height;
  }

  getFramebufferType() {
    return this.m_bufferLType;
  }
  /**
   * bind a texture to fbo attachment by attachment index
   * @param texProxy  IRenderTexture instance
   * @param enableDepth  enable depth buffer yes or no
   * @param enableStencil  enable stencil buffer yes or no
   * @param attachmentIndex  fbo attachment index
   */


  renderToTexAt(rgl, texProxy, attachmentIndex) {
    let inFormat = texProxy != null ? texProxy.internalFormat : -1;
    this.m_gl = rgl;

    if (attachmentIndex == 0) {
      this.m_preFTIndex = 0;
      this.m_haveDepthTex = false; // 注意, 防止多次重复调用的没必要重设

      this.m_gl.bindFramebuffer(this.m_fboTarget, this.m_fbo);

      if (inFormat != TextureConst_1.TextureFormat.DEPTH_COMPONENT && inFormat != TextureConst_1.TextureFormat.DEPTH_STENCIL) {
        this.m_activeAttachmentTotal = 0;
        this.m_attachmentIndex = 0;
      }
    }

    let targetType = -1;
    let rTex = null; //trace("FrameBufferObject::use(), texProxy != null: "+(texProxy != null));

    if (texProxy != null) {
      targetType = texProxy.getTargetType();
      rTex = this.m_texRes.getGpuBuffer(texProxy.getResUid());
      texProxy.uploadFromFbo(this.m_texRes, this.m_width, this.m_height);
    } else {
      targetType = this.m_texTargetTypes[this.m_activeAttachmentTotal];
    }

    this.framebufferTextureBind(rgl, targetType, inFormat, rTex);
  }

  glFramebufferTex2D(attachment, rTex) {
    let rgl = this.m_gl;
    rgl.framebufferTexture2D(this.m_fboTarget, attachment, rgl.TEXTURE_2D, rTex, 0);
    this.m_preAttachments[this.m_preFTIndex] = attachment;
    this.m_preTragets[this.m_preFTIndex] = rgl.TEXTURE_2D;
    this.m_preFTIndex++;
  }

  glFramebufferTexCube(attachment, cubeFaceIndex, rTex) {
    let rgl = this.m_gl;
    rgl.framebufferTexture2D(this.m_fboTarget, attachment, rgl.TEXTURE_CUBE_MAP_POSITIVE_X + cubeFaceIndex, rTex, 0);
    this.m_preAttachments[this.m_preFTIndex] = attachment;
    this.m_preTragets[this.m_preFTIndex] = rgl.TEXTURE_CUBE_MAP_POSITIVE_X + cubeFaceIndex;
    this.m_preFTIndex++;
  }

  framebufferTexture2D(rgl, targetType, inFormat, rTex) {
    let attachment = -1;

    switch (inFormat) {
      case TextureConst_1.TextureFormat.DEPTH_COMPONENT:
        this.m_haveDepthTex = true;
        attachment = this.m_gl.DEPTH_ATTACHMENT; //rgl.framebufferTexture2D(this.m_fboTarget, this.m_gl.DEPTH_ATTACHMENT, rgl.TEXTURE_2D, rTex, 0);
        //this.glFramebufferTex2D(this.m_gl.DEPTH_ATTACHMENT, rTex);

        break;

      case TextureConst_1.TextureFormat.DEPTH_STENCIL:
        this.m_haveDepthTex = true;
        attachment = this.m_gl.DEPTH_STENCIL_ATTACHMENT; //rgl.framebufferTexture2D(this.m_fboTarget, this.m_gl.DEPTH_STENCIL_ATTACHMENT, rgl.TEXTURE_2D, rTex, 0);
        //this.glFramebufferTex2D(this.m_gl.DEPTH_STENCIL_ATTACHMENT, rTex);

        break;

      default:
        attachment = this.m_COLOR_ATTACHMENT0 + this.m_attachmentIndex;
        /*
        if(this.m_attachmentMaskList[this.m_activeAttachmentTotal])
        {
            
            //rgl.framebufferTexture2D(this.m_fboTarget, this.m_COLOR_ATTACHMENT0 + this.m_attachmentIndex, rgl.TEXTURE_2D, rTex, this.textureLevel);
            this.glFramebufferTex2D(this.m_COLOR_ATTACHMENT0 + this.m_attachmentIndex, rTex);
            ++this.m_attachmentIndex;
            if (rTex != null)
            {
                this.m_texTargetTypes[this.m_activeAttachmentTotal] = targetType;
            }
            else
            {
                this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
            }
        }
        else
        {
            this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
        }
        ++this.m_activeAttachmentTotal;
        //*/

        break;
    }

    if (attachment > 0) {
      if (this.m_attachmentMaskList[this.m_activeAttachmentTotal]) {
        this.glFramebufferTex2D(attachment, rTex);
        ++this.m_attachmentIndex;

        if (rTex != null) {
          this.m_texTargetTypes[this.m_activeAttachmentTotal] = targetType;
        } else {
          this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
        }
      } else {
        this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
      }

      ++this.m_activeAttachmentTotal;
    }
  }

  framebufferTextureBind(rgl, targetType, inFormat, rTex) {
    // current texture attachments
    switch (targetType) {
      case TextureConst_1.TextureTarget.TEXTURE_2D:
        this.framebufferTexture2D(rgl, targetType, inFormat, rTex);
        break;

      case TextureConst_1.TextureTarget.TEXTURE_CUBE:
        let cubeAttachmentTot = 0;

        for (let i = 0; i < 6; ++i) {
          if (this.m_attachmentMaskList[i]) {
            //rgl.framebufferTexture2D(this.m_fboTarget, this.m_COLOR_ATTACHMENT0 + this.m_attachmentIndex, rgl.TEXTURE_CUBE_MAP_POSITIVE_X + i, rTex, this.textureLevel);
            this.glFramebufferTexCube(this.m_COLOR_ATTACHMENT0 + this.m_attachmentIndex, i, rTex);
            ++this.m_attachmentIndex;

            if (rTex != null) {
              this.m_texTargetTypes[this.m_activeAttachmentTotal + i] = targetType;
            } else {
              this.m_texTargetTypes[this.m_activeAttachmentTotal + i] = 0;
            }

            cubeAttachmentTot++;
          } else {
            this.m_texTargetTypes[this.m_activeAttachmentTotal + i] = 0;
          }
        }

        cubeAttachmentTot = cubeAttachmentTot > 0 ? cubeAttachmentTot : 6;
        this.m_activeAttachmentTotal += cubeAttachmentTot;
        break;

      case TextureConst_1.TextureTarget.TEXTURE_SHADOW_2D:
        if (this.m_attachmentMaskList[this.m_activeAttachmentTotal]) {
          //rgl.framebufferTexture2D(this.m_gl.FRAMEBUFFER, this.m_gl.DEPTH_ATTACHMENT, this.m_gl.TEXTURE_2D, rTex, this.textureLevel);
          this.glFramebufferTex2D(this.m_gl.DEPTH_ATTACHMENT, rTex);

          if (rTex != null) {
            this.m_texTargetTypes[this.m_activeAttachmentTotal] = targetType;
          } else {
            this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
          }
        } else {
          this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
        }

        ++this.m_activeAttachmentTotal;
        break;

      default:
        break;
    }
  }

  reset() {
    this.m_preAttachTotal = -1;
    this.m_preAttachIndex = -1;
  }

  use(rgl) {
    this.m_gl = rgl;

    if (this.m_fbo != null) {
      //console.log("this.m_preAttachIndex,this.m_attachmentIndex: ",this.m_preAttachIndex,this.m_attachmentIndex,this.m_activeAttachmentTotal);
      if (this.m_activeAttachmentTotal > 1) {
        if (this.m_preAttachIndex != this.m_attachmentIndex) {
          let attachments = [];
          let i = 0;

          for (; i < this.m_attachmentIndex; ++i) {
            attachments.push(this.m_COLOR_ATTACHMENT0 + i);
          }

          if (this.m_preAttachIndex > this.m_attachmentIndex) {
            for (; i < this.m_preAttachIndex; ++i) {
              this.m_gl.framebufferTexture2D(this.m_fboTarget, this.m_preAttachments[i], this.m_preTragets[i], null, 0);
            }
          } // support webgl2 and webgl1
          //console.log("AAA attachments 0: ",attachments);


          RenderFBOProxy_1.default.DrawBuffers(attachments);
          this.m_preAttachIndex = this.m_attachmentIndex;
        }
      } else if (this.m_preAttachIndex != this.m_attachmentIndex) {
        if (this.m_preAttachIndex > this.m_attachmentIndex) {
          for (let i = 1; i < this.m_preAttachIndex; ++i) {
            this.m_gl.framebufferTexture2D(this.m_fboTarget, this.m_preAttachments[i], this.m_preTragets[i], null, 0);
          }
        }

        let attachments = [this.m_COLOR_ATTACHMENT0]; //console.log("AAA attachments 1: ",attachments);

        RenderFBOProxy_1.default.DrawBuffers(attachments);
        this.m_preAttachIndex = this.m_attachmentIndex;
      }

      this.m_preAttachTotal = this.m_activeAttachmentTotal;
    }
  }

  clearOnlyColor(color) {
    if (this.m_fbo != null) {
      if (RendererDevice_1.default.IsWebGL2()) {
        this.m_clearColorArr[0] = color.r;
        this.m_clearColorArr[1] = color.g;
        this.m_clearColorArr[2] = color.b;
        this.m_clearColorArr[3] = color.a;

        if (this.m_preAttachTotal > 1) {
          for (let i = 0; i < this.m_preAttachTotal; ++i) {
            this.m_gl.clearBufferfv(this.m_gl.COLOR, i, this.m_clearColorArr);
          }
        } else {
          this.m_gl.clearBufferfv(this.m_gl.COLOR, 0, this.m_clearColorArr);
        }
      } else {
        this.m_gl.clearColor(color.r, color.g, color.b, color.a);
      }
    } //trace("XXXXXXXXXXXXXXXXXXXX FrameBufferObject::clearOnlyColor(), m_fbo: ", m_fbo);

  }

  clearOnlyDepth(depth = 1.0) {
    if (RendererDevice_1.default.IsWebGL2()) {
      this.m_clearDepthArr[0] = depth;
      this.m_gl.clearBufferfv(this.m_gl.DEPTH, 0, this.m_clearDepthArr);
    } else {
      this.m_gl.clearDepth(depth);
    }
  }

  clearOnlyStencil(stencil) {
    this.m_stencilValueArr[0] = stencil;
    this.m_gl.clearBufferuiv(this.m_gl.STENCIL, 0, this.m_stencilValueArr);
  }

  clearOnlyDepthAndStencil(depth, stencil) {
    this.m_gl.clearBufferfi(this.m_gl.DEPTH_STENCIL, 0, depth, stencil);
  }

  invalidateFramebuffer() {} // 一旦这个函数调用，则size的控制权以后都会由这个resize决定


  resize(pw, ph) {
    if (this.m_resizeW != pw || this.m_resizeH != ph) {
      this.m_fboSizeChanged = true;
      this.m_resizeW = pw;
      this.m_resizeH = ph;
    }
  }

  initialize(rgl, pw, ph) {
    this.m_gl = rgl;
    this.m_COLOR_ATTACHMENT0 = RenderFBOProxy_1.default.COLOR_ATTACHMENT0;

    if (this.m_fboSizeChanged) {
      pw = this.m_resizeW;
      ph = this.m_resizeH;
    }

    if (this.m_fbo == null) {
      this.createNewFBO(rgl, pw, ph);
      console.log("FrameBufferObject create a new fbo: ", this);
    } else if (this.m_width != pw || this.m_height != ph) {
      // ready rebuild some new fbo's Renderbuffers.
      this.createNewFBO(rgl, pw, ph);
      console.log("FrameBufferObject ready rebuild another new fbo(" + pw + "," + ph + "): ", this);
    }

    this.m_fboSizeChanged = false;
  }

  isSizeChanged() {
    return this.m_fboSizeChanged;
  }

  destroy(rgl) {
    if (this.m_fbo != null) {
      if (this.m_depthStencilRBO != null) {
        rgl.deleteFramebuffer(this.m_depthStencilRBO);
        this.m_depthStencilRBO = null;
      }

      if (this.m_depthRBO != null) {
        rgl.deleteFramebuffer(this.m_depthRBO);
        this.m_depthRBO = null;
      }

      if (this.m_colorRBO != null) {
        rgl.deleteFramebuffer(this.m_colorRBO);
        this.m_colorRBO = null;
      }

      rgl.deleteFramebuffer(this.m_fbo);
      this.m_fbo = null;
    }

    this.m_gl = null;
    this.m_fboTarget = 0;
    this.m_fboSizeChanged = false;
  } // toString = function()
  // {
  // 	switch (this.m_bufferLType)
  // 	{
  // 	case FrameBufferType.DRAW_FRAMEBUFFER:
  // 		return "[FrameBufferObject(DRAW_FRAMEBUFFER(uid="+this.m_uid+" width="+this.m_width+",height="+this.m_height+")]";
  // 		break;
  // 	case FrameBufferType.READ_FRAMEBUFFER:
  // 		return "[FrameBufferObject(READ_FRAMEBUFFER(uid="+this.m_uid+" width="+this.m_width+",height="+this.m_height+")]";
  // 		break;
  // 	default:
  // 		break;
  // 	}
  // 	return "[FrameBufferObject(FRAMEBUFFER(uid="+this.m_uid+" width="+this.m_width+",height="+this.m_height+")]";
  // }


  buildDepthStencilRBO(rgl, pw, ph) {
    if (this.m_depthStencilRBO == null) this.m_depthStencilRBO = rgl.createRenderbuffer();

    if (this.multisampleEnabled) {
      rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthStencilRBO);
      rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.DEPTH_STENCIL, pw, ph);
      rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.DEPTH_STENCIL_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthStencilRBO);
      if (this.m_colorRBO == null) this.m_colorRBO = rgl.createRenderbuffer();
      rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_colorRBO);
      rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.RGBA8, pw, ph);
      rgl.framebufferRenderbuffer(this.m_fboTarget, this.m_COLOR_ATTACHMENT0, rgl.RENDERBUFFER, this.m_colorRBO);
    } else {
      rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthStencilRBO);
      rgl.renderbufferStorage(rgl.RENDERBUFFER, rgl.DEPTH_STENCIL, pw, ph);
      rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.DEPTH_STENCIL_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthStencilRBO);
    }
  }

  buildDepthRBO(rgl, pw, ph) {
    if (this.m_depthRBO == null) this.m_depthRBO = rgl.createRenderbuffer();

    if (this.multisampleEnabled) {
      rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthRBO);
      rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.DEPTH_COMPONENT24, pw, ph);
      rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.DEPTH_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthRBO);
      if (this.m_colorRBO == null) this.m_colorRBO = rgl.createRenderbuffer();
      rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_colorRBO);
      rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.RGBA8, pw, ph);
      rgl.framebufferRenderbuffer(this.m_fboTarget, this.m_COLOR_ATTACHMENT0, rgl.RENDERBUFFER, this.m_colorRBO);
    } else {
      rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthRBO);

      if (RendererDevice_1.default.IsWebGL2()) {
        rgl.renderbufferStorage(rgl.RENDERBUFFER, rgl.DEPTH_COMPONENT24, pw, ph);
      } else {
        console.log("Only use webgl1 depth fbo buffer.");
        rgl.renderbufferStorage(rgl.RENDERBUFFER, rgl.DEPTH_COMPONENT16, pw, ph);
      }

      rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.DEPTH_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthRBO);
    }
  }

  buildStencilRBO(rgl, pw, ph) {
    if (this.m_depthStencilRBO == null) {
      //trace("FrameBufferObject create stencil buf...this.multisampleEnabled: "+this.multisampleEnabled+",this.multisampleLevel:"+this.multisampleLevel);
      if (this.m_depthStencilRBO == null) this.m_depthStencilRBO = rgl.createRenderbuffer();

      if (this.multisampleEnabled) {
        rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthStencilRBO);
        rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.STENCIL_INDEX8, pw, ph);
        rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.STENCIL_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthStencilRBO);
        if (this.m_colorRBO == null) this.m_colorRBO = rgl.createRenderbuffer();
        rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_colorRBO);
        rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.RGBA8, pw, ph);
        rgl.framebufferRenderbuffer(this.m_fboTarget, this.m_COLOR_ATTACHMENT0, rgl.RENDERBUFFER, this.m_colorRBO);
      } else {
        rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthStencilRBO);
        rgl.renderbufferStorage(rgl.RENDERBUFFER, rgl.STENCIL_INDEX8, pw, ph);
        rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.STENCIL_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthStencilRBO);
      }
    }
  }

  buildColorRBO(rgl, pw, ph) {
    if (this.multisampleEnabled) {
      if (this.m_colorRBO == null) this.m_colorRBO = rgl.createRenderbuffer();
      rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_colorRBO);
      rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.RGBA8, pw, ph);
      rgl.framebufferRenderbuffer(this.m_fboTarget, this.m_COLOR_ATTACHMENT0, rgl.RENDERBUFFER, this.m_colorRBO); //
    }

    console.log("FrameBufferObject create only color buf...this.multisampleEnabled: " + this.multisampleEnabled + ",this.multisampleLevel:" + this.multisampleLevel);
  }

  createNewFBO(rgl, pw, ph) {
    let boo = this.m_fbo == null;
    this.m_preAttachTotal = this.m_activeAttachmentTotal = 0;
    this.m_preAttachIndex = this.m_attachmentIndex = 0;
    this.m_width = pw;
    this.m_height = ph;
    this.m_resizeW = pw;
    this.m_resizeH = ph; //trace("XXXXXXXXXXXXXX ready create framebuf, m_fbo: ", m_fbo);

    if (boo) this.m_fbo = rgl.createFramebuffer(); //trace("XXXXXXXXXXXXXX doing create framebuf, m_fbo: ", m_fbo);

    switch (this.m_bufferLType) {
      case FrameBufferType_1.default.DRAW_FRAMEBUFFER:
        this.m_fboTarget = rgl.DRAW_FRAMEBUFFER; //console.log("create FrameBufferType is DRAW_FRAMEBUFFER.");

        break;

      case FrameBufferType_1.default.READ_FRAMEBUFFER:
        this.m_fboTarget = rgl.READ_FRAMEBUFFER; //console.log("create FrameBufferType is READ_FRAMEBUFFER.");

        break;

      default:
        this.m_fboTarget = rgl.FRAMEBUFFER; //console.log("create FrameBufferType is FRAMEBUFFER.");

        break;
    }

    rgl.bindFramebuffer(this.m_fboTarget, this.m_fbo); //console.log("FrameBufferObject::initialize() writeDepthEnabled: "+this.writeDepthEnabled+", writeDepthEnabled: " , this.writeDepthEnabled+" ,size("+pw + "," ,ph+")");

    if (this.writeDepthEnabled) {
      //trace("FrameBufferObject writeStencilEnabled: " ,this.writeStencilEnabled);
      if (this.writeStencilEnabled) {
        if (this.m_depthStencilRBO == null) {
          //trace("FrameBufferObject create depth and stencil buf...this.multisampleEnabled: "+this.multisampleEnabled+",this.multisampleLevel:"+this.multisampleLevel);
          this.buildDepthStencilRBO(rgl, pw, ph);
        }
      } else {
        this.buildDepthRBO(rgl, pw, ph);
      }
    } else if (this.writeStencilEnabled) {
      this.buildStencilRBO(rgl, pw, ph);
    } else {
      this.buildColorRBO(rgl, pw, ph);
    }

    if (boo) {
      let e = rgl.checkFramebufferStatus(this.m_fboTarget); //trace("XXXXX   XXXXXXXXx Err: "+e+", rgl.FRAMEBUFFER_COMPLETE: "+rgl.FRAMEBUFFER_COMPLETE);

      if (e !== rgl.FRAMEBUFFER_COMPLETE) {
        console.error("FrameBufferObject::createNewFBO(), Error: create failure!!!!");
      } else {
        console.log("FrameBufferObject::createNewFBO(), create success...,size: " + pw + "," + ph);
      }
    }

    FrameBufferObject.BindToBackbuffer(rgl, this.m_bufferLType);
  }

  static BindToBackbuffer(rc, frameBufferType) {
    switch (frameBufferType) {
      case FrameBufferType_1.default.DRAW_FRAMEBUFFER:
        rc.bindFramebuffer(rc.DRAW_FRAMEBUFFER, null);
        break;

      case FrameBufferType_1.default.READ_FRAMEBUFFER:
        rc.indFramebuffer(rc.READ_FRAMEBUFFER, null);
        break;

      default:
        rc.bindFramebuffer(rc.FRAMEBUFFER, null);
        break;
    }
  }

}

FrameBufferObject.s_uid = 0;
exports.default = FrameBufferObject;

/***/ }),

/***/ "6e01":
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

class MathConst {
  static Clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
  }

  static IsPowerOf2(value) {
    return (value & value - 1) == 0;
  }

  static CalcCeilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
  }

  static CalcNearestCeilPow2(int_n) {
    return Math.pow(2, Math.round(Math.log(int_n) / Math.LN2));
  }

  static CalcFloorCeilPow2(int_n) {
    return Math.pow(2, Math.floor(Math.log(int_n) / Math.LN2));
  }

  static DegreeToRadian(degree) {
    return MathConst.MATH_PI_OVER_180 * degree;
  }

  static Log2(f) {
    return Math.log(f) / Math.LN2;
  }

  static GetMaxMipMapLevel(width, height) {
    return Math.round(MathConst.Log2(Math.max(width, height)) + 1);
  }

  static SafeACos(x) {
    if (x <= -1.0) {
      return MathConst.MATH_PI;
    }

    if (x >= 1.0) {
      return 0.0;
    }

    return Math.acos(x);
  }

  static GetNearestCeilPow2(int_n) {
    let x = 1;

    while (x < int_n) {
      x <<= 1;
    }

    return x;
  } // ccw is positive


  static GetMinRadian(a1, a0) {
    a0 %= MathConst.MATH_2PI;
    a1 %= MathConst.MATH_2PI;

    if (a0 < a1) {
      a0 = MathConst.MATH_2PI - a1 + a0;
      if (a0 > MathConst.MATH_PI) return a0 - MathConst.MATH_2PI;
      return a0;
    } else if (a0 > a1) {
      a1 = MathConst.MATH_2PI - a0 + a1;
      if (a1 > MathConst.MATH_PI) return MathConst.MATH_2PI - a1;
      return -a1;
    }

    return 0.0;
  }
  /**
   * get the directional angle offset degree value: dst_angle_degree = src_angle_degree + directional_angle_offset_degree_value
   * @param a0 src angle degree
   * @param a1 dst angle degree
   * @returns directional angle offset degree value
   */


  static GetMinDegree(a0, a1) {
    let angle = 0;

    if (a1 >= 270 && a0 < 90) {
      angle = (a1 - (a0 + 360)) % 180;
    } else if (a1 <= 90 && a0 >= 270) {
      angle = (a1 + 360 - a0) % 180;
    } else {
      angle = a1 - a0; //  if (Math.abs(angle) > 180) {
      //      angle -= 360;
      //  }

      if (angle > 180) {
        angle -= 360;
        angle %= 360;
      } else if (angle < -180) {
        angle += 360;
        angle %= 360;
      }
    }

    return angle;
  }

  static GetDegreeByXY(dx, dy) {
    if (Math.abs(dx) < 0.00001) {
      if (dy >= 0) return 270;else return 90;
    }

    let angle = Math.atan(dy / dx) * 180 / Math.PI;

    if (dx >= 0) {
      return angle;
    } else {
      return 180 + angle;
    } //  if (dy > 0 && dx > 0) {
    //      return angle
    //  } else if (dy < 0 && dx >= 0) {
    //      return 360 + angle;
    //  } else {
    //      return dx > 0 ? angle : 180 + angle;
    //  }

  }

  static GetRadianByXY(dx, dy) {
    if (Math.abs(dx) < MathConst.MATH_MIN_POSITIVE) {
      if (dy >= 0) return MathConst.MATH_1PER2PI;else return MathConst.MATH_3PER2PI;
    }

    let rad = Math.atan(dy / dx);

    if (dx >= 0) {
      return rad;
    } else {
      return MathConst.MATH_PI + rad;
    }
  }

  static GetRadianByCos(cosv, dx, dy) {
    var rad = Math.acos(cosv); //Math.atan(dy/dx);

    if (dx >= 0) {
      return rad;
    } else {
      return MathConst.MATH_PI + rad;
    }
  }

}

MathConst.MATH_MIN_POSITIVE = 1e-5;
MathConst.MATH_MAX_NEGATIVE = -1e-5;
MathConst.MATH_MAX_POSITIVE = 0xffffffe;
MathConst.MATH_MIN_NEGATIVE = -0xffffffe;
MathConst.MATH_1_OVER_255 = 1.0 / 255.0;
MathConst.MATH_PI = Math.PI;
MathConst.MATH_2PI = MathConst.MATH_PI * 2.0;
MathConst.MATH_3PER2PI = MathConst.MATH_PI * 1.5;
MathConst.MATH_1PER2PI = MathConst.MATH_PI * 0.5;
MathConst.MATH_1_OVER_PI = 1.0 / MathConst.MATH_PI;
MathConst.MATH_1_OVER_360 = 1.0 / 360.0;
MathConst.MATH_1_OVER_180 = 1.0 / 180.0;
MathConst.MATH_180_OVER_PI = 180.0 / MathConst.MATH_PI;
MathConst.MATH_PI_OVER_180 = MathConst.MATH_PI / 180.0;
MathConst.MATH_LN2 = 0.6931471805599453;
exports.default = MathConst;

/***/ }),

/***/ "7045":
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

class KeyboardEvent {
  constructor() {
    // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)
    this.phase = 0; // 事件类型

    this.type = KeyboardEvent.KEY_DOWN; // 事件发送者

    this.target = null;
    this.altKey = false;
    this.ctrlKey = false;
    this.shiftKey = false;
    this.repeat = false;
    this.key = "";
    this.keyCode = 0;
    this.location = 0;
  }

  getClassType() {
    return KeyboardEvent.EventClassType;
  }

  toString() {
    return "[KeyboardEvent]";
  }

}

KeyboardEvent.EventClassType = 1003;
KeyboardEvent.KEY_DOWN = 6001;
KeyboardEvent.KEY_UP = 6002;
exports.default = KeyboardEvent;

/***/ }),

/***/ "70f2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 独立的渲染场景子集,也就是子渲染场景类,字渲染场景拥有子集独立的Camera3D对象和view port 区域
// 不同的子场景，甚至可以拥有独立的matrix3D这样的数据池子

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const SubStage3D_1 = __importDefault(__webpack_require__("0236"));

const CameraBase_1 = __importDefault(__webpack_require__("c51d"));

const EntityNodeQueue_1 = __importDefault(__webpack_require__("af68"));

const Entity3DNodeLinker_1 = __importDefault(__webpack_require__("a80a"));

const RendererSpace_1 = __importDefault(__webpack_require__("a446"));

const RaySelector_1 = __importDefault(__webpack_require__("c711"));

const RayGpuSelector_1 = __importDefault(__webpack_require__("955e"));

const MouseEvt3DController_1 = __importDefault(__webpack_require__("765c"));

const FBOInstance_1 = __importDefault(__webpack_require__("af29"));

const Matrix4_1 = __importDefault(__webpack_require__("18c7"));

class RendererSubScene {
  constructor(parent, renderer, evtFlowEnabled) {
    this.m_uid = -1;
    this.m_adapter = null;
    this.m_renderProxy = null;
    this.m_rcontext = null;
    this.m_renderer = null;
    this.m_parent = null;
    this.m_processids = new Uint8Array(128);
    this.m_processidsLen = 0;
    this.m_rspace = null;
    this.m_mouse_rltv = new Vector3D_1.default();
    this.m_mouse_rlpv = new Vector3D_1.default();
    this.m_accessor = null; // event flow control enable

    this.m_evtFlowEnabled = false;
    this.m_evt3DCtr = null;
    this.m_mouseEvtEnabled = true;
    this.m_camera = null;
    this.m_viewX = 0.0;
    this.m_viewY = 0.0;
    this.m_viewW = 800.0;
    this.m_viewH = 800.0;
    this.m_nodeWaitLinker = null;
    this.m_nodeWaitQueue = null;
    this.m_perspectiveEnabled = true;
    this.m_rparam = null;
    this.m_stage3D = null;
    this.m_shader = null;
    this.m_runFlag = -1;
    this.m_autoRunning = true;
    this.m_currStage3D = null;
    this.m_enabled = true;
    this.textureBlock = null;
    this.materialBlock = null;
    this.entityBlock = null;
    this.m_containers = [];
    this.m_containersTotal = 0;
    this.m_mouseTestBoo = true;
    this.m_cullingTestBoo = true;
    this.m_rayTestFlag = true;
    this.m_rayTestEnabled = true;
    this.m_evtFlowEnabled = evtFlowEnabled;
    this.m_parent = parent;
    this.m_renderer = renderer;
    this.m_shader = renderer.getDataBuilder().getRenderShader();
    this.m_uid = 1024 + RendererSubScene.s_uid++;
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

  getUid() {
    return this.m_uid;
  }

  getRPONodeBuilder() {
    return null;
  }

  getRenderProxy() {
    return this.m_renderProxy;
  } // set new view port rectangle area


  setViewPort(px, py, pw, ph) {
    if (this.m_renderProxy != null) {
      this.m_viewX = px;
      this.m_viewY = py;
      this.m_viewW = pw;
      this.m_viewH = ph;
    }
  } // apply new view port rectangle area


  reseizeViewPort() {
    this.m_renderProxy.reseizeRCViewPort();
  }

  getRendererAdapter() {
    return this.m_adapter;
  }

  getRenderer() {
    return this.m_renderer;
  }

  getRendererContext() {
    return this.m_rcontext;
  }

  getStage3D() {
    return this.m_renderProxy.getStage3D();
  }

  getCurrentStage3D() {
    return this.m_currStage3D;
  }

  getViewWidth() {
    return this.m_renderProxy.getStage3D().viewWidth;
  }

  getViewHeight() {
    return this.m_renderProxy.getStage3D().viewHeight;
  }

  getCamera() {
    return this.m_camera;
  }
  /**
   * 获取渲染器可渲染对象管理器状态(版本号)
   */


  getRendererStatus() {
    return this.m_renderer.getRendererStatus();
  }

  getMouseXYWorldRay(rl_position, rl_tv) {
    this.m_camera.getWorldPickingRayByScreenXY(this.m_stage3D.mouseX, this.m_stage3D.mouseY, rl_position, rl_tv);
  }

  createCamera() {
    return new CameraBase_1.default();
  }

  createFBOInstance() {
    return new FBOInstance_1.default(this, this.textureBlock.getRTTStrore());
  }

  createMatrix4() {
    return new Matrix4_1.default();
  }

  setEvt3DController(evt3DCtr) {
    if (evt3DCtr != null) {
      if (this.m_currStage3D == null) {
        this.m_currStage3D = new SubStage3D_1.default(this.m_renderProxy.getRCUid(), null);
        this.m_currStage3D.uProbe = this.m_renderProxy.uniformContext.createUniformVec4Probe(1);
      }

      evt3DCtr.initialize(this.getStage3D(), this.m_currStage3D);
      evt3DCtr.setRaySelector(this.m_rspace.getRaySelector());
    }

    this.m_evt3DCtr = evt3DCtr;
  }

  isRayPickSelected() {
    return this.m_evt3DCtr != null && this.m_evt3DCtr.isSelected();
  }

  enableMouseEvent(gpuTestEnabled = true) {
    if (this.m_evt3DCtr == null) {
      if (gpuTestEnabled) {
        this.m_rspace.setRaySelector(new RayGpuSelector_1.default());
      } else {
        this.m_rspace.setRaySelector(new RaySelector_1.default());
      }

      this.setEvt3DController(new MouseEvt3DController_1.default());
    }

    this.m_mouseEvtEnabled = true;
  }

  disableMouseEvent() {
    this.m_mouseEvtEnabled = false;
  }

  getEvt3DController() {
    return this.m_evt3DCtr;
  }

  getSpace() {
    return this.m_rspace;
  }

  getDevicePixelRatio() {
    return this.m_adapter.getDevicePixelRatio();
  }

  addEventListener(type, target, func, captureEnabled = true, bubbleEnabled = false) {
    this.m_currStage3D.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
  }

  removeEventListener(type, target, func) {
    this.m_currStage3D.removeEventListener(type, target, func);
  }

  setAccessor(accessor) {
    this.m_accessor = accessor;
  }

  initialize(rparam, renderProcessesTotal = 3, createNewCamera = true) {
    if (this.m_renderProxy == null) {
      if (renderProcessesTotal < 1) {
        renderProcessesTotal = 1;
      }

      if (renderProcessesTotal > 8) {
        renderProcessesTotal = 8;
      }

      this.m_rparam = rparam;
      this.m_perspectiveEnabled = rparam.cameraPerspectiveEnabled;
      let process = null;

      for (; renderProcessesTotal >= 0;) {
        process = this.m_renderer.appendProcess(rparam.batchEnabled, rparam.processFixedState);
        this.m_processids[this.m_processidsLen] = process.getRPIndex();
        this.m_processidsLen++;
        --renderProcessesTotal;
      }

      this.m_rcontext = this.m_renderer.getRendererContext();
      this.m_renderProxy = this.m_rcontext.getRenderProxy();
      this.m_adapter = this.m_renderProxy.getRenderAdapter();
      this.m_stage3D = this.m_renderProxy.getStage3D();
      this.m_viewX = this.m_stage3D.getViewX();
      this.m_viewY = this.m_stage3D.getViewY();
      this.m_viewW = this.m_stage3D.getViewWidth();
      this.m_viewH = this.m_stage3D.getViewHeight();

      if (createNewCamera) {
        this.createMainCamera();
      } else {
        this.m_camera = this.m_renderProxy.getCamera();
      }

      if (this.m_rspace == null) {
        this.m_rspace = new RendererSpace_1.default();
        this.m_rspace.initialize(this.m_renderer, this.m_camera);
      }
    }
  }

  createMainCamera() {
    this.m_camera = new CameraBase_1.default();
    this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
    this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
    let vec3 = this.m_rparam.camProjParam;

    if (this.m_perspectiveEnabled) {
      this.m_camera.perspectiveRH(MathConst_1.default.DegreeToRadian(vec3.x), this.m_viewW / this.m_viewH, vec3.y, vec3.z);
    } else {
      this.m_camera.orthoRH(vec3.y, vec3.z, -0.5 * this.m_viewH, 0.5 * this.m_viewH, -0.5 * this.m_viewW, 0.5 * this.m_viewW);
    }

    this.m_camera.lookAtRH(this.m_rparam.camPosition, this.m_rparam.camLookAtPos, this.m_rparam.camUpDirect);
    this.m_camera.update();
  }

  cameraLock() {
    this.m_camera.lock();
  }

  cameraUnlock() {
    this.m_camera.unlock();
  }

  updateRenderBufferSize() {
    this.m_adapter.updateRenderBufferSize();
  }

  setRendererProcessParam(index, batchEnabled, processFixedState) {
    this.m_renderer.setRendererProcessParam(this.m_processids[index], batchEnabled, processFixedState);
  }

  appendARendererProcess(batchEnabled = true, processFixedState = false) {
    let process = this.m_renderer.appendProcess(batchEnabled, processFixedState);
    this.m_processids[this.m_processidsLen] = process.getRPIndex();
    this.m_processidsLen++;
  }
  /**
   * get the renderer process by process index
   * @param processIndex IRenderProcess instance index in renderer scene instance
   */


  getRenderProcessAt(processIndex) {
    return this.m_renderer.getProcessAt(this.m_processids[processIndex]);
  }

  addContainer(container, processIndex = 0) {
    if (processIndex < 0) {
      processIndex = 0;
    }

    if (container != null && container.__$wuid < 0 && container.__$contId < 1) {
      let i = 0;

      for (; i < this.m_containersTotal; ++i) {
        if (this.m_containers[i] == container) {
          return;
        }
      }

      if (i >= this.m_containersTotal) {
        container.__$wuid = this.m_uid;
        container.wprocuid = processIndex;

        container.__$setRenderer(this);

        this.m_containers.push(container);
        this.m_containersTotal++;
      }
    }
  }

  removeContainer(container) {
    if (container != null && container.__$wuid == this.m_uid && container.getRenderer() == this.m_renderer) {
      let i = 0;

      for (; i < this.m_containersTotal; ++i) {
        if (this.m_containers[i] == container) {
          container.__$wuid = -1;
          container.wprocuid = -1;

          container.__$setRenderer(null);

          this.m_containers.splice(i, 1);
          --this.m_containersTotal;
          break;
        }
      }
    }
  }

  setAutoRunningEnabled(autoRunning) {
    this.m_autoRunning = autoRunning;
  }
  /**
   * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
   * move rendering runtime displayEntity to different renderer process
   */


  moveEntityTo(entity, processIndex) {
    this.m_renderer.moveEntityToProcessAt(entity, this.m_processids[processIndex]);
  }
  /**
   * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
   * @param entity 需要指定绘制的 IRenderEntity 实例
   * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
   * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
   */


  drawEntity(entity, useGlobalUniform = false, forceUpdateUniform = true) {
    this.m_renderer.drawEntity(entity, useGlobalUniform, forceUpdateUniform);
  }
  /**
   * add an entity to the renderer process of the renderer instance
   * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
   * @param processid this destination renderer process id
   * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
   */


  addEntity(entity, processIndex = 0, deferred = true) {
    if (entity != null && entity.__$testSpaceEnabled()) {
      if (entity.isPolyhedral()) {
        if (entity.hasMesh()) {
          this.m_renderer.addEntity(entity, this.m_processids[processIndex], deferred);

          if (this.m_rspace != null) {
            this.m_rspace.addEntity(entity);
          }
        } else {
          // wait queue
          if (this.m_nodeWaitLinker == null) {
            this.m_nodeWaitLinker = new Entity3DNodeLinker_1.default();
            this.m_nodeWaitQueue = new EntityNodeQueue_1.default();
          }

          let node = this.m_nodeWaitQueue.addEntity(entity);
          node.rstatus = processIndex;
          this.m_nodeWaitLinker.addNode(node);
        }
      } else {
        this.m_renderer.addEntity(entity, this.m_processids[processIndex], deferred);

        if (this.m_rspace != null) {
          this.m_rspace.addEntity(entity);
        }
      }
    }
  } // 这是真正的完全将entity从world中清除


  removeEntity(entity) {
    if (entity != null) {
      let node = null;

      if (this.m_nodeWaitLinker != null) {
        let node = this.m_nodeWaitQueue.getNodeByEntity(entity);

        if (node != null) {
          this.m_nodeWaitLinker.removeNode(node);
          this.m_nodeWaitQueue.removeEntity(entity);
        }
      }

      if (node == null) {
        this.m_renderer.removeEntity(entity);

        if (this.m_rspace != null) {
          this.m_rspace.removeEntity(entity);
        }
      }
    }
  }

  updateMaterialUniformToCurrentShd(material) {
    this.m_renderer.updateMaterialUniformToCurrentShd(material);
  } // 首先要锁定Material才能用这种绘制方式,再者这个entity已经完全加入渲染器了渲染资源已经准备完毕,这种方式比较耗性能，只能用在特殊的地方
  // drawEntityByLockMaterial(entity: IRenderEntity): void {
  //     this.m_renderer.drawEntityByLockMaterial(entity);
  // }


  showInfoAt(index) {
    this.m_renderer.showInfoAt(index);
  }

  updateCameraData(camera) {
    this.m_rcontext.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
  }
  /**
   * the function only resets the renderer instance rendering status.
   * you should use it before the run or runAt function is called.
   */


  renderBegin(contextBeginEnabled = false) {
    if (contextBeginEnabled) {
      this.m_rcontext.renderBegin();
    }

    if (this.m_renderProxy.getCamera() != this.m_camera) {
      //let boo: boolean = this.m_renderProxy.testViewPortChanged(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
      if (this.m_renderProxy.isAutoSynViewAndStage()) {
        this.m_viewX = this.m_renderProxy.getViewX();
        this.m_viewY = this.m_renderProxy.getViewY();
        this.m_viewW = this.m_renderProxy.getViewWidth();
        this.m_viewH = this.m_renderProxy.getViewHeight();
      }

      this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
      this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
      this.m_renderProxy.setRCViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH, this.m_renderProxy.isAutoSynViewAndStage());
      this.m_renderProxy.reseizeRCViewPort();
    }

    this.m_camera.update();
    this.m_rcontext.updateCameraDataFromCamera(this.m_camera);
    this.m_shader.renderBegin();

    if (this.m_accessor != null) {
      this.m_accessor.renderBegin(this);
    }
  }
  /**
   * the function resets the renderer scene status.
   * you should use it on the frame starting time.
   */


  runBegin(autoCycle = true, contextBeginEnabled = false) {
    if (autoCycle && this.m_autoRunning) {
      if (this.m_runFlag >= 0) this.runEnd();
      this.m_runFlag = 0;
    }

    this.renderBegin(contextBeginEnabled);

    if (this.m_rspace != null) {
      //this.m_rspace.setCamera(camFlag ? this.m_renderProxy.getCamera() : this.m_currCamera);
      this.m_rspace.setCamera(this.m_camera);
      this.m_rspace.runBegin();
    }
  }

  setRayTestEanbled(enabled) {
    this.m_rayTestEnabled = enabled;
  }
  /**
   * @param evtFlowPhase  0(none phase),1(capture phase),2(bubble phase)
   * @param status: 1(default process),1(deselect ray pick target)
   * @requires 1 is send evt yes,0 is send evt no,-1 is event nothing
   */


  runMouseTest(evtFlowPhase, status) {
    let flag = -1;

    if (this.m_evt3DCtr != null && this.m_mouseEvtEnabled) {
      if (this.m_rayTestFlag && this.m_evt3DCtr.getEvtType() > 0) {
        // 是否对已经获得的拾取列表做进一步的gpu拾取
        let selector = this.m_rspace.getRaySelector();

        if (selector != null) {
          if (this.m_rayTestEnabled) {
            this.mouseRayTest();
          } else {
            selector.clear();
          } // 如果有gpu拾取则进入这个管理器, 这个管理器得到最终的拾取结果再和前面的计算结果做比较


          let total = selector.getSelectedNodesTotal();

          if (total > 1) {
            let i = 0;
            let list = selector.getSelectedNodes();
            let node = null;

            for (; i < total; ++i) {
              node = list[i];

              if (node.entity.isPolyhedral()) {//this.m_renderer.drawEntityByLockMaterial(node.entity);
              }
            }
          }
        }

        this.m_rayTestFlag = false;
      }

      flag = this.m_evt3DCtr.run(evtFlowPhase, status);
    }

    this.m_mouseTestBoo = false;
    return flag;
  }
  /**
   * update all data or status of the renderer runtime
   * should call this function per frame
   */


  update(autoCycle = true, mouseEventEnabled = true) {
    if (this.m_currStage3D != null) this.m_currStage3D.enterFrame();

    if (autoCycle && this.m_autoRunning) {
      if (this.m_runFlag != 0) this.runBegin();
      this.m_runFlag = 1;
    }

    this.m_mouseTestBoo = true;
    this.m_cullingTestBoo = true;
    this.m_rayTestFlag = true; // wait mesh data ready to finish

    if (this.m_nodeWaitLinker != null) {
      let nextNode = this.m_nodeWaitLinker.getBegin();

      if (nextNode != null) {
        let pnode;
        let entity;
        let status;

        while (nextNode != null) {
          if (nextNode.entity.hasMesh()) {
            pnode = nextNode;
            nextNode = nextNode.next;
            entity = pnode.entity;
            status = pnode.rstatus;
            this.m_nodeWaitLinker.removeNode(pnode);
            this.m_nodeWaitQueue.removeEntity(pnode.entity); //console.log("RenderScene::update(), ready a mesh data that was finished.");

            this.addEntity(entity, status);
          } else {
            nextNode = nextNode.next;
          }
        }
      }
    } //  this.m_renderer.update();          


    let i = 0;

    for (; i < this.m_containersTotal; ++i) {
      this.m_containers[i].update();
    } // space update


    if (this.m_rspace != null) {
      this.m_rspace.update();
    }

    if (this.m_rspace != null && this.m_cullingTestBoo) {
      if (this.m_evt3DCtr != null || this.m_rspace.getRaySelector() != null) {
        this.m_rspace.run();
      }
    }

    if (this.m_mouseTestBoo && !this.m_evtFlowEnabled) {
      if (mouseEventEnabled) {
        this.runMouseTest(1, 0);
      } else if (this.m_evt3DCtr != null) {
        this.m_evt3DCtr.mouseOutEventTarget();
      }
    }
  } // 渲染可见性裁剪测试


  cullingTest() {
    if (this.m_rspace != null) {
      this.m_rspace.run();
    }

    this.m_cullingTestBoo = false;
  } // 鼠标位置的射线拾取测试


  mouseRayTest() {
    if (this.m_rspace != null) {
      this.getMouseXYWorldRay(this.m_mouse_rlpv, this.m_mouse_rltv);
      this.m_rspace.rayTest(this.m_mouse_rlpv, this.m_mouse_rltv);
    }
  } // rendering running


  run(autoCycle = false) {
    if (this.m_enabled) {
      //console.log("rendererSubScene::run...");
      if (autoCycle && this.m_autoRunning) {
        if (this.m_runFlag != 1) this.update();
        this.m_runFlag = 2;
      }

      for (let i = 0; i < this.m_processidsLen; ++i) {
        this.m_renderer.runAt(this.m_processids[i]);
      }

      if (autoCycle) {
        this.runEnd();
      }
    }
  }

  runAt(index) {
    this.m_renderer.runAt(this.m_processids[index]);
  }

  runEnd() {
    if (this.m_evt3DCtr != null) {
      this.m_evt3DCtr.runEnd();
    }

    if (this.m_rspace != null) {
      this.m_rspace.runEnd();
    }

    if (this.m_autoRunning) {
      this.m_runFlag = -1;
    }

    if (this.m_accessor != null) {
      this.m_accessor.renderEnd(this);
    }
  }

  useCamera(camera, syncCamView = false) {
    this.m_parent.useCamera(camera, syncCamView);
  }

  useMainCamera() {
    this.m_parent.useMainCamera();
  }

  updateCamera() {
    if (this.m_camera != null) {
      this.m_camera.update();
    }
  }

  setClearUint24Color(colorUint24, alpha = 1.0) {
    this.m_renderProxy.setClearUint24Color(colorUint24, alpha);
  }

  setClearRGBColor3f(pr, pg, pb) {
    this.m_renderProxy.setClearRGBColor3f(pr, pg, pb);
  }

  setClearRGBAColor4f(pr, pg, pb, pa) {
    this.m_renderProxy.setClearRGBAColor4f(pr, pg, pb, pa);
  }

  setClearColor(color) {
    this.m_renderProxy.setClearRGBAColor4f(color.r, color.g, color.b, color.a);
  }

  setRenderToBackBuffer() {
    this.m_renderProxy.setRenderToBackBuffer();
  }

  toString() {
    return "[RendererSubScene(uid = " + this.m_uid + ")]";
  }

}

RendererSubScene.s_uid = 0;
exports.default = RendererSubScene;

/***/ }),

/***/ "7181":
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

class ImgTexData {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.data = null;
    this.miplevel = 0; // 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新

    this.status = 1;
    this.offsetx = 0;
    this.offsety = 0;
  }

  updateToGpu(gl, samplerTarget, interType, format, type, force) {
    if (this.status == 1 || force) {
      gl.texImage2D(samplerTarget, this.miplevel, interType, format, type, this.data);
    } else if (this.status == 0) {
      gl.texSubImage2D(samplerTarget, this.miplevel, this.offsetx, this.offsety, format, type, this.data);
    }

    this.status = -1;
  }

  static Create() {
    if (ImgTexData.s_list.length > 0) {
      return ImgTexData.s_list.pop();
    }

    return new ImgTexData();
  }

  static Restore(tsd) {
    if (tsd != null) {
      tsd.data = null;
      ImgTexData.s_list.push(tsd);
    }
  }

}

ImgTexData.s_list = [];
exports.default = ImgTexData;

/***/ }),

/***/ "722e":
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

class RenderFilter {}

RenderFilter.NEAREST = 4001;
RenderFilter.LINEAR = 4002;
RenderFilter.LINEAR_MIPMAP_LINEAR = 4003;
RenderFilter.NEAREST_MIPMAP_NEAREST = 4004;
RenderFilter.LINEAR_MIPMAP_NEAREST = 4005;
RenderFilter.NEAREST_MIPMAP_LINEAR = 4006;
exports.default = RenderFilter;

/***/ }),

/***/ "7279":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const ShaderUniform_1 = __importDefault(__webpack_require__("d53d"));

class ShaderGlobalUniform extends ShaderUniform_1.default {
  constructor(slot) {
    super();
    this.m_slot = null;
    this.m_slotFlags = null;
    this.m_slotDatas = null;
    this.slotId = 0;
    this.slotIndex = 0;
    this.uniformsTotal = 0;
    this.locationIndexList = null;
    this.locations = null;
    this.rst = 0;
    this.always = false;
    this.m_slot = slot;
    this.m_slotFlags = this.m_slot.flagList;
    this.m_slotDatas = this.m_slot.dataList;
  }

  applyData() {}

  clone() {
    let guniform = new ShaderGlobalUniform(this.m_slot);
    guniform.types = this.types.slice(0);
    guniform.uniformNameList = this.uniformNameList.slice(0);
    guniform.dataSizeList = this.dataSizeList.slice(0);
    guniform.slotIndex = this.slotIndex;
    guniform.uniformsTotal = this.uniformsTotal;
    guniform.slotId = this.slotId;
    guniform.always = this.always;
    guniform.rst = this.rst;
    return guniform;
  } // for multi uniforms data src, for example: camera, lightGroup


  copyDataFromProbe(probe) {
    this.types = probe.uniformTypes.slice(0);
    this.dataSizeList = probe.dataSizeList.slice(0);
    this.slotIndex = probe.getSlotBeginIndex();
    this.uniformsTotal = probe.uniformsTotal;
    this.slotId = probe.getRCUid();
  }

  copyDataFromProbeAt(i, probe) {
    if (this.types == null) {
      this.types = [];
      this.dataSizeList = [];
    }

    this.slotIndex = probe.getSlotBeginIndex() + i;
    this.uniformsTotal = 1;
    this.slotId = probe.getRCUid();
    this.types[0] = probe.uniformTypes[i];
    this.dataSizeList[0] = probe.dataSizeList[i];
  }

  use(rc) {
    //let slot: UniformDataSlot = UniformDataSlot.GetSlotAt(rc.getRCUid());
    if (this.always || this.rst != this.m_slotFlags[this.slotIndex]) {
      //  if(rc.getGPUProgram() == null) {
      //      console.warn("current gpu shader program is null");
      //  }
      //  if(this.program != null) {
      //      console.log("have gpu shader program in this global uniform, program: ",this.program,this.locations);
      //  }
      //  if(this.program != null && rc.getGPUProgram() != this.program) {
      //      console.warn("current gpu shader program can't match this global uniform.");
      //  }
      this.rst = this.m_slotFlags[this.slotIndex];
      let i = 0;
      let datas = this.m_slotDatas;

      if (RendererDevice_1.default.IsWebGL1()) {
        for (; i < this.uniformsTotal; ++i) {
          rc.useUniformV1(this.locations[i], this.types[i], datas[this.slotIndex + i], this.dataSizeList[i]);
        }
      } else {
        //console.log(this.uns, ", GlobalUniform this.uniformsTotal: ",this.uniformsTotal,this.dataSizeList);
        for (; i < this.uniformsTotal; ++i) {
          // if(this.types[i] == MaterialConst.SHADER_VEC4FV) {
          //     console.log("SHADER_VEC4FV, slot.dataList["+(this.slotIndex + i)+"]: ",slot.dataList[this.slotIndex + i]);
          // }
          rc.useUniformV2(this.locations[i], this.types[i], datas[this.slotIndex + i], this.dataSizeList[i], 0);
        }
      }
    }
  }

  destroy() {
    this.types = null;
    this.dataSizeList = null;
    this.slotIndex = -1;
    this.uniformsTotal = 0;
    this.m_slot = null;
    this.m_slotFlags = null;
    this.m_slotDatas = null;
  }

}

exports.default = ShaderGlobalUniform;

/***/ }),

/***/ "7499":
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

class RenderMaterialProxy {
  constructor() {
    this.m_dispBuilder = null;
    this.m_shader = null;
    this.m_texRes = null;
  }

  setDispBuilder(builder) {
    if (this.m_dispBuilder == null) {
      this.m_dispBuilder = builder;
      this.m_shader = builder.getRenderShader();
      this.m_texRes = builder.getTextureResource();
    }
  }

  unlockMaterial() {
    this.m_shader.unlock();
    this.m_texRes.unlocked = true;
  }

  lockMaterial() {
    this.m_shader.lock();
    this.m_texRes.unlocked = false;
  }

  isUnlockMatrial() {
    return this.m_texRes.unlocked;
  }

  unlockTexture() {
    this.m_shader.textureUnlock();
  }

  lockTexture() {
    this.m_shader.textureLock();
  }

  renderBegin() {
    this.m_shader.renderBegin();
    this.m_texRes.renderBegin();
  }

  resetUniform() {
    this.m_shader.resetUniform();
  }

  useGlobalMaterial(material, materialUniformUpdate = false) {
    if (material != null) {
      this.m_dispBuilder.updateGlobalMaterial(material, materialUniformUpdate);
    }
  }

  updateMaterialUniform(material) {
    this.m_shader.updateUniform(material.__$uniform);
  }

}

exports.default = RenderMaterialProxy;

/***/ }),

/***/ "74c3":
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
}); // gpu vertex buffer renderer resource

class ROVertexResource {
  constructor(rcuid, gl, vtxBuilder) {
    this.m_resMap = new Map();
    this.m_freeMap = new Map();
    this.m_updateIds = []; // 显存的vtx buffer的总数

    this.m_vtxResTotal = 0;
    this.m_attachTotal = 0;
    this.m_delay = 128;
    this.m_haveDeferredUpdate = false;
    /**
     * updating times total, the min value is 4, the default value is 16
     */

    this.m_vtxUpdateTotal = 16; // renderer context unique id

    this.m_rcuid = 0;
    this.m_gl = null;
    this.m_vtxBuilder = null;
    this.unlocked = true;
    this.m_rcuid = rcuid;
    this.m_gl = gl;
    this.m_vtxBuilder = vtxBuilder;
  }
  /**
   * set the updating times total that update vertex data to gpu in one frame time
   * @param total updating times total, the min value is 4, the default value is 16
   */


  setVtxUpdateTimesTotal(total) {
    this.m_vtxUpdateTotal = total > 4 ? total : 4;
  }

  createResByParams3(resUid, param0, param1, param2) {
    return false;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }
  /**
   * @returns return system gpu context
   */


  getRC() {
    return this.m_gl;
  }
  /**
   * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
   * @param resUid renderer runtime resource unique id
   * @returns has or has not resource by unique id
   */


  hasResUid(resUid) {
    return this.m_resMap.has(resUid);
  }
  /**
   * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
   * @param resUid renderer runtime resource unique id
   */


  bindToGpu(resUid) {}
  /**
   * get system gpu context resource buf
   * @param resUid renderer runtime resource unique id
   * @returns system gpu context resource buf
   */


  getGpuBuffer(resUid) {
    return null;
  }

  renderBegin() {
    this.m_vtxBuilder.renderBegin();
  }

  getVertexResTotal() {
    return this.m_vtxResTotal;
  }

  updateDataToGpu(resUid, deferred) {
    if (deferred) {
      this.m_updateIds.push(resUid);
      this.m_haveDeferredUpdate = true;
    } else {
      if (this.m_resMap.has(resUid)) {
        this.m_resMap.get(resUid).updateToGpu(this.m_vtxBuilder);
      }
    }
  }

  addVertexRes(object) {
    if (!this.m_resMap.has(object.resUid)) {
      object.waitDelTimes = 0; //console.log("ROTextureResource add a texture buffer(resUid="+object.resUid+")");

      this.m_resMap.set(object.resUid, object);
      this.m_vtxResTotal++;
    }
  }

  getVertexRes(resUid) {
    return this.m_resMap.get(resUid);
  }

  destroyRes(resUid) {
    if (this.m_resMap.has(resUid)) {
      this.m_resMap.get(resUid).destroy(this.m_vtxBuilder);
    }
  }

  __$attachRes(resUid) {
    if (this.m_resMap.has(resUid)) {
      this.m_attachTotal++;
      let object = this.m_resMap.get(resUid);

      if (object.getAttachCount() < 1) {
        if (this.m_freeMap.has(resUid)) {
          this.m_freeMap.delete(resUid);
        }
      }

      object.waitDelTimes = 0;

      object.__$attachThis();
    }
  }

  __$detachRes(resUid) {
    if (this.m_resMap.has(resUid)) {
      if (this.m_resMap.has(resUid)) {
        let object = this.m_resMap.get(resUid);

        if (object.getAttachCount() > 0) {
          this.m_attachTotal--;

          object.__$detachThis();

          if (object.getAttachCount() < 1) {
            // 将其加入待清理的map
            this.m_freeMap.set(resUid, object);
          }
        }
      }
    }
  }

  getVROByResUid(resUid, shdp, vaoEnabled) {
    let vtxObj = this.m_resMap.get(resUid);

    if (vtxObj != null) {
      return vtxObj.createVRO(this.m_vtxBuilder, shdp, vaoEnabled);
    }

    return null;
  }

  update() {
    if (this.m_haveDeferredUpdate) {
      let len = this.m_updateIds.length;

      if (len > 0) {
        if (len > this.m_vtxUpdateTotal) len = this.m_vtxUpdateTotal;
        let resUid;

        for (let i = 0; i < len; ++i) {
          resUid = this.m_updateIds.shift();

          if (this.m_resMap.has(resUid)) {
            //console.log("ROvtxRes("+resUid+") update vtx("+resUid+") data to gpu with deferred mode.");
            this.m_resMap.get(resUid).updateToGpu(this.m_vtxBuilder);
          }
        }
      } else {
        this.m_haveDeferredUpdate = false;
      }
    }

    this.m_delay--;

    if (this.m_delay < 1) {
      this.m_delay = 128;

      for (const [key, value] of this.m_freeMap) {
        value.waitDelTimes++;

        if (value.getAttachCount() < 1) {
          if (value.waitDelTimes > 5) {
            console.log("ROVertexResource remove a vertex buffer(resUid=" + value.resUid + ")");
            this.m_resMap.delete(value.resUid);
            this.m_freeMap.delete(value.resUid);
            value.destroy(this.m_vtxBuilder);
            this.m_vtxResTotal--;
          }
        } else {
          console.log("ROVertexResource repeat use a vertex buffer(resUid=" + value.resUid + ") from freeMap.");
          this.m_freeMap.delete(value.resUid);
        }
      }
    }
  }

}

exports.ROVertexResource = ROVertexResource;
exports.default = ROVertexResource;

/***/ }),

/***/ "765c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 渲染场景内物体的鼠标事件控制类

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MouseEvent_1 = __importDefault(__webpack_require__("1710"));

class MouseEvt3DController {
  constructor() {
    this.m_uid = 0;
    this.m_mainStage = null;
    this.m_currStage = null;
    this.m_raySelector = null;
    this.m_unlockBoo = true;
    this.m_mouseEvt = new MouseEvent_1.default();
    this.m_mouseOverEvt = new MouseEvent_1.default();
    this.m_mouseOutEvt = new MouseEvent_1.default();
    this.m_evtTypes = new Float32Array(64);
    this.m_evtXList = new Float32Array(64);
    this.m_evtYList = new Float32Array(64);
    this.m_evtWheelDeltaYs = new Float32Array(64);
    this.m_evtTotal = 0;
    this.m_evtEntity = null;
    this.m_evtContainer = null;
    this.m_evtFlowPhase = -1;
    this.m_uid = MouseEvt3DController.s_uid++;
  }

  initialize(mainStage, currStage) {
    //console.log("MouseEvt3DController::initialize()......");
    if (this.m_mainStage == null) {
      this.m_mainStage = mainStage;
      this.m_currStage = currStage;
      mainStage.addEventListener(MouseEvent_1.default.MOUSE_DOWN, this, this.mouseDownListener, true, false);
      mainStage.addEventListener(MouseEvent_1.default.MOUSE_UP, this, this.mouseUpListener, true, false);
      mainStage.addEventListener(MouseEvent_1.default.MOUSE_CLICK, this, this.mouseClickListener, true, false);
      mainStage.addEventListener(MouseEvent_1.default.MOUSE_MOVE, this, this.mouseMoveListener, true, false);
      mainStage.addEventListener(MouseEvent_1.default.MOUSE_WHEEL, this, this.mouseWheeelListener, true, false);
    }
  }

  setRaySelector(raySelector) {
    this.m_raySelector = raySelector;
  }

  mouseWheeelListener(evt) {
    if (this.m_currStage != null) {
      this.m_currStage.mouseX = this.m_mainStage.mouseX;
      this.m_currStage.mouseY = this.m_mainStage.mouseY;
    }

    this.m_evtTypes[this.m_evtTotal] = evt.type;
    this.m_evtXList[this.m_evtTotal] = evt.mouseX;
    this.m_evtYList[this.m_evtTotal] = evt.mouseY;
    this.m_evtWheelDeltaYs[this.m_evtTotal] = evt.wheelDeltaY;
    this.m_mouseEvt.type = evt.type;
    this.m_evtTotal++;
  } // 鼠标动了, 摄像机动了, 被渲染对象本身动了,都可能形成mouse move事件


  mouseMoveListener(evt) {
    if (this.m_currStage != null) {
      this.m_currStage.mouseX = this.m_mainStage.mouseX;
      this.m_currStage.mouseY = this.m_mainStage.mouseY; //this.m_currStage.mouseMove();
    }

    this.m_evtTypes[this.m_evtTotal] = evt.type;
    this.m_evtXList[this.m_evtTotal] = evt.mouseX;
    this.m_evtYList[this.m_evtTotal] = evt.mouseY;
    this.m_evtWheelDeltaYs[this.m_evtTotal] = 0;
    this.m_mouseEvt.type = evt.type;
    this.m_evtTotal++;
  }

  mouseDownListener(evt) {
    if (this.m_currStage != null) {
      this.m_currStage.mouseX = this.m_mainStage.mouseX;
      this.m_currStage.mouseY = this.m_mainStage.mouseY;
    }

    if (MouseEvt3DController.s_unlockMouseEvt) {
      this.m_evtTypes[this.m_evtTotal] = evt.type;
      this.m_evtXList[this.m_evtTotal] = evt.mouseX;
      this.m_evtYList[this.m_evtTotal] = evt.mouseY;
      this.m_evtWheelDeltaYs[this.m_evtTotal] = 0;
      this.m_mouseEvt.type = evt.type;
      this.m_evtTotal++;
    }
  }

  mouseUpListener(evt) {
    if (this.m_currStage != null) {
      this.m_currStage.mouseX = this.m_mainStage.mouseX;
      this.m_currStage.mouseY = this.m_mainStage.mouseY;
    }

    if (MouseEvt3DController.s_unlockMouseEvt) {
      this.m_evtTypes[this.m_evtTotal] = evt.type;
      this.m_evtXList[this.m_evtTotal] = evt.mouseX;
      this.m_evtYList[this.m_evtTotal] = evt.mouseY;
      this.m_evtWheelDeltaYs[this.m_evtTotal] = 0;
      this.m_mouseEvt.type = evt.type;
      this.m_evtTotal++;
    }
  }

  mouseClickListener(evt) {
    if (this.m_currStage != null) {
      this.m_currStage.mouseX = this.m_mainStage.mouseX;
      this.m_currStage.mouseY = this.m_mainStage.mouseY;
    }

    if (MouseEvt3DController.s_unlockMouseEvt) {
      this.m_evtTypes[this.m_evtTotal] = evt.type;
      this.m_evtXList[this.m_evtTotal] = evt.mouseX;
      this.m_evtYList[this.m_evtTotal] = evt.mouseY;
      this.m_evtWheelDeltaYs[this.m_evtTotal] = 0;
      this.m_mouseEvt.type = evt.type;
      this.m_evtTotal++;
    }
  }

  mouseOutEventTarget() {
    if (this.m_currStage != null) {
      this.m_currStage.mouseX = this.m_mainStage.mouseX;
      this.m_currStage.mouseY = this.m_mainStage.mouseY;
    }

    if (this.m_evtEntity != null) {
      let dispatcher = this.m_evtEntity.getEvtDispatcher(MouseEvent_1.default.EventClassType);

      if (dispatcher != null) {
        this.m_mouseOutEvt.phase = this.m_evtFlowPhase;
        this.m_mouseOutEvt.type = MouseEvent_1.default.MOUSE_OUT;
        this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
        this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
        this.m_mouseOutEvt.target = this.m_evtEntity;
        this.m_raySelector.getRay(this.m_mouseOutEvt.raypv, this.m_mouseOutEvt.raytv);
        this.m_evtEntity = null;
        return dispatcher.dispatchEvt(this.m_mouseOutEvt);
      }

      this.m_evtEntity = null;
    }

    return 0;
  }
  /**
   * @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
   * @param       status: 1(default process),1(deselect ray pick target)
   * @return      1 is send evt yes,0 is send evt no,-1 is event nothing
   */


  run(evtFlowPhase, status) {
    let flag = -1;

    if (this.m_unlockBoo) {
      this.m_evtFlowPhase = evtFlowPhase;
      let i = 0;
      flag = this.m_evtTotal > 0 ? 0 : -1;
      let dispatcher = null;
      let node;
      let lpv;
      let wpv;

      if (flag > -1) {
        if (this.m_currStage != this.m_mainStage && this.m_currStage != null) {
          MouseEvt3DController.s_unlockMouseEvt = false;

          for (i = 0; i < this.m_evtTotal; i++) {
            switch (this.m_evtTypes[i]) {
              case MouseEvent_1.default.MOUSE_DOWN:
                this.m_currStage.mouseDown(1);
                break;

              case MouseEvent_1.default.MOUSE_UP:
                this.m_currStage.mouseUp(1);
                break;

              case MouseEvent_1.default.MOUSE_MOVE:
                this.m_currStage.mouseMove();
                break;

              default:
                break;
            }
          }

          MouseEvt3DController.s_unlockMouseEvt = true;
        }

        node = status < 1 ? this.m_raySelector.getSelectedNode() : null;

        if (node != null) {
          lpv = node.lpv;
          wpv = node.wpv;
          let entity = node.entity;
          dispatcher = entity.getEvtDispatcher(MouseEvent_1.default.EventClassType);

          let container = entity.__$getParent();

          let containerFlag = container != null && container.mouseEnabled;
          let tttFlag = 0;

          if (!containerFlag) {
            flag += this.mouseOutContainer(evtFlowPhase, null, null, null); // // for test
            // if(this.m_evtContainer != null) {
            //     tttFlag ++;
            // }

            this.m_evtContainer = null;
          }

          let preEvtEvent = this.m_evtEntity;

          for (let i = 0; i < this.m_evtTotal; i++) {
            this.m_mouseEvt.type = this.m_evtTypes[i];
            this.m_mouseEvt.mouseX = this.m_evtXList[i];
            this.m_mouseEvt.mouseY = this.m_evtYList[i];
            this.m_mouseEvt.wheelDeltaY = this.m_evtWheelDeltaYs[i];

            if (this.m_mouseEvt.type > 0) {
              if (node != null) {
                if (dispatcher != null) {
                  this.m_mouseEvt.target = entity;
                  this.m_mouseEvt.currentTarget = entity;
                  this.m_mouseEvt.phase = evtFlowPhase;
                  this.m_mouseEvt.lpos.copyFrom(lpv);
                  this.m_mouseEvt.wpos.copyFrom(wpv);
                  this.m_raySelector.getRay(this.m_mouseEvt.raypv, this.m_mouseEvt.raytv);
                  flag += this.mouseOutEntity(evtFlowPhase, entity, lpv, wpv);

                  if (this.m_evtEntity != entity) {
                    this.m_mouseOverEvt.phase = evtFlowPhase;
                    this.m_mouseOverEvt.type = MouseEvent_1.default.MOUSE_OVER;
                    this.m_mouseOverEvt.mouseX = this.m_mouseEvt.mouseX;
                    this.m_mouseOverEvt.mouseY = this.m_mouseEvt.mouseY;
                    this.m_mouseOverEvt.target = entity;
                    this.m_mouseOverEvt.currentTarget = entity;
                    this.m_mouseOverEvt.lpos.copyFrom(lpv);
                    this.m_mouseOverEvt.wpos.copyFrom(wpv);
                    this.m_raySelector.getRay(this.m_mouseOverEvt.raypv, this.m_mouseOverEvt.raytv);
                    flag += dispatcher.dispatchEvt(this.m_mouseOverEvt);
                  }

                  flag += dispatcher.dispatchEvt(this.m_mouseEvt);
                  this.m_evtEntity = entity;
                }
              }
            }
          }

          if (containerFlag) {
            if (preEvtEvent != null && preEvtEvent.__$getParent() == null) {
              this.m_evtEntity = preEvtEvent;
              flag += this.mouseOutEntity(evtFlowPhase, null, null, null);
              this.m_evtEntity = null;
            }

            for (let i = 0; i < this.m_evtTotal; i++) {
              this.m_mouseEvt.type = this.m_evtTypes[i];
              this.m_mouseEvt.mouseX = this.m_evtXList[i];
              this.m_mouseEvt.mouseY = this.m_evtYList[i];
              this.m_mouseEvt.wheelDeltaY = this.m_evtWheelDeltaYs[i];

              if (this.m_mouseEvt.type > 0) {
                if (node != null) {
                  this.m_mouseEvt.target = container;
                  this.m_mouseEvt.currentTarget = entity;
                  this.m_mouseEvt.phase = evtFlowPhase;
                  this.m_mouseEvt.lpos.copyFrom(lpv);
                  this.m_mouseEvt.wpos.copyFrom(wpv);
                  this.m_raySelector.getRay(this.m_mouseEvt.raypv, this.m_mouseEvt.raytv);
                  flag += this.mouseOutContainer(evtFlowPhase, container, lpv, wpv);

                  if (this.m_evtContainer != container) {
                    this.m_mouseOverEvt.phase = evtFlowPhase;
                    this.m_mouseOverEvt.type = MouseEvent_1.default.MOUSE_OVER;
                    this.m_mouseOverEvt.mouseX = this.m_mouseEvt.mouseX;
                    this.m_mouseOverEvt.mouseY = this.m_mouseEvt.mouseY;
                    this.m_mouseOverEvt.target = container;
                    this.m_mouseOverEvt.currentTarget = entity;
                    this.m_mouseOverEvt.lpos.copyFrom(lpv);
                    this.m_mouseOverEvt.wpos.copyFrom(wpv);
                    this.m_raySelector.getRay(this.m_mouseOverEvt.raypv, this.m_mouseOverEvt.raytv);
                    flag += container.dispatchEvt(this.m_mouseOverEvt);
                  }

                  flag += container.dispatchEvt(this.m_mouseEvt);
                  this.m_evtContainer = container;
                }
              }
            }
          }
        } else {
          this.mouseOutEntity(evtFlowPhase, null, null, null);
          this.mouseOutContainer(evtFlowPhase, null, null, null);
          this.m_evtEntity = null;
          this.m_evtContainer = null;
          flag += this.mouseOutEventTarget();

          if (this.m_currStage != null) {
            for (i = 0; i < this.m_evtTotal; i++) {
              switch (this.m_evtTypes[i]) {
                case MouseEvent_1.default.MOUSE_DOWN:
                  this.m_currStage.mouseBgDown();
                  break;

                case MouseEvent_1.default.MOUSE_UP:
                  this.m_currStage.mouseBgUp();
                  break;

                case MouseEvent_1.default.MOUSE_CLICK:
                  this.m_currStage.mouseBgClick();
                  break;

                default:
                  break;
              }
            }
          }
        }

        if (this.m_currStage != null) {
          MouseEvt3DController.s_unlockMouseEvt = false;

          for (i = 0; i < this.m_evtTotal; i++) {
            switch (this.m_evtTypes[i]) {
              case MouseEvent_1.default.MOUSE_DOWN:
                this.m_currStage.mouseDown(2);
                break;

              case MouseEvent_1.default.MOUSE_UP:
                this.m_currStage.mouseUp(2);
                break;

              default:
                break;
            }
          }

          MouseEvt3DController.s_unlockMouseEvt = true;
        }
      }

      if (flag == 0 && dispatcher != null) {
        //任何 在 evtFlowPhase 值所代表的阶段的事件能被接收，则表示这个事件应该无法穿透到下一个过程
        flag = dispatcher.passTestPhase(evtFlowPhase);
      }
    }

    return flag > 0 ? 1 : 0;
  }

  mouseOutEntity(evtFlowPhase, entity, lpv, wpv) {
    if (this.m_evtEntity != null && this.m_evtEntity != entity) {
      let dispatcher = this.m_evtEntity.getEvtDispatcher(MouseEvent_1.default.EventClassType);

      if (dispatcher != null) {
        this.m_mouseOutEvt.phase = evtFlowPhase;
        this.m_mouseOutEvt.type = MouseEvent_1.default.MOUSE_OUT;
        this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
        this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
        this.m_mouseOutEvt.target = this.m_evtEntity;
        this.m_mouseOverEvt.currentTarget = this.m_evtEntity;
        if (lpv != null) this.m_mouseOutEvt.lpos.copyFrom(lpv);
        if (wpv != null) this.m_mouseOutEvt.wpos.copyFrom(wpv);
        this.m_raySelector.getRay(this.m_mouseOutEvt.raypv, this.m_mouseOutEvt.raytv);
        return dispatcher.dispatchEvt(this.m_mouseOutEvt);
      }
    }

    return 0;
  }

  mouseOutContainer(evtFlowPhase, container, lpv, wpv) {
    if (this.m_evtContainer != null && this.m_evtContainer != container) {
      this.m_mouseOutEvt.phase = evtFlowPhase;
      this.m_mouseOutEvt.type = MouseEvent_1.default.MOUSE_OUT;
      this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
      this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
      this.m_mouseOutEvt.target = this.m_evtContainer;
      this.m_mouseOutEvt.currentTarget = null;
      if (lpv != null) this.m_mouseOutEvt.lpos.copyFrom(lpv);
      if (wpv != null) this.m_mouseOutEvt.wpos.copyFrom(wpv);
      this.m_raySelector.getRay(this.m_mouseOutEvt.raypv, this.m_mouseOutEvt.raytv); //console.log("mouse out 01."+this.m_evtEntity.name);

      return this.m_evtContainer.dispatchEvt(this.m_mouseOutEvt);
    }

    return 0;
  }

  runEnd() {
    this.m_evtTotal = 0;
    this.m_mouseEvt.type = 0;
  }

  reset() {
    this.m_evtTotal = 0;
  }

  getEvtType() {
    return this.m_mouseEvt.type;
  }

  isSelected() {
    return this.m_raySelector.getSelectedNode() != null;
  }

  lock() {
    this.m_unlockBoo = false;
  }

  unlock() {
    this.m_unlockBoo = true;
  }

  isUnlock() {
    return this.m_unlockBoo;
  }

}

MouseEvt3DController.s_unlockMouseEvt = true;
MouseEvt3DController.s_uid = 0;
exports.default = MouseEvt3DController;

/***/ }),

/***/ "7696":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// RenderProcess 实例实际上可以被外部功能块直接使用,以便实现具体渲染目的
// 只能在 RenderWorld 中创建

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const RenderSortBlock_1 = __importDefault(__webpack_require__("264c"));

const RPOBlock_1 = __importDefault(__webpack_require__("5f3c"));

class RenderProcess {
  constructor(shader, rpoNodeBuilder, rpoUnitBuilder, vtxResource, batchEnabled, processFixedState) {
    // 记录自身所在的 rendererInstance id
    this.m_rcuid = -1; // 记录自身所在 rendererInstance 中分配到的process index

    this.m_rpIndex = -1;
    this.m_nodesLen = 0;
    this.m_enabled = true;
    this.m_blockList = []; // 记录以相同shader的node为一个集合对象(RPOBlock) 的数组

    this.m_blockListLen = 0;
    this.m_blockFList = new Int8Array(RenderProcess.s_max_shdTotal); // 记录以相同shader的node为一个集合对象(RPOBlock)的构建状态 的数组

    this.m_blockFListLen = RenderProcess.s_max_shdTotal; // 假定引擎中同时存在的最多的shader 有1024种

    this.m_shader = null;
    this.m_rpoNodeBuilder = null;
    this.m_rpoUnitBuilder = null;
    this.m_vtxResource = null; // 用于制定对象的绘制

    this.m_fixBlock = null;
    this.m_sortBlock = null;
    this.m_sorter = null;
    this.m_batchEnabled = true;
    this.m_fixedState = true;
    this.m_sortEnabled = false;
    this.m_version = 0;
    this.uid = -1;
    this.m_shader = shader;
    this.m_rpoNodeBuilder = rpoNodeBuilder;
    this.m_rpoUnitBuilder = rpoUnitBuilder;
    this.m_vtxResource = vtxResource;
    this.m_fixBlock = this.createBlock();
    this.m_batchEnabled = batchEnabled;
    this.m_fixedState = processFixedState;

    for (let k = 0; k < this.m_blockFListLen; ++k) {
      this.m_blockFList[k] = -1;
    }
  }

  createBlock() {
    let block = new RPOBlock_1.default(this.m_shader);
    block.rpoNodeBuilder = this.m_rpoNodeBuilder;
    block.rpoUnitBuilder = this.m_rpoUnitBuilder;
    block.vtxResource = this.m_vtxResource;
    return block;
  }

  setRenderParam(batchEnabled, processFixedState) {
    if (this.m_blockListLen < 1) {
      this.m_batchEnabled = batchEnabled;
      this.m_fixedState = processFixedState;
    }
  }

  setRendererParam(rc, rpIndex) {
    this.m_rc = rc;
    this.m_rcuid = rc.getRCUid();
    this.m_rpIndex = rpIndex;
  }

  getUid() {
    return this.uid;
  }

  getRCUid() {
    return this.m_rcuid;
  }

  getRPIndex() {
    return this.m_rpIndex;
  }

  hasSorter() {
    return this.m_sorter != null;
  }

  setSorter(sorter) {
    this.m_sorter = sorter;

    if (this.m_sortBlock != null) {
      this.m_sortBlock.setSorter(sorter);
    }
  }

  setSortEnabled(sortEnabled) {
    if (this.m_nodesLen < 1) {
      this.m_sortEnabled = sortEnabled;
    } else if (this.m_sortBlock != null) {
      this.m_sortBlock.sortEnabled = sortEnabled;
    }
  }

  getSortEnabled() {
    return this.m_sortEnabled;
  }

  getUnitsTotal() {
    return this.m_nodesLen;
  }

  addNodeToBlock(node) {
    //  注意，这里可以管理组合方式, 例如可以做更多条件的排序
    //  这里依赖的是 shader program 和 vtx uid 来分类
    let block = null; //console.log("RenderProcess::addDisp(),uid: "+this.m_rpIndex+" node.shdUid: "+node.shdUid+", index: "+this.uid);

    if (node.shdUid >= RenderProcess.s_max_shdTotal) {
      throw Error("Shader uid >= " + RenderProcess.s_max_shdTotal);
    }

    if (this.m_blockFList[node.shdUid] < 0) {
      block = this.createBlock();
      block.batchEnabled = this.m_batchEnabled;
      block.fixedState = this.m_fixedState;

      if (block.batchEnabled) {
        if (block.fixedState) {
          block.runMode = 2;
        } else {
          block.runMode = 1;
        }
      } else {
        block.runMode = 0;
      }

      block.shdUid = node.shdUid;
      block.index = this.m_blockListLen;
      block.procuid = this.m_rpIndex;
      this.m_blockList.push(block);
      this.m_blockFList[node.shdUid] = this.m_blockListLen;
      ++this.m_blockListLen; //  console.log("RenderProcess::addDisp(), this.uid: ",this.getUid());
      //  console.log("RenderProcess::addDisp(), create a new RPOBlock instance, block: ",block);
      //  console.log("RenderProcess::addDisp(), create a new RPOBlock instance, this.m_blockList: ",this.m_blockList);
    } else {
      //console.log("RenderProcess::addDisp(), use old RPOBlock instance, m_blockFList["+node.shdUid+"]: "+this.m_blockFList[node.shdUid]);
      block = this.m_blockList[this.m_blockFList[node.shdUid]];
    }

    node.index = block.index;
    block.addNode(node);
  }

  rejoinRunitForTro(runit) {
    let node = this.m_rpoNodeBuilder.getNodeByUid(runit.__$rpuid);

    if (node != null) {
      node.tro = runit.tro;
      node.texMid = node.unit.texMid;
      this.m_blockList[node.index].rejoinNode(node);
    }
  }

  rejoinRunitForVro(runit) {
    let node = this.m_rpoNodeBuilder.getNodeByUid(runit.__$rpuid);

    if (node != null) {
      node.drawMode = runit.drawMode;
      node.ivsIndex = runit.ivsIndex;
      node.ivsCount = runit.ivsCount;
      node.insCount = runit.insCount;
      runit.drawOffset = runit.ivsIndex * runit.ibufStep;
      node.vtxUid = runit.vtxUid;
      node.vro = runit.vro;
      this.m_blockList[node.index].rejoinNode(node);
      this.m_version++;
    }
  }

  addDisp(disp) {
    if (disp != null) {
      if (disp.__$$runit != null && disp.__$$runit.getRPROUid() < 0) {
        if (disp.__$$runit.getRPROUid() != this.uid) {
          //console.log("RenderProcess("+this.uid+"), addDisp: ",disp.ivsCount,disp,disp.drawMode);
          let node = this.m_rpoNodeBuilder.create();
          node.unit = this.m_rpoUnitBuilder.getNodeByUid(disp.__$ruid);
          node.unit.shader = this.m_shader;
          node.unit.__$rprouid = this.uid;
          disp.__$rpuid = node.uid;
          node.__$ruid = disp.__$ruid;
          node.unit.__$rpuid = node.uid;
          node.updateData();
          ++this.m_nodesLen; //this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.m_rpIndex, node.uid);

          this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.getUid(), node.uid);

          if (this.m_sortEnabled) {
            console.log("sort process add a disp...");

            if (this.m_sortBlock != null) {
              this.m_sortBlock.addNode(node);
            } else {
              this.m_sortBlock = new RenderSortBlock_1.default(this.m_shader);
              this.m_sortBlock.setSorter(this.m_sorter);
              this.m_sortBlock.addNode(node);
            }
          } else {
            this.addNodeToBlock(node);
          }

          this.m_version++;
        } else {
          console.log("RenderProcess::addDisp(), Warn: add entity repeat in processid(" + this.m_rpIndex + ").");
        }
      }
    }
  }

  updateDispMateiral(disp) {
    if (disp.__$$runit != null) {
      let nodeUId = disp.__$$runit.getRPOUid();

      let node = this.m_rpoNodeBuilder.getNodeByUid(nodeUId); // material info etc.

      node.shdUid = node.unit.shdUid;
      node.texMid = node.unit.texMid;
      node.tro = node.unit.tro;
      let block = this.m_blockList[node.index];
      block.removeNode(node);
      this.addNodeToBlock(node);
    }
  }

  removeDisp(disp) {
    if (disp != null) {
      if (disp.__$$runit != null) {
        let nodeUId = disp.__$$runit.getRPOUid();

        let node = this.m_rpoNodeBuilder.getNodeByUid(nodeUId); //  console.log("removeDisp(), nodeUId: ",nodeUId, ", this.uid: ",this.getUid());
        //  console.log("removeDisp(), node != null: "+(node != null),", this.m_blockList: ",this.m_blockList);

        if (node != null) {
          if (this.m_sortBlock == null) {
            let block = this.m_blockList[node.index];
            block.removeNode(node);
          } else {
            this.m_sortBlock.removeNode(node);
          } // this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.m_rpIndex, -1);


          this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.getUid(), -1);
          --this.m_nodesLen;
          let runit = node.unit;

          if (this.m_rpoNodeBuilder.restore(node)) {
            this.m_rpoUnitBuilder.restore(runit);
          }

          this.m_vtxResource.__$detachRes(disp.vbuf.getUid());

          disp.__$$runit = null;
          disp.__$ruid = -1;
          this.m_version++;
        } else {
          console.error("There is no this display instance.");
        }
      }
    }
  }

  getStatus() {
    return this.m_version;
  }
  /**
   * remoev display unit from this render process
   */


  removeDispUnit(disp) {
    if (disp != null) {
      if (disp.__$ruid > -1) {
        let nodeUId = disp.__$$runit.getRPOUid();

        let node = this.m_rpoNodeBuilder.getNodeByUid(nodeUId);

        if (node != null) {
          if (this.m_sortBlock == null) {
            let block = this.m_blockList[node.index];
            block.removeNode(node);
          } else {
            this.m_sortBlock.removeNode(node);
          }

          this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.m_rpIndex, -1);
          node.unit.__$rprouid = -1;
          --this.m_nodesLen;
          this.m_rpoNodeBuilder.restore(node);
        }
      }
    }
  }

  update() {
    if (this.m_enabled && this.m_nodesLen > 0) {
      if (this.m_sortBlock != null) {
        this.m_sortBlock.update();
      }
    }
  }

  run() {
    if (this.m_enabled && this.m_nodesLen > 0) {
      let rc = this.m_rc;

      if (this.m_sortBlock == null) {
        if (this.m_shader.isUnLocked()) {
          for (let i = 0; i < this.m_blockListLen; ++i) {
            this.m_blockList[i].run(rc);
          }
        } else {
          for (let i = 0; i < this.m_blockListLen; ++i) {
            this.m_blockList[i].runLockMaterial(rc);
          }
        }
      } else {
        if (this.m_shader.isUnLocked()) {
          this.m_sortBlock.run(rc);
        } else {
          this.m_sortBlock.runLockMaterial(rc);
        }
      }
    }
  }

  drawDisp(disp, useGlobalUniform = false, forceUpdateUniform = true) {
    if (disp != null) {
      let unit = disp.__$$runit;

      if (unit != null) {
        if (this.m_shader.isUnLocked()) {
          if (forceUpdateUniform) {
            this.m_shader.resetUniform();
          }

          this.m_fixBlock.drawUnit(this.m_rc, unit, disp);
        } else {
          this.m_fixBlock.drawLockMaterialByUnit(this.m_rc, unit, disp, useGlobalUniform, forceUpdateUniform);
        }
      }
    }
  }
  /**
   * Deprecated(不推荐使用)
   */


  drawLockMaterialByDisp(disp, useGlobalUniform = false, forceUpdateUniform = true) {
    if (disp != null) {
      let unit = disp.__$$runit;

      if (unit != null) {
        this.m_fixBlock.drawLockMaterialByUnit(this.m_rc, unit, disp, useGlobalUniform, forceUpdateUniform);
      }
    }
  }

  reset() {
    this.m_sortEnabled = false;
    this.m_nodesLen = 0;
    this.uid = -1;
    this.m_rpIndex = -1;
    this.m_rcuid = -1;
    this.m_rpIndex = -1;
    let i = 0;

    for (; i < this.m_blockListLen; ++i) {
      this.m_blockList[i].reset();
    }

    this.m_blockListLen = 0;
    this.m_blockList = [];
    this.m_rpoNodeBuilder = null;
    this.m_rpoUnitBuilder = null;
    this.m_vtxResource = null;
    this.m_rc = null;

    if (this.m_sortBlock != null) {
      this.m_sortBlock.clear();
      this.m_sortBlock = null;
    }
  }

  showInfo() {
    let i = 0;

    for (; i < this.m_blockListLen; ++i) {
      this.m_blockList[i].showInfo();
    }
  }

  destroy() {
    this.reset();
  }

  setEnabled(boo) {
    this.m_enabled = boo;
  }

  getEnabled() {
    return this.m_enabled;
  }

  toString() {
    return "[RenderProcess(uid = " + this.m_rpIndex + ")]";
  }

}

RenderProcess.s_max_shdTotal = 1024;
exports.default = RenderProcess;

/***/ }),

/***/ "78e9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MaterialConst_1 = __importDefault(__webpack_require__("644c"));

class UniformLine {
  constructor() {
    this.type = -1;
    this.typeName = "";
    this.name = "";
    this.isArray = false;
    this.arrLength = 0;
    this.isTex = false;
    this.location = null;
  }

  parseCode(codeStr) {
    const SEMICOLON = ";";
    let i = codeStr.indexOf(SEMICOLON);

    if (i < 0) {
      return false;
    }

    const SPACE = " ";
    codeStr = codeStr.replace(/^\s*|\s*$/g, "");
    if (i > 0) codeStr = codeStr.slice(0, i);
    let arr = codeStr.split(SPACE);
    this.typeName = arr[arr.length - 2];
    this.name = arr[arr.length - 1];
    i = this.name.indexOf("[");
    this.isArray = i > 0;
    this.arrLength = 0;

    if (this.isArray) {
      this.arrLength = parseInt(this.name.slice(i + 1, this.name.indexOf("]", i + 1)));
      this.name = this.name.slice(0, i);
      this.typeName += "[]";
    }

    this.type = MaterialConst_1.default.GetTypeByTypeNS(this.typeName); //console.log("#### this.type: ",this.type,", this.typeName: ",this.typeName);

    if (this.type < 0) {
      return false;
    }

    this.isTex = this.type == MaterialConst_1.default.SHADER_SAMPLER2D || this.type == MaterialConst_1.default.SHADER_SAMPLERCUBE || this.type == MaterialConst_1.default.SHADER_SAMPLER3D;
    return true;
  }

}

exports.default = UniformLine;

/***/ }),

/***/ "7918":
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
var TextureProxyType;

(function (TextureProxyType) {
  TextureProxyType[TextureProxyType["Default"] = 0] = "Default";
  /**
   * for DepthTextureProxy class
   */

  TextureProxyType[TextureProxyType["Depth"] = 1] = "Depth";
  /**
   * for WrapperTextureProxy class
   */

  TextureProxyType[TextureProxyType["Wrapper"] = 2] = "Wrapper";
  /**
   * for RTTTextureProxy class
   */

  TextureProxyType[TextureProxyType["RTT"] = 3] = "RTT";
  /**
   * for ImageTextureProxy class
   */

  TextureProxyType[TextureProxyType["Image"] = 4] = "Image";
  /**
   * for FloatTextureProxy class
   */

  TextureProxyType[TextureProxyType["Float"] = 5] = "Float";
  /**
   * for Uint16TextureProxy class
   */

  TextureProxyType[TextureProxyType["Uint16"] = 6] = "Uint16";
  /**
   * for FloatCubeTextureProxy class
   */

  TextureProxyType[TextureProxyType["FloatCube"] = 7] = "FloatCube";
  /**
   * for BytesTextureProxy class
   */

  TextureProxyType[TextureProxyType["Bytes"] = 8] = "Bytes";
  /**
   * for BytesCubeTextureProxy class
   */

  TextureProxyType[TextureProxyType["BytesCube"] = 9] = "BytesCube";
  /**
   * for ImageCubeTextureProxy class
   */

  TextureProxyType[TextureProxyType["ImageCube"] = 10] = "ImageCube";
  /**
   * for Texture3DProxy class
   */

  TextureProxyType[TextureProxyType["Texture3D"] = 11] = "Texture3D";
})(TextureProxyType || (TextureProxyType = {}));

exports.TextureProxyType = TextureProxyType;

/***/ }),

/***/ "7b0e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererConst_1 = __importDefault(__webpack_require__("bbf4"));

class Entity3DNode {
  constructor() {
    this.uid = -1;
    this.rstatus = 0; //distanceFlag:boolean = false;
    // project occlusion culling test enabled

    this.pcoEnabled = false;
    this.drawEnabled = true;
    this.prev = null;
    this.next = null;
    this.entity = null;
    this.bounds = null;
    this.rayTestState = 0;
    this.rpoNode = null;
    this.spaceId = -1; // 记录上一次摄像机裁剪自身的状态

    this.camVisiSt = 0; // 记录摄像机可见状态,大于0表示不可见

    this.camVisi = RendererConst_1.default.CAMERA_VISIBLE_ENABLE;
  }

  reset() {
    this.rayTestState = 0;
    this.uid = -1;
    this.rstatus = 0;
    this.pcoEnabled = false;
    this.drawEnabled = true;
    this.prev = null;
    this.next = null;
    this.entity = null;
    this.bounds = null;
    this.rpoNode = null;
    this.spaceId = -1;
    this.camVisi = 0;
  } //private static m_camVisiList:number[] = [];


  static GetFreeId() {
    if (Entity3DNode.m_freeIdList.length > 0) {
      return Entity3DNode.m_freeIdList.pop();
    }

    return -1;
  }

  static GetByUid(uid) {
    if (uid > -1 && uid < Entity3DNode.m_nodeListLen) {
      return Entity3DNode.m_nodeList[uid];
    }

    return null;
  }

  static SetCamVisiByUid(uid, status) {
    Entity3DNode.m_nodeList[uid].camVisi = status;
  }

  static GetCamVisiByUid(uid) {
    return Entity3DNode.m_nodeList[uid].camVisi;
  }

  static Create() {
    let node = null;
    let index = Entity3DNode.GetFreeId();

    if (index >= 0) {
      node = Entity3DNode.m_nodeList[index];
      node.uid = index;
      Entity3DNode.m_nodeFlagList[index] = Entity3DNode.s_FLAG_BUSY;
    } else {
      // create a new nodeIndex
      node = new Entity3DNode();
      Entity3DNode.m_nodeList.push(node);
      Entity3DNode.m_nodeFlagList.push(Entity3DNode.s_FLAG_BUSY);
      node.uid = Entity3DNode.m_nodeListLen;
      Entity3DNode.m_nodeListLen++;
    }

    return node;
  }

  static Restore(pnode) {
    if (pnode != null && pnode.uid >= 0 && Entity3DNode.m_nodeFlagList[pnode.uid] == Entity3DNode.s_FLAG_BUSY) {
      Entity3DNode.m_freeIdList.push(pnode.uid);
      Entity3DNode.m_nodeFlagList[pnode.uid] = Entity3DNode.s_FLAG_FREE;
      pnode.reset();
    }
  }

}

Entity3DNode.s_FLAG_BUSY = 1;
Entity3DNode.s_FLAG_FREE = 0;
Entity3DNode.m_nodeListLen = 0;
Entity3DNode.m_nodeList = [];
Entity3DNode.m_nodeFlagList = [];
Entity3DNode.m_freeIdList = [];
exports.default = Entity3DNode;

/***/ }),

/***/ "7c63":
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

const RenderConst_1 = __webpack_require__("e08e");
/*
export class RenderColorMask {
    private static s_uid: number = 0;
    private static s_state: number = -1;
    private static s_states: RenderColorMask[] = [];
    private static s_statesLen: number = 1;
    private static s_stsMap: Map<number, RenderColorMask> = new Map();
    private static s_stsNameMap: Map<string, RenderColorMask> = new Map();
    private static s_unlocked: boolean = true;
    public static ALL_TRUE_COLOR_MASK: number = 0;
    public static ALL_FALSE_COLOR_MASK: number = 1;
    static Rstate: RODrawState = null;

    private m_uid: number = -1;
    private m_rBoo: boolean = true;
    private m_gBoo: boolean = true;
    private m_bBoo: boolean = true;
    private m_aBoo: boolean = true;
    //private m_state: number = 0;
    constructor(rBoo: boolean, gBoo: boolean, bBoo: boolean, aBoo: boolean) {
        this.m_uid = RenderColorMask.s_uid++;
        this.m_rBoo = rBoo;
        this.m_gBoo = gBoo;
        this.m_bBoo = bBoo;
        this.m_aBoo = aBoo;
    }
    getUid(): number {
        return this.m_uid;
    }
    getR(): boolean {
        return this.m_rBoo;
    }
    getG(): boolean {
        return this.m_gBoo;
    }
    getB(): boolean {
        return this.m_bBoo;
    }
    getA(): boolean {
        return this.m_aBoo;
    }
    use(): void {
        if (RenderColorMask.s_state != this.m_uid) {
            RenderColorMask.Rstate.setColorMask(this.m_rBoo, this.m_gBoo, this.m_bBoo, this.m_aBoo);
            RenderColorMask.s_state = this.m_uid;
        }
    }
    static Create(objName: string, rBoo: boolean, gBoo: boolean, bBoo: boolean, aBoo: boolean): number {
        if (RenderColorMask.s_stsNameMap.has(objName)) {
            let po: RenderColorMask = RenderColorMask.s_stsNameMap.get(objName);
            return po.getUid();
        }
        let key: number = (rBoo ? 1 << 6 : 1 << 5) | (gBoo ? 1 << 4 : 1 << 3) | (bBoo ? 1 << 2 : 1 << 1) | (aBoo ? 1 : 0);

        if (RenderColorMask.s_stsMap.has(key)) {
            let po: RenderColorMask = RenderColorMask.s_stsMap.get(key);
            key = po.getUid();
        }
        else {
            let po: RenderColorMask = new RenderColorMask(rBoo, gBoo, bBoo, aBoo);
            key = po.getUid();
            RenderColorMask.s_stsMap.set(key, po);
            RenderColorMask.s_stsNameMap.set(objName, po);
            RenderColorMask.s_states.push(po);
            ++RenderColorMask.s_statesLen;
        }
        return key;
    }

    static GetColorMaskByName(objName: string): number {
        if (RenderColorMask.s_stsNameMap.has(objName)) {
            let po = RenderColorMask.s_stsNameMap.get(objName);
            return po.getUid();
        }
        return -1;
    }
    // @param           state come from RODisp::renderState
    static UseRenderState(state: number): void {
        if (RenderColorMask.s_unlocked && RenderColorMask.Rstate.roColorMask != state) {
            if (state > -1 && state < RenderColorMask.s_statesLen) {
                RenderColorMask.s_states[state].use();
            }
        }
    }
    static UseColorMaskByName(stateName: string): void {
        let state = RenderColorMask.GetColorMaskByName(stateName);
        //trace("state: "+state+", stateName: "+stateName);
        if (RenderColorMask.s_unlocked && RenderColorMask.Rstate.roColorMask != state) {
            if (state > -1 && state < RenderColorMask.s_statesLen) {
                RenderColorMask.s_states[state].use();
            }
        }
    }
    static Lock(): void {
        RenderColorMask.s_unlocked = false;
    }
    static Unlock(): void {
        RenderColorMask.s_unlocked = true;
    }
    static Reset(): void {
        RenderColorMask.s_state = -1;
    }
}


export class RenderStateObject {
    private static s_uid: number = 0;
    private static s_state: number = -1;
    private static s_states: RenderStateObject[] = [];
    private static s_statesLen: number = 1;
    private static m_blendMode: number = -1;
    private static s_depthTestMode: number = -1;
    private static s_stsMap: Map<number, RenderStateObject> = new Map();
    private static s_stsNameMap: Map<string, RenderStateObject> = new Map();
    private static s_blendModeNameMap: Map<string, number> = new Map();
    private static s_blendModeIndexMap: Map<number, number> = new Map();
    private static s_blendModeIndex: number = 0;
    private static s_blendModes: number[][] = new Array(256);
    private static s_unlocked: boolean = true;
    static Rstate: RODrawState = null;
    private m_uid: number = -1;
    private m_cullFaceMode: number = 0;
    // blend mode
    private m_blendMode: number = 0;
    // depth test type mode
    private m_depthTestMode: number = 0;
    // shadow status Mode(receive | make | receive and make | none)
    private m_shadowMode: number = 0;

    constructor(cullFaceMode: number, blendMode: number, depthTestMode: number) {
        this.m_uid = RenderStateObject.s_uid++;
        this.m_cullFaceMode = cullFaceMode;
        this.m_blendMode = blendMode;
        this.m_depthTestMode = depthTestMode;
    }
    getUid(): number {
        return this.m_uid;
    }
    getCullFaceMode(): number {
        return this.m_cullFaceMode;
    }
    getDepthTestMode(): number {
        return this.m_depthTestMode;
    }
    getBlendMode(): number {
        return this.m_blendMode;
    }
    use(): void {
        
        if (RenderStateObject.s_state != this.m_uid) {

            //console.log("RenderStateObject this.m_uid: ",this.m_uid);
            
            RenderStateObject.Rstate.setCullFaceMode(this.m_cullFaceMode);
            //RenderStateObject.Rstate.setBlendMode(this.m_blendMode);
            let list: number[] = RenderStateObject.s_blendModes[RenderStateObject.m_blendMode];
            if (RenderStateObject.m_blendMode < 0) {
                RenderStateObject.Rstate.setBlendMode(this.m_blendMode, RenderStateObject.s_blendModes[this.m_blendMode]);
            }
            else {
                RenderStateObject.Rstate.setBlendMode(RenderStateObject.m_blendMode,RenderStateObject.s_blendModes[RenderStateObject.m_blendMode]);
            }
            if (RenderStateObject.s_depthTestMode < 0) {
                RenderStateObject.Rstate.setDepthTestMode(this.m_depthTestMode);
            }
            else {
                RenderStateObject.Rstate.setDepthTestMode(RenderStateObject.s_depthTestMode);
            }
            //
            RenderStateObject.s_state = this.m_uid;
        }
    }
    
    static CreateBlendModeSeparate(name:string, srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number, equationRGB: number = 0, equationAlpha: number = 0): number {
        if(name != null && name != "") {

            let b: number;
            if (RenderStateObject.s_blendModeNameMap.has(name)) {
                b = RenderStateObject.s_blendModeNameMap.get(name);
                return RenderStateObject.s_blendModeIndexMap.get(b);
            }
            if(equationRGB < 1) {
                equationRGB = GLBlendEquation.FUNC_ADD;
            }
            if(equationAlpha < 1) {
                equationAlpha = GLBlendEquation.FUNC_ADD;
            }
            let type: number = 1;
            b = 31;
            b = b * 131 + srcRGB;
            b = b * 131 + dstRGB;
            if(srcAlpha > 0 && dstAlpha > 0) {
                b = b * 131 + srcAlpha;
                b = b * 131 + dstAlpha;
                type = 1;
            }
            if (RenderStateObject.s_blendModeIndexMap.has(b)) {
                console.warn("This blendmode value already exists, its name is "+name+".");
                RenderStateObject.s_blendModeNameMap.set(name,b);
                return RenderStateObject.s_blendModeIndexMap.get(b);
            }
            let index: number = ++RenderStateObject.s_blendModeIndex;

            RenderStateObject.s_blendModeNameMap.set(name,b);
            RenderStateObject.s_blendModeIndexMap.set(b, index);
            let list:number[] = [type, equationRGB, equationAlpha, srcRGB, dstRGB, srcAlpha, dstAlpha];
            RenderStateObject.s_blendModes[index] = list;
            return index;
        }
        return 0;
    }
    
    static CreateBlendMode(name:string, srcColor: number, dstColor: number, blendEquation: number = 0): number {
        if(name != null && name != "") {

            let b: number;
            if (RenderStateObject.s_blendModeNameMap.has(name)) {
                b = RenderStateObject.s_blendModeNameMap.get(name);
                return RenderStateObject.s_blendModeIndexMap.get(b);
            }
            if(blendEquation < 1) {
                blendEquation = GLBlendEquation.FUNC_ADD;
            }
            let type: number = 0;
            b = 31;
            b = b * 131 + srcColor;
            b = b * 131 + dstColor;
            if (RenderStateObject.s_blendModeIndexMap.has(b)) {
                return RenderStateObject.s_blendModeIndexMap.get(b);
            }
            let index: number = ++RenderStateObject.s_blendModeIndex;

            RenderStateObject.s_blendModeNameMap.set(name,b);
            RenderStateObject.s_blendModeIndexMap.set(b, index);
            let list:number[] = [type, blendEquation, 0, srcColor, dstColor, 0, 0];
            //console.log("list: ",list);
            RenderStateObject.s_blendModes[index] = list;
            return index;
        }
        return 0;
    }
    static Create(objName: string, cullFaceMode: number, blendMode: number, depthTestMode: number): number {
        if (RenderStateObject.s_stsNameMap.has(objName)) {
            let po: RenderStateObject = RenderStateObject.s_stsNameMap.get(objName);
            return po.getUid();
        }
        //let key: number = depthTestMode << 8 | blendMode << 4 | cullFaceMode;
        let key: number = 31;
        key = key * 131 + depthTestMode;
        key = key * 131 + blendMode;
        key = key * 131 + cullFaceMode;
        if (RenderStateObject.s_stsMap.has(key)) {
            let po = RenderStateObject.s_stsMap.get(key);
            key = po.getUid();
        }
        else {
            let po: RenderStateObject = new RenderStateObject(cullFaceMode, blendMode, depthTestMode);
            key = po.getUid();
            RenderStateObject.s_stsMap.set(key, po);
            RenderStateObject.s_stsNameMap.set(objName, po);
            RenderStateObject.s_states.push(po);
            ++RenderStateObject.s_statesLen;
        }
        return key;
    }
    static GetRenderStateByName(objName: string): number {
        if (RenderStateObject.s_stsNameMap.has(objName)) {
            let po = RenderStateObject.s_stsNameMap.get(objName);
            return po.getUid();
        }
        return -1;
    }
    // @param           state come from RODisp::renderState
    static UseRenderState(state: number) {
        //if(RenderStateObject.s_unlocked && RenderStateObject.Rstate.roState != state)
        if (RenderStateObject.s_unlocked && RenderStateObject.s_state != state) {
            if (state > -1 && state < RenderStateObject.s_statesLen) {
                RenderStateObject.s_states[state].use();
            }
        }
    }
    static UseRenderStateByName(stateName: string): void {
        if (RenderStateObject.s_unlocked) {
            let state: number = RenderStateObject.GetRenderStateByName(stateName);
            //trace("state: "+state+", stateName: "+stateName);
            //if(RenderStateObject.Rstate.roState != state)
            if (RenderStateObject.s_state != state) {
                if (state > -1 && state < RenderStateObject.s_statesLen) {
                    RenderStateObject.s_states[state].use();
                }
            }
        }
    }
    private static s_preBlendMode: number = -1;
    private static s_preDepthTestMode: number = -1;
    static UnlockBlendMode(): void {
        RenderStateObject.m_blendMode = RenderStateObject.s_preBlendMode;
    }
    static LockBlendMode(blendMode: number): void {
        RenderStateObject.s_preBlendMode = RenderStateObject.m_blendMode;
        RenderStateObject.m_blendMode = blendMode;
    }
    static UnlockDepthTestMode(): void {
        RenderStateObject.s_depthTestMode = RenderStateObject.s_preDepthTestMode;
    }
    static LockDepthTestMode(depthTestMode: number): void {
        RenderStateObject.s_preDepthTestMode = RenderStateObject.s_depthTestMode;
        RenderStateObject.s_depthTestMode = depthTestMode;
    }
    static Lock(): void {
        RenderStateObject.s_unlocked = false;
    }
    static Unlock(): void {
        RenderStateObject.s_unlocked = true;
    }
    static Reset(): void {
        RenderStateObject.s_state = -1;
    }
}
//*/


class ROStateUnit {
  constructor() {
    this.stencilMask = -1;
  }

}

class RODrawState {
  constructor() {
    this.m_units = new Array(128);
    this.m_unit = null;
    this.m_blendMode = RenderConst_1.RenderBlendMode.NORMAL;
    this.m_cullMode = RenderConst_1.CullFaceMode.NONE;
    this.m_depthTestType = RenderConst_1.DepthTestMode.DISABLE;
    this.m_cullDisabled = true;
    this.m_context = null;
    this.m_gl = null;
    this.roColorMask = -11;
  }

  reset() {
    this.roColorMask = -11;
  }

  setRenderContext(context) {
    this.m_context = context;
    this.m_gl = context.getRC();
    let rcui = this.m_gl.rcuid;
    this.m_unit = this.m_units[rcui];

    if (this.m_unit == null) {
      this.m_unit = this.m_units[rcui] = new ROStateUnit();
    }
  }

  setColorMask(mr, mg, mb, ma) {
    this.m_gl.colorMask(mr, mg, mb, ma);
  }

  setStencilFunc(func, ref, mask) {
    this.m_gl.stencilFunc(func, ref, mask);
  }

  setStencilMask(mask) {
    if (this.m_unit.stencilMask != mask && mask >= 0) {
      this.m_unit.stencilMask = mask;
      this.m_gl.stencilMask(mask);
    }
  }

  setStencilOp(fail, zfail, zpass) {
    this.m_gl.stencilOp(fail, zfail, zpass);
  }

  setDepthTestEnable(enable) {
    if (enable) {
      this.m_gl.enable(this.m_gl.DEPTH_TEST);
    } else {
      this.m_gl.disable(this.m_gl.DEPTH_TEST);
    }
  }

  setCullFaceEnable(enable) {
    if (enable) {
      this.m_gl.enable(this.m_gl.CULL_FACE);
    } else {
      this.m_gl.disable(this.m_gl.CULL_FACE);
    }
  }

  setBlendEnable(enable) {
    if (enable) {
      this.m_gl.enable(this.m_gl.BLEND);
    } else {
      this.m_gl.disable(this.m_gl.BLEND);
    }
  }

  setCullFaceMode(mode) {
    if (this.m_cullMode != mode) {
      this.m_cullMode = mode;

      if (mode != RenderConst_1.CullFaceMode.NONE) {
        if (this.m_cullDisabled) {
          this.m_cullDisabled = false;
          this.m_gl.enable(this.m_gl.CULL_FACE);
        }

        this.m_gl.cullFace(mode);
      } else if (!this.m_cullDisabled) {
        this.m_cullDisabled = true;
        this.m_gl.disable(this.m_gl.CULL_FACE);
      }
    }
  }

  setBlendMode(mode, params) {
    if (this.m_blendMode != mode) {
      //console.log("this.m_blendMode: "+this.m_blendMode + ",mode: "+mode, params);
      this.m_blendMode = mode;

      if (mode > 0) {
        if (params[0] < 1) {
          //FUNC_ADD
          this.m_gl.blendEquation(this.m_gl.FUNC_ADD);
          this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.ZERO);
          this.m_gl.blendEquation(params[1]);
          this.m_gl.blendFunc(params[3], params[4]);
        } else {
          this.m_gl.blendEquationSeparate(params[1], params[2]);
          this.m_gl.blendFuncSeparate(params[3], params[4], params[5], params[6]);
        }
      } else {
        this.m_gl.disable(this.m_gl.BLEND);
      }
    }
  }

  setDepthTestMode(type) {
    if (this.m_depthTestType != type) {
      this.m_depthTestType = type; //trace("RendererBase::setDepthTest(),type：",std::to_string(static_cast<int>(type)));

      switch (type) {
        case RenderConst_1.DepthTestMode.ALWAYS:
          //console.log("ALWAYS type: ", type,this.m_gl.ALWAYS);
          this.m_gl.depthMask(false);
          this.m_gl.depthFunc(this.m_gl.ALWAYS);
          break;

        case RenderConst_1.DepthTestMode.SKY:
          this.m_gl.depthMask(true);
          this.m_gl.depthFunc(this.m_gl.LEQUAL);
          break;

        case RenderConst_1.DepthTestMode.OPAQUE:
          //console.log("OPAQUE type: ", type,this.m_gl.LESS);
          this.m_gl.depthMask(true);
          this.m_gl.depthFunc(this.m_gl.LESS);
          break;

        case RenderConst_1.DepthTestMode.OPAQUE_OVERHEAD:
          this.m_gl.depthMask(false);
          this.m_gl.depthFunc(this.m_gl.EQUAL);
          break;

        case RenderConst_1.DepthTestMode.DECALS:
          this.m_gl.depthMask(false);
          this.m_gl.depthFunc(this.m_gl.LEQUAL);
          break;

        case RenderConst_1.DepthTestMode.BLEND:
          this.m_gl.depthMask(false);
          this.m_gl.depthFunc(this.m_gl.LESS);
          break;

        case RenderConst_1.DepthTestMode.WIRE_FRAME:
          this.m_gl.depthMask(true);
          this.m_gl.depthFunc(this.m_gl.LEQUAL);
          break;

        case RenderConst_1.DepthTestMode.NEXT_LAYER:
          this.m_gl.depthMask(false);
          this.m_gl.depthFunc(this.m_gl.ALWAYS);
          break;

        case RenderConst_1.DepthTestMode.TRUE_EQUAL:
          this.m_gl.depthMask(true);
          this.m_gl.depthFunc(this.m_gl.EQUAL);
          break;

        case RenderConst_1.DepthTestMode.TRUE_GREATER:
          this.m_gl.depthMask(true);
          this.m_gl.depthFunc(this.m_gl.GREATER);
          break;

        case RenderConst_1.DepthTestMode.TRUE_GEQUAL:
          this.m_gl.depthMask(true);
          this.m_gl.depthFunc(this.m_gl.GEQUAL);
          break;

        case RenderConst_1.DepthTestMode.WIRE_FRAME_NEXT:
          break;

        default:
          break;
      }
    }
  }

}

exports.RODrawState = RODrawState;

/***/ }),

/***/ "8171":
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

class Stencil {
  constructor(rstate) {
    this.m_rstate = null;
    this.m_rstate = rstate;
  }

  setDepthTestEnable(enable) {
    this.m_rstate.setDepthTestEnable(enable);
  }
  /**
   * 设置 gpu stencilFunc 状态
   * @param func Specifies the test function. Eight symbolic constants are valid: GL_NEVER, GL_LESS, GL_LEQUAL, GL_GREATER, GL_GEQUAL, GL_EQUAL, GL_NOTEQUAL, and GL_ALWAYS. The initial value is GL_ALWAYS.
   * @param ref a GLint type number, value range: [0,2n−1];
   * @param mask GLint type number
   */


  setStencilFunc(func, ref, mask) {
    this.m_rstate.setStencilFunc(func, ref, mask);
  }
  /**
   * 设置 gpu stencilMask 状态
   * @param mask GLint type number
   */


  setStencilMask(mask) {
    this.m_rstate.setStencilMask(mask);
  }
  /**
   * 设置 gpu stencilOp 状态
   * @param fail Specifies the action to take when the stencil test fails. Eight symbolic constants are accepted: GL_KEEP, GL_ZERO, GL_REPLACE, GL_INCR, GL_INCR_WRAP, GL_DECR, GL_DECR_WRAP, and GL_INVERT. The initial value is GL_KEEP.
   * @param zfail Specifies the stencil action when the stencil test passes, but the depth test fails. dpfail accepts the same symbolic constants as sfail. The initial value is GL_KEEP.
   * @param zpass Specifies the stencil action when both the stencil test and the depth test pass, or when the stencil test passes and either there is no depth buffer or depth testing is not enabled. dppass accepts the same symbolic constants as sfail. The initial value is GL_KEEP.
   */


  setStencilOp(fail, zfail, zpass) {
    this.m_rstate.setStencilOp(fail, zfail, zpass);
  }

}

exports.Stencil = Stencil;

/***/ }),

/***/ "81ce":
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

class GLSLConverter {
  static Es2VtxShderToES3(glslStr) {
    let codeStr = glslStr; //attribute

    const ATTRIBUTE = "attribute"; //const POSY_OUTPUT = "out";
    //const POSY_INPUT = "in";

    const VARYING = "varying ";
    let i = codeStr.indexOf(ATTRIBUTE);
    let j = 0;

    while (i >= 0) {
      codeStr = codeStr.slice(0, i) + "layout(location=" + j + ") in" + codeStr.slice(i + 9);
      i = codeStr.indexOf(ATTRIBUTE);
      j++;
    }

    let regex = new RegExp(VARYING, "g");
    codeStr = codeStr.replace(regex, "out "); //i = codeStr.indexOf(ATTRIBUTE);

    return "#version 300 es\n" + codeStr;
  }

  static Es2FragShderToES3(glslStr) {
    let codeStr = glslStr; //attribute

    const GL1_OUTPUT = "gl_FragColor";
    const VARYING = "varying ";
    let i = codeStr.indexOf(GL1_OUTPUT);
    let j = 0;
    let outFragColor = "FragColorOut_" + j;
    if (i >= 0) codeStr = codeStr.slice(0, i) + outFragColor + codeStr.slice(i + 12);
    i = codeStr.indexOf("void ");
    codeStr = codeStr.slice(0, i) + "out vec4 " + outFragColor + ";\n" + codeStr.slice(i);
    let regex = new RegExp(VARYING, "g");
    codeStr = codeStr.replace(regex, "in ");
    regex = new RegExp(" texture2D", "g");
    codeStr = codeStr.replace(regex, " texture");
    regex = new RegExp(" textureCube", "g");
    codeStr = codeStr.replace(regex, " texture");
    return "#version 300 es\n" + codeStr;
  }

  static Es3VtxShaderToES2(codeStr) {
    const regExp0 = /^#.+(\bes|core\b)/;
    codeStr = codeStr.replace(regExp0, "");
    const regExp1 = /\blayout\b.+\bin\b/g;
    codeStr = codeStr.replace(regExp1, "attribute");
    const regExp2 = /\bout\b/g;
    codeStr = codeStr.replace(regExp2, "varying");
    const regExp3 = /\btexture\b/g;
    codeStr = codeStr.replace(regExp3, "texture2D");

    if (codeStr.indexOf("#version") >= 0) {
      codeStr = codeStr.replace("#version", "//#version");
    } //*


    let j = 0;
    let k = 0;
    let i = codeStr.indexOf("inverse(");

    if (i < 0) {
      i = codeStr.indexOf("inverse (");
    }

    let subStr = "";
    let invMat3Boo = false;
    let invMat4Boo = false;

    while (i > 3) {
      j = codeStr.indexOf(")", i + 2); //get var name

      subStr = codeStr.slice(i + 2, j);

      if (subStr.indexOf("mat3") > 0) {
        invMat3Boo = true;
      } else {
        // 去除空格,得到实际的变量名
        subStr = subStr.replace(/\s+/g, "");
        j = subStr.indexOf("(");
        subStr = subStr.slice(j + 1); // 查找第一次定义的地方

        j = codeStr.indexOf(subStr, 1); // 查找在这位置前面的最近的mat or vec字符                

        k = codeStr.lastIndexOf("mat", j);

        if (k > 0) {
          subStr = codeStr.slice(k, j);
          subStr = subStr.replace(/\s+/g, "");

          switch (subStr) {
            case "mat3":
              invMat3Boo = true;
              break;

            case "mat4":
              invMat4Boo = true;
              break;
          }
        }
      }

      i = codeStr.indexOf("inverse(", i + 5);

      if (i < 0) {
        i = codeStr.indexOf("inverse (", i + 5);
      }

      if (invMat3Boo && invMat4Boo) {
        break;
      }
    }

    j = 0;
    i = codeStr.indexOf("transpose(");

    if (i < 0) {
      i = codeStr.indexOf("transpose (");
    }

    subStr = "";
    let trsMat3Boo = false;
    let trsMat4Boo = false;

    while (i > 3) {
      j = codeStr.indexOf(")", i + 2);
      subStr = codeStr.slice(i + 2, j + 1);

      if (subStr.indexOf("mat3") > 0) {
        trsMat3Boo = true;
      } else {
        // 去除空格,得到实际的变量名
        subStr = subStr.replace(/\s+/g, "");
        j = subStr.indexOf("(");
        subStr = subStr.slice(j + 1); // 查找第一次定义的地方

        j = codeStr.indexOf(subStr, 1); // 查找在这位置前面的最近的mat or vec字符                

        k = codeStr.lastIndexOf("mat", j);

        if (k > 0) {
          subStr = codeStr.slice(k, j);
          subStr = subStr.replace(/\s+/g, ""); //trace("Var Name B: "+subStr);

          switch (subStr) {
            case "mat3":
              trsMat3Boo = true;
              break;

            case "mat4":
              trsMat4Boo = true;
              break;
          }
        }
      }

      i = codeStr.indexOf("transpose(", i + 5);

      if (i < 0) {
        i = codeStr.indexOf("transpose (", i + 5);
      }

      if (trsMat3Boo && trsMat4Boo) {
        //trsMat3Boo = trsMat4Boo = true;
        break;
      }
    }

    if (invMat3Boo || invMat4Boo) {
      i = codeStr.indexOf("void ");

      if (i > 10) {
        if (invMat3Boo && invMat4Boo) {
          codeStr = codeStr.slice(0, i) + GLSLConverter.__glslInverseMat3 + GLSLConverter.__glslInverseMat4 + codeStr.slice(i);
        } else if (invMat3Boo) {
          codeStr = codeStr.slice(0, i) + GLSLConverter.__glslInverseMat3 + codeStr.slice(i);
        } else if (invMat4Boo) {
          codeStr = codeStr.slice(0, i) + GLSLConverter.__glslInverseMat4 + codeStr.slice(i);
        }
      }
    }

    if (trsMat3Boo || trsMat4Boo) {
      i = codeStr.indexOf("void ");

      if (i > 10) {
        if (trsMat3Boo && trsMat4Boo) {
          codeStr = codeStr.slice(0, i) + GLSLConverter.__glslTransposeMat3 + GLSLConverter.__glslTransposeMat4 + codeStr.slice(i);
        } else if (trsMat3Boo) {
          codeStr = codeStr.slice(0, i) + GLSLConverter.__glslTransposeMat3 + codeStr.slice(i);
        } else if (trsMat4Boo) {
          codeStr = codeStr.slice(0, i) + GLSLConverter.__glslTransposeMat4 + codeStr.slice(i);
        }
      }
    }

    return codeStr;
  }

  static Es3FragShaderToES2(codeStr) {
    const regExp0 = /^#.+(\bes|core\b)/;
    codeStr = codeStr.replace(regExp0, ""); // 防止函数中的in 被替换
    //const regExpFuncIn:RegExp = /\b in \b/g;

    const regExpFuncIn = new RegExp(" in ", "g");
    codeStr = codeStr.replace(regExpFuncIn, "_fref_");
    const regExp1 = /\bin\b/g;
    codeStr = codeStr.replace(regExp1, "varying"); // 防止函数中的in 被替换

    const regExpToFuncIn = new RegExp("_fref_", "g");
    codeStr = codeStr.replace(regExpToFuncIn, " in "); //codeStr = codeStr.replace(regExp1, "varying");

    const regExp2 = /\btexture\b/g;
    codeStr = codeStr.replace(regExp2, "texture2D");
    const regExp3 = /" "/g;
    let shaderStr = codeStr; // 替换 frag (layout) out

    const semicolon = ";";
    const out_flag = "layout";
    let i = shaderStr.indexOf(out_flag);
    let j = 0;
    let t = 0;
    let subStr = "";
    let keyName = "";
    let keyIndex = 0;
    let tempReg = null;
    let keys = [];
    let indexList = [];

    while (i >= 0) {
      j = shaderStr.indexOf(semicolon, i + 1);
      subStr = shaderStr.slice(i + 1, j);
      keyName = subStr.slice(subStr.lastIndexOf(" ") + 1);
      keyIndex = subStr.indexOf(")");
      i = subStr.lastIndexOf("=", keyIndex) + 1;
      subStr = subStr.slice(i + 1, keyIndex);
      keyIndex = parseInt(subStr.replace(regExp3, ""));
      keys.push(keyName);
      indexList.push(keyIndex);
      i = shaderStr.indexOf(out_flag, j);
    }

    let len = keys.length;

    if (len > 0) {
      tempReg = /layout/g;
      codeStr = codeStr.replace(tempReg, "//layout");

      if (len > 1) {
        i = 0;

        while (i < len) {
          tempReg = new RegExp(keys[i], "g");
          codeStr = codeStr.replace(tempReg, "gl_FragData[" + indexList[i] + "]");
          ++i;
        }
      } else {
        tempReg = new RegExp(keyName, "g");
        codeStr = codeStr.replace(tempReg, "gl_FragColor");
      }
    } else {
      i = shaderStr.indexOf("out ");

      if (i > 0) {
        j = shaderStr.indexOf(semicolon, i + 1);
        subStr = shaderStr.slice(i + 1, j);
        keyName = subStr.slice(subStr.lastIndexOf(" ") + 1);
        tempReg = new RegExp(keyName, "g");
        codeStr = codeStr.replace(tempReg, "gl_FragColor");
        tempReg = /\bout\b/g;
        codeStr = codeStr.replace(tempReg, "//out");
      }
    }

    if (len > 1) {
      codeStr = "#extension GL_EXT_draw_buffers: require\n" + codeStr;
    }

    if (codeStr.indexOf("#version") >= 0) {
      codeStr = codeStr.replace("#version", "//#version");
    } // correct samplerCube sampler


    i = 0; ///*

    for (let k = 0; k < 16; ++k) {
      i = codeStr.indexOf("samplerCube ", i);

      if (i > 0) {
        j = codeStr.indexOf(";", i);
        subStr = shaderStr.slice(i + 12, j);
        keyName = "";
        let arr = subStr.split(" ");

        for (let t = 0; t < 16; ++t) {
          if (arr[t] != "") {
            // find samplerCube uniform name
            keyName = arr[t];
            break;
          }
        }

        for (len = 0; len < 16; ++len) {
          j = codeStr.indexOf(keyName, j + 1);

          if (j > 0) {
            t = codeStr.lastIndexOf("texture2D", j - 1);

            if (t < 0) {
              break;
            }

            subStr = codeStr.slice(t, j);
            codeStr = codeStr.slice(0, t) + "textureCube(" + codeStr.slice(j);
          } else {
            break;
          }

          j += 2;
        }
      } else {
        break;
      }

      i += 4;
    } //*/


    return codeStr;
  }

}

GLSLConverter.__glslTransposeMat3 = `
    mat3 transpose(mat3 m) {
        return mat3(m[0][0],m[1][0],m[2][0],
            m[0][1],m[1][1],m[2][1],
            m[0][2],m[1][2],m[2][2]);
    }
    `;
GLSLConverter.__glslTransposeMat4 = `
    mat4 transpose(mat4 m) {
        return mat4(m[0][0],m[1][0],m[2][0],m[3][0],
            m[0][1],m[1][1],m[2][1],m[3][1],
            m[0][2],m[1][2],m[2][2],m[3][2],
            m[0][3],m[1][3],m[2][3],m[3][3]);
    }
    `;
GLSLConverter.__glslInverseMat3 = `
    mat3 inverse(mat3 m) {
        float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
        float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
        float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];  
        float b01 = a22 * a11 - a12 * a21;
        float b11 = -a22 * a10 + a12 * a20;
        float b21 = a21 * a10 - a11 * a20;  
        float det = a00 * b01 + a01 * b11 + a02 * b21;  
        return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
                    b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
                    b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
    }
    `;
GLSLConverter.__glslInverseMat4 = `
    mat4 inverse(mat4 m) {
        float
            a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
            a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
            a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
            a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        return mat4(
            a11 * b11 - a12 * b10 + a13 * b09,
            a02 * b10 - a01 * b11 - a03 * b09,
            a31 * b05 - a32 * b04 + a33 * b03,
            a22 * b04 - a21 * b05 - a23 * b03,
            a12 * b08 - a10 * b11 - a13 * b07,
            a00 * b11 - a02 * b08 + a03 * b07,
            a32 * b02 - a30 * b05 - a33 * b01,
            a20 * b05 - a22 * b02 + a23 * b01,
            a10 * b10 - a11 * b08 + a13 * b06,
            a01 * b08 - a00 * b10 - a03 * b06,
            a30 * b04 - a31 * b02 + a33 * b00,
            a21 * b02 - a20 * b04 - a23 * b00,
            a11 * b07 - a10 * b09 - a12 * b06,
            a00 * b09 - a01 * b07 + a02 * b06,
            a31 * b01 - a30 * b03 - a32 * b00,
            a20 * b03 - a21 * b01 + a22 * b00) / det;
        }
    `;
exports.default = GLSLConverter;

/***/ }),

/***/ "8333":
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

class RenderMaskBitfield {}

RenderMaskBitfield.COLOR_BUFFER_BIT = 131;
RenderMaskBitfield.DEPTH_BUFFER_BIT = 132;
RenderMaskBitfield.STENCIL_BUFFER_BIT = 133;
exports.default = RenderMaskBitfield;

/***/ }),

/***/ "839a":
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
var SpecularMode;

(function (SpecularMode) {
  /**
   * 使用设置的纯色 rgb 作为镜面光的颜色系数
   */
  SpecularMode[SpecularMode["Default"] = 1] = "Default";
  /**
   * 使用 之前计算出来的 片段 color rgb 作为镜面光的颜色系数
   */

  SpecularMode[SpecularMode["FragColor"] = 2] = "FragColor";
  /**
   * 使用 SpecularMap color rgb 作为镜面光的颜色系数
   */

  SpecularMode[SpecularMode["SpecularMapColor"] = 3] = "SpecularMapColor";
})(SpecularMode || (SpecularMode = {}));

exports.SpecularMode = SpecularMode;

/***/ }),

/***/ "83d1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const UniformConst_1 = __importDefault(__webpack_require__("ab73"));

class StageParamUniformBuilder {
  create(rc, shdp) {
    let param = UniformConst_1.default.StageParam;
    if (shdp.hasUniformByName(param.name)) return rc.uniformContext.createShaderGlobalUniformFromProbe(rc.getStage3D().uProbe, param.name, [param.name]);
    return null;
  }

  getIDNS() {
    return "StageParamUniformBuilder";
  }

}

exports.default = StageParamUniformBuilder;

/***/ }),

/***/ "857b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const UniformConst_1 = __importDefault(__webpack_require__("ab73"));

class CameraPosUniformBuilder {
  create(rc, shdp) {
    let param = UniformConst_1.default.CameraPosParam;
    if (shdp.hasUniformByName(param.name)) return rc.uniformContext.createShaderGlobalUniformFromProbe(rc.getCamera().ucameraPosProbe, param.name, [param.name]);
    return null;
  }

  getIDNS() {
    return "CameraPosUniformBuilder";
  }

}

exports.default = CameraPosUniformBuilder;

/***/ }),

/***/ "85b6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureProxy_1 = __importDefault(__webpack_require__("0851"));

class WrapperTextureProxy extends TextureProxy_1.default {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.m_tex = null;
    this.m_type = TextureProxyType_1.TextureProxyType.Wrapper;
  }
  /**
   * @returns 返回自己的 纹理资源 unique id, 这个id会被对应的资源管理器使用, 此方法子类不可以覆盖
   */


  getResUid() {
    return this.m_tex.getResUid();
  } // gpu texture buf size


  getBufWidth() {
    return this.m_tex.getBufWidth();
  }

  getBufHeight() {
    return this.m_tex.getBufHeight();
  } // logic texture size


  getWidth() {
    return this.m_tex.getWidth();
  }

  getHeight() {
    return this.m_tex.getHeight();
  }
  /**
   * @returns 返回true, 表示当前纹理对象是渲染直接使用其对应的显存资源的对象
   *          返回false, 表示不能直接使用对应的显存资源
   */


  isDirect() {
    return false;
  }

  getAttachTex() {
    return this.m_tex;
  }

  attachTex(tex) {
    if (this.m_tex != tex) {
      if (this.m_tex != null) {
        this.m_tex.__$detachThis();
      }

      if (tex != null) {
        tex.__$attachThis();
      }

      this.m_tex = tex;
    }
  }

  detachTex() {
    if (this.m_tex != null) {
      this.m_tex.__$detachThis();
    }

    this.m_tex = null;
  }
  /**
   * 被引用计数加一
   */


  __$attachThis() {
    super.__$attachThis();

    if (this.m_tex != null) {
      this.m_tex.__$attachThis();
    }
  }
  /**
   * 被引用计数减一
   */


  __$detachThis() {
    super.__$detachThis();

    if (this.m_tex != null) {
      this.m_tex.__$detachThis();
    }
  }
  /**
   * This function only be be called by the renderer inner system.
   */


  __$$use(resTex) {
    this.m_tex.__$$use(resTex);
  }
  /**
   * @returns the texture gpu resource is enabled or not.
   */


  isGpuEnabled() {
    return this.m_tex.isGpuEnabled();
  }
  /**
   * @returns The fragment processor texture sampler type.
   */


  getSampler() {
    return this.m_tex.getSampler();
  }

  __$updateToGpu(texRes) {
    this.m_tex.__$updateToGpu(texRes);
  }
  /**
   * This function only be be called by the renderer inner system.
   * if sub class override this function, it must does call this function.
   */


  __$$upload(texRes) {
    this.m_tex.__$$upload(texRes);
  }

  __$destroy() {
    if (this.getAttachCount() < 1) {
      if (this.m_tex != null) {
        this.m_tex.__$detachThis();
      }

      this.m_tex = null;

      super.__$destroy();
    }
  }
  /**
   * @returns the texture data is enough or not.
   */


  isDataEnough() {
    return this.m_tex.isDataEnough();
  }
  /**
   * @returns return value is TextureConst.TEXTURE_2D or TextureConst.TEXTURE_CUBE or TextureConst.TEXTURE_3D
   */


  getTargetType() {
    return this.m_tex.getTargetType();
  }

}

exports.default = WrapperTextureProxy;

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

/***/ "8a0a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const BitConst_1 = __importDefault(__webpack_require__("ca6c"));

class VtxBufConst {
  //
  static ToGL(gl, param) {
    switch (param) {
      case VtxBufConst.VTX_STATIC_DRAW:
        return gl.STATIC_DRAW;
        break;

      case VtxBufConst.VTX_DYNAMIC_DRAW:
        return gl.DYNAMIC_DRAW;
        break;

      case VtxBufConst.VTX_STREAM_DRAW:
        return gl.STREAM_DRAW;
        break;

      case VtxBufConst.VTX_STATIC_READ:
        return gl.STATIC_READ;
        break;

      case VtxBufConst.VTX_DYNAMIC_READ:
        return gl.DYNAMIC_READ;
        break;

      case VtxBufConst.VTX_STREAM_READ:
        return gl.STREAM_READ;
        break;

      case VtxBufConst.VTX_STATIC_COPY:
        return gl.STATIC_COPY;
        break;

      case VtxBufConst.VTX_DYNAMIC_COPY:
        return gl.DYNAMIC_COPY;
        break;

      case VtxBufConst.VTX_STREAM_COPY:
        return gl.STREAM_COPY;
        break;

      default:
        break;
    }

    return gl.STATIC_DRAW;
  }

  static GetVBufTypeByNS(pns) {
    switch (pns) {
      case VtxBufConst.VBUF_VS_NS:
        return VtxBufConst.VBUF_VS;
        break;

      case VtxBufConst.VBUF_UVS_NS:
        return VtxBufConst.VBUF_UVS;
        break;

      case VtxBufConst.VBUF_NVS_NS:
        return VtxBufConst.VBUF_NVS;
        break;

      case VtxBufConst.VBUF_CVS_NS:
        return VtxBufConst.VBUF_CVS;
        break;
      ///////////////////

      case VtxBufConst.VBUF_VS2_NS:
        return VtxBufConst.VBUF_VS2;
        break;

      case VtxBufConst.VBUF_UVS2_NS:
        return VtxBufConst.VBUF_UVS2;
        break;

      case VtxBufConst.VBUF_NVS2_NS:
        return VtxBufConst.VBUF_NVS2;
        break;

      case VtxBufConst.VBUF_CVS2_NS:
        return VtxBufConst.VBUF_CVS2;
        break;

      case VtxBufConst.VBUF_TVS_NS:
        return VtxBufConst.VBUF_TVS;
        break;

      case VtxBufConst.VBUF_TVS2_NS:
        return VtxBufConst.VBUF_TVS2;
        break;

      default:
    }

    return -1;
  }

  static GetVBufNSByType(type) {
    switch (type) {
      case VtxBufConst.VBUF_VS:
        return VtxBufConst.VBUF_VS_NS;
        break;

      case VtxBufConst.VBUF_UVS:
        return VtxBufConst.VBUF_UVS_NS;
        break;

      case VtxBufConst.VBUF_NVS:
        return VtxBufConst.VBUF_NVS_NS;
        break;

      case VtxBufConst.VBUF_CVS:
        return VtxBufConst.VBUF_CVS_NS;
        break;
      ///////////////////

      case VtxBufConst.VBUF_VS2:
        return VtxBufConst.VBUF_VS2_NS;
        break;

      case VtxBufConst.VBUF_UVS2:
        return VtxBufConst.VBUF_UVS2_NS;
        break;

      case VtxBufConst.VBUF_NVS2:
        return VtxBufConst.VBUF_NVS2_NS;
        break;

      case VtxBufConst.VBUF_CVS2:
        return VtxBufConst.VBUF_CVS2_NS;
        break;

      case VtxBufConst.VBUF_TVS:
        return VtxBufConst.VBUF_TVS_NS;
        break;

      case VtxBufConst.VBUF_TVS2:
        return VtxBufConst.VBUF_TVS2_NS;
        break;

      default:
    }

    return "";
  }

  static GetVBufAttributeTypeByNS(pns) {
    return VtxBufConst.GetVBufTypeByNS(pns) - 3000;
  }

  static GetVBufAttributeTypeByVBufType(vbufType) {
    return vbufType - 3000;
  }

}

VtxBufConst.VTXTYPE_GL_POINTS = 101;
VtxBufConst.VTXTYPE_GL_LINES = 102;
VtxBufConst.VTXTYPE_GL_LINE_STRIP = 103;
VtxBufConst.VTXTYPE_GL_TRIANGLES = 111;
VtxBufConst.VTX_STATIC_DRAW = 0;
VtxBufConst.VTX_DYNAMIC_DRAW = 1;
VtxBufConst.VTX_STREAM_DRAW = 2;
VtxBufConst.VTX_STATIC_READ = 3;
VtxBufConst.VTX_DYNAMIC_READ = 4;
VtxBufConst.VTX_STREAM_READ = 5;
VtxBufConst.VTX_STATIC_COPY = 6;
VtxBufConst.VTX_DYNAMIC_COPY = 7;
VtxBufConst.VTX_STREAM_COPY = 8;
VtxBufConst.VBUF_VS = 3001;
VtxBufConst.VBUF_UVS = 3002;
VtxBufConst.VBUF_NVS = 3003;
VtxBufConst.VBUF_CVS = 3004;
VtxBufConst.VBUF_TVS = 3005;
VtxBufConst.VBUF_VS2 = 3006;
VtxBufConst.VBUF_UVS2 = 3007;
VtxBufConst.VBUF_NVS2 = 3008;
VtxBufConst.VBUF_CVS2 = 3009;
VtxBufConst.VBUF_TVS2 = 3010;
VtxBufConst.VBUF_VS_INDEX = BitConst_1.default.BIT_ONE_0;
VtxBufConst.VBUF_UVS_INDEX = BitConst_1.default.BIT_ONE_1;
VtxBufConst.VBUF_NVS_INDEX = BitConst_1.default.BIT_ONE_2;
VtxBufConst.VBUF_CVS_INDEX = BitConst_1.default.BIT_ONE_3;
VtxBufConst.VBUF_TVS_INDEX = BitConst_1.default.BIT_ONE_4;
VtxBufConst.VBUF_VS2_INDEX = BitConst_1.default.BIT_ONE_5;
VtxBufConst.VBUF_UVS2_INDEX = BitConst_1.default.BIT_ONE_6;
VtxBufConst.VBUF_NVS2_INDEX = BitConst_1.default.BIT_ONE_7;
VtxBufConst.VBUF_CVS2_INDEX = BitConst_1.default.BIT_ONE_8;
VtxBufConst.VBUF_TVS2_INDEX = BitConst_1.default.BIT_ONE_9; // name

VtxBufConst.VBUF_VS_NS = "a_vs";
VtxBufConst.VBUF_VS2_NS = "a_vs2";
VtxBufConst.VBUF_UVS_NS = "a_uvs";
VtxBufConst.VBUF_UVS2_NS = "a_uvs2";
VtxBufConst.VBUF_NVS_NS = "a_nvs";
VtxBufConst.VBUF_NVS2_NS = "a_nvs2";
VtxBufConst.VBUF_CVS_NS = "a_cvs";
VtxBufConst.VBUF_CVS2_NS = "a_cvs2";
VtxBufConst.VBUF_TVS_NS = "a_tvs";
VtxBufConst.VBUF_TVS2_NS = "a_tvs2";

class VtxNormalType {}

VtxNormalType.FLAT = 210;
VtxNormalType.GOURAND = 310;
exports.VtxNormalType = VtxNormalType;
exports.default = VtxBufConst;

/***/ }),

/***/ "8ae4":
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

class ROIndicesRes {
  constructor() {
    this.m_uid = 0;
    this.m_vtx = null;
    this.m_vtxUid = 0;
    this.m_gpuBuf = null;
    this.m_ivsSize = 0;
    this.ibufStep = 0;
    this.m_uid = ROIndicesRes.s_uid + 1;
  }

  getUid() {
    return this.m_uid;
  }

  getVtxUid() {
    return this.m_vtxUid;
  }

  getGpuBuf() {
    return this.m_gpuBuf;
  }

  getVTCount() {
    return this.m_ivsSize;
  }

  updateToGpu(rc) {
    if (this.m_gpuBuf != null && this.m_ivsSize > 0) {
      let vtx = this.m_vtx; // console.log("indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", this.version != vtx.indicesVer: ", this.version != vtx.indicesVer);

      if (this.version != vtx.indicesVer) {
        this.m_ivs = vtx.getIvsData();
        rc.bindEleBuf(this.m_gpuBuf);

        if (this.m_ivsSize >= this.m_ivs.length) {
          //console.log("A indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", ivs.length", this.m_ivs.length);
          rc.eleBufSubData(this.m_ivs, vtx.getBufDataUsage());
        } else {
          //console.log("B indeces updateToGpu vtx.getUId(): ",vtx.getUid(), ", ivs.length", this.m_ivs.length);
          rc.eleBufData(this.m_ivs, vtx.getBufDataUsage());
        }

        this.m_ivsSize = this.m_ivs.length;
        this.version = vtx.indicesVer;
      }
    }
  }

  initialize(rc, vtx) {
    if (this.m_gpuBuf == null && vtx.getIvsData() != null) {
      this.version = vtx.indicesVer;
      this.m_vtx = vtx;
      this.m_vtxUid = vtx.getUid();
      this.m_ivs = vtx.getIvsData();
      this.m_gpuBuf = rc.createBuf();
      rc.bindEleBuf(this.m_gpuBuf);

      if (vtx.bufData == null) {
        rc.eleBufData(this.m_ivs, vtx.getBufDataUsage());
        this.m_ivsSize = this.m_ivs.length;
      } else {
        rc.eleBufDataMem(vtx.bufData.getIndexDataTotalBytes(), vtx.getBufDataUsage());
        let uintArr = null;
        let offset = 0;
        this.m_ivsSize = 0;

        for (let i = 0, len = vtx.bufData.getIndexDataTotal(); i < len; ++i) {
          uintArr = vtx.bufData.getIndexDataAt(i);
          rc.eleBufSubData(uintArr, offset);
          offset += uintArr.byteLength;
          this.m_ivsSize += uintArr.length;
        }
      }
    }
  }

  destroy(rc) {
    if (this.m_gpuBuf != null) {
      this.m_vtx = null;
      rc.deleteBuf(this.m_gpuBuf);
      this.m_gpuBuf = null;
      this.m_ivs = null;
      this.m_ivsSize = 0;
    }
  }

}

ROIndicesRes.s_uid = 0;
exports.ROIndicesRes = ROIndicesRes;

/***/ }),

/***/ "8d98":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const RCExtension_1 = __importDefault(__webpack_require__("030e"));

class TextureFormat {
  static ToGL(gl, format) {
    switch (format) {
      case TextureFormat.RGBA:
        break;

      case TextureFormat.R8:
        return gl.R8;
        break;

      case TextureFormat.RGB:
        return gl.RGB;
        break;

      case TextureFormat.RGB8:
        return gl.RGB8;
        break;

      case TextureFormat.RGBA8:
        return gl.RGBA8;
        break;

      case TextureFormat.ALPHA:
        return gl.ALPHA;
        break;

      case TextureFormat.RGB16F:
        if (RendererDevice_1.default.IsWebGL2()) {
          return gl.RGB16F;
        }

        return gl.RGB;
        break;

      case TextureFormat.RGBA16F:
        if (RendererDevice_1.default.IsWebGL2()) {
          return gl.RGBA16F;
        }

        return gl.RGBA;
        break;

      case TextureFormat.RGB32F:
        if (RendererDevice_1.default.IsWebGL2()) gl.RGB32F;
        return gl.RGB;
        break;

      case TextureFormat.RGBA32F:
        if (RendererDevice_1.default.IsWebGL2()) gl.RGBA32F;
        return gl.RGBA;
        break;

      case TextureFormat.RED:
        return gl.RED;
        break;

      case TextureFormat.DEPTH_COMPONENT:
        return gl.DEPTH_COMPONENT;
        break;

      case TextureFormat.DEPTH_STENCIL:
        return gl.DEPTH_STENCIL;
        break;

      default:
        break;
    }

    return gl.RGBA;
  }

}

TextureFormat.R8 = 101;
TextureFormat.RGB = 110;
TextureFormat.RED = 111;
TextureFormat.RGBA = 121;
TextureFormat.RGB8 = 122;
TextureFormat.RGBA8 = 123;
TextureFormat.ALPHA = 132;
TextureFormat.RGB16F = 331;
TextureFormat.RGBA16F = 332;
TextureFormat.RGB32F = 341;
TextureFormat.RGBA32F = 342;
TextureFormat.DEPTH_COMPONENT = 351;
TextureFormat.DEPTH_STENCIL = 352;
exports.TextureFormat = TextureFormat;

class TextureDataType {
  static ToGL(gl, type) {
    switch (type) {
      case TextureDataType.UNSIGNED_BYTE:
        return gl.UNSIGNED_BYTE;
        break;

      case TextureDataType.BYTE:
        return gl.BYTE;
        break;

      case TextureDataType.FLOAT:
        return gl.FLOAT;
        break;

      case TextureDataType.HALF_FLOAT:
        return gl.HALF_FLOAT;
        break;

      case TextureDataType.HALF_FLOAT_OES:
        if (RCExtension_1.default.OES_texture_half_float != null) return RCExtension_1.default.OES_texture_half_float.HALF_FLOAT_OES;
        return gl.FLOAT;
        break;

      case TextureDataType.UNSIGNED_SHORT:
        return gl.UNSIGNED_SHORT;
        break;

      case TextureDataType.UNSIGNED_INT:
        return gl.UNSIGNED_INT;
        break;

      case TextureDataType.UNSIGNED_SHORT_5_6_5:
        return gl.UNSIGNED_SHORT_5_6_5;
        break;

      case TextureDataType.UNSIGNED_SHORT_4_4_4_4:
        return gl.UNSIGNED_SHORT_4_4_4_4;
        break;

      case TextureDataType.UNSIGNED_SHORT_5_5_5_1:
        return gl.UNSIGNED_SHORT_5_5_5_1;
        break;

      case TextureDataType.UNSIGNED_INT_24_8_WEBGL:
        return RCExtension_1.default.WEBGL_depth_texture.UNSIGNED_INT_24_8_WEBGL;
        break;

      default:
        break;
    }

    return gl.UNSIGNED_BYTE;
  }

}

TextureDataType.UNSIGNED_BYTE = 1108;
TextureDataType.UNSIGNED_SHORT = 1109;
TextureDataType.UNSIGNED_INT = 1110;
TextureDataType.BYTE = 1111;
TextureDataType.FLOAT = 1211;
TextureDataType.HALF_FLOAT = 1212;
TextureDataType.HALF_FLOAT_OES = 1213;
TextureDataType.UNSIGNED_SHORT_5_6_5 = 1214;
TextureDataType.UNSIGNED_SHORT_4_4_4_4 = 1215;
TextureDataType.UNSIGNED_SHORT_5_5_5_1 = 1216;
TextureDataType.UNSIGNED_INT_24_8_WEBGL = 1217;
exports.TextureDataType = TextureDataType;

class TextureTarget {
  static GetValue(rc, param) {
    switch (param) {
      case TextureTarget.TEXTURE_2D:
        return rc.TEXTURE_2D;
        break;

      case TextureTarget.TEXTURE_2D_ARRAY:
        return rc.TEXTURE_2D_ARRAY;
        break;

      case TextureTarget.TEXTURE_CUBE:
        return rc.TEXTURE_CUBE_MAP;
        break;

      case TextureTarget.TEXTURE_3D:
        return rc.TEXTURE_3D;
        break;

      default:
        break;
    }

    return rc.TEXTURE_2D;
  }

}

TextureTarget.TEXTURE_2D = 20;
TextureTarget.TEXTURE_2D_ARRAY = 22;
TextureTarget.TEXTURE_SHADOW_2D = 23;
TextureTarget.TEXTURE_CUBE = 25;
TextureTarget.TEXTURE_3D = 30;
exports.TextureTarget = TextureTarget; // export enum TextureProxyType {
//     Default,
//     /**
//      * for DepthTextureProxy class
//      */
//     Depth,
//     /**
//      * for WrapperTextureProxy class
//      */
//     Wrapper,
//     /**
//      * for RTTTextureProxy class
//      */
//     RTT,
//     /**
//      * for ImageTextureProxy class
//      */
//     Image,
//     /**
//      * for FloatTextureProxy class
//      */
//     Float,
//     /**
//      * for Uint16TextureProxy class
//      */
//     Uint16,
//     /**
//      * for FloatCubeTextureProxy class
//      */
//     FloatCube,
//     /**
//      * for BytesTextureProxy class
//      */
//     Bytes,
//     /**
//      * for BytesCubeTextureProxy class
//      */
//     BytesCube,
//     /**
//      * for ImageCubeTextureProxy class
//      */
//     ImageCube,
//     /**
//      * for Texture3DProxy class
//      */
//     Texture3D
// }

class TextureConst {
  static GetConst(gl, param) {
    switch (param) {
      case TextureConst.NEAREST:
        return gl.NEAREST;
        break;

      case TextureConst.LINEAR:
        return gl.LINEAR;
        break;

      case TextureConst.LINEAR_MIPMAP_LINEAR:
        return gl.LINEAR_MIPMAP_LINEAR;
        break;

      case TextureConst.NEAREST_MIPMAP_NEAREST:
        return gl.NEAREST_MIPMAP_NEAREST;
        break;

      case TextureConst.LINEAR_MIPMAP_NEAREST:
        return gl.LINEAR_MIPMAP_NEAREST;
        break;

      case TextureConst.NEAREST_MIPMAP_LINEAR:
        return gl.NEAREST_MIPMAP_LINEAR;
        break;

      case TextureConst.WRAP_REPEAT:
        return gl.REPEAT;
        break;

      case TextureConst.WRAP_CLAMP_TO_EDGE:
        return gl.CLAMP_TO_EDGE;
        break;

      case TextureConst.WRAP_MIRRORED_REPEAT:
        return gl.MIRRORED_REPEAT;
        break;

      default:
        break;
    }

    return -1;
  }

}

TextureConst.WRAP_REPEAT = 3001;
TextureConst.WRAP_CLAMP_TO_EDGE = 3002;
TextureConst.WRAP_MIRRORED_REPEAT = 3003;
TextureConst.NEAREST = 4001;
TextureConst.LINEAR = 4002;
TextureConst.LINEAR_MIPMAP_LINEAR = 4003;
TextureConst.NEAREST_MIPMAP_NEAREST = 4004;
TextureConst.LINEAR_MIPMAP_NEAREST = 4005;
TextureConst.NEAREST_MIPMAP_LINEAR = 4006;
exports.TextureConst = TextureConst;

/***/ }),

/***/ "8def":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const VROBase_1 = __importDefault(__webpack_require__("919c"));

class VertexRenderObj extends VROBase_1.default {
  constructor() {
    super();
    this.shdp = null;
    this.vbufs = null;
    this.vbuf = null;
    this.attribTypes = null;
    this.wholeOffsetList = null;
    this.attribTypesLen = 0;
    this.updateUnlocked = true;
    this.wholeStride = 0;
    this.m_uid = VertexRenderObj.s_uid++;
  }

  run() {
    if (this.m_rc.testVROUid(this.m_uid)) {
      //console.log("VertexRenderObj::run(), B:",rc.getUid(),this.m_vtxUid,this.m_uid);
      if (this.vbuf != null) {
        this.m_rc.useVtxAttribsPtrTypeFloat(this.shdp, this.vbuf, this.attribTypes, this.attribTypesLen, this.wholeOffsetList, this.wholeStride);
      } else {
        this.m_rc.useVtxAttribsPtrTypeFloatMulti(this.shdp, this.vbufs, this.attribTypes, this.attribTypesLen, this.wholeOffsetList, this.wholeStride);
      }

      if (this.m_rc.testRIOUid(this.m_vtxUid)) {
        this.m_rc.bindEleBuf(this.ibuf);
      }
    }
  }

  __$destroy() {
    console.log("VertexRenderObj::__$destroy()..., " + this);
    VROBase_1.default.s_midMap.delete(this.m_mid);
    this.m_mid = 0;
    this.m_vtxUid = -1;
    this.m_rc = null;
    this.shdp = null;
    this.vbufs = null;
    this.vbuf = null;
    this.ibuf = null;
    this.attribTypes = null;
    this.attribTypesLen = 0;
    this.wholeStride = 0;
  }

  restoreThis() {
    VertexRenderObj.Restore(this);
  }

  toString() {
    return "VertexRenderObj(uid = " + this.m_uid + ", type=" + this.m_mid + ")";
  } //  private static s_midMap:Map<number,VertexRenderObj> = new Map();


  static HasMid(mid) {
    return VROBase_1.default.s_midMap.has(mid);
  }

  static GetByMid(mid) {
    return VROBase_1.default.s_midMap.get(mid);
  }

  static GetFreeId() {
    if (VertexRenderObj.s_freeIdList.length > 0) {
      return VertexRenderObj.s_freeIdList.pop();
    }

    return -1;
  }

  static Create(rc, mid, pvtxUid) {
    let unit = null;
    let index = VertexRenderObj.GetFreeId(); //console.log("VertexRenderObj::Create(), VertexRenderObj.s_unitList.length: "+VertexRenderObj.s_unitList.length);

    if (index >= 0) {
      unit = VertexRenderObj.s_unitList[index];
      VertexRenderObj.s_unitFlagList[index] = VertexRenderObj.s_FLAG_BUSY;
      unit.setMidAndBufUid(mid, pvtxUid);
    } else {
      unit = new VertexRenderObj();
      unit.setMidAndBufUid(mid, pvtxUid);
      VertexRenderObj.s_unitList.push(unit);
      VertexRenderObj.s_unitFlagList.push(VertexRenderObj.s_FLAG_BUSY);
      VertexRenderObj.s_unitListLen++;
    }

    unit.setRC(rc);
    VROBase_1.default.s_midMap.set(mid, unit);
    return unit;
  }

  static Restore(pobj) {
    if (pobj != null && pobj.m_attachCount < 1 && VertexRenderObj.s_unitFlagList[pobj.getUid()] == VertexRenderObj.s_FLAG_BUSY) {
      let uid = pobj.getUid();
      VertexRenderObj.s_freeIdList.push(uid);
      VertexRenderObj.s_unitFlagList[uid] = VertexRenderObj.s_FLAG_FREE;

      pobj.__$destroy();
    }
  }

}

VertexRenderObj.s_uid = 0;
VertexRenderObj.s_FLAG_BUSY = 1;
VertexRenderObj.s_FLAG_FREE = 0;
VertexRenderObj.s_unitFlagList = [];
VertexRenderObj.s_unitListLen = 0;
VertexRenderObj.s_unitList = [];
VertexRenderObj.s_freeIdList = [];
exports.default = VertexRenderObj;

/***/ }),

/***/ "8e17":
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
}); // import MathConst from "../../vox/math/MathConst";

const v_m_180pk = 180.0 / Math.PI;
const v_m_minp = 1e-5;

class Vector3D {
  constructor(px = 0.0, py = 0.0, pz = 0.0, pw = 1.0) {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.w = 0.0;
    this.x = px;
    this.y = py;
    this.z = pz;
    this.w = pw;
  }

  clone() {
    return new Vector3D(this.x, this.y, this.z, this.w);
  }

  setTo(px, py, pz, pw = 1.0) {
    this.x = px;
    this.y = py;
    this.z = pz;
    this.w = pw;
  }

  setXYZ(px, py, pz) {
    this.x = px;
    this.y = py;
    this.z = pz;
  }

  copyFrom(v3) {
    this.x = v3.x;
    this.y = v3.y;
    this.z = v3.z;
  }

  dot(a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  }

  multBy(a) {
    this.x *= a.x;
    this.y *= a.y;
    this.z *= a.z;
  }

  normalize() {
    let d = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (d > v_m_minp) {
      this.x /= d;
      this.y /= d;
      this.z /= d;
    }
  }

  normalizeTo(a) {
    let d = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    if (d > v_m_minp) {
      a.x = this.x / d;
      a.y = this.y / d;
      a.z = this.z / d;
    } else {
      a.x = this.x;
      a.y = this.y;
      a.z = this.z;
    }
  }

  scaleVector(s) {
    this.x *= s.x;
    this.y *= s.y;
    this.z *= s.z;
  }

  scaleBy(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }

  equalsXYZ(a) {
    return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp;
  }

  equalsAll(a) {
    return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp && Math.abs(this.w - a.w) < v_m_minp;
  }

  project() {
    let t = 1.0 / this.w;
    this.x *= t;
    this.y *= t;
    this.z *= t;
  }

  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  getLengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  addBy(a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
  }

  subtractBy(a) {
    this.x -= a.x;
    this.y -= a.y;
    this.z -= a.z;
  }

  subtract(a) {
    return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
  }

  add(a) {
    return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z);
  }

  crossProduct(a) {
    return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x);
  }

  crossBy(a) {
    let px = this.y * a.z - this.z * a.y;
    let py = this.z * a.x - this.x * a.z;
    let pz = this.x * a.y - this.y * a.x;
    this.x = px;
    this.y = py;
    this.z = pz;
  }

  reflectBy(nv) {
    let idotn2 = (this.x * nv.x + this.y * nv.y + this.z * nv.z) * 2.0;
    this.x = this.x - idotn2 * nv.x;
    this.y = this.y - idotn2 * nv.y;
    this.z = this.z - idotn2 * nv.z;
  }

  scaleVecTo(va, scale) {
    this.x = va.x * scale;
    this.y = va.y * scale;
    this.z = va.z * scale;
  }

  subVecsTo(va, vb) {
    this.x = va.x - vb.x;
    this.y = va.y - vb.y;
    this.z = va.z - vb.z;
  }

  addVecsTo(va, vb) {
    this.x = va.x + vb.x;
    this.y = va.y + vb.y;
    this.z = va.z + vb.z;
  }

  crossVecsTo(va, vb) {
    this.x = va.y * vb.z - va.z * vb.y;
    this.y = va.z * vb.x - va.x * vb.z;
    this.z = va.x * vb.y - va.y * vb.x;
  }

  toString() {
    return "Vector3D(" + this.x + "" + this.y + "" + this.z + ")";
  }
  /**
   * 右手法则(为正)
   */


  static Cross(a, b, result) {
    result.x = a.y * b.z - a.z * b.y;
    result.y = a.z * b.x - a.x * b.z;
    result.z = a.x * b.y - a.y * b.x;
  } // (va1 - va0) 叉乘 (vb1 - vb0), 右手法则(为正)


  static CrossSubtract(va0, va1, vb0, vb1, result) {
    Vector3D.__vtor3Stv0.x = va1.x - va0.x;
    Vector3D.__vtor3Stv0.y = va1.y - va0.y;
    Vector3D.__vtor3Stv0.z = va1.z - va0.z;
    Vector3D.__vtor3Stv1.x = vb1.x - vb0.x;
    Vector3D.__vtor3Stv1.y = vb1.y - vb0.y;
    Vector3D.__vtor3Stv1.z = vb1.z - vb0.z;
    va0 = Vector3D.__vtor3Stv0;
    vb0 = Vector3D.__vtor3Stv1;
    result.x = va0.y * vb0.z - va0.z * vb0.y;
    result.y = va0.z * vb0.x - va0.x * vb0.z;
    result.z = va0.x * vb0.y - va0.y * vb0.x;
  }

  static Subtract(a, b, result) {
    result.x = a.x - b.x;
    result.y = a.y - b.y;
    result.z = a.z - b.z;
  }

  static DistanceSquared(a, b) {
    Vector3D.__vtor3Stv0.x = a.x - b.x;
    Vector3D.__vtor3Stv0.y = a.y - b.y;
    Vector3D.__vtor3Stv0.z = a.z - b.z;
    return Vector3D.__vtor3Stv0.getLengthSquared();
  }

  static DistanceXYZ(x0, y0, z0, x1, y1, z1) {
    Vector3D.__vtor3Stv0.x = x0 - x1;
    Vector3D.__vtor3Stv0.y = y0 - y1;
    Vector3D.__vtor3Stv0.z = z0 - z1;
    return Vector3D.__vtor3Stv0.getLength();
  }

  static Distance(v0, v1) {
    Vector3D.__vtor3Stv0.x = v0.x - v1.x;
    Vector3D.__vtor3Stv0.y = v0.y - v1.y;
    Vector3D.__vtor3Stv0.z = v0.z - v1.z;
    return Vector3D.__vtor3Stv0.getLength();
  }
  /**
   * get angle degree between two Vector3D objects
   * @param v0 src Vector3D object
   * @param v1 dst Vector3D object
   * @returns angle degree
   */


  static AngleBetween(v0, v1) {
    v0.normalizeTo(Vector3D.__vtor3Stv0);
    v1.normalizeTo(Vector3D.__vtor3Stv1);
    return Math.acos(Vector3D.__vtor3Stv0.dot(Vector3D.__vtor3Stv1)) * v_m_180pk;
  }
  /**
   * get angle radian between two Vector3D objects
   * @param v0 src Vector3D object
   * @param v1 dst Vector3D object
   * @returns angle radian
   */


  static RadianBetween(v0, v1) {
    v0.normalizeTo(Vector3D.__vtor3Stv0);
    v1.normalizeTo(Vector3D.__vtor3Stv1);
    return Math.acos(Vector3D.__vtor3Stv0.dot(Vector3D.__vtor3Stv1));
  }

  static RadianBetween2(v0, v1) {
    //  // c^2 = a^2 + b^2 - 2*a*b * cos(x)
    //  // cos(x) = (a^2 + b^2 - c^2) / 2*a*b
    let pa = v0.getLengthSquared();
    let pb = v1.getLengthSquared();
    Vector3D.__vtor3Stv0.x = v0.x - v1.x;
    Vector3D.__vtor3Stv0.y = v0.y - v1.y;
    Vector3D.__vtor3Stv0.z = v0.z - v1.z;
    return Math.acos((pa + pb - Vector3D.__vtor3Stv0.getLengthSquared()) / (2.0 * Math.sqrt(pa) * Math.sqrt(pb)));
  }

  static Reflect(iv, nv, rv) {
    let idotn2 = (iv.x * nv.x + iv.y * nv.y + iv.z * nv.z) * 2.0;
    rv.x = iv.x - idotn2 * nv.x;
    rv.y = iv.y - idotn2 * nv.y;
    rv.z = iv.z - idotn2 * nv.z;
  }

}

Vector3D.X_AXIS = new Vector3D(1, 0, 0);
Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
Vector3D.__vtor3Stv0 = new Vector3D();
Vector3D.__vtor3Stv1 = new Vector3D();
Vector3D.ZERO = new Vector3D();
exports.default = Vector3D;

/***/ }),

/***/ "9156":
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

class ROTransPool {
  static SetTransUniform(mat, uniform) {
    ROTransPool.s_transMap.set(mat.getUid(), uniform);
  }

  static GetTransUniform(mat) {
    if (mat.getUid() < 0) {
      throw Error("mat.getUid() < 0");
    }

    if (ROTransPool.s_transMap.has(mat.getUid())) return ROTransPool.s_transMap.get(mat.getUid());
    return null;
  }

  static HasTransUniform(mat) {
    return ROTransPool.s_transMap.has(mat.getUid());
  }

  static RemoveTransUniform(mat) {
    ROTransPool.s_transMap.delete(mat.getUid());
  }

}

ROTransPool.s_transMap = new Map();
exports.default = ROTransPool;

/***/ }),

/***/ "919c":
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

class VROBase {
  constructor() {
    this.m_uid = 0; // vtx attribute hash map id

    this.m_mid = 0;
    this.m_vtxUid = 0;
    this.m_rc = null;
    this.indicesRes = null;
    this.ibuf = null;
    /**
     * be used by the renderer runtime, the value is 2 or 4.
     */

    this.ibufStep = 2;
    this.m_attachCount = 0;
  }

  getVTCount() {
    if (this.indicesRes != null) return this.indicesRes.getVTCount();
    return 0;
  }

  setRC(rc) {
    this.m_rc = rc;
  }

  setMidAndBufUid(mid, pvtxUid) {
    this.m_mid = mid;
    this.m_vtxUid = pvtxUid;
    this.m_attachCount = 0;
  }

  getUid() {
    return this.m_uid;
  }

  getVtxUid() {
    return this.m_vtxUid;
  }

  getMid() {
    return this.m_mid;
  }
  /**
   * 被子类覆盖之后才有效
   */


  run() {}

  __$attachThis() {
    ++this.m_attachCount;
  }

  __$detachThis() {
    --this.m_attachCount;

    if (this.m_attachCount < 1) {
      this.m_attachCount = 0; //console.log("VROBase::__$detachThis() this.m_attachCount value is 0.");
    }
  }

  __$destroy() {
    //console.log("VROBase::__$destroy()..., ("+this.m_uid+")this.m_attachCount: "+this.m_attachCount);
    VROBase.s_midMap.delete(this.m_mid);
    this.m_mid = 0;
    this.m_vtxUid = -1;
    this.ibuf = null;
    this.m_rc = null;
    this.indicesRes = null;
  }

  restoreThis() {}

  static HasMid(mid) {
    return VROBase.s_midMap.has(mid);
  }

  static GetByMid(mid) {
    return VROBase.s_midMap.get(mid);
  } // static Reset(): void {
  //     VROBase.s_mid = -1;
  // }


  __$resetVRO() {
    VROBase.s_mid = -1;
  }

}

VROBase.s_mid = 0;
VROBase.s_midMap = new Map();
exports.default = VROBase;

/***/ }),

/***/ "9260":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const KeyboardEvent_1 = __importDefault(__webpack_require__("7045"));

class Keyboard {
  static KeyDown(evt) {
    var len = Keyboard.m_down_listener.length; //console.log("KeyDown(), m_down_listener.length: ",len);

    for (var i = 0; i < len; ++i) {
      Keyboard.m_down_listener[i].call(Keyboard.m_down_ers[i], evt);
    }
  }

  static KeyUp(evt) {
    let len = Keyboard.m_up_listener.length; //console.log("KeyUp(), m_up_listener.length: ",len);

    for (let i = 0; i < len; ++i) {
      Keyboard.m_up_listener[i].call(Keyboard.m_up_ers[i], evt);
    }
  }

  static RemoveEventListener(type, func) {
    if (func != null) {
      let i;

      switch (type) {
        case KeyboardEvent_1.default.KEY_DOWN:
          for (i = Keyboard.m_down_listener.length - 1; i >= 0; --i) {
            if (func === Keyboard.m_down_listener[i]) {
              Keyboard.m_down_ers.splice(i, 1);
              Keyboard.m_down_listener.splice(i, 1);
              break;
            }
          }

          break;

        case KeyboardEvent_1.default.KEY_UP:
          for (i = Keyboard.m_up_listener.length - 1; i >= 0; --i) {
            if (func === Keyboard.m_up_listener[i]) {
              Keyboard.m_up_ers.splice(i, 1);
              Keyboard.m_up_listener.splice(i, 1);
              break;
            }
          }

          break;

        default:
          break;
      }
    }
  }

}

Keyboard.m_down_ers = [];
Keyboard.m_down_listener = [];
Keyboard.m_up_ers = [];
Keyboard.m_up_listener = [];

Keyboard.AddEventListener = function (type, target, func) {
  if (func != null) {
    let i = 0;

    switch (type) {
      case KeyboardEvent_1.default.KEY_DOWN:
        for (i = Keyboard.m_down_listener.length - 1; i >= 0; --i) {
          if (func === Keyboard.m_down_listener[i]) {
            break;
          }
        }

        if (i < 0) {
          Keyboard.m_down_ers.push(target);
          Keyboard.m_down_listener.push(func);
        }

        break;

      case KeyboardEvent_1.default.KEY_UP:
        for (i = Keyboard.m_up_listener.length - 1; i >= 0; --i) {
          if (func === Keyboard.m_up_listener[i]) {
            break;
          }
        }

        if (i < 0) {
          Keyboard.m_up_ers.push(target);
          Keyboard.m_up_listener.push(func);
        }

        break;

      default:
        break;
    }
  }
};

exports.default = Keyboard;

/***/ }),

/***/ "955e":
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
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// gpu射线检测拾取代理对象

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const RaySelectedNode_1 = __importDefault(__webpack_require__("c120"));

const RenderConst_1 = __webpack_require__("e08e");

const RendererState_1 = __importDefault(__webpack_require__("29ef"));

const Color4_1 = __importDefault(__webpack_require__("3930"));

const PixelPickIndexMaterial_1 = __importDefault(__webpack_require__("e7ce"));

const AABBCalc_1 = __webpack_require__("e160");

class RayGpuSelector {
  constructor() {
    this.m_initColor = new Color4_1.default();
    this.m_indexMaterial = new PixelPickIndexMaterial_1.default();
    this.m_renderer = null;
    this.m_camera = null;
    this.m_headNode = null;
    this.m_rsn = null; // 最多检测256个对象

    this.m_hitList = new Uint8Array(256);
    this.m_rsnList = null;
    this.m_selectedNode = null;
    this.m_selectedTotal = 0;
    this.m_testMode = 0;
    this.m_invpv = new Vector3D_1.default();
    this.m_invtv = new Vector3D_1.default();
    this.m_rlpv = null;
    this.m_rltv = null;
    this.m_rlsiv = new Uint8Array(4);
    this.m_rlinvtv = new Vector3D_1.default();
    this.m_outv = new Vector3D_1.default();
    this.m_vecs = [null, null];
    this.m_gpuTestEnabled = true;
    this.m_uintArray = new Uint8Array(4);
    this.m_uintList = new Uint8Array(256);
  } //  setGPUTestEnabled(enabled:boolean):void
  //  {
  //      this.m_gpuTestEnabled = enabled;
  //  }


  setRenderer(renderer) {
    this.m_renderer = renderer;
  }

  setRayTestMode(testMode) {
    this.m_testMode = testMode;
  }

  setRay(rlpv, rltv) {
    this.m_rlpv = rlpv;
    this.m_rltv = rltv;
  }

  getRay(out_rlpv, out_rltv) {
    out_rlpv.copyFrom(this.m_rlpv);
    out_rltv.copyFrom(this.m_rltv);
  }

  setCamera(cam) {
    this.m_camera = cam;
  }

  setCullingNodeHead(headNode) {
    this.m_headNode = headNode;

    if (this.m_rsnList == null) {
      this.m_rsnList = [];
      let i = 0;

      for (; i < 256; ++i) {
        this.m_rsnList.push(new RaySelectedNode_1.default());
      }
    }
  } //  setSelectedNode(node:RaySelectedNode):void
  //  {
  //      this.m_selectedNode = node;
  //  }


  getSelectedNode() {
    return this.m_selectedNode;
  } //  setSelectedNodes(nodes:RaySelectedNode[], total:number):void
  //  {
  //      //this.m_rsnList = nodes;
  //  }


  getSelectedNodes() {
    return this.m_rsnList;
  }

  getSelectedNodesTotal() {
    return this.m_selectedTotal;
  }

  sorting(low, high) {
    let arr = this.m_rsnList; //标记位置为待排序数组段的low处也就时枢轴值

    this.m_rsn = arr[low];

    while (low < high) {
      //  如果当前数字已经有序的位于我们的枢轴两端，我们就需要移动它的指针，是high或是low
      while (low < high && arr[high].dis >= this.m_rsn.dis) {
        --high;
      } // 如果当前数字不满足我们的需求，我们就需要将当前数字移动到它应在的一侧


      arr[low] = arr[high];

      while (low < high && arr[low].dis <= this.m_rsn.dis) {
        ++low;
      }

      arr[high] = arr[low];
    }

    arr[low] = this.m_rsn;
    return low;
  }

  snsort(low, high) {
    if (low < high) {
      let pos = this.sorting(low, high);
      this.snsort(low, pos - 1);
      this.snsort(pos + 1, high);
    }
  }

  run() {
    let nextNode = this.m_headNode; //console.log("RaySelect run() nextNode != null: "+(nextNode != null));

    if (nextNode != null) {
      let dis = 0.0;
      let rtv = this.m_rltv;
      let rpv = this.m_rlpv;
      let outv = this.m_outv;
      let node = null;
      let total = 0;

      if (Math.abs(rtv.x) > MathConst_1.default.MATH_MIN_POSITIVE) {
        this.m_rlinvtv.x = 1.0 / rtv.x;
      } else {
        this.m_rlinvtv.x = MathConst_1.default.MATH_MAX_POSITIVE;
      }

      if (Math.abs(rtv.y) > MathConst_1.default.MATH_MIN_POSITIVE) {
        this.m_rlinvtv.y = 1.0 / rtv.y;
      } else {
        this.m_rlinvtv.y = MathConst_1.default.MATH_MAX_POSITIVE;
      }

      if (Math.abs(rtv.z) > MathConst_1.default.MATH_MIN_POSITIVE) {
        this.m_rlinvtv.z = 1.0 / rtv.z;
      } else {
        this.m_rlinvtv.z = MathConst_1.default.MATH_MAX_POSITIVE;
      }

      if (this.m_rlinvtv.x < 0) this.m_rlsiv[0] = 1;else this.m_rlsiv[0] = 0;
      if (this.m_rlinvtv.y < 0) this.m_rlsiv[1] = 1;else this.m_rlsiv[1] = 0;
      if (this.m_rlinvtv.z < 0) this.m_rlsiv[2] = 1;else this.m_rlsiv[2] = 0;

      while (nextNode != null) {
        if (nextNode.drawEnabled && nextNode.entity.mouseEnabled) {
          outv.x = nextNode.bounds.center.x - rpv.x;
          outv.y = nextNode.bounds.center.y - rpv.y;
          outv.z = nextNode.bounds.center.z - rpv.z;
          dis = outv.dot(rtv);
          outv.x -= dis * rtv.x;
          outv.y -= dis * rtv.y;
          outv.z -= dis * rtv.z;

          if (outv.getLengthSquared() <= nextNode.bounds.radius2) {
            // 如果只是几何检测(例如球体包围体的检测)就不需要在进入后续的aabb检测
            if (nextNode.rayTestState < 1) {
              this.m_vecs[0] = nextNode.bounds.min;
              this.m_vecs[1] = nextNode.bounds.max;

              if (AABBCalc_1.AABBCalc.IntersectionRL3(this.m_vecs, this.m_rlsiv, this.m_rlinvtv, rtv, rpv, outv)) {
                node = this.m_rsnList[total];
                node.entity = nextNode.entity;
                node.dis = this.m_rlinvtv.w;
                node.wpv.copyFrom(outv); //  console.log("H Hit Dis: "+rtv.dot(outv));
                //console.log("Ray hit test a renderNode.");

                ++total;
              }
            } //  else
            //  {
            //      //其他检测方式
            //  }

          }
        }

        nextNode = nextNode.next;
      }

      this.m_selectedNode = null;
      let i = 0;

      if (total > 0) {
        let invpv = this.m_invpv;
        let invtv = this.m_invtv;
        let entity = null;
        let flag = 0;
        let hitTotal = 0;
        let mat4 = null;
        let rayNode = null;
        let pvdis = rtv.dot(rpv);
        let preDis = 0.0;
        let polyTest = !this.m_gpuTestEnabled;
        let polyTotal = 0;

        if (total > 1) {
          this.snsort(0, total - 1);

          for (i = 0; i < total; ++i) {
            rayNode = this.m_rsnList[i];
            entity = this.m_rsnList[i].entity;

            if (entity.isPolyhedral()) {
              if (polyTest) {
                mat4 = entity.getInvMatrix();
                mat4.transformOutVector3(rpv, invpv);
                mat4.deltaTransformOutVector(rtv, invtv);
                invtv.normalize();
                flag = entity.testRay(invpv, invtv, outv, true);
              } else {
                ++polyTotal;
                flag = 0;
              }
            } else {
              mat4 = entity.getInvMatrix();
              mat4.transformOutVector3(rpv, invpv);
              mat4.deltaTransformOutVector(rtv, invtv);
              invtv.normalize();
              flag = entity.testRay(invpv, invtv, outv, true);
            }

            if (flag > 0) {
              rayNode.lpv.copyFrom(outv);
              entity.getMatrix().transformOutVector3(outv, rayNode.wpv);
              rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;
              this.m_hitList[hitTotal] = i;
              ++hitTotal; //console.log("YYYYYYYYYYYYYYYes multi Ray hit mesh success.");

              if (rayNode.dis > preDis) {
                this.m_selectedNode = rayNode;
                break;
              }
            } else if (flag < 0) {
              //console.log("NNNNNNNNNNNNNNNNo multi Ray hit mesh 没有做进一步的检测.");
              this.m_hitList[hitTotal] = i;
              ++hitTotal;

              if (rayNode.dis > preDis) {
                this.m_selectedNode = rayNode;
                break;
              }
            }

            preDis = rayNode.dis;
          }

          if (this.m_selectedNode == null && hitTotal > 0) {
            this.m_selectedNode = this.m_rsnList[this.m_hitList[0]];
          }
        } else {
          rayNode = this.m_rsnList[0];
          entity = this.m_rsnList[0].entity;
          mat4 = entity.getInvMatrix();
          mat4.transformOutVector3(rpv, invpv);
          mat4.deltaTransformOutVector(rtv, invtv);
          invtv.normalize();

          if (entity.isPolyhedral()) {
            if (polyTest) {
              flag = entity.testRay(invpv, invtv, outv, true);
            } else {
              ++polyTotal;
              flag = 0;
            }
          } else {
            flag = entity.testRay(invpv, invtv, outv, true);
          } //console.log("hit flag: "+flag);


          if (flag > 0) {
            rayNode.lpv.copyFrom(outv);
            entity.getMatrix().transformOutVector3(outv, rayNode.wpv);
            rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;
            this.m_selectedNode = rayNode; //console.log("YYYYYYYYYYYYYYYes Ray hit mesh success.");
          } else if (flag < 0) {
            //console.log("NNNNNNNNNNNNNNNo Ray hit mesh 没有做进一步的检测.");
            this.m_selectedNode = rayNode;
          }
        }

        if (polyTotal > 0) {
          if (this.m_testMode < 1) {
            // 进行gpu pixel 测试
            this.gpuPick(total);
          } else {
            if (this.m_selectedNode == null || this.m_selectedNode.entity.isPolyhedral()) {
              // 进行gpu pixel 测试
              this.gpuPick(total);
            }
          }
        } //console.log("YYYYYYYYYYYYYYYes Ray hit success.");

      }

      i = total;

      for (; i < this.m_selectedTotal; ++i) {
        //console.log("清理多余的 entity i: "+i);
        if (this.m_selectedNode != this.m_rsnList[i]) {
          this.m_rsnList[i].entity = null;
        }
      }

      this.m_selectedTotal = total;
    }
  }

  gpuPick(total) {
    let rcontext = this.m_renderer.getRendererContext();
    let proxy = this.m_renderer.getRenderProxy();
    let pmx = proxy.getStage3D().mouseX; //let pmy:number = proxy.getStage3D().stageHeight - proxy.getStage3D().mouseY;

    let pmy = proxy.getStage3D().mouseY;
    rcontext.vertexRenderBegin();
    rcontext.getClearRGBAColor4f(this.m_initColor);
    rcontext.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
    rcontext.setScissorEnabled(true);
    rcontext.setScissorRect(pmx, pmy, 1, 1);
    rcontext.clearBackBuffer();
    this.m_uintArray[3] = 0;
    RendererState_1.default.LockBlendMode(RenderConst_1.RenderBlendMode.OPAQUE);
    RendererState_1.default.LockDepthTestMode(RenderConst_1.DepthTestMode.OPAQUE);
    rcontext.unlockMaterial();
    rcontext.unlockRenderState();
    rcontext.useGlobalMaterial(this.m_indexMaterial, false, false);
    let rayNode = null;
    let entity = null;
    let j = -1;
    let i = 0;

    for (; i < total; ++i) {
      rayNode = this.m_rsnList[i];
      entity = this.m_rsnList[i].entity;

      if (entity.isPolyhedral()) {
        ++j;
        this.m_indexMaterial.setIndex(j + 2);
        this.m_uintList[j] = i;
        this.m_renderer.updateMaterialUniformToCurrentShd(this.m_indexMaterial);
        this.m_renderer.drawEntity(entity, false, true);
      }
    }

    if (j > -1) {
      proxy.readPixels(pmx, pmy, 1, 1, proxy.RGBA, proxy.UNSIGNED_BYTE, this.m_uintArray);
    }

    RendererState_1.default.UnlockBlendMode();
    RendererState_1.default.UnlockDepthTestMode(); //DivLog.ShowLog("uintArray[3]: "+this.m_uintArray[3]+", "+(((this.m_uintArray[0])<<8) + this.m_uintArray[1] + this.m_uintArray[2]/255.0));

    if (this.m_uintArray[3] > 1) {
      i = this.m_uintList[this.m_uintArray[3] - 2];
      rayNode = this.m_rsnList[i];
      let depth = (this.m_uintArray[0] << 8) + this.m_uintArray[1] + this.m_uintArray[2] / 255.0; //DivLog.ShowLog("depth: "+depth);

      if (this.m_selectedNode != null) {
        let selectedEntity = this.m_selectedNode.entity;

        if (this.m_selectedNode != rayNode && !selectedEntity.isPolyhedral()) {
          // 说明现在鼠标选中的非像素拾取对象更靠近摄像机
          if (this.m_selectedNode.dis < depth) {
            i = -1;
          }
        }
      }

      if (i > -1) {
        // 实际选中的是当前的通过像素拾取得到的对象
        rayNode.dis = depth; // 重新计算wpos和lpos

        this.getWorldPosByRayDistance(depth, this.m_rltv, this.m_camera.getPosition(), rayNode.wpv); //console.log(depth+","+rayNode.wpv.toString());

        this.m_selectedNode = rayNode;
      }
    }

    rcontext.setScissorEnabled(false);
    rcontext.unlockMaterial();
    rcontext.unlockRenderState();
    RendererState_1.default.UnlockBlendMode();
    RendererState_1.default.UnlockDepthTestMode();
    rcontext.setClearRGBAColor4f(this.m_initColor.r, this.m_initColor.g, this.m_initColor.b, this.m_initColor.a);
    rcontext.resetState();
  }

  clear() {
    this.m_selectedNode = null;
  } // @param           the cameraDistance is the distance between camera position and a position


  getWorldPosByRayDistance(cameraDistance, tv, camPv, resultV) {
    resultV.x = tv.x * cameraDistance + camPv.x;
    resultV.y = tv.y * cameraDistance + camPv.y;
    resultV.z = tv.z * cameraDistance + camPv.z; //console.log("### cameraDistance: "+cameraDistance);
    //  console.log("tv: "+tv.toString());
    //  console.log("camPv: "+camPv.toString());
    //  console.log("resultV: "+resultV.toString());
  }

}

exports.default = RayGpuSelector;

/***/ }),

/***/ "9666":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const ShaderData_1 = __importDefault(__webpack_require__("acfe"));

class MaterialResource {
  static CreateShdData(unique_name_str, vshdsrc, fshdSrc, adaptationShaderVersion, preCompileInfo) {
    //console.log("MaterialResource.CreateShdData() begin...");
    if (MaterialResource.s_shdDataDict.has(unique_name_str)) {
      return MaterialResource.s_shdDataDict.get(unique_name_str);
    }

    let p = new ShaderData_1.default();
    p.adaptationShaderVersion = adaptationShaderVersion;
    p.preCompileInfo = preCompileInfo;
    p.initialize(unique_name_str, vshdsrc, fshdSrc);
    MaterialResource.s_shdDataList[p.getUid()] = p;
    ++MaterialResource.s_shdDataListLen;
    MaterialResource.s_shdDataDict.set(unique_name_str, p);

    if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
      console.log("MaterialResource.Create() a new ShaderProgram: ", p.toString());
    }

    return p;
  }

  static FindData(unique_name_str) {
    if (MaterialResource.s_shdDataDict.has(unique_name_str)) {
      return MaterialResource.s_shdDataDict.get(unique_name_str);
    }

    return null;
  }

}

MaterialResource.s_shdDataDict = new Map();
MaterialResource.s_shdDataList = [];
MaterialResource.s_shdDataListLen = 0;
exports.default = MaterialResource;

/***/ }),

/***/ "984e":
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

class GpuTexObect {
  constructor() {
    // wait del times
    this.waitDelTimes = 0; // renderer context unique id

    this.rcuid = 0; // texture resource unique id

    this.resUid = 0; // texture resolution size

    this.width = 0;
    this.height = 0; // for 3d texture

    this.depth = 0;
    this.sampler = 0; // gpu texture buffer

    this.texBuf = null;
    this.m_attachCount = 0;
  }

  __$attachThis() {
    ++this.m_attachCount;
  }

  __$detachThis() {
    --this.m_attachCount; //console.log("GpuTexObect::__$detachThis() this.m_attachCount: "+this.m_attachCount);

    if (this.m_attachCount < 1) {
      this.m_attachCount = 0; //console.log("GpuTexObect::__$detachThis() this.m_attachCount value is 0.");
      // do something
    }
  }
  /**
   * bind the renderer runtime resource  to the current renderer context
   * @param gl system gpu context
   */


  bindToGpu(gl) {
    gl.bindTexture(this.sampler, this.texBuf);
  }

  getAttachCount() {
    return this.m_attachCount;
  }

} // gpu texture buffer renderer resource


class ROTextureResource {
  //readonly updater:ROTexDataUpdater = null;
  constructor(rcuid, gl) {
    this.m_resMap = new Map();
    this.m_freeMap = new Map(); // 显存的纹理buffer的总数

    this.m_texResTotal = 0;
    this.m_attachTotal = 0;
    this.m_delay = 128; // renderer context unique id

    this.m_rcuid = 0;
    this.m_gl = null;
    this.texMid = -1;
    this.unlocked = true;
    this.m_rcuid = rcuid;
    this.m_gl = gl; //  let selfT:any = this;
    //  selfT.updater = new ROTexDataUpdater(rcuid, gl, this.m_resMap);
  }

  createBuf() {
    return this.m_gl.createTexture();
  }

  createResByParams3(resUid, param0, param1, param2) {
    //console.log("TexRes createResByParams3, this.m_resMap.has("+resUid+"): ",this.m_resMap.has(resUid));
    if (!this.m_resMap.has(resUid)) {
      let obj = new GpuTexObect();
      obj.rcuid = this.getRCUid();
      obj.resUid = resUid;
      obj.width = param0;
      obj.height = param1;
      obj.sampler = param2;
      obj.texBuf = this.createBuf();
      obj.texBuf.resUid = resUid;
      this.addTextureRes(obj);
      return true;
    }

    return false;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }
  /**
   * @returns return system gpu context
   */


  getRC() {
    return this.m_gl;
  }
  /**
   * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
   * @param resUid renderer runtime resource unique id
   * @returns has or has not resource by unique id
   */


  hasResUid(resUid) {
    return this.m_resMap.has(resUid);
  }

  renderBegin() {
    this.texMid = -1;
  }
  /**
   * @returns get renderer runtime texture rexource total number
   */


  getTextureResTotal() {
    return this.m_texResTotal;
  }

  addTextureRes(object) {
    if (!this.m_resMap.has(object.resUid)) {
      object.waitDelTimes = 0; //console.log("ROTextureResource add a texture buffer(resUid="+object.resUid+"),sampler: ",object.sampler,object);

      this.m_resMap.set(object.resUid, object);
      this.m_texResTotal++;
    }
  }
  /**
   * get system gpu context resource buf
   * @param resUid renderer runtime resource unique id
   * @returns system gpu context resource buf
   */


  getGpuBuffer(resUid) {
    if (this.m_resMap.has(resUid)) {
      return this.m_resMap.get(resUid).texBuf;
    }

    return null;
  }
  /**
   * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
   * @param resUid renderer runtime resource unique id
   */


  bindToGpu(resUid) {
    if (this.m_resMap.has(resUid)) {
      this.m_resMap.get(resUid).bindToGpu(this.m_gl);
    }
  }
  /**
   * @returns get renderer runtime texture rexource reference total number
   */


  getAttachTotal() {
    return this.m_attachTotal;
  }

  __$attachRes(resUid) {
    if (this.m_resMap.has(resUid)) {
      this.m_attachTotal++;
      let object = this.m_resMap.get(resUid);

      if (object.getAttachCount() < 1) {
        if (this.m_freeMap.has(resUid)) {
          this.m_freeMap.delete(resUid);
        }
      }

      object.waitDelTimes = 0;

      object.__$attachThis();
    }
  }

  __$detachRes(resUid) {
    if (this.m_resMap.has(resUid)) {
      if (this.m_resMap.has(resUid)) {
        let object = this.m_resMap.get(resUid);

        if (object.getAttachCount() > 0) {
          this.m_attachTotal--;

          object.__$detachThis();

          if (object.getAttachCount() < 1) {
            // 将其加入待清理的map
            this.m_freeMap.set(resUid, object);
          }
        }
      }
    }
  }

  update() {
    this.m_delay--;

    if (this.m_delay < 1) {
      this.m_delay = 128;

      for (const [key, value] of this.m_freeMap) {
        value.waitDelTimes++;

        if (value.waitDelTimes > 5) {
          //console.log("ROTextureResource remove a texture buffer(resUid="+value.resUid+")");
          this.m_resMap.delete(value.resUid);
          this.m_freeMap.delete(value.resUid);
          this.m_gl.deleteTexture(value.texBuf);
          value.texBuf = null;
          this.m_texResTotal--;
        }
      }
    }
  }

}

exports.default = ROTextureResource;

/***/ }),

/***/ "9c4d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2019-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

Object.defineProperty(exports, "__esModule", {
  value: true
});

class Runner {
  constructor() {
    this.prev = null;
    this.next = null;
    this.flag = 0;
    this.target = null;
  }

  reset() {
    this.flag = 0;
    this.target = null;
  }

}

class RunnerLinker {
  constructor() {
    this.m_begin = null;
    this.m_end = null;
  }

  destroy() {
    this.clear();
  }

  clear() {
    this.m_begin = this.m_end = null;
  }

  getBegin() {
    return this.m_begin;
  }

  isEmpty() {
    return this.m_begin == this.m_end && this.m_end == null;
  }

  addNode(node) {
    if (this.m_begin == null) {
      this.m_end = this.m_begin = node;
    } else {
      if (this.m_end.prev != null) {
        this.m_end.next = node;
        node.prev = this.m_end;
        this.m_end = node;
      } else {
        this.m_begin.next = node;
        node.prev = this.m_end;
        this.m_end = node;
      }
    }

    this.m_end.next = null;
  }

  removeNode(node) {
    if (node == this.m_begin) {
      if (node == this.m_end) {
        this.m_begin = this.m_end = null;
      } else {
        this.m_begin = node.next;
        this.m_begin.prev = null;
      }
    } else if (node == this.m_end) {
      this.m_end = node.prev;
      this.m_end.next = null;
    } else {
      node.next.prev = node.prev;
      node.prev.next = node.next;
    }

    node.prev = null;
    node.next = null;
  }

}

class RunnableQueue {
  constructor() {
    this.m_linker = new RunnerLinker();
    this.m_freeIds = [];
    this.m_runners = [new Runner()];
  }

  getFreeId() {
    if (this.m_freeIds.length > 0) {
      return this.m_freeIds.pop();
    }

    let runner = new Runner();
    runner.flag = this.m_runners.length;
    this.m_runners.push(runner);
    return runner.flag;
  }

  addRunner(runner) {
    if (runner != null && runner.getRunFlag() < 1) {
      let i = this.getFreeId();
      let pr = this.m_runners[i];
      pr.flag = i;
      pr.target = runner;
      runner.setRunFlag(i);
      this.m_linker.addNode(pr);
    }
  }

  removeRunner(runner) {
    if (runner != null && runner.getRunFlag() > 0) {
      let i = runner.getRunFlag();
      this.m_freeIds.push(i);
      let pr = this.m_runners[i];
      pr.flag = i;
      pr.target = null;
      runner.setRunFlag(0);
      this.m_linker.removeNode(pr);
    }
  }

  run() {
    let ro = this.m_linker.getBegin();
    let next = ro;

    while (next != null) {
      ro = next;
      next = ro.next;

      if (ro.target.isRunning()) {
        ro.target.run();
      }
    }
  }

}

exports.default = RunnableQueue;

/***/ }),

/***/ "9f3e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const RawDataTextureProxy_1 = __importDefault(__webpack_require__("df25"));

class Uint16TextureProxy extends RawDataTextureProxy_1.default {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.m_type = TextureProxyType_1.TextureProxyType.Uint16;
    this.minFilter = TextureConst_1.TextureConst.LINEAR;
    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_SHORT;
  } //  OES_texture_half_float, HALF_FLOAT_OES


  toHalfFloatOes() {
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA;
    this.unpackAlignment = 4; // 8 bytes

    this.dataType = TextureConst_1.TextureDataType.HALF_FLOAT_OES;
  }

  toUShort565() {
    this.srcFormat = TextureConst_1.TextureFormat.RGB;
    this.internalFormat = TextureConst_1.TextureFormat.RGB; //UNSIGNED_SHORT_5_6_5

    this.unpackAlignment = 3; // 2 bytes

    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_SHORT_5_6_5;
  }

  toUShort4444() {
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA; //UNSIGNED_SHORT_4_4_4_4

    this.unpackAlignment = 4; // 2 bytes

    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_SHORT_4_4_4_4;
  }

  toUShort5551() {
    //UNSIGNED_SHORT_5_5_5_1
    this.unpackAlignment = 4; // 2 bytes

    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_SHORT_5_5_5_1;
  }

  toUShort() {
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA;
    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_SHORT; //UNSIGNED_SHORT
  }

  toAlphaFormat() {
    if (this.dataType == TextureConst_1.TextureDataType.UNSIGNED_SHORT) {
      this.srcFormat = TextureConst_1.TextureFormat.ALPHA;
      this.internalFormat = TextureConst_1.TextureFormat.ALPHA;
      this.unpackAlignment = 1;
    }
  }

  toRedFormat() {
    if (this.dataType == TextureConst_1.TextureDataType.UNSIGNED_SHORT) {
      this.srcFormat = TextureConst_1.TextureFormat.RED;
      this.internalFormat = TextureConst_1.TextureFormat.RED;
      this.unpackAlignment = 1;
    }
  }

  toRGBFormat() {
    if (this.dataType == TextureConst_1.TextureDataType.UNSIGNED_SHORT) {
      this.srcFormat = TextureConst_1.TextureFormat.RGB;
      this.internalFormat = TextureConst_1.TextureFormat.RGB;
      this.unpackAlignment = 3;
    }
  }

  toRGBAFormat() {
    if (this.dataType == TextureConst_1.TextureDataType.UNSIGNED_SHORT) {
      this.srcFormat = TextureConst_1.TextureFormat.RGBA;
      this.internalFormat = TextureConst_1.TextureFormat.RGBA;
      this.unpackAlignment = 4;
    }
  }

  uploadFromBytes(bytes, miplevel = 0, imgWidth = -1, imgHeight = -1, offsetx = 0, offsety = 0, rebuild = false) {
    super.setDataFromBytes(bytes, miplevel, imgWidth, imgHeight, offsetx, offsety, rebuild);
  }

  setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel = 0) {
    super.setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel);
  }

  getPixels(px, py, pw, ph, outBytes) {
    super.getPixels(px, py, pw, ph, outBytes);
  }

  toString() {
    return "[Uint16TextureProxy(width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

}

exports.default = Uint16TextureProxy;

/***/ }),

/***/ "a156":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const ShdProgram_1 = __importDefault(__webpack_require__("20ef"));

class ShaderProgramBuilder {
  constructor(rcuid) {
    this.m_shdDict = new Map();
    this.m_shdList = [];
    this.m_shdListLen = 0;
    this.m_sharedUniformList = [];
    this.m_rcuid = -1;
    this.m_rcuid = rcuid;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }
  /**
   * 这里的program生成过程已经能适配多GPU context的情况了
   */


  create(shdData) {
    // console.log("this.Create() begin...");
    let uns = shdData.getUniqueShaderName();

    if (this.m_shdDict.has(uns)) {
      return this.m_shdDict.get(uns);
    }

    let p = new ShdProgram_1.default(this.m_shdListLen);
    p.setShdData(shdData);
    this.m_shdList[p.getUid()] = p;
    this.m_sharedUniformList[p.getUid()] = null;
    ++this.m_shdListLen;
    this.m_shdDict.set(uns, p);

    if (RendererDevice_1.default.SHADERCODE_TRACE_ENABLED) {
      console.log("this.Create() a new ShdProgram: ", p.toString());
    }

    return p;
  }

  findShdProgramByUid(uid) {
    return this.m_shdList[uid];
  }

  findShdProgram(unique_name_str) {
    if (this.m_shdDict.has(unique_name_str)) {
      return this.m_shdDict.get(unique_name_str);
    }

    return null;
  }

  findShdProgramByShdData(shdData) {
    if (shdData != null) {
      if (this.m_shdDict.has(shdData.getUniqueShaderName())) {
        return this.m_shdDict.get(shdData.getUniqueShaderName());
      }
    }

    return null;
  }

  hasUid(resUid) {
    return this.m_shdList[resUid] != null;
  }

  getTotal() {
    return this.m_shdListLen;
  }

  containsUid(uid) {
    return uid > -1 && uid < this.m_shdListLen;
  }

}

exports.ShaderProgramBuilder = ShaderProgramBuilder;

/***/ }),

/***/ "a446":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 当前渲染场景空间管理的入口类, 鼠标拾取，摄像机裁剪，空间管理遮挡剔除等都是由这个系统来组织完成的

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const RSEntityFlag_1 = __importDefault(__webpack_require__("11e6"));

const SpaceCullingMask_1 = __webpack_require__("cc48");

const RPONode_1 = __importDefault(__webpack_require__("265e"));

const EntityNodeQueue_1 = __importDefault(__webpack_require__("af68"));

const Entity3DNodeLinker_1 = __importDefault(__webpack_require__("a80a"));

class RendererSpace {
  constructor() {
    this.m_uid = -1;
    this.m_renderer = null;
    this.m_camera = null;
    this.m_stage3d = null;
    this.m_emptyRPONode = new RPONode_1.default();
    this.m_rpoNodeBuilder = null;
    this.m_nodeQueue = new EntityNodeQueue_1.default();
    this.m_nodeWLinker = new Entity3DNodeLinker_1.default();
    this.m_nodeSLinker = new Entity3DNodeLinker_1.default();
    this.m_cullingor = null;
    this.m_raySelector = null;
    this.m_entitysTotal = 0;
    this.m_uid = RendererSpace.s_uid++;
    this.m_nodeQueue.initialize(1);
  }

  getUid() {
    return this.m_uid;
  }

  initialize(renderer, camera = null) {
    if (this.m_renderer == null) {
      this.m_renderer = renderer;
      this.m_stage3d = renderer.getStage3D();
      this.m_camera = camera;
      this.m_rpoNodeBuilder = renderer.getRPONodeBuilder();
    }
  }

  getStage3D() {
    return this.m_stage3d;
  }

  setCamera(camera) {
    this.m_camera = camera;
  }

  getCamera() {
    return this.m_camera;
  }

  getMouseXYWorldRay(rl_position, rl_tv) {
    this.m_camera.getWorldPickingRayByScreenXY(this.m_stage3d.mouseX, this.m_stage3d.mouseY, rl_position, rl_tv);
  }

  setSpaceCullingor(cullingor) {
    this.m_cullingor = cullingor;
  }

  setRaySelector(raySelector) {
    this.m_raySelector = raySelector;
    this.m_raySelector.setRenderer(this.m_renderer);
  }

  getRaySelector() {
    return this.m_raySelector;
  } // 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)


  addEntity(entity) {
    if (entity.getGlobalBounds() != null && entity.spaceCullMask > SpaceCullingMask_1.SpaceCullingMask.NONE) {
      if (RSEntityFlag_1.default.TestSpaceEnabled(entity.__$rseFlag)) {
        entity.update();
        ++this.m_entitysTotal;
        let node = this.m_nodeQueue.addEntity(entity);
        node.bounds = entity.getGlobalBounds();
        node.pcoEnabled = (entity.spaceCullMask & SpaceCullingMask_1.SpaceCullingMask.POV) == SpaceCullingMask_1.SpaceCullingMask.POV;
        let boo = entity.isInRendererProcess() || entity.getMaterial() == null;

        if (boo && (entity.spaceCullMask & SpaceCullingMask_1.SpaceCullingMask.POV) == SpaceCullingMask_1.SpaceCullingMask.POV) {
          node.rstatus = 1;

          if (entity.getMaterial() == null) {
            node.rpoNode = this.m_emptyRPONode;
          }

          if (node.rpoNode == null) {
            node.rpoNode = this.m_rpoNodeBuilder.getNodeByUid(entity.getDisplay().__$rpuid);
          }

          this.m_nodeSLinker.addNode(node);
        } else {
          if (entity.getMaterial() == null) {
            node.rstatus = 1;
            node.rpoNode = this.m_emptyRPONode;
            this.m_nodeSLinker.addNode(node);
          } else {
            node.rstatus = 0;
            this.m_nodeWLinker.addNode(node);
          }
        }
      }
    }
  }

  removeEntity(entity) {
    if (entity != null && RSEntityFlag_1.default.TestSpaceContains(entity.__$rseFlag)) {
      let node = this.m_nodeQueue.getNodeByEntity(entity);

      if (node != null) {
        if (node.rstatus > 0) {
          this.m_nodeSLinker.removeNode(node);
        } else {
          this.m_nodeWLinker.removeNode(node);
        }

        this.m_nodeQueue.removeEntity(entity);
        --this.m_entitysTotal;
      }
    }
  }

  updateEntity(entity) {//  if(RSEntityFlag.TestSpaceContains( entity.__$rseFlag ))
    //  {
    //      let node:Entity3DNode = this.m_nodeQueue.getNodeByEntity(entity);
    //      //  if(node != null)
    //      //  {
    //      //      node.distanceFlag = RSEntityFlag.TestSortEnabled(entity.__$rseFlag);
    //      //  }
    //  }
  }

  update() {}

  runBegin() {}

  run() {
    let nextNode = this.m_nodeWLinker.getBegin();

    if (nextNode != null) {
      let pnode = null;

      while (nextNode != null) {
        if (nextNode.entity.isInRendererProcess()) {
          pnode = nextNode;
          pnode.rstatus = 1;
          nextNode = nextNode.next;
          this.m_nodeWLinker.removeNode(pnode);
          this.m_nodeSLinker.addNode(pnode);

          if (pnode.rpoNode == null) {
            pnode.rpoNode = this.m_rpoNodeBuilder.getNodeByUid(pnode.entity.getDisplay().__$rpuid);
          }
        } else {
          nextNode = nextNode.next;
        }
      }
    }

    nextNode = this.m_nodeSLinker.getBegin();

    if (nextNode != null) {
      if (this.m_cullingor != null) {
        this.m_cullingor.setCamera(this.m_camera);
        this.m_cullingor.setCullingNodeHead(nextNode);
        this.m_cullingor.run();
      } else {
        let ab = null;
        let cam = this.m_camera; //let camPos:Vector3D = cam.getPosition();

        while (nextNode != null) {
          if (nextNode.rpoNode.isVsible() && nextNode.entity.isDrawEnabled()) {
            ab = nextNode.bounds;
            nextNode.drawEnabled = cam.visiTestSphere2(ab.center, ab.radius);
            nextNode.entity.drawEnabled = nextNode.drawEnabled;
            nextNode.rpoNode.drawEnabled = nextNode.drawEnabled; //  if(nextNode.drawEnabled && nextNode.distanceFlag)
            //  {
            //      nextNode.rpoNode.setValue(-Vector3D.DistanceSquared(camPos,ab.center));
            //      //console.log((nextNode.entity as any).name,",a runit.value: ",nextNode.rpoNode.unit.value);
            //  }
          } else {
            nextNode.drawEnabled = false;
            nextNode.entity.drawEnabled = false;
            nextNode.rpoNode.drawEnabled = false;
          } // if(DebugFlag.Flag_0 > 0) console.log("nextNode.rpoNode.isVsible(): ",nextNode.rpoNode.isVsible(), nextNode.entity.isDrawEnabled(), nextNode.drawEnabled);


          nextNode = nextNode.next;
        }
      }
    }
  }

  rayTest(rlpv, rltv) {
    if (this.m_raySelector != null) {
      this.m_raySelector.setCamera(this.m_camera);
      this.m_raySelector.setCullingNodeHead(this.m_nodeSLinker.getBegin());
      this.m_raySelector.setRay(rlpv, rltv);
      this.m_raySelector.run();
    }
  }

  runEnd() {}

  getCullingNodeHead() {
    return this.m_nodeSLinker.getBegin();
  }

  toString() {
    return "[RendererSpace(uid = " + this.m_uid + ")]";
  }

}

RendererSpace.s_uid = 0;
exports.default = RendererSpace;

/***/ }),

/***/ "a46e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 摄像机拉近拉远的控制(主要是移动端的多点触摸)

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const MouseEvent_1 = __importDefault(__webpack_require__("1710"));

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

class CameraZoomController {
  constructor() {
    this.m_camera = null;
    this.m_touchZoomBoo = false;
    this.m_preDis = 0;
    this.m_touchZoomSpd = 2.0;
    this.m_slideSpd = 1.0;
    this.m_mouseWheelZoomSpd = 6.0;
    this.m_tempa = new Vector3D_1.default();
    this.m_tempb = new Vector3D_1.default();
    this.m_preva = new Vector3D_1.default();
    this.m_prevb = new Vector3D_1.default();
    this.m_va = new Vector3D_1.default();
    this.m_vb = new Vector3D_1.default();
    this.m_lookAt = new Vector3D_1.default();
    this.m_fowardDis = 0;
    this.m_initBoo = true;
    this.m_lookAtCtrlEnabled = true;
    this.m_flagDrag = 0;
    this.m_flagZoom = 0;
    this.m_windowsEnvFlag = true;
    this.syncLookAt = false;
    /**
     * 取值为2, 表示相机的拉近拉远
     * 取值为1, 表示相机的拖动
     */

    this.m_flagType = 2;
    this.m_windowsEnvFlag = !(RendererDevice_1.default.IsMobileWeb() || RendererDevice_1.default.IsSafariWeb());
  }

  setMobileZoomSpeed(spd) {
    this.m_touchZoomSpd = spd;
  }

  seSlideSpeed(spd) {
    this.m_slideSpd = spd;
  }
  /**
   * set mousewheel zoom camera forward speed
   * @param spd default value is 6.0
   */


  setMouseWheelZoomSpd(spd) {
    this.m_mouseWheelZoomSpd = spd;
  }

  bindCamera(camera) {
    this.m_camera = camera;
  }

  initialize(stage3D) {
    if (this.m_initBoo) {
      this.m_initBoo = false;
      stage3D.addEventListener(MouseEvent_1.default.MOUSE_WHEEL, this, this.mouseWheelListener, true, true);
      stage3D.addEventListener(MouseEvent_1.default.MOUSE_MULTI_MOVE, this, this.mouseMultiMoveListener, true, true);
      stage3D.addEventListener(MouseEvent_1.default.MOUSE_MULTI_UP, this, this.mouseMultiUpListener, true, true);
    }
  }

  setLookAtCtrlEnabled(enabled) {
    this.m_lookAtCtrlEnabled = enabled;
  }

  mouseWheelListener(evt) {
    if (evt.wheelDeltaY > 0) {
      this.m_fowardDis += this.m_mouseWheelZoomSpd;
    } else {
      this.m_fowardDis -= this.m_mouseWheelZoomSpd;
    }
  }

  mouseMultiMoveListener(evt) {
    this.setTouchPosArray(evt.posArray);
  }

  mouseMultiUpListener(evt) {
    this.setTouchPosArray(evt.posArray);
  }

  resetState() {
    this.m_flagDrag = 0;
    this.m_flagZoom = 0;
    this.m_flagType = 0;
  }

  setTouchPosArray(posArray) {
    if (posArray != null && posArray.length > 1) {
      let dis = 0;
      this.m_va.setXYZ(posArray[0].x, posArray[0].y, 0);
      this.m_vb.setXYZ(posArray[1].x, posArray[1].y, 0);

      if (this.m_touchZoomBoo) {
        dis = Vector3D_1.default.Distance(this.m_va, this.m_vb);

        if (this.m_flagType < 1) {
          this.m_tempa.copyFrom(this.m_va);
          this.m_tempb.copyFrom(this.m_vb);
          this.m_tempa.subVecsTo(this.m_va, this.m_preva);
          this.m_tempb.subVecsTo(this.m_vb, this.m_prevb);
          this.m_tempa.normalize();
          this.m_tempb.normalize();

          if (this.m_tempa.dot(this.m_tempb) > 0.9) {
            // 可能是拖动
            this.m_flagDrag++;
          } else {
            // 可能是缩放
            this.m_flagZoom++;
          } //DivLog.ShowLog("> "+this.m_flagDrag+","+this.m_flagZoom);


          if (this.m_flagDrag > 3 || this.m_flagZoom > 3) {
            this.m_flagType = this.m_flagDrag > this.m_flagZoom ? 1 : 2;
          }
        } else {
          this.m_tempa.subVecsTo(this.m_va, this.m_preva);
        }

        let dv = Math.abs(this.m_preDis - dis);

        if (dv > 0.1) {
          this.m_fowardDis = (dis - this.m_preDis) * this.m_touchZoomSpd;
          this.m_preDis = dis;
        }
      } else {
        this.m_touchZoomBoo = true;
        this.m_preDis = Vector3D_1.default.Distance(this.m_va, this.m_vb);
        this.resetState();
      }
    } else {
      this.resetState();
      this.m_touchZoomBoo = false;
    }

    this.m_preva.copyFrom(this.m_va);
    this.m_prevb.copyFrom(this.m_vb);
  }

  run(lookAtPos, minDis) {
    let lookAtEnabled = this.m_lookAtCtrlEnabled;

    if (lookAtPos == null) {
      lookAtPos = this.m_lookAt;
    }

    if (this.m_camera != null) {
      if (this.syncLookAt) {
        this.m_camera.setLookAtPosition(lookAtPos);
      }

      if (this.m_flagType == 2) {
        // camera foward update
        if (Math.abs(this.m_fowardDis) > 0.001) {
          let dis = Vector3D_1.default.Distance(this.m_camera.getPosition(), this.m_camera.getLookAtPosition());
          let pd = this.m_fowardDis;

          if (this.m_fowardDis > 0) {
            if (dis > minDis) {
              pd = dis - minDis;
              if (pd > this.m_fowardDis) pd = this.m_fowardDis;
            } else {
              pd = 0;
            }
          }

          if (Math.abs(pd) > 0.1) {
            this.m_camera.forward(pd);
            if (lookAtEnabled) this.m_camera.setLookPosXYZFixUp(lookAtPos.x, lookAtPos.y, lookAtPos.z);
          }

          if (this.m_windowsEnvFlag) {
            this.m_fowardDis *= 0.95;
          } else {
            this.m_fowardDis = 0;
          }
        }
      } else if (this.m_flagType == 1) {
        // drag to slide
        this.m_camera.slideViewOffsetXY(-this.m_tempa.x * this.m_slideSpd, this.m_tempa.y * this.m_slideSpd);
      }
    }
  }

}

exports.default = CameraZoomController;

/***/ }),

/***/ "a5ba":
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

const RenderConst_1 = __webpack_require__("e08e");

class RenderStateObject {
  constructor(cullFaceMode, blendMode, depthTestMode) {
    this.m_uid = -1;
    this.m_cullFaceMode = 0; // blend mode

    this.m_blendMode = 0; // depth test type mode

    this.m_depthTestMode = 0; // shadow status Mode(receive | make | receive and make | none)

    this.m_shadowMode = 0;
    this.m_uid = RenderStateObject.s_uid++;
    this.m_cullFaceMode = cullFaceMode;
    this.m_blendMode = blendMode;
    this.m_depthTestMode = depthTestMode;
  }

  getUid() {
    return this.m_uid;
  }

  getCullFaceMode() {
    return this.m_cullFaceMode;
  }

  getDepthTestMode() {
    return this.m_depthTestMode;
  }

  getBlendMode() {
    return this.m_blendMode;
  }

  use() {
    if (RenderStateObject.s_state != this.m_uid) {
      //console.log("RenderStateObject this.m_uid: ",this.m_uid);
      RenderStateObject.Rstate.setCullFaceMode(this.m_cullFaceMode); //RenderStateObject.Rstate.setBlendMode(this.m_blendMode);

      let list = RenderStateObject.s_blendModes[RenderStateObject.m_blendMode];

      if (RenderStateObject.m_blendMode < 0) {
        RenderStateObject.Rstate.setBlendMode(this.m_blendMode, RenderStateObject.s_blendModes[this.m_blendMode]);
      } else {
        RenderStateObject.Rstate.setBlendMode(RenderStateObject.m_blendMode, RenderStateObject.s_blendModes[RenderStateObject.m_blendMode]);
      }

      if (RenderStateObject.s_depthTestMode < 0) {
        RenderStateObject.Rstate.setDepthTestMode(this.m_depthTestMode);
      } else {
        RenderStateObject.Rstate.setDepthTestMode(RenderStateObject.s_depthTestMode);
      } //


      RenderStateObject.s_state = this.m_uid;
    }
  }

  static CreateBlendModeSeparate(name, srcRGB, dstRGB, srcAlpha, dstAlpha, equationRGB = 0, equationAlpha = 0) {
    if (name != null && name != "") {
      let b;

      if (RenderStateObject.s_blendModeNameMap.has(name)) {
        b = RenderStateObject.s_blendModeNameMap.get(name);
        return RenderStateObject.s_blendModeIndexMap.get(b);
      }

      if (equationRGB < 1) {
        equationRGB = RenderConst_1.GLBlendEquation.FUNC_ADD;
      }

      if (equationAlpha < 1) {
        equationAlpha = RenderConst_1.GLBlendEquation.FUNC_ADD;
      }

      let type = 1;
      b = 31;
      b = b * 131 + srcRGB;
      b = b * 131 + dstRGB;

      if (srcAlpha > 0 && dstAlpha > 0) {
        b = b * 131 + srcAlpha;
        b = b * 131 + dstAlpha;
        type = 1;
      }

      if (RenderStateObject.s_blendModeIndexMap.has(b)) {
        console.warn("This blendmode value already exists, its name is " + name + ".");
        RenderStateObject.s_blendModeNameMap.set(name, b);
        return RenderStateObject.s_blendModeIndexMap.get(b);
      }

      let index = ++RenderStateObject.s_blendModeIndex;
      RenderStateObject.s_blendModeNameMap.set(name, b);
      RenderStateObject.s_blendModeIndexMap.set(b, index);
      let list = [type, equationRGB, equationAlpha, srcRGB, dstRGB, srcAlpha, dstAlpha];
      RenderStateObject.s_blendModes[index] = list;
      return index;
    }

    return 0;
  }

  static CreateBlendMode(name, srcColor, dstColor, blendEquation = 0) {
    if (name != null && name != "") {
      let b;

      if (RenderStateObject.s_blendModeNameMap.has(name)) {
        b = RenderStateObject.s_blendModeNameMap.get(name);
        return RenderStateObject.s_blendModeIndexMap.get(b);
      }

      if (blendEquation < 1) {
        blendEquation = RenderConst_1.GLBlendEquation.FUNC_ADD;
      }

      let type = 0;
      b = 31;
      b = b * 131 + srcColor;
      b = b * 131 + dstColor;

      if (RenderStateObject.s_blendModeIndexMap.has(b)) {
        return RenderStateObject.s_blendModeIndexMap.get(b);
      }

      let index = ++RenderStateObject.s_blendModeIndex;
      RenderStateObject.s_blendModeNameMap.set(name, b);
      RenderStateObject.s_blendModeIndexMap.set(b, index);
      let list = [type, blendEquation, 0, srcColor, dstColor, 0, 0]; //console.log("list: ",list);

      RenderStateObject.s_blendModes[index] = list;
      return index;
    }

    return 0;
  }

  static Create(objName, cullFaceMode, blendMode, depthTestMode) {
    if (RenderStateObject.s_stsNameMap.has(objName)) {
      let po = RenderStateObject.s_stsNameMap.get(objName);
      return po.getUid();
    } //let key: number = depthTestMode << 8 | blendMode << 4 | cullFaceMode;


    let key = 31;
    key = key * 131 + depthTestMode;
    key = key * 131 + blendMode;
    key = key * 131 + cullFaceMode;

    if (RenderStateObject.s_stsMap.has(key)) {
      let po = RenderStateObject.s_stsMap.get(key);
      key = po.getUid();
    } else {
      let po = new RenderStateObject(cullFaceMode, blendMode, depthTestMode);
      key = po.getUid();
      RenderStateObject.s_stsMap.set(key, po);
      RenderStateObject.s_stsNameMap.set(objName, po);
      RenderStateObject.s_states.push(po);
      ++RenderStateObject.s_statesLen;
    }

    return key;
  }

  static GetRenderStateByName(objName) {
    if (RenderStateObject.s_stsNameMap.has(objName)) {
      let po = RenderStateObject.s_stsNameMap.get(objName);
      return po.getUid();
    }

    return -1;
  } // @param           state come from RODisp::renderState


  static UseRenderState(state) {
    //if(RenderStateObject.s_unlocked && RenderStateObject.Rstate.roState != state)                
    if (RenderStateObject.s_unlocked && RenderStateObject.s_state != state) {
      if (state > -1 && state < RenderStateObject.s_statesLen) {
        RenderStateObject.s_states[state].use();
      }
    }
  }

  static UseRenderStateByName(stateName) {
    if (RenderStateObject.s_unlocked) {
      let state = RenderStateObject.GetRenderStateByName(stateName); //trace("state: "+state+", stateName: "+stateName);
      //if(RenderStateObject.Rstate.roState != state)

      if (RenderStateObject.s_state != state) {
        if (state > -1 && state < RenderStateObject.s_statesLen) {
          RenderStateObject.s_states[state].use();
        }
      }
    }
  }

  static UnlockBlendMode() {
    RenderStateObject.m_blendMode = RenderStateObject.s_preBlendMode;
  }

  static LockBlendMode(blendMode) {
    RenderStateObject.s_preBlendMode = RenderStateObject.m_blendMode;
    RenderStateObject.m_blendMode = blendMode;
  }

  static UnlockDepthTestMode() {
    RenderStateObject.s_depthTestMode = RenderStateObject.s_preDepthTestMode;
  }

  static LockDepthTestMode(depthTestMode) {
    RenderStateObject.s_preDepthTestMode = RenderStateObject.s_depthTestMode;
    RenderStateObject.s_depthTestMode = depthTestMode;
  }

  static Lock() {
    RenderStateObject.s_unlocked = false;
  }

  static Unlock() {
    RenderStateObject.s_unlocked = true;
  }

  static Reset() {
    RenderStateObject.s_state = -1;
  }

}

RenderStateObject.s_uid = 0;
RenderStateObject.s_state = -1;
RenderStateObject.s_states = [];
RenderStateObject.s_statesLen = 1;
RenderStateObject.m_blendMode = -1;
RenderStateObject.s_depthTestMode = -1;
RenderStateObject.s_stsMap = new Map();
RenderStateObject.s_stsNameMap = new Map();
RenderStateObject.s_blendModeNameMap = new Map();
RenderStateObject.s_blendModeIndexMap = new Map();
RenderStateObject.s_blendModeIndex = 0;
RenderStateObject.s_blendModes = new Array(256);
RenderStateObject.s_unlocked = true;
RenderStateObject.Rstate = null;
RenderStateObject.s_preBlendMode = -1;
RenderStateObject.s_preDepthTestMode = -1;
exports.RenderStateObject = RenderStateObject;

/***/ }),

/***/ "a7ed":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const UniformConst_1 = __importDefault(__webpack_require__("ab73"));

class FrustumUniformBuilder {
  create(rc, shdp) {
    let param = UniformConst_1.default.FrustumParam;
    if (shdp.hasUniformByName(param.name)) return rc.uniformContext.createShaderGlobalUniformFromProbe(rc.getCamera().ufrustumProbe, param.name, [param.name]);
    return null;
  }

  getIDNS() {
    return "FrustumUniformBuilder";
  }

}

exports.default = FrustumUniformBuilder;

/***/ }),

/***/ "a80a":
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

class Entity3DNodeLinker {
  constructor() {
    this.m_begin = null;
    this.m_end = null;
  }

  destroy() {
    this.clear();
  }

  clear() {
    this.m_begin = this.m_end = null;
  }

  getBegin() {
    return this.m_begin;
  }

  isEmpty() {
    return this.m_begin == this.m_end && this.m_end == null;
  }

  addNode(node) {
    if (this.m_begin == null) {
      this.m_end = this.m_begin = node;
    } else {
      if (this.m_end.prev != null) {
        this.m_end.next = node;
        node.prev = this.m_end;
        this.m_end = node;
      } else {
        this.m_begin.next = node;
        node.prev = this.m_end;
        this.m_end = node;
      }
    }

    this.m_end.next = null;
  }

  removeNode(node) {
    if (node == this.m_begin) {
      if (node == this.m_end) {
        this.m_begin = this.m_end = null;
      } else {
        this.m_begin = node.next;
        this.m_begin.prev = null;
      }
    } else if (node == this.m_end) {
      this.m_end = node.prev;
      this.m_end.next = null;
    } else {
      node.next.prev = node.prev;
      node.prev.next = node.next;
    }

    node.prev = null;
    node.next = null;
  }

}

exports.default = Entity3DNodeLinker;

/***/ }),

/***/ "a996":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 基本事件类

Object.defineProperty(exports, "__esModule", {
  value: true
});

class EventBase {
  constructor() {
    this.uuid = ""; // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)

    this.phase = 0; // 事件类型

    this.type = EventBase.RESIZE; // 事件发送者

    this.target = null; // 事件产生者, 例如容器发送了一个mouse down事件, 则容器是target而ray pick到的这个 entity就是currentTarget

    this.currentTarget = null;
    this.data = null;
    this.__$preventBoo = false;
  } //classType:number = 1001;


  getClassType() {
    return EventBase.EventClassType;
  }

  preventDefault() {
    this.__$preventBoo = true;
  }

  reset() {
    this.__$preventBoo = false;
  }

  toString() {
    return "[EventBase]";
  }

}

EventBase.EventClassType = 1001;
EventBase.RESIZE = 3001;
EventBase.ENTER_FRAME = 3002;
exports.default = EventBase;

/***/ }),

/***/ "a9f4":
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
var ShadowMode;

(function (ShadowMode) {
  /**
   * default shadow mode
   */
  ShadowMode[ShadowMode["Default"] = 1] = "Default";
  /**
   * vsm shadow mode
   */

  ShadowMode[ShadowMode["VSM"] = 1] = "VSM";
})(ShadowMode || (ShadowMode = {}));

exports.ShadowMode = ShadowMode;

/***/ }),

/***/ "ab73":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class ShadowVSMParams {
  constructor() {
    this.type = "vec4";
    this.data = null;
    /**
     * uniform name string
     */

    this.name = "u_vsmParams";
    /**
     * uniform array length
     */

    this.arrayLength = 3;
  }

}

class EnvLightParam {
  constructor() {
    this.type = "vec4";
    this.data = new Float32Array([0.1, 0.1, 0.1, 1.0, 1.0, 0.1, 600.0, 3500.0, 0.3, 0.0, 0.9, 0.0005, 0.0, 0.0, 800.0, 800.0, -500.0, -500.0, 1000.0, 1000.0 // env ambient area width, height
    ]);
    /**
     * uniform name string
     */

    this.name = "u_envLightParams";
    /**
     * uniform array length
     */

    this.arrayLength = 5;
  }

}
/**
 * shadow view matatrix4 float32array data
 */


class ShadowMat4UniformParam {
  constructor() {
    this.type = "mat4";
    this.data = null;
    /**
     * uniform name string
     */

    this.name = "u_shadowMat";
    /**
     * uniform array length
     */

    this.arrayLength = 0;
  }

}
/**
 * stage param shader uniform name string, vec4: [2.0/stageWidth,2.0/stageHeight, stageWidth,stageHeight]
 */


class StageUniformParam {
  constructor() {
    this.type = "vec4";
    this.data = null;
    /**
     * uniform name string
     */

    this.name = "u_stageParam";
    /**
     * uniform array length
     */

    this.arrayLength = 0;
  }

}
/**
 * view port param shader uniform name string, vec4: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
 */


class ViewUniformParam {
  constructor() {
    this.type = "vec4";
    this.data = null;
    /**
     * uniform name string
     */

    this.name = "u_viewParam";
    /**
     * uniform array length
     */

    this.arrayLength = 0;
  }

}
/**
 * camera frustrum param shader uniform name string,vec4: [camera zNear,camera zFar, camera nearPlaneHalfW, camera nearPlaneHalfH]
 */


class FrustumUniformParam {
  constructor() {
    this.type = "vec4";
    this.data = null;
    /**
     * uniform name string
     */

    this.name = "u_frustumParam";
    /**
     * uniform array length
     */

    this.arrayLength = 0;
  }

}
/**
 * camera world position param shader uniform name string,vec4: [x, y, z, w]
 */


class CameraPosUniformParam {
  constructor() {
    this.type = "vec4";
    this.data = null;
    /**
     * uniform name string
     */

    this.name = "u_cameraPosition";
    /**
     * uniform array length
     */

    this.arrayLength = 0;
  }

}

class GlobalLightUniform {
  constructor() {
    this.type = "vec4";
    this.positionName = "u_lightPositions";
    this.colorName = "u_lightColors";
  }

}

class UniformConst {}
/**
 * object local space to world space matrix shader uniform name string
 */


UniformConst.LocalTransformMatUNS = "u_objMat";
/**
 * camera view matrix shader uniform name string
 */

UniformConst.CameraViewMatUNS = "u_viewMat";
/**
 * camera projective matrix shader uniform name string
 */

UniformConst.CameraProjectiveMatUNS = "u_projMat";
/**
 * camera frustrum param shader uniform name string,vec4: [camera zNear,camera zFar, camera nearPlaneHalfW, camera nearPlaneHalfH]
 */

UniformConst.FrustumParam = new FrustumUniformParam();
/**
 * camera world position param shader uniform name string,vec4: [x, y, z, w]
 */

UniformConst.CameraPosParam = new CameraPosUniformParam();
/**
 * stage param shader uniform name string, vec4: [2.0/stageWidth,2.0/stageHeight, stageWidth,stageHeight]
 */

UniformConst.StageParam = new StageUniformParam();
/**
 * view port param shader uniform name string, vec4: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
 */

UniformConst.ViewportParam = new ViewUniformParam();
UniformConst.ShadowMatrix = new ShadowMat4UniformParam();
UniformConst.ShadowVSMParams = new ShadowVSMParams();
UniformConst.GlobalLight = new GlobalLightUniform();
UniformConst.EnvLightParams = new EnvLightParam();
exports.default = UniformConst;

/***/ }),

/***/ "abdb":
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

class OrientationType {}

OrientationType.AXIS_ANGLE = 0;
OrientationType.QUATERNION = 1;
OrientationType.EULER_ANGLES = 2;
exports.default = OrientationType;

/***/ }),

/***/ "acaa":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const RTTTextureProxy_1 = __importDefault(__webpack_require__("cfaf"));

class DepthTextureProxy extends RTTTextureProxy_1.default {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.minFilter = TextureConst_1.TextureConst.NEAREST;
    this.magFilter = TextureConst_1.TextureConst.NEAREST;
    this.srcFormat = TextureConst_1.TextureFormat.DEPTH_COMPONENT;
    this.internalFormat = TextureConst_1.TextureFormat.DEPTH_COMPONENT;
    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_SHORT;
    this.m_generateMipmap = false;
    this.m_haveRData = true;
    this.mipmapEnabled = false;
    this.m_type = TextureProxyType_1.TextureProxyType.Depth;
  }

  toDepthUnsignedInt() {
    this.minFilter = TextureConst_1.TextureConst.NEAREST;
    this.magFilter = TextureConst_1.TextureConst.NEAREST;
    this.srcFormat = TextureConst_1.TextureFormat.DEPTH_COMPONENT;
    this.internalFormat = TextureConst_1.TextureFormat.DEPTH_COMPONENT;
    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_INT;
    this.m_generateMipmap = false;
    this.m_haveRData = true;
    this.mipmapEnabled = false;
  }

  toDepthUnsignedShort() {
    this.minFilter = TextureConst_1.TextureConst.NEAREST;
    this.magFilter = TextureConst_1.TextureConst.NEAREST;
    this.srcFormat = TextureConst_1.TextureFormat.DEPTH_COMPONENT;
    this.internalFormat = TextureConst_1.TextureFormat.DEPTH_COMPONENT;
    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_SHORT;
    this.m_generateMipmap = false;
    this.m_haveRData = true;
    this.mipmapEnabled = false;
  }

  toDepthAndStencil() {
    this.minFilter = TextureConst_1.TextureConst.NEAREST;
    this.magFilter = TextureConst_1.TextureConst.NEAREST;
    this.srcFormat = TextureConst_1.TextureFormat.DEPTH_STENCIL;
    this.internalFormat = TextureConst_1.TextureFormat.DEPTH_STENCIL;
    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_INT_24_8_WEBGL;
    this.m_generateMipmap = false;
    this.mipmapEnabled = false;
    this.m_haveRData = true;
  }

  uploadData(texRes) {
    console.log("DepthTextureProxy uploadData()...");
    let gl = texRes.getRC();
    gl.texImage2D(this.m_sampler, 0, TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat), this.m_texWidth, this.m_texHeight, 0, TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat), TextureConst_1.TextureDataType.ToGL(gl, this.dataType), null);
  }

  toString() {
    return "[DepthTextureProxy(name:" + this.name + ",uid=" + this.getUid() + ",width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

}

exports.default = DepthTextureProxy;

/***/ }),

/***/ "acfe":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const BitConst_1 = __importDefault(__webpack_require__("ca6c"));

const VtxBufConst_1 = __importDefault(__webpack_require__("8a0a"));

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const GLSLConverter_1 = __importDefault(__webpack_require__("81ce"));

const ShaderCodeParser_1 = __importDefault(__webpack_require__("fc07"));

class ShaderData {
  constructor() {
    this.m_uid = -1;
    this.adaptationShaderVersion = true;
    this.preCompileInfo = null;
    this.m_vshdCode = "";
    this.m_fshdCode = "";
    this.m_shdUniqueName = "";
    this.m_texTotal = 0;
    this.m_uniforms = null; // identify use texture

    this.m_useTex = false; // web gl 1.0, attribute namestring list

    this.m_attriNSList = null;
    this.m_attriSizeList = null;
    this.m_aLocationTypes = null;
    this.m_uniformDict = new Map();
    this.m_layoutTypes = null;
    this.m_haveCommonUniform = false;
    this.m_layoutBit = 0x0;
    this.m_mid = 0x0;
    this.m_fragOutputTotal = 1;
    this.m_texUniformNames = null; // recode shader uniform including status

    this.dataUniformEnabled = false;
    this.m_uid = ShaderData.s_uid++;
  }

  getVSCodeStr() {
    return this.m_vshdCode;
  }

  getFSCodeStr() {
    return this.m_fshdCode;
  }

  getLocationTypes() {
    return this.m_layoutTypes;
  }

  getLayoutBit() {
    return this.m_layoutBit;
  }

  getMid() {
    return this.m_mid;
  }

  getFragOutputTotal() {
    return this.m_fragOutputTotal;
  }

  parseCode(vshdsrc, fshdSrc) {
    ShaderData.s_codeParser.reset();
    ShaderData.s_codeParser.parseVShaderCode(vshdsrc);
    ShaderData.s_codeParser.parseFShaderCode(fshdSrc);
    this.m_fragOutputTotal = ShaderData.s_codeParser.fragOutputTotal;
    this.m_uniforms = ShaderData.s_codeParser.uniforms;
  }

  initialize(unique_ns, vshdsrc, fshdSrc) {
    this.m_shdUniqueName = unique_ns;

    if (this.adaptationShaderVersion && this.preCompileInfo == null) {
      if (RendererDevice_1.default.IsWebGL1()) {
        vshdsrc = GLSLConverter_1.default.Es3VtxShaderToES2(vshdsrc);
        fshdSrc = GLSLConverter_1.default.Es3FragShaderToES2(fshdSrc);
      }
    } // 直接使用 preCompileInfo 中的 uniform / attribute 等等关键信息


    if (this.preCompileInfo != null) {}

    this.parseCode(vshdsrc, fshdSrc);
    let pattributes = ShaderData.s_codeParser.attributes;
    let i = 0;
    let len = pattributes.length;
    let attri = null;
    this.m_attriNSList = [];
    this.m_attriSizeList = [];
    this.m_layoutBit = 0x0;
    let locationsTotal = 0;
    let layoutTypes = this.m_layoutTypes = [];

    while (i < len) {
      attri = pattributes[i];

      if (attri != null) {
        this.m_attriNSList.push(attri.name);
        this.m_attriSizeList.push(attri.typeSize);
        locationsTotal += 1;
        let vbufType = VtxBufConst_1.default.GetVBufTypeByNS(attri.name);

        switch (vbufType) {
          case VtxBufConst_1.default.VBUF_VS:
            //mid += mid * 131 + 1;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_0;
            break;

          case VtxBufConst_1.default.VBUF_UVS:
            //mid += mid * 131 + 2;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_1;
            break;

          case VtxBufConst_1.default.VBUF_NVS:
            //mid += mid * 131 + 3;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_2;
            break;

          case VtxBufConst_1.default.VBUF_CVS:
            //mid += mid * 131 + 4;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_3;
            break;

          case VtxBufConst_1.default.VBUF_TVS:
            //mid += mid * 131 + 5;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_4;
            break;

          case VtxBufConst_1.default.VBUF_VS2:
            //mid += mid * 131 + 6;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_5;
            break;

          case VtxBufConst_1.default.VBUF_UVS2:
            //mid += mid * 131 + 7;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_6;
            break;

          case VtxBufConst_1.default.VBUF_NVS2:
            //mid += mid * 131 + 8;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_7;
            break;

          case VtxBufConst_1.default.VBUF_CVS2:
            //mid += mid * 131 + 9;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_8;
            break;

          case VtxBufConst_1.default.VBUF_TVS2:
            //mid += mid * 131 + 11;
            this.m_layoutBit |= BitConst_1.default.BIT_ONE_9;
            break;

          default:
            locationsTotal -= 1;
            vbufType = 0;
            break;
        }

        if (vbufType > 0) {
          layoutTypes.push(VtxBufConst_1.default.GetVBufAttributeTypeByVBufType(vbufType));
        }
      }

      ++i;
    }

    let mid = (locationsTotal << 11) + this.m_layoutBit;

    if (!ShaderData.s_midMap.has(mid)) {
      ShaderData.s_midMap.set(mid, ShaderData.s_mid);
      ShaderData.s_mid++;
    }

    this.m_mid = ShaderData.s_midMap.get(mid); // console.log("shader data, this.m_mid: ",this.m_mid, "locationsTotal: ",locationsTotal);

    this.m_texTotal = ShaderData.s_codeParser.texTotal;
    this.m_useTex = this.m_texTotal > 0;

    if (this.m_useTex) {
      this.m_texUniformNames = ShaderData.s_codeParser.texUniformNameListStr.split(",");
    }

    this.m_haveCommonUniform = this.m_texTotal < this.m_uniforms.length;
    this.m_vshdCode = vshdsrc;
    this.m_fshdCode = fshdSrc;
    this.m_shdUniqueName = unique_ns;
  }

  getAttriSizeList() {
    return this.m_attriSizeList;
  }

  getTexUniformNames() {
    return this.m_texUniformNames;
  }

  getUniforms() {
    return this.m_uniforms;
  }

  haveCommonUniform() {
    return this.m_haveCommonUniform;
  }

  getAttriNSList() {
    return this.m_attriNSList;
  }

  getUid() {
    return this.m_uid;
  }

  getTexTotal() {
    return this.m_texTotal;
  } // use texture true or false


  haveTexture() {
    return this.m_useTex;
  }

  getLocationsTotal() {
    return this.m_aLocationTypes.length;
  }

  getUniformTypeNameByNS(ns) {
    let uniform = this.m_uniformDict.get(ns);

    if (uniform != null) {
      return uniform.typeName;
    }

    return "";
  }

  getUniformTypeByNS(ns) {
    let uniform = this.m_uniformDict.get(ns);

    if (uniform != null) {
      return uniform.type;
    }

    return 0;
  }

  hasUniformByName(ns) {
    return this.m_uniformDict.has(ns);
  }

  getUniformLengthByNS(ns) {
    if (this.m_uniformDict.has(ns)) {
      this.m_uniformDict.get(ns).arrLength;
    }

    return 0;
  }

  getUniqueShaderName() {
    return this.m_shdUniqueName;
  }

  destroy() {
    this.m_texTotal = 0;
  }

}

ShaderData.s_uid = 0;
ShaderData.s_codeParser = new ShaderCodeParser_1.default();
ShaderData.s_midMap = new Map();
ShaderData.s_mid = 1;
exports.default = ShaderData;

/***/ }),

/***/ "af29":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RenderFilter_1 = __importDefault(__webpack_require__("722e"));

const RenderMaskBitfield_1 = __importDefault(__webpack_require__("8333"));

const TextureConst_1 = __webpack_require__("8d98");

const Color4_1 = __importDefault(__webpack_require__("3930"));

const FrameBufferType_1 = __importDefault(__webpack_require__("baae"));

const RendererState_1 = __importDefault(__webpack_require__("29ef"));

class FBOInstance {
  constructor(renderer, texStroe) {
    this.m_backBufferColor = new Color4_1.default();
    this.m_adapter = null;
    this.m_renderProxy = null;
    this.m_rcontext = null;
    this.m_bgColor = new Color4_1.default();
    this.m_renderer = null;
    this.m_runFlag = true;
    this.m_fboIndex = -1;
    this.m_fboType = -1;
    this.m_initW = 128;
    this.m_initH = 128;
    this.m_enableDepth = true;
    this.m_enableStencil = false;
    this.m_multisampleLevel = 0;
    this.m_gMateiral = null;
    this.m_gRState = -1;
    this.m_gRColorMask = -1;
    this.m_rindexs = [];
    this.m_texs = [null, null, null, null, null, null, null, null];
    this.m_texStore = null;
    this.m_texsTot = 0;
    this.m_synFBOSizeWithViewport = true;
    this.m_fboSizeFactor = 1.0;
    this.m_clearDepth = 256.0;
    this.m_clearColorBoo = true;
    this.m_clearDepthBoo = true;
    this.m_clearStencilBoo = false;
    this.m_viewportLock = false;
    this.m_texUnlock = false;
    this.m_tmaterialUniformUpdate = false;
    /**
     * unique name string
     */

    this.uns = "FBOInstance";
    this.m_renderer = renderer;
    this.m_texStore = texStroe;
    this.m_renderProxy = renderer.getRenderProxy();
    this.m_adapter = this.m_renderProxy.getRenderAdapter();
    this.m_rcontext = renderer.getRendererContext();
  }
  /**
   * @returns 获取当前FBOInstance所持有的 FBO 对象的 unique id (也就是序号)
   */


  getFBOUid() {
    return this.m_fboIndex;
  }
  /**
   * 设置当前 FBO控制的渲染过程中所需要的 renderer process 序号(id)列表
   */


  setRProcessIDList(processIDlist) {
    if (processIDlist != null) {
      if (processIDlist.length < 1) {
        throw Error("processIDlist.length < 1, but it must: processIDlist.length >= 1");
      }

      this.m_rindexs = processIDlist.slice(0);
    }
  }
  /**
   * 设置当前 FBO控制的渲染过程中所需要的 renderer process 序号(id)列表
   */


  setRProcessList(list) {
    if (list.length < 1) {
      throw Error("list.length < 1, but must: list.length >= 1");
    }

    this.m_rindexs = new Array(list.length);

    for (let i = 0; i < list.length; ++i) {
      this.m_rindexs[i] = list[i].getRPIndex();
    }
  }

  getRProcessIDAt(i) {
    return this.m_rindexs[i];
  }

  getStage3D() {
    return this.m_renderProxy.getStage3D();
  }

  getCamera() {
    if (this.m_renderProxy != null) {
      return this.m_renderProxy.getCamera();
    }

    return null;
  }

  lockViewport() {
    this.m_viewportLock = true;
  }

  unlockViewport() {
    this.m_viewportLock = false;
  }

  updateCamera() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.updateCamera();
    }
  }

  updateCameraDataFromCamera(cam) {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.updateCameraDataFromCamera(cam);
    }
  } ////////////////////////////////////////////////////// render state conctrl


  useGlobalRenderState(state) {
    this.m_rcontext.useGlobalRenderState(state);
  }

  useGlobalRenderStateByName(stateNS) {
    this.m_rcontext.useGlobalRenderStateByName(stateNS);
  }

  setGlobalRenderState(state) {
    this.m_gRState = state;
  }

  setGlobalRenderStateByName(stateNS) {
    this.m_gRState = this.m_rcontext.getRenderStateByName(stateNS);
  }

  lockRenderState(state = -1) {
    if (this.m_gRState >= 0 || state >= 0) {
      this.m_rcontext.useGlobalRenderState(state < 0 ? this.m_gRState : state);
    } else {
      this.m_renderProxy.lockRenderState();
    }
  }

  unlockRenderState() {
    this.m_renderProxy.unlockRenderState();
  } ////////////////////////////////////////////////////// render color mask conctrl


  useGlobalRenderColorMask(colorMask) {
    this.m_rcontext.useGlobalRenderColorMask(colorMask);
  }

  useGlobalRenderColorMaskByName(colorMaskNS) {
    this.m_rcontext.useGlobalRenderColorMaskByName(colorMaskNS);
  }

  setGlobalRenderColorMask(colorMask) {
    this.m_gRColorMask = colorMask;
  }

  setGlobalRenderColorMaskByName(colorMaskNS) {
    this.m_gRColorMask = this.m_rcontext.getRenderColorMaskByName(colorMaskNS);
  }

  lockColorMask(colorMask = -1) {
    if (this.m_gRColorMask >= 0 || colorMask >= 0) {
      this.m_rcontext.useGlobalRenderColorMask(colorMask < 0 ? this.m_gRColorMask : colorMask);
    } else {
      this.m_renderProxy.lockRenderColorMask();
    }
  }

  unlockRenderColorMask() {
    this.m_rcontext.useGlobalRenderColorMask(RendererState_1.default.COLOR_MASK_ALL_TRUE);
    this.m_renderProxy.unlockRenderColorMask();
  } ////////////////////////////////////////////////////// material conctrl


  useGlobalMaterial(m, texUnlock = false, materialUniformUpdate = false) {
    this.m_texUnlock = texUnlock;
    this.m_tmaterialUniformUpdate = materialUniformUpdate;
    this.m_rcontext.useGlobalMaterial(m, this.m_texUnlock, materialUniformUpdate);
  }
  /**
   *
   * @param material MaterialBase 子类的实例
   * @param texUnlock 是否锁定并使用 material 自身所带的纹理数据
   */


  setGlobalMaterial(material, texUnlock = false, materialUniformUpdate = false) {
    this.m_texUnlock = texUnlock;
    this.m_tmaterialUniformUpdate = materialUniformUpdate;

    if (this.m_gMateiral != material) {
      if (this.m_gMateiral != null) {
        this.m_gMateiral.__$detachThis();
      }

      if (material != null) {
        material.__$attachThis();
      }

      this.m_gMateiral = material;
    }
  }

  lockMaterial() {
    if (this.m_gMateiral != null) {
      this.m_rcontext.useGlobalMaterial(this.m_gMateiral, this.m_texUnlock, this.m_tmaterialUniformUpdate);
    } else {
      this.m_rcontext.lockMaterial();
    }
  }

  unlockMaterial() {
    this.m_rcontext.unlockMaterial();
  }

  updateGlobalMaterialUniform() {
    this.m_rcontext.updateMaterialUniform(this.m_gMateiral);
  }

  clearDepth(clearDepth = 1.0) {
    this.m_adapter.clearFBODepthAt(this.m_fboIndex, clearDepth);
  }

  synFBOSizeWithViewport() {
    this.m_synFBOSizeWithViewport = true;
  }

  asynFBOSizeWithViewport() {
    this.m_synFBOSizeWithViewport = false;
  } // if synFBOSizeWithViewport is true, fbo size = factor * view port size;


  setFBOSizeFactorWithViewPort(factor) {
    this.m_fboSizeFactor = factor;
  }

  createViewportSizeFBOAt(fboIndex, enableDepth = false, enableStencil = false, multisampleLevel = 0) {
    if (this.m_fboIndex < 0) {
      this.m_fboIndex = fboIndex;
      this.m_fboType = FrameBufferType_1.default.FRAMEBUFFER;
      this.m_initW = this.m_adapter.getViewportWidth();
      this.m_initH = this.m_adapter.getViewportHeight();
      this.m_enableDepth = enableDepth;
      this.m_enableStencil = enableStencil;
      this.m_multisampleLevel = multisampleLevel;
      this.m_adapter.createFBOAt(fboIndex, this.m_fboType, this.m_initW, this.m_initH, enableDepth, enableStencil, multisampleLevel);
    }
  }

  createFBO(enableDepth, enableStencil, multisampleLevel = 0) {
    this.m_enableDepth = enableDepth;
    this.m_enableStencil = enableStencil;
    this.m_multisampleLevel = multisampleLevel;
    this.m_adapter.createFBOAt(this.m_fboIndex, this.m_fboType, this.m_initW, this.m_initH, enableDepth, enableStencil, multisampleLevel);
  }
  /**
   * 创建一个指定序号的 FBO(FrameBufferObject) 渲染运行时管理对象,
   * renderer中一个序号只会对应一个唯一的 FBO 对象实例
   * @param fboIndex FBO 对象的序号
   * @param enableDepth FBO 对象的depth读写是否开启
   * @param enableStencil FBO 对象的stencil读写是否开启
   * @param multisampleLevel FBO 对象的multisample level
   */


  createAutoSizeFBOAt(fboIndex, enableDepth = false, enableStencil = false, multisampleLevel = 0) {
    if (fboIndex >= 0 && this.m_fboIndex < 0) {
      this.m_fboType = FrameBufferType_1.default.FRAMEBUFFER;
      this.m_initW = 512;
      this.m_initH = 512;
      this.m_fboIndex = fboIndex;
      this.createFBO(enableDepth, enableStencil, multisampleLevel);
    }
  }
  /**
   * 创建一个指定序号的 FBO(FrameBufferObject) 渲染运行时管理对象,
   * renderer中一个序号只会对应一个唯一的 FBO 对象实例
   * @param fboIndex FBO 对象的序号
   * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
   * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
   * @param enableDepth FBO 对象的depth读写是否开启
   * @param enableStencil FBO 对象的stencil读写是否开启
   * @param multisampleLevel FBO 对象的multisample level
   */


  createFBOAt(fboIndex, width, height, enableDepth = false, enableStencil = false, multisampleLevel = 0) {
    if (fboIndex >= 0 && this.m_fboIndex < 0) {
      this.m_fboType = FrameBufferType_1.default.FRAMEBUFFER;
      this.m_initW = width;
      this.m_initH = height;
      this.m_fboIndex = fboIndex;
      if (this.m_initW < 1) this.m_initW = this.m_adapter.getRCanvasWidth();
      if (this.m_initH < 1) this.m_initH = this.m_adapter.getRCanvasHeight();
      this.createFBO(enableDepth, enableStencil, multisampleLevel);
    }
  }
  /**
   * 创建一个指定序号的 read FBO(FrameBufferObject) 渲染运行时管理对象,
   * renderer中一个序号只会对应一个唯一的 FBO 对象实例
   * @param fboIndex FBO 对象的序号
   * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
   * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
   * @param enableDepth FBO 对象的depth读写是否开启
   * @param enableStencil FBO 对象的stencil读写是否开启
   * @param multisampleLevel FBO 对象的multisample level
   */


  createReadFBOAt(fboIndex, width, height, enableDepth = false, enableStencil = false, multisampleLevel = 0) {
    if (fboIndex >= 0 && this.m_fboIndex < 0) {
      this.m_fboType = FrameBufferType_1.default.READ_FRAMEBUFFER;
      this.m_initW = width;
      this.m_initH = height;
      this.m_fboIndex = fboIndex;
      if (this.m_initW < 1) this.m_initW = this.m_adapter.getRCanvasWidth();
      if (this.m_initH < 1) this.m_initH = this.m_adapter.getRCanvasHeight();
      this.createFBO(enableDepth, enableStencil, multisampleLevel);
    }
  }
  /**
   * 创建一个指定序号的 draw FBO(FrameBufferObject) 渲染运行时管理对象,
   * renderer中一个序号只会对应一个唯一的 FBO 对象实例
   * @param fboIndex FBO 对象的序号
   * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
   * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
   * @param enableDepth FBO 对象的depth读写是否开启
   * @param enableStencil FBO 对象的stencil读写是否开启
   * @param multisampleLevel FBO 对象的multisample level
   */


  createDrawFBOAt(fboIndex, width, height, enableDepth = false, enableStencil = false, multisampleLevel = 0) {
    if (fboIndex >= 0 && this.m_fboIndex < 0) {
      this.m_fboType = FrameBufferType_1.default.DRAW_FRAMEBUFFER;
      this.m_initW = width;
      this.m_initH = height;
      this.m_fboIndex = fboIndex;
      if (this.m_initW < 1) this.m_initW = this.m_adapter.getRCanvasWidth();
      if (this.m_initH < 1) this.m_initH = this.m_adapter.getRCanvasHeight();
      this.createFBO(enableDepth, enableStencil, multisampleLevel);
    }
  }

  resizeFBO(fboBufferWidth, fboBufferHeight) {
    if (this.m_initW != fboBufferWidth || this.m_initH != fboBufferHeight) {
      this.m_initW = fboBufferWidth;
      this.m_initH = fboBufferHeight;
      this.m_adapter.resizeFBOAt(this.m_fboIndex, fboBufferWidth, fboBufferHeight);
    }
  }
  /**
   * @returns get framebuffer output attachment texture by attachment index
   */


  getRTTAt(i) {
    return this.m_texs[i];
  }

  enableMipmapRTTAt(i) {
    this.m_texs[i].enableMipmap();
  }

  generateMipmapTextureAt(i) {
    this.m_texs[i].generateMipmap(this.m_renderProxy.Texture);
  }
  /**
   * 设置渲染到纹理的目标纹理对象(可由用自行创建)和framebuffer output attachment index
   * @param rttTexProxy 作为渲染到目标的目标纹理对象
   * @param outputIndex framebuffer output attachment index
   */


  setRenderToTexture(texture, outputIndex = 0) {
    if (outputIndex == 0) {
      this.m_texsTot = 1;
    } else if (this.m_texsTot < outputIndex + 1) {
      this.m_texsTot = outputIndex + 1;
    }

    this.m_texs[outputIndex] = texture;
    return texture;
  }
  /**
   * 设置渲染到纹理的目标纹理对象(普通 RTT 纹理类型的目标纹理)和framebuffer output attachment index
   * @param systemRTTTexIndex 作为渲染到目标的目标纹理对象在系统普通rtt 纹理中的序号(0 -> 15)
   * @param outputIndex framebuffer output attachment index
   */


  setRenderToRTTTextureAt(systemRTTTexIndex, outputIndex = 0) {
    this.setRenderToTexture(this.m_texStore.getRTTTextureAt(systemRTTTexIndex), outputIndex);
  }
  /**
   * 设置渲染到纹理的目标纹理对象(Float RTT 纹理类型的目标纹理)和framebuffer output attachment index
   * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
   * @param outputIndex framebuffer output attachment index
   */


  setRenderToFloatTextureAt(systemFloatRTTTexIndex, outputIndex = 0) {
    this.setRenderToTexture(this.m_texStore.getRTTFloatTextureAt(systemFloatRTTTexIndex), outputIndex);
  }
  /**
   * 设置渲染到纹理的目标纹理对象(half Float RTT 纹理类型的目标纹理)和framebuffer output attachment index
   * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
   * @param outputIndex framebuffer output attachment index
   */


  setRenderToHalfFloatTexture(texture, outputIndex = 0) {
    if (texture == null) {
      texture = this.m_texStore.createRTTTex2D(128, 128, false);

      texture.__$setRenderProxy(this.m_renderProxy);

      texture.internalFormat = TextureConst_1.TextureFormat.RGBA16F;
      texture.srcFormat = TextureConst_1.TextureFormat.RGBA;
      texture.dataType = TextureConst_1.TextureDataType.FLOAT;
      texture.minFilter = TextureConst_1.TextureConst.LINEAR;
      texture.magFilter = TextureConst_1.TextureConst.LINEAR;

      texture.__$setRenderProxy(this.m_renderProxy);
    }

    return this.setRenderToTexture(texture, outputIndex);
  }
  /**
   * 设置渲染到纹理的目标纹理对象(RGBA RTT 纹理类型的目标纹理)和framebuffer output attachment index
   * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
   * @param outputIndex framebuffer output attachment index
   */


  setRenderToRGBATexture(texture, outputIndex = 0) {
    if (texture == null) texture = this.createRGBATexture();
    return this.setRenderToTexture(texture, outputIndex);
  }
  /**
   * 设置渲染到纹理的目标纹理对象(depth RTT 纹理类型的目标纹理)和framebuffer output attachment index
   * @param systemDepthRTTTexIndex 作为渲染到目标的目标纹理对象在系统depth rtt 纹理中的序号(0 -> 15)
   * @param outputIndex framebuffer output attachment index
   */


  setRenderToDepthTextureAt(systemDepthRTTTexIndex, outputIndex = 0) {
    return this.setRenderToTexture(this.m_texStore.getDepthTextureAt(systemDepthRTTTexIndex), outputIndex);
  }

  createRGBATexture() {
    let texture = this.m_texStore.createRTTTex2D(32, 32, false);
    texture.internalFormat = TextureConst_1.TextureFormat.RGBA;
    texture.srcFormat = TextureConst_1.TextureFormat.RGBA;
    texture.dataType = TextureConst_1.TextureDataType.UNSIGNED_BYTE;
    texture.minFilter = TextureConst_1.TextureConst.LINEAR;
    texture.magFilter = TextureConst_1.TextureConst.LINEAR;

    texture.__$setRenderProxy(this.m_renderProxy);

    return texture;
  }

  setClearState(clearColorBoo, clearDepthBoo, clearStencilBoo = false) {
    this.m_clearColorBoo = clearColorBoo;
    this.m_clearDepthBoo = clearDepthBoo;
    this.m_clearStencilBoo = clearStencilBoo;
  }

  setRenderToBackBuffer() {
    this.m_renderProxy.setClearColor(this.m_backBufferColor);
    this.m_rcontext.setRenderToBackBuffer();
  }

  setClearDepth(depth) {
    this.m_clearDepth = depth;
  }

  getClearDepth() {
    return this.m_adapter.getClearDepth();
  }

  getViewportX() {
    return this.m_adapter.getViewportX();
  }

  getViewportY() {
    return this.m_adapter.getViewportY();
  }

  getViewportWidth() {
    return this.m_adapter.getViewportWidth();
  }

  getViewportHeight() {
    return this.m_adapter.getViewportHeight();
  }

  getFBOWidth() {
    return this.m_adapter.getFBOWidthAt(this.m_fboIndex);
  }

  getFBOHeight() {
    return this.m_adapter.getFBOHeightAt(this.m_fboIndex);
  }

  resetAttachmentMask(boo) {
    this.m_adapter.resetFBOAttachmentMask(boo);
  }

  setAttachmentMaskAt(index, boo) {
    this.m_adapter.setFBOAttachmentMaskAt(index, boo);
  }

  setClearRGBColor3f(pr, pg, pb) {
    this.m_bgColor.setRGB3f(pr, pg, pb);
  }

  setClearColorEnabled(boo) {
    this.m_clearColorBoo = boo;
  }

  setClearDepthEnabled(boo) {
    this.m_clearDepthBoo = boo;
  }

  setClearStencilEnabled(boo) {
    this.m_clearStencilBoo = boo;
  }

  setClearUint24Color(colorUint24, alpha = 1.0) {
    this.m_bgColor.setRGBUint24(colorUint24);
    this.m_bgColor.a = alpha;
  }

  setClearRGBAColor4f(pr, pg, pb, pa) {
    this.m_bgColor.setRGBA4f(pr, pb, pg, pa);
  }
  /**
   * @param			clearType, it is IRenderProxy.COLOR or IRenderProxy.DEPTH or IRenderProxy.STENCIL or IRenderProxy.DEPTH_STENCIL
   */


  blitFrom(fboIns, mask_bitfiled = RenderMaskBitfield_1.default.COLOR_BUFFER_BIT, filter = RenderFilter_1.default.NEAREST, clearType = -1, clearIndex = 0, dataArr = null) {
    if (this.m_fboIndex >= 0) {
      this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
      this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
      this.m_adapter.blitFBO(fboIns.getFBOUid(), this.m_fboIndex, mask_bitfiled, filter, clearType, clearIndex, dataArr);
    }
  }

  blitColorFrom(fboIns, filter = RenderFilter_1.default.NEAREST, clearType = -1, clearIndex = 0, dataArr = null) {
    if (this.m_fboIndex >= 0) {
      this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
      this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
      this.m_adapter.blitFBO(fboIns.getFBOUid(), this.m_fboIndex, RenderMaskBitfield_1.default.COLOR_BUFFER_BIT, filter, clearType, clearIndex, dataArr);
    }
  }

  blitDepthFrom(fboIns, filter = RenderFilter_1.default.NEAREST, clearType = -1, clearIndex = 0, dataArr = null) {
    if (this.m_fboIndex >= 0) {
      this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
      this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
      this.m_adapter.blitFBO(fboIns.getFBOUid(), this.m_fboIndex, RenderMaskBitfield_1.default.COLOR_BUFFER_BIT | RenderMaskBitfield_1.default.DEPTH_BUFFER_BIT, filter, clearType, clearIndex, dataArr);
    }
  }

  blitColorAndDepthFrom(fboIns, filter = RenderFilter_1.default.NEAREST, clearType = -1, clearIndex = 0, dataArr = null) {
    if (this.m_fboIndex >= 0) {
      this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
      this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
      this.m_adapter.blitFBO(fboIns.getFBOUid(), this.m_fboIndex, RenderMaskBitfield_1.default.COLOR_BUFFER_BIT | RenderMaskBitfield_1.default.DEPTH_BUFFER_BIT, filter, clearType, clearIndex, dataArr);
    }
  }

  blitStencilFrom(fboIns, filter = RenderFilter_1.default.NEAREST, clearType = -1, clearIndex = 0, dataArr = null) {
    if (this.m_fboIndex >= 0) {
      this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
      this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
      this.m_adapter.blitFBO(fboIns.getFBOUid(), this.m_fboIndex, RenderMaskBitfield_1.default.STENCIL_BUFFER_BIT, filter, clearType, clearIndex, dataArr);
    }
  }

  renderToTextureAt(i, attachmentIndex = 0) {
    this.m_adapter.setRenderToTexture(this.m_texs[i], this.m_enableDepth, this.m_enableStencil, attachmentIndex);
    this.m_adapter.useFBO(this.m_clearColorBoo, this.m_clearDepthBoo, this.m_clearStencilBoo);
  }

  runBeginDo() {
    if (this.m_runFlag) {
      this.m_runFlag = false;
      this.m_renderProxy.getClearRGBAColor4f(this.m_backBufferColor);

      if (this.m_viewportLock) {
        this.m_adapter.lockViewport();
      } else {
        this.m_adapter.unlockViewport();
      }

      this.m_adapter.bindFBOAt(this.m_fboIndex, this.m_fboType);

      if (this.m_synFBOSizeWithViewport) {
        this.m_adapter.synFBOSizeWithViewport();
        this.m_adapter.setFBOSizeFactorWithViewPort(this.m_fboSizeFactor);
      } else {
        this.m_adapter.asynFBOSizeWithViewport();
      }

      if (this.m_clearDepth < 128.0) {
        this.m_adapter.setClearDepth(this.m_clearDepth);
      }

      this.m_renderProxy.setClearColor(this.m_bgColor);
      let i = 0;

      for (; i < this.m_texsTot; ++i) {
        this.m_adapter.setRenderToTexture(this.m_texs[i], this.m_enableDepth, this.m_enableStencil, i);
      }

      this.m_adapter.useFBO(this.m_clearColorBoo, this.m_clearDepthBoo, this.m_clearStencilBoo);

      if (this.m_gMateiral != null) {
        this.m_rcontext.useGlobalMaterial(this.m_gMateiral, this.m_texUnlock, this.m_tmaterialUniformUpdate);
      } else {
        this.m_rcontext.unlockMaterial();
      }
    }
  }

  run(lockRenderState = false, lockMaterial = false, autoEnd = true, autoRunBegin = true) {
    if (lockRenderState) this.lockRenderState();
    if (lockMaterial && !autoRunBegin) this.lockMaterial();

    if (this.m_fboIndex >= 0) {
      if (autoRunBegin) this.runBeginDo();

      if (this.m_rindexs != null) {
        // rendering running
        for (let i = 0, len = this.m_rindexs.length; i < len; ++i) {
          this.m_renderer.runAt(this.m_rindexs[i]);
        }
      }
    } // this.m_runFlag = true;


    if (lockRenderState) this.unlockRenderState();

    if (lockMaterial) {
      this.unlockMaterial();
    }

    if (autoEnd) {
      this.runEnd();
    }
  }

  runAt(index, autoRunBegin = true) {
    if (this.m_fboIndex >= 0 && this.m_rindexs != null) {
      if (index == 0 && autoRunBegin) {
        this.runBeginDo();
      } else {
        this.m_runFlag = true;
      }

      this.m_renderer.runAt(this.m_rindexs[index]);
    }
  }
  /**
   * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
   * @param entity 需要指定绘制的 IRenderEntity 实例
   * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
   * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
   */


  drawEntity(entity, useGlobalUniform = false, forceUpdateUniform = true) {
    if (!this.m_runFlag) {
      this.m_renderer.drawEntity(entity, useGlobalUniform, forceUpdateUniform);
    }
  }

  runBegin() {
    if (this.m_fboIndex >= 0 && this.m_rindexs != null) {
      this.m_runFlag = true;
      this.runBeginDo();
    }
  }

  runEnd() {
    this.m_renderProxy.setClearColor(this.m_backBufferColor);
    this.m_runFlag = true;

    if (this.m_viewportLock) {
      this.m_adapter.unlockViewport();
    }
  }

  useCamera(camera, syncCamView = false) {
    this.m_renderer.useCamera(camera, syncCamView);
  }

  useMainCamera() {
    this.m_renderer.useMainCamera();
  }

  reset() {
    this.setGlobalMaterial(null);
    let i = 0;

    for (; i < this.m_texsTot; ++i) {
      this.m_texs[i] = null;
    }

    this.m_runFlag = false;
    this.m_fboIndex = -1;
    this.m_texsTot = 0;
    this.m_rindexs = [];
  }

  clone() {
    let ins = new FBOInstance(this.m_renderer, this.m_texStore);
    ins.m_fboSizeFactor = this.m_fboSizeFactor;
    ins.m_bgColor.copyFrom(this.m_bgColor);
    ins.m_fboIndex = this.m_fboIndex;
    ins.m_fboType = this.m_fboType;
    ins.m_clearDepth = this.m_clearDepth;
    ins.m_texsTot = this.m_texsTot;
    ins.m_enableDepth = this.m_enableDepth;
    ins.m_enableStencil = this.m_enableStencil;
    ins.m_synFBOSizeWithViewport = this.m_synFBOSizeWithViewport;
    ins.m_initW = this.m_initW;
    ins.m_initH = this.m_initH;
    ins.m_multisampleLevel = this.m_multisampleLevel;
    let i = 0;

    for (; i < this.m_texsTot; ++i) {
      ins.m_texs[i] = ins.m_texs[i];
    }

    if (this.m_rindexs != null) {
      let len = this.m_rindexs.length;
      let list = new Array(len);

      for (i = 0; i < len; ++i) {
        list[i] = this.m_rindexs[i];
      }

      ins.setRProcessIDList(list);
    }

    return ins;
  }

}

exports.default = FBOInstance;

/***/ }),

/***/ "af68":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RSEntityFlag_1 = __importDefault(__webpack_require__("11e6"));

const Entity3DNode_1 = __importDefault(__webpack_require__("7b0e"));

class EntityNodeQueue {
  constructor() {
    this.m_nodeListLen = 0;
    this.m_nodeIdList = [];
    this.m_nodeList = [];
    this.m_entityList = [];
    this.m_nodeFlagList = [];
    this.m_freeIdList = [];
  }

  getFreeId() {
    if (this.m_freeIdList.length > 0) {
      return this.m_freeIdList.pop();
    }

    return -1;
  }

  createNode() {
    let index = this.getFreeId();

    if (index >= 0) {
      this.m_nodeFlagList[index] = 1;
      return this.m_nodeList[index];
    } else {
      // create a new nodeIndex
      index = this.m_nodeListLen;
      let node = Entity3DNode_1.default.Create();
      this.m_nodeList.push(node);
      this.m_entityList.push(null);
      node.spaceId = index; //node.distanceFlag = false;

      this.m_nodeFlagList.push(1);
      this.m_nodeIdList.push(index);
      this.m_nodeFlagList.push(1);
      this.m_nodeListLen++;
      return node;
    }
  }

  restoreId(id) {
    if (id > 0 && this.m_nodeFlagList[id] == 1) {
      this.m_freeIdList.push(id);
      this.m_nodeFlagList[id] = 0;
      this.m_entityList[id] = null;
    }
  } // 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)


  addEntity(entity) {
    let node = this.createNode();
    this.m_entityList[node.spaceId] = entity;
    node.entity = entity; //node.distanceFlag = RSEntityFlag.TestSortEnabled(entity.__$rseFlag);
    //console.log("Queue node.distanceFlag: ",node.distanceFlag);

    entity.__$rseFlag = RSEntityFlag_1.default.AddSpaceUid(entity.__$rseFlag, node.spaceId);
    return node;
  }

  initialize(total) {
    if (total > 0) {
      for (let i = 0; i < total; i++) {
        let node = this.createNode();
        this.m_entityList[node.spaceId] = null;
      }
    }
  }

  getNodeByEntity(entity) {
    if (RSEntityFlag_1.default.TestSpaceContains(entity.__$rseFlag)) {
      let uid = RSEntityFlag_1.default.GetSpaceUid(entity.__$rseFlag);

      if (this.m_entityList[uid] == entity) {
        return this.m_nodeList[uid];
      }
    }

    return null;
  }

  removeEntity(entity) {
    if (RSEntityFlag_1.default.TestSpaceContains(entity.__$rseFlag)) {
      let uid = RSEntityFlag_1.default.GetSpaceUid(entity.__$rseFlag);

      if (this.m_entityList[uid] == entity) {
        this.m_nodeList[uid].entity = null;
        this.restoreId(uid);
        entity.__$rseFlag = RSEntityFlag_1.default.RemoveSpaceUid(entity.__$rseFlag);
      }
    }
  }

  toString() {
    return "[EntityNodeQueue()]";
  }

}

exports.default = EntityNodeQueue;

/***/ }),

/***/ "b02c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MathConst_1 = __importDefault(__webpack_require__("6e01"));
/**
 * renderer runtime texture resource object
 */


class TextureRenderObj {
  constructor(rcuid, texListHashId) {
    this.m_uid = -1;
    this.m_mid = -1;
    this.m_texTotal = 0; // max texture amount: 8

    this.m_gtexList = null;
    this.m_samplers = null;
    this.m_texList = null; // renderer context uid

    this.m_rcuid = 0;
    this.m_texRes = null; // 是否收集gpu数据直接使用，true表示需要收集

    this.direct = true; // 自身的引用计数器

    this.m_attachCount = 0;
    this.m_rcuid = rcuid;
    this.m_uid = TextureRenderObj.s_uid++;
    this.m_mid = texListHashId;
  }

  __$setParam(rcuid, texListHashId) {
    this.m_rcuid = rcuid;
    this.m_mid = texListHashId;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

  getMid() {
    return this.m_mid;
  }

  getTexTotal() {
    return this.m_texTotal;
  }

  collectTexList(texRes, ptexList, shdTexTotal) {
    this.m_texRes = texRes;
    let i = 0;

    if (this.direct) {
      if (this.m_texTotal < 1 && ptexList.length > 0) {
        let len = MathConst_1.default.GetNearestCeilPow2(ptexList.length);
        this.m_samplers = new Uint16Array(len);
        this.m_gtexList = new Array(len);
        this.m_texList = ptexList;
        let tex;

        while (i < shdTexTotal) {
          tex = ptexList[i];

          tex.__$attachThis();

          tex.__$$upload(texRes);

          this.m_samplers[i] = tex.getSampler();
          this.m_gtexList[i] = this.m_texRes.getGpuBuffer(tex.getResUid());

          this.m_texRes.__$attachRes(tex.getResUid());

          i++;
        }

        this.m_texTotal = i;
      } else {
        this.m_texTotal = 0;
      }
    } else {
      this.m_texTotal = shdTexTotal;
    }

    while (i < ptexList.length) {
      ptexList[i++].__$attachThis();
    }
  } // 注意: 移动端要注意这里的切换机制是符合移动端低带宽的特点


  run() {
    //console.log("this.m_texRes.unlocked: ",this.m_texRes.unlocked,this.m_texRes.texMid != this.m_mid);
    if (this.m_texRes.unlocked && this.m_texRes.texMid != this.m_mid) {
      this.m_texRes.texMid = this.m_mid; //console.log("this.m_mid: ",this.m_mid,this.m_uid, this.m_texList);

      let gl = this.m_texRes.getRC();
      let texI = gl.TEXTURE0;

      if (this.direct) {
        //console.log("this.m_gtexList: ",this.m_gtexList,", total: "+this.m_texTotal);
        for (let i = 0; i < this.m_texTotal; ++i) {
          gl.activeTexture(texI++);
          gl.bindTexture(this.m_samplers[i], this.m_gtexList[i]);
        }
      } else {
        let list = this.m_texList;

        for (let i = 0; i < this.m_texTotal; ++i) {
          gl.activeTexture(texI++);

          list[i].__$$use(this.m_texRes);
        }
      }
    }
  }

  getUid() {
    return this.m_uid;
  }

  __$attachThis() {
    ++this.m_attachCount;
  }

  __$detachThis() {
    --this.m_attachCount; //console.log("TextureRenderObj::__$detachThis() this.m_attachCount: "+this.m_attachCount);

    if (this.m_attachCount < 1) {
      this.m_attachCount = 0; //console.log("TextureRenderObj::__$detachThis() this.m_attachCount value is 0.");

      TextureRenderObj.Restore(this);
    }
  }

  reset() {
    if (this.m_texList != null) {
      for (let i = 0, len = this.m_texList.length; i < len; ++i) {
        this.m_texList[i].__$detachThis();

        this.m_texRes.__$detachRes(this.m_texList[i].getResUid());

        this.m_gtexList[i] = null;
      }
    }

    this.m_texTotal = 0;
    this.m_texList = null;
    this.m_texRes = null;
  }

  toString() {
    return "TextureRenderObj(uid = " + this.m_uid + ", mid=" + this.m_mid + ")";
  }

  static Create(texRes, texList, shdTexTotal) {
    let texTotal = texList.length;

    if (texTotal > 0 && shdTexTotal > 0) {
      if (texTotal < shdTexTotal) {
        throw Error("There are fewer textures than in the shader : (need " + shdTexTotal + ",but only have " + texTotal + ") !!!");
        return null;
      }

      let key = 31;
      let t = 0;
      let direct = true;

      while (t < shdTexTotal) {
        key = key * 131 + texList[t].getUid();

        if (!texList[t].isDirect()) {
          direct = false;
        }

        ++t;
      }

      let rtoMap = TextureRenderObj.s_troMaps[texRes.getRCUid()];
      let tro = null;

      if (rtoMap.has(key)) {
        tro = rtoMap.get(key);
      } else {
        if (TextureRenderObj.s_freeTROList.length < 1) {
          tro = new TextureRenderObj(texRes.getRCUid(), key); //console.log("TextureRenderObj::Create use a new tex mid: " + tro.getMid(),",total: "+shdTexTotal,",key: "+key);
        } else {
          tro = TextureRenderObj.s_freeTROList.pop(); //console.log("TextureRenderObj::Create use an old tex mid: " + tro.getMid(),",total: "+shdTexTotal,",key: "+key);
        }

        tro.collectTexList(texRes, texList, shdTexTotal);
        rtoMap.set(key, tro);
      }

      tro.__$setParam(texRes.getRCUid(), key);

      tro.direct = direct;
      return tro;
    }

    return null;
  }

  static Restore(tro) {
    if (tro.getMid() > -1) {
      //console.log("TextureRenderObj::Restore tro.getMid(): "+tro.getMid());
      TextureRenderObj.s_troMaps[tro.getRCUid()].delete(tro.getMid());

      tro.__$setParam(0, 0);

      TextureRenderObj.s_freeTROList.push(tro);
      tro.reset();
    }
  }

  static GetByMid(rcuid, uid) {
    return TextureRenderObj.s_troMaps[rcuid].get(uid);
  }

}

TextureRenderObj.s_uid = 0;
TextureRenderObj.s_troMaps = [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()];
TextureRenderObj.s_freeTROList = [];
TextureRenderObj.s_unloacked = true;
TextureRenderObj.s_preMid = -1;
exports.TextureRenderObj = TextureRenderObj;

class EmptyTexRenderObj {
  constructor(texRes) {
    this.m_texRes = null;
    this.m_texRes = texRes;
  }

  run() {
    this.m_texRes.renderBegin();
  }

  getMid() {
    return 1;
  }

  __$attachThis() {}

  __$detachThis() {}

}

exports.EmptyTexRenderObj = EmptyTexRenderObj;
exports.default = TextureRenderObj;

/***/ }),

/***/ "b0ef":
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

class RViewElement {
  constructor() {
    this.m_canvas = null;
    this.m_div = null;
    this.m_divW = -1;
    this.m_divH = -1;
    this.resized = true;
  }

  setDiv(div) {
    this.m_div = div;
  }

  createViewEle(pdocument, autoResize) {
    if (this.m_div == null) {
      this.m_div = document.getElementById("voxEngineDiv");
    }

    if (this.m_div == null) {
      this.m_div = pdocument.createElement('div');
      this.m_div.style.width = '400px';
      this.m_div.style.height = '300px';
      document.body.appendChild(this.m_div);
    }

    this.m_div.style.display = 'bolck';
    this.m_div.style.position = 'absolute';

    if (this.m_div.style.left == "") {
      this.m_div.style.left = '0px';
      this.m_div.style.top = '0px';
    }

    if (autoResize) {
      this.m_div.style.width = '100%';
      this.m_div.style.height = '100%';
    }

    if (this.m_canvas == null) {
      this.m_canvas = document.createElement('canvas');
      this.m_div.appendChild(this.m_canvas);
      this.m_canvas.width = 800;
      this.m_canvas.height = 600;
      this.m_canvas.style.display = 'bolck';
      this.m_canvas.style.left = '0px';
      this.m_canvas.style.top = '0px';
      this.m_canvas.style.position = 'absolute';
    }
  }

  setDivStyleLeftAndTop(px, py) {
    this.m_div.style.left = px + "px";
    this.m_div.style.top = py + "px";
  }

  setDivStyleSize(pw, ph) {
    if (this.m_divW != pw || this.m_divH != ph) {
      this.m_div.style.width = pw + "px";
      this.m_div.style.height = ph + "px";
      this.resized = true;
    }
  }

  getDiv() {
    return this.m_div;
  }

  getCanvas() {
    return this.m_canvas;
  }

}

exports.default = RViewElement;

/***/ }),

/***/ "b161":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 整个渲染场景的入口类

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const Stage3D_1 = __importDefault(__webpack_require__("3806"));

const CameraBase_1 = __importDefault(__webpack_require__("c51d"));

const RendererParam_1 = __importDefault(__webpack_require__("c497"));

const EntityNodeQueue_1 = __importDefault(__webpack_require__("af68"));

const Entity3DNodeLinker_1 = __importDefault(__webpack_require__("a80a"));

const RunnableQueue_1 = __importDefault(__webpack_require__("9c4d"));

const RendererInstance_1 = __importDefault(__webpack_require__("d958"));

const TextureBlock_1 = __webpack_require__("5d04");

const RendererSpace_1 = __importDefault(__webpack_require__("a446"));

const RaySelector_1 = __importDefault(__webpack_require__("c711"));

const RayGpuSelector_1 = __importDefault(__webpack_require__("955e"));

const MouseEvt3DController_1 = __importDefault(__webpack_require__("765c"));

const FBOInstance_1 = __importDefault(__webpack_require__("af29"));

const CameraDsistanceSorter_1 = __importDefault(__webpack_require__("d7e2"));

const RendererSubScene_1 = __importDefault(__webpack_require__("70f2"));

const Matrix4Pool_1 = __importDefault(__webpack_require__("2139"));

const ShaderProgramBuilder_1 = __webpack_require__("a156");

const Matrix4_1 = __importDefault(__webpack_require__("18c7"));

class RendererScene {
  constructor() {
    this.m_uid = -1;
    this.m_adapter = null;
    this.m_renderProxy = null;
    this.m_shader = null;
    this.m_rcontext = null;
    this.m_renderer = null;
    this.m_processids = new Uint8Array(128);
    this.m_processidsLen = 0;
    this.m_rspace = null;
    this.m_mouse_rltv = new Vector3D_1.default();
    this.m_mouse_rlpv = new Vector3D_1.default();
    this.m_accessor = null; // event flow control enable

    this.m_evtFlowEnabled = false;
    this.m_evt3DCtr = null;
    this.m_mouseEvtEnabled = true;
    this.m_viewX = 0.0;
    this.m_viewY = 0.0;
    this.m_viewW = 800.0;
    this.m_viewH = 800.0;
    this.m_nodeWaitLinker = null;
    this.m_nodeWaitQueue = null;
    this.m_camDisSorter = null; // recorde renderer sub scenes

    this.m_subscList = [];
    this.m_subscListLen = 0;
    this.m_runFlag = -1;
    this.m_autoRunning = true;
    this.m_processUpdate = false;
    this.m_tickId = -1;
    this.m_rparam = null;
    this.m_enabled = true;
    this.runnableQueue = new RunnableQueue_1.default();
    this.textureBlock = new TextureBlock_1.TextureBlock();
    this.stage3D = null;
    this.materialBlock = null;
    this.entityBlock = null;
    this.m_containers = [];
    this.m_containersTotal = 0;
    this.m_currCamera = null;
    this.m_mouseTestBoo = true;
    this.m_cullingTestBoo = true;
    this.m_rayTestFlag = true;
    this.m_rayTestEnabled = true;
    this.m_uid = RendererScene.s_uid++;
  }

  tickUpdate() {
    if (this.m_tickId > -1) {
      clearTimeout(this.m_tickId);
    }

    this.m_tickId = setTimeout(this.tickUpdate.bind(this), this.m_rparam.getTickUpdateTime());
    this.textureBlock.run();
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

  getUid() {
    return this.m_uid;
  }

  getDiv() {
    return this.m_renderProxy.getDiv();
  }

  getCanvas() {
    return this.m_renderProxy.getCanvas();
  }

  getRPONodeBuilder() {
    return null;
  }

  getRenderProxy() {
    return this.m_renderProxy;
  } // set new view port rectangle area


  setViewPort(px, py, pw, ph) {
    if (this.m_renderProxy != null) {
      this.m_viewX = px;
      this.m_viewY = py;
      this.m_viewW = pw;
      this.m_viewH = ph;
      this.m_renderProxy.setViewPort(px, py, pw, ph);
    }
  }

  setViewPortFromCamera(camera) {
    if (this.m_renderProxy != null && camera != null) {
      this.m_viewX = camera.getViewX();
      this.m_viewY = camera.getViewY();
      this.m_viewW = camera.getViewWidth();
      this.m_viewH = camera.getViewHeight();
      this.m_renderProxy.setViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
    }
  } // apply new view port rectangle area


  reseizeViewPort() {
    this.m_renderProxy.reseizeRCViewPort();
  }

  lockViewport() {
    this.m_adapter.lockViewport();
  }

  unlockViewport() {
    this.m_adapter.unlockViewport();
  }

  getRendererAdapter() {
    return this.m_adapter;
  }

  getRenderer() {
    return this.m_renderer;
  }

  getRendererContext() {
    return this.m_rcontext;
  }

  getStage3D() {
    return this.m_renderProxy.getStage3D();
  }
  /**
   * 获取渲染器可渲染对象管理器状态(版本号)
   */


  getRendererStatus() {
    return this.m_renderer.getRendererStatus();
  }

  getViewWidth() {
    return this.m_renderProxy.getStage3D().viewWidth;
  }

  getViewHeight() {
    return this.m_renderProxy.getStage3D().viewHeight;
  }

  getCamera() {
    return this.m_renderProxy.getCamera();
  }

  asynFBOSizeWithViewport() {
    this.m_rcontext.asynFBOSizeWithViewport();
  }

  synFBOSizeWithViewport() {
    this.m_rcontext.synFBOSizeWithViewport();
  }

  cameraLock() {
    this.m_renderProxy.cameraLock();
  }

  cameraUnlock() {
    this.m_renderProxy.cameraUnlock();
  }

  getMouseXYWorldRay(rl_position, rl_tv) {
    this.m_renderProxy.getMouseXYWorldRay(rl_position, rl_tv);
  }

  createCamera() {
    return new CameraBase_1.default();
  }

  createFBOInstance() {
    return new FBOInstance_1.default(this, this.textureBlock.getRTTStrore());
  }

  createMatrix4() {
    return new Matrix4_1.default();
  }

  setClearUint24Color(colorUint24, alpha = 1.0) {
    this.m_renderProxy.setClearUint24Color(colorUint24, alpha);
  }

  setClearRGBColor3f(pr, pg, pb) {
    this.m_renderProxy.setClearRGBColor3f(pr, pg, pb);
  }

  setClearRGBAColor4f(pr, pg, pb, pa) {
    this.m_renderProxy.setClearRGBAColor4f(pr, pg, pb, pa);
  }

  setClearColor(color) {
    this.m_renderProxy.setClearRGBAColor4f(color.r, color.g, color.b, color.a);
  }

  setRenderToBackBuffer() {
    this.m_rcontext.setRenderToBackBuffer();
  }

  drawBackBufferToCanvas(dstCanvas) {
    let srcCanvas = this.getCanvas();
    var ctx = dstCanvas.getContext("2d");
    ctx.drawImage(srcCanvas, 0, 0, dstCanvas.width, dstCanvas.height);
  }

  updateRenderBufferSize() {
    this.m_adapter.updateRenderBufferSize();
  }

  setEvt3DController(evt3DCtr) {
    if (evt3DCtr != null) {
      evt3DCtr.initialize(this.getStage3D(), this.getStage3D());
      evt3DCtr.setRaySelector(this.m_rspace.getRaySelector());
    }

    this.m_evt3DCtr = evt3DCtr;
  }

  isRayPickSelected() {
    return this.m_evt3DCtr != null && this.m_evt3DCtr.isSelected();
  }

  enableMouseEvent(gpuTestEnabled = true) {
    if (this.m_evt3DCtr == null) {
      if (gpuTestEnabled) {
        this.m_rspace.setRaySelector(new RayGpuSelector_1.default());
      } else {
        this.m_rspace.setRaySelector(new RaySelector_1.default());
      }

      this.setEvt3DController(new MouseEvt3DController_1.default());
    }

    this.m_mouseEvtEnabled = true;
  }

  disableMouseEvent() {
    this.m_mouseEvtEnabled = false;
  }

  getEvt3DController() {
    return this.m_evt3DCtr;
  }

  getSpace() {
    return this.m_rspace;
  }

  getDevicePixelRatio() {
    return this.m_adapter.getDevicePixelRatio();
  }
  /**
   * very important renderer scene system function
   */


  createSubScene() {
    if (this.m_renderer != null) {
      let subsc = new RendererSubScene_1.default(this, this.m_renderer, this.m_evtFlowEnabled);
      this.m_subscList.push(subsc);
      this.m_subscListLen++;
      let sc = subsc;
      sc.textureBlock = this.textureBlock;
      return subsc;
    }

    return null;
  }

  addEventListener(type, target, func, captureEnabled = true, bubbleEnabled = false) {
    this.stage3D.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
  }

  removeEventListener(type, target, func) {
    this.stage3D.removeEventListener(type, target, func);
  }

  setAccessor(accessor) {
    this.m_accessor = accessor;
  }

  initialize(rparam = null, renderProcessesTotal = 3) {
    if (this.m_renderer == null) {
      if (rparam == null) rparam = new RendererParam_1.default();
      this.m_rparam = rparam;
      let selfT = this;
      selfT.stage3D = new Stage3D_1.default(this.getUid(), document);

      if (renderProcessesTotal < 1) {
        renderProcessesTotal = 1;
      }

      if (renderProcessesTotal > 8) {
        renderProcessesTotal = 8;
      }

      this.m_evtFlowEnabled = rparam.evtFlowEnabled;
      this.m_renderer = new RendererInstance_1.default();

      this.m_renderer.__$setStage3D(this.stage3D);

      Matrix4Pool_1.default.Allocate(rparam.getMatrix4AllocateSize());
      let camera = new CameraBase_1.default();
      this.m_renderer.initialize(rparam, camera, new ShaderProgramBuilder_1.ShaderProgramBuilder(this.m_renderer.getRCUid()));
      this.m_processids[0] = 0;
      this.m_processidsLen++;
      let process = null;

      for (; renderProcessesTotal >= 0;) {
        process = this.m_renderer.appendProcess(rparam.batchEnabled, rparam.processFixedState);
        this.m_processids[this.m_processidsLen] = process.getRPIndex();
        this.m_processidsLen++;
        --renderProcessesTotal;
      }

      this.m_rcontext = this.m_renderer.getRendererContext();
      this.m_renderProxy = this.m_rcontext.getRenderProxy();
      this.m_adapter = this.m_renderProxy.getRenderAdapter();
      let stage3D = this.m_renderProxy.getStage3D();
      this.m_viewW = stage3D.stageWidth;
      this.m_viewH = stage3D.stageHeight;
      this.m_shader = this.m_renderer.getDataBuilder().getRenderShader();
      this.textureBlock.setRenderer(this.m_renderProxy);
      this.m_camDisSorter = new CameraDsistanceSorter_1.default(this.m_renderProxy);

      if (this.m_rspace == null) {
        let space = new RendererSpace_1.default();
        space.initialize(this.m_renderer, this.m_renderProxy.getCamera());
        this.m_rspace = space;
      }

      this.tickUpdate();
    }
  }

  setRendererProcessParam(index, batchEnabled, processFixedState) {
    this.m_renderer.setRendererProcessParam(this.m_processids[index], batchEnabled, processFixedState);
  }

  appendARendererProcess(batchEnabled = true, processFixedState = false) {
    let process = this.m_renderer.appendProcess(batchEnabled, processFixedState);
    this.m_processids[this.m_processidsLen] = process.getRPIndex();
    this.m_processidsLen++;
  }
  /**
   * get the renderer process by process index
   * @param processIndex IRenderProcess instance index in renderer scene instance
   */


  getRenderProcessAt(processIndex) {
    return this.m_renderer.getProcessAt(this.m_processids[processIndex]);
  }

  addContainer(container, processIndex = 0) {
    if (processIndex < 0) {
      processIndex = 0;
    }

    if (container != null && container.__$wuid < 0 && container.__$contId < 1) {
      let i = 0;

      for (; i < this.m_containersTotal; ++i) {
        if (this.m_containers[i] == container) {
          return;
        }
      }

      if (i >= this.m_containersTotal) {
        container.__$wuid = this.m_uid;
        container.wprocuid = processIndex;

        container.__$setRenderer(this);

        this.m_containers.push(container);
        this.m_containersTotal++;
      }
    }
  }

  removeContainer(container) {
    if (container != null && container.__$wuid == this.m_uid && container.getRenderer() == this.m_renderer) {
      let i = 0;

      for (; i < this.m_containersTotal; ++i) {
        if (this.m_containers[i] == container) {
          container.__$wuid = -1;
          container.wprocuid = -1;

          container.__$setRenderer(null);

          this.m_containers.splice(i, 1);
          --this.m_containersTotal;
          break;
        }
      }
    }
  }

  setAutoRunningEnabled(autoRunning) {
    this.m_autoRunning = autoRunning;
  }

  setAutoRenderingSort(sortEnabled) {
    this.m_processUpdate = sortEnabled;
  }

  setProcessSortEnabledAt(processIndex, sortEnabled, sorter = null) {
    this.m_renderer.setProcessSortEnabledAt(processIndex, sortEnabled);

    if (sortEnabled) {
      let process = this.m_renderer.getProcessAt(processIndex);
      sorter = sorter != null ? sorter : this.m_camDisSorter;

      if (process != null) {
        process.setSorter(sorter);
      }
    }
  }

  setProcessSortEnabled(process, sortEnabled, sorter = null) {
    this.m_renderer.setProcessSortEnabled(process, sortEnabled);

    if (sortEnabled && process != null && !process.hasSorter()) {
      sorter = sorter != null ? sorter : this.m_camDisSorter;
      process.setSorter(sorter);
    }
  }
  /**
   * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
   * move rendering runtime displayEntity to different renderer process
   */


  moveEntityTo(entity, processindex) {
    this.m_renderer.moveEntityToProcessAt(entity, this.m_processids[processindex]);
  }
  /**
   * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
   * @param entity 需要指定绘制的 IRenderEntity 实例
   * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
   * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
   */


  drawEntity(entity, useGlobalUniform = false, forceUpdateUniform = true) {
    this.m_renderer.drawEntity(entity, useGlobalUniform, forceUpdateUniform);
  }
  /**
   * add an entity to the renderer process of the renderer instance
   * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
   * @param processid this destination renderer process id
   * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
   */


  addEntity(entity, processid = 0, deferred = true) {
    if (entity != null && entity.__$testSpaceEnabled()) {
      if (entity.isPolyhedral()) {
        if (entity.hasMesh()) {
          this.m_renderer.addEntity(entity, this.m_processids[processid], deferred);

          if (this.m_rspace != null) {
            this.m_rspace.addEntity(entity);
          }
        } else {
          // 这里的等待队列可能会和加入容器的操作冲突
          // wait queue
          if (this.m_nodeWaitLinker == null) {
            this.m_nodeWaitLinker = new Entity3DNodeLinker_1.default();
            this.m_nodeWaitQueue = new EntityNodeQueue_1.default();
          }

          let node = this.m_nodeWaitQueue.addEntity(entity);
          node.rstatus = processid;
          this.m_nodeWaitLinker.addNode(node);
        }
      } else {
        this.m_renderer.addEntity(entity, this.m_processids[processid], deferred);

        if (this.m_rspace != null) {
          this.m_rspace.addEntity(entity);
        }
      }
    }
  }
  /**
   * remove an entity from the rendererinstance
   * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
   */


  removeEntity(entity) {
    if (entity != null) {
      let node = null;

      if (this.m_nodeWaitLinker != null) {
        let node = this.m_nodeWaitQueue.getNodeByEntity(entity);

        if (node != null) {
          this.m_nodeWaitLinker.removeNode(node);
          this.m_nodeWaitQueue.removeEntity(entity);
        }
      }

      if (node == null) {
        this.m_renderer.removeEntity(entity);

        if (this.m_rspace != null) {
          this.m_rspace.removeEntity(entity);
        }
      }
    }
  }

  updateMaterialUniformToCurrentShd(material) {
    this.m_renderer.updateMaterialUniformToCurrentShd(material);
  }

  showInfoAt(index) {
    this.m_renderer.showInfoAt(index);
  }

  getRenderUnitsTotal() {
    return this.m_renderer.getRenderUnitsTotal();
  }

  useCamera(camera, syncCamView = false) {
    this.m_currCamera = camera;

    if (syncCamView) {
      this.m_renderProxy.setRCViewPort(camera.getViewX(), camera.getViewY(), camera.getViewWidth(), camera.getViewHeight(), true);
      this.m_renderProxy.reseizeRCViewPort();
    }

    camera.update();
    this.m_rcontext.resetUniform();
    this.m_renderProxy.updateCameraDataFromCamera(camera);
  }

  useMainCamera() {
    this.m_currCamera = null;
    let camera = this.m_renderProxy.getCamera();
    this.m_renderProxy.setRCViewPort(camera.getViewX(), camera.getViewY(), camera.getViewWidth(), camera.getViewHeight(), true);
    this.m_renderProxy.reseizeRCViewPort();
    this.m_renderProxy.updateCamera();
    this.m_rcontext.resetUniform();
    this.m_renderProxy.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
  }

  updateCameraDataFromCamera(camera) {
    this.m_renderProxy.updateCameraDataFromCamera(camera);
  }
  /**
   * reset renderer rendering state
   */


  resetState() {
    this.m_rcontext.resetState();
  }
  /**
   * reset render shader uniform location
   */


  resetUniform() {
    this.m_rcontext.resetUniform();
  }

  enableSynViewAndStage() {
    this.m_renderProxy.enableSynViewAndStage();
  }
  /**
   * the function only resets the renderer instance rendering status.
   * you should use it before the run or runAt function is called.
   */


  renderBegin(contextBeginEnabled = true) {
    if (this.m_currCamera == null) {
      this.m_adapter.unlockViewport();

      if (this.m_renderProxy.isAutoSynViewAndStage()) {
        let boo = this.m_renderProxy.testViewPortChanged(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
        this.m_viewX = this.m_renderProxy.getViewX();
        this.m_viewY = this.m_renderProxy.getViewY();
        this.m_viewW = this.m_renderProxy.getViewWidth();
        this.m_viewH = this.m_renderProxy.getViewHeight();

        if (boo) {
          this.m_renderProxy.setRCViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH, true);
          this.m_renderProxy.reseizeRCViewPort();
        }
      } else {
        this.m_renderProxy.setViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
      }

      this.m_renderProxy.updateCamera();
      this.m_renderProxy.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
    }

    this.m_shader.renderBegin();

    if (contextBeginEnabled) {
      this.m_rcontext.renderBegin(this.m_currCamera == null);
    }

    this.m_currCamera = null;

    if (this.m_accessor != null) {
      this.m_accessor.renderBegin(this);
    }
  }
  /**
   * the function resets the renderer scene status.
   * you should use it on the frame starting time.
   */


  runBegin(autoCycle = true, contextBeginEnabled = true) {
    if (autoCycle && this.m_autoRunning) {
      if (this.m_runFlag >= 0) this.runEnd();
      this.m_runFlag = 0;
    }

    let cam = this.m_currCamera;
    let camFlag = cam == null;
    this.renderBegin(contextBeginEnabled);

    if (this.m_rspace != null) {
      this.m_rspace.setCamera(camFlag ? this.m_renderProxy.getCamera() : cam);
      this.m_rspace.runBegin();
    }
  }

  renderContextBegin() {
    this.m_rcontext.renderBegin();
  }

  setRayTestEanbled(enabled) {
    this.m_rayTestEnabled = enabled;
  } // @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
  // @param       status: 1(default process),1(deselect ray pick target)
  // @return      1 is send evt yes,0 is send evt no,-1 is event nothing


  runMouseTest(evtFlowPhase, status) {
    let flag = -1;

    if (this.m_evt3DCtr != null && this.m_mouseEvtEnabled) {
      if (this.m_rayTestFlag && this.m_evt3DCtr.getEvtType() > 0) {
        // 是否对已经获得的拾取列表做进一步的gpu拾取
        let selector = this.m_rspace.getRaySelector();

        if (selector != null) {
          if (this.m_rayTestEnabled) {
            this.mouseRayTest();
          } else {
            selector.clear();
          } // 如果有gpu拾取则进入这个管理器, 这个管理器得到最终的拾取结果再和前面的计算结果做比较


          let total = selector.getSelectedNodesTotal();

          if (total > 1) {
            let i = 0;
            let list = selector.getSelectedNodes();
            let node = null;

            for (; i < total; ++i) {
              node = list[i];

              if (node.entity.isPolyhedral()) {//this.m_renderer.drawEntityByLockMaterial(node.entity);
              }
            }
          }
        }

        this.m_rayTestFlag = false;
      }

      flag = this.m_evt3DCtr.run(evtFlowPhase, status);
    }

    this.m_mouseTestBoo = false;
    return flag;
  }
  /**
   * update all data or status of the renderer runtime
   * should call this function per frame
   */


  update(autoCycle = true, mouseEventEnabled = true) {
    this.stage3D.enterFrame();

    if (autoCycle && this.m_autoRunning) {
      if (this.m_runFlag != 0) this.runBegin();
      this.m_runFlag = 1;
    } // camera visible test, ray cast test, Occlusion Culling test


    this.m_mouseTestBoo = true;
    this.m_cullingTestBoo = true;
    this.m_rayTestFlag = true; // wait mesh data ready to finish

    if (this.m_nodeWaitLinker != null) {
      let nextNode = this.m_nodeWaitLinker.getBegin();

      if (nextNode != null) {
        let pnode;
        let entity;
        let status;

        while (nextNode != null) {
          if (nextNode.entity.hasMesh()) {
            pnode = nextNode;
            nextNode = nextNode.next;
            entity = pnode.entity;
            status = pnode.rstatus;
            this.m_nodeWaitLinker.removeNode(pnode);
            this.m_nodeWaitQueue.removeEntity(pnode.entity); //console.log("RenderScene::update(), ready a mesh data that was finished.");

            this.addEntity(entity, status);
          } else {
            nextNode = nextNode.next;
          }
        }
      }
    }

    let i = 0;

    for (; i < this.m_containersTotal; ++i) {
      this.m_containers[i].update();
    }

    this.m_renderer.update(); // space update

    if (this.m_rspace != null) {
      this.m_rspace.update();

      if (this.m_cullingTestBoo) {
        if (this.m_evt3DCtr != null || this.m_processUpdate || this.m_rspace.getRaySelector() != null) {
          this.m_rspace.run();
        }
      }
    }

    if (this.m_processUpdate) {
      this.m_renderer.updateAllProcess();
    }

    if (this.m_mouseTestBoo && !this.m_evtFlowEnabled) {
      if (mouseEventEnabled) {
        this.runMouseTest(1, 0);
      } else if (this.m_evt3DCtr != null) {
        this.m_evt3DCtr.mouseOutEventTarget();
      }
    }
  } // 运行渲染可见性裁剪测试，射线检测等空间管理机制


  cullingTest() {
    if (this.m_rspace != null) {
      this.m_rspace.run();
    }

    this.m_cullingTestBoo = false;
  } // 鼠标位置的射线拾取测试


  mouseRayTest() {
    if (this.m_rspace != null) {
      this.m_renderProxy.getMouseXYWorldRay(this.m_mouse_rlpv, this.m_mouse_rltv);
      this.m_rspace.rayTest(this.m_mouse_rlpv, this.m_mouse_rltv);
    }
  }
  /**
   * run all renderer processes in the renderer instance
   */


  run(autoCycle = true) {
    if (this.m_enabled) {
      if (autoCycle && this.m_autoRunning) {
        if (this.m_runFlag != 1) this.update();
        this.m_runFlag = 2;
      }

      this.runnableQueue.run();

      if (this.m_subscListLen > 0) {
        for (let i = 0; i < this.m_processidsLen; ++i) {
          this.m_renderer.runAt(this.m_processids[i]);
        }
      } else {
        this.m_renderer.run();
      }

      if (autoCycle) {
        this.runEnd();
      }
    }
  }
  /**
   * run the specific renderer process by its index in the renderer instance
   * @param index the renderer process index in the renderer instance
   */


  runAt(index) {
    if (this.m_enabled) {
      this.m_renderer.runAt(this.m_processids[index]);
    }
  }

  runEnd() {
    if (this.m_evt3DCtr != null) {
      this.m_evt3DCtr.runEnd();
    }

    this.m_rcontext.runEnd();

    if (this.m_rspace != null) {
      this.m_rspace.runEnd();
    }

    if (this.m_autoRunning) {
      this.m_runFlag = -1;
    }

    if (this.m_accessor != null) {
      this.m_accessor.renderEnd(this);
    }
  }

  renderFlush() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.flush();
    }
  }

  updateCamera() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.updateCamera();
    }
  }

  toString() {
    return "[RendererScene(uid = " + this.m_uid + ")]";
  }

}

RendererScene.s_uid = 0;
exports.default = RendererScene;

/***/ }),

/***/ "b30a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MaterialConst_1 = __importDefault(__webpack_require__("644c"));
/**
 * 作为渲染器运行时 material shader 资源的管理类
 * renderer runtime material shader resource manager
 */


class RenderShader {
  constructor(rcuid, gl, adapter, shdProgramBuilder) {
    this.m_sharedUniformList = [];
    this.m_unlocked = true;
    this.m_texUnlocked = false;
    this.m_preuid = -1;
    this.m_currShd = null;
    this.m_fragOutputTotal = 1;
    this.m_rcuid = -1;
    this.m_rc = null;
    this.m_gpuProgram = null;
    this.m_adapter = null;
    this.m_guniform = null; // material相关的uniform,默认不包括transform相关的信息

    this.m_uniform = null; // 只有transform相关的信息uniform

    this.m_transformUniform = null;
    this.m_shdProgramBuilder = null; // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合

    this.drawFlag = -1;
    this.__$globalUniform = null;
    this.m_rcuid = rcuid;
    this.m_rc = gl;
    this.m_adapter = adapter;
    this.m_shdProgramBuilder = shdProgramBuilder;
  }

  createResByParams3(resUid, param0, param1, param2) {
    return false;
  }
  /**
   * @returns return system gpu context
   */


  getRC() {
    return this.m_rc;
  }
  /**
   * @returns return current gpu shader  program
   */


  getGPUProgram() {
    return this.m_gpuProgram;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

  useTransUniform(transUniform) {
    if (this.m_transformUniform != transUniform) {
      this.m_transformUniform = transUniform;
      transUniform.use(this);
    }
  }

  useUniform(uniform) {
    if (this.m_uniform != uniform) {
      this.m_uniform = uniform;
      uniform.use(this);
    }
  }

  updateUniform(uniform) {
    if (uniform != null) {
      uniform.use(this);
    }
  }

  unlock() {
    this.m_unlocked = true;
    this.__$globalUniform = null;
  }

  isUnLocked() {
    return this.m_unlocked;
  }

  lock() {
    this.m_unlocked = false;
  }

  textureUnlock() {
    this.m_texUnlocked = true;
  }

  isTextureUnLocked() {
    return this.m_texUnlocked;
  }

  textureLock() {
    this.m_texUnlocked = false;
  }

  setSharedUniformByShd(shd, uniform) {
    this.m_sharedUniformList[shd.getUid()] = uniform;
  }

  getSharedUniformByShd(shd) {
    return this.m_sharedUniformList[shd.getUid()];
  }

  getCurrFragOutputTotal() {
    return this.m_fragOutputTotal;
  }
  /**
   * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
   * @param resUid renderer runtime resource unique id
   * @returns has or has not resource by unique id
   */


  hasResUid(resUid) {
    // return this.m_shdList[resUid] != null;
    return this.m_shdProgramBuilder.hasUid(resUid);
  }
  /**
   * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
   * @param resUid renderer runtime resource unique id
   */


  bindToGpu(resUid) {
    //if (this.m_unlocked && resUid > -1 && resUid < this.m_shdListLen) {
    if (this.m_unlocked && this.m_shdProgramBuilder.containsUid(resUid)) {
      if (this.m_preuid != resUid) {
        this.m_preuid = resUid; //let shd: IShdProgram = this.m_shdList[resUid];

        let shd = this.m_shdProgramBuilder.findShdProgramByUid(resUid);
        this.m_fragOutputTotal = shd.getFragOutputTotal();

        if (this.m_fragOutputTotal != this.getActiveAttachmentTotal()) {
          //if(RendererDevice.SHOWLOG_ENABLED) {
          console.log("shd.getUniqueShaderName(): string: " + shd.getUniqueShaderName());
          console.log("this.m_fragOutputTotal: " + this.m_fragOutputTotal + ", rc.getActiveAttachmentTotal(): " + this.getActiveAttachmentTotal());
          console.error("Error: MRT output amount is not equal to current shader( " + shd.toString() + " ) frag shader output amount !!!"); //}
        }

        this.m_gpuProgram = shd.getGPUProgram();
        this.m_rc.useProgram(this.m_gpuProgram);
        shd.useTexLocation(); //console.log("use a new shader uid: ",shd.getUid(),",uns: ",shd.getUniqueShaderName());
        // use global shared uniform

        let uniform = this.m_sharedUniformList[shd.getUid()]; //  let boo: boolean = false;
        //  if((uniform as any).uns == "u_projMat") {
        //      console.log("only use projMat begin");
        //      boo = true;
        //  }

        this.m_guniform = uniform;

        while (uniform != null) {
          uniform.use(this);
          uniform = uniform.next;
        }

        this.m_currShd = shd; //  if( boo ) {
        //      console.log("only use projMat end");
        //  }
      } else if (this.m_guniform == null && this.m_currShd != null) {
        let uniform = this.m_sharedUniformList[this.m_currShd.getUid()];
        this.m_guniform = uniform;

        while (uniform != null) {
          uniform.use(this);
          uniform = uniform.next;
        }
      }
    }
  }
  /**
   * get system gpu context resource buf
   * @param resUid renderer runtime resource unique id
   * @returns system gpu context resource buf
   */


  getGpuBuffer(resUid) {
    return null;
  }

  getCurrentShd() {
    return this.m_currShd;
  }

  getCurrentShdUid() {
    return this.m_preuid;
  }

  resetUniform() {
    this.m_uniform = null;
    this.m_transformUniform = null;
    this.m_guniform = null;
  }
  /**
   * frame begin run this function
   */


  renderBegin() {
    this.m_fragOutputTotal = 1;
    this.m_preuid = -1;
    this.m_currShd = null;
    this.drawFlag = -1; //this.resetUniform();
  }
  /**
   * frame update
   */


  update() {}

  destroy() {
    this.m_rc = null;
    this.m_adapter = null;
  }

  useUniformToCurrentShd(uniform) {
    if (this.m_uniform != uniform) {
      this.m_uniform != uniform;
      uniform.useByShd(this, this.m_currShd);
    }
  }

  useUniform2ToCurrentShd(uniform, transUniform) {
    if (this.m_uniform != uniform) {
      this.m_uniform != uniform;
      uniform.useByShd(this, this.m_currShd);
    }

    if (this.m_transformUniform != transUniform) {
      this.m_transformUniform != transUniform;
      transUniform.useByShd(this, this.m_currShd);
    }
  }
  /**
   * 仅仅更新单个matrix4的uniforms数据
  */


  useUniformMat4(ult, mat4f32Arr) {
    this.m_rc.uniformMatrix4fv(ult, false, mat4f32Arr);
  }

  useUniformV2(ult, type, f32Arr, dataSize, offset) {
    switch (type) {
      case MaterialConst_1.default.SHADER_MAT4:
        this.m_rc.uniformMatrix4fv(ult, false, f32Arr, offset, dataSize * 16);
        break;

      case MaterialConst_1.default.SHADER_MAT3:
        this.m_rc.uniformMatrix3fv(ult, false, f32Arr, 0, dataSize * 9);
        break;

      case MaterialConst_1.default.SHADER_VEC4FV:
        //console.log("MaterialConst.SHADER_VEC4FV dataSize: ",dataSize);
        //console.log(f32Arr);
        this.m_rc.uniform4fv(ult, f32Arr, offset, dataSize * 4);
        break;

      case MaterialConst_1.default.SHADER_VEC3FV:
        this.m_rc.uniform3fv(ult, f32Arr, offset, dataSize * 3);
        break;

      case MaterialConst_1.default.SHADER_VEC4:
        this.m_rc.uniform4f(ult, f32Arr[0], f32Arr[1], f32Arr[2], f32Arr[3]);
        break;

      case MaterialConst_1.default.SHADER_VEC3:
        this.m_rc.uniform3f(ult, f32Arr[0], f32Arr[1], f32Arr[2]);
        break;

      case MaterialConst_1.default.SHADER_VEC2:
        this.m_rc.uniform2f(ult, f32Arr[0], f32Arr[1]);
        break;

      default:
        break;
    }
  }

  useUniformV1(ult, type, f32Arr, dataSize) {
    switch (type) {
      case MaterialConst_1.default.SHADER_MAT4:
        this.m_rc.uniformMatrix4fv(ult, false, f32Arr);
        break;

      case MaterialConst_1.default.SHADER_MAT3:
        this.m_rc.uniformMatrix3fv(ult, false, f32Arr);
        break;

      case MaterialConst_1.default.SHADER_VEC4FV:
        this.m_rc.uniform4fv(ult, f32Arr, dataSize * 4);
        break;

      case MaterialConst_1.default.SHADER_VEC3FV:
        this.m_rc.uniform3fv(ult, f32Arr, dataSize * 3);
        break;

      case MaterialConst_1.default.SHADER_VEC4:
        this.m_rc.uniform4f(ult, f32Arr[0], f32Arr[1], f32Arr[2], f32Arr[3]);
        break;

      case MaterialConst_1.default.SHADER_VEC3:
        this.m_rc.uniform3f(ult, f32Arr[0], f32Arr[1], f32Arr[2]);
        break;

      case MaterialConst_1.default.SHADER_VEC2:
        this.m_rc.uniform2f(ult, f32Arr[0], f32Arr[1]);
        break;

      default:
        break;
    }
  }

  getActiveAttachmentTotal() {
    return this.m_adapter.getActiveAttachmentTotal();
  }

}

exports.default = RenderShader;

/***/ }),

/***/ "b3bd":
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

class ShaderUniformData {
  constructor() {
    this.uns = "";
    this.types = null;
    this.uniformSize = 0;
    this.uniformNameList = null;
    this.locations = null;
    this.dataList = null;
    this.calcModels = null;
    this.always = true;
    this.next = null;
  } // for fast data's operation


  getDataRefFromUniformName(ns) {
    if (this.uniformNameList != null) {
      let list = this.uniformNameList;
      let len = list.length;

      for (let i = 0; i < len; ++i) {
        if (ns == list[i]) {
          return this.dataList[i];
        }
      }
    }

    return null;
  } // for fast data's operation


  setDataRefFromUniformName(ns, dataRef) {
    if (this.uniformNameList != null) {
      let list = this.uniformNameList;
      let len = list.length;

      for (let i = 0; i < len; ++i) {
        if (ns == list[i]) {
          this.dataList[i] = dataRef;
          break;
        }
      }
    }
  } //


  copyDataFromProbe(probe) {
    this.types = [];

    for (let i = 0; i < probe.uniformsTotal; ++i) {
      this.types.push(probe.uniformTypes[i]);
    }

    this.uniformSize = probe.uniformsTotal;
  }

  destroy() {
    let i = 0;
    let len = this.dataList.length;

    for (; i < len; ++i) {
      this.dataList[i] = null;
    }

    if (this.calcModels != null) {
      len = this.calcModels.length;

      for (i = 0; i < len; ++i) {
        this.calcModels[i].destroy();
        this.calcModels[i] = null;
      }
    }

    this.dataList = null;
    this.types = null;
    this.locations = null;
    this.calcModels = null;
  }

}

exports.default = ShaderUniformData;

/***/ }),

/***/ "baae":
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

class FrameBufferType {}

FrameBufferType.FRAMEBUFFER = 71;
FrameBufferType.DRAW_FRAMEBUFFER = 72;
FrameBufferType.READ_FRAMEBUFFER = 73;
exports.default = FrameBufferType;

/***/ }),

/***/ "badb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MouseEvent_1 = __importDefault(__webpack_require__("1710"));

const EvtNode_1 = __importDefault(__webpack_require__("ee5a"));

class MouseEvt3DDispatcher {
  constructor() {
    this.m_evtNodes = null;
    this.m_evtNodesLen = 18;
    this.uuid = "";
    this.data = null;
    this.m_evtNodesLen = MouseEvent_1.default.GetMouseEvtTypeValuesTotal();
    this.m_evtNodes = new Array(this.m_evtNodesLen);
  }

  getClassType() {
    return MouseEvent_1.default.EventClassType;
  }

  destroy() {
    for (let i = 0; i < this.m_evtNodesLen; ++i) {
      if (this.m_evtNodes[i] != null) {
        this.m_evtNodes[i].destroy();
      }
    }
  } // @return      1 is send evt yes,0 is send evt no


  dispatchEvt(evt) {
    if (evt != null) {
      if (this.uuid != "") evt.uuid = this.uuid;
      if (this.data != null) evt.data = this.data;
      let t = evt.type - MouseEvent_1.default.GetMouseEvtTypeValueBase();

      if (t >= 0 && t < MouseEvent_1.default.GetMouseEvtTypeValuesTotal()) {
        if (this.m_evtNodes[t] != null) return this.m_evtNodes[t].dispatch(evt);
      } else {
        console.log("MouseEvt3DDispatcher::dispatchEvt(), Warn: undefined Event type.");
      }
    }

    return 0;
  } //@return if the evt can be dispatched in this node,it returns 1,otherwise it returns 0


  passTestEvt(evt) {
    if (evt != null) {
      let t = evt.type - MouseEvent_1.default.GetMouseEvtTypeValueBase();

      if (t >= 0 && t < MouseEvent_1.default.GetMouseEvtTypeValuesTotal()) {
        return this.m_evtNodes[t].passTestEvt(evt);
      }
    }

    return 0;
  } //@return if the evt phase is in this node,it returns 1,otherwise it returns 0


  passTestPhase(phase) {
    let len = MouseEvent_1.default.GetMouseEvtTypeValuesTotal();

    for (let i = 0; i < len; ++i) {
      if (this.m_evtNodes[i] != null && this.m_evtNodes[i].passTestPhase(phase) == 1) {
        return 1;
      }
    }

    return 0;
  }

  addEventListener(type, target, func, captureEnabled = true, bubbleEnabled = false) {
    if (func != null && target != null) {
      let t = type - MouseEvent_1.default.GetMouseEvtTypeValueBase();

      if (t >= 0 && t < MouseEvent_1.default.GetMouseEvtTypeValuesTotal()) {
        //(capture phase),2(bubble phase)
        let phase = 0;

        if (captureEnabled != bubbleEnabled) {
          if (captureEnabled) {
            phase = 1;
          } else {
            phase = 2;
          }
        }

        if (this.m_evtNodes[t] != null) {
          this.m_evtNodes[t].addListener(target, func, phase);
        } else {
          this.m_evtNodes[t] = new EvtNode_1.default();
          this.m_evtNodes[t].addListener(target, func, phase);
        }
      } else {
        console.log("MouseEvt3DDispatcher::addEventListener(), Warn: undefined Event type.");
      }
    }
  }

  removeEventListener(type, target, func) {
    if (func != null && target != null) {
      let t = type - MouseEvent_1.default.GetMouseEvtTypeValueBase();

      if (t >= 0 && t < MouseEvent_1.default.GetMouseEvtTypeValuesTotal()) {
        if (this.m_evtNodes[t] != null) {
          this.m_evtNodes[t].removeListener(target, func);
        }
      } //  else
      //  {
      //      console.log("MouseEvt3DDispatcher::removeEventListener(), Warn: undefined Event type.");
      //  }

    }
  }

}

exports.default = MouseEvt3DDispatcher;

/***/ }),

/***/ "bbf4":
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

class RendererConst {}

RendererConst.CAMERA_VISIBLE_ENABLE = 0;
RendererConst.CAMERA_VISIBLE_DISABLE = 1;
exports.default = RendererConst;

/***/ }),

/***/ "bcac":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

class CameraDragSwinger {
  constructor() {
    this.m_stage3D = null;
    this.m_camera = null;
    this.m_mouseX = 0.0;
    this.m_mouseY = 0.0;
    this.m_enabled = false;
    this.m_rotationSpeed = 0.0;
    this.m_aotuRotationDelay = 100.0;
    this.autoRotationEnabled = false;
    this.autoRotationSpeed = 0.2;
    this.rotationAttenuationEnabled = false;
    this.rotationSpeed = 0.2;
  }

  initialize(stage3D, camera) {
    if (this.m_stage3D == null) {
      this.m_stage3D = stage3D;
      this.m_camera = camera;
    }
  }

  attach() {
    this.m_mouseX = this.m_stage3D.mouseX;
    this.m_mouseY = this.m_stage3D.mouseY;
    this.m_enabled = true;
    this.m_aotuRotationDelay = 100;
  }

  detach() {
    this.m_enabled = false;
  }

  runWithYAxis() {
    if (this.m_enabled) {
      let dx = this.m_mouseX - this.m_stage3D.mouseX;
      let dy = this.m_mouseY - this.m_stage3D.mouseY;
      let abs_dx = Math.abs(dx);
      let abs_dy = Math.abs(dy);

      if (abs_dx > abs_dy) {
        this.m_rotationSpeed = dx * this.rotationSpeed;
        if (abs_dx > 0.5) this.m_camera.swingHorizontalWithAxis(this.m_rotationSpeed, Vector3D_1.default.Y_AXIS);
      } else {
        this.m_rotationSpeed = 0.0;
        if (abs_dy > 0.5) this.m_camera.swingVertical(-dy * this.rotationSpeed);
      }

      this.m_mouseX = this.m_stage3D.mouseX;
      this.m_mouseY = this.m_stage3D.mouseY;
    } else if (this.autoRotationEnabled) {
      if (this.m_aotuRotationDelay < 0) {
        this.m_camera.swingHorizontalWithAxis(this.autoRotationSpeed, Vector3D_1.default.Y_AXIS);
      } else {
        this.m_aotuRotationDelay--;
      }
    }
  }

  runWithZAxis() {
    if (this.m_enabled) {
      let dx = this.m_mouseX - this.m_stage3D.mouseX;
      let dy = this.m_mouseY - this.m_stage3D.mouseY;
      let abs_dx = Math.abs(dx);
      let abs_dy = Math.abs(dy);

      if (abs_dx > abs_dy) {
        if (abs_dx > 0.5) this.m_camera.swingHorizontalWithAxis(dx * 0.2, Vector3D_1.default.Z_AXIS);
      } else {
        if (abs_dy > 0.5) this.m_camera.swingVertical(dy * -0.2);
      }

      this.m_mouseX = this.m_stage3D.mouseX;
      this.m_mouseY = this.m_stage3D.mouseY;
    } else if (this.autoRotationEnabled) {
      if (this.m_aotuRotationDelay < 0) {
        this.m_camera.swingHorizontalWithAxis(this.autoRotationSpeed, Vector3D_1.default.Z_AXIS);
      } else {
        this.m_aotuRotationDelay--;
      }
    }
  }

}

exports.CameraDragSwinger = CameraDragSwinger;

/***/ }),

/***/ "c120":
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
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// Ray pick selection obj

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

class RaySelectedNode {
  constructor() {
    this.entity = null; // object space hit position

    this.lpv = new Vector3D_1.default(); // world space hit position

    this.wpv = new Vector3D_1.default();
    this.dis = 0.0;
    this.flag = 0;
  }

}

exports.default = RaySelectedNode;

/***/ }),

/***/ "c164":
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

class MathShaderCode {
  constructor() {}

}

MathShaderCode.BasePredefined = `
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
`;
exports.MathShaderCode = MathShaderCode;

class ShaderCode {
  constructor() {}

}

ShaderCode.BasePredefined = `
vec4 localPosition = vec4(0.0,0.0,0.0,1.0);
vec4 worldPosition = vec4(0.0,0.0,0.0,1.0);
// view space position
vec4 viewPosition = vec4(0.0,0.0,0.0,1.0);
vec3 worldNormal = vec3(0.0, 0.0, 1.0);
`;
ShaderCode.FragPredefined = `
`;
ShaderCode.FragDefined = `
`;
ShaderCode.VertPredefined = `
// origin world position
vec4 oWorldPosition = vec4(0.0,0.0,0.0,1.0);
`;
ShaderCode.VertDefined = `
`;
exports.ShaderCode = ShaderCode;

/***/ }),

/***/ "c497":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

class RendererParam {
  constructor(div = null) {
    this.m_matrix4AllocateSize = 8192;
    this.m_mainDiv = null;
    this.m_renderContextAttri = {
      depth: true,
      premultipliedAlpha: false,
      alpha: true,
      antialias: false,
      stencil: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance" //"default"

    };
    this.m_tickUpdateTime = 20; // delay 50 ms

    this.m_polygonOffsetEnabled = false;
    this.m_ditherEnabled = false; // display 3d view buf size auto sync window size

    this.autoSyncRenderBufferAndWindowSize = true;
    this.maxWebGLVersion = 2;
    this.cameraPerspectiveEnabled = true; // event flow control enable

    this.evtFlowEnabled = false; // x: fov, y: near, z: far

    this.camProjParam = new Vector3D_1.default(45.0, 10.0, 5000.0);
    this.camPosition = new Vector3D_1.default(2000.0, 2000.0, 2000.0);
    this.camLookAtPos = new Vector3D_1.default(0.0, 0.0, 0.0);
    this.camUpDirect = new Vector3D_1.default(0.0, 1.0, 0.0);
    this.batchEnabled = true;
    this.processFixedState = false;
    this.m_mainDiv = div;
    this.autoSyncRenderBufferAndWindowSize = div == null;
  }
  /**
   * @param   tickUpdateTime default value 50 ms delay
   */


  setTickUpdateTime(tickUpdateTime) {
    tickUpdateTime = Math.round(tickUpdateTime);
    this.m_tickUpdateTime = tickUpdateTime > 5 ? tickUpdateTime : 5;
  }

  getTickUpdateTime() {
    return this.m_tickUpdateTime;
  }

  setPolygonOffsetEanbled(polygonOffsetEnabled) {
    this.m_polygonOffsetEnabled = polygonOffsetEnabled;
  }

  getPolygonOffsetEanbled() {
    return this.m_polygonOffsetEnabled;
  }

  setDitherEanbled(ditherEnabled) {
    this.m_ditherEnabled = ditherEnabled;
  }

  getDitherEanbled() {
    return this.m_ditherEnabled;
  }

  getDiv() {
    return this.m_mainDiv;
  }

  getRenderContextAttri() {
    return this.m_renderContextAttri;
  }

  setAttriDepth(boo) {
    this.m_renderContextAttri.depth = boo;
  }

  setAttriStencil(boo) {
    this.m_renderContextAttri.stencil = boo;
  }

  setAttriAlpha(boo) {
    this.m_renderContextAttri.alpha = boo;
  }

  setAttriPremultipliedAlpha(boo) {
    this.m_renderContextAttri.premultipliedAlpha = boo;
  }

  setAttriAntialias(boo) {
    this.m_renderContextAttri.antialias = boo;
  }

  setAttripreserveDrawingBuffer(boo) {
    this.m_renderContextAttri.preserveDrawingBuffer = boo;
  }

  setAttriHightPowerPreference(boo) {
    this.m_renderContextAttri.powerPreference = boo ? "high-performance" : "default";
  }

  setMatrix4AllocateSize(total) {
    if (total < 1024) {
      total = 1024;
    }

    this.m_matrix4AllocateSize = total;
  }

  getMatrix4AllocateSize() {
    return this.m_matrix4AllocateSize;
  }
  /**
   * @param fov_angle_degree the default value is 45.0
   * @param near the default value is 10.0
   * @param far the default value is 5000.0
   */


  setCamProject(fov_angle_degree, near, far) {
    if (near >= far) {
      throw Error("Error Camera cear > far !!!");
    }

    this.camProjParam.setTo(fov_angle_degree, near, far);
  } //  setCamOrthoProject(bottom:number, top:number, left:number, right:number, near:number, far:number):void
  //  {
  //      if(near >= far)
  //      {
  //          throw Error("Error Camera cear > far !!!");
  //      }
  //      this.camProjParam.setTo(0.0,near,far);
  //      this.camOrthoParam.x = bottom;
  //      this.camOrthoParam.y = top;
  //      this.camOrthoParam.z = left;
  //      this.camOrthoParam.w = right;
  //  }


  setCamPosition(px, py, pz) {
    this.camPosition.setTo(px, py, pz);
  }

  setCamLookAtPos(px, py, pz) {
    this.camLookAtPos.setTo(px, py, pz);
  }

  setCamUpDirect(px, py, pz) {
    this.camUpDirect.setTo(px, py, pz);
  }

}

exports.default = RendererParam;

/***/ }),

/***/ "c51d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const Matrix4_1 = __importDefault(__webpack_require__("18c7"));

const Plane_1 = __importDefault(__webpack_require__("e214"));

const AABB_1 = __importDefault(__webpack_require__("fecb"));

class CameraBase {
  constructor() {
    this.version = 0;
    this.matUProbe = null;
    this.ufrustumProbe = null;
    this.uniformEnabled = false;
    this.name = "Camera"; //

    this.m_tempV = new Vector3D_1.default();
    this.m_tempV1 = new Vector3D_1.default();
    this.m_initRV = new Vector3D_1.default();
    this.m_initUP = new Vector3D_1.default();
    this.m_lookRHEnabled = true; //

    this.m_matrix = new Matrix4_1.default();
    this.m_viewMat = new Matrix4_1.default();
    this.m_viewInvertMat = new Matrix4_1.default();
    this.m_vpMat = new Matrix4_1.default();
    this.m_tempMat = new Matrix4_1.default();
    this.m_projMat = new Matrix4_1.default();
    this.m_camPos = new Vector3D_1.default();
    this.m_lookAtPos = new Vector3D_1.default();
    this.m_up = new Vector3D_1.default();
    this.m_lookDirectNV = new Vector3D_1.default();
    this.m_lookAtDirec = new Vector3D_1.default(); //

    this.m_nearPlaneWidth = 1.0;
    this.m_nearPlaneHeight = 1.0; //

    this.m_viewX = 0.0;
    this.m_viewY = 0.0;
    this.m_viewW = 800.0;
    this.m_viewH = 600.0;
    this.m_viewHalfW = 400.0;
    this.m_viewHalfH = 300.0;
    this.m_fovRadian = 0.0;
    this.m_aspect = 1.0;
    this.m_zNear = 0.1;
    this.m_zFar = 1000.0;
    this.m_b = 0.0;
    this.m_t = 0.0;
    this.m_l = 0.0;
    this.m_r = 0.0;
    this.m_perspectiveEnabled = false;
    this.m_project2Enabled = false;
    this.m_rightHandEnabled = true;
    this.m_rotV = new Vector3D_1.default(0.0, 0.0, 0.0);
    this.m_viewFieldZoom = 1.0;
    this.m_changed = true;
    this.m_unlock = true;
    this.m_tempNV = new Vector3D_1.default();
    this.m_tempUPV = new Vector3D_1.default();
    this.m_tempRV = new Vector3D_1.default();
    this.m_tempCamPos = new Vector3D_1.default();
    this.m_tempLookAtPos = new Vector3D_1.default();
    this.m_rotDegree = 0.0;
    this.m_rotAxis = new Vector3D_1.default();
    this.m_rotPivotPoint = null;
    this.m_axisRotEnabled = false;
    this.m_frustumWAABB = new AABB_1.default();
    this.m_invViewMat = null;
    this.m_nearPlaneHalfW = 0.5;
    this.m_nearPlaneHalfH = 0.5;
    this.m_nearWCV = new Vector3D_1.default();
    this.m_farWCV = new Vector3D_1.default();
    this.m_wNV = new Vector3D_1.default(); // 4 far point, 4 near point 

    this.m_wFrustumVtxArr = [new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), null, null, null]; // world space front,back ->(view space -z,z), world space left,right ->(view space -x,x),world space top,bottm ->(view space y,-y)

    this.m_wFruPlaneList = [new Plane_1.default(), new Plane_1.default(), new Plane_1.default(), new Plane_1.default(), new Plane_1.default(), new Plane_1.default()];
    this.m_fpNVArr = [new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default(), new Vector3D_1.default()];
    this.m_fpDisArr = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    this.m_viewMatrix = null;
  } // 不允许外界修改camera数据


  lock() {
    this.m_unlock = false;
  } // 允许外界修改camera数据


  unlock() {
    this.m_unlock = true;
  }

  lookAtLH(camPos, lookAtPos, up) {
    if (this.m_unlock) {
      this.m_camPos.copyFrom(camPos);
      this.m_lookAtPos.copyFrom(lookAtPos);
      this.m_up.copyFrom(up);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookRHEnabled = false;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize();
      this.m_initUP.copyFrom(up);
      this.m_initUP.normalize();
      Vector3D_1.default.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
      this.m_initRV.normalize();
      this.m_changed = true;
    }
  }

  lookAtRH(camPos, lookAtPos, up) {
    if (this.m_unlock) {
      this.m_camPos.copyFrom(camPos);
      this.m_lookAtPos.copyFrom(lookAtPos);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookRHEnabled = true;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize();
      Vector3D_1.default.Cross(this.m_lookAtDirec, up, this.m_initRV);
      Vector3D_1.default.Cross(this.m_initRV, this.m_lookAtDirec, this.m_initUP);
      this.m_initUP.normalize();
      this.m_initRV.normalize();
      this.m_up.copyFrom(this.m_initUP);
      this.m_changed = true;
    }
  }

  getLookAtLHToCamera(camera) {
    camera.lookAtLH(this.m_camPos, this.m_lookAtPos, this.m_up);
  }

  getLookAtRHToCamera(camera) {
    camera.lookAtRH(this.m_camPos, this.m_lookAtPos, this.m_up);
  }
  /**
   * left-hand axis perspective projection
   * @param fovRadian radian value
   * @param aspect the value is the view port width / height
   * @param zNear the camera near plane distance
   * @param zFar the camera far plane distance
   */


  perspectiveLH(fovRadian, aspect, zNear, zFar) {
    if (this.m_unlock) {
      this.m_project2Enabled = false;
      this.m_aspect = aspect;
      this.m_fovRadian = fovRadian;
      this.m_zNear = zNear;
      this.m_zFar = zFar;
      this.m_projMat.perspectiveLH(fovRadian, aspect, zNear, zFar);
      this.m_viewFieldZoom = Math.tan(fovRadian * 0.5);
      this.m_perspectiveEnabled = true;
      this.m_rightHandEnabled = false;
      this.m_changed = true;
    }
  }
  /**
   * right-hand axis perspective projection
   * @param fovRadian radian value
   * @param aspect the value is the view port width / height
   * @param zNear the camera near plane distance
   * @param zFar the camera far plane distance
   */


  perspectiveRH(fovRadian, aspect, zNear, zFar) {
    if (this.m_unlock) {
      this.m_aspect = aspect;
      this.m_fovRadian = fovRadian;
      this.m_zNear = zNear;
      this.m_zFar = zFar;
      this.m_projMat.perspectiveRH(fovRadian, aspect, zNear, zFar);
      this.m_viewFieldZoom = Math.tan(fovRadian * 0.5);
      this.m_project2Enabled = false;
      this.m_perspectiveEnabled = true;
      this.m_rightHandEnabled = true;
      this.m_changed = true;
    }
  }

  perspectiveRH2(fovRadian, pw, ph, zNear, zFar) {
    if (this.m_unlock) {
      this.m_aspect = pw / ph;
      this.m_fovRadian = fovRadian;
      this.m_zNear = zNear;
      this.m_zFar = zFar;
      this.m_projMat.perspectiveRH2(fovRadian, pw, ph, zNear, zFar);
      this.m_viewFieldZoom = Math.tan(fovRadian * 0.5);
      this.m_perspectiveEnabled = true;
      this.m_project2Enabled = true;
      this.m_rightHandEnabled = true;
      this.m_changed = true;
    }
  }

  getAspect() {
    return this.m_aspect;
  }

  getViewFieldZoom() {
    return this.m_viewFieldZoom;
  }

  orthoRH(zNear, zFar, b, t, l, r) {
    if (this.m_unlock) {
      this.m_zNear = zNear;
      this.m_zFar = zFar;
      this.m_b = b;
      this.m_t = t;
      this.m_l = l;
      this.m_r = r;
      this.m_projMat.orthoRH(b, t, l, r, zNear, zFar);
      this.m_perspectiveEnabled = false;
      this.m_rightHandEnabled = true;
      this.m_changed = true;
    }
  }

  orthoLH(zNear, zFar, b, t, l, r) {
    if (this.m_unlock) {
      this.m_zNear = zNear;
      this.m_zFar = zFar;
      this.m_b = b;
      this.m_t = t;
      this.m_l = l;
      this.m_r = r;
      this.m_projMat.orthoLH(b, t, l, r, zNear, zFar);
      this.m_perspectiveEnabled = false;
      this.m_rightHandEnabled = false;
      this.m_changed = true;
    }
  }

  isPerspectiveEnabled() {
    return this.m_perspectiveEnabled;
  }

  isRightHandEnabled() {
    return this.m_rightHandEnabled;
  }

  setViewXY(px, py) {
    if (this.m_unlock) {
      this.m_viewX = px;
      this.m_viewY = py;
    }
  }

  setViewSize(pw, ph) {
    if (this.m_unlock) {
      if (pw != this.m_viewW || ph != this.m_viewH) {
        this.m_viewW = pw;
        this.m_viewH = ph;
        this.m_viewHalfW = pw * 0.5;
        this.m_viewHalfH = ph * 0.5; //console.log("setViewSize, pw:"+pw+",ph:"+ph);

        if (this.m_perspectiveEnabled) {
          if (this.m_project2Enabled) {
            if (this.m_rightHandEnabled) this.perspectiveRH2(this.m_fovRadian, pw, ph, this.m_zNear, this.m_zFar);
          } else {
            if (this.m_rightHandEnabled) this.perspectiveRH(this.m_fovRadian, pw / ph, this.m_zNear, this.m_zFar);else this.perspectiveLH(this.m_fovRadian, pw / ph, this.m_zNear, this.m_zFar);
          }
        } else {
          this.orthoRH(this.m_zNear, this.m_zFar, -0.5 * ph, 0.5 * ph, -0.5 * pw, 0.5 * pw);
        }
      }
    }
  }

  getViewX() {
    return this.m_viewX;
  }

  getViewY() {
    return this.m_viewY;
  }

  getViewWidth() {
    return this.m_viewW;
  }

  getViewHeight() {
    return this.m_viewH;
  }

  translation(v3) {
    if (this.m_unlock) {
      this.m_camPos.copyFrom(v3);
      this.m_lookAtPos.x = v3.x + this.m_lookAtDirec.x;
      this.m_lookAtPos.y = v3.y + this.m_lookAtDirec.y;
      this.m_lookAtPos.z = v3.z + this.m_lookAtDirec.z;
      this.m_changed = true;
    }
  }

  translationXYZ(px, py, pz) {
    this.m_tempV.setXYZ(px, py, pz);

    if (this.m_unlock && Vector3D_1.default.DistanceSquared(this.m_camPos, this.m_tempV) > 0.00001) {
      this.m_camPos.setTo(px, py, pz);
      this.m_lookAtPos.x = px + this.m_lookAtDirec.x;
      this.m_lookAtPos.y = py + this.m_lookAtDirec.y;
      this.m_lookAtPos.z = pz + this.m_lookAtDirec.z;
      this.m_changed = true;
    }
  }

  forward(dis) {
    if (this.m_unlock) {
      this.m_camPos.x += this.m_lookDirectNV.x * dis;
      this.m_camPos.y += this.m_lookDirectNV.y * dis;
      this.m_camPos.z += this.m_lookDirectNV.z * dis;
      this.m_lookAtPos.x = this.m_camPos.x + this.m_lookAtDirec.x;
      this.m_lookAtPos.y = this.m_camPos.y + this.m_lookAtDirec.y;
      this.m_lookAtPos.z = this.m_camPos.z + this.m_lookAtDirec.z;
      this.m_changed = true;
    }
  }
  /**
   * 在平行于远平面的平面上滑动， 垂直于此平面的方向上不变
   * @param dx 摄像机 view 空间内 x方向偏移量
   * @param dy 摄像机 view 空间内 y方向偏移量
   */


  slideViewOffsetXY(dx, dy) {
    if (this.m_unlock) {
      this.m_tempV.setXYZ(dx, dy, 0);
      this.m_invViewMat.transformVectorSelf(this.m_tempV);
      dx = this.m_tempV.x - this.m_camPos.x;
      dy = this.m_tempV.y - this.m_camPos.y;
      let dz = this.m_tempV.z - this.m_camPos.z;
      this.m_camPos.x += dx;
      this.m_camPos.y += dy;
      this.m_camPos.z += dz;
      this.m_lookAtPos.x += dx;
      this.m_lookAtPos.y += dy;
      this.m_lookAtPos.z += dz;
      this.m_changed = true;
    }
  }

  forwardFixPos(dis, pos) {
    if (this.m_unlock) {
      this.m_camPos.x = pos.x + this.m_lookDirectNV.x * dis;
      this.m_camPos.y = pos.y + this.m_lookDirectNV.y * dis;
      this.m_camPos.z = pos.z + this.m_lookDirectNV.z * dis;
      this.m_lookAtPos.x = this.m_camPos.x + this.m_lookAtDirec.x;
      this.m_lookAtPos.y = this.m_camPos.y + this.m_lookAtDirec.y;
      this.m_lookAtPos.z = this.m_camPos.z + this.m_lookAtDirec.z;
      this.m_changed = true;
    }
  }

  swingHorizontalWithAxis(rad, axis) {
    if (this.m_unlock) {
      this.m_tempMat.identity();

      if (axis != null) {
        this.m_tempMat.appendRotation(rad * MathConst_1.default.MATH_PI_OVER_180, axis);
      } else {
        this.m_tempMat.appendRotation(rad * MathConst_1.default.MATH_PI_OVER_180, Vector3D_1.default.Y_AXIS);
      }

      this.m_lookAtDirec.x = this.m_camPos.x - this.m_lookAtPos.x;
      this.m_lookAtDirec.y = this.m_camPos.y - this.m_lookAtPos.y;
      this.m_lookAtDirec.z = this.m_camPos.z - this.m_lookAtPos.z;
      this.m_tempMat.transformVectorSelf(this.m_lookAtDirec);
      this.m_camPos.x = this.m_lookAtDirec.x + this.m_lookAtPos.x;
      this.m_camPos.y = this.m_lookAtDirec.y + this.m_lookAtPos.y;
      this.m_camPos.z = this.m_lookAtDirec.z + this.m_lookAtPos.z;
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookRHEnabled = true;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize(); //

      this.m_tempMat.transformVectorSelf(this.m_initRV);
      this.m_initRV.normalize(); //Vector3D.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);

      Vector3D_1.default.Cross(this.m_initRV, this.m_lookAtDirec, this.m_up);
      this.m_up.normalize();
      this.m_changed = true;
    }
  }

  swingHorizontal(degree) {
    if (this.m_unlock) {
      this.m_tempMat.identity();
      this.m_tempMat.appendRotation(degree * MathConst_1.default.MATH_PI_OVER_180, this.m_up);
      this.m_lookAtDirec.x = this.m_camPos.x - this.m_lookAtPos.x;
      this.m_lookAtDirec.y = this.m_camPos.y - this.m_lookAtPos.y;
      this.m_lookAtDirec.z = this.m_camPos.z - this.m_lookAtPos.z;
      this.m_tempMat.transformVectorSelf(this.m_lookAtDirec);
      this.m_camPos.x = this.m_lookAtDirec.x + this.m_lookAtPos.x;
      this.m_camPos.y = this.m_lookAtDirec.y + this.m_lookAtPos.y;
      this.m_camPos.z = this.m_lookAtDirec.z + this.m_lookAtPos.z;
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookRHEnabled = true;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize(); //

      Vector3D_1.default.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
      this.m_initRV.normalize();
      this.m_changed = true;
    }
  }

  swingVertical(degree) {
    if (this.m_unlock) {
      this.m_tempMat.identity();
      this.m_tempMat.appendRotation(degree * MathConst_1.default.MATH_PI_OVER_180, this.m_initRV);
      this.m_lookAtDirec.x = this.m_camPos.x - this.m_lookAtPos.x;
      this.m_lookAtDirec.y = this.m_camPos.y - this.m_lookAtPos.y;
      this.m_lookAtDirec.z = this.m_camPos.z - this.m_lookAtPos.z;
      this.m_tempMat.transformVectorSelf(this.m_lookAtDirec);
      this.m_camPos.x = this.m_lookAtDirec.x + this.m_lookAtPos.x;
      this.m_camPos.y = this.m_lookAtDirec.y + this.m_lookAtPos.y;
      this.m_camPos.z = this.m_lookAtDirec.z + this.m_lookAtPos.z;
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookRHEnabled = true;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize(); //

      Vector3D_1.default.Cross(this.m_initRV, this.m_lookAtDirec, this.m_up);
      this.m_up.normalize();
      this.m_initUP.copyFrom(this.m_up);
      this.m_changed = true;
    }
  }

  setPosition(v3) {
    if (this.m_unlock) {
      Vector3D_1.default.Cross(this.m_lookAtDirec, this.m_up, this.m_tempV);
      let dot = this.m_tempV.dot(this.m_initUP);
      this.m_tempV1.copyFrom(this.m_initUP);
      this.m_tempV1.scaleBy(dot);
      this.m_tempV.subtractBy(this.m_tempV1); //m_tempV.y = 0;

      this.m_camPos.copyFrom(v3);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize(); //

      Vector3D_1.default.Cross(this.m_tempV, this.m_lookAtDirec, this.m_up);
      this.m_up.normalize();
      this.m_changed = true;
    }
  }

  setPositionXYZ(px, py, pz) {
    if (this.m_unlock) {
      Vector3D_1.default.Cross(this.m_lookAtDirec, this.m_up, this.m_tempV);
      var dot = this.m_tempV.dot(this.m_initUP);
      this.m_tempV1.copyFrom(this.m_initUP);
      this.m_tempV1.scaleBy(dot);
      this.m_tempV.subtractBy(this.m_tempV1);
      this.m_camPos.setTo(px, py, pz);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize(); //

      Vector3D_1.default.Cross(this.m_tempV, this.m_lookAtDirec, this.m_up);
      this.m_up.normalize();
      this.m_changed = true;
    }
  }

  setLookPosXYZFixUp(px, py, pz) {
    if (this.m_unlock) {
      this.m_lookAtPos.setTo(px, py, pz);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookRHEnabled = true;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize(); //

      Vector3D_1.default.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
      this.m_initRV.normalize();
      this.m_changed = true;
    }
  }

  setPositionXYZFixUp(px, py, pz) {
    if (this.m_unlock) {
      this.m_camPos.setTo(px, py, pz);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookRHEnabled = true;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize(); //

      Vector3D_1.default.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
      this.m_initRV.normalize();
      this.m_changed = true;
    }
  }

  setPositionFixUp(v3) {
    if (this.m_unlock) {
      this.m_camPos.copyFrom(v3);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookRHEnabled = true;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize();
      Vector3D_1.default.Cross(this.m_lookAtDirec, this.m_up, this.m_initRV);
      this.m_initRV.normalize();
      this.m_changed = true;
    }
  }

  copyFrom(tarCam) {
    let pv = tarCam.getPosition();
    this.m_camPos.copyFrom(pv);
    pv = tarCam.getLookAtPosition();
    this.m_lookAtPos.copyFrom(pv);
    this.setZNear(tarCam.getZNear());
    this.setZFar(tarCam.getZFar());
    this.setNearPlaneWidth(tarCam.getNearPlaneWidth());
    this.setNearPlaneHeight(tarCam.getNearPlaneHeight());
    this.setPerspectiveEnabled(tarCam.getPerspectiveEnabled());
    this.m_viewInvertMat.copyFrom(tarCam.getViewInvMatrix());
  } // view space axis z


  getNV() {
    this.m_tempNV.copyFrom(this.m_lookDirectNV);
    return this.m_tempNV;
  } // view space axis y


  getUV() {
    this.m_tempUPV.copyFrom(this.m_up);
    return this.m_tempUPV;
  } // view space axis x


  getRV() {
    this.m_tempRV.copyFrom(this.m_initRV);
    return this.m_tempRV;
  }

  getPosition() {
    this.m_tempCamPos.copyFrom(this.m_camPos);
    return this.m_tempCamPos;
  }

  getLookAtPosition() {
    this.m_tempLookAtPos.copyFrom(this.m_lookAtPos);
    return this.m_tempLookAtPos;
  }

  setLookAtPosition(pv) {
    if (this.m_unlock) {
      this.m_lookAtPos.copyFrom(pv);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize();
      this.m_changed = true;
    }
  }

  setLookAtXYZ(px, py, pz) {
    if (this.m_unlock) {
      this.m_lookAtPos.setTo(px, py, pz);
      this.m_lookAtDirec.x = this.m_lookAtPos.x - this.m_camPos.x;
      this.m_lookAtDirec.y = this.m_lookAtPos.y - this.m_camPos.y;
      this.m_lookAtDirec.z = this.m_lookAtPos.z - this.m_camPos.z;
      this.m_lookDirectNV.copyFrom(this.m_lookAtDirec);
      this.m_lookDirectNV.normalize();
      this.m_changed = true;
    }
  }

  getPerspectiveEnabled() {
    return this.m_perspectiveEnabled;
  }

  setPerspectiveEnabled(boo) {
    this.m_perspectiveEnabled = boo;
  }

  appendRotationByAxis(degree, axis, pivotPoint = null) {
    if (this.m_unlock) {
      this.m_rotDegree = degree;
      this.m_changed = true;
      this.m_rotAxis.copyFrom(axis);
      this.m_rotPivotPoint = pivotPoint;
      this.m_axisRotEnabled = true;
    }
  }

  setRotationX(degree) {
    this.m_rotV.x = degree;
    this.m_changed = true;
    this.m_axisRotEnabled = false;
  }

  getRotationX() {
    return this.m_rotV.x;
  }

  setRotationY(degree) {
    this.m_rotV.y = degree;
    this.m_changed = true;
    this.m_axisRotEnabled = false;
  }

  getRotationY() {
    return this.m_rotV.y;
  }

  setRotationZ(degree) {
    this.m_rotV.z = degree;
    this.m_changed = true;
    this.m_axisRotEnabled = false;
  }

  getRotationZ() {
    return this.m_rotV.z;
  }

  setRotationXYZ(rx, ry, rz) {
    if (this.m_unlock) {
      this.m_rotV.setXYZ(rx, ry, rz);
      this.m_changed = true;
      this.m_axisRotEnabled = false;
    }
  }

  screenXYToViewXYZ(px, py, outV) {
    px -= this.m_viewX;
    py -= this.m_viewY;

    if (this.m_perspectiveEnabled) {
      px = this.m_nearPlaneWidth * (px - this.m_viewHalfW) / this.m_viewHalfW;
      py = this.m_nearPlaneHeight * (this.m_viewHalfH - py) / this.m_viewHalfH;
    }

    outV.setTo(px, py, -this.m_zNear); //
  }

  screenXYToWorldXYZ(px, py, outV) {
    px -= this.m_viewX;
    py -= this.m_viewY;

    if (this.m_perspectiveEnabled) {
      px = 0.5 * this.m_nearPlaneWidth * (px - this.m_viewHalfW) / this.m_viewHalfW;
      py = 0.5 * this.m_nearPlaneHeight * (this.m_viewHalfH - py) / this.m_viewHalfH;
    }

    outV.setTo(px, py, -this.m_zNear);
    outV.w = 1.0;
    this.m_viewInvertMat.transformVectorSelf(outV);
  }

  getWorldPickingRayByScreenXY(screenX, screenY, ray_pos, ray_tv) {
    //console.log("screenX,screenY: ",screenX,screenY,this.m_viewHalfW,this.m_viewHalfH);
    screenX -= this.m_viewX;
    screenY -= this.m_viewY;

    if (this.m_perspectiveEnabled) {
      screenX = 0.5 * this.m_nearPlaneWidth * (screenX - this.m_viewHalfW) / this.m_viewHalfW;
      screenY = 0.5 * this.m_nearPlaneHeight * (screenY - this.m_viewHalfH) / this.m_viewHalfH;
      ray_pos.setTo(screenX, screenY, -this.m_zNear);
      ray_pos.w = 1.0;
      this.m_viewInvertMat.transformVectorSelf(ray_pos);
      ray_tv.copyFrom(ray_pos);
      ray_tv.subtractBy(this.m_camPos);
      ray_tv.normalize();
    } else {
      screenX -= this.m_viewHalfW;
      screenY -= this.m_viewHalfH;
      ray_pos.setTo(screenX, screenY, -this.m_zNear);
      ray_pos.w = 1.0;
      this.m_viewInvertMat.transformVectorSelf(ray_pos);
      ray_tv.copyFrom(this.m_lookDirectNV);
    }
  }

  calcScreenNormalizeXYByWorldPos(pv3, scPV3) {
    scPV3.copyFrom(pv3);
    this.m_vpMat.transformVectorSelf(scPV3);
    scPV3.x /= scPV3.w;
    scPV3.y /= scPV3.w;
  }

  worldPosToScreen(pv) {
    this.m_viewMat.transformVector3Self(pv);
    this.m_projMat.transformVectorSelf(pv);
    pv.x /= pv.w;
    pv.y /= pv.w;
    pv.x *= this.m_viewHalfW;
    pv.y *= this.m_viewHalfH;
    pv.x += this.m_viewX;
    pv.y += this.m_viewY;
  } // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值为像素数


  calcViewRectByWorldSphere(pv, radius, outV) {
    this.m_viewMat.transformVector3Self(pv);
    radius *= 1.15;
    outV.x = pv.x - radius;
    outV.y = pv.y - radius;
    outV.z = pv.z;
    pv.x += radius;
    pv.y += radius;
    this.m_projMat.transformPerspV4Self(outV);
    this.m_projMat.transformPerspV4Self(pv);
    pv.z = 1.0 / pv.w;
    outV.z = pv.x * pv.z;
    outV.w = pv.y * pv.z;
    outV.z *= this.m_viewHalfW;
    outV.w *= this.m_viewHalfH;
    outV.x *= pv.z;
    outV.y *= pv.z;
    outV.x *= this.m_viewHalfW;
    outV.y *= this.m_viewHalfH;
    outV.z = outV.z - outV.x;
    outV.w = outV.w - outV.y;
    outV.x += this.m_viewX;
    outV.y += this.m_viewY;
  } // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值0.0 - 1.0之间


  calcScreenRectByWorldSphere(pv, radius, outV) {
    this.m_viewMat.transformVector3Self(pv);
    radius *= 1.15;
    outV.x = pv.x - radius;
    outV.y = pv.y - radius;
    pv.x += radius;
    pv.y += radius;
    this.m_projMat.transformPerspV4Self(outV);
    this.m_projMat.transformPerspV4Self(pv);
    pv.z = 1.0 / pv.w;
    outV.z = pv.x * pv.z;
    outV.w = pv.y * pv.z;
    outV.x *= pv.z;
    outV.y *= pv.z;
    outV.z = outV.z - outV.x;
    outV.w = outV.w - outV.y;
  }

  getInvertViewMatrix() {
    return this.m_invViewMat;
  }

  getZNear() {
    return this.m_zNear;
  }

  setZNear(value) {
    this.m_zNear = value;
  }

  getZFar() {
    return this.m_zFar;
  }

  setZFar(value) {
    this.m_zFar = value;
  }

  getNearPlaneWidth() {
    return this.m_nearPlaneWidth;
  }

  setNearPlaneWidth(value) {
    this.m_nearPlaneWidth = value;
  }

  getNearPlaneHeight() {
    return this.m_nearPlaneHeight;
  }

  setNearPlaneHeight(value) {
    this.m_nearPlaneHeight = value;
  }

  getFov() {
    return this.m_fovRadian;
  }

  __calcTestParam() {
    if (this.m_invViewMat == null) this.m_invViewMat = new Matrix4_1.default(); //Matrix4Pool.GetMatrix();

    this.m_invViewMat.copyFrom(this.m_viewMat);
    this.m_invViewMat.invert(); //

    let plane = null;
    let halfMinH = this.m_viewHalfH;
    let halfMinW = this.m_viewHalfW;
    let halfMaxH = this.m_viewHalfH;
    let halfMaxW = this.m_viewHalfW;

    if (this.m_perspectiveEnabled) {
      let tanv = Math.tan(this.m_fovRadian * 0.5);
      halfMinH = this.m_zNear * tanv;
      halfMinW = halfMinH * this.m_aspect;
      halfMaxH = this.m_zFar * tanv;
      halfMaxW = halfMaxH * this.m_aspect;
    } //console.log("CameraBase::__calcTestParam(), (halfMinW, halfMinH): "+halfMinW+", "+halfMinH);


    this.m_nearPlaneHalfW = halfMinW;
    this.m_nearPlaneHalfH = halfMinH; // inner view space

    this.m_nearWCV.setTo(0, 0, -this.m_zNear);
    this.m_farWCV.setTo(0, 0, -this.m_zFar);
    this.m_invViewMat.transformVectorSelf(this.m_nearWCV);
    this.m_invViewMat.transformVectorSelf(this.m_farWCV);
    this.m_wNV.x = this.m_farWCV.x - this.m_nearWCV.x;
    this.m_wNV.y = this.m_farWCV.y - this.m_nearWCV.y;
    this.m_wNV.z = this.m_farWCV.z - this.m_nearWCV.z;
    this.m_wNV.normalize(); // front face

    plane = this.m_wFruPlaneList[0];
    plane.nv.copyFrom(this.m_wNV);
    plane.distance = plane.nv.dot(this.m_farWCV);
    plane.position.copyFrom(this.m_farWCV); // back face

    plane = this.m_wFruPlaneList[1];
    plane.nv.copyFrom(this.m_wFruPlaneList[0].nv);
    plane.distance = plane.nv.dot(this.m_nearWCV);
    plane.position.copyFrom(this.m_nearWCV); //

    this.m_wFrustumVtxArr[8] = this.m_nearWCV;
    this.m_wFrustumVtxArr[9] = this.m_farWCV;
    this.m_wFrustumVtxArr[11] = this.m_wNV; // far face

    this.m_wFrustumVtxArr[0].setTo(-halfMaxW, -halfMaxH, -this.m_zFar);
    this.m_wFrustumVtxArr[1].setTo(halfMaxW, -halfMaxH, -this.m_zFar);
    this.m_wFrustumVtxArr[2].setTo(halfMaxW, halfMaxH, -this.m_zFar);
    this.m_wFrustumVtxArr[3].setTo(-halfMaxW, halfMaxH, -this.m_zFar); // near face

    this.m_wFrustumVtxArr[4].setTo(-halfMinW, -halfMinH, -this.m_zNear);
    this.m_wFrustumVtxArr[5].setTo(halfMinW, -halfMinH, -this.m_zNear);
    this.m_wFrustumVtxArr[6].setTo(halfMinW, halfMinH, -this.m_zNear);
    this.m_wFrustumVtxArr[7].setTo(-halfMinW, halfMinH, -this.m_zNear); //

    this.m_invViewMat.transformVectorSelf(this.m_wFrustumVtxArr[0]);
    this.m_invViewMat.transformVectorSelf(this.m_wFrustumVtxArr[1]);
    this.m_invViewMat.transformVectorSelf(this.m_wFrustumVtxArr[2]);
    this.m_invViewMat.transformVectorSelf(this.m_wFrustumVtxArr[3]);
    this.m_invViewMat.transformVectorSelf(this.m_wFrustumVtxArr[4]);
    this.m_invViewMat.transformVectorSelf(this.m_wFrustumVtxArr[5]);
    this.m_invViewMat.transformVectorSelf(this.m_wFrustumVtxArr[6]);
    this.m_invViewMat.transformVectorSelf(this.m_wFrustumVtxArr[7]); //

    this.m_frustumWAABB.max.setTo(-9999999, -9999999, -9999999);
    this.m_frustumWAABB.min.setTo(9999999, 9999999, 9999999);

    for (let i = 0; i < 8; ++i) {
      this.m_frustumWAABB.addPosition(this.m_wFrustumVtxArr[i]);
    }

    this.m_frustumWAABB.updateFast(); //let abCV = m_frustumWAABB.getCenter();
    // bottom

    let v0 = this.m_wFrustumVtxArr[0];
    let v1 = this.m_wFrustumVtxArr[4];
    this.m_tempV.x = v0.x - v1.x;
    this.m_tempV.y = v0.y - v1.y;
    this.m_tempV.z = v0.z - v1.z;
    v0 = this.m_wFrustumVtxArr[1];
    v1 = this.m_wFrustumVtxArr[5];
    this.m_tempV1.x = v0.x - v1.x;
    this.m_tempV1.y = v0.y - v1.y;
    this.m_tempV1.z = v0.z - v1.z;
    plane = this.m_wFruPlaneList[3];
    Vector3D_1.default.Cross(this.m_tempV1, this.m_tempV, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0); // top

    v0 = this.m_wFrustumVtxArr[3];
    v1 = this.m_wFrustumVtxArr[7];
    this.m_tempV.x = v0.x - v1.x;
    this.m_tempV.y = v0.y - v1.y;
    this.m_tempV.z = v0.z - v1.z;
    v0 = this.m_wFrustumVtxArr[2];
    v1 = this.m_wFrustumVtxArr[6];
    this.m_tempV1.x = v0.x - v1.x;
    this.m_tempV1.y = v0.y - v1.y;
    this.m_tempV1.z = v0.z - v1.z;
    plane = this.m_wFruPlaneList[2];
    Vector3D_1.default.Cross(this.m_tempV1, this.m_tempV, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0); // left

    v0 = this.m_wFrustumVtxArr[0];
    v1 = this.m_wFrustumVtxArr[4];
    this.m_tempV.x = v0.x - v1.x;
    this.m_tempV.y = v0.y - v1.y;
    this.m_tempV.z = v0.z - v1.z;
    v0 = this.m_wFrustumVtxArr[3];
    v1 = this.m_wFrustumVtxArr[7];
    this.m_tempV1.x = v0.x - v1.x;
    this.m_tempV1.y = v0.y - v1.y;
    this.m_tempV1.z = v0.z - v1.z;
    plane = this.m_wFruPlaneList[4];
    Vector3D_1.default.Cross(this.m_tempV, this.m_tempV1, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0); // right

    v0 = this.m_wFrustumVtxArr[1];
    v1 = this.m_wFrustumVtxArr[5];
    this.m_tempV.x = v0.x - v1.x;
    this.m_tempV.y = v0.y - v1.y;
    this.m_tempV.z = v0.z - v1.z;
    v0 = this.m_wFrustumVtxArr[2];
    v1 = this.m_wFrustumVtxArr[6];
    this.m_tempV1.x = v0.x - v1.x;
    this.m_tempV1.y = v0.y - v1.y;
    this.m_tempV1.z = v0.z - v1.z;
    plane = this.m_wFruPlaneList[5];
    Vector3D_1.default.Cross(this.m_tempV, this.m_tempV1, plane.nv);
    plane.nv.normalize();
    plane.distance = plane.nv.dot(v0);
    plane.position.copyFrom(v0);
    this.m_fpNVArr[0].copyFrom(this.m_wFruPlaneList[0].nv);
    this.m_fpNVArr[1].copyFrom(this.m_wFruPlaneList[1].nv);
    this.m_fpNVArr[1].scaleBy(-1.0);
    this.m_fpNVArr[2].copyFrom(this.m_wFruPlaneList[2].nv);
    this.m_fpNVArr[3].copyFrom(this.m_wFruPlaneList[3].nv);
    this.m_fpNVArr[3].scaleBy(-1.0);
    this.m_fpNVArr[4].copyFrom(this.m_wFruPlaneList[4].nv);
    this.m_fpNVArr[4].scaleBy(-1.0);
    this.m_fpNVArr[5].copyFrom(this.m_wFruPlaneList[5].nv); //

    this.m_fpDisArr[0] = this.m_wFruPlaneList[0].distance;
    this.m_fpDisArr[1] = -this.m_wFruPlaneList[1].distance;
    this.m_fpDisArr[2] = this.m_wFruPlaneList[2].distance;
    this.m_fpDisArr[3] = -this.m_wFruPlaneList[3].distance;
    this.m_fpDisArr[4] = -this.m_wFruPlaneList[4].distance;
    this.m_fpDisArr[5] = this.m_wFruPlaneList[5].distance;
  }

  getWordFrustumWAABB() {
    return this.m_frustumWAABB;
  }

  getWordFrustumWAABBCenter() {
    return this.m_frustumWAABB.center;
  }

  getWordFrustumVtxArr() {
    return this.m_wFrustumVtxArr;
  }

  getWordFrustumPlaneArr() {
    return this.m_wFruPlaneList;
  }

  visiTestSphere2(w_cv, radius) {
    let boo = this.m_fpNVArr[0].dot(w_cv) - this.m_fpDisArr[0] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[1].dot(w_cv) - this.m_fpDisArr[1] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[2].dot(w_cv) - this.m_fpDisArr[2] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[3].dot(w_cv) - this.m_fpDisArr[3] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[4].dot(w_cv) - this.m_fpDisArr[4] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[5].dot(w_cv) - this.m_fpDisArr[5] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    return true;
  }

  visiTestSphere3(w_cv, radius, farROffset) {
    let boo = this.m_fpNVArr[0].dot(w_cv) - this.m_fpDisArr[0] + farROffset - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[1].dot(w_cv) - this.m_fpDisArr[1] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[2].dot(w_cv) - this.m_fpDisArr[2] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[3].dot(w_cv) - this.m_fpDisArr[3] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[4].dot(w_cv) - this.m_fpDisArr[4] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[5].dot(w_cv) - this.m_fpDisArr[5] - radius > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    return true;
  }

  visiTestPosition(pv) {
    let boo = this.m_fpNVArr[0].dot(pv) - this.m_fpDisArr[0] > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[1].dot(pv) - this.m_fpDisArr[1] > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[2].dot(pv) - this.m_fpDisArr[2] > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[3].dot(pv) - this.m_fpDisArr[3] > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[4].dot(pv) - this.m_fpDisArr[4] > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    boo = this.m_fpNVArr[5].dot(pv) - this.m_fpDisArr[5] > MathConst_1.default.MATH_MIN_POSITIVE;
    if (boo) return false;
    return true;
  }

  visiTestPlane(nv, distance) {
    let f0 = nv.dot(this.m_wFruPlaneList[0].position) - distance;
    let f1 = f0 * (nv.dot(this.m_wFruPlaneList[1].position) - distance);
    if (f1 < MathConst_1.default.MATH_MIN_POSITIVE) return true;
    f1 = f0 * (nv.dot(this.m_wFruPlaneList[2].position) - distance);
    if (f1 < MathConst_1.default.MATH_MIN_POSITIVE) return true;
    f1 = f0 * (nv.dot(this.m_wFruPlaneList[3].position) - distance);
    if (f1 < MathConst_1.default.MATH_MIN_POSITIVE) return true;
    f1 = f0 * (nv.dot(this.m_wFruPlaneList[4].position) - distance);
    if (f1 < MathConst_1.default.MATH_MIN_POSITIVE) return true;
    f1 = f0 * (nv.dot(this.m_wFruPlaneList[5].position) - distance);
    if (f1 < MathConst_1.default.MATH_MIN_POSITIVE) return true;
    return false;
  } //this.m_wFruPlaneList
  // frustum intersect sphere in wrod space


  visiTestSphere(w_cv, radius) {
    let boo = this.m_frustumWAABB.sphereIntersect(w_cv, radius); //

    if (boo) {
      let pf0 = this.m_wFruPlaneList[0].intersectSphere(w_cv, radius);
      let pf1 = this.m_wFruPlaneList[1].intersectSphere(w_cv, radius); //trace("0 pf0,pf1: "+pf0+","+pf1);

      if (pf0 * pf1 >= 0) {
        //this.intersectBoo
        //trace("TT A0");
        if (this.m_wFruPlaneList[0].intersectBoo || this.m_wFruPlaneList[1].intersectBoo) {} else {
          return false;
        }
      }

      pf0 = this.m_wFruPlaneList[2].intersectSphere(w_cv, radius);
      pf1 = this.m_wFruPlaneList[3].intersectSphere(w_cv, radius); //trace("1 pf0,pf1: "+pf0+","+pf1);

      if (pf0 * pf1 >= 0) {
        //trace("TT A1");
        if (this.m_wFruPlaneList[2].intersectBoo || this.m_wFruPlaneList[3].intersectBoo) {} else {
          return false;
        }
      }

      pf0 = this.m_wFruPlaneList[4].intersectSphere(w_cv, radius);
      pf1 = this.m_wFruPlaneList[5].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        //trace("TT A2");
        if (this.m_wFruPlaneList[4].intersectBoo || this.m_wFruPlaneList[5].intersectBoo) {} else {
          return false;
        }
      }

      return true;
    }

    return false;
  } // visibility test
  // 可见性检测这边可以做的更精细，例如上一帧检测过的对象如果摄像机没有移动而且它自身也没有位置等变化，就可以不用检测
  // 例如精细检测可以分类: 圆球，圆柱体，长方体 等不同的检测模型计算方式会有区别


  visiTestAABB(ab) {
    //trace("ro.bounds.getCenter(): "+ro.bounds.getCenter()+","+ro.bounds.getRadius());
    //return m_frustumWAABB.sphereIntersectFast(ro.bounds.getCenter(),ro.bounds.getRadius());
    let w_cv = ab.center;
    let radius = ab.radius;
    let boo = this.m_frustumWAABB.sphereIntersect(w_cv, radius); //

    if (boo) {
      let pf0 = this.m_wFruPlaneList[0].intersectSphere(w_cv, radius);
      let pf1 = this.m_wFruPlaneList[1].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (this.m_wFruPlaneList[0].intersectBoo || this.m_wFruPlaneList[1].intersectBoo) {} else {
          return false;
        }
      }

      pf0 = this.m_wFruPlaneList[2].intersectSphere(w_cv, radius);
      pf1 = this.m_wFruPlaneList[3].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (this.m_wFruPlaneList[2].intersectBoo || this.m_wFruPlaneList[3].intersectBoo) {} else {
          return false;
        }
      }

      pf0 = this.m_wFruPlaneList[4].intersectSphere(w_cv, radius);
      pf1 = this.m_wFruPlaneList[5].intersectSphere(w_cv, radius);

      if (pf0 * pf1 >= 0) {
        if (this.m_wFruPlaneList[4].intersectBoo || this.m_wFruPlaneList[5].intersectBoo) {} else {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  setViewMatrix(viewMatrix) {
    this.m_viewMatrix = viewMatrix;
    this.m_changed = true;
  }

  update() {
    if (this.m_changed) {
      this.version++;
      this.m_changed = false;

      if (this.m_viewMatrix == null) {
        if (this.m_axisRotEnabled) {
          this.m_matrix.appendRotationPivot(this.m_rotDegree * MathConst_1.default.MATH_PI_OVER_180, this.m_rotAxis, this.m_rotPivotPoint);
        } else {
          this.m_matrix.identity();
          this.m_matrix.appendRotationEulerAngle(this.m_rotV.x * MathConst_1.default.MATH_PI_OVER_180, this.m_rotV.y * MathConst_1.default.MATH_PI_OVER_180, this.m_rotV.z * MathConst_1.default.MATH_PI_OVER_180);
        }

        if (this.m_lookRHEnabled) {
          this.m_viewMat.lookAtRH(this.m_camPos, this.m_lookAtPos, this.m_up);
        } else {
          this.m_viewMat.lookAtLH(this.m_camPos, this.m_lookAtPos, this.m_up);
        }

        this.m_viewMat.append(this.m_matrix);
      } else {
        this.m_viewMat.copyFrom(this.m_viewMatrix);
      }

      if (this.m_project2Enabled) {
        this.m_nearPlaneWidth = this.m_zNear * Math.tan(this.m_fovRadian * 0.5) * 2.0;
        this.m_nearPlaneHeight = this.m_nearPlaneWidth / this.m_aspect;
      } else {
        this.m_nearPlaneHeight = this.m_zNear * Math.tan(this.m_fovRadian * 0.5) * 2.0;
        this.m_nearPlaneWidth = this.m_aspect * this.m_nearPlaneHeight;
      }

      this.m_viewInvertMat.copyFrom(this.m_viewMat);
      this.m_viewInvertMat.invert(); //

      this.m_vpMat.identity();
      this.m_vpMat.copyFrom(this.m_viewMat);
      this.m_vpMat.append(this.m_projMat);

      this.__calcTestParam(); // very very important !!!


      this.updateUniformData();
    }
  }

  updateCamMatToUProbe(uniformProbe) {
    if (uniformProbe.isEnabled()) {
      uniformProbe.update();
      uniformProbe.getFS32At(0).set(this.m_viewMat.getLocalFS32(), 0);
      uniformProbe.getFS32At(1).set(this.m_projMat.getLocalFS32(), 0);
    }
  }

  updateUniformData() {
    if (this.uniformEnabled) {
      this.updateCamMatToUProbe(this.matUProbe);
      this.ufrustumProbe.setVec4DataAt(0, this.m_zNear, this.m_zFar, this.m_nearPlaneHalfW, this.m_nearPlaneHalfH);
      this.ufrustumProbe.update();
      this.ucameraPosProbe.setVec4DataAt(0, this.m_camPos.x, this.m_camPos.y, this.m_camPos.z, 1.0);
      this.ucameraPosProbe.update();
    }
  }

  destroy() {}

  lookRHEnabled() {
    return this.m_lookRHEnabled;
  }

  lookLHEnabled() {
    return !this.m_lookRHEnabled;
  }

  getVPMatrix() {
    return this.m_vpMat;
  }

  getViewMatrix() {
    return this.m_viewMat;
  }

  getViewInvMatrix() {
    return this.m_viewInvertMat;
  }

  getProjectMatrix() {
    return this.m_projMat;
  }

}

exports.default = CameraBase;

/***/ }),

/***/ "c62b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2019-2022 by                                                 */

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

const RenderConst_1 = __webpack_require__("e08e");

const RenderColorMask_1 = __webpack_require__("070b");

const RenderStateObject_1 = __webpack_require__("a5ba");

const RendererState_1 = __importDefault(__webpack_require__("29ef"));
/**
 * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
 * renderer rendering runtime core executable display unit.
 */


class RPOUnit {
  constructor() {
    this.uid = -1;
    this.value = -1; // 记录自身和RPONode的对应关系

    this.__$rpuid = -1; // renderProcess uid

    this.__$rprouid = -1;
    this.shader = null; // 这个posotion和bounds的center会是同一个实例

    this.pos = null;
    this.bounds = null; // 记录对应的RODisplay的渲染所需的状态数据

    this.ibufType = 0; // UNSIGNED_SHORT or UNSIGNED_INT

    this.ibufStep = 2; // 2 or 4

    this.ivsIndex = 0;
    this.ivsCount = 0;
    this.insCount = 0;
    this.drawOffset = 0;
    this.partTotal = 0; // partTotal = partGroup.length

    this.partGroup = null;
    this.trisNumber = 0;
    this.visible = true;
    this.drawEnabled = true;
    this.drawMode = 0;
    this.renderState = 0;
    this.rcolorMask = 0; // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合

    this.drawFlag = 0;
    this.vro = null; // transform uniform

    this.transUniform = null; // materiall uniform

    this.uniform = null; // 记录 material 对应的 shader program uid

    this.shdUid = -1;
    this.vtxUid = -1; // record tex group

    this.tro = null;
    this.texMid = -1;
    this.ubo = null;
    /**
     *  for example: [-70.0,1.0]
     */

    this.polygonOffset = null;
  }

  testDrawFlag() {
    if (this.shader.drawFlag != this.drawFlag) {
      this.shader.drawFlag = this.drawFlag;
      RenderStateObject_1.RenderStateObject.UseRenderState(this.renderState);
      RenderColorMask_1.RenderColorMask.UseRenderState(this.rcolorMask);
    }
  }

  getUid() {
    return this.uid;
  }

  getRPOUid() {
    return this.__$rpuid;
  }

  getRPROUid() {
    return this.__$rprouid;
  }

  getShaderUid() {
    return this.shdUid;
  }

  setIvsParam(ivsIndex, ivsCount) {
    this.ivsIndex = ivsIndex;
    this.ivsCount = ivsCount;
    this.drawOffset = ivsIndex * this.ibufStep;
    this.drawEnabled = this.visible && this.ivsCount > 0;
  }

  setVisible(boo) {
    this.visible = boo;
    this.drawEnabled = boo && this.ivsCount > 0; // if(DebugFlag.Flag_0 > 0) console.log("#### setVisible(): ", boo, "this.drawEnabled: ",this.drawEnabled);
  }

  setDrawFlag(renderState, rcolorMask) {
    this.renderState = renderState;
    this.rcolorMask = rcolorMask;
    this.drawFlag = (rcolorMask << 10) + renderState;
  }

  drawThis(rc) {
    ++RendererState_1.default.DrawCallTimes;
    RendererState_1.default.DrawTrisNumber += this.trisNumber; // TODO(Vily): 下面这个判断流程需要优化(由于几何数据更改之后上传gpu的动作是一帧上传16个这样的速度下实现的，所以需要下面这句代码来保证不出错: [.WebGL-000037DC02C2B800] GL_INVALID_OPERATION: Insufficient buffer size)

    let ivsCount = this.indicesRes.getVTCount();
    if (this.ivsCount <= ivsCount) ivsCount = this.ivsCount;

    if (this.polygonOffset != null) {
      rc.setPolygonOffset(this.polygonOffset[0], this.polygonOffset[1]);
    } else {
      rc.resetPolygonOffset();
    }

    switch (this.drawMode) {
      case RenderConst_1.RenderDrawMode.ELEMENTS_TRIANGLES:
        // if(DebugFlag.Flag_0 > 0)console.log("RPOUnit::run(), TRIANGLES drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+"),drawOffset: "+this.drawOffset);
        //rc.RContext.drawElements(rc.TRIANGLES, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
        rc.RContext.drawElements(rc.TRIANGLES, ivsCount, this.ibufType, this.drawOffset);
        break;

      case RenderConst_1.RenderDrawMode.ELEMENTS_LINES:
        //console.log("RPOUnit::run(), ELEMENTS_LINES drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+"),drawOffset: "+this.drawOffset);
        //rc.RContext.drawElements(rc.ELEMENTS_LINES, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
        rc.RContext.drawElements(rc.LINES, ivsCount, this.ibufType, this.drawOffset);
        break;

      case RenderConst_1.RenderDrawMode.ELEMENTS_TRIANGLE_STRIP:
        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
        //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
        rc.RContext.drawElements(rc.TRIANGLE_STRIP, ivsCount, this.ibufType, this.drawOffset);
        break;

      case RenderConst_1.RenderDrawMode.ELEMENTS_INSTANCED_TRIANGLES:
        //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
        //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
        rc.RContext.drawElementsInstanced(rc.TRIANGLES, ivsCount, this.ibufType, this.drawOffset, this.insCount);
        break;

      case RenderConst_1.RenderDrawMode.ELEMENTS_TRIANGLE_FAN:
        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
        //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
        rc.RContext.drawElements(rc.TRIANGLE_FAN, ivsCount, this.ibufType, this.drawOffset);
        break;

      case RenderConst_1.RenderDrawMode.ARRAYS_LINES:
        //console.log("RPOUnit::run(), ARRAYS_LINES drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
        rc.RContext.drawArrays(rc.LINES, this.ivsIndex, this.ivsCount);
        break;

      case RenderConst_1.RenderDrawMode.ARRAYS_LINE_STRIP:
        //console.log("RPOUnit::run(), ARRAYS_LINE_STRIP drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
        rc.RContext.drawArrays(rc.LINE_STRIP, this.ivsIndex, this.ivsCount);
        break;

      default:
        break;
    }
  }

  drawPart(rc) {
    ++RendererState_1.default.DrawCallTimes;
    RendererState_1.default.DrawTrisNumber += this.trisNumber; // TODO(Vily): 下面这个判断流程需要优化(由于几何数据更改之后上传gpu的动作是一帧上传16个这样的速度下实现的，所以需要下面这句代码来保证不出错: [.WebGL-000037DC02C2B800] GL_INVALID_OPERATION: Insufficient buffer size)

    let ivsCount = this.indicesRes.getVTCount();
    if (this.ivsCount <= ivsCount) ivsCount = this.ivsCount;

    if (this.polygonOffset != null) {
      rc.setPolygonOffset(this.polygonOffset[0], this.polygonOffset[1]);
    } else {
      rc.resetPolygonOffset();
    }

    let i = 0;
    let gl = rc.RContext;

    switch (this.drawMode) {
      case RenderConst_1.RenderDrawMode.ELEMENTS_TRIANGLES:
        for (; i < this.partTotal;) {
          // 这里面可以增加一个回调函数,这个回调函数可以对uniform(或者transformUniform)做一些数据改变，进而来控制相应的状态
          // 因此可以通过改变uniform实现大量的显示绘制
          //  let count:number = this.partGroup[i++];
          //  let offset:number = this.partGroup[i++];
          //  gl.drawElements(rc.TRIANGLES, count, this.ibufType, offset);
          gl.drawElements(rc.TRIANGLES, this.partGroup[i++], this.ibufType, this.partGroup[i++]);
        }

        break;

      case RenderConst_1.RenderDrawMode.ELEMENTS_LINES:
        for (; i < this.partTotal;) {
          // 这里面可以增加一个回调函数,这个回调函数可以对uniform(或者transformUniform)做一些数据改变，进而来控制相应的状态
          // 因此可以通过改变uniform实现大量的显示绘制
          //  let count:number = this.partGroup[i++];
          //  let offset:number = this.partGroup[i++];
          //  gl.drawElements(rc.TRIANGLES, count, this.ibufType, offset);
          gl.drawElements(rc.LINES, this.partGroup[i++], this.ibufType, this.partGroup[i++]);
        }

        break;

      case RenderConst_1.RenderDrawMode.ELEMENTS_TRIANGLE_STRIP:
        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
        //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
        gl.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType, this.drawOffset);
        break;

      case RenderConst_1.RenderDrawMode.ELEMENTS_INSTANCED_TRIANGLES:
        //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
        //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
        gl.drawElementsInstanced(rc.TRIANGLES, this.ivsCount, this.ibufType, this.drawOffset, this.insCount);
        break;

      case RenderConst_1.RenderDrawMode.ELEMENTS_TRIANGLE_FAN:
        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
        //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
        gl.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType, this.drawOffset);
        break;

      case RenderConst_1.RenderDrawMode.ARRAYS_LINES:
        //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
        gl.drawArrays(rc.LINES, this.ivsIndex, this.ivsCount);
        break;

      case RenderConst_1.RenderDrawMode.ARRAYS_LINE_STRIP:
        //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
        gl.drawArrays(rc.LINE_STRIP, this.ivsIndex, this.ivsCount);
        break;

      default:
        break;
    }
  }

  run2(rc) {
    //console.log("RPOUnit::run2(), this.tro: "+this.tro+", this.drawMode: "+this.drawMode);
    if (this.ubo != null) {
      this.ubo.run(rc);
    } //  if(this.shader == null)
    //  {
    //      console.log("this.shader == null unit this.uid: ",this.uid);
    //  }


    this.shader.useTransUniform(this.transUniform);
    this.shader.useUniform(this.uniform);
    this.testDrawFlag();
  }

  run(rc) {
    //console.log("RPOUnit::run(), this.tro: "+this.tro+", this.drawMode: "+this.drawMode);
    if (this.ubo != null) {
      this.ubo.run(rc);
    }

    this.vro.run();
    this.tro.run();
    this.shader.useTransUniform(this.transUniform);
    this.shader.useUniform(this.uniform);
    this.testDrawFlag();
  }

  runLockMaterial2(puniform) {
    this.testDrawFlag();
    this.shader.useUniform2ToCurrentShd(puniform == null ? this.uniform : puniform, this.transUniform);
  }

  runLockMaterial() {
    this.vro.run();
    this.testDrawFlag();
    this.shader.useUniform2ToCurrentShd(this.uniform, this.transUniform);
  }

  reset() {
    //  console.log("RPOUnit::reset(), uid: ",this.getUid());
    this.indicesRes = null;
    this.polygonOffset = null;

    this.vro.__$detachThis();

    this.vro = null;

    this.tro.__$detachThis();

    this.tro = null;
    this.texMid = -1;
    this.__$rprouid = -1;
    this.ubo = null;
    this.shdUid = -1;
    this.vtxUid = -1;
    this.uniform = null;
    this.transUniform = null;
    this.partGroup = null;
    this.ivsIndex = 0;
    this.ivsCount = 0;
    this.insCount = 0;
    this.partTotal = 0;
    this.drawMode = 0;
    this.drawFlag = 0x0;
    this.renderState = 0;
    this.rcolorMask = 0;
    this.drawEnabled = true;
    this.shader = null;
    this.bounds = null;
    this.pos = null;
  }

  destroy() {
    this.reset();
  }

  toString() {
    return "[RPOUnit(uid = " + this.uid + ")]";
  }

}

exports.default = RPOUnit;

/***/ }),

/***/ "c711":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/
// 射线检测拾取代理对象

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const RaySelectedNode_1 = __importDefault(__webpack_require__("c120"));

const AABBCalc_1 = __webpack_require__("e160");

class RaySelector {
  constructor() {
    this.m_renderer = null;
    this.m_camera = null;
    this.m_headNode = null;
    this.m_rsn = null; // 最多检测256个对象

    this.m_hitList = new Uint8Array(256);
    this.m_rsnList = null;
    this.m_selectedNode = null;
    this.m_selectedTotal = 0;
    this.m_testMode = 0;
    this.m_invpv = new Vector3D_1.default();
    this.m_invtv = new Vector3D_1.default();
    this.m_rlpv = null;
    this.m_rltv = null;
    this.m_rlsiv = new Uint8Array(4);
    this.m_rlinvtv = new Vector3D_1.default();
    this.m_outv = new Vector3D_1.default();
    this.m_vecs = [null, null];
    this.m_gpuTestEnabled = false;
  } //  setGPUTestEnabled(enabled:boolean):void
  //  {
  //      this.m_gpuTestEnabled = enabled;
  //  }


  setRenderer(renderer) {
    this.m_renderer = renderer;
  }

  setRayTestMode(testMode) {
    this.m_testMode = testMode;
  }

  setRay(rlpv, rltv) {
    this.m_rlpv = rlpv;
    this.m_rltv = rltv;
  }

  getRay(out_rlpv, out_rltv) {
    out_rlpv.copyFrom(this.m_rlpv);
    out_rltv.copyFrom(this.m_rltv);
  }

  setCamera(cam) {
    this.m_camera = cam;
  }

  setCullingNodeHead(headNode) {
    this.m_headNode = headNode;

    if (this.m_rsnList == null) {
      this.m_rsnList = [];
      let i = 0;

      for (; i < 256; ++i) {
        this.m_rsnList.push(new RaySelectedNode_1.default());
      }
    }
  } //  setSelectedNode(node:RaySelectedNode):void
  //  {
  //      this.m_selectedNode = node;
  //  }


  getSelectedNode() {
    return this.m_selectedNode;
  } //  setSelectedNodes(nodes:RaySelectedNode[], total:number):void
  //  {
  //      //this.m_rsnList = nodes;
  //  }


  getSelectedNodes() {
    return this.m_rsnList;
  }

  getSelectedNodesTotal() {
    return this.m_selectedTotal;
  }

  sorting(low, high) {
    let arr = this.m_rsnList; //标记位置为待排序数组段的low处也就时枢轴值

    this.m_rsn = arr[low];

    while (low < high) {
      //  如果当前数字已经有序的位于我们的枢轴两端，我们就需要移动它的指针，是high或是low
      while (low < high && arr[high].dis >= this.m_rsn.dis) {
        --high;
      } // 如果当前数字不满足我们的需求，我们就需要将当前数字移动到它应在的一侧


      arr[low] = arr[high];

      while (low < high && arr[low].dis <= this.m_rsn.dis) {
        ++low;
      }

      arr[high] = arr[low];
    }

    arr[low] = this.m_rsn;
    return low;
  }

  snsort(low, high) {
    if (low < high) {
      let pos = this.sorting(low, high);
      this.snsort(low, pos - 1);
      this.snsort(pos + 1, high);
    }
  }

  run() {
    let nextNode = this.m_headNode; //console.log("RaySelect run() nextNode != null: "+(nextNode != null));

    if (nextNode != null) {
      let dis = 0.0;
      let rtv = this.m_rltv;
      let rpv = this.m_rlpv;
      let outv = this.m_outv;
      let node = null;
      let total = 0; //console.log("raySelector rpv,rtv: ", rpv, rtv);

      if (Math.abs(rtv.x) > MathConst_1.default.MATH_MIN_POSITIVE) {
        this.m_rlinvtv.x = 1.0 / rtv.x;
      } else {
        this.m_rlinvtv.x = MathConst_1.default.MATH_MAX_POSITIVE;
      }

      if (Math.abs(rtv.y) > MathConst_1.default.MATH_MIN_POSITIVE) {
        this.m_rlinvtv.y = 1.0 / rtv.y;
      } else {
        this.m_rlinvtv.y = MathConst_1.default.MATH_MAX_POSITIVE;
      }

      if (Math.abs(rtv.z) > MathConst_1.default.MATH_MIN_POSITIVE) {
        this.m_rlinvtv.z = 1.0 / rtv.z;
      } else {
        this.m_rlinvtv.z = MathConst_1.default.MATH_MAX_POSITIVE;
      }

      if (this.m_rlinvtv.x < 0) this.m_rlsiv[0] = 1;else this.m_rlsiv[0] = 0;
      if (this.m_rlinvtv.y < 0) this.m_rlsiv[1] = 1;else this.m_rlsiv[1] = 0;
      if (this.m_rlinvtv.z < 0) this.m_rlsiv[2] = 1;else this.m_rlsiv[2] = 0;

      while (nextNode != null) {
        if (nextNode.drawEnabled && nextNode.entity.mouseEnabled) {
          //if(AABB.IntersectionRL2(rtv,rpv, nextNode.bounds, outv))
          outv.x = nextNode.bounds.center.x - rpv.x;
          outv.y = nextNode.bounds.center.y - rpv.y;
          outv.z = nextNode.bounds.center.z - rpv.z;
          dis = outv.dot(rtv);
          outv.x -= dis * rtv.x;
          outv.y -= dis * rtv.y;
          outv.z -= dis * rtv.z;

          if (outv.getLengthSquared() <= nextNode.bounds.radius2) {
            // 如果只是几何检测(例如球体包围体的检测)就不需要在进入后续的aabb检测
            if (nextNode.rayTestState < 1) {
              this.m_vecs[0] = nextNode.bounds.min;
              this.m_vecs[1] = nextNode.bounds.max;

              if (AABBCalc_1.AABBCalc.IntersectionRL3(this.m_vecs, this.m_rlsiv, this.m_rlinvtv, rtv, rpv, outv)) {
                node = this.m_rsnList[total];
                node.entity = nextNode.entity;
                node.dis = this.m_rlinvtv.w;
                node.wpv.copyFrom(outv); //  console.log("H Hit Dis: "+rtv.dot(outv));
                //console.log("Ray hit test a renderNode.");

                ++total;
              }
            } //  else
            //  {
            //      //其他检测方式
            //  }

          }
        }

        nextNode = nextNode.next;
      }

      this.m_selectedNode = null;
      let i = 0;

      if (total > 0) {
        let invpv = this.m_invpv;
        let invtv = this.m_invtv;
        let entity = null;
        let flag = 0;
        let hitTotal = 0;
        let mat4 = null;
        let rayNode = null; //let pvdis: number = rtv.dot(rpv);
        //let preDis: number = 0.0;

        if (total > 1) {
          //console.log("### A total: ",total);
          //  this.snsort(0, total - 1);
          let polyTest = !this.m_gpuTestEnabled;

          for (i = 0; i < total; ++i) {
            rayNode = this.m_rsnList[i];
            rayNode.dis = MathConst_1.default.MATH_MAX_POSITIVE;
            rayNode.flag = 0;
            entity = this.m_rsnList[i].entity;

            if (entity.isPolyhedral()) {
              if (polyTest) {
                //console.log("a0 ",entity);
                mat4 = entity.getInvMatrix();
                mat4.transformOutVector3(rpv, invpv);
                mat4.deltaTransformOutVector(rtv, invtv);
                invtv.normalize();
                flag = entity.testRay(invpv, invtv, outv, true);
              } else {
                //console.log("a1 ",entity);
                flag = 0;
              }
            } else {
              //console.log("a2 ",entity);
              mat4 = entity.getInvMatrix();
              mat4.transformOutVector3(rpv, invpv);
              mat4.deltaTransformOutVector(rtv, invtv);
              invtv.normalize();
              flag = entity.testRay(invpv, invtv, outv, true);
            }

            if (flag > 0) {
              rayNode.flag = flag;
              rayNode.lpv.copyFrom(outv);
              entity.getMatrix().transformOutVector3(outv, rayNode.wpv); // rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;

              rayNode.dis = Vector3D_1.default.Distance(rayNode.wpv, rpv); //console.log("rayNode.dis: ",rayNode.dis, entity);

              this.m_hitList[hitTotal] = i;
              ++hitTotal; //console.log("YYYYYYYYYYYYYYYes multi Ray hit mesh success.");
              // if (rayNode.dis > preDis) {
              //     this.m_selectedNode = rayNode;
              //     break;
              // }
            } else if (flag < 0) {
              //console.log(">>> a0 ",entity);
              //console.log("NNNNNNNNNNNNNNNNo multi Ray hit mesh 没有做进一步的检测.");
              this.m_hitList[hitTotal] = i;
              ++hitTotal; // if (rayNode.dis > preDis) {
              //     this.m_selectedNode = rayNode;
              //     break;
              // }
            } //  preDis = rayNode.dis;

          } // if (this.m_selectedNode == null && hitTotal > 0) {
          //     this.m_selectedNode = this.m_rsnList[this.m_hitList[0]];
          // }


          this.snsort(0, total - 1);

          for (i = 0; i < total; ++i) {
            //console.log(i+","+this.m_rsnList[i].entity,this.m_rsnList[i].flag);
            if (this.m_rsnList[i].flag > 0) {
              this.m_selectedNode = this.m_rsnList[i];
              break;
            }
          } //console.log("### B total: ",total);

        } else {
          rayNode = this.m_rsnList[0];
          rayNode.dis = MathConst_1.default.MATH_MAX_POSITIVE;
          entity = this.m_rsnList[0].entity;
          mat4 = entity.getInvMatrix();
          mat4.transformOutVector3(rpv, invpv);
          mat4.deltaTransformOutVector(rtv, invtv);
          invtv.normalize();
          flag = entity.testRay(invpv, invtv, outv, true); //console.log("one hit flag: " + flag);

          if (flag > 0) {
            rayNode.lpv.copyFrom(outv);
            entity.getMatrix().transformOutVector3(outv, rayNode.wpv); //rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;

            rayNode.dis = Vector3D_1.default.Distance(rayNode.wpv, rpv);
            this.m_selectedNode = rayNode; //console.log("YYYYYYYYYYYYYYYes Ray hit mesh success.");
          } else if (flag < 0) {
            //console.log("NNNNNNNNNNNNNNNo Ray hit mesh 没有做进一步的检测.");
            this.m_selectedNode = rayNode;
          }
        } //console.log("YYYYYYYYYYYYYYYes Ray hit success.");

      }

      i = total;

      for (; i < this.m_selectedTotal; ++i) {
        //console.log("清理多余的 entity i: "+i);
        if (this.m_selectedNode != this.m_rsnList[i]) {
          this.m_rsnList[i].entity = null;
        }
      }

      this.m_selectedTotal = total; //  else
      //  {
      //      console.log("NNNNNNNNNNNNNNNo Ray hit failure.");
      //  }
    }
  }

  clear() {
    this.m_selectedNode = null;
  }

}

exports.default = RaySelector;

/***/ }),

/***/ "ca6c":
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

class BitConst {
  static PushThreeBitValueToInt(target, value) {
    return (target << 3) + value;
  }

  static PopThreeBitValueFromInt(target) {
    BitConst.value = 7 & target;
    return target >> 3;
  }

  static ContainsBit(target, bit) {
    return (bit & target) > 0;
  }

  static RemoveBit(target, bit) {
    return ~bit & target;
  }

  static AddBit(target, bit) {
    return bit | target;
  } //


  static AssembleFromIntArray(intArray) {
    let i = 0;
    let bit = 0x0;
    let len = intArray.length;

    for (; i < len; ++i) {
      if (intArray[i] > 0) {
        bit |= 1 << i;
      }
    }

    return bit;
  }

}

BitConst.BIT_ZERO = 0;
BitConst.BIT_ONE_0 = 1; //0b1

BitConst.BIT_ONE_1 = 1 << 1; //0b10

BitConst.BIT_ONE_2 = 1 << 2; //0b100

BitConst.BIT_ONE_3 = 1 << 3; //0b1000

BitConst.BIT_ONE_4 = 1 << 4; //0b10000

BitConst.BIT_ONE_5 = 1 << 5; //0b100000

BitConst.BIT_ONE_6 = 1 << 6; //0b1000000

BitConst.BIT_ONE_7 = 1 << 7; //0b10000000

BitConst.BIT_ONE_8 = 1 << 8; //0b100000000

BitConst.BIT_ONE_9 = 1 << 9; //0b1000000000

BitConst.BIT_ONE_10 = 1 << 10; //0b10000000000

BitConst.BIT_ONE_11 = 1 << 11; //0b100000000000

BitConst.value = 0;
exports.default = BitConst;

/***/ }),

/***/ "cc48":
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
var SpaceCullingMask;

(function (SpaceCullingMask) {
  SpaceCullingMask[SpaceCullingMask["NONE"] = 0] = "NONE"; // 需要做摄像机的可见剔除

  SpaceCullingMask[SpaceCullingMask["CAMERA"] = 1] = "CAMERA"; // project occlusion volume

  SpaceCullingMask[SpaceCullingMask["POV"] = 2] = "POV"; // 包含在遮挡体内部的不会进行遮挡剔除计算

  SpaceCullingMask[SpaceCullingMask["INNER_POV_PASS"] = 3] = "INNER_POV_PASS"; // 摄像机和POV都要做遮挡剔除

  SpaceCullingMask[SpaceCullingMask["CAMERA_AND_POV"] = 4] = "CAMERA_AND_POV";
})(SpaceCullingMask || (SpaceCullingMask = {}));

exports.SpaceCullingMask = SpaceCullingMask;

/***/ }),

/***/ "ccdf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureConst_1 = __webpack_require__("8d98");

const RTTTextureProxy_1 = __importDefault(__webpack_require__("cfaf"));

const DepthTextureProxy_1 = __importDefault(__webpack_require__("acaa"));

const WrapperTextureProxy_1 = __importDefault(__webpack_require__("85b6"));

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));
/**
 * 本类作为所有RTT纹理对象的管理类
 */


class RTTTextureStore {
  constructor(renderProxy) {
    this.m_renderProxy = null; // reusable rtt texture resources for one renderer context

    this.m_rttTexs = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.m_rttCubeTexs = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.m_rttFloatTexs = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.m_rttDepthTexs = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.m_renderProxy = renderProxy;
  }

  getRenderProxy() {
    return this.m_renderProxy;
  }

  createWrapperTex(pw, ph, powerof2Boo = false) {
    let tex = new WrapperTextureProxy_1.default(pw, ph, powerof2Boo);
    return tex;
  }

  createRTTTex2D(pw, ph, powerof2Boo = false) {
    let tex = new RTTTextureProxy_1.default(pw, ph, powerof2Boo);
    return tex;
  }

  createDepthTex2D(pw, ph, powerof2Boo = false) {
    let tex = new DepthTextureProxy_1.default(pw, ph, powerof2Boo);
    return tex;
  }

  getCubeRTTTextureAt(i) {
    if (this.m_rttCubeTexs[i] != null) {
      this.m_rttCubeTexs[i].__$setRenderProxy(this.m_renderProxy);

      return this.m_rttCubeTexs[i];
    }

    this.m_rttCubeTexs[i] = this.createRTTTex2D(32, 32);
    this.m_rttCubeTexs[i].toCubeTexture();
    this.m_rttCubeTexs[i].name = "sys_cube_rttTex_" + i;
    this.m_rttCubeTexs[i].minFilter = TextureConst_1.TextureConst.LINEAR;
    this.m_rttCubeTexs[i].magFilter = TextureConst_1.TextureConst.LINEAR;

    this.m_rttCubeTexs[i].__$setRenderProxy(this.m_renderProxy);

    return this.m_rttCubeTexs[i];
  }

  createCubeRTTTextureAt(i, pw, ph) {
    pw = pw > 1 ? pw : 1;
    ph = ph > 1 ? ph : 1;

    if (this.m_rttCubeTexs[i] != null) {
      this.m_rttCubeTexs[i].__$setRenderProxy(this.m_renderProxy);

      return this.m_rttCubeTexs[i];
    }

    this.m_rttCubeTexs[i] = this.createRTTTex2D(pw, ph);
    this.m_rttCubeTexs[i].toCubeTexture();
    this.m_rttCubeTexs[i].name = "sys_cube_rttTex_" + i;
    this.m_rttCubeTexs[i].minFilter = TextureConst_1.TextureConst.LINEAR;
    this.m_rttCubeTexs[i].magFilter = TextureConst_1.TextureConst.LINEAR;

    this.m_rttCubeTexs[i].__$setRenderProxy(this.m_renderProxy);

    return this.m_rttCubeTexs[i];
  }

  getRTTTextureAt(i) {
    if (this.m_rttTexs[i] != null) {
      this.m_rttTexs[i].__$setRenderProxy(this.m_renderProxy);

      return this.m_rttTexs[i];
    }

    this.m_rttTexs[i] = this.createRTTTex2D(32, 32);
    this.m_rttTexs[i].to2DTexture();
    this.m_rttTexs[i].name = "sys_rttTex_" + i;
    this.m_rttTexs[i].minFilter = TextureConst_1.TextureConst.LINEAR;
    this.m_rttTexs[i].magFilter = TextureConst_1.TextureConst.LINEAR;

    this.m_rttTexs[i].__$setRenderProxy(this.m_renderProxy);

    return this.m_rttTexs[i];
  }

  createRTTTextureAt(i, pw, ph) {
    pw = pw > 1 ? pw : 1;
    ph = ph > 1 ? ph : 1;

    if (this.m_rttTexs[i] != null) {
      this.m_rttTexs[i].__$setRenderProxy(this.m_renderProxy);

      return this.m_rttTexs[i];
    }

    this.m_rttTexs[i] = this.createRTTTex2D(pw, ph);
    this.m_rttTexs[i].to2DTexture();
    this.m_rttTexs[i].name = "sys_rttTex_" + i;
    this.m_rttTexs[i].minFilter = TextureConst_1.TextureConst.LINEAR;
    this.m_rttTexs[i].magFilter = TextureConst_1.TextureConst.LINEAR;

    this.m_rttTexs[i].__$setRenderProxy(this.m_renderProxy);

    return this.m_rttTexs[i];
  }

  getDepthTextureAt(i) {
    if (this.m_rttDepthTexs[i] != null) {
      this.m_rttDepthTexs[i].__$setRenderProxy(this.m_renderProxy);

      return this.m_rttDepthTexs[i];
    }

    this.m_rttDepthTexs[i] = this.createDepthTex2D(64, 64);
    this.m_rttDepthTexs[i].to2DTexture();
    this.m_rttDepthTexs[i].name = "sys_depthTex_" + i;
    this.m_rttDepthTexs[i].minFilter = TextureConst_1.TextureConst.NEAREST;
    this.m_rttDepthTexs[i].magFilter = TextureConst_1.TextureConst.NEAREST;

    this.m_rttDepthTexs[i].__$setRenderProxy(this.m_renderProxy);

    return this.m_rttDepthTexs[i];
  }

  createDepthTextureAt(i, pw, ph) {
    pw = pw > 1 ? pw : 1;
    ph = ph > 1 ? ph : 1;

    if (this.m_rttDepthTexs[i] != null) {
      this.m_rttDepthTexs[i].__$setRenderProxy(this.m_renderProxy);

      return this.m_rttDepthTexs[i];
    }

    this.m_rttDepthTexs[i] = this.createDepthTex2D(pw, ph);
    this.m_rttDepthTexs[i].to2DTexture();
    this.m_rttDepthTexs[i].name = "sys_depthTex_" + i;

    this.m_rttDepthTexs[i].__$setRenderProxy(this.m_renderProxy);

    return this.m_rttDepthTexs[i];
  }

  getRTTFloatTextureAt(i) {
    if (this.m_rttFloatTexs[i] != null) {
      this.m_rttFloatTexs[i].__$setRenderProxy(this.m_renderProxy);

      return this.m_rttFloatTexs[i];
    }

    let tex = this.createRTTTex2D(64, 64);
    tex.to2DTexture();
    this.m_rttFloatTexs[i] = tex;
    this.m_rttFloatTexs[i].name = "sys_rttFloatTex_" + i;
    tex.internalFormat = TextureConst_1.TextureFormat.RGBA16F;
    tex.srcFormat = TextureConst_1.TextureFormat.RGBA;
    tex.dataType = TextureConst_1.TextureDataType.FLOAT;
    tex.minFilter = TextureConst_1.TextureConst.NEAREST;
    tex.magFilter = TextureConst_1.TextureConst.NEAREST;

    if (RendererDevice_1.default.IsWebGL1()) {
      tex.dataType = TextureConst_1.TextureDataType.HALF_FLOAT_OES;
    }

    this.m_rttFloatTexs[i].__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

  createRTTFloatTextureAt(i, pw, ph) {
    pw = pw > 1 ? pw : 1;
    ph = ph > 1 ? ph : 1;

    if (this.m_rttFloatTexs[i] != null) {
      this.m_rttFloatTexs[i].__$setRenderProxy(this.m_renderProxy);

      return this.m_rttFloatTexs[i];
    }

    let tex = this.createRTTTex2D(pw, ph);
    tex.to2DTexture();
    this.m_rttFloatTexs[i] = tex;
    this.m_rttFloatTexs[i].name = "sys_rttFloatTex_" + i;
    tex.internalFormat = TextureConst_1.TextureFormat.RGBA16F;
    tex.srcFormat = TextureConst_1.TextureFormat.RGBA;
    tex.dataType = TextureConst_1.TextureDataType.FLOAT;
    tex.minFilter = TextureConst_1.TextureConst.NEAREST;
    tex.magFilter = TextureConst_1.TextureConst.NEAREST;

    if (RendererDevice_1.default.IsWebGL1()) {
      tex.dataType = TextureConst_1.TextureDataType.HALF_FLOAT_OES;
    }

    this.m_rttFloatTexs[i].__$setRenderProxy(this.m_renderProxy);

    return tex;
  }

}

exports.RTTTextureStore = RTTTextureStore;

/***/ }),

/***/ "cfaf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const TextureProxy_1 = __importDefault(__webpack_require__("0851"));

class RTTTextureProxy extends TextureProxy_1.default {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.m_type = TextureProxyType_1.TextureProxyType.RTT;
    this.minFilter = TextureConst_1.TextureConst.NEAREST;
    this.magFilter = TextureConst_1.TextureConst.NEAREST;
  }

  to2DTexture() {
    this.m_texTarget = TextureConst_1.TextureTarget.TEXTURE_2D;
  }

  toCubeTexture() {
    this.m_texTarget = TextureConst_1.TextureTarget.TEXTURE_CUBE;
  }

  setSize(fboTextureWidth, fboTextureHeight) {
    this.m_texWidth = fboTextureWidth;
    this.m_texHeight = fboTextureHeight;
  }

  enableMipmap() {
    this.minFilter = TextureConst_1.TextureConst.LINEAR_MIPMAP_LINEAR;
    this.magFilter = TextureConst_1.TextureConst.LINEAR;
    this.mipmapEnabled = true;
  }

  disableMipmap() {
    this.minFilter = TextureConst_1.TextureConst.NEAREST;
    this.magFilter = TextureConst_1.TextureConst.NEAREST;
    this.mipmapEnabled = false;
  }

  uploadFromFbo(texResource, fboWidth, fboHeight) {
    let gl = texResource.getRC();
    let mEnabled = this.mipmapEnabled;
    this.mipmapEnabled = false;

    if (!texResource.hasResUid(this.getResUid())) {
      this.m_sampler = TextureConst_1.TextureTarget.GetValue(gl, this.m_texTarget);
      this.createTexBuf(texResource);
      texResource.bindToGpu(this.getResUid());
      this.bindTexture(gl, fboWidth, fboHeight);
      this.m_haveRData = true;
      this.m_texWidth = fboWidth;
      this.m_texHeight = fboHeight;

      this.__$buildParam(gl);
    } else if (this.getBufWidth() != fboWidth || this.getBufHeight() != fboHeight) {
      texResource.bindToGpu(this.getResUid());
      this.bindTexture(gl, fboWidth, fboHeight);
      this.m_texWidth = fboWidth;
      this.m_texHeight = fboHeight;

      this.__$buildParam(gl);
    }

    this.mipmapEnabled = mEnabled;
  }

  bindTexture(rgl, fboWidth, fboHeight) {
    let interType = TextureConst_1.TextureFormat.ToGL(rgl, this.internalFormat);
    let format = TextureConst_1.TextureFormat.ToGL(rgl, this.srcFormat);
    let type = TextureConst_1.TextureDataType.ToGL(rgl, this.dataType); //console.log(this,", fboWidth, fboHeight: ",fboWidth, fboHeight, interType,format);

    switch (this.m_texTarget) {
      case TextureConst_1.TextureTarget.TEXTURE_2D:
        rgl.texImage2D(rgl.TEXTURE_2D, 0, interType, fboWidth, fboHeight, 0, format, type, null);
        break;

      case TextureConst_1.TextureTarget.TEXTURE_CUBE:
        for (let i = 0; i < 6; ++i) {
          rgl.texImage2D(rgl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, interType, fboWidth, fboHeight, 0, format, type, null);
        }

        break;

      case TextureConst_1.TextureTarget.TEXTURE_SHADOW_2D:
        rgl.texImage2D(rgl.TEXTURE_2D, 0, rgl.DEPTH_COMPONENT16, fboWidth, fboHeight, 0, rgl.DEPTH_COMPONENT, rgl.FLOAT, null);
        break;

      default:
        break;
    }
  }

  toString() {
    return "[RTTTextureProxy(name:" + this.name + ",uid=" + this.getUid() + ",width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

}

exports.default = RTTTextureProxy;

/***/ }),

/***/ "d314":
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
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const TextureProxy_1 = __importDefault(__webpack_require__("0851"));

class ImageCubeTextureProxy extends TextureProxy_1.default {
  constructor(texWidth, texHeight) {
    super(texWidth, texHeight, false);
    this.m_imgDataList = null;
    this.m_texTarget = TextureConst_1.TextureTarget.TEXTURE_CUBE;
    this.m_type = TextureProxyType_1.TextureProxyType.ImageCube;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA;
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.dataType = TextureConst_1.TextureDataType.UNSIGNED_BYTE;
    this.mipmapEnabled = true;
  }

  setDataFromImageToFaceAt(index, img, miplevel = 0) {
    if (img != null) {
      if (this.m_imgDataList == null) {
        this.m_imgDataList = [null, null, null, null, null, null];
      }

      if (img.width > 0 && img.height > 0) {
        if (index == 0) {
          this.m_texWidth = img.width;
          this.m_texHeight = img.height;
          this.m_miplevel = miplevel;
        }

        this.m_imgDataList[index] = {
          imgData: img,
          miplevel: miplevel
        };
        this.m_haveRData = this.m_imgDataList[index] != null;
      }
    }
  }

  uploadData(texRes) {
    let gl = texRes.getRC();
    let imo = null;

    for (let i = 0; i < 6; ++i) {
      imo = this.m_imgDataList[i];
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.m_miplevel, TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat), TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat), TextureConst_1.TextureDataType.ToGL(gl, this.dataType), imo.imgData);
    }
  }

  toString() {
    return "[ImageCubeTextureProxy(name:" + this.name + ",uid=" + this.getUid() + ",width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

  __$destroy() {
    if (this.getAttachCount() < 1) {
      if (this.m_imgDataList != null) {
        for (let i = 0; i < 6; ++i) {
          if (this.m_imgDataList[i] != null) {
            this.m_imgDataList[i].imgData = null;
          }
        }
      }

      console.log("ImageCubeTextureProxy::destroy(), destroy a ImageCubeTextureProxy instance...");

      super.__$destroy();
    }
  }

}

exports.default = ImageCubeTextureProxy;

/***/ }),

/***/ "d53d":
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

class ShaderUniform {
  constructor() {
    this.uns = "";
    this.program = null;
    this.types = null;
    this.uniformSize = 0;
    this.uniformNameList = null;
    this.locations = null;
    this.dataSizeList = null;
    this.dataList = null;
    this.calcModels = null;
    this.always = true;
    this.next = null;
  } // for fast data's operation


  getDataRefFromUniformName(ns) {
    if (this.uniformNameList != null) {
      let list = this.uniformNameList;
      let len = list.length;

      for (let i = 0; i < len; ++i) {
        if (ns == list[i]) {
          return this.dataList[i];
        }
      }
    }

    return null;
  } // for fast data's operation


  setDataRefFromUniformName(ns, dataRef) {
    if (this.uniformNameList != null) {
      let list = this.uniformNameList;
      let len = list.length;

      for (let i = 0; i < len; ++i) {
        if (ns == list[i]) {
          this.dataList[i] = dataRef;
          break;
        }
      }
    }
  }

  copyDataFromProbe(probe) {
    this.types = [];
    this.dataSizeList = [];

    for (let i = 0; i < probe.uniformsTotal; ++i) {
      this.types.push(probe.uniformTypes[i]);
      this.dataSizeList.push(probe.dataSizeList[i]);
    }

    this.uniformSize = probe.uniformsTotal;
  }

  useByLocation(rc, type, location, i) {}

  useByShd(rc, shd) {}

  use(rc) {}

  updateData() {}

  destroy() {}

}

exports.ShaderUniform = ShaderUniform; // for webgl1

class ShaderUniformV1 extends ShaderUniform {
  constructor() {
    super();
  }

  use(rc) {
    let i = 0;

    for (; i < this.uniformSize; ++i) {
      rc.useUniformV1(this.locations[i], this.types[i], this.dataList[i], this.dataSizeList[i]);
    }
  }

  useByLocation(rc, type, location, i) {
    rc.useUniformV1(location, type, this.dataList[i], this.dataSizeList[i]);
  }

  useByShd(rc, shd) {
    let i = 0;

    for (; i < this.uniformSize; ++i) {
      //rc.useUniformV1(shd.getUniformLocationByNS(this.uniformNameList[i]),shd.getUniformTypeByNS(this.uniformNameList[i]),this.dataList[i],this.dataSizeList[i]);
      rc.useUniformV1(shd.getUniformLocationByNS(this.uniformNameList[i]), this.types[i], this.dataList[i], this.dataSizeList[i]);
    }
  }

  updateData() {
    if (this.calcModels != null) {
      let len = this.calcModels.length;
      let model = null;

      for (let i = 0; i < len; ++i) {
        model = this.calcModels[i];
        model.buildData();
        model.updateMaterialDataList(this.dataList);
        model.initializeParam();
      }
    }
  }

  destroy() {
    let i = 0;
    let len = this.dataList.length;

    for (; i < len; ++i) {
      this.dataList[i] = null;
    }

    if (this.calcModels != null) {
      len = this.calcModels.length;

      for (i = 0; i < len; ++i) {
        this.calcModels[i].destroy();
        this.calcModels[i] = null;
      }
    }

    this.dataList = null;
    this.types = null;
    this.locations = null;
    this.dataSizeList = null;
    this.calcModels = null;
  }

}

exports.ShaderUniformV1 = ShaderUniformV1; // for webgl2

class ShaderUniformV2 extends ShaderUniform {
  constructor() {
    super();
  }

  use(rc) {
    // new DebugFlag
    // if(this.uns == "ggg" && DebugFlag.Flag_0 > 0) {
    //     let arr = this.dataList[0].slice(0);
    //     console.log("ggg arr: ",arr);
    // }
    let i = 0;

    for (; i < this.uniformSize; ++i) {
      rc.useUniformV2(this.locations[i], this.types[i], this.dataList[i], this.dataSizeList[i], 0);
    }
  }

  useByLocation(rc, type, location, i) {
    rc.useUniformV2(location, type, this.dataList[i], this.dataSizeList[i], 0);
  }

  useByShd(rc, shd) {
    let i = 0;

    for (; i < this.uniformSize; ++i) {
      //rc.useUniformV2(shd.getUniformLocationByNS(this.uniformNameList[i]),shd.getUniformTypeByNS(this.uniformNameList[i]),this.dataList[i],this.dataSizeList[i],0);
      rc.useUniformV2(shd.getUniformLocationByNS(this.uniformNameList[i]), this.types[i], this.dataList[i], this.dataSizeList[i], 0);
    }
  }

  updateData() {
    if (this.calcModels != null) {
      let len = this.calcModels.length;
      let model = null;

      for (let i = 0; i < len; ++i) {
        model = this.calcModels[i];
        model.buildData();
        model.updateMaterialDataList(this.dataList);
        model.initializeParam();
      }
    }
  }

  destroy() {
    let i = 0;
    let len = this.dataList.length;

    for (; i < len; ++i) {
      this.dataList[i] = null;
    }

    if (this.calcModels != null) {
      len = this.calcModels.length;

      for (i = 0; i < len; ++i) {
        this.calcModels[i].destroy();
        this.calcModels[i] = null;
      }
    }

    this.dataList = null;
    this.types = null;
    this.locations = null;
    this.dataSizeList = null;
    this.calcModels = null;
    this.program = null;
  }

}

exports.ShaderUniformV2 = ShaderUniformV2;
/**
 * 只有一个mat4的uniform对象
 * only one mat4 type uniform object
 */

class ShaderMat4Uniform extends ShaderUniform {
  constructor() {
    super();
  }

  use(rc) {
    rc.useUniformMat4(this.locations[0], this.dataList[0]);
  }

  useByLocation(rc, type, location, i) {
    rc.useUniformMat4(location, this.dataList[0]);
  }

  useByShd(rc, shd) {
    rc.useUniformMat4(shd.getUniformLocationByNS(this.uniformNameList[0]), this.dataList[0]);
  }

  destroy() {
    this.dataList[0] = null;
    this.dataList = null;
    this.types = null;
    this.locations = null;
    this.dataSizeList = null;
  }

}

exports.ShaderMat4Uniform = ShaderMat4Uniform;
exports.default = ShaderUniform;

/***/ }),

/***/ "d7e2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2019-2022 by                                                 */

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

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));
/**
 * 在 renderer process 中 通过和摄像机之间的距离, 对可渲染对象渲染先后顺序的排序
 */


class CameraDsistanceSorter {
  constructor(rc) {
    this.m_rc = null;
    this.m_rc = rc;
  }

  sortRODisplay(nodes, nodesTotal) {
    let camPos = this.m_rc.getCamera().getPosition();

    for (let i = 0; i < nodesTotal; ++i) {
      nodes[i].value = -Vector3D_1.default.DistanceSquared(nodes[i].bounds.center, camPos); //nodes[i].value = nodes[i].pos.y;
    }

    return 0;
  }

}

exports.default = CameraDsistanceSorter;

/***/ }),

/***/ "d872":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const UniformDataSlot_1 = __webpack_require__("5326");

const ShaderUniformProbe_1 = __importDefault(__webpack_require__("3077"));

const UniformVec4Probe_1 = __importDefault(__webpack_require__("3024"));

const ShaderGlobalUniform_1 = __importDefault(__webpack_require__("7279"));

class ShaderUniformContext {
  constructor(rcuid, dataTotal = 256) {
    this.m_rcuid = 0;
    this.m_udSlot = null;
    this.m_rcuid = rcuid;
    this.m_udSlot = new UniformDataSlot_1.UniformDataSlot(rcuid, dataTotal);
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_rcuid;
  }

  createShaderUniformProbe() {
    let probe = new ShaderUniformProbe_1.default(this.m_udSlot);
    return probe;
  }

  createUniformVec4Probe(vec4Total) {
    let probe = new UniformVec4Probe_1.default(this.m_udSlot, vec4Total);
    return probe;
  }

  createGlobalUinformFromProbe(uProbe, uniformNames = null) {
    let suo = this.createShaderGlobalUniform();
    this.updateGlobalUinformDataFromProbe(suo, uProbe, uniformNames);
    return suo;
  }

  updateGlobalUinformDataFromProbe(psuo, uProbe, uniformNames = null) {
    let suo = psuo;
    suo.uniformNameList = uniformNames != null ? uniformNames : uProbe.uniformNames;
    suo.copyDataFromProbe(uProbe);
    uProbe.update();
  }

  createShaderGlobalUniform() {
    let suo = new ShaderGlobalUniform_1.default(this.m_udSlot);
    return suo;
  }

  createShaderGlobalUniformFromProbe(uProbe, puns, uniformNames = null) {
    let suo = new ShaderGlobalUniform_1.default(this.m_udSlot);
    suo.uns = puns;
    suo.uniformNameList = uniformNames != null ? uniformNames : uProbe.uniformNames;
    suo.copyDataFromProbe(uProbe);
    uProbe.update();
    return suo;
  }

  createShaderGlobalUniformFromProbeAt(uProbe, puns, uniformNames = null, index) {
    let suo = new ShaderGlobalUniform_1.default(this.m_udSlot);
    suo.uns = puns;
    suo.uniformNameList = uniformNames != null ? uniformNames : uProbe.uniformNames;

    if (index < 0) {
      suo.copyDataFromProbe(uProbe);
    } else {
      suo.copyDataFromProbeAt(index, uProbe);
    }

    uProbe.update();
    return suo;
  }

  cloneShaderGlobalUniform(psuo) {
    let suo = psuo;
    return suo.clone();
  }

}

exports.ShaderUniformContext = ShaderUniformContext;

/***/ }),

/***/ "d958":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RSEntityFlag_1 = __importDefault(__webpack_require__("11e6"));

const ShaderUniformContext_1 = __webpack_require__("d872");

const RODataBuilder_1 = __importDefault(__webpack_require__("36cb"));

const RendererParam_1 = __importDefault(__webpack_require__("c497"));

const RenderProcessBuider_1 = __importDefault(__webpack_require__("3c81"));

const ROVtxBuilder_1 = __importDefault(__webpack_require__("1e15"));

const RendererInstanceContext_1 = __webpack_require__("0e01");

const RPOUnitBuilder_1 = __webpack_require__("eca0");

const RPONodeBuilder_1 = __importDefault(__webpack_require__("442e"));

const DispEntity3DManager_1 = __importDefault(__webpack_require__("1264"));
/**
 * kernal system instance, it is the renderer instance for the renderer runtime, it is very very very important class.
 */


class RendererInstance {
  constructor() {
    this.___$$$$$$$Author = "VilyLei(vily313@126.com)";
    this.m_uid = -1;
    this.m_entity3DMana = null;
    this.m_processes = [];
    this.m_processesLen = 0;
    this.m_sprocesses = [];
    this.m_sprocessesLen = 0;
    this.m_renderProxy = null;
    this.m_adapter = null;
    this.m_dataBuilder = null;
    this.m_renderInsContext = null;
    this.m_batchEnabled = true;
    this.m_processFixedState = true;
    this.m_rpoUnitBuilder = new RPOUnitBuilder_1.RPOUnitBuilder();
    this.m_rpoNodeBuilder = new RPONodeBuilder_1.default();
    this.m_processBuider = new RenderProcessBuider_1.default();
    this.m_roVtxBuilder = null;
    this.m_stage3D = null;
    this.m_fixProcess = null;
    this.m_uid = RendererInstance.s_uid++;
    this.m_renderInsContext = new RendererInstanceContext_1.RendererInstanceContext(this.m_uid);
  }

  __$setStage3D(stage3D) {
    if (stage3D != null && this.m_stage3D == null) {
      this.m_stage3D = stage3D;
    }
  }

  getUid() {
    return this.m_uid;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_uid;
  }

  getRPONodeBuilder() {
    return this.m_rpoNodeBuilder;
  }

  getDataBuilder() {
    return this.m_dataBuilder;
  }

  getRendererContext() {
    return this.m_renderInsContext;
  }

  getRenderProxy() {
    if (this.m_renderProxy != null) {
      return this.m_renderProxy;
    }

    this.m_renderProxy = this.m_renderInsContext.getRenderProxy();
    return this.m_renderProxy;
  }

  getStage3D() {
    return this.m_renderProxy.getStage3D();
  }

  getViewX() {
    return this.m_adapter.getViewportX();
  }

  getViewY() {
    return this.m_adapter.getViewportY();
  }

  getViewWidth() {
    return this.m_adapter.getViewportWidth();
  }

  getViewHeight() {
    return this.m_adapter.getViewportHeight();
  }

  getCamera() {
    return this.m_renderInsContext.getCamera();
  }

  createCamera() {
    return null;
  }

  useCamera(camera, syncCamView = false) {}

  useMainCamera() {}

  updateCamera() {
    if (this.m_renderProxy != null) {
      this.m_renderProxy.updateCamera();
    }
  }

  initialize(param = null, camera = null, shdProgramBuider = null) {
    if (this.m_dataBuilder == null && camera != null) {
      if (param == null) param = new RendererParam_1.default();
      this.m_batchEnabled = param.batchEnabled;
      this.m_processFixedState = param.processFixedState;
      this.m_renderProxy = this.m_renderInsContext.getRenderProxy();
      this.m_uid = this.m_renderProxy.getUid();
      this.m_dataBuilder = new RODataBuilder_1.default(shdProgramBuider);
      this.m_roVtxBuilder = new ROVtxBuilder_1.default();
      this.m_renderInsContext.setCameraParam(param.camProjParam.x, param.camProjParam.y, param.camProjParam.z);
      let contextParam = new RendererInstanceContext_1.RendererInstanceContextParam();
      contextParam.uniformContext = new ShaderUniformContext_1.ShaderUniformContext(this.m_renderProxy.getRCUid());
      contextParam.camera = camera;
      contextParam.stage = this.m_stage3D;
      contextParam.builder = this.m_dataBuilder;
      contextParam.vtxBuilder = this.m_roVtxBuilder;
      contextParam.shaderProgramBuilder = shdProgramBuider;
      this.m_renderInsContext.initialize(param, camera, contextParam);
      this.m_adapter = this.m_renderProxy.getRenderAdapter();
      this.m_dataBuilder.initialize(this.m_renderProxy, this.m_rpoUnitBuilder, this.m_processBuider, this.m_roVtxBuilder);
      this.m_renderInsContext.initManager(this.m_dataBuilder);
      this.m_entity3DMana = new DispEntity3DManager_1.default(this.m_uid, this.m_dataBuilder, this.m_rpoUnitBuilder, this.m_processBuider);
      this.m_fixProcess = this.createSeparatedProcess();
      this.appendProcess(this.m_batchEnabled, this.m_processFixedState);
    }
  }
  /**
   * 获取渲染器可渲染对象管理器状态(版本号)
   */


  getRendererStatus() {
    return this.m_entity3DMana.version;
  }
  /**
   * update all data or status of the renderer runtime
   * should call this function per frame
   */


  update() {
    this.m_renderProxy.Texture.update();
    this.m_renderProxy.Vertex.update();
    this.m_entity3DMana.update();
  }

  updateAllProcess() {
    for (let i = 0; i < this.m_processesLen; ++i) {
      this.m_processes[i].update();
    }
  }

  updateProcessAt(processIndex) {
    if (processIndex > -1 && processIndex < this.m_processesLen) {
      this.m_processes[processIndex].update();
    }
  }

  setEntityManaListener(listener) {
    this.m_entity3DMana.setListener(listener);
  }
  /**
   * add an entity to the renderer process of the renderer instance
   * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
   * @param processIndex this destination renderer process index of the m_processes array.
   * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
   */


  addEntity(entity, processIndex = 0, deferred = true) {
    if (entity != null) {
      if (entity.__$testRendererEnabled()) {
        if (processIndex > -1 && processIndex < this.m_processesLen) {
          this.m_entity3DMana.addEntity(entity, this.m_processes[processIndex].getUid(), deferred);
        }
      }
    }
  }

  addEntityToProcess(entity, process, deferred = true) {
    if (process != null && entity != null) {
      if (entity.__$testRendererEnabled()) {
        if (process.getRCUid() == this.m_uid) {
          this.m_entity3DMana.addEntity(entity, process.getUid(), deferred);
        }
      }
    }
  }
  /**
   * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
   * move rendering runtime displayEntity to different renderer process
   */


  moveEntityToProcessAt(entity, dstProcessIndex) {
    if (entity != null && entity.getRendererUid() == this.m_uid) {
      if (entity.isInRendererProcess()) {
        if (dstProcessIndex > -1 && dstProcessIndex < this.m_processesLen) {
          let srcUid = entity.getDisplay().__$$runit.getRPROUid();

          let src = this.m_processBuider.getNodeByUid(srcUid);
          let dst = this.m_processes[dstProcessIndex];

          if (src != dst) {
            src.removeDispUnit(entity.getDisplay());
            entity.__$rseFlag = dst.getSortEnabled() ? RSEntityFlag_1.default.AddSortEnabled(entity.__$rseFlag) : RSEntityFlag_1.default.RemoveSortEnabled(entity.__$rseFlag);
            dst.addDisp(entity.getDisplay());
          }
        }
      }
    }
  }

  moveEntityToProcess(entity, dstProcess) {
    if (dstProcess != null && entity != null && entity.getRendererUid() == this.m_uid) {
      if (entity.isInRendererProcess()) {
        let srcUid = entity.getDisplay().__$$runit.getRPROUid();

        let src = this.m_processBuider.getNodeByUid(srcUid);

        if (src != dstProcess) {
          let dst = dstProcess;
          src.removeDispUnit(entity.getDisplay());
          entity.__$rseFlag = dstProcess.getSortEnabled() ? RSEntityFlag_1.default.AddSortEnabled(entity.__$rseFlag) : RSEntityFlag_1.default.RemoveSortEnabled(entity.__$rseFlag);
          dst.addDisp(entity.getDisplay());
        }
      }
    }
  }
  /**
   * remove entity from the renderer instance
   * @param entity IRenderEntity instance
   */


  removeEntity(entity) {
    if (entity != null && entity.getRendererUid() == this.m_uid) {
      this.m_entity3DMana.removeEntity(entity);

      entity.__$setRenderProxy(null);
    }
  }
  /**
   * remove entity from the renderer process
   * @param IRenderEntity IRenderEntity instance
   * @param process RenderProcess instance
   */


  removeEntityFromProcess(entity, process) {
    if (process != null && process.getRCUid() == this.m_uid) {
      if (entity != null && entity.getRendererUid() == this.m_uid) {
        process.removeDisp(entity.getDisplay());

        entity.__$setRenderProxy(null);
      }
    }
  }
  /**
   * remove entity from the renderer process by process index
   * @param IRenderEntity IRenderEntity instance
   * @param processIndex RenderProcess instance index in renderer instance
   */


  removeEntityByProcessIndex(entity, processIndex) {
    if (processIndex >= 0 && processIndex < this.m_processesLen) {
      if (entity != null && entity.getRendererUid() == this.m_uid) {
        this.m_processes[processIndex].removeDisp(entity.getDisplay());

        entity.__$setRenderProxy(null);
      }
    }
  }

  setProcessSortEnabledAt(processIndex, sortEnabled) {
    if (processIndex >= 0 && processIndex < this.m_processesLen) {
      this.m_processes[processIndex].setSortEnabled(sortEnabled);
    }
  }

  setProcessSortEnabled(process, sortEnabled) {
    if (process != null && process.getRCUid() == this.m_uid) {
      let p = process;
      p.setSortEnabled(sortEnabled);
    }
  }
  /**
   * get the renderer process by process index
   * @param processIndex IRenderProcess instance index in renderer instance
   */


  getRenderProcessAt(processIndex) {
    return this.m_processes[processIndex];
  }
  /**
   * append a new renderer process instance
   * @param batchEnabled batch renderer runtime resource data
   * @param processFixedState the process is fix renderer state
   * @returns
   */


  appendProcess(batchEnabled = true, processFixedState = false) {
    this.m_processBuider.setCreateParams(this.m_dataBuilder.getRenderShader(), this.m_rpoNodeBuilder, this.m_rpoUnitBuilder, this.m_renderProxy.Vertex, batchEnabled, processFixedState);
    let process = this.m_processBuider.create();
    this.m_processes.push(process);
    process.setRendererParam(this.m_renderProxy, this.m_processesLen);
    ++this.m_processesLen;
    return process;
  }
  /**
   * append a independent new renderer process instance, and separate the renderer process from the renderer rendering control
   * @param batchEnabled batch renderer runtime resource data
   * @param processFixedState the process is fix renderer state
   */


  createSeparatedProcess(batchEnabled = true, processFixedState = false) {
    this.m_processBuider.setCreateParams(this.m_dataBuilder.getRenderShader(), this.m_rpoNodeBuilder, this.m_rpoUnitBuilder, this.m_renderProxy.Vertex, batchEnabled, processFixedState);
    let process = this.m_processBuider.create();
    this.m_sprocesses.push(process);
    process.setRendererParam(this.m_renderProxy, this.m_sprocessesLen);
    return process;
  }

  setRendererProcessParam(index, batchEnabled, processFixedState) {
    if (index > -1 && index < this.m_processesLen) {
      this.m_processes[index].setRenderParam(batchEnabled, processFixedState);
    }
  }

  getProcessAt(index) {
    if (index > -1 && index < this.m_processesLen) {
      return this.m_processes[index];
    }

    return null;
  }

  showInfoAt(index) {
    if (index > -1 && index < this.m_processesLen) {
      this.m_processes[index].showInfo();
    }
  }

  getProcessesTotal() {
    return this.m_processesLen;
  }

  updateMaterialUniformToCurrentShd(material) {
    this.m_dataBuilder.getRenderShader().useUniformToCurrentShd(material.__$uniform);
  }
  /**
   * Deprecated(废弃, 不推荐使用)
   * 绘制已经完全加入渲染器了渲染资源已经准备完毕的entity
   * 要锁定Material才能用这种绘制方式,再者这个,这种方式比较耗性能，只能用在特殊的地方
   */


  drawEntityByLockMaterial(entity, useGlobalUniform = false, forceUpdateUniform = true) {
    if (entity != null && entity.getVisible() && entity.getRendererUid() == this.m_uid && !this.m_renderProxy.isContextLost()) {
      this.m_fixProcess.drawLockMaterialByDisp(entity.getDisplay(), useGlobalUniform, forceUpdateUniform);
    }
  }
  /**
   * 在任意阶段绘制一个指定的 entity,只要其资源数据准备完整
   */


  drawEntity(entity, useGlobalUniform = false, forceUpdateUniform = true) {
    if (entity != null && entity.getVisible() && !this.m_renderProxy.isContextLost()) {
      // console.log("***8** rendewrer ins drawEntity(), entity: ",entity, entity.getRendererUid() == this.m_uid);
      if (entity.getRendererUid() == this.m_uid) {
        this.m_fixProcess.drawDisp(entity.getDisplay(), useGlobalUniform, forceUpdateUniform);
      } else if (entity.__$testRendererEnabled()) {
        this.m_entity3DMana.addEntity(entity, this.m_fixProcess.getUid(), false);
      }
    }
  }
  /**
   * run the specific renderer process by its index in the renderer instance
   * @param index the renderer process index in the renderer instance
   */


  runAt(index) {
    if (!this.m_renderProxy.isContextLost()) {
      this.m_processes[index].run();
    }
  }

  runProcess(process) {
    if (process.getRCUid() == this.m_uid && !this.m_renderProxy.isContextLost()) {
      process.run();
    }
  }

  runFromIndexTo(index) {
    if (!this.m_renderProxy.isContextLost()) {
      for (let i = index; i < this.m_processesLen; ++i) {
        this.m_processes[i].run();
      }
    }
  }
  /**
   * run all renderer processes in the renderer instance
   */


  run() {
    if (this.m_entity3DMana.isHaveEntity() && !this.m_renderProxy.isContextLost()) {
      for (let i = 0; i < this.m_processesLen; ++i) {
        this.m_processes[i].run();
      }
    }
  }

  getRenderUnitsTotal() {
    let total = 0;

    for (let i = 0; i < this.m_processesLen; ++i) {
      total += this.m_processes[i].getUnitsTotal();
    }

    return total;
  }

  renderflush() {
    this.m_renderProxy.flush();
  }

  toString() {
    return "[RendererInstance(uid = " + this.m_uid + ")]";
  }

}

RendererInstance.s_uid = 0;
exports.RendererInstance = RendererInstance;
exports.default = RendererInstance;

/***/ }),

/***/ "da6a":
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

class TextureResSlot {
  constructor() {
    this.m_texResource = null;
    this.m_bufferUpdater = null;
    this.m_textureTotal = 0;
    this.m_textureMap = new Map();
    this.m_freeMap = new Map();
    this.m_texUid = 0;
    this.m_freeUids = [];

    if (TextureResSlot.s_ins != null) {
      throw Error("This Class is a singleton class!!!");
    }

    TextureResSlot.s_ins = null;
  }

  static GetInstance() {
    if (TextureResSlot.s_ins != null) {
      return TextureResSlot.s_ins;
    }

    TextureResSlot.s_ins = new TextureResSlot();
    return TextureResSlot.s_ins;
  }

  getFreeUid() {
    if (this.m_freeUids.length > 0) {
      return this.m_freeUids.pop();
    }

    let uid = this.m_texUid++;
    return uid;
  }
  /**
   * 将texture实例添加到统一管理的 TextureResSlot中
   * 这个函数不允许其他地方调用
   */


  __$$addTexture(texture) {
    if (texture != null && !this.m_textureMap.has(texture.getUid())) {
      this.m_textureMap.set(texture.getUid(), texture);
      this.m_textureTotal++;
    }
  }

  getTextureByUid(uid) {
    return this.m_textureMap.get(uid);
  }

  hasTextureByUid(uid) {
    return this.m_textureMap.has(uid);
  }

  removeTextureByUid(uid) {
    if (this.m_textureMap.has(uid)) {
      let tex = this.m_textureMap.get(uid);

      if (tex.getAttachCount() < 1) {
        if (this.m_freeMap.has(uid)) {
          this.m_freeMap.delete(uid);
        }

        tex.__$destroy();

        tex.__$$removeFromSlot();

        this.m_textureMap.delete(uid);
        this.m_freeUids.push(uid);
        this.m_textureTotal--;
        return tex;
      }
    }

    return null;
  }
  /**
   * @returns get runtime all textures amount
   */


  getTextureTotal() {
    return this.m_textureTotal;
  }

  setRenderProxy(renderProxy) {
    this.m_texResource = renderProxy.Texture;
  }

  setBufferUpdater(bufferUpdater) {
    this.m_bufferUpdater = bufferUpdater;
  }

  getFreeResUidMap() {
    return this.m_freeMap;
  }

  isGpuEnabledByResUid(resUid) {
    return this.m_texResource.hasResUid(resUid);
  } // 先使用map hash拦截的方式,来决定buf和renderer context避免重复的单次关联


  addRenderBuffer(buf, bufResUid) {
    if (this.m_bufferUpdater != null) {
      this.m_bufferUpdater.__$addBuf(buf, bufResUid);
    }
  }

  addFreeUid(uid) {
    this.m_freeMap.set(uid, 0);
  }

  removeFreeUid(uid) {
    if (this.m_freeMap.has(uid)) {
      this.m_freeMap.delete(uid);
    }
  }

}

TextureResSlot.s_ins = null;
exports.default = TextureResSlot;

/***/ }),

/***/ "da82":
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

const CameraDragController_1 = __importDefault(__webpack_require__("f444"));

const CameraZoomController_1 = __importDefault(__webpack_require__("a46e"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const CameraViewRay_1 = __importDefault(__webpack_require__("53ea"));

class UserInteraction {
  constructor() {
    this.m_rscene = null;
    this.stageDragCtrl = new CameraDragController_1.default();
    this.cameraZoomController = new CameraZoomController_1.default();
    this.zoomLookAtPosition = null;
    this.zoomMinDistance = 30;
    this.viewRay = new CameraViewRay_1.default();
    /**
     * 是否启用摄像机用户控制
     */

    this.cameraCtrlEnabled = true;
  }

  initialize(rscene) {
    if (this.m_rscene == null) {
      this.m_rscene = rscene;
      this.viewRay.bindCameraAndStage(rscene.getCamera(), rscene.getStage3D());
      this.viewRay.setPlaneParam(new Vector3D_1.default(0.0, 1.0, 0.0), 0.0);
      rscene.enableMouseEvent(true);
      this.stageDragCtrl.initialize(rscene.getStage3D(), rscene.getCamera());
      this.cameraZoomController.bindCamera(rscene.getCamera());
      this.cameraZoomController.initialize(rscene.getStage3D());
      this.cameraZoomController.setLookAtCtrlEnabled(false);
    }
  }

  run() {
    if (this.cameraCtrlEnabled) {
      this.cameraZoomController.run(this.zoomLookAtPosition, this.zoomMinDistance);
      this.stageDragCtrl.runWithYAxis();
    }
  }

}

exports.UserInteraction = UserInteraction;

/***/ }),

/***/ "de9d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const AABB2D_1 = __importDefault(__webpack_require__("e2fe"));

const RenderFilter_1 = __importDefault(__webpack_require__("722e"));

const RenderMaskBitfield_1 = __importDefault(__webpack_require__("8333"));

const RODrawState_1 = __webpack_require__("7c63");

const RenderColorMask_1 = __webpack_require__("070b");

const RenderStateObject_1 = __webpack_require__("a5ba");

const RAdapterContext_1 = __importDefault(__webpack_require__("090c"));

const RenderAdapter_1 = __importDefault(__webpack_require__("1216"));

const RenderFBOProxy_1 = __importDefault(__webpack_require__("56c5"));

const RCExtension_1 = __importDefault(__webpack_require__("030e"));

const ROVertexResource_1 = __importDefault(__webpack_require__("74c3"));

const ROTextureResource_1 = __importDefault(__webpack_require__("984e"));

const RendererState_1 = __importDefault(__webpack_require__("29ef"));

const Stencil_1 = __webpack_require__("8171");

const VROBase_1 = __importDefault(__webpack_require__("919c"));

const RenderingColorMask_1 = __webpack_require__("e602");

const RenderingState_1 = __webpack_require__("53d3");

class RenderProxyParam {
  constructor() {
    this.materialUpdater = null;
    this.vtxBufUpdater = null;
    this.vtxBuilder = null;
    this.uniformContext = null;
  }

}

exports.RenderProxyParam = RenderProxyParam;
/**
 * 真正位于高频运行的渲染管线中的被使用的渲染关键代理对象
 */

class RenderProxy {
  constructor(rcuid) {
    this.RGBA = 0;
    this.UNSIGNED_BYTE = 0;
    this.TRIANGLE_STRIP = 0;
    this.TRIANGLE_FAN = 0;
    this.TRIANGLES = 0;
    this.LINES = 0;
    this.LINE_STRIP = 0;
    this.UNSIGNED_SHORT = 0;
    this.UNSIGNED_INT = 0;
    this.COLOR = 0;
    this.DEPTH = 0;
    this.STENCIL = 0;
    this.DEPTH_STENCIL = 0;
    this.MAX = 0;
    this.MIN = 0;
    /**
     * WebGL GPU Context instance
     */

    this.RContext = null;
    this.RDrawState = null;
    this.Vertex = null;
    this.Texture = null;
    this.VtxBufUpdater = null;
    this.MaterialUpdater = null;
    this.uniformContext = null;
    this.adapter = null;
    this.stencil = null;
    this.renderingState = null;
    this.colorMask = null;
    this.m_uid = 0;
    this.m_camUBO = null;
    this.m_adapter = null;
    this.m_adapterContext = new RAdapterContext_1.default();
    this.m_rc = null;
    this.m_perspectiveEnabled = true;
    this.m_viewPortRect = new AABB2D_1.default(0, 0, 800, 600);
    this.m_cameraNear = 0.1;
    this.m_cameraFar = 5000.0;
    this.m_cameraFov = 45.0;
    this.m_maxWebGLVersion = 2;
    this.m_WEBGL_VER = 2; // main camera

    this.m_camera = null;
    this.m_camSwitched = false; // 是否舞台尺寸和view自动同步一致

    this.m_autoSynViewAndStage = true;
    this.m_initMainCamera = true;
    this.m_uid = rcuid;
  }
  /**
   * @returns return system gpu context
   */


  getRC() {
    return this.m_rc;
  }

  getUid() {
    return this.m_uid;
  }
  /**
   * @returns return renderer context unique id
   */


  getRCUid() {
    return this.m_uid;
  }

  isAutoSynViewAndStage() {
    return this.m_autoSynViewAndStage;
  }

  enableSynViewAndStage() {
    this.m_autoSynViewAndStage = true;
  }

  lockViewport() {
    this.m_adapter.lockViewport();
  }

  unlockViewport() {
    this.m_adapter.unlockViewport();
  }

  getDiv() {
    return this.m_adapter.getDiv();
  }

  getCanvas() {
    return this.m_adapter.getCanvas();
  }

  cameraLock() {
    this.m_camera.lock();
  }

  cameraUnlock() {
    this.m_camera.unlock();
  }

  getCamera() {
    return this.m_camera;
  }

  updateCamera() {
    return this.m_camera.update();
  }

  createCameraUBO(shd) {//  if(this.m_camUBO == null)
    //  {
    //      this.m_camUBO = ShaderUBOBuilder.createUBOWithDataFloatsCount("UBlock_Camera", shd, 32);
    //      this.m_camUBO.setSubDataArrAt(0, m_camera.getViewMatrix().getLocalFS32());
    //      this.m_camUBO.setSubDataArrAt(16, m_camera.getProjectMatrix().getLocalFS32());
    //      this.m_camUBO.run();
    //  }
  }

  updateCameraDataFromCamera(camera) {
    if (camera != null) {
      if (this.m_camSwitched || camera != this.m_camera) {
        this.m_camSwitched = camera != this.m_camera;
        camera.updateCamMatToUProbe(this.m_camera.matUProbe);

        if (this.m_camUBO != null) {
          this.m_camUBO.setSubDataArrAt(0, camera.matUProbe.getFS32At(0));
          this.m_camUBO.setSubDataArrAt(16, camera.matUProbe.getFS32At(1)); //this.m_camUBO.setSubDataArrAt(0, camera.getViewMatrix().getLocalFS32());
          //this.m_camUBO.setSubDataArrAt(16, camera.getProjectMatrix().getLocalFS32());
        }
      }
    }
  }

  useCameraData() {
    if (this.m_camUBO != null) {
      this.m_camUBO.run();
    }
  }

  getActiveAttachmentTotal() {
    return this.m_adapter.getActiveAttachmentTotal();
  }

  drawInstanced(count, offset, instanceCount) {
    if (this.m_WEBGL_VER == 2) {
      this.m_rc.drawElementsInstanced(this.TRIANGLES, count, this.UNSIGNED_SHORT, offset, instanceCount);
    } else {
      RCExtension_1.default.ANGLE_instanced_arrays.drawElementsInstancedANGLE(this.TRIANGLES, count, offset, instanceCount);
    }
  }

  createUBOBufferByBytesCount(bytesCount) {
    let buf = this.m_rc.createBuffer();
    this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
    this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, bytesCount, this.m_rc.DYNAMIC_DRAW);
    return buf;
  }

  createUBOBufferByDataArray(dataArray) {
    let buf = this.m_rc.createBuffer();
    this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
    this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, dataArray, this.m_rc.DYNAMIC_DRAW);
    return buf;
  }

  bindUBOBuffer(buf) {
    this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
  }

  deleteUBOBuffer(buf) {
    this.m_rc.deleteBuffer(buf);
  }

  bufferDataUBOBuffer(dataArr) {
    this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, dataArr, this.m_rc.STATIC_DRAW);
  }

  bindBufferBaseUBOBuffer(bindingIndex, buf) {
    this.m_rc.bindBufferBase(this.m_rc.UNIFORM_BUFFER, bindingIndex, buf);
  }

  setWebGLMaxVersion(webgl_ver) {
    if (webgl_ver == 1 || webgl_ver == 2) {
      this.m_maxWebGLVersion = webgl_ver;
    }
  }

  getContext() {
    return this.m_adapterContext;
  }

  getStage3D() {
    return this.m_adapterContext.getStage();
  }

  getRenderAdapter() {
    return this.m_adapter;
  }

  getRenderContext() {
    return this.m_adapter.getRenderContext();
  }

  setCameraParam(fov, near, far) {
    this.m_cameraFov = fov;
    this.m_cameraNear = near;
    this.m_cameraFar = far;
  }

  getMouseXYWorldRay(rl_position, rl_tv) {
    let stage = this.m_adapterContext.getStage();
    this.m_camera.getWorldPickingRayByScreenXY(stage.mouseX, stage.mouseY, rl_position, rl_tv);
  }

  testViewPortChanged(px, py, pw, ph) {
    return this.m_viewPortRect.testEqualWithParams(px, py, pw, ph);
  }

  testRCViewPortChanged(px, py, pw, ph) {
    return this.m_adapterContext.testViewPortChanged(px, py, pw, ph);
  }

  getViewX() {
    return this.m_viewPortRect.x;
  }

  getViewY() {
    return this.m_viewPortRect.y;
  }

  getViewWidth() {
    return this.m_viewPortRect.width;
  }

  getViewHeight() {
    return this.m_viewPortRect.height;
  }

  setViewPort(px, py, pw, ph) {
    this.m_autoSynViewAndStage = false;
    this.m_viewPortRect.setTo(px, py, pw, ph);
    let stage = this.m_adapterContext.getStage();

    if (stage != null) {
      stage.setViewPort(pw, py, pw, ph);
      this.updateCameraView();
    }

    this.m_adapterContext.setViewport(px, py, pw, ph);
  }

  setRCViewPort(px, py, pw, ph, autoSynViewAndStage = false) {
    this.m_autoSynViewAndStage = autoSynViewAndStage;
    this.m_adapterContext.setViewport(px, py, pw, ph);
  }

  reseizeRCViewPort() {
    this.m_adapter.unlockViewport();
    this.m_adapter.reseizeViewPort();
  }

  updateCameraView() {
    if (this.m_camera != null) {
      let rect = this.m_viewPortRect;
      this.m_camera.setViewXY(rect.x, rect.y);
      this.m_camera.setViewSize(rect.width, rect.height);
    }
  }

  resizeCallback() {
    // console.log("XXX resizeCallback(), m_autoSynViewAndStage: "+this.m_autoSynViewAndStage);
    if (this.m_autoSynViewAndStage) {
      let rect = this.m_viewPortRect;
      rect.setSize(this.m_adapterContext.getRCanvasWidth(), this.m_adapterContext.getRCanvasHeight());
      this.createMainCamera(); //console.log("resizeCallback(), viewW,viewH: ", rect.width+","+rect.height);

      this.m_adapterContext.setViewport(rect.x, rect.y, rect.width, rect.height);
      this.updateCameraView();
    }
  }

  createMainCamera() {
    if (this.m_initMainCamera) {
      this.m_initMainCamera = false;
      this.m_camera.uniformEnabled = true;
      let rect = this.m_viewPortRect;

      if (this.m_perspectiveEnabled) {
        this.m_camera.perspectiveRH(MathConst_1.default.DegreeToRadian(this.m_cameraFov), rect.width / rect.height, this.m_cameraNear, this.m_cameraFar);
      } else {
        this.m_camera.orthoRH(this.m_cameraNear, this.m_cameraFar, -0.5 * rect.height, 0.5 * rect.height, -0.5 * rect.width, 0.5 * rect.width);
      }

      this.updateCameraView();
    }
  }

  readPixels(px, py, width, height, format, dataType, pixels) {
    this.m_adapter.readPixels(px, py, width, height, format, dataType, pixels);
  }

  getGLVersion() {
    return this.m_WEBGL_VER;
  }

  buildCameraParam() {
    let camera = this.m_camera;

    if (camera.matUProbe == null) {
      camera.matUProbe = this.uniformContext.createShaderUniformProbe();
      camera.matUProbe.addMat4Data(new Float32Array(16), 1);
      camera.matUProbe.addMat4Data(new Float32Array(16), 1);
    }

    if (camera.ufrustumProbe == null) {
      camera.ufrustumProbe = this.uniformContext.createShaderUniformProbe();
      camera.ufrustumProbe.addVec4Data(new Float32Array([camera.getZNear(), camera.getZFar(), camera.getNearPlaneWidth() * 0.5, camera.getNearPlaneHeight() * 0.5]), 1);
    }

    if (camera.ucameraPosProbe == null) {
      camera.ucameraPosProbe = this.uniformContext.createShaderUniformProbe();
      camera.ucameraPosProbe.addVec4Data(new Float32Array([500.0, 500.0, 500.0, 1.0]), 1);
    }
  }

  initialize(param, camera, stage, proxyParam) {
    if (this.m_rc != null) {
      return;
    }

    this.m_camera = camera;
    let posV3 = param.camPosition;
    let lookAtPosV3 = param.camLookAtPos;
    let upV3 = param.camUpDirect;
    if (posV3 == null) posV3 = new Vector3D_1.default(800.0, 800.0, 800.0);
    if (lookAtPosV3 == null) lookAtPosV3 = new Vector3D_1.default(0.0, 0.0, 0.0);
    if (upV3 == null) upV3 = new Vector3D_1.default(0.0, 1.0, 0.0);
    if (stage != null) stage.uProbe = proxyParam.uniformContext.createUniformVec4Probe(1);
    this.m_perspectiveEnabled = param.cameraPerspectiveEnabled;
    this.m_adapterContext.autoSyncRenderBufferAndWindowSize = param.autoSyncRenderBufferAndWindowSize;
    this.m_adapterContext.setResizeCallback(this, this.resizeCallback);
    this.m_adapterContext.setWebGLMaxVersion(this.m_maxWebGLVersion);
    this.m_adapterContext.initialize(this.m_uid, stage, param.getDiv(), param.getRenderContextAttri());
    this.m_WEBGL_VER = this.m_adapterContext.getWebGLVersion();
    this.m_rc = this.m_adapterContext.getRC();
    let selfT = this;
    let gl = this.m_rc;
    let vtxRes = new ROVertexResource_1.default(this.m_uid, gl, proxyParam.vtxBuilder);
    let texRes = new ROTextureResource_1.default(this.m_uid, gl);
    this.m_vtxRes = vtxRes;
    selfT.Vertex = vtxRes;
    selfT.Texture = texRes;
    selfT.MaterialUpdater = proxyParam.materialUpdater;
    selfT.VtxBufUpdater = proxyParam.vtxBufUpdater;
    selfT.uniformContext = proxyParam.uniformContext;
    let rstate = new RODrawState_1.RODrawState();
    rstate.setRenderContext(this.m_adapterContext);
    RendererState_1.default.Initialize(rstate, new VROBase_1.default());
    selfT.RState = rstate;
    selfT.RContext = this.m_rc;
    selfT.stencil = new Stencil_1.Stencil(rstate);
    selfT.renderingState = new RenderingState_1.RenderingState();
    selfT.colorMask = new RenderingColorMask_1.RenderingColorMask();
    this.buildCameraParam();
    let rect = this.m_viewPortRect;
    rect.setSize(this.m_adapterContext.getRCanvasWidth(), this.m_adapterContext.getRCanvasHeight());
    this.m_adapter = new RenderAdapter_1.default(this.m_uid, texRes);
    this.m_adapter.initialize(this.m_adapterContext, param, rstate, this.uniformContext.createUniformVec4Probe(1));
    selfT.adapter = this.m_adapter;

    if (this.m_autoSynViewAndStage) {
      let stage = this.m_adapterContext.getStage();

      if (stage != null) {
        rect.setSize(rect.width, rect.height);
      }
    }

    this.createMainCamera();
    this.m_adapterContext.setViewport(rect.x, rect.y, rect.width, rect.height);
    this.m_camera.lookAtRH(posV3, lookAtPosV3, upV3);
    this.m_camera.update();
    this.m_adapter.bgColor.setRGB3f(0.0, 0.0, 0.0);
    selfT.RGBA = gl.RGBA;
    selfT.UNSIGNED_BYTE = gl.UNSIGNED_BYTE;
    selfT.TRIANGLE_STRIP = gl.TRIANGLE_STRIP;
    selfT.TRIANGLE_FAN = gl.TRIANGLE_FAN;
    selfT.TRIANGLES = gl.TRIANGLES;
    selfT.LINES = this.m_rc.LINES;
    selfT.LINE_STRIP = gl.LINE_STRIP;
    selfT.UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
    selfT.UNSIGNED_INT = gl.UNSIGNED_INT;
    selfT.COLOR = gl.COLOR;
    selfT.DEPTH = gl.DEPTH;
    selfT.STENCIL = gl.STENCIL;
    selfT.DEPTH_STENCIL = gl.DEPTH_STENCIL;

    if (this.m_WEBGL_VER > 1) {
      selfT.MIN = gl.MIN;
      selfT.MAX = gl.MAX;
    } else {
      selfT.MIN = RCExtension_1.default.EXT_blend_minmax.MIN_EXT;
      selfT.MAX = RCExtension_1.default.EXT_blend_minmax.MAX_EXT;
    }

    let classRenderFilter = RenderFilter_1.default;
    classRenderFilter.NEAREST = gl.NEAREST;
    classRenderFilter.LINEAR = gl.LINEAR;
    classRenderFilter.LINEAR_MIPMAP_LINEAR = gl.LINEAR_MIPMAP_LINEAR;
    classRenderFilter.NEAREST_MIPMAP_NEAREST = gl.NEAREST_MIPMAP_NEAREST;
    classRenderFilter.LINEAR_MIPMAP_NEAREST = gl.LINEAR_MIPMAP_NEAREST;
    classRenderFilter.NEAREST_MIPMAP_LINEAR = gl.NEAREST_MIPMAP_LINEAR;
    let classRenderMaskBitfield = RenderMaskBitfield_1.default;
    classRenderMaskBitfield.COLOR_BUFFER_BIT = gl.COLOR_BUFFER_BIT;
    classRenderMaskBitfield.DEPTH_BUFFER_BIT = gl.DEPTH_BUFFER_BIT;
    classRenderMaskBitfield.STENCIL_BUFFER_BIT = gl.STENCIL_BUFFER_BIT;
    RenderFBOProxy_1.default.SetRenderer(this.m_adapterContext);
  }

  flush() {
    this.m_rc.flush();
  }

  setClearRGBColor3f(pr, pg, pb) {
    this.m_adapter.bgColor.setRGB3f(pr, pg, pb);
  }

  setClearColor(color) {
    this.m_adapter.bgColor.copyFrom(color);
  }

  setClearUint24Color(colorUint24, alpha) {
    this.m_adapter.bgColor.setRGBUint24(colorUint24);
    this.m_adapter.bgColor.a = alpha;
  }

  setClearRGBAColor4f(pr, pg, pb, pa) {
    this.m_adapter.bgColor.setRGBA4f(pr, pg, pb, pa);
  }

  getClearRGBAColor4f(color4) {
    color4.copyFrom(this.m_adapter.bgColor);
  }

  getViewportWidth() {
    return this.m_adapter.getViewportWidth();
  }

  getViewportHeight() {
    return this.m_adapter.getViewportHeight();
  }

  setRenderToBackBuffer() {
    this.m_adapter.setRenderToBackBuffer();
  }

  clearBackBuffer() {
    this.m_adapter.clear();
  }

  clearDepth(depth = 1.0) {
    this.m_adapter.clearDepth(depth);
  }

  renderBegin() {
    this.m_camera.update();
    this.m_adapter.renderBegin();
  }

  renderEnd() {}

  useRenderStateByName(stateName) {
    RenderStateObject_1.RenderStateObject.UseRenderStateByName(stateName);
  }

  setScissorEnabled(boo) {
    this.m_adapterContext.setScissorEnabled(boo);
  }

  setScissorRect(px, py, pw, ph) {
    this.m_adapterContext.setScissorRect(px, py, pw, ph);
  }

  useRenderColorMask(state) {
    RenderColorMask_1.RenderColorMask.UseRenderState(state);
  }

  unlockRenderColorMask() {
    RenderColorMask_1.RenderColorMask.Unlock();
  }

  lockRenderColorMask() {
    RenderColorMask_1.RenderColorMask.Lock();
  }

  useRenderState(state) {
    RenderStateObject_1.RenderStateObject.UseRenderState(state);
  }

  unlockRenderState() {
    RenderStateObject_1.RenderStateObject.Unlock();
  }

  lockRenderState() {
    RenderStateObject_1.RenderStateObject.Lock();
  }
  /**
   * set the updating times total that update vertex data to gpu in one frame time
   * @param total updating times total, the min value is 4, the default value is 16
   */


  setVtxUpdateTimesTotal(total) {
    this.m_vtxRes.setVtxUpdateTimesTotal(total);
  }
  /**
   * @param faceFlipped the value is true, frontFace is CW. the value is false, frontFace is CCW.
   */


  setFrontFaceFlipped(faceFlipped) {
    this.m_adapter.setFrontFaceFlipped(faceFlipped);
  }

  enabledPolygonOffset() {
    this.m_adapter.enabledPolygonOffset();
  }

  disabledPolygonOffset() {
    this.m_adapter.disabledPolygonOffset();
  }
  /*
   * specifies the scale factors and units to calculate depth values.
   * @param factor the value is a GLfloat which sets the scale factor for the variable depth offset for each polygon. The default value is 0.
   * @param units the value is a which sets the multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. The default value is 0.
   */


  setPolygonOffset(factor, units = 0.0) {
    this.m_adapter.setPolygonOffset(factor, units);
  }
  /*
   * reset the scale factors and units value is default value(0.0).
   */


  resetPolygonOffset() {
    this.m_adapter.resetPolygonOffset();
  }

  loseContext() {
    this.m_adapter.loseContext();
  }
  /**
   * @returns return gpu context lost status
   */


  isContextLost() {
    return this.m_adapter.isContextLost();
  }

  setViewProbeValue(x, y, width, height) {
    this.m_adapter.setViewProbeValue(x, y, width, height);
  }

  toString() {
    return "[Object RenderProxy()]";
  }

}

exports.RenderProxy = RenderProxy;
exports.default = RenderProxy;

/***/ }),

/***/ "df25":
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
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

const TextureConst_1 = __webpack_require__("8d98");

const RawTexData_1 = __importDefault(__webpack_require__("68aa"));

const TextureProxy_1 = __importDefault(__webpack_require__("0851"));

class RawDataTextureProxy extends TextureProxy_1.default {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.m_bytes = null;
    this.m_subDataList = null;
    this.m_texDatasLen = 0;
    this.m_texData = null;
    this.m_texDatas = null;
    this.minFilter = TextureConst_1.TextureConst.LINEAR;
  }
  /**
   * 设置 Bytes 纹理的纹理数据
   */


  setDataFromBytes(bytes, miplevel = 0, imgWidth = -1, imgHeight = -1, offsetx = 0, offsety = 0, rebuild = false) {
    if (bytes != null && imgWidth > 0 && imgHeight > 0) {
      if (miplevel < 0) miplevel = 0;
      if (miplevel > 15) miplevel = 15;

      if (miplevel >= this.m_texDatasLen) {
        this.m_texDatasLen = miplevel + 1;
      }

      this.m_haveRData = true;
      let td = this.m_texData;

      if (td != null) {
        if (this.m_texData.miplevel != miplevel) {
          if (this.m_texDatas == null) this.m_texDatas = [this.m_texData, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
          td = this.m_texDatas[miplevel];

          if (td == null) {
            td = RawTexData_1.default.Create();
            td.miplevel = miplevel;
            rebuild = true;
            this.m_texDatas[miplevel] = td;
          }
        }
      } else {
        this.m_texData = td = RawTexData_1.default.Create();
        td.miplevel = miplevel;
        rebuild = true;
      }

      if (td.data != bytes || td.offsetx != offsetx || td.offsety != offsety) {
        if (miplevel == 0) {
          this.m_texWidth = imgWidth;
          this.m_texHeight = imgHeight;
          this.m_bytes = bytes;
        }

        td.data = bytes;
        td.status = 0; // 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新

        if (td.width < imgWidth || td.height < imgHeight || rebuild) {
          td.width = imgWidth;
          td.height = imgHeight;
          td.status = 1;
        }

        td.offsetx = offsetx;
        td.offsety = offsety;
      }

      this.version++;
    } else {
      console.error("bytes != null: " + (bytes != null) + ",imgWidth > 0: " + (imgWidth > 0) + ",imgHeight > 0: " + (imgHeight > 0));
    }
  }

  uploadData(texRes) {
    if (this.m_texData != null) {
      this.dataUploadToGpu(texRes.getRC(), this.m_texData, this.m_texDatas, true);
    }
  }

  __$updateToGpu(texRes) {
    // 这里之所以用这种方式判断，是为了运行时支持多 gpu context
    //console.log("RawDataTexture,__$updateToGpu, version: ",this.version,",resHas("+this.getResUid()+"):",texRes.hasResUid(this.getResUid()));
    if (this.version > 0 && texRes.hasResUid(this.getResUid())) {
      let gl = texRes.getRC();
      let len = this.m_subDataList != null ? this.m_subDataList.length : 0;

      this.__$updateToGpuBegin(texRes);

      if (len > 0) {
        let i = 0;
        let d = null;
        let interType = TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat);
        let format = TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat);
        let type = TextureConst_1.TextureDataType.ToGL(gl, this.dataType);

        for (; i < len; ++i) {
          d = this.m_subDataList.pop();
          d.updateToGpu(gl, this.m_sampler, interType, format, type, false);
          RawTexData_1.default.Restore(d);
        } //concole.log("#####upload sub texture pix data!");

      }

      if (this.m_texData != null) {
        this.dataUploadToGpu(gl, this.m_texData, this.m_texDatas);

        this.__$buildParam(gl);

        this.m_generateMipmap = true;
      }

      this.__$updateToGpuEnd(gl);
    }
  } // 对mipmap level 的纹理数据的部分更新


  setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel = 0) {
    if (this.m_subDataList == null) {
      this.m_subDataList = [];
    }

    let d = RawTexData_1.default.Create();
    d.data = bytes;
    d.status = 0;
    d.miplevel = miplevel;
    d.offsetx = px;
    d.offsety = py;
    d.width = twidth;
    d.height = theight; //console.log("setPartDataFromeBytes, pos("+px+","+py+"),size("+twidth+","+twidth+")");

    this.m_subDataList.push(d);
    this.version++;
  }

  getPixels(px, py, pw, ph, outBytes) {
    if (this.m_bytes != null && outBytes != null) {
      let segSize = this.unpackAlignment;
      let s = pw * ph * segSize;

      if (outBytes.length == s) {
        let i = py;
        let j = px;
        let i_max = i + ph;
        let j_max = j + pw;
        let k = 0;

        switch (this.srcFormat) {
          case TextureConst_1.TextureFormat.ALPHA:
            for (; i < i_max; ++i) {
              for (j = px; j < j_max; ++j) {
                s = i * this.m_texWidth + j;
                outBytes[k] = this.m_bytes[s];
                k++;
              }
            }

            break;

          case TextureConst_1.TextureFormat.RGBA:
            for (; i < i_max; ++i) {
              for (j = px; j < j_max; ++j) {
                s = (i * this.m_texWidth + j) * segSize;
                outBytes[k] = this.m_bytes[s];
                outBytes[k + 1] = this.m_bytes[s + 1];
                outBytes[k + 2] = this.m_bytes[s + 2];
                outBytes[k + 3] = this.m_bytes[s + 3];
                k++;
              }
            }

            break;

          case TextureConst_1.TextureFormat.RGB:
            for (; i < i_max; ++i) {
              for (j = px; j < j_max; ++j) {
                s = (i * this.m_texWidth + j) * segSize;
                outBytes[k] = this.m_bytes[s];
                outBytes[k + 1] = this.m_bytes[s + 1];
                outBytes[k + 2] = this.m_bytes[s + 2];
                k++;
              }
            }

            break;

          default:
            break;
        }
      } else {
        console.warn("outBytes.length != (pw * ph * pixelSegSize)");
      }
    }
  }

  __$destroy() {
    if (this.getAttachCount() < 1) {
      this.version = 0;

      if (this.m_texDatas != null) {
        for (let i = 0; i < this.m_texDatasLen; ++i) {
          RawTexData_1.default.Restore(this.m_texDatas[i]);
        }

        this.m_texDatasLen = 0;
        this.m_texDatas = null;
        this.m_texData = null;
      }

      if (this.m_texData != null) {
        RawTexData_1.default.Restore(this.m_texData);
        this.m_texData = null;
      }

      this.m_bytes = null;
      console.log("RawDataTextureProxy::destroy(), destroy a RawDataTextureProxy instance...");

      super.__$destroy();
    }
  }

  toString() {
    return "[RawDataTextureProxy(width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

}

exports.default = RawDataTextureProxy;

/***/ }),

/***/ "df9d":
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

class RPONodeLinker {
  constructor() {
    this.m_uid = -1; // 用于唯一记录运行时的自己唯一id

    this.m_begin = null;
    this.m_end = null;
    this.m_unitMap = new Map();
    this.m_unitTexMap = new Map();
    this.m_FLAG_BUSY = 1;
    this.m_FLAG_FREE = 0;
    this.m_vtxFlagList = [];
    this.m_vtxIndexFlagList = [];
    this.m_vtxfreeIList = [];
    this.m_vtxList = [];
    this.m_vtxListLen = 0;
    this.m_texFlagList = [];
    this.m_texIndexFlagList = [];
    this.m_texfreeIList = [];
    this.m_texList = [];
    this.m_texListLen = 0;
    this.m_uid = RPONodeLinker.s_uid++;
  }

  getFreeVtxId() {
    if (this.m_vtxfreeIList.length > 0) {
      return this.m_vtxfreeIList.pop();
    }

    return -1;
  }

  getVtxIndex() {
    let unitI = -1;
    let index = this.getFreeVtxId();

    if (index >= 0) {
      unitI = index;
      this.m_vtxList[index] = 0;
      this.m_vtxFlagList[index] = this.m_FLAG_BUSY;
    } else {
      unitI = this.m_vtxListLen;
      this.m_vtxList.push(0);
      this.m_vtxIndexFlagList.push(this.m_FLAG_FREE);
      this.m_vtxFlagList.push(this.m_FLAG_BUSY);
      this.m_vtxListLen++;
    }

    return unitI;
  }

  restoreVtxIndex(index) {
    if (this.m_vtxFlagList[index] == this.m_FLAG_BUSY) {
      this.m_vtxfreeIList.push(index);
      this.m_vtxFlagList[index] = this.m_FLAG_FREE;
      this.m_vtxList[index] = 0;
    }
  }

  attachVtxAt(index) {
    ++this.m_vtxList[index]; //console.log("uid: "+this.m_uid+" RPONodeLinker::attachVtxAt(), this.m_vtxList["+index+"]: "+this.m_vtxList[index]);
  }

  detachVtxAt(index) {
    if (this.m_vtxList[index] > 0) {
      --this.m_vtxList[index];

      if (this.m_vtxList[index] < 1) {
        this.restoreVtxIndex(index);
      }
    } //console.log("uid: "+this.m_uid+" RPONodeLinker::detachVtxAt(), this.m_vtxList["+index+"]: "+this.m_vtxList[index]);

  }

  getVtxTotalAt(index) {
    return this.m_vtxList[index];
  }

  getFreeTexId() {
    if (this.m_texfreeIList.length > 0) {
      return this.m_texfreeIList.pop();
    }

    return -1;
  }

  getTexIndex() {
    let unitI = -1;
    let index = this.getFreeTexId();

    if (index >= 0) {
      unitI = index;
      this.m_texList[index] = 0;
      this.m_texFlagList[index] = this.m_FLAG_BUSY;
    } else {
      unitI = this.m_texListLen;
      this.m_texList.push(0);
      this.m_texIndexFlagList.push(this.m_FLAG_FREE);
      this.m_texFlagList.push(this.m_FLAG_BUSY);
      this.m_texListLen++;
    }

    return unitI;
  }

  restoreTexIndex(index) {
    if (this.m_texFlagList[index] == this.m_FLAG_BUSY) {
      this.m_texfreeIList.push(index);
      this.m_texFlagList[index] = this.m_FLAG_FREE;
      this.m_texList[index] = 0;
    }
  }

  attachTexAt(index) {
    ++this.m_texList[index]; //console.log("uid: "+this.m_uid+" RPONodeLinker::attachTexAt(), this.m_texList["+index+"]: "+this.m_texList[index]);
  }

  detachTexAt(index) {
    if (this.m_texList[index] > 0) {
      --this.m_texList[index];

      if (this.m_texList[index] < 1) {
        this.restoreTexIndex(index);
      }
    } //console.log("uid: "+this.m_uid+" RPONodeLinker::detachTexAt(), this.m_texList["+index+"]: "+this.m_texList[index]);

  }

  getTexTotalAt(index) {
    return this.m_texList[index];
  }

  destroy() {
    this.clear();
  }

  clear() {
    this.m_begin = this.m_end = null;
    this.m_unitMap = new Map();
    this.m_unitTexMap = new Map();
    this.m_vtxFlagList = [];
    this.m_vtxIndexFlagList = [];
    this.m_vtxList = [];
    this.m_vtxfreeIList = [];
    this.m_vtxListLen = 0;
    this.m_texFlagList = [];
    this.m_texIndexFlagList = [];
    this.m_texList = [];
    this.m_texfreeIList = [];
    this.m_texListLen = 0;
  }

  getBegin() {
    return this.m_begin;
  }

  containsNode(node) {
    let pnode = this.m_unitMap.get(node.vtxUid);

    if (pnode != null) {
      let key = (31 + pnode.rvroI) * 131;
      key *= key + pnode.texMid;
      return node.rtokey == key;
    }

    return false;
  }

  addNodeAndSort(node) {
    //  注意，这里可以管理组合方式, 例如可以做更多条件的排序
    //  有些需要排序, 有些不需要排序
    //trace("RPONodeLinker::addNodeAndSort(), node: "+node);
    // 首先依据相同的顶点紧凑排序, 然后再以纹理组合排列, 因此用 顶点的key与tex序列的key组合为一个新的key
    //console.log("addNodeAndSort node.vtxUid: ",node.vtxUid, node.unit.__$dispNS);
    let pnode = this.m_unitMap.get(node.vtxUid);

    if (pnode == null) {
      this.m_unitMap.set(node.vtxUid, node);
      node.rvroI = this.getVtxIndex();
      this.attachVtxAt(node.rvroI);
      let key = (31 + node.rvroI) * 131;
      key *= key + node.texMid;
      node.rtokey = key;
      node.rtroI = this.getTexIndex();
      this.m_unitTexMap.set(key, node.rtroI);
      this.attachTexAt(node.rtroI); //console.log("RPONodeLinker::addNodeAndSort(), append a new node.");
    } else {
      node.rvroI = pnode.rvroI;
      this.attachVtxAt(node.rvroI);
      let key = (31 + node.rvroI) * 131;
      key *= key + node.texMid;

      if (this.m_unitTexMap.has(key)) {
        node.rtroI = this.m_unitTexMap.get(key);
      } else {
        node.rtroI = this.getTexIndex();
        this.m_unitTexMap.set(key, node.rtroI);
      }

      node.rtokey = key;
      this.attachTexAt(node.rtroI); //console.log("RPONodeLinker::addNodeAndSort(), append a new pnode != m_end: "+(pnode != this.m_end));

      if (pnode != this.m_end) {
        if (pnode.texMid == node.texMid) {
          pnode.next.prev = node;
          node.next = pnode.next;
          node.prev = pnode;
          pnode.next = node;
        } else {
          // combine the same textures ro
          while (pnode != null) {
            if (pnode.vtxUid != node.vtxUid) {
              pnode = pnode.prev;
              pnode.next.prev = node;
              node.next = pnode.next;
              node.prev = pnode;
              pnode.next = node;
              break;
            } else {
              if (pnode.texMid == node.texMid) {
                pnode.next.prev = node;
                node.next = pnode.next;
                node.prev = pnode;
                pnode.next = node;
                break;
              }

              if (pnode.next == this.m_end) {
                if (this.m_end.vtxUid != node.vtxUid) {
                  // append after pnode
                  pnode.next.prev = node;
                  node.next = pnode.next;
                  node.prev = pnode;
                  pnode.next = node;
                } else {
                  pnode = null;
                }

                break;
              }

              pnode = pnode.next;
            }
          }
        } // 如果纹理相同, 再次将纹理相同的排在一起
        //console.log("RPONodeLinker::addNodeAndSort(), insert a new node 0.");

      } else {
        pnode = null;
      }
    }

    if (pnode == null) {
      if (this.m_begin == null) {
        this.m_end = this.m_begin = node;
      } else {
        if (this.m_end.prev != null) {
          this.m_end.next = node;
          node.prev = this.m_end;
          this.m_end = node; //trace("RPONodeLinker::addNodeAndSort(), insert a node to link 1.");
        } else {
          this.m_begin.next = node;
          node.prev = this.m_end;
          this.m_end = node; //trace("RPONodeLinker::addNodeAndSort(), insert a node to link 2.");
        }
      }

      this.m_end.next = null;
    }
  }

  showInfo() {
    let nextNode = this.getBegin();

    if (nextNode != null) {
      let vtxStr = "";
      let texStr = "";
      let ivsCountStr = "";

      while (nextNode != null) {
        vtxStr += nextNode.vtxUid + ",";
        texStr += nextNode.texMid + ",";
        ivsCountStr += nextNode.ivsCount + ",";
        nextNode = nextNode.next;
      }

      console.log("RPONodeLinker::showInfo(), vtx: " + vtxStr);
      console.log("RPONodeLinker::showInfo(), tex: " + texStr);
      console.log("RPONodeLinker::showInfo(), ivs: " + ivsCountStr);
    }
  }

  removeNodeAndSort(node) {
    //trace("RPONodeLinker::removeNodeAndSort(), node: "+node);
    let pnode = this.m_unitMap.get(node.vtxUid);

    if (pnode != node) {
      pnode = null;
    } else {
      this.m_unitMap.set(node.vtxUid, null);

      if (node.next != null && node.next.vtxUid == node.vtxUid) {
        this.m_unitMap.set(node.vtxUid, node.next);
      } else if (node.prev != null && node.prev.vtxUid == node.vtxUid) {
        this.m_unitMap.set(node.vtxUid, node.prev);
      } else {
        this.m_unitMap.delete(node.vtxUid);
      }
    }

    if (node == this.m_begin) {
      if (node == this.m_end) {
        this.m_begin = this.m_end = null;
      } else {
        this.m_begin = node.next;
        this.m_begin.prev = null;
      }
    } else if (node == this.m_end) {
      this.m_end = node.prev;
      this.m_end.next = null;
    } else {
      node.next.prev = node.prev;
      node.prev.next = node.next;
    }

    this.detachVtxAt(node.rvroI);
    this.detachTexAt(node.rtroI);
    node.prev = null;
    node.next = null;
  }

  addNode(node) {
    if (this.m_begin == null) {
      this.m_end = this.m_begin = node;
    } else {
      if (this.m_end.prev != null) {
        this.m_end.next = node;
        node.prev = this.m_end;
        this.m_end = node;
      } else {
        this.m_begin.next = node;
        node.prev = this.m_end;
        this.m_end = node;
      }
    }

    this.m_end.next = null;
  }

  removeNode(node) {
    if (node == this.m_begin) {
      if (node == this.m_end) {
        this.m_begin = this.m_end = null;
      } else {
        this.m_begin = node.next;
        this.m_begin.prev = null;
      }
    } else if (node == this.m_end) {
      this.m_end = node.prev;
      this.m_end.next = null;
    } else {
      node.next.prev = node.prev;
      node.prev.next = node.next;
    }

    node.prev = null;
    node.next = null;
  }

}

RPONodeLinker.s_uid = 0;
exports.default = RPONodeLinker;

/***/ }),

/***/ "e08e":
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

class RenderDrawMode {}

RenderDrawMode.ELEMENTS_TRIANGLES = 1;
RenderDrawMode.ELEMENTS_TRIANGLE_STRIP = 2;
RenderDrawMode.ELEMENTS_TRIANGLE_FAN = 3;
RenderDrawMode.ELEMENTS_INSTANCED_TRIANGLES = 4;
RenderDrawMode.ARRAYS_LINES = 5;
RenderDrawMode.ARRAYS_LINE_STRIP = 6;
RenderDrawMode.ARRAYS_POINTS = 7;
RenderDrawMode.ELEMENTS_LINES = 8;
RenderDrawMode.DISABLE = 0;
exports.RenderDrawMode = RenderDrawMode; // blend mode

class RenderBlendMode {}

RenderBlendMode.NORMAL = 1;
RenderBlendMode.OPAQUE = 1;
RenderBlendMode.TRANSPARENT = 2;
RenderBlendMode.ALPHA_ADD = 3;
RenderBlendMode.ADD = 4;
RenderBlendMode.ADD_LINEAR = 5;
RenderBlendMode.INVERSE_ALPHA = 6;
RenderBlendMode.BLAZE = 7;
RenderBlendMode.OVERLAY = 8;
RenderBlendMode.OVERLAY2 = 8;
RenderBlendMode.DISABLE = 0;
exports.RenderBlendMode = RenderBlendMode;
/**
 * gl.NEVER:           Never pass.
 * gl.LESS:            Pass if (ref & mask) <  (stencil & mask).
 * gl.EQUAL:           Pass if (ref & mask) =  (stencil & mask).
 * gl.LEQUAL:          Pass if (ref & mask) <= (stencil & mask).
 * gl.GREATER:         Pass if (ref & mask) >  (stencil & mask).
 * gl.NOTEQUAL:        Pass if (ref & mask) != (stencil & mask).
 * gl.GEQUAL:          Pass if (ref & mask) >= (stencil & mask).
 * gl.ALWAYS:          Always pass.
 */

class GLStencilFunc {}

GLStencilFunc.NEVER = 1;
GLStencilFunc.LESS = 1;
GLStencilFunc.EQUAL = 1;
GLStencilFunc.GREATER = 1;
GLStencilFunc.NOTEQUAL = 1;
GLStencilFunc.GEQUAL = 1;
GLStencilFunc.ALWAYS = 1;
exports.GLStencilFunc = GLStencilFunc;
/**
 * gl.KEEP              Keeps the current value.
 * gl.ZERO              Sets the stencil buffer value to 0.
 * gl.REPLACE           Sets the stencil buffer value to the reference value as specified by WebGLRenderingContext.stencilFunc().
 * gl.INCR              Increments the current stencil buffer value. Clamps to the maximum representable unsigned value.
 * gl.INCR_WRAP         Increments the current stencil buffer value. Wraps stencil buffer value to zero when incrementing the maximum representable unsigned value.
 * gl.DECR              Decrements the current stencil buffer value. Clamps to 0.
 * gl.DECR_WRAP         Decrements the current stencil buffer value. Wraps stencil buffer value to the maximum representable unsigned value when decrementing a stencil buffer value of 0.
 * gl.INVERT            Inverts the current stencil buffer value bitwise.
 */

class GLStencilOp {}

GLStencilOp.KEEP = 1;
GLStencilOp.ZERO = 1;
GLStencilOp.REPLACE = 1;
GLStencilOp.INCR = 1;
GLStencilOp.INCR_WRAP = 1;
GLStencilOp.DECR = 1;
GLStencilOp.DECR_WRAP = 1;
GLStencilOp.INVERT = 1;
exports.GLStencilOp = GLStencilOp;

class GLBlendMode {}

GLBlendMode.ZERO = 1;
GLBlendMode.ONE = 1;
GLBlendMode.SRC_COLOR = 1;
GLBlendMode.DST_COLOR = 1;
GLBlendMode.SRC_ALPHA = 1;
GLBlendMode.DST_ALPHA = 1;
GLBlendMode.ONE_MINUS_SRC_ALPHA = 1;
exports.GLBlendMode = GLBlendMode;

class GLBlendEquation {}

GLBlendEquation.FUNC_ADD = 1;
GLBlendEquation.FUNC_SUBTRACT = 1;
GLBlendEquation.FUNC_REVERSE_SUBTRACT = 1;
GLBlendEquation.MIN_EXT = 1;
GLBlendEquation.MAX_EXT = 1;
GLBlendEquation.MIN = 1;
GLBlendEquation.MAX = 1;
exports.GLBlendEquation = GLBlendEquation;

class CullFaceMode {}

CullFaceMode.BACK = 1;
CullFaceMode.FRONT = 2;
CullFaceMode.FRONT_AND_BACK = 3;
CullFaceMode.NONE = 0;
CullFaceMode.DISABLE = 0;
exports.CullFaceMode = CullFaceMode;

class DepthTestMode {}

DepthTestMode.NEVER = 1; //glDepthMask(false); glDepthFunc(GL_ALWAYS);

DepthTestMode.ALWAYS = 2; //glDepthMask(true); glDepthFunc(GL_LEQUAL);

DepthTestMode.SKY = 3;
DepthTestMode.TRUE_LESS_EQUAL = 3; //glDepthMask(true); glDepthFunc(GL_LESS);

DepthTestMode.OPAQUE = 4;
DepthTestMode.TRUE_LESS = 4; //glDepthMask(false); glDepthFunc(GL_EQUAL);

DepthTestMode.OPAQUE_OVERHEAD = 5;
DepthTestMode.FALSE_EQUAL = 5; //glDepthMask(false); glDepthFunc(GL_LESS);

DepthTestMode.FALSE_LESS = 6;
DepthTestMode.BLEND = 6;
DepthTestMode.BLEND_SORT = 6;
DepthTestMode.TRANSPARENT_SORT = 6; //glDepthMask(TRUE); glDepthFunc(GL_LEQUAL);

DepthTestMode.TRUE_LEQUAL = 7;
DepthTestMode.WIRE_FRAME = 7; //
//glDepthMask(false); glDepthFunc(GL_LEQUAL);

DepthTestMode.FALSE_LEQUAL = 8;
DepthTestMode.DECALS = 8; //glDepthMask(false); glDepthFunc(GL_ALWAYS);

DepthTestMode.NEXT_LAYER = 11;
DepthTestMode.WIRE_FRAME_NEXT = 12; //glDepthMask(true); glDepthFunc(GL_EQUAL);

DepthTestMode.TRUE_EQUAL = 13; //glDepthMask(true); glDepthFunc(GL_GREATER);

DepthTestMode.TRUE_GREATER = 14; //glDepthMask(true); glDepthFunc(GL_GEQUAL);

DepthTestMode.TRUE_GEQUAL = 15;
DepthTestMode.DISABLE = 0;
exports.DepthTestMode = DepthTestMode;

class RenderConst {} // 32bit psign: 8bit->pageIndex,8bit->block uid,16bit->RenderDispRenderID


RenderConst.SCENE_RO_FILTER_BEGIN = 1 << 19;
RenderConst.SCENE_RO_FILTER_FINISH = 2 << 19;
RenderConst.SCENE_RO_ERASE = 0;
exports.RenderConst = RenderConst;
var DisplayRenderSign;

(function (DisplayRenderSign) {
  // 还没有加入 renderer
  DisplayRenderSign[DisplayRenderSign["NOT_IN_RENDERER"] = -1] = "NOT_IN_RENDERER"; // 正在进入 renderer

  DisplayRenderSign[DisplayRenderSign["GO_TO_RENDERER"] = 1] = "GO_TO_RENDERER"; // 真正存在于 renderer, 也就是直接可以在 process 中使用了

  DisplayRenderSign[DisplayRenderSign["LIVE_IN_RENDERER"] = 2] = "LIVE_IN_RENDERER";
})(DisplayRenderSign = exports.DisplayRenderSign || (exports.DisplayRenderSign = {}));

/***/ }),

/***/ "e160":
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

class AABBCalc {
  IntersectRL(ltv, lpv, ab) {
    let f = 0;
    let tmin = (ab.min.x - lpv.x) / ltv.x;
    let tmax = (ab.max.x - lpv.x) / ltv.x; //console.log("AABB::IntersectRL uses...");

    if (tmin > tmax) {
      f = tmax;
      tmax = tmin;
      tmin = f;
    } //	console.log("\n");
    //	console.log("tmin: "+tmin+",tmax: "+tmax);


    let tymin = (ab.min.y - lpv.y) / ltv.y;
    let tymax = (ab.max.y - lpv.y) / ltv.y; //	console.log("tymin: "+tymin+",tymax: "+tymax);

    if (tymin > tymax) {
      f = tymax;
      tymax = tymin;
      tymin = f;
    }

    if (tmin > tymax || tymin > tmax) return false;
    if (tymin > tmin) tmin = tymin;
    if (tymax < tmax) tmax = tymax;
    let tzmin = (ab.min.z - lpv.z) / ltv.z;
    let tzmax = (ab.max.z - lpv.z) / ltv.z; //	console.log("tzmin: "+tzmin+",tzmax: "+tzmax);
    //	console.log("\n");

    if (tzmin > tzmax) {
      f = tzmax;
      tzmax = tzmin;
      tzmin = f;
    }

    if (tmin > tzmax || tzmin > tmax) return false;
    if (tzmin > tmin) tmin = tzmin;
    if (tzmax < tmax) tmax = tzmax;
    return true;
  }
  /*
  static IntersectionRL3(vecs:Vector3D[],rsigns:Uint8Array,ltInvtv:Vector3D, ltv:Vector3D, lpv:Vector3D,outV:Vector3D):boolean
  {
      let tmin:number, tmax:number, tymin:number, tymax:number;//, tzmin:number, tzmax:number;
      
      tmin = (vecs[rsigns[0]].x - lpv.x) * ltInvtv.x;
      tmax = (vecs[1-rsigns[0]].x - lpv.x) * ltInvtv.x;
      tymin = (vecs[rsigns[1]].y - lpv.y) * ltInvtv.y;
      tymax = (vecs[1-rsigns[1]].y - lpv.y) * ltInvtv.y;
      if ((tmin > tymax) || (tymin > tmax))
          return false;
      if (tymin > tmin)
          tmin = tymin;
      if (tymax < tmax)
          tmax = tymax;
      
      tymin = (vecs[rsigns[2]].z - lpv.z) * ltInvtv.z;
      tymax = (vecs[1-rsigns[2]].z - lpv.z) * ltInvtv.z;
      if ((tmin > tymax) || (tymin > tmax))
          return false;
      if (tymin > tmin)
          tmin = tymin;
      if (tymax < tmax)
          tmax = tymax;
          
      outV.copyFrom(ltv);
      outV.scaleBy(tmin);
      outV.addBy(lpv);
      console.log("T Hit outV: "+outV.toString());
      return true;
  }
  //*/


  static IntersectionRL3(vecs, rsigns, ltInvtv, ltv, lpv, outV) {
    ltInvtv.w = (vecs[rsigns[0]].x - lpv.x) * ltInvtv.x;
    ltv.w = (vecs[1 - rsigns[0]].x - lpv.x) * ltInvtv.x;
    outV.x = (vecs[rsigns[1]].y - lpv.y) * ltInvtv.y;
    outV.y = (vecs[1 - rsigns[1]].y - lpv.y) * ltInvtv.y;
    if (ltInvtv.w > outV.y || outV.x > ltv.w) return false;
    if (outV.x > ltInvtv.w) ltInvtv.w = outV.x;
    if (outV.y < ltv.w) ltv.w = outV.y;
    outV.x = (vecs[rsigns[2]].z - lpv.z) * ltInvtv.z;
    outV.y = (vecs[1 - rsigns[2]].z - lpv.z) * ltInvtv.z;
    if (ltInvtv.w > outV.y || outV.x > ltv.w) return false;
    if (outV.x > ltInvtv.w) ltInvtv.w = outV.x;
    if (outV.y < ltv.w) ltv.w = outV.y;
    outV.copyFrom(ltv);
    outV.scaleBy(ltInvtv.w);
    outV.addBy(lpv);
    ltv.w = 1.0; //console.log("T Hit outV: "+outV.toString());

    return true;
  }

  static IntersectionRL1(ltv, lpv, ab, outV) {
    let f = 0;
    let tmin = (ab.min.x - lpv.x) / ltv.x;
    let tmax = (ab.max.x - lpv.x) / ltv.x; //console.log("AABB::IntersectRL uses...");

    if (tmin > tmax) {
      f = tmax;
      tmax = tmin;
      tmin = f;
    } //	console.log("\n");
    //	console.log("tmin: "+tmin+",tmax: "+tmax);


    let tymin = (ab.min.y - lpv.y) / ltv.y;
    let tymax = (ab.max.y - lpv.y) / ltv.y; //	console.log("tymin: "+tymin+",tymax: "+tymax);

    if (tymin > tymax) {
      f = tymax;
      tymax = tymin;
      tymin = f;
    }

    if (tmin > tymax || tymin > tmax) return false;
    if (tymin > tmin) tmin = tymin;
    if (tymax < tmax) tmax = tymax;
    let tzmin = (ab.min.z - lpv.z) / ltv.z;
    let tzmax = (ab.max.z - lpv.z) / ltv.z; //	console.log("tzmin: "+tzmin+",tzmax: "+tzmax);
    //	console.log("\n");

    if (tzmin > tzmax) {
      f = tzmax;
      tzmax = tzmin;
      tzmin = f;
    }

    if (tmin > tzmax || tzmin > tmax) return false;
    if (tzmin > tmin) tmin = tzmin;
    if (tzmax < tmax) tmax = tzmax; //	console.log("XXXXXXXXX tmin: "+tmin+",tmax: "+tmax);

    outV.copyFrom(ltv);
    outV.scaleBy(tmin);
    outV.addBy(lpv); // console.log("L Hit outV: " + outV.toString());
    //outV.copyFrom(ltv);
    //outV.scaleBy(tmax);
    //outV.addBy(lpv);
    //console.log("tmax outV: "+outV.toString());

    return true;
  } //
  // 检测射线和AABB是否相交,如果相交计算出交点存放于 outV 中, 这个检测计算是精准高效的
  // @param				ltv		射线的切向
  // @param				lpv		射线上的一点
  // @param				ab		updateFast() 过的 AABB 实例
  // @param				outV	存放交点的 Vector3D实例
  //


  static IntersectionRL2(ltv, lpv, ab, outV) {
    // 计算包围球
    //let dis:number = StraightLine.CalcPVSquaredDis2(ltv, lpv, ab.center);
    outV.x = ab.center.x - lpv.x;
    outV.y = ab.center.y - lpv.y;
    outV.z = ab.center.z - lpv.z; //

    let dis = outV.dot(ltv);
    outV.x -= dis * ltv.x;
    outV.y -= dis * ltv.y;
    outV.z -= dis * ltv.z;

    if (outV.getLengthSquared() > ab.radius2) {
      //console.log("Hit shp failure.");
      return false;
    } // 包含起点，则一定相交


    if (ab.containsV(lpv)) {
      outV.copyFrom(lpv);
      return true;
    } // 确定 x 轴线


    if (lpv.x < ab.min.x) {
      // 说明 起点在 ab 的 -x 侧
      if (ltv.x > 0.0) {
        // 有可能和min x面相交
        dis = (ab.min.x - lpv.x) / ltv.x;
        outV.copyFrom(ltv);
        outV.scaleBy(dis);
        outV.addBy(lpv);

        if (ab.containsYZ(outV.y, outV.z)) {
          return true;
        }
      }
    } else if (lpv.x > ab.max.x) {
      // 说明 起点在 ab 的 +x 侧
      if (ltv.x < 0.0) {
        // 有可能和max x面相交
        dis = (ab.max.x - lpv.x) / ltv.x;
        outV.copyFrom(ltv);
        outV.scaleBy(dis);
        outV.addBy(lpv);

        if (ab.containsYZ(outV.y, outV.z)) {
          return true;
        }
      }
    } // 确定 y 轴线


    if (lpv.y < ab.min.y) {
      // 说明 起点在 ab 的 -y 侧
      if (ltv.y > 0.0) {
        // 有可能和min y面相交
        dis = (ab.min.y - lpv.y) / ltv.y;
        outV.copyFrom(ltv);
        outV.scaleBy(dis);
        outV.addBy(lpv);

        if (ab.containsXZ(outV.x, outV.z)) {
          return true;
        }
      }
    } else if (lpv.y > ab.max.y) {
      // 说明 起点在 ab 的 +y 侧
      if (ltv.y < 0.0) {
        // 有可能和max y面相交
        dis = ab.max.y;
        dis = (ab.max.y - lpv.y) / ltv.y;
        outV.copyFrom(ltv);
        outV.scaleBy(dis);
        outV.addBy(lpv);

        if (ab.containsXZ(outV.x, outV.z)) {
          return true;
        }
      }
    } // 确定 z 轴线


    if (lpv.z < ab.min.z) {
      // 说明 起点在 ab 的 -z 侧
      if (ltv.z > 0.0) {
        // 有可能和min y面相交
        dis = (ab.min.z - lpv.z) / ltv.z;
        outV.copyFrom(ltv);
        outV.scaleBy(dis);
        outV.addBy(lpv);

        if (ab.containsXY(outV.x, outV.y)) {
          return true;
        }
      }
    } else if (lpv.z > ab.max.z) {
      // 说明 起点在 ab 的 +z 侧
      if (ltv.z < 0.0) {
        // 有可能和max z面相交
        dis = (ab.max.z - lpv.z) / ltv.z;
        outV.copyFrom(ltv);
        outV.scaleBy(dis);
        outV.addBy(lpv);

        if (ab.containsXY(outV.x, outV.y)) {
          return true;
        }
      }
    }

    return false;
  }

}

exports.AABBCalc = AABBCalc;

/***/ }),

/***/ "e214":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

const AbsGeomBase_1 = __importDefault(__webpack_require__("f48d"));

class Plane extends AbsGeomBase_1.default {
  constructor() {
    super(...arguments);
    this.nv = new Vector3D_1.default(0.0, 1.0, 0.0);
    this.distance = 0.0;
    this.intersectBoo = false;
  }

  intersectStraightLinePos(straightL, outV) {
    // intersection or parallel
    let td = this.nv.dot(straightL.tv);

    if (td > MathConst_1.default.MATH_MIN_POSITIVE || td < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // intersection
      let dis = this.nv.dot(straightL.position) - this.distance;
      outV.x = straightL.tv.x * 100000.0 + straightL.position.x;
      outV.y = straightL.tv.y * 100000.0 + straightL.position.y;
      outV.z = straightL.tv.z * 100000.0 + straightL.position.z; //

      td = this.nv.dot(outV) - this.distance;
      td = dis / (dis - td);
      outV.subtractBy(straightL.position);
      outV.scaleBy(td);
      outV.addBy(straightL.position);
      return 1;
    }

    td = this.nv.dot(straightL.position) - this.distance;

    if (td <= MathConst_1.default.MATH_MIN_POSITIVE || td >= MathConst_1.default.MATH_MAX_NEGATIVE) {
      // plane contains line
      outV.copyFrom(straightL.position);
      return 2;
    }

    return 0;
  }

  intersectStraightLinePos2(sl_pos, sl_tv, outV) {
    // intersection or parallel
    let td = this.nv.dot(sl_tv);

    if (td > MathConst_1.default.MATH_MIN_POSITIVE || td < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // intersection
      let dis = this.nv.dot(sl_pos) - this.distance;
      outV.x = sl_tv.x * 100000.0 + sl_pos.x;
      outV.y = sl_tv.y * 100000.0 + sl_pos.y;
      outV.z = sl_tv.z * 100000.0 + sl_pos.z; //

      td = this.nv.dot(outV) - this.distance;
      td = dis / (dis - td);
      outV.subtractBy(sl_pos);
      outV.scaleBy(td);
      outV.addBy(sl_pos);
      return 1;
    }

    td = this.nv.dot(sl_pos) - this.distance;

    if (td <= MathConst_1.default.MATH_MIN_POSITIVE || td >= MathConst_1.default.MATH_MAX_NEGATIVE) {
      // plane contains line
      outV.copyFrom(sl_pos);
      return 2;
    }

    return 0;
  }

  intersectRadialLinePos(radL, outV) {
    let dis = this.nv.dot(radL.position) - this.distance;

    if (dis > MathConst_1.default.MATH_MIN_POSITIVE) {
      // radL position in plane positive space
      let td = this.nv.dot(radL.tv);

      if (td < 0.0) {
        // calc intersection position
        return this.intersectStraightLinePos2(radL.position, radL.tv, outV);
      }
    } else if (dis < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // radL position in plane negative space
      let td2 = this.nv.dot(radL.tv);

      if (td2 > 0.0) {
        // calc intersection position
        return this.intersectStraightLinePos2(radL.position, radL.tv, outV);
      }
    } else {
      let td3 = this.nv.dot(radL.tv);

      if (td3 > MathConst_1.default.MATH_MIN_POSITIVE || td3 < MathConst_1.default.MATH_MAX_NEGATIVE) {
        outV.copyFrom(radL.position);
        return 1;
      }

      outV.copyFrom(radL.position);
      return 2;
    }

    return -1;
  }

  intersectRadialLinePos2(rl_pos, rl_tv, outV) {
    let dis = this.nv.dot(rl_pos) - this.distance;

    if (dis > MathConst_1.default.MATH_MIN_POSITIVE) {
      // radL position in plane positive space
      let td = this.nv.dot(rl_tv);

      if (td < 0.0) {
        // calc intersection position
        return this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
      }
    } else if (dis < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // radL position in plane negative space
      let td = this.nv.dot(rl_tv);

      if (td > 0.0) {
        // calc intersection position
        return this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
      }
    } else {
      let td3 = this.nv.dot(rl_tv);

      if (td3 > MathConst_1.default.MATH_MIN_POSITIVE || td3 < MathConst_1.default.MATH_MAX_NEGATIVE) {
        outV.copyFrom(rl_pos);
        return 1;
      }

      outV.copyFrom(rl_pos);
      return 2;
    }

    return -1;
  }

  containsPoint(pos) {
    let f = this.nv.dot(pos) - this.distance;

    if (f > MathConst_1.default.MATH_MIN_POSITIVE) {
      return 1;
    } else if (f < MathConst_1.default.MATH_MAX_NEGATIVE) {
      return -1;
    }

    return 0;
  }

  intersectSphere(cv, radius) {
    this.intersectBoo = false;
    let f = this.nv.dot(cv) - this.distance;

    if (f > MathConst_1.default.MATH_MIN_POSITIVE) {
      this.intersectBoo = f <= radius;
      return 1;
    } else if (f < MathConst_1.default.MATH_MAX_NEGATIVE) {
      this.intersectBoo = -f <= radius;
      return -1;
    }

    return 0;
  }

  intersectAABB(minV, maxV) {
    this.intersectBoo = false;
    let pv = AbsGeomBase_1.default.__tV0;
    pv.setXYZ(maxV.x, minV.y, maxV.z);
    let flag = this.containsPoint(pv);
    pv.setXYZ(maxV.x, minV.y, minV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(minV.x, minV.y, minV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(minV.x, minV.y, maxV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(maxV.x, maxV.y, maxV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(maxV.x, maxV.y, minV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(minV.x, maxV.y, minV.z);
    flag += this.containsPoint(pv);
    pv.setXYZ(minV.x, maxV.y, maxV.z);
    flag += this.containsPoint(pv);
    this.intersectBoo = flag < 8;
    if (flag < -7) return -1;
    if (flag > 7) return 1;
    return 0;
  } // 判断一个球体是否和一个平面的负空间相交


  intersectSphNegSpace(cv, radius) {
    //this.intersectBoo = (this.nv.dot(cv) - this.distance - radius) < MathConst.MATH_MIN_POSITIVE;				
    //this.intersectBoo = (this.nv.dot(cv) - this.distance) < radius;				
    this.intersectBoo = Math.abs(this.nv.dot(cv) - this.distance) < radius;
  }

  update() {
    this.nv.normalize();
  }

  updateFast() {
    this.nv.normalize();
  }

  static PlaneIntersectSphere(pnv, pdis, cv, radius) {
    Plane.IntersectBoo = false;
    Plane.IntersectSatus = 0;
    pdis = pnv.dot(cv) - pdis;

    if (pdis > MathConst_1.default.MATH_MIN_POSITIVE) {
      Plane.IntersectBoo = pdis <= radius;
      Plane.IntersectSatus = 1;
    } else if (pdis < MathConst_1.default.MATH_MAX_NEGATIVE) {
      Plane.IntersectBoo = -pdis <= radius;
      Plane.IntersectSatus = -1;
    }
  }

  static CalcPVCloseV(plane, posV, outV) {
    let value = plane.distance - posV.dot(plane.nv);
    outV.setTo(value * plane.nv.x, value * plane.nv.y, value * plane.nv.z);
    outV.addBy(posV);
  }

  static CalcPVCloseV2(pnv, pd, posV, outV) {
    let value = pd - posV.dot(pnv);
    outV.setTo(value * pnv.x, value * pnv.y, value * pnv.z); //outV.scaleBy(value);

    outV.addBy(posV);
  }

  static IntersectionSLV2(planeNV, planeDis, sl_pos, sl_tv, outV) {
    // intersection or parallel
    let td = planeNV.dot(sl_tv);

    if (td > MathConst_1.default.MATH_MIN_POSITIVE || td < MathConst_1.default.MATH_MAX_NEGATIVE) {
      // intersection
      let dis = planeNV.dot(sl_pos) - planeDis;
      outV.x = sl_tv.x * 100000.0 + sl_pos.x;
      outV.y = sl_tv.y * 100000.0 + sl_pos.y;
      outV.z = sl_tv.z * 100000.0 + sl_pos.z; //

      td = planeNV.dot(outV) - planeDis;
      td = dis / (dis - td);
      outV.subtractBy(sl_pos);
      outV.scaleBy(td);
      outV.addBy(sl_pos);
      return 1;
    }

    td = planeNV.dot(sl_pos) - planeDis;

    if (td <= MathConst_1.default.MATH_MIN_POSITIVE || td >= MathConst_1.default.MATH_MAX_NEGATIVE) {
      // plane contains line
      outV.copyFrom(sl_pos);
      return 2;
    }

    return 0;
  }

  toString() {
    return "Plane(position=" + this.position.toString() + ", nv=" + this.nv.toString() + ")";
  }

}

Plane.IntersectBoo = false;
Plane.IntersectSatus = 0;
exports.default = Plane;

/***/ }),

/***/ "e2fe":
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

class AABB2D {
  constructor(px = 0.0, py = 0.0, pwidth = 100.0, pheight = 100.0) {
    this.m_right = 100;
    this.m_top = 100;
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.x = px;
    this.y = py;
    this.width = pwidth;
    this.height = pheight;
    this.update();
  }

  copyFrom(dst) {
    this.x = dst.x;
    this.y = dst.y;
    this.width = dst.width;
    this.height = dst.height;
    this.m_right = dst.m_right;
    this.m_top = dst.m_top;
  }

  clone() {
    return new AABB2D(this.x, this.y, this.width, this.height);
  }
  /**
   * 当前矩形是否包含某一点(同一坐标空间的点)
   * @param x坐标
   * @param y坐标
   * @returns 返回当前矩形是否包含这个坐标位置
   */


  containsXY(vx, vy) {
    if (vx < this.x || vx > this.m_right) return false;
    if (vy < this.y || vy > this.m_top) return false;
    return true;
  }
  /**
   * 当前矩形是否包含目标矩形
   * @param dst 目标矩形
   * @returns 返回当前矩形是否包含目标矩形
   */


  contains(dst) {
    if (dst.x >= this.x && dst.m_right <= this.m_right) {
      if (dst.y >= this.y && dst.m_top <= this.m_top) {
        return true;
      }
    }

    return true;
  }
  /**
   * 当前矩形是否和目标矩形相交
   * @param dst 目标矩形
   * @returns 返回当前矩形是否和目标矩形相交
   */


  intersect(dst) {
    if (dst.x > this.m_right) return false;
    if (dst.m_right < this.x) return false;
    if (dst.y > this.m_top) return false;
    if (dst.m_top < this.y) return false;
    return true;
  }

  setTo(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.m_right = this.width + this.x;
    this.m_top = this.height + this.y;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.m_right = this.width + this.x;
    this.m_top = this.height + this.y;
  }

  testEqual(dst) {
    return this.x != dst.x || this.y != dst.y || this.width != dst.width || this.height != dst.height;
  }

  testEqualWithParams(px, py, pw, ph) {
    return this.x != px || this.y != py || this.width != pw || this.height != ph;
  }

  update() {
    this.m_right = this.width + this.x;
    this.m_top = this.height + this.y;
  }

  flipY(height) {
    this.y = height = this.y;
    this.m_right = this.width + this.x;
    this.m_top = this.height + this.y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getRight() {
    return this.m_right;
  }

  getTop() {
    return this.m_top;
  }

}

exports.default = AABB2D;

/***/ }),

/***/ "e602":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererState_1 = __importDefault(__webpack_require__("29ef"));

class RenderingColorMask {
  constructor() {
    this.ALL_TRUE = 0;
    this.ALL_FALSE = 1;
    this.RED_TRUE = 2;
    this.GREEN_TRUE = 3;
    this.BLUE_TRUE = 4;
    this.ALPHA_TRUE = 5;
    this.RED_FALSE = 6;
    this.GREEN_FALSE = 7;
    this.BLUE_FALSE = 8;
    this.ALPHA_FALSE = 9;
    let state = RendererState_1.default;
    let selfT = this;
    selfT.ALL_TRUE = state.COLOR_MASK_ALL_TRUE;
    selfT.ALL_FALSE = state.COLOR_MASK_ALL_FALSE;
    selfT.RED_TRUE = state.COLOR_MASK_RED_TRUE;
    selfT.GREEN_TRUE = state.COLOR_MASK_GREEN_TRUE;
    selfT.BLUE_TRUE = state.COLOR_MASK_BLUE_TRUE;
    selfT.ALPHA_TRUE = state.COLOR_MASK_ALPHA_TRUE;
    selfT.RED_FALSE = state.COLOR_MASK_RED_FALSE;
    selfT.GREEN_FALSE = state.COLOR_MASK_GREEN_FALSE;
    selfT.BLUE_FALSE = state.COLOR_MASK_BLUE_FALSE;
    selfT.ALPHA_FALSE = state.COLOR_MASK_ALPHA_FALSE;
  }

}

exports.RenderingColorMask = RenderingColorMask;

/***/ }),

/***/ "e7ce":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const ShaderCodeBuffer_1 = __importDefault(__webpack_require__("faa5"));

const ShaderUniformData_1 = __importDefault(__webpack_require__("b3bd"));

const MaterialBase_1 = __importDefault(__webpack_require__("0fc4"));

class PixelPickIndexShaderBuffer extends ShaderCodeBuffer_1.default {
  constructor() {
    super();
    this.m_uniqueName = "";
  }

  initialize(texEnabled) {
    //console.log("PixelPickIndexShaderBuffer::initialize()...");
    this.m_uniqueName = "PixelPickIndexShd";
  }

  getFragShaderCode() {
    let fragCode = `#version 300 es
precision highp float;
uniform vec4 u_param;
in vec3 v_viewPos;
//in float v_length;
layout(location = 0) out vec4 FragColor0;
void main()
{
vec4 p = vec4(length(v_viewPos.xyz));
p.x = floor(p.x)/256.0;
p.y = floor(fract(p.x) * 256.0)/255.0;
p.x = floor(p.x) / 255.0;
p.z = fract(p.z);
FragColor0 = vec4(p.xyz,u_param.w);
}
`;
    return fragCode;
  }

  getVertShaderCode() {
    let vtxCode = `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_viewPos;
//out float v_length;
void main(){
mat4 viewMat4 = u_viewMat * u_objMat;
vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
v_viewPos = viewPos.xyz;
//v_length = length(viewPos.xyz);
gl_Position = u_projMat * viewPos;
}
`;
    return vtxCode;
  }

  getUniqueShaderName() {
    //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
    return this.m_uniqueName;
  }

  toString() {
    return "[PixelPickIndexShaderBuffer()]";
  }

  static GetInstance() {
    return PixelPickIndexShaderBuffer.s_instance;
  }

}

PixelPickIndexShaderBuffer.s_instance = new PixelPickIndexShaderBuffer();
exports.PixelPickIndexShaderBuffer = PixelPickIndexShaderBuffer;

class PixelPickIndexMaterial extends MaterialBase_1.default {
  constructor() {
    super();
    this.m_paramArray = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    this.m_1over255 = 1.0 / 255.0;
  }

  getCodeBuf() {
    return PixelPickIndexShaderBuffer.GetInstance();
  }

  setIndex(index) {
    this.m_paramArray[3] = index * this.m_1over255;
  }

  getIndex() {
    return this.m_paramArray[3] / this.m_1over255;
  }

  createSelfUniformData() {
    let oum = new ShaderUniformData_1.default();
    oum.uniformNameList = ["u_param"];
    oum.dataList = [this.m_paramArray];
    return oum;
  }

}

exports.default = PixelPickIndexMaterial;

/***/ }),

/***/ "e87b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const UniformConst_1 = __importDefault(__webpack_require__("ab73"));

class ViewParamUniformBuilder {
  create(rc, shdp) {
    let param = UniformConst_1.default.ViewportParam;
    if (shdp.hasUniformByName(param.name)) return rc.uniformContext.createShaderGlobalUniformFromProbe(rc.getRenderAdapter().uViewProbe, param.name, [param.name]);
    return null;
  }

  getIDNS() {
    return "ViewParamUniformBuilder";
  }

}

exports.default = ViewParamUniformBuilder;

/***/ }),

/***/ "eaee":
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
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const TextureProxy_1 = __importDefault(__webpack_require__("0851"));

class FloatCubeTextureProxy extends TextureProxy_1.default {
  constructor(texWidth, texHeight) {
    super(texWidth, texHeight, false);
    this.m_imgDataList = null;
    this.m_texTarget = TextureConst_1.TextureTarget.TEXTURE_CUBE;
    this.m_type = TextureProxyType_1.TextureProxyType.FloatCube;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA16F;
    this.dataType = TextureConst_1.TextureDataType.FLOAT;
    this.mipmapEnabled = true;
  }

  toAlphaFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.ALPHA;
    this.internalFormat = TextureConst_1.TextureFormat.ALPHA;
    this.unpackAlignment = 1;
  }

  toRedFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RED;
    this.internalFormat = TextureConst_1.TextureFormat.RED;
    this.unpackAlignment = 1;
  }

  toRGBFormat() {
    this.unpackAlignment = 1;
    this.srcFormat = TextureConst_1.TextureFormat.RGB;
    this.internalFormat = TextureConst_1.TextureFormat.RGB16F;
    this.minFilter = TextureConst_1.TextureConst.NEAREST;
    this.magFilter = TextureConst_1.TextureConst.NEAREST;
    this.mipmapEnabled = false;
  }

  toRGBAFormat() {
    this.unpackAlignment = 4;
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA16F;
  }

  toRGBFormatFloat32F() {
    this.unpackAlignment = 1;
    this.srcFormat = TextureConst_1.TextureFormat.RGB;
    this.internalFormat = TextureConst_1.TextureFormat.RGB32F;
    this.minFilter = TextureConst_1.TextureConst.NEAREST;
    this.magFilter = TextureConst_1.TextureConst.NEAREST;
    this.mipmapEnabled = false;
  }

  toRGBAFormatFloat32F() {
    this.unpackAlignment = 4;
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA32F;
  }

  toRGBAFormatHalfFloat() {
    this.unpackAlignment = 1;
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.dataType = TextureConst_1.TextureDataType.HALF_FLOAT;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA16F;
  }

  setDataFromBytesToFaceAt(index, bytes, pw, ph, miplevel = 0) {
    if (this.m_imgDataList == null) {
      this.m_imgDataList = [null, null, null, null, null, null];
    }

    if (pw > 0 && ph > 0) {
      if (index == 0 && miplevel < 1) {
        this.m_texWidth = pw;
        this.m_texHeight = ph;
        this.m_miplevel = miplevel;
      }

      if (this.m_imgDataList[index] == null) {
        this.m_imgDataList[index] = new Array(16);
      }

      let arr = this.m_imgDataList[index];
      arr[miplevel] = {
        width: pw,
        height: ph,
        imgData: bytes,
        miplevel: miplevel
      };
      this.m_haveRData = arr[miplevel].imgData != null;
    }
  }

  uploadData(texRes) {
    let gl = texRes.getRC();
    let imo = null;
    let width = this.getWidth();
    let height = this.getHeight();
    let pw;
    let ph;

    for (let i = 0; i < 6; ++i) {
      let arr = this.m_imgDataList[i];

      if (this.mipmapEnabled && this.m_generateMipmap) {
        imo = arr[0];
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat), width, height, 0, TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat), TextureConst_1.TextureDataType.ToGL(gl, this.dataType), imo.imgData);
      } else {
        pw = width;
        ph = height;
        let j = 0;

        for (; pw > 0 || ph > 0;) {
          if (arr[j] != null) {
            imo = arr[j];
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, TextureConst_1.TextureFormat.ToGL(gl, this.internalFormat), pw, ph, 0, TextureConst_1.TextureFormat.ToGL(gl, this.srcFormat), TextureConst_1.TextureDataType.ToGL(gl, this.dataType), imo.imgData);
          }

          if (pw > 0) pw >>= 1;
          if (ph > 0) ph >>= 1;
          ++j;
        }
      }
    }

    this.version = 0;
  }

  toString() {
    return "[FloatCubeTextureProxy(name:" + this.name + ",uid=" + this.getUid() + ",width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

  __$destroy() {
    if (this.getAttachCount() < 1) {
      if (this.m_imgDataList != null) {
        for (let i = 0; i < 6; ++i) {
          if (this.m_imgDataList[i] != null) {
            this.m_imgDataList[i].imgData = null;
          }
        }
      }

      console.log("FloatCubeTextureProxy::destroy(), destroy a FloatCubeTextureProxy instance...");

      super.__$destroy();
    }
  }

}

exports.default = FloatCubeTextureProxy;

/***/ }),

/***/ "eca0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2019-2022 by                                                 */

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

const PoolNodeBuilder_1 = __importDefault(__webpack_require__("2be1"));

const RPOUnit_1 = __importDefault(__webpack_require__("c62b")); //import PoolNodeBuilder = PoolNodeBuilderT.vox.base.PoolNodeBuilder;
// 这个类的实例，和每一个RPOUnit或者RODisplay关联(通过唯一的uid)


class RCRPObj {
  constructor() {
    // 这里假定最多有 16 个 RenerProcess, 每一个数组元素存放的是 RPONode 的uid, 数组的序号对应的是RenerProcess 的uid
    this.idsFlag = 0x0;
    this.count = 0; // 如果只有加入一个process的时候则有效

    this.rprocessUid = -1;
  }

  reset() {
    this.idsFlag = 0;
  }

}

RCRPObj.RenerProcessMaxTotal = 16;
exports.RCRPObj = RCRPObj;

class RPOUnitBuilder extends PoolNodeBuilder_1.default {
  constructor() {
    super(...arguments);
    this.m_rcpoList = [];
  }
  /**
   * the sub class override this function, for real implement.
   */


  createNode() {
    let po = new RCRPObj();
    po.reset();
    this.m_rcpoList.push(po);
    return new RPOUnit_1.default();
  }
  /**
   * the sub class override this function, for real implement.
   */


  restoreUid(uid) {
    this.m_rcpoList[uid].reset();
  }

  testRPNodeExists(dispRUid, rprocessUid) {
    return (this.m_rcpoList[dispRUid].idsFlag & 1 << rprocessUid) > 0;
  }

  testRPNodeNotExists(dispRUid, rprocessUid) {
    return (this.m_rcpoList[dispRUid].idsFlag & 1 << rprocessUid) < 1;
  }

  setRPNodeParam(dispRUid, rprocessUid, rponodeUid) {
    let po = this.m_rcpoList[dispRUid];
    let flag = 1 << rprocessUid;

    if (rponodeUid > -1) {
      if ((po.idsFlag & flag) < 1) {
        ++po.count;
        po.rprocessUid = rprocessUid;
        po.idsFlag = po.idsFlag | flag;
      }
    } else {
      if ((po.idsFlag & flag) > 0) {
        --po.count;
        po.idsFlag = po.idsFlag & ~flag;
      }
    }

    return po.count;
  }

  getRCRPObj(dispRUid) {
    return this.m_rcpoList[dispRUid];
  }

}

exports.RPOUnitBuilder = RPOUnitBuilder;

/***/ }),

/***/ "ee5a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class EvtNode {
  constructor() {
    this.type = 0;
    this.m_listeners = [];
    this.m_hosts = [];
    this.m_phases = [];
  }

  addListener(target, func, phase) {
    let i = this.m_hosts.length - 1;

    for (; i >= 0; --i) {
      if (target === this.m_hosts[i]) {
        break;
      }
    }

    if (i < 0) {
      this.m_hosts.push(target);
      this.m_listeners.push(func);
      this.m_phases.push(phase);
    }
  }

  removeListener(target, func) {
    let i = this.m_hosts.length - 1;

    for (; i >= 0; --i) {
      if (target === this.m_hosts[i]) {
        this.m_hosts.splice(i, 1);
        this.m_listeners.splice(i, 1);
        this.m_phases.splice(i, 1);
        break;
      }
    }
  } // @return      1 is send evt yes,0 is send evt no


  dispatch(evt) {
    let flag = 0;
    let len = this.m_hosts.length;

    for (let i = 0; i < len; ++i) {
      if (this.m_phases[i] < 1 || evt.phase == this.m_phases[i]) {
        this.m_listeners[i].call(this.m_hosts[i], evt);
        flag = 1;
      }
    }

    return flag;
  } //@return if the evt can be dispatched in this node,it returns 1,otherwise it returns 0


  passTestEvt(evt) {
    let len = this.m_hosts.length;

    for (let i = 0; i < len; ++i) {
      if (this.m_phases[i] < 1 || evt.phase == this.m_phases[i]) {
        return 1;
        break;
      }
    }

    return 0;
  }

  passTestPhase(phase) {
    let len = this.m_hosts.length;

    for (let i = 0; i < len; ++i) {
      if (this.m_phases[i] < 1 || phase == this.m_phases[i]) {
        return 1;
        break;
      }
    }

    return 0;
  }

  destroy() {
    this.m_hosts = [];
    this.m_listeners = [];
    this.m_phases = [];
  }

}

exports.default = EvtNode;

/***/ }),

/***/ "f208":
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

class ShaderCompileInfo {
  constructor() {
    this.info = "";
  }

}

exports.default = ShaderCompileInfo;

/***/ }),

/***/ "f3a2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * IShaderCodeObject instance uuid
 */

var ShaderCodeUUID;

(function (ShaderCodeUUID) {
  /**
   * nothing shader code object
   */
  ShaderCodeUUID["None"] = "";
  /**
   * the default value is PBR light shader code object that it comes from the system shader lib.
   */

  ShaderCodeUUID["Default"] = "pbr";
  /**
   * lambert light shader code object that it comes from the system shader lib.
   */

  ShaderCodeUUID["Lambert"] = "lambert";
  /**
   * PBR light shader code object that it comes from the system shader lib.
   */

  ShaderCodeUUID["PBR"] = "pbr";
})(ShaderCodeUUID || (ShaderCodeUUID = {}));

exports.ShaderCodeUUID = ShaderCodeUUID;

/***/ }),

/***/ "f444":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MouseEvent_1 = __importDefault(__webpack_require__("1710"));

const CameraDragSwinger_1 = __webpack_require__("bcac");

const CameraDragSlide_1 = __webpack_require__("278e");

class CameraDragController {
  constructor() {
    this.m_stage3D = null;
    this.m_dragSwinger = new CameraDragSwinger_1.CameraDragSwinger();
    this.m_dragSlider = new CameraDragSlide_1.CameraDragSlide();
    this.m_swing = true;
  }

  initialize(stage3D, camera) {
    if (this.m_stage3D == null) {
      this.m_stage3D = stage3D;
      this.m_dragSwinger.initialize(stage3D, camera);
      this.m_dragSlider.initialize(stage3D, camera);
      stage3D.addEventListener(MouseEvent_1.default.MOUSE_BG_DOWN, this, this.mouseDownListener, true, false);
      stage3D.addEventListener(MouseEvent_1.default.MOUSE_UP, this, this.mouseUpListener, false, true);
    }
  }

  setSlideSpeed(slideSpeed) {
    this.m_dragSlider.slideSpeed = slideSpeed;
  }

  enableSwing() {
    this.m_swing = true;
  }

  enableSlide() {
    this.m_swing = false;
  }

  mouseDownListener(evt) {
    this.m_dragSwinger.attach();
    this.m_dragSlider.attach();
  }

  mouseUpListener(evt) {
    this.m_dragSwinger.detach();
    this.m_dragSlider.detach();
  }

  detach() {
    this.m_dragSwinger.detach();
    this.m_dragSlider.detach();
  }

  runWithYAxis() {
    if (this.m_swing) {
      this.m_dragSwinger.runWithYAxis();
    } else {
      this.m_dragSlider.run();
    }
  }

  runWithZAxis() {
    if (this.m_swing) {
      this.m_dragSwinger.runWithZAxis();
    } else {
      this.m_dragSlider.run();
    }
  }

}

exports.default = CameraDragController;

/***/ }),

/***/ "f48d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

class AbsGeomBase {
  constructor() {
    // unique id
    this.id = -1;
    this.position = new Vector3D_1.default();
  }

  update() {}

  updateFast() {}

}

AbsGeomBase.__tV0 = new Vector3D_1.default();
AbsGeomBase.__tV1 = new Vector3D_1.default();
AbsGeomBase.__tV2 = new Vector3D_1.default();
exports.AbsGeomBase = AbsGeomBase;
exports.default = AbsGeomBase;

/***/ }),

/***/ "f63b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const TextureConst_1 = __webpack_require__("8d98");

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

function generateCanvasMipmapsAt(src) {
  let width = src.width;
  let height = src.height;

  if (width >= 2 || height >= 2) {
    width = width >= 2 ? width / 2 | 0 : 1;
    height = height >= 2 ? height / 2 | 0 : 1;
    return createImageCanvas(src, width, height).canvas;
  }

  return null;
}

function createImageCanvas(img, pw, ph) {
  var canvas = document.createElement('canvas'); //document.body.appendChild(canvas);

  canvas.width = pw;
  canvas.height = ph; //console.log("createImageCanvas(). size: "+canvas.width+","+canvas.height);
  //canvas.style.visibility = "hidden";

  canvas.style.backgroundColor = "transparent";
  canvas.style.display = "block";
  canvas.style.left = '0px';
  canvas.style.top = '0px';
  canvas.style.position = 'absolute';
  let ctx2d = canvas.getContext("2d");
  ctx2d.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
  return {
    canvas: canvas,
    ctx2d: ctx2d
  };
}

function createImageCanvasAlphaOffset(img, pw, ph) {
  var canvas = document.createElement('canvas'); //document.body.appendChild(canvas);

  canvas.width = pw;
  canvas.height = ph; //console.log("createImageCanvasAlphaOffset(). size: "+canvas.width+","+canvas.height);
  //canvas.style.visibility = "hidden";

  canvas.style.backgroundColor = "transparent";
  canvas.style.display = "block";
  canvas.style.left = '0px';
  canvas.style.top = '0px';
  canvas.style.position = 'absolute';
  let ctx2d = canvas.getContext("2d"); //ctx2d.globalAlpha = 1.0;

  ctx2d.globalCompositeOperation = "destination-atop"; //ctx2d.globalCompositeOperation = "multiply";
  //ctx2d.globalCompositeOperation = "destination-over";
  //ctx2d.globalCompositeOperation = "lighter";

  ctx2d.fillStyle = "rgba(255, 255, 255, 1.0)";
  ctx2d.rect(0, 0, canvas.width, canvas.height);
  ctx2d.fill(); //ctx2d.globalCompositeOperation = "copy";

  ctx2d.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height); //ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,canvas.width,canvas.height);

  return {
    canvas: canvas,
    ctx2d: ctx2d
  };
}

class ImgResUnit {
  constructor(purl, mipLv) {
    this.m_url = "";
    this.m_img = null;
    this.m_loaded = false;
    this.m_mipLv = 0;
    this.texture = null;
    this.bytesTex = null;
    this.powerOf2Fix = false;
    this.offsetTex = null;
    this.premultipliedAlpha = true;
    this.m_url = purl;
    this.m_mipLv = mipLv;
  }

  startLoad() {
    if (this.m_img == null) {
      let selfT = this;
      this.m_img = new Image();

      this.m_img.onload = function (evt) {
        selfT.m_loaded = true;
        selfT.buildTex();
      };

      this.m_img.addEventListener('error', evt => {
        if (selfT.m_url != "") {
          console.error("load image url error: ", selfT.m_url);
        }
      });
      this.m_img.crossOrigin = ""; //m_img.setAttribute('crossorigin', 'anonymous');

      this.m_img.src = this.m_url;
    }
  }

  buildTex() {
    let img = this.m_img;

    if (img != null && this.m_loaded) {
      let tex = this.texture;
      let offsetTex = this.offsetTex;
      let bytesTex = this.bytesTex;
      let imgData = null;
      let powBoo = MathConst_1.default.IsPowerOf2(img.width) && MathConst_1.default.IsPowerOf2(img.height);
      let powerOf2Fix = this.powerOf2Fix;

      if (RendererDevice_1.default.IsWebGL1()) {
        powerOf2Fix = true;
      }

      if (!powBoo && powerOf2Fix) {
        let pwidth = MathConst_1.default.CalcCeilPowerOfTwo(img.width);
        let pheight = MathConst_1.default.CalcCeilPowerOfTwo(img.height);
        if (pwidth > RendererDevice_1.default.MAX_TEXTURE_SIZE) pwidth = RendererDevice_1.default.MAX_TEXTURE_SIZE;
        if (pheight > RendererDevice_1.default.MAX_TEXTURE_SIZE) pwidth = RendererDevice_1.default.MAX_TEXTURE_SIZE;
        console.log("image canvas size: " + pwidth + "," + pheight);
        let dobj = createImageCanvas(img, pwidth, pheight);
        let mipLv = this.m_mipLv;

        if (tex != null) {
          tex.setDataFromImage(dobj.canvas, mipLv);
          console.log("use a base canvas create a img tex.");
          tex.name = this.m_img.src;

          if (offsetTex != null) {
            dobj = createImageCanvasAlphaOffset(img, pwidth, pheight);
            offsetTex.setDataFromImage(dobj.canvas, mipLv);
          }
        }

        if (bytesTex != null) {
          if (this.premultipliedAlpha) {
            console.log("use a base canvas create a bytes tex.");
            imgData = dobj.ctx2d.getImageData(0, 0, dobj.canvas.width, dobj.canvas.height);
            bytesTex.setDataFromBytes(imgData.data, mipLv, dobj.canvas.width, dobj.canvas.height);
            bytesTex.name = this.m_img.src;
          } else {
            //let t:number = Date.now();
            console.log("use a base canvas and a blendCanvas create a bytes tex.");
            imgData = dobj.ctx2d.getImageData(0, 0, dobj.canvas.width, dobj.canvas.height);
            let dst = imgData.data;
            let offsetObj = createImageCanvasAlphaOffset(img, pwidth, pheight);
            imgData = offsetObj.ctx2d.getImageData(0, 0, offsetObj.canvas.width, offsetObj.canvas.height);
            let sdata = imgData.data;
            let i = 0,
                j = 0,
                k = 0;

            for (; i < pheight; ++i) {
              for (j = 0; j < pwidth; ++j) {
                dst[k] += 255 - sdata[k];
                dst[k + 1] += 255 - sdata[k + 1];
                dst[k + 2] += 255 - sdata[k + 2]; //sdata[k + 3] = dst[k + 3];

                k += 4;
              }
            } //console.log("Loss time: "+(Date.now() - t));


            bytesTex.setDataFromBytes(dst, mipLv, dobj.canvas.width, dobj.canvas.height);
            bytesTex.name = this.m_img.src;
          }
        }
      } else {
        if (tex != null) {
          if (!this.powerOf2Fix) {
            console.log("image img size: " + img.width + "," + img.height);
          }

          tex.setDataFromImage(img, this.m_mipLv);
          tex.name = this.m_img.src;
        } else if (bytesTex != null) {
          let pwidth = MathConst_1.default.CalcNearestCeilPow2(img.width);
          let pheight = MathConst_1.default.CalcNearestCeilPow2(img.height);
          if (pwidth > 2048) pwidth = 2048;
          if (pheight > 2048) pwidth = 2048;
          let dobj = createImageCanvas(img, pwidth, pheight);
          let mipLv = this.m_mipLv;
          imgData = dobj.ctx2d.getImageData(0, 0, dobj.canvas.width, dobj.canvas.height);
          bytesTex.setDataFromBytes(imgData.data, mipLv, dobj.canvas.width, dobj.canvas.height);
          bytesTex.name = this.m_img.src;
        }
      }

      this.m_loaded = true; //console.log("ImgResUnit:startLoad(), loaded m_url: "+selfT.m_url);
    }
  }

  getURL() {
    return this.m_url;
  }

  getImage() {
    return this.m_img;
  }

  isLoaded() {
    return this.m_loaded;
  }

  destroy() {
    //console.log("ImgResUnit:destroy(), remove a res m_url: "+this.m_url);
    this.m_loaded = false;
    this.m_url = "";
    this.texture = null; // cancel image load

    this.m_img.src = "";
    this.m_img = null;
  }

}

class CubeImgResLoader {
  constructor(purls) {
    this.m_urls = null;
    this.m_imgs = [];
    this.m_loadedTotal = 0;
    this.m_loaded = false;
    this.m_texList = [];
    this.m_mLvList = [];
    this.m_urls = purls;
    var thisT = this;
    let i = 0;
    let img = null;

    for (; i < 6; ++i) {
      img = new Image();

      img.onload = function (info) {
        thisT.m_loadedTotal++;

        if (thisT.m_loadedTotal >= 6) {
          let i = 0;

          for (i = 0; i < 6; ++i) {
            //trace("m_imgs["+i+"] size: "+m_imgs[i].width+","+m_imgs[i].height);
            thisT.m_texList[0].setDataFromImageToFaceAt(i, thisT.m_imgs[i], thisT.m_mLvList[0]);
          }

          thisT.m_texList[0].name = thisT.m_imgs.src;
        }
      };

      img.crossOrigin = "";
      img.src = thisT.m_urls[i];
      thisT.m_imgs.push(img);
    }
  }

  addTex(tex, mipLevel) {
    this.m_texList.push(tex);
    this.m_mLvList.push(mipLevel);
  }

  getURLAt(i) {
    return this.m_urls[0];
  }

  getTexAt(i) {
    return this.m_texList[i];
  }

  isLoaded() {
    return this.m_loaded;
  }

  destroy() {}

}

class ImageTextureLoader {
  constructor(texBlock) {
    this.m_cubeDict = new Map();
    this.m_resMap = new Map();
    this.m_loadedList = [];
    this.m_waitLoadList = [];
    this.m_loadingList = [];
    this.m_loadingQueueMaxLength = 5;
    this.m_loadDelay = 17;
    this.m_loadDelayTime = 17;
    this.m_testDelay = 512;
    this.m_testDelayTime = 512;
    this.m_texBlock = null;
    this.m_runFlag = 0;
    this.m_texBlock = texBlock;

    if (texBlock != null) {
      texBlock.addTexLoader(this);
    }
  }

  getTexByUrl(purl, wrapRepeat = true, mipmapEnabled = true, powerOf2Fix = false) {
    let ptex = this.getImageTexByUrl(purl, 0, false, powerOf2Fix);
    ptex.mipmapEnabled = mipmapEnabled;
    if (wrapRepeat) ptex.setWrap(TextureConst_1.TextureConst.WRAP_REPEAT);
    return ptex;
  }

  getBytesNoPremultipliedAlphaTexByUrl(purl, mipLevel = 0) {
    if (purl == "") {
      return null;
    }

    if (mipLevel < 0) mipLevel = 0;
    let t = this.m_resMap.get(purl);

    if (t == null) {
      t = new ImgResUnit(purl, mipLevel);
      t.premultipliedAlpha = false;
      this.m_resMap.set(purl, t);
      let tex = this.m_texBlock.createBytesTex(1, 1);
      tex.name = purl;
      t.bytesTex = tex;
      this.m_waitLoadList.push(t);
      return tex;
    } else {
      if (t.bytesTex.isDestroyed()) {
        t.bytesTex = this.m_texBlock.createBytesTex(1, 1);
      }

      return t.bytesTex;
    }
  }

  getBytesTexByUrl(purl, mipLevel = 0) {
    if (purl == "") {
      return null;
    }

    if (mipLevel < 0) mipLevel = 0;
    let t = this.m_resMap.get(purl);

    if (t == null) {
      t = new ImgResUnit(purl, mipLevel);
      this.m_resMap.set(purl, t);
      let tex = this.m_texBlock.createBytesTex(1, 1);
      tex.name = purl;
      t.bytesTex = tex;
      this.m_waitLoadList.push(t);
      return tex;
    } else {
      if (t.bytesTex.isDestroyed()) {
        t.bytesTex = this.m_texBlock.createBytesTex(1, 1);
      }

      return t.bytesTex;
    }
  }

  getImageOffsetTexByUrl(purl, mipLevel = 0) {
    if (purl == "") {
      return null;
    }

    if (mipLevel < 0) mipLevel = 0;
    let t = this.m_resMap.get(purl);

    if (t != null) {
      return t.offsetTex;
    }

    return null;
  }

  getImageTexByUrl(purl, mipLevel = 0, offsetTexEnabled = false, powerOf2Fix = false) {
    if (purl == "") {
      return null;
    }

    if (mipLevel < 0) mipLevel = 0;
    let t = this.m_resMap.get(purl);

    if (t == null) {
      t = new ImgResUnit(purl, mipLevel);
      t.powerOf2Fix = powerOf2Fix;

      if (offsetTexEnabled) {
        t.offsetTex = this.m_texBlock.createImageTex2D(1, 1, false);
      }

      this.m_resMap.set(purl, t);
      let tex = this.m_texBlock.createImageTex2D(1, 1, false);
      tex.name = purl;
      t.texture = tex;
      this.m_waitLoadList.push(t);
      return tex;
    } else {
      if (t.texture.isDestroyed()) {
        t.texture = this.m_texBlock.createImageTex2D(1, 1, false);
      }

      return t.texture;
    }
  }

  getCubeTexAndLoadImg(idns, purls, mipLevel = 0) {
    if (idns == "" || purls == null || purls.length < 6) {
      return null;
    }

    if (mipLevel < 0) mipLevel = 0;
    let t = this.m_cubeDict.get(idns);

    if (t == null) {
      t = new CubeImgResLoader(purls);
      this.m_cubeDict.set(idns, t);
      let tex = this.m_texBlock.createImageCubeTex(8, 8);
      t.addTex(tex, mipLevel);
      return tex;
    } else {
      return t.getTexAt(0);
    }
  }

  setRunFlag(flag) {
    this.m_runFlag = flag;
  }

  getRunFlag() {
    return this.m_runFlag;
  }

  isRunning() {
    return true;
  }

  isStopped() {
    return false;
  }

  run() {
    let i = 0;
    let res = null;
    --this.m_loadDelay;

    if (this.m_loadDelay < 1) {
      this.m_loadDelay = this.m_loadDelayTime;
      let loatingTotal = this.m_loadingList.length;

      if (loatingTotal > 0) {
        for (; i < loatingTotal; ++i) {
          if (this.m_loadingList[i].isLoaded()) {
            this.m_loadedList.push(this.m_loadingList[i]);
            this.m_loadingList.splice(i, 1);
            --i;
            --loatingTotal;
          }
        }
      }

      let waitingTotal = this.m_waitLoadList.length;

      if (waitingTotal > 0) {
        //console.log("ImageTextureLoader::run(), waitingTotal: "+waitingTotal);
        if (loatingTotal < this.m_loadingQueueMaxLength) {
          i = loatingTotal;

          for (; i < this.m_loadingQueueMaxLength; ++i) {
            if (this.m_waitLoadList.length > 0) {
              res = this.m_waitLoadList.pop();
              this.m_loadingList.push(res);
              res.startLoad();
            } else {
              break;
            }
          }
        }
      }
    }

    --this.m_testDelay;

    if (this.m_testDelay < 1) {
      this.m_testDelay = this.m_testDelayTime;
      let tex = null;
      let len = this.m_loadedList.length;

      for (i = 0; i < len; ++i) {
        res = this.m_loadedList[i];
        tex = res.texture != null ? res.texture : res.bytesTex;

        if (tex.isDestroyed()) {
          console.log("ImageTextureLoader::run(),remove a resource,url: ", res.getURL());
          this.m_resMap.delete(res.getURL());
          this.m_loadedList.splice(i, 1);
          res.destroy();
          --i;
          --len;
        }
      }
    }
  }

  getWaitTotal() {
    return this.m_waitLoadList.length;
  }

  isLoadedAll() {
    return this.m_waitLoadList.length < 1;
  }

}

exports.default = ImageTextureLoader;

/***/ }),

/***/ "f928":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const RawDataTextureProxy_1 = __importDefault(__webpack_require__("df25"));

class FloatTextureProxy extends RawDataTextureProxy_1.default {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.m_type = TextureProxyType_1.TextureProxyType.Float;
    this.minFilter = TextureConst_1.TextureConst.LINEAR;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA16F;
    this.dataType = TextureConst_1.TextureDataType.FLOAT;
    this.unpackAlignment = 4;
  }

  toAlphaFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.ALPHA;
    this.internalFormat = TextureConst_1.TextureFormat.ALPHA;
    this.unpackAlignment = 1;
  }

  toRedFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RED;
    this.internalFormat = TextureConst_1.TextureFormat.RED;
    this.unpackAlignment = 1;
  }

  toRGBFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RGB;
    this.internalFormat = TextureConst_1.TextureFormat.RGB16F;
    this.unpackAlignment = 1;
  }

  toRGBAFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA;
    this.unpackAlignment = 4;
  }

  toRGBAFloatFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA16F;
    this.unpackAlignment = 4;
  }

  setDataFromBytes(bytes, miplevel = 0, imgWidth = -1, imgHeight = -1, offsetx = 0, offsety = 0, rebuild = false) {
    super.setDataFromBytes(bytes, miplevel, imgWidth, imgHeight, offsetx, offsety, rebuild);
  }

  setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel = 0) {
    super.setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel);
  }

  getPixels(px, py, pw, ph, outBytes) {
    super.getPixels(px, py, pw, ph, outBytes);
  }

  toString() {
    return "[FloatTextureProxy(width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

}

exports.default = FloatTextureProxy;

/***/ }),

/***/ "fa60":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const VROBase_1 = __importDefault(__webpack_require__("919c"));

class VaoVertexRenderObj extends VROBase_1.default {
  constructor() {
    super();
    /**
     * vao buffer object
     */

    this.vao = null;
    this.m_uid = VaoVertexRenderObj.s_uid++;
  }

  run() {
    if (this.m_rc.testVROUid(this.m_uid)) {
      // console.log("VaoVertexRenderObj::run(), rcuid: ",this.m_rc.getRCUid(),this.m_vtxUid, this.m_uid);
      this.m_rc.bindVertexArray(this.vao);

      if (this.m_rc.testRIOUid(this.m_vtxUid) || VROBase_1.default.s_mid != this.m_mid) {
        // if (this.m_rc.testRIOUid(this.m_vtxUid)) {
        // console.log("VaoVertexRenderObj::run(), testRIOUid()..");
        VROBase_1.default.s_mid = this.m_mid;
        this.m_rc.bindEleBuf(this.ibuf);
      }
    }
  }

  __$destroy() {
    console.log("VaoVertexRenderObj::__$destroy()..., " + this);
    VROBase_1.default.s_midMap.delete(this.m_mid);
    this.m_mid = 0;
    this.m_vtxUid = -1;
    this.ibuf = null;
    this.vao = null;
    this.m_rc = null;
  }

  restoreThis() {
    if (this.vao != null) {
      this.m_rc.deleteVertexArray(this.vao);
    }

    VaoVertexRenderObj.Restore(this);
  }

  toString() {
    return "VaoVertexRenderObj(uid = " + this.m_uid + ", type=" + this.m_mid + ")";
  }

  static HasMid(mid) {
    return VROBase_1.default.s_midMap.has(mid);
  }

  static GetByMid(mid) {
    return VROBase_1.default.s_midMap.get(mid);
  }

  static GetFreeId() {
    if (VaoVertexRenderObj.s_freeIdList.length > 0) {
      return VaoVertexRenderObj.s_freeIdList.pop();
    }

    return -1;
  }

  static Create(rc, mid, pvtxUid) {
    let unit = null;
    let index = VaoVertexRenderObj.GetFreeId();

    if (index >= 0) {
      unit = VaoVertexRenderObj.s_unitList[index];
      VaoVertexRenderObj.s_unitFlagList[index] = VaoVertexRenderObj.s_FLAG_BUSY;
      unit.setMidAndBufUid(mid, pvtxUid);
    } else {
      unit = new VaoVertexRenderObj();
      unit.setMidAndBufUid(mid, pvtxUid);
      VaoVertexRenderObj.s_unitList.push(unit);
      VaoVertexRenderObj.s_unitFlagList.push(VaoVertexRenderObj.s_FLAG_BUSY);
      VaoVertexRenderObj.s_unitListLen++;
    }

    unit.setRC(rc);
    VROBase_1.default.s_midMap.set(mid, unit);
    return unit;
  }

  static Restore(pobj) {
    //console.log("VaoVRO Restore XXXX ("+pobj.getUid()+")pobj.m_attachCount: ",pobj.m_attachCount);
    if (pobj != null && pobj.m_attachCount < 1 && VaoVertexRenderObj.s_unitFlagList[pobj.getUid()] == VaoVertexRenderObj.s_FLAG_BUSY) {
      let uid = pobj.getUid();
      VaoVertexRenderObj.s_freeIdList.push(uid);
      VaoVertexRenderObj.s_unitFlagList[uid] = VaoVertexRenderObj.s_FLAG_FREE;

      pobj.__$destroy();
    }
  }

}

VaoVertexRenderObj.s_uid = 0;
VaoVertexRenderObj.s_FLAG_BUSY = 1;
VaoVertexRenderObj.s_FLAG_FREE = 0;
VaoVertexRenderObj.s_unitFlagList = [];
VaoVertexRenderObj.s_unitListLen = 0;
VaoVertexRenderObj.s_unitList = [];
VaoVertexRenderObj.s_freeIdList = [];
exports.default = VaoVertexRenderObj;

/***/ }),

/***/ "faa5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const ShaderCodeUUID_1 = __webpack_require__("f3a2");

const ShaderCodeBuilder_1 = __importDefault(__webpack_require__("4a54"));

const MaterialPipeType_1 = __webpack_require__("5216");

const ShaderCodeUniform_1 = __webpack_require__("3113");

const ShaderTextureBuilder_1 = __webpack_require__("4efa");

class ShaderCodeBuffer {
  constructor() {
    this.m_coder = null;
    this.m_shaderCodeObj = null;
    this.m_texList = null;
    this.m_texEnabled = true;
    this.pipeline = null;
    this.vertColorEnabled = false;
    this.premultiplyAlpha = false;
    this.shadowReceiveEnabled = false;
    this.lightEnabled = false;
    this.fogEnabled = false;
    this.envAmbientLightEnabled = false;
    this.brightnessOverlayEnabeld = false;
    this.glossinessEnabeld = true;
    this.pipeTypes = null;
    this.keysString = "";
    /**
     * 是否自适应转换shader版本
     */

    this.adaptationShaderVersion = true;

    if (ShaderCodeBuffer.s_coder == null) {
      ShaderCodeBuffer.s_uniform = new ShaderCodeUniform_1.ShaderCodeUniform();
      ShaderCodeBuffer.s_coder = new ShaderCodeBuilder_1.default(ShaderCodeBuffer.s_uniform);

      ShaderCodeBuffer.s_uniform.__$setCodeBuilder(ShaderCodeBuffer.s_coder);

      ShaderCodeBuffer.s_texBulder = new ShaderTextureBuilder_1.ShaderTextureBuilder(ShaderCodeBuffer.s_uniform);
    }
  }

  reset() {
    this.m_coder = ShaderCodeBuffer.s_coder;
    this.m_uniform = ShaderCodeBuffer.s_uniform;
    this.m_texBulder = ShaderCodeBuffer.s_texBulder;
    this.m_texture = this.m_uniform;
    this.m_coder.reset();
    this.m_texList = null;
    this.pipeTypes = null;
    this.vertColorEnabled = false;
    this.premultiplyAlpha = false;
    this.shadowReceiveEnabled = false;
    this.lightEnabled = false;
    this.fogEnabled = false;
    this.envAmbientLightEnabled = false;
    this.brightnessOverlayEnabeld = false;
    this.glossinessEnabeld = true;
    this.keysString = "";
  }

  clear() {
    this.m_coder = null;
  }

  setShaderCodeObject(obj) {
    this.m_shaderCodeObj = obj;
  }

  getShaderCodeObject() {
    return this.m_shaderCodeObj;
  }

  getShaderCodeObjectUUID() {
    return ShaderCodeUUID_1.ShaderCodeUUID.None;
  }

  getShaderCodeBuilder() {
    return ShaderCodeBuffer.s_coder;
  }

  static GetPreCompileInfo() {
    return ShaderCodeBuffer.s_coder.getPreCompileInfo();
  }

  initialize(texEnabled) {
    // if (ShaderCodeBuffer.__$s_csBuf != null) {
    //     if (ShaderCodeBuffer.__$s_csBuf != this) {
    //         ShaderCodeBuffer.__$s_csBuf.initialize(texEnabled);
    //     }
    // }
    this.m_texEnabled = texEnabled;
    this.bufInitWithPipeline();
  }

  buildDefine() {
    if (this.premultiplyAlpha) {
      this.m_coder.addDefine("VOX_PREMULTIPLY_ALPHA");
      this.keysString += "A";
    }

    if (this.vertColorEnabled) {
      this.m_coder.addDefine("VOX_USE_VTX_COLOR");
      this.keysString += "UVC";
    }

    if (this.brightnessOverlayEnabeld) {
      this.m_coder.addDefine("VOX_USE_BRIGHTNESS_OVERLAY_COLOR");
      this.keysString += "UBOC";
    }

    if (this.glossinessEnabeld) {
      this.m_coder.addDefine("VOX_USE_GLOSSINESS");
      this.keysString += "UG";
    }
  }

  buildPipelineParams() {
    if (this.pipeline != null) {
      if (this.pipeTypes == null) {
        this.pipeTypes = [];
        if (this.lightEnabled) this.pipeTypes.push(MaterialPipeType_1.MaterialPipeType.GLOBAL_LIGHT);
        if (this.shadowReceiveEnabled) this.pipeTypes.push(MaterialPipeType_1.MaterialPipeType.VSM_SHADOW);
        if (this.fogEnabled) this.pipeTypes.push(MaterialPipeType_1.MaterialPipeType.FOG_EXP2);
        if (this.envAmbientLightEnabled) this.pipeTypes.push(MaterialPipeType_1.MaterialPipeType.ENV_AMBIENT_LIGHT);
      }
    }
  }

  getTexturesFromPipeline(outList) {
    if (this.pipeline != null) {
      this.pipeline.getTextures(this.m_coder, outList, this.pipeTypes);
    }
  }

  bufInitWithPipeline() {
    if (this.pipeline != null) {
      this.buildPipelineParams();
      this.pipeline.buildSharedUniforms(this.pipeTypes);
      this.pipeline.createKeys(this.pipeTypes);
      this.keysString += this.pipeline.getKeysString();
    }
  }

  isTexEanbled() {
    return this.m_texEnabled;
  }

  setIRenderTextureList(texList) {
    this.m_texList = texList;
  }

  getIRenderTextureList() {
    return this.m_texList;
  }

  buildShader() {}

  getFragShaderCode() {
    //if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getFragShaderCode();
    return this.m_coder.buildFragCode();
  }

  getVertShaderCode() {
    //if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getVertShaderCode();
    return this.m_coder.buildVertCode();
  }

  getUniqueShaderName() {
    //if (ShaderCodeBuffer.__$s_csBuf != this) return ShaderCodeBuffer.__$s_csBuf.getUniqueShaderName();
    throw Error("Illgel operation !!!");
    return "";
  }

  toString() {
    return "[ShaderCodeBuffer()]";
  }

}

exports.default = ShaderCodeBuffer;

/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("50e8");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/* harmony default export */ __webpack_exports__["default"] = (_entry__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "fc07":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const RendererDevice_1 = __importDefault(__webpack_require__("3b73"));

const AttributeLine_1 = __importDefault(__webpack_require__("2e8a"));

const UniformLine_1 = __importDefault(__webpack_require__("78e9"));

class ShaderCodeParser {
  constructor() {
    this.m_texNSMap = new Map();
    this.attriNSList = null;
    this.attriSizeList = null;
    this.uniformNameListStr = "";
    this.texUniformNameListStr = "";
    this.attributes = [null, null, null, null, null, null, null, null, null, null, null, null];
    this.uniforms = null;
    this.texTotal = 0;
    this.fragOutputTotal = 0;
  }

  reset() {
    this.attriNSList = null;
    this.uniformNameListStr = "";
    this.texUniformNameListStr = "";
    let i = 0;

    for (; i < 12; ++i) {
      this.attributes[i] = null;
    }

    this.uniforms = null;
    this.m_texNSMap.clear();
    this.texTotal = 0;
  }

  parseVShaderCode(vshdsrc) {
    let semicolonReg = new RegExp(";", "g");
    vshdsrc = vshdsrc.replace(semicolonReg, ";\n");
    vshdsrc = vshdsrc.replace("{", "{\n");
    vshdsrc = vshdsrc.replace("}", "\n}"); //

    let ENTER = "\n";
    let i = vshdsrc.indexOf(ENTER);
    let j = 0; //

    let codeList = [];
    let str = "";
    let subStr = ""; //trace("-----------------parseVShaderCode begin----------------------");

    let regSpace = new RegExp(" ", "g");

    while (i >= 0) {
      str = vshdsrc.slice(j, i);

      if (str.length > 0) {
        subStr = str.replace(regSpace, "");

        if (subStr.indexOf("//") != 0) {
          codeList.push(str);
        }
      }

      j = i + 1;
      i = vshdsrc.indexOf(ENTER, j);
    }

    str = vshdsrc.slice(j, vshdsrc.length);

    if (str.length > 0) {
      subStr = str.replace(regSpace, "");

      if (subStr.indexOf("//") != 0) {
        codeList.push(str);
      }
    }

    let UNIFORM = "uniform ";
    let len = codeList.length;
    let attri = null;
    i = 0;

    for (; i < 12; ++i) {
      this.attributes[i] = null;
    }

    this.attriNSList = [];
    this.attriSizeList = []; //

    let uniform = null;
    if (this.uniforms == null) this.uniforms = []; //if(this.uniformNameList == null)this.uniformNameList = [];
    //

    i = 0;
    let flagLayout = false;
    let flagAttri = false;

    while (i < len) {
      str = codeList[i];
      flagLayout = str.indexOf("layout") >= 0;
      flagAttri = str.indexOf("attribute ") >= 0;

      if (flagLayout && str.indexOf("location") > 0 || flagAttri) {
        attri = new AttributeLine_1.default();
        attri.layoutEnabled = flagLayout;
        attri.parseCode(str); //this.attributes.push( attri );

        this.attributes[attri.attriType] = attri;
        this.attriNSList.push(attri.name);
        this.attriSizeList.push(attri.typeSize);
      } else if (str.indexOf(UNIFORM) >= 0) {
        uniform = new UniformLine_1.default();

        if (uniform.parseCode(str)) {
          this.uniforms.push(uniform); //this.uniformNameList.push( uniform.name );

          this.uniformNameListStr += uniform.name + ",";

          if (uniform.isTex && !this.m_texNSMap.has(uniform.name)) {
            console.log("use vtx texture !!!");
            this.m_texNSMap.set(uniform.name, 1);
            this.texUniformNameListStr += uniform.name + ",";
            this.texTotal++;
          }
        }
      }

      ++i;
    } //trace("-----------------parseVShaderCode end----------------------");

  }

  parseFShaderCode(fshdsrc) {
    let semicolonReg = new RegExp(";", "g");
    fshdsrc = fshdsrc.replace(semicolonReg, ";\n");
    fshdsrc = fshdsrc.replace("{", "{\n");
    fshdsrc = fshdsrc.replace("}", "\n}"); //

    let ENTER = "\n";
    let i = fshdsrc.indexOf(ENTER);
    let j = 0; //

    let codeList = [];
    let str = "";
    let subStr = ""; //console.log("-----------------parseFShaderCode begin----------------------");

    let regSpace = new RegExp(" ", "g");

    while (i >= 0) {
      str = fshdsrc.slice(j, i);

      if (str.length > 0) {
        subStr = str.replace(regSpace, "");

        if (subStr.indexOf("//") != 0) {
          codeList.push(str);
        }
      }

      j = i + 1;
      i = fshdsrc.indexOf(ENTER, j);
    }

    str = fshdsrc.slice(j, fshdsrc.length);

    if (str.length > 0) {
      subStr = subStr.replace(regSpace, "");

      if (subStr.indexOf("//") != 0) {
        codeList.push(str); //trace(str);
      }
    }

    let UNIFORM = "uniform ";
    let len = codeList.length;
    let uniform = null;
    if (this.uniforms == null) this.uniforms = [];
    i = 0;

    while (i < len) {
      str = codeList[i];

      if (str.indexOf(UNIFORM) >= 0 && this.uniformNameListStr.indexOf(UNIFORM) < 0) {
        uniform = new UniformLine_1.default();

        if (uniform.parseCode(str)) {
          this.uniforms.push(uniform);
          this.uniformNameListStr += uniform.name + ",";

          if (uniform.isTex && !this.m_texNSMap.has(uniform.name)) {
            this.m_texNSMap.set(uniform.name, 1);
            this.texUniformNameListStr += uniform.name + ",";
            this.texTotal++;
          } else {//this.uniformNameList.push( uniform.name );
          }
        }
      }

      ++i;
    }

    let outputKey = "layout";

    if (RendererDevice_1.default.IsWebGL1()) {
      outputKey = "gl_FragData";
    }

    i = fshdsrc.indexOf(outputKey);
    this.fragOutputTotal = 0;

    while (i > 0) {
      this.fragOutputTotal++;
      i = fshdsrc.indexOf(outputKey, i + 2);
    }

    if (this.fragOutputTotal < 1) {
      this.fragOutputTotal = 1;
    } //trace("-----------------parseFShaderCode end----------------------,texTotal: "+texTotal);

  }

}

exports.default = ShaderCodeParser;

/***/ }),

/***/ "fe7f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const TextureProxyType_1 = __webpack_require__("7918");

const TextureConst_1 = __webpack_require__("8d98");

const RawDataTextureProxy_1 = __importDefault(__webpack_require__("df25"));

class BytesTextureProxy extends RawDataTextureProxy_1.default {
  constructor(texWidth, texHeight, powerof2Boo = false) {
    super(texWidth, texHeight, powerof2Boo);
    this.m_type = TextureProxyType_1.TextureProxyType.Bytes;
  }

  toAlphaFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.ALPHA;
    this.internalFormat = TextureConst_1.TextureFormat.ALPHA;
    this.unpackAlignment = 1;
  }

  toRedFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RED;
    this.internalFormat = TextureConst_1.TextureFormat.RED;
    this.unpackAlignment = 1;
  }

  toRGBFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RGB;
    this.internalFormat = TextureConst_1.TextureFormat.RGB;
    this.unpackAlignment = 3;
  }

  toRGBAFormat() {
    this.srcFormat = TextureConst_1.TextureFormat.RGBA;
    this.internalFormat = TextureConst_1.TextureFormat.RGBA;
    this.unpackAlignment = 4;
  }

  setDataFromBytes(bytes, miplevel = 0, imgWidth = -1, imgHeight = -1, offsetx = 0, offsety = 0, rebuild = false) {
    super.setDataFromBytes(bytes, miplevel, imgWidth, imgHeight, offsetx, offsety, rebuild);
  }

  setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel = 0) {
    super.setPartDataFromeBytes(bytes, px, py, twidth, theight, miplevel);
  }

  getPixels(px, py, pw, ph, outBytes) {
    super.getPixels(px, py, pw, ph, outBytes);
  }

  toString() {
    return "[BytesTextureProxy(width=" + this.getWidth() + ",height=" + this.getHeight() + ")]";
  }

}

exports.default = BytesTextureProxy;

/***/ }),

/***/ "fecb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

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

const MathConst_1 = __importDefault(__webpack_require__("6e01"));

const Vector3D_1 = __importDefault(__webpack_require__("8e17"));

class AABB {
  constructor() {
    this.min = new Vector3D_1.default(MathConst_1.default.MATH_MAX_POSITIVE, MathConst_1.default.MATH_MAX_POSITIVE, MathConst_1.default.MATH_MAX_POSITIVE);
    this.max = new Vector3D_1.default(MathConst_1.default.MATH_MIN_NEGATIVE, MathConst_1.default.MATH_MIN_NEGATIVE, MathConst_1.default.MATH_MIN_NEGATIVE);
    this.version = -1;
    this.radius = 50;
    this.radius2 = 2500;
    this.center = new Vector3D_1.default(0.0, 0.0, 0.0);
    this.m_long = 100.0;
    this.m_width = 100.0;
    this.m_height = 100.0;
    this.m_halfLong = 50.0;
    this.m_halfWidth = 50.0;
    this.m_halfHeight = 50.0;
    this.m_tempV = new Vector3D_1.default();
  }

  getLong() {
    return this.m_long;
  }

  getWidth() {
    return this.m_width;
  }

  getHeight() {
    return this.m_height;
  }

  reset() {
    this.min.setXYZ(MathConst_1.default.MATH_MAX_POSITIVE, MathConst_1.default.MATH_MAX_POSITIVE, MathConst_1.default.MATH_MAX_POSITIVE);
    this.max.setXYZ(MathConst_1.default.MATH_MIN_NEGATIVE, MathConst_1.default.MATH_MIN_NEGATIVE, MathConst_1.default.MATH_MIN_NEGATIVE);
  }

  equals(ab) {
    return this.min.equalsXYZ(ab.min) && this.max.equalsXYZ(ab.max);
  }

  setVolume(width, height, long) {
    this.m_width = width;
    this.m_height = height;
    this.m_long = long; //

    this.m_halfLong = 0.5 * this.m_long;
    this.m_halfWidth = 0.5 * this.m_width;
    this.m_halfHeight = 0.5 * this.m_height; //

    this.max.x = this.center.x + this.m_halfWidth;
    this.max.y = this.center.y + this.m_halfHeight;
    this.max.z = this.center.z + this.m_halfLong; //

    this.min.x = this.center.x - this.m_halfWidth;
    this.min.y = this.center.y - this.m_halfHeight;
    this.min.z = this.center.z - this.m_halfLong;
    this.radius2 = this.m_halfWidth * this.m_halfWidth + this.m_halfHeight * this.m_halfHeight + this.m_halfLong * this.m_halfLong;
    this.radius = Math.sqrt(this.radius2);
  }

  union(ab) {
    this.addPosition(ab.min);
    this.addPosition(ab.max);
  }

  addPosition(pv) {
    if (this.min.x > pv.x) this.min.x = pv.x;
    if (this.min.y > pv.y) this.min.y = pv.y;
    if (this.min.z > pv.z) this.min.z = pv.z;
    if (this.max.x < pv.x) this.max.x = pv.x;
    if (this.max.y < pv.y) this.max.y = pv.y;
    if (this.max.z < pv.z) this.max.z = pv.z;
  }

  addXYZ(pvx, pvy, pvz) {
    if (this.min.x > pvx) this.min.x = pvx;
    if (this.min.y > pvy) this.min.y = pvy;
    if (this.min.z > pvz) this.min.z = pvz;
    if (this.max.x < pvx) this.max.x = pvx;
    if (this.max.y < pvy) this.max.y = pvy;
    if (this.max.z < pvz) this.max.z = pvz;
  }

  addXYZFloat32Arr(vs, step = 3) {
    let len = vs.length;
    let pvx = 0.0;
    let pvy = 0.0;
    let pvz = 0.0;

    for (let i = 0; i < len;) {
      pvx = vs[i];
      pvy = vs[i + 1];
      pvz = vs[i + 2];
      i += step;
      if (this.min.x > pvx) this.min.x = pvx;
      if (this.min.y > pvy) this.min.y = pvy;
      if (this.min.z > pvz) this.min.z = pvz;
      if (this.max.x < pvx) this.max.x = pvx;
      if (this.max.y < pvy) this.max.y = pvy;
      if (this.max.z < pvz) this.max.z = pvz;
    }
  }

  addXYZFloat32AndIndicesArr(vs, indices) {
    let len = indices.length;
    let pvx = 0.0;
    let pvy = 0.0;
    let pvz = 0.0;
    let i;

    for (let k = 0; k < len; k++) {
      i = k * 3;
      pvx = vs[i++];
      pvy = vs[i++];
      pvz = vs[i];
      if (this.min.x > pvx) this.min.x = pvx;
      if (this.min.y > pvy) this.min.y = pvy;
      if (this.min.z > pvz) this.min.z = pvz;
      if (this.max.x < pvx) this.max.x = pvx;
      if (this.max.y < pvy) this.max.y = pvy;
      if (this.max.z < pvz) this.max.z = pvz;
    }
  }

  getClosePosition(in_pos, out_pos, bias = 0.0) {
    out_pos.copyFrom(in_pos);

    if (out_pos.x < this.min.x) {
      out_pos.x = this.min.x + bias;
    } else if (out_pos.x > this.max.x) {
      out_pos.x = this.max.x - bias;
    }

    if (out_pos.y < this.min.y) {
      out_pos.y = this.min.y + bias;
    } else if (out_pos.y > this.max.y) {
      out_pos.y = this.max.y - bias;
    }

    if (out_pos.z < this.min.z) {
      out_pos.z = this.min.z + bias;
    } else if (out_pos.z > this.max.z) {
      out_pos.z = this.max.z - bias;
    }
  } // @param	v	Vector3D instance


  containsV(v) {
    if (v.x < this.max.x || v.x > this.max.x) return false;
    if (v.y < this.max.y || v.y > this.max.y) return false;
    if (v.z < this.max.z || v.z > this.max.z) return false;
    return true;
  } // 是否包含某一点(同一坐标空间的点)


  containsXY(vx, vy) {
    if (vx < this.min.x || vx > this.max.x) return false;
    if (vy < this.min.y || vy > this.max.y) return false;
    return true;
  } // 是否包含某一点(同一坐标空间的点)


  containsXZ(vx, vz) {
    if (vx < this.min.x || vx > this.max.x) return false;
    if (vz < this.min.z || vz > this.max.z) return false;
    return true;
  } // 是否包含某一点(同一坐标空间的点)


  containsYZ(vy, vz) {
    if (vy < this.min.y || vy > this.max.y) return false;
    if (vz < this.min.z || vz > this.max.z) return false;
    return true;
  }

  copyFrom(ab) {
    //this.setRadius(ab.getRadius());
    this.radius = ab.radius;
    this.radius2 = ab.radius2; //this.setRadiusSquared(ab.getRadiusSquared());

    this.min.copyFrom(ab.min);
    this.max.copyFrom(ab.max); //this.getOCenter().copyFrom(ab.getOCenter());

    this.center.copyFrom(ab.center);
    this.updateVolume();
  }

  expand(bias) {
    this.min.subtractBy(bias);
    this.max.addBy(bias);
  }

  updateVolume() {
    this.m_width = this.max.x - this.min.x;
    this.m_height = this.max.y - this.min.y;
    this.m_long = this.max.z - this.min.z;
    this.m_halfLong = 0.5 * this.m_long;
    this.m_halfWidth = 0.5 * this.m_width;
    this.m_halfHeight = 0.5 * this.m_height;
    ++this.version;
  }

  updateThis() {
    this.center.x = 0.5 * this.m_width;
    this.center.y = 0.5 * this.m_height;
    this.center.z = 0.5 * this.m_long;
    this.m_halfLong = this.center.z;
    this.m_halfWidth = this.center.x;
    this.m_halfHeight = this.center.y;
    this.radius2 = this.m_halfWidth * this.m_halfWidth + this.m_halfHeight * this.m_halfHeight + this.m_halfLong * this.m_halfLong;
    this.radius = Math.sqrt(this.radius2);
    this.center.addBy(this.min); // this.center.x += this.min.x;
    // this.center.y += this.min.y;
    // this.center.z += this.min.z;

    ++this.version;
  }

  update() {
    // x
    this.m_width = this.max.x;

    if (this.min.x > this.max.x) {
      this.max.x = this.min.x;
      this.min.x = this.m_width;
    }

    this.m_width = this.max.x - this.min.x; // y

    this.m_height = this.max.y;

    if (this.min.y > this.max.y) {
      this.max.y = this.min.y;
      this.min.y = this.m_height;
    }

    this.m_height = this.max.y - this.min.y; // z

    this.m_long = this.max.z;

    if (this.min.z > this.max.z) {
      this.max.z = this.min.z;
      this.min.z = this.m_long;
    }

    this.m_long = this.max.z - this.min.z;
    this.updateThis(); // this.center.x = 0.5 * this.m_width;
    // this.center.y = 0.5 * this.m_height;
    // this.center.z = 0.5 * this.m_long;
    // this.m_halfLong = this.center.z;
    // this.m_halfWidth = this.center.x;
    // this.m_halfHeight = this.center.y;
    // this.radius2 = this.m_halfWidth * this.m_halfWidth + this.m_halfHeight * this.m_halfHeight + this.m_halfLong * this.m_halfLong;
    // this.radius = Math.sqrt(this.radius2);
    // this.center.x += this.min.x;
    // this.center.y += this.min.y;
    // this.center.z += this.min.z;
    // ++this.version;
  }

  updateFast() {
    this.m_width = this.max.x - this.min.x;
    this.m_height = this.max.y - this.min.y;
    this.m_long = this.max.z - this.min.z;
    this.updateThis(); // this.center.x = 0.5 * this.m_width;
    // this.center.y = 0.5 * this.m_height;
    // this.center.z = 0.5 * this.m_long;
    // this.m_halfLong = this.center.z;
    // this.m_halfWidth = this.center.x;
    // this.m_halfHeight = this.center.y;
    // this.radius2 = this.m_halfWidth * this.m_halfWidth + this.m_halfHeight * this.m_halfHeight + this.m_halfLong * this.m_halfLong;
    // this.radius = Math.sqrt(this.radius2);
    // this.center.x += this.min.x;
    // this.center.y += this.min.y;
    // this.center.z += this.min.z;
    // ++this.version;
  }

  toString() {
    return "[AABB(min->" + this.min + ",size(" + this.m_width + "," + this.m_height + "," + this.m_long + "))]";
  } // max vecs sphere range intersect calc


  sphereIntersect(centerV, radius) {
    this.m_tempV.x = this.center.x - centerV.x;
    this.m_tempV.y = this.center.y - centerV.y;
    this.m_tempV.z = this.center.z - centerV.z;
    let dis = this.m_tempV.getLengthSquared();

    if (dis < this.radius2) {
      return true;
    }

    radius += this.radius;
    radius *= radius;
    return radius >= dis;
  }

}

exports.default = AABB;

/***/ })

/******/ });
});