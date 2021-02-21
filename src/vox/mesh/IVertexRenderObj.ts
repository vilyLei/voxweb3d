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
    export namespace mesh
    {
        
        export interface IVertexRenderObj
        {
            /**
             * indices buffer object.
             */
            ibuf:any;
            /**
             * be used by the renderer runtime, the value is 2 or 4.
             */
            ibufStep:number;
            getMid():number;
            getVtxUid():number;
            run(rc:RenderProxy):void;
            restoreThis(rc:RenderProxy):void;
            __$attachThis():void;
            __$detachThis():void;
        }
    }
}