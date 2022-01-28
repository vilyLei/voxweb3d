
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";

import MouseEvent from "../vox/event/MouseEvent";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import ShadowVSMMaterial from "../shadow/vsm/material/ShadowVSMMaterial";
import DebugFlag from "../vox/debug/DebugFlag";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";

import ThreadSystem from "../thread/ThreadSystem";
import DisplayEntity from "../vox/entity/DisplayEntity";
import { IShaderLibListener, MaterialContextParam, MaterialContext } from "../materialLab/base/MaterialContext";
import { RenderableEntityBlock } from "../vox/scene/block/RenderableEntityBlock";
import { RenderableMaterialBlock } from "../vox/scene/block/RenderableMaterialBlock";
import { MaterialPipeType } from "../vox/material/pipeline/MaterialPipeType";
import ShadowVSMModule from "../shadow/vsm/base/ShadowVSMModule";
import EnvLightModule from "../light/base/EnvLightModule";
import MathConst from "../vox/math/MathConst";
import { LightModule } from "../light/base/LightModule";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";

import { ILightEntity } from "./light/ILightEntity";
import { RotateYPointLightEntity, FloatYPointLightEntity, PointLightEntity } from "./light/PointLightEntity";
import { PointLight } from "../light/base/PointLight";
import IRenderMaterial from "../vox/render/IRenderMaterial";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";
import LambertLightDecorator from "../vox/material/mcase/LambertLightDecorator";
import Color4 from "../vox/material/Color4";
import { ILightModule } from "../light/base/ILightModule";
import { IMaterialContext } from "../materialLab/base/IMaterialContext";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";

export class DemoMaterialCtx implements IShaderLibListener {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_lightEntities: ILightEntity[] = [];
    private m_materialCtx: IMaterialContext = new MaterialContext();

    private m_pos01: Vector3D = new Vector3D(-150.0, 100.0, -170.0);
    private m_pos02: Vector3D = new Vector3D(150, 0.0, 150);
    
    private m_beginPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
    private m_endPos: Vector3D = new Vector3D(0.0, 500.0, -100.0);
    private m_uvPos: Vector3D = new Vector3D(0.3, 0.0);

    protected initCtxParam(param: MaterialContextParam): void {

        this.m_materialCtx.lightModule = this.buildLightModule( param );

        let envLight = new EnvLightModule(this.m_rscene.getRenderProxy().uniformContext);
        envLight.initialize();
        envLight.setFogColorRGB3f(0.0, 0.8, 0.1);
        this.m_materialCtx.envLightModule = envLight;

        if (param.vsmEnabled) {
            let vsmModule = new ShadowVSMModule(param.vsmFboIndex);
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
    }
    protected buildLightModule(param: MaterialContextParam): ILightModule {

        let shdCtx = this.m_rscene.getRenderProxy().uniformContext;
        let lightModule = new LightModule(shdCtx);
        for (let i: number = 0; i < param.pointLightsTotal; ++i) {
            lightModule.appendPointLight();
        }
        for (let i: number = 0; i < param.directionLightsTotal; ++i) {
            lightModule.appendDirectionLight();
        }
        for (let i: number = 0; i < param.spotLightsTotal; ++i) {
            lightModule.appendSpotLight();
        }
        // lightModule.update();
        this.initLightModuleData(lightModule);

        return lightModule;
    }
    private initLightModuleData(lightModule: ILightModule): void {
        
        // this.m_materialCtx.initialize(this.m_rscene, mcParam);
        let pointLight: PointLight = lightModule.getPointLightAt(0);
        pointLight.position.setXYZ(0.0, 150.0, -50.0);
        pointLight.color.setRGB3f(1.0, 1.0, 1.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;
                
        let rotLightEntity: RotateYPointLightEntity;
        pointLight = lightModule.getPointLightAt(1);
        pointLight.position.copyFrom(this.m_pos01);
        pointLight.color.setRGB3f(1.0, 0.0, 0.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;

        pointLight = lightModule.getPointLightAt(2);
        pointLight.position.copyFrom(this.m_pos02);
        pointLight.color.setRGB3f(0.0, 1.0, 1.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;

        lightModule.update();
    }
    
    private initLightDisp(lightModule: ILightModule): void {
        
        // this.m_materialCtx.initialize(this.m_rscene, mcParam);
        let pointLight: PointLight = lightModule.getPointLightAt(0);
        
        
        let floatPointLight: FloatYPointLightEntity = new FloatYPointLightEntity();
        floatPointLight.center.copyFrom(pointLight.position);
        floatPointLight.center.y = 60.0;
        floatPointLight.position.copyFrom(pointLight.position);
        floatPointLight.light = pointLight;
        floatPointLight.displayEntity = this.createPointLightDisp(pointLight);
        this.m_lightEntities.push(floatPointLight);
        
        let rotLightEntity: RotateYPointLightEntity;
        
        pointLight = lightModule.getPointLightAt(1);
        rotLightEntity = new RotateYPointLightEntity(Math.random() * 10.0);
        rotLightEntity.rotationSpd = 0.01;
        rotLightEntity.radius = 230.0;
        rotLightEntity.center.copyFrom(pointLight.position);
        rotLightEntity.center.y += 20.0;
        rotLightEntity.light = pointLight;
        rotLightEntity.displayEntity = this.createPointLightDisp(pointLight);
        this.m_lightEntities.push(rotLightEntity);

        pointLight = lightModule.getPointLightAt(2);
        
        rotLightEntity = new RotateYPointLightEntity(Math.random() * 10.0);
        rotLightEntity.rotationSpd = 0.01;
        rotLightEntity.radius = 230.0;
        rotLightEntity.center.copyFrom(pointLight.position);
        rotLightEntity.center.y += 20.0;
        rotLightEntity.light = pointLight;
        rotLightEntity.displayEntity = this.createPointLightDisp(pointLight);
        this.m_lightEntities.push(rotLightEntity);

        this.m_materialCtx.lightModule.update();
    }
    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.shaderLibVersion = "v101";
        mcParam.pointLightsTotal = 3;
        mcParam.directionLightsTotal = 0;
        mcParam.spotLightsTotal = 0;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        mcParam.pbrMaterialEnabled = false;
        mcParam.shaderFileNickname = true;
        mcParam.vsmFboIndex = 0;
        // mcParam.vsmEnabled = false;
        // mcParam.buildBinaryFile = true;

        // mcParam = new MaterialContextParam();
        // mcParam.pointLightsTotal = 3;
        // mcParam.directionLightsTotal = 0;
        // mcParam.spotLightsTotal = 0;
        // mcParam.vsmEnabled = true;

        this.initCtxParam(mcParam);
        this.m_materialCtx.addShaderLibListener(this);
        this.m_materialCtx.initialize(this.m_rscene, mcParam);

        this.initLightDisp(this.m_materialCtx.lightModule);
        
    }
    private createPointLightDisp(pointLight: PointLight): Billboard3DEntity {

        let size: number = 60.0;
        let billboard: Billboard3DEntity = new Billboard3DEntity();
        billboard.pipeTypes = [MaterialPipeType.FOG_EXP2];
        billboard.setMaterialPipeline(this.m_materialCtx.pipeline);
        billboard.toBrightnessBlend();
        billboard.initialize(size, size, [this.m_materialCtx.getTextureByUrl("static/assets/flare_core_03.jpg")]);
        billboard.setPosition(pointLight.position);
        
        billboard.setRGB3f(pointLight.color.r, pointLight.color.g, pointLight.color.b);
        this.m_rscene.addEntity(billboard, 3);
        return billboard;
    }
    initialize(): void {
        console.log("DemoMaterialCtx::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            //DivLog.SetDebugEnabled(true);
            let rparam: RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 1;
            //rparam.setAttriAlpha(false);
            rparam.setCamProject(45.0, 10.0, 8000.0);
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

            // let mcParam: MaterialContextPara
            this.initMaterialCtx();

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(300.0);
            // this.m_rscene.addEntity(axis, 1);

            // let material = new Default3DMaterial();
            // // material.vtxMatrixTransform = false;
            // material.normalEnabled = true;
            // // material.setRGB3f(0.5,0.1,0.3);
            // let box = new Box3DEntity();
            // box.setMaterial(material);
            // box.initializeCube(200.0);
            // this.m_rscene.addEntity( box );

            // let sph = new Sphere3DEntity();
            // sph.setMaterial(material);
            // sph.initialize(100,20,20);
            // this.m_rscene.addEntity( sph );
            // let plane = new Plane3DEntity();
            // plane.setMaterial(material);
            // plane.initializeXOYSquare(2.0);
            // this.m_rscene.addEntity( plane );

        }
    }
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        this.m_materialCtx.envLightModule.setAmbientColorRGB3f(3.0,3.0,3.0);
        this.m_materialCtx.envLightModule.setEnvAmbientLightAreaOffset(-500.0, -500.0);
        this.m_materialCtx.envLightModule.setEnvAmbientLightAreaSize(1000.0, 1000.0);
        this.m_materialCtx.envLightModule.setEnvAmbientMap( this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg") );
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        this.initScene();
    }
    private initScene(): void {

        this.initSceneObjs();
        this.update();
    }
    private useLMMaps(docorator: LambertLightDecorator, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        docorator.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
        docorator.specularMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            docorator.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            docorator.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            if(docorator.vertUniform != null) {
                (docorator.vertUniform as VertUniformComp).displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }
        docorator.shadowReceiveEnabled = shadowReceiveEnabled;
    }
    private createLM(): IRenderMaterial {
        let vertUniform: VertUniformComp = new VertUniformComp();
        let decor = new LambertLightDecorator();
        let m = this.m_rscene.materialBlock.createMaterial(decor);
        m.setMaterialPipeline( this.m_materialCtx.pipeline );
        decor.envAmbientLightEnabled = true;
        vertUniform = new VertUniformComp();
        decor.vertUniform = vertUniform;
        vertUniform.uvTransformEnabled = true;
        this.useLMMaps(decor, "box", true, false, true);
        decor.fogEnabled = true;
        decor.lightEnabled = true;
        decor.initialize();
        vertUniform.setDisplacementParams(3.0, 0.0);
        // material.setDisplacementParams(3.0, 0.0);
        decor.setSpecularIntensity(64.0);
        let color = new Color4();
        color.normalizeRandom(1.1);
        decor.setSpecularColor(color);
        return m;
    }
    private useMaterial(entity: DisplayEntity): void {
        entity.setMaterialPipeline(this.m_materialCtx.pipeline);
        entity.pipeTypes = [MaterialPipeType.FOG_EXP2];
    }
    private m_sphPos: Vector3D = new Vector3D();
    private m_sphEntity: DisplayEntity;
    private initSceneObjs(): void {

        let boxMaterial = this.createLM();
        let sph = new Sphere3DEntity();
        sph.setMaterial( boxMaterial );
        sph.initialize(50.0, 20,20);
        this.m_rscene.addEntity(sph);

        let box: Box3DEntity = new Box3DEntity();
        box.setMaterial( boxMaterial );
        box.initializeSizeXYZ(800.0,20,800.0);
        box.setXYZ(0.0, -200.0, 0.0);
        this.m_rscene.addEntity(box);

        let envBox: Box3DEntity = new Box3DEntity();
        this.useMaterial(envBox);
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
export default DemoMaterialCtx;