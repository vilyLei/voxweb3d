import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureConst from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import RendererSubScene from "../vox/scene/RendererSubScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import DebugFlag from "../vox/debug/DebugFlag";
import StencilOutline from "../renderingtoy/mcase/outline/StencilOutline";
import OcclusionPostOutline from "../renderingtoy/mcase/outline/OcclusionPostOutline";
import DracoMeshBuilder from "../voxmesh/draco/DracoMeshBuilder";
import ThreadSystem from "../thread/ThreadSystem";
import DracoMesh from "../voxmesh/draco/DracoMesh";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import { RenderableEntityBlock } from "../vox/scene/block/RenderableEntityBlock";
import { RenderableMaterialBlock } from "../vox/scene/block/RenderableMaterialBlock";
import { FixSizeLine3DMaterial } from "./material/FixSizeLine3DMaterial";

import IRendererScene from "../vox/scene/IRendererScene";
import { IRendererSceneAccessor } from "../vox/scene/IRendererSceneAccessor";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import CameraBase from "../vox/view/CameraBase";
import { IRenderCamera } from "../vox/render/IRenderCamera";

class SceneAccessor implements IRendererSceneAccessor {
    // srcCam: IRenderCamera;
    // dstCam: IRenderCamera;
    constructor() { }
    renderBegin(rendererScene: IRendererScene): void {
        let p = rendererScene.getRenderProxy();        
        p.clearDepth(1.0);
        // let sCam = this.srcCam;
        // this.dstCam.lookAtRH(sCam.getPosition(), sCam.getLookAtPosition(), sCam.getUV());
        // this.dstCam.update();
    }
    renderEnd(rendererScene: IRendererScene): void {
    }
}
export class DemoFix3DSize {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_editScene: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_renderGraph = new RendererSceneGraph();
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoFix3DSize::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 20, 9000.0);
            rparam.setAttriStencil(true);
            rparam.setCamPosition(1000.0, 1000.0, 1000.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
            this.m_rscene.updateCamera();

            
            // rparam = new RendererParam();
            // rparam.cameraPerspectiveEnabled = false;
            // rparam.setCamProject(45, 20, 9000.0);
            // rparam.setAttriStencil(true);
            // rparam.setCamPosition(1000.0, 1000.0, 1000.0);

            let sa = new SceneAccessor();
            this.m_editScene = this.m_rscene.createSubScene() as RendererSubScene;
            this.m_editScene.initialize(rparam, 3, false);
            this.m_editScene.setAccessor( sa );
            this.m_editScene.enableMouseEvent(true);
            this.m_editScene.updateCamera();
            // sa.srcCam = this.m_rscene.getCamera();
            // sa.dstCam = this.m_editScene.getCamera();

            this.m_renderGraph.addScene( this.m_rscene );
            this.m_renderGraph.addScene( this.m_editScene );

            let rscene = this.m_rscene;
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            //rscene.materialBlock = materialBlock;
            let entityBlock = new RenderableEntityBlock();
            entityBlock.initialize();
            //rscene.entityBlock = entityBlock;

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            // this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            // this.m_editScene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.editMouseDown);            
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown, true, true);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.editMouseBgDown, true, true);

            this.initScene();

            this.update();
        }
    }
    private initScene(): void {

        
        // let cam0 = this.m_rscene.getCamera();
        // let cam1 = this.m_editScene.getCamera();

        let axis = new Axis3DEntity();
        axis.initialize(500);
        (axis.getMaterial() as any).setRGB3f(0.5,0.5,0.5);
        this.m_rscene.addEntity(axis);

        // let axisSrc = new Axis3DEntity();
        // axisSrc.initialize(150);

        // let material0 = new FixSizeLine3DMaterial();

        let axis0 = new Axis3DEntity();
        axis0.initialize(150);
        axis0.setXYZ(90, 0, 240);
        this.m_rscene.addEntity(axis0);
        
        let material1 = new FixSizeLine3DMaterial(false);
        let axis1 = new Axis3DEntity();
        axis1.setMaterial(material1);
        axis1.setXYZ(100, 0, 250);
        axis1.initialize(100);
        this.m_editScene.addEntity(axis1);

        // let plane: Plane3DEntity = new Plane3DEntity();
        // plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/brickwall_big.jpg")]);
        // plane.setXYZ(0, -170, 0);
        // this.m_rscene.addEntity(plane);
        
    }
    private m_flag: boolean = true;
    private editMouseBgDown(evt: any): void {
        console.log("edit mouse bg down...");
    }
    private mouseBgDown(evt: any): void {

        console.log("mouse bg down...");
    }
    private editMouseDown(evt: any): void {
        console.log("edit mouse down...");

    }
    private mouseDown(evt: any): void {

        this.m_flag = true;
        console.log("mouse down...");
        DebugFlag.Flag_0 = 1;
    }
    private m_timeoutId: any = -1;
    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }

        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps

        this.m_statusDisp.render();

    }
    private m_camVer = -1;
    run(): void {
        let cam = this.m_rscene.getCamera();
        // console.log("ver: ",cam.version);
        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_renderGraph.run();

        // this.m_rscene.run();
        // DebugFlag.Flag_0 = 0;
    }
}
export default DemoFix3DSize;