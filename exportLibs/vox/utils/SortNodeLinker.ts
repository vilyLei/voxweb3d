/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface ISortNodeLinkerNode {
	value: number;
	uid: number;
	prev: ISortNodeLinkerNode;
	next: ISortNodeLinkerNode;
}
class SortNodeLinkerNode implements ISortNodeLinkerNode {
	value = 0;
	uid = -1;
	prev: ISortNodeLinkerNode = null;
	next: ISortNodeLinkerNode = null;
	constructor() {}
}
class SortNodeLinker {
	private m_begin: ISortNodeLinkerNode = null;
	private m_end: ISortNodeLinkerNode = null;
	private m_next: ISortNodeLinkerNode = null;
	private m_node: ISortNodeLinkerNode = null;
	private m_nodes: ISortNodeLinkerNode[] = [];
	private m_nodesTotal = 0;
	constructor() {}

	showInfo(): void {
		let info: string = "";
		let next: ISortNodeLinkerNode = this.m_begin;
		while (next != null) {
			info += "(" + next.value + "," + next.uid + "),";
			//info += next.value+",";
			next = next.next;
		}
		console.log("SortNodeLinker info: \n", info);
	}
	clear(): void {
		this.m_nodes = [];
		let next = this.m_begin;
		let curr: ISortNodeLinkerNode = null;
		while (next != null) {
			curr = next;
			next = next.next;
			curr.prev = null;
			curr.next = null;
		}
		this.m_begin = this.m_end = null;
		this.m_nodesTotal = 0;
	}
	sort(): void {
		if (this.m_nodesTotal > 0) {
			//console.log("this.m_nodesTotal: ",this.m_nodesTotal);
			// 如果是remove实际上是不需要排序的
			let next = this.m_begin;
			if (this.m_nodes.length < this.m_nodesTotal) {
				this.m_nodes = new Array(Math.round(this.m_nodesTotal * 1.1) + 1);
			}
			let i = 0;
			while (next != null) {
				this.m_nodes[i] = next;
				next = next.next;
				++i;
			}
			this.snsort(0, this.m_nodesTotal - 1);
			this.m_begin = this.m_nodes[0];
			this.m_begin.uid = 2;
			this.m_begin.next = null;
			this.m_begin.prev = null;
			let prev = this.m_begin;
			for (i = 1; i < this.m_nodesTotal; ++i) {
				next = this.m_nodes[i];
				next.uid = 2 + i;
				next.prev = prev;
				prev.next = next;
				next.next = null;
				prev = next;
			}
			this.m_end = this.m_nodes[this.m_nodesTotal - 1];
			this.m_next = this.m_begin;
		}
	}
	private sorting(low: number, high: number): number {
		let arr = this.m_nodes;
		this.m_node = arr[low];
		while (low < high) {
			while (low < high && arr[high].value >= this.m_node.value) {
				--high;
			}
			arr[low] = arr[high];
			while (low < high && arr[low].value <= this.m_node.value) {
				++low;
			}
			arr[high] = arr[low];
		}
		arr[low] = this.m_node;
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
		return this.m_nodesTotal;
	}
	getBegin(): ISortNodeLinkerNode {
		this.m_next = this.m_begin;
		return this.m_begin;
	}
	getNext(): ISortNodeLinkerNode {
		if (this.m_next != null) {
			this.m_next = this.m_next.next;
		}
		return this.m_next;
	}
	isEmpty(): boolean {
		return this.m_nodesTotal < 1;
		// return this.m_begin == null;
	}
	addNode(node: ISortNodeLinkerNode) {
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
			this.m_nodesTotal++;
		}
	}

	removeNode(node: ISortNodeLinkerNode): void {
		if (node.prev != null || node.next != null) {
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
			this.m_nodesTotal--;
		}
	}
}
export default SortNodeLinker;
export { ISortNodeLinkerNode, SortNodeLinkerNode, SortNodeLinker };
