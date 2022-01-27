import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";
import { IEnvLightModule } from "../../../light/base/IEnvLightModule";
import { IMaterialPipeline } from "../../../vox/material/pipeline/IMaterialPipeline";
import { IAppEngine } from "../../modules/interfaces/IAppEngine";
import { IAppBase } from "../../modules/interfaces/IAppBase";
import Vector3D from "../../../vox/math/Vector3D";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { IMaterial } from "../../../vox/material/IMaterial";
import Color4 from "../../../vox/material/Color4";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IObjGeomDataParser from "../../../vox/mesh/obj/IObjGeomDataParser";
import { IDataMesh } from "../../../vox/mesh/IDataMesh";
import { IAppLambert } from "../../modules/interfaces/IAppLambert";
import BinaryLoader from "../../../vox/assets/BinaryLoader"
import IMaterialModule from "./material/IMaterialModule";
import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import MaterialBuilder from "./material/MaterialBuilder";
import ModuleFlag from "../base/ModuleFlag";

declare var AppBase: any;
declare var AppLambert: any;

class ViewerScene {

    private m_appBase: IAppBase = null;
    private m_appLambert: IAppLambert = null;
    private m_rscene: IRendererScene;
    private m_materialBuilder: MaterialBuilder = new MaterialBuilder();
    private m_materialCtx: IMaterialContext;
    private m_defaultEntities: IRenderEntity[] = [];
    private m_entities: IRenderEntity[] = [];
    private m_meshs: IDataMesh[] = [];
    constructor() { }

    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded spec map ata.");
    }
    loadError(status: number, uuid: string): void {
    }
    loadSpecularData(hdrBrnEnabled: boolean): void {
        let envMapUrl: string = "static/bytes/spe.mdf";
        if (hdrBrnEnabled) {
            envMapUrl = "static/bytes/speBrn.bin";
        }
        console.log("start load spec map ata.");
        let load = new BinaryLoader();
        load.load(envMapUrl, this);
    }
    addDataMesh(mesh: IDataMesh): void {

        console.log("add mesh");
        let rscene = this.m_rscene;

        this.m_meshs.push(mesh);

        let material = this.m_materialBuilder.createDefaultMaterial();
        material.initializeByCodeBuf(true);

        mesh.setVtxBufRenderData(material);
        mesh.initialize();

        let scale: number = 400.0;
        let entity = this.m_rscene.entityBlock.createEntity();
        entity.setMesh(mesh);
        entity.setMaterial(material);
        entity.setScaleXYZ(scale, scale, scale);
        rscene.addEntity(entity);
        this.m_defaultEntities.push(entity);

        // let scale: number = 500.0;

        // let boxEntity = rscene.entityBlock.createEntity();
        // boxEntity.setMaterial (material );
        // boxEntity.copyMeshFrom( rscene.entityBlock.unitBox );
        // boxEntity.setScaleXYZ(scale, scale * 0.05, scale);
        // rscene.addEntity(boxEntity);
        // this.m_defaultEntities.push( boxEntity );
    }
    initialize(voxAppBase: IAppBase, rscene: IRendererScene): void {

        this.m_appBase = voxAppBase;
        this.m_rscene = rscene;
        this.m_rscene.setClearRGBColor3f(0.1, 0.4, 0.2);
        this.m_materialBuilder.initialize(this.m_appBase, this.m_rscene);
    }
    setMaterialContext(materialCtx: IMaterialContext): void {

        this.m_materialCtx = materialCtx;
        this.m_materialBuilder.setMaterialContext( this.m_materialCtx );

        this.initEnvBox();
    }
    addMaterial(flag: number): void {
        this.m_materialBuilder.addMaterial( flag );
    }
    private m_timeoutId: any = -1;
    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }

        let rscene = this.m_rscene;
        for (let i: number = 0; i < this.m_entities.length; ++i) {

            if (this.m_entities[i].isInRendererProcess()) {
                const et = this.m_defaultEntities[i];
                rscene.removeEntity(et);
                this.m_defaultEntities.splice(i, 1);
                // this.m_entities[i].setVisible(false);
                this.m_entities.splice(i, 1);
            }
        }
        if (this.m_defaultEntities.length > 0) {
            this.m_timeoutId = setTimeout(this.update.bind(this), 20);// 20 fps
        }
    }
    
    initCommonScene(): void {

        console.log("this.m_materialBuilder.hasMaterialWith(ModuleFlag.AppLambert): ",this.m_materialBuilder.hasMaterialWithFlag(ModuleFlag.AppLambert), this.m_meshs.length > 0);
        let initFlag = (this.m_materialBuilder.isEnabledWithFlag(ModuleFlag.AppLambert) && this.m_meshs.length > 0);
        if(!initFlag) {
            return;
        }

        let rscene = this.m_rscene;

        this.update();
        if (this.m_defaultEntities.length > 0) {
            console.log("lambert initCommonScene()...");
            // let material = this.createLambertMaterial();
            let material = this.m_materialBuilder.createLambertMaterial();

            let scale: number = 400.0;
            let entity = rscene.entityBlock.createEntity();
            entity.setMaterial(material);
            entity.copyMeshFrom(this.m_defaultEntities[0]);
            entity.setScaleXYZ(scale, scale, scale);
            rscene.addEntity(entity);
            this.m_entities.push(entity);
        }

        // let scale: number = 500.0;
        // let boxEntity = rscene.entityBlock.createEntity();
        // boxEntity.setMaterial(material);
        // boxEntity.copyMeshFrom(rscene.entityBlock.unitBox);
        // boxEntity.setScaleXYZ(scale, scale * 0.05, scale);
        // rscene.addEntity(boxEntity);
        // this.m_entities.push( boxEntity );

        // let axis = new VoxApp.Axis3DEntity();
        // axis.initialize(30);
        // axis.setXYZ(300, 0.0, 0.0);
        // appIns.addEntity(axis);

        // let box = new VoxApp.Box3DEntity();
        // box.initializeCube(100.0, [appIns.getImageTexByUrl("./assets/default.jpg")]);
        // appIns.addEntity(box);

        // this.initEnvBox();
    }
    initEnvBox(): void {

        let renderingState = this.m_rscene.getRenderProxy().renderingState;
        let rscene = this.m_rscene;
        let material = this.m_appBase.createDefaultMaterial() as IRenderMaterial;
        material.pipeTypes = [MaterialPipeType.FOG_EXP2];
        material.setMaterialPipeline(this.m_materialCtx.pipeline);
        material.setTextureList([this.m_materialCtx.getTextureByUrl("static/assets/box.jpg")]);
        material.initializeByCodeBuf(false);

        let scale: number = 3000.0;
        let entity = rscene.entityBlock.createEntity();
        entity.setRenderState(renderingState.FRONT_CULLFACE_NORMAL_STATE);
        entity.setMaterial(material);
        entity.copyMeshFrom(rscene.entityBlock.unitBox);
        entity.setScaleXYZ(scale, scale, scale);
        rscene.addEntity(entity, 1);

        // let axis = new VoxApp.Axis3DEntity();
        // axis.initialize(30);
        // axis.setXYZ(300, 0.0, 0.0);
        // appIns.addEntity(axis);

        // let box = new VoxApp.Box3DEntity();
        // box.initializeCube(100.0, [appIns.getImageTexByUrl("./assets/default.jpg")]);
        // appIns.addEntity(box);
    }
}
export default ViewerScene;