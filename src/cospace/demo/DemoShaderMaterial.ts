import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoMesh } from "../voxmesh/ICoMesh";
import { ICoMaterial } from "../voxmaterial/ICoMaterial";
import { ICoEntity } from "../voxentity/ICoEntity";

import { ICoUIInteraction } from "../voxengine/ui/ICoUIInteraction";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../app/common/CoGeomModelLoader";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import { ShaderCode } from "./shader/ShaderCode";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;

/**
 * cospace renderer scene
 */
export class DemoShaderMaterial {

	private m_rscene: IRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;
    private m_modelLoader = new CoGeomModelLoader();

	constructor() { }

	initialize(): void {

        console.log("EffectExample::initialize()......");

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.min.js";
		let url2 = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
		let url3 = "static/cospace/comesh/CoMesh.umd.js";
		let url4 = "static/cospace/coentity/CoEntity.umd.js";
		let url5 = "static/cospace/coMaterial/CoMaterial.umd.js";

		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initMouseInteraction();
		});

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();
				new ModuleLoader(3, (): void => {
					console.log("ready to build scene objs.");
					this.initModel();
				})
					.load(url3)
					.load(url4)
					.load(url5);
			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url2);
	}
	// private initSceneObjs(): void {
	// 	let entity = CoEntity.createDisplayEntity();
	// 	let mesh = CoMesh.createDataMesh();

	// }
	private m_material: IRenderMaterial = null;
    protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {
        if (model != null) {
            console.log("createEntity(), model: ", model);
            let vs = model.vertices;
            let uvs = model.uvsList[0];
            let ivs = model.indices;
            let trisNumber = ivs.length / 3;

            let nvs = model.normals;
            // if (nvs == null) {
            //     SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
            // }
            // let material = this.m_material = CoMaterial.createDefaultMaterial();
            // material.setTextureList([
            //     this.getTexByUrl("static/assets/effectTest/metal_01_COLOR.png")
            // ]);
			let material = CoMaterial.createShaderMaterial("model_shd");
			material.setFragShaderCode(ShaderCode.frag_body);
			material.setVtxShaderCode(ShaderCode.vert_body);
			// material.addUniformDataAt("u_color",new Float32Array([1.0,1.0,1.0]));// 会出现神奇的边缘效果
			// material.addUniformDataAt("u_color",new Float32Array([1.0,1.0,1.0, 0.0]));// 这样也会出现。实际上边缘颜色就是frag shader的输出颜色
			material.addUniformDataAt("u_color",new Float32Array([1.0,1.0,1.0, 1.0]));
			material.setTextureList([
                this.getTexByUrl("static/assets/effectTest/metal_01_COLOR.png")
            ]);
            material.initializeByCodeBuf(true);

            let mesh = CoMesh.createDataMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setVS(vs);
            mesh.setUVS(uvs);
            mesh.setNVS(nvs);
            mesh.setIVS(ivs);
            mesh.setVtxBufRenderData(material);

            mesh.initialize();

            let entity =CoEntity.createDisplayEntity();
            entity.setRenderState(CoRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
            entity.setMesh(mesh);
            entity.setMaterial(material);
            entity.getTransform().setParentMatrix(CoRScene.createMat4(transform));
            entity.setScaleXYZ(165.0, 165.0, 165.0);
            // entity.setScale3(new Vector3D( 165.0, 165.0, 165.0 ));

            this.m_rscene.addEntity(entity);
            // entity.update();
        }
    }
    private initModel(): void {
        this.m_modelLoader.setListener(
            (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat): void => {
                console.log("loaded model.");
                for (let i = 0; i < models.length; ++i) {
                    this.createEntity(models[i], transforms != null ? transforms[i] : null);
                }
            },
            (total): void => {
                console.log("loaded model all.");
            });

        let baseUrl = "static/private/";
        let url = baseUrl + "obj/base.obj";
        url = baseUrl + "fbx/base4.fbx";
        // url = baseUrl + "fbx/hat_ok.fbx";
        url = baseUrl + "obj/apple_01.obj";
        // url = baseUrl + "ctm/errorNormal.ctm";
		
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
			// this.createColorData(img);
			tex.setDataFromImage(img, 0, 0, 0, false);
		};
		img.src = url;
		return tex;
	}
	private initRenderer(): void {

		if (this.m_rscene == null) {

			let RendererDevice = CoRenderer.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);

			// let axis = CoRScene.createAxis3DEntity();
			// this.m_rscene.addEntity(axis);
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
