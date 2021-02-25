/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderResourceT from "../../vox/render/IRenderResource";

import IRenderResource = IRenderResourceT.vox.render.IRenderResource;
export namespace vox
{
    export namespace render
    {
        export interface IRenderBuffer
        {
            /**
             * @returns 返回自己的 纹理资源 unique id, 这个id会被对应的资源管理器使用, 此方法子类可以依据需求覆盖
             */
            getResUid():number;
            __$updateToGpu(res:IRenderResource):void;
        }
    }
}