
import Vector3D from "../../vox/math/Vector3D";
import RendererDeviece from "../../vox/render/RendererDeviece";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import FrustrumFrame3DEntity from "../../vox/entity/FrustrumFrame3DEntity";
import ScreenAlignPlaneEntity from "../../vox/entity/ScreenAlignPlaneEntity";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import FBOInstance from "../../vox/scene/FBOInstance";
import CameraBase from "../../vox/view/CameraBase";
import MathConst from "../../vox/math/MathConst";
import DepthMaterial from "./material/DepthMaterial";
import RendererState from "../../vox/render/RendererState";
import { GLStencilFunc, GLStencilOp } from "../../vox/render/RenderConst";
import DebugFlag from "../../vox/debug/DebugFlag";

export class DemoBase {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_targetEntity: DisplayEntity = null;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoBase::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setAttriStencil(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus", this.m_rscene.getViewWidth() - 200);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //  let axis: Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            // add common 3d display entity
            let plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            this.m_rscene.addEntity(plane);
            this.m_targetEntity = plane;

            let box:Box3DEntity = new Box3DEntity();
            box.initializeCube(200.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
            this.m_rscene.addEntity(box);
            /*
            let depMaterial: DepthMaterial = new DepthMaterial();
            // add common 3d display entity
            let depthPlane:Plane3DEntity = new Plane3DEntity();
            //depthPlane.setMaterial(depMaterial);
            depthPlane.copyMeshFrom(plane);
            depthPlane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            depthPlane.setScaleXYZ(0.7,0.7,0.7);
            depthPlane.setXYZ(0.0, 200.0, 0.0);
            this.m_rscene.addEntity(depthPlane);
            //*/
            this.m_rscene.setClearRGBColor3f(0.1,0.2,0.1);
            this.initConfig();
            this.update();
        }
    }

    private m_depMaterial: DepthMaterial = new DepthMaterial();
    private m_fboIns: FBOInstance = null;
    private initConfig(): void {
        
        this.m_fboIns = this.m_rscene.createFBOInstance();
        this.m_fboIns.asynFBOSizeWithViewport();
        this.m_fboIns.setClearRGBAColor4f(1.0,1.0,1.0,1.0);
        this.m_fboIns.createFBOAt(0,512,512,true,false);
        this.m_fboIns.setRenderToRTTTextureAt(0, 0);
        this.m_fboIns.setRProcessIDList([0]);

        this.m_fboIns.setGlobalRenderState(RendererState.NORMAL_STATE);
        this.m_fboIns.setGlobalMaterial(this.m_depMaterial);
        
        let scrPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_fboIns.getRTTAt(0)]);
        scrPlane.setOffsetRGB3f(0.1,0.1,0.1);
        this.m_rscene.addEntity(scrPlane, 1);

        
        this.m_depMaterial.__$attachThis();
    }
    private m_flag: boolean = true;
    private mouseDown(evt: any): void {

        this.m_flag = true;
        DebugFlag.Flag_0 = 1;

        /*
        if(this.m_targetEntity != null && this.m_targetEntity.isInRenderer()) {

            let depthPlane:Plane3DEntity = new Plane3DEntity();
            //depthPlane.setMaterial(depMaterial);
            depthPlane.copyMeshFrom(this.m_targetEntity);
            depthPlane.initializeXOZ(-400.0, -400.0, 800.0, 800.0);
            depthPlane.setScaleXYZ(0.7,0.7,0.7);
            depthPlane.setXYZ(0.0, 200.0, 0.0);
            this.m_rscene.addEntity(depthPlane);
            this.m_targetEntity = null;
        }
        //*/
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps

        this.m_statusDisp.render();

        /*
        if(this.m_targetEntity != null && this.m_targetEntity.isRenderEnabled()) {

            let depMaterial: DepthMaterial = new DepthMaterial();
            let depthPlane:Plane3DEntity = new Plane3DEntity();
            depthPlane.setMaterial(depMaterial);
            depthPlane.copyMeshFrom(this.m_targetEntity);
            depthPlane.initializeXOZ(-400.0, -400.0, 800.0, 800.0);
            depthPlane.setScaleXYZ(0.7,0.7,0.7);
            depthPlane.setXYZ(0.0, 200.0, 0.0);
            this.m_rscene.addEntity(depthPlane);
            this.m_targetEntity = null;
        }
        //*/
    }
    run(): void {

        //  if(this.m_flag) {
        //      this.m_flag = false;
        //  }
        //  else {
        //      return;
        //  }
        
        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        //this.m_rscene.run(true);

        //this.m_rscene.runBegin();
        this.m_rscene.update(true);

        this.m_fboIns.run(true,true);

        this.m_fboIns.setRenderToBackBuffer();
        
        //this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runEnd();

    }
}
export default DemoBase;