/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import Color4 from "../../../vox/material/Color4";
import { ShaderCode } from "./ShaderCode";
import { ShaderCode1 } from "./ShaderCode1";

class BakeShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance = new BakeShaderBuffer();
    private m_uniqueName = "";

    shaderType = 0;
    initialize(texEnabled: boolean): void {
        //console.log("BakeShaderBuffer::initialize()...");
        this.m_uniqueName = "BakeShd";
    }
    
    getFragShaderCode(): string {
        
        if(this.shaderType == 0) {
            return ShaderCode.frag_body;
        }else if(this.shaderType == 1) {
            console.log("HHHHHHHHHHJJJJJJJJJJJJJJ frag");
            return ShaderCode1.frag_body;
        }        
        return ShaderCode.frag_body;
    }
    getVertShaderCode(): string {
        
        if(this.shaderType == 0) {
            return ShaderCode.vert_body;
        }else if(this.shaderType == 1) {
            console.log("HHHHHHHHHHJJJJJJJJJJJJJJ vert");
            return ShaderCode1.vert_body;
        }
        return ShaderCode.vert_body;
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName + "_" + this.shaderType;
    }

    static GetInstance(): BakeShaderBuffer {
        return BakeShaderBuffer.s_instance;
    }
}

export default class BakeMaterial extends MaterialBase {
    private m_data = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_shaderType = 0;
    constructor(type: number = 0) {
        super();
        this.m_shaderType = type;
    }

    getCodeBuf(): ShaderCodeBuffer {
        let ins = BakeShaderBuffer.GetInstance();
        ins.shaderType = this.m_shaderType;
        console.log("HHHHHHHHHHJJJJJJJJJJJJJJ A0, ins.shaderType: ", ins.shaderType);
        return ins;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_data[0] = pr;
        this.m_data[1] = pg;
        this.m_data[2] = pb;
    }
    getRGB3f(color: Color4): void {
        let ds = this.m_data;
        color.setRGB3f(ds[0], ds[1], ds[2]);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_data[0] = pr;
        this.m_data[1] = pg;
        this.m_data[2] = pb;
        this.m_data[3] = pa;
    }
    getRGBA4f(color: Color4): void {
        color.fromArray4(this.m_data);
    }
    setAlpha(pa: number): void {
        this.m_data[3] = pa;
    }
    getAlpha(): number {
        return this.m_data[3];
    }
    setColor(color: Color4): void {
        color.toArray4(this.m_data);
    }
    getColor(color: Color4): void {
        color.fromArray4(this.m_data);
    }
    createSelfUniformData(): ShaderUniformData {
        let oum = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_data];
        return oum;
    }
}