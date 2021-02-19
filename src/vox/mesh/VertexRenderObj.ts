/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ROVtxBufUidStoreT from "../../vox/mesh/ROVtxBufUidStore";

import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ROVtxBufUidStore = ROVtxBufUidStoreT.vox.mesh.ROVtxBufUidStore;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;

export namespace vox
{
    export namespace mesh
    {
        
        export interface IVertexRenderObj
        {
            run(rc:RenderProxy):void;
            getMid():number;
            __$attachThis():void;
            __$detachThis():void;
        }
        // vro
        export class VertexRenderObj implements IVertexRenderObj
        {
            private static s_uid:number = 0;
            private static s_preUid:number = -1;
            private static s_vtxUid:number = -1;
            private m_vtxUid:number = 0;
            private m_uid:number = 0;
            // vtx attribute hash map id
            private m_mid:number = 0;

            vbufs:any[] = null;
            vbuf:any = null;
            ibuf:any = null;
            /**
             * be used by the renderer runtime, the value is UNSIGNED_SHORT or UNSIGNED_INT.
             */
            ibufType:number = 0;
            /**
             * be used by the renderer runtime, the value is 2 or 4.
             */
            ibufStep:number = 2;
            vao:any = null;
            registers:number[] = null;
            wholeOffsetList:number[] = null;
            registersLen:number = 0;
            updateUnlocked:boolean = true;
            wholeStride:number = 0;
            // render used times
            
            private constructor(mid:number,pvtxUid:number)
            {
                this.m_mid = mid;
                this.m_vtxUid = pvtxUid;
                this.m_uid = VertexRenderObj.s_uid++;
                //ROVtxBufUidStore.GetInstance().__$attachAt(this.m_vtxUid);
            }
            
            private setMidAndBufUid(mid:number,pvtxUid:number):void
            {
                this.m_mid = mid;
                this.m_vtxUid = pvtxUid;
                this.m_attachCount = 0;
                //ROVtxBufUidStore.GetInstance().__$attachAt(pvtxUid);
            }
            getUid():number
            {
                return this.m_uid;
            }
            getVtxUid():number
            {
                return this.m_vtxUid;
            }
            getMid():number
            {
                return this.m_mid;
            }
            run(rc:RenderProxy):void
            {
                if(VertexRenderObj.s_preUid != this.m_uid)
                {
                    //if(this.srcBuf != null)this.srcBuf.__$updateToGpu(rc);
                    //console.log("VertexRenderObj::run(), this.m_uid: "+this.m_uid);
                    VertexRenderObj.s_preUid = this.m_uid;
                    //console.log("VertexRenderObj::run(), this.vao != null: "+(this.vao != null));
                    if(this.vao != null)
                    {
                        rc.bindVertexArray(this.vao);
                    }
                    else
                    {
                        if(this.vbuf != null)
                        {
                            rc.useVtxAttrisbPtrTypeFloat(this.vbuf, this.registers, this.wholeOffsetList,this.registersLen, this.wholeStride);
                        }
                        else
                        {
                            rc.useVtxAttrisbPtrTypeFloat2(this.vbufs, this.registers, this.wholeOffsetList,this.registersLen, this.wholeStride);
                        }
                    }
                    //console.log("VertexRenderObj::run(), ## this.m_vtxUid: "+this.m_vtxUid+", this.ibuf:"+this.ibuf);
                    if(VertexRenderObj.s_vtxUid != this.m_vtxUid)
                    {
                        VertexRenderObj.s_vtxUid = this.m_vtxUid;
                        rc.bindEleBuf(this.ibuf);
                    }
                }
            }
            private m_attachCount:number = 0;
            __$attachThis():void
            {
                if(this.m_attachCount < 1)
                {
                    ROVtxBufUidStore.GetInstance().__$attachAt(this.m_vtxUid);
                }
                ++this.m_attachCount;
            }
            __$detachThis():void
            {
                --this.m_attachCount;
                //console.log("VertexRenderObj::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                if(this.m_attachCount < 1)
                {
                    ROVtxBufUidStore.GetInstance().__$detachAt(this.m_vtxUid);
                    this.m_attachCount = 0;
                    console.log("VertexRenderObj::__$detachThis() this.m_attachCount value is 0.");
                    //VertexRenderObj.Restore(this);
                }
            }
            private __$destroy():void
            {
                console.log("VertexRenderObj::__$destroy()..., "+this);
                this.m_vtxUid = -1;
                this.vbufs = null;
                this.vbuf = null;
                this.ibuf = null;
                this.vao = null;
                this.registers = null;
                this.registersLen = 0;
                this.wholeStride = 0;
            }
            toString():string
            {
                return "VertexRenderObj(uid = "+this.m_uid+", type="+this.m_mid+")";
            }
            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitIndexPptFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:VertexRenderObj[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(VertexRenderObj.m_freeIdList.length > 0)
                {
                    return VertexRenderObj.m_freeIdList.pop();
                }
                return -1;
            }
            static Create(type:number,pvtxUid:number):VertexRenderObj
            {
                let unit:VertexRenderObj = null;
                let index:number = VertexRenderObj.GetFreeId();
                //console.log("VertexRenderObj::Create(), VertexRenderObj.m_unitList.length: "+VertexRenderObj.m_unitList.length);
                if(index >= 0)
                {
                    unit = VertexRenderObj.m_unitList[index];
                    VertexRenderObj.m_unitFlagList[index] = VertexRenderObj.S_FLAG_BUSY;
                    unit.setMidAndBufUid(type,pvtxUid);
                }
                else
                {
                    unit = new VertexRenderObj(type, pvtxUid);
                    VertexRenderObj.m_unitList.push( unit );
                    VertexRenderObj.m_unitIndexPptFlagList.push(VertexRenderObj.S_FLAG_FREE);
                    VertexRenderObj.m_unitFlagList.push(VertexRenderObj.S_FLAG_BUSY);
                    VertexRenderObj.m_unitListLen++;
                }
                return unit;
            }
            
            static Restore(pobj:VertexRenderObj):void
            {
                if(pobj != null && pobj.m_attachCount < 1 && VertexRenderObj.m_unitFlagList[pobj.getUid()] == VertexRenderObj.S_FLAG_BUSY)
                {
                    let uid:number = pobj.getUid();
                    VertexRenderObj.m_freeIdList.push(uid);
                    VertexRenderObj.m_unitFlagList[uid] = VertexRenderObj.S_FLAG_FREE;
                    pobj.__$destroy();
                }
            }
            static RenderBegin():void
            {
                VertexRenderObj.s_vtxUid = -2;
                VertexRenderObj.s_preUid = -3;
            }
        }
    }
}