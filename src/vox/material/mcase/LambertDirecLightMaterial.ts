/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/../material/MaterialBase";
import UniformConst from "../UniformConst";

class LambertDirecLightShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }

    private static s_instance: LambertDirecLightShaderBuffer = new LambertDirecLightShaderBuffer();
    private m_uniqueName: string = "";
    normalMapEnabled: boolean = false;
    displacementMapEnabled: boolean = false;

    initialize(texEnabled: boolean): void {
        //console.log("LambertDirecLightShaderBuffer::initialize()...");
        this.m_uniqueName = "LambertDirecLightShd";
        if(texEnabled) this.m_uniqueName += "Tex";
        if(this.normalMapEnabled) this.m_uniqueName += "Nor";
        if(this.displacementMapEnabled) this.m_uniqueName += "Disp";
    }

    private buildThisCode(): void {
        let coder = ShaderCodeBuffer.s_coder;
        coder.vertMatrixInverseEnabled = true;
        coder.addVertLayout("vec3", "a_vs");
        if (this.isTexEanbled()) {
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
            // diffuse color
            coder.addTextureSample2D();
            if(this.normalMapEnabled) {
                coder.addTextureSample2D("VOX_NORMAL_MAP");
            }
            if(this.displacementMapEnabled) {
                coder.addVertUniform("vec4", "u_displacement");
                coder.addTextureSample2D("VOX_DISPLACEMENT_MAP",true,false,true);
            }
        }
        coder.addVertLayout("vec3", "a_nvs");

        coder.addFragUniformParam(UniformConst.CameraPosParam);

        coder.addVarying("vec3", "v_nv");
        coder.addVarying("vec3", "v_worldPos");
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_color");
        coder.useVertSpaceMats(true, true, true);

    }

    getFragShaderCode(): string {
        this.buildThisCode();

        ShaderCodeBuffer.s_coder.addFragMainCode(
`
vec3 NV = vec3(1.0);
vec3 WorldPos = vec3(1.0);
vec3 CameraPos = vec3(1.0);

const vec3 lightDirec = normalize(vec3(1.0,1.0,1.0));
const vec3 lightColor = vec3(1.0,1.0,1.0);
const vec3 lightSpecColor = vec3(0.5,0.5,0.5);

#ifdef VOX_NORMAL_MAP
vec3 getNormalFromMap(sampler2D texSampler, vec2 texUV, vec3 nv)
{
    vec3 tangentNormal = VOX_Texture2D(texSampler, texUV).xyz * 2.0 - 1.0;

    vec3 Q1  = dFdx(WorldPos);
    vec3 Q2  = dFdy(WorldPos);
    vec2 st1 = dFdx(texUV);
    vec2 st2 = dFdy(texUV);

    vec3 N   = normalize(nv);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);    
    vec3 B  = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return TBN * tangentNormal;
}
#endif
vec3 calcLight(vec3 viewDir, vec3 baseColor, vec3 pLightDir, vec3 lightColor, vec3 specColor) {

    float nDotL = max(dot(NV, pLightDir), 0.0);
	baseColor = nDotL * baseColor * lightColor;
	viewDir = normalize(pLightDir + viewDir);
	lightColor = specColor * nDotL * pow(max(dot(NV, viewDir), 0.0), 32.0);
	return (baseColor + lightColor);
}

void main() {

    NV = v_nv;
    WorldPos = v_worldPos;
    CameraPos = u_cameraPosition.xyz;

    vec4 color = u_color;
    #ifdef VOX_USE_2D_MAP
        color = color * VOX_Texture2D(u_sampler0, v_uv.xy);
    #endif
    #ifdef VOX_NORMAL_MAP
        NV = normalize(getNormalFromMap(VOX_NORMAL_MAP, v_uv, v_nv));
    #endif

    vec3 viewDir = normalize(CameraPos - WorldPos);
    vec3 destColor = calcLight(
        viewDir,
        color.xyz,
        lightDirec,
        lightColor,
        lightSpecColor
        );
    FragColor0 = vec4(destColor * 0.7 + 0.3 * color.xyz, 1.0);
}
`
        );

        return ShaderCodeBuffer.s_coder.buildFragCode();
    }
    getVtxShaderCode(): string {

        let coder = ShaderCodeBuffer.s_coder;
        coder.addVertMainCode(
            `
void main() {

    vec3 objPos = a_vs;
    #ifdef VOX_USE_2D_MAP
        v_uv = a_uvs.xy;
    #endif
    
    #ifdef VOX_DISPLACEMENT_MAP
        vec4 dispData = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv.xy);
        objPos += normalize( a_nvs ) * vec3( dispData.x * u_displacement.x + u_displacement.y );
    #endif
    
    vec4 wPos = u_objMat * vec4(objPos, 1.0);
    gl_Position = u_projMat * u_viewMat * wPos;

    v_worldPos = wPos.xyz;

    mat4 invViewMat = inverse(u_viewMat);

    v_nv = normalize(a_nvs * inverse(mat3(u_objMat)));
}
`
        );
        return coder.buildVertCode();
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[LambertDirecLightShaderBuffer()]";
    }

    static GetInstance(): LambertDirecLightShaderBuffer {
        return LambertDirecLightShaderBuffer.s_instance;
    }
}

export default class LambertDirecLightMaterial extends MaterialBase {

    normalMapEnabled: boolean = false;
    displacementMapEnabled: boolean = false;
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: LambertDirecLightShaderBuffer = LambertDirecLightShaderBuffer.GetInstance();
        buf.normalMapEnabled = this.normalMapEnabled;
        buf.displacementMapEnabled = this.displacementMapEnabled;
        return buf;
    }

    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_displacementArray: Float32Array = new Float32Array([50.0, 1.0, 0.0, 0.0]);
    setDisplacementParams(scale: number, bias: number): void {
        this.m_displacementArray[0] = scale;
        this.m_displacementArray[1] = bias;
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
    setAlpha(pa: number): void {
        this.m_colorArray[3] = pa;
    }
    
    createSelfUniformData(): ShaderUniformData {

        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color", "u_displacement"];
        oum.dataList = [this.m_colorArray, this.m_displacementArray];
        return oum;
    }
    //  private m_colorArray: Float32Array = new Float32Array([1.0, 0.0, 1.0, 8.0]);
    //  private m_positions: Float32Array = new Float32Array([400.0, 400.0, -400.0, 1.0]);
    //  private m_params: Float32Array = new Float32Array([0.0001, 0.000003, 1.0, 0.0]);
    //  private m_gloss: Float32Array = new Float32Array([0.8, 0.8, 0.2, 0.8]);

}