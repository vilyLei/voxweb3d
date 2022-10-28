import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
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

	uiscene: ICoUIScene;
	ctrPanel: NormalCtrlPanel;
	rsc: IRendererScene;
	transUI: TransUI;
	entityManager: NormalEntityManager;

	constructor(vcoapp: ViewerCoSApp) {
		this.m_vcoapp = vcoapp;
	}
	getUid(): number {
		return this.m_uid;
	}
	initialize(): void {
	}
	loadModels(urls: string[], typeNS: string = ""): void {
		if (urls != null && urls.length > 0) {
			// this.m_transforms = [];
			// this.m_transes = [];
			let purls = urls.slice(0);
			this.m_vcoapp.deferredInit((): void => {
				console.log("XXXXXXXXXXXXXXXXXXX deferredInit() call...");
				for (let i = 0; i < purls.length; ++i) {
					this.loadModel(purls[i], typeNS);
				}
			})
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

		let type = CoDataFormat.Undefined;
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
		if (type != CoDataFormat.Undefined) {
			this.loadGeomModel(url, type);
		} else {
			console.error("Can't support this model data format, url: ", url);
		}
	}
	private m_loadTotal = 0;
	private m_loadedTotal = 0;
	private loadGeomModel(url: string, format: CoDataFormat): void {

		// let ins = this.m_vcoapp.coappIns;
		let ins = this.m_vcoapp;
		if (ins != null) {
			this.uiscene.prompt.getPromptPanel().applyConfirmButton();
			this.uiscene.prompt.showPrompt("Model loading!");
			this.m_loadTotal++;
			// let unit = ins.getCPUDataByUrlAndCallback(
			// 	url,
			// 	format,
			// 	(unit: CoGeomDataUnit, status: number): void => {
			// 		if(format != CoDataFormat.FBX) {
			// 			this.createEntityFromModels(unit.data.models, unit.data.transforms);
			// 		}
			// 		this.createEntityFromUnit(unit, status);
			// 	},
			// 	true
			// );
			let unit = ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					if(format != CoDataFormat.FBX) {
						this.createEntityFromModels(unit.data.models, unit.data.transforms);
					}
					this.createEntityFromUnit(unit, status);
				},
				true
			);
			if(format == CoDataFormat.FBX) {
				unit.data.modelReceiver = (models: CoGeomDataType[], transforms: Float32Array[], index: number, total: number): void => {
					this.createEntityFromModels(models, transforms);
				}
			}
		}
	}
	private m_nodes: NormalEntityNode[] = [];
	private createEntityFromModels(models: CoGeomDataType[], transforms: Float32Array[]): void {

		let entities: ITransformEntity[] = [];
		let len = models.length;

		let nodes: NormalEntityNode[] = [];
		for (let i = 0; i < len; ++i) {
			const node = this.addEntityWithModel(models[i], transforms != null ? transforms[i] : null);
			if (node != null) {
				this.entityManager.addNode(node);
				nodes.push(node);
				this.m_nodes.push(node);
				entities.push(node.entity);
			}
		}

		this.updateLayout(false);
		this.transUI.getRecoder().save(entities);

	}
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {

		console.log("XXXXXX createEntityFromUnit, unit: ", unit);
		/*
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
		
		this.updateLayout(false);
		this.transUI.getRecoder().save(entities);
		
		// for (let i = 0; i < nodes.length; ++i) {
		// 	nodes[i].createNormalLine();
		// }
		//*/

		let nodes = this.m_nodes;
		for (let i = 0; i < nodes.length; ++i) {
			nodes[i].createNormalLine();
		}

		this.m_loadedTotal++;
		if (this.m_loadedTotal >= this.m_loadTotal) {
			this.uiscene.prompt.getPromptPanel().applyConfirmButton();
			this.uiscene.prompt.showPrompt("Model loaded finish!");
		}

	}
	private addEntityWithModel(model: CoGeomDataType, transform: Float32Array): NormalEntityNode {

		if (model != null) {

			// let map = this.m_map;
			let node = new NormalEntityNode();
			node.rsc = this.rsc;
			node.transUI = this.transUI;
			let entity = node.setEntityModel(model);
			// map.set(node.getUid(), node);
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

	private updateLayout(rotationEnabled: boolean): void {

		if (this.m_layoutor == null) {
			this.m_layoutor = new NormalEntityLayout();
			this.m_layoutor.initialize();
		}
		this.m_layoutor.rotationEnabled = rotationEnabled;
		for (let k = 0; k < this.m_transes.length; ++k) {
			let et = this.m_transes[k];
			et.setXYZ(0.0, 0.0, 0.0);
			et.setScaleXYZ(1.0, 1.0, 1.0);
			et.setRotationXYZ(0.0, 0.0, 0.0);
		}
		let pivot = CoRScene.createVec3();
		this.m_layoutor.fixToPosition(this.m_transes, this.m_transforms, pivot, 300.0);
		// this.m_transforms = null;
		// this.m_transes = null;
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

		this.uiscene = null;
		this.m_transforms = null;
		this.m_transes = null;
		this.m_layoutor = null;

		this.rsc = null;
	}
}
export { NormalEntityGroup };
