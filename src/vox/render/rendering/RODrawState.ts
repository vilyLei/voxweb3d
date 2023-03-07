/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { RenderBlendMode, CullFaceMode, DepthTestMode, GLBlendEquation } from "../RenderConst";
import { IRAdapterContext } from "../IRAdapterContext";
import { IRODrawState } from "./IRODrawState";

class ROStateUnit {
    constructor(){}
    stencilMask: number = -1;
}

export class RODrawState implements IRODrawState {

    private m_units: ROStateUnit[] = new Array(128);
    private m_unit:ROStateUnit = null;
    private m_blendMode: number = RenderBlendMode.NORMAL;
    private m_cullMode: number = CullFaceMode.NONE;
    private m_depthTestType: number = DepthTestMode.DISABLE;
    private m_cullDisabled: boolean = true;
    private m_context: IRAdapterContext = null;
    private m_gl: any = null;
    public roColorMask: number = -11;
    constructor() {
    }
    reset(): void {
        this.roColorMask = -11;
    }
    setRenderContext(context: IRAdapterContext): void {
        this.m_context = context;
        this.m_gl = context.getRC();
        let rcui = this.m_gl.rcuid as number;
        this.m_unit = this.m_units[rcui];
        if(this.m_unit == null) {
            this.m_unit = this.m_units[rcui] = new ROStateUnit();
        }
    }
    setColorMask(mr: boolean, mg: boolean, mb: boolean, ma: boolean): void {
        this.m_gl.colorMask(mr, mg, mb, ma);
    }
    setStencilFunc(func:number, ref:number, mask:number): void {
        this.m_gl.stencilFunc( func, ref, mask );
    }
    setStencilMask(mask:number): void {
        if(this.m_unit.stencilMask != mask && mask >= 0) {
            this.m_unit.stencilMask = mask;
            this.m_gl.stencilMask( mask );
        }
    }
    setStencilOp(fail: number, zfail: number, zpass: number): void {
        this.m_gl.stencilOp( fail, zfail, zpass );
    }
    setDepthTestEnable(enable:boolean): void {
        if(enable) {
            this.m_gl.enable(this.m_gl.DEPTH_TEST);
        }
        else {
            this.m_gl.disable(this.m_gl.DEPTH_TEST);
        }
    }
    setCullFaceEnable(enable:boolean): void {
        if(enable) {
            this.m_gl.enable(this.m_gl.CULL_FACE);
        }
        else {
            this.m_gl.disable(this.m_gl.CULL_FACE);
        }
    }
    setBlendEnable(enable:boolean): void {
        if(enable) {
            this.m_gl.enable(this.m_gl.BLEND);
        }
        else {
            this.m_gl.disable(this.m_gl.BLEND);
        }
    }
    setCullFaceMode(mode: number): void {
        // console.log("this.m_cullMode,mode: ", this.m_cullMode,mode);
        if (this.m_cullMode != mode) {
            this.m_cullMode = mode;
            if(mode != CullFaceMode.NONE) {
                if (this.m_cullDisabled) { this.m_cullDisabled = false; this.m_gl.enable(this.m_gl.CULL_FACE); }
                this.m_gl.cullFace(mode);
            }
            else if (!this.m_cullDisabled) {
                this.m_cullDisabled = true;
                this.m_gl.disable(this.m_gl.CULL_FACE);
            }
        }
    }
    setBlendMode(mode: number, params: number[]): void {
        if (this.m_blendMode != mode) {
            this.m_blendMode = mode;
            if(mode > 0) {

                if(params[0] < 1) {
                    //FUNC_ADD
                    // this.m_gl.blendEquation(this.m_gl.FUNC_ADD);
                    // this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.ZERO);
                    this.m_gl.blendEquation(params[1]);
                    this.m_gl.blendFunc(params[3], params[4]);
                }
                else {
                    this.m_gl.blendEquationSeparate(params[1], params[2]);
                    this.m_gl.blendFuncSeparate(params[3], params[4],params[5], params[6]);
                }
            }
            else {
                this.m_gl.disable(this.m_gl.BLEND);
            }
        }
    }
    getDepthTestMode(): number {
        return this.m_depthTestType;
    }
	setDepthTestMode(type: number): void {

        if (this.m_depthTestType != type) {
            const gl = this.m_gl;
            const DTM = DepthTestMode;
            this.m_depthTestType = type;
            //trace("RendererBase::setDepthTest(),type：",std::to_string(static_cast<int>(type)));

            switch (type) {
                case DTM.ALWAYS:
                    //console.log("ALWAYS type: ", type,gl.ALWAYS);
                    gl.depthMask(false); gl.depthFunc(gl.ALWAYS);
                    break;
                case DTM.SKY:
                    gl.depthMask(true); gl.depthFunc(gl.LEQUAL);
                    break;
                case DTM.OPAQUE:
                    //console.log("OPAQUE type: ", type,gl.LESS);
                    gl.depthMask(true); gl.depthFunc(gl.LESS);
                    break;
                case DTM.OPAQUE_OVERHEAD:
                    gl.depthMask(false); gl.depthFunc(gl.EQUAL);
                    break;
                case DTM.DECALS:
                    gl.depthMask(false); gl.depthFunc(gl.LEQUAL);
                    break;
                case DTM.BLEND:
                    gl.depthMask(false); gl.depthFunc(gl.LESS);
                    break;
                case DTM.WIRE_FRAME:
                    gl.depthMask(true); gl.depthFunc(gl.LEQUAL);
                    break;
                case DTM.NEXT_LAYER:
                    gl.depthMask(false); gl.depthFunc(gl.ALWAYS);
                    break;
                case DTM.TRUE_EQUAL:
                    gl.depthMask(true); gl.depthFunc(gl.EQUAL);
                    break;
                case DTM.TRUE_GREATER:
                    gl.depthMask(true); gl.depthFunc(gl.GREATER);
                    break;
                case DTM.TRUE_GEQUAL:
                    gl.depthMask(true); gl.depthFunc(gl.GEQUAL);
                    break;
                case DTM.WIRE_FRAME_NEXT:
                    break;
                default:
                    break;
            }
        }
    }
}
