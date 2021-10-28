
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
import TextureProxy from "../vox/texture/TextureProxy";
import { SpecularTextureLoader } from "./mana/TextureLoader";
import GlobalLightData from "../light/base/GlobalLightData";
import EnvLightData from "../light/base/EnvLightData";
import PBRMaterial from "./material/PBRMaterial";
import PBRShaderDecorator from "./material/PBRShaderDecorator";
import { TextureConst } from "../vox/texture/TextureConst";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";

import DracoMeshRawBuilder from "../voxmesh/draco/DracoMeshRawBuilder";
import DracoMesh from "../voxmesh/draco/DracoMesh";
import {DracoWholeModuleLoader} from "../voxmesh/draco/DracoRawModuleLoader";
import DisplayEntity from "../vox/entity/DisplayEntity";
import ThreadSystem from "../thread/ThreadSystem";

import { PBRShaderCode } from "../pbr/material/glsl/PBRShaderCode";
import { MaterialPipeline } from "../vox/material/pipeline/MaterialPipeline";

export class ViewerDracoModule extends DracoWholeModuleLoader
{
    
    texLoader: ImageTextureLoader = null;
    reflectPlaneY: number = -220.0;
    aoMapEnabled: boolean = false;
    envMap: TextureProxy;
    viewer: DemoRawDracoViewer;
    
    constructor() {
        super();
    }
    
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    dracoParse(pmodule: any, index: number, total: number): void {
        console.log("ViewerDracoModule dracoParse, total: ", total);
    }
    dracoParseFinish(modules: any[], total: number): void {

        console.log("ViewerDracoModule dracoParseFinish, modules: ", modules,this.m_pos);

        let texList: TextureProxy[] = [];
        
        texList.push(this.envMap);
        //texList.push( this.getImageTexByUrl("static/assets/noise.jpg"));
        // base color map
        texList.push( this.getImageTexByUrl("static/assets/disp/normal_4_256_COLOR.png"));
        // normal map
        texList.push( this.getImageTexByUrl("static/assets/disp/normal_4_256_NRM.png"));
        if(this.aoMapEnabled) {
            // ao map
            texList.push( this.getImageTexByUrl("static/assets/disp/normal_4_256_OCC.png"));
        }


        let uvscale: number = 0.01;//Math.random() * 7.0 + 0.6;        
        let material: PBRMaterial = this.viewer.createMaterial(uvscale,uvscale);
        
        texList[1] = this.getImageTexByUrl("static/assets/modules/skirt/baseColor.jpg");
        texList[2] = this.getImageTexByUrl("static/assets/modules/skirt/normal.jpg");
        texList[3] = this.getImageTexByUrl("static/assets/modules/skirt/ao.jpg");
        material.setTextureList(texList);
        material.decorator.diffuseMapEnabled = true;
        material.decorator.normalMapEnabled = true;
        material.decorator.vtxFlatNormal = false;
        material.decorator.aoMapEnabled = this.aoMapEnabled;
        material.setAlbedoColor(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        material.initializeByCodeBuf(true);
        let scale: number = 3.0;
        let entity: DisplayEntity = new DisplayEntity();
        
        let mesh: DracoMesh = new DracoMesh();
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(modules);
        entity.setMaterial( material );
        entity.setMesh( mesh );
        entity.setScaleXYZ(scale, scale, scale);
        entity.setRotationXYZ(-90,0,0);
        //entity.setRotationXYZ(0, Math.random() * 300, 0);
        //entity.setPosition( this.m_pos );
        this.m_rscene.addEntity(entity);

        this.loadNext();
    }
}

export class DemoRawDracoViewer {

    constructor() { }
    private m_rscene: RendererScene = null;
    private m_ruisc: RendererSubScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_lightData: GlobalLightData = new GlobalLightData();
    private m_dracoMeshLoader: DracoMeshRawBuilder = new DracoMeshRawBuilder();
    private m_dracoModule: ViewerDracoModule = null;
    private m_reflectPlaneY: number = -220;
    private m_envData: EnvLightData = null;
    private m_envMap: TextureProxy = null;
    
    fogEnabled: boolean = true;
    hdrBrnEnabled: boolean = true;
    vtxFlatNormal: boolean = false;
    aoMapEnabled: boolean = false;

    private m_pipeline: MaterialPipeline = new MaterialPipeline();

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoRawDracoViewer::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45,50.0,10000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(2000.0, 2000.0, 2000.0);
            rparam.setCamLookAtPos( this.m_lookV.x, this.m_lookV.y, this.m_lookV.z );
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

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            this.m_rscene.setClearRGBColor3f(0.2, 0.2, 0.2);

            // let k = this.calcTotal(9);
            // console.log("k: ",k);
            // k = this.calcTotal2(55);
            // console.log("k2: ",k);
            // return;
            /*
            this.m_uiModule.initialize(this.m_rscene, this.m_texLoader, true);
            this.m_ruisc = this.m_uiModule.ruisc;
            this.m_uiModule.close();

            this.m_pbrScene = new PBRScene();
            this.m_pbrScene.initialize(this.m_rscene, this.m_texLoader, this.m_uiModule);
            //*/

            
            let envMapUrl: string = "static/bytes/spe.mdf";
            if(this.hdrBrnEnabled) {
                envMapUrl = "static/bytes/spe.hdrBrn";
            }
            let loader: SpecularTextureLoader = new SpecularTextureLoader();
            loader.hdrBrnEnabled = this.hdrBrnEnabled;
            loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
            this.m_envMap = loader.texture;

            this.m_lightData.initialize(4, 2);
            this.m_lightData.buildData();

            
            this.m_envData = new EnvLightData();
            this.m_envData.initialize();
            this.m_envData.setFogNear(800.0);
            this.m_envData.setFogFar(4000.0);
            this.m_envData.setFogDensity(0.0001);
            this.m_envData.setFogColorRGB3f(0.0,0.8,0.1);

            this.m_pipeline.addShaderCode( PBRShaderCode );
            this.m_pipeline.addPipe( this.m_lightData );
            this.m_pipeline.addPipe( this.m_envData );

            this.createEntity();

            
            this.m_dracoMeshLoader.initialize(2);
            this.m_dracoModule = new ViewerDracoModule();
            this.m_dracoModule.texLoader = this.m_texLoader;
            this.m_dracoModule.viewer = this;
            this.m_dracoModule.envMap = this.m_envMap;
            this.m_dracoModule.aoMapEnabled = this.aoMapEnabled;
            this.m_dracoModule.initialize(this.m_rscene, this.m_dracoMeshLoader);
            this.m_dracoModule.loadNext();
        }
    }
    private calcTotal(n: number): number {
        let index: number = (n%2) == 0 ? ((n>>1) - 1) : ((n - 1)>>1);
        n = index;
        return n;
    }
    private calcTotal2(n: number): number {
        

        let base: number = 10;

        base = 10;
        for(let i: number = 1; i < 19; ++i) {

        }
        return n;
    }
    
    makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {

        let material: PBRMaterial = new PBRMaterial();
        material.setMaterialPipeline( this.m_pipeline );
        material.decorator = new PBRShaderDecorator();

        let decorator: PBRShaderDecorator = material.decorator;

        decorator.woolEnabled = true;
        decorator.toneMappingEnabled = true;
        decorator.envMapEnabled = true;
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
    createMaterial(uscale: number, vscale: number, ptexList: TextureProxy[] = null): PBRMaterial {

        let material: PBRMaterial;
        material = this.makePBRMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);

        let decorator: PBRShaderDecorator = material.decorator;
        decorator.shadowReceiveEnabled = false;
        decorator.fogEnabled = this.fogEnabled;
        decorator.indirectEnvMapEnabled = false;
        decorator.envMapEnabled = true;
        decorator.diffuseMapEnabled = true;
        decorator.normalMapEnabled = true;

        material.setUVScale(uscale, vscale);

        material.setTextureList(ptexList);
        return material;
    }
    createTexListForMaterial(material: PBRMaterial, env: TextureProxy, diffuse: TextureProxy = null, normal: TextureProxy = null, ao: TextureProxy = null): TextureProxy[] {
        let texList: TextureProxy[] = [env];
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
    private createEntity(): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        
        let texList: TextureProxy[] = [];
        
        texList.push(this.m_envMap);
        //texList.push( this.getImageTexByUrl("static/assets/noise.jpg"));
        // base color map
        texList.push( this.getImageTexByUrl("static/assets/disp/normal_4_256_COLOR.png"));
        // normal map
        texList.push( this.getImageTexByUrl("static/assets/disp/normal_4_256_NRM.png"));
        if(this.aoMapEnabled) {
            // ao map
            texList.push( this.getImageTexByUrl("static/assets/disp/normal_4_256_OCC.png"));
        }
        let disSize: number = 700.0;
        let dis: number = 500.0;
        let posList: Vector3D[] = [];
        let beginV:Vector3D = new Vector3D(-disSize, 0.0, -disSize);
        
        let rn: number = 4;
        let cn: number = 4;
        for(let i: number = 0; i < rn; ++i) {
            for(let j: number = 0; j < cn; ++j) {
                if((i < 1 || i > (rn - 2)) || (j < 1 || j > (cn - 2))) {
                    let pos: Vector3D = new Vector3D(beginV.x + dis * j, beginV.y, beginV.z + dis * i);
                    posList.push(pos);
                }
            }
        }
        let material: PBRMaterial;
        let sph: Sphere3DEntity;
        material = this.createMaterial(1,1);
        material.decorator.aoMapEnabled = this.aoMapEnabled;
        material.setTextureList(texList);
        let srcSph = new Sphere3DEntity();
        srcSph.setMaterial( material );
        srcSph.initialize(100.0, 20, 20);
        //this.m_rscene.addEntity(srcSph);
        let scale: number = 1.0;
        let uvscale: number;
        let total: number = posList.length;
        total = 2;
        console.log("total: ",total);
        let rad: number;
        for(let i: number = 0; i < total; ++i) {

            rad = Math.random() * 100.0;
            uvscale = Math.random() * 7.0 + 0.6;

            material = this.createMaterial(uvscale,uvscale);
            material.decorator.aoMapEnabled = this.aoMapEnabled;
            material.setTextureList(texList);
            material.setAlbedoColor(Math.random() * 3, Math.random() * 3, Math.random() * 3);
            
            scale = 0.8 + Math.random();
            let pr: number = scale * 100.0;
            sph = new Sphere3DEntity();
            sph.setMaterial( material );
            if(srcSph != null)sph.copyMeshFrom( srcSph );
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
    private m_lookV: Vector3D = new Vector3D(0.0,300.0,0.0);
    run(): void {
        /*
        if(this.m_runFlag) {
            this.m_runFlag = false;
        }
        else {
            return;
        }
        //*/
        ThreadSystem.Run();
        this.update();
        
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(this.m_lookV, 30.0);

        this.m_rscene.run( true );

        DebugFlag.Flag_0 = 0;
    }
}
export default DemoRawDracoViewer;