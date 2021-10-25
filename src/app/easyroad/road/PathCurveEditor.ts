import Vector3D from "../../../vox/math/Vector3D";
import EngineBase from "../../../vox/engine/EngineBase";

import {RoadBuilder} from "./RoadBuilder";
import {RoadPath} from "./RoadPath";
import {PathCurveEditorUI} from "./PathCurveEditorUI";

class PathCurveEditor {

    constructor() { }

    private m_initFlag: boolean = true;
    private m_editorUI: PathCurveEditorUI = new PathCurveEditorUI();
    private m_roadBuilder: RoadBuilder = new RoadBuilder();
    
    initialize(engine: EngineBase): void {

        console.log("PathCurveEditor::initialize()......");
        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.initEditor();
            this.m_editorUI.initialize(engine);

        }
    }

    private m_editEnabled: boolean = false;
    private m_closeEnabled: boolean = false;
    setEditEnabled(enabled: boolean): void {
        this.m_editEnabled = enabled;
    }
    getEditEnabled(): boolean {
        return this.m_editEnabled;
    }
    setCloseEnabled(enabled: boolean): void {
        this.m_closeEnabled = enabled;
    }
    getCloseEnabled(): boolean {
        return this.m_closeEnabled;
    }

    private m_path: RoadPath = null;
    private m_curvePosList: Vector3D[] = null;
    private initEditor(): void {

        let path: RoadPath = this.m_roadBuilder.appendPath();
        this.m_path = path;
        path.setBezierCurveSegTotal(10);

    }
    clear(): void {
        
        this.m_path.clear();
        this.m_curvePosList = null;
    }
    private buildCurve(): Vector3D[] {
        console.log("this.m_closeEnabled: ",this.m_closeEnabled);
        let curvePosList: Vector3D[] = this.m_path.buildPathCurve(3, true, this.m_closeEnabled?10350:350);
        this.m_curvePosList = curvePosList;
        this.m_closeEnabled = false;
        return curvePosList;
    }
    isPathClosed(): boolean {
        return this.m_path.isClosed();
    }
    appendPathPos(pv: Vector3D): void {

        if( !this.m_path.isClosed() ) {            
            if( this.m_editEnabled && this.m_path != null ) {                        
                this.m_path.appendPos(pv);
            }
        }
    }
    buildPath(): void {
        
        if(this.m_editEnabled && this.m_path != null) {
            if(this.m_path.getPosListLength() > 1) {
                this.m_curvePosList = this.buildCurve();
            }
        }
    }
    getPathPosList(): Vector3D[] {
        return this.m_curvePosList;
    }
    run(): void {
        this.m_editorUI.run();
    }
}

export {PathCurveEditor};