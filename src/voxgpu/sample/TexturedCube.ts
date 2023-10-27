import { GeomDataBase, GeomRDataType } from "../demo/geometry/GeomDataBase";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { TestTexResource } from "../demo/scene/TestTexResource";

import vertWGSL from "../demo/shaders/vs3uvs2.vert.wgsl";
import fragWGSL from "../demo/shaders/sampleTextureMixColor.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { GPUTexture } from "../gpu/GPUTexture";
import { WGTextureWrapper } from "../texture/WGTextureWrapper";
import { WGRPipelineContextDefParam, WGRShderSrcType } from "../material/WGMaterialDescripter";

export class TexturedCube {
	private mWGCtx = new WebGPUContext();
	texRes = new TestTexResource();
	geomData = new GeomDataBase();
	renderer = new WGRenderer();

	constructor() {}

	initialize(): void {
		console.log("TexturedCube::initialize() ...");

		const canvas = document.createElement("canvas");
		canvas.width = 512;
		canvas.height = 512;
		document.body.appendChild(canvas);

		const ctx = this.mWGCtx;
		ctx.initialize(canvas, { alphaMode: "premultiplied" }).then(() => {
			console.log("webgpu initialization success ... ctx: ", ctx);

			this.texRes.wgCtx = ctx;

			this.texRes.buildDefault2DTextures((texs: GPUTexture[]): void => {
				this.geomData.initialize(ctx);

				this.renderer.initialize({ ctx: ctx });

				let jpgTexs = this.texRes.jpgTexList;
				let pngTexs = this.texRes.pngTexList;

				let baseDefParam = {
					faceCullMode: "back"
				};

				const rgd = this.geomData.createCubeWithSize(200);
				const shdSrc = {
					vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
					fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
				};
				const material = this.createMaterial(rgd, shdSrc, baseDefParam, [jpgTexs[0]]);
				this.createEntity(rgd, [material]);
			});
		});
	}

	private createMaterial(
		rgd: GeomRDataType,
		shdSrc: WGRShderSrcType,
		pipelineDefParam?: WGRPipelineContextDefParam,
		texs?: GPUTexture[]
	): WGMaterial {

		const texTotal = texs ? texs.length : 0;
		const pipelineVtxParam = rgd.vtxDescParam;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineVtxParam,
			pipelineDefParam
		});
		if (texTotal > 0) {
			const texWrappers: WGTextureWrapper[] = new Array(texTotal);
			for (let i = 0; i < texTotal; ++i) {
				texWrappers[i] = new WGTextureWrapper({ texture: { texture: texs[i], shdVarName: "texture" + i } });
			}
			material.textures = texWrappers;
		}
		return material;
	}
	private createEntity(rgd: GeomRDataType, materials: WGMaterial[]): Entity3D {

		const renderer = this.renderer;

		const geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] });
		geometry.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] });
		geometry.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		console.log("materials: ", materials);

		const entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;

		renderer.addEntity(entity);
		return entity;
	}

	run(): void {
		this.renderer.run();
	}
}
