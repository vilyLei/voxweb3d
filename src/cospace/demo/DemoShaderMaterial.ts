import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoMaterial } from "../voxmaterial/ICoMaterial";
import { ICoUIInteraction } from "../voxengine/ui/ICoUIInteraction";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../app/common/CoGeomModelLoader";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { ShaderCode } from "./shader/ShaderCode";
import { CoEntityLayouter } from "../app/common/CoEntityLayouter";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMaterial: ICoMaterial;

/**
 * cospace renderer scene
 */
export class DemoShaderMaterial {

	private m_rscene: IRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;
	private m_modelLoader = new CoGeomModelLoader();
	private m_layouter = new CoEntityLayouter();
	constructor() { }

	initialize(): void {

		console.log("EffectExample::initialize()......");
		document.oncontextmenu = function (e) {
			e.preventDefault();
		}

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.min.js";
		let url2 = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
		let url3 = "static/cospace/comesh/CoMesh.umd.js";
		let url4 = "static/cospace/coentity/CoEntity.umd.js";
		let url5 = "static/cospace/coMaterial/CoMaterial.umd.js";
		let url6 = "static/cospace/math/CoMath.umd.js";

		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initMouseInteraction();
		});

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();
				new ModuleLoader(4, (): void => {
					console.log("ready to build scene objs.");
					this.initModel();
				})
					.load(url3)
					.load(url4)
					.load(url5)
					.load(url6);
			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url2);
	}
	private m_material: IRenderMaterial = null;
	protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {
		if (model != null) {
			console.log("createEntity(), model: ", model);
			let material = CoMaterial.createShaderMaterial("model_shd");
			material.setFragShaderCode(ShaderCode.frag_body);
			material.setVertShaderCode(ShaderCode.vert_body);
			// material.addUniformDataAt("u_color",new Float32Array([1.0,1.0,1.0]));// 会出现神奇的边缘效果
			// material.addUniformDataAt("u_color",new Float32Array([1.0,1.0,1.0, 0.0]));// 这样也会出现。实际上边缘颜色就是frag shader的输出颜色
			material.addUniformDataAt("u_color", new Float32Array([1.0, 1.0, 1.0, 1.0]));
			material.setTextureList([
				this.getTexByUrl("static/assets/effectTest/metal_01_COLOR.png")
			]);

			let matrix4 = CoRScene.createMat4(transform);
			let entity = CoRScene.createDisplayEntityFromModel(model, material);
			this.m_rscene.addEntity(entity);

			this.m_layouter.layoutAppendItem(entity, matrix4);
		}
	}
	private initModel(): void {

		this.m_layouter.layoutReset();
		this.m_modelLoader.setListener(
			(models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat): void => {
				console.log("loaded model, models: ", models);
				for (let i = 0; i < models.length; ++i) {
					if(models[i].vertices != null) {
						this.createEntity(models[i], transforms != null ? transforms[i] : null);
					}
				}
			},
			(total): void => {
				console.log("loaded model all.");
				this.m_layouter.layoutUpdate();
			});

		let baseUrl = "static/private/";
		let url = baseUrl + "fbx/base4.fbx";
		// url = baseUrl + "obj/apple_01.obj";
		url = baseUrl + "fbx/plane01.obj";

		this.loadModels([url]);
	}
	private loadModels(urls: string[], typeNS: string = ""): void {
		this.m_modelLoader.load(urls);
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initMouseInteraction(): void {

		let r = this.m_rscene;
		if (r != null && this.m_mouseInteraction == null && typeof CoUIInteraction !== "undefined") {

			this.m_mouseInteraction = CoUIInteraction.createMouseInteraction();
			this.m_mouseInteraction.initialize(this.m_rscene, 0, true);
			this.m_mouseInteraction.setSyncLookAtEnabled(true);
		}
	}

	private getTexByUrl(url: string = ""): IRenderTexture {
		let sc = this.m_rscene;

		let tex = sc.textureBlock.createImageTex2D(64, 64, false);
		let img = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img, 0, 0, 0, false);
		};
		img.src = url;
		return tex;
	}
	private initRenderer(): void {

		if (this.m_rscene == null) {

			// let RendererDevice = CoRenderer.RendererDevice;
			// RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			// RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			// RendererDevice.SetWebBodyColor("black");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam);
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_mouseInteraction != null) {
				this.m_mouseInteraction.setLookAtPosition(null);
				this.m_mouseInteraction.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoShaderMaterial;
