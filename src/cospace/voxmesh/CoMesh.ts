import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import ITransformEntity from "../../vox/entity/ITransformEntity";

import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";
import { PlaneMeshBuilder } from "./build/PlaneMeshBuilder";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

const planeMeshBuilder: IPlaneMeshBuilder = new PlaneMeshBuilder();

function createDataMesh(): IDataMesh {
	return CoRScene.createDataMesh();
}

function createRawMesh(): IRawMesh {
	return CoRScene.createRawMesh();
}
function createBoundsMesh(): IBoundsMesh {
	return CoRScene.createBoundsMesh();
}

function createCrossAxis3DEntity(size: number = 100): ITransformEntity {
	let min = -0.5 * size;
	let max = 0.5 * size;
	return CoRScene.createFreeAxis3DEntity(CoRScene.createVec3(min,min,min), CoRScene.createVec3(max,max,max));
}
export {
	planeMeshBuilder,
	createDataMesh,
	createRawMesh,
	createBoundsMesh,
	createCrossAxis3DEntity,
};
