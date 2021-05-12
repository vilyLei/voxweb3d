import RendererScene from "../vox/scene/RendererScene";

/**
 * A empty RendererScene instance example
 */
export class DemoEmptyRendererScene {
    private m_rscene: RendererScene = null;
    constructor() { }
    initialize(): void {
        this.m_rscene = new RendererScene();
        this.m_rscene.initialize();
    }
    run(): void {
        this.m_rscene.run();
    }
}