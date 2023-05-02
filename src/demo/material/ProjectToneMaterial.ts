/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Matrix4 from "../../vox/math/Matrix4";
import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";

class ProjectToneShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:ProjectToneShaderBuffer = new ProjectToneShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("ProjectToneShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "ProjectToneShd";
    }
    private buildThisCode():void
    {
        let coder = ShaderCodeBuffer.s_coder;
        coder.reset();
        coder.addVertLayout("vec3","a_vs");
        if(this.isTexEanbled())
        {
            coder.addVertLayout("vec2","a_uvs");
            coder.addVertLayout("vec3","a_nvs");
            coder.addTextureSample2D();
            coder.addTextureSample2D();
            coder.addTextureSample2D();
            coder.addVarying("vec2", "v_uv");
            coder.addVarying("vec3", "v_nv");
        }
        
        coder.addVarying("vec4", "v_wpos");
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4","u_color");
        coder.addFragUniform("mat4","u_toneMat");
        coder.addFragUniform("vec4","u_projNV");
        coder.addFragFunction(
`
const vec2 noise2 = vec2(12.9898,78.233);
const vec3 noise3 = vec3(12.9898,78.233,158.5453);
vec2 rand(vec2 seed) {

    float noiseX = (fract(sin(dot(seed, noise2)) * 43758.5453));
    float noiseY = (fract(sin(dot(seed, noise2 * 2.0)) * 43758.5453));
    return vec2(noiseX,noiseY);
}
vec3 rand(vec3 seed) {
    float scale = 1.0;
    float scale2 = 43758.54;
    float noiseX = (fract(sin(scale * dot(seed, noise3)) * scale2));
    float noiseY = (fract(sin(scale * dot(seed, noise3 * 2.0)) * scale2));
    float noiseZ = (fract(sin(scale * dot(seed, noise3 * 3.0)) * scale2));
    return vec3(noiseX, noiseY, noiseZ);
}
vec3 getNormalFromMap(sampler2D texSampler, vec2 texUV, vec3 wpos, vec3 nv)
{
    vec3 tangentNormal = texture(texSampler, texUV).xyz * 2.0 - 1.0;

    vec3 Q1  = dFdx(wpos);
    vec3 Q2  = dFdy(wpos);
    vec2 st1 = dFdx(texUV);
    vec2 st2 = dFdy(texUV);

    vec3 N   = normalize(nv);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B  = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return normalize(TBN * tangentNormal);
}
`);
        coder.useVertSpaceMats(true,true,true);

    }
    getFragShaderCode():string
    {
        this.buildThisCode();

        ShaderCodeBuffer.s_coder.addFragMainCode(
`
void main() {

    #ifdef VOX_USE_2D_MAP
        vec3 nv = getNormalFromMap(u_sampler2, v_uv.xy, v_wpos.xyz, v_nv.xyz);

        //vec4 pv = u_toneMat * v_wpos;
        vec4 wpos = v_wpos;
        wpos.xyz += nv  * vec3(60.0);// use nomal map
        vec4 pv = u_toneMat * wpos;
        pv.xyz /= pv.www;
        //pv.xy += rand(pv.xy) * 0.01;// noise
        //pv.xy *= vec2(0.2);// 扩大
        pv.xy *= vec2(0.5);
        pv.xy += vec2(0.5);
        //  float factorX = (pv.x < 0.0 || pv.x > 1.0) ? 0.0 : 1.0;
        //  float factorY = (pv.y < 0.0 || pv.y > 1.0) ? 0.0 : 1.0;
        //  factorX *= factorY;
        float factorY = max(dot(nv.xyz, u_projNV.xyz), 0.01);

        vec4 baseColor4 = texture(u_sampler1, v_uv.xy) * u_color;
        vec4 reflectColor4 = texture(u_sampler0, pv.xy);
        //baseColor4.xyz = mix(reflectColor4.xyz, baseColor4.xyz, factorY) * 0.5 + reflectColor4.xyz * 0.2 + baseColor4.xyz * 0.3;
        baseColor4.xyz = mix(reflectColor4.xyz, baseColor4.xyz, factorY) * 0.6 + reflectColor4.xyz * 0.2 + baseColor4.xyz * 0.2;
        FragColor0 = baseColor4;
    #else
        FragColor0 = u_color;
    #endif
}
`
        );
        
        return ShaderCodeBuffer.s_coder.buildFragCode();                    
    }
    getVertShaderCode():string
    {
        
        let coder = ShaderCodeBuffer.s_coder;
        coder.addVertMainCode(

`
void main() {
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position =  u_projMat * viewPos;

    v_nv = a_nvs;
    v_wpos = wpos;

    #ifdef VOX_USE_2D_MAP
        v_uv = a_uvs;
    #endif
}
`

        );
        return coder.buildVertCode();
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[ProjectToneShaderBuffer()]";
    }
    static GetInstance():ProjectToneShaderBuffer
    {
        return ProjectToneShaderBuffer.s_instance;
    }
}

export default class ProjectToneMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return ProjectToneShaderBuffer.GetInstance();
    }
    
    private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    private m_projNV:Float32Array = new Float32Array([0.0,1.0,0.0,1.0]);
    private m_toneMatrix: Matrix4 = null;
    setProjNV(nv: Vector3D):void
    {
        //console.log("nv: ",nv);
        this.m_projNV[0] = nv.x;
        this.m_projNV[1] = nv.y;
        this.m_projNV[2] = nv.z;
    }

    setRGB3f(pr:number,pg:number,pb:number):void
    {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    setAlpha(pa:number):void
    {
        this.m_colorArray[3] = pa;
    }
    setToneMatrix(mat4: Matrix4): void {
        this.m_toneMatrix = mat4;
    }

    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color","u_toneMat","u_projNV"];
        oum.dataList = [this.m_colorArray, this.m_toneMatrix.getLocalFS32(), this.m_projNV];
        return oum;
    }
}