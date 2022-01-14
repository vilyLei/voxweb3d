
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import FrustrumFrame3DEntity from "../../vox/entity/FrustrumFrame3DEntity";
import ScreenAlignPlaneEntity from "../../vox/entity/ScreenAlignPlaneEntity";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../vox/view/CameraTrack";
import RendererScene from "../../vox/scene/RendererScene";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import FBOInstance from "../../vox/scene/FBOInstance";
import CameraBase from "../../vox/view/CameraBase";
import MathConst from "../../vox/math/MathConst";
import DepthMaterial from "./material/DepthMaterial";
import OccBlurMaterial from "./material/OccBlurMaterial";
import ShadowVSMMaterial from "./material/ShadowVSMMaterial";
import ShadowVSMData from "./material/ShadowVSMData";
import RendererState from "../../vox/render/RendererState";
import { GLStencilFunc, GLStencilOp } from "../../vox/render/RenderConst";
import DebugFlag from "../../vox/debug/DebugFlag";
import ScreenFixedAlignPlaneEntity from "../../vox/entity/ScreenFixedAlignPlaneEntity";
import Matrix4 from "../../vox/math/Matrix4";
import Cylinder3DEntity from "../../vox/entity/Cylinder3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";

import {MaterialPipeline} from "../../vox/material/pipeline/MaterialPipeline";
export class DemoVSM {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materialPipeline: MaterialPipeline = null;

    private m_vsmData: ShadowVSMData = null;
    private m_targetEntity: DisplayEntity = null;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoVSM::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            //rparam.setAttriAlpha(false);
            rparam.setAttriStencil(true);
            //rparam.setAttripreserveDrawingBuffer(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 4);
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

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis, 3);

            this.m_rscene.setClearRGBColor3f(0.1, 0.2, 0.1);
            this.initConfig();
            this.update();
        }
    }

    private m_direcCamera: CameraBase = null;
    private m_fboDepth: FBOInstance = null;
    private m_fboOccBlur: FBOInstance = null;
    private m_verOccBlurPlane: Plane3DEntity = null;
    private m_horOccBlurPlane: Plane3DEntity = null;

    private m_shadowBias: number = -0.0005;
    private m_setShadowRadius: number = 2.0;
    private m_shadowMapW: number = 128;
    private m_shadowMapH: number = 128;
    private m_shadowViewW: number = 1300;
    private m_shadowViewH: number = 1300;
    private m_depthRtt: RTTTextureProxy = null;
    private m_occBlurRtt: RTTTextureProxy = null;

    private initConfig(): void {

        this.m_vsmData = new ShadowVSMData( this.m_rscene.getRenderProxy() );
        this.m_vsmData.initialize();

        let fboIndex: number = 0;
        this.m_fboDepth = this.m_rscene.createFBOInstance();
        this.m_fboDepth.asynFBOSizeWithViewport();
        this.m_fboDepth.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
        this.m_fboDepth.createFBOAt(fboIndex, this.m_shadowMapW, this.m_shadowMapH, true, false);
        this.m_depthRtt = this.m_fboDepth.setRenderToRGBATexture(null, 0);
        this.m_fboDepth.setRProcessIDList([0]);
        this.m_fboDepth.setGlobalRenderState(RendererState.NORMAL_STATE);
        this.m_fboDepth.setGlobalMaterial(new DepthMaterial());

        this.m_fboOccBlur = this.m_rscene.createFBOInstance();
        this.m_fboOccBlur.asynFBOSizeWithViewport();
        this.m_fboOccBlur.setClearRGBAColor4f(1.0, 1.0, 1.0, 1.0);
        this.m_fboOccBlur.createFBOAt(fboIndex, this.m_shadowMapW, this.m_shadowMapH, true, false);
        this.m_occBlurRtt = this.m_fboOccBlur.setRenderToRGBATexture(null, 0);


        let occMaterial: OccBlurMaterial;
        occMaterial = new OccBlurMaterial(false);
        occMaterial.setShadowRadius(this.m_setShadowRadius);
        let verOccBlurPlane: Plane3DEntity = new Plane3DEntity();
        verOccBlurPlane.setMaterial(occMaterial);
        verOccBlurPlane.initializeXOY(-1, -1, 2, 2, [this.m_depthRtt]);
        //this.m_rscene.addEntity(verOccBlurPlane, 1);
        this.m_verOccBlurPlane = verOccBlurPlane;

        occMaterial = new OccBlurMaterial(true);
        occMaterial.setShadowRadius(this.m_setShadowRadius);
        let horOccBlurPlane: Plane3DEntity = new Plane3DEntity();
        horOccBlurPlane.copyMeshFrom(verOccBlurPlane);
        horOccBlurPlane.setMaterial(occMaterial);
        horOccBlurPlane.initializeXOY(-1, -1, 2, 2, [this.m_occBlurRtt]);
        //this.m_rscene.addEntity(horOccBlurPlane, 2);
        this.m_horOccBlurPlane = horOccBlurPlane;

        let viewWidth: number = this.m_shadowViewW;
        let viewHeight: number = this.m_shadowViewH;
        this.m_direcCamera = new CameraBase();
        this.m_direcCamera.lookAtRH(new Vector3D(600.0, 800.0, -600.0), new Vector3D(0.0, 0.0, 0.0), new Vector3D(0.0, 1.0, 0.0));
        this.m_direcCamera.orthoRH(0.1, 1900.0, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
        this.m_direcCamera.setViewXY(0, 0);
        this.m_direcCamera.setViewSize(viewWidth, viewHeight);
        this.m_direcCamera.update();

        this.m_vsmData.updateShadowCamera(this.m_direcCamera);
        this.m_vsmData.setShadowRadius(this.m_setShadowRadius);
        this.m_vsmData.setShadowBias(this.m_shadowBias);
        this.m_vsmData.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
        this.m_vsmData.update();

        this.m_materialPipeline = new MaterialPipeline();
        this.m_materialPipeline.addPipe( this.m_vsmData );

        this.initSceneObjs();
    }
    private initSceneObjs(): void {

        let frustrum: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustrum.initiazlize(this.m_direcCamera);
        this.m_rscene.addEntity(frustrum, 3);

        let shadowTex: TextureProxy = this.m_depthRtt;
        let shadowMaterial: ShadowVSMMaterial;

        // add common 3d display entity

        let plane: Plane3DEntity = new Plane3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        shadowMaterial.setMaterialPipeline( this.m_materialPipeline );
        shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        //shadowMaterial.setVSMData(this.m_vsmData);
        plane.setMaterial(shadowMaterial);
        plane.initializeXOZ(-600.0, -600.0, 1200.0, 1200.0, [shadowTex, this.getImageTexByUrl("static/assets/brickwall_big.jpg")]);
        plane.setXYZ(0.0, -1.0, 0.0);
        this.m_rscene.addEntity(plane);
        this.m_targetEntity = plane;

        let box: Box3DEntity = new Box3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        shadowMaterial.setMaterialPipeline( this.m_materialPipeline );
        shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        //shadowMaterial.setVSMData(this.m_vsmData);
        box.setMaterial(shadowMaterial);
        box.initializeCube(200.0, [shadowTex, this.getImageTexByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(box);
        //box.setRotationXYZ(Math.random() * 300.0,Math.random() * 300.0,Math.random() * 300.0);
        box.setRotationXYZ(100.0, -60.0, 0.0);
        box.setXYZ(230.0, 100.0, 0.0);
        box.update();

        let cyl: Cylinder3DEntity = new Cylinder3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        shadowMaterial.setMaterialPipeline( this.m_materialPipeline );
        shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        //shadowMaterial.setVSMData(this.m_vsmData);
        cyl.setMaterial(shadowMaterial);
        cyl.initialize(80.0, 200.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/noise.jpg")]);
        this.m_rscene.addEntity(cyl);
        cyl.setXYZ(-230.0, 100.0, 0.0);


        let sph: Sphere3DEntity = new Sphere3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        shadowMaterial.setMaterialPipeline( this.m_materialPipeline );
        shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        //shadowMaterial.setVSMData(this.m_vsmData);
        sph.setMaterial(shadowMaterial);
        sph.initialize(80.0, 20.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/metal_02.jpg")]);
        this.m_rscene.addEntity(sph);
        sph.setXYZ(-230.0, 100.0, -200.0);

        sph = new Sphere3DEntity();
        shadowMaterial = new ShadowVSMMaterial();
        shadowMaterial.setMaterialPipeline( this.m_materialPipeline );
        shadowMaterial.setRGB3f(Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5, Math.random() * 0.7 + 0.5);
        //shadowMaterial.setVSMData(this.m_vsmData);
        sph.setMaterial(shadowMaterial);
        sph.initialize(80.0, 20.0, 20, [shadowTex, this.getImageTexByUrl("static/assets/metal_08.jpg")]);
        sph.setScaleXYZ(1.2, 1.2, 1.2);
        sph.setXYZ(-40.0, 100.0, -180.0);
        this.m_rscene.addEntity(sph);
    }
    private m_flag: boolean = true;
    private mouseDown(evt: any): void {
        this.m_flag = true;
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
    private m_shadowCamVersion: number = -1;
    private m_buildShadowDelay: number = 120;
    run(): void {

        //  if(this.m_flag) {
        //      this.m_flag = false;
        //  }
        //  else {
        //      return;
        //  }

        // update shadow direc matrix
        if (this.m_direcCamera.version != this.m_shadowCamVersion) {
            this.m_shadowCamVersion = this.m_direcCamera.version;
            this.m_vsmData.updateShadowCamera(this.m_direcCamera);
            this.m_vsmData.update();
        }
        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_rscene.update(true);

        if(this.m_buildShadowDelay > 0) {
            if(this.m_buildShadowDelay % 15 == 0) {
                this.buildShadow();
            }
            this.m_buildShadowDelay--;
        }

        this.m_rscene.run();
        this.m_rscene.runEnd();

    }
    private buildShadow(): void {

        this.m_fboDepth.useCamera(this.m_direcCamera);
        this.m_fboDepth.run(true, true);
        this.m_fboDepth.useMainCamera();
        // drawing vertical
        this.m_fboOccBlur.setRenderToRGBATexture(this.m_occBlurRtt, 0);
        this.m_fboOccBlur.runBegin();
        this.m_fboOccBlur.drawEntity(this.m_verOccBlurPlane);
        this.m_fboOccBlur.runEnd();
        // drawing horizonal
        this.m_fboOccBlur.setRenderToRGBATexture(this.m_depthRtt, 0);        
        this.m_fboOccBlur.runBegin();
        this.m_fboOccBlur.drawEntity(this.m_horOccBlurPlane);
        this.m_fboOccBlur.runEnd();
        
        this.m_fboOccBlur.setRenderToBackBuffer();
    }
}
export default DemoVSM;