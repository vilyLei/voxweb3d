/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ROVtxBufUidStoreT from "../../vox/mesh/ROVtxBufUidStore";
import * as IVertexRenderObjT from "../../vox/mesh/IVertexRenderObj";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ROVtxBufUidStore = ROVtxBufUidStoreT.vox.mesh.ROVtxBufUidStore;
import IVertexRenderObj = IVertexRenderObjT.vox.mesh.IVertexRenderObj;

export namespace vox
{
    export namespace mesh
    {
        export class VaoVertexRenderObj implements IVertexRenderObj
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
            
            /**
             * vao buffer object
             */
            vao:any = null;

            private constructor()
            {
                this.m_uid = VaoVertexRenderObj.s_uid++;
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
                    rc.bindVertexArray(this.vao);
                    //console.log("VaoVertexRenderObj::run(), ## this.m_vtxUid: "+this.m_vtxUid+", this.ibuf:"+this.ibuf);
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
                //console.log("VaoVertexRenderObj::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                if(this.m_attachCount < 1)
                {
                    ROVtxBufUidStore.GetInstance().__$detachAt(this.m_vtxUid);
                    this.m_attachCount = 0;
                    console.log("VaoVertexRenderObj::__$detachThis() this.m_attachCount value is 0.");
                }
            }
            private __$destroy():void
            {
                console.log("VaoVertexRenderObj::__$destroy()..., "+this);
                this.m_vtxUid = -1;
                this.ibuf = null;
                this.vao = null;
            }
            restoreThis(rc:RenderProxy):void
            {
                if(this.vao != null)
                {
                    rc.deleteVertexArray(this.vao);
                }
                VaoVertexRenderObj.Restore(this);
            }
            toString():string
            {
                return "VaoVertexRenderObj(uid = "+this.m_uid+", type="+this.m_mid+")";
            }
            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:VaoVertexRenderObj[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(VaoVertexRenderObj.m_freeIdList.length > 0)
                {
                    return VaoVertexRenderObj.m_freeIdList.pop();
                }
                return -1;
            }
            static Create(type:number,pvtxUid:number):VaoVertexRenderObj
            {
                let unit:VaoVertexRenderObj = null;
                let index:number = VaoVertexRenderObj.GetFreeId();
                //console.log("VaoVertexRenderObj::Create(), VaoVertexRenderObj.m_unitList.length: "+VaoVertexRenderObj.m_unitList.length);
                if(index >= 0)
                {
                    unit = VaoVertexRenderObj.m_unitList[index];
                    VaoVertexRenderObj.m_unitFlagList[index] = VaoVertexRenderObj.S_FLAG_BUSY;
                    unit.setMidAndBufUid(type,pvtxUid);
                }
                else
                {
                    unit = new VaoVertexRenderObj();
                    unit.setMidAndBufUid(type,pvtxUid);
                    VaoVertexRenderObj.m_unitList.push( unit );
                    VaoVertexRenderObj.m_unitFlagList.push(VaoVertexRenderObj.S_FLAG_BUSY);
                    VaoVertexRenderObj.m_unitListLen++;
                }
                return unit;
            }
            
            private static Restore(pobj:VaoVertexRenderObj):void
            {
                if(pobj != null && pobj.m_attachCount < 1 && VaoVertexRenderObj.m_unitFlagList[pobj.getUid()] == VaoVertexRenderObj.S_FLAG_BUSY)
                {
                    let uid:number = pobj.getUid();
                    VaoVertexRenderObj.m_freeIdList.push(uid);
                    VaoVertexRenderObj.m_unitFlagList[uid] = VaoVertexRenderObj.S_FLAG_FREE;
                    pobj.__$destroy();
                }
            }
        }
    }
}