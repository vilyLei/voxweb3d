import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGMaterial } from "../../material/WGMaterial";
import { WGGeometry } from "../../geometry/WGGeometry";
import { Entity3D } from "../../entity/Entity3D";
import { WGRenderer } from "../../rscene/WGRenderer";

import vertWGSL from '../shaders/colorTriangle.vert.wgsl';
import fragWGSL from '../shaders/colorTriangle.frag.wgsl';

// Position Vertex Buffer Data
const positions = new Float32Array([
     1.0,	-1.0,	0.0,
    -1.0,	-1.0,	0.0,
     0.0,	 1.0,	0.0
]);
// Color Vertex Buffer Data
const colors = new Float32Array([
    1.0,0.0,0.0,
    0.0,1.0,0.0,
    0.0,0.0,1.0
]);

// Index Buffer Data
const indices = new Uint16Array([0, 1, 2]);
class TriangleScene {
	renderer = new WGRenderer();
	constructor() { }

	initialize(wgCtx: WebGPUContext): void {

		this.renderer.initialize(wgCtx);
		this.createEntity([this.createMaterial()]);
	}
	private createMaterial(): WGMaterial {

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		let pipelineDefParam = {
			faceCullMode: "front"
		};
		const material = new WGMaterial({
			shadinguuid: "shapeMaterial",
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});
		return material;
	}
	private createEntity(materials: WGMaterial[]): void {

		const renderer = this.renderer;

		const geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position",		data: positions,	strides: [3] });
		geometry.addAttribute({ shdVarName: "color",		data: colors,		strides: [3] });
		geometry.setIndexBuffer({ name: "geomIndex",		data: indices					 });

		const entity = new Entity3D(false);
		entity.materials = materials;
		entity.geometry = geometry;
		entity.applyCamera(this.renderer.camera);

		renderer.addEntity(entity);
	}
}
export { TriangleScene };
