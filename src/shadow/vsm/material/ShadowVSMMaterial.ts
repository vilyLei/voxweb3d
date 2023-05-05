/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuilder from "../../../vox/material/code/ShaderCodeBuilder";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";

class ShadowVSMShaderBuffer extends ShaderCodeBuffer {
    private static s_instance: ShadowVSMShaderBuffer = new ShadowVSMShaderBuffer();
    private m_uniqueName: string = "";
    constructor() {
        super();
    }

    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("ShadowVSMShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "ShadowVSMShd";
        this.shadowReceiveEnabled = true;
    }
    buildShader(): void {

        let coder: ShaderCodeBuilder = this.m_coder;
        coder.normalEnabled = true;
        
        coder.uniform.addShadowMap();
        coder.uniform.addDiffuseMap();

        coder.addVarying("vec3", "v_worldNormal");
        
        coder.addFragUniform("vec4", "u_color");

        coder.useVertSpaceMats(true, true, true);
        coder.vertMatrixInverseEnabled = true;

        this.m_coder.addFragMainCode(
            `
            
    vec4 color = VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv );

    worldNormal = v_worldNormal;
    color.xyz *= u_color.xyz;

    FragColor0 = vec4(color.xyz, 1.0);
    
`
        );
        this.m_coder.addVertMainCode(
            `
    oWorldPosition = u_objMat * vec4(a_vs, 1.0);
    worldPosition = oWorldPosition;
    viewPosition = u_viewMat * worldPosition;
    gl_Position =  u_projMat * viewPosition;
    v_uv = a_uvs.xy;
    v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    //worldPosition.xyz += a_nvs.xyz * 0.05;
`
        );
    }
    getFragShaderCode(): string {
        return this.m_coder.buildFragCode();
    }
    getVertShaderCode(): string {

        return this.m_coder.buildVertCode();

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ShadowVSMShaderBuffer()]";
    }
    static GetInstance(): ShadowVSMShaderBuffer {
        return ShadowVSMShaderBuffer.s_instance;
    }
}

export default class ShadowVSMMaterial extends MaterialBase {
    private m_colorData: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    shadowReceiveEnabled: boolean = false;
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf: ShadowVSMShaderBuffer = ShadowVSMShaderBuffer.GetInstance();
        buf.shadowReceiveEnabled = this.shadowReceiveEnabled;
        buf.fogEnabled = true;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return ShadowVSMShaderBuffer.GetInstance();
    }

    setRGB3f(r: number, g: number, b: number): void {
        this.m_colorData[0] = r;
        this.m_colorData[1] = g;
        this.m_colorData[2] = b;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorData];
        return oum;
    }
}