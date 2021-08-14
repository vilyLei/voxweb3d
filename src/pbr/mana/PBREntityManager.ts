
import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererScene from "../../vox/scene/RendererScene";

import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRMaterialBuilder from "../../pbr/mana/PBRMaterialBuilder";
import PBRParamEntity from "./PBRParamEntity";
import PBRMirror from "./PBRMirror";
import CubeRttBuilder from "../../renderingtoy/mcase/CubeRTTBuilder";
import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";
import EnvLightData from "../../light/base/EnvLightData";
import DisplayEntity from "../../vox/entity/DisplayEntity";


export default class PBREntityManager
{
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_mirrorEffector: PBRMirror = null;
    private m_materialBuilder: PBRMaterialBuilder;
    private m_cubeRTTBuilder: CubeRttBuilder;
    private m_vsmModule: ShadowVSMModule;
    private m_envData: EnvLightData;
    private m_texList: TextureProxy[] = null;
    private m_mirrorRprIndex: number = 3;

    fogEnabled: boolean = true;

    constructor(materialBuilder: PBRMaterialBuilder, cubeRTTBuilder: CubeRttBuilder, vsmModule: ShadowVSMModule, envData: EnvLightData) {

        this.m_materialBuilder = materialBuilder;
        this.m_cubeRTTBuilder = cubeRTTBuilder;
        this.m_vsmModule = vsmModule;
        this.m_envData = envData;
    }
    initialize(rscene:RendererScene, texLoader:ImageTextureLoader, mirrorEffector: PBRMirror,mirrorRprIndex: number): void {
        if(this.m_rscene != rscene) {
            this.m_rscene = rscene;
            this.m_texLoader = texLoader;
            this.m_mirrorEffector = mirrorEffector;
           this.m_mirrorRprIndex = mirrorRprIndex; 
        }
    }
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    createTexList(): TextureProxy[] {
        this.m_texList = [];
        return this.m_texList;
    }
    addTexture(tex: TextureProxy): void {
        this.m_texList.push(tex);
    }
    addTextureByUrl(url: string): void {
        this.m_texList.push(this.getImageTexByUrl( url ));
    }
    createMaterial(uscale: number, vscale: number): PBRMaterial {
        
        let ptexList: TextureProxy[] = this.m_texList;
        let vsmData = this.m_vsmModule.getVSMData();
        let shadowTex = this.m_vsmModule.getShadowMap();
        let matBuilder:PBRMaterialBuilder = this.m_materialBuilder;
        let material: PBRMaterial;
        material = matBuilder.makePBRMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
        
        material.shadowReceiveEnabled = true;
        material.fogEnabled = this.fogEnabled;
        material.indirectEnvMapEnabled = true;
        material.envMapEnabled = true;
        material.diffuseMapEnabled = true;
        material.normalMapEnabled = true;
        
        material.setUVScale(uscale,vscale);
        
        if(material.indirectEnvMapEnabled) {
            ptexList.push( this.m_cubeRTTBuilder.getCubeTexture() );
        }
        if(material.shadowReceiveEnabled) {
            ptexList.push( shadowTex );
            material.setVSMData( vsmData );
        }
        if(material.fogEnabled) {
            material.setEnvData( this.m_envData );
        }
        material.setTextureList( ptexList );
        return material;
    }
    createMirrorEntity(param: PBRParamEntity,material: PBRMaterial): void {
        
        let matBuilder:PBRMaterialBuilder = this.m_materialBuilder;
        //let param: PBRParamEntity;

        let mirMaterial: PBRMaterial = matBuilder.makePBRMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
        mirMaterial.copyFrom(material, false);
        let texList: TextureProxy[] = material.getTextureList();
        if(material.envMapEnabled) {
            mirMaterial.setTextureList(texList.slice(1));
        }
        else {
            mirMaterial.setTextureList(texList.slice(0));
        }
        mirMaterial.envMapEnabled = false;
        mirMaterial.diffuseMapEnabled = material.diffuseMapEnabled;
        mirMaterial.normalMapEnabled = material.normalMapEnabled;
        mirMaterial.indirectEnvMapEnabled = false;
        mirMaterial.pixelNormalNoiseEnabled = false;

        let mirEntity: DisplayEntity = new DisplayEntity();
        mirEntity.copyMeshFrom( param.entity );
        mirEntity.setMaterial(mirMaterial);
        mirEntity.copyTransformFrom( param.entity );
        this.m_rscene.addEntity(mirEntity, this.m_mirrorRprIndex);
        this.m_mirrorEffector.addMirrorEntity( mirEntity );

        param.setMirrorMaterial( mirMaterial );
    }
}