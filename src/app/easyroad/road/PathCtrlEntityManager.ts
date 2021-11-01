
import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import EngineBase from "../../../vox/engine/EngineBase";

import { RoadPath } from "./RoadPath";
import { PathCurveEditorUI } from "./PathCurveEditorUI";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import { EditableEntity } from "../../../voxeditor/entity/EditableEntity";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import SelectionBar from "../../../orthoui/button/SelectionBar";
import ProgressBar from "../../../orthoui/button/ProgressBar";

import { PathKeyNode } from "./PathKeyNode";
import { PathCtrlEntity } from "./PathCtrlEntity";
import MathConst from "../../../vox/math/MathConst";

class PathCtrlEntityManager {

    constructor() { }

    private m_pathCtrlPosIndex: number = 0;
    private m_initFlag: boolean = true;
    private m_trlPosVisible: boolean = true;
    private m_engine: EngineBase = null;
    private m_path: RoadPath = null;
    private m_srcEntity: Sphere3DEntity = null;
    private m_pathCtrlEntitys: PathCtrlEntity[] = [];
    private m_ctrlEntity: PathCtrlEntity = null;
    private m_tempPos: Vector3D = new Vector3D();
    /**
     * 细化分段的距离
     */
    private m_segDistance: number = 70.0;

    addPosBtn: SelectionBar = null;
    currPosCurvationFreezeBtn: SelectionBar = null;
    segTotalCtrlBtn: ProgressBar = null;
    curvatureFactorHeadBtn: ProgressBar = null;
    curvatureFactorTailBtn: ProgressBar = null;
    editorUI: PathCurveEditorUI = null;

    initialize(engine: EngineBase, path: RoadPath): void {

        console.log("PathCtrlEntityManager::initialize()......");
        if (this.m_initFlag) {

            this.m_engine = engine;
            this.m_initFlag = false;
            this.m_path = path;
            this.m_srcEntity = new Sphere3DEntity();
            this.m_srcEntity.initialize(25, 10, 10);
        }
    }
    setAllPosCurvatureFreeze(frzeeze: boolean): void {

        let list: PathKeyNode[] = this.m_path.getPosNodeList();
        if (list != null) {
            for (let i: number = 0; i < list.length; ++i) {
                list[i].curvationFreeze = frzeeze;
            }
        }
    }
    setSegmentsTotalFactor(factor: number): void {
        let editEntity: PathCtrlEntity = this.getTargetPathCtrlEntity();
        if (editEntity != null) {
            let node: PathKeyNode = this.m_path.getPosNodeAt(editEntity.pathCtrlPosIndex);
            factor = 1.0 - MathConst.Clamp(factor, 0.0, 1.0);
            node.stepDistance = Math.round(this.m_segDistance * factor);
            if (node.stepDistance < 1.0) {
                node.stepDistance = 1.0;
            }
            this.m_path.version++;
        }
    }
    setcurrPosCurvatureFactor(factor: number, type: number): void {
        let editEntity: PathCtrlEntity = this.getTargetPathCtrlEntity();
        if (editEntity != null) {
            let node: PathKeyNode = this.m_path.getPosNodeAt(editEntity.pathCtrlPosIndex);
            if (type == 0) node.positiveCtrlFactor = factor;
            else node.negativeCtrlFactor = factor;
            this.m_path.version++;
        }
    }
    setcurrPosCurvatureFreeze(frzeeze: boolean): void {
        let editEntity: PathCtrlEntity = this.getTargetPathCtrlEntity();
        if (editEntity != null) {
            let node: PathKeyNode = this.m_path.getPosNodeAt(editEntity.pathCtrlPosIndex);
            node.curvationFreeze = frzeeze;
        }
    }
    getTargetPathCtrlEntity(): PathCtrlEntity {
        let target: IEntityTransform = this.editorUI.dragMoveController.getTarget();
        if (target != null) {
            let editEntity: PathCtrlEntity = null;
            for (let i: number = 0; i < this.m_pathCtrlEntitys.length; ++i) {
                if (target == this.m_pathCtrlEntitys[i]) {
                    editEntity = this.m_pathCtrlEntitys[i] as PathCtrlEntity;
                    break;
                }
            }
            return editEntity;
        }
        return null;
    }
    setCtrlPosVisible(visible: boolean): void {

        this.m_trlPosVisible = visible;
        let flag: boolean = false;
        let target: IEntityTransform = this.editorUI.dragMoveController.getTarget();
        for (let i: number = 0; i < this.m_pathCtrlEntitys.length; ++i) {
            let entity = this.m_pathCtrlEntitys[i];
            entity.setVisible(visible);
            if (target == entity) {
                flag = true;
            }
        }
        if (flag) {
            this.editorUI.dragMoveController.setVisible(visible);
        }
    }
    private m_editEnabled: boolean = false;
    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
        if (enabled) {
            if (this.editorUI.dragMoveController.getTarget() != null) {
                this.editorUI.dragMoveController.setVisible(true);
            }
        }
        else {
            this.m_ctrlEntity = null;
            this.editorUI.dragMoveController.setVisible(false);
            this.editorUI.dragMoveController.setTarget(null);
        }
        for (let i: number = 0; i < this.m_pathCtrlEntitys.length; ++i) {
            let entity = this.m_pathCtrlEntitys[i];
            entity.mouseEnabled = enabled;
        }
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    clear(): void {
        this.m_trlPosVisible = true;
        for (let i: number = 0; i < this.m_pathCtrlEntitys.length; ++i) {
            let entity = this.m_pathCtrlEntitys[i];
            this.m_engine.rscene.removeEntity(this.m_pathCtrlEntitys[i]);
            entity.destroy();
        }
        this.m_pathCtrlPosIndex = 0;
    }
    private createCtrlEntity(pv: Vector3D, ctrlPosIndex: number): PathCtrlEntity {

        let editEntity: PathCtrlEntity = new PathCtrlEntity();
        editEntity.setVisible(this.m_trlPosVisible);
        editEntity.path = this.m_path;
        editEntity.pathCtrlPosIndex = ctrlPosIndex;
        editEntity.copyMeshFrom(this.m_srcEntity);

        let material: Default3DMaterial = new Default3DMaterial();
        if (editEntity.pathCtrlPosIndex == 0) {
            material.setRGB3f(0.7, 1.0, 0.7);
        }
        editEntity.setMaterial(material);
        editEntity.setXYZ(100, 100, 300);
        editEntity.initializeEvent();
        editEntity.setPosition(pv);
        editEntity.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownEditableEntity);
        this.m_engine.rscene.addEntity(editEntity);
        return editEntity;
    }
    /**
     * 在尾部添加一个 ctrlEntity
     * @param pv 世界坐标空间中的位置
     */
    appendPathCtrlPos(pv: Vector3D): void {
        let editEntity: PathCtrlEntity = this.createCtrlEntity(pv, this.m_pathCtrlPosIndex++);
        this.m_pathCtrlEntitys.push(editEntity);
        this.editorUI.dragMoveController.setVisible(false);
        this.editorUI.dragMoveController.setTarget(null);
    }
    /**
     * 在当前 ctrlEntity 之后添加一个 新的 ctrlEntity
     * @param pv 世界坐标空间中的位置
     */
    insertCtrlPosFromCurrPos(): void {

        if (this.m_ctrlEntity != null && this.m_pathCtrlEntitys.length > 1) {

            let i: number = this.m_ctrlEntity.pathCtrlPosIndex;
            let pv: Vector3D = this.m_tempPos;
            let node0: PathKeyNode;
            let node1: PathKeyNode;
            if ((i + 1) < this.m_pathCtrlEntitys.length) {
                node1 = this.m_path.getPosNodeAt(i + 1);
                node0 = this.m_path.getPosNodeAt(i);
            }
            else {
                node1 = this.m_path.getPosNodeAt(this.m_pathCtrlEntitys.length - 1);
                node0 = this.m_path.getPosNodeAt(this.m_pathCtrlEntitys.length - 2);
            }
            pv.subVecsTo(node1.pos, node0.pos);
            pv.scaleBy(0.3);
            
            if ((i + 1) < this.m_pathCtrlEntitys.length) {
                pv.addBy(node0.pos);
                this.m_path.insertPosAt(i + 1, pv);
                let editEntity: PathCtrlEntity = this.createCtrlEntity(pv, i+1);
                this.m_pathCtrlEntitys.splice(this.m_ctrlEntity.pathCtrlPosIndex + 1, 0, editEntity);
                for (; i < this.m_pathCtrlEntitys.length; ++i) {
                    this.m_pathCtrlEntitys[i].pathCtrlPosIndex = i;
                }
            }
            else {
                pv.addBy(node1.pos);
                this.m_path.appendPos(pv);
                let editEntity: PathCtrlEntity = this.createCtrlEntity(pv, this.m_pathCtrlEntitys.length);
                this.m_pathCtrlEntitys.push(editEntity);
            }
            this.m_path.version ++;
        }
    }
    /**
     * 删除当前选中的控制点
     */
    delCurrCtrlPos(): void {
        if (this.m_ctrlEntity != null) {
            let index: number = this.m_ctrlEntity.pathCtrlPosIndex;
            if (this.m_pathCtrlEntitys != null && index >= 0 && index < this.m_pathCtrlEntitys.length) {
                this.m_path.deletePosAt(index);
                this.m_pathCtrlEntitys.splice(index, 1);
                for (let i: number = index; i < this.m_pathCtrlEntitys.length; ++i) {
                    this.m_pathCtrlEntitys[i].pathCtrlPosIndex = i;
                }
            }
            this.m_engine.rscene.removeEntity( this.m_ctrlEntity);
            this.m_ctrlEntity.destroy();
            this.m_ctrlEntity = null;
            this.m_path.version++;
            this.editorUI.dragMoveController.setVisible(false);
            this.editorUI.dragMoveController.setTarget(null);
        }
    }
    private mouseDownEditableEntity(evt: any): void {
        if (this.m_editEnabled) {
            let editEntity: PathCtrlEntity = evt.target;
            this.m_ctrlEntity = editEntity;
            let node: PathKeyNode = this.m_path.getPosNodeAt(editEntity.pathCtrlPosIndex);
            if (node.curvationFreeze) {
                this.currPosCurvationFreezeBtn.select(false);
            }
            else {
                this.currPosCurvationFreezeBtn.deselect(false);
            }
            this.addPosBtn.deselect(true);

            this.segTotalCtrlBtn.setProgress(node.stepDistance / this.m_segDistance, false);
            this.curvatureFactorHeadBtn.setProgress(node.positiveCtrlFactor, false);
            this.curvatureFactorTailBtn.setProgress(node.negativeCtrlFactor, false);
            //node.stepDistance = Math.round(this.m_segDistance * factor);
            editEntity.getPosition(this.m_tempPos);
            this.m_tempPos.subtractBy(evt.wpos);
            let offsetPos: Vector3D = this.m_tempPos;
            this.editorUI.dragMoveController.setVisible(true);
            this.editorUI.dragMoveController.setTarget(evt.target);
            this.editorUI.dragMoveController.setTargetPosOffset(offsetPos);
            this.editorUI.dragMoveController.setPosition(evt.wpos);
            this.editorUI.dragMoveController.selectByParam(evt.raypv, evt.raytv, evt.wpos);
        }
    }
}

export { PathCtrlEntityManager };