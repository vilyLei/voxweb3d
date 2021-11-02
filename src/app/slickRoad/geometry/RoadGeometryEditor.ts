
import EngineBase from "../../../vox/engine/EngineBase";

class RoadGeometryEditor {

    constructor() { }

    private m_engine: EngineBase = null;
    initialize(engine: EngineBase): void {

        console.log("RoadGeometryEditor::initialize()......");
        if (this.m_engine == null) {

            this.m_engine = engine;

            this.initEditor();
        }
    }
    private initEditor(): void {

    }
    clear(): void {
        
    }
    
    update(): void {
    }
    run(): void {
    }
}

export { RoadGeometryEditor };