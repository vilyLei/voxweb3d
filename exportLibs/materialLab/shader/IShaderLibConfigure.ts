import { IShaderCodeConfigure } from "./IShaderCodeConfigure";

interface IShaderLibConfigure {
    version: string;
    shaderCodeConfigures: IShaderCodeConfigure[];
}

export { IShaderLibConfigure };