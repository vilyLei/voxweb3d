/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 当前渲染场景空间管理的入口类, 鼠标拾取，摄像机裁剪，空间管理遮挡剔除等都是由这个系统来组织完成的

import RSEntityFlag from "../../vox/scene/RSEntityFlag";
import IVector3D from "../../vox/math/IVector3D";
import IAABB from "../../vox/geom/IAABB";

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
import RenderingEntitySet from "./RenderingEntitySet";
import DebugFlag from "../debug/DebugFlag";
import IRPOUnit from "../render/IRPOUnit";

export default class RendererSpace implements IRendererSpace {
	private static s_uid: number = 0;
	private m_uid: number = -1;
	private m_renderer: IRenderer = null;
	private m_camera: IRenderCamera = null;
	private m_stage3d: IRenderStage3D = null;
	private m_emptyRPOUnit: IRPOUnit = null;

	private m_rpoNodeBuilder: IRPONodeBuilder = null;

	private m_nodeQueue: EntityNodeQueue = new EntityNodeQueue();
	private m_nodeWLinker: Entity3DNodeLinker = new Entity3DNodeLinker();
	private m_nodeSLinker: Entity3DNodeLinker = new Entity3DNodeLinker();
	private m_cullingor: ISpaceCullingor = null;
	private m_raySelector: IRaySelector = null;
	private m_entitysTotal: number = 0;
	readonly renderingEntitySet = new RenderingEntitySet();

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
			this.m_emptyRPOUnit = this.m_rpoNodeBuilder.createRPOUnit();
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
	getMouseXYWorldRay(rl_position: IVector3D, rl_tv: IVector3D): void {
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
	getPOVNumber(): number {
		return this.m_cullingor ? this.m_cullingor.getPOVNumber() : 0;
	}
	// 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)
	addEntity(entity: IRenderEntity): void {
		const SCM = SpaceCullingMask;
		if (entity.getGlobalBounds() != null && entity.spaceCullMask > SCM.NONE) {
			if (RSEntityFlag.TestSpaceEnabled(entity.__$rseFlag)) {
				entity.update();
				++this.m_entitysTotal;

				let node = this.m_nodeQueue.addEntity(entity);
				node.bounds = entity.getGlobalBounds();
				node.pcoEnabled = (entity.spaceCullMask & SCM.POV) == SCM.POV;

				let boo = entity.isInRendererProcess() || entity.getMaterial() == null;
				if (boo && (entity.spaceCullMask & SCM.POV) == SCM.POV) {
					node.rstatus = 1;
					if (entity.getMaterial() == null) {
						node.runit = this.m_emptyRPOUnit;
					}

					if (node.runit == null) {
						node.runit = entity.getDisplay().__$$runit as IRPOUnit;
					}
					this.m_nodeSLinker.addNode(node);
				} else {
					if (entity.getMaterial() == null) {
						node.rstatus = 1;
						node.runit = this.m_emptyRPOUnit;
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
			
			let node = this.m_nodeQueue.getNodeByEntity(entity);
			if (node != null) {
				if (node.rstatus > 0) {
					this.m_nodeSLinker.removeNode(node);
				} else {
					this.m_nodeWLinker.removeNode(node);
				}
				this.m_nodeQueue.removeEntity(entity);
				// node.reset();
				--this.m_entitysTotal;
			}
		}
	}
	update(): void { }
	runBegin(): void { }
	run(): void {
		let nextNode = this.m_nodeWLinker.getBegin();
		if (nextNode != null) {
			let pnode: Entity3DNode = null;
			while (nextNode != null) {
				const entity = nextNode.entity;
				if (entity.isInRendererProcess()) {
					pnode = nextNode;
					pnode.rstatus = 1;
					nextNode = nextNode.next;
					this.m_nodeWLinker.removeNode(pnode);
					this.m_nodeSLinker.addNode(pnode);
					if (pnode.runit == null) {
						pnode.runit = entity.getDisplay().__$$runit as IRPOUnit;
					}
				} else {
					nextNode = nextNode.next;
				}
			}
		}
		nextNode = this.m_nodeSLinker.getBegin();
		const cam = this.m_camera;
		if (nextNode != null) {
			let total = 0;
			const cor = this.m_cullingor;
			if (cor) {
				cor.setCamera(this.m_camera);
				cor.setCullingNodeHead(nextNode);
				cor.run();
				total = this.m_cullingor.total;
			} else {
				let ab: IAABB = null;
				
				let vboo = false;
				while (nextNode != null) {
					vboo = false;
					if (nextNode.isVisible()) {
						ab = nextNode.bounds;
						vboo = cam.visiTestSphere2(ab.center, ab.radius);
						if(vboo) total += 1;
					}
					
					nextNode.drawEnabled = vboo;
					nextNode.entity.drawEnabled = vboo;
					nextNode.runit.rendering = vboo;

					nextNode = nextNode.next;
				}
			}
			const etset = this.renderingEntitySet;
			if (total > 0) {
				etset.reset(total);
				nextNode = this.m_nodeSLinker.getBegin();
				while (nextNode != null) {
					if (nextNode.drawEnabled) {
						etset.addEntity(nextNode.entity);
					}
					nextNode = nextNode.next;
				}
			} else {
				etset.clear();
			}
		}
	}
	rayTest(rlpv: IVector3D, rltv: IVector3D): void {
		if (this.m_raySelector != null) {
			this.m_raySelector.etset = this.renderingEntitySet;
			this.m_raySelector.setCamera(this.m_camera);
			this.m_raySelector.setRay(rlpv, rltv);
			this.m_raySelector.run();
		}
	}
	runEnd(): void { }
	getCullingNodeHead(): Entity3DNode {
		return this.m_nodeSLinker.getBegin();
	}
}
