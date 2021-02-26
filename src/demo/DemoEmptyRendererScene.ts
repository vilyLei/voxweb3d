
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererSceneT from "../vox/scene/RendererScene";

import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

export namespace demo
{
    /**
     * Empty RendererScene instance example
     */
    export class DemoEmptyRendererScene
    {
        constructor(){}
        private m_rscene:RendererScene = null;
        initialize():void
        {
            console.log("DemoEmptyRendererScene::initialize()......");
            if(this.m_rscene == null)
            {
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(new RendererParam(),3);
            }
        }
        run():void
        {
            this.m_rscene.runBegin();

            this.m_rscene.run();
            
            this.m_rscene.runEnd();            
        }
    }
}