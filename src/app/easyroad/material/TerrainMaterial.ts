/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class TerrainShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: TerrainShaderBuffer = new TerrainShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("TerrainShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "TerrainShd";
        this.m_uniqueName += texEnabled ? "Tex": "";
    }
    private buildThisCode(): void {
        let coder = this.m_coder;
        coder.reset();
        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec3", "a_nvs");
        if (this.isTexEanbled()) {
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
            coder.addVarying("vec4", "v_param");
            // diffuse color
            coder.addTextureSample2D();
            coder.addTextureSample2D();
            // ao
            coder.addTextureSample2D();
            // displace
            coder.addTextureSample2D("VOX_DISPLACEMENT_MAP",true,false,true);
        }
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_color");
        coder.addVertUniform("vec4", "u_displacement");
        coder.useVertSpaceMats(true, true, true);
    }

    getFragShaderCode(): string {
        this.buildThisCode();

        ShaderCodeBuffer.s_coder.addFragMainCode(
`
void main() {
    #ifdef VOX_USE_2D_MAP
        vec2 colorUV = v_uv.xy * 16.0;
        vec4 color = VOX_Texture2D(u_sampler0, v_uv.xy * 4.0);
        vec4 color1 = VOX_Texture2D(u_sampler1, v_uv);
        vec4 ao = VOX_Texture2D(u_sampler2, v_uv);
        //float factor = min(1.55 - v_param.x, 1.0);
        //color1.xyz *= vec3(factor * factor);
        //color.xyz = mix( color.xyz, color1.xyz, v_param.x * v_param.x + 0.1);
        float f = v_param.x / 0.70;
        color.xyz = mix( color.xyz, color1.xyz, f * f);
        color.xyz *= (ao.xyz * 0.9 + vec3(0.1));
        color *= u_color;
        FragColor0 = color;
    #else
        FragColor0 = u_color;
    #endif
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
        float displacementScale = u_displacement.x;
        float displacementBias = u_displacement.y;
        v_param = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv.xy);
        objPos += normalize( a_nvs ) * vec3( v_param.x * displacementScale + displacementBias );
        //objPos += normalize( a_nvs ) * vec3( (1.0 - v_param.x) * displacementScale + displacementBias );
    #endif
    
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(objPos, 1.0);
    gl_Position = u_projMat * viewPos;
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
        return "[TerrainShaderBuffer()]";
    }
    static GetInstance(): TerrainShaderBuffer {
        return TerrainShaderBuffer.s_instance;
    }
}

export default class TerrainMaterial extends MaterialBase {
    constructor() {
        super();
        
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color", "u_displacement"];
        oum.dataList = [this.m_colorArray, this.m_displacementArray];
        this.m_shaderUniformData = oum;
    }

    getCodeBuf(): ShaderCodeBuffer {
        return TerrainShaderBuffer.GetInstance();
    }

    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_displacementArray: Float32Array = new Float32Array([50.0, 1.0, 0.0, 0.0]);
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
    setDisplacementParams(scale: number, bias: number): void {
        this.m_displacementArray[0] = scale;
        this.m_displacementArray[1] = bias;
    }
    
}