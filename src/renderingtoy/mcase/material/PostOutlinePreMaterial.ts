/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";

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
        this.m_coder.addFragUniform("vec4","u_fillColor");
        this.m_coder.addFragMainCode(
`
    FragColor0 = u_fillColor;
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
    private m_color: Float32Array = new Float32Array([1.0,0.0,1.0,1.0]);
    constructor() {
        super();
        if(PostOutlinePreMaterial.s_shdCodeBuffer == null) {
            PostOutlinePreMaterial.s_shdCodeBuffer = new PostOutlinePreShaderBuffer();
        }
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_color[0] = pr;
        this.m_color[1] = pg;
        this.m_color[2] = pb;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return PostOutlinePreMaterial.s_shdCodeBuffer;
    }
    
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_fillColor"];
        oum.dataList = [this.m_color];
        return oum;
    }
}