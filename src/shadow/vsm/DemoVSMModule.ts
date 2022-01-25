
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import FrustrumFrame3DEntity from "../../vox/entity/FrustrumFrame3DEntity";
import TextureConst from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import ShadowVSMMaterial from "./material/ShadowVSMMaterial";
import DebugFlag from "../../vox/debug/DebugFlag";
import Cylinder3DEntity from "../../vox/entity/Cylinder3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";

import DracoMesh from "../../voxmesh/draco/DracoMesh";
import DracoMeshBuilder from "../../voxmesh/draco/DracoMeshBuilder";
import ThreadSystem from "../../thread/ThreadSystem";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import { MaterialContextParam, MaterialContext } from "../../materialLab/base/MaterialContext";
import { RenderableEntityBlock } from "../../vox/scene/block/RenderableEntityBlock";
import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";
import ScreenFixedAlignPlaneEntity from "../../vox/entity/ScreenFixedAlignPlaneEntity";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import ShadowVSMModule from "./base/ShadowVSMModule";
import EnvLightModule from "../../light/base/EnvLightModule";

export class DemoVSMModule {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_dracoMeshLoader: DracoMeshBuilder = new DracoMeshBuilder();
    private m_reflectPlaneY: number = 0.0;

    private m_materialCtx: MaterialContext = new MaterialContext();

    initialize(): void {
        console.log("DemoVSMModule::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            //DivLog.SetDebugEnabled(true);
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            //rparam.setAttriAlpha(false);
            rparam.setCamProject(45.0, 10.0,8000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            //rparam.setAttripreserveDrawingBuffer(true);
            rparam.setCamPosition(1000.0, 1000.0, 1000.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            let rscene = this.m_rscene;            
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            rscene.materialBlock = materialBlock;
            let entityBlock = new RenderableEntityBlock();
            entityBlock.initialize();
            rscene.entityBlock = entityBlock;
            
            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            let mcParam: MaterialContextParam = new MaterialContextParam();
            mcParam.pointLightsTotal = 2;
            mcParam.directionLightsTotal = 1;
            mcParam.spotLightsTotal = 2;
            mcParam.vsmEnabled = true;

            if (mcParam.vsmEnabled) {
                let envLight = new EnvLightModule(this.m_rscene.getRenderProxy().uniformContext);
                envLight.initialize();
                envLight.setFogColorRGB3f(0.0, 0.8, 0.1);
                this.m_materialCtx.envLightModule = envLight;
                let vsmModule = new ShadowVSMModule(mcParam.vsmFboIndex);
                vsmModule.setCameraPosition(new Vector3D(1, 800, 1));
                vsmModule.setCameraNear(10.0);
                vsmModule.setCameraFar(3000.0);
                vsmModule.setMapSize(512.0, 512.0);
                vsmModule.setCameraViewSize(4000, 4000);
                vsmModule.setShadowRadius(2);
                vsmModule.setShadowBias(-0.0005);
                vsmModule.initialize(this.m_rscene, [0], 3000);
                vsmModule.setShadowIntensity(0.8);
                vsmModule.setColorIntensity(0.3);
                this.m_materialCtx.vsmModule = vsmModule;
            }
            this.m_materialCtx.initialize( this.m_rscene, mcParam);

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(300.0);
            // this.m_rscene.addEntity(axis, 1);


            this.initSceneObjs();
            this.update();

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
        100,
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

        let shadowTex = this.m_materialCtx.vsmModule.getShadowMap();
        
        let uvscale: number = Math.random() * 7.0 + 0.6;
        let shadowMaterial: ShadowVSMMaterial = new ShadowVSMMaterial();
        shadowMaterial.shadowReceiveEnabled = true;
        shadowMaterial.setMaterialPipeline( this.m_materialCtx.pipeline );
        shadowMaterial.initializeByCodeBuf(true);
        shadowMaterial.setTextureList([shadowTex, this.m_materialCtx.getTextureByUrl("static/assets/brickwall_big.jpg")]);
        
        let mesh: DracoMesh = new DracoMesh();
        mesh.setBufSortFormat(shadowMaterial.getBufSortFormat());
        mesh.initialize(modules);

        let scale = this.m_scale;
        let entity: DisplayEntity = new DisplayEntity();        
        entity.pipeTypes = [MaterialPipeType.VSM_SHADOW, MaterialPipeType.FOG_EXP2];
        entity.setMaterial(shadowMaterial);
        entity.setMesh(mesh);
        entity.setScaleXYZ(scale, scale, scale);
        //entity.setRotationXYZ(0, 50, 0);
        this.m_rscene.addEntity(entity);
        let pos: Vector3D = new Vector3D();
        entity.getPosition(pos);
        let pv: Vector3D = entity.getGlobalBounds().min;
        pos.y += (this.m_reflectPlaneY - pv.y) + 370.0;
        entity.setPosition(pos);
        entity.update();

    }
    private useMaterial(entity: DisplayEntity, fog: boolean, shadow: boolean):void {
        entity.setMaterialPipeline( this.m_materialCtx.pipeline );
        if(shadow) {

            let material = new ShadowVSMMaterial();
            material.shadowReceiveEnabled = shadow;
            if(fog) {
                entity.pipeTypes = [MaterialPipeType.VSM_SHADOW, MaterialPipeType.FOG_EXP2];
            }
            entity.setMaterial( material );
        }
        else {
            // entity.setMaterial( new Default3DMaterial() );
            if(fog) {
                entity.pipeTypes = [MaterialPipeType.FOG_EXP2];
            }
        }
    }
    private m_sphPos: Vector3D = new Vector3D();
    private m_sphEntity: DisplayEntity;
    private initSceneObjs(): void {

        this.m_dracoMeshLoader.initialize(2);
        this.m_dracoMeshLoader.setListener(this);
        this.loadNext();

        let frustrum: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustrum.initiazlize(this.m_materialCtx.vsmModule.getCamera());
        this.m_rscene.addEntity(frustrum, 1);

        let shadowTex = this.m_materialCtx.vsmModule.getShadowMap();
        
        let plane: Plane3DEntity = new Plane3DEntity();
        this.useMaterial(plane, true, true);
        plane.initializeXOZ(-600.0, -600.0, 1200.0, 1200.0, [shadowTex, this.m_materialCtx.getTextureByUrl("static/assets/brickwall_big.jpg")]);
        plane.setXYZ(0.0, -1.0, 0.0);
        this.m_rscene.addEntity(plane);
        
        let box: Box3DEntity = new Box3DEntity();
        this.useMaterial(box, true, true);
        box.initializeCube(200.0, [shadowTex, this.m_materialCtx.getTextureByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(box);
        //box.setRotationXYZ(Math.random() * 300.0,Math.random() * 300.0,Math.random() * 300.0);
        box.setRotationXYZ(100.0, -60.0, 0.0);
        box.setXYZ(230.0, 100.0, 0.0);
        box.update();

        let cyl: Cylinder3DEntity = new Cylinder3DEntity();
        this.useMaterial(cyl, true, true);
        cyl.initialize(80.0, 200.0, 20, [shadowTex, this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg")]);
        this.m_rscene.addEntity(cyl);
        cyl.setXYZ(-230.0, 100.0, 0.0);
        
        let sph: Sphere3DEntity = new Sphere3DEntity();
        this.useMaterial(sph, true, true);
        sph.initialize(80.0, 20.0, 20, [shadowTex, this.m_materialCtx.getTextureByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(sph);
        sph.setXYZ(-230.0, 300.0, -200.0);
        this.m_sphEntity = sph;
        sph.getPosition( this.m_sphPos );

        sph = new Sphere3DEntity();
        this.useMaterial(sph, true, true);
        sph.initialize(80.0, 20.0, 20, [shadowTex, this.m_materialCtx.getTextureByUrl("static/assets/metal_08.jpg")]);
        sph.setScaleXYZ(1.2, 1.2, 1.2);
        sph.setXYZ(-40.0, 100.0, -180.0);
        this.m_rscene.addEntity(sph);
        
        let envBox: Box3DEntity = new Box3DEntity();
        this.useMaterial(envBox, true, false);
        envBox.showDoubleFace();
        envBox.initializeCube(5000.0, [this.m_materialCtx.getTextureByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(envBox);

        // let pl = new ScreenFixedAlignPlaneEntity();
        // pl.initialize(-1.0,-1.0,1.0,1.0,[shadowTex]);
        // this.m_rscene.addEntity(pl, 2);
    }
    private mouseDown(evt: any): void {
        DebugFlag.Flag_0 = 1;
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 17);// 60 fps

        this.m_statusDisp.render();
        ThreadSystem.Run();

        this.m_sphPos.x = 300.0 * Math.sin(this.m_sphPos.w);
        this.m_sphPos.w += 0.05;
        this.m_sphEntity.setPosition( this.m_sphPos );
        this.m_sphEntity.update();
        this.m_materialCtx.vsmModule.force = true;
    }
    run(): void {

        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_materialCtx.run();
        this.m_rscene.run(true);
    }
}
export default DemoVSMModule;