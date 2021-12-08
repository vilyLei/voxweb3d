/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import ShaderCodeBuilder from "../../vox/material/code/ShaderCodeBuilder";

class UfloatFromBytesRenderShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:UfloatFromBytesRenderShaderBuffer = null;
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("UfloatFromBytesRenderShaderBuffer::initialize()...");
        this.m_uniqueName = "UfloatFromBytesMaterialShd";
        this.adaptationShaderVersion = false;
    }
    
    private buildThisCode():void
    {
        let coder:ShaderCodeBuilder = this.m_coder;
        coder.reset();
        //coder.vertMatrixInverseEnabled = true;
        coder.mapLodEnabled = true;

        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        
        coder.addVarying("vec2", "v_uv");

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4","u_color");
        
        coder.addTextureSample2D();

        coder.useVertSpaceMats(true,true,true);

        coder.addFragFunction(
`

`
        );
    }
    getFragShaderCode():string
    {
        this.buildThisCode();
        
        this.m_coder.addFragMainCode(
`
/*
// Encoding/decoding [0..1) floats into 8 bit/channel RGBA. Note that 1.0 will not be encoded properly.
inline vec4 EncodeFloatRGBA( float v )
{
    vec4 kEncodeMul = vec4(1.0, 255.0, 65025.0, 16581375.0);
    float kEncodeBit = 1.0/255.0;
    vec4 enc = kEncodeMul * v;
    enc = fract (enc);
    enc -= enc.yzww * kEncodeBit;
    return enc;
}
inline float DecodeFloatRGBA( vec4 enc )
{
    vec4 kDecodeDot = vec4(1.0, 1/255.0, 1/65025.0, 1/16581375.0);
    return dot( enc, kDecodeDot );
}

// Encoding/decoding [0..1) floats into 8 bit/channel RG. Note that 1.0 will not be encoded properly.
inline vec2 EncodeFloatRG( float v )
{
    vec2 kEncodeMul = vec2(1.0, 255.0);
    float kEncodeBit = 1.0/255.0;
    vec2 enc = kEncodeMul * v;
    enc = fract (enc);
    enc.x -= enc.y * kEncodeBit;
    return enc;
}
inline float DecodeFloatRG( vec2 enc )
{
    vec2 kDecodeDot = vec2(1.0, 1.0/255.0);
    return dot( enc, kDecodeDot );
}
//*/

const vec4 hdrBrnDecodeVec4 = vec4(255.0, 2.55, 0.0255, 0.000255);
float rgbaToHdrBrn(in vec4 color) {
    return dot(hdrBrnDecodeVec4, color);
}
void main() {
    vec4 color4 = VOX_Texture2DLod( u_sampler0, v_uv, 3.0 ) * u_color;
    //vec4 color4 = VOX_Texture2D( u_sampler0, v_uv);
    float brn = rgbaToHdrBrn(color4);
    FragColor0 = vec4(vec3(brn), 1.0) * u_color;
}
`
                                    );
                    
                    return this.m_coder.buildFragCode();
    }
    getVertShaderCode():string
    {
        
        this.m_coder.addVertMainCode(
`
void main() {

    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);

    gl_Position = u_projMat * viewPos;
    v_uv = a_uvs.xy;
}
`
                                    );
        return this.m_coder.buildVertCode();
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[UfloatFromBytesRenderShaderBuffer()]";
    }

    static GetInstance():UfloatFromBytesRenderShaderBuffer
    {
        if(UfloatFromBytesRenderShaderBuffer.s_instance != null)
        {
            return UfloatFromBytesRenderShaderBuffer.s_instance;
        }
        UfloatFromBytesRenderShaderBuffer.s_instance = new UfloatFromBytesRenderShaderBuffer();
        return UfloatFromBytesRenderShaderBuffer.s_instance;
    }
}
export default class UfloatFromBytesMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    getCodeBuf():ShaderCodeBuffer
    {
        return UfloatFromBytesRenderShaderBuffer.GetInstance();
    }
    private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    private m_posParam:Float32Array = new Float32Array([1.0/16,0.0,0.0,0.0]);
    private m_texSize:number = 16.0;
    setTexSize(size:number):void
    {
        this.m_texSize = size;
        this.m_posParam[0] = 1.0 / size;
    }
    setPosAt(index:number):void
    {
        this.m_posParam[1] = index;
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
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }
}