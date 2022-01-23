(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VoxAppEnvLightModule"] = factory();
	else
		root["VoxAppEnvLightModule"] = factory();
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

/***/ "05f8":
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

class MaterialPipeBase {
  constructor(shdCtx) {
    this.m_uid = -1;
    this.m_uniformParam = null;
    this.m_dirty = false;
    this.m_shdCtx = null;
    this.m_shdCtx = shdCtx;
    this.m_uid = MaterialPipeBase.s_uid++;
  }

  getUid() {
    return this.m_uid;
  }

  update() {
    if (this.m_uniformParam != null && this.m_dirty) {
      this.m_dirty = false;
      this.m_uniformParam.uProbe.update();
    }
  }

  getGlobalUinform() {
    return this.m_uniformParam != null ? this.m_uniformParam.cloneUniform() : null;
  }

  destroy() {
    if (this.m_uniformParam != null) this.m_uniformParam.destroy();
    this.m_uniformParam = null;
    this.m_shdCtx = null;
  }

}

MaterialPipeBase.s_uid = 0;
exports.MaterialPipeBase = MaterialPipeBase;

/***/ }),

/***/ "084e":
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

class GlobalUniformParamBase {
  constructor(shdCtx, autoBuild = true) {
    this.m_shdCtx = null;
    this.uProbe = null;
    this.uniform = null;
    this.m_shdCtx = shdCtx;

    if (autoBuild) {
      this.uProbe = shdCtx.createShaderUniformProbe();
      this.uniform = shdCtx.createShaderGlobalUniform();
    }
  }

  getNames() {
    return [];
  }

  cloneUniform() {
    return this.m_shdCtx.cloneShaderGlobalUniform(this.uniform);
  }

  buildData() {
    this.m_shdCtx.updateGlobalUinformDataFromProbe(this.uniform, this.uProbe, this.getNames());
    this.uProbe.update();
  }

  destroy() {
    this.uProbe = null;
    this.uniform = null;
    this.m_shdCtx = null;
  }

}

exports.GlobalUniformParamBase = GlobalUniformParamBase;

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

/***/ "2d85":
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

const GlobalUniformParamBase_1 = __webpack_require__("084e");

class GlobalEnvLightUniformParam extends GlobalUniformParamBase_1.GlobalUniformParamBase {
  getNames() {
    return [UniformConst_1.default.EnvLightParams.name];
  }

  buildUniformData() {
    let data = UniformConst_1.default.EnvLightParams.data.slice();
    this.uProbe.addVec4Data(data, UniformConst_1.default.EnvLightParams.arrayLength);
    this.buildData();
    return data;
  }

  use(shaderBuilder, total = 1) {
    shaderBuilder.addFragUniformParam(UniformConst_1.default.EnvLightParams);
  }

}

exports.GlobalEnvLightUniformParam = GlobalEnvLightUniformParam;

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

const EnvLightModule_1 = __importDefault(__webpack_require__("e78b"));

exports.EnvLightModule = EnvLightModule_1.default; //
// /*

class Instance {
  constructor() {}

  createEnvLightModule(rsecne) {
    let ctx = rsecne.getRenderProxy().uniformContext;
    return new EnvLightModule_1.default(ctx);
  }

}

exports.Instance = Instance; //*/

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

/*
class Instance implements IVoxAppEngine {

    private m_rscene: IRendererScene = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_timeoutId: any = -1;
    private m_timeDelay: number = 50;
    private m_texLoader: ImageTextureLoader = null;
    
    readonly interaction: UserInteraction = new UserInteraction();
    constructor() { }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        if(this.m_texLoader != null) {
            return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
        }
        return null;
    }
    addEntity(entity: IRenderEntity, processIndex: number = 0): void {
        if (this.m_rscene != null) {
            this.m_rscene.addEntity(entity, processIndex, true);
        }
    }
    getRendererScene(): IRendererScene {
        return this.m_rscene;
    }
    
    createRendererScene(): IRendererScene {
        return new RendererScene();
    }
    initialize(debug: boolean = false, rparam: RendererParam = null, timeerDelay: number = 50, renderStatus: boolean = true): void {
        console.log("VoxAppInstance::initialize()......");
        if (this.m_rscene == null) {

            this.m_timeDelay = timeerDelay;
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = debug;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            console.log("XXX RendererDevice.SHADERCODE_TRACE_ENABLED: ",RendererDevice.SHADERCODE_TRACE_ENABLED);
            if(rparam == null) rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setPolygonOffsetEanbled(false);
            rparam.setAttriAlpha(false);
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamProject(45.0, 30.0, 9000.0);
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);

            let rscene = new RendererScene();
            rscene.initialize(rparam, 7, );
            this.m_rscene = rscene;
            this.interaction.initialize(this.m_rscene);

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
        if(this.m_statusDisp != null) this.m_statusDisp.render();
    }
    run(): void {
        if(this.m_statusDisp != null) this.m_statusDisp.update(false);
        if(this.m_rscene != null) {
            this.interaction.run();
            this.m_rscene.run(true);
        }
    }
}
// var pwin: any = window;
// pwin["Instance"] = Instance;
// export default VoxAppInstance;
// export {RendererDevice, VoxAppInstance, Vector3D, Axis3DEntity, Box3DEntity, Sphere3DEntity, RendererParam, RendererScene}
export {RendererDevice, Instance, Vector3D, Matrix4, RendererParam, RendererScene}
//*/

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

/***/ "a9bf":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "EnvShaderCode", function() { return /* binding */ EnvShaderCode; });

// CONCATENATED MODULE: ./src/light/material/env_fragHead.glsl
/* harmony default export */ var env_fragHead = ("#ifdef VOX_USE_FOG\r\n    #ifdef VOX_FOG_COLOR_MAP\r\n        vec3 fogEnvColor = vec3(1.0);\r\n        vec4 getFogColorFromTexture2D(sampler2D tex) {\r\n            vec4 color = VOX_Texture2D(tex, (u_envLightParams[3].xy + worldPosition.xz) / u_envLightParams[3].zw);\r\n            fogEnvColor = color.xyz;\r\n            return color;\r\n        }\r\n    #endif\r\n    void useFog(inout vec4 color) {\r\n        vec3 fogColor = u_envLightParams[2].xyz;\r\n        #ifdef VOX_FOG_COLOR_MAP\r\n            fogColor *= fogEnvColor;\r\n        #endif\r\n        #ifdef VOX_FOG_EXP2\r\n            float fogDensity = u_envLightParams[2].w;\r\n            float fogFactor = 1.0 - exp( - fogDensity * fogDensity * v_fogDepth * v_fogDepth );\r\n        #else\r\n            float fogNear = u_envLightParams[1].z;\r\n            float fogFar = u_envLightParams[1].w;\r\n            float fogFactor = smoothstep( fogNear, fogFar, v_fogDepth );\r\n        #endif\r\n        #ifdef VOX_USE_BRIGHTNESS_OVERLAY_COLOR\r\n            color.xyz = mix( color.rgb, fogColor, fogFactor ) * length(color.rgb) * (1.0 - fogFactor);\r\n        #else\r\n            color.xyz = mix( color.rgb, fogColor, fogFactor );\r\n            #ifdef VOX_PREMULTIPLY_ALPHA\r\n                color.xyz *= color.w;\r\n            #endif\r\n        #endif\r\n    }\r\n#endif");
// CONCATENATED MODULE: ./src/light/material/env_vertHead.glsl
/* harmony default export */ var env_vertHead = ("void calcFogDepth(in vec4 viewPos) {\r\n    v_fogDepth = -viewPosition.z;\r\n}");
// CONCATENATED MODULE: ./src/light/material/env_fragBody.glsl
/* harmony default export */ var env_fragBody = ("#ifdef VOX_FOG_COLOR_MAP\r\n    getFogColorFromTexture2D( VOX_FOG_COLOR_MAP );\r\n#endif\r\n\r\n#ifdef VOX_USE_FOG\r\n    useFog( FragColor0 );\r\n#endif ");
// CONCATENATED MODULE: ./src/light/material/env_vertBody.glsl
/* harmony default export */ var env_vertBody = ("#ifdef VOX_USE_FOG\r\n\r\ncalcFogDepth(viewPosition);\r\n\r\n#endif");
// CONCATENATED MODULE: ./src/light/material/EnvShaderCode.js
/***************************************************************************/

/*                                                                         */

/*  Copyright 2018-2022 by                                                 */

/*  Vily(vily313@126.com)                                                  */

/*                                                                         */

/***************************************************************************/




const EnvShaderCode = {
  vert: "",
  vert_head: env_vertHead,
  vert_body: env_vertBody,
  frag: "",
  frag_head: env_fragHead,
  frag_body: env_fragBody
};


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

/***/ "e78b":
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

const MaterialPipeType_1 = __webpack_require__("5216");

const MaterialPipeBase_1 = __webpack_require__("05f8");

const EnvShaderCode_1 = __webpack_require__("a9bf");

const GlobalEnvLightUniformParam_1 = __webpack_require__("2d85");

class EnvLightModule extends MaterialPipeBase_1.MaterialPipeBase {
  constructor() {
    super(...arguments);
    this.m_shaderCodeEnabled = true;
    this.m_uniformCodeEnabled = true;
    this.m_ambientMap = null;
    this.m_data = null;
  }

  setEnvAmbientMap(tex) {
    if (this.m_ambientMap != tex) {
      if (this.m_ambientMap != null) {
        this.m_ambientMap.__$detachThis();
      }

      this.m_ambientMap = tex;

      if (this.m_ambientMap != null) {
        this.m_ambientMap.__$attachThis();
      }
    }
  }

  setAmbientColorRGB3f(pr, pg, pb) {
    let data = this.m_data;
    data[0] = pr;
    data[1] = pg;
    data[2] = pb;
    this.m_dirty = true;
  }

  setFogColorRGB3f(pr, pg, pb) {
    let data = this.m_data;
    data[8] = pr;
    data[9] = pg;
    data[10] = pb;
    this.m_dirty = true;
  }

  setFogDensity(density) {
    this.m_data[11] = density;
    this.m_dirty = true;
  }

  setFogNear(near) {
    this.m_data[6] = near;
    this.m_dirty = true;
  }

  setFogFar(far) {
    this.m_data[7] = far;
    this.m_dirty = true;
  }

  setFogAreaOffset(px, pz) {
    this.m_data[12] = px;
    this.m_data[13] = pz;
    this.m_dirty = true;
  }

  setFogAreaSize(width, height) {
    this.m_data[14] = width;
    this.m_data[15] = height;
    this.m_dirty = true;
  }

  setEnvAmbientLightAreaOffset(px, pz) {
    this.m_data[16] = px;
    this.m_data[17] = pz;
    this.m_dirty = true;
  }

  setEnvAmbientLightAreaSize(width, height) {
    this.m_data[18] = width;
    this.m_data[19] = height;
    this.m_dirty = true;
  }

  resetPipe() {
    this.m_shaderCodeEnabled = true;
    this.m_uniformCodeEnabled = true;
  }

  getTextures(shaderBuilder, outList, pipeType) {
    if (this.m_ambientMap != null && pipeType == MaterialPipeType_1.MaterialPipeType.ENV_AMBIENT_LIGHT) {
      if (outList == null) outList = [];
      outList.push(this.m_ambientMap);
      shaderBuilder.uniform.add2DMap("VOX_ENV_AMBIENT_LIGHT_LIGHT_MAP", true, true, false);
      return outList;
    }

    return null;
  }

  useShaderPipe(shaderBuilder, pipeType) {
    if (this.m_uniformParam != null) {
      switch (pipeType) {
        case MaterialPipeType_1.MaterialPipeType.ENV_LIGHT_PARAM:
          this.buildUniformCode(shaderBuilder);
          break;

        case MaterialPipeType_1.MaterialPipeType.FOG:
        case MaterialPipeType_1.MaterialPipeType.FOG_EXP2:
          this.buildUniformCode(shaderBuilder);
          this.useFogData(shaderBuilder, pipeType == MaterialPipeType_1.MaterialPipeType.FOG_EXP2, true);
          break;

        case MaterialPipeType_1.MaterialPipeType.ENV_AMBIENT_LIGHT:
          this.buildUniformCode(shaderBuilder); //this.useShaderCode(shaderBuilder, true);

          break;

        default:
          break;
      }
    }
  }

  getPipeTypes() {
    return [MaterialPipeType_1.MaterialPipeType.ENV_LIGHT_PARAM, MaterialPipeType_1.MaterialPipeType.FOG, MaterialPipeType_1.MaterialPipeType.FOG_EXP2, MaterialPipeType_1.MaterialPipeType.ENV_AMBIENT_LIGHT];
  }

  getPipeKey(pipeType) {
    switch (pipeType) {
      case MaterialPipeType_1.MaterialPipeType.ENV_LIGHT_PARAM:
      case MaterialPipeType_1.MaterialPipeType.FOG:
      case MaterialPipeType_1.MaterialPipeType.FOG_EXP2:
      case MaterialPipeType_1.MaterialPipeType.ENV_AMBIENT_LIGHT:
        return "[" + pipeType + "]";
        break;

      default:
        break;
    }

    return "";
  }

  useUniforms(shaderBuilder) {
    if (this.m_uniformParam != null) {
      shaderBuilder.addFragUniformParam(UniformConst_1.default.EnvLightParams);
    }
  }

  buildUniformCode(shaderBuilder) {
    if (this.m_uniformCodeEnabled) {
      this.m_uniformCodeEnabled = false;
      this.m_uniformParam.use(shaderBuilder);
    }
  }

  useFogData(shaderBuilder, fogExp2Enabled, autoAppendShd) {
    shaderBuilder.addDefine("VOX_USE_FOG", "1");

    if (fogExp2Enabled) {
      shaderBuilder.addDefine("VOX_FOG_EXP2", "1");
    }

    shaderBuilder.addVarying("float", "v_fogDepth");
    this.useShaderCode(shaderBuilder, autoAppendShd);
  }

  useShaderCode(shaderBuilder, autoAppendShd) {
    if (this.m_shaderCodeEnabled) {
      this.m_shaderCodeEnabled = false;

      if (autoAppendShd) {
        shaderBuilder.addShaderObject(EnvShaderCode_1.EnvShaderCode);
      } else {
        shaderBuilder.addShaderObjectHead(EnvShaderCode_1.EnvShaderCode);
      }
    }
  }

  initialize() {
    if (this.m_uniformParam == null) {
      let uniformParam = new GlobalEnvLightUniformParam_1.GlobalEnvLightUniformParam(this.m_shdCtx);
      this.m_data = uniformParam.buildUniformData();
      this.m_uniformParam = uniformParam;
    }
  }

  destroy() {
    this.setEnvAmbientMap(null);
    this.m_data = null;
    super.destroy();
  }

}

exports.default = EnvLightModule;

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



/***/ })

/******/ });
});