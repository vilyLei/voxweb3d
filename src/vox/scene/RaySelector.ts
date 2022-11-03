/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 射线检测拾取代理对象

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import CameraBase from "../../vox/view/CameraBase";
import IRenderEntity from "../../vox/render/IRenderEntity";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import IRaySelector from '../../vox/scene/IRaySelector';
import RaySelectedNode from '../../vox/scene/RaySelectedNode';
import IRenderer from "../../vox/scene/IRenderer";
import { AABBCalc } from "../geom/AABBCalc";
import IRenderingEntitySet from "./IRenderingEntitySet";

class QueryUnit {
    ets: IRenderEntity[] = null;
    total: number = 0;
    constructor() { }
    query(ets: IRenderEntity[], total: number): void {
        this.ets = ets;
        this.total = total;
    }
}
export default class RaySelector implements IRaySelector {
    private m_renderer: IRenderer = null;
    private m_camera: CameraBase = null;
    private m_rsn: RaySelectedNode = null;
    // 最多检测256个对象
    private m_hitList: Uint8Array = new Uint8Array(256);
    private m_rsnList: RaySelectedNode[] = new Array(256);
    private m_selectedNode: RaySelectedNode = null;
    private m_selectedTotal: number = 0;
    private m_testMode: number = 0;
    private m_invpv: Vector3D = new Vector3D();
    private m_invtv: Vector3D = new Vector3D();
    private m_rlpv: Vector3D = null;
    private m_rltv: Vector3D = null;
    private m_rlsiv: Uint8Array = new Uint8Array(4);
    private m_rlinvtv: Vector3D = new Vector3D();
    private m_outv: Vector3D = new Vector3D();
    private m_vecs: Vector3D[] = [null, null];
    private m_gpuTestEnabled: boolean = false;
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
    setCamera(cam: CameraBase): void {
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
        let arr: RaySelectedNode[] = this.m_rsnList;
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
            let pos: number = this.sorting(low, high);
            this.snsort(low, pos - 1);
            this.snsort(pos + 1, high);
        }
    }

    run(): void {
        if (this.etset.getTotal() > 0) {
            let dis: number = 0.0;
            let rtv: Vector3D = this.m_rltv;
            let rpv: Vector3D = this.m_rlpv;
            let outv: Vector3D = this.m_outv;
            let node: RaySelectedNode = null;
            let total: number = 0;
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
            let i: number = 0;
            if (total > 0) {
                let invpv: Vector3D = this.m_invpv;
                let invtv: Vector3D = this.m_invtv;
                let entity: IRenderEntity = null;
                let flag: number = 0;
                let hitTotal: number = 0;
                let mat4: IMatrix4 = null;
                let rayNode: RaySelectedNode = null;
                //let pvdis: number = rtv.dot(rpv);
                //let preDis: number = 0.0;
                if (total > 1) {
                    //console.log("### A total: ",total);
                    //  this.snsort(0, total - 1);
                    let polyTest: boolean = !this.m_gpuTestEnabled;
                    for (i = 0; i < total; ++i) {

                        rayNode = this.m_rsnList[i];
                        rayNode.dis = MathConst.MATH_MAX_POSITIVE;
                        rayNode.flag = 0;
                        entity = this.m_rsnList[i].entity;

                        if (entity.isPolyhedral()) {
                            if (polyTest) {
                                //console.log("a0 ",entity);
                                mat4 = entity.getInvMatrix();
                                mat4.transformOutVector3(rpv, invpv);
                                mat4.deltaTransformOutVector(rtv, invtv);
                                invtv.normalize();
                                flag = entity.testRay(invpv, invtv, outv, true);
                            }
                            else {
                                //console.log("a1 ",entity);
                                flag = 0;
                            }
                        }
                        else {
                            //console.log("a2 ",entity);
                            mat4 = entity.getInvMatrix();
                            mat4.transformOutVector3(rpv, invpv);
                            mat4.deltaTransformOutVector(rtv, invtv);
                            invtv.normalize();
                            flag = entity.testRay(invpv, invtv, outv, true);
                        }
                        if (flag > 0) {
                            rayNode.flag = flag;
                            rayNode.lpv.copyFrom(outv);
                            entity.getMatrix().transformOutVector3(outv, rayNode.wpv);
                            // rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;
                            rayNode.dis = Vector3D.Distance(rayNode.wpv, rpv);
                            //console.log("rayNode.dis: ",rayNode.dis, entity);
                            this.m_hitList[hitTotal] = i;
                            ++hitTotal;
                            //console.log("YYYYYYYYYYYYYYYes multi Ray hit mesh success.");
                            // if (rayNode.dis > preDis) {
                            //     this.m_selectedNode = rayNode;
                            //     break;
                            // }
                        }
                        else if (flag < 0) {
                            //console.log(">>> a0 ",entity);
                            //console.log("NNNNNNNNNNNNNNNNo multi Ray hit mesh 没有做进一步的检测.");
                            this.m_hitList[hitTotal] = i;
                            ++hitTotal;
                            // if (rayNode.dis > preDis) {
                            //     this.m_selectedNode = rayNode;
                            //     break;
                            // }
                        }
                        //  preDis = rayNode.dis;
                    }
                    // if (this.m_selectedNode == null && hitTotal > 0) {
                    //     this.m_selectedNode = this.m_rsnList[this.m_hitList[0]];
                    // }
                    this.snsort(0, total - 1);
                    for (i = 0; i < total; ++i) {
                        //console.log(i+","+this.m_rsnList[i].entity,this.m_rsnList[i].flag);
                        if (this.m_rsnList[i].flag > 0) {
                            this.m_selectedNode = this.m_rsnList[i];
                            break;
                        }
                    }

                    //console.log("### B total: ",total);
                }
                else {
                    rayNode = this.m_rsnList[0];
                    rayNode.dis = MathConst.MATH_MAX_POSITIVE;
                    entity = this.m_rsnList[0].entity;
                    mat4 = entity.getInvMatrix();
                    mat4.transformOutVector3(rpv, invpv);
                    mat4.deltaTransformOutVector(rtv, invtv);
                    invtv.normalize();
                    flag = entity.testRay(invpv, invtv, outv, true);
                    //console.log("one hit flag: " + flag);
                    if (flag > 0) {
                        rayNode.lpv.copyFrom(outv);
                        entity.getMatrix().transformOutVector3(outv, rayNode.wpv);
                        //rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;
                        rayNode.dis = Vector3D.Distance(rayNode.wpv, rpv);
                        this.m_selectedNode = rayNode;
                        //console.log("YYYYYYYYYYYYYYYes Ray hit mesh success.");
                    }
                    else if (flag < 0) {
                        //console.log("NNNNNNNNNNNNNNNo Ray hit mesh 没有做进一步的检测.");
                        this.m_selectedNode = rayNode;
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
            //  else
            //  {
            //      console.log("NNNNNNNNNNNNNNNo Ray hit failure.");
            //  }
        }
    }
    clear(): void {
        this.m_selectedNode = null;
    }
}
