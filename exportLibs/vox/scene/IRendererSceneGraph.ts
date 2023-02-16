import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSceneNode from "./IRendererSceneNode";
import IRendererSceneGraphStatus from "./IRendererSceneGraphStatus";
import IRendererParam from "./IRendererParam";

export default interface IRendererSceneGraph extends IRendererSceneGraphStatus {

    createRendererParam(): IRendererParam;
    createRendererSceneParam(): IRendererParam;
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
    
    run(): void;
}