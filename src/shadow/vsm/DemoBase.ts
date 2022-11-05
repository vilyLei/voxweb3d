
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
import TextureConst from "../../vox/texture/TextureConst";
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
import ShadowEntityMaterial from "./material/ShadowEntityMaterial";
import RendererState from "../../vox/render/RendererState";
import { GLStencilFunc, GLStencilOp } from "../../vox/render/RenderConst";
import DebugFlag from "../../vox/debug/DebugFlag";
import ScreenFixedAlignPlaneEntity from "../../vox/entity/ScreenFixedAlignPlaneEntity";
import Matrix4 from "../../vox/math/Matrix4";
import Cylinder3DEntity from "../../vox/entity/Cylinder3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../vox/scene/block/RenderableEntityBlock";
import { OccBlurDecorator } from "./material/OccBlurDecorator";
import { DepthWriteDecorator } from "./material/DepthWriteDecorator";
import IRenderMaterial from "../../vox/render/IRenderMaterial";

export class DemoBase {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_targetEntity: DisplayEntity = null;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoBase::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setAttriStencil(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 4);
            this.m_rscene.updateCamera();

            let rscene = this.m_rscene;
            // let materialBlock = new RenderableMaterialBlock();
            // materialBlock.initialize();
            // //rscene.materialBlock = materialBlock;
            // let entityBlock = new RenderableEntityBlock();
            // entityBlock.initialize();
            // //rscene.entityBlock = entityBlock;

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
            this.m_rscene.addEntity(axis);

            this.m_rscene.setClearRGBColor3f(0.1,0.2,0.1);
            this.initConfig();
            this.update();
        }
    }

    private m_direcCamera:CameraBase = null;
    private m_depMaterial: IRenderMaterial = null;//new DepthMaterial();
    //private m_occMaterial: OccBlurMaterial = new OccBlurMaterial();
    private m_fboDepth: FBOInstance = null;
    private m_fboOccBlurH: FBOInstance = null;
    private m_fboOccBlurV: FBOInstance = null;
    private m_horOccBlurPlane: Plane3DEntity = null;
    private m_verOccBlurPlane: Plane3DEntity = null;
    private m_shadowBias: number = -0.0005;
    private m_shadowRadius: number = 2.0;
    private m_shadowMapW: number = 128;
    private m_shadowMapH: number = 128;
    private m_shadowViewW: number = 1300;
    private m_shadowViewH: number = 1300;
    private initConfig(): void {
        
        this.m_fboDepth = this.m_rscene.createFBOInstance();
        this.m_fboDepth.asynFBOSizeWithViewport();
        this.m_fboDepth.setClearRGBAColor4f(1.0,1.0,1.0,1.0);
        this.m_fboDepth.createFBOAt(0, this.m_shadowMapW,this.m_shadowMapH, true,false);
        this.m_fboDepth.setRenderToRTTTextureAt(0, 0);
        this.m_fboDepth.setRProcessIDList([0]);

        let occMaterial: any;
        let occDeco: OccBlurDecorator = null;
        let occBlurPlane: Plane3DEntity;

        occDeco = new OccBlurDecorator(false, this.m_fboDepth.getRTTAt(0), this.m_shadowRadius);
        if(occDeco != null) {
            this.m_depMaterial = this.m_rscene.materialBlock.createSimpleMaterial(new DepthWriteDecorator());
        }
        else {
            this.m_depMaterial = new DepthMaterial();
        }
        // m_depMaterial: IRenderMaterial = new DepthMaterial();
        // let depthMaterial = this.m_rscene.materialBlock.createSimpleMaterial(new DepthWriteDecorator());

        //this.m_fboDepth.setGlobalRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        this.m_fboDepth.setGlobalRenderState(RendererState.NORMAL_STATE);
        this.m_fboDepth.setGlobalMaterial(this.m_depMaterial);

        
        this.m_fboOccBlurV = this.m_rscene.createFBOInstance();
        this.m_fboOccBlurV.asynFBOSizeWithViewport();
        this.m_fboOccBlurV.setClearRGBAColor4f(1.0,1.0,1.0,1.0);
        this.m_fboOccBlurV.createFBOAt(0, this.m_shadowMapW,this.m_shadowMapH, true,false);
        this.m_fboOccBlurV.setRenderToRTTTextureAt(1, 0);
        this.m_fboOccBlurV.setRProcessIDList([1]);
        
        this.m_fboOccBlurH = this.m_rscene.createFBOInstance();
        this.m_fboOccBlurH.asynFBOSizeWithViewport();
        this.m_fboOccBlurH.setClearRGBAColor4f(1.0,1.0,1.0,1.0);
        this.m_fboOccBlurH.createFBOAt(0, this.m_shadowMapW,this.m_shadowMapH, true,false);
        this.m_fboOccBlurH.setRenderToRTTTextureAt(2, 0);
        this.m_fboOccBlurH.setRProcessIDList([2]);

        
        if(occDeco != null) {
            occMaterial = this.m_rscene.materialBlock.createSimpleMaterial( occDeco );
        }
        else {
            occMaterial = new OccBlurMaterial( false );
            occMaterial.setShadowRadius(this.m_shadowRadius);
        }
        
        occBlurPlane =  new Plane3DEntity();
        occBlurPlane.setMaterial( occMaterial );
        occBlurPlane.initializeXOY(-1,-1,2,2, [this.m_fboDepth.getRTTAt(0)]);
        this.m_rscene.addEntity(occBlurPlane, 1);
        this.m_verOccBlurPlane = occBlurPlane;

        if(occDeco != null) {
            occDeco = new OccBlurDecorator(true, this.m_fboOccBlurV.getRTTAt(0), this.m_shadowRadius);
            occMaterial = this.m_rscene.materialBlock.createSimpleMaterial( occDeco );
        }
        else {
            occMaterial = new OccBlurMaterial( true );
            occMaterial.setShadowRadius(this.m_shadowRadius);
        }

        occBlurPlane =  new Plane3DEntity();
        occBlurPlane.setMaterial( occMaterial );
        occBlurPlane.initializeXOY(-1,-1,2,2, [this.m_fboOccBlurV.getRTTAt(0)]);
        this.m_rscene.addEntity(occBlurPlane, 2);
        this.m_horOccBlurPlane = occBlurPlane;

        
        this.m_depMaterial.__$attachThis();

        //  let viewWidth: number = 1024.0;
        //  let viewHeight: number = 1024.0;
        let viewWidth: number = this.m_shadowViewW;
        let viewHeight: number = this.m_shadowViewH;
        this.m_direcCamera = new CameraBase();
        this.m_direcCamera.lookAtRH(new Vector3D(600.0,800.0,-600.0), new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,1.0,0.0));
        this.m_direcCamera.orthoRH(0.1,1900.0, -0.5 * viewHeight, 0.5 * viewHeight, -0.5 * viewWidth, 0.5 * viewWidth);
        this.m_direcCamera.setViewXY(0,0);
        this.m_direcCamera.setViewSize(viewWidth, viewHeight);
        this.m_direcCamera.update();
        

        let frustrum:FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustrum.initiazlize( this.m_direcCamera );
        //frustrum.setScaleXYZ(0.5,0.5,0.5);
        this.m_rscene.addEntity( frustrum, 3);
        
        let testMatrix: Matrix4 = new Matrix4();
        testMatrix.identity();
        testMatrix.setScaleXYZ(0.5,0.5,0.5);
        testMatrix.setTranslationXYZ(0.5,0.5,0.5);
        console.log("testMatrix shadowMatrix: ");
        console.log(testMatrix.toString());

        let shadowMatrix: Matrix4 = new Matrix4();
        
        shadowMatrix.copyFrom(this.m_direcCamera.getVPMatrix());
        shadowMatrix.append(testMatrix);
        
        let shadowTex = this.m_fboOccBlurH.getRTTAt(0);
        //let shadowTex: TextureProxy = this.m_fboDepth.getRTTAt(0);
        let shadowMaterial: ShadowEntityMaterial = new ShadowEntityMaterial();
        // add common 3d display entity
        let plane:Plane3DEntity = new Plane3DEntity();
        shadowMaterial = new ShadowEntityMaterial();
        shadowMaterial.setShadowRadius(this.m_shadowRadius);
        shadowMaterial.setShadowBias(this.m_shadowBias);
        shadowMaterial.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
        shadowMaterial.setShadowMatrix( shadowMatrix );
        shadowMaterial.setDirec(this.m_direcCamera.getNV());
        plane.setMaterial(shadowMaterial);
        plane.initializeXOZ(-600.0, -600.0, 1200.0, 1200.0, [this.getImageTexByUrl("static/assets/brickwall_big.jpg"), shadowTex]);
        plane.setXYZ(0.0, -1.0, 0.0);
        this.m_rscene.addEntity(plane);
        this.m_targetEntity = plane;

        let box:Box3DEntity = new Box3DEntity();
        shadowMaterial = new ShadowEntityMaterial();
        shadowMaterial.setShadowRadius(this.m_shadowRadius);
        shadowMaterial.setShadowBias(this.m_shadowBias);
        shadowMaterial.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
        shadowMaterial.setShadowMatrix( shadowMatrix );
        shadowMaterial.setDirec(this.m_direcCamera.getNV());
        box.setMaterial(shadowMaterial);        
        box.initializeCube(200.0, [this.getImageTexByUrl("static/assets/metal_02.jpg"), shadowTex]);
        
        this.m_rscene.addEntity(box);
        box.setRotationXYZ(Math.random() * 300.0,Math.random() * 300.0,Math.random() * 300.0);
        box.setXYZ(230.0,100.0,0.0);
        box.update();
        
        let cyl:Cylinder3DEntity = new Cylinder3DEntity();
        shadowMaterial = new ShadowEntityMaterial();
        shadowMaterial.setShadowRadius(this.m_shadowRadius);
        shadowMaterial.setShadowBias(this.m_shadowBias);
        shadowMaterial.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
        shadowMaterial.setShadowMatrix( shadowMatrix );
        shadowMaterial.setDirec(this.m_direcCamera.getNV());
        cyl.setMaterial(shadowMaterial);
        cyl.initialize(80.0,200.0,20,[this.getImageTexByUrl("static/assets/noise.jpg"), shadowTex]);
        this.m_rscene.addEntity(cyl);
        cyl.setXYZ(-230.0,100.0,0.0);

        
        let sph:Sphere3DEntity = new Sphere3DEntity();
        shadowMaterial = new ShadowEntityMaterial();
        shadowMaterial.setShadowRadius(this.m_shadowRadius);
        shadowMaterial.setShadowBias(this.m_shadowBias);
        shadowMaterial.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
        shadowMaterial.setShadowMatrix( shadowMatrix );
        shadowMaterial.setDirec(this.m_direcCamera.getNV());
        sph.setMaterial(shadowMaterial);
        sph.initialize(80.0,20.0,20,[this.getImageTexByUrl("static/assets/metal_02.jpg"), shadowTex]);
        this.m_rscene.addEntity(sph);
        sph.setXYZ(-230.0,100.0,-200.0);

        
        sph = new Sphere3DEntity();
        shadowMaterial = new ShadowEntityMaterial();
        shadowMaterial.setShadowRadius(this.m_shadowRadius);
        shadowMaterial.setShadowBias(this.m_shadowBias);
        shadowMaterial.setShadowSize(this.m_shadowMapW, this.m_shadowMapH);
        shadowMaterial.setShadowMatrix( shadowMatrix );
        shadowMaterial.setDirec(this.m_direcCamera.getNV());
        sph.setMaterial(shadowMaterial);
        sph.initialize(80.0,20.0,20,[this.getImageTexByUrl("static/assets/metal_08.jpg"), shadowTex]);
        sph.setScaleXYZ(1.2,1.2,1.2);
        sph.setXYZ(-40.0,100.0,-180.0);
        this.m_rscene.addEntity(sph);


        //box_wood01
        
        let depthScrPlane: ScreenFixedAlignPlaneEntity =  new ScreenFixedAlignPlaneEntity();
        depthScrPlane.initialize(-1.0,-1.0,0.4,0.4, [this.m_fboDepth.getRTTAt(0)]);
        //depthScrPlane.initialize(-1.0,-1.0,2.0,2.0, [this.m_fboDepth.getRTTAt(0)]);
        this.m_rscene.addEntity(depthScrPlane, 3);

        let occBlurVScrPlane: ScreenFixedAlignPlaneEntity =  new ScreenFixedAlignPlaneEntity();
        occBlurVScrPlane.initialize(-0.59,-1.0, 0.4,0.4, [this.m_fboOccBlurV.getRTTAt(0)]);
        //occBlurVScrPlane.initialize(-1.0,-1.0,2.0,2.0, [this.m_fboOccBlurV.getRTTAt(0)]);
        this.m_rscene.addEntity(occBlurVScrPlane, 3);
        ///*
        let occBlurHScrPlane: ScreenFixedAlignPlaneEntity =  new ScreenFixedAlignPlaneEntity();
        occBlurHScrPlane.initialize(-0.18,-1.0, 0.4,0.4, [this.m_fboOccBlurH.getRTTAt(0)]);
        //occBlurHScrPlane.initialize(-1.0,-1.0,2.0,2.0, [this.m_fboOccBlurH.getRTTAt(0)]);
        this.m_rscene.addEntity(occBlurHScrPlane, 3);
        //*/
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
    run(): void {

        //  if(this.m_flag) {
        //      this.m_flag = false;
        //  }
        //  else {
        //      return;
        //  }
        
        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_rscene.update(true);

        this.m_rscene.useCamera(this.m_direcCamera);
        this.m_fboDepth.run(true,true);
        this.m_rscene.useMainCamera();

        ///*
        this.m_fboOccBlurV.run();
        this.m_fboOccBlurH.run();
        //*/
        

        this.m_fboDepth.setRenderToBackBuffer();
        
        this.m_rscene.runAt(0);
        
        this.m_rscene.runAt(3);
        this.m_rscene.runEnd();

    }
}
export default DemoBase;