/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as TextureStoreT from "../../vox/texture/TextureStore";

import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;

export namespace vox
{
    export namespace texture
    {
        // 注意这里只会管理gpu相关的资源
        class TexUidGpuStore
        {
            private m_useidList:number[] = [];
            private m_removeidList:number[] = [];
            constructor()
            {
            }
            attachTexAt(index:number):void
            {
                if(index < this.m_useidList.length)
                {
                    ++this.m_useidList[index];
                }
                else
                {
                    let i:number = this.m_useidList.length;
                    for(; i <= index; ++i)
                    {
                        this.m_useidList.push(0);
                    }
                    ++this.m_useidList[index];
                }
                //console.log("TexUidGpuStore::attachTexAt() this.m_useidList["+index+"]: "+this.m_useidList[index]);
            }
            detachTexAt(index:number):void
            {
                --this.m_useidList[index];
                if(this.m_useidList[index] < 1)
                {
                    this.m_useidList[index] = 0;
                    //console.log("TexUidGpuStore::detachTexAt("+index+") tex useCount value is 0.");
                    this.m_removeidList.push(index);
                }
            }
            getAttachCountAt(index:number):number
            {
                if(index < this.m_useidList.length)
                {
                    return this.m_useidList[index];
                }
                return 0;
            }
            getAttachAllCount():number
            {
                let total:number = 0;
                let i:number = 0;
                let len:number = this.m_useidList.length;
                for(; i < len; ++i)
                {
                    if(this.m_useidList[i] > 0)
                    {
                        total += this.m_useidList[i];
                    }
                }
                return total;
            }
            private m_timeDelay:number = 11;
            disposeTest(rc:RenderProxy):void
            {
                --this.m_timeDelay;
                if(this.m_timeDelay < 1)
                {
                    this.m_timeDelay = 11;

                    if(this.m_removeidList.length > 0)
                    {
                        let list:number[] = this.m_removeidList;
                        let len:number = list.length;
                        let i:number = 0;
                        let puid:number = 0;
                        let tex:TextureProxy = null;
                        for(; i < 10; ++i)
                        {
                            if(len > 0)
                            {
                                puid = list.pop();
                                --len;
                                if(this.getAttachCountAt(puid) < 1)
                                {
                                    tex = TextureStore.GetTexByUid(puid);
                                    tex.__$disposeGpu(rc);
                                }
                            }
                            else
                            {
                                break;
                            }
                        }
                        //  let texUid:number = this.m_removeidList.pop();
                        //  if(this.getAttachCountAt(texUid) < 1)
                        //  {
                        //      console.log("TexUidGpuStore::disposeTest(), texUid: "+texUid);
                        //      let tex:TextureProxy = TextureStore.GetTexByUid(texUid);
                        //      tex.__$disposeGpu(rc);
                        //  }
                    }
                }
            }
        }
        //
        export interface ITextureRenderObj
        {
            run(rc:RenderProxy):void;
            getMid():number;
            __$attachThis():void;
            __$detachThis():void;
        }
        // texture render runtime object
        export class TextureRenderObj implements ITextureRenderObj
        {
            private static __s_uid:number = 0;
            private static ___troMap:Map<number, TextureRenderObj> = new Map();
            private static ___freeTROList:TextureRenderObj[] = [];
            protected static __s_unloacked:boolean = true;
            protected static __s_preMid:number = -1;
            private static __s_texUidStore:TexUidGpuStore = new TexUidGpuStore();
            private m_uid:number = -1;
            protected m_mid:number = -1;
            protected m_texTotal:number = 0;
            // max texture amount: 8
            private m_gtexList:any[] = [null,null,null,null, null,null,null,null];
            protected m_gtexIndexList:Uint16Array = new Uint16Array(8);
            protected m_texTargetList:Uint16Array = new Uint16Array(8);
            protected m_texList:TextureProxy[] = null;
            private constructor(texListHashId:number)
            {
                this.m_uid = TextureRenderObj.__s_uid++;
                this.m_mid = texListHashId;
            }
            private __$setMId(texListHashId:number):void
            {
                this.m_mid = texListHashId;
            }
            getMid():number
            {
                return this.m_mid;
            }
            getTexTotal():number
            {
                return this.m_texTotal;
            }
            
            protected collectTexList(rc:RenderProxy, ptexList:TextureProxy[],shdTexTotal:number):void
            {
                if(this.m_texTotal < 1 && ptexList.length > 0)
                {
                    this.m_texList = ptexList;
                    
                    let texI:number = rc.RContext.TEXTURE0;
                    this.m_texTotal = 0;
                    while(this.m_texTotal < shdTexTotal)
                    {
                        TextureRenderObj.__s_texUidStore.attachTexAt(ptexList[this.m_texTotal].getUid());
                        ptexList[this.m_texTotal].upload( rc );
                        this.m_texTargetList[this.m_texTotal] = ptexList[this.m_texTotal].getSamplerType();
                        
                        this.m_gtexIndexList[this.m_texTotal] = (texI + this.m_texTotal);
                        this.m_gtexList[this.m_texTotal] = ( ptexList[this.m_texTotal].__$gpuBuf());
                        this.m_texTotal ++;
                    }
                }
                else
                {
                    this.m_texTotal = 0;
                }
            }
            // 注意: 移动端要注意这里的切换机制是符合移动端低带宽的特点
            run(rc:RenderProxy):void
            {
                if(TextureRenderObj.__s_unloacked && TextureRenderObj.__s_preMid != this.m_mid)
                {
                    TextureRenderObj.__s_preMid = this.m_mid;
                    let gl:any = rc.RContext;
                    for(let i:number = 0; i < this.m_texTotal; ++i)
                    {
                        gl.activeTexture(this.m_gtexIndexList[i]);
                        gl.bindTexture(this.m_texTargetList[i], this.m_gtexList[i]);
                    }
                }
            }
            getUid():number
            {
                return this.m_uid;
            }
            private m_attachCount:number = 0;
            __$attachThis():void
            {
                ++this.m_attachCount;
            }
            __$detachThis():void
            {
                --this.m_attachCount;
                //console.log("TextureRenderObj::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                if(this.m_attachCount < 1)
                {
                    this.m_attachCount = 0;
                    //console.log("TextureRenderObj::__$detachThis() this.m_attachCount value is 0.");
                    TextureRenderObj.Restore(this);
                }
            }
            reset():void
            {
                if(this.m_texList != null)
                {
                    for(let i:number = 0; i < this.m_texTotal; ++i)
                    {
                        TextureRenderObj.__s_texUidStore.detachTexAt(this.m_texList[i].getUid());
                        this.m_gtexList[i] = null;
                    }
                }
                this.m_texTotal = 0;
                this.m_texList = null;
            }
            toString():string
            {
                return "TextureRenderObj(uid = "+this.m_uid+", mid="+this.m_mid+")";
            }
            static __$AttachTexAt(texUid:number):void
            {
                TextureRenderObj.__s_texUidStore.attachTexAt(texUid);
            }
            static __$DetachTexAt(texUid:number):void
            {
                TextureRenderObj.__s_texUidStore.detachTexAt(texUid);
            }
            static __$GetexAttachCountAt(texUid:number):number
            {
                return TextureRenderObj.__s_texUidStore.getAttachCountAt(texUid);
            }
            static GetTexAttachAllCount():number
            {
                return TextureRenderObj.__s_texUidStore.getAttachAllCount();
            }
            static RenderBegin(rc:RenderProxy):void
            {
                TextureRenderObj.__s_preMid = -1;
                TextureRenderObj.__s_texUidStore.disposeTest(rc);
            }
            static Create(rc:RenderProxy,texList:TextureProxy[],shdTexTotal:number):TextureRenderObj
            {
                if(texList.length > 0 && shdTexTotal > 0)
                {
                    let key = 31;
                    let t:number = 0;
                    while(t < shdTexTotal)
                    {
                        key = key * 131 + texList[t].getUid();
                        ++t;
                    }
                    let tro:TextureRenderObj = null;
                    if(TextureRenderObj.___troMap.has(key))
                    {
                        tro = TextureRenderObj.___troMap.get(key);
                    }
                    else
                    {
                        if(TextureRenderObj.___freeTROList.length < 1)
                        {
                            tro = new TextureRenderObj(key);
                            //console.log("TextureRenderObj::Create use a new tro.getMid(): "+tro.getMid());
                        }
                        else
                        {
                            tro = TextureRenderObj.___freeTROList.pop();
                            tro.__$setMId(key);
                            //console.log("TextureRenderObj::Create use an old tro.getMid(): "+tro.getMid());
                        }
                        tro.collectTexList(rc,texList,shdTexTotal);
                        TextureRenderObj.___troMap.set(key, tro);
                    }
                    return tro;
                }
            }
            private static Restore(tro:TextureRenderObj):void
            {
                if(tro.getMid() > -1)
                {
                    //console.log("TextureRenderObj::Restore tro.getMid(): "+tro.getMid());
                    TextureRenderObj.___troMap.delete(tro.getMid());
                    tro.__$setMId(-1);
                    TextureRenderObj.___freeTROList.push(tro);
                    tro.reset();
                }
            }
            
            static GetByMid(uid:number):TextureRenderObj
            {
                return TextureRenderObj.___troMap.get(uid);
            }
            static Unlock():void
            {
                TextureRenderObj.__s_unloacked = true;
            }
            static Lock():void
            {
                TextureRenderObj.__s_unloacked = false;
            }
        }
        
        export class EmptyTexRenderObj implements ITextureRenderObj
        {
            constructor()
            {
            }
            run(rc:RenderProxy):void
            {
                TextureRenderObj.RenderBegin(rc);
            }
            getMid():number
            {
                return 1;
            }
            __$attachThis():void
            {
            }
            __$detachThis():void
            {
            }
        }
    }
}