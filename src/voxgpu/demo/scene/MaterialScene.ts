import { GPUTexture } from "../../gpu/GPUTexture";
import { WGRPipelineContext } from "../../render/pipeline/WGRPipelineContext";
import { WRORUnit } from "../entity/WRORUnit";

import { GeomRDataType, GeomDataBase } from "../geometry/GeomDataBase";
import CameraBase from "../../../vox/view/CameraBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRShderSrcType } from "../../render/pipeline/WGRPipelineCtxParams";

import basicVertWGSL from "../shaders/vs3uvs2.vert.wgsl";
import sampleTextureMixColorWGSL from "../shaders/sampleTextureMixColor.frag.wgsl";
import sampleTwoTextureWGSL from "../shaders/sampleTwoTexture.frag.wgsl";

import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WGRUniformValue } from "../../render/uniform/WGRUniformValue";
import { WGRenderer } from "../../rscene/WGRenderer";
import { WGRPrimitive } from "../../render/WGRPrimitive";
import { WGMaterial } from "../../material/WGMaterial";
import { Entity3D } from "../../entity/Entity3D";
import { WGGeometry } from "../../geometry/WGGeometry";

class MaterialScene {
	private mGeomDatas: GeomRDataType[] = [];
	private runits: WRORUnit[] = [];
	readonly geomData = new GeomDataBase();

	wgCtx: WebGPUContext = null;

	renderer = new WGRenderer();
	enabled = true;
	camera = new CameraBase();

	msaaRenderEnabled = true;
	mEnabled = false;

	constructor() {}

	private initCamera(width: number, height: number): void {

		const cam = this.camera;
		cam.inversePerspectiveZ = true;

		let perspective = false;

		const camPosition = new Vector3D(0.0, 0.0, 1000.0);
		const camLookAtPos = new Vector3D(0.0, 0.0, 0.0);
		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		if (perspective) {
			cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		} else {
			cam.orthoRH(0.1, 5000, -0.5 * height, 0.5 * height, -0.5 * width, 0.5 * width);
		}
		cam.lookAtRH(camPosition, camLookAtPos, camUpDirect);
		cam.setViewXY(0, 0);
		cam.setViewSize(width, height);

		cam.update();
	}
	initialize(canvas: HTMLCanvasElement): void {
		this.initCamera(canvas.width, canvas.height);

		console.log("msaaRenderEnabled: ", this.msaaRenderEnabled);

		let sampleCount = 4;

		this.geomData.initialize(this.wgCtx);

		this.renderer.initialize(this.wgCtx);
		let rblock = this.renderer.createRenderBlock({ sampleCount: sampleCount, multisampleEnabled: this.msaaRenderEnabled, depthFormat: "depth32float" });

		this.createRenderGeometry();

		const rgd = this.mGeomDatas[0];
		let pipelineVtxParam = rgd.vtxDescParam;

		let oneTexMaterial = new WGMaterial({shadinguuid: "base-material",shaderCodeSrc: this.getShaderSrc(1), pipelineVtxParam});

		// let texPipeline = rblock.createRenderPipelineCtx(this.getShaderSrc(1), pipelineVtxParam);
		// let texPipeline = rblock.createRenderPipelineCtxWithMaterial( oneTexMaterial );
		this.renderer.bindMaterial( oneTexMaterial, rblock );

		let texPipeline = oneTexMaterial.getRCtx() as WGRPipelineContext;
		let twoTexPipeline = rblock.createRenderPipelineCtx(this.getShaderSrc(2), pipelineVtxParam);

		let pipelineDefParam = {
			blendMode: "transparent",
			depthWriteEnabled: false,
			faceCullMode: "back"
		};
		let texTransparentPipeline = rblock.createRenderPipelineCtx(this.getShaderSrc(2), pipelineVtxParam, pipelineDefParam);

		let urls: string[] = [
			"static/assets/box.jpg",
			"static/assets/default.jpg",
			"static/assets/decorativePattern_01.jpg",
			"static/assets/letterA.png",
			"static/assets/xulie_08_61.png",
			"static/assets/blueTransparent.png"
		];

		this.buildTextures(urls, (texs: GPUTexture[]): void => {

			console.log("this.mPngTexList: ", this.mPngTexList);
			console.log("this.mJpgTexList: ", this.mJpgTexList);

			let pngViews: GPUTextureView[] = this.mPngViews;
			let jpgViews: GPUTextureView[] = this.mJpgViews;

			this.createEntities("texUniform", texPipeline, 1, [jpgViews[0]]);
			this.createEntities("twoTexUniform", twoTexPipeline, 1, [jpgViews[0], jpgViews[1]]);
			this.createEntities("texTransparentUniform", texTransparentPipeline, 1, [pngViews[0], pngViews[1]]);

			console.log("runitsTotal: ", this.runits.length);
			this.mEnabled = true;
		});
	}
	private initEntityScene(): void {
		const rgd = this.mGeomDatas[0];
		let pipelineVtxParam = rgd.vtxDescParam;
		let material = new WGMaterial({shadinguuid: "base-material-0",shaderCodeSrc: this.getShaderSrc(1), pipelineVtxParam});

		let geometry = new WGGeometry();
		geometry.addAttribute({shdVarName:"position", data: rgd.vs});
		geometry.addAttribute({shdVarName:"uv", data: rgd.uvs});
		geometry.setIndexBuffer({name: "geom-index", data: rgd.ivs});

		let entity = new Entity3D();
		entity.materials = [material];
		entity.geometry = geometry;
	}
	private createRenderGeometry(): void {
		this.mGeomDatas.push(this.geomData.createPlaneRData(-150, -150, 300, 300, 0));
		console.log("this.this.mGeomDatas: ", this.mGeomDatas);
		for (let i = 0; i < this.mGeomDatas.length; ++i) {
			const rgd = this.mGeomDatas[i];
			let rgeom = new WGRPrimitive();
			rgeom.ibuf = rgd.ibuf;
			rgeom.vbufs = rgd.vbufs;
			rgeom.indexCount = rgd.ibuf.elementCount;
			rgd.rgeom = rgeom;
		}
	}
	private createEntities(uniformLayoutName: string, pipelineCtx: WGRPipelineContext, total: number, texViews?: GPUTextureView[]): void {
		const matrixSize = 4 * 16;
		const rblock = this.renderer.getRPBlockAt(0);

		const rgd = this.mGeomDatas[0];

		const rgeom = rgd.rgeom;
		const uniformCtx = pipelineCtx.uniform;

		let utexes = [{ texView: texViews[0] }];
		utexes = [];
		for (let i = 0; i < texViews.length; ++i) {
			utexes.push({ texView: texViews[i] });
		}
		let layoutName = uniformLayoutName;
		let groupIndex = 0;
		for (let i = 0; i < total; ++i) {
			const unit = new WRORUnit();
			const k = this.runits.length;
			unit.trans.scaleFactor = 1.0;
			unit.trans.posV.setXYZ(-100 + k * 80, -100 + k * 80, 0.1 * k);
			unit.trans.scaleAndRotBoo = false;
			unit.trans.intialize(this.camera);

			unit.trans.run(this.camera);
			unit.trans.running = false;

			unit.trans.uniformValue = new WGRUniformValue(unit.trans.transData, 0);
			unit.trans.uniformValue.arrayStride = matrixSize;
			unit.runit = rblock.createRUnit(rgeom);
			unit.runit.pipelinectx = pipelineCtx;
			const ru = unit.runit;

			let uvalues: WGRUniformValue[] = [unit.trans.uniformValue];

			ru.setUniformValues(uvalues);
			ru.uniforms = uniformCtx.createUniformsWithValues([
				{
					layoutName: layoutName,
					groupIndex: groupIndex,
					values: uvalues,
					texParams: utexes
				}
			]);
			this.runits.push(unit);
		}
		// if (total == 1) {
		// 	this.runits[0].trans.scaleFactor = 1.0;
		// 	this.runits[0].trans.posV.setXYZ(-200, -250, 0);
		// }
	}
	private delayTimes = 500000000;
	update(): void {
		const ctx = this.wgCtx;
		if (ctx.enabled) {
			let units = this.runits;
			let unitsTotal = units.length;
			if (this.delayTimes > 0) {
				this.delayTimes--;
				for (let i = 0; i < unitsTotal; ++i) {
					units[i].trans.run(this.camera);
				}
			}
			// console.log("loss time: ", Date.now() - time);
		}
	}

	private mPngTexList: GPUTexture[] = [];
	private mJpgTexList: GPUTexture[] = [];
	private mPngViews: GPUTextureView[] = [];
	private mJpgViews: GPUTextureView[] = [];
	private buildTextures(urls: string[], callback: (texs: GPUTexture[]) => void, mipmap: boolean = true): void {
		if (urls && urls.length > 0) {
			let texs: GPUTexture[] = [];
			let total = urls.length;
			for (let i = 0; i < urls.length; ++i) {
				this.wgCtx.texture.createTex2DByUrl(urls[i], mipmap, true).then((tex: GPUTexture) => {
					const view = tex.createView();
					view.label = "(view)" + tex.url;
					if (tex.url.indexOf(".png") > 0) {
						this.mPngTexList.push(tex);
						this.mPngViews.push(view);
					} else {
						this.mJpgTexList.push(tex);
						this.mJpgViews.push(view);
					}
					texs.push(tex);
					total--;
					if (total < 1) {
						if (callback) {
							callback(texs);
						}
					}
				});
			}
		} else {
			this.wgCtx.texture.createTex2DByUrl("static/assets/box.jpg", true).then((tex: GPUTexture) => {
				if (callback) {
					callback([tex]);
				}
			});
		}
	}
	private getShaderSrc(texTotal: number): WGRShderSrcType {
		const code = texTotal > 1 ? sampleTwoTextureWGSL : sampleTextureMixColorWGSL;
		const uuid = "fragShdTex" + texTotal;
		const params: WGRShderSrcType = {
			vertShaderSrc: { code: basicVertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: code, uuid: uuid }
		};
		return params;
	}
}
export { MaterialScene };
