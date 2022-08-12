// thanks for threejs lamz module

import { ICTMRStream } from "./ICTMRStream";
import { ICTMWStream } from "./ICTMWStream";
import { IDecoder } from "./IDecoder";

class OutWindow {
    _pos: number = 0;
    _streamPos: number = 0;
    _windowSize: number = 0;
    _stream: ICTMWStream;
    _buffer: number[];
    constructor() {
    }

    create(windowSize: number): void {
        if ((!this._buffer) || (this._windowSize !== windowSize)) {
            this._buffer = [];
        }
        this._windowSize = windowSize;
        this._pos = 0;
        this._streamPos = 0;
    }

    flush(): void {
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

    releaseStream(): void {
        this.flush();
        this._stream = null;
    }

    setStream(stream: ICTMWStream): void {
        this.releaseStream();
        this._stream = stream;
    }

    init(solid: boolean): void {
        if (!solid) {
            this._streamPos = 0;
            this._pos = 0;
        }
    }

    copyBlock(distance: number, len: number): void {
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

    putByte(b: number): void {
        this._buffer[this._pos++] = b;
        if (this._pos >= this._windowSize) {
            this.flush();
        }
    }

    getByte(distance: number): number {
        var pos = this._pos - distance - 1;
        if (pos < 0) {
            pos += this._windowSize;
        }
        return this._buffer[pos];
    }

}

class RangeDecoder implements IDecoder {
    _stream: ICTMRStream;
    _code: number = 0;
    _range: number = -1;
    constructor() {

    }

    setStream(stream: ICTMRStream): void {
        this._stream = stream;
    }

    releaseStream(): void {
        this._stream = null;
    }

    init(): void {
        var i = 5;

        this._code = 0;
        this._range = -1;

        while (i--) {
            this._code = (this._code << 8) | this._stream.readByte();
        }
    };

    decodeDirectBits(numTotalBits: number): number {
        var result = 0, i = numTotalBits, t;

        while (i--) {
			// >>> 零填充右位移
            this._range >>>= 1;
            t = (this._code - this._range) >>> 31;
            this._code -= this._range & (t - 1);
            result = (result << 1) | (1 - t);

            if ((this._range & 0xff000000) === 0) {
                this._code = (this._code << 8) | this._stream.readByte();
                this._range <<= 8;
            }
        }

        return result;
    };

    decodeBit(probs: number[], index: number): number {
        var prob = probs[index],
            newBound = (this._range >>> 11) * prob;

        if ((this._code ^ 0x80000000) < (newBound ^ 0x80000000)) {
            this._range = newBound;
            probs[index] += (2048 - prob) >>> 5;
            if ((this._range & 0xff000000) === 0) {
                this._code = (this._code << 8) | this._stream.readByte();
                this._range <<= 8;
            }
            return 0;
        }

        this._range -= newBound;
        this._code -= newBound;
        probs[index] -= prob >>> 5;
        if ((this._range & 0xff000000) === 0) {
            this._code = (this._code << 8) | this._stream.readByte();
            this._range <<= 8;
        }
        return 1;
    }
}

class BitTreeDecoder implements IDecoder {

    _models: number[] = [];
    _numBitLevels: number = 0;
    constructor(numBitLevels: number) {
        this._models = [];
        this._numBitLevels = numBitLevels;
    };

    init(): void {
        LZMA.initBitModels(this._models, 1 << this._numBitLevels);
    };

    decode(rangeDecoder: RangeDecoder): number {
        var m = 1, i = this._numBitLevels;

        while (i--) {
            m = (m << 1) | rangeDecoder.decodeBit(this._models, m);
        }
        return m - (1 << this._numBitLevels);
    };

    reverseDecode(rangeDecoder: RangeDecoder): number {
        var m = 1, symbol = 0, i = 0, bit;

        for (; i < this._numBitLevels; ++i) {
            bit = rangeDecoder.decodeBit(this._models, m);
            m = (m << 1) | bit;
            symbol |= bit << i;
        }
        return symbol;
    }
}
class LenDecoder implements IDecoder {

    _choice: number[] = [];
    _lowCoder: BitTreeDecoder[] = [];
    _midCoder: BitTreeDecoder[] = [];
    _highCoder: BitTreeDecoder = new BitTreeDecoder(8);
    _numPosStates: number = 0;
    constructor() {
    }

    create(numPosStates: number): void {
        for (; this._numPosStates < numPosStates; ++this._numPosStates) {
            this._lowCoder[this._numPosStates] = new BitTreeDecoder(3);
            this._midCoder[this._numPosStates] = new BitTreeDecoder(3);
        }
    };

    init(): void {
        let i = this._numPosStates;
        LZMA.initBitModels(this._choice, 2);
        while (i--) {
            this._lowCoder[i].init();
            this._midCoder[i].init();
        }
        this._highCoder.init();
    };

    decode(rangeDecoder: RangeDecoder, posState: number): number {

        if (rangeDecoder.decodeBit(this._choice, 0) === 0) {
            return this._lowCoder[posState].decode(rangeDecoder);
        }
        if (rangeDecoder.decodeBit(this._choice, 1) === 0) {
            return 8 + this._midCoder[posState].decode(rangeDecoder);
        }
        return 16 + this._highCoder.decode(rangeDecoder);
    }
}
class Decoder2 implements IDecoder {

    _decoders: number[] = [];
    constructor() { }

    init() {
        LZMA.initBitModels(this._decoders, 0x300);
    };

    decodeNormal(rangeDecoder: RangeDecoder): number {
        let symbol = 1;

        do {
            symbol = (symbol << 1) | rangeDecoder.decodeBit(this._decoders, symbol);
        } while (symbol < 0x100);

        return symbol & 0xff;
    };

    decodeWithMatchByte(rangeDecoder: RangeDecoder, matchByte: number): number {
        let symbol = 1, matchBit, bit;

        do {
            matchBit = (matchByte >> 7) & 1;
            matchByte <<= 1;
            bit = rangeDecoder.decodeBit(this._decoders, ((1 + matchBit) << 8) + symbol);
            symbol = (symbol << 1) | bit;
            if (matchBit !== bit) {
                while (symbol < 0x100) {
                    symbol = (symbol << 1) | rangeDecoder.decodeBit(this._decoders, symbol);
                }
                break;
            }
        } while (symbol < 0x100);

        return symbol & 0xff;
    }

}
class LiteralDecoder {
    _coders: Decoder2[] = null;
    _numPosBits: number;
    _posMask: number;
    _numPrevBits: number;
    create(numPosBits: number, numPrevBits: number): void {
        var i;

        if (this._coders
            && (this._numPrevBits === numPrevBits)
            && (this._numPosBits === numPosBits)) {
            return;
        }
        this._numPosBits = numPosBits;
        this._posMask = (1 << numPosBits) - 1;
        this._numPrevBits = numPrevBits;

        this._coders = [];

        i = 1 << (this._numPrevBits + this._numPosBits);
        while (i--) {
            this._coders[i] = new Decoder2();
        }
    };

    init(): void {
        var i = 1 << (this._numPrevBits + this._numPosBits);
        while (i--) {
            this._coders[i].init();
        }
    };

    getDecoder(pos: number, prevByte: number): Decoder2 {
        return this._coders[((pos & this._posMask) << this._numPrevBits)
            + ((prevByte & 0xff) >>> (8 - this._numPrevBits))];
    };
}

class Decoder implements IDecoder {

    _outWindow = new OutWindow();
    _rangeDecoder = new RangeDecoder();
    _isMatchDecoders: number[] = [];
    _isRepDecoders: number[] = [];
    _isRepG0Decoders: number[] = [];
    _isRepG1Decoders: number[] = [];
    _isRepG2Decoders: number[] = [];
    _isRep0LongDecoders: number[] = [];
    _posSlotDecoder: BitTreeDecoder[] = [];
    _posDecoders: number[] = [];
    _posAlignDecoder = new BitTreeDecoder(4);
    _lenDecoder = new LenDecoder();
    _repLenDecoder = new LenDecoder();
    _literalDecoder = new LiteralDecoder();
    _dictionarySize = -1;
    _dictionarySizeCheck = -1;
    _posStateMask = 0;

    constructor() {

        this._posSlotDecoder[0] = new BitTreeDecoder(6);
        this._posSlotDecoder[1] = new BitTreeDecoder(6);
        this._posSlotDecoder[2] = new BitTreeDecoder(6);
        this._posSlotDecoder[3] = new BitTreeDecoder(6);
    }

    setDictionarySize(dictionarySize: number): boolean {
        if (dictionarySize < 0) {
            return false;
        }
        if (this._dictionarySize !== dictionarySize) {
            this._dictionarySize = dictionarySize;
            this._dictionarySizeCheck = Math.max(this._dictionarySize, 1);
            this._outWindow.create(Math.max(this._dictionarySizeCheck, 4096));
        }
        return true;
    };

    setLcLpPb(lc: number, lp: number, pb: number): boolean {
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

    init(): void {
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

    decode(inStream: ICTMRStream, outStream: ICTMWStream, outSize: number): boolean {
        var state = 0, rep0 = 0, rep1 = 0, rep2 = 0, rep3 = 0, nowPos64 = 0, prevByte = 0,
            posState, decoder2, len, distance, posSlot, numDirectBits;

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
                        rep0 = (2 | (posSlot & 1)) << numDirectBits;

                        if (posSlot < 14) {
                            rep0 += LZMA.reverseDecode2(this._posDecoders,
                                rep0 - posSlot - 1, this._rangeDecoder, numDirectBits);
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

    setDecoderProperties(properties: ICTMRStream): boolean {

        let value, lc, lp, pb, dictionarySize;

        // if (properties.size < 5) {
        //     return false;
        // }

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
    };
}
class LZMA {
    uuid: string = "LZMA";
    constructor() {
    }
    static initBitModels(probs: number[], len: number) {
        while (len--) {
            probs[len] = 1024;
        }
    }
    static reverseDecode2(models: number[], startIndex: number, rangeDecoder: RangeDecoder, numBitLevels: number): number {
        var m = 1, symbol = 0, i = 0, bit;

        for (; i < numBitLevels; ++i) {
            bit = rangeDecoder.decodeBit(models, startIndex + m);
            m = (m << 1) | bit;
            symbol |= bit << i;
        }
        return symbol;
    }
    static decompress(properties: ICTMRStream, inStream: ICTMRStream, outStream: ICTMWStream, outSize: number): boolean{
        var decoder = new Decoder();
        if ( !decoder.setDecoderProperties(properties) ){
          throw "Incorrect stream properties";
        }
        if ( !decoder.decode(inStream, outStream, outSize) ){
          throw "Error in data stream";
        }
        return true;
      };

}
export { LZMA }
