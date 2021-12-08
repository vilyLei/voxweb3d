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
import { MaterialContext, MaterialContextParam } from "../materialLab/base/MaterialContext";

import Billboard3DEntity from "../vox/entity/Billboard3DEntity";

import EngineBase from "../vox/engine/EngineBase";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import { PointLight } from "../light/base/PointLight";

export class DemoNormalMap {

    constructor() { }
    
    private m_engine: EngineBase = null;
    private m_profileInstance: ProfileInstance = null;

    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_materialCtx: MaterialContext = new MaterialContext();
    private m_target: DisplayEntity = null;
    private m_pointLight: PointLight = null;

    initialize(): void {

        console.log("DemoNormalMap::initialize()......");

        if (this.m_engine == null) {

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

            let color: Color4 = new Color4(1.0,1.0,0.0);
            let colorBias: Color4 = new Color4(0.0,0.0,0.0);
            
            let mcParam: MaterialContextParam = new MaterialContextParam();
            mcParam.pointLightsTotal = 1;
            mcParam.directionLightsTotal = 0;
            mcParam.spotLightsTotal = 0;
            //mcParam.vsmEnabled = false;
            this.m_materialCtx.initialize( this.m_engine.rscene, mcParam );
            let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
            pointLight.position.setXYZ(0.0, 150.0, -50.0);
            pointLight.color.setRGB3f(1.0, 1.0, 1.0);
            pointLight.attenuationFactor1 = 0.00001;
            pointLight.attenuationFactor2 = 0.000001;
            this.m_materialCtx.lightModule.update();

            let billboard: Billboard3DEntity = new Billboard3DEntity();
            billboard.pipeTypes = [MaterialPipeType.FOG_EXP2];
            billboard.setMaterialPipeline( this.m_materialCtx.pipeline );
            billboard.toBrightnessBlend();
            billboard.initialize(60.0, 60.0, [this.m_materialCtx.getTextureByUrl("static/assets/flare_core_03.jpg")]);
            billboard.setPosition(pointLight.position);
            billboard.setRGB3f(pointLight.color.r, pointLight.color.g, pointLight.color.b);
            this.m_engine.rscene.addEntity(billboard, 3);
            this.m_pointLight = pointLight;
            this.m_target = billboard;

            // let box: Box3DEntity = new Box3DEntity();
            // box.pipeTypes = [MaterialPipeType.FOG_EXP2];
            // box.setMaterialPipeline( this.m_materialCtx.pipeline );
            // box.initializeCube(80, [this.m_materialCtx.getTextureByUrl("static/assets/color_02.jpg")]);
            // box.setXYZ(-200,50,200);
            // this.m_engine.rscene.addEntity(box);

            let sph02: Sphere3DEntity = new Sphere3DEntity();            
            sph02.pipeTypes = [MaterialPipeType.FOG_EXP2];
            sph02.setMaterialPipeline( this.m_materialCtx.pipeline );
            sph02.initialize(30, 20, 20, [this.m_materialCtx.getTextureByUrl("static/assets/color_02.jpg")]);
            sph02.setXYZ(-350,-170,350);
            this.m_engine.rscene.addEntity(sph02);


            let crossAxis: Axis3DEntity = new Axis3DEntity();
            crossAxis.pipeTypes = [MaterialPipeType.FOG_EXP2];
            crossAxis.setMaterialPipeline( this.m_materialCtx.pipeline );
            crossAxis.initialize(150.0);
            // crossAxis.setPosition(pointLight.position);
            this.m_engine.rscene.addEntity(crossAxis, 2);
            // this.m_pointLight = pointLight;
            // this.m_target = crossAxis;

            ///*
            let material: LambertLightMaterial = new LambertLightMaterial();
            this.useMaps(material, "metal_08", true, true, true);
            material.fogEnabled = true;
            material.initializeLocalData();
            material.setDisplacementParams(10.0, -10.0);
            color.normalizeRandom(0.5);
            colorBias.randomRGB();
            material.setColor( color, colorBias );
            material.setUVScale(8.0,8.0);
           
            material.setSpecularIntensity(128.0);
            material.setBlendFactor(0.3,0.7);
            color.setRGB3f(1.0,1.0,1.0)
            material.setSpecularColor( color );
            //material.setAmbientFactor(0.1,0.1,0.1);

            let sph: Sphere3DEntity = new Sphere3DEntity();
            sph.setMaterial(material);
            sph.initialize(150.0,100,100);
            sph.setXYZ(-150.0, 100.0, -170.0);
            sph.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
            this.m_engine.rscene.addEntity(sph);
            let srcEntity: DisplayEntity = sph;
            //*/
            ///*
            material = new LambertLightMaterial();
            this.useMaps(material, "lava_03", true, true, true);
            material.fogEnabled = true;
            material.initializeLocalData();
            color.normalizeRandom(1.1);
            colorBias.normalizeRandom(0.5);
            material.setColor( color, colorBias );
            material.setUVScale(4.0,4.0);
            material.setDisplacementParams(10.0, -10.0);
            material.setSpecularColor(new Color4(1.0,1.0,1.0,1.0));
            material.setSpecularIntensity(64);
            //material.setAmbientFactor(0.1,0.1,0.1);
            //material.setSpecularColor( color );
            sph = new Sphere3DEntity();
            sph.copyMeshFrom(srcEntity);
            sph.setMaterial(material);
            //sph.initialize(150.0,100,100);
            sph.setXYZ(150,0.0,150);
            sph.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
            this.m_engine.rscene.addEntity(sph);
            //*/
            ///*
            material = new LambertLightMaterial();
            this.useMaps(material, "box", true, false, true);
            material.setMaterialPipeline(null);
            material.fogEnabled = true;
            material.lightEnabled = true;
            material.initializeLocalData();
            material.setDisplacementParams(3.0, 0.0);
            material.setSpecularIntensity(64.0);
            color.normalizeRandom(1.1);
            material.setSpecularColor( color );
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.setMaterialPipeline(this.m_materialCtx.pipeline);
            plane.setMaterial(material);
            plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0);
            plane.setXYZ(0.0, -200.0, 0.0);
            this.m_engine.rscene.addEntity(plane);
            //*/
            /*
            let size: number = 400.0;
            let gridGeom: QuadGridMeshGeometry = new QuadGridMeshGeometry();
            gridGeom.normalEnabled = true;
            //gridGeom.normalScale = -1.0;
            gridGeom.initializeXOZPlane(new Vector3D(-0.5 * size, 0, -0.5 * size), size,size, 120,120);
            //console.log("gridGeom: ", gridGeom);

            let dataMesh: DataMesh = new DataMesh();
            //dataMesh.wireframe = true;
            dataMesh.setBufSortFormat(material.getBufSortFormat());
            dataMesh.initializeFromGeometry(gridGeom);
            
            let entity: DisplayEntity = new DisplayEntity();
            entity.setMaterial(material);
            entity.setMesh(dataMesh);
            entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            //entity.setScaleXYZ(4.0,12.0,4.0);
            //entity.setXYZ(0,-400,0);
            this.m_rscene.addEntity(entity);
            //*/
            //this.m_material = material;
            //this.m_material.setDisplacementParams(this.m_dispHeight,0.0);
            
            this.initEnvBox();
            this.update();
            
            // let pl = new ScreenFixedAlignPlaneEntity();
            // pl.initialize(-1.0,-1.0,0.2,0.2,[this.m_materialCtx.vsmModule.getShadowMap()]);
            // this.m_rscene.addEntity(pl, 2);
        }
    }
    private useMaps(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {
        
        material.setMaterialPipeline( this.m_materialCtx.pipeline );

        material.diffuseMap =           this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_COLOR.png");
        material.specularMap =          this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_SPEC.png");
        if(normalMapEnabled) {
            material.normalMap =        this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_NRM.png");
        }
        if(aoMapEnabled) {
            material.aoMap =            this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
        }
        if(displacementMap) {
            material.displacementMap =  this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
        }
        if(shadowReceiveEnabled && this.m_materialCtx.vsmModule != null) {
            material.shadowMap =        this.m_materialCtx.vsmModule.getShadowMap();
        }
    }
    private initEnvBox(): void {
        
        let material: LambertLightMaterial = new LambertLightMaterial();
        this.useMaps(material, "box", false, false);
        material.fogEnabled = true;

        material.initializeLocalData();
        material.initializeByCodeBuf( true );
        
        let envBox: Box3DEntity = new Box3DEntity();
        envBox.normalScale = -1.0;
        envBox.setMaterial( material );
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
    private m_time: number = 0.0;
    run(): void {
        if(this.m_target != null) {

            this.m_pointLight.position.y = 60 + 220 * Math.cos(this.m_time);
            this.m_target.setPosition( this.m_pointLight.position );
            this.m_target.update();
            this.m_materialCtx.lightModule.update();
        }
        this.m_statusDisp.update( false );
        this.m_time += 0.01;
        //this.m_material.setDisplacementParams(this.m_dispHeight * (1.0 + Math.cos(this.m_time)), 0.0);
        this.m_engine.rscene.setClearRGBColor3f(0.2,0.2,0.2);
        this.m_materialCtx.run();
        this.m_engine.run();
    }
}
export default DemoNormalMap;