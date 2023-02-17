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

import { ISphereMeshBuilder } from "./build/ISphereMeshBuilder";
import { SphereMeshBuilder } from "./build/SphereMeshBuilder";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

const plane: IPlaneMeshBuilder = new PlaneMeshBuilder();
const line: ILineMeshBuilder = new LineMeshBuilder();
const cone: IConeMeshBuilder = new ConeMeshBuilder();
const box: IBoxMeshBuilder = new BoxMeshBuilder();
const sphere: ISphereMeshBuilder = new SphereMeshBuilder();

function createDataMesh(): IDataMesh {
	if(typeof CoRScene !== "undefined") {
		return CoRScene.createDataMesh();
	}
	return null;
}

function createRawMesh(): IRawMesh {
	if(typeof CoRScene !== "undefined") {
		return CoRScene.createRawMesh();
	}
	return null;
}
function createBoundsMesh(): IBoundsMesh {
	if(typeof CoRScene !== "undefined") {
		return CoRScene.createBoundsMesh();
	}
	return null;
}

export {
	
	plane,
	line,
	cone,
	box,
	sphere,

	createDataMesh,
	createRawMesh,
	createBoundsMesh
};
