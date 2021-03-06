/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from '../../vox/utils/MathConst';
import * as ROTextureResourceT from '../../vox/render/ROTextureResource';
import * as ITextureRenderObjT from "../../vox/render/ITextureRenderObj";
import * as IRenderTextureT from "../../vox/render/IRenderTexture";

import MathConst = MathConstT.vox.utils.MathConst;
import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;
import ITextureRenderObj = ITextureRenderObjT.vox.render.ITextureRenderObj;
import IRenderTexture = IRenderTextureT.vox.render.IRenderTexture;

export namespace vox
{
    export namespace render
    {
        /**
         * renderer runtime texture resource object
         */
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
            private m_gtexList:any[] = null;
            protected m_samplers:Uint16Array = null;
            protected m_texList:IRenderTexture[] = null;
			// renderer context uid
            private m_rcuid:number = 0;
            private m_texRes:ROTextureResource = null;
            // 是否收集gpu数据直接使用，true表示需要收集
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
            /**
             * @returns return renderer context unique id
             */
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
            
            protected collectTexList(texRes:ROTextureResource, ptexList:IRenderTexture[],shdTexTotal:number):void
            {
                this.m_texRes = texRes;
                let i:number = 0;
                if(this.direct)
                {
                    if(this.m_texTotal < 1 && ptexList.length > 0)
                    {
                        let len:number = MathConst.GetNearestCeilPow2(ptexList.length);
                        this.m_samplers = new Uint16Array(len);
                        this.m_gtexList = new Array(len);
                        this.m_texList = ptexList;
                        let tex:IRenderTexture;
                        while(i < shdTexTotal)
                        {
                            tex = ptexList[i];
                            tex.__$attachThis();
                            tex.__$$upload( texRes );
                            this.m_samplers[i] = tex.getSampler();
                            this.m_gtexList[i] = this.m_texRes.getGpuBuffer(tex.getResUid());
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
            run():void
            {
                if(this.m_texRes.unlocked && this.m_texRes.texMid != this.m_mid)
                {
                    this.m_texRes.texMid = this.m_mid;
                    //console.log("this.m_mid: ",this.m_mid,this.m_uid);
                    let gl:any = this.m_texRes.getRC();
                    let texI:number = gl.TEXTURE0;
                    if(this.direct)
                    {
                        //console.log("this.m_gtexList: ",this.m_gtexList);
                        for(let i:number = 0; i < this.m_texTotal; ++i)
                        {
                            gl.activeTexture(texI++);
                            gl.bindTexture(this.m_samplers[i], this.m_gtexList[i]);
                        }
                    }
                    else
                    {
                        let list:IRenderTexture[] = this.m_texList;
                        for(let i:number = 0; i < this.m_texTotal; ++i)
                        {
                            gl.activeTexture(texI++);
                            list[i].__$$use(this.m_texRes);
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
            static Create(texRes:ROTextureResource,texList:IRenderTexture[],shdTexTotal:number):TextureRenderObj
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
                    let rtoMap:Map<number, TextureRenderObj> = TextureRenderObj.s_troMaps[texRes.getRCUid()];
                    let tro:TextureRenderObj = null;
                    if(rtoMap.has(key))
                    {
                        tro = rtoMap.get(key);
                    }
                    else
                    {
                        if(TextureRenderObj.s_freeTROList.length < 1)
                        {
                            tro = new TextureRenderObj(texRes.getRCUid(),key);
                            //console.log("TextureRenderObj::Create use a new tex mid: "+tro.getMid());
                        }
                        else
                        {
                            tro = TextureRenderObj.s_freeTROList.pop();
                            //console.log("TextureRenderObj::Create use an old tex mid: "+tro.getMid());
                        }
                        tro.collectTexList(texRes,texList,shdTexTotal);
                        rtoMap.set(key, tro);
                    }
                    tro.__$setParam(texRes.getRCUid(), key);
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
            private m_texRes:ROTextureResource = null;
            constructor(texRes:ROTextureResource)
            {
                this.m_texRes = texRes;
            }
            run():void
            {
                this.m_texRes.renderBegin();
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