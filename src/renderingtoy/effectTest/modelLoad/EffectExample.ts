
import Vector3D from "../../../vox/math/Vector3D";
import RendererDevice from "../../../vox/render/RendererDevice";
import RendererParam from "../../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";

import Box3DEntity from "../../../vox/entity/Box3DEntity";
import TextureConst from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";

import MouseEvent from "../../../vox/event/MouseEvent";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import RendererScene from "../../../vox/scene/RendererScene";

import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";
import EffectMaterial from "./EffectMaterial";
import { EntityLayouter } from "../../../vox/utils/EntityLayouter";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../../cospace/app/common/CoGeomModelLoader";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import RendererState from "../../../vox/render/RendererState";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import DataMesh from "../../../vox/mesh/DataMesh";
import Matrix4 from "../../../vox/math/Matrix4";
import OrientationType from "../../../vox/math/OrientationType";

export class EffectExample {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp = new RenderStatusDisplay();
    private m_stageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController = new CameraZoomController();

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
        this.m_rscene.enableMouseEvent(true);
        this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
        this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
        this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

        this.m_statusDisp.initialize();
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

        this.update();

    }
    initialize(): void {
        console.log("EffectExample::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 4);

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
            let material = this.m_material = new EffectMaterial();
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

            let mat4 = new Matrix4(transform);
            // let vlist = mat4.decompose(OrientationType.EULER_ANGLES);

            let entity = new DisplayEntity();
            entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            entity.setRenderState(RendererState.NONE_TRANSPARENT_STATE);
            entity.setMesh(mesh);
            entity.setMaterial(material);

            // entity.setPosition(vlist[0]);
            // entity.setRotation3(vlist[1])
            // entity.setScale3(vlist[2]);

            this.m_rscene.addEntity(entity);
            this.m_layouter.layoutAppendItem(entity, mat4);
        }
    }

    private m_material: EffectMaterial = null;
    private initObjs(): void {

        let material = this.m_material = new EffectMaterial();
        material.setTextureList([
            this.getTexByUrl("static/assets/effectTest/metal_01_COLOR.png")
        ]);

        let box = new Box3DEntity();
        box.setMaterial(material);

        box.initializeCube(100.0);
        box.setScaleXYZ(2.0, 2.0, 2.0);
        //  box.setXYZ(0.0, 0.0, 0.0);
        this.m_rscene.addEntity(box);
    }
    private m_flag = false;
    private mouseDown(evt: any): void {
        console.log("mouse down.");
        this.m_flag = !this.m_flag;
        if (!this.m_flag) {
            this.m_time = 0;
        }
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps

        this.m_statusDisp.render();

    }
    private m_time = 0.0;
    run(): void {

        if (this.m_flag) {
            this.m_time += 0.01;
            this.m_material.setRGB3f(1.0, Math.abs(this.m_time), 1.0);
        }
        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_rscene.run(true);

    }
}
export default EffectExample;