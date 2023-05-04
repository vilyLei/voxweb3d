import { RecordeNodeData, IRecordeNodeTarget, RecordeNode } from "./ToyBrushRecordeNode";

let s_saveTimes_save = 0;

class RecordeNodeGroup {

	list: RecordeNode[] = [];

	constructor() { }
	add(rnd: RecordeNodeData): void {

		let node = new RecordeNode();
		node.target = rnd.target;
		node.keyValueData = rnd.keyValueData;
		node.imgUrl = rnd.imgUrl;
		this.list.push(node);
	}
	use(): IRecordeNodeTarget[] {
		let ls = this.list;
		s_saveTimes_save--;
		let list: IRecordeNodeTarget[] = [];

		for (let i = 0; i < ls.length; ++i) {
			const d = ls[i];
			const tar = d.target;
			tar.useRecordeNodeData(d.keyValueData, d.imgUrl);
			list.push(tar);
		}
		return list;
	}
	destroy(): void {
		this.list = [];
	}
}
/**
 * renderable space transforming history recorder
 */
class ToyBrushDataRecorder {

	private m_undoList: RecordeNodeGroup[] = [];
	private m_redoList: RecordeNodeGroup[] = [];
	private m_currList: IRecordeNodeTarget[] = null;
	private m_beginGroup: RecordeNodeGroup = null;
	version = -1;
	constructor() { }
	private createGroup(dataNodes: RecordeNodeData[]): RecordeNodeGroup {
		if (dataNodes != null) {
			let group = new RecordeNodeGroup();
			for (let i = 0; i < dataNodes.length; ++i) {
				group.add(dataNodes[i]);
			}
			return group;
		}
	}
	/**
	 * 与saveEnd 协作存放当前状态，所以初始化target的时候就应该存放进来
	 * @param tars IRenderEntity instance list
	 */
	saveBegin(nodes: RecordeNodeData[]): void {

		this.m_currList = null;
		this.m_beginGroup = this.createGroup(nodes);
	}
	/**
	 * 与saveBegin 协作存放当前状态，所以初始化target的时候就应该存放进来
	 * @param tars IRenderEntity instance list
	 */
	saveEnd(dataNodes: RecordeNodeData[]): void {

		this.m_currList = null;
		let begin = this.m_beginGroup;
		this.m_beginGroup = null;

		if (begin != null) {

			let group = this.createGroup(dataNodes);
			if (group != null) {
				console.log("ToyBrushDataRecorder::saveEnd(), recorde a new status.");
				this.version ++;

				this.m_undoList.push(begin);
				this.m_undoList.push(group);
				s_saveTimes_save++;
				begin = null;
			}
		}
		if (begin != null) {
			begin.destroy();
		}
	}

	// Ctrl + Z
	undo(): void {

		this.m_currList = null;

		let ls = this.m_undoList;
		let len = ls.length;
		if (len > 1) {
			console.log("XXXX$$$$ ToyBrushDataRecorder::undo().");
			this.version ++;
			let node0 = ls.pop();
			let node1 = ls.pop();
			this.m_redoList.push(node1);
			this.m_redoList.push(node0);
			this.m_currList = node1.use();
		}
	}
	// Ctrl + Y
	redo(): void {

		this.m_currList = null;
		let ls = this.m_redoList;
		let len = ls.length;
		if (len > 1) {

			console.log("XXX ToyBrushDataRecorder::redo().");
			this.version ++;
			let node0 = ls.pop();
			let node1 = ls.pop();
			this.m_currList = node0.use();
			this.m_undoList.push(node1);
			this.m_undoList.push(node0);
		}
	}
	getCurrList(): IRecordeNodeTarget[] {
		let list = this.m_currList;
		this.m_currList = null;
		return list;
	}
}

export { ToyBrushDataRecorder }
