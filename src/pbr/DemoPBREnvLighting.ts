
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import Vector3D from "../vox/math/Vector3D";
import Color4 from "../vox/material/Color4";

import PBREnvLightingMaterial from "../pbr/material/PBREnvLightingMaterial";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import { BinaryTextureLoader } from "../cospace/modules/loaders/BinaryTextureLoader";
import Torus3DEntity from "../vox/entity/Torus3DEntity";
import IRendererScene from "../vox/scene/IRendererScene";
import ITransformEntity from "../vox/entity/ITransformEntity";
import EventBase from "../vox/event/EventBase";
import IEventBase from "../vox/event/IEventBase";

class AnimationScene {

    private m_rscene: IRendererScene;
    private m_envTex: IRenderTexture;
    private m_sphEntity: ITransformEntity = null;
    private m_entities: ITransformEntity[] = [];
    private m_time = 0.0;
    constructor(sc: IRendererScene, envTex: IRenderTexture) {
        this.m_rscene = sc;
        this.m_envTex = envTex;
    }
    initialize(): void {
        this.m_time = Date.now();
        let begin = new Vector3D(-300, 0, 300);
        let offsetV = new Vector3D(30, 0, -30);
        for (let i = 0; i < 20; ++i) {
            this.createSphere(15, new Vector3D().copyFrom(offsetV).scaleBy(i).addBy(begin));
        }
        this.m_rscene.addEventListener(EventBase.ENTER_FRAME, this, this.run);
    }
    private createSphere(radius: number, pv: Vector3D): ITransformEntity {

        let material = this.makeMaterial(Math.random(), 0.9, 1.3);
        material.setTextureList([this.m_envTex]);
        material.initializeByCodeBuf(material.getTextureAt(0) != null);

        let sph = new Sphere3DEntity();
        sph.setMaterial(material);
        if (this.m_sphEntity != null) {
            sph.copyMeshFrom(this.m_sphEntity);
        } else {
            sph.initialize(radius, 20, 20);
            this.m_sphEntity = sph;
        }

        sph.setPosition(pv);
        this.m_rscene.addEntity(sph, 1);

        this.m_entities.push(sph);
        return sph;
    }
    private run(evt: IEventBase = null): void {

        let ls = this.m_entities;
        let len = this.m_entities.length;
        let pos = new Vector3D();
        let time = (Date.now() - this.m_time) * 0.003;
        for (let i = 0; i < len; ++i) {
            const factor = Math.sin(i * 0.5 + time);
            const et = ls[i];
            et.getPosition(pos);
            pos.y = factor * 100.0;
            let scale = Math.abs(factor * 1.5);
            if(scale < 0.3) {
                scale = 0.3;
            }
            et.setPosition(pos);
            et.setScaleXYZ(scale, scale, scale);
        }
    }
    private makeMaterial(metallic: number, roughness: number, ao: number): PBREnvLightingMaterial {
        let dis = 700.0;
        let disZ = 400.0;
        let posList: Vector3D[] = [
            new Vector3D(-dis, dis, disZ),
            new Vector3D(dis, dis, disZ),
            new Vector3D(-dis, -dis, disZ),
            new Vector3D(dis, -dis, disZ)
        ];
        let colorSize = 300.0;
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

        for (let i: number = 0; i < 4; ++i) {
            let pos: Vector3D = posList[i];
            material.setPosAt(i, pos.x, pos.y, pos.z);
            let color: Color4 = colorList[i];
            material.setColorAt(i, color.r, color.g, color.b);
        }
        material.setColor(Math.random(), Math.random(), Math.random());
        return material;
    }
}
export class DemoPBREnvLighting {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materials: PBREnvLightingMaterial[] = [];

    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
    }

    initialize(): void {
        console.log("DemoPBREnvLighting::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

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

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.initFloatCube();

            this.update();

        }
    }

    private initFloatCube(): void {

        let envMapUrl = "static/bytes/spe.mdf";

        let loader = new BinaryTextureLoader();
        loader.loadTextureWithUrl(envMapUrl);

        new AnimationScene(this.m_rscene, loader.texture).initialize();

        // this.initLighting(loader.texture);
    }
    private initLighting(s_envTex: IRenderTexture): void {

        let radius = 150.0;
        let rn = 7;
        let cn = 7;
        let roughness = 0.0;
        let metallic = 0.0;
        let disV3 = new Vector3D(radius * 2.0 + 50.0, radius * 2.0 + 50.0, 0.0);
        let beginPos = new Vector3D(disV3.x * (cn - 1) * -0.5, disV3.y * (rn - 1) * -0.5, -100.0);
        let pos = new Vector3D();

        let material = this.makeMaterial(0.3, 0.9, 1.3);
        material.setTextureList([s_envTex]);
        material.initializeByCodeBuf(material.getTextureAt(0) != null);

        // let sph = new Sphere3DEntity();
        // sph.setMaterial(material);
        // sph.initialize(150, 30, 30);
        // this.m_rscene.addEntity(sph, 1);

        // let cly = new Cylinder3DEntity();
        // cly.setMaterial(material);
        // cly.initialize(30, 200, 30);
        // this.m_rscene.addEntity(cly, 1);

        let torus = new Torus3DEntity();
        torus.setMaterial(material);
        torus.initialize(100, 50, 30, 50);
        this.m_rscene.addEntity(torus, 1);

        // let tube = new Tube3DEntity();
        // tube.setMaterial(material);
        // tube.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        // tube.initialize(30, 110, 30, 1);
        // this.m_rscene.addEntity(tube, 1);


        // let box = new Box3DEntity();
        // box.setMaterial(material);
        // // box.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        // box.initializeSizeXYZ(30, 110, 30);
        // this.m_rscene.addEntity(box, 1);

        return;
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
        if(this.m_rscene != null) {

            this.m_statusDisp.update(false);

            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
            this.m_rscene.run(true);
        }
    }
}
export default DemoPBREnvLighting;