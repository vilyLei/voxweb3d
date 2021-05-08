/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";

export default class BoundsMesh extends MeshBase
{
    constructor()
    {
        super(VtxBufConst.VTX_STATIC_DRAW);
    }
    __$attachVBuf():ROVertexBuffer
    {
        return null;
    }
    __$detachVBuf(vbuf:ROVertexBuffer):void
    {
    }
    toString():string
    {
        return "[BoundsMesh()]";
    }
    isEnabled():boolean
    {
        return this.bounds != null;
    }
    isPolyhedral():boolean{return false;}
    __$destroy():void
    {
        this.bounds = null;
    }
}