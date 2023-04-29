/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 渲染场景内物体的鼠标事件控制类接口规范

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import IRaySelector from "../../vox/scene/IRaySelector";

export default interface IEvt3DController {
    initialize(mainStage: IRenderStage3D, currStage: IRenderStage3D): void;
    setRaySelector(raySelector: IRaySelector): void;
    mouseOutEventTarget(): number;
    // @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
    // @param       status: 1(default process),1(deselect ray pick target)
    // @return      1 is send evt yes,0 is send evt no,-1 is event nothing
    run(evtFlowPhase: number, status: number): number;
    runEnd(): void;
    reset(): void;
    getEvtType(): number;
    isSelected(): boolean;
}