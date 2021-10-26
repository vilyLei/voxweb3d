import Vector3D from "../../../vox/math/Vector3D";
import EngineBase from "../../../vox/engine/EngineBase";

import { RoadBuilder } from "./RoadBuilder";
import { RoadPath } from "./RoadPath";
import { PathCurveEditorUI } from "./PathCurveEditorUI";
import { PathCtrlEntityManager } from "./PathCtrlEntityManager";
import Line3DEntity from "../../../vox/entity/Line3DEntity";

class PathCurveEditor {

    constructor() { }

    private m_initFlag: boolean = true;
    private m_engine: EngineBase = null;

    private m_roadBuilder: RoadBuilder = new RoadBuilder();
    readonly pathCtrlEntityManager: PathCtrlEntityManager = new PathCtrlEntityManager();

    private m_path: RoadPath = null;
    private m_pathLineVersion: number = -1;
    private m_buildPathVersion: number = -1;
    private m_curvePosList: Vector3D[] = null;
    private m_line: Line3DEntity = null;
    readonly editorUI: PathCurveEditorUI = new PathCurveEditorUI();

    initialize(engine: EngineBase): void {

        console.log("PathCurveEditor::initialize()......");
        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_engine = engine;

            this.initEditor();
            this.editorUI.initialize(engine);
            this.editorUI.dragMoveController.setPosition(new Vector3D(0.0, 100.0, 0.0));

        }
    }

    private m_addPosEnabled: boolean = true;
    private m_editEnabled: boolean = false;
    private m_closeEnabled: boolean = false;
    setAddPosEnabled(enabled: boolean): void {
        this.m_addPosEnabled = enabled;
    }
    getAddPosEnabled(): boolean {
        return this.m_addPosEnabled;
    }
    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
        this.pathCtrlEntityManager.setEditEnabled(enabled);
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    setCloseEnabled(enabled: boolean): void {
        this.m_closeEnabled = enabled;
        console.log("setCloseEnabled this.m_closeEnabled: ", this.m_closeEnabled);
    }
    getCloseEnabled(): boolean {
        return this.m_closeEnabled;
    }
    private initEditor(): void {

        let path: RoadPath = this.m_roadBuilder.appendPath();
        this.m_path = path;
        path.setBezierCurveSegTotal(10);
        
        this.pathCtrlEntityManager.editorUI = this.editorUI;
        this.pathCtrlEntityManager.initialize(this.m_engine, this.m_path)

        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList([new Vector3D(), new Vector3D(1.0, 0.0, 0.0)]);
        this.m_engine.rscene.addEntity(pls);
        this.m_line = pls;

    }
    clear(): void {

        this.m_line.setVisible(false);
        this.m_path.clear();
        this.m_curvePosList = null;
        this.pathCtrlEntityManager.clear();
    }
    private buildCurve(): Vector3D[] {
        //console.log("buildCurve this.m_closeEnabled: ", this.m_closeEnabled);
        let curvePosList: Vector3D[] = this.m_path.buildPathCurve(3, true, this.m_closeEnabled ? 10350 : 350);
        this.m_curvePosList = curvePosList;
        //this.m_closeEnabled = false;
        return curvePosList;
    }
    isPathClosed(): boolean {
        return this.m_path.isClosed();
    }
    appendPathPos(pv: Vector3D): boolean {

        if (this.m_editEnabled && this.m_addPosEnabled && !this.m_path.isClosed()) {
            if (this.m_path != null) {
                this.m_path.appendPos(pv);
                this.pathCtrlEntityManager.appendPathCtrlPos(pv);
                this.m_path.version ++;
                this.buildPath();
                return true;
            }
        }
        return false;
    }
    private buildPath(): void {

        if (this.m_editEnabled && this.m_path != null) {
            if ( this.m_path.getPosListLength() > 1 && this.m_buildPathVersion != this.m_path.version ) {
                this.m_buildPathVersion = this.m_path.version;
                this.m_curvePosList = this.buildCurve();
            }
        }
    }
    getPathPosList(): Vector3D[] {
        return this.m_curvePosList;
    }
    run(): void {

        this.editorUI.run();

        if(this.m_pathLineVersion != this.m_path.version) {
            this.m_pathLineVersion = this.m_path.version;
            this.m_line.setVisible( true );
            this.buildPath();
            let posList: Vector3D[] = this.getPathPosList();
            this.buildPathLine(posList);
        }
    }
    
    private buildPathLine(curvePosList: Vector3D[]): void {

        if (curvePosList != null && curvePosList.length > 1) {
            let pls = this.m_line;
            this.m_line.setVisible(true);
            pls.initializeByPosList(curvePosList);
            pls.reinitializeMesh();
            pls.updateMeshToGpu();
            pls.updateBounds();
        }
    }
}

export { PathCurveEditor };