import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class DragMoveTarget implements IEntityTransform {

    private m_entitys: IEntityTransform[] = [null];
    private m_changFlags: boolean[] = [true];
    private m_targetPosOffset = CoMath.createVec3();
    position = CoMath.createVec3();

    constructor() {
    }
    setTargetPosOffset(offset: IVector3D): void {
        this.m_targetPosOffset.copyFrom(offset);
    }
    addEntity(entity: IEntityTransform): void {
        if (entity != null) {
            this.m_entitys.push(entity);
            this.m_changFlags.push(true);
        }
    }
    setTarget(target: IEntityTransform): void {
        this.m_entitys[0] = target;
        this.m_changFlags[0] = true;
    }
    getTarget(): IEntityTransform {
        return this.m_entitys[0];
    }

    setCtrlScaleXYZ(sx: number, sy: number, sz: number): void {
        for (let i: number = 1; i < this.m_entitys.length; ++i) {
            this.m_changFlags[i] = true;
            this.m_entitys[i].setScaleXYZ(sx, sy, sz);
        }
    }

    setXYZ(px: number, py: number, pz: number): void {
    }
    setPosition(pv: IVector3D): void {
        let i: number = 0;
        if (this.m_entitys[i] != null) {
            this.position.addVecsTo(pv, this.m_targetPosOffset);
            this.m_entitys[i].setPosition(this.position);
            this.m_changFlags[i] = true;
        }

        for (i = 1; i < this.m_entitys.length; ++i) {
            this.m_entitys[i].setPosition(pv);
            this.m_changFlags[i] = true;
        }
        this.position.copyFrom(pv);
    }
    getPosition(pv: IVector3D): IVector3D {
        pv.copyFrom(this.position);
        return pv
    }
    setRotation3(r: IVector3D): void {
        let i: number = 0;
        if (this.m_entitys[i] != null) {
            this.m_entitys[i].setRotation3(r);
            this.m_changFlags[i] = true;
        }
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        let i: number = 0;
        if (this.m_entitys[i] != null) {
            this.m_entitys[i].setScaleXYZ(sx, sy, sz);
            this.m_changFlags[i] = true;
        }
    }
    getRotationXYZ(pv: IVector3D): void {
        let i: number = 0;
        if (this.m_entitys[i] != null) {
            this.m_entitys[i].getRotationXYZ(pv);
        }
    }
    getScaleXYZ(sv: IVector3D): void {
        let i: number = 0;
        if (this.m_entitys[i] != null) {
            this.m_entitys[i].getScaleXYZ(sv);
        }
    }
    
    getGlobalBounds(): IAABB {
        return null;
    }
    getLocalBounds(): IAABB {
        return null;
    }
    localToGlobal(pv: IVector3D): void {
    }
    globalToLocal(pv: IVector3D): void {
    }
    update(): void {
        let i: number = 0;
        if (this.m_entitys[i] != null && this.m_changFlags[i]) {
            this.m_changFlags[i] = false;
            this.m_entitys[i].update();
        }
        for (i = 1; i < this.m_entitys.length; ++i) {
            if (this.m_changFlags[i]) {
                this.m_changFlags[i] = false;
                this.m_entitys[i].update();
            }
        }
    }
    destroy(): void {
        this.m_entitys = [null];
    }
}
export { DragMoveTarget };