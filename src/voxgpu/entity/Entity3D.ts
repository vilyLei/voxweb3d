import ROTransform from "../../vox/display/ROTransform";
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

	transform: ROTransform;
	uniformTransform: WGRUniformValue;
	constructor() {
		this.init();
	}
	protected init(): void {
		this.transform = ROTransform.Create();
		this.transform.update();
		this.uniformTransform = new WGRUniformValue(this.mMat.getLocalFS32());
		this.uniformTransform.arrayStride = 64;
		// console.log("this.uniformTransform: ", this.uniformTransform);
	}
	initialize(): void {}
	applyCamera(cam?: IRenderCamera): void {

		this.mCamera = cam? cam : this.mCamera;
		if(this.mCamera) {
			const trans = this.transform;
			const mat = this.mMat;

			trans.update();
			mat.copyFrom(trans.getMatrix());
			mat.append((cam as any).getVPMatrix());
			this.uniformTransform.upate();
		}
	}
	update(): void {
		this.applyCamera();
	}
	destroy(): void {

	}
}
export { Entity3D };
