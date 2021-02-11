/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/utils/MathConst";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as ImageTextureProxyT from "../../vox/texture/ImageTextureProxy";
import * as ImageCubeTextureProxyT from "../../vox/texture/ImageCubeTextureProxy";
import * as TextureStoreT from "../../vox/texture/TextureStore";

import MathConst = MathConstT.vox.utils.MathConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;
import ImageCubeTextureProxy = ImageCubeTextureProxyT.vox.texture.ImageCubeTextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;

export namespace vox
{
    export namespace texture
    {
        export class ImgResLoader
        {
            private m_url:string;  
            private m_img:any = new Image();
            private m_loaded:boolean = false;
            private m_texList:ImageTextureProxy[] = [];
            private m_mLvList:number[] = [];
            constructor(purl:string)
            {
                this.m_url = purl;
                var thisT:any = this;
                let img:any = this.m_img;
                this.m_img.onload = function(info:any):void
                {
                    let powBoo:boolean = MathConst.IsPowerOf2(img.width) && MathConst.IsPowerOf2(img.height);
                    if(!powBoo)
                    {
                        var canvas:any = document.createElement('canvas');
                        //document.body.appendChild(canvas);
                        canvas.width = MathConst.CalcNearestCeilPow2(img.width);
                        canvas.height = MathConst.CalcNearestCeilPow2(img.height);
                        if(canvas.width > 2048)
                        {
                            canvas.width = 2048;
                        }
                        if(canvas.height > 2048)
                        {
                            canvas.height = 2048;
                        }
                        //canvas.style.visibility = "hidden";
                        canvas.style.backgroundColor = "transparent";//transparent
                        canvas.style.left = '0px';
                        canvas.style.top = '0px';
                        canvas.style.position = 'absolute';
                        let ctx2d = canvas.getContext("2d");
                        //ctx2d.fillStyle = "rgba(255, 255, 255, 0.0)";
                        ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,canvas.width,canvas.height);
                        img = canvas;
                    }
                    //this.m_texWidth = MathConst.CalcNearestCeilPow2(pwidth);

                    

                    let i:number = 0;
                    let len:number = thisT.m_texList.length;
                    for(; i < len; ++i)
                    {
                        //trace("m_img size: "+m_img.width+","+m_img.height);
                        thisT.m_texList[i].setDataFromImage(img,thisT.m_mLvList[i]);
                        thisT.m_texList[i].name = thisT.m_img.src;
                    }
                }
                this.m_img.crossOrigin = "";
                //m_img.setAttribute('crossorigin', 'anonymous');
                this.m_img.src = this.m_url;
            }
            addTex(tex:ImageTextureProxy,mipLevel:number):void
            {
                this.m_texList.push(tex);
                this.m_mLvList.push(mipLevel);
            }
            getURL():string
            {
                return this.m_url;
            }
            getImage():any
            {
                return this.m_img;
            }
            getTexAt(i:number):ImageTextureProxy
            {
                return this.m_texList[i];
            }
            isLoaded():boolean
            {
                return this.m_loaded;
            }
            destroy():void
            {

            }
        }
        export class CubeImgResLoader
        {
            private m_urls:string[] = null;    
            private m_imgs:any[] = [];
            private m_loadedTotal:number = 0;
            private m_loaded:boolean = false;
            private m_texList:ImageCubeTextureProxy[] = [];
            private m_mLvList:number[] = [];
            constructor(purls:string[])
            {
                this.m_urls = purls;
                var thisT:any = this;
                let i:number = 0;
                let img:any = null;
                for(; i < 6; ++i)
                {
                    img = new Image();
                    img.onload = function(info:any):void
                    {
                        thisT.m_loadedTotal ++;
                        if(thisT.m_loadedTotal >= 6)
                        {
                            let i:number = 0;
                            for(i = 0; i < 6; ++i)
                            {
                                //trace("m_imgs["+i+"] size: "+m_imgs[i].width+","+m_imgs[i].height);
                                thisT.m_texList[0].setDataFromImageToFaceAt(i,thisT.m_imgs[i],thisT.m_mLvList[0]);
                            }
                            thisT.m_texList[0].name = thisT.m_imgs.src;
                        }
                    }
                    img.crossOrigin = "";
                    img.src = thisT.m_urls[i];
                    thisT.m_imgs.push(img);
                }            
            }
            addTex(tex:ImageCubeTextureProxy,mipLevel:number):void
            {
                this.m_texList.push(tex);
                this.m_mLvList.push(mipLevel);
            }
            getURLAt(i:number):string
            {
                return this.m_urls[0];
            }
            getTexAt(i:number):ImageCubeTextureProxy
            {
                return this.m_texList[i];
            }
            isLoaded():boolean
            {
                return this.m_loaded;
            }
            destroy():void
            {
                
            }
        }
        
        export class TexResLoader
        {
            private ___dict:Map<string,ImgResLoader> = new Map();
            private ___cubeDict:Map<string,CubeImgResLoader> = new Map();
            constructor()
            {
            }
        
            
            getImageTexByUrl(purl:string,mipLevel:number = 0):ImageTextureProxy
            {
                return this.getTexAndLoadImg(purl, mipLevel);
            }
            getTexAndLoadImg(purl:string,mipLevel:number = 0):ImageTextureProxy
            {
                if(purl == "")
                {
                    return null;
                }
                if(mipLevel < 0) mipLevel = 0;
                let t:ImgResLoader = this.___dict.get(purl);
                if(t == null)
                {
                    t = new ImgResLoader(purl);
                    this.___dict.set(purl,t);
                    let tex:ImageTextureProxy = TextureStore.CreateImageTex2D(1,1);
                    tex.name = purl;
                    t.addTex(tex,mipLevel);
                    return tex;
                }
                else
                {
                    return t.getTexAt(0);
                }
            }
            getCubeTexAndLoadImg(idns:string,purls:string[],mipLevel:number = 0):ImageCubeTextureProxy
            {
                if(idns == "" || purls == null || purls.length < 6)
                {
                    return null;
                }
                if(mipLevel < 0) mipLevel = 0;
                let t:CubeImgResLoader = this.___cubeDict.get(idns);
                if(t == null)
                {
                    t = new CubeImgResLoader(purls);
                    this.___cubeDict.set(idns, t);
                    let tex:ImageCubeTextureProxy = TextureStore.CreateImageCubeTex(8,8);
                    t.addTex(tex,mipLevel);
                    return tex;
                }
                else
                {
                    return t.getTexAt(0);
                }
            }
        }
    }
}