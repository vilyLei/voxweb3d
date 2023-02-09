
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

export class EffectExample {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp = new RenderStatusDisplay();
    private m_stageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController = new CameraZoomController();

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
            this.initObjs();

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
    private m_flag: boolean = false;
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
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps

        this.m_statusDisp.render();

    }
    private m_time: number = 0.0;
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