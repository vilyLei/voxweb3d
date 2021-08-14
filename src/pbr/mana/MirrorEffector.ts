
import Vector3D from "../../vox/math/Vector3D";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";

import DefaultPBRUI from "./DefaultPBRUI";
import FBOInstance from "../../vox/scene/FBOInstance";
import CameraBase from "../../vox/view/CameraBase";

import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";

import PBRParamEntity from "./PBRParamEntity";
import DefaultPBRMaterial2 from "../../pbr/material/DefaultPBRMaterial2";
import MaterialBuilder from "../../pbr/mana/MaterialBuilder";
import MirrorProjEntity from "./MirrorProjEntity";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import EnvLightData from "../../light/base/EnvLightData";

export class MirrorEffector
{
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_uiModule:DefaultPBRUI = null;
    private m_rprocessIDList: number[] = [0];
    private m_fboIndex: number = 1;
    envData: EnvLightData;
    reflectPlaneY: number = -220.0;
    materialBuilder: MaterialBuilder;
    envMap: TextureProxy = null;
    vsmModule: ShadowVSMModule = null;
    fogEnabled: boolean = false;
    constructor(fboIndex: number) {
        this.m_fboIndex = fboIndex;
    }
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    
    initialize(rscene: RendererScene, texLoader:ImageTextureLoader,uiModule:DefaultPBRUI,rprocessIDList: number[]):void
    {
        console.log("MirrorEffector::initialize()......");
        if(this.m_rscene == null)
        {
            this.m_rscene = rscene;
            this.m_texLoader = texLoader;
            this.m_uiModule = uiModule;
            this.m_rprocessIDList = rprocessIDList;

            this.initMirrorEffect();
        }
    }
    
    private m_fboIns: FBOInstance = null;
    private m_plane: Plane3DEntity = null;
    private m_planeParam: PBRParamEntity = null;
    private m_mirrorEntities:MirrorProjEntity[] = [];
    private m_mirrorMapLodEnabled: boolean = true;
    private initMirrorEffect(): void {

        this.m_fboIns = this.m_rscene.createFBOInstance();
        this.m_fboIns.asynFBOSizeWithViewport();
        this.m_fboIns.setClearRGBAColor4f(0.0,0.0,0.0,1.0);   // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
        this.m_fboIns.createFBOAt(this.m_fboIndex, 512, 512, true,false);
        this.m_fboIns.setRenderToRTTTextureAt(0, 0);          // framebuffer color attachment 0
        this.m_fboIns.setRProcessIDList( this.m_rprocessIDList );

        //  let scrPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        //  scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_fboIns.getRTTAt(0)]);
        //  scrPlane.setOffsetRGB3f(0.1,0.1,0.1);
        //  this.m_rscene.addEntity(scrPlane, 1);
        
        let camera: CameraBase = this.m_rscene.getCamera();
        let camPos: Vector3D = camera.getPosition();
        camPos.y *= -1.0;

        
        let texList: TextureProxy[] = [
            this.m_fboIns.getRTTAt(0),
            this.getImageTexByUrl("static/assets/brickwall_big.jpg"),
            this.getImageTexByUrl("static/assets/brickwall_normal.jpg")
        ];
        
        let mEntity: MirrorProjEntity = null;
        let plane:Plane3DEntity = null;
        let material: DefaultPBRMaterial2;
        
        let vsmData = this.vsmModule.getVSMData();
        let shadowTex = this.vsmModule.getShadowMap();

        this.m_mirrorMapLodEnabled = true;
        ///*
        // mirror plane
        material = this.materialBuilder.makeDefaultPBRMaterial2(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
        material.fogEnabled = this.fogEnabled;
        material.shadowReceiveEnabled = true;
        material.pixelNormalNoiseEnabled = true;
        material.mirrorProjEnabled = true;
        material.mirrorMapLodEnabled = this.m_mirrorMapLodEnabled;
        material.diffuseMapEnabled = true;
        material.normalMapEnabled = true;
        let ptexList: TextureProxy[] = [
            this.envMap
            , this.getImageTexByUrl("static/assets/brickwall_big.jpg")
            , this.getImageTexByUrl("static/assets/brickwall_normal.jpg")
            , this.m_fboIns.getRTTAt(0)
        ]
        
        if(material.shadowReceiveEnabled) {
            ptexList.push( shadowTex );
            material.setVSMData( vsmData );
        }
        material.setTextureList( ptexList );
        if(this.m_mirrorMapLodEnabled) {
            this.m_fboIns.enableMipmapRTTAt(0);
            material.setMirrorMapLodLevel(2.0);
        }
        if(material.fogEnabled) {
            material.setEnvData( this.envData );
        }
        material.setUVScale(3.0,3.0);
        material.setMirrorIntensity(0.4);
        material.setMirrorMixFactor(0.3);
        plane = new Plane3DEntity();
        plane.flipVerticalUV = true;
        plane.setMaterial(material);
        plane.initializeXOZ(-1100.0, -1100.0, 2200.0, 2200.0, texList);
        plane.setXYZ(0, this.reflectPlaneY, 0);
        this.m_rscene.addEntity(plane, 1);
        this.m_plane = plane;
        
        let param: PBRParamEntity = new PBRParamEntity();
        param.entity = plane;
        param.setMaterial(material);
        param.pbrUI = this.m_uiModule;
        param.colorPanel = this.m_uiModule.rgbPanel;
        param.initialize();
        this.m_planeParam = param;
        //*/

    }
    getPlane(): Plane3DEntity {
        return this.m_plane;
    }
    getPlaneParamEntity(): PBRParamEntity {
        return this.m_planeParam;
    }
    addMirrorEntity(entity: DisplayEntity): void {

        let mEntity: MirrorProjEntity = new MirrorProjEntity();
        mEntity.entity = entity;
        mEntity.mirrorPlane = this.getPlane();

        mEntity.toMirror();

        this.m_mirrorEntities.push(mEntity);
    }
    render(): void {

        
        // --------------------------------------------- mirror inverted reflection fbo run begin        

        this.m_fboIns.run();
        if(this.m_mirrorMapLodEnabled) {
            this.m_fboIns.generateMipmapTextureAt(0);
        }
        // --------------------------------------------- mirror inverted reflection fbo run end
        
        this.m_rscene.setRenderToBackBuffer();
        
        
    }
}
    
export default MirrorEffector;