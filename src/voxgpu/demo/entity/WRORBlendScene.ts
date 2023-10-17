import { GPUTexture } from "../../gpu/GPUTexture";
import { WROPipelineContext } from "../pipeline/WROPipelineContext";
import { WRORUnit } from "./WRORUnit";

import { GeomRDataType, GeomDataBase } from "../geometry/GeomDataBase";
import CameraBase from "../../../vox/view/CameraBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { RPipelineParams } from "../pipeline/RPipelineParams";

// import basicVertWGSL from "../shaders/basic.vert.wgsl";
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

class WRORBlendScene {
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
	camera: CameraBase | null = null;

	msaaRenderEnabled = true;
	mEnabled = false;

	constructor() {}

	private initCamera(width: number, height: number): void {
		if (this.camera == null) {
			this.camera = new CameraBase();
		}
		const cam = this.camera;
		cam.inversePerspectiveZ = true;

		let perspective = true;

		const camPosition = new Vector3D(0.0, 0.0, 1000.0);
		const camLookAtPos = new Vector3D(0.0, 0.0, 0.0);
		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		if(perspective) {
			cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		}else {
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

		let shapePipeline = this.createRenderPipeline();
		// let shapeBrnPipeline = this.createRenderPipeline(false, true);
		let texPipeline = this.createRenderPipeline(true, false);
		let texTransparentPipeline = this.createRenderPipeline(true, false, true, true);
		// let texBrnPipeline = this.createRenderPipeline(true, true);

		let urls: string[] = [
			"static/assets/box.jpg",
			"static/assets/default.jpg",
			"static/assets/decorativePattern_01.jpg",
			"static/assets/letterA.png",
			"static/assets/xulie_08_61.png",
			"static/assets/blueTransparent.png",
		];

		this.buildTextures(urls, (texs: GPUTexture[]): void => {

			this.createEntities("shapeUniform", shapePipeline, 1);

			console.log("this.mPngTexList: ", this.mPngTexList);
			console.log("this.mJpgTexList: ", this.mJpgTexList);

			// let pngTexView = this.mPngTexList[0].createView();

			
			let pngViews: GPUTextureView[] = [];
			for (let i = 0; i < this.mPngTexList.length; ++i) {
				const tex = this.mPngTexList[i];
				const texView = tex ? tex.createView() : null;
				if (texView) {
					texView.label = "png(view)" + tex.label;
					pngViews.push(texView);
				}
			}

			this.createEntities("texTransparentUniform", texTransparentPipeline, 1, pngViews[Math.round(Math.random() * (pngViews.length - 1))]);

			// /*
			// this.createEntities("shapeUniform", shapePipeline, 2);
			// this.createEntities("shapeBrnUniform", shapeBrnPipeline, 2, null, true);

			let texViews: GPUTextureView[] = [];
			for (let i = 0; i < this.mJpgTexList.length; ++i) {
				const tex = this.mJpgTexList[i];
				const texView = tex ? tex.createView() : null;
				if (texView) {
					texView.label = "jpg(view)" + tex.label;
					texViews.push(texView);
				}
			}

			// for (let i = 0; i < 1; ++i) {
			// 	this.createEntities("texBrnUniform", texBrnPipeline, 2, texViews[Math.round(Math.random() * (texViews.length - 1))], true);
			// }
			for (let i = 0; i < 1; ++i) {
				this.createEntities("texUniform", texPipeline, 1, texViews[Math.round(Math.random() * (texViews.length - 1))]);
			}
			// this.createEntities("shapeUniform", shapePipeline, 2);
			
			this.createEntities("texTransparentUniform", texTransparentPipeline, 2, pngViews[Math.round(Math.random() * (pngViews.length - 1))]);
			//*/

			console.log("runitsTotal: ", this.runits.length);
			this.mEnabled = true;
		});
	}
	private createRenderPipeline(
		texEnabled = false,
		brnEnabled: boolean = false,
		transparent = false,
		depthWriteEnabled = false
	): WROPipelineContext {
		let fragCodeSrc = this.getFragShdCode(texEnabled, brnEnabled);
		const pipeParams = new RPipelineParams({
			vertShaderSrc: { code: basicVertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragCodeSrc.code, uuid: fragCodeSrc.uuid },
			depthStencilEnabled: true,
			fragmentEnabled: true,
		});
		if (transparent) {
			pipeParams.setTransparentBlendParam(0);
		}
		pipeParams.setDepthWriteEnabled(depthWriteEnabled);

		const rgd = this.mGeomDatas[0];
		console.log("rgd.vtxDescParam: ", rgd.vtxDescParam);
		const pipelineCtx = this.renderer.getRPBlockAt(0).createRenderPipeline(pipeParams, rgd.vtxDescParam);
		return pipelineCtx;
	}
	private createRenderGeometry(): void {
		this.mGeomDatas.push( this.geomData.createPlaneRData(-150, -150, 300, 300, 0) );
		console.log("this.this.mGeomDatas: ", this.mGeomDatas);
		for(let i = 0; i < this.mGeomDatas.length; ++i) {
			const rgd = this.mGeomDatas[i];
			let rgeom = new WGRGeometry();
			rgeom.ibuf = rgd.ibuf;
			rgeom.vbufs = rgd.vbufs;
			rgeom.indexCount = rgd.ibuf.elementCount;
			rgd.rgeom = rgeom;
		}
	}
	private createEntities(
		uniformLayoutName: string,
		pipelineCtx: WROPipelineContext,
		total: number,
		texView?: GPUTextureView,
		brnEnabled = false
	): void {
		const matrixSize = 4 * 16;
		const uniformUsage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
		const rblock = this.renderer.getRPBlockAt(0);

		const rgd = this.mGeomDatas[0];

		const rgeom =  rgd.rgeom;
		for (let i = 0; i < total; ++i) {
			const unit = new WRORUnit();
			const k = this.runits.length;
			unit.trans.scaleFactor = 1.0;
			// unit.trans.upateTimes = 1;
			unit.trans.posV.setXYZ(-100 + k * 80, -100 + k * 80, 0.1 * k);
			// unit.trans.posV.setXYZ(0, 0, 0);
			unit.trans.scaleAndRotBoo = false;
			unit.trans.intialize(this.camera);

			unit.trans.run(this.camera);
			unit.trans.running = false;

			unit.trans.uniformValue = new WGRUniformValue(unit.trans.transData, 0);
			unit.runit = rblock.createRUnit( rgeom );
			const ru = unit.runit;
			ru.pipeline = pipelineCtx.pipeline;

			if (brnEnabled) {
				// unit.brnUValue = new WGRUniformValue(new Float32Array([Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5, 1]), 1);
				unit.brnUValue = new WGRUniformValue(new Float32Array([1, 1, 1, 1]), 1);
				ru.setUniformValues([unit.trans.uniformValue, unit.brnUValue]);
				ru.uniforms = [
					pipelineCtx.uniform.createUniform(
						uniformLayoutName,
						0,
						[
							{ size: matrixSize, usage: uniformUsage },
							{ size: unit.brnUValue.data.byteLength, usage: uniformUsage }
						],
						[{ texView: texView }]
					)
				];
			} else {
				ru.setUniformValues([unit.trans.uniformValue]);
				ru.uniforms = [
					pipelineCtx.uniform.createUniform(uniformLayoutName, 0, [{ size: matrixSize, usage: uniformUsage }], [{ texView: texView }])
				];
			}
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
export { WRORBlendScene };
