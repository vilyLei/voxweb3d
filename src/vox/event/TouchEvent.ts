/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// mobile上的touch事件类

import * as Vector3DT from "../../vox/math/Vector3D";
import Vector3D = Vector3DT.vox.math.Vector3D;
export namespace vox
{
    export namespace event
    {
        // mobile 环境专用
        export class TouchEvent
        {
            static EventClassType:number = 1002;
            constructor()
            {
            }
            static GetEvtTypeValueBase():number
            {
                return 5001;
            }
            static GetEvtTypeValuesTotal():number
            {
                return 15;
            }
            // 和mouse event 对齐
            static readonly TOUCH_DOWN:number = 5001;
            static readonly TOUCH_UP:number = 5002;
            //static readonly MOUSE_RIGHT_UP:number = 5003;
            //static readonly MOUSE_RIGHT_DOWN:number = 5004;
            static readonly TOUCH_MOVE:number = 5005;
            //static readonly MOUSE_WHEEL:number = 5006;
            static readonly TOUCH_OVER:number = 5007;
            static readonly TOUCH_OUT:number = 5008;
            static readonly TOUCH_CLICK:number = 5009;
            //static readonly MOUSE_RIGHT_CLICK:number = 5010;
            static readonly TOUCH_DOUBLE_CLICK:number = 5011;
            static readonly TOUCH_CANCEL:number = 5012;
            static readonly MOUSE_MULTI_DOWN:number = 5013;
            static readonly MOUSE_MULTI_UP:number = 5014;
            static readonly MOUSE_MULTI_MOVE:number = 5015;

            //classType:number = 1001;
            getClassType():number
            {
                return TouchEvent.EventClassType;
            }
            // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)
            phase:number = 0;
            // 事件类型
            type:number = 0;//TouchEvent.MOUSE_DOWN;
            // 事件发送者
            target:any = null;
            // 物体空间坐标
            lpos:Vector3D = new Vector3D();
            // 世界坐标
            wpos:Vector3D = new Vector3D();
            // 射线参数方向参数
            raytv:Vector3D = new Vector3D(1.0,0.0,0.0);
            // 射线发射起点参数
            raypv:Vector3D = new Vector3D(0.0,0.0,0.0);
            // 屏幕空间鼠标坐标,和gpu空间对齐
            mouseX:number = 0.0;
            mouseY:number = 0.0;
            // 屏幕空间页面鼠标坐标
            mouseViewX:number = 0.0;
            mouseViewY:number = 0.0;
            // 例如多点触摸的时候就会有这个数据
            posArray:any[] = null;
            // 鼠标滚轮速度
            wheelDeltaY:number = 0;

            toString():string
            {
                return "[TouchEvent]";
            }
        }
    }
}
