import { GPUTexture } from "../../gpu/GPUTexture";
import { TestTexResource } from "./TestTexResource";

import { GeomRDataType, GeomDataBase } from "../geometry/GeomDataBase";
import CameraBase from "../../../vox/view/CameraBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRShderSrcType } from "../../render/pipeline/WGRPipelineCtxParams";

import basicVertWGSL from "../shaders/vs3uvs2.vert.wgsl";
import vertexPositionColorWGSL from "../shaders/vertexPositionColor.frag.wgsl";
import sampleTextureMixColorWGSL from "../shaders/sampleTextureMixColor.frag.wgsl";
import sampleTwoTextureWGSL from "../shaders/sampleTwoTexture.frag.wgsl";

import { WGRenderer } from "../../rscene/WGRenderer";
import { WGMaterial } from "../../material/WGMaterial";
import { Entity3D } from "../../entity/Entity3D";
import { WGGeometry } from "../../geometry/WGGeometry";
import { WGTextureWrapper } from "../../texture/WGTextureWrapper";
import { WGRPipelineContextDefParam } from "../../material/WGMaterialDescripter";

class EntityTestScene {

	private mGeomDatas: GeomRDataType[] = [];
	private mEntities: Entity3D[] = [];
	readonly geomData = new GeomDataBase();

	texRes = new TestTexResource();
	wgCtx: WebGPUContext = null;

	renderer = new WGRenderer();
	enabled = false;
	camera = new CameraBase();

	msaaRenderEnabled = true;

	constructor() {}

	private initCamera(width: number, height: number): void {

		const cam = this.camera;
		cam.inversePerspectiveZ = true;

		let perspective = false;

		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		if (perspective) {
			cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		} else {
			cam.orthoRH(0.1, 5000, -0.5 * height, 0.5 * height, -0.5 * width, 0.5 * width);
		}
		cam.lookAtRH(new Vector3D(0.0, 0.0, 1000.0), new Vector3D(0.0, 0.0, 0.0), camUpDirect);
		cam.setViewXY(0, 0);
		cam.setViewSize(width, height);

		cam.update();
	}
	initialize(canvas: HTMLCanvasElement): void {

		let sampleCount = 4;
		this.initCamera(canvas.width, canvas.height);
		this.geomData.initialize(this.wgCtx);
		this.texRes.wgCtx = this.wgCtx;
		this.renderer.initialize({ ctx: this.wgCtx });

		this.renderer.createRenderBlock({
			sampleCount: sampleCount,
			multisampleEnabled: this.msaaRenderEnabled,
			depthFormat: "depth32float"
		});
		this.createRenderGeometry();

		this.texRes.buildDefault2DTextures((texs: GPUTexture[]): void => {

			this.initEntityScene();
			console.log("entitiesTotal: ", this.mEntities.length);
			this.enabled = true;
		});
		console.log("msaaRenderEnabled: ", this.msaaRenderEnabled);
	}
	private initEntityScene(): void {

		let jpgTexs = this.texRes.jpgTexList;
		let pngTexs = this.texRes.pngTexList;

		let baseDefParam = {
			faceCullMode: "back"
		};
		this.createEntity(this.createShapeMaterial(baseDefParam));
		this.createEntity(this.createShapeMaterial(baseDefParam));
		this.createEntity(this.createTexMaterial(baseDefParam, [jpgTexs[0]]));
		this.createEntity(this.createTexMaterial(baseDefParam, [jpgTexs[0], jpgTexs[1]]));

		let transparentDefParam = {
			blendMode: "transparent",
			depthWriteEnabled: false,
			faceCullMode: "back"
		};
		this.createEntity(this.createTexMaterial(transparentDefParam, [pngTexs[0]]));
	}
	private createMaterial(pipelineDefParam?: WGRPipelineContextDefParam, texs?: GPUTexture[]): WGMaterial {
		const rgd = this.mGeomDatas[0];
		let texTotal = texs ? texs.length : 0;
		let pipelineVtxParam = rgd.vtxDescParam;

		let material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: this.getShaderSrc(texTotal),
			pipelineVtxParam,
			pipelineDefParam
		});
		if (texTotal > 0) {
			let texWrappers: WGTextureWrapper[] = new Array(texTotal);
			for (let i = 0; i < texTotal; ++i) {
				texWrappers[i] = new WGTextureWrapper({ texture: { texture: texs[i], shdVarName: "texture" + i } });
			}
			material.textures = texWrappers;
		}
		return material;
	}
	private createShapeMaterial(pipelineDefParam?: WGRPipelineContextDefParam): WGMaterial {
		return this.createMaterial(pipelineDefParam);
	}
	private createTexMaterial(pipelineDefParam?: WGRPipelineContextDefParam, texs?: GPUTexture[]): WGMaterial {
		return this.createMaterial(pipelineDefParam, texs);
	}
	private createEntity(material: WGMaterial): void {
		const renderer = this.renderer;
		const rgd = this.mGeomDatas[0];

		let geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] });
		geometry.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] });
		geometry.setIndexBuffer({ name: "geom-index", data: rgd.ivs });

		let k = this.mEntities.length;
		let entity = new Entity3D();
		entity.materials = [material];
		entity.geometry = geometry;
		let trans = entity.transform;
		trans.setXYZ(-150 + k * 80, -150 + k * 80, 0.1 * k);
		trans.setScaleXYZ(0.5, 0.5, 0.5);
		entity.applyCamera(this.camera);

		this.mEntities.push(entity);
		renderer.addEntity(entity);
	}
	private createRenderGeometry(): void {
		this.mGeomDatas.push(this.geomData.createPlaneRData(-150, -150, 300, 300, 0));
	}
	update(): void {
		const ctx = this.wgCtx;
		if (ctx.enabled) {}
	}
	private getShaderSrc(texTotal: number = 0): WGRShderSrcType {
		// console.log("XXXXXXXXX getShaderSrc() texTotal: ", texTotal);
		let code = texTotal > 1 ? sampleTwoTextureWGSL : sampleTextureMixColorWGSL;
		if (texTotal < 1) {
			code = vertexPositionColorWGSL;
		}
		const uuid = "fragShdTex" + texTotal;
		const params: WGRShderSrcType = {
			vertShaderSrc: { code: basicVertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: code, uuid: uuid }
		};
		return params;
	}
}
export { EntityTestScene };
