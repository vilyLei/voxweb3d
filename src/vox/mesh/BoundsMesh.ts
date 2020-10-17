/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as MeshBaseT from "../../vox/mesh/MeshBase";
import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";

import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;
import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;

export namespace vox
{
    export namespace mesh
    {
        export class BoundsMesh extends MeshBase
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
    }
}