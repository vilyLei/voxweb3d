import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSceneNode from "./IRendererSceneNode";

export default class RendererSceneNode implements IRendererSceneNode {
    private m_rscene: IRendererScene = null;
    priority: number = 0;
    processIdList: number[] = null;
    contextResetEnabled: boolean = false;

    constructor(rscene: IRendererScene) {
        if (rscene == null) {
            throw Error("rscene is null !!!");
        }
        this.m_rscene = rscene;
    }
    enableMouseEvent(gpuTestEnabled: boolean = true): void {
        this.m_rscene.enableMouseEvent(gpuTestEnabled);
    }
    getRScene(): IRendererScene {
        return this.m_rscene;
    }
    clear(): void {
        this.m_rscene = null;
        this.processIdList = null;
    }
}