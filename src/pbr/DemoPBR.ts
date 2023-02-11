
import Vector3D from "../vox/math/Vector3D";
import EventBase from "../vox/event/EventBase";
import MouseEvent from "../vox/event/MouseEvent";
import RendererDevice from "../vox/render/RendererDevice";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import RendererSubScene from "../vox/scene/RendererSubScene";
import DefaultPBRUI from "./mana/DefaultPBRUI";
import DebugFlag from "../vox/debug/DebugFlag";
import PBRScene from "./mana/PBRScene";
import OcclusionPostOutline from "../renderingtoy/mcase/outline/OcclusionPostOutline";

import { IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import ScreenPlaneMaterial from "../vox/material/mcase/ScreenPlaneMaterial";
export class DemoPBR implements IShaderLibListener {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_ruisc: RendererSubScene = null;
    private m_statusDisp = new RenderStatusDisplay();

    private m_stageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController = new CameraZoomController();

    private m_materialCtx = new DebugMaterialContext();

    private m_postOutline = new OcclusionPostOutline();
    private m_uiModule = new DefaultPBRUI();
    private m_pbrScene: PBRScene = null;
    private m_lookV = new Vector3D(0.0,300.0,0.0);

    initialize(): void {

        console.log("DemoPBR::initialize()......");
        if (this.m_rscene == null) {
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            RendererDevice.SetWebBodyColor();

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45,50.0,10000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(2000.0, 2000.0, 2000.0);
            rparam.setCamLookAtPos( this.m_lookV.x, this.m_lookV.y, this.m_lookV.z );
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
            this.m_rscene.updateCamera();
            
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_CLICK, this, this.mouseBgClick);
            this.m_rscene.addEventListener(EventBase.RESIZE, this, this.resize);
            this.m_postOutline.initialize(this.m_rscene, 4, [0,1]);
            this.m_postOutline.setFBOSizeScaleRatio(0.5);
            this.m_postOutline.setOutlineThickness(1.0);
            this.m_postOutline.setOutlineDensity(2.3);
            this.m_postOutline.setOcclusionDensity(0.1);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            
            this.m_statusDisp.initialize();

            let mcParam = new MaterialContextParam();
            mcParam.pointLightsTotal = 0;
            mcParam.directionLightsTotal = 2;
            mcParam.spotLightsTotal = 0;
            mcParam.vsmFboIndex = 2;
            mcParam.loadAllShaderCode = true;
            mcParam.vsmEnabled = true;
            mcParam.lambertMaterialEnabled = false;
            mcParam.pbrMaterialEnabled = true;
            this.m_materialCtx.addShaderLibListener( this );
            this.m_materialCtx.initialize(this.m_rscene, mcParam); 
            
        }
    }
    private initTest(): void {

        /*
        let scrPlane: ScreenAlignPlaneEntity =  new ScreenAlignPlaneEntity();
        //scrPlane.initialize(-0.9,-0.9,0.4,0.4, [this.m_fboIns.getRTTAt(0)]);
        scrPlane.initialize(-1,-1,2,2);
        (scrPlane.getMaterial() as any).setRGB3f(1.0, 0.5, 0.3);
        //scrPlane.setOffsetRGB3f(0.1,0.1,0.1);
        this.m_rscene.addEntity(scrPlane, 0);

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity( axis );
        //*/
        //ScreenPlaneMaterial
        let material = new ScreenPlaneMaterial();
        // material.initializeByCodeBuf(true);
        //material.setTextureList([this.m_materialCtx.getTextureByUrl("static/assets/default.jpg")]);
        material.setRGB3f(0.0,0.2,0.3);
        let horOccBlurPlane = this.m_rscene.entityBlock.createEntity();
        // horOccBlurPlane.copyMeshFrom(verOccBlurPlane);
        horOccBlurPlane.copyMeshFrom( this.m_rscene.entityBlock.unitXOYPlane );
        horOccBlurPlane.setMaterial( material );
        horOccBlurPlane.setScaleXYZ(1.8, 1.8, 1.0);
        horOccBlurPlane.update();
        this.m_rscene.addEntity( horOccBlurPlane );
    }
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {

        // this.initTest();
        this.initPBRSC();
    }
    private initPBRSC(): void {

        this.m_uiModule.initialize(this.m_rscene, this.m_materialCtx, true);
        this.m_ruisc = this.m_uiModule.ruisc;
        this.m_uiModule.close();
        this.m_uiModule.postOutline = this.m_postOutline;

        this.m_pbrScene = new PBRScene();
        this.m_pbrScene.initialize(this.m_rscene, this.m_materialCtx, this.m_uiModule);
    }

    private m_runFlag: boolean = true;
    private mouseDown(evt: any): void {
        this.m_runFlag = true;
        DebugFlag.Flag_0 = 1;
    }
    private mouseUp(evt: any): void {
    }
    private mouseBgClick(evt: any): void {
        this.m_uiModule.deselectParamEntity();
    }
    private resize(evt: any): void {

        if (this.m_ruisc != null) {
            let stage = this.m_ruisc.getStage3D();
            this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        }
    }
    private update(): void {

        this.m_statusDisp.update(true);
        if(this.m_pbrScene != null) {
            this.m_pbrScene.update();
        }
    }

    runT(): void {
        this.m_rscene.run();
    }
    run(): void {

        if(this.m_pbrScene != null) {
            /*
            if(this.m_runFlag) {
                this.m_runFlag = false;
            }
            else {
                return;
            }
            //*/

            this.update();
            //  if (this.m_ruisc != null) {
            //      let stage = this.m_ruisc.getStage3D();
            //      this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
            //  }
            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(this.m_lookV, 30.0);

            //  // current rendering strategy
            //  this.m_rscene.run(true);
            //  if(this.m_ruisc != null) this.m_ruisc.run( true );
            //  DebugFlag.Flag_0 = 0;
            //  return;

            this.renderBegin();

            this.render();

            DebugFlag.Flag_0 = 0;
        }
    }
    private renderBegin(): void {
        let pickFlag = false;
        if (this.m_ruisc != null) {
            this.m_ruisc.runBegin(true, true);
            this.m_ruisc.update(false, true);
            pickFlag = this.m_ruisc.isRayPickSelected();
            
        }
        this.m_stageDragSwinger.setEnabled(!pickFlag);
        let uiFlag = this.m_uiModule.isOpen();
        this.m_rscene.runBegin(false);
        // 如果ui panel 打开, 才会允许 this.m_rscene 鼠标事件检测到3d物体
        this.m_rscene.setRayTestEnabled(uiFlag);
        this.m_rscene.update(false, !pickFlag);
    }
    private render(): void {

        // ------------------------------------- draw(render) scene begin
        this.m_rscene.renderBegin();
        
        // ------------------------------------- draw(render) scene effect data
        this.m_pbrScene.prerender();

        //  // ------------------------------------- draw(render) outline begin
        //  if (this.m_uiModule.isOpen() && this.m_uiModule.getParamEntity() != null) {
        //      this.m_stencilOutline.setTarget(this.m_uiModule.getParamEntity().entity);
        //      this.m_stencilOutline.startup();
        //  }
        //  else {
        //      this.m_stencilOutline.quit();
        //  }
        //  this.m_stencilOutline.drawBegin();
        // ------------------------------------- draw(render) normal scene begin
        this.m_pbrScene.render();
        //  // ------------------------------------- draw(render) normal scene end
        //  this.m_stencilOutline.draw();
        //  // ------------------------------------- draw(render) outline end
        if (this.m_uiModule.isOpen() && this.m_uiModule.getParamEntity() != null) {
            this.m_postOutline.setTargetList( [this.m_uiModule.getParamEntity().entity] );
            
            this.m_postOutline.drawBegin();
            this.m_postOutline.draw();
            this.m_postOutline.drawEnd();
        }
        this.m_rscene.runEnd();
        // ------------------------------------- draw(render) scene end

        // ------------------------------------- render ui
        if (this.m_ruisc != null) {
            this.m_ruisc.renderBegin();
            this.m_ruisc.run(false);
            this.m_ruisc.runEnd();
        }
    }
}
export default DemoPBR;