import IVector3D from "../../../vox/math/IVector3D";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { ICtrTarget } from "../base/ICtrTarget";
import { CtrlTargetBase } from "../base/CtrlTargetBase";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class MovedTarget extends CtrlTargetBase implements ICtrTarget {

    constructor() {
        super();
    }

    select(controller: IEntityTransform = null): void {

        let tars = this.m_tars;
        if (tars != null) {
            let vs = this.m_vs;
            if (controller == null) controller = this.m_controllers[0];
            controller.getPosition(this.m_v3);
            for (let i = 0; i < tars.length; ++i) {
                vs[i].copyFrom(tars[i].getGlobalBounds().center);
                vs[i].subtractBy(this.m_v3);
            }
        }
    }
    setTargets(targets: IEntityTransform[]): void {

        this.m_tars = targets;
        if (targets != null) {
            if (this.m_vs == null || this.m_vs.length < targets.length) {
                this.m_vs = new Array(targets.length);
                for (let i = 0; i < targets.length; ++i) {
                    this.m_vs[i] = CoMath.createVec3();
                }
            }
        } else {
            this.m_vs = [];
        }
    }
    setPosition(pv: IVector3D): void {
        this.version++;
        let tars = this.m_tars;
        if (tars != null) {
            let vs = this.m_vs;
            const v3 = this.m_v3;
            let dv = CoMath.createVec3();
            let pos = CoMath.createVec3();
            for (let i = 0; i < tars.length; ++i) {
                v3.addVecsTo(pv, vs[i]);
                tars[i].getPosition(pos);
                dv.subVecsTo(tars[i].getGlobalBounds().center, pos);
                v3.subtractBy(dv);
                tars[i].setPosition(v3);
            }
        }
        let ls = this.m_controllers;
        for (let i = 0; i < ls.length; ++i) {
            ls[i].setPosition(pv);
            this.m_flags[i] = true;
        }
        this.position.copyFrom(pv);
        this.m_changed = true;
    }
}
export { MovedTarget };