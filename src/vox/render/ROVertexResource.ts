/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxShdCtr from "../../vox/material/IVtxShdCtr";
import IROVtxBuilder from "../../vox/render/IROVtxBuilder";
import IVertexRenderObj from "../../vox/render/IVertexRenderObj";
import IRenderResource from "../../vox/render/IRenderResource";
import DivLog from "../utils/DivLog";
import {GpuVtxObect} from "./vtx/GpuVtxObect";

// gpu vertex buffer renderer resource
class ROVertexResource implements IRenderResource {
    private m_resMap: Map<number, GpuVtxObect> = new Map();
    private m_freeMap: Map<number, GpuVtxObect> = new Map();
    private m_updateIds: number[] = [];
    // 显存的vtx buffer的总数
    private m_vtxResTotal: number = 0;
    private m_attachTotal: number = 0;
    private m_delay: number = 128;
    private m_haveDeferredUpdate: boolean = false;

    // renderer context unique id
    private m_rcuid: number = 0;
    private m_gl: any = null;
    private m_vtxBuilder: IROVtxBuilder = null;

    unlocked: boolean = true;
    constructor(rcuid: number, gl: any, vtxBuilder: IROVtxBuilder) {
        this.m_rcuid = rcuid;
        this.m_gl = gl;
        this.m_vtxBuilder = vtxBuilder;
    }
    createResByParams3(resUid: number, param0: number, param1: number, param2: number): boolean {
        return false;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    /**
     * @returns return system gpu context
     */
    getRC(): any {
        return this.m_gl;
    }
    /**
     * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
     * @param resUid renderer runtime resource unique id
     * @returns has or has not resource by unique id
     */
    hasResUid(resUid: number): boolean {
        return this.m_resMap.has(resUid);
    }
    /**
     * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
     * @param resUid renderer runtime resource unique id
     */
    bindToGpu(resUid: number): void {
    }
    /**
     * get system gpu context resource buf
     * @param resUid renderer runtime resource unique id
     * @returns system gpu context resource buf
     */
    getGpuBuffer(resUid: number): any {
        return null;
    }
    renderBegin(): void {
        this.m_vtxBuilder.renderBegin();
    }
    getVertexResTotal(): number {
        return this.m_vtxResTotal;
    }
    updateDataToGpu(resUid: number, deferred: boolean): void {
        if (deferred) {
            this.m_updateIds.push(resUid);
            this.m_haveDeferredUpdate = true;
        }
        else {
            if (this.m_resMap.has(resUid)) {
                this.m_resMap.get(resUid).updateToGpu(this.m_vtxBuilder);
            }
        }
    }
    addVertexRes(object: GpuVtxObect): void {
        if (!this.m_resMap.has(object.resUid)) {
            object.waitDelTimes = 0;

            //console.log("ROTextureResource add a texture buffer(resUid="+object.resUid+")");
            this.m_resMap.set(object.resUid, object);
            this.m_vtxResTotal++;
        }
    }
    getVertexRes(resUid: number): GpuVtxObect {
        return this.m_resMap.get(resUid);
    }
    destroyRes(resUid: number): void {
        if (this.m_resMap.has(resUid)) {
            this.m_resMap.get(resUid).destroy(this.m_vtxBuilder);
        }
    }
    __$attachRes(resUid: number): void {
        if (this.m_resMap.has(resUid)) {
            this.m_attachTotal++;
            let object: GpuVtxObect = this.m_resMap.get(resUid);
            if (object.getAttachCount() < 1) {
                if (this.m_freeMap.has(resUid)) {
                    this.m_freeMap.delete(resUid);
                }
            }
            object.waitDelTimes = 0;
            object.__$attachThis();
        }
    }
    __$detachRes(resUid: number): void {
        if (this.m_resMap.has(resUid)) {
            if (this.m_resMap.has(resUid)) {
                let object: GpuVtxObect = this.m_resMap.get(resUid);
                if (object.getAttachCount() > 0) {
                    this.m_attachTotal--;
                    object.__$detachThis();
                    if (object.getAttachCount() < 1) {
                        // 将其加入待清理的map
                        this.m_freeMap.set(resUid, object);
                    }
                }
            }
        }
    }
    getVROByResUid(resUid: number, shdp: IVtxShdCtr, vaoEnabled: boolean): IVertexRenderObj {
        let vtxObj: GpuVtxObect = this.m_resMap.get(resUid);
        if (vtxObj != null) {
            return vtxObj.createVRO(this.m_vtxBuilder, shdp, vaoEnabled);
        }
        return null;
    }
    update(): void {
        if(this.m_haveDeferredUpdate) {
            let len: number = this.m_updateIds.length;
            if (len > 0) {    
                if(len > 16) len = 16;    
                let resUid: number;
                for (let i: number = 0; i < len; ++i) {
                    resUid = this.m_updateIds.shift();
                    if (this.m_resMap.has(resUid)) {
                        //console.log("ROvtxRes("+resUid+") update vtx("+resUid+") data to gpu with deferred mode.");
                        this.m_resMap.get(resUid).updateToGpu(this.m_vtxBuilder);
                    }
                }
            }
            else {                
                this.m_haveDeferredUpdate = false;
            }
        }
        this.m_delay--;
        if (this.m_delay < 1) {
            this.m_delay = 128;
            for (const [key, value] of this.m_freeMap) {
                value.waitDelTimes++;
                if (value.getAttachCount() < 1) {
                    if (value.waitDelTimes > 5) {
                        console.log("ROVertexResource remove a vertex buffer(resUid=" + value.resUid + ")");
                        this.m_resMap.delete(value.resUid);
                        this.m_freeMap.delete(value.resUid);

                        value.destroy(this.m_vtxBuilder);
                        this.m_vtxResTotal--;
                    }
                }
                else {
                    console.log("ROVertexResource repeat use a vertex buffer(resUid=" + value.resUid + ") from freeMap.");
                    this.m_freeMap.delete(value.resUid);
                }
            }
        }
    }

}
export default ROVertexResource;
export { ROVertexResource };