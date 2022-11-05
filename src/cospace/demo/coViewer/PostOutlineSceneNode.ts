import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { CoNormalMaterial } from "../../voxengine/material/CoNormalMaterial";
import { ViewerCoSApp } from "./ViewerCoSApp";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";
import IRenderNode from "../../../vox/scene/IRenderNode";
import IOcclusionPostOutline from "../../../renderingtoy/mcase/outline/IOcclusionPostOutline";
import { IOccPostOutlineModule } from "../../renderEffect/outline/IOccPostOutlineModule";

// import OcclusionPostOutline from "../../../renderingtoy/mcase/outline/OcclusionPostOutline";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";

declare var CoRScene: ICoRScene;
declare var OccPostOutlineModule: IOccPostOutlineModule;

class PostOutlineSceneNode implements IRenderNode {
	private m_rscene: ICoRendererScene;
	private m_vcoapp: ViewerCoSApp;
	private m_postOutline: IOcclusionPostOutline;

	private m_scale: number = 1.0;

	constructor(rscene: ICoRendererScene, vcoapp: ViewerCoSApp) {

		this.m_rscene = rscene;
		this.m_vcoapp = vcoapp;

		let url = "static/cospace/renderEffect/occPostOutline/OccPostOutlineModule.umd.js";

		new ModuleLoader(1)
			.setCallback((): void => {
				this.m_postOutline = OccPostOutlineModule.create();
				this.initOutline();
			})
			.load(url);

		// this.createOutline();
		// this.initOutline();
	}
	private createOutline(): void {
		// this.m_postOutline = new OcclusionPostOutline();
	}
	setScale(scale: number): PostOutlineSceneNode {
		this.m_scale = scale;
		return this;
	}
	loadGeomModel(url: string, format: CoDataFormat): PostOutlineSceneNode {
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
		return this;
	}
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {
		let len = unit.data.models.length;
		let m_scale = this.m_scale;
		// len = 1;
		for (let i: number = 0; i < len; ++i) {
			let entity = this.createEntity(unit.data.models[i]);
			entity.setScaleXYZ(m_scale, m_scale, m_scale);
		}
	}
	private createEntity(model: CoGeomDataType): ITransformEntity {
		// let rst = CoRenderer.RendererState;
		const MouseEvent = CoRScene.MouseEvent;
		// let entity: ITransformEntity;
		// entity = CoRScene.createDisplayEntityFromModel(model, new CoNormalMaterial().build().material);
		let material = new CoNormalMaterial().build().material;
		let mesh = CoRScene.createDataMeshFromModel(model, material);
		let entity = CoRScene.createMouseEventEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_rscene.addEntity(entity);

		entity.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);

		return entity;
	}

	private initOutline(): void {
		this.m_postOutline.initialize(this.m_rscene, 1, [0]);
		this.m_postOutline.setFBOSizeScaleRatio(0.5);
		this.m_postOutline.setRGB3f(0.0, 2.0, 0.0);
		this.m_postOutline.setOutlineDensity(2.5);
		this.m_postOutline.setOcclusionDensity(0.2);
	}
	private mouseOverTargetListener(evt: any): void {
		console.log("mouseOverTargetListener() mouse out...");
		if (this.m_postOutline != null) {
			if (evt.target != null) {
				this.m_postOutline.setRGB3f(0.0, 1.0, 0.0);
				let targets: IRenderEntity[] = [evt.target];
				this.m_postOutline.setTargetList(targets);
			}
		}
	}
	private mouseOutTargetListener(evt: any): void {
		console.log("mouseOutTargetListener() mouse out...");
		if (this.m_postOutline != null) {
			this.m_postOutline.setTargetList(null);
		}
	}

	render(): void {
		if (this.m_postOutline != null) {
			// console.log("post outline renderNode render() ...");
			this.m_postOutline.drawBegin();
			this.m_postOutline.draw();
			this.m_postOutline.drawEnd();
		}
	}
}

export { PostOutlineSceneNode };
