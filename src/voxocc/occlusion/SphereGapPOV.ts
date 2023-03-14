import Vector3D from "../../vox/math/Vector3D";
import StraightLine from "../../vox/geom/StraightLine";
import AABB from "../../vox/geom/AABB";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";

// 一般和别的 凸体pov等 结合使用, 一般用于产生 交集
export default class SphereGapPOV implements ISpacePOV {
	constructor() {}
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
		return this.m_occDis;
	}
	getOccCenter(): Vector3D {
		return this.m_centerv;
	}
	addSubPov(pov: ISpacePOV): void {}
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
		let pv: Vector3D = this.m_occTV;
		this.m_occDis = Math.sqrt(pv.x * pv.x + pv.y * pv.y + pv.z * pv.z);
		pv.x /= this.m_occDis;
		pv.y /= this.m_occDis;
		pv.z /= this.m_occDis;
		this.m_occRadiusK = this.occRadius / this.m_occDis;
	}
	test(bounds: AABB, cullMask: number): void {
		this.m_pv.copyFrom(bounds.center);
		this.m_pv.subtractBy(this.m_camPv);
		this.m_pv.w = bounds.radius + this.m_occRadiusK * this.m_occTV.dot(this.m_pv);
		// if (StraightLine.CalcPVDis(this.m_occTV, this.m_camPv, bounds.center) < this.m_pv.w) {
		// 	this.status = 0;
		// } else {
		// 	this.status = 1;
		// }
        const flag = StraightLine.CalcPVDis(this.m_occTV, this.m_camPv, bounds.center) < this.m_pv.w;
        this.status = flag ? 0 : 1;
	}
}
