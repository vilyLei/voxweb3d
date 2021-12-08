
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import { TextureConst, TextureDataType, TextureFormat } from "../../vox/texture/TextureConst";
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
import AOPreMaterial from "./material/AOPreMaterial";
import AONVAndZMaterial from "./material/AONVAndZMaterial";
import Vector3D from "../../vox/math/Vector3D";
import SSAONoiseData from "./material/SSAONoiseData";
import AOEntityMaterial from "./material/AOEntityMaterial";
import AODeferredEntityMaterial from "./material/AODeferredEntityMaterial";
import AOMaterial from "./material/AOMaterial";
import AOPostMaterial from "./material/AOPostMaterial";
import ScreenAlignPlaneEntity from "../../vox/entity/ScreenAlignPlaneEntity";
import PingpongBlur from "../../renderingtoy/mcase/PingpongBlur";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";


import DracoMesh from "../../voxmesh/draco/DracoMesh";
import {DracoTaskListener} from "../../voxmesh/draco/DracoTask";
import DracoMeshBuilder from "../../voxmesh/draco/DracoMeshBuilder";
import ThreadSystem from "../../thread/ThreadSystem";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import DisplayEntity from "../../vox/entity/DisplayEntity";
export class DemoSSAO3 implements DracoTaskListener {
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
    
    private m_dracoMeshLoader: DracoMeshBuilder = new DracoMeshBuilder();

    private m_clearColor: Color4 = new Color4();
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {

        console.log("DemoSSAO3::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            //  rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);
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

            
            this.m_dracoMeshLoader.initialize(2);
            this.m_dracoMeshLoader.setListener( this );

            this.loadNext();
        }
    }
    private m_aoSrcPlane: ScreenAlignPlaneEntity;
    private m_aoDstPlane: ScreenAlignPlaneEntity;
    private m_aoPreMaterial: AONVAndZMaterial;
    private initSceneObjs(): void {

        let aoTex: RTTTextureProxy = this.m_blurModule.getDstTexture();
        
        let plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial( new AOEntityMaterial() );
        plane.initializeXOZSquare(1600.0, [this.getImageTexByUrl("static/assets/wood_01.jpg"), aoTex]);
        this.m_rscene.addEntity(plane);
        
        let box: Box3DEntity = new Box3DEntity();
        box.setMaterial( new AOEntityMaterial() );
        box.initializeCube(300.0, [this.getImageTexByUrl("static/assets/box_wood01.jpg"), aoTex]);
        this.m_rscene.addEntity(box);
        let srcBox: Box3DEntity = box;
        let scale: number = 1.0;
        for (let i: number = 0; i < 5; ++i) {
            box = new Box3DEntity();
            box.setMaterial( new AOEntityMaterial() );
            box.copyMeshFrom(srcBox);
            box.initializeCube(300.0, [this.getImageTexByUrl("static/assets/brickwall_big.jpg"), aoTex]);
            scale = 0.1 + Math.random() * 0.8;
            box.setScaleXYZ(scale, scale, scale);
            box.setXYZ(Math.random() * 1200.0 - 600.0, Math.random() * 200.0, Math.random() * 1200.0 - 600.0);
            box.setRotationXYZ(Math.random() * 300.0, Math.random() * 300.0, Math.random() * 300.0);
            this.m_rscene.addEntity(box);

        }
        
        let textures:TextureProxy[] = [];
        textures.push( this.getImageTexByUrl("static/assets/guangyun_H_0007.png") );
        textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
        textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));
        textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));
        let size: number = 100.0;
        for(let i: number = 0; i < 60; ++i) {
            size = 10.0 + Math.random() * 30.0;
            let particle:Billboard3DEntity = new Billboard3DEntity();
            particle.initialize(size,size, [textures[Math.round(Math.random() * (textures.length - 1))]]);
            particle.setXYZ(Math.random() * 600.0 - 300.0, Math.random() * 500.0 - 200.0, Math.random() * 600.0 - 300.0);
            this.m_rscene.addEntity(particle,1);
        }
    }
    private initTest(): void {

        this.m_aoPreMaterial = new AONVAndZMaterial();
        this.m_aoPreMaterial.initializeByCodeBuf(false);
        
        this.m_aoPreFBO = this.m_rscene.createFBOInstance();
        this.m_aoPreFBO.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);        // set rtt background clear rgb(r=0.0,g=0.0,b=0.0) color
        this.m_aoPreFBO.createFBOAt(0, 512, 512, true, false);
        this.m_aoPreFBO.setGlobalMaterial( this.m_aoPreMaterial, false );
        this.m_aoPreFBO.setRenderToFloatTextureAt(0, 0);                // framebuffer color attachment 0: normal texture
        this.m_aoPreFBO.setRProcessIDList([0]);

        let aoNoise: SSAONoiseData = new SSAONoiseData();
        aoNoise.initialize(this.m_rscene.textureBlock);
        let aoMaterial: AOMaterial = new AOMaterial(aoNoise, 9);
        this.m_aoSrcPlane = new ScreenAlignPlaneEntity();
        this.m_aoSrcPlane.setMaterial(aoMaterial);
        this.m_aoSrcPlane.initialize(-1.0, -1.0, 2.0, 2.0, [this.m_aoPreFBO.getRTTAt(0), aoNoise.createNoiseTex(128)]);
        //this.m_rscene.addEntity(this.m_aoSrcPlane, 1);

        this.m_aoFBO = this.m_rscene.createFBOInstance();
        this.m_aoFBO.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);      // set rtt background clear rgb(r=0.0,g=0.0,b=0.0) color
        this.m_aoFBO.createFBOAt(0, 512, 512, true, false);
        this.m_aoFBO.setRenderToRTTTextureAt(1, 0);             // framebuffer color attachment 0: ao color texture

        this.m_aoDstPlane = new ScreenAlignPlaneEntity();
        this.m_aoDstPlane.initialize(-1.0, -1.0, 2.0, 2.0, [this.m_aoFBO.getRTTAt(0)]);
        //this.m_rscene.addEntity(this.m_aoDstPlane, 1);

        let size: number = 256;
        let pw: number = Math.round(this.m_rscene.getViewWidth() * 0.5);
        let ph: number = Math.round(this.m_rscene.getViewHeight() * 0.5);
        this.m_blurModule = new PingpongBlur(this.m_rscene.getRenderer());
        this.m_blurModule.setBlurCount(2);
        this.m_blurModule.setSyncViewSizeEnabled(false);
        this.m_blurModule.setFBOSize(pw, ph);
        this.m_blurModule.setBlurDensity(0.6);
        this.m_blurModule.bindDrawEntity(this.m_aoDstPlane);
        this.m_blurModule.setBackbufferVisible(false);
        /*
        let postMaterial: AOPostMaterial = new AOPostMaterial()
        let aoPostPlane: ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
        aoPostPlane.setMaterial(postMaterial);
        aoPostPlane.initialize(-1.0, -1.0, 2.0, 2.0, [this.m_aoPreFBO.getRTTAt(0), this.m_blurModule.getDstTexture()]);
        this.m_rscene.addEntity(aoPostPlane, 1);
        //*/
        
        this.initSceneObjs();

        ///*
        let srcPlane: ScreenAlignPlaneEntity = new ScreenAlignPlaneEntity();
        //srcPlane.initialize(-1.0, -1.0, 1.0, 1.0, [this.m_aoPreFBO.getRTTAt(0)]);
        srcPlane.initialize(-1.0, -1.0, 0.8, 0.8, [this.m_aoFBO.getRTTAt(0)]);
        this.m_rscene.addEntity(srcPlane, 2);
        //*/
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
        ThreadSystem.Run();
        //  if(this.m_flag) {
        //      this.m_flag = false;
        //  }
        //  else {
        //      return;
        //  }
        //  console.log("############# render begin...");

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
    
    private m_urls: string[] = [
        "static/assets/modules/bunny.rawmd",
        "static/assets/modules/loveass.rawmd",
        "static/assets/modules/cloth02.rawmd"
    ];
    private m_scale: number = 1.0;
    private m_pos: Vector3D = null;
    private m_scales: number[] = [
        300.0,
        1.0,
        1.0
    ];
    private m_posList: Vector3D[] = [
        new Vector3D(-600.0,0.0,-600.0),
        new Vector3D(600.0,0.0,600.0),
        new Vector3D(0.0,0.0,0.0),
    ];
    private loadNext(): void {
        if(this.m_urls.length > 0) {
            this.m_pos = this.m_posList.pop();
            this.m_scale = this.m_scales.pop();
            this.m_dracoMeshLoader.load( this.m_urls.pop() );
        }
    }
    dracoParse(pmodule: any, index: number, total: number): void {
    }
    dracoParseFinish(modules: any[], total: number): void {

        console.log("dracoParseFinish, modules total: ", total);

        let aoTex: RTTTextureProxy = this.m_blurModule.getDstTexture();
        let material: AOEntityMaterial = new AOEntityMaterial()
        material.initializeByCodeBuf( true );
        //material.setTextureList( [this.getImageTexByUrl("static/assets/noise.jpg"), aoTex] );
        material.setTextureList( [this.getImageTexByUrl("static/assets/wood_01.jpg"), aoTex] );
        let scale = this.m_scale;
        
        let mesh: DracoMesh = new DracoMesh();
        mesh.setBufSortFormat( material.getBufSortFormat() );
        mesh.initialize(modules);
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial( material );
        entity.setMesh( mesh );
        entity.setScaleXYZ(scale, scale, scale);
        //entity.setRotationXYZ(0, Math.random() * 300, 0);
        this.m_rscene.addEntity(entity);
        let pos: Vector3D = new Vector3D();
        entity.getPosition( pos );
        let pv: Vector3D = entity.getGlobalBounds().min;
        pos.y += (0 - pv.y) + 70.0;
        pos.x += this.m_pos.x;
        pos.z += this.m_pos.z;
        entity.setPosition( pos );
        entity.update();
        this.m_rscene.addEntity(entity);

        this.loadNext();
    }
}
export default DemoSSAO3;