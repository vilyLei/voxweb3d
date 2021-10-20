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
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";

class ShadowVSMShaderBuffer extends ShaderCodeBuffer {
    private static s_instance: ShadowVSMShaderBuffer = new ShadowVSMShaderBuffer();
    private m_uniqueName: string = "";
    private m_pipeTypes: MaterialPipeType[] = null;
    private m_keysString: string = "";
    constructor() {
        super();
    }

    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("ShadowVSMShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "ShadowVSMShd";
        this.adaptationShaderVersion = false;
        if(this.pipeline != null) {
            this.m_pipeTypes = [MaterialPipeType.VSM_SHADOW, MaterialPipeType.FOG_EXP2];
            this.pipeline.createKeys(this.m_pipeTypes);
            this.m_keysString = this.pipeline.getKeysString();
            this.pipeline.buildSharedUniforms(this.m_pipeTypes);
        }
    }
    private buildThisCode(): void {

        let coder: ShaderCodeBuilder2 = this.m_coder;
        coder.normalEanbled = true;
        
        coder.addTextureSample2D("VOX_VSM_MAP");
        coder.addTextureSample2D();

        coder.addVarying("vec3", "v_worldNormal");
        
        coder.addFragUniform("vec4", "u_color");

        coder.useVertSpaceMats(true, true, true);
        coder.vertMatrixInverseEnabled = true;

        this.m_coder.addFragMainCode(
            `
            
    vec4 color = VOX_Texture2D( u_sampler1, v_uv );

    worldNormal = v_worldNormal;
    color.xyz *= u_color.xyz;

    FragColor0 = vec4(color.xyz, 1.0);
    
`
        );
        this.m_coder.addVertMainCode(
            `            
    worldPosition = u_objMat * vec4(a_vs, 1.0);
    viewPosition = u_viewMat * worldPosition;
    gl_Position =  u_projMat * viewPosition;
    v_uv = a_uvs.xy;
    v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    //worldPosition.xyz += a_nvs.xyz * 0.05;
`
        );
        
        if(this.pipeline != null) {
            this.pipeline.build(this.m_coder, this.m_pipeTypes);
        }
    }
    getFragShaderCode(): string {
        this.buildThisCode();

        return this.m_coder.buildFragCode();
    }
    getVtxShaderCode(): string {

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
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: ShadowVSMShaderBuffer = ShadowVSMShaderBuffer.GetInstance();
        return buf;
    }
    private m_colorData: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);

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