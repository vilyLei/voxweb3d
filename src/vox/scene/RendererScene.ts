/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染场景的入口类

import RendererInstance from "../../vox/scene/RendererInstance";
import IRendererInstance from "../../vox/scene/IRendererInstance";
import IRenderer from "../../vox/scene/IRenderer";
import IRendererScene from "../../vox/scene/IRendererScene";
import RendererSubScene from "../../vox/scene/RendererSubScene";
import IRenderNode from "../../vox/scene/IRenderNode";
import RendererSceneBase from "./RendererSceneBase";
import { RenderableMaterialBlock } from "./block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "./block/RenderableEntityBlock";
import IRendererParam from "./IRendererParam";

export default class RendererScene extends RendererSceneBase implements IRenderer, IRendererScene, IRenderNode {

    private m_tickId: any = -1;
    constructor() { super(); }

    protected createRendererIns(): IRendererInstance {
        this.m_currStage3D = this.stage3D;
        this.m_stage3D = this.stage3D;
        return new RendererInstance();
    }
    protected rendererInsInited(): void {
        this.m_camera = this.m_rproxy.getCamera();
    }
    protected initThis(): void {
        let selfT: any = this;
        selfT.materialBlock = new RenderableMaterialBlock();
        selfT.entityBlock = new RenderableEntityBlock();
        this.materialBlock.initialize();
        this.entityBlock.initialize();
        this.tickUpdate();
    }

    protected contextRunEnd(): void {
        this.m_rcontext.runEnd();
    }
    private tickUpdate(): void {
        if (this.m_tickId > -1) {
            clearTimeout(this.m_tickId);
        }
        this.m_tickId = setTimeout(this.tickUpdate.bind(this), this.m_rparam.getTickUpdateTime());
        this.textureBlock.run();
    }
	setCanvas(canvas: HTMLCanvasElement): boolean {
		return (this.m_renderer as RendererInstance).setCanvas( canvas );
	}
    /**
     * @param rparam IRendererParam instance, the default value is null
     * @param renderProcessesTotal the default value is 3
     * @param createNewCamera the default value is true
     */
    createSubScene(rparam: IRendererParam = null, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene {
        if (this.m_renderer != null && this.materialBlock != null) {
            this.m_localRunning = true;
            let subsc = new RendererSubScene(this, this.m_renderer, this.m_evtFlowEnabled);
            this.m_subscListLen++;

            let sc: any = subsc;
            sc.textureBlock = this.textureBlock;
            sc.materialBlock = this.materialBlock;
            sc.entityBlock = this.entityBlock;
            if (rparam != null) {
                sc.initialize(rparam, renderProcessesTotal, createNewCamera);
            }
            return subsc;
        }
        throw Error("Illegal operation!!!");
        return null;
    }
    private m_autoRRun = false;
    fakeRun(autoCycle: boolean = true): void {
        console.log("fakeRun ...");
    }
    setAutoRunning(auto: boolean): RendererScene {

        if (this.m_autoRRun != auto) {
            if (this.m_autoRRun) {

                let runFunc = this.run;
                this.run = this.fakeRun;
                this.fakeRun = runFunc;

                this.m_autoRRun = false;
            } else {
                this.m_autoRRun = true;

                let runFunc = this.fakeRun;
                this.fakeRun = this.run;
                this.run = runFunc;

                const func = (): void => {
                    if (this.m_autoRRun) {
                        this.fakeRun();
                        window.requestAnimationFrame(func);
                    }
                }
                window.requestAnimationFrame(func);
            }
        }
        return this;
    }

    isAutoRunning(): boolean {
        return this.m_autoRRun;
    }
}
