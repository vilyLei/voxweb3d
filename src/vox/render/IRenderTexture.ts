/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderResource from "../../vox/render/IRenderResource";
import IRenderBuffer from "../../vox/render/IRenderBuffer";

interface IRenderTexture extends IRenderBuffer
{
    isDirect():boolean;
    getUid():number;
    getResUid():number;
    getSampler():number;
    getAttachCount():number;
    __$attachThis():void;
    __$detachThis():void;
    __$$use(res:IRenderResource):void;
    __$$upload(res:IRenderResource):void;
    __$destroy():void;
    __$$removeFromSlot():void;
}
export default IRenderTexture;