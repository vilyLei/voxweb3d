
import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class BillboardLineMesh {
	private m_vs: Float32Array = null;
	private m_uvs: Float32Array = null;
	private m_ivs: Uint16Array = null;
	flipVerticalUV: boolean = false;
	vtxUVEnabled: boolean = true;
	mesh = CoRScene.createDataMesh();
	constructor() {}

	initialize(pwidth: number, pheight: number): void {
		if (this.m_vs != null) {
			return;
		}
		//console.log("RectPlaneMesh::initialize()...");
		let maxX: number = 0.5 * pwidth;
		let maxY: number = 0.5 * pheight;
		let minX: number = -maxX;
		let minY: number = -maxY;
		this.m_ivs = new Uint16Array([1, 2, 0, 3]);
		this.m_vs = new Float32Array([minX, minY, maxX, minY, maxX, maxY, minX, maxY]);
		if (this.vtxUVEnabled) {
			if (this.m_uvs == null) {
				if (this.flipVerticalUV) {
					this.m_uvs = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
				} else {
					this.m_uvs = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]);
				}
			}
		}
		let mh = this.mesh;
		
		mh.autoBuilding = false;
		mh.vtxTotal = 4;
		mh.trisNumber = 2;
		mh.drawMode = CoRScene.RenderDrawMode.ELEMENTS_TRIANGLE_STRIP;

		mh.bounds = CoRScene.createAABB();
		mh.bounds.min.setXYZ(minX, minY, minX);
		mh.bounds.max.setXYZ(maxX, maxY, maxX);
		mh.bounds.updateFast();

		mh.setVS(this.m_vs, 2);
		mh.setUVS(this.m_uvs);
		mh.setIVS(this.m_ivs);
	}
	destroy(): void {
		this.m_vs = null;
		this.m_uvs = null;
		this.m_ivs = null;
	}
}

export {BillboardLineMesh}
