/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 鼠标事件类

import * as Vector3DT from "../../vox/geom/Vector3";
import Vector3D = Vector3DT.vox.geom.Vector3D;
export namespace vox
{
    export namespace event
    {
        export class MouseEvent
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
                return 11;
            }
            static MOUSE_DOWN:number = 5001;
            static MOUSE_UP:number = 5002;
            static MOUSE_RIGHT_UP:number = 5003;
            static MOUSE_RIGHT_DOWN:number = 5004;
            static MOUSE_MOVE:number = 5005;
            static MOUSE_WHEEL:number = 5006;
            static MOUSE_OVER:number = 5007;
            static MOUSE_OUT:number = 5008;
            static MOUSE_CLICK:number = 5009;
            static MOUSE_RIGHT_CLICK:number = 5010;
            static MOUSE_DOUBLE_CLICK:number = 5011;

            //classType:number = 1001;
            getClassType():number
            {
                return MouseEvent.EventClassType;
            }
            // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)
            phase:number = 0;
            // 事件类型
            type:number = 0;//MouseEvent.MOUSE_DOWN;
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
            // 屏幕空间鼠标坐标
            mouseX:number = 0.0;
            mouseY:number = 0.0;
            // 鼠标滚轮速度
            wheelDeltaY:number = 0;

            toString():string
            {
                return "[MouseEvent]";
            }
        }
    }
}
