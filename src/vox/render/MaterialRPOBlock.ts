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
import RPONodeLinker from "../../vox/render/RPONodeLinker";

import { RenderColorMask } from "../../vox/render/rendering/RenderColorMask";
import { RenderStateObject } from "../../vox/render/rendering/RenderStateObject";

import RenderProxy from "../../vox/render/RenderProxy";
import RenderShader from '../../vox/render/RenderShader';
import RPOBlock from "./RPOBlock";
import PassProcess from "./pass/PassProcess";

export default class MaterialRPOBlock extends RPOBlock {

    private m_nodeLinker = new RPONodeLinker();
    private m_runs: ((rc: RenderProxy) => void)[] = new Array(5);

    constructor(shader: RenderShader) {
		super(shader);
        const ls = this.m_runs;
        ls.fill(null);
        ls[0] = this.run0.bind(this);
        ls[1] = this.run1.bind(this);
        ls[2] = this.run2.bind(this);
    }
    showInfo(): void {
        this.m_nodeLinker.showInfo();
    }
    addNode(node: RPONode): void {
        this.m_nodeLinker.addNodeAndSort(node);
    }
    rejoinNode(node: RPONode): void {
        if (this.m_nodeLinker.containsNode(node)) {
            this.m_nodeLinker.removeNodeAndSort(node);
            this.m_nodeLinker.addNodeAndSort(node);
        }
    }
    removeNode(node: RPONode): void {
        this.m_nodeLinker.removeNodeAndSort(node);
    }
    isEmpty(): boolean {
        return this.m_nodeLinker.getBegin() == null;
    }
    run(rc: RenderProxy): void {
        this.m_runs[this.runMode](rc);
    }
    private run0(rc: RenderProxy): void {

        let nextNode = this.m_nodeLinker.getBegin();
        if (nextNode != null) {

            this.m_shader.bindToGpu(this.shdUid);
            this.m_shader.resetUniform();
            let unit: RPOUnit = null;
            this.m_shdUpdate = false;

            const proc = this.m_passProc;
            proc.shader = this.m_shader;
            while (nextNode) {
                unit = nextNode.unit;
                if (unit.rendering) {
                    unit.updateVtx();
                    if (unit.drawing) {
                        if (unit.rgraph && unit.rgraph.isEnabled()) {
                            proc.units = [unit];
                            proc.rc = rc;
                            proc.vtxFlag = true;
                            proc.texFlag = true;
                            unit.rgraph.run(proc);
                            this.m_shdUpdate = true;
                        } else {
                            if (this.m_shdUpdate) {
                                unit.applyShader(true);
                                this.m_shdUpdate = false;
                            }
                            unit.run(rc);
                            unit.draw(rc);
                        }
                    }
                }
                nextNode = nextNode.next;
            }
        }
    }
    private m_passProc = new PassProcess();
    private m_shdUpdate = false;
    private run1(rc: RenderProxy): void {

        let nextNode = this.m_nodeLinker.getBegin();
        if (nextNode != null) {
            this.m_shader.bindToGpu(this.shdUid);
            this.m_shader.resetUniform();

            const proc = this.m_passProc;
            proc.shader = this.m_shader;

            let linker = this.m_nodeLinker;
            let unit: RPOUnit = null;
            let vtxTotal = linker.getVtxTotalAt(nextNode.rvroI);
            let texTotal = linker.getTexTotalAt(nextNode.rtroI);
            let vtxFlag = vtxTotal > 0;
            let texFlag = texTotal > 0;
            this.m_shdUpdate = false;
            // console.log("run1", vtxFlag, texFlag, this.procuid);
            while (nextNode != null) {
                if (vtxTotal < 1) {
                    vtxTotal = linker.getVtxTotalAt(nextNode.rvroI);
                    vtxFlag = true;
                }
                vtxTotal--;
                if (texTotal < 1) {
                    texTotal = linker.getTexTotalAt(nextNode.rtroI);
                    texFlag = true;
                }
                texTotal--;

                // if(DebugFlag.Flag_0 > 0) console.log("nextNode.drawEnabled: ",nextNode.drawEnabled);
                unit = nextNode.unit;
                if (unit.rendering) {
                    // if(DebugFlag.Flag_0 > 0) console.log("unit.drawEnabled: ",unit.drawEnabled);
                    // console.log("unit.rdp.getUid(): ", unit.rdp.getUid(), unit.vdrInfo.rdp.getUid());

                    vtxFlag = unit.updateVtx() || vtxFlag;
                    if (unit.drawing) {
                        if (unit.rgraph && unit.rgraph.isEnabled()) {
                            proc.units = [unit];
                            proc.rc = rc;
                            proc.vtxFlag = vtxFlag;
                            proc.texFlag = texFlag;
                            unit.rgraph.run(proc);
                            this.m_shdUpdate = true;
                        } else {
                            this.draw1(rc, unit, vtxFlag, texFlag);
                        }

                        vtxFlag = false;
                        texFlag = false;
                    }
                }
                nextNode = nextNode.next;
            }
        }
    }
    private draw1(rc: RenderProxy, unit: RPOUnit, vtxFlag: boolean, texFlag: boolean): void {
        if (this.m_shdUpdate) {
            unit.applyShader(true);
            this.m_shdUpdate = false;
        }
        if (vtxFlag) {
            unit.vro.run();
            vtxFlag = false;
        }
        if (texFlag) {
            unit.tro.run();
            texFlag = false;
        }
        unit.run2(rc);
        unit.draw(rc);
    }

    private run2(rc: RenderProxy): void {

        let nextNode = this.m_nodeLinker.getBegin();
        if (nextNode != null) {
            const shader = this.m_shader;
            shader.bindToGpu(this.shdUid);
            shader.resetUniform();
            let unit: RPOUnit = null;
            RenderStateObject.UseRenderState(nextNode.unit.renderState);
            RenderColorMask.UseRenderState(nextNode.unit.rcolorMask);

            let vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
            let texTotal = this.m_nodeLinker.getTexTotalAt(nextNode.rtroI);
            let vtxFlag = vtxTotal > 0;
            let texFlag = texTotal > 0;

            while (nextNode) {
                if (vtxTotal < 0) {
                    vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
                    vtxFlag = true;
                }
                vtxTotal--;
                if (texTotal < 0) {
                    texTotal = this.m_nodeLinker.getTexTotalAt(nextNode.rtroI);
                    texFlag = true;
                }
                texTotal--;

                unit = nextNode.unit;
                if (unit.rendering) {
                    vtxFlag = unit.updateVtx() || vtxFlag;
                    if (unit.drawing) {
                        if (vtxFlag) {
                            unit.vro.run();
                            vtxFlag = false;
                        }
                        if (texFlag) {
                            unit.tro.run();
                            texFlag = false;
                        }
                        if (unit.ubo != null) {
                            unit.ubo.run(rc);
                        }
                        shader.useTransUniform(unit.transUniform);
                        shader.useUniform(unit.uniform);
                        unit.draw(rc);
                    }
                }
                nextNode = nextNode.next;
            }
        }
    }
    runLockMaterial(rc: RenderProxy): void {
        let nextNode = this.m_nodeLinker.getBegin();
        if (nextNode) {
            this.m_shader.bindToGpu(this.shdUid);
            this.m_shader.resetUniform();
            let texUnlock = this.m_shader.isTextureUnLocked();
            rc.Texture.unlocked = texUnlock;

            let unit: RPOUnit = null;
            if (this.batchEnabled) {

                let vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
                let vtxFlag = vtxTotal > 0;

                while (nextNode != null) {
                    if (vtxTotal < 1) {
                        vtxTotal = this.m_nodeLinker.getVtxTotalAt(nextNode.rvroI);
                        vtxFlag = true;
                    }
                    vtxTotal--;

                    unit = nextNode.unit;
                    if (unit.rendering) {
                        vtxFlag = unit.updateVtx() || vtxFlag;
                        if (unit.drawing) {
                            if (vtxFlag) {
                                unit.vro.run();
                                vtxFlag = false;
                            }
                            if (texUnlock) {
                                unit.tro.run();
                            }
                            unit.runLockMaterial2(null);
                            unit.draw(rc);
                        }
                    }
                    nextNode = nextNode.next;
                }
            }
            else {
                while (nextNode != null) {
                    unit = nextNode.unit;
                    if (unit.rendering) {
                        unit.updateVtx();
                        if (unit.drawing) {
                            unit.runLockMaterial();
                            if (texUnlock) {
                                nextNode.tro.run();
                            }
                            unit.draw(rc);
                        }
                    }
                    nextNode = nextNode.next;
                }
            }
            rc.Texture.unlocked = false;
        }
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
        let nextNode = this.m_nodeLinker.getBegin();
        let node: RPONode = null;
        if (nextNode != null) {
            let runit: RPOUnit;
            while (nextNode != null) {
                node = nextNode;
                nextNode = nextNode.next;
                this.rpoUnitBuilder.setRPNodeParam(node.__$ruid, this.procuid, -1);
                node.reset();

                runit = node.unit;
                if (this.rpoNodeBuilder.restore(node)) {
                    this.rpoUnitBuilder.restore(runit);
                }
            }
        }
        this.m_nodeLinker.clear();
        this.m_runs.fill(null);

		super.reset();
    }
    destroy(): void {
        super.destroy();
    }
}
