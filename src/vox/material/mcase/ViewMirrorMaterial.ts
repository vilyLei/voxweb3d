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

class ViewMirrorShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:ViewMirrorShaderBuffer = new ViewMirrorShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("ViewMirrorShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "ViewMirrorShd";                    
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
        coder.addVertUniform("vec4","u_mirrorNormal");
        coder.useVertSpaceMats(true,true,true);

    }
    getFragShaderCode():string
    {
        this.buildThisCode();

        if(this.isTexEanbled())
        {
            ShaderCodeBuffer.s_coder.addFragMainCode(
`
//vec4 colorFactor = gl_FrontFacing?vec4(0.0,1.0,0.0,1.0):vec4(1.0,0.0,0.0,1.0);
vec4 colorFactor = vec4(1.0);
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

`vec4 wpos = u_objMat * vec4(a_vs, 1.0);
wpos.xyz = reflect(wpos.xyz, u_mirrorNormal.xyz);
vec3 nv = mat3(u_viewMat) * u_mirrorNormal.xyz;

vec4 viewPos = u_viewMat * wpos;
gl_Position = dot(nv, vec3(0.0,0.0,1.0)) > 0.01 ? u_projMat * viewPos : vec4(0.0,0.0,-2.0,1.0);
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
        return "[ViewMirrorShaderBuffer()]";
    }
    static GetInstance():ViewMirrorShaderBuffer
    {
        return ViewMirrorShaderBuffer.___s_instance;
    }
}

export default class ViewMirrorMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return ViewMirrorShaderBuffer.GetInstance();
    }
    
    private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    private m_mirrorArray:Float32Array = new Float32Array([0.0,1.0,0.0,1.0]);
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
    useXMirror(): void {
        this.m_mirrorArray[0] = 1.0;
        this.m_mirrorArray[1] = 0.0;
        this.m_mirrorArray[2] = 0.0;
    }
    useYMirror(): void {
        this.m_mirrorArray[0] = 0.0;
        this.m_mirrorArray[1] = 1.0;
        this.m_mirrorArray[2] = 0.0;
    }
    useZMirror(): void {
        this.m_mirrorArray[0] = 0.0;
        this.m_mirrorArray[1] = 0.0;
        this.m_mirrorArray[2] = 1.0;
    }

    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color","u_mirrorNormal"];
        oum.dataList = [this.m_colorArray, this.m_mirrorArray];
        return oum;
    }
}