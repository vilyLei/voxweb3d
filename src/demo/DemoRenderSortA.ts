
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import Color4 from "../vox/material/Color4";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import RendererState from "../vox/render/RendererState";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import BoxFrame3D from "../vox/entity/BoxFrame3D";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Vector3D from "../vox/math/Vector3D";
import IColorMaterial from "../vox/material/mcase/IColorMaterial";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import IRODisplaySorter from "../vox/render/IRODisplaySorter";
import IRPODisplay from "../vox/render/IRPODisplay";

class PosYDsistanceSorter implements IRODisplaySorter {
    sortRODisplay(nodes: IRPODisplay[], nodesTotal: number): number {
        for (let i = 0; i < nodesTotal; ++i) {
            nodes[i].value = nodes[i].pos.y;
        }
        return 0;
    }
}
/**
 * This example: rendering runtime sort renderable objects
 */
export class DemoRenderSortA {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_targets: DisplayEntity[] = [];
    getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoRenderSortA::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            
            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.m_rscene.setAutoRenderingSort(true);
            this.m_rscene.setProcessSortEnabledAt(1, true, new PosYDsistanceSorter());

            let tex0 = this.getTexByUrl("static/assets/wood_01.jpg");
            let tex1 = this.getTexByUrl("static/assets/yanj.jpg");
            let tex2 = this.getTexByUrl("static/assets/decorativePattern_01.jpg");

            let axis = new Axis3DEntity();
            axis.initialize();
            this.m_rscene.addEntity(axis, 0);

            let plane = new Plane3DEntity();
            plane.showDoubleFace();
            plane.initializeXOZ(-300.0, -300.0, 400.0, 400.0, [tex2]);
            plane.setXYZ(0, -60, 0);
            this.m_rscene.addEntity(plane, 1);

            plane = new Plane3DEntity();
            plane.initializeXOZ(-200.0, -200.0, 400.0, 400.0, [tex1]);
            plane.setXYZ(80, -100, 80);
            this.m_rscene.addEntity(plane, 1);
            plane.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
            this.m_targets.push(plane);
            this.m_plane01 = plane;

            plane = new Plane3DEntity();
            plane.initializeXOZ(-150.0, -150.0, 300.0, 300.0, [tex0]);
            plane.setXYZ(80, -30, 80);
            this.m_rscene.addEntity(plane, 1);
        }
    }
    private m_plane01: Plane3DEntity;
    private m_isChanged = true;
    private mouseDown(evt: any): void {

        // this.m_isChanged = !this.m_isChanged;

        if(this.m_plane01 != null) {
            let pv = this.m_plane01.getPosition();
            pv.y += 10;
            this.m_plane01.setPosition(pv);
            console.log("mouse down, pos: ", this.m_plane01.getPosition());
        }
        console.log("mouse down, this.m_isChanged: ", this.m_isChanged);

        // this.m_rscene.setProcessSortEnabledAt(1, this.m_isChanged);
        // this.m_rscene.setProcessSortEnabledAt(0, true);
        return;
        if (this.m_targets != null && this.m_targets.length > 0) {
            // move rendering runtime displayEntity to different renderer process
            if (this.m_isChanged) {
                this.m_rscene.moveEntityTo(this.m_targets[0], 2);
            }
            else {
                this.m_rscene.moveEntityTo(this.m_targets[0], 0);
            }
            this.m_isChanged = !this.m_isChanged;
        }
    }
    run(): void {
        if(this.m_rscene != null) {
            this.m_statusDisp.update();
    
            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
            this.m_rscene.run();
        }

        // this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}