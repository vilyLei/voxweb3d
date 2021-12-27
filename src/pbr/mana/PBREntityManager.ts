
import TextureProxy from "../../vox/texture/TextureProxy";

import RendererScene from "../../vox/scene/RendererScene";
import DefaultPBRUI from "./DefaultPBRUI";

import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRParamEntity from "./PBRParamEntity";
import PBRMirror from "./PBRMirror";
import PBREntityUtils from "./PBREntityUtils";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";

import Vector3D from "../../vox/math/Vector3D";

import DracoMeshBuilder from "../../voxmesh/draco/DracoMeshBuilder";
import ThreadSystem from "../../thread/ThreadSystem";
import HdrBrnCubeMapMapMaterial from "../../vox/material/mcase/HdrBrnCubeMapMaterial";

import {PBRWholeDracoModule, PBRMultiPartsDracoModule} from "./PBRDracoModule";
import Box3DEntity from "../../vox/entity/Box3DEntity";
export default class PBREntityManager
{
    private m_rscene:RendererScene = null;
    private m_entityUtils: PBREntityUtils = null;
    private m_mirrorEffector: PBRMirror = null;
    private m_uiModule: DefaultPBRUI;
    private m_specularEnvMap: TextureProxy = null;
    private m_paramEntities:PBRParamEntity[] = [];
    private m_dracoMeshLoader: DracoMeshBuilder = new DracoMeshBuilder(1);
    private m_reflectPlaneY: number = -220.0;
    private m_dracoModule: PBRMultiPartsDracoModule = new PBRMultiPartsDracoModule();
    aoMapEnabled: boolean = false;
    constructor() {
    }
    initialize(rscene:RendererScene, entityUtils: PBREntityUtils, mirrorEffector: PBRMirror,uiModule: DefaultPBRUI, specularEnvMap: TextureProxy): void {

        if(this.m_rscene != rscene) {

            this.m_rscene = rscene;
            this.m_entityUtils = entityUtils;
            this.m_mirrorEffector = mirrorEffector;
            this.m_uiModule = uiModule;
            this.m_specularEnvMap = specularEnvMap;
            
            this.m_dracoMeshLoader.initialize(2);
                        
            this.m_dracoModule.entityUtils = this.m_entityUtils;
            this.m_dracoModule.uiModule = this.m_uiModule;
            this.m_dracoModule.paramEntities = this.m_paramEntities;
            this.m_dracoModule.reflectPlaneY = this.m_reflectPlaneY;
            this.m_dracoModule.aoMapEnabled = this.aoMapEnabled;
            this.m_dracoModule.specularEnvMap = this.m_specularEnvMap;
            //"static/assets/modules/skirt/dracos_"+ i +".drc.zip"
            let urlsTotal: number = 30;
            let urls: string[] = [];
            
            urls.push("static/assets/modules/skirt/dracos_"+ 42 +".drc.zip");

            for(let i: number = 0; i < urlsTotal; ++i) {
                urls.push("static/assets/modules/skirt/dracos_"+ i +".drc.zip");
            }
            urlsTotal = urls.length;
            
            this.m_dracoModule.initialize(this.m_rscene, this.m_dracoMeshLoader);
            this.m_dracoModule.setUrlList(urls);
            this.m_dracoModule.setPartsTotal(urlsTotal);
            this.m_dracoModule.setScale( 1.0 );
            this.m_dracoModule.setPosition(new Vector3D(0.0, -300.0, 0.0));
            this.m_dracoModule.loadNext();

            this.initPrimitive();
        }
    }
    private useMaterial(material: PBRMaterial): void {

        material.decorator.specularEnvMap = this.m_specularEnvMap;
        // base color map
        material.decorator.diffuseMap = this.m_entityUtils.getTextureByUrl( "static/assets/disp/normal_4_256_COLOR.png" );
        // normal map
        material.decorator.normalMap = this.m_entityUtils.getTextureByUrl( "static/assets/disp/normal_4_256_NRM.png" );
        if(this.aoMapEnabled) {
            // ao map
            material.decorator.aoMap = this.m_entityUtils.getTextureByUrl( "static/assets/disp/normal_4_256_OCC.png" );
        }
        
        if (material.decorator.indirectEnvMapEnabled) {
            material.decorator.indirectEnvMap = this.m_entityUtils.getCubeRttBuilder().getCubeTexture();
        }
        if (material.decorator.shadowReceiveEnabled) {
            material.decorator.shadowMap = this.m_entityUtils.getVSMModule() != null ? this.m_entityUtils.getVSMModule().getShadowMap() : null;
        }
    }
    private initPrimitive(): void {

        let material: PBRMaterial;
        
        this.m_paramEntities.push( this.m_mirrorEffector.getPlaneParamEntity() );
        /*
        let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];
        let cubeTex0: TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("static/assets/cubeMap", urls);
        //*/
        
        let sph: Sphere3DEntity;
        let rad: number;
        let radius: number;
        let total: number = 4;
        
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
        material = this.m_entityUtils.createMaterial(1,1);
        material.decorator.aoMapEnabled = this.aoMapEnabled;

        this.useMaterial( material );
        let srcSph = new Sphere3DEntity();
        srcSph.setMaterial( material );
        srcSph.initialize(100.0, 20, 20);
        let scale: number = 1.0;
        let uvscale: number;
        total = posList.length;
        
        for(let i: number = 0; i < total; ++i) {

            rad = Math.random() * 100.0;
            radius = Math.random() * 150.0 + 650.0;
            uvscale = Math.random() * 7.0 + 0.6;

            material = this.m_entityUtils.createMaterial(uvscale,uvscale);
            material.decorator.aoMapEnabled = this.aoMapEnabled;
            this.useMaterial( material );

            scale = 0.8 + Math.random();
            let pr: number = scale * 100.0;
            sph = new Sphere3DEntity();
            sph.setMaterial( material );
            if(srcSph != null)sph.copyMeshFrom( srcSph );
            sph.initialize(100.0, 20, 20);
            sph.setRotationXYZ(Math.random() * 300.0, Math.random() * 300.0, Math.random() * 300.0);
            sph.setScaleXYZ(scale, scale, scale);
            posList[i].y += (this.m_reflectPlaneY + 10) + pr + 5;
            sph.setPosition(posList[i]);
            this.m_rscene.addEntity(sph);
            
            this.addParamEntity(sph, material, 0);
        }

        //  let box: Box3DEntity = new Box3DEntity();        
        //  box.useGourandNormal();
        //  box.setMaterial(material);
        //  box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex]);
        //  this.m_rscene.addEntity(box);

        //  console.log("this.m_specularEnvMap>>>>>>>>>>>>>>: ",this.m_specularEnvMap);
        ///*
        material = this.m_entityUtils.createMaterial(1,1);
        material.decorator.diffuseMapEnabled = true;
        material.decorator.normalMapEnabled = false;
        material.decorator.vtxFlatNormal = false;
        material.decorator.aoMapEnabled = false;
        material.decorator.shadowReceiveEnabled = false;
        
        material.setRoughness(0.4);
        this.m_entityUtils.useTexForMaterial(material, this.m_specularEnvMap, this.m_entityUtils.getTextureByUrl("static/assets/noise.jpg"));
        let envSph: Sphere3DEntity = new Sphere3DEntity();
        envSph.setMaterial(material);
        envSph.showFrontFace();
        envSph.initialize(3000.0,30,30);
        //material.setAmbientFactor(1.0,0.0,1.0);
        this.m_rscene.addEntity(envSph, 4);
        //*/
        /*
        let ufmaterial: HdrBrnCubeMapMapMaterial = new HdrBrnCubeMapMapMaterial();
        ufmaterial.setMipmapLevel(3.5);
        let ufsph: Sphere3DEntity = new Sphere3DEntity();
        ufsph.setMaterial(ufmaterial);
        ufsph.showFrontFace();
        ufsph.initialize(3000.0,30,30, [this.m_specularEnvMap]);
        this.m_rscene.addEntity(ufsph, 4);
        //*/
    }
    private addParamEntity(entity: DisplayEntity, material: PBRMaterial, mirrorType: number): void {
        let param: PBRParamEntity = new PBRParamEntity();
        param.entity = entity;
        param.setMaterial( material );
        param.pbrUI = this.m_uiModule;
        param.colorPanel = this.m_uiModule.rgbPanel;
        param.initialize();
        this.m_paramEntities.push(param);
        this.m_entityUtils.createMirrorEntity(param, material, mirrorType);
    }
    run(): void {
        ThreadSystem.Run();
    }
}