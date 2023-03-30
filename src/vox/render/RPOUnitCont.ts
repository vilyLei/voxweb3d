/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderProxy from "../../vox/render/IRenderProxy";

import RPOUnit from "./RPOUnit";
import IRenderEntityContainer from "./IRenderEntityContainer";
import PassProcess from "./pass/PassProcess";
import IRenderShaderUniform from "./uniform/IRenderShaderUniform";
import ContainerFlowRenderer from "./ContainerFlowRenderer";
/**
 * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
 * renderer rendering runtime core executable display unit.
 */
export default class RPOUnitCont extends RPOUnit {
	private m_passProc = new PassProcess();
	private m_cr = new ContainerFlowRenderer();
	constructor() {
		super();
	}
	private resetCR(): void {
		const cr = this.m_cr;
		cr.passProc = this.m_passProc;
		cr.shdUpdate = false;
		cr.shader = this.shader;
	}
	run(rc: IRenderProxy): void {

		const c = this.rentity as IRenderEntityContainer;
		if (c && c.isVisible()) {
			this.resetCR();
			this.m_cr.runContainer(rc, c);
		}
	}
	runLockMaterial2(puniform: IRenderShaderUniform): void {
		const c = this.rentity as IRenderEntityContainer;
		if (c && c.isVisible()) {
			this.resetCR();
			this.m_cr.runContainerLock(this.shader.getRC(), c);
		}
	}
	reset(): void {
		this.shader = null;
		this.rentity = null;
		this.bounds = null;
		this.pos = null;
	}
}
