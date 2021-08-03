
import Vector3D from "../../vox/math/Vector3D";
import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererScene from "../../vox/scene/RendererScene";
import DefaultPBRUI from "./DefaultPBRUI";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";

import DefaultPBRMaterial2 from "../../pbr/material/DefaultPBRMaterial2";
import MaterialBuilder from "../../pbr/mana/MaterialBuilder";
import MirrorProjEntity from "./MirrorProjEntity";
import PBRParamEntity from "./PBRParamEntity";
import MirrorEffector from "./MirrorEffector";
import CubeRttBuilder from "../../renderingtoy/mcase/CubeRTTBuilder";
import GlobalLightData from "../../light/base/GlobalLightData";


export default class EntityScene
{
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_uiModule: DefaultPBRUI;
    private m_envMap: TextureProxy = null;
    private m_mirrorEffector: MirrorEffector = null;
    private m_paramEntities:PBRParamEntity[] = [];

    private m_materialBuilder: MaterialBuilder;    
    private m_cubeRTTBuilder: CubeRttBuilder;

    private m_mirrorRprIndex: number = 3;
    private m_lightData: GlobalLightData = new GlobalLightData();

    constructor(materialBuilder: MaterialBuilder, cubeRTTBuilder: CubeRttBuilder) {
        this.m_materialBuilder = materialBuilder;
        this.m_cubeRTTBuilder = cubeRTTBuilder;
        
    }

    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    
    initialize(rscene:RendererScene, texLoader:ImageTextureLoader, uiModule: DefaultPBRUI, envMap: TextureProxy, mirrorEffector: MirrorEffector):void
    {
        if(this.m_rscene == null)
        {
            this.m_rscene = rscene;
            this.m_texLoader = texLoader;
            this.m_uiModule = uiModule;
            this.m_envMap = envMap;
            this.m_mirrorEffector = mirrorEffector;
            this.m_lightData.initialize(4, 2);
            this.m_lightData.buildData();

            this.m_materialBuilder.lightData = this.m_lightData;

            this.m_mirrorRprIndex = 3;
            this.m_mirrorEffector.envMap = this.m_envMap;
            this.m_mirrorEffector.materialBuilder = this.m_materialBuilder;            
            this.m_mirrorEffector.initialize(this.m_rscene, this.m_texLoader, this.m_uiModule, [this.m_mirrorRprIndex]);

            this.initObjs();
        }
    }
    
    private initObjs(): void {

        let matBuilder:MaterialBuilder = this.m_materialBuilder;
        let param: PBRParamEntity;
        let material: DefaultPBRMaterial2;

        this.m_paramEntities.push( this.m_mirrorEffector.getPlaneParamEntity() );

        let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];
        let cubeTex0: TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("static/assets/cubeMap", urls);
        

        let sph: Sphere3DEntity;
        let rad: number;
        let radius: number;
        let total: number = 3;
        for(let i: number = 0; i < total; ++i) {

            rad = Math.random() * 100.0;
            radius = Math.random() * 250.0 + 550.0;
            material = matBuilder.makeDefaultPBRMaterial2(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
            material.setTextureList( [
                this.m_envMap
                //  ,this.getImageTexByUrl("static/assets/disp/box_COLOR.png")
                //  ,this.getImageTexByUrl("static/assets/disp/box_NRM.png")

                //  ,this.getImageTexByUrl("static/assets/noise.jpg")
                ,this.getImageTexByUrl("static/assets/disp/lava_03_COLOR.png")
                ,this.getImageTexByUrl("static/assets/disp/lava_03_NRM.png")

                //  ,this.getImageTexByUrl("static/assets/disp/metal_08_COLOR.png")
                //  ,this.getImageTexByUrl("static/assets/disp/metal_08_NRM.png")

                ,this.m_cubeRTTBuilder.getCubeTexture()
                //,cubeTex0
            ] );
            material.diffuseMapEnabled = true;
            material.normalMapEnabled = true;
            material.indirectEnvMapEnabled = true;
            let pr: number = 80 + Math.random() * 100.0;
            sph = new Sphere3DEntity();
            sph.setMaterial( material );
            sph.initialize(pr, 20, 20);
            sph.setXYZ(radius * Math.cos(rad), Math.random() * 500.0, radius * Math.sin(rad));
            this.m_rscene.addEntity(sph);

            param = new PBRParamEntity();
            param.entity = sph;
            param.setMaterial( material );
            param.pbrUI = this.m_uiModule;
            param.colorPanel = this.m_uiModule.rgbPanel;
            param.initialize();
            this.m_paramEntities.push(param);

            let mirMaterial: DefaultPBRMaterial2 = matBuilder.makeDefaultPBRMaterial2(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
            mirMaterial.copyFrom(material, false);
            let texList: TextureProxy[] = material.getTextureList();
            mirMaterial.setTextureList([texList[0],texList[1],texList[2]]);
            mirMaterial.diffuseMapEnabled = true;
            mirMaterial.normalMapEnabled = true;
            mirMaterial.indirectEnvMapEnabled = false;
            mirMaterial.pixelNormalNoiseEnabled = false;

            let mirSph: Sphere3DEntity = new Sphere3DEntity();
            mirSph.copyMeshFrom(sph);
            mirSph.setMaterial(mirMaterial);
            mirSph.initialize(80,20,20);
            mirSph.copyTransformFrom(sph);
            this.m_rscene.addEntity(mirSph, this.m_mirrorRprIndex);
            this.m_mirrorEffector.addMirrorEntity( mirSph );

            param.setMirrorMaterial( mirMaterial );
        }
    }
    update(): void {
        //this.m_lightData.update();
    }
}