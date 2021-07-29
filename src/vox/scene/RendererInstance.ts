/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RSEntityFlag from '../../vox/scene/RSEntityFlag';
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import RenderAdapter from "../../vox/render/RenderAdapter";
import RenderProxy from "../../vox/render/RenderProxy";

import CameraBase from "../../vox/view/CameraBase";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import RODataBuilder from "../../vox/render/RODataBuilder";
import RendererParam from "../../vox/scene/RendererParam";
import IRenderProcess from "../../vox/render/IRenderProcess";
import RenderProcess from "../../vox/render/RenderProcess";
import RenderProcessBuider from "../../vox/render/RenderProcessBuider";
import ROVtxBuilder from "../../vox/render/ROVtxBuilder";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import IRenderer from "../../vox/scene/IRenderer";

import { RPOUnitBuilder } from "../../vox/render/RPOUnitBuilder";
import RPONodeBuilder from "../../vox/render/RPONodeBuilder";
import DispEntity3DManager from "../../vox/scene/DispEntity3DManager";

/**
 * kernal system, it is the renderer instance for the renderer runtime, it is very very very important class.
 */
export class RendererInstance implements IRenderer {
    private m_uid: number = -1;
    private static s_uid: number = 0;
    private m_entity3DMana: DispEntity3DManager = null;
    private m_processes: RenderProcess[] = [];
    private m_processesLen: number = 0;
    private m_sprocesses: RenderProcess[] = [];
    private m_sprocessesLen: number = 0;
    private m_renderProxy: RenderProxy = null;
    private m_adapter: RenderAdapter = null;
    private m_dataBuilder: RODataBuilder = null;
    private m_renderInsContext: RendererInstanceContext = null;
    private m_batchEnabled: boolean = true;
    private m_processFixedState: boolean = true;
    private m_rpoUnitBuilder: RPOUnitBuilder = new RPOUnitBuilder();
    private m_rpoNodeBuilder: RPONodeBuilder = new RPONodeBuilder();
    private m_processBuider: RenderProcessBuider = new RenderProcessBuider();
    private m_roVtxBuild: ROVtxBuilder = null;
    private m_stage3D: IRenderStage3D = null;
    private m_fixProcess: RenderProcess = null;
    constructor() {
        this.m_uid = RendererInstance.s_uid++;
        this.m_renderInsContext = new RendererInstanceContext(this.m_uid);
    }
    __$setStage3D(stage3D: IRenderStage3D): void {
        if (stage3D != null && this.m_stage3D == null) {
            this.m_stage3D = stage3D;
        }
    }
    getUid(): number {
        return this.m_uid;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_uid;
    }
    getRPONodeBuilder(): RPONodeBuilder {
        return this.m_rpoNodeBuilder;
    }
    getDataBuilder(): RODataBuilder {
        return this.m_dataBuilder;
    }
    getRendererContext(): RendererInstanceContext {
        return this.m_renderInsContext;
    }
    getRenderProxy(): RenderProxy {
        return this.m_renderProxy;
    }

    getStage3D(): IRenderStage3D {
        return this.m_renderProxy.getStage3D();
    }
    getViewX(): number { return this.m_adapter.getViewportX(); }
    getViewY(): number { return this.m_adapter.getViewportY(); }
    getViewWidth(): number { return this.m_adapter.getViewportWidth(); }
    getViewHeight(): number { return this.m_adapter.getViewportHeight(); }
    getCamera(): CameraBase {
        if (this.m_renderProxy == null) {
            return this.m_renderInsContext.getCamera();
        }
        return null;
    }
    createCamera(): CameraBase {
        if (this.m_renderProxy == null) {
            return this.m_renderProxy.createCamera();
        }
    }
    useCamera(camera: CameraBase, syncCamView: boolean = false): void {
    }
    useMainCamera(): void {
    }
    updateCamera(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.updateCamera();
        }
    }
    initialize(param: RendererParam = null): void {
        if (this.m_renderProxy == null) {
            if (param == null) param = new RendererParam();
            this.m_batchEnabled = param.batchEnabled;
            this.m_processFixedState = param.processFixedState;

            this.m_renderProxy = this.m_renderInsContext.getRenderProxy();

            this.m_dataBuilder = new RODataBuilder();
            this.m_roVtxBuild = new ROVtxBuilder();
            this.m_renderInsContext.setCameraParam(param.camProjParam.x, param.camProjParam.y, param.camProjParam.z);
            this.m_renderInsContext.setMatrix4AllocateSize(param.getMatrix4AllocateSize());
            this.m_renderInsContext.initialize(param, this.m_stage3D, this.m_dataBuilder, this.m_roVtxBuild);
            this.m_adapter = this.m_renderProxy.getRenderAdapter();
            this.m_uid = this.m_renderProxy.getUid();
            this.m_dataBuilder.initialize(this.m_renderProxy, this.m_rpoUnitBuilder, this.m_processBuider, this.m_roVtxBuild);
            this.m_renderInsContext.initManager(this.m_dataBuilder);
            this.m_entity3DMana = new DispEntity3DManager(this.m_uid, this.m_dataBuilder, this.m_rpoUnitBuilder, this.m_processBuider);

            this.m_fixProcess = this.createSeparatedProcess() as RenderProcess;
            this.appendProcess(this.m_batchEnabled, this.m_processFixedState);
        }
    }
    /**
     * update all data or status of the renderer runtime
     * should call this function per frame
     */
    update(): void {
        this.m_renderProxy.Texture.update();
        this.m_renderProxy.Vertex.update();
        this.m_entity3DMana.update();
    }
    updateAllProcess(): void {
        for (let i: number = 0; i < this.m_processesLen; ++i) {
            this.m_processes[i].update();
        }
    }
    updateProcessAt(processIndex: number): void {
        if (processIndex > -1 && processIndex < this.m_processesLen) {
            this.m_processes[processIndex].update();
        }
    }
    setEntityManaListener(listener: any): void {
        this.m_entity3DMana.entityManaListener = listener;
    }
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processIndex this destination renderer process index of the m_processes array.
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
     */
    addEntity(entity: IRenderEntity, processIndex: number = 0, deferred: boolean = true): void {
        if (entity != null) {
            if (entity.__$testRendererEnabled()) {
                if (processIndex > -1 && processIndex < this.m_processesLen) {
                    this.m_entity3DMana.addEntity(entity, this.m_processes[processIndex].getUid(), deferred);
                }
            }
        }
    }
    addEntityToProcess(entity: IRenderEntity, process: IRenderProcess, deferred: boolean = true): void {
        if (process != null && entity != null) {
            if (entity.__$testRendererEnabled()) {
                if (process.getRCUid() == this.m_uid) {
                    this.m_entity3DMana.addEntity(entity, process.getUid(), deferred);
                }
            }
        }
    }
    /**
     * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
     * move rendering runtime displayEntity to different renderer process
     */
    moveEntityToProcessAt(entity: IRenderEntity, dstProcessIndex: number): void {
        if (entity != null && entity.getRendererUid() == this.m_uid) {
            if (entity.isRenderEnabled()) {
                if (dstProcessIndex > -1 && dstProcessIndex < this.m_processesLen) {
                    let srcUid: number = entity.getDisplay().__$$runit.getRPROUid();
                    let src: RenderProcess = this.m_processBuider.getNodeByUid(srcUid) as RenderProcess;
                    let dst: RenderProcess = this.m_processes[dstProcessIndex];
                    if (src != dst) {
                        src.removeDispUnit(entity.getDisplay());
                        entity.__$rseFlag = dst.getSortEnabled() ? RSEntityFlag.AddSortEnabled(entity.__$rseFlag) : RSEntityFlag.RemoveSortEnabled(entity.__$rseFlag);
                        dst.addDisp(entity.getDisplay());
                    }
                }
            }
        }
    }
    moveEntityToProcess(entity: IRenderEntity, dstProcess: IRenderProcess): void {
        if (dstProcess != null && entity != null && entity.getRendererUid() == this.m_uid) {
            if (entity.isRenderEnabled()) {
                let srcUid: number = entity.getDisplay().__$$runit.getRPROUid();
                let src: RenderProcess = this.m_processBuider.getNodeByUid(srcUid) as RenderProcess;
                if (src != dstProcess) {
                    let dst: RenderProcess = dstProcess as RenderProcess;
                    src.removeDispUnit(entity.getDisplay());
                    entity.__$rseFlag = dstProcess.getSortEnabled() ? RSEntityFlag.AddSortEnabled(entity.__$rseFlag) : RSEntityFlag.RemoveSortEnabled(entity.__$rseFlag);
                    dst.addDisp(entity.getDisplay());
                }
            }
        }
    }
    /**
     * remove entity from the renderer instance
     * @param entity IRenderEntity instance
     */
    removeEntity(entity: IRenderEntity): void {
        if (entity != null && entity.getRendererUid() == this.m_uid) {
            this.m_entity3DMana.removeEntity(entity);
        }
    }
    /**
     * remove entity from the renderer process
     * @param IRenderEntity IRenderEntity instance
     * @param process RenderProcess instance
     */
    removeEntityFromProcess(entity: IRenderEntity, process: RenderProcess): void {
        if (process != null && process.getRCUid() == this.m_uid) {
            if (entity != null && entity.getRendererUid() == this.m_uid) {
                process.removeDisp(entity.getDisplay());
            }
        }
    }
    /**
     * remove entity from the renderer process by process index
     * @param IRenderEntity IRenderEntity instance
     * @param processIndex RenderProcess instance index in renderer instance
     */
    removeEntityByProcessIndex(entity: IRenderEntity, processIndex: number): void {
        if (processIndex >= 0 && processIndex < this.m_processesLen) {
            if (entity != null && entity.getRendererUid() == this.m_uid) {
                this.m_processes[processIndex].removeDisp(entity.getDisplay());
            }
        }
    }
    setProcessSortEnabledAt(processIndex: number, sortEnabled: boolean): void {
        if (processIndex >= 0 && processIndex < this.m_processesLen) {
            this.m_processes[processIndex].setSortEnabled(sortEnabled);
        }
    }
    setProcessSortEnabled(process: IRenderProcess, sortEnabled: boolean): void {
        if (process != null && process.getRCUid() == this.m_uid) {
            let p: RenderProcess = process as RenderProcess;
            p.setSortEnabled(sortEnabled);
        }
    }
    /**
     * append a new renderer process instance
     * @param batchEnabled batch renderer runtime resource data
     * @param processFixedState the process is fix renderer state
     * @returns 
     */
    appendProcess(batchEnabled: boolean = true, processFixedState: boolean = false): IRenderProcess {
        this.m_processBuider.setCreateParams(
            this.m_dataBuilder.getRenderShader(),
            this.m_rpoNodeBuilder,
            this.m_rpoUnitBuilder,
            this.m_renderProxy.Vertex,
            batchEnabled,
            processFixedState
        );

        let process: RenderProcess = this.m_processBuider.create() as RenderProcess;

        this.m_processes.push(process);
        process.setRendererParam(this.m_renderProxy, this.m_processesLen);
        ++this.m_processesLen;
        return process;
    }
    /**
     * append a independent new renderer process instance, and separate the renderer process from the renderer rendering control
     * @param batchEnabled batch renderer runtime resource data
     * @param processFixedState the process is fix renderer state
     */
    createSeparatedProcess(batchEnabled: boolean = true, processFixedState: boolean = false): IRenderProcess {
        this.m_processBuider.setCreateParams(
            this.m_dataBuilder.getRenderShader(),
            this.m_rpoNodeBuilder,
            this.m_rpoUnitBuilder,
            this.m_renderProxy.Vertex,
            batchEnabled,
            processFixedState
        );
        let process: RenderProcess = this.m_processBuider.create() as RenderProcess;
        this.m_sprocesses.push(process);
        process.setRendererParam(this.m_renderProxy, this.m_sprocessesLen);
        return process;
    }
    setRendererProcessParam(index: number, batchEnabled: boolean, processFixedState: boolean): void {
        if (index > -1 && index < this.m_processesLen) {
            this.m_processes[index].setRenderParam(batchEnabled, processFixedState);
        }
    }
    getProcessAt(index: number): IRenderProcess {
        if (index > -1 && index < this.m_processesLen) {
            return this.m_processes[index];
        }
        return null;
    }
    showInfoAt(index: number): void {
        if (index > -1 && index < this.m_processesLen) {
            this.m_processes[index].showInfo();
        }
    }
    getProcessesTotal(): number {
        return this.m_processesLen;
    }
    updateMaterialUniformToCurrentShd(material: IRenderMaterial): void {
        this.m_dataBuilder.getRenderShader().useUniformToCurrentShd(material.__$uniform);
    }
    /**
     * 绘制已经完全加入渲染器了渲染资源已经准备完毕的entity
     * 要锁定Material才能用这种绘制方式,再者这个,这种方式比较耗性能，只能用在特殊的地方
     */
    drawEntityByLockMaterial(entity: IRenderEntity, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
        if (entity != null && entity.getVisible() && entity.getRendererUid() == this.m_uid && !this.m_renderProxy.isContextLost()) {
            this.m_fixProcess.drawLockMaterialByDisp(entity.getDisplay(), useGlobalUniform, forceUpdateUniform);
        }
    }
    /**
     * 在任意阶段绘制一个指定的 entity,只要其资源数据准备完整
     */
    drawEntity(entity: IRenderEntity): void {
        if (entity != null && entity.getVisible() && !this.m_renderProxy.isContextLost()) {
            if (entity.getRendererUid() == this.m_uid) {
                this.m_fixProcess.drawDisp(entity.getDisplay());
            }
            else if (entity.__$testRendererEnabled()) {
                this.m_entity3DMana.addEntity(entity, this.m_fixProcess.getUid(), false);
            }
        }
    }
    /**
     * run the specific renderer process by its index in the renderer instance
     * @param index the renderer process index in the renderer instance
     */
    runAt(index: number): void {
        if (!this.m_renderProxy.isContextLost()) {
            this.m_processes[index].run();
        }
    }
    runProcess(process: IRenderProcess): void {
        if (process.getRCUid() == this.m_uid && !this.m_renderProxy.isContextLost()) {
            process.run();
        }
    }
    runFromIndexTo(index: number): void {
        if (!this.m_renderProxy.isContextLost()) {
            for (let i: number = index; i < this.m_processesLen; ++i) {
                this.m_processes[i].run();
            }
        }
    }
    /**
     * run all renderer processes in the renderer instance
     */
    run(): void {
        if (this.m_entity3DMana.isHaveEntity() && !this.m_renderProxy.isContextLost()) {
            for (let i: number = 0; i < this.m_processesLen; ++i) {
                this.m_processes[i].run();
            }
        }
    }
    getRenderUnitsTotal(): number {
        let total: number = 0;
        for (let i: number = 0; i < this.m_processesLen; ++i) {
            total += this.m_processes[i].getUnitsTotal();
        }
        return total;
    }
    renderflush(): void {
        this.m_renderProxy.flush();
    }
    toString(): string {
        return "[RendererInstance(uid = " + this.m_uid + ")]";
    }
}

export default RendererInstance;