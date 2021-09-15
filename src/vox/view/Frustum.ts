/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";

import Plane from "../../vox/geom/Plane";
import AABB from "../../vox/geom/AABB";
class Frustum{

    constructor() {
    }
    version: number = 0;
    private m_frustumWAABB: AABB = new AABB();
    private m_invViewMat: Matrix4 = null;
    private m_nearPlaneHalfW: number = 0.5;
    private m_nearPlaneHalfH: number = 0.5;
    private m_nearWCV: Vector3D = new Vector3D();
    private m_farWCV: Vector3D = new Vector3D();
    private m_wNV: Vector3D = new Vector3D();
    // 4 far point, 4 near point 
    private m_wFrustumVtxArr: Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), null, null, null];
    // world space front,back ->(view space -z,z), world space left,right ->(view space -x,x),world space top,bottm ->(view space y,-y)
    private m_wFruPlaneList: Plane[] = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];
    private m_fpNVArr: Vector3D[] = [new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D(), new Vector3D()];
    private m_fpDisArr: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    
    toString(): string {
        return "[Object Frustum()]";
    }
}
export {Frustum};