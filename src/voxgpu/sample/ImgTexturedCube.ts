import { GeomDataBase } from "../demo/geometry/GeomDataBase";
import { TestTexResource } from "../demo/scene/TestTexResource";

import vertWGSL from "../demo/shaders/vs3uvs2.vert.wgsl";
import fragWGSL from "../demo/shaders/sampleTextureMixColor.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData, WGTextureWrapper } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

export class ImgTexturedCube {

	texRes = new TestTexResource();
	geomData = new GeomDataBase();
	renderer = new WGRenderer();

	constructor() {}

	initialize(): void {
		console.log("ImgTexturedCube::initialize() ...");

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/box.jpg")]);
		this.createEntity([material]);
	}

	private createMaterial(
		shdSrc: WGRShderSrcType,
		texDatas?: WGImage2DTextureData[]
	): WGMaterial {

		let pipelineDefParam = {
			faceCullMode: "back"
		};
		const texTotal = texDatas ? texDatas.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});
		if (texTotal > 0) {
			const texWrappers: WGTextureWrapper[] = new Array(texTotal);
			for (let i = 0; i < texTotal; ++i) {
				texWrappers[i] = new WGTextureWrapper({ texture: { data: texDatas[i], shdVarName: "texture" + i } });
			}
			material.textures = texWrappers;
		}
		return material;
	}
	private createEntity(materials: WGMaterial[]): Entity3D {

		const renderer = this.renderer;

		const rgd = this.geomData.createCubeWithSize(200);
		const geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] });
		geometry.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] });
		geometry.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

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
