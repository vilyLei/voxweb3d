
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { ShaderCodeType } from "./ShaderCodeType";

interface IShaderCodeConfigure {

    types: ShaderCodeType[];
    urls: string[];
    uuid: ShaderCodeUUID;
    binary: boolean;
    buildBinaryFile: boolean;
}

export { IShaderCodeConfigure };