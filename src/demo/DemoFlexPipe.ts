
import Vector3D from "../vox/math/Vector3D";
import Matrix4 from "../vox/math/Matrix4";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";

import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import PBRMaterial from "../pbr/material/PBRMaterial";
import PBRShaderDecorator from "../pbr/material/PBRShaderDecorator";

import {MorphPipeObject} from "./morph/MorphPipeObject";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import { IShaderLibListener, DebugMaterialContext, MaterialContextParam } from "../materialLab/base/DebugMaterialContext";
import { SpecularTextureLoader } from "../pbr/mana/TextureLoader";
import { PointLight } from "../light/base/PointLight";
import { SpotLight } from "../light/base/SpotLight";
import { DirectionLight } from "../light/base/DirectionLight";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import { MaterialPipeType } from "../vox/material/pipeline/MaterialPipeType";
import { Bezier2Curve } from "../vox/geom/curve/BezierCurve";

export class DemoFlexPipe implements IShaderLibListener {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    // private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();
    private m_specularEnvMap: TextureProxy;
    fogEnabled: boolean = false;
    hdrBrnEnabled: boolean = true;
    vtxFlatNormal: boolean = false;
    aoMapEnabled: boolean = false;

    private m_morphPipes: MorphPipeObject[] = [];

    initialize(): void {
        console.log("DemoFlexPipe::initialize()......");
        if (this.m_rscene == null) {
            
            // let bez2 = new Bezier2Curve();
            // let bez2VS: number[] = new Array(11);
            // bez2.calcCurveChangeYData(bez2VS.length - 1,1.0,0.02,0.5,1.0, bez2VS);
            // console.log("### bez2VS: ",bez2VS);

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.SetWebBodyColor();
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias( true );
            rparam.setCamProject(50,10,9000);
            rparam.setCamPosition(1300.0, 1300.0, 1300.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            // this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_stageDragSwinger.setAutoRotationEnabled( true );

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.getRenderProxy().setVtxUpdateTimesTotal(32);

            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(300.0);
            // this.m_rscene.addEntity(axis);
            
            //  this.initScene();
            this.initMaterialCtx();
        }
    }
    
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ",loadingTotal, loadedTotal);
        this.initScene();
    }
    private initMaterialCtx(): void {

        let envMapUrl: string = "static/bytes/spe.mdf";
        if (this.hdrBrnEnabled) {
            envMapUrl = "static/bytes/spe.hdrBrn";
        }
        
        let loader: SpecularTextureLoader = new SpecularTextureLoader();
        loader.hdrBrnEnabled = this.hdrBrnEnabled;
        loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
        this.m_specularEnvMap = loader.texture;
        /*
        let libConfig: IShaderLibConfigure = {shaderCodeConfigures:[]};
        let configure = new ShaderCodeConfigure();
        configure.uuid = ShaderCodeUUID.PBR;
        configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
        configure.urls = [
            "static/shader/glsl/pbr/glsl01.bin",
            "static/shader/glsl/pbr/glsl02.bin",
            "static/shader/glsl/pbr/glsl03.bin",
            "static/shader/glsl/pbr/glsl04.bin"
        ]
        configure.binary = true;
        libConfig.shaderCodeConfigures.push( configure );
        //*/

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 1;
        mcParam.directionLightsTotal = 2;
        mcParam.spotLightsTotal = 0;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        this.m_materialCtx.addShaderLibListener( this );
        this.m_materialCtx.initialize(this.m_rscene, mcParam);
        this.m_materialCtx.envData.setFogDensity(0.0002);

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
    private useMaps(material: PBRMaterial, ns: string = "lava_03"): void {
        
        let diffuseMap: TextureProxy = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_COLOR.png");
        let normalMap: TextureProxy = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_NRM.png");
        let aoMap: TextureProxy = null;
        if (this.aoMapEnabled) {
            aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_OCC.png");
        }
        let displacementMap: TextureProxy = null;
        //displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");
        //displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/circleWave_disp.png");
        let parallaxMap: TextureProxy = null;
        parallaxMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/"+ns+"_DISP.png");

        material.decorator.specularEnvMap = this.m_specularEnvMap;
        material.decorator.diffuseMap = diffuseMap;
        material.decorator.normalMap = normalMap;
        material.decorator.aoMap = aoMap;
        material.decorator.parallaxMap = parallaxMap;
    }
    makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {

        let material: PBRMaterial = this.m_materialCtx.createPBRLightMaterial(true, true);
        
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

        return material;
    }
    private createPipeMaterial(scaleU: number, scaleV: number, mapNS: string = "lava_03"): PBRMaterial {
        
        let material: PBRMaterial;
        ///*
        material = this.createMaterial();
        //material.decorator.normalMapEnabled = false;
        material.decorator.aoMapEnabled = this.aoMapEnabled;
        //material.decorator.aoMapEnabled = false;
        material.decorator.scatterEnabled = false;

        this.useMaps( material, mapNS );

        material.vertUniform.uvTransformEnabled = true;
        material.initializeLocalData();
        material.setAlbedoColor(1.0,1.0,1.0);
        material.setRoughness(0.3);
        material.setScatterIntensity(64.0);
        material.vertUniform.setUVScale(scaleU, scaleV);
        //material.vertUniform.setDisplacementParams(50,0);
        material.setParallaxParams(1, 10, 5.0, 0.02);
        material.initializeByCodeBuf(true);
        material.setSideIntensity(8);
        material.setMetallic(0.1);
        return material;
    }
    private initScene(): void {

        this.fogEnabled = true;
        this.aoMapEnabled = true;
        let material: PBRMaterial;
        
        material = this.createPipeMaterial(1, 1, "metal_01");
        ///*
        // let srcSph = new Sphere3DEntity();
        // srcSph.setMaterial(material);
        // srcSph.initialize(100.0, 150, 150);
        // //srcSph.setRotation3(this.m_rotV);
        // this.m_rscene.addEntity(srcSph);

        // let pipe: Pipe3DEntity = new Pipe3DEntity();
        // pipe.setMaterial(material);
        // pipe.initialize(100,200,10,20);
        // this.m_rscene.addEntity(pipe);
        let useTeam: boolean = true;

        let rn: number = 5;
        let cn: number = 5;
        let pos: Vector3D = new Vector3D();
        let disV: Vector3D = new Vector3D(150, 0.0, 150.0);
        let beginV: Vector3D = new Vector3D(disV.x * (cn - 1) * -0.5, 0.0, disV.z * (rn - 1) * -0.5);
        let morphPipe: MorphPipeObject;
        let scale: number = 0.5;
        let scaleXZ: number = 0.5;
        let height: number;
        let latitudeNum: number;
        for(let i: number = 0; i < rn; ++i) {
            for(let j: number = 0; j < cn; ++j) {
                height = 300.0 + 300 * Math.random();
                latitudeNum = Math.round(height/30.0);
                morphPipe = new MorphPipeObject( 170.0, height, 7, latitudeNum, null, material );
                let entity = morphPipe.getEntity();
                pos.x = beginV.x + j * disV.x;
                pos.z = beginV.z + i * disV.z;
                entity.setPosition( pos );
                scale = 0.3 + Math.random() * 0.2;
                scaleXZ = scale - Math.random() * 0.2;
                entity.setScaleXYZ(scaleXZ, scale, scaleXZ);
                morphPipe.disRotV.setXYZ(0.0, Math.random() * 6.28, 0.20 * Math.random() - 0.10);
                morphPipe.disScale = -0.98/latitudeNum;
                morphPipe.morphTime = Math.random() * 10.0;
                this.m_morphPipes.push( morphPipe );
                this.m_rscene.addEntity(morphPipe.getEntity());
                entity.setVisible(!useTeam);
            }
        }
        if(useTeam) {
            rn = 40;
            cn = 40;
            disV.setXYZ(100, 0.0, 100.0);
        }
        let planeSize: number = cn * disV.x;
        if(useTeam) {
            material = this.createPipeMaterial(8, 8, "lava_03");
        }
        else {
            material = this.createPipeMaterial(2, 2, "lava_03");
        }
        let plane: Plane3DEntity = new Plane3DEntity();
        plane.setMaterial(material);
        plane.initializeXOZ(-0.5 * planeSize, -0.5 * planeSize, planeSize, planeSize);
        plane.setXYZ(0.0, 0.5, 0.0);
        this.m_rscene.addEntity(plane, 1);

        if(useTeam) {
            this.createSquareTeam(rn, cn, disV, 1.0);
        }
        //*/
        this.initEnvBox();
        this.update();
    }
    
    private initEnvBox(): void {
        
        let envBox: Box3DEntity = new Box3DEntity();
        envBox.pipeTypes = [MaterialPipeType.FOG_EXP2];
        envBox.setMaterialPipeline( this.m_materialCtx.pipeline );
        envBox.showFrontFace();
        envBox.initializeCube(5000.0, [this.m_materialCtx.getTextureByUrl("static/assets/displacement_01.jpg")]);
        (envBox.getMaterial() as any).setRGB3f(0.1,0.1,0.1);
        this.m_rscene.addEntity(envBox, 2);
    }
    private createSquareTeam(rn: number, cn: number, disV: Vector3D, scaleFactor: number): void {
        
        let material0: PBRMaterial = this.createPipeMaterial(1, 1, "metal_01");
        let material1: PBRMaterial = this.createPipeMaterial(1, 1, "lava_03");
        // let rn: number = 40;
        // let cn: number = 40;
        let pos: Vector3D = new Vector3D();
        //let disV: Vector3D = new Vector3D(100, 0.0, 100.0);
        let beginV: Vector3D = new Vector3D(disV.x * (cn - 1) * -0.5, 0.0, disV.z * (rn - 1) * -0.5);
        let morphPipe: MorphPipeObject;
        let srcEntity: DisplayEntity;
        let entity: DisplayEntity;

        let scale: number = 0.5;
        let scaleXZ: number = 0.5;
        for(let i: number = 0; i < rn; ++i) {
            for(let j: number = 0; j < cn; ++j) {
                morphPipe = this.m_morphPipes[Math.round(Math.random() * 10000)%this.m_morphPipes.length];
                srcEntity = morphPipe.getEntity();
                entity = new DisplayEntity();
                entity.copyMeshFrom(srcEntity);
                entity.setMaterial(Math.random() > 0.5 ? material0 : material1);
                pos.x = beginV.x + j * disV.x;
                pos.z = beginV.z + i * disV.z;
                entity.setPosition( pos );
                scale = 0.25 + Math.random() * 0.2;
                scaleXZ = (scale - Math.random() * 0.2);
                entity.setScaleXYZ(scaleXZ * scaleFactor, scale * scaleFactor, scaleXZ * scaleFactor);
                entity.setRotationXYZ(0.0, Math.random() * 360.0,0.0);
                this.m_rscene.addEntity(entity);
            }
        }
    }
    private m_testFlag: boolean = true;
    private m_pos0: Vector3D = new Vector3D();

    private m_rotV: Vector3D = new Vector3D();
    private m_scaleV: Vector3D = new Vector3D(1.0, 1.0, 1.0);    
    private m_mat4: Matrix4 = new Matrix4();

    private transformPipe(i: number): void {
        this.m_pos0.x += 13.0;
        let mat4: Matrix4 = new Matrix4();
        mat4.identity();
        mat4.setTranslation(this.m_pos0);
        mat4.setRotationEulerAngle(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
        //this.m_pipeEntity.transformCircleAt(i, mat4);
    }
    private mouseDown(evt: any): void {
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 30);// 20 fps
        let pcontext: RendererInstanceContext = this.m_rcontext;
        this.m_statusDisp.statusInfo = "/" + pcontext.getTextureResTotal() + "/" + pcontext.getTextureAttachTotal();

        this.m_statusDisp.render();
        this.morphGeometryAnimate();

    }
    
    morphGeometryAnimate(): void {

        let list = this.m_morphPipes;
        for(let i: number = 0; i < list.length; ++i) {
            list[i].morph();
        }
    }
    run(): void {

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_statusDisp.update(false);
        this.m_rscene.run();
        //this.m_profileInstance.run();
    }
}
export default DemoFlexPipe;