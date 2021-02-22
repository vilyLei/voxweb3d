/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IBufferBuilderT from "../../vox/render/IBufferBuilder";

import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;

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
            run(rc:IBufferBuilder):void;
            restoreThis(rc:IBufferBuilder):void;
            __$attachThis():void;
            __$detachThis():void;
        }
    }
}