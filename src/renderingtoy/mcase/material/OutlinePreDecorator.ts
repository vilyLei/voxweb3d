/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
import IShaderUniformData from "../../../vox/material/IShaderUniformData";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { ISimpleMaterialDecorator } from "../../../vox/material/ISimpleMaterialDecorator";
import { IShaderTextureBuilder } from "../../../vox/material/IShaderTextureBuilder";

class OutlinePreDecorator implements ISimpleMaterialDecorator {

    private m_uniqueName: string;
    private m_colorData: Float32Array = new Float32Array([ 1.0,0.0,1.0, 1.0 ]);
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
    
    constructor() {        
        this.m_uniqueName = "PostOutlinePre";
    }

    setRGB3f(pr: number, pg: number, pb: number): void {

        this.m_colorData[0] = pr;
        this.m_colorData[1] = pg;
        this.m_colorData[2] = pb;
        
    }
    buildBufParams(): void {        
    }
    buildTextureList(builder: IShaderTextureBuilder): void {        
    }
    buildShader(coder: IShaderCodeBuilder): void {
        
        coder.addFragUniform("vec4", "u_colorFill", 0);
        coder.addFragMainCode(
`
    FragColor0 = u_colorFill;
`
        );
        coder.addVertMainCode(
`
    worldPosition = u_objMat * vec4(a_vs, 1.0);
    gl_Position = u_projMat * u_viewMat * worldPosition;
`
        );
    }
    createUniformData(): IShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_colorFill"];
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

}
export { OutlinePreDecorator };