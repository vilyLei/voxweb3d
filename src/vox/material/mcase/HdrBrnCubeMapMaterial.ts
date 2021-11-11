/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import ShaderCodeBuilder from "../../../vox/material/code/ShaderCodeBuilder";

class HdrBrnCubeMapMapShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: HdrBrnCubeMapMapShaderBuffer = null;
    private m_codeBuilder:ShaderCodeBuilder = new ShaderCodeBuilder();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("HdrBrnCubeMapMapShaderBuffer::initialize()...");
        this.m_uniqueName = "HdrBrnCubeMapMapShd";
        this.adaptationShaderVersion = false;
    }
    
    private buildThisCode():void
    {
        let coder:ShaderCodeBuilder = this.m_codeBuilder;
        coder.reset();
        coder.vertMatrixInverseEnabled = true;
        coder.mapLodEnabled = true;

        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        coder.addVertLayout("vec3","a_nvs");
        
        coder.addVarying("vec3", "v_nvs");
        coder.addVarying("vec3", "v_worldPos");
        coder.addVarying("vec3", "v_camPos");

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4","u_color");
        coder.addFragUniform("vec4","u_param");
        coder.addFragUniform("vec4","u_camPos");
        coder.addFragUniform("mat4","u_viewMat");
        
        coder.addTextureSampleCube();

        coder.useVertSpaceMats(true,true,true);

        coder.addFragFunction(
`

`
        );
    }
    getFragShaderCode(): string {
        this.buildThisCode();
        
        this.m_codeBuilder.addFragMainCode(
`

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

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 rotate(vec3 dir, float radian)
{
	vec3 result;
	result.x = cos(radian) * dir.x - sin(radian) * dir.z;
	result.y = dir.y;
	result.z = sin(radian) * dir.x + cos(radian) * dir.z;
	return result;
}
vec3 getEnvDir(float rotateAngle, vec3 normal)
{
	vec3 worldNormal = inverseTransformDirection( normal, u_viewMat );
	vec3 worldInvE = normalize(v_worldPos.xyz - v_camPos.xyz);
	vec3 worldR = reflect(worldInvE, normalize(worldNormal));
	worldR.z = -worldR.z;
	worldR.y = -worldR.y;
	worldR = rotate(worldR, rotateAngle);
	float preX = worldR.x;
	float preZ = worldR.z;
	return worldR;
}
const vec4 hdrBrnDecodeVec4 = vec4(255.0, 2.55, 0.0255, 0.000255);
float rgbaToHdrBrn(in vec4 color) {
    return dot(hdrBrnDecodeVec4, color);
}
void main()
{
    //vec3 envDir = -getEnvDir(0.0/*envLightRotateAngle*/, v_nvs); // env map upside down
	//envDir.x = -envDir.x;
    vec3 envDir = v_nvs; // env map upside down
    vec4 color4 = VOX_TextureCubeLod(u_sampler0, v_nvs, u_param.w);
    color4.xyz = vec3( rgbaToHdrBrn(color4) );
    
    color4.xyz = toneMapping( color4.xyz );
    color4 = vec4(color4.xyz, 1.0);
    color4 = LinearTosRGB( color4 );
    color4.xyz *= u_color.xyz;
    FragColor0 = color4;
}
`
        );
        return this.m_codeBuilder.buildFragCode();
    }
    getVtxShaderCode(): string {

        
        this.m_codeBuilder.addVertMainCode(
`
void main()
{
    vec4 wpos = u_objMat * vec4(a_vs,1.0);
    gl_Position = u_projMat * u_viewMat * vec4(a_vs,1.0);
    v_camPos = (inverse(u_viewMat) * vec4(0.0,0.0,0.0,1.0)).xyz;
    v_nvs = a_nvs;
    v_worldPos = wpos.xyz;
}
`
        );
        return this.m_codeBuilder.buildVertCode();
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[HdrBrnCubeMapMapShaderBuffer()]";
    }

    static GetInstance(): HdrBrnCubeMapMapShaderBuffer {
        if (HdrBrnCubeMapMapShaderBuffer.s_instance != null) {
            return HdrBrnCubeMapMapShaderBuffer.s_instance;
        }
        HdrBrnCubeMapMapShaderBuffer.s_instance = new HdrBrnCubeMapMapShaderBuffer();
        return HdrBrnCubeMapMapShaderBuffer.s_instance;
    }
}

export default class HdrBrnCubeMapMapMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return HdrBrnCubeMapMapShaderBuffer.GetInstance();
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_param: Float32Array = new Float32Array([1.0, 0.0, 0.0, 3.0]);
    private m_camPos: Float32Array = new Float32Array([1.0, 0.0, 0.0, 0.0]);
    setExposure(exposure: number): void {
        this.m_param[0] = exposure;
    }
    setMipmapLevel(lv: number): void {
        this.m_param[3] = lv;
    }
    setcamPos(px: number, py: number, pz: number): void {
        this.m_camPos[0] = px;
        this.m_camPos[1] = py;
        this.m_camPos[2] = pz;
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
        oum.uniformNameList = ["u_color", "u_param", "u_camPos"];
        oum.dataList = [this.m_colorArray, this.m_param, this.m_camPos];
        return oum;
    }
}