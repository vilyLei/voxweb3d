
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import TextureConst from "../vox/texture/TextureConst";
import FloatTextureProxy from "../vox/texture/FloatTextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import FloatTexMaterial from "./material/FloatTexMaterial";
import HDRRGBETexMaterial from "./material/HDRRGBETexMaterial";
import ILoaderListerner from "../vox/assets/ILoaderListerner";
import BinaryLoader from "../vox/assets/BinaryLoader";

import { RGBE, RGBEParser } from '../vox/assets/RGBEParser.js';
import BytesTextureProxy from "../vox/texture/BytesTextureProxy";
import MouseEvent from "../vox/event/MouseEvent";
import DivLog from "../vox/utils/DivLog";
import RCExtension from "../vox/render/RCExtension";
import UfloatFromBytesMaterial from "./material/UfloatFromBytesMaterial";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
export class DemoFloatTex implements ILoaderListerner {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    private createFloatTex(size: number = 32, mipmap: boolean = false): IRenderTexture {

        let posTex = this.m_rscene.textureBlock.createFloatTex2D(size, size, false);
        posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        posTex.mipmapEnabled = !mipmap;
        if (RendererDevice.IsWebGL2()) {
            posTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            posTex.magFilter = TextureConst.LINEAR;
        }
        else {
            //posTex.minFilter = TextureConst.NEAREST;
            posTex.minFilter = TextureConst.NEAREST_MIPMAP_NEAREST;
            //posTex.minFilter = TextureConst.NEAREST_MIPMAP_LINEAR;
            //posTex.minFilter = TextureConst.LINEAR_MIPMAP_NEAREST;
            posTex.magFilter = TextureConst.NEAREST;
        }

        let texSize: number = size;
        let total: number = Math.log2(size) + 1;
        let i: number = 0;
        while (i < total) {
            console.log("texSize: ", texSize);
            let fs: Float32Array = new Float32Array(texSize * texSize * 4);
            fs.fill(1.0);
            for (let r: number = 0; r < texSize; ++r) {
                for (let c: number = 0; c < texSize; ++c) {
                    let k: number = (r * texSize + c) * 4;
                    fs[k + 0] = i / total;
                    fs[k + 1] = r / texSize;
                    fs[k + 2] = 0.0;
                }
            }
            posTex.setDataFromBytes(fs, i, texSize, texSize, 0,0,false);
            texSize = texSize >> 1;
            i++;
        }

        return posTex;
    }

    private createFloatTexByBytes(fs: Float32Array, pw: number, ph: number): IRenderTexture {

        let posTex = this.m_rscene.textureBlock.createFloatTex2D(pw, ph, false);
        posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        //posTex.mipmapEnabled = false;
        posTex.minFilter = TextureConst.NEAREST;
        posTex.magFilter = TextureConst.NEAREST;

        posTex.setDataFromBytes(fs, 0, pw, ph, 0,0,false);
        return posTex;
    }
    private createByteTexByBytes(bytes: Uint8Array, pw: number, ph: number): IRenderTexture {

        let posTex = this.m_rscene.textureBlock.createBytesTex(pw, ph);
        posTex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        //posTex.mipmapEnabled = false;
        posTex.minFilter = TextureConst.NEAREST;
        posTex.magFilter = TextureConst.NEAREST;

        posTex.setDataFromBytes(bytes, 0, pw, ph, 0,0,false);
        return posTex;
    }
    // 2.12 34 56
    // 2  12 34 56
    private ufloat32To4Bytes(f: number, i: number = 0, bytes: Uint8Array = null): Uint8Array {
        //console.log("ufloat32To4Bytes, f: ",f);

        //let bytes: Uint8Array = new Uint8Array(4);
        if (bytes == null) {
            bytes = new Uint8Array(4);
        }
        bytes[i] = Math.floor(f);
        let k = (f - Math.floor(f)) * 100.0;
        bytes[i + 1] = Math.floor(k);
        k = (k - Math.floor(k)) * 100.0;
        bytes[i + 2] = Math.floor(k);
        k = (k - Math.floor(k)) * 100.0;
        bytes[i + 3] = Math.floor(k);
        //console.log("ufloat32To4Bytes, bytes: ",bytes);
        return bytes;
    }
    private bytesToUfloat32(bytes: Uint8Array): number {
        //console.log("bytesToUfloat32, bytes: ",bytes);
        let f: number = bytes[0] + bytes[1] * (1e-2) + bytes[2] * (1e-4) + bytes[3] * (1e-6);
        console.log("bytesToUfloat32, f: ", f);
        return f;
    }
    initialize(): void {
        console.log("DemoFloatTex::initialize()......");
        if (this.m_rcontext == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            //  this.bytesToUfloat32(this.ufloat32To4Bytes(2.123456));
            //  console.log(">>>>>>>>>>>>>>>>>>>");
            //  this.bytesToUfloat32(this.ufloat32To4Bytes(1.427496));

            //DivLog.SetDebugEnabled( true );
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(500.0, 500.0, 500.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext() as any;

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_rscene.enableMouseEvent(true);
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.m_statusDisp.initialize();

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(500.0);
            this.m_rscene.addEntity(axis);

            this.initHdrBrnTex();
            //this.initFloatTex();
            //this.initFloatTexEntity();
            //this.initHdrRGBEFloatTexEntity();
            //this.initHdrFloatTexEntity();
        }
    }
    private initFloatTexEntity(): void {

        let tex = this.createFloatTex(32, true);
        let material: FloatTexMaterial = new FloatTexMaterial();
        material.setTextureList([tex]);

        var plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(material);

        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [tex]);
        this.m_rscene.addEntity(plane);
    }
    private initFloatTex(): void {

        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "float_tex_dif";
        loader.load("static/bytes/dif.mdf", this);
        //  loader.uuid = "float_tex_spe";
        //  loader.load("static/bytes/spe.mdf", this);
    }
    private initHdrBrnTex(): void {

        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "hdrBrn";
        //loader.load("static/bytes/spe.hdrBrn", this);
        loader.load("static/bytes/dif.hdrBrn", this);
    }
    private initHdrRGBEFloatTexEntity(): void {

        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "rgbe_hdr";
        loader.load("static/assets/hdr/night_free_Env_512x256.hdr", this);
    }
    private initHdrFloatTexEntity(): void {

        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "float_hdr";
        loader.load("static/assets/hdr/floatHdr.hdr", this);
    }
    private m_hdrRGBEMaterial: HDRRGBETexMaterial = null;
    private mouseDown(evt: any): void {
        if (this.m_hdrRGBEMaterial != null) {
            let exposure: number = evt.mouseX / 200.0;
            this.m_hdrRGBEMaterial.setExposure(exposure);
        }
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded... uuid: ", uuid, buffer.byteLength);

        if (uuid == "rgbe_hdr") {
            this.initRGBE(buffer);
        }
        else if (uuid == "float_hdr") {
            this.initFloat(buffer);
        } else if (uuid == "float_tex_spe") {
            //this.initFloatTexDisp(buffer);
            this.initFloatToBytesDisp(buffer, 128);
        }  else if (uuid == "float_tex_dif") {
            //this.initFloatTexDisp(buffer);
            this.initFloatToBytesDisp(buffer, 1);
        } else if (uuid == "hdrBrn") {
            this.initHdrBrnDisp(buffer);
        }
    }

    private initHdrBrnDisp(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let size: number = 0;
        let currBytes: Uint8Array = new Uint8Array(buffer);
        //console.log("initHdrBrnDisp currBytes: ", currBytes);

        let bytes: Uint8Array = currBytes.subarray(32);
        let data16: Uint16Array = new Uint16Array(buffer);
        let width: number = data16[4];
        let height: number = data16[5];
        let mipMapMaxLv: number = data16[6];
        let subArr: Uint8Array = null;
        console.log("initHdrBrnDisp mipMapMaxLv: ", mipMapMaxLv,data16);
        //console.log("initHdrBrnDisp bytes: ", bytes);
        //new UfloatFromBytesMaterial
        let bytesTex = this.m_rscene.textureBlock.createBytesTex(width, height);

        for (let j: number = 0; j < mipMapMaxLv; j++) {
            for (let i: number = 0; i < 6; i++) {
                size = width * height * 4;
                //  if(width < 0 || j != 1 || i != 1) {
                if (width < 0 || i != 1) {
                    begin += size;
                    continue;
                }
                subArr = bytes.slice(begin, begin + size);
                //console.log("width: ",width, "subArr.length: ",subArr.length);
                bytesTex.setDataFromBytes(subArr, j, width, width, 0,0,false);

                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
        if(mipMapMaxLv > 1) {
            bytesTex.mipmapEnabled = false;
            bytesTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            bytesTex.magFilter = TextureConst.LINEAR;
        }

        let ufmaterial: UfloatFromBytesMaterial = new UfloatFromBytesMaterial();
        ufmaterial.setTextureList([bytesTex]);

        let plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(ufmaterial);
        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [bytesTex]);
        this.m_rscene.addEntity(plane);
    }
    private saveHdrBrnData(src_size: number, srcFS32: Float32Array, componentTotal: number = 3, maxLV: number = 128): void {

        let mipMapMaxLv: number = Math.log2(src_size) + 1;
        if(maxLV < mipMapMaxLv) mipMapMaxLv = maxLV;
        console.log("saveHdrBrnData mipMapMaxLv: ",mipMapMaxLv);
        let width: number = src_size;
        let height: number = src_size;
        let src_begin: number = 0;
        let dst_begin: number = 0;
        let subArr: Float32Array = null;
        let size: number = 0;
        for (let j: number = 0; j < mipMapMaxLv; j++) {
            for (let i: number = 0; i < 6; i++) {
                size += width * height * 4;
            }
            width >>= 1;
            height >>= 1;
        }

        width = src_size;
        height = src_size;
        let currBytes: Uint8Array = new Uint8Array(size + 32);
        let data16: Uint16Array = new Uint16Array(currBytes.buffer);
        data16[4] = src_size;
        data16[5] = src_size;
        data16[6] = mipMapMaxLv;

        let dstBytes: Uint8Array = currBytes.subarray(32);

        for (let j: number = 0; j < mipMapMaxLv; j++) {
            for (let i: number = 0; i < 6; i++) {
                size = width * height * componentTotal;
                subArr = srcFS32.slice(src_begin, src_begin + size);
                src_begin += size;

                size = width * height * 4;
                let dst = dstBytes.subarray(dst_begin, dst_begin + size);
                dst_begin += size;
                let total: number = width * height;

                for (let k: number = 0; k < total; ++k) {
                    this.ufloat32To4Bytes(subArr[k * componentTotal], k * 4, dst);
                }
            }
            width >>= 1;
            height >>= 1;
        }
        //this.initHdrBrnDisp(currBytes.buffer);
        this.downloadBinFile2( currBytes, "dif" );
    }
    private initFloatToBytesDisp(buffer: ArrayBuffer, maxLV: number): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);

        this.saveHdrBrnData(width, fs32, 3, maxLV);
        return;
        let subArr: Float32Array = null;

        let bytesTex = this.m_rscene.textureBlock.createBytesTex(width, height);
        bytesTex.mipmapEnabled = false;

        for (let j: number = 0; j < 8; j++) {
            for (let i: number = 0; i < 6; i++) {
                const size = width * height * 3;
                //  if(width < 0 || j != 1 || i != 1) {
                if (width < 0 || i != 1) {
                    begin += size;
                    continue;
                }
                subArr = fs32.slice(begin, begin + size);

                let dstArr = new Uint8Array(width * height * 4);
                let total: number = width * height;

                for (let k: number = 0; k < total; ++k) {
                    this.ufloat32To4Bytes(subArr[k * 3], k * 4, dstArr);
                }

                bytesTex.setDataFromBytes(dstArr, j, width, width, 0,0,false);

                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }

        bytesTex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        bytesTex.magFilter = TextureConst.LINEAR;

        let ufmaterial: UfloatFromBytesMaterial = new UfloatFromBytesMaterial();
        ufmaterial.setTextureList([bytesTex]);

        let plane: Plane3DEntity = new Plane3DEntity();
        //plane.setMaterial(material);
        plane.setMaterial(ufmaterial);
        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [bytesTex]);
        this.m_rscene.addEntity(plane);
    }
    private initFloatTexDisp(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;

        //Math.log2(height);
        console.log("Math.log2(height): ", Math.log2(height));

        let tex = this.m_rscene.textureBlock.createFloatTex2D(width, height, false);
        tex.toRGBFormat();
        tex.mipmapEnabled = false;
        for (let j: number = 0; j < 8; j++) {
            for (let i: number = 0; i < 6; i++) {
                const size = width * height * 3;
                //  if(width < 0 || j != 1 || i != 1) {
                if (width < 0 || i != 1) {
                    begin += size;
                    continue;
                }
                subArr = fs32.slice(begin, begin + size);
                /*
                let dstArr = new Float32Array(width * height * 4);
                let total: number = width * height;

                for(let k: number = 0; k < total; ++k) {
                    let p: number = k * 4;
                    let t: number = k * 3;
                    dstArr[p] = subArr[t];
                    dstArr[p+1] = subArr[t+1];
                    dstArr[p+2] = subArr[t+2];
                    dstArr[p+3] = 1.0;
                }
                subArr = dstArr;
                //*/
                //console.log(j,"width: ", width,subArr);
                tex.setDataFromBytes(subArr, j, width, width, 0, 0,false);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }

        DivLog.ShowLog("EXT_shader_texture_lod!=null: " + (RCExtension.EXT_shader_texture_lod != null));
        DivLog.ShowLog("OES_texture_float_linear!=null: " + (RCExtension.OES_texture_float_linear != null));
        if (RendererDevice.IsWebGL2()) {
            tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
            tex.magFilter = TextureConst.LINEAR;
        }
        else {
            tex.minFilter = TextureConst.NEAREST;
            tex.magFilter = TextureConst.NEAREST;
        }
        //  tex.minFilter = TextureConst.NEAREST;
        //  tex.magFilter = TextureConst.NEAREST;

        let material: FloatTexMaterial = new FloatTexMaterial();
        material.setTextureList([tex]);

        let plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(material);
        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [tex]);
        this.m_rscene.addEntity(plane);
    }
    private initRGBE(buffer: ArrayBuffer): void {

        let parser: RGBEParser = new RGBEParser();
        let rgbe: RGBE = parser.parse(buffer);
        console.log("parse rgbeData: ", rgbe);

        let ftex = this.createByteTexByBytes(rgbe.data as Uint8Array, rgbe.width, rgbe.height);

        this.m_hdrRGBEMaterial = new HDRRGBETexMaterial();
        this.m_hdrRGBEMaterial.setTextureList([ftex]);
        // add common 3d display entity
        var plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(this.m_hdrRGBEMaterial);
        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [ftex]);
        this.m_rscene.addEntity(plane);
    }
    private initFloat(buffer: ArrayBuffer): void {

        let tex = this.createFloatTex();
        let material: FloatTexMaterial = new FloatTexMaterial();
        material.setTextureList([tex]);

        var plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(material);

        plane.initializeXOZ(0.0, 0.0, 200.0, 150.0, [tex]);
        this.m_rscene.addEntity(plane);
    }
    loadError(status: number, uuid: string): void {

    }
    run(): void {
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);
        // show fps status
        this.m_statusDisp.update();

        this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
        this.m_rscene.run(true);

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
    private downloadBinFile2(binData: any, file_name: string): void {
        var downloadBlob: any, downloadURL: any;
        console.log("downloadBinFile2, binData: ", binData);
        downloadBlob = function (data: any, fileName: string, mimeType: any) {
            var blob: Blob, url: string;
            blob = new Blob([data], {
                type: mimeType
            });
            url = window.URL.createObjectURL(blob);
            downloadURL(url, fileName);
            setTimeout(function () {
                return window.URL.revokeObjectURL(url);
            }, 1000);
        };

        downloadURL = function (data: any, fileName: string): void {
            var a: any;
            a = document.createElement('a');
            a.href = data;
            a.download = fileName;
            document.body.appendChild(a);
            a.style = 'display: none';
            a.click();
            a.remove();
        }

        //  var samplerData = new Int8Array(128);
        //  for(let i:number = 0; i < samplerData.length; ++i) {
        //      samplerData[i] = i;
        //  }
        downloadBlob(binData, file_name + '.hdrBrn', 'application/octet-stream');
    }
}
export default DemoFloatTex;
