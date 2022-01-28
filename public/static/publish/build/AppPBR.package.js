(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AppPBR"] = factory();
	else
		root["AppPBR"] = factory();
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

/***/ "2fe4":
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

const ShaderUniformData_1 = __importDefault(__webpack_require__("b3bd"));

const ShaderCodeUUID_1 = __webpack_require__("f3a2");

class PBRDecorator {
  constructor() {
    this.m_uniqueName = "PBR";
    this.m_envMapWidth = 128;
    this.m_envMapHeight = 128;
    this.m_pbrParams = new Float32Array([0.0, 0.0, 1.0, 0.02, 1.0, 0.1, 1.0, 1.0, 0.1, 0.1, 0.1, 1.0, 1.0, 1.0, 1.0, 0.07 // envMap lod mipMapLv parameter((100.0 * fract(0.07)) - (100.0 * fract(0.07)) * k + floor(0.07))
    ]);
    this.m_fragLocalParams = null;
    this.m_parallaxParams = null;
    this.m_mirrorParam = new Float32Array([0.0, 0.0, -1.0 // mirror view nv(x,y,z)
    , 1.0 // mirror map lod level
    , 1.0, 0.3 // mirror scale, mirror mix scale
    , 0.0, 0.0 // undefine, undefine
    ]); ///////////////////////////////////////////////////////

    /**
     * the  default  value is false
     */

    this.vertColorEnabled = false;
    /**
     * the  default  value is false
     */

    this.premultiplyAlpha = false;
    /**
     * the  default  value is false
     */

    this.shadowReceiveEnabled = false;
    /**
     * the  default  value is false
     */

    this.lightEnabled = true;
    /**
     * the  default  value is false
     */

    this.fogEnabled = false;
    /**
     * the  default  value is false
     */

    this.envAmbientLightEnabled = false;
    /**
     * the  default  value is false
     */

    this.brightnessOverlayEnabeld = false;
    /**
     * the default value is true
     */

    this.glossinessEnabeld = true;
    this.specularEnvMap = null;
    this.diffuseMap = null;
    this.normalMap = null;
    this.mirrorMap = null;
    this.indirectEnvMap = null;
    this.parallaxMap = null;
    this.aoMap = null;
    this.roughnessMap = null;
    this.metalhnessMap = null;
    /**
     * add ao, roughness, metalness map uniform code
     */

    this.armMap = null; // glossinessEnabeld: boolean = true;

    this.woolEnabled = true;
    this.toneMappingEnabled = true;
    this.scatterEnabled = true;
    this.specularBleedEnabled = true;
    this.metallicCorrection = true;
    this.gammaCorrection = true;
    this.absorbEnabled = false;
    this.normalNoiseEnabled = false;
    this.pixelNormalNoiseEnabled = false;
    this.mirrorMapLodEnabled = false; //normalMapEnabled: boolean = false;

    this.hdrBrnEnabled = false;
    this.vtxFlatNormal = false;
    this.texturesTotal = 1;
    this.fragLocalParamsTotal = 2;
    this.parallaxParamIndex = 2;
    this.vertUniform = null;
  }

  initialize() {
    ///*
    this.fragLocalParamsTotal = 2;
    this.parallaxParamIndex = 2;

    if (this.parallaxMap != null) {
      this.fragLocalParamsTotal += 1;
    }

    this.m_fragLocalParams = new Float32Array(this.fragLocalParamsTotal * 4);
    this.m_fragLocalParams.set([0.0, 0.0, 0.0, 1.0, 0.2, 0.2, 0.2, 0.0 // albedo(r,g,b), undefined
    ], 0);

    if (this.parallaxMap != null) {
      this.m_parallaxParams = this.m_fragLocalParams.subarray(this.parallaxParamIndex * 4, (this.parallaxParamIndex + 1) * 4);
      this.m_parallaxParams.set([1.0, 10.0, 2.0, 0.1]);
    } //*/

  }

  seNormalMapIntensity(intensity) {
    intensity = Math.min(Math.max(intensity, 0.0), 1.0);
    this.m_fragLocalParams[4] = intensity;
  }

  setPixelNormalNoiseIntensity(intensity) {
    intensity = Math.min(Math.max(intensity, 0.0), 2.0);
    this.m_pbrParams[3] = intensity;
  }

  getPixelNormalNoiseIntensity() {
    return this.m_pbrParams[3];
  }

  setMirrorViewNV(nv) {
    this.m_mirrorParam[0] = nv.x;
    this.m_mirrorParam[1] = nv.y;
    this.m_mirrorParam[2] = nv.z;
  }

  setMirrorPlaneNV(nv) {//  //console.log("nv: ",nv);
    //  this.m_mirrorParam[0] = nv.x;
    //  this.m_mirrorParam[1] = nv.y;
    //  this.m_mirrorParam[2] = nv.z;
  }

  setMirrorMapLodLevel(lodLv) {
    this.m_mirrorParam[3] = lodLv;
  }

  setMirrorIntensity(intensity) {
    this.m_mirrorParam[4] = Math.min(Math.max(intensity, 0.01), 2.0);
  }

  setMirrorMixFactor(factor) {
    this.m_mirrorParam[5] = Math.min(Math.max(factor, 0.01), 2.0);
  }
  /**
   * (lod mipmap level) = base + (maxMipLevel - k * maxMipLevel)
   * @param maxMipLevel envmap texture lod max mipmap level, the vaue is a int number
   * @param base envmap texture lod max mipmap level base, value range: -7.0 -> 12.0
   */


  setEnvMapLodMipMapLevel(maxMipLevel, base = 0.0) {
    maxMipLevel = Math.min(Math.max(maxMipLevel, 0.0), 14.0);
    base = Math.min(Math.max(base, -7.0), 12.0);
    this.m_pbrParams[15] = Math.round(maxMipLevel) * 0.01 + base;
  }

  log2(f) {
    return Math.log(f) / Math.LN2;
  }

  getMaxMipMapLevel(width, height) {
    return Math.round(this.log2(Math.max(width, height)) + 1);
  }

  setEnvMapLodMipMapLevelWithSize(envMapWidth, envMapHeight, base = 0.0) {
    this.m_envMapWidth = envMapWidth;
    this.m_envMapHeight = envMapHeight;
    base = Math.min(Math.max(base, -7.0), 12.0);
    let ln2 = Math.log(Math.max(envMapWidth, envMapHeight)) / Math.LN2;
    this.m_pbrParams[15] = this.getMaxMipMapLevel(envMapWidth, envMapHeight) * 0.01 + base;
  }

  setScatterIntensity(value) {
    this.m_pbrParams[11] = Math.min(Math.max(value, 0.01), 512.0);
  }

  getScatterIntensity() {
    return this.m_pbrParams[11];
  }

  setToneMapingExposure(value) {
    this.m_pbrParams[4] = Math.min(Math.max(value, 0.1), 128.0);
  }

  getToneMapingExposure() {
    return this.m_pbrParams[4];
  }

  setReflectionIntensity(value) {
    this.m_pbrParams[5] = Math.min(Math.max(value, 0.001), 1.0);
  }

  getReflectionIntensity() {
    return this.m_pbrParams[5];
  }

  setSurfaceIntensity(surfaceIntensity) {
    this.m_pbrParams[6] = Math.min(Math.max(surfaceIntensity, 0.001), 32.0);
  }

  getSurfaceIntensity() {
    return this.m_pbrParams[6];
  }
  /**
   * @param sideIntensity value: 0.1 -> 32.0
   */


  setSideIntensity(sideIntensity) {
    this.m_pbrParams[7] = Math.min(Math.max(sideIntensity, 0.001), 32.0);
  }

  getSideIntensity() {
    return this.m_pbrParams[7];
  }

  setEnvSpecularColorFactor(fx, fy, fz) {
    this.m_pbrParams[12] = fx;
    this.m_pbrParams[13] = fy;
    this.m_pbrParams[14] = fz;
  }

  getEnvSpecularColorFactor(colorFactor) {
    colorFactor.r = this.m_pbrParams[12];
    colorFactor.g = this.m_pbrParams[13];
    colorFactor.b = this.m_pbrParams[14];
  } // ambient factor x,y,z


  setAmbientFactor(fr, fg, fb) {
    this.m_pbrParams[8] = fr;
    this.m_pbrParams[9] = fg;
    this.m_pbrParams[10] = fb;
  }

  getAmbientFactor(colorFactor) {
    colorFactor.r = this.m_pbrParams[8];
    colorFactor.g = this.m_pbrParams[9];
    colorFactor.b = this.m_pbrParams[10];
  }

  setMetallic(metallic) {
    this.m_pbrParams[0] = Math.min(Math.max(metallic, 0.05), 1.0);
  }

  getMetallic() {
    return this.m_pbrParams[0];
  }

  setRoughness(roughness) {
    this.m_pbrParams[1] = Math.min(Math.max(roughness, 0.05), 1.0);
  }

  getRoughness() {
    return this.m_pbrParams[1];
  }

  setAO(ao) {
    this.m_pbrParams[2] = ao;
  }

  getAO() {
    return this.m_pbrParams[2];
  }

  setF0(f0x, f0y, f0z) {
    this.m_fragLocalParams[0] = f0x;
    this.m_fragLocalParams[1] = f0y;
    this.m_fragLocalParams[2] = f0z;
  }

  getF0(colorFactor) {
    colorFactor.r = this.m_fragLocalParams[0];
    colorFactor.g = this.m_fragLocalParams[1];
    colorFactor.b = this.m_fragLocalParams[2];
  }

  setAlbedoColor(pr, pg, pb) {
    this.m_fragLocalParams[4] = pr;
    this.m_fragLocalParams[5] = pg;
    this.m_fragLocalParams[6] = pb;
  }

  getAlbedoColor(colorFactor) {
    colorFactor.r = this.m_fragLocalParams[4];
    colorFactor.g = this.m_fragLocalParams[5];
    colorFactor.b = this.m_fragLocalParams[6];
  }
  /**
   * 设置顶点置换贴图参数
   * @param numLayersMin ray march 最小层数, default value is 1.0
   * @param numLayersMax ray march 最大层数, default value is 10.0
   * @param height ray march 总高度, default value is 2.0
   * @param stepFactor ray march 单步增量大小, default value is 0.1
   */


  setParallaxParams(numLayersMin = 1.0, numLayersMax = 10.0, height = 2.0, stepFactor = 0.1) {
    if (this.m_parallaxParams != null) {
      this.m_parallaxParams[0] = numLayersMin;
      this.m_parallaxParams[1] = numLayersMax;
      this.m_parallaxParams[2] = height;
      this.m_parallaxParams[3] = stepFactor;
    }
  }

  buildBufParams() {}
  /**
   * user build textures list
   */


  buildTextureList(builder) {
    builder.addSpecularEnvMap(this.specularEnvMap, true);
    builder.addDiffuseMap(this.diffuseMap);
    builder.addNormalMap(this.normalMap);
    builder.addParallaxMap(this.parallaxMap, this.parallaxParamIndex);
    builder.addAOMap(this.aoMap);
    builder.addRoughnessMap(this.roughnessMap);
    builder.addMetalnessMap(this.metalhnessMap);
    builder.addARMMap(this.armMap);
    builder.add2DMap(this.mirrorMap, "VOX_MIRROR_PROJ_MAP", true, true, false);
    builder.addCubeMap(this.indirectEnvMap, "VOX_INDIRECT_ENV_MAP", true, false);
  }

  buildShader(coder) {
    coder.normalMapEnabled = this.normalMap != null;
    coder.mapLodEnabled = true;
    coder.useHighPrecious();
    let mirrorProjEnabled = this.mirrorMap != null && this.texturesTotal > 0;
    if (this.normalNoiseEnabled) coder.addDefine("VOX_NORMAL_NOISE", "1");
    if (this.woolEnabled) coder.addDefine("VOX_WOOL", "1");
    if (this.toneMappingEnabled) coder.addDefine("VOX_TONE_MAPPING", "1");
    if (this.scatterEnabled) coder.addDefine("VOX_SCATTER", "1");
    if (this.specularBleedEnabled) coder.addDefine("VOX_SPECULAR_BLEED", "1");
    if (this.metallicCorrection) coder.addDefine("VOX_METALLIC_CORRECTION", "1");
    if (this.gammaCorrection) coder.addDefine("VOX_GAMMA_CORRECTION", "1");
    if (this.absorbEnabled) coder.addDefine("VOX_ABSORB", "1");
    if (this.pixelNormalNoiseEnabled) coder.addDefine("VOX_PIXEL_NORMAL_NOISE", "1");
    if (this.mirrorMapLodEnabled) coder.addDefine("VOX_MIRROR_MAP_LOD", "1");
    if (this.hdrBrnEnabled) coder.addDefine("VOX_HDR_BRN", "1");
    if (this.vtxFlatNormal) coder.addDefine("VOX_VTX_FLAT_NORMAL", "1");
    coder.addFragUniform("vec4", "u_fragLocalParams", this.fragLocalParamsTotal);
    coder.addFragUniform("vec4", "u_pbrParams", 4);

    if (mirrorProjEnabled) {
      coder.uniform.useStage(false, true);
      coder.addFragUniform("vec4", "u_mirrorParams", 2);
    }

    coder.vertMatrixInverseEnabled = true;
  }
  /**
   * @returns local uniform data
   */


  createUniformData() {
    let sud = new ShaderUniformData_1.default();
    sud.uniformNameList = ["u_pbrParams", "u_fragLocalParams", "u_mirrorParams"];
    sud.dataList = [this.m_pbrParams, this.m_fragLocalParams, this.m_mirrorParam];
    return sud;
  }
  /**
   * get shader code object uuid, it is defined in the system
   * @returns shader code object uuid
   */


  getShaderCodeObjectUUID() {
    return ShaderCodeUUID_1.ShaderCodeUUID.PBR;
  }
  /**
   * get custom shader code object
   * @returns shader code object
   */


  getShaderCodeObject() {
    return null; // return PBRShaderCode;
  }
  /**
   * @returns unique name string
   */


  getUniqueName() {
    let ns = this.m_uniqueName;
    if (this.woolEnabled) ns += "_wl";
    if (this.toneMappingEnabled) ns += "TM";
    if (this.scatterEnabled) ns += "Sct";
    if (this.specularBleedEnabled) ns += "SpecBl";
    if (this.metallicCorrection) ns += "MetCorr";
    if (this.gammaCorrection) ns += "GmaCorr";
    if (this.absorbEnabled) ns += "Absorb";
    if (this.pixelNormalNoiseEnabled) ns += "PNNoise";
    if (this.normalNoiseEnabled) ns += "NNoise";
    if (this.indirectEnvMap != null) ns += "IndirEnv";
    if (this.shadowReceiveEnabled) ns += "Shadow";
    if (this.fogEnabled) ns += "Fog";
    if (this.hdrBrnEnabled) ns += "HdrBrn";
    if (this.vtxFlatNormal) ns += "vtxFlagN";
    if (this.mirrorMapLodEnabled) ns += "MirLod";
    this.m_uniqueName = ns;
    return this.m_uniqueName;
  }

  destroy() {
    this.m_pbrParams = null;
    this.m_fragLocalParams = null;
    this.m_mirrorParam = null;
  }

}

exports.PBRDecorator = PBRDecorator;

/***/ }),

/***/ "3221":
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

class UniformComp {
  constructor() {
    this.m_params = null;
    this.m_uniqueNSKeyString = "";
  }

  initialize() {}

  use(shaderBuilder) {}

  getTextures(shaderBuilder, outList = null) {
    return null;
  }

  reset() {}

  destroy() {}

  getUniqueNSKeyString() {
    return this.m_uniqueNSKeyString;
  }

  clone() {
    return null;
  }

  getParams() {
    return this.m_params;
  }

  getParamsTotal() {
    return this.m_params != null ? this.m_params.length >> 2 : 0;
  }

  buildShaderUniformData(data) {}

}

exports.UniformComp = UniformComp;

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

/***/ "8d98":
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
exports.default = TextureConst;

/***/ }),

/***/ "8e69":
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

const VertUniformComp_1 = __webpack_require__("debe");

const PBRDecorator_1 = __webpack_require__("2fe4");

const TextureConst_1 = __importDefault(__webpack_require__("8d98"));

class SpecularTextureBuilder {
  constructor() {
    this.hdrBrnEnabled = false; // texture: IFloatCubeTexture | IBytesCubeTexture = null;

    this.width = 128;
    this.height = 128;
  }

  createTexture(hdrBrnEnabled, rscene) {
    // if(this.texture == null) {
    let block = rscene.textureBlock;
    if (hdrBrnEnabled) return block.createBytesCubeTex(32, 32);else return block.createFloatCubeTex(32, 32); // }
  }

  createFloat(rscene, buffer, texture) {
    // this.createTexture(false, rscene);
    let begin = 0;
    let width = this.width;
    let height = this.height;
    let component = 3;
    let fs32 = new Float32Array(buffer);
    let subArr = null;
    let tex = texture;
    tex.toRGBFormat(); //tex.toRGBFormatFloat32F();

    tex.minFilter = TextureConst_1.default.LINEAR_MIPMAP_LINEAR;
    tex.magFilter = TextureConst_1.default.LINEAR;

    for (let j = 0; j < 9; j++) {
      for (let i = 0; i < 6; i++) {
        const size = width * height * component;
        subArr = fs32.subarray(begin, begin + size);
        tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
        begin += size;
      }

      width >>= 1;
      height >>= 1;
    }

    return texture;
  }

  createHdrBrn(rscene, buffer, texture) {
    // this.createTexture(true, rscene);
    let data16 = new Uint16Array(buffer);
    let currBytes = new Uint8Array(buffer);
    let begin = 0;
    let width = data16[4];
    let height = data16[5];
    let mipMapMaxLv = data16[6];
    console.log("parseHdrBrn, width: ", width, "height: ", height, "mipMapMaxLv: ", mipMapMaxLv);
    let size = 0;
    let bytes = currBytes.subarray(32);
    let tex = texture;
    tex.mipmapEnabled = mipMapMaxLv <= 1;
    tex.minFilter = TextureConst_1.default.LINEAR_MIPMAP_LINEAR;
    tex.magFilter = TextureConst_1.default.LINEAR;

    for (let j = 0; j < mipMapMaxLv; j++) {
      for (let i = 0; i < 6; i++) {
        size = width * height * 4;
        tex.setDataFromBytesToFaceAt(i, bytes.subarray(begin, begin + size), width, height, j);
        begin += size;
      }

      width >>= 1;
      height >>= 1;
    }

    return texture;
  }

}

exports.SpecularTextureBuilder = SpecularTextureBuilder;

class Instance {
  constructor() {
    this.m_rscene = null;
  }

  initialize(rsecne) {
    if (this.m_specularBuilder == null) {
      this.m_rscene = rsecne;
      this.m_specularBuilder = new SpecularTextureBuilder();
      console.log("AppPBR::Instance::ini()...");
    }
  }

  createMaterial(vertUniformEnabled = true) {
    let vertUniform = vertUniformEnabled ? new VertUniformComp_1.VertUniformComp() : null;
    let decor = new PBRDecorator_1.PBRDecorator();
    decor.vertUniform = vertUniform;
    return this.m_rscene.materialBlock.createMaterial(decor);
  }

  createSpecularTex(buffer, hdrBrnEnabled = true, texture = null) {
    if (texture == null) {
      texture = this.m_specularBuilder.createTexture(hdrBrnEnabled, this.m_rscene);
    }

    if (buffer != null) {
      if (hdrBrnEnabled) {
        return this.m_specularBuilder.createHdrBrn(this.m_rscene, buffer, texture);
      }

      return this.m_specularBuilder.createFloat(this.m_rscene, buffer, texture);
    }

    return texture;
  }

}

exports.Instance = Instance;

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

/***/ "debe":
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

const UniformComp_1 = __webpack_require__("3221");
/**
 * manage uniform data for the vertex calculation
 */


class VertUniformComp extends UniformComp_1.UniformComp {
  constructor() {
    super();
    this.m_uvTransParam = null;
    this.m_curveMoveParam = null;
    this.m_displacementParam = null;
    this.m_uvTransformParamIndex = -1;
    this.m_curveMoveParamIndex = -1;
    this.m_displacementParamIndex = -1;
    this.uvTransformEnabled = false;
    this.curveMoveMap = null;
    this.displacementMap = null;
  }

  initialize() {
    if (this.m_params == null) {
      this.m_uniqueNSKeyString = "";
      let paramsTotal = 0;

      if (this.uvTransformEnabled) {
        this.m_uvTransformParamIndex = paramsTotal;
        paramsTotal++;
        this.m_uniqueNSKeyString += "UV";
      }

      if (this.curveMoveMap != null) {
        this.m_curveMoveParamIndex = paramsTotal;
        paramsTotal++;
        this.m_uniqueNSKeyString += "CM";
      }

      if (this.displacementMap != null) {
        this.m_displacementParamIndex = paramsTotal;
        paramsTotal++;
        this.m_uniqueNSKeyString += "DC";
      }

      if (paramsTotal > 0) {
        this.m_params = new Float32Array(paramsTotal * 4);
        let i = this.m_uvTransformParamIndex;

        if (i >= 0) {
          this.m_uvTransParam = this.m_params.subarray(i * 4, (i + 1) * 4); // u scale, v scale, translation u, translation v

          this.m_uvTransParam.set([1.0, 1.0, 0.0, 0.0]);
        }

        i = this.m_curveMoveParamIndex;

        if (i >= 0) {
          this.m_curveMoveParam = this.m_params.subarray(i * 4, (i + 1) * 4);
        }

        i = this.m_displacementParamIndex;

        if (i >= 0) {
          this.m_displacementParam = this.m_params.subarray(i * 4, (i + 1) * 4); // displacement scale, bias, undefined, undefined

          this.m_displacementParam.set([10.0, 0.0, 0.0, 0.0]);
        }
      }
    }
  }

  use(shaderBuilder) {
    if (this.getParamsTotal() > 0) {
      shaderBuilder.addVertUniform("vec4", "u_vertLocalParams", this.getParamsTotal());

      if (this.m_curveMoveParamIndex >= 0) {
        shaderBuilder.addVertLayout("vec4", "a_vs");
      }

      if (this.m_uvTransformParamIndex >= 0) {
        shaderBuilder.addDefine("VOX_VTX_TRANSFORM_PARAM_INDEX", "" + this.m_uvTransformParamIndex);
      }
    }
  }

  reset() {}

  destroy() {}

  getTextures(shaderBuilder, outList = null) {
    if (this.getParamsTotal() > 0) {
      if (outList == null) outList = [];

      if (this.m_curveMoveParamIndex >= 0) {
        outList.push(this.curveMoveMap);
        shaderBuilder.uniform.add2DMap("VTX_CURVE_MOVE_MAP", false, false, true);
        shaderBuilder.addDefine("VOX_VTX_CURVE_MOVE_PARAM_INDEX", "" + this.m_curveMoveParamIndex);
      }

      if (this.m_displacementParamIndex >= 0) {
        outList.push(this.displacementMap);
        shaderBuilder.uniform.addDisplacementMap(this.m_displacementParamIndex);
      }

      return outList;
    }

    return null;
  }

  setCurveMoveParam(texSize, posTotal) {
    if (this.m_curveMoveParam != null) {
      this.m_curveMoveParam[0] = 1.0 / texSize;
      this.m_curveMoveParam[2] = posTotal;
    }
  }

  setCurveMoveDistance(index) {
    if (this.m_curveMoveParam != null) {
      this.m_curveMoveParam[1] = index;
    }
  }

  setUVScale(uScale, vScale) {
    if (this.m_uvTransParam != null) {
      this.m_uvTransParam[0] = uScale;
      this.m_uvTransParam[1] = vScale;
    }
  }

  getUVScale(scaleV) {
    if (this.m_uvTransParam != null) {
      scaleV.x = this.m_uvTransParam[0];
      scaleV.y = this.m_uvTransParam[1];
    }
  }

  setUVTranslation(tu, tv) {
    if (this.m_uvTransParam != null) {
      this.m_uvTransParam[2] = tu;
      this.m_uvTransParam[3] = tv;
    }
  }
  /**
   * 设置顶点置换贴图参数
   * @param scale 缩放值
   * @param bias 偏移量
   */


  setDisplacementParams(scale, bias) {
    if (this.m_displacementParam != null) {
      this.m_displacementParam[0] = scale;
      this.m_displacementParam[1] = bias;
    }
  }

  clone() {
    let u = new VertUniformComp();
    u.uvTransformEnabled = this.uvTransformEnabled;
    u.displacementMap = this.displacementMap;
    u.curveMoveMap = this.curveMoveMap;
    return u;
  }

  buildShaderUniformData(data) {
    if (this.getParamsTotal() > 0) {
      data.uniformNameList.push("u_vertLocalParams");
      data.dataList.push(this.getParams());
    }
  }

}

exports.VertUniformComp = VertUniformComp;

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

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("8e69");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });
});