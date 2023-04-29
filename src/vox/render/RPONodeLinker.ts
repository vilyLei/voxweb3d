/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RPONode from "../../vox/render/RPONode";

export default class RPONodeLinker {
	private static s_uid = 0;
	private m_uid = RPONodeLinker.s_uid++;                          // 用于唯一记录运行时的自己唯一id
	constructor() {
	}

	private m_begin: RPONode = null;
	private m_end: RPONode = null;
	private m_unitMap: Map<number, RPONode> = new Map();
	private m_unitTexMap: Map<number, number> = new Map();
	private m_FLAG_BUSY = 1;
	private m_FLAG_FREE = 0;

	private m_vtxFlagList: number[] = [];
	private m_vtxIndexFlagList: number[] = [];
	private m_vtxfreeIList: number[] = [];
	private m_vtxList: number[] = [];
	private m_vtxListLen: number = 0;


	private m_texFlagList: number[] = [];
	private m_texIndexFlagList: number[] = [];
	private m_texfreeIList: number[] = [];
	private m_texList: number[] = [];
	private m_texListLen: number = 0;

	private getFreeVtxId(): number {
		if (this.m_vtxfreeIList.length > 0) {
			return this.m_vtxfreeIList.pop();
		}
		return -1;
	}
	private getVtxIndex(): number {
		let unitI = -1;
		let index = this.getFreeVtxId();
		if (index >= 0) {
			unitI = index;
			this.m_vtxList[index] = 0;
			this.m_vtxFlagList[index] = this.m_FLAG_BUSY;
		}
		else {
			unitI = this.m_vtxListLen;
			this.m_vtxList.push(0);
			this.m_vtxIndexFlagList.push(this.m_FLAG_FREE);
			this.m_vtxFlagList.push(this.m_FLAG_BUSY);
			this.m_vtxListLen++;
		}
		return unitI;
	}

	private restoreVtxIndex(index: number): void {
		if (this.m_vtxFlagList[index] == this.m_FLAG_BUSY) {
			this.m_vtxfreeIList.push(index);
			this.m_vtxFlagList[index] = this.m_FLAG_FREE;
			this.m_vtxList[index] = 0;
		}
	}
	private attachVtxAt(index: number): void {
		++this.m_vtxList[index];
		//console.log("uid: "+this.m_uid+" RPONodeLinker::attachVtxAt(), this.m_vtxList["+index+"]: "+this.m_vtxList[index]);
	}
	private detachVtxAt(index: number): void {
		if (this.m_vtxList[index] > 0) {
			--this.m_vtxList[index];
			if (this.m_vtxList[index] < 1) {
				this.restoreVtxIndex(index);
			}
		}
		//console.log("uid: "+this.m_uid+" RPONodeLinker::detachVtxAt(), this.m_vtxList["+index+"]: "+this.m_vtxList[index]);
	}
	getVtxTotalAt(index: number): number {
		return this.m_vtxList[index];
	}
	private getFreeTexId(): number {
		if (this.m_texfreeIList.length > 0) {
			return this.m_texfreeIList.pop();
		}
		return -1;
	}
	private getTexIndex(): number {
		let unitI: number = -1;
		let index: number = this.getFreeTexId();
		if (index >= 0) {
			unitI = index;
			this.m_texList[index] = 0;
			this.m_texFlagList[index] = this.m_FLAG_BUSY;
		}
		else {
			unitI = this.m_texListLen;
			this.m_texList.push(0);
			this.m_texIndexFlagList.push(this.m_FLAG_FREE);
			this.m_texFlagList.push(this.m_FLAG_BUSY);
			this.m_texListLen++;
		}
		return unitI;
	}

	private restoreTexIndex(index: number): void {
		if (this.m_texFlagList[index] == this.m_FLAG_BUSY) {
			this.m_texfreeIList.push(index);
			this.m_texFlagList[index] = this.m_FLAG_FREE;
			this.m_texList[index] = 0;
		}
	}
	private attachTexAt(index: number): void {
		++this.m_texList[index];
		//console.log("uid: "+this.m_uid+" RPONodeLinker::attachTexAt(), this.m_texList["+index+"]: "+this.m_texList[index]);
	}
	private detachTexAt(index: number): void {
		if (this.m_texList[index] > 0) {
			--this.m_texList[index];
			if (this.m_texList[index] < 1) {
				this.restoreTexIndex(index);
			}
		}
		//console.log("uid: "+this.m_uid+" RPONodeLinker::detachTexAt(), this.m_texList["+index+"]: "+this.m_texList[index]);
	}
	getTexTotalAt(index: number): number {
		return this.m_texList[index];
	}
	destroy(): void {
		this.clear();
	}
	clear(): void {
		this.m_begin = this.m_end = null;
		this.m_unitMap = new Map();
		this.m_unitTexMap = new Map();

		this.m_vtxFlagList = [];
		this.m_vtxIndexFlagList = [];
		this.m_vtxList = [];
		this.m_vtxfreeIList = [];
		this.m_vtxListLen = 0;

		this.m_texFlagList = [];
		this.m_texIndexFlagList = [];
		this.m_texList = [];
		this.m_texfreeIList = [];
		this.m_texListLen = 0;
	}
	getBegin(): RPONode {
		return this.m_begin;
	}
	containsNode(node: RPONode): boolean {
		let pnode = this.m_unitMap.get(node.vtxUid);
		if (pnode != null) {
			let key = (31 + pnode.rvroI) * 131;
			key *= key + pnode.texMid;
			return node.rtokey == key;
		}
		return false;
	}
	addNodeAndSort(node: RPONode): void {
		//  注意，这里可以管理组合方式, 例如可以做更多条件的排序
		//  有些需要排序, 有些不需要排序
		//trace("RPONodeLinker::addNodeAndSort(), node: "+node);
		// 首先依据相同的顶点紧凑排序, 然后再以纹理组合排列, 因此用 顶点的key与tex序列的key组合为一个新的key
		//console.log("addNodeAndSort node.vtxUid: ",node.vtxUid, node.unit.__$dispNS);
		let pnode = this.m_unitMap.get(node.vtxUid);
		if (pnode == null) {
			this.m_unitMap.set(node.vtxUid, node);
			node.rvroI = this.getVtxIndex();
			this.attachVtxAt(node.rvroI);
			let key = (31 + node.rvroI) * 131;
			key *= key + node.texMid;
			node.rtokey = key;
			node.rtroI = this.getTexIndex();
			this.m_unitTexMap.set(key, node.rtroI);
			this.attachTexAt(node.rtroI);
			//console.log("RPONodeLinker::addNodeAndSort(), append a new node.");
		}
		else {
			node.rvroI = pnode.rvroI;
			this.attachVtxAt(node.rvroI);
			let key = (31 + node.rvroI) * 131;
			key *= key + node.texMid;
			if (this.m_unitTexMap.has(key)) {
				node.rtroI = this.m_unitTexMap.get(key);
			}
			else {
				node.rtroI = this.getTexIndex();
				this.m_unitTexMap.set(key, node.rtroI);
			}
			node.rtokey = key;
			this.attachTexAt(node.rtroI);
			//console.log("RPONodeLinker::addNodeAndSort(), append a new pnode != m_end: "+(pnode != this.m_end));
			if (pnode != this.m_end) {
				if (pnode.texMid == node.texMid) {
					pnode.next.prev = node;
					node.next = pnode.next;
					node.prev = pnode;
					pnode.next = node;
				}
				else {
					// combine the same textures ro
					while (pnode != null) {
						if (pnode.vtxUid != node.vtxUid) {
							pnode = pnode.prev;
							pnode.next.prev = node;
							node.next = pnode.next;
							node.prev = pnode;
							pnode.next = node;

							break;
						}
						else {
							if (pnode.texMid == node.texMid) {
								pnode.next.prev = node;
								node.next = pnode.next;
								node.prev = pnode;
								pnode.next = node;
								break;
							}
							if (pnode.next == this.m_end) {
								if (this.m_end.vtxUid != node.vtxUid) {
									// append after pnode
									pnode.next.prev = node;
									node.next = pnode.next;
									node.prev = pnode;
									pnode.next = node;
								}
								else {
									pnode = null;
								}
								break;
							}
							pnode = pnode.next;
						}
					}
				}
				// 如果纹理相同, 再次将纹理相同的排在一起
				//console.log("RPONodeLinker::addNodeAndSort(), insert a new node 0.");
			}
			else {
				pnode = null;
			}
		}

		if (pnode == null) {
			if (this.m_begin == null) {
				this.m_end = this.m_begin = node;
			}
			else {
				if (this.m_end.prev != null) {
					this.m_end.next = node;
					node.prev = this.m_end;
					this.m_end = node;
					//trace("RPONodeLinker::addNodeAndSort(), insert a node to link 1.");
				}
				else {
					this.m_begin.next = node;
					node.prev = this.m_end;
					this.m_end = node;
					//trace("RPONodeLinker::addNodeAndSort(), insert a node to link 2.");
				}
			}
			this.m_end.next = null;
		}
	}
	showInfo(): void {
		let nextNode: RPONode = this.getBegin();
		if (nextNode != null) {
			let vtxStr: string = "";
			let texStr: string = "";
			let ivsCountStr: string = "";
			while (nextNode != null) {
				vtxStr += nextNode.vtxUid + ",";
				texStr += nextNode.texMid + ",";
				ivsCountStr += nextNode.unit.indicesRes.rdp.rd.ivsSize + ",";
				nextNode = nextNode.next;
			}
			console.log("RPONodeLinker::showInfo(), vtx: " + vtxStr);
			console.log("RPONodeLinker::showInfo(), tex: " + texStr);
			console.log("RPONodeLinker::showInfo(), ivs: " + ivsCountStr);
		}
	}
	removeNodeAndSort(node: RPONode): void {
		//trace("RPONodeLinker::removeNodeAndSort(), node: "+node);
		let pnode = this.m_unitMap.get(node.vtxUid);
		if (pnode != node) {
			pnode = null;
		}
		else {
			this.m_unitMap.set(node.vtxUid, null);
			if (node.next != null && node.next.vtxUid == node.vtxUid) {
				this.m_unitMap.set(node.vtxUid, node.next);
			}
			else if (node.prev != null && node.prev.vtxUid == node.vtxUid) {
				this.m_unitMap.set(node.vtxUid, node.prev);
			}
			else {
				this.m_unitMap.delete(node.vtxUid);
			}
		}

		if (node == this.m_begin) {
			if (node == this.m_end) {
				this.m_begin = this.m_end = null;
			}
			else {
				this.m_begin = node.next;
				this.m_begin.prev = null;
			}
		}
		else if (node == this.m_end) {
			this.m_end = node.prev;
			this.m_end.next = null;
		}
		else {
			node.next.prev = node.prev;
			node.prev.next = node.next;
		}
		this.detachVtxAt(node.rvroI);
		this.detachTexAt(node.rtroI);
		node.prev = null;
		node.next = null;
	}

	addNode(node: RPONode): void {
		if (this.m_begin == null) {
			this.m_end = this.m_begin = node;
		}
		else {
			if (this.m_end.prev != null) {
				this.m_end.next = node;
				node.prev = this.m_end;
				this.m_end = node;
			}
			else {
				this.m_begin.next = node;
				node.prev = this.m_end;
				this.m_end = node;
			}
		}
		this.m_end.next = null;
	}

	removeNode(node: RPONode): void {
		if (node == this.m_begin) {
			if (node == this.m_end) {
				this.m_begin = this.m_end = null;
			}
			else {
				this.m_begin = node.next;
				this.m_begin.prev = null;
			}
		}
		else if (node == this.m_end) {
			this.m_end = node.prev;
			this.m_end.next = null;
		}
		else {
			node.next.prev = node.prev;
			node.prev.next = node.next;
		}
		node.prev = null;
		node.next = null;
	}
}