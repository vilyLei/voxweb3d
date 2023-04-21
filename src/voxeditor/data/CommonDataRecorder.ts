import { IRecordeNodeFactory, IRecordeDataUnit, IRecordeTarget, IRecordeNode } from "./RecordeNodeImpl";

let s_saveTimes_save = 0;

class RecordeNodeGroup {

	list: IRecordeNode[] = [];
	factory: IRecordeNodeFactory;
	constructor() { }
	add(data: IRecordeDataUnit): void {

		let node = this.createRecordeNode(data);
		node.target = data.target;
		node.data = data;
		node.dataSrcType = data.srcType;
		this.list.push(node);
	}
	apply(): IRecordeTarget[] {
		let ls = this.list;
		s_saveTimes_save--;
		let list: IRecordeTarget[] = [];

		for (let i = 0; i < ls.length; ++i) {
			const tar = ls[i].target;
			ls[i].apply();
			list.push( tar );
		}
		return list;
	}
	destroy(): void {
		this.list = [];
	}
	protected createRecordeNode(data: IRecordeDataUnit): IRecordeNode {
		return this.factory.createRecordeNode(data);
	}
}
/**
 * renderable space transforming history recorder
 */
class CommonDataRecorder {

	private m_undoList: RecordeNodeGroup[] = [];
	private m_redoList: RecordeNodeGroup[] = [];
	private m_currList: IRecordeTarget[] = null;
	private m_beginGroup: RecordeNodeGroup = null;
	private m_factory: IRecordeNodeFactory = null;

	constructor() { }
	private createGroup(dataNodes: IRecordeDataUnit[]): RecordeNodeGroup {
		if (dataNodes != null) {
			let group = new RecordeNodeGroup();
			group.factory = this.m_factory;
			for (let i = 0; i < dataNodes.length; ++i) {
				group.add(dataNodes[i]);
			}
			return group;
		}
	}
	setNodeFactory(factory: IRecordeNodeFactory): void {
		this.m_factory = factory;
	}
	/**
	 * 与saveEnd 协作存放当前状态，所以初始化target的时候就应该存放进来
	 * @param tars IRenderEntity instance list
	 */
	saveBegin(nodes: IRecordeDataUnit[]): void {

		this.m_currList = null;
		this.m_beginGroup = this.createGroup(nodes);
	}
	/**
	 * 与saveBegin 协作存放当前状态，所以初始化target的时候就应该存放进来
	 * @param tars IRenderEntity instance list
	 */
	saveEnd(dataNodes: IRecordeDataUnit[]): void {

		this.m_currList = null;
		let begin = this.m_beginGroup;
		this.m_beginGroup = null;

		if (begin != null) {

			let group = this.createGroup(dataNodes);
			if (group != null) {
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
			// console.log("XXXX$$$$ CommonDataRecorder::undo().");
			let node0 = ls.pop();
			let node1 = ls.pop();
			this.m_redoList.push(node1);
			this.m_redoList.push(node0);
			this.m_currList = node1.apply();
		}
	}
	// Ctrl + Y
	redo(): void {

		this.m_currList = null;
		let ls = this.m_redoList;
		let len = ls.length;
		if (len > 1) {

			// console.log("XXX redo().");

			let node0 = ls.pop();
			let node1 = ls.pop();
			this.m_currList = node0.apply();
			this.m_undoList.push(node1);
			this.m_undoList.push(node0);
		}
	}
	getCurrList(): IRecordeTarget[] {
		let list = this.m_currList;
		this.m_currList = null;
		return list;
	}
}

export { CommonDataRecorder }
