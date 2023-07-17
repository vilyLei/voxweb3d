
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { ShaderCodeType } from "./ShaderCodeType";

class ShaderCodeConfigure {

    types: ShaderCodeType[] = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
    urls: string[] = null;
    uuid: ShaderCodeUUID = ShaderCodeUUID.Default;
    binary = false;
    buildBinaryFile = false;
	toPBR(): void {
		this.uuid = ShaderCodeUUID.PBR;
	}
    constructor() {
    }
}

export { ShaderCodeConfigure };
