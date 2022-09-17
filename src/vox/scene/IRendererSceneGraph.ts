import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSceneNode from "./IRendererSceneNode";
import RendererSceneNode from "./RendererSceneNode";

export default interface IRendererSceneGraph {

    addScene(sc: IRendererScene): IRendererSceneNode;
    run(): void;
}