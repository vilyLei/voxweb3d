/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import ShaderCodeBuffer from "../ShaderCodeBuffer";
import Color4 from "../Color4";
export default class Default3DMaterial extends MaterialBase {
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    vtxColorEnabled: boolean = false;
    premultiplyAlpha: boolean = false;
    constructor() {
        super();
    }
    /**
     * get a shader code buf instance, for sub class override
     * @returns a ShaderCodeBuffer class instance
     */
    getCodeBuf(): ShaderCodeBuffer {
        let buf: ShaderCodeBuffer = super.getCodeBuf();
        buf.vtxColorEnabled = this.vtxColorEnabled;
        buf.premultiplyAlpha = this.premultiplyAlpha;
        return buf;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    getRGB3f(color: Color4): void {
        let ds: Float32Array = this.m_colorArray;
        color.setRGB3f(ds[0], ds[1], ds[2]);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    getRGBA4f(color: Color4): void {
        let ds: Float32Array = this.m_colorArray;
        color.setRGBA4f(ds[0], ds[1], ds[2], ds[3]);
    }
    setAlpha(pa: number): void {
        this.m_colorArray[3] = pa;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }

}