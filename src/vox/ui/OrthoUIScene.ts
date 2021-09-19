
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
import IRenderEntity from "../../vox/render/IRenderEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import IRendererScene from "../../vox/scene/IRendererScene";

class OrthoUIScene implements IRendererScene
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
    getRendererScene(): RendererSubScene {
        return this.m_ruisc;
    }
    getUid(): number {
        return this.m_ruisc.getUid();
    }
    renderBegin(contextBeginEnabled: boolean = false): void {
        this.m_ruisc.renderBegin();
    }
    runBegin(autoCycle: boolean = true, contextBeginEnabled: boolean = false): void {
        this.m_ruisc.runBegin(autoCycle, contextBeginEnabled);
    }
    setRayTestEanbled(enabled: boolean): void {
        this.m_ruisc.setRayTestEanbled( enabled );
    }
    update(autoCycle: boolean = true, mouseEventEnabled: boolean = true): void {
        this.m_ruisc.update( autoCycle, mouseEventEnabled );
    }
    run(autoCycle: boolean = false): void {
        this.m_ruisc.run(autoCycle);
    }
    runEnd(): void {
        this.m_ruisc.runEnd();
    }
    runAt(index: number): void {
        this.m_ruisc.runAt(index);
    }
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processid this destination renderer process id
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
     */
    addEntity(entity: IRenderEntity, processIndex: number = 0, deferred: boolean = true): void {
        this.m_ruisc.addEntity(entity, processIndex, deferred);
    }
    removeEntity(entity: IRenderEntity): void {
        this.m_ruisc.removeEntity( entity );
    }
    
    addContainer(child: DisplayEntityContainer, processIndex: number = 0): void {
        this.m_ruisc.addContainer(child, processIndex);
    }
    removeContainer(child: DisplayEntityContainer): void {
        this.m_ruisc.removeContainer(child);
    }
    isRayPickSelected(): boolean {
        return this.m_ruisc.isRayPickSelected();
    }

    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     * @param captureEnabled true
     * @param bubbleEnabled false
     */
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean, bubbleEnabled: boolean = false): void {
        this.m_ruisc.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
    }
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     */
    removeEventListener(type: number, target: any, func: (evt: any) => void): void {
        this.m_ruisc.removeEventListener(type, target, func);
    }
    private resize(evt: any): void {

        if (this.m_ruisc != null) {
            let stage = this.m_ruisc.getStage3D();
            this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        }
    }
}
export {OrthoUIScene};