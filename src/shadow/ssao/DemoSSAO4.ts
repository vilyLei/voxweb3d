
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";
import Color4 from "../../vox/material/Color4";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import FBOInstance from "../../vox/scene/FBOInstance";
import AONVMaterial from "./material/AONVMaterial";
import Vector3D from "../../vox/math/Vector3D";
import SSAONoiseData from "./material/SSAONoiseData";
import AOEntityMaterial from "./material/AOEntityMaterial";
import AODepTexMaterial from "./material/AODepTexMaterial";
import AOPostMaterial from "./material/AOPostMaterial";
import ScreenAlignPlaneEntity from "../../vox/entity/ScreenAlignPlaneEntity";
import PingpongBlur from "../../renderingtoy/mcase/PingpongBlur";
import DepthTextureProxy from "../../vox/texture/DepthTextureProxy";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";

export class DemoSSAO4 {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_aoPreFBO: FBOInstance = null;
    private m_aoFBO: FBOInstance = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_blurModule: PingpongBlur = null;

    private m_clearColor: Color4 = new Color4();
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {

        console.log("DemoSSAO4::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 800,5000.0);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            rparam.setAttriAntialias(true);
            rparam.setAttriStencil(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 4);
            this.m_rscene.updateCamera();
            //this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //  let axis: Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(500.0);
            //  this.m_rscene.addEntity(axis,1);

            this.update();

            this.initTest();
        }
    }
    private m_aoSrcPlane: ScreenAlignPlaneEntity;
    private m_aoDstPlane: ScreenAlignPlaneEntity;
    private m_aoPreMaterial: AONVMaterial;
    private initTest(): void {

        this.m_aoPreMaterial = new AONVMaterial();
        this.m_aoPreMaterial.initializeByCodeBuf(true);


        let depthTex = this.m_rscene.textureBlock.getDepthTextureAt(0);
        depthTex.toDepthUnsignedInt();
        //depthTex.toDepthAndStencil();
        this.m_aoPreFBO = this.m_rscene.createFBOInstance();
        this.m_aoPreFBO.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);   // set rtt background clear rgb(r=0.0,g=0.0,b=0.0) color
        this.m_aoPreFBO.createFBOAt(0, 512, 512, true, false);
        this.m_aoPreFBO.setGlobalMaterial( this.m_aoPreMaterial, true );
        this.m_aoPreFBO.setRenderToRTTTextureAt(0, 0);              // framebuffer color attachment 0: nomal texture
        this.m_aoPreFBO.setRenderToTexture(depthTex, 1);            // framebuffer color attachment 1: depth texture
        
        this.m_aoPreFBO.setRProcessIDList([0]);
        //*
        let aoNoise: SSAONoiseData = new SSAONoiseData();
        aoNoise.initialize(this.m_rscene.textureBlock);
        //random.png
        let noiseTex: TextureProxy = aoNoise.createNoiseTex();
        //let noiseTex: TextureProxy = this.getImageTexByUrl("static/assets/random.png");
        let aoMaterial: AODepTexMaterial = new AODepTexMaterial(aoNoise, 16);
        this.m_aoSrcPlane = new ScreenAlignPlaneEntity();
        this.m_aoSrcPlane.setMaterial(aoMaterial);
        this.m_aoSrcPlane.initialize(-1.0, -1.0, 2.0, 2.0, [this.m_aoPreFBO.getRTTAt(0), noiseTex, this.m_aoPreFBO.getRTTAt(1)]);
        //this.m_rscene.addEntity(this.m_aoSrcPlane, 1);

        this.m_aoFBO = this.m_rscene.createFBOInstance();
        this.m_aoFBO.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);      // set rtt background clear rgb(r=0.0,g=0.0,b=0.0) color
        this.m_aoFBO.createFBOAt(0, 512, 512, true, true);
        this.m_aoFBO.setRenderToRTTTextureAt(2, 0);             // framebuffer color attachment 0: ao color texture

        this.m_aoDstPlane = new ScreenAlignPlaneEntity();
        this.m_aoDstPlane.initialize(-1.0, -1.0, 2.0, 2.0, [this.m_aoFBO.getRTTAt(0)]);
        //this.m_rscene.addEntity(this.m_aoDstPlane, 1);

        let size: number = 512;
        this.m_blurModule = new PingpongBlur(this.m_rscene.getRenderer());
        this.m_blurModule.setBlurCount(2);
        this.m_blurModule.setSyncViewSizeEnabled(false);
        this.m_blurModule.setFBOSize(size, size);
        this.m_blurModule.setBlurDensity(1.0);
        this.m_blurModule.bindDrawEntity(this.m_aoDstPlane);
        this.m_blurModule.setBackbufferVisible(false);
        //*/

        let aoTex: TextureProxy = this.m_blurModule.getDstTexture();
        //let aoTex: TextureProxy = this.getImageTexByUrl("static/assets/noise.jpg");
        
        let plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial( new AOEntityMaterial() );
        plane.initializeXOZSquare(800.0, [this.getImageTexByUrl("static/assets/wood_01.jpg"), aoTex]);
        this.m_rscene.addEntity(plane);

        ///*
        let box: Box3DEntity = new Box3DEntity();
        box.setMaterial( new AOEntityMaterial() );
        box.initializeCube(300.0, [this.getImageTexByUrl("static/assets/box_wood01.jpg"), aoTex]);
        this.m_rscene.addEntity(box);
        let srcBox: Box3DEntity = box;
        let scale: number = 1.0;
        for (let i: number = 0; i < 3; ++i) {
            box = new Box3DEntity();
            box.setMaterial( new AOEntityMaterial() );
            box.copyMeshFrom(srcBox);
            box.initializeCube(300.0, [this.getImageTexByUrl("static/assets/brickwall_big.jpg"), aoTex]);
            scale = 0.1 + Math.random() * 0.8;
            box.setScaleXYZ(scale, scale, scale);
            box.setXYZ(Math.random() * 600.0 - 300.0, Math.random() * 200.0, Math.random() * 600.0 - 300.0);
            box.setRotationXYZ(Math.random() * 300.0, Math.random() * 300.0, Math.random() * 300.0);
            this.m_rscene.addEntity(box);

        }
        //*/
        
        let srcPlane: ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
        //srcPlane.initialize(-1.0, -1.0, 1.0, 1.0, [this.m_aoPreFBO.getRTTAt(0)]);
        srcPlane.initialize(-1.0, -1.0, 1.0, 1.0, [this.m_aoFBO.getRTTAt(0)]);
        this.m_rscene.addEntity(srcPlane, 2);
    }

    private m_flag: boolean = true;
    private mouseDown(evt: any): void {
        //console.log("mouse down... ...");
        this.m_flag = true;
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_statusDisp.render();
    }
    run(): void {
        //  if(this.m_flag) {
        //      this.m_flag = false;
        //  }
        //  else {
        //      return;
        //  }
        //  //  console.log("############# render begin...");

        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        //this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);

        //this.m_rscene.run( true );
        ///*
        this.m_rscene.runBegin();
        this.m_rscene.update();

        // --------------------------------------------- fbo run begin
        this.m_aoPreFBO.run(false,true);
        //console.log("       ##### render st01...");

        this.m_aoFBO.runBegin();
        this.m_aoFBO.drawEntity(this.m_aoSrcPlane);
        this.m_aoFBO.runEnd();
        // pingpong blur
        if (this.m_blurModule != null) {
            this.m_blurModule.run();
        }
        //  // --------------------------------------------- fbo run end

        this.m_rscene.setRenderToBackBuffer();

        //this.m_rscene.setClearColor( this.m_clearColor );
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runAt(2);

        this.m_rscene.runEnd();
        //*/
        //this.m_profileInstance.run();
    }
}
export default DemoSSAO4;