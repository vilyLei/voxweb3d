
import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
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
import ProgressBar from "../orthoui/demos/base/ProgressBar";
import ProgressDataEvent from "../vox/event/ProgressDataEvent";
import UITexTool from "../orthoui/demos/base/UITexTool";



export class DemoLightsPBR
{
    constructor()
    {
    }
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_meshMana:PBRLightsManager = null;
    private m_meshManas:PBRLightsManager[] = [];
    private m_profileInstance:ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_CameraZoomController: CameraZoomController = new CameraZoomController();
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
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            
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
            this.m_CameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_CameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize("rstatus", this.m_rscene.getViewWidth() - 200);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            //H5FontSystem.GetInstance().initialize("fontTex",18, 512,512,false,false);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/caustics_02.jpg");
            let tex1:TextureProxy = this.getImageTexByUrl("static/assets/green.jpg");
            //let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            
            //this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().stageWidth - 10);
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(700.0);
            this.m_rscene.addEntity(axis);

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
            this.m_meshMana.moduleScale = 3.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,-350.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/loveass.md");
            //*/
            /*
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
            this.m_meshManas.push( this.m_meshMana );
            
            let posList:Vector3D[] = this.m_meshMana.lightPosList;
            if(posList != null) {
                for(let i:number = 0; i < posList.length; ++i) {
                    let crossAxis:Axis3DEntity = new Axis3DEntity();
                    crossAxis.initializeCross(30.0);
                    crossAxis.setPosition(posList[i]);
                    this.m_rscene.addEntity(crossAxis);
                }
            }
            this.m_meshMana.material.woolEnabled = true;
            this.m_meshMana.material.toneMappingEnabled = true;
            this.m_meshMana.material.envMapEnabled = true;
            this.m_meshMana.material.specularBleedEnabled = true;
            this.m_meshMana.material.metallicCorrection = true;
            this.m_meshMana.material.absorbEnabled = true;
            this.m_meshMana.material.normalNoiseEnabled = true;
            this.m_meshMana.material.pixelNormalNoiseEnabled = true;
            /*
            let value: number = 0.2;
            this.m_meshMana.material.setColorScale(1.0,1.0);
            this.m_meshMana.material.setColorGlossiness(0.4);
            this.m_meshMana.material.setReflectionIntensity(0.01);
            this.m_meshMana.material.setMetallic(0.3);
            this.m_meshMana.material.setRoughness(0.0);
            this.m_meshMana.material.setAlbedoColor(0.9,0.0,0.9);
            this.m_meshMana.material.setAO(1.0);
            this.m_meshMana.material.setAmbientFactor(value,value,value);
            //*/
            /*
            //this.m_meshMana.material.setReflectionIntensity(0.1);
            //this.m_meshMana.material.setScatterIntensity(32.0);
            //this.m_meshMana.material.setColorGlossiness(0.8);
            this.m_meshMana.material.setMetallic(0.1);
            this.m_meshMana.material.setRoughness(0.8);
            //this.m_meshMana.material.setEnvSpecylarColorFactor(0.0,0.0,0.0);
            //*/
            /*
            this.m_meshMana.material.setMetallic(1.0);
            this.m_meshMana.material.setAlbedoColor(0.8, 0.8,0.8);
            this.m_meshMana.material.setRoughness(0.99);
            this.m_meshMana.material.setAO(1.0);
            this.m_meshMana.material.setAmbientFactor(0.01,0.01,0.01);
            //this.m_meshMana.material.setEnvSpecylarColorFactor(1.0,0.3,0.4);
            //*/
            //  this.m_meshMana.material.setMetallic(1.0);
            //  this.m_meshMana.material.setRoughness(0.7);
            //this.m_meshMana.material.setAlbedoColor(2.0, 2.0, 2.0);
            this.m_meshMana.material.setAmbientFactor(0.02, 0.02, 0.02);
            this.m_meshMana.material.setToneMapingExposure(2.0);
            this.m_meshMana.material.setReflectionIntensity(0.5);
            //  this.m_meshMana.material.setEnvMapLodMipMapLevel(3.0,4.0);
            //this.m_meshMana.material.setEnvSpecularColorFactor(0.0,3.0,0.0);
            this.m_meshManas[0].material.setColorScale( this.m_sideScale, this.m_surfaceScale );
            this.m_meshManas[0].material.setScatterIntensity( 1.0 );
            this.m_meshMana.material.setPixelNormalNoiseIntensity(0.07);

            this.initUI();
        }
    }
    
    private m_ruisc:RendererSubScene = null;
    private initUI(): void {
        
        let rparam: RendererParam = new RendererParam();
        rparam.cameraPerspectiveEnabled = false;
        rparam.setCamProject(45.0, 0.1, 3000.0);
        rparam.setCamPosition(0.0, 0.0, 1500.0);

        let subScene: RendererSubScene = null;
        subScene = this.m_rscene.createSubScene();
        subScene.initialize(rparam);
        subScene.enableMouseEvent(true);
        this.m_ruisc = subScene;
        let stage = this.m_rscene.getStage3D();
        //this.m_ruisc.getCamera().translationXYZ(this.m_rscene.getViewWidth() * 0.5, this.m_rscene.getViewHeight() * 0.5, 1500.0);
        this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        this.m_ruisc.getCamera().update();
        UITexTool.GetInstance().initialize( this.m_rscene );
        
        
        this.initCtrlBars();
    }
    
    private m_btnSize: number = 32;
    private m_bgLength: number = 200.0;
    private m_btnPX: number = 150.0;
    private m_btnPY: number = 10.0;

    private m_sideScale: number = 0.5;
    private m_surfaceScale: number = 0.5;
    private createBtn(ns:string, progress: number, value: number = 0.0):ProgressBar {

        let proBar: ProgressBar = new ProgressBar();
        proBar.uuid = ns;
        proBar.initialize( this.m_ruisc , ns, this.m_btnSize, this.m_bgLength);
        if(value < 0.001) {
            proBar.setProgress( progress, false );
        }
        else {
            proBar.setValue( value, false );
        }
        proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.progressChange);
        proBar.setXY(this.m_btnPX, this.m_btnPY);
        this.m_btnPY += this.m_btnSize + 1;
        return proBar;
    }
    private initCtrlBars(): void {
        
        if(RendererDeviece.IsMobileWeb()) {
            this.m_btnSize = 64;
            this.m_btnPX = 280;
            this.m_btnPY = 30;
        }
        let proBarA: ProgressBar;
        let proBarB: ProgressBar;
        this.createBtn("metal", this.m_meshMana.material.getMetallic());
        this.createBtn("rough", this.m_meshMana.material.getRoughness());
        this.createBtn("noise", 0.07);
        this.createBtn("reflection", 0.5);
        proBarA = this.createBtn("side", 0,this.m_sideScale);
        proBarB = this.createBtn("surface",0, this.m_surfaceScale);
        proBarB.minValue = proBarA.minValue = 0.1;
        proBarB.maxValue = proBarA.maxValue = 30.0;
        proBarA.setValue(this.m_sideScale, false);
        proBarB.setValue(this.m_surfaceScale, false);

        proBarA = this.createBtn("scatter",0, 1.0);
        proBarA.minValue = 0.1;
        proBarA.maxValue = 128.0;
        proBarA.setValue(1.0, false);
        
    }
    private progressChange(evt: any): void {
        
        let progEvt: ProgressDataEvent = evt as ProgressDataEvent;
        //console.log("progressChange, progress: ",progEvt.progress);
        //this.m_meshManas[0].material.setMetallic( progEvt.progress );
        let progress: number = progEvt.progress;
        switch(progEvt.uuid) {
            case "metal":
                this.m_meshManas[0].material.setMetallic( progress );
                break;
            case "rough":
                this.m_meshManas[0].material.setRoughness( progress );
                break;
            case "noise":
                this.m_meshManas[0].material.setPixelNormalNoiseIntensity( progress );
                break;
            case "reflection":
                this.m_meshManas[0].material.setReflectionIntensity( progress );
                break;
            case "side":
                this.m_sideScale = progEvt.value;
                this.m_meshManas[0].material.setColorScale( this.m_sideScale, this.m_surfaceScale );
                break;
            case "surface":
                this.m_surfaceScale = progEvt.value;
                this.m_meshManas[0].material.setColorScale( this.m_sideScale, this.m_surfaceScale );
                break;
            case "scatter":
                this.m_meshManas[0].material.setScatterIntensity( progEvt.value );
                break;
            default:
            break;
        }
    }
    private mouseDown(evt: any): void {
        //  let k:number = (evt.mouseX - 50.0)/400.0;
        //  this.m_meshManas[0].material.setRoughness( k );
        //  k = (evt.mouseY - 50.0)/400.0;
        //  this.m_meshManas[0].material.setMetallic( k );
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
    private m_lookAtV:Vector3D = new Vector3D();
    //private m_time: number = 0.0;
    run():void
    {
        this.update();

        this.m_stageDragSwinger.runWithYAxis();
        this.m_CameraZoomController.run(this.m_lookAtV, 30.0);

        // current rendering strategy
        //  this.m_rscene.run(true);
        //  if(this.m_ruisc != null) this.m_ruisc.run( true );

        
        /////////////////////////////////////////////////////// ---- mouseTest begin.
        let pickFlag: boolean = true;

        this.m_ruisc.runBegin(true, true);
        this.m_ruisc.update(false, true);
        pickFlag = this.m_ruisc.isRayPickSelected();

        this.m_rscene.runBegin(false);
        this.m_rscene.update(false, !pickFlag);
        //pickFlag = pickFlag || this.m_rscene.isRayPickSelected();

        /////////////////////////////////////////////////////// ---- mouseTest end.

        
        /////////////////////////////////////////////////////// ---- rendering begin.
        this.m_rscene.renderBegin();
        this.m_rscene.run(false);
        this.m_rscene.runEnd();

        this.m_ruisc.renderBegin();
        this.m_ruisc.run(false);
        this.m_ruisc.runEnd();
        
        /////////////////////////////////////////////////////// ---- rendering end.


        ///this.m_camTrack.rotationOffsetAngleWorldY(-0.2);        
        //  if(this.m_profileInstance != null)
        //  {
        //      this.m_profileInstance.run();
        //  }
    }
}
    
export default DemoLightsPBR;