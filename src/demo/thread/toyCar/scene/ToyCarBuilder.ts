import RendererScene from "../../../../vox/scene/RendererScene";
import { AssetPackage } from "../base/AssetPackage";
import { IToyEntity } from "../base/IToyEntity";
import { CarEntity } from "../base/CarEntity";

import { ToyCarTask } from "../task/ToyCarTask";
import { CommonMaterialContext } from "../../../../materialLab/base/CommonMaterialContext";

/**
 * a 3d rectangle plane display example
 */
class ToyCarBuilder {

    constructor() { }
    private m_materialCtx: CommonMaterialContext = null;
    private m_rscene: RendererScene = null;
    private m_entitiesTotal: number = 0;
    private m_entities: CarEntity[] = [];
    private m_asset: AssetPackage = null;

    initialize(scene: RendererScene, materialCtx: CommonMaterialContext): void {
        if (this.m_rscene == null) {
            this.m_rscene = scene;
            this.m_materialCtx = materialCtx;

            
            let texNameList: string[] = [
                "default.jpg"
                , "moss_05.jpg"
                , "image_003.jpg"
                , "fruit_01.jpg"
                , "moss_05.jpg"
            ];

            this.m_asset = new AssetPackage();
            this.m_asset.textures = [
                this.m_materialCtx.getTextureByUrl("static/assets/" + texNameList[0]),
                this.m_materialCtx.getTextureByUrl("static/assets/" + texNameList[2]),
                this.m_materialCtx.getTextureByUrl("static/assets/" + texNameList[1])
            ];
        }
    }
    
    buildEntity(task: ToyCarTask): CarEntity {
        

        let entity: CarEntity;

        entity = new CarEntity();
        entity.asset = this.m_asset;
        task.addEntity( entity );
        entity.build( this.m_rscene, this.m_materialCtx );
        this.m_entities.push(entity);

        // entity = new CarEntity();
        // entity.path.setSearchPathParam(4,0, 0,4);
        // entity.asset = asset;
        // task.addEntity( entity );
        // entity.build( this.m_rscene );
        // entity.setPosXYZ(200, 50, 200);
        // this.m_entities.push(entity);
        
        this.m_entitiesTotal++;
        return entity;
    }
    getEntities(): CarEntity[] {
        return this.m_entities;
    }
    run(): void {
        for(let i: number = 0; i < this.m_entities.length; ++i) {
            this.m_entities[i].run();
        }
    }
}
export { ToyCarBuilder }
