
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { ShaderCodeType } from "./ShaderCodeType";

class ShaderCodeConfigure {

    types: ShaderCodeType[] = null;
    urls: string[] = null;
    uuid: ShaderCodeUUID = ShaderCodeUUID.Default;
    binary: boolean = false;
    constructor() {
    }
}

export { ShaderCodeConfigure };