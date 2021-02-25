/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as IRenderBufferT from '../../vox/render/IRenderBuffer';

import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;

export namespace vox
{
    export namespace render
    {
        export interface IROMaterialUpdater
        {
            /**
             * update display entity texture list  system memory data to gpu memory data
             */
            updateDispTRO(disp:IRODisplay,deferred:boolean):void;
            /**
             * update single texture self system memory data to gpu memory data
             */
            updateTextureData(textureProxy:IRenderBuffer,deferred:boolean):void;
        }
    }
}