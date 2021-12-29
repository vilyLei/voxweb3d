import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import RendererScene from "../vox/scene/RendererScene";
import DataMesh from "../vox/mesh/DataMesh";
import QuadGridMeshGeometry from "../vox/mesh/QuadGridMeshGeometry";
import Vector3D from "../vox/math/Vector3D";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import Color4 from "../vox/material/Color4";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";

import {SpecularMode, LambertLightMaterial} from "../vox/material/mcase/LambertLightMaterial";
import { MaterialContextParam, DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import RendererState from "../vox/render/RendererState";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";

export class DemoLambertLight {

    constructor() { }
    
    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_rotV: Vector3D = new Vector3D(Math.random() * 370, Math.random() * 370, Math.random() * 370);
    private m_target: DisplayEntity;
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    initialize(): void {

        console.log("DemoLambertLight::initialize()......");

        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 10.0, 8000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);

            this.m_statusDisp.initialize();

            this.m_rscene.enableMouseEvent(true);

            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let mcParam: MaterialContextParam = new MaterialContextParam();
            mcParam.pointLightsTotal = 2;
            mcParam.directionLightsTotal = 1;
            mcParam.spotLightsTotal = 2;
            mcParam.vsmEnabled = false;
            
            this.m_materialCtx.initialize( this.m_rscene, mcParam);
            if(!RendererDevice.IsWinExternalVideoCard() && RendererDevice.IsWindowsPCOS()) {
                alert("当前浏览器3D渲染没有使用独立显卡");
            }
            let posV: Vector3D = new Vector3D();
            let axis: Axis3DEntity;

            let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
            if(pointLight != null) {
                pointLight.position.setXYZ(-200.0, 56.0, 0.0);
                //pointLight.position.setXYZ(0.0, 56.0, 0.0);
                pointLight.color.setRGB3f(0.0, 1.0, 0.0);
                pointLight = this.m_materialCtx.lightModule.getPointLightAt(1);
                if(pointLight != null) {
                    pointLight.position.setXYZ(-200.0, 56.0, -200.0);
                    pointLight.color.setRGB3f(0.0, 0.0, 1.0);
                }
            }

            let direcLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
            if(direcLight != null) {
                direcLight.direction.setXYZ(0.0, -1.0, 1.0);
                direcLight.color.setRGB3f(0.7, 0.7, 0.7);
            }
            let spotLight: SpotLight = this.m_materialCtx.lightModule.getSpotLightAt(0);
            if(spotLight != null) {
                spotLight.position.setXYZ(0, 56, 0);
                spotLight.direction.setXYZ(0.0, -1.0, 0.7);
                spotLight.color.setRGB3f(1.0, 0.0, 1.0);
                spotLight = this.m_materialCtx.lightModule.getSpotLightAt(1);
                if(spotLight != null) {
                    spotLight.position.setXYZ(100, 56, 0);
                    spotLight.direction.setXYZ(0.0, -1.0, -0.7);
                    spotLight.color.setRGB3f(1.0, 0.0, 0.0);
                }
            }

            this.m_materialCtx.lightModule.update();
            this.m_materialCtx.lightModule.showInfo();

            // for(let i: number = 0; i < 0; ++i) {
            //     axis = new Axis3DEntity();
            //     axis.initializeCross(50.0);
            //     posV.copyFrom( pointList[i] );
            //     axis.setPosition( posV);
            //     this.m_rscene.addEntity(axis);
            // }

            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(300.0);
            // this.m_rscene.addEntity(axis);

            let material: LambertLightMaterial;
            
            let vertUniform: VertUniformComp;
            material = new LambertLightMaterial();
            vertUniform = new VertUniformComp()
            material.vertUniform = vertUniform;
            vertUniform.uvTransformEnabled = true;
            ///*
            //material.setMaterialPipeline( this.m_materialCtx.pipeline );            
            //material.diffuseMap =             this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg");
            //material.diffuseMap =             this.m_materialCtx.getTextureByUrl("static/assets/color_02.jpg");
            //material.normalMap =              this.m_materialCtx.getTextureByUrl("static/assets/brickwall_normal.jpg");
            //material.specularMap =            this.m_materialCtx.getTextureByUrl("static/assets/brickwall_big_occ.jpg");
            //material.specularMap =            this.m_materialCtx.getTextureByUrl("static/assets/brickwall_big_spec.jpg");
            //material.aoMap =                  this.m_materialCtx.getTextureByUrl("static/assets/brickwall_big_occ.jpg");
            //material.aoMap =                  this.m_materialCtx.getTextureByUrl("static/assets/brickwall_big_surfaceOcc.jpg");
            //material.parallaxMap =            this.m_materialCtx.getTextureByUrl("static/assets/brickwall_big_occ.jpg");
            //material.parallaxMap =            this.m_materialCtx.getTextureByUrl("static/assets/moss_01.jpg");
            //material.parallaxMap =            this.m_materialCtx.getTextureByUrl("static/assets/brickwall_big_surfaceOcc.jpg");
            //*/
            //material.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg");
            this.useMaps(material,"lava_03",true,false,false,true,true);
            //*/
            material.shadowReceiveEnabled = false;
            //material.specularMap = null;
            material.fogEnabled = false;
            material.lightEnabled = true;
            material.specularMode = SpecularMode.FragColor;
            material.initializeLocalData();
            vertUniform.setUVScale(2.0, 2.0);
            //material.setSpecularColor(new Color4(0.5,0.5,0.5,1.0));
            material.setSpecularIntensity(64.0);
            material.setLightBlendFactor(0.7,0.3);
            material.setBlendFactor(0.2,0.8);
            material.setParallaxParams(1, 5, 2.0, 0.01);
            
            material.setSpecularColor(new Color4(2.0, 2.0, 2.0));
            material.setColor(new Color4(1.0,1.0,1.0,1.0), new Color4(0.4,0.4,0.4));
            //material
            //material.setColor(new Color4(0.5,1.7,0.5,1.0))
            /*
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.showDoubleFace();
            plane.setMaterial(material);
            plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0);
            //plane.setXYZ(0.0, -200.0, 0.0);
            this.m_rscene.addEntity(plane);
            //*/
            ///*
            let sphMaterial: LambertLightMaterial = new LambertLightMaterial();
            //sphMaterial.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/default.jpg");
            sphMaterial.copyFrom(material);
            vertUniform = sphMaterial.vertUniform.clone() as VertUniformComp;
            sphMaterial.vertUniform = vertUniform;
            vertUniform.uvTransformEnabled = true;
            sphMaterial.vertUniform.initialize();
            vertUniform.setUVScale(4.0, 4.0);
            //sphMaterial.initializeByCodeBuf(true);
            ///*
            let sph = new Sphere3DEntity();
            sph.setMaterial(sphMaterial);
            sph.initialize(100,20,20)
            sph.setXYZ(0, -110, 0);
            this.m_rscene.addEntity(sph);
            this.m_target = sph;
            //*/
            /*
            let box = new Box3DEntity();
            box.setMaterial(material);
            box.initializeCube(110)
            box.setXYZ(0, -100, 0);
            this.m_rscene.addEntity(box);
            this.m_target = box;
            //*/
            /*
            material.setUVScale(1.0,2.0);
            let cly: Cylinder3DEntity = new Cylinder3DEntity();
            cly.setMaterial(material);
            cly.initialize(100,200,20);
            cly.setXYZ(0, -130, 0);
            this.m_rscene.addEntity(cly);
            this.m_target = cly;
            //*/
            this.m_material = material;
            
            //this.initEnvBox();
            this.update();
        }
    }
    private useMaps(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false, parallaxMapEnabled: boolean = false): void {
        
        material.setMaterialPipeline( this.m_materialCtx.pipeline );

        if(material.diffuseMap == null)material.diffuseMap =           this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_COLOR.png");
        material.specularMap =          this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_SPEC.png");
        if(normalMapEnabled) {
            material.normalMap =        this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_NRM.png");
        }
        if(aoMapEnabled) {
            material.aoMap =            this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
        }
        if (displacementMap) {
            if(material.vertUniform != null) {
                (material.vertUniform as VertUniformComp).displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }
        if(parallaxMapEnabled) {
            material.parallaxMap =  this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
        }
        material.shadowReceiveEnabled = shadowReceiveEnabled;
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
        this.m_rscene.addEntity(envBox);
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
        this.m_timeoutId = setTimeout(this.update.bind(this), 17);// 20 fps
        this.m_statusDisp.statusInfo = "/" + RendererState.DrawCallTimes;
        this.m_statusDisp.render();
        
        if(this.m_target != null) {
            this.m_rotV.x += 0.2;
            this.m_rotV.y += 0.1;
            this.m_target.setRotation3(this.m_rotV);
            this.m_target.update();
        }
        this.m_time += 0.01;
        //this.m_material.setDisplacementParams(this.m_dispHeight * (1.0 + Math.cos(this.m_time)), 0.0);
    }
    private m_time: number = 0.0;
    run(): void {


        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        this.m_statusDisp.update(false);

        //this.m_materialCtx.run();
        this.m_rscene.run(true);

        // this.m_materialCtx.run();
        // this.m_rscene.update(true);
        // //this.m_vsmModule.force = true;
        // this.m_rscene.run(false);
        // this.m_rscene.runEnd();
    }
}
export default DemoLambertLight;