import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";

import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import IRendererScene from "../../vox/scene/IRendererScene";
import RendererScene from "../../vox/scene/RendererScene";
import RendererSubScene from "../../vox/scene/RendererSubScene";

import Vector3D from "../../vox/math/Vector3D";
import CameraViewRay from "../../vox/view/CameraViewRay";
import { OrthoUIScene } from "../../vox/ui/OrthoUIScene";
import { UserInteraction } from "./UserInteraction";

import MouseEvent from "../event/MouseEvent";
class RendererSceneNode {
    private m_rscene: IRendererScene = null;
    priority: number = 0;
    contextResetEnabled: boolean = false;
    constructor(rscene: IRendererScene) {
        if (rscene == null) {
            throw Error("rscene is null !!!");
        }
        this.m_rscene = rscene;
    }
    getRScene(): IRendererScene {
        return this.m_rscene;
    }
}
export class EngineBase {

    constructor() { }

    private m_sceneList: RendererSceneNode[] = [];

    readonly texLoader: ImageTextureLoader = null;
    readonly rscene: RendererScene = null;
    readonly uiScene: OrthoUIScene = null;
    readonly interaction: UserInteraction = new UserInteraction();

    initialize(param: RendererParam = null, renderProcessesTotal: number = 3): void {

        if (this.rscene == null) {

            if (param == null) {
                param = new RendererParam();
                param.setAttriAntialias(!RendererDevice.IsMobileWeb());
                param.setCamPosition(1800.0, 1800.0, 1800.0);
                param.setCamProject(45, 20.0, 7000.0);
            }

            let rscene: RendererScene;
            rscene = new RendererScene();
            rscene.initialize(param, renderProcessesTotal);
            rscene.updateCamera();

            // rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            // rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

            let selfT: any = this;
            selfT.rscene = rscene;
            selfT.texLoader = new ImageTextureLoader(this.rscene.textureBlock);

            selfT.uiScene = new OrthoUIScene();
            this.uiScene.initialize(this.rscene);

            this.interaction.initialize(rscene);

            let sceneNode: RendererSceneNode = new RendererSceneNode(this.rscene);
            sceneNode.priority = 0;
            sceneNode.contextResetEnabled = true;
            this.m_sceneList.push(sceneNode);

            sceneNode = new RendererSceneNode(this.uiScene);
            sceneNode.priority = 1;
            sceneNode.contextResetEnabled = true;
            this.m_sceneList.push(sceneNode);

        }
    }

    appendRendererScene(param: RendererParam, renderProcessesTotal: number = 3, createNewCamera: boolean = true, priority: number = -1): RendererSceneNode {

        if (param == null) {
            param = new RendererParam();
            param.setAttriAntialias(!RendererDevice.IsMobileWeb());
            param.setCamPosition(1800.0, 1800.0, 1800.0);
            param.setCamProject(45, 20.0, 7000.0);
        }
        let subScene: RendererSubScene = this.rscene.createSubScene();
        subScene.initialize(param, renderProcessesTotal, createNewCamera);
        let sceneNode: RendererSceneNode = new RendererSceneNode(subScene);
        sceneNode.priority = priority < 0 ? this.m_sceneList.length : priority;
        this.m_sceneList.push(sceneNode);

        return sceneNode;
    }
    getRendererSceneAt(i: number): RendererSceneNode {
        if (i >= 0 && i < this.m_sceneList.length) {
            return this.m_sceneList[i];
        }
        return null;
    }
    getRendererScenesTotal(): number {
        return this.m_sceneList.length;
    }
    setPriorityAt(i: number, priority: number): void {
        if (priority < 1) {
            throw Error("priority < 1 !!!");
        }
        if (i > 0 && i < this.m_sceneList.length) {
            this.m_sceneList[i].priority = priority;
        }
    }
    swapScenePriorityAt(i: number, j: number): void {

        if (i != 0 && j != 0) {
            if ((i != j) && (i >= 0 && i < this.m_sceneList.length) && (j >= 0 && j < this.m_sceneList.length)) {
                let priority: number = this.m_sceneList[i].priority;
                this.m_sceneList[i].priority = this.m_sceneList[j].priority;
                this.m_sceneList[j].priority = priority;
            }
        }
    }
    swapSceneAt(i: number, j: number): void {

        if (i != 0 && j != 0) {
            if ((i != j) && (i >= 0 && i < this.m_sceneList.length) && (j >= 0 && j < this.m_sceneList.length)) {
                let priority: number = this.m_sceneList[i].priority;
                this.m_sceneList[i].priority = this.m_sceneList[j].priority;
                this.m_sceneList[j].priority = priority;
                let node: RendererSceneNode = this.m_sceneList[i];
                this.m_sceneList[i] = this.m_sceneList[j];
                this.m_sceneList[j] = node;
            }
        }
    }
    sortScenes(): void {
        this.m_sceneList[0].priority = 0;
        this.m_sceneList.sort((a, b) => { return a.priority - b.priority });
    }
    showInfo(): void {
        console.log("showInfo() this.m_sceneList: ", this.m_sceneList);
    }
    // private m_flag: boolean = true;
    // private mouseDown(evt: any): void {
    //     this.m_flag = true;
    // }
    // private mouseUp(evt: any): void {
    //     this.m_flag = true;
    // }
    run(): void {
        // if (this.m_flag) {
        //     //this.m_flag = false;
        // } else {
        //     return;
        // }

        this.interaction.run();

        ///*
        let pickFlag: boolean = true;
        let list = this.m_sceneList;
        let total: number = list.length;
        let i: number = total - 1;

        let scene: IRendererScene = list[i].getRScene();
        scene.runBegin(true, true);
        scene.update(false, true);
        pickFlag = scene.isRayPickSelected();

        i -= 1;
        for (; i >= 0; --i) {
            scene = list[i].getRScene();
            scene.runBegin(false, true);
            scene.update(false, !pickFlag);
            pickFlag = pickFlag || scene.isRayPickSelected();
        }
        /////////////////////////////////////////////////////// ---- mouseTest end.

        /////////////////////////////////////////////////////// ---- rendering begin.
        let node: RendererSceneNode;
        for (i = 0; i < total; ++i) {
            node = list[i];
            scene = list[i].getRScene();
            scene.renderBegin(node.contextResetEnabled);
            scene.run(false);
            scene.runEnd();
        }
    }


}
export { RendererSceneNode };
export default EngineBase;