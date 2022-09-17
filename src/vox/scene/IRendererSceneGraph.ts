import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSceneNode from "./IRendererSceneNode";

export default interface IRendererSceneGraph {

    clear(): void;
    addSceneNode(node: IRendererSceneNode, index?: number): void;
    getNodesTotal(): number;
    getNodes(): IRendererSceneNode[];
    getNodeAt(i: number): IRendererSceneNode;
    addScene(sc: IRendererScene): IRendererSceneNode;
    run(): void;
}