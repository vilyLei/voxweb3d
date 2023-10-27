import { GeomDataBase } from "../demo/geometry/GeomDataBase";

import vertWGSL from "../demo/shaders/vertToColor.vert.wgsl";
import fragWGSL from "../demo/shaders/vertexPositionColor.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";

export class VertColorCube {

	geomData = new GeomDataBase();
	renderer = new WGRenderer();

	constructor() {}

	initialize(): void {
		console.log("VertColorCube::initialize() ...");

		const renderer = this.renderer;
		const rgd = this.geomData.createCubeWithSize(200);

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		const material = new WGMaterial({
			shadinguuid: "shapeMaterial",
			shaderCodeSrc: shdSrc
		});

		const geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] });
		geometry.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		const entity = new Entity3D();
		entity.materials = [material];
		entity.geometry = geometry;
		renderer.addEntity(entity);
	}

	run(): void {
		this.renderer.run();
	}
}
