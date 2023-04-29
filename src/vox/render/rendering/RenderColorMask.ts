/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRODrawState } from "../../../vox/render/rendering/IRODrawState";

class RenderColorMask {
    private static s_uid: number = 0;
    private static s_state: number = -1;
    private static s_states: RenderColorMask[] = [];
    private static s_statesLen: number = 1;
    private static s_stsMap: Map<number, RenderColorMask> = new Map();
    private static s_stsNameMap: Map<string, RenderColorMask> = new Map();
    private static s_unlocked: boolean = true;
    public static ALL_TRUE_COLOR_MASK: number = 0;
    public static ALL_FALSE_COLOR_MASK: number = 1;
    
    static Rstate: IRODrawState = null;

    private m_uid: number = -1;
    private m_rBoo: boolean = true;
    private m_gBoo: boolean = true;
    private m_bBoo: boolean = true;
    private m_aBoo: boolean = true;
    //private m_state: number = 0;
    constructor(rBoo: boolean, gBoo: boolean, bBoo: boolean, aBoo: boolean) {
        this.m_uid = RenderColorMask.s_uid++;
        this.m_rBoo = rBoo;
        this.m_gBoo = gBoo;
        this.m_bBoo = bBoo;
        this.m_aBoo = aBoo;
    }
    getUid(): number {
        return this.m_uid;
    }
    getR(): boolean {
        return this.m_rBoo;
    }
    getG(): boolean {
        return this.m_gBoo;
    }
    getB(): boolean {
        return this.m_bBoo;
    }
    getA(): boolean {
        return this.m_aBoo;
    }
    use(): void {
        if (RenderColorMask.s_state != this.m_uid) {
            RenderColorMask.Rstate.setColorMask(this.m_rBoo, this.m_gBoo, this.m_bBoo, this.m_aBoo);
            RenderColorMask.s_state = this.m_uid;
        }
    }
    static Create(objName: string, rBoo: boolean, gBoo: boolean, bBoo: boolean, aBoo: boolean): number {
        if (RenderColorMask.s_stsNameMap.has(objName)) {
            let po: RenderColorMask = RenderColorMask.s_stsNameMap.get(objName);
            return po.getUid();
        }
        let key: number = (rBoo ? 1 << 6 : 1 << 5) | (gBoo ? 1 << 4 : 1 << 3) | (bBoo ? 1 << 2 : 1 << 1) | (aBoo ? 1 : 0);

        if (RenderColorMask.s_stsMap.has(key)) {
            let po: RenderColorMask = RenderColorMask.s_stsMap.get(key);
            key = po.getUid();
        }
        else {
            let po: RenderColorMask = new RenderColorMask(rBoo, gBoo, bBoo, aBoo);
            key = po.getUid();
            RenderColorMask.s_stsMap.set(key, po);
            RenderColorMask.s_stsNameMap.set(objName, po);
            RenderColorMask.s_states.push(po);
            ++RenderColorMask.s_statesLen;
        }
        return key;
    }

    static GetColorMaskByName(objName: string): number {
        if (RenderColorMask.s_stsNameMap.has(objName)) {
            let po = RenderColorMask.s_stsNameMap.get(objName);
            return po.getUid();
        }
        return -1;
    }
    // @param           state come from RODisp::renderState
    static UseRenderState(state: number): void {
        if (RenderColorMask.s_unlocked && RenderColorMask.Rstate.roColorMask != state) {
            if (state > -1 && state < RenderColorMask.s_statesLen) {
                RenderColorMask.s_states[state].use();
            }
        }
    }
    static UseColorMaskByName(stateName: string): void {
        let state = RenderColorMask.GetColorMaskByName(stateName);
        //trace("state: "+state+", stateName: "+stateName);
        if (RenderColorMask.s_unlocked && RenderColorMask.Rstate.roColorMask != state) {
            if (state > -1 && state < RenderColorMask.s_statesLen) {
                RenderColorMask.s_states[state].use();
            }
        }
    }
    static Lock(): void {
        RenderColorMask.s_unlocked = false;
    }
    static Unlock(): void {
        RenderColorMask.s_unlocked = true;
    }
    static Reset(): void {
        RenderColorMask.s_state = -1;
    }
}

export { RenderColorMask }