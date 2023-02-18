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
import IRenderEntityBase from "./IRenderEntityBase";

export default interface IRenderEntityContainer extends IRenderEntityBase {
    uuid: string;
    // /**
    //  * mouse interaction enabled, the default value is false
    //  */
    // mouseEnabled: boolean;
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
    getGlobalBounds(): IAABB;
    getChildrenTotal(): number;
    getEntitysTotal(): number;
    setXYZ(px: number, py: number, pz: number): void;
    setPosition(pv: IVector3D): void;
    /**
     * @param resultPos the default value is null
     */
    getPosition(resultPos?: IVector3D): IVector3D;

    setRotation3(rv: IVector3D): void;
    setRotationXYZ(rx: number, ry: number, rz: number): void;
    
    /**
     * @param rv the default value is null
     */
    getRotationXYZ(rv?: IVector3D): IVector3D;
    setScaleXYZ(sx: number, sy: number, sz: number): void;
    
    /**
     * @param sv the default value is null
     */
    getScaleXYZ(sv?: IVector3D): IVector3D;
    setScale3(sv: IVector3D): void;

    localToGlobal(pv: IVector3D): void;
    globalToLocal(pv: IVector3D): void;
    sphereIntersect(centerV: IVector3D, radius: number): boolean;

    // update(): void;
    // destroy(): void;
    // getUid(): number;
    // setVisible(boo: boolean): void;
    // getVisible(): boolean;
    // isVisible(): boolean;
}
