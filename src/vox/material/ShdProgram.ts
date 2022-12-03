
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import UniformLine from "../../vox/material/code/UniformLine";
import IShdProgram from "../../vox/material/IShdProgram";
import IShaderData from "../../vox/material/IShaderData";
import DivLog from "../utils/DivLog";
export default class ShdProgram implements IShdProgram {
    private m_shdData: IShaderData = null;
    private m_uid: number = -1;
    private m_program: any = null;
    private m_rcuid: number = -1;
    private m_gl: any = null;
    private m_shdUniqueName: string = "";
    private m_texTotal: number = 0;

    // recorde uniform GLUniformLocation id
    private m_aLocations: number[] = null;
    private m_aLocationIVS: number[] = new Array(12);
    private m_aLocationTypes: number[] = null;
    private m_aLocationSizes: number[] = null;
    private m_uLocations: any[] = null;
    private m_texLocations: any[] = null;
    private m_attribLIndexList: number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    private m_attribTypeSizeList: number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    private m_attriSizeList: number[] = null;
    private m_uniformDict: Map<string, UniformLine> = new Map();
    private m_uLocationDict: Map<string, any> = new Map();
    private m_vertShader: any = null;
    private m_fragShader: any = null;
    // recode shader uniform including status
    dataUniformEnabled: boolean = false;

    constructor(uid: number) {
        this.m_uid = uid;
        this.m_aLocationIVS.fill(0);
    }

    setShdData(shdData: IShaderData): void {
        this.m_shdData = shdData;
        this.m_shdUniqueName = shdData.getUniqueShaderName();
    }
    getUid(): number {
        return this.m_uid;
    }
    getTexTotal(): number {
        return this.m_shdData.getTexTotal();
    }
    useTexLocation(): void {
        for (let i: number = 0; i < this.m_texTotal; i++) {
            this.m_gl.uniform1i(this.m_texLocations[i], i);
        }
    }
    // use texture true or false
    haveTexture(): boolean {
        return this.m_shdData.haveTexture();
    }
    private createLocations(): void {
        let i: number = 0;
        let len: number = 0;
        let attriNSList: string[] = this.m_shdData.getAttriNSList();
        if (attriNSList != null && attriNSList.length > 0) {
            if (this.m_aLocations == null) {
                this.dataUniformEnabled = false;
                let attriSizeList: number[] = this.m_shdData.getAttriSizeList();
                this.m_aLocations = [];
                this.m_aLocationTypes = [];
                this.m_aLocationSizes = [];
                const ls = this.m_aLocationTypes;
                len = attriNSList.length;
                let type: number = 0;
                let altI: number = 0;
                while (i < len) {
                    altI = this.m_gl.getAttribLocation(this.m_program, attriNSList[i]);
                    this.m_aLocations.push(altI);
                    type = VtxBufConst.GetVBufAttributeTypeByNS(attriNSList[i]);
                    ls.push(type);
                    this.m_aLocationSizes.push(attriSizeList[i]);
                    this.m_attribLIndexList[type] = altI;
                    this.m_attribTypeSizeList[type] = attriSizeList[i];
                    this.dataUniformEnabled = true;
                    ++i;
                }
                for (i = 0; i < ls.length; ++i) {
                    this.m_aLocationIVS[ls[i]] = i;
                }
                this.m_attriSizeList = [];
                for (i = 0; i < this.m_attribTypeSizeList.length; ++i) {
                    if (this.m_attribTypeSizeList[i] > 0) {
                        this.m_attriSizeList.push(this.m_attribTypeSizeList[i]);
                    }
                }
                if (RendererDevice.SHADERCODE_TRACE_ENABLED) {
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attri aLocationTypes: " + this.m_aLocationTypes);
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attri m_aLocations: " + this.m_aLocations);
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attriNSList: " + attriNSList);
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attribLIndexList: " + this.m_attribLIndexList);
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attribTypeSizeList: " + this.m_attribTypeSizeList);
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attriSizeList: " + this.m_attriSizeList);
                }
            }
        }
        if (this.m_shdData.haveCommonUniform()) {
            if (this.m_uLocations == null) {
                let uninforms: UniformLine[] = this.m_shdData.getUniforms();
                this.m_uLocations = [];
                len = uninforms.length;
                i = 0;
                let ul: any = null;
                let uns: string = "";
                while (i < len) {
                    if (!uninforms[i].isTex) {
                        uns = uninforms[i].name;
                        ul = this.m_gl.getUniformLocation(this.m_program, uns);

                        if (RendererDevice.SHADERCODE_TRACE_ENABLED) {
                            console.log("ShdProgram::createLocations() uniform, ul " + ul + ", uninforms[" + i + "].name: " + uns);
                        }
                        if (ul != null) {
                            ul.uniformName = uns;
                            ul.uniqueName = this.m_shdUniqueName;
                            uninforms[i].location = ul;
                            this.m_uniformDict.set(uns, uninforms[i]);
                            this.m_uLocationDict.set(uns, ul);
                            this.m_uLocations.push(ul);
                            this.dataUniformEnabled = true;
                        }
                        else {
                            if (RendererDevice.SHADERCODE_TRACE_ENABLED) {
                                console.warn("uniform ", uns, " was not used!");
                            }
                        }
                    }
                    ++i;
                }
            }
        }
        this.m_texTotal = this.m_shdData.getTexTotal();
        if (this.m_texTotal > 0) {
            this.m_texLocations = new Array(this.m_texTotal);
            let texnsList: string[] = this.m_shdData.getTexUniformNames();
            for (i = 0; i < this.m_texTotal; ++i) {
                texnsList[i] = "u_sampler" + i;
                this.m_texLocations[i] = this.m_gl.getUniformLocation(this.m_program, texnsList[i]);
            }
        }
    }

    getLayoutBit(): number {
        return this.m_shdData.getLayoutBit();
    }
    getMid(): number {
        return this.m_shdData.getMid();
    }
    getFragOutputTotal(): number {
        return this.m_shdData.getFragOutputTotal();
    }
    getLocationsTotal(): number {
        return this.m_aLocationTypes.length;
    }
    getLocationTypeByIndex(index: number): number {
        return this.m_aLocationTypes[index];
    }
    getLocationSizeByIndex(index: number): number {
        return this.m_aLocationSizes[index];
    }
    getLocationTypes(): number[] {
        return this.m_aLocationTypes;
    }
    getLocationIVS(): number[] {
        return this.m_aLocationIVS;
    }

    private m_attrid: number = 0;
    private m_attridIndex: number = 0;

    testVertexAttribPointerOffset(offsetList: number[]): boolean {
        let flag: boolean = false;
        if (offsetList != null && this.m_attriSizeList != null) {
            // 使用大于等于，例如绘制深度图的时候不需要法线和uv而只需要顶点数据即可
            if (offsetList.length >= this.m_attriSizeList.length) {
                let offset: number = 0;
                let i: number = 0;
                for (; i < this.m_attriSizeList.length; ++i) {
                    if (offset != offsetList[i]) {
                        break;
                    }
                    offset += this.m_attriSizeList[i] * 4;
                }
                flag = i >= this.m_attriSizeList.length;
            }
        }
        if (!flag) {
            console.error("顶点数据layout和顶点着色器中的layout(" + this.m_attriSizeList + ")不匹配");
            throw Error("Shader program vertx attributes layout can not match float attribute vertex data !!!");
        }
        return flag;
    }
    vertexAttribPointerType(attribType: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void {
        this.m_attrid = this.m_attribLIndexList[attribType];
        if (this.m_attrid > -1) {
            this.m_gl.enableVertexAttribArray(this.m_attrid);
            this.m_gl.vertexAttribPointer(this.m_attrid, this.m_attribTypeSizeList[attribType], type, normalized, stride, offset);
        }
    }
    vertexAttribPointerTypeFloat(attribType: number, stride: number, offset: number): void {
        this.m_attrid = this.m_attribLIndexList[attribType];
        if (this.m_attrid > -1) {
            this.m_gl.enableVertexAttribArray(this.m_attrid);
            this.m_gl.vertexAttribPointer(this.m_attrid, this.m_attribTypeSizeList[attribType], this.m_gl.FLOAT, false, stride, offset);
        }
    }
    testVertexAttribPointerType(attribType: number): boolean {
        return this.m_attribLIndexList[attribType] > -1;
    }
    getVertexAttribByTpye(attribType: number): number {
        return this.m_attribLIndexList[attribType];
    }
    vertexAttribPointerAt(i: number, size: number, type: number, normalized: boolean, stride: number, offset: number): void {
        this.m_attridIndex = i;
        this.m_attrid = this.m_aLocations[i];
        if (this.m_attrid > -1) {
            this.m_gl.enableVertexAttribArray(this.m_attrid);
            this.m_gl.vertexAttribPointer(this.m_attrid, size, type, normalized, stride, offset);
        }
    }
    vertexAttribPointerNext(size: number, type: number, normalized: boolean, stride: number, offset: number): void {
        this.m_attrid = this.m_aLocations[this.m_attridIndex];
        if (this.m_attrid > -1) {
            this.m_gl.enableVertexAttribArray(this.m_attrid);
            this.m_gl.vertexAttribPointer(this.m_attrid, size, type, normalized, stride, offset);
        }
        this.m_attridIndex++;
    }
    vertexAttribPointerFirst(size: number, type: number, normalized: boolean, stride: number, offset: number): void {
        this.m_attridIndex = 1;
        this.m_attrid = this.m_aLocations[0];
        if (this.m_attrid > -1) {
            this.m_gl.enableVertexAttribArray(this.m_attrid);
            this.m_gl.vertexAttribPointer(this.m_attrid, size, type, normalized, stride, offset);
        }
    }
    private m_uLc: any = null;
    private m_uIndex: number = 0;
    getUniformLocationAt(i: number): any {
        this.m_uIndex = i + 1;
        return this.m_uLocations[i];
    }
    getUniformLocationNext(): any {
        this.m_uLc = this.m_uLocations[this.m_uIndex++];
        return this.m_uLc;
    }
    getUniformLocationFirst(): any {
        this.m_uIndex = 1;
        return this.m_uLocations[0];
    }
    getUniformLocationByNS(ns: string): any {
        return this.m_uLocationDict.get(ns);
    }
    getUniformTypeNameByNS(ns: string): string {
        if (this.m_uniformDict.has(ns)) {
            return this.m_uniformDict.get(ns).typeName;
        }
        return "";
    }
    getUniformTypeByNS(ns: string): number {
        if (this.m_uniformDict.has(ns)) {
            return this.m_uniformDict.get(ns).type;
        }
        return 0;
    }
    hasUniformByName(ns: string): boolean {
        return this.m_uniformDict.has(ns);
    }
    getUniformLengthByNS(ns: string): number {
        if (this.m_uniformDict.has(ns)) {
            return this.m_uniformDict.get(ns).arrLength;
        }
        return 0;
    }
    private initShdProgram(): any {
        let gl = this.m_gl;
        let vshd_str: string = this.m_shdData.getVSCodeStr();
        let fshd_str: string = this.m_shdData.getFSCodeStr();
        //console.log("ShdProgram::initShdProgram(), this: ",this);
        let pr: RegExp;
        if (this.m_shdData.preCompileInfo == null) {
            if (RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
                if (vshd_str.indexOf(" mediump ") >= 0) {
                    pr = new RegExp(" mediump ", "g");
                    vshd_str = vshd_str.replace(pr, " highp ");
                }
                if (vshd_str.indexOf(" lowp ") >= 0) {
                    pr = new RegExp(" lowp ", "g");
                    vshd_str = vshd_str.replace(pr, " highp ");
                }
            }
        }
        if (RendererDevice.SHADERCODE_TRACE_ENABLED) {
            console.log("vert shader code: \n" + vshd_str);
        }
        let vertShader: any = this.loadShader(gl.VERTEX_SHADER, vshd_str);
        if (this.m_shdData.preCompileInfo == null) {
            if (RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
                if (fshd_str.indexOf(" mediump ") >= 0) {
                    pr = new RegExp(" mediump ", "g");
                    fshd_str = fshd_str.replace(pr, " highp ");
                }
                if (fshd_str.indexOf(" lowp ") >= 0) {
                    pr = new RegExp(" lowp ", "g");
                    fshd_str = fshd_str.replace(pr, " highp ");
                }
            }
        }
        if (RendererDevice.SHADERCODE_TRACE_ENABLED) {
            console.log("frag shader code: \n" + fshd_str);
        }
        let fragShader = this.loadShader(gl.FRAGMENT_SHADER, fshd_str);

        // Create the shader program      
        let shdProgram = gl.createProgram();
        gl.attachShader(shdProgram, fragShader);
        gl.attachShader(shdProgram, vertShader);
        gl.linkProgram(shdProgram);

        if (!gl.getProgramParameter(shdProgram, gl.LINK_STATUS)) {
            if (RendererDevice.SHADERCODE_TRACE_ENABLED) {
                console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shdProgram));
            }
            return null;
        }
        this.m_vertShader = vertShader;
        this.m_fragShader = fragShader;

        gl.detachShader(shdProgram, vertShader);
        gl.detachShader(shdProgram, fragShader);

        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        return shdProgram;
    }

    private loadShader(type: number, source: string): any {
        let shader: any = this.m_gl.createShader(type);
        this.m_gl.shaderSource(shader, source);
        this.m_gl.compileShader(shader);
        if (!this.m_gl.getShaderParameter(shader, this.m_gl.COMPILE_STATUS)) {
            if (RendererDevice.SHADERCODE_TRACE_ENABLED) {
                console.log('An error occurred compiling the shaders: ' + this.m_gl.getShaderInfoLog(shader));
            }
            this.m_gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    getUniqueShaderName(): string {
        return this.m_shdUniqueName;
    }
    enabled(): boolean {
        return this.m_program != null;
    }
    upload(gl: any, rcuid: number): void {
        if (this.m_program == null) {
            this.m_rcuid = rcuid;
            this.m_gl = gl;
            this.m_program = this.initShdProgram();
            this.m_program.uniqueName = this.m_shdUniqueName;
            if (null != this.m_program) this.createLocations();
        }
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number { return this.m_rcuid; };
    uniformBlockBinding(uniform_block_ns: string, bindingIndex: number): void {
        this.m_gl.uniformBlockBinding(this.m_program, this.m_gl.getUniformBlockIndex(this.m_program, uniform_block_ns), bindingIndex);
    }
    toString(): string {
        return "[ShdProgram(uniqueName = " + this.m_shdUniqueName + ")]";
    }
    /**
     * @returns return current gpu shader  program
     */
    getGPUProgram(): any {
        return this.m_program;
    }
    destroy(): void {
        this.m_aLocations = null;
        this.m_attriSizeList = null;
        if (this.m_texTotal > 0) {
            this.m_texLocations.fill(null);
            this.m_texTotal = 0;
        }
        if (this.m_program != null) {
            this.m_gl.deleteShader(this.m_vertShader);
            this.m_gl.deleteShader(this.m_fragShader);
            this.m_vertShader = null;
            this.m_fragShader = null;
            this.m_gl.deleteProgram(this.m_program);
            this.m_program = null;
        }
        this.m_gl = null;
        this.m_shdData = null;
    }
}