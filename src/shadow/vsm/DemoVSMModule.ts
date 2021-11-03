
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import FrustrumFrame3DEntity from "../../vox/entity/FrustrumFrame3DEntity";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import ShadowVSMMaterial from "./material/ShadowVSMMaterial";
import ShadowVSMModule from "./base/ShadowVSMModule";
import DebugFlag from "../../vox/debug/DebugFlag";
import Cylinder3DEntity from "../../vox/entity/Cylinder3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import EnvLightData from "../../light/base/EnvLightData";

import DracoMesh from "../../voxmesh/draco/DracoMesh";
import DracoMeshBuilder from "../../voxmesh/draco/DracoMeshBuilder";
import ThreadSystem from "../../thread/ThreadSystem";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import DivLog from "../../vox/utils/DivLog";
import {MaterialPipeline} from "../../vox/material/pipeline/MaterialPipeline";
import ScreenFixedAlignPlaneEntity from "../../vox/entity/ScreenFixedAlignPlaneEntity";

export class DemoVSMModule {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_vsmModule: ShadowVSMModule;
    private m_envData: EnvLightData;
    private m_dracoMeshLoader: DracoMeshBuilder = new DracoMeshBuilder();
    private m_reflectPlaneY: number = 0.0;

    private m_materialPipeline: MaterialPipeline = null;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
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

            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(300.0);
            // this.m_rscene.addEntity(axis, 1);

            this.m_rscene.setClearRGBColor3f(0.1, 0.2, 0.1);
            this.m_envData = new EnvLightData();
            this.m_envData.initialize();
            this.m_envData.setFogColorRGB3f(0.0, 0.8, 0.1);

            this.m_vsmModule = new ShadowVSMModule(0);
            this.m_vsmModule.setCameraPosition(new Vector3D(120, 800, 120));
            this.m_vsmModule.setCameraNear(10.0);
            this.m_vsmModule.setCameraFar(3000.0);
            this.m_vsmModule.setMapSize(512.0, 512.0);
            this.m_vsmModule.setCameraViewSize(4000, 4000);
            this.m_vsmModule.setShadowRadius(2);
            this.m_vsmModule.setShadowBias(-0.0005);
            this.m_vsmModule.initialize(this.m_rscene, [0], 3000);
            this.m_vsmModule.setShadowIntensity(0.8);
            this.m_vsmModule.setColorIntensity(0.3);

            this.m_materialPipeline = new MaterialPipeline();
            this.m_materialPipeline.addPipe( this.m_envData );
            this.m_materialPipeline.addPipe( this.m_vsmModule.getVSMData() );

            this.m_dracoMeshLoader.initialize(2);
            this.m_dracoMeshLoader.setListener(this);

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

        let shadowTex: TextureProxy = this.m_vsmModule.getShadowMap();

        let uvscale: number = Math.random() * 7.0 + 0.6;
        let shadowMaterial: ShadowVSMMaterial = new ShadowVSMMaterial();
        shadowMaterial.setMaterialPipeline( this.m_materialPipeline );
        shadowMaterial.initializeByCodeBuf(true);
        shadowMaterial.setTextureList([shadowTex, this.getImageTexByUrl("static/assets/brickwall_big.jpg")]);
        
        let mesh: DracoMesh = new DracoMesh();
        mesh.setBufSortFormat(shadowMaterial.getBufSortFormat());
        mesh.initialize(modules);

        let scale = this.m_scale;
        let entity: DisplayEntity = new DisplayEntity();
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
    private useMaterial(entity: DisplayEntity):void {
        let shadowMaterial:ShadowVSMMaterial = new ShadowVSMMaterial();
        shadowMaterial.setMaterialPipeline( this.m_materialPipeline );
        entity.setMaterial(shadowMaterial);
    }
    private m_sphPos: Vector3D = new Vector3D();
    private m_sphEntity: DisplayEntity;
    private initSceneObjs(): void {

        this.loadNext();

        let frustrum: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustrum.initiazlize(this.m_vsmModule.getCamera());
        this.m_rscene.addEntity(frustrum, 1);

        let shadowTex: TextureProxy = this.m_vsmModule.getShadowMap();
        
        let plane: Plane3DEntity = new Plane3DEntity();
        this.useMaterial(plane);
        plane.initializeXOZ(-600.0, -600.0, 1200.0, 1200.0, [shadowTex, this.getImageTexByUrl("static/assets/brickwall_big.jpg")]);
        plane.setXYZ(0.0, -1.0, 0.0);
        this.m_rscene.addEntity(plane);
        
        let envBox: Box3DEntity = new Box3DEntity();
        this.useMaterial(envBox);
        envBox.showAllFace();
        envBox.initializeCube(4000.0, [shadowTex, this.getImageTexByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(envBox);

        let box: Box3DEntity = new Box3DEntity();
        this.useMaterial(box);
        box.initializeCube(200.0, [shadowTex, this.getImageTexByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(box);
        //box.setRotationXYZ(Math.random() * 300.0,Math.random() * 300.0,Math.random() * 300.0);
        box.setRotationXYZ(100.0, -60.0, 0.0);
        box.setXYZ(230.0, 100.0, 0.0);
        box.update();

        let cyl: Cylinder3DEntity = new Cylinder3DEntity();
        this.useMaterial(cyl);
        cyl.initialize(80.0, 200.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/noise.jpg")]);
        this.m_rscene.addEntity(cyl);
        cyl.setXYZ(-230.0, 100.0, 0.0);

        
        let sph: Sphere3DEntity = new Sphere3DEntity();
        this.useMaterial(sph);
        sph.initialize(80.0, 20.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(sph);
        sph.setXYZ(-230.0, 300.0, -200.0);
        this.m_sphEntity = sph;
        sph.getPosition( this.m_sphPos );

        sph = new Sphere3DEntity();
        this.useMaterial(sph);
        sph.initialize(80.0, 20.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/metal_08.jpg")]);
        sph.setScaleXYZ(1.2, 1.2, 1.2);
        sph.setXYZ(-40.0, 100.0, -180.0);
        this.m_rscene.addEntity(sph);

        // let pl = new ScreenFixedAlignPlaneEntity();
        // pl.initialize(-1.0,-1.0,1.0,1.0,[this.m_vsmModule.getShadowMap()]);
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
        this.m_timeoutId = setTimeout(this.update.bind(this), 18);// 20 fps

        this.m_statusDisp.render();
        ThreadSystem.Run();

        this.m_sphPos.x = 300.0 * Math.sin(this.m_sphPos.w);
        this.m_sphPos.w += 0.05;
        this.m_sphEntity.setPosition( this.m_sphPos );
        this.m_sphEntity.update();
        this.m_vsmModule.force = true;
    }
    run(): void {

        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_vsmModule.run();
        this.m_rscene.run(true);
        // this.m_rscene.update(true);
        // this.m_vsmModule.run();
        // this.m_rscene.run(false);
        // this.m_rscene.runEnd();
    }
}
export default DemoVSMModule;