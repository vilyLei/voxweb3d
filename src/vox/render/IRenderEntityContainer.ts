/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import AABB from "../../vox/geom/AABB";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";

export default interface IRenderEntityContainer {
    
    getEvtDispatcher(evtClassType: number): IEvtDispatcher;
    getGlobalBounds(): AABB;
    getChildrenTotal(): number;
    getEntitysTotal(): number;
    getVisible(): boolean;
    getUid(): number;
    setXYZ(px: number, py: number, pz: number): void;
    setPosition(pv: Vector3D): void;
    getPosition(pv: Vector3D): void;
    setRotationXYZ(rx: number, ry: number, rz: number): void;
    setScaleXYZ(sx: number, sy: number, sz: number): void;

    localToGlobal(pv: Vector3D): void;
    globalToLocal(pv: Vector3D): void;
    sphereIntersect(centerV: Vector3D, radius: number): boolean;
}