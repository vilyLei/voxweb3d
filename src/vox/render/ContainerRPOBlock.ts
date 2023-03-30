/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RPOUnit from "../../vox/render/RPOUnit";
import RPONode from "../../vox/render/RPONode";
import RenderProxy from "../../vox/render/RenderProxy";
import RenderShader from "../../vox/render/RenderShader";
import IRODisplaySorter from "../../vox/render/IRODisplaySorter";
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
		// let info: string = "";
		// let next: RPONode = this.m_begin;
		// while (next) {
		// 	//info += "("+next.unit.value+","+next.uid+"),";
		// 	info += next.unit.value + ",";
		// 	next = next.next;
		// }
		// console.log("ContainerRPOBlock info: \n", info);
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
		// console.log("ContainerRPOBlock::addContainer() ...");
		this.m_container = container;
	}
	removeContainer(container: IRenderEntityContainer): void {
		// console.log("ContainerRPOBlock::removeContainer() ...");
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
	// private m_shdUpdate = false;
	/*
	private runContainer(rc: RenderProxy, container: IRenderEntityContainer): void {
		const els = container.getEntities();
		const elen = els.length;
		if (elen > 0) {
			const proc = this.m_passProc;
			proc.shader = this.m_shader;
			// 可能需要排序
			for (let i = 0; i < elen; ++i) {
				const et = els[i];
				if (et.isPolyhedral() && et.isVisible() && et.isInRenderer()) {
					const unit = et.getDisplay().__$$runit as RPOUnit;
					if (unit && unit.rendering) {
						this.m_shader.bindToGpu(unit.shdUid);
						unit.updateVtx();
						if (unit.drawing) {
							if (unit.rgraph && unit.rgraph.isEnabled()) {
								proc.units = [unit];
								proc.rc = rc;
								proc.vtxFlag = true;
								proc.texFlag = true;
								unit.rgraph.run(proc);
								this.m_shdUpdate = true;
							} else {
								if (this.m_shdUpdate) {
									unit.applyShader(true);
									this.m_shdUpdate = false;
								}
								unit.run(rc);
								unit.draw(rc);
							}
						}
					}
				}
			}
		}
		const cls = container.getContainers();
		const clen = cls.length;
		if (clen > 0) {
			for (let i = 0; i < clen; ++i) {
				this.runContainer(rc, cls[i]);
			}
		}
	}

	private runContainerLock(rc: RenderProxy, container: IRenderEntityContainer): void {
		const els = container.getEntities();
		const elen = els.length;
		if (elen > 0) {
			const proc = this.m_passProc;
			proc.shader = this.m_shader;
			// 可能需要排序
			for (let i = 0; i < elen; ++i) {
				const et = els[i];
				if (et.isPolyhedral() && et.isVisible() && et.isInRenderer()) {
					const unit = et.getDisplay().__$$runit as RPOUnit;
					if (unit && unit.rendering) {
						this.m_shader.bindToGpu(unit.shdUid);
						unit.updateVtx();
						if (unit.drawing) {
							unit.vro.run();
							unit.runLockMaterial2(null);
							unit.draw(rc);
						}
					}
				}
			}
		}
		const cls = container.getContainers();
		const clen = cls.length;
		if (clen > 0) {
			for (let i = 0; i < clen; ++i) {
				this.runContainerLock(rc, cls[i]);
			}
		}
	}
	//*/
	run(rc: RenderProxy): void {
		// this.m_shader.resetUniform();
		// console.log("ContainerRPOBlock::run() ...");
		const c = this.m_container;
		if(c && c.isVisible()) {
			// this.m_shdUpdate = false;
			// this.runContainer(rc, c);
			this.resetCR();
			this.m_cr.runContainer(rc, c);
		}
	}
	runLockMaterial(rc: RenderProxy): void {
		// this.m_shader.resetUniform();
		const c = this.m_container;
		if(c && c.isVisible()) {
			// this.runContainerLock(rc, c);
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
