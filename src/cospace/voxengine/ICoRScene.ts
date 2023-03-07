import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IColor4 from "../../vox/material/IColor4";
import IAABB from "../../vox/geom/IAABB";

import IRendererParam from "../../vox/scene/IRendererParam";
import IRendererScene from "../../vox/scene/IRendererScene";
import IEvtNode from "../../vox/event/IEvtNode";

import IROTransform from "../../vox/display/IROTransform";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import ISelectionEvent from "../../vox/event/ISelectionEvent";
import ITransformEntity from "../../vox/entity/ITransformEntity";
import IMouseEventEntity from "../../vox/entity/IMouseEventEntity";
import IBoundsEntity from "../../vox/entity/IBoundsEntity";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";

import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { IMaterial } from "../../vox/material/IMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IColorMaterial from "../../vox/material/mcase/IColorMaterial";
import IDefault3DMaterial from "../../vox/material/mcase/IDefault3DMaterial";
import { ICoMouseEvent } from "./event/ICoMouseEvent";
import { ICoKeyboardEvent } from "./event/ICoKeyboardEvent";
import { ICoKeyboard } from "./ui/ICoKeyboard";

import { CoGeomDataType, CoTextureDataUnit, CoGeomDataUnit } from "../app/CoSpaceAppData";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";
import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import { CoRendererDevice } from "./render/CoRendererDevice";
import { CoRendererState } from "./render/CoRendererState";
import CoVtxBufConst from "./mesh/CoVtxBufConst";
import IRendererSceneGraph from "../../vox/scene/IRendererSceneGraph";
import IProgressDataEvent from "../../vox/event/IProgressDataEvent";
import IVtxDrawingInfo from "../../vox/render/vtx/IVtxDrawingInfo";

interface CoVec3 {

	ONE: IVector3D;
	ZERO: IVector3D;
	X_AXIS: IVector3D;
	Y_AXIS: IVector3D;
	Z_AXIS: IVector3D;

	/**
	 * 右手法则(为正)
	 */
	Cross(a: IVector3D, b: IVector3D, result: IVector3D): void;
	// (va1 - va0) 叉乘 (vb1 - vb0), 右手法则(为正)
	CrossSubtract(va0: IVector3D, va1: IVector3D, vb0: IVector3D, vb1: IVector3D, result: IVector3D): void;
	Subtract(a: IVector3D, b: IVector3D, result: IVector3D): void;
	DistanceSquared(a: IVector3D, b: IVector3D): number;
	DistanceXYZ(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): number;
	Distance(v0: IVector3D, v1: IVector3D): number;
	/**
	 * get angle degree between two IVector3D objects
	 * @param v0 src IVector3D object
	 * @param v1 dst IVector3D object
	 * @returns angle degree
	 */
	AngleBetween(v0: IVector3D, v1: IVector3D): number;
	/**
	 * get angle radian between two IVector3D objects
	 * @param v0 src IVector3D object
	 * @param v1 dst IVector3D object
	 * @returns angle radian
	 */
	RadianBetween(v0: IVector3D, v1: IVector3D): number;
	RadianBetween2(v0: IVector3D, v1: IVector3D): number;
	Reflect(iv: IVector3D, nv: IVector3D, rv: IVector3D): void;/**
	* 逆时针转到垂直
	*/
	VerticalCCWOnXOY(v: IVector3D): void;
	/**
	 * 顺时针转到垂直
	 */
	VerticalCWOnXOY(v: IVector3D): void;
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


interface CoTextureConst {
	readonly WRAP_REPEAT: number;// = 3001;
	readonly WRAP_CLAMP_TO_EDGE: number;// = 3002;
	readonly WRAP_MIRRORED_REPEAT: number;// = 3003;
	readonly NEAREST: number;// = 4001;
	readonly LINEAR: number;// = 4002;
	readonly LINEAR_MIPMAP_LINEAR: number;// = 4003;
	readonly NEAREST_MIPMAP_NEAREST: number;// = 4004;
	readonly LINEAR_MIPMAP_NEAREST: number;// = 4005;
	readonly NEAREST_MIPMAP_LINEAR: number;// = 4006;
	GetConst(gl: any, param: number): number;
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
interface CoRenderDrawMode {
	ELEMENTS_TRIANGLES: number;
	ELEMENTS_TRIANGLE_STRIP: number;
	ELEMENTS_TRIANGLE_FAN: number;
	ELEMENTS_INSTANCED_TRIANGLES: number;
	ARRAYS_LINES: number;
	ARRAYS_LINE_STRIP: number;
	ARRAYS_POINTS: number;
	ELEMENTS_LINES: number;
	DISABLE: number;
}

interface COEventBase {
	readonly RESIZE: number;
	readonly ENTER_FRAME: number;
}

interface CoSelectionEvent {
	readonly SELECT: number;
}
interface CoProgressDataEvent {
	readonly PROGRESS: number;
}
interface ICoRScene {

	RendererDevice: CoRendererDevice;
	RendererState: CoRendererState;
	RenderDrawMode: CoRenderDrawMode;
	VtxBufConst: CoVtxBufConst;
	TextureConst: CoTextureConst;

	Vector3D: CoVec3;
	MouseEvent: ICoMouseEvent;
	EventBase: COEventBase;
	SelectionEvent: CoSelectionEvent;
	ProgressDataEvent: CoProgressDataEvent;
	KeyboardEvent: ICoKeyboardEvent;
	Keyboard: ICoKeyboard;

	ShaderCodeUUID: CoShaderCodeUUID;
	MaterialContextParam: CoMaterialContextParam;
	MaterialPipeType: CoMaterialPipeType;

	createSelectionEvent(): ISelectionEvent;
	createProgressDataEvent(): IProgressDataEvent;
	/**
	 * create a Vector3D instance
	 * @param px the default vaue is 0.0
	 * @param py the default vaue is 0.0
	 * @param pz the default vaue is 0.0
	 * @param pw the default vaue is 1.0
	 */
	createVec3(px?: number, py?: number, pz?: number, pw?: number): IVector3D;
	/**
	 * create a Mattrix4 instance
	 * @param pfs32 the default value is null
	 * @param index the default value is 0
	 */
	createMat4(pfs32?: Float32Array, index?: number): IMatrix4;
	/**
	 * set Color4 instance
	 * @param pr the default vaue is 1.0
	 * @param pg the default vaue is 1.0
	 * @param pb the default vaue is 1.0
	 * @param pa the default vaue is 1.0
	 */
	createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4;
	createAABB(): IAABB;

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

	createMouseEvt3DDispatcher(): IEvtDispatcher;
	createEventBaseDispatcher(): IEvtDispatcher;

	createVtxDrawingInfo(): IVtxDrawingInfo;
	/**
	 * build default 3d entity rendering material
	 * @param normalEnabled the default value is false
	 */
	createDefaultMaterial(normalEnabled?: boolean): IDefault3DMaterial;
	/**
	 * build 3d line entity rendering material
	 * @param dynColorEnabled the default value is false
	 */
	createLineMaterial(dynColorEnabled?: boolean): IColorMaterial;
	/**
	 * build 3d quad line entity rendering material
	 * @param dynColorEnabled the default value is false
	 */
	createQuadLineMaterial(dynColorEnabled?: boolean): IColorMaterial;
	createShaderMaterial(shd_uniqueName: string): IShaderMaterial;
	createMaterial(dcr: IMaterialDecorator): IMaterial;

	createDataMesh(): IDataMesh;
	createRawMesh(): IRawMesh;
	createBoundsMesh(): IBoundsMesh;
	/**
	 * @param model geometry model data
	 * @param material IRenderMaterial instance, the default value is null.
	 * @param texEnabled the default value is false;
	 */
	createDataMeshFromModel(model: CoGeomDataType, material?: IRenderMaterial, texEnabled?: boolean): IDataMesh;
	/**
	 * @param model geometry model data
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param texEnabled texture enabled in the material, the default is false.
	 */
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
	/**
	 * @param minV min position value
	 * @param maxV max position value
	 * @param transform IROTransform instance, its default is null
	 */
	createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D, transform?: IROTransform): ITransformEntity;
	/**
	 * @param size th default value is 100.0
	 * @param transform IROTransform instance, its default is null
	 */
	createAxis3DEntity(size?: number, transform?: IROTransform): ITransformEntity;
	/**
	 * @param size th default value is 100.0
	 * @param transform IROTransform instance, its default is null
	 */
	 createCrossAxis3DEntity(size?: number, transform?: IROTransform): ITransformEntity;

	/**
	 * @param model IDataMesh instance
	 * @param material IRenderMaterial instance.
	 * @param texEnabled use texture yes or no, the default value is false
	 */
	createDisplayEntityWithDataMesh(mesh: IDataMesh, material: IRenderMaterial, texEnabled?: boolean): ITransformEntity;
	/**
	 * @param transform the default value is false
	 */
	createDisplayEntity(transform?: IROTransform): ITransformEntity;
	/**
	 * @param transform the default value is false
	 */
	createMouseEventEntity(transform?: IROTransform): IMouseEventEntity;
	/**
	 * @param transform the default value is false
	 */
	createBoundsEntity(transform?: IROTransform): IBoundsEntity;
	createDisplayEntityContainer(): IDisplayEntityContainer;

	creatMaterialContextParam(): CoMaterialContextParam;
	createMaterialContext(): IMaterialContext;
	/**
	 * 逆时针转到垂直
	 */
	VerticalCCWOnXOY(v: IVector3D): void;
	/**
	 * 顺时针转到垂直
	 */
	VerticalCWOnXOY(v: IVector3D): void;

	createRendererSceneGraph(): IRendererSceneGraph;
	
	createEvtNode(): IEvtNode;
}
export { CoMaterialPipeType, CoShaderCodeUUID, CoProgressDataEvent, CoSelectionEvent, COEventBase, CoTextureConst, CoRenderDrawMode, CoVec3, CoMaterialContextParam, ICoRScene };
