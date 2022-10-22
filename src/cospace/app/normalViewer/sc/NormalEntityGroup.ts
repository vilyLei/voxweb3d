
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import { NormalEntityNode } from "./NormalEntityNode";
import { TransUI } from "../../../edit/demo/edit/ui/TransUI";

import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUI } from "../../../voxui/ICoUI";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import IMouseEventEntity from "../../../../vox/entity/IMouseEventEntity";
import IRenderEntity from "../../../../vox/render/IRenderEntity";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import IMatrix4 from "../../../../vox/math/IMatrix4";
import { NormalEntityLayout } from "./NormalEntityLayout";
import { ViewerCoSApp } from "../../../demo/coViewer/ViewerCoSApp";
import { NormalEntityManager } from "./NormalEntityManager";

declare var CoUI: ICoUI;
declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalEntityGroup {

	private static s_uid = 0;
	private m_uid = NormalEntityGroup.s_uid++;
	private m_vcoapp: ViewerCoSApp;

	ctrPanel: NormalCtrlPanel;
	rsc: IRendererScene;
	transUI: TransUI;
	entityManager: NormalEntityManager;

	private m_map: Map<number, NormalEntityNode> = new Map();
	private m_selectEntities: ITransformEntity[] = null;
	private m_scaleBase = 1.0;

	constructor(vcoapp: ViewerCoSApp) {
		this.m_vcoapp = vcoapp;
	}
	getUid(): number {
		return this.m_uid;
	}
	initialize(): void {
	}
	private m_loadTotal = 0;
	private m_loadedTotal = 0;
	loadModels(urls: string[], typeNS: string = ""): void {
		if (urls != null && urls.length > 0) {
			this.m_loadTotal = urls.length;
			for (let i = 0; i < urls.length; ++i) {
				this.loadModel(urls[i], typeNS);
			}
		}
	}

	private loadModel(url: string, typeNS: string = ""): void {
		console.log("loadModel, url: ", url);

		let ns = typeNS;
		if (typeNS == "") {
			let k0 = url.lastIndexOf(".") + 1;
			let k1 = url.lastIndexOf("?");
			ns = k1 < 0 ? url.slice(k0) : url.slice(k0, k1);
		}
		ns = ns.toLocaleLowerCase();

		let type = CoDataFormat.OBJ;
		switch (ns) {
			case "obj":
				type = CoDataFormat.OBJ;
				break;
			case "fbx":
				type = CoDataFormat.FBX;
				break;
			case "drc":
				type = CoDataFormat.Draco;
				break;
			case "ctm":
				type = CoDataFormat.CTM;
				break;
			default:
				break;
		}
		this.loadGeomModel(url, type);
	}
	private loadGeomModel(url: string, format: CoDataFormat): void {

		let ins = this.m_vcoapp.coappIns;
		if (ins != null) {

			ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					this.createEntityFromUnit(unit, status);
				},
				true
			);
		}
	}
	private m_nodes: NormalEntityNode[] = [];
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {

		console.log("XXXXXX createEntityFromUnit, unit: ", unit);

		let entities: ITransformEntity[] = [];
		let len = unit.data.models.length;

		let nodes: NormalEntityNode[] = [];
		for (let i = 0; i < len; ++i) {
			let dt = unit.data;
			const node = this.addEntityWithModel(dt.models[i], dt.transforms != null ? dt.transforms[i] : null);
			if (node != null) {
				this.entityManager.addNode(node);
				nodes.push(node);
				this.m_nodes.push(node);
				entities.push(node.entity);
			}
		}
		// group.updateLayout(false);

		// let sc = this.rscene;
		for (let i = 0; i < nodes.length; ++i) {
			nodes[i].createNormalLine();
		}

		// for (let i = 0; i < len; ++i) {
		// 	let entity = this.m_entities[i];
		// 	let bounds = entity.getGlobalBounds();
		// 	let boxLine = new BoxLine3D();
		// 	boxLine.initializeWithAABB(sc, 0, bounds);
		// }


		this.m_loadedTotal++;
		// if(this.m_loadedTotal >= this.m_loadTotal) {
		this.updateLayout(false);
		this.transUI.getRecoder().save(entities);
		// }
	}
	private addEntityWithModel(model: CoGeomDataType, transform: Float32Array): NormalEntityNode {

		if (model != null) {

			let map = this.m_map;
			let node = new NormalEntityNode();
			node.rsc = this.rsc;
			node.transUI = this.transUI;
			let entity = node.setEntityModel(model);
			map.set(entity.getUid(), node);
			console.log("DDDXXX transform: ", transform);
			let mat4 = transform != null ? CoRScene.createMat4(transform) : null;
			this.m_transforms.push(mat4);
			this.m_transes.push(entity);

			return node;
		}
		return null;
	}

	private m_transforms: IMatrix4[] = [];
	private m_transes: ITransformEntity[] = [];
	private m_layoutor: NormalEntityLayout = null;

	updateLayout(rotationEnabled: boolean): void {

		if (this.m_layoutor == null) {
			this.m_layoutor = new NormalEntityLayout();
			this.m_layoutor.initialize();
		}
		this.m_layoutor.rotationEnabled = rotationEnabled;

		let pivot = CoRScene.createVec3();
		this.m_layoutor.fixToPosition(this.m_transes, this.m_transforms, pivot, 300.0);
		this.m_transforms = null;
		this.m_transes = null;
	}

	destroy(): void {

		let ls = this.m_nodes;
		if (ls != null && ls.length > 0) {
			for (let i = 0; i < ls.length; ++i) {
				this.entityManager.removeNode(ls[i]);
				ls[i].destroy();
			}
		}
		this.m_nodes = [];
		this.entityManager = null;

		this.m_transforms = null;
		this.m_transes = null;
		this.m_layoutor = null;

		this.rsc = null;
		this.m_map.clear();
	}
}
export { NormalEntityGroup };
