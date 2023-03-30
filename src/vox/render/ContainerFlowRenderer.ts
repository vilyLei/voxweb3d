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
import IRenderShader from "./IRenderShader";
/**
 * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
 * renderer rendering runtime core executable display unit.
 */
export default class ContainerFlowRenderer {
	passProc = new PassProcess();
	shdUpdate = false;
	shader: IRenderShader = null;
	constructor() {
	}

	runContainer(rc: IRenderProxy, container: IRenderEntityContainer): void {
		const els = container.getEntities();
		const elen = els.length;
		if (elen > 0) {
			const proc = this.passProc;
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
								this.shdUpdate = true;
							} else {
								if (this.shdUpdate) {
									unit.applyShader(true);
									this.shdUpdate = false;
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

	runContainerLock(rc: IRenderProxy, container: IRenderEntityContainer): void {
		const els = container.getEntities();
		const elen = els.length;
		if (elen > 0) {
			const proc = this.passProc;
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
}
