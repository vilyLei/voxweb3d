
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

import ViewMirrorMaterial from "../vox/material/mcase/ViewMirrorMaterial";
import FBOInstance from "../vox/scene/FBOInstance";
import CameraBase from "../vox/view/CameraBase";
import MathConst from "../vox/math/MathConst";
import ProjectToneMaterial from "./material/ProjectToneMaterial";

export class DemoProjectPlane {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoProjectPlane::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
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

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //  let axis: Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            // add common 3d display entity
            //      let plane:Plane3DEntity = new Plane3DEntity();
            //      plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //      this.m_rscene.addEntity(plane);
            //      this.m_targets.push(plane);
            //      //this.m_disp = plane
            //testTex
            

            //this.initMirrorY();
            this.initPlaneReflection();

            this.update();
        }
    }

    private m_projType: number = 0;
    private m_fboIns: FBOInstance = null;
    private m_rttCamera:CameraBase = null;    
    private m_viewWidth: number = 1024.0;
    private m_viewHeight: number = 1024.0;
    private m_toneMaterial: ProjectToneMaterial;
    private m_refPlane:Plane3DEntity = null;
    private m_pv: Vector3D = new Vector3D();

    private initPlaneReflection(): void {
        this.m_projType = 0;

        
        let box: Box3DEntity = new Box3DEntity();
        box.uvPartsNumber = 6;
        box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixParts.jpg")]);
        box.setScaleXYZ(2.0, 2.0, 2.0);
        //box.setXYZ(0.0, 170.0, 0.0);
        this.m_rscene.addEntity(box, 0);

        
        this.m_fboIns = this.m_rscene.createFBOInstance();
        this.m_fboIns.asynFBOSizeWithViewport();
        this.m_fboIns.setClearRGBAColor4f(0.0,0.0,0.0,1.0);   // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        this.m_fboIns.createFBOAt(0,512,512,true,false);
        this.m_fboIns.setRenderToRTTTextureAt(0, 0);          // framebuffer color attachment 0
        this.m_fboIns.setRProcessIDList([0]);

        let scrPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_fboIns.getRTTAt(0)]);
        scrPlane.setOffsetRGB3f(0.1,0.1,0.1);
        this.m_rscene.addEntity(scrPlane, 1);

        let camera: CameraBase = this.m_rscene.getCamera();
        let camPos: Vector3D = camera.getPosition();
        camPos.y *= -1.0;
        let viewWidth: number = this.m_viewWidth;
        let viewHeight: number = this.m_viewHeight;
        this.m_rttCamera = new CameraBase();
        this.m_rttCamera.name = "m_rttCamera";
        this.m_rttCamera.lookAtRH(camPos, new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,1.0,0.0));
        this.m_rttCamera.perspectiveRH(MathConst.DegreeToRadian(45.0),viewWidth/viewHeight,50.1,5000.0);
        //this.m_rttCamera.orthoRH(50.1,5000.0, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
        this.m_rttCamera.setViewXY(0,0);
        this.m_rttCamera.setViewSize(viewWidth, viewHeight);
        this.m_rttCamera.update();
        
        this.m_fboIns.getRTTAt(0).setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        let texList = [
            this.m_fboIns.getRTTAt(0),
            this.getImageTexByUrl("static/assets/brickwall_big.jpg"),
            this.getImageTexByUrl("static/assets/brickwall_normal.jpg")
        ];
        let toneMaterial: ProjectToneMaterial = new ProjectToneMaterial();
        toneMaterial.setToneMatrix(this.m_rttCamera.getVPMatrix());
        this.m_toneMaterial = toneMaterial;
        let plane:Plane3DEntity = new Plane3DEntity();
        plane.flipVerticalUV = true;
        plane.setMaterial(toneMaterial);
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, texList);
        plane.setXYZ(0,-170, 0);
        //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
        this.m_rscene.addEntity(plane, 1);
        this.m_refPlane = plane;

        //  let frustrum:FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        //  frustrum.initiazlize( this.m_rttCamera );
        //  frustrum.setScaleXYZ(0.5,0.5,0.5);
        //  this.m_rscene.addEntity( frustrum, 1);
        
    }
    private initMirrorY(): void {

        this.m_projType = 1;

        let box: Box3DEntity = new Box3DEntity();
        box.uvPartsNumber = 6;
        box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixParts.jpg")]);
        box.setScaleXYZ(2.0, 2.0, 2.0);
        box.setXYZ(0.0, 170.0, 0.0);
        this.m_rscene.addEntity(box);

        let material: ViewMirrorMaterial = new ViewMirrorMaterial();
        material.useYMirror();
        box = new Box3DEntity();
        box.setMaterial(material);
        box.uvPartsNumber = 6;
        box.showFrontFace();
        box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixParts.jpg")]);
        box.setScaleXYZ(2.0, 2.0, 2.0);
        box.setXYZ(0.0, 170.0, 0.0);
        this.m_rscene.addEntity(box);
    }
    private m_flag: boolean = true;
    private mouseDown(evt: any): void {

        this.m_flag = true;
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
            
            let camera: CameraBase = this.m_rscene.getCamera();
            let camPos: Vector3D = camera.getPosition();
            let lookV: Vector3D = camera.getLookAtPosition();
            let UV: Vector3D = camera.getUV();
            this.m_refPlane.getPosition(this.m_pv);
            camPos.y = camPos.y - lookV.y;
            camPos.y = this.m_pv.y - camPos.y;
            this.m_rttCamera.lookAtRH(camPos, this.m_pv, UV);

            //  this.m_rttCamera.lookAtRH(camPos, camera.getLookAtPosition(), camera.getUV());        
            //  let viewWidth: number = this.m_viewWidth;
            //  let viewHeight: number = this.m_viewHeight;
            //  //this.m_rttCamera.perspectiveRH(MathConst.DegreeToRadian(45.0),viewWidth/viewHeight,50.1,5000.0);
            //  this.m_rttCamera.orthoRH(50.1,5000.0, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);

            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
            this.m_rscene.useCamera(this.m_rttCamera);
            this.m_rscene.runBegin();
            this.m_rscene.update(false);
            
            // --------------------------------------------- fbo run begin
            this.m_fboIns.run();
            // --------------------------------------------- fbo run end
            this.m_toneMaterial.setProjNV(this.m_rttCamera.getNV());
            this.m_rscene.setRenderToBackBuffer();
            this.m_rscene.useMainCamera();
            this.m_rscene.runAt(0);
            this.m_rscene.runAt(1);
            
            this.m_rscene.runEnd();
        }

    }
}
export default DemoProjectPlane;