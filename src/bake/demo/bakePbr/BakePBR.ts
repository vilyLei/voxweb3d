
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

export class BakePBR {
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
    private fract(f: number): number {
        return f - Math.floor(f);
    }
    // private clamp(x: number, minVal: number, maxVal: number): number {
    //     return Math.min(Math.max(x, minVal), maxVal);
    // }
    private calcValue(px: number): number {

        if (px > 1.0) {
            let t = this.fract(px);
            px = t > 0.0 ? t : 1.0;
        } else if (px < 0.0) {
            px = Math.abs(px);
            if (px > 1.0) {
                let t = this.fract(px);
                px = t > 0.0 ? t : 1.0;
            }
            px = 1.0 - px;
        }
        return px;
    }
    private getUV(uv: { x: number, y: number }): { x: number, y: number } {
        let px = this.calcValue(uv.x);
        let py = this.calcValue(uv.y);
        let obj: { x: number, y: number } = { x: px, y: py };
        console.log("in: ", uv, ", out: ", obj);
        return obj;
    }
    private getUVSpec(uv: { x: number, y: number }): { x: number, y: number } {
        let px = this.calcValue(uv.x * 0.0166666675);
        let py = this.calcValue(uv.y * 0.0166666675);
        let obj: { x: number, y: number } = { x: px, y: py };
        console.log("in: ", uv, ", out: ", obj);
        return obj;
    }
    initialize(): void {
        console.log("BakePBR::initialize()......");

        // this.getUV({x: 0.0, y: 1.0});
        // this.getUV({x: 0.0, y: 11.0});
        // this.getUV({x: 0.4, y: 11.9});
        // this.getUV({x: -0.0, y: -1.0});
        // this.getUV({x: -10.2, y: -19.0});
        //263.29400634765625, 747.8200073242188
        // this.getUVSpec({x: 263.29400634765625, y: 747.8200073242188});
        // return;
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            RendererDevice.SetWebBodyColor("white");
            // let rparam = this.m_graph.createRendererParam(this.createDiv(0, 0, 512, 512));
            // rparam.autoSyncRenderBufferAndWindowSize = false;
            let rparam: RendererParam = new RendererParam(this.createDiv(0, 0, 1024, 1024));
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


            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(500.0);
            // this.m_rscene.addEntity(axis);

            // add common 3d display entity
            //  let plane: Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getTexByUrl("static/assets/broken_iron.jpg")]);
            //  this.m_rscene.addEntity(plane);

            // this.initFloatCube();

            // this.initTexLighting();
            // this.applyTex();
            // this.initTexLightingBake(false);

            this.initModel();

            this.update();

        }
    }
    private m_uvData: Float32Array = null;
    private initModel(): void {
        let baseUrl = "static/private/";
        let url = baseUrl + "fbx/uvData.uv";
        url = baseUrl + "fbx/uvData1.uv";
        let loader = new HttpFileLoader();
        loader.load(url, (buf: ArrayBuffer, url: string): void => {
            let uvData = new Float32Array(buf);
            // console.log("uvData: ", uvData);
            this.m_uvData = uvData;
            this.initModelLoad();
        })
    }
    private initModelLoad(): void {
        this.m_modelLoader.setListener(
            (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat): void => {

                for (let i = 0; i < models.length; ++i) {
                    this.createEntity(models[i], transforms != null ? transforms[i] : null);
                }
            },
            (total): void => {
                console.log("loaded model all.");

                this.m_layouter.layoutUpdate();
                // for automatically fitting the model size in the scene
                let entities = this.m_layouter.getEntities();
                console.log("xxxxx entities: ", entities);
                if (entities != null && entities.length > 0) {
                    let entity = entities[0];
                    let sv = entity.getScaleXYZ();
                    let pv = entity.getPosition();
                    console.log("xxxxx sv: ", sv);
                    console.log("xxxxx pv: ", pv);
                    console.log("xxxxx this.m_wirees: ", this.m_wirees);
                    for (let i = 0; i < this.m_wirees.length; ++i) {
                        this.m_wirees[i].setPosition(pv);
                        this.m_wirees[i].setScale3(sv);
                        this.m_wirees[i].update();
                    }
                }

            });

        let baseUrl = "static/private/";
        let url = baseUrl + "fbx/base4.fbx";
        // url = baseUrl + "fbx/hat_ok.fbx";
        url = baseUrl + "obj/apple_01.obj";
        url = baseUrl + "fbx/Mat_Ball.fbx";
        // url = baseUrl + "fbx/hat01_unwrapuv.fbx";
        // url = "static/assets/ctm/hat01_a.ctm";
        // url = baseUrl + "fbx/hat_ok.fbx";
        // url = baseUrl + "fbx/icoSph_0_unwrap2.fbx";
        // url = baseUrl + "fbx/hicoSph_unwrapuv.fbx";
        url = baseUrl + "fbx/icoSph_0.fbx";
        url = baseUrl + "fbx/icoSph_1_unwrap.fbx";
        url = baseUrl + "fbx/icoSph_1.fbx";

        this.loadModels([url]);
    }
    private loadModels(urls: string[], typeNS: string = ""): void {
        this.m_modelLoader.load(urls);
    }
    private m_modelIndex = 0;
    private m_vtxRIndex = 0;
    private m_vtxRCount = -1;
    private m_offsetR = 0.0001;
    protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {

        if (model != null) {
            console.log("createEntity(), this.m_modelIndex: ", this.m_modelIndex);
            console.log("createEntity(), model: ", model);

            if (this.m_modelIndex == 0) {
                // let fio = new FileIO();
                // fio.downloadBinFile(model.uvsList[0], "uvData1","uv");
                // this.m_uvData = model.uvsList[0];
                console.log("this.m_uvData.length: ", this.m_uvData.length);
                console.log("model.uvsList[0].length: ", model.uvsList[0].length);
                model.uvsList.push( this.m_uvData );
                // this.showUVTri(model);
                this.m_offsetR = 0.004;
                this.initTexLightingBakeWithModel(-1, model, transform);
            }
            this.m_modelIndex++;
        }
    }
    private getUVData(i: number, model: CoGeomDataType, uvIndex: number = 1): number[] {

        let uvs2 = model.uvsList[uvIndex];
        let uv = [uvs2[i * 2], uvs2[i * 2 + 1]];
        
        console.log("uv"+i+":", uv);
        return uv;
    }
    private showUVTri(model: CoGeomDataType): void {
        let ivs = model.indices;
        let a0 = ivs[0];
        let a1 = ivs[1];
        let a2 = ivs[2];
        let uv0 = this.getUVData(a0, model);
        let uv1 = this.getUVData(a1, model);
        let uv2 = this.getUVData(a2, model);
    }
    private initTexLightingBakeWithModel(bakeType: number, model: CoGeomDataType, transform: Float32Array = null): void {

        let vs = model.vertices;
        let ivs = model.indices;
        let trisNumber = ivs.length / 3;

        let nvs = model.normals;
        if (nvs == null) {
            SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
        }
        let material: MaterialBase;
        if (bakeType < 0) {
            if(model.uvsList.length > 1) model.uvsList[0] = model.uvsList[1];
            // let tex = this.getTexByUrl("static/private/bake/icoSph_0.png");
            let tex = this.getTexByUrl("static/private/bake/icoSph_1.png");
            // let tex = this.getTexByUrl("static/private/bake/sph_mapping02b.png");
            tex.flipY = bakeType < 0;
            let materialShow = new Default3DMaterial();
            materialShow.setTextureList([tex]);
            materialShow.initializeByCodeBuf(true);
            material = materialShow;
        }
        //hat01_bake.png

        let bake = bakeType > 0;
        let roughness = 0.0;
        let metallic = 0.0;
        let mat4 = new Matrix4(transform);

        let nameList: string[] = ["gold", "rusted_iron", "grass", "plastic", "wall"];
        let nameI = 3;
        metallic = 0.5;
        roughness = 0.4;

        console.log("xxxxx bake: ", bake);
        if (bake && bakeType != 3) {
            this.createLineDrawWithModel(model, bake, metallic, roughness, nameList[nameI]);
            // return;
        }
        if (bakeType >= 0) {
            let materialPbr = this.makeTexMaterial(metallic, roughness, 1.0);
            materialPbr.bake = bake;
            materialPbr.setTextureList(this.getTexList(nameList[nameI]));
            materialPbr.initializeByCodeBuf(true);
            material = materialPbr;
            // material = null;
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

        let entity = new DisplayEntity();
        if (bakeType == 2) entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        entity.setMaterial(material);
        entity.setMesh(mesh);

        if (transform != null) {
            entity.getTransform().setParentMatrix(mat4);
        }
        if(this.m_vtxRCount >= 0) entity.setIvsParam(this.m_vtxRIndex, this.m_vtxRCount);
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

    private createLineDrawWithModel(model: CoGeomDataType, bake: boolean, metallic: number, roughness: number, texName: string): void {

        let material = this.makeTexMaterial(metallic, roughness, 1.0);
        material.bake = bake;
        material.setTextureList(this.getTexList(texName));
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
        let total = 8;
        let stage = this.m_rscene.getStage3D();
        let ratio = stage.stageHeight / stage.stageWidth;
        console.log("xxxxx ratio: ", ratio);
        console.log("xxxxx model: ", model);
        for (let k = 0; k < 8; ++k) {
            for (let i = 0; i < total; ++i) {
                let rad = PI2 * i / total;
                let dx = Math.cos(rad) * radius * ratio;
                let dy = Math.sin(rad) * radius;
                this.createWithMesh(bake, mesh, metallic, roughness, texName, dx, dy);
            }
            radius += this.m_offsetR;
        }
    }
    private m_wirees: ITransformEntity[] = [];
    private createWithMesh(bake: boolean, mesh: IMeshBase, metallic: number, roughness: number, texName: string, dx: number, dy: number): void {

        let material = this.makeTexMaterial(metallic, roughness, 1.0);
        material.bake = bake;
        material.setTextureList(this.getTexList(texName));
        material.initializeByCodeBuf(true);

        material.setOffsetXY(dx, dy);
        let entity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        // console.log("createWithMesh(), mesh: ", mesh);
        if(this.m_vtxRCount >= 0) entity.setIvsParam(this.m_vtxRIndex, this.m_vtxRCount);
        this.m_wirees.push(entity);
        this.m_rscene.addEntity(entity, 0);
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
        let colorSize: number = 300.0;
        // let colorList: Color4[] = [
        //     new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
        //     new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
        //     new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
        //     new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize)
        // ];
        let colorList: Color4[] = [
            new Color4(300, 100, 10),
            new Color4(90, 200, 290),
            new Color4(150, 200, 160),
            new Color4(200, 200, 270)
        ];
        let material: PBRBakingMaterial = new PBRBakingMaterial();
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
        // let entities = this.m_layouter.getEntities();
        // console.log("entities[0].getTransform().getParentMatrix(): ", entities[0].getTransform().getParentMatrix());
        // console.log("entities[0].getPosition(): ", entities[0].getPosition());
        // console.log("entities[0].getScaleXYZ(): ", entities[0].getScaleXYZ());
        // console.log("entities[0].getRotationXYZ(): ", entities[0].getRotationXYZ());
        // console.log("this.m_wirees: ", this.m_wirees);
        // if(this.m_wirees != null && this.m_wirees.length) {
        //     this.m_wirees[0].copyTransformFrom(entities[0]);
        //     this.m_wirees[0].update();
        //     console.log("this.m_wirees[0].getPosition(): ", this.m_wirees[0].getPosition());
        //     console.log("this.m_wirees[0].getScaleXYZ(): ", this.m_wirees[0].getScaleXYZ());
        //     console.log("this.m_wirees[0].getRotationXYZ(): ", this.m_wirees[0].getRotationXYZ());
        // }
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        // this.m_statusDisp.render();
    }

    run(): void {

        if (this.m_rscene != null) {

            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

            this.m_rscene.run(true);

        }
    }
}
export default BakePBR;