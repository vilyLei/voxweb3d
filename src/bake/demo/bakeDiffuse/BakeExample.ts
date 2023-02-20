
import Vector3D from "../../../vox/math/Vector3D";
import RendererDevice from "../../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";

import TextureConst from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";

import MouseEvent from "../../../vox/event/MouseEvent";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";

import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";
import BakeMaterial from "./BakeMaterial";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../../cospace/app/common/CoGeomModelLoader";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import DataMesh from "../../../vox/mesh/DataMesh";
import Matrix4 from "../../../vox/math/Matrix4";
import RendererSceneGraph from "../../../vox/scene/RendererSceneGraph";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { EntityLayouter } from "../../../vox/utils/EntityLayouter";
import IRendererSceneGraphStatus from "../../../vox/scene/IRendererSceneGraphStatus";

import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../../../orthoui/usage/ParamCtrlUI";
import RectPlaneMesh from "../../../vox/mesh/RectPlaneMesh";
import RendererState from "../../../vox/render/RendererState";
import Sphere3DMesh from "../../../vox/mesh/Sphere3DMesh";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

import PingpongBlur from "../../../renderingtoy/mcase/PingpongBlur";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import ScreenFixedAlignPlaneEntity from "../../../vox/entity/ScreenFixedAlignPlaneEntity";
import IMeshBase from "../../../vox/mesh/IMeshBase";

export class BakeExample {

    private m_rscene: IRendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp = new RenderStatusDisplay();
    private m_stageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController = new CameraZoomController();

    private m_modelLoader = new CoGeomModelLoader();
    private m_graph = new RendererSceneGraph();
    private m_layouter = new EntityLayouter();
    private m_ctrlui = new ParamCtrlUI();

    private m_sv: Vector3D = new Vector3D();
    private m_currSV = new Vector3D();
    private m_entities: DisplayEntity[] = [];

    constructor() { }

    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        // ptex.minFilter = TextureConst.NEAREST;
        // ptex.magFilter = TextureConst.NEAREST;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        return ptex;
    }

    private initSys(): void {

        // 阻止右键
        // document.oncontextmenu = function (e) {
        //     e.preventDefault();
        // }
        this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
        this.m_rscene.enableMouseEvent(true);
        this.m_cameraZoomController.initWithRScene(this.m_rscene);
        this.m_stageDragSwinger.initWithRScene(this.m_rscene);

        this.m_statusDisp.initialize();
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        this.m_rscene.addEventListener(MouseEvent.MOUSE_MIDDLE_DOWN, this, this.mouseMiddleDown);

        this.update();

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
        console.log("BakeExample::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam = this.m_graph.createRendererParam(this.createDiv(0, 0, 512, 512));
            rparam.autoSyncRenderBufferAndWindowSize = false;
            rparam.setAttriAntialias(true);
            // rparam.setAttriAlpha(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = this.m_graph.createScene(rparam, 4);
            this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);

            this.initSys();
            this.initModel();
            // this.init3DScene();
        }
    }
    private init3DScene(): void {

        this.applyTex();
        // this.buildTex();
    }
    private applyTex(): void {

        let tex = this.getTexByUrl("static/assets/sph_mapping01.png");
        tex.flipY = true;
        tex.premultiplyAlpha = true;
        let material = new Default3DMaterial();
        material.setTextureList([tex]);
        material.initializeByCodeBuf(true);
        let mesh = new Sphere3DMesh();
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(200, 20, 20, false);

        let entity = new DisplayEntity();
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        entity.setMesh(mesh);
        entity.setMaterial(material);

        this.m_rscene.addEntity(entity);
    }
    private createWithMesh(mesh: IMeshBase, dx: number, dy: number): void {

        let material0 = new BakeMaterial(0);
        material0.setTextureList([
            this.getTexByUrl("static/assets/color_02.jpg"),
            this.getTexByUrl("static/assets/fabric_01.jpg"),
        ]);
        material0.initializeByCodeBuf(true);
        material0.setOffsetXY(dx, dy);
        let entity0 = new DisplayEntity();
        entity0.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        entity0.setMesh(mesh);
        entity0.setMaterial(material0);
        this.m_rscene.addEntity(entity0);
    }
    private createLineDraw(mesh: IMeshBase): void {
        let radius = 0.002;
        let PI2 = Math.PI * 2.0;
        let total = 8;
        for (let k = 0; k < 8; ++k) {
            for (let i = 0; i < total; ++i) {
                let rad = PI2 * i / total;
                let dx = Math.cos(rad) * radius;
                let dy = Math.sin(rad) * radius;
                this.createWithMesh(mesh, dx, dy);
            }
            radius += 0.002;
        }
    }
    private buildTex(): void {

        let material = new BakeMaterial();
        material.setTextureList([
            this.getTexByUrl("static/assets/color_02.jpg"),
            this.getTexByUrl("static/assets/fabric_01.jpg"),
        ]);
        material.initializeByCodeBuf(true);

        let mesh = new Sphere3DMesh();
        mesh.wireframe = true;
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(200, 20, 20, false);

        // let mesh = new RectPlaneMesh();
        // mesh.axisFlag = 1;
        // mesh.setBufSortFormat(material.getBufSortFormat());
        // mesh.initialize(-250, -250, 500, 500);

        // let material0 = new BakeMaterial();
        // material0.setTextureList([
        //     this.getTexByUrl("static/assets/color_02.jpg"),
        //     this.getTexByUrl("static/assets/fabric_01.jpg"),
        // ]);
        // material0.initializeByCodeBuf(true);
        // material0.setOffsetXY(dx, dx);
        // let entity0 = new DisplayEntity();
        // entity0.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        // entity0.setMesh(mesh);
        // entity0.setMaterial(material0);
        // this.m_rscene.addEntity(entity0);
        let radius = 0.002;
        let PI2 = Math.PI * 2.0;
        let total = 8;
        for (let k = 0; k < 8; ++k) {
            for (let i = 0; i < total; ++i) {
                let rad = PI2 * i / total;
                let dx = Math.cos(rad) * radius;
                let dy = Math.sin(rad) * radius;
                this.createWithMesh(mesh, dx, dy);
            }
            radius += 0.002;
        }
        // let dx = 0.002;
        // let dy = 0.002;
        // for(let i = 0; i < 8; ++i ) {
        //     this.createWithMesh(mesh, -dx, -dy);
        //     this.createWithMesh(mesh, dx, dy);
        //     this.createWithMesh(mesh, dx, -dy);
        //     this.createWithMesh(mesh, -dx, dy);
        //     this.createWithMesh(mesh, -dx, dy);
        //     this.createWithMesh(mesh, dx, -dy);
        //     dx += 0.002;
        //     console.log("dx: ", dx);
        //     dy = dx;
        // }
        return;
        let mesh0 = new Sphere3DMesh();
        mesh0.setBufSortFormat(material.getBufSortFormat());
        mesh0.initialize(200, 20, 20, false);
        let material0 = new BakeMaterial();
        material0.setTextureList([
            this.getTexByUrl("static/assets/color_02.jpg"),
            this.getTexByUrl("static/assets/fabric_01.jpg"),
        ]);
        material0.initializeByCodeBuf(true);
        // material0.setOffsetXY(dx, dx);
        let entity0 = new DisplayEntity();
        entity0.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        entity0.setMesh(mesh0);
        entity0.setMaterial(material0);
        this.m_rscene.addEntity(entity0, 1);

        return;
        material = new BakeMaterial(1);
        material.setTextureList([
            this.getTexByUrl("static/assets/color_02.jpg"),
            this.getTexByUrl("static/assets/fabric_01.jpg")
        ]);
        material.initializeByCodeBuf(true);
        mesh = new Sphere3DMesh();
        mesh.wireframe = true;
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(200, 20, 20, false);


        // let mesh = new RectPlaneMesh();
        // mesh.axisFlag = 1;
        // mesh.setBufSortFormat(material.getBufSortFormat());
        // mesh.initialize(-250, -250, 500, 500);

        let entity = new DisplayEntity();
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        entity.setMesh(mesh);
        entity.setMaterial(material);

        this.m_rscene.addEntity(entity, 1);

    }
    private m_blur: PingpongBlur;// = new PingpongBlur()

    private init3DScene1(): void {

        /*
        let tex_blurSrc = this.getTexByUrl("static/assets/sph_mapping01.png");
        // tex_blurSrc.flipY = true;
        let plane = new ScreenFixedAlignPlaneEntity();
        plane.initialize(-1.0, -1.0, 2.0, 2.0, [tex_blurSrc]);
        this.m_rscene.addEntity(plane);
    
        // return;
    
        this.m_blur = new PingpongBlur(this.m_rscene);
    
        //this.m_blurModule.setSyncViewSizeEnabled(false);
        //this.m_blurModule.setFBOSize(128,128);
        this.m_blur.setBlurDensity(2.0);
        this.m_blur.bindSrcProcessId(0);
        //*/
    }
    private initUI(): void {

        let ui = this.m_ctrlui;
        ui.initialize(this.m_rscene, true);

        let ls = this.m_entities;
        let entity0 = ls[0];
        let entity1 = ls[1];
        entity0.getScaleXYZ(this.m_sv);

        console.log("initUI --------------------------------------");

        ui.addStatusItem("显示-A", "visible-a", "Yes", "No", true, (info: CtrlInfo): void => {
            entity0.setVisible(info.flag);
        });
        ui.addStatusItem("显示-B", "visible-b", "Yes", "No", true, (info: CtrlInfo): void => {
            entity1.setVisible(info.flag);
        });

        ui.addProgressItem("缩放-A", "scale", 1.0, (info: CtrlInfo): void => {
            this.m_currSV.copyFrom(this.m_sv);
            let s = info.values[0];
            console.log("xxx s: ", s);
            this.m_currSV.scaleBy(s);
            entity0.setScale3(this.m_currSV);
            entity0.update();
        });
        ui.addValueItem("Y轴移动-B", "move-b", 0, -300, 300, (info: CtrlInfo): void => {

            let pv = new Vector3D();
            entity1.getPosition(pv);
            pv.y = info.values[0];
            entity1.setPosition(pv);
            entity1.update();
        });
        ui.addValueItem("颜色-A", "color-a", 0.8, 0.0, 10, (info: CtrlInfo): void => {
            let values = info.values;
            console.log("color-a values: ", values, ", colorPick: ", info.colorPick);
            let material = entity0.getMaterial() as BakeMaterial;
            material.setRGB3f(values[0], values[1], values[2]);
        }, true);
        ui.addValueItem("颜色-B", "color-b", 0.6, 0.0, 2.0, (info: CtrlInfo): void => {
            let values = info.values;
            console.log("color-b, values: ", values, ", colorPick: ", info.colorPick);
            let material = entity1.getMaterial() as BakeMaterial;
            material.setRGB3f(values[0], values[1], values[2]);
        }, true);
        //*/
        ui.updateLayout(true);

        let node = this.m_graph.addScene(ui.ruisc);
        node.setPhase0Callback(null, (sc: IRendererScene, st: IRendererSceneGraphStatus): void => {
            /**
             * 设置摄像机转动操作的启用状态
             */
            this.m_stageDragSwinger.setEnabled(!st.rayPickFlag);
        })
    }
    private initModel(): void {
        this.m_modelLoader.setListener(
            (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat): void => {

                for (let i = 0; i < models.length; ++i) {
                    this.createEntity(models[i], transforms != null ? transforms[i] : null);
                }
            },
            (total): void => {
                console.log("loaded model all.");

                // for automatically fitting the model size in the scene
                this.m_layouter.layoutUpdate();

                // this.initUI();

            });

        let baseUrl = "static/private/";
        let url = baseUrl + "fbx/base4.fbx";
        // url = baseUrl + "fbx/hat_ok.fbx";
        url = baseUrl + "obj/apple_01.obj";
        url = baseUrl + "fbx/Mat_Ball.fbx";

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
            // let material = new BakeMaterial();
            // material.setTextureList([
            //     this.getTexByUrl("static/assets/color_02.jpg"),
            //     this.getTexByUrl("static/assets/fabric_01.jpg")
            // ]);

            let tex = this.getTexByUrl("static/assets/sph_mapping02.png");
            tex.flipY = true;
            let material = new Default3DMaterial();
            material.setTextureList([
                tex
            ]);
            material.initializeByCodeBuf(true);
            //createLineDraw

            let mesh = new DataMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setVS(vs);
            mesh.setUVS(uvs);
            mesh.setNVS(nvs);
            mesh.setIVS(ivs);
            mesh.setVtxBufRenderData(material);
            mesh.initialize();

            // this.createLineDraw(mesh);

            // return;

            let matrix4 = new Matrix4(transform);
            let entity = new DisplayEntity();
            // entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            entity.setMesh(mesh);
            entity.setMaterial(material);
            entity.getTransform().setParentMatrix(matrix4);

            this.m_rscene.addEntity(entity, 1);
            this.m_entities.push(entity);

            // for automatically fitting the model size in the scene
            this.m_layouter.layoutAppendItem(entity, matrix4);
        }
    }

    private mouseDown(evt: any): void {
    }
    private mouseMiddleDown(evt: any): void {

        console.log("mouse middle down... ...");
        /**
         * 直接同步参数数据到UI和控制对象
         */
        // let item = this.m_ctrlui.getItemByUUID("move-b");
        // item.param.value = 50;
        // item.syncEnabled = true;
        // item.updateParamToUI();
    }

    private m_timeoutId: any = -1;
    private update(): void {

        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps
        this.m_statusDisp.render();

    }
    run(): void {

        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        // this.m_rscene.update();
        // this.m_blur.run();
        this.m_graph.run();

    }
}
export default BakeExample;