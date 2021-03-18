
import * as Vector3DT from "../../vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as FixPosProjYMotionT from "../../vox/motion/mcase/FixPosProjYMotion";
import * as MotionEntityBaseT from "./MotionEntityBase";

import Vector3D = Vector3DT.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import FixPosProjYMotion = FixPosProjYMotionT.vox.motion.mcase.FixPosProjYMotion;
import MotionEntityBase = MotionEntityBaseT.motionDemo.fixProjMotion.MotionEntityBase;
//MotionEntityBase
export namespace motionDemo
{
    export namespace fixProjMotion
    {
        export class ProjMotionEntity extends MotionEntityBase
        {
            private m_mctr:FixPosProjYMotion = null;
            constructor()
            {
                super();
            } 
            initialize():void
            {
                this.m_mctr = new FixPosProjYMotion();
                this.motionCtr = this.m_mctr;
                this.disp.getPosition(this.motionCtr);
                super.initialize();
            }
            protected reset():void
            {
                let px:number = Math.random() * 1000.0 - 500.0;
                let py:number = 0;
                let pz:number = Math.random() * 1000.0 - 500.0;

                this.m_sleepTime = Math.round(Math.random() * 100 + 50);
                this.m_mctr.projMaxH = 200.0 + Math.random() * 100.0;
                this.m_mctr.setDstXYZ(px,py,pz);

                //s = Vector3D.DistanceXYZ(this.motionCtr.x, this.motionCtr.y, this.motionCtr.z, px, py, pz);
                //this.motionCtr.speed = (3.0 * s)/210.0;
            }
        }
    }
}