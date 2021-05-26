/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class FloatCubeMapShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: FloatCubeMapShaderBuffer = null;
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("FloatCubeMapShaderBuffer::initialize()...");
        this.m_uniqueName = "FloatCubeMapShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
`#version 300 es
precision mediump float;

uniform vec4 u_color;
uniform vec4 u_param;

// handy value clamping to 0 - 1 range
#define saturate(a) clamp( a, 0.0, 1.0 )

vec3 ReinhardToneMapping( vec3 color ){
    float toneMappingExposure = u_param.x;
	color *= toneMappingExposure;
	return saturate( color /( vec3( 1.0 ) + color ) );
    
    //  float max_white = 0.2;
    //  vec3 numerator = color * (vec3(1.0f) + (color / vec3(max_white * max_white)));
    //  return numerator / (vec3(1.0f) + color);
}
vec3 toneMapping( vec3 color ){ return ReinhardToneMapping( color ); }

vec4 LinearTosRGB( in vec4 value ){
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}

uniform samplerCube u_sampler0;
in vec3 v_nvs;
layout(location = 0) out vec4 FragColor;
void main()
{
    vec3 color3 = texture(u_sampler0, v_nvs).xyz;
    
    color3 = toneMapping( color3 );
    vec4 color4 = vec4(color3, 1.0);
    color4 = LinearTosRGB( color4 );
    color4.xyz *= u_color.xyz;
    FragColor = color4;// + 0.001 * vec4(abs(v_nvs),1.0);
}
`;
        return fragCode;
    }
    getVtxShaderCode(): string {
        let vtxCode: string =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_nvs;
void main()
{
    vec4 wpos = u_objMat * vec4(a_vs,1.0);
    gl_Position = u_projMat * u_viewMat * wpos;
    v_nvs = a_nvs;
}
`;
        return vtxCode;
    }
    getUniqueShaderName() {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[FloatCubeMapShaderBuffer()]";
    }

    static GetInstance(): FloatCubeMapShaderBuffer {
        if (FloatCubeMapShaderBuffer.___s_instance != null) {
            return FloatCubeMapShaderBuffer.___s_instance;
        }
        FloatCubeMapShaderBuffer.___s_instance = new FloatCubeMapShaderBuffer();
        return FloatCubeMapShaderBuffer.___s_instance;
    }
}

export default class FloatCubeMapMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return FloatCubeMapShaderBuffer.GetInstance();
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_param: Float32Array = new Float32Array([1.0, 0.0, 0.0, 0.0]);
    setExposure(exposure: number): void {
        this.m_param[0] = exposure;
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
        oum.uniformNameList = ["u_color", "u_param"];
        oum.dataList = [this.m_colorArray, this.m_param];
        return oum;
    }
}