
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";

import { EntityLayouter } from "../../vox/utils/EntityLayouter";
import { CoGeomDataType, CoModelTeamLoader } from "../../cospace/app/common/CoModelTeamLoader";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import RendererState from "../../vox/render/RendererState";
import Matrix4 from "../../vox/math/Matrix4";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import MeshFactory from "../../vox/mesh/MeshFactory";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

export class ModelsLoading {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_teamLoader = new CoModelTeamLoader();
    private m_layouter = new EntityLayouter();

    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    private initSys(): void {

        this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

        new RenderStatusDisplay(this.m_rscene, true);
        new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

    }
    initialize(): void {
        console.log("ModelsLoading::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam = new RendererParam();
            rparam.setCamPosition(1200.0, 1200.0, 1200.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam).setAutoRunning(true);

            this.initSys();

            this.initModels1();
        }
    }
    private initModels1(): void {
        //let vsUrl = "static/private/bake/oldIndexUnwrap/vertex.bin";
        let url0 = "static/assets/fbx/base4.fbx";
        let url1 = "static/private/bake/oldIndexUnwrap/6.ctm";
        // let url2 = "static/private/bake/ios01/ios01_unwrap.fbx";
        // let url2 = "static/private/bake/cyl01/cly01.ctm";
        let url2 = "static/private/bake/hat_a_01/model.ctm";
        let url3 = "static/private/bake/hat_a_02/model.ctm";
        let loader = this.m_teamLoader;
		url2 = "static/private/bake/box1/e8cfa2ddcccd955327d8e7f24f0f0438.ctm";
        loader.load([url2], (models: CoGeomDataType[], transforms: Float32Array[]): void => {

            this.m_layouter.layoutReset();
            for (let i = 0; i < models.length; ++i) {
                this.createEntity(models[i], transforms != null ? transforms[i] : null, 1.0);
            }
            this.m_layouter.layoutUpdate(300);

        });
    }
    private initModels2(): void {
        //let vsUrl = "static/private/bake/oldIndexUnwrap/vertex.bin";
        let url0 = "static/assets/fbx/base4.fbx";
        let url1 = "static/private/bake/oldIndexUnwrap/6.ctm";
        // let url2 = "static/private/bake/ios01/ios01_unwrap.fbx";
        // let url2 = "static/private/bake/cyl01/cly01.ctm";
        let url2 = "static/private/bake/hat_a_01/model.ctm";
        let url3 = "static/private/bake/hat_a_02/model.ctm";
        let loader = this.m_teamLoader;

        loader.load([url2, url3], (models: CoGeomDataType[], transforms: Float32Array[]): void => {

            this.m_layouter.layoutReset();
            for (let i = 0; i < models.length; ++i) {
                this.createEntity(models[i], transforms != null ? transforms[i] : null, 1.0);
            }
            this.m_layouter.layoutUpdate(300, new Vector3D(-400, 0, 0));

        });
    }
    private initModels(): void {

        let url0 = "static/assets/fbx/base4.fbx";
        let url1 = "static/assets/obj/apple_01.obj";
        let url2 = "static/assets/fbx/hat_ok.fbx";
        let url3 = "static/assets/ctm/hand.ctm";

        let loader = this.m_teamLoader;

        loader.load([url0, url2], (models: CoGeomDataType[], transforms: Float32Array[]): void => {

            this.m_layouter.layoutReset();
            for (let i = 0; i < models.length; ++i) {
                this.createEntity(models[i], transforms != null ? transforms[i] : null, 0.05);
            }
            this.m_layouter.layoutUpdate(300, new Vector3D(-400, 0, 0));

        });

        url1 = "static/private/bake/hat01_0_unwrap.ctm";
        url2 = "static/private/bake/hat01_1_unwrap.ctm";

        loader.load([url1, url2], (models: CoGeomDataType[], transforms: Float32Array[]): void => {

            this.m_layouter.layoutReset();
            for (let i = 0; i < models.length; ++i) {
                this.createEntity(models[i], transforms != null ? transforms[i] : null);
            }
            this.m_layouter.layoutUpdate(300, new Vector3D(300, 0, 0));
        });


        loader.load([url3], (models: CoGeomDataType[], transforms: Float32Array[]): void => {

            this.m_layouter.layoutReset();
            for (let i = 0; i < models.length; ++i) {
                this.createEntity(models[i], transforms != null ? transforms[i] : null);
            }
            this.m_layouter.layoutUpdate(300, new Vector3D(0, 0, 300));
        });
    }

    protected createEntity(model: CoGeomDataType, transform: Float32Array = null, uvScale: number = 1.0): DisplayEntity {
        if (model != null) {
            console.log("createEntity(), model: ", model);

            // let fio = new FileIO();

			// fio.downloadBinFile(model.vertices, "vs","bin");
			// fio.downloadBinFile(model.normals, "nvs","bin");
			// fio.downloadBinFile(model.uvsList[0], "uvs1","bin");
			// fio.downloadBinFile(model.indices, "ivs","bin");

			// fio.downloadBinFile(model.uvsList[0], "uvs2","bin");

			let tex = this.getTexByUrl("static/assets/box.jpg");
			tex.flipY = true;

            let material = new Default3DMaterial();
            material.normalEnabled = true;
            material.setUVScale(uvScale, uvScale);
            material.setTextureList([
                // this.getTexByUrl("static/assets/effectTest/metal_01_COLOR.png")
                tex
            ]);

            let mesh = MeshFactory.createDataMeshFromModel(model, material);
            let entity = new DisplayEntity();
            entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            entity.setMesh(mesh);
            entity.setMaterial(material);

            this.m_rscene.addEntity(entity);
            this.m_layouter.layoutAppendItem(entity, new Matrix4(transform));
            return entity;
        }
    }

    private mouseDown(evt: any): void {
        console.log("mouse down.");
    }

}
export default ModelsLoading;
