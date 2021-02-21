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
        export class VROBase implements IVertexRenderObj
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

            private constructor()
            {
                this.m_uid = VROBase.s_uid++;
            }
            
            protected setMidAndBufUid(mid:number,pvtxUid:number):void
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
                //console.log("VROBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                if(this.m_attachCount < 1)
                {
                    ROVtxBufUidStore.GetInstance().__$detachAt(this.m_vtxUid);
                    this.m_attachCount = 0;
                    console.log("VROBase::__$detachThis() this.m_attachCount value is 0.");
                }
            }
            protected __$destroy():void
            {
                console.log("VROBase::__$destroy()..., "+this);
                this.m_vtxUid = -1;
                this.ibuf = null;
            }
            restoreThis(rc:RenderProxy):void
            {
                
            }
            toString():string
            {
                return "VROBase(uid = "+this.m_uid+", type="+this.m_mid+")";
            }
            protected static S_FLAG_BUSY:number = 1;
            protected static S_FLAG_FREE:number = 0;
            protected static s_unitFlagList:number[] = [];
            protected static s_unitListLen:number = 0;
            protected static s_unitList:IVertexRenderObj[] = [];
            protected static s_freeIdList:number[] = [];
            protected static s_midMap:Map<number,IVertexRenderObj> = new Map();
            static HasMid(mid:number):boolean
            {
                return VROBase.s_midMap.has(mid);
            }
            static GetByMid(mid:number):IVertexRenderObj
            {
                return VROBase.s_midMap.get(mid);
            }
            private static GetFreeId():number
            {
                if(VROBase.s_freeIdList.length > 0)
                {
                    return VROBase.s_freeIdList.pop();
                }
                return -1;
            }
            
        }
    }
}