import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import ITransformEntity from "../../vox/entity/ITransformEntity";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;


function createDataMesh(): IDataMesh {
	return CoRScene.createDataMesh();
}

function createRawMesh(): IRawMesh {
	return CoRScene.createRawMesh();
}
function createCrossAxis3DEntity(size: number = 100): ITransformEntity {
	let min = -0.5 * size;
	let max = 0.5 * size;
	return CoRScene.createFreeAxis3DEntity(CoRScene.createVec3(min,min,min), CoRScene.createVec3(max,max,max));
}

export {
	createDataMesh,
	createRawMesh,
	createCrossAxis3DEntity,
};
