import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";

import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";
import { PlaneMeshBuilder } from "./build/PlaneMeshBuilder";
import { ILineMeshBuilder } from "./build/ILineMeshBuilder";
import { LineMeshBuilder } from "./build/LineMeshBuilder";

import { IConeMeshBuilder } from "./build/IConeMeshBuilder";
import { ConeMeshBuilder } from "./build/ConeMeshBuilder";

import IBoundsMesh from "../../vox/mesh/IBoundsMesh";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

const planeMeshBuilder: IPlaneMeshBuilder = new PlaneMeshBuilder();
const lineMeshBuilder: ILineMeshBuilder = new LineMeshBuilder();
const coneMeshBuilder: IConeMeshBuilder = new ConeMeshBuilder();

function createDataMesh(): IDataMesh {
	return CoRScene.createDataMesh();
}

function createRawMesh(): IRawMesh {
	return CoRScene.createRawMesh();
}
function createBoundsMesh(): IBoundsMesh {
	return CoRScene.createBoundsMesh();
}

export {
	
	planeMeshBuilder,
	lineMeshBuilder,
	coneMeshBuilder,

	createDataMesh,
	createRawMesh,
	createBoundsMesh
};
