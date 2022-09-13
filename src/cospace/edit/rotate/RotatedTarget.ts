import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class RotatedTarget implements IEntityTransform {

    private m_controllers: IEntityTransform[] = [];
    private m_tars: IEntityTransform[] = null;
    private m_vs: IVector3D[] = [];
    private m_rvs: IVector3D[] = [];
    private m_flags: boolean[] = [];
    private m_changed: boolean = false;
    private m_rv: IVector3D = CoMath.createVec3();
    private m_pv: IVector3D = CoMath.createVec3();
    private m_mat0 = CoMath.createMat4();

    /**
     * center
     */
    position = CoMath.createVec3();

    constructor() {
    }

    select(controller: IEntityTransform = null): void {

        let tars = this.m_tars;

        if (tars != null) {

            const vs = this.m_vs;
            const rvs = this.m_rvs;
            let piOver180 = Math.PI / 180.0;
            let cv = this.position;
            cv.setXYZ(0.0, 0.0, 0.0);
            for (let i = 0; i < tars.length; ++i) {
                tars[i].getPosition(vs[i]);
                cv.addBy(vs[i]);
            }
            cv.scaleBy(1.0 / tars.length);
            for (let i = 0; i < tars.length; ++i) {
                tars[i].getPosition(vs[i]);
                vs[i].subtractBy(cv);
                tars[i].getRotationXYZ(rvs[i]);
                rvs[i].scaleBy(piOver180);
            }
        }
    }
    deselect(): void {
        this.m_tars = null;
    }

    addCtrlEntity(engity: IEntityTransform): void {
        if (engity != null) {
            this.m_controllers.push(engity);
            this.m_flags.push(true);
        }
    }
    setTargets(targets: IEntityTransform[]): void {
        this.m_tars = targets;

        if (this.m_vs == null || this.m_vs.length < targets.length) {
            this.m_vs = new Array(targets.length);
            this.m_rvs = new Array(targets.length);
            for (let i = 0; i < targets.length; ++i) {
                this.m_vs[i] = CoMath.createVec3();
                this.m_rvs[i] = CoMath.createVec3();
            }
        }
    }
    getTargets(): IEntityTransform[] {
        return this.m_tars;
    }

    setCtrlScaleXYZ(sx: number, sy: number, sz: number): void {
        for (let i: number = 0; i < this.m_controllers.length; ++i) {
            this.m_flags[i] = true;
            this.m_controllers[i].setScaleXYZ(sx, sy, sz);
        }
    }

    setXYZ(px: number, py: number, pz: number): void {
    }
    setPosition(pv: IVector3D): void {

        for (let i = 0; i < this.m_controllers.length; ++i) {
            this.m_controllers[i].setPosition(pv);
            this.m_flags[i] = true;
        }
    }
    getPosition(pv: IVector3D): void {
        pv.copyFrom(this.position);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setRotation3(pr: IVector3D): void {

        // console.log("setRotationXYZ(), rx, ry, rz: ", rx, ry, rz);
        if (this.m_tars != null) {
            let tars = this.m_tars;
            if (tars.length == 1) {
                tars[0].setRotation3(pr);
                this.m_changed = true;
                return;
            }
            let r = this.m_rv;
            r.copyFrom(pr);
            console.log("setRotation3(), r: ", r);
            let mt0 = this.m_mat0;
            const vs = this.m_vs;
            const rvs = this.m_rvs;
            const cv = this.position;
            let pv = this.m_pv;
            if (tars.length > 1) {
                for (let i = 0; i < tars.length; ++i) {
                    mt0.identity();
                    mt0.setRotationEulerAngle(r.x, r.y, r.z);
                    pv.copyFrom(vs[i]);
                    mt0.transformVector3Self(pv);
                    pv.addBy(cv);
                    tars[i].setPosition(pv);
                }
            }
            let k180overPI = 180.0 / Math.PI;
            let eulerAngle = CoMath.OrientationType.EULER_ANGLES;
            for (let i = 0; i < tars.length; ++i) {
                const rv = rvs[i];
                mt0.identity();
                // mt0.setRotationEulerAngle(rv.x, rv.y, rv.z);
                // mt0.appendRotationEulerAngle(r.x, r.y, r.z);
                mt0.setRotationEulerAngle(r.x, r.y, r.z);
                let ls = mt0.decompose(eulerAngle);
                let prv = ls[1];
                prv.scaleBy(k180overPI);
                tars[i].setRotation3(prv);
                // tars[i].setRotation3(pr);
            }
            this.m_changed = true;
        }
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {

    }
    getRotationXYZ(rv: IVector3D): void {
        let tars = this.m_tars;
        if (tars.length == 1) {
            tars[0].getRotationXYZ(rv);
        } else {
            rv.setXYZ(0.0, 0.0, 0.0);
        }
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
            if (this.m_tars != null) {
                let tars = this.m_tars;
                for (let i = 0; i < tars.length; ++i) {
                    tars[i].update();
                }
            }
            this.m_changed = false;
        }
        for (let i = 0; i < this.m_controllers.length; ++i) {
            if (this.m_flags[i]) {
                this.m_flags[i] = false;
                this.m_controllers[i].update();
            }
        }
    }
    destroy(): void {
        this.m_tars = null
        this.m_controllers = null;
    }
}
export { RotatedTarget };