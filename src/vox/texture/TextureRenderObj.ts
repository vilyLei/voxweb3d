/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ROTextureResourceT from '../../vox/render/ROTextureResource';
import * as ITextureRenderObjT from "../../vox/texture/ITextureRenderObj";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as TextureProxyT from "../../vox/texture/TextureProxy";

import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;
import ITextureRenderObj = ITextureRenderObjT.vox.texture.ITextureRenderObj;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;

export namespace vox
{
    export namespace texture
    {
        // texture render runtime object
        export class TextureRenderObj implements ITextureRenderObj
        {
            private static s_uid:number = 0;
            private static s_troMaps:Map<number, TextureRenderObj>[] = [new Map(),new Map(),new Map(),new Map(), new Map(),new Map(),new Map(),new Map()];
            private static s_freeTROList:TextureRenderObj[] = [];
            protected static s_unloacked:boolean = true;
            protected static s_preMid:number = -1;
            private m_uid:number = -1;
            protected m_mid:number = -1;
            protected m_texTotal:number = 0;
            // max texture amount: 8
            private m_gtexList:any[] = [null,null,null,null, null,null,null,null];
            protected m_targets:Uint16Array = new Uint16Array(8);
            protected m_texList:TextureProxy[] = null;
			// renderer context uid
            private m_rcuid:number = 0;
            private m_texRes:ROTextureResource = null;
            
            direct:boolean = true;
            private constructor(rcuid:number,texListHashId:number)
            {
                this.m_rcuid = rcuid;
                this.m_uid = TextureRenderObj.s_uid++;
                this.m_mid = texListHashId;
            }
            private __$setParam(rcuid:number,texListHashId:number):void
            {
                this.m_rcuid = rcuid;
                this.m_mid = texListHashId;
            }
            // get renderer context uid
            getRCUid():number
            {
                return this.m_rcuid;
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
                this.m_texRes = rc.Texture;
                let i:number = 0;
                if(this.direct)
                {
                    if(this.m_texTotal < 1 && ptexList.length > 0)
                    {
                        this.m_texList = ptexList;
                        let tex:TextureProxy;
                        while(i < shdTexTotal)
                        {
                            tex = ptexList[i];
                            tex.__$attachThis();
                            tex.upload( rc );
                            this.m_targets[i] = tex.getSamplerType();
                            this.m_gtexList[i] = this.m_texRes.getTextureBuffer(tex.getResUid());
                            this.m_texRes.__$attachRes(tex.getResUid());
                            i ++;
                        }

                        this.m_texTotal = i;                        
                    }
                    else
                    {
                        this.m_texTotal = 0;
                    }
                }
                else
                {
                    this.m_texTotal = shdTexTotal;
                }
                while(i < ptexList.length)
                {
                    ptexList[i].__$detachThis();
                }
            }
            // 注意: 移动端要注意这里的切换机制是符合移动端低带宽的特点
            run(rc:RenderProxy):void
            {
                if(this.m_texRes.unlocked && this.m_texRes.texMid != this.m_mid)
                {
                    this.m_texRes.texMid = this.m_mid;
                    let gl:any = rc.RContext;
                    let texI:number = gl.TEXTURE0;
                    if(this.direct)
                    {
                        for(let i:number = 0; i < this.m_texTotal; ++i)
                        {
                            gl.activeTexture(texI);
                            gl.bindTexture(this.m_targets[i], this.m_gtexList[i]);
                            texI++;
                        }
                    }
                    else
                    {
                        let list:TextureProxy[] = this.m_texList;
                        for(let i:number = 0; i < this.m_texTotal; ++i)
                        {
                            gl.activeTexture(texI);
                            list[i].__$use(rc);
                            texI++;
                        }
                    }
                }
            }
            getUid():number
            {
                return this.m_uid;
            }
            // 自身的引用计数器
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
                    for(let i:number = 0,len:number=this.m_texList.length; i < len; ++i)
                    {
                        this.m_texList[i].__$detachThis();
                        this.m_texRes.__$detachRes(this.m_texList[i].getResUid());
                        this.m_gtexList[i] = null;
                    }
                }
                this.m_texTotal = 0;
                this.m_texList = null;
                this.m_texRes = null;
            }
            toString():string
            {
                return "TextureRenderObj(uid = "+this.m_uid+", mid="+this.m_mid+")";
            }
            static Create(rc:RenderProxy,texList:TextureProxy[],shdTexTotal:number):TextureRenderObj
            {
                if(texList.length > 0 && shdTexTotal > 0)
                {
                    let key = 31;
                    let t:number = 0;
                    let direct:boolean = true;
                    while(t < shdTexTotal)
                    {
                        key = key * 131 + texList[t].getUid();
                        if(!texList[t].isDirect())
                        {
                            direct = false;
                        }
                        ++t;
                    }
                    let rtoMap:Map<number, TextureRenderObj> = TextureRenderObj.s_troMaps[rc.getUid()];
                    let tro:TextureRenderObj = null;
                    if(rtoMap.has(key))
                    {
                        tro = rtoMap.get(key);
                    }
                    else
                    {
                        if(TextureRenderObj.s_freeTROList.length < 1)
                        {
                            tro = new TextureRenderObj(rc.getUid(),key);
                            //console.log("TextureRenderObj::Create use a new tro.getMid(): "+tro.getMid());
                        }
                        else
                        {
                            tro = TextureRenderObj.s_freeTROList.pop();
                            //console.log("TextureRenderObj::Create use an old tro.getMid(): "+tro.getMid());
                        }
                        tro.collectTexList(rc,texList,shdTexTotal);
                        rtoMap.set(key, tro);
                    }
                    tro.__$setParam(rc.getUid(),key);
                    tro.direct = direct;
                    return tro;
                }
                return null;
            }
            private static Restore(tro:TextureRenderObj):void
            {
                if(tro.getMid() > -1)
                {
                    //console.log("TextureRenderObj::Restore tro.getMid(): "+tro.getMid());
                    TextureRenderObj.s_troMaps[tro.getRCUid()].delete(tro.getMid());
                    tro.__$setParam(0,0);
                    TextureRenderObj.s_freeTROList.push(tro);
                    tro.reset();
                }
            }
            
            static GetByMid(rcuid:number,uid:number):TextureRenderObj
            {
                return TextureRenderObj.s_troMaps[rcuid].get(uid);
            }
        }
        
        export class EmptyTexRenderObj implements ITextureRenderObj
        {
            constructor()
            {
            }
            run(rc:RenderProxy):void
            {
                rc.Texture.renderBegin();
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