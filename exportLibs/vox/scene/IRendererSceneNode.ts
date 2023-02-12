import IRendererScene from "../../vox/scene/IRendererScene";
import IRSGT from "./IRendererSceneGraphStatus";

type STCall = (sc: IRendererScene, st: IRSGT) => void;
export default interface IRendererSceneNode {

    priority: number;
    processIdList: number[];
    contextResetEnabled: boolean;

    setPhase0Callback(beforeCall: STCall, afterCall: STCall): void;
    setPhase1Callback(beforeCall: STCall, afterCall: STCall): void;
    enableMouseEvent(gpuTestEnabled?: boolean): void;
    getRScene(): IRendererScene;
    clear(): void;
}