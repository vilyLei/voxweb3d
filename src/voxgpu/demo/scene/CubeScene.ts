import { GeomRDataType, GeomDataBase } from "../geometry/GeomDataBase";
import { WebGPUContext } from "../../gpu/WebGPUContext";

import vertWGSL from "../shaders/vs3uvs2.vert.wgsl";
import fragWGSL from "../shaders/vertexPositionColor.frag.wgsl";

import { WGMaterial } from "../../material/WGMaterial";
import { WGGeometry } from "../../geometry/WGGeometry";
import { Entity3D } from "../../entity/Entity3D";
import { WGRenderer } from "../../rscene/WGRenderer";

class CubeScene {

	private mGeomDatas: GeomRDataType[] = [];
	geomData = new GeomDataBase();
	renderer = new WGRenderer();

	enabled = false;
	constructor() { }

	initialize(wgCtx: WebGPUContext): void {

		this.geomData.initialize(wgCtx);

		this.renderer.initialize({ ctx: wgCtx });

		this.createRenderGeometry();

		this.createEntity([this.createMaterial()]);

		this.enabled = true;
	}
	private createMaterial(): WGMaterial {

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		let material = new WGMaterial({
			shadinguuid: "shapeMaterial",
			shaderCodeSrc: shdSrc
		});
		return material;
	}
	private createEntity(materials: WGMaterial[]): void {

		const renderer = this.renderer;
		const gds = this.mGeomDatas;
		const rgd = gds[0];

		let geometry = new WGGeometry();
		geometry.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] });
		geometry.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] });
		geometry.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		let entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.applyCamera(this.renderer.camera);

		renderer.addEntity(entity);
	}

	private createRenderGeometry(): void {
		this.mGeomDatas.push(this.geomData.createCubeWithSize(200));
	}
	update(): void {
	}
}
export { CubeScene };
