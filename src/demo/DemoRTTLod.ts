
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import ScreenAlignPlaneEntity from "../vox/entity/ScreenAlignPlaneEntity";
import TextureConst from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import PingpongBlur from "../renderingtoy/mcase/PingpongBlur";
import FBOInstance from "../vox/scene/FBOInstance";
import CameraBase from "../vox/view/CameraBase";
import MathConst from "../vox/math/MathConst";
import RTTTextureProxy from "../vox/texture/RTTTextureProxy";
import WrapperTextureProxy from "../vox/texture/WrapperTextureProxy";
import { IWrapperTexture } from "../vox/render/texture/IWrapperTexture";

export class DemoRTTLod {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_blurModule:PingpongBlur = null;

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoRTTLod::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 4);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //  let axis: Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            this.update();
            
            this.m_blurModule = new PingpongBlur(this.m_rscene);
            //this.m_blurModule.setSyncViewSizeEnabled(false);
            this.m_blurModule.setFBOSize(256,256);
            this.m_blurModule.setBlurDensity(1.0);
            this.m_blurModule.bindSrcProcessId(3);

            this.initMirrorRTT();
        }
    }
    private m_projType: number = 1;
    private m_srcRTTFboIns: FBOInstance = null;
    private m_dstRttFboIns: FBOInstance = null;
    private m_rttCamera:CameraBase = null;
    private m_wrapperTex: IWrapperTexture;
    private m_srcRTTPlane: ScreenAlignPlaneEntity;
    private m_srcRTT:RTTTextureProxy = new RTTTextureProxy(512,512);
    private m_dstRTT:RTTTextureProxy = new RTTTextureProxy(512,512);
    private initMirrorRTT(): void {
        this.m_projType = 0;

        
        let box: Box3DEntity = new Box3DEntity();
        box.uvPartsNumber = 6;
        box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixParts.jpg")]);
        box.setScaleXYZ(2.0, 2.0, 2.0);
        box.setXYZ(0.0, 170.0, 0.0);
        this.m_rscene.addEntity(box, 0);

        
        //  this.m_dstRTT.mipmapEnabled = true;
        //  this.m_dstRTT.useMipmapFilter();

        //  this.m_dstRTT.mipmapEnabled = true;
        this.m_srcRTT.enableMipmap();
        
        this.m_srcRTTFboIns = this.m_rscene.createFBOInstance();
        this.m_srcRTTFboIns.asynFBOSizeWithViewport();
        this.m_srcRTTFboIns.setClearRGBAColor4f(0.3,0.0,0.3, 1.0);
        this.m_srcRTTFboIns.createFBOAt(0,512,512, true,false);
        //this.m_srcRTTFboIns.setRenderToRTTTextureAt(0, 0);
        this.m_srcRTTFboIns.setRenderToTexture(this.m_srcRTT, 0);
        this.m_srcRTTFboIns.setRProcessIDList([0]);
        
        this.m_dstRttFboIns = this.m_rscene.createFBOInstance();
        this.m_dstRttFboIns.asynFBOSizeWithViewport();
        this.m_dstRttFboIns.setClearRGBAColor4f(0.0,0.0,0.3, 1.0);
        this.m_dstRttFboIns.createFBOAt(1,512,512, true,false);
        this.m_dstRttFboIns.setRenderToTexture(this.m_dstRTT, 0);
        //this.m_dstRttFboIns.setRProcessIDList([0]);

        let plane:Plane3DEntity = new Plane3DEntity();
        //plane.flipVerticalUV = true;
        //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.m_srcRTTFboIns.getRTTAt(0)]);
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
        this.m_rscene.addEntity(plane, 0);

        let scrPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        //scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_blurModule.getDstTexture()]);
        //scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_dstRTT]);
        scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_srcRTT]);
        this.m_rscene.addEntity(scrPlane, 1);

        // 用于显示当前最终blur的结果
        let blurPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        blurPlane.mapLodEnabled = true;
        blurPlane.initialize(-0.495,-0.9,0.4,0.4, [this.m_srcRTT]);
        blurPlane.setTextureLodLevel(7.0);
        this.m_rscene.addEntity(blurPlane, 1);

        this.m_wrapperTex = this.m_rscene.textureBlock.createWrapperTex(64,64, false);
        this.m_wrapperTex.attachTex( this.m_srcRTTFboIns.getRTTAt(0) );
        this.m_srcRTTPlane =  new ScreenAlignPlaneEntity();
        this.m_srcRTTPlane.initialize(-1,-1,2,2, [this.m_wrapperTex]);
        this.m_rscene.addEntity(this.m_srcRTTPlane, 3);

        let viewWidth: number = 512.0;
        let viewHeight: number = 512.0;
        this.m_rttCamera = new CameraBase();
        this.m_rttCamera.name = "rttCamera";
        this.m_rttCamera.lookAtRH(new Vector3D(-800.0,800.0,800.0), new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,1.0,0.0));
        this.m_rttCamera.perspectiveRH(MathConst.DegreeToRadian(45.0),viewWidth/viewHeight,150.1,2000.0);
        this.m_rttCamera.setViewXY(0,0);
        this.m_rttCamera.setViewSize(viewWidth, viewHeight);
        this.m_rttCamera.update();

        //  this.m_stageDragSwinger.bindCamera( this.m_rttCamera );
        //  this.m_stageDragSwinger.setSpeed( -1.0 );
        
        let frustrum:FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustrum.initiazlize( this.m_rttCamera );
        frustrum.setScaleXYZ(0.5,0.5,0.5);
        this.m_rscene.addEntity( frustrum, 1);
        this.m_frustrum = frustrum;

    }
    private m_frustrum:FrustrumFrame3DEntity;
    private m_flag: boolean = true;
    private mouseDown(evt: any): void {

        this.m_flag = true;
        this.m_delay++;
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
    private m_delay: number = 0;
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
        if(this.m_projType == 1) {

            this.m_rscene.run(true);
        }
        else {
            let boo: boolean = this.m_frustrum.updateFrame( this.m_rttCamera );
            if(boo) {
                this.m_frustrum.updateMeshToGpu(this.m_rscene.getRenderProxy());
            }
            //this.m_dstRTT.mipmapEnabled = false;
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            this.m_rscene.useCamera(this.m_rttCamera);
            this.m_rscene.runBegin();
            this.m_rscene.update(false);
            
            // --------------------------------------------- fbo run begin
            
            this.m_srcRTTFboIns.run();
            this.m_srcRTTFboIns.generateMipmapTextureAt(0);
            //this.m_srcRTT.mipmapEnabled = true;
            //this.m_srcRTT.generateMipmap(this.m_rscene.getRenderProxy().Texture);
            /*
            // 将基本的 srcRTT 绘制到 dstRTT, texture level is 0
            //this.m_dstRTT.setSize(512,512);
            //this.m_dstRttFboIns.resizeFBO(512,512)
            //console.log("step 01.");
            //this.m_dstRttFboIns.setTextureLevel(0);
            this.m_dstRttFboIns.runBegin();
            this.m_dstRttFboIns.drawEntity( this.m_srcRTTPlane );
            this.m_dstRttFboIns.runEnd();
            this.m_dstRTT.mipmapEnabled = true;
            this.m_dstRTT.generateMipmap(this.m_rscene.getRenderProxy().getRC());
            //*/
            /*
            // draw dstRTT texture level is 1
            // blur first
            //this.m_wrapperTex.attachTex();
            //this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
            //      this.m_blurModule.setFBOSize(256, 256);
            //      this.m_blurModule.run();
            console.log("step 03.");
            //this.m_wrapperTex.attachTex(this.m_blurModule.getDstTexture());
            //this.m_dstRttFboIns.setTextureLevel(1);
            //  this.m_dstRTT.setSize(256,256);
            //  this.m_dstRttFboIns.resizeFBO(256,256);            
            this.m_dstRttFboIns.runBegin();
            this.m_dstRttFboIns.drawEntity( this.m_srcRTTPlane );
            this.m_dstRttFboIns.runEnd();
            console.log("step 04.");
            //*/
            // 得到
            // --------------------------------------------- fbo run end
            
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            this.m_rscene.setRenderToBackBuffer();
            this.m_rscene.useMainCamera();
            this.m_rscene.runAt(0);
            this.m_rscene.runAt(1);
            
            this.m_rscene.runEnd();
        }

    }
}
export default DemoRTTLod;