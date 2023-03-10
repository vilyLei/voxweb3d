
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
import TextureConst from "../vox/texture/TextureConst";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../cospace/app/common/CoGeomModelLoader";
import { EntityLayouter } from "../vox/utils/EntityLayouter";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Torus3DEntity from "../vox/entity/Torus3DEntity";
import { MouseInteraction } from "../vox/ui/MouseInteraction";

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
            // let rparam: RendererParam = new RendererParam(this.createDiv(0, 0, 512, 512));
            // rparam.autoSyncRenderBufferAndWindowSize = false;
            let rparam: RendererParam = new RendererParam();
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


            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            new RenderStatusDisplay(this.m_rscene, true);
            new MouseInteraction().initialize(this.m_rscene, 0).setAutoRunning(true);


            // let axis: Axis3DEntity = new Axis3DEntity();
            // axis.initialize(500.0);
            // this.m_rscene.addEntity(axis);

            // add common 3d display entity
            //  let plane: Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getTexByUrl("static/assets/broken_iron.jpg")]);
            //  this.m_rscene.addEntity(plane);

            // this.initFloatCube();

            this.initTexLighting();

            // this.initModel();

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
        url = "static/assets/ctm/hat01_a.ctm";

        this.loadModels([url]);
    }
    private loadModels(urls: string[], typeNS: string = ""): void {
        this.m_modelLoader.load(urls);
    }

    protected createEntity(model: CoGeomDataType, transform: Float32Array = null, index: number = 0): void {

        if (model != null) {
            console.log("createEntity(), model: ", model);
        }
    }

    private initFloatCube(): void {

        let envMapUrl: string = "static/bytes/spe.mdf";

        //let loader:TextureLoader = new TextureLoader();
        let loader: SpecularTextureLoader = new SpecularTextureLoader();
        loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
        this.initLighting(null, loader.texture);
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
                sph.initialize(radius, 30, 30, this.getTexList(nameList[Math.round(Math.random() * 10000) % nameList.length]));

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

        let material = this.makeMaterial(0.2, 0.1, 1.3);
        material.setTextureList( [s_envTex] );
        material.initializeByCodeBuf(material.getTextureAt(0) != null);
        
        // let cly = new Cylinder3DEntity();
        // cly.setMaterial(material);
        // cly.initialize(30, 200, 30);
        // this.m_rscene.addEntity(cly, 1);

        // let torus = new Torus3DEntity();
        // torus.setMaterial(material);
        // torus.initialize(200, 50, 30, 50);
        // this.m_rscene.addEntity(torus, 1);

        // return;
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

            this.getTexByUrl("static/assets/pbr/" + name + "/albedo.jpg"),
            this.getTexByUrl("static/assets/pbr/" + name + "/normal.jpg"),
            this.getTexByUrl("static/assets/pbr/" + name + "/metallic.jpg"),
            this.getTexByUrl("static/assets/pbr/" + name + "/roughness.jpg"),
            this.getTexByUrl("static/assets/pbr/" + name + "/ao.jpg"),
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
            new Color4().randomRGB(colorSize),
            new Color4().randomRGB(colorSize),
            new Color4().randomRGB(colorSize),
            new Color4().randomRGB(colorSize)
        ];

        let material = new PBREnvLightingMaterial();
        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);
        let f0: number = Math.random() * 0.9;
        
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

    run(): void {
        if(this.m_rscene) {
            this.m_rscene.run(true);
        }
    }
}
export default DemoEnvLighting;