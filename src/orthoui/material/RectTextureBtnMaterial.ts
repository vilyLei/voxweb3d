/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Color4 from "../../vox/material/Color4";
import AABB2D from "../../vox/geom/AABB2D";

class RectTextureBtnShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: RectTextureBtnShaderBuffer = null;
    private m_uniqueName: string = "";

    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "RectTextureBtnShd";
        this.m_uniqueName += "Tex";
    }

    private buildThisCode(): void {
        let coder = this.m_coder;
        coder.reset();
        coder.mathDefineEanbled = false;
        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addTextureSample2D();
        coder.addVarying("vec4", "v_uv");
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_params", 4);
        coder.addVertUniform("vec4", "u_params", 4);

        coder.addFragFunction("");
    }
    getFragShaderCode(): string {
        this.buildThisCode();
        this.m_coder.addFragMainCode(
            `
void main() {

    vec4 bgColor = VOX_Texture2D(u_sampler0, v_uv.xy) * u_params[0];
    vec4 fgColor = VOX_Texture2D(u_sampler0, v_uv.zw) * u_params[1];
    vec3 color3 = bgColor.www * bgColor.xyz * vec3(1.0 - fgColor.w) + fgColor.xyz * fgColor.www;
    vec4 color4 = vec4(color3, bgColor.w + fgColor.w);
    FragColor0 = color4;
}
`
        );
        return this.m_coder.buildFragCode();
    }
    getVertShaderCode(): string {
        this.m_coder.addVertMainCode(
                `
void main() {
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
    v_uv.xy = u_params[2].xy + a_uvs.xy * u_params[2].zw;
    v_uv.zw = u_params[3].xy + a_uvs.xy * u_params[3].zw;
}
`
        );
        return this.m_coder.buildVertCode();
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[RectTextureBtnShaderBuffer()]";
    }

    static GetInstance(): RectTextureBtnShaderBuffer {
        if (RectTextureBtnShaderBuffer.s_instance != null) {
            return RectTextureBtnShaderBuffer.s_instance;
        }
        RectTextureBtnShaderBuffer.s_instance = new RectTextureBtnShaderBuffer();
        return RectTextureBtnShaderBuffer.s_instance;
    }
}

export default class RectTextureBtnMaterial extends MaterialBase {

    private m_params: Float32Array = new Float32Array(
        [
            1.0, 1.0, 1.0, 1.0      // background color
            , 1.0, 1.0, 1.0, 1.0    // foreground color
            , 0.0, 0.0, 1.0, 1.0    // background vu clamp rect
            , 0.0, 0.0, 1.0, 1.0    // foreground vu clamp rect
        ]);
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return RectTextureBtnShaderBuffer.GetInstance();
    }
    
    setBgUVClampRect(rect: AABB2D): void {

        this.m_params[8] = rect.x;
        this.m_params[9] = rect.y;
        this.m_params[10] = rect.width;
        this.m_params[11] = rect.height;
    }
    setFgUVClampRect(rect: AABB2D): void {

        this.m_params[12] = rect.x;
        this.m_params[13] = rect.y;
        this.m_params[14] = rect.width;
        this.m_params[15] = rect.height;
    }
    setBgColor(color: Color4): void {
        
        this.m_params[0] = color.r;
        this.m_params[1] = color.g;
        this.m_params[2] = color.b;
        this.m_params[3] = color.a;
    }
    setFgColor(color: Color4): void {
        
        this.m_params[4] = color.r;
        this.m_params[5] = color.g;
        this.m_params[6] = color.b;
        this.m_params[7] = color.a;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_params];
        return oum;
    }
}