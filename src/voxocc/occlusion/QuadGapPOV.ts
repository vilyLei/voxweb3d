import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Plane from "../../vox/geom/Plane";
import AABB from "../../vox/geom/AABB";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";
import SphereGapPOV from "./SphereGapPOV";

// 一般和别的 凸体pov等 结合使用, 一般用于产生 交集
export default class QuadGapPOV implements ISpacePOV {
	constructor() {}
	private m_sphOcc = new SphereGapPOV();
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
		if (nv.dot(this.m_pdvList[0]) < 0.0) nv.scaleBy(-1.0);
		nv.normalize();
		this.m_pdisList[0] = nv.dot(this.m_pvList[0]);

		nv = this.m_pnvList[1];
		Vector3D.CrossSubtract(this.m_camPv, this.m_pvList[1], this.m_camPv, this.m_pvList[2], nv);
		if (nv.dot(this.m_pdvList[1]) < 0.0) nv.scaleBy(-1.0);
		nv.normalize();
		this.m_pdisList[1] = nv.dot(this.m_pvList[1]);

		nv = this.m_pnvList[2];
		Vector3D.CrossSubtract(this.m_camPv, this.m_pvList[2], this.m_camPv, this.m_pvList[3], nv);
		if (nv.dot(this.m_pdvList[2]) < 0.0) nv.scaleBy(-1.0);
		nv.normalize();
		this.m_pdisList[2] = nv.dot(this.m_pvList[2]);

		nv = this.m_pnvList[3];
		Vector3D.CrossSubtract(this.m_camPv, this.m_pvList[3], this.m_camPv, this.m_pvList[0], nv);
		if (nv.dot(this.m_pdvList[3]) < 0.0) nv.scaleBy(-1.0);
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
		//  this.m_pvList.push(va);
		//  this.m_pvList.push(vb);
		//  this.m_pvList.push(vc);
		//  this.m_pvList.push(vd);
		/*

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
        */

		this.m_centerv.copyFrom(this.m_pvList[0]);
		this.m_centerv.addBy(this.m_pvList[1]);
		this.m_centerv.addBy(this.m_pvList[2]);
		this.m_centerv.addBy(this.m_pvList[3]);
		this.m_centerv.scaleBy(0.25);

		this.m_sphOcc.setPosition(this.m_centerv);
		this.m_pv.copyFrom(this.m_pvList[0]);
		this.m_pv.subtractBy(this.m_centerv);
		this.m_sphOcc.occRadius = this.m_pv.getLength();

		let i = 1;
		for (; i < 4; ++i) {
			this.m_pv.copyFrom(this.m_pvList[i]);
			this.m_pv.subtractBy(this.m_centerv);
			this.m_pv.w = this.m_pv.getLength();
			if (this.m_pv.w > this.m_sphOcc.occRadius) {
				this.m_sphOcc.occRadius = this.m_pv.w;
			}
		}

		let pv = this.m_pdvList[0];
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
	addSubPov(pov: ISpacePOV): void {}
	cameraTest(camera: IRenderCamera): void {
        // const pv = camera.getPosition();
        this.m_camPv.copyFrom(camera.getPosition());
		// this.m_sphOcc.setCamPosition(pv);

		this.m_sphOcc.cameraTest(camera);
		this.status = this.m_sphOcc.status;
	}
	begin(): void {
		this.calcPlane();
		this.m_sphOcc.begin();
	}
	test(bounds: AABB, cullMask: number): void {
		if (this.m_planeNV.w > MathConst.MATH_MIN_POSITIVE) {
			//this.m_pv.copyFrom(bounds.center);
			//this.m_pv.subtractBy(this.m_centerv);
			//this.m_pv.normalize();
			//if(this.m_planeNV.dot(this.m_pv) < MathConst.MATH_MIN_POSITIVE)
			//{
			this.m_sphOcc.test(bounds, cullMask);
			this.status = this.m_sphOcc.status;
			if (this.status == 0) {
				let i: number = 0;
				for (; i < 4; ++i) {
					if (this.m_pnvList[i].dot(bounds.center) - this.m_pdisList[i] - bounds.radius > MathConst.MATH_MIN_POSITIVE) {
						break;
					}
				}
				if (i < 4) {
					this.status = 1;
				}
			}
			//  }
			//  else
			//  {
			//      this.status = 0;
			//  }
		} else {
			this.status = 1;
		}
	}
}
