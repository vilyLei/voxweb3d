import IVector3D from "../../vox/math/IVector3D";
import { IMatrix4 } from "../../vox/math/IMatrix4";
import IColor4 from "../../vox/material/IColor4";

import IRendererParam from "../../vox/scene/IRendererParam";
import { ICoRendererScene } from "./scene/ICoRendererScene";

import { ICoDisplayEntity } from "./entity/ICoDisplayEntity";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";
import { IDataMesh } from "../../vox/mesh/IDataMesh";

interface CoVec3 {
	ONE: IVector3D;
	ZERO: IVector3D;
	X_AXIS: IVector3D;
	Y_AXIS: IVector3D;
	Z_AXIS: IVector3D;
	Distance(va: IVector3D, vb: IVector3D): number;
}

interface CoMouseEvent {
	readonly MOUSE_DOWN: number;
	readonly MOUSE_UP: number;
	readonly MOUSE_RIGHT_UP: number;
	readonly MOUSE_RIGHT_DOWN: number;
	readonly MOUSE_MOVE: number;
	readonly MOUSE_WHEEL: number;
	readonly MOUSE_OVER: number;
	readonly MOUSE_OUT: number;
	readonly MOUSE_CLICK: number;
	readonly MOUSE_RIGHT_CLICK: number;
	readonly MOUSE_DOUBLE_CLICK: number;
	readonly MOUSE_CANCEL: number;
	readonly MOUSE_MULTI_DOWN: number;
	readonly MOUSE_MULTI_UP: number;
	readonly MOUSE_MULTI_MOVE: number;
	readonly MOUSE_BG_DOWN: number; //  mouse down do not hit any 3d object, only in stage
	readonly MOUSE_BG_UP: number; //  mouse up do not hit any 3d object, only in stage
	readonly MOUSE_BG_CLICK: number; //  mouse up do not hit any 3d object, only in stage
}

interface CoShaderCodeUUID {
	/**
	 * nothing shader code object
	 */
	None: string;
	/**
	 * the default value is PBR light shader code object that it comes from the system shader lib.
	 */
	Default: string;
	/**
	 * lambert light shader code object that it comes from the system shader lib.
	 */
	Lambert: string;
	/**
	 * PBR light shader code object that it comes from the system shader lib.
	 */
	PBR: string;
}

interface CoMaterialContextParam {

    pointLightsTotal: number;
    directionLightsTotal: number;
    spotLightsTotal: number;
    vsmFboIndex: number;
    vsmEnabled: boolean;
    loadAllShaderCode: boolean;
    shaderCodeBinary: boolean;
    shaderLibVersion: string;
    shaderFileNickname: boolean;

    lambertMaterialEnabled: boolean;
    pbrMaterialEnabled: boolean;
    /**
     * 生产 二进制 glsl代码文件
     */
    buildBinaryFile: boolean;

}

interface CoMaterialPipeType {
	ENV_LIGHT_PARAM: number;
    ENV_AMBIENT_LIGHT: number;
    FOG: number;
    FOG_EXP2: number;
    VSM_SHADOW: number;
    GLOBAL_LIGHT: number;
}

interface ICoRScene {

	Vector3D: CoVec3;
	MouseEvent: CoMouseEvent;
	ShaderCodeUUID: CoShaderCodeUUID;
	MaterialContextParam: CoMaterialContextParam;
	MaterialPipeType: CoMaterialPipeType;

	createVec3(px?: number, py?: number, pz?: number, pw?: number): IVector3D;
	createMat4(pfs32?: Float32Array, index?: number): IMatrix4;
	
	createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4;

	createRendererSceneParam(div?: HTMLDivElement): IRendererParam;
	createRendererScene(): ICoRendererScene;
	applySceneBlock(rsecne: ICoRendererScene): void;
	/**
	 * build default 3d entity rendering material
	 * @param normalEnabled the default value is false
	 */
	createDefaultMaterial(normalEnabled?: boolean): IRenderMaterial;
	createShaderMaterial(shd_uniqueName: string): IShaderMaterial;
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial): ICoDisplayEntity;
	createAxis3DEntity(size?: number): ICoDisplayEntity;

	createDisplayEntity(): ICoDisplayEntity;
	createDataMesh(): IDataMesh;

	createMaterialContext(): IMaterialContext;
	creatMaterialContextParam(): CoMaterialContextParam;
}
export { CoMaterialContextParam, ICoRScene };
