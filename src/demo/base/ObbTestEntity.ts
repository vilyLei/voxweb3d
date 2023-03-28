import OBB from "../../vox/geom/OBB";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import IRendererScene from "../../vox/scene/IRendererScene";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Color4 from "../../vox/material/Color4";
import Vector3D from "../../vox/math/Vector3D";
import IColorMaterial from "../../vox/material/mcase/IColorMaterial";

class OBBTestEntity {
	private m_scene: IRendererScene;
	private m_frame: BoxFrame3D;
	private m_axis: Axis3DEntity;
	private m_value3: Vector3D = null;
	private m_valueS3 = new Vector3D(0.5, 0.5, 0.5);
	private m_valueR3 = new Vector3D();
	private m_valueT3 = new Vector3D(0.5, 0.5, 0.5);
	private m_pos = new Vector3D();
	private m_initVer = 0;
	private m_ver = 0;
	private m_size = 100;
	entity: DisplayEntity = null;
	obb = new OBB();
	name = "";
	constructor() {}
	initialize(sc: IRendererScene, size: number = 100, color: Color4 = null, frameColor: Color4 = null, pos: Vector3D = null): void {
		if (this.m_scene == null && sc != null) {
			this.m_scene = sc;
			this.m_size = size;

			let box = new Box3DEntity();
			box.normalEnabled = true;
			box.initializeCube(size);

			if (color) {
				(box.getMaterial() as IColorMaterial).setColor(color);
			}
			if (pos) {
				box.setPosition(pos);
				this.m_pos.copyFrom(pos);
			}
			this.m_scene.addEntity(box);
			this.entity = box;
			this.obb.fromEntity(this.entity);

			this.m_frame = new BoxFrame3D(true);
			this.m_frame.initializeByOBB(this.obb, 1.0);
			if (frameColor) {
				this.setFrameColor(frameColor);
			}
			this.m_scene.addEntity(this.m_frame);

			this.m_axis = new Axis3DEntity();
			this.m_axis.initialize(size + 30);
			this.m_axis.setPosition(this.obb.center);
			this.m_scene.addEntity(this.m_axis);

			this.m_value3 = this.m_valueS3;
		}
	}

	showErrorData(): void {
		const s3 = this.m_valueS3.clone().scaleBy(2.0);
		const r3 = this.m_valueR3.clone().scaleBy(360);
		const t3 = this.m_valueT3.clone();
		t3.subtractBy(new Vector3D(0.5, 0.5, 0.5));
		t3.scaleBy(600.0);
		t3.addBy(this.m_pos);

		console.log(this.name, "error ctrl data: ");
		console.log("         ctrl scale: ", this.m_valueS3);
		console.log("    ctrl rotatation: ", this.m_valueR3);
		console.log("   ctrl translation: ", this.m_valueT3);
		console.log(this.name, "error data: ");
		console.log("         scale: ", s3);
		console.log("    rotatation: ", r3);
		console.log("   translation: ", t3);
	}
	setFrameColor(color: Color4): void {
		this.m_frame.setRGB3f(color.r, color.g, color.b);
	}
	getScaleV(): Vector3D {
		return this.m_valueS3;
	}
	getRotationV(): Vector3D {
		return this.m_valueR3;
	}
	getTranslationV(): Vector3D {
		return this.m_valueT3;
	}

	setValueX(v: number): void {
		this.m_value3.x = v;
		this.m_ver++;
	}
	setValueY(v: number): void {
		this.m_value3.y = v;
		this.m_ver++;
	}
	setValueZ(v: number): void {
		this.m_value3.z = v;
		this.m_ver++;
	}
	/**
	 * 0: 表示缩放, 1: 表示旋转, 2: 表示平移
	 */
	private m_opType = 0;
	setOperationType(opType: number): void {
		this.m_opType = opType;
		switch (this.m_opType) {
			case 0:
				this.m_value3 = this.m_valueS3;
				break;
			case 1:
				this.m_value3 = this.m_valueR3;
				break;
			case 2:
				this.m_value3 = this.m_valueT3;
				break;
			default:
				break;
		}
	}
	getOperationType(): number {
		return this.m_opType;
	}
	getCurrValue3(): Vector3D {
		return this.m_value3;
	}
	select(): void {
		this.setFrameColor(new Color4(1.0, 0.0, 0.0));
	}
	deselect(): void {
		this.setFrameColor(new Color4(0, 0, 0));
	}
	updateWithCtrlParams(sv3: Vector3D, rv3: Vector3D, tv3: Vector3D): void {

		this.m_valueS3.copyFrom(sv3);
		this.m_valueR3.copyFrom(rv3);
		this.m_valueT3.copyFrom(tv3);

		const s3 = this.m_valueS3.clone().scaleBy(2.0);
		const r3 = this.m_valueR3.clone().scaleBy(360);
		const t3 = this.m_valueT3.clone();
		t3.subtractBy(new Vector3D(0.5, 0.5, 0.5));
		t3.scaleBy(600.0);
		t3.addBy(this.m_pos);
		this.updateWithParams(s3, r3, t3);
	}
	updateWithParams(sv3: Vector3D, rv3: Vector3D, tv3: Vector3D): void {
		const obb = this.obb;
		const et = this.entity;
		et.setPosition(tv3);
		et.setScale3(sv3);
		et.setRotation3(rv3);
		et.update();
		obb.fromEntity(et);

		const xPv = obb.axis[0].clone().scaleBy(this.m_size);
		const yPv = obb.axis[1].clone().scaleBy(this.m_size);
		const zPv = obb.axis[2].clone().scaleBy(this.m_size);
		this.m_axis.updateDataWithPos(xPv, yPv, zPv);
		this.m_axis.updateMeshToGpu();

		this.m_axis.setPosition(obb.center);
		this.m_axis.update();

		this.m_frame.updateFrameByOBB(obb, 1.0);
		this.m_frame.updateMeshToGpu();
	}

	update(): void {
		if (this.m_initVer != this.m_ver) {
			this.m_initVer = this.m_ver;

			const s3 = this.m_valueS3.clone().scaleBy(2.0);
			const r3 = this.m_valueR3.clone().scaleBy(360);
			const t3 = this.m_valueT3.clone();

			t3.subtractBy(new Vector3D(0.5, 0.5, 0.5));
			t3.scaleBy(600.0);
			t3.addBy(this.m_pos);

			this.updateWithParams(s3, r3, t3);
		}
	}
}
export { OBBTestEntity };
