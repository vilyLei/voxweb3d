import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import { BaseMotion } from "../../vox/motion/base/BaseMotion";

class MotionEntityBase {
    constructor() {
    }
    pos: Vector3D = new Vector3D();
    shadowScale: number = 0.5;
    shadow: DisplayEntity = null;
    disp: DisplayEntity = null;
    motionCtr: BaseMotion = null;
    protected m_sleepTime: number = 100;
    initialize(): void {
        let s: number = this.shadowScale;
        this.shadow.setScaleXYZ(s, 1.0, s);
        this.shadow.setXYZ(this.disp.getTransform().getX(), 0.0, this.disp.getTransform().getZ());
    }
    // override by sub class
    protected reset(): void {
    }
    run(): void {
        if (this.m_sleepTime < 1) {
            this.motionCtr.run();
            this.disp.setPosition(this.motionCtr);
            this.disp.update();
            let s: number = this.motionCtr.y / 200.0;
            if (s > 1.0) {
                s = 1.0;
            }
            s = (0.3 + 0.7 * (1.0 - s)) * this.shadowScale;
            this.shadow.setScaleXYZ(s, 1.0, s);
            this.shadow.setXYZ(this.motionCtr.x, 0.0, this.motionCtr.z);
            this.shadow.update();
            if (!this.motionCtr.isMoving()) {
                this.reset();
            }
        }
        else {
            --this.m_sleepTime;
        }
    }
}
export { MotionEntityBase }