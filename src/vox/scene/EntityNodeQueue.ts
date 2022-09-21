/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RSEntityFlag from "../../vox/scene/RSEntityFlag";
import IRenderEntity from "../../vox/render/IRenderEntity";
import Entity3DNode from "../../vox/scene/Entity3DNode";

export default class EntityNodeQueue {

	private m_listLen: number = 0;
	private m_ids: number[] = [];
	private m_list: Entity3DNode[] = [];
	private m_entieies: IRenderEntity[] = [];
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
		let index: number = this.getFreeId();
		if (index >= 0) {
			this.m_fs[index] = 1;
			return this.m_list[index];
		} else {
			// create a new nodeIndex
			index = this.m_listLen;
			let node = Entity3DNode.Create();
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
	addEntity(entity: IRenderEntity): Entity3DNode {
		let node = this.createNode();
		this.m_entieies[node.spaceId] = entity;
		node.entity = entity;
		entity.__$rseFlag = RSEntityFlag.AddSpaceUid(entity.__$rseFlag, node.spaceId);
		return node;
	}
	initialize(total: number): void {
		if (total > 0) {
			for (let i: number = 0; i < total; i++) {
				let node: Entity3DNode = this.createNode();
				this.m_entieies[node.spaceId] = null;
			}
		}
	}
	getNodeByEntity(entity: IRenderEntity): Entity3DNode {
		if (RSEntityFlag.TestSpaceContains(entity.__$rseFlag)) {
			let uid: number = RSEntityFlag.GetSpaceUid(entity.__$rseFlag);

			if (this.m_entieies[uid] == entity) {
				return this.m_list[uid];
			}
		}
		return null;
	}
	removeEntity(entity: IRenderEntity): void {
		if (RSEntityFlag.TestSpaceContains(entity.__$rseFlag)) {
			let uid: number = RSEntityFlag.GetSpaceUid(entity.__$rseFlag);
			if (this.m_entieies[uid] == entity) {
				this.m_list[uid].entity = null;
				this.restoreId(uid);
				entity.__$rseFlag = RSEntityFlag.RemoveSpaceUid(entity.__$rseFlag);
			}
		}
	}
}
