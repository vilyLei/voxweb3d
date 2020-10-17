/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 渲染场景内物体的鼠标事件控制类接口规范

import * as Stage3DT from "../../vox/display/Stage3D";
import * as IRaySelectorT from '../../vox/scene/IRaySelector';
import Stage3D = Stage3DT.vox.display.Stage3D;
import IRaySelector = IRaySelectorT.vox.scene.IRaySelector;



export namespace vox
{
    export namespace scene
    {
        export interface IEvt3DController
        {
            initialize(stage:Stage3D):void;
            setRaySelector(raySelector:IRaySelector):void;
            // @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
            // @param       status: 1(default process),1(deselect ray pick target)
            // @return      1 is send evt yes,0 is send evt no,-1 is event nothing
            run(evtFlowPhase:number,status:number):number;
            runEnd():void;
            reset():void;
            getEvtType():number;
            isSelected():boolean;
        }
    }
}