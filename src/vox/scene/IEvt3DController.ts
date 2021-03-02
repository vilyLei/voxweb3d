/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 渲染场景内物体的鼠标事件控制类接口规范

import * as IRenderStage3DT from "../../vox/render/IRenderStage3D";
import * as IRaySelectorT from "../../vox/scene/IRaySelector";
import IRenderStage3D = IRenderStage3DT.vox.render.IRenderStage3D;
import IRaySelector = IRaySelectorT.vox.scene.IRaySelector;



export namespace vox
{
    export namespace scene
    {
        export interface IEvt3DController
        {
            initialize(stage:IRenderStage3D):void;
            setRaySelector(raySelector:IRaySelector):void;
            // if mouse ray pick nonething, bgMouseEvent dispatch evts
            addBGMouseEventListener(type:number,target:any,func:(evt:any)=>void,captureEnabled:boolean,bubbleEnabled:boolean):void;
            removeBGMouseEventListener(type:number,target:any,func:(evt:any)=>void):void;
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