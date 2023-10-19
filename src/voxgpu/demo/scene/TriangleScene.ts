import { GeomRDataType, GeomDataBase } from "../geometry/GeomDataBase";
import Vector3D from "../../../vox/math/Vector3D";
import { WebGPUContext } from "../../gpu/WebGPUContext";

import vertWGSL from "../shaders/vs3uvs2.vert.wgsl";
import fragWGSL from "../shaders/vertexPositionColor.frag.wgsl";

import { WGMaterial } from "../../material/WGMaterial";
import { WGGeometry } from "../../geometry/WGGeometry";
import { Entity3D } from "../../entity/Entity3D";
import { WGRenderer } from "../../rscene/WGRenderer";

class TriangleScene {

	private mGeomDatas: GeomRDataType[] = [];
	geomData = new GeomDataBase();
	renderer = new WGRenderer();
	constructor() { }

	private initCamera(width: number, height: number): void {

		const cam = this.renderer.camera;
		const camUpDirect = new Vector3D(0.0, 1.0, 0.0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		cam.lookAtRH(new Vector3D(800.0, 800.0, 800.0), new Vector3D(), camUpDirect);
		cam.update();
	}
	initialize(canvas: HTMLCanvasElement, wgCtx: WebGPUContext): void {

		this.initCamera(canvas.width, canvas.height);
		this.geomData.initialize(wgCtx);

		this.renderer.initialize(wgCtx);

		this.createRenderGeometry();

		this.createEntity([this.createMaterial()]);
	}
	private createMaterial(): WGMaterial {

		const rgd = this.mGeomDatas[0];
		const pipelineVtxParam = rgd.vtxDescParam;

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		const material = new WGMaterial({
			shadinguuid: "shapeMaterial",
			shaderCodeSrc: shdSrc,
			pipelineVtxParam
		});
		return material;
	}
	private createEntity(materials: WGMaterial[], geomIndex = -1): void {

		const renderer = this.renderer;
		const gds = this.mGeomDatas;
		geomIndex = geomIndex < 0 ? Math.round(Math.random() * (gds.length - 1)) : geomIndex;
		const rgd = gds[geomIndex];

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
		let minV = new Vector3D(-100, -100, -100);
		let maxV = minV.clone().scaleBy(-1);
		this.mGeomDatas.push(this.geomData.createBoxRData(minV, maxV));
	}
}
export { TriangleScene };
