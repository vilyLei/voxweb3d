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

import IRendererScene from "../vox/scene/IRendererScene";
import { IRendererSceneAccessor } from "../vox/scene/IRendererSceneAccessor";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { PostOutline } from "./effect/PostOutline";

class SceneAccessor implements IRendererSceneAccessor {
    constructor() { }
    renderBegin(rendererScene: IRendererScene): void {
        let p = rendererScene.getRenderProxy();        
        p.clearDepth(1.0);
    }
    renderEnd(rendererScene: IRendererScene): void {
    }
}
export class DemoOutline2 {
    constructor() { }

    private m_postOutline: OcclusionPostOutline = new OcclusionPostOutline();
    private m_rscene: RendererScene = null;
    private m_editScene: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
	private m_outline: PostOutline;

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoOutline2::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
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

            this.m_editScene = this.m_rscene.createSubScene();
            this.m_editScene.initialize(rparam, 3, false);
            this.m_editScene.setAccessor(new SceneAccessor());
            this.m_editScene.enableMouseEvent(true);

            let axis0 = new Axis3DEntity();
            axis0.initialize(500);
            this.m_editScene.addEntity(axis0);

            let rscene = this.m_rscene;
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            rscene.materialBlock = materialBlock;
            let entityBlock = new RenderableEntityBlock();
            entityBlock.initialize();
            rscene.entityBlock = entityBlock;

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            // this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            // this.m_editScene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.editMouseDown);            
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown, true, true);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.editMouseBgDown, true, true);


			// this.m_outline = new PostOutline(rscene);

            
            this.m_postOutline.initialize(this.m_rscene, 1, [0, 1]);
            this.m_postOutline.setFBOSizeScaleRatio(0.5);
            this.m_postOutline.setRGB3f(0.0, 2.0, 0.0);
            this.m_postOutline.setOutlineDensity(2.5);
            this.m_postOutline.setOcclusionDensity(0.2);

            this.initScene();

            this.update();
        }
    }
    private initScene(): void {

        let scale: number = 2.5;
        // let box: Box3DEntity = new Box3DEntity();
        // box.uvPartsNumber = 6;
        // box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixparts.jpg")]);
        // box.setScaleXYZ(scale, scale, scale);
        // box.setRotationXYZ(Math.random() * 300.0, Math.random() * 300.0, Math.random() * 300.0);
        // box.setXYZ(0.0, 60.0, 0.0);
        // this.m_rscene.addEntity(box);
        // (box.getMaterial() as any).setRGB3f(0.9, 0.3, 0.2);

        let plane: Plane3DEntity = new Plane3DEntity();
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/brickwall_big.jpg")]);
        plane.setXYZ(0, -170, 0);
        this.m_rscene.addEntity(plane);
        
        let box0 = new Box3DEntity();
        box0.initializeCube(80, [this.getImageTexByUrl("static/assets/default.jpg")]);
        box0.setXYZ(0, 1665, 12);
        this.m_rscene.addEntity(box0);
        let box1 = new Box3DEntity();
        box1.initializeCube(80, [this.getImageTexByUrl("static/assets/default.jpg")]);
        box1.setXYZ(0, 1069, 17);
        this.m_rscene.addEntity(box1);

        //m_postOutline
        if(this.m_postOutline != null) {
            this.m_postOutline.setTargetList([box0, box1]);
        }
        if(this.m_outline != null) {
            this.m_outline.select([box0, box1]);
        }
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
    run(): void {

        ThreadSystem.Run();
        //  console.log("run begin...");

        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_rscene.run();


            this.m_postOutline.drawBegin();
            this.m_postOutline.draw();
            //this.m_postOutline.drawTest();
            this.m_postOutline.drawEnd();

            // this.m_rscene.runAt(3);
            // this.m_rscene.runAt(4);

            this.m_rscene.runEnd();

        DebugFlag.Flag_0 = 0;
    }
}
export default DemoOutline2;