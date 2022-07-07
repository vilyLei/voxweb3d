import { ICoRendererParam } from "./ICoRendererParam";
import {IRendererSceneAccessor} from "../../../vox/scene/IRendererSceneAccessor";
import { IRenderProxy } from "../../../vox/render/IRenderProxy";
import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRendererScene from "../../../vox/scene/IRendererScene";


interface IEngineBase {

    readonly stage3D: IRenderStage3D;
    readonly rscene: IRendererScene;
    readonly uiScene: IRendererScene;

    getRenderProxy(): IRenderProxy;
    initialize(param: ICoRendererParam, renderProcessesTotal?: number): void;

    setAccessorAt(i: number, accessor: IRendererSceneAccessor): void;
    appendRendererScene(param: ICoRendererParam, renderProcessesTotal?: number, createNewCamera?: boolean, priority?: number): any;
    getRendererSceneAt(i: number): any;
    getRendererScenesTotal(): number;
    setProcessIdListAt(i: number, processIdList: number[]): void;
    setPriorityAt(i: number, priority: number): void;
    swapScenePriorityAt(i: number, j: number): void;
    swapSceneAt(i: number, j: number): void;
    sortScenes(): void;
    showInfo(): void;
    /**
     * 获取渲染器可渲染对象管理器状态(版本号)
     */
    getRendererStatus(): number
    run(): void
}
export { IEngineBase }
