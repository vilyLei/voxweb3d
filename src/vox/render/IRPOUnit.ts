/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IAABB from "../../vox/geom/IAABB";
import IVertexRenderObj from "../../vox/render/IVertexRenderObj";

import IRenderShader from "../../vox/render/IRenderShader";
import ITextureRenderObj from "../../vox/render/ITextureRenderObj";

import IRenderProxy from "../../vox/render/IRenderProxy";
import IShaderUBO from "../../vox/material/IShaderUBO";
import IShaderUniform from "../../vox/material/IShaderUniform";
import IRPODisplay from "../../vox/render/IRPODisplay";
import IPoolNode from "../../vox/base/IPoolNode";
import { ROIndicesRes } from "./vtx/ROIndicesRes";

/**
 * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
 * renderer rendering runtime core executable display unit.
 */
export default interface IRPOUnit extends IPoolNode, IRPODisplay {
    uid: number;
    value: number;
    // 记录自身和RPONode的对应关系
    __$rpuid: number;
    // renderProcess uid
    __$rprouid: number;
    shader: IRenderShader;
    // 这个posotion和bounds的center会是同一个实例
    pos: IVector3D;
    bounds: IAABB;
    // 记录对应的RODisplay的渲染所需的状态数据
    ibufType: number;                // UNSIGNED_SHORT or UNSIGNED_INT
    ibufStep: number;                // 2 or 4
    ivsIndex: number;
    ivsCount: number;
    insCount: number;
    drawOffset: number;

    partTotal: number;               // partTotal = partGroup.length
    partGroup: Uint16Array;
    trisNumber: number;
    visible: boolean;
    drawEnabled: boolean;
    drawMode: number;

    renderState: number;
    rcolorMask: number;
    // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合
    drawFlag: number;
    indicesRes: ROIndicesRes;
    vro: IVertexRenderObj;

    // transform uniform
    transUniform: IShaderUniform;
    // materiall uniform
    uniform: IShaderUniform;
    // 记录 material 对应的 shader program uid
    shdUid: number;
    vtxUid: number;
    // record tex group
    tro: ITextureRenderObj;
    texMid: number;
    ubo: IShaderUBO;
    /**
     *  for example: [-70.0,1.0]
     */
    polygonOffset: number[];
    getUid(): number;
    getRPOUid(): number;
    getRPROUid(): number;
    getShaderUid(): number;
    setIvsParam(ivsIndex: number, ivsCount: number): void;
    setVisible(boo: boolean): void;
    setDrawFlag(renderState: number, rcolorMask: number): void;
    drawThis(rc: IRenderProxy): void;

    drawPart(rc: IRenderProxy): void;
    run2(rc: IRenderProxy): void;
    run(rc: IRenderProxy): void;

    runLockMaterial2(puniform: IShaderUniform): void;
    runLockMaterial(): void;
    reset(): void;
    destroy(): void;
}
