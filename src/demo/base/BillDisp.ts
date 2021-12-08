import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import {EntityDisp} from "./EntityDisp";

class BillDisp extends EntityDisp {
    constructor() {
        super();
    }
    private m_bill: Billboard3DEntity = null;
    private m_time: number = Math.random() * 100.0;
    alphaEnabled: boolean = false;
    timeSpd: number = 0.01;
    rotSpd: number = 2.0 * Math.random() - 1.0;
    setBillboard(tar: Billboard3DEntity): void {
        this.m_bill = tar;
        super.setTarget(tar);
    }

    wake(): void {
        this.m_bill.setVisible(true);
        super.wake();
    }
    update(): void {
        if (this.m_isAwake) {
            if (this.lifeTime > 0) {
                --this.lifeTime;
                if (this.lifeTime < 1) {
                    this.m_isAwake = false;
                    this.m_bill.setVisible(false);
                }
            }
            let t: number = Math.sin(this.m_time);
            this.m_bill.setFadeFactor(t);
            this.m_bill.setRotationZ(this.m_bill.getRotationZ() + this.rotSpd);
            if (t < 0.0) {
                t = 0.0;
            }
            t = this.scale * (t + 0.1);
            this.m_bill.setScaleXY(t, t);
            this.m_time += this.timeSpd;
            super.update();
        }
    }
}
export {BillDisp}