/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IAABB from "../../vox/geom/IAABB";
import { RenderDrawMode as rdm } from "../../vox/render/RenderConst";
import IVertexRenderObj from "../../vox/render/IVertexRenderObj";

import IRenderShader from "../../vox/render/IRenderShader";
import ITextureRenderObj from "../../vox/render/ITextureRenderObj";

import { RenderColorMask } from "../../vox/render/rendering/RenderColorMask";
import { RenderStateObject } from "../../vox/render/rendering/RenderStateObject";

import IRenderProxy from "../../vox/render/IRenderProxy";
import ShaderUBO from "../../vox/material/ShaderUBO";
import IRenderShaderUniform from "./uniform/IRenderShaderUniform";
import IRPODisplay from "../../vox/render/IRPODisplay";
import IPoolNode from "../../vox/base/IPoolNode";
import { BufRDataPair, ROIndicesRes } from "./vtx/ROIndicesRes";
import IVDRInfo from "./vtx/IVDRInfo";
import DebugFlag from "../debug/DebugFlag";

/**
 * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
 * renderer rendering runtime core executable display unit.
 */
export default class RPOUnit implements IPoolNode, IRPODisplay {

    uid = -1;
    value = -1;
    // 记录自身和RPONode的对应关系
    __$rpuid = -1;
    // renderProcess uid
    __$rprouid = -1;
    shader: IRenderShader = null;
    // 这个posotion和bounds的center会是同一个实例
    pos: IVector3D = null;
    bounds: IAABB = null;
    // 记录对应的RODisplay的渲染所需的状态数据
    // ibufType = 0;                // UNSIGNED_SHORT or UNSIGNED_INT
    // ibufStep = 2;                // 2 or 4
    // ivsIndex = 0;
    // ivsCount = 0;
    insCount = 0;
    // drawOffset = 0;

    partTotal = 0;               // partTotal = partGroup.length
    partGroup: Uint16Array = null;
    trisNumber = 0;
    visible = true;
    drawEnabled = true;
    // drawMode = 0;

    renderState = 0;
    rcolorMask = 0;
    // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合
    drawFlag: number = 0;
    indicesRes: ROIndicesRes;
    vro: IVertexRenderObj = null;

    // transform uniform
    transUniform: IRenderShaderUniform = null;
    // materiall uniform
    uniform: IRenderShaderUniform = null;
    // 记录 material 对应的 shader program uid
    shdUid = -1;
    vtxUid = -1;
    // record tex group
    tro: ITextureRenderObj = null;
    texMid = -1;
    ubo: ShaderUBO = null;
    /**
     *  for example: [-70.0,1.0]
     */
    polygonOffset: number[] = null;
    rdp: BufRDataPair = null;
    vdrInfo: IVDRInfo = null;
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
        console.log("RPOUint::setIvsParam(), ivsIndex: ", ivsIndex, ", ivsCount: ", ivsCount);
        // this.indicesRes.setIvsParam(ivsIndex, ivsCount);
        this.rdp.setIvsParam(ivsIndex, ivsCount);
        this.testVisible();
    }
    private testVisible(): void {
        this.drawEnabled = this.visible && this.indicesRes.rdp.rd.ivsSize > 0;
    }
    setVisible(boo: boolean): void {
        this.visible = boo;
        this.testVisible();
        // if(DebugFlag.Flag_0 > 0) console.log("#### setVisible(): ", boo, "this.drawEnabled: ",this.drawEnabled);
    }
    setDrawFlag(renderState: number, rcolorMask: number): void {
        this.renderState = renderState;
        this.rcolorMask = rcolorMask;
        this.drawFlag = (rcolorMask << 10) + renderState;
    }
    drawThis(rc: IRenderProxy): void {

        const st = rc.status;
        st.drawCallTimes++;
        st.drawTrisNumber += this.trisNumber;
        // const ir = this.indicesRes;
        const rd = this.rdp.rd;
        // console.log("this.rdp.getUid(): ", this.rdp.getUid());
        // TODO(Vily): 下面这个判断流程需要优化(由于几何数据更改之后上传gpu的动作是一帧上传16个这样的速度下实现的，所以需要下面这句代码来保证不出错: [.WebGL-000037DC02C2B800] GL_INVALID_OPERATION: Insufficient buffer size)
        // let ivsCount = ir.getVTCount();
        let ivsCount = rd.ivsSize;
        // if (this.ivsCount <= ivsCount && ir.isCommon()) ivsCount = this.ivsCount;
        // console.log("runit::drawThis(), ivsCount: ", ivsCount, ",ivsOffset: ", rd.ivsOffset, this.rdp.getUid(), rd.getUid());
        if (this.polygonOffset != null) {
            rc.setPolygonOffset(this.polygonOffset[0], this.polygonOffset[1]);
        }
        else {
            rc.resetPolygonOffset();
        }
        let gl = rc.RContext;
        switch (rd.drawMode) {
            case rdm.ELEMENTS_TRIANGLES:
                // if(DebugFlag.Flag_0 > 0)console.log("RPOUnit::run(), TRIANGLES drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+"),drawOffset: "+this.drawOffset);
                //rc.RContext.drawElements(rc.TRIANGLES, this.ivsCount, rd.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLES, ivsCount, rd.bufType, rd.ivsOffset);
                break;
            case rdm.ELEMENTS_LINES:
                // console.log("RPOUnit::run(), ELEMENTS_LINES drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+"),drawOffset: "+this.drawOffset);
                //rc.RContext.drawElements(rc.ELEMENTS_LINES, this.ivsCount, rd.bufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.LINES, ivsCount, rd.bufType, rd.ivsOffset);
                break;
            case rdm.ELEMENTS_TRIANGLE_STRIP:
                //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, rd.bufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLE_STRIP, ivsCount, rd.bufType, rd.ivsOffset);
                break;
            case rdm.ELEMENTS_INSTANCED_TRIANGLES:
                //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, rd.bufType, this.ivsIndex * this.ibufStep, this.insCount);
                gl.drawElementsInstanced(rc.TRIANGLES, ivsCount, rd.bufType, rd.ivsOffset, this.insCount);
                break;
            case rdm.ELEMENTS_TRIANGLE_FAN:
                //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, rd.bufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLE_FAN, ivsCount, rd.bufType, rd.ivsOffset);
                break;
            case rdm.ARRAYS_LINES:
                //console.log("RPOUnit::run(), ARRAYS_LINES drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                gl.drawArrays(rc.LINES, rd.ivsIndex, ivsCount);
                break;
            case rdm.ARRAYS_LINE_STRIP:
                //console.log("RPOUnit::run(), ARRAYS_LINE_STRIP drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                gl.drawArrays(rc.LINE_STRIP, rd.ivsIndex, ivsCount);
                break;
            default:
                break;
        }
    }

    drawPart(rc: IRenderProxy): void {

        const st = rc.status;
        st.drawCallTimes++;
        st.drawTrisNumber += this.trisNumber;

        // const ir = this.indicesRes;
        const rd = this.rdp.rd;
        // TODO(Vily): 下面这个判断流程需要优化(由于几何数据更改之后上传gpu的动作是一帧上传16个这样的速度下实现的，所以需要下面这句代码来保证不出错: [.WebGL-000037DC02C2B800] GL_INVALID_OPERATION: Insufficient buffer size)
        let ivsCount = rd.ivsSize;
        // if (this.ivsCount <= ivsCount && ir.isCommon()) ivsCount = this.ivsCount;
        if (this.polygonOffset != null) {
            rc.setPolygonOffset(this.polygonOffset[0], this.polygonOffset[1]);
        }
        else {
            rc.resetPolygonOffset();
        }

        let i = 0;
        let gl = rc.RContext;
        switch (rd.drawMode) {
            case rdm.ELEMENTS_TRIANGLES:
                for (; i < this.partTotal;) {
                    // 这里面可以增加一个回调函数,这个回调函数可以对uniform(或者transformUniform)做一些数据改变，进而来控制相应的状态
                    // 因此可以通过改变uniform实现大量的显示绘制
                    //  let count:number = this.partGroup[i++];
                    //  let offset:number = this.partGroup[i++];
                    //  gl.drawElements(rc.TRIANGLES, count, this.ibufType, offset);
                    gl.drawElements(rc.TRIANGLES, this.partGroup[i++], rd.bufType, this.partGroup[i++]);
                }
                break;
            case rdm.ELEMENTS_LINES:
                for (; i < this.partTotal;) {
                    // 这里面可以增加一个回调函数,这个回调函数可以对uniform(或者transformUniform)做一些数据改变，进而来控制相应的状态
                    // 因此可以通过改变uniform实现大量的显示绘制
                    //  let count:number = this.partGroup[i++];
                    //  let offset:number = this.partGroup[i++];
                    //  gl.drawElements(rc.TRIANGLES, count, this.ibufType, offset);
                    gl.drawElements(rc.LINES, this.partGroup[i++], rd.bufType, this.partGroup[i++]);
                }
                break;
            case rdm.ELEMENTS_TRIANGLE_STRIP:
                //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLE_STRIP, ivsCount, rd.bufType, rd.ivsOffset);
                break;
            case rdm.ELEMENTS_INSTANCED_TRIANGLES:
                //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
                gl.drawElementsInstanced(rc.TRIANGLES, ivsCount, rd.bufType, rd.ivsOffset, this.insCount);
                break;
            case rdm.ELEMENTS_TRIANGLE_FAN:
                //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rc.TRIANGLE_FAN, ivsCount, rd.bufType, rd.ivsOffset);
                break;
            case rdm.ARRAYS_LINES:
                //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                gl.drawArrays(rc.LINES, rd.ivsIndex, ivsCount);
                break;
            case rdm.ARRAYS_LINE_STRIP:
                //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                gl.drawArrays(rc.LINE_STRIP, rd.ivsIndex, ivsCount);
                break;
            default:
                break;
        }
    }
    run2(rc: IRenderProxy): void {
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
    run(rc: IRenderProxy): void {
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

    runLockMaterial2(puniform: IRenderShaderUniform): void {
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
        if (this.vdrInfo) {

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
            // this.ivsIndex = 0;
            // this.ivsCount = 0;
            this.insCount = 0;
            this.partTotal = 0;
            // this.drawMode = 0;
            this.drawFlag = 0x0;
            this.renderState = 0;
            this.rcolorMask = 0;
            this.drawEnabled = true;
            this.shader = null;
            this.bounds = null;
            this.pos = null;
            this.vdrInfo = null;
            this.rdp = null;
        }
    }
    destroy(): void {
        this.reset();
    }
}
