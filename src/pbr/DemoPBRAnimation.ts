
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import Vector3D from "../vox/math/Vector3D";
import Color4 from "../vox/material/Color4";

import PBREnvLightingMaterial from "../pbr/material/PBREnvLightingMaterial";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import { BinaryTextureLoader } from "../cospace/modules/loaders/BinaryTextureLoader";
import IRendererScene from "../vox/scene/IRendererScene";
import ITransformEntity from "../vox/entity/ITransformEntity";
import EventBase from "../vox/event/EventBase";
import IEventBase from "../vox/event/IEventBase";
import { MouseInteraction } from "../vox/ui/MouseInteraction";

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
    private makeMaterial(roughness: number, metallic: number, ao: number): PBREnvLightingMaterial {
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
            new Color4().randomRGB(colorSize),
            new Color4().randomRGB(colorSize),
            new Color4().randomRGB(colorSize),
            new Color4().randomRGB(colorSize)
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
export class DemoPBRAnimation {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;

    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
    }

    initialize(): void {
        console.log("DemoPBRAnimation::initialize()......");
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
            this.m_rscene.initialize(rparam).setAutoRunning(true);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            new RenderStatusDisplay(this.m_rscene, true);
            new MouseInteraction().initialize(this.m_rscene, 0).setAutoRunning(true);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            this.initFloatCube();


        }
    }

    private initFloatCube(): void {

        let envMapUrl = "static/bytes/spe.mdf";

        let loader = new BinaryTextureLoader();
        loader.loadTextureWithUrl(envMapUrl);

        new AnimationScene(this.m_rscene, loader.texture).initialize();
    }
    private mouseDown(evt: any): void {
        console.log("mouse down... ...");
    }
}
export default DemoPBRAnimation;