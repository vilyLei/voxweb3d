import RendererScene from "../../../../vox/scene/RendererScene";
import TextureProxy from "../../../../vox/texture/TextureProxy";
import { TextureConst } from "../../../../vox/texture/TextureConst";
import ImageTextureLoader from "../../../../vox/texture/ImageTextureLoader";
import { AssetPackage } from "../base/AssetPackage";
import { IToyEntity } from "../base/IToyEntity";
import { CarEntity } from "../base/CarEntity";

import { ToyCarTask } from "../task/ToyCarTask";

/**
 * a 3d rectangle plane display example
 */
class ToyCarBuilder {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_entitiesTotal: number = 0;
    private m_entities: CarEntity[] = [];
    private m_asset: AssetPackage = null;

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(scene: RendererScene, texLoader: ImageTextureLoader): void {
        if (this.m_rscene == null) {
            this.m_rscene = scene;
            this.m_texLoader = texLoader;

            
            let texNameList: string[] = [
                "image_003.jpg"
                , "moss_05.jpg"
                , "metal_02.jpg"
                , "fruit_01.jpg"
                , "moss_05.jpg"
            ];

            this.m_asset = new AssetPackage();
            this.m_asset.textures = [
                this.getImageTexByUrl("static/assets/" + texNameList[0]),
                this.getImageTexByUrl("static/assets/" + texNameList[2]),
                this.getImageTexByUrl("static/assets/" + texNameList[1])
            ];
        }
    }
    
    buildEntity(task: ToyCarTask): CarEntity {
        

        let entity: CarEntity;

        entity = new CarEntity();
        entity.asset = this.m_asset;
        task.addEntity( entity );
        entity.build( this.m_rscene );
        entity.setXYZ(200, 50, -200);
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
