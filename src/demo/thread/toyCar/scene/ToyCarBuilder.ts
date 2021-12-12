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
        }
    }
    
    buildEntities(task: ToyCarTask): void {
        
        let texNameList: string[] = [
            "fruit_01.jpg"
            , "moss_05.jpg"
            , "metal_02.jpg"
            , "fruit_01.jpg"
            , "moss_05.jpg"
            , "metal_02.jpg"
        ];

        let asset: AssetPackage = new AssetPackage();
        asset.textures = [
            this.getImageTexByUrl("static/assets/" + texNameList[0]),
            this.getImageTexByUrl("static/assets/" + texNameList[1]),
            this.getImageTexByUrl("static/assets/" + texNameList[2])
        ];

        let entity: CarEntity = new CarEntity();
        entity.asset = asset;
        task.addEntity( entity );
        entity.build( this.m_rscene );
        
        this.m_entitiesTotal++;
    }
}
export { ToyCarBuilder }
