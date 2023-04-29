/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 用于对 MaterialRPOBlock 进行必要的组织, 例如 合批或者按照 shader不同来分类, 以及依据其他机制分类等等
// 目前一个block内的所有node 所使用的shader program 是相同的

import RendererDevice from "../../vox/render/RendererDevice";
import IRODisplay from "../../vox/display/IRODisplay";
import RPOUnit from "../../vox/render/RPOUnit";
import RPONode from "../../vox/render/RPONode";
import { RPOUnitBuilder } from "../../vox/render/RPOUnitBuilder";
import RPONodeBuilder from "../../vox/render/RPONodeBuilder";
import {SortNodeLinkerNode} from "../../vox/utils/SortNodeLinker";

import RenderProxy from "../../vox/render/RenderProxy";
import RenderShader from '../../vox/render/RenderShader';
import ROVertexResource from "../../vox/render/ROVertexResource";
import IRODisplaySorter from "../../vox/render/IRODisplaySorter";
import DebugFlag from "../debug/DebugFlag";
import PassProcess from "./pass/PassProcess";
//import DebugFlag from "../debug/DebugFlag";

export default class RPOBlock extends SortNodeLinkerNode {

    private static s_uid = 0;
    private m_uid = -1;
    protected m_shader: RenderShader = null;
	protected m_sorter: IRODisplaySorter = null;
    index = -1;                                  // 记录自身在 RenderProcess blocks数组中的序号
    shdUid = -1;                                 // 记录 material 对应的 shader program uid
    procuid = -1;

    batchEnabled = true;
    fixedState = true;
    runMode = 0;
    rpoNodeBuilder: RPONodeBuilder = null;
    rpoUnitBuilder: RPOUnitBuilder = null;
    vtxResource: ROVertexResource = null;

	sortEnabled = true;
    constructor(shader: RenderShader) {
		super();
        this.m_shader = shader;
        this.m_uid = RPOBlock.s_uid++;
    }
    showInfo(): void {
    }
	getType(): number {
		return -1;
	}
	setSorter(sorter: IRODisplaySorter): void {
		this.m_sorter = sorter;
	}
	sort(): void {
	}
    addNode(node: RPONode): void {
    }
    rejoinNode(node: RPONode): void {
    }
    removeNode(node: RPONode): void {
    }
    isEmpty(): boolean {
        return true;
    }
    run(rc: RenderProxy): void {
    }
    runLockMaterial(rc: RenderProxy): void {
    }
    // 在锁定material的时候,直接绘制单个unit
    drawUnit(rc: RenderProxy, unit: RPOUnit, disp: IRODisplay): void {
        unit.updateVtx();
        if (unit.drawing) {
            this.m_shader.bindToGpu(unit.shdUid);
            unit.updateVtx();
            unit.run(rc);
            unit.draw(rc);
        }
    }
    // 在锁定material的时候,直接绘制单个unit
    drawLockMaterialByUnit(rc: RenderProxy, unit: RPOUnit, disp: IRODisplay, useGlobalUniform: boolean, forceUpdateUniform: boolean): void {
        unit.updateVtx();
        if (unit.drawing) {
            if (forceUpdateUniform) {
                this.m_shader.resetUniform();
            }
            // console.log("****** drawLockMaterialByUnit(), unit: ",unit);
            let vro = unit.vro;
            if (RendererDevice.IsMobileWeb()) {
                // 如果不这么做，vro和shader attributes没有完全匹配的时候可能在某些设备上会有问题(例如ip6s上无法正常绘制)
                // 注意临时产生的 vro 对象的回收问题
                // let vro: IVertexRenderObj = this.vtxResource.getVROByResUid(disp.vbuf.getUid(), this.m_shader.getCurrentShd(), true);
                vro = this.vtxResource.getVROByResUid(disp.getVtxResUid(), this.m_shader.getCurrentShd(), true);
            }
            vro.run();

            unit.runLockMaterial2(useGlobalUniform ? this.m_shader.__$globalUniform : null);
            unit.draw(rc);
        }
    }
    reset(): void {
        this.index = -1;
        this.shdUid = -1;
        this.procuid = -1;
        this.rpoNodeBuilder = null;
        this.rpoUnitBuilder = null;
        this.vtxResource = null;
    }
	clear(): void {
	}
    destroy(): void {
        this.reset();
    }
    getUid(): number {
        return this.m_uid;
    }
}
