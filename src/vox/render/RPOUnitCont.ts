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
/**
 * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
 * renderer rendering runtime core executable display unit.
 */
export default class RPOUnitCont extends RPOUnit {
	private m_passProc = new PassProcess();
	private m_shdUpdate = false;

	constructor() {
		super();
	}

	private runContainer(rc: IRenderProxy, container: IRenderEntityContainer): void {
		const els = container.getEntities();
		const elen = els.length;
		if (elen > 0) {
			const proc = this.m_passProc;
			proc.shader = this.shader;
			// 可能需要排序
			for (let i = 0; i < elen; ++i) {
				const et = els[i];
				if (et.isPolyhedral() && et.isVisible() && et.isInRenderer()) {
					const unit = et.getDisplay().__$$runit as RPOUnit;
					if (unit && unit.rendering) {
						this.shader.bindToGpu(unit.shdUid);
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

	private runContainerLock(rc: IRenderProxy, container: IRenderEntityContainer): void {
		const els = container.getEntities();
		const elen = els.length;
		if (elen > 0) {
			const proc = this.m_passProc;
			proc.shader = this.shader;
			// 可能需要排序
			for (let i = 0; i < elen; ++i) {
				const et = els[i];
				if (et.isPolyhedral() && et.isVisible() && et.isInRenderer()) {
					const unit = et.getDisplay().__$$runit as RPOUnit;
					if (unit && unit.rendering) {
						this.shader.bindToGpu(unit.shdUid);
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
	run(rc: IRenderProxy): void {

		const c = this.rentity as IRenderEntityContainer;
		if (c && c.isVisible()) {
			this.m_shdUpdate = false;
			this.runContainer(rc, c);
		}
	}
	runLockMaterial2(puniform: IRenderShaderUniform): void {
		const c = this.rentity as IRenderEntityContainer;
		if (c && c.isVisible()) {
			this.runContainerLock(this.shader.getRC(), c);
		}
	}
	reset(): void {
		this.shader = null;
		this.rentity = null;
		this.bounds = null;
		this.pos = null;
	}
}
