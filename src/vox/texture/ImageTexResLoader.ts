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
        class ImgResUnit
        {
            private m_url:string = "";
            private m_img:any = null;
            private m_loaded:boolean = false;
            private m_mipLv:number = 0;
            texture:ImageTextureProxy = null;
            constructor(purl:string,mipLv:number)
            {
                this.m_url = purl;
                this.m_mipLv = mipLv;
            }
            startLoad():void
            {
                if(this.m_img == null)
                {
                    let thisT:any = this;
                    this.m_img = new Image();
                    //console.log("ImgResUnit:startLoad(), start load m_url: "+this.m_url);
                    this.m_img.onload = function(info:any):void
                    {
                        thisT.texture.uploadFromImage(thisT.m_img,thisT.m_mipLv);
                        thisT.texture.name = thisT.m_img.src;
                        thisT.m_loaded = true;
                        //console.log("ImgResUnit:startLoad(), loaded m_url: "+thisT.m_url);
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
        
            getTexByUrl(purl:string,mipLevel:number = 0):ImageTextureProxy
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

                --this.m_testDelay;
                if(this.m_testDelay < 1)
                {
                    this.m_testDelay = this.m_testDelayTime;
                    let tex:TextureProxy = null;
                    let len:number = this.m_loadedList.length;
                    for(i = 0; i < len; ++i)
                    {
                        res = this.m_loadedList[i];
                        tex = res.texture;
                        if(!tex.isGpuEnabled() && TextureStore.__$GetexAttachCountAt(tex.getUid()) == 1)
                        {
                            TextureStore.__$DetachTexAt(tex.getUid());
                            this.m_resMap.delete(res.getURL());
                            this.m_loadedList.splice(i,1);
                            res.destroy();
                            --i;
                            --len;
                        }
                    }
                }
            }
        }
    }
}