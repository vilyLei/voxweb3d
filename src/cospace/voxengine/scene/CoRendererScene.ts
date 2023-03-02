/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染场景的入口类

import IRendererInstance from "../../../vox/scene/IRendererInstance";
import RendererState from "../../../vox/render/RendererState";
import IRenderer from "../../../vox/scene/IRenderer";
import IRenderNode from "../../../vox/scene/IRenderNode";
import IRendererScene from "../../../vox/scene/IRendererScene";
import RendererSceneBase from "../../../vox/scene/RendererSceneBase";
import CoRendererSubScene from "./CoRendererSubScene";
import IRendererParam from "../../../vox/scene/IRendererParam";
import { RenderableMaterialBlock } from "../../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../../vox/scene/block/RenderableEntityBlock";

import { ICoRenderer } from "../ICoRenderer";
// import { ICoRScene } from "../ICoRScene";

declare var CoRenderer: ICoRenderer;
// declare var CoRScene: ICoRScene;

export default class CoRendererScene extends RendererSceneBase implements IRenderer, IRendererScene, IRenderNode {

    private m_tickId: any = -1;
    constructor() { super(); }

    protected createRendererIns(): IRendererInstance {
        this.m_currStage3D = this.stage3D;
        this.m_stage3D = this.stage3D;
		
        return CoRenderer.createRendererInstance();
	}
    protected rendererInsInited(): void {
        this.m_camera = this.m_renderProxy.getCamera();
		let srcSt: any = CoRenderer.RendererState;
		srcSt.rstb.buildToRST(RendererState);
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
    createSubScene(rparam: IRendererParam = null, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene {
        if (this.m_renderer != null && this.materialBlock != null) {
            this.m_localRunning = true;
            let subsc = new CoRendererSubScene(this, this.m_renderer, this.m_evtFlowEnabled);
            // this.m_subscList.push(subsc);
            this.m_subscListLen++;

            let sc: any = subsc;
            sc.textureBlock = this.textureBlock;
            sc.materialBlock = this.materialBlock;
            sc.entityBlock = this.entityBlock;
            if(rparam != null) {
				sc.initialize(rparam, renderProcessesTotal, createNewCamera);
			}
            return subsc;
        }
        throw Error("Illegal operation!!!");
        return null;
    }
    
    private m_autoRRun = false;
    setAutoRunning(auto: boolean): void {
        
        if (this.m_autoRRun != auto) {
            if (this.m_autoRRun) {
                this.m_autoRRun = false;
            } else {
                this.m_autoRRun = true;
                const func = (): void => {
                    if (this.m_autoRRun) {
                        this.run();
                        window.requestAnimationFrame(func);
                    }
                }
                window.requestAnimationFrame(func);
            }
        }
    }
}
