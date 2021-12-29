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

    normalEnabled: boolean = false;
    diffuseMapEnabled: boolean = true;

    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("VSTexturePosIdRenderShaderBuffer::initialize()...");
        this.m_uniqueName = "VSTexturePosIdMaterialShd";
        this.adaptationShaderVersion = false;
    }

    buildShader(): void {

        let coder = this.m_coder;
        coder.normalEnabled = this.normalEnabled;
        coder.addVertLayout("vec4", "a_vs");
        
        coder.addFragUniform("vec4", "u_color");
        coder.addVertUniform("vec4", "u_vtxParam");
        this.m_uniform.add2DMap("VTX_CURVE_MOVE_MAP", false, false, true);
        if(this.diffuseMapEnabled) {
            this.m_uniform.addDiffuseMap();
        }

        coder.addVertFunction(
            `
void  initLocalPos() {
    localPosition = vec4(a_vs.xyz, 1.0);
    
    vec4 params = u_vtxParam;
    float index = abs(mod((a_vs.w + params[1]),params[2]));
    index *= params[0];
    vec2 puv = vec2(fract(index), floor(index) * params[0]);
    localPosition.xyz += VOX_Texture2D(VTX_CURVE_MOVE_MAP, puv).xyz;
}
            `
        );
        coder.addFragMainCode(
            `
    #ifdef VOX_USE_2D_MAP
        FragColor0 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv) * u_color;
    #else
        FragColor0 = u_color;
    #endif
    //FragColor0.xyz *= abs(v_worldNormal.xyz);
`
        );
        coder.addVertMainCode(
            `
    initLocalPos();
    
    worldPosition = u_objMat * localPosition;
    viewPosition = u_viewMat * worldPosition;
    gl_Position = u_projMat * viewPosition;
    #ifdef VOX_USE_2D_MAP
        v_uv = a_uvs;
    #endif
    #ifdef VOX_USE_NORMAL
        v_worldNormal = normalize(a_nvs.xyz * inverse(mat3(u_objMat)));
    #endif
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
    normalEnabled: boolean = false;
    diffuseMapEnabled: boolean = true;
    constructor() {
        super();
    }
    protected buildBuf(): void {
        let buf = VSTexturePosIdRenderShaderBuffer.GetInstance();
        buf.normalEnabled = this.normalEnabled;
        buf.diffuseMapEnabled = this.diffuseMapEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return VSTexturePosIdRenderShaderBuffer.GetInstance();
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_posParam: Float32Array = new Float32Array([1.0 / 16, 0.0, 0.0, 0.0]);
    setTexSize(size: number): void {
        this.m_posParam[0] = 1.0 / size;
    }
    setPositionsTotal(total: number): void {
        this.m_posParam[2] = total;
    }
    setCurveMoveDistance(index: number): void {
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
        oum.uniformNameList = ["u_vtxParam", "u_color"];
        oum.dataList = [this.m_posParam, this.m_colorArray];
        return oum;
    }
}
export default VSTexturePosIdMaterial;