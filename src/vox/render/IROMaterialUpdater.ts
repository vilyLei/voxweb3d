/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as ROTextureResourceT from '../../vox/render/ROTextureResource';

import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;

export namespace vox
{
    export namespace render
    {
        export interface IROMaterialUpdater
        {
            /**
             * update texture system memory data to gpu memory data
             */
            updateDispTRO(disp:IRODisplay,deferred:boolean):void;
        }
    }
}