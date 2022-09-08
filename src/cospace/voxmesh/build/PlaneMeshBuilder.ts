import IDataMesh from "../../../vox/mesh/IDataMesh";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import IColor4 from "../../../vox/material/IColor4";
import { IPlaneMeshBuilder } from "./IPlaneMeshBuilder";
import { MeshBuilder } from "./MeshBuilder";
// import ITransformEntity from "../../../vox/entity/ITransformEntity";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class PlaneGeometry {
	constructor() {}

	color0 = CoRScene.createColor4();
	color1 = CoRScene.createColor4();
	color2 = CoRScene.createColor4();
	color3 = CoRScene.createColor4();

	offsetU: number = 0.0;
	offsetV: number = 0.0;
	uScale: number = 1.0;
	vScale: number = 1.0;

	flipVerticalUV: boolean = false;

	// vtxColorEnabled = false;

	/**
	 * axisFlag = 0 is XOY plane,
	 * axisFlag = 1 is XOZ plane,
	 * axisFlag = 2 is YOZ plane
	 */
	axisFlag: number = 0;

	vtxTotal = 4;
	trisNumber = 2;
	vtCount = 6;

	private m_ivs: Uint16Array = null;
	private m_vs: Float32Array = null;
	private m_uvs: Float32Array = null;
	private m_nvs: Float32Array = null;
	private m_cvs: Float32Array = null;
	getIVS(): Uint16Array | Uint32Array {
		return this.m_ivs;
	}
	getVS(): Float32Array {
		return this.m_vs;
	}
	getUVS(): Float32Array {
		return this.m_uvs;
	}
	setUVS(uvsLen8: Float32Array): void {
		if (uvsLen8 != null && uvsLen8.length == 8) {
			if (this.m_uvs == null) {
				this.m_uvs = uvsLen8.slice(0);
			} else {
				this.m_uvs.set(uvsLen8);
			}
		}
	}

	getNVS(): Float32Array {
		return this.m_nvs;
	}

	getCVS(): Float32Array {
		return this.m_cvs;
	}
	initialize(startX: number, startY: number, pwidth: number, pheight: number): void {
		if (this.m_vs != null) {
			return;
		}

		let minX: number = startX;
		let minY: number = startY;
		let maxX: number = startX + pwidth;
		let maxY: number = startY + pheight;
		let pz: number = 0.0;
		//
		// ccw is positive, left-bottom pos(minX,minY) -> right-bottom pos(maxX,minY) -> right-top pos(maxX,maxY)  -> right-top pos(minX,maxY)
		this.m_ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		//this.m_ivs = new Uint32Array([0,1,2,0,2,3]);
		switch (this.axisFlag) {
			case 0:
				// XOY plane
				this.m_vs = new Float32Array([minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz]);
				break;
			case 1:
				// XOZ plane
				this.m_vs = new Float32Array([maxX, pz, minY, minX, pz, minY, minX, pz, maxY, maxX, pz, maxY]);
				break;
			case 2:
				// YOZ plane
				this.m_vs = new Float32Array([pz, minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY]);
				break;
			default:
				break;
		}

		if (this.m_uvs == null) {
			if (this.flipVerticalUV) {
				this.m_uvs = new Float32Array([
					this.offsetU + 0.0 * this.uScale,
					this.offsetV + 1.0 * this.vScale,
					this.offsetU + 1.0 * this.uScale,
					this.offsetV + 1.0 * this.vScale,
					this.offsetU + 1.0 * this.uScale,
					this.offsetV + 0.0 * this.vScale,
					this.offsetU + 0.0 * this.uScale,
					this.offsetV + 0.0 * this.vScale
				]);
			} else {
				this.m_uvs = new Float32Array([
					this.offsetU + 0.0 * this.uScale,
					this.offsetV + 0.0 * this.vScale,
					this.offsetU + 1.0 * this.uScale,
					this.offsetV + 0.0 * this.vScale,
					this.offsetU + 1.0 * this.uScale,
					this.offsetV + 1.0 * this.vScale,
					this.offsetU + 0.0 * this.uScale,
					this.offsetV + 1.0 * this.vScale
				]);
			}
		}

		switch (this.axisFlag) {
			case 0:
				this.m_nvs = new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0]);
				break;
			case 1:
				this.m_nvs = new Float32Array([0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
				break;
			case 2:
				this.m_nvs = new Float32Array([1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0]);
				break;
			default:
				break;
		}
		this.vtxTotal = 4;
		this.trisNumber = 2;
		this.vtCount = 6;
	}
}

class PlaneMeshBuilder extends MeshBuilder implements IPlaneMeshBuilder {

	private m_startX = 0;
	private m_startZ = 0;
	private m_pwidth = 0;
	private m_plong = 0;
	private m_flag = 0;

	uvs: Float32Array = null;

	offsetU: number = 0.0;
	offsetV: number = 0.0;
	uScale: number = 1.0;
	vScale: number = 1.0;
	flipVerticalUV: boolean = false;
	normalEnabled: boolean = false;

	vbWholeDataEnabled: boolean = false;
	wireframe: boolean = false;
	polyhedral = true;


	constructor() { super(); }

	/**
	 * create a rectangle fix screen size plane ,and it parallel the 3d space XOY plane
	 * @param texList textures list, default value is null.
	 */
	createFixScreen(): IRawMesh {
		return this.createXOY(-1.0, -1.0, 2.0, 2.0);
	}
	/**
	 * create a rectangle plane ,and it parallel the 3d space XOY plane
	 * @param minX the min x axis position of the rectangle plane.
	 * @param minZ the min y axis position of the rectangle plane.
	 * @param pwidth the width of the rectangle plane.
	 * @param height the height of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createXOY(minX: number, minY: number, pwidth: number, pheight: number): IRawMesh {
		this.m_startX = minX;
		this.m_startZ = minY;
		this.m_pwidth = pwidth;
		this.m_plong = pheight;
		this.m_flag = 0;
		return this.createPlaneMesh();
	}
	/**
	 * create a square plane ,and it parallel the 3d space XOY plane
	 * @param size the width and height of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createXOYSquare(size: number): IRawMesh {
		this.m_startX = -0.5 * size;
		this.m_startZ = -0.5 * size;
		this.m_pwidth = size;
		this.m_plong = size;
		this.m_flag = 0;
		return this.createPlaneMesh();
	}
	/**
	 * create a rectangle plane ,and it parallel the 3d space XOZ plane
	 * @param minX the min x axis position of the rectangle plane.
	 * @param minZ the min z axis position of the rectangle plane.
	 * @param pwidth the width of the rectangle plane.
	 * @param plong the long of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createXOZ(minX: number, minZ: number, pwidth: number, plong: number): IRawMesh {
		this.m_flag = 1;
		this.m_startX = minX;
		this.m_startZ = minZ;
		this.m_pwidth = pwidth;
		this.m_plong = plong;
		return this.createPlaneMesh();
	}
	/**
	 * create a rectangle plane ,and it parallel the 3d space YOZ plane
	 * @param minX the min x axis position of the rectangle plane.
	 * @param minZ the min z axis position of the rectangle plane.
	 * @param pwidth the width of the rectangle plane.
	 * @param plong the long of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createYOZ(minY: number, minZ: number, pwidth: number, plong: number): IRawMesh {
		this.m_flag = 2;
		this.m_startX = minY;
		this.m_startZ = minZ;
		this.m_pwidth = pwidth;
		this.m_plong = plong;
		return this.createPlaneMesh();
	}
	/**
	 * create a square plane ,and it parallel the 3d space XOZ plane
	 * @param size the width and long of the rectangle plane.
	 * @param texList textures list, default value is null.
	 */
	createXOZSquare(size: number): IRawMesh {
		this.m_flag = 1;
		this.m_startX = -0.5 * size;
		this.m_startZ = -0.5 * size;
		this.m_pwidth = size;
		this.m_plong = size;
		return this.createPlaneMesh();
	}
	private createPlaneMesh(): IRawMesh {
		/*
		let geom = new PlaneGeometry();

		// mesh.color0.copyFrom(this.color0);
		// mesh.color1.copyFrom(this.color1);
		// mesh.color2.copyFrom(this.color2);
		// mesh.color3.copyFrom(this.color3);
		//geom.setPolyhedral( this.m_polyhedral );
		// mesh.setUVS( this.uvs );
		// this.uvs = null;

		geom.uScale = this.uScale;
		geom.vScale = this.vScale;
		geom.offsetU = this.offsetU;
		geom.offsetV = this.offsetV;
		// geom.wireframe = this.wireframe;

		geom.flipVerticalUV = this.flipVerticalUV;
		geom.axisFlag = this.m_flag;
		geom.setUVS(this.uvs);
		geom.initialize(this.m_startX, this.m_startZ, this.m_pwidth, this.m_plong);

		let mesh = CoRScene.createRawMesh();
		mesh.reset();
		mesh.addFloat32Data(geom.getVS(), 3);
		mesh.addFloat32Data(geom.getUVS(), 2);
		mesh.addFloat32Data(geom.getNVS(), 3);
		mesh.setIVS(geom.getIVS());
		mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
		mesh.wireframe = this.wireframe;
		mesh.setPolyhedral(this.polyhedral);
		mesh.initialize();
		mesh.toElementsTriangles();
		return mesh;
		//*/
		return this.createMesh();
	}

	protected setMeshData(mesh: IRawMesh): void {

		let geom = new PlaneGeometry();


		geom.uScale = this.uScale;
		geom.vScale = this.vScale;
		geom.offsetU = this.offsetU;
		geom.offsetV = this.offsetV;
		geom.flipVerticalUV = this.flipVerticalUV;		
		geom.axisFlag = this.m_flag;
		geom.setUVS(this.uvs);
		geom.initialize(this.m_startX, this.m_startZ, this.m_pwidth, this.m_plong);

		mesh.addFloat32Data(geom.getVS(), 3);
		if(mesh.isUVSEnabled()) {
			mesh.addFloat32Data(geom.getUVS(), 2);
		}
		if(mesh.isNVSEnabled()) {
			mesh.addFloat32Data(geom.getNVS(), 3);
		}
		mesh.setIVS(geom.getIVS());
	}
	destroy(): void {
		this.uvs = null;
	}
}
export { PlaneMeshBuilder };
