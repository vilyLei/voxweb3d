
import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDeviece from "../vox/render/RendererDeviece";
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
    private m_CameraZoomController: CameraZoomController = new CameraZoomController();
    private m_uiModule: PBRLightsUI = new PBRLightsUI();

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
            /*
            this.m_meshMana.moduleScale = 3.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,-350.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/loveass.md");
            //*/
            ///*
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

            this.m_uiModule.initialize(this.m_rscene, this.m_texLoader, this.m_meshMana);
            this.m_ruisc = this.m_uiModule.ruisc;
        }
    }
    
    
    private mouseDown(evt: any): void {
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
        this.update();

        this.m_stageDragSwinger.runWithYAxis();
        this.m_CameraZoomController.run(Vector3D.ZERO, 30.0);

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