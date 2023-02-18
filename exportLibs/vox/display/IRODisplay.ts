/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用于视觉表现上的控制, 而和transform或者非渲染的逻辑无关
// 一个 RODisplay 和一个 IRPODisplay一一对应

// import { DisplayRenderSign } from "../../vox/render/RenderConst";
import IMatrix4 from "../../vox/math/IMatrix4";
import IROVtxBuf from "../../vox/render/IROVtxBuf";
import IROIVtxBuf from "../../vox/render/IROIVtxBuf";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRPODisplay from "../../vox/render/IRPODisplay";

interface IRODisplay {
    
    uuid: string;
    // render yes or no
    visible: boolean;
    ivsIndex: number;
    ivsCount: number;
    // only use in drawElementsInstanced()...
    trisNumber: number;
    insCount: number;
    drawMode: number;
    vbuf: IROVtxBuf;
    ivbuf: IROIVtxBuf;
    
    /**
     * record render state: shadowMode(one byte) + depthTestMode(one byte) + blendMode(one byte) + cullFaceMode(one byte)
     * its value come from: RendererState.CreateRenderState("default", CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.OPAQUE);
     * value example: RendererState.NORMAL_STATE
     */
    renderState: number;
    /**
     * value example: RendererState.ALL_TRUE_COLOR_MASK;
     */
    rcolorMask: number;
    /**
     * mouse interaction enabled flag
     * its default value is false
     */
    mouseEnabled: boolean;

    getVtxResUid(): number;
    getVtxResVer(): number;
    // draw parts group: [ivsCount0,ivsIndex0, ivsCount1,ivsIndex1, ivsCount2,ivsIndex2, ...]
    getPartGroup(): Uint16Array;
    createPartGroup(partsTotal: number): void;
    setDrawPartAt(index: number, ivsIndex: number, ivsCount: number): void;

    getUid(): number;
    setTransform(trans: IMatrix4): void;
    getTransform(): IMatrix4;
    getMatrixFS32(): Float32Array;
    enableDrawInstanced(offset: number, instanceCount: number): void;
    disableDrawInstanced(): void;
    getMaterial(): IRenderMaterial;
    setMaterial(m: IRenderMaterial): void;
    copyFrom(display: IRODisplay): void;

    // ----------------------------------- 只能由渲染系统内部调用 ----------------------------[
    __$ruid: number;// = -1;        // 用于关联IRPODisplay对象, 默认值false
    __$rpuid: number;// = -1;       // 用于关联RPONode对象, 默认值false
    __$$rsign: number;   // = DisplayRenderSign.NOT_IN_RENDERER;
    __$$runit: IRPODisplay;         // 用于关联IRPODisplay对象, 默认值为null
    // ----------------------------------- 只能由渲染系统内部调用 ----------------------------]
}
export default IRODisplay;