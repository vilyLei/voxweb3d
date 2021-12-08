import { Blend3VelocityMotion } from "../../vox/motion/random/Blend3VelocityMotion";
import { MotionEntityBase } from "./MotionEntityBase";

class BlendVecMotionEntity extends MotionEntityBase {
    private m_mctr: Blend3VelocityMotion = null;
    private m_times: number = 0;
    constructor() {
        super();
    }
    initialize(): void {
        this.m_mctr = new Blend3VelocityMotion();
        this.motionCtr = this.m_mctr;
        this.disp.getPosition(this.motionCtr);
        //this.m_mctr.initializeXOZ();
        super.initialize();
    }
    protected reset(): void {
        this.m_sleepTime = Math.round(Math.random() * 100 + 50);
        this.m_mctr.speedRange = 5.0;
        this.m_mctr.timeSpeed = 0.01;
        this.m_mctr.speed = 3.0;
        this.m_mctr.timeBounds = 1.0;//1.5 + Math.random() * 1.5;
        this.m_mctr.initializeXOZ(this.m_times > 1);
        ++this.m_times;
    }
}
export { BlendVecMotionEntity }