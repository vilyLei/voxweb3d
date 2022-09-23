import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class ScaleTarget implements IEntityTransform {

    private m_controllers: IEntityTransform[] = [];
    private m_tars: IEntityTransform[] = null;
    private m_vs: IVector3D[] = [];
    private m_svs: IVector3D[] = [];
    private m_flags: boolean[] = [];
    private m_changed: boolean = false;
    private m_sv: IVector3D = CoMath.createVec3();
    private m_pv: IVector3D = CoMath.createVec3();

    private m_offsetV3 = CoMath.createVec3();
    /**
     * center
     */
    position = CoMath.createVec3();

    constructor() {
    }

    select(controller: IEntityTransform = null): void {

        let tars = this.m_tars;

        if(tars != null) {

            const vs = this.m_vs;
            const svs = this.m_svs;
    
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
                tars[i].getScaleXYZ(svs[i]);
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
            this.m_svs = new Array(targets.length);
            for (let i = 0; i < targets.length; ++i) {
                this.m_vs[i] = CoMath.createVec3();
                this.m_svs[i] = CoMath.createVec3();
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
    setRotation3(r: IVector3D): void {
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {

        if (this.m_tars != null) {

            this.m_sv.setXYZ(sx, sy, sz);
            const vs = this.m_vs;
            const svs = this.m_svs;
            const cv = this.position;
            let pv = this.m_pv;

            let tars = this.m_tars;
            if (tars.length > 1) {
                for (let i = 0; i < tars.length; ++i) {
                    pv.copyFrom(vs[i]).multBy(this.m_sv).addBy(cv);
                    tars[i].setPosition(pv);
                }
            }
            for (let i = 0; i < tars.length; ++i) {
                const sv = svs[i];
                tars[i].setScaleXYZ(sv.x * sx, sv.y * sy, sv.z * sz);
            }

            this.m_changed = true;
        }

    }
    getRotationXYZ(rv: IVector3D): void {

    }
    getScaleXYZ(sv: IVector3D): void {

        sv.setXYZ(1.0, 1.0, 1.0);
        // let tars = this.m_tars;
        // if (tars.length == 1) {
        //     tars[0].getRotationXYZ(sv);
        // }
        // else {
        //     sv.setXYZ(1.0, 1.0, 1.0);
        // }
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
export { ScaleTarget };