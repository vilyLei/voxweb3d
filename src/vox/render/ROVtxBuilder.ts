/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxShdCtr from "../../vox/material/IVtxShdCtr";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import RCExtension from "../../vox/render/RCExtension";
import IROVtxBuilder from "../../vox/render/IROVtxBuilder";
import DebugFlag from "../debug/DebugFlag";

export default class ROVtxBuilder implements IROVtxBuilder {

    private m_rcuid: number = 0;
    private m_glVer: number = 2;
    private m_rc: any = null;
    vroUid: number = 0;
    rioUid: number = 0;
    constructor() {
    }
	setGLCtx(gl: any): void {
		this.m_rc = gl;
	}
    /**
     * @returns return system gpu context
     */
    getRC(): any {
        return this.m_rc;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    createBuf(): any {
        return this.m_rc.createBuffer();
    }
    deleteBuf(buf: any): void {
        this.m_rc.deleteBuffer(buf);
    }
    bindArrBuf(buf: any): void {
        this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, buf);
    }
    bindEleBuf(buf: any): void {
        this.m_rc.bindBuffer(this.m_rc.ELEMENT_ARRAY_BUFFER, buf);
    }
    arrBufSubData(float32Arr: Float32Array, offset: number): void {
        this.m_rc.bufferSubData(this.m_rc.ARRAY_BUFFER, offset, float32Arr);
    }
    arrBufData(float32Arr: Float32Array, usage: number): void {
        this.m_rc.bufferData(this.m_rc.ARRAY_BUFFER, float32Arr, VtxBufConst.ToGL(this.m_rc, usage));
    }
    eleBufSubData(uintDataArr: Uint16Array | Uint32Array, offset: number): void {
        this.m_rc.bufferSubData(this.m_rc.ELEMENT_ARRAY_BUFFER, offset, uintDataArr);
    }
    eleBufData(uintDataArr: Uint16Array | Uint32Array, usage: number): void {
        this.m_rc.bufferData(this.m_rc.ELEMENT_ARRAY_BUFFER, uintDataArr, VtxBufConst.ToGL(this.m_rc, usage));
    }
    arrBufDataMem(bytesSize: number, usage: number): void {
        this.m_rc.bufferData(this.m_rc.ARRAY_BUFFER, bytesSize, VtxBufConst.ToGL(this.m_rc, usage));
    }
    eleBufDataMem(bytesSize: number, usage: number): void {
        this.m_rc.bufferData(this.m_rc.ELEMENT_ARRAY_BUFFER, bytesSize, VtxBufConst.ToGL(this.m_rc, usage));
    }
    useVtxAttribsPtrTypeFloat(shdp: IVtxShdCtr, buf: any, attribTypes: number[], attribTypesLen: number, wholeOffsetList: number[], wholeStride: number): void {
        this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, buf);

        for (let i: number = 0; i < attribTypesLen; ++i) {
            shdp.vertexAttribPointerTypeFloat(attribTypes[i], wholeStride, wholeOffsetList[i]);
        }
    }
    useVtxAttribsPtrTypeFloatMulti(shdp: IVtxShdCtr, bufs: any[], attribTypes: number[], attribTypesLen: number, wholeOffsetList: number[], wholeStride: number): void {
        for (let i: number = 0; i < attribTypesLen; ++i) {
            this.m_rc.bindBuffer(this.m_rc.ARRAY_BUFFER, bufs[i]);
            shdp.vertexAttribPointerTypeFloat(attribTypes[i], wholeStride, wholeOffsetList[i]);
        }
    }
    createVertexArray(): any {
        let vao: any = null;
        if (this.m_glVer == 2) {
            vao = this.m_rc.createVertexArray();
        }
        else {
            vao = RCExtension.OES_vertex_array_object.createVertexArrayOES();
        }
        return vao;
    }
    bindVertexArray(vao: any): any {
        if (this.m_glVer == 2) {
            this.m_rc.bindVertexArray(vao);
        }
        else {
            RCExtension.OES_vertex_array_object.bindVertexArrayOES(vao);
        }
        return vao;
    }
    deleteVertexArray(vao: any): void {
        if (this.m_glVer == 2) {
            this.m_rc.deleteVertexArray(vao);
        }
        else {
            RCExtension.OES_vertex_array_object.deleteVertexArrayOES(vao);
        }
    }

    testVROUid(vroUid: number): boolean {
        if (this.vroUid != vroUid) {
            this.vroUid = vroUid;
            return true;
        }
        return false;
    }
    testRIOUid(rioUid: number): boolean {
        if (this.rioUid != rioUid) {
            this.rioUid = rioUid;
            return true;
        }
        return false;
    }
    public initialize(rcuid: number, gl: any, glVer: number): void {
        this.m_rc = gl;
        this.m_rcuid = rcuid;
        this.m_glVer = glVer;
        let selfT: any = this;
        selfT.RGBA = gl.RGBA;
        selfT.UNSIGNED_BYTE = gl.UNSIGNED_BYTE;
        selfT.TRIANGLE_STRIP = gl.TRIANGLE_STRIP;
        selfT.TRIANGLE_FAN = gl.TRIANGLE_FAN;
        selfT.TRIANGLES = gl.TRIANGLES;
        selfT.LINES = gl.LINES;
        selfT.LINE_STRIP = gl.LINE_STRIP;
        selfT.UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
        selfT.UNSIGNED_INT = gl.UNSIGNED_INT;
        selfT.COLOR = gl.COLOR;
        selfT.DEPTH = gl.DEPTH;
        selfT.STENCIL = gl.STENCIL;
        selfT.DEPTH_STENCIL = gl.DEPTH_STENCIL;
		this.setGLCtx(gl);
    }
    renderBegin(): void {
        this.vroUid = -2;
        this.rioUid = -3;
    }
}
