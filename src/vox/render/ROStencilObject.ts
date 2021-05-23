/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import {RODrawState as DrawState} from "../../vox/render/RODrawState";

export class ROStencilObject {
    private static s_uid: number = 0;
    private static s_state: number = -1;
    private static s_states: ROStencilObject[] = [];
    private static s_statesLen: number = 1;
    private static m_blendMode: number = -1;
    private static s_depthTestMode: number = -1;
    private static s_stsMap: Map<number, ROStencilObject> = new Map();
    private static s_stsNameMap: Map<string, ROStencilObject> = new Map();
    private static s_unlocked: boolean = true;
    static NORMAL_STATE: number = 0;
    static BACK_CULLFACE_NORMAL_STATE: number = 0;
    static FRONT_CULLFACE_NORMAL_STATE: number = 1;
    static NONE_CULLFACE_NORMAL_STATE: number = 2;
    static ALL_CULLFACE_NORMAL_STATE: number = 3;
    static BACK_NORMAL_ALWAYS_STATE: number = 4;
    static BACK_TRANSPARENT_STATE: number = 5;
    static BACK_TRANSPARENT_ALWAYS_STATE: number = 6;
    static NONE_TRANSPARENT_STATE: number = 7;
    static Rstate: DrawState = null;
    private m_uid: number = -1;
    private m_cullFaceMode: number = 0;
    // blend mode
    private m_blendMode: number = 0;
    // depth test type mode
    private m_depthTestMode: number = 0;
    // shadow status Mode(receive | make | receive and make | none)
    private m_shadowMode: number = 0;
    private m_state: number = 0;
    constructor(cullFaceMode: number, blendMode: number, depthTestMode: number) {
        this.m_uid = ROStencilObject.s_uid++;
        this.m_cullFaceMode = cullFaceMode;
        this.m_blendMode = blendMode;
        this.m_depthTestMode = depthTestMode;
        this.m_state = this.m_shadowMode << 12 | this.m_depthTestMode << 8 | this.m_blendMode << 4 | this.m_cullFaceMode;
    }
    getUid(): number {
        return this.m_uid;
    }
    getState(): number {
        return this.m_state;
    }
    getCullFaceMode(): number {
        return this.m_cullFaceMode;
    }
    getDepthTestMode(): number {
        return this.m_depthTestMode;
    }
    getBlendMode(): number {
        return this.m_blendMode;
    }
    use(): void {
        if (ROStencilObject.s_state != this.m_uid) {
            //  console.log("this.m_uid: ",this.m_uid);
            //  console.log("ROStencilObject::use(), m_blendMode: "+this.m_blendMode+",m_depthTestMode: "+this.m_depthTestMode+", m_uid: "+this.m_uid);
            ROStencilObject.Rstate.setCullFaceMode(this.m_cullFaceMode);
            //ROStencilObject.Rstate.setBlendMode(this.m_blendMode);
            if (ROStencilObject.m_blendMode < 0) {
                ROStencilObject.Rstate.setBlendMode(this.m_blendMode);
            }
            else {
                ROStencilObject.Rstate.setBlendMode(ROStencilObject.m_blendMode);
            }
            //ROStencilObject.Rstate.setDepthTestMode(this.m_depthTestMode);
            if (ROStencilObject.s_depthTestMode < 0) {
                ROStencilObject.Rstate.setDepthTestMode(this.m_depthTestMode);
            }
            else {
                ROStencilObject.Rstate.setDepthTestMode(ROStencilObject.s_depthTestMode);
            }
            //
            ROStencilObject.s_state = this.m_uid;
        }
    }
    static Create(objName: string, cullFaceMode: number, blendMode: number, depthTestMode: number): number {
        if (ROStencilObject.s_stsNameMap.has(objName)) {
            let po: ROStencilObject = ROStencilObject.s_stsNameMap.get(objName);
            return po.getUid();
        }
        let key: number = depthTestMode << 8 | blendMode << 4 | cullFaceMode;
        if (ROStencilObject.s_stsMap.has(key)) {
            let po = ROStencilObject.s_stsMap.get(key);
            key = po.getUid();
        }
        else {
            let po: ROStencilObject = new ROStencilObject(cullFaceMode, blendMode, depthTestMode);
            key = po.getUid();
            ROStencilObject.s_stsMap.set(key, po);
            ROStencilObject.s_stsNameMap.set(objName, po);
            ROStencilObject.s_states.push(po);
            ++ROStencilObject.s_statesLen;
        }
        return key;
    }
    static GetRenderStateByName(objName: string): number {
        if (ROStencilObject.s_stsNameMap.has(objName)) {
            let po = ROStencilObject.s_stsNameMap.get(objName);
            return po.getUid();
        }
        return -1;
    }
    // @param           state come from RODisp::renderState
    static UseRenderState(state: number) {
        //if(ROStencilObject.s_unlocked && ROStencilObject.Rstate.roState != state)                
        if (ROStencilObject.s_unlocked && ROStencilObject.s_state != state) {
            if (state > -1 && state < ROStencilObject.s_statesLen) {
                ROStencilObject.s_states[state].use();
            }
        }
    }
    static UseRenderStateByName(stateName: string): void {
        if (ROStencilObject.s_unlocked) {
            let state: number = ROStencilObject.GetRenderStateByName(stateName);
            //trace("state: "+state+", stateName: "+stateName);
            //if(ROStencilObject.Rstate.roState != state)
            if (ROStencilObject.s_state != state) {
                if (state > -1 && state < ROStencilObject.s_statesLen) {
                    ROStencilObject.s_states[state].use();
                }
            }
        }
    }
    static UnlockBlendMode(): void {
        ROStencilObject.m_blendMode = -1;
    }
    static LockBlendMode(cullFaceMode: number): void {
        ROStencilObject.m_blendMode = cullFaceMode;
    }
    static UnlockDepthTestMode(): void {
        ROStencilObject.s_depthTestMode = -1;
    }
    static LockDepthTestMode(depthTestMode: number): void {
        ROStencilObject.s_depthTestMode = depthTestMode;
    }
    static Lock(): void {
        ROStencilObject.s_unlocked = false;
    }
    static Unlock(): void {
        ROStencilObject.s_unlocked = true;
    }
    static Reset(): void {
        ROStencilObject.s_state = -1;
    }
}


export class RODrawState {
    private m_blendMode: number = RenderBlendMode.NORMAL;
    private m_cullMode: number = CullFaceMode.NONE;
    private m_depthTestType: number = DepthTestMode.DISABLE;
    private s_blendDisabled: boolean = true;
    private s_cullDisabled: boolean = true;
    private m_gl: any = null;

    public roColorMask: number = -11;
    //public drawcallTimes:number = 0;
    constructor() {
    }
    reset(): void {
        //  this.m_blendMode = RenderBlendMode.NORMAL;
        //  this.m_cullMode = CullFaceMode.NONE;
        //  this.m_depthTestType = DepthTestMode.DISABLE;
        this.roColorMask = -11;
    }
    setRenderer(gl: any): void {
        this.m_gl = gl;
    }
    setColorMask(mr: boolean, mg: boolean, mb: boolean, ma: boolean): void {
        this.m_gl.colorMask(mr, mg, mb, ma);
    }
    setCullFaceMode(mode: number): void {
        switch (mode) {
            case CullFaceMode.BACK:
                if (this.m_cullMode != mode) {
                    this.m_cullMode = mode;
                    if (this.s_cullDisabled) { this.s_cullDisabled = false; this.m_gl.enable(this.m_gl.CULL_FACE); }
                    this.m_gl.cullFace(this.m_gl.BACK);
                }
                break;
            case CullFaceMode.FRONT:
                if (this.m_cullMode != mode) {
                    this.m_cullMode = mode;
                    if (this.s_cullDisabled) { this.s_cullDisabled = false; this.m_gl.enable(this.m_gl.CULL_FACE); }
                    this.m_gl.cullFace(this.m_gl.FRONT);
                }
                break;
            case CullFaceMode.FRONT_AND_BACK:
                if (this.m_cullMode != mode) {
                    this.m_cullMode = mode;
                    if (this.s_cullDisabled) { this.s_cullDisabled = false; this.m_gl.enable(this.m_gl.CULL_FACE); }
                    this.m_gl.cullFace(this.m_gl.FRONT_AND_BACK);
                }
                break;
            case CullFaceMode.NONE:
            case CullFaceMode.DISABLE:
                if (this.m_cullMode != mode) {
                    this.m_cullMode = mode;
                    if (!this.s_cullDisabled) {
                        this.s_cullDisabled = true;
                        this.m_gl.disable(this.m_gl.CULL_FACE);
                    }
                }
                break;
            default:
                break;
        }
    }
    setBlendMode(mode: number): void {
        if (this.m_blendMode != mode) {
            //trace("this.m_blendMode: "+this.m_blendMode + ","+mode);
            this.m_blendMode = mode;
            switch (mode) {
                case RenderBlendMode.NORMAL:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.ZERO);
                    //trace("use blendMode NORMAL.");
                    break;
                case RenderBlendMode.TRANSPARENT:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.SRC_ALPHA, this.m_gl.ONE_MINUS_SRC_ALPHA);
                    //trace("use blendMode TRANSPARENT.");
                    break;
                case RenderBlendMode.ALPHA_ADD:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case RenderBlendMode.ADD:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.SRC_ALPHA, this.m_gl.ONE);
                    //trace("use blendMode ADD.");
                    break;
                case RenderBlendMode.ADD2:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.ONE);
                    break;
                case RenderBlendMode.INVERSE_ALPHA:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.ONE, this.m_gl.SRC_ALPHA);
                    break;
                case RenderBlendMode.BLAZE:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.SRC_COLOR, this.m_gl.ONE);
                    break;
                case RenderBlendMode.OVERLAY:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.DST_COLOR, this.m_gl.DST_ALPHA);
                    break;
                case RenderBlendMode.OVERLAY2:
                    if (this.s_blendDisabled) { this.m_gl.enable(this.m_gl.BLEND); this.s_blendDisabled = false; this.m_gl.blendEquation(this.m_gl.FUNC_ADD); }
                    this.m_gl.blendFunc(this.m_gl.DST_COLOR, this.m_gl.SRC_ALPHA);
                    break;
                case RenderBlendMode.DISABLE:
                    if (!this.s_blendDisabled) { this.m_gl.disable(this.m_gl.BLEND); this.s_blendDisabled = true; }
                    break;
                default:
                    break;
            }
        }
    }
    setDepthTestMode(type: number): void {
        if (this.m_depthTestType != type) {
            this.m_depthTestType = type;
            //trace("RendererBase::setDepthTest(),type：",std::to_string(static_cast<int>(type)));

            switch (type) {
                case DepthTestMode.ALWAYS:
                    //console.log("ALWAYS type: ", type,this.m_gl.ALWAYS);
                    this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.ALWAYS);
                    break;
                case DepthTestMode.SKY:
                    this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.LEQUAL);
                    break;
                case DepthTestMode.OPAQUE:
                    //console.log("OPAQUE type: ", type,this.m_gl.LESS);
                    this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.LESS);
                    break;
                case DepthTestMode.OPAQUE_OVERHEAD:
                    this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.EQUAL);
                    break;
                case DepthTestMode.DECALS:
                    this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.LEQUAL);
                    break;
                case DepthTestMode.BLEND:
                    //if (list.next != null) list = sortByAverageZ(list);
                    this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.LESS);
                    break;
                case DepthTestMode.WIRE_FRAME:
                    this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.LEQUAL);
                    break;
                case DepthTestMode.NEXT_LAYER:
                    this.m_gl.depthMask(false); this.m_gl.depthFunc(this.m_gl.ALWAYS);
                    break;
                case DepthTestMode.TRUE_EQUAL:
                    this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.EQUAL);
                    break;
                case DepthTestMode.TRUE_GREATER:
                    this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.GREATER);
                    break;
                case DepthTestMode.TRUE_GEQUAL:
                    this.m_gl.depthMask(true); this.m_gl.depthFunc(this.m_gl.GEQUAL);
                    break;
                case DepthTestMode.WIRE_FRAME_NEXT:
                    break;
                default:
                    break;
            }
        }
    }
}