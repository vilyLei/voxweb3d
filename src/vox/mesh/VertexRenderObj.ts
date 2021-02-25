/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";
import * as IBufferBuilderT from "../../vox/render/IBufferBuilder";
import * as IVertexRenderObjT from "../../vox/mesh/IVertexRenderObj";
import * as VROBaseT from "../../vox/mesh/VROBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;
import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import IVertexRenderObj = IVertexRenderObjT.vox.mesh.IVertexRenderObj;
import VROBase = VROBaseT.vox.mesh.VROBase;

export namespace vox
{
    export namespace mesh
    {
        export class VertexRenderObj extends VROBase
        {
            private static s_uid:number = 0;
                        
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
                super();
                this.m_uid = VertexRenderObj.s_uid++;
            }
            run(rc:IBufferBuilder):void
            {
                if(rc.testVROUid(this.m_uid))
                {
                    //console.log("VertexRenderObj::run(), B:",rc.getUid(),this.m_vtxUid,this.m_uid);
                    if(this.vbuf != null)
                    {
                        rc.useVtxAttribsPtrTypeFloat(this.shdp,this.vbuf, this.attribTypes,this.attribTypesLen, this.wholeOffsetList, this.wholeStride);
                    }
                    else
                    {
                        rc.useVtxAttribsPtrTypeFloatMulti(this.shdp,this.vbufs, this.attribTypes,this.attribTypesLen, this.wholeOffsetList, this.wholeStride);
                    }
                    if(rc.testRIOUid(this.m_vtxUid))
                    {
                        rc.bindEleBuf(this.ibuf);
                    }
                }
            }
            protected __$destroy():void
            {
                console.log("VertexRenderObj::__$destroy()..., "+this);
                VROBase.s_midMap.delete(this.m_mid);
                this.m_mid = 0;
                this.m_vtxUid = -1;
                this.shdp = null;
                this.vbufs = null;
                this.vbuf = null;
                this.ibuf = null;
                
                this.attribTypes = null;
                this.attribTypesLen = 0;
                this.wholeStride = 0;

            }
            restoreThis(rc:IBufferBuilder):void
            {
                VertexRenderObj.Restore(this);
            }
            toString():string
            {
                return "VertexRenderObj(uid = "+this.m_uid+", type="+this.m_mid+")";
            }
            
            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static s_unitFlagList:number[] = [];
            private static s_unitListLen:number = 0;
            private static s_unitList:VertexRenderObj[] = [];
            private static s_freeIdList:number[] = [];
            //  private static s_midMap:Map<number,VertexRenderObj> = new Map();
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
                if(VertexRenderObj.s_freeIdList.length > 0)
                {
                    return VertexRenderObj.s_freeIdList.pop();
                }
                return -1;
            }
            static Create(mid:number,pvtxUid:number):VertexRenderObj
            {
                let unit:VertexRenderObj = null;
                let index:number = VertexRenderObj.GetFreeId();
                //console.log("VertexRenderObj::Create(), VertexRenderObj.s_unitList.length: "+VertexRenderObj.s_unitList.length);
                if(index >= 0)
                {
                    unit = VertexRenderObj.s_unitList[index];
                    VertexRenderObj.s_unitFlagList[index] = VertexRenderObj.S_FLAG_BUSY;
                    unit.setMidAndBufUid(mid,pvtxUid);
                }
                else
                {
                    unit = new VertexRenderObj();
                    unit.setMidAndBufUid(mid,pvtxUid);
                    VertexRenderObj.s_unitList.push( unit );
                    VertexRenderObj.s_unitFlagList.push(VertexRenderObj.S_FLAG_BUSY);
                    VertexRenderObj.s_unitListLen++;
                }
                VROBase.s_midMap.set(mid,unit);
                return unit;
            }
            
            private static Restore(pobj:VertexRenderObj):void
            {
                if(pobj != null && pobj.m_attachCount < 1 && VertexRenderObj.s_unitFlagList[pobj.getUid()] == VertexRenderObj.S_FLAG_BUSY)
                {
                    let uid:number = pobj.getUid();
                    VertexRenderObj.s_freeIdList.push(uid);
                    VertexRenderObj.s_unitFlagList[uid] = VertexRenderObj.S_FLAG_FREE;
                    pobj.__$destroy();
                }
            }
        }
    }
}