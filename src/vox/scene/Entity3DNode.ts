/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererConst from "../../vox/scene/RendererConst";
import IAABB from "../../vox/geom/IAABB";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IEntity3DNode from "./IEntity3DNode";
import IRPOUnit from "../render/IRPOUnit";

export default class Entity3DNode implements IEntity3DNode {
	
	uid = -1;
	rstatus = 0;
	/**
	 * project occlusion culling test enabled
	 */
	pcoEnabled = false;
	drawEnabled = true;
	prev: Entity3DNode = null;
	next: Entity3DNode = null;
	entity: IRenderEntity = null;
	bounds: IAABB = null;
	rayTestState = 0;
	runit: IRPOUnit = null;
	spaceId = -1;
	// 记录上一次摄像机裁剪自身的状态
	camVisiSt = 0;
	// 记录摄像机可见状态,大于0表示不可见
	camVisi = RendererConst.CAMERA_VISIBLE_ENABLE;
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
		this.runit = null;
		this.spaceId = -1;
		this.camVisi = 0;
	}
	isVisible(): boolean {
		// console.log(this.runit.rendering, ",", this.runit.drawing);
		return this.runit.drawing && this.entity.isDrawEnabled();
		// return this.runit.rendering && this.runit.drawing;
	}
	// busy
	private static s_b: number = 1;
	// free
	private static s_f: number = 0;

	private static m_nodesLen: number = 0;
	private static m_nodes: Entity3DNode[] = [];
	private static m_flags: number[] = [];
	private static m_freeIds: number[] = [];

	static GetFreeId(): number {
		if (Entity3DNode.m_freeIds.length > 0) {
			return Entity3DNode.m_freeIds.pop();
		}
		return -1;
	}

	static GetByUid(uid: number): Entity3DNode {
		if (uid > -1 && uid < Entity3DNode.m_nodesLen) {
			return Entity3DNode.m_nodes[uid];
		}
		return null;
	}
	static SetCamVisiByUid(uid: number, status: number): void {
		Entity3DNode.m_nodes[uid].camVisi = status;
	}
	static GetCamVisiByUid(uid: number): number {
		return Entity3DNode.m_nodes[uid].camVisi;
	}
	static Create(): Entity3DNode {
		let node: Entity3DNode = null;
		let index: number = Entity3DNode.GetFreeId();
		if (index >= 0) {
			node = Entity3DNode.m_nodes[index];
			node.uid = index;
			Entity3DNode.m_flags[index] = Entity3DNode.s_b;
		} else {
			// create a new nodeIndex
			node = new Entity3DNode();
			Entity3DNode.m_nodes.push(node);
			Entity3DNode.m_flags.push(Entity3DNode.s_b);
			node.uid = Entity3DNode.m_nodesLen;
			Entity3DNode.m_nodesLen++;
		}
		return node;
	}
	static Restore(pnode: Entity3DNode): void {
		if (pnode != null && pnode.uid >= 0 && Entity3DNode.m_flags[pnode.uid] == Entity3DNode.s_b) {
			Entity3DNode.m_freeIds.push(pnode.uid);
			Entity3DNode.m_flags[pnode.uid] = Entity3DNode.s_f;
			pnode.reset();
		}
	}
}
