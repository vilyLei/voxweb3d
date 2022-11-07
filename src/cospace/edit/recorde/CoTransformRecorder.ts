import IRenderEntity from "../../../vox/render/IRenderEntity";
import { ICoTransformRecorder } from "./ICoTransformRecorder";
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class TransNode {

	target: IRenderEntity;

	position = CoMath.createVec3();
	scale = CoMath.createVec3();
	rotation = CoMath.createVec3();


	// position = new Vector3D();
	// scale = new Vector3D();
	// rotation = new Vector3D();

	constructor() { }
}

let s_saveTimes_save = 0;
let s_usedTimes_save = 0;

class TransNodeGroup {

	list: TransNode[] = [];

	constructor() { }
	add(tar: IRenderEntity): void {

		let node = new TransNode();
		tar.getPosition(node.position);
		tar.getScaleXYZ(node.scale);
		tar.getRotationXYZ(node.rotation);
		node.target = tar;
		this.list.push(node);
	}
	use(): IRenderEntity[] {
		let ls = this.list;
		s_saveTimes_save--;
		let list: IRenderEntity[] = [];
		
		let tars_uids: number[] = [];
		for (let i = 0; i < ls.length; ++i) {
			const d = ls[i];
			const tar = d.target;
			tar.setScale3(d.scale);
			tar.setRotation3(d.rotation);
			tar.setPosition(d.position);
			tar.update();
			list.push(tar);
			tars_uids.push(tar.getUid());
		}
		console.log("XXXX$$$$ TransNodeGroup::use(), s_saveTimes_save: ", s_saveTimes_save);
		console.log("XXXX$$$$ TransNodeGroup::use(), list: ", list, tars_uids);
		return list;
	}
	destroy(): void {
		this.list = [];
	}
}
/**
 * renderable space transforming history recorder
 */
class CoTransformRecorder implements ICoTransformRecorder {

	private m_undoList: TransNodeGroup[] = [];
	private m_redoList: TransNodeGroup[] = [];
	private m_currList: IRenderEntity[] = null;
	private m_skipHead: boolean = true;
	constructor() { }

	/**
	 * 存放当前状态，所以初始化target的时候就应该存放进来
	 * @param tars IRenderEntity instance list
	 */
	save(tars: IRenderEntity[]): void {
		this.m_currList = null;
		if (this.m_redoList.length > 0) this.m_redoList = [];
		if(tars != null) {
			this.m_skipHead = true;
			let group = new TransNodeGroup();
			let tars_uids: number[] = [];
			for (let i = 0; i < tars.length; ++i) {
				group.add(tars[i]);
				tars_uids.push(tars[i].getUid());
			}
			s_saveTimes_save++;
			console.log("XXXX$$$$ CoTransformRecorder::save()... s_saveTimes_save: ", s_saveTimes_save);
			console.log("XXXX$$$$ CoTransformRecorder::save()...tars: ", tars, tars_uids);
			this.m_undoList.push(group);
		}

	}

	fakeUndo(): void {

		this.m_currList = null;

		let ls = this.m_undoList;
		let len = ls.length;
		if (len > 0) {
			console.log("XXXX$$$$ CoTransformRecorder::fakeUndo().");
			let node = ls.pop();
		}
	}
	// Ctrl + Z
	undo(): void {

		this.m_currList = null;

		let ls = this.m_undoList;
		let len = ls.length;
		if (len > 1) {
			console.log("XXXX$$$$ CoTransformRecorder::undo().");
			// let node = ls.pop();
			// this.m_redoList.push(node);
			// this.m_currList = ls[ls.length - 1].use();
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
			
			this.m_skipHead = true;
			// console.log("XXX redo().");
			// let node = ls.pop();
			// this.m_currList = node.use();
			// this.m_undoList.push(node);
			
			let node0 = ls.pop();
			let node1 = ls.pop();
			this.m_currList = node0.use();
			this.m_undoList.push(node1);
			this.m_undoList.push(node0);
		}
	}
	getCurrList(): IRenderEntity[] {
		let list = this.m_currList;
		this.m_currList = null;
		return list;
	}
}

export { CoTransformRecorder }
