/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from '../render/IRenderCamera';
import IRenderProxy from "../../vox/render/IRenderProxy";

import { IShaderProgramBuilder } from "../../vox/material/IShaderProgramBuilder";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRODataBuilder from "../../vox/render/IRODataBuilder";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRendererParam from "../../vox/scene/IRendererParam";
import IRenderProcess from "../../vox/render/IRenderProcess";
import {IRendererInstanceContext} from "../../vox/scene/IRendererInstanceContext";
import IRenderer from "../../vox/scene/IRenderer";
import IRenderEntityContainer from "../render/IRenderEntityContainer";

/**
 * kernal system instance, it is the renderer instance for the renderer runtime, it is very very very important class.
 */
export interface IRendererInstance extends IRenderer {

    __$setStage3D(stage3D: IRenderStage3D): void;
    getUid(): number;
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    getRendererContext(): IRendererInstanceContext;
    getRenderProxy(): IRenderProxy
    getStage3D(): IRenderStage3D
    getViewX(): number;
    getViewY(): number;
    getViewWidth(): number;
    getViewHeight(): number;

    getCamera(): IRenderCamera;
    createCamera(): IRenderCamera;
    useCamera(camera: IRenderCamera, syncCamView?: boolean): void;
    useMainCamera(): void;

    updateCamera(): void;
    initialize(param: IRendererParam, camera?: IRenderCamera, shdProgramBuider?: IShaderProgramBuilder): void;
    /**
     * 获取渲染器可渲染对象管理器状态(版本号)
     */
    getRendererStatus(): number;
    /**
     * update all data or status of the renderer runtime
     * should call this function per frame
     */
    update(): void;
    updateAllProcess(): void;
    updateProcessAt(processIndex: number): void;
    setEntityManaListener(listener: any): void;
    addContainer(container: IRenderEntityContainer, processIndex?: number): void;
    removeContainer(container: IRenderEntityContainer, processIndex?: number): void;
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processIndex this destination renderer process index of the m_processes array.
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
     */
    addEntity(entity: IRenderEntity, processIndex?: number, deferred?: boolean): void;
    addEntityToProcess(entity: IRenderEntity, process: IRenderProcess, deferred?: boolean): void;
    /**
     * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
     * move rendering runtime displayEntity to different renderer process
     */
    moveEntityToProcessAt(entity: IRenderEntity, dstProcessIndex: number): void;
    moveEntityToProcess(entity: IRenderEntity, dstProcess: IRenderProcess): void;
    /**
     * remove entity from the renderer instance
     * @param entity IRenderEntity instance
     */
    removeEntity(entity: IRenderEntity): void;
    /**
     * remove entity from the renderer process
     * @param IRenderEntity IRenderEntity instance
     * @param process RenderProcess instance
     */
    removeEntityFromProcess(entity: IRenderEntity, process: IRenderProcess): void;
    /**
     * remove entity from the renderer process by process index
     * @param IRenderEntity IRenderEntity instance
     * @param processIndex RenderProcess instance index in renderer instance
     */
    removeEntityByProcessIndex(entity: IRenderEntity, processIndex: number): void;
    setProcessSortEnabledAt(processIndex: number, sortEnabled: boolean): void;
    setProcessSortEnabled(process: IRenderProcess, sortEnabled: boolean): void;
    /**
     * get the renderer process by process index
     * @param processIndex IRenderProcess instance index in renderer instance
     */
    getRenderProcessAt(processIndex: number): IRenderProcess;
    /**
     * append a new renderer process instance
     * @param batchEnabled batch renderer runtime resource data
     * @param processFixedState the process is fix renderer state
     * @returns
     */
    appendProcess(batchEnabled?: boolean, processFixedState?: boolean): IRenderProcess;
    /**
     * append a independent new renderer process instance, and separate the renderer process from the renderer rendering control
     * @param batchEnabled batch renderer runtime resource data
     * @param processFixedState the process is fix renderer state
     */
    createSeparatedProcess(batchEnabled?: boolean, processFixedState?: boolean): IRenderProcess;
	setProcessEnabledAt(i: number, enabled: boolean): void;
    setRendererProcessParam(index: number, batchEnabled: boolean, processFixedState: boolean): void;
    getProcessAt(index: number): IRenderProcess;
    showInfoAt(index: number): void;
    getProcessesTotal(): number;
    updateMaterialUniformToCurrentShd(material: IRenderMaterial): void;
    /**
     * Deprecated(废弃, 不推荐使用)
     * 绘制已经完全加入渲染器了渲染资源已经准备完毕的entity
     * 要锁定Material才能用这种绘制方式,再者这个,这种方式比较耗性能，只能用在特殊的地方
     */
    // drawEntityByLockMaterial(entity: IRenderEntity, useGlobalUniform?: boolean, forceUpdateUniform?: boolean): void;
    /**
     * 在任意阶段绘制一个指定的 entity,只要其资源数据准备完整
     */
    drawEntity(entity: IRenderEntity, useGlobalUniform?: boolean, forceUpdateUniform?: boolean): void;
    /**
     * run the specific renderer process by its index in the renderer instance
     * @param index the renderer process index in the renderer instance
     */
    runAt(index: number): void;
    runProcess(process: IRenderProcess): void;
    runFromIndexTo(index: number): void;
    /**
     * run all renderer processes in the renderer instance
     */
    run(): void;
    getRenderUnitsTotal(): number;
    renderflush(): void;
    getDataBuilder(): IRODataBuilder;
}

export default IRendererInstance;
