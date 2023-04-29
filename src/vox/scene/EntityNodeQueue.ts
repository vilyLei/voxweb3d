/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import REF from "../../vox/scene/RSEntityFlag";
import IRenderEntityBase from "../../vox/render/IRenderEntityBase";
import Entity3DNode from "../../vox/scene/Entity3DNode";

export default class EntityNodeQueue {

	private m_listLen: number = 0;
	private m_ids: number[] = [];
	private m_list: Entity3DNode[] = [];
	private m_entieies: IRenderEntityBase[] = [];
	private m_fs: number[] = [];
	// free id list
	private m_fids: number[] = [];

	constructor() {}
	private getFreeId(): number {
		if (this.m_fids.length > 0) {
			return this.m_fids.pop();
		}
		return -1;
	}

	private createNode(): Entity3DNode {
		let node: Entity3DNode;
		let index = this.getFreeId();
		if (index >= 0) {
			this.m_fs[index] = 1;
			node = this.m_list[index];
			node.spaceId = index;
			return node;
		} else {
			// create a new nodeIndex
			index = this.m_listLen;
			node = Entity3DNode.Create();
			this.m_list.push(node);
			this.m_entieies.push(null);
			node.spaceId = index;
			//node.distanceFlag = false;
			this.m_fs.push(1);
			this.m_ids.push(index);
			this.m_fs.push(1);
			this.m_listLen++;
			return node;
		}
	}
	private restoreId(id: number): void {
		if (id > 0 && this.m_fs[id] == 1) {
			this.m_fids.push(id);
			this.m_fs[id] = 0;
			this.m_entieies[id] = null;
		}
	}
	// 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)
	addEntity(entity: IRenderEntityBase): Entity3DNode {
		let node = this.createNode();
		this.m_entieies[node.spaceId] = entity;
		node.entity = entity;
		entity.__$rseFlag = REF.AddSpaceUid(entity.__$rseFlag, node.spaceId);
		return node;
	}
	initialize(total: number): void {
		if (total > 0) {
			for (let i: number = 0; i < total; i++) {
				let node = this.createNode();
				this.m_entieies[node.spaceId] = null;
			}
		}
	}
	getNodeByEntity(entity: IRenderEntityBase): Entity3DNode {
		if (REF.TestSpaceContains(entity.__$rseFlag)) {
			let uid = REF.GetSpaceUid(entity.__$rseFlag);

			if (this.m_entieies[uid] == entity) {
				return this.m_list[uid];
			}
		}
		return null;
	}
	removeEntity(entity: IRenderEntityBase): void {
		if (REF.TestSpaceContains(entity.__$rseFlag)) {
			let uid = REF.GetSpaceUid(entity.__$rseFlag);
			if (this.m_entieies[uid] == entity) {
				this.m_list[uid].reset();
				this.restoreId(uid);
				entity.__$rseFlag = REF.RemoveSpaceUid(entity.__$rseFlag);
			}
		}
	}
}
