/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRODisplayT from "../../vox/display/IRODisplay";

import IRODisplay = IRODisplayT.vox.display.IRODisplay;

export namespace vox
{
    export namespace render
    {
        export interface IROVertexBufUpdater
        {
            updateVtxDataToGpuByUid(vtxUid:number,deferred:boolean):void;
            /**
             * update texture system memory data to gpu memory data
             */
            updateDispVbuf(disp:IRODisplay,deferred:boolean):void
        }
    }
}