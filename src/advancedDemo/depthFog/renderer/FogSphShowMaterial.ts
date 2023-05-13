/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";

class FogSphShowShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: FogSphShowShaderBuffer = new FogSphShowShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {

        super.initialize(texEnabled);
        this.adaptationShaderVersion = false;
        this.m_uniqueName = "FogSphShowShd";
    }
    buildShader(): void {

        let coder = this.m_coder;
        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVarying("vec2", "v_texUV");
        coder.useVertSpaceMats(true, false, false);

        this.m_uniform.add2DMap("MAP_0");
        this.m_uniform.add2DMap("MAP_1");
        this.m_uniform.add2DMap("MAP_2");

        coder.addFragUniform("vec4", "u_color");
        coder.addFragOutput("vec4", "FragColor0");

        coder.addVertMainCode(
            `
            gl_Position = u_objMat * vec4(a_vs,1.0);
            v_texUV = a_uvs.xy;
        `
        );
        coder.addFragMainCode(
            `
            vec4 color4 = VOX_Texture2D(MAP_0, v_texUV);
            vec4 factor4 = VOX_Texture2D(MAP_1, v_texUV);
            vec4 fogColor4 = u_color;
            fogColor4.xyz = VOX_Texture2D(MAP_2, v_texUV).xyz;
            //OutputColor = vec4(fogColor4.xyz * factor4.xyz + (1.0 - factor4.xyz) * color4.xyz, 1.0);

            // current fog effect
            vec3 fogColor = fogColor4.xyz * factor4.x + (1.0 - factor4.x) * color4.xyz;
            FragColor0 = vec4(fogColor.xyz, 1.0);

            //FragColor0 = vec4((1.0 - factor4.xxx) * fogColor4.xyz + color4.xyz * factor4.xxx, 1.0);
            // light fog effect
            // FragColor0 = vec4(fogColor4.xyz * factor4.xxx * 0.6 + color4.xyz, 1.0);
        `
        );

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    static GetInstance(): FogSphShowShaderBuffer {
        return FogSphShowShaderBuffer.s_instance;
    }
}

export class FogSphShowMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return FogSphShowShaderBuffer.GetInstance();
    }
    setRGBColor(pcolor: Color4): void {
        this.m_color[0] = pcolor.r;
        this.m_color[1] = pcolor.g;
        this.m_color[2] = pcolor.b;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_color[0] = pr;
        this.m_color[1] = pg;
        this.m_color[2] = pb;
    }
    private m_color: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);

    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_color];
        return oum;
    }
}
