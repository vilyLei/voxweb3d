import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";

import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";
import { PlaneMeshBuilder } from "./build/PlaneMeshBuilder";
import { ILineMeshBuilder } from "./build/ILineMeshBuilder";
import { LineMeshBuilder } from "./build/LineMeshBuilder";

import { IConeMeshBuilder } from "./build/IConeMeshBuilder";
import { ConeMeshBuilder } from "./build/ConeMeshBuilder";

import { IBoxMeshBuilder } from "./build/IBoxMeshBuilder";
import { BoxMeshBuilder } from "./build/BoxMeshBuilder";

import IBoundsMesh from "../../vox/mesh/IBoundsMesh";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

const plane: IPlaneMeshBuilder = new PlaneMeshBuilder();
const line: ILineMeshBuilder = new LineMeshBuilder();
const cone: IConeMeshBuilder = new ConeMeshBuilder();
const box: IBoxMeshBuilder = new BoxMeshBuilder();

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
	
	plane,
	line,
	cone,
	box,

	createDataMesh,
	createRawMesh,
	createBoundsMesh
};
