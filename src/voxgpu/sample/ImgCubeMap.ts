import { GeomDataBase } from "../demo/geometry/GeomDataBase";

import vertWGSL from "../demo/shaders/vs3.vert.wgsl";
import fragWGSL from "../demo/shaders/cubemap.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImageCubeTextureData, WGImage2DTextureData, WGImageTextureData, WGTextureWrapper } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

export class ImgCubeMap {

	geomData = new GeomDataBase();
	renderer = new WGRenderer();

	constructor() {}

	initialize(): void {

		console.log("ImgCubeMap::initialize() ...");

		// let urls = [
        //     "static/assets/hw_morning/morning_ft.jpg",
        //     "static/assets/hw_morning/morning_bk.jpg",
        //     "static/assets/hw_morning/morning_dn.jpg",
        //     "static/assets/hw_morning/morning_up.jpg",
        //     "static/assets/hw_morning/morning_rt.jpg",
        //     "static/assets/hw_morning/morning_lf.jpg"
        // ];

		let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];

		let td01 = new WGImage2DTextureData("static/assets/box.jpg");
		let td02 = new WGImageCubeTextureData(urls);

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const material = this.createMaterial(shdSrc, [td02]);
		this.createEntity([material]);
	}

	private createMaterial(
		shdSrc: WGRShderSrcType,
		texDataList?: WGImageTextureData[]
	): WGMaterial {

		let pipelineDefParam = {
			faceCullMode: "back"
		};
		const texTotal = texDataList ? texDataList.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});
		if (texTotal > 0) {
			const texWrappers: WGTextureWrapper[] = new Array(texTotal);
			for (let i = 0; i < texTotal; ++i) {
				texWrappers[i] = new WGTextureWrapper({ texture: { data: texDataList[i], shdVarName: "texture" + i } });
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
