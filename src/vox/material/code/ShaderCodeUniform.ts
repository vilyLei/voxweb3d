
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "./IShaderCodeBuilder";
import UniformConst from "../UniformConst";
import { IShaderCodeUniform } from "./IShaderCodeUniform";

class ShaderCodeUniform implements IShaderCodeUniform {
    private m_codeBuilder: IShaderCodeBuilder = null;
    constructor(codeBuilder: IShaderCodeBuilder) {
        this.m_codeBuilder = codeBuilder;
    }
    
    /**
     * apply camera position uniform in the shader,the uniform vec4 data: [x, y, z, w]
     * @param vertEnabled whether apply camera position uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply camera position uniform in the fragment shader, the default value is true
     */
    useCameraPosition(vertEnabled: boolean = false, fragEnabled: boolean = true): void {

        if (vertEnabled) {
            this.m_codeBuilder.addVertUniformParam(UniformConst.CameraPosParam);
        }
        if (fragEnabled) {
            this.m_codeBuilder.addFragUniformParam(UniformConst.CameraPosParam);
        }
    }
    
    /**
     * apply view parameters uniform in the shader,the uniform vec4 data: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
     * @param vertEnabled whether apply view parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply view parameters uniform in the fragment shader, the default value is true
     */
    useViewPort(vertEnabled: boolean, fragEnabled: boolean): void {
        
        if (vertEnabled) {
            this.m_codeBuilder.addVertUniformParam(UniformConst.ViewParam);
        }
        if (fragEnabled) {
            this.m_codeBuilder.addFragUniformParam(UniformConst.ViewParam);
        }
    }
    /**
     * apply frustum parameters uniform in the shader,the uniform vec4 data: [camera zNear,camera zFar, camera nearPlaneHalfWidth, camera nearPlaneHalfHeight]
     * @param vertEnabled whether apply frustum parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply frustum parameters uniform in the fragment shader, the default value is true
     */
    useFrustum(vertEnabled: boolean, fragEnabled: boolean): void {
        
        if (vertEnabled) {
            this.m_codeBuilder.addVertUniformParam(UniformConst.FrustumParam);
        }
        if (fragEnabled) {
            this.m_codeBuilder.addFragUniformParam(UniformConst.FrustumParam);
        }
    }
}
export { ShaderCodeUniform };