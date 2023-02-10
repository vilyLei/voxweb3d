
// import { ShaderCodeUUID } from "./ShaderCodeUUID";
import IShaderCodeObject from "./IShaderCodeObject";

interface IShaderLib {
    /**
     * @param uuid the value from ShaderCodeUUID
     */
    getShaderCodeObjectWithUUID(uuid: string): IShaderCodeObject;
    /**
     * @param uuid the value from ShaderCodeUUID
     */
    hasShaderCodeObjectWithUUID(uuid: string): boolean;
}
export { IShaderLib };