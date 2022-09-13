import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IAABB from "../../vox/geom/IAABB";
import IAABB2D from "../../vox/geom/IAABB2D";
import AABB2D from "../../vox/geom/AABB2D";
import MathConst from "../../vox/math/MathConst";
import OrientationType from "../../vox/math/OrientationType";

import {
	isZero,
	isNotZero,
	isGreaterPositiveZero,
	isLessNegativeZero,
	isLessPositiveZero,
	isGreaterNegativeZero,
	isPostiveZero,
	isNegativeZero,
	isGreaterRealZero,
	isLessRealZero
} from "../../vox/math/Float";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

function createVec3(px: number = 0.0, py: number = 0.0, pz: number = 0.0, pw: number = 1.0): IVector3D {
	return CoRScene.createVec3(px, py, pz, pw);
}
function createMat4(pfs32: Float32Array = null, index: number = 0): IMatrix4 {
	return CoRScene.createMat4(pfs32, index);
}
function createAABB(): IAABB {
	return CoRScene.createAABB();
}
function createAABB2D(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0): IAABB2D {
	return new AABB2D(px,py,pwidth, pheight);
}

const Vector3D = CoRScene.Vector3D;
export {
	Vector3D,
	createVec3,
	createMat4,
	createAABB,
	createAABB2D,
	MathConst,
	OrientationType,

	isZero,
	isNotZero,
	isGreaterPositiveZero,
	isLessNegativeZero,
	isLessPositiveZero,
	isGreaterNegativeZero,
	isPostiveZero,
	isNegativeZero,
	isGreaterRealZero,
	isLessRealZero
};
