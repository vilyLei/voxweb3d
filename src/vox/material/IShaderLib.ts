
import { ShaderCodeUUID } from "./ShaderCodeUUID";
import IShaderCodeObject from "./IShaderCodeObject";

interface IShaderLib {

    getShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): IShaderCodeObject;
}
export { IShaderLib };