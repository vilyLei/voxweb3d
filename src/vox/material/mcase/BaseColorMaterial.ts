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

class BaseColorShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:BaseColorShaderBuffer = new BaseColorShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("BaseColorShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "BaseColorShd";                    
    }
    private buildThisCode():void
    {
        let coder:ShaderCodeBuilder = ShaderCodeBuffer.s_coder;
        coder.reset();
        coder.addVertLayout("vec3","a_vs");
        if(this.isTexEanbled())
        {
            coder.addVertLayout("vec2","a_uvs");
            coder.addVarying("vec2","v_uv");
            coder.addTextureSample2D();
        }
        coder.addVarying("vec4", "v_colorFactor");
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4","u_color");
        coder.useVertSpaceMats(true,true,true);

    }
    getFragShaderCode():string
    {
        this.buildThisCode();

        if(this.isTexEanbled())
        {
            ShaderCodeBuffer.s_coder.addFragMainCode(
`
vec4 colorFactor = gl_FrontFacing?vec4(0.0,1.0,0.0,1.0):vec4(1.0,0.0,0.0,1.0);
FragColor0 = colorFactor * u_color * texture(u_sampler0, v_uv.xy);
`
            );
        }
        else
        {
            ShaderCodeBuffer.s_coder.addFragMainCode("\tFragColor0 = u_color");
        }                    
        
        return ShaderCodeBuffer.s_coder.buildFragCode();                    
    }
    getVtxShaderCode():string
    {
        
        let coder:ShaderCodeBuilder = ShaderCodeBuffer.s_coder;
        coder.addVertMainCode(
`
mat4 viewMat4 = u_viewMat * u_objMat;
vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
gl_Position = u_projMat * viewPos;
`
        );
        if(this.isTexEanbled())
        {
            coder.addVertMainCode("\tv_uv = a_uvs.xy;");
        }
        return coder.buildVertCode();
    }
    getUniqueShaderName()
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[BaseColorShaderBuffer()]";
    }
    static GetInstance():BaseColorShaderBuffer
    {
        return BaseColorShaderBuffer.___s_instance;
    }
}

export default class BaseColorMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return BaseColorShaderBuffer.GetInstance();
    }
    
    private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
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
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }
}