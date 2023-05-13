/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import ShaderCodeBuilder from "../../vox/material/code/ShaderCodeBuilder";

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
    private buildThisCode():void
    {

        let coder:ShaderCodeBuilder = this.m_coder;
        coder.reset();
        coder.derivatives = true;
        
        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        coder.addVertLayout("vec3","a_nvs");
        
        coder.addVarying("vec2", "v_uv");
        coder.addVarying("vec3", "v_nv");
        coder.addVarying("vec3", "v_pv");
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_param");
        
        coder.useVertSpaceMats(true,true,true);

        coder.addFragFunction(
`
vec3 getVtxFlatNormal(vec3 pos) {
    vec3 fdx = dFdx(pos);
    vec3 fdy = dFdy(pos);
    return normalize(cross(fdx, fdy));
}
`
        );
    }
    getFragShaderCode():string
    {
        
        this.buildThisCode();

        this.m_coder.addFragMainCode(
`
void main() {

    //FragColor0 = vec4(abs(v_nv.xyz), 1.0);
    //vec3 pnv = getVtxFlatNormal(v_pv);
    //float dis = length(v_nv - pnv);
    //float dis = length(v_nv - normalize(v_pv));
    //FragColor0 = vec4(abs(vec3(dis) * pnv), 1.0);
    FragColor0 = vec4(abs(v_nv), 1.0);
}
`
        );

        return this.m_coder.buildFragCode();
    }
    getVertShaderCode():string
    {
        
        this.m_coder.addVertMainCode(
`
void main(){
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;
    v_uv = a_uvs;
    v_nv = a_nvs;
    v_pv = a_vs;
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