/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { DragTransController } from "../transform/DragTransController";
import { RotationCircle } from "./RotationCircle";
import { RotationCamZCircle } from "./RotationCamZCircle";
import { IDragRotationController } from "./IDragRotationController";
import { RotatedTarget } from "./RotatedTarget";

import IColor4 from "../../../vox/material/IColor4";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { RotationCamXYCircle } from "./RotationCamXYCircle";

declare var CoMaterial: ICoMaterial;

/**
 * 在三个坐标轴上拖动旋转
 */
class DragRotationController extends DragTransController implements IDragRotationController {

    radius = 100.0;
    pickTestAxisRadius = 20;
    camZCircleRadius = 120;
    camYXCircleRadius = 80;
    constructor() { super(); }
    private createCircle(type: number, color: IColor4, radius: number = 100.0, segsTotal: number = 20): RotationCircle {

        let circle = new RotationCircle();
        circle.pickTestRadius = this.pickTestAxisRadius;
        circle.outColor.copyFrom(color);
        circle.overColor.copyFrom(color);
        circle.overColor.scaleBy(2.0);
        circle.initialize(this.m_editRS, this.m_editRSPI + 1, radius, segsTotal, type);
        circle.showOutColor();

        circle.setTarget(this.m_target);

        this.m_target.addCtrlEntity(circle);
        this.m_controllers.push(circle);
        
        return circle;
    }

    protected init(): void {

        this.m_target = new RotatedTarget();
        // 粉色 240,55,80, 绿色 135 205 55,  蓝色:  80, 145, 240
        let n = Math.floor(this.radius / 2.0);
        if(n < 30) {
            n = 30;
        }
        // xoz
        let color = CoMaterial.createColor4();
        
        // xoy
        this.createCircle(0, color.setRGBUint8(240,55,80), this.radius, n);
        // xoz
        this.createCircle(1, color.setRGBUint8(135,205,55), this.radius, n);
        // yoz
        this.createCircle(2, color.setRGBUint8(80,145,240), this.radius, n);

        n = Math.floor(this.camZCircleRadius / 2.0);
        let camZCtrl = new RotationCamZCircle();
        camZCtrl.pickTestRadius = this.pickTestAxisRadius;
        camZCtrl.initialize(this.m_editRS, this.m_editRSPI, this.camZCircleRadius, n);
        camZCtrl.setTarget(this.m_target);
        this.m_target.addCtrlEntity(camZCtrl);
        this.m_controllers.push(camZCtrl);

        let camYXCtrl = new RotationCamXYCircle();
        camYXCtrl.pickTestRadius = this.pickTestAxisRadius;
        camYXCtrl.initialize(this.m_editRS, this.m_editRSPI, this.camYXCircleRadius);
        camYXCtrl.showOutColor();
        camYXCtrl.setTarget(this.m_target);
        this.m_target.addCtrlEntity(camYXCtrl);
        this.m_controllers.push(camYXCtrl);

    }
}
export { DragRotationController }