import { GPUTexture } from "../../gpu/GPUTexture";
import { WGRPipelineContext } from "../../render/pipeline/WGRPipelineContext";
import { WRORUnit } from "./WRORUnit";

import { GeomRDataType, GeomDataBase } from "../geometry/GeomDataBase";
import CameraBase from "../../../vox/view/CameraBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRPipelineCtxParams } from "../../render/pipeline/WGRPipelineCtxParams";

import basicVertWGSL from "../shaders/vs3uvs2.vert.wgsl";
import sampleTextureMixColorWGSL from "../shaders/sampleTextureMixColor.frag.wgsl";
import sampleTextureMixColorBrnWGSL from "../shaders/sampleTextureMixColorBrn.frag.wgsl";
import vertexPositionColorWGSL from "../shaders/vertexPositionColor.frag.wgsl";
import vertexPositionColorBrnWGSL from "../shaders/vertexPositionColorBrn.frag.wgsl";

import { WROBufferContext } from "../pipeline/WROBufferContext";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WGRUniformValue } from "../../render/uniform/WGRUniformValue";
import { WGRenderer } from "../../rscene/WGRenderer";
import { WGRGeometry } from "../../render/WGRGeometry";

class WRORPrimitiveScene {
	private mGeomDatas: GeomRDataType[] = [];
	private runits: WRORUnit[] = [];
	readonly geomData = new GeomDataBase();

	wgCtx: WebGPUContext | null = null;

	renderer = new WGRenderer();
	enabled = true;
	camera: CameraBase | null = null;

	msaaRenderEnabled = true;
	mEnabled = false;

	constructor() { }

	private initCamera(width: number, height: number): void {
		if (this.camera == null) {
			this.camera = new CameraBase();
		}
		const cam = this.camera;

		const camPosition = new Vector3D(1000.0, 1000.0, 1000.0);
		const camLookAtPos = new Vector3D(0.0, 0.0, 0.0);
		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
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
		this.renderer.createRenderBlock({ sampleCount: sampleCount, multisampleEnabled: this.msaaRenderEnabled });

		this.createRenderGeometry();

		let shapePipeline = this.createRenderPipeline(sampleCount);
		let shapeBrnPipeline = this.createRenderPipeline(sampleCount, false, true);
		let texPipeline = this.createRenderPipeline(sampleCount, true);
		let texBrnPipeline = this.createRenderPipeline(sampleCount, true, true);

		let urls: string[] = ["static/assets/box.jpg", "static/assets/default.jpg", "static/assets/decorativePattern_01.jpg"];

		this.buildTextures(urls, (texs: GPUTexture[]): void => {
			this.createEntities("shapeUniform", shapePipeline, 2);

			///*
			this.createEntities("shapeUniform", shapePipeline, 3);
			this.createEntities("shapeBrnUniform", shapeBrnPipeline, 3, null, true);

			let texViews: GPUTextureView[] = [];
			for (let i = 0; i < texs.length; ++i) {
				const tex = texs[i];
				const texView = tex ? tex.createView() : null;
				if (texView) {
					texView.label = "(view)" + tex.label;
					texViews.push(texView);
				}
			}

			for (let i = 0; i < 1; ++i) {
				this.createEntities("texBrnUniform", texBrnPipeline, 3, texViews[Math.round(Math.random() * (texViews.length - 1))], true);
			}
			for (let i = 0; i < 1; ++i) {
				this.createEntities("texUniform", texPipeline, 3, texViews[Math.round(Math.random() * (texViews.length - 1))]);
			}
			this.createEntities("shapeUniform", shapePipeline, 2);
			//*/

			console.log("runitsTotal: ", this.runits.length);
			this.mEnabled = true;
		});
	}
	private buildTextures(urls: string[], callback: (texs: GPUTexture[]) => void, mipmap: boolean = true): void {
		if (urls && urls.length > 0) {
			let texs: GPUTexture[] = [];
			let total = urls.length;
			for (let i = 0; i < urls.length; ++i) {
				this.wgCtx.texture.createTexByUrl(urls[i], mipmap).then((tex: GPUTexture) => {
					tex.label = urls[i];
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
			this.wgCtx.texture.createTexByUrl("static/assets/box.jpg", true).then((tex: GPUTexture) => {
				if (callback) {
					callback([tex]);
				}
			});
		}
	}
	private getFragShdCode(texEnabled = false, brnEnabled: boolean = false): string {
		const shapeCode = brnEnabled ? vertexPositionColorBrnWGSL : vertexPositionColorWGSL;
		const texCode = brnEnabled ? sampleTextureMixColorBrnWGSL : sampleTextureMixColorWGSL;
		let code = texEnabled ? texCode : shapeCode;
		return code;
	}
	private createRenderPipeline(sampleCount: number, texEnabled = false, brnEnabled: boolean = false): WGRPipelineContext {
		const pipeParams = new WGRPipelineCtxParams({
			sampleCount: sampleCount,
			multisampleEnabled: this.msaaRenderEnabled,
			vertShaderSrc: { code: basicVertWGSL },
			fragShaderSrc: { code: this.getFragShdCode(texEnabled, brnEnabled) },
			depthStencilEnabled: true,
			fragmentEnabled: true
		});
		pipeParams.buildDeferred = false;
		const rgd = this.mGeomDatas[0];
		const pipelineCtx = this.renderer.getRPBlockAt(0).createRenderPipeline(pipeParams, rgd.vtxDescParam);
		return pipelineCtx;
	}
	private createRenderGeometry(): void {

		let minV = new Vector3D(-50, -50, -50);
		let maxV = minV.clone().scaleBy(-1);
		this.mGeomDatas.push(this.geomData.createBoxRData(minV, maxV));
		this.mGeomDatas.push(this.geomData.createSphereRData(60.0));
		this.mGeomDatas.push(this.geomData.createCylinderRData(60.0));
		this.mGeomDatas.push(this.geomData.createTorusRData(60.0));
		this.mGeomDatas.push(this.geomData.createTorusRData(120.0, 50));
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
	private createEntities(
		uniformLayoutName: string,
		pipelineCtx: WGRPipelineContext,
		total: number,
		texView?: GPUTextureView,
		brnEnabled = false
	): void {
		const matrixSize = 4 * 16;
		const uniformUsage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
		const rblock = this.renderer.getRPBlockAt(0);

		// const rgd = this.mGeomDatas[0];
		let rgeom = this.mGeomDatas[0].rgeom;

		// const runit = rblock.createRUnit(null, { indexBuffer: rgd.ibuf, vertexBuffers: rgd.vbufs, indexCount: rgd.ibuf.elementCount });
		for (let i = 0; i < total; ++i) {
			const unit = new WRORUnit();
			unit.trans.scaleFactor *= 1.5;
			// unit.trans.upateTimes = 1;
			unit.trans.intialize(this.camera);
			unit.trans.uniformValue = new WGRUniformValue(unit.trans.transData, 0);
			rgeom = this.mGeomDatas[Math.round(Math.random() * (this.mGeomDatas.length - 1))].rgeom;
			unit.runit = rblock.createRUnit(rgeom);
			const ru = unit.runit;
			ru.pipeline = pipelineCtx.pipeline;

			if (brnEnabled) {
				unit.brnUValue = new WGRUniformValue(new Float32Array([Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5, 1]), 1);
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
		if (total == 1) {
			this.runits[0].trans.scaleFactor = 1.0;
			this.runits[0].trans.posV.setXYZ(0, 0, 0);
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
					units[i].trans.run(this.camera);
				}
			}
			// console.log("loss time: ", Date.now() - time);
		}
	}
}
export { WRORPrimitiveScene };
