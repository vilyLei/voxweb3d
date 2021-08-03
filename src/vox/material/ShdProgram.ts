
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../vox/render/RendererDeviece";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import UniformLine from "../../vox/material/code/UniformLine";
import IVtxShdCtr from "../../vox/material/IVtxShdCtr";
import IShaderData from "../../vox/material/IShaderData";
export default class ShdProgram implements IVtxShdCtr {
    private m_shdData: IShaderData = null;
    private m_uid: number = -1;
    private m_program: any = null;
    private m_rcuid: number = -1;
    private m_gl: any = null;
    private m_shdUniqueName: string = "";
    private m_texTotal: number = 0;

    // recorde uniform GLUniformLocation id
    private m_aLocations: number[] = null;
    private m_aLocationTypes: number[] = null;
    private m_aLocationSizes: number[] = null;
    private m_uLocations: any[] = null;
    private m_texLocations: any[] = null;
    private m_attribLIndexList: number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    private m_attribTypeSizeList: number[] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    private m_uniformDict: Map<string, UniformLine> = new Map();
    private m_uLocationDict: Map<string, any> = new Map();
    private m_vtxShd: any = null;
    private m_frgShd: any = null;
    // recode shader uniform including status
    dataUniformEnabled: boolean = false;
    
    constructor(uid: number) {
        this.m_uid = uid;//ShdProgram.s_uid++;
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
                len = attriNSList.length;
                let type: number = 0;
                let altI: number = 0;
                while (i < len) {
                    altI = this.m_gl.getAttribLocation(this.m_program, attriNSList[i]);
                    this.m_aLocations.push(altI);
                    type = VtxBufConst.GetVBufAttributeTypeByNS(attriNSList[i]);
                    this.m_aLocationTypes.push(type);
                    this.m_aLocationSizes.push(attriSizeList[i]);
                    this.m_attribLIndexList[type] = altI;
                    this.m_attribTypeSizeList[type] = attriSizeList[i];
                    this.dataUniformEnabled = true;
                    ++i;
                }
                if (RendererDeviece.SHADERCODE_TRACE_ENABLED) {
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attri aLocationTypes: " + this.m_aLocationTypes);
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attri m_aLocations: " + this.m_aLocations);
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), attriNSList: " + attriNSList);
                    console.log("ShdProgram(" + this.m_uid + ")::createLocations(), m_attribLIndexList: " + this.m_attribLIndexList);
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

                        if (RendererDeviece.SHADERCODE_TRACE_ENABLED) {
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
                            if (RendererDeviece.SHADERCODE_TRACE_ENABLED) {
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

    private m_attrid: number = 0;
    private m_attridIndex: number = 0;
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
        let uniform: UniformLine = this.m_uniformDict.get(ns);
        if (uniform != null) {
            return uniform.typeName;
        }
        return "";
    }
    getUniformTypeByNS(ns: string): number {
        let uniform: UniformLine = this.m_uniformDict.get(ns);
        if (uniform != null) {
            return uniform.type;
        }
        return 0;
    }
    hasUniformByName(ns: string): boolean {
        return this.m_uniformDict.has(ns);
    }
    getUniformLengthByNS(ns: string): number {
        if (this.m_uniformDict.has(ns)) {
            this.m_uniformDict.get(ns).arrLength;
        }
        return 0;
    }
    private initShdProgram(): any {
        let vshd_str: string = this.m_shdData.getVSCodeStr();
        let fshd_str: string = this.m_shdData.getFSCodeStr();
        //console.log("ShdProgram::initShdProgram(), this: ",this);
        let pr: RegExp;
        if (RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
            if (vshd_str.indexOf(" mediump ") >= 0) {
                pr = new RegExp(" mediump ", "g");
                vshd_str = vshd_str.replace(pr, " highp ");
            }
            if (vshd_str.indexOf(" lowp ") >= 0) {
                pr = new RegExp(" lowp ", "g");
                vshd_str = vshd_str.replace(pr, " highp ");
            }
        }
        if (RendererDeviece.SHADERCODE_TRACE_ENABLED) {
            console.log("vshd_str: \n" + vshd_str);
        }
        let vtxShd: any = this.loadShader(this.m_gl.VERTEX_SHADER, vshd_str);
        if (RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED) {
            if (fshd_str.indexOf(" mediump ") >= 0) {
                pr = new RegExp(" mediump ", "g");
                fshd_str = fshd_str.replace(pr, " highp ");
            }
            if (fshd_str.indexOf(" lowp ") >= 0) {
                pr = new RegExp(" lowp ", "g");
                fshd_str = fshd_str.replace(pr, " highp ");
            }
        }
        if (RendererDeviece.SHADERCODE_TRACE_ENABLED) {
            console.log("fshd_str: \n" + fshd_str);
        }
        let frgShd: any = this.loadShader(this.m_gl.FRAGMENT_SHADER, fshd_str);
        // Create the shader program      
        let shdProgram: any = this.m_gl.createProgram();
        this.m_gl.attachShader(shdProgram, frgShd);
        this.m_gl.attachShader(shdProgram, vtxShd);
        this.m_gl.linkProgram(shdProgram);
        // If creating the shader program failed, alert
        if (!this.m_gl.getProgramParameter(shdProgram, this.m_gl.LINK_STATUS)) {
            if (RendererDeviece.SHADERCODE_TRACE_ENABLED) {
                console.log('Unable to initialize the shader program: ' + this.m_gl.getProgramInfoLog(shdProgram));
            }
            return null;
        }
        this.m_vtxShd = vtxShd;
        this.m_frgShd = frgShd;
        return shdProgram;
    }

    private loadShader(type: number, source: string): any {
        let shader: any = this.m_gl.createShader(type);
        this.m_gl.shaderSource(shader, source);
        this.m_gl.compileShader(shader);
        if (!this.m_gl.getShaderParameter(shader, this.m_gl.COMPILE_STATUS)) {
            if (RendererDeviece.SHADERCODE_TRACE_ENABLED) {
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

        if (this.m_texTotal > 0) {
            this.m_texLocations.fill(null);
            this.m_texTotal = 0;
        }
        if (this.m_program != null) {
            this.m_gl.deleteShader(this.m_vtxShd);
            this.m_gl.deleteShader(this.m_frgShd);
            this.m_vtxShd = null;
            this.m_frgShd = null;
            this.m_gl.deleteProgram(this.m_program);
            this.m_program = null;
        }
        this.m_gl = null;
        this.m_shdData = null;
    }
}