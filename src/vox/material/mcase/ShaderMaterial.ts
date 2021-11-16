/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class RawCodeShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private m_uniqueName:string = "";
    private m_fragCode:string = "";
    private m_vtxCode:string = "";
    initialize(texEnabled:boolean):void
    {
    }
    setUniqueName(uniqueName:string):void
    {
        this.m_uniqueName = uniqueName;
    }
    setFragShaderCode(codeStr:string):void
    {
        this.m_fragCode = codeStr;
    }
    getFragShaderCode():string
    {
        return this.m_fragCode;
    }
    setVtxShaderCode(codeStr:string):void
    {
        this.m_vtxCode = codeStr;
    }
    getVertShaderCode():string
    {
        return this.m_vtxCode;
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[RawCodeShaderBuffer()]";
    }
}

export default class ShaderMaterial extends MaterialBase
{
    private m_buffer:RawCodeShaderBuffer = new RawCodeShaderBuffer();
    private m_uniformData:ShaderUniformData = null;
    constructor(shd_uniqueName:string)
    {
        super();
        this.m_buffer.setUniqueName(shd_uniqueName);
    }
    setFragShaderCode(codeStr:string):void
    {
        this.m_buffer.setFragShaderCode(codeStr);
    }
    setVtxShaderCode(codeStr:string):void
    {
        this.m_buffer.setVtxShaderCode(codeStr);
    }
    /**
     * @param           uniform_name        the name of a uniform in the shader.
     * @param           data                Float32Array type data stream,for example: vec4(Float32Array(4)),mat4(Float32Array(16))
    */
    addUniformDataAt(uniform_name:string,data:Float32Array):void
    {
        if(data != null)
        {
            if(this.m_uniformData == null)
            {
                this.m_uniformData = new ShaderUniformData();
                this.m_uniformData.uniformNameList = [];
                this.m_uniformData.dataList = [];
            }
            this.m_uniformData.uniformNameList.push(uniform_name);
            this.m_uniformData.dataList.push(data);
        }
    }
    getCodeBuf():ShaderCodeBuffer
    {
        return this.m_buffer;
    }
    createSelfUniformData():ShaderUniformData
    {
        return this.m_uniformData;
    }
}