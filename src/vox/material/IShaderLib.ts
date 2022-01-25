
import { ShaderCodeUUID } from "./ShaderCodeUUID";
import IShaderCodeObject from "./IShaderCodeObject";

interface IShaderLib {
    
    getShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): IShaderCodeObject;
    hasShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): boolean;
}
export { IShaderLib };