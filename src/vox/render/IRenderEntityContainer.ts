/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IAABB from "../../vox/geom/IAABB";
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

    setVisible(boo: boolean): void;
    getVisible(): boolean;

    dispatchEvt(evt: any): number;
    getEvtDispatcher(evtClassType: number): IEvtDispatcher;
    getGlobalBounds(): IAABB;
    getChildrenTotal(): number;
    getEntitysTotal(): number;
    getVisible(): boolean;
    getUid(): number;
    setXYZ(px: number, py: number, pz: number): void;
    setPosition(pv: IVector3D): void;
    getPosition(pv: IVector3D): void;
    setRotation3(rv: IVector3D): void;
    setRotationXYZ(rx: number, ry: number, rz: number): void;
    getRotationXYZ(rv: IVector3D): void;
    setScaleXYZ(sx: number, sy: number, sz: number): void;
    getScaleXYZ(sv: IVector3D): void;
    setScale3(sv: IVector3D): void;

    localToGlobal(pv: IVector3D): void;
    globalToLocal(pv: IVector3D): void;
    sphereIntersect(centerV: IVector3D, radius: number): boolean;
    update(): void;
    destroy(): void;
}
