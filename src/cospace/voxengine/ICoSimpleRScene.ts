import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IColor4 from "../../vox/material/IColor4";

import IRendererParam from "../../vox/scene/IRendererParam";
import IRendererScene from "../../vox/scene/IRendererScene";

import ITransformEntity from "../../vox/entity/ITransformEntity";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";
// import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import { CoRendererDevice } from "./render/CoRendererDevice";
import { CoRendererState } from "./render/CoRendererState";
import IROTransform from "../../vox/display/IROTransform";

interface CoVec3 {
	ONE: IVector3D;
	ZERO: IVector3D;
	X_AXIS: IVector3D;
	Y_AXIS: IVector3D;
	Z_AXIS: IVector3D;
	Distance(va: IVector3D, vb: IVector3D): number;
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
interface ICoSimpleRScene {

	Vector3D: CoVec3;
	ShaderCodeUUID: CoShaderCodeUUID;
	MaterialContextParam: CoMaterialContextParam;
	MaterialPipeType: CoMaterialPipeType;
	RendererState: CoRendererState;
	RendererDevice: CoRendererDevice;
	createVec3(px?: number, py?: number, pz?: number, pw?: number): IVector3D;
	createMat4(pfs32?: Float32Array, index?: number): IMatrix4;

	createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4;

	applySceneBlock(rsecne: IRendererScene): void;
	/**
	 * @param div HTMLDivElement instance, the default value is null.
	 */
	createRendererSceneParam(div?: HTMLDivElement): IRendererParam;
	/**
	 * @param rparam IRendererParam instance, the default value is null.
	 * @param renderProcessesTotal the default value is 3.
	 * @param sceneBlockEnabled the default value is true.
	 */
	createRendererScene(rparam?: IRendererParam, renderProcessesTotal?: number, sceneBlockEnabled?: boolean): IRendererScene;
	setRendererScene(rs: IRendererScene): void;
	getRendererScene(): IRendererScene;

	/**
	 * build default 3d entity rendering material
	 * @param normalEnabled the default value is false
	 */
	createDefaultMaterial(normalEnabled?: boolean): IRenderMaterial;
	createShaderMaterial(shd_uniqueName: string): IShaderMaterial;


	// createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;
	/**
	 * @param model geometry model
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	// createDataMeshFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, vbWhole?: boolean): IDataMesh;
	/**
	 * @param model geometry model
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	// createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, vbWhole?: boolean): ITransformEntity;

	/**
	 * @param minV a 3d position, IVector3D instance
	 * @param maxV a 3d position, IVector3D instance
	 * @param transform the default value is null
	 */
	createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D, transform?: IROTransform): ITransformEntity;

	/**
	 * @param size the default value is 100.0
	 * @param transform the default value is null
	 */
	createAxis3DEntity(size?: number, transform?: IROTransform): ITransformEntity;

	/**
	 * @param size the default value is 100.0
	 * @param transform the default value is null
	 */
	createCrossAxis3DEntity(size: number, transform?: IROTransform): ITransformEntity;
	
	createDisplayEntity(): ITransformEntity;

	createMaterialContext(): IMaterialContext;
	creatMaterialContextParam(): CoMaterialContextParam;
}
export { CoMaterialContextParam, ICoSimpleRScene };
