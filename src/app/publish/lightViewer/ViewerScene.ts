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

declare var AppBase: any;

class ViewerScene {

    private m_voxAppBase: IAppBase = null;
    private m_rscene: IRendererScene;
    private m_materialCtx: IMaterialContext;
    private m_defaultEntities: IRenderEntity[] = [];
    private m_entities: IRenderEntity[] = [];
    constructor() { }

    initialize(voxAppBase: IAppBase, rscene: IRendererScene): void {
        this.m_voxAppBase = voxAppBase;
        this.m_rscene = rscene;
    }
    setMaterialContext(materialCtx: IMaterialContext): void  {
        this.m_materialCtx = materialCtx;
    }
    initDefaultEntities(): void {
        let rscene = this.m_rscene;
        let material = this.m_voxAppBase.createDefaultMaterial();
        (material as any).normalEnabled = true;
        material.setTextureList( [this.m_rscene.textureBlock.createRGBATex2D(32,32,new Color4(0.2,0.8,0.4))] );

        let scale: number = 500.0;
        let boxEntity = rscene.entityBlock.createEntity();
        boxEntity.setMaterial (material );
        boxEntity.copyMeshFrom( rscene.entityBlock.unitBox );
        boxEntity.setScaleXYZ(scale, scale * 0.05, scale);
        rscene.addEntity(boxEntity);
        this.m_defaultEntities.push( boxEntity );
    }

    private useLMMaps(decorator: any, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

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

        let m = this.m_voxAppBase.createLambertMaterial();
        let decor: any = m.getDecorator();
        let vertUniform: any = decor.vertUniform;
        m.setMaterialPipeline( this.m_materialCtx.pipeline );
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
        for(let i: number = 0; i < this.m_entities.length;++i) {
            
            if(this.m_entities[i].isInRendererProcess()) {
                const et = this.m_defaultEntities[i];
                rscene.removeEntity(et);
                this.m_defaultEntities.splice(i,1);
                this.m_entities.splice(i,1);
            }
        }
        if(this.m_defaultEntities.length > 0) {
            this.m_timeoutId = setTimeout(this.update.bind(this), 20);// 20 fps
        }
    }
    initCommonScene(): void {

        let rscene = this.m_rscene;

        this.update();

        let material = this.createLM();

        let scale: number = 500.0;
        let boxEntity = rscene.entityBlock.createEntity();
        boxEntity.setMaterial(material);
        boxEntity.copyMeshFrom(rscene.entityBlock.unitBox);
        boxEntity.setScaleXYZ(scale, scale * 0.05, scale);
        rscene.addEntity(boxEntity);
        this.m_entities.push( boxEntity );

        // let axis = new VoxApp.Axis3DEntity();
        // axis.initialize(30);
        // axis.setXYZ(300, 0.0, 0.0);
        // appIns.addEntity(axis);

        // let box = new VoxApp.Box3DEntity();
        // box.initializeCube(100.0, [appIns.getImageTexByUrl("./assets/default.jpg")]);
        // appIns.addEntity(box);

        this.initEnvBox();
    }
    private initEnvBox(): void {

        let renderingState = this.m_rscene.getRenderProxy().renderingState;
        let rscene = this.m_rscene;
        let material = this.m_voxAppBase.createDefaultMaterial() as IRenderMaterial;
        material.pipeTypes = [MaterialPipeType.FOG_EXP2];
        material.setMaterialPipeline( this.m_materialCtx.pipeline );
        material.setTextureList([this.m_materialCtx.getTextureByUrl("static/assets/box.jpg")]);
        material.initializeByCodeBuf(false);

        let scale: number = 3000.0;
        let entity = rscene.entityBlock.createEntity();
        entity.setRenderState(renderingState.FRONT_CULLFACE_NORMAL_STATE);
        entity.setMaterial(material);
        entity.copyMeshFrom(rscene.entityBlock.unitBox);
        entity.setScaleXYZ(scale, scale, scale);
        rscene.addEntity(entity);

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