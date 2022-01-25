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
import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";

declare var AppBase: any;
declare var AppLambert: any;

class ViewerScene {

    private m_appBase: IAppBase = null;
    private m_appLambert: IAppLambert = null;
    private m_rscene: IRendererScene;
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

        let material = this.createDefaultMaterial();
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
    }
    setMaterialContext(materialCtx: IMaterialContext): void {
        this.m_materialCtx = materialCtx;
        this.initEnvBox();
    }
    addLamgert(): void {
        if (this.m_appLambert == null) {
            this.m_appLambert = new AppLambert.Instance() as IAppLambert;
            this.m_appLambert.initialize(this.m_rscene);
            this.initCommonScene();
        }
    }
    private createDefaultMaterial(): IRenderMaterial {
        let material = this.m_appBase.createDefaultMaterial();
        (material as any).normalEnabled = true;
        material.setTextureList([this.m_rscene.textureBlock.createRGBATex2D(32, 32, new Color4(0.2, 0.8, 0.4))]);
        return material;
    }
    initDefaultEntities(): void {
        /*
        let rscene = this.m_rscene;
        let material = this.m_appBase.createDefaultMaterial();
        (material as any).normalEnabled = true;
        material.setTextureList( [this.m_rscene.textureBlock.createRGBATex2D(32,32,new Color4(0.2,0.8,0.4))] );

        let scale: number = 500.0;
        let boxEntity = rscene.entityBlock.createEntity();
        boxEntity.setMaterial (material );
        boxEntity.copyMeshFrom( rscene.entityBlock.unitBox );
        boxEntity.setScaleXYZ(scale, scale * 0.05, scale);
        rscene.addEntity(boxEntity);
        this.m_defaultEntities.push( boxEntity );
        //*/
    }
    preLoadLMMaps(materialCtx: IMaterialContext, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        console.log("##### preLoadLMMaps");
        materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
        materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
        }
    }
    private useLMMaps(decorator: any, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        // var xhr = new XMLHttpRequest();
        // xhr.open("GET", "static/assets/default.jpg", true);
        // xhr.responseType = "arraybuffer";
        // xhr.send( null );


        decorator.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
        decorator.specularMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            decorator.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            decorator.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            if (decorator.vertUniform != null) {
                decorator.vertUniform.displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }
        decorator.shadowReceiveEnabled = shadowReceiveEnabled;
    }
    private createLM(): IMaterial {

        let m = this.m_appLambert.createMaterial();
        let decor: any = m.getDecorator();
        let vertUniform: any = decor.vertUniform;
        m.setMaterialPipeline(this.m_materialCtx.pipeline);
        decor.envAmbientLightEnabled = true;

        vertUniform.uvTransformEnabled = true;
        this.useLMMaps(decor, "box", true, false, true);
        decor.fogEnabled = true;
        decor.lightEnabled = true;
        decor.initialize();
        vertUniform.setDisplacementParams(3.0, 0.0);
        // material.setDisplacementParams(3.0, 0.0);
        decor.setSpecularIntensity(64.0);

        let color = new Color4();
        color.normalizeRandom(1.1);
        decor.setSpecularColor(color);
        return m;
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

        if (this.m_materialCtx == null || this.m_appLambert == null || this.m_meshs.length < 1) {
            return;
        }
        if (!this.m_materialCtx.hasShaderCodeObjectWithUUID(ShaderCodeUUID.Lambert)) {
            return;
        }

        let rscene = this.m_rscene;

        this.update();
        if (this.m_defaultEntities.length > 0) {
            console.log("xxx initCommonScene()...");
            let material = this.createLM();

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