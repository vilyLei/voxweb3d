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
import IRPOUnit from "./IRPOUnit";
import IPoolNode from "../../vox/base/IPoolNode";
import { BufRDataPair, ROIndicesRes } from "./vtx/ROIndicesRes";
import IVDRInfo from "./vtx/IVDRInfo";

import IPassGraph from "./pass/IPassGraph";
import DebugFlag from "../debug/DebugFlag";
import IRenderEntity from "./IRenderEntity";

/**
 * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
 * renderer rendering runtime core executable display unit.
 */
export default class RPOUnit implements IRPOUnit {

    rentity: IRenderEntity = null;
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

    partTotal = 0;               // partTotal = partGroup.length
    partGroup: Uint16Array = null;
    visible = true;
    drawEnabled = true;

    renderState = 0;
    rcolorMask = 0;
    // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合
    drawFlag = 0;
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
    rgraph: IPassGraph = null;
    constructor() {
    }
    private testDrawFlag(): void {
        this.drawFlag = (this.rcolorMask << 10) + this.renderState;
        if (this.shader.drawFlag != this.drawFlag) {
            this.shader.drawFlag = this.drawFlag;
            RenderStateObject.UseRenderState(this.renderState);
            RenderColorMask.UseRenderState(this.rcolorMask);
        }
    }
    copyMaterialFrom(unit: RPOUnit): void {
        this.tro = unit.tro;
        this.uniform = unit.uniform;
        this.ubo = unit.ubo;
        this.texMid = unit.texMid;
        // if(this.shdUid != unit.shdUid) {
        //     console.log(">>>>>>> copyMaterialFrom this.shdUid, unit.shdUid: ", this.shdUid, unit.shdUid);
        //     unit.transUniform.uns = "new_unit_trans";
        //     unit.uniform.uns = "new_uniform";
        // }
        this.shdUid = unit.shdUid;
        this.transUniform = unit.transUniform;
    }
    applyShader(force: boolean = false): void {
        this.shader.bindToGpu( this.shdUid );
        if(force) {
            this.shader.resetUniform();
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
        throw Error("illegal operation !!!");
        // console.log("RPOUint::setIvsParam(), ivsIndex: ", ivsIndex, ", ivsCount: ", ivsCount);
        // // this.indicesRes.setIvsParam(ivsIndex, ivsCount);
        // this.rdp.setIvsParam(ivsIndex, ivsCount);
        // this.testVisible();
    }
    testVisible(): void {
        if(!this.rdp.rd) {
            throw Error("illegal operation !!!");
        }
        this.drawEnabled = this.visible && this.rdp.rd.ivsSize > 0;
    }
    setVisible(boo: boolean): void {
        this.visible = boo;
        this.testVisible();
        // if(DebugFlag.Flag_0 > 0) console.log("#### setVisible(): ", boo, "this.drawEnabled: ",this.drawEnabled);
    }
    setDrawFlag(renderState: number, rcolorMask: number): void {
        this.renderState = renderState;
        this.rcolorMask = rcolorMask;
        this.drawFlag = (this.rcolorMask << 10) + this.renderState;
    }

    private m_ver = 0;
    updateVtx(): boolean {
        if(this.vdrInfo.isUnlock()) {

            const rdp = this.rdp;
            rdp.ver = this.m_ver;
            // if(DebugFlag.Flag_0 > 0) {
            //     console.log("AA ---- AA XXXXX RPOUint::updateVtx() ..., rdp.getUid(): ", rdp.getUid());
            //     console.log("           XXXXX RPOUint::updateVtx() ..., rdp.ver: ", rdp.ver);
            // }
            const flag = this.vdrInfo.__$$copyToRDP( rdp );
            this.m_ver = rdp.ver;
            // if(DebugFlag.Flag_0 > 0) {
            //     console.log("BB ---- BB XXXXX RPOUint::updateVtx() ..., this.m_ver: ", this.m_ver);
            // }
            rdp.ver = 0;
    
            this.testVisible();
            // if(DebugFlag.Flag_0 > 0) {
            //     console.log("##### ##### ###### ##### ---------------------- RPOUint::updateVtx() ...");
            // }
            return flag;
        }
        return false;
    }
    draw(rc: IRenderProxy): void {
        throw Error("illegal operation !!!");
    }
    __$$drawThis(rc: IRenderProxy): void {

        const st = rc.status;
        st.drawCallTimes++;

        const rd = this.rdp.rd;
        st.drawTrisNumber += rd.trisNumber;
        // console.log("this.rdp.getUid(): ", this.rdp.getUid());
        // TODO(Vily): 下面这个判断流程需要优化(由于几何数据更改之后上传gpu的动作是一帧上传16个这样的速度下实现的，所以需要下面这句代码来保证不出错: [.WebGL-000037DC02C2B800] GL_INVALID_OPERATION: Insufficient buffer size)
        // let ivsCount = ir.getVTCount();
        let ivsCount = rd.ivsSize;
        // if (this.ivsCount <= ivsCount && ir.isCommon()) ivsCount = this.ivsCount;
        // console.log("runit::drawThis(), ivsCount: ", ivsCount, ",ivsOffset: ", rd.ivsOffset, this.rdp.getUid(), rd.getUid());
        // if(DebugFlag.Flag_0 > 0) {
        //     console.log("runit::drawThis(), ivsCount: ", ivsCount, ",ivsOffset: ", rd.ivsOffset, this.rdp.getUid(), ", rd.getUid(): " ,rd.getUid());
        //     //DebugFlag.Flag_0 = 0;
        // }
        if (this.polygonOffset != null) {
            rc.setPolygonOffset(this.polygonOffset[0], this.polygonOffset[1]);
        }
        else {
            rc.resetPolygonOffset();
        }
        const gl = rc.RContext;
        switch (rd.drawMode) {
            case rdm.ELEMENTS_TRIANGLES:
            case rdm.ELEMENTS_LINES:
            case rdm.ELEMENTS_TRIANGLE_STRIP:
            case rdm.ELEMENTS_LINES_STRIP:
                // console.log("rd.gldm: ", rd.gldm);
                // if(DebugFlag.Flag_0 > 0)console.log("RPOUnit::run(), drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+"),drawOffset: "+this.drawOffset);
                //rc.RContext.drawElements(rc.TRIANGLES, this.ivsCount, rd.ibufType,this.ivsIndex * this.ibufStep);
                gl.drawElements(rd.gldm, ivsCount, rd.bufType, rd.ivsOffset);
                break;
            case rdm.ELEMENTS_INSTANCED_TRIANGLES:
            case rdm.ELEMENTS_INSTANCED_LINES:
            case rdm.ELEMENTS_INSTANCED_TRIANGLES_STRIP:
            case rdm.ELEMENTS_INSTANCED_LINES_STRIP:
                //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, rd.bufType, this.ivsIndex * this.ibufStep, this.insCount);
                gl.drawElementsInstanced(rd.gldm, ivsCount, rd.bufType, rd.ivsOffset, rd.insCount);
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
    __$$drawPart(rc: IRenderProxy): void {

        const st = rc.status;
        st.drawCallTimes++;

        // const ir = this.indicesRes;
        const rd = this.rdp.rd;
        st.drawTrisNumber += rd.trisNumber;
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
            case rdm.ELEMENTS_LINES:
            case rdm.ELEMENTS_TRIANGLE_STRIP:
            case rdm.ELEMENTS_LINES_STRIP:
                for (; i < this.partTotal;) {
                    // 这里面可以增加一个回调函数,这个回调函数可以对uniform(或者transformUniform)做一些数据改变，进而来控制相应的状态
                    // 因此可以通过改变uniform实现大量的显示绘制
                    //  let count:number = this.partGroup[i++];
                    //  let offset:number = this.partGroup[i++];
                    //  gl.drawElements(rc.TRIANGLES, count, this.ibufType, offset);
                    gl.drawElements(rd.gldm, this.partGroup[i++], rd.bufType, this.partGroup[i++]);
                }
                break;
            case rdm.ELEMENTS_INSTANCED_TRIANGLES:
            case rdm.ELEMENTS_INSTANCED_LINES:
            case rdm.ELEMENTS_INSTANCED_TRIANGLES_STRIP:
            case rdm.ELEMENTS_INSTANCED_LINES_STRIP:
                //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
                gl.drawElementsInstanced(rd.gldm, ivsCount, rd.bufType, rd.ivsOffset, rd.insCount);
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
            this.partTotal = 0;
            
            this.drawFlag = 0x0;
            this.renderState = 0;
            this.rcolorMask = 0;
            this.drawEnabled = true;
            this.shader = null;
            this.bounds = null;
            this.pos = null;
            if(this.rdp) {
                if(this.rdp.lifeTime > 0)this.rdp.clear();
                this.rdp = null;
            }
            this.vdrInfo = null;
            this.rgraph = null;
            this.rentity = null;
        }
    }
    destroy(): void {
        this.reset();
    }
}
