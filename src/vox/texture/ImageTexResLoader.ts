/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/utils/MathConst";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as ImageTextureProxyT from "../../vox/texture/ImageTextureProxy";
import * as BytesTextureProxyT from "../../vox/texture/BytesTextureProxy";
import * as ImageCubeTextureProxyT from "../../vox/texture/ImageCubeTextureProxy";
import * as TextureStoreT from "../../vox/texture/TextureStore";

import MathConst = MathConstT.vox.utils.MathConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;
import BytesTextureProxy = BytesTextureProxyT.vox.texture.BytesTextureProxy;
import ImageCubeTextureProxy = ImageCubeTextureProxyT.vox.texture.ImageCubeTextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;

export namespace vox
{
    export namespace texture
    {
        function generateCanvasMipmapsAt(src:any)
        {
            let width = src.width;
            let height = src.height;
            if(width >= 2 || height >= 2)
            {
                width = width >= 2 ? ((width / 2) | 0) : 1;
                height = height >= 2 ? ((height / 2) | 0) : 1;                
                return createImageCanvas(src, width,height).canvas;
            }
            return null;
        }
        function createImageCanvas(img:any, pw:number,ph:number):any
        {
            var canvas:any = document.createElement('canvas');
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
            let ctx2d:any = canvas.getContext("2d");
            ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,canvas.width,canvas.height);
            return {canvas:canvas, ctx2d:ctx2d};
        }
        function createImageCanvasAlphaOffset(img:any, pw:number,ph:number):any
        {
            var canvas:any = document.createElement('canvas');
            //document.body.appendChild(canvas);
            canvas.width = pw;
            canvas.height = ph;
            //console.log("createImageCanvasAlphaOffset(). size: "+canvas.width+","+canvas.height);
            //canvas.style.visibility = "hidden";
            canvas.style.backgroundColor = "transparent";
            canvas.style.display = "block";
            canvas.style.left = '0px';
            canvas.style.top = '0px';
            canvas.style.position = 'absolute';
            let ctx2d:any = canvas.getContext("2d");
            //ctx2d.globalAlpha = 1.0;
            ctx2d.globalCompositeOperation = "destination-atop";
            //ctx2d.globalCompositeOperation = "multiply";
            //ctx2d.globalCompositeOperation = "destination-over";
            //ctx2d.globalCompositeOperation = "lighter";
            ctx2d.fillStyle = "rgba(255, 255, 255, 1.0)";
            ctx2d.rect(0, 0, canvas.width,canvas.height);
            ctx2d.fill();
            //ctx2d.globalCompositeOperation = "copy";
            ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,canvas.width,canvas.height);
            //ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,canvas.width,canvas.height);
            return {canvas:canvas, ctx2d:ctx2d};
        }
        class ImgResUnit
        {
            private m_url:string = "";
            private m_img:any = null;
            private m_loaded:boolean = false;
            private m_mipLv:number = 0;

            texture:ImageTextureProxy = null;
            bytesTex:BytesTextureProxy = null;
            //canvas:any = null;
            offsetTex:ImageTextureProxy = null;
            premultipliedAlpha:boolean = true;
            constructor(purl:string,mipLv:number)
            {
                this.m_url = purl;
                this.m_mipLv = mipLv;
            }
            startLoad():void
            {
                if(this.m_img == null)
                {
                    let selfT:ImgResUnit = this;
                    let tex:ImageTextureProxy = this.texture;
                    let offsetTex:ImageTextureProxy = this.offsetTex;
                    let bytesTex:BytesTextureProxy = this.bytesTex;

                    this.m_img = new Image();
                    let img:any = this.m_img;
                    let imgData:any = null;
                    //console.log("ImgResUnit:startLoad(), start load m_url: "+this.m_url);
                    this.m_img.onload = function(info:any):void
                    {
                        let powBoo:boolean = MathConst.IsPowerOf2(img.width) && MathConst.IsPowerOf2(img.height);
                        if(!powBoo)
                        {
                            let pwidth:number = MathConst.CalcNearestCeilPow2(img.width);                            
                            let pheight:number = MathConst.CalcNearestCeilPow2(img.height);
                            if(pwidth > 2048)pwidth = 2048;
                            if(pheight > 2048)pwidth = 2048;
                            console.log("image canvas size: "+pwidth+","+pheight);
                            let dobj:any = createImageCanvas(img, pwidth,pheight);
                            let mipLv:number = selfT.m_mipLv;
                            if(tex != null)
                            {
                                tex.uploadFromImage(dobj.canvas, mipLv);
                                console.log("use a base canvas create a img tex.");
                                //  let mipCanvas = generateCanvasMipmapsAt(canvas);
                                //  for(;mipCanvas != null;)
                                //  {
                                //      mipLv++;
                                //      tex.uploadFromImage(mipCanvas, mipLv);
                                //      mipCanvas = generateCanvasMipmapsAt(mipCanvas);
                                //  }
                                tex.name = selfT.m_img.src;
                                if(offsetTex != null)
                                {
                                    dobj = createImageCanvasAlphaOffset(img, pwidth,pheight);
                                    offsetTex.uploadFromImage(dobj.canvas, mipLv);
                                }
                            }
                            if(bytesTex != null)
                            {
                                if(selfT.premultipliedAlpha)
                                {
                                    console.log("use a base canvas create a bytes tex.");
                                    imgData = dobj.ctx2d.getImageData(0,0,dobj.canvas.width, dobj.canvas.height);
                                    bytesTex.uploadFromBytes(imgData.data, mipLv,dobj.canvas.width, dobj.canvas.height);
                                    bytesTex.name = selfT.m_img.src;
                                }
                                else
                                {
                                    //let t:number = Date.now();
                                    console.log("use a base canvas and a blendCanvas create a bytes tex.");
                                    imgData = dobj.ctx2d.getImageData(0,0,dobj.canvas.width, dobj.canvas.height);
                                    let dst:any = imgData.data;
                                    
                                    let offsetObj:any = createImageCanvasAlphaOffset(img, pwidth,pheight);
                                    imgData = offsetObj.ctx2d.getImageData(0,0,offsetObj.canvas.width, offsetObj.canvas.height);
                                    let sdata:any = imgData.data;
                                    let i:number = 0,j:number = 0, k:number = 0;

                                    for(; i < pheight; ++i)
                                    {
                                        for(j = 0; j < pwidth; ++j)
                                        {
                                            dst[k] += 255 - sdata[k];
                                            dst[k+1] += 255 - sdata[k+1];
                                            dst[k+2] += 255 - sdata[k+2];
                                            //sdata[k + 3] = dst[k + 3];
                                            k += 4;
                                        }
                                    }
                                    //console.log("Loss time: "+(Date.now() - t));
                                    bytesTex.uploadFromBytes(dst, mipLv,dobj.canvas.width, dobj.canvas.height);
                                    bytesTex.name = selfT.m_img.src;
                                }
                            }
                        }
                        else
                        {
                            if(tex != null)
                            {
                                tex.uploadFromImage(img,selfT.m_mipLv);                                
                                tex.name = selfT.m_img.src;
                            }
                            else if(bytesTex != null)
                            {
                                let pwidth:number = MathConst.CalcNearestCeilPow2(img.width);                            
                                let pheight:number = MathConst.CalcNearestCeilPow2(img.height);
                                if(pwidth > 2048)pwidth = 2048;
                                if(pheight > 2048)pwidth = 2048;

                                let dobj:any = createImageCanvas(img, pwidth,pheight);
                                let mipLv:number = selfT.m_mipLv;
                                imgData = dobj.ctx2d.getImageData(0,0,dobj.canvas.width, dobj.canvas.height);
                                bytesTex.uploadFromBytes(imgData.data, mipLv,dobj.canvas.width, dobj.canvas.height);
                                bytesTex.name = selfT.m_img.src;
                            }
                        }
                        selfT.m_loaded = true;
                        //console.log("ImgResUnit:startLoad(), loaded m_url: "+selfT.m_url);
                    }
                    this.m_img.crossOrigin = "";
                    //m_img.setAttribute('crossorigin', 'anonymous');
                    this.m_img.src = this.m_url;
                }
            }
            getURL():string
            {
                return this.m_url;
            }
            getImage():any
            {
                return this.m_img;
            }
            isLoaded():boolean
            {
                return this.m_loaded;
            }
            destroy():void
            {
                //console.log("ImgResUnit:destroy(), remove a res m_url: "+this.m_url);
                this.m_url = "";
                this.texture = null;
                this.m_img.src = "";
                this.m_img = null;
            }
        }
        export class ImageTexResLoader
        {
            private m_resMap:Map<string,ImgResUnit> = new Map();
            private m_loadedList:ImgResUnit[] = [];
            private m_waitLoadList:ImgResUnit[] = [];
            private m_loadingList:ImgResUnit[] = [];
            private m_loadingQueueMaxLength:number = 5;
            private m_loadDelay:number = 17;
            private m_loadDelayTime:number = 17;
            private m_testDelay:number = 87;
            private m_testDelayTime:number = 87;
            constructor()
            {
            }
            
            getBytesNoPremultipliedAlphaTexByUrl(purl:string,mipLevel:number = 0):BytesTextureProxy
            {
                if(purl == "")
                {
                    return null;
                }
                if(mipLevel < 0) mipLevel = 0;
                let t:ImgResUnit = this.m_resMap.get(purl);
                if(t == null)
                {
                    t = new ImgResUnit(purl,mipLevel);
                    t.premultipliedAlpha = false;
                    this.m_resMap.set(purl,t);
                    let tex:BytesTextureProxy = TextureStore.CreateBytesTex(1,1);
                    TextureStore.__$AttachTex(tex);
                    tex.name = purl;
                    t.bytesTex = tex;
                    this.m_waitLoadList.push(t);
                    return tex;
                }
                else
                {
                    return t.bytesTex;
                }
            }
            getBytesTexByUrl(purl:string,mipLevel:number = 0):BytesTextureProxy
            {
                if(purl == "")
                {
                    return null;
                }
                if(mipLevel < 0) mipLevel = 0;
                let t:ImgResUnit = this.m_resMap.get(purl);
                if(t == null)
                {
                    t = new ImgResUnit(purl,mipLevel);
                    this.m_resMap.set(purl,t);
                    let tex:BytesTextureProxy = TextureStore.CreateBytesTex(1,1);
                    TextureStore.__$AttachTex(tex);
                    tex.name = purl;
                    t.bytesTex = tex;
                    this.m_waitLoadList.push(t);
                    return tex;
                }
                else
                {
                    return t.bytesTex;
                }
            }
            getImageOffsetTexByUrl(purl:string,mipLevel:number = 0):ImageTextureProxy
            {
                if(purl == "")
                {
                    return null;
                }
                if(mipLevel < 0) mipLevel = 0;
                let t:ImgResUnit = this.m_resMap.get(purl);
                if(t != null)
                {
                    return t.offsetTex;
                }
                return null;
            }
            getImageTexByUrl(purl:string,mipLevel:number = 0,offsetTexEnabled:boolean = false):ImageTextureProxy
            {
                if(purl == "")
                {
                    return null;
                }
                if(mipLevel < 0) mipLevel = 0;
                let t:ImgResUnit = this.m_resMap.get(purl);
                if(t == null)
                {
                    t = new ImgResUnit(purl,mipLevel);
                    if(offsetTexEnabled)
                    {
                        t.offsetTex = TextureStore.CreateImageTex2D(1,1);
                    }
                    this.m_resMap.set(purl,t);
                    let tex:ImageTextureProxy = TextureStore.CreateImageTex2D(1,1);
                    TextureStore.__$AttachTex(tex);
                    tex.name = purl;
                    t.texture = tex;
                    this.m_waitLoadList.push(t);
                    return tex;
                }
                else
                {
                    return t.texture;
                }
            }
            run():void
            {
                let i:number = 0;
                let res:ImgResUnit = null;
                --this.m_loadDelay;
                if(this.m_loadDelay < 1)
                {
                    this.m_loadDelay = this.m_loadDelayTime;
                    let loatingTotal:number = this.m_loadingList.length;
                    if(loatingTotal > 0)
                    {
                        for(; i < loatingTotal; ++i)
                        {
                            if( this.m_loadingList[i].isLoaded() )
                            {
                                this.m_loadedList.push( this.m_loadingList[i] );
                                this.m_loadingList.splice(i,1);
                                --i;
                                --loatingTotal;
                            }
                        }
                    }
                    let waitingTotal:number = this.m_waitLoadList.length;
                    if(waitingTotal > 0)
                    {
                        //console.log("ImageTexResLoader::run(), waitingTotal: "+waitingTotal);
                        if(loatingTotal < this.m_loadingQueueMaxLength)
                        {
                            i = loatingTotal;
                            for(; i < this.m_loadingQueueMaxLength; ++i)
                            {
                                if(this.m_waitLoadList.length > 0)
                                {
                                    res = this.m_waitLoadList.pop();
                                    this.m_loadingList.push(res);
                                    res.startLoad();
                                }
                                else
                                {
                                    break;
                                }
                            }
                        }
                    }
                }

                ////*
                --this.m_testDelay;
                if(this.m_testDelay < 1)
                {
                    this.m_testDelay = this.m_testDelayTime;
                    let tex:TextureProxy = null;
                    let len:number = this.m_loadedList.length;
                    for(i = 0; i < len; ++i)
                    {
                        res = this.m_loadedList[i];
                        tex = res.texture!=null?res.texture:res.bytesTex;
                        if(tex.getAttachCount() < 1)
                        {
                            console.log("ImageTexResLoader::run(),remove a resource,url: ",res.getURL());
                            this.m_resMap.delete(res.getURL());
                            this.m_loadedList.splice(i,1);
                            res.destroy();
                            --i;
                            --len;
                        }
                    }
                }
                //*/
            }
        }
    }
}