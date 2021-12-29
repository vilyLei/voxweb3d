
import TextureProxy from "../../vox/texture/TextureProxy";
import RendererScene from "../../vox/scene/RendererScene";

import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRMaterialBuilder from "../../pbr/mana/PBRMaterialBuilder";
import PBRParamEntity from "./PBRParamEntity";
import PBRMirror from "./PBRMirror";
import CubeRttBuilder from "../../renderingtoy/mcase/CubeRTTBuilder";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import PBRShaderDecorator from "../material/PBRShaderDecorator";
import { MaterialContext } from "../../materialLab/base/MaterialContext";


export default class PBREntityUtils {
    private m_rscene: RendererScene = null;
    materialCtx: MaterialContext = null;
    private m_mirrorEffector: PBRMirror = null;
    private m_materialBuilder: PBRMaterialBuilder;
    private m_cubeRTTBuilder: CubeRttBuilder;
    private m_mirrorRprIndex: number = 3;

    fogEnabled: boolean = true;

    constructor(materialBuilder: PBRMaterialBuilder, cubeRTTBuilder: CubeRttBuilder) {

        this.m_materialBuilder = materialBuilder;
        this.m_cubeRTTBuilder = cubeRTTBuilder;
    }
    getTextureByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.materialCtx.getTextureByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    getCubeRttBuilder(): CubeRttBuilder {
        return this.m_cubeRTTBuilder;
    }
    initialize(rscene: RendererScene, materialCtx: MaterialContext, mirrorEffector: PBRMirror, mirrorRprIndex: number): void {
        if (this.m_rscene != rscene) {
            this.m_rscene = rscene;
            this.materialCtx = materialCtx;
            this.m_mirrorEffector = mirrorEffector;
            this.m_mirrorRprIndex = mirrorRprIndex;
        }
    }
    useTexForMaterial(material: PBRMaterial, specularEnvMap: TextureProxy, diffuseMap: TextureProxy = null, normalMap: TextureProxy = null, aoMap: TextureProxy = null): void {
        
        let decorator: PBRShaderDecorator = material.decorator;
        decorator.specularEnvMap = specularEnvMap;
        decorator.diffuseMap = diffuseMap;
        decorator.normalMap = normalMap;
        decorator.aoMap = aoMap;
        
        if (decorator.indirectEnvMapEnabled) {
            decorator.indirectEnvMap = this.m_cubeRTTBuilder.getCubeTexture();
        }
    }

    createMaterial(): PBRMaterial {

        let matBuilder: PBRMaterialBuilder = this.m_materialBuilder;
        let material: PBRMaterial;
        material = matBuilder.makePBRMaterial(Math.random(), Math.random(), 0.7 + Math.random() * 0.3);

        let decorator: PBRShaderDecorator = material.decorator;
        decorator.shadowReceiveEnabled = true;
        decorator.fogEnabled = this.fogEnabled;
        decorator.indirectEnvMapEnabled = true;
        decorator.specularEnvMapEnabled = true;
        decorator.diffuseMapEnabled = true;
        decorator.normalMapEnabled = true;

        //material.setUVScale(uscale, vscale);
        return material;
    }
    createMirrorEntity(param: PBRParamEntity, material: PBRMaterial, mirrorType: number): void {

        let matBuilder: PBRMaterialBuilder = this.m_materialBuilder;

        let mirMaterial: PBRMaterial = matBuilder.makePBRMaterial(1,1,1);
        mirMaterial.copyFrom(material);
        let decorator: PBRShaderDecorator = material.decorator;

        let mirDecorator: PBRShaderDecorator = mirMaterial.decorator;
        mirDecorator.hdrBrnEnabled = false;
        mirDecorator.specularEnvMapEnabled = true;
        mirDecorator.diffuseMapEnabled = decorator.diffuseMapEnabled;
        mirDecorator.normalMapEnabled = decorator.normalMapEnabled;
        mirDecorator.indirectEnvMapEnabled = false;
        mirDecorator.pixelNormalNoiseEnabled = false;
        mirDecorator.aoMapEnabled = false;
        mirDecorator.shadowReceiveEnabled = false;
        mirDecorator.fogEnabled = false;

        let mirEntity: DisplayEntity = new DisplayEntity();
        mirEntity.copyMeshFrom(param.entity);
        mirEntity.setMaterial(mirMaterial);
        mirEntity.copyTransformFrom(param.entity);
        this.m_rscene.addEntity(mirEntity, this.m_mirrorRprIndex);
        this.m_mirrorEffector.addMirrorEntity(mirEntity, mirrorType);

        param.setMirrorMaterial(mirMaterial);
    }
}