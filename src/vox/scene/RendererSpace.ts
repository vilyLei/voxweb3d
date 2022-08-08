/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 当前渲染场景空间管理的入口类, 鼠标拾取，摄像机裁剪，空间管理遮挡剔除等都是由这个系统来组织完成的

import RSEntityFlag from "../../vox/scene/RSEntityFlag";
import Vector3D from "../../vox/math/Vector3D";
import { IAABB } from "../../vox/geom/IAABB";

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import IRPONode from "../../vox/render/IRPONode";
import IRPONodeBuilder from "../../vox/render/IRPONodeBuilder";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import EntityNodeQueue from "../../vox/scene/EntityNodeQueue";
import Entity3DNodeLinker from "../../vox/scene/Entity3DNodeLinker";
import IRenderer from "../../vox/scene/IRenderer";
import IRaySelector from "../../vox/scene/IRaySelector";
import ISpaceCullingor from "../../vox/scene/ISpaceCullingor";
import DebugFlag from "../debug/DebugFlag";

export default class RendererSpace implements IRendererSpace {
	private static s_uid: number = 0;
	private m_uid: number = -1;
	private m_renderer: IRenderer = null;
	private m_camera: IRenderCamera = null;
	private m_stage3d: IRenderStage3D = null;
	private m_emptyRPONode: IRPONode = null;

	private m_rpoNodeBuilder: IRPONodeBuilder = null;

	private m_nodeQueue: EntityNodeQueue = new EntityNodeQueue();
	private m_nodeWLinker: Entity3DNodeLinker = new Entity3DNodeLinker();
	private m_nodeSLinker: Entity3DNodeLinker = new Entity3DNodeLinker();
	private m_cullingor: ISpaceCullingor = null;
	private m_raySelector: IRaySelector = null;
	private m_entitysTotal: number = 0;
	constructor() {
		this.m_uid = RendererSpace.s_uid++;
		this.m_nodeQueue.initialize(1);
	}
	getUid(): number {
		return this.m_uid;
	}
	initialize(renderer: IRenderer, camera: IRenderCamera = null): void {
		if (this.m_renderer == null) {
			this.m_renderer = renderer;
			this.m_stage3d = renderer.getStage3D();
			this.m_camera = camera;
			this.m_rpoNodeBuilder = renderer.getRPONodeBuilder();
			this.m_emptyRPONode = this.m_rpoNodeBuilder.createRPONode();
		}
	}

	getStage3D(): IRenderStage3D {
		return this.m_stage3d;
	}
	setCamera(camera: IRenderCamera): void {
		this.m_camera = camera;
	}
	getCamera(): IRenderCamera {
		return this.m_camera;
	}
	getMouseXYWorldRay(rl_position: Vector3D, rl_tv: Vector3D): void {
		this.m_camera.getWorldPickingRayByScreenXY(this.m_stage3d.mouseX, this.m_stage3d.mouseY, rl_position, rl_tv);
	}
	setSpaceCullingor(cullingor: ISpaceCullingor): void {
		this.m_cullingor = cullingor;
	}
	setRaySelector(raySelector: IRaySelector): void {
		this.m_raySelector = raySelector;
		this.m_raySelector.setRenderer(this.m_renderer);
	}
	getRaySelector(): IRaySelector {
		return this.m_raySelector;
	}
	// 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)
	addEntity(entity: IRenderEntity): void {
		if (entity.getGlobalBounds() != null && entity.spaceCullMask > SpaceCullingMask.NONE) {
			if (RSEntityFlag.TestSpaceEnabled(entity.__$rseFlag)) {
				entity.update();
				++this.m_entitysTotal;

				let node: Entity3DNode = this.m_nodeQueue.addEntity(entity);
				node.bounds = entity.getGlobalBounds();
				node.pcoEnabled = (entity.spaceCullMask & SpaceCullingMask.POV) == SpaceCullingMask.POV;

				let boo: Boolean = entity.isInRendererProcess() || entity.getMaterial() == null;
				if (boo && (entity.spaceCullMask & SpaceCullingMask.POV) == SpaceCullingMask.POV) {
					node.rstatus = 1;
					if (entity.getMaterial() == null) {
						node.rpoNode = this.m_emptyRPONode;
					}

					if (node.rpoNode == null) {
						node.rpoNode = this.m_rpoNodeBuilder.getNodeByUid(entity.getDisplay().__$rpuid) as IRPONode;
					}
					this.m_nodeSLinker.addNode(node);
				} else {
					if (entity.getMaterial() == null) {
						node.rstatus = 1;
						node.rpoNode = this.m_emptyRPONode;
						this.m_nodeSLinker.addNode(node);
					} else {
						node.rstatus = 0;
						this.m_nodeWLinker.addNode(node);
					}
				}
			}
		}
	}
	removeEntity(entity: IRenderEntity): void {
		if (entity != null && RSEntityFlag.TestSpaceContains(entity.__$rseFlag)) {
			let node: Entity3DNode = this.m_nodeQueue.getNodeByEntity(entity);
			if (node != null) {
				if (node.rstatus > 0) {
					this.m_nodeSLinker.removeNode(node);
				} else {
					this.m_nodeWLinker.removeNode(node);
				}
				this.m_nodeQueue.removeEntity(entity);
				--this.m_entitysTotal;
			}
		}
	}
	updateEntity(entity: IRenderEntity): void {
		//  if(RSEntityFlag.TestSpaceContains( entity.__$rseFlag ))
		//  {
		//      let node:Entity3DNode = this.m_nodeQueue.getNodeByEntity(entity);
		//      //  if(node != null)
		//      //  {
		//      //      node.distanceFlag = RSEntityFlag.TestSortEnabled(entity.__$rseFlag);
		//      //  }
		//  }
	}
	update(): void {}
	runBegin(): void {}
	run(): void {
		let nextNode: Entity3DNode = this.m_nodeWLinker.getBegin();
		if (nextNode != null) {
			let pnode: Entity3DNode = null;
			while (nextNode != null) {
				if (nextNode.entity.isInRendererProcess()) {
					pnode = nextNode;
					pnode.rstatus = 1;
					nextNode = nextNode.next;
					this.m_nodeWLinker.removeNode(pnode);
					this.m_nodeSLinker.addNode(pnode);
					if (pnode.rpoNode == null) {
						pnode.rpoNode = this.m_rpoNodeBuilder.getNodeByUid(pnode.entity.getDisplay().__$rpuid) as IRPONode;
					}
				} else {
					nextNode = nextNode.next;
				}
			}
		}
		nextNode = this.m_nodeSLinker.getBegin();
		if (nextNode != null) {
			if (this.m_cullingor != null) {
				this.m_cullingor.setCamera(this.m_camera);
				this.m_cullingor.setCullingNodeHead(nextNode);
				this.m_cullingor.run();
			} else {
				let ab: IAABB = null;
				let cam: IRenderCamera = this.m_camera;
				//let camPos:Vector3D = cam.getPosition();
				while (nextNode != null) {
					if (nextNode.rpoNode.isVsible() && nextNode.entity.isDrawEnabled()) {
						ab = nextNode.bounds;
						nextNode.drawEnabled = cam.visiTestSphere2(ab.center, ab.radius);
						nextNode.entity.drawEnabled = nextNode.drawEnabled;
						nextNode.rpoNode.drawEnabled = nextNode.drawEnabled;
						//  if(nextNode.drawEnabled && nextNode.distanceFlag)
						//  {
						//      nextNode.rpoNode.setValue(-Vector3D.DistanceSquared(camPos,ab.center));
						//      //console.log((nextNode.entity as any).name,",a runit.value: ",nextNode.rpoNode.unit.value);
						//  }
					} else {
						nextNode.drawEnabled = false;
						nextNode.entity.drawEnabled = false;
						nextNode.rpoNode.drawEnabled = false;
					}
					// if(DebugFlag.Flag_0 > 0) console.log("nextNode.rpoNode.isVsible(): ",nextNode.rpoNode.isVsible(), nextNode.entity.isDrawEnabled(), nextNode.drawEnabled);
					nextNode = nextNode.next;
				}
			}
		}
	}
	rayTest(rlpv: Vector3D, rltv: Vector3D): void {
		if (this.m_raySelector != null) {
			this.m_raySelector.setCamera(this.m_camera);
			this.m_raySelector.setCullingNodeHead(this.m_nodeSLinker.getBegin());
			this.m_raySelector.setRay(rlpv, rltv);
			this.m_raySelector.run();
		}
	}
	runEnd(): void {}
	getCullingNodeHead(): Entity3DNode {
		return this.m_nodeSLinker.getBegin();
	}
	toString(): string {
		return "[RendererSpace(uid = " + this.m_uid + ")]";
	}
}
