/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RPONode from "../../vox/render/RPONode";
import RenderProxy from "../../vox/render/RenderProxy";
import RenderShader from "../../vox/render/RenderShader";
import RPOBlock from "./RPOBlock";
import PassProcess from "./pass/PassProcess";
import IRenderEntityContainer from "./IRenderEntityContainer";
import ContainerFlowRenderer from "./ContainerFlowRenderer";

export default class ContainerRPOBlock extends RPOBlock {

	private m_unitsTotal = 0;
	private m_container: IRenderEntityContainer = null;
	private m_cr = new ContainerFlowRenderer();

	constructor(shader: RenderShader) {
		super(shader);
	}
	
	private resetCR(): void {
		const cr = this.m_cr;
		cr.passProc = this.m_passProc;
		cr.shdUpdate = false;
		cr.shader = this.m_shader;
	}
	showInfo(): void {
	}
	clear(): void {
		if (this.m_shader) {
			this.m_shader = null;
			this.m_container = null;
		}
	}
	update(): void {
		if (this.sortEnabled) {
			this.sort();
		}
	}
	addContainer(container: IRenderEntityContainer): void {
		this.m_container = container;
	}
	removeContainer(container: IRenderEntityContainer): void {
		if(container == this.m_container) {
			this.m_container = null;
		}
	}
	hasContainer(container: IRenderEntityContainer): boolean {
		return this.m_container == container;
	}
	isEmpty(): boolean {
		return this.m_container == null;
	}
	private m_passProc = new PassProcess();

	run(rc: RenderProxy): void {
		// this.m_shader.resetUniform();
		const c = this.m_container;
		if(c && c.isVisible()) {
			this.resetCR();
			this.m_cr.runContainer(rc, c);
		}
	}
	runLockMaterial(rc: RenderProxy): void {
		// this.m_shader.resetUniform();
		const c = this.m_container;
		if(c && c.isVisible()) {
			this.resetCR();
			this.m_cr.runContainerLock(rc, c);
		}
	}
	getNodesTotal(): number {
		return this.m_unitsTotal;
	}
	addNode(node: RPONode) {
	}

	removeNode(node: RPONode): void {
	}
}
