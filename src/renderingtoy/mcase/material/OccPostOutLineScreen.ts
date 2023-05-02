/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderUniformData from "../../../vox/material/IShaderUniformData";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { ISimpleMaterialDecorator } from "../../../vox/material/ISimpleMaterialDecorator";
import { IShaderTextureBuilder } from "../../../vox/material/IShaderTextureBuilder";

class OccPostOutLineScreen implements ISimpleMaterialDecorator {

    private m_uniqueName: string;
    
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
    fogEnabled: boolean = false;

    private m_currMap: IRenderTexture = null;
    
    constructor(tex: IRenderTexture) {
        
        this.m_uniqueName = "OccPostOutLineScreen";
        if( tex != null ) this.m_uniqueName += "Tex";

        this.m_currMap = tex;
    }

    buildBufParams(): void {
    }
    buildTextureList(builder: IShaderTextureBuilder): void {
        builder.addDiffuseMap(this.m_currMap);
    }
    buildShader(coder: IShaderCodeBuilder): void {
        
        coder.useVertSpaceMats(false, false, false);
        coder.addFragMainCode(
`
    FragColor0 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
`
        );
        coder.addVertMainCode(
`
    gl_Position = vec4(a_vs,1.0);
    v_uv = a_uvs.xy;
`
        );
    }
    createUniformData(): IShaderUniformData {        
        return null;
    }
    getUniqueName(): string {
        return this.m_uniqueName;
    }
    destroy(): void {
        this.m_currMap = null;
    }

}
export { OccPostOutLineScreen };