
import IRendererScene from "../../../vox/scene/IRendererScene";
import RSCGraph from "../../../vox/scene/RSCGraph";
import CoRendererScene from "./CoRendererScene";

export default class RendererSceneGraph extends RSCGraph {

    // private m_map: Map<number, IRendererSceneNode> = new Map();
    // private m_nodes: IRendererSceneNode[] = [];

    // rayPickFlag = false;

    // constructor() {
    // }
    
    protected createRScene(): IRendererScene {
        return new CoRendererScene();
    }
}