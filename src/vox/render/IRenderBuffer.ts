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
    export namespace render
    {
        export interface IRenderBuffer
        {
            __$updateToGpu(rc:RenderProxy):void;
            __$setUpdateStatus(s:number):void;
            __$getUpdateStatus():number;
        }
    }
}