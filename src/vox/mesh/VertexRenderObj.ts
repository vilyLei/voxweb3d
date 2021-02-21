/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ROVtxBufUidStoreT from "../../vox/mesh/ROVtxBufUidStore";
import * as IVertexRenderObjT from "../../vox/mesh/IVertexRenderObj";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ROVtxBufUidStore = ROVtxBufUidStoreT.vox.mesh.ROVtxBufUidStore;
import IVertexRenderObj = IVertexRenderObjT.vox.mesh.IVertexRenderObj;

export namespace vox
{
    export namespace mesh
    {
        export class VertexRenderObj implements IVertexRenderObj
        {
            private static s_uid:number = 0;
            private m_uid:number = 0;
            // vtx attribute hash map id
            private m_mid:number = 0;
            private m_vtxUid:number = 0;

            ibuf:any = null;
            /**
             * be used by the renderer runtime, the value is 2 or 4.
             */
            ibufStep:number = 2;
            
            shdp:IVtxShdCtr = null;

            vbufs:any[] = null;
            vbuf:any = null;

            attribTypes:number[] = null;
            wholeOffsetList:number[] = null;
            attribTypesLen:number = 0;
            updateUnlocked:boolean = true;
            wholeStride:number = 0;
            
            private constructor()
            {
                this.m_uid = VertexRenderObj.s_uid++;
            }
            
            private setMidAndBufUid(mid:number,pvtxUid:number):void
            {
                this.m_mid = mid;
                this.m_vtxUid = pvtxUid;
                this.m_attachCount = 0;
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
                if(rc.Vertex.rvoUid != this.m_uid)
                {
                    rc.Vertex.rvoUid = this.m_uid;
                    if(this.vbuf != null)
                    {
                        rc.useVtxAttrisbPtrTypeFloat(this.shdp,this.vbuf, this.attribTypes,this.attribTypesLen, this.wholeOffsetList, this.wholeStride);
                    }
                    else
                    {
                        rc.useVtxAttrisbPtrTypeFloatMulti(this.shdp,this.vbufs, this.attribTypes,this.attribTypesLen, this.wholeOffsetList, this.wholeStride);
                    }
                    //console.log("VertexRenderObj::run(), ## this.m_vtxUid: "+this.m_vtxUid+", this.ibuf:"+this.ibuf);
                    if(rc.Vertex.rioUid != this.m_vtxUid)
                    {
                        rc.Vertex.rioUid = this.m_vtxUid;
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
                }
            }
            private __$destroy():void
            {
                console.log("VertexRenderObj::__$destroy()..., "+this);
                this.m_vtxUid = -1;
                this.shdp = null;
                this.vbufs = null;
                this.vbuf = null;
                this.ibuf = null;
                
                this.attribTypes = null;
                this.attribTypesLen = 0;
                this.wholeStride = 0;
            }
            restoreThis(rc:RenderProxy):void
            {
                VertexRenderObj.Restore(this);
            }
            toString():string
            {
                return "VertexRenderObj(uid = "+this.m_uid+", type="+this.m_mid+")";
            }
            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
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
                    unit = new VertexRenderObj();
                    unit.setMidAndBufUid(type,pvtxUid);
                    VertexRenderObj.m_unitList.push( unit );
                    VertexRenderObj.m_unitFlagList.push(VertexRenderObj.S_FLAG_BUSY);
                    VertexRenderObj.m_unitListLen++;
                }
                return unit;
            }
            
            private static Restore(pobj:VertexRenderObj):void
            {
                if(pobj != null && pobj.m_attachCount < 1 && VertexRenderObj.m_unitFlagList[pobj.getUid()] == VertexRenderObj.S_FLAG_BUSY)
                {
                    let uid:number = pobj.getUid();
                    VertexRenderObj.m_freeIdList.push(uid);
                    VertexRenderObj.m_unitFlagList[uid] = VertexRenderObj.S_FLAG_FREE;
                    pobj.__$destroy();
                }
            }
        }
    }
}