import DisplayEntity from "../../../vox/entity/DisplayEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import PBRBakingMaterial from "./PBRBakingMaterial";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../../cospace/app/common/CoGeomModelLoader";
import { EntityLayouter } from "../../../vox/utils/EntityLayouter";
import DataMesh from "../../../vox/mesh/DataMesh";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import MaterialBase from "../../../vox/material/MaterialBase";
import IRendererScene from "../../../vox/scene/IRendererScene";

class BakedViewer {

    private m_rscene: IRendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_layouter = new EntityLayouter();

    constructor(scene: IRendererScene, texLoader: ImageTextureLoader) {
        this.m_rscene = scene;
        this.m_texLoader = texLoader;
    }

    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
    }

    //layouter = new EntityLayouter

    createEntity(model: CoGeomDataType, texUrl: string): DisplayEntity {

        let vs = model.vertices;
        let ivs = model.indices;
        let trisNumber = ivs.length / 3;

        let nvs = model.normals;
        if (nvs == null) {
            SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
        }
        let material: MaterialBase;
        if (model.uvsList.length > 1) model.uvsList[0] = model.uvsList[1];
        // let tex = this.getTexByUrl("static/private/bake/icoSph_0.png");
        // let tex = this.getTexByUrl("static/private/bake/icoSph_1.png");
        let tex = this.getTexByUrl(texUrl);
        // let tex = this.getTexByUrl("static/private/bake/sph_mapping02b.png");
        tex.flipY = true;
        let materialShow = new Default3DMaterial();
        materialShow.setTextureList([tex]);
        materialShow.initializeByCodeBuf(true);
        material = materialShow;


        let mesh = new DataMesh();
        mesh.vbWholeDataEnabled = false;
        mesh.setVS(model.vertices);
        mesh.setUVS(model.uvsList[0]);
        mesh.setUVS2(model.uvsList[1]);
        mesh.setNVS(model.normals);
        mesh.setIVS(model.indices);
        mesh.setVtxBufRenderData(material);
        mesh.initialize();

        let entity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);

        this.m_rscene.addEntity(entity, 1);
        return entity;
    }
}
export { BakedViewer };