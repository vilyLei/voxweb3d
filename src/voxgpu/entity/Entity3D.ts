import ROTransform from "../../vox/display/ROTransform";
import AABB from "../../vox/geom/AABB";
import Matrix4 from "../../vox/math/Matrix4";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGMaterial } from "../material/WGMaterial";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";

class Entity3D {
	private mMat = new Matrix4();
	private mCamera: IRenderCamera;

	uuid?: string;
	materials: WGMaterial[];
	geometry: WGGeometry;

	bounds: AABB;
	transform: ROTransform;
	uniformTransform: WGRUniformValue;

	constructor(transformEnabled = true) {
		this.init(transformEnabled);
	}
	protected init(transformEnabled: boolean): void {
		if (transformEnabled) {
			this.transform = ROTransform.Create();
			this.transform.update();
			this.uniformTransform = new WGRUniformValue(this.mMat.getLocalFS32());
			this.uniformTransform.arrayStride = 64;
		}
		// console.log("this.uniformTransform: ", this.uniformTransform);
	}
	initialize(): void {}

	isREnabled(): boolean {
		const ms = this.materials;
		if (ms) {
			for (let i = 0; i < ms.length; ++i) {
				if (!ms[i].isREnabled()) {
					return false;
				}
			}
		} else {
			return false;
		}
		const g = this.geometry;
		if (g) {
			if(!g.isREnabled()) {
				return false;
			}
		} else {
			return false;
		}
		return true;
	}
	// for test
	applyCamera(cam?: IRenderCamera): void {

		this.mCamera = cam ? cam : this.mCamera;

		const trans = this.transform;
		if (this.mCamera && trans) {
			const mat = this.mMat;

			trans.update();
			mat.copyFrom(trans.getMatrix());
			mat.append((this.mCamera as any).getVPMatrix());
			this.uniformTransform.upate();
		}
	}
	update(): void {
		this.applyCamera();
	}
	destroy(): void {}
}
export { Entity3D };
