import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IAABB from "../../vox/geom/IAABB";

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

export {
	createVec3,
	createMat4,
	createAABB,
};
