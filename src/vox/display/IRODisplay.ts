/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用于视觉表现上的控制, 而和transform或者非渲染的逻辑无关
// 一个 RODisplay 和一个 IRPODisplay一一对应

import * as RenderConstT from "../../vox/render/RenderConst";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as IROVtxBufT from "../../vox/render/IROVtxBuf";
import * as IRenderMaterialT from "../../vox/render/IRenderMaterial";
import * as IRPODisplayT from "../../vox/render/IRPODisplay";

import DisplayRenderSign = RenderConstT.vox.render.DisplayRenderSign;
import IROVtxBuf = IROVtxBufT.vox.render.IROVtxBuf;
import IRenderMaterial = IRenderMaterialT.vox.render.IRenderMaterial;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import IRPODisplay = IRPODisplayT.vox.render.IRPODisplay;

export namespace vox
{
    export namespace display
    {
        export interface IRODisplay
        {
            name:string;
            // render yes or no
            visible:boolean;// = true;
            ivsIndex:number;// = 0;
            ivsCount:number;// = 0;
            // only use in drawElementsInstanced()...
            trisNumber:number;// = 0;
            insCount:number;// = 0;
            drawMode:number;// = RenderDrawMode.ELEMENTS_TRIANGLES;
            vbuf:IROVtxBuf;// = null;
            // record render state: shadowMode(one byte) + depthTestMode(one byte) + blendMode(one byte) + cullFaceMode(one byte)
            // its value come from: RendererState.CreateRenderState("default", CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_OPAQUE);
            renderState:number;// = RendererState.NORMAL_STATE;
            rcolorMask:number;// = RendererState.ALL_TRUE_COLOR_MASK;
            // mouse interaction enabled flag
            mouseEnabled:boolean;// = false;
            // draw parts group: [ivsCount0,ivsIndex0, ivsCount1,ivsIndex1, ivsCount2,ivsIndex2, ...]
            getPartGroup():Uint16Array;
            createPartGroup(partsTotal:number):void;
            setDrawPartAt(index:number,ivsIndex:number, ivsCount:number):void;
            
            getUid():number;
            setTransform(trans:Matrix4):void;
            getTransform():Matrix4;
            getMatrixFS32():Float32Array;
            enableDrawInstanced(offset:number, instanceCount:number):void;
            disableDrawInstanced():void;
            getMaterial():IRenderMaterial;
            setMaterial(m:IRenderMaterial):void;
            copyFrom(display:IRODisplay):void;
            
            // 只能由渲染系统内部调用
            __$ruid:number;// = -1;     // 用于关联IRPODisplay对象
            __$rpuid:number;// = -1;     // 用于关联RPONode对象
            __$$rsign:DisplayRenderSign;// = DisplayRenderSign.NOT_IN_WORLD;
            __$$runit:IRPODisplay;// = null
        }
    }
}