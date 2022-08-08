
import IVector3D from "../../vox/math/IVector3D";
import { IMatrix4 } from "../../vox/math/IMatrix4";

import IRendererParam from "../../vox/scene/IRendererParam";
import { ICoRendererScene } from "./scene/ICoRendererScene";

import { ICoDisplayEntity } from "./engine/ICoDisplayEntity";
import { IShaderMaterial } from "./material/IShaderMaterial";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";

interface ICoRScene {

	createVec3(px: number, py: number, pz: number, pw?: number): IVector3D;
	createMat4(pfs32?: Float32Array, index?: number): IMatrix4;
	createRendererSceneParam(div?: HTMLDivElement): IRendererParam;
	createRendererScene(): ICoRendererScene;

	createShaderMaterial(shd_uniqueName: string): IShaderMaterial;
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IShaderMaterial): ICoDisplayEntity;
	createAxis3DEntity(size?: number): ICoDisplayEntity;
}
export { ICoRScene }
