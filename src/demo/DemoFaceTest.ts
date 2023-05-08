import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import DisplayEntity from "../vox/entity/DisplayEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import MouseEvent from "../vox/event/MouseEvent";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import IGeomModelData from "../vox/mesh/IGeomModelData";
import MeshFactory from "../vox/mesh/MeshFactory";
import Box3DEntity from "../vox/entity/Box3DEntity";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import VtxDrawingInfo from "../vox/render/vtx/VtxDrawingInfo";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import RendererState from "../vox/render/RendererState";
import Vector3D from "../vox/math/Vector3D";
import { CoGeomDataType, CoModelTeamLoader } from "../cospace/app/common/CoModelTeamLoader";
import { EntityLayouter } from "../vox/utils/EntityLayouter";
import Matrix4 from "../vox/math/Matrix4";

export class DemoFaceTest {
	private m_init = true;
	private m_texLoader: ImageTextureLoader = null;
    private m_teamLoader = new CoModelTeamLoader();
    private m_layouter = new EntityLayouter();
	constructor() {}

	// private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
	// 	return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
	// }

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		let hostUrl = window.location.href;
		if (hostUrl.indexOf(".artvily.") > 0) {
			hostUrl = "http://www.artvily.com:9090/";
			url = hostUrl + url;
		}
		return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	private initEvent(rscene: RendererScene): void {}

	private createDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {
		let div: HTMLDivElement = document.createElement("div");
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		document.body.appendChild(div);
		div.style.display = "bolck";
		div.style.left = px + "px";
		div.style.top = py + "px";
		div.style.position = "absolute";
		div.style.display = "bolck";
		div.style.position = "absolute";
		return div;
	}
	initialize(): void {
		console.log("DemoFaceTest::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			DivLog.SetDebugEnabled(false);

			// let rparam = new RendererParam();
			// rparam.maxWebGLVersion = 1;
			let rparam = new RendererParam(this.createDiv(0, 0, 512, 512));
			rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			let rscene = new RendererScene();
			rscene.initialize(rparam, 3).setAutoRunning(true);

			this.m_texLoader = new ImageTextureLoader(rscene.textureBlock);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
			this.initEvent(rscene);
		}
	}
	private createVtxInfo(): VtxDrawingInfo {
		// return null;
		return new VtxDrawingInfo();
	}
	private testDataMesh(rscene: RendererScene): void {
		// 推荐的模型数据组织形式

		let fragCode = `
		bool facing = gl_FrontFacing;
		FragColor0.rgb *= facing ? vec3(1.0,0.2,0.2) : vec3(0.2,1.0,0.2);
		`;
		let material = new Default3DMaterial();
		material.fragBodyTailCode = fragCode;
		// material.normalEnabled = true;
		// material.vtxInfo = this.createVtxInfo();
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 					0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 							0, 0, 1, 0, 1, 1]);
		let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 		10, -100, -10, -10, -100, -10, -10, -100, 10]);

		let camera = rscene.getCamera();
		let viewMat = camera.getViewMatrix().clone();
		viewMat.append(camera.getProjectMatrix());

		let view_vs = vs.slice(0);
		viewMat.transformVectors(vs, vs.length, view_vs);

		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		ivs = new Uint16Array([0, 1, 2, 5, 4, 3]);
		this.calcFaceStatus(ivs, view_vs, "Step A");
		// ivs = new Uint16Array([2, 1, 0, 3, 4, 5]);
		// this.calcFaceStatus(ivs, view_vs, "Step B");
		let model: IGeomModelData = { vertices: vs, uvsList: [uvs], normals: null, indices: ivs, wireframe: true };
		let mesh = MeshFactory.createDataMeshFromModel(model);

		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0
		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0

		let scale = 10.0;
		let entity = new DisplayEntity();
		entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		rscene.addEntity(entity);
	}

	private calcFaceStatus(ivs: Uint16Array | Uint32Array, vs: Float32Array, idns: string = "", maxTrisTotal: number = 10): void {
		let v0 = new Vector3D();
		let v1 = new Vector3D();
		let v2 = new Vector3D();
		let v01 = new Vector3D();
		let v02 = new Vector3D();
		let crossV = new Vector3D();

		let v_z = new Vector3D(0, 0, 1);

		// console.log(idns, " xxx ivs: ", ivs);
		let trisTotal = Math.floor(ivs.length / 3);
		if(trisTotal > maxTrisTotal) {
			trisTotal = maxTrisTotal;
		}
		// console.log(idns, " xxx trisTotal: ", trisTotal);
		for (let i = 0; i < trisTotal; ++i) {
			const j = i * 3;
			let k = ivs[j] * 3;
			// console.log("k: ", k);
			v0.setXYZ(vs[k], vs[k + 1], vs[k + 2]);
			k = ivs[j + 1] * 3;
			v1.setXYZ(vs[k], vs[k + 1], vs[k + 2]);
			k = ivs[j + 2] * 3;
			v2.setXYZ(vs[k], vs[k + 1], vs[k + 2]);
			// console.log("v0: ", v0);
			// console.log("v1: ", v1);
			// console.log("v2: ", v2);
			v01.subVecsTo(v1, v0);
			v02.subVecsTo(v2, v0);
			Vector3D.Cross(v01, v02, crossV);

			// let sin_status = Math.sin(rad);
			let status = crossV.dot(v_z);
			// if(status < 0) {
			// 	const a = ivs[j];
			// 	ivs[j] = ivs[j + 2];
			// 	ivs[j + 2] = a;
			// }
			// console.log(idns, " xxx status: ", status);
		}
	}

    private initModels(rscene: RendererScene): void {

		let viewMat = rscene.getCamera().getViewMatrix().clone();
		viewMat.append(rscene.getCamera().getProjectMatrix());

        let url = "static/private/ctm/errorNormal.ctm";
        // url = "static/private/obj/apple_01.obj";
        url = "static/private/obj/errorNormal.obj";
        url = "static/private/fbx/errorNormal_uvUnwrap.fbx";
        url = "static/private/fbx/apple_01_uvUnwrap.fbx";

        let loader = this.m_teamLoader;
        loader.load([url], (models: CoGeomDataType[], transforms: Float32Array[]): void => {

            this.m_layouter.layoutReset();
			let model = models[0];
			let vs = model.vertices
			let ivs = model.indices;
			let view_vs = vs.slice(0);
			viewMat.transformVectors(vs, vs.length, view_vs);
			this.calcFaceStatus(ivs, view_vs, "Step C", 100);
			this.createEntity(rscene, model);
            this.m_layouter.layoutUpdate(300, new Vector3D());
        });
    }
	private initScene(rscene: RendererScene): void {
		// this.testDataMesh(rscene);
		this.initModels(rscene);
	}

	private createEntity(rscene: RendererScene, pmodel: CoGeomDataType): void {
		// 推荐的模型数据组织形式

		let fragCode = `
		bool facing = gl_FrontFacing;
		FragColor0.rgb = facing ? vec3(1.0,0.1,0.1) : vec3(0.1,1.0,0.1);
		// FragColor0.rgb = v_worldNormal.xyz;
		`;
		let material = new Default3DMaterial();
		material.useBake = true;
		material.normalEnabled = true;
		material.fragBodyTailCode = fragCode;
		// material.normalEnabled = true;
		// material.vtxInfo = this.createVtxInfo();
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		// let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		// let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
		// let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 10, 0, 10]);
		// let viewMat = rscene.getCamera().getViewMatrix();
		// let view_vs = vs.slice(0);
		// viewMat.transformVectors(vs, vs.length, view_vs);

		// let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		// ivs = new Uint16Array([0, 1, 2]);
		// this.calcFaceStatus(ivs, view_vs, "Step A");
		// ivs = new Uint16Array([2, 1, 0]);
		// this.calcFaceStatus(ivs, view_vs, "Step B");
		// let model: IGeomModelData = { vertices: pmodel.vertices, uvsList: [pmodel.uvsList[0]], normals: null, indices: pmodel.indices, wireframe: true };
		let mesh = MeshFactory.createDataMeshFromModel(pmodel);

		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0
		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0

		let scale = 10.0;
		let entity = new DisplayEntity();
		entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		rscene.addEntity(entity);
		this.m_layouter.layoutAppendItem(entity, new Matrix4(null));
	}
}
export default DemoFaceTest;
