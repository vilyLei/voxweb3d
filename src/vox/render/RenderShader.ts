
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MaterialConst from "../../vox/material/MaterialConst";
import IShdProgram from "../../vox/material/IShdProgram";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import IRenderShader from "../../vox/render/IRenderShader";
import IRenderResource from "../../vox/render/IRenderResource";
import IRenderShaderUniform from "../../vox/render/uniform/IRenderShaderUniform";
import { IShaderProgramBuilder } from "../../vox/material/IShaderProgramBuilder";
import DebugFlag from "../debug/DebugFlag";
// import DebugFlag from "../debug/DebugFlag";

/**
 * 作为渲染器运行时 material shader 资源的管理类
 * renderer runtime material shader resource manager
 */
export default class RenderShader implements IRenderShader, IRenderResource {

    private m_sharedUniformList: IRenderShaderUniform[] = [];
    private m_unlocked: boolean = true;
    private m_texUnlocked: boolean = false;
    private m_preuid = -1;
    private m_currShd: IShdProgram = null;
    private m_fragOutputTotal = 1;
    private m_rcuid = -1;
    private m_rc: any = null;
    private m_gpuProgram: any = null;
    private m_adapter: IRenderAdapter = null;
    private m_guniform: IRenderShaderUniform = null;
    // material相关的uniform,默认不包括transform相关的信息
    private m_uniform: IRenderShaderUniform = null;
    // 只有transform相关的信息uniform
    private m_trsu: IRenderShaderUniform = null;
    private m_shdPB: IShaderProgramBuilder = null;
    // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合
    drawFlag = -1;

    constructor(rcuid: number, gl: any, adapter: IRenderAdapter, shdProgramBuilder: IShaderProgramBuilder) {

        this.m_rcuid = rcuid;
        this.m_rc = gl;
        this.m_adapter = adapter;
        this.m_shdPB = shdProgramBuilder;
    }
    createResByParams3(resUid: number, param0: number, param1: number, param2: number): boolean {
        return false;
    }
	setGLCtx(gl: any): void {
		// console.log("RenderShader::setGLCtx(), gl: ", gl);
		this.m_rc = gl;
		this.m_sharedUniformList = [];
	}
    /**
     * @returns return system gpu context
     */
    getRC(): any {
        return this.m_rc;
    }
    /**
     * @returns return current gpu shader  program
     */
    getGPUProgram(): any {
        return this.m_gpuProgram;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    useTransUniform(u: IRenderShaderUniform): void {
        if (this.m_trsu != u) {
            // if(DebugFlag.Flag_0 > 0) {
            //     console.log("useTransUniform() ...", u.dataList);
            // }
            this.m_trsu = u;
            u.use(this);
        }
    }
    useUniform(uniform: IRenderShaderUniform): void {
        if (this.m_uniform != uniform) {
            this.m_uniform = uniform;
            uniform.use(this);
        }
    }

    updateUniform(uniform: IRenderShaderUniform): void {
        if (uniform != null) {
            uniform.use(this);
        }
    }
    unlock(): void {
        this.m_unlocked = true;
        this.__$globalUniform = null;
    }
    isUnLocked(): boolean {
        return this.m_unlocked;
    }
    lock(): void {
        this.m_unlocked = false;
    }

    textureUnlock(): void {
        this.m_texUnlocked = true;
    }
    isTextureUnLocked(): boolean {
        return this.m_texUnlocked;
    }
    textureLock(): void {
        this.m_texUnlocked = false;
    }

    setSharedUniformByShd(shd: IShdProgram, uniform: IRenderShaderUniform): void {
        this.m_sharedUniformList[shd.getUid()] = uniform;
    }
    getSharedUniformByShd(shd: IShdProgram): IRenderShaderUniform {
        return this.m_sharedUniformList[shd.getUid()];
    }
    getCurrFragOutputTotal(): number {
        return this.m_fragOutputTotal;
    }
    /**
     * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
     * @param resUid renderer runtime resource unique id
     * @returns has or has not resource by unique id
     */
    hasResUid(resUid: number): boolean {
        // return this.m_shdList[resUid] != null;
        return this.m_shdPB.hasUid( resUid );
    }
    /**
     * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
     * @param resUid renderer runtime resource unique id
     */
    bindToGpu(resUid: number): void {
        //if (this.m_unlocked && resUid > -1 && resUid < this.m_shdListLen) {
        if (this.m_unlocked && this.m_shdPB.containsUid( resUid )) {
            if (this.m_preuid != resUid) {
                this.m_preuid = resUid;

                //let shd: IShdProgram = this.m_shdList[resUid];
                let shd = this.m_shdPB.findShdProgramByUid(resUid);
                this.m_fragOutputTotal = shd.getFragOutputTotal();
                if (this.m_fragOutputTotal != this.getActiveAttachmentTotal()) {
                    // if(RendererDevice.SHOWLOG_ENABLED) {
                    console.log("shd.getUniqueShaderName(): string: " + shd.getUniqueShaderName());
                    console.log("this.m_fragOutputTotal: " + this.m_fragOutputTotal + ", rc.getActiveAttachmentTotal(): " + this.getActiveAttachmentTotal());
                    console.error("Error: MRT output amount is not equal to current shader( " + shd.toString() + " ) frag shader output amount !!!");
                    // }
                }
                this.m_gpuProgram = shd.getGPUProgram();
				// if(DebugFlag.Flag_0 > 0) {
				// 	console.log("this.m_gpuProgram: ", this.m_gpuProgram);
				// }
                this.m_rc.useProgram(this.m_gpuProgram);
                shd.useTexLocation();
                // console.log("use a new shader uid: ",shd.getUid(),",uns: ",shd.getUniqueShaderName());
                // if(DebugFlag.Flag_0 > 0) {
                //     console.log("use a new shader uid: ",shd.getUid(),",uns: ",shd.getUniqueShaderName());
                // }
                // use global shared uniform
                let uniform = this.m_sharedUniformList[shd.getUid()];
                //  let boo: boolean = false;
                //  if((uniform as any).uns == "u_projMat") {
                //      console.log("only use projMat begin");
                //      boo = true;
                //  }
                this.m_guniform = uniform;
                while (uniform != null) {
                    uniform.use(this);
                    uniform = uniform.next;
                }
                this.m_currShd = shd;
                //  if( boo ) {
                //      console.log("only use projMat end");
                //  }
            }
            else if (this.m_guniform == null && this.m_currShd != null) {
                let uniform = this.m_sharedUniformList[this.m_currShd.getUid()];
                this.m_guniform = uniform;
                while (uniform != null) {
                    uniform.use(this);
                    uniform = uniform.next;
                }
            }
        }
    }
    /**
     * get system gpu context resource buf
     * @param resUid renderer runtime resource unique id
     * @returns system gpu context resource buf
     */
    getGpuBuffer(resUid: number): any {
        return null;
    }
    getCurrentShd(): IShdProgram {
        return this.m_currShd;
    }
    getCurrentShdUid(): number {
        return this.m_preuid;
    }
    resetTransUniform(): void {
        this.m_trsu = null;
    }
    resetUniform(): void {
        this.m_uniform = null;
        this.m_trsu = null;
        this.m_guniform = null;
    }
    resetRenderState(): void {
        this.drawFlag = -1;
    }
    /**
     * frame begin run this function
     */
    renderBegin(): void {
        this.m_fragOutputTotal = 1;
        this.m_preuid = -1;
        this.m_currShd = null;
        this.drawFlag = -1;
        //this.resetUniform();
    }

    /**
     * frame update
     */
    update(): void {
    }
    destroy(): void {
        this.m_rc = null;
        this.m_adapter = null;
    }
    useUniformToCurrentShd(uniform: IRenderShaderUniform): void {
        if (this.m_uniform != uniform) {
            this.m_uniform != uniform;
            uniform.useByShd(this, this.m_currShd);
        }
    }
    __$globalUniform: IRenderShaderUniform = null;
    useUniform2ToCurrentShd(uniform: IRenderShaderUniform, transUniform: IRenderShaderUniform): void {
        if (this.m_uniform != uniform) {
            this.m_uniform != uniform;
            uniform.useByShd(this, this.m_currShd);
        }
        if (this.m_trsu != transUniform) {
            this.m_trsu != transUniform;
            transUniform.useByShd(this, this.m_currShd);
        }
    }
    /**
     * 仅仅更新单个matrix4的uniforms数据
    */
    useUniformMat4(ult: any, mat4f32Arr: Float32Array): void {
        // console.log("df");
        this.m_rc.uniformMatrix4fv(ult, false, mat4f32Arr);
    }
    useUniformV2(ult: any, type: number, f32Arr: Float32Array, dataSize: number, offset: number): void {
		const mc = MaterialConst;
		const rc = this.m_rc;
        // console.log("useUniformV2 A, type:",type,", dataSize: ",dataSize);
        switch (type) {
            case mc.SHADER_MAT4:
				// if(DebugFlag.Flag_0 > 0) {
				// 	console.log("useUniformV2 Mat4, ult:",ult);
				// 	console.log("useUniformV2 Mat4, rc:",rc);
				// 	console.log("useUniformV2 Mat4, f32Arr:",f32Arr,", dataSize: ",dataSize);
				// }
                rc.uniformMatrix4fv(ult, false, f32Arr, offset, dataSize * 16);
                break;
            case mc.SHADER_MAT3:
                rc.uniformMatrix3fv(ult, false, f32Arr, 0, dataSize * 9);
                break;
            case mc.SHADER_VEC4FV:
                // console.log("useUniformV2, f32Arr: ",f32Arr);
                rc.uniform4fv(ult, f32Arr, offset, dataSize * 4);
                break;
            case mc.SHADER_VEC3FV:
                rc.uniform3fv(ult, f32Arr, offset, dataSize * 3);
                break;
            case mc.SHADER_VEC4:
                // console.log("useUniformV2, vec4 f32Arr.length: ",f32Arr.length);
                rc.uniform4f(ult, f32Arr[0], f32Arr[1], f32Arr[2], f32Arr[3]);
                break;
            case mc.SHADER_VEC3:
                rc.uniform3f(ult, f32Arr[0], f32Arr[1], f32Arr[2]);
                break;
            case mc.SHADER_VEC2:
                rc.uniform2f(ult, f32Arr[0], f32Arr[1]);
                break;
            default:
                break;
        }
    }
    useUniformV1(ult: any, type: number, f32Arr: Float32Array, dataSize: number): void {
		const mc = MaterialConst;
		const rc = this.m_rc;
        // console.log("useUniformV1 A, dataSize: ",dataSize, ", f32Arr: ", f32Arr);
        switch (type) {
            case mc.SHADER_MAT4:
                rc.uniformMatrix4fv(ult, false, f32Arr);
                break;
            case mc.SHADER_MAT3:
                rc.uniformMatrix3fv(ult, false, f32Arr);
                break;
            case mc.SHADER_VEC4FV:
                rc.uniform4fv(ult, f32Arr, dataSize * 4);
                break;
            case mc.SHADER_VEC3FV:
                rc.uniform3fv(ult, f32Arr, dataSize * 3);
                break;
            case mc.SHADER_VEC4:
                rc.uniform4f(ult, f32Arr[0], f32Arr[1], f32Arr[2], f32Arr[3]);
                break;
            case mc.SHADER_VEC3:
                rc.uniform3f(ult, f32Arr[0], f32Arr[1], f32Arr[2]);
                break;
            case mc.SHADER_VEC2:
                rc.uniform2f(ult, f32Arr[0], f32Arr[1]);
                break;
            default:
                break;
        }
    }
    getActiveAttachmentTotal(): number {
        return this.m_adapter.getActiveAttachmentTotal();
    }
}
