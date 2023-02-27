
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import Box3DEntity from "../../vox/entity/Box3DEntity";
import TextureConst from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";

import { EntityLayouter } from "../../vox/utils/EntityLayouter";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../cospace/app/common/CoGeomModelLoader";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import RendererState from "../../vox/render/RendererState";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import DataMesh from "../../vox/mesh/DataMesh";
import Matrix4 from "../../vox/math/Matrix4";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";

export class ModolesLoading {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_modelLoader = new CoGeomModelLoader();
    private m_layouter = new EntityLayouter();

    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    private initSys(): void {

        this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

        new RenderStatusDisplay(this.m_rscene, true);
        new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

    }
    initialize(): void {
        console.log("ModolesLoading::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 4).setAutoRunning(true);

            this.initSys();

            // this.initObjs();
            this.initModel();
        }
    }
    private initModel(): void {
        this.m_modelLoader.setListener(
            (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat): void => {
                console.log("loaded model.");
                for (let i = 0; i < models.length; ++i) {
                    this.createEntity(models[i], transforms != null ? transforms[i] : null);
                }
            },
            (total): void => {
                console.log("loaded model all.");
                this.m_layouter.layoutUpdate();
            });

        let baseUrl: string = "static/private/";
        let url = baseUrl + "obj/base.obj";
        url = baseUrl + "obj/base4.obj";
        url = baseUrl + "fbx/base4.fbx";
        // url = baseUrl + "fbx/hat_ok.fbx";
        // url = baseUrl + "obj/apple_01.obj";
        console.log("initModel() init...");
        this.loadModels([url]);
    }
    private loadModels(urls: string[], typeNS: string = ""): void {
        this.m_modelLoader.load(urls);
    }

    protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {
        if (model != null) {
            console.log("createEntity(), model: ", model);
            let vs = model.vertices;
            let uvs = model.uvsList[0];
            let ivs = model.indices;
            let trisNumber = ivs.length / 3;

            let nvs = model.normals;
            if (nvs == null) {
                SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
            }
            let material = new Default3DMaterial();
            material.setTextureList([
                this.getTexByUrl("static/assets/effectTest/metal_01_COLOR.png")
            ]);

            material.initializeByCodeBuf(true);
            let mesh = new DataMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setVS(vs);
            mesh.setUVS(uvs);
            mesh.setNVS(nvs);
            mesh.setIVS(ivs);
            mesh.setVtxBufRenderData(material);

            mesh.initialize();

            let entity = new DisplayEntity();
            entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            entity.setMesh(mesh);
            entity.setMaterial(material);

            this.m_rscene.addEntity(entity);
            this.m_layouter.layoutAppendItem(entity, new Matrix4(transform));
        }
    }

    private mouseDown(evt: any): void {
        console.log("mouse down.");
    }
    
}
export default ModolesLoading;