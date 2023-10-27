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

export class MultiMaterialPass {

	private mEntity: Entity3D;

	geomData = new GeomDataBase();
	renderer = new WGRenderer();
	constructor() {}

	initialize(): void {
		console.log("MultiMaterialPass::initialize() ...");

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		let material0 = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/blueTransparent.png")], ["transparent"], "front");
		let material1 = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/blueTransparent.png")], ["transparent"], "back");
		this.mEntity = this.createEntity([material0, material1]);
	}

	private createMaterial(shdSrc: WGRShderSrcType, texDatas?: WGImage2DTextureData[], blendModes: string[] = [], faceCullMode = "back"): WGMaterial {
		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode: faceCullMode,
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
	private createEntity(materials: WGMaterial[], pv?: Vector3D): Entity3D {
		const renderer = this.renderer;
		const rgd = this.geomData.createSphereRData(150, 30, 30);
		const geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] });
		geometry.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] });
		geometry.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		const entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition(pv ? pv : new Vector3D());

		renderer.addEntity(entity);
		return entity;
	}
	private mRotY = 0.0;
	run(): void {

		this.mEntity.transform.setRotationXYZ(0, this.mRotY, this.mRotY + 0.5);
		this.mEntity.update();
		this.mRotY += 0.5;
		this.renderer.run();
	}
}
