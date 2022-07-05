(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ModuleDracoGeomParser"] = factory();
	else
		root["ModuleDracoGeomParser"] = factory();
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

/***/ "2e55":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class DracoTaskCMD {}
/**
 * 处理数据
 */


DracoTaskCMD.PARSE = "DRACO_PARSE";
/**
 * 从其他线程获取数据
 */

DracoTaskCMD.THREAD_ACQUIRE_DATA = "DRACO_THREAD_ACQUIRE_DATA";
/**
 * 向其他线程发送数据
 */

DracoTaskCMD.THREAD_TRANSMIT_DATA = "DRACO_THREAD_TRANSMIT_DATA";
exports.DracoTaskCMD = DracoTaskCMD;

/***/ }),

/***/ "56b4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const DracoTaskCMD_1 = __webpack_require__("2e55");

let CMD = DracoTaskCMD_1.DracoTaskCMD;
const TriStripDrawMode = 1;
const TriFanDrawMode = 21;

class DracoGeomParser {
  constructor() {
    this.parser = null;
    this.attMap = null;
    this.attOpts = null;
    this.verbosity = 1;
    this.drawMode = 0;
    this.vsScale = 1.0;
    this.attNSMap = {
      position: "POSITION",
      normal: "NORMAL",
      color: "COLOR",
      uv: "TEX_COORD",
      generic: "GENERIC"
    };
  }

  getAttributeOptions(ns) {
    if (typeof this.attOpts[ns] === "undefined") this.attOpts[ns] = {};
    return this.attOpts[ns];
  }

  addAttributeToGeometry(dracoDecoder, decoder, dracoGeometry, ns, attribute, geometryBuffer) {
    if (attribute.ptr === 0) {
      let errorMsg = "DracoGeomParser: No attribute " + ns;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    let numComponents = attribute.num_components();
    let attributeData = new dracoDecoder.DracoFloat32Array();
    decoder.GetAttributeFloatForAllPoints(dracoGeometry, attribute, attributeData);
    let numPoints = dracoGeometry.num_points();
    let numValues = numPoints * numComponents;
    let fs32 = new Float32Array(numValues + 1);
    fs32[0] = numComponents;

    for (let i = 0; i < numValues; i++) {
      fs32[i + 1] = attributeData.GetValue(i);
    }

    geometryBuffer[ns] = fs32;
    dracoDecoder.destroy(attributeData);
  }

  decodeGeomData(dracoDecoder, decoder, geometryType, buffer) {
    if (this.getAttributeOptions("position").skipDequantization === true) {
      decoder.SkipAttributeTransform(dracoDecoder.POSITION);
    }

    let dracoGeometry;
    let decodingStatus;

    if (geometryType === dracoDecoder.TRIANGULAR_MESH) {
      dracoGeometry = new dracoDecoder.Mesh();
      decodingStatus = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
    } else {
      dracoGeometry = new dracoDecoder.PointCloud();
      decodingStatus = decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
    }

    if (!decodingStatus.ok() || dracoGeometry.ptr == 0) {
      let errorMsg = "DracoGeomParser: Decoding failed: ";
      errorMsg += decodingStatus.error_msg();
      console.error(errorMsg);
      dracoDecoder.destroy(decoder);
      dracoDecoder.destroy(dracoGeometry);
      throw new Error(errorMsg);
    }

    dracoDecoder.destroy(buffer);
    let numFaces;

    if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
      numFaces = dracoGeometry.num_faces();
    } else {
      numFaces = 0;
    }

    let posAttId = decoder.GetAttributeId(dracoGeometry, dracoDecoder.POSITION);

    if (posAttId == -1) {
      let errorMsg = "DracoGeomParser: No position attribute found.";
      console.error(errorMsg);
      dracoDecoder.destroy(decoder);
      dracoDecoder.destroy(dracoGeometry);
      throw new Error(errorMsg);
    }

    let geometryBuffer = {};

    for (let ns in this.attNSMap) {
      if (this.attMap[ns] === undefined) {
        let attId = decoder.GetAttributeId(dracoGeometry, dracoDecoder[this.attNSMap[ns]]);

        if (attId !== -1) {
          if (this.verbosity > 0) {// console.log('Loaded ' + ns + ' attribute.');
          }

          let attribute = decoder.GetAttribute(dracoGeometry, attId);
          this.addAttributeToGeometry(dracoDecoder, decoder, dracoGeometry, ns, attribute, geometryBuffer);
        }
      }
    }

    for (let ns in this.attMap) {
      let attributeId = this.attMap[ns];
      let attribute = decoder.GetAttributeByUniqueId(dracoGeometry, attributeId);
      this.addAttributeToGeometry(dracoDecoder, decoder, dracoGeometry, ns, attribute, geometryBuffer);
    }

    if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
      if (this.drawMode === TriStripDrawMode) {
        let stripsArray = new dracoDecoder.DracoInt32Array();
        geometryBuffer.indices = new Uint32Array(stripsArray.size());

        for (let i = 0; i < stripsArray.size(); ++i) {
          geometryBuffer.indices[i] = stripsArray.GetValue(i);
        }

        dracoDecoder.destroy(stripsArray);
      } else {
        let numIndices = numFaces * 3;
        geometryBuffer.indices = new Uint32Array(numIndices);
        let ia = new dracoDecoder.DracoInt32Array();

        for (let i = 0; i < numFaces; ++i) {
          decoder.GetFaceFromMesh(dracoGeometry, i, ia);
          let index = i * 3;
          geometryBuffer.indices[index] = ia.GetValue(0);
          geometryBuffer.indices[index + 1] = ia.GetValue(1);
          geometryBuffer.indices[index + 2] = ia.GetValue(2);
        }

        dracoDecoder.destroy(ia);
      }
    }

    if (geometryType != dracoDecoder.TRIANGULAR_MESH) {
      geometryBuffer.indices = null;
    }

    dracoDecoder.destroy(decoder);
    dracoDecoder.destroy(dracoGeometry);
    return geometryBuffer;
  }

  parseData(bufData, beginI, endI, status) {
    let dracoDecoder = this.parser;
    let buffer = new dracoDecoder.DecoderBuffer();
    let bufLen = endI - beginI;

    if (status < 1) {
      buffer.Init(new Int8Array(bufData.buffer).subarray(0, bufLen), bufLen);
    } else {
      buffer.Init(new Int8Array(bufData.buffer).subarray(beginI, endI), bufLen);
    }

    let decoder = new dracoDecoder.Decoder(); // Determine what type is this file: mesh or point cloud.

    let geometryType = decoder.GetEncodedGeometryType(buffer);

    if (geometryType == dracoDecoder.TRIANGULAR_MESH) {
      if (this.verbosity > 0) {// console.log("Loaded a mesh segment.");
      }
    } else if (geometryType == dracoDecoder.POINT_CLOUD) {
      if (this.verbosity > 0) {// console.log("Loaded a point cloud.");
      }
    } else {
      let errorMsg = "DracoGeomParser: Unknown geometry type.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    } //console.log("worker parseData, geometryType: "+geometryType);


    return this.decodeGeomData(dracoDecoder, decoder, geometryType, buffer);
  }

  transformVS(vsScale, matfs, f32vs, vinLength) {
    let i = 0;
    let x = 0.0;
    let y = 0.0;
    let z = 0.0;
    let matX = vsScale * matfs[12];
    let matY = vsScale * matfs[13];
    let matZ = vsScale * matfs[14];

    while (i + 3 <= vinLength) {
      x = f32vs[i];
      y = f32vs[i + 1];
      z = f32vs[i + 2];
      f32vs[i] = x * matfs[0] + y * matfs[4] + z * matfs[8] + matX;
      f32vs[i + 1] = x * matfs[1] + y * matfs[5] + z * matfs[9] + matY;
      f32vs[i + 2] = x * matfs[2] + y * matfs[6] + z * matfs[10] + matZ;
      i += 3;
    }
  }

  getParseData(bufData, errorFlag) {
    let tarr = null;

    if (bufData != null) {
      tarr = []; // 暂时不用

      let fvs32 = null;

      for (let key in bufData) {
        if (bufData[key] != null) {
          tarr.push(bufData[key].buffer);
        }
      }

      if (fvs32 != null) {
        let atrribSize = fvs32[0];
        let min_x = fvs32[1];
        let min_y = fvs32[2];
        let min_z = fvs32[3];
        let max_x = min_x;
        let max_y = min_y;
        let max_z = min_z;
        let px;
        let py;
        let pz;

        for (let i = 1, len = fvs32.length; i < len; i += atrribSize) {
          px = fvs32[i];
          py = fvs32[i + 1];
          pz = fvs32[i + 2];
          if (px < min_x) min_x = px;else if (px > max_x) max_x = px;
          if (py < min_y) min_y = py;else if (py > max_y) max_y = py;
          if (pz < min_z) min_z = pz;else if (pz > max_z) max_z = pz;
        }

        bufData.min = {
          x: min_x,
          y: min_y,
          z: min_z
        };
        bufData.max = {
          x: max_x,
          y: max_y,
          z: max_z
        };
      }
    }

    let geomData = {
      vertices: bufData.position,
      uvsList: null,
      normals: null,
      indices: null
    };
    if (bufData.indices != undefined) geomData.indices = bufData.indices;
    if (bufData.normal != undefined) geomData.normals = bufData.normal;
    if (bufData.uv != undefined) geomData.uvsList = [bufData.uv]; // return { data: bufData, transfers: tarr, errorFlag: errorFlag };

    return {
      data: geomData,
      transfers: tarr,
      errorFlag: errorFlag
    };
  }

  receiveCall(data) {
    let streams = data.streams;
    this.drawMode = 0;
    this.vsScale = 1.0;
    this.attMap = {};
    this.attOpts = {
      position: {}
    };
    let errorFlag = 0;
    let dataObj = null;

    if (streams != null) {
      let descriptor = data.descriptor;

      if (descriptor.endI > descriptor.beginI) {
        let u8arr = streams[0];

        try {
          dataObj = this.parseData(u8arr, descriptor.beginI, descriptor.endI, descriptor.status);
        } catch (err) {
          errorFlag = -1;
          dataObj = null;
          console.error(err);
        }
      }
    } else {
      errorFlag = -2;
      console.error("the data is null.");
    }

    return this.getParseData(dataObj, errorFlag);
  }

}
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */


class DracoGeomParseTask {
  constructor() {
    this.m_dataIndex = 0;
    this.m_srcuid = 0;
    this.m_dependencyFinish = false;
    this.m_wasmData = null;
    this.m_currTaskClass = -1;
    this.threadIndex = 0;
    this.parser = null;
    this.decoder = {
      wasmBinary: null
    };
    this.dracoParser = new DracoGeomParser();
    this.m_currTaskClass = ThreadCore.getCurrTaskClass();
    console.log("DracoGeomParseTask::constructor(), currTaskClass: ", this.m_currTaskClass);
    ThreadCore.setCurrTaskClass(this.m_currTaskClass);
    ThreadCore.acquireData(this, {}, CMD.THREAD_ACQUIRE_DATA);
    ThreadCore.useDependency(this);
    ThreadCore.resetCurrTaskClass();
  }

  postDataMessage(data, transfers) {
    let sendData = {
      cmd: data.cmd,
      taskCmd: data.taskCmd,
      threadIndex: this.threadIndex,
      taskclass: this.m_currTaskClass,
      srcuid: this.m_srcuid,
      dataIndex: this.m_dataIndex,
      streams: data.streams,
      data: data.data
    };
    ThreadCore.postMessageToThread(sendData, transfers);
  }

  initDecoder(data) {
    let bin = data.streams[0];
    this.decoder["wasmBinary"] = bin;

    this.decoder["onModuleLoaded"] = module => {
      this.parser = module;
      this.dracoParser.parser = module;
      ThreadCore.setCurrTaskClass(this.m_currTaskClass);
      ThreadCore.transmitData(this, data, CMD.THREAD_TRANSMIT_DATA, [bin]);
      ThreadCore.initializeExternModule(this);
      ThreadCore.resetCurrTaskClass();
    };

    DracoDecoderModule(this.decoder);
  }

  receiveData(data) {
    this.m_srcuid = data.srcuid;
    this.m_dataIndex = data.dataIndex; // console.log("data.taskCmd: ", data.taskCmd);

    switch (data.taskCmd) {
      case CMD.PARSE:
        let parseData = this.dracoParser.receiveCall(data);
        data.data = {
          model: parseData.data,
          errorFlag: parseData.errorFlag
        };
        this.postDataMessage(data, parseData.transfers);
        break;

      case CMD.THREAD_ACQUIRE_DATA:
        this.threadIndex = data.threadIndex;
        this.m_wasmData = data.data; //console.log("#####$$$ Sub Worker mesh parser task DRACO_THREAD_ACQUIRE_DATA, data: ", data);

        if (this.m_dependencyFinish && this.m_wasmData != null) {
          this.initDecoder(this.m_wasmData);
        }

        break;

      default:
        //postDataMessage(data);
        break;
    }
  }

  getUniqueName() {
    return "dracoGeomParser";
  }

  dependencyFinish() {
    this.m_dependencyFinish = true;

    if (this.m_dependencyFinish && this.m_wasmData != null) {
      this.initDecoder(this.m_wasmData);
    }
  }

}

exports.DracoGeomParseTask = DracoGeomParseTask; // 对于独立的从外部加载到worker中的js代码文件，在worker中运行，则必须有如下实例化代码

let ins = new DracoGeomParseTask();

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

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("56b4");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });
});