/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderResourceT from '../../vox/render/IRenderResource';
import IRenderResource = IRenderResourceT.vox.render.IRenderResource;
export namespace vox
{
    export namespace render
    {
        /**
         * the renderer runtime texture resource management implements
         */
        export interface IRenderTexResource extends IRenderResource
        {
            /**
             * unlocked value will determine whether to lock
             */
            unlocked:boolean;
            /**
             * @returns get renderer runtime texture rexource total number
             */
            getTextureResTotal():number;
            /**
             * @returns get renderer runtime texture rexource reference total number
             */
            getAttachTotal():number;
        }
    }
}