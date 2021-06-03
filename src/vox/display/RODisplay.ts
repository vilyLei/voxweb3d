/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用于视觉表现上的渲染控制, 而和transform或者非渲染的逻辑无关
// 一个 RODisplay 和一个 IRPODisplay一一对应, 一个RODisplay也只会和一个renderer相关联

import {DisplayRenderSign,RenderDrawMode} from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import MaterialBase from "../../vox/material/MaterialBase";
import Matrix4 from "../../vox/math/Matrix4";
import IRODisplay from "../../vox/display/IRODisplay";
import IRPODisplay from "../../vox/render/IRPODisplay";


export default class RODisplay implements IRODisplay
{
    private static s_uid:number = 0;
    private m_uid:number = 0;

    private m_material:MaterialBase = null;
    // 只是持有引用不做任何管理操作
    private m_matFS32:Float32Array = null;

    name:string = "RODisplay";
    // render yes or no
    visible:boolean = true;
    ivsIndex:number = 0;
    ivsCount:number = 0;
    // only use in drawElementsInstanced()...
    trisNumber:number = 0;
    insCount:number = 0;
    drawMode:number = RenderDrawMode.ELEMENTS_TRIANGLES;
    vbuf:ROVertexBuffer = null;
    // record render state: shadowMode(one byte) + depthTestMode(one byte) + blendMode(one byte) + cullFaceMode(one byte)
    // its value come from: RendererState.CreateRenderState("default", CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.OPAQUE);
    renderState:number = RendererState.NORMAL_STATE;
    rcolorMask:number = RendererState.COLOR_MASK_ALL_TRUE;
    // mouse interaction enabled flag
    mouseEnabled:boolean = false;
    private m_partGroup:Uint16Array = null;
    private m_trans:Matrix4 = null;
    private constructor()
    {
        this.m_uid = RODisplay.s_uid++;
    }
    
    // draw parts group: [ivsCount0,ivsIndex0, ivsCount1,ivsIndex1, ivsCount2,ivsIndex2, ...]
    getPartGroup():Uint16Array
    {
        return this.m_partGroup;
    }
    createPartGroup(partsTotal:number):void
    {
        if(partsTotal < 1)
        {
            partsTotal = 1;
        }
        this.m_partGroup = new Uint16Array(partsTotal * 2);
    }
    setDrawPartAt(index:number,ivsIndex:number, ivsCount:number):void
    {
        index *= 2;
        this.m_partGroup[index] = ivsCount;
        this.m_partGroup[++index] = ivsIndex;
    }
    getUid():number
    {
        return this.m_uid;
    }            
    setTransform(trans:Matrix4):void
    {
        this.m_trans = trans;
        this.m_matFS32 = trans.getLocalFS32();
    }
    getTransform():Matrix4
    {
        return this.m_trans;
    }
    
    getMatrixFS32():Float32Array
    {
        return this.m_matFS32;
    }
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
    copyFrom(display:RODisplay):void
    {
        this.vbuf = display.vbuf;
        this.ivsIndex = display.ivsIndex;
        this.ivsCount = display.ivsCount;

        this.setMaterial(display.getMaterial());
    }

    toString()
    {
        return "RODisplay(name="+this.name+",uid="+this.getUid()+", __$ruid="+this.__$ruid+")";
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
        this.m_matFS32 = null;
        this.vbuf = null;
        this.__$ruid = -1;
        this.__$rpuid = -1;
        this.__$$rsign = DisplayRenderSign.NOT_IN_WORLD;
        this.ivsIndex = 0;
        this.ivsCount = 0;
        this.m_partGroup = null;
        this.__$$runit = null;
    }
    // 只能由渲染系统内部调用
    __$ruid:number = -1;     // 用于关联IRPODisplay对象
    __$rpuid:number = -1;    // 用于关联RPONode对象
    __$$rsign:DisplayRenderSign = DisplayRenderSign.NOT_IN_WORLD;
    __$$runit:IRPODisplay = null;

    private static S_FLAG_BUSY:number = 1;
    private static S_FLAG_FREE:number = 0;
    private static m_unitFlagList:number[] = [];
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
    static GetByUid(uid:number):RODisplay
    {
        return RODisplay.m_unitList[uid];
    }
    static IsEnabledByUid(uid:number):boolean
    {
        return RODisplay.m_unitFlagList[uid] == RODisplay.S_FLAG_BUSY;
    }
    static Create():RODisplay
    {
        let unit:RODisplay = null;
        let index:number = RODisplay.GetFreeId();
        //console.log("RODisplay::Create(), RODisplay.m_unitList.length: "+RODisplay.m_unitList.length);
        if(index >= 0)
        {
            unit = RODisplay.m_unitList[index];
            RODisplay.m_unitFlagList[index] = RODisplay.S_FLAG_BUSY;
        }
        else
        {
            unit = new RODisplay();
            RODisplay.m_unitList.push( unit );
            RODisplay.m_unitFlagList.push(RODisplay.S_FLAG_BUSY);
            RODisplay.m_unitListLen++;
        }
        return unit;
    }
    
    static Restore(pdisp:RODisplay):void
    {
        if(pdisp != null && RODisplay.m_unitFlagList[pdisp.getUid()] == RODisplay.S_FLAG_BUSY)
        {
            let uid:number = pdisp.getUid();
            RODisplay.m_freeIdList.push(uid);
            RODisplay.m_unitFlagList[uid] = RODisplay.S_FLAG_FREE;
            pdisp.destroy();
        }
    }
}