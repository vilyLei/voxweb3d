import IVector3D from "../../../../vox/math/IVector3D";
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import IAABB from "../../../../vox/geom/IAABB";
import IMatrix4 from "../../../../vox/math/IMatrix4";

import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoMath } from "../../../math/ICoMath";
declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;

class NormalEntityLayout {

	private m_scaleV: IVector3D = null;
	private m_tempMat: IMatrix4 = null;
	private m_currMat: IMatrix4 = null;
	private m_aabb: IAABB = null;
	private m_sizeScale: number = 1.0;
	constructor() { }

	initialize(): void {
		this.m_scaleV = CoRScene.createVec3();
		this.m_tempMat = CoRScene.createMat4();
		this.m_currMat = CoRScene.createMat4();
		this.m_aabb = CoRScene.createAABB();
		this.m_scaleV = CoRScene.createVec3();
	}
	getAABB(): IAABB {
		return this.m_aabb;
	}

	calcAABB(entities: ITransformEntity[], transforms: IMatrix4[]): IAABB {

		let mat: IMatrix4 = this.m_tempMat;
		let transform: IMatrix4;
		let currMat: IMatrix4 = this.m_currMat;
		let aabb: IAABB = this.m_aabb;
		for (let k: number = 0; k < entities.length; ++k) {

			// transform = transforms[ k ];
			// if(transform != null) {

			// 	mat.identity();
			// 	mat.setRotationEulerAngle(0.5 * Math.PI, 0.0,0.0);
			// 	currMat.copyFrom(transform);
			// 	currMat.append(mat);				
			// 	entities[k].getTransform().setParentMatrix(currMat);
			// 	entities[k].update();
			// }
			entities[k].update();
			if (k > 0) aabb.union(entities[k].getGlobalBounds());
			else aabb.copyFrom(entities[k].getGlobalBounds());
		}
		aabb.update();
		return aabb;
	}
	rotationEnabled: boolean = false;
	fixToPosition(entities: ITransformEntity[], transforms: IMatrix4[], fixV3: IVector3D, baseSize: number = 300.0): void {

		let mat = this.m_tempMat;
		let transform: IMatrix4;
		let currMat = this.m_currMat;
		let aabb = this.m_aabb;
		for (let k = 0; k < entities.length; ++k) {

			transform = transforms[k];
			mat.identity();
			if (this.rotationEnabled) {
				mat.setRotationEulerAngle(0.5 * Math.PI, 0.0, 0.0);
			}
			if (transform != null) {

				currMat.copyFrom(transform);
				currMat.append(mat);
				entities[k].getTransform().setParentMatrix(currMat);
			} else {
				currMat.copyFrom(mat);
				entities[k].getTransform().setParentMatrix(currMat);
			}
			entities[k].update();
			if (k > 0) aabb.union(entities[k].getGlobalBounds());
			else aabb.copyFrom(entities[k].getGlobalBounds());
		}
		aabb.update();

		let sx = baseSize / aabb.getWidth();
		let sy = baseSize / aabb.getHeight();
		let sz = baseSize / aabb.getLong();

		sx = Math.min(sx, sy, sz);
		this.m_sizeScale = sx;
		this.m_scaleV.setXYZ(sx, sx, sx);
		let cv = aabb.center;
		let offsetV = CoRScene.createVec3(fixV3.x - cv.x, fixV3.y - cv.y, fixV3.z - cv.z);
		offsetV.scaleBy(sx);

		for (let k = 0; k < entities.length; ++k) {
			transform = transforms[k];
			mat.identity();
			mat.setScale(this.m_scaleV);
			if (this.rotationEnabled) {
				mat.setRotationEulerAngle(0.5 * Math.PI, 0.0, 0.0);
			}
			mat.setTranslation(offsetV);
			if (transform != null) {
				currMat.copyFrom(transform);
				currMat.append(mat);
				// entities[k].getTransform().setParentMatrix(currMat);
			} else {
				currMat.copyFrom(mat);
				// entities[k].getTransform().setParentMatrix(currMat);
			}
			// let params = currMat.decompose(CoMath.OrientationType.EULER_ANGLES);
			entities[k].getTransform().setParentMatrix(null);
			entities[k].setScale3(this.m_scaleV);
			entities[k].setPosition(offsetV);
			entities[k].update();
			if (k > 0) aabb.union(entities[k].getGlobalBounds());
			else aabb.copyFrom(entities[k].getGlobalBounds());
		}
		aabb.update();
	}
	getSizeScale(): number {
		return this.m_sizeScale;
	}
}

export { NormalEntityLayout };
