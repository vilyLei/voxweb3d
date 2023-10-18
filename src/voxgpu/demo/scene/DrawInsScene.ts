import { GPUTexture } from "../../gpu/GPUTexture";
import { WGRUniformParam, WGRPipelineContext } from "../../render/pipeline/WGRPipelineContext";
import { WRORUnit } from "../entity/WRORUnit";

import { GeomRDataType, GeomDataBase } from "../geometry/GeomDataBase";
import CameraBase from "../../../vox/view/CameraBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRPipelineCtxParams } from "../../render/pipeline/WGRPipelineCtxParams";

import InstancedVertWGSL from "../shaders/instanced.vert.wgsl";
import basicVertWGSL from "../shaders/vs3uvs2.vert.wgsl";
import sampleTextureMixColorWGSL from "../shaders/sampleTextureMixColor.frag.wgsl";
import sampleTextureMixColorBrnWGSL from "../shaders/sampleTextureMixColorBrn.frag.wgsl";
import vertexPositionColorWGSL from "../shaders/vertexPositionColor.frag.wgsl";
import vertexPositionColorBrnWGSL from "../shaders/vertexPositionColorBrn.frag.wgsl";

import { WROBufferContext } from "../pipeline/WROBufferContext";
import { WROTextureContext } from "../pipeline/WROTextureContext";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WGRUniformValue } from "../../render/uniform/WGRUniformValue";
import { WGRenderer } from "../../rscene/WGRenderer";
import { WGRGeometry } from "../../render/WGRGeometry";
import { WGRUniform } from "../../render/uniform/WGRUniform";

class DrawInsScene {
	private mGeomDatas: GeomRDataType[] = [];
	private runits: WRORUnit[] = [];
	private mPngTexList: GPUTexture[] = [];
	private mJpgTexList: GPUTexture[] = [];
	readonly vtxCtx = new WROBufferContext();
	readonly texCtx = new WROTextureContext();
	readonly geomData = new GeomDataBase();

	wgCtx: WebGPUContext | null = null;

	renderer = new WGRenderer();
	enabled = true;
	camera = new CameraBase();

	msaaRenderEnabled = true;
	mEnabled = false;

	constructor() {}

	private initCamera(width: number, height: number): void {
		const cam = this.camera;
		cam.inversePerspectiveZ = true;

		let perspective = true;

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
	// format: "depth32float"
	// format: "depth24plus"
	// private mDepthFormat = "depth32float";

	private mPosV = new Vector3D();
	initialize(canvas: HTMLCanvasElement): void {
		this.initCamera(canvas.width, canvas.height);

		console.log("msaaRenderEnabled: ", this.msaaRenderEnabled);

		let sampleCount = 4;

		this.geomData.initialize(this.wgCtx);
		this.vtxCtx.initialize(this.wgCtx);
		this.texCtx.initialize(this.wgCtx);

		this.renderer.initialize(this.wgCtx);
		this.renderer.createRenderBlock({ sampleCount: sampleCount, multisampleEnabled: this.msaaRenderEnabled, depthFormat: "depth32float" });

		this.createRenderGeometry();

		// let shapePipeline = this.createRenderPipeline();
		let instancedShapePipeline = this.createRenderPipeline(2);
		let instancedShapePipeline2 = this.createRenderPipeline(2);
		// let shapeBrnPipeline = this.createRenderPipeline(1, false, true);
		let texPipeline = this.createRenderPipeline(2, true, false);
		// let texTransparentPipeline = this.createRenderPipeline(1, true, false, true, true);
		// let texBrnPipeline = this.createRenderPipeline(1, true, true);

		let urls: string[] = [
			"static/assets/box.jpg",
			"static/assets/default.jpg",
			"static/assets/decorativePattern_01.jpg",
			"static/assets/letterA.png",
			"static/assets/xulie_08_61.png",
			"static/assets/blueTransparent.png"
		];
		this.buildTextures(urls, (texs: GPUTexture[]): void => {
			// this.createEntities(1, "shapeUniform", shapePipeline, 1);
			this.createEntities(16, "instancedShapeUniform", instancedShapePipeline, 1);
			this.mPosV.x += 25;
			this.mPosV.y += 25;
			this.createEntities(16, "instancedShapeUniform2", instancedShapePipeline, 1);

			console.log("this.mPngTexList: ", this.mPngTexList);
			console.log("this.mJpgTexList: ", this.mJpgTexList);

			let pngViews: GPUTextureView[] = [];
			for (let i = 0; i < this.mPngTexList.length; ++i) {
				const tex = this.mPngTexList[i];
				const texView = tex ? tex.createView() : null;
				if (texView) {
					texView.label = "png(view)" + tex.label;
					pngViews.push(texView);
				}
			}

			// this.createEntities(1, "texTransparentUniform", texTransparentPipeline, 1, pngViews[Math.round(Math.random() * (pngViews.length - 1))]);

			// /*
			// this.createEntities(1, "shapeUniform", shapePipeline, 2);
			// this.createEntities(1, "shapeBrnUniform", shapeBrnPipeline, 2, null, true);

			let texViews: GPUTextureView[] = [];
			for (let i = 0; i < this.mJpgTexList.length; ++i) {
				const tex = this.mJpgTexList[i];
				const texView = tex ? tex.createView() : null;
				if (texView) {
					texView.label = "jpg(view)" + tex.label;
					texViews.push(texView);
				}
			}
			// this.createEntities(2, "texUniform", texPipeline, 2, texViews[Math.round(Math.random() * (texViews.length - 1))]);

			// for (let i = 0; i < 1; ++i) {
			// 	this.createEntities(1, "texBrnUniform", texBrnPipeline, 2, texViews[Math.round(Math.random() * (texViews.length - 1))], true);
			// }
			// for (let i = 0; i < 1; ++i) {
			// 	this.createEntities(1, "texUniform", texPipeline, 1, texViews[Math.round(Math.random() * (texViews.length - 1))]);
			// }
			// this.createEntities(1, "shapeUniform", shapePipeline, 2);

			// this.createEntities(1, "texTransparentUniform", texTransparentPipeline, 2, pngViews[Math.round(Math.random() * (pngViews.length - 1))]);
			//*/

			console.log("runitsTotal: ", this.runits.length);
			this.mEnabled = true;
		});
	}
	private createRenderPipeline(
		instanceCount = 0,
		texEnabled = false,
		brnEnabled: boolean = false,
		transparent = false,
		depthWriteEnabled = false
	): WGRPipelineContext {
		let fragCodeSrc = this.getFragShdCode(texEnabled, brnEnabled);
		const pipeParams = new WGRPipelineCtxParams({
			vertShaderSrc: { code: instanceCount < 2 ? basicVertWGSL : InstancedVertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragCodeSrc.code, uuid: fragCodeSrc.uuid },
			depthStencilEnabled: true
		});
		pipeParams.buildDeferred = false;
		if (transparent) {
			pipeParams.setTransparentBlendParam(0);
		}
		pipeParams.setDepthWriteEnabled(depthWriteEnabled);

		const rgd = this.mGeomDatas[0];
		console.log("rgd.vtxDescParam: ", rgd.vtxDescParam);
		const pipelineCtx = this.renderer.getRPBlockAt(0).createRenderPipeline(pipeParams, rgd.vtxDescParam);
		return pipelineCtx;
	}
	private createEntities(
		instanceCount: number,
		uniformLayoutName: string,
		pipelineCtx: WGRPipelineContext,
		total: number,
		texView?: GPUTextureView,
		brnEnabled = false
	): void {
		const matrixSize = 4 * 16;
		const rblock = this.renderer.getRPBlockAt(0);

		const rgd = this.mGeomDatas[0];

		let insTotal = instanceCount;
		for (let j = 0; j < total; ++j) {
			const rgeom = rgd.rgeom.clone();
			rgeom.instanceCount = insTotal;
			const uniformCtx = pipelineCtx.uniform;

			let runit = rblock.createRUnit(rgeom);
			runit.pipeline = pipelineCtx.pipeline;
			let ruvalue = new WGRUniformValue(new Float32Array(16), 0);
			ruvalue.arrayStride = matrixSize * insTotal;

			let uniformParams: WGRUniformParam[] = [];
			let layoutName = uniformLayoutName;
			let groupIndex = 0;

			let uvalues: WGRUniformValue[] = [];
			let utexes = [{ texView: texView }];

			uvalues.push(ruvalue);
			let insUValues: WGRUniformValue[] = [];
			if(j == 0 && total == 2) {
				runit.enabled = false;
			}
			for (let i = 0; i < insTotal; ++i) {
				const unit = new WRORUnit();

				const k = this.runits.length;
				unit.trans.scaleFactor = 1.0;
				unit.trans.posV.setXYZ(-300 + i * 20 + this.mPosV.x, -300 + j * 20 + this.mPosV.y, this.mPosV.z);
				unit.trans.scaleAndRotBoo = false;

				// unit.trans.posV.scaleBy(0.5);
				unit.trans.intialize(this.camera);

				unit.trans.scaleV.setXYZ(0.02,0.02,0.02);
				unit.trans.trans.setScaleV3(unit.trans.scaleV);

				const pruv = ruvalue.clone(unit.trans.transData);
				pruv.index = i;
				pruv.uid = 1000 + i;
				unit.trans.uniformValue = pruv;
				pruv.byteOffset = matrixSize * i;
				insUValues.push(pruv);

				unit.trans.run(this.camera);
				unit.trans.running = false;

				this.runits.push(unit);
			}

			// runit.setUniformValues(uvalues);
			runit.setUniformValues(insUValues);

			uniformParams.push({
				layoutName,
				groupIndex,
				values: uvalues,
				texParams: utexes
			});
			let runiforms = uniformCtx.createUniformsWithValues(uniformParams);

			// rblock.runBegin();
			let subruniforms: WGRUniform[] = runiforms[0].cloneMany(insTotal);
			// for (let i = 0; i < insTotal; ++i) {
			// 	let subruniform = runiforms[0].clone();
			// }
			// console.log("subruniform: ", subruniform);
			// runit.uniforms = runiforms;
			runit.uniforms = subruniforms;
		}
		// if (total == 1) {
		// 	this.runits[0].trans.scaleFactor = 1.0;
		// 	this.runits[0].trans.posV.setXYZ(-200, -250, 0);
		// }
	}
	private createRenderGeometry(): void {
		this.mGeomDatas.push(this.geomData.createPlaneRData(-150, -150, 300, 300, 0));
		let minV = new Vector3D(-50, -50, -50);
		let maxV = minV.clone().scaleBy(-1);
		this.mGeomDatas.push(this.geomData.createBoxRData(minV, maxV));
		this.mGeomDatas.push(this.geomData.createSphereRData(60.0));
		console.log("this.mGeomDatas: ", this.mGeomDatas);
		for (let i = 0; i < this.mGeomDatas.length; ++i) {
			const rgd = this.mGeomDatas[i];
			let rgeom = new WGRGeometry();
			rgeom.ibuf = rgd.ibuf;
			rgeom.vbufs = rgd.vbufs;
			rgeom.indexCount = rgd.ibuf.elementCount;
			rgd.rgeom = rgeom;
		}
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
					// console.log("sdfs");
					units[i].trans.run(this.camera);
					units[i].trans.uniformValue.upate();
				}
			}
			// console.log("loss time: ", Date.now() - time);
		}
	}
	private buildTextures(urls: string[], callback: (texs: GPUTexture[]) => void, mipmap: boolean = true): void {
		if (urls && urls.length > 0) {
			let texs: GPUTexture[] = [];
			let total = urls.length;
			for (let i = 0; i < urls.length; ++i) {
				this.texCtx.createMaterialTexture(mipmap, urls[i], true).then((tex: GPUTexture) => {
					if (tex.url.indexOf(".png") > 0) {
						this.mPngTexList.push(tex);
					} else {
						this.mJpgTexList.push(tex);
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
			this.texCtx.createMaterialTexture(true).then((tex: GPUTexture) => {
				if (callback) {
					callback([tex]);
				}
			});
		}
	}
	private getFragShdCode(texEnabled = false, brnEnabled: boolean = false): { code: string; uuid: string } {
		const shapeCode = brnEnabled ? vertexPositionColorBrnWGSL : vertexPositionColorWGSL;
		const texCode = brnEnabled ? sampleTextureMixColorBrnWGSL : sampleTextureMixColorWGSL;
		let code = texEnabled ? texCode : shapeCode;
		let uuid = "fragShd" + (brnEnabled ? "Brn" : "");
		uuid += brnEnabled ? "Tex" : "";
		return { code: code, uuid: uuid };
	}
}
export { DrawInsScene };
