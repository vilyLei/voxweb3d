/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderResourceT from "../../vox/render/IRenderResource";
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";

import IRenderResource = IRenderResourceT.vox.render.IRenderResource;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;

export namespace vox
{
    export namespace render
    {
        export interface IRenderTexture extends IRenderBuffer
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
            __$setSlot(slot:ITextureSlot):void;
            __$destroy():void;
        }
    }
}