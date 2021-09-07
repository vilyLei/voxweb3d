(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VoxApp"] = factory();
	else
		root["VoxApp"] = factory();
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

/***/ "0bb0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var pwindow = window;

if (pwindow["VoxCore"] == undefined) {
  pwindow["VoxCore"] = {};
}

var VoxCore = pwindow["VoxCore"];

const PlayerOne_1 = __webpack_require__("5341");

VoxCore["PlayerOne"] = PlayerOne_1.PlayerOne;

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

/***/ "5341":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CameraCtrl_1 = __webpack_require__("951a");

const Engine_1 = __webpack_require__("fbc4");

class SphRole {
  constructor() {
    this.m_pos = new Engine_1.Engine.Vector3D();
  }

  initialize(renderer) {
    let scale = Math.random() * 0.5 + 0.6;
    let sph = new Engine_1.Engine.Sphere3DEntity();
    this.m_pos.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 600.0 - 30.0, Math.random() * 1000.0 - 500.0);
    sph.setPosition(this.m_pos);
    sph.setScaleXYZ(scale, scale, scale);
    this.entity = sph;

    if (SphRole.s_tex != null) {
      sph.copyMesh(SphRole.s_sph);
      sph.initialize(100.0, 20, 20, [SphRole.s_tex]);
      sph.getMaterial().setRGB3f(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5);
      renderer.addEntity(sph, 0);
    } else {
      SphRole.s_sph = sph;
      let tex = new Engine_1.Engine.ImageTextureProxy(64, 64);
      let img = new Image();

      img.onload = evt => {
        console.log("PlayerOne::initialize() image loaded url: ", img.src);
        tex.setDataFromImage(img);
        sph.initialize(100.0, 20, 20, [tex]);
        sph.getMaterial().setRGB3f(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5);
        renderer.addEntity(sph, 0);
      };

      img.src = "static/assets/box_wood01.jpg";
    } //console.log("new Vector3D(): ", new Vector3D());

  }

}

SphRole.s_tex = null;
SphRole.s_sph = null;

class PlayerOne {
  constructor() {
    this.m_renderer = null;
    this.m_rcontext = null;
    this.m_camTrack = null;
    this.m_axisYAngle = 0;
    this.m_planeYAngle = 0;
  }

  initialize(pmodule) {
    if (pmodule != null && this.m_renderer == null) {
      console.log("PlayerOne::initialize()...");
      this.m_renderer = pmodule["mainModule"].getRenderer();
      this.m_rcontext = pmodule["mainModule"].getRendererContext(); //  Class c2 = Class.forName("ImageTextureProxy");

      Engine_1.Engine.Initialize(pmodule);
      this.initScene();
      this.m_camTrack = new CameraCtrl_1.CameraCtrl();
      this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
      console.log("rcontext.getCamera(): ", this.m_rcontext.getCamera());
      console.log("camTrack: ", this.m_camTrack);
    }
  }

  initScene() {
    let axis = new Engine_1.Engine.Axis3DEntity();
    axis.initialize(300.0);
    this.m_renderer.addEntity(axis, 0);
    this.m_axis = axis;
    let tex = new Engine_1.Engine.ImageTextureProxy(64, 64);
    let plane = new Engine_1.Engine.Plane3DEntity();
    this.m_plane = plane;
    let img = new Image();

    img.onload = evt => {
      console.log("PlayerOne::initialize() image loaded url: ", img.src);
      tex.setDataFromImage(img);
      plane.initializeXOZSquare(1300.0, [tex]);
      this.m_renderer.addEntity(plane, 0);
    };

    img.src = "static/assets/yanj.jpg";

    for (let i = 0; i < 15; ++i) {
      let sphObj = new SphRole();
      sphObj.initialize(this.m_renderer);
    }
  }

  run() {
    if (this.m_axis != null) {
      if (this.m_camTrack != null) {
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_rcontext.updateCamera();
      }

      this.m_axisYAngle += 1.0;
      this.m_planeYAngle += 0.5;
      this.m_axis.setRotationXYZ(0.0, this.m_axisYAngle, 0.0);
      this.m_axis.update();
      this.m_plane.setRotationXYZ(0.0, this.m_planeYAngle, 0.0);
      this.m_plane.update();
    }
  }

}

exports.PlayerOne = PlayerOne;

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

/***/ "951a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const Engine_1 = __webpack_require__("fbc4");

class CameraCtrl {
  constructor() {
    this.m_matrix = new Engine_1.Engine.Matrix4();
    this.m_position = new Engine_1.Engine.Vector3D();
    this.m_direction = new Engine_1.Engine.Vector3D();
    this.m_angle = 0.0;
    this.m_updateEnabled = false;
    this.m_camera = null;
  }

  destroy() {
    this.m_camera = null;
  }

  bindCamera(cam) {
    this.m_camera = cam;

    if (cam != null) {
      this.m_direction.copyFrom(this.m_camera.getPosition());
      this.m_direction.subtractBy(this.m_camera.getLookAtPosition());
    }
  }

  update() {
    if (this.m_camera != null && this.m_updateEnabled) {
      this.m_updateEnabled = false;
    }
  }

  rotationOffsetAngleWorldY(float_degrees) {
    this.m_angle = float_degrees;
    this.m_updateEnabled = true;
    this.m_direction.copyFrom(this.m_camera.getPosition());
    this.m_direction.subtractBy(this.m_camera.getLookAtPosition());
    this.m_matrix.identity();
    this.m_matrix.appendRotationY(this.m_angle * Engine_1.Engine.MathConst.MATH_PI_OVER_180);
    this.m_position.copyFrom(this.m_direction);
    this.m_matrix.transformVectorSelf(this.m_position);
    this.m_position.addBy(this.m_camera.getLookAtPosition());
    this.m_camera.setPosition(this.m_position);
  }

  rotationOffsetAngleWordX(float_degrees) {
    this.m_angle = float_degrees;
    this.m_updateEnabled = true;
    this.m_direction.copyFrom(this.m_camera.getPosition());
    this.m_direction.subtractBy(this.m_camera.getLookAtPosition());
    this.m_matrix.identity();
    this.m_matrix.appendRotationX(this.m_angle * Engine_1.Engine.MathConst.MATH_PI_OVER_180);
    this.m_position.copyFrom(this.m_direction);
    this.m_matrix.transformVectorSelf(this.m_position);
    this.m_position.addBy(this.m_camera.getLookAtPosition());
    this.m_camera.setPosition(this.m_position);
  }

  rotationOffsetAngleWordZ(float_degrees) {
    this.m_angle = float_degrees;
    this.m_updateEnabled = true;
    this.m_direction.copyFrom(this.m_camera.getPosition());
    this.m_direction.subtractBy(this.m_camera.getLookAtPosition());
    this.m_matrix.identity();
    this.m_matrix.appendRotationZ(this.m_angle * Engine_1.Engine.MathConst.MATH_PI_OVER_180);
    this.m_position.copyFrom(this.m_direction);
    this.m_matrix.transformVectorSelf(this.m_position);
    this.m_position.addBy(this.m_camera.getLookAtPosition());
    this.m_camera.setPosition(this.m_position);
  }

}

exports.CameraCtrl = CameraCtrl;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("0bb0");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ }),

/***/ "fbc4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 //import {Matrix4} from "./Matrix4";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Matrix4;
exports.Matrix4 = Matrix4;

class Engine {
  static Initialize(pmodule) {
    Engine.ImageTextureProxy = pmodule.ImageTextureProxy;
    Engine.Plane3DEntity = pmodule.Plane3DEntity;
    Engine.Axis3DEntity = pmodule.Axis3DEntity;
    Engine.Sphere3DEntity = pmodule.Sphere3DEntity;
    Engine.MathConst = pmodule.MathConst;
    Engine.Vector3D = pmodule.Vector3D;
    Engine.Matrix4 = pmodule.Matrix4;
    Engine.Camera = pmodule.CameraBase;
    exports.Matrix4 = Matrix4 = Engine.Matrix4;
  }

}

exports.Engine = Engine;

/***/ })

/******/ });
});