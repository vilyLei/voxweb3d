import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import StraightLine from "../../vox/geom/StraightLine";
import AABB from "../../vox/geom/AABB";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";
import DebugFlag from "../../vox/debug/DebugFlag";

export default class SpherePOV implements ISpacePOV {
	constructor() {}
	private m_subPovs: ISpacePOV[] = null;
	private m_subPovsTotal = 0;
	private m_centerv = new Vector3D();
	private m_pv = new Vector3D();
	private m_occTV = new Vector3D();
	private m_camPv = new Vector3D();
	private m_occDis = 0.0;
	private m_occRadiusK = 0.0;
	public occRadius = 300.0;

	public enabled = true;
	public status = 0;
	setCamPosition(pv: Vector3D): void {
		this.m_camPv.copyFrom(pv);
	}
	setPosition(pov: Vector3D): void {
		this.m_centerv.copyFrom(pov);
	}

	updateOccData(): void {}
	getOccRadius(): number {
		return this.occRadius;
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
		this.status = 0;
		if (camera.visiTestSphere2(this.m_centerv, this.occRadius)) {
			this.status = 1;
		}
	}
	begin(): void {

		this.m_occTV.copyFrom(this.m_centerv);
		this.m_occTV.subtractBy(this.m_camPv);

		const pv = this.m_occTV;
		this.m_occDis = Math.sqrt(pv.x * pv.x + pv.y * pv.y + pv.z * pv.z);
        const fk = 1.0 / this.m_occDis;
        pv.scaleBy(fk);
		// pv.x /= this.m_occDis;
		// pv.y /= this.m_occDis;
		// pv.z /= this.m_occDis;
		// this.m_occRadiusK = this.occRadius / this.m_occDis;
		this.m_occRadiusK = this.occRadius * fk;

		if (this.m_subPovsTotal > 0) {
			for (let i = 0; i < this.m_subPovsTotal; ++i) {
				this.m_subPovs[i].begin();
			}
		}
	}
	test(bounds: AABB, cullMask: number): void {
		//  this.m_pv.copyFrom(bounds.center);
		//  this.m_pv.subtractBy(this.m_camPv);
		//  let dis:number = this.m_occTV.dot(this.m_pv);
		this.status = 0;
        const pv = this.m_pv;
		pv.copyFrom(bounds.center);
		pv.subtractBy(this.m_centerv);
		let dis = this.m_occTV.dot(pv);
		if (dis > MathConst.MATH_MIN_POSITIVE) {
			pv.copyFrom(bounds.center);
			pv.subtractBy(this.m_camPv);
			dis = this.m_occTV.dot(this.m_pv);
			//  dis = this.m_occTV.dot(this.m_pv);
			//  //if((dis - this.m_occDis) > bounds.radius)
			//  //{
			//      //let por:number = this.m_occRadiusK * dis;
			//      //dis = StraightLine.CalcPVDis(this.m_occTV,this.m_camPv,bounds.center) + bounds.radius;
			//      //if(dis < por)
			//      //if((StraightLine.CalcPVDis(this.m_occTV,this.m_camPv,bounds.center) + bounds.radius) < (this.m_occRadiusK * dis))
			//      //{
			//      //    this.status = 1;
			//      //}
			//  //}
			if (StraightLine.CalcPVDis(this.m_occTV, this.m_camPv, bounds.center) + bounds.radius < this.m_occRadiusK * dis) {
				this.status = 1;
			}
		} else {
			dis = Vector3D.Distance(bounds.center, this.m_centerv);
			if (dis + bounds.radius < this.occRadius) {
				this.status = 1;
			}
		}
        // if(DebugFlag.Flag_0 > 0) {
        //     console.log("SpherePOV::test(), this.status: ", this.status);
        // }
		if (this.m_subPovsTotal > 0 && this.status == 1) {
			for (let i = 0; i < this.m_subPovsTotal; ++i) {
				this.m_subPovs[i].test(bounds, cullMask);
				if (this.m_subPovs[i].status != 1) {
					this.status = 0;
					break;
				}
			}
		}
	}
}
