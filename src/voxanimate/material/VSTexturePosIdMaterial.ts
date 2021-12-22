/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

class VSTexturePosIdRenderShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: VSTexturePosIdRenderShaderBuffer = null;
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("VSTexturePosIdRenderShaderBuffer::initialize()...");
        this.m_uniqueName = "VSTexturePosIdMaterialShd";
        this.adaptationShaderVersion = false;
    }

    buildShader(): void {

        let coder = this.m_coder;
        coder.addVertLayout("vec4", "a_vs");
        coder.addFragUniform("vec4", "u_color");
        coder.addVertUniform("vec4", "u_vtxParams");
        this.m_uniform.add2DMap("VOX_POSITION_MAP", false, false, true);
        this.m_uniform.add2DMap("VOX_COLOR_MAP");

        coder.addFragMainCode(
            `
    FragColor0 = VOX_Texture2D(VOX_COLOR_MAP, v_uv) * u_color;
`
        );
        coder.addVertMainCode(
            `
    float index = abs(mod((a_vs.w + u_vtxParams[1]),u_vtxParams[2]));
    index *= u_vtxParams[0];
    float pv = floor(index) * u_vtxParams[0];
    float pu = fract(index);
    localPosition = vec4(a_vs.xyz,1.0);
    localPosition.xyz += VOX_Texture2D(VOX_POSITION_MAP, vec2(pu,pv)).xyz;
    gl_Position = u_projMat * u_viewMat * u_objMat * localPosition;
    v_uv = a_uvs;
`
        )
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[VSTexturePosIdRenderShaderBuffer()]";
    }
    static GetInstance(): VSTexturePosIdRenderShaderBuffer {
        if (VSTexturePosIdRenderShaderBuffer.s_instance != null) {
            return VSTexturePosIdRenderShaderBuffer.s_instance;
        }
        VSTexturePosIdRenderShaderBuffer.s_instance = new VSTexturePosIdRenderShaderBuffer();
        return VSTexturePosIdRenderShaderBuffer.s_instance;
    }
}
export class VSTexturePosIdMaterial extends MaterialBase {
    constructor() {
        super();
    }
    getCodeBuf(): ShaderCodeBuffer {
        return VSTexturePosIdRenderShaderBuffer.GetInstance();
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_posParam: Float32Array = new Float32Array([1.0 / 16, 0.0, 0.0, 0.0]);
    private m_texSize: number = 16.0;
    setTexSize(size: number): void {
        this.m_texSize = size;
        this.m_posParam[0] = 1.0 / size;
    }
    setPosTotal(total: number): void {
        this.m_posParam[2] = total;
    }
    setMoveDis(index: number): void {
        this.m_posParam[1] = index;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_vtxParams", "u_color"];
        oum.dataList = [this.m_posParam, this.m_colorArray];
        return oum;
    }
}
export default VSTexturePosIdMaterial;