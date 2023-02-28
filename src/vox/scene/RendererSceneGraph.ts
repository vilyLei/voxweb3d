
import RendererScene from "./RendererScene";
import IRendererScene from "./IRendererScene";
import RSCGraph from "./RSCGraph";

export default class RendererSceneGraph extends RSCGraph {

    // private m_map: Map<number, IRendererSceneNode> = new Map();
    // private m_nodes: IRendererSceneNode[] = [];

    // rayPickFlag = false;

    // constructor() {
    // }
    
    protected createRScene(): IRendererScene {
        return new RendererScene();
    }
}