/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRODrawState } from "./IRODrawState";
import { IStencil } from "./IStencil";
class Stencil implements IStencil {

    private m_fs = new Uint32Array([
        0,          // flag[0]
        0, 0,        // depfs[1,2]
        0, 0,        // maskfs[3,4]
        0, 0, 0, 0,    // funcfs[5,6,7,8]
        0, 0, 0, 0,    // opfs[9,10,11,12]

    ]);
    constructor() {
    }
    isEnabled(): boolean {
        return this.m_fs[0] > 0;
    }
    setDepthTestEnable(enable: boolean): IStencil {
        const fs = this.m_fs;
        fs[0] = 1;
        fs[1] = enable ? 1 : 0;
        fs[2] = 1;
        return this;
    }
    /**
     * 设置 gpu stencilMask 状态
     * @param mask GLint type number
     */
    setStencilMask(mask: number): IStencil {
        const fs = this.m_fs;
        fs[0] = 1;
        fs[3] = 1;
        fs[4] = mask;
        return this;
    }
    /**
     * 设置 gpu stencilFunc 状态
     * @param func Specifies the test function. Eight symbolic constants are valid: GL_NEVER, GL_LESS, GL_LEQUAL, GL_GREATER, GL_GEQUAL, GL_EQUAL, GL_NOTEQUAL, and GL_ALWAYS. The initial value is GL_ALWAYS.
     * @param ref a GLint type number, value range: [0,2n−1];
     * @param mask GLint type number
     */
    setStencilFunc(func: number, ref: number, mask: number): IStencil {
        const fs = this.m_fs;
        fs[0] = 1;
        fs[5] = 1;
        fs[6] = func;
        fs[7] = ref;
        fs[8] = mask;
        return this;
    }
    /**
     * 设置 gpu stencilOp 状态
     * @param fail Specifies the action to take when the stencil test fails. Eight symbolic constants are accepted: GL_KEEP, GL_ZERO, GL_REPLACE, GL_INCR, GL_INCR_WRAP, GL_DECR, GL_DECR_WRAP, and GL_INVERT. The initial value is GL_KEEP.
     * @param zfail Specifies the stencil action when the stencil test passes, but the depth test fails. dpfail accepts the same symbolic constants as sfail. The initial value is GL_KEEP.
     * @param zpass Specifies the stencil action when both the stencil test and the depth test pass, or when the stencil test passes and either there is no depth buffer or depth testing is not enabled. dppass accepts the same symbolic constants as sfail. The initial value is GL_KEEP.
     */
    setStencilOp(fail: number, zfail: number, zpass: number): IStencil {
        const fs = this.m_fs;
        fs[0] = 1;
        fs[9] = 1;
        fs[10] = fail;
        fs[11] = zfail;
        fs[12] = zpass;
        return this;
    }
    reset(): void {
        const fs = this.m_fs;
        for (let i = 0; i < 13; ++i) {
            fs[i] = 0;
        }
    }
    /**
     * Note, that this is a renderer system inner function
     * @param rstate renderer rendering state manager
     */
    apply(rstate: IRODrawState): IStencil {
        const fs = this.m_fs;
        if (rstate && fs[0] > 0) {
            if (fs[1] > 0) {
                rstate.setDepthTestEnable(fs[2] > 0);
            }
            if (fs[3] > 0) {
                rstate.setStencilMask(fs[4]);
            }
            if (fs[5] > 0) {
                // console.log("setStencilFunc fs[5]: ", fs[5]);
                rstate.setStencilFunc(fs[6], fs[7], fs[8]);
            }
            if (fs[9] > 0) {
                // console.log("setStencilOp fs[10]: ", fs[10]);
                rstate.setStencilOp(fs[10], fs[11], fs[12]);
            }
        }
        return this;
    }

    clone(): IStencil {
        let st = new Stencil();
        st.m_fs.set(this.m_fs);
        return this;
    }
    copyFrom(src: Stencil): IStencil {
        this.m_fs.set(src.m_fs);
        return this;
    }
}
export { Stencil }