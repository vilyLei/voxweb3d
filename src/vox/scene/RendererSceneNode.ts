import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSceneNode from "./IRendererSceneNode";
import IRSGT from "./IRendererSceneGraphStatus";

type STCall = (sc: IRendererScene, st: IRSGT) => void;
export default class RendererSceneNode implements IRendererSceneNode {
    private m_rscene: IRendererScene = null;
    priority: number = 0;
    processIdList: number[] = null;
    contextResetEnabled: boolean = false;
    p0Call0: STCall = null;
    p0Call1: STCall = null;
    p1Call0: STCall = null;
    p1Call1: STCall = null;
    constructor(rscene: IRendererScene) {
        if (rscene == null) {
            throw Error("rscene is null !!!");
        }
        this.m_rscene = rscene;
    }
    setPhase0Callback(beforeCall: STCall, afterCall: STCall): void {
        this.p0Call0 = beforeCall;
        this.p0Call1 = afterCall;
        console.log("NNNNNNNNNNNNNNNN this.p0Call1: ", this.p0Call1);
    }
    setPhase1Callback(beforeCall: STCall, afterCall: STCall): void {
        this.p1Call0 = beforeCall;
        this.p1Call1 = afterCall;
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