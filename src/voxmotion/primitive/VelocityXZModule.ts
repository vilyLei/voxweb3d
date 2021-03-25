/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";

import Vector3D = Vector3DT.vox.math.Vector3D;

export namespace voxmotion
{
    export namespace primitive
    {
        /**
         * velocity controller
         */
        export class VelocityXZModule
        {
            private m_speed:number = 1.0;
            private m_prevFactor:number = 0.03;
            private m_currFactor:number = 0.03;
            private m_mass:number = 1.0;
            private m_prevk:number = 1.0;
            private m_currvk:number = 0.0;
            private m_prev:Vector3D = new Vector3D(1.0,0.0,0.0,0.0);
            private m_curr:Vector3D = new Vector3D(1.0,0.0,0.0,1.0);
            spdv:Vector3D = new Vector3D(1.0,0.0,0.0,1.0);
            constructor(){}
            setSpeed(spd:number):void
            {
                this.m_speed = spd;
            }
            setFactor(prevFactor:number, currFactor:number):void
            {
                if(prevFactor > 0.9)
                {
                    prevFactor = 0.9;
                }else if(prevFactor < 0.001)
                {
                    prevFactor = 0.001;
                }
                
                if(currFactor > 0.9)
                {
                    currFactor = 0.9;
                }else if(currFactor < 0.001)
                {
                    currFactor = 0.001;
                }
                this.m_prevFactor = prevFactor;
                this.m_currFactor = currFactor;
            }
            setDirecXZ(dx:number, dz:number):void
            {
                //this.m_prev.copyFrom(this.m_curr);
                this.spdv.normalize();
                this.m_prev.copyFrom(this.spdv);
                this.m_curr.setXYZ(dx,0.0,dz);
                this.m_curr.normalize();
                this.m_prevk = 1.0;
                this.m_currvk = 0.0;
            }
            isDirecChanged():boolean
            {
                return this.m_currvk < 1.0 || this.m_prevk > 0.0;
            }
            
            updateDirecXZ(dx:number, dz:number):void
            {
                if(this.m_currvk < 1.0 || this.m_prevk > 0.0)
                {
                    this.m_curr.setXYZ(dx,0.0,dz);
                    this.m_curr.normalize();
                }
            }
            run():void
            {
                //Force make acceleration(change velocity)

                this.m_prevk = this.m_prevk > 0.0 ? this.m_prevk - this.m_prevFactor:0.0;
                this.m_currvk = this.m_currvk < 1.0 ? this.m_currvk + this.m_currFactor:1.0;
                
                this.spdv.copyFrom(this.m_prev);
                this.spdv.scaleBy(this.m_prevk);
                this.spdv.x = (this.spdv.x + this.m_curr.x * this.m_currvk);
                this.spdv.y = (this.spdv.y + this.m_curr.y * this.m_currvk);
                this.spdv.z = (this.spdv.z + this.m_curr.z * this.m_currvk);

                this.spdv.normalize();
                this.spdv.scaleBy(this.m_speed);

            }
        }
    }
}