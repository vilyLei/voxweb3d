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

/***/ "1f9e":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

class CTMTaskCMD {}
/**
 * 处理数据
 */


CTMTaskCMD.PARSE = "CTM_PARSE";
/**
 * 加载和处理数据
 */

CTMTaskCMD.LOAD_AND_PARSE = "CTM_LOAD_AND_PARSE";
exports.CTMTaskCMD = CTMTaskCMD;

/***/ }),

/***/ "3a68":
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
 * 作为多线程 worker 内部执行的任务处理功能的基类
 */

class BaseTaskInThread {
  constructor(enabled = true) {
    if (enabled) {
      ThreadCore.initializeExternModule(this);
    }
  }

  receiveData(data) {}

  postMessageToThread(data, transfers = null) {
    if (transfers != null) {
      ThreadCore.postMessageToThread(data);
    } else {
      ThreadCore.postMessageToThread(data, transfers);
    }
  }

  getTaskClass() {
    throw Error("the taskClass value is illegal !!!");
    return 0;
  }

  dependencyFinish() {}

  getUniqueName() {
    throw Error("the uniqueName value is illegal !!!");
    return "";
  }

}

exports.BaseTaskInThread = BaseTaskInThread;

/***/ }),

/***/ "64e2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
}); // thanks for threejs lamz module

class OutWindow {
  constructor() {
    this._pos = 0;
    this._streamPos = 0;
    this._windowSize = 0;
  }

  create(windowSize) {
    if (!this._buffer || this._windowSize !== windowSize) {
      this._buffer = [];
    }

    this._windowSize = windowSize;
    this._pos = 0;
    this._streamPos = 0;
  }

  flush() {
    var size = this._pos - this._streamPos;

    if (size !== 0) {
      while (size--) {
        this._stream.writeByte(this._buffer[this._streamPos++]);
      }

      if (this._pos >= this._windowSize) {
        this._pos = 0;
      }

      this._streamPos = this._pos;
    }
  }

  releaseStream() {
    this.flush();
    this._stream = null;
  }

  setStream(stream) {
    this.releaseStream();
    this._stream = stream;
  }

  init(solid) {
    if (!solid) {
      this._streamPos = 0;
      this._pos = 0;
    }
  }

  copyBlock(distance, len) {
    var pos = this._pos - distance - 1;

    if (pos < 0) {
      pos += this._windowSize;
    }

    while (len--) {
      if (pos >= this._windowSize) {
        pos = 0;
      }

      this._buffer[this._pos++] = this._buffer[pos++];

      if (this._pos >= this._windowSize) {
        this.flush();
      }
    }
  }

  putByte(b) {
    this._buffer[this._pos++] = b;

    if (this._pos >= this._windowSize) {
      this.flush();
    }
  }

  getByte(distance) {
    var pos = this._pos - distance - 1;

    if (pos < 0) {
      pos += this._windowSize;
    }

    return this._buffer[pos];
  }

}

class RangeDecoder {
  constructor() {
    this._code = 0;
    this._range = -1;
  }

  setStream(stream) {
    this._stream = stream;
  }

  releaseStream() {
    this._stream = null;
  }

  init() {
    var i = 5;
    this._code = 0;
    this._range = -1;

    while (i--) {
      this._code = this._code << 8 | this._stream.readByte();
    }
  }

  decodeDirectBits(numTotalBits) {
    var result = 0,
        i = numTotalBits,
        t;

    while (i--) {
      this._range >>>= 1;
      t = this._code - this._range >>> 31;
      this._code -= this._range & t - 1;
      result = result << 1 | 1 - t;

      if ((this._range & 0xff000000) === 0) {
        this._code = this._code << 8 | this._stream.readByte();
        this._range <<= 8;
      }
    }

    return result;
  }

  decodeBit(probs, index) {
    var prob = probs[index],
        newBound = (this._range >>> 11) * prob;

    if ((this._code ^ 0x80000000) < (newBound ^ 0x80000000)) {
      this._range = newBound;
      probs[index] += 2048 - prob >>> 5;

      if ((this._range & 0xff000000) === 0) {
        this._code = this._code << 8 | this._stream.readByte();
        this._range <<= 8;
      }

      return 0;
    }

    this._range -= newBound;
    this._code -= newBound;
    probs[index] -= prob >>> 5;

    if ((this._range & 0xff000000) === 0) {
      this._code = this._code << 8 | this._stream.readByte();
      this._range <<= 8;
    }

    return 1;
  }

}

class BitTreeDecoder {
  constructor(numBitLevels) {
    this._models = [];
    this._numBitLevels = 0;
    this._models = [];
    this._numBitLevels = numBitLevels;
  }

  init() {
    LZMA.initBitModels(this._models, 1 << this._numBitLevels);
  }

  decode(rangeDecoder) {
    var m = 1,
        i = this._numBitLevels;

    while (i--) {
      m = m << 1 | rangeDecoder.decodeBit(this._models, m);
    }

    return m - (1 << this._numBitLevels);
  }

  reverseDecode(rangeDecoder) {
    var m = 1,
        symbol = 0,
        i = 0,
        bit;

    for (; i < this._numBitLevels; ++i) {
      bit = rangeDecoder.decodeBit(this._models, m);
      m = m << 1 | bit;
      symbol |= bit << i;
    }

    return symbol;
  }

}

class LenDecoder {
  constructor() {
    this._choice = [];
    this._lowCoder = [];
    this._midCoder = [];
    this._highCoder = new BitTreeDecoder(8);
    this._numPosStates = 0;
  }

  create(numPosStates) {
    for (; this._numPosStates < numPosStates; ++this._numPosStates) {
      this._lowCoder[this._numPosStates] = new BitTreeDecoder(3);
      this._midCoder[this._numPosStates] = new BitTreeDecoder(3);
    }
  }

  init() {
    var i = this._numPosStates;
    LZMA.initBitModels(this._choice, 2);

    while (i--) {
      this._lowCoder[i].init();

      this._midCoder[i].init();
    }

    this._highCoder.init();
  }

  decode(rangeDecoder, posState) {
    if (rangeDecoder.decodeBit(this._choice, 0) === 0) {
      return this._lowCoder[posState].decode(rangeDecoder);
    }

    if (rangeDecoder.decodeBit(this._choice, 1) === 0) {
      return 8 + this._midCoder[posState].decode(rangeDecoder);
    }

    return 16 + this._highCoder.decode(rangeDecoder);
  }

}

class Decoder2 {
  constructor() {
    this._decoders = [];
  }

  init() {
    LZMA.initBitModels(this._decoders, 0x300);
  }

  decodeNormal(rangeDecoder) {
    var symbol = 1;

    do {
      symbol = symbol << 1 | rangeDecoder.decodeBit(this._decoders, symbol);
    } while (symbol < 0x100);

    return symbol & 0xff;
  }

  decodeWithMatchByte(rangeDecoder, matchByte) {
    var symbol = 1,
        matchBit,
        bit;

    do {
      matchBit = matchByte >> 7 & 1;
      matchByte <<= 1;
      bit = rangeDecoder.decodeBit(this._decoders, (1 + matchBit << 8) + symbol);
      symbol = symbol << 1 | bit;

      if (matchBit !== bit) {
        while (symbol < 0x100) {
          symbol = symbol << 1 | rangeDecoder.decodeBit(this._decoders, symbol);
        }

        break;
      }
    } while (symbol < 0x100);

    return symbol & 0xff;
  }

}

class LiteralDecoder {
  constructor() {
    this._coders = null;
  }

  create(numPosBits, numPrevBits) {
    var i;

    if (this._coders && this._numPrevBits === numPrevBits && this._numPosBits === numPosBits) {
      return;
    }

    this._numPosBits = numPosBits;
    this._posMask = (1 << numPosBits) - 1;
    this._numPrevBits = numPrevBits;
    this._coders = [];
    i = 1 << this._numPrevBits + this._numPosBits;

    while (i--) {
      this._coders[i] = new Decoder2();
    }
  }

  init() {
    var i = 1 << this._numPrevBits + this._numPosBits;

    while (i--) {
      this._coders[i].init();
    }
  }

  getDecoder(pos, prevByte) {
    return this._coders[((pos & this._posMask) << this._numPrevBits) + ((prevByte & 0xff) >>> 8 - this._numPrevBits)];
  }

}

class Decoder {
  constructor() {
    this._outWindow = new OutWindow();
    this._rangeDecoder = new RangeDecoder();
    this._isMatchDecoders = [];
    this._isRepDecoders = [];
    this._isRepG0Decoders = [];
    this._isRepG1Decoders = [];
    this._isRepG2Decoders = [];
    this._isRep0LongDecoders = [];
    this._posSlotDecoder = [];
    this._posDecoders = [];
    this._posAlignDecoder = new BitTreeDecoder(4);
    this._lenDecoder = new LenDecoder();
    this._repLenDecoder = new LenDecoder();
    this._literalDecoder = new LiteralDecoder();
    this._dictionarySize = -1;
    this._dictionarySizeCheck = -1;
    this._posStateMask = 0;
    this._posSlotDecoder[0] = new BitTreeDecoder(6);
    this._posSlotDecoder[1] = new BitTreeDecoder(6);
    this._posSlotDecoder[2] = new BitTreeDecoder(6);
    this._posSlotDecoder[3] = new BitTreeDecoder(6);
  }

  setDictionarySize(dictionarySize) {
    if (dictionarySize < 0) {
      return false;
    }

    if (this._dictionarySize !== dictionarySize) {
      this._dictionarySize = dictionarySize;
      this._dictionarySizeCheck = Math.max(this._dictionarySize, 1);

      this._outWindow.create(Math.max(this._dictionarySizeCheck, 4096));
    }

    return true;
  }

  setLcLpPb(lc, lp, pb) {
    var numPosStates = 1 << pb;

    if (lc > 8 || lp > 4 || pb > 4) {
      return false;
    }

    this._literalDecoder.create(lp, lc);

    this._lenDecoder.create(numPosStates);

    this._repLenDecoder.create(numPosStates);

    this._posStateMask = numPosStates - 1;
    return true;
  }

  init() {
    var i = 4;

    this._outWindow.init(false);

    LZMA.initBitModels(this._isMatchDecoders, 192);
    LZMA.initBitModels(this._isRep0LongDecoders, 192);
    LZMA.initBitModels(this._isRepDecoders, 12);
    LZMA.initBitModels(this._isRepG0Decoders, 12);
    LZMA.initBitModels(this._isRepG1Decoders, 12);
    LZMA.initBitModels(this._isRepG2Decoders, 12);
    LZMA.initBitModels(this._posDecoders, 114);

    this._literalDecoder.init();

    while (i--) {
      this._posSlotDecoder[i].init();
    }

    this._lenDecoder.init();

    this._repLenDecoder.init();

    this._posAlignDecoder.init();

    this._rangeDecoder.init();
  }

  decode(inStream, outStream, outSize) {
    var state = 0,
        rep0 = 0,
        rep1 = 0,
        rep2 = 0,
        rep3 = 0,
        nowPos64 = 0,
        prevByte = 0,
        posState,
        decoder2,
        len,
        distance,
        posSlot,
        numDirectBits;

    this._rangeDecoder.setStream(inStream);

    this._outWindow.setStream(outStream);

    this.init();

    while (outSize < 0 || nowPos64 < outSize) {
      posState = nowPos64 & this._posStateMask;

      if (this._rangeDecoder.decodeBit(this._isMatchDecoders, (state << 4) + posState) === 0) {
        decoder2 = this._literalDecoder.getDecoder(nowPos64++, prevByte);

        if (state >= 7) {
          prevByte = decoder2.decodeWithMatchByte(this._rangeDecoder, this._outWindow.getByte(rep0));
        } else {
          prevByte = decoder2.decodeNormal(this._rangeDecoder);
        }

        this._outWindow.putByte(prevByte);

        state = state < 4 ? 0 : state - (state < 10 ? 3 : 6);
      } else {
        if (this._rangeDecoder.decodeBit(this._isRepDecoders, state) === 1) {
          len = 0;

          if (this._rangeDecoder.decodeBit(this._isRepG0Decoders, state) === 0) {
            if (this._rangeDecoder.decodeBit(this._isRep0LongDecoders, (state << 4) + posState) === 0) {
              state = state < 7 ? 9 : 11;
              len = 1;
            }
          } else {
            if (this._rangeDecoder.decodeBit(this._isRepG1Decoders, state) === 0) {
              distance = rep1;
            } else {
              if (this._rangeDecoder.decodeBit(this._isRepG2Decoders, state) === 0) {
                distance = rep2;
              } else {
                distance = rep3;
                rep3 = rep2;
              }

              rep2 = rep1;
            }

            rep1 = rep0;
            rep0 = distance;
          }

          if (len === 0) {
            len = 2 + this._repLenDecoder.decode(this._rangeDecoder, posState);
            state = state < 7 ? 8 : 11;
          }
        } else {
          rep3 = rep2;
          rep2 = rep1;
          rep1 = rep0;
          len = 2 + this._lenDecoder.decode(this._rangeDecoder, posState);
          state = state < 7 ? 7 : 10;
          posSlot = this._posSlotDecoder[len <= 5 ? len - 2 : 3].decode(this._rangeDecoder);

          if (posSlot >= 4) {
            numDirectBits = (posSlot >> 1) - 1;
            rep0 = (2 | posSlot & 1) << numDirectBits;

            if (posSlot < 14) {
              rep0 += LZMA.reverseDecode2(this._posDecoders, rep0 - posSlot - 1, this._rangeDecoder, numDirectBits);
            } else {
              rep0 += this._rangeDecoder.decodeDirectBits(numDirectBits - 4) << 4;
              rep0 += this._posAlignDecoder.reverseDecode(this._rangeDecoder);

              if (rep0 < 0) {
                if (rep0 === -1) {
                  break;
                }

                return false;
              }
            }
          } else {
            rep0 = posSlot;
          }
        }

        if (rep0 >= nowPos64 || rep0 >= this._dictionarySizeCheck) {
          return false;
        }

        this._outWindow.copyBlock(rep0, len);

        nowPos64 += len;
        prevByte = this._outWindow.getByte(0);
      }
    }

    this._outWindow.flush();

    this._outWindow.releaseStream();

    this._rangeDecoder.releaseStream();

    return true;
  }

  setDecoderProperties(properties) {
    var value, lc, lp, pb, dictionarySize;

    if (properties.size < 5) {
      return false;
    }

    value = properties.readByte();
    lc = value % 9;
    value = ~~(value / 9);
    lp = value % 5;
    pb = ~~(value / 5);

    if (!this.setLcLpPb(lc, lp, pb)) {
      return false;
    }

    dictionarySize = properties.readByte();
    dictionarySize |= properties.readByte() << 8;
    dictionarySize |= properties.readByte() << 16;
    dictionarySize += properties.readByte() * 16777216;
    return this.setDictionarySize(dictionarySize);
  }

}

class LZMA {
  constructor() {
    this.uuid = "LZMA";
  }

  static initBitModels(probs, len) {
    while (len--) {
      probs[len] = 1024;
    }
  }

  static reverseDecode2(models, startIndex, rangeDecoder, numBitLevels) {
    var m = 1,
        symbol = 0,
        i = 0,
        bit;

    for (; i < numBitLevels; ++i) {
      bit = rangeDecoder.decodeBit(models, startIndex + m);
      m = m << 1 | bit;
      symbol |= bit << i;
    }

    return symbol;
  }

  static decompress(properties, inStream, outStream, outSize) {
    var decoder = new Decoder();

    if (!decoder.setDecoderProperties(properties)) {
      throw "Incorrect stream properties";
    }

    if (!decoder.decode(inStream, outStream, outSize)) {
      throw "Error in data stream";
    }

    return true;
  }

}

exports.LZMA = LZMA;

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

/***/ "ae3d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CTMFile_1 = __webpack_require__("d169");

class CTMGeomDataParser {
  constructor() {}

  parserStringData(dataStr) {
    var stream = new CTMFile_1.CTMStringStream(dataStr);
    stream.offset = 0;
    let ctmFile = new CTMFile_1.CTMFile(stream);

    if (ctmFile != null) {
      let ctmbody = ctmFile.body;
      return ctmbody;
    }

    return null;
  }

  parserBinaryData(buffer) {
    let stream = new CTMFile_1.CTMStream(new Uint8Array(buffer));
    stream.offset = 0;
    let ctmFile = new CTMFile_1.CTMFile(stream);

    if (ctmFile != null) {
      let ctmbody = ctmFile.body;
      return ctmbody;
    }

    return null;
  }

}

exports.CTMGeomDataParser = CTMGeomDataParser;

/***/ }),

/***/ "c37c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const CTMGeomDataParser_1 = __webpack_require__("ae3d");

const BaseTaskInThread_1 = __webpack_require__("3a68");

const CTMTaskCMD_1 = __webpack_require__("1f9e");
/**
 * 这个类的实例来解析，杜绝了异步加载带来的顺序错乱的问题
 */


class CTMDataParser extends BaseTaskInThread_1.BaseTaskInThread {
  constructor() {
    super(false);
  }

  parseMeshData(rdata, dataBuf) {
    let parser = new CTMGeomDataParser_1.CTMGeomDataParser();
    let fileBody = null;

    try {
      fileBody = parser.parserBinaryData(dataBuf);
    } catch (e) {
      console.error("CTM parse error, url: ", rdata.descriptor.url, rdata);
    } //console.log("ModuleCTMGeomParser::receiveData(),rdata: ", rdata);


    let transfers = [dataBuf.buffer];

    if (fileBody != null) {
      let len = fileBody.uvMaps.length;
      let uvsList = [];

      for (let i = 0; i < len; ++i) {
        uvsList.push(fileBody.uvMaps[i].uv);
        transfers.push(fileBody.uvMaps[i].uv.buffer);
      } // 因为 uv 和 下面三个数据实际公用一个buffer
      // transfers.push(fileBody.vertices);
      // transfers.push(fileBody.normals);
      // transfers.push(fileBody.indices);


      len = fileBody.indices.length;

      if (len < 65536) {
        // 以下操作为了节省显存
        let ivs = new Uint16Array(fileBody.indices.buffer);
        let ls = fileBody.indices;

        for (let i = 0; i < len; ++i) {
          ivs[i] = ls[i];
        }

        fileBody.indices = ivs.subarray(0, len);
      }

      rdata.data = {
        uvsList: uvsList,
        vertices: fileBody.vertices,
        normals: fileBody.normals,
        indices: fileBody.indices
      };
    } else {
      rdata.data = {
        uvsList: null,
        vertices: null,
        normals: null,
        indices: null
      };
    }

    this.postMessageToThread(rdata, transfers);
  }

}
/**
 * 作为多线程 worker 内部执行的任务处理功能的实现类, 这个文件将会被单独打包
 */


class ModuleCTMGeomParser extends BaseTaskInThread_1.BaseTaskInThread {
  constructor() {
    super();
    this.m_parser = new CTMDataParser();
    console.log("ModuleCTMGeomParser::constructor()...");
  }

  receiveData(rdata) {
    switch (rdata.taskCmd) {
      case CTMTaskCMD_1.CTMTaskCMD.PARSE:
        let dataBuf = rdata.streams[0]; //this.parseMeshData(rdata, dataBuf);

        this.m_parser.parseMeshData(rdata, dataBuf);
        break;

      case CTMTaskCMD_1.CTMTaskCMD.LOAD_AND_PARSE:
        let beginTime = Date.now();
        this.loadMeshDataByUrl(rdata.descriptor.url, (buf, url) => {
          // 创建一个实例来解析，杜绝了异步加载带来的顺序错乱的问题，保证解析的是加载结束后获得的数据
          let parser = new CTMDataParser();

          try {
            console.log("load lossTime: ", Date.now() - beginTime);
            parser.parseMeshData(rdata, new Uint8Array(buf));
          } catch (e) {}
        }, (status, url) => {
          console.error("loaded ctm mesh data error, url: ", url);
        });
        break;

      default:
        break;
    }
  }

  async loadMeshDataByUrl(url, loadedCall, loadErrorCall, headRange = "") {
    // console.log("loadBinBuffer, headRange != '': ", headRange != "");
    const reader = new FileReader();

    reader.onload = e => {
      loadedCall(reader.result, url);
    };

    const request = new XMLHttpRequest();
    request.open("GET", url, true);

    if (headRange != "") {
      request.setRequestHeader("Range", headRange);
    }

    request.responseType = "blob";

    request.onload = e => {
      // console.log("loaded binary buffer request.status: ", request.status, e);
      if (request.status <= 206) {
        reader.readAsArrayBuffer(request.response);
      } else {
        loadErrorCall(request.status, url);
      }
    };

    request.onerror = e => {
      console.error("load error binary buffer request.status: ", request.status);
      loadErrorCall(request.status, url);
    };

    request.send(null);
  }

  getTaskClass() {
    return 101;
  }

}

exports.ModuleCTMGeomParser = ModuleCTMGeomParser; // 这一句代码是必须有的

let ins = new ModuleCTMGeomParser();

/***/ }),

/***/ "d169":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // thanks for threejs ctm module

Object.defineProperty(exports, "__esModule", {
  value: true
});

const LZMA_1 = __webpack_require__("64e2");

class InterleavedStream {
  constructor(data, count) {
    this.data = null;
    this.data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    this.offset = CTM.isLittleEndian ? 3 : 0;
    this.count = count * 4;
    this.len = this.data.length;
  }

  writeByte(value) {
    this.data[this.offset] = value;
    this.offset += this.count;

    if (this.offset >= this.len) {
      this.offset -= this.len - 4;

      if (this.offset >= this.count) {
        this.offset -= this.count + (CTM.isLittleEndian ? 1 : -1);
      }
    }
  }

}

class FileHeader {
  constructor(stream) {
    stream.readInt32(); //magic "OCTM"

    this.fileFormat = stream.readInt32();
    this.compressionMethod = stream.readInt32();
    this.vertexCount = stream.readInt32();
    this.triangleCount = stream.readInt32();
    this.uvMapCount = stream.readInt32();
    this.attrMapCount = stream.readInt32();
    this.flags = stream.readInt32();
    this.comment = stream.readString();
  }

  hasNormals() {
    return this.flags & CTM.Flags.NORMALS;
  }

}

class FileMG2Header {
  constructor(stream) {
    stream.readInt32(); //magic "MG2H"

    this.vertexPrecision = stream.readFloat32();
    this.normalPrecision = stream.readFloat32();
    this.lowerBoundx = stream.readFloat32();
    this.lowerBoundy = stream.readFloat32();
    this.lowerBoundz = stream.readFloat32();
    this.higherBoundx = stream.readFloat32();
    this.higherBoundy = stream.readFloat32();
    this.higherBoundz = stream.readFloat32();
    this.divx = stream.readInt32();
    this.divy = stream.readInt32();
    this.divz = stream.readInt32();
    this.sizex = (this.higherBoundx - this.lowerBoundx) / this.divx;
    this.sizey = (this.higherBoundy - this.lowerBoundy) / this.divy;
    this.sizez = (this.higherBoundz - this.lowerBoundz) / this.divz;
  }

}

class CTMFileBody {
  getUVSAt(i) {
    return this.uvMaps[i].uv;
  }

  constructor(header) {
    let i = header.triangleCount * 3,
        v = header.vertexCount * 3,
        n = header.hasNormals() ? header.vertexCount * 3 : 0,
        u = header.vertexCount * 2,
        a = header.vertexCount * 4,
        j = 0;
    let data = new ArrayBuffer((i + v + n + u * header.uvMapCount + a * header.attrMapCount) * 4);
    this.indices = new Uint32Array(data, 0, i); // let data: ArrayBuffer;
    // if(i > 65535) {
    //     data = new ArrayBuffer( i * 4  + (v + n + (u * header.uvMapCount) + (a * header.attrMapCount)) * 4 );
    //     this.indices = new Uint32Array(data, 0, i);
    // }else {
    //     data = new ArrayBuffer( i * 2  + (v + n + (u * header.uvMapCount) + (a * header.attrMapCount)) * 4 );
    //     this.indices = new Uint16Array(data, 0, i);
    // }

    this.vertices = new Float32Array(data, i * 4, v);

    if (header.hasNormals()) {
      this.normals = new Float32Array(data, (i + v) * 4, n);
    }

    if (header.uvMapCount) {
      this.uvMaps = [];

      for (j = 0; j < header.uvMapCount; ++j) {
        this.uvMaps[j] = {
          uv: new Float32Array(data, (i + v + n + j * u) * 4, u)
        };
      }
    }

    if (header.attrMapCount) {
      this.attrMaps = [];

      for (j = 0; j < header.attrMapCount; ++j) {
        this.attrMaps[j] = {
          attr: new Float32Array(data, (i + v + n + u * header.uvMapCount + j * a) * 4, a)
        };
      }
    }
  }

}

exports.CTMFileBody = CTMFileBody;

class CTM {
  static isLittleEndian() {
    let buffer = new ArrayBuffer(2),
        bytes = new Uint8Array(buffer),
        ints = new Uint16Array(buffer);
    bytes[0] = 1;
    return ints[0] === 1;
  }

  static InterleavedStream(data, count) {
    return new InterleavedStream(data, count);
  }

  static restoreIndices(indices, len) {
    let i = 3;

    if (len > 0) {
      indices[2] += indices[0];
    }

    for (; i < len; i += 3) {
      indices[i] += indices[i - 3];

      if (indices[i] === indices[i - 3]) {
        indices[i + 1] += indices[i - 2];
      } else {
        indices[i + 1] += indices[i];
      }

      indices[i + 2] += indices[i];
    }
  }

  static calcSmoothNormals(indices, vertices) {
    let smooth = new Float32Array(vertices.length),
        indx,
        indy,
        indz,
        nx,
        ny,
        nz,
        v1x,
        v1y,
        v1z,
        v2x,
        v2y,
        v2z,
        len,
        i,
        k;

    for (i = 0, k = indices.length; i < k;) {
      indx = indices[i++] * 3;
      indy = indices[i++] * 3;
      indz = indices[i++] * 3;
      v1x = vertices[indy] - vertices[indx];
      v2x = vertices[indz] - vertices[indx];
      v1y = vertices[indy + 1] - vertices[indx + 1];
      v2y = vertices[indz + 1] - vertices[indx + 1];
      v1z = vertices[indy + 2] - vertices[indx + 2];
      v2z = vertices[indz + 2] - vertices[indx + 2];
      nx = v1y * v2z - v1z * v2y;
      ny = v1z * v2x - v1x * v2z;
      nz = v1x * v2y - v1y * v2x;
      len = Math.sqrt(nx * nx + ny * ny + nz * nz);

      if (len > 1e-10) {
        nx /= len;
        ny /= len;
        nz /= len;
      }

      smooth[indx] += nx;
      smooth[indx + 1] += ny;
      smooth[indx + 2] += nz;
      smooth[indy] += nx;
      smooth[indy + 1] += ny;
      smooth[indy + 2] += nz;
      smooth[indz] += nx;
      smooth[indz + 1] += ny;
      smooth[indz + 2] += nz;
    }

    for (i = 0, k = smooth.length; i < k; i += 3) {
      len = Math.sqrt(smooth[i] * smooth[i] + smooth[i + 1] * smooth[i + 1] + smooth[i + 2] * smooth[i + 2]);

      if (len > 1e-10) {
        smooth[i] /= len;
        smooth[i + 1] /= len;
        smooth[i + 2] /= len;
      }
    }

    return smooth;
  }

  static restoreVertices(vertices, grid, gridIndices, precision) {
    let gridIdx,
        delta,
        x,
        y,
        z,
        intVertices = new Uint32Array(vertices.buffer, vertices.byteOffset, vertices.length),
        ydiv = grid.divx,
        zdiv = ydiv * grid.divy,
        prevGridIdx = 0x7fffffff,
        prevDelta = 0,
        i = 0,
        j = 0,
        len = gridIndices.length;

    for (; i < len; j += 3) {
      x = gridIdx = gridIndices[i++];
      z = ~~(x / zdiv);
      x -= ~~(z * zdiv);
      y = ~~(x / ydiv);
      x -= ~~(y * ydiv);
      delta = intVertices[j];

      if (gridIdx === prevGridIdx) {
        delta += prevDelta;
      }

      vertices[j] = grid.lowerBoundx + x * grid.sizex + precision * delta;
      vertices[j + 1] = grid.lowerBoundy + y * grid.sizey + precision * intVertices[j + 1];
      vertices[j + 2] = grid.lowerBoundz + z * grid.sizez + precision * intVertices[j + 2];
      prevGridIdx = gridIdx;
      prevDelta = delta;
    }
  }

  static restoreGridIndices(gridIndices, len) {
    let i = 1;

    for (; i < len; ++i) {
      gridIndices[i] += gridIndices[i - 1];
    }
  }

  static restoreNormals(normals, smooth, precision) {
    let ro,
        phi,
        theta,
        sinPhi,
        nx,
        ny,
        nz,
        by,
        bz,
        len,
        intNormals = new Uint32Array(normals.buffer, normals.byteOffset, normals.length),
        i = 0,
        k = normals.length,
        PI_DIV_2 = 3.141592653589793238462643 * 0.5;

    for (; i < k; i += 3) {
      ro = intNormals[i] * precision;
      phi = intNormals[i + 1];

      if (phi === 0) {
        normals[i] = smooth[i] * ro;
        normals[i + 1] = smooth[i + 1] * ro;
        normals[i + 2] = smooth[i + 2] * ro;
      } else {
        if (phi <= 4) {
          theta = (intNormals[i + 2] - 2) * PI_DIV_2;
        } else {
          theta = (intNormals[i + 2] * 4 / phi - 2) * PI_DIV_2;
        }

        phi *= precision * PI_DIV_2;
        sinPhi = ro * Math.sin(phi);
        nx = sinPhi * Math.cos(theta);
        ny = sinPhi * Math.sin(theta);
        nz = ro * Math.cos(phi);
        bz = smooth[i + 1];
        by = smooth[i] - smooth[i + 2];
        len = Math.sqrt(2 * bz * bz + by * by);

        if (len > 1e-20) {
          by /= len;
          bz /= len;
        }

        normals[i] = smooth[i] * nz + (smooth[i + 1] * bz - smooth[i + 2] * by) * ny - bz * nx;
        normals[i + 1] = smooth[i + 1] * nz - (smooth[i + 2] + smooth[i]) * bz * ny + by * nx;
        normals[i + 2] = smooth[i + 2] * nz + (smooth[i] * by + smooth[i + 1] * bz) * ny + bz * nx;
      }
    }
  }

  static restoreMap(map, count, precision) {
    let delta,
        value,
        intMap = new Uint32Array(map.buffer, map.byteOffset, map.length),
        i = 0,
        j,
        len = map.length;

    for (; i < count; ++i) {
      delta = 0;

      for (j = i; j < len; j += count) {
        value = intMap[j];
        delta += value & 1 ? -(value + 1 >> 1) : value >> 1;
        map[j] = delta * precision;
      }
    }
  }

}

CTM.CompressionMethod = {
  RAW: 0x00574152,
  MG1: 0x0031474d,
  MG2: 0x0032474d
};
CTM.Flags = {
  NORMALS: 0x00000001
};

class ReaderRAW {
  constructor() {}

  readAttrMaps(stream, attrMaps) {
    let i = 0;

    for (; i < attrMaps.length; ++i) {
      stream.readInt32(); //magic "ATTR"

      attrMaps[i].name = stream.readString();
      stream.readArrayFloat32(attrMaps[i].attr);
    }
  }

  readUVMaps(stream, uvMaps) {
    let i = 0;

    for (; i < uvMaps.length; ++i) {
      stream.readInt32(); //magic "TEXC"

      uvMaps[i].name = stream.readString();
      uvMaps[i].filename = stream.readString();
      stream.readArrayFloat32(uvMaps[i].uv);
    }
  }

  readNormals(stream, normals) {
    stream.readInt32(); //magic "NORM"

    stream.readArrayFloat32(normals);
  }

  readVertices(stream, vertices) {
    stream.readInt32(); //magic "VERT"

    stream.readArrayFloat32(vertices);
  }

  readIndices(stream, indices) {
    stream.readInt32(); //magic "INDX"

    stream.readArrayInt32(indices);
  }

  read(stream, body) {
    this.readIndices(stream, body.indices);
    this.readVertices(stream, body.vertices);

    if (body.normals) {
      this.readNormals(stream, body.normals);
    }

    if (body.uvMaps) {
      this.readUVMaps(stream, body.uvMaps);
    }

    if (body.attrMaps) {
      this.readAttrMaps(stream, body.attrMaps);
    }
  }

}

class ReaderMG1 {
  constructor() {}

  read(stream, body) {
    this.readIndices(stream, body.indices);
    this.readVertices(stream, body.vertices);

    if (body.normals) {
      this.readNormals(stream, body.normals);
    }

    if (body.uvMaps) {
      this.readUVMaps(stream, body.uvMaps);
    }

    if (body.attrMaps) {
      this.readAttrMaps(stream, body.attrMaps);
    }
  }

  readIndices(stream, indices) {
    stream.readInt32(); //magic "INDX"

    stream.readInt32(); //packed size

    let interleaved = CTM.InterleavedStream(indices, 3);
    LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    CTM.restoreIndices(indices, indices.length);
  }

  readVertices(stream, vertices) {
    stream.readInt32(); //magic "VERT"

    stream.readInt32(); //packed size

    let interleaved = CTM.InterleavedStream(vertices, 1);
    LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
  }

  readNormals(stream, normals) {
    stream.readInt32(); //magic "NORM"

    stream.readInt32(); //packed size

    let interleaved = CTM.InterleavedStream(normals, 3);
    LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
  }

  readUVMaps(stream, uvMaps) {
    let i = 0;

    for (; i < uvMaps.length; ++i) {
      stream.readInt32(); //magic "TEXC"

      uvMaps[i].name = stream.readString();
      uvMaps[i].filename = stream.readString();
      stream.readInt32(); //packed size

      let interleaved = CTM.InterleavedStream(uvMaps[i].uv, 2);
      LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    }
  }

  readAttrMaps(stream, attrMaps) {
    let i = 0;

    for (; i < attrMaps.length; ++i) {
      stream.readInt32(); //magic "ATTR"

      attrMaps[i].name = stream.readString();
      stream.readInt32(); //packed size

      let interleaved = CTM.InterleavedStream(attrMaps[i].attr, 4);
      LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    }
  }

}

class ReaderMG2 {
  constructor() {}

  read(stream, body) {
    this.MG2Header = new FileMG2Header(stream);
    this.readVertices(stream, body.vertices);
    this.readIndices(stream, body.indices);

    if (body.normals) {
      this.readNormals(stream, body);
    }

    if (body.uvMaps) {
      this.readUVMaps(stream, body.uvMaps);
    }

    if (body.attrMaps) {
      this.readAttrMaps(stream, body.attrMaps);
    }
  }

  readVertices(stream, vertices) {
    stream.readInt32(); //magic "VERT"

    stream.readInt32(); //packed size

    let interleaved = new InterleavedStream(vertices, 3);
    LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    let gridIndices = this.readGridIndices(stream, vertices);
    CTM.restoreVertices(vertices, this.MG2Header, gridIndices, this.MG2Header.vertexPrecision);
  }

  readGridIndices(stream, vertices) {
    stream.readInt32(); //magic "GIDX"

    stream.readInt32(); //packed size

    let gridIndices = new Uint32Array(vertices.length / 3);
    let interleaved = new InterleavedStream(gridIndices, 1);
    LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    CTM.restoreGridIndices(gridIndices, gridIndices.length);
    return gridIndices;
  }

  readIndices(stream, indices) {
    stream.readInt32(); //magic "INDX"

    stream.readInt32(); //packed size

    let interleaved = new InterleavedStream(indices, 3);
    LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    CTM.restoreIndices(indices, indices.length);
  }

  readNormals(stream, body) {
    stream.readInt32(); //magic "NORM"

    stream.readInt32(); //packed size

    let interleaved = new InterleavedStream(body.normals, 3);
    LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    let smooth = CTM.calcSmoothNormals(body.indices, body.vertices);
    CTM.restoreNormals(body.normals, smooth, this.MG2Header.normalPrecision);
  }

  readUVMaps(stream, uvMaps) {
    let i = 0;

    for (; i < uvMaps.length; ++i) {
      stream.readInt32(); //magic "TEXC"

      uvMaps[i].name = stream.readString();
      uvMaps[i].filename = stream.readString();
      let precision = stream.readFloat32();
      stream.readInt32(); //packed size

      let interleaved = new InterleavedStream(uvMaps[i].uv, 2);
      LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
      CTM.restoreMap(uvMaps[i].uv, 2, precision);
    }
  }

  readAttrMaps(stream, attrMaps) {
    let i = 0;

    for (; i < attrMaps.length; ++i) {
      stream.readInt32(); //magic "ATTR"

      attrMaps[i].name = stream.readString();
      let precision = stream.readFloat32();
      stream.readInt32(); //packed size

      let interleaved = new InterleavedStream(attrMaps[i].attr, 4);
      LZMA_1.LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
      CTM.restoreMap(attrMaps[i].attr, 4, precision);
    }
  }

}

class CTMStream {
  constructor(data) {
    this.TWO_POW_MINUS23 = Math.pow(2, -23);
    this.TWO_POW_MINUS126 = Math.pow(2, -126);
    this.data = data;
    this.offset = 0;
  }

  decodeUint8Arr(u8array) {
    return new TextDecoder("utf-8").decode(u8array);
  }

  readByte() {
    return this.data[this.offset++] & 0xff;
  }

  readInt32() {
    // let i = this.readByte();
    // i |= this.readByte() << 8;
    // i |= this.readByte() << 16;
    // return i | (this.readByte() << 24);
    let i = this.data[this.offset++];
    i |= this.data[this.offset++] << 8;
    i |= this.data[this.offset++] << 16;
    return i | this.data[this.offset++] << 24;
  }

  readFloat32() {
    // let m = this.readByte();
    // m += this.readByte() << 8;
    // let b1 = this.readByte();
    // let b2 = this.readByte();
    let m = this.data[this.offset++];
    m += this.data[this.offset++] << 8;
    let b1 = this.data[this.offset++];
    let b2 = this.data[this.offset++];
    m += (b1 & 0x7f) << 16;
    let e = (b2 & 0x7f) << 1 | (b1 & 0x80) >>> 7;
    let s = b2 & 0x80 ? -1 : 1;

    if (e === 255) {
      return m !== 0 ? NaN : s * Infinity;
    }

    if (e > 0) {
      return s * (1 + m * this.TWO_POW_MINUS23) * Math.pow(2, e - 127);
    }

    if (m !== 0) {
      return s * m * this.TWO_POW_MINUS126;
    }

    return s * 0;
  }

  readString() {
    let len = this.readInt32();
    this.offset += len;
    let bytes = this.data.subarray(this.offset - len, this.offset);
    return this.decodeUint8Arr(bytes);
  }

  readArrayInt32(array) {
    let i = 0,
        len = array.length;

    while (i < len) {
      array[i++] = this.readInt32();
    }

    return array;
  }

  readArrayFloat32(array) {
    let i = 0,
        len = array.length;

    while (i < len) {
      array[i++] = this.readFloat32();
    }

    return array;
  }

}

exports.CTMStream = CTMStream;

class CTMStringStream {
  constructor(data) {
    this.TWO_POW_MINUS23 = Math.pow(2, -23);
    this.TWO_POW_MINUS126 = Math.pow(2, -126);
    this.data = null;
    this.offset = 0;
    this.data = data;
    this.offset = 0;
  }

  readByte() {
    return this.data.charCodeAt(this.offset++) & 0xff;
  }

  readInt32() {
    let i = this.readByte();
    i |= this.readByte() << 8;
    i |= this.readByte() << 16;
    return i | this.readByte() << 24;
  }

  readFloat32() {
    let m = this.readByte();
    m += this.readByte() << 8;
    let b1 = this.readByte();
    let b2 = this.readByte();
    m += (b1 & 0x7f) << 16;
    let e = (b2 & 0x7f) << 1 | (b1 & 0x80) >>> 7;
    let s = b2 & 0x80 ? -1 : 1;

    if (e === 255) {
      return m !== 0 ? NaN : s * Infinity;
    }

    if (e > 0) {
      return s * (1 + m * this.TWO_POW_MINUS23) * Math.pow(2, e - 127);
    }

    if (m !== 0) {
      return s * m * this.TWO_POW_MINUS126;
    }

    return s * 0;
  }

  readString() {
    let len = this.readInt32();
    this.offset += len; //return this.data.substr(this.offset - len, len);

    return this.data.slice(this.offset - len, this.offset);
  }

  readArrayInt32(array) {
    let i = 0,
        len = array.length;

    while (i < len) {
      array[i++] = this.readInt32();
    }

    return array;
  }

  readArrayFloat32(array) {
    let i = 0,
        len = array.length;

    while (i < len) {
      array[i++] = this.readFloat32();
    }

    return array;
  }

}

exports.CTMStringStream = CTMStringStream;

class CTMFile {
  constructor(stream) {
    this.getReader = function () {
      let reader;

      switch (this.header.compressionMethod) {
        case CTM.CompressionMethod.RAW:
          reader = new ReaderRAW();
          break;

        case CTM.CompressionMethod.MG1:
          reader = new ReaderMG1();
          break;

        case CTM.CompressionMethod.MG2:
          reader = new ReaderMG2();
          break;
      }

      return reader;
    };

    this.load(stream);
  }

  load(stream) {
    this.header = new FileHeader(stream);
    this.body = new CTMFileBody(this.header);
    this.getReader().read(stream, this.body);
  }

}

exports.CTMFile = CTMFile;

/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1eb2");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("c37c");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));




/***/ })

/******/ });