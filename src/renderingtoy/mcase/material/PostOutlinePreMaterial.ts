/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";

class PostOutlinePreShaderBuffer extends ShaderCodeBuffer {

    private m_uniqueName: string = "";    
    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "PostOutlinePreShd";
        this.adaptationShaderVersion = false;
    }
    buildShader(): void {
        this.m_coder.addFragMainCode(
`
    FragColor0 = vec4(1.0);
`
                    );
            
        this.m_coder.addVertMainCode(
`
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    gl_Position = u_projMat * u_viewMat * wpos;
`
                    );
        
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
}

export default class PostOutlinePreMaterial extends MaterialBase {
    private static s_shdCodeBuffer: PostOutlinePreShaderBuffer = null;
    constructor() {
        super();
        if(PostOutlinePreMaterial.s_shdCodeBuffer == null) {
            PostOutlinePreMaterial.s_shdCodeBuffer = new PostOutlinePreShaderBuffer();
        }
    }
    getCodeBuf(): ShaderCodeBuffer {
        return PostOutlinePreMaterial.s_shdCodeBuffer;
    }
}