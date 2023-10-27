import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";

import vertWGSL from "../demo/shaders/colorTriangle.vert.wgsl";
import fragWGSL from "../demo/shaders/colorTriangle.frag.wgsl";

const positions = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0]);
const colors = new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);

export class VertColorTriangle {

	renderer = new WGRenderer();

	constructor() {}

	initialize(): void {
		console.log("VertColorTriangle::initialize() ...");
		this.createEntity();
	}
	private createEntity(): void {
		const renderer = this.renderer;

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const material = new WGMaterial({
			shadinguuid: "shapeMaterial",
			shaderCodeSrc: shdSrc
		});

		const geometry = new WGGeometry();
		geometry.addAttributes([
			{ shdVarName: "position", data: positions, strides: [3] },
			{ shdVarName: "color", data: colors, strides: [3] }
		]);

		const entity = new Entity3D(false);
		entity.materials = [ material ];
		entity.geometry = geometry;
		entity.applyCamera(this.renderer.camera);

		renderer.addEntity(entity);
	}
	run(): void {
		this.renderer.run();
	}
}
