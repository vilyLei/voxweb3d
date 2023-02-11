import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSceneNode from "./IRendererSceneNode";
import RendererSceneNode from "./RendererSceneNode";
import IRendererSceneGraph from "./IRendererSceneGraph";

export default class RendererSceneGraph implements IRendererSceneGraph {
    private m_scenes: IRendererScene[] = [];
    private m_nodes: IRendererSceneNode[] = [];
    rayPickFlag: boolean = false;
    constructor() {
    }
    clear(): void {

        const ls = this.m_nodes;
        let tot = ls.length;
        let i = 0;

        for (; i < tot; ++i) {
            ls[i].clear();
        }
        this.m_nodes = [];
    }
    addSceneNode(node: IRendererSceneNode, index: number = -1): void {

        if (node != null) {

            const ls = this.m_nodes;
            let tot = ls.length;
            let i = 0;
            for (; i < tot; ++i) {
                if (ls[i] == node) {

                    break;
                }
            }
            if (i >= tot) {
                ls.push(node);
            }

        }
    }
    getNodesTotal(): number {
        return this.m_nodes.length;
    }
    getNodes(): IRendererSceneNode[] {
        return this.m_nodes;
    }
    getNodeAt(i: number): IRendererSceneNode {
        if (i >= 0 && i < this.m_nodes.length) return this.m_nodes[i];
        return null;
    }
    addScene(sc: IRendererScene): IRendererSceneNode {
        if (sc != null) {
            let node = new RendererSceneNode(sc);
            this.m_nodes.push(node);
            return node;
        }
        return null;
    }
    createNode(sc: IRendererScene): IRendererSceneNode {
        if (sc != null) {
            return new RendererSceneNode(sc);
        }
        return null;
    }
    run(): void {

        let pickFlag: boolean = true;
        let list = this.m_nodes;
        let total: number = list.length;
        let i: number = total - 1;

        let scene: IRendererScene = list[i].getRScene();
        scene.runBegin(true, true);
        scene.update(false, true);
        pickFlag = scene.isRayPickSelected();

        i -= 1;
        for (; i >= 0; --i) {
            const node = list[i] as RendererSceneNode;
            scene = list[i].getRScene();
            if(node.p0Call0)node.p0Call0(scene, this);
            scene.runBegin(false, true);
            scene.update(false, !pickFlag);
            pickFlag = pickFlag || scene.isRayPickSelected();
            this.rayPickFlag = pickFlag;  
            if(node.p0Call1)node.p0Call1(scene, this);
        }
        /////////////////////////////////////////////////////// ---- mouseTest end.

        /////////////////////////////////////////////////////// ---- rendering begin.
        for (i = 0; i < total; ++i) {
            const node = list[i] as RendererSceneNode;
            scene = list[i].getRScene();
            if(node.p1Call0)node.p0Call0(scene, this);
            scene.renderBegin(node.contextResetEnabled);
            const idList = node.processIdList;
            if (idList == null) {
                scene.run(false);
            }
            else {
                for (let j = 0; j < idList.length; ++j) {
                    scene.runAt(idList[j]);
                }
            }
            scene.runEnd();
            if(node.p1Call0)node.p0Call1(scene, this);
        }
    }
}