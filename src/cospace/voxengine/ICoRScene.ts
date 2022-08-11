import IVector3D from "../../vox/math/IVector3D";
import { IMatrix4 } from "../../vox/math/IMatrix4";
import IColor4 from "../../vox/material/IColor4";

import IRendererParam from "../../vox/scene/IRendererParam";
import { ICoRendererScene } from "./scene/ICoRendererScene";

import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import IMouseEventEntity from "../../vox/entity/IMouseEventEntity";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";
import { IDataMesh } from "../../vox/mesh/IDataMesh";
///*
interface CoRendererDevice {
	readonly GPU_VENDOR: string;
	readonly GPU_RENDERER: string;
	MAX_TEXTURE_SIZE: number;
	MAX_RENDERBUFFER_SIZE: number;
	MAX_VIEWPORT_WIDTH: number;
	MAX_VIEWPORT_HEIGHT: number;
	SHOWLOG_ENABLED: boolean;
	SHADERCODE_TRACE_ENABLED: boolean;
	// true: force vertex shader precision to highp
	VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED: boolean;
	// true: force fragment shader precision to highp
	FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED: boolean;
	SetWebBodyColor(rbgColorString?: string): void;
	IsMobileWeb(): boolean;
	IsWinExternalVideoCard(): boolean;
	IsWebGL1(): boolean;
	IsWebGL2(): boolean;
	IsMobileWeb(): boolean;
	IsSafariWeb(): boolean;
	IsIOS(): boolean;
	IsIpadOS(): boolean;
	IsAndroidOS(): boolean;
}
interface CoRendererState {
	readonly COLOR_MASK_ALL_TRUE: number;
	readonly COLOR_MASK_ALL_FALSE: number;
	readonly COLOR_MASK_RED_TRUE: number;
	readonly COLOR_MASK_GREEN_TRUE: number;
	readonly COLOR_MASK_BLUE_TRUE: number;
	readonly COLOR_MASK_ALPHA_TRUE: number;
	readonly COLOR_MASK_RED_FALSE: number;
	readonly COLOR_MASK_GREEN_FALSE: number;
	readonly COLOR_MASK_BLUE_FALSE: number;
	readonly COLOR_MASK_ALPHA_FALSE: number;

	readonly NORMAL_STATE: number;
	readonly BACK_CULLFACE_NORMAL_STATE: number;
	readonly FRONT_CULLFACE_NORMAL_STATE: number;
	readonly NONE_CULLFACE_NORMAL_STATE: number;
	readonly ALL_CULLFACE_NORMAL_STATE: number;
	readonly BACK_NORMAL_ALWAYS_STATE: number;
	readonly BACK_TRANSPARENT_STATE: number;
	readonly BACK_TRANSPARENT_ALWAYS_STATE: number;
	readonly NONE_TRANSPARENT_STATE: number;
	readonly NONE_TRANSPARENT_ALWAYS_STATE: number;
	readonly FRONT_CULLFACE_GREATER_STATE: number;
	readonly BACK_ADD_BLENDSORT_STATE: number;
	readonly BACK_ADD_ALWAYS_STATE: number;
	readonly BACK_ALPHA_ADD_ALWAYS_STATE: number;
	readonly NONE_ADD_ALWAYS_STATE: number;
	readonly NONE_ADD_BLENDSORT_STATE: number;
	readonly NONE_ALPHA_ADD_ALWAYS_STATE: number;
	readonly FRONT_ADD_ALWAYS_STATE: number;
	readonly FRONT_TRANSPARENT_STATE: number;
	readonly FRONT_TRANSPARENT_ALWAYS_STATE: number;
	readonly NONE_CULLFACE_NORMAL_ALWAYS_STATE: number;
	readonly BACK_ALPHA_ADD_BLENDSORT_STATE: number;
}
//*/
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
	RendererState: CoRendererState;
	RendererDevice: CoRendererDevice;
	createVec3(px?: number, py?: number, pz?: number, pw?: number): IVector3D;
	createMat4(pfs32?: Float32Array, index?: number): IMatrix4;

	createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4;

	/**
	 * @param div HTMLDivElement instance, the default value is null.
	 */
	createRendererSceneParam(div?: HTMLDivElement): IRendererParam;
	/**
	 * @param rparam IRendererParam instance, the default value is null.
	 * @param renderProcessesTotal the default value is 3.
	 * @param sceneBlockEnabled the default value is true.
	 */
	createRendererScene(rparam?: IRendererParam, renderProcessesTotal?: number, sceneBlockEnabled?: boolean): ICoRendererScene;
	applySceneBlock(rsecne: ICoRendererScene): void;

	createMouseEvt3DDispatcher(): IEvtDispatcher;

	/**
	 * build default 3d entity rendering material
	 * @param normalEnabled the default value is false
	 */
	createDefaultMaterial(normalEnabled?: boolean): IRenderMaterial;
	createShaderMaterial(shd_uniqueName: string): IShaderMaterial;


	createDataMesh(): IDataMesh;
	/**
	 * @param model geometry model
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	createDataMeshFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, vbWhole?: boolean): IDataMesh;
	/**
	 * @param model geometry model
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, vbWhole?: boolean): ITransformEntity;
	createAxis3DEntity(size?: number): ITransformEntity;

	createDisplayEntity(): ITransformEntity;
	createMouseEventEntity(): IMouseEventEntity;

	createMaterialContext(): IMaterialContext;
	creatMaterialContextParam(): CoMaterialContextParam;
}
export { CoMaterialContextParam, ICoRScene };
