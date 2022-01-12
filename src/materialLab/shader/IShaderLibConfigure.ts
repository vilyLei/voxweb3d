
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { ShaderCodeType } from "./ShaderCodeType";
import { ShaderCodeConfigure } from "./ShaderCodeConfigure";

interface IShaderLibConfigure {
    version: string;
    shaderCodeConfigures: ShaderCodeConfigure[];
}

export { IShaderLibConfigure };