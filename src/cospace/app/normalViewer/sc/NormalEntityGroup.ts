import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import { NormalEntityNode } from "./NormalEntityNode";
import { NVTransUI } from "../ui/NVTransUI";

import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoEntity } from "../../../voxentity/ICoEntity";
import { ICoMesh } from "../../../voxmesh/ICoMesh";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUI } from "../../../voxui/ICoUI";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import IMouseEventEntity from "../../../../vox/entity/IMouseEventEntity";
import IRenderEntity from "../../../../vox/render/IRenderEntity";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import IMatrix4 from "../../../../vox/math/IMatrix4";
import { NormalEntityLayout } from "./NormalEntityLayout";
import { CoDataModule } from "../../../app/common/CoDataModule";
import { NormalEntityManager } from "./NormalEntityManager";
import { NVEntityGroup } from "./NVEntityGroup";
import { BoxLine3D } from "../../../edit/entity/BoxLine3D";
import { CoEntityLayouter } from "../../common/CoEntityLayouter";

declare var CoUI: ICoUI;
declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;
declare var CoMesh: ICoMesh;

class NormalEntityGroup extends NVEntityGroup {
	private m_coapp: CoDataModule;

	uiscene: ICoUIScene;
	ctrPanel: NormalCtrlPanel;
	rsc: IRendererScene;
	transUI: NVTransUI;

	constructor(coapp: CoDataModule) {
		super();
		this.m_coapp = coapp;
	}

	initialize(rscene: IRendererScene, transUI: NVTransUI): void {}
	loadModels(urls: string[], typeNS: string = ""): void {
		if (urls != null && urls.length > 0) {
			let purls = urls.slice(0);
			this.m_coapp.deferredInit((): void => {
				for (let i = 0; i < purls.length; ++i) {
					this.loadModel(purls[i], typeNS);
				}
			});
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
		// let ins = this.m_coapp.coappIns;
		let ins = this.m_coapp;
		if (ins != null) {
			this.uiscene.prompt.getPromptPanel().applyConfirmButton();
			this.uiscene.prompt.showPrompt("Model loading!");
			this.m_loadTotal++;
			let unit = ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					if (format != CoDataFormat.FBX) {
						this.createEntityFromModels(unit.data.models, unit.data.transforms);
					}
					this.createEntityFromUnit(unit, status);
				},
				true
			);
			if (format == CoDataFormat.FBX) {
				unit.data.modelReceiver = (models: CoGeomDataType[], transforms: Float32Array[], index: number, total: number): void => {
					// console.log("XXX: ", index, ",", total);
					this.createEntityFromModels(models, transforms);
				};
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
				node.groupUid = this.getUid();
				// console.log("XXXXX node.groupUid: ",node.groupUid);
				this.entityManager.addNode(node);
				nodes.push(node);
				this.m_nodes.push(node);
				entities.push(node.entity);
			}
		}

		this.updateLayout(false);
	}
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {
		this.m_loadedTotal++;
		if (this.m_loadedTotal >= this.m_loadTotal) {
			this.uiscene.prompt.getPromptPanel().applyConfirmButton();
			this.uiscene.prompt.showPrompt("Model loading finish!");
			let ls = this.m_nodes;
			for (let i = 0; i < ls.length; ++i) {
				ls[i].applyEvent();
			}
			// this.buildBounds();
		}
	}
	private buildBounds(): void {
		let ls = this.m_nodes;
		for (let i = 0; i < ls.length; ++i) {
			//ls[i].applyEvent();
			let box = new BoxLine3D();
			box.initializeWithAABB(this.rsc, 1, ls[i].entity.getGlobalBounds(), CoMaterial.createColor4(Math.random() * 1.0 + 0.2, Math.random() * 1.0 + 0.2, Math.random() * 1.0 + 0.2))
		}
	}
	private addEntityWithModel(model: CoGeomDataType, transform: Float32Array): NormalEntityNode {
		if (model != null) {
			console.log("addEntityWithModel(), model: ", model);
			let node = new NormalEntityNode();
			node.rsc = this.rsc;
			node.transUI = this.transUI;
			let entity = node.setEntityModel(model);
			let mat4 = transform != null ? CoRScene.createMat4(transform) : null;
			// this.m_transforms.push(mat4);
			// this.m_transes.push(entity);
			// if (this.m_layoutor == null) {
			// 	this.m_layoutor = new CoEntityLayouter();
			// 	this.m_layoutor.initialize();
			// 	this.m_layoutor.layoutReset();
			// }
			this.m_layoutor.layoutAppendItem(entity, mat4);

			return node;
		}
		return null;
	}

	// private m_transforms: IMatrix4[] = [];
	// private m_transes: ITransformEntity[] = [];
	// private m_layoutor: NormalEntityLayout = null;
	private m_layoutor: CoEntityLayouter = new CoEntityLayouter();

	private updateLayout(rotationEnabled: boolean): void {
		/*
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
		//*/
		this.m_layoutor.layoutUpdate(rotationEnabled);
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
		// this.m_transforms = null;
		// this.m_transes = null;
		if(this.m_layoutor != null) {
			this.m_layoutor.layoutReset();
			this.m_layoutor = null;
		}

		this.rsc = null;
		if(this.m_coapp != null) {
			// todo
			
			this.m_coapp = null;
		}
	}
}
export { NormalEntityGroup };
