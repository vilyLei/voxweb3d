
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import IShaderData from "../../vox/material/IShaderData";
import IShdProgram from "../../vox/material/IShdProgram";
import ShdProgram from "../../vox/material/ShdProgram";
import IShaderUniform from "../../vox/material/IShaderUniform";

class ShaderProgramBuilder {

    private m_shdDict: Map<string, ShdProgram> = new Map();
    private m_shdList: ShdProgram[] = [];
    private m_shdListLen: number = 0;
    private m_sharedUniformList: IShaderUniform[] = [];
    private m_rcuid: number = -1;
    constructor(rcuid: number) {
        this.m_rcuid = rcuid;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    /**
     * 这里的program生成过程已经能适配多GPU context的情况了
     */
    create(shdData: IShaderData): IShdProgram {
        // console.log("this.Create() begin...");
        let uns: string = shdData.getUniqueShaderName();
        if (this.m_shdDict.has(uns)) { return this.m_shdDict.get(uns); }
        let p: ShdProgram = new ShdProgram(this.m_shdListLen);
        p.setShdData(shdData);
        this.m_shdList[p.getUid()] = p;
        this.m_sharedUniformList[p.getUid()] = null;
        ++this.m_shdListLen;
        this.m_shdDict.set(uns, p);

        if (RendererDevice.SHADERCODE_TRACE_ENABLED) {
            console.log("this.Create() a new ShdProgram: ", p.toString());
        }
        return p;
    }
    
    findShdProgramByUid(uid: number): IShdProgram {
        return this.m_shdList[uid];
    }
    findShdProgram(unique_name_str: string): IShdProgram {
        if (this.m_shdDict.has(unique_name_str)) { return this.m_shdDict.get(unique_name_str); }
        return null;
    }
    findShdProgramByShdData(shdData: IShaderData): IShdProgram {
        if (shdData != null) {
            if (this.m_shdDict.has(shdData.getUniqueShaderName())) {
                return this.m_shdDict.get(shdData.getUniqueShaderName());
            }
        }
        return null;
    }
    hasUid(resUid: number): boolean {
        return this.m_shdList[resUid] != null;
    }
    getTotal(): number {
        return this.m_shdListLen;
    }
    containsUid(uid: number): boolean {
        return uid > -1 && uid < this.m_shdListLen;
    }
}
export { ShaderProgramBuilder }