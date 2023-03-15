import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import AABB from "../../vox/geom/AABB";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";
import SpherePOV from "./SpherePOV";
import DebugFlag from "../../vox/debug/DebugFlag";

class QuadPOV implements ISpacePOV {
	constructor() {}
	private m_sphOcc = new SpherePOV();
	private m_subPovs: ISpacePOV[] = null;
	private m_subPovsTotal = 0;
	private m_pvList: Vector3D[] = [null, null, null, null];
	private m_pnvList: Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D()];
	private m_pdisList: number[] = [0.0, 0.0, 0.0, 0.0];
	private m_pdvList: Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D()];
	private m_centerv = new Vector3D();
	private m_pv = new Vector3D();
	private m_camPv = new Vector3D();
	private m_planeNV = new Vector3D();
	private m_planeDis = 0.0;

	public enabled = true;
	public status = 0;
	setCamPosition(pv: Vector3D): void {
		this.m_camPv.copyFrom(pv);
		this.m_sphOcc.setCamPosition(pv);
	}
	private calcPlane(): void {
		let nv: Vector3D = null;
		//
		this.m_pv.copyFrom(this.m_camPv);
		this.m_pv.subtractBy(this.m_centerv);
		nv = this.m_planeNV;
		Vector3D.CrossSubtract(this.m_pvList[0], this.m_pvList[1], this.m_pvList[0], this.m_pvList[3], nv);
		this.m_pv.normalize();
		this.m_pv.w = nv.dot(this.m_pv);
		if (this.m_pv.w < 0.0) nv.scaleBy(-1.0);
		nv.normalize();
		this.m_planeDis = nv.dot(this.m_pvList[0]);
		nv.w = Math.abs(this.m_pv.w);

		nv = this.m_pnvList[0];
		Vector3D.CrossSubtract(this.m_camPv, this.m_pvList[0], this.m_camPv, this.m_pvList[1], nv);
		if (nv.dot(this.m_pdvList[0]) > 0.0) nv.scaleBy(-1.0);
		nv.normalize();
		this.m_pdisList[0] = nv.dot(this.m_pvList[0]);

		nv = this.m_pnvList[1];
		Vector3D.CrossSubtract(this.m_camPv, this.m_pvList[1], this.m_camPv, this.m_pvList[2], nv);
		if (nv.dot(this.m_pdvList[1]) > 0.0) nv.scaleBy(-1.0);
		nv.normalize();
		this.m_pdisList[1] = nv.dot(this.m_pvList[1]);

		nv = this.m_pnvList[2];
		Vector3D.CrossSubtract(this.m_camPv, this.m_pvList[2], this.m_camPv, this.m_pvList[3], nv);
		if (nv.dot(this.m_pdvList[2]) > 0.0) nv.scaleBy(-1.0);
		nv.normalize();
		this.m_pdisList[2] = nv.dot(this.m_pvList[2]);

		nv = this.m_pnvList[3];
		Vector3D.CrossSubtract(this.m_camPv, this.m_pvList[3], this.m_camPv, this.m_pvList[0], nv);
		if (nv.dot(this.m_pdvList[3]) > 0.0) nv.scaleBy(-1.0);
		nv.normalize();
		this.m_pdisList[3] = nv.dot(this.m_pvList[3]);
	}
	setParam(va: Vector3D, vb: Vector3D, vc: Vector3D, vd: Vector3D): void {
		this.m_pvList[0] = va;
		this.m_pvList[1] = vb;
		this.m_pvList[2] = vc;
		this.m_pvList[3] = vd;
	}
	updateOccData(): void {
		/*
        this.m_pvList.push(va);
        this.m_pvList.push(vb);
        this.m_pvList.push(vc);
        this.m_pvList.push(vd);

        this.m_pnvList.push( new Vector3D() );
        this.m_pnvList.push( new Vector3D() );
        this.m_pnvList.push( new Vector3D() );
        this.m_pnvList.push( new Vector3D() );
        //
        this.m_pdisList.push(0.0);
        this.m_pdisList.push(0.0);
        this.m_pdisList.push(0.0);
        this.m_pdisList.push(0.0);
        //
        this.m_pdvList.push( new Vector3D() );
        this.m_pdvList.push( new Vector3D() );
        this.m_pdvList.push( new Vector3D() );
        this.m_pdvList.push( new Vector3D() );
        //*/

		this.m_centerv.copyFrom(this.m_pvList[0]);
		this.m_centerv.addBy(this.m_pvList[1]);
		this.m_centerv.addBy(this.m_pvList[2]);
		this.m_centerv.addBy(this.m_pvList[3]);
		this.m_centerv.scaleBy(0.25);

		//this.m_sphOcc.setPosition(this.m_centerv);
		//this.m_pv.copyFrom(va);
		//this.m_pv.subtractBy(this.m_centerv);
		this.m_sphOcc.occRadius = 0.0; //this.m_pv.getLength();
		this.m_sphOcc.setPosition(this.m_centerv);
		let i: number = 0;
		for (; i < 4; ++i) {
			this.m_pv.copyFrom(this.m_pvList[i]);
			this.m_pv.subtractBy(this.m_centerv);
			this.m_pv.w = this.m_pv.getLength();
			if (this.m_pv.w > this.m_sphOcc.occRadius) {
				this.m_sphOcc.occRadius = this.m_pv.w;
			}
		}

		let pv: Vector3D = this.m_pdvList[0];
		pv.copyFrom(this.m_pvList[0]);
		pv.addBy(this.m_pvList[1]);
		pv.scaleBy(0.5);
		pv.subtractBy(this.m_centerv);
		pv = this.m_pdvList[1];
		pv.copyFrom(this.m_pvList[1]);
		pv.addBy(this.m_pvList[2]);
		pv.scaleBy(0.5);
		pv.subtractBy(this.m_centerv);
		pv = this.m_pdvList[2];
		pv.copyFrom(this.m_pvList[2]);
		pv.addBy(this.m_pvList[3]);
		pv.scaleBy(0.5);
		pv.subtractBy(this.m_centerv);
		pv = this.m_pdvList[3];
		pv.copyFrom(this.m_pvList[3]);
		pv.addBy(this.m_pvList[0]);
		pv.scaleBy(0.5);
		pv.subtractBy(this.m_centerv);
	}
	getOccRadius(): number {
		return this.m_sphOcc.occRadius;
	}
	getOccCenter(): Vector3D {
		return this.m_centerv;
	}
	addSubPov(pov: ISpacePOV): void {
		if (pov != null && pov != this) {
			if (this.m_subPovs == null) {
				this.m_subPovs = [];
			}
			this.m_subPovs.push(pov);
			++this.m_subPovsTotal;
		}
	}
	cameraTest(camera: IRenderCamera): void {
		this.m_camPv.copyFrom(camera.getPosition());
		this.m_sphOcc.cameraTest(camera);
		this.status = this.m_sphOcc.status;

		if (this.m_subPovsTotal > 0) {
			for (let i = 0; i < this.m_subPovsTotal; ++i) {
				this.m_subPovs[i].cameraTest(camera);
			}
		}
	}
	begin(): void {
		this.calcPlane();
		this.m_sphOcc.begin();

		if (this.m_subPovsTotal > 0) {
			for (let i = 0; i < this.m_subPovsTotal; ++i) {
				this.m_subPovs[i].begin();
			}
		}
	}
	test(bounds: AABB, cullMask: number): void {
		this.status = 0;
		if (this.m_planeNV.w > MathConst.MATH_MIN_POSITIVE) {
			// 和 m_planeNV 所代表的正空间是否相交
			// 如果条件为 true, 则和正空间不想交
			if (this.m_planeNV.dot(bounds.center) - bounds.radius < this.m_planeDis) {
				this.m_sphOcc.test(bounds, cullMask);
				this.status = this.m_sphOcc.status;

				if (this.status == 1) {
					let i: number = 0;
					for (; i < 4; ++i) {
						if (this.m_pnvList[i].dot(bounds.center) - bounds.radius < this.m_pdisList[i]) {
							// 和负空间会相交, 因此可见
							break;
						}
					}
					if (i > 3) {
						this.status = 1;
						if (DebugFlag.Flag_0 > 0) {
							console.log("QuadPOV::test(), this.status: ", this.status);
						}
						if (this.m_subPovsTotal > 0 && this.status == 1) {

							for (i = 0; i < this.m_subPovsTotal; ++i) {
								const pov = this.m_subPovs[i];
								if (pov.enabled) {
									pov.test(bounds, cullMask);
									if (pov.status != 1) {
										this.status = 0;
										break;
									}
								}
							}
							
						}
					} else {
						this.status = 0;
					}
				}
			}
		}
	}
}
export { QuadPOV };
