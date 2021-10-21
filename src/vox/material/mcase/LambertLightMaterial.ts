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

import { MaterialPipeType } from "../pipeline/MaterialPipeType";
import IAbstractShader from "../../../vox/material/IAbstractShader";
import Color4 from "../Color4";
import TextureProxy from "../../texture/TextureProxy";
class LambertLightShdCode implements IAbstractShader {
    uuid: string = "lambertLightShdCode";
    vert: string = "";
    vert_head: string =
`
void displaceLocalVtx(in vec2 param) {
    
    #ifdef VOX_DISPLACEMENT_MAP
        float dispFactor = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv.xy).x;
        localPosition.xyz += normalize( a_nvs ) * vec3( dispFactor * param.x + param.y );
    #endif
}
`;
    vert_body: string =
`
    localPosition.xyz = a_vs;

    #ifdef VOX_USE_2D_MAP
        v_uv = a_uvs.xy;
    #endif

    #ifdef VOX_DISPLACEMENT_MAP
        displaceLocalVtx( u_localParams[2].xy );
    #endif

    worldPosition = u_objMat * localPosition;
    viewPosition = u_viewMat * worldPosition;
    gl_Position = u_projMat * viewPosition;
    v_worldPosition = worldPosition.xyz;

    v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
`;
    frag: string = "";
    frag_head: string =
`

#ifdef VOX_NORMAL_MAP
vec3 getNormalFromMap(sampler2D texSampler, vec2 texUV, vec3 nv)
{
    vec3 tangentNormal = VOX_Texture2D(texSampler, texUV).xyz * 2.0 - 1.0;

    vec3 Q1  = dFdx(worldPosition.xyz);
    vec3 Q2  = dFdy(worldPosition.xyz);
    vec2 st1 = dFdx(texUV);
    vec2 st2 = dFdy(texUV);

    vec3 N   = normalize(nv);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B  = normalize(cross(T, N));

    mat3 TBN = mat3(T, B, N);

    return TBN * tangentNormal;
}
#endif
#ifdef VOX_LIGHTS_TOTAL
#if VOX_LIGHTS_TOTAL > 0

struct LambertLight {
	vec3 normal;
    // diffuse color
	vec3 diffuse;
    // specular color
	vec3 specular;
    // view direction
    vec3 viewDirec;
    // light direction
    vec3 direc;
    // light color
    vec3 color;
    // light distance attenuation factor
    vec4 param;
    float specularPower;
};

vec3 calcLambertLight(in LambertLight light) {

    float nDotL = max(dot(light.normal, light.direc), 0.0);
	vec3 baseColor = nDotL * light.diffuse * light.color;
	vec3 viewDir = normalize(light.direc + light.viewDirec);
	vec3 lightColor = light.specular * nDotL * pow(max(dot(light.normal, light.viewDirec), 0.0), light.specularPower);
    vec2 param = light.param.xy;
	return (baseColor * param.x + param.y * lightColor);
}

#endif
vec3 getLambertLightColor(in LambertLight light) {
    #if VOX_LIGHTS_TOTAL > 0
        vec3 destColor = vec3(0.0);
        // point light process
        #if VOX_POINT_LIGHTS_TOTAL > 0
            vec2 param = light.param.zw;
            for(int i = 0; i < VOX_POINT_LIGHTS_TOTAL; ++i)
            {
                // calculate per-light radiance
                light.direc = normalize(u_lightPositions[i].xyz - worldPosition.xyz);
                float distance = length(light.direc);
                float attenuation = 1.0 / (1.0 + param.x * distance + param.y * distance * distance);
                light.color = u_lightColors[i].xyz * attenuation;
                destColor += calcLambertLight( light );
            }
        #endif
        // parallel light process
        #if VOX_DIRECTION_LIGHTS_TOTAL > 0
            for(int i = VOX_POINT_LIGHTS_TOTAL; i < VOX_LIGHTS_TOTAL; ++i) 
            {
                light.direc = normalize(u_lightPositions[i].xyz);
                light.color = u_lightColors[i].xyz;
                destColor += calcLambertLight( light );
            }
        #endif
        return destColor;
    #else
        return srcColor.xyz;
    #endif
}
#endif
`;
    frag_body: string =
`
    worldNormal.xyz = v_worldNormal;
    worldPosition.xyz = v_worldPosition;

    vec4 color = u_localParams[0];
    #ifdef VOX_DIFFUSE_MAP
        color = color * VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
    #endif
    color.xyz += u_localParams[1].xyz;
    #ifdef VOX_NORMAL_MAP
        worldNormal.xyz = (getNormalFromMap(VOX_NORMAL_MAP, v_uv, worldNormal.xyz));
    #endif
    
    #ifdef LIGHT_LOCAL_PARAMS_INDEX

        vec3 viewDir = normalize(u_cameraPosition.xyz - worldPosition.xyz);        
        int lightParamIndex = LIGHT_LOCAL_PARAMS_INDEX;
        vec4 param = u_localParams[ LIGHT_LOCAL_PARAMS_INDEX ];
        
        LambertLight light;
        light.normal = worldNormal.xyz;
        light.viewDirec = viewDir;
        light.diffuse = color.xyz;
        light.specular = param.xyz;
        light.specularPower = param.w;
        light.param = u_localParams[ LIGHT_LOCAL_PARAMS_INDEX + 1 ];

        #ifdef VOX_SPECULAR_MAP
            light.specularPower *= VOX_Texture2D(VOX_SPECULAR_MAP, v_uv.xy).z;
            light.specularPower += 8.0;
        #endif
        vec3 destColor = getLambertLightColor(light);
        param = u_localParams[ LIGHT_LOCAL_PARAMS_INDEX + 2 ];
        color.xyz = color.xyz * param.x + param.y * destColor;
    #endif
    
    #ifdef VOX_AO_MAP
        color.xyz *= VOX_Texture2D(VOX_AO_MAP, v_uv.xy).yyy;
    #endif

    FragColor0 = color;
`;
}
class LambertLightShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }

    private static s_instance: LambertLightShaderBuffer = new LambertLightShaderBuffer();
    private static s_shaderCode: LambertLightShdCode = null;
    private m_uniqueName: string = "";
    private m_pipeTypes: MaterialPipeType[] = null;
    private m_keysString: string = "";

    colorEnabled: boolean = true;
    diffuseMapEnabled: boolean = false;
    normalMapEnabled: boolean = false;
    displacementMapEnabled: boolean = false;
    aoMapEnabled: boolean = false;    
    specularMapEnabled: boolean = false;

    shadowReceiveEnabled: boolean = true;
    lightEnabled: boolean = true;
    fogEnabled: boolean = true;

    localParamsTotal: number = 2;
    texturesTotal: number = 0;

    initialize(texEnabled: boolean): void {
        console.log("LambertLightShaderBuffer::initialize()...this.lightEnabled: ",this.lightEnabled);
        texEnabled = this.texturesTotal > 0;
        super.initialize(texEnabled);
        this.m_uniqueName = "LambertShd";
        if(texEnabled) this.m_uniqueName += "Tex";
        if(this.normalMapEnabled) this.m_uniqueName += "Nor";
        if(this.displacementMapEnabled) this.m_uniqueName += "Disp";
        if(this.aoMapEnabled) this.m_uniqueName += "AO";
        if(this.specularMapEnabled) this.m_uniqueName += "Spec";
        if(this.fogEnabled) this.m_uniqueName += "Fog";
        if(this.shadowReceiveEnabled) this.m_uniqueName += "Shadow";
        this.m_uniqueName += "" + this.localParamsTotal;
        if(this.pipeline != null) {

            this.m_pipeTypes = [];
            if (this.lightEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.GLOBAL_LIGHT );
            }
            if (this.shadowReceiveEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.VSM_SHADOW );
            }
            if (this.fogEnabled) {
                this.m_pipeTypes.push( MaterialPipeType.FOG_EXP2 );
            }
            
            this.pipeline.buildSharedUniforms(this.m_pipeTypes);
            this.pipeline.createKeys(this.m_pipeTypes);
            this.m_keysString = this.pipeline.getKeysString();
        }
    }

    private buildThisCode(): void {

        let coder = this.m_coder;
        coder.normalEanbled = true;
        coder.normalMapEanbled = true;
        coder.vertMatrixInverseEnabled = true;
        
        if (this.isTexEanbled()) {
            if(this.diffuseMapEnabled) {
                coder.addTextureSample2D("VOX_DIFFUSE_MAP");
            }
            if(this.normalMapEnabled && this.lightEnabled) {
                coder.addTextureSample2D("VOX_NORMAL_MAP");
            }
            if(this.displacementMapEnabled) {
                coder.addVertUniform("vec4", "u_displacement");
                coder.addTextureSample2D("VOX_DISPLACEMENT_MAP",true,false,true);
            }
            if(this.aoMapEnabled) {
                coder.addTextureSample2D("VOX_AO_MAP");
            }
            if(this.specularMapEnabled && this.lightEnabled) {
                coder.addTextureSample2D("VOX_SPECULAR_MAP");
            }
            if(this.shadowReceiveEnabled) {
                coder.addTextureSample2D("VOX_VSM_SHADOW_MAP");
            }
        }
        
        if(this.displacementMapEnabled) {
            coder.addVertAndFragUniform("vec4", "u_localParams", this.localParamsTotal);
        }
        else {
            coder.addFragUniform("vec4", "u_localParams", this.localParamsTotal);
        }
        if (this.lightEnabled) {
            let lightParamIndex: number = 2;
            if(this.displacementMapEnabled) {
                lightParamIndex = 3;
            }
            coder.addDefine("LIGHT_LOCAL_PARAMS_INDEX",""+lightParamIndex);
        }

        if(LambertLightShaderBuffer.s_shaderCode == null) {
            LambertLightShaderBuffer.s_shaderCode = new LambertLightShdCode();
        }
        
        if(this.pipeline != null) {
            this.pipeline.addShaderCode(LambertLightShaderBuffer.s_shaderCode);
            this.pipeline.build(coder, this.m_pipeTypes);
        }
    }

    getFragShaderCode(): string {
        this.buildThisCode();
        return this.m_coder.buildFragCode();
    }
    getVtxShaderCode(): string {
        return this.m_coder.buildVertCode();
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName + this.m_keysString;
    }
    toString(): string {
        return "[LambertLightShaderBuffer()]";
    }

    static GetInstance(): LambertLightShaderBuffer {
        return LambertLightShaderBuffer.s_instance;
    }
}

export default class LambertLightMaterial extends MaterialBase {

    private m_displacementArray: Float32Array = null;
    private m_lightParamsArray: Float32Array = null;
    private m_localParamsTotal: number = 1;

    colorEnabled: boolean = true;

    diffuseMap: TextureProxy = null;
    normalMap: TextureProxy = null;
    displacementMap: TextureProxy = null;
    aoMap: TextureProxy = null;
    specularMap: TextureProxy = null;
    shadowMap: TextureProxy = null;

    lightEnabled: boolean = true;
    fogEnabled: boolean = false;

    constructor() {
        super();
    }

    initializeLocalData(): void {

        if(this.m_localParam == null) {

            this.m_localParamsTotal = 2;
            if(this.displacementMap != null) {
                this.m_localParamsTotal += 1;
            }
            if(this.lightEnabled) {
                this.m_localParamsTotal += 3;
            }
            this.m_localParam = new Float32Array(this.m_localParamsTotal * 4);
            this.m_localParam.set([1.0,1.0,1.0,1.0, 0.0,0.0,0.0,0.0]);
            let lightParamsIndex: number = 2;
            if(this.displacementMap != null) {
                this.m_displacementArray = this.m_localParam.subarray(8,12);
                this.m_displacementArray.set([10.0, 0.0, 0.0, 0.0]);
                lightParamsIndex += 1;
            }
            if(this.lightEnabled) {
                this.m_lightParamsArray = this.m_localParam.subarray(lightParamsIndex * 4);
                this.m_lightParamsArray.set(
                    [
                        0.5, 0.5, 0.5, 32.0,    // specular color rgb, pow value
                        0.7,0.3,                // light color value factor, specular value factor
                        0.001, 0.0001,          // attenuation factor 1, attenuation factor 2
                        0.3,0.7,                // base color value factor, light value factor
                        0.0, 0.0                // undefined, undefined
                    ]);
            }
        }
    }
    protected buildBuf(): void {
        if(this.m_localParam == null) {
            this.initializeLocalData();
        }
        let buf: LambertLightShaderBuffer = LambertLightShaderBuffer.GetInstance();

        buf.colorEnabled = this.colorEnabled;
        buf.diffuseMapEnabled = this.diffuseMap != null;
        buf.normalMapEnabled = this.normalMap != null;
        buf.displacementMapEnabled = this.displacementMap != null;
        buf.aoMapEnabled = this.aoMap != null;
        buf.specularMapEnabled = this.specularMap != null;
        buf.shadowReceiveEnabled = this.shadowMap != null;

        buf.lightEnabled = this.lightEnabled;
        buf.fogEnabled = this.fogEnabled;

        buf.localParamsTotal = this.m_localParamsTotal;

        let texList: TextureProxy[] = [];
        if(this.diffuseMap != null) texList.push(this.diffuseMap);
        if(this.normalMap != null && this.lightEnabled) texList.push(this.normalMap);
        if(this.displacementMap != null) texList.push(this.displacementMap);
        if(this.aoMap != null) texList.push(this.aoMap);
        if(this.specularMap != null && this.lightEnabled) texList.push(this.specularMap);
        if(this.shadowMap != null) texList.push(this.shadowMap);
        super.setTextureList(texList);
        buf.texturesTotal = texList.length;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return LambertLightShaderBuffer.GetInstance();
    }

    private m_localParam: Float32Array = null;
    setSpecularColor(color: Color4): void {
        if(this.m_lightParamsArray != null) {
            this.m_lightParamsArray[0] = color.r;
            this.m_lightParamsArray[1] = color.g;
            this.m_lightParamsArray[2] = color.b;
        }
    }
    setSpecularIntensity(Intensity: number): void {
        if(this.m_lightParamsArray != null) {
            this.m_lightParamsArray[3] = Intensity;
        }
    }
    /**
     * 光照之前的颜色和光照之后颜色混合因子设置
     * @param lightFactor 光照之前的颜色混合因子, default value is 0.7
     * @param specularFactor 光照之后颜色混合因子, default value is 0.3
     */
    setLightBlendFactor(baseColorFactor: number, lightFactor: number): void {
        if(this.m_lightParamsArray != null) {
            this.m_lightParamsArray[4] = baseColorFactor;
            this.m_lightParamsArray[5] = lightFactor;
        }
    }
    /**
     * ads 光照模型中顶点与点光源之间距离的二次方和三次方因子
     * @param factor2 顶点与点光源之间距离的二次方因子, default value is 0.001
     * @param factor3 顶点与点光源之间距离的三次方因子, default value is 0.0001
     */
    setLightIntensityFactors(factor2: number, factor3: number): void {
        if(this.m_lightParamsArray != null) {
            this.m_lightParamsArray[6] = factor2;
            this.m_lightParamsArray[7] = factor3;
        }
    }
    /**
     * 光照之前的颜色和光照之后颜色混合因子设置
     * @param baseColorFactor 光照之前的颜色混合因子, default value is 0.3
     * @param lightFactor 光照之后颜色混合因子, default value is 0.7
     */
    setBlendFactor(baseColorFactor: number, lightFactor: number): void {
        if(this.m_lightParamsArray != null) {
            this.m_lightParamsArray[8] = baseColorFactor;
            this.m_lightParamsArray[9] = lightFactor;
        }
    }
    /**
     * 设置顶点置换贴图参数
     * @param scale 缩放值
     * @param bias 偏移量
     */
    setDisplacementParams(scale: number, bias: number): void {
        if(this.m_displacementArray != null) {
            this.m_displacementArray[0] = scale;
            this.m_displacementArray[1] = bias;
        }
    }
    setColor(factor: Color4, bias: Color4 = null): void {
        if(factor != null) {
            this.m_localParam[0] = factor.r;
            this.m_localParam[1] = factor.g;
            this.m_localParam[2] = factor.b;
            this.m_localParam[3] = factor.a;
        }
        if(bias != null) {
            this.m_localParam[4] = bias.r;
            this.m_localParam[5] = bias.g;
            this.m_localParam[6] = bias.b;
            this.m_localParam[7] = bias.a;
        }
    }
    setColorAlpha(a: number): void {
        this.m_localParam[3] = a;
    }
    
    createSelfUniformData(): ShaderUniformData {

        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_localParams"];
        oum.dataList = [this.m_localParam];
        return oum;
    }
    destroy(): void {
        super.destroy();
        this.m_localParam = null;
    }

}