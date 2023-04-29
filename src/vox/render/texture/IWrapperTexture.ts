/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "./IRenderTexture";

interface IWrapperTexture extends IRenderTexture {
    getAttachTex(): IRenderTexture;
    attachTex(tex: IRenderTexture): void;
    detachTex(): void;
}
export { IWrapperTexture }