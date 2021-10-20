/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

class FloatTexRenderShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:FloatTexRenderShaderBuffer = null;
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("FloatTexRenderShaderBuffer::initialize()...");
        this.m_uniqueName = "FloatTexMaterialShd";
        this.adaptationShaderVersion = false;
    }
    
    private buildThisCode():void
    {
        let coder = this.m_coder;
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
void main() {
    vec4 color4 = VOX_Texture2DLod( u_sampler0, v_uv, 6.0 ) * u_color;
    //vec4 color4 = VOX_Texture2D( u_sampler0, v_uv) * u_color;
    FragColor0 = color4;
}
`
                                    );
                    
                    return this.m_coder.buildFragCode();
    }
    getVtxShaderCode():string
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
        return "[FloatTexRenderShaderBuffer()]";
    }

    static GetInstance():FloatTexRenderShaderBuffer
    {
        if(FloatTexRenderShaderBuffer.s_instance != null)
        {
            return FloatTexRenderShaderBuffer.s_instance;
        }
        FloatTexRenderShaderBuffer.s_instance = new FloatTexRenderShaderBuffer();
        return FloatTexRenderShaderBuffer.s_instance;
    }
}
export default class FloatTexMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    getCodeBuf():ShaderCodeBuffer
    {
        return FloatTexRenderShaderBuffer.GetInstance();
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