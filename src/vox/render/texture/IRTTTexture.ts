/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface IRTTTexture extends IRenderTexture {
    to2DTexture(): void;
    toCubeTexture(): void;
    toRedFormat(): void;
    enableMipmap(): void;
    disableMipmap(): void;
    setSize(fboTextureWidth: number, fboTextureHeight: number): void;
}
export { IRTTTexture }