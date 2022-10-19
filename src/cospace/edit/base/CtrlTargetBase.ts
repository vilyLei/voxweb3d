import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import {ICtrTarget} from "../base/ICtrTarget";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class CtrlTargetBase implements ICtrTarget {

    protected m_controllers: IEntityTransform[] = [];
    protected m_tars: IEntityTransform[] = null;
    protected m_vs: IVector3D[] = [];
    protected m_flags: boolean[] = [];
    protected m_changed: boolean = false;
    protected m_v3 = CoMath.createVec3();
    position = CoMath.createVec3();

    constructor() {
    }

    select(controller: IEntityTransform = null): void {
    }
    deselect(): void {
        this.m_tars = null;
    }
    addCtrlEntity(entity: IEntityTransform): void {
        if (entity != null) {
            this.m_controllers.push(entity);
            this.m_flags.push(true);
        }
    }
    setTargets(targets: IEntityTransform[]): void {
    }
    getTargets(): IEntityTransform[] {
        return this.m_tars;
    }

    setCtrlScaleXYZ(sx: number, sy: number, sz: number): void {
        const ls = this.m_controllers;
        for (let i = 0; i < ls.length; ++i) {
            this.m_flags[i] = true;
            ls[i].setScaleXYZ(sx, sy, sz);
        }
    }

    setXYZ(px: number, py: number, pz: number): void {
    }
    setPosition(pv: IVector3D): void {

    }
    getPosition(pv: IVector3D): IVector3D {
        pv.copyFrom(this.position);
        return pv;
    }
    setRotation3(r: IVector3D): void {
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
    }
    getRotationXYZ(rv: IVector3D): void {
    }
    getScaleXYZ(sv: IVector3D): void {
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

        if (this.m_changed) {
            let tars = this.m_tars;
            if (tars != null) {
                for (let i = 0; i < tars.length; ++i) {
                    tars[i].update();
                }
            }
        }
        for (let i = 0; i < this.m_controllers.length; ++i) {
            if (this.m_flags[i]) {
                this.m_flags[i] = false;
                this.m_controllers[i].update();
            }
        }
    }
    destroy(): void {
        this.m_tars = null;
        this.m_controllers = null;
    }
}
export { CtrlTargetBase };