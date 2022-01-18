/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import BytesCubeTextureProxy from "../texture/BytesCubeTextureProxy";
import BytesTextureProxy from "../texture/BytesTextureProxy";
import FloatCubeTextureProxy from "../texture/FloatCubeTextureProxy";
import FloatTextureProxy from "../texture/FloatTextureProxy";
import { TextureProxyType } from "../texture/TextureProxyType";
import TextureProxy from "../texture/TextureProxy";
import BinaryLoader from "./BinaryLoader";

export default class DDSLoader {
    
    uuid: string = "DDSLoader";
    texture: TextureProxy = null;
    constructor() {
    }

    async load(url: string, headRange: string = "") {
        let binLoadr: BinaryLoader = new BinaryLoader();
        binLoadr.uuid = this.uuid;
        binLoadr.load(url, this);
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("DDSLoader loaded... uuid: ", uuid, buffer.byteLength);
        this.parseCubeFile(buffer);
    }
    loadError(status: number, uuid: string): void {
    }
    private parseCubeFile(buffer: ArrayBuffer): void {
        var header = new Uint32Array(buffer);

        let width: number = header[4];
        let height: number = header[3];
        let mips: number = Math.max(header[7], 1);
        let isFourCc: boolean = header[20] === 4;
        let fcc: number = header[21];
        let bpp: number = header[22];

        let fccDxt1: number = 827611204; // DXT1
        let fccDxt5: number = 894720068; // DXT5
        let fccFp32: number = 116; // RGBA32f

        var format: any = null;
        var compressed: boolean = false;
        var floating: boolean = false;
        if (isFourCc) {
            if (fcc === fccDxt1) {
                format = 'PIXELFORMAT_DXT1';
                compressed = true;
            } else if (fcc === fccDxt5) {
                format = 'PIXELFORMAT_DXT5';
                compressed = true;
            } else if (fcc === fccFp32) {
                format = 'PIXELFORMAT_RGBA32F';
                floating = true;
            }
        }
        else {
            if (bpp === 32) {
                format = 'PIXELFORMAT_R8_G8_B8_A8';
            }
        }
        ///*
        console.log("parse dds file begin.");
        console.log("isFourCc: ", isFourCc);
        console.log("compressed: ", compressed);
        console.log("format: ", format);
        console.log("floating: ", floating);
        console.log("bpp: ", bpp);
        console.log("fcc: ", fcc);
        //*/
        let headerSize: number = 128;
        let requiredMips: number = MathConst.GetMaxMipMapLevel(width, height);

        console.log('loadDDS', header[1], width, height, bpp, 'format:' + format, fcc, mips, requiredMips);

        // check for DX10 header
        if (fcc == 808540228) {
            let dx10Header: Uint32Array = new Uint32Array(buffer.slice(128, 128 + 20));
            headerSize = 128 + 20;
            console.log('loadDDS', 'DX10 Header found');
            format = dx10Header[0];
            let resourceDimension: number = dx10Header[1];
            let miscFlag: number = dx10Header[2];
            let arraySize: number = dx10Header[3];
            let miscFlags2: number = dx10Header[4];

            const D3D10_RESOURCE_DIMENSION_TEXTURE2D: number = 3;
            const DXGI_FORMAT_R32G32B32A32_FLOAT: number = 2;
            if (resourceDimension == D3D10_RESOURCE_DIMENSION_TEXTURE2D && format == DXGI_FORMAT_R32G32B32A32_FLOAT) {
                floating = true;
                format = 'PIXELFORMAT_RGBA32F';
            }
            console.log('loadDDS DX10', format, resourceDimension, miscFlag, arraySize, miscFlags2);
        }

        let cantLoad: boolean = !format || (mips !== requiredMips && compressed);
        console.log("cantLoad: ", cantLoad);
        console.log("floating: ", floating);
        console.log("requiredMips: ", requiredMips);
        if (cantLoad) {
            let errEnd: string = ". Empty texture will be created instead.";
            if (!format) {
                console.error("This DDS pixel format is currently unsupported" + errEnd);
            } else {
                console.error("DDS has " + mips + " mips, but engine requires " + requiredMips + " for DXT format. " + errEnd);
            }
            //return new TextureCube();
            throw Error("DDS file parse Error.");
        }

        //http://msdn.microsoft.com/en-us/library/windows/desktop/bb205577(v=vs.85).aspx
        if (this.texture != null) {

            let texType: number = this.texture.getType();

            let mipSize: number;
            for (let j: number = 0; j < 6; j++) {
                for (let i: number = 0; i < requiredMips; i++) {
                    let mipWidth: number = width / Math.pow(2, i);
                    let mipHeight: number = height / Math.pow(2, i);
                    if (mipWidth < 1) break;
                    bpp = floating ? 4 * 4 : 4;
                    mipSize = mipWidth * mipHeight * bpp;
                    let offset: number = headerSize;
                    if (i < mips) {
                        offset += width * height * bpp * (1 - Math.pow(0.25, i)) / (1 - 0.25);
                        offset += j * width * height * bpp * (1 - Math.pow(0.25, mips)) / (1 - 0.25);
                    }
                    //let texDataSize = mipWidth * mipHeight * 4;
                    let texData: Float32Array | Uint8Array = floating ? new Float32Array(buffer.slice(offset, offset + mipSize)) : new Uint8Array(buffer.slice(offset, offset + mipSize));
                    if (texType == TextureProxyType.FloatCube || TextureProxyType.BytesCube) {
                        if (floating) {
                            //console.log("float i: ",i,mipWidth,mipHeight,texData);
                            (this.texture as FloatCubeTextureProxy).setDataFromBytesToFaceAt(j, texData as Float32Array, mipWidth, mipHeight, i);
                        }
                        else {
                            (this.texture as BytesCubeTextureProxy).setDataFromBytesToFaceAt(j, texData as Uint8Array, mipWidth, mipHeight, i);
                        }
                    }
                    else if (texType == TextureProxyType.Float || TextureProxyType.Bytes) {
                        if (floating) {
                            //console.log("float i: ",i,mipWidth,mipHeight,texData);
                            (this.texture as FloatTextureProxy).setDataFromBytes(texData as Float32Array, mipWidth, mipHeight, i);
                        }
                        else {
                            (this.texture as BytesTextureProxy).setDataFromBytes(texData as Uint8Array, mipWidth, mipHeight, i);
                        }
                    }
                }
            }
        }
    }
}