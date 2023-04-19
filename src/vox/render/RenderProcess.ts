/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// RenderProcess 实例实际上可以被外部功能块直接使用,以便实现具体渲染目的
// 只能在 RenderWorld 中创建

import IRODisplay from "../../vox/display/IRODisplay";
import RenderShader from "../../vox/render/RenderShader";
import RenderProxy from "../../vox/render/RenderProxy";

import IPoolNode from "../../vox/base/IPoolNode";
import RPOUnit from "../../vox/render/RPOUnit";
import RPONode from "../../vox/render/RPONode";
import { RPOUnitBuilder } from "../../vox/render/RPOUnitBuilder";
import RPONodeBuilder from "../../vox/render/RPONodeBuilder";
import ROVertexResource from "../../vox/render/ROVertexResource";
import IRODisplaySorter from "../../vox/render/IRODisplaySorter";
import RenderSortBlock from "../../vox/render/RenderSortBlock";
import RPOBlock from "../../vox/render/RPOBlock";
import MaterialRPOBlock from "../../vox/render/MaterialRPOBlock";
import IRenderProcess from "../../vox/render/IRenderProcess";
import { SortNodeLinker } from "../../vox/utils/SortNodeLinker";
import IRenderEntity from "./IRenderEntity";
import IRenderEntityContainer from "./IRenderEntityContainer";
import ContainerRPOBlock from "./ContainerRPOBlock";
import IRPOUnit from "./IRPOUnit";

export default class RenderProcess implements IRenderProcess, IPoolNode {
	private static s_max_shdTotal = 1024;
	// 记录自身所在的 rendererInstance id
	private m_rcuid = -1;
	// 记录自身所在 rendererInstance 中分配到的process index
	private m_rpIndex = -1;
	private m_rc: RenderProxy;

	private m_nodesLen = 0;
	private m_enabled = true;
	private m_blockList: RPOBlock[] = []; // 记录以相同shader的node为一个集合对象(MaterialRPOBlock) 的数组
	private m_blockListLen = 0;
	private m_blockFList = new Int8Array(RenderProcess.s_max_shdTotal); // 记录以相同shader的node为一个集合对象(MaterialRPOBlock)的构建状态 的数组
	private m_blockFListLen = RenderProcess.s_max_shdTotal; // 假定引擎中同时存在的最多的shader 有1024种
	private m_containerBlocks: ContainerRPOBlock[] = [];
	private m_scTotal = 0;
	private m_shader: RenderShader = null;
	private m_rpoNodeBuilder: RPONodeBuilder = null;
	private m_rpoUnitBuilder: RPOUnitBuilder = null;
	private m_vtxResource: ROVertexResource = null;
	// 用于制定对象的绘制
	private m_fixBlock: MaterialRPOBlock = null;
	private m_sortBlock: RenderSortBlock = null;
	protected m_sorter: IRODisplaySorter = null;

	private m_blockLinker = new SortNodeLinker();

	private m_batchEnabled = true;
	private m_fixedState = true;
	private m_sortEnabled = false;
	private m_version = 0;

	uid = -1;
	constructor(
		shader: RenderShader,
		rpoNodeBuilder: RPONodeBuilder,
		rpoUnitBuilder: RPOUnitBuilder,
		vtxResource: ROVertexResource,
		batchEnabled: boolean,
		processFixedState: boolean
	) {
		this.m_shader = shader;
		this.m_rpoNodeBuilder = rpoNodeBuilder;
		this.m_rpoUnitBuilder = rpoUnitBuilder;
		this.m_vtxResource = vtxResource;
		this.m_fixBlock = this.createBlock();

		this.m_batchEnabled = batchEnabled;
		this.m_fixedState = processFixedState;
		for (let k = 0; k < this.m_blockFListLen; ++k) {
			this.m_blockFList[k] = -1;
		}
	}
	private createBlock(): MaterialRPOBlock {
		let block = new MaterialRPOBlock(this.m_shader);
		block.rpoNodeBuilder = this.m_rpoNodeBuilder;
		block.rpoUnitBuilder = this.m_rpoUnitBuilder;
		block.vtxResource = this.m_vtxResource;
		return block;
	}
	setRenderParam(batchEnabled: boolean, processFixedState: boolean): void {
		if (this.m_blockListLen < 1) {
			this.m_batchEnabled = batchEnabled;
			this.m_fixedState = processFixedState;
		}
	}
	setRendererParam(rc: RenderProxy, rpIndex: number): void {
		this.m_rc = rc;
		this.m_rcuid = rc.getRCUid();
		this.m_rpIndex = rpIndex;
	}
	getUid(): number {
		return this.uid;
	}
	getRCUid(): number {
		return this.m_rcuid;
	}
	getRPIndex(): number {
		return this.m_rpIndex;
	}
	hasSorter(): boolean {
		return this.m_sorter != null;
	}
	setSorter(sorter: IRODisplaySorter): void {
		this.m_sorter = sorter;
		if (this.m_sortBlock) {
			this.m_sortBlock.setSorter(sorter);
		}
	}
	setSortEnabled(sortEnabled: boolean): void {
		if (this.m_nodesLen < 1) {
			this.m_sortEnabled = sortEnabled;
		} else if (this.m_sortBlock) {
			this.m_sortBlock.sortEnabled = sortEnabled;
		}
	}
	getSortEnabled(): boolean {
		return this.m_sortEnabled;
	}
	getUnitsTotal(): number {
		return this.m_nodesLen;
	}
	private addNodeToBlock(node: RPONode): void {
		//  注意，这里可以管理组合方式, 例如可以做更多条件的排序
		//  这里依赖的是 shader program 和 vtx uid 来分类
		let block: MaterialRPOBlock = null;
		//console.log("RenderProcess::addDisp(),uid: "+this.m_rpIndex+" node.shdUid: "+node.shdUid+", index: "+this.uid);
		if (node.shdUid >= RenderProcess.s_max_shdTotal) {
			throw Error("Shader uid >= " + RenderProcess.s_max_shdTotal);
		}
		if (this.m_blockFList[node.shdUid] < 0) {
			block = this.createBlock();
			block.batchEnabled = this.m_batchEnabled;
			block.fixedState = this.m_fixedState;
			if (block.batchEnabled) {
				if (block.fixedState) {
					block.runMode = 2;
				} else {
					block.runMode = 1;
				}
			} else {
				block.runMode = 0;
			}
			block.shdUid = node.shdUid;
			block.index = this.m_blockListLen;
			block.procuid = this.m_rpIndex;
			this.m_blockList.push(block);
			this.m_blockFList[node.shdUid] = this.m_blockListLen;
			++this.m_blockListLen;

			this.m_blockLinker.addNode(block);
			//  console.log("RenderProcess::addDisp(), this.uid: ",this.getUid());
			//  console.log("RenderProcess::addDisp(), create a new MaterialRPOBlock instance, block: ",block);
			//  console.log("RenderProcess::addDisp(), create a new MaterialRPOBlock instance, this.m_blockList: ",this.m_blockList);
		} else {
			//console.log("RenderProcess::addDisp(), use old MaterialRPOBlock instance, m_blockFList["+node.shdUid+"]: "+this.m_blockFList[node.shdUid]);
			block = this.m_blockList[this.m_blockFList[node.shdUid]] as MaterialRPOBlock;
		}
		node.index = block.index;
		block.addNode(node);
	}
	rejoinRunitForTro(runit: RPOUnit): void {
		if (!this.m_sortBlock) {
			let node = this.m_rpoNodeBuilder.getNodeByUid(runit.__$rpuid) as RPONode;
			if (node) {
				node.tro = runit.tro;
				node.texMid = node.unit.texMid;
				this.m_blockList[node.index].rejoinNode(node);
			}
		}
	}
	rejoinRunitForVro(runit: RPOUnit): void {
		if (!this.m_sortBlock) {
			let node = this.m_rpoNodeBuilder.getNodeByUid(runit.__$rpuid) as RPONode;
			if (node) {
				node.vtxUid = runit.vtxUid;
				node.vro = runit.vro;
				this.m_blockList[node.index].rejoinNode(node);
				this.m_version++;
			}
		}
	}
	addContainer(container: IRenderEntityContainer): void {
		console.log("RenderProcess::addContainer() this.m_sortBlock: ", this.m_sortBlock);
		this.createSortBlock();
		if (this.m_sortBlock) {
			if(this.m_sortBlock.addContainer(container)) {
				this.m_scTotal ++;
			}
		} else {
			const ls = this.m_containerBlocks;
			let i = ls.length - 1;
			let flag = ls.length > 0;
			for (; i >= 0; --i) {
				if (ls[i].isEmpty() && flag) {
					ls[i].addContainer(container);
					flag = true;
					break;
				}
				flag = false;
				if (ls[i].hasContainer(container)) {
					break;
				}
			}
			if (i == -1 && !flag) {
				let block = new ContainerRPOBlock(this.m_shader);
				block.addContainer(container);
				this.m_blockLinker.addNode(block);
				ls.push(block);
			}
		}
	}
	removeContainer(container: IRenderEntityContainer): void {
		if (this.m_sortBlock) {
			if(this.m_sortBlock.removeContainer(container)) {
				this.m_scTotal --;
			}
		} else {
			const ls = this.m_containerBlocks;
			let i = 0;
			for (; i < ls.length; ++i) {
				if (ls[i].hasContainer(container)) {
					ls[i].removeContainer(container);
				}
			}
		}
	}
	private createSortBlock(): void {
		if (this.m_sortEnabled && !this.m_sortBlock) {
			this.m_sortBlock = new RenderSortBlock(this.m_shader);
			this.m_sortBlock.setSorter(this.m_sorter);
			this.m_blockLinker.addNode(this.m_sortBlock);
		}
		// if (this.m_sortBlock) {
		// 	this.m_sortBlock.addNode(node);
		// } else {
		// 	this.m_sortBlock = new RenderSortBlock(this.m_shader);
		// 	this.m_sortBlock.setSorter(this.m_sorter);
		// 	this.m_sortBlock.addNode(node);
		// 	this.m_blockLinker.addNode(this.m_sortBlock);
		// }
	}
	addDisp(disp: IRODisplay): void {
		if (disp != null) {
			if (disp.__$$runit && disp.__$$runit.getRPROUid() < 0) {
				const re = (disp.__$$runit as RPOUnit).rentity as IRenderEntity;
				let parent = re.__$getParent();
				while (parent) {
					if (!parent.hasParent() && parent.getREType() >= 20) {
						// console.log("RenderProcess(" + this.uid + ")::addDisp(), 容器内驱动渲染，不需要直接加入渲染 process.");
						return;
						break;
					}
					parent = parent.getParent();
				}
				if (disp.__$$runit.getRPROUid() != this.uid) {
					// console.log("XX--XX RenderProcess(" + this.uid + ")::addDisp(): ", disp.ivsCount, disp, disp.drawMode);
					let node = this.m_rpoNodeBuilder.create() as RPONode;
					node.unit = this.m_rpoUnitBuilder.getNodeByUid(disp.__$ruid) as RPOUnit;
					// node.unit.shader = this.m_shader;
					node.unit.__$rprouid = this.uid;
					disp.__$rpuid = node.uid;
					node.__$ruid = disp.__$ruid;
					node.unit.__$rpuid = node.uid;
					node.updateData();

					++this.m_nodesLen;

					this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.getUid(), node.uid);
					if (this.m_sortEnabled) {
						// console.log("sort process add a disp...");

						this.createSortBlock();
						this.m_sortBlock.addNode(node);

						// if (this.m_sortBlock) {
						// 	this.m_sortBlock.addNode(node);
						// } else {
						// 	this.m_sortBlock = new RenderSortBlock(this.m_shader);
						// 	this.m_sortBlock.setSorter(this.m_sorter);
						// 	this.m_blockLinker.addNode(this.m_sortBlock);
						// 	this.m_sortBlock.addNode(node);
						// }
					} else {
						this.addNodeToBlock(node);
					}
					this.m_version++;
				} else {
					console.log("RenderProcess::addDisp(), Warn: add entity repeat in processid(" + this.m_rpIndex + ").");
				}
			}
		}
	}
	updateDispMateiral(disp: IRODisplay): void {
		if (disp.__$$runit) {
			if (!this.m_sortBlock) {
				let nodeUId = disp.__$$runit.getRPOUid();
				let node = this.m_rpoNodeBuilder.getNodeByUid(nodeUId) as RPONode;
				// material info etc.
				node.shdUid = node.unit.shdUid;
				node.texMid = node.unit.texMid;
				node.tro = node.unit.tro;
				let block = this.m_blockList[node.index];
				block.removeNode(node);
				this.addNodeToBlock(node);
			}
		}
	}
	removeDisp(disp: IRODisplay): void {
		if (disp) {
			if (disp.__$$runit) {
				// const re = (disp.__$$runit as RPOUnit).rentity as IRenderEntity;
				// let parent = re.__$getParent();
				// console.log("removeDisp() B ............");
				// while (parent) {
				// 	if (!parent.hasParent() && parent.getREType() >= 20) {
				// 		console.log("RenderProcess(" + this.uid + ")::removeDisp(), 容器内驱动渲染，不需要直接从渲染 process 移除.");
				// 		return;
				// 		break;
				// 	}
				// 	parent = parent.getParent();
				// }

				let nodeUId = disp.__$$runit.getRPOUid();
				let node = this.m_rpoNodeBuilder.getNodeByUid(nodeUId) as RPONode;
				// console.log("RenderProcess("+this.uid+")::removeDisp(), nodeUId: ",nodeUId,disp);
				// console.log("removeDisp(), node != null: "+(node != null),", this.m_blockList: ",this.m_blockList);
				if (node) {
					let runit = node.unit;
					let transU = runit.transUniform;
					if (transU) {
						// ROTransPool.RemoveTransUniform(transU.key);
						(this.m_rc.rdataBuilder as any).transPool.removeTransUniform(transU.key);
					}
					if (this.m_sortBlock) {
						this.m_sortBlock.removeNode(node);
					} else {
						let block = this.m_blockList[node.index];
						block.removeNode(node);
					}

					this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.getUid(), -1);

					--this.m_nodesLen;

					if (this.m_rpoNodeBuilder.restore(node)) {
						this.m_rpoUnitBuilder.restore(runit);
					}

					this.m_vtxResource.__$detachRes(disp.getVtxResUid());
					disp.__$$runit = null;
					disp.__$ruid = -1;
					this.m_version++;
				} else {
					console.error("There is no this display instance.");
				}
			}
		}
	}
	forceRemoveDisp(disp: IRODisplay): void {
		if (disp && disp.__$$runit) {
			// console.log("RenderProcess(" + this.uid + ")::forceRemoveDisp(), 容器内驱动渲染，不需要直接从渲染 process 移除.");

			let runit = disp.__$$runit as RPOUnit;
			let transU = runit.transUniform;
			if (transU) {
				// ROTransPool.RemoveTransUniform(transU.key);
				(this.m_rc.rdataBuilder as any).transPool.removeTransUniform(transU.key);
			}
			this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.getUid(), -1);
			this.m_rpoUnitBuilder.restore(runit);
			this.m_vtxResource.__$detachRes(disp.getVtxResUid());
			disp.__$$runit = null;
			disp.__$ruid = -1;
			this.m_version++;
		}
	}
	getStatus(): number {
		return this.m_version;
	}
	/**
	 * remoev display unit from this render process
	 */
	removeDispUnit(disp: IRODisplay): void {
		if (disp) {
			if (disp.__$ruid > -1) {
				let nodeUId = disp.__$$runit.getRPOUid();
				let node = this.m_rpoNodeBuilder.getNodeByUid(nodeUId) as RPONode;
				if (node) {
					if (this.m_sortBlock) {
						this.m_sortBlock.removeNode(node);
					} else {
						this.m_blockList[node.index].removeNode(node);
					}
					this.m_rpoUnitBuilder.setRPNodeParam(disp.__$ruid, this.m_rpIndex, -1);
					node.unit.__$rprouid = -1;
					--this.m_nodesLen;
					this.m_rpoNodeBuilder.restore(node);
				}
			}
		}
	}
	update(): void {
		const total = this.m_nodesLen + this.m_containerBlocks.length + this.m_scTotal;
		if (this.m_enabled && total > 0) {
			if (this.m_sortBlock) {
				this.m_sortBlock.update();
			}
		}
	}
	run(): void {
		const total = this.m_nodesLen + this.m_containerBlocks.length + this.m_scTotal;
		if (this.m_enabled && total > 0) {
			const rc = this.m_rc;
			const linker = this.m_blockLinker;
			let node = linker.getBegin();
			if (this.m_shader.isUnLocked()) {
				while (node) {
					(node as RPOBlock).run(rc);
					node = node.next;
				}
			} else {
				while (node) {
					(node as RPOBlock).runLockMaterial(rc);
					node = node.next;
				}
			}
			// if (this.m_sortBlock) {
			// 	if (this.m_shader.isUnLocked()) {
			// 		this.m_sortBlock.run(rc);
			// 	} else {
			// 		this.m_sortBlock.runLockMaterial(rc);
			// 	}
			// } else {
			// 	if (this.m_shader.isUnLocked()) {
			// 		for (let i = 0; i < this.m_blockListLen; ++i) {
			// 			this.m_blockList[i].run(rc);
			// 		}
			// 	} else {
			// 		for (let i = 0; i < this.m_blockListLen; ++i) {
			// 			this.m_blockList[i].runLockMaterial(rc);
			// 		}
			// 	}
			// }
		}
	}
	drawDisp(disp: IRODisplay, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
		if (disp) {
			let unit = disp.__$$runit as RPOUnit;
			if (unit) {
				if (this.m_shader.isUnLocked()) {
					if (forceUpdateUniform) {
						this.m_shader.resetUniform();
					}
					this.m_fixBlock.drawUnit(this.m_rc, unit, disp);
				} else {
					this.m_fixBlock.drawLockMaterialByUnit(this.m_rc, unit, disp, useGlobalUniform, forceUpdateUniform);
				}
			}
		}
	}
	// /**
	//  * Deprecated(不推荐使用)
	//  */
	// drawLockMaterialByDisp(disp: IRODisplay, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
	// 	if (disp != null) {
	// 		let unit = disp.__$$runit as RPOUnit;
	// 		if (unit != null) {
	// 			this.m_fixBlock.drawLockMaterialByUnit(this.m_rc, unit, disp, useGlobalUniform, forceUpdateUniform);
	// 		}
	// 	}
	// }
	reset(): void {
		this.m_sortEnabled = false;
		this.m_nodesLen = 0;
		this.uid = -1;
		this.m_rpIndex = -1;
		this.m_rcuid = -1;
		this.m_rpIndex = -1;

		for (let i = 0; i < this.m_blockListLen; ++i) {
			this.m_blockList[i].reset();
		}
		this.m_blockListLen = 0;
		this.m_blockList = [];

		this.m_rpoNodeBuilder = null;
		this.m_rpoUnitBuilder = null;
		this.m_vtxResource = null;
		this.m_rc = null;
		if (this.m_sortBlock != null) {
			this.m_sortBlock.clear();
			this.m_sortBlock = null;
		}
	}

	showInfo(): void {
		for (let i = 0; i < this.m_blockListLen; ++i) {
			this.m_blockList[i].showInfo();
		}
	}
	destroy(): void {
		this.reset();
	}
	setEnabled(boo: boolean): void {
		this.m_enabled = boo;
	}
	isEnabled(): boolean {
		return this.m_enabled;
	}
}
