/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RSEntityFlag from '../../vox/scene/RSEntityFlag';
import { DisplayRenderSign } from "../../vox/render/RenderConst";
import IRODisplay from "../../vox/display/IRODisplay";
import IRenderEntity from "../../vox/render/IRenderEntity";
import { RCRPObj, RPOUnitBuilder } from "../../vox/render/RPOUnitBuilder";
import RODataBuilder from "../../vox/render/RODataBuilder";

import RenderProcess from "../../vox/render/RenderProcess";
import RenderProcessBuider from "../../vox/render/RenderProcessBuider";
import {RendererEntityStatusListener} from "./RendererEntityStatusListener";

export default class DispEntity3DManager {
    private m_rpoUnitBuilder: RPOUnitBuilder = null;
    private m_dataBuilder: RODataBuilder = null;
    private m_processBuider: RenderProcessBuider = null;
    private m_waitList: IRenderEntity[] = [];
    private m_processUidList: number[] = [];
    private m_rendererUid: number = -1;
    private m_existencetotal: number = 0;
    private m_rprocess: RenderProcess = null;
    entityManaListener: RendererEntityStatusListener = null;

    constructor(rendererUid: number, RODataBuilder: RODataBuilder, rpoUnitBuilder: RPOUnitBuilder, processBuider: RenderProcessBuider) {
        this.m_rendererUid = rendererUid;
        this.m_dataBuilder = RODataBuilder;
        this.m_rpoUnitBuilder = rpoUnitBuilder;
        this.m_processBuider = processBuider;
    }
    isEmpty(): boolean {
        return this.m_existencetotal < 1;
    }
    isHaveEntity(): boolean {
        return this.m_existencetotal > 0;
    }
    removeEntity(entity: IRenderEntity): void {
        this.m_existencetotal--;
        // 从所有相关process中移除这个display
        let display: IRODisplay = entity.getDisplay();
        if (display != null && display.__$$runit != null) {
            let puid: number = display.__$ruid;
            let po: RCRPObj = this.m_rpoUnitBuilder.getRCRPObj(puid);
            if (po != null) {
                if (po.count > 0) {
                    if (po.count < 2) {
                        if (po.rprocessUid > -1) {
                            this.m_rprocess = this.m_processBuider.getNodeByUid(po.rprocessUid) as RenderProcess;
                            this.m_rprocess.removeDisp(display);
                            po.rprocessUid = -1;
                        }
                    }
                    else {
                        let len: number = RCRPObj.RenerProcessMaxTotal;
                        for (let i: number = 0; i < len; ++i) {
                            if ((po.idsFlag & (1 << i)) > 0) {
                                // the value of list[i] is the uid of a node;
                                this.m_rprocess = this.m_processBuider.getNodeByUid(i) as RenderProcess;
                                this.m_rprocess.removeDisp(display);
                            }
                        }
                    }
                }
            }
            else {
                this.m_rprocess = this.m_processBuider.getNodeByUid(display.__$$runit.getRPROUid()) as RenderProcess;
                this.m_rprocess.removeDisp(display);
            }
            if (po.count == 0) {
                //console.log("DispEntity3DManager::removeEntity(), remove a entity from all processes.");
                if (display.__$$rsign != DisplayRenderSign.LIVE_IN_RENDERER) {
                    // error!!!
                    console.error("DispEntity3DManager::removeEntity(), Error: display.__$$rsign != RODisplay.LIVE_IN_RENDERER.");
                }
                display.__$$rsign = DisplayRenderSign.NOT_IN_RENDERER;
                // 准备移除和当前 display 对应的 RPOUnit
                this.m_rpoUnitBuilder.restoreByUid(puid);
            }
            else {
                console.warn("Error: DispEntity3DManager::removeEntity(), remove a entity from all processes failed.");
            }
        }
        entity.__$rseFlag = RSEntityFlag.RemoveRendererUid(entity.__$rseFlag);
        entity.__$rseFlag = RSEntityFlag.RemoveRendererLoad(entity.__$rseFlag);
        entity.__$rseFlag = RSEntityFlag.RemoveSortEnabled(entity.__$rseFlag);
        if (this.entityManaListener != null) {
            this.entityManaListener.removeFromRenderer(entity, this.m_rendererUid, -1);
        }
    }
    addEntity(entity: IRenderEntity, processUid: number, deferred: boolean = false): boolean {
        if (entity != null) {
            //console.log("add entity into entity 3d manager.");
            let disp: IRODisplay = entity.getDisplay();
            if (disp != null) {
                if (disp.__$$rsign == DisplayRenderSign.LIVE_IN_RENDERER) {
                    if (!this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid, processUid)) {
                        //console.log("DispEntity3DManager::addEntity(), A, this display("+disp.__$ruid+") has existed in processid("+processUid+").");
                        return;
                    }
                }
                this.m_rprocess = this.m_processBuider.getNodeByUid(processUid) as RenderProcess;
                entity.__$rseFlag = this.m_rprocess.getSortEnabled() ? RSEntityFlag.AddSortEnabled(entity.__$rseFlag) : RSEntityFlag.RemoveSortEnabled(entity.__$rseFlag);

                if (deferred) {
                    if (disp.__$$rsign == DisplayRenderSign.NOT_IN_RENDERER) {
                        disp.__$$rsign = DisplayRenderSign.GO_TO_RENDERER;
                    }
                    entity.__$rseFlag = RSEntityFlag.AddRendererLoad(entity.__$rseFlag);
                    entity.__$rseFlag = RSEntityFlag.AddRendererUid(entity.__$rseFlag, this.m_rendererUid);
                    this.m_waitList.push(entity);
                    this.m_processUidList.push(processUid);
                    //console.log("DispEntity3DManager::addEntity(), B, this display("+disp+") has existed in processid("+processUid+").");
                }
                else {
                    // 检查数据完整性
                    if (this.testValidData(entity)) {
                        this.ensureAdd(entity, disp, processUid);
                    }
                    else {
                        //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
                        if (disp.__$$rsign == DisplayRenderSign.NOT_IN_RENDERER) {
                            disp.__$$rsign = DisplayRenderSign.GO_TO_RENDERER;
                        }
                        entity.__$rseFlag = RSEntityFlag.AddRendererLoad(entity.__$rseFlag);
                        this.m_waitList.push(entity);
                        this.m_processUidList.push(processUid);
                    }
                }
            }
            else {
                entity.__$rseFlag = RSEntityFlag.AddRendererUid(entity.__$rseFlag, this.m_rendererUid);
            }
        }
        return false;
    }
    testValidData(entity: IRenderEntity): boolean {
        if (entity.getMaterial() != null && entity.hasMesh()) {
            if (entity.getMaterial().hasShaderData()) {
                return true;
            }
            else if (entity.getMaterial().getCodeBuf() != null) {
                entity.activeDisplay();
            }
        }
        return false;
    }
    ensureAdd(entity: IRenderEntity, disp: IRODisplay, processUid: number): void {
        
        entity.update();

        entity.__$rseFlag = RSEntityFlag.AddRendererUid(entity.__$rseFlag, this.m_rendererUid);
        entity.__$rseFlag = RSEntityFlag.RemoveRendererLoad(entity.__$rseFlag);
        entity.__$setRenderProxy(this.m_dataBuilder.getRenderProxy());
        this.m_existencetotal++;

        if (disp.__$$rsign == DisplayRenderSign.NOT_IN_RENDERER) {
            disp.__$$rsign = DisplayRenderSign.GO_TO_RENDERER;
        }

        this.m_rprocess = this.m_processBuider.getNodeByUid(processUid) as RenderProcess;
        //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
        if (disp.__$ruid > -1) {
            this.m_rprocess.addDisp(disp);
        }
        else {
            if (this.m_dataBuilder.buildGpuDisp(disp)) {
                this.m_rprocess.addDisp(disp);
            }
        }
        if (this.entityManaListener != null) {
            this.entityManaListener.addToRenderer(entity, this.m_rendererUid, processUid);
        }
        if(entity.getGlobalBounds() != null) {
            disp.__$$runit.bounds = entity.getGlobalBounds();
            disp.__$$runit.pos = disp.__$$runit.bounds.center;
        }
    }
    private updateWaitList(): void {
        let len: number = this.m_waitList.length;
        let entity: IRenderEntity = null;
        let disp: IRODisplay = null;
        for (let i: number = 0; i < len; ++i) {
            entity = this.m_waitList[i];
            if ((RSEntityFlag.RENDERER_LOAD_FLAG & entity.__$rseFlag) == RSEntityFlag.RENDERER_LOAD_FLAG) {
                if (this.testValidData(entity)) {
                    disp = entity.getDisplay();
                    if (disp.__$$rsign == DisplayRenderSign.LIVE_IN_RENDERER) {
                        if (!this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid, this.m_processUidList[i])) {
                            //console.log("DispEntity3DManager::update(), this display("+disp.__$ruid+") has existed in processid("+m_processUidList[i]+").");
                            this.m_waitList.splice(i, 1);
                            this.m_processUidList.splice(i, 1);
                            --len;
                            --i;
                            continue;
                        }
                    }
                    this.ensureAdd(entity, disp, this.m_processUidList[i]);
                    this.m_waitList.splice(i, 1);
                    this.m_processUidList.splice(i, 1);
                    --len;
                    --i;
                }
            }
            else {
                disp = entity.getDisplay();
                if (disp != null && disp.__$$rsign == DisplayRenderSign.GO_TO_RENDERER) {
                    disp.__$$rsign = DisplayRenderSign.NOT_IN_RENDERER;
                }
                //console.log("DispEntity3DManager::update(), remove a ready entity.");
                entity.__$rseFlag = RSEntityFlag.RemoveRendererLoad(entity.__$rseFlag);
                entity.__$rseFlag = RSEntityFlag.RemoveRendererUid(entity.__$rseFlag);
                entity.__$rseFlag = RSEntityFlag.RemoveSortEnabled(entity.__$rseFlag);
                this.m_waitList.splice(i, 1);
                this.m_processUidList.splice(i, 1);
                --len;
                --i;
                if (this.entityManaListener != null) {
                    this.entityManaListener.removeFromRenderer(entity, this.m_rendererUid, -1);
                }
            }
        }
    }

    update(): void {
        if (this.m_waitList.length > 0) {
            this.updateWaitList();
        }
        this.m_dataBuilder.update();
    }
}