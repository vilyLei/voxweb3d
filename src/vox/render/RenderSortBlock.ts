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
import PassProcess from "./pass/PassProcess";

export default class RenderSortBlock {
	private m_begin: RPONode = null;
	private m_end: RPONode = null;
	private m_next: RPONode = null;
	private m_unit: RPOUnit = null;
	private m_units: RPOUnit[] = [];
	private m_unitsTotal: number = 0;
	private m_shader: RenderShader = null;
	private m_renderTotal = 0;
	private m_sorter: IRODisplaySorter = null;
	sortEnabled = true;
	constructor(shader: RenderShader) {
		this.m_shader = shader;
	}
	setSorter(sorter: IRODisplaySorter): void {
		this.m_sorter = sorter;
	}
	showInfo(): void {
		let info: string = "";
		let next: RPONode = this.m_begin;
		while (next != null) {
			//info += "("+next.unit.value+","+next.uid+"),";
			info += next.unit.value + ",";
			next = next.next;
		}
		console.log("RenderSortBlock info: \n", info);
	}
	clear(): void {
		if (this.m_shader != null) {
			if (this.m_units.length > 0) this.m_units = [];
			let next: RPONode = this.m_begin;
			let curr: RPONode = null;
			while (next != null) {
				curr = next;
				next = next.next;
				curr.prev = null;
				curr.next = null;
			}
			this.m_begin = this.m_end = null;
			this.m_unitsTotal = 0;
			this.m_renderTotal = 0;
			this.sortEnabled = true;
			this.m_shader = null;
		}
		this.m_sorter = null;
	}
	update(): void {
		if (this.sortEnabled) {
			this.sort();
		}
	}

	private m_passProc = new PassProcess();
	private m_shdUpdate = false;
	run(rc: RenderProxy): void {

		this.m_shader.resetUniform();

		let unit: RPOUnit = null;
		let nodes = this.m_units;
		this.m_shdUpdate = false;
		const proc = this.m_passProc;
		proc.shader = this.m_shader;

		for (let i = 0; i < this.m_renderTotal; ++i) {
			unit = nodes[i];
			if (unit.rendering) {
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
	runLockMaterial(rc: RenderProxy): void {
		this.m_shader.resetUniform();

		let unit: RPOUnit = null;
		let nodes = this.m_units;
		for (let i = 0; i < this.m_renderTotal; ++i) {
			unit = nodes[i];
			if (unit.rendering) {
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
	sort(): void {
		if (this.m_unitsTotal > 0) {
			// 整个sort执行过程放在渲染运行时渲染执行阶段是不妥的,但是目前还没有好办法
			// 理想的情况是运行时不会被复杂计算打断，复杂计算应该再渲染执行之前完成
			let next = this.m_begin;
			if (this.m_units.length < this.m_unitsTotal) {
				this.m_units = new Array(Math.round(this.m_unitsTotal * 1.1) + 1);
			}
			let i = 0;
			while (next != null) {
				const unit = next.unit;
				if (unit.rendering && unit.drawing) {
					this.m_units[i] = unit;
					++i;
				}
				next = next.next;
			}
			this.m_renderTotal = i;

			let flat = 0;
			if (this.m_sorter != null) {
				flat = this.m_sorter.sortRODisplay(this.m_units, i);
			}
			if (flat < 1) {
				this.snsort(0, i - 1);
			}
		}
	}
	private sorting(low: number, high: number): number {
		let arr = this.m_units;
		this.m_unit = arr[low];
		let pvalue = this.m_unit.value;
		while (low < high) {
			while (low < high && arr[high].value >= pvalue) {
				--high;
			}
			arr[low] = arr[high];
			while (low < high && arr[low].value <= pvalue) {
				++low;
			}
			arr[high] = arr[low];
		}
		arr[low] = this.m_unit;
		return low;
	}
	private snsort(low: number, high: number): void {
		if (low < high) {
			let pos = this.sorting(low, high);
			this.snsort(low, pos - 1);
			this.snsort(pos + 1, high);
		}
	}
	getNodesTotal(): number {
		return this.m_unitsTotal;
	}
	getBegin(): RPONode {
		this.m_next = this.m_begin;
		return this.m_begin;
	}
	getNext(): RPONode {
		if (this.m_next != null) {
			this.m_next = this.m_next.next;
		}
		return this.m_next;
	}
	isEmpty(): boolean {
		return this.m_unitsTotal < 1;
		// return this.m_begin == null;
	}
	addNode(node: RPONode) {
		//console.log("sort add node: ",node);
		if (node.prev == null && node.next == null) {
			if (this.m_begin == null) {
				this.m_end = this.m_begin = node;
			} else {
				if (this.m_end.prev != null) {
					this.m_end.next = node;
					node.prev = this.m_end;
					this.m_end = node;
				} else {
					this.m_begin.next = node;
					node.prev = this.m_end;
					this.m_end = node;
				}
			}
			this.m_end.next = null;
			this.m_unitsTotal++;
			//console.log("sort add node,this.m_unitsTotal: ",this.m_unitsTotal);
		}
	}

	removeNode(node: RPONode): void {
		//console.log("sort remove node: ",node);
		if (node.prev != null || node.next != null || node == this.m_begin) {
			if (node == this.m_begin) {
				if (node == this.m_end) {
					this.m_begin = this.m_end = null;
				} else {
					this.m_begin = node.next;
					this.m_begin.prev = null;
				}
			} else if (node == this.m_end) {
				this.m_end = node.prev;
				this.m_end.next = null;
			} else {
				node.next.prev = node.prev;
				node.prev.next = node.next;
			}
			node.prev = null;
			node.next = null;
			this.m_unitsTotal--;
			//console.log("sort remove node,this.m_unitsTotal: ",this.m_unitsTotal);
		}
	}
}
