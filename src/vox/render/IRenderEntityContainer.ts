/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import AABB from "../../vox/geom/AABB";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import IRenderer from "../../vox/scene/IRenderer";

export default interface IRenderEntityContainer {
    mouseEnabled: boolean;
    // 自身所在的world的唯一id, 通过这个id可以找到对应的world
    __$wuid: number;
    // render process uid
    wprocuid: number;
    // 记录自身是否再容器中(取值为0和1), 不允许外外面其他代码调用
    __$contId: number;

    __$setRenderer(renderer: IRenderer): void;
    getRenderer(): IRenderer;

    dispatchEvt(evt: any): number;
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
    update(): void;
}