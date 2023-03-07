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
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import { CoMaterialPipeType, CoMaterialContextParam, CoShaderCodeUUID, CoProgressDataEvent, CoSelectionEvent, COEventBase, CoVec3, CoTextureConst, CoRenderDrawMode, ICoRScene } from "./ICoRScene";
import { VoxRenderer } from "./VoxRenderer";
import IVtxDrawingInfo from "../../vox/render/vtx/IVtxDrawingInfo";
declare var CoRScene: ICoRScene;

interface I_CoRScene {
}


var RendererDevice: CoRendererDevice = null;
var SelectionEvent: CoSelectionEvent = null;
var ProgressDataEvent: CoProgressDataEvent = null;
var MouseEvent: ICoMouseEvent = null;
var EventBase: COEventBase = null;
var RendererState: CoRendererState = null;

class T_CoRScene {
	private m_init = true;
	private init(): void {

		if (typeof CoRScene !== "undefined") {
			RendererDevice = CoRScene.RendererDevice;
			SelectionEvent = CoRScene.SelectionEvent;
			ProgressDataEvent = CoRScene.ProgressDataEvent;
			EventBase = CoRScene.EventBase;
			MouseEvent = CoRScene.MouseEvent;
			RendererState = CoRScene.RendererState;
		}
	}
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {

		this.m_init = !this.isEnabled();
		if (!this.m_init) {
			VoxRenderer.initialize();
			this.init();
		}
		if (this.m_init) {
			this.m_init = false;
			let flag = false;
			let total = 0;
			let urlRenderer = "";
			flag = VoxRenderer.initialize((urls: string[]): void => {
				urlRenderer = urls[0];
				total++;
				if (total > 1) {
					if (callback != null && this.isEnabled()) callback([urlRenderer, url]);
				}

			})
			if (url == "" || url === undefined) {
				url = "static/cospace/engine/rscene/CoRScene.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				VoxRenderer.initialize();
				this.init();
				if (flag) {
					total++;
					if (total > 1) {
						if (callback != null && this.isEnabled()) callback([urlRenderer, url]);
					}
				} else {
					if (callback != null && typeof CoRScene !== "undefined") callback([url]);
				}
			}).load(url);

			return true;
		}
		return false;
	}
	get RendererDevice(): CoRendererDevice {
		return CoRScene.RendererDevice;
	}
	get RendererState(): CoRendererState {
		return CoRScene.RendererState;
	}
	get RenderDrawMode(): CoRenderDrawMode {
		return CoRScene.RenderDrawMode;
	}
	get VtxBufConst(): CoVtxBufConst {
		return CoRScene.VtxBufConst;
	}
	get TextureConst(): CoTextureConst {
		return CoRScene.TextureConst;
	}

	get Vector3D(): CoVec3 {
		return CoRScene.Vector3D;
	}
	get MouseEvent(): ICoMouseEvent {
		return CoRScene.MouseEvent;
	}
	get EventBase(): COEventBase {
		return CoRScene.EventBase;
	}
	get SelectionEvent(): CoSelectionEvent {
		return CoRScene.SelectionEvent;
	}
	get ProgressDataEvent(): CoProgressDataEvent {
		return CoRScene.ProgressDataEvent;
	}
	get KeyboardEvent(): ICoKeyboardEvent {
		return CoRScene.KeyboardEvent;
	}
	get Keyboard(): ICoKeyboard {
		return CoRScene.Keyboard;
	}

	get ShaderCodeUUID(): CoShaderCodeUUID {
		return CoRScene.ShaderCodeUUID;
	}
	get MaterialContextParam(): CoMaterialContextParam {
		return CoRScene.MaterialContextParam;
	}
	get MaterialPipeType(): CoMaterialPipeType {
		return CoRScene.MaterialPipeType;
	}

	createSelectionEvent(): ISelectionEvent {
		return CoRScene.createSelectionEvent();
	}
	createProgressDataEvent(): IProgressDataEvent {
		return CoRScene.createProgressDataEvent();
	}
	/**
	 * create a Vector3D instance
	 * @param px the default vaue is 0.0
	 * @param py the default vaue is 0.0
	 * @param pz the default vaue is 0.0
	 * @param pw the default vaue is 1.0
	 */
	createVec3(px?: number, py?: number, pz?: number, pw?: number): IVector3D {
		return CoRScene.createVec3(px, py, pz, pw);
	}
	/**
	 * create a Mattrix4 instance
	   * @param pfs32 the default value is null
	   * @param index the default value is 0
	   */
	createMat4(pfs32?: Float32Array, index?: number): IMatrix4 {
		return CoRScene.createMat4(pfs32, index);
	}
	/**
	 * set Color4 instance
	 * @param pr the default vaue is 1.0
	 * @param pg the default vaue is 1.0
	 * @param pb the default vaue is 1.0
	 * @param pa the default vaue is 1.0
	 */
	createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4 {
		return CoRScene.createColor4(pr, pg, pb, pa);
	}
	createAABB(): IAABB {
		return CoRScene.createAABB();
	}

	applySceneBlock(rsecne: IRendererScene): void {
		return CoRScene.applySceneBlock(rsecne);
	}
	/**
	 * @param div HTMLDivElement instance, the default value is null.
	 */
	createRendererSceneParam(div?: HTMLDivElement): IRendererParam {
		return CoRScene.createRendererSceneParam(div);
	}
	/**
	 * @param rparam IRendererParam instance, the default value is null.
	 * @param renderProcessesTotal the default value is 3.
	 * @param sceneBlockEnabled the default value is true.
	 */
	createRendererScene(rparam?: IRendererParam, renderProcessesTotal?: number, sceneBlockEnabled?: boolean): IRendererScene {
		return CoRScene.createRendererScene(rparam, renderProcessesTotal, sceneBlockEnabled);
	}
	setRendererScene(rs: IRendererScene): void {
		return CoRScene.setRendererScene(rs);
	}
	getRendererScene(): IRendererScene {
		return CoRScene.getRendererScene();
	}

	createMouseEvt3DDispatcher(): IEvtDispatcher {
		return CoRScene.createMouseEvt3DDispatcher();
	}
	createEventBaseDispatcher(): IEvtDispatcher {
		return CoRScene.createEventBaseDispatcher();
	}
	createVtxDrawingInfo(): IVtxDrawingInfo {
		return CoRScene.createVtxDrawingInfo();
	}
	/**
	 * build default 3d entity rendering material
	 * @param normalEnabled the default value is false
	 */
	createDefaultMaterial(normalEnabled?: boolean): IDefault3DMaterial {
		return CoRScene.createDefaultMaterial();
	}
	/**
	 * build 3d line entity rendering material
	 * @param dynColorEnabled the default value is false
	 */
	createLineMaterial(dynColorEnabled?: boolean): IColorMaterial {
		return CoRScene.createLineMaterial(dynColorEnabled);
	}
	/**
	 * build 3d quad line entity rendering material
	 * @param dynColorEnabled the default value is false
	 */
	createQuadLineMaterial(dynColorEnabled?: boolean): IColorMaterial {
		return CoRScene.createQuadLineMaterial(dynColorEnabled);
	}
	createShaderMaterial(shd_uniqueName: string): IShaderMaterial {
		return CoRScene.createShaderMaterial(shd_uniqueName);
	}
	/**
	 * @param dcr the value is a IMaterialDecorator instance
	 * @returns a Material instance
	 */
	createMaterial(dcr: IMaterialDecorator): IMaterial {
		return CoRScene.createMaterial(dcr);
	}

	createDataMesh(): IDataMesh {
		return CoRScene.createDataMesh();
	}
	createRawMesh(): IRawMesh {
		return CoRScene.createRawMesh();
	}
	createBoundsMesh(): IBoundsMesh {
		return CoRScene.createBoundsMesh();
	}
	/**
	 * @param model geometry model data
	 * @param material IRenderMaterial instance, the default value is null.
	 * @param texEnabled the default value is false;
	 */
	createDataMeshFromModel(model: CoGeomDataType, material?: IRenderMaterial, texEnabled?: boolean): IDataMesh {
		return CoRScene.createDataMeshFromModel(model, material, texEnabled);
	}
	/**
	 * @param model geometry model data
	 * @param pmaterial IRenderMaterial instance, the default is null.
	 * @param texEnabled texture enabled in the material, the default is false.
	 */
	createDisplayEntityFromModel(model: CoGeomDataType, pmaterial?: IRenderMaterial, texEnabled?: boolean): ITransformEntity {
		return CoRScene.createDisplayEntityFromModel(model, pmaterial, texEnabled);
	}
	/**
	 * @param minV min position value
	 * @param maxV max position value
	 * @param transform IROTransform instance, its default is null
	 */
	createFreeAxis3DEntity(minV: IVector3D, maxV: IVector3D, transform?: IROTransform): ITransformEntity {
		return CoRScene.createFreeAxis3DEntity(minV, maxV, transform);
	}
	/**
	 * @param size th default value is 100.0
	 * @param transform IROTransform instance, its default is null
	 */
	createAxis3DEntity(size?: number, transform?: IROTransform): ITransformEntity {
		return CoRScene.createAxis3DEntity(size, transform);
	}
	/**
	 * @param size th default value is 100.0
	 * @param transform IROTransform instance, its default is null
	 */
	createCrossAxis3DEntity(size?: number, transform?: IROTransform): ITransformEntity {
		return CoRScene.createCrossAxis3DEntity(size, transform);
	}

	/**
	 * @param model IDataMesh instance
	 * @param material IRenderMaterial instance.
	 * @param texEnabled use texture yes or no, the default is false.
	 */
	createDisplayEntityWithDataMesh(mesh: IDataMesh, material: IRenderMaterial, texEnabled?: boolean): ITransformEntity {
		return CoRScene.createDisplayEntityWithDataMesh(mesh, material, texEnabled);
	}
	/**
	 * @param transform the default value is false
	 */
	createDisplayEntity(transform?: IROTransform): ITransformEntity {
		return CoRScene.createDisplayEntity(transform);
	}
	/**
	 * @param transform the default value is false
	 */
	createMouseEventEntity(transform?: IROTransform): IMouseEventEntity {
		return CoRScene.createMouseEventEntity(transform);
	}
	/**
	 * @param transform the default value is false
	 */
	createBoundsEntity(transform?: IROTransform): IBoundsEntity {
		return CoRScene.createBoundsEntity(transform);
	}
	createDisplayEntityContainer(): IDisplayEntityContainer {
		return CoRScene.createDisplayEntityContainer();
	}

	creatMaterialContextParam(): CoMaterialContextParam {
		return CoRScene.creatMaterialContextParam();
	}
	createMaterialContext(): IMaterialContext {
		return CoRScene.createMaterialContext();
	}
	/**
	 * 逆时针转到垂直
	 */
	VerticalCCWOnXOY(v: IVector3D): void {
		return CoRScene.VerticalCCWOnXOY(v);
	}
	/**
	 * 顺时针转到垂直
	 */
	VerticalCWOnXOY(v: IVector3D): void {
		return CoRScene.VerticalCWOnXOY(v);
	}

	createRendererSceneGraph(): IRendererSceneGraph {
		return CoRScene.createRendererSceneGraph();
	}

	createEvtNode(): IEvtNode {
		return CoRScene.createEvtNode();
	}

	isEnabled(): boolean {
		return VoxRenderer.isEnabled() && typeof CoRScene !== "undefined";
	}
}
const VoxRScene = new T_CoRScene();
export { RendererState, MouseEvent, EventBase, ProgressDataEvent, SelectionEvent, RendererDevice, VoxRScene };
