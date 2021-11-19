
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
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import FBOInstance from "../vox/scene/FBOInstance";
import CameraBase from "../vox/view/CameraBase";
import MathConst from "../vox/math/MathConst";
import MirrorToneMaterial from "./material/MirrorToneMaterial";

import DebugFlag from "../vox/debug/DebugFlag";
import StencilOutline from "../renderingtoy/mcase/outline/StencilOutline";
import PostOutline from "../renderingtoy/mcase/outline/PostOutline";
import RendererState from "../vox/render/RendererState";
import DracoMeshBuilder from "../voxmesh/draco/DracoMeshBuilder";
import ThreadSystem from "../thread/ThreadSystem";
import DracoMesh from "../voxmesh/draco/DracoMesh";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";

export class DemoOutline {
    constructor() { }

    private m_stencilOutline: StencilOutline = new StencilOutline();
    private m_postOutline: PostOutline = new PostOutline();
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_dracoMeshLoader: DracoMeshBuilder = new DracoMeshBuilder();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoOutline::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setAttriStencil(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
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
            this.m_stencilOutline.initialize( this.m_rscene );

            this.m_postOutline.initialize(this.m_rscene, 1, [0,1]);
            this.m_postOutline.setFBOSizeScaleRatio(0.5);
            this.m_postOutline.setRGB3f(0.0,2.0,0.0);
            this.m_postOutline.setOutlineDensity(2.5);
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
            
            this.initPlaneReflection();

            this.update();
            
            this.m_dracoMeshLoader.initialize(2);
            this.m_dracoMeshLoader.setListener(this);
        }
    }

    private m_posList: Vector3D[] = [
        new Vector3D(0, 200, 0)
        //new Vector3D(0,0,0)
    ];
    private m_modules: string[] = [
        //"static/assets/modules/bunny.rawmd",
        //"static/assets/modules/stainlessSteel.rawmd",
        //"static/assets/modules/loveass.rawmd"
        //"static/assets/modules/car01.rawmd"
        "static/assets/modules/longxiaPincer.rawmd"
    ];
    private m_scale: number = 1.0;
    private m_pos: Vector3D = null;
    private m_scales: number[] = [
        50,
        //1.0,
        //0.5,
        //20.0
    ];
    private loadNext(): void {
        if (this.m_modules.length > 0) {
            this.m_pos = this.m_posList.pop();
            this.m_scale = this.m_scales.pop();
            this.m_dracoMeshLoader.load(this.m_modules.pop());
        }
    }
    dracoParse(pmodule: any, index: number, total: number): void {
        //console.log("parse progress: "+index+"/"+total);
    }
    dracoParseFinish(modules: any[], total: number): void {

        console.log("dracoParseFinish, modules: ", modules);

        let material: Default3DMaterial = new Default3DMaterial();
        material.initializeByCodeBuf(true);
        material.setTextureList([this.getImageTexByUrl("static/assets/wood_01.jpg")]);
        let mesh: DracoMesh = new DracoMesh();
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(modules);
        let scale = this.m_scale;
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);
        entity.setScaleXYZ(scale, scale, scale);
        //entity.setRotationXYZ(0, 50, 0);
        this.m_rscene.addEntity(entity, 1);
        let pos: Vector3D = new Vector3D();
        entity.getPosition(pos);
        let pv: Vector3D = entity.getGlobalBounds().min;
        pos.y += (0 - pv.y) + 70.0;
        entity.setPosition(pos);
        entity.update();

        this.m_postOutline.setTarget( entity );
        //  this.m_postOutline.setFBOSizeScaleRatio(2.0);
        //  this.m_postOutline.setOutlineThickness(4.0);
        //this.m_postOutline.setRGB3f(2.0,0.0,2.0);
        //this.m_postOutline.setPostRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
    }
    private m_projType: number = 0;
    private m_fboIns: FBOInstance = null;
    private m_rttCamera:CameraBase = null;    
    private m_viewWidth: number = 1024.0;
    private m_viewHeight: number = 1024.0;
    private m_toneMaterial: MirrorToneMaterial;
    private m_refPlane:Plane3DEntity = null;
    private m_pv: Vector3D = new Vector3D();
    private m_tempPosV: Vector3D = new Vector3D();
    private m_tempScaleV: Vector3D = new Vector3D();
    private m_targetEntity: Box3DEntity = null;
    private m_mirrorTexLodEnabled: boolean = true;
    private initPlaneReflection(): void {
        this.m_projType = 0;

        let scale: number = 2.5;
        let box: Box3DEntity = new Box3DEntity();

        box.uvPartsNumber = 6;
        box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixparts.jpg")]);
        box.setScaleXYZ(scale,scale,scale);
        box.setRotationXYZ(Math.random() * 300.0, Math.random() * 300.0, Math.random() * 300.0);
        box.setXYZ(0.0, 60.0, 0.0);
        this.m_rscene.addEntity(box);
        (box.getMaterial() as any).setRGB3f(2.0,0.0,0.0);
        this.m_targetEntity = box;
        this.loadNext();
        //this.m_postOutline.setTarget( box );

        ///*
        this.m_fboIns = this.m_rscene.createFBOInstance();
        this.m_fboIns.asynFBOSizeWithViewport();
        this.m_fboIns.setClearRGBAColor4f(0.0,0.0,0.0,1.0);   // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        this.m_fboIns.createFBOAt(0,512,512,true,false);
        this.m_fboIns.setRenderToRTTTextureAt(0, 0);          // framebuffer color attachment 0
        this.m_fboIns.setRProcessIDList([0]);
        this.m_rscene.setRenderToBackBuffer();
        if(this.m_mirrorTexLodEnabled) {
            this.m_fboIns.getRTTAt(0).enableMipmap();
        }
        ///*
        let scrPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        scrPlane.setRenderState( RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        scrPlane.initialize(-1,-1,2,2, [this.m_postOutline.getpreColorRTT()]);
        this.m_rscene.addEntity(scrPlane, 3);
        //*/

        let camera: CameraBase = this.m_rscene.getCamera();
        let camPos: Vector3D = camera.getPosition();
        camPos.y *= -1.0;
        let viewWidth: number = this.m_viewWidth;
        let viewHeight: number = this.m_viewHeight;
        this.m_rttCamera = new CameraBase();
        this.m_rttCamera.name = "rttCamera";
        this.m_rttCamera.lookAtRH(camPos, new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,1.0,0.0));
        this.m_rttCamera.perspectiveRH(MathConst.DegreeToRadian(45.0),viewWidth/viewHeight,50.1,10000.0);
        //this.m_rttCamera.orthoRH(50.1,10000.0, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
        this.m_rttCamera.setViewXY(0,0);
        this.m_rttCamera.setViewSize(viewWidth, viewHeight);
        this.m_rttCamera.update();
        
        this.m_fboIns.getRTTAt(0).setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        ///*
        let texList: TextureProxy[] = [
            this.m_fboIns.getRTTAt(0),
            this.getImageTexByUrl("static/assets/brickwall_big.jpg"),
            this.getImageTexByUrl("static/assets/brickwall_normal.jpg")
        ];

        let toneMaterial: MirrorToneMaterial = new MirrorToneMaterial( this.m_mirrorTexLodEnabled );
        toneMaterial.setTextureLodLevel(6);
        this.m_toneMaterial = toneMaterial;
        let plane:Plane3DEntity = new Plane3DEntity();
        plane.flipVerticalUV = true;
        plane.setMaterial(toneMaterial);
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, texList);
        plane.setXYZ(0,-170, 0);
        //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
        this.m_rscene.addEntity(plane, 1);
        this.m_refPlane = plane;
        //*/

        //  let frustrum:FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        //  frustrum.initiazlize( this.m_rttCamera );
        //  frustrum.setScaleXYZ(0.5,0.5,0.5);
        //  this.m_rscene.addEntity( frustrum, 2);

        //  this.m_stencilOutline.setTarget(this.m_targetEntity);
        //  this.m_stencilOutline.setRGB3f(0.5,1.0,0.0);
    }
    private m_flag: boolean = true;
    private mouseDown(evt: any): void {

        this.m_flag = true;
        DebugFlag.Flag_0 = 1;
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

        ThreadSystem.Run();
        //  if(this.m_flag) {
        //      this.m_flag = false;
        //  }
        //  else {
        //      return;
        //  }
        //  console.log("run begin...");

        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        
        if(this.m_projType == 1) {
            this.m_rscene.run(true);
        }
        else {
            
            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);
            this.m_rscene.runBegin();
            this.m_rscene.update(false);

            let nv: Vector3D = this.m_rscene.getCamera().getNV();
            ///*
            // --------------------------------------------- fbo run begin
            this.m_refPlane.getPosition(this.m_pv);
            this.m_targetEntity.getPosition( this.m_tempPosV );
            this.m_targetEntity.getScaleXYZ( this.m_tempScaleV );
            this.m_targetEntity.setScaleXYZ(this.m_tempScaleV.x, -this.m_tempScaleV.y, this.m_tempScaleV.z);
            this.m_targetEntity.update();
            let maxV: Vector3D = this.m_targetEntity.getGlobalBounds().max;
            let dh: number = maxV.y - this.m_pv.y;
            this.m_targetEntity.setXYZ(this.m_tempPosV.x, this.m_tempScaleV.y - dh - 0.1, this.m_tempPosV.y);
            this.m_targetEntity.showFrontFace();
            this.m_targetEntity.update();

            this.m_fboIns.run();
            if(this.m_mirrorTexLodEnabled) {
                this.m_fboIns.generateMipmapTextureAt(0);
            }
            this.m_targetEntity.showBackFace();
            this.m_targetEntity.setScaleXYZ(this.m_tempScaleV.x, this.m_tempScaleV.y, this.m_tempScaleV.z);
            this.m_targetEntity.setPosition( this.m_tempPosV );
            this.m_targetEntity.update();

            //*/

            // --------------------------------------------- fbo run end
            nv.y *= -1.0;
            this.m_toneMaterial.setProjNV(nv);
            this.m_rscene.setRenderToBackBuffer();
            
            
            /*
            // draw stencil outline
            this.m_stencilOutline.drawBegin();
            this.m_rscene.runAt(0);
            this.m_rscene.runAt(1);
            this.m_stencilOutline.draw();
            this.m_stencilOutline.drawEnd();
            //*/
            this.m_rscene.runAt(0);
            this.m_rscene.runAt(1);
            this.m_rscene.runAt(2);

            
            this.m_postOutline.drawBegin();
            this.m_postOutline.draw();
            //this.m_postOutline.drawTest();
            this.m_postOutline.drawEnd();

            //this.m_rscene.runAt(3);

            this.m_rscene.runEnd();
        }

    }
}
export default DemoOutline;