import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { IMovedTarget } from "./IMovedTarget";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class MovedTarget implements IMovedTarget {

    private m_controllers: IEntityTransform[] = [];
    private m_tars: IEntityTransform[] = null;
    private m_vs: IVector3D[] = [];
    private m_flags: boolean[] = [];
    private m_changed: boolean = false;
    private m_v3 = CoMath.createVec3();
    position = CoMath.createVec3();

    constructor() {
    }

    select(controller: IEntityTransform = null): void {

        let tars = this.m_tars;
        if (tars != null) {
            let vs = this.m_vs;
            if (controller == null) controller = this.m_controllers[0];
            controller.getPosition(this.m_v3);
            for (let i = 0; i < tars.length; ++i) {
                tars[i].getPosition(vs[i]);
                vs[i].subtractBy(this.m_v3);
            }
        }
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
        this.m_tars = targets;
        if (this.m_vs == null || this.m_vs.length < targets.length) {
            this.m_vs = new Array(targets.length);
            for (let i = 0; i < targets.length; ++i) {
                this.m_vs[i] = CoMath.createVec3();
            }
        }
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

        let tars = this.m_tars;
        if (tars != null) {
            let vs = this.m_vs;
            const v3 = this.m_v3;
            for (let i = 0; i < tars.length; ++i) {
                v3.addVecsTo(pv, vs[i]);
                tars[i].setPosition(v3);
            }
        }
        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].setPosition(pv);
            this.m_flags[i] = true;
        }
        this.position.copyFrom(pv);
        this.m_changed = true;
    }
    getPosition(pv: IVector3D): void {
        pv.copyFrom(this.position);
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
export { MovedTarget };