/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";

class PostOutlinePreShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PostOutlinePreShaderBuffer = new PostOutlinePreShaderBuffer();
    private m_uniqueName: string = "";
    
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "PostOutlinePreShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode(): void {

        let coder = this.m_coder;
        coder.reset();

        coder.addVertLayout("vec3", "a_vs");
        coder.addFragOutput("vec4", "FragColor0");

        coder.useVertSpaceMats(true, true, true);
        //coder.vertMatrixInverseEnabled = true;
        
    }
    getFragShaderCode(): string {

        this.buildThisCode();

        this.m_coder.addFragMainCode(
`
void main() {
    FragColor0 = vec4(1.0);
}
`
        );

        return this.m_coder.buildFragCode();
    }
    getVertShaderCode(): string {

        this.m_coder.addVertMainCode(
`
void main() {
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    gl_Position = u_projMat * u_viewMat * wpos;
}
`
        );
        return this.m_coder.buildVertCode();

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[PostOutlinePreShaderBuffer()]";
    }
    static GetInstance(): PostOutlinePreShaderBuffer {
        return PostOutlinePreShaderBuffer.s_instance;
    }
}

export default class PostOutlinePreMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: PostOutlinePreShaderBuffer = PostOutlinePreShaderBuffer.GetInstance();
        return buf;
    }
}