interface IMaterialContextParam {

    pointLightsTotal: number;
    directionLightsTotal: number;
    spotLightsTotal: number;
    vsmFboIndex: number;
    vsmEnabled: boolean;
    loadAllShaderCode: boolean;
    shaderCodeBinary: boolean;
    shaderLibVersion: string;
    shaderFileNickname: boolean;

    lambertMaterialEnabled: boolean;
    pbrMaterialEnabled: boolean;
    /**
     * 生产 二进制 glsl代码文件
     */
    buildBinaryFile: boolean;

}
export { IMaterialContextParam };