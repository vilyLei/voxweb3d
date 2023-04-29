/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// mouse or touch event

import IVector3D from "../../vox/math/IVector3D";
import IEventBase from "./IEventBase";
export default interface IMouseEvent extends IEventBase {
    
    // 物体空间坐标
    lpos: IVector3D;
    // 世界坐标
    wpos: IVector3D;
    /**
     * the direction on a ray line in the world space
     */
    raytv: IVector3D;
    /**
     * the point on a ray line in the world space
     */
    raypv: IVector3D;
    // 屏幕空间鼠标坐标,和gpu空间对齐
    mouseX: number;
    mouseY: number;
    // 屏幕空间页面鼠标坐标
    mouseViewX: number;
    mouseViewY: number;
    // 例如多点触摸的时候就会有这个数据
    posArray: any[];
    // 鼠标滚轮速度
    wheelDeltaY: number;
}
