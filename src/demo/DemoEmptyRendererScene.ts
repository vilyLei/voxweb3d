import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";

/**
 * A empty RendererScene instance example
 */
export class DemoEmptyRendererScene
{
    constructor(){}
    private m_rscene:RendererScene = null;
    initialize():void
    {
        this.m_rscene = new RendererScene();
        this.m_rscene.initialize(new RendererParam(),3);
    }
    run():void
    {
        this.m_rscene.run();
    }
}