import RendererScene from "../../../../vox/scene/RendererScene";
import { AssetPackage } from "../base/AssetPackage";
import { CarEntity } from "../base/CarEntity";

import { ToyCarTask } from "../task/ToyCarTask";
import { CommonMaterialContext } from "../../../../materialLab/base/CommonMaterialContext";
import { TerrainData } from "../../../../terrain/tile/TerrainData";
import Vector3D from "../../../../vox/math/Vector3D";
import { BallEntity } from "../base/BallEntity";

/**
 * a 3d rectangle plane display example
 */
class ToyCarBuilder {

    constructor() { }
    private m_materialCtx: CommonMaterialContext = null;
    private m_rscene: RendererScene = null;
    private m_asset: AssetPackage = null;
    private m_terrainData: TerrainData = null;

    initialize(scene: RendererScene, materialCtx: CommonMaterialContext, terrainData: TerrainData): void {
        if (this.m_rscene == null) {
            this.m_rscene = scene;
            this.m_materialCtx = materialCtx;

            
            let texNameList: string[] = [
                "default.jpg"
                , "image_003.jpg"
                , "wood_02.jpg"
            ];

            this.m_asset = new AssetPackage();
            this.m_asset.textures = [
                this.m_materialCtx.getTextureByUrl("static/assets/" + texNameList[0]),
                this.m_materialCtx.getTextureByUrl("static/assets/" + texNameList[1]),
                this.m_materialCtx.getTextureByUrl("static/assets/" + texNameList[2])
            ];
            this.m_terrainData = terrainData;
        }
    }
    
    buildBallEntity(bodyScale: number): BallEntity {
        
        let entity: BallEntity;
        
        entity = new BallEntity();
        entity.asset = this.m_asset;
        
        entity.build( this.m_rscene, this.m_materialCtx );

        let wheelRotSpeed: number = -15.0;
        let pv: Vector3D;

        entity.navigator.initialize( this.m_terrainData );
        entity.navigator.setTarget( entity.getTransformEntity() );
        entity.navigator.autoSerachPath = true;

        let beginRC = this.m_terrainData.getRandomFreeRC();
        let endRC = this.m_terrainData.getRandomFreeRC();
        // beginRC[0] = beginRC[1] = 0;
        // endRC[0] = endRC[1] = 0;
        entity.navigator.setSearchPathParam(beginRC[0], beginRC[1], endRC[0], endRC[1]);
        pv = this.m_terrainData.getTerrainPositionByRC(beginRC[0], beginRC[1]);
        
        //  //entity.setXYZ(200, 25, 200);
        //entity.transform.setWheelRotSpeed(wheelRotSpeed);
        entity.setScale(bodyScale * (0.1 + Math.random() * 0.1));
        entity.setPosition(pv);
        if (!entity.navigator.isReadySearchPath()) {
            entity.navigator.stopAndWait();
        }
        entity.setSpeed(0.8 + Math.random() * 0.8);
        entity.navigator.stopPath();
        entity.navigator.curveMotion.directMinDis = 800.0;
        entity.navigator.autoSerachPath = true;

        return entity;
    }
    
    buildCarEntity(task: ToyCarTask, bodyScale: number): CarEntity {
        
        let entity: CarEntity;

        entity = new CarEntity();
        entity.asset = this.m_asset;
        task.addEntity( entity );
        entity.build( this.m_rscene, this.m_materialCtx );

        let wheelRotSpeed: number = -15.0;
        let pv: Vector3D;

        entity.navigator.initialize( this.m_terrainData );
        entity.navigator.setTarget( entity.transform );
        entity.navigator.autoSerachPath = true;

        let beginRC = this.m_terrainData.getRandomFreeRC();
        let endRC = this.m_terrainData.getRandomFreeRC();
        // beginRC[0] = beginRC[1] = 0;
        // endRC[0] = endRC[1] = 0;
        entity.navigator.setSearchPathParam(beginRC[0], beginRC[1], endRC[0], endRC[1]);
        pv = this.m_terrainData.getTerrainPositionByRC(beginRC[0], beginRC[1]);
        
        //  //entity.setXYZ(200, 25, 200);
        entity.transform.setWheelRotSpeed(wheelRotSpeed);
        entity.setScale(bodyScale * (0.1 + Math.random() * 0.1));
        entity.setPosition(pv);
        if (!entity.navigator.isReadySearchPath()) {
            entity.navigator.stopAndWait();
        }
        entity.setSpeed(0.8 + Math.random() * 0.8);
        entity.navigator.stopPath();
        entity.navigator.curveMotion.directMinDis = 800.0;
        entity.navigator.autoSerachPath = true;

        return entity;
    }
}
export { ToyCarBuilder }
