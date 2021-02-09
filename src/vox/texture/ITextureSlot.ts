/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderBufferT from "../../vox/render/IRenderBuffer";

import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;

export namespace vox
{
    export namespace texture
    {
        export interface ITextureSlot
        {
            isGpuEnabledByResUid(resUid:number):boolean;
            // 先使用map hash拦截的方式,来决定buf和renderer context避免重复的单次关联
            addRenderBuffer(buf:IRenderBuffer,bufResUid:number):void;
            addFreeUid(resUid:number):void;
            removeFreeUid(resUid:number):void;
        }
    }
}