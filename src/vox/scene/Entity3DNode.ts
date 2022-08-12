/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererConst from "../../vox/scene/RendererConst";
import IAABB from "../../vox/geom/IAABB";
import IRPONode from "../../vox/render/IRPONode";
import IRenderEntity from "../../vox/render/IRenderEntity";

export default class Entity3DNode {
	uid: number = -1;
	rstatus: number = 0;
	//distanceFlag:boolean = false;
	// project occlusion culling test enabled
	pcoEnabled: boolean = false;
	drawEnabled: boolean = true;
	prev: Entity3DNode = null;
	next: Entity3DNode = null;
	entity: IRenderEntity = null;
	bounds: IAABB = null;
	rayTestState: number = 0;
	rpoNode: IRPONode = null;
	spaceId: number = -1;
	// 记录上一次摄像机裁剪自身的状态
	camVisiSt: number = 0;
	// 记录摄像机可见状态,大于0表示不可见
	camVisi: number = RendererConst.CAMERA_VISIBLE_ENABLE;
	reset(): void {
		this.rayTestState = 0;
		this.uid = -1;
		this.rstatus = 0;
		this.pcoEnabled = false;
		this.drawEnabled = true;
		this.prev = null;
		this.next = null;
		this.entity = null;
		this.bounds = null;
		this.rpoNode = null;
		this.spaceId = -1;
		this.camVisi = 0;
	}

	private static s_FLAG_BUSY: number = 1;
	private static s_FLAG_FREE: number = 0;

	private static m_nodeListLen: number = 0;
	private static m_nodeList: Entity3DNode[] = [];
	private static m_nodeFlagList: number[] = [];
	private static m_freeIdList: number[] = [];
	//private static m_camVisiList:number[] = [];

	static GetFreeId(): number {
		if (Entity3DNode.m_freeIdList.length > 0) {
			return Entity3DNode.m_freeIdList.pop();
		}
		return -1;
	}

	static GetByUid(uid: number): Entity3DNode {
		if (uid > -1 && uid < Entity3DNode.m_nodeListLen) {
			return Entity3DNode.m_nodeList[uid];
		}
		return null;
	}
	static SetCamVisiByUid(uid: number, status: number): void {
		Entity3DNode.m_nodeList[uid].camVisi = status;
	}
	static GetCamVisiByUid(uid: number): number {
		return Entity3DNode.m_nodeList[uid].camVisi;
	}
	static Create(): Entity3DNode {
		let node: Entity3DNode = null;
		let index: number = Entity3DNode.GetFreeId();
		if (index >= 0) {
			node = Entity3DNode.m_nodeList[index];
			node.uid = index;
			Entity3DNode.m_nodeFlagList[index] = Entity3DNode.s_FLAG_BUSY;
		} else {
			// create a new nodeIndex
			node = new Entity3DNode();
			Entity3DNode.m_nodeList.push(node);
			Entity3DNode.m_nodeFlagList.push(Entity3DNode.s_FLAG_BUSY);
			node.uid = Entity3DNode.m_nodeListLen;
			Entity3DNode.m_nodeListLen++;
		}
		return node;
	}
	static Restore(pnode: Entity3DNode): void {
		if (pnode != null && pnode.uid >= 0 && Entity3DNode.m_nodeFlagList[pnode.uid] == Entity3DNode.s_FLAG_BUSY) {
			Entity3DNode.m_freeIdList.push(pnode.uid);
			Entity3DNode.m_nodeFlagList[pnode.uid] = Entity3DNode.s_FLAG_FREE;
			pnode.reset();
		}
	}
}
