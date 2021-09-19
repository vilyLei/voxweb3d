
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererScene from "../scene/RendererScene";
import RendererSubScene from "../scene/RendererSubScene";
import EventBase from "../event/EventBase";
import RendererParam from "../scene/RendererParam";
import CanvasTextureTool from "../../orthoui/assets/CanvasTextureTool";
import Color4 from "../material/Color4";

class OrthoUI
{
    private m_rscene: RendererScene = null;
    private m_ruisc: RendererSubScene = null;
    constructor(){}
    
    initialize(rscene: RendererScene): void {
        if(rscene != null) {
            this.m_rscene = rscene;
            this.m_rscene.addEventListener(EventBase.RESIZE, this, this.resize);
            this.initUIScene();
        }
    }
    private initUIScene(): void {

        let rparam: RendererParam = new RendererParam();
        rparam.cameraPerspectiveEnabled = false;
        rparam.setCamProject(45.0, 0.1, 3000.0);
        rparam.setCamPosition(0.0, 0.0, 1500.0);
        
        let subScene: RendererSubScene = null;
        subScene = this.m_rscene.createSubScene();
        subScene.initialize(rparam);
        subScene.enableMouseEvent(true);
        this.m_ruisc = subScene;
        let stage = this.m_rscene.getStage3D();
        this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        this.m_ruisc.getCamera().update();
        CanvasTextureTool.GetInstance().initialize(this.m_rscene);
        CanvasTextureTool.GetInstance().initializeAtlas(1024,1024, new Color4(1.0,1.0,1.0,0.0), true);

    }
    private resize(evt: any): void {

        if (this.m_ruisc != null) {
            let stage = this.m_ruisc.getStage3D();
            this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        }
    }
}
export {OrthoUI};