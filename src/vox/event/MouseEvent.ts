/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// mouse or touch event

import Vector3D from "../../vox/math/Vector3D";
import EventBase from "./EventBase";
export default class MouseEvent extends EventBase {
    static EventClassType: number = 1002;
    constructor() {
        super();
    }
    static GetMouseEvtTypeValueBase(): number {
        return 5001;
    }
    static GetMouseEvtTypeValuesTotal(): number {
        return 18;
    }
    static readonly MOUSE_DOWN: number = 5001;
    static readonly MOUSE_UP: number = 5002;
    static readonly MOUSE_RIGHT_UP: number = 5003;
    static readonly MOUSE_RIGHT_DOWN: number = 5004;
    static readonly MOUSE_MOVE: number = 5005;
    static readonly MOUSE_WHEEL: number = 5006;
    static readonly MOUSE_OVER: number = 5007;
    static readonly MOUSE_OUT: number = 5008;
    static readonly MOUSE_CLICK: number = 5009;
    static readonly MOUSE_RIGHT_CLICK: number = 5010;
    static readonly MOUSE_DOUBLE_CLICK: number = 5011;
    static readonly MOUSE_CANCEL: number = 5012;
    static readonly MOUSE_MULTI_DOWN: number = 5013;
    static readonly MOUSE_MULTI_UP: number = 5014;
    static readonly MOUSE_MULTI_MOVE: number = 5015;

    static readonly MOUSE_BG_DOWN: number = 5016;            //  mouse down do not hit any 3d object, only in stage
    static readonly MOUSE_BG_UP: number = 5017;              //  mouse up do not hit any 3d object, only in stage
    static readonly MOUSE_BG_CLICK: number = 5018;          //  mouse up do not hit any 3d object, only in stage

    getClassType(): number {
        return MouseEvent.EventClassType;
    }
    // // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)
    // phase: number = 0;
    // // 事件类型
    // type: number = 0;//MouseEvent.MOUSE_DOWN;
    // // 事件发送者
    // target: any = null;
    // 物体空间坐标
    lpos: Vector3D = new Vector3D();
    // 世界坐标
    wpos: Vector3D = new Vector3D();
    /**
     * the direction on a ray line in the world space
     */
    raytv: Vector3D = new Vector3D(1.0, 0.0, 0.0);
    /**
     * the point on a ray line in the world space
     */
    raypv: Vector3D = new Vector3D(0.0, 0.0, 0.0);
    // 屏幕空间鼠标坐标,和gpu空间对齐
    mouseX: number = 0.0;
    mouseY: number = 0.0;
    // 屏幕空间页面鼠标坐标
    mouseViewX: number = 0.0;
    mouseViewY: number = 0.0;
    // 例如多点触摸的时候就会有这个数据
    posArray: any[] = null;
    // 鼠标滚轮速度
    wheelDeltaY: number = 0;
    toString(): string {
        return "[MouseEvent]";
    }
}
