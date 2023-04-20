/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { GLBlendEquation } from "../../../vox/render/RenderConst";
import { IRODrawState } from "../../../vox/render/rendering/IRODrawState";

export class RenderStateObject {

    private static s_uid: number = 0;
    private static s_state: number = -1;
    private static s_states: RenderStateObject[] = [];
    private static s_statesLen: number = 1;
    private static m_blendMode: number = -1;
    private static s_depthTestMode: number = -1;
    private static s_stsMap: Map<number, RenderStateObject> = new Map();
    private static s_stsNameMap: Map<string, RenderStateObject> = new Map();
    private static s_blendModeNameMap: Map<string, number> = new Map();
    private static s_blendModeIndexMap: Map<number, number> = new Map();
    private static s_blendModeIndex: number = 0;
    private static s_blendModes: number[][] = new Array(256);
    private static s_unlocked: boolean = true;

    static Rstate: IRODrawState = null;

    private m_uid: number = -1;
    private m_cullFaceMode: number = 0;
    // blend mode
    private m_blendMode: number = 0;
    // depth test type mode
    private m_depthTestMode: number = 0;
    // shadow status Mode(receive | make | receive and make | none)
    private m_shadowMode: number = 0;

    constructor(cullFaceMode: number, blendMode: number, depthTestMode: number) {
        this.m_uid = RenderStateObject.s_uid++;
        this.m_cullFaceMode = cullFaceMode;
        this.m_blendMode = blendMode;
        this.m_depthTestMode = depthTestMode;
    }
    getUid(): number {
        return this.m_uid;
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

        if (RenderStateObject.s_state != this.m_uid) {

            //console.log("RenderStateObject this.m_uid: ",this.m_uid);

            RenderStateObject.Rstate.setCullFaceMode(this.m_cullFaceMode);
            //RenderStateObject.Rstate.setBlendMode(this.m_blendMode);
            let list: number[] = RenderStateObject.s_blendModes[RenderStateObject.m_blendMode];
            if (RenderStateObject.m_blendMode < 0) {
                RenderStateObject.Rstate.setBlendMode(this.m_blendMode, RenderStateObject.s_blendModes[this.m_blendMode]);
            }
            else {
                RenderStateObject.Rstate.setBlendMode(RenderStateObject.m_blendMode,RenderStateObject.s_blendModes[RenderStateObject.m_blendMode]);
            }
            if (RenderStateObject.s_depthTestMode < 0) {
                RenderStateObject.Rstate.setDepthTestMode(this.m_depthTestMode);
            }
            else {
                RenderStateObject.Rstate.setDepthTestMode(RenderStateObject.s_depthTestMode);
            }
            //
            RenderStateObject.s_state = this.m_uid;
        }
    }

    static CreateBlendModeSeparate(name:string, srcRGB: number, dstRGB: number, srcAlpha: number, dstAlpha: number, equationRGB: number = 0, equationAlpha: number = 0): number {
        if(name != null && name != "") {

            let b: number;
            if (RenderStateObject.s_blendModeNameMap.has(name)) {
                b = RenderStateObject.s_blendModeNameMap.get(name);
                return RenderStateObject.s_blendModeIndexMap.get(b);
            }
            if(equationRGB < 1) {
                equationRGB = GLBlendEquation.FUNC_ADD;
            }
            if(equationAlpha < 1) {
                equationAlpha = GLBlendEquation.FUNC_ADD;
            }
            let type: number = 1;
            b = 31;
            b = b * 131 + srcRGB;
            b = b * 131 + dstRGB;
            if(srcAlpha > 0 && dstAlpha > 0) {
                b = b * 131 + srcAlpha;
                b = b * 131 + dstAlpha;
                type = 1;
            }
            if (RenderStateObject.s_blendModeIndexMap.has(b)) {
                console.warn("This blendmode value already exists, its name is "+name+".");
                RenderStateObject.s_blendModeNameMap.set(name,b);
                return RenderStateObject.s_blendModeIndexMap.get(b);
            }
            let index: number = ++RenderStateObject.s_blendModeIndex;

            RenderStateObject.s_blendModeNameMap.set(name,b);
            RenderStateObject.s_blendModeIndexMap.set(b, index);
            let list:number[] = [type, equationRGB, equationAlpha, srcRGB, dstRGB, srcAlpha, dstAlpha];
            RenderStateObject.s_blendModes[index] = list;
            return index;
        }
        return 0;
    }

    static CreateBlendMode(name:string, srcColor: number, dstColor: number, blendEquation: number = 0): number {
        if(name != null && name != "") {

            let b: number;
            if (RenderStateObject.s_blendModeNameMap.has(name)) {
                b = RenderStateObject.s_blendModeNameMap.get(name);
                return RenderStateObject.s_blendModeIndexMap.get(b);
            }
            if(blendEquation < 1) {
                blendEquation = GLBlendEquation.FUNC_ADD;
            }
            let type: number = 0;
            b = 31;
            b = b * 131 + srcColor;
            b = b * 131 + dstColor;
            if (RenderStateObject.s_blendModeIndexMap.has(b)) {
                return RenderStateObject.s_blendModeIndexMap.get(b);
            }
            let index: number = ++RenderStateObject.s_blendModeIndex;

            RenderStateObject.s_blendModeNameMap.set(name,b);
            RenderStateObject.s_blendModeIndexMap.set(b, index);
            let list:number[] = [type, blendEquation, 0, srcColor, dstColor, 0, 0];
            //console.log("list: ",list);
            RenderStateObject.s_blendModes[index] = list;
            return index;
        }
        return 0;
    }
    static Create(objName: string, cullFaceMode: number, blendMode: number, depthTestMode: number): number {
        if (RenderStateObject.s_stsNameMap.has(objName)) {
            let po = RenderStateObject.s_stsNameMap.get(objName);
            return po.getUid();
        }
        //let key: number = depthTestMode << 8 | blendMode << 4 | cullFaceMode;
        let key = 31;
        key = key * 131 + depthTestMode;
        key = key * 131 + blendMode;
        key = key * 131 + cullFaceMode;
        if (RenderStateObject.s_stsMap.has(key)) {
            let po = RenderStateObject.s_stsMap.get(key);
            key = po.getUid();
			if(objName != "") {
				RenderStateObject.s_stsNameMap.set(objName, po);
			}
        }
        else {
			if(objName == "") {
				objName = "sys_rst_"+key;
			}
            let po = new RenderStateObject(cullFaceMode, blendMode, depthTestMode);
            key = po.getUid();
            RenderStateObject.s_stsMap.set(key, po);
            RenderStateObject.s_stsNameMap.set(objName, po);
            RenderStateObject.s_states.push(po);
            ++RenderStateObject.s_statesLen;
        }
        return key;
    }
    static GetRenderStateByName(objName: string): number {
        if (RenderStateObject.s_stsNameMap.has(objName)) {
            let po = RenderStateObject.s_stsNameMap.get(objName);
            return po.getUid();
        }
        return -1;
    }
    // @param           state come from RODisp::renderState
    static UseRenderState(state: number) {
        //if(RenderStateObject.s_unlocked && RenderStateObject.Rstate.roState != state)
        if (RenderStateObject.s_unlocked && RenderStateObject.s_state != state) {
            if (state > -1 && state < RenderStateObject.s_statesLen) {
                RenderStateObject.s_states[state].use();
            }
        }
    }
    static UseRenderStateByName(stateName: string): void {
        if (RenderStateObject.s_unlocked) {
            let state: number = RenderStateObject.GetRenderStateByName(stateName);
            //trace("state: "+state+", stateName: "+stateName);
            //if(RenderStateObject.Rstate.roState != state)
            if (RenderStateObject.s_state != state) {
                if (state > -1 && state < RenderStateObject.s_statesLen) {
                    RenderStateObject.s_states[state].use();
                }
            }
        }
    }
    private static s_preBlendMode: number = -1;
    private static s_preDepthTestMode: number = -1;
    static UnlockBlendMode(): void {
        RenderStateObject.m_blendMode = RenderStateObject.s_preBlendMode;
    }
    static LockBlendMode(blendMode: number): void {
        RenderStateObject.s_preBlendMode = RenderStateObject.m_blendMode;
        RenderStateObject.m_blendMode = blendMode;
    }
    static UnlockDepthTestMode(): void {
        RenderStateObject.s_depthTestMode = RenderStateObject.s_preDepthTestMode;
    }
    static LockDepthTestMode(depthTestMode: number): void {
        RenderStateObject.s_preDepthTestMode = RenderStateObject.s_depthTestMode;
        RenderStateObject.s_depthTestMode = depthTestMode;
    }
    static Lock(): void {
        RenderStateObject.s_unlocked = false;
    }
    static Unlock(): void {
        RenderStateObject.s_unlocked = true;
    }
    static Reset(): void {
        RenderStateObject.s_state = -1;
    }
}
