/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";

class PSColorShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:PSColorShaderBuffer = new PSColorShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("PSColorShaderBuffer::initialize()...");
        this.m_uniqueName = "PSColorShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`#version 300 es
precision mediump float;
layout(location = 0) out vec4 FragColor0;
void main()
{
FragColor0 = vec4(vec3(1.0,0.5,0.6),1.0);
}
`;
        return fragCode;
    }
    getVertShaderCode():string
    {
        let vtxCode:string =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
void main(){
mat4 viewMat4 = u_viewMat * u_objMat;
vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
gl_Position = u_projMat * viewPos;
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
        return "[PSColorShaderBuffer()]";
    }

    static GetInstance():PSColorShaderBuffer
    {
        return PSColorShaderBuffer.s_instance;
    }
}

export default class PSColorMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return PSColorShaderBuffer.GetInstance();
    }
}