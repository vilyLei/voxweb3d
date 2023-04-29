/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface ITexture3D extends IRenderTexture {

    getDepth(): number;
    /**
     * 
     * @param bytesData 3d texture uint8 format data bytes
     * @param miplevel mipmap level, the default value is 0
     */
    uploadFromTypedArray(bytesData: Uint8Array, miplevel?: number): void;
    
}
export { ITexture3D }