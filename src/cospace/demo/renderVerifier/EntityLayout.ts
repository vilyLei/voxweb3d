import Vector3D from "../../../vox/math/Vector3D";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import AABB from "../../../vox/geom/AABB";
import Matrix4 from "../../../vox/math/Matrix4";
import BoxFrame3D from "../../../vox/entity/BoxFrame3D";

class EntityLayout {

	constructor() { }

	private m_scaleV: Vector3D = new Vector3D();
	private m_tempMat: Matrix4 = new Matrix4();
	private m_currMat: Matrix4 = new Matrix4();
	private m_aabb: AABB = new AABB();
	private m_sizeScale: number = 1.0;
	getAABB(): AABB {
		return this.m_aabb;
	}
	
	calcAABB(entities: DisplayEntity[], transforms: Matrix4[]): AABB {

		let mat: Matrix4 = this.m_tempMat;
		let transform: Matrix4;
		let currMat: Matrix4 = this.m_currMat;
		let aabb: AABB = this.m_aabb;
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
	fixToPosition(entities: DisplayEntity[], transforms: Matrix4[], fixV3: Vector3D, baseSize: number = 300.0): void {

		let mat: Matrix4 = this.m_tempMat;
		let transform: Matrix4;
		let currMat: Matrix4 = this.m_currMat;
		let aabb: AABB = this.m_aabb;
		for (let k: number = 0; k < entities.length; ++k) {

			transform = transforms[ k ];
			mat.identity();
			mat.setRotationEulerAngle(0.5 * Math.PI, 0.0,0.0);
			if(transform != null) {

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
		let offsetV: Vector3D = new Vector3D(fixV3.x - cv.x, fixV3.y - cv.y, fixV3.z - cv.z);
		offsetV.scaleBy(sx);

		for (let k: number = 0; k < entities.length; ++k) {
			transform = transforms[k];
			mat.identity();
			mat.setScale( this.m_scaleV );
			mat.setRotationEulerAngle( 0.5 * Math.PI, 0.0, 0.0 );
			mat.setTranslation( offsetV );
			if(transform != null) {
				currMat.copyFrom( transform );
				currMat.append( mat );				
				entities[k].getTransform().setParentMatrix(currMat);
			} else {
				currMat.copy(mat);
				entities[k].getTransform().setParentMatrix(currMat);
			}
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

export { EntityLayout };
