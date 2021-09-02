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

class PostOutlineShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PostOutlineShaderBuffer = new PostOutlineShaderBuffer();
    private m_codeBuilder: ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName: string = "";
    
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("PostOutlineShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "PostOutlineShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode(): void {

        let coder: ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();

        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addTextureSample2D();

        coder.addVarying("vec2", "v_uv");
        coder.addFragOutput("vec4", "FragColor0");

        coder.useVertSpaceMats(true, true, true);
        coder.vertMatrixInverseEnabled = true;

    }
    getFragShaderCode(): string {
        this.buildThisCode();
        this.m_codeBuilder.addFragHeadCode(
`
vec3 worldNormal;
`
        )
        this.m_codeBuilder.addFragMainCode(
`
void main() {
    vec4 color = VOX_Texture2D( u_sampler0, v_uv );

    FragColor0 = vec4(color.xyz, 1.0);

    #endif
}
`
        );

        return this.m_codeBuilder.buildFragCode();
    }
    getVtxShaderCode(): string {
        this.m_codeBuilder.addVertMainCode(
`
void main() {
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position =  u_projMat * viewPos;
    v_uv = a_uvs.xy;
    v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    //wpos.xyz += a_nvs.xyz * 0.05;

    #ifdef VOX_USE_SHADOW

    calcShadowPos( wpos );

    #endif

    #ifdef VOX_USE_FOG

    calcFogDepth(viewPos);

    #endif
}
`
        );
        return this.m_codeBuilder.buildVertCode();

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[PostOutlineShaderBuffer()]";
    }
    static GetInstance(): PostOutlineShaderBuffer {
        return PostOutlineShaderBuffer.s_instance;
    }
}

export default class PostOutlineMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: PostOutlineShaderBuffer = PostOutlineShaderBuffer.GetInstance();
        return buf;
    }
    private m_colorData: Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    
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