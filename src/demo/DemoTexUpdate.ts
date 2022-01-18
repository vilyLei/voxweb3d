
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

export class DemoTexUpdate {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_targets: DisplayEntity[] = [];

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl, 0, false, false);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoTexUpdate::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            // add common 3d display entity
            let plane: Plane3DEntity = new Plane3DEntity();
            //plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/notpot/seaturtle.jpg")]);
            this.m_rscene.addEntity(plane);
            this.m_targets.push(plane);
            //this.m_disp = plane;

            this.m_rscene.setAutoRunningEnabled(false);
            this.update();

        }
    }
    //private m_disp:DisplayEntity = null;
    private updateTex(): void {
        let rscene: RendererScene = this.m_rscene;
        let entityList: DisplayEntity[] = this.m_targets;
        let img: HTMLImageElement = new Image();
        img.onload = function (evt: any): void {
            console.log("loaded img, and update tex res.");
            let tex = rscene.textureBlock.createImageTex2D(img.width, img.height, false);
            tex.setDataFromImage(img, 0, 0, 0, false);
            entityList[0].setTextureList([tex]);
            entityList[0].updateMaterialToGpu(rscene.getRenderProxy());
        }
        //img.src = "static/assets/yanj.jpg";
        img.src = "static/assets/metal_02.jpg";
    }
    private updateTexData(): void {
        let rscene: RendererScene = this.m_rscene;
        let entityList: DisplayEntity[] = this.m_targets;
        let img: HTMLImageElement = new Image();
        img.onload = function (evt: any): void {
            console.log("loaded img, and update tex res.");
            let tex: ImageTextureProxy = entityList[0].getMaterial().getTextureAt(0) as ImageTextureProxy;

            tex.setDataFromImage(img);
            let defaultUpdate: boolean = true;
            if (defaultUpdate) {
                tex.updateDataToGpu();
            }
            else {
                tex.updateDataToGpu(rscene.getRenderProxy(), true);
            }
        }
        //img.src = "static/assets/yanj.jpg";
        img.src = "static/assets/metal_02.jpg";
    }
    private mouseDown(evt: any): void {
        if (this.m_targets != null && this.m_targets.length > 0) {
            let testFlag: boolean = false;
            if (testFlag) {
                this.updateTexData();
            }
            else {
                this.updateTex();
            }
        }
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        let pcontext: RendererInstanceContext = this.m_rcontext;
        this.m_statusDisp.statusInfo = "/" + pcontext.getTextureResTotal() + "/" + pcontext.getTextureAttachTotal();

        this.m_rscene.update();
        this.m_statusDisp.render();
    }
    run(): void {
        this.m_statusDisp.update(false);

        this.m_rscene.runBegin();
        this.m_rscene.run();
        this.m_rscene.runEnd();

        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_profileInstance.run();
    }
}
export default DemoTexUpdate;