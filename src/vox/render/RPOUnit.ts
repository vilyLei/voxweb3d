/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import { IAABB } from "../../vox/geom/IAABB";
import { RenderDrawMode } from "../../vox/render/RenderConst";
import IVertexRenderObj from "../../vox/render/IVertexRenderObj";

import RenderShader from "../../vox/render/RenderShader";
import ITextureRenderObj from "../../vox/render/ITextureRenderObj";

import { RenderColorMask } from "../../vox/render/rendering/RenderColorMask";
import { RenderStateObject } from "../../vox/render/rendering/RenderStateObject";

import RendererState from "../../vox/render/RendererState";
import RenderProxy from "../../vox/render/RenderProxy";
import ShaderUBO from "../../vox/material/ShaderUBO";
import IShaderUniform from "../../vox/material/IShaderUniform";
import IRPODisplay from "../../vox/render/IRPODisplay";
import IPoolNode from "../../vox/base/IPoolNode";
import { ROIndicesRes } from "./vtx/ROIndicesRes";
import DebugFlag from "../debug/DebugFlag";

const RST = RendererState;
/**
 * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
 * renderer rendering runtime core executable display unit.
 */
export default class RPOUnit implements IPoolNode, IRPODisplay {
    uid: number = -1;
    value: number = -1;
    // 记录自身和RPONode的对应关系
    __$rpuid: number = -1;
    // renderProcess uid
    __$rprouid: number = -1;
    shader: RenderShader = null;
    // 这个posotion和bounds的center会是同一个实例
    pos: IVector3D = null;
    bounds: IAABB = null;
    // 记录对应的RODisplay的渲染所需的状态数据
    ibufType: number = 0;                // UNSIGNED_SHORT or UNSIGNED_INT
    ibufStep: number = 2;                // 2 or 4
    ivsIndex: number = 0;
    ivsCount: number = 0;
    insCount: number = 0;
    drawOffset: number = 0;

    partTotal: number = 0;               // partTotal = partGroup.length
    partGroup: Uint16Array = null;
    trisNumber: number = 0;
    visible: boolean = true;
    drawEnabled: boolean = true;
    drawMode: number = 0;

    renderState: number = 0;
    rcolorMask: number = 0;
    // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合
    drawFlag: number = 0;
    indicesRes: ROIndicesRes;
    vro: IVertexRenderObj = null;

    // transform uniform
    transUniform: IShaderUniform = null;
    // materiall uniform
    uniform: IShaderUniform = null;
    // 记录 material 对应的 shader program uid
    shdUid: number = -1;
    vtxUid: number = -1;
    // record tex group
    tro: ITextureRenderObj = null;
    texMid: number = -1;
    ubo: ShaderUBO = null;
    /**
     *  for example: [-70.0,1.0]
     */
    polygonOffset: number[] = null;
    constructor() {
    }
    private testDrawFlag(): void {
        if (this.shader.drawFlag != this.drawFlag) {
            this.shader.drawFlag = this.drawFlag;
            RenderStateObject.UseRenderState(this.renderState);
            RenderColorMask.UseRenderState(this.rcolorMask);
        }
    }
    getUid(): number {
        return this.uid;
    }
    getRPOUid(): number {
        return this.__$rpuid;
    }
    getRPROUid(): number {
        return this.__$rprouid;
    }
    getShaderUid(): number {
        return this.shdUid;
    }
    setIvsParam(ivsIndex: number, ivsCount: number): void {
        this.ivsIndex = ivsIndex;
        this.ivsCount = ivsCount;
        this.drawOffset = ivsIndex * this.ibufStep;
        this.drawEnabled = this.visible && this.ivsCount > 0;
    }
    setVisible(boo: boolean): void {
        this.visible = boo;
        this.drawEnabled = boo && this.ivsCount > 0;
        // if(DebugFlag.Flag_0 > 0) console.log("#### setVisible(): ", boo, "this.drawEnabled: ",this.drawEnabled);
    }
    setDrawFlag(renderState: number, rcolorMask: number): void {
        this.renderState = renderState;
        this.rcolorMask = rcolorMask;
        this.drawFlag = (rcolorMask << 10) + renderState;
    }
    drawThis(rc: RenderProxy): void {

        ++RST.DrawCallTimes;
        RST.DrawTrisNumber += this.trisNumber;
        // TODO(Vily): 下面这个判断流程需要优化(由于几何数据更改之后上传gpu的动作是一帧上传16个这样的速度下实现的，所以需要下面这句代码来保证不出错: [.WebGL-000037DC02C2B800] GL_INVALID_OPERATION: Insufficient buffer size)
        let ivsCount = this.indicesRes.getVTCount();
        if (this.ivsCount <= ivsCount) ivsCount = this.ivsCount;

        if(this.polygonOffset != null) {
            rc.setPolygonOffset(this.polygonOffset[0],this.polygonOffset[1]);
        }
        else {
            rc.resetPolygonOffset();
        }
        const rdm = RenderDrawMode;
        let gl: any = rc.RContext;
        switch (this.drawMode) {
            case rdm.ELEMENTS_TRIANGLES:
                // if(DebugFlag.Flag_0 > 0)console.log("RPOUnit::run(), TRIANGLES drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+"),drawOffset: "+this.drawOffset);
                //rc.RContext.drawElements(rc.TRIANGLES, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLES, ivsCount, this.ibufType, this.drawOffset);
                break;
            case rdm.ELEMENTS_LINES:
                //console.log("RPOUnit::run(), ELEMENTS_LINES drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+"),drawOffset: "+this.drawOffset);
                //rc.RContext.drawElements(rc.ELEMENTS_LINES, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.LINES, ivsCount, this.ibufType, this.drawOffset);
                break;
            case rdm.ELEMENTS_TRIANGLE_STRIP:
                //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLE_STRIP, ivsCount, this.ibufType, this.drawOffset);
                break;
            case rdm.ELEMENTS_INSTANCED_TRIANGLES:
                //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
                gl.drawElementsInstanced(rc.TRIANGLES, ivsCount, this.ibufType, this.drawOffset, this.insCount);
                break;
            case rdm.ELEMENTS_TRIANGLE_FAN:
                //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLE_FAN, ivsCount, this.ibufType, this.drawOffset);
                break;
            case rdm.ARRAYS_LINES:
                //console.log("RPOUnit::run(), ARRAYS_LINES drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                gl.drawArrays(rc.LINES, this.ivsIndex, this.ivsCount);
                break;
            case rdm.ARRAYS_LINE_STRIP:
                //console.log("RPOUnit::run(), ARRAYS_LINE_STRIP drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                gl.drawArrays(rc.LINE_STRIP, this.ivsIndex, this.ivsCount);
                break;
            default:
                break;
        }
    }

    drawPart(rc: RenderProxy): void {

        ++RST.DrawCallTimes;
        RST.DrawTrisNumber += this.trisNumber;

        // TODO(Vily): 下面这个判断流程需要优化(由于几何数据更改之后上传gpu的动作是一帧上传16个这样的速度下实现的，所以需要下面这句代码来保证不出错: [.WebGL-000037DC02C2B800] GL_INVALID_OPERATION: Insufficient buffer size)
        let ivsCount = this.indicesRes.getVTCount();
        if (this.ivsCount <= ivsCount) ivsCount = this.ivsCount;

        if(this.polygonOffset != null) {
            rc.setPolygonOffset(this.polygonOffset[0],this.polygonOffset[1]);
        }
        else {
            rc.resetPolygonOffset();
        }

        const rdm = RenderDrawMode;
        let i: number = 0;
        let gl: any = rc.RContext;
        switch (this.drawMode) {
            case rdm.ELEMENTS_TRIANGLES:
                for (; i < this.partTotal;) {
                    // 这里面可以增加一个回调函数,这个回调函数可以对uniform(或者transformUniform)做一些数据改变，进而来控制相应的状态
                    // 因此可以通过改变uniform实现大量的显示绘制
                    //  let count:number = this.partGroup[i++];
                    //  let offset:number = this.partGroup[i++];
                    //  gl.drawElements(rc.TRIANGLES, count, this.ibufType, offset);
                    gl.drawElements(rc.TRIANGLES, this.partGroup[i++], this.ibufType, this.partGroup[i++]);
                }
                break;
            case rdm.ELEMENTS_LINES:
                for (; i < this.partTotal;) {
                    // 这里面可以增加一个回调函数,这个回调函数可以对uniform(或者transformUniform)做一些数据改变，进而来控制相应的状态
                    // 因此可以通过改变uniform实现大量的显示绘制
                    //  let count:number = this.partGroup[i++];
                    //  let offset:number = this.partGroup[i++];
                    //  gl.drawElements(rc.TRIANGLES, count, this.ibufType, offset);
                    gl.drawElements(rc.LINES, this.partGroup[i++], this.ibufType, this.partGroup[i++]);
                }
                break;
            case rdm.ELEMENTS_TRIANGLE_STRIP:
                //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType, this.drawOffset);
                break;
            case rdm.ELEMENTS_INSTANCED_TRIANGLES:
                //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
                gl.drawElementsInstanced(rc.TRIANGLES, this.ivsCount, this.ibufType, this.drawOffset, this.insCount);
                break;
            case rdm.ELEMENTS_TRIANGLE_FAN:
                //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType, this.drawOffset);
                break;
            case rdm.ARRAYS_LINES:
                //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                gl.drawArrays(rc.LINES, this.ivsIndex, this.ivsCount);
                break;
            case rdm.ARRAYS_LINE_STRIP:
                //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                gl.drawArrays(rc.LINE_STRIP, this.ivsIndex, this.ivsCount);
                break;
            default:
                break;
        }
    }
    run2(rc: RenderProxy): void {
        //console.log("RPOUnit::run2(), this.tro: "+this.tro+", this.drawMode: "+this.drawMode);
        if (this.ubo != null) {
            this.ubo.run(rc);
        }
        //  if(this.shader == null)
        //  {
        //      console.log("this.shader == null unit this.uid: ",this.uid);
        //  }
        this.shader.useTransUniform(this.transUniform);
        this.shader.useUniform(this.uniform);
        this.testDrawFlag();
    }
    run(rc: RenderProxy): void {
        //console.log("RPOUnit::run(), this.tro: "+this.tro+", this.drawMode: "+this.drawMode);
        if (this.ubo != null) {
            this.ubo.run(rc);
        }
        this.vro.run();
        this.tro.run();
        this.shader.useTransUniform(this.transUniform);
        this.shader.useUniform(this.uniform);
        this.testDrawFlag();
    }

    runLockMaterial2(puniform: IShaderUniform): void {
        this.testDrawFlag();
        this.shader.useUniform2ToCurrentShd(puniform == null ? this.uniform : puniform, this.transUniform);
    }
    runLockMaterial(): void {
        this.vro.run();
        this.testDrawFlag();
        this.shader.useUniform2ToCurrentShd(this.uniform, this.transUniform);
    }
    reset(): void {
        //  console.log("RPOUnit::reset(), uid: ",this.getUid());
        this.indicesRes = null;
        this.polygonOffset = null;

        this.vro.__$detachThis();
        this.vro = null;
        this.tro.__$detachThis();
        this.tro = null;
        this.texMid = -1;
        this.__$rprouid = -1;
        this.ubo = null;
        this.shdUid = -1;
        this.vtxUid = -1;
        this.uniform = null;
        this.transUniform = null;
        this.partGroup = null;
        this.ivsIndex = 0;
        this.ivsCount = 0;
        this.insCount = 0;
        this.partTotal = 0;
        this.drawMode = 0;
        this.drawFlag = 0x0;
        this.renderState = 0;
        this.rcolorMask = 0;
        this.drawEnabled = true;
        this.shader = null;
        this.bounds = null;
        this.pos = null;
    }
    destroy(): void {
        this.reset();
    }
    toString(): string {
        return "[RPOUnit(uid = " + this.uid + ")]";
    }
}
