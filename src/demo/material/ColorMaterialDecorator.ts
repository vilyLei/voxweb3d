/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import IShaderCodeObject from "../../vox/material/IShaderCodeObject";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { ShaderTextureBuilder } from "../../vox/material/ShaderTextureBuilder";

class ColorMaterialDecorator implements IMaterialDecorator {

    private m_uniqueName: string;
    private m_colorData: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    /**
     * the  default  value is false
     */
    vertColorEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    premultiplyAlpha: boolean = false;
    /**
     * the  default  value is false
     */
    shadowReceiveEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    lightEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    fogEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    envAmbientLightEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    brightnessOverlayEnabeld: boolean = false;
    /**
     * the default value is true
     */
    glossinessEnabeld: boolean = false;

    diffuseMap: IRenderTexture = null;
    // texturesTotal: number;
    constructor() {
    }

    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorData[0] = pr;
        this.m_colorData[1] = pg;
        this.m_colorData[2] = pb;
    }
    setAlpha(pa: number): void {
        this.m_colorData[3] = pa;
    }

    buildBufParams(): void {
        
    }
    buildTextureList(coder: ShaderTextureBuilder): void {
        coder.addDiffuseMap( this.diffuseMap );
    }
    buildShader(coder: IShaderCodeBuilder): void {
        coder.addFragUniform("vec4", "u_color", 0);
        coder.addFragMainCode(
`
    #ifdef VOX_DIFFUSE_MAP
        FragColor0 = u_color * VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
    #else
        FragColor = u_color;
    #endif
`
        );
        coder.addVertMainCode(
`
    localPosition = vec4(a_vs,1.0);
    worldPosition = u_objMat * localPosition;
    gl_Position = u_projMat * u_viewMat * worldPosition;
    v_uv.xy = a_uvs.xy;
`
        );
    }
    createUniformData(): ShaderUniformData {        
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorData];
        return oum;
    }
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.None;
    }
    getShaderCodeObject(): IShaderCodeObject {
        return null;
    }
    getUniqueName(): string {
        return this.m_uniqueName;
    }
    initialize(texEnabled: boolean = true): void {
        texEnabled = this.diffuseMap != null || texEnabled;
        this.m_uniqueName = "ColorMaterial";
        if (texEnabled) this.m_uniqueName += "Tex";
    }

}
export { ColorMaterialDecorator };