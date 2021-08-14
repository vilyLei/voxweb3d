
import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererScene from "../../vox/scene/RendererScene";
import DefaultPBRUI from "./DefaultPBRUI";

import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRMaterialBuilder from "../../pbr/mana/PBRMaterialBuilder";
import PBRParamEntity from "./PBRParamEntity";
import PBRMirror from "./PBRMirror";
import PBREntityUtils from "./PBREntityUtils";
import CubeRttBuilder from "../../renderingtoy/mcase/CubeRTTBuilder";
import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";
import EnvLightData from "../../light/base/EnvLightData";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";


export default class PBREntityManager
{
    private m_rscene:RendererScene = null;
    private m_entityUtils: PBREntityUtils = null;
    private m_mirrorEffector: PBRMirror = null;
    private m_uiModule: DefaultPBRUI;
    private m_envMap: TextureProxy = null;
    private m_paramEntities:PBRParamEntity[] = [];
    private m_reflectPlaneY: number = -220.0;

    constructor() {

    }
    initialize(rscene:RendererScene, entityUtils: PBREntityUtils, mirrorEffector: PBRMirror,uiModule: DefaultPBRUI, envMap: TextureProxy): void {
        if(this.m_rscene != rscene) {
            this.m_rscene = rscene;
            this.m_entityUtils = entityUtils;
            this.m_mirrorEffector = mirrorEffector;
            this.m_uiModule = uiModule;
            this.m_envMap = envMap;
            
            this.initPrimitive();
        }
    }
    
    private initPrimitive(): void {

        let param: PBRParamEntity;
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
        
        this.m_entityUtils.createTexList();
        this.m_entityUtils.addTexture(this.m_envMap);
        this.m_entityUtils.addTextureByUrl("static/assets/noise.jpg");
        this.m_entityUtils.addTextureByUrl("static/assets/disp/lava_03_NRM.png");
        this.m_entityUtils.addTextureByUrl("static/assets/disp/lava_03_OCC.png");
        
        for(let i: number = 0; i < total; ++i) {

            rad = Math.random() * 100.0;
            radius = Math.random() * 250.0 + 550.0;

            let uvscale: number = Math.random() * 7.0 + 0.6;

            material = this.m_entityUtils.createMaterial(uvscale,uvscale);
            material.aoMapEnabled = true;
            let pr: number = 80 + Math.random() * 100.0;
            sph = new Sphere3DEntity();
            sph.setMaterial( material );
            sph.initialize(pr, 20, 20);
            sph.setXYZ(radius * Math.cos(rad), i * 30 + (this.m_reflectPlaneY + 10) + pr + 5, radius * Math.sin(rad));
            this.m_rscene.addEntity(sph);
            
            param = new PBRParamEntity();
            param.entity = sph;
            param.setMaterial( material );
            param.pbrUI = this.m_uiModule;
            param.colorPanel = this.m_uiModule.rgbPanel;
            param.initialize();
            this.m_paramEntities.push(param);
            this.m_entityUtils.createMirrorEntity(param, material);
            
        }
    }
}