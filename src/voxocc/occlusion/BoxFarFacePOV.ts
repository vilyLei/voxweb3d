import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import Plane from "../../vox/geom/Plane";
import AABB from "../../vox/geom/AABB";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";
import SpherePOV from "./SpherePOV";

class BoxFace {
	uid: number = -1;
	plane_nv: Vector3D = new Vector3D(0.0, 0.0, 1.0);
	plane_dis: number = 0.0;
	pvList: Vector3D[] = [];
	lsIndicis: number[] = [];
	blsList: BoxLS[] = null;
	visible: boolean = true;
	private m_pv: Vector3D = new Vector3D();
	constructor(puid: number) {
		this.uid = puid;
	}
	calc(camPv: Vector3D): void {
		this.m_pv.copyFrom(this.pvList[0]);
		this.m_pv.subtractBy(camPv);
		//this.m_pv.copyFrom(nv);
		this.visible = this.m_pv.dot(this.plane_nv) < MathConst.MATH_MIN_POSITIVE;
		if (this.visible) {
			let i: number = 0;
			for (; i < 4; ++i) {
				--this.blsList[this.lsIndicis[i]].acount;
			}
		}
	}
}
class BoxLS {
	uid: number = -1;
	acount: number = 0;
	a: Vector3D = null;
	b: Vector3D = null;
	nv: Vector3D = new Vector3D();
	constructor(puid: number, pa: Vector3D, pb: Vector3D) {
		this.uid = puid;
		this.a = pa;
		this.b = pb;
	}
}
class BoxFarFacePOV implements ISpacePOV {
	constructor() {}
	private m_subPovs: ISpacePOV[] = null;
	private m_subPovsTotal: number = 0;
	private m_sphOcc = new SpherePOV();
	private m_pvList: Vector3D[] = [null, null, null, null, null, null, null, null];
	private m_projNVTotal = 0;
	private m_planeNVList: Vector3D[] = [
		new Vector3D(),
		new Vector3D(),
		new Vector3D(),
		new Vector3D(),
		new Vector3D(),
		new Vector3D(),
		new Vector3D(),
		new Vector3D(),
		new Vector3D(),
		new Vector3D()
	];
	private m_planeDisList: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	private m_projNV2Total = 0;
	private m_planeNVList2: Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D()];
	private m_planeDisList2: number[] = [0, 0, 0, 0, 0, 0];

	private m_faceList: BoxFace[] = [];
	private m_blsList: BoxLS[] = [];

	private m_centerv = new Vector3D();
	private m_pov = new Vector3D();
	private m_pv = new Vector3D();
	private m_quadNV = new Vector3D();
	private m_quadDis = 0.0;
	private m_camPv = new Vector3D();

	public enabled: boolean = true;
	public status: number = 0;
	//public edgeFrame:DashedLine3DEntity = null;
	//private m_initBoo:boolean = true;
	transformMat: Matrix4 = null;
	showLSInfo(): void {
		let str: string = "";
		let i: number = 0;
		for (; i < 12; ++i) {
			//--this.blsList[this.lsIndicis[i]].acount;
			str += this.m_blsList[i].acount + ",";
		}
		console.log("showLSInfo: " + str);
	}
	setCamPosition(pv: Vector3D): void {
		this.m_camPv.copyFrom(pv);
		this.m_sphOcc.setCamPosition(pv);
	}
	private calcPlane(): void {
		let i = 0;

		for (; i < 6; ++i) {
			this.m_faceList[i].calc(this.m_camPv);
		}

		this.m_projNVTotal = 0;
		let bls: BoxLS = null;
		let pnv: Vector3D = null;
		let pvList: Vector3D[] = [];
		for (i = 0; i < 12; ++i) {
			bls = this.m_blsList[i];
			if (bls.acount == 1) {
				pnv = this.m_planeNVList[this.m_projNVTotal];

				this.m_pv.copyFrom(bls.a);
				this.m_pv.subtractBy(this.m_camPv);
				this.m_pov.copyFrom(bls.b);
				this.m_pov.subtractBy(this.m_camPv);

				Vector3D.Cross(this.m_pv, this.m_pov, pnv);
				if (pnv.dot(bls.nv) < MathConst.MATH_MIN_POSITIVE) {
					pnv.scaleBy(-1.0);
				}
				pnv.normalize();

				this.m_planeDisList[this.m_projNVTotal] = pnv.dot(bls.a);
				pvList.push(bls.a, bls.b);
				++this.m_projNVTotal;
			}
		}
		this.m_projNV2Total = 0;
		for (i = 0; i < 6; ++i) {
			if (this.m_faceList[i].visible) {
				this.m_planeNVList[this.m_projNVTotal].copyFrom(this.m_faceList[i].plane_nv);
				this.m_planeDisList[this.m_projNVTotal] = this.m_faceList[i].plane_dis;
				++this.m_projNVTotal;
			} else {
				this.m_planeNVList2[this.m_projNV2Total].copyFrom(this.m_faceList[i].plane_nv);
				this.m_planeDisList2[this.m_projNV2Total] = this.m_faceList[i].plane_dis;
				++this.m_projNV2Total;
			}
		}
		//  if(this.m_initBoo)
		//  {
		//      this.m_initBoo = false;
		//      this.edgeFrame.initializeDashedLine(pvList);
		//      //this.edgeFrame.initializeLS(bls.a, bls.b);
		//      this.edgeFrame.setRGB3f(1.0,0.0,0.0);
		//  }
		//console.log("this.m_projNVTotal: "+this.m_projNVTotal);
	}
	updateOccData(): void {
		const point0 = this.m_pvList[0];
		const point1 = this.m_pvList[1];
		const point2 = this.m_pvList[2];
		const point3 = this.m_pvList[3];
		const point4 = this.m_pvList[4];
		const point5 = this.m_pvList[5];
		const point6 = this.m_pvList[6];
		const point7 = this.m_pvList[7];

		this.m_centerv.copyFrom(this.m_pvList[0]);
		let i = 1;
		for (; i < 8; ++i) {
			this.m_centerv.addBy(this.m_pvList[i]);
		}
		this.m_centerv.scaleBy(0.125);

		this.m_sphOcc.setPosition(this.m_centerv);
		this.m_sphOcc.occRadius = 0.0;
		for (i = 0; i < 8; ++i) {
			this.m_pv.copyFrom(this.m_pvList[i]);
			this.m_pv.subtractBy(this.m_centerv);
			this.m_pv.w = this.m_pv.getLength();
			if (this.m_pv.w > this.m_sphOcc.occRadius) {
				this.m_sphOcc.occRadius = this.m_pv.w;
			}
		}

		for (i = 0; i < 12; ++i) {
			this.m_blsList[i].nv.copyFrom(this.m_blsList[i].a);
			this.m_blsList[i].nv.subtractBy(this.m_centerv);
		}

		let face: BoxFace = null;

		face = this.m_faceList[0];
		face.blsList = this.m_blsList;
		face.pvList.push(point0, point1, point2, point3);
		Vector3D.CrossSubtract(point3, point0, point1, point0, face.plane_nv);
		face.plane_nv.normalize(); // -y
		face.plane_dis = face.plane_nv.dot(face.pvList[0]);
		face.lsIndicis.push(0, 1, 2, 3);

		face = this.m_faceList[1];
		face.blsList = this.m_blsList;
		face.pvList.push(point4, point5, point6, point7);
		Vector3D.CrossSubtract(point5, point4, point7, point4, face.plane_nv);
		face.plane_nv.normalize(); // +y
		face.plane_dis = face.plane_nv.dot(face.pvList[0]);
		face.lsIndicis.push(4, 5, 6, 7);

		face = this.m_faceList[2];
		face.blsList = this.m_blsList;
		face.pvList.push(point0, point4, point5, point1);
		Vector3D.CrossSubtract(point0, point1, point0, point4, face.plane_nv);
		face.plane_nv.normalize(); // +x
		face.plane_dis = face.plane_nv.dot(face.pvList[0]);
		face.lsIndicis.push(0, 4, 8, 9);

		face = this.m_faceList[3];
		face.blsList = this.m_blsList;
		face.pvList.push(point1, point5, point6, point2);
		Vector3D.CrossSubtract(point1, point2, point1, point5, face.plane_nv);
		face.plane_nv.normalize(); // -z
		face.plane_dis = face.plane_nv.dot(face.pvList[0]);
		face.lsIndicis.push(1, 5, 9, 10);

		face = this.m_faceList[4];
		face.blsList = this.m_blsList;
		face.pvList.push(point2, point6, point7, point3);
		Vector3D.CrossSubtract(point2, point3, point2, point6, face.plane_nv);
		face.plane_nv.normalize(); // -x
		face.plane_dis = face.plane_nv.dot(face.pvList[0]);
		face.lsIndicis.push(2, 6, 10, 11);

		face = this.m_faceList[5];
		face.blsList = this.m_blsList;
		face.pvList.push(point3, point7, point4, point0);
		Vector3D.CrossSubtract(point3, point0, point3, point7, face.plane_nv);
		face.plane_nv.normalize(); // +z
		face.plane_dis = face.plane_nv.dot(face.pvList[0]);
		face.lsIndicis.push(3, 7, 11, 8);
	}
	setParam(minV: Vector3D, maxV: Vector3D): void {
		if (this.m_pvList[0] == null) {
			this.m_pvList[0] = new Vector3D(maxV.x, minV.y, maxV.z);
			this.m_pvList[1] = new Vector3D(maxV.x, minV.y, minV.z);
			this.m_pvList[2] = new Vector3D(minV.x, minV.y, minV.z);
			this.m_pvList[3] = new Vector3D(minV.x, minV.y, maxV.z);

			this.m_pvList[4] = new Vector3D(maxV.x, maxV.y, maxV.z);
			this.m_pvList[5] = new Vector3D(maxV.x, maxV.y, minV.z);
			this.m_pvList[6] = new Vector3D(minV.x, maxV.y, minV.z);
			this.m_pvList[7] = new Vector3D(minV.x, maxV.y, maxV.z);

			const point0 = this.m_pvList[0];
			const point1 = this.m_pvList[1];
			const point2 = this.m_pvList[2];
			const point3 = this.m_pvList[3];
			const point4 = this.m_pvList[4];
			const point5 = this.m_pvList[5];
			const point6 = this.m_pvList[6];
			const point7 = this.m_pvList[7];

			if (this.transformMat != null) {
				this.transformMat.transformVector3Self(point0);
				this.transformMat.transformVector3Self(point1);
				this.transformMat.transformVector3Self(point2);
				this.transformMat.transformVector3Self(point3);
				this.transformMat.transformVector3Self(point4);
				this.transformMat.transformVector3Self(point5);
				this.transformMat.transformVector3Self(point6);
			}

			let ls: BoxLS = null;
			ls = new BoxLS(0, point0, point1);
			this.m_blsList.push(ls);
			ls = new BoxLS(1, point1, point2);
			this.m_blsList.push(ls);
			ls = new BoxLS(2, point2, point3);
			this.m_blsList.push(ls);
			ls = new BoxLS(3, point3, point0);
			this.m_blsList.push(ls);

			ls = new BoxLS(4, point4, point5);
			this.m_blsList.push(ls);
			ls = new BoxLS(5, point5, point6);
			this.m_blsList.push(ls);
			ls = new BoxLS(6, point6, point7);
			this.m_blsList.push(ls);
			ls = new BoxLS(7, point7, point4);
			this.m_blsList.push(ls);

			ls = new BoxLS(8, point0, point4);
			this.m_blsList.push(ls);
			ls = new BoxLS(9, point1, point5);
			this.m_blsList.push(ls);
			ls = new BoxLS(10, point2, point6);
			this.m_blsList.push(ls);
			ls = new BoxLS(11, point3, point7);
			this.m_blsList.push(ls);

			this.m_faceList.push(new BoxFace(0), new BoxFace(1), new BoxFace(2), new BoxFace(3), new BoxFace(4), new BoxFace(5));
		} else {
			this.m_pvList[0].setXYZ(maxV.x, minV.y, maxV.z);
			this.m_pvList[1].setXYZ(maxV.x, minV.y, minV.z);
			this.m_pvList[2].setXYZ(minV.x, minV.y, minV.z);
			this.m_pvList[3].setXYZ(minV.x, minV.y, maxV.z);
			this.m_pvList[4].setXYZ(maxV.x, maxV.y, maxV.z);
			this.m_pvList[5].setXYZ(maxV.x, maxV.y, minV.z);
			this.m_pvList[6].setXYZ(minV.x, maxV.y, minV.z);
			this.m_pvList[7].setXYZ(minV.x, maxV.y, maxV.z);
			if (this.transformMat != null) {
				this.transformMat.transformVector3Self(this.m_pvList[0]);
				this.transformMat.transformVector3Self(this.m_pvList[1]);
				this.transformMat.transformVector3Self(this.m_pvList[2]);
				this.transformMat.transformVector3Self(this.m_pvList[3]);
				this.transformMat.transformVector3Self(this.m_pvList[4]);
				this.transformMat.transformVector3Self(this.m_pvList[5]);
				this.transformMat.transformVector3Self(this.m_pvList[6]);
			}
		}
		//this.updateOccData();
	}
	setPositionAt(pv: Vector3D, i: number): void {
		if (pv != null && i < 8 && i > -1) {
			this.m_pvList[i].copyFrom(pv);
		}
	}
	getPositionAt(pv: Vector3D, i: number): void {
		if (pv != null && i < 8 && i > -1) {
			pv.copyFrom(this.m_pvList[i]);
		}
	}
	getPositionList(): Vector3D[] {
		return this.m_pvList;
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
		this.m_sphOcc.cameraTest(camera);
		this.status = this.m_sphOcc.status;

		this.m_camPv.copyFrom(camera.getPosition());
		if (this.m_subPovsTotal > 0) {
			for (let i = 0; i < this.m_subPovsTotal; ++i) {
				this.m_subPovs[i].cameraTest(camera);
			}
		}
	}
	begin(): void {
		let i: number = 0;
		for (; i < 12; ++i) {
			this.m_blsList[i].acount = 2;
		}

		this.calcPlane();
		this.m_sphOcc.begin();

		if (this.m_subPovsTotal > 0) {
			for (let i: number = 0; i < this.m_subPovsTotal; ++i) {
				this.m_subPovs[i].begin();
			}
		}
	}
	test(bounds: AABB, cullMask: number): void {
		this.status = 0;
		this.m_sphOcc.test(bounds, cullMask);
		this.status = this.m_sphOcc.status;
		if (this.status == 1) {
			let pr: number = bounds.radius;
			let cv: Vector3D = bounds.center;
			this.status = 0;
			// 可能不可见
			let i: number = 0;
			for (; i < this.m_projNVTotal; ++i) {
				Plane.PlaneIntersectSphere(this.m_planeNVList[i], this.m_planeDisList[i], cv, pr);
				if (Plane.IntersectSatus > 0 || Plane.IntersectBoo) {
					// 可见
					break;
				}
			}
			if (i >= this.m_projNVTotal) {
				i = 0;
				if ((cullMask & SpaceCullingMask.INNER_POV_PASS) == SpaceCullingMask.INNER_POV_PASS) {
					// 测试是否包含在遮挡体内部
					if (Vector3D.Distance(cv, this.m_centerv) < pr + this.m_sphOcc.occRadius) {
						for (; i < this.m_projNV2Total; ++i) {
							if (this.m_planeNVList2[i].dot(cv) - this.m_planeDisList2[i] > pr) {
								break;
							}
							//  Plane.PlaneIntersectSphere(this.m_planeNVList2[i],this.m_planeDisList2[i], cv,pr);
							//  if(Plane.IntersectSatus > 0 && !Plane.IntersectBoo)
							//  {
							//      // 可见
							//      break;
							//  }
						}
					}
				}
				if (i < this.m_projNV2Total) {
					this.status = 1;
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
			}
		}
	}
}
export { BoxFarFacePOV };
