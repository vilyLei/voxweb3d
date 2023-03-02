/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../../vox/material/MaterialBase";
import Color4 from "../../../../vox/material/Color4";
import { ShaderCode } from "./ShaderCode";

class TwoTexShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance = new TwoTexShaderBuffer();
    private m_uniqueName = "";
    initialize(texEnabled: boolean): void {
        //console.log("TwoTexShaderBuffer::initialize()...");
        this.m_uniqueName = "TwoTexShd";
    }
    getFragShaderCode(): string {
        return ShaderCode.frag_body;
    }
    getVertShaderCode(): string {
        return ShaderCode.vert_body;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }

    static GetInstance(): TwoTexShaderBuffer {
        return TwoTexShaderBuffer.s_instance;
    }
}

export default class TwoTexMaterial extends MaterialBase {
    private m_data = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_uvTrans = new Float32Array([0.0, 0.0, 1.0, 1.0]);
    normalEnabled = true;
    name = "";
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return TwoTexShaderBuffer.GetInstance();
    }
    setUVOffset(px: number, py: number): void {
        this.m_uvTrans[0] = px;
        this.m_uvTrans[1] = py;
    }
    setUVScale(sx: number, sy: number): void {
        this.m_uvTrans[2] = sx;
        this.m_uvTrans[3] = sy;
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
        oum.uniformNameList = ["u_color", "u_uvTrans"];
        oum.dataList = [this.m_data, this.m_uvTrans];
        return oum;
    }
}