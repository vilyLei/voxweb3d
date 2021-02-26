/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderResourceT from "../../vox/render/IRenderResource";
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";

import IRenderResource = IRenderResourceT.vox.render.IRenderResource;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;

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
            __$attachThis():void;
            __$detachThis():void;
            __$$use(res:IRenderResource):void;
            __$$upload(res:IRenderResource):void;

        }
    }
}