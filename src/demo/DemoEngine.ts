import EngineBase from "../vox/engine/EngineBase";

/**
 * A empty engine instance example
 */
export class DemoEngine {
    private m_engine: EngineBase = null;
    constructor() { }
    initialize(): void {
        this.m_engine = new EngineBase();
        this.m_engine.initialize();
    }
    run(): void {
        this.m_engine.run();
    }
}