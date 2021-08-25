/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

export class DracoMeshShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:DracoMeshShaderBuffer = new DracoMeshShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("DracoMeshShaderBuffer::initialize()...");
        this.m_uniqueName = "DracoMeshShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`#version 300 es
precision highp float;
uniform vec4 u_param;
in vec2 v_uv;
in vec3 v_nv;
in vec3 v_pv;
layout(location = 0) out vec4 FragColor0;

vec3 getVtxFlatNormal(vec3 pos) {
    vec3 fdx = dFdx(pos);
    vec3 fdy = dFdy(pos);
    return normalize(cross(fdx, fdy));
}
void main()
{
    //FragColor0 = vec4(abs(v_nv.xyz), 1.0);
    vec3 pnv = getVtxFlatNormal(v_pv);
    //float dis = length(v_nv - pnv);
    float dis = length(v_nv - normalize(v_pv));
    FragColor0 = vec4(abs(vec3(dis) * pnv), 1.0);
    //FragColor0 = vec4(abs(v_nv), 1.0);
}
`;
        return fragCode;
    }
    getVtxShaderCode():string
    {
        let vtxCode:string = 
`#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uv;
out vec3 v_nv;
out vec3 v_pv;
void main(){
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;
    v_uv = a_uvs;
    v_nv = a_nvs;
    v_pv = a_vs;
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[DracoMeshShaderBuffer()]";
    }

    static GetInstance():DracoMeshShaderBuffer
    {
        return DracoMeshShaderBuffer.s_instance;
    }
}

export default class DracoMeshMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {
        return DracoMeshShaderBuffer.GetInstance();
    }
    private m_paramArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    private m_1over255:number = 1.0/255.0;
    setIndex(index:number):void
    {
        this.m_paramArray[3] = index * this.m_1over255;
    }
    getIndex():number
    {
        return this.m_paramArray[3]/this.m_1over255;
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_param"];
        oum.dataList = [this.m_paramArray];
        return oum;
    }
}