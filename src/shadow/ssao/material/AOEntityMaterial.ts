/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuilder from "../../../vox/material/code/ShaderCodeBuilder";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import UniformConst from "../../../vox/material/UniformConst";
import MaterialBase from "../../../vox/material/MaterialBase";

class AOEntityShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: AOEntityShaderBuffer = new AOEntityShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("AOEntityShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "AOEntityShd";
        this.adaptationShaderVersion = false;
    }
    buildShader(): void {

        let coder: ShaderCodeBuilder = this.m_coder;
        //coder.vertMatrixInverseEnabled = true;

        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec3", "a_nvs");

        this.m_texture.useViewPort();
        // color texture
        this.m_texture.addDiffuseMap();
        // ao texture
        this.m_texture.addAOMap();

        this.m_coder.addFragMainCode(
            `
void main() {

    vec4 color = VOX_Texture2D( u_sampler0, v_uv );
    vec4 factor4 = VOX_Texture2D( u_sampler1, gl_FragCoord.xy/u_viewParam.zw );
    factor4.x *= factor4.x;
    
    //FragColor0 = vec4(vec3(factor4.x), 1.0);
    //FragColor0 = vec4(mix(vec3(0.0), color.xyz, factor4.x)  + 0.001 * abs(v_nv), 1.0);
    FragColor0 = vec4(mix(vec3(0.0), color.xyz, factor4.x), 1.0);
    //FragColor0 = vec4(color.xyz, 1.0);
}
`
        );

        this.m_coder.addVertMainCode(
            `
void main() {

    mat4 viewMat4 = u_viewMat * u_objMat;
    viewPosition = viewMat4 * vec4(a_vs, 1.0);

    gl_Position = u_projMat * viewPosition;

    v_worldNormal.xyz = a_nvs;
    v_uv = a_uvs.xy;
}
`
        );
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[AOEntityShaderBuffer()]";
    }
    static GetInstance(): AOEntityShaderBuffer {
        return AOEntityShaderBuffer.s_instance;
    }
}

export default class AOEntityMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return AOEntityShaderBuffer.GetInstance();
    }

    createSelfUniformData(): ShaderUniformData {
        return null;
    }
}