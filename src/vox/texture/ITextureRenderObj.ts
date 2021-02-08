/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderProxyT from "../../vox/render/RenderProxy";

import RenderProxy = RenderProxyT.vox.render.RenderProxy;
export namespace vox
{
    export namespace texture
    {
        
        export interface ITextureRenderObj
        {
            run(rc:RenderProxy):void;
            getMid():number;
            __$attachThis():void;
            __$detachThis():void;
        }
        
    }
}