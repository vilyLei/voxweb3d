/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRTTTexture } from "./IRTTTexture";

interface IDepthTexture extends IRTTTexture {

    toDepthUnsignedInt(): void;
    toDepthUnsignedShort(): void;
    toDepthAndStencil(): void;
}
export { IDepthTexture };