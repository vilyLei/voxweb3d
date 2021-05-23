/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";

class HdrClyMapShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:HdrClyMapShaderBuffer = new HdrClyMapShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("HdrClyMapShaderBuffer::initialize()...");
        this.m_uniqueName = "HdrClyMapShd";
    }
/*
fixed4 frag(v2f i) : SV_Target
{
	float3 nor = normalize(i.normal);
	float3 viewDir = normalize(_WorldSpaceCameraPos.xyz - i.wPos);
	float3 refl = (_Inverse > 0 ? 1 : -1) * reflect(viewDir,nor);
	float u = (atan2(refl.x,refl.z) / UNITY_PI + 1.0)*0.5;
	float v = acos(refl.y) / UNITY_PI;
	float2 uv = float2(u, v)*_MainTex_ST.xy + _MainTex_ST.zw;
	fixed4 col = tex2D(_MainTex,uv,float2(0,0), float2(0,0));
	return col;
}
*/
    getFragShaderCode():string
    {
        let fragCode:string = 
`#version 300 es
precision mediump float;
const float MATH_PI = 3.1415926;
uniform sampler2D u_sampler0;
in vec3 v_nv;
in vec3 v_param;
in vec3 v_wVtxPos;
in vec3 v_wViewPos;
layout(location = 0) out vec4 FragColor0;
void main()
{
	vec3 nor = normalize(v_nv);
	vec3 viewDir = -1.0 * normalize(v_wViewPos - v_wVtxPos);
	vec3 refl = reflect(viewDir,nor);
	float u = 1.0 - ((atan(refl.x,refl.z) / MATH_PI + 1.0) * 0.5);
	float v = acos(refl.y) / MATH_PI;
	vec2 uv = vec2(u, v);
    vec4 color4 = texture(u_sampler0, uv);
    FragColor0 = color4;
}
`;
        return fragCode;
    }
    getVtxShaderCode():string
    {
        let vtxCode:string =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_nv;
out vec3 v_param;
out vec3 v_wVtxPos;
out vec3 v_wViewPos;
void main(){
    vec4 viewWorldPos = inverse(u_viewMat) * vec4(0.0,0.0,0.0,1.0);
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position = u_projMat * viewPos;
    v_nv = a_nvs;
    v_param = vec3(length(normalize(wpos.xyz - viewWorldPos.xyz)));
    v_wVtxPos = wpos.xyz;
    v_wViewPos = viewWorldPos.xyz;
}
`;
        return vtxCode;
    }
    getUniqueShaderName()
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[HdrClyMapShaderBuffer()]";
    }

    static GetInstance():HdrClyMapShaderBuffer
    {
        return HdrClyMapShaderBuffer.___s_instance;
    }
}

export default class HdrClyMapMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return HdrClyMapShaderBuffer.GetInstance();
    }
}