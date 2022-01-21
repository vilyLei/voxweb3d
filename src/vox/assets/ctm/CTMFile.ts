/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// thanks for threejs ctm module

import { LZMA } from "./LZMA";

class InterleavedStream {

    data: Uint8Array = null;// = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    offset: number;// = CTM.isLittleEndian? 3: 0;
    count: number;// = count * 4;
    len: number;// = this.data.length;
    constructor(data: any, count: number) {

        this.data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        this.offset = CTM.isLittleEndian ? 3 : 0;
        this.count = count * 4;
        this.len = this.data.length;
    }
    writeByte(value: number): void {
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

    fileFormat: number;// = stream.readInt32();
    compressionMethod: number;// = stream.readInt32();
    vertexCount: number;// = stream.readInt32();
    triangleCount: number;// = stream.readInt32();
    uvMapCount: number;// = stream.readInt32();
    attrMapCount: number;// = stream.readInt32();
    flags: number;// = stream.readInt32();
    comment: string;// = stream.readString();

    constructor(stream: any) {

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
    hasNormals(): number {
        return this.flags & CTM.Flags.NORMALS;
    };
}
class FileMG2Header {

    vertexPrecision: number;// = stream.readFloat32();
    normalPrecision: number;// = stream.readFloat32();
    lowerBoundx: number;// = stream.readFloat32();
    lowerBoundy: number;// = stream.readFloat32();
    lowerBoundz: number;// = stream.readFloat32();
    higherBoundx: number;// = stream.readFloat32();
    higherBoundy: number;// = stream.readFloat32();
    higherBoundz: number;// = stream.readFloat32();
    divx: number;// = stream.readInt32();
    divy: number;// = stream.readInt32();
    divz: number;// = stream.readInt32();

    sizex: number;// = (this.higherBoundx - this.lowerBoundx) / this.divx;
    sizey: number;// = (this.higherBoundy - this.lowerBoundy) / this.divy;
    sizez: number;// = (this.higherBoundz - this.lowerBoundz) / this.divz;

    constructor(stream: any) {

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
    indices: Uint32Array;
    vertices: Float32Array;
    normals: Float32Array;
    uvMaps: any[];
    attrMaps: any[];
    constructor(header: any) {
        var i = header.triangleCount * 3,
            v = header.vertexCount * 3,
            n = header.hasNormals() ? header.vertexCount * 3 : 0,
            u = header.vertexCount * 2,
            a = header.vertexCount * 4,
            j = 0;

        var data = new ArrayBuffer(
            (i + v + n + (u * header.uvMapCount) + (a * header.attrMapCount)) * 4);

        this.indices = new Uint32Array(data, 0, i);

        this.vertices = new Float32Array(data, i * 4, v);

        if (header.hasNormals()) {
            this.normals = new Float32Array(data, (i + v) * 4, n);
        }

        if (header.uvMapCount) {
            this.uvMaps = [];
            for (j = 0; j < header.uvMapCount; ++j) {
                this.uvMaps[j] = {
                    uv: new Float32Array(data,
                        (i + v + n + (j * u)) * 4, u)
                };
            }
        }

        if (header.attrMapCount) {
            this.attrMaps = [];
            for (j = 0; j < header.attrMapCount; ++j) {
                this.attrMaps[j] = {
                    attr: new Float32Array(data,
                        (i + v + n + (u * header.uvMapCount) + (j * a)) * 4, a)
                };
            }
        }
    }
}
class CTM {

    static CompressionMethod = {
        RAW: 0x00574152,
        MG1: 0x0031474d,
        MG2: 0x0032474d
    };
    static Flags = {
        NORMALS: 0x00000001
    }
    static isLittleEndian(): boolean {
        var buffer = new ArrayBuffer(2),
            bytes = new Uint8Array(buffer),
            ints = new Uint16Array(buffer);

        bytes[0] = 1;

        return ints[0] === 1;
    }

    static InterleavedStream(data: any, count: number): InterleavedStream {
        return new InterleavedStream(data, count);
    }
    static restoreIndices(indices: any, len: number): void {
        var i = 3;
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
    static calcSmoothNormals(indices: Uint16Array | Uint32Array, vertices: Float32Array): Float32Array {
        let smooth = new Float32Array(vertices.length),
            indx, indy, indz, nx, ny, nz,
            v1x, v1y, v1z, v2x, v2y, v2z, len,
            i, k;

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
            len = Math.sqrt(smooth[i] * smooth[i] +
                smooth[i + 1] * smooth[i + 1] +
                smooth[i + 2] * smooth[i + 2]);

            if (len > 1e-10) {
                smooth[i] /= len;
                smooth[i + 1] /= len;
                smooth[i + 2] /= len;
            }
        }

        return smooth;
    }
    static restoreVertices(vertices: Float32Array, grid: any, gridIndices: Uint16Array | Uint32Array, precision: any): void {
        var gridIdx, delta, x, y, z,
            intVertices = new Uint32Array(vertices.buffer, vertices.byteOffset, vertices.length),
            ydiv = grid.divx, zdiv = ydiv * grid.divy,
            prevGridIdx = 0x7fffffff, prevDelta = 0,
            i = 0, j = 0, len = gridIndices.length;

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

            vertices[j] = grid.lowerBoundx +
                x * grid.sizex + precision * delta;
            vertices[j + 1] = grid.lowerBoundy +
                y * grid.sizey + precision * intVertices[j + 1];
            vertices[j + 2] = grid.lowerBoundz +
                z * grid.sizez + precision * intVertices[j + 2];

            prevGridIdx = gridIdx;
            prevDelta = delta;
        }
    }
    static restoreGridIndices(gridIndices: Uint16Array | Uint32Array, len: number): void {
        var i = 1;
        for (; i < len; ++i) {
            gridIndices[i] += gridIndices[i - 1];
        }
    }
    static restoreNormals(normals: Float32Array, smooth: Float32Array, precision: number): void {
        var ro, phi, theta, sinPhi,
            nx, ny, nz, by, bz, len,
            intNormals = new Uint32Array(normals.buffer, normals.byteOffset, normals.length),
            i = 0, k = normals.length,
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
                    theta = ((intNormals[i + 2] * 4 / phi) - 2) * PI_DIV_2;
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

                normals[i] = smooth[i] * nz +
                    (smooth[i + 1] * bz - smooth[i + 2] * by) * ny - bz * nx;
                normals[i + 1] = smooth[i + 1] * nz -
                    (smooth[i + 2] + smooth[i]) * bz * ny + by * nx;
                normals[i + 2] = smooth[i + 2] * nz +
                    (smooth[i] * by + smooth[i + 1] * bz) * ny + bz * nx;
            }
        }
    }

    static restoreMap(map: any, count: number, precision: number): void {
        var delta, value,
            intMap = new Uint32Array(map.buffer, map.byteOffset, map.length),
            i = 0, j, len = map.length;

        for (; i < count; ++i) {
            delta = 0;

            for (j = i; j < len; j += count) {
                value = intMap[j];

                delta += value & 1 ? -((value + 1) >> 1) : value >> 1;

                map[j] = delta * precision;
            }
        }
    }

}

class ReaderRAW {

    constructor() { }

    readAttrMaps(stream: any, attrMaps: any): void {
        var i = 0;
        for (; i < attrMaps.length; ++i) {
            stream.readInt32(); //magic "ATTR"

            attrMaps[i].name = stream.readString();
            stream.readArrayFloat32(attrMaps[i].attr);
        }
    }
    readUVMaps(stream: any, uvMaps: any): void {
        var i = 0;
        for (; i < uvMaps.length; ++i) {
            stream.readInt32(); //magic "TEXC"

            uvMaps[i].name = stream.readString();
            uvMaps[i].filename = stream.readString();
            stream.readArrayFloat32(uvMaps[i].uv);
        }
    }
    readNormals(stream: any, normals: any): void {
        stream.readInt32(); //magic "NORM"
        stream.readArrayFloat32(normals);
    };
    readVertices(stream: any, vertices: any): void {
        stream.readInt32(); //magic "VERT"
        stream.readArrayFloat32(vertices);
    }
    readIndices(stream: any, indices: any): void {
        stream.readInt32(); //magic "INDX"
        stream.readArrayInt32(indices);
    }
    read(stream: any, body: any): void {
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
    constructor() { }

    read(stream: any, body: any): void {
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

    readIndices(stream: any, indices: any): void {
        stream.readInt32(); //magic "INDX"
        stream.readInt32(); //packed size

        var interleaved = CTM.InterleavedStream(indices, 3);
        LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

        CTM.restoreIndices(indices, indices.length);
    }

    readVertices(stream: any, vertices: any): void {
        stream.readInt32(); //magic "VERT"
        stream.readInt32(); //packed size

        var interleaved = CTM.InterleavedStream(vertices, 1);
        LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    }

    readNormals(stream: any, normals: any): void {
        stream.readInt32(); //magic "NORM"
        stream.readInt32(); //packed size

        var interleaved = CTM.InterleavedStream(normals, 3);
        LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    }

    readUVMaps(stream: any, uvMaps: any): void {
        var i = 0;
        for (; i < uvMaps.length; ++i) {
            stream.readInt32(); //magic "TEXC"

            uvMaps[i].name = stream.readString();
            uvMaps[i].filename = stream.readString();

            stream.readInt32(); //packed size

            var interleaved = CTM.InterleavedStream(uvMaps[i].uv, 2);
            LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
        }
    }

    readAttrMaps(stream: any, attrMaps: any): void {
        var i = 0;
        for (; i < attrMaps.length; ++i) {
            stream.readInt32(); //magic "ATTR"

            attrMaps[i].name = stream.readString();

            stream.readInt32(); //packed size

            var interleaved = CTM.InterleavedStream(attrMaps[i].attr, 4);
            LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
        }
    }
}

class ReaderMG2 {
    MG2Header: any;
    constructor() {

    }

    read(stream: any, body: any): void {
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
    };

    readVertices(stream: any, vertices: any): void {
        stream.readInt32(); //magic "VERT"
        stream.readInt32(); //packed size

        var interleaved = new InterleavedStream(vertices, 3);
        LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

        var gridIndices = this.readGridIndices(stream, vertices);

        CTM.restoreVertices(vertices, this.MG2Header, gridIndices, this.MG2Header.vertexPrecision);
    };

    readGridIndices(stream: any, vertices: any) {
        stream.readInt32(); //magic "GIDX"
        stream.readInt32(); //packed size

        var gridIndices = new Uint32Array(vertices.length / 3);

        var interleaved = new InterleavedStream(gridIndices, 1);
        LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

        CTM.restoreGridIndices(gridIndices, gridIndices.length);

        return gridIndices;
    };

    readIndices(stream: any, indices: any): void {
        stream.readInt32(); //magic "INDX"
        stream.readInt32(); //packed size

        var interleaved = new InterleavedStream(indices, 3);
        LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

        CTM.restoreIndices(indices, indices.length);
    };

    readNormals(stream: any, body: any): void {
        stream.readInt32(); //magic "NORM"
        stream.readInt32(); //packed size

        var interleaved = new InterleavedStream(body.normals, 3);
        LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

        var smooth = CTM.calcSmoothNormals(body.indices, body.vertices);

        CTM.restoreNormals(body.normals, smooth, this.MG2Header.normalPrecision);
    };

    readUVMaps(stream: any, uvMaps: any): void {
        var i = 0;
        for (; i < uvMaps.length; ++i) {
            stream.readInt32(); //magic "TEXC"

            uvMaps[i].name = stream.readString();
            uvMaps[i].filename = stream.readString();

            var precision = stream.readFloat32();

            stream.readInt32(); //packed size

            var interleaved = new InterleavedStream(uvMaps[i].uv, 2);
            LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

            CTM.restoreMap(uvMaps[i].uv, 2, precision);
        }
    };

    readAttrMaps(stream: any, attrMaps: any): void {
        var i = 0;
        for (; i < attrMaps.length; ++i) {
            stream.readInt32(); //magic "ATTR"

            attrMaps[i].name = stream.readString();

            var precision = stream.readFloat32();

            stream.readInt32(); //packed size

            var interleaved = new InterleavedStream(attrMaps[i].attr, 4);
            LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

            CTM.restoreMap(attrMaps[i].attr, 4, precision);
        }
    }
}

class CTMStream {

    TWO_POW_MINUS23 = Math.pow(2, -23);
    TWO_POW_MINUS126 = Math.pow(2, -126);
    data: any = null;
    offset: number = 0;
    constructor(data: any) {
        this.data = data;
        this.offset = 0;
    }

    readByte(): number {
        return this.data.charCodeAt(this.offset++) & 0xff;
    };

    readInt32(): number {
        var i = this.readByte();
        i |= this.readByte() << 8;
        i |= this.readByte() << 16;
        return i | (this.readByte() << 24);
    };

    readFloat32(): number {
        var m = this.readByte();
        m += this.readByte() << 8;

        var b1 = this.readByte();
        var b2 = this.readByte();

        m += (b1 & 0x7f) << 16;
        var e = ((b2 & 0x7f) << 1) | ((b1 & 0x80) >>> 7);
        var s = b2 & 0x80 ? -1 : 1;

        if (e === 255) {
            return m !== 0 ? NaN : s * Infinity;
        }
        if (e > 0) {
            return s * (1 + (m * this.TWO_POW_MINUS23)) * Math.pow(2, e - 127);
        }
        if (m !== 0) {
            return s * m * this.TWO_POW_MINUS126;
        }
        return s * 0;
    };

    readString(): string {
        var len = this.readInt32();

        this.offset += len;

        return this.data.substr(this.offset - len, len);
    };

    readArrayInt32(array: any): void {
        var i = 0, len = array.length;

        while (i < len) {
            array[i++] = this.readInt32();
        }

        return array;
    };

    readArrayFloat32(array: any): void {
        var i = 0, len = array.length;

        while (i < len) {
            array[i++] = this.readFloat32();
        }

        return array;
    }

}

class CTMFile {
    header: FileHeader;
    body: CTMFileBody;
    constructor(stream: any) {
        this.load(stream);
    };

    load(stream: any) {
        this.header = new FileHeader(stream);

        this.body = new CTMFileBody(this.header);

        this.getReader().read(stream, this.body);
    };

    getReader = function () {
        var reader;

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
}


export { CTMStream, CTMFileBody, CTMFile }