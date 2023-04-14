/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../render/RendererDevice";
import MathConst from "../../vox/math/MathConst";
import IRunnable from "../../vox/base/IRunnable";
import TextureConst from "../../vox/texture/TextureConst";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { ITextureBlock } from "../../vox/texture/ITextureBlock";
import { IImageTexture } from "../render/texture/IImageTexture";
import { IBytesTexture } from "../render/texture/IBytesTexture";
import { IImageCubeTexture } from "../render/texture/IImageCubeTexture";
import IRendererScene from "../scene/IRendererScene";


// function generateCanvasMipmapsAt(src: any) {
//     let width = src.width;
//     let height = src.height;
//     if (width >= 2 || height >= 2) {
//         width = width >= 2 ? ((width / 2) | 0) : 1;
//         height = height >= 2 ? ((height / 2) | 0) : 1;
//         return createImageCanvas(src, width, height).canvas;
//     }
//     return null;
// }
function createImageCanvas(img: any, pw: number, ph: number): {canvas: HTMLCanvasElement, ctx2d: CanvasRenderingContext2D} {
    var canvas = document.createElement('canvas');
    //document.body.appendChild(canvas);
    canvas.width = pw;
    canvas.height = ph;
    //console.log("createImageCanvas(). size: "+canvas.width+","+canvas.height);
    //canvas.style.visibility = "hidden";
    canvas.style.backgroundColor = "transparent";
    canvas.style.display = "block";
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    canvas.style.position = 'absolute';
    let ctx2d: any = canvas.getContext("2d");
    ctx2d.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    return { canvas: canvas, ctx2d: ctx2d };
}
function createImageCanvasAlphaOffset(img: any, pw: number, ph: number): {canvas: HTMLCanvasElement, ctx2d: CanvasRenderingContext2D} {
    var canvas = document.createElement('canvas');
    canvas.width = pw;
    canvas.height = ph;
    canvas.style.backgroundColor = "transparent";
    canvas.style.display = "block";
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    canvas.style.position = 'absolute';
    let ctx2d = canvas.getContext("2d");
    //ctx2d.globalAlpha = 1.0;
    ctx2d.globalCompositeOperation = "destination-atop";
    //ctx2d.globalCompositeOperation = "multiply";
    //ctx2d.globalCompositeOperation = "destination-over";
    //ctx2d.globalCompositeOperation = "lighter";
    ctx2d.fillStyle = "rgba(255, 255, 255, 1.0)";
    ctx2d.rect(0, 0, canvas.width, canvas.height);
    ctx2d.fill();
    //ctx2d.globalCompositeOperation = "copy";
    ctx2d.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    //ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,canvas.width,canvas.height);
    return { canvas: canvas, ctx2d: ctx2d };
}
class ImgResUnit {
    private m_url = "";
    private m_img: HTMLImageElement = null;
    private m_loaded = false;
    private m_mipLv = 0;

    texture: IImageTexture = null;
    bytesTex: IBytesTexture = null;
    powerOf2Fix = false;
    offsetTex: IImageTexture = null;
    premultipliedAlpha = true;
    constructor(purl: string, mipLv: number) {
        this.m_url = purl;
        this.m_mipLv = mipLv;
    }
    startLoad(): void {
        if (this.m_img == null) {
            // let selfT: ImgResUnit = this;

            this.m_img = new Image();            
            ///*
            this.m_img.onload = (evt: any): void => {
                this.m_loaded = true;
                this.buildTex();
            }
            this.m_img.addEventListener('error', (evt: any) => {
                if (this.m_url != "") {
                    console.error("load image url error: ", this.m_url);
                }
            });
            const request = new XMLHttpRequest();
            request.open("GET", this.m_url, true);
            request.responseType = "blob";
            request.onload = (e) => {
                let pwin: any = window;
                var imageUrl = (pwin.URL || pwin.webkitURL).createObjectURL(request.response);
                this.m_img.src = imageUrl;
                this.m_img.crossOrigin = "Anonymous";

            };
            request.onerror = e => {
                console.error("load error binary image buffer request.status: ", request.status, "url:" + this.m_url);
            };
            request.send(null);

        }
    }
    buildTex(): void {
        let img: any = this.m_img;
        if (img != null && this.m_loaded) {
            let tex = this.texture;
            let offsetTex = this.offsetTex;
            let bytesTex = this.bytesTex;
            let imgData: any = null;
            let powBoo = MathConst.IsPowerOf2(img.width) && MathConst.IsPowerOf2(img.height);
            let powerOf2Fix = this.powerOf2Fix;
            if (RendererDevice.IsWebGL1()) {
                powerOf2Fix = true;
            }
            if (!powBoo && powerOf2Fix) {
                let pwidth = MathConst.CalcCeilPowerOfTwo(img.width);
                let pheight = MathConst.CalcCeilPowerOfTwo(img.height);
                if (pwidth > RendererDevice.MAX_TEXTURE_SIZE) pwidth = RendererDevice.MAX_TEXTURE_SIZE;
                if (pheight > RendererDevice.MAX_TEXTURE_SIZE) pwidth = RendererDevice.MAX_TEXTURE_SIZE;
                console.log("image canvas size: " + pwidth + "," + pheight);
                let dobj = createImageCanvas(img, pwidth, pheight);
                let mipLv = this.m_mipLv;
                if (tex != null) {
                    tex.setDataFromImage(dobj.canvas, mipLv);
                    console.log("use a base canvas create a img tex.");
                    tex.name = this.m_url;
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
                    }
                    else {
                        //let t:number = Date.now();
                        console.log("use a base canvas and a blendCanvas create a bytes tex.");
                        imgData = dobj.ctx2d.getImageData(0, 0, dobj.canvas.width, dobj.canvas.height);
                        let dst = imgData.data;

                        let offsetObj = createImageCanvasAlphaOffset(img, pwidth, pheight);
                        imgData = offsetObj.ctx2d.getImageData(0, 0, offsetObj.canvas.width, offsetObj.canvas.height);
                        let sdata = imgData.data;
                        let i = 0, j = 0, k = 0;

                        for (; i < pheight; ++i) {
                            for (j = 0; j < pwidth; ++j) {
                                dst[k] += 255 - sdata[k];
                                dst[k + 1] += 255 - sdata[k + 1];
                                dst[k + 2] += 255 - sdata[k + 2];
                                //sdata[k + 3] = dst[k + 3];
                                k += 4;
                            }
                        }
                        //console.log("Loss time: "+(Date.now() - t));
                        bytesTex.setDataFromBytes(dst, mipLv, dobj.canvas.width, dobj.canvas.height);
                        bytesTex.name = this.m_img.src;
                    }
                }
            }
            else {
                if (tex != null) {
                    if (!this.powerOf2Fix) {
                        console.log("image img size: " + img.width + "," + img.height);
                    }
                    tex.setDataFromImage(img, this.m_mipLv);
                    tex.name = this.m_img.src;
                }
                else if (bytesTex != null) {

                    let pwidth = MathConst.CalcNearestCeilPow2(img.width);
                    let pheight = MathConst.CalcNearestCeilPow2(img.height);
                    if (pwidth > 2048) pwidth = 2048;
                    if (pheight > 2048) pwidth = 2048;

                    let dobj: any = createImageCanvas(img, pwidth, pheight);
                    let mipLv: number = this.m_mipLv;
                    imgData = dobj.ctx2d.getImageData(0, 0, dobj.canvas.width, dobj.canvas.height);
                    bytesTex.setDataFromBytes(imgData.data, mipLv, dobj.canvas.width, dobj.canvas.height);
                    bytesTex.name = this.m_img.src;
                }
            }
            this.m_loaded = true;
            //console.log("ImgResUnit:startLoad(), loaded m_url: "+selfT.m_url);
        }
    }
    getURL(): string {
        return this.m_url;
    }
    getImage(): any {
        return this.m_img;
    }
    isLoaded(): boolean {
        return this.m_loaded;
    }
    destroy(): void {
        //console.log("ImgResUnit:destroy(), remove a res m_url: "+this.m_url);
        this.m_loaded = false;
        this.m_url = "";
        this.texture = null;
        // cancel image load
        this.m_img.src = "";
        this.m_img = null;
    }
}

class CubeImgResLoader {
    private m_urls: string[] = null;
    private m_imgs: HTMLImageElement[] = [];
    private m_loadedTotal = 0;
    private m_loaded: boolean = false;
    private m_texList: IImageCubeTexture[] = [];
    private m_mLvList: number[] = [];
    constructor(purls: string[]) {
        this.m_urls = purls;
        var thisT: CubeImgResLoader = this;
        let i = 0;
        let img: HTMLImageElement = null;
        for (; i < 6; ++i) {
            img = new Image();
            img.onload = function (info: any): void {
                thisT.m_loadedTotal++;
                if (thisT.m_loadedTotal >= 6) {
                    let i: number = 0;
                    for (i = 0; i < 6; ++i) {
                        //trace("m_imgs["+i+"] size: "+m_imgs[i].width+","+m_imgs[i].height);
                        thisT.m_texList[0].setDataFromImageToFaceAt(i, thisT.m_imgs[i], thisT.m_mLvList[0]);
                    }
                    thisT.m_texList[0].name = img.src;
                }
            }
            // img.crossOrigin = "";
            img.crossOrigin = "Anonymous";
            img.src = thisT.m_urls[i];
            thisT.m_imgs.push(img);
        }
    }
    addTex(tex: IImageCubeTexture, mipLevel: number): void {
        this.m_texList.push(tex);
        this.m_mLvList.push(mipLevel);
    }
    getURLAt(i: number): string {
        return this.m_urls[0];
    }
    getTexAt(i: number): IImageCubeTexture {
        return this.m_texList[i];
    }
    isLoaded(): boolean {
        return this.m_loaded;
    }
    destroy(): void {
    }
}
export default class TextureResLoader implements IRunnable {

    private m_cubeDict: Map<string, CubeImgResLoader> = new Map();
    private m_resMap: Map<string, ImgResUnit> = new Map();
    private m_loadedList: ImgResUnit[] = [];
    private m_waitLoadList: ImgResUnit[] = [];
    private m_loadingList: ImgResUnit[] = [];
    private m_loadingQueueMaxLength: number = 5;
    private m_loadDelay: number = 17;
    private m_loadDelayTime: number = 17;
    private m_testDelay: number = 512;
    private m_testDelayTime: number = 512;
    private m_texBlock: ITextureBlock = null;

    constructor(rc:IRendererScene) {
        if(this.m_texBlock == null && rc != null) {
            this.m_texBlock = rc.textureBlock;
            if (this.m_texBlock != null) {
                this.m_texBlock.addTexLoader(this);
            }
        }
    }

    getTexByUrl(purl: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true, powerOf2Fix: boolean = false): IRenderTexture {
        let ptex = this.getImageTexByUrl(purl, 0, false, powerOf2Fix);
        ptex.premultiplyAlpha = preAlpha;
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    getBytesNoPremultipliedAlphaTexByUrl(purl: string, mipLevel: number = 0): IRenderTexture {
        if (purl == "") {
            return null;
        }
        if (mipLevel < 0) mipLevel = 0;
        let t: ImgResUnit = this.m_resMap.get(purl);
        if (t == null) {
            t = new ImgResUnit(purl, mipLevel);
            t.premultipliedAlpha = false;
            this.m_resMap.set(purl, t);
            let tex = this.m_texBlock.createBytesTex(1, 1);
            tex.name = purl;
            t.bytesTex = tex;
            this.m_waitLoadList.push(t);
            return tex;
        }
        else {
            if (t.bytesTex.isDestroyed()) {
                t.bytesTex = this.m_texBlock.createBytesTex(1, 1);
            }
            return t.bytesTex;
        }
    }
    getBytesTexByUrl(purl: string, mipLevel: number = 0): IRenderTexture {
        if (purl == "") {
            return null;
        }
        if (mipLevel < 0) mipLevel = 0;
        let t: ImgResUnit = this.m_resMap.get(purl);
        if (t == null) {
            t = new ImgResUnit(purl, mipLevel);
            this.m_resMap.set(purl, t);
            let tex = this.m_texBlock.createBytesTex(1, 1);
            tex.name = purl;
            t.bytesTex = tex;
            this.m_waitLoadList.push(t);
            return tex;
        }
        else {
            if (t.bytesTex.isDestroyed()) {
                t.bytesTex = this.m_texBlock.createBytesTex(1, 1);
            }
            return t.bytesTex;
        }
    }
    getImageOffsetTexByUrl(purl: string, mipLevel: number = 0): IRenderTexture {
        if (purl == "") {
            return null;
        }
        if (mipLevel < 0) mipLevel = 0;
        let t: ImgResUnit = this.m_resMap.get(purl);
        if (t != null) {
            return t.offsetTex;
        }
        return null;
    }
    getImageTexByUrl(purl: string, mipLevel: number = 0, offsetTexEnabled: boolean = false, powerOf2Fix: boolean = false): IRenderTexture {
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
            if (this.m_loadingList.length < 6) {
                this.m_loadingList.push(t);
                t.startLoad();
            }
            else {
                this.m_waitLoadList.push(t);
            }
            return tex;
        }
        else {
            if (t.texture.isDestroyed()) {
                t.texture = this.m_texBlock.createImageTex2D(1, 1, false);
            }
            return t.texture;
        }
    }

    getCubeTexAndLoadImg(idns: string, purls: string[], mipLevel: number = 0): IRenderTexture {
        if (idns == "" || purls == null || purls.length < 6) {
            return null;
        }
        if (mipLevel < 0) mipLevel = 0;
        let t: CubeImgResLoader = this.m_cubeDict.get(idns);
        if (t == null) {
            t = new CubeImgResLoader(purls);
            this.m_cubeDict.set(idns, t);
            let tex = this.m_texBlock.createImageCubeTex(8, 8);
            t.addTex(tex, mipLevel);
            return tex;
        }
        else {
            return t.getTexAt(0);
        }
    }
    private m_runFlag: number = 0;
    setRunFlag(flag: number): void {
        this.m_runFlag = flag;
    }
    getRunFlag(): number {
        return this.m_runFlag;
    }
    isRunning(): boolean {
        return true;
    }
    isStopped(): boolean {
        return false;
    }
    run(): void {
        let i = 0;
        let res: ImgResUnit = null;
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
            let waitingTotal: number = this.m_waitLoadList.length;
            if (waitingTotal > 0) {
                //console.log("TextureResLoader::run(), waitingTotal: "+waitingTotal);
                if (loatingTotal < this.m_loadingQueueMaxLength) {
                    i = loatingTotal;
                    for (; i < this.m_loadingQueueMaxLength; ++i) {
                        if (this.m_waitLoadList.length > 0) {
                            res = this.m_waitLoadList.pop();
                            this.m_loadingList.push(res);
                            res.startLoad();
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }

        --this.m_testDelay;
        if (this.m_testDelay < 1) {
            this.m_testDelay = this.m_testDelayTime;
            let tex: IRenderTexture = null;
            let len = this.m_loadedList.length;
            for (i = 0; i < len; ++i) {
                res = this.m_loadedList[i];
                tex = res.texture != null ? res.texture : res.bytesTex;
                if (tex.isDestroyed()) {
                    console.log("TextureResLoader::run(),remove a resource,url: ", res.getURL());
                    this.m_resMap.delete(res.getURL());
                    this.m_loadedList.splice(i, 1);
                    res.destroy();
                    --i;
                    --len;
                }
            }
        }
    }
    getWaitTotal(): number {
        return this.m_waitLoadList.length;
    }
    isLoadedAll(): boolean {
        return this.m_waitLoadList.length < 1;
    }
}