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

class EntityParam {
	rv = new Vector3D();
	sv = new Vector3D();
	pv = new Vector3D();
	running = true;
	constructor(){}
}
class CubeMapScene {

	private mGeomDatas: GeomRDataType[] = [];
	private mEntities: Entity3D[] = [];
	private mEParams: EntityParam[] = [];

	geomData = new GeomDataBase();
	texRes = new TestTexResource();
	renderer = new WGRenderer();

	wgCtx: WebGPUContext;
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
	initialize(canvas: HTMLCanvasElement): void {

		let sampleCount = 4;
		this.initCamera(canvas.width, canvas.height);
		this.geomData.initialize(this.wgCtx);
		this.texRes.wgCtx = this.wgCtx;
		this.renderer.initialize(this.wgCtx);

		this.renderer.createRenderBlock({
			sampleCount: sampleCount,
			multisampleEnabled: this.msaaRenderEnabled,
			depthFormat: "depth32float"
		});
		this.createRenderGeometry();

		this.texRes.buildDefault2DTextures((texs: GPUTexture[]): void => {

			// this.initEntityScene();
			// console.log("entitiesTotal: ", this.mEntities.length);
			// this.enabled = true;
			this.createCubeMapEntity();
		});
		console.log("msaaRenderEnabled: ", this.msaaRenderEnabled);
	}
	private mCubeTex: GPUTexture;
	private createCubeMapEntity(): void {
		let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];
		this.texRes.buildCubeTexture(urls, (tex: GPUTexture): void => {
			this.mCubeTex = tex;
			this.initEntityScene();
			console.log("entitiesTotal: ", this.mEntities.length, ", cubeTex: ", this.mCubeTex);

			let et = this.mEntities[0];
			et.transform.setXYZ(0,0,0);
			et.transform.setRotationXYZ(0,0,0);
			et.transform.setScaleXYZ(30,-30,30);
			et.applyCamera();
			let ep = this.mEParams[0];
			ep.running = false;
			this.enabled = true;
		});
	}
	private initEntityScene(): void {

		console.log("CubeMapScene::initEntityScene() ...");
		let jpgTexs = this.texRes.jpgTexList;
		let pngTexs = this.texRes.pngTexList;

		let baseDefParam = {
			faceCullMode: "back"
		};


		this.createEntity([this.createTexMaterial(baseDefParam, [this.mCubeTex], "cube")], 0);

		// this.createEntity([this.createShapeMaterial(baseDefParam)]);
		// this.createEntity([this.createShapeMaterial(baseDefParam)]);
		// this.createEntity([this.createTexMaterial(baseDefParam, [jpgTexs[0]])]);
		// this.createEntity([this.createTexMaterial(baseDefParam, [jpgTexs[0], jpgTexs[1]])]);

		// let transparentDefParam = {
		// 	blendMode: "transparent",
		// 	depthWriteEnabled: false,
		// 	faceCullMode: "back"
		// };
		// this.createEntity([this.createTexMaterial(transparentDefParam, [pngTexs[0]])]);
		for(let i = 0; i < 40; ++i) {
			this.createTransarentEntity();
		}
		// this.createTransarentEntity();
		// this.createTransarentEntity();
		// this.createTransarentEntity();
	}
	// matrial multi-passes
	private createTransarentEntity():void {

		let jpgTexs = this.texRes.jpgTexList;
		let pngTexs = this.texRes.pngTexList;
		let texIndex = Math.round(Math.random() * (pngTexs.length - 1));
		let transparentDefParam = {
			blendMode: "transparent",
			depthWriteEnabled: true,
			faceCullMode: "front"
		};
		let material0 = this.createTexMaterial(transparentDefParam, [pngTexs[texIndex]]);
		transparentDefParam = {
			blendMode: "transparent",
			depthWriteEnabled: true,
			faceCullMode: "back"
		};
		let material1 = this.createTexMaterial(transparentDefParam, [pngTexs[texIndex]]);
		this.createEntity([material0, material1], -1);
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
	private createTexMaterial(pipelineDefParam?: WGRPipelineContextDefParam, texs?: GPUTexture[], dimension = '2d'): WGMaterial {
		return this.createMaterial(pipelineDefParam, texs, dimension);
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

		let k = this.mEntities.length;
		let entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		let trans = entity.transform;
		// trans.setXYZ(-150 + k * 180, -150 + k * 280, 0.1 * k);
		trans.setXYZ(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 1000 - 500);
		// trans.setScaleXYZ(2.5, 2.5, 2.5);
		// trans.setRotationXYZ(0,0,0);
		trans.setRotationXYZ(Math.random() * 500, Math.random() * 500, Math.random() * 500);
		entity.applyCamera(this.renderer.camera);

		this.mEntities.push(entity);
		this.mEParams.push(new EntityParam());
		renderer.addEntity(entity);
	}
	private createRenderGeometry(): void {
		// this.mGeomDatas.push(this.geomData.createPlaneRData(-150, -150, 300, 300, 0));
		let minV = new Vector3D(-50, -50, -50);
		let maxV = minV.clone().scaleBy(-1);
		this.mGeomDatas.push(this.geomData.createBoxRData(minV, maxV));
		this.mGeomDatas.push(this.geomData.createSphereRData(60.0));
		this.mGeomDatas.push(this.geomData.createCylinderRData(60.0));
		this.mGeomDatas.push(this.geomData.createTorusRData(60.0));
		this.mGeomDatas.push(this.geomData.createTorusRData(120.0, 50));
		console.log("this.this.mGeomDatas: ", this.mGeomDatas);
	}

	update(): void {

		const ctx = this.wgCtx;
		if (ctx.enabled && this.enabled) {
			let cam = this.renderer.camera;
			let ets = this.mEntities;
			let eps = this.mEParams;
			let etsTotal = ets.length;
			for(let i = 0 ; i < etsTotal; i++) {
				let et = ets[i];
				let ep = eps[i];
				if(ep.running) {
					et.transform.getRotationXYZ(ep.rv);
					ep.rv.x += 0.2;
					ep.rv.y += 0.3;
					et.transform.setRotationV3( ep.rv );
					et.update();
				}
			}
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
export { CubeMapScene };
