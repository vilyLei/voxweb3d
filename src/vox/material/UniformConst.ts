/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class UniformConst
{
    /**
     * object local space to world space matrix shader uniform name string
     */
    static LocalTransformMatUNS:string = "u_objMat";
    /**
     * camera view matrix shader uniform name string
     */
    static CameraViewMatUNS:string = "u_viewMat";
    /**
     * camera projective matrix shader uniform name string
     */
    static CameraProjectiveMatUNS:string = "u_projMat";
    /**
     * camera param shader uniform name string,vec4: [camera zNear,camera zFar, camera nearPlaneHalfW, camera nearPlaneHalfH]
     */
    static CameraParamUNS:string = "u_cameraParam";
    /**
     * stage param shader uniform name string, vec4: [2.0/stageWidth,2.0/stageHeight, stageWidth,stageHeight]
     */
    static StageParamUNS:string = "u_stageParam";
    /**
     * view port param shader uniform name string, vec4: [viewPortX, viewPortY, viewPortWidth, viewPortHeight]
     */
    static ViewParamUNS:string = "u_viewParam";
}