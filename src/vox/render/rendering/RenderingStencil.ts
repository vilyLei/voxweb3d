/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRODrawState } from "./IRODrawState";
import { IRenderingStencil } from "./IRenderingStencil";
class RenderingStencil implements IRenderingStencil {
	private m_rstate: IRODrawState = null;
	constructor(rstate: IRODrawState) {
		this.m_rstate = rstate;
	}
	// getRDST(): IRODrawState {
	// 	return this.m_rstate;
	// }
	isEnabled(): boolean {
		return true;
	}
	setDepthTestEnable(enable: boolean): IRenderingStencil {
		if (this.m_rstate) this.m_rstate.setDepthTestEnable(enable);
		return this;
	}
	/**
	 * 设置 gpu stencilFunc 状态
	 * @param func Specifies the test function. Eight symbolic constants are valid: GL_NEVER, GL_LESS, GL_LEQUAL, GL_GREATER, GL_GEQUAL, GL_EQUAL, GL_NOTEQUAL, and GL_ALWAYS. The initial value is GL_ALWAYS.
	 * @param ref a GLint type number, value range: [0,2n−1];
	 * @param mask GLint type number
	 */
	setStencilFunc(func: number, ref: number, mask: number): IRenderingStencil {
		this.m_rstate.setStencilFunc(func, ref, mask);
		return this;
	}
	/**
	 * 设置 gpu stencilMask 状态
	 * @param mask GLint type number
	 */
	setStencilMask(mask: number): IRenderingStencil {
		this.m_rstate.setStencilMask(mask);
		return this;
	}
	/**
	 * 设置 gpu stencilOp 状态
	 * @param fail Specifies the action to take when the stencil test fails. Eight symbolic constants are accepted: GL_KEEP, GL_ZERO, GL_REPLACE, GL_INCR, GL_INCR_WRAP, GL_DECR, GL_DECR_WRAP, and GL_INVERT. The initial value is GL_KEEP.
	 * @param zfail Specifies the stencil action when the stencil test passes, but the depth test fails. dpfail accepts the same symbolic constants as sfail. The initial value is GL_KEEP.
	 * @param zpass Specifies the stencil action when both the stencil test and the depth test pass, or when the stencil test passes and either there is no depth buffer or depth testing is not enabled. dppass accepts the same symbolic constants as sfail. The initial value is GL_KEEP.
	 */
	setStencilOp(fail: number, zfail: number, zpass: number): IRenderingStencil {
		this.m_rstate.setStencilOp(fail, zfail, zpass);
		return this;
	}
}
export { RenderingStencil };
