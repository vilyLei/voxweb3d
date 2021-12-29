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

export class DemoMultiLambertLights implements IShaderLibListener {

    constructor() { }

    private m_engine: EngineBase = null;
    private m_profileInstance: ProfileInstance = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    // private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    private m_lightEntities: ILightEntity[] = [];
    initialize(): void {

        console.log("DemoMultiLambertLights::initialize()......");

        if (this.m_engine == null) {

            //DivLog.SetDebugEnabled(true);
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45, 10.0, 8000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(800.0, 800.0, 800.0);
            //rparam.setCamProject(45, 20.0, 9000.0);

            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam, 6);
            this.m_engine.interaction.zoomLookAtPosition = new Vector3D();

            this.initMaterialCtx();
            this.update();

            // this.initScene();
        }
    }
    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 3;
        mcParam.directionLightsTotal = 0;
        mcParam.spotLightsTotal = 0;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        mcParam.pbrMaterialEnabled = false;
        // mcParam.vsmEnabled = false;
        //mcParam.buildBinaryFile = true;

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

        let billboard: Billboard3DEntity = new Billboard3DEntity();
        billboard.pipeTypes = [MaterialPipeType.FOG_EXP2];
        billboard.setMaterialPipeline(this.m_materialCtx.pipeline);
        billboard.toBrightnessBlend();
        billboard.initialize(60.0, 60.0, [this.m_materialCtx.getTextureByUrl("static/assets/flare_core_03.jpg")]);
        billboard.setPosition(pointLight.position);
        billboard.setRGB3f(pointLight.color.r, pointLight.color.g, pointLight.color.b);
        this.m_engine.rscene.addEntity(billboard, 3);
        return billboard;
    }
    private m_pos01: Vector3D = new Vector3D(-150.0, 100.0, -170.0);
    private m_pos02: Vector3D = new Vector3D(150, 0.0, 150);
    private initScene(): void {

        let color: Color4 = new Color4(1.0, 1.0, 0.0);
        let colorBias: Color4 = new Color4(0.0, 0.0, 0.0);
        /*
        // let box: Box3DEntity = new Box3DEntity();
        // box.pipeTypes = [MaterialPipeType.FOG_EXP2];
        // box.setMaterialPipeline( this.m_materialCtx.pipeline );
        // box.initializeCube(80, [this.m_materialCtx.getTextureByUrl("static/assets/color_02.jpg")]);
        // box.setXYZ(-200,50,200);
        // this.m_engine.rscene.addEntity(box);

        let sph02: Sphere3DEntity = new Sphere3DEntity();
        sph02.pipeTypes = [MaterialPipeType.FOG_EXP2];
        sph02.setMaterialPipeline(this.m_materialCtx.pipeline);
        sph02.initialize(30, 20, 20, [this.m_materialCtx.getTextureByUrl("static/assets/color_02.jpg")]);
        sph02.setXYZ(-350, -170, 350);
        this.m_engine.rscene.addEntity(sph02);

        let crossAxis: Axis3DEntity = new Axis3DEntity();
        crossAxis.pipeTypes = [MaterialPipeType.FOG_EXP2];
        crossAxis.setMaterialPipeline(this.m_materialCtx.pipeline);
        crossAxis.initialize(150.0);
        // crossAxis.setPosition(pointLight.position);
        this.m_engine.rscene.addEntity(crossAxis, 2);
        // this.m_pointLight = pointLight;
        // this.m_target = crossAxis;
        //*/
        let vertUniform: VertUniformComp;
        let material: LambertLightMaterial;
        ///*
        material = this.m_materialCtx.createLambertLightMaterial();
        vertUniform= new VertUniformComp();
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
        ///*
        
        material = this.m_materialCtx.createLambertLightMaterial();
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
        let plane: Plane3DEntity = new Plane3DEntity();
        
        plane.setMaterial(material);
        plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0);
        plane.setXYZ(0.0, -200.0, 0.0);
        this.m_engine.rscene.addEntity(plane);
        //*/
        this.initEnvBox();

        // let pl = new ScreenFixedAlignPlaneEntity();
        // pl.initialize(-1.0,-1.0,0.2,0.2,[this.m_materialCtx.vsmModule.getShadowMap()]);
        // this.m_rscene.addEntity(pl, 2);
    }
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        this.initScene();
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

        let material: LambertLightMaterial = this.m_materialCtx.createLambertLightMaterial();
        this.useMaps(material, "box", false, false);
        material.fogEnabled = true;

        material.initializeLocalData();
        material.initializeByCodeBuf(true);

        let envBox: Box3DEntity = new Box3DEntity();
        envBox.normalScale = -1.0;
        envBox.setMaterial(material);
        envBox.showFrontFace();
        envBox.initializeCube(4000.0);
        this.m_engine.rscene.addEntity(envBox, 2);
    }
    private m_dispHeight: number = 10;
    private m_material: LambertLightMaterial = null;
    private mouseDown(evt: any): void {

    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        this.m_statusDisp.render();
    }
    run(): void {
        for (let i: number = 0; i < this.m_lightEntities.length; ++i) {
            if (this.m_lightEntities[i] != null) {
                this.m_lightEntities[i].run();
            }
        }
        if (this.m_lightEntities.length > 0 && this.m_lightEntities[0] != null) {
            this.m_materialCtx.lightModule.update();
        }

        this.m_statusDisp.update(false);
        //this.m_material.setDisplacementParams(this.m_dispHeight * (1.0 + Math.cos(this.m_time)), 0.0);
        this.m_engine.rscene.setClearRGBColor3f(0.2, 0.2, 0.2);
        this.m_materialCtx.run();
        this.m_engine.run();
    }
}
export default DemoMultiLambertLights;