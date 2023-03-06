import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSceneNode from "./IRendererSceneNode";
import IRendererSceneGraphStatus from "./IRendererSceneGraphStatus";
import IRendererParam from "./IRendererParam";

export default interface IRendererSceneGraph extends IRendererSceneGraphStatus {

    createRendererParam(div?: HTMLDivElement): IRendererParam;
    createRendererSceneParam(div?: HTMLDivElement): IRendererParam;
    /**
     * @param rparam IRendererParam instance, the default value is null
     * @param renderProcessesTotal the default value is 3
     * @param createNewCamera the default value is true
     */
    createScene(rparam: IRendererParam, renderProcessesTotal?: number, createNewCamera?: boolean): IRendererScene;
    /**
     * @param rparam IRendererParam instance, the default value is null
     * @param renderProcessesTotal the default value is 3
     * @param createNewCamera the default value is true
     */
    createSubScene(rparam?: IRendererParam, renderProcessesTotal?: number, createNewCamera?: boolean): IRendererScene;
    
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     * @param captureEnabled the default value is true
     * @param bubbleEnabled the default value is false
     */
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     */
    removeEventListener(type: number, target: any, func: (evt: any) => void): void;
    
    clear(): void;
    /**
     * @param node IRendererSceneNode instance
     * @param index the default value is -1
     */
    addSceneNode(node: IRendererSceneNode, index?: number): void;
    getNodesTotal(): number;
    getNodes(): IRendererSceneNode[];
    getNodeAt(i: number): IRendererSceneNode;
    getSceneAt(i: number): IRendererScene;
    addScene(sc: IRendererScene): IRendererSceneNode;
    
    run(): void;setAutoRunning(auto: boolean): IRendererSceneGraph;
    isAutoRunning(): boolean;
}