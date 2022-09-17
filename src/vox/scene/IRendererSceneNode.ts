import IRendererScene from "../../vox/scene/IRendererScene";

export default interface IRendererSceneNode {

    priority: number;
    processIdList: number[];
    contextResetEnabled: boolean;

    enableMouseEvent(gpuTestEnabled?: boolean): void;
    getRScene(): IRendererScene;
    clear(): void;
}