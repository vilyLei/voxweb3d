
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import * as Blend3VelocityMotionT from "../../vox/motion/random/Blend3VelocityMotion";
import * as MotionEntityBaseT from "./MotionEntityBase";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Blend3VelocityMotion = Blend3VelocityMotionT.vox.motion.random.Blend3VelocityMotion;
import MotionEntityBase = MotionEntityBaseT.motionDemo.fixProjMotion.MotionEntityBase;
//MotionEntityBase
export namespace motionDemo
{
    export namespace fixProjMotion
    {
        export class BlendVecMotionEntity extends MotionEntityBase
        {
            private m_mctr:Blend3VelocityMotion = null;
            private m_times:number = 0;
            constructor()
            {
                super();
            }
            initialize():void
            {
                this.m_mctr = new Blend3VelocityMotion();
                this.motionCtr = this.m_mctr;
                this.disp.getPosition(this.motionCtr);
                //this.m_mctr.initializeXOZ();
                super.initialize();
            }
            protected reset():void
            {
                this.m_sleepTime = Math.round(Math.random() * 100 + 50);
                this.m_mctr.speedRange = 5.0;
                this.m_mctr.timeSpeed = 0.01;
                this.m_mctr.speed = 3.0;
                this.m_mctr.timeBounds = 1.0;//1.5 + Math.random() * 1.5;
                this.m_mctr.initializeXOZ(this.m_times > 1);
                ++this.m_times;
            }
        }
    }
}