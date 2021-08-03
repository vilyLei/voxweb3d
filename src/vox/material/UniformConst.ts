/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IUniformParam from "./IUniformParam";

class ShadowVSMParams implements IUniformParam{
    constructor() { }
    readonly type: string = "vec4";
    readonly data: Float32Array = null;
    /**
     * uniform name string
     */
    readonly name: string = "u_vsmParams";
    /**
     * uniform array length
     */
    readonly arrayLength: number = 3;
}
class EnvLightParam implements IUniformParam{
    constructor() { }
    readonly type: string = "vec4";
    readonly data: Float32Array = new Float32Array([

        0.1, 0.1, 0.1,              // ambient factor x,y,z
        1.0,                        // scatterIntensity

        1.0,                        // tone map exposure
        0.1,                        // reflectionIntensity
        600.0,                      // fogNear
        3500.0,                     // fogFar

        0.3,0.0,0.9,                // fog color(r, g, b)
        0.0005,                     // fog density

    ]);
    /**
     * uniform name string
     */
    readonly name: string = "u_envLightParams";
    /**
     * uniform array length
     */
    readonly arrayLength: number = 3;
}
class ShadowMat4UniformParam implements IUniformParam{
    constructor() { }
    readonly type: string = "mat4";
    readonly data: Float32Array = null;
    /**
     * uniform name string
     */
    readonly name: string = "u_shadowMat";
    /**
     * uniform array length
     */
    readonly arrayLength: number = 0;
}

class GlobalLightUniform {
    constructor() { }
    readonly type: string = "vec4";
    readonly positionName: string = "u_lightPositions";
    readonly colorName: string = "u_lightColors";    
}
export default class UniformConst {
    /**
     * object local space to world space matrix shader uniform name string
     */
    static readonly LocalTransformMatUNS: string = "u_objMat";
    /**
     * camera view matrix shader uniform name string
     */
    static readonly CameraViewMatUNS: string = "u_viewMat";
    /**
     * camera projective matrix shader uniform name string
     */
    static readonly CameraProjectiveMatUNS: string = "u_projMat";
    /**
     * camera param shader uniform name string,vec4: [camera zNear,camera zFar, camera nearPlaneHalfW, camera nearPlaneHalfH]
     */
    static readonly CameraParamUNS: string = "u_cameraParam";
    /**
     * stage param shader uniform name string, vec4: [2.0/stageWidth,2.0/stageHeight, stageWidth,stageHeight]
     */
    static readonly StageParamUNS: string = "u_stageParam";
    /**
     * view port param shader uniform name string, vec4: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
     */
    static readonly ViewParamUNS: string = "u_viewParam";

    //static readonly ShadowMatrixUNS: string = "u_shadowMat";
    static readonly ShadowMatrix: ShadowMat4UniformParam = new ShadowMat4UniformParam();
    static readonly ShadowVSMParams: ShadowVSMParams = new ShadowVSMParams();

    //static readonly GlobalLightPositinListUNS: string = "u_lightPositions";
    //static readonly GlobalLightColorListUNS: string = "u_lightColors";
    //GlobalLightUniform

    static readonly GlobalLight: GlobalLightUniform = new GlobalLightUniform();

    static readonly EnvLightParams: EnvLightParam = new EnvLightParam();

}