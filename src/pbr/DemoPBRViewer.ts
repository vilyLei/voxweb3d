import Vector3D from "../vox/math/Vector3D";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDevice from "../vox/render/RendererDevice";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import RendererSubScene from "../vox/scene/RendererSubScene";
import DebugFlag from "../vox/debug/DebugFlag";
import IRenderTexture from "../vox/render/texture/IRenderTexture";

import PBRMaterial from "./material/PBRMaterial";
import PBRShaderDecorator from "./material/PBRShaderDecorator";
import TextureConst from "../vox/texture/TextureConst";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";

import DracoMeshBuilder from "../voxmesh/draco/DracoMeshBuilder";
import DracoMesh from "../voxmesh/draco/DracoMesh";
import { DracoWholeModuleLoader } from "../voxmesh/draco/DracoModuleLoader";
import DisplayEntity from "../vox/entity/DisplayEntity";
import ThreadSystem from "../thread/ThreadSystem";

import Plane3DEntity from "../vox/entity/Plane3DEntity";

import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";
import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import Box3DEntity from "../vox/entity/Box3DEntity";
import DataMesh from "../vox/mesh/DataMesh";
import QuadGridMeshGeometry from "../vox/mesh/QuadGridMeshGeometry";
import { VertUniformComp } from "../vox/material/component/VertUniformComp";

export class DemoPBRViewer implements IShaderLibListener {
    constructor() { }
    private m_rscene: RendererScene = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    
    private m_reflectPlaneY: number = -220;

    //private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    fogEnabled: boolean = false;
    hdrBrnEnabled: boolean = true;
    vtxFlatNormal: boolean = false;
    aoMapEnabled: boolean = false;

    initialize(): void {
        console.log("DemoPBRViewer::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 50.0, 10000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            //rparam.setCamPosition(2000.0, 2000.0, 2000.0);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            //rparam.setCamLookAtPos( this.m_lookV.x, this.m_lookV.y, this.m_lookV.z );
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
            this.m_rscene.updateCamera();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize();

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            this.m_rscene.setClearRGBColor3f(0.2, 0.2, 0.2);

            this.initMaterialCtx();
            // for(let i: number = 0; i < this.m_materialCtx.lightModule.getPointLightsTotal(); ++i) {
            //     let crossAxis: Axis3DEntity = new Axis3DEntity();
            //     crossAxis.initializeCross(30);
            //     crossAxis.setPosition(this.m_materialCtx.lightModule.getPointLightAt(i).position);
            //     this.m_rscene.addEntity(crossAxis);
            // }
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
        this.m_materialCtx.addShaderLibListener( this );
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
        if(spotLight != null) {
            spotLight.position.setXYZ(0.0, 30.0, 0.0);
            spotLight.direction.setXYZ(0.0, -1.0, 0.0);
            spotLight.color.setRGB3f(0.0, 40.2, 0.0);
            spotLight.attenuationFactor1 = 0.000001;
            spotLight.attenuationFactor2 = 0.000001;
            spotLight.angleDegree = 30.0;
        }
        let directLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
        if (directLight != null) {
            directLight.color.setRGB3f(2.0,0.0,0.0);
            directLight.direction.setXYZ(-1.0, -1.0, 0.0);
            directLight = this.m_materialCtx.lightModule.getDirectionLightAt(1);
            if(directLight != null) {
                directLight.color.setRGB3f(0.0,0.0,2.0);
                directLight.direction.setXYZ(1.0, 1.0, 0.0);
            }
        }
        this.m_materialCtx.lightModule.update();
        //  this.m_materialCtx.lightModule.showInfo();
    }
    private initScene(): void {
        
        this.createEntity();
        /*
        this.m_dracoMeshLoader.initialize(2);
        this.m_dracoModule = new ViewerDracoModule();
        this.m_dracoModule.materialCtx = this.m_materialCtx;
        this.m_dracoModule.viewer = this;
        this.m_dracoModule.specularEnvMap = this.m_specularEnvMap;
        this.m_dracoModule.aoMapEnabled = this.aoMapEnabled;
        this.m_dracoModule.initialize(this.m_rscene, this.m_dracoMeshLoader);
        // this.m_dracoModule.loadNext();
        //*/
    }
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ",loadingTotal, loadedTotal);
        this.initScene();
    }
    private createMeshPlane(material: PBRMaterial): void {

        let size: number = 400.0;
        
        let gridGeom: QuadGridMeshGeometry = new QuadGridMeshGeometry();
        gridGeom.normalEnabled = true;
        //gridGeom.normalScale = -1.0;
        gridGeom.initializeXOZPlane(new Vector3D(-0.5 * size, 0, -0.5 * size), size,size, 200,200);
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

        let axis: Axis3DEntity = new Axis3DEntity();
        //  axis.initialize(300.0);
        //  this.m_rscene.addEntity(axis);
        this.aoMapEnabled = true;
        let ns: string = "lava_03";
        //let diffuseMap: IRenderTexture = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_COLOR.png");
        let diffuseMap: IRenderTexture = this.m_materialCtx.getTextureByUrl("static/assets/color_01.jpg");
        //diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/noise.jpg");
        //let normalMap: IRenderTexture = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_NRM.png");
        let normalMap: IRenderTexture = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_norm.png");
        let aoMap: IRenderTexture = null;
        if (this.aoMapEnabled) {
            //aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
            aoMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
        }
        let displacementMap: IRenderTexture = null;
        //displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
        displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
        let parallaxMap: IRenderTexture = null;
        //parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
        //parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
        parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/brick_bumpy01.jpg");

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
        material = this.createMaterial();
        vertUniform = material.vertUniform as VertUniformComp;
        
        //material.decorator.normalMapEnabled = false;
        material.decorator.aoMapEnabled = this.aoMapEnabled;
        //material.decorator.aoMapEnabled = false;
        material.decorator.scatterEnabled = false;

        // material.decorator.specularEnvMap = this.m_specularEnvMap;
        material.decorator.diffuseMap = diffuseMap;
        material.decorator.normalMap = normalMap;
        material.decorator.aoMap = aoMap;
        vertUniform.displacementMap = displacementMap;
        
        material.decorator.parallaxMap = parallaxMap;
        
        material.initializeByCodeBuf(true);
        vertUniform.setDisplacementParams(50.0, 0.0);
        material.setAlbedoColor(1.0,1.0,1.0);
        material.setRoughness(0.3);
        material.setScatterIntensity(64.0);        
        material.setParallaxParams(1, 10, 5.0, 0.02);
        material.setSideIntensity(8);
        material.setMetallic(0.1);

        // this.createMeshPlane( material );
        // return;
        /*
        let plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(material);
        plane.initializeXOZSquare(300.0);
        this.m_rscene.addEntity(plane);
        this.m_rotV = new Vector3D();
        this.m_target = plane;

        // let box: Box3DEntity = new Box3DEntity();
        // box.setMaterial( material );
        // box.initializeCube(300.0);
        // this.m_target = box;
        // this.m_target.setRotation3( this.m_rotV );
        // this.m_rscene.addEntity(box);

        return;
        //*/
        //material.setTextureList(texList);
        let srcSph = new Sphere3DEntity();
        srcSph.setMaterial(material);
        srcSph.initialize(100.0, 150, 150);
        srcSph.setRotation3(this.m_rotV);
        this.m_rscene.addEntity(srcSph);
        this.m_target = srcSph;
        //return;
        console.log("material clone doing...");
        let new_sph = new Sphere3DEntity();
        let new_material = material.clone();
        new_sph.setMaterial(new_material);
        new_sph.initialize(100.0, 150, 150);
        new_sph.setXYZ(200,0.0,200);
        this.m_rscene.addEntity(new_sph);

        return;
        //*/
        let scale: number = 1.0;
        let uvscale: number;
        let total: number = posList.length;
        total = 1;
        let rad: number;
        for (let i: number = 0; i < total; ++i) {

            rad = Math.random() * 100.0;
            uvscale = Math.random() * 7.0 + 0.6;

            material = this.createMaterial();
            material.decorator.aoMapEnabled = this.aoMapEnabled;
            //  material.setTextureList(texList);
            //material.decorator.specularEnvMap = this.m_specularEnvMap;
            material.decorator.diffuseMap = diffuseMap;
            material.decorator.normalMap = normalMap;
            material.decorator.aoMap = aoMap;

            material.setAlbedoColor(Math.random() * 3, Math.random() * 3, Math.random() * 3);

            scale = 0.8 + Math.random();
            let pr: number = scale * 100.0;
            sph = new Sphere3DEntity();
            sph.setMaterial(material);
            if (srcSph != null) sph.copyMeshFrom(srcSph);
            sph.initialize(100.0, 20, 20);
            //sph.setRotationXYZ(Math.random() * 300.0, Math.random() * 300.0, Math.random() * 300.0);
            sph.setScaleXYZ(scale, scale, scale);
            posList[i].y += (this.m_reflectPlaneY + 10) + pr + 5;
            sph.setPosition(posList[i]);
            this.m_rscene.addEntity(sph);
        }
    }
    private m_runFlag: boolean = true;
    private mouseDown(evt: any): void {
        this.m_runFlag = true;
        DebugFlag.Flag_0 = 1;
    }
    private mouseUp(evt: any): void {
    }
    private update(): void {

        this.m_statusDisp.update(true);
    }
    private m_lookV: Vector3D = new Vector3D(0.0, 300.0, 0.0);
    run(): void {
        /*
        if(this.m_runFlag) {
            this.m_runFlag = false;
        }
        else {
            return;
        }
        //*/
        if(this.m_target != null) {
            this.m_target.setRotation3( this.m_rotV );
            this.m_target.update();
            // this.m_rotV.x += 0.2;
            // this.m_rotV.z += 0.3;
            this.m_rotV.y += 0.2;
        }
        ThreadSystem.Run();
        this.update();

        this.m_stageDragSwinger.runWithYAxis();
        //this.m_cameraZoomController.run(this.m_lookV, 30.0);
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_rscene.run(true);

        DebugFlag.Flag_0 = 0;
    }
    
    makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {

        let material: PBRMaterial = this.m_materialCtx.createPBRLightMaterial(true, true, true);
        let decorator: PBRShaderDecorator = material.decorator;
        decorator.scatterEnabled = false;
        decorator.woolEnabled = true;
        decorator.toneMappingEnabled = true;
        decorator.specularEnvMapEnabled = true;
        decorator.specularBleedEnabled = true;
        decorator.metallicCorrection = true;
        decorator.absorbEnabled = false;
        decorator.normalNoiseEnabled = false;
        decorator.pixelNormalNoiseEnabled = true;
        decorator.hdrBrnEnabled = this.hdrBrnEnabled;
        decorator.vtxFlatNormal = this.vtxFlatNormal;


        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);

        return material;
    }
    createMaterial(): PBRMaterial {

        let material: PBRMaterial;
        material = this.makePBRMaterial(0.9, 0.0, 1.0);
        
        let decorator: PBRShaderDecorator = material.decorator;
        decorator.shadowReceiveEnabled = false;
        decorator.fogEnabled = this.fogEnabled;
        decorator.indirectEnvMapEnabled = false;
        decorator.specularEnvMapEnabled = true;
        decorator.diffuseMapEnabled = true;
        decorator.normalMapEnabled = true;
        //material.setTextureList(ptexList);
        return material;
    }
}

export class ViewerDracoModule extends DracoWholeModuleLoader {

    texLoader: ImageTextureLoader = null;
    reflectPlaneY: number = -220.0;
    aoMapEnabled: boolean = false;
    specularEnvMap: IRenderTexture;
    viewer: DemoPBRViewer;
    materialCtx: CommonMaterialContext;
    constructor() {
        super();
    }

    dracoParse(pmodule: any, index: number, total: number): void {
        console.log("ViewerDracoModule dracoParse, total: ", total);
    }
    dracoParseFinish(modules: any[], total: number): void {

        console.log("ViewerDracoModule dracoParseFinish, modules: ", modules, this.m_pos);

        let uvscale: number = 0.01;//Math.random() * 7.0 + 0.6;
        let material: PBRMaterial = this.viewer.createMaterial();

        material.decorator.specularEnvMap = this.specularEnvMap;
        material.decorator.diffuseMap = this.materialCtx.getTextureByUrl("static/assets/modules/skirt/baseColor.jpg");
        material.decorator.normalMap = this.materialCtx.getTextureByUrl("static/assets/modules/skirt/normal.jpg");
        material.decorator.diffuseMap = this.materialCtx.getTextureByUrl("static/assets/modules/skirt/ao.jpg");

        material.decorator.diffuseMapEnabled = true;
        material.decorator.normalMapEnabled = true;
        material.decorator.vtxFlatNormal = false;
        material.decorator.aoMapEnabled = this.aoMapEnabled;
        material.initializeByCodeBuf(true);
        material.setAlbedoColor(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        let scale: number = 3.0;
        let entity: DisplayEntity = new DisplayEntity();

        let mesh: DracoMesh = new DracoMesh();
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(modules);
        entity.setMaterial(material);
        entity.setMesh(mesh);
        entity.setScaleXYZ(scale, scale, scale);
        entity.setRotationXYZ(-90, 0, 0);
        //entity.setRotationXYZ(0, Math.random() * 300, 0);
        //entity.setPosition( this.m_pos );
        this.m_rscene.addEntity(entity);

        this.loadNext();
    }
}
export default DemoPBRViewer;