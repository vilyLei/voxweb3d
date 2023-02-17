import IRendererScene from "../../vox/scene/IRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoEntity } from "../voxentity/ICoEntity";
import { ICoMaterial } from "../voxmaterial/ICoMaterial";
import { ICoUIInteraction } from "../voxengine/ui/ICoUIInteraction";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;

/**
 * cospace renderer scene
 */
export class DemoPrimitives {

	private m_rscene: IRendererScene = null;
	private m_mouseInteraction: IMouseInteraction = null;
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
		let url7 = "static/cospace/ageom/CoAgeom.umd.js";

		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initMouseInteraction();
		});
		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();
				new ModuleLoader(5, (): void => {
					console.log("ready to build scene objs.");
					this.init3DScene();
				})
					.load(url3)
					.load(url4)
					.load(url5)
					.load(url6)
					.load(url7);
			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url2);
	}
	private init3DScene(): void {

		let size = 50;
		let v0 = CoRScene.createVec3(size, size, size);
		let entity = CoEntity.createBox(v0, v0.clone().scaleBy(-1));
		this.m_rscene.addEntity(entity);

		let cubeMaterial = CoMaterial.createDefaultMaterial();
		cubeMaterial.setRGB3f(0.7, 1.0, 1.0);
		cubeMaterial.normalEnabled = true;
		let cube = CoEntity.createCube(200, cubeMaterial);
		cube.setXYZ(-300, 0, 0);
		this.m_rscene.addEntity(cube);

		let sphMaterial = CoMaterial.createDefaultMaterial();
		sphMaterial.normalEnabled = true;
		let sph = CoEntity.createSphere(150, 20, 20, false, sphMaterial);
		sph.setXYZ(300, 0, 0);
		this.m_rscene.addEntity(sph);

		let coneMaterial = CoMaterial.createDefaultMaterial();
		coneMaterial.normalEnabled = true;
		let cone = CoEntity.createCone(100, 150, 20, -0.5, coneMaterial);
		cone.setXYZ(300, 0, -300);
		this.m_rscene.addEntity(cone);
		
		let planeMaterial = CoMaterial.createDefaultMaterial();
		planeMaterial.normalEnabled = true;
		let plane = CoEntity.createXOZPlane(-50, -50, 100, 100, coneMaterial);
		plane.setXYZ(-300, 0, 300);
		this.m_rscene.addEntity(plane);
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

export default DemoPrimitives;
