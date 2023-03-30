/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RSEntityFlag from '../../vox/scene/RSEntityFlag';
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import { IRenderCamera } from '../render/IRenderCamera';
import RenderProxy from "../../vox/render/RenderProxy";

import { IShaderProgramBuilder } from "../../vox/material/IShaderProgramBuilder";
import { ShaderUniformContext } from "../../vox/material/ShaderUniformContext";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import RODataBuilder from "../../vox/render/RODataBuilder";
import IRendererParam from "../../vox/scene/IRendererParam";
import IRenderProcess from "../../vox/render/IRenderProcess";
import RenderProcess from "../../vox/render/RenderProcess";
import RenderProcessBuider from "../../vox/render/RenderProcessBuider";
import ROVtxBuilder from "../../vox/render/ROVtxBuilder";
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import { RendererInstanceContextParam, RendererInstanceContext } from "../../vox/scene/RendererInstanceContext";
import { IRendererInstance } from "../../vox/scene/IRendererInstance";

import { RPOUnitBuilder } from "../../vox/render/RPOUnitBuilder";
import IRPONodeBuilder from "../../vox/render/IRPONodeBuilder";
import RPONodeBuilder from "../../vox/render/RPONodeBuilder";
import DispEntity3DManager from "../../vox/scene/DispEntity3DManager";
import IRenderNode from "../../vox/scene/IRenderNode";
import { ITextureBlock } from '../texture/ITextureBlock';
import IRenderEntityContainer from '../render/IRenderEntityContainer';

/**
 * kernal system instance, it is the renderer instance for the renderer runtime, it is very very very important class.
 */
export class RendererInstance implements IRendererInstance {
    private ___$$$$$$$Author = "VilyLei(vily313@126.com)";
    private m_uid = -1;
    private static s_uid = 0;
    private m_entity3DMana: DispEntity3DManager = null;
    private m_processes: RenderProcess[] = [];
    private m_processesLen = 0;
    private m_sprocesses: RenderProcess[] = [];
    private m_sprocessesLen = 0;
    private m_renderProxy: RenderProxy = null;
    private m_adapter: IRenderAdapter = null;
    private m_dataBuilder: RODataBuilder = null;
    private m_renderInsContext: RendererInstanceContext = null;
    private m_batchEnabled = true;
    private m_processFixedState = true;
    private m_rpoUnitBuilder = new RPOUnitBuilder();
    private m_rpoNodeBuilder = new RPONodeBuilder();
    private m_processBuider = new RenderProcessBuider();
    private m_roVtxBuilder: ROVtxBuilder = null;
    private m_stage3D: IRenderStage3D = null;
    private m_fixProcess: RenderProcess = null;

	readonly textureBlock: ITextureBlock = null;
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
    getRPONodeBuilder(): IRPONodeBuilder {
        return this.m_rpoNodeBuilder;
    }
    getDataBuilder(): RODataBuilder {
        return this.m_dataBuilder;
    }
    getRendererContext(): IRendererInstanceContext {
        return this.m_renderInsContext;
    }
    getRenderProxy(): RenderProxy {
        if (this.m_renderProxy != null) {
            return this.m_renderProxy;
        }
        this.m_renderProxy = this.m_renderInsContext.getRenderProxy();
        return this.m_renderProxy;
    }

    getStage3D(): IRenderStage3D {
        return this.m_renderProxy.getStage3D();
    }
    getViewX(): number { return this.m_adapter.getViewportX(); }
    getViewY(): number { return this.m_adapter.getViewportY(); }
    getViewWidth(): number { return this.m_adapter.getViewportWidth(); }
    getViewHeight(): number { return this.m_adapter.getViewportHeight(); }

    getCamera(): IRenderCamera {
        return this.m_renderInsContext.getCamera();
    }
    createCamera(): IRenderCamera {
        return null;
    }
    /**
     * @param camera IRenderCamera instance
     * @param syncCamView the default value is false
     */
    useCamera(camera: IRenderCamera, syncCamView: boolean = false): void {
    }
    useMainCamera(): void {
    }

    updateCamera(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.updateCamera();
        }
    }
    initialize(param: IRendererParam = null, camera: IRenderCamera = null, shdProgramBuider: IShaderProgramBuilder = null): void {

        if (this.m_dataBuilder == null && camera != null) {

            this.m_batchEnabled = param.batchEnabled;
            this.m_processFixedState = param.processFixedState;

            this.m_renderProxy = this.m_renderInsContext.getRenderProxy();
            this.m_uid = this.m_renderProxy.getUid();

            this.m_dataBuilder = new RODataBuilder(shdProgramBuider);
            this.m_roVtxBuilder = new ROVtxBuilder();
            this.m_renderInsContext.setCameraParam(param.camProjParam.x, param.camProjParam.y, param.camProjParam.z);
            let contextParam = new RendererInstanceContextParam();
            contextParam.uniformContext = new ShaderUniformContext(this.m_renderProxy.getRCUid());
            contextParam.camera = camera;
            contextParam.stage = this.m_stage3D;
            contextParam.builder = this.m_dataBuilder;
            contextParam.vtxBuilder = this.m_roVtxBuilder;
            contextParam.shaderProgramBuilder = shdProgramBuider;

            this.m_renderInsContext.initialize(param, camera, contextParam);
            this.m_adapter = this.m_renderProxy.getRenderAdapter();
            this.m_dataBuilder.initialize(this.m_renderProxy, this.m_rpoUnitBuilder, this.m_processBuider, this.m_roVtxBuilder);
            // (this.m_renderProxy as any).rshader = this.m_dataBuilder.getRenderShader();
            this.m_renderInsContext.initManager(this.m_dataBuilder);
            this.m_entity3DMana = new DispEntity3DManager(this.m_uid, this.m_dataBuilder, this.m_rpoUnitBuilder, this.m_processBuider);

            this.m_fixProcess = this.createSeparatedProcess() as RenderProcess;
            this.appendProcess(this.m_batchEnabled, this.m_processFixedState);
        }
    }
    /**
     * 获取渲染器可渲染对象管理器状态(版本号)
     */
    getRendererStatus(): number {
        return this.m_entity3DMana.version;
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
        for (let i = 0; i < this.m_processesLen; ++i) {
            this.m_processes[i].update();
        }
    }
    updateProcessAt(processIndex: number): void {
        if (processIndex > -1 && processIndex < this.m_processesLen) {
            this.m_processes[processIndex].update();
        }
    }
    setEntityManaListener(listener: any): void {
        this.m_entity3DMana.setListener(listener);
    }
    addContainer(container: IRenderEntityContainer, processIndex: number = 0): void {
		if(container) {
			if (processIndex > -1 && processIndex < this.m_processesLen) {
				this.m_entity3DMana.addContainer(container, this.m_processes[processIndex].getUid());
			}
		}
	}
    removeContainer(container: IRenderEntityContainer, processIndex: number = 0): void {
		if(container) {
			if (processIndex > -1 && processIndex < this.m_processesLen) {
				this.m_entity3DMana.removeContainer(container, this.m_processes[processIndex].getUid());
			}
		}
	}
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processIndex this destination renderer process index of the m_processes array, the defaule value is 0
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id, the defaule value is true
     */
    addEntity(entity: IRenderEntity, processIndex: number = 0, deferred: boolean = true): void {
        if (entity) {
            if (entity.__$testRendererEnabled()) {
                if (processIndex > -1 && processIndex < this.m_processesLen) {
                    this.m_entity3DMana.addEntity(entity, this.m_processes[processIndex].getUid(), deferred);
                }
            }
        }
    }
    addEntityToProcess(entity: IRenderEntity, process: IRenderProcess, deferred: boolean = true): void {
        if (process && entity) {
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
        if (entity && entity.getRendererUid() == this.m_uid) {
            if (entity.isInRendererProcess()) {
                if (dstProcessIndex > -1 && dstProcessIndex < this.m_processesLen) {
                    let srcUid = entity.getDisplay().__$$runit.getRPROUid();
                    let src = this.m_processBuider.getNodeByUid(srcUid) as RenderProcess;
                    let dst = this.m_processes[dstProcessIndex];
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
        if (dstProcess && entity && entity.getRendererUid() == this.m_uid) {
            if (entity.isInRendererProcess()) {
                let srcUid = entity.getDisplay().__$$runit.getRPROUid();
                let src = this.m_processBuider.getNodeByUid(srcUid) as RenderProcess;
                if (src != dstProcess) {
                    let dst = dstProcess as RenderProcess;
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
        if (entity && entity.getRendererUid() == this.m_uid) {
            this.m_entity3DMana.removeEntity(entity);
            entity.__$setRenderProxy(null);
        }
    }
    /**
     * remove entity from the renderer process
     * @param IRenderEntity IRenderEntity instance
     * @param process RenderProcess instance
     */
    removeEntityFromProcess(entity: IRenderEntity, process: RenderProcess): void {
        if (process && process.getRCUid() == this.m_uid) {
            if (entity && entity.getRendererUid() == this.m_uid) {
                process.removeDisp(entity.getDisplay());
                entity.__$setRenderProxy(null);
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
            if (entity && entity.getRendererUid() == this.m_uid) {
                this.m_processes[processIndex].removeDisp(entity.getDisplay());
                entity.__$setRenderProxy(null);
            }
        }
    }
    setProcessSortEnabledAt(processIndex: number, sortEnabled: boolean): void {
        if (processIndex >= 0 && processIndex < this.m_processesLen) {
            this.m_processes[processIndex].setSortEnabled(sortEnabled);
        }
    }
    setProcessSortEnabled(process: IRenderProcess, sortEnabled: boolean): void {
        if (process && process.getRCUid() == this.m_uid) {
            process.setSortEnabled(sortEnabled);
        }
    }
    /**
     * get the renderer process by process index
     * @param processIndex IRenderProcess instance index in renderer instance
     */
    getRenderProcessAt(processIndex: number): IRenderProcess {
        return this.m_processes[processIndex];
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

        let process = this.m_processBuider.create() as RenderProcess;

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
        let process = this.m_processBuider.create() as RenderProcess;
        this.m_sprocesses.push(process);
        process.setRendererParam(this.m_renderProxy, this.m_sprocessesLen);
        return process;
    }
    setRendererProcessParam(index: number, batchEnabled: boolean, processFixedState: boolean): void {
        if (index > -1 && index < this.m_processesLen) {
            this.m_processes[index].setRenderParam(batchEnabled, processFixedState);
        }
    }
	setProcessEnabledAt(i: number, enabled: boolean): void {
		if (i > -1 && i < this.m_processesLen) {
            this.m_processes[i].setEnabled(enabled);
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
     * Deprecated(废弃, 不推荐使用)
     * 绘制已经完全加入渲染器了渲染资源已经准备完毕的entity
     * 要锁定Material才能用这种绘制方式,再者这个,这种方式比较耗性能，只能用在特殊的地方
     */
    // drawEntityByLockMaterial(entity: IRenderEntity, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
    //     if (entity != null && entity.getVisible() && entity.getRendererUid() == this.m_uid && !this.m_renderProxy.isContextLost()) {
    //         this.m_fixProcess.drawLockMaterialByDisp(entity.getDisplay(), useGlobalUniform, forceUpdateUniform);
    //     }
    // }
    /**
     * 在任意阶段绘制一个指定的 entity,只要其资源数据准备完整
     */
    drawEntity(entity: IRenderEntity, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {

        if (entity != null && entity.getVisible() && !this.m_renderProxy.isContextLost()) {
            if (entity.getRendererUid() == this.m_uid) {
                this.m_fixProcess.drawDisp(entity.getDisplay(), useGlobalUniform, forceUpdateUniform);
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
            for (let i = index; i < this.m_processesLen; ++i) {
                this.m_processes[i].run();
            }
        }
    }
    /**
     * run all renderer processes in the renderer instance
     */
    run(): void {
        if (this.m_entity3DMana.isHaveEntity() && !this.m_renderProxy.isContextLost()) {
            for (let i = 0; i < this.m_processesLen; ++i) {
                this.m_processes[i].run();
            }
        }
    }
    getRenderUnitsTotal(): number {
        let total = 0;
        for (let i = 0; i < this.m_processesLen; ++i) {
            total += this.m_processes[i].getUnitsTotal();
        }
        return total;
    }
    renderflush(): void {
        this.m_renderProxy.flush();
    }

    prependRenderNode(node: IRenderNode): void {
    }
    appendRenderNode(node: IRenderNode): void {
    }
    removeRenderNode(node: IRenderNode): void {
    }
    toString(): string {
        return "[RendererInstance(uid = " + this.m_uid + ")]";
    }
}

export default RendererInstance;
