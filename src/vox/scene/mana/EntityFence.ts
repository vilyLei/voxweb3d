import IREntityScene from "../IREntityScene";

import IRenderEntityBase from "../../render/IRenderEntityBase";
import IRenderEntity from "../../render/IRenderEntity";

import Entity3DNode from "../Entity3DNode";
import EntityNodeQueue from "..//EntityNodeQueue";
import Entity3DNodeLinker from "../Entity3DNodeLinker";

export default class EntityFency {

	private m_rc: IREntityScene = null;
	private m_wlinker: Entity3DNodeLinker = null;
	private m_wq: EntityNodeQueue = null;
	private m_timeoutId: any = -1;
	private m_updating = false;

	constructor(rc: IREntityScene) {
		this.m_rc = rc;
	}
	addEntity(entity: IRenderEntityBase, processid: number): void {
		if (entity) {

			// console.log("EntityFency::addEntity() entity: ", entity);
			let et = entity as IRenderEntity;
			// wait queue
			if (this.m_wlinker == null) {
				this.m_wlinker = new Entity3DNodeLinker();
				this.m_wq = new EntityNodeQueue();
			}
			let node = this.m_wq.addEntity(et);
			node.rstatus = processid;
			this.m_wlinker.addNode(node);

			if (!this.m_updating) {
				this.m_updating = true;
				this.update();
			}
		}
	}
	removeEntity(entity: IRenderEntityBase): boolean {
		if (entity) {
			if (this.m_wlinker) {
				let re = entity as IRenderEntity;
				let node = this.m_wq.getNodeByEntity(re);
				if (node) {
					re.getTransform().setUpdater(null);
					this.m_wlinker.removeNode(node);
					this.m_wq.removeEntity(re);
					return true;
				}
			}
		}
		return false;
	}
	private update(): void {
		if (this.m_timeoutId < 0) {
			console.log("启动 EntityFency::update() timer !!!");
		}
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
			this.m_timeoutId = -1;
		}
		let flag = false;
		if (this.m_wlinker != null) {
			let nextNode = this.m_wlinker.getBegin();
			if (nextNode != null) {
				let pnode: Entity3DNode;
				let status: number;
				while (nextNode) {
					console.log("EntityFency::update(), nextNode.entity.hasMesh().");
					if (nextNode.entity.hasMesh()) {
						pnode = nextNode;
						nextNode = nextNode.next;
						status = pnode.rstatus;
						const entity = pnode.entity;
						this.m_wlinker.removeNode(pnode);
						this.m_wq.removeEntity(pnode.entity);
						console.log("EntityFency::update(), ready a mesh data that was finished.");
						this.m_rc.addEntity(entity, status);
					} else {
						flag = true;
						nextNode = nextNode.next;
					}
				}
			}
		}
		if (flag) {
			this.m_timeoutId = setTimeout(this.update.bind(this), 100); // 10 fps
		} else {
			this.m_updating = false;
			console.log("关闭 EntityFency::update() timer !!!");
		}
	}
	destroy(): void {
		if (this.m_rc) {
			this.m_rc = null;
		}
	}
}
