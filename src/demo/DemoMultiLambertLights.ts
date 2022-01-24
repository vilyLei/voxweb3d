import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import DataMesh from "../vox/mesh/DataMesh";
import QuadGridMeshGeometry from "../vox/mesh/QuadGridMeshGeometry";
import Vector3D from "../vox/math/Vector3D";

import Color4 from "../vox/material/Color4";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";

import LambertLightMaterial from "../vox/material/mcase/LambertLightMaterial";
import { MaterialPipeType } from "../vox/material/pipeline/MaterialPipeType";
import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";

import Billboard3DEntity from "../vox/entity/Billboard3DEntity";

import EngineBase from "../vox/engine/EngineBase";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import { PointLight } from "../light/base/PointLight";
import Matrix4 from "../vox/math/Matrix4";
import { ILightEntity } from "./light/ILightEntity";
import { RotateYPointLightEntity, FloatYPointLightEntity, PointLightEntity } from "./light/PointLightEntity";
import DivLog from "../vox/utils/DivLog";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";
import BillboardLine3DEntity from "../vox/entity/BillboardLine3DEntity";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import { ViewTextureMaker } from "../renderingtoy/mcase/texture/ViewTextureMaker";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import DebugFlag from "../vox/debug/DebugFlag";
import { SpaceCullingMask } from "../vox/space/SpaceCullingMask";
import IRenderMaterial from "../vox/render/IRenderMaterial";
import LambertLightDecorator from "../vox/material/mcase/LambertLightDecorator";

export class DemoMultiLambertLights implements IShaderLibListener {

    private m_engine: EngineBase = null;
    private m_profileInstance: ProfileInstance = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    //private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();
    private m_viewTexMaker: ViewTextureMaker = null;

    private m_lightEntities: ILightEntity[] = [];

    constructor() { }

    initialize(): void {

        console.log("DemoMultiLambertLights::initialize()......");

        if (this.m_engine == null) {

            //DivLog.SetDebugEnabled(true);
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.SetWebBodyColor("black");

            let rparam: RendererParam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 10.0, 8000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAlpha(false);
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(800.0, 800.0, 800.0);

            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam, 7);
            this.m_engine.setProcessIdListAt(0, [0,1,2,3,5]);
            this.m_engine.interaction.zoomLookAtPosition = new Vector3D();
            this.m_engine.rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.initMaterialCtx();
            this.update();

            // this.initScene();
        }
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
        mcParam.shaderFileRename = true;
        mcParam.vsmFboIndex = 0;
        // mcParam.vsmEnabled = false;
        // mcParam.buildBinaryFile = true;

        this.m_materialCtx.addShaderLibListener(this);
        this.m_materialCtx.initialize(this.m_engine.rscene, mcParam);
        let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        pointLight.position.setXYZ(0.0, 150.0, -50.0);
        pointLight.color.setRGB3f(1.0, 1.0, 1.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;

        let floatPointLight: FloatYPointLightEntity = new FloatYPointLightEntity();
        floatPointLight.center.copyFrom(pointLight.position);
        floatPointLight.center.y = 60.0;
        floatPointLight.position.copyFrom(pointLight.position);
        floatPointLight.light = pointLight;
        floatPointLight.displayEntity = this.createPointLightDisp(pointLight);
        this.m_lightEntities.push(floatPointLight);
        
        let rotLightEntity: RotateYPointLightEntity;
        pointLight = this.m_materialCtx.lightModule.getPointLightAt(1);
        pointLight.color.setRGB3f(1.0, 0.0, 0.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;
        rotLightEntity = new RotateYPointLightEntity(Math.random() * 10.0);
        rotLightEntity.rotationSpd = 0.01;
        rotLightEntity.radius = 230.0;
        rotLightEntity.center.copyFrom(this.m_pos01);
        rotLightEntity.center.y += 20.0;
        rotLightEntity.light = pointLight;
        rotLightEntity.displayEntity = this.createPointLightDisp(pointLight);
        this.m_lightEntities.push(rotLightEntity);

        pointLight = this.m_materialCtx.lightModule.getPointLightAt(2);
        pointLight.color.setRGB3f(0.0, 1.0, 1.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;
        rotLightEntity = new RotateYPointLightEntity(Math.random() * 10.0);
        rotLightEntity.rotationSpd = 0.01;
        rotLightEntity.radius = 230.0;
        rotLightEntity.center.copyFrom(this.m_pos02);
        rotLightEntity.center.y += 20.0;
        rotLightEntity.light = pointLight;
        rotLightEntity.displayEntity = this.createPointLightDisp(pointLight);
        this.m_lightEntities.push(rotLightEntity);

        this.m_materialCtx.lightModule.update();
    }
    private createPointLightDisp(pointLight: PointLight): Billboard3DEntity {
        return;
        let size: number = 60.0;
        let billboard: Billboard3DEntity = new Billboard3DEntity();
        billboard.pipeTypes = [MaterialPipeType.FOG_EXP2];
        billboard.setMaterialPipeline(this.m_materialCtx.pipeline);
        billboard.toBrightnessBlend();
        billboard.initialize(size, size, [this.m_materialCtx.getTextureByUrl("static/assets/flare_core_03.jpg")]);
        billboard.setPosition(pointLight.position);
        billboard.setRGB3f(pointLight.color.r, pointLight.color.g, pointLight.color.b);
        this.m_engine.rscene.addEntity(billboard, 3);
        return billboard;
    }
    private m_pos01: Vector3D = new Vector3D(-150.0, 100.0, -170.0);
    private m_pos02: Vector3D = new Vector3D(150, 0.0, 150);
    private m_billLine: BillboardLine3DEntity = null;
    private m_beginPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
    private m_endPos: Vector3D = new Vector3D(0.0, 500.0, -100.0);
    private m_uvPos: Vector3D = new Vector3D(0.3, 0.0);
    /**
     * 产生 detsroy 效果
     */
     private createDestroyEffect(pv: Vector3D): void {
        
        let scaleX: number = 200.0;
        let scaleZ: number = 200.0;
        let tex = this.m_materialCtx.getTextureByUrl( "static/assets/particle/explosion/explodeBg_01c.png" );
        let unitPlane: Plane3DEntity = new Plane3DEntity();
        unitPlane.normalEnabled = true;
        unitPlane.initializeXOZSquare(1.0, [tex]);
        unitPlane.setScaleXYZ(scaleX, 1.0, scaleZ);
        // this.m_engine.rscene.addEntity(unitPlane, 3);
        // unitPlane.setVisible(false);
        
        pv.y += 2.0;
        let color = new Color4(1.3,0.8,0.3);
        let material = new Default3DMaterial();
        //material.premultiplyAlpha = tex.premultiplyAlpha;
        
        material.pipeTypes = [MaterialPipeType.FOG_EXP2];
        material.setMaterialPipeline(this.m_materialCtx.pipeline);
        material.initializeByCodeBuf(true);
        material.setAlpha(0.6);
        material.setTextureList( [tex] );
        material.setRGB3f(color.r, color.g, color.b);

        let entity: DisplayEntity = new DisplayEntity();
        // entity.pipeTypes = [MaterialPipeType.FOG_EXP2];
        // entity.setMaterialPipeline(this.m_materialCtx.pipeline);
        let readeringState = this.m_engine.getRenderProxy().renderingState;
        entity.setMaterial( material );
        entity.copyMeshFrom( unitPlane );
        entity.setPosition(pv);
        entity.setScaleXYZ(scaleX, 1.0, scaleZ);
        entity.setRotationXYZ(0.0, Math.random() * 1000.0, 0.0);
        entity.setRenderState( readeringState.BACK_TRANSPARENT_STATE );
        this.m_engine.rscene.addEntity(entity, 3);

        // let unitBox: Sphere3DEntity = new Sphere3DEntity();
        // unitBox.normalEnabled = true;
        // unitBox.initialize(1.0, 20, 20, [tex]);

        // entity = new DisplayEntity();
        // color = new Color4(1.3,0.8,0.3);
        // material = new Default3DMaterial();        
        // material.pipeTypes = [MaterialPipeType.FOG_EXP2];
        // material.setMaterialPipeline(this.m_materialCtx.pipeline);
        // material.initializeByCodeBuf(true);
        // material.setAlpha(0.6);
        // material.setTextureList( [tex] );
        // material.setRGB3f(color.r, color.g, color.b);

        // entity.setMaterial( material );
        // entity.copyMeshFrom( unitBox );
        // entity.setPosition(new Vector3D(100,0.0,-200.0));
        // entity.setScaleXYZ(100,100,100);
        // this.m_engine.rscene.addEntity(entity, 0);

    }
    private initScene(): void {
        //return;
        if(RendererDevice.IsWebGL1()) {
            this.m_viewTexMaker = new ViewTextureMaker(1, true);
            this.m_viewTexMaker.setClearColorEnabled(true);
        }
        else {
            this.m_viewTexMaker = new ViewTextureMaker(1);
            this.m_viewTexMaker.setClearColorEnabled(false);
        }
        this.m_viewTexMaker.setCameraViewSize(2048, 2048);
        this.m_viewTexMaker.setMapSize(2048, 2048);
        this.m_viewTexMaker.initialize(this.m_engine.rscene, [4]);
        this.m_viewTexMaker.upate();
        this.m_viewTexMaker.force = true;
        this.m_viewTexMaker.histroyUpdating = true;
        this.m_viewTexMaker.run();

        // let frame = new FrustrumFrame3DEntity();
        // frame.initiazlize(this.m_viewTexMaker.getCamera());
        // this.m_engine.rscene.addEntity(frame, 3);

        // let axisT: Axis3DEntity = new Axis3DEntity();
        // axisT.initialize(300);
        // this.m_engine.rscene.addEntity(axisT);

        let color: Color4 = new Color4(1.0, 1.0, 0.0);
        let colorBias: Color4 = new Color4(0.0, 0.0, 0.0);
        /*
        // this.createDestroyEffect(new Vector3D(200,-188.0,-200));
        // // this.initEnvBox();
        // return;
        let billboard: Billboard3DEntity = new Billboard3DEntity();
        billboard.pipeTypes = [MaterialPipeType.FOG_EXP2];
        billboard.setMaterialPipeline(this.m_materialCtx.pipeline);
        //billboard.toBrightnessBlend();
        billboard.toTransparentBlend();
        billboard.initialize(120.0, 120.0, [this.m_materialCtx.getTextureByUrl("static/assets/guangyun_40.png")]);
        billboard.setXYZ(200,300,200);
        //billboard.setRGB3f(pointLight.color.r, pointLight.color.g, pointLight.color.b);
        this.m_engine.rscene.addEntity(billboard, 3);
        //*/
        /*
        let tex4 = this.m_materialCtx.getTextureByUrl("static/assets/flare_core_01.jpg");
        let billLine: BillboardLine3DEntity = new BillboardLine3DEntity();
        billLine.pipeTypes = [MaterialPipeType.FOG_EXP2];
        billLine.setMaterialPipeline(this.m_materialCtx.pipeline);
        //lightLine.showDoubleFace();
        billLine.toBrightnessBlend();
        billLine.initialize([tex4]);
        billLine.setBeginAndEndPos(this.m_beginPos, this.m_endPos);
        billLine.setLineWidth(50.0);
        billLine.setRGB3f(0.1, 0.1, 0.1);
        //billLine.setUVOffset(0.0,0.5);
        billLine.setUVOffset(this.m_uvPos.x, this.m_uvPos.y);
        billLine.setFadeRange(0.3, 0.7);
        billLine.setXYZ(20,0.0,20);
        billLine.setRGBOffset3f(Math.random() * 1.5 + 0.1, Math.random() * 1.5 + 0.1, Math.random() * 1.5 + 0.1);
        this.m_engine.rscene.addEntity(billLine, 3);
        //billLine.setFadeFactor(0.5);
        this.m_billLine = billLine;
        //*/
        ///*
        // let box: Box3DEntity = new Box3DEntity();
        // box.pipeTypes = [MaterialPipeType.FOG_EXP2];
        // box.setMaterialPipeline( this.m_materialCtx.pipeline );
        // box.initializeCube(80, [this.m_materialCtx.getTextureByUrl("static/assets/color_02.jpg")]);
        // box.setXYZ(-200,50,200);
        // this.m_engine.rscene.addEntity(box);

        let radius: number = 30;
        ///*
        let sph02: Sphere3DEntity = new Sphere3DEntity();
        sph02.pipeTypes = [MaterialPipeType.FOG_EXP2];
        sph02.setMaterialPipeline(this.m_materialCtx.pipeline);
        sph02.initialize(radius, 20, 20, [this.m_materialCtx.getTextureByUrl("static/assets/color_02.jpg")]);
        sph02.setXYZ(-200, -170 + radius, 200);
        this.m_engine.rscene.addEntity(sph02);
        
        let crossAxis: Axis3DEntity = new Axis3DEntity();
        crossAxis.pipeTypes = [MaterialPipeType.FOG_EXP2];
        crossAxis.setMaterialPipeline(this.m_materialCtx.pipeline);
        crossAxis.initialize(150.0);
        // crossAxis.setPosition(pointLight.position);
        this.m_engine.rscene.addEntity(crossAxis, 2);
        //*/
        // this.m_pointLight = pointLight;
        // this.m_target = crossAxis;
        //*/
        let vertUniform: VertUniformComp;
        let material: LambertLightMaterial;
        ///*
        material = this.m_materialCtx.createLambertLightMaterial();
        material.envAmbientLightEnabled = true;
        vertUniform = new VertUniformComp();
        material.vertUniform = vertUniform;
        vertUniform.uvTransformEnabled = true;
        this.useMaps(material, "metal_08", true, true, true);
        material.fogEnabled = true;
        //material.vtxUVTransformEnabled = true;
        material.initializeLocalData();
        vertUniform.setUVScale(8.0, 8.0);
        vertUniform.setDisplacementParams(10.0, -10.0);

        // material.setDisplacementParams(10.0, -10.0);
        color.normalizeRandom(0.5);
        colorBias.randomRGB();
        material.setColor(color, colorBias);
        // material.setUVScale(8.0, 8.0);

        material.setSpecularIntensity(128.0);
        material.setBlendFactor(0.3, 0.7);
        color.setRGB3f(1.0, 1.0, 1.0)
        material.setSpecularColor(color);
        //material.setAmbientFactor(0.1,0.1,0.1);

        let sph: Sphere3DEntity = new Sphere3DEntity();
        sph.setMaterial(material);
        sph.initialize(150.0, 100, 100);
        //this.m_pos01.setXYZ(-150.0, 100.0, -170.0);
        sph.setPosition(this.m_pos01);
        sph.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
        this.m_engine.rscene.addEntity(sph);
        let srcEntity: DisplayEntity = sph;
        //*/
        ///*
        material = this.m_materialCtx.createLambertLightMaterial();
        material.envAmbientLightEnabled = true;
        vertUniform = new VertUniformComp();
        material.vertUniform = vertUniform;
        vertUniform.uvTransformEnabled = true;
        this.useMaps(material, "lava_03", true, true, true);
        material.fogEnabled = true;
        // material.vtxUVTransformEnabled = true;
        material.initializeLocalData();
        vertUniform.setUVScale(6.0, 6.0);
        vertUniform.setDisplacementParams(10.0, -10.0);
        color.normalizeRandom(1.1);
        colorBias.normalizeRandom(0.5);
        material.setColor(color, colorBias);
        // material.setUVScale(4.0, 4.0);
        // material.setDisplacementParams(10.0, -10.0);
        material.setSpecularColor(new Color4(1.0, 1.0, 1.0, 1.0));
        material.setSpecularIntensity(64);
        //material.setAmbientFactor(0.1,0.1,0.1);
        //material.setSpecularColor( color );
        sph = new Sphere3DEntity();
        sph.copyMeshFrom(srcEntity);
        sph.setMaterial(material);
        //this.m_pos02.setXYZ(150,0.0,150);
        sph.setPosition(this.m_pos02);
        sph.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
        this.m_engine.rscene.addEntity(sph);
        //*/
        // let tex2 = this.m_materialCtx.getTextureByUrl( "static/assets/letterA.png" );
        // tex2.flipY = true;
        // let plane2: Plane3DEntity = new Plane3DEntity();
        // plane2.toTransparentBlend();
        // plane2.initializeXOZSquare(200.0, [tex2]);
        // plane2.setXYZ(0.0, -190.0, 0.0);
        // this.m_engine.rscene.addEntity(plane2, 4);

        // plane2 = new Plane3DEntity();
        // plane2.toTransparentBlend();
        // plane2.initializeXOZSquare(200.0, [this.m_materialCtx.getTextureByUrl( "static/assets/particle/explosion/explodeBg_01c.png" )]);
        // plane2.setXYZ(200.0, -190.0, 200.0);
        // this.m_engine.rscene.addEntity(plane2, 4);
        
        // let pl = new ScreenFixedAlignPlaneEntity();
        // pl.initialize(-1.0,-1.0, 0.5, 0.5, [this.m_viewTexMaker.getMap()]);
        // this.m_engine.rscene.addEntity(pl, 2);
        //return
        let boxMaterial: IRenderMaterial;
        /*
        material = this.m_materialCtx.createLambertLightMaterial();
        material.diffuseMap2 = this.m_viewTexMaker.getMap();
        material.diffuseMap2Matrix = this.m_viewTexMaker.getMatrix();
        material.envAmbientLightEnabled = true;
        vertUniform = new VertUniformComp();
        material.vertUniform = vertUniform;
        vertUniform.uvTransformEnabled = true;
        this.useMaps(material, "box", true, false, true);
        material.fogEnabled = true;
        material.lightEnabled = true;
        material.initializeLocalData();
        vertUniform.setDisplacementParams(3.0, 0.0);
        // material.setDisplacementParams(3.0, 0.0);
        material.setSpecularIntensity(64.0);
        color.normalizeRandom(1.1);
        material.setSpecularColor(color);
        // let plane: Plane3DEntity = new Plane3DEntity();
        // plane.setMaterial(material);
        // plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0);
        // plane.setXYZ(0.0, -200.0, 0.0);
        // this.m_engine.rscene.addEntity(plane);

        boxMaterial = material;
        //*/

        boxMaterial = this.createLM();

        let box: Box3DEntity = new Box3DEntity();
        box.setMaterial( boxMaterial );
        box.initializeSizeXYZ(800.0,20,800.0);
        box.setXYZ(0.0, -200.0, 0.0);
        this.m_engine.rscene.addEntity(box);
        //*/
        this.initEnvBox();

        // let pl = new ScreenFixedAlignPlaneEntity();
        // pl.initialize(-1.0,-1.0,0.2,0.2,[this.m_materialCtx.vsmModule.getShadowMap()]);
        // this.m_rscene.addEntity(pl, 2);

    }
    private createLM(): IRenderMaterial {
        let vertUniform: VertUniformComp = new VertUniformComp();
        let decor = new LambertLightDecorator();
        let m = this.m_engine.rscene.materialBlock.createMaterial(decor);
        m.setMaterialPipeline( this.m_materialCtx.lambertPipeline );
        decor.diffuseMap2 = this.m_viewTexMaker.getMap();
        decor.diffuseMap2Matrix = this.m_viewTexMaker.getMatrix();
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
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        this.m_materialCtx.envData.setAmbientColorRGB3f(3.0,3.0,3.0);
        this.m_materialCtx.envData.setEnvAmbientLightAreaOffset(-500.0, -500.0);
        this.m_materialCtx.envData.setEnvAmbientLightAreaSize(1000.0, 1000.0);
        this.m_materialCtx.envData.setEnvAmbientMap( this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg") );
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        this.initScene();
    }
    private useLMMaps(material: LambertLightDecorator, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        material.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
        material.specularMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            material.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            material.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            if(material.vertUniform != null) {
                (material.vertUniform as VertUniformComp).displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }
        material.shadowReceiveEnabled = shadowReceiveEnabled;
    }
    private useMaps(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        material.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
        material.specularMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            material.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            material.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            if(material.vertUniform != null) {
                (material.vertUniform as VertUniformComp).displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }
        material.shadowReceiveEnabled = shadowReceiveEnabled;
    }
    private initEnvBox(): void {

        let envBox: Box3DEntity = new Box3DEntity();
        envBox.normalScale = -1.0;
        envBox.pipeTypes = [MaterialPipeType.FOG_EXP2];
        envBox.setMaterialPipeline(this.m_materialCtx.pipeline);
        envBox.showFrontFace();
        envBox.initializeCube(4000.0, [this.m_materialCtx.getTextureByUrl("static/assets/disp/box_COLOR.png")]);
        this.m_engine.rscene.addEntity(envBox, 2);
    }
    private m_dispHeight: number = 10;
    private m_material: LambertLightMaterial = null;
    private m_flag: boolean = true;
    private m_currDisp: DisplayEntity = null;
    private m_currPos: Vector3D = new Vector3D(0.0, -90.0, 0.0);
    private m_times: number = 0;
    private m_clips: DisplayEntity[] = [];
    private mouseDown(evt: any): void {

        this.m_flag = true;
        DebugFlag.Flag_0 = 1;
        this.m_times ++;

        if(this.m_viewTexMaker != null) {

            let tex = this.m_materialCtx.getTextureByUrl( "static/assets/particle/explosion/explodeBg_01c.png" );
            tex.premultiplyAlpha = true;
            let clipPl: Plane3DEntity = new Plane3DEntity();
            clipPl.spaceCullMask = SpaceCullingMask.NONE;
            clipPl.premultiplyAlpha = true;
            //clipPl.toTransparentBlend(true);
            let readeringState = this.m_engine.getRenderProxy().renderingState;
            clipPl.setRenderState( readeringState.BACK_ALPHA_ADD_ALWAYS_STATE );
            //clipPl.toBrightnessBlend(false);
            //clipPl.initializeXOZSquare(200.0, [tex]);
            clipPl.initializeXOZSquare(50.0 + Math.random() * 200.0, [tex]);
            clipPl.setRotationXYZ(0.0, Math.random() * 400.0, 0.0);
            //this.m_currPos.setXYZ(0.0, -180.0, 0.0);
            // this.m_currPos.setXYZ(Math.random() * 400.0 - 200.0, -180.0, Math.random() * 400.0 - 200.0);
            // this.m_engine.interaction.viewRay.
            this.m_engine.interaction.viewRay.setPlaneParam(Vector3D.Y_AXIS, -180.0)
            this.m_engine.interaction.viewRay.intersectPlane();
            let pv: Vector3D = this.m_engine.interaction.viewRay.position;

            this.m_currPos.copyFrom( pv );

            clipPl.setPosition(this.m_currPos);
            (clipPl.getMaterial() as any).setRGB3f(Math.random() * 0.7, Math.random() * 0.7, Math.random() * 0.7);
            (clipPl.getMaterial() as any).setAlpha(0.7);
            this.m_engine.rscene.addEntity(clipPl, 4);
            this.m_clips.push(clipPl);
        }
        /*
        if(this.m_currDisp == null) {

            let tex2 = this.m_materialCtx.getTextureByUrl( "static/assets/letterA.png" );
            tex2.flipY = true;
            let plane2: Plane3DEntity = new Plane3DEntity();
            plane2.spaceCullMask = SpaceCullingMask.NONE;
            plane2.toTransparentBlend();
            plane2.initializeXOZSquare(200.0, [tex2]);
            this.m_currPos.setXYZ(0.0, -180.0, 0.0);
            plane2.setPosition(this.m_currPos);
            this.m_engine.rscene.addEntity(plane2, 4);
            this.m_currDisp = plane2;

            // let sph: Sphere3DEntity = new Sphere3DEntity();
            // sph.initialize(100,10,10, [tex2]);
            // sph.setPosition( this.m_currPos );
            // sph.spaceCullMask = SpaceCullingMask.NONE;
            // this.m_engine.rscene.addEntity(sph, 4);
            // this.m_currDisp = sph;
        }
        else {
            console.log("^^^^^^^^^^^^ use new pos...");
            this.m_currPos.x += 10;
            this.m_currDisp.setPosition( this.m_currPos );
            this.m_currDisp.update();
            this.m_currDisp.setVisible(this.m_times < 10);
        }
        //*/
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        this.m_statusDisp.render();
    }
    private m_time: number = 1.1;
    run(): void {
        // if(this.m_flag) {
        //     this.m_flag = false;
        // }
        // else {
        //     return;
        // }
        // console.log("run()......");

        if (this.m_billLine != null) {
            
            this.m_beginPos.x = 200.0 * Math.sin(this.m_time);            
            this.m_time += 0.02;
            this.m_uvPos.x += 0.01;
            this.m_uvPos.y += 0.01;            
            this.m_billLine.setUVOffset(this.m_uvPos.x, this.m_uvPos.y);            
            ///this.m_billLine.setBeginPos(this.m_beginPos);
            
        }
        for (let i: number = 0; i < this.m_lightEntities.length; ++i) {
            if (this.m_lightEntities[i] != null) {
                this.m_lightEntities[i].run();
            }
        }
        if (this.m_lightEntities.length > 0 && this.m_lightEntities[0] != null) {
            this.m_materialCtx.lightModule.update();
        }

        this.m_statusDisp.update(false);

        // if(this.m_currDisp != null && this.m_currDisp.isInRendererProcess() && (this.m_currDisp.getVisible() || DebugFlag.Flag_0 > 0)) {
        //     this.m_viewTexMaker.force = true;
        //     this.m_viewTexMaker.histroyUpdating = true;
        //     this.m_viewTexMaker.run();
        //     this.m_currDisp.setVisible(false);
        // }
        //this.m_material.setDisplacementParams(this.m_dispHeight * (1.0 + Math.cos(this.m_time)), 0.0);
        this.m_engine.rscene.setClearRGBColor3f(0.2, 0.2, 0.2);
        this.m_materialCtx.run();
        this.m_engine.run();

        if(this.m_viewTexMaker != null && this.m_clips.length > 0) {
            let clipsBoo: boolean = false;
            for(let i: number = 0; i < this.m_clips.length; ++i) {
                if(this.m_clips[i].isInRendererProcess()) {
                    clipsBoo = true;
                }
            }
            if(clipsBoo && DebugFlag.Flag_0 > 0) {
                this.m_viewTexMaker.force = true;
                this.m_viewTexMaker.histroyUpdating = true;
                this.m_viewTexMaker.run();
                for(let i: number = 0; i < this.m_clips.length; ++i) {
                    this.m_clips[i].setVisible( false );
                }
                this.m_clips = [];
            }
        }
        DebugFlag.Flag_0 = 0;
    }
}
export default DemoMultiLambertLights;