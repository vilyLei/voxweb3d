/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class MeshVertex {
    // pos
    x: number = 0.0;
    y: number = 0.0;
    z: number = 0.0;
    // uv
    u: number = 0.0;
    v: number = 1.0;
    // normal
    nx: number = 0.0;
    ny: number = 0.0;
    nz: number = 0.0;
    index: number = 0;
    //
    constructor(px: number = 0, py: number = 0, pz: number = 0, pindex: number = 0) {
        // pos
        this.x = px;
        this.y = py;
        this.z = pz;
        this.index = pindex;
    }
    cloneVertex(): MeshVertex {
        let vtx: MeshVertex = new MeshVertex(this.x, this.y, this.z, this.index);
        vtx.nx = this.nx; vtx.ny = this.ny; vtx.nz = this.nz;
        vtx.u = this.u; vtx.v = this.v;
        return vtx;
    }
    copyFrom(pv: MeshVertex): void {
        this.x = pv.x; this.y = pv.y; this.z = pv.z;
        this.u = pv.u; this.v = pv.v;
        this.nx = pv.nx; this.ny = pv.ny; this.nz = pv.nz;
        this.index = pv.index;
    }
}