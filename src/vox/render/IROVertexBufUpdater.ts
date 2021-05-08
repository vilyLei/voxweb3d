/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRODisplay from "../../vox/display/IRODisplay";

export default interface IROVertexBufUpdater
{
    updateVtxDataToGpuByUid(vtxUid:number,deferred:boolean):void;
    /**
     * update texture system memory data to gpu memory data
     */
    updateDispVbuf(disp:IRODisplay,deferred:boolean):void
}