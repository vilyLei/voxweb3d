/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IBufferBuilderT from "../../vox/render/IBufferBuilder";
import * as IVertexRenderObjT from "../../vox/mesh/IVertexRenderObj";
import * as VROBaseT from "../../vox/mesh/VROBase";

import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import IVertexRenderObj = IVertexRenderObjT.vox.mesh.IVertexRenderObj;
import VROBase = VROBaseT.vox.mesh.VROBase;

export namespace vox
{
    export namespace mesh
    {
        export class VaoVertexRenderObj extends VROBase
        {
            private static s_uid:number = 0;
            
            /**
             * vao buffer object
             */
            vao:any = null;

            private constructor()
            {
                super();
                this.m_uid = VaoVertexRenderObj.s_uid++;
            }
            
            run(rc:IBufferBuilder):void
            {
                if(rc.testVROUid(this.m_uid))
                {
                    rc.bindVertexArray(this.vao);
                    //console.log("VaoVertexRenderObj::run(), ## this.m_vtxUid: "+this.m_vtxUid+", this.ibuf:"+this.ibuf);
                    if(rc.testRIOUid(this.m_vtxUid))
                    {
                        rc.bindEleBuf(this.ibuf);
                    }
                }
            }
            protected __$destroy():void
            {
                console.log("VaoVertexRenderObj::__$destroy()..., "+this);
                VROBase.s_midMap.delete(this.m_mid);
                this.m_mid = 0;
                this.m_vtxUid = -1;
                this.ibuf = null;
                this.vao = null;
            }
            restoreThis(rc:IBufferBuilder):void
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
            private static s_unitFlagList:number[] = [];
            private static s_unitListLen:number = 0;
            private static s_unitList:VaoVertexRenderObj[] = [];
            private static s_freeIdList:number[] = [];
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
                if(VaoVertexRenderObj.s_freeIdList.length > 0)
                {
                    return VaoVertexRenderObj.s_freeIdList.pop();
                }
                return -1;
            }
            static Create(mid:number,pvtxUid:number):VaoVertexRenderObj
            {
                let unit:VaoVertexRenderObj = null;
                let index:number = VaoVertexRenderObj.GetFreeId();
                //console.log("VaoVertexRenderObj::Create(), VaoVertexRenderObj.s_unitList.length: "+VaoVertexRenderObj.s_unitList.length);
                if(index >= 0)
                {
                    unit = VaoVertexRenderObj.s_unitList[index];
                    VaoVertexRenderObj.s_unitFlagList[index] = VaoVertexRenderObj.S_FLAG_BUSY;
                    unit.setMidAndBufUid(mid,pvtxUid);
                }
                else
                {
                    unit = new VaoVertexRenderObj();
                    unit.setMidAndBufUid(mid,pvtxUid);
                    VaoVertexRenderObj.s_unitList.push( unit );
                    VaoVertexRenderObj.s_unitFlagList.push(VaoVertexRenderObj.S_FLAG_BUSY);
                    VaoVertexRenderObj.s_unitListLen++;
                }
                VROBase.s_midMap.set(mid,unit);
                return unit;
            }
            
            private static Restore(pobj:VaoVertexRenderObj):void
            {
                if(pobj != null && pobj.m_attachCount < 1 && VaoVertexRenderObj.s_unitFlagList[pobj.getUid()] == VaoVertexRenderObj.S_FLAG_BUSY)
                {
                    let uid:number = pobj.getUid();
                    VaoVertexRenderObj.s_freeIdList.push(uid);
                    VaoVertexRenderObj.s_unitFlagList[uid] = VaoVertexRenderObj.S_FLAG_FREE;
                    pobj.__$destroy();
                }
            }
        }
    }
}