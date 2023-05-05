/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";

class AONVAndZShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: AONVAndZShaderBuffer = new AONVAndZShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "AONVAndZShd";
        this.adaptationShaderVersion = false;
    }
    buildShader(): void {

        let coder = this.m_coder;
        coder.vertMatrixInverseEnabled = true;

        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec3", "a_nvs");

        coder.addVarying("vec4", "v_param4");

        this.m_coder.addFragMainCode(
            `
void main() {
    FragColor0 = vec4(normalize(v_param4.xyz), v_param4.w);
}
`
        );
        this.m_coder.addVertMainCode(
            `
void main() {

    mat4 viewMat4 = u_viewMat * u_objMat;
    viewPosition = viewMat4 * vec4(a_vs, 1.0);

    gl_Position = u_projMat * viewPosition;
    mat3 viewMat3 = inverse(mat3(viewMat4));

    v_uv = a_uvs;
    v_param4 = vec4(a_nvs * viewMat3, -viewPosition.z);
}
`
        );
    }
    
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[AONVAndZShaderBuffer()]";
    }
    static GetInstance(): AONVAndZShaderBuffer {
        return AONVAndZShaderBuffer.s_instance;
    }
}

export default class AONVAndZMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return AONVAndZShaderBuffer.GetInstance();
    }
}