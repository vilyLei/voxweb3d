import { GeomDataBase } from "../demo/geometry/GeomDataBase";

import vertWGSL from "../demo/shaders/vs3uvs2.vert.wgsl";
import fragWGSL from "../demo/shaders/sampleTextureMixColor.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData, WGTextureWrapper } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import Vector3D from "../../vox/math/Vector3D";

export class BlendTest {

	geomData = new GeomDataBase();
	renderer = new WGRenderer();

	constructor() {}

	initialize(): void {
		console.log("BlendTest::initialize() ...");

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		let material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/box.jpg")]);
		this.createEntity([material], new Vector3D(0, 0, -50));
		material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/default.jpg")], ["add"]);
		this.createEntity([material], new Vector3D(0, 0, 0));
		material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/xulie_08_61.png")], ["alpha_add"]);
		this.createEntity([material], new Vector3D(0, 0, 50));
		material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/blueTransparent.png")], ["add"]);
		this.createEntity([material], new Vector3D(0, 0, 100));
	}

	private createMaterial(
		shdSrc: WGRShderSrcType,
		texDatas?: WGImage2DTextureData[],
		blendModes: string[] = []
	): WGMaterial {

		let pipelineDefParam = {
			faceCullMode: "back",
			blendModes: [] as string[]
		};
		pipelineDefParam.blendModes = blendModes;
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
	private createEntity(materials: WGMaterial[], pv: Vector3D): Entity3D {

		const renderer = this.renderer;

		const rgd = this.geomData.createPlaneRData(-300, -300, 600, 600, 0);
		const geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] });
		geometry.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] });
		geometry.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		const entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition(pv);

		renderer.addEntity(entity);
		return entity;
	}

	run(): void {
		this.renderer.run();
	}
}
