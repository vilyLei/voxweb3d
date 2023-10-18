
import CameraBase from "../../../vox/view/CameraBase";
import Vector3D from "../../../vox/math/Vector3D";
import ROTransform from "../../../vox/display/ROTransform";
import Matrix4 from "../../../vox/math/Matrix4";
import { WGRUniformValue } from "../../render/uniform/WGRUniformValue";

class TransEntity {
	trans: ROTransform | null = null;
	mat = new Matrix4();
	posV = new Vector3D(Math.random() * 1000.0 - 500, Math.random() * 1000.0 - 500, Math.random() * 1000.0 - 500);
	rotateV = new Vector3D(Math.random() * 300.0, Math.random() * 300.0, Math.random() * 300.0);
	scaleV = new Vector3D(1.0, 1.0, 1.0);
	transData: Float32Array | null = null;
	transData2: Float32Array | null = null;
	scaleFactor = Math.random() * 0.3 + 0.1;
	enabled = true;
	dataIndex = 0;
	upateTimes = 100000000;
	running = true;
	version = -1;
	delayPhase0Times = 0;
	delayPhase1Times = Math.round(Math.random() * 700) + 300;
	uniformValue: WGRUniformValue;
	scaleAndRotBoo = true;

	intialize(cam?: CameraBase): void {
		this.trans = ROTransform.Create();
		this.trans.update();
		this.scaleV.w = Math.random() * 100.0;
		if(cam) {
			this.applyCamera(cam);
		}
	}
	applyCamera(cam: CameraBase): void {

		const trans = this.trans;
		const mat = this.mat;
		// console.log("cam.getVPMatrix(): ", cam.getVPMatrix().toString());
		mat.copyFrom(trans.getMatrix());
		mat.append(cam.getVPMatrix());
		this.transData = mat.getLocalFS32();
		if(this.transData2) {
			this.transData2.set(this.transData, 0);
		}
	}
	run(cam: CameraBase): void {

		if(this.running && this.upateTimes > 0) {

			if(this.delayPhase0Times > 0) {
				this.delayPhase0Times --;
				if(this.delayPhase0Times == 0) {
					this.delayPhase1Times = Math.round(Math.random() * 300) + 700;
				}
				return
			}
			if(this.delayPhase1Times > 0) {
				this.delayPhase1Times --;
				if(this.delayPhase1Times == 0) {
					this.delayPhase0Times = Math.round(Math.random() * 300) + 700;
				}
			}

			this.upateTimes --;

			const rv = this.rotateV;
			const sv = this.scaleV;
			let s = this.scaleFactor * Math.cos((sv.w += 0.01)) + 0.1;
			if (s < 0.1) {
				s = 0.1;
			}
			sv.setXYZ(s, s, s);

			const trans = this.trans;
			rv.x += 1.0;
			rv.y += 0.5;
			if(this.scaleAndRotBoo) {
				trans.setRotationV3(rv);
				trans.setScaleV3(sv);
			}
			trans.setPosition(this.posV);
			trans.update();
			this.applyCamera(cam);
			this.version ++;
			if(this.uniformValue) {
				this.uniformValue.upate();
			}
		}
	}
}
export { TransEntity }
