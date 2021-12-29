import TextureProxy from "../../vox/texture/TextureProxy";
import RendererScene from "../../vox/scene/RendererScene";
import DefaultPBRUI from "./DefaultPBRUI";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRParamEntity from "./PBRParamEntity";
import PBREntityUtils from "./PBREntityUtils";
import DisplayEntity from "../../vox/entity/DisplayEntity";

import Vector3D from "../../vox/math/Vector3D";
import DracoMesh from "../../voxmesh/draco/DracoMesh";
import { DracoModuleLoader, DracoWholeModuleLoader, DracoMultiPartsModuleLoader } from "../../voxmesh/draco/DracoModuleLoader";
import { VertUniformComp } from "../../vox/material/component/VertUniformComp";


export class PBRWholeDracoModule extends DracoWholeModuleLoader {

    entityUtils: PBREntityUtils = null;
    uiModule: DefaultPBRUI;
    paramEntities: PBRParamEntity[] = [];
    reflectPlaneY: number = -220.0;
    aoMapEnabled: boolean = false;
    specularEnvMap: TextureProxy;
    constructor() {
        super();
    }
    dracoParse(pmodule: any, index: number, total: number): void {
    }
    dracoParseFinish(modules: any[], total: number): void {

        console.log("pbrDracoParseFinish, modules: ", modules, this.m_pos);

        let mesh: DracoMesh = new DracoMesh();
        mesh.initialize(modules);
      
        let material: PBRMaterial = this.entityUtils.createMaterial();
        let texList: TextureProxy[] = material.getTextureList().slice(0, 1);
        material.setTextureList(texList);
        material.decorator.diffuseMapEnabled = false;
        material.decorator.normalMapEnabled = false;
        material.decorator.vtxFlatNormal = false;
        material.decorator.aoMapEnabled = false;//this.aoMapEnabled;
        let vertUniform: VertUniformComp = material.vertUniform as VertUniformComp;
        vertUniform.uvTransformEnabled = true;
        material.initializeByCodeBuf( true );
        let uvscale: number = 0.01;//Math.random() * 7.0 + 0.6; 
        vertUniform.setUVScale(uvscale, uvscale);
        let scale: number = 1.0;
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);
        entity.setScaleXYZ(scale, scale, scale);
        //entity.setRotationXYZ(0, Math.random() * 300, 0);
        entity.setPosition(this.m_pos);
        this.m_rscene.addEntity(entity);

        this.addParamEntity(entity, material);

        this.loadNext();
    }
    private addParamEntity(entity: DisplayEntity, material: PBRMaterial): void {
        let param: PBRParamEntity = new PBRParamEntity();
        param.entity = entity;
        param.setMaterial(material);
        param.pbrUI = this.uiModule;
        param.colorPanel = this.uiModule.rgbPanel;
        param.initialize();
        this.paramEntities.push(param);
        this.entityUtils.createMirrorEntity(param, material, 1);
    }
}

export class PBRMultiPartsDracoModule extends DracoMultiPartsModuleLoader {

    entityUtils: PBREntityUtils = null;
    uiModule: DefaultPBRUI;
    paramEntities: PBRParamEntity[] = [];
    reflectPlaneY: number = -220.0;
    aoMapEnabled: boolean = false;
    specularEnvMap: TextureProxy;
    constructor() {
        super();
    }

    dracoParseFinish(modules: any[], total: number): void {

        console.log("pbrDracoParseFinish, modules: ", modules, this.m_pos);
       
        let material: PBRMaterial = this.entityUtils.createMaterial();
        let decorator = material.decorator;
        decorator.indirectEnvMapEnabled = true;
        const keyNS: string = "/dracos_42";
        if (this.m_url.indexOf(keyNS) > 0) {

            decorator.diffuseMapEnabled = true;
            decorator.normalMapEnabled = false;
            decorator.vtxFlatNormal = false;
            decorator.aoMapEnabled = false;
            decorator.shadowReceiveEnabled = false;
            this.entityUtils.useTexForMaterial(material, this.specularEnvMap, this.entityUtils.getTextureByUrl("static/assets/noise.jpg"));
        }
        else {

            decorator.diffuseMapEnabled = true;
            decorator.normalMapEnabled = true;
            decorator.aoMapEnabled = true;
            decorator.vtxFlatNormal = false;
            decorator.aoMapEnabled = this.aoMapEnabled;
            let aoTex: TextureProxy = null;
            if (material.decorator.aoMapEnabled) {
                aoTex = this.entityUtils.getTextureByUrl("static/assets/modules/skirt/ao.jpg");
            }
            this.entityUtils.useTexForMaterial(
                material,
                this.specularEnvMap,
                this.entityUtils.getTextureByUrl("static/assets/modules/skirt/baseColor.jpg"),
                this.entityUtils.getTextureByUrl("static/assets/modules/skirt/normal.jpg"),
                aoTex
            );
        }
        let vertUniform: VertUniformComp = material.vertUniform as VertUniformComp;
        vertUniform.uvTransformEnabled = true;
        material.initializeByCodeBuf(true);
        
        let uvscale: number = 0.01;//Math.random() * 7.0 + 0.6; 
        vertUniform.setUVScale(uvscale, uvscale);

        let mesh: DracoMesh = new DracoMesh();
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(modules);
        let scale: number = 1.0;
        let entity: DisplayEntity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);
        entity.setScaleXYZ(scale, scale, scale);
        //entity.setRotationXYZ(0, Math.random() * 300, 0);
        entity.setPosition(this.m_pos);
        this.m_rscene.addEntity(entity);
        //pos.addBy( this.m_pos );
        //  let pos: Vector3D = new Vector3D();
        //  entity.getPosition( pos );
        //  let pv: Vector3D = entity.getGlobalBounds().min;
        //  pos.y += (this.reflectPlaneY - pv.y) + 70.0;
        //  entity.setPosition( pos );
        //  entity.update();

        this.addParamEntity(entity, material, 1);

        this.loadNext();
    }
    private addParamEntity(entity: DisplayEntity, material: PBRMaterial, mirrorType: number): void {
        let param: PBRParamEntity = new PBRParamEntity();
        param.entity = entity;
        param.setMaterial(material);
        param.pbrUI = this.uiModule;
        param.colorPanel = this.uiModule.rgbPanel;
        param.initialize();
        this.paramEntities.push(param);
        this.entityUtils.createMirrorEntity(param, material, mirrorType);
    }
}