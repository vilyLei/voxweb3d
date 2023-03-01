
import RendererDevice from "../../../vox/render/RendererDevice";
import RendererParam from "../../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";

import MouseEvent from "../../../vox/event/MouseEvent";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../../vox/view/CameraTrack";
import RendererScene from "../../../vox/scene/RendererScene";
import ProfileInstance from "../../../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";

import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";

import BinaryLoader from "../../../vox/assets/BinaryLoader";

import PBREnvLightingMaterial from "../../../pbr/material/PBREnvLightingMaterial";
import PBRBakingMaterial from "./PBRBakingMaterial";
import { IFloatCubeTexture } from "../../../vox/render/texture/IFloatCubeTexture";
import TextureConst from "../../../vox/texture/TextureConst";
import IMeshBase from "../../../vox/mesh/IMeshBase";
import Sphere3DMesh from "../../../vox/mesh/Sphere3DMesh";
import RendererState from "../../../vox/render/RendererState";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../../cospace/app/common/CoGeomModelLoader";
import { EntityLayouter } from "../../../vox/utils/EntityLayouter";
import DataMesh from "../../../vox/mesh/DataMesh";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import Matrix4 from "../../../vox/math/Matrix4";
import MaterialBase from "../../../vox/material/MaterialBase";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { BinaryTextureLoader } from "../../../cospace/modules/loaders/BinaryTextureLoader";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { FileIO } from "../../../app/slickRoad/io/FileIO";
import { HttpFileLoader } from "../../../cospace/modules/loaders/HttpFileLoader";
import { ModelData, ModelDataLoader } from "./ModelDataLoader";
import { BakedViewer } from "./BakedViewer";

type ImgData = {imgData: Uint8Array, imgWidth: number, imgHeight: number, progress: number};
class BakeTask {
    // 部件相关信息
    uuid: string;
    //loadCall: () => void;
    constructor(){}
    /**
     * 由前端调用此函数
     * @param param 前端设置进来的 uv 数据
     * @param bakeStatusCall 由引擎内部调用的回调函数，以便通知前端一个烘焙任务的进项情况。函数形参status 的值为1，表示当前烘焙完成
     */
    bake(param: {uvData: Float32Array}, bakeStatusCall: (status: number, imgData?: ImgData) => void): void {
        
    }
}
// 在d4中会创建实例，由前端直接使用
type BakeParam = {quality: number, width: number, height: number};
class Baker {
    constructor(){}
    startup(param: BakeParam ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (true) {
                resolve(true);
            } else {
                reject(false);
            }
        });
    }
    /**
     * @returns 返回部烘焙任务总数
     */
    getBakeTaskTotal(): number {
        return 1;
    }
    /**
     * @returns 返回给前端新的烘焙任务
     */
    getBakeTask(): BakeTask {
        return null;
    }
    /**
     * @returns 返回给前端新的烘焙任务
     */
    getBakeTasks(): BakeTask[] {
        return null;
    }
    /**
     * 告诉整体烘焙工作是否完成
     * @returns 
     */
    isFinish(): boolean {
        return false;
    }
}

export class BakeFlow {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materials: PBREnvLightingMaterial[] = [];
    private m_texMaterials: PBRBakingMaterial[] = [];
    private m_modelLoader = new CoGeomModelLoader();
    private m_layouter = new EntityLayouter();

    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
    }

    private createDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {
        let div: HTMLDivElement = document.createElement('div');
        div.style.width = pw + 'px';
        div.style.height = ph + 'px';
        document.body.appendChild(div);
        div.style.display = 'bolck';
        div.style.left = px + 'px';
        div.style.top = py + 'px';
        div.style.position = 'absolute';
        div.style.display = 'bolck';
        div.style.position = 'absolute';
        return div;
    }
    initialize(): void {
        console.log("BakeFlow::initialize()......");

        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            RendererDevice.SetWebBodyColor("white");
            // let rparam = this.m_graph.createRendererParam(this.createDiv(0, 0, 512, 512));
            // rparam.autoSyncRenderBufferAndWindowSize = false;
            let rparam = new RendererParam(this.createDiv(0, 0, 512, 512));
            rparam.autoSyncRenderBufferAndWindowSize = false;
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            rparam.setAttriAntialias(true);
            //rparam.setAttriStencil(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            // this.m_rscene.setClearRGBColor3f(1.0, 1.0, 1.0);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.initModel();

            this.update();

        }
    }
    private m_uvData: Float32Array = null;
    private m_bakedViewer: BakedViewer = null;

    private initModel(): void {

        this.m_bakedViewer = new BakedViewer(this.m_rscene, this.m_texLoader);

        let modelLoader = new ModelDataLoader();
        modelLoader.setListener((modelData: ModelData, uv2ModelData: ModelData, uvData: Float32Array): void => {

            console.log("loaded model all in main.");
            let vtxTotal = modelData.models[0].vertices.length / 3;
            console.log("vtxTotal: ", vtxTotal);
            // console.log("modelData: ", modelData);
            // console.log("uv2ModelData: ", uv2ModelData);
            console.log("uvsList[0].length: ", modelData.models[0].uvsList[0].length);
            console.log("uvData.length: ", uvData.length);
            let models = modelData.models;
            let transforms = modelData.transforms;
            this.m_uvData = uvData;
            for (let i = 0; i < models.length; ++i) {
                if (uv2ModelData != null) {
                    models[i].uvsList.push(uv2ModelData.models[i].uvsList[0]);
                } else if (uvData != null) {
                    models[i].uvsList.push(uvData);
                }
                this.createEntity(models[i], transforms != null ? transforms[i] : null, { su: 1.0, sv: 1.0 });
            }
            this.updateEntities();

        });
        let modelUrl = "static/private/fbx/icoSph_1.fbx";
        let uv2ModelUrl = "static/private/fbx/icoSph_1_unwrap.fbx";
        let uvDataUrl = "static/private/fbx/uvData1.uv";

        modelUrl = this.m_modelUrl;
        uv2ModelUrl = this.m_uv2ModelUrl;
        uvDataUrl = this.m_uvDataUrl;
        modelLoader.loadData(modelUrl, uv2ModelUrl, uvDataUrl);
    }
    private m_modelIndex = 0;
    private m_vtxRIndex = 0;
    private m_vtxRCount = -1;
    private m_offsetR = 0.0001;
    private m_drawTimes = 1;
    private m_circleTimes = 1;
    // private m_modelUrl = "static/private/fbx/hat01_0.fbx";
    // private m_modelUrl = "static/private/fbx/hat01_0.obj";
    // private m_modelUrl = "static/private/fbx/hat01_0.fbx";
    // private m_modelUrl = "static/private/fbx/hat01_1.fbx";
    private m_modelUrl = "static/private/ctm/6.ctm";
    // private m_uv2ModelUrl = "static/private/fbx/hat01_0_unwrap.fbx";
    private m_uv2ModelUrl = "";
    // private m_uvDataUrl = "static/private/fbx/uvData1.uv";
    // private m_uvDataUrl = "static/private/fbx/hat01_1.uv2";
    private m_uvDataUrl = "static/private/ctm/6.uv2";
    protected createEntity(model: CoGeomDataType, transform: Float32Array = null, uvParam: { su: number, sv: number }): void {

        if (model != null) {
            console.log("createEntity(), this.m_modelIndex: ", this.m_modelIndex);
            console.log("createEntity(), model: ", model);

            // let fio = new FileIO();
            // fio.downloadBinFile(model.uvsList[0], "uvData1","uv");

            this.m_offsetR = 0.004;
            // let uvOffset = { su: 1.0, sv: 1.0 };
            let uvOffset = { su: 0.01, sv: 0.01 };

            let bakedTexUrl = "static/private/bake/icoSph_1.png";
            bakedTexUrl = "static/private/bake/hat01_0.png";
            // bakedTexUrl = "static/private/bake/hat01_1.png";
            bakedTexUrl = "static/private/bake/hat01_0a.png";
            bakedTexUrl = "static/private/bake/hat01_1a.png";

            this.initTexLightingBakeWithModel(2, model, transform, uvOffset, bakedTexUrl);
        }
    }
    private initTexLightingBakeWithModel(bakeType: number, model: CoGeomDataType, transform: Float32Array, uvParam: { su: number, sv: number }, bakedTexUrl: string): void {

        let vs = model.vertices;
        let ivs = model.indices;
        let vtCount = vs.length / 3;
        let trisNumber = ivs.length / 3;
        console.log("ivs.length: ", ivs.length);
        console.log("trisNumber: ", trisNumber, ", vtCount: ", vtCount);

        let nvs = model.normals;
        if (nvs == null) {
            SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
        }
        let uvs = model.uvsList;
        uvs[1] = uvs[0];
        console.log("#### uvs[0].length: ", uvs[0].length);
        if (uvs.length > 1) console.log("#### uvs[1].length: ", uvs[1].length);
        if (bakeType < 0) {
            let entity = this.m_bakedViewer.createEntity(model, bakedTexUrl);
            let mat4 = transform != null ? new Matrix4(transform) : null;
            this.m_layouter.layoutAppendItem(entity, mat4);
            return;
        }

        let material: MaterialBase;
        let bake = bakeType > 0;
        let roughness = 0.0;
        let metallic = 0.0;
        let mat4 = new Matrix4(transform);

        let nameList: string[] = ["gold", "rusted_iron", "grass", "plastic", "wall"];
        let nameI = 3;
        metallic = 0.5;
        roughness = 0.4;

        let materialPbr = this.makeTexMaterial(metallic, roughness, 1.0);
        materialPbr.setScaleUV(uvParam.su, uvParam.sv);
        materialPbr.bake = bake;
        materialPbr.setTextureList(this.getTexList(nameList[nameI]));
        materialPbr.initializeByCodeBuf(true);
        if (bakeType >= 0) {
            material = materialPbr;
        }
        console.log("xxxxx bake: ", bake);
        if (bake && bakeType != 3) {
            // this.createLineDrawWithModel(materialPbr, model, bake, metallic, roughness, nameList[nameI]);
            // return;
        }
        // console.log("OOOOOO material: ", material);

        let mesh = new DataMesh();
        // mesh.wireframe  = true;
        mesh.vbWholeDataEnabled = false;
        mesh.setVS(model.vertices);
        mesh.setUVS(model.uvsList[0]);
        mesh.setUVS2(model.uvsList[1]);
        mesh.setNVS(model.normals);
        mesh.setIVS(model.indices);
        mesh.setVtxBufRenderData(material);
        mesh.initialize();
        console.log("mesh.vtxTotal: ", mesh.vtxTotal)

        let entity = new DisplayEntity();
        if (bakeType == 2) entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        entity.setMaterial(material);
        entity.setMesh(mesh);

        if (this.m_vtxRCount >= 0) entity.setIvsParam(this.m_vtxRIndex, this.m_vtxRCount);
        let visible = bakeType == 0 || bakeType == 2 || bakeType == -1 || bakeType == 3;
        entity.setVisible(visible);
        entity.update();
        console.log("xxxx visible: ", visible, mat4);
        // if(visible)
        this.m_rscene.addEntity(entity, 1);
        // for automatically fitting the model size in the scene
        this.m_layouter.layoutAppendItem(entity, mat4);
        //*/
    }
    private createLineDrawWithModel(material: PBRBakingMaterial, model: CoGeomDataType, bake: boolean, metallic: number, roughness: number, texName: string): void {

        // let material = this.makeTexMaterial(metallic, roughness, 1.0);
        material = material.clone();
        material.bake = bake;
        // material.setTextureList(this.getTexList(texName));
        material.initializeByCodeBuf(true);

        let mesh = new DataMesh();
        mesh.wireframe = true;
        mesh.vbWholeDataEnabled = false;
        mesh.setVS(model.vertices);
        mesh.setUVS(model.uvsList[0]);
        mesh.setUVS2(model.uvsList[1]);
        mesh.setNVS(model.normals);
        mesh.setIVS(model.indices);
        mesh.setVtxBufRenderData(material);
        mesh.initialize();

        let radius = this.m_offsetR;
        let PI2 = Math.PI * 2.0;

        let total = this.m_circleTimes;
        let stage = this.m_rscene.getStage3D();
        let ratio = stage.stageHeight / stage.stageWidth;
        console.log("xxxxx ratio: ", ratio);
        console.log("xxxxx model: ", model);
        for (let k = 0; k < this.m_drawTimes; ++k) {
            for (let i = 0; i < total; ++i) {
                let rad = PI2 * i / total;
                let dx = Math.cos(rad) * radius * ratio;
                let dy = Math.sin(rad) * radius;
                this.createWithMesh(material, bake, mesh, metallic, roughness, texName, dx, dy);
            }
            radius += this.m_offsetR;
        }
    }
    private m_wirees: ITransformEntity[] = [];
    private createWithMesh(material: PBRBakingMaterial, bake: boolean, mesh: IMeshBase, metallic: number, roughness: number, texName: string, dx: number, dy: number): void {

        // let material = this.makeTexMaterial(metallic, roughness, 1.0);
        material = material.clone();
        material.bake = bake;
        // material.setTextureList(this.getTexList(texName));
        material.initializeByCodeBuf(true);

        material.setOffsetXY(dx, dy);
        let entity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        // console.log("createWithMesh(), mesh: ", mesh);
        if (this.m_vtxRCount >= 0) entity.setIvsParam(this.m_vtxRIndex, this.m_vtxRCount);
        this.m_wirees.push(entity);
        this.m_rscene.addEntity(entity, 0);
    }

    private updateEntities(): void {

        this.m_layouter.layoutUpdate();
        // for automatically fitting the model size in the scene
        let entities = this.m_layouter.getEntities();
        // console.log("xxxxx entities: ", entities);
        if (entities != null && entities.length > 0) {
            let entity = entities[0];
            let sv = entity.getScaleXYZ();
            let pv = entity.getPosition();
            // console.log("xxxxx sv: ", sv);
            // console.log("xxxxx pv: ", pv);
            // console.log("xxxxx this.m_wirees: ", this.m_wirees);
            for (let i = 0; i < this.m_wirees.length; ++i) {
                this.m_wirees[i].setPosition(pv);
                this.m_wirees[i].setScale3(sv);
                this.m_wirees[i].update();
            }
        }

    }
    private getTexList(name: string = "rusted_iron"): TextureProxy[] {
        let list: TextureProxy[] = [

            // this.getTexByUrl("static/assets/pbr/" + name + "/albedo.png"),
            this.getTexByUrl("static/assets/box.jpg"),
            this.getTexByUrl("static/assets/pbr/" + name + "/normal.png"),
            this.getTexByUrl("static/assets/pbr/" + name + "/metallic.png"),
            this.getTexByUrl("static/assets/pbr/" + name + "/roughness.png"),
            this.getTexByUrl("static/assets/pbr/" + name + "/ao.png"),
        ];
        return list;
    }

    private makeTexMaterial(metallic: number, roughness: number, ao: number): PBRBakingMaterial {
        let dis: number = 700.0;
        let disZ: number = 400.0;
        let posList: Vector3D[] = [
            new Vector3D(-dis, dis, disZ),
            new Vector3D(dis, dis, disZ),
            new Vector3D(-dis, -dis, disZ),
            new Vector3D(dis, -dis, disZ)
        ];
        let colorList: Color4[] = [
            new Color4(300, 100, 10),
            new Color4(90, 200, 290),
            new Color4(150, 200, 160),
            new Color4(200, 200, 270)
        ];
        let material = new PBRBakingMaterial();
        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);

        this.m_texMaterials.push(material);

        for (let i: number = 0; i < 4; ++i) {
            let pos: Vector3D = posList[i];
            material.setPosAt(i, pos.x, pos.y, pos.z);
            let color: Color4 = colorList[i];
            material.setColorAt(i, color.r, color.g, color.b);
        }
        material.setColor(Math.random(), Math.random(), Math.random());
        return material;
    }
    private mouseDown(evt: any): void {
        // console.log("mouse down... ...");
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
    }

    run(): void {

        if (this.m_rscene != null) {

            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

            this.m_rscene.run(true);

        }
    }
}
export default BakeFlow;