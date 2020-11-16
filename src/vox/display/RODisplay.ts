/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用于视觉表现上的控制, 而和transform或者非渲染的逻辑无关
// 一个 RODisplay 和一个 RPOUnit一一对应

import * as RenderConstT from "../../vox/render/RenderConst";
import * as RendererStateT from "../../vox/render/RendererState";
import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";
//import * as ROIndexBufferT from "../../vox/mesh/ROIndexBuffer";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
//import * as RODisplayBaseT from "../../vox/display/RODisplayBase";
import * as ROTransformT from "../../vox/display/ROTransform";
//import * as ShaderUniformT from "../../vox/material/ShaderUniform";

import RenderDrawMode = RenderConstT.vox.render.RenderDrawMode;
import RendererState = RendererStateT.vox.render.RendererState;
import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;
//import ROIndexBuffer = ROIndexBufferT.vox.mesh.ROIndexBuffer;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
//import RODisplayBase = RODisplayBaseT.vox.display.RODisplayBase;
import ROTransform = ROTransformT.vox.display.ROTransform;
//import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;

export namespace vox
{
    export namespace display
    {
        export class RODisplay
        {
            // 还没有加入 world
            static NOT_IN_WORLD:number = -1;
            // 正在进入 world
            static GO_TO_WORLD:number = 1;
            // 真正存在于 world, 也就是直接可以在 process 中使用了
            static LIVE_IN_WORLD:number = 2;
            private static __s_uid:number = 0;

            private m_uid:number = 0;
            private constructor()
            {
                this.m_uid = RODisplay.__s_uid++;
            }
            name:string = "RODisplay";
            // render yes or no
            visible:boolean = true;
            ivsIndex:number = 0;
            ivsCount:number = 0;
            
            getUid():number
            {
                return this.m_uid;
            }
            
            private m_material:MaterialBase = null;
            // only use in drawElementsInstanced()...
            trisNumber:number = 0;
            insCount:number = 0;            
            drawMode:number = RenderDrawMode.ELEMENTS_TRIANGLES;
            transform:ROTransform = null;
            vbuf:ROVertexBuffer = null;
            //ibuf:ROIndexBuffer = null;
            // 只是持有引用不做任何管理操作
            transfrom:ROTransform = null;
            // record render state: shadowMode(one byte) + depthTestMode(one byte) + blendMode(one byte) + cullFaceMode(one byte)
            // its value come from: RenderStateObject.Create("default", CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_OPAQUE);
            renderState:number = RendererState.NORMAL_STATE;
            rcolorMask:number = RendererState.ALL_TRUE_COLOR_MASK;
            // mouse interaction enabled
            mouseEnabled:boolean = false;

            enableDrawInstanced(offset:number, instanceCount:number):void
            {
                this.drawMode = RenderDrawMode.ELEMENTS_INSTANCED_TRIANGLES;
                this.ivsIndex = offset;
                this.insCount = instanceCount;
            }
            disableDrawInstanced():void
            {
                this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;
            }
            getMaterial():MaterialBase
            {
                return this.m_material;
            }
            setMaterial(m:MaterialBase):void
            {
                if(this.m_material != null)
                {
                    if(this.m_material != m)
                    {
                        this.m_material.__$detachThis();
                        if(m != null)
                        {
                            m.__$attachThis();
                        }
                    }
                }
                this.m_material = m;
            }
            private destroy():void
            {
                // 如果只有自己持有 this.m_material, 则destroy this.m_material
                // 这里还需要优化
                if(this.m_material != null)
                {
                    this.m_material.__$detachThis();
                    this.m_material.destroy();
                    this.m_material = null;
                }
                this.transfrom = null;
                this.vbuf = null;
                //this.ibuf = null;
                this.__$ruid = -1;
                this.__$rpuid = -1;
                this.ivsIndex = 0;
                this.ivsCount = 0;
            }
            copyFrom(display:RODisplay):void
            {
                this.vbuf = display.vbuf;
                //this.ibuf = display.ibuf;
                this.ivsIndex = display.ivsIndex;
                this.ivsCount = display.ivsCount;

                this.m_material = display.getMaterial();
            }
            updateMaterialData():void
            {
                //this.renderState = this.shadowMode << 12 | this.depthTestMode << 8 | this.blendMode<<4 | this.cullFaceMode;
                if(this.m_material != null)
                {
                    this.m_material.updateSelfData( this );
                }
            }
            toString()
            {
                return "RODisplay(name="+this.name+",uid="+this.getUid()+", __$ruid="+this.__$ruid+")";
            }
            // 只能由渲染系统内部调用
            __$ruid:number = -1;     // 用于关联RPOUnit对象
            __$rpuid:number = -1;     // 用于关联RPONode对象
            rsign:number = RODisplay.NOT_IN_WORLD;

            private static __S_FLAG_BUSY:number = 1;
            private static __S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitIndexPptFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:RODisplay[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(RODisplay.m_freeIdList.length > 0)
                {
                    return RODisplay.m_freeIdList.pop();
                }
                return -1;
            }
            static Create():RODisplay
            {
                let unit:RODisplay = null;
                let index:number = RODisplay.GetFreeId();
                //console.log("RODisplay::Create(), RODisplay.m_unitList.length: "+RODisplay.m_unitList.length);
                if(index >= 0)
                {
                    unit = RODisplay.m_unitList[index];
                    RODisplay.m_unitFlagList[index] = RODisplay.__S_FLAG_BUSY;
                }
                else
                {
                    unit = new RODisplay();
                    RODisplay.m_unitList.push( unit );
                    RODisplay.m_unitIndexPptFlagList.push(RODisplay.__S_FLAG_FREE);
                    RODisplay.m_unitFlagList.push(RODisplay.__S_FLAG_BUSY);
                    RODisplay.m_unitListLen++;
                }
                return unit;
            }
            
            static Restore(pdisp:RODisplay):void
            {
                if(pdisp != null && RODisplay.m_unitFlagList[pdisp.getUid()] == RODisplay.__S_FLAG_BUSY)
                {
                    let uid:number = pdisp.getUid();
                    RODisplay.m_freeIdList.push(uid);
                    RODisplay.m_unitFlagList[uid] = RODisplay.__S_FLAG_FREE;
                    pdisp.destroy();
                }
            }
        }
    }
}