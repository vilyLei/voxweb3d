import IVector3D from "../../../vox/math/IVector3D";
import DragPlane from "./DragPlane";
import DragRayCrossPlane from "./DragRayCrossPlane";
import { MovedTarget } from "./MovedTarget";
import { DragLine } from "./DragLine";

import { DragTransController } from "../transform/DragTransController";
import { IDragMoveController } from "./IDragMoveController";
import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import IColor4 from "../../../vox/material/IColor4";
import IMatrix4 from "../../../vox/math/IMatrix4";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
declare var CoMaterial: ICoMaterial;

/**
 * 在三个坐标轴上拖拽移动
 */
class DragMoveController extends DragTransController implements IDragMoveController {

    circleSize = 60.0;
    axisSize = 100.0;
    planeSize = 30.0;
    planeAlpha = 0.6;
    pickTestAxisRadius = 20;

    constructor() {super();}
    private createDragPlane(type: number, alpha: number, outColor: IColor4): DragPlane {

        let movePlane = new DragPlane();
        movePlane.moveSelfEnabled = false;
        movePlane.initialize(this.m_editRS, this.m_editRSPI, type, this.planeSize);
        outColor.a = alpha;
        movePlane.outColor.copyFrom(outColor);
        outColor.scaleBy(1.5);
        outColor.a = alpha * 1.3;
        movePlane.overColor.copyFrom(outColor);
        movePlane.showOutColor();

        movePlane.setTarget(this.m_target);
        this.m_target.addCtrlEntity(movePlane);
        this.m_controllers.push(movePlane);
        // this.m_editRS.addEntity(movePlane.getEntity(), this.m_editRSPI, true);
        return movePlane;
    }
    private createDragLine(tv: IVector3D, outColor: IColor4, mat4: IMatrix4): void {

        let trans = tv.clone().scaleBy(this.axisSize);
        mat4.setTranslation(trans);

        let line = new DragLine();
        line.coneScale = 0.8;
        line.coneTransMat4.copyFrom(mat4);
        line.tv.copyFrom(tv);
        line.innerSphereRadius = this.circleSize * 0.5;
        line.moveSelfEnabled = true;
        line.pickTestRadius = this.pickTestAxisRadius;
        line.initialize(this.axisSize, line.innerSphereRadius);
        line.outColor.copyFrom(outColor);
        outColor.scaleBy(1.5);
        line.overColor.copyFrom(outColor);
        line.showOutColor();

        line.setTarget(this.m_target);
        this.m_editRS.addEntity(line.getEntity(), this.m_editRSPI, true);
        this.m_editRS.addEntity(line.getCone(), this.m_editRSPI, true);
        this.m_target.addCtrlEntity(line.getEntity());
        this.m_target.addCtrlEntity(line.getCone());
        this.m_controllers.push(line);
    }
    protected init(): void {

        this.m_target = new MovedTarget();

        let alpha = this.planeAlpha;

        let color4 = CoMaterial.createColor4;

        let outColor = color4();

        const V3 = CoMath.Vector3D;
        let mat4 = CoMath.createMat4();
        mat4.identity();
        mat4.rotationZ(-0.5 * Math.PI);
        outColor.setRGB3Bytes(240, 55, 80);
        this.createDragLine(V3.X_AXIS, outColor, mat4);
        mat4.identity();
        mat4.rotationX(0.5 * Math.PI);
        mat4.rotationY(0.5 * Math.PI);
        outColor.setRGB3Bytes(135, 205, 55);
        this.createDragLine(V3.Y_AXIS, outColor, mat4);
        mat4.identity();
        mat4.rotationY(0.5 * Math.PI);
        mat4.rotationX(0.5 * Math.PI);
        outColor.setRGB3Bytes(80, 145, 240);
        this.createDragLine(V3.Z_AXIS, outColor, mat4);

        // xoz
        outColor.setRGB3Bytes(240, 55, 80);
        this.createDragPlane(0, alpha, outColor);
        // xoy
        outColor.setRGB3Bytes(135, 205, 55);
        this.createDragPlane(1, alpha, outColor);
        // yoz
        outColor.setRGB3Bytes(80, 145, 240);
        this.createDragPlane(2, alpha, outColor);

        let crossPlane = new DragRayCrossPlane();
        crossPlane.moveSelfEnabled = false;
        crossPlane.initialize(this.m_editRS, 0, this.circleSize);
        crossPlane.setTarget(this.m_target);
        this.m_target.addCtrlEntity(crossPlane);
        this.m_controllers.push(crossPlane);
    }
}

export { DragMoveController };