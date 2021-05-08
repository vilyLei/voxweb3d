/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import AABB from "../../vox/geom/AABB";

export default class GeometryBase
{
    protected m_vs:Float32Array = null;
    protected m_uvs:Float32Array = null;
    protected m_ivs:Uint16Array | Uint32Array = null;
    bounds:AABB = new AABB();
    vtxTotal:number = 0;
    trisNumber:number = 0;
    vtCount:number = 0;
    constructor(){}            
    
    toString():string
    {
        return "GeometryBase()";
    }
}