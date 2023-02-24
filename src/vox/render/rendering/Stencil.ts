/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRODrawState } from "./IRODrawState";
import { IStencil } from "./IStencil";
class Stencil implements IStencil {

    private m_depfs = [0, 0];
    private m_maskfs = [0, 0];
    private m_funcfs = [0, 0, 0, 0];
    private m_opfs = [0, 0, 0, 0];
    private m_enabled = false;
    constructor() {
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }
    setDepthTestEnable(enable: boolean): IStencil {
        this.m_depfs[0] = enable ? 1 : 0;
        this.m_depfs[1] = 1;
        this.m_enabled = true;
        // if (this.m_rstate) this.m_rstate.setDepthTestEnable(enable);
        return this;
    }
    /**
     * 设置 gpu stencilFunc 状态
     * @param func Specifies the test function. Eight symbolic constants are valid: GL_NEVER, GL_LESS, GL_LEQUAL, GL_GREATER, GL_GEQUAL, GL_EQUAL, GL_NOTEQUAL, and GL_ALWAYS. The initial value is GL_ALWAYS.
     * @param ref a GLint type number, value range: [0,2n−1];
     * @param mask GLint type number
     */
    setStencilFunc(func: number, ref: number, mask: number): IStencil {
        const ls = this.m_funcfs;
        ls[0] = func;
        ls[1] = ref;
        ls[2] = mask;
        ls[3] = 1;
        this.m_enabled = true;
        // if (this.m_rstate) this.m_rstate.setStencilFunc(func, ref, mask);
        return this;
    }
    /**
     * 设置 gpu stencilMask 状态
     * @param mask GLint type number
     */
    setStencilMask(mask: number): IStencil {
        this.m_maskfs[0] = mask;
        this.m_maskfs[1] = 1;
        this.m_enabled = true;
        // if (this.m_rstate) this.m_rstate.setStencilMask(mask);
        return this;
    }
    /**
     * 设置 gpu stencilOp 状态
     * @param fail Specifies the action to take when the stencil test fails. Eight symbolic constants are accepted: GL_KEEP, GL_ZERO, GL_REPLACE, GL_INCR, GL_INCR_WRAP, GL_DECR, GL_DECR_WRAP, and GL_INVERT. The initial value is GL_KEEP.
     * @param zfail Specifies the stencil action when the stencil test passes, but the depth test fails. dpfail accepts the same symbolic constants as sfail. The initial value is GL_KEEP.
     * @param zpass Specifies the stencil action when both the stencil test and the depth test pass, or when the stencil test passes and either there is no depth buffer or depth testing is not enabled. dppass accepts the same symbolic constants as sfail. The initial value is GL_KEEP.
     */
    setStencilOp(fail: number, zfail: number, zpass: number): IStencil {
        const ls = this.m_opfs;
        ls[0] = fail;
        ls[1] = zfail;
        ls[2] = zpass;
        ls[3] = 1;
        this.m_enabled = true;
        // if (this.m_rstate) this.m_rstate.setStencilOp(fail, zfail, zpass);
        return this;
    }
    reset(): void {
        this.m_depfs[1] = 0;
        this.m_maskfs[1] = 0;
        this.m_funcfs[3] = 0;
        this.m_opfs[3] = 0;
        this.m_enabled = false;
    }
    apply(rstate: IRODrawState): IStencil {
        if (rstate && this.m_enabled) {
            if (this.m_depfs[1] > 0) {
                rstate.setDepthTestEnable(this.m_depfs[0] > 0);
            }
            if (this.m_maskfs[1] > 0) {
                rstate.setStencilMask(this.m_maskfs[0]);
            }
            const fs = this.m_funcfs;
            if (fs[1] > 0) {
                rstate.setStencilFunc(fs[0], fs[1], fs[2]);
            }
            const ps = this.m_opfs;
            if (ps[1] > 0) {
                rstate.setStencilOp(ps[0], ps[1], ps[2]);
            }
        }
        return this;
    }
    
    clone(): IStencil {
        let st = new Stencil();
        st.m_enabled = this.m_enabled;
        st.m_depfs = this.m_depfs.slice();
        st.m_maskfs = this.m_maskfs.slice();
        st.m_funcfs = this.m_funcfs.slice();
        st.m_opfs = this.m_opfs.slice();
        return this;
    }
    copyFrom(src: Stencil): IStencil {
        this.m_enabled = src.m_enabled;
        this.m_depfs = src.m_depfs.slice();
        this.m_maskfs = src.m_maskfs.slice();
        this.m_funcfs = src.m_funcfs.slice();
        this.m_opfs = src.m_opfs.slice();
        return this;
    }
}
export { Stencil }