/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderResource from "../../vox/render/IRenderResource";
import IRenderBuffer from "../../vox/render/IRenderBuffer";
import {IRenderProxy} from "../../vox/render/IRenderProxy";

interface IRenderTexture extends IRenderBuffer
{
    internalFormat: number;
    isDirect():boolean;
    getUid():number;
    getResUid():number;
    getSampler():number;
    getAttachCount():number;
    getWidth(): number;
    getHeight(): number;
    getTargetType(): number;
    uploadFromFbo(texResource: IRenderResource, fboWidth: number, fboHeight: number): void;
    __$setRenderProxy(rc: IRenderProxy): void
    __$attachThis():void;
    __$detachThis():void;
    __$$use(res:IRenderResource):void;
    __$$upload(res:IRenderResource):void;
    __$destroy():void;
    __$$removeFromSlot():void;
}
export default IRenderTexture;