import { GPUTexture } from "../../gpu/GPUTexture";
import { TestTexResource } from "./TestTexResource";
import { GeomRDataType, GeomDataBase } from "../geometry/GeomDataBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRShderSrcType } from "../../render/pipeline/WGRPipelineCtxParams";

import basicVertWGSL from "../shaders/vs3uvs2.vert.wgsl";
import vertexPositionColorWGSL from "../shaders/vertexPositionColor.frag.wgsl";
import sampleTextureMixColorWGSL from "../shaders/sampleTextureMixColor.frag.wgsl";
import sampleTwoTextureWGSL from "../shaders/sampleTwoTexture.frag.wgsl";
import cubeTextureWGSL from "../shaders/sampleCubemap.frag.wgsl";

import { WGRenderer } from "../../rscene/WGRenderer";
import { WGMaterial } from "../../material/WGMaterial";
import { Entity3D } from "../../entity/Entity3D";
import { WGGeometry } from "../../geometry/WGGeometry";
import { WGTextureWrapper } from "../../texture/WGTexture";
import { WGRPipelineContextDefParam } from "../../material/WGMaterialDescripter";

class TriangleScene {

	private mGeomDatas: GeomRDataType[] = [];
	private mEntities: Entity3D[] = [];

	geomData = new GeomDataBase();
	renderer = new WGRenderer();

	// wgCtx: WebGPUContext;
	enabled = false;
	msaaRenderEnabled = true;

	constructor() {}

	private initCamera(width: number, height: number): void {

		const cam = this.renderer.camera;
		cam.inversePerspectiveZ = true;

		let perspective = true;

		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		if (perspective) {
			cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		} else {
			cam.orthoRH(0.1, 5000, -0.5 * height, 0.5 * height, -0.5 * width, 0.5 * width);
		}
		cam.lookAtRH(new Vector3D(1200.0, 1200.0, 1200.0), new Vector3D(0.0, 0.0, 0.0), camUpDirect);
		cam.setViewXY(0, 0);
		cam.setViewSize(width, height);

		cam.update();
	}
	initialize(canvas: HTMLCanvasElement, wgCtx: WebGPUContext): void {

		let sampleCount = 4;
		this.initCamera(canvas.width, canvas.height);
		this.geomData.initialize(wgCtx);

		this.renderer.initialize(wgCtx);

		this.renderer.createRenderBlock({
			sampleCount: sampleCount,
			multisampleEnabled: this.msaaRenderEnabled,
			depthFormat: "depth32float"
		});
		this.createRenderGeometry();

		this.initEntityScene();
		this.enabled = true;
		console.log("msaaRenderEnabled: ", this.msaaRenderEnabled);
	}
	private initEntityScene(): void {

		console.log("TriangleScene::initEntityScene() ...");

		// let baseDefParam = {
		// 	faceCullMode: "back"
		// };

		this.createEntity([this.createShapeMaterial()]);
	}
	private createMaterial(pipelineDefParam?: WGRPipelineContextDefParam, texs?: GPUTexture[], dimension = '2d'): WGMaterial {

		const rgd = this.mGeomDatas[0];
		let texTotal = texs ? texs.length : 0;
		let pipelineVtxParam = rgd.vtxDescParam;

		let material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: this.getShaderSrc(texTotal, dimension),
			pipelineVtxParam,
			pipelineDefParam
		});
		if (texTotal > 0) {
			let texWrappers: WGTextureWrapper[] = new Array(texTotal);
			for (let i = 0; i < texTotal; ++i) {
				texWrappers[i] = new WGTextureWrapper({ texture: { texture: texs[i], shdVarName: "texture" + i, dimension } });
			}
			material.textures = texWrappers;
		}
		return material;
	}
	private createShapeMaterial(pipelineDefParam?: WGRPipelineContextDefParam): WGMaterial {
		return this.createMaterial(pipelineDefParam);
	}
	private createEntity(materials: WGMaterial[], geomIndex = -1): void {

		const renderer = this.renderer;
		const gds = this.mGeomDatas;
		geomIndex = geomIndex < 0 ? Math.round(Math.random() * (gds.length - 1)) : geomIndex;
		const rgd = gds[ geomIndex ];

		let geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] });
		geometry.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] });
		geometry.setIndexBuffer({ name: "geom-index", data: rgd.ivs });

		// let k = this.mEntities.length;
		let entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.applyCamera(this.renderer.camera);

		this.mEntities.push(entity);
		renderer.addEntity(entity);
	}

	private createRenderGeometry(): void {
		// this.mGeomDatas.push(this.geomData.createPlaneRData(-150, -150, 300, 300, 0));
		let minV = new Vector3D(-50, -50, -50);
		let maxV = minV.clone().scaleBy(-1);
		this.mGeomDatas.push(this.geomData.createBoxRData(minV, maxV));
		console.log("this.this.mGeomDatas: ", this.mGeomDatas);
	}
	update(): void {

		const ctx = this.renderer.getWGCtx();
		if (ctx.enabled && this.enabled) {
		}
	}
	private getShaderSrc(texTotal = 0, dimension = '2d'): WGRShderSrcType {
		// console.log("XXXXXXXXX getShaderSrc() texTotal: ", texTotal);
		let code = texTotal > 1 ? sampleTwoTextureWGSL : sampleTextureMixColorWGSL;
		if (texTotal < 1) {
			code = vertexPositionColorWGSL;
		}
		if(dimension == "cube") {
			code = cubeTextureWGSL;
		}
		const params: WGRShderSrcType = {
			vertShaderSrc: { code: basicVertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: code, uuid: "fragShdTex" + texTotal }
		};
		return params;
	}
}
export { TriangleScene };
