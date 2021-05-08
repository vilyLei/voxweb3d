/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRODisplay from "../../vox/display/IRODisplay";
import IRenderBuffer from '../../vox/render/IRenderBuffer';

export default interface IROMaterialUpdater
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