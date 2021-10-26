
import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import EngineBase from "../../../vox/engine/EngineBase";

import { RoadBuilder } from "./RoadBuilder";
import { RoadPath } from "./RoadPath";
import { PathCurveEditorUI } from "./PathCurveEditorUI";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import {EditableEntity} from "../../../voxeditor/entity/EditableEntity";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

class PathCtrlEntity extends EditableEntity {

    path: RoadPath = null;
    pathCtrlPosIndex: number = 0;
    constructor() {
        super();
    }
    update(): void {
        super.update();
        if(this.path != null) {
            let posList: Vector3D[] =  this.path.getPosList();
            if(posList != null && this.pathCtrlPosIndex >= 0 && this.pathCtrlPosIndex < posList.length) {
                this.getPosition(posList[this.pathCtrlPosIndex]);
                this.path.version ++;
                //console.log("posList["+this.pathCtrlPosIndex+"]: ",posList[this.pathCtrlPosIndex]);
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

    editorUI: PathCurveEditorUI = null;
    initialize(engine: EngineBase, path: RoadPath): void {

        console.log("PathCtrlEntityManager::initialize()......");
        if (this.m_initFlag) {

            this.m_engine = engine;
            this.m_initFlag = false;
            this.m_path = path;
            this.m_srcEntity = new Sphere3DEntity();
            this.m_srcEntity.initialize(50, 10, 10);
        }
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
        editEntity.copyMaterialFrom( this.m_srcEntity );
        editEntity.setXYZ(100,100,300);
        editEntity.initializeEvent();
        editEntity.setPosition(pv);
        editEntity.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownEditableEntity);
        this.m_pathCtrlEntitys.push(editEntity);
        this.m_engine.rscene.addEntity( editEntity );
    }
    
    private mouseDownEditableEntity(evt: any): void {
        if(this.m_editEnabled) {
            this.editorUI.dragMoveController.setVisible(true);
            this.editorUI.dragMoveController.setTarget(evt.target);
            this.editorUI.dragMoveController.selectByParam(evt.raypv, evt.raytv, evt.wpos);
        }
    }
}

export { PathCtrlEntityManager };