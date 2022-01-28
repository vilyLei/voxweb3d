class MaterialContextParam {

    pointLightsTotal: number = 1;
    directionLightsTotal: number = 1;
    spotLightsTotal: number = 0;
    vsmFboIndex: number = 0;
    vsmEnabled: boolean = true;
    loadAllShaderCode: boolean = false;
    shaderCodeBinary: boolean = false;
    shaderLibVersion: string = "";
    shaderFileNickname: boolean = false;

    lambertMaterialEnabled: boolean = true;
    pbrMaterialEnabled: boolean = true;
    /**
     * 生产 二进制 glsl代码文件
     */
    buildBinaryFile: boolean = false;

    constructor() { }
}
export { MaterialContextParam };