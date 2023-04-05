import Vector3D from "../math/Vector3D";
import ITransformEntity from "../entity/ITransformEntity";
import AABB from "../geom/AABB";
import Matrix4 from "..//math/Matrix4";
import OrientationType from "../math/OrientationType";


class EntityLayouter {

	private m_scaleV: Vector3D = null;
	private m_tempMat: Matrix4 = null;
	private m_currMat: Matrix4 = null;
	private m_aabb: AABB = null;
	private m_sizeScale: number = 1.0;
	private m_entities: ITransformEntity[] = [];
	private m_transforms: Matrix4[] = [];

	constructor() { }
	private initialize(): void {
		if(this.m_scaleV == null) {
			this.m_scaleV = new Vector3D();
			this.m_tempMat = new Matrix4();
			this.m_currMat = new Matrix4();
			this.m_aabb = new AABB();
		}
	}
	getAABB(): AABB {
		return this.m_aabb;
	}

	layoutReset(): void {
		this.m_sizeScale = 1.0;
		this.m_scaleV = null;
		this.initialize();
		this.m_entities = [];
		this.m_transforms = [];
		// console.log("layoutReset(), m_entities: ", this.m_entities);
	}
	getEntities(): ITransformEntity[] {
		// console.log("getEntities(), this.m_entities: ", this.m_entities);
		return this.m_entities;
	}
	layoutAppendItem(entity: ITransformEntity, transform: Matrix4): void {
		this.m_entities.push(entity);
		this.m_transforms.push(transform);
		// console.log("layoutAppendItem(), entity: ", entity);
	}	
	layoutUpdate(fixSize: number = 300.0, pivot: Vector3D = null, rotationEnabled: boolean = false): void {
		
		this.rotationEnabled = rotationEnabled;
		for (let k = 0; k < this.m_entities.length; ++k) {
			let et = this.m_entities[k];
			et.setXYZ(0.0, 0.0, 0.0);
			et.setScaleXYZ(1.0, 1.0, 1.0);
			et.setRotationXYZ(0.0, 0.0, 0.0);
		}
		if(pivot == null) pivot = new Vector3D();
		
		this.fixToPosition(this.m_entities, this.m_transforms, pivot, fixSize);
	}

	calcAABB(entities: ITransformEntity[], transforms: Matrix4[]): AABB {
		this.initialize();
		let aabb = this.m_aabb;
		for (let k: number = 0; k < entities.length; ++k) {
			entities[k].update();
			if (k > 0) aabb.union(entities[k].getGlobalBounds());
			else aabb.copyFrom(entities[k].getGlobalBounds());
		}
		aabb.update();
		return aabb;
	}
	rotationEnabled: boolean = false;
	fixToPosition(entities: ITransformEntity[], transforms: Matrix4[], fixV3: Vector3D, baseSize: number = 300.0): void {
		this.initialize();
		let mat = this.m_tempMat;
		let transform: Matrix4;
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

		// console.log("AAA xxxxxxxxx aabb: ", aabb);
		// console.log("AAA xxxxxxxxx baseSize: ", baseSize);
		// console.log("AAA xxxxxxxxx cv: ", aabb.center.clone());
		// console.log("AAA xxxxxxxxx fixV3: ", fixV3.clone());
		let sx = baseSize / aabb.getWidth();
		let sy = baseSize / aabb.getHeight();
		let sz = baseSize / aabb.getLong();

		sx = Math.min(sx, sy, sz);
		// console.log("AAA xxxxxxxxx sx: ", sx);
		this.m_sizeScale = sx;
		this.m_scaleV.setXYZ(sx, sx, sx);
		// let cv = aabb.center;
		// let offsetV = new Vector3D(fixV3.x - cv.x, fixV3.y - cv.y, fixV3.z - cv.z);
		// offsetV.scaleBy(sx);
		// console.log("BBB xxxxxxxxx aabb: ", aabb);
		// console.log("BBB xxxxxxxxx m_scaleV: ", this.m_scaleV);
		// console.log("BBB xxxxxxxxx offsetV: ", offsetV.clone());
		aabb.reset();
		// console.log("BBB xxxxxxxxx this.m_scaleV, offsetV: ", this.m_scaleV, offsetV);
		for (let k = 0; k < entities.length; ++k) {
			transform = transforms[k];
			mat.identity();
			mat.setScale(this.m_scaleV);
			if (this.rotationEnabled) {
				mat.setRotationEulerAngle(0.5 * Math.PI, 0.0, 0.0);
			}
			// mat.setTranslation(offsetV);
			if (transform != null) {
				currMat.copyFrom(transform);
				currMat.append(mat);
				// entities[k].getTransform().setParentMatrix(currMat);
			} else {
				currMat.copyFrom(mat);
				// entities[k].getTransform().setParentMatrix(currMat);
			}
			
			let params = currMat.decompose(OrientationType.EULER_ANGLES);
			entities[k].setScale3(params[2]);
			entities[k].setRotation3(params[1]);
			entities[k].setPosition(params[0]);

			entities[k].getTransform().setParentMatrix(null);
			entities[k].update();
			if (k > 0) aabb.union(entities[k].getGlobalBounds());
			else aabb.copyFrom(entities[k].getGlobalBounds());
		}
		aabb.update();
		let pdv = new Vector3D();
		pdv.subVecsTo(fixV3, aabb.center);

		aabb.reset();
		for (let k = 0; k < entities.length; ++k) {
			let pv = entities[k].getPosition();
			pv.addBy(pdv);
			entities[k].setPosition(pv);
			entities[k].update();
			if (k > 0) aabb.union(entities[k].getGlobalBounds());
			else aabb.copyFrom(entities[k].getGlobalBounds());
		}
		aabb.update();
		// console.log("EntityLayouter::fixToPosition(), aabb.center: ", aabb.center.clone());
	}
	getSizeScale(): number {
		return this.m_sizeScale;
	}
}

export { EntityLayouter };
