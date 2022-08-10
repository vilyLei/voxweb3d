
import Vector3D from "../../vox/math/Vector3D";
import MouseEvent from "../../vox/event/MouseEvent";
import RendererDevice from "../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import CameraTrack from "../../vox/view/CameraTrack";

import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import DebugFlag from "../../vox/debug/DebugFlag";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { SpecularTextureLoader } from "../../pbr/mana/TextureLoader";

import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRShaderDecorator from "../../pbr//material/PBRShaderDecorator";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";

import DisplayEntity from "../../vox/entity/DisplayEntity";

import { PointLight } from "../../light/base/PointLight";
import { DirectionLight } from "../../light/base/DirectionLight";
import { SpotLight } from "../../light/base/SpotLight";
import { DebugMaterialContext, MaterialContextParam } from "../../materialLab/base/DebugMaterialContext";
import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";
import { CTMStringStream, CTMStream, CTMFileBody, CTMFile } from "../modules/ctm/CTMFile";

import ILoaderListerner from "../../vox/assets/ILoaderListerner";
import BinaryLoader from "../../vox/assets/BinaryLoader";
import DataMesh from "../../vox/mesh/DataMesh";
import DivLog from "../../vox/utils/DivLog";

export class DemoCTMLoad implements ILoaderListerner {

    constructor() { }
    private m_rscene: RendererScene = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_reflectPlaneY: number = -220;
    private m_envMap: IRenderTexture = null;

    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();

    fogEnabled: boolean = false;
    hdrBrnEnabled: boolean = true;
    vtxFlatNormal: boolean = false;
    aoMapEnabled: boolean = false;
    private m_time: number = 0;
    initialize(): void {
		let k = 1;
		k >>>= 11;

        console.log("A >>> k: ", k);

		k = 1;
		k >>= 11;
        console.log("B >>> k: ", k);

        console.log("DemoCTMLoad::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            DivLog.SetDebugEnabled(true);
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 50.0, 10000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(2000.0, 2000.0, 2000.0);
            rparam.setCamLookAtPos(this.m_lookV.x, this.m_lookV.y, this.m_lookV.z);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
            this.m_rscene.updateCamera();

            let rscene = this.m_rscene;
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            rscene.materialBlock = materialBlock;
            // let entityBlock = new RenderableEntityBlock();
            // entityBlock.initialize();
            // rscene.entityBlock = entityBlock;

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

            this.m_rscene.setClearRGBColor3f(0.5, 0.5, 0.5);

            DivLog.ShowLog("renderer inited.");
            DivLog.ShowLog(RendererDevice.GPU_RENDERER);
            // let k = this.calcTotal(9);
            // console.log("k: ",k);
            // k = this.calcTotal2(55);
            // console.log("k2: ",k);
            // return;

            let mcParam: MaterialContextParam = new MaterialContextParam();
            mcParam.pointLightsTotal = 0;
            mcParam.directionLightsTotal = 0;
            mcParam.spotLightsTotal = 1;
            mcParam.vsmEnabled = false;

            this.m_materialCtx.initialize(this.m_rscene, mcParam);
            let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
            if (pointLight != null) {
                // pointLight.position.setXYZ(200.0, 180.0, 200.0);
                pointLight.position.setXYZ(0.0, 130.0, 0.0);
                pointLight.color.setRGB3f(0.0, 2.2, 0.0);
                pointLight.attenuationFactor1 = 0.0001;
                pointLight.attenuationFactor2 = 0.0005;
            }
            let spotLight: SpotLight = this.m_materialCtx.lightModule.getSpotLightAt(0);
            if (spotLight != null) {
                spotLight.position.setXYZ(0.0, 130.0, 0.0);
                spotLight.direction.setXYZ(0.0, -1.0, 0.0);
                spotLight.color.setRGB3f(0.0, 40.2, 0.0);
                spotLight.attenuationFactor1 = 0.000001;
                spotLight.attenuationFactor2 = 0.000001;
                spotLight.angleDegree = 30.0;
            }
            let directLight: DirectionLight = this.m_materialCtx.lightModule.getDirectionLightAt(0);
            if (directLight != null) {
                directLight.color.setRGB3f(2.0, 0.0, 0.0);
            }
            this.m_materialCtx.lightModule.update();
            this.m_materialCtx.lightModule.showInfo();

            let envMapUrl: string = "static/bytes/spe.mdf";
            if (this.hdrBrnEnabled) {
                envMapUrl = "static/bytes/spe.hdrBrn";
            }
            let loader: SpecularTextureLoader = new SpecularTextureLoader();
            loader.hdrBrnEnabled = this.hdrBrnEnabled;
            loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
            this.m_envMap = loader.texture;

            // this.createEntity();

            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(300);
            // this.m_rscene.addEntity( axis );


            let ctmUrl: string = "static/assets/ctm/hand.ctm";
            ctmUrl = "static/assets/ctm/WaltHead.ctm";

            this.m_time = Date.now();
            // this.initCTMFromStr( ctmUrl );
            this.initCTMFromBin( ctmUrl );
        }
    }

    loaded(buffer: ArrayBuffer, uuid: string): void {

        console.log("bin ctm loaded.");
        DivLog.ShowLog("二进制流 ctm 加载耗时: "+(Date.now() - this.m_time) + "ms");
        DivLog.ShowLog("二进制流 ctm loaded.");

        let t = Date.now();
        var stream = new CTMStream(new Uint8Array(buffer));
        // var stream = new CTMStream( dataStr );
        stream.offset = 0;//offsets[ i ];

        var ctmFile = new CTMFile(stream);
        t = Date.now() - t;

        DivLog.ShowLog("二进制流 ctm 解析耗时: " + t + "ms");
        // let ctmFile = new CTMFile(dataStr);
        console.log("ctmFile: ", ctmFile);
        if (ctmFile != null) {
            let ctmbody: CTMFileBody = ctmFile.body;
            console.log("ctmbody: ", ctmbody);
            this.initCTMEntity(ctmbody);
        }
    }
    loadError(status: number, uuid: string): void {

    }
    private initCTMFromBin(ctmUrl: string): void {

        let ctmLoader: BinaryLoader = new BinaryLoader();
        ctmLoader.load(ctmUrl, this);
    }
    private initCTMFromStr(ctmUrl: string): void {

        // let ctmLoader: BinaryLoader = new BinaryLoader();
        // ctmLoader.load(ctmUrl, this);
        let request: XMLHttpRequest = new XMLHttpRequest();
        // request.open('GET', ctmUrl, true);

        request.onload = () => {
            if (request.status <= 206) {
                console.log("strine ctm loaded.");
                DivLog.ShowLog("字符串 ctm 加载耗时: "+(Date.now() - this.m_time) + "ms");
                DivLog.ShowLog("字符串 ctm 加载完毕.");
                let dataStr: string = request.responseText;
                console.log("loaded ctm string data !", dataStr.length);

                let t = Date.now();
                //this.initialize(request.responseText, texList);
                var stream = new CTMStringStream(dataStr);
                // var stream = new CTMStream( dataStr );
                stream.offset = 0;//offsets[ i ];

                var ctmFile = new CTMFile(stream);
                t = Date.now() - t;

                DivLog.ShowLog("字符串 ctm 解析耗时: " + t + "ms");
                // let ctmFile = new CTMFile(dataStr);
                console.log("ctmFile: ", ctmFile);
                if (ctmFile != null) {
                    let ctmbody: CTMFileBody = ctmFile.body;
                    console.log("ctmbody: ", ctmbody);
                    this.initCTMEntity(ctmbody);
                }
            }
            else {
                console.error("load ctm format module url error: ", ctmUrl);
            }
        };
        request.onerror = e => {
            console.error("load obj ctm module url error: ", ctmUrl);
        };
        request.overrideMimeType("text/plain; charset=x-user-defined");
        request.open("GET", ctmUrl, true);
        request.send(null);
    }
    private initCTMEntity(ctmbody: CTMFileBody): void {

        // let material: Default3DMaterial = new Default3DMaterial();
        // material.normalEnabled = true;
        // material.setTextureList([this.m_materialCtx.getTextureByUrl("static/assets/color_01.jpg")]);
        // material.initializeByCodeBuf( true );

        let material: PBRMaterial;
        material = this.createMaterial();
        material.decorator.aoMapEnabled = this.aoMapEnabled;
        //material.setTextureList(texList);
        this.useMaterialTex(material);
        material.initializeByCodeBuf(true);

        let dataMesh: DataMesh = new DataMesh();
        dataMesh.setVS(ctmbody.vertices);
        dataMesh.setUVS(ctmbody.getUVSAt(0));
        dataMesh.setNVS(ctmbody.normals);
        dataMesh.setIVS(ctmbody.indices);
        dataMesh.setVtxBufRenderData(material);
        dataMesh.initialize();
        console.log("ctm dataMesh: ", dataMesh);

        DivLog.ShowLog("三角面数量: " + dataMesh.trisNumber + "个");

        let scale: number = 20.0;
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMesh(dataMesh);
        entity.setMaterial(material);
        entity.setScaleXYZ(scale, scale, scale);
        this.m_rscene.addEntity(entity);


        console.log("ctm entity: ", entity);
    }
    // loaded(buffer: ArrayBuffer, uuid: string): void {
    //     console.log("loaded ctm data !",buffer);
    //     // let ctmFile = new CTMFile(null);
    // }
    // loadError(status: number, uuid: string): void {

    // }

    makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {

        let material: PBRMaterial = new PBRMaterial();
        //material.setMaterialPipeline(this.m_pipeline);
        material.setMaterialPipeline(this.m_materialCtx.pipeline);
        material.decorator = new PBRShaderDecorator();

        let decorator: PBRShaderDecorator = material.decorator;

        decorator.woolEnabled = true;
        decorator.toneMappingEnabled = true;
        decorator.specularEnvMapEnabled = true;
        decorator.specularBleedEnabled = true;
        decorator.metallicCorrection = true;
        decorator.absorbEnabled = false;
        decorator.normalNoiseEnabled = false;
        decorator.pixelNormalNoiseEnabled = false;
        decorator.hdrBrnEnabled = this.hdrBrnEnabled;
        decorator.vtxFlatNormal = this.vtxFlatNormal;

        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);

        return material;
    }
    createMaterial(): PBRMaterial {

        let material: PBRMaterial;
        material = this.makePBRMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);

        let decorator: PBRShaderDecorator = material.decorator;
        decorator.shadowReceiveEnabled = false;
        decorator.fogEnabled = this.fogEnabled;
        decorator.indirectEnvMapEnabled = false;
        decorator.specularEnvMapEnabled = true;
        decorator.diffuseMapEnabled = true;
        decorator.normalMapEnabled = true;
        return material;
    }
    createTexListForMaterial(material: PBRMaterial, env: IRenderTexture, diffuse: IRenderTexture = null, normal: IRenderTexture = null, ao: IRenderTexture = null): IRenderTexture[] {
        let texList: IRenderTexture[] = [env];
        if (diffuse != null) {
            texList.push(diffuse)
        }
        if (normal != null) {
            texList.push(normal)
        }
        if (ao != null) {
            texList.push(ao)
        }
        let decorator: PBRShaderDecorator = material.decorator;
        decorator.indirectEnvMapEnabled = false;
        decorator.shadowReceiveEnabled = false;

        return texList;
    }
    private useMaterialTex(material: PBRMaterial): void {
        let decorator = material.decorator;
        decorator.specularEnvMap = this.m_envMap;
        decorator.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/color_01.jpg");
        decorator.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/rock_a_n.jpg");
        if (this.aoMapEnabled) {
            decorator.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/rock_a.jpg");
        }
    }
    private createEntity(): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);


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
        material = this.createMaterial();
        material.decorator.aoMapEnabled = this.aoMapEnabled;
        //material.setTextureList(texList);
        this.useMaterialTex(material);
        let srcSph = new Sphere3DEntity();
        srcSph.setMaterial(material);
        srcSph.initialize(100.0, 20, 20);
        //this.m_rscene.addEntity(srcSph);
        let scale: number = 1.0;
        let uvscale: number;
        let total: number = posList.length;
        total = 2;
        console.log("total: ", total);
        let rad: number;
        for (let i: number = 0; i < total; ++i) {

            rad = Math.random() * 100.0;
            uvscale = Math.random() * 7.0 + 0.6;

            material = this.createMaterial();
            material.decorator.aoMapEnabled = this.aoMapEnabled;
            this.useMaterialTex(material);
            material.initializeLocalData();
            //material.setTextureList(texList);
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

        this.update();

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(this.m_lookV, 30.0);

        this.m_rscene.run(true);

        DebugFlag.Flag_0 = 0;
    }
}

export default DemoCTMLoad;
