/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuilder2 from "../../../vox/material/code/ShaderCodeBuilder2";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import ShaderCodeBuilder from "../../../vox/material/code/ShaderCodeBuilder";
import Vector3D from "../../../vox/math/Vector3D";
import RendererDeviece from "../../../vox/render/RendererDeviece";

class DepthShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:DepthShaderBuffer = new DepthShaderBuffer();
    private m_codeBuilder:ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("DepthShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "DepthShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode():void
    {

        let coder:ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();
        if(RendererDeviece.IsWebGL1()) {
            coder.addFragExtend("#extension GL_OES_standard_derivatives : enable");
            //coder.addFragExtend("#extension GL_EXT_shader_texture_lod : enable");
        }
        coder.addVertLayout("vec3","a_vs");
        //  if(this.isTexEanbled())
        //  {
        //      coder.addVertLayout("vec2","a_uvs");
        //      coder.addVertLayout("vec3","a_nvs");
        //  }
        coder.addVarying("vec4", "v_pos");
        coder.addFragOutput("vec4", "FragColor0");
        //coder.addFragUniform("vec4","u_color");
        //coder.addFragUniform("vec4","u_stageParam");

        coder.useVertSpaceMats(true,true,true);
        coder.addFragFunction(
`

const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

const float ShiftRight8 = 1. / 256.;

vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8; // tidy overflow
	return r * PackUpscale;
}
`
        );
    }
    getFragShaderCode():string
    {
        this.buildThisCode();

        this.m_codeBuilder.addFragMainCode(
`
void main() {
    // Higher precision equivalent of gl_FragCoord.z. This assumes depthRange has been left to its default values.
    float fragCoordZ = 0.5 * v_pos[2] / v_pos[3] + 0.5;
    FragColor0 = packDepthToRGBA( fragCoordZ );
}
`
                        );
        
        return this.m_codeBuilder.buildFragCode();                    
    }
    getVtxShaderCode():string
    {
        this.m_codeBuilder.addVertMainCode(
`
void main() {
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position =  u_projMat * viewPos;
    v_pos = gl_Position;
}
`
                        );
        return this.m_codeBuilder.buildVertCode();

    }
    getUniqueShaderName()
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[DepthShaderBuffer()]";
    }
    static GetInstance():DepthShaderBuffer
    {
        return DepthShaderBuffer.___s_instance;
    }
}

export default class DepthMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return DepthShaderBuffer.GetInstance();
    }

    createSelfUniformData():ShaderUniformData
    {
        return null;
    }
}