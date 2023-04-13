/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// gpu射线检测拾取代理对象
import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import IRenderEntity from "../../vox/render/IRenderEntity";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import IRaySelector from '../../vox/scene/IRaySelector';
import RaySelectedNode from '../../vox/scene/RaySelectedNode';

import { RenderBlendMode, DepthTestMode } from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import IRenderer from "../../vox/scene/IRenderer";
import Color4 from "../../vox/material/Color4";
import PixelPickIndexMaterial from "../../vox/material/mcase/PixelPickIndexMaterial";
import DebugFlag from "../debug/DebugFlag";
import { AABBCalc } from "../geom/AABBCalc";
import IRenderingEntitySet from "./IRenderingEntitySet";

class QueryUnit {
    ets: IRenderEntity[] = null;
    total = 0;
    constructor() { }
    query(ets: IRenderEntity[], total: number): void {
        this.ets = ets;
        this.total = total;
    }
}
export default class RayGpuSelector implements IRaySelector {
    private m_initColor = new Color4();
    private m_indexMaterial = new PixelPickIndexMaterial();
    private m_renderer: IRenderer = null;
    private m_camera: IRenderCamera = null;
    private m_rsn: RaySelectedNode = null;
    // 最多检测256个对象
    private m_hitList = new Uint8Array(256);
    private m_rsnList: RaySelectedNode[] = new Array(256);
    private m_selectedNode: RaySelectedNode = null;
    private m_selectedTotal = 0;
    private m_testMode = 0;
    private m_invpv = new Vector3D();
    private m_invtv = new Vector3D();
    private m_rlpv: Vector3D = null;
    private m_rltv: Vector3D = null;
    private m_rlsiv = new Uint8Array(4);
    private m_rlinvtv = new Vector3D();
    private m_outv = new Vector3D();
    private m_vecs: Vector3D[] = [null, null];
    private m_gpuTestEnabled = true;
    private m_qu = new QueryUnit();
    etset: IRenderingEntitySet = null;
    constructor() {
        for (let i = 0; i < 256; ++i) {
            this.m_rsnList[i] = new RaySelectedNode();
        }
    }
    setRenderer(renderer: IRenderer): void {
        this.m_renderer = renderer;
    }

    setRayTestMode(testMode: number): void {
        this.m_testMode = testMode;
    }
    setRay(rlpv: Vector3D, rltv: Vector3D): void {
        this.m_rlpv = rlpv;
        this.m_rltv = rltv;
    }
    getRay(out_rlpv: Vector3D, out_rltv: Vector3D): void {
        out_rlpv.copyFrom(this.m_rlpv);
        out_rltv.copyFrom(this.m_rltv);
    }
    setCamera(cam: IRenderCamera): void {
        this.m_camera = cam;
    }
    getSelectedNode(): RaySelectedNode {
        return this.m_selectedNode;
    }
    getSelectedNodes(): RaySelectedNode[] {
        return this.m_rsnList;
    }
    getSelectedNodesTotal(): number {
        return this.m_selectedTotal;
    }
    private sorting(low: number, high: number): number {
        let arr = this.m_rsnList;
        //标记位置为待排序数组段的low处也就时枢轴值
        this.m_rsn = arr[low];
        while (low < high) {
            //  如果当前数字已经有序的位于我们的枢轴两端，我们就需要移动它的指针，是high或是low
            while (low < high && arr[high].dis >= this.m_rsn.dis) {
                --high;
            }
            // 如果当前数字不满足我们的需求，我们就需要将当前数字移动到它应在的一侧
            arr[low] = arr[high];
            while (low < high && arr[low].dis <= this.m_rsn.dis) {
                ++low;
            }
            arr[high] = arr[low];
        }
        arr[low] = this.m_rsn;
        return low;
    }
    private snsort(low: number, high: number): void {
        if (low < high) {
            let pos = this.sorting(low, high);
            this.snsort(low, pos - 1);
            this.snsort(pos + 1, high);
        }
    }
    run(): void {
        if (this.etset.getTotal() > 0) {
            let dis = 0.0;
            let rtv = this.m_rltv;
            let rpv = this.m_rlpv;
            let outv = this.m_outv;
            let node: RaySelectedNode = null;
            let total = 0;
            let minv = MathConst.MATH_MIN_POSITIVE;
            let maxv = MathConst.MATH_MAX_POSITIVE;
            if (Math.abs(rtv.x) > minv) {
                this.m_rlinvtv.x = 1.0 / rtv.x;
            }
            else {
                this.m_rlinvtv.x = maxv;
            }
            if (Math.abs(rtv.y) > minv) {
                this.m_rlinvtv.y = 1.0 / rtv.y;
            }
            else {
                this.m_rlinvtv.y = maxv;
            }
            if (Math.abs(rtv.z) > minv) {
                this.m_rlinvtv.z = 1.0 / rtv.z;
            }
            else {
                this.m_rlinvtv.z = maxv;
            }
            let rivs = this.m_rlsiv;
            let rtvs = this.m_rlinvtv;
            rivs[0] = rtvs.x < 0 ? 1 : 0;
            rivs[1] = rtvs.y < 0 ? 1 : 0;
            rivs[2] = rtvs.z < 0 ? 1 : 0;

            let qu = this.m_qu;
            this.etset.query(qu);
            let ets = qu.ets;
            let tot = qu.total;

            let vecs = this.m_vecs;
            for (let i = 0; i < tot; ++i) {
                let et = ets[i];
                if (et.mouseEnabled) {

                    const bounds = et.getGlobalBounds();
                    outv.subVecsTo(bounds.center, rpv);
                    dis = outv.dot(rtv);
                    outv.x -= dis * rtv.x;
                    outv.y -= dis * rtv.y;
                    outv.z -= dis * rtv.z;

                    if (outv.getLengthSquared() <= bounds.radius2) {
                        // 如果只是几何检测(例如球体包围体的检测)就不需要在进入后续的aabb检测
                        vecs[0] = bounds.min;
                        vecs[1] = bounds.max;
                        if (AABBCalc.IntersectionRL3(vecs, rivs, rtvs, rtv, rpv, outv)) {
                            node = this.m_rsnList[total];
                            node.entity = et;
                            node.dis = this.m_rlinvtv.w;
                            node.wpv.copyFrom(outv);
                            //  console.log("H Hit Dis: "+rtv.dot(outv));
                            ++total;
                        }
                    }
                }
            }
            this.m_selectedNode = null;
            let i = 0;
            // 需要支持容器操作，也相当于是容器可控制渲染
            if (total > 0) {
                let invpv = this.m_invpv;
                let invtv = this.m_invtv;
                let entity: IRenderEntity = null;
                let flag = 0;
                let hitTotal = 0;
                let mat4: IMatrix4 = null;
                let rayNode: RaySelectedNode = null;
                let pvdis = rtv.dot(rpv);
                let preDis = 0.0;
                let polyTest = !this.m_gpuTestEnabled;
                let polyTotal = 0;
                if (total > 1) {
                    this.snsort(0, total - 1);

                    for (i = 0; i < total; ++i) {
                        rayNode = this.m_rsnList[i];
                        entity = this.m_rsnList[i].entity;
                        if (entity.isPolyhedral()) {
                            if (polyTest) {
                                mat4 = entity.getInvMatrix();
                                mat4.transformOutVector3(rpv, invpv);
                                mat4.deltaTransformOutVector(rtv, invtv);
                                invtv.normalize();
                                flag = entity.testRay(invpv, invtv, outv, true);
                            }
                            else {
                                ++polyTotal;
                                flag = 0;
                            }
                        }
                        else {
                            mat4 = entity.getInvMatrix();
                            mat4.transformOutVector3(rpv, invpv);
                            mat4.deltaTransformOutVector(rtv, invtv);
                            invtv.normalize();
                            flag = entity.testRay(invpv, invtv, outv, true);
                        }
                        if (flag > 0) {
                            rayNode.lpv.copyFrom(outv);
                            entity.getMatrix().transformOutVector3(outv, rayNode.wpv);
                            rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;
                            this.m_hitList[hitTotal] = i;
                            ++hitTotal;
                            //console.log("YYYYYYYYYYYYYYYes multi Ray hit mesh success.");
                            if (rayNode.dis > preDis) {
                                this.m_selectedNode = rayNode;
                                break;
                            }
                        }
                        else if (flag < 0) {
                            //console.log("NNNNNNNNNNNNNNNNo multi Ray hit mesh 没有做进一步的检测.");
                            this.m_hitList[hitTotal] = i;
                            ++hitTotal;
                            if (rayNode.dis > preDis) {
                                this.m_selectedNode = rayNode;
                                break;
                            }
                        }
                        preDis = rayNode.dis;
                    }
                    if (this.m_selectedNode == null && hitTotal > 0) {
                        this.m_selectedNode = this.m_rsnList[this.m_hitList[0]];
                    }
                }
                else {
                    rayNode = this.m_rsnList[0];
                    entity = this.m_rsnList[0].entity;
                    mat4 = entity.getInvMatrix();
                    mat4.transformOutVector3(rpv, invpv);
                    mat4.deltaTransformOutVector(rtv, invtv);
                    invtv.normalize();
                    if (entity.isPolyhedral()) {
                        if (polyTest) {
                            flag = entity.testRay(invpv, invtv, outv, true);
                        }
                        else {
                            ++polyTotal;
                            flag = 0;
                        }
                    }
                    else {
                        flag = entity.testRay(invpv, invtv, outv, true);
                    }
                    //console.log("hit flag: "+flag);
                    if (flag > 0) {
                        rayNode.lpv.copyFrom(outv);
                        entity.getMatrix().transformOutVector3(outv, rayNode.wpv);
                        rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;
                        this.m_selectedNode = rayNode;
                        //console.log("YYYYYYYYYYYYYYYes Ray hit mesh success.");
                    }
                    else if (flag < 0) {
                        //console.log("NNNNNNNNNNNNNNNo Ray hit mesh 没有做进一步的检测.");
                        this.m_selectedNode = rayNode;
                    }
                }
                if (polyTotal > 0) {
                    if (this.m_testMode < 1) {

                        // 进行gpu pixel 测试
                        this.gpuPick(total);
                    }
                    else {
                        if (this.m_selectedNode == null || this.m_selectedNode.entity.isPolyhedral()) {
                            // 进行gpu pixel 测试
                            this.gpuPick(total);
                        }
                    }
                }
                //console.log("YYYYYYYYYYYYYYYes Ray hit success.");
            }
            i = total;
            for (; i < this.m_selectedTotal; ++i) {
                //console.log("清理多余的 entity i: "+i);
                if (this.m_selectedNode != this.m_rsnList[i]) {
                    this.m_rsnList[i].entity = null;
                }
            }
            this.m_selectedTotal = total;

        }
    }
    private m_uintArray = new Uint8Array(4);
    private m_uintList = new Uint8Array(256);
    private gpuPick(total: number): void {
        let rcontext = this.m_renderer.getRendererContext();
        let proxy = this.m_renderer.getRenderProxy();
		let adp = proxy.adapter;
		let syncBgColor = adp.getSyncBgColor();
		adp.setSyncBgColor(false);
        let pmx = proxy.getStage3D().mouseX;
        //let pmy:number = proxy.getStage3D().stageHeight - proxy.getStage3D().mouseY;
        let pmy = proxy.getStage3D().mouseY;
        rcontext.vertexRenderBegin();
        rcontext.getClearRGBAColor4f(this.m_initColor);
        rcontext.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
        rcontext.setScissorEnabled(true);

        rcontext.setScissorRect(pmx, pmy, 1, 1);
        rcontext.clearBackBuffer();
        this.m_uintArray[3] = 0;
        RendererState.LockBlendMode(RenderBlendMode.OPAQUE);
        RendererState.LockDepthTestMode(DepthTestMode.OPAQUE);
        rcontext.unlockMaterial();
        rcontext.unlockRenderState();
        rcontext.useGlobalMaterial(this.m_indexMaterial, false, false);

        let rayNode: RaySelectedNode = null;
        let entity: IRenderEntity = null;
        let j = -1;
        let i = 0;

        for (; i < total; ++i) {
            rayNode = this.m_rsnList[i];
            entity = this.m_rsnList[i].entity;
            if (entity.isPolyhedral()) {
                ++j;
                this.m_indexMaterial.setIndex(j + 2);

                this.m_uintList[j] = i;
                this.m_renderer.updateMaterialUniformToCurrentShd(this.m_indexMaterial);
                this.m_renderer.drawEntity(entity, false, true);
            }
        }
        if (j > -1) {
            proxy.readPixels(pmx, pmy, 1, 1, proxy.RGBA, proxy.UNSIGNED_BYTE, this.m_uintArray);
        }
        RendererState.UnlockBlendMode();
        RendererState.UnlockDepthTestMode();

        //DivLog.ShowLog("uintArray[3]: "+this.m_uintArray[3]+", "+(((this.m_uintArray[0])<<8) + this.m_uintArray[1] + this.m_uintArray[2]/255.0));
        if (this.m_uintArray[3] > 1) {

            i = this.m_uintList[this.m_uintArray[3] - 2];
            rayNode = this.m_rsnList[i];
            let depth: number = ((this.m_uintArray[0]) << 8) + this.m_uintArray[1] + this.m_uintArray[2] / 255.0;
            //DivLog.ShowLog("depth: "+depth);
            if (this.m_selectedNode != null) {
                let selectedEntity: IRenderEntity = this.m_selectedNode.entity;
                if (this.m_selectedNode != rayNode && !selectedEntity.isPolyhedral()) {
                    // 说明现在鼠标选中的非像素拾取对象更靠近摄像机
                    if (this.m_selectedNode.dis < depth) {
                        i = -1;
                    }
                }
            }
            if (i > -1) {
                // 实际选中的是当前的通过像素拾取得到的对象
                rayNode.dis = depth;
                // 重新计算wpos和lpos
                this.getWorldPosByRayDistance(depth, this.m_rltv, this.m_camera.getPosition(), rayNode.wpv);
                //console.log(depth+","+rayNode.wpv.toString());
                this.m_selectedNode = rayNode;
            }
        }
        rcontext.setScissorEnabled(false);
        rcontext.unlockMaterial();
        rcontext.unlockRenderState();
        RendererState.UnlockBlendMode();
        RendererState.UnlockDepthTestMode();

        const c = this.m_initColor;
        rcontext.setClearRGBAColor4f(c.r, c.g, c.b, c.a);
		adp.setSyncBgColor(syncBgColor);

        rcontext.resetState();
    }
    clear(): void {
        this.m_selectedNode = null;
    }

    // @param           the cameraDistance is the distance between camera position and a position
    private getWorldPosByRayDistance(cameraDistance: number, tv: Vector3D, camPv: Vector3D, resultV: Vector3D): void {
        resultV.copyFrom(tv).scaleBy(cameraDistance).addBy(camPv);
        // resultV.x = tv.x * cameraDistance + camPv.x;
        // resultV.y = tv.y * cameraDistance + camPv.y;
        // resultV.z = tv.z * cameraDistance + camPv.z;
    }
}
