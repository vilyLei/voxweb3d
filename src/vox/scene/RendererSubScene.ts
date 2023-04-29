/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 独立的渲染场景子集,也就是子渲染场景类,字渲染场景拥有子集独立的Camera3D对象和view port 区域
// 不同的子场景，甚至可以拥有独立的matrix3D这样的数据池子

import MathConst from "../../vox/math/MathConst";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import SubStage3D from "../../vox/display/SubStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import CameraBase from "../../vox/view/CameraBase";
import RendererParam from "../../vox/scene/RendererParam";
import IRendererInstance from "../../vox/scene/IRendererInstance";
import IRenderer from "../../vox/scene/IRenderer";
import IRendererScene from "../../vox/scene/IRendererScene";
import RendererSpace from "../../vox/scene/RendererSpace";
import IEvt3DController from "../../vox/scene/IEvt3DController";
import IRenderNode from "../../vox/scene/IRenderNode";
import RunnableQueue from "../../vox/base/RunnableQueue";
import RendererSceneBase from "./RendererSceneBase";
import IRendererParam from "./IRendererParam";
import EntityTransUpdater from "./EntityTransUpdater";
export default class RendererSubScene extends RendererSceneBase implements IRenderer, IRendererScene, IRenderNode {
    protected m_perspectiveEnabled = true;
    protected m_parent: IRendererScene = null;
    constructor(parent: IRendererScene, renderer: IRendererInstance, evtFlowEnabled: boolean) {
        super(1024);
        this.m_evtFlowEnabled = evtFlowEnabled;
        this.m_parent = parent;
        this.m_renderer = renderer;
        this.m_shader = renderer.getDataBuilder().getRenderShader();
        this.m_localRunning = true;
    }
    createSubScene(rparam: IRendererParam = null, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene{
        return this.m_parent.createSubScene(rparam, renderProcessesTotal, createNewCamera);
    }
    getCurrentStage3D(): IRenderStage3D {
        return this.m_currStage3D;
    }
    getCamera(): CameraBase {
        return this.m_camera as CameraBase;
    }
    setEvt3DController(evt3DCtr: IEvt3DController): void {
        if (evt3DCtr != null) {
            if (this.m_currStage3D == null) {
                this.m_currStage3D = new SubStage3D(this.m_rproxy.getRCUid(), null);
                this.m_currStage3D.uProbe = this.m_rproxy.uniformContext.createUniformVec4Probe(1);
            }
            evt3DCtr.initialize(this.getStage3D(), this.m_currStage3D);
            evt3DCtr.setRaySelector(this.m_rspace.getRaySelector());
        }
        this.m_evt3DCtr = evt3DCtr;
    }
    initialize(rparam: RendererParam, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene {
        if (this.m_rproxy == null) {
            if (renderProcessesTotal < 1) {
                renderProcessesTotal = 1;
            } else if (renderProcessesTotal > 32) {
                renderProcessesTotal = 32;
            }
            let selfT: any = this;
            selfT.runnableQueue = new RunnableQueue();
            this.m_transUpdater = new EntityTransUpdater();

            this.m_rparam = rparam;
            this.m_perspectiveEnabled = rparam.cameraPerspectiveEnabled;
            
            for (; renderProcessesTotal >= 0;) {
                const process = this.m_renderer.appendProcess(rparam.batchEnabled, rparam.processFixedState);
                this.m_processids[this.m_processidsLen] = process.getRPIndex();
                this.m_processidsLen++;
                --renderProcessesTotal;
            }
            this.m_rcontext = this.m_renderer.getRendererContext();
            this.m_rproxy = this.m_rcontext.getRenderProxy();
            this.m_adapter = this.m_rproxy.getRenderAdapter();
            this.m_stage3D = this.m_rproxy.getStage3D();
            this.m_viewX = this.m_stage3D.getViewX();
            this.m_viewY = this.m_stage3D.getViewY();
            this.m_viewW = this.m_stage3D.getViewWidth();
            this.m_viewH = this.m_stage3D.getViewHeight();
            this.m_camera = createNewCamera ? this.createMainCamera() : this.m_rproxy.getCamera();
            if (this.m_rspace == null) {
                let sp = new RendererSpace();
                sp.initialize(this.m_renderer, this.m_camera);
                this.m_rspace = sp;
            }
        }
        return this;
    }

    private createMainCamera(): IRenderCamera {
        this.m_camera = new CameraBase();
        this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
        this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
        let vec3 = this.m_rparam.camProjParam;
        if (this.m_perspectiveEnabled) {
            this.m_camera.perspectiveRH(MathConst.DegreeToRadian(vec3.x), this.m_viewW / this.m_viewH, vec3.y, vec3.z);
        }
        else {
            this.m_camera.orthoRH(vec3.y, vec3.z, -0.5 * this.m_viewH, 0.5 * this.m_viewH, -0.5 * this.m_viewW, 0.5 * this.m_viewW);
        }
        this.m_camera.lookAtRH(this.m_rparam.camPosition, this.m_rparam.camLookAtPos, this.m_rparam.camUpDirect);
        this.m_camera.update();
        return this.m_camera;
    }
    cameraLock(): void {
        this.m_camera.lock();
    }
    cameraUnlock(): void {
        this.m_camera.unlock();
    }
    /**
     * the function only resets the renderer instance rendering status.
     * you should use it before the run or runAt function is called.
     */
    renderBegin(contextBeginEnabled: boolean = false): void {

        if (contextBeginEnabled) {
            this.m_rcontext.renderBegin();
        }
        const ry = this.m_rproxy;
        if (this.m_rproxy.getCamera() != this.m_camera) {
            if (this.m_rproxy.isAutoSynViewAndStage()) {
                this.m_viewX = ry.getViewX();
                this.m_viewY = ry.getViewY();
                this.m_viewW = ry.getViewWidth();
                this.m_viewH = ry.getViewHeight();
            }
            this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
            this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
            ry.setRCViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH, ry.isAutoSynViewAndStage());
            ry.reseizeRCViewPort();
        }
        // if(this.m_clearColorFlag) {
        //     // ry.setClearColor(this.m_clearColor);
        //     // ry.adapter.clearColor(this.m_clearColor);
        // }
        this.m_camera.update();
        this.m_rcontext.updateCameraDataFromCamera(this.m_camera);
        this.m_shader.renderBegin();
        if (this.m_accessor != null) {
            this.m_accessor.renderBegin(this);
        }
    }
    /**
     * the function resets the renderer scene status.
     * you should use it on the frame starting time.
     */
    runBegin(autoCycle: boolean = true, contextBeginEnabled: boolean = false): void {

        if (autoCycle && this.m_autoRunEnabled) {
            if (this.m_runFlag >= 0) this.runEnd();
            this.m_runFlag = 0;
        }
        this.renderBegin(contextBeginEnabled);
        if (this.m_rspace != null) {
            this.m_rspace.setCamera(this.m_camera);
            this.m_rspace.runBegin();
        }
    }
    render(): void {
        if (this.m_rproxy != null) {
            this.run(true);
        }
    }
    useCamera(camera: IRenderCamera, syncCamView: boolean = false): void {
        this.m_parent.useCamera(camera, syncCamView);
    }
    useMainCamera(): void {
        this.m_parent.useMainCamera();
    }
    updateCamera(): void {
        if (this.m_camera != null) {
            this.m_camera.update();
        }
    }
}