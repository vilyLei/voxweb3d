import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDevice from "../vox/render/RendererDevice";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import DebugFlag from "../vox/debug/DebugFlag";
import TextureProxy from "../vox/texture/TextureProxy";

import PBRMaterial from "./material/PBRMaterial";
import PBRShaderDecorator from "./material/PBRShaderDecorator";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";

import DisplayEntity from "../vox/entity/DisplayEntity";

import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";
import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import Box3DEntity from "../vox/entity/Box3DEntity";
import DataMesh from "../vox/mesh/DataMesh";
import QuadGridMeshGeometry from "../vox/mesh/QuadGridMeshGeometry";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";
import { UserInteraction } from "../vox/engine/UserInteraction";
import ObjData3DEntity from "../vox/entity/ObjData3DEntity";
import { TextBillboardLoading } from "../loading/base/TextBillboardLoading";
import { RenderableEntityBlock } from "../vox/scene/block/RenderableEntityBlock";
import { RenderableMaterialBlock } from "../vox/scene/block/RenderableMaterialBlock";

export class DemoPBRTexViewer implements IShaderLibListener {

    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_interaction: UserInteraction = new UserInteraction();

    //private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();
    
    private m_loading: TextBillboardLoading = new TextBillboardLoading();
    private m_waitingTotal: number = 0;
    
    fogEnabled: boolean = false;
    vtxFlatNormal: boolean = false;
    aoMapEnabled: boolean = false;

    constructor() { }

    initialize(): void {
        console.log("DemoPBRTexViewer::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 50.0, 10000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
            this.m_rscene.updateCamera();
            
            let rscene = this.m_rscene;
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            rscene.materialBlock = materialBlock;
            let entityBlock = new RenderableEntityBlock();
            entityBlock.initialize();
            rscene.entityBlock = entityBlock;

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

            this.m_interaction.initialize(this.m_rscene);
            this.m_interaction.cameraZoomController.syncLookAt = true;

            this.m_statusDisp.initialize();

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            this.m_rscene.setClearRGBColor3f(0.2, 0.2, 0.2);
            
            this.initMaterialCtx();

            this.m_loading.loadingInfoScale = this.m_loading.loadingNameScale = 1.0;
            this.m_loading.initialize( this.m_rscene );
            
            this.update();
        }
    }
    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 1;
        mcParam.directionLightsTotal = 2;
        mcParam.spotLightsTotal = 0;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        mcParam.lambertMaterialEnabled = false;
        mcParam.pbrMaterialEnabled = true;
        this.m_materialCtx.addShaderLibListener(this);
        this.m_materialCtx.initialize(this.m_rscene, mcParam);

        let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        if (pointLight != null) {
            // pointLight.position.setXYZ(200.0, 180.0, 200.0);
            pointLight.position.setXYZ(0.0, 190.0, 0.0);
            pointLight.color.setRGB3f(0.0, 2.2, 0.0);
            pointLight.attenuationFactor1 = 0.00001;
            pointLight.attenuationFactor2 = 0.00005;
        }
        let spotLight: SpotLight = this.m_materialCtx.lightModule.getSpotLightAt(0);
        if (spotLight != null) {
            spotLight.position.setXYZ(0.0, 30.0, 0.0);
            spotLight.direction.setXYZ(0.0, -1.0, 0.0);
            spotLight.color.setRGB3f(0.0, 40.2, 0.0);
            spotLight.attenuationFactor1 = 0.000001;
            spotLight.attenuationFactor2 = 0.000001;
            spotLight.angleDegree = 30.0;
        }
        let directLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
        if (directLight != null) {
            directLight.color.setRGB3f(2.0, 0.0, 0.0);
            directLight.direction.setXYZ(-1.0, -1.0, 0.0);
            directLight = this.m_materialCtx.lightModule.getDirectionLightAt(1);
            if (directLight != null) {
                directLight.color.setRGB3f(0.0, 0.0, 2.0);
                directLight.direction.setXYZ(1.0, 1.0, 0.0);
            }
        }
        this.m_materialCtx.lightModule.update();
        //  this.m_materialCtx.lightModule.showInfo();
    }
    private initScene(): void {

        this.createEntity();
        this.m_waitingTotal = this.m_materialCtx.getTextureLoader().getWaitTotal();

        //this.m_waitingTotal = 
    }
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        this.initScene();
    }
    private createMeshPlane(material: PBRMaterial): void {

        let size: number = 400.0;

        let gridGeom: QuadGridMeshGeometry = new QuadGridMeshGeometry();
        gridGeom.normalEnabled = true;
        //gridGeom.normalScale = -1.0;
        gridGeom.initializeXOZPlane(new Vector3D(-0.5 * size, 0, -0.5 * size), size, size, 200, 200);
        //console.log("gridGeom: ", gridGeom);

        let dataMesh: DataMesh = new DataMesh();
        //dataMesh.wireframe = true;
        dataMesh.setBufSortFormat(material.getBufSortFormat());
        dataMesh.initializeFromGeometry(gridGeom);

        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(dataMesh);
        //entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        //entity.setScaleXYZ(4.0,12.0,4.0);
        //entity.setXYZ(0,-400,0);
        this.m_rscene.addEntity(entity);
        this.m_rotV = new Vector3D();
        this.m_target = entity;
    }
    private m_target: DisplayEntity = null;
    private m_rotV: Vector3D = new Vector3D(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
    private createEntity(): void {

        // let axis: Axis3DEntity = new Axis3DEntity();
        // axis.initialize(300.0);
        // this.m_rscene.addEntity(axis);
        let diffuseMap: TextureProxy = null;
        let normalMap: TextureProxy = null;
        let armMap: TextureProxy = null;
        let aoMap: TextureProxy = null;
        this.aoMapEnabled = true;
        let ns: string = "rust_coarse_01";
        ns = "medieval_blocks_02";
        ns = "rough_plaster_broken";
        //ns = "metal_plate";

        diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+ns+"_diff_1k.jpg");
        //diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg");
        normalMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+ns+"_nor_1k.jpg");
        armMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+ns+"_arm_1k.jpg");

        if (this.aoMapEnabled) {
            //aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
            //aoMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
        }
        let displacementMap: TextureProxy = null;
        displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/pbrtex/"+ns+"_disp_1k.jpg");
        let parallaxMap: TextureProxy = null;
        //parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/brick_bumpy01.jpg");
        parallaxMap = displacementMap;

        let disSize: number = 700.0;
        let dis: number = 500.0;
        let posList: Vector3D[] = [];
        let beginV: Vector3D = new Vector3D(-disSize, 0.0, -disSize);

        let rn: number = 4;
        let cn: number = 4;
        for (let i: number = 0; i < rn; ++i) {
            for (let j: number = 0; j < cn; ++j) {
                if ((i < 1 || i > (rn - 2)) || (j < 1 || j > (cn - 2))) {
                    let pos: Vector3D = new Vector3D(beginV.x + dis * j, beginV.y, beginV.z + dis * i);
                    posList.push(pos);
                }
            }
        }
        let material: PBRMaterial;
        let sph: Sphere3DEntity;
        ///*
        let vertUniform: VertUniformComp;
        material = this.createMaterial(1.0, 0.4, 1.0);
        vertUniform = material.vertUniform as VertUniformComp;

        material.decorator.aoMapEnabled = this.aoMapEnabled;
        material.decorator.armMap = armMap;

        material.decorator.scatterEnabled = false;

        // material.decorator.specularEnvMap = this.m_specularEnvMap;
        material.decorator.diffuseMap = diffuseMap;
        material.decorator.normalMap = normalMap;
        material.decorator.aoMap = aoMap;

        vertUniform.displacementMap = displacementMap;

        material.decorator.parallaxMap = parallaxMap;

        material.initializeByCodeBuf(true);
        //vertUniform.setDisplacementParams(10.0, -5.0);
        vertUniform.setDisplacementParams(0.02, -0.01);
        material.setAlbedoColor(1.0,1.0,1.0);
        material.setScatterIntensity(8.0);
        material.setParallaxParams(1, 10, 5.0, 0.02);
        material.setSideIntensity(8.0);
        
        // let objUrl: string = "static/assets/obj/ellipsoid_01.obj";
        let objUrl: string = "static/assets/obj/apple_01.obj";
        //objUrl = "static/assets/obj/building_001.obj";
        let objDisp: ObjData3DEntity = new ObjData3DEntity();
        objDisp.baseParsering = false;
        objDisp.setMaterial(material);
        objDisp.showDoubleFace();
        //objDisp.dataIsZxy = true;
        let moduleScale: number = 400.0;//10.0 + Math.random() * 5.5;
        //objDisp.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
        objDisp.initializeByObjDataUrl(objUrl);
        objDisp.setScaleXYZ(moduleScale, moduleScale, moduleScale);
        //objDisp.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        this.m_rscene.addEntity(objDisp);
        this.m_target = objDisp;
    }
    private m_runFlag: boolean = true;
    private mouseDown(evt: any): void {
        this.m_runFlag = true;
        DebugFlag.Flag_0 = 1;
    }
    private mouseUp(evt: any): void {
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
        this.m_statusDisp.update(false);
        /*
        if(this.m_runFlag) {
            this.m_runFlag = false;
        }
        else {
            return;
        }
        //*/
        if(!this.m_loading.isLoaded()) {
            let curr: number = this.m_target != null && this.m_target.isInRendererProcess() ? 1 : 0;            
            let progress: number = (curr + this.m_waitingTotal - this.m_materialCtx.getTextureLoader().getWaitTotal()) / (this.m_waitingTotal + 1);
            this.m_loading.run( progress );
        }
        
        this.m_interaction.run();
        this.m_rscene.run();

        //DebugFlag.Flag_0 = 0;
    }

    private makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {

        let material: PBRMaterial = this.m_materialCtx.createPBRLightMaterial(true, true, true);
        let decorator: PBRShaderDecorator = material.decorator;
        decorator.scatterEnabled = false;
        decorator.woolEnabled = true;
        decorator.absorbEnabled = false;
        decorator.normalNoiseEnabled = false;

        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);

        return material;
    }
    createMaterial(ao: number = 1.0, roughness: number = 0.0, metallic: number = 1.0): PBRMaterial {

        let material: PBRMaterial;
        material = this.makePBRMaterial(metallic, roughness, ao);

        let decorator: PBRShaderDecorator = material.decorator;
        decorator.shadowReceiveEnabled = false;
        decorator.fogEnabled = this.fogEnabled;
        decorator.indirectEnvMapEnabled = false;
        decorator.specularEnvMapEnabled = true;
        decorator.diffuseMapEnabled = true;
        decorator.normalMapEnabled = true;
        return material;
    }
}

export default DemoPBRTexViewer;