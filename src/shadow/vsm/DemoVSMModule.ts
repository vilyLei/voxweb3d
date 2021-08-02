
import Vector3D from "../../vox/math/Vector3D";
import RendererDeviece from "../../vox/render/RendererDeviece";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import FrustrumFrame3DEntity from "../../vox/entity/FrustrumFrame3DEntity";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import ShadowVSMMaterial from "./material/ShadowVSMMaterial";
import ShadowVSMModule from "./base/ShadowVSMModule";
import DebugFlag from "../../vox/debug/DebugFlag";
import Cylinder3DEntity from "../../vox/entity/Cylinder3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";

export class DemoVSMModule {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_vsmModule: ShadowVSMModule;

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoVSMModule::initialize()......");
        if (this.m_rscene == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            //rparam.setAttriAlpha(false);
            rparam.setAttriStencil(true);
            //rparam.setAttripreserveDrawingBuffer(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus", 300);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis, 1);

            this.m_rscene.setClearRGBColor3f(0.1, 0.2, 0.1);
            this.m_vsmModule = new ShadowVSMModule(0);
            this.m_vsmModule.setMapSize(128.0, 128.0);
            this.m_vsmModule.setCameraViewSize(1300, 1300);
            this.m_vsmModule.setShadowRadius(2);
            this.m_vsmModule.setShadowBias(-0.0005);
            this.m_vsmModule.initialize(this.m_rscene, [0]);
            this.m_vsmModule.setShadowIntensity(0.8);
            this.m_vsmModule.setColorIntensity(0.3);

            this.initSceneObjs();
            this.update();
        }
    }

    private initSceneObjs(): void {

        let frustrum: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustrum.initiazlize(this.m_vsmModule.getCamera());
        this.m_rscene.addEntity(frustrum, 1);

        let vsmData = this.m_vsmModule.getVSMData();
        //let shadowTex: TextureProxy = this.m_depthRtt;
        let shadowTex: TextureProxy = this.m_vsmModule.getShadowMap();
        let shadowMaterial: ShadowVSMMaterial;

        // add common 3d display entity

        let plane: Plane3DEntity = new Plane3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        //shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        shadowMaterial.setVSMData(vsmData);
        plane.setMaterial(shadowMaterial);
        plane.initializeXOZ(-600.0, -600.0, 1200.0, 1200.0, [shadowTex, this.getImageTexByUrl("static/assets/brickwall_big.jpg")]);
        plane.setXYZ(0.0, -1.0, 0.0);
        this.m_rscene.addEntity(plane);

        let box: Box3DEntity = new Box3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        //shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        shadowMaterial.setVSMData(vsmData);
        box.setMaterial(shadowMaterial);
        box.initializeCube(200.0, [shadowTex, this.getImageTexByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(box);
        //box.setRotationXYZ(Math.random() * 300.0,Math.random() * 300.0,Math.random() * 300.0);
        box.setRotationXYZ(100.0, -60.0, 0.0);
        box.setXYZ(230.0, 100.0, 0.0);
        box.update();

        let cyl: Cylinder3DEntity = new Cylinder3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        //shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        shadowMaterial.setVSMData(vsmData);
        cyl.setMaterial(shadowMaterial);
        cyl.initialize(80.0, 200.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/noise.jpg")]);
        this.m_rscene.addEntity(cyl);
        cyl.setXYZ(-230.0, 100.0, 0.0);


        let sph: Sphere3DEntity = new Sphere3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        //shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        shadowMaterial.setVSMData(vsmData);
        sph.setMaterial(shadowMaterial);
        sph.initialize(80.0, 20.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(sph);
        sph.setXYZ(-230.0, 100.0, -200.0);

        sph = new Sphere3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        //shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        shadowMaterial.setVSMData(vsmData);
        sph.setMaterial(shadowMaterial);
        sph.initialize(80.0, 20.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/metal_08.jpg")]);
        sph.setScaleXYZ(1.2, 1.2, 1.2);
        sph.setXYZ(-40.0, 100.0, -180.0);
        this.m_rscene.addEntity(sph);
    }
    private mouseDown(evt: any): void {
        DebugFlag.Flag_0 = 1;
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
    run(): void {

        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_rscene.update(true);

        this.m_vsmModule.run();

        this.m_rscene.run();
        this.m_rscene.runEnd();

    }
}
export default DemoVSMModule;