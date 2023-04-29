/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// mouse or touch event

import Vector3D from "../../vox/math/Vector3D";
import EventBase from "./EventBase";
import IMouseEvent from "./IMouseEvent";

export default class MouseEvent extends EventBase implements IMouseEvent {
    static readonly EventClassType = 1002;
    constructor() {
        super();
    }
    static GetMouseEvtTypeValueBase(): number {
        return 5001;
    }
    static GetMouseEvtTypeValuesTotal(): number {
        return 24;
    }
    static readonly MOUSE_DOWN = 5001;
    static readonly MOUSE_UP = 5002;
    static readonly MOUSE_RIGHT_UP = 5003;
    static readonly MOUSE_RIGHT_DOWN = 5004;
    static readonly MOUSE_MOVE = 5005;
    static readonly MOUSE_WHEEL = 5006;
    static readonly MOUSE_OVER = 5007;
    static readonly MOUSE_OUT = 5008;
    static readonly MOUSE_CLICK = 5009;
    static readonly MOUSE_RIGHT_CLICK = 5010;
    static readonly MOUSE_DOUBLE_CLICK = 5011;
    static readonly MOUSE_CANCEL = 5012;
    static readonly MOUSE_MULTI_DOWN = 5013;
    static readonly MOUSE_MULTI_UP = 5014;
    static readonly MOUSE_MULTI_MOVE = 5015;
    static readonly MOUSE_BG_DOWN = 5016;            //  mouse down do not hit any 3d object, only in stage
    static readonly MOUSE_BG_UP = 5017;              //  mouse up do not hit any 3d object, only in stage
    static readonly MOUSE_BG_CLICK = 5018;          //  mouse up do not hit any 3d object, only in stage
    static readonly MOUSE_MIDDLE_DOWN = 5019;  
    static readonly MOUSE_MIDDLE_UP = 5020;  
    static readonly MOUSE_BG_RIGHT_DOWN = 5021;            //  mouse down do not hit any 3d object, only in stage
    static readonly MOUSE_BG_RIGHT_UP = 5022;              //  mouse up do not hit any 3d object, only in stage
    static readonly MOUSE_BG_MIDDLE_DOWN = 5023;            //  mouse down do not hit any 3d object, only in stage
    static readonly MOUSE_BG_MIDDLE_UP = 5024;              //  mouse up do not hit any 3d object, only in stage

    getClassType(): number {
        return MouseEvent.EventClassType;
    }

    // 物体空间坐标
    lpos = new Vector3D();
    // 世界坐标
    wpos = new Vector3D();
    /**
     * the direction on a ray line in the world space
     */
    raytv = new Vector3D(1.0, 0.0, 0.0);
    /**
     * the point on a ray line in the world space
     */
    raypv = new Vector3D(0.0, 0.0, 0.0);
    // 屏幕空间鼠标坐标,和gpu空间对齐
    mouseX = 0.0;
    mouseY = 0.0;
    // 屏幕空间页面鼠标坐标
    mouseViewX = 0.0;
    mouseViewY = 0.0;
    // 例如多点触摸的时候就会有这个数据
    posArray: any[] = null;
    // 鼠标滚轮速度
    wheelDeltaY = 0;
}
