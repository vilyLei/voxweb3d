import IVector3D from "../../../vox/math/IVector3D";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { ICtrTarget } from "../base/ICtrTarget";
import { CtrlTargetBase } from "../base/CtrlTargetBase";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class ScaleTarget extends CtrlTargetBase implements ICtrTarget {

    private m_svs: IVector3D[] = [];
    private m_sv: IVector3D = CoMath.createVec3();
    private m_pv: IVector3D = CoMath.createVec3();

    constructor() {
        super();
    }

    select(controller: IEntityTransform = null): void {

        let tars = this.m_tars;

        if (tars != null) {

            const vs = this.m_vs;
            const svs = this.m_svs;

            let cv = this.position;
            cv.setXYZ(0.0, 0.0, 0.0);
            for (let i = 0; i < tars.length; ++i) {
                vs[i].copyFrom(tars[i].getGlobalBounds().center);
                cv.addBy(vs[i]);
            }
            cv.scaleBy(1.0 / tars.length);
            for (let i = 0; i < tars.length; ++i) {
                vs[i].copyFrom(tars[i].getGlobalBounds().center);
                vs[i].subtractBy(cv);
                tars[i].getScaleXYZ(svs[i]);
            }
        }
    }
    setTargets(targets: IEntityTransform[]): void {

        this.m_tars = targets;
        if (targets != null) {
            if (this.m_vs == null || this.m_vs.length < targets.length) {
                this.m_vs = new Array(targets.length);
                this.m_svs = new Array(targets.length);
                for (let i = 0; i < targets.length; ++i) {
                    this.m_vs[i] = CoMath.createVec3();
                    this.m_svs[i] = CoMath.createVec3();
                }
            }
        } else {
            this.m_vs = [];
            this.m_svs = [];
        }
    }
    setPosition(pv: IVector3D): ScaleTarget {

        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].setPosition(pv);
            this.m_flags[i] = true;
        }
        return this;
    }
    setScaleXYZ(sx: number, sy: number, sz: number): ScaleTarget {

        if (this.m_tars != null) {

            this.version++;
            this.m_sv.setXYZ(sx, sy, sz);
            const vs = this.m_vs;
            const svs = this.m_svs;
            const cv = this.position;
            let pv = this.m_pv;

            let dv = CoMath.createVec3();
            let pos = CoMath.createVec3();
            let tars = this.m_tars;
            
            for (let i = 0; i < tars.length; ++i) {
                const sv = svs[i];
                tars[i].setScaleXYZ(sv.x * sx, sv.y * sy, sv.z * sz);
            }
            for (let i = 0; i < tars.length; ++i) {
                pv.copyFrom(vs[i]).multBy(this.m_sv).addBy(cv);
                
                // calc new bounds center position
                
                tars[i].update();
                dv.subVecsTo(tars[i].getGlobalBounds().center, pv);
                tars[i].getPosition(pos);
                pos.subtractBy(dv);

                tars[i].setPosition(pos);
            }

            this.m_changed = true;
        }
        return this;

    }
    getScaleXYZ(sv: IVector3D): IVector3D {

        sv.setXYZ(1.0, 1.0, 1.0);
        return sv;
    }
}
export { ScaleTarget };