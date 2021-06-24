
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
import PBRMeshManager from "../pbr/mana/PBRMeshManager";

import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";


export class DemoModulePBR
{
    constructor()
    {
    }
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_meshMana:PBRMeshManager = null;
    private m_meshManas:PBRMeshManager[] = [];
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
        console.log("DemoModulePBR::initialize()......");
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

            this.m_rscene.enableMouseEvent(true);
            this.m_CameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_CameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

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

            this.m_meshMana = new PBRMeshManager();

            this.m_meshMana.rscene = this.m_rscene;
            this.m_meshMana.texLoader = this.m_texLoader;
            this.m_meshMana.initialize();
            

            this.m_rscene.setClearRGBColor3f(0.7,0.7,0.7);
            //this.m_meshMana.loadMeshFile("static/modules/box01.md");
            /*
            this.m_meshMana.moduleScale = 1.0;
            this.m_meshMana.loadMeshFile("static/modules/cloth01.md");
            //*/
            //this.m_meshMana.loadMeshFile("static/modules/cloth400w.md");
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
            this.m_meshMana.material.woolEnabled = true;
            this.m_meshMana.material.toneMappingEnabled = true;
            this.m_meshMana.material.envMapEnabled = true;
            this.m_meshMana.material.specularBleedEnabled = true;
            this.m_meshMana.material.metallicCorrection = true;
            this.m_meshMana.material.absorbEnabled = false;
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
            this.m_meshMana.material.setReflectionIntensity(0.1);
            //this.m_meshMana.material.setColorScale(1.0,2.0);

        }
    }
    private mouseDown(evt: any): void {
        let k:number = (evt.mouseX - 50.0)/400.0;
        this.m_meshManas[0].material.setRoughness( k );
        k = (evt.mouseY - 50.0)/400.0;
        this.m_meshManas[0].material.setMetallic( k );
    }
    private update():void {

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

        //this.m_meshManas[0].material.setRoughness( Math.abs(Math.sin(this.m_time)));
        //this.m_time += 0.01;

        this.m_stageDragSwinger.runWithYAxis();
        this.m_CameraZoomController.run(this.m_lookAtV, 30.0);
        this.m_rscene.run(true);
        

        ///this.m_camTrack.rotationOffsetAngleWorldY(-0.2);

        
        if(this.m_profileInstance != null)
        {
            this.m_profileInstance.run();
        }
    }
}
    
export default DemoModulePBR;