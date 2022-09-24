import IVector3D from "../../../vox/math/IVector3D";
import ScaleDragPlane from "./ScaleDragPlane";
import DragScaleRayCrossPlane from "./DragScaleRayCrossPlane";

import { ScaleDragLine } from "./ScaleDragLine";
import { ScaleTarget } from "./ScaleTarget";

import { DragTransController } from "../transform/DragTransController";
import { IDragScaleController } from "./IDragScaleController";
import { ICoMath } from "../../math/ICoMath";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import IColor4 from "../../../vox/material/IColor4";
import IMatrix4 from "../../../vox/math/IMatrix4";

declare var CoMath: ICoMath;
declare var CoMaterial: ICoMaterial;

/**
 * 在三个坐标轴上拖拽缩放
 */
class DragScaleController extends DragTransController implements IDragScaleController {

    circleSize = 60.0;
    axisSize = 100.0;
    planeSize = 30.0;
    planeAlpha = 0.6;
    pickTestAxisRadius = 20;

    constructor() { super(); }

    private createDragPlane(type: number, alpha: number, outColor: IColor4): ScaleDragPlane {

        let movePlane = new ScaleDragPlane();
        movePlane.moveSelfEnabled = false;
        movePlane.initialize(type, this.planeSize);
        outColor.a = alpha;
        movePlane.outColor.copyFrom(outColor);
        outColor.scaleBy(1.5);
        outColor.a = 1.3 * alpha;
        movePlane.overColor.copyFrom(outColor);

        movePlane.setTarget(this.m_target);
        this.m_target.addCtrlEntity(movePlane);
        this.m_controllers.push(movePlane);
        this.m_editRS.addEntity(movePlane.getEntity(), this.m_editRSPI, true);
        movePlane.showOutColor();
        
        return movePlane;
    }
    private createDragLine(tv: IVector3D, outColor: IColor4, mat4: IMatrix4): void {

        let trans = tv.clone().scaleBy(this.axisSize);
        mat4.setTranslation(trans);

        let line = new ScaleDragLine();
        line.boxScale = 0.4;
        line.coneTransMat4 = mat4;
        line.tv.copyFrom(tv);
        line.innerSphereRadius = this.circleSize * 0.5;
        line.moveSelfEnabled = false;
        line.pickTestRadius = this.pickTestAxisRadius;
        line.initialize(this.axisSize, line.innerSphereRadius);
        line.outColor.copyFrom(outColor);
        outColor.scaleBy(1.5);
        line.overColor.copyFrom(outColor);
        line.showOutColor();

        line.setTarget(this.m_target);
        this.m_editRS.addEntity(line.getEntity(), this.m_editRSPI, true);
        this.m_editRS.addEntity(line.getBox(), this.m_editRSPI, true);
        this.m_target.addCtrlEntity(line.getEntity());
        this.m_target.addCtrlEntity(line.getBox());
        this.m_controllers.push(line);
    }
    protected init(): void {

        this.m_target = new ScaleTarget();

        let alpha = this.planeAlpha;

        let color4 = CoMaterial.createColor4;

        let outColor = color4();

        const V3 = CoMath.Vector3D;
        let mat4 = CoMath.createMat4();

        outColor.setRGBUint8(240, 55, 80);
        mat4.identity();
        this.createDragLine(V3.X_AXIS, outColor, mat4);
        outColor.setRGBUint8(135, 205, 55);
        mat4.identity();
        this.createDragLine(V3.Y_AXIS, outColor, mat4);
        outColor.setRGBUint8(80, 145, 240);
        mat4.identity();
        this.createDragLine(V3.Z_AXIS, outColor, mat4);

        // xoz
        outColor.setRGBUint8(240, 55, 80);
        this.createDragPlane(0, alpha, outColor);
        // xoy
        outColor.setRGBUint8(135, 205, 55);
        this.createDragPlane(1, alpha, outColor);
        // yoz
        outColor.setRGBUint8(80, 145, 240);
        this.createDragPlane(2, alpha, outColor);

        let crossPlane = new DragScaleRayCrossPlane();
        crossPlane.moveSelfEnabled = false;
        crossPlane.initialize(this.m_editRS, 0, this.circleSize);
        crossPlane.setTarget(this.m_target);
        this.m_target.addCtrlEntity(crossPlane);
        this.m_controllers.push(crossPlane);
    }
}

export { DragScaleController };