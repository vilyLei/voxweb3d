
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "./IShaderCodeBuilder";
import UniformConst from "../UniformConst";

interface IShaderCodeUniform {
    /**
     * apply camera position uniform in the shader,the uniform vec4 data: [x, y, z, w]
     * @param vertEnabled whether apply camera position uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply camera position uniform in the fragment shader, the default value is true
     */
    useCameraPosition(vertEnabled: boolean, fragEnabled: boolean): void;
    /**
     * apply view parameters uniform in the shader,the uniform vec4 data: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
     * @param vertEnabled whether apply view parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply view parameters uniform in the fragment shader, the default value is true
     */
    useViewPort(vertEnabled: boolean, fragEnabled: boolean): void;
    /**
     * apply frustum parameters uniform in the shader,the uniform vec4 data: [camera zNear,camera zFar, camera nearPlaneHalfWidth, camera nearPlaneHalfHeight]
     * @param vertEnabled whether apply frustum parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply frustum parameters uniform in the fragment shader, the default value is true
     */
    useFrustum(vertEnabled: boolean, fragEnabled: boolean): void;
    /**
     * apply stage parameters uniform in the shader,the uniform vec4 data: [2.0/stageWidth,2.0/stageHeight, stageWidth,stageHeight]
     * @param vertEnabled whether apply stage parameters uniform in the vertex shader, the default value is false
     * @param fragEnabled whether apply stage parameters uniform in the fragment shader, the default value is true
     */
    useStage(vertEnabled: boolean, fragEnabled: boolean): void;
}
export {IShaderCodeUniform};