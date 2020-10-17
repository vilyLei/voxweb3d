/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as ImageTextureProxyT from "../../vox/texture/ImageTextureProxy";
import * as CubeTextureProxyT from "../../vox/texture/CubeTextureProxy";
import * as TextureStoreT from "../../vox/texture/TextureStore";

import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;
import CubeTextureProxy = CubeTextureProxyT.vox.texture.CubeTextureProxy;
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
                this.m_img.onload = function(info:any):void
                {
                    let i:number = 0;
                    let len:number = thisT.m_texList.length;
                    for(; i < len; ++i)
                    {
                        //trace("m_img size: "+m_img.width+","+m_img.height);
                        thisT.m_texList[i].uploadFromImage(thisT.m_img,thisT.m_mLvList[i]);
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
            private m_texList:CubeTextureProxy[] = [];
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
                                thisT.m_texList[0].uploadFromImageCubeFaceAt(i,thisT.m_imgs[i],thisT.m_mLvList[0]);
                            }
                            thisT.m_texList[0].name = thisT.m_imgs.src;
                        }
                    }
                    img.crossOrigin = "";
                    img.src = thisT.m_urls[i];
                    thisT.m_imgs.push(img);
                }            
            }
            addTex(tex:CubeTextureProxy,mipLevel:number):void
            {
                this.m_texList.push(tex);
                this.m_mLvList.push(mipLevel);
            }
            getURLAt(i:number):string
            {
                return this.m_urls[0];
            }
            getTexAt(i:number):CubeTextureProxy
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
        
            getTexAndLoadImg(purl:string,mipLevel:number = 0):TextureProxy
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
                    let tex:ImageTextureProxy = TextureStore.CreateImageTex2D(1,1);//new TextureProxy(1,1);
                    TextureStore.__$AttachTexAt(tex.getUid());
                    tex.name = purl;
                    t.addTex(tex,mipLevel);
                    return tex;
                }
                else
                {
                    return t.getTexAt(0);
                }
            }
            getCubeTexAndLoadImg(idns:string,purls:string[],mipLevel:number = 0):CubeTextureProxy
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
                    let tex:CubeTextureProxy = TextureStore.CreateCubeTex(8,8);//new CubeTextureProxy(1,1);
                    TextureStore.__$AttachTexAt(tex.getUid());
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