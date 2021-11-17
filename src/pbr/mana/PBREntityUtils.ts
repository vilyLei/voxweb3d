
import TextureProxy from "../../vox/texture/TextureProxy";
import { TextureConst } from "../../vox/texture/TextureConst";
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
import PBRShaderDecorator from "../material/PBRShaderDecorator";


export default class PBREntityUtils {
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_mirrorEffector: PBRMirror = null;
    private m_materialBuilder: PBRMaterialBuilder;
    private m_cubeRTTBuilder: CubeRttBuilder;
    private m_vsmModule: ShadowVSMModule;
    private m_mirrorRprIndex: number = 3;

    fogEnabled: boolean = true;

    constructor(materialBuilder: PBRMaterialBuilder, cubeRTTBuilder: CubeRttBuilder, vsmModule: ShadowVSMModule) {

        this.m_materialBuilder = materialBuilder;
        this.m_cubeRTTBuilder = cubeRTTBuilder;
        this.m_vsmModule = vsmModule;
    }
    getCubeRttBuilder(): CubeRttBuilder {
        return this.m_cubeRTTBuilder;
    }
    getVSMModule(): ShadowVSMModule {
        return this.m_vsmModule;
    }
    initialize(rscene: RendererScene, texLoader: ImageTextureLoader, mirrorEffector: PBRMirror, mirrorRprIndex: number): void {
        if (this.m_rscene != rscene) {
            this.m_rscene = rscene;
            this.m_texLoader = texLoader;
            this.m_mirrorEffector = mirrorEffector;
            this.m_mirrorRprIndex = mirrorRprIndex;
        }
    }
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }    
    useTexForMaterial(material: PBRMaterial, envMap: TextureProxy, diffuseMap: TextureProxy = null, normalMap: TextureProxy = null, aoMap: TextureProxy = null): void {
        
        let decorator: PBRShaderDecorator = material.decorator;
        decorator.envMap = envMap;
        decorator.diffuseMap = diffuseMap;
        decorator.normalMap = normalMap;
        decorator.aoMap = aoMap;
        
        if (decorator.indirectEnvMapEnabled) {
            decorator.indirectEnvMap = this.m_cubeRTTBuilder.getCubeTexture();
        }
        if (decorator.shadowReceiveEnabled) {
            decorator.shadowMap = this.m_vsmModule.getShadowMap();
        }
    }

    createMaterial(uscale: number, vscale: number): PBRMaterial {

        let matBuilder: PBRMaterialBuilder = this.m_materialBuilder;
        let material: PBRMaterial;
        material = matBuilder.makePBRMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);

        let decorator: PBRShaderDecorator = material.decorator;
        decorator.shadowReceiveEnabled = true;
        decorator.fogEnabled = this.fogEnabled;
        decorator.indirectEnvMapEnabled = true;
        decorator.envMapEnabled = true;
        decorator.diffuseMapEnabled = true;
        decorator.normalMapEnabled = true;

        material.setUVScale(uscale, vscale);
        return material;
    }
    createMirrorEntity(param: PBRParamEntity, material: PBRMaterial, mirrorType: number): void {

        let matBuilder: PBRMaterialBuilder = this.m_materialBuilder;

        let mirMaterial: PBRMaterial = matBuilder.makePBRMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);
        mirMaterial.copyFrom(material);
        let decorator: PBRShaderDecorator = material.decorator;

        let mirDecorator: PBRShaderDecorator = mirMaterial.decorator;
        mirDecorator.hdrBrnEnabled = false;
        mirDecorator.envMapEnabled = false;
        mirDecorator.diffuseMapEnabled = decorator.diffuseMapEnabled;
        mirDecorator.normalMapEnabled = decorator.normalMapEnabled;
        mirDecorator.indirectEnvMapEnabled = false;
        mirDecorator.pixelNormalNoiseEnabled = false;
        mirDecorator.aoMapEnabled = false;

        let mirEntity: DisplayEntity = new DisplayEntity();
        mirEntity.copyMeshFrom(param.entity);
        mirEntity.setMaterial(mirMaterial);
        mirEntity.copyTransformFrom(param.entity);
        this.m_rscene.addEntity(mirEntity, this.m_mirrorRprIndex);
        this.m_mirrorEffector.addMirrorEntity(mirEntity, mirrorType);

        param.setMirrorMaterial(mirMaterial);
    }
}