
import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDeviece from "../vox/render/RendererDeviece";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import DisplayEntity from "../vox/entity/DisplayEntity";
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
import DefaultPBRCase from "../pbr/mana/DefaultPBRCase";

import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import RendererSubScene from "../vox/scene/RendererSubScene";
import DefaultPBRUI from "./mana/DefaultPBRUI";
import MirrorToneMaterial from "../demo/material/MirrorToneMaterial";
import FBOInstance from "../vox/scene/FBOInstance";
import CameraBase from "../vox/view/CameraBase";

import Sphere3DEntity from "../vox/entity/Sphere3DEntity";

import DebugFlag from "../vox/debug/DebugFlag";
import DefaultPBRLight from "../pbr/mana/DefaultPBRLight";
import DefaultPBRMaterial from "../pbr/material/DefaultPBRMaterial";
import MaterialBuilder from "../pbr/mana/MaterialBuilder";
import MirrorProjEntity from "./mana/MirrorProjEngity";
import PBRParamEntity from "./mana/PBRParamEntity";
import RendererState from "../vox/render/RendererState";
import { GLStencilFunc, GLStencilOp } from "../vox/render/RenderConst";
import StencilOutline from "../renderingtoy/mcase/outline/StencilOutline";

import CubeRttBuilder from "../renderingtoy/mcase/CubeRTTBuilder";
import CubeMapMaterial from "../vox/material/mcase/CubeMapMaterial";



export class DemoDefaultPBR2
{
    constructor(){}
    private m_rscene:RendererScene = null;
    private m_ruisc:RendererSubScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_meshMana:DefaultPBRCase = null;
    private m_meshManas:DefaultPBRCase[] = [];
    private m_profileInstance:ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_stencilOutline: StencilOutline = new StencilOutline();
    private m_uiModule: DefaultPBRUI = new DefaultPBRUI();
    private m_reflectPlaneY: number = -220.0;
    private m_paramEntities:PBRParamEntity[] = [];
    private m_materialBuilder: MaterialBuilder = new MaterialBuilder();
    private m_cubeRTTBuilder: CubeRttBuilder = new CubeRttBuilder();
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    
    initialize():void
    {
        console.log("DemoDefaultPBR2::initialize()......");
        if(this.m_rscene == null)
        {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            
            let rparam:RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(1500.0,1500.0,2000.0);
            rparam.setCamProject(45,50.0,10000.0)
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_rscene.updateCamera();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);
            this.m_stencilOutline.initialize(this.m_rscene);
            this.m_stencilOutline.setRGB3f(1.0,0.0,1.0);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize("rstatus", 300);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(700.0);
            //  this.m_rscene.addEntity(axis, 1);

            let lightModule: DefaultPBRLight = new DefaultPBRLight();
            lightModule.create(4,2);
            this.m_meshMana = new DefaultPBRCase();
            this.m_meshMana.lightModule = lightModule;

            this.m_materialBuilder.lightModule = lightModule;
            this.m_materialBuilder.texLoader = this.m_texLoader;

            this.m_meshMana.rscene = this.m_rscene;
            this.m_meshMana.texLoader = this.m_texLoader;
            this.m_meshMana.initialize();
            
            this.m_rscene.setClearRGBColor3f(0.2,0.2,0.2);

            let cubeRTTMipMapEnabled: boolean = true;
            let rttPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
            this.m_cubeRTTBuilder.mipmapEnabled = cubeRTTMipMapEnabled;
            this.m_cubeRTTBuilder.initialize(this.m_rscene, 256.0, 256.0, rttPos);
            //this.m_cubeRTTBuilder.setClearRGBAColor4f(0.0,0.0,0.0,1.0);
            this.m_cubeRTTBuilder.setRProcessIDList( [1] );
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
            this.m_meshMana.diffuseMapEnabled = true;
            this.m_meshMana.normalMapEnabled = false;
            this.m_reflectPlaneY = -580.0;
            this.m_meshMana.moduleScale = 3.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,-350.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/loveass.md");
            //*/
            /*
            this.m_meshMana.diffuseMapEnabled = true;
            this.m_meshMana.normalMapEnabled = true;
            this.m_reflectPlaneY = -220.0;
            this.m_meshMana.moduleScale = 0.5;
            this.m_meshMana.offsetPos.setXYZ(0.0,200.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/stainlessSteel.md");
            //*/
            /*
            this.m_meshMana.diffuseMapEnabled = false;
            this.m_meshMana.normalMapEnabled = false;
            this.m_reflectPlaneY = -580.0;
            this.m_meshMana.moduleScale = 1.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,-350.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/scarf.md");
            //*/
            /*
            this.m_meshMana.diffuseMapEnabled = true;
            this.m_meshMana.normalMapEnabled = false;
            this.m_reflectPlaneY = -200.0;
            this.m_meshMana.moduleScale = 300.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,-150.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/car.md");
            this.m_meshMana.material.setUVScale(0.1,0.1);
            //*/
            ///*
            this.m_meshMana.indirectEnvMap = this.m_cubeRTTBuilder.getCubeTexture();
            this.m_meshMana.diffuseMapEnabled = true;
            this.m_meshMana.normalMapEnabled = true;
            //this.m_meshMana.indirectEnvMap = true;
            this.m_reflectPlaneY = -200.0;
            this.m_meshMana.moduleScale = 600.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,-150.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/bunny.md");
            //*/
            /*
            this.m_meshMana.diffuseMapEnabled = false;
            this.m_meshMana.normalMapEnabled = false;
            this.m_reflectPlaneY = -580.0;
            this.m_meshMana.moduleScale = 1.0;
            this.m_meshMana.offsetPos.setXYZ(0.0,100.0,0.0);
            this.m_meshMana.loadMeshFile("static/modules/changClo.md");
            //*/
            ///*
            if(this.m_meshMana != null) {
                this.m_meshManas.push( this.m_meshMana );
                
                let posList:Vector3D[] = lightModule.getPointList();
                if(posList != null) {
                    for(let i:number = 0; i < posList.length; ++i) {
                        let crossAxis:Axis3DEntity = new Axis3DEntity();
                        crossAxis.initializeCross(30.0);
                        crossAxis.setPosition(posList[i]);
                        this.m_rscene.addEntity(crossAxis, 1);
                    }
                }
                
                this.m_uiModule.initialize(this.m_rscene, this.m_texLoader);
                this.m_ruisc = this.m_uiModule.ruisc;
                this.m_uiModule.close();
                ///*
                if(this.m_meshMana.entity != null)
                {
                    let param: PBRParamEntity = new PBRParamEntity();
                    param.entity = this.m_meshMana.entity;
                    param.material = this.m_meshMana.material;
                    param.pbrUI = this.m_uiModule;
                    param.colorPanel = this.m_uiModule.rgbPanel;
                    this.m_uiModule.setParamEntity( param );
                    param.initialize();
                    this.m_paramEntities.push(param);
                }
                //*/
            }

            this.initPlaneReflection();
        }
    }
    
    private m_fboIns: FBOInstance = null;
    private m_toneMaterial: any;
    
    private m_mirrorEntities:MirrorProjEntity[] = [];
    private m_mirrorMapLodEnabled: boolean = true;
    private initPlaneReflection(): void {

        let matBuilder:MaterialBuilder = this.m_materialBuilder;
        let param: PBRParamEntity;

        this.m_fboIns = this.m_rscene.createFBOInstance();
        this.m_fboIns.asynFBOSizeWithViewport();
        this.m_fboIns.setClearRGBAColor4f(0.0,0.0,0.0,1.0);   // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        this.m_fboIns.createFBOAt(1,512,512,true,false);
        this.m_fboIns.setRenderToRTTTextureAt(0, 0);          // framebuffer color attachment 0
        this.m_fboIns.setRProcessIDList([0]);

        //  let scrPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        //  scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_fboIns.getRTTAt(0)]);
        //  scrPlane.setOffsetRGB3f(0.1,0.1,0.1);
        //  this.m_rscene.addEntity(scrPlane, 1);
        
        let camera: CameraBase = this.m_rscene.getCamera();
        let camPos: Vector3D = camera.getPosition();
        camPos.y *= -1.0;

        
        let texList: TextureProxy[] = [
            this.m_fboIns.getRTTAt(0),
            this.getImageTexByUrl("static/assets/brickwall_big.jpg"),
            this.getImageTexByUrl("static/assets/brickwall_normal.jpg")
        ];
        let toneMaterial: MirrorToneMaterial = new MirrorToneMaterial();
        this.m_toneMaterial = toneMaterial;

        let mEntity: MirrorProjEntity = null;
        let plane:Plane3DEntity = null;
        let material: DefaultPBRMaterial;
        ///*
        // mirror plane
        material = matBuilder.makeDefaultPBRMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
        material.setTextureList( [
            this.m_meshMana.texList[0]
            , this.getImageTexByUrl("static/assets/brickwall_big.jpg")
            , this.getImageTexByUrl("static/assets/brickwall_normal.jpg")
            , this.m_fboIns.getRTTAt(0)
        ] );
        this.m_mirrorMapLodEnabled = true;
        if(this.m_mirrorMapLodEnabled) {
            this.m_fboIns.getRTTAt(0).enableMipmap();
            material.setMirrorMapLodLevel(2.0);
        }
        material.pixelNormalNoiseEnabled = true;
        material.mirrorProjEnabled = true;
        material.mirrorMapLodEnabled = this.m_mirrorMapLodEnabled;
        material.diffuseMapEnabled = true;
        material.normalMapEnabled = true;
        material.setUVScale(3.0,3.0);
        material.setMirrorIntensity(0.9);
        material.setMirrorMixFactor(0.2);
        plane = new Plane3DEntity();
        plane.flipVerticalUV = true;
        plane.setMaterial(material);
        plane.initializeXOZ(-1100.0, -1100.0, 2200.0, 2200.0, texList);
        plane.setXYZ(0, this.m_reflectPlaneY, 0);
        this.m_rscene.addEntity(plane, 1);

        let cubeRTTMipMapEnabled: boolean = this.m_cubeRTTBuilder.mipmapEnabled;
        //  let cubeRTTMipMapEnabled: boolean = true;
        //  let rttPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
        //  this.m_cubeRTTBuilder.mipmapEnabled = cubeRTTMipMapEnabled;
        //  this.m_cubeRTTBuilder.initialize(this.m_rscene, 256.0, 256.0, rttPos);
        //  //this.m_cubeRTTBuilder.setClearRGBAColor4f(0.0,0.0,0.0,1.0);
        //  this.m_cubeRTTBuilder.setRProcessIDList( [1] );

        
        let cubeMaterial: CubeMapMaterial = new CubeMapMaterial( cubeRTTMipMapEnabled );
        cubeMaterial.setTextureLodLevel(3.5);
        
        let box: Box3DEntity = new Box3DEntity();
        box.useGourandNormal();
        box.setMaterial(cubeMaterial);
        //box.initializeCube(300.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
        box.initializeCube(200.0, [ this.m_cubeRTTBuilder.getCubeTexture() ]);
        //  box.initializeCube(200.0, [ cubeTex0 ]);
        //box.setScaleXYZ(2.0, 2.0, 2.0);
        box.setPosition( new Vector3D(800.0,300.0,200.0) );
        //this.m_rscene.addEntity(box, 1);
        this.m_rscene.addEntity(box, 2);
        
        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(1000.0);
        this.m_rscene.addEntity(axis, 2);

        param = new PBRParamEntity();
        param.entity = plane;
        param.material = material;
        param.pbrUI = this.m_uiModule;
        param.colorPanel = this.m_uiModule.rgbPanel;
        param.initialize();
        this.m_paramEntities.push(param);
        //*/

        //  let frustrum:FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        //  frustrum.initiazlize( this.m_rttCamera );
        //  frustrum.setScaleXYZ(0.5,0.5,0.5);
        //  this.m_rscene.addEntity( frustrum, 1);
        if(plane != null) {
            mEntity = new MirrorProjEntity();
            mEntity.entity = this.m_meshMana.entity;
            mEntity.mirrorPlane = plane;
            this.m_mirrorEntities.push( mEntity );
        }
        let sph: Sphere3DEntity;
        let rad: number;
        let radius: number;
        for(let i: number = 0; i < 3; ++i) {

            rad = Math.random() * 100.0;
            radius = Math.random() * 250.0 + 550.0;
            material = this.m_meshMana.makeTexMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
            material.setTextureList( [
                this.m_meshMana.texList[0]
                //  ,this.getImageTexByUrl("static/assets/disp/box_COLOR.png")
                //  ,this.getImageTexByUrl("static/assets/disp/box_NRM.png")

                //  ,this.getImageTexByUrl("static/assets/noise.jpg")
                //  ,this.getImageTexByUrl("static/assets/disp/lava_03_COLOR.png")
                //  ,this.getImageTexByUrl("static/assets/disp/lava_03_NRM.png")

                ,this.getImageTexByUrl("static/assets/disp/metal_08_COLOR.png")
                ,this.getImageTexByUrl("static/assets/disp/metal_08_NRM.png")

                ,this.m_cubeRTTBuilder.getCubeTexture()
                //lava_03
            ] );
            material.diffuseMapEnabled = true;
            material.normalMapEnabled = true;
            material.indirectEnvMapEnabled = true;
            sph = new Sphere3DEntity();
            sph.setMaterial( material );
            sph.initialize(80 + Math.random() * 100.0,20,20);
            sph.setXYZ(radius * Math.cos(rad), Math.random() * 500.0, radius * Math.sin(rad));
            this.m_rscene.addEntity(sph);

            mEntity = new MirrorProjEntity();
            mEntity.entity = sph;
            mEntity.mirrorPlane = plane;
            this.m_mirrorEntities.push( mEntity );
            param = new PBRParamEntity();
            param.entity = sph;
            param.material = material;
            param.pbrUI = this.m_uiModule;
            param.colorPanel = this.m_uiModule.rgbPanel;
            param.initialize();
            this.m_paramEntities.push(param);
        }
    }
    private m_runFlag: boolean = true;
    private mouseDown(evt: any): void {
        this.m_runFlag = true;
        DebugFlag.Flag_0 = 1;
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
        /*
        if(this.m_runFlag) {
            this.m_runFlag = false;
        }
        else {
            return;
        }
        //*/

        this.update();
        if(this.m_ruisc != null) {

            let stage = this.m_ruisc.getStage3D();
            this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        }
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        //  // current rendering strategy
        //  this.m_rscene.run(true);
        //  if(this.m_ruisc != null) this.m_ruisc.run( true );
        //  DebugFlag.Flag_0 = 0;
        //  return;

        this.renderBegin();

        this.render();

        DebugFlag.Flag_0 = 0;
    }
    private renderBegin(): void {
        let pickFlag: boolean = true;
        if(this.m_ruisc != null) {
            this.m_ruisc.runBegin(true, true);
            this.m_ruisc.update(false, true);
            pickFlag = this.m_ruisc.isRayPickSelected();
        }
        let uiFlag: boolean = this.m_uiModule.isOpen();
        this.m_rscene.runBegin(false);
        // 如果ui panel 打开, 则 this.m_rscene 鼠标事件不会检测到3d物体
        this.m_rscene.setRayTestEanbled(uiFlag);
        this.m_rscene.update(false, !pickFlag);
    }
    private render(): void {

        this.m_rscene.renderBegin();
        ///*
        // --------------------------------------------- cube rtt runbegin
        this.m_cubeRTTBuilder.run();
        // --------------------------------------------- cube rtt run end            
        this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);
        // --------------------------------------------- mirror inverted reflection fbo run begin
        
        for(let i: number = 0; i < this.m_mirrorEntities.length; ++i) {
            this.m_mirrorEntities[i].toMirror();
        }
        this.m_fboIns.run();
        if(this.m_mirrorMapLodEnabled) {
            this.m_fboIns.generateMipmapTextureAt(0);
        }
        // --------------------------------------------- mirror inverted reflection fbo run end
        
        // --------------------------------------------- cube rtt runbegin
        //this.m_cubeRTTBuilder.run();
        // --------------------------------------------- cube rtt run end            
        //this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);

        this.m_rscene.setRenderToBackBuffer();
        
        for(let i: number = 0; i < this.m_mirrorEntities.length; ++i) {
            this.m_mirrorEntities[i].toNormal();
        }
        //*/
        let nv: Vector3D = this.m_rscene.getCamera().getNV();
        nv.y *= -1.0;
        this.m_toneMaterial.setProjNV(nv);
        ///*
        // draw outline begin
        if(this.m_uiModule.isOpen() && this.m_uiModule.getParamEntity() != null) {
            this.m_stencilOutline.setTarget(this.m_uiModule.getParamEntity().entity);
            this.m_stencilOutline.startup();
        }
        else {
            this.m_stencilOutline.quit();
        }
        this.m_stencilOutline.drawBegin();

        this.m_rscene.run(false);

        this.m_stencilOutline.draw();
        // draw outline end
        //  this.m_rscene.runAt(0);
        //  this.m_rscene.runAt(1);
        //  this.m_rscene.runAt(2);

        this.m_rscene.runEnd();
        

        if(this.m_ruisc != null) {
            this.m_ruisc.renderBegin();
            this.m_ruisc.run(false);
            this.m_ruisc.runEnd();
        }
    }
}
    
export default DemoDefaultPBR2;