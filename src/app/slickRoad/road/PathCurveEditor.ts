import Vector3D from "../../../vox/math/Vector3D";
import EngineBase from "../../../vox/engine/EngineBase";

import { RoadBuilder } from "./RoadBuilder";
import { RoadPath } from "./RoadPath";
import { PathCurveEditorUI } from "./PathCurveEditorUI";
import { PathCtrlEntityManager } from "./PathCtrlEntityManager";
import Line3DEntity from "../../../vox/entity/Line3DEntity";
import { Pos3D } from "../base/Pos3D";
import { RoadSegObjectManager } from "./RoadSegObjectManager";
import MathConst from "../../../vox/math/MathConst";

class PathCurveEditor {

    constructor() { }

    private m_initFlag: boolean = true;
    private m_engine: EngineBase = null;

    private m_pathWholeWidthFactor: number = 120.0;
    private m_roadBuilder: RoadBuilder = new RoadBuilder();

    private m_addPosEnabled: boolean = true;
    private m_editEnabled: boolean = false;
    private m_closeEnabled: boolean = false;
    private m_path: RoadPath = null;
    private m_pathLineVersion: number = -1;
    private m_buildPathVersion: number = -1;
    private m_line: Line3DEntity = null;

    readonly pathCtrlEntityManager: PathCtrlEntityManager = new PathCtrlEntityManager();
    readonly editorUI: PathCurveEditorUI = new PathCurveEditorUI();

    initialize(engine: EngineBase, roadSegObjManager: RoadSegObjectManager): void {

        console.log("PathCurveEditor::initialize()......");
        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_engine = engine;

            this.initEditor( roadSegObjManager );
            this.editorUI.initialize(engine);
            this.editorUI.dragMoveController.setPosition(new Vector3D(0.0, 100.0, 0.0));

        }
    }

    insertCtrlPosFromCurrPos(): void {
        if(this.m_addPosEnabled) {
            this.pathCtrlEntityManager.insertCtrlPosFromCurrPos();
        }
    }
    delCurrCtrlPos(): void {
        if(this.m_addPosEnabled) {
            this.pathCtrlEntityManager.delCurrCtrlPos();
        }
    }
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
    setCloseEnabled(enabled: boolean): boolean {
        if(this.m_closeEnabled !== enabled && (enabled && this.m_path.getCloseEnabled())) {
            this.m_path.version ++;
            this.m_closeEnabled = enabled;
            console.log("setCloseEnabled this.m_closeEnabled: ", this.m_closeEnabled);
        }
        return this.m_closeEnabled;
    }
    getCloseEnabled(): boolean {
        return this.m_closeEnabled;
    }
    private initEditor(roadSegObjManager: RoadSegObjectManager): void {

        let path: RoadPath = this.m_roadBuilder.appendPath();
        this.m_path = path;
        
        this.pathCtrlEntityManager.editorUI = this.editorUI;
        this.pathCtrlEntityManager.initialize(this.m_engine, this.m_path, roadSegObjManager);

        let pls = new Line3DEntity();
        pls.dynColorEnabled = true;
        pls.initializeByPosList([new Vector3D(), new Vector3D(1.0, 0.0, 0.0)]);
        this.m_engine.rscene.addEntity(pls);
        this.m_line = pls;
        this.m_line.setVisible( false );
    }

    clear(): void {

        this.m_closeEnabled = false;
        this.m_line.setVisible(false);
        this.m_path.clear();
        this.pathCtrlEntityManager.clear();
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
    buildPath(): void {

        if (this.m_editEnabled && this.m_path != null) {
            if ( this.m_path.getPosListLength() > 1 && this.m_buildPathVersion != this.m_path.version ) {
                this.m_buildPathVersion = this.m_path.version;
                this.m_path.buildPathCurve(3, this.m_closeEnabled, this.m_closeEnabled ? 10350 : 350);
            }
        }
    }
    /**
     * 获取路径上的关键点
     * @returns 路径上的关键点
     */
    getPathKeyPosList(): Pos3D[] {
        return this.m_path.getPosList();
    }
    /**
     * 获取路径曲线路径上的所有位置点对象的分段数据
     * @returns 路径曲线路径上的所有位置点对象的分段数据
     */
    getPathCurvePosTable(): Pos3D[][] {
        return this.m_path.getCurvePosTable();
    }
    /**
     * 获取路径曲线路径上的所有位置点对象
     * @returns 路径曲线路径上的所有位置点对象
     */
    getPathCurvePosList(): Pos3D[] {
        return this.m_path.getCurvePosList();
    }
    getPathVersion(): number {
        return this.m_path.version;
    }
    setPathWholeWidthFactor(factor: number): void {

        factor = MathConst.Clamp(factor, 0.0, 1.0);
        factor = 4.0 * factor;
        factor = MathConst.Clamp(factor, 0.1, 4.0);

        let pw: number = 20 + Math.round(factor * 500.0);        
        //this.m_pathWholeWidthFactor = pw;
        //this.m_path.version++;
    }
    getPathWholeWidthFactor(): number {
        return this.m_pathWholeWidthFactor;
    }
    getPathKeyPosTotal(): number {
        return this.m_path.getPosListLength();
    }
    run(): void {

        this.editorUI.run();

        if(this.m_pathLineVersion != this.m_path.version) {
            this.m_pathLineVersion = this.m_path.version;
            
            this.buildPath();
            if(this.getPathKeyPosTotal() >= 3 || this.isPathClosed()) {
                this.m_line.setVisible(false);
            }else{
                let posList: Pos3D[] = this.getPathCurvePosList();
                this.buildPathLine(posList);
            }
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