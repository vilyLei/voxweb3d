
import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import EngineBase from "../../../vox/engine/EngineBase";

import { RoadPath } from "./RoadPath";
import { PathCurveEditorUI } from "./PathCurveEditorUI";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import {EditableEntity} from "../../../voxeditor/entity/EditableEntity";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import SelectionBar from "../../../orthoui/button/SelectionBar";
import ProgressBar from "../../../orthoui/button/ProgressBar";

import { PathKeyNode } from "./PathKeyNode";
import MathConst from "../../../vox/math/MathConst";
class PathCtrlEntity extends EditableEntity {

    path: RoadPath = null;
    pathCtrlPosIndex: number = 0;
    private m_currPos: Vector3D = new Vector3D();
    private m_newPos: Vector3D = new Vector3D();
    constructor() {
        super();
    }
    update(): void {

        this.m_currPos.setXYZ(0.0,0.0,0.0);
        this.getMatrix(false).transformVector3Self(this.m_currPos);
        super.update();
        this.getPosition(this.m_newPos);
        let dis: number = Vector3D.DistanceSquared(this.m_currPos, this.m_newPos);
        if(dis > 0.001) {
            if(this.path != null) {
                let posList: Vector3D[] =  this.path.getPosList();
                if(posList != null && this.pathCtrlPosIndex >= 0 && this.pathCtrlPosIndex < posList.length) {
                    this.getPosition(posList[this.pathCtrlPosIndex]);
                    this.path.version ++;
                    //console.log("posList["+this.pathCtrlPosIndex+"]: ",posList[this.pathCtrlPosIndex]);
                }
            }
        }
    }
    destroy(): void {
        super.destroy();        
        this.path = null;
        this.pathCtrlPosIndex = 0;
    }
}
class PathCtrlEntityManager {

    constructor() { }

    private m_pathCtrlPosIndex: number = 0;
    private m_initFlag: boolean = true;
    private m_trlPosVisible: boolean = true;
    private m_engine: EngineBase = null;
    private m_path: RoadPath = null;
    private m_srcEntity: Sphere3DEntity = null;
    private m_pathCtrlEntitys: EditableEntity[] = [];
    /**
     * 细化分段的距离
     */
    private m_segDistance: number = 70.0;

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
        if(list != null) {
            for(let i: number = 0; i < list.length; ++i) {
                list[i].curvationFreeze = frzeeze;
            }
        }
    }
    setSegmentsTotalFactor(factor: number): void {
        let editEntity: PathCtrlEntity = this.getTargetPathCtrlEntity();
        if(editEntity != null) {
            let node: PathKeyNode = this.m_path.getPosNodeAt(editEntity.pathCtrlPosIndex);
            factor = 1.0 - MathConst.Clamp(factor, 0.0, 1.0);
            node.stepDistance = Math.round(this.m_segDistance * factor);
            if(node.stepDistance < 1.0) {
                node.stepDistance = 1.0;
            }
            this.m_path.version ++;
        }
    }
    setcurrPosCurvatureFactor(factor: number, type: number): void {
        let editEntity: PathCtrlEntity = this.getTargetPathCtrlEntity();
        if(editEntity != null) {
            let node: PathKeyNode = this.m_path.getPosNodeAt(editEntity.pathCtrlPosIndex);
            if(type == 0) node.positiveCtrlFactor = factor;
            else node.negativeCtrlFactor = factor;
            this.m_path.version ++;
        }
    }
    setcurrPosCurvatureFreeze(frzeeze: boolean): void {
        let editEntity: PathCtrlEntity = this.getTargetPathCtrlEntity();
        if(editEntity != null) {
            let node: PathKeyNode = this.m_path.getPosNodeAt(editEntity.pathCtrlPosIndex);
            node.curvationFreeze = frzeeze;
        }
    }
    getTargetPathCtrlEntity(): PathCtrlEntity {
        let target: IEntityTransform = this.editorUI.dragMoveController.getTarget();
        if(target != null) {
            let editEntity: PathCtrlEntity = null;
            for(let i: number = 0; i < this.m_pathCtrlEntitys.length; ++i) {
                if(target == this.m_pathCtrlEntitys[i]) {
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
        for(let i: number = 0; i < this.m_pathCtrlEntitys.length; ++i) {
            let entity = this.m_pathCtrlEntitys[i];
            entity.setVisible(visible);
            if(target == entity) {
                flag = true;
            }
        }
        if(flag) {
            this.editorUI.dragMoveController.setVisible(visible);
        }
    }
    private m_editEnabled: boolean = false;
    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
        if(enabled) {
            if(this.editorUI.dragMoveController.getTarget() != null) {
                this.editorUI.dragMoveController.setVisible(true);
            }
        }
        else {
            this.editorUI.dragMoveController.setVisible(false);
        }
        for(let i: number = 0; i < this.m_pathCtrlEntitys.length; ++i) {
            let entity = this.m_pathCtrlEntitys[i];
            entity.mouseEnabled = enabled;
        }
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    clear(): void {
        this.m_trlPosVisible = true;
        for(let i: number = 0; i < this.m_pathCtrlEntitys.length; ++i) {
            let entity = this.m_pathCtrlEntitys[i];
            this.m_engine.rscene.removeEntity(this.m_pathCtrlEntitys[i]);
            entity.destroy();
        }
        this.m_pathCtrlPosIndex = 0;
    }
    appendPathCtrlPos(pv: Vector3D): void {

        let editEntity: PathCtrlEntity = new PathCtrlEntity();
        editEntity.setVisible(this.m_trlPosVisible);
        editEntity.path = this.m_path;
        editEntity.pathCtrlPosIndex = this.m_pathCtrlPosIndex++;
        editEntity.copyMeshFrom( this.m_srcEntity );
        if(editEntity.pathCtrlPosIndex != 0) {
            editEntity.copyMaterialFrom( this.m_srcEntity );
        }
        else {
            let material: Default3DMaterial = new Default3DMaterial();
            material.setRGB3f(0.7,1.0,0.7);
            editEntity.setMaterial( material );
        }
        editEntity.setXYZ(100,100,300);
        editEntity.initializeEvent();
        editEntity.setPosition(pv);
        editEntity.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownEditableEntity);
        this.m_pathCtrlEntitys.push(editEntity);
        this.m_engine.rscene.addEntity( editEntity );
    }
    private m_tempPos: Vector3D = new Vector3D();
    private mouseDownEditableEntity(evt: any): void {
        if(this.m_editEnabled) {
            let editEntity: PathCtrlEntity = evt.target;
            let node: PathKeyNode = this.m_path.getPosNodeAt(editEntity.pathCtrlPosIndex);
            if(node.curvationFreeze) {
                this.currPosCurvationFreezeBtn.select(false);
            }
            else {                
                this.currPosCurvationFreezeBtn.deselect(false);
            }

            this.segTotalCtrlBtn.setProgress(node.stepDistance/this.m_segDistance,false);
            this.curvatureFactorHeadBtn.setProgress(node.positiveCtrlFactor,false);
            this.curvatureFactorTailBtn.setProgress(node.negativeCtrlFactor,false);
            //node.stepDistance = Math.round(this.m_segDistance * factor);
            editEntity.getPosition( this.m_tempPos );
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