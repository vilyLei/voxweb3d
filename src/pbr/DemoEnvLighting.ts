
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import Vector3D from "../vox/math/Vector3D";
import Color4 from "../vox/material/Color4";

import BinaryLoader from "../vox/assets/BinaryLoader";

import PBREnvLightingMaterial from "../pbr/material/PBREnvLightingMaterial";
import PBRTexLightingMaterial from "./material/PBRTexLightingMaterial";
import { IFloatCubeTexture } from "../vox/render/texture/IFloatCubeTexture";
import FloatCubeTextureProxy from "../vox/texture/FloatCubeTextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import IMeshBase from "../vox/mesh/IMeshBase";
import Sphere3DMesh from "../vox/mesh/Sphere3DMesh";
import IRenderMaterial from "../vox/render/IRenderMaterial";
import RendererState from "../vox/render/RendererState";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../cospace/app/common/CoGeomModelLoader";
import { EntityLayouter } from "../vox/utils/EntityLayouter";
import DataMesh from "../vox/mesh/DataMesh";
import SurfaceNormalCalc from "../vox/geom/SurfaceNormalCalc";
import Matrix4 from "../vox/math/Matrix4";
import IShaderMaterial from "../vox/material/mcase/IShaderMaterial";
import MaterialBase from "../vox/material/MaterialBase";

class TextureLoader {

    protected m_rscene: RendererScene = null;
    texture: IFloatCubeTexture = null;
    constructor() {
    }

    loadTextureWithUrl(url: string, rscene: RendererScene): void {
        //let url: string = "static/bytes/spe.mdf";
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = url;
        loader.load(url, this);
        this.m_rscene = rscene;

        this.texture = this.m_rscene.textureBlock.createFloatCubeTex(32, 32, false);
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        //console.log("loaded... uuid: ", uuid, buffer.byteLength);
        this.parseTextureBuffer(buffer);
        this.m_rscene = null;
        this.texture = null;
    }
    loadError(status: number, uuid: string): void {
    }

    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;
        let tex = this.texture;
        tex.toRGBFormat();
        for (let i: number = 0, len: number = 6; i < len; ++i) {
            subArr = fs32.slice(begin, begin + size);
            console.log("width,height: ", width, height, ", subArr.length: ", subArr.length);
            tex.setDataFromBytesToFaceAt(i, subArr, width, height, 0);
            begin += size;
        }
    }
}

class SpecularTextureLoader extends TextureLoader {

    constructor() {
        super();
    }
    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;

        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;

        let tex = this.texture;
        tex.toRGBFormat();
        tex.mipmapEnabled = false;
        tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        tex.magFilter = TextureConst.LINEAR;

        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 6; i++) {
                const size = width * height * 3;
                subArr = fs32.slice(begin, begin + size);
                tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
    }
}

export class DemoEnvLighting {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materials: PBREnvLightingMaterial[] = [];
    private m_texMaterials: PBRTexLightingMaterial[] = [];
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
        console.log("DemoEnvLighting::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            // let rparam = this.m_graph.createRendererParam(this.createDiv(0, 0, 512, 512));
            // rparam.autoSyncRenderBufferAndWindowSize = false;
            let rparam: RendererParam = new RendererParam(this.createDiv(0, 0, 512, 512));
            rparam.autoSyncRenderBufferAndWindowSize = false;
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            rparam.setAttriAntialias(true);
            //rparam.setAttriStencil(true);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);
            this.m_rscene.updateCamera();

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
            /*
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

            let tex = this.getTexByUrl("static/assets/bake/sph_mapping02.png");
            tex.flipY = true;
            let material = new Default3DMaterial();
            material.setTextureList([
                tex
            ]);
            material.initializeByCodeBuf(true);

            let mesh = new DataMesh();
            mesh.wireframe = true;
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
            // this.m_entities.push(entity);
            //*/
            // for automatically fitting the model size in the scene
            // this.m_layouter.layoutAppendItem(entity, matrix4);
            this.initTexLightingBakeWithModel(-1, model, transform);
        }
    }

    private initTexLightingBakeWithModel(bakeType: number, model: CoGeomDataType, transform: Float32Array = null): void {


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

        let material: MaterialBase;
        if(bakeType < 0) {
            let tex = this.getTexByUrl("static/assets/bake/mat_ball.png");
            tex.flipY = bakeType < 0;
            let materialShow = new Default3DMaterial();
            materialShow.setTextureList([ tex ]);
            materialShow.initializeByCodeBuf(true);
            material = materialShow;
        }

        let bake = bakeType > 0;
        let radius = 150.0;
        let roughness = 0.0;
        let metallic = 0.0;
        let mat4 = new Matrix4(transform);

        let nameList: string[] = ["gold", "rusted_iron", "grass", "plastic", "wall"];
        let nameI = 3;
        metallic = 0.5;
        roughness = 0.4;
        if (bake) {
            this.createLineDrawWithModel(model, mat4, bake, radius, metallic, roughness, nameList[nameI]);
            // return;
        }
        if(bakeType >= 0) {
            let materialPbr = this.makeTexMaterial(metallic, roughness, 1.0);
            materialPbr.bake = bake;
            materialPbr.setTextureList(this.getTexList(nameList[nameI]));
            materialPbr.initializeByCodeBuf(true);
            material = materialPbr;
        }

        let mesh = new DataMesh();
        mesh.vbWholeDataEnabled = false;
        mesh.setVS(model.vertices);
        mesh.setUVS(model.uvsList[0]);
        mesh.setNVS(model.normals);
        mesh.setIVS(model.indices);
        mesh.setVtxBufRenderData(material);
        mesh.initialize();

        let entity = new DisplayEntity();
        if (bake) entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        entity.setMaterial(material);
        entity.setMesh(mesh);

        if (transform != null) {
            entity.getTransform().setParentMatrix(mat4);
        }
        this.m_rscene.addEntity(entity, 1);
        // for automatically fitting the model size in the scene
        this.m_layouter.layoutAppendItem(entity, mat4);
        //*/
    }

    private createLineDrawWithModel(model: CoGeomDataType, mat4: Matrix4, bake: boolean, pradius: number, metallic: number, roughness: number, texName: string): void {

        let material = this.makeTexMaterial(metallic, roughness, 1.0);
        material.bake = bake;
        material.setTextureList(this.getTexList(texName));
        material.initializeByCodeBuf(true);

        let mesh = new DataMesh();
        mesh.wireframe = true;
        mesh.vbWholeDataEnabled = false;
        mesh.setVS(model.vertices);
        mesh.setUVS(model.uvsList[0]);
        mesh.setNVS(model.normals);
        mesh.setIVS(model.indices);
        mesh.setVtxBufRenderData(material);
        mesh.initialize();

        let radius = 0.002;
        let PI2 = Math.PI * 2.0;
        let total = 8;
        let stage = this.m_rscene.getStage3D();
        let ratio = stage.stageHeight / stage.stageWidth;
        for (let k = 0; k < 8; ++k) {
            for (let i = 0; i < total; ++i) {
                let rad = PI2 * i / total;
                let dx = Math.cos(rad) * radius * ratio;
                let dy = Math.sin(rad) * radius;
                // material.setOffsetXY(dx, dy);
                this.createWithMesh(bake, mesh, metallic, roughness, texName, dx, dy, mat4);
            }
            radius += 0.002;
        }
    }

    private applyTex(): void {
        // let tex = this.getTexByUrl("static/assets/bake/sph_mapping01.png");
        let tex = this.getTexByUrl("static/assets/bake/sph_mapping03.png");
        // let tex = this.getTexByUrl("static/assets/towBox.jpg");
        tex.flipY = true;
        // tex.premultiplyAlpha = true;
        let material = new Default3DMaterial();
        material.setTextureList([tex]);
        material.initializeByCodeBuf(true);

        let mesh = new Sphere3DMesh();
        mesh.uvScale = 0.9;
        mesh.mode = 2;
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(150, 30, 30, false);

        let entity = new DisplayEntity();
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        entity.setMesh(mesh);
        entity.setMaterial(material);

        this.m_rscene.addEntity(entity);
    }
    private initTexLightingBake(bake: boolean): void {

        // let bake = false;
        let radius = 150.0;
        let roughness = 0.0;
        let metallic = 0.0;


        let nameList: string[] = ["gold", "rusted_iron", "grass", "plastic", "wall"];
        let nameI = 3;
        metallic = 0.5;
        roughness = 0.4;
        if (bake) {
            this.createLineDraw(bake, radius, metallic, roughness, nameList[nameI]);
            // return;
        }
        let material: PBRTexLightingMaterial = this.makeTexMaterial(metallic, roughness, 1.0);
        material.bake = bake;
        material.setTextureList(this.getTexList(nameList[nameI]));
        material.initializeByCodeBuf(true);

        let mesh = new Sphere3DMesh();
        mesh.uvScale = 0.9;
        mesh.mode = 2;
        mesh.setVtxBufRenderData(material);
        mesh.initialize(radius, 30, 30, false);
        let sph = new DisplayEntity();
        if (bake) sph.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        sph.setMaterial(material);
        sph.setMesh(mesh);
        this.m_rscene.addEntity(sph, 1);
    }
    private initFloatCube(): void {

        let envMapUrl: string = "static/bytes/spe.mdf";

        //let loader:TextureLoader = new TextureLoader();
        let loader: SpecularTextureLoader = new SpecularTextureLoader();
        loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
        this.initLighting(null, loader.texture);
    }

    private createWithMesh(bake: boolean, mesh: IMeshBase, metallic: number, roughness: number, texName: string, dx: number, dy: number, mat4: Matrix4 = null): void {

        let material: PBRTexLightingMaterial = this.makeTexMaterial(metallic, roughness, 1.0);
        material.bake = bake;
        material.setTextureList(this.getTexList(texName));
        material.initializeByCodeBuf(true);
        material.setOffsetXY(dx, dy);
        let entity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);

        if (mat4 != null) {
            entity.getTransform().setParentMatrix(mat4);
        }
        this.m_rscene.addEntity(entity, 0);
    }
    private createLineDraw(bake: boolean, pradius: number, metallic: number, roughness: number, texName: string): void {

        let material: PBRTexLightingMaterial = this.makeTexMaterial(metallic, roughness, 1.0);
        material.bake = bake;
        material.setTextureList(this.getTexList(texName));
        material.initializeByCodeBuf(true);
        let mesh = new Sphere3DMesh();
        mesh.uvScale = 0.9;
        mesh.mode = 2;
        mesh.wireframe = true;
        mesh.setVtxBufRenderData(material);
        mesh.initialize(pradius, 30, 30, false);

        let radius = 0.002;
        let PI2 = Math.PI * 2.0;
        let total = 8;
        let stage = this.m_rscene.getStage3D();
        let ratio = stage.stageHeight / stage.stageWidth;
        for (let k = 0; k < 8; ++k) {
            for (let i = 0; i < total; ++i) {
                let rad = PI2 * i / total;
                let dx = Math.cos(rad) * radius * ratio;
                let dy = Math.sin(rad) * radius;
                // material.setOffsetXY(dx, dy);
                this.createWithMesh(bake, mesh, metallic, roughness, texName, dx, dy);
            }
            radius += 0.002;
        }
    }
    private initTexLighting(): void {

        let radius: number = 150.0;
        let rn: number = 3;
        let cn: number = 3;
        let roughness: number = 0.0;
        let metallic: number = 0.0;
        let disV3: Vector3D = new Vector3D(radius * 2.0 + 50.0, radius * 2.0 + 50.0, 0.0);
        let beginPos: Vector3D = new Vector3D(disV3.x * (cn - 1) * -0.5, disV3.y * (rn - 1) * -0.5, -100.0);
        let pos: Vector3D = new Vector3D();

        let nameList: string[] = ["gold", "rusted_iron", "grass", "plastic", "wall"];

        let texList: TextureProxy[] = this.getTexList("plastic");

        for (let i: number = 0; i < rn; ++i) {
            metallic = Math.max(rn - 1, 0.001);
            metallic = i / metallic;
            for (let j: number = 0; j < cn; ++j) {
                roughness = Math.max(cn - 1, 0.001);
                roughness = j / roughness;

                let sph: Sphere3DEntity = new Sphere3DEntity();
                let material: PBRTexLightingMaterial = this.makeTexMaterial(metallic, roughness, 1.0);
                //let material:PBREnvLightingMaterial = this.makeMaterial(metallic, roughness, 1.3);
                sph.setMaterial(material);
                sph.initialize(radius, 20, 20, this.getTexList(nameList[Math.round(Math.random() * 10000) % nameList.length]));

                pos.copyFrom(beginPos);
                pos.x += disV3.x * j;
                pos.y += disV3.y * i;
                //pos.z += disV3.z * j;
                sph.setPosition(pos);

                this.m_rscene.addEntity(sph);
            }
        }
    }
    private initLighting(d_envTex: IFloatCubeTexture, s_envTex: IFloatCubeTexture): void {

        let radius: number = 150.0;
        let rn: number = 7;
        let cn: number = 7;
        let roughness: number = 0.0;
        let metallic: number = 0.0;
        let disV3: Vector3D = new Vector3D(radius * 2.0 + 50.0, radius * 2.0 + 50.0, 0.0);
        let beginPos: Vector3D = new Vector3D(disV3.x * (cn - 1) * -0.5, disV3.y * (rn - 1) * -0.5, -100.0);
        let pos: Vector3D = new Vector3D();

        for (let i: number = 0; i < rn; ++i) {
            metallic = Math.max(rn - 1, 0.001);
            metallic = i / metallic;
            //metallic = 1.0;
            for (let j: number = 0; j < cn; ++j) {
                roughness = Math.max(cn - 1, 0.001);
                roughness = j / roughness;
                //roughness = 0.0;

                let sph: Sphere3DEntity = new Sphere3DEntity();
                //let material:PBREnvLightingMaterial = this.makeMaterial(0.0, 0.2, 1.0);
                let material: PBREnvLightingMaterial = this.makeMaterial(metallic, roughness, 1.3);
                sph.setMaterial(material);
                //sph.initialize(radius, 20, 20, [this.getTexByUrl("static/assets/noise.jpg")]);
                sph.initialize(radius, 20, 20, [s_envTex]);

                pos.copyFrom(beginPos);
                pos.x += disV3.x * j;
                pos.y += disV3.y * i;
                //pos.z += disV3.z * j;
                sph.setPosition(pos);

                this.m_rscene.addEntity(sph);
            }
        }
    }
    private getTexList(name: string = "rusted_iron"): TextureProxy[] {
        let list: TextureProxy[] = [

            this.getTexByUrl("static/assets/pbr/" + name + "/albedo.png"),
            this.getTexByUrl("static/assets/pbr/" + name + "/normal.png"),
            this.getTexByUrl("static/assets/pbr/" + name + "/metallic.png"),
            this.getTexByUrl("static/assets/pbr/" + name + "/roughness.png"),
            this.getTexByUrl("static/assets/pbr/" + name + "/ao.png"),
        ];
        return list;
    }

    private makeTexMaterial(metallic: number, roughness: number, ao: number): PBRTexLightingMaterial {
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
        let material: PBRTexLightingMaterial = new PBRTexLightingMaterial();
        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);

        material.setCamPos(this.m_rscene.getCamera().getPosition());

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
    private makeMaterial(metallic: number, roughness: number, ao: number): PBREnvLightingMaterial {
        let dis: number = 700.0;
        let disZ: number = 400.0;
        let posList: Vector3D[] = [
            new Vector3D(-dis, dis, disZ),
            new Vector3D(dis, dis, disZ),
            new Vector3D(-dis, -dis, disZ),
            new Vector3D(dis, -dis, disZ)
        ];
        let colorSize: number = 300.0;
        let colorList: Color4[] = [
            new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
            new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
            new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize),
            new Color4(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize)
        ];

        let material: PBREnvLightingMaterial = new PBREnvLightingMaterial();
        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);
        let f0: number = Math.random() * 0.9;
        //material.setF0(Math.random() * 0.9, Math.random() * 0.9, Math.random() * 0.9);
        //material.setF0(f0,f0,f0);
        material.setCamPos(this.m_rscene.getCamera().getPosition());

        this.m_materials.push(material);

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
        console.log("mouse down... ...");
    }
    mouseWheelListener(evt: any): void {
        //this.m_cameraZoomController.setMoevDistance(evt.wheelDeltaY * 0.5);
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_statusDisp.render();
    }

    run(): void {
        this.m_statusDisp.update(false);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        //  for(let i: number = 0, il: number = this.m_materials.length; i < il; ++i) {
        //      this.m_materials[i].setCamPos(this.m_rscene.getCamera().getPosition());
        //  }


        this.m_rscene.run(true);

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        //this.m_profileInstance.run();
    }
}
export default DemoEnvLighting;