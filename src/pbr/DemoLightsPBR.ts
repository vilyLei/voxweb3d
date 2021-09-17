
import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDevice from "../vox/render/RendererDevice";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";

import DecodeQueue from "../large/parse/DecodeQueue";
import PBRLightsManager from "../pbr/mana/PBRLightsManager";

import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import RendererSubScene from "../vox/scene/RendererSubScene";
import PBRLightsUI from "./mana/PBRLightsUI";
import ProjectToneMaterial from "../demo/material/ProjectToneMaterial";
import MirrorToneMaterial from "../demo/material/MirrorToneMaterial";
import FBOInstance from "../vox/scene/FBOInstance";
import CameraBase from "../vox/view/CameraBase";
import ScreenAlignPlaneEntity from "../vox/entity/ScreenAlignPlaneEntity";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import MathConst from "../vox/math/MathConst";
import DisplayEntity from "../vox/entity/DisplayEntity";
import RendererState from "../vox/render/RendererState";



export class DemoLightsPBR
{
    constructor(){}
    private m_rscene:RendererScene = null;
    private m_ruisc:RendererSubScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_meshMana:PBRLightsManager = null;
    private m_meshManas:PBRLightsManager[] = [];
    private m_profileInstance:ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_uiModule: PBRLightsUI = new PBRLightsUI();
    private m_reflectPlaneY: number = -220.0;
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    
    initialize():void
    {
        console.log("DemoLightsPBR::initialize()......");
        if(this.m_rscene == null)
        {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            
            let rparam:RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(1500.0,1500.0,2000.0);
            rparam.setCamProject(45,50.0,10000.0)
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_rscene.updateCamera();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/caustics_02.jpg");
            let tex1:TextureProxy = this.getImageTexByUrl("static/assets/green.jpg");
            //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            
            //this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().stageWidth - 10);
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(700.0);
            //  this.m_rscene.addEntity(axis, 1);

            this.m_meshMana = new PBRLightsManager();

            this.m_meshMana.rscene = this.m_rscene;
            this.m_meshMana.texLoader = this.m_texLoader;
            this.m_meshMana.initialize();
            

            this.m_rscene.setClearRGBColor3f(0.2,0.2,0.2);
            //this.m_meshMana.loadMeshFile("static/modules/box01.md");
            /*
            this.m_meshMana.moduleScale = 1.0;
            this.m_meshMana.loadMeshFile("static/modules/cloth01.md");
            //*/
            /*
            this.m_meshMana.moduleScale = 1.0;
            this.m_meshMana.lightBaseDis = 900.0;
            this.m_meshMana.loadMeshFile("static/modules/cloth400w.md");
            //*/
            ///*
            this.m_reflectPlaneY = -580.0;
            this.m_meshMana.moduleScale = 3.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,-350.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/loveass.md");
            //*/
            /*
            this.m_reflectPlaneY = -220.0;
            this.m_meshMana.lightBaseDis = 900.0;
            this.m_meshMana.moduleScale = 0.5;
            this.m_meshMana.offsetPos.setXYZ(0.0,200.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/stainlessSteel.md");
            //*/
            /*
            this.m_meshMana.lightBaseDis = 900.0;
            this.m_meshMana.moduleScale = 1.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,-350.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/scarf.md");
            //*/
            if(this.m_meshMana != null) {
                this.m_meshManas.push( this.m_meshMana );
                
                let posList:Vector3D[] = this.m_meshMana.lightPosList;
                if(posList != null) {
                    for(let i:number = 0; i < posList.length; ++i) {
                        let crossAxis:Axis3DEntity = new Axis3DEntity();
                        crossAxis.initializeCross(30.0);
                        crossAxis.setPosition(posList[i]);
                        this.m_rscene.addEntity(crossAxis, 1);
                    }
                }
                this.m_uiModule.initialize(this.m_rscene, this.m_texLoader, this.m_meshMana);
                this.m_ruisc = this.m_uiModule.ruisc;
                this.m_uiModule.close();
            }
            //*/

            this.initPlaneReflection();
        }
    }
    
    
    private m_projType: number = 0;
    private m_fboIns: FBOInstance = null;
    private m_rttCamera:CameraBase = null;
    private m_viewWidth: number = 2048.0;
    private m_viewHeight: number = 2048.0;
    private m_toneMaterial: MirrorToneMaterial;
    private m_refPlane:Plane3DEntity = null;
    private m_pv: Vector3D = new Vector3D;
    private m_tempPosV: Vector3D = new Vector3D();
    private m_tempScaleV: Vector3D = new Vector3D();
    private m_targetEntity: DisplayEntity = null;

    private initPlaneReflection(): void {
        this.m_projType = 1;

        
        //  let box: Box3DEntity = new Box3DEntity();
        //  box.uvPartsNumber = 6;
        //  box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixParts.jpg")]);
        //  box.setScaleXYZ(2.0, 2.0, 2.0);
        //  this.m_rscene.addEntity(box, 0);
        
        this.m_fboIns = this.m_rscene.createFBOInstance();
        this.m_fboIns.asynFBOSizeWithViewport();
        this.m_fboIns.setClearRGBAColor4f(0.0,0.0,0.0,1.0);   // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        this.m_fboIns.createFBOAt(0,512,512,true,false);
        this.m_fboIns.setRenderToRTTTextureAt(0, 0);          // framebuffer color attachment 0
        this.m_fboIns.setRProcessIDList([0]);

        //  let scrPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        //  scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_fboIns.getRTTAt(0)]);
        //  scrPlane.setOffsetRGB3f(0.1,0.1,0.1);
        //  this.m_rscene.addEntity(scrPlane, 1);
        
        let camera: CameraBase = this.m_rscene.getCamera();
        let camPos: Vector3D = camera.getPosition();
        camPos.y *= -1.0;

        let viewWidth: number = this.m_viewWidth;
        let viewHeight: number = this.m_viewHeight;
        this.m_rttCamera = new CameraBase();
        this.m_rttCamera.name = "m_rttCamera";
        this.m_rttCamera.lookAtRH(camPos, new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,1.0,0.0));
        this.m_rttCamera.perspectiveRH(MathConst.DegreeToRadian(45.0),viewWidth/viewHeight,50.1,10000.0);
        //this.m_rttCamera.orthoRH(50.1,10000.0, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);

        this.m_rttCamera.setViewSize(viewWidth, viewHeight);
        this.m_rttCamera.update();
        
        let texList: TextureProxy[] = [
            this.m_fboIns.getRTTAt(0),
            this.getImageTexByUrl("static/assets/brickwall_big.jpg"),
            this.getImageTexByUrl("static/assets/brickwall_normal.jpg")
        ];
        let toneMaterial: MirrorToneMaterial = new MirrorToneMaterial();
        this.m_toneMaterial = toneMaterial;
        let plane:Plane3DEntity = new Plane3DEntity();
        plane.flipVerticalUV = true;
        plane.setMaterial(toneMaterial);
        plane.initializeXOZ(-1100.0, -1100.0, 2200.0, 2200.0, texList);
        plane.setXYZ(0, this.m_reflectPlaneY, 0);
        this.m_rscene.addEntity(plane, 1);
        this.m_refPlane = plane;

        //  let frustrum:FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        //  frustrum.initiazlize( this.m_rttCamera );
        //  frustrum.setScaleXYZ(0.5,0.5,0.5);
        //  this.m_rscene.addEntity( frustrum, 1);
        
    }
    private m_runFlag: boolean = true;
    private mouseDown(evt: any): void {
        this.m_runFlag = true;
    }
    private mouseUp(evt: any): void {

    }
    private update():void {

        this.m_statusDisp.update(true);
        DecodeQueue.Run();
        
        for(let i:number = 0; i < this.m_meshManas.length; ++i)
        {
            let boo:boolean = this.m_meshManas[i].run();
        }
    }
    run():void
    {
        //  if(this.m_runFlag) {
        //      this.m_runFlag = false;
        //  }
        //  else {
        //      return;
        //  }

        this.update();


        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        // current rendering strategy
        //  this.m_rscene.run(true);
        //  if(this.m_ruisc != null) this.m_ruisc.run( true );

        
        /////////////////////////////////////////////////////// ---- mouseTest begin.
        let pickFlag: boolean = true;
        ///*
        this.m_ruisc.runBegin(true, true);
        this.m_ruisc.update(false, true);
        pickFlag = this.m_ruisc.isRayPickSelected();

        this.m_rscene.runBegin(false);
        this.m_rscene.update(false, !pickFlag);
        //pickFlag = pickFlag || this.m_rscene.isRayPickSelected();

        /////////////////////////////////////////////////////// ---- mouseTest end.

        /////////////////////////////////////////////////////// ---- rendering begin.
        if(this.m_projType == 0) {

            this.mirrorRun();
        }
        else {

            if(this.m_meshMana.entity != null) {
                this.mirrorReflectRun();
            }
        }        
        /////////////////////////////////////////////////////// ---- rendering end.


        /// this.m_camTrack.rotationOffsetAngleWorldY(-0.2);        
        //  if(this.m_profileInstance != null)
        //  {
        //      this.m_profileInstance.run();
        //  }
    }
    private mirrorReflectRun(): void {

        this.m_targetEntity = this.m_meshMana.entity;
        
        this.m_refPlane.getPosition(this.m_pv);

        this.m_rscene.renderBegin();
        // --------------------------------------------- fbo run begin
        
        this.m_targetEntity.getPosition( this.m_tempPosV );
        this.m_targetEntity.getScaleXYZ( this.m_tempScaleV );
        this.m_targetEntity.setScaleXYZ(this.m_tempScaleV.x, -this.m_tempScaleV.y, this.m_tempScaleV.z);
        this.m_targetEntity.update();
        
        let maxV: Vector3D = this.m_targetEntity.getGlobalBounds().max;
        let dh: number = maxV.y - this.m_pv.y;
        
        this.m_targetEntity.setXYZ(this.m_tempPosV.x, (this.m_tempPosV.y - dh - 0.1), this.m_tempPosV.z);
        this.m_targetEntity.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
        this.m_targetEntity.update();
        this.m_fboIns.run();
        // --------------------------------------------- fbo run end
        this.m_toneMaterial.setProjNV(this.m_rttCamera.getNV());
        this.m_rscene.setRenderToBackBuffer();
        this.m_rscene.useMainCamera();
        
        this.m_targetEntity.setRenderState(RendererState.BACK_CULLFACE_NORMAL_STATE);
        this.m_targetEntity.setScaleXYZ(this.m_tempScaleV.x, this.m_tempScaleV.y, this.m_tempScaleV.z);
        this.m_targetEntity.setPosition( this.m_tempPosV );
        this.m_targetEntity.update();

        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runEnd();

        this.m_ruisc.renderBegin();
        this.m_ruisc.run(false);
        this.m_ruisc.runEnd();
    }
    private mirrorProjRun(): void {

        let camera: CameraBase = this.m_rscene.getCamera();
        let camPos: Vector3D = camera.getPosition();
        let lookV: Vector3D = camera.getLookAtPosition();
        let UV: Vector3D = camera.getUV();
        this.m_refPlane.getPosition(this.m_pv);
        camPos.y = camPos.y - lookV.y;
        camPos.y = this.m_pv.y - camPos.y;
        this.m_rttCamera.lookAtRH(camPos, this.m_pv, UV);
        
        this.m_rscene.useCamera(this.m_rttCamera);
        this.m_rscene.renderBegin();
        // --------------------------------------------- fbo run begin
        this.m_fboIns.run();
        // --------------------------------------------- fbo run end
        this.m_toneMaterial.setProjNV(this.m_rttCamera.getNV());
        this.m_rscene.setRenderToBackBuffer();
        this.m_rscene.useMainCamera();
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runEnd();

        this.m_ruisc.renderBegin();
        this.m_ruisc.run(false);
        this.m_ruisc.runEnd();
    }
    private mirrorRun(): void {
        
        this.m_rscene.renderBegin();
        this.m_rscene.run(false);
        this.m_rscene.runEnd();

        this.m_ruisc.renderBegin();
        this.m_ruisc.run(false);
        this.m_ruisc.runEnd();
    }
}
    
export default DemoLightsPBR;